/* ════════════════════════════════════════════════════════════
   משנתי — מודול תזכורות (Notifications) v2.2.50
   ──────────────────────────────────────────────────────────────
   שולח דרך Service Worker (תומך בנייד/Android Chrome)
   ════════════════════════════════════════════════════════════ */
(function(global){
'use strict';

const LIBRARY = [
  { title:'משנתי — זמן ללמוד משנה', body:'"וְשִׁנַּנְתָּם לְבָנֶיךָ" — בוא נלמד משנה' },
  { title:'משנתי — דקה למשנה?', body:'אפילו משנה אחת ביום עושה את ההבדל. לחץ כדי להתחיל' },
  { title:'🕯️ משנתי', body:'"משנה" אותיות "נשמה" — דקה אחת של לימוד, בקלות' },
  { title:'📖 הזמן הוא עכשיו', body:'"הָפֵךְ בָּהּ וַהֲפֵךְ בָּהּ דְּכֹלָּא בָהּ" (אבות ה׳)' },
  { title:'⭐ הרצף שלך מחכה', body:'אל תשבור את הרצף — למד משנה קצרה עכשיו' },
  { title:'🎯 אתגר היום מחכה', body:'יש לך אתגר פעיל — בוא נשלים אותו' },
  { title:'🙏 רגע של לימוד', body:'"וְלֹא הַמִּדְרָשׁ הוּא הָעִקָּר אֶלָּא הַמַּעֲשֶׂה" (אבות א׳)' },
  { title:'📜 פתח משנה אקראית', body:'תן לקב"ה להפתיע אותך עם המשנה המתאימה לרגע' }
];

const KEY = 'tehillim_notifications';
const SETTINGS_KEY = 'tehillim_settings';

function load() {
  let d;
  try { d = JSON.parse(localStorage.getItem(KEY)); } catch(e){ d = null; }
  if (!d || typeof d !== 'object') d = { lastDailySent:'', lastHourlySent:0 };
  return d;
}
function save(d) {
  try { localStorage.setItem(KEY, JSON.stringify(d)); } catch(e){}
}
function settings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch(e){ return {}; }
}
function today() { return localDateStr(); }
function randomMsg() { return LIBRARY[Math.floor(Math.random()*LIBRARY.length)]; }

/* ─── חלון שבת: ערב שבת (שישי מ-16:00) עד מוצ"ש (שבת עד 21:00) ─── */
function inShabbatWindow(now) {
  now = now || new Date();
  const day = now.getDay(), h = now.getHours();
  if (day === 5) return h >= 16;  // שישי אחה"צ — ערב שבת
  if (day === 6) return h < 21;   // שבת — עד הלילה (מוצ"ש)
  return false;
}
function shabbatSilenced() {
  // ברירת מחדל: השתקה בשבת (true), אלא אם המשתמש ביטל מפורשות (=== false)
  try { return settings().noShabbatNotif !== false && inShabbatWindow(); } catch(e){ return false; }
}

/* ─── הצגת notification — דרך SW (תומך נייד) ─── */
async function show(title, body, opts) {
  opts = opts || {};
  if (!('Notification' in window)) return false;
  if (Notification.permission !== 'granted') return false;
  // השתקה בשבת (למי שסימן בהגדרות) — דלג על תזכורות בערב שבת ובשבת
  if (shabbatSilenced()) return false;

  // נסה דרך Service Worker קודם (עובד בנייד)
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, {
        body: body,
        icon: 'icons/icon-192.png',
        badge: 'icons/icon-96.png',
        tag: opts.tag || 'tehillahon',
        dir: 'rtl',
        lang: 'he',
        requireInteraction: !!opts.requireInteraction,
        silent: false,
        data: { url: opts.url || '01-dashboard.html' }
      });
      return true;
    } catch(e) {
      console.warn('[notif] SW showNotification failed:', e);
    }
  }

  // fallback — new Notification (עובד בדסקטופ)
  try {
    const n = new Notification(title, {
      body: body,
      icon: 'icons/icon-192.png',
      tag: opts.tag || 'tehillahon',
      dir: 'rtl',
      lang: 'he',
      requireInteraction: !!opts.requireInteraction,
      silent: false
    });
    n.onclick = () => {
      window.focus();
      location.href = opts.url || '01-dashboard.html';
      n.close();
    };
    return true;
  } catch(e) {
    console.warn('[notif] Notification fallback failed:', e);
    return false;
  }
}

/* ─── בקשת הרשאה ─── */
async function requestPermission() {
  if (!('Notification' in window)) {
    return { ok:false, reason:'unsupported', msg:'הדפדפן הזה לא תומך בהתראות' };
  }
  if (Notification.permission === 'granted') return { ok:true };
  if (Notification.permission === 'denied') {
    return { ok:false, reason:'denied', msg:'ההתראות חסומות בדפדפן. יש להפעיל אותן בהגדרות הדפדפן' };
  }
  try {
    const result = await Notification.requestPermission();
    return result === 'granted' ? { ok:true } : { ok:false, reason:'declined', msg:'לא אישרת התראות' };
  } catch(e) {
    return { ok:false, reason:'error', msg:e.message };
  }
}

/* ─── בדיקה בטעינת הדף — תזכורת יומית ─── */
function checkDailyOnLoad() {
  const s = settings();
  if (!s.reminderOn) return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const state = load();
  const t = today();
  if (state.lastDailySent === t) return;

  const targetTime = s.remTime || s.reminderTime || '20:00';
  const [hh, mm] = targetTime.split(':').map(n => parseInt(n)||0);
  const now = new Date();
  const target = new Date();
  target.setHours(hh, mm, 0, 0);

  if (now >= target) {
    const m = randomMsg();
    show(m.title, m.body, { tag:'daily', requireInteraction:true }).then(ok => {
      if (ok) { state.lastDailySent = t; save(state); }
    });
  } else {
    const ms = target - now;
    if (ms > 0 && ms < 24 * 3600 * 1000) {
      setTimeout(() => {
        const m = randomMsg();
        show(m.title, m.body, { tag:'daily', requireInteraction:true }).then(ok => {
          if (ok) { const st = load(); st.lastDailySent = today(); save(st); }
        });
      }, ms);
    }
  }
}

/* ─── תזכורות שעתיות ─── */
let _hourlyTimer = null;
function startHourlyTimer() {
  if (_hourlyTimer) { clearInterval(_hourlyTimer); _hourlyTimer = null; }
  const s = settings();
  if (!s.hourlyRem) return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const intervalHours = Math.max(1, s.hourlyInterval || 1);
  const intervalMs = intervalHours * 60 * 60 * 1000;
  const state = load();
  const now = Date.now();

  if (!state.lastHourlySent || (now - state.lastHourlySent) >= intervalMs) {
    const m = randomMsg();
    show(m.title, m.body, { tag:'hourly' }).then(ok => {
      if (ok) { state.lastHourlySent = now; save(state); }
    });
  }

  _hourlyTimer = setInterval(() => {
    const m = randomMsg();
    show(m.title, m.body, { tag:'hourly' }).then(ok => {
      if (ok) { const st = load(); st.lastHourlySent = Date.now(); save(st); }
    });
  }, intervalMs);
}

function stopHourlyTimer() {
  if (_hourlyTimer) { clearInterval(_hourlyTimer); _hourlyTimer = null; }
}

/* ─── תזכורת בדיקה ─── */
async function sendTestNotification() {
  if (!('Notification' in window)) {
    alert('❌ הדפדפן לא תומך בהתראות');
    return false;
  }
  const perm = Notification.permission;
  if (perm !== 'granted') {
    alert('❌ הרשאה: ' + perm + '\nיש לאשר התראות בהגדרות הדפדפן');
    return false;
  }
  const hasSW = 'serviceWorker' in navigator;
  if (!hasSW) {
    alert('❌ אין Service Worker בדפדפן זה');
    return false;
  }
  try {
    const reg = await navigator.serviceWorker.ready;
    alert('✅ SW מוכן: ' + (reg.active ? reg.active.scriptURL : 'לא פעיל') + '\nשולח התראה...');
    await reg.showNotification('🔔 בדיקת תזכורת', {
      body: 'אם אתה רואה זאת מחוץ לאפליקציה — עובד!',
      icon: 'icons/icon-192.png',
      tag: 'test',
      dir: 'rtl'
    });
    return true;
  } catch(e) {
    alert('❌ שגיאה: ' + e.message);
    return false;
  }
}

/* ─── אתחול ─── */
function init() {
  if (document.readyState !== 'loading') {
    setTimeout(initInternal, 100);
  } else {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initInternal, 100));
  }
}

function initInternal() {
  checkDailyOnLoad();
  startHourlyTimer();
  // בדוק שוב כשהמשתמש חוזר לאפליקציה (לאחר מעבר לאפליקציה אחרת)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkDailyOnLoad();
    }
  });
}

/* ─── חשיפה גלובלית ─── */
global.TehillonNotif = {
  show,
  requestPermission,
  checkDailyOnLoad,
  startHourlyTimer,
  stopHourlyTimer,
  sendTestNotification,
  LIBRARY,
  init,
  hasPermission: () => 'Notification' in window && Notification.permission === 'granted',
  isSupported: () => 'Notification' in window
};

init();
})(window);
