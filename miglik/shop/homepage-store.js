// Add commerce entry points without taking ownership of the authored scroll timelines.
import { previewURL as shop } from './preview.js';
let mounted=false;
const constructorURL='https://alinageminivolsip-ai.github.io/Mini-Brick-Studio/studio/';
function enhance(){
 const header=document.querySelector('header');const hero=document.querySelector('h1');
 if(!header||!hero||mounted)return;
 mounted=true;
 document.body.classList.add("authored-home");
 header.classList.add("home-with-store");
 hero.setAttribute("aria-label","У каждой истории есть свои особенности");
 const intro=hero.parentElement.querySelector("p");
 if(intro)intro.textContent="Персональные рамки с минифигурками по вашим фотографиям.";
 const links=document.createElement('nav');links.className='home-store-links';links.setAttribute('aria-label','Магазин');links.innerHTML='<a href="/catalog">Рамки</a><a href="/account">Кабинет</a><a href="/cart">Корзина</a>';header.append(links);
 const mobileNav=header.querySelector('.mobile-navigation nav');
 if(mobileNav){const mobileLinks=links.cloneNode(true);mobileLinks.className='home-mobile-commerce';mobileNav.prepend(...mobileLinks.children);}
 const existing=hero.parentElement.querySelector('.hero-actions a[href="#stories"]');
 const buy=existing||document.createElement('a');
 buy.classList.add('home-buy-link');buy.href=shop('/catalog');buy.textContent='Смотреть рамки →';
 if(!existing)hero.parentElement.append(buy);
 for(const a of document.querySelectorAll('a[href*="studio"]'))a.href=constructorURL;
 const foot=document.createElement('nav');foot.className='home-store-footer';foot.setAttribute('aria-label','Покупателям');foot.innerHTML='<a href="/catalog">Каталог рамок</a><a href="/delivery">Доставка и оплата</a><a href="/account">Личный кабинет</a><a href="/legal">Документы</a><a href="/returns">Возврат</a><a href="/contacts">Контакты</a><a href="/cookies">Память браузера</a>';document.body.append(foot);
 const label=document.createElement('span');label.className='website-mode';label.textContent='Демонстрация магазина · тестовые цены';document.body.append(label);
 header.querySelector(".mobile-navigation")?.addEventListener("keydown",event=>{if(event.key==="Escape"){event.currentTarget.open=false;event.currentTarget.querySelector("summary")?.focus();}});
 for(const a of document.querySelectorAll('.home-store-links a, .mobile-navigation a[href^="/"], .home-store-footer a'))a.href=shop(a.getAttribute('href'));
 observer.disconnect();
}
const observer=new MutationObserver(enhance);observer.observe(document.body,{childList:true,subtree:true});enhance();
