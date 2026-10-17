/* Ring Garden owns localized Stage content and its authored artwork paths.
   Shared Play UI owns card markup, sizing, selection, and all gestures. */
(() => {
  "use strict";

  const game = () => window.AnimalRingGardenGame;
  window.AnimalRingGardenStageConfig = Object.freeze({
    get count() { return game()?.stageCount || 4; },
    poster: "/games/animal-ring-garden/assets/animal-ring-garden-cover.png",
    background: "/games/animal-ring-garden/assets/animal-ring-garden-background.png",
    stage(index) {
      const owner = game();
      if (!owner) throw new Error("RING_GARDEN_GAME_DATA_REQUIRED");
      return owner.stageRecord(index);
    },
  });
})();
