(() => {
  "use strict";

  /* Keep analytics and gameplay state in the established runtime. Shared I9
     assets are ordered before the game adapter and runtime on every locale. */
  document.write('<script src="/src/stage-rail-i9.js?v=20261017-shared-play-spacing1"><\/script>');
  document.write('<script src="/src/game-play-ui.js?v=20261017-shared-play-spacing1"><\/script>');
  document.write('<script src="/games/animal-penalty-cup/frame.js?v=20261017-penalty-i9"><\/script>');
  document.write('<script src="/games/animal-penalty-cup/game-v6-base.js?v=20261017-penalty-i9"><\/script>');
})();
