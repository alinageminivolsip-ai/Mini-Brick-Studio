const CACHE_NAME='miglick-studio-v8-6';
const CORE=['./','./index.html','./studio.css?v=83243f6eba','./renderer-legacy.css','./engine.js?v=c3853d844c','./studio.js','./loader.js?v=19ccac8371','./loader.css?v=77fdfb45d1','./manifest.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('miglick-studio-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch', e => {
  const url=new URL(e.request.url);
  if(e.request.method!=='GET'||url.origin!==self.location.origin)return;
  const staticAsset=url.pathname.startsWith(new URL('./assets/',self.location).pathname)||url.pathname.startsWith(new URL('./fonts/',self.location).pathname);
  e.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME);
    if(staticAsset){const saved=await cache.match(e.request);if(saved)return saved;}
    try{
      const response=await fetch(e.request,{cache:staticAsset?'force-cache':'no-cache'});
      if(response.ok)await cache.put(e.request,response.clone());
      return response;
    }catch(error){const saved=await cache.match(e.request);if(saved)return saved;throw error;}
  })());
});
