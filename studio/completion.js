/* Completion is a presentation layer over the existing renderer and checkout. */
const completionEl = id => document.getElementById(id);
const completionMoney = value => value.toLocaleString('ru-RU') + ' ₽';
let completionRendering = false, completionClosePending = false, completionClosing = false;
let completionRawImages = [], completionShareImages = new Map();
function completionBreakdown(items) {
  return items.reduce((sum, item) => {
    const total = calcOrderPrice(item.people, item.frame, !!item.frameBgData).total;
    const frameBase = calcOrderPrice([], item.frame, false).total;
    const figures = item.people.length * PRICING.personBase;
    sum.frames += frameBase; sum.figures += figures; sum.options += total - frameBase - figures; sum.total += total;
    return sum;
  }, { frames: 0, figures: 0, options: 0, total: 0 });
}
function completionOptionLabels(items) {
  const counts = { prints: 0, accessories: 0, outfits: 0, backgrounds: 0, notes: 0 };
  items.forEach(item => {
    if(item.frameBgData) counts.backgrounds++;
    item.people.forEach(person => {
      if(person.print) counts.prints++;
      if(person.rightAccessory || person.leftAccessory || getBoardAccessory(person) || getCenterAccessory(person)) counts.accessories++;
      if(getOutfitAccessory(person)) counts.outfits++;
      if(person.note?.trim()) counts.notes++;
    });
  });
  return [['Принты', counts.prints], ['Аксессуары', counts.accessories], ['Костюмы', counts.outfits], ['Свой фон', counts.backgrounds]].filter(([,count]) => count).map(([label,count]) => `${label}: ${count}`);
}
function renderCompletionSummary(items) {
  const breakdown = completionBreakdown(items);
  const options = completionOptionLabels(items);
  const specs = items.map((item, index) => {
    const definition = frames.find(value => value.id === item.frame);
    const color = item.frame.startsWith('black') ? 'Чёрная' : 'Белая';
    return `<div><dt>${items.length > 1 ? `Рамка ${index + 1}` : 'Размер и цвет'}</dt><dd>${escapeHTML(definition?.name || '')} см · ${color.toLowerCase()}</dd></div>`;
  });
  specs.push(`<div><dt>Фигурки</dt><dd>${items.reduce((sum,item) => sum + item.people.length, 0)}</dd></div>`);
  specs.push(`<div><dt>Дополнительные опции</dt><dd>${escapeHTML(options.join(' · ') || 'Без дополнительных опций')}</dd></div>`);
  const backgrounds = items.map(item => item.frameBgData ? 'Ваше изображение' : getFramePresetBackground(item.framePresetBg)?.name || 'Без фона');
  specs.push(`<div><dt>Фон</dt><dd>${escapeHTML([...new Set(backgrounds)].join(' · '))}</dd></div>`);
  completionEl('completionSpecs').innerHTML = specs.join('');
  completionEl('completionCaption').textContent = items.length > 1 ? 'Ваши будущие рамки' : 'Ваша будущая рамка';
  completionEl('completionProductTitle').textContent = items.length === 1 ? 'Рамка с вашей историей' : 'Рамки с вашей историей';
  const names = items.flatMap(item => item.people.map(person => person.name)).filter(Boolean);
  const inscriptions = items.flatMap(item => (item.frameTexts || []).map(text => text.content)).filter(Boolean);
  completionEl('completionPersonal').textContent = ['Ваши герои: ' + names.join(', '), inscriptions.length ? 'Надписи: ' + inscriptions.map(text => `«${text}»`).join(', ') : '', items.some(item => item.people.some(person => person.note?.trim())) ? 'Комментарии к героям включены в детали заказа.' : ''].filter(Boolean).join('\n');
  completionEl('completionPriceRows').innerHTML = [['Рамка' + (items.length > 1 ? ' ('+items.length+')' : ''), breakdown.frames], ['Фигурки', breakdown.figures], ['Дополнительные опции', breakdown.options]].map(([label,value]) => `<div><span>${label}</span><span>${completionMoney(value)}</span></div>`).join('');
  completionEl('priceValue').textContent = completionMoney(breakdown.total);
  completionEl('checkoutTotal').textContent = completionMoney(breakdown.total);
  completionEl('shareFrameLabel').hidden = items.length < 2;
  completionEl('shareFrameSelect').innerHTML = items.map((_,index) => `<option value="${index}">Рамка ${index + 1}</option>`).join('');
}
function setCompletionBusy(busy) {
  completionRendering = busy;
  completionEl('continueOrder').disabled = busy || !completionRawImages.length;
  completionEl('downloadOrderImg').disabled = busy || !completionRawImages.length;
}
function downloadCompletionFile(src, name) {
  const anchor = document.createElement('a'); anchor.href = src; anchor.download = name; anchor.click();
}
async function cropCompletionFrame(src, item) {
  const image = await loadImg(src);
  if(!image) throw new Error('Frame image unavailable');
  const definition = frames.find(value => value.id === item.frame);
  // Same source rectangle used by the unchanged social-card generator.
  const width = definition.m === 'square' ? 820 : definition.m === 'big' ? 720 : 660;
  const height = definition.m === 'square' ? 820 : definition.m === 'big' ? 1040 : 880;
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
  canvas.getContext('2d').drawImage(image, (1200-width)/2, 90, width, height, 0, 0, width, height);
  return canvas.toDataURL('image/png');
}
async function renderCompletionPreviews() {
  if(completionRendering || completionClosing) return;
  completionClosePending = false;
  completionRawImages = [];
  setCompletionBusy(true);
  completionEl('orderPreviewBox').setAttribute('aria-busy', 'true');
  completionEl('completionError').hidden = true;
  completionEl('orderLoader').hidden = false;
  completionEl('orderPreviewImg').hidden = true;
  completionEl('orderGallery').hidden = true;
  completionEl('completionLoadingText').textContent = 'Собираем вашу рамку';
  orderModal.classList.add('is-loading');
  try {
    await document.fonts.ready;
    const previews = [];
    for(const item of currentOrderFrames) {
      if(completionClosePending) return;
      const raw = await exportFrameImage(item);
      if(completionClosePending) return;
      completionRawImages.push(raw);
      previews.push(await cropCompletionFrame(raw, item));
    }
    if(currentOrderFrames.length === 1) {
      completionEl('orderPreviewImg').src = previews[0];
      await completionEl('orderPreviewImg').decode();
      completionEl('orderPreviewImg').hidden = false;
    } else {
      const gallery = completionEl('orderGallery'); gallery.innerHTML = '';
      previews.forEach((src,index) => {
        const figure = document.createElement('figure');
        figure.innerHTML = `<img src="${src}" alt="Ваша рамка ${index+1}"><figcaption>Рамка ${index+1}<button type="button" class="completion-download-frame">Скачать рамку</button></figcaption>`;
        figure.querySelector('button').onclick = () => downloadCompletionFile(completionRawImages[index], `miglick-frame-${index+1}.png`);
        gallery.appendChild(figure);
      });
      gallery.hidden = false;
    }
  } catch(error) {
    completionRawImages = [];
    completionEl('completionError').hidden = false;
    console.error('Completion preview failed:', error);
  } finally {
    orderModal.classList.remove('is-loading');
    completionEl('orderLoader').hidden = true;
    completionEl('orderPreviewBox').setAttribute('aria-busy','false');
    setCompletionBusy(false);
    if(completionClosePending) closeCompletionDialog();
  }
}
function showCompletionCheckout(show) {
  if(completionRendering) return;
  completionEl('orderReviewPanel').hidden = show;
  completionEl('orderReviewActions').hidden = show;
  completionEl('orderCheckoutPanel').hidden = !show;
  completionEl('orderCheckoutActions').hidden = !show;
  completionEl('completionBody').scrollTop = 0;
  if(show) { renderPaymentMethods(); orderTextarea.value = orderFullText(currentOrderFrames); completionEl('checkoutHeading').focus(); }
  else completionEl('continueOrder').focus();
}
function openCompletionDialog() {
  if(orderModal.classList.contains('open') || completionClosing) return;
  currentOrderFrames = JSON.parse(JSON.stringify(orderFrames()));
  completionShareImages = new Map();
  completionRawImages = [];
  renderCompletionSummary(currentOrderFrames);
  orderTextarea.value = orderFullText(currentOrderFrames);
  completionEl('shareExportStatus').textContent = '';
  completionEl('completionFooterStatus').textContent = '';
  completionEl('downloadOrderImg').textContent = 'Скачать карточку';
  completionEl('downloadOrderImg').hidden = false;
  completionEl('downloadReadyCard').hidden = true;
  completionEl('downloadReadyCard').removeAttribute('href');
  completionEl('copyOrderText').classList.remove('done');
  completionEl('orderReviewPanel').hidden = false;
  completionEl('orderReviewActions').hidden = false;
  completionEl('orderCheckoutPanel').hidden = true;
  completionEl('orderCheckoutActions').hidden = true;
  orderModal.classList.remove('is-closing');
  orderModal.classList.add('open');
  completionEl('completionBody').scrollTop = 0;
  return renderCompletionPreviews();
}
function closeCompletionDialog() {
  if(completionClosing) return;
  if(completionRendering) {
    completionClosePending = true;
    completionEl('completionFooterStatus').textContent = 'Возвращаемся к вашей рамке…';
    return;
  }
  completionClosePending = false;
  completionClosing = true;
  orderModal.classList.add('is-closing');
  const instant = matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('keyboard-mode');
  setTimeout(() => { orderModal.classList.remove('open','is-closing'); completionClosing=false; }, instant ? 0 : 200);
}
completionEl('continueOrder').onclick = () => showCompletionCheckout(true);
completionEl('backToReview').onclick = () => showCompletionCheckout(false);
completionEl('returnToEditor').onclick = closeCompletionDialog;
completionEl('orderClose').onclick = closeCompletionDialog;
completionEl('retryOrderPreview').onclick = renderCompletionPreviews;
orderModal.addEventListener('click',event => { if(event.target === orderModal) closeCompletionDialog(); });
completionEl('downloadOrderImg').onclick = async () => {
  if(completionRendering || !completionRawImages.length) return;
  const index = Number(completionEl('shareFrameSelect').value) || 0;
  setCompletionBusy(true);
  completionEl('downloadOrderImg').textContent = 'Готовим карточку…';
  completionEl('shareExportStatus').textContent = '';
  try {
    let src = completionShareImages.get(index);
    if(!src) { src = await exportShareImage(currentOrderFrames[index]); completionShareImages.set(index, src); }
    if(!completionClosePending) {
      const link = completionEl('downloadReadyCard');
      link.href = src; link.download = currentOrderFrames.length > 1 ? `miglick-story-${index+1}.png` : 'miglick-story.png';
      link.hidden = false; completionEl('downloadOrderImg').hidden = true; link.click();
    }
    completionEl('shareExportStatus').textContent = 'Карточка готова. Если файл не сохранился, нажмите «Скачать карточку» ещё раз.';
  } catch(error) { completionEl('shareExportStatus').textContent = 'Не получилось подготовить карточку. Попробуйте ещё раз.'; }
  finally { completionEl('downloadOrderImg').textContent = 'Скачать карточку'; setCompletionBusy(false); if(completionClosePending) closeCompletionDialog(); }
};

completionEl('shareFrameSelect').onchange = () => { completionEl('downloadReadyCard').hidden = true; completionEl('downloadOrderImg').hidden = false; completionEl('shareExportStatus').textContent = ''; };
