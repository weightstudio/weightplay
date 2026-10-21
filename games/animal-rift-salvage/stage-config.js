/* Game-owned zone facts; the shared I9 Play UI owns card structure and input. */
(() => {
  "use strict";

  window.AnimalRiftSalvageStageConfig = Object.freeze({
    create(bridge) {
      return {
        count: bridge.zones.length,
        poster: "/assets/animal-rift-salvage/cover.webp",
        background: "/assets/lobby-block-atmosphere.svg",
        stage(index) {
          const zone = bridge.zones[index];
          const number = zone.index + 1;
          const locked = number > bridge.unlocked;
          const best = Number(bridge.best[zone.index] || 0);
          const target = bridge.text("target", { n: zone.quota });
          return {
            id: number,
            kicker: zone.name,
            title: bridge.text("zone", { n: number }),
            subtitle: zone.rule,
            status: locked
              ? bridge.text("locked")
              : best
                ? bridge.text("best", { n: best.toFixed(1) })
                : target,
            summary: [zone.rule, target].filter(Boolean).join(" · "),
            details: [zone.rule, target],
            locked,
            cleared: Number(bridge.medals[zone.index] || 0) > 0,
            poster: "/assets/animal-rift-salvage/cover.webp",
          };
        },
      };
    },
  });
})();
