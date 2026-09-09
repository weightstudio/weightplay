(() => {
  const script = document.createElement("script");
  script.src = "../../src/market-five-games.js?v=20260910-habitat-builder-result-v14";
  script.addEventListener("load", () => {
    const utility = document.querySelector("#battle-utility");
    if (utility) {
      utility.dataset.m5Aria = "battleUtility";
      utility.setAttribute("aria-label", window.wpMarketCommon?.(22) || "Game controls");
    }

    const controls = document.querySelector("#battle-controls");
    const result = document.querySelector("#result-screen");
    if (!controls || !result) return;
    const syncResultControls = () => {
      const resultVisible = !result.hidden;
      if (resultVisible) controls.style.setProperty("display", "none", "important");
      else controls.style.removeProperty("display");
      controls.toggleAttribute("inert", resultVisible);
      controls.setAttribute("aria-hidden", String(resultVisible));
    };
    new MutationObserver(syncResultControls).observe(result, { attributes: true, attributeFilter: ["hidden"] });
    syncResultControls();
  });
  document.currentScript.after(script);
})();
