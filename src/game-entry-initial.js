/* Shared recovery for generated initial entry markup. No game IDs, progress
   simulation, timers or gameplay state; only pages carrying that markup opt in. */
(() => {
  if (!document.documentElement.hasAttribute('data-wp-entry-initial')) return;
  const gameId = location.pathname.match(/\/games\/([^/]+)/)?.[1];
  let failed = false;
  const showFailure = () => {
    const root = document.querySelector('[data-wp-entry-static]');
    if (!root?.querySelector('[data-wp-entry-retry]')) return;
    root.dataset.state = 'error';
    root.setAttribute('aria-busy', 'false');
    root.querySelector('.wp-game-entry-loader-title').textContent = root.dataset.errorTitle;
    const status = root.querySelector('.wp-game-entry-loader-status');
    status.textContent = root.dataset.errorMessage;
    status.hidden = false;
    root.querySelector('.wp-game-entry-loader-track').hidden = true;
    root.querySelector('[data-wp-entry-retry]').hidden = false;
  };
  window.addEventListener('error', event => {
    if (!document.documentElement.hasAttribute('data-wp-game-entry-loader-active')) return;
    const node = event.target;
    if (!(node instanceof HTMLScriptElement || node instanceof HTMLLinkElement)) return;
    const url = node.src || node.href || '';
    // A stylesheet with an applied sheet can report an error for an optional
    // @import (e.g. a blocked font host). Its local rules are already usable.
    if (node instanceof HTMLLinkElement && node.rel === 'stylesheet' && node.sheet) return;
    if (node.getAttribute?.('data-wp-entry-optional') === 'diamond-special' &&
        document.querySelector('meta[name="weightplay-diamond-special"][content="1"]') &&
        [`/games/${gameId}/diamond-special.js?wp-media=ce7525cf45c7a0b6`, '/src/diamond-special-progression.js?wp-media=ce7525cf45c7a0b6', '/src/diamond-special-progression.css?wp-media=ce7525cf45c7a0b6'].includes(new URL(url, location.origin).pathname)) return;
    if (!node.hasAttribute('data-wp-entry-required') && !url.includes(`/games/${gameId}/`)) return;
    failed = true;
    window.__weightPlayGameEntryPendingFailure = gameId;
    if (window.WeightPlayGameEntryLoader?.isActive) window.WeightPlayGameEntryLoader.fail();
    else showFailure();
  }, true);
  const observer = new MutationObserver(() => {
    if (failed) showFailure();
    if (document.querySelector('[data-wp-entry-retry]')) observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
