(function () {
  "use strict";

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

  window.WPCardGamesNext?.mount({ id: "cribbage" });
})();
