/* Game content adapter; shared I9 frame and Play UI own screen geometry. */
(() => {
  "use strict";

  window.mountAnimalCloudhookCourierFrame = function mountAnimalCloudhookCourierFrame(bridge) {
    const $ = (id) => document.getElementById(id);
    const root = $("app");
    const main = $("mainScreen");
    const stage = $("stageScreen");
    const battle = $("battleScreen");
    const mainHeader = main.querySelector("header");
    const stageHeader = stage.querySelector("header");
    const battleHeader = battle.querySelector("header");
    const localeSelect = $("localeSelect");

    mainHeader.querySelector("#title").dataset.wpFrameTitle = "";
    main.querySelector(".poster").dataset.wpFramePoster = "";
    main.querySelector("#tagline").dataset.wpFrameSummary = "";
    $("startBtn").dataset.wpFrameAction = "primary";

    const stageBack = $("stageBack");
    const stageTitle = $("stageTitle");
    stageBack.dataset.wpReturn = "stage";
    stageTitle.dataset.wpFrameTitle = "";
    stageHeader.replaceChildren(stageBack, stageTitle);
    const stageWorkspace = $("stageWorkspace");
    const stageRail = $("stageGrid");
    stageWorkspace.replaceChildren(stageRail);
    const stageTab = $("stageTab");
    stage.querySelector(".stage-tabs").dataset.wpFrameNav = "";

    const battleBack = $("battleBack");
    const battleTitle = $("battleTitle");
    battleTitle.dataset.wpFrameTitle = "";
    const battleInfoNodes = [$("scoreLabel"), $("timeLabel")];
    battleHeader.replaceChildren(battleBack, battleTitle);
    const result = $("resultScreen");
    const leave = $("leaveOverlay");
    const battleLive = document.createElement("div");
    battleLive.className = "battle-live";
    for (const node of [...battle.children]) {
      if (node !== battleHeader && node !== result && node !== leave) battleLive.append(node);
    }
    battle.append(battleLive);

    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: main.querySelector(".main-grid") },
        stage: { root: stage, header: stageHeader, content: stageWorkspace },
        battle: { root: battle, header: battleHeader, content: battleLive },
      },
    });

    const stageLabel = document.createElement("span");
    const stageProgress = document.createElement("span");
    frame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add(stageLabel).add(stageProgress));
    const syncStageInfo = () => {
      stageLabel.textContent = bridge.text("stage") + " " + (bridge.getSelectedStage() + 1);
      stageProgress.textContent = bridge.text("stages") + ": " + bridge.unlocked() + " / " + bridge.count;
    };
    const battleInfo = window.WeightPlayScreenFrame.createGroup()
      .add(battleInfoNodes[0])
      .add(battleInfoNodes[1]);
    frame.battleTopUI.add(battleInfo);

    const stageUI = window.WeightPlayPlayUI.mountStage({
      page: stageWorkspace,
      rail: stageRail,
      config: window.createCloudhookCourierStageConfig(bridge),
      selected: bridge.getSelectedStage(),
      onSelect(index) {
        bridge.selectStage(index);
        syncStageInfo();
      },
      onStart: (index) => bridge.startStage(index, "stage_card"),
      isActive: () => frame.active === "stage",
    });

    stageTab.dataset.wpFrameAction = "tab";
    stageTab.setAttribute("aria-pressed", "true");
    frame.commonDownButton.clear().add(stageTab);
    window.addEventListener("wonder:locale-change", syncStageInfo);
    document.addEventListener("DOMContentLoaded", () => {
      const guide = document.querySelector(".game-page-info");
      if (guide && !main.contains(guide)) main.append(guide);
    }, { once: true });

    frame.activate("main");
    window.addEventListener("pagehide", (event) => {
      if (event.persisted) return;
      stageUI.destroy();
      frame.destroy();
    }, { once: true });
    return Object.freeze({ frame, stageUI, syncStageInfo });
  };
})();
