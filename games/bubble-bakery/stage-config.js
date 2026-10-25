(() => {
  "use strict";

  window.BubbleBakeryStageConfig = Object.freeze({
    create({ count, stage }) {
      if (!Number.isInteger(count) || count < 1 || typeof stage !== "function") {
        throw new TypeError("BUBBLE_BAKERY_STAGE_CONFIG_REQUIRED");
      }
      return Object.freeze({
        gameId: "bubble-bakery",
        count,
        poster: "/assets/bubble-bakery/cover-block-v1.png",
        background: "/assets/lobby-block-atmosphere.svg",
        stage,
      });
    },
  });
})();
