/* River Gates supplies content and grouped information; shared I9 owns all
   Main, Stage and Battle controls, layout, Stage cards, and swipe behavior. */
(() => {
  "use strict";

  window.mountAnimalRiverGatesFrame = function mountAnimalRiverGatesFrame() {
    const $ = (id) => document.getElementById(id);
    const root = $("app");
    const main = $("mainScreen");
    const stage = $("stageScreen");
    const battle = $("battleScreen");
    const mainHeader = main.querySelector(".main-header");
    const stageHeader = stage.querySelector(".stage-header");
    const battleHeader = battle.querySelector(".battle-header");
    // Keep the Stage-owned shop outside mountStage's inert legacy-source bin.
    stage.appendChild($("stationDialog"));
    const localeSelect = $("localeSelect");

    mainHeader.querySelector("[data-wp-game-title]").dataset.wpFrameTitle = "";
    main.querySelector("#mainPoster").dataset.wpFramePoster = "";
    main.querySelector(".main-summary").dataset.wpFrameSummary = "";
    main.querySelector("#mainProgress").dataset.wpFrameProgress = "";
    $("startBtn").dataset.wpFrameAction = "primary";

    const stageBack = stageHeader.querySelector('[data-wp-return="stage"]');
    const stageTitle = stageHeader.querySelector("[data-wp-frame-title]");
    stageTitle.hidden = true;
    stageHeader.replaceChildren(stageBack, stageTitle);

    const battleBack = battleHeader.querySelector('[data-wp-return="battle"]');
    const battleTitle = battleHeader.querySelector("[data-wp-frame-title]");
    battleTitle.hidden = true;
    battleHeader.replaceChildren(battleBack, battleTitle);

    const stageTab = $("stageTabButton");
    stageTab.dataset.wpFrameAction = "tab";
    stageTab.setAttribute("role", "tab");
    stageTab.setAttribute("aria-selected", "true");
    stageTab.setAttribute("aria-current", "page");

    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: main.querySelector(".wp-standard-main-composition") },
        stage: { root: stage, header: stageHeader, content: $("stageWorkspace") },
        battle: { root: battle, header: battleHeader, content: $("battleWorkspace") },
      },
    });

    frame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add($("progress")));

    const battleGroup = window.WeightPlayScreenFrame.createGroup()
      .add($("progressPill"))
      .add($("battleTideStat"));
    frame.battleTopUI.add(battleGroup);

    const stationTab = $("stationBtn");
    stationTab.dataset.wpFrameAction = "tab";
    stationTab.setAttribute("role", "tab");
    stationTab.setAttribute("aria-selected", "false");
    frame.commonDownButton.clear().add(stageTab).add(stationTab);
    frame.activate("main");
    window.addEventListener("pagehide", (event) => {
      if (!event.persisted) frame.destroy();
    });
    return frame;
  };
})();
