// Minimal offline cache for the installed app.
//
// IMPORTANT: bump CACHE_NAME any time this file changes, so a phone that
// already installed the app actually picks up the update instead of
// running the previous service worker forever.
//
// Strategy: network-first for the app shell (index.html), so a code
// update is never masked by a stale cache -- that was the bug in the
// first version of this file. Cache-first for the heavier, rarely-
// changing dependencies (three.js, matter.js, fonts, icons), where speed
// and offline availability matter more than always being byte-for-byte
// current.
const CACHE_NAME = 'ledger-of-the-lost-v2';
const CORE_ASSETS = [
  './manifest.json',
  './favicon.ico',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

function isAppShellRequest(request) {
  // Navigations (opening/reloading the page) and any request for
  // index.html itself always go network-first.
  if (request.mode === 'navigate') return true;
  try {
    const url = new URL(request.url);
    return url.pathname.endsWith('/index.html') || url.pathname.endsWith('/');
  } catch (e) {
    return false;
  }
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  if (isAppShellRequest(event.request)) {
    // Network-first: always try to get the current file. Only fall back
    // to whatever's cached if the network request fails outright (offline).
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              try { cache.put(event.request, copy); } catch (e) {}
            });
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for everything else (CDN scripts, fonts, icons): fast,
  // and safe to reuse since these rarely change under the same URL.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              try { cache.put(event.request, copy); } catch (e) {}
            });
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
