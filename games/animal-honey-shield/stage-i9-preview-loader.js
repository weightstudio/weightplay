/* Owner-requested visual sample. Normal game entries keep their current UI. */
(() => {
  "use strict";
  if (new URLSearchParams(location.search).get("stage-i9") !== "1") return;
  const version = "honey-stage-i9-sample-1";
  const style = (path) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${path}?v=${version}`;
    document.head.append(link);
  };
  const script = (path) => new Promise((resolve, reject) => {
    const node = document.createElement("script");
    node.src = `${path}?v=${version}`;
    node.onload = resolve;
    node.onerror = reject;
    document.head.append(node);
  });
  document.documentElement.dataset.honeyStageI9Preview = "true";
  style("/src/stage-rail-i9.css");
  style("/games/animal-honey-shield/stage-i9-preview.css");
  (async () => {
    if (!window.WeightPlayStageRailI9) await script("/src/stage-rail-i9.js");
    await script("/games/animal-honey-shield/stage-i9-preview.js");
  })().catch((error) => console.error("Honey Shield Stage preview could not load", error));
})();
