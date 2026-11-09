import {partPreview,scene,demoConfig} from './art.js';
let editing=null;
const categories={head:'Голова',face:'Лицо',hair:'Волосы',hat:'Головной убор',torso:'Одежда',arms:'Руки',hands:'Кисти',legs:'Ноги',accessory:'Аксессуары'};
const occasions={love:'Для двоих',family:'Семья',birthday:'День рождения',wedding:'Свадьба',anniversary:'Годовщина','new-year':'Новый год',colleagues:'Коллегам',corporate:'Корпоративные','march-8':'8 Марта','february-23':'23 февраля','february-14':'14 февраля'};
const input=(e,name,label,value='',type='text',extra='')=>`<label>${label}<input name="${name}" type="${type}" value="${e(value??'')}" ${extra}></label>`;
const check=(name,label,value)=>`<label class="checkbox"><input type="checkbox" name="${name}" ${value?'checked':''}><span>${label}</span></label>`;
const options=(items,value,e)=>items.map(([id,name])=>`<option value="${e(id)}" ${id===value?'selected':''}>${e(name)}</option>`).join('');
function variant(ctx){const c=ctx.state.catalog,d=ctx.state.draft,n=crypto.randomUUID().slice(0,8);return {id:'variant-'+crypto.randomUUID(),sku:'TEST-GIFT-'+n.toUpperCase(),size:d?.size||c.frames[0].id,color:d?.color||c.colors[0].id,price:249000,stock:0,approved:false,bom:[]};}
function newItem(ctx,kind){
 const c=ctx.state.catalog,n=crypto.randomUUID().slice(0,8),base={id:kind+'-'+n,name:'Новая позиция',demo:true,sku:'TEST-'+n.toUpperCase(),stock:0,price:5000};
 if(kind==='parts')return {...base,category:'torso',color:'#c7634e',width:22,height:42,depth:18,compatibility:[]};
 if(kind==='frames')return {...base,width:165,height:215,usableWidth:141,usableHeight:191,depth:45,insideDepth:30,wall:12,approved:false};
 if(kind==='colors')return {...base,hex:'#ede8df'};
 if(kind==='glazing')return {...base,type:'glass',size:c.frames[0].id,price:15000,color:'Прозрачное'};
 if(kind==='backgrounds')return {id:base.id,name:'Новый фон',demo:true,orientation:'any',color:'#dbe5d9',pattern:'garden',category:'nature',price:0};
 return {id:base.id,name:'Новый подарок',demo:true,published:false,description:'',category:'love',background:c.backgrounds[0].id,count:2,leadTime:'Срок уточняется',photoId:null,discountEligible:true,variants:[variant(ctx)]};
}
function capture(){
 const form=document.getElementById('catalog-editor-form');if(!form||!editing)return;
 const data=Object.fromEntries(new FormData(form)),item=editing.item;
 for(const key of ['id','name','sku','category','color','hex','orientation','pattern','leadTime','background','description','size','type'])if(key in data)item[key]=data[key];
 for(const key of ['stock','width','height','depth','usableWidth','usableHeight','insideDepth','wall','count'])if(key in data)item[key]=Number(data[key]);
 if('price' in data)item.price=Math.round(Number(data.price)*100);item.demo=!!data.demo;
 if(editing.kind==='frames')item.approved=!!data.approved;
 if(editing.kind==='parts')item.compatibility=Array.from(form.elements.namedItem('compatibility').selectedOptions,o=>o.value);
 if(editing.kind==='products'){
  item.published=!!data.published;item.discountEligible=!!data.discountEligible;
  item.variants.forEach((v,n)=>{v.sku=data['v-sku-'+n];v.price=Math.round(Number(data['v-price-'+n])*100);v.stock=Number(data['v-stock-'+n]);v.size=data['v-size-'+n];v.color=data['v-color-'+n];v.approved=!!data['v-approved-'+n];editing.useDraft[n]=!!data['v-use-draft-'+n];});
 }
}
function imageEditor(ctx,item){
 const {esc:e,icon}=ctx,isPart=editing.kind==='parts',isBackground=editing.kind==='backgrounds';
 return `<section class="catalog-image-editor"><h3>${isPart?'Изображение комплектующей':'Изображение'}</h3>${item.photoId?`<div class="catalog-image-view"><img src="/files/${e(item.photoId)}" alt="Загруженное изображение"></div><button type="button" class="text-button danger" data-action="a-photo-remove">Убрать изображение</button>`:'<p class="small muted">Пока используется нарисованный эскиз.</p>'}<label class="upload-box">${icon('upload')}<b>${editing.uploading?'Загружаем изображение…':item.photoId?'Заменить изображение':'Загрузить изображение'}</b><span>PNG или JPEG · до 6 МБ · от 100×100 пикселей</span><input type="file" id="admin-photo" accept="image/png,image/jpeg" ${editing.uploading?'disabled':''}></label>${isPart?`<p class="small muted">Для макета используйте PNG с прозрачным фоном: одна деталь, вид спереди, без лишних полей. Прозрачность сохраняется. JPEG подходит для фото, но фон останется в макете.</p><div class="component-sample">${partPreview(item)}<span>Так деталь выглядит в выборе комплектующих</span></div>`:isBackground?'<p class="small muted">Изображение фона используется в конструкторе и в печатном файле. Кадрирование выполняется по полезному полю рамки.</p>':'<p class="small muted">Фотография товара показывается в каталоге и карточке. Сборочный вид задаётся проектом конструктора в варианте товара.</p>'}</section>`;
}
function renderEditor(ctx){
 const {esc:e,state:s}=ctx,{kind,item:i}=editing,c=s.catalog;
 const field=(...args)=>input(e,...args),select=(name,label,items,value)=>`<label>${label}<select name="${name}">${options(items,value,e)}</select></label>`;
 let fields='';
 if(!['products','backgrounds'].includes(kind))fields+=field('sku','Артикул',i.sku,'text','required maxlength="100"')+'<div class="form-row">'+field('price','Цена, ₽',i.price/100,'number','step="0.01" min="0" required')+field('stock','Доступно, шт.',i.stock,'number','min="0" max="1000000" step="1" required')+'</div>';
 if(kind==='parts')fields+=`<div class="form-row">${select('category','Категория',Object.entries(categories),i.category)}${field('color','Цвет эскиза',i.color,'color')}</div><div class="form-row">${['width','height','depth'].map((k,n)=>field(k,['Габаритная ширина, мм','Габаритная высота, мм','Глубина, мм'][n],i[k],'number','min="0.1" max="999" step="0.1" required')).join('')}</div><p class="small muted">Габариты используются для проверки размещения персонажа.</p><label>Обязательные совместимые детали<select name="compatibility" multiple size="4">${c.parts.filter(p=>p.id!==i.id).map(p=>`<option value="${e(p.id)}" ${(i.compatibility||[]).includes(p.id)?'selected':''}>${e(p.sku+' · '+p.name)}</option>`).join('')}</select></label>${imageEditor(ctx,i)}`;
 if(kind==='frames')fields+=`<div class="form-row">${['width','height','usableWidth','usableHeight','depth','insideDepth','wall'].map((k,n)=>field(k,['Внешняя ширина, мм','Внешняя высота, мм','Полезная ширина, мм','Полезная высота, мм','Внешняя глубина, мм','Внутренняя глубина, мм','Стенка, мм'][n],i[k],'number','min="0.1" max="999" step="0.1" required')).join('')}</div>${check('approved','Геометрия подтверждена производством',i.approved)}`;
 if(kind==='colors')fields+=field('hex','Цвет рамки',i.hex,'color');
 if(kind==='glazing')fields+=select('size','Размер рамки',c.frames.map(f=>[f.id,f.id]),i.size)+select('type','Тип',[['plastic','Пластиковое стекло (стандарт)'],['glass','Стекло (доплата)']],i.type);
 if(kind==='backgrounds')fields+=`<div class="form-row">${field('color','Основной цвет',i.color,'color')}${field('price','Доплата, ₽',i.price/100,'number','min="0" step="0.01" required')}</div>${select('pattern','Рисунок',[['garden','Сад'],['sun','Солнце'],['stars','Звёзды'],['winter','Зима']],i.pattern)}${select('orientation','Ориентация',[['any','Любая'],['portrait','Вертикальная'],['landscape','Горизонтальная']],i.orientation)}${imageEditor(ctx,i)}`;
 if(kind==='products')fields+=`<label>Описание<textarea name="description" rows="3" maxlength="4000" required>${e(i.description)}</textarea></label><div class="form-row">${select('category','Повод',Object.entries(occasions),i.category)}${field('count','Персонажей',i.count,'number','min="1" max="10" step="1" required')}</div>${select('background','Фон',c.backgrounds.map(b=>[b.id,b.name]),i.background)}${field('leadTime','Срок изготовления',i.leadTime,'text','maxlength="200"')}${check('discountEligible','Участвует в скидках',i.discountEligible!==false)}${check('published','Публиковать в открытом каталоге',i.published)}${imageEditor(ctx,i)}<h3>Варианты товара</h3><p class="small muted">Цена и доступный остаток задаются отдельно для каждого размера и цвета. Новые варианты создаются с нулевым остатком.</p>${i.variants.map((v,n)=>`<section class="variant-editor"><div class="admin-table-toolbar"><b>Вариант ${n+1}</b>${i.variants.length>1?`<button type="button" class="text-button danger" data-action="a-variant-remove" data-id="${n}">Убрать вариант</button>`:''}</div><div class="form-row">${field('v-sku-'+n,'Артикул варианта',v.sku,'text','required maxlength="100"')}${field('v-price-'+n,'Цена, ₽',v.price/100,'number','min="0" step="0.01" required')}</div><div class="form-row">${select('v-size-'+n,'Размер',c.frames.map(f=>[f.id,f.id]),v.size)}${select('v-color-'+n,'Цвет',c.colors.map(color=>[color.id,color.name]),v.color)}${field('v-stock-'+n,'Доступно, шт.',v.stock,'number','min="0" max="1000000" step="1" required')}</div>${check('v-use-draft-'+n,'Взять текущий проект конструктора и его состав',editing.useDraft[n])}<p class="small muted">Проект должен совпадать по размеру и цвету. В спецификации: ${v.bom.length} позиций.</p>${v.config?`<div class="variant-scene">${scene(v.config,c)}</div>`:''}${check('v-approved-'+n,'Спецификация проверена и утверждена',v.approved)}</section>`).join('')}<button type="button" class="text-button" data-action="a-variant-add">${ctx.icon('plus')} Добавить вариант</button>`;
 ctx.modal(`<h2>${editing.create?'Добавить позицию':'Изменить позицию'}</h2><form id="catalog-editor-form">${field('id','Идентификатор',i.id,'text',`required pattern="[A-Za-z0-9_-]+" ${editing.create?'':'readonly'}`)}${field('name','Название',i.name,'text','required maxlength="120"')}${check('demo','Тестовая позиция (не для реальных продаж)',i.demo)}<p class="small muted">Тестовую позицию можно сохранить сразу. Для реального товара требуются фото, утверждённый состав и проверенные комплектующие.</p>${fields}<p class="form-error" role="alert"></p><button type="submit" class="btn btn-dark full" ${editing.uploading?'disabled':''}>${editing.uploading?'Дождитесь загрузки изображения':'Сохранить позицию'}</button></form>`,'catalog-modal');
}
export async function catalogAction(ctx,action,key,button){
 if(action==='a-new'){editing={kind:key,item:newItem(ctx,key),create:true,expected:null,useDraft:[],uploading:false};renderEditor(ctx);return true;}
 if(action==='a-edit'){const item=ctx.state.adminData.catalog[button.dataset.kind].find(i=>i.id===key);if(!item)throw Error('Позиция не найдена');editing={kind:button.dataset.kind,item:structuredClone(item),expected:structuredClone(item),create:false,useDraft:[],uploading:false};renderEditor(ctx);return true;}
 if(!['a-variant-add','a-variant-remove','a-photo-remove'].includes(action))return false;if(!editing||editing.uploading)return true;capture();
 if(action==='a-variant-add'){editing.item.variants.push(variant(ctx));editing.useDraft.push(false);}
 if(action==='a-variant-remove'){const v=editing.item.variants[Number(key)];if(!editing.create&&editing.expected.variants.some(old=>old.id===v.id))throw Error('Существующий вариант связан с историей заказов. Для снятия с продажи установите остаток 0.');editing.item.variants.splice(Number(key),1);editing.useDraft.splice(Number(key),1);}
 if(action==='a-photo-remove')editing.item.photoId=null;
 renderEditor(ctx);return true;
}
export async function catalogSubmit(ctx,formId){
 if(formId!=='catalog-editor-form')return false;if(editing.uploading)throw Error('Дождитесь загрузки изображения');capture();const {item,kind}=editing;
 if(kind==='products')for(let n=0;n<item.variants.length;n++)if(editing.useDraft[n]){
  const d=ctx.state.draft,v=item.variants[n];if(!d||d.size!==v.size||d.color!==v.color)throw Error('Откройте нужный проект в конструкторе. Его размер и цвет должны совпасть с вариантом.');
  const quote=await ctx.api('/api/quote',{items:[{type:'custom',config:d,quantity:1}]});v.config=structuredClone(quote.lines[0].config);v.bom=quote.lines[0].bom.map(p=>({sku:p.sku,quantity:p.quantity}));
 }
 await ctx.api('/api/admin/catalog/'+kind,{item,create:editing.create,expected:editing.expected});ctx.closeModal();await ctx.reloadAdmin();ctx.toast('Позиция сохранена');return true;
}
export async function catalogChange(ctx,target){
 if(target.id!=='admin-photo')return false;const file=target.files[0];if(!file||!editing)return true;if(file.size>6000000)throw Error('Файл должен быть до 6 МБ');if(!['image/png','image/jpeg'].includes(file.type))throw Error('Выберите PNG или JPEG');
 capture();const activeEdit=editing;activeEdit.uploading=true;const scroll=document.querySelector('.modal')?.scrollTop||0;renderEditor(ctx);document.querySelector('.modal').scrollTop=scroll;
 try{const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});const result=await ctx.api('/api/uploads',{data,purpose:'catalog'});activeEdit.item.photoId=result.id;if(editing===activeEdit&&document.getElementById('catalog-editor-form'))ctx.toast('Изображение загружено. Сохраните позицию.');}
 finally{activeEdit.uploading=false;if(editing===activeEdit&&document.getElementById('catalog-editor-form')){renderEditor(ctx);document.querySelector('.modal').scrollTop=scroll;}}
 return true;
}
