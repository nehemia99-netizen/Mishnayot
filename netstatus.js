/* netstatus.js — משנתי: פס קטן "אין חיבור לאינטרנט" כשהמכשיר אופליין (1.5.132).
   הקריאה עצמה ממשיכה לעבוד מהמטמון ומחבילת הטקסט המקומית; הפס רק מסביר למה
   קהילה / קבוצות / הקראה בקול ענן / פירוש שלא נשמר לא זמינים כרגע. */
(function () {
  'use strict';
  var en = false;
  try { en = JSON.parse(localStorage.getItem('tehillim_settings') || '{}').lang === 'en'; } catch (e) {}
  var bar;
  function show() {
    if (bar) return;
    bar = document.createElement('div');
    bar.id = 'netOfflineBar';
    bar.setAttribute('role', 'status');
    bar.textContent = en
      ? '📴 No internet connection — learning works offline; community and sync will resume when you reconnect'
      : '📴 אין חיבור לאינטרנט — הלימוד ממשיך לעבוד; קהילה וסנכרון יחזרו כשהחיבור יחזור';
    bar.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;background:#5B5B5B;color:#fff;' +
      'font:600 12px/1.4 system-ui,sans-serif;text-align:center;padding:5px 10px;padding-top:calc(5px + env(safe-area-inset-top));' +
      'direction:' + (en ? 'ltr' : 'rtl') + ';box-shadow:0 1px 4px rgba(0,0,0,.25);';
    bar.title = en ? 'Tap to hide' : 'הקשה מסתירה';
    bar.onclick = hide;   // לא לחסום כפתורים בכותרת אם המשתמש רוצה להגיע אליהם
    (document.body || document.documentElement).appendChild(bar);
  }
  function hide() { if (bar) { bar.remove(); bar = null; } }
  function sync() { if (navigator.onLine === false) show(); else hide(); }
  window.addEventListener('offline', show);
  window.addEventListener('online', hide);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sync); else sync();
})();
