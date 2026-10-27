/* Cloudhook stage records for the shared I9 Stage selector. */
(() => {
  "use strict";

  window.createCloudhookCourierStageConfig = function createCloudhookCourierStageConfig(bridge) {
    const posterPositions = [52, 65, 41, 57, 69, 47];
    return {
      count: bridge.count,
      poster: "/assets/interface7-redrawn/animal-cloudhook-courier.webp",
      background: "/assets/lobby-block-atmosphere.svg",
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
          poster: "/assets/interface7-redrawn/animal-cloudhook-courier.webp",
          posterPosition: "50% " + posterPositions[Math.floor(index / 5) % posterPositions.length] + "%",
        };
      },
    };
  };
})();
