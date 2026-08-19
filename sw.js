/* ═══════════════════════════════════════════════════
   משנתי — Service Worker v1.5.75
   (מבוסס על מנוע תהילהון 2.7.83 — מזלג עצמאי)
   • קבצי האפליקציה (HTML/JS) → Network-First (רענון מיידי, fallback לcache)
   • Sefaria API → Network-First
   • CDN (Chart.js וכו') → Cache-First
═══════════════════════════════════════════════════ */

const CACHE_VER  = 'mishnayon-v1.5.113';
const SEFARIA    = 'www.sefaria.org';

const APP_SHELL  = [
  './01-dashboard.html',
  './02-selection.html',
  './03-reader.html',
  './04-history.html',
  './05-yizkor.html',
  './06-settings.html',
  './07-community.html',
  './08-group.html',
  './09-saved.html',
  './10-sequence.html',
  './blessings.html',
  './guide.html',
  './terms.html',
  './manifest.json',
  './utils.js',
  './errlog.js',
  './corpus.js',
  './bottomnav.js',
  './i18n.js',
  './gamification.js',
  './notifications.js',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

/* ── טקסט המשנה המלא לאופליין: 63 קבצים פר-מסכת (~3MB, נטענים על-פי דרישה בקורא) ──
   נשמרים best-effort בהתקנה כדי שכל המשנה תהיה זמינה גם בלי רשת. */
const MISHNAH_TEXT_FILES = [
  './mishnah-text/Arakhin.js', './mishnah-text/AvodahZarah.js', './mishnah-text/BavaBatra.js',
  './mishnah-text/BavaKamma.js', './mishnah-text/BavaMetzia.js', './mishnah-text/Beitzah.js',
  './mishnah-text/Bekhorot.js', './mishnah-text/Berakhot.js', './mishnah-text/Bikkurim.js',
  './mishnah-text/Chagigah.js', './mishnah-text/Challah.js', './mishnah-text/Chullin.js',
  './mishnah-text/Demai.js', './mishnah-text/Eduyot.js', './mishnah-text/Eruvin.js',
  './mishnah-text/Gittin.js', './mishnah-text/Horayot.js', './mishnah-text/Kelim.js',
  './mishnah-text/Keritot.js', './mishnah-text/Ketubot.js', './mishnah-text/Kiddushin.js',
  './mishnah-text/Kilayim.js', './mishnah-text/Kinnim.js', './mishnah-text/MaaserSheni.js',
  './mishnah-text/Maasrot.js', './mishnah-text/Makhshirin.js', './mishnah-text/Makkot.js',
  './mishnah-text/Megillah.js', './mishnah-text/Meilah.js', './mishnah-text/Menachot.js',
  './mishnah-text/Middot.js', './mishnah-text/Mikvaot.js', './mishnah-text/MoedKatan.js',
  './mishnah-text/Nazir.js', './mishnah-text/Nedarim.js', './mishnah-text/Negaim.js',
  './mishnah-text/Niddah.js', './mishnah-text/Oholot.js', './mishnah-text/Oktzin.js',
  './mishnah-text/Orlah.js', './mishnah-text/Parah.js', './mishnah-text/Peah.js',
  './mishnah-text/Pesachim.js', './mishnah-text/PirkeiAvot.js',
  './mishnah-text/RoshHashanah.js', './mishnah-text/Sanhedrin.js', './mishnah-text/Shabbat.js',
  './mishnah-text/Shekalim.js', './mishnah-text/Sheviit.js', './mishnah-text/Shevuot.js',
  './mishnah-text/Sotah.js', './mishnah-text/Sukkah.js', './mishnah-text/Taanit.js',
  './mishnah-text/Tahorot.js', './mishnah-text/Tamid.js', './mishnah-text/Temurah.js',
  './mishnah-text/Terumot.js', './mishnah-text/TevulYom.js', './mishnah-text/Yadayim.js',
  './mishnah-text/Yevamot.js', './mishnah-text/Yoma.js', './mishnah-text/Zavim.js',
  './mishnah-text/Zevachim.js',
];

/* ── Install: cache the entire app shell ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VER)
      .then(cache => cache.addAll(APP_SHELL)
        // טקסט המשנה best-effort — כישלון בקובץ בודד לא ישבור את ההתקנה
        .then(() => Promise.allSettled(MISHNAH_TEXT_FILES.map(u => cache.add(u)))))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] Install cache error:', err))
  );
});

/* ── Activate: remove old caches ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_VER).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ── Message handler: skip waiting on demand ── */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/* ── Notification click: פתח את האפליקציה ── */
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url)
    ? event.notification.data.url
    : '01-dashboard.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if ('focus' in client) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      return clients.openWindow(url);
    })
  );
});

/* ── Fetch ── */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  /* ── Sefaria API: Network-First ── */
  if (url.hostname === SEFARIA) {
    event.respondWith(networkFirst(request));
    return;
  }

  /* ── CDN files: Cache-First ── */
  if (url.hostname === 'cdnjs.cloudflare.com') {
    event.respondWith(cacheFirst(request));
    return;
  }

  /* ── App files: Network-First ── */
  event.respondWith(networkFirst(request));
});

/* === Strategies === */

function networkFirst(request) {
  return fetch(request)
    .then(response => {
      if (response.ok) {
        const clone = response.clone();
        caches.open(CACHE_VER).then(c => c.put(request, clone));
      }
      return response;
    })
    .catch(() => caches.match(request).then(r => r || Response.error()));
}

function cacheFirst(request) {
  return caches.match(request).then(cached => {
    if (cached) return cached;
    return fetch(request).then(response => {
      if (response.ok) {
        const clone = response.clone();
        caches.open(CACHE_VER).then(c => c.put(request, clone));
      }
      return response;
    });
  });
}