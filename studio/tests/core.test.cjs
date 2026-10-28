const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const code=fs.readFileSync('engine.js','utf8');
function helpers(storage){const scope={localStorage:storage,document:{getElementById:()=>null},clearTimeout,setTimeout};vm.createContext(scope);vm.runInContext(code.slice(0,code.indexOf('const bodyColors=')),scope);return scope}
test('corrupt stored JSON falls back without blocking boot',()=>{const s=helpers({getItem:()=>'{invalid'});assert.equal(vm.runInContext('readList("people",[{name:"default"}],true)[0].name',s),'default')});
test('empty and malformed people cannot create an empty editor',()=>{for(const value of ['[]','[null]','[12]','{}']){const s=helpers({getItem:()=>value});assert.equal(vm.runInContext('readList("people",[{name:"default"}],true)[0].name',s),'default')}});
test('valid previous drafts are preserved',()=>{const s=helpers({getItem:()=>JSON.stringify([{name:'Анна',face:'A3'}])});assert.equal(vm.runInContext('readList("people",[],true)[0].face',s),'A3')});
test('blocked or full storage does not throw',()=>{const s=helpers({getItem(){throw Error('blocked')},setItem(){throw Error('quota')},removeItem(){throw Error('blocked')}});assert.equal(vm.runInContext('draftStorage.getItem("x")',s),null);assert.doesNotThrow(()=>vm.runInContext('draftStorage.setItem("x","y");draftStorage.removeItem("x")',s))});
test('names are escaped before insertion into HTML and input attributes',()=>{const s=helpers({getItem:()=>null});assert.equal(vm.runInContext('escapeHTML(\'<img src=x onerror="alert(1)">\')',s),'&lt;img src=x onerror=&quot;alert(1)&quot;&gt;')});
test('existing pricing is preserved for base and configured frames',()=>{
 const scope={frames:[{id:'white-square',m:'square',name:'22×22'}],getBoardAccessory:()=>'',getCenterAccessory:()=>'',getOutfitAccessory:p=>p.outfitAccessory||'',people:[{}],frame:'white-square',frameBgData:''};vm.createContext(scope);
 const pricing=code.slice(code.indexOf('const PRICING='),code.indexOf('function cartItemPrice('));vm.runInContext(pricing,scope);
 assert.equal(vm.runInContext('calcOrderPrice([{}],"white-square",false).total',scope),3090);
 assert.equal(vm.runInContext('calcOrderPrice([{print:"custom",rightAccessory:"star",outfitAccessory:"suit"}],"white-square",true).total',scope),3640);
});
test('new service worker only expires its own caches',()=>{const sw=fs.readFileSync('sw.js','utf8');assert.match(sw,/startsWith\('miglick-studio-'\)/);assert.doesNotMatch(sw,/k !== CACHE_NAME && caches.delete/)});
test('a new untouched draft is excluded from a saved-frame order',()=>{
 const scope={cart:[{}],cartItemPrice:()=>({total:3090}),calcOrderPrice:()=>({total:3090}),currentDraftStarted:false};vm.createContext(scope);
 vm.runInContext(code.slice(code.indexOf('function cartTotal(){'),code.indexOf('function renderPriceBar(){')),scope);
 assert.equal(vm.runInContext('cartTotal()',scope),3090);
 scope.currentDraftStarted=true;assert.equal(vm.runInContext('cartTotal()',scope),6180);
 scope.cart=[];scope.currentDraftStarted=false;assert.equal(vm.runInContext('cartTotal()',scope),3090);
});

test('every shipped asset path exists and startup avoids network probes',()=>{
 const scope={};vm.createContext(scope);vm.runInContext(code.slice(0,code.indexOf('let storageFailed')),scope);
 const paths=vm.runInContext('[...shippedAssetPaths]',scope);
 assert.ok(paths.length>40);for(const p of paths){assert.ok(fs.existsSync(p),p);assert.notEqual(fs.readFileSync(p).subarray(0,4).toString(),'8BPS',p)}
 assert.match(code,/function exists\(src\)\{return Promise.resolve/);
});
