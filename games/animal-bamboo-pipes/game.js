(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const CODES = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const BASE = window.BAMBOO_LOCALES.en;
  const LEVELS = window.BAMBOO_LEVELS.levels;
  let locale = localRead("wp-locale") || "en", selected = 0, run = null;
  if (!CODES.includes(locale)) locale = "en";
  let save = { unlocked: 1, done: {} };
  try { save = { ...save, ...JSON.parse(localStorage.getItem("wp:bamboo") || "{}") }; } catch {}
  const text = (key, data = {}) => String((window.BAMBOO_LOCALES[locale] || BASE)[key] || BASE[key] || key).replace(/\{(\w+)\}/g, (_, name) => data[name] ?? "");
  const screens = { main: $("main"), stage: $("stage"), battle: $("battle") };
  const DIRS = [[-1, 0, 0, 2], [0, 1, 1, 3], [1, 0, 2, 0], [0, -1, 3, 1]];
  function localRead(key) { try { return localStorage.getItem(key); } catch { return null; } }
  function show(name) { document.body.dataset.screen = name; Object.entries(screens).forEach(([key, node]) => { node.hidden = key !== name; }); $("generalReserve").hidden = name === "main"; }
  function persist() { try { localStorage.setItem("wp:bamboo", JSON.stringify(save)); } catch {} }
  function stageData(index) {
    return LEVELS[index].tiles.map((tile, i) => ({ ...tile, rot: tile.shape === "x" ? 0 : (tile.solved + 1 + ((index * 7 + i * 3) % 3)) % 4 }));
  }
  function ports(tile) {
    const raw = tile.shape === "x" ? [0,1,2,3] : tile.shape === "s" ? [0,2] : tile.shape === "e" ? [0,1] : tile.shape === "t" ? [0,1,3] : tile.shape === "source" ? [2] : [0];
    return raw.map(port => (port + tile.rot) % 4);
  }
  function basePorts(tile) {
    return tile.shape === "x" ? [0,1,2,3] : tile.shape === "s" ? [0,2] : tile.shape === "e" ? [0,1] : tile.shape === "t" ? [0,1,3] : tile.shape === "source" ? [2] : [0];
  }
  function flowSvg(tile, index, wet) {
    if (!wet) return null;
    const paths = basePorts(tile).map(port => {
      const end = [[50,0],[100,50],[50,100],[0,50]][port];
      return `<path d="M50 50 L${end[0]} ${end[1]}" pathLength="1"/>`;
    }).join("");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("flow"); svg.setAttribute("viewBox", "0 0 100 100"); svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = paths;
    if (tile.shape === "source") svg.classList.add("flow-source");
    if (tile.shape === "goal") svg.classList.add("flow-goal");
    return svg;
  }
  function junctionSvg(tile) {
    if (tile.shape !== "t") return null;
    const paths = basePorts(tile).map(port => {
      const end = [[50,0],[100,50],[50,100],[0,50]][port];
      return `<path d="M50 50 L${end[0]} ${end[1]}"/>`;
    }).join("");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("pipe-art"); svg.setAttribute("viewBox", "0 0 100 100"); svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = `<g class="pipe-art-outline">${paths}</g><g class="pipe-art-body">${paths}</g>`;
    return svg;
  }
  function water() {
    const source = run.tiles.findIndex(tile => tile.shape === "source");
    const queue = [[Math.floor(source / 5), source % 5]], wet = new Set([source]);
    while (queue.length) {
      const [row, col] = queue.shift(), current = run.tiles[row * 5 + col];
      DIRS.forEach(([dr, dc, direction, reverse]) => {
        const nextRow = row + dr, nextCol = col + dc, nextIndex = nextRow * 5 + nextCol;
        if (nextRow < 0 || nextRow > 4 || nextCol < 0 || nextCol > 4 || wet.has(nextIndex)) return;
        const next = run.tiles[nextIndex];
        if (ports(current).includes(direction) && ports(next).includes(reverse)) { wet.add(nextIndex); queue.push([nextRow, nextCol]); }
      });
    }
    return wet;
  }
  function winReady() {
    return water().size === 25;
  }
  function renderStages() {
    const rail = $("rail"); rail.innerHTML = "";
    for (let index = 0; index < 30; index++) {
      const locked = index >= save.unlocked, card = document.createElement("button");
      card.className = `stage-card${index === selected ? " selected" : ""}${locked ? " locked" : ""}`;
      card.disabled = locked;
      card.innerHTML = `<small>${text("chapter", { n: Math.floor(index / 5) + 1 })}</small><h3>${text("waterway", { n: index + 1 })}</h3><p>${locked ? text("locked") : save.done[index] ? text("restored") : text("objective")}</p>`;
      card.onclick = () => { selected = index; renderStages(); };
      rail.append(card);
    }
  }
  function renderBoard() {
    const wet = water(), board = $("board"); board.innerHTML = "";
    run.tiles.forEach((tile, index) => {
      const pipe = document.createElement("button");
      pipe.className = `pipe${wet.has(index) ? " wet" : ""}`;
      pipe.dataset.shape = tile.shape;
      pipe.style.transform = `rotate(${tile.rot * 90}deg)`;
      pipe.dataset.rotation = String(tile.rot);
      pipe.setAttribute("aria-label", text("pipeLabel", { n: index + 1 }));
      const art = junctionSvg(tile);
      if (art) pipe.append(art);
      const flow = flowSvg(tile, index, wet.has(index));
      if (flow) pipe.append(flow);
      pipe.onclick = () => { run.history.push(run.tiles.map(item => item.rot)); tile.rot = (tile.rot + 1) % 4; run.moves++; renderBoard(); if (winReady()) complete(); };
      board.append(pipe);
    });
    $("moves").textContent = text("moves", { n: run.moves });
    $("cue").textContent = text("cue");
  }
  function startStage() {
    run = { tiles: stageData(selected), history: [], moves: 0 };
    $("chapter").textContent = text("chapter", { n: Math.floor(selected / 5) + 1 });
    $("stageName").textContent = text("waterway", { n: selected + 1 });
    show("battle"); renderBoard();
  }
  function complete() {
    save.done[selected] = true;
    save.unlocked = Math.max(save.unlocked, Math.min(30, selected + 2)); persist();
    $("resultText").textContent = text("resultText", { moves: run.moves, n: selected + 1 });
    $("result").showModal();
  }
  function applyLocale() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.title = `${text("title")} | WeightPlay`;
    document.querySelectorAll("[data-t]").forEach(node => { node.textContent = text(node.dataset.t); });
    document.querySelector(".locale").firstChild.textContent = `${text("language")} `;
    document.querySelector(".return").setAttribute("aria-label", text("returnLobby"));
    document.querySelectorAll("[data-back]").forEach(node => node.setAttribute("aria-label", text("back")));
    $("rail").setAttribute("aria-label", text("stageSelector"));
    $("board").setAttribute("aria-label", text("boardLabel"));
    document.querySelector(".hero img").setAttribute("alt", text("coverAlt"));
    document.querySelector(".guide img").setAttribute("alt", text("guideAlt"));
    renderStages();
  }
  CODES.forEach(code => { const option = document.createElement("option"); option.value = code; option.textContent = window.BAMBOO_LOCALES[code].label; $("locale").append(option); });
  $("locale").value = locale;
  $("locale").onchange = event => { locale = event.target.value; try { localStorage.setItem("wp-locale", locale); } catch {} applyLocale(); };
  $("start").onclick = () => { show("stage"); renderStages(); };
  $("enter").onclick = startStage;
  document.querySelectorAll("[data-back]").forEach(button => { button.onclick = () => show($("battle").hidden ? "main" : "stage"); });
  $("undo").onclick = () => { const prior = run?.history.pop(); if (prior) { run.tiles.forEach((tile, i) => { tile.rot = prior[i]; }); run.moves--; renderBoard(); } };
  $("restart").onclick = startStage;
  $("hint").onclick = () => { const tile = run.tiles.find(item => ports(item).slice().sort().join(",") !== ports({ ...item, rot: item.solved }).slice().sort().join(",")); if (tile) { run.history.push(run.tiles.map(item => item.rot)); tile.rot = tile.solved; run.moves++; renderBoard(); if (winReady()) complete(); } };
  $("retry").onclick = () => { $("result").close(); startStage(); };
  $("next").onclick = () => { $("result").close(); selected = Math.min(29, selected + 1); startStage(); };
  applyLocale();
})();
