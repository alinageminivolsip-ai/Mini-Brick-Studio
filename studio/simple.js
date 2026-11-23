/* Visual shell over the existing draft, renderer and cart. */
const simpleCategories = [
  ['heroes', 'Герои', '<circle cx="12" cy="8" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>'],
  ['frame', 'Рамка', '<rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="10" height="10" rx="1"/>'],
  ['background', 'Фон', '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="15.5" cy="8.5" r="1.5"/><path d="m3 17 5-5 4 4 2-2 7 6"/>'],
  ['text', 'Текст', '<path d="M5 7V5h14v2M12 5v14m-4 0h8"/>'],
  ['details', 'Детали', '<path d="M12 3c0 6 3 9 9 9-6 0-9 3-9 9 0-6-3-9-9-9 6 0 9-3 9-9Z"/>']
];
const simpleSizes = [
  ['small', 'M', '16,5 × 21,5'], ['square', 'L', '21,5 × 21,5'], ['big', 'XL', '21,5 × 30,5']
];
let simpleCategory = 'heroes';
const simpleRender = renderEditor;
const simpleChrome = updateStudioChrome;
const simpleCart = el('studioNext').onclick;
const simpleReduced = matchMedia('(prefers-reduced-motion: reduce)');
document.body.classList.add('simple-studio');

function simpleOpen(category, part = 'skin') {
  simpleCategory = category;
  flow = ['heroes', 'details'].includes(category) ? 1 : category === 'frame' ? 2 : 3;
  detailTab = category === 'background' ? 'photo' : 'text';
  step = flow === 1 ? (category === 'details' ? 'accessory' : part) : 'frame';
  sync();
}

renderEditor = function () {
  if (flow === 0) { flow = 1; step = 'skin'; simpleCategory = 'heroes'; }
  simpleRender();
  const body = el('editorBody');
  if (flow === 3 && detailTab === 'text') {
    body.querySelector('.frame-text-move-hint')?.remove();
    const date = document.createElement('input');
    date.type = 'date';
    date.setAttribute('aria-label', 'Памятная дата');
    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'btn ghost';
    add.textContent = '+ Добавить дату';
    add.disabled = true;
    date.oninput = () => { add.disabled = !date.value; };
    add.onclick = () => {
      if (!date.value) return;
      snap();
      const item = makeFrameTextItem(date.value.split('-').reverse().join('.'));
      frameTexts.push(item);
      activeFrameTextId = item.id;
      sync();
    };
    body.append(date, add);
  }
  if (flow === 4) body.querySelector('.review-notice')?.remove();
  if (flow === 2) {
    body.querySelector('#frameBgGrid')?.remove();
    body.querySelectorAll('.section-title').forEach(node => {
      if (node.textContent.includes('Фон')) node.remove();
    });
    for (const [id, name, size] of simpleSizes) {
      const card = body.querySelector('[data-frame-size="' + id + '"]');
      const label = card?.querySelector('.frame-size-label');
      if (label) label.textContent = name + ' · ' + size;
      if (card) card.disabled = people.length > GuidedProduct.capacity[id];
    }
  }
  if (flow === 3) {
    body.querySelector('.detail-tabs')?.remove();
    body.querySelector('.guided-intro')?.remove();
    if (detailTab === 'photo') {
      const gallery = document.createElement('div');
      gallery.className = 'frame-bg-grid';
      for (const bg of framePresetBackgrounds) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'frame-bg-choice';
        button.setAttribute('aria-pressed', String(!frameBgData && framePresetBg === bg.id));
        const tile = document.createElement('span');
        tile.className = 'frame-bg-thumb';
        if (bg.src) tile.style.backgroundImage = 'url("' + bg.src + '")';
        button.append(tile, bg.name);
        button.onclick = () => {
          snap();
          framePresetBg = bg.id;
          frameBgData = '';
          sync();
        };
        gallery.append(button);
      }
      body.prepend(gallery);
      const collage = document.createElement('a');
      collage.className = 'btn ghost';
      collage.href = '../miglik/tools/kollazh-iz-foto/';
      collage.textContent = 'Создать коллаж';
      collage.onclick = async event => {
        event.preventDefault();
        await window.miglikStorage.pending;
        if (window.miglikStorage.failed) return notify('Черновик не сохранён. Проверьте свободное место.');
        location.assign(collage.href);
      };
      body.append(collage);
    }
  }
};

updateStudioChrome = function () {
  simpleChrome();
  const category = flow === 1 ? (step === 'accessory' ? 'details' : 'heroes') :
    flow === 2 ? 'frame' : flow === 3 ? (detailTab === 'photo' ? 'background' : 'text') : null;
  const nav = el('flowNav');
  nav.setAttribute('aria-label', 'Настройки рамки');
  nav.innerHTML = simpleCategories.map(([id, label, icon]) =>
    '<button type="button" data-category="' + id + '" aria-label="' + label + '" aria-pressed="' + (category === id) +
    '"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">' + icon + '</svg><b>' + label + '</b></button>').join('');
  nav.querySelectorAll('button').forEach(button => {
    button.onclick = () => simpleOpen(button.dataset.category);
  });
  el('editorHeading').textContent = flow === 4 ? 'Перед добавлением' :
    simpleCategories.find(([id]) => id === category)?.[1] || 'Редактор';
  el('editorDescription').textContent = '';
  el('stepCounter').textContent = '';
  el('studioPrev').hidden = flow !== 4;
  el('studioPrev').textContent = 'К рамке';
  el('studioNext').textContent = flow === 4 && editingCartItemId ? 'Сохранить' : flow === 4 ? 'Добавить' : 'В корзину';
  el('studioNext').disabled = false;
  miniGrid.querySelectorAll('.mini-figure').forEach(figure =>
    figure.classList.toggle('simple-selected', flow === 1 && Number(figure.dataset.index) === active));

};

el('studioPrev').onclick = () => simpleOpen(simpleCategory);
el('studioNext').onclick = async event => {
  if (!capacityOK()) return;
  if (flow === 4) return simpleCart.call(el('studioNext'), event);
  goFlow(4);
};

const simpleRenderFrame = renderFrame;
renderFrame = function () {
  simpleRenderFrame();
  miniGrid.querySelectorAll('.mini-figure').forEach(figure => {
    const index = Number(figure.dataset.index);
    figure.tabIndex = 0;
    figure.setAttribute('role', 'button');
    figure.setAttribute('aria-label', 'Настроить ' + people[index].name);
    figure.classList.toggle('simple-selected', flow === 1 && index === active);
    const edit = () => { active = index; simpleOpen('heroes'); };
    figure.onclick = edit;
    figure.onkeydown = event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); edit(); }
    };
  });
};
miniGrid.addEventListener('click', event => {
  const text = event.target.closest('.frame-text-overlay');
  if (text && flow !== 3) {
    activeFrameTextId = text.dataset.textId;
    simpleOpen('text');
  } else if (event.target === miniGrid) simpleOpen('background');
});

const quick = document.createElement('dialog');
quick.className = 'simple-quick';
quick.setAttribute('aria-labelledby', 'simple-question');
document.body.append(quick);
let quickStep = 0;
let quickCount;
let quickSize;
function quickRender() {
  const titles = ['Сколько фигурок будет в рамке?', 'Выберите размер', 'Выберите фон'];
  quick.innerHTML = '<h2 id="simple-question">' + titles[quickStep] +
    '</h2><div class="simple-options"></div><div class="simple-quick-actions"></div>';
  const options = quick.querySelector('.simple-options');
  const actions = quick.querySelector('.simple-quick-actions');
  function option(parent, label, action, visual) {
    const button = document.createElement('button');
    button.type = 'button';
    if (visual) button.append(visual);
    button.append(document.createTextNode(label));
    button.onclick = action;
    parent.append(button);
    return button;
  }
  if (quickStep === 0) {
    for (let count = 1; count <= GuidedProduct.capacity.big; count++) {
      const visual = document.createElement('span');
      visual.className = 'simple-count';
      visual.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < count; i++) {
        const head = document.createElement('img');
        head.src = './assets/faces/A1.png';
        head.alt = '';
        visual.append(head);
      }
      option(options, String(count), () => {
        quickCount = count;
        quickStep = 1;
        quickRender();
      }, visual);
    }
  } else if (quickStep === 1) {
    for (const [id, name, size] of simpleSizes) {
      const visual = document.createElement('span');
      visual.className = 'simple-size ' + id;
      const button = option(options, name + ' · ' + size + ' см', () => {
        quickSize = id;
        quickStep = 2;
        quickRender();
      }, visual);
      button.disabled = quickCount > GuidedProduct.capacity[id];
    }
  } else {
    for (const bg of framePresetBackgrounds) {
      const visual = document.createElement('span');
      visual.className = 'simple-bg';
      if (bg.src) visual.style.backgroundImage = 'url("' + bg.src + '")';
      option(options, bg.name, () => finishQuick(bg.id), visual);
    }
    option(options, 'Своя фотография', () => {
      finishQuick('none', 'background');
      el('bgInput')?.click();
    });
    option(options, 'Создать коллаж', async () => {
      finishQuick('none', 'background');
      await window.miglikStorage.pending;
      if (!window.miglikStorage.failed) location.assign('../miglik/tools/kollazh-iz-foto/');
    });
  }
  if (quickStep > 0) option(actions, 'Назад', () => { quickStep--; quickRender(); });
  option(actions, 'Пропустить', () => finishQuick());
  if (!simpleReduced.matches && window.gsap) gsap.from(options, {opacity: .55, y: 5, duration: .18});
}
function finishQuick(background, category = 'heroes') {
  if (quickCount !== undefined) {
    snap();
    while (people.length < quickCount) people.push(newPerson(people.length + 1));
    people = people.slice(0, quickCount);
    active = Math.min(active, people.length - 1);
    const size = quickSize || (people.length <= 5 ? 'small' : people.length <= 8 ? 'square' : 'big');
    frame = frame.split('-')[0] + '-' + size;
    invalidateFramePreviewBase();
    ensureFramePositions(true);
  }
  if (background !== undefined) { framePresetBg = background; frameBgData = ''; }
  quick.close();
  draftStorage.setItem('miglik_simple_started', '1');
  simpleOpen(category);
}
quick.addEventListener('cancel', event => { event.preventDefault(); finishQuick(); });
const openQuick = !window.miglikHadDraft && !giftTemplate && !editingCartItemId &&
  !new URLSearchParams(location.search).has('collage') && !draftStorage.getItem('miglik_simple_started');
function showQuick() {
  quickStep = 0;
  quickCount = undefined;
  quickSize = undefined;
  quickRender();
  quick.showModal();
}
const simpleAnother = el('addAnotherFrame').onclick;
el('addAnotherFrame').onclick = event => {
  const canStart = !editingCartItemId && !currentDraftStarted;
  simpleAnother.call(el('addAnotherFrame'), event);
  if (canStart) showQuick();
};
if (openQuick) {
  showQuick();
}
if (flow !== 4) simpleOpen(flow === 2 ? 'frame' : flow === 3 ? 'text' : 'heroes', step === 'frame' ? 'skin' : step);
