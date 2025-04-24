const CACHE_NAME = 'notes-cache-v1';
const ASSETS = [
    '/main.html',  
    '/app.js',
    '/style.css',
    '/manifest.json',
    '/icons/72x72.png',
    '/icons/96x96.png',
    '/icons/128x128.png',
    '/icons/144x144.png',
    '/icons/152x152.png',
    '/icons/192x192.png',
    '/icons/384x384.png',
    '/icons/512x512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key)))
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});