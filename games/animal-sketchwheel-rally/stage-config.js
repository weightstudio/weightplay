/* Game-owned Stage records only; the shared Play UI owns the presentation. */
(() => {
  "use strict";

  window.SKETCHWHEEL_STAGE_CONFIG = ({ t, levels, save, poster, challengeText }) => ({
    gameId: "animal-sketchwheel-rally",
    count: levels.length,
    poster,
    background: "/assets/lobby-block-atmosphere.svg",
    stage(index) {
      const level = levels[index];
      const locked = index >= save.unlocked;
      const cleared = save.cleared.includes(index);
      const chapterNames = t.chapterNames || window.SKETCHWHEEL_LOCALES.en.chapterNames;
      const chapterRules = t.chapterRules || window.SKETCHWHEEL_LOCALES.en.chapterRules;
      const terrainNames = t.terrainNames || window.SKETCHWHEEL_LOCALES.en.terrainNames;
      const best = save.best[index];
      const chapter = chapterNames[level.chapter];
      const rule = chapterRules[level.chapter];
      const challenge = challengeText(level);

      return {
        id: `race-${index + 1}`,
        kicker: `${t.chapter({ n: level.chapter + 1 })} · ${chapter}`,
        title: t.race({ n: index + 1 }),
        subtitle: rule,
        status: locked ? t.locked : best ? `${t.bestTime} ${best.toFixed(1)}s` : "",
        summary: challenge,
        details: [chapter, rule, challenge, level.terrain.map((type) => terrainNames[type]).join(" › ")],
        locked,
        cleared,
        poster,
      };
    },
  });
})();
