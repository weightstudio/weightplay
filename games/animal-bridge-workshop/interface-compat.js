(() => {
  "use strict";

  const battle = document.getElementById("battleScreen");
  const head = battle?.querySelector(".battle-head");
  const mainSettingsButton = document.getElementById("settingsButton");
  const mainSettingsPopover = document.getElementById("settingsPopover");
  const mainSoundButton = document.getElementById("soundButton");
  if (!battle || !head || !mainSettingsButton || !mainSoundButton) return;

  let settingsButton = document.getElementById("battleSettingsButton");
  let settingsPopover = document.getElementById("battleSettingsPopover");
  let soundButton = document.getElementById("battleSoundButton");

  if (!settingsButton) {
    settingsButton = document.createElement("button");
    settingsButton.id = "battleSettingsButton";
    settingsButton.className = "secondary battle-settings-button";
    settingsButton.type = "button";
    settingsButton.dataset.wpSettings = "";
    settingsButton.setAttribute("aria-expanded", "false");
    settingsButton.setAttribute("aria-controls", "battleSettingsPopover");
    settingsButton.textContent = "⚙";
    head.appendChild(settingsButton);
  }

  if (!settingsPopover) {
    settingsPopover = document.createElement("aside");
    settingsPopover.id = "battleSettingsPopover";
    settingsPopover.className = "settings-popover battle-settings-popover";
    settingsPopover.hidden = true;

    soundButton = document.createElement("button");
    soundButton.id = "battleSoundButton";
    soundButton.className = "secondary";
    soundButton.type = "button";
    soundButton.dataset.soundToggle = "";
    settingsPopover.appendChild(soundButton);
    head.appendChild(settingsPopover);
  }

  const syncCopy = () => {
    settingsButton.setAttribute("aria-label", mainSettingsButton.getAttribute("aria-label") || "Settings");
    soundButton.textContent = mainSoundButton.textContent;
    soundButton.setAttribute("aria-pressed", mainSoundButton.getAttribute("aria-pressed") || "true");
  };

  const closeBattleSettings = () => {
    settingsPopover.hidden = true;
    settingsButton.setAttribute("aria-expanded", "false");
  };

  settingsButton.addEventListener("click", () => {
    const open = settingsPopover.hidden;
    if (mainSettingsPopover) mainSettingsPopover.hidden = true;
    mainSettingsButton.setAttribute("aria-expanded", "false");
    syncCopy();
    settingsPopover.hidden = !open;
    settingsButton.setAttribute("aria-expanded", String(open));
  });

  soundButton.addEventListener("click", () => {
    mainSoundButton.click();
    syncCopy();
  });

  document.getElementById("battleBack")?.addEventListener("click", closeBattleSettings);
  document.getElementById("homeButton")?.addEventListener("click", closeBattleSettings);
  document.getElementById("startButton")?.addEventListener("click", closeBattleSettings);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !settingsPopover.hidden) {
      closeBattleSettings();
      settingsButton.focus();
    }
  });

  syncCopy();
})();
