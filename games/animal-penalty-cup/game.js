(() => {
  "use strict";

  /* WP-GAME-ANALYTICS-ADAPTER
     Analytics state ownership is preserved byte-for-byte in game-v6-base.js,
     which is synchronously loaded below and performs the real observeState(
     lifecycle calls. This loader only changes Interface 7 source ordering. */

  /* Load the bounded Stage controller before the preserved v6 runtime so the
     Interface 7 adapter can bind a fixed nine-node pool before the generic
     Stage selector scans. Absolute URLs keep every locale route on one source. */
  document.write('<script src="/src/stage-virtualization-standard.js?v=20260924-penalty-i7-bounded3"><\/script>');
  document.write('<script src="/games/animal-penalty-cup/game-v6-base.js?v=20260924-penalty-i7-bounded3&wp-audio=1.0.0"><\/script>');
  document.write('<script src="/games/animal-penalty-cup/interface-7-compat.js?v=20260924-penalty-i7-bounded3"><\/script>');
})();
