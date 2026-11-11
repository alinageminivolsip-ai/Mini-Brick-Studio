import { icon } from './icons.js';
import { giftStudioURL } from './gift-photos.js';

const studioAssets = '/Mini-Brick-Studio/studio/assets/';
const template = togetherGift;

function figure(person, index, product, variant) {
  const { palette } = template;
  const colors = `--skin:${palette[15]};--torso:${palette[person.torso]};--legs:${palette[person.legs]};`;
  const number = index + 1;
  return `<a class="gift-preview-hero" href="${giftStudioURL(product.id, number, variant)}" data-native
      style="--position-x:${person.frameX}%;--position-y:${person.frameY}%;${colors}"
      aria-label="Настроить ${index ? 'правого' : 'левого'} героя в конструкторе">
    <span class="gift-preview-person" aria-hidden="true">
      <span class="gift-preview-skin"></span><span class="gift-preview-torso"></span>
      <span class="gift-preview-legs"></span><span class="gift-preview-arms"></span>
      <img class="gift-preview-shadow" src="${studioAssets}body/plastic-shadow.png" alt="">
      <img class="gift-preview-light" src="${studioAssets}body/plastic-light.png" alt="">
      <img src="${studioAssets}optimized/faces/${person.face}.webp" alt="">
      <img src="${studioAssets}hair/${person.hair}.png" alt="">
    </span><span class="gift-hero-marker" aria-hidden="true">${icon('edit')}</span>
  </a>`;
}

export function hasGiftPreview(id) {
  return id === template.id;
}

export function giftPreview(product, variant, frame) {
  const background = studioAssets + togetherBackgroundFor(template.sizes[variant.size]).replace('./assets/', '');
  return `<div class="gift-config-preview" data-gift-size="${variant.size}" data-gift-color="${variant.color}">
    <div class="gift-config-frame" style="--frame-ratio:${frame.width}/${frame.height};--frame-width:${Math.round(frame.width / 215 * 100)}%">
      <div class="gift-config-paper" style="background-image:url('${background}')">
        ${template.people.map((person, index) => figure(person, index, product, variant)).join('')}
      </div>
    </div>
    <p class="gift-config-caption">Предпросмотр шаблона · ${frame.width} × ${frame.height} мм</p>
  </div>`;
}
