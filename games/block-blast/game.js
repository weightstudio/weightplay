(() => {
  const $ = (id) => document.getElementById(id);
  const copy = { en: { title: "Block Blast", summary: "Place shapes and blast complete lines.", guide: "Drag one of three shapes onto the 8x8 board. A lifted preview shows the landing cells. Dirt and ice can be cleared; stone and locks block placement.", invalid: "That shape does not fit.", score: "{n} points", gameOver: "No shape can fit. Final score: {n}" }, "zh-Hant": { title: "方塊爆破", summary: "放入方塊並爆破完整行列。", guide: "將三個方塊之一拖到 8×8 棋盤。上移預覽會顯示落點；泥土與冰可清除，石頭與鎖定格會阻擋放置。", invalid: "這個位置放不下。", score: "{n} 分", gameOver: "沒有方塊可以放置，最終分數：{n}" }, "zh-Hans": { title: "方块爆破", summary: "放入方块并爆破完整行列。", guide: "将三个方块之一拖到 8×8 棋盘。上移预览会显示落点；泥土与冰可清除，石头与锁定格会阻挡放置。", invalid: "这个位置放不下。", score: "{n} 分", gameOver: "没有方块可以放置，最终分数：{n}" }, ja: { title: "ブロックブラスト", summary: "形を置いて行と列を消そう。", guide: "三つの形から一つを8×8盤へドラッグ。土と氷は消せますが、石とロックは置けません。", invalid: "そこには置けません。", score: "{n} 点", gameOver: "置ける形がありません。最終スコア: {n}" }, es: { title: "Explosión de bloques", summary: "Coloca formas y elimina líneas.", guide: "Arrastra una de tres formas al tablero 8x8. La tierra y el hielo se limpian; la piedra y los bloqueos impiden colocar.", invalid: "Esa forma no cabe.", score: "{n} puntos", gameOver: "No cabe ninguna forma. Puntuación final: {n}" } };
  const shapes = [[[0, 0], [0, 1], [0, 2], [0, 3]], [[0, 0], [1, 0], [2, 0], [2, 1]], [[0, 0], [0, 1], [1, 0], [1, 1]], [[0, 0], [0, 1], [0, 2], [1, 1]], [[0, 1], [0, 2], [1, 0], [1, 1]], [[0, 0], [1, 0], [1, 1], [2, 1]], [[0, 0], [0, 1], [1, 1], [1, 2]], [[0, 0], [1, 0], [2, 0], [2, 1]], [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]], [[0, 0], [0, 1], [1, 1], [2, 1], [2, 2]]];
  const colors = ["#f06487", "#754ec4", "#3fa7a0", "#e6a437"];
  let lang = localStorage.wpLang || "en", unlocked = +(localStorage.blockBlast || 1), level = 1, grid = [], gridColor = [], terrain = [], pieces = [], pieceColors = [], selected = -1, score = 0, lineClears = 0, colorClears = 0, gemsCollected = 0, preview = [], dragging = false, infiniteMode = false, targetColor = 0;
  const t = (key, values = {}) => String((copy[lang] || copy.en)[key] || copy.en[key]).replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
  function apply() { const c = copy[lang] || copy.en; $("title").textContent = c.title; $("summary").textContent = c.summary; $("guide").textContent = c.guide; document.documentElement.lang = lang; }
  function screen(name) { ["main", "stage", "battle"].forEach((id) => { $(id).hidden = id !== name; }); }
  function stages() { screen("stage"); $("progress").textContent = `${unlocked}/30`; $("stages").innerHTML = Array.from({ length: 30 }, (_, i) => `<button data-level="${i + 1}" ${i + 1 > unlocked ? "disabled" : ""} class="${i + 1 > unlocked ? "locked" : ""}">${i + 1}</button>`).join(""); $("stages").onclick = (e) => { const b = e.target.closest("button"); if (b) start(+b.dataset.level); }; }
  function shapeFits(piece, row, col) { return piece.every(([dr, dc]) => { const r = row + dr, c = col + dc, cell = r * 8 + c; return r >= 0 && c >= 0 && r < 8 && c < 8 && !grid[cell] && terrain[cell] !== 3 && terrain[cell] !== 4; }); }
  function anyFit() { return pieces.some((piece) => Array.from({ length: 8 }, (_, r) => Array.from({ length: 8 }, (_, c) => shapeFits(piece, r, c))).flat().some(Boolean)); }
  function newPieces() { let attempt = 0; do { pieces = [0, 1, 2].map((_, i) => shapes[(level * 2 + i + attempt) % shapes.length]); pieceColors = [0, 1, 2].map((_, i) => (level + i + attempt) % colors.length); attempt++; } while (!anyFit() && attempt < 8); selected = -1; preview = []; }
  function start(nextLevel, endless = false) { infiniteMode = endless; level = nextLevel; score = 0; lineClears = 0; targetColor = Math.max(0, (level - 16) % colors.length); grid = Array(64).fill(0); gridColor = Array(64).fill(0); terrain = Array(64).fill(0); if (level >= 6 && !infiniteMode) for (let i = 0; i < Math.min(6, Math.floor(level / 3)); i++) terrain[(i * 11 + level) % 64] = 1; if (level >= 11 && !infiniteMode) for (let i = 0; i < Math.min(4, Math.floor(level / 7)); i++) terrain[(i * 13 + level + 4) % 64] = 2; if (level >= 16 && !infiniteMode) for (let i = 0; i < Math.min(3, Math.floor(level / 9)); i++) terrain[(i * 17 + level + 2) % 64] = 3; if (level >= 21 && !infiniteMode) for (let i = 0; i < Math.min(2, Math.floor(level / 12)); i++) terrain[(i * 19 + level + 6) % 64] = 4; if (level >= 21 && !infiniteMode) for (let i = 0; i < Math.min(2, Math.floor(level / 12)); i++) terrain[(i * 23 + level + 8) % 64] = 5; newPieces(); screen("battle"); $("stageName").textContent = infiniteMode ? "INFINITE" : `STAGE ${level}`; render(); }
  function terrainLabel(value) { return value === 1 ? "◆" : value === 2 ? "❄" : value === 3 ? "■" : value === 4 ? "🔒" : value === 5 ? "♦" : ""; }
  function render() { $("board").innerHTML = Array.from({ length: 64 }, (_, i) => `<button style="${grid[i] ? `background:${colors[gridColor[i]]}` : ""}" class="cell ${grid[i] ? "filled" : ""} terrain-${terrain[i]} ${preview.includes(i) ? "preview" : ""}" data-index="${i}">${terrainLabel(terrain[i])}</button>`).join(""); $("score").textContent = t("score", { n: score }); $("tray").innerHTML = pieces.map((piece, i) => `<button draggable="true" class="piece ${i === selected ? "selected" : ""}" data-piece="${i}">${piece.map(([r, c]) => `<i style="grid-row:${r + 1};grid-column:${c + 1};background:${colors[pieceColors[i]]}"></i>`).join("")}</button>`).join(""); let objective = $("objective"); if (!objective) { objective = document.createElement("p"); objective.id = "objective"; $("battle").append(objective); } objective.textContent = infiniteMode ? "INFINITE · place until no shape fits" : level < 6 ? "TARGET · clear lines" : level < 16 ? "TARGET · clear terrain and lines" : `TARGET · clear color ${targetColor + 1} and score`; }
  function pointerCell(event) { const element = document.elementFromPoint(event.clientX, event.clientY)?.closest?.(".cell"); return element ? +element.dataset.index : -1; }
  function showPreview(index) { if (selected < 0 || index < 0) return; const row = Math.floor(index / 8), col = index % 8; preview = shapeFits(pieces[selected], row, col) ? pieces[selected].map(([dr, dc]) => (row + dr) * 8 + col + dc) : []; render(); }
  function place(index) { if (selected < 0 || index < 0) return; const row = Math.floor(index / 8), col = index % 8, piece = pieces[selected], color = pieceColors[selected]; if (!shapeFits(piece, row, col)) { $("status").textContent = t("invalid"); preview = []; render(); return; } piece.forEach(([dr, dc]) => { const cell = (row + dr) * 8 + col + dc; grid[cell] = 1; gridColor[cell] = color; if (terrain[cell] === 1 || terrain[cell] === 2) { terrain[cell] = 0; score += 5; } if (terrain[cell] === 5) { terrain[cell] = 0; gemsCollected++; score += 25; } }); score += piece.length * 10; for (let r = 0; r < 8; r++) if (Array.from({ length: 8 }, (_, c) => grid[r * 8 + c]).every((value) => value === 1)) { for (let c = 0; c < 8; c++) grid[r * 8 + c] = 0; score += 100; lineClears++; if (Array.from({ length: 8 }, (_, c) => gridColor[r * 8 + c]).includes(targetColor)) colorClears++; } for (let c = 0; c < 8; c++) if (Array.from({ length: 8 }, (_, r) => grid[r * 8 + c]).every((value) => value === 1)) { for (let r = 0; r < 8; r++) grid[r * 8 + c] = 0; score += 100; lineClears++; if (Array.from({ length: 8 }, (_, r) => gridColor[r * 8 + c]).includes(targetColor)) colorClears++; } pieces.splice(selected, 1); pieceColors.splice(selected, 1); selected = -1; preview = []; if (!pieces.length) { newPieces(); if (infiniteMode && !anyFit()) { $("resultBody").textContent = t("gameOver", { n: score }); $("result").showModal(); } else if (!infiniteMode && (level % 5 === 0 || score >= 120 || lineClears >= 2 || (level >= 16 && colorClears >= 1))) { unlocked = Math.max(unlocked, Math.min(30, level + 1)); localStorage.blockBlast = unlocked; $("resultBody").textContent = t("score", { n: score }); $("result").showModal(); } } render(); }
  $("tray").addEventListener("click", (e) => { const piece = e.target.closest(".piece"); if (piece) { selected = +piece.dataset.piece; render(); } }); $("tray").addEventListener("pointerdown", (e) => { const piece = e.target.closest(".piece"); if (piece) { selected = +piece.dataset.piece; dragging = true; render(); e.preventDefault(); } }); $("tray").addEventListener("dragstart", (e) => { const piece = e.target.closest(".piece"); if (piece) { selected = +piece.dataset.piece; dragging = true; e.dataTransfer?.setData("text/plain", piece.dataset.piece); } });
  $("board").addEventListener("pointermove", (e) => { if (selected >= 0) showPreview(pointerCell(e)); }); $("board").addEventListener("pointerleave", () => { preview = []; render(); }); $("board").addEventListener("pointerup", (e) => { if (dragging) { dragging = false; place(pointerCell(e)); } }); $("board").addEventListener("click", (e) => { const cell = e.target.closest(".cell"); if (cell) place(+cell.dataset.index); });
  const infiniteButton = document.createElement("button"); infiniteButton.textContent = "Infinite mode"; infiniteButton.type = "button"; $("start").after(infiniteButton); infiniteButton.onclick = () => start(0, true); $("start").onclick = stages; $("restart").onclick = () => start(level, infiniteMode); document.querySelectorAll("[data-back]").forEach((button) => { button.onclick = () => screen("stage"); }); $("resultStages").onclick = () => { $("result").close(); stages(); }; $("retry").onclick = () => { $("result").close(); start(level, infiniteMode); }; $("next").onclick = () => { $("result").close(); start(Math.min(30, level + 1)); };
  $("locale").onchange = (e) => { lang = e.target.value; localStorage.wpLang = lang; apply(); }; $("locale").value = lang; apply();
  let limitedStage = 0;
  let limitedMoves = 0;
  let limitReached = false;
  const limitForStage = () => {
    const stage = Number(($("stageName").textContent || "").replace(/\D/g, ""));
    return stage >= 26 ? 12 : 0;
  };
  const syncMoveLimit = () => {
    const limit = limitForStage();
    if (!limit) return;
    const objective = $("objective");
    if (objective) objective.textContent = `TARGET · mixed mechanisms · ${limitedMoves}/${limit} moves`;
  };
  $("board").addEventListener("click", (event) => {
    if (limitReached) { event.stopImmediatePropagation(); return; }
    const limit = limitForStage();
    if (!limit) return;
    const pieceBefore = $("tray").querySelectorAll(".piece").length;
    const scoreBefore = $("score").textContent;
    setTimeout(() => {
      const pieceAfter = $("tray").querySelectorAll(".piece").length;
      const scoreAfter = $("score").textContent;
      if (pieceAfter < pieceBefore || (pieceBefore === 1 && pieceAfter === 3 && scoreAfter !== scoreBefore)) limitedMoves++;
      syncMoveLimit();
      if (limitedMoves >= limit && !$("result").open) {
        limitReached = true;
        $("resultBody").textContent = `Move limit reached (${limit}).`;
        $("result").showModal();
      }
    }, 0);
  });
  const originalStageStart = start;
  start = (...args) => { originalStageStart(...args); const current = Number(($("stageName").textContent || "").replace(/\D/g, "")); if (current !== limitedStage) { limitedStage = current; limitedMoves = 0; limitReached = false; } syncMoveLimit(); };
})();
