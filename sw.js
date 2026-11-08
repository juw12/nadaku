// Offline-first service worker. Core files are precached; audio and stroke files are cached the first time they are used.
const CORE = "nadaku-core-v8.1";
const MEDIA = "nadaku-media-v2";
const CORE_FILES = [
  "./", "index.html", "styles.css", "app.js", "words.js", "data.js", "sentences.js", "syllables.js", "indo.js", "tatoeba.js", "exam_ui.js", "guide.js", "exam.js", "pictures.js", "manifest.json",
  "icons/icon-192.png", "icons/icon-512.png",
  "fonts/source-sans-3-latin-400-normal.woff2", "fonts/source-sans-3-latin-600-normal.woff2", "fonts/source-sans-3-latin-ext-400-normal.woff2", "fonts/source-sans-3-latin-ext-600-normal.woff2", "fonts/source-serif-4-latin-600-normal.woff2", "fonts/source-serif-4-latin-ext-600-normal.woff2",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CORE).then((cache) => cache.addAll(CORE_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CORE && k !== MEDIA).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== location.origin) {
    return;
  }
  const isMedia = url.pathname.includes("/audio/") || url.pathname.includes("/strokes/");
  event.respondWith(
    caches.match(event.request).then((hit) => {
      if (hit) {
        return hit;
      }
      return fetch(event.request).then((response) => {
        if (response.ok && isMedia) {
          const copy = response.clone();
          caches.open(MEDIA).then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});
