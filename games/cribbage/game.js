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

  const result = document.querySelector("#resultOverlay");
  const resultTitle = document.querySelector("#resultTitle");
  const liveBattle = document.querySelector("#battleScreen .card-table-ui");
  let resultWasOpen = false;
  let returnFocus = null;
  const syncResultAccessibility = () => {
    const open = Boolean(result && !result.hidden);
    if (liveBattle) {
      liveBattle.inert = open;
      if (open) liveBattle.setAttribute("aria-hidden", "true");
      else liveBattle.removeAttribute("aria-hidden");
    }
    if (open) {
      if (!resultWasOpen) returnFocus = document.activeElement;
      resultTitle?.focus({ preventScroll: true });
    } else if (resultWasOpen) {
      if (returnFocus instanceof HTMLElement && returnFocus.isConnected && !returnFocus.closest("[hidden]") && !returnFocus.disabled) {
        returnFocus.focus({ preventScroll: true });
      } else if (!document.querySelector("#battleScreen")?.hidden) {
        document.querySelector("#battleBackBtn")?.focus({ preventScroll: true });
      }
      returnFocus = null;
    }
    resultWasOpen = open;
  };
  if (result) {
    new MutationObserver(syncResultAccessibility).observe(result, { attributes: true, attributeFilter: ["hidden"] });
    syncResultAccessibility();
  }

  window.WPCardGamesNext?.mount({ id: "cribbage" });
})();
