/* A loading screen tied to real readiness, with bounded waits and a failure exit. */
(() => {
  const screen = document.getElementById('studioLoader');
  const app = document.querySelector('.app');
  const started = performance.now();
  let finishing = false;
  app.inert = true;
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const bounded = (promise, ms) => Promise.race([Promise.resolve(promise).catch(() => {}), wait(ms)]);
  const watchdog = setTimeout(() => {
    if (finishing) return;
    document.getElementById('loaderStatus').textContent = 'Не удалось открыть конструктор. Попробуйте ещё раз.';
    screen.querySelector('.loader-track').hidden = true;
    screen.querySelector('.loader-retry').hidden = false;
  }, 12000);
  const finish = () => {
    clearTimeout(watchdog);
    screen.classList.add('is-leaving');
    const remove = () => { screen.hidden = true; app.inert = false; document.body.removeAttribute('aria-busy'); };
    screen.addEventListener('transitionend', remove, { once: true });
    // Also release when motion is disabled or the browser suspends transitions.
    setTimeout(remove, 300);
  };
  window.miglickLoading = {
    async ready(catalog) {
      if (finishing) return;
      finishing = true;
      clearTimeout(watchdog);
      await bounded(catalog, 3000);
      await new Promise(resolve => requestAnimationFrame(resolve));
      const images = [...document.querySelectorAll('#constructorView img')].filter(img => img.getClientRects().length && getComputedStyle(img).display !== 'none' && img.getAttribute('src'));
      await bounded(Promise.all([
        document.fonts?.ready,
        ...images.map(img => img.decode ? img.decode().catch(() => {}) : Promise.resolve())
      ]), 1800);
      // Avoid a one-frame flash on a cached visit; no artificial percentage.
      await wait(Math.max(0, 620 - (performance.now() - started)));
      finish();
    }
  };
})();
