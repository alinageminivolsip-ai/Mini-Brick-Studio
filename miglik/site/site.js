import {gsap} from '../assets/index-Bvu9zNsI.js';
import {ScrollTrigger} from '../assets/ScrollTrigger-7Zy99s9Q.js';
import {ApartmentPlayer} from './apartment-player.js';
import {setupSlider} from '../process-slider.js?v=content-3';
for(const track of document.querySelectorAll('[data-step-track]')){
 setupSlider(track,document.querySelector('[data-step-controls="'+track.id+'"]'),{label:track.dataset.stepLabel,unit:'Этап'});
}
const dialog=document.querySelector('#mp-menu'),toggle=document.querySelector('.mp-menu-toggle');
if(dialog&&toggle){
 const close=()=>{dialog.close();toggle.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');toggle.focus();};
 toggle.addEventListener('click',()=>{dialog.showModal();toggle.setAttribute('aria-expanded','true');document.body.classList.add('menu-open');dialog.querySelector('button').focus();});
 dialog.querySelector('[data-close-menu]').addEventListener('click',close);
 dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
 dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
 dialog.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{dialog.close();document.body.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false');}));
}
const current=location.pathname;
document.querySelectorAll('.mp-desktop a,#mp-menu nav>a').forEach(a=>{if(new URL(a.href).pathname===current)a.setAttribute('aria-current','page');});
// The existing homepage bundle owns its scenes. New pages have a scoped lifecycle.
if(document.body.classList.contains('multipage')){
 gsap.registerPlugin(ScrollTrigger);
 const mm=gsap.matchMedia();let player;
 mm.add({'motion':'(prefers-reduced-motion: no-preference)','reduce':'(prefers-reduced-motion: reduce)'},context=>{
  const reduce=context.conditions.reduce;
  document.querySelectorAll('.highlight').forEach(el=>{if(!reduce)gsap.fromTo(el,{color:'#272421'},{color:'#8d283f',ease:'none',scrollTrigger:{trigger:el.closest('h2'),start:'top 85%',end:'top 45%',scrub:.5}});});
  const apartment=document.querySelector('.apartment-story');
  if(apartment){
   let trigger,manual=false;
   const resume=()=>{manual=false;};
   window.addEventListener("wheel",resume,{passive:true});window.addEventListener("touchstart",resume,{passive:true});
   context.add(()=>()=>{window.removeEventListener("wheel",resume);window.removeEventListener("touchstart",resume);});
   player=new ApartmentPlayer(apartment,{base:'/Mini-Brick-Studio/miglik/',motion:!reduce,onSelect:frame=>{manual=true;player.setFrame(frame);}});
   if(!reduce)trigger=ScrollTrigger.create({trigger:apartment,start:'top 78%',end:'bottom 20%',scrub:true,invalidateOnRefresh:true,onUpdate:self=>{if(!manual)player.setFrame(self.progress*60);}});
  }
  return()=>{player?.dispose();player=null;};
 });
 document.fonts.ready.then(()=>ScrollTrigger.refresh());
 window.addEventListener('pageshow',()=>ScrollTrigger.refresh());
 window.addEventListener('pagehide',e=>{if(!e.persisted)mm.revert();});
}

// Local, contact-free recommendations. Only product links change; constructor data is untouched.
const picker=document.querySelector('[data-gift-picker]');
if(picker){
 const states={
  couple:{title:'Рамка для пары',copy:'Два узнаваемых образа и ваша памятная дата.',photo:'couple-480.webp',path:'ramki-s-minifigurkami/'},
  friends:{title:'Рамка для друзей',copy:'Совместная фотография и детали, которые понятны вам обоим.',photo:'friends-480.webp',path:'ramki-s-minifigurkami/'},
  wedding:{title:'Свадебная рамка',copy:'Образы молодожёнов, фотография и дата свадьбы.',photo:'wedding-480.webp',path:'ramki-s-minifigurkami/'},
  home:{title:'3D-миниатюра дома',copy:'Планировка и детали нового или родного дома.',photo:'../apartment/key-60.webp',path:'miniatura-doma/'}
 };
 const update=()=>{
  const recipient=picker.querySelector('[name="recipient"]:checked').value;
  const occasion=picker.querySelector('[name="occasion"]:checked').value;
  const key=occasion==='home'?'home':occasion==='wedding'?'wedding':recipient==='friend'?'friends':recipient==='parents'?'home':'couple';
  const choice=states[key];
  picker.querySelector('[data-gift-title]').textContent=choice.title;
  picker.querySelector('[data-gift-copy]').textContent=choice.copy;
  picker.querySelector('[data-gift-price]').textContent=key==='home'?'Индивидуальный расчёт стоимости.':'От 2 490 ₽. Итоговая стоимость зависит от комплектации.';
  const image=picker.querySelector('[data-gift-image]');image.src='/Mini-Brick-Studio/miglik/editorial/images/'+choice.photo;image.alt='Визуализация: '+choice.title;
  picker.querySelector('[data-gift-link]').href='/Mini-Brick-Studio/miglik/'+choice.path;
  const alternative=picker.querySelector('[data-gift-alternative]');alternative.href='/Mini-Brick-Studio/miglik/'+(key==='home'?'ramki-s-minifigurkami/':'miniatura-doma/');alternative.textContent='Посмотреть другой вариант: '+(key==='home'?'рамка с минифигурками':'миниатюра дома');
 };
 picker.addEventListener('change',update);picker.addEventListener('input',update);
 window.addEventListener('pageshow',update);update();
}
for(const selector of document.querySelectorAll('[data-size-selector]')){
 selector.querySelectorAll('[data-size]').forEach(button=>button.addEventListener('click',()=>{
  selector.querySelectorAll('[data-size]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
  const dimensions={M:'165 × 215',L:'215 × 215',XL:'215 × 305'};
  selector.querySelector('.size-status').textContent='Выбран '+button.dataset.size+' — '+dimensions[button.dataset.size]+' мм.';
 }));
}
for(const button of document.querySelectorAll('[data-example-filter]'))button.addEventListener('click',()=>{
 const kind=button.dataset.exampleFilter;
 document.querySelectorAll('[data-example-filter]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
 document.querySelectorAll('[data-example-kind]').forEach(card=>{card.hidden=kind!=='all'&&card.dataset.exampleKind!==kind;});
 ScrollTrigger.refresh();
});
