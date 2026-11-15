/* 小窝 PWA Service Worker：只缓存本站外壳，不缓存 API、聊天请求或用户数据。 */
const CACHE = 'our-home-shell-v2';
const CACHE_PREFIX = 'our-home-shell-';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon.svg'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin || /\/api(?:\/|$)/.test(url.pathname)) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put('./index.html', copy));
        }
        return response;
      }).catch(() => caches.match('./index.html').then(cached => cached || caches.match('./')))
    );
    return;
  }

  if (/\.(?:html|css|js|svg|png|webmanifest)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then(cached => {
        const fresh = fetch(req).then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(req, copy));
          }
          return response;
        }).catch(() => cached);
        return cached || fresh;
      })
    );
  }
});
