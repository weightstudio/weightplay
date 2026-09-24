(function () {
  "use strict";

  const current = document.currentScript;
  if (!current) return;
  const base = new URL("game-v10-base.js?v=20260923-interface7-source-base", current.src).href;
  const virtualization = new URL("../../src/stage-virtualization-standard.js?v=20260809-stage-v6-source-demotion-v8", current.src).href;
  const compat = new URL("interface-7-compat.js?v=20260923-interface7-cleanup-v1", current.src).href;

  if (document.readyState === "loading") {
    document.write(`<script src="${base}"><\/script><script src="${virtualization}"><\/script><script src="${compat}"><\/script>`);
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

  load(base).then(() => load(virtualization)).then(() => load(compat)).catch(() => {});
})();