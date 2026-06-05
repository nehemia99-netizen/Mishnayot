/* ═══════════════════════════════════════════════════════
   משניון — Push לקוח (FCM)
   דורש: firebase-messaging-sw.js בשורש + VAPID key (להלן)
   API: window.AppPush.enable() / .disable() / .isSupported() / .isOn()
   ═══════════════════════════════════════════════════════ */
(function (global) {
  'use strict';
  const V = '10.12.0';
  const VAPID_KEY = 'BG3Br29m3xhNim3SZjvmt6NHW9q2gHGpNo7CwL7NLja6NDI1qiO_3L8drFHu8ECskPNKGHV1qDjf525N6p0Ptjw';
  const FB_CFG = {
    apiKey: "AIzaSyB413Gtcwy5DcQHK4yXb1egMhUEwjJ0jhA", authDomain: "mishnayot-71073.firebaseapp.com", projectId: "mishnayot-71073",
    storageBucket: "mishnayot-71073.firebasestorage.app", messagingSenderId: "445059664136", appId: "1:445059664136:web:fec8a4f338fd326d3b04bd"
  };
  const FLAG = 'mishnayon_push_on';
  const murl = n => `https://www.gstatic.com/firebasejs/${V}/firebase-${n}.js`;

  async function _app() {
    const { initializeApp, getApps } = await import(murl('app'));
    return getApps().length ? getApps()[0] : initializeApp(FB_CFG);
  }
  async function _uid() {
    const app = await _app();
    const { getAuth, onAuthStateChanged, signInAnonymously } = await import(murl('auth'));
    const auth = getAuth(app);
    if (auth.currentUser) return auth.currentUser.uid;
    return new Promise(res => {
      onAuthStateChanged(auth, async u => {
        if (u) return res(u.uid);
        try { const c = await signInAnonymously(auth); res(c.user.uid); } catch (e) { res(null); }
      });
    });
  }
  async function isSupported() {
    try { const { isSupported } = await import(murl('messaging')); return await isSupported(); }
    catch (e) { return false; }
  }
  function isOn() { return localStorage.getItem(FLAG) === '1'; }

  async function enable() {
    if (!('Notification' in window)) return { ok: false, reason: 'unsupported' };
    if (!(await isSupported()))    return { ok: false, reason: 'unsupported' };
    const perm = await Notification.requestPermission();
    if (perm !== 'granted')        return { ok: false, reason: 'denied' };
    const app = await _app();
    const { getMessaging, getToken, onMessage } = await import(murl('messaging'));
    const messaging = getMessaging(app);
    let token;
    try { token = await getToken(messaging, { vapidKey: VAPID_KEY }); }
    catch (e) { return { ok: false, reason: 'token-error', err: String(e) }; }
    if (!token) return { ok: false, reason: 'no-token' };
    const uid = await _uid();
    if (uid) {
      try {
        const { getFirestore, doc, setDoc } = await import(murl('firestore'));
        const s = JSON.parse(localStorage.getItem('tehillim_settings') || '{}');
        await setDoc(doc(getFirestore(app), 'pushTokens', uid), {
          token, lang: s.lang || 'he',
          remTime: s.remTime || s.reminderTime || '20:00',
          platform: (navigator.userAgent || '').slice(0, 120),
          updatedAt: Date.now()
        }, { merge: true });
      } catch (e) { /* שמירה best-effort */ }
    }
    onMessage(messaging, payload => {
      const d = (payload && (payload.data || payload.notification)) || {};
      if (typeof showToast === 'function') showToast('🔔 ' + (d.title || '') + (d.body ? ' — ' + d.body : ''));
    });
    localStorage.setItem(FLAG, '1');
    return { ok: true, token };
  }

  async function disable() {
    localStorage.removeItem(FLAG);
    try {
      const app = await _app();
      const { getMessaging, deleteToken } = await import(murl('messaging'));
      await deleteToken(getMessaging(app));
    } catch (e) {}
    try {
      const uid = await _uid();
      if (uid) { const { getFirestore, doc, deleteDoc } = await import(murl('firestore')); await deleteDoc(doc(getFirestore(await _app()), 'pushTokens', uid)); }
    } catch (e) {}
    return { ok: true };
  }

  global.AppPush = { enable, disable, isSupported, isOn };
})(window);
