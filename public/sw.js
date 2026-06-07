self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    clients.claim().then(() => {
      // Forza reload di tutte le tab aperte quando il SW si aggiorna
      return clients.matchAll({ type: 'window' }).then(list => {
        list.forEach(c => c.navigate(c.url));
      });
    })
  );
});

// Riceve le notifiche push dal server
self.addEventListener('push', e => {
  const data = e.data?.json() ?? {};
  const title = data.title ?? 'Sliss';
  const options = {
    body: data.body ?? '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: data.tag ?? 'sliss-notification',
    renotify: true,
    data: { url: data.url ?? '/' }
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// Click sulla notifica → apre l'app SULLA destinazione giusta
// (anche se una finestra è già aperta: prima navigava solo a fuoco = "non sai cosa hai aperto")
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url ?? '/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const existing = list.find(c => c.url.includes(self.location.origin));
      if (existing) {
        return Promise.resolve(existing.navigate(url)).catch(() => null).then(() => existing.focus());
      }
      return clients.openWindow(url);
    })
  );
});
