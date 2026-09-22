(() => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "interface-7-cleanup.css?v=20260923-moonlight-i7-cleanup2";
  document.head.append(link);

  const script = document.createElement("script");
  script.src = "../../src/market-five-games.js?v=20260820-workshop-v3";
  document.currentScript.after(script);
})();
