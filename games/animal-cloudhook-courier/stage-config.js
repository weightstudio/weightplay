/* Cloudhook stage records for the shared I9 Stage selector. */
(() => {
  "use strict";

  window.createCloudhookCourierStageConfig = function createCloudhookCourierStageConfig(bridge) {
    const posterPositions = [52, 65, 41, 57, 69, 47];
    return {
      count: bridge.count,
      poster: "/games/animal-cloudhook-courier/cover-block-v1.webp",
      background: "/games/animal-cloudhook-courier/battle-bg-block-v1.webp",
      stage(index) {
        const meta = bridge.stageMeta(index);
        const best = bridge.bestTime(index);
        const open = index < bridge.unlocked();
        const status = !open
          ? bridge.text("stageLocked")
          : best
            ? bridge.text("stageDone") + ": " + bridge.formatTime(best)
            : bridge.text("choose");
        return {
          id: index + 1,
          kicker: meta.arc || bridge.text("stage"),
          title: String(index + 1),
          subtitle: meta.title,
          status,
          summary: meta.objective,
          details: [meta.objective, meta.warning, meta.result, best ? status : ""].filter(Boolean),
          locked: !open,
          cleared: Boolean(best),
          poster: "/games/animal-cloudhook-courier/cover-block-v1.webp",
          posterPosition: "50% " + posterPositions[Math.floor(index / 5)] + "%",
        };
      },
    };
  };
})();
