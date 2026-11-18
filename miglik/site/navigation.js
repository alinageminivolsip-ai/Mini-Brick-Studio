// Shared website/store navigation. No commerce writes and no scene dependency.
const mounted = new WeakSet();
export function mountNavigation(root=document){
 const header=root.querySelector('.mp-header');
 if(header&&!mounted.has(header)){
  mounted.add(header);const dialog=header.querySelector('#mp-menu'),toggle=header.querySelector('.mp-menu-toggle');
  const close=()=>{dialog.close();toggle.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');toggle.focus();};
  toggle.addEventListener('click',()=>{dialog.showModal();toggle.setAttribute('aria-expanded','true');document.body.classList.add('menu-open');dialog.querySelector('button').focus();});
  dialog.querySelector('[data-close-menu]').addEventListener('click',close);
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  dialog.addEventListener('click',event=>{if(event.target===dialog)close();});
  dialog.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{dialog.close();document.body.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false');}));
 }
 root.querySelectorAll('.mp-desktop a,#mp-menu nav>a').forEach(a=>{const url=new URL(a.href);if(url.pathname===location.pathname&&url.search===location.search)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 syncCartCount(root);
}
export function syncCartCount(root=document){
 let count=0;try{const items=JSON.parse(localStorage.getItem('miglik.showcase.cart')||'[]');if(Array.isArray(items))count=items.reduce((sum,item)=>sum+(Number.isFinite(item.quantity)&&item.quantity>0?item.quantity:0),0);}catch{}
 root.querySelectorAll('[data-cart-count]').forEach(el=>{el.hidden=count===0;el.textContent=String(count);el.parentElement.setAttribute('aria-label',count?'Корзина: '+count:'Корзина');});
}
window.addEventListener('storage',()=>syncCartCount());window.addEventListener('pageshow',()=>syncCartCount());
