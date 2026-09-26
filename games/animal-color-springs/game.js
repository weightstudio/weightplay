(function () {
  "use strict";

  if (window.__ANIMAL_COLOR_SPRINGS_INTERFACE7_COMPAT__) return;
  window.__ANIMAL_COLOR_SPRINGS_INTERFACE7_COMPAT__ = true;

  const GAME_ID = "animal-color-springs";
  const STAGE_TOTAL = 30;
  const STAGE_TAB_COPY = {
    en: "Stages",
    "zh-Hant": "關卡",
    "zh-Hans": "关卡",
    ja: "ステージ",
    ko: "스테이지",
    es: "Niveles",
    "pt-BR": "Fases",
    fr: "Niveaux",
    de: "Stufen",
    it: "Livelli",
    ru: "Уровни",
    hi: "स्तर",
    ar: "المراحل"
  };

  document.body.dataset.wpGameId = GAME_ID;

  const start = document.getElementById("startBtn");
  if (start) start.dataset.wpMainStart = "";

  const stageScreen = document.getElementById("stageScreen");
  const stageCanvas = stageScreen?.querySelector(".stage-canvas");
  const stageHeader = stageCanvas?.querySelector(".stage-header");
  const stageSummary = document.getElementById("stageSummary");
  const chapterPanel = stageCanvas?.querySelector(".chapter-panel");
  const stageRail = document.getElementById("stageRail");

  if (stageCanvas) stageCanvas.dataset.wpLogicalStageCanvas = "";
  if (stageRail) {
    stageRail.dataset.wpStageV6Total = String(STAGE_TOTAL);
    stageRail.dataset.wpStageV6PoolSize = "9";
  }

  let workspace = stageCanvas?.querySelector(".color-springs-stage-workspace");
  if (stageCanvas && stageRail && !workspace) {
    workspace = document.createElement("div");
    workspace.className = "color-springs-stage-workspace stage-workspace";
    workspace.dataset.wpStageWorkspace = "";
    if (stageHeader?.nextSibling) stageCanvas.insertBefore(workspace, stageHeader.nextSibling);
    else stageCanvas.append(workspace);
    if (chapterPanel) workspace.append(chapterPanel);
    workspace.append(stageRail);
  }

  if (chapterPanel && stageSummary && !chapterPanel.contains(stageSummary)) {
    stageSummary.classList.add("stage-summary-line");
    chapterPanel.prepend(stageSummary);
  }

  const normalizeLocale = (raw) => {
    if (/^zh-(tw|hant)/i.test(raw || "")) return "zh-Hant";
    if (/^zh/i.test(raw || "")) return "zh-Hans";
    if (/^pt/i.test(raw || "")) return "pt-BR";
    const direct = raw || "en";
    return STAGE_TAB_COPY[direct] ? direct : (STAGE_TAB_COPY[direct.split("-")[0]] ? direct.split("-")[0] : "en");
  };

  const currentLocale = () => normalizeLocale(
    window.WonderI18n?.actualLocale?.()
      || window.WonderI18n?.locale?.()
      || document.documentElement.lang
      || "en"
  );

  let stageTabs = stageCanvas?.querySelector(".stage-tabs[data-wp-color-springs-tabs]");
  if (stageCanvas && !stageTabs) {
    stageTabs = document.createElement("nav");
    stageTabs.className = "stage-tabs";
    stageTabs.dataset.wpColorSpringsTabs = "";
    stageTabs.dataset.wpFrameNav = "";
    const stageTab = document.createElement("button");
    stageTab.type = "button";
    stageTab.setAttribute("role", "tab");
    stageTab.setAttribute("aria-selected", "true");
    stageTab.dataset.wpFrameAction = "tab";
    stageTabs.append(stageTab);
    stageCanvas.append(stageTabs);
  }

  const updateStageTabCopy = () => {
    const label = STAGE_TAB_COPY[currentLocale()] || STAGE_TAB_COPY.en;
    if (!stageTabs) return;
    stageTabs.setAttribute("aria-label", label);
    const button = stageTabs.querySelector("button");
    if (button) {
      button.textContent = label;
      button.setAttribute("aria-label", label);
    }
  };
  updateStageTabCopy();
  window.addEventListener("wonder:locale-change", updateStageTabCopy);

  const battleActions = document.querySelector("#battleScreen .battle-actions");
  const helpButton = document.getElementById("helpBtn");
  if (battleActions && helpButton && helpButton.parentElement !== battleActions) {
    helpButton.classList.add("battle-help-action");
    battleActions.append(helpButton);
  }

  const resultPanel = document.getElementById("resultPanel");
  if (resultPanel) resultPanel.dataset.wpBattleSubstate = "result";

  const leavePanel = document.getElementById("leavePanel");
  const modalOpen = (panel) => Boolean(panel && !panel.hidden);
  const syncBattleModalSafety = () => {
    const covered = modalOpen(leavePanel) || modalOpen(resultPanel);
    [
      document.querySelector("#battleScreen .battle-header"),
      document.querySelector("#battleScreen [data-wp-frame-header='battle']"),
      document.querySelector("#battleScreen #wp-shared-battle-header"),
      document.getElementById("lockNotice"),
      document.getElementById("vesselBoard"),
      battleActions
    ].filter(Boolean).forEach((node) => {
      if (node === leavePanel || node === resultPanel || node.contains(leavePanel) || node.contains(resultPanel)) return;
      node.inert = covered;
    });
  };

  [leavePanel, resultPanel].filter(Boolean).forEach((panel) => {
    new MutationObserver(syncBattleModalSafety).observe(panel, { attributes: true, attributeFilter: ["hidden"] });
  });
  window.addEventListener("weightplay:shell-sync", syncBattleModalSafety);
  window.addEventListener("weightplay:screen-change", syncBattleModalSafety);
  syncBattleModalSafety();

  const current = document.currentScript;
  let runtimeLoaded = false;
  const loadRuntime = () => {
    if (runtimeLoaded) return;
    runtimeLoaded = true;
    const runtime = document.createElement("script");
    runtime.async = false;
    runtime.src = new URL("./game-v5-base.js?v=20260926-color-springs-locale13-v1", current?.src || location.href).href;
    runtime.dataset.wpColorSpringsRuntime = "v5-base";
    if (current?.parentNode) current.after(runtime);
    else document.body.append(runtime);
  };

  if (window.WeightPlayStageV6?.install) {
    loadRuntime();
  } else {
    const virtualizer = document.createElement("script");
    virtualizer.async = false;
    virtualizer.src = new URL("../../src/stage-virtualization-standard.js?v=20260809-stage-v6-source-demotion-v8", current?.src || location.href).href;
    virtualizer.dataset.wpStageVirtualizationStandard = "true";
    virtualizer.addEventListener("load", loadRuntime, { once: true });
    virtualizer.addEventListener("error", loadRuntime, { once: true });
    if (current?.parentNode) current.after(virtualizer);
    else document.body.append(virtualizer);
  }
}());
