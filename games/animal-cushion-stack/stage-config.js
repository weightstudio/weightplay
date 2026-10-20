/* Stage records for the shared Interface 9 Play UI. */
(() => {
  'use strict';
  window.AnimalCushionStackStageConfig = Object.freeze({
    gameId: 'animal-cushion-stack',
    get count() { return window.AnimalCushionStackI9?.stageCount || 30; },
    poster: '/games/animal-cushion-stack/assets/animal-cushion-stack-cover-v2.png',
    background: '/assets/lobby-block-atmosphere.svg',
    stage(index) {
      const record = window.AnimalCushionStackI9?.stageRecord(index);
      if (!record) throw new RangeError(`Unknown Cushion Stack stage: ${index}`);
      return record;
    },
  });
})();
