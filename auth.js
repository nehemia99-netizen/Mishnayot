/**
 * auth.js — תהילהון v2.2.26
 * Google Login + Anonymous Auth + סנכרון Firestore
 * נטען בכל דפי האפליקציה כ-module
 */

import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import {
  getAuth,
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

/* ── Firebase config ── */
const FB_CFG = {
  apiKey:            "AIzaSyB413Gtcwy5DcQHK4yXb1egMhUEwjJ0jhA",
  authDomain:        "mishnayot-71073.firebaseapp.com",
  projectId:         "mishnayot-71073",
  storageBucket:     "mishnayot-71073.firebasestorage.app",
  messagingSenderId: "445059664136",
  appId:             "1:445059664136:web:fec8a4f338fd326d3b04bd"
};

/* ── Singleton: מונע אתחול כפול בין דפים ── */
const _app  = getApps().length ? getApp() : initializeApp(FB_CFG);
const _db   = getFirestore(_app);
const _auth = getAuth(_app);

export const db   = _db;
export const auth = _auth;

/* ── LocalStorage helper ── */
const S = {
  get: k => { try { return JSON.parse(localStorage.getItem(k)); } catch(e) { return null; } },
  set: (k,v) => localStorage.setItem(k, JSON.stringify(v)),
  remove: k => localStorage.removeItem(k)
};

/* ════════════════════════════════════════════
   KEYS שמסנכרנים ל-Firestore
   (cache ו-pending_toast לא מסונכרנים — זמניים)
════════════════════════════════════════════ */
const SYNC_KEYS = [
  'tehillim_score',
  'tehillim_readings',
  'tehillim_reading',
  'tehillim_settings',
  'tehillim_yizkor',
  'tehillim_gamification',
  'tehillim_badges',
  'tehillim_medals_earned',
  'tehillim_favs',
  'tehillim_mems',
  'tehillim_saved_verses',
  'tehillim_visits',
  'tehillim_groups_v2',
  'tehillim_streak',
  'tehillim_lastRead',
];

/* ════════════════════════════════════════════
   UPLOAD — שמור localStorage → Firestore
════════════════════════════════════════════ */
export async function uploadToCloud(uid) {
  if (!uid) return;
  const data = {};
  SYNC_KEYS.forEach(k => {
    const val = S.get(k);
    if (val !== null) data[k] = val;
  });
  data._lastSync  = Date.now();
  data._device    = navigator.userAgent.slice(0, 80);
  try {
    await setDoc(doc(db, 'users', uid), data, { merge: true });
    console.log('✅ Uploaded to Firestore');
  } catch(e) {
    console.warn('Upload failed:', e.code);
  }
}

/* ════════════════════════════════════════════
   DOWNLOAD — שחזר Firestore → localStorage
════════════════════════════════════════════ */
export async function downloadFromCloud(uid) {
  if (!uid) return false;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return false;
    const data = snap.data();
    let restored = 0;
    SYNC_KEYS.forEach(k => {
      if (data[k] !== undefined) {
        // מיזוג חכם: אם יש נתון מקומי חדש יותר — שמור את המקומי
        const local = S.get(k);
        const cloud = data[k];
        // לציון: השווה רק אם שניהם קיימים
        if (local && cloud && k === 'tehillim_score') {
          // קח את הגבוה יותר
          const merged = mergeScore(local, cloud);
          S.set(k, merged);
        } else if (k === 'tehillim_settings') {
          // מזג: ענן כבסיס, אבל העדפות מקומיות גוברות תמיד
          const merged = Object.assign({}, cloud, local || {});
          // leaderboard: המקומי תמיד מנצח
          if (local && local.leaderboard === false) {
            merged.leaderboard = false;
          } else {
            merged.leaderboard = true;
          }
          // reminderOn: אם המשתמש הגדיר מקומית — כבד את זה
          if (local && local.reminderOn !== undefined) merged.reminderOn = local.reminderOn;
          // remTime: שעת תזכורת מקומית גוברת
          if (local && local.remTime !== undefined) merged.remTime = local.remTime;
          if (local && local.username !== undefined) merged.username = local.username;
          S.set(k, merged);
        } else if (cloud !== null) {
          S.set(k, cloud);
        }
        restored++;
      }
    });
    console.log('✅ Downloaded from Firestore, restored:', restored, 'keys');
    return true;
  } catch(e) {
    console.warn('Download failed:', e.code);
    return false;
  }
}

/* מיזוג ציונים — קח את הגבוה בכל שדה */
function mergeScore(local, cloud) {
  return {
    total:     Math.max(local.total    || 0, cloud.total    || 0),
    today:     Math.max(local.today    || 0, cloud.today    || 0),
    todayDate: local.todayDate || cloud.todayDate || '',
    daily:     mergeDailyScores(local.daily || {}, cloud.daily || {})
  };
}
function mergeDailyScores(a, b) {
  const merged = { ...a };
  Object.keys(b).forEach(date => {
    merged[date] = Math.max(merged[date] || 0, b[date] || 0);
  });
  return merged;
}

/* ════════════════════════════════════════════
   GOOGLE SIGN-IN
════════════════════════════════════════════ */
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  try {
    let result;
    // 2.2.12: תמיד signInWithPopup — linkWithPopup גורם לפופאפ כפול בגלל COOP
    // הנתונים המקומיים נשמרים ב-localStorage ומסונכרנים אחרי ההתחברות
    result = await signInWithPopup(auth, provider);

    const user = result.user;
    S.set('tehillim_uid', user.uid);
    S.set('tehillim_google_user', {
      uid:   user.uid,
      name:  user.displayName,
      email: user.email,
      photo: user.photoURL
    });

    // הורד נתונים מהענן ומזג עם המקומי
    const hadCloudData = await downloadFromCloud(user.uid);

    // וודא leaderboard=true אחרי download (המקומי מנצח — רק undefined מקבל ברירת מחדל)
    const settings = S.get('tehillim_settings') || {};
    if (settings.leaderboard !== false) {
      settings.leaderboard = true;
      S.set('tehillim_settings', settings);
    }
    // עדכן את המתג בעמוד הגדרות אם פתוח
    try {
      const tL = document.getElementById('tLeader');
      if (tL) {
        if (settings.leaderboard !== false) {
          tL.classList.add('on');
          const uW = document.getElementById('usernameWrap');
          if (uW) uW.style.display = 'block';
          if (settings.username) {
            const uI = document.getElementById('usernameInput');
            if (uI) uI.value = settings.username;
          }
        } else {
          tL.classList.remove('on');
        }
      }
    } catch(e) {}

    // העלה את הנתונים המקומיים המעודכנים
    await uploadToCloud(user.uid);

    return { user, hadCloudData };

  } catch(e) {
    if (e.code === 'auth/popup-closed-by-user') return null;
    if (e.code === 'auth/popup-blocked') {
      throw new Error('popup-blocked');
    }
    throw e;
  }
}

/* ════════════════════════════════════════════
   SIGN OUT
════════════════════════════════════════════ */
export async function signOutUser() {
  const uid = auth.currentUser?.uid;
  if (uid) await uploadToCloud(uid); // שמור לפני יציאה
  await signOut(auth);
  S.remove('tehillim_google_user');
  console.log('✅ Signed out');
}

/* ════════════════════════════════════════════
   INIT AUTH — נקרא מכל דף
════════════════════════════════════════════ */
export async function initAuth() {
  return new Promise(resolve => {
    const unsub = onAuthStateChanged(auth, async user => {
      unsub(); // הפעל רק פעם אחת

      if (user) {
        // משתמש כבר מחובר (Google או אנונימי)
        S.set('tehillim_uid', user.uid);
        if (!user.isAnonymous) {
          // Google user — הורד נתונים אם זו כניסה ראשונה במכשיר זה
          const localScore = S.get('tehillim_score');
          if (!localScore || !localScore.total) {
            await downloadFromCloud(user.uid);
          }
        }
        resolve(user);
      } else {
        // אין משתמש — כניסה אנונימית
        try {
          const cred = await signInAnonymously(auth);
          S.set('tehillim_uid', cred.user.uid);
          resolve(cred.user);
        } catch(e) {
          console.warn('Anonymous auth failed:', e.code);
          // fallback: ID מקומי
          let uid = S.get('tehillim_uid');
          if (!uid) {
            uid = 'local_' + Math.random().toString(36).slice(2,9) + Date.now().toString(36);
            S.set('tehillim_uid', uid);
          }
          resolve({ uid, isAnonymous: true, isLocal: true });
        }
      }
    });
  });
}

/* ════════════════════════════════════════════
   AUTO-SAVE — שמור לענן כל 5 דקות + בסגירת דף
════════════════════════════════════════════ */
export function startAutoSync() {
  const uid = auth.currentUser?.uid;
  if (!uid || auth.currentUser?.isAnonymous) return; // רק ל-Google users

  // שמור כל 5 דקות
  const interval = setInterval(() => uploadToCloud(uid), 5 * 60 * 1000);

  // שמור בסגירת דף
  window.addEventListener('beforeunload', () => uploadToCloud(uid));
  window.addEventListener('pagehide',     () => uploadToCloud(uid));

  return interval;
}

/* ════════════════════════════════════════════
   CURRENT USER INFO
════════════════════════════════════════════ */
export function getCurrentUser() {
  return auth.currentUser;
}

export function isGoogleUser() {
  const u = auth.currentUser;
  return u && !u.isAnonymous;
}

export function getGoogleUserInfo() {
  return S.get('tehillim_google_user');
}
