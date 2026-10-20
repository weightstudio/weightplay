/* Game content adapter; the shared frame and Play UI own screen geometry. */
(() => {
  "use strict";

  window.mountAnimalSilhouetteScoutFrame = function mountAnimalSilhouetteScoutFrame() {
    const $ = (id) => document.getElementById(id);
    const root = $("app");
    const main = $("mainScreen");
    const stage = $("stageScreen");
    const battle = $("battleScreen");
    const mainHeader = main.querySelector(".main-header");
    const stageHeader = stage.querySelector(".stage-header");
    const battleHeader = battle.querySelector(".battle-header");

    $("mainPoster").dataset.wpFramePoster = "";
    $("mainSummary").dataset.wpFrameSummary = "";
    $("mainProgress").dataset.wpFrameProgress = "";
    $("startBtn").dataset.wpMainStart = "";

    const stageBack = stageHeader.querySelector('[data-wp-return="stage"]');
    const stageTitle = stageHeader.querySelector("[data-wp-frame-title]");
    stageHeader.replaceChildren(stageBack, stageTitle);

    const battleBack = battleHeader.querySelector('[data-wp-return="battle"]');
    const battleTitle = battleHeader.querySelector("[data-wp-frame-title]");
    const battleInfo = [...battleHeader.querySelector(".battle-hud").children];
    battleHeader.replaceChildren(battleBack, battleTitle);

    const stageTab = $("stageTabButton");
    stageTab.dataset.wpFrameAction = "tab";
    stageTab.setAttribute("role", "tab");
    stageTab.setAttribute("aria-selected", "true");

    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect: $("localeSelect"),
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: main.querySelector(".wp-standard-main-composition") },
        stage: { root: stage, header: stageHeader, content: $("stageWorkspace") },
        battle: { root: battle, header: battleHeader, content: $("battleWorkspace") },
      },
    });

    frame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add($("progress")));
    const battleGroup = window.WeightPlayScreenFrame.createGroup();
    battleInfo.forEach((node) => battleGroup.add(node));
    frame.battleTopUI.add(battleGroup);
    frame.commonDownButton.clear().add(stageTab);
    frame.activate("main");

    window.addEventListener("pagehide", (event) => {
      if (!event.persisted) frame.destroy();
    }, { once: true });
    return frame;
  };
})();
