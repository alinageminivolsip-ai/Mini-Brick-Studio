const CACHE_NAME='miglick-studio-guided-gift-4';
const CORE=["./", "./index.html", "./manifest.json", "./vendor/gsap.min.js", "./loader.css?v=614f4dd91d", "./renderer-core.css?v=4b850e6d0a", "./completion.css?v=75df796c94", "./fonts.css?v=953adb4b53", "./guided.css?v=c144c1dd9d", "./loader.js?v=8b39720d0f", "./media-store.js?v=8cdeb3ae59", "./boot.js?v=gift-4", "./gift-template-data.js?v=2", "./gift-template.js?v=3", "./engine.js?v=gift-4", "./completion.js?v=6ece447119", "./guided-model.js?v=ca6d1eaa54", "./guided.js?v=gift-3"];
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
