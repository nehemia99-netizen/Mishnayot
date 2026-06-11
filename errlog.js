/* errlog.js — משנתי: לוגר שגיאות עצמי (ללא תלות חיצונית)
   לוכד window.error + unhandledrejection לתוך מאגר-טבעת ב-localStorage (עד 25 רשומות).
   auth.js מעלה את המאגר ל-Firestore (collection: errorLogs) כשמשתמש מחובר, ואז מנקה.
   בדיקה ידנית: window.__errlog.read() / window.__errlog.clear()  */
(function () {
  'use strict';
  var KEY = 'tehillim_errlog';
  var MAX = 25;

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function write(a) {
    try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {}
  }
  function ver() {
    try {
      var v = document.querySelector('.app-version, .version-note');
      return v ? (v.textContent || '').trim().slice(0, 40) : '';
    } catch (e) { return ''; }
  }
  function add(rec) {
    try {
      var a = read();
      var last = a[a.length - 1];
      // דדופ: אם השגיאה האחרונה זהה (msg+url) — רק הגדל מונה ועדכן זמן
      if (last && last.msg === rec.msg && last.url === rec.url) {
        last.n = (last.n || 1) + 1;
        last.ts = rec.ts;
        write(a);
        return;
      }
      a.push(rec);
      while (a.length > MAX) a.shift();
      write(a);
    } catch (e) {}
  }

  window.addEventListener('error', function (e) {
    add({
      kind: 'error',
      msg: String((e && e.message) || 'error').slice(0, 400),
      stack: String(
        (e && e.error && e.error.stack) ||
        ((e && e.filename || '') + ':' + (e && e.lineno || '') + ':' + (e && e.colno || ''))
      ).slice(0, 1200),
      url: location.pathname + location.search,
      ua: navigator.userAgent.slice(0, 160),
      ver: ver(),
      ts: Date.now(),
      n: 1
    });
  });

  window.addEventListener('unhandledrejection', function (e) {
    var r = e && e.reason;
    add({
      kind: 'promise',
      msg: String((r && r.message) || r || 'rejection').slice(0, 400),
      stack: String((r && r.stack) || '').slice(0, 1200),
      url: location.pathname + location.search,
      ua: navigator.userAgent.slice(0, 160),
      ver: ver(),
      ts: Date.now(),
      n: 1
    });
  });

  window.__errlog = { read: read, clear: function () { write([]); } };
})();
