/* Habitat stage data only; WeightPlayPlayUI owns every card and gesture. */
(() => {
  'use strict';
  window.HabitatCountsStageConfig = (game) => ({
    gameId: 'animal-habitat-counts',
    count: game.stageCount,
    poster: '/assets/interface7-redrawn/animal-habitat-counts.webp',
    background: '/assets/lobby-block-atmosphere.svg',
    stage(index) {
      const stage = game.stageRecord(index);
      if (!stage) throw new RangeError(`Unknown Habitat Counts stage: ${index}`);
      return stage;
    },
  });
})();
