const CACHE_NAME = 'whiat-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/java.js',
  'MEDIA/ITEM2-removebg-preview.png'
  // Puedes agregar aquí más archivos que quieras que se guarden en caché
];

// Instalar el Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos en caché guardados');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar peticiones para funcionar offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el archivo en caché si existe, si no, lo busca en la red
        return response || fetch(event.request);
      })
  );
});