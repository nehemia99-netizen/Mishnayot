/* api/tts.js — Vercel Serverless Function
   פרוקסי ל-Google Cloud Text-to-Speech (קול גברי עברי איכותי).
   המפתח נשמר ב-משתנה סביבה GOOGLE_TTS_KEY ב-Vercel (לא בקוד!).
   קלט: POST JSON { text, voice?, pitch?, rate? }
   פלט: audio/mpeg (MP3). */
module.exports = async (req, res) => {
  // הגבלת מקור: רק האתר של משנתי עצמו (ספטמבר 2026). עד עכשיו התקבל *כל* אתר ‎*.vercel.app‎ וגם בקשה בלי Origin
  // בכלל — כל אתר זר יכול היה להשתמש במכסת Google TTS שלנו. עכשיו: mishnayot-alpha.vercel.app, כתובות-הפריסה של
  // החשבון (לא "mishnayot-<כלשהו>.vercel.app", שכל אחד יכול לרשום), localhost לפיתוח, ו-ALLOWED_ORIGIN אם מוגדר.
  // דפדפן תמיד שולח Origin ב-POST, גם מאותו אתר ומאפליקציית ה-TWA. (סקריפט יכול לזייף Origin — מפני זה מגינה מכסה
  // יומית ב-Google Cloud.)
  const origin = req.headers.origin || '';
  const OWN_ORIGIN = /^https:\/\/mishnayot-alpha\.vercel\.app$|^https:\/\/mishnayot(-[a-z0-9]+)*-nehemia-s-projects\.vercel\.app$|^https?:\/\/localhost(:\d+)?$/;
  const okOrigin = OWN_ORIGIN.test(origin) || (!!process.env.ALLOWED_ORIGIN && origin === process.env.ALLOWED_ORIGIN);
  if (origin) res.setHeader('Access-Control-Allow-Origin', okOrigin ? origin : 'null');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (!okOrigin) { res.status(403).json({ error: 'forbidden origin' }); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'method not allowed' }); return; }

  const key = process.env.GOOGLE_TTS_KEY;
  if (!key) { res.status(500).json({ error: 'missing GOOGLE_TTS_KEY env var' }); return; }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};
  const text = String(body.text || '').slice(0, 3000);
  if (!text.trim()) { res.status(400).json({ error: 'no text' }); return; }
  const voice = /^he-IL-[A-Za-z0-9-]+$/.test(body.voice || '') ? body.voice : 'he-IL-Wavenet-D'; // male
  const pitch = Math.max(-20, Math.min(20, Number(body.pitch != null ? body.pitch : -5)));   // שלילי = עמוק יותר (טבעי)
  const rate  = Math.max(0.5, Math.min(1.5, Number(body.rate != null ? body.rate : 0.92)));

  try {
    const gResp = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize?key=' + encodeURIComponent(key), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: 'he-IL', name: voice },
        audioConfig: { audioEncoding: 'MP3', pitch, speakingRate: rate }
      })
    });
    const data = await gResp.json();
    if (!gResp.ok || !data.audioContent) {
      res.status(502).json({ error: 'tts failed', detail: (data && data.error) || null });
      return;
    }
    const buf = Buffer.from(data.audioContent, 'base64');
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.status(200).send(buf);
  } catch (e) {
    res.status(500).json({ error: 'server error', detail: String(e && e.message || e) });
  }
};
