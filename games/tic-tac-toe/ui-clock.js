/* Pausable presentation timers; native callback bodies keep their original ownership. */
(() => {
  'use strict';
  if (window.WeightPlayTicUiClock) return;
  if (!window.WeightPlayLifecycle) throw new Error('TIC_SHARED_LIFECYCLE_REQUIRED');
  const timers = new Set();
  let active = false;
  const cancel = token => {
    if (!timers.delete(token)) return;
    token.generation++;
    if (token.handle !== null) window.clearTimeout(token.handle);
    token.handle = null;
  };
  const arm = token => {
    const generation = ++token.generation;
    token.startedAt = performance.now();
    token.handle = window.setTimeout(() => {
      if (!active || !timers.has(token) || generation !== token.generation) return;
      timers.delete(token); token.handle = null;
      token.callback();
    }, token.remaining);
  };
  const changeState = next => {
    if (active === next) return;
    active = next;
    const at = performance.now();
    for (const token of timers) {
      if (active) arm(token);
      else {
        token.remaining = Math.max(0, token.remaining - (at - token.startedAt));
        token.generation++;
        if (token.handle !== null) window.clearTimeout(token.handle);
        token.handle = null;
      }
    }
  };
  const lifecycle = window.WeightPlayLifecycle.register('tic-tac-toe', {
    background: 'pause', onStateChange: changeState,
  });
  lifecycle.setPaused('scene-away', true);
  window.addEventListener('pagehide', event => {
    if (event.persisted) return;
    changeState(false);
    for (const token of [...timers]) cancel(token);
    lifecycle.dispose();
  });
  window.WeightPlayTicUiClock = Object.freeze({
    setTimeout(callback, delay) {
      const token = {callback, remaining:Math.max(0, Number(delay) || 0), startedAt:0, handle:null, generation:0};
      timers.add(token); if (active) arm(token); return token;
    },
    clearTimeout: cancel,
    cancelAll() { for (const token of [...timers]) cancel(token); },
    setPaused(reason, paused) { return lifecycle.setPaused(reason, paused); },
    get active() { return active; },
    get pendingCount() { return timers.size; },
    get pauseReasons() { return lifecycle.pauseReasons; },
  });
})();
