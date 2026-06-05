/* התראת "חבר חדש בקבוצה" — poll כל 15 דק' דרך GitHub Actions.
   מוצא חברים שהצטרפו מאז הסריקה האחרונה ומודיע ליוצר/מנהל הקבוצה. */
const admin = require('firebase-admin');
if (!process.env.FIREBASE_SA) { console.error('Missing FIREBASE_SA'); process.exit(1); }
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SA)) });
const db = admin.firestore();
const messaging = admin.messaging();
const STATE = db.doc('meta/pushState');

(async () => {
  const st = await STATE.get();
  const lastScan = (st.exists && st.data().lastMemberScan) || (Date.now() - 20 * 60 * 1000);
  const nowScan = Date.now();
  console.log('scanning members joined after', new Date(lastScan).toISOString());

  const groups = await db.collection('groups').get();
  const messages = [];
  for (const g of groups.docs) {
    const gd = g.data() || {};
    const creatorUid = gd.createdBy;
    if (!creatorUid) continue;
    let mem;
    try { mem = await g.ref.collection('members').where('joinedAt', '>', lastScan).get(); }
    catch (e) { console.warn('members query failed for', g.id, e.message); continue; }
    if (mem.empty) continue;
    const tokSnap = await db.doc('pushTokens/' + creatorUid).get();
    const token = tokSnap.exists && tokSnap.data().token;
    if (!token) continue;
    mem.docs.forEach(m => {
      if (m.id === creatorUid) return; // לא להודיע ליוצר על עצמו
      const name = (m.data() && m.data().displayName) || 'מישהו';
      messages.push({
        token,
        data: { title: '👥 חבר חדש בקבוצה', body: name + ' הצטרף ל"' + (gd.name || 'הקבוצה') + '"', url: '08-group.html?open=' + g.id, tag: 'member-' + g.id },
        webpush: { headers: { Urgency: 'high', TTL: '86400' } }
      });
    });
  }

  console.log('notifications to send:', messages.length);
  let ok = 0, fail = 0;
  for (let i = 0; i < messages.length; i += 500) {
    const res = await messaging.sendEach(messages.slice(i, i + 500));
    res.responses.forEach(r => { r.success ? ok++ : fail++; });
  }
  console.log(`sent ok=${ok} fail=${fail}`);
  await STATE.set({ lastMemberScan: nowScan }, { merge: true });
})().catch(e => { console.error(e); process.exit(1); });
