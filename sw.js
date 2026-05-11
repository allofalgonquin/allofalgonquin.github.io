const CACHE = 'algonquin-trip-log-v1';
const PRECACHE = ['/trip-log/', '/trip-log/index.html', '/trip-log/manifest.json'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(cached => {
    if (cached) return cached;
    return fetch(e.request).then(response => {
      if (!response || response.status !== 200 || e.request.method !== 'GET') return response;
      const clone = response.clone();
      caches.open(CACHE).then(cache => cache.put(e.request, clone));
      return response;
    }).catch(() => { if (e.request.mode === 'navigate') return caches.match('/trip-log/index.html'); });
  }));
});
