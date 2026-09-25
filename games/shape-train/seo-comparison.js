(() => {
  "use strict";
  // Shape Train owns its complete static Guide. Keep the shared Guide hydrator
  // from replacing the localized Text Growth 1.3.0 initial HTML after load.
  document.body?.setAttribute("data-wp-game-owned-guide", "true");

  const select = document.getElementById("localeSelect");
  if (!select) return;
  const routes = { en:"en", "zh-Hant":"zh-tw", "zh-Hans":"zh-cn", ja:"ja", ko:"ko", es:"es", "pt-BR":"pt-br", fr:"fr", de:"de", it:"it", ru:"ru", hi:"hi", ar:"ar" };
  select.addEventListener("change", () => {
    const segment = routes[select.value];
    if (!segment) return;
    const target = "/" + segment + "/games/shape-train/" + location.search + location.hash;
    if (location.pathname !== "/" + segment + "/games/shape-train/") location.href = target;
  });
})();
