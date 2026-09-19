/* Firebase Cloud Messaging background worker */
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

try {
  firebase.initializeApp({
    apiKey: 'AIzaSyAvFtkxNmfd_kcqRYPTim8ryuQjs96m48',
    authDomain: 'nursingofficerapp.firebaseapp.com',
    projectId: 'nursingofficerapp',
    storageBucket: 'nursingofficerapp.firebasestorage.app',
    messagingSenderId: '525416638989',
    appId: '1:525416638989:web:108dcd9f187c95f596c344'
  });

  const messaging = firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    const n = payload.notification || {};
    const d = payload.data || {};
    const title = n.title || d.title || 'Nursing Officer Exam Prep';
    const body = n.body || d.body || 'नवीन सूचना व सराव पेपर उपलब्ध आहे.';
    const image = n.imageUrl || n.image || d.image || undefined;
    const icon = d.icon || '/pwa-192x192.png';

    const options = {
      body: body,
      icon: icon,
      badge: '/pwa-192x192.png',
      image: image,
      tag: d.tag || ('nursing-' + Date.now()),
      renotify: true,
      vibrate: [200, 100, 200],
      data: {
        ...d,
        target_tab: d.tab || 'dashboard',
        url: d.url || (d.tab ? '/?tab=' + d.tab : '/')
      },
      actions: [
        { action: 'open', title: 'पहा (Open)' },
        { action: 'close', title: 'Dismiss' }
      ]
    };

    return self.registration.showNotification(title, options);
  });
} catch (e) {
  console.warn('[SW] Firebase messaging compat init bypassed:', e);
}

// Fallback direct Push API event listener
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    let data = {};
    try {
      data = event.data.json();
    } catch {
      data = { body: event.data.text() };
    }

    const title = data.title || data.notification?.title || 'Nursing Officer Exam Prep';
    const body = data.body || data.notification?.body || 'नवीन अपडेट आले आहे.';
    const image = data.image || data.notification?.imageUrl || data.notification?.image || undefined;

    const options = {
      body: body,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      image: image,
      tag: data.tag || ('push-' + Date.now()),
      renotify: true,
      vibrate: [200, 100, 200],
      data: data.data || data,
      actions: [
        { action: 'open', title: 'पहा (Open)' }
      ]
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error('[SW] Push listener error:', err);
  }
});

// Handle Notification Click / Deep-Linking
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const data = event.notification.data || {};
  const targetTab = data.tab || data.target_tab || 'dashboard';
  const customUrl = data.url;
  const targetUrl = customUrl && customUrl.startsWith('http')
    ? customUrl
    : (self.location.origin + '/?tab=' + targetTab);

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if tab is already open
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.postMessage({
            type: 'NOTIFICATION_DEEP_LINK',
            targetTab: targetTab,
            data: data
          });
          return client.focus();
        }
      }
      // If not open, open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
