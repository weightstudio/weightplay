(() => {
  const $ = (id) => document.getElementById(id);
  const route = { en: "en", "zh-Hant": "zh-tw", "zh-Hans": "zh-cn", ja: "ja", es: "es" };
  const text = {
    en: { title: "Arrow Escape", summary: "Clear arrow blocks in the right order.", guide: "Tap a block. It flies out only when the entire arrow path is clear. Walls, gates, keys, ice and portals appear as stages advance.", blocked: "Path blocked — remove the highlighted blocker first.", rotated: "Rotating arrow turned. Tap again to escape.", locked: "This block is locked. Find the key first.", hint: "One safe block is highlighted.", deadlock: "No block can move. Restart this stage.", clear: "Stage cleared!", moves: "{n} moves" },
    "zh-Hant": { title: "箭頭大逃亡", summary: "依正確順序清空箭頭方塊。", guide: "點擊方塊；整條箭頭路徑暢通時才會飛出。後期會加入牆、單向門、鑰匙、冰凍與傳送門。", blocked: "路徑受阻，先移除發光的阻擋物。", rotated: "旋轉箭頭已轉向，再點一次即可逃出。", locked: "這個方塊上鎖了，先找到鑰匙。", hint: "已標示一個可以移除的方塊。", deadlock: "目前沒有方塊可以移動，請重新開始。", clear: "關卡完成！", moves: "{n} 步" },
    "zh-Hans": { title: "箭头大逃亡", summary: "按正确顺序清空箭头方块。", guide: "点击方块；整条箭头路径畅通时才会飞出。后期会加入墙、单向门、钥匙、冰冻与传送门。", blocked: "路径受阻，先移除发光的阻挡物。", rotated: "旋转箭头已转向，再点一次即可逃出。", locked: "这个方块上锁了，先找到钥匙。", hint: "已标示一个可以移除的方块。", deadlock: "目前没有方块可以移动，请重新开始。", clear: "关卡完成！", moves: "{n} 步" },
    ja: { title: "アローエスケープ", summary: "正しい順番で矢印ブロックを消そう。", guide: "矢印の先まで空いているブロックをタップ。後半は壁、鍵、氷、ポータルが登場します。", blocked: "道がふさがれています。", rotated: "矢印が回転しました。もう一度タップ。", locked: "鍵が必要です。", hint: "動かせるブロックを一つ表示しました。", deadlock: "動かせるブロックがありません。リスタートしてください。", clear: "ステージクリア！", moves: "{n} 手" },
    es: { title: "Escape de Flechas", summary: "Elimina los bloques en el orden correcto.", guide: "Toca un bloque. Solo sale si todo su camino está libre; después aparecen muros, llaves, hielo y portales.", blocked: "Camino bloqueado.", rotated: "La flecha giró. Tócala de nuevo.", locked: "Necesitas la llave.", hint: "Un bloque seguro está resaltado.", deadlock: "No se puede mover ningún bloque. Reinicia el nivel.", clear: "¡Nivel superado!", moves: "{n} movimientos" },
  };
  let lang = localStorage.wpLang || "en", unlocked = +(localStorage.arrowEscape || 1), level = 1, blocks = [], walls = new Set(), portals = new Set(), portalPairs = new Map(), gates = new Map(), moves = 0, keyFound = false;
  const t = (key, values = {}) => String((text[lang] || text.en)[key] || text.en[key]).replace(/\{(\w+)\}/g, (_, k) => values[k] ?? "");
  const dirs = { "↑": [-1, 0], "→": [0, 1], "↓": [1, 0], "←": [0, -1] };
  const turn = { "↑": "→", "→": "↓", "↓": "←", "←": "↑" };
  const keyOf = (r, c) => `${r},${c}`;
  function screen(name) { ["main", "stage", "battle"].forEach((id) => { $(id).hidden = id !== name; }); }
  function apply() { const copy = text[lang] || text.en; $("title").textContent = copy.title; $("summary").textContent = copy.summary; $("guide").textContent = copy.guide; document.documentElement.lang = lang; }
  function renderStages() { screen("stage"); $("progress").textContent = `${unlocked}/30`; $("stages").innerHTML = Array.from({ length: 30 }, (_, i) => `<button data-level="${i + 1}" ${i + 1 > unlocked ? "disabled" : ""} class="${i + 1 > unlocked ? "locked" : ""}">${i + 1}</button>`).join(""); $("stages").onclick = (e) => { const button = e.target.closest("button"); if (button) start(+button.dataset.level); }; }
  function makeLevel() {
    blocks = []; walls = new Set(); portals = new Set(); portalPairs = new Map(); gates = new Map(); keyFound = false;
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
      if ((r * 5 + c + level) % 3 === 0) continue;
      const edge = r === 0 || r === 4 || c === 0 || c === 4;
      const d = edge ? (r === 0 ? "↑" : r === 4 ? "↓" : c === 0 ? "←" : "→") : ["↑", "→", "↓", "←"][(r + c + level) % 4];
      blocks.push({ r, c, d, rotating: level >= 16 && (r + c) % 5 === 0, locked: false, frozen: level >= 21 && (r + c + level) % 7 === 0, key: false });
    }
    const empty = (r, c) => !blocks.some((b) => b.r === r && b.c === c);
    if (level >= 11) [[1, 1], [3, 3]].forEach(([r, c]) => { if (empty(r, c)) walls.add(keyOf(r, c)); });
    if (level >= 21) { const locked = blocks.find((b) => !b.frozen && !b.key); const key = blocks.find((b) => b !== locked && !b.frozen); if (locked && key) { locked.locked = true; key.key = true; } }
    if (level >= 26) { const pair = [[0, 2], [4, 2]].filter(([r, c]) => empty(r, c)).map(([r, c]) => keyOf(r, c)); pair.forEach((key, index) => { portals.add(key); portalPairs.set(key, pair[(index + 1) % pair.length]); }); gates.set(keyOf(2, 2), "→"); }
  }
  function ray(block) { const [dr, dc] = dirs[block.d]; const cells = []; const seen = new Set(); let r = block.r + dr, c = block.c + dc; while (r >= 0 && r < 5 && c >= 0 && c < 5) { const key = keyOf(r, c); if (portalPairs.has(key) && !seen.has(key)) { seen.add(key); const [nextR, nextC] = portalPairs.get(key).split(",").map(Number); r = nextR + dr; c = nextC + dc; continue; } cells.push([r, c]); r += dr; c += dc; } return cells; }
  function blocker(block) { for (const [r, c] of ray(block)) { const key = keyOf(r, c); if (walls.has(key)) return { r, c, wall: true }; const other = blocks.find((candidate) => candidate !== block && candidate.r === r && candidate.c === c); if (other) return other; const gate = gates.get(key); if (gate && gate !== block.d) return { r, c, gate: true }; } return null; }
  function movable(block) { return !block.locked && !block.frozen && !blocker(block); }
  function deadlocked() { return blocks.length > 0 && !blocks.some((block) => block.rotating || movable(block)); }
  function render(blockerToShow = null) {
    let html = "";
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
      const key = keyOf(r, c), block = blocks.find((b) => b.r === r && b.c === c), hit = blockerToShow && blockerToShow.r === r && blockerToShow.c === c;
      if (block) html += `<button class="arrow-block ${block.locked ? "locked-block" : ""} ${block.frozen ? "frozen-block" : ""} ${block.key ? "key-block" : ""} ${hit ? "obstacle-hit" : ""}" data-r="${r}" data-c="${c}" aria-label="${block.d}">${block.d}</button>`;
      else if (walls.has(key)) html += `<span class="board-obstacle wall" data-r="${r}" data-c="${c}">▦</span>`;
      else if (portals.has(key)) html += `<span class="board-obstacle portal" data-r="${r}" data-c="${c}">◎</span>`;
      else if (gates.has(key)) html += `<span class="board-obstacle gate" data-r="${r}" data-c="${c}">${gates.get(key)}</span>`;
      else html += "<span></span>";
    }
    $("board").innerHTML = html; $("moves").textContent = t("moves", { n: moves });
  }
  function start(nextLevel) { level = nextLevel; moves = 0; makeLevel(); screen("battle"); $("stageName").textContent = `STAGE ${level}`; $("status").textContent = ""; render(); }
  $("board").onclick = (event) => {
    const element = event.target.closest(".arrow-block"); if (!element) return;
    const block = blocks.find((b) => b.r === +element.dataset.r && b.c === +element.dataset.c); if (!block) return;
    if (block.rotating) { block.d = turn[block.d]; block.rotating = false; $("status").textContent = t("rotated"); render(); return; }
    if (block.locked) { $("status").textContent = t("locked"); element.classList.add("shake"); return; }
    const hit = blocker(block); if (hit) { $("status").textContent = t("blocked"); render(hit); return; }
    element.classList.add("escaping"); moves++; if (block.key) keyFound = true; blocks = blocks.filter((candidate) => candidate !== block); blocks.forEach((candidate) => { if (candidate.frozen) candidate.frozen = false; if (keyFound) candidate.locked = false; });
    setTimeout(() => { render(); if (!blocks.length) { unlocked = Math.max(unlocked, Math.min(30, level + 1)); localStorage.arrowEscape = unlocked; $("resultTitle").textContent = t("clear"); $("resultBody").textContent = t("moves", { n: moves }); $("result").showModal(); } else if (deadlocked()) { $("status").textContent = t("deadlock"); } }, 150);
  };
  $("hint").onclick = () => { const safe = blocks.find(movable); if (safe) { render(); document.querySelector(`[data-r="${safe.r}"][data-c="${safe.c}"]`)?.classList.add("hinted"); $("status").textContent = t("hint"); } };
  $("restart").onclick = () => start(level); $("start").onclick = renderStages; document.querySelectorAll("[data-back]").forEach((button) => { button.onclick = () => screen("stage"); });
  $("resultStages").onclick = () => { $("result").close(); renderStages(); }; $("retry").onclick = () => { $("result").close(); start(level); }; $("next").onclick = () => { $("result").close(); start(Math.min(30, level + 1)); };
  $("locale").onchange = (event) => { lang = event.target.value; localStorage.wpLang = lang; apply(); }; $("locale").value = lang; apply();
})();
