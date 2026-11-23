
const CACHE_VERSION = 'knowya-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const PAGE_CACHE = `${CACHE_VERSION}-pages`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);

      await cache.addAll([
        '/',
        '/index.html',
        '/offline.html',
        '/manifest.webmanifest',
        '/icons/icon-192.png',
        '/icons/icon-512.png',
        '/icons/icon-512-maskable.png'
      ]);

      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();

      await Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName.startsWith('knowya-') &&
            cacheName !== STATIC_CACHE &&
            cacheName !== PAGE_CACHE
          ) {
            return caches.delete(cacheName);
          }
        })
      );

      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    return;
  }

  if (url.origin !== self.location.origin) {
    return;
  }

  if (url.pathname === '/offline.html') {
    event.respondWith(
      caches.match('/offline.html').then((cachedResponse) => {
        return cachedResponse || fetch(request);
      })
    );

    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);

          if (response.ok) {
            const copy = response.clone();
            const cache = await caches.open(PAGE_CACHE);

            await cache.put('/', copy);
          }

          return response;
        } catch (error) {
          const pageCache = await caches.open(PAGE_CACHE);
          const cachedPage = await pageCache.match('/');

          if (cachedPage) {
            return cachedPage;
          }

          const staticCache = await caches.open(STATIC_CACHE);
          const cachedIndex = await staticCache.match('/index.html');

          if (cachedIndex) {
            return cachedIndex;
          }

          return await staticCache.match('/offline.html');
        }
      })()
    );

    return;
  }

  const isStaticResource =
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname === '/manifest.webmanifest' ||
    url.pathname === '/favicon.svg' ||
    url.pathname === '/icons.svg';

  if (isStaticResource) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
          return cachedResponse;
        }

        const response = await fetch(request);

        if (response.ok && response.status === 200) {
          await cache.put(request, response.clone());
        }

        return response;
      })()
    );
  }
});
