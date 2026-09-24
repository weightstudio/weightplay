(() => {
  const base = new URL(".", document.currentScript?.src || document.baseURI).href;
  const gameId = location.pathname.match(/\/games\/([^/]+)/)?.[1] || "";
  if (gameId === "animal-cratebound" && !document.querySelector('script[data-wp-cratebound-interface7-preload]')) {
    const preload = new URL("../games/animal-cratebound/interface-7-preload.js?v=20260923-cratebound-interface7-preload1", base).href;
    document.write(`<script src="${preload}" data-wp-cratebound-interface7-preload><\/script>`);
  }

  const locale = window.WonderI18n?.actualLocale?.() || document.documentElement.lang || "en";
  if (locale === "en") return;
  const segment = {
    "zh-Hant": "zh-tw",
    "zh-Hans": "zh-cn",
    es: "es",
    ja: "ja",
    ko: "ko",
    "pt-BR": "pt-br",
    fr: "fr",
    de: "de",
    it: "it",
    ru: "ru",
    hi: "hi",
    ar: "ar",
  }[locale];
  if (!segment) return;
  document.write(`<script src="${base}runtime-locales/${segment}.js?v=20260910-auto-squad-relic-free-v1"><\/script>`);
  document.write(`<script src="${base}game-runtime-localizer.js?v=20260721-pattern1"><\/script>`);
})();
