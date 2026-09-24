(() => {
  const current = document.currentScript;

  const cleanup = document.createElement('link');
  cleanup.rel = 'stylesheet';
  cleanup.href = 'interface-7-cleanup.css?v=20260924-interface7-cleanup3';
  document.head.append(cleanup);

  // The shared frame already owns Stage/Battle chrome and bootstraps the
  // repository Stage selector. Keep this game loader content-only: install the
  // Habitat Atlas lifecycle compatibility layer, then start the unchanged
  // Market Five gameplay runtime.
  const compat = document.createElement('script');
  compat.src = 'interface-7-compat.js?v=20260924-interface7-cleanup3';
  compat.async = false;
  compat.addEventListener('load', () => {
    const runtime = document.createElement('script');
    runtime.src = '../../src/market-five-games.js?v=20260831-habitat-atlas-focus-v8';
    runtime.async = false;
    current.after(runtime);
  }, { once: true });
  current.after(compat);
})();
