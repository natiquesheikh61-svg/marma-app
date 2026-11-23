// Offline helper. Saves the website in the browser so it opens without internet.
// When you change any file, increase this number by 1 so phones get the new version.
const VERSION = 'marma-v4';
const MEDIA = 'marma-media'; // approved voices & pictures from Supabase (kept between versions)

const FILES = [
  './', './index.html', './style.css', './app.js', './config.js',
  './data/phrases.json', './data/categories.json', './icons/icon-192.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== MEDIA).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Approved voices and pictures: keep a copy, use it when offline
  if (url.pathname.includes('/storage/v1/object/public/')) {
    event.respondWith(caches.open(MEDIA).then((cache) => cache.match(req.url).then((saved) =>
      saved || fetch(req).then((res) => { if (res.ok || res.type === 'opaque') cache.put(req.url, res.clone()); return res; })
    )));
    return;
  }
  if (url.origin !== location.origin) return; // database requests go straight to Supabase

  // The app's own files: show the saved copy at once, quietly get a fresh copy when online
  event.respondWith(
    caches.open(VERSION).then((cache) =>
      cache.match(req, { ignoreSearch: true }).then((saved) => {
        const fresh = fetch(req)
          .then((res) => { if (res && res.ok) cache.put(req, res.clone()); return res; })
          .catch(() => saved);
        return saved || fresh;
      })
    )
  );
});
