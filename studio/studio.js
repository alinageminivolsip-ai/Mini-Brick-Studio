/* MIGLICK application shell: navigation, inline guidance, modal accessibility. */
const studioCopy={
 skin:['Начнём с характера','Выберите цвет и настроение вашего героя.'],
 hair:['Узнаётся с первого взгляда','Найдите ту самую причёску.'],
 torso:['Оденьте по-своему','Цвет, рукава и любимый принт.'],
 legs:['Образ до мелочей','Подберите цвет нижней части.'],
 accessory:['Детали с историей','Добавьте любимую вещь или увлечение.'],
 frame:['Соберите вашу историю','Выберите рамку, фон и расположение героев.']
};
let lastStudioStep='';
function updateStudioChrome(){
 const index=steps.findIndex(s=>s.key===step),copy=studioCopy[step]||studioCopy.skin;
 document.getElementById('editorHeading').textContent=copy[0];
 document.getElementById('editorDescription').textContent=copy[1];
 document.getElementById('stepCounter').textContent=`ДЕТАЛИ ПЕРСОНАЖА / ${index+1} ИЗ 6`;
 const next=document.getElementById('studioNext'),prev=document.getElementById('studioPrev');
 prev.disabled=index===0;
 next.textContent=step==='frame'?'К оформлению':`Далее: ${['','причёска','одежда','ноги','детали','рамка'][index+1]||'рамка'}`;
 document.getElementById('undoBtn').disabled=!undo.length;
 document.getElementById('addPerson').disabled=people.length>=10;
 document.getElementById('draftStatus').textContent=storageFailed?'Не удалось сохранить черновик':'Сохранено на устройстве';
 const livePrice=document.getElementById('studioLivePrice');
 if(livePrice)livePrice.textContent=cartTotal().toLocaleString('ru-RU')+' ₽';
 const editActions=document.getElementById('studioEditActions');
 if(editActions)editActions.hidden=!editingCartItemId;
 const saveFrame=document.getElementById('studioSaveFrame');
 if(saveFrame){saveFrame.hidden=step!=='frame';saveFrame.textContent=editingCartItemId?'Сохранить изменения':'Сохранить рамку';}
 document.querySelectorAll('[data-flow]').forEach(el=>{const active=(step==='frame'?'frame':'people')===el.dataset.flow;el.classList.toggle('active',active);el.setAttribute('aria-current',active?'step':'false')});
 document.querySelectorAll('.step-btn').forEach((el,i)=>{el.setAttribute('aria-pressed',String(i===index));if(i===index)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current')});
 document.querySelectorAll('.choice,.swatch-btn,.hair-cat,.acc-cat,.frame-choice,.frame-size-card,.frame-bg-choice').forEach(el=>{el.setAttribute('aria-pressed',String(el.classList.contains('active')));if(!el.getAttribute('aria-label')&&!el.textContent.trim())el.setAttribute('aria-label',el.title||el.querySelector('img')?.alt||'Выбрать вариант')});
 if(lastStudioStep!==step){document.getElementById('editorBody').scrollTop=0;lastStudioStep=step}
}
document.getElementById('studioPrev').onclick=()=>{const i=steps.findIndex(s=>s.key===step);if(i>0){step=steps[i-1].key;sync()}};
document.getElementById('studioNext').onclick=()=>{const i=steps.findIndex(s=>s.key===step);if(step==='frame')openOrderModal();else if(i===4)enterFrameMode();else{step=steps[Math.min(i+1,5)].key;sync()}};
document.querySelectorAll('[data-flow]').forEach(el=>el.onclick=()=>{if(el.dataset.flow==='order')openOrderModal();else if(el.dataset.flow==='frame')enterFrameMode();else{step='skin';sync()}});
// Modal focus is retained across opening, trapped inside and returned on close.
let activeModal=null,returnFocus=null;
const modalObserver=new MutationObserver(()=>{
 const open=[...document.querySelectorAll('.modal.open')].filter(el=>getComputedStyle(el).display!=='none').at(-1)||null;
 if(open===activeModal)return;
 if(open){if(!activeModal)returnFocus=document.activeElement;activeModal=open;open.setAttribute('role','dialog');open.setAttribute('aria-modal','true');const title=open.querySelector('h2,.onboard-title');if(title){if(!title.id)title.id=`${open.id}-title`;open.setAttribute('aria-labelledby',title.id)}document.querySelector('.app').inert=true;setTimeout(()=>open.querySelector('button:not(:disabled),a[href],input')?.focus(),0)}
 else{activeModal=null;document.querySelector('.app').inert=false;returnFocus?.focus();returnFocus=null}
});
modalObserver.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
document.addEventListener('keydown',event=>{
 document.documentElement.classList.add('keyboard-mode');
 if(!activeModal)return;
 if(event.key==='Escape'){event.preventDefault();if(activeModal.id==='orderModal'){closeCompletionDialog();return}activeModal.classList.remove('open');pendingDeleteIndex=null;return}
 if(event.key!=='Tab')return;
 const all=[...activeModal.querySelectorAll('button:not(:disabled),a[href],input,textarea,select,[tabindex="0"]')].filter(el=>el.getClientRects().length);
 if(!all.length)return;
 if(event.shiftKey&&document.activeElement===all[0]){event.preventDefault();all.at(-1).focus()}else if(!event.shiftKey&&document.activeElement===all.at(-1)){event.preventDefault();all[0].focus()}
});
document.addEventListener('pointerdown',()=>document.documentElement.classList.remove('keyboard-mode'));

if(typeof appBooted!=='undefined'&&appBooted)updateStudioChrome();
const zoomPreview=document.getElementById('zoomPreviewBtn');
function toggleLargePreview(force){const large=typeof force==='boolean'?force:!document.body.classList.contains('large-preview');document.body.classList.toggle('large-preview',large);zoomPreview.textContent=large?'Готово':'Крупнее';zoomPreview.setAttribute('aria-pressed',String(large));if(step==='frame'){invalidateFramePreviewBase();requestAnimationFrame(()=>{applyFrameBoxSize(true);renderFrame()})}}
zoomPreview.onclick=()=>toggleLargePreview();
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&document.body.classList.contains('large-preview')){toggleLargePreview(false);zoomPreview.focus()}});

document.addEventListener('input',event=>{if(event.target.closest('.editor')){currentDraftStarted=true;draftStorage.setItem('miglick_current_started','1')}},true);

if(new URLSearchParams(location.search).get('ux')!=='legacy'){
const editorialStyles=document.createElement('link');
editorialStyles.rel='stylesheet';
editorialStyles.href='./editorial.css?v=2';
document.head.appendChild(editorialStyles);
const editorHeader=document.querySelector('.editor-head')||document.getElementById('editorHeading').parentElement;
const introduction=document.createElement('p');
introduction.className='studio-welcome';
introduction.textContent='Ваша маленькая история';
editorHeader.prepend(introduction);
const heroPanel=document.querySelector('.panel.left');
heroPanel.classList.add('editorial-heroes');
editorHeader.after(heroPanel);
const priceSummary=document.createElement('div');
priceSummary.className='studio-live-total';
priceSummary.innerHTML='<span>Весь заказ <small>По выбранным деталям</small></span><strong id="studioLivePrice" aria-live="polite"></strong>';
document.querySelector('.editor-footer').prepend(priceSummary);
const editActions=document.createElement('div');
editActions.id='studioEditActions';
editActions.hidden=true;
const cancelEdit=document.createElement('button');
cancelEdit.className='btn ghost';
cancelEdit.textContent='Отменить изменения рамки';
cancelEdit.onclick=cancelCartEdit;
editActions.appendChild(cancelEdit);
editorHeader.appendChild(editActions);
const saveFrame=document.createElement('button');
saveFrame.id='studioSaveFrame';
saveFrame.className='btn ghost';
saveFrame.hidden=true;
saveFrame.onclick=()=>{addCurrentFrameToCart();renderCartModal();cartModal.classList.add('open');};
document.querySelector('.editor-footer').appendChild(saveFrame);
document.querySelector('#cartModal h2').textContent='Ваши истории';
const cartNote=document.querySelector('.cart-current-note');
cartNote.textContent='Несколько подарков — один заказ. Каждую сохранённую рамку можно изменить или скопировать.';
const addAnother=document.createElement('button');
addAnother.className='btn ghost cart-add-another';
addAnother.textContent='+ Собрать ещё одну рамку';
addAnother.onclick=()=>{closeCartModal();if(editingCartItemId){notify('Сначала сохраните или отмените изменения рамки.');return}if(currentDraftStarted){notify('Продолжите текущую рамку. Сохраните её перед созданием следующей.');return}resetCurrentFrameState();sync();};
document.getElementById('cartItemsList').after(addAnother);
if(typeof appBooted!=='undefined'&&appBooted)updateStudioChrome();
}
