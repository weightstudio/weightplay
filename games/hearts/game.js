(function () {
  "use strict";
  const result = document.querySelector("#resultOverlay");
  const battleCanvas = document.querySelector("#battleScreen [data-wp-logical-battle-canvas]");
  if (result && battleCanvas && result.parentElement !== battleCanvas) battleCanvas.append(result);
  if (result) {
    result.setAttribute("aria-labelledby", "resultTitle");
    result.setAttribute("aria-describedby", "resultText");
    result.dataset.wpFrameLogicalActions = "battle";
    result.querySelector(".result-card")?.setAttribute("data-wp-frame-result-card", "");
    result.querySelector(".result-actions")?.classList.add("logic-result-actions");
  }
  window.WPCardGamesNext?.mount({ id: "hearts" });
})();
