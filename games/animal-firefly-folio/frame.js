/* Firefly Folio keeps page data and rules game-owned; shared frame and Stage UI
   own all common controls, card geometry, gestures, and selection feedback. */
(() => {
  "use strict";

  window.mountAnimalFireflyFolioFrame = function mountAnimalFireflyFolioFrame(bridge) {
    const $ = (id) => document.getElementById(id);
    const root = $("gameFrame");
    const main = $("mainScreen");
    const stage = $("stageScreen");
    const battle = $("battleScreen");
    const mainHeader = main.querySelector(".main-header");
    const stageHeader = stage.querySelector(".stage-header");
    const battleHeader = battle.querySelector(".battle-header");
    const localeSelect = $("localeSelect");
    const guide = root.querySelector("[data-wp-game-guide]");

    if (!root || !main || !stage || !battle || !guide
        || !window.WeightPlayScreenFrame || !window.WeightPlayPlayUI) {
      throw new Error("FIREFLY_FOLIO_I9_FRAME_DEPENDENCY_MISSING");
    }

    main.append(guide);
    const mainTitle = mainHeader.querySelector("[data-wp-game-title]");
    mainTitle.dataset.wpFrameTitle = "";
    main.querySelector(".cover").dataset.wpFramePoster = "";
    main.querySelector(".wp-standard-main-summary").dataset.wpFrameSummary = "";
    $("mainProgress").dataset.wpFrameProgress = "";
    $("startBtn").dataset.wpFrameAction = "primary";

    const stageBack = stageHeader.querySelector('[data-wp-return="stage"]');
    const stageFrameTitle = document.createElement("strong");
    stageFrameTitle.hidden = true;
    stageFrameTitle.dataset.wpFrameTitle = "";
    stageHeader.replaceChildren(stageBack, stageFrameTitle);
    const stageWorkspace = $("stageWorkspace");

    const battleBack = battleHeader.querySelector('[data-wp-return="battle"]');
    const battleInfoNodes = ["roundName", "roundLabel", "turnCount"].map($);
    if (battleInfoNodes.some((node) => !node)) {
      throw new Error("FIREFLY_FOLIO_BATTLE_STATS_MISSING");
    }
    const battleFrameTitle = document.createElement("strong");
    battleFrameTitle.hidden = true;
    battleFrameTitle.dataset.wpFrameTitle = "";
    battleHeader.replaceChildren(battleBack, battleFrameTitle);

    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: main.querySelector(".wp-standard-main-composition") },
        stage: { root: stage, header: stageHeader, content: stageWorkspace },
        battle: { root: battle, header: battleHeader, content: battle.querySelector(".battle-content") },
      },
    });

    const stageLabel = document.createElement("span");
    const stageProgress = document.createElement("span");
    const stageInfo = window.WeightPlayScreenFrame.createGroup().add(stageLabel).add(stageProgress);
    const syncStageInfo = () => {
      const info = bridge.getStageInfo();
      stageLabel.textContent = info.label;
      stageProgress.textContent = info.progress;
    };
    frame.stageTopUI.add(stageInfo);

    const battleInfo = window.WeightPlayScreenFrame.createGroup()
      .add(battleInfoNodes[0])
      .add(battleInfoNodes[1])
      .add(battleInfoNodes[2]);
    frame.battleTopUI.add(battleInfo);

    const stageUI = window.WeightPlayPlayUI.mountStage({
      page: stageWorkspace,
      rail: $("stageList"),
      config: window.createAnimalFireflyFolioStageConfig(bridge),
      selected: bridge.getSelectedStage(),
      onSelect(index) {
        bridge.setSelectedStage(index);
        syncStageInfo();
      },
      onStart: (index) => bridge.startPage(index),
      isActive: () => frame.active === "stage",
    });
    bridge.attachStageUI(stageUI);
    syncStageInfo();
    frame.activate("main");

    window.addEventListener("pagehide", (event) => {
      if (event.persisted) return;
      stageUI.destroy();
      frame.destroy();
    }, { once: true });

    return Object.freeze({ frame, stageUI, syncStageInfo });
  };
})();
