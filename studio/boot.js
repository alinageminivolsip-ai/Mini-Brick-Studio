(async()=>{
 const load=src=>new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=()=>reject(new Error(src));document.body.append(script);});
 try{await window.miglikStorage.ready;window.miglikHadDraft=window.miglikStorage.getItem("miglick_current_started")==="1";for(const src of ['./vendor/gsap.min.js','./gift-template-data.js?v=2','./gift-template.js?v=3','./engine.js?v=drag-1','./completion.js?v=6ece447119','./guided-model.js?v=ca6d1eaa54','./guided.js?v=gift-3','./simple.js?v=drag-1'])await load(src);}catch(error){document.getElementById('loaderStatus').textContent='Не удалось открыть конструктор. Обновите страницу или повторите попытку.';document.querySelector('.loader-retry').hidden=false;console.error('MIGLIK startup failed',error);}
 import("./collage-import.js?v=layout-1").catch(error => console.error("MIGLIK collage bridge", error));
})();
