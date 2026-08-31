const CACHE_NAME = 'hadeed-v3';

// نحتفظ بالصفحات الأساسية فقط؛ أما JavaScript وCSS فنعيد التحقق منهما من الشبكة أولًا.
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (
    request.method !== 'GET' ||
    url.pathname.startsWith('/api/') ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  // Hashed modules must never be served from an old cache first. This prevents
  // a cached index from requesting a chunk that belongs to an older release.
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(async (response) => {
          const contentType = response.headers.get('content-type') || '';
          const isExpectedScript = request.destination !== 'script' || /javascript|ecmascript/i.test(contentType);
          if (response.ok && isExpectedScript) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          // A SPA rewrite must not masquerade as a JavaScript module.
          if (request.destination === 'script' && /text\/html/i.test(contentType)) {
            return new Response('', { status: 404, statusText: 'JavaScript asset not found' });
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || new Response('', { status: 408, statusText: 'Network Error' });
        })
    );
    return;
  }

  if (request.destination === 'image') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#1e293b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#64748b" font-family="sans-serif" font-size="10">Offline</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        })
    );
    return;
  }

  // HTML is network-first so deployments become visible immediately.
  event.respondWith(
    fetch(request, { cache: 'no-store' })
      .then((response) => {
        if (response.ok && (url.pathname === '/' || url.pathname === '/index.html')) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(async () => {
        const cachedPage = await caches.match(request);
        if (cachedPage) return cachedPage;
        const cachedIndex = await caches.match('/index.html') || await caches.match('/');
        return cachedIndex || new Response(
          '<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>Hadeed — Offline</title></head><body style="background:#020617;color:white;font-family:sans-serif;text-align:center;padding:50px"><h2>أنت غير متصل بالإنترنت</h2><p style="color:#94a3b8">يرجى التحقق من اتصالك بالشبكة وإعادة المحاولة.</p></body></html>',
          { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 503 }
        );
      })
  );
});


self.addEventListener('push', (event) => {
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; } catch { payload = { title: 'Murshid', body: event.data ? event.data.text() : '' }; }
  const title = payload.title || 'Murshid';
  const options = {
    body: payload.body || '',
    icon: payload.icon || '/pwa-192x192.png',
    badge: payload.badge || '/pwa-192x192.png',
    data: { url: payload.url || '/course-newspaper' },
    tag: payload.tag || 'murshid-course-alert'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = event.notification.data?.url || '/course-newspaper';
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
    const existing = windows.find((client) => 'focus' in client);
    if (existing) { existing.navigate(target); return existing.focus(); }
    return clients.openWindow(target);
  }));
});
