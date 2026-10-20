(function () {
  "use strict";

  const current = document.currentScript;
  if (!current) return;
  const base = new URL("game-v10-base.js?v=20261021-echo-orchard-i9", current.src).href;
  const adapter = new URL("interface-9-adapter.js?v=20261021-echo-orchard-i9", current.src).href;

  if (document.readyState === "loading") {
    document.write(`<script src="${base}"><\/script><script src="${adapter}"><\/script>`);
    return;
  }

  const load = (src) => new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.onload = resolve;
    script.onerror = reject;
    document.body.append(script);
  });

  load(base).then(() => load(adapter)).catch((error) => console.error("Orchard I9 interface failed to load.", error));
})();
