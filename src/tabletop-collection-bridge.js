/* Opt-in tabletop collection bridge. Presentation only; no rules or saves. */
(() => {
  "use strict";
  if (window.WeightPlayTabletopThemeBridge) return;
  const cardBacks = {
    "tabletop:cardback-midnight-lattice": "repeating-linear-gradient(45deg,#162746 0 7px,#d5b66b 7px 9px,#21395d 9px 16px)",
    "tabletop:cardback-persimmon-bloom": "radial-gradient(circle at 50% 50%,#f1bd78 0 13%,transparent 14%),repeating-conic-gradient(#f7ead4 0 18deg,#c76b48 18deg 36deg)",
  };
  const tables = {
    "tabletop:table-walnut-study": "repeating-linear-gradient(0deg,#4e301e 0 8px,#67452d 8px 10px,#51331f 10px 18px)",
    "tabletop:table-moonlit-jade": "radial-gradient(ellipse at 50% 38%,#25756a,#145044 70%,#b79a62 72%,#173f37 77%)",
  };
  const style = document.createElement("style");
  style.dataset.weightplayTabletopBridge = "true";
  style.textContent = `
    body.wp-collection-active[data-wp-collection-table="tabletop:table-walnut-study"] .card-table-ui,
    body.wp-collection-active[data-wp-collection-table="tabletop:table-walnut-study"] .board-shell,
    body.wp-collection-active[data-wp-collection-table="tabletop:table-walnut-study"] .card-game-board { background-color:#50331f!important;background-image:repeating-linear-gradient(0deg,#4e301e 0 8px,#67452d 8px 10px,#51331f 10px 18px)!important; }
    body.wp-collection-active[data-wp-collection-table="tabletop:table-moonlit-jade"] .card-table-ui,
    body.wp-collection-active[data-wp-collection-table="tabletop:table-moonlit-jade"] .board-shell,
    body.wp-collection-active[data-wp-collection-table="tabletop:table-moonlit-jade"] .card-game-board { background-color:#145044!important;background-image:radial-gradient(ellipse at 50% 38%,#25756a,#145044 70%,#b79a62 72%,#173f37 77%)!important; }
    body.wp-collection-active[data-wp-collection-card-back="tabletop:cardback-midnight-lattice"] .classic-card.covered,
    body.wp-collection-active[data-wp-collection-card-back="tabletop:cardback-midnight-lattice"] .stock-pile,
    body.wp-collection-active[data-wp-collection-card-back="tabletop:cardback-midnight-lattice"] .card-back,
    body.wp-collection-active[data-wp-collection-card-back="tabletop:cardback-midnight-lattice"] .card.back .card-back-pattern,
    body.wp-collection-active[data-wp-collection-card-back="tabletop:cardback-midnight-lattice"] .playing-card.is-face-down,
    body.wp-collection-active[data-wp-collection-card-back="tabletop:cardback-midnight-lattice"] #cardGameHand::before { background-color:#162746!important;background-image:repeating-linear-gradient(45deg,#162746 0 7px,#d5b66b 7px 9px,#21395d 9px 16px)!important; }
    body.wp-collection-active[data-wp-collection-card-back="tabletop:cardback-persimmon-bloom"] .classic-card.covered,
    body.wp-collection-active[data-wp-collection-card-back="tabletop:cardback-persimmon-bloom"] .stock-pile,
    body.wp-collection-active[data-wp-collection-card-back="tabletop:cardback-persimmon-bloom"] .card-back,
    body.wp-collection-active[data-wp-collection-card-back="tabletop:cardback-persimmon-bloom"] .card.back .card-back-pattern,
    body.wp-collection-active[data-wp-collection-card-back="tabletop:cardback-persimmon-bloom"] .playing-card.is-face-down,
    body.wp-collection-active[data-wp-collection-card-back="tabletop:cardback-persimmon-bloom"] #cardGameHand::before { background-color:#c76b48!important;background-image:radial-gradient(circle at 50% 50%,#f1bd78 0 13%,transparent 14%),repeating-conic-gradient(#f7ead4 0 18deg,#c76b48 18deg 36deg)!important; }
    body.wp-collection-active .classic-card.covered { border:1px solid #e1c782!important; box-shadow:inset 0 0 0 2px #16274688,0 2px 5px #0005!important; }
    @media(prefers-reduced-motion:reduce){body.wp-collection-active *,body.wp-collection-active *::before,body.wp-collection-active *::after{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
  `;
  function equipped() {
    try {
      const state = JSON.parse(localStorage.getItem("weightplayTabletopCollectionV1") || "null");
      return state?.version === 1 ? state.equipped || {} : {};
    } catch { return {}; }
  }
  function refresh() {
    if (!document.body?.classList.contains("wp-collection-active")) return;
    const selection = equipped();
    document.body.dataset.wpCollectionTable = tables[selection.table] ? selection.table : "";
    document.body.dataset.wpCollectionCardBack = cardBacks[selection.cardBack] ? selection.cardBack : "";
    if (!style.isConnected) document.head.append(style);
  }
  window.WeightPlayTabletopThemeBridge = Object.freeze({ refresh });
  window.addEventListener("storage", event => { if (!event.key || event.key === "weightplayTabletopCollectionV1") refresh(); });
  window.addEventListener("WeightPlayTabletopThemeChanged", refresh);
  refresh();
})();
