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
  loadAfterAnchor("answer-slot-deck.js?v=20261018-v11-i9", () => {
    loadAfterAnchor("stellar-presentation.js?v=20261018-v11-i9", () => {
      loadAfterAnchor("game-engine.js?v=20261018-v11-i9-scene-roots1");
    });
  });
})();
