(() => {
  "use strict";
  const anchor = document.currentScript;
  const loadAfterAnchor = (src, onLoad) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    if (onLoad) script.addEventListener("load", onLoad, { once: true });
    anchor.after(script);
  };
  const loadBase = () => {
    loadAfterAnchor("answer-slot-deck.js?v=20261018-v10", () => {
      loadAfterAnchor("stellar-presentation.js?v=20261018-v10", () => loadAfterAnchor("game-engine.js?v=20261018-v10&wp-audio=1.0.0", () => {
        loadAfterAnchor("interface-7-compat.js?v=20261018-v10");
      }));
    });
  };
  if (window.WeightPlayStageV6?.install) loadBase();
  else loadAfterAnchor("/src/stage-virtualization-standard.js?v=20260924-interface7-bounded-stage1", loadBase);
})();
