(() => {
  "use strict";

  window.WPPopularArcade?.mount("breakout");
  const load = (src, next) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = next;
    script.onerror = next;
    document.head.append(script);
  };
  load("/src/site-config.js?v=20260903-breakout-result-v13", () => {
    load("/src/analytics.js?v=20260903-breakout-result-v13", () => {
      load("/games/breakout/analytics-ownership.js?v=20260903-breakout-result-v13");
    });
  });
})();
