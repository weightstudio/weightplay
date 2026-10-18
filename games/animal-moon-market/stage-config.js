/* Moon Market supplies localized stage content to the shared I9 rail. */
(() => {
  "use strict";

  window.createAnimalMoonMarketStageConfig = function createAnimalMoonMarketStageConfig({
    stages,
    state,
    t,
    ruleText,
  }) {
    const poster = "/assets/interface7-redrawn/animal-moon-market.webp";
    return {
      gameId: "animal-moon-market",
      poster,
      background: "/games/animal-moon-market/assets/animal-moon-market-night-market-v1.png",
      count: stages.length,
      stage(index) {
        const stage = stages[index];
        const chapter = Math.floor(index / 5);
        const chapterNames = t("chapterNames");
        const locked = index >= state.unlocked;
        const cleared = state.cleared.has(index);
        const rounds = stage.rounds.map((round, roundIndex) => {
          const demand = round.demand.map((good) => t(good)).join(" + ");
          return t("round") + " " + (roundIndex + 1) + ": " + demand + ". " + ruleText(round);
        });
        return {
          id: index + 1,
          kicker: t("chapter") + " " + (chapter + 1) + " · " + chapterNames[chapter],
          title: t("stage") + " " + (index + 1),
          subtitle: stage.rounds.length + " " + t("round"),
          status: locked ? t("locked") : cleared ? t("cleared") : "",
          summary: rounds[0] || "",
          details: rounds,
          locked,
          cleared,
          poster,
          posterPosition: "center",
        };
      },
    };
  };
})();
