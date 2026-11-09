import {draftsAllowed} from './privacy.js';
import {pointsToMm,mmToPoints,textTransform} from './text.js';
import {partPreview,scene,field,demoConfig} from './art.js';
import {characterBounds as bounds,positionsValid,fitCharacters} from './layout.js';
const names={head:'Голова',face:'Лицо',hair:'Волосы',hat:'Головной убор',torso:'Одежда',arms:'Руки',hands:'Кисти',legs:'Ноги',accessory:'Аксессуары'};
let history=[];
let editedInputs=new WeakSet();
export function resetBuilderHistory(){history=[];editedInputs=new WeakSet();}
const remember=ctx=>{ctx.state.draftChanged=true;history.push(JSON.stringify(ctx.state.draft));if(history.length>30)history.shift();};
function rememberInput(ctx,target){if(editedInputs.has(target))editedInputs.delete(target);else remember(ctx);}
function placeNewCharacter(ctx,person){
 const {draft,catalog}=ctx.state,{w,h}=field(catalog,draft),b=bounds(person,catalog);
 for(let y=Math.floor((h-b.h)/2)*2;y>=0;y-=2)for(let x=0;x+b.w<=w;x+=2){person.x=x;person.y=y;if(validPositions({...draft,characters:[...draft.characters,person]},catalog))return;}
 throw Error('Для нового персонажа нет свободного места. Переместите существующих или увеличьте рамку.');
}
function drawUI(ctx,options={}){if(ctx.renderBuilder)ctx.renderBuilder(options);else ctx.render();}
function previewOnly(ctx){const s=ctx.state,preview=document.getElementById('stage-preview');if(preview){preview.innerHTML=scene(s.draft,s.catalog,{interactive:true,selected:s.selected});bindBuilder(ctx);}}
function validPositions(d,catalog){return positionsValid(d.characters,catalog,field(catalog,d));}
async function update(ctx){ctx.state.quote=null;ctx.persist();drawUI(ctx);await ctx.refreshQuote();}
function moveControls(kind,id,label,e){
 return `<div class="move-controls" role="group" aria-label="${e(label)}"><span>Переместить на 2 мм</span><div>${[['left','←','Влево'],['up','↑','Вверх'],['down','↓','Вниз'],['right','→','Вправо']].map(([direction,symbol,name])=>`<button type="button" data-action="b-move-${kind}" data-id="${e(id)}" data-direction="${direction}" aria-label="${name} на 2 мм"><span aria-hidden="true">${symbol}</span></button>`).join('')}</div></div>`;
}
export function partMatches(part,query='',group=''){
 const words=query.trim().toLocaleLowerCase('ru').replaceAll('ё','е').split(/\s+/).filter(Boolean),haystack=[part.name,part.id,part.group||'Эскизы MIGLIK'].join(' ').toLocaleLowerCase('ru').replaceAll('ё','е');
 return (!group||(part.group||'Эскизы MIGLIK')===group)&&words.every(word=>haystack.includes(word));
}
function partPicker(ctx,person){
 const {state:s,esc:e,money}=ctx,parts=s.catalog.parts.filter(p=>p.category===s.partCategory),groups=[...new Set(parts.map(p=>p.group||'Эскизы MIGLIK'))],query=s.partSearch||'',group=s.partGroup||'',count=parts.filter(p=>partMatches(p,query,group)).length;
 return `<div class="part-filters"><label>Поиск деталей<input id="part-search" type="search" maxlength="100" value="${e(query)}" placeholder="Название, цвет или номер" autocomplete="off" aria-controls="part-results"></label>${groups.length>1?`<label>Группа<select id="part-group" aria-controls="part-results"><option value="">Все группы</option>${groups.map(g=>`<option value="${e(g)}" ${group===g?'selected':''}>${e(g)}</option>`).join('')}</select></label>`:''}</div><p class="part-result-count small muted" id="part-result-count" role="status">Показано ${count} из ${parts.length}</p><div class="part-grid" id="part-results">${parts.map(p=>`<button type="button" class="part-tile ${person.parts[s.partCategory]===p.id?'selected':''}" data-part-id="${e(p.id)}" aria-pressed="${person.parts[s.partCategory]===p.id}" data-action="b-part" data-id="${e(p.id)}" aria-label="${e(p.name)} — ${e(money(p.price))}" ${partMatches(p,query,group)?'':'hidden'} ${p.stock<=0?'disabled':''}>${partPreview(p)}<span>${e(p.name)}</span><small>${money(p.price)}</small></button>`).join('')}</div><p id="part-empty" class="small muted" ${count?'hidden':''}>Ничего не найдено. Измените запрос или выберите другую группу.</p>`;
}
function filterPartPicker(ctx,target){
 const s=ctx.state;if(target.id==='part-search')s.partSearch=target.value;if(target.id==='part-group')s.partGroup=target.value;
 const parts=s.catalog.parts.filter(p=>p.category===s.partCategory);let count=0;
 document.querySelectorAll('[data-part-id]').forEach(tile=>{const part=parts.find(p=>p.id===tile.dataset.partId),shown=!!part&&partMatches(part,s.partSearch||'',s.partGroup||'');tile.hidden=!shown;if(shown)count++;});
 document.getElementById('part-result-count').textContent=`Показано ${count} из ${parts.length}`;document.getElementById('part-empty').hidden=count>0;
}
export function builderPage(ctx){
 const {state:s,esc:e,icon,money}=ctx;
 if(!s.draft)s.draft=demoConfig(s.catalog,{size:'S',title:'Наша история'});
 const d=s.draft,{w,h,ow,oh,frame}=field(s.catalog,d);if(!s.selected||!d.characters.some(c=>c.id===s.selected))s.selected=d.characters[0]?.id||'';
 const person=d.characters.find(c=>c.id===s.selected),step=s.step;
 const nav=[['frame','frame','Рамка'],['people','user','Персонажи'],['background','spark','Фон'],['text','heart','Надпись']];
 let controls='';
 if(step==='frame')controls=`<div class="control-heading"><span class="step-number">01</span><h2>Размер и цвет рамки</h2><p>Выберите место для своей истории.</p></div><label class="label">Размер</label><div class="size-options builder-sizes">${s.catalog.frames.map(f=>`<button class="size-option ${d.size===f.id?'selected':''}" aria-pressed="${d.size===f.id}" data-action="b-size" data-id="${f.id}"><span class="size-drawing" style="aspect-ratio:${f.width}/${f.height}"></span><b>${e(f.id)}</b><small>${f.width}×${f.height} мм</small></button>`).join('')}</div><label class="label">Цвет: ${e(s.catalog.colors.find(c=>c.id===d.color)?.name)}</label><div class="color-options">${s.catalog.colors.map(c=>`<button class="color-option ${c.id===d.color?'selected':''}" aria-pressed="${c.id===d.color}" data-action="b-color" data-id="${c.id}"><i style="background:${e(c.hex)}"></i>${e(c.name)}</button>`).join('')}</div>${frame.width!==frame.height?`<label class="label">Ориентация</label><div class="segmented"><button data-action="b-orientation" data-id="portrait" aria-pressed="${d.orientation==='portrait'}" class="${d.orientation==='portrait'?'selected':''}">Вертикальная</button><button data-action="b-orientation" data-id="landscape" aria-pressed="${d.orientation==='landscape'}" class="${d.orientation==='landscape'?'selected':''}">Горизонтальная</button></div>`:''}<label class="checkbox glazing-option"><input id="frame-glass" type="checkbox" ${(d.glazing||'plastic')==='glass'?'checked':''}><span><b>Стекло вместо пластикового</b><small>+${money(s.catalog.glazing?.find(g=>g.size===d.size&&g.type==='glass')?.price??15000)} за рамку</small></span></label><p class="glazing-base">В стандартную комплектацию входит пластиковое стекло.</p><div class="material-note">${icon('frame')}<span>Глубокая пластиковая рамка<br><small>Глубина 45 мм · внутреннее поле ${w}×${h} мм</small></span></div>`;
 if(step==='people')controls=`<div class="control-heading"><span class="step-number">02</span><h2>Ваши персонажи</h2><p>Маленькие детали делают нас собой.</p></div><div class="person-tabs">${d.characters.map((c,i)=>`<button class="person-tab ${c.id===s.selected?'selected':''}" aria-label="Персонаж ${i+1}: ${e(c.name)}" aria-pressed="${c.id===s.selected}" data-action="b-select" data-id="${e(c.id)}">${i+1}</button>`).join('')}<button class="person-tab add" data-action="b-add-person" aria-label="Добавить персонажа" ${d.characters.length>=10?'disabled':''}>${icon('plus')}</button></div>${person?`<label>Имя персонажа<input id="person-name" value="${e(person.name)}" maxlength="80"></label><div class="part-categories">${Object.entries(names).map(([key,name])=>`<button class="${key===s.partCategory?'selected':''}" aria-pressed="${key===s.partCategory}" data-action="b-category" data-id="${key}">${name}</button>`).join('')}</div>${partPicker(ctx,person)}${moveControls('person',person.id,'Положение персонажа: '+person.name,e)}<div class="person-tools"><button class="text-button" data-action="b-person-left">${icon('rotate')} В начало</button><button class="text-button danger" data-action="b-remove-person">${icon('trash')} Удалить</button></div>`:'<p>Добавьте первого персонажа кнопкой «+».</p>'}<p class="small muted">Перемещайте персонажей кнопками со стрелками или перетаскиванием в рамке. Привязка к сетке — 2 мм. Максимум 10 персонажей, вместимость зависит от размера.</p>`;
 if(step==='background')controls=`<div class="control-heading"><span class="step-number">03</span><h2>Задайте настроение</h2><p>История начинается с обстановки.</p></div><div class="background-grid">${s.catalog.backgrounds.filter(b=>b.orientation==='any'||b.orientation===d.orientation).map(bg=>{const conf={...d,background:bg.id,characters:[],texts:[]};return `<button class="background-tile ${d.background===bg.id?'selected':''}" aria-pressed="${d.background===bg.id}" data-action="b-background" data-id="${bg.id}">${scene(conf,s.catalog,{flat:true})}<span>${e(bg.name)}</span><small>${bg.price?money(bg.price):'Включён'}</small></button>`;}).join('')}</div><label class="checkbox upload-rights"><input type="checkbox" id="upload-rights"><span>${e(s.session.uploadRightsText)} <a href="/consent/order" data-native target="_blank" rel="noopener">Подробнее</a>.</span></label><button type="button" class="upload-box full" data-action="b-upload">${icon('upload')}<b>Добавить своё изображение</b><span>PNG или JPEG · до 6 МБ</span></button><input type="file" id="background-upload" accept="image/png,image/jpeg" hidden>${d.background.startsWith('upload:')?`<div class="soft-notice small">Ваше изображение сохранено в закрытом хранилище.</div><label>Масштаб<input id="background-scale" type="range" min="1" max="4" step=".05" value="${d.backgroundScale}"></label><label>Кадрирование по горизонтали<input id="background-x" type="range" min="-100" max="100" value="${d.backgroundX}"></label><label>Кадрирование по вертикали<input id="background-y" type="range" min="-100" max="100" value="${d.backgroundY}"></label>`:''}<div class="feature-later">${icon('spark')}<div><b>Фон по вашему описанию</b><p>ИИ-генерация появится на отдельном этапе.</p></div></div>`;
 if(step==='text')controls=`<div class="control-heading"><span class="step-number">04</span><h2>Надписи</h2><p>Enter — новая строка. Для перемещения используйте кнопки со стрелками или перетаскивайте надпись в рамке.</p></div>${d.texts.map((t,i)=>`<div class="text-editor"><label>Надпись ${i+1}<textarea data-text-field="value" data-id="${e(t.id)}" rows="3" maxlength="500">${e(t.value)}</textarea></label><div class="form-row"><label>Шрифт<select data-text-field="font" data-id="${e(t.id)}">${[['sans','Современный'],['serif','Классический'],['hand','Рукописный']].map(([v,n])=>`<option value="${v}" ${t.font===v?'selected':''}>${n}</option>`).join('')}</select></label><label>Цвет<input type="color" data-text-field="color" data-id="${e(t.id)}" value="${e(t.color)}"></label></div><div class="font-size-controls"><label>Размер шрифта, пт<input type="number" data-text-field="sizePt" data-id="${e(t.id)}" min="1" max="48" step=".1" value="${mmToPoints(t.size)}"></label><input type="range" data-text-field="sizePt" data-id="${e(t.id)}" min="1" max="48" step=".1" value="${mmToPoints(t.size)}" aria-label="Размер надписи ${i+1}"></div><label class="checkbox"><input type="checkbox" data-text-field="italic" data-id="${e(t.id)}" ${t.italic?'checked':''}><span>Курсив</span></label><label>Наклон текста: <span data-rotation-label="${e(t.id)}">${t.rotation||0}°</span><input type="range" data-text-field="rotation" data-id="${e(t.id)}" min="-90" max="90" step="1" value="${t.rotation||0}"></label>${moveControls('text',t.id,'Положение надписи '+(i+1),e)}<button class="text-button danger" data-action="b-remove-text" data-id="${e(t.id)}">${icon('trash')} Удалить надпись</button></div>`).join('')}<button class="btn btn-outline full" data-action="b-add-text" ${d.texts.length>=8?'disabled':''}>${icon('plus')} Добавить надпись</button><p class="small muted">До 48 пт. Кириллица, курсив и до 8 строк в одной надписи.</p>`;

 return `<main class="builder"><div class="builder-top"><div><a href="/">MIGLIK</a><span>/</span><b>${e(s.cartEditId?'Редактирование композиции из корзины':s.projectName||'Моя маленькая история')}</b><span class="autosaved">${icon('check')} ${draftsAllowed()?'Черновик на устройстве':'В открытой странице'}</span></div><div class="button-row"><button type="button" class="text-button" data-action="cookie-settings">Cookie</button>${s.cartEditId?'<button class="text-button" data-action="b-cancel-edit">Отменить правки</button>':''}<button class="icon-btn" data-action="b-undo" aria-label="Отменить изменение" ${history.length?'':'disabled'}>${icon('rotate')}</button><button class="btn btn-outline btn-small" data-action="b-save">${icon('save')} Сохранить проект</button></div></div><div class="builder-workspace"><nav class="builder-nav" aria-label="Шаги создания подарка">${nav.map(([k,ic,n],i)=>`<button class="${step===k?'active':''}" data-action="b-step" data-id="${k}" ${step===k?'aria-current="step"':''}>${icon(ic)}<span>${n}</span><small>0${i+1}</small></button>`).join('')}<div class="builder-nav-bottom"><button data-action="b-export">${icon('save')}<span>Скачать проект</span></button><button data-action="b-import">${icon('upload')}<span>Открыть проект</span></button><input type="file" id="config-import" accept="application/json,.json" hidden></div></nav><section class="builder-stage"><div class="stage-header"><span>Предварительный вид</span><span class="live-dot">Эскиз</span></div><div class="stage-preview" id="stage-preview">${scene(d,s.catalog,{interactive:true,selected:person?.id})}</div><div class="stage-caption"><span>${ow}×${oh} мм · ${s.catalog.colors.find(c=>c.id===d.color)?.name} · ${d.characters.length} персонажа</span><small>Тестовый макет. Детали и полезное поле проверяются перед производством.</small></div><div class="stage-tip">${icon('user')}<span>Нажмите на персонажа, чтобы изменить детали.<br>Перетаскивайте мышью или пальцем.</span></div></section><aside class="builder-controls" aria-label="Настройки композиции"><button class="mobile-preview-link" data-action="b-preview">${icon('frame')} Посмотреть макет</button>${controls}<div class="builder-step-actions">${nav.findIndex(([k])=>k===step)>0?`<button class="btn btn-outline" data-action="b-step" data-id="${nav[nav.findIndex(([k])=>k===step)-1][0]}">Назад</button>`:''}${nav.findIndex(([k])=>k===step)<nav.length-1?`<button class="btn btn-primary" data-action="b-step" data-id="${nav[nav.findIndex(([k])=>k===step)+1][0]}">Далее: ${nav[nav.findIndex(([k])=>k===step)+1][2].toLowerCase()}</button>`:''}</div></aside></div><div class="builder-bottom"><div class="builder-quantity"><label>Сколько одинаковых историй?</label>${ctx.quantityControl(s.quantity,'b-quantity')}<small>${ctx.discountHint()}</small></div><div class="builder-total" id="builder-price">${ctx.priceSummary(s.quote,true)}</div><button class="btn btn-coral" data-action="b-add" ${s.quote?'':'disabled'}>${s.cartEditId?'Сохранить изменения':'Добавить в корзину'} ${icon('bag')}</button></div></main>`;
}
export async function builderAction(ctx,action,key,button){
 if(!action.startsWith('b-'))return false;const {state:s}=ctx,d=s.draft;
 if(action==='b-import'||action==='b-upload'){document.getElementById(action==='b-import'?'config-import':'background-upload')?.click();return true;}
 if(action==='b-preview'){document.querySelector('.builder-stage').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches||button?.matches(':focus-visible')?'instant':'smooth',block:'start'});return true;}
 if(action==='b-step'){s.step=key;drawUI(ctx,{resetControls:true});const heading=document.querySelector('.control-heading h2');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}if(window.matchMedia('(max-width:740px)').matches)document.querySelector('.builder-controls').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches||button?.matches(':focus-visible')?'instant':'smooth',block:'start'});return true;}
 if(action==='b-select'){s.selected=key;s.step='people';drawUI(ctx);return true;}
 if(action==='b-category'){s.partCategory=key;s.partSearch='';s.partGroup='';drawUI(ctx);return true;}
 if(action==='b-save'){
  const save=async()=>{if(!s.quote)throw Error(s.quoteError||'Проверьте композицию');await ctx.api('/api/projects',{id:s.projectId,name:s.projectName||'Моя маленькая история',config:d}).then(r=>s.projectId=r.id);ctx.toast('Проект сохранён в вашем кабинете');};
  if(!s.session.user)ctx.auth(save);else await save();return true;
 }
 if(action==='b-export'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({name:s.projectName||'Моя история',config:d},null,2)],{type:'application/json'}));a.download='MIGLIK-project.json';a.click();URL.revokeObjectURL(a.href);return true;}
 if(action==='b-cancel-edit'){await ctx.cancelCartEdit();return true;}
 if(action==='b-add'){const editing=!!s.cartEditId;if(!s.quote)throw Error(s.quoteError||'Дождитесь расчёта');await ctx.addToCart({type:'custom',name:s.projectName||'Моя маленькая история',config:structuredClone(d),quantity:s.quantity,key:s.quote.lines[0].key});if(editing)await ctx.nav('/cart');else await ctx.refreshQuote();return true;}
 if(action==='b-quantity'){s.quantity=Math.max(1,Math.min(s.catalog.settings.maxQuantity,s.quantity+Number(button.dataset.delta)));drawUI(ctx);await ctx.refreshQuote();return true;}
 if(action==='b-undo'){if(history.length)s.draft=JSON.parse(history.pop());await update(ctx);return true;}
 remember(ctx);const old=JSON.stringify(d);
 try{
  if(action==='b-size'||action==='b-orientation'){
   const before=field(s.catalog,d);if(action==='b-size')d.size=key;else d.orientation=key;
   const after=field(s.catalog,d),fitted=fitCharacters(d.characters,s.catalog,after);
   if(!fitted)throw Error('В этой рамке недостаточно места для всех персонажей с выбранными деталями. Выберите размер побольше или уменьшите число персонажей.');
   d.characters=fitted;
   d.texts.forEach(t=>{t.x=Math.round(t.x*after.w/before.w*10)/10;t.y=Math.round(t.y*after.h/before.h*10)/10;});
   const bg=s.catalog.backgrounds.find(b=>b.id===d.background);
   if(bg&&bg.orientation!=='any'&&bg.orientation!==d.orientation)d.background=s.catalog.backgrounds.find(b=>b.orientation==='any'||b.orientation===d.orientation)?.id||d.background;
  }
  if(action==='b-move-person'||action==='b-move-text'){
   const isPerson=action==='b-move-person',item=(isPerson?d.characters:d.texts).find(item=>item.id===key),delta={left:[-2,0],right:[2,0],up:[0,-2],down:[0,2]}[button?.dataset.direction];
   if(!item||!delta)throw Error('Выберите элемент и направление перемещения.');
   const {w,h}=field(s.catalog,d),b=isPerson?bounds(item,s.catalog):{w:0,h:item.size},x=item.x+delta[0],y=item.y+delta[1];
   if(x<0||y<0||x>w-b.w||y>h-b.h)throw Error('Достигнут край полезного поля. Выберите другое направление.');
   item.x=x;item.y=y;
   if(isPerson&&!validPositions(d,s.catalog))throw Error('Здесь персонажи пересекаются. Выберите другое направление.');
  }
  if(action==='b-color')d.color=key;
  if(action==='b-background'){d.background=key;d.backgroundScale=1;d.backgroundX=0;d.backgroundY=0;}
  if(action==='b-add-person'){if(d.characters.length>=10)throw Error('Максимум 10 персонажей');const c=structuredClone(d.characters[0]||demoConfig(s.catalog).characters[0]);c.id='person-'+crypto.randomUUID();c.name='Персонаж '+(d.characters.length+1);placeNewCharacter(ctx,c);d.characters.push(c);s.selected=c.id;s.step='people';}
  if(action==='b-remove-person'){d.characters=d.characters.filter(c=>c.id!==s.selected);s.selected=d.characters[0]?.id||'';}
  if(action==='b-person-left'){const c=d.characters.find(c=>c.id===s.selected);d.characters=[c,...d.characters.filter(p=>p!==c)];}
  if(action==='b-part'){const c=d.characters.find(c=>c.id===s.selected);c.parts[s.partCategory]=key;if(!validPositions(d,s.catalog))throw Error('Деталь не помещается. Освободите место перемещением персонажа.');}
  if(action==='b-add-text'){const {w,h}=field(s.catalog,d);d.texts.push({id:'text-'+crypto.randomUUID(),value:'Ваши слова',x:w/2,y:Math.min(h-12,14+d.texts.length*10),size:pointsToMm(14),color:'#34483e',font:'sans',italic:false,rotation:0,align:'middle'});}
  if(action==='b-remove-text')d.texts=d.texts.filter(t=>t.id!==key);
 }catch(e){s.draft=JSON.parse(old);history.pop();throw e;}
 await update(ctx);return true;
}
function applyTextField(ctx,target){
 const t=ctx.state.draft.texts.find(t=>t.id===target.dataset.id);if(!t)return;
 const key=target.dataset.textField;
 if(key==='italic')t.italic=target.checked;
 else if(key==='sizePt'){if(target.value===''||!Number.isFinite(Number(target.value)))return;t.size=pointsToMm(Number(target.value));document.querySelectorAll(`[data-text-field="sizePt"][data-id="${CSS.escape(t.id)}"]`).forEach(el=>{if(el!==target)el.value=target.value;});}
 else if(key==='rotation'){t.rotation=Number(target.value);const label=document.querySelector(`[data-rotation-label="${CSS.escape(t.id)}"]`);if(label)label.textContent=t.rotation+'°';}
 else t[key]=target.value;
}
export async function builderChange(ctx,target){
 const {state:s}=ctx;if(!s.draft)return false;const d=s.draft;
 if(['part-search','part-group'].includes(target.id)){filterPartPicker(ctx,target);return true;}
 if(target.dataset.quantityAction==='b-quantity'){s.quantity=Math.max(1,Math.min(s.catalog.settings.maxQuantity,parseInt(target.value)||1));drawUI(ctx);await ctx.refreshQuote();return true;}
 if(target.id==='frame-glass'){remember(ctx);d.glazing=target.checked?'glass':'plastic';await update(ctx);return true;}
 if(target.id==='person-name'||target.dataset.textField||['background-scale','background-x','background-y'].includes(target.id)){
  rememberInput(ctx,target);
  if(target.id==='person-name')d.characters.find(c=>c.id===s.selected).name=target.value;
  else if(target.dataset.textField)applyTextField(ctx,target);
  else d[{'background-scale':'backgroundScale','background-x':'backgroundX','background-y':'backgroundY'}[target.id]]=Number(target.value);
  ctx.persist();previewOnly(ctx);await ctx.refreshQuote();return true;
 }
 if(target.id==='background-upload'){
  const file=target.files[0];if(!file)return true;if(!document.querySelector('#upload-rights')?.checked){target.value='';throw Error('Подтвердите право передать изображение перед загрузкой');}if(file.size>6000000)throw Error('Изображение должно быть до 6 МБ');ctx.toast('Загружаем в закрытое хранилище…');const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});const result=await ctx.api('/api/uploads',{data,rights:true});remember(ctx);d.background='upload:'+result.id;d.backgroundScale=1;d.backgroundX=0;d.backgroundY=0;await update(ctx);ctx.toast('Фон добавлен');return true;
 }
 if(target.id==='config-import'){const file=target.files[0];if(!file)return true;if(file.size>1000000)throw Error('Файл слишком большой');const data=JSON.parse(await file.text()),config=data.config||data.lines?.[0]?.config||data;if(!config.size||!Array.isArray(config.characters))throw Error('Нужен файл проекта MIGLIK');const q=await ctx.api('/api/quote',{items:[{type:'custom',config,quantity:1}]});remember(ctx);s.draft=q.lines[0].config;s.projectName=data.name||'Импортированная история';s.projectId=null;await update(ctx);return true;}
 return false;
}
export function builderInput(ctx,target){
 const s=ctx.state,d=s.draft;if(!d)return false;
 if(target.id==='part-search'){filterPartPicker(ctx,target);return true;}
 const isText=!!target.dataset.textField,isBackground=['background-scale','background-x','background-y'].includes(target.id),isName=target.id==='person-name';
 if(!isText&&!isBackground&&!isName)return false;
 if(!editedInputs.has(target)){remember(ctx);editedInputs.add(target);}
 if(isText)applyTextField(ctx,target);
 if(isBackground)d[{'background-scale':'backgroundScale','background-x':'backgroundX','background-y':'backgroundY'}[target.id]]=Number(target.value);
 if(isName){const c=d.characters.find(c=>c.id===s.selected);if(c)c.name=target.value;}
 ctx.persist();const undo=document.querySelector('[data-action="b-undo"]');if(undo)undo.disabled=history.length===0;previewOnly(ctx);s.quote=null;const button=document.querySelector('[data-action="b-add"]');if(button)button.disabled=true;ctx.refreshQuote();return true;
}
export function bindBuilder(ctx){
 const svg=document.querySelector('#stage-preview svg');if(!svg||svg.dataset.builderBound)return;svg.dataset.builderBound='true';
 // SVG groups have no CSS layout box for touch-action. Give each draggable
 // object an HTML gesture surface; the rest of the SVG keeps native scrolling.
 svg.querySelectorAll('[data-person],[data-text]').forEach(target=>{
  const box=target.getBBox(),handle=document.createElementNS('http://www.w3.org/2000/svg','foreignObject'),surface=document.createElementNS('http://www.w3.org/1999/xhtml','div');
  for(const [key,value] of Object.entries({x:box.x,y:box.y,width:Math.max(1,box.width),height:Math.max(1,box.height)}))handle.setAttribute(key,value);
  handle.setAttribute('aria-hidden','true');handle.setAttribute('data-drag-handle','true');surface.className='builder-drag-surface';handle.append(surface);target.append(handle);
 });
 svg.addEventListener('pointerdown',e=>{
  const target=e.target.closest('[data-person],[data-text]');if(!target||e.button>0||e.isPrimary===false)return;e.preventDefault();const isPerson=target.hasAttribute('data-person'),key=target.dataset.person||target.dataset.text,item=isPerson?ctx.state.draft.characters.find(c=>c.id===key):ctx.state.draft.texts.find(t=>t.id===key);if(!item)return;
  const fieldGroup=svg.querySelector('[data-field]'),matrix=fieldGroup.getScreenCTM().inverse(),point=(x,y)=>new DOMPoint(x,y).matrixTransform(matrix),start=point(e.clientX,e.clientY),old={x:item.x,y:item.y},snapshot=JSON.stringify(ctx.state.draft);let moved=false;
  if(isPerson)ctx.state.selected=key;
  svg.setPointerCapture(e.pointerId);
  const move=ev=>{if(ev.pointerId!==e.pointerId)return;moved=true;const pos=point(ev.clientX,ev.clientY),f=field(ctx.state.catalog,ctx.state.draft),b=isPerson?bounds(item,ctx.state.catalog):{w:0,h:item.size};item.x=Math.max(0,Math.min(f.w-b.w,Math.round((old.x+pos.x-start.x)/2)*2));item.y=Math.max(0,Math.min(f.h-b.h,Math.round((old.y+pos.y-start.y)/2)*2));if(isPerson)target.setAttribute('transform',`translate(${item.x} ${item.y})`);else{target.setAttribute('transform',textTransform(item));}};
  const cleanup=()=>{svg.removeEventListener('pointermove',move);svg.removeEventListener('pointerup',end);svg.removeEventListener('pointercancel',cancel);svg.removeEventListener('lostpointercapture',cancel);if(svg.hasPointerCapture(e.pointerId))svg.releasePointerCapture(e.pointerId);};
  const end=async ev=>{if(ev.pointerId!==e.pointerId)return;cleanup();if(moved){history.push(snapshot);if(!validPositions(ctx.state.draft,ctx.state.catalog)){item.x=old.x;item.y=old.y;history.pop();ctx.toast('Персонажи пересекаются — перемещение отменено');}}else if(isPerson)ctx.state.step='people';await update(ctx);};
  const cancel=async ev=>{if(ev.pointerId!==e.pointerId)return;cleanup();item.x=old.x;item.y=old.y;await update(ctx);};svg.addEventListener('pointermove',move);svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',cancel);svg.addEventListener('lostpointercapture',cancel);
 });
}
