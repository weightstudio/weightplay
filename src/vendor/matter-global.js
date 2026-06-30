(function () {
  if (window.Matter) return;
  try {
    if (typeof module === "object" && module.exports) {
      window.Matter = module.exports.Matter || module.exports;
    } else if (typeof exports === "object") {
      window.Matter = exports.Matter || exports;
    }
  } catch {
    // The game will show its own physics loading fallback.
  }
})();
