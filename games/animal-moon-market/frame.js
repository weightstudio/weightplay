/* Moon Market owns game content; the shared frame and Play UI own the shell. */
(() => {
  "use strict";

  window.mountAnimalMoonMarketFrame = function mountAnimalMoonMarketFrame(bridge) {
    const $ = (id) => document.getElementById(id);
    const root = $("gameFrame");
    const main = $("mainScreen");
    const stage = $("stageScreen");
    const battle = $("battleScreen");
    const mainHeader = main.querySelector(".main-header");
    const stageHeader = stage.querySelector(".stage-header");
    const battleHeader = battle.querySelector(".battle-header");
    const localeSelect = $("locale");

    if (!root || !main || !stage || !battle
        || !window.WeightPlayScreenFrame || !window.WeightPlayPlayUI) {
      throw new Error("MOON_MARKET_I9_FRAME_DEPENDENCY_MISSING");
    }

    const stageBack = stageHeader.querySelector('[data-wp-return="stage"]');
    const stageTitle = document.createElement("strong");
    stageTitle.hidden = true;
    stageTitle.dataset.wpFrameTitle = "";
    stageHeader.replaceChildren(stageBack, stageTitle);

    const battleBack = battleHeader.querySelector('[data-wp-return="battle"]');
    const battleTitle = document.createElement("strong");
    battleTitle.hidden = true;
    battleTitle.dataset.wpFrameTitle = "";
    battleHeader.replaceChildren(battleBack, battleTitle);
    const battleStats = ["shiftLabel", "roundLabel", "forecast"].map($);

    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: main.querySelector(".main-content") },
        stage: { root: stage, header: stageHeader, content: $("stageWorkspace") },
        battle: { root: battle, header: battleHeader, content: $("battleWorkspace") },
      },
    });

    const stageLabel = document.createElement("span");
    const stageProgress = document.createElement("strong");
    const stageInfo = window.WeightPlayScreenFrame.createGroup()
      .add(stageLabel)
      .add(stageProgress);
    const syncStageInfo = () => {
      const info = bridge.getStageInfo();
      stageLabel.textContent = info.label;
      stageProgress.textContent = info.progress;
    };
    frame.stageTopUI.add(stageInfo);

    if (battleStats.some((node) => !node)) {
      throw new Error("MOON_MARKET_BATTLE_STATS_MISSING");
    }
    const battleInfo = window.WeightPlayScreenFrame.createGroup();
    battleStats.forEach((node) => battleInfo.add(node));
    frame.battleTopUI.add(battleInfo);

    const stageUI = window.WeightPlayPlayUI.mountStage({
      page: $("stageWorkspace"),
      rail: $("stageGrid"),
      config: bridge.stageConfig,
      selected: bridge.getSelectedStage(),
      onSelect(index) {
        bridge.setSelectedStage(index);
        syncStageInfo();
      },
      onStart: (index) => bridge.startStage(index),
      isActive: () => frame.active === "stage",
    });

    const stageTab = $("stageTabButton");
    stageTab.dataset.wpFrameAction = "tab";
    stageTab.setAttribute("aria-pressed", "true");
    frame.commonDownButton.clear().add(stageTab);
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
