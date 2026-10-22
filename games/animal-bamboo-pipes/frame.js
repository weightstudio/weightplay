/* Game-owned content plugs into the shared Interface 9 frame and Play UI. */
(() => {
  "use strict";

  let binding;
  window.mountBambooFrame = function mountBambooFrame(bridge) {
    if (binding) return binding;
    const $ = (id) => document.getElementById(id);
    const root = $("gameFrame");
    const main = $("main");
    const stage = $("stage");
    const battle = $("battle");
    const stageWorkspace = $("stageWorkspace");
    const stageGrid = $("rail");
    const mainHeader = main.querySelector(".main-header");
    const stageHeader = stage.querySelector(".stage-header");
    const battleHeader = battle.querySelector(".battle-header");
    const localeSelect = $("locale");

    if (!root || !stageWorkspace || !stageGrid || !window.WeightPlayScreenFrame
        || !window.WeightPlayPlayUI || !window.WeightPlayStageRailI9) {
      throw new Error("BAMBOO_I9_FRAME_DEPENDENCY_MISSING");
    }

    const guide = $("publicGuide");
    root.after(guide);
    const mainContent = main.querySelector(".hero");
    const copy = mainContent.querySelector(":scope > div");
    mainContent.className = "bamboo-main-content";
    const poster = mainContent.querySelector("img");
    poster.dataset.wpFramePoster = "";
    poster.classList.add("main-poster");
    copy.dataset.wpFrameCopy = "";
    copy.querySelector('[data-bamboo-t="summary"]').dataset.wpFrameSummary = "";
    copy.querySelector("h1").hidden = true;
    copy.querySelector(".eyebrow").hidden = true;
    mainHeader.querySelector("strong").dataset.wpFrameTitle = "";

    const stageBack = stageHeader.querySelector('[data-wp-return="stage"]');
    const stageTitle = document.createElement("strong");
    stageTitle.hidden = true;
    stageTitle.dataset.wpFrameTitle = "";
    stageHeader.replaceChildren(stageBack, stageTitle);

    const battleBack = battleHeader.querySelector('[data-wp-return="battle"]');
    const battleStats = [$("chapter"), $("stageName"), $("moves")];
    const battleTitle = document.createElement("strong");
    battleTitle.hidden = true;
    battleTitle.dataset.wpFrameTitle = "";
    battleHeader.replaceChildren(battleBack, battleTitle);

    const battleContent = battle.querySelector(".battle-panel");
    const boardSpace = document.createElement("div");
    boardSpace.className = "bamboo-board-space";
    $("board").before(boardSpace);
    boardSpace.append($("board"));
    for (const id of ["start", "undo", "hint", "restart", "next", "retry", "resultStages", "continueBattle", "leaveBattle"]) {
      $(id).dataset.wpFrameAction = id === "start" || id === "next" || id === "continueBattle" ? "primary" : "secondary";
    }

    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: {root: main, header: mainHeader, content: mainContent},
        stage: {root: stage, header: stageHeader, content: stageWorkspace},
        battle: {root: battle, header: battleHeader, content: battleContent},
      },
    });

    const stageLabel = document.createElement("span");
    const stageProgress = document.createElement("strong");
    const stageInfo = window.WeightPlayScreenFrame.createGroup().add(stageLabel).add(stageProgress);
    const syncStageInfo = () => {
      const info = bridge.getStageInfo();
      stageLabel.textContent = info.label;
      stageProgress.textContent = info.progress;
    };
    frame.stageTopUI.add(stageInfo);

    const battleInfo = window.WeightPlayScreenFrame.createGroup();
    battleStats.forEach((node) => {
      if (!node) throw new Error("BAMBOO_BATTLE_INFO_NODE_MISSING");
      battleInfo.add(node);
    });
    frame.battleTopUI.add(battleInfo);

    const stageUI = window.WeightPlayPlayUI.mountStage({
      page: stageWorkspace,
      rail: stageGrid,
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
    stageTab.setAttribute("aria-selected", "true");
    frame.commonDownButton.clear().add(stageTab);
    syncStageInfo();

    const activate = (scene, options = {}) => {
      guide.hidden = scene !== "main";
      frame.activate(scene, options);
      if (scene === "stage") {
        stageUI.refresh(bridge.getSelectedStage());
        syncStageInfo();
      }
    };
    const abort = new AbortController();
    const tutorialOpen = (event) => {
      if (event.detail?.gameId === "animal-bamboo-pipes") document.body.dataset.wpFrameTutorial = "true";
    };
    const tutorialClose = (event) => {
      if (event.detail?.gameId === "animal-bamboo-pipes") document.body.removeAttribute("data-wp-frame-tutorial");
    };
    window.addEventListener("weightplay:tutorial-open", tutorialOpen, {signal: abort.signal});
    window.addEventListener("weightplay:tutorial-close", tutorialClose, {signal: abort.signal});
    if (document.querySelector('.wp-tutorial-backdrop[data-game-id="animal-bamboo-pipes"]')) tutorialOpen({detail:{gameId:"animal-bamboo-pipes"}});
    binding = Object.freeze({frame, stageUI, activate, syncStageInfo, destroy() {
      abort.abort();
      stageUI.destroy();
      frame.destroy();
      binding = null;
    }});
    window.addEventListener("pagehide", (event) => {
      if (!event.persisted) binding?.destroy();
    }, {signal: abort.signal});

    activate("main");
    return binding;
  };
})();
