(() => {
  "use strict";

  const current = document.currentScript?.src || new URL("game.js", location.href).href;
  const base = new URL("game-v4-base.js?v=20260922-interface7-compat", current).href;
  const compat = new URL("interface-7-compat.js?v=20260922-interface7-compat", current).href;
  const reviewFix = new URL("interface-7-review-fix.js?v=20260923-interface7-recheck", current).href;

  // Preserve the authored v4 script's parser-blocking execution order, then
  // apply the scoped Interface 7 compatibility layer and this review correction
  // before DOMContentLoaded.
  document.write('<script src="' + base + '"></scr' + 'ipt>');
  document.write('<script src="' + compat + '"></scr' + 'ipt>');
  document.write('<script src="' + reviewFix + '"></scr' + 'ipt>');
})();
