(() => {
  "use strict";

  const boardSize = (stage) => stage <= 5 ? 5 : stage <= 10 ? 7 : stage <= 15 ? 8 : stage <= 25 ? 10 : 12;

  window.AnimalMosaicStageConfig = Object.freeze({
    create(getApi) {
      const game = window.BlockTrilogyConfig;
      const copy = (key, fallback, values = {}) => String(game.localeCopy?.[key] ?? fallback)
        .replace(/\{(\w+)\}/gu, (_, name) => String(values[name] ?? `{${name}}`));
      return {
        gameId: "animal-mosaic-clues",
        count: 30,
        background: "/assets/lobby-block-atmosphere.svg",
        poster: "/assets/animal-mosaic-clues/cover.webp",
        stage(index) {
          const api = getApi();
          const stage = index + 1;
          const chapter = api.chapters[api.chapterFor(stage)];
          const size = boardSize(stage);
          const locked = stage > api.save.unlocked;
          const cleared = Boolean(api.save.cleared[stage]);
          const status = locked
            ? copy("locked", "Locked")
            : cleared
              ? copy("cleared", "Cleared · Replay")
              : copy("ready", "Ready");
          const label = copy("stage", "Stage {n}", { n: stage });
          return {
            id: stage,
            kicker: chapter,
            title: label,
            subtitle: `${size}×${size}`,
            status,
            summary: `${chapter} · ${size}×${size}`,
            details: [game.guideIntro, game.objective, status],
            locked,
            cleared,
            poster: "/assets/animal-mosaic-clues/cover.webp",
            posterPosition: "center",
            rewardState: cleared ? "collected" : locked ? "not-collected" : "unknown",
          };
        },
      };
    },
  });
})();
