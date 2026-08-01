(() => {
  const $ = (id) => document.getElementById(id);
  const copy = {
    en: { title: "Hexa Sort", summary: "Stack, merge and clear matching colors.", guide: "Choose one of three stacks, then choose an open hex. Later stages add blocked, frozen, chain, gem, rainbow and bomb chips.", empty: "Choose an empty hex.", select: "Select a stack first.", blocked: "That hex is blocked.", frozen: "This stack is frozen.", clear: "10 chips cleared!", moves: "{n} moves" },
    "zh-Hant": { title: "六角堆疊", summary: "堆疊、合併並消除相同顏色。", guide: "選擇三組堆疊之一，再選擇空的六角格。後期會加入封鎖、冰凍、鎖鏈、寶石、彩虹與炸彈六角片。", empty: "請選擇空的六角格。", select: "請先選擇一組堆疊。", blocked: "這個六角格已被封鎖。", frozen: "這組堆疊被冰凍了。", clear: "已消除十片！", moves: "{n} 步" },
    "zh-Hans": { title: "六角堆叠", summary: "堆叠、合并并消除相同颜色。", guide: "选择三组堆叠之一，再选择空的六角格。后期会加入封锁、冰冻、锁链、宝石、彩虹与炸弹六角片。", empty: "请选择空的六角格。", select: "请先选择一组堆叠。", blocked: "这个六角格已被封锁。", frozen: "这组堆叠被冻结了。", clear: "已消除十片！", moves: "{n} 步" },
    ja: { title: "ヘキサソート", summary: "同じ色を重ねて消そう。", guide: "三つのスタックから選び、空いた六角形へ。後半は氷、鎖、宝石、虹、爆弾が登場します。", empty: "空いた六角形を選んでください。", select: "先にスタックを選んでください。", blocked: "その六角形は封鎖されています。", frozen: "このスタックは凍っています。", clear: "10枚消去！", moves: "{n} 手" },
    es: { title: "Clasificación Hexa", summary: "Apila y combina colores iguales.", guide: "Elige una de tres pilas y un hexágono libre. Los niveles posteriores añaden hielo, cadenas, gemas, arcoíris y bombas.", empty: "Elige un hexágono vacío.", select: "Elige una pila primero.", blocked: "Ese hexágono está bloqueado.", frozen: "Esta pila está congelada.", clear: "¡Diez fichas eliminadas!", moves: "{n} movimientos" },
  };
  const colors = ["red", "blue", "green", "gold"];
  let lang = localStorage.wpLang || "en", unlocked = +(localStorage.hexaSort || 1), level = 1, selected = -1, cells = [], stacks = [], blocked = new Set(), frozen = new Set(), chained = new Set(), gems = new Set(), moves = 0, clears = 0, locked = false;
  const t = (key, values = {}) => String((copy[lang] || copy.en)[key] || copy.en[key]).replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
  function apply() { const c = copy[lang] || copy.en; $("title").textContent = c.title; $("summary").textContent = c.summary; $("guide").textContent = c.guide; document.documentElement.lang = lang; }
  function screen(name) { ["main", "stage", "battle"].forEach((id) => { $(id).hidden = id !== name; }); }
  function stageList() { screen("stage"); $("progress").textContent = `${unlocked}/30`; $("stages").innerHTML = Array.from({ length: 30 }, (_, i) => `<button data-level="${i + 1}" ${i + 1 > unlocked ? "disabled" : ""} class="${i + 1 > unlocked ? "locked" : ""}">${i + 1}</button>`).join(""); $("stages").onclick = (e) => { const button = e.target.closest("button"); if (button) start(+button.dataset.level); }; }
  function nextStacks() { const count = Math.min(4, 3 + Math.floor(level / 10)); const target = colors[(level - 1) % count]; const special = level >= 26 ? (level % 2 ? "rainbow" : "bomb") : target; return [[target, colors[(level + 1) % count]], [colors[(level + 2) % count], target], [colors[(level + 3) % count], special]]; }
  function start(nextLevel) { level = nextLevel; moves = 0; clears = 0; selected = -1; locked = false; cells = Array(12).fill(null); blocked = new Set(); frozen = new Set(); chained = new Set(); gems = new Set(); stacks = nextStacks(); if (level >= 11) [5, 6].slice(0, Math.min(2, Math.floor(level / 5) - 1)).forEach((index) => blocked.add(index)); for (let i = 0; i < Math.min(3, Math.floor(level / 5)); i++) cells[i] = [colors[i % Math.min(3, 3 + Math.floor(level / 10))]]; if (level >= 16 && cells[0]) frozen.add(0); if (level >= 21 && cells[1]) chained.add(1); if (level >= 21) gems.add(2); screen("battle"); $("stageName").textContent = `STAGE ${level}`; render(); }
  function chipMarkup(chip) { return `<span class="${chip}">${chip === "rainbow" ? "★" : chip === "bomb" ? "✹" : ""}</span>`; }
  function render() { $("board").innerHTML = cells.map((stack, index) => `<button class="hex ${stack ? stack[stack.length - 1] : ""} ${blocked.has(index) ? "blocked" : ""} ${frozen.has(index) ? "frozen" : ""} ${chained.has(index) ? "chained" : ""} ${gems.has(index) ? "gem" : ""}" data-index="${index}" aria-label="${stack ? `${stack.length} chips` : blocked.has(index) ? "blocked hex" : "empty hex"}">${stack ? stack.length : blocked.has(index) ? "×" : ""}</button>`).join(""); $("moves").textContent = t("moves", { n: moves }); $("tray").innerHTML = stacks.map((stack, index) => `<button class="stack ${index === selected ? "selected" : ""}" data-stack="${index}">${stack.map(chipMarkup).join("")}</button>`).join(""); }
  function sameColor(a, b) { return a === b || a === "rainbow" || b === "rainbow"; }
  function neighborIndices(index) { const candidates = [index - 1, index + 1, index - 4, index + 4]; return candidates.filter((neighbor) => neighbor >= 0 && neighbor < cells.length && Math.abs((neighbor % 4) - (index % 4)) <= 1); }
  function mergeOnce(index) { const placed = cells[index], top = placed[placed.length - 1], neighbors = neighborIndices(index); const candidates = cells.map((stack, cellIndex) => ({ stack, cellIndex })).filter(({ stack, cellIndex }) => stack && neighbors.includes(cellIndex) && !frozen.has(cellIndex) && sameColor(stack[stack.length - 1], top)); candidates.sort((a, b) => b.stack.length - a.stack.length || a.cellIndex - b.cellIndex); const winner = candidates[0]; if (!winner) return false; placed.push(...winner.stack); cells[winner.cellIndex] = null; if (chained.has(winner.cellIndex)) chained.delete(winner.cellIndex); if (placed.length >= 10) { cells[index] = null; clears++; $("status").textContent = t("clear"); } return true; }
  function cascade(index) { let guard = 0; while (cells[index] && mergeOnce(index) && guard++ < 12) { if (!cells[index]) break; } const stack = cells[index]; if (stack?.includes("bomb")) { const neighbors = [index - 1, index + 1, index - 4, index + 4].filter((cellIndex) => cellIndex >= 0 && cellIndex < cells.length); neighbors.forEach((cellIndex) => { if (!blocked.has(cellIndex)) cells[cellIndex] = null; }); cells[index] = null; } if (stack?.includes("rainbow")) cells[index] = stack.filter((chip) => chip !== "rainbow"); }
  function place(index) { if (locked) return; if (selected < 0) { $("status").textContent = t("select"); return; } if (blocked.has(index)) { $("status").textContent = t("blocked"); return; } if (cells[index]) { $("status").textContent = t("empty"); return; } locked = true; cells[index] = stacks[selected].slice(); stacks.splice(selected, 1); selected = -1; moves++; [index - 1, index + 1, index - 4, index + 4].filter((neighbor) => neighbor >= 0 && neighbor < cells.length).forEach((neighbor) => frozen.delete(neighbor)); if (frozen.has(index)) frozen.delete(index); if (gems.has(index)) { gems.delete(index); $("status").textContent = "Gem collected!"; } cascade(index); if (chained.has(index) && cells[index]) chained.delete(index); setTimeout(() => { locked = false; if (!stacks.length) { stacks = nextStacks(); if (moves >= 3 && (level % 5 === 0 || clears > 0)) { unlocked = Math.max(unlocked, Math.min(30, level + 1)); localStorage.hexaSort = unlocked; $("resultBody").textContent = t("moves", { n: moves }); $("result").showModal(); } } render(); }, 220); }
  $("tray").onclick = (e) => { const button = e.target.closest(".stack"); if (button && !locked) { selected = +button.dataset.stack; render(); } }; $("board").onclick = (e) => { const button = e.target.closest(".hex"); if (button) place(+button.dataset.index); };
  $("start").onclick = stageList; $("restart").onclick = () => start(level); document.querySelectorAll("[data-back]").forEach((button) => { button.onclick = () => screen("stage"); }); $("resultStages").onclick = () => { $("result").close(); stageList(); }; $("retry").onclick = () => { $("result").close(); start(level); }; $("next").onclick = () => { $("result").close(); start(Math.min(30, level + 1)); };
  $("locale").onchange = (e) => { lang = e.target.value; localStorage.wpLang = lang; apply(); }; $("locale").value = lang; apply();
  const stoneCells = new Set();
  const markStoneCells = () => {
    document.querySelectorAll("#board .hex").forEach((cell) => {
      const index = +cell.dataset.index;
      const isStone = stoneCells.has(index);
      cell.classList.toggle("stone", isStone);
      if (isStone) cell.setAttribute("aria-label", "stone hex");
    });
  };
  const stoneStyle = document.createElement("style");
  stoneStyle.textContent = ".hex.stone{background:#687385;color:#dce3ed;box-shadow:inset 0 -6px #3e4653;cursor:not-allowed}.hex.stone::after{content:'◆';font-size:1rem;opacity:.85}";
  document.head.append(stoneStyle);
  const boardObserver = new MutationObserver(markStoneCells);
  boardObserver.observe($("board"), { childList: true });
  const originalStageStart = $("start").onclick;
  $("start").onclick = () => originalStageStart();
  $("board").addEventListener("click", (event) => {
    const cell = event.target.closest(".hex");
    if (cell && cell.classList.contains("stone")) {
      event.stopImmediatePropagation();
      $("status").textContent = "Stone hexes cannot hold stacks.";
    }
  }, true);
  const originalRender = render;
  render = (...args) => { originalRender(...args); markStoneCells(); };
  const originalStart = start;
  start = (...args) => { originalStart(...args); stoneCells.clear(); if (level >= 21) [8, 9].forEach((index) => stoneCells.add(index)); markStoneCells(); };
  const originalStackGenerator = nextStacks;
  nextStacks = () => { const generated = originalStackGenerator(); const boardTops = cells.filter(Boolean).map((stack) => stack[stack.length - 1]).filter((color) => colors.includes(color)); if (boardTops.length) generated[0] = [boardTops[0], colors[(level + boardTops.length) % Math.min(4, 3 + Math.floor(level / 10))]]; return generated; };
})();
