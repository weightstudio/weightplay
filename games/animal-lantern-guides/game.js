(() => {
  "use strict";

  const source = document.currentScript?.src || new URL("game.js", location.href).href;
  const here = (name) => new URL(name, source).href;
  const load = (src, marker) => new Promise((resolve, reject) => {
    if (marker && document.querySelector(`script[data-wp-loader="${marker}"]`)) { resolve(); return; }
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    if (marker) script.dataset.wpLoader = marker;
    script.addEventListener("load", resolve, { once: true });
    script.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
    document.head.append(script);
  });

  (async () => {
    if (!window.WeightPlayStageV6) {
      await load(new URL("../../src/stage-virtualization-standard.js?v=20260924-interface7-fix2", source).href, "lantern-stage-v7");
    }
    await load(here("interface-7-compat.js?v=20260924-interface7-fix2"), "lantern-compat-v7");
    await load(here("game-v11-base.js?v=20260912-animal-lantern-guides-v11-block-campaign&wp-audio=1.0.0&wp-interface7=2"), "lantern-v11-base");
  })().catch((error) => {
    console.error("[Animal Lantern Guides] Interface 7 loader failed", error);
    if (!document.querySelector('script[data-wp-loader="lantern-v11-fallback"]')) {
      const fallback = document.createElement("script");
      fallback.src = here("game-v11-base.js?v=20260912-animal-lantern-guides-v11-block-campaign&wp-audio=1.0.0&wp-interface7=2");
      fallback.async = false;
      fallback.dataset.wpLoader = "lantern-v11-fallback";
      document.head.append(fallback);
    }
  });
})();
