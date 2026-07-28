(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const CODES = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const LOCALE_ROUTES = { en: "en", "zh-Hant": "zh-tw", "zh-Hans": "zh-cn", ja: "ja", ko: "ko", es: "es", "pt-BR": "pt-br", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const BASE = window.BAMBOO_LOCALES.en;
  const LEVELS = window.BAMBOO_LEVELS.levels;
  let locale = localRead("weightPlayLocale") || localRead("wp-locale") || "en", selected = 0, run = null, resultActionClaimed = false, leaveOpen = false, completionTimer = 0;
  if (!CODES.includes(locale)) locale = "en";
  let save = { unlocked: 1, done: {} };
  try { save = { ...save, ...JSON.parse(localStorage.getItem("wp:bamboo") || "{}") }; } catch {}
  selected = Math.max(0, Math.min(29, Number(save.unlocked || 1) - 1));
  const text = (key, data = {}) => String((window.BAMBOO_LOCALES[locale] || BASE)[key] || BASE[key] || key).replace(/\{(\w+)\}/g, (_, name) => data[name] ?? "");
  const screens = { main: $("main"), stage: $("stage"), battle: $("battle") };
  $("battle").append($("leaveDialogTemplate").content.cloneNode(true));
  const battleBack = () => [...$("battle").querySelectorAll('[data-wp-return="battle"]')]
    .find(node => !node.closest("[inert]") && node.getClientRects().length);
  const DIRS = [[-1, 0, 0, 2], [0, 1, 1, 3], [1, 0, 2, 0], [0, -1, 3, 1]];
  function localRead(key) { try { return localStorage.getItem(key); } catch { return null; } }
  function show(name) {
    if (name !== "battle") cancelCompletionReveal();
    document.body.dataset.screen = name;
    $("mainGroup").hidden = name !== "main";
    Object.entries(screens).forEach(([key, node]) => { node.hidden = key !== name; });
    $("generalReserve").hidden = name !== "battle";
    if (name !== "battle") {
      setResultOpen(false);
      setLeaveOpen(false, false);
    }
  }
  function persist() { try { localStorage.setItem("wp:bamboo", JSON.stringify(save)); } catch {} }
  function stageData(index) {
    const level = LEVELS[index], target = targetIndex(level);
    return window.BAMBOO_LEVELS.createStageTiles(level, index, target);
  }
  function ports(tile) {
    const raw = tile.shape === "x" || tile.target ? [0,1,2,3] : tile.shape === "s" ? [0,2] : tile.shape === "e" ? [0,1] : tile.shape === "t" ? [0,1,3] : tile.shape === "source" ? [2] : [0];
    return raw.map(port => (port + tile.rot) % 4);
  }
  function targetIndex(level) {
    const solved = level.tiles.map(tile => ({ ...tile, target: false, rot: tile.solved }));
    const distance = Array(25).fill(-1), queue = [level.source];
    distance[level.source] = 0;
    while (queue.length) {
      const index = queue.shift(), row = Math.floor(index / 5), col = index % 5;
      DIRS.forEach(([dr, dc, direction, reverse]) => {
        const nr = row + dr, nc = col + dc, next = nr * 5 + nc;
        if (nr < 0 || nr > 4 || nc < 0 || nc > 4 || distance[next] >= 0) return;
        if (ports(solved[index]).includes(direction) && ports(solved[next]).includes(reverse)) {
          distance[next] = distance[index] + 1;
          queue.push(next);
        }
      });
    }
    return solved.reduce((best, tile, index) => tile.shape === "goal" && distance[index] > distance[best] ? index : best, solved.findIndex(tile => tile.shape === "goal"));
  }
  function basePorts(tile) {
    return tile.shape === "x" ? [0,1,2,3] : tile.shape === "s" ? [0,2] : tile.shape === "e" ? [0,1] : tile.shape === "t" ? [0,1,3] : tile.shape === "source" ? [2] : [0];
  }
  function flowSvg(tile, index, wet) {
    if (!wet || tile.target) return null;
    const paths = basePorts(tile).map(port => {
      const end = [[50,0],[100,50],[50,100],[0,50]][port];
      return `<path d="M50 50 L${end[0]} ${end[1]}" pathLength="1"/>`;
    }).join("");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("flow"); svg.setAttribute("viewBox", "0 0 100 100"); svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = `<g class="flow-channel">${paths}</g><g class="flow-current">${paths}</g>`;
    if (tile.shape === "source") svg.classList.add("flow-source");
    if (tile.shape === "goal") svg.classList.add("flow-goal");
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
    return water().size === run.tiles.length;
  }
  function renderStages() {
    const rail = $("rail"); rail.innerHTML = "";
    for (let index = 0; index < 30; index++) {
      const locked = index >= save.unlocked, card = document.createElement("button");
      card.className = `stage-card${index === selected ? " selected centered" : ""}${locked ? " locked" : ""}`;
      card.dataset.index = String(index);
      card.dataset.stageIndex = String(index);
      card.setAttribute("aria-current", index === selected ? "true" : "false");
      card.setAttribute("aria-disabled", locked ? "true" : "false");
      card.innerHTML = `<small>${text("chapter", { n: Math.floor(index / 5) + 1 })}</small><h3>${text("waterway", { n: index + 1 })}</h3><p>${locked ? text("locked") : save.done[index] ? text("restored") : text("objective")}</p>`;
      card.onclick = () => { selectStage(index, true); if (!locked) startStage(); };
      rail.append(card);
    }
    selectStage(selected, false);
    requestAnimationFrame(() => centerStage(selected, "auto"));
  }
  function centerStage(index, behavior = "smooth") {
    $("rail").children[index]?.scrollIntoView({ behavior, inline: "center", block: "nearest" });
  }
  function selectStage(index, center) {
    selected = Math.max(0, Math.min(29, index));
    [...$("rail").children].forEach((card, cardIndex) => {
      const active = cardIndex === selected;
      card.classList.toggle("selected", active);
      card.classList.toggle("centered", active);
      card.setAttribute("aria-current", active ? "true" : "false");
    });
    if (center) centerStage(selected);
  }
  function renderBoard() {
    const wet = water(), board = $("board"); board.innerHTML = "";
    run.tiles.forEach((tile, index) => {
      const pipe = document.createElement("button");
      pipe.className = `pipe${wet.has(index) ? " wet" : ""}`;
      if (tile.target) pipe.classList.add("target");
      pipe.dataset.shape = tile.shape;
      pipe.style.setProperty("--pipe-rotation", `${tile.rot * 90}deg`);
      pipe.dataset.rotation = String(tile.rot);
      pipe.setAttribute("aria-label", text("pipeLabel", { n: index + 1 }));
      pipe.disabled = tile.target || run.completed;
      const flow = flowSvg(tile, index, wet.has(index));
      if (flow) pipe.append(flow);
      if (!tile.target) pipe.onclick = () => { if(run.completed)return;run.history.push(run.tiles.map(item => item.rot)); tile.rot = (tile.rot + 1) % 4; run.moves++; renderBoard(); if (winReady()) complete(); };
      board.append(pipe);
    });
    $("moves").textContent = text("moves", { n: run.moves });
    $("cue").textContent = text("cue");
  }
  function startStage() {
    cancelCompletionReveal();
    setResultOpen(false);
    run = { tiles: stageData(selected), history: [], moves: 0, completed: false };
    $("chapter").textContent = text("chapter", { n: Math.floor(selected / 5) + 1 });
    $("stageName").textContent = text("waterway", { n: selected + 1 });
    show("battle"); renderBoard();
  }
  function complete() {
    if(run.completed)return;
    run.completed = true;
    save.done[selected] = true;
    save.unlocked = Math.max(save.unlocked, Math.min(30, selected + 2)); persist();
    updateMainProgress();
    $("resultText").textContent = text("resultText", { moves: run.moves, n: selected + 1 });
    $("retry").disabled = false;
    $("resultStages").disabled = false;
    $("next").disabled = selected >= 29;
    [$("resultStages"), $("next"), $("retry")].forEach(button => button.classList.remove("primary"));
    const primaryAction = $("next").disabled ? $("resultStages") : $("next");
    primaryAction.classList.add("primary");
    $("board").classList.add("celebrating");
    $("battle").classList.add("celebrating");
    scheduleCompletionReveal(primaryAction,900);
  }
  function cancelCompletionReveal() {
    clearTimeout(completionTimer);
    completionTimer=0;
    $("board")?.classList.remove("celebrating");
    $("battle")?.classList.remove("celebrating");
  }
  function scheduleCompletionReveal(primaryAction,delay=150) {
    clearTimeout(completionTimer);
    completionTimer=setTimeout(()=>{
      completionTimer=0;
      if(!run?.completed||document.body.dataset.screen!=="battle"||leaveOpen)return;
      setResultOpen(true);
      primaryAction.focus();
    },delay);
  }
  function claimResultAction() {
    if ($("result").hidden || resultActionClaimed) return false;
    resultActionClaimed = true;
    [$("resultStages"), $("next"), $("retry")].forEach(button => { button.disabled = true; });
    return true;
  }
  function setResultOpen(open) {
    const result = $("result"), battle = $("battle"), owned = [...battle.querySelectorAll(":scope > header"), battle.querySelector(".battle-panel")];
    battle.classList.toggle("result-open", open);
    owned.forEach(node => {
      if (!node) return;
      node.inert = open;
      if (open) node.setAttribute("aria-hidden", "true");
      else node.removeAttribute("aria-hidden");
    });
    result.hidden = !open;
    if (open) {
      resultActionClaimed = false;
      battle.scrollTop = 0;
      result.scrollTop = 0;
    }
  }
  function setLeaveOpen(open, restoreFocus = true) {
    if (!$("result").hidden && open) return;
    const battle = $("battle"), dialog = $("leaveDialog");
    const owned = [...battle.querySelectorAll(":scope > header"), battle.querySelector(".battle-panel")];
    leaveOpen = open;
    battle.classList.toggle("leave-open", open);
    owned.forEach(node => {
      if (!node) return;
      node.inert = open;
      if (open) node.setAttribute("aria-hidden", "true");
      else if ($("result").hidden) node.removeAttribute("aria-hidden");
    });
    if (open) {
      dialog.hidden = false;
      $("continueBattle").focus();
    } else {
      if (restoreFocus && !battle.hidden) battleBack()?.focus();
      dialog.hidden = true;
      if (run?.completed && $("result").hidden) scheduleCompletionReveal($("next").disabled ? $("resultStages") : $("next"));
    }
  }
  function updateMainProgress() {
    $("mainProgress").textContent = `${text("waterway", { n: Math.min(save.unlocked, 30) })} / 30`;
  }
  function applyLocale() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.title = `${text("title")} | WeightPlay`;
    document.querySelectorAll("[data-bamboo-t]").forEach(node => { node.textContent = text(node.dataset.bambooT); });
    document.querySelector(".locale").firstChild.textContent = `${text("language")} `;
    const mainReturn = document.querySelector(".return");
    if (mainReturn) {
      mainReturn.setAttribute("aria-label", text("returnLobby"));
      mainReturn.href = `/${LOCALE_ROUTES[locale] || "en"}/`;
    }
    document.querySelectorAll("[data-back]").forEach(node => node.setAttribute("aria-label", text("back")));
    $("rail").setAttribute("aria-label", text("stageSelector"));
    $("board").setAttribute("aria-label", text("boardLabel"));
    document.querySelector(".hero img")?.setAttribute("alt", text("coverAlt"));
    $("publicGuide")?.setAttribute("aria-label", text("guideTitle"));
    updateMainProgress();
    if (run) {
      $("resultText").textContent = text("resultText", { moves: run.moves, n: selected + 1 });
    }
    renderStages();
  }
  CODES.forEach(code => { const option = document.createElement("option"); option.value = code; option.textContent = window.BAMBOO_LOCALES[code].label; $("locale").append(option); });
  $("locale").value = locale;
  $("locale").onchange = event => {
    locale = event.target.value;
    try {
      localStorage.setItem("weightPlayLocale", locale);
      localStorage.setItem("wp-locale", locale);
    } catch {}
    window.WonderI18n?.setLocale?.(locale);
    applyLocale();
  };
  window.addEventListener("wonder:locale-change", event => {
    const nextLocale = event.detail?.locale;
    if (!CODES.includes(nextLocale)) return;
    locale = nextLocale;
    $("locale").value = locale;
    applyLocale();
    setTimeout(() => {
      if (locale === nextLocale) applyLocale();
    }, 0);
  });
  $("start").onclick = () => { show("stage"); renderStages(); };
  document.querySelector("#stage [data-back]").onclick = () => show("main");
  document.addEventListener("click", event => {
    const control = event.target.closest?.('#battle [data-wp-return="battle"]');
    if (!control || $("battle").hidden || !$("result").hidden) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    setLeaveOpen(true);
  }, true);
  $("continueBattle").onclick = () => setLeaveOpen(false);
  $("leaveBattle").onclick = () => {
    setLeaveOpen(false, false);
    show("stage");
    renderStages();
  };
  document.addEventListener("keydown", event => {
    if (!leaveOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setLeaveOpen(false);
      return;
    }
    if (event.key !== "Tab") return;
    const actions = [$("continueBattle"), $("leaveBattle")];
    const index = actions.indexOf(document.activeElement);
    if (event.shiftKey && index <= 0) {
      event.preventDefault();
      actions[actions.length - 1].focus();
    } else if (!event.shiftKey && index === actions.length - 1) {
      event.preventDefault();
      actions[0].focus();
    }
  });
  $("undo").onclick = () => { if(run?.completed)return;const prior = run?.history.pop(); if (prior) { run.tiles.forEach((tile, i) => { tile.rot = prior[i]; }); run.moves--; renderBoard(); } };
  $("restart").onclick = startStage;
  $("hint").onclick = () => { if(run?.completed)return;const tile = run.tiles.find(item => ports(item).slice().sort().join(",") !== ports({ ...item, rot: item.solved }).slice().sort().join(",")); if (tile) { run.history.push(run.tiles.map(item => item.rot)); tile.rot = tile.solved; run.moves++; renderBoard(); if (winReady()) complete(); } };
  $("rail").addEventListener("wonder:stage-snap", event => {
    const index = Number(event.detail?.index);
    if (Number.isInteger(index) && index >= 0) selectStage(index, false);
  });
  $("retry").onclick = () => { if (!claimResultAction()) return; setResultOpen(false); startStage(); };
  $("next").onclick = () => { if (selected >= 29 || !claimResultAction()) return; setResultOpen(false); selected += 1; startStage(); };
  $("resultStages").onclick = () => { if (!claimResultAction()) return; setResultOpen(false); show("stage"); renderStages(); };
  applyLocale();
})();
