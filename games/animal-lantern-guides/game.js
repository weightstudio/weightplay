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
    await load(here("interface-7-compat.js?v=20261022-animal-lantern-guides-v12-i9"), "lantern-compat-i9");
    await load(here("game-v11-base.js?v=20261022-animal-lantern-guides-v12-i9&wp-audio=1.0.0&wp-interface9=1"), "lantern-v12-base");
  })().catch((error) => {
    console.error("[Animal Lantern Guides] Interface 9 loader failed", error);
    if (!document.querySelector('script[data-wp-loader="lantern-v12-fallback"]')) {
      const fallback = document.createElement("script");
      fallback.src = here("game-v11-base.js?v=20261022-animal-lantern-guides-v12-i9&wp-audio=1.0.0&wp-interface9=1");
      fallback.async = false;
      fallback.dataset.wpLoader = "lantern-v12-fallback";
      document.head.append(fallback);
    }
  });
})();
