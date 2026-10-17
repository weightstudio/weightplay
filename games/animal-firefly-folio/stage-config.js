/* Firefly Folio supplies localized page content and progress to shared I9 Stage. */
(() => {
  "use strict";

  window.createAnimalFireflyFolioStageConfig = function createAnimalFireflyFolioStageConfig({
    pages,
    state,
    t,
    pageTitle,
    pageNote,
  }) {
    const poster = "/games/animal-firefly-folio/assets/animal-firefly-folio-cover-voxel-v1.png";
    return {
      gameId: "animal-firefly-folio",
      poster,
      background: "/games/animal-firefly-folio/assets/animal-firefly-folio-background-voxel-v1.png",
      count: pages.length,
      stage(index) {
        const page = pages[index];
        const cleared = state.cleared.includes(index);
        const locked = index >= state.unlocked;
        return {
          id: index + 1,
          kicker: t("round", { n: index + 1, total: pages.length }),
          title: pageTitle(page, index),
          subtitle: page.checkpoint ? t("checkpoint") : "",
          status: cleared ? t("complete") : locked ? t("locked") : t("open"),
          summary: pageNote(page, index),
          details: [t("guideStep1"), t("guideStep2"), t("guideStep3")],
          locked,
          cleared,
          poster,
          posterPosition: "center",
        };
      },
    };
  };
})();
