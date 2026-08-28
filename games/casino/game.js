(function () {
  "use strict";

  // Casino owns the rank/sum Capture loop, so its Main progress and Battle
  // utility are created in the game entry before the shared card-game mount.
  // This keeps the same shell contract on the canonical and every localized
  // route without changing Capture, Build, Trail, or scoring ownership.
  const legacySettings = document.querySelector("#audioMenuBtn");
  const legacySettingsGroup = legacySettings?.closest(".header-utilities");
  if (legacySettings && legacySettingsGroup) {
    legacySettingsGroup.classList.add("settings-control");
    legacySettings.setAttribute("aria-controls", "audioPopover");
  }
  const mainCopy = document.querySelector("#mainScreen .main-copy");
  if (mainCopy && !mainCopy.querySelector("[data-wp-main-progress]")) {
    const progress = document.createElement("div");
    progress.className = "main-progress";
    progress.dataset.wpMainProgress = "true";
    progress.setAttribute("role", "status");
    progress.setAttribute("aria-live", "polite");
    const label = document.createElement("strong");
    label.textContent = "Capture progress";
    const copy = document.createElement("span");
    copy.textContent = "Capture table cards by rank or sum.";
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

  window.WPCardGamesNext?.mount({ id: "casino" });
})();
