(() => {
  "use strict";
  // Text Growth copy is owned by generated initial HTML. Locale changes use
  // the existing localized route instead of maintaining a second copy catalog.
  const select = document.getElementById("localeSelect");
  if (!select) return;
  const routes = { en:"en", "zh-Hant":"zh-tw", "zh-Hans":"zh-cn", ja:"ja", ko:"ko", es:"es", "pt-BR":"pt-br", fr:"fr", de:"de", it:"it", ru:"ru", hi:"hi", ar:"ar" };
  select.addEventListener("change", () => {
    const segment = routes[select.value];
    if (!segment) return;
    const target = "/" + segment + "/games/animal-cafe-rush/" + location.search + location.hash;
    if (location.pathname !== "/" + segment + "/games/animal-cafe-rush/") location.href = target;
  });
})();
