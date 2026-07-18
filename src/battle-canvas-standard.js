(function () {
  const RESERVE_HEIGHT = window.WeightPlayAudience?.reserveHeight ?? 56;
  const GUTTER = 0;
  const games = {
    "animal-abyss-diver": [".battle-canvas", 390, 788],
    "animal-auto-squad": ["#gamePanel", 382, 780],
    "animal-cafe-rush": ["#playPanel", 382, 780],
    "animal-coloring-studio": [".battle-canvas", 390, 788],
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
    "wonder-crash": [".game-shell", 390, 788],
    "zoo-helper-day": ["#playPanel", 374, 776],
  };
  const gameId = location.pathname.match(/\/games\/([^/]+)/)?.[1] || "";
  const config = games[gameId];
  if (!config) return;
  const reserveSelector = ".battle-ad-reserve,.battle-ad,.ad-reserve,.result-ad-reserve,#battleAdReserve,#battleAd";
  const metrics = window.__weightPlayLayoutMetrics ||= {};
  metrics.battleQueued ||= 0;
  metrics.battleApplied ||= 0;

  const visible = (node) => {
    if (!node || node.hidden || node.classList.contains("hidden")) return false;
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0.02 && rect.width > 4 && rect.height > 4;
  };
  const findRoot = () => [...document.querySelectorAll(config[0])].find(visible) || null;
  const findBack = (root) => root?.querySelector('[data-wp-return="battle"]') || null;
  const findBattleOverlay = (root) => root && [...root.querySelectorAll('[role="dialog"],.result-panel,.result-overlay,.result-canvas,#resultPanel,#resultScreen,#resultModal,#result')].find(visible);
  const findReserve = () => [...document.querySelectorAll(reserveSelector)]
    .find((node) => visible(node) && !node.closest("[data-wp-logical-battle-canvas]")) || null;

  const savedStyles = new WeakMap();
  let activeRoot = null;
  let activeReserve = null;
  let appliedViewportWidth = 0;
  let appliedViewportHeight = 0;
  let appliedStateSignature = "";
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
    const active = Boolean(root && (visible(back) || findBattleOverlay(root)));
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
    const reserve = findReserve();
    const stateSignature = [
      document.body.className,
      root.className,
      root.hidden ? "hidden" : "shown",
      reserve?.className || "",
      reserve?.hidden ? "hidden" : "shown",
    ].join("|");
    if (root === activeRoot
      && reserve === activeReserve
      && Math.abs(width - appliedViewportWidth) < 0.5
      && Math.abs(height - appliedViewportHeight) < 0.5
      && stateSignature === appliedStateSignature) return;
    const availableWidth = Math.max(1, width - GUTTER * 2);
    const availableHeight = Math.max(1, height - RESERVE_HEIGHT - GUTTER * 2);
    const minimumLogicalWidth = config[1];
    const minimumLogicalHeight = config[2];
    const scale = Math.max(0.01, Math.min(
      availableWidth / minimumLogicalWidth,
      availableHeight / minimumLogicalHeight
    ));
    const logicalWidth = availableWidth / scale;
    const logicalHeight = availableHeight / scale;
    root.setAttribute("data-wp-logical-battle-canvas", `${logicalWidth.toFixed(3)}x${logicalHeight.toFixed(3)}`);
    const renderedWidth = availableWidth;
    const renderedHeight = availableHeight;
    const top = GUTTER;
    const style = document.documentElement.style;
    style.setProperty("--wp-battle-viewport-height", `${height}px`);
    style.setProperty("--wp-battle-logical-width", `${logicalWidth}px`);
    style.setProperty("--wp-battle-logical-height", `${logicalHeight}px`);
    style.setProperty("--wp-battle-canvas-scale", String(scale));
    style.setProperty("--wp-battle-canvas-rendered-width", `${renderedWidth}px`);
    style.setProperty("--wp-battle-canvas-rendered-height", `${renderedHeight}px`);
    style.setProperty("--wp-battle-canvas-top", `${top}px`);
    if (activeRoot && activeRoot !== root) restore(activeRoot);
    activeRoot = root;
    appliedViewportWidth = width;
    appliedViewportHeight = height;
    appliedStateSignature = stateSignature;
    metrics.battleApplied += 1;
    rememberAndSet(root, {
      position: "fixed",
      inset: "auto",
      top: `${top}px`,
      left: `${GUTTER}px`,
      width: `${logicalWidth}px`,
      "min-width": `${logicalWidth}px`,
      "max-width": `${logicalWidth}px`,
      height: `${logicalHeight}px`,
      "min-height": `${logicalHeight}px`,
      "max-height": `${logicalHeight}px`,
      margin: "0",
      transform: `scale(${scale})`,
      "transform-origin": "top left",
      overflow: "hidden",
    });
    if (activeReserve && activeReserve !== reserve) restore(activeReserve);
    activeReserve = reserve;
    if (reserve) {
      reserve.setAttribute("data-wp-battle-physical-reserve", "");
      const reserveTop = availableHeight;
      rememberAndSet(reserve, {
        position: "fixed",
        inset: `${reserveTop}px auto auto ${GUTTER}px`,
        display: "block",
        width: `${renderedWidth}px`,
        "min-width": "0",
        "max-width": "none",
        height: "56px",
        "min-height": "56px",
        "max-height": "56px",
        margin: "0",
        transform: "none",
        "pointer-events": "none",
      });
    }
  }

  let queued = false;
  const queueUpdate = () => {
    if (queued) return;
    queued = true;
    metrics.battleQueued += 1;
    requestAnimationFrame(() => {
      queued = false;
      update();
    });
  };
  const geometrySelector = `${config[0]},[data-wp-return="battle"],${reserveSelector}`;
  const containsGeometryNode = (node) => node instanceof Element
    && (node.matches(geometrySelector) || Boolean(node.querySelector(geometrySelector)));
  const mutationAffectsGeometry = (record) => {
    if (record.type === "childList") {
      return [...record.addedNodes, ...record.removedNodes].some(containsGeometryNode);
    }
    const target = record.target;
    if (!(target instanceof Element)) return false;
    if (target === document.body || target.matches(geometrySelector)) return true;
    return [...document.querySelectorAll(config[0])].some((root) => target.contains(root));
  };
  new MutationObserver((records) => {
    if (records.some(mutationAffectsGeometry)) queueUpdate();
  }).observe(document.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "hidden", "data-wp-return"],
    childList: true,
  });
  window.addEventListener("resize", queueUpdate, { passive: true });
  window.visualViewport?.addEventListener("resize", queueUpdate, { passive: true });
  document.addEventListener("click", () => window.setTimeout(queueUpdate, 0), true);
  window.addEventListener("weightplay:battle-open", queueUpdate);
  queueUpdate();
})();
