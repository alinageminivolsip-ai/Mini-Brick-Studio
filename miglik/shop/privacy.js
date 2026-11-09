export const privacyVersion='2026-10-27';
export function privacyPreferences(){try{const value=JSON.parse(localStorage.getItem('miglik.privacy'));return value?.version===privacyVersion&&value.expiresAt>Date.now()?value:null;}catch{return null;}}
export const draftsAllowed=()=>privacyPreferences()?.drafts===true;
let privacyApi,expanded=false;
function renderPrivacy(){
 const root=document.querySelector('#privacy-root');if(!root)return;const current=privacyPreferences();
 if(current&&!expanded){root.innerHTML='';return;}
 root.innerHTML=`<section class="cookie-panel" role="region" aria-label="Cookie и память браузера"><h2>Cookie и ваш черновик</h2><p>Технические cookie нужны для входа и оформления. Корзина хранится на этом устройстве. Аналитических и рекламных счётчиков нет.</p>${expanded?`<label class="checkbox"><input type="checkbox" checked disabled><span>Технические cookie и корзина — необходимы для работы сайта.</span></label><label class="checkbox"><input id="privacy-drafts" type="checkbox" ${current?.drafts?'checked':''}><span>Разрешить сохранять отдельный черновик композиции между посещениями.</span></label><p class="small">При отказе старый отдельный черновик удалится с устройства. Корзина сохранится; текущий макет можно продолжать редактировать в открытой странице.</p>`:'<p>Вы можете отдельно разрешить сохранение черновика между посещениями.</p>'}<a href="/cookies" data-native>Подробнее о cookie и памяти браузера</a><p class="form-error" role="alert"></p><div class="cookie-actions"><button type="button" class="btn btn-outline btn-small" data-privacy="essential">Только необходимые</button><button type="button" class="btn btn-dark btn-small" data-privacy="${expanded?'save':'allow'}">${expanded?'Сохранить выбор':'Разрешить черновики'}</button>${expanded?'':'<button type="button" class="text-button" data-privacy="settings">Настройки</button>'}</div></section>`;
}
export function openPrivacySettings(){expanded=true;renderPrivacy();document.querySelector('#privacy-drafts')?.focus();}
export function mountPrivacy(api){
 privacyApi=api;if(!document.querySelector('#privacy-root')){const root=document.createElement('div');root.id='privacy-root';document.body.append(root);root.addEventListener('click',async event=>{const button=event.target.closest('[data-privacy]');if(!button)return;const action=button.dataset.privacy;if(action==='settings'){openPrivacySettings();return;}
 const drafts=action==='allow'||action==='save'&&document.querySelector('#privacy-drafts')?.checked===true;root.querySelectorAll('button').forEach(b=>b.disabled=true);
 try{const response=await privacyApi('/api/privacy/preferences',{drafts});localStorage.setItem('miglik.privacy',JSON.stringify({version:privacyVersion,drafts,receiptId:response.id,expiresAt:Date.now()+180*86400000}));if(!drafts){localStorage.removeItem('miglik.draft');localStorage.removeItem('miglik.builderQuantity');}expanded=false;renderPrivacy();document.dispatchEvent(new CustomEvent('miglik-privacy-change',{detail:{drafts}}));}catch{const error=root.querySelector('.form-error');if(error)error.textContent='Не удалось сохранить выбор. Попробуйте ещё раз; дополнительное сохранение пока не включено.';root.querySelectorAll('button').forEach(b=>b.disabled=false);}
 });}
 renderPrivacy();
}
