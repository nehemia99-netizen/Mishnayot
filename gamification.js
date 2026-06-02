/* ════════════════════════════════════════════════════════════
   תהילהון — מודול גמיפיקציה (מעלות, רצפים, רמות)
   נוצר: 1.2.0 (10.5.2026)
   ──────────────────────────────────────────────────────────────
   מודל נתונים ב-localStorage:

   tehillim_gamification = {
     ma'alot: {
       total: 0,            // סך מעלות שנצברו אי פעם (לא מתאפס לעולם)
       weekly: 0,           // מעלות השבוע (מתאפס בסוף שבוע)
       weeklyDate: 'YYYY-MM-DD',  // תאריך תחילת חישוב השבועי
       monthly: 0,
       monthlyMonth: 'YYYY-MM',
       byDay: { 'YYYY-MM-DD': N }, // לגרפים
       lastUpdate: 'YYYY-MM-DD'
     },
     streak: {
       current: 0,          // ימים רצופים נוכחיים
       longest: 0,          // הכי ארוך אי פעם
       lastActiveDate: 'YYYY-MM-DD',
       freezeRemaining: 1   // מגן רצף - יום חופש
     },
     memorized: {            // פרקים שלמדתי בע״פ (משלים את 'tehillim_mems')
       count: 0,
       chapters: [],        // מערך מספרי פרקים [23, 91, ...]
       lastAdded: ''        // YYYY-MM-DD
     },
     chaptersRead: {        // לכמות פרקים סך הכל
       total: 0,            // סך פרקים שנקראו במלואם (כולל חזרות)
       unique: [],          // פרקים שנקראו לפחות פעם אחת
       byBook: [0,0,0,0,0]  // לפי 5 הספרים
     },
     levelKey: 'תלמיד'      // רמה נוכחית (cache)
   }
   ════════════════════════════════════════════════════════════ */
(function(global){
'use strict';

const KEY = 'tehillim_gamification';
const today = () => localDateStr();
const monthKey = () => new Date().toISOString().slice(0,7);
function weekKey() {
  const d = new Date();
  // יום ראשון = תחילת שבוע
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return localDateStr(d);
}
function daysBetween(a, b) {
  const ms = (new Date(b) - new Date(a));
  return Math.round(ms / (1000*60*60*24));
}

/* ─── רמות מעלה ─── */
const LEVELS = [
  { key:'מתחיל',     en:'Beginner',               min: 0,    icon:'🌱' },
  { key:'תלמיד',     en:'Student',                min: 50,   icon:'📖' },
  { key:'חבר',       en:'Fellow',                 min: 200,  icon:'⭐' },
  { key:'ותיק',      en:'Veteran',                min: 500,  icon:'✨' },
  { key:'נאמן',      en:'Faithful',               min: 1000, icon:'🏅' },
  { key:'מובהק',     en:'Distinguished',          min: 2500, icon:'🏆' },
  { key:'בקי',       en:'Expert',                 min: 5000, icon:'👑' },
  { key:'גדול',      en:'Master',                 min:10000, icon:'💎' },
  { key:'אדיר',      en:'Mighty',                 min:25000, icon:'🌟' },
  { key:'גדול הדור', en:'Sage of the Generation', min:50000, icon:'🕯️' },
];

function levelOf(total) {
  let curr = LEVELS[0], next = LEVELS[1];
  for (let i = 0; i < LEVELS.length; i++) {
    if (total >= LEVELS[i].min) { curr = LEVELS[i]; next = LEVELS[i+1] || null; }
  }
  const pct = next ? Math.min(100, Math.round((total - curr.min) / (next.min - curr.min) * 100)) : 100;
  return { curr, next, pct, toNext: next ? next.min - total : 0 };
}

/* ─── טעינה ושמירה ─── */
function load() {
  let data;
  try { data = JSON.parse(localStorage.getItem(KEY)); } catch(e) { data = null; }
  if (!data || typeof data !== 'object') data = {};
  // ברירות מחדל
  data['ma\'alot'] = data['ma\'alot'] || { total:0, weekly:0, weeklyDate:weekKey(), monthly:0, monthlyMonth:monthKey(), byDay:{}, lastUpdate:today() };
  data.streak       = data.streak       || { current:0, longest:0, lastActiveDate:'', freezeRemaining:1 };
  data.memorized    = data.memorized    || { count:0, chapters:[], lastAdded:'' };
  data.chaptersRead = data.chaptersRead || { total:0, unique:[], byBook:[0,0,0,0,0] };
  data.levelKey     = data.levelKey     || LEVELS[0].key;
  // Reset שבועי/חודשי אם עברנו
  const wk = weekKey(), mo = monthKey();
  if (data['ma\'alot'].weeklyDate !== wk)   { data['ma\'alot'].weeklyDate = wk;   data['ma\'alot'].weekly = 0; }
  if (data['ma\'alot'].monthlyMonth !== mo) { data['ma\'alot'].monthlyMonth = mo; data['ma\'alot'].monthly = 0; }
  return data;
}
function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch(e){}
}

/* ─── הוספת מעלות ─── */
function addMaalot(pts, reason) {
  if (!pts || pts <= 0) return null;
  const data = load();
  const t = today();
  data['ma\'alot'].total   = (data['ma\'alot'].total||0)   + pts;
  data['ma\'alot'].weekly  = (data['ma\'alot'].weekly||0)  + pts;
  data['ma\'alot'].monthly = (data['ma\'alot'].monthly||0) + pts;
  data['ma\'alot'].byDay   = data['ma\'alot'].byDay || {};
  data['ma\'alot'].byDay[t] = (data['ma\'alot'].byDay[t]||0) + pts;
  data['ma\'alot'].lastUpdate = t;


  // עדכון רמה אם השתנתה
  const lvl = levelOf(data['ma\'alot'].total);
  const oldLvl = data.levelKey;
  data.levelKey = lvl.curr.key;

  save(data);
  // החזר מטא-מידע למסך
  return {
    pts, reason,
    total: data['ma\'alot'].total,
    weekly: data['ma\'alot'].weekly,
    levelUp: oldLvl !== lvl.curr.key ? lvl.curr : null,
    level: lvl
  };
}

/* ─── רצפים (Streaks) ─── */
function tickStreak() {
  const data = load();
  const t = today();
  const last = data.streak.lastActiveDate;
  if (last === t) return data.streak; // כבר נספר היום

  if (!last) {
    data.streak.current = 1;
  } else {
    const diff = daysBetween(last, t);
    // בדוק האם הפער מוסבר ע"י שישי/שבת (שומרי שבת)
    const _isShabbatGap = (function() {
      // סרוק את הימים שבין last ל-t ובדוק אם כולם שישי/שבת
      if (diff <= 1) return false;
      const lastD = new Date(last);
      const skipped = [];
      for (let i = 1; i < diff; i++) {
        const d = new Date(lastD);
        d.setDate(d.getDate() + i);
        skipped.push(d.getDay()); // 0=ראשון, 5=שישי, 6=שבת
      }
      // כל הימים המדולגים הם שישי (5) או שבת (6)
      return skipped.every(d => d === 5 || d === 6);
    })();
    if (diff === 1 || _isShabbatGap) {
      data.streak.current = (data.streak.current||0) + 1;
    } else if (diff === 2 && (data.streak.freezeRemaining||0) > 0) {
      // השתמש במגן רצף ל-יום אחד
      data.streak.freezeRemaining -= 1;
      data.streak.current = (data.streak.current||0) + 1;
    } else {
      data.streak.current = 1;
    }
  }
  if ((data.streak.current||0) > (data.streak.longest||0)) data.streak.longest = data.streak.current;
  data.streak.lastActiveDate = t;
  // צבירת מגן רצף — כל 7 ימים מעל הרצף, מקבלים מגן (עד 3)
  if (data.streak.current > 0 && data.streak.current % 7 === 0 && (data.streak.freezeRemaining||0) < 3) {
    data.streak.freezeRemaining = (data.streak.freezeRemaining||0) + 1;
  }
  save(data);
  return data.streak;
}

/* ─── פרקים שנקראו ─── */
function bookOf(chap) {
  if (chap <= 41)  return 0;  // ספר א
  if (chap <= 72)  return 1;  // ספר ב
  if (chap <= 89)  return 2;  // ספר ג
  if (chap <= 106) return 3;  // ספר ד
  return 4;                   // ספר ה
}
function recordChapterRead(chapNum) {
  const data = load();
  const n = +chapNum;
  if (!n || n < 1 || n > 150) return null;
  data.chaptersRead.total = (data.chaptersRead.total||0) + 1;
  data.chaptersRead.unique = data.chaptersRead.unique || [];
  if (!data.chaptersRead.unique.includes(n)) data.chaptersRead.unique.push(n);
  data.chaptersRead.byBook = data.chaptersRead.byBook || [0,0,0,0,0];
  data.chaptersRead.byBook[bookOf(n)] = (data.chaptersRead.byBook[bookOf(n)]||0) + 1;
  save(data);
  return data.chaptersRead;
}

/* ─── פרקים שנשננו (למדתי בע״פ) ─── */
function syncMemorizedFromMems() {
  // קורא מ-tehillim_mems (המקור) ומסנכרן
  let mems = [];
  try { mems = JSON.parse(localStorage.getItem('tehillim_mem')||'[]'); } catch(e){ mems = []; }
  const data = load();
  data.memorized.chapters = mems.slice();
  data.memorized.count = mems.length;
  save(data);
  return data.memorized;
}

/* ─── חלוקת תהילים יומי לפי תאריך עברי ─── */
const DAILY_CHAPS_BY_DAY = {
  1:[1,9],2:[10,17],3:[18,22],4:[23,28],5:[29,34],
  6:[35,38],7:[39,43],8:[44,48],9:[49,54],10:[55,59],
  11:[60,65],12:[66,68],13:[69,71],14:[72,76],15:[77,78],
  16:[79,82],17:[83,87],18:[88,89],19:[90,96],20:[97,103],
  21:[104,105],22:[106,107],23:[108,112],24:[113,118],
  25:[119,119],26:[120,134],27:[135,139],28:[140,144],
  29:[145,150],30:[145,150]
};
function getDailyChapters() {
  let day = 1;
  try {
    const s = new Intl.DateTimeFormat('he-IL-u-ca-hebrew',{day:'numeric'}).format(new Date());
    const n = parseInt(s.replace(/[^\d]/g,''));
    if (n >= 1 && n <= 30) day = n;
  } catch(e){}
  const r = DAILY_CHAPS_BY_DAY[day] || DAILY_CHAPS_BY_DAY[1];
  const out = [];
  for (let i = r[0]; i <= r[1]; i++) out.push(i);
  return out;
}

/* ─── פעולה משולבת: סיום פרק ─── */
function onChapterCompleted(chapNum, secs) {
  // 2.0.8: 5 מעלות לפרק שלם + 1 מעלה לכל 10 שניות
  const tenSecUnits = Math.floor((secs||0)/10);
  const pts = 5 + tenSecUnits;
  const r = addMaalot(pts, 'completed-chapter');
  recordChapterRead(chapNum);
  tickStreak();

  // בונוס פרקי היום (50 מעלות) — פעם ביום עברי
  try {
    const todayKey = today();
    const data = load();
    data.dailyChaptersBonus = data.dailyChaptersBonus || {};
    if (!data.dailyChaptersBonus[todayKey]) {
      const dailyChaps = getDailyChapters();
      const readings = JSON.parse(localStorage.getItem('tehillim_readings')||'[]');
      const todayRead = new Set(
        readings.filter(rec => rec.date === todayKey && !rec.partial).map(rec => +rec.chap)
      );
      todayRead.add(+chapNum);
      let allDone = true;
      for (const c of dailyChaps) if (!todayRead.has(c)) { allDone = false; break; }
      if (allDone) {
        data.dailyChaptersBonus[todayKey] = true;
        save(data);
        const bonus = addMaalot(50, 'daily-psalms');
        r.dailyBonus = bonus;
      }
    }
  } catch(e){}

  // בדיקת badges חדשים
  if (typeof checkAndAwardBadges === 'function') {
    try {
      const newBadges = checkAndAwardBadges();
      if (newBadges && newBadges.length) r.newBadges = newBadges;
    } catch(e){}
  }
  return r;
}

/* ─── סטטיסטיקות לתצוגה ─── */
function getStats() {
  const data = load();
  const lvl = levelOf(data['ma\'alot'].total||0);
  // סנכרון מאחורה
  syncMemorizedFromMems();
  const fresh = load();
  return {
    total: fresh['ma\'alot'].total||0,
    weekly: fresh['ma\'alot'].weekly||0,
    monthly: fresh['ma\'alot'].monthly||0,
    streak: fresh.streak.current||0,
    longestStreak: fresh.streak.longest||0,
    freezes: fresh.streak.freezeRemaining||0,
    memorized: fresh.memorized.count||0,
    memorizedChaps: fresh.memorized.chapters||[],
    chaptersRead: fresh.chaptersRead.total||0,
    uniqueChapters: (fresh.chaptersRead.unique||[]).length,
    byBook: fresh.chaptersRead.byBook||[0,0,0,0,0],
    level: lvl
  };
}

/* ─── תצוגת toast קטן ─── */
function showMaalotToast(meta) {
  if (!meta) return;
  const old = document.getElementById('_gam_toast_');
  if (old) old.remove();
  const div = document.createElement('div');
  div.id = '_gam_toast_';
  div.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(100%);background:#185FA5;color:#fff;padding:11px 20px;border-radius:24px;font-size:14px;font-weight:600;font-family:system-ui;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.25);transition:transform .35s cubic-bezier(.16,1,.3,1);direction:rtl;';
  let html = '⭐ +' + meta.pts + ' מעלות';
  if (meta.levelUp) html += ' · עלית לרמת ' + meta.levelUp.icon + ' ' + meta.levelUp.key + '!';
  div.innerHTML = html;
  document.body.appendChild(div);
  requestAnimationFrame(() => div.style.transform = 'translateX(-50%) translateY(0)');
  setTimeout(() => {
    div.style.transform = 'translateX(-50%) translateY(100%)';
    setTimeout(() => div.remove(), 400);
  }, meta.levelUp ? 3500 : 2000);
}

/* ════════════════════════════════════════════════════════════
   אתגרים (Challenges) — 1.4.0
   ════════════════════════════════════════════════════════════ */
const CHALLENGES = {
  daily: [
    { id:'d_3chaps',  title:'קרא 3 פרקים היום',    titleEn:'Read 3 chapters today',        icon:'📖', reward:10, target:3,  metric:'todayChapters' },
    { id:'d_10min',   title:'10 דקות קריאה היום',  titleEn:'10 minutes of reading today',  icon:'⏱',  reward:8,  target:10, metric:'todayMinutes' },
    { id:'d_one',     title:'קרא לפחות פרק אחד',   titleEn:'Read at least one chapter',    icon:'✅', reward:5,  target:1,  metric:'todayChapters' },
    { id:'d_morning', title:'קריאה לפני 10 בבוקר', titleEn:'Read before 10 AM',            icon:'🌅', reward:12, target:1,  metric:'morningChapters' },
    { id:'d_night',   title:'קריאה אחרי 22:00',    titleEn:'Read after 10 PM',             icon:'🌙', reward:12, target:1,  metric:'nightChapters' }
  ],
  weekly: [
    { id:'w_book_a',  title:'סיים את ספר א׳ (1–41)',  titleEn:'Finish Book I (ch. 1–41)',     icon:'📕', reward:50,  target:41, metric:'weekBookA' },
    { id:'w_15chaps', title:'15 פרקים השבוע',          titleEn:'15 chapters this week',        icon:'📚', reward:35,  target:15, metric:'weekChapters' },
    { id:'w_5days',   title:'קרא ב-5 ימים השבוע',     titleEn:'Read on 5 days this week',     icon:'📅', reward:40,  target:5,  metric:'weekActiveDays' },
    { id:'w_60min',   title:'60 דקות קריאה השבוע',    titleEn:'60 minutes of reading this week',icon:'⏰',reward:30, target:60, metric:'weekMinutes' }
  ],
  monthly: [
    { id:'m_30days',       title:'קרא בכל יום של החודש',           titleEn:'Read every day this month',          icon:'🗓', reward:200, target:28,  metric:'monthActiveDays' },
    { id:'m_100ch',        title:'100 פרקים החודש',                 titleEn:'100 chapters this month',            icon:'💯', reward:120, target:100, metric:'monthChapters' },
    { id:'m_4hours',       title:'4 שעות קריאה החודש',             titleEn:'4 hours of reading this month',      icon:'⌛', reward:100, target:240, metric:'monthMinutes' },
    { id:'m_book_b',       title:'סיים את ספר ב׳ החודש',           titleEn:'Finish Book II this month',          icon:'📗', reward:80,  target:31,  metric:'monthBookB' },
    { id:'m_book_c',       title:'סיים את ספר ג׳ החודש',           titleEn:'Finish Book III this month',         icon:'📘', reward:80,  target:17,  metric:'monthBookC' },
    { id:'m_15days_row',   title:'15 ימים רצופים החודש',           titleEn:'15-day streak this month',           icon:'🔥', reward:150, target:15,  metric:'currentStreak' },
    { id:'m_special_chaps',title:'קרא את 5 הפרקים המיוחדים',       titleEn:'Read the 5 special chapters',        icon:'⭐', reward:90,  target:5,   metric:'monthSpecialChaps' },
    { id:'m_50min_day',    title:'יום אחד עם 50 דקות',             titleEn:'One day with 50 minutes',            icon:'💪', reward:70,  target:1,   metric:'monthMaxDayMins50' },
    { id:'m_motzashabat',  title:'קריאה במוצאי שבת',               titleEn:'Read on Saturday night',             icon:'✨', reward:35,  target:1,   metric:'monthMotzashabat' },
    { id:'m_rosh_chodesh', title:'קריאה בראש חודש',                 titleEn:'Read on Rosh Chodesh',               icon:'🌙', reward:40,  target:1,   metric:'monthRoshChodesh' }
  ]
};

function pickChallengeForPeriod(arr, periodKey) {
  // בוחר אתגר על פי seed יציב מהמפתח (אותו אתגר לאורך כל התקופה)
  // 2.1.3: אם יש challengesSeed - מצרפים אותו ל-key (יוצר ערבוב חדש)
  let h = 0;
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || '{}');
    const seed = data.challengesSeed || 0;
    periodKey = periodKey + ':' + seed;
  } catch(e) {}
  for (let i=0;i<periodKey.length;i++) h = (h*31 + periodKey.charCodeAt(i))|0;
  return arr[Math.abs(h) % arr.length];
}

function getChallengeMetrics() {
  // מחשב מערכים של מטריקות מ-tehillim_readings
  let readings = [];
  try { readings = JSON.parse(localStorage.getItem('tehillim_readings')||'[]'); } catch(e){}
  const t = today();
  // 2.0.9: "השבוע" = 7 ימים אחורה (rolling), במקום מתחילת שבוע
  const wkStart7 = new Date();
  wkStart7.setDate(wkStart7.getDate() - 6);
  const wk = localDateStr(wkStart7);
  const mo = monthKey();
  const moStart = mo + '-01';

  // 2.0.9: עבור זמן (דקות) - לסכום גם partial. עבור ספירת פרקים - רק completed.
  const todayR_all     = readings.filter(r => r.date === t);
  const weekR_all      = readings.filter(r => r.date >= wk);
  const monthR_all     = readings.filter(r => r.date >= moStart);
  const todayR_done    = todayR_all.filter(r => !r.partial);
  const weekR_done     = weekR_all.filter(r => !r.partial);
  const monthR_done    = monthR_all.filter(r => !r.partial);

  // morning/night לפי ts (רק מהפרקים שהושלמו)
  let morning = 0, night = 0;
  for (const r of todayR_done) {
    if (!r.ts) continue;
    const h = new Date(r.ts).getHours();
    if (h < 10) morning++;
    if (h >= 22) night++;
  }
  // ספר א
  let weekBookA = 0;
  const seenChapsA = new Set();
  for (const r of weekR_done) {
    if (r.chap >= 1 && r.chap <= 41 && !seenChapsA.has(r.chap)) {
      seenChapsA.add(r.chap); weekBookA++;
    }
  }
  return {
    todayChapters: new Set(todayR_done.map(r=>r.chap)).size,
    // זמן - מסך כל הרשומות (כולל partial)
    todayMinutes: Math.round(todayR_all.reduce((a,r)=>a+(r.secs||0),0)/60),
    morningChapters: morning,
    nightChapters: night,
    weekChapters: weekR_done.length,
    weekActiveDays: new Set(weekR_all.filter(r => r.secs > 0).map(r=>r.date)).size,
    weekMinutes: Math.round(weekR_all.reduce((a,r)=>a+(r.secs||0),0)/60),
    weekBookA: weekBookA,
    monthChapters: monthR_done.length,
    monthActiveDays: new Set(monthR_all.filter(r => r.secs > 0).map(r=>r.date)).size,
    monthMinutes: Math.round(monthR_all.reduce((a,r)=>a+(r.secs||0),0)/60),
    // 2.1.0: מטריקות חדשות
    monthBookB: (function(){
      const s = new Set();
      monthR_done.forEach(r => { if (r.chap >= 42 && r.chap <= 72) s.add(r.chap); });
      return s.size;
    })(),
    monthBookC: (function(){
      const s = new Set();
      monthR_done.forEach(r => { if (r.chap >= 73 && r.chap <= 89) s.add(r.chap); });
      return s.size;
    })(),
    currentStreak: (function(){
      try { return load().streak.current||0; } catch(e){ return 0; }
    })(),
    monthSpecialChaps: (function(){
      const specials = [23, 91, 119, 130, 150];
      const s = new Set();
      monthR_done.forEach(r => { if (specials.indexOf(+r.chap) !== -1) s.add(+r.chap); });
      return s.size;
    })(),
    monthMaxDayMins50: (function(){
      // האם יש יום בחודש עם 50+ דקות?
      const byDate = {};
      monthR_all.forEach(r => { byDate[r.date] = (byDate[r.date]||0) + (r.secs||0); });
      const maxSecs = Math.max(...Object.values(byDate), 0);
      return (maxSecs >= 50*60) ? 1 : 0;
    })(),
    monthMotzashabat: (function(){
      // קריאה ביום ראשון אחרי שבת
      return monthR_done.some(r => {
        const d = new Date(r.date);
        const hr = r.ts ? new Date(r.ts).getHours() : 12;
        return d.getDay() === 0 && hr < 6;  // יום ראשון לפני 6 בבוקר = מוצש בעצם
      }) ? 1 : 0;
    })(),
    monthRoshChodesh: (function(){
      // האם נקרא בראש חודש?
      try {
        return monthR_done.some(r => {
          try {
            const s = new Intl.DateTimeFormat('he-IL-u-ca-hebrew',{day:'numeric'}).format(new Date(r.date));
            const n = parseInt(s.replace(/[^\d]/g,''));
            return n === 1 || n === 30;
          } catch(e){ return false; }
        }) ? 1 : 0;
      } catch(e){ return 0; }
    })()
  };
}

function getActiveChallenges() {
  const t = today(), wk = weekKey(), mo = monthKey();
  const metrics = getChallengeMetrics();
  const data = load();
  data.challengesClaimed = data.challengesClaimed || {};

  const out = [
    Object.assign({}, pickChallengeForPeriod(CHALLENGES.daily, t),   { type:'daily',   periodKey: t }),
    Object.assign({}, pickChallengeForPeriod(CHALLENGES.weekly, wk), { type:'weekly',  periodKey: wk }),
    Object.assign({}, pickChallengeForPeriod(CHALLENGES.monthly, mo),{ type:'monthly', periodKey: mo })
  ];
  return out.map(ch => {
    const cur = metrics[ch.metric] || 0;
    const completed = cur >= ch.target;
    const claimedKey = ch.type + ':' + ch.periodKey + ':' + ch.id;
    const claimed = !!data.challengesClaimed[claimedKey];
    return Object.assign({}, ch, {
      current: cur,
      pct: Math.min(100, Math.round(cur / ch.target * 100)),
      completed, claimed, claimedKey
    });
  });
}

function claimChallenge(claimedKey, reward) {
  const data = load();
  data.challengesClaimed = data.challengesClaimed || {};
  if (data.challengesClaimed[claimedKey]) return null; // כבר נדרש
  data.challengesClaimed[claimedKey] = today();
  save(data);
  return addMaalot(reward, 'challenge:' + claimedKey);
}

/* ════════════════════════════════════════════════════════════
   Badges נושאיים — 1.5.0
   ════════════════════════════════════════════════════════════ */
const BADGES = [
  // ספרים שלמים — 100 מעלות (2.0.7)
  { id:'book_a',   icon:'📕', title:'ספר א׳ הושלם',  desc:'קראת את כל פרקים 1–41',   check: ctx => coversRange(ctx.uniqueRead, 1, 41),    reward:100 },
  { id:'book_b',   icon:'📗', title:'ספר ב׳ הושלם',  desc:'קראת את כל פרקים 42–72',  check: ctx => coversRange(ctx.uniqueRead, 42, 72),   reward:100 },
  { id:'book_c',   icon:'📘', title:'ספר ג׳ הושלם',  desc:'קראת את כל פרקים 73–89',  check: ctx => coversRange(ctx.uniqueRead, 73, 89),   reward:100 },
  { id:'book_d',   icon:'📙', title:'ספר ד׳ הושלם',  desc:'קראת את כל פרקים 90–106', check: ctx => coversRange(ctx.uniqueRead, 90, 106),  reward:100 },
  { id:'book_e',   icon:'📚', title:'ספר ה׳ הושלם',  desc:'קראת את כל פרקים 107–150',check: ctx => coversRange(ctx.uniqueRead, 107, 150), reward:100 },
  { id:'all_150',  icon:'🌟', title:'כל ה-150 פרקים',desc:'סיימת את כל ספר תהילים!', check: ctx => coversRange(ctx.uniqueRead, 1, 150),   reward:500 },
  // פרקים מיוחדים
  { id:'p_119',    icon:'🔠', title:'הא״ב הגדול',    desc:'קראת את פרק קי״ט הארוך',  check: ctx => ctx.uniqueRead.has(119),               reward:50 },
  { id:'shir_maalot', icon:'🪜', title:'שיר המעלות',   desc:'קראת את כל 15 שירי המעלות (120–134)', check: ctx => coversRange(ctx.uniqueRead, 120, 134), reward:120 },
  { id:'p_91',     icon:'🛡', title:'יושב בסתר',     desc:'קראת את פרק צ״א',          check: ctx => ctx.uniqueRead.has(91),                reward:25 },
  { id:'p_23',     icon:'🐑', title:'הרועה הנאמן',   desc:'קראת את פרק כ״ג',          check: ctx => ctx.uniqueRead.has(23),                reward:20 },
  // תהילים יומי (לפי תאריך) - 2.0.7
  { id:'daily_psalms', icon:'📅', title:'תהילים יומי',  desc:'סיימת את פרקי התהילים של היום (לפי לוח עברי)', check: ctx => ctx.dailyPsalmsCompleted >= 1, reward:50 },
  // זמן
  { id:'time_60',   icon:'⏰', title:'שעה ראשונה',   desc:'60 דקות קריאה מצטברות',   check: ctx => ctx.totalMinutes >= 60,    reward:30 },
  { id:'time_600',  icon:'🏅', title:'10 שעות',       desc:'600 דקות קריאה מצטברות',  check: ctx => ctx.totalMinutes >= 600,   reward:80 },
  { id:'time_1500', icon:'🏆', title:'25 שעות',       desc:'1,500 דקות קריאה',         check: ctx => ctx.totalMinutes >= 1500,  reward:150 },
  { id:'time_3000', icon:'👑', title:'50 שעות',       desc:'3,000 דקות קריאה',         check: ctx => ctx.totalMinutes >= 3000,  reward:300 },
  // רצפים
  { id:'streak_7',  icon:'🔥', title:'שבוע רצוף',    desc:'7 ימים רצופים של קריאה', check: ctx => ctx.longestStreak >= 7,    reward:60 },
  { id:'streak_30', icon:'💥', title:'חודש רצוף',    desc:'30 ימים רצופים',           check: ctx => ctx.longestStreak >= 30,   reward:200 },
  { id:'streak_100',icon:'⚡', title:'100 ימים רצוף', desc:'100 ימים רצופים — מדהים!', check: ctx => ctx.longestStreak >= 100,  reward:600 },
  // שעות יום
  { id:'morning_5', icon:'🌅', title:'משכים קום',    desc:'5 קריאות לפני 7:00',       check: ctx => ctx.morningCount >= 5,     reward:40 },
  { id:'night_5',   icon:'🌙', title:'תפילת לילה',   desc:'5 קריאות אחרי 22:00',      check: ctx => ctx.nightCount >= 5,       reward:40 },
  // 10 מדליות מכל סוג - 2.0.7
  { id:'medals_bronze_10',   icon:'🥉', title:'10 מדליות ארד',    desc:'10 פרקים עם מדליית ארד',    check: ctx => (ctx.medalsCount && ctx.medalsCount.bronze>=10),   reward:100 },
  { id:'medals_silver_10',   icon:'🥈', title:'10 מדליות כסף',    desc:'10 פרקים עם מדליית כסף',    check: ctx => (ctx.medalsCount && ctx.medalsCount.silver>=10),   reward:100 },
  { id:'medals_gold_10',     icon:'🥇', title:'10 מדליות זהב',    desc:'10 פרקים עם מדליית זהב',    check: ctx => (ctx.medalsCount && ctx.medalsCount.gold>=10),     reward:100 },
  { id:'medals_platinum_10', icon:'💎', title:'10 מדליות פלטינה', desc:'10 פרקים עם מדליית פלטינה', check: ctx => (ctx.medalsCount && ctx.medalsCount.platinum>=10), reward:100 },
  // שינון - סדרה דינמית 5/10/15/20/25 (80/200/300/400/500), אז כל 5 עוד 100 (30=600 ... 150=3000)
  { id:'mem_5',    icon:'🧠', title:'5 פרקים בעל פה',desc:'למדת 5 פרקים בעל פה',   check: ctx => ctx.memorized >= 5,     reward:80 },
  { id:'mem_10',    icon:'🎯', title:'10 פרקים בעל פה',desc:'למדת 10 פרקים בעל פה',   check: ctx => ctx.memorized >= 10,     reward:200 },
  { id:'mem_15',    icon:'✨', title:'15 פרקים בעל פה',desc:'למדת 15 פרקים בעל פה',   check: ctx => ctx.memorized >= 15,     reward:300 },
  { id:'mem_20',    icon:'🎓', title:'20 פרקים בעל פה',desc:'למדת 20 פרקים בעל פה',   check: ctx => ctx.memorized >= 20,     reward:400 },
  { id:'mem_25',    icon:'🌟', title:'25 פרקים בעל פה',desc:'למדת 25 פרקים בעל פה',   check: ctx => ctx.memorized >= 25,     reward:500 },
  { id:'mem_30',   icon:'🏆', title:'30 פרקים בעל פה',desc:'למדת 30 פרקים בעל פה',  check: ctx => ctx.memorized >= 30,    reward:600 },
  { id:'mem_35',   icon:'🏆', title:'35 פרקים בעל פה',desc:'למדת 35 פרקים בעל פה',  check: ctx => ctx.memorized >= 35,    reward:700 },
  { id:'mem_40',   icon:'🏆', title:'40 פרקים בעל פה',desc:'למדת 40 פרקים בעל פה',  check: ctx => ctx.memorized >= 40,    reward:800 },
  { id:'mem_45',   icon:'🏆', title:'45 פרקים בעל פה',desc:'למדת 45 פרקים בעל פה',  check: ctx => ctx.memorized >= 45,    reward:900 },
  { id:'mem_50',   icon:'💎', title:'50 פרקים בעל פה',desc:'למדת 50 פרקים בעל פה',  check: ctx => ctx.memorized >= 50,    reward:1000 },
  { id:'mem_55',   icon:'💎', title:'55 פרקים בעל פה',desc:'למדת 55 פרקים בעל פה',  check: ctx => ctx.memorized >= 55,    reward:1100 },
  { id:'mem_60',   icon:'💎', title:'60 פרקים בעל פה',desc:'למדת 60 פרקים בעל פה',  check: ctx => ctx.memorized >= 60,    reward:1200 },
  { id:'mem_65',   icon:'💎', title:'65 פרקים בעל פה',desc:'למדת 65 פרקים בעל פה',  check: ctx => ctx.memorized >= 65,    reward:1300 },
  { id:'mem_70',   icon:'💎', title:'70 פרקים בעל פה',desc:'למדת 70 פרקים בעל פה',  check: ctx => ctx.memorized >= 70,    reward:1400 },
];

function coversRange(set, from, to) {
  for (let i = from; i <= to; i++) if (!set.has(i)) return false;
  return true;
}

function getBadgeContext() {
  let readings = [];
  try { readings = JSON.parse(localStorage.getItem('tehillim_readings')||'[]'); } catch(e){}
  const completed = readings.filter(r => !r.partial);
  const uniqueRead = new Set(completed.map(r => +r.chap));
  const totalMinutes = Math.round(completed.reduce((a,r)=>a+(r.secs||0),0)/60);
  // ספירת מדליות לפי משך קריאה לפרק
  const medalsCount = {bronze:0, silver:0, platinum:0, gold:0};
  for (const r of completed) {
    const mins = (r.secs||0)/60;
    if (mins >= 45) medalsCount.platinum++;
    else if (mins >= 30) medalsCount.gold++;
    else if (mins >= 15) medalsCount.silver++;
    else if (mins >= 5) medalsCount.bronze++;
  }
  // האם השלים את פרקי היום (לפי תאריך עברי)
  let dailyPsalmsCompleted = 0;
  try {
    const data2 = load();
    dailyPsalmsCompleted = Object.keys(data2.dailyChaptersBonus||{}).length;
  } catch(e){}
  let morning = 0, night = 0;
  for (const r of completed) {
    if (!r.ts) continue;
    const h = new Date(r.ts).getHours();
    if (h < 7)  morning++;
    if (h >= 22) night++;
  }
  const data = load();
  return {
    uniqueRead,
    totalMinutes,
    morningCount: morning,
    nightCount: night,
    longestStreak: data.streak.longest||0,
    memorized: data.memorized.count||0,
    medalsCount,
    dailyPsalmsCompleted
  };
}

function checkAndAwardBadges() {
  const data = load();
  data.badgesEarned = data.badgesEarned || {};
  const ctx = getBadgeContext();
  const newlyEarned = [];
  for (const b of BADGES) {
    if (data.badgesEarned[b.id]) continue;
    try {
      if (b.check(ctx)) {
        data.badgesEarned[b.id] = today();
        newlyEarned.push(b);
      }
    } catch(e){}
  }
  if (newlyEarned.length) {
    save(data);
    // הענק מעלות עבור כל badge חדש
    for (const b of newlyEarned) addMaalot(b.reward, 'badge:' + b.id);
  }
  return newlyEarned;
}

function getBadgesStatus() {
  const data = load();
  const earned = data.badgesEarned || {};
  return BADGES.map(b => ({
    ...b,
    earned: !!earned[b.id],
    earnedDate: earned[b.id] || null
  }));
}

/* ─── חשיפה גלובלית ─── */
global.Gamification = {
  LEVELS, levelOf,
  load, save,
  addMaalot,
  tickStreak,
  recordChapterRead,
  syncMemorizedFromMems,
  onChapterCompleted,
  getStats,
  showMaalotToast,
  bookOf,
  // Challenges 1.4.0
  CHALLENGES, getActiveChallenges, claimChallenge, getChallengeMetrics,
  // Badges 1.5.0
  BADGES, checkAndAwardBadges, getBadgesStatus, getBadgeContext,
  getDailyChapters, DAILY_CHAPS_BY_DAY
};
})(window);
