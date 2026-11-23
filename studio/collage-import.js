import {projectStore} from '../miglik/site/tools/project-store.js';

const collagePage = '../miglik/tools/kollazh-iz-foto/';
const url = new URL(location.href);
let id = url.searchParams.get('collage');
const toolbar = document.createElement('div');
toolbar.className = 'studio-collage-tools';
const link = document.createElement('a');
link.className = 'btn ghost';
link.href = collagePage;
link.textContent = 'Помочь с оформлением · Коллаж';
toolbar.append(link);
const status = document.createElement('span');
status.setAttribute('role', 'status');
toolbar.append(status);
document.querySelector('.workspace')?.before(toolbar);
if (!toolbar.isConnected) document.body.append(toolbar);

function background(data, preset, scale) {
  frameBgData = data;
  framePresetBg = preset;
  frameBgScale = scale;
  draftStorage.setItem('mb_frame_bg', data);
  draftStorage.setItem('mb_frame_preset_bg', preset);
  draftStorage.setItem('mb_frame_bg_scale', scale);
  sync();
}

if (id && /^[\da-f-]{36}$/i.test(id)) {
  try {
    const project = await projectStore('readonly', store => store.get(id));
    if (project?.type !== 'collage' || project.preview?.type !== 'image/png') throw new Error();
    link.href = collagePage + '?project=' + encodeURIComponent(id);
    link.textContent = 'Редактировать коллаж';
    const data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(project.preview);
    });
    const apply = document.createElement('button');
    apply.type = 'button';
    apply.className = 'btn dark';
    apply.textContent = frameBgData || framePresetBg !== 'none' ? 'Заменить фон коллажем' : 'Применить коллаж';
    toolbar.append(apply);
    apply.onclick = () => {
      const previous = [frameBgData, framePresetBg, frameBgScale];
      background(data, 'none', '1');
      status.textContent = 'Коллаж установлен как фон рамки.';
      apply.remove();
      url.searchParams.delete('collage');
      history.replaceState(null, '', url);
      const undo = document.createElement('button');
      undo.type = 'button';
      undo.className = 'btn ghost';
      undo.textContent = 'Вернуть предыдущий фон';
      toolbar.append(undo);
      undo.onclick = () => {
        background(...previous);
        status.textContent = 'Предыдущий фон восстановлен.';
        undo.replaceWith(apply);
      };
    };
    if (!frameBgData && framePresetBg === 'none') apply.click();
  } catch {
    status.textContent = 'Коллаж недоступен в этом браузере.';
  }
}
