/* Finite presentation tweens only. Never owns puzzle state, hit boxes or the
   shared Canvas transform. Every effect is replaceable and scene-cancellable. */
(function (root) {
  'use strict';
  function create({ document = root.document, media = root.matchMedia?.('(prefers-reduced-motion: reduce)') } = {}) {
    const active = new Map();
    let destroyed = false, epoch = 0;
    const allowed = () => !destroyed && !media?.matches && !document?.hidden;
    function cancel(node) {
      const animation = active.get(node);
      if (!animation) return;
      active.delete(node);
      try { animation.cancel(); } catch { /* A detached finished effect is inert. */ }
    }
    function clear() { epoch += 1; for (const node of [...active.keys()]) cancel(node); }
    function tween(node, frames, { duration = 200, delay = 0 } = {}) {
      if (!node) return null;
      cancel(node);
      if (!allowed() || !node.isConnected || typeof node.animate !== 'function') return null;
      let animation;
      try { animation = node.animate(frames, { duration, delay, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'none' }); }
      catch { return null; }
      active.set(node, animation);
      const ticket = epoch;
      const release = () => { if (ticket === epoch && active.get(node) === animation) active.delete(node); };
      // Cancellation rejects finished; both branches release bookkeeping only.
      // No callback writes scene state or reopens a screen.
      animation.finished.then(release, release);
      return animation;
    }
    function reveal(nodes) {
      [...nodes].forEach((node, i) => tween(node, [{ opacity: .35 }, { opacity: 1 }], { duration: 220, delay: Math.min(i, 8) * 18 }));
    }
    function pulse(nodes) {
      [...nodes].forEach((node, i) => tween(node, [{ opacity: .45 }, { opacity: 1 }], { duration: 210, delay: Math.min(i, 8) * 10 }));
    }
    function changed(nodes, direction = 1) {
      [...nodes].forEach((node, i) => tween(node, [{ opacity: .25, transform: `translateY(${direction * 7}px)` }, { opacity: 1, transform: 'translateY(0)' }], { duration: 200, delay: Math.min(i, 8) * 10 }));
    }
    function rotate(node) { tween(node, [{ transform: 'rotate(-90deg)', opacity: .6 }, { transform: 'rotate(0)', opacity: 1 }], { duration: 260 }); }
    media?.addEventListener?.('change', clear);
    return Object.freeze({ tween, reveal, pulse, changed, rotate, clear,
      get size() { return active.size; },
      destroy() { clear(); destroyed = true; media?.removeEventListener?.('change', clear); }
    });
  }
  const api = Object.freeze({ create });
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LayerGroveMotion = api;
})(typeof window === 'undefined' ? globalThis : window);
