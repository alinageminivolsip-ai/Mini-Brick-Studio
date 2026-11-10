(async()=>{
 const load=src=>new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=()=>reject(new Error(src));document.body.append(script);});
 try{await window.miglikStorage.ready;for(const src of ['./vendor/gsap.min.js','./gift-template-data.js?v=2','./gift-template.js?v=3','./engine.js?v=gift-4','./completion.js?v=6ece447119','./guided-model.js?v=ca6d1eaa54','./guided.js?v=gift-3'])await load(src);}catch(error){document.getElementById('loaderStatus').textContent='Не удалось открыть конструктор. Обновите страницу или повторите попытку.';document.querySelector('.loader-retry').hidden=false;console.error('MIGLIK startup failed',error);}
})();
