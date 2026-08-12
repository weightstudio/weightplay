(() => {
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
  const base = new URL(".", document.currentScript?.src || document.baseURI).href;
  document.write(`<script src="${base}runtime-locales/${segment}.js?v=20260812-skyport-route-v4"><\/script>`);
  document.write(`<script src="${base}game-runtime-localizer.js?v=20260721-pattern1"><\/script>`);
})();
