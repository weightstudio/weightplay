(function () {
  "use strict";

  // Old Maid uses the shared card-game shell, but owns two small shell
  // surfaces that the generic Stage progress heuristic cannot infer: the
  // blind-draw progress cue on Main and the Battle utility slot. Create them
  // before mounting so the Shell and card runtime adopt the same stable DOM
  // nodes on every localized route.
  // The shared shell is the sole visible Settings owner. Keep the legacy
  // audio nodes available for the card runtime to adopt its locale controls,
  // but remove their button and popover from the active accessibility tree so
  // the Main header cannot expose two Settings affordances.
  const legacySettingsButton = document.querySelector("#audioMenuBtn");
  if (legacySettingsButton) {
    legacySettingsButton.hidden = true;
    legacySettingsButton.setAttribute("aria-hidden", "true");
    legacySettingsButton.tabIndex = -1;
  }
  const legacySettingsPopover = document.querySelector("#audioPopover");
  if (legacySettingsPopover) legacySettingsPopover.hidden = true;

  const handLabels = {
    en: "Your hand",
    "zh-Hant": "你的手牌",
    "zh-Hans": "你的手牌",
    ja: "手札",
    ko: "내 패",
    es: "Tu mano",
    "pt-BR": "Sua mão",
    fr: "Votre main",
    de: "Deine Hand",
    it: "La tua mano",
    ru: "Ваша рука",
    hi: "आपके पत्ते",
    ar: "يدك",
  };
  const syncHandLabel = () => {
    const label = document.querySelector(".card-game-player-header strong");
    if (!label) return;
    const locale = document.documentElement.lang || "en";
    label.textContent = handLabels[locale] || handLabels.en;
    label.setAttribute("data-runtime-localize", "off");
  };
  window.addEventListener("wonder:locale-change", syncHandLabel);
  window.addEventListener("weightplay:shell-sync", syncHandLabel);

  const mainCopy = document.querySelector("#mainScreen .main-copy");
  if (mainCopy && !mainCopy.querySelector("[data-wp-main-progress]")) {
    const progress = document.createElement("div");
    progress.className = "main-progress";
    progress.dataset.wpMainProgress = "true";
    progress.setAttribute("role", "status");
    progress.setAttribute("aria-live", "polite");
    const label = document.createElement("strong");
    label.textContent = "Blind-draw pairs";
    const copy = document.createElement("span");
    copy.textContent = "Clear pairs and avoid the Old Maid.";
    progress.append(label, copy);
    mainCopy.insertBefore(progress, mainCopy.querySelector(".main-actions") || null);
  }

  const topbar = document.querySelector("#battleScreen .card-game-topbar");
  if (topbar && !topbar.querySelector("[data-wp-battle-utility]")) {
    const utility = document.createElement("button");
    utility.id = "battleUtilityBtn";
    utility.className = "battle-utility header-icon-btn";
    utility.type = "button";
    utility.dataset.wpBattleUtility = "true";
    utility.setAttribute("aria-label", "Settings");
    utility.title = "Settings";
    utility.textContent = "⚙";
    topbar.append(utility);
  }

  window.WPCardGamesNext?.mount({ id: "old-maid" });
  syncHandLabel();
  window.setTimeout(syncHandLabel, 0);
  window.setTimeout(syncHandLabel, 400);
})();
