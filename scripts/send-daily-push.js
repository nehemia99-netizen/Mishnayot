/* תזכורת לימוד יומית — נשלח דרך GitHub Actions (firebase-admin).
   קורא pushTokens, שולח הודעת data, ומנקה token-ים לא תקפים. */
const admin = require('firebase-admin');

const TITLE = '📖 משנה יומית';
const BODY  = 'הגיע הזמן ללמוד את המשנה היומית 🌟';
const URL   = '01-dashboard.html';

if (!process.env.FIREBASE_SA) { console.error('Missing FIREBASE_SA secret'); process.exit(1); }
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SA)) });
const db = admin.firestore();
const messaging = admin.messaging();

(async () => {
  const snap = await db.collection('pushTokens').get();
  const docs = snap.docs.filter(d => d.data() && d.data().token);
  console.log('pushTokens with token:', docs.length);
  if (!docs.length) { console.log('nothing to send'); return; }

  const messages = docs.map(d => ({
    token: d.data().token,
    data:  { title: TITLE, body: BODY, url: URL, tag: 'daily' },
    webpush: { headers: { Urgency: 'high', TTL: '43200' } }
  }));

  let ok = 0, fail = 0; const toDelete = [];
  for (let i = 0; i < messages.length; i += 500) {
    const res = await messaging.sendEach(messages.slice(i, i + 500));
    res.responses.forEach((r, j) => {
      if (r.success) { ok++; return; }
      fail++;
      const code = (r.error && r.error.code) || '';
      if (code.includes('registration-token-not-registered') || code.includes('invalid-argument')) {
        toDelete.push(docs[i + j].ref);
      }
    });
  }
  console.log(`sent ok=${ok} fail=${fail}`);
  for (const ref of toDelete) { try { await ref.delete(); } catch (e) {} }
  if (toDelete.length) console.log('cleaned invalid tokens:', toDelete.length);
})().catch(e => { console.error(e); process.exit(1); });
