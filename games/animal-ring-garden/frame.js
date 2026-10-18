/* Ring Garden supplies localized records and game actions; the shared frame
   owns Main, Stage, Battle headers, card geometry, and Stage gestures. */
(() => {
  "use strict";

  const body = document.body;
  const byId = (id) => document.getElementById(id);
  let frame = null;
  let stageUI = null;
  let stageTab = null;
  let stageName = null;
  let stageIndex = null;
  let battleName = null;
  let battleTurns = null;

  function syncStageTab() {
    if (!stageTab || !frame) return;
    const localeKey = document.documentElement.lang || "en";
    const copy = window.RING_GARDEN_COPY || {};
    const label = copy[localeKey]?.stages || copy.en?.stages || "Stages";
    stageTab.textContent = label;
    stageTab.setAttribute("aria-label", label);
    frame.commonDownButton.element.setAttribute("aria-label", label);
  }

  function syncHeaderCopy() {
    const game = window.AnimalRingGardenGame;
    if (!game) return;
    const state = game.headerState();
    if (stageName) stageName.textContent = state.stageName;
    if (stageIndex) stageIndex.textContent = state.stageIndex;
    if (battleName) battleName.textContent = state.battleName;
    if (battleTurns) battleTurns.textContent = state.turns;
    syncStageTab();
  }

  function refreshStage(index) {
    const game = window.AnimalRingGardenGame;
    if (!game || !stageUI) return;
    stageUI.refresh(Number.isInteger(index) ? index : game.stageBrowseIndex);
    syncHeaderCopy();
  }

  function mountFrame() {
    if (frame) return frame;
    const game = window.AnimalRingGardenGame;
    if (!game || !window.AnimalRingGardenStageConfig || !window.WeightPlayScreenFrame || !window.WeightPlayPlayUI || !window.WeightPlayStageRailI9) {
      throw new Error("RING_GARDEN_I9_RUNTIME_REQUIRED");
    }

    const root = byId("app");
    const main = byId("mainScreen");
    const stage = byId("stageScreen");
    const battle = byId("battleScreen");
    const mainHeader = main.querySelector(".main-header");
    const stageHeader = stage.querySelector(".stage-header");
    const battleHeader = battle.querySelector(".battle-header");
    const localeSelect = byId("locale");

    const stageBack = stageHeader.querySelector('[data-wp-return="stage"]');
    const stageTitle = byId("stage-header-title");
    stageTitle.hidden = true;
    stageHeader.replaceChildren(stageBack, stageTitle);

    const battleBack = battleHeader.querySelector('[data-wp-return="battle"]');
    const battleTitle = byId("battle-header-title");
    battleTitle.hidden = true;
    battleHeader.replaceChildren(battleBack, battleTitle);

    frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: main.querySelector(".main-content") },
        stage: { root: stage, header: stageHeader, content: byId("stageWorkspace") },
        battle: { root: battle, header: battleHeader, content: byId("battleContent") },
      },
    });

    const stageGroup = window.WeightPlayScreenFrame.createGroup();
    stageName = document.createElement("span");
    stageIndex = document.createElement("span");
    stageGroup.add(stageName);
    stageGroup.add(stageIndex);
    frame.stageTopUI.add(stageGroup);

    const battleGroup = window.WeightPlayScreenFrame.createGroup();
    battleName = document.createElement("span");
    battleTurns = document.createElement("span");
    battleGroup.add(battleName);
    battleGroup.add(battleTurns);
    frame.battleTopUI.add(battleGroup);

    stageUI = window.WeightPlayPlayUI.mountStage({
      page: byId("stageWorkspace"),
      rail: byId("garden-list"),
      config: window.AnimalRingGardenStageConfig,
      selected: game.stageBrowseIndex,
      isActive: () => frame?.active === "stage",
      onSelect(index) {
        game.selectStage(index);
        syncHeaderCopy();
      },
      onStart(index) {
        game.startGarden(index);
      },
    });

    stageTab = document.createElement("button");
    stageTab.type = "button";
    stageTab.setAttribute("role", "tab");
    stageTab.setAttribute("aria-selected", "true");
    stageTab.setAttribute("aria-controls", "stageWorkspace");
    stageTab.tabIndex = 0;
    frame.commonDownButton.element.setAttribute("role", "tablist");
    frame.commonDownButton.add(stageTab);
    stageTab.addEventListener("click", () => refreshStage());
    syncStageTab();

    const syncScene = () => {
      const scene = body.dataset.screen || "main";
      if (!["main", "stage", "battle"].includes(scene)) return;
      frame.activate(scene);
      syncHeaderCopy();
      if (scene === "stage") refreshStage();
    };
    window.addEventListener("weightplay:game-view-change", syncScene);
    window.addEventListener("weightplay:ring-garden-state-change", syncHeaderCopy);
    window.addEventListener("wonder:locale-change", () => refreshStage());
    window.addEventListener("pagehide", (event) => {
      if (!event.persisted) {
        stageUI.destroy();
        frame.destroy();
      }
    });

    window.AnimalRingGardenFrame = Object.freeze({
      activate(scene) {
        if (frame) frame.activate(scene);
        syncHeaderCopy();
        if (scene === "stage") refreshStage();
      },
      refreshStage,
      refreshBattle: syncHeaderCopy,
    });
    frame.activate(body.dataset.screen || "main");
    syncHeaderCopy();
    return frame;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountFrame, { once: true });
  } else {
    mountFrame();
  }
})();
