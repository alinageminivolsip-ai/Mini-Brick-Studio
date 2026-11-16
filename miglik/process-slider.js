// Native scrolling is the source of truth: swipe, trackpad, arrows and resizing agree.
const enhanced = new WeakSet();
export function setupSlider(track, controls, {label, unit}) {
  if (!track || !controls || enhanced.has(track)) return;
  enhanced.add(track);
  const previous = controls.querySelector('[data-process-prev]');
  const next = controls.querySelector('[data-process-next]');
  const status = controls.querySelector('output');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  const visibleCards = () => [...track.children].filter(card => !card.hidden);
  function measure() {
    frame = 0;
    const cards = visibleCards();
    const max = Math.max(0, track.scrollWidth - track.clientWidth);
    const overflow = max > 2 && cards.length > 1;
    controls.hidden = !overflow;
    track.tabIndex = overflow ? 0 : -1;
    track.setAttribute('aria-label', label);
    track.dataset.enhanced = '';
    const left = track.getBoundingClientRect().left;
    let active = 0;
    cards.forEach((card, i) => {
      if (Math.abs(card.getBoundingClientRect().left-left) < Math.abs(cards[active].getBoundingClientRect().left-left)) active = i;
    });
    cards.forEach((card, i) => card.classList.toggle('is-current', i === active));
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max - 2;
    // Several cards can be visible; describe the visible range rather than pretending only one exists.
    const shown = cards.map((card,i)=>({i,rect:card.getBoundingClientRect()})).filter(({rect})=>rect.left < left+track.clientWidth-8 && rect.right > left+8);
    const first = (shown[0]?.i ?? 0)+1, last = (shown.at(-1)?.i ?? 0)+1;
    status.value = `${unit} ${first===last ? first : first+'–'+last} из ${cards.length}`;
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(measure);}
  function move(delta){
    const cards=visibleCards();
    const left=track.getBoundingClientRect().left;
    const offsets=cards.map(card=>track.scrollLeft+card.getBoundingClientRect().left-left);
    const position=track.scrollLeft;
    const target=delta>0?offsets.find(x=>x>position+8):[...offsets].reverse().find(x=>x<position-8);
    track.scrollTo({left:Math.max(0,Math.min(track.scrollWidth-track.clientWidth,target??(delta>0?track.scrollWidth:0))),behavior:reduced.matches?'instant':'smooth'});
  }
  previous.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
  track.addEventListener('scroll',schedule,{passive:true});
  track.addEventListener('keydown',event=>{if(event.target!==track||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();if(event.key==='Home'||event.key==='End')track.scrollTo({left:event.key==='Home'?0:track.scrollWidth,behavior:reduced.matches?'instant':'smooth'});else move(event.key==='ArrowRight'?1:-1);});
  const resize=new ResizeObserver(schedule);resize.observe(track);
  const mutation=new MutationObserver(schedule);mutation.observe(track,{childList:true,subtree:true,attributeFilter:['hidden']});
  window.addEventListener('pageshow',schedule);
  window.addEventListener('pagehide',event=>{if(!event.persisted){resize.disconnect();mutation.disconnect();cancelAnimationFrame(frame);}});
  measure();
}
setupSlider(document.querySelector('#process-slides'),document.querySelector('#process .process-controls'),{label:'Шаги создания подарка',unit:'Шаг'});
setupSlider(document.querySelector('#occasion-slides'),document.querySelector('#occasion-controls'),{label:'Поводы для подарка',unit:'Повод'});
setupSlider(document.querySelector('#review-slides'),document.querySelector('#review-controls'),{label:'Отзывы покупателей',unit:'Отзыв'});
