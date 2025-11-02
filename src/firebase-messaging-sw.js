/* eslint-disable no-undef */
/*
  Service Worker for Firebase Messaging (background notifications).
  Important: send data-only messages from server for predictable behavior.
*/

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCvmWGPhjj2KMqHxJ0u5T5kRuEwxuNeQ_Y",
  authDomain: "talbinah-d8b6a.firebaseapp.com",
  projectId: "talbinah-d8b6a",
  storageBucket: "talbinah-d8b6a.appspot.com",
  messagingSenderId: "847205979628",
  appId: "1:847205979628:web:9e75ba6359a3c5ff9c5cc9",
  measurementId: "G-Q6THSK3KG7"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[SW] Background message received:', payload);

  // Payload might be in payload.data (data-only) or payload.notification (legacy).
  const data = payload.data || {};
  const title = data.title || (payload.notification && payload.notification.title) || 'New message';
  const body = data.body || (payload.notification && payload.notification.body) || '';
  const icon = data.icon || (payload.notification && payload.notification.image) || '/assets/icons/icon-72x72.png';

  // Add a tag (use provided or generate simple one)
  const tag = data.tag || ('tag_' + (data.conversationId || data.model_id || Date.now()));

  // Ensure we mark notification as coming from SW so page won't duplicate it
  const notificationData = Object.assign({}, data, { fromSW: '1', url: data.click_action || data.url || '/' });

  const options = {
    body,
    icon,
    data: notificationData,
    tag
  };

  // Avoid showing duplicate notifications with same tag
  self.registration.getNotifications({ tag }).then(notifications => {
    if (notifications.length === 0) {
      self.registration.showNotification(title, options);
    } else {
      // Optionally update existing notification (close & show new)
      // notifications.forEach(n => n.close());
      // self.registration.showNotification(title, options);
      console.log('[SW] Notification with tag already shown - skipping new display');
    }
  }).catch(err => {
    console.warn('[SW] getNotifications error, showing notification anyway', err);
    self.registration.showNotification(title, options);
  });
});

// When user clicks the notification, focus/open the app and navigate if url present
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const clickedData = event.notification.data || {};
  const targetUrl = clickedData.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Try to focus an existing client (exact match or origin)
      for (const client of clientList) {
        try {
          // Try to focus the first client that belongs to our origin
          if (client.url && (client.url === targetUrl || client.url.indexOf(self.location.origin) === 0)) {
            return client.focus();
          }
        } catch (e) {
          // ignore
        }
      }
      // Otherwise open a new window/tab to the target url
      return clients.openWindow(targetUrl);
    })
  );
});
