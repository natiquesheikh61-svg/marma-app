// Offline helper. Saves the website in the browser so it opens without internet.
// When you change any file, increase this number by 1 so phones get the new version.
const VERSION = 'marma-v1';

const FILES = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './data/phrases.json',
  './data/dictionary.json',
  './icons/icon-192.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Show the saved copy at once; quietly fetch a fresh copy when there is internet.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
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
