window.WONDER_SITE = {
    version: "v0.21.95",
  localization: {
    defaultLocale: "en",
    fallbackLocale: "en",
    phaseOneLocales: ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"],
    plannedLocales: [],
    useLocaleRoutes: true,
  },
  analytics: {
    gaMeasurementId: "G-PP4XJGHCD3",
    debug: false,
  },
};

// Every lobby and game that loads the shared site configuration also owns the
// same anti-selection and anti-double-tap boundary. Individual pages may still
// include edge-guard.js explicitly; the guard is idempotent.
if (typeof document !== "undefined" && !window.__weightPlayEdgeGuardRequested) {
  window.__weightPlayEdgeGuardRequested = true;
  const currentScript = document.currentScript;
  const guard = document.createElement("script");
  guard.src = new URL("edge-guard.js", currentScript?.src || document.baseURI).href;
  guard.dataset.wpSharedEdgeGuard = "true";
  document.head.append(guard);
}
