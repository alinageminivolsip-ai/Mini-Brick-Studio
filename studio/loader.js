/* Open the editor only after every shipped image and local font has loaded. */
(() => {
  const screen = document.getElementById('studioLoader');
  const app = document.querySelector('.app');
  const status = document.getElementById('loaderStatus');
  const track = screen.querySelector('.loader-track');
  const started = performance.now();
  let finishing = false;
  app.inert = true;
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const deadline = (promise, ms = 60000) => new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Asset loading timed out')), ms);
    Promise.resolve(promise).then(value => { clearTimeout(timer); resolve(value); }, error => { clearTimeout(timer); reject(error); });
  });
  const fail = message => {
    status.textContent = message;
    screen.querySelector('.loader-retry').hidden = false;
  };
  const watchdog = setTimeout(() => {
    if (!finishing) fail('Не удалось открыть конструктор. Попробуйте ещё раз.');
  }, 15000);
  const finish = () => {
    status.textContent = 'Всё готово. Ваша очередь создавать.';
    screen.classList.add('is-leaving');
    const remove = () => { if(screen.hidden) return; screen.hidden = true; app.inert = false; document.body.removeAttribute('aria-busy'); };
    screen.addEventListener('transitionend', remove, { once: true });
    setTimeout(remove, 300);
  };
  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => { image.onload = image.onerror = null; resolve(); };
      image.onerror = () => { image.onload = image.onerror = null; reject(new Error(src)); };
      image.src = src;
    });
  }
  async function decodeStable(image){
    for(let attempt=0;attempt<5;attempt++){
      const source=image.src;
      try{if(image.decode)await image.decode();if(image.src===source&&image.naturalWidth>0)return;}catch(error){if(image.src===source&&image.complete&&!image.naturalWidth)throw error;}
      await new Promise(resolve=>requestAnimationFrame(resolve));
    }
    if(image.complete&&image.naturalWidth>0)return;
    throw new Error('Visible image not ready');
  }
  window.miglickLoading = {
    async ready(catalog, assets = []) {
      if (finishing) return;
      finishing = true;
      clearTimeout(watchdog);
      try {
        status.textContent = 'Собираем каталог вашей истории';
        await deadline(catalog);
        const sources = [...new Set(assets)];
        const fonts = [
          ['Onest', '16px Onest', 'Ваша история'],
          ['Onest', '16px Onest', 'MIGLICK'],
          ['Unbounded', '16px Unbounded', 'Ваша история'],
          ['Unbounded', '16px Unbounded', 'MIGLICK']
        ];
        const tasks = [
          ...sources.map(src => () => loadImage(src)),
          ...fonts.map(([, font, text]) => () => document.fonts.load(font, text).then(result => { if (!result.length) throw new Error('Font unavailable'); }))
        ];
        let completed = 0, cursor = 0;
        const failed = [];
        track.classList.add('is-determinate');
        track.removeAttribute('aria-hidden');
        track.setAttribute('role', 'progressbar');
        track.setAttribute('aria-label', 'Загрузка каталога');
        track.setAttribute('aria-valuemin', '0');
        track.setAttribute('aria-valuemax', String(tasks.length));
        const update = () => {
          track.setAttribute('aria-valuenow', String(completed));
          track.firstElementChild.style.transform = `scaleX(${completed / tasks.length})`;
          status.textContent = `Загружаем детали: ${completed} из ${tasks.length}`;
        };
        update();
        // Limit concurrent requests and avoid retaining every decoded bitmap on phones.
        await Promise.all(Array.from({ length: Math.min(6, tasks.length) }, async () => {
          while (cursor < tasks.length && !failed.length) {
            const index = cursor++;
            try { await deadline(tasks[index]()); completed++; update(); }
            catch (error) { failed.push(error); }
          }
        }));
        if (failed.length) throw new Error('Some assets did not load');
        await deadline(document.fonts.ready);
        await new Promise(resolve => requestAnimationFrame(resolve));
        const visible = [...document.querySelectorAll('#constructorView img')].filter(img => img.getClientRects().length && getComputedStyle(img).display !== 'none' && img.getAttribute('src'));
        await deadline(Promise.all(visible.map(decodeStable)));
        await wait(Math.max(0, 1800 - (performance.now() - started)));
        finish();
      } catch (error) {
        fail('Не все детали загрузились. Проверьте соединение и попробуйте ещё раз.');
      }
    }
  };
})();
