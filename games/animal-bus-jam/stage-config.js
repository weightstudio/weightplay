/* Stage records only; shared Play UI owns cards, geometry and gestures. */
(() => {
  "use strict";

  window.BUS_JAM_STAGE_CONFIG = ({ t, levels, progress, best, isPractice = () => false }) => {
    const poster = "/assets/interface7-redrawn/animal-bus-jam.webp";
    return {
      gameId: "animal-bus-jam",
      count: levels.length,
      poster,
      background: "/assets/lobby-block-atmosphere.svg",
      stage(index) {
        const level = levels[index];
        const locked = index > 0 && !progress[index - 1] && !(index >= 30 && isPractice());
        const cleared = Boolean(progress[index]);
        const meta = t("stageMeta", { buses: level.buses.length, bay: level.baySize });
        const status = locked
          ? t("locked")
          : best[index]
            ? t("masteryBest", best[index])
            : cleared
              ? t("complete")
              : "";
        return {
          id: `stop-${index + 1}`,
          kicker: t("chapter", { n: index >= 30 ? 2 : level.chapter + 1 }),
          title: t("stop", { n: index + 1 }),
          subtitle: meta,
          status,
          summary: t("guideBody"),
          details: [meta, t("masteryGuide")],
          locked,
          cleared,
          poster,
        };
      },
    };
  };
})();
