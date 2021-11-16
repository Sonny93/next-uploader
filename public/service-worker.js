const cacheName = 'cache-v1';
const assets = [
    '/',
    '/file'
];

self.addEventListener('install', (event) => {
    console.log('Hello world from the Service Worker 🤙');
    event.waitUntil(
        caches.open(cacheName)
            .then((cache) => cache.addAll(assets))
            .catch((error) => console.error('Une erreur est survenue lors du caching des fichiers', assets, error))
    );
});

self.addEventListener('activate', (event) => {
    console.log('Claiming control');
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // console.log('request', event.request);
    event.respondWith(
        caches.match(event.request).then((cache) => cache || fetch(event.request))
    );
});