(() => {
  const current = document.currentScript;

  const cleanup = document.createElement('link');
  cleanup.rel = 'stylesheet';
  cleanup.href = 'interface-7-cleanup.css?v=20260924-interface7-cleanup2';
  document.head.append(cleanup);

  const compat = document.createElement('script');
  compat.src = 'interface-7-compat.js?v=20260924-interface7-cleanup2';
  compat.async = false;
  compat.addEventListener('load', () => {
    const runtime = document.createElement('script');
    runtime.src = '../../src/market-five-games.js?v=20260823-hoop-first-shot-calibration-v4';
    runtime.async = false;
    current.after(runtime);
  }, { once: true });
  current.after(compat);
})();
