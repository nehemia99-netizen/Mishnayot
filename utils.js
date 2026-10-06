/* ════════════════════════════════════════════════════════════
   תהילהון — utils.js
   נוצר: 2.2.0 (28.5.2026)
   ──────────────────────────────────────────────────────────────
   ספריית עזר משותפת לכל קבצי האפליקציה.
   נטען לפני כל script אחר, לפני gamification.js ולפני auth.js.

   שימוש:
     TH.S.get('key')           ← קרא מ-localStorage
     TH.S.set('key', value)    ← שמור ל-localStorage
     TH.S.remove('key')        ← מחק מ-localStorage
     TH.today()                ← '2026-05-28' (ISO date)
     TH.numToGem(150)          ← 'קנ׳'
     TH.yearToGem(5786)        ← 'התשפ"ו'

   מדיניות אי-קונפליקט:
     utils.js משתמש ב-namespace  window.TH  בלבד.
     הוא לא מכריז על S / today / numToGem גלובלית,
     כך שקבצי HTML שכבר מגדירים  const S = {...}
     ממשיכים לעבוד ללא שינוי.

   מיגרציה הדרגתית:
     קובץ שרוצה להפסיק להגדיר S מחדש יוסיף אחרי ה-build:
       const S = TH.S;
     ויסיר את הגדרת ה-S המקומית.
   ════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  /* ── namespace ──────────────────────────────────────────── */
  global.TH = global.TH || {};

  /* ── S: עוטף localStorage ──────────────────────────────── */
  /*
     get  → מחזיר אובייקט/מערך/מחרוזת, או null אם המפתח לא קיים / JSON שבור
     set  → שומר כ-JSON (גם null / false / 0 שמורים נכון)
     remove → מוחק את המפתח
  */
  TH.S = {
    get:    function (k) {
      try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; }
    },
    set:    function (k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
    },
    remove: function (k) {
      try { localStorage.removeItem(k); } catch (e) {}
    }
  };

  /* ── today: תאריך ISO היום ──────────────────────────────── */
  /*
     מחזיר מחרוזת בפורמט  'YYYY-MM-DD'  (UTC+0).
     לשימוש כמפתח ביומן קריאה / אתגרים / streak.
     שים לב: מחשב לפי UTC, לא שעון מקומי.
     אם חשוב שעון מקומי — השתמש ב-TH.todayLocal().
  */
  TH.today = function () {
    return localDateStr();
  };

  /* ── todayLocal: תאריך לפי שעון המכשיר ──────────────────── */
  TH.todayLocal = function () {
    var d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  };

  /* ── numToGem: מספר → גימטריה עברית ────────────────────── */
  /*
     דוגמאות:
       numToGem(1)   → 'א׳'
       numToGem(15)  → 'ט"ו'   (חריג — לא יה)
       numToGem(150) → 'קנ׳'
       numToGem(400) → 'ת׳'
       numToGem(574) → 'תקע"ד'
     מחזיר '' לערכים <= 0 או NaN.
  */
  TH.numToGem = function (n) {
    n = parseInt(n, 10);
    if (!n || n <= 0) return '';
    var sp = { 15: 'ט"ו', 16: 'ט"ז', 115: 'קט"ו', 116: 'קט"ז' };
    if (sp[n]) return sp[n];
    var h = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
    var t = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
    var c = ['', 'ק', 'ר', 'ש', 'ת'];
    var r = '', x = n;
    while (x >= 400) { r += 'ת'; x -= 400; }
    if (x >= 100) { r += c[Math.floor(x / 100)]; x %= 100; }
    if (x >= 10)  { r += t[Math.floor(x / 10)];  x %= 10; }
    r += h[x];
    if (r.length === 0) return '';
    return r.length === 1 ? r + '׳' : r.slice(0, -1) + '"' + r.slice(-1);
  };

  /* ── yearToGem: שנה עברית → אותיות + ה׳ ────────────────── */
  /*
     yearToGem(5786) → 'התשפ"ו'
     yearToGem(5800) → 'התת'   (לאחרי תת"ק)
  */
  TH.yearToGem = function (y) {
    return 'ה' + TH.numToGem(y % 1000);
  };

  /* ── formatDate: תאריך ISO → תצוגה קריאה ──────────────── */
  /*
     TH.formatDate('2026-05-28')  → '28.5.2026'
     TH.formatDate('2026-05-28', true) → '28/5'   (קצר)
  */
  TH.formatDate = function (iso, short) {
    if (!iso || iso.length < 10) return iso || '';
    var parts = iso.split('-');
    var y = parts[0], m = String(parseInt(parts[1], 10)), d = String(parseInt(parts[2], 10));
    return short ? (d + '/' + m) : (d + '.' + m + '.' + y);
  };

  /* ── clamp: הגבל מספר לטווח ────────────────────────────── */
  TH.clamp = function (val, min, max) {
    return Math.min(Math.max(val, min), max);
  };

  /* ── log: console.log עם prefix ─────────────────────────── */
  TH.log = function () {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('[Tehilhon]');
    console.log.apply(console, args);
  };

  /* ── localDateStr: תאריך לפי שעון המכשיר (לא UTC) ─────────
     new Date().toISOString() תמיד מחזיר UTC — גורם ליום להתאפס
     ב-21:00 בישראל (בקיץ). פונקציה זו משתמשת בשעון המקומי.
     שימוש: localDateStr()         → היום (YYYY-MM-DD)
             localDateStr(someDate) → תאריך מקומי של אובייקט Date
  ── */
  TH.localDateStr = function (d) {
    var date = d || new Date();
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  };

  /* ── esc: טקסט ממשתמשים אחרים (שמות בלוח/קבוצה) לפני innerHTML ──
     1.5.132: שמות מ-Firestore הוכנסו ל-innerHTML כמו שהם — "שם" עם תגית HTML היה רץ אצל כל מי שפותח את הקהילה. */
  TH.esc = function (v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* ── שם בלוח המובילים (1.5.132) ─────────────────────────────
     1. כינוי שהמשתמש בחר (settings.username) — תמיד גובר.
     2. מחובר Google בלי כינוי → ראשי תיבות בלבד: "נחמיה כהן" → "נ.כ." (לא חושפים שם מלא בלי בחירה).
     3. אחרת → "לומד משניות 4821" (מספר קבוע לכל משתמש, נגזר מהמזהה שלו). */
  TH.nameInitials = function (full) {
    var w = String(full || '').trim().split(/\s+/).filter(Boolean);
    if (!w.length) return '';
    if (w.length === 1) return w[0].charAt(0) + '.';
    return w[0].charAt(0) + '.' + w[w.length - 1].charAt(0) + '.';
  };
  TH.anonReaderName = function (uid) {
    var s = String(uid || ''), h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    var en = false;
    try { en = (JSON.parse(localStorage.getItem('tehillim_settings') || '{}').lang === 'en'); } catch (e) {}
    return (en ? 'Mishnah learner ' : 'לומד משניות ') + (1000 + (s ? h % 9000 : Math.floor(Math.random() * 9000)));
  };
  /* שם ברירת המחדל (בלי הכינוי) — להצעה בחלון "איך להציג אותך?" ובהגדרות */
  TH.lbDefaultName = function () {
    var g = TH.S.get('tehillim_google_user');
    var ini = g && g.name ? TH.nameInitials(g.name) : '';
    if (!ini && g && g.displayName) ini = TH.nameInitials(g.displayName);
    return ini || TH.anonReaderName(TH.S.get('tehillim_uid'));
  };
  TH.lbDisplayName = function () {
    var s = TH.S.get('tehillim_settings') || {};
    var u = String(s.username || '').trim();
    return u || TH.lbDefaultName();
  };

  /* קיצור גלובלי — נגיש מכל קובץ אחרי טעינת utils.js */
  window.localDateStr = TH.localDateStr;

})(window);
