try {
  importScripts('/sp-push-worker-fb.js');
} catch (e) { }

const CACHE_NAME = `raices-cache-${new Date().getTime()}`;

const ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
];


self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});


self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});


self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Si la respuesta es válida, la guardamos/actualizamos en la caché
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
        });

        return response || fetchPromise;
      });
    })
  );
});

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : { title: 'Nuevo mensaje', body: 'Tienes una nueva notificación' };
  } catch (e) {
    payload = { title: 'Notificación', body: event.data ? event.data.text() : 'Tienes una nueva notificación' };
  }

  const title = payload.title || 'Raíces Burger';
  const options = {
    body: payload.body || '',
    icon: payload.icon || '/img/favicon.png',
    badge: payload.badge || '/img/favicon.png',
    data: payload.data || {}
  };

  event.waitUntil(self.registration.showNotification(title, options));
});