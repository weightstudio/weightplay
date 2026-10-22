/* Game records and assets only; shared Play UI owns presentation and input. */
(() => {
  'use strict';
  window.HeroTrialsStageConfig = Object.freeze({
    create({ count, stage }) {
      return {
        gameId: 'animal-hero-trials', count, stage,
        poster: '/assets/interface7-redrawn/animal-hero-trials.webp',
        background: '/assets/lobby-block-atmosphere.svg',
      };
    },
  });
})();
