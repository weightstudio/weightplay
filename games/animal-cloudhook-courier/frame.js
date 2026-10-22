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
    const mainTitle = mainHeader.querySelector("#title");
    const mainCopy = main.querySelector(".main-copy");
    const mainAnnouncement = main.querySelector("#coming");
    const mainTagline = main.querySelector("#tagline");
    const mainSummary = main.querySelector("#objective");
    const mainTitleGroup = mainTitle.parentElement;
    if (mainTitleGroup !== mainHeader) {
      mainTitleGroup.replaceWith(mainTitle);
      mainCopy.prepend(mainTitleGroup);
      mainTitleGroup.hidden = true;
    }
    const stageHeader = stage.querySelector("header");
    const battleHeader = battle.querySelector("header");
    const localeSelect = $("localeSelect");

    if (mainCopy && mainAnnouncement) mainCopy.prepend(mainAnnouncement);
    if (mainTagline) mainTagline.hidden = true;

    mainTitle.dataset.wpFrameTitle = "";
    main.querySelector(".poster").dataset.wpFramePoster = "";
    mainSummary.dataset.wpFrameSummary = "";
    $("mainProgress").dataset.wpFrameProgress = "";
    $("startBtn").dataset.wpFrameAction = "primary";

    const stageBack = $("stageBack");
    const stageTitle = $("stageTitle");
    stageBack.dataset.wpReturn = "stage";
    stageTitle.dataset.wpFrameTitle = "";
    stageHeader.replaceChildren(stageBack, stageTitle);
    const stageWorkspace = $("stageWorkspace");
    const stageRail = $("stageGrid");
    const stageSelector = $("stageSelector");
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
    const flightLayout = document.createElement("div");
    flightLayout.className = "battle-layout";
    for (const node of [...battle.children]) {
      if (node !== battleHeader && node !== result && node !== leave) flightLayout.append(node);
    }
    battleLive.append(flightLayout);
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
      page: stageSelector,
      rail: stageRail,
      config: window.createCloudhookCourierStageConfig(bridge),
      selected: bridge.getSelectedStage(),
      onSelect(index) {
        bridge.selectStage(index);
        syncStageInfo();
      },
      onStart: (index) => bridge.startStage(index, "stage_card"),
      isActive: () => frame.active === "stage" && !stageSelector.hidden,
    });

    stageTab.dataset.wpFrameAction = "tab";
    stageTab.setAttribute("aria-pressed", "true");
    const equipmentTab = $("equipmentTab");
    equipmentTab.dataset.wpFrameAction = "tab";
    frame.commonDownButton.clear().add(stageTab).add(equipmentTab);
    stageTab.parentElement.dataset.wpFrameStageNav = "";
    stageTab.style.gridColumn = "2";
    equipmentTab.style.gridColumn = "3";
    window.addEventListener("wonder:locale-change", syncStageInfo);

    const syncMainTitle = () => {
      const titles = window.WEIGHTPLAY_GAME_TITLES?.["animal-cloudhook-courier"];
      const locale = localeSelect.value || document.documentElement.lang || "en";
      mainTitle.textContent = titles?.[locale] || titles?.en || "Cloudhook Courier";
    };
    syncMainTitle();
    window.addEventListener("wonder:locale-change", syncMainTitle);

    const moveGuideIntoMain = () => {
      const guide = document.querySelector(".game-page-info");
      if (guide && !main.contains(guide)) main.append(guide);
    };
    moveGuideIntoMain();
    const guideObserver = new MutationObserver(moveGuideIntoMain);
    guideObserver.observe(document.body, { childList: true });
    window.addEventListener("wonder:locale-change", moveGuideIntoMain);

    frame.activate("main");
    window.addEventListener("pagehide", (event) => {
      if (event.persisted) return;
      guideObserver.disconnect();
      window.removeEventListener("wonder:locale-change", syncMainTitle);
      window.removeEventListener("wonder:locale-change", moveGuideIntoMain);
      window.removeEventListener("wonder:locale-change", syncStageInfo);
      stageUI.destroy();
      frame.destroy();
    }, { once: true });
    return Object.freeze({ frame, stageUI, syncStageInfo });
  };
})();
