/* Keep the legacy Block Trilogy runtime from constructing a private Stage rail. */
(() => {
  "use strict";
  if (document.body?.dataset.wpGameId !== "animal-cratebound") return;
  const bridge = { context: null };
  bridge.renderer = Object.freeze({
    render(context) { bridge.context = context; return true; },
    refresh(context) { if (context) bridge.context = context; return true; },
  });
  window.AnimalCrateboundI9StageBridge = bridge;
  window.BlockTrilogyStageRenderer = bridge.renderer;
})();
