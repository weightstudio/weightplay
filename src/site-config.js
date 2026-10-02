// BEGIN generated from src/lobby-data.js audiences.tabletopGameIds; run scripts/sync-tabletop-classification.mjs
if (!window.__weightPlayTabletopGameIds) window.__weightPlayTabletopGameIds = new Set(["klondike-solitaire","spider-solitaire","freecell-solitaire","pyramid-solitaire","tripeaks-solitaire","golf-solitaire","yukon-solitaire","hearts","spades","gin-rummy","crazy-eights","cribbage","go-fish","war","speed","old-maid","casino","checkers","tic-tac-toe","peg-solitaire","reversi","four-in-a-row","chess","mahjong-solitaire"]);
// END generated tabletop classification
// BEGIN generated from src/lobby-data.js audiences.castleBlockRewardExcludedGameIds; run scripts/sync-tabletop-classification.mjs
if (!window.__weightPlayCastleBlockRewardExcludedGameIds) window.__weightPlayCastleBlockRewardExcludedGameIds = new Set(["animal-crownfall"]);
// END generated Castle Block reward exclusions

window.WONDER_SITE = {
  version: "v0.37.05",
  localization: {
    defaultLocale: "en",
    fallbackLocale: "en",
    phaseOneLocales: ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"],
    plannedLocales: [],
    useLocaleRoutes: true,
  },
  isTabletopGameId(gameId) { return window.__weightPlayTabletopGameIds?.has(String(gameId || "").trim()) === true; },
  gameIdFromPath(pathname = location.pathname) {
    const match = String(pathname).match(/(?:^|\/)games\/([^/]+)/i);
    return match?.[1] || "";
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
  bootstrap.src = new URL("shared-interface-bootstrap.js?v=20260921-interface7-single-frame-v2", currentScript?.src || document.baseURI).href;
  bootstrap.dataset.wpSharedInterface = "7";
  document.head.append(bootstrap);
}

// Game entries share the same collector, including routes without a legacy
// analytics script tag. Wait for parsing so existing ordered tags retain ownership.
if (typeof document !== "undefined" && /(?:^|\/)games\/[^/]+(?:\/|$)/i.test(location.pathname)) {
  const ensureGameAnalytics = () => {
    if (!/^https?:$/.test(location.protocol)) return;
    if (window.WonderAnalytics || window.__weightPlayAnalyticsRequested
      || document.querySelector('script[data-wp-analytics-loader]')) return;
    window.__weightPlayAnalyticsRequested = true;
    const script = document.createElement("script");
    script.src = new URL("/src/analytics.js", location.origin).href;
    script.async = true;
    script.dataset.wpAnalyticsLoader = "true";
    document.head.append(script);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ensureGameAnalytics, { once: true });
  else ensureGameAnalytics();
}
