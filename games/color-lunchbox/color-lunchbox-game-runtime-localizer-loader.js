(() => {
  const locale = window.WonderI18n?.actualLocale?.() || document.documentElement.lang || "en";
  window.ColorLunchboxOwnedRuntimeLocale = locale === "pt-BR" ? locale : null;
})();
