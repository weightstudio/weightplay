/* Game-owned data and callbacks bind to the shared I9 screen and Stage UI. */
(() => {
  "use strict";

  window.mountSketchwheelFrame = () => {
    const $ = (id) => document.getElementById(id);
    const root = $("gameFrame");
    const main = $("mainGroup");
    const stage = $("stageScreen").querySelector(".stage-canvas");
    const battle = $("battleScreen").querySelector(".battle-canvas");
    const game = window.SKETCHWHEEL_I9;
    const core = window.WeightPlayScreenFrame;
    const playUI = window.WeightPlayPlayUI;
    if (!root || root.dataset.wpFrame || !game || !core || !playUI) return null;

    const mainHeader = $("mainHeader");
    const mainContent = $("mainContent");
    const mainCopy = $("mainCopy");
    main.querySelector(".poster").dataset.wpFramePoster = "";
    mainCopy.dataset.wpFrameCopy = "";
    mainCopy.querySelector("[data-t='pitch']").dataset.wpFrameSummary = "";

    const stageHeader = $("stageHeader");
    const stageContent = $("stageContent");
    const stageInfo = $("stageInfo");
    const stagePage = $("stagePage");
    const stageRail = $("stageRail");
    const forgePanel = $("forgePanel");
    const stageAction = $("raceTab");
    const forgeAction = $("forgeTab");
    const stageNav = $("stageNav");
    stageNav.dataset.wpFrameNav = "";
    stageNav.dataset.wpFrameStageNav = "";
    stageAction.dataset.wpFrameStageSlot = "stages";
    forgeAction.dataset.wpFrameStageSlot = "equipment";
    stageAction.dataset.wpFrameAction = "tab";
    forgeAction.dataset.wpFrameAction = "tab";

    const battleHeader = $("battleHeader");
    const battleContent = $("battleContent");
    const battleInfo = $("battleInfo");
    const guide = document.querySelector("section[data-wp-game-guide]");
    const frame = core.mount({
      root,
      localeSelect: $("localeSelect"),
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: mainContent },
        stage: { root: stage, header: stageHeader, content: stageContent, headerInfo: stageInfo },
        battle: { root: battle, header: battleHeader, content: battleContent, headerInfo: battleInfo },
      },
    });

    const stageGroup = core.createGroup();
    stageGroup.add($("stageSummary"));
    frame.stageTopUI.add(stageGroup);

    const battleGroup = core.createGroup();
    ["battleChapterRace", "playerProgressStat", "rivalProgressStat", "timeStat"]
      .forEach((id) => battleGroup.add($(id)));
    battleInfo.replaceChildren();
    frame.battleTopUI.add(battleGroup);

    frame.commonDownButton.add(stageAction).add(forgeAction);
    let stageMode = "stages";
    const setStageMode = (mode) => {
      stageMode = mode === "forge" ? "forge" : "stages";
      const showingStages = stageMode === "stages";
      forgePanel.hidden = showingStages;
      stageAction.setAttribute("aria-current", showingStages ? "page" : "false");
      forgeAction.setAttribute("aria-current", showingStages ? "false" : "page");
      stageAction.setAttribute("aria-pressed", String(showingStages));
      forgeAction.setAttribute("aria-pressed", String(!showingStages));
      if (showingStages) selector.refresh(game.selected());
      else selector.cancel();
      window.dispatchEvent(new Event("weightplay:stage-sync"));
    };

    const poster = window.WEIGHTPLAY_INTERFACE7_POSTERS?.["animal-sketchwheel-rally"]
      || "/assets/animal-sketchwheel-rally/animal-sketchwheel-rally-cover-v18.webp";
    const selector = playUI.mountStage({
      page: stagePage,
      rail: stageRail,
      config: game.stageConfig(poster),
      selected: game.selected(),
      onSelect: game.select,
      onStart: game.start,
      isActive: () => frame.active === "stage" && stageMode === "stages",
    });
    stageAction.addEventListener("click", () => setStageMode("stages"));
    forgeAction.addEventListener("click", () => {
      setStageMode("forge");
      game.renderForge();
      game.showForgeFeedback();
    });

    const dialogs = ["tutorialModal", "leaveModal", "resultModal", "helpModal", "renderRecovery"].map($);
    const sync = () => {
      const scene = document.body.dataset.screen || "main";
      const covered = scene === "battle" && dialogs.some((dialog) => !dialog.hidden);
      if (guide) guide.hidden = scene !== "main";
      frame.activate(scene, { covered });
      if (scene === "stage" && stageMode === "stages") selector.refresh(game.selected());
      else selector.cancel();
    };
    const abort = new AbortController();
    window.addEventListener("weightplay:shell-sync", sync, { signal: abort.signal });
    window.addEventListener("wonder:locale-change", sync, { signal: abort.signal });
    dialogs.forEach((dialog) => {
      for (const event of ["toggle", "close"]) dialog.addEventListener(event, sync, { signal: abort.signal });
    });
    window.addEventListener("pagehide", (event) => {
      if (event.persisted) return;
      abort.abort();
      selector.destroy();
      frame.destroy();
    }, { signal: abort.signal });
    window.syncSketchwheelFrame = sync;
    window.setSketchwheelStageMode = setStageMode;
    setStageMode("stages");
    sync();
    return frame;
  };
})();
