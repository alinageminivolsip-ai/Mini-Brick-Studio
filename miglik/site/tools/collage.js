import {gsap} from '../../assets/index-Bvu9zNsI.js';
import {projectStore} from './project-store.js';

const editor = document.querySelector('#collage-editor');
const canvas = editor.querySelector('canvas');
const ctx = canvas.getContext('2d');
const field = name => editor.querySelector('[name="' + name + '"]');
const status = editor.querySelector('.collage-controls > [role=status]:last-child');
const download = editor.querySelector('[data-download]');
const transfer = editor.querySelector('[data-transfer]');
const upload = editor.querySelector('[type=file]');
const settings = ['layout', 'ratio', 'background', 'gap'];
const crop = ['zoom', 'x', 'y'];
let projectId = new URL(location.href).searchParams.get('project');
let photos = [];
let selected = 0;
let history = [];
let cursor = -1;
let busy = false;
const minimum = {four: 4, hero: 3, asymmetric: 3};
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const layoutButtons = [...editor.querySelectorAll('[data-layout]')];
function insufficient() {
  return photos.length > 0 && photos.length < (minimum[field('layout').value] || 2);
}
for (const button of layoutButtons) {
  button.addEventListener('click', () => {
    field('layout').value = button.dataset.layout;
    record();
    if (!reduced.matches) gsap.fromTo(canvas, {opacity: .75}, {opacity: 1, duration: .22, overwrite: true});
  });
}
let drag;
let hitAreas = [];
const formats = {M: [15.5, 20.5], L: [22, 22], XL: [22.5, 31.5]};
const mockup = editor.querySelector('.collage-mockup');
const guides = editor.querySelector('.collage-figures');

function restoreSetting(name, value) {
  // Keep projects saved before the frame picker was introduced editable.
  if (name === 'ratio') value = ({'1': 'L', '.75': 'M', '.69': 'XL'})[value] || value;
  field(name).value = value;
}

function record() {
  history = history.slice(0, cursor + 1);
  history.push({
    photos: photos.map(photo => ({...photo})),
    settings: Object.fromEntries(settings.map(name => [name, field(name).value]))
  });
  if (history.length > 30) history.shift();
  cursor = history.length - 1;
  draw();
}

function selectPhoto() {
  field('photo').replaceChildren(...photos.map((_, index) => new Option('Фото ' + (index + 1), index)));
  selected = Math.min(selected, Math.max(0, photos.length - 1));
  field('photo').value = selected;
  for (const name of crop) if (photos[selected]) field(name).value = photos[selected][name];
}

function cells(count, layout) {
  if (layout === 'hero' && count >= 2) {
    return [[0, 0, .62, 1], ...Array.from({length: count - 1}, (_, i) => [.62, i / (count - 1), .38, 1 / (count - 1)])];
  }
  if (layout === 'asymmetric' && count >= 3) {
    return [[0, 0, .62, .56], [.62, 0, .38, .56],
      ...Array.from({length: count - 2}, (_, i) => [i / (count - 2), .56, 1 / (count - 2), .44])];
  }
  const cols = layout === 'strip' ? 1 : layout === 'wide' ? Math.min(count, 2) : count > 4 ? 3 : 2;
  const rows = Math.ceil(count / cols);
  return Array.from({length: count}, (_, i) => {
    const row = Math.floor(i / cols);
    const items = Math.min(cols, count - row * cols);
    return [(i % cols) / items, row / rows, 1 / items, 1 / rows];
  });
}

function draw() {
  const [width, height] = formats[field('ratio').value] || formats.L;
  const ratio = width / height;
  mockup.style.setProperty('--frame-ratio', ratio);
  guides.style.setProperty('--figure-width', (4 / width * 2 / 3 * 100) + '%');
  guides.style.setProperty('--figure-height', (4 / height * 100) + '%');
  guides.hidden = !field('guides').checked || !photos.length;
  editor.querySelector('.collage-empty').hidden = photos.length > 0;
  for (const button of layoutButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.layout === field('layout').value));
  }
  const hint = editor.querySelector('.layout-hint');
  hint.textContent = insufficient() ? 'Для этого макета нужно минимум ' + minimum[field('layout').value] + ' фото.' : '';
  canvas.classList.toggle('can-pan', photos.length > 0);
  hitAreas = [];
  canvas.height = Math.round(canvas.width / ratio);
  ctx.fillStyle = field('background').value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const layout = field('layout').value;
  const gap = Number(field('gap').value);
  cells(photos.length, layout).forEach(([x, y, w, h], index) => {
    const {bitmap, zoom, x: panX, y: panY} = photos[index];
    x = x * canvas.width + gap / 2;
    y = y * canvas.height + gap / 2;
    w = w * canvas.width - gap;
    h = h * canvas.height - gap;
    if (layout === 'polaroid') {
      ctx.fillStyle = '#fff';
      ctx.fillRect(x, y, w, h);
      x += 7; y += 7; w -= 14; h -= 24;
    }
    const scale = Math.max(w / bitmap.width, h / bitmap.height) * zoom;
    const imageW = bitmap.width * scale;
    const imageH = bitmap.height * scale;
    hitAreas.push({x, y, w, h, extraX: imageW - w, extraY: imageH - h});
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.drawImage(bitmap, x - (imageW - w) * panX, y - (imageH - h) * panY, imageW, imageH);
    ctx.restore();
  });
  download.disabled = transfer.disabled = busy || photos.length < 2 || insufficient();
  for (const name of [...crop, 'photo']) field(name).disabled = !photos.length;
  editor.querySelector('[data-history="-1"]').disabled = cursor <= 0;
  editor.querySelector('[data-history="1"]').disabled = cursor >= history.length - 1;
  editor.querySelector('[data-move="-1"]').disabled = selected === 0;
  editor.querySelector('[data-move="1"]').disabled = selected >= photos.length - 1;
}

async function decode(file, adjustment = {}) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 12 * 1024 * 1024) {
    throw new Error('Выберите JPG, PNG или WebP до 12 МБ на снимок.');
  }
  return {file, bitmap: await createImageBitmap(file, {resizeWidth: 1200}), zoom: 1, x: .5, y: .5, ...adjustment};
}

upload.addEventListener('change', async () => {
  const files = Array.from(upload.files);
  if (files.length < 2 || files.length > 6) {
    status.textContent = 'Выберите от двух до шести фотографий.';
    return;
  }
  status.textContent = 'Загружаем фотографии…';
  busy = upload.disabled = true;
  draw();
  try {
    const next = [];
    for (const file of files) next.push(await decode(file));
    photos = next;
    selected = 0;
    selectPhoto();
    record();
    status.textContent = 'Фотографии готовы к редактированию.';
  } catch (error) {
    status.textContent = error.message || 'Снимок не удалось открыть.';
  } finally {
    busy = upload.disabled = false;
    draw();
  }
});

field('photo').addEventListener('change', () => {
  selected = Number(field('photo').value);
  selectPhoto();
  draw();
});
for (const name of settings) {
  field(name).addEventListener('input', draw);
  field(name).addEventListener('change', record);
}
for (const name of crop) {
  field(name).addEventListener('input', () => {
    photos[selected][name] = Number(field(name).value);
    draw();
  });
  field(name).addEventListener('change', record);
}
editor.addEventListener('click', event => {
  const {move, history: direction} = event.target.dataset;
  if (move) {
    const next = selected + Number(move);
    [photos[selected], photos[next]] = [photos[next], photos[selected]];
    selected = next;
    selectPhoto();
    record();
  }
  if (direction) {
    cursor += Number(direction);
    const entry = history[cursor];
    photos = entry.photos.map(photo => ({...photo}));
    for (const name of settings) restoreSetting(name, entry.settings[name]);
    selectPhoto();
    draw();
  }
});

field('guides').addEventListener('change', draw);

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * canvas.width / rect.width,
    y: (event.clientY - rect.top) * canvas.height / rect.height
  };
}

canvas.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0 || busy) return;
  const point = canvasPoint(event);
  const index = hitAreas.findIndex(({x, y, w, h}) =>
    point.x >= x && point.x <= x + w && point.y >= y && point.y <= y + h);
  if (index < 0) return;
  selected = index;
  selectPhoto();
  const photo = photos[index];
  drag = {id: event.pointerId, point, photo, x: photo.x, y: photo.y, area: hitAreas[index]};
  canvas.setPointerCapture(event.pointerId);
  canvas.classList.add('is-panning');
  draw();
});

const clamp = value => Math.max(0, Math.min(1, value));
canvas.addEventListener('pointermove', event => {
  if (drag?.id !== event.pointerId) return;
  const point = canvasPoint(event);
  const {photo, area} = drag;
  if (area.extraX > 1) photo.x = clamp(drag.x - (point.x - drag.point.x) / area.extraX);
  if (area.extraY > 1) photo.y = clamp(drag.y - (point.y - drag.point.y) / area.extraY);
  selectPhoto();
  draw();
});

function endDrag(event) {
  if (drag?.id !== event.pointerId) return;
  const finished = drag;
  drag = null;
  canvas.classList.remove('is-panning');
  if (finished.x !== finished.photo.x || finished.y !== finished.photo.y) record();
}
for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) {
  canvas.addEventListener(event, endDrag);
}

function exportPNG() {
  return new Promise((resolve, reject) => canvas.toBlob(
    blob => blob ? resolve(blob) : reject(new Error('Не удалось подготовить PNG.')), 'image/png'));
}
download.addEventListener('click', async () => {
  try {
    const url = URL.createObjectURL(await exportPNG());
    const link = document.createElement('a');
    link.href = url;
    link.download = 'miglik-кoллаж.png';
    link.click();
    status.textContent = 'PNG подготовлен к скачиванию.';
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  } catch {
    status.textContent = 'Не удалось скачать коллаж. Попробуйте ещё раз.';
  }
});
transfer.addEventListener('click', async () => {
  busy = true;
  draw();
  try {
    const id = projectId || crypto.randomUUID();
    const project = {
      id,
      type: 'collage',
      version: 1,
      settings: Object.fromEntries(settings.map(name => [name, field(name).value])),
      photos: photos.map(({file, zoom, x, y}) => ({file, zoom, x, y})),
      preview: await exportPNG()
    };
    await projectStore('readwrite', store => store.put(project));
    const url = new URL(location.href);
    url.searchParams.set('project', id);
    window.history.replaceState(null, '', url);
    location.assign('/Mini-Brick-Studio/studio/?collage=' + encodeURIComponent(id));
  } catch {
    status.textContent = 'Не удалось сохранить коллаж в браузере. Скачивание PNG по-прежнему доступно.';
  } finally {
    busy = false;
    draw();
  }
});

record();
if (/^[\da-f-]{36}$/i.test(projectId || '')) {
  try {
    const project = await projectStore('readonly', store => store.get(projectId));
    if (project?.type !== 'collage') throw new Error();
    photos = await Promise.all(project.photos.map(({file, ...adjustment}) => decode(file, adjustment)));
    for (const name of settings) restoreSetting(name, project.settings[name]);
    selectPhoto();
    record();
  } catch {
    status.textContent = 'Коллаж недоступен в этом браузере. Можно создать новый.';
    projectId = null;
  }
}
