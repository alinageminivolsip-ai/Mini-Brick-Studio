function setupSlider(track, controls, {label, unit, breakpoint = '(max-width: 767px)'}) {
  if (!track || !controls) return;
  const cards = [...track.children];
  const previous = controls.querySelector('[data-process-prev]');
  const next = controls.querySelector('[data-process-next]');
  const status = controls.querySelector('output');
  const mobile = matchMedia(breakpoint);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let frame = 0;
  let requested = null;

  function show(index) {
    active = index;
    cards.forEach((card, i) => card.classList.toggle('is-current', i === index));
    previous.disabled = index === 0;
    next.disabled = index === cards.length - 1;
    status.value = `${unit} ${index + 1} из ${cards.length}`;
  }

  function measure() {
    frame = 0;
    const left = track.getBoundingClientRect().left;
    const nearest = cards.reduce((best, card, i) =>
      Math.abs(card.getBoundingClientRect().left - left) <
      Math.abs(cards[best].getBoundingClientRect().left - left) ? i : best, 0);
    if (nearest === requested) requested = null;
    if (nearest !== active) show(nearest);
  }

  function schedule() {
    if (mobile.matches && !frame) frame = requestAnimationFrame(measure);
  }

  function move(delta) {
    const index = Math.max(0, Math.min(cards.length - 1, (requested ?? active) + delta));
    requested = index;
    const left = cards[index].getBoundingClientRect().left - track.getBoundingClientRect().left;
    track.scrollTo({left: track.scrollLeft + left, behavior: reduced.matches ? 'instant' : 'smooth'});
  }

  function updateLayout() {
    controls.hidden = !mobile.matches;
    requested = null;
    if (mobile.matches) {
      track.tabIndex = 0;
      track.setAttribute('aria-label', label);
      track.dataset.enhanced = '';
      schedule();
    } else {
      track.removeAttribute('tabindex');
      track.removeAttribute('aria-label');
      delete track.dataset.enhanced;
    }
  }

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', schedule, {passive:true});
  track.addEventListener('pointerdown', () => { requested = null; }, {passive:true});
  track.addEventListener('keydown', event => {
    if (!mobile.matches || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  });
  mobile.addEventListener('change', updateLayout);
  show(0);
  updateLayout();
}

setupSlider(document.querySelector('#process-slides'), document.querySelector('#process .process-controls'), {
  label: 'Пять шагов создания подарка', unit: 'Шаг'
});
setupSlider(document.querySelector('#occasion-slides'), document.querySelector('#occasion-controls'), {
  label: 'Поводы для подарка', unit: 'Повод'
});

setupSlider(document.querySelector('#review-slides'), document.querySelector('#review-controls'), {
  label: 'Отзывы покупателей', unit: 'Отзыв', breakpoint: '(min-width: 0px)'
});
