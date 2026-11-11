import { icon } from './shop/icons.js';
// Shared presentation helpers for the storefront and authored homepage.
let helpId = 0;
const converted = new WeakSet();
const helpLabels = new Map([
  ['discount-help-note', 'Как рассчитывается скидка'],
  ['story-detail', 'Детали оформления'],
  ['image-note', 'О миниатюре дома'],
  ['gift-config-caption', 'О предпросмотре рамки'],
  ['hero-help-note', 'Как изменить героя'],
  ['process-swipe-hint', 'Как листать карточки'],
]);

function placeHelp(panel, trigger) {
  const anchor = trigger.getBoundingClientRect();
  const width = Math.min(340, window.innerWidth - 32);
  panel.style.width = `${width}px`;
  panel.style.left = `${Math.max(16, Math.min(anchor.left, window.innerWidth - width - 16))}px`;
  const height = panel.getBoundingClientRect().height;
  const below = anchor.bottom + 8;
  panel.style.top = `${Math.max(16, below + height < window.innerHeight - 16 ? below : anchor.top - height - 8)}px`;
}

function addHelp(element, label) {
  if (converted.has(element) || element.closest('.builder')) return;
  converted.add(element);
  const content = element.classList.contains('process-swipe-hint') ? 'Проведите пальцем по карточкам влево или вправо. Также можно пользоваться стрелками рядом со счётчиком.' : element.textContent.trim();
  if (!content) return;
  const id = `miglik-help-${++helpId}`;
  const wrap = document.createElement('span');
  wrap.className = 'context-help';
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'context-help-button';
  trigger.textContent = '?';
  trigger.setAttribute('aria-label', label);
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('popovertarget', id);
  const panel = document.createElement('div');
  panel.id = id;
  panel.className = 'context-help-panel';
  panel.setAttribute('popover', 'auto');
  const title = document.createElement('strong');
  title.textContent = label;
  const text = document.createElement('p');
  text.textContent = content;
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'context-help-close';
  close.textContent = 'Закрыть';
  close.setAttribute('popovertarget', id);
  close.setAttribute('popovertargetaction', 'hide');
  panel.append(title, text, close);
  panel.addEventListener('toggle', event => {
    const open = event.newState === 'open';
    trigger.setAttribute('aria-expanded', String(open));
    if (open) placeHelp(panel, trigger);
  });
  // Native popover provides outside-click and Escape dismissal.
  wrap.append(trigger, panel);
  element.replaceWith(wrap);
}

function enhanceCopy() {
  if (document.querySelector('.builder')) return;
  for (const [className, label] of helpLabels) {
    document.querySelectorAll(`.${className}`).forEach(element => addHelp(element, label));
  }
  document.querySelectorAll('[data-process-prev], [data-process-next]').forEach(button => {
    if (button.querySelector('svg')) return;
    button.innerHTML = icon('arrow');
    button.classList.toggle('slider-previous', button.hasAttribute('data-process-prev'));
  });
  document.querySelectorAll('.text-link > span[aria-hidden], .button > span[aria-hidden], .occasion-arrow').forEach(span => {
    if (span.textContent.trim() === '↗') span.innerHTML = icon('up');
  });
  const storeMenu = document.querySelector('.mobile-nav');
  if (storeMenu) {
    const top = document.querySelector('.site-header').getBoundingClientRect().bottom;
    storeMenu.style.top = `${Math.max(0, top)}px`;
    storeMenu.style.maxHeight = `${Math.max(160, innerHeight - top)}px`;
  }
  document.querySelectorAll('.gallery-figure figcaption').forEach(caption => caption.remove());
  document.querySelectorAll('.memory-art figcaption, #memories .quiet-copy').forEach(element => element.remove());
  const catalogLink = document.querySelector('.home-buy-link');
  if (catalogLink && !catalogLink.querySelector('svg')) catalogLink.innerHTML = 'Смотреть рамки ' + icon('arrow');
}

const menuButton = document.querySelector('.site-menu-toggle');
const menu = document.getElementById('home-mobile-menu');
function closeHomeMenu(restoreFocus = false) {
  if (!menu || !menuButton) return;
  menu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = 'Меню';
  document.body.classList.remove('site-menu-open');
  if (restoreFocus) menuButton.focus({preventScroll: true});
}
if (menu && menuButton) {
  menuButton.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? 'Закрыть' : 'Меню';
    document.body.classList.toggle('site-menu-open', open);
  });
  menu.addEventListener('click', event => {
    if (event.target.closest('a')) closeHomeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) closeHomeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!menu.hidden && !event.target.closest('.mobile-navigation')) closeHomeMenu();
  });
  matchMedia('(min-width: 901px)').addEventListener('change', () => closeHomeMenu());
}
window.addEventListener('resize', () => {
  document.querySelectorAll('.context-help-panel:popover-open').forEach(panel => panel.hidePopover());
});
let scheduled = false;
new MutationObserver(records => {
  if (!records.some(record => record.addedNodes.length) || scheduled) return;
  scheduled = true;
  queueMicrotask(() => { scheduled = false; enhanceCopy(); });
}).observe(document.body, {childList: true, subtree: true});
enhanceCopy();

document.addEventListener('click', event => {
  const toggle = document.querySelector('[data-action=menu][aria-expanded=true]');
  if (toggle && !event.target.closest('.site-header, .mobile-nav')) toggle.click();
});
