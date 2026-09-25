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
    loadAfterAnchor("game-v7-base.js?v=20260925-constellation-keeper-v9-i7-issue-f1-f5&wp-audio=1.0.0", () => {
      loadAfterAnchor("interface-7-compat.js?v=20260925-constellation-keeper-v9-i7-issue-f1-f5");
    });
  };
  if (window.WeightPlayStageV6?.install) loadBase();
  else loadAfterAnchor("/src/stage-virtualization-standard.js?v=20260924-interface7-bounded-stage1", loadBase);
})();
