const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const engine=fs.readFileSync('engine.js','utf8');
const completion=fs.readFileSync('completion.js','utf8');
function fixture(){
 const nodes=new Map();
 const scope={document:{getElementById:id=>{if(!nodes.has(id))nodes.set(id,{textContent:'',innerHTML:'',hidden:false,attrs:{},setAttribute(k,v){this.attrs[k]=v},decode:()=>Promise.resolve()});return nodes.get(id)}},frames:[{id:'white-square',m:'square',name:'22×22'},{id:'black-small',m:'small',name:'15,5×20,5'}],getBoardAccessory:p=>p.boardAccessory||'',getCenterAccessory:p=>p.centerAccessory||'',getOutfitAccessory:p=>p.outfitAccessory||'',people:[{}],frame:'white-square',frameBgData:'',getFramePresetBackground:()=>({name:'Без фона'}),escapeHTML:value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')};
 vm.createContext(scope);
 vm.runInContext(engine.slice(engine.indexOf('const PRICING='),engine.indexOf('function cartItemPrice(')),scope);
 vm.runInContext(completion.slice(0,completion.indexOf("completionEl('continueOrder').onclick")),scope);
 return {scope,nodes};
}
test('completion breakdown matches existing calculator across frames and paid options',()=>{
 const {scope}=fixture();scope.items=[{frame:'white-square',people:[{print:'image',rightAccessory:'star',outfitAccessory:'suit'},{}],frameBgData:'custom'},{frame:'black-small',people:[{boardAccessory:'scate'}],frameBgData:''}];
 const totals=vm.runInContext('completionBreakdown(items)',scope);
 const expected=vm.runInContext('items.reduce((sum,item)=>sum+calcOrderPrice(item.people,item.frame,!!item.frameBgData).total,0)',scope);
 assert.equal(totals.total,expected);assert.equal(totals.frames+totals.figures+totals.options,expected);assert.equal(totals.frames,4480);assert.equal(totals.figures,1800);assert.equal(totals.options,630);
});
test('summary does not apply VK promotion as an automatic discount',()=>{
 const {scope,nodes}=fixture();scope.items=[{frame:'white-square',people:[{name:'Анна'}],frameBgData:'',frameTexts:[]}];
 vm.runInContext('renderCompletionSummary(items)',scope);
 assert.match(nodes.get('priceValue').textContent,/3\D?090/);assert.equal(nodes.get('priceValue').textContent,nodes.get('checkoutTotal').textContent);
});
test('personal names and inscriptions stay text, with full data preserved',()=>{
 const {scope,nodes}=fixture();const item={frame:'white-square',people:[{name:'<img src=x onerror=alert(1)>',note:'Важно'}],frameBgData:'',frameTexts:[{content:'Люблю <тебя>'}]};scope.items=[item];const before=JSON.stringify(item);
 vm.runInContext('renderCompletionSummary(items)',scope);
 assert.equal(JSON.stringify(item),before);assert.match(nodes.get('completionPersonal').textContent,/<img/);assert.match(nodes.get('completionPersonal').textContent,/Люблю <тебя>/);assert.ok(!nodes.get('completionSpecs').innerHTML.includes('<img'));
});

test('copied order details include the actual frame inscriptions',()=>{
 const {scope}=fixture();
 vm.runInContext(engine.slice(engine.indexOf('function frameSummaryText('),engine.indexOf('function orderFullText(')),scope);
 scope.item={frame:'white-square',people:[],frameBgData:'',frameTexts:[{content:'Наша история'}]};
 assert.match(vm.runInContext('frameSummaryText(item,0)',scope),/Наша история/);
});

function previewFixture(){
 const f=fixture(),classes=new Set(['open']);
 f.scope.document.fonts={ready:Promise.resolve()};
 f.scope.document.createElement=()=>({getContext:()=>({drawImage(){}}),toDataURL:()=> 'data:image/png;base64,preview'});
 f.scope.document.documentElement={classList:{contains:()=>true}};
 f.scope.orderModal={classList:{add:(...keys)=>keys.forEach(k=>classes.add(k)),remove:(...keys)=>keys.forEach(k=>classes.delete(k))}};
 f.scope.currentOrderFrames=[{frame:'white-square',people:[],frameTexts:[]}];
 f.scope.loadImg=async()=>({naturalWidth:1200,naturalHeight:1320});
 f.scope.matchMedia=()=>({matches:true});f.scope.setTimeout=setTimeout;
 return {...f,classes};
}
test('failed preview can be retried without replacing the preview DOM',async()=>{
 const f=previewFixture();f.scope.exportFrameImage=async()=>{throw Error('render failed')};
 await vm.runInContext('renderCompletionPreviews()',f.scope);
 assert.equal(f.nodes.get('completionError').hidden,false);assert.equal(f.nodes.get('continueOrder').disabled,true);
 f.scope.exportFrameImage=async()=> 'original-render';
 await vm.runInContext('renderCompletionPreviews()',f.scope);
 assert.equal(f.nodes.get('completionError').hidden,true);assert.equal(f.nodes.get('orderPreviewImg').hidden,false);assert.equal(f.nodes.get('continueOrder').disabled,false);
});
test('closing during export waits for renderer state restoration before revealing editor',async()=>{
 const f=previewFixture();let resolveExport,rendererOwnsState=false;
 f.scope.exportFrameImage=()=>{rendererOwnsState=true;return new Promise(resolve=>{resolveExport=resolve}).finally(()=>{rendererOwnsState=false})};
 const exporting=vm.runInContext('renderCompletionPreviews()',f.scope);await new Promise(resolve=>setImmediate(resolve));
 vm.runInContext('closeCompletionDialog()',f.scope);
 assert.equal(f.classes.has('open'),true);assert.equal(rendererOwnsState,true);
 resolveExport('original-render');await exporting;await new Promise(resolve=>setTimeout(resolve,5));
 assert.equal(rendererOwnsState,false);assert.equal(f.classes.has('open'),false);
});
