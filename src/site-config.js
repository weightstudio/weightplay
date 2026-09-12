window.WONDER_SITE = {
  version: "v0.34.22",
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

// Interface 7 is a route-wide contract.  The game bootstrap is deliberately
// loaded from the shared site config so canonical and localized pages cannot
// drift merely because one generated shell omitted a legacy link/script.
if (typeof document !== "undefined" && /(?:^|\/)games\/[^/]+(?:\/|$)/i.test(location.pathname)
  && !window.__weightPlaySharedInterfaceRequested) {
  window.__weightPlaySharedInterfaceRequested = true;
  const currentScript = document.currentScript;
  const bootstrap = document.createElement("script");
  bootstrap.src = new URL("shared-interface-bootstrap.js?v=20260911-authored-posters-complete", currentScript?.src || document.baseURI).href;
  bootstrap.dataset.wpSharedInterface = "7";
  document.head.append(bootstrap);
}
