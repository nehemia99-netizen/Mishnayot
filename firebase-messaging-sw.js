/* ═══════════════════════════════════════════════════════
   משנתי — Firebase Cloud Messaging (Push ברקע)
   נטען אוטומטית ע"י FCM בכניסה (scope: /firebase-cloud-messaging-push-scope)
   ═══════════════════════════════════════════════════════ */
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB413Gtcwy5DcQHK4yXb1egMhUEwjJ0jhA",
  authDomain: "mishnayot-71073.firebaseapp.com",
  projectId: "mishnayot-71073",
  storageBucket: "mishnayot-71073.firebasestorage.app",
  messagingSenderId: "445059664136",
  appId: "1:445059664136:web:fec8a4f338fd326d3b04bd"
});

const messaging = firebase.messaging();

// חלון שבת: ערב שבת (שישי מ-16:00) עד מוצ"ש (שבת עד 21:00)
function _inShabbatWindow() {
  const now = new Date(), day = now.getDay(), h = now.getHours();
  if (day === 5) return h >= 16;
  if (day === 6) return h < 21;
  return false;
}
// קורא את העדפת "השתקה בשבת" מ-IndexedDB (נכתבת ע"י דף ההגדרות)
function _noShabbatPref() {
  return new Promise(function(res) {
    try {
      const req = indexedDB.open('mishnayon_prefs', 1);
      req.onupgradeneeded = e => { const db = e.target.result; if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv'); };
      req.onsuccess = e => { try { const r = e.target.result.transaction('kv').objectStore('kv').get('noShabbatNotif'); r.onsuccess = () => res(!!r.result); r.onerror = () => res(false); } catch(_) { res(false); } };
      req.onerror = () => res(false);
    } catch(_) { res(false); }
  });
}

// הודעות data-only (כך אנו שולטים בתצוגה ואין כפילות)
messaging.onBackgroundMessage(function(payload) {
  const d = (payload && payload.data) || {};
  return _noShabbatPref().then(function(silence) {
    if (silence && _inShabbatWindow()) return; // המשתמש ביקש לא לקבל התראות בשבת
    return self.registration.showNotification(d.title || 'משנתי', {
      body: d.body || '',
      icon: '4.jpg',
      badge: '4.jpg',
      dir:  'rtl',
      lang: 'he',
      tag:  d.tag || 'mishnayon',
      data: { url: d.url || '01-dashboard.html' }
    });
  });
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '01-dashboard.html';
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
    for (const c of list) { if ('focus' in c) { c.focus(); if (c.navigate) c.navigate(url); return; } }
    return clients.openWindow(url);
  }));
});
