(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const CODES = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const LOCALE_ROUTES = { en: "en", "zh-Hant": "zh-tw", "zh-Hans": "zh-cn", ja: "ja", ko: "ko", es: "es", "pt-BR": "pt-br", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const ROUTE_LOCALES = Object.fromEntries(Object.entries(LOCALE_ROUTES).map(([code, route]) => [route, code]));
  const GAME_VERSION = "v15";
  const INTERFACE_VERSION = "6";
  const BASE = window.BAMBOO_LOCALES.en;
  const LEVELS = window.BAMBOO_LEVELS.levels;
  const routeSegment = location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const routeLocale = ROUTE_LOCALES[routeSegment];
  let locale = routeLocale || localRead("weightPlayLocale") || localRead("wp-locale") || "en", selected = 0, run = null, resultActionClaimed = false, leaveOpen = false, completionTimer = 0, boardFocusIndex = 0, hintedPipeIndex = -1;
  if (!CODES.includes(locale)) locale = "en";
  if (routeLocale) {
    try {
      localStorage.setItem("weightPlayLocale", locale);
      localStorage.setItem("wp-locale", locale);
    } catch {}
  }
  let save = { unlocked: 1, done: {}, best: {} };
  try { save = { ...save, ...JSON.parse(localStorage.getItem("wp:bamboo") || "{}") }; } catch {}
  if (!save.best || typeof save.best !== "object" || Array.isArray(save.best)) save.best = {};
  selected = Math.max(0, Math.min(29, Number(save.unlocked || 1) - 1));
  const text = (key, data = {}) => String((window.BAMBOO_LOCALES[locale] || BASE)[key] || BASE[key] || key).replace(/\{(\w+)\}/g, (_, name) => data[name] ?? "");
  const screens = { main: $("main"), stage: $("stage"), battle: $("battle") };
  $("battle").append($("leaveDialogTemplate").content.cloneNode(true));
  const battleBack = () => [...$("battle").querySelectorAll('[data-wp-return="battle"]')]
    .find(node => !node.closest("[inert]") && node.getClientRects().length);
  const DIRS = [[-1, 0, 0, 2], [0, 1, 1, 3], [1, 0, 2, 0], [0, -1, 3, 1]];
  function localRead(key) { try { return localStorage.getItem(key); } catch { return null; } }
  function track(name, data = {}) {
    window.WonderAnalytics?.track?.(name, {
      game_id: "animal-bamboo-pipes",
      game_version: GAME_VERSION,
      interface_version: INTERFACE_VERSION,
      locale,
      viewport: `${Math.round(window.innerWidth)}x${Math.round(window.innerHeight)}`,
      waterway: selected + 1,
      ...data,
    });
  }
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
  function pipeShapeKey(tile) {
    if (tile.target) return "pipeShapeBasin";
    return ({ source: "pipeShapeSource", s: "pipeShapeStraight", e: "pipeShapeElbow", t: "pipeShapeTee", x: "pipeShapeCross" })[tile.shape] || "pipeShapeStraight";
  }
  function pipeAccessibleLabel(tile, index, isWet) {
    const name = tile.target ? text("basinLabel") : text("pipeLabel", { n: index + 1 });
    const shape = text(pipeShapeKey(tile));
    const flow = text(isWet ? "pipeFlowing" : "pipeDry");
    return tile.target
      ? text("pipeTargetState", { name, shape, flow })
      : text("pipeState", { name, shape, orientation: text("pipeOrientation", { n: tile.rot + 1 }), flow });
  }
  function targetIndex(level) {
    return level.target;
  }
  function basePorts(tile) {
    return tile.shape === "x" ? [0,1,2,3] : tile.shape === "s" ? [0,2] : tile.shape === "e" ? [0,1] : tile.shape === "t" ? [0,1,3] : tile.shape === "source" ? [2] : [0];
  }
  function solvedPorts(tile) {
    return tile.target ? [0,1,2,3] : ports({ ...tile, rot: tile.solved });
  }
  function hintRouteNeighbor(index) {
    if (!run || index < 0 || !run.tiles[index]) return -1;
    const row = Math.floor(index / 5), col = index % 5, routePorts = solvedPorts(run.tiles[index]), candidates = [];
    DIRS.forEach(([dr, dc, direction, reverse]) => {
      const nextRow = row + dr, nextCol = col + dc;
      if (nextRow < 0 || nextRow > 4 || nextCol < 0 || nextCol > 4) return;
      const nextIndex = nextRow * 5 + nextCol, next = run.tiles[nextIndex];
      if ((!next.required && !next.target) || !routePorts.includes(direction) || !solvedPorts(next).includes(reverse)) return;
      candidates.push(nextIndex);
    });
    return candidates.find(nextIndex => run.tiles[nextIndex].target) ?? candidates[0] ?? -1;
  }
  function hintLabel(index) {
    return index >= 0 && run.tiles[index]?.target
      ? text("basinLabel")
      : index >= 0
        ? text("hintPipeLabel", { n: index + 1 })
        : text("basinLabel");
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
    return water().has(run.tiles.findIndex(tile => tile.target));
  }
  const STAGE_POOL_SIZE = 9;
  let stageWindowStart = 0, stageCardPool = [], stageSettleRaf = 0;
  const stageWindowLimit = () => Math.max(0, LEVELS.length - STAGE_POOL_SIZE);
  const desiredStageWindow = index => Math.max(0, Math.min(stageWindowLimit(), index - Math.floor(STAGE_POOL_SIZE / 2)));
  function bindStageCard(card, index) {
    const locked = index >= save.unlocked;
    card.dataset.index = String(index); card.dataset.stageIndex = String(index);
    card.setAttribute("aria-posinset", String(index + 1)); card.setAttribute("aria-setsize", String(LEVELS.length));
    card.setAttribute("aria-disabled", locked ? "true" : "false"); card.classList.toggle("locked", locked);
    card.innerHTML = `<small>${text("chapter", { n: Math.floor(index / 5) + 1 })}</small><h3>${text("waterway", { n: index + 1 })}</h3><p>${locked ? text("locked") : save.done[index] ? text("restored") : text("objective")}</p>`;
  }
  function syncStageCards() { stageCardPool.forEach(card => { const index = Number(card.dataset.index), active = index === selected; bindStageCard(card, index); card.tabIndex = active ? 0 : -1; card.classList.toggle("selected", active); card.classList.toggle("centered", active); card.setAttribute("aria-current", active ? "true" : "false"); }); }
  function buildStagePool() {
    const rail = $("rail"); rail.innerHTML = ""; stageWindowStart = desiredStageWindow(selected);
    stageCardPool = Array.from({ length: Math.min(STAGE_POOL_SIZE, LEVELS.length) }, (_, offset) => { const card = document.createElement("button"); card.type = "button"; card.className = "stage-card"; bindStageCard(card, stageWindowStart + offset); rail.append(card); return card; });
    rail.dataset.wpStageVirtualized = "bounded-recycle"; rail.dataset.wpStagePoolSize = String(stageCardPool.length); rail.dataset.wpStageTotal = String(LEVELS.length); rail.dataset.wpStageCenterObserver = "manual";
  }
  function moveStageWindow(target) {
    const rail = $("rail"); target = Math.max(0, Math.min(stageWindowLimit(), target)); let recycled = 0;
    while (stageWindowStart < target) { const card = rail.firstElementChild; stageWindowStart++; rail.append(card); bindStageCard(card, stageWindowStart + stageCardPool.length - 1); recycled++; }
    while (stageWindowStart > target) { const card = rail.lastElementChild; stageWindowStart--; rail.prepend(card); bindStageCard(card, stageWindowStart); recycled++; }
    stageCardPool = [...rail.children]; rail.dataset.wpStageWindowStart = String(stageWindowStart); rail.dataset.wpStageWindowEnd = String(stageWindowStart + stageCardPool.length - 1); if (recycled) rail.dataset.wpStageRecycleCount = String(Number(rail.dataset.wpStageRecycleCount || 0) + recycled); return recycled;
  }
  function centerStage(index, behavior = "smooth") {
    const rail = $("rail"), card = rail.querySelector(`[data-index="${index}"]`);
    if (!card || !rail.getClientRects().length) return;
    const previousSnap = rail.style.scrollSnapType, previousBehavior = rail.style.scrollBehavior;
    rail.style.scrollSnapType = "none"; rail.style.scrollBehavior = behavior === "auto" ? "auto" : behavior;
    const reconcile = () => {
      if (!rail.contains(card)) return;
      const railRect = rail.getBoundingClientRect(), cardRect = card.getBoundingClientRect();
      const delta = cardRect.left + cardRect.width / 2 - (railRect.left + railRect.width / 2);
      const scale = card.offsetWidth ? cardRect.width / card.offsetWidth : 1;
      if (Math.abs(delta) > .5) rail.scrollLeft += delta / Math.max(scale, .01);
    };
    reconcile();
    requestAnimationFrame(() => {
      reconcile(); rail.style.scrollSnapType = previousSnap; rail.style.scrollBehavior = previousBehavior;
    });
  }
  function selectStage(index, center) { selected = Math.max(0, Math.min(LEVELS.length - 1, index)); if (!stageCardPool.length) buildStagePool(); moveStageWindow(desiredStageWindow(selected)); syncStageCards(); if (center) centerStage(selected, "auto"); }
  function renderStages() { if (!stageCardPool.length) buildStagePool(); selectStage(selected, true); }
  const stageRail = $("rail");
  let stageDrag = null, suppressStageClick = false;
  function stagePitch() {
    const first = stageRail.querySelector(".stage-card"), second = first?.nextElementSibling;
    if (!first) return 276;
    if (second) return Math.max(1, Math.abs(second.getBoundingClientRect().left - first.getBoundingClientRect().left));
    return Math.max(1, first.getBoundingClientRect().width + 12);
  }
  function positionStageLogical(logical) {
    logical = Math.max(0, Math.min(LEVELS.length - 1, logical));
    const anchor = Math.round(logical);
    selectStage(anchor, true);
    const rtl = document.documentElement.dir === "rtl" ? -1 : 1;
    stageRail.scrollLeft += (logical - anchor) * stagePitch() * rtl;
    stageRail.dataset.wpStageDragLogical = logical.toFixed(4);
    return logical;
  }
  stageRail.dataset.wpStageVirtualDrag = "true";
  stageRail.dataset.wpStageCenterObserver = "manual";
  stageRail.addEventListener("keydown", event => {
    const card = event.target.closest(".stage-card");
    if (!card) return;
    if ((event.key === "Enter" || event.key === " ") && Number(card.dataset.index) < save.unlocked) {
      event.preventDefault(); event.stopImmediatePropagation(); selectStage(Number(card.dataset.index), false); startStage(); return;
    }
    if (!["Home", "End", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault(); event.stopImmediatePropagation();
    const rtl = document.documentElement.dir === "rtl";
    const step = event.key === "ArrowRight" ? (rtl ? -1 : 1) : (rtl ? 1 : -1);
    const next = event.key === "Home" ? 0 : event.key === "End" ? LEVELS.length - 1 : selected + step;
    selectStage(next, true);
    stageRail.querySelector(`[data-index="${selected}"]`)?.focus({ preventScroll: true });
  }, true);
  stageRail.addEventListener("pointerdown", event => {
    if (event.isPrimary === false || (event.button !== undefined && event.button !== 0)) return;
    cancelAnimationFrame(stageSettleRaf); stageSettleRaf = 0;
    stageDrag = { id: event.pointerId, startX: event.clientX, lastX: event.clientX, logical: selected, moved: false };
    stageRail.setPointerCapture?.(event.pointerId);
    stageRail.style.setProperty("scroll-snap-type", "none", "important");
    event.stopImmediatePropagation();
  }, true);
  document.addEventListener("pointermove", event => {
    if (event.pointerId !== stageDrag?.id) return;
    const delta = event.clientX - stageDrag.lastX; stageDrag.lastX = event.clientX;
    stageRail.dataset.wpDragMove = String(Number(stageRail.dataset.wpDragMove || 0) + 1);
    if (!stageDrag.moved && Math.abs(event.clientX - stageDrag.startX) > 4) stageDrag.moved = true;
    if (stageDrag.moved) {
      event.preventDefault();
      const rtl = document.documentElement.dir === "rtl" ? -1 : 1;
      stageDrag.logical = positionStageLogical(stageDrag.logical - delta * rtl / stagePitch());
      stageRail.dataset.wpDragApplied = String(Number(stageRail.dataset.wpDragApplied || 0) + 1);
    }
    event.stopImmediatePropagation();
  }, true);
  const finishStageDrag = event => {
    if (event.pointerId !== stageDrag?.id) return;
    const drag = stageDrag; stageDrag = null;
    if (stageRail.hasPointerCapture?.(event.pointerId)) stageRail.releasePointerCapture(event.pointerId);
    if (!drag.moved) {
      stageRail.style.removeProperty("scroll-snap-type");
      const card = document.elementFromPoint(event.clientX, event.clientY)?.closest?.(".stage-card"), index = Number(card?.dataset.index);
      if (card && index < save.unlocked) { suppressStageClick = true; setTimeout(() => { suppressStageClick = false; }, 0); selectStage(index, false); startStage(); }
      return;
    }
    event.preventDefault();
    const from = drag.logical, target = Math.round(from), started = performance.now();
    stageRail.dataset.wpStageSettling = "true";
    const settle = now => {
      const progress = Math.min(1, (now - started) / 340), eased = progress * progress * (3 - 2 * progress);
      positionStageLogical(from + (target - from) * eased);
      if (progress < 1) stageSettleRaf = requestAnimationFrame(settle);
      else { stageSettleRaf = 0; selectStage(target, true); stageRail.style.removeProperty("scroll-snap-type"); delete stageRail.dataset.wpStageSettling; }
    };
    stageSettleRaf = requestAnimationFrame(settle);
    suppressStageClick = true; setTimeout(() => { suppressStageClick = false; }, 0);
    event.stopImmediatePropagation();
  };
  document.addEventListener("pointerup", finishStageDrag, true);
  document.addEventListener("pointercancel", finishStageDrag, true);
  stageRail.addEventListener("click", event => {
    const card = event.target.closest(".stage-card");
    if (!card) return;
    if (suppressStageClick) { suppressStageClick = false; event.preventDefault(); event.stopImmediatePropagation(); return; }
    const index = Number(card.dataset.index);
    if (index < save.unlocked) { event.preventDefault(); event.stopImmediatePropagation(); selectStage(index, false); startStage(); }
  }, true);
  function renderBoard(focusIndex = -1) {
    const wet = water(), board = $("board"); board.innerHTML = "";
    const hintNeighborIndex = hintRouteNeighbor(hintedPipeIndex);
    const enabledIndexes = run.tiles.map((tile, index) => tile.target || run.completed ? -1 : index).filter(index => index >= 0);
    if (!enabledIndexes.includes(boardFocusIndex)) boardFocusIndex = enabledIndexes[0] ?? 0;
    run.tiles.forEach((tile, index) => {
      const pipe = document.createElement("button");
      pipe.className = `pipe${wet.has(index) ? " wet" : ""}${index === hintedPipeIndex ? " hint-target" : ""}${index === hintNeighborIndex ? " hint-neighbor" : ""}`;
      if (tile.target) pipe.classList.add("target");
      pipe.dataset.shape = tile.shape;
      pipe.style.setProperty("--pipe-rotation", `${tile.rot * 90}deg`);
      pipe.dataset.rotation = String(tile.rot);
      pipe.setAttribute("aria-label", pipeAccessibleLabel(tile, index, wet.has(index)));
      pipe.disabled = tile.target || run.completed;
      pipe.tabIndex = !pipe.disabled && index === boardFocusIndex ? 0 : -1;
      const flow = flowSvg(tile, index, wet.has(index));
      if (flow) pipe.append(flow);
      if (!tile.target) pipe.onclick = event => { if(run.completed)return;hintedPipeIndex=-1;boardFocusIndex=index;run.history.push(run.tiles.map(item => item.rot)); tile.rot = (tile.rot + 1) % 4; run.moves++; renderBoard(event.detail === 0 ? index : -1); if (winReady()) complete(); };
      board.append(pipe);
    });
    $("moves").textContent = text("moves", { n: run.moves });
    $("cue").textContent = hintedPipeIndex >= 0
      ? text("hintRoute", { pipe: hintLabel(hintedPipeIndex), next: hintLabel(hintNeighborIndex) })
      : text("cue");
    if (focusIndex >= 0 && !board.children[focusIndex]?.disabled) board.children[focusIndex].focus();
  }
  function startStage(entry = "stage") {
    cancelCompletionReveal();
    setResultOpen(false);
    run = { tiles: stageData(selected), history: [], moves: 0, completed: false, hintUsed: false, undoUsed: false };
    hintedPipeIndex = -1;
    boardFocusIndex = run.tiles.findIndex(tile => !tile.target);
    $("chapter").textContent = text("chapter", { n: Math.floor(selected / 5) + 1 });
    $("stageName").textContent = text("waterway", { n: selected + 1 });
    show("battle"); renderBoard(boardFocusIndex);
    track("game_start", { stage: selected + 1, entry });
    track("waterway_started", { entry });
    requestAnimationFrame(() => $("board").children[boardFocusIndex]?.focus({ preventScroll: true }));
  }
  function complete() {
    if(run.completed)return;
    run.completed = true;
    save.done[selected] = true;
    const previousBest = Number(save.best[selected]);
    save.best[selected] = Number.isFinite(previousBest) && previousBest >= 0
      ? Math.min(previousBest, run.moves)
      : run.moves;
    save.unlocked = Math.max(save.unlocked, Math.min(30, selected + 2)); persist();
    track("game_complete", { stage: selected + 1, turns: run.moves });
    track("waterway_restored", { turns: run.moves, hint_used: Boolean(run.hintUsed), undo_used: Boolean(run.undoUsed) });
    updateMainProgress();
    $("resultText").textContent = text("resultText", { moves: run.moves, n: selected + 1 });
    $("resultMastery").textContent = text("replayGoal", { moves: save.best[selected] });
    $("resultPreview").textContent = selected < LEVELS.length - 1
      ? text("nextPreview", { n: selected + 2, chapter: text("chapter", { n: Math.floor((selected + 1) / 5) + 1 }) })
      : "";
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
      $("resultMastery").textContent = run.completed
        ? text("replayGoal", { moves: save.best?.[selected] ?? run.moves })
        : "";
      $("resultPreview").textContent = run?.completed && selected < LEVELS.length - 1
        ? text("nextPreview", { n: selected + 2, chapter: text("chapter", { n: Math.floor((selected + 1) / 5) + 1 }) })
        : "";
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
  document.addEventListener("keydown", event => {
    if (!event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
    if (![battleBack(), $("continueBattle"), $("leaveBattle")].includes(event.target)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
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
  $("board").addEventListener("focusin", event => {
    const pipe = event.target.closest?.(".pipe:not(:disabled)");
    if (!pipe) return;
    boardFocusIndex = [...$("board").children].indexOf(pipe);
    [...$("board").children].forEach((child, index) => { child.tabIndex = index === boardFocusIndex && !child.disabled ? 0 : -1; });
  });
  $("board").addEventListener("keydown", event => {
    const pipe = event.target.closest?.(".pipe:not(:disabled)");
    if (!pipe) return;
    const current = [...$("board").children].indexOf(pipe);
    const delta = event.key === "ArrowLeft" ? -1
      : event.key === "ArrowRight" ? 1
        : event.key === "ArrowUp" ? -5
          : event.key === "ArrowDown" ? 5
            : 0;
    let next = event.key === "Home" ? 0 : event.key === "End" ? 24 : current;
    if (delta) {
      next += delta;
      while (next >= 0 && next < 25 && $("board").children[next]?.disabled) next += delta;
      if ((delta === -1 || delta === 1) && Math.floor(next / 5) !== Math.floor(current / 5)) next = current;
    } else if (event.key !== "Home" && event.key !== "End") {
      return;
    }
    while (next >= 0 && next < 25 && $("board").children[next]?.disabled) next += event.key === "End" ? -1 : 1;
    if (next < 0 || next >= 25 || next === current) return;
    event.preventDefault();
    boardFocusIndex = next;
    [...$("board").children].forEach((child, index) => { child.tabIndex = index === next && !child.disabled ? 0 : -1; });
    $("board").children[next].focus({ preventScroll: true });
  });
  $("undo").onclick = () => { if(run?.completed)return;const prior = run?.history.pop(); if (prior) { run.undoUsed = true; track("undo_used", { turns_before: run.moves }); run.tiles.forEach((tile, i) => { tile.rot = prior[i]; }); run.moves--; renderBoard(); } };
  $("restart").onclick = () => { if (run && !run.completed) track("restart_used", { turns_before: run.moves }); startStage("restart"); };
  $("hint").onclick = () => {
    if (run?.completed) return;
    hintedPipeIndex = run.tiles.findIndex(item => item.required && ports(item).slice().sort().join(",") !== ports({ ...item, rot: item.solved }).slice().sort().join(","));
    if (hintedPipeIndex < 0) return;
    run.hintUsed = true;
    track("hint_used", { pipe: hintedPipeIndex + 1, turns: run.moves });
    boardFocusIndex = hintedPipeIndex;
    renderBoard(hintedPipeIndex);
  };
  $("rail").addEventListener("wonder:stage-snap", event => {
    const index = Number(event.detail?.index);
    if (Number.isInteger(index) && index >= 0) selectStage(index, false);
  });
  $("retry").onclick = () => { if (!claimResultAction()) return; track("result_replay", { from: "result" }); setResultOpen(false); startStage("replay"); };
  $("next").onclick = () => { if (selected >= 29 || !claimResultAction()) return; track("next_waterway_clicked", { from_waterway: selected + 1, to_waterway: selected + 2 }); setResultOpen(false); selected += 1; startStage("next"); };
  $("resultStages").onclick = () => { if (!claimResultAction()) return; track("return_to_waterways", { from: "result" }); setResultOpen(false); show("stage"); renderStages(); };
  applyLocale();
})();
