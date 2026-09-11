(function () {
  "use strict";

  // Wordle owns its responsive Battle composition. Mark that boundary before
  // the Interface 7 bootstrap can allocate the shared scaler so the native
  // board, keyboard, and command row retain their hit-testable dimensions.
  document.body.dataset.wpBattleLayout = "native";
  window.WPPopularArcade?.mount("wordle");
  document.body.dataset.gameVersion = "v15";

  const ensureGuideContract = () => {
    const guide = document.querySelector(".game-page-info-static[data-wp-game-guide]");
    if (!guide) return;
    // Interface 7's compatibility token is intentionally compact (3px). The
    // Wordle Guide is an authored structured surface, so preserve its framed
    // treatment explicitly at the element boundary.
    guide.style.setProperty("border-radius", "24px", "important");
    guide.style.setProperty("border-width", "1px", "important");
    guide.style.setProperty("background", "rgb(255 253 247 / 96%)", "important");
    guide.style.setProperty("box-shadow", "0 10px 24px rgb(38 82 71 / 6%)", "important");
    guide.querySelectorAll(".game-info-section").forEach((section) => {
      section.style.setProperty("border-radius", "16px", "important");
      section.style.setProperty("border-width", "1px", "important");
      section.style.setProperty("background", "rgb(255 255 255 / 100%)", "important");
    });
  };
  ensureGuideContract();
  window.setTimeout(ensureGuideContract, 0);
}());
