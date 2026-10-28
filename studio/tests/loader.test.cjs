const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
function fixture(fontFailure=false){
 const elements=()=>({hidden:false,textContent:'',attrs:{},classes:new Set(),style:{},setAttribute(k,v){this.attrs[k]=v},removeAttribute(k){delete this.attrs[k]},classList:{add(){}}});
 const track=elements();track.firstElementChild=elements();
 const retry=elements();retry.hidden=true;
 const status=elements(),app={inert:false};
 const screen=elements();screen.classList={add:x=>screen.classes.add(x)};
 screen.querySelector=s=>s==='.loader-track'?track:retry;
 screen.addEventListener=(name,cb)=>{screen.onTransitionEnd=cb};
 const images=[];let clock=0,id=0;const timers=new Map();
 const document={getElementById:k=>k==='studioLoader'?screen:status,querySelector:()=>app,querySelectorAll:()=>[],body:{removeAttribute(){}},fonts:{load:()=>fontFailure?Promise.reject(Error('font')):Promise.resolve([{}]),ready:Promise.resolve()}};
 const scope={document,window:{},performance:{now:()=>clock++*2000},Image:class{set src(value){this.url=value;images.push(this)}},setTimeout:(cb,ms)=>{const key=++id;timers.set(key,cb);if(ms===0)queueMicrotask(cb);return key},clearTimeout:key=>timers.delete(key),requestAnimationFrame:cb=>queueMicrotask(cb)};
 vm.createContext(scope);vm.runInContext(fs.readFileSync('loader.js','utf8'),scope);
 return {scope,screen,status,track,retry,app,images};
}
const flush=()=>new Promise(resolve=>setImmediate(resolve));
test('loader stays closed to interaction until every image has finished',async()=>{
 const f=fixture();const done=f.scope.window.miglickLoading.ready(Promise.resolve(),['one.png','two.png','three.png']);await flush();
 assert.equal(f.images.length,3);assert.equal(f.app.inert,true);
 f.images[0].onload();f.images[1].onload();await flush();
 assert.equal(f.screen.classes.has('is-leaving'),false);
 assert.equal(f.track.attrs['aria-valuenow'],'6');
 f.images[2].onload();await done;
 assert.equal(f.track.attrs['aria-valuenow'],'7');assert.equal(f.screen.classes.has('is-leaving'),true);
 f.screen.onTransitionEnd();assert.equal(f.screen.hidden,true);assert.equal(f.app.inert,false);
});
test('a failed image keeps loader visible and offers retry instead of opening incomplete editor',async()=>{
 const f=fixture();const done=f.scope.window.miglickLoading.ready(Promise.resolve(),['missing.png']);await flush();f.images[0].onerror();await done;
 assert.equal(f.screen.hidden,false);assert.equal(f.app.inert,true);assert.equal(f.retry.hidden,false);assert.equal(f.screen.classes.has('is-leaving'),false);assert.equal(f.track.attrs['aria-valuenow'],'4');
});
test('a failed local font cannot count as a completed asset',async()=>{
 const f=fixture(true);const done=f.scope.window.miglickLoading.ready(Promise.resolve(),[]);await done;
 assert.equal(f.retry.hidden,false);assert.equal(f.track.attrs['aria-valuenow'],'0');assert.equal(f.app.inert,true);
});
