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
    const copy = document.createElement("span");
    progress.append(label, copy);
    mainCopy.insertBefore(progress, mainCopy.querySelector(".main-actions") || null);
  }

  window.WeightPlayAudio?.preload?.([
    "card.draw", "card.place", "game.start", "result.lose", "result.win", "ui.click",
  ]);

  window.WPCardGamesNext?.mount({ id: "casino", frameActions: true });
})();
