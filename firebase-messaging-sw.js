/* ═══════════════════════════════════════════════════════
   משניון — Firebase Cloud Messaging (Push ברקע)
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

// הודעות data-only (כך אנו שולטים בתצוגה ואין כפילות)
messaging.onBackgroundMessage(function(payload) {
  const d = (payload && payload.data) || {};
  self.registration.showNotification(d.title || 'משניון', {
    body: d.body || '',
    icon: '4.jpg',
    badge: '4.jpg',
    dir:  'rtl',
    lang: 'he',
    tag:  d.tag || 'mishnayon',
    data: { url: d.url || '01-dashboard.html' }
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
