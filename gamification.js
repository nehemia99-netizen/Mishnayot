/* ════════════════════════════════════════════════════════════
   תהילהון — מודול גמיפיקציה (זכויות, רצפים, רמות)
   נוצר: 1.2.0 (10.5.2026)
   ──────────────────────────────────────────────────────────────
   מודל נתונים ב-localStorage:

   tehillim_gamification = {
     ma'alot: {
       total: 0,            // סך זכויות שנצברו אי פעם (לא מתאפס לעולם)
       weekly: 0,           // זכויות השבוע (מתאפס בסוף שבוע)
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
       byOrder: [0,0,0,0,0,0]  // לפי 6 סדרי המשנה
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
  { key:'בקיא',       en:'Expert',                 min: 5000, icon:'👑' },
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
  data.chaptersRead = data.chaptersRead || { total:0, unique:[], byOrder:[0,0,0,0,0,0] };
  if (!data.chaptersRead.byOrder) data.chaptersRead.byOrder = [0,0,0,0,0,0];
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

/* ─── הוספת זכויות ─── */
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

/* ─── פרקים שנלמדו (לפי 6 סדרי המשנה) ─── */
const ORDER_IDS = ['Zeraim','Moed','Nashim','Nezikin','Kodashim','Tahorot'];
// אינדקס הסדר (0–5) של מזהה פרק "Tractate.Perek"
function bookOf(chapId) {
  try {
    if (typeof Corpus === 'undefined') return -1;
    const p = Corpus.parseChapId(chapId); if (!p) return -1;
    const t = Corpus.getTractate(p.tractate); if (!t) return -1;
    return ORDER_IDS.indexOf(t.order);
  } catch(e) { return -1; }
}
function isValidChap(chapId) {
  if (typeof Corpus === 'undefined') return !!chapId;
  const p = Corpus.parseChapId(chapId); if (!p) return false;
  const t = Corpus.getTractate(p.tractate);
  return !!(t && p.perek >= 1 && p.perek <= t.length);
}
// האם הקבוצה מכסה את כל פרקי המסכת / הסדר / המשנה כולה
function coversTractate(set, tid) {
  if (typeof Corpus === 'undefined') return false;
  const t = Corpus.getTractate(tid); if (!t) return false;
  for (let p = 1; p <= t.length; p++) if (!set.has(Corpus.chapId(tid, p))) return false;
  return true;
}
function coversOrder(set, orderId) {
  if (typeof Corpus === 'undefined') return false;
  const o = Corpus.getOrder(orderId); if (!o) return false;
  return o.tractates.every(tid => coversTractate(set, tid));
}
function coversAll(set) {
  if (typeof Corpus === 'undefined') return false;
  return Corpus.flatChapters().every(c => set.has(c.id));
}
function recordChapterRead(chapId) {
  const data = load();
  if (!isValidChap(chapId)) return null;
  const id = String(chapId);
  data.chaptersRead.total = (data.chaptersRead.total||0) + 1;
  data.chaptersRead.unique = data.chaptersRead.unique || [];
  if (!data.chaptersRead.unique.includes(id)) data.chaptersRead.unique.push(id);
  data.chaptersRead.byOrder = data.chaptersRead.byOrder || [0,0,0,0,0,0];
  const oi = bookOf(id);
  if (oi >= 0) data.chaptersRead.byOrder[oi] = (data.chaptersRead.byOrder[oi]||0) + 1;
  save(data);
  return data.chaptersRead;
}

/* ─── משניות שנשננו (למדתי בע״פ) — ספירה פר־משנה ─── */
function syncMemorizedFromMems() {
  // המקור הוא tehillim_mem_m (משניות בודדות: "Berakhot.2:3"). כל משנה נספרת לחוד.
  let memM = [];
  try { memM = JSON.parse(localStorage.getItem('tehillim_mem_m')||'[]'); } catch(e){ memM = []; }
  // נפילה רכה לנתונים ישנים (פר־פרק) אם אין עדיין סימוני משנה
  if (!memM.length) {
    try { memM = JSON.parse(localStorage.getItem('tehillim_mem')||'[]'); } catch(e){ memM = []; }
  }
  const data = load();
  data.memorized.chapters = memM.slice();
  data.memorized.count = memM.length;
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
function onChapterCompleted(chapId, secs) {
  // 5 זכויות לפרק שלם + 1 מעלה לכל 10 שניות
  const tenSecUnits = Math.floor((secs||0)/10);
  const pts = 5 + tenSecUnits;
  const r = addMaalot(pts, 'completed-chapter');
  recordChapterRead(chapId);
  tickStreak();

  // (בונוס "המשנה היומית" יתווסף עם שילוב לוח המשנה היומית)

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
    byOrder: fresh.chaptersRead.byOrder||[0,0,0,0,0,0],
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
  div.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(100%);background:#3A7D44;color:#fff;padding:11px 20px;border-radius:24px;font-size:14px;font-weight:600;font-family:system-ui;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.25);transition:transform .35s cubic-bezier(.16,1,.3,1);direction:rtl;';
  let html = '⭐ +' + meta.pts + ' זכויות';
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
    { id:'d_3chaps',  title:'למד 3 פרקים היום',    titleEn:'Study 3 chapters today',       icon:'📖', reward:10, target:3,  metric:'todayChapters' },
    { id:'d_10min',   title:'10 דקות לימוד היום',  titleEn:'10 minutes of study today',    icon:'⏱',  reward:8,  target:10, metric:'todayMinutes' },
    { id:'d_one',     title:'למד לפחות פרק אחד',   titleEn:'Study at least one chapter',   icon:'✅', reward:5,  target:1,  metric:'todayChapters' },
    { id:'d_morning', title:'לימוד לפני 10 בבוקר', titleEn:'Study before 10 AM',           icon:'🌅', reward:12, target:1,  metric:'morningChapters' },
    { id:'d_night',   title:'לימוד אחרי 22:00',    titleEn:'Study after 10 PM',            icon:'🌙', reward:12, target:1,  metric:'nightChapters' }
  ],
  weekly: [
    { id:'w_avot',    title:'סיים את מסכת אבות',       titleEn:'Finish Pirkei Avot',           icon:'📜', reward:50,  target:6,  metric:'weekAvot' },
    { id:'w_15chaps', title:'15 פרקים השבוע',          titleEn:'15 chapters this week',        icon:'📚', reward:35,  target:15, metric:'weekChapters' },
    { id:'w_5days',   title:'למד ב-5 ימים השבוע',     titleEn:'Study on 5 days this week',    icon:'📅', reward:40,  target:5,  metric:'weekActiveDays' },
    { id:'w_60min',   title:'60 דקות לימוד השבוע',    titleEn:'60 minutes of study this week',icon:'⏰',reward:30, target:60, metric:'weekMinutes' }
  ],
  monthly: [
    { id:'m_30days',       title:'למד בכל יום של החודש',           titleEn:'Study every day this month',         icon:'🗓', reward:200, target:28,  metric:'monthActiveDays' },
    { id:'m_100ch',        title:'100 פרקים החודש',                 titleEn:'100 chapters this month',            icon:'💯', reward:120, target:100, metric:'monthChapters' },
    { id:'m_4hours',       title:'4 שעות לימוד החודש',             titleEn:'4 hours of study this month',        icon:'⌛', reward:100, target:240, metric:'monthMinutes' },
    { id:'m_berakhot',     title:'סיים את מסכת ברכות החודש',       titleEn:'Finish Berakhot this month',         icon:'📗', reward:80,  target:9,   metric:'monthBerakhot' },
    { id:'m_zeraim',       title:'40 פרקים בסדר זרעים החודש',      titleEn:'40 chapters in Seder Zeraim',        icon:'📘', reward:80,  target:40,  metric:'monthZeraim' },
    { id:'m_15days_row',   title:'15 ימים רצופים החודש',           titleEn:'15-day streak this month',           icon:'🔥', reward:150, target:15,  metric:'currentStreak' },
    { id:'m_avot_all',     title:'למד את כל 6 פרקי אבות',          titleEn:'Study all 6 chapters of Avot',       icon:'⭐', reward:90,  target:6,   metric:'monthAvotChaps' },
    { id:'m_50min_day',    title:'יום אחד עם 50 דקות',             titleEn:'One day with 50 minutes',            icon:'💪', reward:70,  target:1,   metric:'monthMaxDayMins50' },
    { id:'m_motzashabat',  title:'לימוד במוצאי שבת',               titleEn:'Study on Saturday night',            icon:'✨', reward:35,  target:1,   metric:'monthMotzashabat' },
    { id:'m_rosh_chodesh', title:'לימוד בראש חודש',                 titleEn:'Study on Rosh Chodesh',              icon:'🌙', reward:40,  target:1,   metric:'monthRoshChodesh' }
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
  // עזרים: ספירת פרקים ייחודיים של מסכת / סדר מתוך רשומות (לפי מזהי Corpus)
  function uniqInTractate(arr, tid) {
    const s = new Set();
    arr.forEach(r => { const p = (typeof Corpus!=='undefined') && Corpus.parseChapId(r.chap); if (p && p.tractate === tid) s.add(r.chap); });
    return s.size;
  }
  function uniqInOrder(arr, orderId) {
    const s = new Set();
    arr.forEach(r => { const p = (typeof Corpus!=='undefined') && Corpus.parseChapId(r.chap); if (p) { const t = Corpus.getTractate(p.tractate); if (t && t.order === orderId) s.add(r.chap); } });
    return s.size;
  }
  const weekAvot = uniqInTractate(weekR_done, 'PirkeiAvot');
  return {
    todayChapters: new Set(todayR_done.map(r=>r.chap)).size,
    // זמן - מסך כל הרשומות (כולל partial)
    todayMinutes: Math.round(todayR_all.reduce((a,r)=>a+(r.secs||0),0)/60),
    morningChapters: morning,
    nightChapters: night,
    weekChapters: weekR_done.length,
    weekActiveDays: new Set(weekR_all.filter(r => r.secs > 0).map(r=>r.date)).size,
    weekMinutes: Math.round(weekR_all.reduce((a,r)=>a+(r.secs||0),0)/60),
    weekAvot: weekAvot,
    monthChapters: monthR_done.length,
    monthActiveDays: new Set(monthR_all.filter(r => r.secs > 0).map(r=>r.date)).size,
    monthMinutes: Math.round(monthR_all.reduce((a,r)=>a+(r.secs||0),0)/60),
    // 2.1.0: מטריקות חדשות
    monthBerakhot: uniqInTractate(monthR_done, 'Berakhot'),
    monthZeraim: uniqInOrder(monthR_done, 'Zeraim'),
    currentStreak: (function(){
      try { return load().streak.current||0; } catch(e){ return 0; }
    })(),
    monthAvotChaps: uniqInTractate(monthR_done, 'PirkeiAvot'),
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
  // סדרים שלמים
  { id:'order_zeraim',   icon:'🌾', title:'סדר זרעים הושלם',  desc:'למדת את כל מסכתות סדר זרעים',  check: ctx => coversOrder(ctx.uniqueRead, 'Zeraim'),   reward:300 },
  { id:'order_moed',     icon:'🕯️', title:'סדר מועד הושלם',   desc:'למדת את כל מסכתות סדר מועד',   check: ctx => coversOrder(ctx.uniqueRead, 'Moed'),     reward:300 },
  { id:'order_nashim',   icon:'💍', title:'סדר נשים הושלם',   desc:'למדת את כל מסכתות סדר נשים',   check: ctx => coversOrder(ctx.uniqueRead, 'Nashim'),   reward:300 },
  { id:'order_nezikin',  icon:'⚖️', title:'סדר נזיקין הושלם', desc:'למדת את כל מסכתות סדר נזיקין', check: ctx => coversOrder(ctx.uniqueRead, 'Nezikin'),  reward:300 },
  { id:'order_kodashim', icon:'🔥', title:'סדר קדשים הושלם',  desc:'למדת את כל מסכתות סדר קדשים',  check: ctx => coversOrder(ctx.uniqueRead, 'Kodashim'), reward:300 },
  { id:'order_tahorot',  icon:'💧', title:'סדר טהרות הושלם',  desc:'למדת את כל מסכתות סדר טהרות',  check: ctx => coversOrder(ctx.uniqueRead, 'Tahorot'),  reward:300 },
  { id:'all_shas', icon:'🌟', title:'כל המשנה',      desc:'סיימת את כל ששה סדרי המשנה!', check: ctx => coversAll(ctx.uniqueRead),                reward:1800 },
  // מסכתות מיוחדות
  { id:'avot',     icon:'📜', title:'מסכת אבות',     desc:'סיימת את מסכת אבות',       check: ctx => coversTractate(ctx.uniqueRead, 'PirkeiAvot'), reward:120 },
  { id:'berakhot', icon:'🙏', title:'מסכת ברכות',    desc:'סיימת את מסכת ברכות',      check: ctx => coversTractate(ctx.uniqueRead, 'Berakhot'),   reward:80 },
  // זמן
  { id:'time_60',   icon:'⏰', title:'שעה ראשונה',   desc:'60 דקות לימוד מצטברות',   check: ctx => ctx.totalMinutes >= 60,    reward:30 },
  { id:'time_600',  icon:'🏅', title:'10 שעות',       desc:'600 דקות לימוד מצטברות',  check: ctx => ctx.totalMinutes >= 600,   reward:80 },
  { id:'time_1500', icon:'🏆', title:'25 שעות',       desc:'1,500 דקות לימוד',         check: ctx => ctx.totalMinutes >= 1500,  reward:150 },
  { id:'time_3000', icon:'👑', title:'50 שעות',       desc:'3,000 דקות לימוד',         check: ctx => ctx.totalMinutes >= 3000,  reward:300 },
  // רצפים
  { id:'streak_7',  icon:'🔥', title:'שבוע רצוף',    desc:'7 ימים רצופים של לימוד', check: ctx => ctx.longestStreak >= 7,    reward:60 },
  { id:'streak_30', icon:'💥', title:'חודש רצוף',    desc:'30 ימים רצופים',           check: ctx => ctx.longestStreak >= 30,   reward:200 },
  { id:'streak_100',icon:'⚡', title:'100 ימים רצוף', desc:'100 ימים רצופים — מדהים!', check: ctx => ctx.longestStreak >= 100,  reward:600 },
  // שעות יום
  { id:'morning_5', icon:'🌅', title:'משכים קום',    desc:'5 לימודים לפני 7:00',      check: ctx => ctx.morningCount >= 5,     reward:40 },
  { id:'night_5',   icon:'🌙', title:'לימוד לילה',   desc:'5 לימודים אחרי 22:00',     check: ctx => ctx.nightCount >= 5,       reward:40 },
  // 10 מדליות מכל סוג - 2.0.7
  { id:'medals_bronze_10',   icon:'🥉', title:'10 מדליות ארד',    desc:'10 פרקים עם מדליית ארד',    check: ctx => (ctx.medalsCount && ctx.medalsCount.bronze>=10),   reward:100 },
  { id:'medals_silver_10',   icon:'🥈', title:'10 מדליות כסף',    desc:'10 פרקים עם מדליית כסף',    check: ctx => (ctx.medalsCount && ctx.medalsCount.silver>=10),   reward:100 },
  { id:'medals_gold_10',     icon:'🥇', title:'10 מדליות זהב',    desc:'10 פרקים עם מדליית זהב',    check: ctx => (ctx.medalsCount && ctx.medalsCount.gold>=10),     reward:100 },
  { id:'medals_platinum_10', icon:'💎', title:'10 מדליות פלטינה', desc:'10 פרקים עם מדליית פלטינה', check: ctx => (ctx.medalsCount && ctx.medalsCount.platinum>=10), reward:100 },
  // שינון - סדרה דינמית 5/10/15/20/25 (80/200/300/400/500), אז כל 5 עוד 100 (30=600 ... 150=3000)
  { id:'mem_5',    icon:'🧠', title:'5 משניות בעל פה',desc:'למדת 5 משניות בעל פה',   check: ctx => ctx.memorized >= 5,     reward:80 },
  { id:'mem_10',    icon:'🎯', title:'10 משניות בעל פה',desc:'למדת 10 משניות בעל פה',   check: ctx => ctx.memorized >= 10,     reward:200 },
  { id:'mem_15',    icon:'✨', title:'15 משניות בעל פה',desc:'למדת 15 משניות בעל פה',   check: ctx => ctx.memorized >= 15,     reward:300 },
  { id:'mem_20',    icon:'🎓', title:'20 משניות בעל פה',desc:'למדת 20 משניות בעל פה',   check: ctx => ctx.memorized >= 20,     reward:400 },
  { id:'mem_25',    icon:'🌟', title:'25 משניות בעל פה',desc:'למדת 25 משניות בעל פה',   check: ctx => ctx.memorized >= 25,     reward:500 },
  { id:'mem_30',   icon:'🏆', title:'30 משניות בעל פה',desc:'למדת 30 משניות בעל פה',  check: ctx => ctx.memorized >= 30,    reward:600 },
  { id:'mem_35',   icon:'🏆', title:'35 משניות בעל פה',desc:'למדת 35 משניות בעל פה',  check: ctx => ctx.memorized >= 35,    reward:700 },
  { id:'mem_40',   icon:'🏆', title:'40 משניות בעל פה',desc:'למדת 40 משניות בעל פה',  check: ctx => ctx.memorized >= 40,    reward:800 },
  { id:'mem_45',   icon:'🏆', title:'45 משניות בעל פה',desc:'למדת 45 משניות בעל פה',  check: ctx => ctx.memorized >= 45,    reward:900 },
  { id:'mem_50',   icon:'💎', title:'50 משניות בעל פה',desc:'למדת 50 משניות בעל פה',  check: ctx => ctx.memorized >= 50,    reward:1000 },
  { id:'mem_55',   icon:'💎', title:'55 משניות בעל פה',desc:'למדת 55 משניות בעל פה',  check: ctx => ctx.memorized >= 55,    reward:1100 },
  { id:'mem_60',   icon:'💎', title:'60 משניות בעל פה',desc:'למדת 60 משניות בעל פה',  check: ctx => ctx.memorized >= 60,    reward:1200 },
  { id:'mem_65',   icon:'💎', title:'65 משניות בעל פה',desc:'למדת 65 משניות בעל פה',  check: ctx => ctx.memorized >= 65,    reward:1300 },
  { id:'mem_70',   icon:'💎', title:'70 משניות בעל פה',desc:'למדת 70 משניות בעל פה',  check: ctx => ctx.memorized >= 70,    reward:1400 },
];

function coversRange(set, from, to) {
  for (let i = from; i <= to; i++) if (!set.has(i)) return false;
  return true;
}

function getBadgeContext() {
  let readings = [];
  try { readings = JSON.parse(localStorage.getItem('tehillim_readings')||'[]'); } catch(e){}
  const completed = readings.filter(r => !r.partial);
  const uniqueRead = new Set(completed.map(r => String(r.chap)));
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
    // הענק זכויות עבור כל badge חדש
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

/* ════════════════════════════════════════════════════════════
   חזרה מרווחת (Spaced Repetition — Leitner) — פר־פרק
   mishnah_srs = { "Berakhot.2": { box, due:'YYYY-MM-DD', last } }
   ════════════════════════════════════════════════════════════ */
const SRS_KEY = 'mishnah_srs';
const SRS_INTERVALS = [1, 3, 7, 16, 35, 90]; // ימים לפי תיבה (Leitner)
function _srsLoad() { try { return JSON.parse(localStorage.getItem(SRS_KEY)) || {}; } catch(e) { return {}; } }
function _srsSave(d) { try { localStorage.setItem(SRS_KEY, JSON.stringify(d)); } catch(e){} }
function _srsAddDays(n) { const d = new Date(); d.setDate(d.getDate() + n); return localDateStr(d); }
// תזמון פרק לחזרה: perfect=true מקדם תיבה, אחרת חוזר לתיבה 0
function srsSchedule(chapId, perfect) {
  if (!chapId) return;
  const d = _srsLoad();
  const cur = d[chapId] || { box: 0 };
  const box = perfect ? Math.min((cur.box || 0) + 1, SRS_INTERVALS.length - 1) : 0;
  d[chapId] = { box: box, due: _srsAddDays(SRS_INTERVALS[box]), last: today() };
  _srsSave(d);
  return d[chapId];
}
function srsRemove(chapId) { const d = _srsLoad(); if (d[chapId]) { delete d[chapId]; _srsSave(d); } }
// פרקים שהגיע זמנם לחזרה (due<=today), ממוינים מהוותיק
function srsDueList() {
  const d = _srsLoad(), t = today(), out = [];
  for (const k in d) { if (d[k] && d[k].due <= t) out.push(k); }
  out.sort((a, b) => (d[a].due < d[b].due ? -1 : 1));
  return out;
}
function srsCount() { return srsDueList().length; }
function srsTotal() { return Object.keys(_srsLoad()).length; }

/* ════════════════════════════════════════════════════════════
   אתגר שבועי (Stage D) — שני מצבים: לימוד (קריאה) / שינון
   • mishnah_mem_log = [{id, ts}]  אירועי סימון משנה בע״פ (שינון)
   • mishnah_weekly_mode = 'memorize' | 'read'  (ברירת מחדל: שינון)
   • mishnah_weekly_goal_<mode> = יעד שבועי לכל מצב
   שינון: סופר משניות ייחודיות שסומנו ★ השבוע (מתוך הלוג).
   לימוד:  סופר פרקים ייחודיים שנקראו השבוע (מתוך tehillim_readings).
   גנרי — מתאים גם לתהילהון (שם משנים רק את יחידות-התווית).
   ════════════════════════════════════════════════════════════ */
const MEM_LOG_KEY    = 'mishnah_mem_log';
const WEEKLY_MODE_KEY= 'mishnah_weekly_mode';
const READINGS_KEY   = 'tehillim_readings';
// הגדרות פר-אפליקציה (בתהילהון: שתי היחידות = 'פרקים')
const CHALLENGE_PRESETS = { memorize: [1, 2, 3, 4], read: [3, 7, 9, 14] };
const CHALLENGE_GOAL_DEFAULT = { memorize: 1, read: 7 };
function _chLang(){ try { return (typeof i18n !== 'undefined' && i18n.getCurrentLang) ? i18n.getCurrentLang() : 'he'; } catch(e){ return 'he'; } }
const CHALLENGE_UNITS = { memorize: { he:'משניות', en:'mishnayot' }, read: { he:'פרקים', en:'chapters' } };
const CHALLENGE_TITLES = { memorize: { he:'אתגר שינון שבועי', en:'Weekly Memorization' }, read: { he:'אתגר לימוד שבועי', en:'Weekly Study' } };
function _weekKeyOf(ts) {
  const d = new Date(ts);
  d.setDate(d.getDate() - d.getDay());
  return localDateStr(d);
}
function _memLogLoad() { try { return JSON.parse(localStorage.getItem(MEM_LOG_KEY)) || []; } catch(e) { return []; } }
function _memLogSave(a) { try { localStorage.setItem(MEM_LOG_KEY, JSON.stringify(a)); } catch(e){} }
// רישום אירוע סימון משנה בע״פ (נקרא מהקורא בעת ★)
function logMemEvent(id) {
  if (!id) return;
  const log = _memLogLoad();
  log.push({ id: String(id), ts: Date.now() });
  if (log.length > 800) log.splice(0, log.length - 800);
  _memLogSave(log);
}
// מצב האתגר
function getChallengeMode() {
  const m = localStorage.getItem(WEEKLY_MODE_KEY);
  return (m === 'read' || m === 'memorize') ? m : 'memorize';
}
function setChallengeMode(m) {
  if (m === 'read' || m === 'memorize') localStorage.setItem(WEEKLY_MODE_KEY, m);
}
function _goalKey(mode) { return 'mishnah_weekly_goal_' + mode; }
function getWeeklyMemGoal() {
  const mode = getChallengeMode();
  const v = parseInt(localStorage.getItem(_goalKey(mode)), 10);
  return (v && v > 0) ? v : CHALLENGE_GOAL_DEFAULT[mode];
}
function setWeeklyMemGoal(n) {
  n = parseInt(n, 10);
  if (n && n > 0) localStorage.setItem(_goalKey(getChallengeMode()), String(n));
}
// פרקים ייחודיים שנקראו השבוע (מצב לימוד)
function _readWeekUnique() {
  const wkStart = weekKey();
  let reads = [];
  try { reads = JSON.parse(localStorage.getItem(READINGS_KEY)) || []; } catch(e) {}
  const seen = {};
  for (let i = 0; i < reads.length; i++) {
    const r = reads[i];
    // רק פרקים שהושלמו (לא קריאה חלקית/גלישה) — תואם לספירת ההיסטוריה
    if (r && r.date && r.date >= wkStart && !r.partial) seen[String(r.chap)] = 1;
  }
  return Object.keys(seen).length;
}
// משניות ייחודיות שסומנו ★ השבוע (מצב שינון)
function _memWeekUnique() {
  const wk = weekKey();
  const log = _memLogLoad();
  const seen = {};
  for (let i = 0; i < log.length; i++) {
    const e = log[i];
    if (e && e.ts && _weekKeyOf(e.ts) === wk) seen[e.id] = 1;
  }
  return Object.keys(seen).length;
}
// התקדמות השבוע (מודע-מצב)
function getWeeklyMemProgress() {
  const mode = getChallengeMode();
  const done = (mode === 'read') ? _readWeekUnique() : _memWeekUnique();
  const goal = getWeeklyMemGoal();
  return {
    mode: mode,
    unit: (CHALLENGE_UNITS[mode][_chLang()] || CHALLENGE_UNITS[mode].he),
    title: (CHALLENGE_TITLES[mode][_chLang()] || CHALLENGE_TITLES[mode].he),
    presets: CHALLENGE_PRESETS[mode],
    goal: goal,
    done: done,
    pct: goal ? Math.min(100, Math.round(done / goal * 100)) : 0,
    met: done >= goal,
    weekKey: weekKey()
  };
}
// בונוס השלמת אתגר שבועי: יעד×5, פעם בשבוע לכל מצב, מצטבר בהעלאת יעד.
// מחזיר {reward, mode} אם הוענק עכשיו, אחרת null.
function checkWeeklyChallengeReward() {
  const p = getWeeklyMemProgress();
  if (!p.met) return null;
  const k = 'mishnah_weekly_award_' + p.mode;
  let rewardedGoal = 0;
  const raw = localStorage.getItem(k);
  if (raw) { const parts = raw.split(':'); if (parts[0] === p.weekKey) rewardedGoal = parseInt(parts[1], 10) || 0; }
  if (p.goal <= rewardedGoal) return null;
  const reward = (p.goal - rewardedGoal) * 5;
  localStorage.setItem(k, p.weekKey + ':' + p.goal);
  addMaalot(reward, 'weekly-challenge:' + p.mode);
  return { reward: reward, mode: p.mode };
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
  getDailyChapters, DAILY_CHAPS_BY_DAY,
  // SRS — חזרה מרווחת
  srsSchedule, srsRemove, srsDueList, srsCount, srsTotal,
  // אתגר שבועי (Stage D) — לימוד/שינון
  logMemEvent, getWeeklyMemGoal, setWeeklyMemGoal, getWeeklyMemProgress,
  getChallengeMode, setChallengeMode, checkWeeklyChallengeReward
};
})(window);
