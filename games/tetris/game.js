window.WPPopularArcade?.mount("tetris");
// This game-owned identity supersedes the shared legacy mount default.
document.body.dataset.gameVersion = "v23";
document.body.dataset.wpInterfaceVersion = "9";

// Measure the actual shared transform; inactive shared-shell cleanup can
// temporarily remove its inherited physical-size token while retaining scale.
(() => {
  const canvas = document.querySelector("#battleScreen .battle-canvas");
  if (!canvas) return;
  let frame = 0;
  const measure = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const logical = parseFloat(getComputedStyle(canvas).width);
      const scale = canvas.getBoundingClientRect().width / logical;
      if (!Number.isFinite(scale) || scale <= 0) return;
      const value = `${(Math.max(48, 48 / scale) + .1).toFixed(3)}px`;
      if (document.body.style.getPropertyValue("--tetris-physical-control") !== value) document.body.style.setProperty("--tetris-physical-control", value);
    });
  };
  const resize = new ResizeObserver(measure), observer = new MutationObserver(measure);
  const observe = () => { resize.observe(canvas); observer.observe(canvas, { attributes: true, attributeFilter: ["style"] }); measure(); };
  observe();
  window.addEventListener("pagehide", () => { cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect(); });
  window.addEventListener("pageshow", observe);
})();

const syncTetrisResultStats = () => {
  document.querySelectorAll("#resultStats .stat").forEach((stat) => {
    if (stat.dataset.tetrisSeparated === "true") return;
    const value = stat.querySelector("strong");
    const labelNode = [...stat.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
    if (!value || !labelNode) return;
    const labelText = labelNode.textContent.trim();
    labelNode.remove();
    const label = document.createElement("span");
    label.className = "stat-label";
    label.textContent = labelText;
    stat.classList.add("tetris-result-stat");
    stat.dataset.tetrisSeparated = "true";
    stat.setAttribute("role", "group");
    stat.setAttribute("aria-label", `${labelText}: ${value.textContent.trim()}`);
    stat.prepend(label);
  });
};

const resultStats = document.querySelector("#resultStats");
if (resultStats) {
  new MutationObserver(syncTetrisResultStats).observe(resultStats, { childList: true, subtree: true });
  [0, 120, 300, 600].forEach((delay) => window.setTimeout(syncTetrisResultStats, delay));
}

const tetrisBoardRoot = document.querySelector("#board");
if (tetrisBoardRoot) {
  let tetrisGrid = null;
  let lastLineCount = 0;
  let lastSettledCells = "";
  let feedbackTimer = 0;
  let gridObserver = null;

  const clearFeedback = () => {
    window.clearTimeout(feedbackTimer);
    tetrisGrid?.classList.remove("is-locking", "is-clearing", "is-multiple");
    document.querySelector("#gameMessage")?.classList.remove("is-clearing");
  };

  const attachGridObserver = () => {
    const nextGrid = tetrisBoardRoot.querySelector(".tetris-grid");
    if (!nextGrid || nextGrid === tetrisGrid) return;
    gridObserver?.disconnect();
    clearFeedback();
    tetrisGrid = nextGrid;
    lastLineCount = Number(tetrisGrid.dataset.lines || 0);
    lastSettledCells = tetrisGrid.dataset.settledCells || "";
    gridObserver = new MutationObserver(() => {
      const lineCount = Number(tetrisGrid.dataset.lines || 0);
      const settledCells = tetrisGrid.dataset.settledCells || "";
      if (lineCount < lastLineCount) {
        clearFeedback();
        lastLineCount = lineCount;
        lastSettledCells = settledCells;
        return;
      }
      if (lineCount > lastLineCount) {
        const clearedRows = lineCount - lastLineCount;
        tetrisGrid.dataset.lastClearRows = String(clearedRows);
        tetrisGrid.classList.remove("is-clearing", "is-multiple");
        void tetrisGrid.offsetWidth;
        tetrisGrid.classList.add("is-clearing");
        if (clearedRows > 1) tetrisGrid.classList.add("is-multiple");
        document.querySelector("#gameMessage")?.classList.add("is-clearing");
        window.clearTimeout(feedbackTimer);
        feedbackTimer = window.setTimeout(() => {
          tetrisGrid?.classList.remove("is-clearing", "is-multiple");
          document.querySelector("#gameMessage")?.classList.remove("is-clearing");
        }, clearedRows > 1 ? 540 : 440);
      } else if (settledCells !== lastSettledCells) {
        tetrisGrid.classList.remove("is-locking");
        void tetrisGrid.offsetWidth;
        tetrisGrid.classList.add("is-locking");
        window.clearTimeout(feedbackTimer);
        feedbackTimer = window.setTimeout(() => tetrisGrid?.classList.remove("is-locking"), 190);
      }
      lastLineCount = lineCount;
      lastSettledCells = settledCells;
    });
    gridObserver.observe(tetrisGrid, { attributes: true, attributeFilter: ["data-lines", "data-settled-cells"] });
  };

  const boardObserver = new MutationObserver(attachGridObserver);
  boardObserver.observe(tetrisBoardRoot, { childList: true, subtree: true });
  attachGridObserver();
  window.addEventListener("weightplay:tetris-settle", clearFeedback);
  window.addEventListener("pagehide", () => {
    boardObserver.disconnect();
    gridObserver?.disconnect();
    clearFeedback();
  });
  window.addEventListener("pageshow", () => {
    boardObserver.observe(tetrisBoardRoot, { childList: true, subtree: true });
    tetrisGrid = null;
    attachGridObserver();
  });
}

// Presentation adapter around the existing rules. It never changes a move,
// score, timer, random source or save, and owns only bounded visual effects.
(() => {
  const animations = new Map();
  const proxies = new Set();
  let generation = 0, pendingExit = null, rejectTimer = 0, restoreMessage = null;
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const message = () => document.querySelector("#gameMessage");
  const settingsPanel = () => [...document.querySelectorAll(".wp-shell-settings-popover:not([hidden]), #audioPopover:not([hidden])")].find((node) => node.getClientRects().length);
  const tween = (node, frames, duration = 140) => {
    if (!node?.isConnected) return;
    animations.get(node)?.cancel();
    const animation = node.animate(frames, { duration: reduced() ? Math.min(duration, 120) : duration, easing: "ease-out" });
    animations.set(node, animation);
    animation.finished.catch(() => {}).then(() => { if (animations.get(node) === animation) animations.delete(node); });
  };
  const emphasize = (node) => tween(node, [{ opacity: .52 }, { opacity: 1 }]);
  const settle = () => {
    generation++;
    for (const animation of animations.values()) animation.cancel();
    animations.clear();
    for (const proxy of proxies) proxy.remove();
    proxies.clear();
    clearTimeout(rejectTimer);
    if (restoreMessage && message()?.textContent === restoreMessage.rejection) message().textContent = restoreMessage.previous;
    restoreMessage = null;
    window.dispatchEvent(new Event("weightplay:tetris-settle"));
  };
  const captureExit = (node) => {
    if (!node || !node.getClientRects().length) return;
    pendingExit?.clone.remove();
    const bounds = node.getBoundingClientRect(), clone = node.cloneNode(true);
    const originals = [node, ...node.querySelectorAll("*")], copies = [clone, ...clone.querySelectorAll("*")];
    originals.forEach((source, index) => {
      const target = copies[index], style = getComputedStyle(source);
      target.style.cssText = [...style].map((name) => `${name}:${style.getPropertyValue(name)};`).join("");
      target.style.setProperty("animation", "none", "important");
      target.style.setProperty("transition", "none", "important");
      target.removeAttribute("id");
      target.removeAttribute("class");
      for (const attribute of [...target.attributes]) if (attribute.name.startsWith("data-")) target.removeAttribute(attribute.name);
      target.removeAttribute("aria-live");
    });
    clone.querySelectorAll("script, style, iframe").forEach((child) => child.remove());
    clone.inert = true;
    clone.setAttribute("aria-hidden", "true");
    clone.dataset.tetrisExitProxy = "true";
    Object.assign(clone.style, { position: "fixed", inset: "auto", left: `${bounds.left}px`, top: `${bounds.top}px`,
      width: `${bounds.width}px`, height: `${bounds.height}px`, margin: "0", transform: "none", pointerEvents: "none", zIndex: "10000" });
    pendingExit = { node, clone };
  };
  const flushExit = () => {
    const pending = pendingExit;
    pendingExit = null;
    if (!pending || (pending.node.getClientRects().length && !(pending.node instanceof HTMLDialogElement && !pending.node.open))) return;
    document.body.append(pending.clone);
    proxies.add(pending.clone);
    tween(pending.clone, [{ opacity: .85 }, { opacity: 0 }], 160);
    const animation = animations.get(pending.clone);
    animation?.finished.catch(() => {}).then(() => { pending.clone.remove(); proxies.delete(pending.clone); });
  };
  const activeRects = (selector = ".active") => [...document.querySelectorAll(`.tetris-grid ${selector}`)].map((cell) => ({
    rect: cell.getBoundingClientRect(), color: getComputedStyle(cell).backgroundColor,
  }));
  const trail = (before, after) => {
    if (reduced()) return;
    before.slice(0, 4).forEach(({ rect, color }, index) => {
      const target = after[index]?.rect;
      if (!target) return;
      const proxy = document.createElement("i");
      proxy.setAttribute("aria-hidden", "true");
      proxy.dataset.tetrisPieceProxy = "true";
      Object.assign(proxy.style, { position: "fixed", left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`,
        height: `${rect.height}px`, background: color, border: "1px solid #fff", borderRadius: "2px", pointerEvents: "none", zIndex: "30" });
      document.body.append(proxy); proxies.add(proxy);
      tween(proxy, [{ opacity: .55, transform: "translate(0,0)" },
        { opacity: 0, transform: `translate(${target.left - rect.left}px,${target.top - rect.top}px)` }], 110);
      animations.get(proxy)?.finished.catch(() => {}).then(() => { proxy.remove(); proxies.delete(proxy); });
    });
  };
  const blocked = {
    en: "Blocked by the wall or stack.", "zh-Hant": "牆壁或堆疊擋住了這一步。", "zh-Hans": "墙壁或堆叠挡住了这一步。",
    ja: "壁か積まれたブロックに阻まれています。", ko: "벽이나 쌓인 블록에 막혔습니다.", es: "La pared o los bloques impiden este movimiento.",
    "pt-BR": "A parede ou os blocos impedem este movimento.", fr: "Le mur ou les blocs bloquent ce mouvement.", de: "Wand oder Blöcke blockieren diesen Zug.",
    it: "Il muro o i blocchi impediscono questa mossa.", ru: "Стена или блоки мешают этому ходу.", hi: "दीवार या रखे हुए ब्लॉक इस चाल को रोक रहे हैं।", ar: "يمنع الجدار أو الكتل هذه الحركة.",
  };
  const engine = window.WPTetrisEngine, step = engine.step;
  engine.step = function (state, command) {
    const userAction = command !== "tick" && !state.paused && !state.over && document.body.dataset.screen === "battle";
    const before = userAction ? activeRects() : [], landing = command === "drop" ? activeRects(".ghost") : [];
    const oldHud = document.querySelector("#roundLabel")?.textContent, oldPieces = state.pieces;
    const accepted = step.call(this, state, command);
    if (state.over && !document.querySelector("[data-tetris-exit-proxy]")) captureExit(document.querySelector("#battleScreen"));
    if ((userAction || state.pieces !== oldPieces) && !state.over) {
      const token = generation;
      clearTimeout(rejectTimer);
      queueMicrotask(() => {
        if (token !== generation || document.hidden || document.body.dataset.screen !== "battle" || document.querySelector(".tetris-dialog[open]")) return;
        const button = document.querySelector(`#controls [data-action="${command === "up" ? "rotate" : command}"]`);
        emphasize(button);
        if (accepted) {
          // Keep at most four piece proxies, even with a held key.
          for (const proxy of proxies) if (proxy.dataset.tetrisPieceProxy) { animations.get(proxy)?.cancel(); proxy.remove(); proxies.delete(proxy); }
          trail(before, command === "drop" ? landing : activeRects());
          document.querySelectorAll(".tetris-grid .active").forEach(emphasize);
          if (state.pieces !== oldPieces) emphasize(document.querySelector(".tetris-next"));
          if (document.querySelector("#roundLabel")?.textContent !== oldHud) emphasize(document.querySelector("#roundLabel"));
        } else {
          const grid = document.querySelector(".tetris-grid");
          tween(grid, [{ boxShadow: "0 0 0 3px #ffd078" }, { boxShadow: "0 0 0 0px transparent" }], 240);
          const node = message(), rejection = blocked[document.documentElement.lang] || blocked.en;
          if (node) {
            restoreMessage = { previous: node.textContent, rejection };
            node.textContent = rejection; emphasize(node);
            rejectTimer = setTimeout(() => { if (token === generation && node.textContent === rejection) node.textContent = restoreMessage?.previous || ""; restoreMessage = null; }, 700);
          }
        }
      });
    }
    return accepted;
  };
  document.addEventListener("click", (event) => {
    const button = event.target.closest?.("button, a");
    if (!button || button.closest("#controls")) return;
    if (button.id === "hintBtn") { const token = generation; queueMicrotask(() => { if (token === generation) emphasize(message()); }); return; }
    captureExit(document.querySelector(".tetris-dialog[open]") || settingsPanel()
      || document.querySelector(`#${({ main: "mainScreen", battle: "battleScreen", result: "resultScreen" })[document.body.dataset.screen]}`));
  }, true);
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") captureExit(document.querySelector(".tetris-dialog[open]") || settingsPanel()); }, true);
  document.addEventListener("pointerdown", (event) => {
    const settings = settingsPanel();
    if (settings && !settings.contains(event.target) && !event.target.closest?.(".wp-shell-settings-button, [data-wp-settings], #audioMenuBtn")) captureExit(settings);
  }, true);
  let view = "";
  const observeView = () => {
    const dialog = document.querySelector(".tetris-dialog[open]"), settings = settingsPanel();
    const next = `${document.body.dataset.screen}|${Boolean(dialog)}|${Boolean(settings)}`;
    if (next === view) return;
    view = next; settle(); flushExit();
    emphasize(dialog || settings || document.querySelector(`#${({ main: "mainScreen", battle: "battleScreen", result: "resultScreen" })[document.body.dataset.screen]}`));
  };
  const observer = new MutationObserver(observeView);
  const observe = () => observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["data-screen", "hidden", "open"] });
  observe(); observeView();
  window.addEventListener("pagehide", () => { observer.disconnect(); settle(); pendingExit = null; });
  window.addEventListener("pageshow", () => { observe(); view = ""; observeView(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) { settle(); pendingExit = null; } });
})();
