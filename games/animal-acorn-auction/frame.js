/* Acorn Auction supplies localized stage records and progress; shared I9
   frame and Play UI own every Main/Stage/Battle control and Stage gesture. */
(() => {
  "use strict";

  window.mountAnimalAcornAuctionFrame = function mountAnimalAcornAuctionFrame() {
    const $ = (id) => document.getElementById(id);
    const root = $("app");
    const main = $("mainScreen");
    const stage = $("stageScreen");
    const battle = $("battleScreen");
    const mainHeader = main.querySelector(".main-header");
    const stageHeader = stage.querySelector(".stage-header");
    const battleHeader = battle.querySelector(".battle-header");
    const localeSelect = $("localeSelect");
    const bridge = window.__ACORN_AUCTION_INTERFACE_BRIDGE__;

    if (!root || !bridge || !window.WeightPlayScreenFrame || !window.WeightPlayPlayUI) {
      throw new Error("ACORN_AUCTION_I9_FRAME_DEPENDENCY_MISSING");
    }

    const mainTitle = mainHeader.querySelector("[data-wp-game-title]");
    mainTitle.dataset.wpFrameTitle = "";
    $("mainPoster").dataset.wpFramePoster = "";
    main.querySelector(".main-summary").dataset.wpFrameSummary = "";
    $("best").dataset.wpFrameProgress = "";
    $("startBtn").dataset.wpFrameAction = "primary";

    const stageBack = stageHeader.querySelector('[data-wp-return="stage"]');
    const stageTitle = stageHeader.querySelector("[data-wp-frame-title]");
    stageTitle.hidden = true;
    stageHeader.replaceChildren(stageBack, stageTitle);

    const battleBack = battleHeader.querySelector('[data-wp-return="battle"]');
    const battleTitle = battleHeader.querySelector("[data-wp-frame-title]");
    battleTitle.hidden = true;
    battleHeader.replaceChildren(battleBack, battleTitle);

    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: $("mainContent") },
        stage: { root: stage, header: stageHeader, content: $("stageWorkspace") },
        battle: { root: battle, header: battleHeader, content: $("battleWorkspace") },
      },
    });

    const stageProgress = document.createElement("span");
    stageProgress.id = "stageProgress";
    stageProgress.setAttribute("role", "status");
    stageProgress.setAttribute("aria-live", "polite");
    frame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add(stageProgress));

    const battleGroup = window.WeightPlayScreenFrame.createGroup()
      .add($("roundTitle"))
      .add($("progressPill"));
    frame.battleTopUI.add(battleGroup);

    const stageNavigation = frame.commonDownButton.element;
    stageNavigation.dataset.wpFrameStageNav = "";
    stageNavigation.setAttribute("role", "tablist");
    stageNavigation.setAttribute("aria-label", bridge.getStageTabLabel());
    const stagesTab = document.createElement("button");
    stagesTab.type = "button";
    stagesTab.id = "stageNavigationTab";
    stagesTab.dataset.wpFrameAction = "tab";
    stagesTab.dataset.wpFrameStageSlot = "stages";
    stagesTab.dataset.i18n = "rounds";
    stagesTab.setAttribute("role", "tab");
    stagesTab.setAttribute("aria-selected", "true");
    stagesTab.setAttribute("aria-current", "page");
    stagesTab.setAttribute("aria-controls", "stageWorkspace");
    stagesTab.textContent = bridge.getStageTabLabel();
    frame.commonDownButton.clear().add(stagesTab);

    const poster = new URL("assets/animal-acorn-auction-cover.webp", location.href).href;
    const background = new URL("assets/animal-acorn-auction-background.png", location.href).href;
    const stageUI = window.WeightPlayPlayUI.mountStage({
      page: $("stageWorkspace"),
      rail: $("stageList"),
      config: bridge.getStageConfig({ poster, background }),
      selected: bridge.getState().roundIndex,
      onSelect: (index) => bridge.selectStage(index),
      onStart: (index) => bridge.startRound(index, true),
      isActive: () => frame.active === "stage",
    });

    window.__ACORN_AUCTION_FRAME__ = Object.freeze({ frame, stageUI, stageProgress });
    bridge.attachStageUI(stageUI);
    frame.activate("main");
    bridge.refreshStage();

    window.addEventListener("pagehide", (event) => {
      if (event.persisted) return;
      stageUI.destroy();
      frame.destroy();
    }, { once: true });
    return frame;
  };
})();
