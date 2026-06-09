/* api/tts.js — Vercel Serverless Function
   פרוקסי ל-Google Cloud Text-to-Speech (קול גברי עברי איכותי).
   המפתח נשמר ב-משתנה סביבה GOOGLE_TTS_KEY ב-Vercel (לא בקוד!).
   קלט: POST JSON { text, voice?, pitch?, rate? }
   פלט: audio/mpeg (MP3). */
module.exports = async (req, res) => {
  // הגבלת מקור בסיסית (להפחתת ניצול לרעה). מאפשר אותו דומיין / Vercel / localhost.
  const origin = req.headers.origin || '';
  const okOrigin = !origin || /\.vercel\.app$/.test(origin) || /^https?:\/\/localhost(:\d+)?$/.test(origin) || origin === process.env.ALLOWED_ORIGIN;
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
  const text = String(body.text || '').slice(0, 900);
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
