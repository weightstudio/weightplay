/* Cratebound content adapter; the shared frame and Play UI own scene chrome. */
(() => {
  "use strict";
  if (document.body?.dataset.wpGameId !== "animal-cratebound") return;
  if (window.__ANIMAL_CRATEBOUND_INTERFACE9__) return;
  window.__ANIMAL_CRATEBOUND_INTERFACE9__ = true;

  const byId = id => document.getElementById(id);
  const root = byId("gameFrame");
  const main = byId("mainScreen");
  const stage = byId("stageScreen");
  const battle = byId("battleScreen");
  const mainHeader = main?.querySelector(".main-header");
  const stageHeader = stage?.querySelector(".stage-header");
  const battleHeader = battle?.querySelector(".battle-header");
  const localeSelect = byId("localeSelect");
  const stageWorkspace = byId("stageWorkspace");
  const stageRail = byId("stageRail");
  const stageSummary = byId("stageSummary");
  const stageTab = byId("stageMapTab");
  const battleContent = battle?.querySelector(".battle-live");
  const battleTitle = battle?.querySelector(".battle-title");
  const battleStats = battle?.querySelector(".battle-stats");
  const stageBack = stageHeader?.querySelector('[data-wp-return="stage"]');
  const battleBack = battleHeader?.querySelector('[data-wp-return="battle"]');
  if (!root || !main || !stage || !battle || !mainHeader || !stageHeader || !battleHeader
      || !stageWorkspace || !stageRail || !stageSummary || !stageTab || !battleContent
      || !battleTitle || !battleStats || !stageBack || !battleBack
      || !window.WeightPlayScreenFrame || !window.WeightPlayPlayUI) {
    throw new Error("ANIMAL_CRATEBOUND_I9_FRAME_REQUIRED");
  }

  document.body.dataset.wpInterfaceVersion = "9";
  const poster = byId("poster");
  const copy = main.querySelector(".hero-copy");
  const summary = byId("pitch");
  const progress = byId("mainProgress");
  const start = byId("start");
  poster?.setAttribute("data-wp-frame-poster", "");
  copy?.setAttribute("data-wp-frame-copy", "");
  summary?.setAttribute("data-wp-frame-summary", "");
  progress?.setAttribute("data-wp-frame-progress", "");
  start?.setAttribute("data-wp-main-start", "");
  start?.setAttribute("data-wp-frame-action", "primary");

  const mainTitle = mainHeader.querySelector("[data-wp-game-title]");
  mainTitle?.setAttribute("data-wp-frame-title", "");
  const stageFrameTitle = stageHeader.querySelector("[data-wp-frame-title]");
  const battleFrameTitle = battleHeader.querySelector("[data-wp-frame-title]");
  const locale = () => {
    const raw = window.WonderI18n?.actualLocale?.()
      || window.WonderI18n?.locale?.()
      || document.documentElement.lang
      || "en";
    if (/^zh-(tw|hant)/i.test(raw)) return "zh-Hant";
    if (/^zh/i.test(raw)) return "zh-Hans";
    if (/^pt/i.test(raw)) return "pt-BR";
    return raw.split("-")[0];
  };
  const stageHeadings = {
    en: "Warehouse", "zh-Hant": "選倉庫", "zh-Hans": "选仓库",
    ja: "倉庫", ko: "창고", es: "Almacén",
    "pt-BR": "Armazém", fr: "Entrepôt", de: "Lager",
    it: "Magazzino", ru: "Склад", hi: "गोदाम", ar: "مستودع",
  };
  const stageHeading = document.createElement("strong");
  stageHeading.textContent = stageHeadings[locale()] || stageHeadings.en;
  stageSummary.hidden = false;
  const stageMeta = document.createElement("div");
  stageMeta.className = "wp-cratebound-stage-meta";
  const stageMetaContent = document.createElement("div");
  stageMetaContent.className = "wp-cratebound-stage-meta-content";
  stageMetaContent.append(stageHeading, stageSummary);
  stageMeta.append(stageMetaContent);

  const frame = window.WeightPlayScreenFrame.mount({
    root,
    localeSelect,
    playUI: true,
    scenes: {
      main: { root: main, header: mainHeader, content: main.querySelector(".hero") },
      stage: { root: stage, header: stageHeader, content: stageWorkspace },
      battle: { root: battle, header: battleHeader, content: battleContent },
    },
  });

  const stageGroup = window.WeightPlayScreenFrame.createGroup().add(stageMeta);
  const battleHud = document.createElement("div");
  battleHud.className = "wp-cratebound-battle-hud";
  const battleHudContent = document.createElement("div");
  battleHudContent.className = "wp-cratebound-battle-hud-content";
  battleHudContent.append(battleTitle, battleStats);
  battleHud.append(battleHudContent);
  frame.stageTopUI.clear().add(stageGroup);
  const battleGroup = window.WeightPlayScreenFrame.createGroup().add(battleHud);
  frame.battleTopUI.clear().add(battleGroup);
  stageTab.dataset.wpFrameAction = "tab";
  stageTab.setAttribute("aria-pressed", "true");
  frame.commonDownButton.clear().add(stageTab);
  frame.activate("main");

  const bridge = window.AnimalCrateboundI9StageBridge;
  const config = window.AnimalCrateboundStageConfig?.create(bridge);
  let selector = null;
  const selectedIndex = context => Math.max(0, Math.min(29, (Number(context?.getCentered?.()) || 1) - 1));
  function renderStage(context) {
    if (context) bridge.context = context;
    const current = bridge.context;
    if (!current || !config) return false;
    if (!selector) {
      selector = window.WeightPlayPlayUI.mountStage({
        page: stageWorkspace,
        rail: stageRail,
        config,
        selected: selectedIndex(current),
        isActive: () => document.body.dataset.screen === "stage",
        onSelect(index) { bridge.context?.setCentered?.(index + 1); },
        onStart(index) { bridge.context?.enter?.(index + 1); },
      });
    } else {
      selector.refresh(selectedIndex(current));
    }
    return true;
  }
  const renderer = Object.freeze({
    render: renderStage,
    refresh(context) { return renderStage(context); },
  });
  window.BlockTrilogyStageRenderer = renderer;
  if (bridge?.context) renderStage(bridge.context);

  const syncScene = () => {
    const name = document.body.dataset.screen;
    if (!["main", "stage", "battle"].includes(name) || frame.active === name) return;
    frame.activate(name);
    if (name === "stage" && bridge?.context) selector?.refresh(selectedIndex(bridge.context));
  };
  const sceneObserver = new MutationObserver(syncScene);
  sceneObserver.observe(document.body, { attributes: true, attributeFilter: ["data-screen"] });
  const refreshStageLocale = () => {
    stageHeading.textContent = stageHeadings[locale()] || stageHeadings.en;
    selector?.refresh(selector.selected);
  };
  window.addEventListener("wonder:locale-change", refreshStageLocale);
  window.addEventListener("wonder:i18n-ready", refreshStageLocale);
  window.addEventListener("pagehide", event => {
    if (event.persisted) return;
    sceneObserver.disconnect();
    window.removeEventListener("wonder:locale-change", refreshStageLocale);
    window.removeEventListener("wonder:i18n-ready", refreshStageLocale);
    selector?.destroy();
    frame.destroy();
  }, { once: true });
})();
