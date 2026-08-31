// sw.js — Service Worker de la web de la boda de Almu & Dani.
// Estrategia: precache del app shell para poder abrir la web sin conexión
// (útil el día del evento, con cobertura irregular en la finca).

const VERSION = 'v2';
const CACHE   = `boda-almu-dani-${VERSION}`;

const APP_SHELL = [
  './',
  './index.html',
  './invitacion.html',
  './css/styles.css?v=23',
  './css/invitacion.css?v=2',
  './js/config.js',
  './js/form-link.js',
  './js/app.js?v=3',
  './js/confetti.js?v=1',
  './js/roadmap.js?v=3',
  './js/pwa.js',
  './manifest.webmanifest',
  './vendor/bootstrap/bootstrap.min.css',
  './vendor/bootstrap/bootstrap.bundle.min.js',
  './vendor/bootstrap-icons/bootstrap-icons.min.css',
  './vendor/aos/aos.css',
  './vendor/aos/aos.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-180.png',
  './icons/favicon-32.png',
];

const EXTERNAL = [
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.0/dist/confetti.browser.min.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => Promise.all([
      cache.addAll(APP_SHELL),
      ...EXTERNAL.map((url) =>
        cache.add(new Request(url, { mode: 'no-cors' })).catch(() => {})),
    ])).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url        = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // Recursos propios: network-first (siempre frescos online, caché offline)
  if (req.mode === 'navigate' || sameOrigin) {
    event.respondWith(
      fetch(req).then((res) => {
        if (res?.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() =>
        caches.match(req).then((cached) =>
          cached || (req.mode === 'navigate' ? caches.match('./index.html') : undefined))
      )
    );
    return;
  }

  // Externos (fuentes, confetti): cache-first con actualización silenciosa
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((res) => {
        if (res && (res.ok || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
