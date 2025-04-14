
// Service Worker for CRIE Connect PWA
const CACHE_NAME = 'crie-connect-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-512x512.png',
  '/icons/icon-192x192.png',
  '/icons/maskable_icon.png'
];

// Install Service Worker and cache main resources
self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Cache error during install:', error);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate and clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service worker activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Claim clients so the page is controlled immediately
      console.log('Service worker now controlling all clients');
      return self.clients.claim();
    })
  );
});

// Cache strategy: Network First with fallback to cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If the network response is successful, we store in cache
        if (event.request.method === 'GET' && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try to respond from cache
        console.log('Fetching from cache for:', event.request.url);
        return caches.match(event.request);
      })
  );
});

// Log any errors that might occur
self.addEventListener('error', function(event) {
  console.error('Service Worker error:', event.message);
});
