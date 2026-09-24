(() => {
  "use strict";

  const byId = (id) => document.getElementById(id);
  const stage = byId("stageScreen");
  const battle = byId("battleScreen");
  const rail = byId("stageList");
  const stageCanvas = stage?.querySelector(".stage-canvas") || stage;
  const tabs = stage?.querySelector(".stage-tabs");
  let tab = byId("stage-tab") || tabs?.querySelector("button");

  const stageLabels = {
    en: "Stages", "zh-Hant": "關卡", "zh-Hans": "关卡", ja: "ステージ",
    ko: "스테이지", es: "Niveles", "pt-BR": "Fases", fr: "Niveaux",
    de: "Stufen", it: "Livelli", ru: "Уровни", hi: "स्तर", ar: "المراحل"
  };
  const aliases = { "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", "pt-br": "pt-BR" };
  const locale = () => {
    const raw = document.documentElement.lang || "en";
    return stageLabels[raw] ? raw : (aliases[raw.toLowerCase()] || "en");
  };
  const syncStageLabel = () => {
    if (tab) tab.textContent = stageLabels[locale()] || stageLabels.en;
  };

  stage?.setAttribute("data-wp-logical-stage-canvas", "");
  stage?.setAttribute("data-wp-canvas-max-width", "920");
  stageCanvas?.setAttribute?.("data-wp-standard-stage-screen", "");
  battle?.setAttribute("data-wp-logical-battle-canvas", "");
  battle?.setAttribute("data-wp-canvas-max-width", "920");

  if (rail && stageCanvas) {
    let workspace = stageCanvas.querySelector(".stage-workspace");
    if (!workspace) {
      workspace = document.createElement("div");
      workspace.className = "stage-workspace";
      rail.before(workspace);
    }
    workspace.append(rail);
    rail.removeAttribute("data-wp-stage-v6-auto");
    rail.dataset.wpStageRail = "";
    rail.dataset.wpStageRecommendation = "last";
  }

  if (tabs && stageCanvas && tab) {
    tab.id = "stage-tab";
    tab.removeAttribute("data-copy");
    tab.type = "button";
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", "true");
    const left = document.createElement("span");
    left.className = "stage-tab-slot";
    left.setAttribute("aria-hidden", "true");
    const right = left.cloneNode(false);
    tabs.replaceChildren(left, tab, right);
    stageCanvas.append(tabs);
    syncStageLabel();
  }

  byId("stageBackBtn")?.removeAttribute("data-copy");
  byId("battleBackBtn")?.removeAttribute("data-copy");

  const updateLeaveStageName = () => {
    const layer = byId("lantern-leave-layer");
    const copyNode = byId("lantern-leave-copy");
    if (!layer || layer.hidden || !copyNode || copyNode.dataset.wpStageNamed === "true") return;
    const stageName = byId("battleHeading")?.textContent?.trim() || byId("roundLabel")?.textContent?.trim();
    if (!stageName) return;
    copyNode.textContent = `${stageName} — ${copyNode.textContent}`;
    copyNode.dataset.wpStageNamed = "true";
  };

  const leaveObserver = new MutationObserver(() => {
    const copyNode = byId("lantern-leave-copy");
    if (copyNode && byId("lantern-leave-layer")?.hidden) delete copyNode.dataset.wpStageNamed;
    updateLeaveStageName();
  });
  leaveObserver.observe(battle || document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["hidden"] });

  const localeObserver = new MutationObserver(syncStageLabel);
  localeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  window.addEventListener("pagehide", () => {
    leaveObserver.disconnect();
    localeObserver.disconnect();
  }, { once: true });
})();