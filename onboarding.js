/* ════════════════════════════════════════════════════════════
   משנתי — Onboarding Tour אינטראקטיבי
   נוצר: 1.6.0 (10.5.2026)
   ──────────────────────────────────────────────────────────────
   הסיור הראשון מופיע בכניסה הראשונה לאפליקציה.
   מורכב מ-8 מסכים שמסבירים את הפיצ'רים העיקריים.
   localStorage:
   tehillim_onboarding_done = '1' אחרי השלמה / דילוג.
   ════════════════════════════════════════════════════════════ */
(function(global){
'use strict';

const KEY = 'tehillim_onboarding_done';

function _getLang() {
  try { return JSON.parse(localStorage.getItem('tehillim_settings') || '{}').lang || 'he'; } catch(e) { return 'he'; }
}

const STEPS_HE = [
  { icon:'📖', title:'ברוך הבא למשנתי!', body:'האפליקציה שתעזור לך להתמיד בלימוד משניות — בקלות, באהבה, ובהישגים שמלווים אותך כל הדרך.', bg:'#3A7D44' },
  { icon:'⭐', title:'מערכת זכויות', body:'כל פרק שתלמד ייתן לך נקודות "זכויות". תעבור 10 רמות, מ"מתחיל" 🌱 עד "גדול הדור" 🕯️. ככל שתלמד יותר — תעלה לרמה הבאה.', bg:'#1E5A2E' },
  { icon:'📚', title:'פירוש למשנה', body:'לחץ על כפתור הפירוש בקורא כדי לקרוא פירוש לכל משנה — ברטנורא ותוספות יום טוב. הפירוש מופיע מתחת לכל משנה ומעמיק את ההבנה.', bg:'#993556' },
  { icon:'🎯', title:'אתגרים יומיים', body:'יש לך 3 אתגרים פעילים בכל זמן: יומי, שבועי, וחודשי. השלם אותם ותקבל בונוס זכויות. אתגר חדש בכל יום חדש.', bg:'#3B6D11' },
  { icon:'🧠', title:'שינון בעל פה', body:'סמן פרק בכוכב ☆ אחרי ששיננת אותו בעל פה. הכפתור 🧠 יפתח לך כלי לימוד עם 4 רמות הסתרה — מהקלה עד למבחן מלא.', bg:'#7B2FF7' },
  { icon:'👥', title:'קבוצות ואתגרים משותפים', bg:'#6B3AAA', groupSlide:true },
  { icon:'📲', title:'כמה דברים חשובים', bg:'#1A6B3A', infoSlide:true },
  { icon:'🕯️', title:'באיזה מצב להפעיל את האפליקציה?', body:'', bg:'#3A7D44', modeSelect:true },
  { icon:'🎉', title:'בוא נתחיל!', body:'אתה מוכן! התחבר עם Google כדי לשמור את הנתונים שלך ולסנכרן בין מכשירים — בחינם ובשניות.', bg:'#C07A00', final:true, googleBtn:true }
];

const STEPS_EN = [
  { icon:'📖', title:'Welcome to Mishnati!', body:'The app that helps you study Mishnayot consistently — with ease, love, and achievements that guide you every step of the way.', bg:'#3A7D44' },
  { icon:'⭐', title:'Spiritual Points', body:'Every chapter you study earns you "Zechuyot" points. Progress through 10 levels from Beginner 🌱 to Sage of the Generation 🕯️. The more you study — the higher you climb.', bg:'#1E5A2E' },
  { icon:'📚', title:'Mishnah Commentary', body:'Tap the commentary button in the reader to see explanations for each Mishnah — Bartenura and Tosafot Yom Tov. Commentary appears below each Mishnah.', bg:'#993556' },
  { icon:'🎯', title:'Daily Challenges', body:'You have 3 active challenges at all times: daily, weekly, and monthly. Complete them for bonus points. A new challenge every new day.', bg:'#3B6D11' },
  { icon:'🧠', title:'Memorization Mode', body:'Mark a chapter with a star ☆ after memorizing it. The 🧠 button opens a learning tool with 4 levels of concealment — from easy to a full test.', bg:'#7B2FF7' },
  { icon:'👥', title:'Groups & Shared Challenges', bg:'#6B3AAA', groupSlide:true },
  { icon:'📲', title:'A Few Important Things', bg:'#1A6B3A', infoSlide:true },
  { icon:'🕯️', title:'Which mode would you like?', body:'', bg:'#3A7D44', modeSelect:true },
  { icon:'🎉', title:"Let's Begin!", body:"You're ready! Sign in with Google to save your data and sync across devices — free and instant.", bg:'#C07A00', final:true, googleBtn:true }
];

function isDone() {
  try { return localStorage.getItem(KEY) === '1'; } catch(e){ return true; }
}
function markDone() {
  try { localStorage.setItem(KEY,'1'); } catch(e){}
}
function reset() {
  try { localStorage.removeItem(KEY); } catch(e){}
}

let _idx = 0;
let _overlay = null;
let _lockedLang = null;

function build() {
  if (_overlay) return _overlay;
  const lang = _lockedLang || _getLang();
  const skipLabel  = lang === 'en' ? 'Skip'   : 'דלג';
  const nextLabel  = lang === 'en' ? 'Next →' : 'הבא ←';
  const o = document.createElement('div');
  o.id = '_onb_overlay';
  o.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.78);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;direction:rtl;animation:_onbFade .3s ease;';
  o.innerHTML = `
    <style>
      @keyframes _onbFade { from{opacity:0} to{opacity:1} }
      @keyframes _onbSlide { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      #_onb_card { animation: _onbSlide .35s cubic-bezier(.16,1,.3,1); }
    </style>
    <div id="_onb_card" style="background:#fff;width:90%;max-width:340px;border-radius:24px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.4);">
      <div id="_onb_header" style="padding:30px 24px 20px;color:#fff;text-align:center;">
        <div id="_onb_icon" style="font-size:64px;line-height:1;margin-bottom:10px;"></div>
        <div id="_onb_title" style="font-size:22px;font-weight:800;"></div>
      </div>
      <div style="padding:20px 24px 16px;text-align:center;font-size:15px;color:#1A1A1A;line-height:1.65;" id="_onb_body"></div>
      <div style="display:flex;justify-content:center;gap:6px;padding:0 0 14px;" id="_onb_dots"></div>
      <div style="display:flex;gap:8px;padding:0 24px 24px;">
        <button id="_onb_skip" style="flex:1;padding:12px;border-radius:14px;border:.5px solid #ccc;background:#f5f5f5;font-size:14px;color:#666;cursor:pointer;font-family:inherit;">${skipLabel}</button>
        <button id="_onb_next" style="flex:2;padding:12px;border-radius:14px;border:none;background:#3A7D44;color:#fff;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;">${nextLabel}</button>
      </div>
    </div>
  `;
  document.body.appendChild(o);
  _overlay = o;
  document.getElementById('_onb_skip').onclick = close;
  document.getElementById('_onb_next').onclick = next;
  return o;
}

function render() {
  const lang = _lockedLang || _getLang();
  const STEPS = lang === 'en' ? STEPS_EN : STEPS_HE;
  const s = STEPS[_idx];
  if (!s) return close();
  document.getElementById('_onb_header').style.background = s.bg;
  const iconEl = document.getElementById('_onb_icon');
  if (s.modeSelect) {
    iconEl.innerHTML = '<img src="4.jpg" alt="משנתי" style="width:72px;height:72px;border-radius:16px;object-fit:cover;box-shadow:0 4px 16px rgba(0,0,0,.25);">';
  } else {
    iconEl.textContent = s.icon;
  }
  document.getElementById('_onb_title').textContent = s.title;
  document.getElementById('_onb_body').textContent = s.body || '';

  // dots
  let dots = '';
  for (let i = 0; i < STEPS.length; i++) {
    const cur = i === _idx;
    dots += `<div style="width:${cur?20:7}px;height:7px;border-radius:4px;background:${cur?s.bg:'#ccc'};transition:width .3s;"></div>`;
  }
  document.getElementById('_onb_dots').innerHTML = dots;

  const isLast = _idx === STEPS.length - 1;
  document.getElementById('_onb_next').textContent = isLast ? (lang === 'en' ? 'Start 🚀' : 'התחל 🚀') : (lang === 'en' ? 'Next →' : 'הבא ←');
  document.getElementById('_onb_next').style.background = s.bg;

  // ── modeSelect ──
  let modeEl = document.getElementById('_onb_mode');
  if (s.modeSelect) {
    if (!modeEl) {
      modeEl = document.createElement('div');
      modeEl.id = '_onb_mode';
      modeEl.style.cssText = 'padding:0 24px 8px;display:flex;flex-direction:column;gap:10px;';
      const isEn = lang === 'en';
      modeEl.innerHTML = `
        <button id="_onb_m_simple" style="padding:14px 14px 12px;border-radius:16px;border:2.5px solid #3A7D44;background:#EAF2EA;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;color:#3A7D44;text-align:right;line-height:1.5;">
          <div><span style="font-size:20px;vertical-align:middle;margin-left:6px;">📖</span>${isEn ? 'Lishmah Study' : 'לימוד לשמה'}</div>
          <div style="font-size:12px;font-weight:400;color:#555;margin-top:3px;">${isEn ? 'Just open and learn, without distractions or settings.' : 'רק לפתוח וללמוד, בלי הסחות דעת ובלי הגדרות.'}</div>
          <div style="font-size:11px;font-weight:400;color:#3A7D44;margin-top:5px;font-style:italic;line-height:1.4;">"הֲפֹךְ בָּהּ וַהֲפֹךְ בָּהּ דְּכֹלָּא בָהּ"<br><span style="color:#888;">(אבות ה', כ"ב)</span></div>
        </button>
        <button id="_onb_m_full" style="padding:14px 14px 12px;border-radius:16px;border:2px solid #ddd;background:#f9f9f9;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;color:#333;text-align:right;line-height:1.5;">
          <div><span style="font-size:20px;vertical-align:middle;margin-left:6px;">🏆</span>${isEn ? 'Challenge Mode' : 'מסלול אתגרי'}</div>
          <div style="font-size:12px;font-weight:400;color:#555;margin-top:3px;">${isEn ? 'Track progress, earn challenges, build a community, and use all the features.' : 'מעקב אחר התקדמות, לצבור אתגרים, להקים קהילה ולהשתמש בכל השכלולים.'}</div>
          <div style="font-size:11px;font-weight:400;color:#888;margin-top:5px;font-style:italic;line-height:1.4;">"לְפוּם צַעֲרָא אַגְרָא"<br><span style="color:#aaa;">(אבות ה', כ"ג)</span></div>
        </button>`;
      const bodyEl = document.getElementById('_onb_body');
      bodyEl.parentNode.insertBefore(modeEl, bodyEl.nextSibling);

      let _curSimple = false;
      try {
        const st = JSON.parse(localStorage.getItem('tehillim_settings') || '{}');
        _curSimple = st.simpleMode === true;
      } catch(e){}

      function _highlightMode(isSimple) {
        _curSimple = isSimple;
        const sb = document.getElementById('_onb_m_simple');
        const fb = document.getElementById('_onb_m_full');
        if (!sb || !fb) return;
        if (isSimple) {
          sb.style.border = '2.5px solid #3A7D44'; sb.style.background = '#EAF2EA'; sb.style.color = '#3A7D44';
          fb.style.border = '2px solid #ddd'; fb.style.background = '#f9f9f9'; fb.style.color = '#333';
        } else {
          fb.style.border = '2.5px solid #3A7D44'; fb.style.background = '#EAF2EA'; fb.style.color = '#3A7D44';
          sb.style.border = '2px solid #ddd'; sb.style.background = '#f9f9f9'; sb.style.color = '#333';
        }
        try {
          const cur = JSON.parse(localStorage.getItem('tehillim_settings') || '{}');
          cur.simpleMode = isSimple;
          localStorage.setItem('tehillim_settings', JSON.stringify(cur));
        } catch(e){}
      }

      _highlightMode(_curSimple);
      document.getElementById('_onb_m_simple').onclick = function() { _highlightMode(true); };
      document.getElementById('_onb_m_full').onclick   = function() { _highlightMode(false); };
    }
    modeEl.style.display = 'flex';
  } else {
    if (modeEl) modeEl.style.display = 'none';
  }

  // ── infoSlide ──
  let infoEl = document.getElementById('_onb_info');
  if (s.infoSlide) {
    if (!infoEl) {
      infoEl = document.createElement('div');
      infoEl.id = '_onb_info';
      infoEl.style.cssText = 'padding:0 16px 8px;display:flex;flex-direction:column;gap:8px;text-align:right;direction:rtl;max-height:320px;overflow-y:auto;';
      const isEn = lang === 'en';
      infoEl.innerHTML =
        '<div style="background:#EEF6F0;border-radius:14px;padding:12px 14px;">'
        + '<div style="font-size:20px;margin-bottom:3px;">📱</div>'
        + `<div style="font-size:14px;font-weight:700;color:#1A6B3A;margin-bottom:3px;">${isEn ? 'Add to Home Screen' : 'הוסף אייקון למסך הבית'}</div>`
        + `<div style="font-size:12px;color:#444;line-height:1.5;">${isEn
            ? 'Mishnati is a Web App. To open it easily:<br><b>iPhone:</b> Share → "Add to Home Screen"<br><b>Android:</b> Menu ⋮ → "Add to Home Screen"'
            : 'משנתי היא אפליקציית Web. כדי לפתוח בנוחות:<br><b>iPhone:</b> כפתור שיתוף ← "הוסף למסך הבית"<br><b>Android:</b> תפריט ⋮ ← "הוסף למסך הבית"'}</div>`
        + '</div>'
        + '<div style="background:#EAF2EA;border-radius:14px;padding:12px 14px;">'
        + '<div style="font-size:20px;margin-bottom:3px;">🔐</div>'
        + `<div style="font-size:14px;font-weight:700;color:#3A7D44;margin-bottom:3px;">${isEn ? 'Sign in with Google' : 'הירשם עם Google'}</div>`
        + `<div style="font-size:12px;color:#444;line-height:1.5;">${isEn
            ? 'To save your points and chapters — sign in with Google. Free and instant.'
            : 'כדי שהזכויות והפרקים שלמדת <b>יישמרו</b> — חשוב להתחבר עם חשבון Google. בחינם ובשניות.'}</div>`
        + '</div>'
        + '<div style="background:#FFF8EE;border-radius:14px;padding:12px 14px;">'
        + '<div style="font-size:20px;margin-bottom:3px;">🛠️</div>'
        + `<div style="font-size:14px;font-weight:700;color:#C07A00;margin-bottom:3px;">${isEn ? 'Beta Version' : 'גרסת בטא'}</div>`
        + `<div style="font-size:12px;color:#444;line-height:1.5;">${isEn
            ? 'The app is in active development. Found a bug or have a suggestion? We\'d love to hear from you!'
            : 'האפליקציה בפיתוח פעיל. אם נתקלת בתקלה או יש לך הצעה — נשמח לשמוע!'}</div>`
        + '</div>';
      const bodyEl2 = document.getElementById('_onb_body');
      bodyEl2.parentNode.insertBefore(infoEl, bodyEl2.nextSibling);
    }
    infoEl.style.display = 'flex';
  } else {
    if (infoEl) infoEl.style.display = 'none';
  }

  // ── groupSlide ──
  let groupEl = document.getElementById('_onb_group');
  if (s.groupSlide) {
    if (!groupEl) {
      groupEl = document.createElement('div');
      groupEl.id = '_onb_group';
      groupEl.style.cssText = 'padding:0 16px 8px;display:flex;flex-direction:column;gap:8px;text-align:right;direction:rtl;';
      const isEn = lang === 'en';
      groupEl.innerHTML =
        '<div style="background:#F0EAF9;border-radius:14px;padding:12px 14px;">'
        + '<div style="font-size:20px;margin-bottom:3px;">🏆</div>'
        + `<div style="font-size:14px;font-weight:700;color:#6B3AAA;margin-bottom:3px;">${isEn ? 'Shared Challenges' : 'אתגרים משותפים'}</div>`
        + `<div style="font-size:12px;color:#444;line-height:1.5;">${isEn
            ? 'Create a group with family, friends, or a community. Set a shared goal — how many chapters to study together — and track progress in real time.'
            : 'צור קבוצה עם משפחה, חברים או קהילה. קבעו יעד משותף — כמה פרקים ללמוד ביחד — ועקבו אחר ההתקדמות בזמן אמת.'}</div>`
        + '</div>'
        + '<div style="background:#F0EAF9;border-radius:14px;padding:12px 14px;">'
        + '<div style="font-size:20px;margin-bottom:3px;">➕</div>'
        + `<div style="font-size:14px;font-weight:700;color:#6B3AAA;margin-bottom:3px;">${isEn ? 'How to Create a Group?' : 'איך יוצרים קבוצה?'}</div>`
        + `<div style="font-size:12px;color:#444;line-height:1.5;">${isEn
            ? 'Main menu → "Community" → "Create Group". Send the code to friends — they join with one tap.'
            : 'בתפריט הראשי ← "קהילה" ← "צור קבוצה". שלח את הקוד לחברים — והם מצטרפים בלחיצה.'}</div>`
        + '</div>'
        + '<div style="background:#F0EAF9;border-radius:14px;padding:12px 14px;">'
        + '<div style="font-size:20px;margin-bottom:3px;">✨</div>'
        + `<div style="font-size:14px;font-weight:700;color:#6B3AAA;margin-bottom:3px;">${isEn ? 'Group Benefits' : 'יתרונות הקבוצה'}</div>`
        + `<div style="font-size:12px;color:#444;line-height:1.5;">${isEn
            ? 'Private leaderboard · See each member\'s score · Mutual encouragement · Earn merit together 🙏'
            : 'לוח מובילים פנימי · ראיית הניקוד של כל חבר · עידוד הדדי · זיכוי הרבים ביחד 🙏'}</div>`
        + '</div>';
      const bodyEl3 = document.getElementById('_onb_body');
      bodyEl3.parentNode.insertBefore(groupEl, bodyEl3.nextSibling);
    }
    groupEl.style.display = 'flex';
  } else {
    if (groupEl) groupEl.style.display = 'none';
  }

  // ── Google button (final slide) ──
  let gBtn = document.getElementById('_onb_gbtn');
  if (s.googleBtn) {
    const isLoggedIn = !!localStorage.getItem('tehillim_google_user');
    if (!isLoggedIn) {
      if (!gBtn) {
        gBtn = document.createElement('button');
        gBtn.id = '_onb_gbtn';
        gBtn.style.cssText = 'display:block;width:calc(100% - 48px);margin:0 24px 12px;padding:11px;border-radius:14px;border:1.5px solid #4285F4;background:#fff;color:#4285F4;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;';
        const isEn = lang === 'en';
        gBtn.innerHTML = `<span style="margin-left:6px;">🔑</span> ${isEn ? 'Sign in with Google' : 'התחבר עם Google'}`;
        gBtn.onclick = function() { close(); location.href = '06-settings.html?login=1'; };
        const dotsEl = document.getElementById('_onb_dots');
        dotsEl.parentNode.insertBefore(gBtn, dotsEl.nextSibling.nextSibling);
      }
      gBtn.style.display = 'block';
    } else {
      if (gBtn) gBtn.style.display = 'none';
    }
  } else {
    if (gBtn) gBtn.style.display = 'none';
  }
}

function next() {
  const lang = _lockedLang || _getLang();
  const STEPS = lang === 'en' ? STEPS_EN : STEPS_HE;
  _idx++;
  if (_idx >= STEPS.length) return close();
  render();
}

function close() {
  markDone();
  _lockedLang = null;
  if (_overlay) {
    _overlay.style.animation = '_onbFade .25s ease reverse';
    setTimeout(() => {
      if (_overlay && _overlay.parentNode) _overlay.parentNode.removeChild(_overlay);
      _overlay = null;
      try {
        const ss = JSON.parse(localStorage.getItem('tehillim_settings') || '{}');
        if (ss.simpleMode === false && !document.getElementById('_bnav')) {
          location.reload();
          return;
        }
      } catch(e) {}
      if (typeof window._applySimpleMode === 'function') window._applySimpleMode();
    }, 300);
  }
}

function start(force) {
  if (!force && isDone()) return;
  _idx = 0;
  _lockedLang = _getLang();
  build();
  render();
}

function autoStart() {
  if (isDone()) return;
  if (!location.pathname.includes('01-dashboard') && location.pathname !== '/' && !location.pathname.endsWith('/')) return;
  setTimeout(() => start(false), 800);
}

global.TehillonOnboarding = { start, close, isDone, markDone, reset, autoStart };

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  autoStart();
} else {
  document.addEventListener('DOMContentLoaded', autoStart);
}
})(window);
