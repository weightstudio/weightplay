/* Habitat stage data only; WeightPlayPlayUI owns every card and gesture. */
(() => {
  'use strict';
  window.HabitatCountsStageConfig = (game) => ({
    gameId: 'animal-habitat-counts',
    count: game.stageCount,
    poster: '/games/animal-habitat-counts/assets/animal-habitat-counts-cover.svg',
    background: '/assets/lobby-block-atmosphere.svg',
    stage(index) {
      const stage = game.stageRecord(index);
      if (!stage) throw new RangeError(`Unknown Habitat Counts stage: ${index}`);
      return stage;
    },
  });
})();
