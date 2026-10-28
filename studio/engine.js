// Static asset inventory: no sequential network probes during startup.
const shippedAssetPaths=new Set(["./assets/accessories/animals/spider.png", "./assets/accessories/bags/bag.png", "./assets/accessories/beer.png", "./assets/accessories/bunny.png", "./assets/accessories/children/child.png", "./assets/accessories/food/banana-mask.png", "./assets/accessories/food/banana.png", "./assets/accessories/food/croissant.png", "./assets/accessories/food/icecream-right-mask.png", "./assets/accessories/food/icecream-right.png", "./assets/accessories/hobbys/playstation.png", "./assets/accessories/hobbys/scate-mask.png", "./assets/accessories/hobbys/scate.png", "./assets/accessories/playstation.png", "./assets/accessories/premium/wedding-dress.png", "./assets/accessories/premium/wedding-suit.png", "./assets/accessories/star.png", "./assets/accessories/twohands/gloves.png", "./assets/backgrounds/big/love.png", "./assets/backgrounds/big/you_and_me.png", "./assets/backgrounds/big/Каракули.jpg", "./assets/backgrounds/big/Красный.jpg", "./assets/backgrounds/small/love.png", "./assets/backgrounds/small/you_and_me.png", "./assets/backgrounds/small/Каракули.jpg", "./assets/backgrounds/small/Красный.jpg", "./assets/backgrounds/square/1.png", "./assets/body/arms-mask.png", "./assets/body/base-outline.png", "./assets/body/base-white.png", "./assets/body/legs-mask.png", "./assets/body/plastic-light.png", "./assets/body/plastic-shadow.png", "./assets/body/shirt-mask.png", "./assets/body/skin-mask.png", "./assets/body/torso-mask.png", "./assets/faces/A1.png", "./assets/faces/A2.png", "./assets/faces/A3.png", "./assets/faces/A4.png", "./assets/faces/A5.png", "./assets/faces/A6.png", "./assets/faces/A8.png", "./assets/faces/A9.png", "./assets/hair/back/f1.png", "./assets/hair/back/f6.png", "./assets/hair/f1.png", "./assets/hair/f2.png", "./assets/hair/f3.png", "./assets/hair/f4.png", "./assets/hair/f5.png", "./assets/hair/f6.png", "./assets/hair/f7.png", "./assets/hair/m1.png", "./assets/hair/m2.png", "./assets/hair/m3.png", "./assets/hero/hero-bg.png", "./assets/onboarding/step-1.png", "./assets/onboarding/step-2.png", "./assets/podium/pink.png", "./assets/prints/drip-smile.png", "./assets/prints/print-sketch-heart.png", "./assets/prints/swoosh-character.png", "./assets/share-bg.PNG"]);
/* MIGLICK: persistent draft compatibility and safe UI text. */
let storageFailed=false;
const draftStorage={
 getItem(key){try{return localStorage.getItem(key)}catch{return null}},
 setItem(key,value){try{localStorage.setItem(key,value)}catch{storageFailed=true}},
 removeItem(key){try{localStorage.removeItem(key)}catch{storageFailed=true}}
};
function readList(key,fallback,nonempty=false){try{const data=JSON.parse(draftStorage.getItem(key)||'null');return Array.isArray(data)&&(!nonempty||data.length)&&data.every(x=>x&&typeof x==='object')?data:fallback}catch{return fallback}}
function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function notify(message){const el=document.getElementById('studioStatus');if(el){el.textContent=message;el.classList.add('visible');clearTimeout(notify.timer);notify.timer=setTimeout(()=>el.classList.remove('visible'),4500)}}

const bodyColors={
  2:'#F2EFE6',
  3:'rgba(210,210,210,.36)',
  4:'#9FA3A5',
  5:'#4D5B5A',
  6:'rgba(92,72,48,.46)',
  7:'#111111',
  8:'#C7BA76',
  9:'#8A7A33',
  10:'#C8941E',
  11:'#B76A1C',
  12:'#C84A1D',
  13:'#6E2F18',
  14:'#2D1610',
  15:'#FFD200',
  16:'#F7A500',
  17:'#D98A2B',
  18:'#FF6A13',
  19:'#D81919',
  20:'rgba(182,18,18,.50)',
  21:'#7A1010',
  22:'#6A7A1A',
  23:'#84C71A',
  24:'#8FA89A',
  25:'#52A88D',
  26:'#10B43C',
  27:'#157C27',
  28:'#0B3A23',
  29:'#25C5D8',
  30:'#7BC5F1',
  31:'#1B8DDB',
  32:'#1A72D6',
  33:'rgba(26,77,255,.48)',
  34:'#1D4FB3',
  35:'#0D245F',
  36:'#E5A8D4',
  37:'#E83D9E',
  38:'#C40063',
  39:'#B39AD9',
  40:'#8F59C6',
  41:'#5122B7',
  42:'#6B8794',
  43:'#A7E4D0',
  44:'#F2EFE6',
  45:'#4A4F55',
  46:'#111111',
  47:'#C8A33A',
  48:'#FF6A13',
  49:'#6FC4F0'
};
const bodyColorMeta={
  3:{transparent:true,note:'полупрозрачный цвет'},
  6:{transparent:true,note:'полупрозрачный цвет'},
  20:{transparent:true,note:'полупрозрачный цвет'},
  33:{transparent:true,note:'полупрозрачный цвет'},
  10:{gold:true,note:'золотой цвет'}
};
function isTranslucentColor(id){return !!(bodyColorMeta[id]&&bodyColorMeta[id].transparent)}
function applyTranslucentParts(container,person){
  if(!container)return;

  const skinEl=container.querySelector('.skin');
  const torsoEl=container.querySelector('.torso');
  const legsEl=container.querySelector('.legs');
  const armsEl=container.querySelector('.arms');

  if(torsoEl) torsoEl.classList.toggle('translucent', isTranslucentColor(person.torso));
  if(legsEl) legsEl.classList.toggle('translucent', isTranslucentColor(person.legs));

  if(armsEl){
    armsEl.classList.toggle(
      'translucent',
      person.sleeveMode !== 'bare' && isTranslucentColor(person.torso)
    );
  }

  if(skinEl) skinEl.classList.remove('translucent');
}
const bodyGroups=[{title:'Белый / прозрачный / серый / черный',ids:[2,3,4,5,6,7,44,45,46]},{title:'Желтый / оранжевый',ids:[8,9,10,11,15,16,17,18,47,48]},{title:'Красный',ids:[12,13,14,19,20,21]},{title:'Зеленый',ids:[22,23,24,25,26,27,28]},{title:'Синий',ids:[29,30,31,32,33,34,35,49]},{title:'Розовый / фиолетовый',ids:[36,37,38,39,40,41,42,43]}];
const skinColors={1:'#F0B37A',...bodyColors};
const skinGroups=[
  {title:'Классические оттенки кожи',ids:[1,15,2,6,11,13,14,7]},
  ...bodyGroups
];
let faces=['A1'], hair=['f1'], prints=['print-swoosh-character','print-drip-smile','print-sketch-heart','swoosh-character','drip-smile'], accessories=[];
let accessorySrcMap={};
let accessoryCategoryMap={};
const defaultFaces=['A1','A2','A3','A4','A5','A6'];
const defaultHair=['f1','f2','f3','f4','f5','f6'];
const defaultAccessories=[
  {id:'playstation',category:'hobby',label:'Игровая приставка'},
  {id:'star',category:'premium',label:'Волшебная палочка'},
  {id:'icecream-right',category:'food',label:'Мороженое'},
  {id:'child',category:'children',label:'Ребенок'},
  {id:'scate',category:'hobby',label:'Скейт'}
];
const accessoryCategories=[
  {id:'all',title:'Все'},
  {id:'children',title:'Дети'},
  {id:'food',title:'Еда'},
  {id:'animals',title:'Животные'},
  {id:'premium',title:'★ Премиум'},
  {id:'bags',title:'Сумки'},
  {id:'twohands',title:'В две руки'},
  {id:'hobby',title:'Хобби'}
];
let activeAccessoryCategory='all';
let activeHairCategory='all';
let hairBackView=false;
let hairBack=[];
let hairSrcMap={};
const hairCategories=[
  {id:'all',title:'Все'},
  {id:'female',title:'Женские'},
  {id:'male',title:'Мужские'},
  {id:'other',title:'Другие'}
];
// ── НОВОЕ: ценообразование ───────────────────────────────────────────────
// Базовая цена за рамку зависит от размера, доплаты — за фигурки и опции.
const PRICING={
  framePrice:{small:1990,square:2490,big:2990},
  personBase:600,
  printSurcharge:150,
  accessorySurcharge:80,
  outfitSurcharge:120,
  customBgSurcharge:200
};
function calcOrderPrice(peopleArr,frameId,hasCustomBg){
  peopleArr=peopleArr||people;
  frameId=frameId||frame;
  hasCustomBg=hasCustomBg!=null?hasCustomBg:!!frameBgData;
  const fd=frames.find(f=>f.id===frameId);
  const sizeKey=fd?fd.m:'square';
  let total=PRICING.framePrice[sizeKey]||PRICING.framePrice.square;
  const lines=[];
  lines.push(`Рамка ${fd?fd.name:''}: ${PRICING.framePrice[sizeKey]||0}₽`);
  peopleArr.forEach(person=>{
    let personSum=PRICING.personBase;
    if(person.print)personSum+=PRICING.printSurcharge;
    if(person.rightAccessory||person.leftAccessory||getBoardAccessory(person)||getCenterAccessory(person))personSum+=PRICING.accessorySurcharge;
    if(getOutfitAccessory(person))personSum+=PRICING.outfitSurcharge;
    total+=personSum;
  });
  lines.push(`Фигурки (${peopleArr.length} × ${PRICING.personBase}₽ + опции): ${total-(PRICING.framePrice[sizeKey]||0)}₽`);
  if(hasCustomBg){total+=PRICING.customBgSurcharge;lines.push(`Свой фон: +${PRICING.customBgSurcharge}₽`)}
  return {total,lines};
}
function cartItemPrice(item){
  return calcOrderPrice(item.people,item.frame,!!item.frameBgData);
}
function cartTotal(){
  const cartSum=cart.reduce((s,item)=>s+cartItemPrice(item).total,0);
  return cartSum+((!cart.length||currentDraftStarted)?calcOrderPrice().total:0);
}
function renderPriceBar(){
  const priceValue=document.getElementById('priceValue');
  const priceBreakdown=document.getElementById('priceBreakdown');
  if(!priceValue)return;
  const total=cartTotal();
  const framesCount=orderFrames().length;
  priceValue.textContent=total.toLocaleString('ru-RU')+' ₽';
  if(priceBreakdown)priceBreakdown.textContent=framesCount>1?`Рамок в заказе: ${framesCount}`:(cart.length&&!currentDraftStarted?cartItemPrice(cart[0]):calcOrderPrice()).lines.join(' · ');
}
function getHairCategory(id){
  const s=String(id||'').toLowerCase().trim();
  if(s.startsWith('f') || s.startsWith('female') || s.startsWith('w'))return 'female';
  if(s.startsWith('m') || s.startsWith('male'))return 'male';
  return 'other';
}
function filteredHair(){
  return hair.filter(id=>activeHairCategory==='all'||getHairCategory(id)===activeHairCategory);
}
function getHairFrontCandidates(id){
  const s=String(id||'').trim();
  const cat=getHairCategory(s);
  const out=[];
  if(cat==='female')out.push(`./assets/hair/female/${s}.png`);
  if(cat==='male')out.push(`./assets/hair/male/${s}.png`);
  out.push(`./assets/hair/${s}.png`);
  return [...new Set(out)];
}
function getHairFrontSrc(id){
  const s=String(id||'').trim();
  return hairSrcMap[s]||getHairFrontCandidates(s).find(src=>shippedAssetPaths.has(src))||getHairFrontCandidates(s)[0];
}
function getHairBackSrc(id){return `./assets/hair/back/${id}.png`;}
function hasHairBack(id){
  const s=String(id||'').trim();
  return hairBack.map(String).includes(s);
}
function getMainHairSrc(person){
  return hairBackView&&step==='hair'&&hasHairBack(person.hair)?getHairBackSrc(person.hair):getHairFrontSrc(person.hair);
}
function setHairBackView(value){
  hairBackView=!!value&&step==='hair'&&hasHairBack(p().hair);
  renderFigure();
  updateHairFlipControls();
}
function toggleHairBackView(){setHairBackView(!hairBackView);}
function updateHairFlipControls(){
  const canFlip=step==='hair'&&hasHairBack(p().hair);
  if(!canFlip)hairBackView=false;
  document.body.classList.toggle('hair-step',step==='hair');
  document.body.classList.toggle('hair-can-flip',canFlip);
  document.body.classList.toggle('hair-back-view',hairBackView&&canFlip);
  if(typeof constructorView!=='undefined'&&constructorView)constructorView.classList.toggle('view-back',hairBackView&&canFlip);
  const label=document.getElementById('hairFlipLabel');
  if(label)label.textContent=hairBackView&&canFlip?'Вид сзади':'Вид спереди';
  document.querySelectorAll('.hair-flip-btn').forEach(btn=>btn.classList.toggle('active',hairBackView&&canFlip));
}
function getAccSrc(id){return accessorySrcMap[id]||[...shippedAssetPaths].find(src=>src.startsWith("./assets/accessories/")&&src.endsWith(`/${id}.png`))||`./assets/accessories/${id}.png`;}
function isIcecreamAccessory(id){
  return String(id||'').includes('icecream');
}
function isBananaAccessory(id){
  return String(id||'').includes('banana');
}
function isScateAccessory(id){
  return String(id||'') === 'scate';
}
function isColorableAccessory(id){
  return isIcecreamAccessory(id) || isBananaAccessory(id) || isScateAccessory(id);
}
function getIcecreamColor(person){
  return (person && person.icecreamColor) || '#fd98c6';
}
function getBananaColor(person){
  return (person && person.bananaColor) || '#ffe066';
}
function getScateColor(person){
  return (person && person.scateColor) || '#79c943';
}
function getAccColor(id, person){
  if(isBananaAccessory(id)) return getBananaColor(person);
  if(isScateAccessory(id)) return getScateColor(person);
  return getIcecreamColor(person);
}
function getIcecreamMaskCandidates(src){
  const clean=String(src||'').split('?')[0];
  const folder=clean.includes('/') ? clean.slice(0, clean.lastIndexOf('/')+1) : './assets/accessories/';
  return [
    folder+'icecream-right-mask.png',
    './assets/accessories/food/icecream-right-mask.png',
    './assets/accessories/icecream-right-mask.png'
  ];
}
function getBananaMaskCandidates(src){
  const clean=String(src||'').split('?')[0];
  const folder=clean.includes('/') ? clean.slice(0, clean.lastIndexOf('/')+1) : './assets/accessories/';
  return [
    folder+'banana-mask.png',
    './assets/accessories/food/banana-mask.png',
    './assets/accessories/banana-mask.png'
  ];
}
function getScateMaskCandidates(src){
  const clean=String(src||'').split('?')[0];
  const folder=clean.includes('/') ? clean.slice(0, clean.lastIndexOf('/')+1) : './assets/accessories/';
  return [
    folder+'scate-mask.png',
    './assets/accessories/hobby/scate-mask.png',
    './assets/accessories/scate-mask.png'
  ];
}
const icecreamRenderCache=new Map();
async function getAccessoryRenderUrl(id, src, color){
  if(!id || !src)return src;
  if(!isColorableAccessory(id))return normalizeAccessoryUrl(src);
  const defaultColor=isBananaAccessory(id)?'#ffe066':(isScateAccessory(id)?'#79c943':'#fd98c6');
  const key=src+'|'+(color||defaultColor);
  if(icecreamRenderCache.has(key))return icecreamRenderCache.get(key);
  const promise=(async()=>{
    const base=await loadImg(src);
    if(!base)return normalizeAccessoryUrl(src);
    let mask=null;
    const maskCandidates=isBananaAccessory(id)?getBananaMaskCandidates(src):(isScateAccessory(id)?getScateMaskCandidates(src):getIcecreamMaskCandidates(src));
    for(const m of maskCandidates){
      mask=await loadImg(m);
      if(mask)break;
    }
    if(!mask)return normalizeAccessoryUrl(src);
    const canvas=document.createElement('canvas');
    canvas.width=base.naturalWidth||base.width;
    canvas.height=base.naturalHeight||base.height;
    const ctx=canvas.getContext('2d');
    ctx.drawImage(base,0,0,canvas.width,canvas.height);
    const tintCanvas=document.createElement('canvas');
    tintCanvas.width=canvas.width;
    tintCanvas.height=canvas.height;
    const t=tintCanvas.getContext('2d');
    t.drawImage(mask,0,0,canvas.width,canvas.height);
    t.globalCompositeOperation='source-in';
    t.fillStyle=color||defaultColor;
    t.fillRect(0,0,canvas.width,canvas.height);
    ctx.save();
    ctx.globalAlpha=.92;
    ctx.globalCompositeOperation='multiply';
    ctx.drawImage(tintCanvas,0,0);
    ctx.restore();
    return normalizeAccessoryUrl(canvas.toDataURL('image/png'));
  })();
  icecreamRenderCache.set(key,promise);
  return promise;
}
const frames=[{id:'white-small',name:'15,5×20,5',cls:'frame-white f-small',m:'small'},{id:'white-square',name:'22×22',cls:'frame-white f-square',m:'square'},{id:'white-big',name:'22,5×31,5',cls:'frame-white f-big',m:'big'},{id:'black-small',name:'15,5×20,5',cls:'frame-black f-small',m:'small'},{id:'black-square',name:'22×22',cls:'frame-black f-square',m:'square'},{id:'black-big',name:'22,5×31,5',cls:'frame-black f-big',m:'big'}];
let framePresetBackgrounds=[
  {id:'none',name:'Без фона',src:''}
];
function prettyBgName(id){
  return String(id||'')
    .replace(/\.[^.]+$/,'')
    .replace(/[-_]+/g,' ')
    .trim()
    .replace(/^./,c=>c.toUpperCase()) || 'Фон';
}
function getFramePresetBackground(id){
  return framePresetBackgrounds.find(x=>x.id===id)||framePresetBackgrounds[0];
}
function normalizeBackgroundItem(raw){
  if(typeof raw==='string'){
    const clean=raw.replace(/^\.?\/*/,'');
    const noExt=clean.replace(/\.[^.]+$/,'');
    const parts=noExt.split('/');
    const id=parts[parts.length-1];
    const hasPath=clean.includes('/');
    const hasExt=/\.[a-z0-9]+$/i.test(clean);
    return {
      id,
      name:prettyBgName(id),
      src:hasPath||hasExt ? `./${clean}` : ''
    };
  }
  if(raw&&typeof raw==='object'){
    const rawId=String(raw.id||raw.name||raw.file||'').trim();
    const clean=rawId.replace(/^\.?\/*/,'');
    const noExt=clean.replace(/\.[^.]+$/,'');
    const parts=noExt.split('/');
    const id=String(raw.id||parts[parts.length-1]||'').replace(/\.[^.]+$/,'');
    const src=raw.src||raw.path||(raw.file?`./assets/backgrounds/${raw.file}`:'');
    return {
      id,
      name:raw.name||raw.title||prettyBgName(id),
      src
    };
  }
  return null;
}
async function resolveBackgrounds(raw){
  const result=[{id:'none',name:'Без фона',src:''}];
  const seen=new Set(['none']);
  const exts=['png','jpg','jpeg','webp','svg'];
  const items=(Array.isArray(raw)?raw:[]).map(normalizeBackgroundItem).filter(Boolean);
  for(const item of items){
    const id=String(item.id||'').trim();
    if(!id||seen.has(id))continue;
    const variants=[];
    if(item.src)variants.push(item.src);
    exts.forEach(ext=>variants.push(`./assets/backgrounds/${id}.${ext}`));
    for(const src of variants){
      if(await exists(src)){
        result.push({
          id,
          name:item.name||prettyBgName(id),
          src
        });
        seen.add(id);
        break;
      }
    }
  }
  return result;
}
const accessoryMeta={
  default:{
    right:{x:71,y:60,w:34,r:0,flip:1},
    left:{x:29,y:60,w:34,r:0,flip:-1}
  },
  bag:{
    right:{x:53,y:55,w:54,r:0,flip:1},
    left:{x:53,y:55,w:54,r:0,flip:1}
  },
  playstation:{
    right:{x:70,y:60,w:36,r:0,flip:1},
    left:{x:30,y:60,w:36,r:0,flip:-1}
  },
  star:{
    right:{x:78,y:61,w:30,r:28,flip:1},
    left:{x:22,y:61,w:30,r:-28,flip:1}
  },
  'icecream-right':{
    right:{x:73,y:53,w:30,r:0,flip:1},
    left:{x:27,y:53,w:30,r:0,flip:-1}
  },
  icecream:{
    right:{x:73,y:53,w:30,r:0,flip:1},
    left:{x:27,y:53,w:30,r:0,flip:-1}
  },
  gloves:{
    type:'center',
    center:{x:50,y:58,w:86,r:0,flip:1},
    right:{x:76,y:66,w:23,r:0,flip:1},
    left:{x:24,y:66,w:23,r:0,flip:-1}
  },
  child:{
    type:'outfit',
    outfit:{x:50,y:50,w:100,r:0,flip:1}
  },
  'wedding-suit':{
    type:'outfit',
    outfit:{x:50,y:50,w:100,r:0,flip:1}
  },
  'wedding-dress':{
    type:'outfit',
    outfit:{x:50,y:50,w:100,r:0,flip:1}
  },
  'wedding-costume':{
    type:'outfit',
    outfit:{x:50,y:50,w:100,r:0,flip:1}
  },
  'groom-suit':{
    type:'outfit',
    outfit:{x:50,y:50,w:100,r:0,flip:1}
  },
  scate:{
    type:'board',
    board:{x:50,y:91,w:86,r:0,flip:1}
  }
};
function getAccessoryMeta(id,side='right'){
  const item=accessoryMeta[id] || (isBagAccessory(id)?accessoryMeta.bag:null) || accessoryMeta.default;
  const base=item[side]||item.right||item.left||item||accessoryMeta.default.right;
  return {...base};
}
function isOutfitAccessory(id){
  return !!(id && accessoryMeta[id] && accessoryMeta[id].type==='outfit');
}
function isBagAccessory(id){
  return !!(id && accessoryCategoryMap[id]==='bags');
}
function isBoardAccessory(id){
  return !!(id && accessoryMeta[id] && accessoryMeta[id].type==='board');
}
function isCenterAccessory(id){
  const cat=accessoryCategoryMap[id];
  return !!(
    id && (
      (accessoryMeta[id] && accessoryMeta[id].type==='center') ||
      cat==='twohands' || cat==='two-hands' || cat==='bothhands' || cat==='center'
    )
  );
}
function isBodyAccessory(id){
  return isOutfitAccessory(id) || isBagAccessory(id) || isBoardAccessory(id) || isCenterAccessory(id);
}
function getOutfitAccessory(person){
  if(person && person.outfitAccessory && isOutfitAccessory(person.outfitAccessory))return person.outfitAccessory;
  const acc=getPersonAccessories(person);
  if(isOutfitAccessory(acc.right))return acc.right;
  if(isOutfitAccessory(acc.left))return acc.left;
  return '';
}
function getBoardAccessory(person){
  if(person && person.boardAccessory && isBoardAccessory(person.boardAccessory))return person.boardAccessory;
  const acc=getPersonAccessories(person);
  if(isBoardAccessory(acc.right))return acc.right;
  if(isBoardAccessory(acc.left))return acc.left;
  return '';
}
function getCenterAccessory(person){
  if(person && person.centerAccessory && isCenterAccessory(person.centerAccessory))return person.centerAccessory;
  const acc=getPersonAccessories(person);
  if(isCenterAccessory(acc.right))return acc.right;
  if(isCenterAccessory(acc.left))return acc.left;
  return '';
}
function cleanOutfitFromHands(person){
  if(!person)return;
  if(isBagAccessory(person.outfitAccessory)){
    person.rightAccessory=person.outfitAccessory;
    person.outfitAccessory='';
  }
  if(!person.outfitAccessory){
    if(isOutfitAccessory(person.rightAccessory))person.outfitAccessory=person.rightAccessory;
    else if(isOutfitAccessory(person.leftAccessory))person.outfitAccessory=person.leftAccessory;
  }
  if(!person.boardAccessory){
    if(isBoardAccessory(person.rightAccessory))person.boardAccessory=person.rightAccessory;
    else if(isBoardAccessory(person.leftAccessory))person.boardAccessory=person.leftAccessory;
  }
  if(!person.centerAccessory){
    if(isCenterAccessory(person.rightAccessory))person.centerAccessory=person.rightAccessory;
    else if(isCenterAccessory(person.leftAccessory))person.centerAccessory=person.leftAccessory;
  }
  if(isOutfitAccessory(person.rightAccessory) || isBoardAccessory(person.rightAccessory) || isCenterAccessory(person.rightAccessory))person.rightAccessory='';
  if(isOutfitAccessory(person.leftAccessory) || isBoardAccessory(person.leftAccessory) || isCenterAccessory(person.leftAccessory))person.leftAccessory='';
  person.accessory='';
}
function getOutfitMeta(id){
  const item=accessoryMeta[id]||{};
  return item.outfit||{x:50,y:50,w:100,r:0,flip:1};
}
function getBoardMeta(id){
  const item=accessoryMeta[id]||{};
  return item.board||{x:50,y:94,w:92,r:0,flip:1};
}
function boardVars(id){
  const m=getBoardMeta(id);
  return `--board-x:${m.x}%;--board-y:${m.y}%;--board-w:${m.w}%;--board-r:${m.r||0}deg;--board-flip:${m.flip??1};`;
}
function getCenterMeta(id){
  const item=accessoryMeta[id]||{};
  return item.center||{x:50,y:50,w:100,r:0,flip:1};
}
function centerVars(id){
  const m=getCenterMeta(id);
  return `--center-acc-x:${m.x}%;--center-acc-y:${m.y}%;--center-acc-w:${m.w}%;--center-acc-r:${m.r||0}deg;--center-acc-flip:${m.flip??1};`;
}
function accVars(id,side='right'){
  const m=getAccessoryMeta(id,side);
  return `--acc-x:${m.x}%;--acc-y:${m.y}%;--acc-w:${m.w}%;--acc-r:${m.r||0}deg;--acc-flip:${m.flip??1};`;
}
function getPersonAccessories(person){
  const left=person.leftAccessory||'';
  const right=person.rightAccessory||person.accessory||'';
  return {
    left:isBodyAccessory(left)?'':left,
    right:isBodyAccessory(right)?'':right
  };
}
const steps=[{key:'skin',num:'01',title:'Лицо',focus:'focus-skin'},{key:'hair',num:'02',title:'Волосы',focus:'focus-hair'},{key:'torso',num:'03',title:'Одежда',focus:'focus-torso'},{key:'legs',num:'04',title:'Ноги',focus:'focus-legs'},{key:'accessory',num:'05',title:'Детали',focus:'focus-accessory'},{key:'frame',num:'06',title:'Рамка',focus:'focus-full'}];
const storeKey='mb_v4_people';
function firstHairId(){return (Array.isArray(hair)&&hair.length?hair[0]:'f1')}
function newPerson(n){return{name:'Герой '+n,note:'',face:'A1',hair:firstHairId(),skin:15,torso:19,legs:7,print:'',printScale:1,printX:0,printY:0,accessory:'',leftAccessory:'',rightAccessory:'',outfitAccessory:'',boardAccessory:'',centerAccessory:'',icecreamColor:'#fd98c6',bananaColor:'#ffe066',scateColor:'#79c943',sleeveMode:'sleeves',frameX:null,frameY:null}}
let people=readList(storeKey,[newPerson(1)],true);people=people.map((p,i)=>{const merged={...newPerson(i+1),...p};if(merged.accessory&&!merged.rightAccessory)merged.rightAccessory=merged.accessory;cleanOutfitFromHands(merged);merged.accessory='';return merged});let active=0,step='skin',frame=draftStorage.getItem('mb_v4_frame')||'white-square',undo=[],frameBgData=draftStorage.getItem('mb_frame_bg')||'',frameBgScale=draftStorage.getItem('mb_frame_bg_scale')||'1',framePresetBg=draftStorage.getItem('mb_frame_preset_bg')||'none',frameMobileDrop=draftStorage.getItem('mb_frame_mobile_drop')||'0';
const cartKey='mb_cart_v1';
if(!frames.some(f=>f.id===frame)) frame='white-square';
let cart=readList(cartKey,[]);
let paymentMethod=draftStorage.getItem('mb_payment_method')||'';
let currentDraftStarted=draftStorage.getItem('miglick_current_started')!=='0';
function orderFrames(){return cart.length&&!currentDraftStarted?[...cart]:[...cart,snapshotCurrentFrame()]}
function saveCart(){draftStorage.setItem(cartKey,JSON.stringify(cart))}
function snapshotCurrentFrame(){
  return {
    id:'frame_'+Date.now()+'_'+Math.random().toString(36).slice(2,7),
    people:JSON.parse(JSON.stringify(people)),
    frame,
    frameBgData,
    frameBgScale,
    framePresetBg,
    frameTexts:JSON.parse(JSON.stringify(frameTexts)),
    activeFrameTextId
  };
}
function resetCurrentFrameState(){
  currentDraftStarted=false;draftStorage.setItem('miglick_current_started','0');
  people=[newPerson(1)];
  active=0;
  step='skin';
  frame='white-square';
  frameBgData='';
  frameBgScale='1';
  framePresetBg='none';
  frameAutoCentered=false;
  frameLayoutTouched=false;
  frameTexts=[];
  activeFrameTextId='';
  draftStorage.removeItem('mb_frame_bg');
  draftStorage.setItem('mb_frame_bg_scale','1');
  draftStorage.setItem('mb_frame_preset_bg','none');
  draftStorage.removeItem('mb_frame_auto_centered');
  draftStorage.removeItem('mb_frame_layout_touched');
  saveFrameText();
}
function addCurrentFrameToCart(){
  snap();
  const item=snapshotCurrentFrame();
  cart.push(item);
  saveCart();
  resetCurrentFrameState();
  sync();
  window.scrollTo({top:0,behavior:'smooth'});
}
function removeCartItem(id){
  cart=cart.filter(x=>x.id!==id);
  saveCart();
  sync();
  if(typeof renderCartModal==='function')renderCartModal();
}
function editCartItem(id){
  const idx=cart.findIndex(x=>x.id===id);
  if(idx<0)return;
  const item=cart[idx];
  snap();
  cart.splice(idx,1);
  saveCart();
  people=item.people;
  active=0;
  frame=item.frame;
  frameBgData=item.frameBgData;
  frameBgScale=item.frameBgScale;
  framePresetBg=item.framePresetBg;
  frameTexts=Array.isArray(item.frameTexts)?JSON.parse(JSON.stringify(item.frameTexts)):[];
  activeFrameTextId=item.activeFrameTextId || (frameTexts[0]?.id || '');
  step='skin';
  closeCartModal();
  sync();
  window.scrollTo({top:0,behavior:'smooth'});
}
let frameAutoCentered=draftStorage.getItem('mb_frame_auto_centered')==='1';
let frameLayoutTouched=draftStorage.getItem('mb_frame_layout_touched')==='1';
// Надписи внутри рамки
function makeFrameTextItem(content='Новая надпись'){
  return {
    id:'txt_'+Date.now()+'_'+Math.random().toString(36).slice(2,7),
    content,
    font:'Comforter Brush',
    color:'#ffffff',
    size:4,
    x:50,
    y:88
  };
}
function loadFrameTexts(){
  try{
    const raw=JSON.parse(draftStorage.getItem('mb_frame_texts')||'[]');
    if(Array.isArray(raw)&&raw.length){
      return raw.map(t=>({
        ...makeFrameTextItem(''),
        ...t,
        id:t.id||('txt_'+Math.random().toString(36).slice(2,7)),
        content:t.content||''
      })).filter(t=>String(t.content||'').trim());
    }
  }catch(e){}
  const old=draftStorage.getItem('mb_frame_text')||'';
  if(old.trim()){
    return [{
      id:'txt_legacy',
      content:old,
      font:draftStorage.getItem('mb_frame_text_font')||'Comforter Brush',
      color:draftStorage.getItem('mb_frame_text_color')||'#ffffff',
      size:Number(draftStorage.getItem('mb_frame_text_size')||4),
      x:Number(draftStorage.getItem('mb_frame_text_x')||50),
      y:Number(draftStorage.getItem('mb_frame_text_y')||88)
    }];
  }
  return [];
}
let frameTexts=loadFrameTexts();
let activeFrameTextId=draftStorage.getItem('mb_active_frame_text') || (frameTexts[0]?.id || '');
function activeFrameText(){return frameTexts.find(t=>t.id===activeFrameTextId)||frameTexts[0]||null;}
const FRAME_FONTS=[
  {id:'Comforter Brush',  name:'Comforter Brush', preview:'Привет!'},
  {id:'Marck Script',     name:'Marck Script',    preview:'Привет!'},
  {id:'Bad Script',       name:'Bad Script',      preview:'Привет!'},
  {id:'Caveat',           name:'Caveat',           preview:'Привет!'},
  {id:'Pacifico',         name:'Pacifico',         preview:'Привет!'},
];
const FRAME_TEXT_COLORS=['#ffffff','#111111','#ed2b63','#ff6fa8','#ffd700','#86536a'];
function saveFrameText(){
  frameTexts=frameTexts.filter(t=>String(t.content||'').trim());
  if(!activeFrameTextId&&frameTexts[0])activeFrameTextId=frameTexts[0].id;
  draftStorage.setItem('mb_frame_texts',JSON.stringify(frameTexts));
  draftStorage.setItem('mb_active_frame_text',activeFrameTextId||'');
  const first=frameTexts[0]||null;
  draftStorage.setItem('mb_frame_text',first?first.content:'');
  draftStorage.setItem('mb_frame_text_font',first?first.font:'Comforter Brush');
  draftStorage.setItem('mb_frame_text_color',first?first.color:'#ffffff');
  draftStorage.setItem('mb_frame_text_size',String(first?first.size:4));
  draftStorage.setItem('mb_frame_text_x',String(first?first.x:50));
  draftStorage.setItem('mb_frame_text_y',String(first?first.y:88));
}
function p(){return people[active]||people[0]}
function save(){
  draftStorage.setItem('miglick_current_started',currentDraftStarted?'1':'0');
  draftStorage.setItem(storeKey,JSON.stringify(people));
  draftStorage.setItem('mb_v4_frame',frame);
  draftStorage.setItem('mb_frame_preset_bg',framePresetBg);
  saveFrameText();
}
function snap(){undo.push(JSON.stringify({people,active,step,frame,frameBgData,frameBgScale,framePresetBg,frameMobileDrop,frameTexts,activeFrameTextId,currentDraftStarted}));currentDraftStarted=true;if(undo.length>20)undo.shift()}
function restore(){
  const r=undo.pop();if(!r)return;
  const d=JSON.parse(r);
  currentDraftStarted=d.currentDraftStarted!==false;
  people=d.people;active=d.active;step=d.step;frame=d.frame;
  frameBgData=d.frameBgData;frameBgScale=d.frameBgScale;
  framePresetBg=d.framePresetBg||'none';frameMobileDrop=d.frameMobileDrop||'0';
  if(Array.isArray(d.frameTexts))frameTexts=d.frameTexts;
  activeFrameTextId=d.activeFrameTextId || (frameTexts[0]?.id || '');
  sync();
}
function applyFrameMobileView(){
  const isFrameMode=step==='frame';
  document.body.classList.toggle('frame-mode',isFrameMode);
  const drop=Math.max(0,Math.min(220,Number(frameMobileDrop||0)));
  document.documentElement.style.setProperty('--frame-mobile-drop',drop+'px');
}
function setFrameMobileDropValue(value){
  const drop=Math.max(0,Math.min(220,Math.round(Number(value||0))));
  frameMobileDrop=String(drop);
  draftStorage.setItem('mb_frame_mobile_drop',frameMobileDrop);
  applyFrameMobileView();
  invalidateFramePreviewBase();
  requestAnimationFrame(()=>renderFrame());
}
function initFrameResizeHandle(){
  const handle=document.getElementById('frameResizeHandle');
  if(!handle || handle.dataset.ready==='1')return;
  handle.dataset.ready='1';
  handle.addEventListener('pointerdown',e=>{
    if(step!=='frame')return;
    e.preventDefault();
    const startY=e.clientY;
    const startDrop=Number(frameMobileDrop||0);
    handle.setPointerCapture?.(e.pointerId);
    handle.classList.add('is-dragging');
    const move=ev=>{
      const delta=ev.clientY-startY;
      setFrameMobileDropValue(startDrop+delta);
    };
    const up=()=>{
      handle.classList.remove('is-dragging');
      window.removeEventListener('pointermove',move);
      window.removeEventListener('pointerup',up);
      window.removeEventListener('pointercancel',up);
    };
    window.addEventListener('pointermove',move);
    window.addEventListener('pointerup',up);
    window.addEventListener('pointercancel',up);
  });
}
function miniHTML(person){
  const acc=getPersonAccessories(person);
  const outfit=getOutfitAccessory(person);
  const board=getBoardAccessory(person);
  const center=getCenterAccessory(person);
  const leftHand=acc.left&&!isOutfitAccessory(acc.left)&&!isBoardAccessory(acc.left)&&!isCenterAccessory(acc.left)&&!isCenterAccessory(acc.left);
  const rightHand=acc.right&&!isOutfitAccessory(acc.right)&&!isBoardAccessory(acc.right)&&!isCenterAccessory(acc.right)&&!isCenterAccessory(acc.right);
  return `<div class="mini-preview" style="--p-skin:${skinColors[person.skin]};--p-torso:${bodyColors[person.torso]};--p-legs:${bodyColors[person.legs]};--p-arms:${person.sleeveMode==='bare'?skinColors[person.skin]:bodyColors[person.torso]};--skin:${skinColors[person.skin]};--torso:${bodyColors[person.torso]};--legs:${bodyColors[person.legs]};--arms:${person.sleeveMode==='bare'?skinColors[person.skin]:bodyColors[person.torso]};--arms:${person.sleeveMode==='bare'?skinColors[person.skin]:bodyColors[person.torso]}"><div class="part skin ${isTranslucentColor(person.skin)?'translucent':''}"></div><div class="part torso ${isTranslucentColor(person.torso)?'translucent':''}"></div><div class="part arms ${(person.sleeveMode!=='bare'&&isTranslucentColor(person.torso))?'translucent':''}"></div><div class="part legs ${isTranslucentColor(person.legs)?'translucent':''}"></div><img class="plastic-shadow" src="./assets/body/plastic-shadow.png" alt=""><img class="plastic-light" src="./assets/body/plastic-light.png" alt=""><img class="shadow-layer" src="./assets/body/base-outline.png" alt="">${board?`<img class="board-img" data-acc-id="${board}" data-icecream-color="${getAccColor(board,person)}" style="${boardVars(board)}" src="${getAccSrc(board)}" alt="">`:''}${outfit?`<img class="outfit-img" src="${getAccSrc(outfit)}" alt="">`:''}${center?`<img class="center-acc-img" data-acc-id="${center}" data-icecream-color="${getAccColor(center,person)}" style="${centerVars(center)}" src="${getAccSrc(center)}" alt="">`:''}<img class="face-img" src="./assets/faces/${person.face}.png" alt=""><img class="hair-img" src="${getHairFrontSrc(person.hair)}" alt="">${leftHand?`<img class="acc-img acc-left" data-acc-id="${acc.left}" data-icecream-color="${getAccColor(acc.left,person)}" style="${accVars(acc.left,'left')}" src="${getAccSrc(acc.left)}" alt="">`:''}${rightHand?`<img class="acc-img acc-right" data-acc-id="${acc.right}" data-icecream-color="${getAccColor(acc.right,person)}" style="${accVars(acc.right,'right')}" src="${getAccSrc(acc.right)}" alt="">`:''}</div>`
}
function renderPeople(){countLabel.textContent=`${people.length}/10`;peopleList.innerHTML='';people.forEach((person,i)=>{const card=document.createElement('div');card.className='person-card '+(i===active?'active':'');card.innerHTML=`${miniHTML(person)}<div><div class="person-title">${escapeHTML(person.name||`Герой ${i+1}`)}</div><div class="person-meta">лицо ${person.face}, волосы ${person.hair}</div></div><div style="display:grid;gap:4px"><button class="icon-btn" data-edit title="Редактировать" aria-label="Редактировать фигурку">✎</button><button class="icon-btn dup" data-dup title="Дублировать" aria-label="Дублировать фигурку">⧉</button><button class="icon-btn" data-del title="Удалить" aria-label="Удалить фигурку">×</button></div>`;card.querySelector('[data-edit]').onclick=()=>{active=i;step='skin';sync()};card.querySelector('[data-dup]').onclick=()=>dupPerson(i);card.querySelector('[data-del]').onclick=()=>askDelPerson(i);peopleList.appendChild(card)})}
function renderMobilePeople(){
 const box=document.getElementById('mobilePeopleList');if(!box)return;box.innerHTML='';
 people.forEach((person,i)=>{
  const item=document.createElement('div');item.className='mobile-person-item';
  const chip=document.createElement('button');chip.type='button';chip.className='mobile-person-chip '+(i===active?'active':'');chip.setAttribute('aria-pressed',String(i===active));chip.setAttribute('aria-label','Редактировать '+(person.name||('героя '+(i+1))));chip.innerHTML=miniHTML(person)+`<span class="mobile-person-name">${escapeHTML(person.name||('Герой '+(i+1)))}</span>`;chip.onclick=()=>{active=i;sync()};item.appendChild(chip);
  if(people.length>1){const del=document.createElement('button');del.type='button';del.className='mobile-delete';del.textContent='×';del.setAttribute('aria-label','Удалить '+(person.name||('героя '+(i+1))));del.onclick=()=>askDelPerson(i);item.appendChild(del)}
  box.appendChild(item);
 });
 const add=document.createElement('button');add.type='button';add.className='mobile-add-chip';add.textContent='+ Добавить';add.disabled=people.length>=10;add.onclick=addPersonFn;box.appendChild(add);
}
function addPersonFn(){if(people.length>=10)return notify('В одной рамке можно собрать до 10 героев');snap();people.push(newPerson(people.length+1));active=people.length-1;step='skin';sync()}
function dupPerson(i){
  if(people.length>=10)return notify('В одной рамке можно собрать до 10 героев');
  snap();
  const copy=JSON.parse(JSON.stringify(people[i]));
  copy.name=(copy.name||'Человек')+' (копия)';
  copy.frameX=null;copy.frameY=null;
  people.splice(i+1,0,copy);
  active=i+1;
  sync();
}
let pendingDeleteIndex=null;
function askDelPerson(i){
  if(people.length===1)return notify('В рамке должен остаться хотя бы один герой');
  pendingDeleteIndex=i;
  const name=people[i]?.name||`Фигурка ${i+1}`;
  confirmTitle.textContent='Удалить «'+name+'»?';
  confirmText.textContent='Фигурка будет удалена из этой рамки. Действие можно отменить кнопкой «Отменить».';
  confirmModal.classList.add('open');
}
function delPerson(i){snap();people.splice(i,1);if(active>=people.length)active=people.length-1;sync()}
function renderSteps(){stepsNav.innerHTML='';steps.forEach(s=>{const idx=steps.findIndex(x=>x.key===s.key);const cur=steps.findIndex(x=>x.key===step);const b=document.createElement('button');b.className='step-btn '+(s.key===step?'active ':'')+(idx<cur?'done':'');b.innerHTML=`<span class="num">${s.num}</span><span>${s.title}</span>`;b.onclick=()=>{if(s.key==='frame'){enterFrameMode()}else{step=s.key;sync()}window.scrollTo({top:0,behavior:'smooth'})};stepsNav.appendChild(b)})}
function setStepFocus(){const s=steps.find(x=>x.key===step);constructorView.className='figure-wrap '+(s?s.focus:'focus-full');constructorView.classList.toggle('hidden',step==='frame');frameView.classList.toggle('hidden',step!=='frame');updateHairFlipControls()}
function renderFigure(){
  const person=p();
  cleanOutfitFromHands(person);
  const acc=getPersonAccessories(person);
  document.documentElement.style.setProperty('--skin',skinColors[person.skin]);
  document.documentElement.style.setProperty('--torso',bodyColors[person.torso]);
  document.documentElement.style.setProperty('--legs',bodyColors[person.legs]);
document.documentElement.style.setProperty(
  '--arms',
  person.sleeveMode === 'bare'
    ? skinColors[person.skin]
    : bodyColors[person.torso]
);
  applyTranslucentParts(constructorView,person);
  faceImg.src=`./assets/faces/${person.face}.png`;
  hairImg.onerror=()=>{hairImg.onerror=null;hairImg.src=getHairFrontSrc(person.hair)};
  hairImg.src=getMainHairSrc(person);
  printImg.src=person.print||'';
  printLayer.classList.toggle('hidden',!person.print);
  printLayer.style.setProperty('--print-scale',person.printScale||1);
  printLayer.style.setProperty('--print-x',(person.printX||0)+'%');
  printLayer.style.setProperty('--print-y',(person.printY||0)+'%');
  const outfit=getOutfitAccessory(person);
  if(typeof outfitImg!=='undefined'&&outfitImg){
    outfitImg.src=outfit?getAccSrc(outfit):'';
    outfitImg.classList.toggle('hidden',!outfit);
  }
  const board=getBoardAccessory(person);
  if(typeof boardImg!=='undefined'&&boardImg){
    const boardSrc=board?getAccSrc(board):'';
    if(boardImg.dataset.originalSrc!==boardSrc){boardImg.dataset.originalSrc=boardSrc;boardImg.src=boardSrc}
    boardImg.dataset.accId=board||'';
    boardImg.dataset.icecreamColor=getAccColor(board,person);
    boardImg.style.cssText=board?boardVars(board):'';
    boardImg.classList.toggle('hidden',!board);
    if(boardSrc)normalizeAccessoryElement(boardImg);
  }
  const center=getCenterAccessory(person);
  if(typeof centerAccImg!=='undefined'&&centerAccImg){
    const centerSrc=center?getAccSrc(center):'';
    if(centerAccImg.dataset.originalSrc!==centerSrc){centerAccImg.dataset.originalSrc=centerSrc;centerAccImg.src=centerSrc}
    centerAccImg.dataset.accId=center||'';
    centerAccImg.dataset.icecreamColor=getAccColor(center,person);
    centerAccImg.style.cssText=center?centerVars(center):'';
    centerAccImg.classList.toggle('hidden',!center);
    if(centerSrc)normalizeAccessoryElement(centerAccImg);
  }
  const leftSrc=(acc.left&&!isOutfitAccessory(acc.left)&&!isBoardAccessory(acc.left)&&!isCenterAccessory(acc.left))?getAccSrc(acc.left):'';
  if(accLeftImg.dataset.originalSrc!==leftSrc){accLeftImg.dataset.originalSrc=leftSrc;accLeftImg.src=leftSrc}
  accLeftImg.dataset.accId=acc.left||'';accLeftImg.dataset.icecreamColor=getAccColor(acc.left,person);accLeftImg.style.cssText=acc.left?accVars(acc.left,'left'):'';
  accLeftImg.classList.toggle('hidden',!leftSrc);
  if(leftSrc)normalizeAccessoryElement(accLeftImg);
  const rightSrc=(acc.right&&!isOutfitAccessory(acc.right)&&!isBoardAccessory(acc.right)&&!isCenterAccessory(acc.right))?getAccSrc(acc.right):'';
  if(accRightImg.dataset.originalSrc!==rightSrc){accRightImg.dataset.originalSrc=rightSrc;accRightImg.src=rightSrc}
  accRightImg.dataset.accId=acc.right||'';accRightImg.dataset.icecreamColor=getAccColor(acc.right,person);accRightImg.style.cssText=acc.right?accVars(acc.right,'right'):'';
  accRightImg.classList.toggle('hidden',!rightSrc);
  if(rightSrc)normalizeAccessoryElement(accRightImg);
  setStepFocus();
  renderFrame();
}
function normalizeAssetPreview(img,type){
  if(!img || img.dataset.normalized==='1')return;
  img.dataset.normalized='1';
  const run=()=>{
    const w=img.naturalWidth||0,h=img.naturalHeight||0;
    if(!w||!h)return;
    const srcCanvas=document.createElement('canvas');
    srcCanvas.width=w;srcCanvas.height=h;
    const sctx=srcCanvas.getContext('2d',{willReadFrequently:true});
    sctx.drawImage(img,0,0,w,h);
    let data;
    try{data=sctx.getImageData(0,0,w,h).data}catch(e){return}
    let minX=w,minY=h,maxX=-1,maxY=-1;
    for(let y=0;y<h;y++){
      for(let x=0;x<w;x++){
        const i=(y*w+x)*4;
        const a=data[i+3];
        if(a>12){
          const r=data[i],g=data[i+1],b=data[i+2];
          const isAlmostWhite=r>246&&g>246&&b>246;
          if(!isAlmostWhite){
            if(x<minX)minX=x;if(x>maxX)maxX=x;
            if(y<minY)minY=y;if(y>maxY)maxY=y;
          }
        }
      }
    }
    if(maxX<minX || maxY<minY)return;
    const boxW=maxX-minX+1, boxH=maxY-minY+1;
    const out=240;
    const pad = type==='hair' ? 22 : type==='face' ? 24 : 28;
    const scale=Math.min((out-pad*2)/boxW,(out-pad*2)/boxH);
    const drawW=boxW*scale, drawH=boxH*scale;
    const dx=(out-drawW)/2, dy=(out-drawH)/2;
    const outCanvas=document.createElement('canvas');
    outCanvas.width=out;outCanvas.height=out;
    const octx=outCanvas.getContext('2d');
    octx.clearRect(0,0,out,out);
    octx.drawImage(srcCanvas,minX,minY,boxW,boxH,dx,dy,drawW,drawH);
    img.src=outCanvas.toDataURL('image/png');
  };
  if(img.complete)run();
  else img.addEventListener('load',run,{once:true});
}
const normalizedAccessoryCache=new Map();
async function normalizeAccessoryUrl(src){
  if(!src)return src;
  if(normalizedAccessoryCache.has(src))return normalizedAccessoryCache.get(src);
  const promise=new Promise(resolve=>{
    const img=new Image();
    img.onload=()=>{
      const w=img.naturalWidth||0,h=img.naturalHeight||0;
      if(!w||!h){resolve(src);return}
      const srcCanvas=document.createElement('canvas');
      srcCanvas.width=w;srcCanvas.height=h;
      const ctx=srcCanvas.getContext('2d',{willReadFrequently:true});
      ctx.drawImage(img,0,0,w,h);
      let data;
      try{data=ctx.getImageData(0,0,w,h).data}catch(e){resolve(src);return}
      let minX=w,minY=h,maxX=-1,maxY=-1;
      for(let y=0;y<h;y++){
        for(let x=0;x<w;x++){
          const i=(y*w+x)*4,a=data[i+3],r=data[i],g=data[i+1],b=data[i+2];
          const isWhite=r>246&&g>246&&b>246;
          if(a>12&&!isWhite){
            if(x<minX)minX=x;if(x>maxX)maxX=x;
            if(y<minY)minY=y;if(y>maxY)maxY=y;
          }
        }
      }
      if(maxX<minX||maxY<minY){resolve(src);return}
      const pad=Math.round(Math.max(maxX-minX+1,maxY-minY+1)*0.035);
      minX=Math.max(0,minX-pad);minY=Math.max(0,minY-pad);
      maxX=Math.min(w-1,maxX+pad);maxY=Math.min(h-1,maxY+pad);
      const boxW=maxX-minX+1,boxH=maxY-minY+1;
      const out=document.createElement('canvas');
      out.width=boxW;out.height=boxH;
      out.getContext('2d').drawImage(srcCanvas,minX,minY,boxW,boxH,0,0,boxW,boxH);
      resolve(out.toDataURL('image/png'));
    };
    img.onerror=()=>resolve(src);
    img.src=src;
  });
  normalizedAccessoryCache.set(src,promise);
  return promise;
}
async function normalizeAccessoryElement(img){
  if(!img||!img.src)return;
  const original=img.dataset.originalSrc||img.getAttribute('src')||img.src;
  if(!original)return;
  const id=img.dataset.accId||'';
  const color=img.dataset.icecreamColor||'#fd98c6';
  const cacheKey=original+'|'+id+'|'+color;
  if(img.dataset.normalizedAccessorySrc===cacheKey)return;
  img.dataset.originalSrc=original;
  img.dataset.normalizedAccessorySrc=cacheKey;
  const out=await getAccessoryRenderUrl(id, original, color);
  if(img.dataset.originalSrc===original)img.src=out;
}
function normalizeAllAccessoryElements(){
  document.querySelectorAll('img.acc-img, img.board-img, img.center-acc-img').forEach(img=>normalizeAccessoryElement(img));
}
function choiceImg(type,id,active,cb){
  const folder=type==='face'?'faces':type==='hair'?'hair':'accessories';
  const b=document.createElement('button');
  b.className=`choice ${type} ${active?'active':''}`;
  const src=type==='acc'?getAccSrc(id):(type==='hair'?getHairFrontSrc(id):`./assets/${folder}/${id}.png`);
  b.innerHTML=`<img src="${src}" alt="${id}">`;
  const img=b.querySelector('img');
  normalizeAssetPreview(img,type);
  b.onclick=()=>{snap();cb();sync()};
  return b
}
function renderSwatches(groups,part){
 const person=p(),palette=part==='skin'?skinColors:bodyColors;
 const names={1:'Персиковый',2:'Молочный',7:'Чёрный',10:'Золотой',11:'Карамельный',13:'Коричневый',14:'Тёмно-коричневый',15:'Жёлтый',18:'Оранжевый',19:'Красный',27:'Зелёный',31:'Голубой',36:'Розовый',39:'Лавандовый'};
 const common=part==='skin'?[15,1,2,11,13,14,7]:[19,7,2,36,39,31,27,15,18,10];
 function button(id){const color=palette[id];if(!color)return '';const meta=bodyColorMeta[id]||{},title=(names[id]||('Оттенок '+id))+(meta.transparent?' — полупрозрачный':'');return `<button type="button" class="swatch-btn ${+person[part]===+id?'active':''}" title="${title}" aria-label="${title}" style="background:${color}" data-part="${part}" data-id="${id}"></button>`}
 return `<div class="swatches popular-swatches">${common.map(button).join('')}</div><details class="more-colors"><summary>Все оттенки палитры</summary>${groups.map(g=>`<div class="group"><div class="group-title">${g.title}</div><div class="swatches">${g.ids.map(button).join('')}</div></div>`).join('')}</details>`;
}
function wireSwatches(){editorBody.querySelectorAll('.swatch-btn').forEach(b=>b.onclick=()=>{snap();p()[b.dataset.part]=+b.dataset.id;sync()})}
function nextButton(){const i=steps.findIndex(s=>s.key===step);return `<button class="btn dark" style="width:100%;margin-top:18px" id="nextStepBtn">${i===steps.length-1?'Готово':'Перейти далее'}</button>`}
async function removePrintBackground(dataUrl){
  return new Promise(resolve=>{
    const img=new Image();
    img.onload=()=>{
      const max=800, scale=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));
      const w=Math.max(1,Math.round(img.naturalWidth*scale)), h=Math.max(1,Math.round(img.naturalHeight*scale));
      const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
      const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0,w,h);
      const im=ctx.getImageData(0,0,w,h), d=im.data;
      const pts=[[0,0],[w-1,0],[0,h-1],[w-1,h-1],[Math.floor(w/2),0],[Math.floor(w/2),h-1],[0,Math.floor(h/2)],[w-1,Math.floor(h/2)]];
      let br=0,bg=0,bb=0;pts.forEach(([x,y])=>{const i=(y*w+x)*4;br+=d[i];bg+=d[i+1];bb+=d[i+2]});br/=pts.length;bg/=pts.length;bb/=pts.length;
      const brightness=.299*br+.587*bg+.114*bb;
      const tol=brightness>220?58:brightness>160?44:34;
      const seen=new Uint8Array(w*h), remove=new Uint8Array(w*h), q=[];
      for(let x=0;x<w;x++){q.push(x,0,x,h-1)} for(let y=1;y<h-1;y++){q.push(0,y,w-1,y)}
      const dist=(r,g,b)=>Math.hypot(r-br,g-bg,b-bb);
      let qi=0;
      while(qi<q.length){
        const x=q[qi++],y=q[qi++]; if(x<0||x>=w||y<0||y>=h)continue;
        const p=y*w+x; if(seen[p])continue; seen[p]=1;
        const i=p*4;
        if(dist(d[i],d[i+1],d[i+2])<=tol || d[i+3]<12){
          remove[p]=1; q.push(x-1,y,x+1,y,x,y-1,x,y+1);
        }
      }
      for(let i=0;i<w*h;i++){
        if(remove[i]) d[i*4+3]=0;
        else{
          const x=i%w,y=Math.floor(i/w);
          let edge=false;
          for(let yy=-1;yy<=1&&!edge;yy++)for(let xx=-1;xx<=1&&!edge;xx++){
            const nx=x+xx,ny=y+yy;if(nx>=0&&nx<w&&ny>=0&&ny<h&&remove[ny*w+nx])edge=true;
          }
          if(edge)d[i*4+3]=Math.min(d[i*4+3],210);
        }
      }
      ctx.putImageData(im,0,0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror=()=>resolve(dataUrl);
    img.src=dataUrl;
  });
}
function renderEditor(){const person=p();editorBody.innerHTML='';if(step==='skin'){editorBody.innerHTML=`<div class="section-title"><span class="badge">1.1</span> Цвет головы / кожи</div>${renderSwatches(skinGroups,'skin')}<div class="section-title"><span class="badge">1.2</span> Эмоция</div><div class="choice-grid" id="faceGrid"></div><label class="field">Имя<input id="nameInput" maxlength="40" value="${escapeHTML(person.name||'')}" placeholder="Имя персонажа"></label><label class="field">Что важно в этом герое?<textarea id="personNote" maxlength="500" rows="2" placeholder="Любимые вещи, привычки, пожелания…">${escapeHTML(person.note||'')}</textarea></label>`;faces.forEach(id=>faceGrid.appendChild(choiceImg('face',id,person.face===id,()=>person.face=id)));wireSwatches();nameInput.onfocus=()=>snap();nameInput.oninput=e=>{person.name=e.target.value;save();renderPeople();renderMobilePeople();updateStudioChrome()};personNote.onfocus=()=>snap();personNote.oninput=e=>{person.note=e.target.value;save();updateStudioChrome()}}
if(step==='hair'){
  const shownHair=filteredHair();
  editorBody.innerHTML=`<div class="section-title"><span class="badge">2.1</span> Прическа</div>
  <div class="small" style="margin:-4px 0 12px">Некоторые причёски можно посмотреть сзади. В готовой рамке персонаж будет показан спереди.</div>
  <div class="hair-cats" id="hairCats"></div>
  <div class="choice-grid" id="hairGrid"></div>
  `;
  hairCategories.forEach(cat=>{
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='hair-cat '+(activeHairCategory===cat.id?'active':'');
    btn.textContent=cat.title;
    btn.onclick=()=>{activeHairCategory=cat.id;hairBackView=false;renderEditor();updateHairFlipControls()};
    hairCats.appendChild(btn);
  });
  if(!shownHair.length){
    const e=document.createElement('div');
    e.className='empty';
    e.textContent='В этой категории пока пусто';
    hairGrid.appendChild(e);
  }else{
    shownHair.forEach(id=>hairGrid.appendChild(choiceImg('hair',id,String(person.hair)===String(id),()=>{person.hair=id;hairBackView=false})));
  }
}
if(step==='torso'){
  editorBody.innerHTML=`<div class="section-title"><span class="badge">3.1</span> Цвет торса</div>${renderSwatches(bodyGroups,'torso')}
  <div class="section-title"><span class="badge">3.2</span> Руки</div>
  <div class="sleeve-toggle">
    <button type="button" class="sleeve-choice ${person.sleeveMode!=='bare'?'active':''}" data-sleeve="sleeves">С рукавами</button>
    <button type="button" class="sleeve-choice ${person.sleeveMode==='bare'?'active':''}" data-sleeve="bare">Без рукавов</button>
  </div>
  <div class="section-title"><span class="badge">3.3</span> Принт спереди</div>
  <div class="print-card">
    <label class="file-label">Загрузить свой принт<input type="file" id="printInput" accept="image/*"></label>
    <button class="btn ghost" id="clearPrint">Без принта</button>
  </div>
  <div class="choice-grid" id="printsGrid"></div>
  <div class="print-controls ${person.print?'':'hidden'}" id="printControls">
    <label>Размер принта <input type="range" id="printScale" min="0.35" max="2.2" step="0.05" value="${person.printScale||1}"></label>
    <label>Влево / вправо <input type="range" id="printX" min="-18" max="18" step="1" value="${person.printX||0}"></label>
    <label>Выше / ниже <input type="range" id="printY" min="-14" max="18" step="1" value="${person.printY||0}"></label>
  </div>`;
  wireSwatches();
  editorBody.querySelectorAll('[data-sleeve]').forEach(b=>b.onclick=()=>{snap();person.sleeveMode=b.dataset.sleeve;sync()});
  printInput.onchange=e=>{
    const f=e.target.files[0];if(!f)return;
    const r=new FileReader();
    r.onload=async()=>{snap();person.print=await removePrintBackground(r.result);person.printScale=.9;person.printX=0;person.printY=0;sync()};
    r.readAsDataURL(f)
  };
  clearPrint.onclick=()=>{snap();person.print='';person.printScale=1;person.printX=0;person.printY=0;sync()};
  const none=document.createElement('button');
  none.className='choice '+(!person.print?'active':'');
  none.innerHTML='<span style="font-size:42px">⊘</span><small>Без принта</small>';
  none.onclick=()=>{snap();person.print='';sync()};
  printsGrid.appendChild(none);
  prints.forEach(id=>{
    const src=`./assets/prints/${id}.png`;
    const b=document.createElement('button');
    b.className='choice print '+(person.print===src?'active':'');
    b.innerHTML=`<img src="${src}" alt="${id}">`;
    normalizeAssetPreview(b.querySelector('img'),'print');
    b.onclick=()=>{snap();person.print=src;person.printScale=.9;person.printX=0;person.printY=0;sync()};
    printsGrid.appendChild(b)
  });
  if(printScale)printScale.oninput=e=>{person.printScale=Number(e.target.value);save();renderFigure()};
  if(printX)printX.oninput=e=>{person.printX=Number(e.target.value);save();renderFigure()};
  if(printY)printY.oninput=e=>{person.printY=Number(e.target.value);save();renderFigure()};
}
if(step==='legs'){editorBody.innerHTML=`<div class="section-title"><span class="badge">4.1</span> Ноги</div>${renderSwatches(bodyGroups,'legs')}`;wireSwatches()}
if(step==='accessory'){
  cleanOutfitFromHands(person);
  const isChildrenCategory=activeAccessoryCategory==='children';
  const isBagsCategory=activeAccessoryCategory==='bags';
  const isTwoHandsCategory=['twohands','two-hands','bothhands','center'].includes(activeAccessoryCategory);
  editorBody.innerHTML=`<div class="section-title"><span class="badge">5.1</span> Аксессуары</div>
    <div class="acc-cats" id="accCats"></div>
    <div class="acc-hand-block hidden" id="outfitBlock"><div class="acc-hand-title"><span>${isChildrenCategory?'👶':'★'}</span> <span id="outfitTitleText">${isChildrenCategory?'Ребенок':'Костюм'}</span></div><div class="choice-grid" id="outfitGrid"></div></div>
    <div class="acc-hand-block hidden" id="bagBlock"><div class="acc-hand-title"><span>👜</span> Сумка на фигурке</div><div class="choice-grid" id="bagGrid"></div></div>
    <div class="acc-hand-block hidden" id="boardBlock"><div class="acc-hand-title"><span>🛹</span> Под ногами</div><div class="choice-grid" id="boardGrid"></div></div>
    <div class="acc-hand-block hidden" id="centerBlock"><div class="acc-hand-title"><span>↔</span> В две руки</div><div class="choice-grid" id="centerGrid"></div></div>
    <div class="acc-hand-block" id="rightHandBlock"><div class="acc-hand-title"><span>R</span> Правая рука</div><div class="choice-grid" id="accRightGrid"></div></div>
    <div class="acc-hand-block" id="leftHandBlock"><div class="acc-hand-title"><span>L</span> Левая рука</div><div class="choice-grid" id="accLeftGrid"></div></div>
    `;
  accessoryCategories.forEach(cat=>{
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='acc-cat '+(activeAccessoryCategory===cat.id?'active':'');
    btn.textContent=cat.title;
    btn.onclick=()=>{activeAccessoryCategory=cat.id;renderEditor()};
    accCats.appendChild(btn);
  });

  const shown=accessories.filter(id=>activeAccessoryCategory==='all'||accessoryCategoryMap[id]===activeAccessoryCategory);
  const shownBags=shown.filter(id=>isBagAccessory(id));
  const shownOutfits=shown.filter(id=>isOutfitAccessory(id));
  const shownBoards=shown.filter(id=>isBoardAccessory(id));
  const shownCenters=shown.filter(id=>isCenterAccessory(id));
  const shownHandAccessories=shown.filter(id=>!isBodyAccessory(id));
  const selectedTwoHands=!!getCenterAccessory(person);

  // Для категории «Дети» ребенок ставится на тело, поэтому выбор правой/левой руки скрываем.
  // Для категории «Сумки» тоже показываем один общий блок, как накладку на фигурке.
  if(isChildrenCategory){
    outfitBlock.classList.remove('hidden');
    bagBlock.classList.add('hidden');
    boardBlock.classList.add('hidden');
    centerBlock.classList.add('hidden');
    rightHandBlock.classList.add('hidden');
    leftHandBlock.classList.add('hidden');
  }else if(isBagsCategory){
    outfitBlock.classList.add('hidden');
    bagBlock.classList.remove('hidden');
    boardBlock.classList.add('hidden');
    centerBlock.classList.add('hidden');
    rightHandBlock.classList.add('hidden');
    leftHandBlock.classList.add('hidden');
  }else if(isTwoHandsCategory){
    outfitBlock.classList.add('hidden');
    bagBlock.classList.add('hidden');
    boardBlock.classList.add('hidden');
    centerBlock.classList.remove('hidden');
    rightHandBlock.classList.toggle('hidden',!selectedTwoHands);
    leftHandBlock.classList.toggle('hidden',!selectedTwoHands);
  }else{
    bagBlock.classList.add('hidden');
    centerBlock.classList.toggle('hidden',!shownCenters.length);
    boardBlock.classList.toggle('hidden',!shownBoards.length);
    rightHandBlock.classList.remove('hidden');
    leftHandBlock.classList.remove('hidden');
  }

  rightHandBlock.classList.toggle('locked',selectedTwoHands && !rightHandBlock.classList.contains('hidden'));
  leftHandBlock.classList.toggle('locked',selectedTwoHands && !leftHandBlock.classList.contains('hidden'));

  function fillOutfitGrid(){
    if(!shownOutfits.length){
      outfitBlock.classList.add('hidden');
      return;
    }
    outfitBlock.classList.remove('hidden');
    const none=document.createElement('button');
    none.className='choice '+(!person.outfitAccessory?'active':'');
    none.textContent=isChildrenCategory?'Без ребенка':'Без костюма';
    none.onclick=()=>{snap();person.outfitAccessory='';sync()};
    outfitGrid.appendChild(none);
    shownOutfits.forEach(id=>outfitGrid.appendChild(choiceImg('acc',id,person.outfitAccessory===id,()=>{
      person.outfitAccessory=id;
      person.rightAccessory='';
      person.leftAccessory='';
      person.accessory='';
      cleanOutfitFromHands(person);
    })));
  }
  function fillBagGrid(){
    if(!isBagsCategory)return;
    const none=document.createElement('button');
    none.className='choice '+(!isBagAccessory(person.rightAccessory)?'active':'');
    none.textContent='Без сумки';
    none.onclick=()=>{snap();if(isBagAccessory(person.rightAccessory))person.rightAccessory='';sync()};
    bagGrid.appendChild(none);
    if(!shownBags.length){
      const e=document.createElement('div');
      e.className='empty';
      e.textContent='В этой категории пока пусто';
      bagGrid.appendChild(e);
      return;
    }
    shownBags.forEach(id=>bagGrid.appendChild(choiceImg('acc',id,person.rightAccessory===id,()=>{person.rightAccessory=id;person.leftAccessory='';person.accessory='';cleanOutfitFromHands(person)})));
  }
  function fillBoardGrid(){
    if(!shownBoards.length)return;
    const none=document.createElement('button');
    none.className='choice '+(!person.boardAccessory?'active':'');
    none.textContent='Без скейта';
    none.onclick=()=>{snap();person.boardAccessory='';sync()};
    boardGrid.appendChild(none);
    shownBoards.forEach(id=>boardGrid.appendChild(choiceImg('acc',id,person.boardAccessory===id,()=>{
      person.boardAccessory=id;
      person.rightAccessory='';
      person.leftAccessory='';
      person.accessory='';
      cleanOutfitFromHands(person);
    })));
  }
  function fillCenterGrid(){
    if(!shownCenters.length)return;
    const none=document.createElement('button');
    none.className='choice '+(!person.centerAccessory?'active':'');
    none.textContent='Без аксессуара';
    none.onclick=()=>{snap();person.centerAccessory='';sync()};
    centerGrid.appendChild(none);
    shownCenters.forEach(id=>centerGrid.appendChild(choiceImg('acc',id,person.centerAccessory===id,()=>{
      person.centerAccessory=id;
      person.rightAccessory='';
      person.leftAccessory='';
      person.accessory='';
      cleanOutfitFromHands(person);
    })));
  }
  function fillHandGrid(grid,side){
    const key=side==='left'?'leftAccessory':'rightAccessory';
    const none=document.createElement('button');
    none.className='choice '+(!person[key]?'active':'');
    none.textContent='Без аксессуара';
    none.onclick=()=>{snap();person[key]='';person.accessory='';sync()};
    grid.appendChild(none);
    if(!shownHandAccessories.length){
      const e=document.createElement('div');
      e.className='empty';
      e.textContent='В этой категории пока пусто';
      grid.appendChild(e);
      return;
    }
    shownHandAccessories.forEach(id=>grid.appendChild(choiceImg('acc',id,person[key]===id,()=>{person[key]=id;person.accessory='';cleanOutfitFromHands(person)})));
  }
  fillOutfitGrid();
  fillBagGrid();
  fillBoardGrid();
  fillCenterGrid();
  if(!isChildrenCategory && !isBagsCategory && (!isTwoHandsCategory || selectedTwoHands)){
    fillHandGrid(accRightGrid,'right');
    fillHandGrid(accLeftGrid,'left');
  }
  const hasIcecream=isIcecreamAccessory(person.rightAccessory)||isIcecreamAccessory(person.leftAccessory);
  if(hasIcecream){
    const panel=document.createElement('div');
    panel.className='icecream-color-panel';
    panel.innerHTML=`<div class="icecream-color-title">Цвет мороженого</div><div class="icecream-color-row"></div>`;
    const row=panel.querySelector('.icecream-color-row');
    [
      {name:'Розовый',color:'#fd98c6'},
      {name:'Коричневый',color:'#7a3f25'}
    ].forEach(item=>{
      const b=document.createElement('button');
      b.type='button';
      b.title=item.name;
      b.className='icecream-color-btn '+(getIcecreamColor(person).toLowerCase()===item.color.toLowerCase()?'active':'');
      b.style.background=item.color;
      b.onclick=()=>{snap();person.icecreamColor=item.color;icecreamRenderCache.clear();sync()};
      row.appendChild(b);
    });
    editorBody.insertBefore(panel, document.getElementById('nextStepBtn'));
  }
  const boardAccessory=getBoardAccessory(person);
  if(boardAccessory){
    const panel=document.createElement('div');
    panel.className='board-color-panel';
    panel.innerHTML=`<div class="board-color-title">Цвет скейта</div><div class="board-color-row"></div>`;
    const row=panel.querySelector('.board-color-row');
    [
      {name:'Зеленый',color:'#79c943'},
      {name:'Розовый',color:'#ff6fa8'}
    ].forEach(item=>{
      const b=document.createElement('button');
      b.type='button';
      b.title=item.name;
      b.className='board-color-btn '+(getScateColor(person).toLowerCase()===item.color.toLowerCase()?'active':'');
      b.style.background=item.color;
      b.onclick=()=>{snap();person.scateColor=item.color;icecreamRenderCache.clear();sync()};
      row.appendChild(b);
    });
    editorBody.insertBefore(panel, document.getElementById('nextStepBtn'));
  }
}
if(step==='frame'){
  const isBlack=frame.startsWith('black');
  const size=frame.replace('white-','').replace('black-','');
  const fc=isBlack?'#1c1c1c':'#f8f8f8';
  const ic=isBlack?'#282828':'#ececec';
  const sizes=[
    {id:'small', label:'до 5\nфигурок',  w:42,h:56},
    {id:'square',label:'до 8\nфигурок',  w:56,h:56},
    {id:'big',   label:'до 16\nфигурок', w:42,h:59},
  ];
  const fp=3;
  const cardsHtml=sizes.map(s=>`
    <button class="frame-size-card ${size===s.id?'active':''}" data-frame-size="${s.id}" type="button">
      <div class="frame-size-thumb" style="width:${s.w}px;height:${s.h}px;background:${fc};">
        <div style="position:absolute;inset:${fp}px;background:${ic};"></div>
      </div>
      <span class="frame-size-label">${s.label.replace('\n','<br>')}</span>
    </button>`).join('');
  editorBody.innerHTML=`
    <div class="section-title"><span class="badge">6.1</span> Рамка</div>
    <div class="frame-row" style="margin-bottom:14px">
      <button class="frame-choice ${!isBlack?'active':''}" data-frame-color="white" type="button">Белая</button>
      <button class="frame-choice ${isBlack?'active':''}" data-frame-color="black" type="button">Черная</button>
    </div>
    <div class="frame-size-grid">${cardsHtml}</div>
    <button class="frame-size-card" id="customSizeBtn" type="button" style="width:100%;flex-direction:row;gap:12px;justify-content:flex-start;padding:12px 14px;margin-top:4px">
      <div style="width:34px;height:34px;border-radius:50%;background:#fff0f5;display:grid;place-items:center;flex-shrink:0;font-size:18px;color:var(--red)">+</div>
      <span class="frame-size-label" style="text-align:left;color:var(--muted);font-size:13px">Другой размер</span>
    </button>
    <div class="section-title" style="margin-top:16px"><span class="badge">6.2</span> Фон рамки</div>
    <div class="frame-bg-grid" id="frameBgGrid">
      ${framePresetBackgrounds.map(bg=>`
        <button class="frame-bg-choice ${(!frameBgData&&framePresetBg===bg.id)?'active':''}" data-frame-bg="${bg.id}" type="button">
          <div class="frame-bg-thumb ${bg.id==='none'?'empty':''}" style="${bg.src?`background-image:url('${bg.src}')`:''}">${bg.id==='none'?'×':''}</div>
          <span class="frame-bg-name">${bg.name}</span>
        </button>`).join('')}
    </div>
    <label class="file-label" style="margin-top:12px">Загрузить свой фон<input type="file" id="bgInput" accept="image/*"></label>
    <label class="field">Масштаб фона<input type="range" id="bgScale" min="0.5" max="3" step="0.05" value="${frameBgScale}"></label>
    <button class="btn ghost" style="width:100%;margin-top:8px" id="addFrameToCartBtn">+ Добавить ещё одну рамку</button>
    <button class="btn dark" style="width:100%;margin-top:8px" id="openOrderFromEditor">Оформить заказ</button>
    <div class="section-title" style="margin-top:20px"><span class="badge">6.3</span> Надписи на фоне</div>
    <div class="frame-text-section">
      <div class="frame-text-move-hint">Надпись можно двигать прямо внутри рамки, как человечков. При перетаскивании появятся полосы выравнивания.</div>
      <button class="btn pink" id="addFrameText" type="button">+ Добавить текст</button>
      <div class="frame-text-list" id="frameTextList"></div>
      <textarea class="frame-text-input" id="frameTextInput" placeholder="Например: С Днём Рождения! ♡" rows="2"></textarea>
      <div>
        <div class="group-title">Шрифт</div>
        <div class="font-picker" id="fontPicker"></div>
      </div>
      <div>
        <div class="group-title">Цвет текста</div>
        <div class="frame-text-colors" id="frameTextColors"></div>
      </div>
      <div class="frame-text-slider-row">
        <label>Размер шрифта</label>
        <input type="range" id="frameTextSizeSlider" min="2" max="12" step="0.5" value="4">
      </div>
      <button class="btn ghost" id="clearFrameText" style="margin-top:4px">✕ Удалить выбранный текст</button>
    </div>
  `;
  editorBody.querySelectorAll('[data-frame-color]').forEach(b=>b.onclick=()=>{snap();frame=b.dataset.frameColor+'-'+size;invalidateFramePreviewBase();sync();});
  editorBody.querySelectorAll('[data-frame-size]').forEach(b=>b.onclick=()=>{
    snap();
    frame=(isBlack?'black':'white')+'-'+b.dataset.frameSize;
    invalidateFramePreviewBase();
    sync();
  });
  editorBody.querySelectorAll('[data-frame-bg]').forEach(b=>b.onclick=()=>{
    snap();
    framePresetBg=b.dataset.frameBg;
    frameBgData='';
    draftStorage.removeItem('mb_frame_bg');
    draftStorage.setItem('mb_frame_preset_bg',framePresetBg);
    sync();
  });
  document.getElementById('customSizeBtn').onclick=()=>{
    let m=document.getElementById('customSizeModal');
    if(!m){
      m=document.createElement('div');m.id='customSizeModal';m.className='modal';
      m.innerHTML=`<div class="modal-card" style="max-width:420px">
        <div class="modal-head"><h2>Другой размер</h2><button class="close" id="customSizeClose">×</button></div>
        <p style="color:var(--muted);font-size:15px;line-height:1.5;margin:0 0 18px">У нас есть и другие размеры рамок, доступные по индивидуальному заказу. Напишите нам ВКонтакте — поможем подобрать идеальный вариант!</p>
        <a class="btn pink" href="https://vk.com/write-224539480" target="_blank" rel="noopener" style="width:100%;margin-bottom:10px">Написать ВКонтакте</a>
        <button class="btn ghost" id="customSizeOk" style="width:100%">Понятно</button>
      </div>`;
      document.body.appendChild(m);
      document.getElementById('customSizeClose').onclick=()=>m.classList.remove('open');
      document.getElementById('customSizeOk').onclick=()=>m.classList.remove('open');
      m.onclick=e=>{if(e.target===m)m.classList.remove('open');};
    }
    m.classList.add('open');
  };
  bgInput.onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{frameBgData=r.result;framePresetBg='none';draftStorage.setItem('mb_frame_bg',frameBgData);draftStorage.setItem('mb_frame_preset_bg',framePresetBg);sync()};r.readAsDataURL(f)};
  bgScale.oninput=e=>{frameBgScale=e.target.value;draftStorage.setItem('mb_frame_bg_scale',frameBgScale);updateFrameBackground()};
  addFrameToCartBtn.onclick=()=>{
    addCurrentFrameToCart();
    notify('Рамка сохранена. Можно собрать следующую');
  };
  openOrderFromEditor.onclick=openOrderModal;
  // ── Секция надписей ──────────────────────────────────────────
  function refreshFrameTextEditor(){
    const current=activeFrameText();
    const list=document.getElementById('frameTextList');
    if(list){
      list.innerHTML='';
      if(!frameTexts.length){
        const empty=document.createElement('div');
        empty.className='small';
        empty.textContent='Пока нет надписей. Нажмите «Добавить текст».';
        list.appendChild(empty);
      }
      frameTexts.forEach(t=>{
        const item=document.createElement('div');
        item.className='frame-text-item '+(t.id===activeFrameTextId?'active':'');
        item.innerHTML=`<span>${(t.content||'Новая надпись').replace(/</g,'&lt;')}</span><button type="button" aria-label="Удалить текст">×</button>`;
        item.onclick=()=>{activeFrameTextId=t.id;saveFrameText();renderEditor();renderFrameTextOverlay();};
        item.querySelector('button').onclick=e=>{
          e.stopPropagation();
          snap();
          frameTexts=frameTexts.filter(x=>x.id!==t.id);
          activeFrameTextId=frameTexts[0]?.id||'';
          saveFrameText();
          renderEditor();
          renderFrameTextOverlay();
        };
        list.appendChild(item);
      });
    }
    const textInput=document.getElementById('frameTextInput');
    const sizeSlider=document.getElementById('frameTextSizeSlider');
    if(textInput){
      textInput.disabled=!current;
      textInput.value=current?current.content:'';
    }
    if(sizeSlider){
      sizeSlider.disabled=!current;
      sizeSlider.value=current?current.size:4;
    }
  }
  const addTextBtn=document.getElementById('addFrameText');
  if(addTextBtn){
    addTextBtn.onclick=()=>{
      snap();
      const item=makeFrameTextItem('Новая надпись');
      frameTexts.push(item);
      activeFrameTextId=item.id;
      saveFrameText();
      renderEditor();
      renderFrameTextOverlay();
    };
  }
  const fontPicker=document.getElementById('fontPicker');
  if(fontPicker){
    const current=activeFrameText();
    FRAME_FONTS.forEach(f=>{
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='font-btn '+(current&&current.font===f.id?'active':'');
      btn.innerHTML=`<span class="font-preview" style="font-family:'${f.id}',cursive">${f.preview}</span><span class="font-name">${f.name}</span>`;
      btn.onclick=()=>{
        const t=activeFrameText();
        if(!t)return;
        snap();
        t.font=f.id;
        saveFrameText();
        renderEditor();
        renderFrameTextOverlay();
      };
      fontPicker.appendChild(btn);
    });
  }
  const colorsBox=document.getElementById('frameTextColors');
  if(colorsBox){
    const current=activeFrameText();
    FRAME_TEXT_COLORS.forEach(c=>{
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='frame-text-color-btn '+(current&&current.color===c?'active':'');
      btn.style.background=c;
      btn.title=c;
      if(c==='#ffffff')btn.style.boxShadow='0 0 0 2px #ccc inset';
      btn.onclick=()=>{
        const t=activeFrameText();
        if(!t)return;
        snap();
        t.color=c;
        saveFrameText();
        renderEditor();
        renderFrameTextOverlay();
      };
      colorsBox.appendChild(btn);
    });
  }
  const textInput=document.getElementById('frameTextInput');
  if(textInput){
    textInput.oninput=e=>{
      const t=activeFrameText();
      if(!t)return;
      t.content=e.target.value;
      saveFrameText();
      renderFrameTextOverlay();
      const listItem=document.querySelector('.frame-text-item.active span');
      if(listItem)listItem.textContent=t.content||'Новая надпись';
    };
  }
  const sizeSlider=document.getElementById('frameTextSizeSlider');
  if(sizeSlider){
    sizeSlider.oninput=e=>{
      const t=activeFrameText();
      if(!t)return;
      t.size=Number(e.target.value);
      saveFrameText();
      renderFrameTextOverlay();
    };
  }
  const clearBtn=document.getElementById('clearFrameText');
  if(clearBtn){
    clearBtn.onclick=()=>{
      const t=activeFrameText();
      if(!t)return;
      snap();
      frameTexts=frameTexts.filter(x=>x.id!==t.id);
      activeFrameTextId=frameTexts[0]?.id||'';
      saveFrameText();
      renderEditor();
      renderFrameTextOverlay();
    };
  }
  refreshFrameTextEditor();
}
}
function goNextStep(){const i=steps.findIndex(s=>s.key===step);const nextKey=steps[Math.min(i+1,steps.length-1)].key;if(nextKey==='frame'){enterFrameMode()}else{step=nextKey;sync()}window.scrollTo({top:0,behavior:'smooth'})}
function goPrevStep(){const i=steps.findIndex(s=>s.key===step);if(i<=0)return;step=steps[i-1].key;sync();window.scrollTo({top:0,behavior:'smooth'})}
function frameType(){if(frame.includes('small'))return'small';if(frame.includes('square'))return'square';return'big'}
const SNAP_THRESHOLD=4;
const FRAME_SIZES={
  small:  {w:15.5, h:20.5},
  square: {w:22,   h:22},
  big:    {w:22.5, h:31.5}
};
const FIG_H_CM=4.0;
function figWH(){
  const t=frameType();
  const grid=miniGrid;
  const innerH=grid?.clientHeight||0;
  const innerW=grid?.clientWidth||0;
  const fallbackH=t==='small'?200:t==='square'?220:250;
  const h=innerH>10?innerH:fallbackH;
  const fs=FRAME_SIZES[t]||FRAME_SIZES.small;
  const pxPerCm=h/fs.h;
  const figH=Math.round(FIG_H_CM*pxPerCm);
  const figW=Math.round(figH*(1024/1536));
  return {w:figW, h:figH, pxPerCm, innerH:h, innerW:innerW||Math.round(h*(fs.w/fs.h))};
}
function defaultFramePositions(){
  const count=Math.max(1,people.length);
  const rowY=62;
  if(count===1){
    return [{x:50,y:rowY}];
  }
  const gap=Math.min(18,Math.max(10,70/count));
  const total=gap*(count-1);
  const start=50-total/2;
  return Array.from({length:count},(_,i)=>({
    x:Math.round((start+i*gap)*10)/10,
    y:rowY
  }));
}
function getPersonFramePos(i){
  const person=people[i];
  if(person&&person.frameX!=null&&person.frameY!=null)
    return [person.frameX,person.frameY];
  const defs=defaultFramePositions();
  return [defs[i]?.x||50, defs[i]?.y||62];
}
function ensureFramePositions(forceCenter=false){
  const defs=defaultFramePositions();
  people.forEach((person,i)=>{
    if(forceCenter || person.frameX==null || person.frameY==null){
      person.frameX=defs[i]?.x||50;
      person.frameY=defs[i]?.y||62;
    }
  });
}
function centerFrameOnceIfNeeded(){
  if(step!=='frame')return;
  if(frameAutoCentered || frameLayoutTouched)return;
  ensureFramePositions(true);
  frameAutoCentered=true;
  draftStorage.setItem('mb_frame_auto_centered','1');
  save();
}
function enterFrameMode(){
  step='frame';
  invalidateFramePreviewBase();
  centerFrameOnceIfNeeded();
  sync();
}
function ensureFrameSlots(){ensureFramePositions();}
function getAvailableSlots(){return [];}
function getPersonSlotIndex(i){return i;}
function setPersonSlot(){}
function getLayout(){return [];}
function slotWH(){return figWH();}
function renderSlotGhosts(){return '';}
const BASE_CM=0;
function getSnapGuideContainer(){
  let c=document.getElementById('snapGuideContainer');
  if(!c){
    c=document.createElement('div');
    c.id='snapGuideContainer';
    c.style.cssText='position:absolute;inset:0;pointer-events:none;z-index:30;overflow:hidden;';
    miniGrid.appendChild(c);
  }
  return c;
}
function clearSnapGuides(){
  const c=document.getElementById('snapGuideContainer');
  if(c)c.innerHTML='';
}
function calcSnap(dragIdx, rawXpct, rawYpct){
  const SNAP=SNAP_THRESHOLD;
  let snapX=rawXpct, snapY=rawYpct;
  const guides=[];
  const centerX=50, centerY=50;
  const others=people.map((p,i)=>{
    if(i===dragIdx)return null;
    return {x:p.frameX||50,y:p.frameY||85};
  }).filter(Boolean);
  const snapXCandidates=[centerX,...others.map(o=>o.x)];
  for(const cx of snapXCandidates){
    if(Math.abs(rawXpct-cx)<SNAP){
      snapX=cx;
      guides.push({type:'x',value:cx,isCenterX:cx===centerX});
      break;
    }
  }
  const snapYCandidates=[96,...others.map(o=>o.y)];
  for(const cy of snapYCandidates){
    if(Math.abs(rawYpct-cy)<SNAP){
      snapY=cy;
      guides.push({type:'y',value:cy,isCenterY:cy===centerY});
      break;
    }
  }
  return {x:snapX,y:snapY,guides};
}
function showSnapGuides(guides){
  const c=getSnapGuideContainer();
  c.innerHTML='';
  guides.forEach(g=>{
    const line=document.createElement('div');
    if(g.type==='x'){
      line.className='snap-guide snap-guide-x visible';
      line.style.left=g.value+'%';
    } else {
      line.className='snap-guide snap-guide-y visible';
      line.style.top=g.value+'%';
    }
    c.appendChild(line);
  });
}
function attachFrameDragHandlers(){
  miniGrid.querySelectorAll('.mini-figure').forEach(el=>{
    el.onpointerdown=e=>{
      if(step!=='frame')return;
      e.preventDefault();
      const idx=Number(el.dataset.index);
      const rect=miniGrid.getBoundingClientRect();
      el.setPointerCapture?.(e.pointerId);
      el.classList.add('is-dragging');
      active=idx;
      renderPeople();renderMobilePeople();
      const startX=e.clientX-rect.left;
      const startY=e.clientY-rect.top;
      const move=ev=>{
        const rawX=Math.min(98,Math.max(2,(ev.clientX-rect.left)/rect.width*100));
        const rawY=Math.min(95,Math.max(5,(ev.clientY-rect.top)/rect.height*100));
        const {x,y,guides}=calcSnap(idx,rawX,rawY);
        el.style.left=x+'%';
        el.style.top=y+'%';
        showSnapGuides(guides);
      };
      const up=ev=>{
        el.releasePointerCapture?.(e.pointerId);
        const rawX=Math.min(98,Math.max(2,(ev.clientX-rect.left)/rect.width*100));
        const rawY=Math.min(95,Math.max(5,(ev.clientY-rect.top)/rect.height*100));
        const {x,y}=calcSnap(idx,rawX,rawY);
        snap();
        frameLayoutTouched=true;
        draftStorage.setItem('mb_frame_layout_touched','1');
        people[idx].frameX=Math.round(x*10)/10;
        people[idx].frameY=Math.round(y*10)/10;
        el.classList.remove('is-dragging');
        clearSnapGuides();
        save();
        renderFrame();renderPeople();renderMobilePeople();
        window.removeEventListener('pointermove',move);
        window.removeEventListener('pointerup',up);
        window.removeEventListener('pointercancel',up);
      };
      move(e);
      window.addEventListener('pointermove',move);
      window.addEventListener('pointerup',up);
      window.addEventListener('pointercancel',up);
    };
  });
}
let framePreviewBase={w:0,h:0,isMobile:null};
function resetFrameBoxSize(){
  if(!frameBox)return;
  frameBox.style.removeProperty('width');
  frameBox.style.removeProperty('height');
  frameBox.style.removeProperty('max-width');
  frameBox.style.removeProperty('max-height');
  frameBox.style.removeProperty('aspect-ratio');
}
function measureFramePreviewBase(force=false){
  if(!viewer || !figureViewport)return {w:0,h:0,isMobile:false};
  const isMobile=window.matchMedia('(max-width: 900px)').matches;
  const vw=Math.max(
    figureViewport.clientWidth||0,
    viewer.clientWidth||0,
    120
  );
  const vh=Math.max(
    figureViewport.clientHeight||0,
    viewer.clientHeight||0,
    120
  );
  framePreviewBase={w:vw,h:vh,isMobile};
  return framePreviewBase;
}
function invalidateFramePreviewBase(){
  framePreviewBase={w:0,h:0,isMobile:null};
}
function applyFrameBoxSize(forceMeasure=false){
  if(!frameBox || !viewer || !figureViewport)return;
  const t=frameType();
  const ratios={small:15.5/20.5,square:1,big:22.5/31.5};
  const ratio=ratios[t]||1;
  const base=measureFramePreviewBase(forceMeasure);
  const isMobile=base.isMobile;
  const sidePad=isMobile?24:52;
  const topBottomPad=isMobile?28:48;
  const labelSpace=isMobile?34:48;
  const maxW=Math.max(120, base.w - sidePad*2);
  const maxH=Math.max(120, base.h - topBottomPad*2 - labelSpace);
  let w,h;
  if(t==='square'){
    const side=Math.min(maxW,maxH,isMobile?420:900);
    w=side;
    h=side;
  }else{
    h=Math.min(maxH,isMobile?460:900);
    w=h*ratio;
    if(w>maxW){
      w=maxW;
      h=w/ratio;
    }
  }
  w=Math.max(120,Math.round(w));
  h=Math.max(120,Math.round(h));
  frameBox.style.setProperty('width', w+'px', 'important');
  frameBox.style.setProperty('height', h+'px', 'important');
  frameBox.style.setProperty('max-width', 'none', 'important');
  frameBox.style.setProperty('max-height', 'none', 'important');
  frameBox.style.setProperty('aspect-ratio', ratio + ' / 1', 'important');
}
function updateFrameBackground(){
  if(!frameBox || !miniGrid)return;
  let bg=document.getElementById('frameBg');
  if(!bg){
    bg=document.createElement('div');
    bg.className='frame-bg';
    bg.id='frameBg';
    frameBox.insertBefore(bg,miniGrid);
  }
  const bgScaleNum=Math.max(0.5,Number(frameBgScale||1));
  const presetBg=getFramePresetBackground(framePresetBg);
  const bgSrc=frameBgData || presetBg.src || '';
  if(bgSrc){
    bg.style.backgroundImage=`url(${bgSrc})`;
    bg.style.backgroundPosition='center center';
    bg.style.backgroundRepeat='no-repeat';
    bg.style.backgroundSize=`${Math.round(bgScaleNum*100)}%`;
  }else{
    bg.style.backgroundImage='none';
    bg.style.backgroundSize='';
  }
}
function renderFrame(){
  const fd=frames.find(f=>f.id===frame);if(!fd)return;
  frameBox.className='frame-box '+fd.cls;
  applyFrameBoxSize();
  frameLabel.textContent=(frame.startsWith('black')?'Черная ':'Белая ')+fd.name;
  updateFrameBackground();
  ensureFramePositions();
  const {w,h}=figWH();
  miniGrid.innerHTML='';
  people.forEach((person,i)=>{
    cleanOutfitFromHands(person);
    const xPct=person.frameX??50;
    const yPct=person.frameY??95;
    const acc=getPersonAccessories(person);
    const outfit=getOutfitAccessory(person);
    const board=getBoardAccessory(person);
    const center=getCenterAccessory(person);
    const leftHand=acc.left&&!isOutfitAccessory(acc.left)&&!isBoardAccessory(acc.left)&&!isCenterAccessory(acc.left)&&!isCenterAccessory(acc.left);
    const rightHand=acc.right&&!isOutfitAccessory(acc.right)&&!isBoardAccessory(acc.right)&&!isCenterAccessory(acc.right)&&!isCenterAccessory(acc.right);
    miniGrid.insertAdjacentHTML('beforeend',`<div class="mini-figure" data-index="${i}" style="position:absolute;left:${xPct}%;top:${yPct}%;transform:translate(-50%,-100%);width:${w}px;height:${h}px;cursor:grab;z-index:5;touch-action:none;--skin:${skinColors[person.skin]};--torso:${bodyColors[person.torso]};--legs:${bodyColors[person.legs]};--arms:${person.sleeveMode==='bare'?skinColors[person.skin]:bodyColors[person.torso]}"><div class="part skin ${isTranslucentColor(person.skin)?'translucent':''}"></div><div class="part torso ${isTranslucentColor(person.torso)?'translucent':''}"></div><div class="part arms ${(person.sleeveMode!=='bare'&&isTranslucentColor(person.torso))?'translucent':''}"></div><div class="part legs ${isTranslucentColor(person.legs)?'translucent':''}"></div><img class="plastic-shadow" src="./assets/body/plastic-shadow.png" alt=""><img class="plastic-light" src="./assets/body/plastic-light.png" alt=""><img class="shadow-layer" src="./assets/body/base-outline.png" alt="">${board?`<img class="board-img" data-acc-id="${board}" data-icecream-color="${getAccColor(board,person)}" style="${boardVars(board)}" src="${getAccSrc(board)}" alt="">`:``}${outfit?`<img class="outfit-img" src="${getAccSrc(outfit)}" alt="">`:``}${center?`<img class="center-acc-img" data-acc-id="${center}" data-icecream-color="${getAccColor(center,person)}" style="${centerVars(center)}" src="${getAccSrc(center)}" alt="">`:``}<img class="face-img" src="./assets/faces/${person.face}.png" alt=""><img class="hair-img" src="${getHairFrontSrc(person.hair)}" alt="">${leftHand?`<img class="acc-img acc-left" data-acc-id="${acc.left}" data-icecream-color="${getAccColor(acc.left,person)}" style="${accVars(acc.left,'left')}" src="${getAccSrc(acc.left)}" alt="">`:``}${rightHand?`<img class="acc-img acc-right" data-acc-id="${acc.right}" data-icecream-color="${getAccColor(acc.right,person)}" style="${accVars(acc.right,'right')}" src="${getAccSrc(acc.right)}" alt="">`:``}</div>`);
  });
  attachFrameDragHandlers();
  normalizeAllAccessoryElements();
  // Надпись поверх рамки
  renderFrameTextOverlay();
}
function calcTextSnap(dragId, rawXpct, rawYpct){
  const SNAP=SNAP_THRESHOLD;
  let snapX=rawXpct, snapY=rawYpct;
  const guides=[];
  const others=[...people.map((p,i)=>({id:'person_'+i,x:p.frameX||50,y:p.frameY||85})),...frameTexts.filter(t=>t.id!==dragId).map(t=>({id:t.id,x:t.x||50,y:t.y||50}))];
  const snapXCandidates=[50,...others.map(o=>o.x)];
  for(const cx of snapXCandidates){
    if(Math.abs(rawXpct-cx)<SNAP){
      snapX=cx;
      guides.push({type:'x',value:cx});
      break;
    }
  }
  const snapYCandidates=[50,96,...others.map(o=>o.y)];
  for(const cy of snapYCandidates){
    if(Math.abs(rawYpct-cy)<SNAP){
      snapY=cy;
      guides.push({type:'y',value:cy});
      break;
    }
  }
  return {x:snapX,y:snapY,guides};
}
function attachFrameTextDragHandlers(){
  if(!miniGrid)return;
  miniGrid.querySelectorAll('.frame-text-overlay').forEach(el=>{
    el.onpointerdown=e=>{
      if(step!=='frame')return;
      e.preventDefault();
      e.stopPropagation();
      const id=el.dataset.textId;
      const item=frameTexts.find(t=>t.id===id);
      if(!item)return;
      activeFrameTextId=id;
      saveFrameText();
      renderFrameTextOverlay();
      const currentEl=miniGrid.querySelector(`.frame-text-overlay[data-text-id="${id}"]`)||el;
      const rect=miniGrid.getBoundingClientRect();
      currentEl.setPointerCapture?.(e.pointerId);
      currentEl.classList.add('is-dragging');
      const move=ev=>{
        const rawX=Math.min(98,Math.max(2,(ev.clientX-rect.left)/rect.width*100));
        const rawY=Math.min(96,Math.max(4,(ev.clientY-rect.top)/rect.height*100));
        const {x,y,guides}=calcTextSnap(id,rawX,rawY);
        currentEl.style.left=x+'%';
        currentEl.style.top=y+'%';
        showSnapGuides(guides);
      };
      const up=ev=>{
        currentEl.releasePointerCapture?.(e.pointerId);
        const rawX=Math.min(98,Math.max(2,(ev.clientX-rect.left)/rect.width*100));
        const rawY=Math.min(96,Math.max(4,(ev.clientY-rect.top)/rect.height*100));
        const {x,y}=calcTextSnap(id,rawX,rawY);
        snap();
        item.x=Math.round(x*10)/10;
        item.y=Math.round(y*10)/10;
        currentEl.classList.remove('is-dragging');
        clearSnapGuides();
        saveFrameText();
        renderFrameTextOverlay();
        window.removeEventListener('pointermove',move);
        window.removeEventListener('pointerup',up);
        window.removeEventListener('pointercancel',up);
      };
      move(e);
      window.addEventListener('pointermove',move);
      window.addEventListener('pointerup',up);
      window.addEventListener('pointercancel',up);
    };
  });
}
function renderFrameTextOverlay(){
  if(!miniGrid)return;
  miniGrid.querySelectorAll('.frame-text-overlay').forEach(el=>el.remove());
  frameTexts=frameTexts.filter(t=>String(t.content||'').trim());
  if(!frameTexts.length)return;
  miniGrid.style.containerType='size';
  frameTexts.forEach(t=>{
    const el=document.createElement('div');
    el.className='frame-text-overlay '+(t.id===activeFrameTextId?'active':'');
    el.dataset.textId=t.id;
    el.textContent=t.content;
    el.style.cssText=[
      `font-family:"${t.font||'Comforter Brush'}",cursive`,
      `font-size:${Number(t.size||4)}cqh`,
      `color:${t.color||'#ffffff'}`,
      `left:${Number(t.x||50)}%`,
      `top:${Number(t.y||88)}%`
    ].join(';');
    if(!CSS.supports('font-size','1cqh')){
      const h=miniGrid.clientHeight||200;
      el.style.fontSize=Math.round(h*Number(t.size||4)/100)+'px';
    }
    miniGrid.appendChild(el);
  });
  attachFrameTextDragHandlers();
}
function sync(){
  if(step!=='hair')hairBackView=false;
  applyFrameMobileView();
  updateHairFlipControls();
  save();
  renderPeople();
  renderMobilePeople();
  renderSteps();
  renderEditor();
  renderFigure();
  normalizeAllAccessoryElements();
  updateStageNextButton();
  updateCartBadge();
  if(typeof updateStudioChrome==='function')updateStudioChrome();
  if(step==='frame'){
    requestAnimationFrame(()=>{
      renderFrame();
    });
  }
}
function updateStageNextButton(){
  const btn=document.getElementById('stageNextBtn');
  const wrap=document.getElementById('stageNextWrap');
  const backBtn=document.getElementById('stageBackBtn');
  const backWrap=document.getElementById('stageBackWrap');
  if(!btn||!wrap)return;
  const arrow=document.getElementById('stageNextArrow');
  const label=document.getElementById('stageNextLabel');
  if(step==='frame'){
    if(arrow)arrow.textContent='🛒';
    if(label)label.textContent='К заказу';
    btn.onclick=openOrderModal;
  }else{
    const isLast=step==='accessory';
    if(arrow)arrow.textContent=isLast?'✓':'→';
    if(label)label.textContent=isLast?'В рамку':'Далее';
    btn.onclick=goNextStep;
  }
  if(backBtn)backBtn.onclick=goPrevStep;
  if(backWrap)backWrap.classList.toggle('hidden',step==='skin');
}
function orderText(){
  const fd=frames.find(f=>f.id===frame);
  const {total}=calcOrderPrice();
  return `MIGLICK — заказ\n\nРамка: ${frame.startsWith('black')?'черная':'белая'}\nРазмер: ${fd.name}\nФон: ${frameBgData?'свой загруженный':(getFramePresetBackground(framePresetBg).name||'Без фона')}\nФигурок: ${people.length}\nИтоговая стоимость: ${total.toLocaleString('ru-RU')} ₽\n\n`+people.map((x,i)=>`${i+1}. ${x.name}\nЛицо: ${x.face}\nПрическа: ${x.hair}\nКожа: ${x.skin}\nТорс: ${x.torso}\nРуки: ${x.sleeveMode==='bare'?'без рукавов':'с рукавами'}\nНоги: ${x.legs}\nКостюм-накладка: ${getOutfitAccessory(x)||'нет'}\nПод ногами: ${getBoardAccessory(x)||'нет'}\nВ две руки: ${getCenterAccessory(x)||'нет'}\nЦвет скейта: ${getBoardAccessory(x)?getScateColor(x):'нет'}\nПравая рука: ${x.rightAccessory||'нет'}\nЛевая рука: ${x.leftAccessory||'нет'}\nЦвет мороженого: ${(isIcecreamAccessory(x.rightAccessory)||isIcecreamAccessory(x.leftAccessory))?getIcecreamColor(x):'нет'}\nПринт: ${x.print||'нет'}\nРазмер принта: ${x.printScale||1}\nПозиция принта: X ${x.printX||0}, Y ${x.printY||0}\nКомментарий: ${x.note||'нет'}`).join('\n\n')
}
function loadImg(src){return new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src})}
async function loadFirstAvailableImage(srcList){
  for(const src of srcList){
    const img=await loadImg(src+(src.includes('?')?'&':'?')+'v='+Date.now());
    if(img)return img;
  }
  return null;
}
function tint(ctx,img,color,x,y,w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const t=c.getContext('2d');t.drawImage(img,0,0,w,h);t.globalCompositeOperation='source-in';t.fillStyle=color;t.fillRect(0,0,w,h);ctx.drawImage(c,x,y,w,h)}
function rgbaFromColor(color,alpha=.6){
  const s=String(color||'').trim();
  if(s.startsWith('rgba')){
    const nums=s.match(/rgba?\(([^)]+)\)/)?.[1].split(',').map(v=>parseFloat(v.trim()))||[0,0,0,1];
    return `rgba(${nums[0]||0},${nums[1]||0},${nums[2]||0},${alpha})`;
  }
  if(s.startsWith('rgb')){
    const nums=s.match(/rgba?\(([^)]+)\)/)?.[1].split(',').map(v=>parseFloat(v.trim()))||[0,0,0];
    return `rgba(${nums[0]||0},${nums[1]||0},${nums[2]||0},${alpha})`;
  }
  if(s[0]==='#'){
    let hex=s.slice(1);
    if(hex.length===3)hex=hex.split('').map(ch=>ch+ch).join('');
    const n=parseInt(hex,16);
    return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${alpha})`;
  }
  return color;
}
function drawMaskedGradient(ctx,mask,x,y,w,h,paintFn,alpha=1,blend='source-over'){
  const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));
  const t=c.getContext('2d');
  paintFn(t,c.width,c.height);
  t.globalCompositeOperation='destination-in';
  t.drawImage(mask,0,0,c.width,c.height);
  ctx.save();
  ctx.globalAlpha=alpha;
  ctx.globalCompositeOperation=blend;
  ctx.drawImage(c,x,y,w,h);
  ctx.restore();
}
function tintLegoPlastic(ctx,mask,color,x,y,w,h,isGlass=false){
  if(!isGlass){tint(ctx,mask,color,x,y,w,h);return}
  drawMaskedGradient(ctx,mask,x,y,w,h,(t,cw,ch)=>{
    t.fillStyle=rgbaFromColor(color,.52);
    t.fillRect(0,0,cw,ch);
    const g=t.createLinearGradient(0,0,cw,ch);
    g.addColorStop(0,'rgba(255,255,255,.36)');
    g.addColorStop(.28,'rgba(255,255,255,.08)');
    g.addColorStop(.72,'rgba(0,0,0,.04)');
    g.addColorStop(1,'rgba(0,0,0,.20)');
    t.fillStyle=g;t.fillRect(0,0,cw,ch);
  },1,'source-over');
  drawMaskedGradient(ctx,mask,x,y,w,h,(t,cw,ch)=>{
    const g=t.createLinearGradient(cw*.12,0,cw*.82,ch*.74);
    g.addColorStop(0,'rgba(255,255,255,0)');
    g.addColorStop(.42,'rgba(255,255,255,.90)');
    g.addColorStop(.56,'rgba(255,255,255,.18)');
    g.addColorStop(1,'rgba(255,255,255,0)');
    t.fillStyle=g;t.fillRect(0,0,cw,ch);
    const r=t.createRadialGradient(cw*.30,ch*.13,0,cw*.30,ch*.13,cw*.35);
    r.addColorStop(0,'rgba(255,255,255,.70)');
    r.addColorStop(.38,'rgba(255,255,255,.18)');
    r.addColorStop(1,'rgba(255,255,255,0)');
    t.fillStyle=r;t.fillRect(0,0,cw,ch);
  },.82,'screen');
  drawMaskedGradient(ctx,mask,x,y,w,h,(t,cw,ch)=>{
    const r=t.createRadialGradient(cw*.5,ch*.45,cw*.18,cw*.5,ch*.45,cw*.78);
    r.addColorStop(0,'rgba(0,0,0,0)');
    r.addColorStop(.68,'rgba(0,0,0,.05)');
    r.addColorStop(1,'rgba(0,0,0,.28)');
    t.fillStyle=r;t.fillRect(0,0,cw,ch);
  },.70,'multiply');
}
async function exportOrderImage(){
  const fd=frames.find(f=>f.id===frame);
  const isSquare=fd.m==='square';
  const canvas=document.createElement('canvas');
  canvas.width=1200;
  canvas.height=isSquare?1320:(fd.m==='big'?1580:1460);
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#fff7fb';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  const frameIsBlack=frame.startsWith('black');
  const fw=isSquare?820:fd.m==='big'?720:660;
  const fh=isSquare?820:fd.m==='big'?1040:880;
  const fx=(canvas.width-fw)/2, fy=90;
  const fp=Math.round(Math.min(fw,fh)*0.05);
  const contentX=fx+fp, contentY=fy+fp;
  const contentW=fw-fp*2, contentH=fh-fp*2;
  const frameColor=frameIsBlack?'#1c1c1c':'#f8f8f8';
  ctx.save();
  ctx.shadowColor='rgba(40,20,30,.22)';ctx.shadowBlur=40;ctx.shadowOffsetY=18;
  ctx.fillStyle=frameColor;ctx.fillRect(fx,fy,fw,fh);
  ctx.restore();
  ctx.save();
  ctx.beginPath();ctx.rect(contentX,contentY,contentW,contentH);ctx.clip();
  ctx.fillStyle='#ececec';ctx.fillRect(contentX,contentY,contentW,contentH);
  const presetBg=getFramePresetBackground(framePresetBg);
  const bgSrc=frameBgData || presetBg.src || '';
  if(bgSrc){
    const bgImg=await loadImg(bgSrc);
    if(bgImg){
      const us=Math.max(0.5,Number(frameBgScale||1));
      const cs=Math.max(contentW/bgImg.naturalWidth,contentH/bgImg.naturalHeight)*us;
      ctx.drawImage(bgImg,contentX+(contentW-bgImg.naturalWidth*cs)/2,contentY+(contentH-bgImg.naturalHeight*cs)/2,bgImg.naturalWidth*cs,bgImg.naturalHeight*cs);
    }
  }
  ctx.restore();
  const fg=ctx.createLinearGradient(fx,fy,fx+fw,fy+fh);
  if(frameIsBlack){fg.addColorStop(0,'#2e2e2e');fg.addColorStop(.5,'#1c1c1c');fg.addColorStop(1,'#080808');}
  else{fg.addColorStop(0,'#ffffff');fg.addColorStop(.5,'#f0f0f0');fg.addColorStop(1,'#d8d8d8');}
  ctx.save();
  ctx.beginPath();ctx.rect(fx,fy,fw,fh);ctx.rect(contentX,contentY,contentW,contentH);
  ctx.fillStyle=fg;ctx.fill('evenodd');
  ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx+fw,fy);ctx.lineTo(fx+fw-fp,fy+fp);ctx.lineTo(fx+fp,fy+fp);ctx.closePath();
  ctx.fillStyle=frameIsBlack?'rgba(255,255,255,.06)':'rgba(255,255,255,.7)';ctx.fill();
  ctx.beginPath();ctx.moveTo(fx,fy+fh);ctx.lineTo(fx+fw,fy+fh);ctx.lineTo(fx+fw-fp,fy+fh-fp);ctx.lineTo(fx+fp,fy+fh-fp);ctx.closePath();
  ctx.fillStyle=frameIsBlack?'rgba(0,0,0,.4)':'rgba(0,0,0,.12)';ctx.fill();
  ctx.restore();
  ctx.strokeStyle=frameIsBlack?'rgba(255,255,255,.08)':'rgba(0,0,0,.10)';
  ctx.lineWidth=2;ctx.strokeRect(contentX+.5,contentY+.5,contentW-1,contentH-1);
  const sm=await loadImg('./assets/body/skin-mask.png');
  const tm=await loadImg('./assets/body/torso-mask.png');
  const shirtMask=await loadImg('./assets/body/shirt-mask.png');
  const armMask=await loadImg('./assets/body/arms-mask.png');
  const lm=await loadImg('./assets/body/legs-mask.png');
  const ps=await loadImg('./assets/body/plastic-shadow.png');
  const pl=await loadImg('./assets/body/plastic-light.png');
  const ol=await loadImg('./assets/body/base-outline.png');
  ensureFramePositions();
  const fs=FRAME_SIZES[frameType()]||FRAME_SIZES.small;
  const pxPerCm=contentH/fs.h;
  const figH=Math.round(FIG_H_CM*pxPerCm);
  const figW=Math.round(figH*(1024/1536));
  for(let i=0;i<people.length;i++){
    const person=people[i];
    cleanOutfitFromHands(person);
    const xPct=person.frameX??50;
    const yPct=person.frameY??95;
    const figCX=contentX+contentW*xPct/100;
    const figBottomY=contentY+contentH*yPct/100;
    const dx=figCX-figW/2, dy=figBottomY-figH;
    const w=figW, h=figH;
    ctx.save();
    ctx.beginPath();ctx.rect(contentX,contentY,contentW,contentH);ctx.clip();
    const board=getBoardAccessory(person);
    if(board){
      const bi=await loadImg(await getAccessoryRenderUrl(board,getAccSrc(board),getAccColor(board,person)));
      if(bi){
        const bm=getBoardMeta(board);
        const bw=w*(bm.w/100),bh=bw*(bi.naturalHeight/bi.naturalWidth);
        const bcx=dx+w*(bm.x/100),bcy=dy+h*(bm.y/100);
        ctx.save();ctx.translate(bcx,bcy);ctx.rotate(((bm.r||0)*Math.PI)/180);ctx.scale(bm.flip??1,1);
        ctx.drawImage(bi,-bw/2,-bh/2,bw,bh);ctx.restore();
      }
    }
    if(sm)tintLegoPlastic(ctx,sm,skinColors[person.skin],dx,dy,w,h,isTranslucentColor(person.skin));
    if(tm)tintLegoPlastic(ctx,tm,bodyColors[person.torso],dx,dy,w,h,isTranslucentColor(person.torso));
    if(armMask)tintLegoPlastic(ctx,armMask,person.sleeveMode==='bare'?skinColors[person.skin]:bodyColors[person.torso],dx,dy,w,h,person.sleeveMode!=='bare'&&isTranslucentColor(person.torso));
    if(lm)tintLegoPlastic(ctx,lm,bodyColors[person.legs],dx,dy,w,h,isTranslucentColor(person.legs));
    if(ps){ctx.globalCompositeOperation='multiply';ctx.globalAlpha=.28;ctx.drawImage(ps,dx,dy,w,h);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;}
    if(pl){ctx.globalCompositeOperation='screen';ctx.globalAlpha=.65;ctx.drawImage(pl,dx,dy,w,h);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;}
    if(ol){ctx.globalAlpha=.16;ctx.drawImage(ol,dx,dy,w,h);ctx.globalAlpha=1;}
    if(person.print&&(shirtMask||tm)){
      const pi=await loadImg(person.print);
      if(pi){
        const mc=document.createElement('canvas');mc.width=Math.max(1,Math.round(w));mc.height=Math.max(1,Math.round(h));
        const mx=mc.getContext('2d',{willReadFrequently:true});mx.drawImage(shirtMask||tm,0,0,mc.width,mc.height);
        const md=mx.getImageData(0,0,mc.width,mc.height).data;
        let lx=mc.width,rx=0,ty=mc.height,by=0;
        for(let yy=0;yy<mc.height;yy++)for(let xx=0;xx<mc.width;xx++){const a=md[(yy*mc.width+xx)*4+3];if(a>30){if(xx<lx)lx=xx;if(xx>rx)rx=xx;if(yy<ty)ty=yy;if(yy>by)by=yy}}
        const tw=rx-lx,th=by-ty;
        if(tw>2&&th>2){
          const scale=Number(person.printScale||1),pxShift=Number(person.printX||0)/100*tw,pyShift=Number(person.printY||0)/100*th;
          const pw=tw*.62*scale,ph=pw*(pi.naturalHeight/pi.naturalWidth);
          ctx.save();ctx.beginPath();ctx.rect(dx+lx,dy+ty,tw,th);ctx.clip();
          ctx.drawImage(pi,dx+lx+tw/2-pw/2+pxShift,dy+ty+th*.43-ph/2+pyShift,pw,ph);ctx.restore();
        }
      }
    }
    const outfit=getOutfitAccessory(person);
    if(outfit){
      const oi=await loadImg(getAccSrc(outfit));
      if(oi)ctx.drawImage(oi,dx,dy,w,h);
    }
    const center=getCenterAccessory(person);
    if(center){
      const ci=await loadImg(await getAccessoryRenderUrl(center,getAccSrc(center),getAccColor(center,person)));
      if(ci){
        const cm=getCenterMeta(center);
        const cw=w*(cm.w/100),ch=cw*(ci.naturalHeight/ci.naturalWidth);
        const ccx=dx+w*(cm.x/100),ccy=dy+h*(cm.y/100);
        ctx.save();ctx.translate(ccx,ccy);ctx.rotate(((cm.r||0)*Math.PI)/180);ctx.scale(cm.flip??1,1);
        ctx.drawImage(ci,-cw/2,-ch/2,cw,ch);ctx.restore();
      }
    }
    const fi=await loadImg(`./assets/faces/${person.face}.png`);
    const hi=await loadImg(getHairFrontSrc(person.hair));
    if(fi)ctx.drawImage(fi,dx,dy,w,h);
    if(hi)ctx.drawImage(hi,dx,dy,w,h);
    const acc=getPersonAccessories(person);
    for(const side of ['left','right']){
      const id=acc[side];if(!id||isOutfitAccessory(id)||isBoardAccessory(id)||isCenterAccessory(id))continue;
      const ai=await loadImg(await getAccessoryRenderUrl(id,getAccSrc(id),getAccColor(id,person)));
      if(ai){
        const am=getAccessoryMeta(id,side);
        const aw=w*(am.w/100),ah=aw*(ai.naturalHeight/ai.naturalWidth);
        const cx=dx+w*(am.x/100),cy=dy+h*(am.y/100);
        ctx.save();ctx.translate(cx,cy);ctx.rotate(((am.r||0)*Math.PI)/180);ctx.scale(am.flip??1,1);
        ctx.drawImage(ai,-aw/2,-ah/2,aw,ah);ctx.restore();
      }
    }
    ctx.restore();
  }
  // Надписи пользователя внутри рамки
  if(Array.isArray(frameTexts)&&frameTexts.length){
    ctx.save();
    ctx.beginPath();ctx.rect(contentX,contentY,contentW,contentH);ctx.clip();
    frameTexts.filter(t=>String(t.content||'').trim()).forEach(t=>{
      const fontFamily=`"${t.font||'Comforter Brush'}",cursive`;
      const fontSize=Math.round(contentH*Number(t.size||4)/100);
      ctx.save();
      ctx.font=`${fontSize}px ${fontFamily}`;
      ctx.fillStyle=t.color||'#ffffff';
      ctx.textAlign='center';
      ctx.textBaseline='middle';
      ctx.shadowColor='rgba(0,0,0,.28)';ctx.shadowBlur=8;ctx.shadowOffsetY=3;
      const tx=contentX+contentW*(Number(t.x||50)/100);
      const ty=contentY+contentH*(Number(t.y||88)/100);
      const lines=String(t.content||'').split('\n');
      const lineH=fontSize*1.25;
      const totalH=lines.length*lineH;
      lines.forEach((line,i)=>{
        ctx.fillText(line,tx,ty-totalH/2+lineH*i+lineH/2);
      });
      ctx.restore();
    });
    ctx.restore();
  }
  return canvas.toDataURL('image/png');
}
async function exportShareImage(snapshotData){
  const sp=people,sf=frame,sb=frameBgData,sbs=frameBgScale,spb=framePresetBg,st=frameTexts,stid=activeFrameTextId;
  if(snapshotData){
    people=snapshotData.people;
    frame=snapshotData.frame;
    frameBgData=snapshotData.frameBgData;
    frameBgScale=snapshotData.frameBgScale;
    framePresetBg=snapshotData.framePresetBg;
    frameTexts=Array.isArray(snapshotData.frameTexts)?snapshotData.frameTexts:[];
    activeFrameTextId=snapshotData.activeFrameTextId || (frameTexts[0]?.id || '');
  }
  try{
    const canvas=document.createElement('canvas');
    canvas.width=1080;
    canvas.height=1920;
    const ctx=canvas.getContext('2d');

    await document.fonts.ready;
    ctx.fillStyle='#F8F7F2';ctx.fillRect(0,0,1080,1920);
    ctx.fillStyle='#6654F4';ctx.font='500 27px Onest';ctx.fillText('ВАША ИСТОРИЯ В ДЕТАЛЯХ',84,166);
    ctx.fillStyle='#26263A';ctx.font='700 66px Unbounded';
    ctx.fillText('Маленькие герои.',84,282);ctx.fillText('Большие истории.',84,372);
    ctx.font='400 31px Onest';ctx.fillStyle='#696779';ctx.fillText('Собрано с любовью — и совсем как мы.',84,444);
    ctx.fillStyle='#F1EAF1';ctx.fillRect(60,500,960,1050);
    ctx.fillStyle='#26263A';ctx.font='800 65px Unbounded';ctx.fillText('MIGLICK',84,1732);
    ctx.fillStyle='#6654F4';ctx.font='500 30px Onest';ctx.fillText('У каждого героя есть своя история.',84,1800);

    const frameImage=await loadImg(await exportOrderImage());
    if(frameImage){
      const fd=frames.find(f=>f.id===frame) || frames[1];
      const isSquare=fd.m==='square';
      const srcCanvasW=1200;
      const fw=isSquare?820:fd.m==='big'?720:660;
      const fh=isSquare?820:fd.m==='big'?1040:880;
      const fx=(srcCanvasW-fw)/2;
      const fy=90;

      const zone={x:140,y:520,w:800,h:900};
      const scale=Math.min(zone.w/fw,zone.h/fh);
      const dw=fw*scale;
      const dh=fh*scale;
      const dx=zone.x+(zone.w-dw)/2;
      const dy=zone.y+(zone.h-dh)/2;

      ctx.drawImage(frameImage,fx,fy,fw,fh,dx,dy,dw,dh);
    }

    return canvas.toDataURL('image/png');
  }finally{
    if(snapshotData){
      people=sp;frame=sf;frameBgData=sb;frameBgScale=sbs;framePresetBg=spb;frameTexts=st;activeFrameTextId=stid;
    }
  }
}

let orderZoom=1;
function setOrderZoom(v){
  orderZoom=Math.min(2.6,Math.max(.75,Number(v)||1));
  if(orderPreviewBox)orderPreviewBox.style.setProperty('--order-zoom',orderZoom);
  if(orderZoomLabel)orderZoomLabel.textContent=Math.round(orderZoom*100)+'%';
}
const PAYMENT_METHODS=[
  {id:'card_link',icon:'💳',label:'Картой онлайн по ссылке от менеджера'},
  {id:'sbp',icon:'📱',label:'СБП (перевод по номеру телефона)'},
  {id:'cash',icon:'💵',label:'Наличными или переводом при получении'}
];
function paymentMethodLabel(){
  const pm=PAYMENT_METHODS.find(x=>x.id===paymentMethod);
  return pm?pm.label:'не выбран';
}
function renderPaymentMethods(){
  const box=document.getElementById('paymentMethods');
  if(!box)return;
  box.innerHTML='';
  PAYMENT_METHODS.forEach(pm=>{
    const b=document.createElement('button');
    b.type='button';
    b.className='payment-choice '+(paymentMethod===pm.id?'active':'');
    b.innerHTML=`<span class="pm-icon">${pm.icon}</span><span>${pm.label}</span>`;
    b.onclick=()=>{
      paymentMethod=pm.id;
      draftStorage.setItem('mb_payment_method',paymentMethod);
      renderPaymentMethods();
      if(orderTextarea)orderTextarea.value=orderFullText(currentOrderFrames);
    };
    box.appendChild(b);
  });
}
let currentOrderFrames=[];
async function exportFrameImage(snapshotData){
  if(!snapshotData)return exportOrderImage();
  const sp=people,sf=frame,sb=frameBgData,sbs=frameBgScale,spb=framePresetBg,st=frameTexts,stid=activeFrameTextId;
  people=snapshotData.people;frame=snapshotData.frame;frameBgData=snapshotData.frameBgData;frameBgScale=snapshotData.frameBgScale;framePresetBg=snapshotData.framePresetBg;frameTexts=Array.isArray(snapshotData.frameTexts)?snapshotData.frameTexts:[];activeFrameTextId=snapshotData.activeFrameTextId || (frameTexts[0]?.id || '');
  try{return await exportOrderImage();}
  finally{people=sp;frame=sf;frameBgData=sb;frameBgScale=sbs;framePresetBg=spb;frameTexts=st;activeFrameTextId=stid;}
}
function frameSummaryText(item,index){
  const fd=frames.find(f=>f.id===item.frame);
  const {total}=calcOrderPrice(item.people,item.frame,!!item.frameBgData);
  return `── Рамка ${index+1} ──\nЦвет: ${item.frame.startsWith('black')?'черная':'белая'}\nРазмер: ${fd?fd.name:''}\nФигурок: ${item.people.length}\nСтоимость рамки: ${total.toLocaleString('ru-RU')} ₽\n\n`+item.people.map((x,i)=>`${i+1}. ${x.name}\nЛицо: ${x.face}\nПрическа: ${x.hair}\nКожа: ${x.skin}\nТорс: ${x.torso}\nРуки: ${x.sleeveMode==='bare'?'без рукавов':'с рукавами'}\nНоги: ${x.legs}\nКостюм-накладка: ${getOutfitAccessory(x)||'нет'}\nПод ногами: ${getBoardAccessory(x)||'нет'}\nВ две руки: ${getCenterAccessory(x)||'нет'}\nЦвет скейта: ${getBoardAccessory(x)?getScateColor(x):'нет'}\nПравая рука: ${x.rightAccessory||'нет'}\nЛевая рука: ${x.leftAccessory||'нет'}\nПринт: ${x.print?'да':'нет'}\nКомментарий: ${x.note||'нет'}`).join('\n\n');
}
function orderFullText(allFrames){
  const total=cartTotal();
  const header=`MIGLICK — заказ\n\nРамок в заказе: ${allFrames.length}\nИтоговая стоимость: ${total.toLocaleString('ru-RU')} ₽\nСпособ оплаты: ${paymentMethodLabel()}\n\n`;
  return header+allFrames.map((item,i)=>frameSummaryText(item,i)).join('\n\n══════════\n\n');
}
function renderOrderGallery(images,allFrames){
  const gallery=document.getElementById('orderGallery');
  const singleBox=document.getElementById('orderPreviewBox');
  const zoomRow=document.getElementById('orderZoomRow');
  if(!gallery||!singleBox)return;
  if(allFrames.length<=1){
    gallery.classList.add('hidden');
    gallery.innerHTML='';
    singleBox.classList.remove('hidden');
    if(zoomRow)zoomRow.classList.add('hidden');
    orderPreviewImg.src=images[0]||'';
    return;
  }
  singleBox.classList.add('hidden');
  if(zoomRow)zoomRow.classList.add('hidden');
  gallery.classList.remove('hidden');
  gallery.innerHTML='';
  images.forEach((src,i)=>{
    const fd=frames.find(f=>f.id===allFrames[i].frame);
    const div=document.createElement('div');
    div.className='order-gallery-item';
    div.innerHTML=`<div class="small">Рамка ${i+1} · ${allFrames[i].frame.startsWith('black')?'черная':'белая'} · ${fd?fd.name:''} · ${allFrames[i].people.length} фиг.</div><img src="${src}" alt="Рамка ${i+1}"><button class="btn dark" type="button" data-dl="${i}" style="width:100%">Скачать рамку ${i+1}</button>`;
    div.querySelector('[data-dl]').onclick=()=>{const a=document.createElement('a');a.href=src;a.download='miglick-frame-'+(i+1)+'.png';a.click()};
    gallery.appendChild(div);
  });
}
function closeCartModal(){cartModal.classList.remove('open')}
function updateCartBadge(){
  const badge=document.getElementById('cartBadge');
  if(!badge)return;
  badge.textContent=cart.length;
  badge.classList.toggle('hidden',cart.length===0);
}
function renderCartModal(){
  const list=document.getElementById('cartItemsList');
  if(!list)return;
  if(!cart.length){
    list.innerHTML='<div class="cart-empty">Корзина пуста. Соберите рамку и на шаге «Рамка» нажмите «+ Добавить ещё одну рамку».</div>';
  }else{
    list.innerHTML='';
    cart.forEach(item=>{
      const fd=frames.find(f=>f.id===item.frame);
      const {total}=cartItemPrice(item);
      const div=document.createElement('div');
      div.className='cart-item';
      div.innerHTML=`<div class="cart-item-thumb">${miniHTML(item.people[0])}</div><div class="cart-item-info"><b>${item.frame.startsWith('black')?'Черная':'Белая'} рамка, ${fd?fd.name:''}</b><span>${item.people.length} фигурок · ${total.toLocaleString('ru-RU')} ₽</span></div><div class="cart-item-actions"><button class="icon-btn" data-edit title="Редактировать" aria-label="Редактировать">✎</button><button class="icon-btn" data-del title="Удалить" aria-label="Удалить">×</button></div>`;
      div.querySelector('[data-edit]').onclick=()=>editCartItem(item.id);
      div.querySelector('[data-del]').onclick=()=>{if(confirm('Удалить эту рамку из корзины?'))removeCartItem(item.id)};
      list.appendChild(div);
    });
  }
  updateCartBadge();
  if(typeof updateStudioChrome==='function')updateStudioChrome();
}
async function openOrderModal(){
  setOrderZoom(1);
  renderPaymentMethods();
  const allFrames=orderFrames();
  currentOrderFrames=allFrames;
  renderPriceBar();

  orderModal.classList.add('open');
  orderModal.classList.add('is-loading');
  if(orderLoader)orderLoader.classList.remove('hidden');
  if(orderPreviewImg)orderPreviewImg.removeAttribute('src');

  try{
    await new Promise(r=>setTimeout(r,350));

    const images=[];
    if(allFrames.length===1){
      images.push(await exportShareImage(allFrames[0]));
    }else{
      for(const item of allFrames)images.push(await exportFrameImage(item));
    }

    renderOrderGallery(images,allFrames);
    orderTextarea.value=orderFullText(allFrames);

    const isSingle=allFrames.length===1;
    document.getElementById('downloadOrderImg')?.classList.toggle('hidden',false);
    document.getElementById('downloadOrderImg')?.classList.remove('done');
    document.getElementById('copyOrderText')?.classList.remove('done');
    if(shareHint)shareHint.classList.toggle('hidden',!isSingle);
  }catch(err){
    console.error('Order image generation failed:',err);
    const fallback=await exportOrderImage().catch(()=>null);
    if(fallback){
      renderOrderGallery([fallback],allFrames);
      if(orderTextarea)orderTextarea.value=orderFullText(allFrames);
    }else if(orderPreviewBox){
      orderPreviewBox.innerHTML='<div style="padding:28px;text-align:center;color:#86536a;font-weight:900">Не получилось собрать картинку. Обновите страницу и попробуйте еще раз.</div>';
    }
  }finally{
    orderModal.classList.remove('is-loading');
    if(orderLoader)orderLoader.classList.add('hidden');
  }
}

function exists(src){return Promise.resolve(shippedAssetPaths.has(src))}
async function filter(list,folder){
  const out=[];
  for(const id of (Array.isArray(list)?list:[])){
    if(await exists(`./assets/${folder}/${id}.png`))out.push(id)
  }
  return out
}
function normalizeAccessoryItem(raw,category='other'){
  if(typeof raw==='string'){
    const clean=raw.replace(/^\.?\/*/,'').replace(/\.png$/,'');
    const parts=clean.split('/');
    const id=parts[parts.length-1];
    return {id,category,src:parts.length>1?`./${clean}.png`:''};
  }
  if(raw&&typeof raw==='object'){
    const id=String(raw.id||raw.name||raw.file||'').replace(/\.png$/,'');
    return {id,category:raw.category||raw.cat||category,src:raw.src||raw.path||''};
  }
  return null;
}
function flattenAccessories(raw){
  const result=[];
  if(Array.isArray(raw)){
    raw.forEach(x=>{
      const item=normalizeAccessoryItem(x);
      if(item&&item.id)result.push(item);
    });
  }else if(raw&&typeof raw==='object'){
    Object.entries(raw).forEach(([category,list])=>{
      (Array.isArray(list)?list:[]).forEach(x=>{
        const item=normalizeAccessoryItem(x,category);
        if(item&&item.id)result.push(item);
      });
    });
  }
  defaultAccessories.forEach(x=>result.push(x));
  return result;
}
async function resolveAccessories(raw){
  const items=flattenAccessories(raw);
  const ids=[];
  accessorySrcMap={};
  accessoryCategoryMap={};
  for(const item of items){
    const id=String(item.id||'').trim();
    if(!id||ids.includes(id))continue;
    const category=item.category||'other';
    const variants=[];
    if(item.src)variants.push(item.src);
    variants.push(`./assets/accessories/${category}/${id}.png`);
    variants.push(`./assets/accessories/${id}.png`);
    for(const src of variants){
      if(await exists(src)){
        ids.push(id);
        accessorySrcMap[id]=src;
        accessoryCategoryMap[id]=category;
        break;
      }
    }
  }
  return ids;
}
async function resolveHairCatalog(raw){
  const source=[];
  if(Array.isArray(raw)){
    raw.forEach(id=>source.push(id));
  }else if(raw&&typeof raw==='object'){
    if(Array.isArray(raw.all))raw.all.forEach(id=>source.push(id));
    Object.entries(raw).forEach(([key,list])=>{
      if(key==='all')return;
      if(Array.isArray(list))list.forEach(id=>source.push(id));
    });
  }else{
    defaultHair.forEach(id=>source.push(id));
  }
  const ids=[];
  hairSrcMap={};
  for(const rawId of source){
    const id=String(rawId).trim();
    if(!id||ids.includes(id))continue;
    const candidates=getHairFrontCandidates(id);
    let found='';
    for(const src of candidates){
      if(await exists(src)){
        found=src;
        break;
      }
    }
    if(found){
      ids.push(id);
      hairSrcMap[id]=found;
    }
  }
  return ids;
}
async function resolveHairBackCatalog(raw){
  const source=Array.isArray(raw)?raw:[];
  const ids=[];
  for(const rawId of source){
    const id=String(rawId).trim();
    if(!id||ids.includes(id))continue;
    if(await exists(getHairBackSrc(id)))ids.push(id);
  }
  return ids;
}
async function loadCatalog(){
  try{
    const r=await fetch('./assets/catalog.json?v='+Date.now());
    if(!r.ok)throw 0;
    const data=await r.json();
    framePresetBackgrounds=await resolveBackgrounds(data.backgrounds);
    if(!framePresetBackgrounds.some(x=>x.id===framePresetBg)){
      framePresetBg='none';
      draftStorage.setItem('mb_frame_preset_bg',framePresetBg);
    }
    faces=await filter(Array.isArray(data.faces)?data.faces:defaultFaces,'faces');
    hair=await resolveHairCatalog(data.hair);
    hairBack=await resolveHairBackCatalog(data.hairBack);
    if(!faces.length)faces=await filter(defaultFaces,'faces');
    if(!hair.length)hair=await resolveHairCatalog(defaultHair);
    if(!faces.length)faces=[...defaultFaces];
    if(!hair.length){
      hair=[...defaultHair].map(String);
      hair.forEach(id=>hairSrcMap[id]=getHairFrontCandidates(id)[0]);
    }
    const basePrints=['print-swoosh-character','print-drip-smile','print-sketch-heart','swoosh-character','drip-smile'];
    prints=[...new Set([
      ...(await filter(basePrints,'prints')),
      ...(await filter(Array.isArray(data.prints)?data.prints:[],'prints'))
    ])];
    accessories=await resolveAccessories(data.accessories);
    if(!accessories.length)accessories=await resolveAccessories(defaultAccessories);
    people.forEach(x=>{
      if(!faces.includes(x.face))x.face=faces[0]||'A1';
      if(!hair.map(String).includes(String(x.hair)))x.hair=firstHairId();
      if(x.accessory&&!x.rightAccessory)x.rightAccessory=x.accessory;if(x.outfitAccessory&&!accessories.includes(x.outfitAccessory))x.outfitAccessory='';cleanOutfitFromHands(x);if(x.leftAccessory&&!accessories.includes(x.leftAccessory))x.leftAccessory='';if(x.rightAccessory&&!accessories.includes(x.rightAccessory))x.rightAccessory='';x.accessory='';
    });
  }catch(e){
    console.log('catalog error',e);
    framePresetBackgrounds=[{id:'none',name:'Без фона',src:''}];
    framePresetBg='none';
    draftStorage.setItem('mb_frame_preset_bg',framePresetBg);
    faces=await filter(defaultFaces,'faces');
    hair=await resolveHairCatalog(defaultHair);
    hairBack=[];
    if(!faces.length)faces=[...defaultFaces];
    if(!hair.length){
      hair=[...defaultHair].map(String);
      hair.forEach(id=>hairSrcMap[id]=getHairFrontCandidates(id)[0]);
    }
    prints=await filter(['print-swoosh-character','print-drip-smile','print-sketch-heart','swoosh-character','drip-smile'],'prints');
    accessories=await resolveAccessories(defaultAccessories);
    people.forEach(x=>{
      if(!faces.includes(x.face))x.face=faces[0]||'A1';
      if(!hair.map(String).includes(String(x.hair)))x.hair=firstHairId();
      if(x.accessory&&!x.rightAccessory)x.rightAccessory=x.accessory;if(x.outfitAccessory&&!accessories.includes(x.outfitAccessory))x.outfitAccessory='';cleanOutfitFromHands(x);if(x.leftAccessory&&!accessories.includes(x.leftAccessory))x.leftAccessory='';if(x.rightAccessory&&!accessories.includes(x.rightAccessory))x.rightAccessory='';x.accessory='';
    });
  }
}
let onboardCount=Math.max(1,Math.min(10,people.length||1));
function renderOnboardPeopleSetup(){
  const countValue=document.getElementById('onCountValue');
  const namesBox=document.getElementById('onNames');
  if(!countValue || !namesBox)return;
  countValue.textContent=onboardCount;
  namesBox.innerHTML='';
  for(let i=0;i<onboardCount;i++){
    const input=document.createElement('input');
    input.className='onboard-name-input';
    input.type='text';
    input.dataset.nameIndex=i;
    input.placeholder='Имя персонажа '+(i+1);
    input.value=(people[i]&&people[i].name)||('Человек '+(i+1));
    namesBox.appendChild(input);
  }
}
function changeOnboardCount(delta){
  onboardCount=Math.max(1,Math.min(10,onboardCount+delta));
  renderOnboardPeopleSetup();
}
function applyOnboardPeopleSetup(){
  const inputs=[...document.querySelectorAll('.onboard-name-input')];
  const old=people.slice();
  people=[];
  for(let i=0;i<onboardCount;i++){
    const base={...newPerson(i+1),...(old[i]||{})};
    const name=(inputs[i]&&inputs[i].value.trim())||('Человек '+(i+1));
    base.name=name;
    people.push(base);
  }
  active=0;
  step='skin';
  save();
}
function showOnboardingV6(){/* replaced by intro flow */}
function hideSplashV6(){
  const sp=document.getElementById('splashScreen');
  if(sp)setTimeout(()=>sp.classList.add('hide'),1600);
}
let introStep=1;
let introCount=Math.max(1,Math.min(10,people.length||1));
function showIntroStep(n){
  introStep=n;
  document.querySelectorAll('[data-intro-step]').forEach(el=>{
    el.classList.toggle('hidden', Number(el.dataset.introStep)!==n);
  });
  if(n===3)renderIntroNames();
}
function renderIntroNames(){
  const countEl=document.getElementById('introCount');
  const box=document.getElementById('introNames');
  if(!countEl||!box)return;
  countEl.textContent=introCount;
  const old=[...box.querySelectorAll('input')].map(x=>x.value);
  box.innerHTML='';
  for(let i=0;i<introCount;i++){
    const input=document.createElement('input');
    input.className='intro-name-input';
    input.type='text';
    input.placeholder='Имя персонажа '+(i+1);
    input.value=old[i] || (people[i]&&people[i].name) || ('Человек '+(i+1));
    box.appendChild(input);
  }
}
function changeIntroCount(delta){
  introCount=Math.max(1,Math.min(10,introCount+delta));
  renderIntroNames();
}
function applyIntroSetup(){
  const inputs=[...document.querySelectorAll('#introNames input')];
  const old=people.slice();
  people=[];
  for(let i=0;i<introCount;i++){
    const base={...newPerson(i+1),...(old[i]||{})};
    base.name=(inputs[i]&&inputs[i].value.trim()) || ('Человек '+(i+1));
    people.push(base);
  }
  active=0;
  step='skin';
  save();
}
function initIntroFlow(){
  const params=new URLSearchParams(location.search);
  if(params.get('resetIntro')==='1'){
    Object.keys(localStorage).forEach(k=>{
      if(k.indexOf('mb_intro_flow_done')===0)draftStorage.removeItem(k);
    });
  }
  if(params.get('skipIntro')==='1'){
    document.body.classList.remove('intro-active');
    return;
  }
  document.body.classList.add('intro-active');
  showIntroStep(1);
  document.querySelectorAll('[data-intro-next]').forEach(btn=>{
    btn.onclick=()=>showIntroStep(Number(btn.dataset.introNext));
  });
  const minus=document.getElementById('introMinus');
  const plus=document.getElementById('introPlus');
  const start=document.getElementById('introStart');
  if(minus)minus.onclick=()=>changeIntroCount(-1);
  if(plus)plus.onclick=()=>changeIntroCount(1);
  if(start)start.onclick=()=>{
    applyIntroSetup();
    document.body.classList.remove('intro-active');
    sync();
    window.scrollTo({top:0,behavior:'smooth'});
  };
}
addPerson.onclick=addPersonFn;showPeopleBtn.onclick=()=>{step='skin';sync()};frameBtn.onclick=enterFrameMode;orderBtn.onclick=openOrderModal;undoBtn.onclick=restore;randomBtn.onclick=()=>{snap();if(faces.length)p().face=faces[Math.floor(Math.random()*faces.length)];if(hair.length)p().hair=hair[Math.floor(Math.random()*hair.length)];let sk=Object.keys(skinColors),bd=Object.keys(bodyColors);p().skin=+sk[Math.floor(Math.random()*sk.length)];p().torso=+bd[Math.floor(Math.random()*bd.length)];p().legs=+bd[Math.floor(Math.random()*bd.length)];sync()};if(hairFlipLeft)hairFlipLeft.onclick=toggleHairBackView;if(hairFlipRight)hairFlipRight.onclick=toggleHairBackView;orderClose.onclick=()=>orderModal.classList.remove('open');if(orderZoomMinus)orderZoomMinus.onclick=()=>setOrderZoom(orderZoom-.25);if(orderZoomPlus)orderZoomPlus.onclick=()=>setOrderZoom(orderZoom+.25);
if(cartBtn)cartBtn.onclick=()=>{renderCartModal();cartModal.classList.add('open')};
if(cartClose)cartClose.onclick=closeCartModal;
if(cartModal)cartModal.addEventListener('click',e=>{if(e.target===cartModal)closeCartModal()});
if(cartCheckoutBtn)cartCheckoutBtn.onclick=()=>{closeCartModal();openOrderModal()};
copyOrderText.onclick=async()=>{try{await navigator.clipboard.writeText(orderTextarea.value);copyOrderText.classList.add('done');notify('Описание заказа скопировано')}catch{orderTextarea.style.display='block';orderTextarea.select();notify('Выделите и скопируйте описание заказа')}};
downloadOrderImg.onclick=()=>{const a=document.createElement('a');a.href=orderPreviewImg.src;a.download='miglick-story.png';a.click();downloadOrderImg.classList.add('done')};
confirmCancel.onclick=()=>{pendingDeleteIndex=null;confirmModal.classList.remove('open')};
confirmOk.onclick=()=>{if(pendingDeleteIndex!=null){delPerson(pendingDeleteIndex);pendingDeleteIndex=null}confirmModal.classList.remove('open')};
confirmModal.addEventListener('click',e=>{if(e.target===confirmModal){pendingDeleteIndex=null;confirmModal.classList.remove('open')}});
let frameResizeTimer=null;
window.addEventListener('resize',()=>{
  if(step!=='frame')return;
  clearTimeout(frameResizeTimer);
  frameResizeTimer=setTimeout(()=>{
    invalidateFramePreviewBase();
    applyFrameBoxSize(true);
    renderFrame();
  },80);
});
let appBooted=false;
function bootAppOnce(){
  if(appBooted)return;
  appBooted=true;
  if('serviceWorker'in navigator){
    navigator.serviceWorker.register('./sw.js').then(r=>r.update()).catch(()=>{});
  }
  initFrameResizeHandle();
  sync();
  // Inline guidance replaces blocking onboarding.
  window.miglickLoading?.ready(catalogPromise, [...shippedAssetPaths]);
}
const catalogPromise=loadCatalog().catch(err=>console.log('catalog load failed',err));
// Защита: если загрузка каталога (fetch + проверка ассетов) зависнет дольше 4с
// по любой причине (медленная сеть, CORS, редирект и т.п.), интерфейс всё равно
// становится рабочим на дефолтных значениях, а не остаётся «мёртвым» навсегда.
const catalogTimeout=new Promise(resolve=>setTimeout(resolve,4000));
Promise.race([catalogPromise,catalogTimeout]).then(bootAppOnce);
// Если каталог всё же догрузился позже таймаута — обновляем интерфейс свежими данными.
catalogPromise.then(()=>{ if(appBooted) sync(); });

// Show a usable draft immediately while the richer catalog finishes loading.
setTimeout(bootAppOnce,0);
