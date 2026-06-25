const CACHE_NAME = 'minibrick-layered-png-v3';
const ASSETS = ['./','./index.html','./manifest.json','./logo.png','./icon-192.png','./icon-512.png','./assets/body/skin-mask.png','./assets/body/torso-mask.png','./assets/body/legs-mask.png','./assets/body/base-shadow.png','./assets/faces/A1.png','./assets/hair/1.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));
