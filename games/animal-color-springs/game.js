(function () {
  "use strict";

  if (window.__ANIMAL_COLOR_SPRINGS_INTERFACE9_LOADER__) return;
  window.__ANIMAL_COLOR_SPRINGS_INTERFACE9_LOADER__ = true;

  const body = document.body;
  body.dataset.wpGameId = "animal-color-springs";
  body.dataset.wpPlayUi = "1";

  const mainGroup = document.getElementById("mainGroup");
  const mainScreen = document.getElementById("mainScreen");
  if (mainGroup && mainScreen) {
    const header = mainScreen.querySelector(".main-header");
    const hero = mainScreen.querySelector(".main-hero");
    const guide = mainGroup.querySelector(".game-guide");
    mainGroup.className = "screen main main-screen wp-standard-main-screen";
    mainGroup.dataset.wpStandardMainScreen = "";
    mainGroup.setAttribute("role", "region");
    header?.querySelector("[data-wp-game-title]")?.setAttribute("data-wp-frame-title", "");
    if (header && hero) {
      mainScreen.className = "main-content";
      mainScreen.replaceChildren(hero, ...(guide ? [guide] : []));
      mainGroup.replaceChildren(header, mainScreen);
      hero.className = "wp-standard-main-composition";
      const poster = hero.querySelector(".main-poster");
      const copy = hero.querySelector(".main-copy");
      if (poster) {
        poster.dataset.wpFramePoster = "";
        const framePoster = document.createElement("div");
        framePoster.className = "wp-standard-main-poster";
        poster.before(framePoster);
        framePoster.append(poster);
      }
      if (copy) {
        copy.className = "wp-standard-main-copy";
        copy.dataset.wpFrameCopy = "";
        copy.querySelector("p")?.setAttribute("data-wp-frame-summary", "");
      }
      const progress = document.getElementById("mainProgress");
      if (progress) progress.dataset.wpFrameProgress = "";
      const start = document.getElementById("startBtn");
      if (start) {
        start.dataset.wpMainStart = "";
        start.dataset.wpFrameAction = "primary";
      }
    }
    if (guide) {
      guide.classList.add("game-page-info", "game-page-info-static");
      guide.dataset.wpGameGuide = "";
      guide.dataset.wpPreserveStaticGuide = "";
    }
  }

  const stageScreen = document.getElementById("stageScreen");
  const stageCanvas = stageScreen?.querySelector(".stage-canvas");
  const stageHeader = stageCanvas?.querySelector(".stage-header");
  const stageRail = document.getElementById("stageRail");
  if (stageCanvas && stageHeader && stageRail) {
    stageCanvas.dataset.wpLogicalStageCanvas = "";
    stageCanvas.removeAttribute("style");
    const back = stageHeader.querySelector('[data-wp-return="stage"]');
    let title = stageHeader.querySelector("strong");
    if (!title) title = document.createElement("strong");
    title.dataset.wpFrameTitle = "";
    title.dataset.wpGameTitle = "";
    title.dataset.i18n = "title";
    title.textContent = window.COLOR_SPRINGS_LOCALES?.[document.documentElement.lang]?.title
      || window.COLOR_SPRINGS_LOCALES?.en?.title
      || "Color Springs";
    stageHeader.replaceChildren(...[back, title].filter(Boolean));

    const workspace = document.createElement("div");
    workspace.className = "stage-workspace color-springs-stage-workspace";
    workspace.dataset.wpStageWorkspace = "";
    const chapterPanel = stageCanvas.querySelector(".chapter-panel");
    const stageHeaderInfo = document.createElement("div");
    stageHeaderInfo.id = "stageHeaderInfo";
    if (chapterPanel) workspace.append(chapterPanel);
    workspace.append(stageRail, stageHeaderInfo);
    stageCanvas.replaceChildren(stageHeader, workspace);
    stageRail.dataset.wpStageRail = "";
    stageRail.removeAttribute("data-wp-stage-settle-duration");
    stageRail.removeAttribute("data-wp-stage-settle-easing");
  }

  const battleScreen = document.getElementById("battleScreen");
  const battleCanvas = battleScreen?.querySelector(".battle-canvas");
  const battleHeader = battleCanvas?.querySelector(".battle-header");
  if (battleCanvas && battleHeader) {
    battleCanvas.dataset.wpLogicalBattleCanvas = "";
    battleCanvas.removeAttribute("data-wp-canvas-max-width");
    const back = battleHeader.querySelector('[data-wp-return="battle"]');
    const title = document.createElement("strong");
    title.dataset.wpFrameTitle = "";
    title.dataset.wpGameTitle = "";
    title.dataset.i18n = "title";
    title.textContent = window.COLOR_SPRINGS_LOCALES?.[document.documentElement.lang]?.title
      || window.COLOR_SPRINGS_LOCALES?.en?.title
      || "Color Springs";

    const content = document.createElement("div");
    content.className = "battle-content";
    const headerInfo = document.createElement("div");
    headerInfo.id = "battleHeaderInfo";
    const makeStat = (labelKey, id) => {
      const stat = document.createElement("span");
      stat.className = "color-springs-battle-stat";
      const label = document.createElement("small");
      label.dataset.i18n = labelKey;
      const value = document.createElement("strong");
      value.id = id;
      stat.append(label, value);
      headerInfo.append(stat);
      return value;
    };
    makeStat("stageHeaderLabel", "stageLabel");
    makeStat("moveGoalLabel", "stageGoal");
    makeStat("moves", "movesValue");

    const battleActions = battleCanvas.querySelector(".battle-actions");
    const help = battleHeader.querySelector("#helpBtn");
    if (help && battleActions) {
      help.classList.add("battle-help-action");
      battleActions.append(help);
    }
    const returnButton = back || battleHeader.querySelector("button");
    battleHeader.replaceChildren(...[returnButton, title].filter(Boolean));
    content.append(headerInfo);
    for (const selector of ["#lockNotice", "#vesselBoard", ".battle-actions", "#resultPanel", "#leavePanel"]) {
      const node = battleCanvas.querySelector(selector);
      if (node) content.append(node);
    }
    battleCanvas.replaceChildren(battleHeader, content);
  }

  const current = document.currentScript;
  const runtime = document.createElement("script");
  runtime.async = false;
  runtime.src = new URL("./game-v5-base.js?v=20261023-color-springs-i9-v5", current?.src || location.href).href;
  runtime.dataset.wpColorSpringsRuntime = "i9";
  if (current?.parentNode) current.after(runtime);
  else document.body.append(runtime);
}());
