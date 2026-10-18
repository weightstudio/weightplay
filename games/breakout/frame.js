/* Breakout supplies stage data and Battle stats; the shared I9 frame owns layout. */
(() => {
  "use strict";

  if (window.WPBreakoutI9Frame) return;

  const root = document.getElementById("popularArcade");
  const main = document.getElementById("mainScreen");
  const stage = document.getElementById("stageScreen");
  const battle = document.getElementById("battleScreen");
  const mainHeader = root?.querySelector(".main-header");
  const stageHeader = stage?.querySelector(".stage-header");
  const stageShell = stage?.querySelector(".stage-shell");
  const battleCanvas = battle?.querySelector(".battle-canvas");
  const battleHeader = battleCanvas?.querySelector(".battle-header");
  const localeSelect = document.getElementById("localeSelect");

  if (!root || !main || !stage || !battle || !mainHeader || !stageHeader || !stageShell || !battleCanvas || !battleHeader || !localeSelect) {
    throw new Error("BREAKOUT_I9_FRAME_MARKUP_REQUIRED");
  }

  const mainTitle = mainHeader.querySelector("#gameTitle");
  const stageBack = stageHeader.querySelector('[data-wp-return="stage"]');
  const stageProgress = stageHeader.querySelector("#stageProgressText");
  const stageRail = stage.querySelector("#stageRail");
  const stageNavigation = stageShell.querySelector(".stage-tabs");
  const stageTab = stageNavigation?.querySelector("button");
  const battleBack = battleHeader.querySelector('[data-wp-return="battle"]');

  if (!mainTitle || !stageBack || !stageProgress || !stageRail || !stageNavigation || !stageTab || !battleBack) {
    throw new Error("BREAKOUT_I9_FRAME_SLOTS_REQUIRED");
  }

  const entranceAnimations = new WeakMap();
  const reducedMotion = () => Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  const animateEntrance = (element, kind = "scene") => {
    if (!element?.animate) return;
    entranceAnimations.get(element)?.cancel();
    const reduce = reducedMotion();
    const keyframes = kind === "result"
      ? (reduce
        ? [{ opacity: 0.86 }, { opacity: 1 }]
        : [{ opacity: 0.72, transform: "translateY(8px) scale(.985)" }, { opacity: 1, transform: "none" }])
      : [{ opacity: reduce ? 0.86 : 0.76 }, { opacity: 1 }];
    const animation = element.animate(keyframes, {
      duration: reduce ? 90 : kind === "result" ? 190 : 170,
      easing: "ease-out",
      fill: "both",
    });
    entranceAnimations.set(element, animation);
    animation.onfinish = () => {
      if (entranceAnimations.get(element) !== animation) return;
      entranceAnimations.delete(element);
      animation.cancel();
    };
  };

  mainTitle.dataset.wpFrameTitle = "";
  stageHeader.replaceChildren(stageBack);
  const stageTitle = document.createElement("strong");
  stageTitle.hidden = true;
  stageTitle.dataset.wpFrameTitle = "";
  stageHeader.append(stageTitle);

  const stageWorkspace = document.createElement("div");
  stageWorkspace.id = "stageWorkspace";
  for (const node of [...stageShell.children]) {
    if (node !== stageHeader && node !== stageNavigation) stageWorkspace.append(node);
  }
  stageNavigation.dataset.wpFrameNav = "";
  stageNavigation.querySelectorAll("[data-wp-frame-stage-slot]").forEach((node) => delete node.dataset.wpFrameStageSlot);
  stageTab.dataset.wpFrameAction = "tab";
  stageTab.setAttribute("aria-pressed", "true");
  stage.replaceChildren(stageHeader, stageWorkspace, stageNavigation);

  battle.insertBefore(battleHeader, battleCanvas);
  battle.querySelector(".battle-ad-reserve")?.remove();
  const battleTitle = document.createElement("strong");
  battleTitle.hidden = true;
  battleTitle.dataset.wpFrameTitle = "";
  battleHeader.replaceChildren(battleBack, battleTitle);

  const frame = window.WeightPlayScreenFrame.mount({
    root,
    localeSelect,
    playUI: true,
    scenes: {
      main: { root: main, header: mainHeader, content: main.querySelector(".arcade-panel") },
      stage: { root: stage, header: stageHeader, content: stageWorkspace },
      battle: { root: battle, header: battleHeader, content: battleCanvas },
    },
  });

  const stageGroup = window.WeightPlayScreenFrame.createGroup();
  stageGroup.add(stageProgress);
  frame.stageTopUI.add(stageGroup);
  frame.commonDownButton.clear().add(stageTab);

  const stats = {
    stage: document.createElement("span"),
    score: document.createElement("span"),
    moves: document.createElement("span"),
  };
  const battleGroup = window.WeightPlayScreenFrame.createGroup();
  Object.values(stats).forEach((node) => battleGroup.add(node));
  frame.battleTopUI.add(battleGroup);

  const stageUI = {
    controller: null,
    mount({ config, selected, onSelect, onStart }) {
      if (this.controller) return this.controller;
      this.controller = window.WeightPlayPlayUI.mountStage({
        page: stageWorkspace,
        rail: stageRail,
        config,
        selected,
        onSelect,
        onStart,
        isActive: () => document.body.dataset.screen === "stage",
      });
      return this.controller;
    },
    refresh(index) {
      this.controller?.refresh(index);
    },
  };

  stageTab.addEventListener("click", () => {
    stageRail.querySelector('[aria-current="true"]')?.focus({ preventScroll: true });
  });
  window.addEventListener("weightplay:breakout-screen", (event) => {
    const screen = event.detail?.screen;
    const exiting = event.detail?.exiting;
    const sceneRoots = { main, stage, battle };
    if (exiting && sceneRoots[exiting]) {
      entranceAnimations.get(sceneRoots[exiting])?.cancel();
      entranceAnimations.delete(sceneRoots[exiting]);
    }
    if (["main", "stage", "battle"].includes(screen)) {
      frame.activate(screen);
      animateEntrance(sceneRoots[screen]);
    }
  });
  window.addEventListener("pagehide", (event) => {
    if (event.persisted) return;
    stageUI.controller?.destroy();
    frame.destroy();
  });

  window.WPBreakoutI9Frame = Object.freeze({
    frame,
    stageUI,
    updateBattleStats({ stage: stageText, score, moves }) {
      stats.stage.textContent = stageText;
      stats.score.textContent = score;
      stats.moves.textContent = moves;
    },
    animateResult() {
      animateEntrance(battle.querySelector("#resultScreen .result-card"), "result");
    },
    animateResultExit() {
      const card = battle.querySelector("#resultScreen .result-card");
      entranceAnimations.get(card)?.cancel();
      entranceAnimations.delete(card);
    },
    animateOverlay(element) {
      animateEntrance(element);
    },
  });
  frame.activate("main");
  animateEntrance(main);
  window.dispatchEvent(new Event("weightplay:breakout-frame-ready"));
})();
