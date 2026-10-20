/* Cozy Camp supplies Stage records; the shared I9 Play UI owns every card and gesture. */
(() => {
  'use strict';
  window.AnimalCozyCampStageConfig = Object.freeze({
    gameId: 'animal-cozy-camp',
    get count() { return window.AnimalCozyCampI9?.stageCount || 30; },
    poster: '/games/animal-cozy-camp/assets/animal-cozy-camp-cover.png',
    background: '/assets/lobby-block-atmosphere.svg',
    stage(index) {
      const record = window.AnimalCozyCampI9?.stageRecord(index);
      if (!record) throw new RangeError(`Unknown Cozy Camp circle: ${index}`);
      return record;
    },
  });
})();
