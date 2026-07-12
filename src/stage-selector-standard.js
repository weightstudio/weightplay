(function () {
  const railSelector = ".stage-grid,.stage-rail,.mission-grid,.mission-rail,.region-rail,.level-grid";
  const installed = new WeakSet();
  const mainStartByGame = {
    "animal-auto-squad": "#showStageBtn",
    "animal-gearpack-expedition": "#startBtn",
    "animal-guard-yard": "#startGameBtn",
    "animal-hero-trials": "#startBtn",
    "animal-hidden-safari": "#startGameBtn",
    "animal-moonlight-heist": "#startBtn",
    "animal-quiz": "#startGameBtn",
    "animal-rescue": "#showStageBtn",
    "animal-rope-rescue": "#startBtn",
    "beast-tactician": "#startBtn",
    "bubble-bakery": "#startGameBtn",
    "color-lunchbox": "#startBtn",
    "garden-tiles": "#startBtn",
    "shape-train": "#startGameBtn",
    "snack-blocks": "#startBtn",
    "star-memory": "#startBtn",
    "tiny-weather-rescue": "#startGameBtn",
    "zoo-helper-day": "#startGameBtn",
  };

  function gameId() {
    return location.pathname.match(/\/games\/([^/]+)/)?.[1] || "";
  }

  function standardizeMainStart() {
    const button = document.querySelector(mainStartByGame[gameId()] || "[data-wp-main-start]");
    if (!button) return;
    button.dataset.wpMainStart = "true";
    const label = document.documentElement.lang.toLowerCase().startsWith("zh") ? "開始遊戲" : "Start Game";
    if (button.textContent.trim() !== label) button.textContent = label;
  }

  function updateStageState() {
    const active = [...document.querySelectorAll("[data-wp-stage-rail][data-wp-stage-initially-hidden='true']")]
      .some((rail) => rail.getClientRects().length && getComputedStyle(rail).visibility !== "hidden");
    document.body?.classList.toggle("wp-stage-select-active", active);
  }

  function centerNearest(rail) {
    const cards = [...rail.children].filter((card) => card.matches(".stage-card,.mission-card,.region-card,button"));
    if (!cards.length) return;
    const center = rail.scrollLeft + rail.clientWidth / 2;
    const nearest = cards.reduce((best, card) => {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      return !best || distance < best.distance ? { card, distance } : best;
    }, null)?.card;
    nearest?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }

  function install(rail) {
    if (installed.has(rail) || rail.dataset.stageDragInstalled === "true") return;
    installed.add(rail);
    rail.dataset.wpStageRail = "true";
    rail.dataset.wpStageInitiallyHidden = rail.getClientRects().length ? "false" : "true";
    let pointerId = null;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    rail.addEventListener("pointerdown", (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      pointerId = event.pointerId;
      rail.dataset.wpDragDown = String(Number(rail.dataset.wpDragDown || 0) + 1);
      startX = event.clientX;
      startScroll = rail.scrollLeft;
      moved = false;
    }, true);

    rail.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;
      const delta = event.clientX - startX;
      rail.dataset.wpDragDelta = String(delta);
      rail.dataset.wpDragMove = String(Number(rail.dataset.wpDragMove || 0) + 1);
      if (Math.abs(delta) > 8) moved = true;
      rail.scrollLeft = startScroll - delta;
    }, true);

    const finish = (event) => {
      if (pointerId === null) return;
      rail.releasePointerCapture?.(pointerId);
      pointerId = null;
      rail.classList.remove("wp-stage-dragging");
      if (moved) {
        event.preventDefault();
      }
      centerNearest(rail);
    };
    rail.addEventListener("pointerup", finish, true);
    rail.addEventListener("pointercancel", finish, true);
    document.addEventListener("pointerup", finish, true);
    document.addEventListener("pointercancel", finish, true);
  }

  function scan(root = document) {
    root.querySelectorAll?.(railSelector).forEach(install);
    standardizeMainStart();
    updateStageState();
  }

  scan();
  new MutationObserver((records) => {
    records.forEach((record) => record.addedNodes.forEach((node) => {
      if (!(node instanceof Element)) return;
      if (node.matches(railSelector)) install(node);
      scan(node);
    }));
    requestAnimationFrame(() => {
      standardizeMainStart();
      updateStageState();
    });
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "hidden", "lang"] });
  window.addEventListener("wonder:locale-change", standardizeMainStart);
})();
