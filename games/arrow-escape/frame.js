/* Arrow Escape content adapter; shared frame and Play UI own screen geometry. */
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const root = $("gameFrame");
  const main = $("mainScreen");
  const stage = $("stageScreen");
  const battle = $("battleScreen");
  const game = window.ArrowEscapeGame;
  const localeSelect = $("localeSelect");

  if (!game || !window.WeightPlayPlayUI || !window.ArrowEscapeStageConfig) {
    throw new Error("ARROW_ESCAPE_I9_DEPENDENCIES_REQUIRED");
  }

  const artStyles = document.createElement("link");
  artStyles.rel = "stylesheet";
  artStyles.href = "/games/arrow-escape/block-art.css?v=20261021-arrow-escape-i9";
  document.head.append(artStyles);

  // Retain the native locale source for the common Settings popover.
  localeSelect.hidden = true;
  root.append(localeSelect);
  main.querySelector(".main-controls").hidden = true;

  const mainHeader = main.querySelector(".main-header");
  mainHeader.querySelector("strong").setAttribute("data-wp-frame-title", "");
  const hero = main.querySelector(".hero");
  hero.classList.remove("hero");
  const poster = hero.querySelector(".poster");
  poster.classList.add("main-poster");
  poster.setAttribute("data-wp-frame-poster", "");
  const copy = hero.querySelector(".hero-copy");
  copy.classList.remove("hero-copy");
  copy.setAttribute("data-wp-frame-copy", "");
  copy.querySelector("h1").hidden = true;
  copy.querySelector("small").hidden = true;
  copy.querySelector("p").setAttribute("data-wp-frame-summary", "");
  $("mainProgress").setAttribute("data-wp-frame-progress", "");
  $("startBtn").setAttribute("data-wp-frame-action", "primary");
  for (const id of ["hintBtn", "restartBtn", "battleHelp", "helpClose", "leaveContinue", "leaveStage", "resultStageBtn", "retryBtn"]) {
    $(id).setAttribute("data-wp-frame-action", "secondary");
  }
  $("nextBtn").setAttribute("data-wp-frame-action", "primary");

  const stageHeader = stage.querySelector(".stage-header");
  const stageWorkspace = $("stageWorkspace");
  const battleHeader = battle.querySelector(".battle-header");
  const battleContent = $("battleLive");
  const guide = root.querySelector(".game-page-info");

  const frame = window.WeightPlayScreenFrame.mount({
    root,
    localeSelect,
    playUI: true,
    scenes: {
      main: { root: main, header: mainHeader, content: hero },
      stage: { root: stage, header: stageHeader, content: stageWorkspace },
      battle: { root: battle, header: battleHeader, content: battleContent },
    },
  });

  const stageInfo = window.WeightPlayScreenFrame.createGroup();
  stageInfo.add($("stageSummary"));
  frame.stageTopUI.add(stageInfo);

  const battleInfo = window.WeightPlayScreenFrame.createGroup();
  battleInfo.add($("stageLabel"));
  battleInfo.add($("movesValue").parentElement);
  battleInfo.add($("leftValue").parentElement);
  frame.battleTopUI.add(battleInfo);

  const stageUI = window.WeightPlayPlayUI.mountStage({
    page: stageWorkspace,
    rail: $("stageRail"),
    config: window.ArrowEscapeStageConfig.create(game),
    selected: game.selectedStage - 1,
    isActive: () => document.body.dataset.screen === "stage",
    onSelect(index) {
      game.setSelectedStage(index + 1);
    },
    onStart(index) {
      game.startStage(index + 1);
    },
  });

  if (guide) root.after(guide);
  const modals = ["helpModal", "leaveModal", "resultModal"].map($);
  const sync = () => {
    const scene = document.body.dataset.screen || "main";
    const covered = scene === "battle" && modals.some((node) => !node.hidden);
    if (guide) guide.hidden = scene !== "main";
    if (scene === "stage") stageUI.refresh(game.selectedStage - 1);
    else stageUI.cancel();
    battleContent.inert = scene !== "battle" || covered;
    frame.activate(scene, { covered });
    if (scene === "battle") {
      window.WeightPlayBattleCanvas?.sync?.();
      frame.activate(scene, { covered });
    }
  };

  const observer = new MutationObserver(sync);
  observer.observe(document.body, { attributes: true, attributeFilter: ["data-screen"] });
  modals.forEach((node) => observer.observe(node, { attributes: true, attributeFilter: ["hidden"] }));
  window.addEventListener("weightplay:stage-sync", sync);
  window.addEventListener("weightplay:stage-cancel", () => stageUI.cancel());
  window.addEventListener("wonder:locale-change", () => {
    stageUI.refresh(game.selectedStage - 1);
  });
  window.addEventListener("pagehide", (event) => {
    if (!event.persisted) {
      observer.disconnect();
      stageUI.destroy();
      frame.destroy();
    }
  });

  frame.activate("main");
  sync();
})();
