/* Cafe Rush supplies stage records; shared Play UI owns presentation/input. */
(() => {
  'use strict';
  window.AnimalCafeRushStageConfig = Object.freeze({
    create({ count, stage }) {
      return {
        gameId: 'animal-cafe-rush',
        count,
        stage,
        poster: '/assets/animal-cafe-rush-cover.webp',
        background: '/assets/lobby-block-atmosphere.svg',
      };
    },
  });
})();
