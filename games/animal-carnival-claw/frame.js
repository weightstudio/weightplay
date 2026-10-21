/* Carnival Claw supplies localized mission data; shared I9 owns screen chrome,
   Stage geometry and motion, and the common action row. */
(() => {
  "use strict";

  window.mountCarnivalFrame = function mountCarnivalFrame() {
    const $ = (id) => document.getElementById(id);
    const root = $("gameFrame");
    const main = $("mainScreen");
    const stage = document.querySelector("#stageScreen .stage-canvas");
    const battle = document.querySelector("#battleScreen .battle-canvas");
    const mainHeader = main.querySelector("header");
    const stageHeader = stage.querySelector("header");
    const battleHeader = battle.querySelector("header");
    const live = $("battleLive");
    const stageSummary = $("stageSummary");
    const restartButton = $("restartBtn");
    const guide = root.querySelector(".game-page-info");
    const localeSelect = $("localeSelect");
    const gameBridge = window.CARNIVAL_CLAW_I9;

    if (!root || !main || !stage || !battle || !guide || !gameBridge
        || !window.WeightPlayScreenFrame || !window.WeightPlayPlayUI) {
      throw new Error("CARNIVAL_CLAW_I9_FRAME_DEPENDENCY_MISSING");
    }

    guide.id = "mainGuide";
    root.after(guide);
    mainHeader.querySelector("[data-wp-game-title]").setAttribute("data-wp-frame-title", "");
    for (const [selector, slot] of Object.entries({
      ".main-poster": "poster",
      ".main-copy": "copy",
      ".main-copy > p": "summary",
      "#mainProgress": "progress",
    })) main.querySelector(selector).setAttribute(`data-wp-frame-${slot}`, "");
    main.querySelector("#startBtn").setAttribute("data-wp-frame-action", "primary");
    main.querySelectorAll(".main-copy > small,.main-copy > h1").forEach((node) => { node.hidden = true; });

    const stageBack = stageHeader.querySelector('[data-wp-return="stage"]');
    const stageTitle = document.createElement("strong");
    stageTitle.hidden = true;
    stageTitle.dataset.wpFrameTitle = "";
    stageHeader.replaceChildren(stageBack, stageTitle);

    const battleBack = battleHeader.querySelector('[data-wp-return="battle"]');
    const battleInfoSource = document.createElement("div");
    battleInfoSource.append(...battleHeader.querySelectorAll(".battle-title,.battle-stat"));
    const battleTitle = document.createElement("strong");
    battleTitle.hidden = true;
    battleTitle.dataset.wpFrameTitle = "";
    battleHeader.replaceChildren(battleBack, battleTitle);
    battle.prepend(battleHeader);
    live.querySelector(".target-strip").append(restartButton);

    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: main.querySelector(".main-hero") },
        stage: { root: stage, header: stageHeader, content: $("stageWorkspace") },
        battle: { root: battle, header: battleHeader, content: live },
      },
    });

    const stageGroup = window.WeightPlayScreenFrame.createGroup().add(stageSummary);
    frame.stageTopUI.add(stageGroup);
    const battleGroup = window.WeightPlayScreenFrame.createGroup();
    for (const node of [...battleInfoSource.children]) battleGroup.add(node);
    frame.battleTopUI.add(battleGroup);

    const stageActions = [$("cabinetTab"), $("stagesTab"), $("workshopTab")];
    stageActions.forEach((button) => {
      button.dataset.wpFrameAction = "tab";
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", "stageWorkspace");
    });
    frame.commonDownButton.clear().add(stageActions[0]).add(stageActions[1]).add(stageActions[2]);

    const poster = new URL("/assets/interface7-redrawn/animal-carnival-claw.webp", location.origin).href;
    const stageUI = window.WeightPlayPlayUI.mountStage({
      page: $("stagesPanel"),
      rail: $("stageRail"),
      config: gameBridge.getStageConfig({ poster }),
      selected: gameBridge.getSelectedStage(),
      onSelect: gameBridge.selectStage,
      onStart: gameBridge.startMission,
      isActive: () => frame.active === "stage" && gameBridge.isStageActive(),
    });
    gameBridge.attachStageUI(stageUI);
    window.__CARNIVAL_CLAW_FRAME__ = Object.freeze({ frame, stageUI, stageGroup, battleGroup });
    frame.activate("main");
    window.addEventListener("pagehide", (event) => {
      if (event.persisted) return;
      stageUI.destroy();
      frame.destroy();
    }, { once: true });
    return frame;
  };
})();
