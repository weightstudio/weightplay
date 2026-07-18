(function () {
  const RESERVE_HEIGHT = window.WeightPlayAudience?.reserveHeight ?? 56;
  const GUTTER = 0;
  const games = {
    "animal-abyss-diver": [".battle-canvas", 390, 788],
    "animal-auto-squad": ["#gamePanel", 382, 780],
    "animal-cafe-rush": ["#playPanel", 382, 780],
    "animal-crystal-survivor": ["#gamePanel", 382, 780],
    "animal-gearpack-expedition": [".battle-canvas", 390, 788],
    "animal-guard-yard": [".fixed-game-shell", 390, 450],
    "animal-hero-trials": ["#battleView", 390, 788],
    "animal-hidden-safari": ["#playPanel", 382, 780],
    "animal-moonlight-heist": [".battle-canvas", 390, 788],
    "animal-orb-fortress": ["#gamePanel", 382, 780],
    "animal-quiz": [".animal-game", 390, 788],
    "animal-reef-fisher": [".battle-shell", 382, 780],
    "animal-relic-hunters": [".game-layout", 382, 780],
    "animal-rescue": [".rescue-game", 382, 780],
    "animal-rope-rescue": ["#gamePanel", 382, 780],
    "animal-rune-tactics": [".rune-app", 382, 780],
    "animal-skyport-dispatch": [".battle-canvas", 390, 788],
    "animal-word-trails": [".battle-canvas", 382, 780],
    "animal-zoo-idle": ["#gamePanel", 382, 780],
    "beast-deck": ["#gamePanel", 382, 780],
    "beast-tactician": ["#gamePanel", 382, 780],
    "bubble-bakery": ["#playPanel", 382, 780],
    "campus-dash": [".dash-game", 382, 780],
    "color-lunchbox": [".lunch-game", 382, 780],
    "fruit-merge": [".fixed-game-shell", 382, 780],
    "garden-tiles": [".garden-game", 382, 780],
    "shadow-wolf": [".game-layout", 390, 788],
    "shape-train": ["#playPanel", 362, 710],
    "snack-blocks": [".snack-game", 382, 780],
    "star-memory": [".memory-game", 382, 780],
    "tiny-weather-rescue": ["#playPanel", 366, 764],
    "zoo-helper-day": ["#playPanel", 374, 776],
  };
  const gameId = location.pathname.match(/\/games\/([^/]+)/)?.[1] || "";
  const config = games[gameId];
  if (!config) return;

  const visible = (node) => {
    if (!node || node.hidden || node.classList.contains("hidden")) return false;
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0.02 && rect.width > 4 && rect.height > 4;
  };
  const findRoot = () => [...document.querySelectorAll(config[0])].find(visible) || null;
  const findBack = (root) => root?.querySelector('[data-wp-return="battle"]') || null;
  const findReserve = () => [...document.querySelectorAll(".battle-ad-reserve,.battle-ad,.ad-reserve,.result-ad-reserve,#battleAdReserve,#battleAd")]
    .find((node) => visible(node) && !node.closest("[data-wp-logical-battle-canvas]")) || null;

  const savedStyles = new WeakMap();
  let activeRoot = null;
  let activeReserve = null;
  const rememberAndSet = (node, declarations) => {
    if (!node) return;
    if (!savedStyles.has(node)) {
      const saved = {};
      Object.keys(declarations).forEach((property) => {
        saved[property] = [node.style.getPropertyValue(property), node.style.getPropertyPriority(property)];
      });
      savedStyles.set(node, saved);
    }
    Object.entries(declarations).forEach(([property, value]) => node.style.setProperty(property, value, "important"));
  };
  const restore = (node) => {
    const saved = savedStyles.get(node);
    if (!node || !saved) return;
    Object.entries(saved).forEach(([property, [value, priority]]) => {
      if (value) node.style.setProperty(property, value, priority);
      else node.style.removeProperty(property);
    });
    savedStyles.delete(node);
  };

  function update() {
    const root = findRoot();
    const back = findBack(root);
    const active = Boolean(root && back);
    document.body.classList.toggle("wp-logical-battle-active", active);
    if (!active) {
      restore(activeRoot);
      restore(activeReserve);
      activeRoot = null;
      activeReserve = null;
      return;
    }

    const viewport = window.visualViewport;
    const width = Math.max(1, viewport?.width || innerWidth);
    const height = Math.max(1, viewport?.height || innerHeight);
    const availableWidth = Math.max(1, width - GUTTER * 2);
    const availableHeight = Math.max(1, height - RESERVE_HEIGHT - GUTTER * 2);
    const heightScale = Math.max(0.01, availableHeight / config[2]);
    const logicalWidth = config[1];
    root.setAttribute("data-wp-logical-battle-canvas", `${logicalWidth}x${config[2]}`);
    const scale = Math.max(0.01, Math.min(availableWidth / logicalWidth, heightScale));
    const renderedWidth = logicalWidth * scale;
    const renderedHeight = config[2] * scale;
    const top = config[3] === "top"
      ? GUTTER
      : Math.max(GUTTER, height - RESERVE_HEIGHT - GUTTER - renderedHeight);
    const style = document.documentElement.style;
    style.setProperty("--wp-battle-viewport-height", `${height}px`);
    style.setProperty("--wp-battle-logical-width", `${logicalWidth}px`);
    style.setProperty("--wp-battle-logical-height", `${config[2]}px`);
    style.setProperty("--wp-battle-canvas-scale", String(scale));
    style.setProperty("--wp-battle-canvas-rendered-width", `${renderedWidth}px`);
    style.setProperty("--wp-battle-canvas-rendered-height", `${renderedHeight}px`);
    style.setProperty("--wp-battle-canvas-top", `${top}px`);
    if (activeRoot && activeRoot !== root) restore(activeRoot);
    activeRoot = root;
    rememberAndSet(root, {
      position: "fixed",
      inset: "auto",
      top: `${top}px`,
      left: "50%",
      width: `${logicalWidth}px`,
      "min-width": `${logicalWidth}px`,
      "max-width": `${logicalWidth}px`,
      height: `${config[2]}px`,
      "min-height": `${config[2]}px`,
      "max-height": `${config[2]}px`,
      margin: "0",
      transform: `translateX(-50%) scale(${scale})`,
      "transform-origin": "top center",
      overflow: "hidden",
    });
    const reserve = findReserve();
    if (activeReserve && activeReserve !== reserve) restore(activeReserve);
    activeReserve = reserve;
    if (reserve) {
      reserve.setAttribute("data-wp-battle-physical-reserve", "");
      const reserveTop = root.getBoundingClientRect().bottom;
      rememberAndSet(reserve, {
        position: "fixed",
        inset: `${reserveTop}px auto auto 50%`,
        display: "block",
        width: `${renderedWidth}px`,
        "min-width": "0",
        "max-width": "none",
        height: "56px",
        "min-height": "56px",
        "max-height": "56px",
        margin: "0",
        transform: "translateX(-50%)",
        "pointer-events": "none",
      });
    }
  }

  let queued = false;
  const queueUpdate = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      update();
    });
  };
  new MutationObserver(queueUpdate).observe(document.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "hidden", "data-wp-return"],
    childList: true,
  });
  window.addEventListener("resize", queueUpdate, { passive: true });
  window.visualViewport?.addEventListener("resize", queueUpdate, { passive: true });
  window.visualViewport?.addEventListener("scroll", queueUpdate, { passive: true });
  document.addEventListener("click", () => window.setTimeout(queueUpdate, 0), true);
  window.addEventListener("weightplay:battle-open", queueUpdate);
  queueUpdate();
})();
