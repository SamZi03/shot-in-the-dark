const CACHE = 'sitd-v2';

const FILES = [
  './',
  './index.html',
  './game.html',
  './css/style.css',
  './js/app.js',
  './js/game.js',
  './data/history.json',
  './data/science.json',
  './data/sport.json',
  './data/music.json',
  './data/food.json',
  './data/geography.json',
  './data/tv-film.json',
  './data/mixed.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
