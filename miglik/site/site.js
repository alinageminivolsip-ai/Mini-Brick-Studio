import {gsap} from '../assets/index-Bvu9zNsI.js';
import {ScrollTrigger} from '../assets/ScrollTrigger-7Zy99s9Q.js';
import {ApartmentPlayer} from './apartment-player.js';
import {setupSlider} from '../process-slider.js?v=unify-1';
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
