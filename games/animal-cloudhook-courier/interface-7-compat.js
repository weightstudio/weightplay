(() => {
  "use strict";
  // Cloudhook's locale extension is loaded before game.js on the canonical
  // route and every public locale route. It owns the single Interface 7
  // compatibility bootstrap so Stage virtualization, Result normalization,
  // and observers cannot be registered twice. Keep this legacy include as a
  // harmless compatibility marker for the canonical page.
  window.WPCloudhookInterface7 ||= {};
})();
