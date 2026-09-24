(() => {
  "use strict";

  const byId = (id) => document.getElementById(id);
  const stage = byId("stageScreen");
  const battle = byId("battleScreen");
  const rail = byId("garden-list");
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
  battle?.setAttribute("data-wp-logical-battle-canvas", "");
  battle?.setAttribute("data-wp-canvas-max-width", "920");

  if (rail && stage) {
    rail.dataset.wpStageRail = "";
    rail.dataset.wpStageRecommendation = "last";
    let workspace = stage.querySelector(".stage-workspace");
    if (!workspace) {
      const legacy = rail.closest(".content-column");
      if (legacy && legacy.closest("#stageScreen")) {
        workspace = legacy;
        workspace.classList.add("stage-workspace");
      } else {
        workspace = document.createElement("div");
        workspace.className = "stage-workspace";
        rail.before(workspace);
        workspace.append(rail);
      }
    }
  }

  if (tabs && stage && tab) {
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
    stage.append(tabs);
    syncStageLabel();
  }

  const updateLeaveGardenName = () => {
    const layer = byId("ring-leave-panel");
    const copyNode = byId("ring-leave-copy");
    if (!layer || layer.hidden || !copyNode || copyNode.dataset.wpStageNamed === "true") return;
    const name = byId("battle-title")?.textContent?.trim();
    if (!name) return;
    copyNode.textContent = `${name} — ${copyNode.textContent}`;
    copyNode.dataset.wpStageNamed = "true";
  };

  const leaveObserver = new MutationObserver(() => {
    const copyNode = byId("ring-leave-copy");
    if (copyNode && byId("ring-leave-panel")?.hidden) delete copyNode.dataset.wpStageNamed;
    updateLeaveGardenName();
  });
  leaveObserver.observe(battle || document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["hidden"] });

  const localeObserver = new MutationObserver(syncStageLabel);
  localeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  window.addEventListener("pagehide", () => {
    leaveObserver.disconnect();
    localeObserver.disconnect();
  }, { once: true });
})();