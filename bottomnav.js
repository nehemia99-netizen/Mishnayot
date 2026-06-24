/* ════════════════════════════════════════════════════════════
   תהילהון — Bottom Navigation Bar
   נוצר: 2.2.0 (28.5.2026)
   ──────────────────────────────────────────────────────────────
   מציג פס ניווט תחתון רק למשתמש במוד מלא (לא simpleMode).
   לא מוצג ב-05-yizkor — תהליך ממוקד עם כפתורי ניווט משלו.
   בקורא (03-reader) מוצג, אך ה-padding מוסף ל-.bottombar ולא ל-body.

   שימוש: <script src="bottomnav.js?v=1.5.75"></script>
   אין צורך בשום קוד נוסף — הסקריפט מזריק את כל מה שצריך.
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── בדיקות מוקדמות — אם אחת מתקיימת, לא מציגים ────────── */
  try {
    var s = JSON.parse(localStorage.getItem('tehillim_settings') || '{}');
    if (s.simpleMode !== false) return;
  } catch (e) { return; }

  /* לא באזכרה — כפתורי הניווט מסתתרים מאחורי הפס */
  if (location.pathname.indexOf('05-yizkor') !== -1) return;

  /* ── שפה ──────────────────────────────────────────────────── */
  var _bnavLang = (function() {
    try { return JSON.parse(localStorage.getItem('tehillim_settings') || '{}').lang || 'he'; } catch(e) { return 'he'; }
  })();

  /* ── קביעת הכרטיסייה הפעילה ─────────────────────────────── */
  var path = location.pathname + location.search;

  function _isActive(id) {
    if (id === 'home')      return path.indexOf('01-dashboard') !== -1 || path === '/' || /\/$/.test(path) || path.indexOf('index') !== -1;
    if (id === 'favs')      return path.indexOf('02-selection') !== -1;
    if (id === 'blessings') return path.indexOf('blessings') !== -1;
    if (id === 'community') return path.indexOf('07-community') !== -1 || path.indexOf('08-group') !== -1;
    if (id === 'settings')  return path.indexOf('06-settings') !== -1;
    return false;
  }

  /* ── קהילה: תמיד → עמוד הקהילה הראשי ── */
  function _communityHref() {
    return '07-community.html';
  }

  /* ── הגדרת הכרטיסיות ────────────────────────────────────── */
  var _en = _bnavLang === 'en';
  var TABS = [
    { id: 'home',      icon: '🏠', label: _en ? 'Home'      : 'בית',      href: '01-dashboard.html' },
    { id: 'favs',      icon: '❤️', label: _en ? 'Favorites' : 'מועדפים',  href: '02-selection.html?tab=3' },
    { id: 'blessings', icon: '🙏', label: _en ? 'Blessings' : 'ברכות',    href: 'blessings.html' },
    { id: 'community', icon: '👥', label: _en ? 'Community' : 'קהילה',    href: _communityHref() },
    { id: 'settings',  icon: '⚙️', label: _en ? 'Settings'  : 'הגדרות',  href: '06-settings.html' }
  ];

  /* ── CSS ─────────────────────────────────────────────────── */
  var CSS = [
    '#_bnav {',
    '  position: fixed;',
    '  bottom: 0; left: 0; right: 0;',
    '  z-index: 500;',
    '  display: flex;',
    '  justify-content: space-around;',
    '  align-items: stretch;',
    '  background: var(--card, #fff);',
    '  border-top: 0.5px solid var(--border, rgba(0,0,0,.12));',
    '  padding-bottom: env(safe-area-inset-bottom, 0px);',
    '  direction: rtl;',
    '  -webkit-backdrop-filter: blur(12px);',
    '  backdrop-filter: blur(12px);',
    '}',
    '#_bnav a {',
    '  flex: 1;',
    '  display: flex;',
    '  flex-direction: column;',
    '  align-items: center;',
    '  justify-content: center;',
    '  padding: 5px 2px 5px;',
    '  text-decoration: none;',
    '  color: var(--text-muted, #999);',
    '  font-size: 10px;',
    '  font-family: system-ui, sans-serif;',
    '  gap: 3px;',
    '  -webkit-tap-highlight-color: transparent;',
    '  transition: color .15s;',
    '  min-width: 0;',
    '}',
    '#_bnav a .bn-icon {',
    '  font-size: 22px;',
    '  line-height: 1;',
    '  transition: transform .15s;',
    '}',
    '#_bnav a.active {',
    '  color: var(--primary, #3A7D44);',
    '}',
    '#_bnav a.active .bn-icon {',
    '  transform: scale(1.18);',
    '}',
    '#_bnav a:active .bn-icon {',
    '  transform: scale(0.92);',
    '}',
    /* קורא — doneBtn גלוי מעל הניווט כולל safe-area */
    '.bottombar.has-bnav {',
    '  padding-bottom: calc(6px + 62px + env(safe-area-inset-bottom, 0px)) !important;',
    '}',
    /* תוכן tabs גלילה — פרקים אחרונים גלויים */
    '.tab-content.has-bnav {',
    '  padding-bottom: calc(62px + env(safe-area-inset-bottom, 0px)) !important;',
    '}'
  ].join('\n');

  /* ── HTML ────────────────────────────────────────────────── */
  var html = TABS.map(function (t) {
    var cls = _isActive(t.id) ? ' class="active"' : '';
    return '<a href="' + t.href + '"' + cls + '>' +
           '<span class="bn-icon">' + t.icon + '</span>' +
           '<span>' + t.label + '</span>' +
           '</a>';
  }).join('');

  /* ── הזרקה לדף ───────────────────────────────────────────── */
  function inject() {
    /* CSS */
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    /* NAV */
    var nav = document.createElement('nav');
    nav.id = '_bnav';
    nav.setAttribute('aria-label', 'ניווט ראשי');
    nav.innerHTML = html;
    document.body.appendChild(nav);

    /* padding לתוכן שלא יחסום מאחורי הפס */
    var bottombar = document.querySelector('.bottombar');
    if (bottombar) {
      /* עמוד קורא — מודדים את גובה הניווט *בפועל* ומפנים מקום לבר התחתון
         (המונה + כפתור הסיום) מעליו. עובד בכל מכשיר/דפדפן, בלי מספר קבוע. */
      bottombar.classList.add('has-bnav');
      var _clearBnav = function () {
        var h = (nav && nav.getBoundingClientRect().height) || 62;
        bottombar.style.setProperty('padding-bottom', Math.ceil(h + 16) + 'px', 'important');
      };
      requestAnimationFrame(_clearBnav);
      setTimeout(_clearBnav, 300);
      setTimeout(_clearBnav, 1000);
      window.addEventListener('resize', _clearBnav, { passive: true });
      window.addEventListener('orientationchange', function () { setTimeout(_clearBnav, 250); });
      if (window.visualViewport) window.visualViewport.addEventListener('resize', _clearBnav, { passive: true });
    } else {
      var existing = document.body.style.paddingBottom;
      var numPx = parseInt(existing || '0', 10) || 0;
      if (numPx < 62) document.body.style.paddingBottom = '62px';
      document.querySelectorAll('.tab-content').forEach(function(tc) {
        tc.classList.add('has-bnav');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

})();
