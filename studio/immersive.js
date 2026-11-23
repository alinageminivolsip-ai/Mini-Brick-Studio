/* Mobile camera changes only the isolated hero preview. */
const immersiveMobile = matchMedia('(max-width: 767px)');
let immersiveEditing = false;
const immersivePose = {zoom: 1, offset: 0};
const immersiveCamera = {
  skin: {zoom: 1.95, offset: 27},
  hair: {zoom: 1.92, offset: 31},
  torso: {zoom: 1.52, offset: -5},
  legs: {zoom: 1.45, offset: -22},
  accessory: {zoom: 1.22, offset: -4}
};
let immersiveTarget = null;
const immersiveDone = document.createElement('button');
immersiveDone.type = 'button';
immersiveDone.className = 'immersive-done';
immersiveDone.textContent = 'Готово';
immersiveDone.hidden = true;
el('cartBtn').before(immersiveDone);

function setImmersiveCamera(pose, motion = true, onComplete) {
  if (motion && !onComplete && immersiveTarget?.zoom === pose.zoom && immersiveTarget.offset === pose.offset) return;
  immersiveTarget = pose;
  const apply = () => {
    constructorView.style.setProperty('--hero-zoom', immersivePose.zoom);
    constructorView.style.setProperty('--hero-offset', immersivePose.offset + '%');
  };
  gsap.killTweensOf(immersivePose);
  if (!motion || simpleReduced.matches) {
    Object.assign(immersivePose, pose);
    apply();
    onComplete?.();
    return;
  }
  gsap.to(immersivePose, {...pose, duration: .36, ease: 'power2.out', onUpdate: apply, onComplete});
}

const immersiveOpen = simpleOpen;
simpleOpen = function (category, part) {
  if (immersiveMobile.matches && ['heroes', 'details'].includes(category)) {
    const entering = !immersiveEditing;
    immersiveEditing = true;
    immersiveOpen(category, part);
    if (entering) {
      setImmersiveCamera({zoom:1, offset:0}, false);
      setImmersiveCamera(immersiveCamera[step] || {zoom:1, offset:0});
    }
  } else {
    immersiveEditing = false;
    immersiveOpen(category, part);
  }
};

const immersiveRenderEditor = renderEditor;
renderEditor = function () {
  const body = el('editorBody');
  const oldStep = body.dataset.cameraPart;
  const oldGrids = [...body.querySelectorAll('.choice-grid')];
  const offsets = new Map(oldGrids.filter(grid => grid.id).map(grid => [grid.id, grid.scrollLeft]));
  immersiveRenderEditor();
  body.dataset.cameraPart = step;
  if (!immersiveMobile.matches || !immersiveEditing || flow !== 1) return;
  for (const grid of body.querySelectorAll('.choice-grid')) {
    for (const img of grid.querySelectorAll('img')) img.loading = 'eager';
    if (oldStep === step) grid.scrollLeft = offsets.get(grid.id) || 0;
  }
};

const immersiveChrome = updateStudioChrome;
updateStudioChrome = function () {
  immersiveChrome();
  const enabled = immersiveMobile.matches && immersiveEditing && flow === 1;
  document.body.classList.toggle('immersive-mobile', immersiveMobile.matches);
  document.body.classList.toggle('immersive-editing', enabled);
  immersiveDone.hidden = !enabled;
  if (!enabled) return;
  el('characterTabs').hidden = false;
  if (!el('characterTabs').querySelector('[data-part-tab=accessory]')) {
    const details = document.createElement('button');
    details.type = 'button';
    details.dataset.partTab = 'accessory';
    details.textContent = 'Детали';
    details.setAttribute('aria-pressed', String(step === 'accessory'));
    details.onclick = () => selectPart('accessory');
    el('characterTabs').append(details);
  }
  for (const button of el('characterTabs').querySelectorAll('button')) {
    const part = button.dataset.partTab;
    button.onclick = () => {
      if (part === step) return;
      selectPart(part);
      el('characterTabs').querySelector('[data-part-tab="' + part + '"]')?.focus({preventScroll:true});
    };
  }
  setImmersiveCamera(immersiveCamera[step] || {zoom:1, offset:0});
};

const immersiveNext = el('studioNext').onclick;
el('studioNext').onclick = event => {
  immersiveEditing = false;
  return immersiveNext.call(el('studioNext'), event);
};
immersiveDone.onclick = () => {
  setImmersiveCamera({zoom:1, offset:0}, true, () => {
    immersiveEditing = false;
    simpleOpen('frame');
    requestAnimationFrame(() => { applyFrameBoxSize(); renderFrame(); });
    el('flowNav').querySelector('[data-category=frame]')?.focus({preventScroll:true});
  });
};
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && immersiveEditing && !document.querySelector('dialog[open], .modal.open')) {
    immersiveDone.click();
  }
});
immersiveMobile.addEventListener('change', () => {
  immersiveEditing = false;
  updateStudioChrome();
  requestAnimationFrame(() => {applyFrameBoxSize(); renderFrame();});
});
updateStudioChrome();
