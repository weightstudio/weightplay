/* Game data plugs into the shared I9 screen frame and Play UI. */
(() => {
  "use strict";

  window.mountKiteKeeperFrame = function mountKiteKeeperFrame() {
    const root = document.getElementById("gameFrame");
    const main = document.getElementById("mainScreen");
    const stage = document.getElementById("stageScreen");
    const battle = document.getElementById("battleScreen");
    const mainHeader = main.querySelector(".main-header");
    const stageHeader = stage.querySelector(".stage-heading");
    const battleHeader = battle.querySelector(".battle-heading");
    const sourceLocale = document.getElementById("localeSelect");

    const routeSegment = location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    const routeLocale = { "zh-tw":"zh-Hant", "zh-cn":"zh-Hans", "pt-br":"pt-BR" }[routeSegment] || routeSegment;
    if (sourceLocale && [...sourceLocale.options].some(option => option.value === routeLocale)) {
      sourceLocale.value = routeLocale;
    }

    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect: sourceLocale,
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: document.getElementById("mainContent") },
        stage: { root: stage, header: stageHeader, content: document.getElementById("stageWorkspace") },
        battle: { root: battle, header: battleHeader, content: document.getElementById("battleContent") },
      },
    });
    const sceneRoots = { main, stage, battle };
    function activate(scene, options) {
      if (!Object.hasOwn(sceneRoots, scene)) throw new Error(`Unknown Kite Keeper scene: ${scene}`);
      for (const [name, sceneRoot] of Object.entries(sceneRoots)) sceneRoot.hidden = name !== scene;
      frame.activate(scene, options);
    }

    const stageProgress = document.createElement("span");
    stageProgress.id = "stageProgress";
    frame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add(stageProgress));

    const routeTitle = document.createElement("strong");
    routeTitle.id = "routeTitle";
    const progressPill = document.createElement("span");
    progressPill.id = "progressPill";
    frame.battleTopUI.add(window.WeightPlayScreenFrame.createGroup().add(routeTitle).add(progressPill));

    const familyNav = document.getElementById("routeFamilyNav");
    familyNav.dataset.wpFrameStageNav = "";
    const familyButtons = [...familyNav.querySelectorAll("[data-route-family]")];
    familyNav.setAttribute("aria-label", "Sky routes and equipment");
    frame.commonDownButton.clear();
    const emptyTeamSlot = document.createElement("span");
    emptyTeamSlot.setAttribute("aria-hidden", "true");
    frame.commonDownButton.add(emptyTeamSlot);
    familyButtons.forEach(button => {
      button.dataset.wpFrameAction = "tab";
      frame.commonDownButton.add(button);
    });

    activate("main");
    return Object.freeze({ frame, activate, stageProgress, routeTitle, progressPill, familyButtons });
  };
})();
