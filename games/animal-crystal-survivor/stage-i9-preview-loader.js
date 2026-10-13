(() => {
  const params = new URLSearchParams(window.location.search);
  const host = window.location.hostname;
  const loopback = window.location.protocol === "http:"
    && ["localhost", "127.0.0.1", "[::1]", "::1"].includes(host);
  if (!loopback || params.get("preview") !== "1") return;

  document.documentElement.dataset.crystalStageI9Preview = "true";
  const base = new URL("/games/animal-crystal-survivor/", window.location.origin);
  const addStyle = (href) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.append(link);
  };
  addStyle(new URL("/src/stage-rail-i9.css?v=20261013-stage-rail-i9-header-spacing7", window.location.origin).href);
  addStyle(new URL("stage-i9-preview.css?v=20261013-crystal-stage-i9-preview7", base).href);
  const common = document.createElement("script");
  common.src = new URL("/src/stage-rail-i9.js?v=20261013-stage-rail-i9-header-spacing7", window.location.origin).href;
  common.onload = () => {
    const script = document.createElement("script");
    script.src = new URL("stage-i9-preview.js?v=20261013-crystal-stage-i9-preview7", base).href;
    document.head.append(script);
  };
  document.head.append(common);
})();
