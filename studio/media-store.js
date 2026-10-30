/* Private media stays on this origin in IndexedDB; JSON keeps references only. */
(()=>{
 const memory=new Map(),versions=new Map(),refs=new Map();let database,queue=Promise.resolve(),failed=false,saving=0;
 const relevant=k=>/^(mb_|miglick_|miglik_)/.test(k),prefix='miglik-media:';
 const report=()=>{failed=true;window.dispatchEvent(new Event('miglikstorageerror'));};
 const req=request=>new Promise((resolve,reject)=>{request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
 const open=()=>new Promise((resolve,reject)=>{const request=indexedDB.open('miglik-private-media',1);request.onupgradeneeded=()=>request.result.createObjectStore('images',{keyPath:'id'});request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);request.onblocked=()=>reject(new Error('Media database blocked'));});
 const toURL=blob=>new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.readAsDataURL(blob);});
 async function walk(value,fn){if(typeof value==='string')return fn(value);if(Array.isArray(value))return Promise.all(value.map(v=>walk(v,fn)));if(value&&typeof value==='object'){const out={};for(const[k,v]of Object.entries(value))out[k]=await walk(v,fn);return out;}return value;}
 function parse(raw){try{return{value:JSON.parse(raw),json:true};}catch{return{value:raw,json:false};}}
 async function pack(raw){const parsed=parse(raw);const value=await walk(parsed.value,async v=>{
  if(!v.startsWith('data:image/'))return v;if(refs.has(v))return refs.get(v);if(!database)throw new Error('Photo could not be saved');
  const response=await fetch(v);const blob=await response.blob();const bytes=await blob.arrayBuffer();const hash=await crypto.subtle.digest('SHA-256',bytes);const id=Array.from(new Uint8Array(hash)).map(x=>x.toString(16).padStart(2,'0')).join('');
  await new Promise((resolve,reject)=>{const tx=database.transaction('images','readwrite');tx.objectStore('images').put({id,blob,created:Date.now()});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});const ref=prefix+id;refs.set(v,ref);return ref;
 });return parsed.json?JSON.stringify(value):value;}
 async function unpack(raw){const parsed=parse(raw);const value=await walk(parsed.value,async v=>{if(!v.startsWith(prefix))return v;if(!database)throw new Error('Photo storage unavailable');const row=await req(database.transaction('images').objectStore('images').get(v.slice(prefix.length)));if(!row){report();return '';}const url=await toURL(row.blob);refs.set(url,v);return url;});return parsed.json?JSON.stringify(value):value;}
 const api={ready:null,get failed(){return failed;},get pending(){return queue;},get saving(){return saving;},getItem(k){return memory.has(k)?memory.get(k):null;},setItem(k,v){v=String(v);memory.set(k,v);const revision=(versions.get(k)||0)+1;versions.set(k,revision);if(!v.includes('data:image/')){try{localStorage.setItem(k,v);}catch{report();}return;}saving++;window.dispatchEvent(new Event('miglikstoragechange'));queue=queue.then(async()=>{const packed=await pack(v);if(versions.get(k)===revision)localStorage.setItem(k,packed);}).catch(report).finally(()=>{saving--;window.dispatchEvent(new Event('miglikstoragechange'));});},removeItem(k){memory.delete(k);versions.set(k,(versions.get(k)||0)+1);try{localStorage.removeItem(k);}catch{report();}}};
 api.ready=(async()=>{try{database=await open();}catch{report();}let keys=[];try{keys=Object.keys(localStorage).filter(relevant);}catch{report();}for(const k of keys){const raw=localStorage.getItem(k);try{memory.set(k,await unpack(raw));}catch{report();memory.set(k,raw);}}for(const[k,v]of memory)if(v?.includes('data:image/'))api.setItem(k,v);await queue;})();
 window.miglikStorage=api;
})();
