/* Permanent Honey Shield Interface 9 Stage treatment. */
(() => {
  "use strict";
  const version = "honey-stage-i9-permanent-1";
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
  document.documentElement.dataset.honeyStageI9 = "true";
  style("/src/stage-rail-i9.css");
  style("/games/animal-honey-shield/stage-i9.css");
  (async () => {
    if (!window.WeightPlayStageRailI9) await script("/src/stage-rail-i9.js");
    window.dispatchEvent(new Event("weightplay:stage-rail-ready"));
    await script("/games/animal-honey-shield/stage-i9.js");
  })().catch((error) => console.error("Honey Shield Stage I9 could not load", error));
})();
