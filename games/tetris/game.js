window.WPPopularArcade?.mount("tetris");

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
  window.addEventListener("pagehide", () => {
    boardObserver.disconnect();
    gridObserver?.disconnect();
    clearFeedback();
  }, { once: true });
}
