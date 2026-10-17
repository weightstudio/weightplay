(() => {
  "use strict";

  window.SunbeamGardenStageConfig = Object.freeze({
    create(api) {
      const levels = window.SUNBEAM_LEVELS.levels;
      const copy = (key, values = {}) => api.copy(key, values);
      return {
        gameId: "animal-sunbeam-garden",
        count: levels.length,
        poster: "/assets/interface7-redrawn/animal-sunbeam-garden.webp",
        background: "/assets/animal-sunbeam-garden-scenery-block-v14.webp",
        stage(index) {
          const number = index + 1;
          const chapter = Math.floor(index / 5) + 1;
          const locked = number > api.unlocked;
          const cleared = number < api.unlocked;
          const chapterLabel = copy("chapter", { n: chapter });
          const title = copy("garden", { n: number });
          return {
            id: number,
            kicker: chapterLabel,
            title,
            subtitle: copy("chapterArc" + chapter),
            status: locked ? copy("locked") : cleared ? copy("complete") : copy("open"),
            summary: chapterLabel + " · " + title,
            details: [copy("guideTitle"), copy("guideBody")],
            locked,
            cleared,
            poster: "/assets/interface7-redrawn/animal-sunbeam-garden.webp",
            posterPosition: "center",
          };
        },
      };
    },
  });
})();
