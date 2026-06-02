/* ════════════════════════════════════════════════════════════
   תהילהון — Shake-to-Random Chapter (1.7.0)
   ──────────────────────────────────────────────────────────────
   זיהוי שייק במכשיר מובייל ופתיחת פרק אקראי.
   - DeviceMotion API
   - הפעלה אוטומטית במובייל בלבד; בדסקטופ — לא פעיל
   - טוגל ב-06-settings לכיבוי/הפעלה
   - דורש user gesture באייפון (iOS 13+) — אחרי לחיצה ראשונה על המסך
   ════════════════════════════════════════════════════════════ */
(function(global){
'use strict';

const SETTING_KEY = 'tehillim_settings';
const COOLDOWN_MS = 2000; // מניעת הפעלה כפולה
const SHAKE_THRESHOLD = 18; // m/s^2 — סף תאוצה לזיהוי

let lastShakeTs = 0;
let listening = false;
let lastX = null, lastY = null, lastZ = null;
let lastSampleTs = 0;

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
         (navigator.maxTouchPoints > 1 && /Mac|Win/i.test(navigator.platform));
}

function getSettings() {
  try { return JSON.parse(localStorage.getItem(SETTING_KEY)) || {}; }
  catch(e) { return {}; }
}
function setSettings(s) {
  try { localStorage.setItem(SETTING_KEY, JSON.stringify(s)); } catch(e){}
}
function isEnabled() {
  const s = getSettings();
  // ברירת מחדל: מופעל במובייל
  return s.shakeEnabled !== false;
}

function showShakeToast(msg) {
  const old = document.getElementById('_shake_toast');
  if (old) old.remove();
  const div = document.createElement('div');
  div.id = '_shake_toast';
  div.style.cssText = 'position:fixed;top:20%;left:50%;transform:translateX(-50%) scale(.8);background:rgba(0,0,0,.85);color:#fff;padding:14px 22px;border-radius:24px;font-size:15px;font-weight:600;font-family:system-ui;z-index:99998;direction:rtl;opacity:0;transition:all .3s cubic-bezier(.16,1,.3,1);box-shadow:0 8px 24px rgba(0,0,0,.4);';
  div.textContent = msg;
  document.body.appendChild(div);
  requestAnimationFrame(() => {
    div.style.opacity = '1';
    div.style.transform = 'translateX(-50%) scale(1)';
  });
  setTimeout(() => {
    div.style.opacity = '0';
    div.style.transform = 'translateX(-50%) scale(.8)';
    setTimeout(() => div.remove(), 350);
  }, 1500);
}

function triggerRandomChapter() {
  const now = Date.now();
  if (now - lastShakeTs < COOLDOWN_MS) return;
  lastShakeTs = now;
  // ויברציה קצרה אם נתמכת
  if (navigator.vibrate) {
    try { navigator.vibrate([40, 30, 40]); } catch(e){}
  }
  showShakeToast('🎲 פותח פרק אקראי...');
  setTimeout(() => {
    location.href = '03-reader.html?mode=random';
  }, 700);
}

function onMotion(e) {
  if (!isEnabled()) return;
  const acc = e.accelerationIncludingGravity || e.acceleration;
  if (!acc) return;
  const x = acc.x || 0, y = acc.y || 0, z = acc.z || 0;
  const now = Date.now();
  if (lastX !== null && (now - lastSampleTs) < 250) {
    // חישוב delta-acceleration
    const dx = Math.abs(x - lastX);
    const dy = Math.abs(y - lastY);
    const dz = Math.abs(z - lastZ);
    const total = dx + dy + dz;
    if (total > SHAKE_THRESHOLD) {
      triggerRandomChapter();
    }
  }
  lastX = x; lastY = y; lastZ = z;
  lastSampleTs = now;
}

function startListening() {
  if (listening) return;
  if (typeof DeviceMotionEvent === 'undefined') return;
  window.addEventListener('devicemotion', onMotion);
  listening = true;
}
function stopListening() {
  if (!listening) return;
  window.removeEventListener('devicemotion', onMotion);
  listening = false;
}

/* בקשת הרשאה לפי iOS 13+ */
function requestPermissionIOS() {
  if (typeof DeviceMotionEvent === 'undefined') return Promise.resolve('not-supported');
  if (typeof DeviceMotionEvent.requestPermission !== 'function') {
    // אנדרואיד / iOS ישן — לא צריך הרשאה מפורשת
    return Promise.resolve('granted');
  }
  return DeviceMotionEvent.requestPermission()
    .then(result => result)
    .catch(() => 'denied');
}

/* התחל מאזין רק אחרי user gesture ראשון (חשוב ל-iOS) */
function initOnFirstGesture() {
  if (!isMobile()) return;
  if (!isEnabled()) return;
  const handler = function() {
    requestPermissionIOS().then(res => {
      if (res === 'granted') startListening();
    });
    document.removeEventListener('touchstart', handler, true);
    document.removeEventListener('click', handler, true);
  };
  document.addEventListener('touchstart', handler, true);
  document.addEventListener('click', handler, true);
}

/* API חיצוני */
global.TehillonShake = {
  isMobile,
  isEnabled,
  enable() {
    const s = getSettings();
    s.shakeEnabled = true;
    setSettings(s);
    if (isMobile()) requestPermissionIOS().then(res => { if (res === 'granted') startListening(); });
  },
  disable() {
    const s = getSettings();
    s.shakeEnabled = false;
    setSettings(s);
    stopListening();
  },
  test() {
    // לבדיקה ידנית מההגדרות
    triggerRandomChapter();
  }
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initOnFirstGesture();
} else {
  document.addEventListener('DOMContentLoaded', initOnFirstGesture);
}
})(window);
