const CACHE_NAME='miglick-studio-v8-5';
const CORE=['./','./index.html','./studio.css?v=83243f6eba','./renderer-legacy.css','./engine.js?v=38f5c07afa','./studio.js','./loader.js?v=02208a6fa8','./loader.css?v=97206922ec','./manifest.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('miglick-studio-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(fetch(e.request,{cache:"no-cache"}).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,copy))}return r}).catch(()=>caches.match(e.request)))});
