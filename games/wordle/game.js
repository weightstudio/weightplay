(function () {
  "use strict";

  // Wordle owns its responsive Battle composition. Mark that boundary before
  // the Interface 7 bootstrap can allocate the shared scaler so the native
  // board, keyboard, and command row retain their hit-testable dimensions.
  document.body.dataset.wpBattleLayout = "native";
  window.WPPopularArcade?.mount("wordle");
  document.body.dataset.gameVersion = "v16";
}());
