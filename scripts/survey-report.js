/* survey-report.js — מפיק דוח מסכם מאוסף surveys ב-Firestore.
   רץ דרך GitHub Actions עם secret FIREBASE_SA.
   פלט: (1) מודפס בלוג · (2) survey-report.md (artifact) · (3) מרונדר בעמוד ה-Summary של הריצה. */
const admin = require('firebase-admin');
const fs = require('fs');

if (!process.env.FIREBASE_SA) { console.error('Missing FIREBASE_SA secret'); process.exit(1); }
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SA)) });
const db = admin.firestore();

function pct(n, total) { return total ? Math.round(n / total * 100) : 0; }
function bar(p) { const f = Math.round(p / 5); return '█'.repeat(f) + '░'.repeat(20 - f); }
function countMap(arr) { const m = {}; arr.forEach(v => { if (v) m[v] = (m[v] || 0) + 1; }); return m; }
function rankedLines(m, total) {
  const e = Object.entries(m).sort((a, b) => b[1] - a[1]);
  if (!e.length) return '(אין נתונים)';
  return e.map(([k, n]) => `${String(pct(n, total)).padStart(3)}%  ${bar(pct(n, total))}  ${k}  (${n})`).join('\n');
}
// כותרת + בלוק קוד מונוספייס (כדי שהפסים יישארו מיושרים גם ב-Summary המרונדר)
function block(title, body) { return `\n## ${title}\n\n\`\`\`\n${body}\n\`\`\`\n`; }
function texts(docs, field, title) {
  const arr = docs.map(d => (d[field] || '').trim()).filter(Boolean);
  if (!arr.length) return '';
  return `\n## ${title} (${arr.length})\n` + arr.map(t => `- ${t.replace(/\s+/g, ' ')}`).join('\n') + '\n';
}

(async () => {
  const snap = await db.collection('surveys').get();
  const docs = snap.docs.map(d => d.data());
  const N = docs.length;
  let out = `# 📊 דוח סקר משתמשים — ${N} תשובות\n_הופק: ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC_\n`;

  const byApp = countMap(docs.map(d => d.app || '?'));
  out += `\n**לפי אפליקציה:** ` + (Object.entries(byApp).map(([k, n]) => `${k}: ${n}`).join(' · ') || '—') + '\n';

  if (N) {
    out += block('1. תדירות שימוש', rankedLines(countMap(docs.map(d => d.freq)), N));

    const useAll = []; docs.forEach(d => (d.use || []).forEach(u => useAll.push(u)));
    out += block('2. שימוש עיקרי (% מהמשיבים)', rankedLines(countMap(useAll), N));

    const favAll = []; docs.forEach(d => (d.fav || []).forEach(f => favAll.push(f)));
    out += block("3. 🏆 הפיצ'רים האהובים — דירוג (% שבחרו בטופ-3)", rankedLines(countMap(favAll), N));

    const sats = docs.map(d => d.satisfaction).filter(s => s >= 1 && s <= 5);
    const satAvg = sats.length ? (sats.reduce((a, b) => a + b, 0) / sats.length).toFixed(2) : '—';
    let satBody = '';
    for (let s = 5; s >= 1; s--) { const n = sats.filter(x => x === s).length; satBody += `${s}⭐  ${bar(pct(n, sats.length))}  ${pct(n, sats.length)}%  (${n})\n`; }
    out += block(`4. שביעות רצון — ממוצע ${satAvg}/5  (${sats.length} ענו)`, satBody.trim());

    const nps = docs.map(d => d.nps).filter(x => x >= 0 && x <= 10);
    const prom = nps.filter(x => x >= 9).length, det = nps.filter(x => x <= 6).length, pas = nps.filter(x => x === 7 || x === 8).length;
    const npsScore = nps.length ? Math.round((prom - det) / nps.length * 100) : '—';
    out += block(`7. NPS (המלצה) — ציון ${npsScore}  (${nps.length} ענו)`, `מקדמים (9-10): ${prom}\nניטרליים (7-8): ${pas}\nמקטרגים (0-6): ${det}`);

    out += block('8. איך הגיעו לאפליקציה', rankedLines(countMap(docs.map(d => d.source)), N));

    out += texts(docs, 'missing', '5. 💡 מה חסר / מה להוסיף');
    out += texts(docs, 'problems', '6. ⚠️ מה מפריע / לא עובד');
    out += texts(docs, 'comments', '9. 💬 הערות נוספות');
  } else {
    out += '\nאין עדיין תשובות. (לאחר שמשתמשים ימלאו את הסקר — הריצו שוב.)\n';
  }

  console.log(out);
  fs.writeFileSync('survey-report.md', out);
  // הצגה מרונדרת בעמוד ה-Summary של הריצה
  try { if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, out); } catch (e) {}
})().catch(e => { console.error(e); process.exit(1); });
