(() => {
  "use strict";
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((__wpMeasurement.screen) === "battle" && (__wpMeasurement.ended)) ? null : (__wpMeasurement.screen), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(run?.paused || run?.suspended || leaveOpen), node: document.body,
    activityMode: "input", idleSeconds: 300
  });
  function __wpNotifyMeasurement() { try { window.WonderAnalytics?.game?.observeState(__wpReadMeasurement); } catch { /* Optional telemetry. */ } }
  // Explicit authored replay actions count only when a new round was actually created.
  function __wpReplayStart(action) {
    const previous = __wpMeasurement.roundKey, value = action();
    if (__wpMeasurement.roundKey !== previous) { __wpMeasurement.restart = true; __wpNotifyMeasurement(); }
    return value;
  }
  window.addEventListener("weightplay:analytics-ready", __wpNotifyMeasurement);
  __wpNotifyMeasurement();

  const $ = id => document.getElementById(id);
  const CODES = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const LOCALE_ROUTES = { en: "en", "zh-Hant": "zh-tw", "zh-Hans": "zh-cn", ja: "ja", ko: "ko", es: "es", "pt-BR": "pt-br", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const ROUTE_LOCALES = Object.fromEntries(Object.entries(LOCALE_ROUTES).map(([code, route]) => [route, code]));
  const GAME_VERSION = "v29";
  const INTERFACE_VERSION = "9";
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
  // Mark the authored game summary before the shared shell normalizes Main.
  // Without this semantic hook, the normalizer falls back to the first Guide
  // paragraph and leaves that stale locale-owned copy visible after a shell
  // language switch.
  document.querySelector('main#main [data-bamboo-t="summary"]')?.classList.add("main-summary");
  const text = (key, data = {}) => String((window.BAMBOO_LOCALES[locale] || BASE)[key] || BASE[key] || key).replace(/\{(\w+)\}/g, (_, name) => data[name] ?? "");
  function beaconProgress(tiles, wet) {
    let got = 0, total = 0;
    tiles.forEach((tile, index) => {
      if (!tile.beacon) return;
      total++;
      if (wet.has(index)) got++;
    });
    return { got, total };
  }
  // The inline arrow is authored facing south; convert north/east/south/west
  // direction IDs into the quarter turns needed by that visual baseline.
  function sluiceArrowRotation(exit) { return (exit + 2) % 4; }
  const screens = { main: $("main"), stage: $("stage"), battle: $("battle") };
  let sharedFrame = null, stageUI = null;
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
    if (name !== "battle") {
      setResultOpen(false, false);
      setLeaveOpen(false, false, false);
    }
    if (name === "stage") renderStages();
    sharedFrame?.activate(name, {covered: name === "battle" && (!$('result').hidden || leaveOpen)});

    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[name] ?? null;
      if (["result"].includes(name) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
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
    const base = tile.target
      ? text("pipeTargetState", { name, shape, flow })
      : text("pipeState", { name, shape, orientation: text("pipeOrientation", { n: tile.rot + 1 }), flow });
    const sluice = tile.sluice
      ? text("sluiceState", { direction: text(["directionNorth", "directionEast", "directionSouth", "directionWest"][(tile.sluiceBaseExit + tile.rot) % 4]) })
      : "";
    const beacon = tile.beacon
      ? text("beaconState", { state: text(isWet ? "beaconWet" : "beaconDry") })
      : "";
    return [base, sluice, beacon].filter(Boolean).join(", ");
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
  function hintNeedsCorrection(tile) {
    if (tile.sluice) return (tile.sluiceBaseExit + tile.rot) % 4 !== (tile.sluiceBaseExit + tile.solved) % 4;
    return ports(tile).slice().sort().join(",") !== solvedPorts(tile).slice().sort().join(",");
  }
  function hintTargetIndex(tiles) {
    return tiles.findIndex(tile => tile.required && hintNeedsCorrection(tile));
  }
  function hintRouteNeighbor(index) {
    if (!run || index < 0 || !run.tiles[index]) return -1;
    const tile = run.tiles[index], row = Math.floor(index / 5), col = index % 5;
    const routePorts = tile.sluice ? [(tile.sluiceBaseExit + tile.solved) % 4] : solvedPorts(tile), candidates = [];
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
    const depth = run.flowDistance?.[index] ?? 0;
    svg.style.setProperty("--flow-delay", `${Math.min(depth, 14) * 0.055}s`);
    svg.innerHTML = `<g class="flow-channel">${paths}</g><g class="flow-current">${paths}</g>`;
    if (tile.shape === "source") svg.classList.add("flow-source");
    if (tile.shape === "goal") svg.classList.add("flow-goal");
    return svg;
  }
  function water() {
    const source = run.tiles.findIndex(tile => tile.shape === "source");
    const queue = [[Math.floor(source / 5), source % 5]], wet = new Set([source]);
    run.flowDistance = Array(run.tiles.length).fill(-1);
    run.flowDistance[source] = 0;
    while (queue.length) {
      const [row, col] = queue.shift(), current = run.tiles[row * 5 + col];
      const openings = ports(current);
      const exits = current.sluice
        ? [((current.sluiceBaseExit + current.rot) % 4 + 4) % 4]
        : openings;
      DIRS.forEach(([dr, dc, direction, reverse]) => {
        if (!exits.includes(direction) || !openings.includes(direction)) return;
        const nextRow = row + dr, nextCol = col + dc, nextIndex = nextRow * 5 + nextCol;
        if (nextRow < 0 || nextRow > 4 || nextCol < 0 || nextCol > 4 || wet.has(nextIndex)) return;
        const next = run.tiles[nextIndex];
        if (ports(next).includes(reverse)) {
          wet.add(nextIndex);
          run.flowDistance[nextIndex] = run.flowDistance[row * 5 + col] + 1;
          queue.push([nextRow, nextCol]);
        }
      });
    }
    return wet;
  }
  function winReady() {
    return water().has(run.tiles.findIndex(tile => tile.target));
  }
  function renderStages() {
    if (stageUI) stageUI.refresh(selected);
    sharedFrame?.syncStageInfo();
  }
  function renderBoard(focusIndex = -1) {
    const wet = water(), board = $("board"), stageKey = String(selected);
    const canReuse = board.dataset.stageIndex === stageKey && board.children.length === run.tiles.length;
    if (!canReuse) {
      board.replaceChildren(...run.tiles.map(() => {
        const pipe = document.createElement("button");
        pipe.type = "button";
        return pipe;
      }));
      board.dataset.stageIndex = stageKey;
    }
    const hintNeighborIndex = hintRouteNeighbor(hintedPipeIndex);
    const enabledIndexes = run.tiles.map((tile, index) => tile.target || tile.anchored || run.completed ? -1 : index).filter(index => index >= 0);
    if (!enabledIndexes.includes(boardFocusIndex)) boardFocusIndex = enabledIndexes[0] ?? 0;
    run.tiles.forEach((tile, index) => {
      const pipe = board.children[index], isWet = wet.has(index);
      pipe.className = `pipe${isWet ? " wet" : ""}${tile.beacon ? " beacon" : ""}${tile.sluice ? " sluice" : ""}${tile.anchored ? " anchored" : ""}${index === hintedPipeIndex ? " hint-target" : ""}${index === hintNeighborIndex ? " hint-neighbor" : ""}`;
      if (tile.target) pipe.classList.add("target");
      pipe.dataset.shape = tile.shape;
      pipe.style.setProperty("--pipe-rotation", `${tile.rot * 90}deg`);
      if (tile.sluice) {
        const exit = (tile.sluiceBaseExit + tile.rot) % 4;
        pipe.style.setProperty("--sluice-rotation", `${sluiceArrowRotation(exit) * 90}deg`);
      } else pipe.style.removeProperty("--sluice-rotation");
      pipe.style.setProperty("--flow-delay", `${Math.min(run.flowDistance?.[index] ?? 0, 14) * 0.055}s`);
      pipe.dataset.rotation = String(tile.rot);
      pipe.setAttribute("aria-label", pipeAccessibleLabel(tile, index, isWet));
      pipe.disabled = tile.target || tile.anchored || run.completed;
      let sluiceMark = pipe.querySelector(".sluice-mark");
      if (tile.sluice && !sluiceMark) {
        sluiceMark = document.createElement("span");
        sluiceMark.className = "sluice-mark";
        sluiceMark.setAttribute("aria-hidden", "true");
        sluiceMark.innerHTML = '<svg viewBox="0 0 100 100" focusable="false"><path d="M50 12v65M30 57l20 21 20-21"/></svg>';
        pipe.append(sluiceMark);
      } else if (!tile.sluice) sluiceMark?.remove();
      let beaconMark = pipe.querySelector(".beacon-mark");
      if (tile.beacon && !beaconMark) {
        beaconMark = document.createElement("span");
        beaconMark.className = "beacon-mark";
        beaconMark.setAttribute("aria-hidden", "true");
        beaconMark.innerHTML = '<svg viewBox="0 0 24 24" focusable="false"><path d="M12 2.5c-3.7 4.2-6 7.1-6 10.4a6 6 0 0 0 12 0c0-3.3-2.3-6.2-6-10.4Z"/><path d="M9.2 13.5a2.8 2.8 0 0 0 2.8 2.8"/></svg>';
        pipe.append(beaconMark);
      } else if (!tile.beacon) beaconMark?.remove();
      if (!pipe.disabled && index === boardFocusIndex) pipe.dataset.wpPrimaryAction = "true";
      else pipe.removeAttribute("data-wp-primary-action");
      pipe.tabIndex = !pipe.disabled && index === boardFocusIndex ? 0 : -1;
      let flow = pipe.querySelector(".flow");
      if (isWet && !tile.target && !flow) pipe.append(flowSvg(tile, index, true));
      else if ((!isWet || tile.target) && flow) flow.remove();
      pipe.onclick = tile.target || tile.anchored ? null : event => {
        if (run.completed) return;
        hintedPipeIndex = -1;
        boardFocusIndex = index;
        run.history.push(run.tiles.map(item => item.rot));
        tile.rot = (tile.rot + 1) % 4;
        run.moves++;
        renderBoard(event.detail === 0 ? index : -1);
        if (winReady()) complete();
      };
    });
    $("moves").textContent = text("moves", { n: run.moves });
    const bloom = beaconProgress(run.tiles, wet);
    const hasSluice = run.tiles.some(tile => tile.sluice);
    $("cue").textContent = hintedPipeIndex >= 0
      ? text("hintRoute", { pipe: hintLabel(hintedPipeIndex), next: hintLabel(hintNeighborIndex) })
      : hasSluice && bloom.total ? text("mixedCue", bloom)
        : hasSluice ? text("sluiceCue")
          : bloom.total ? text("bloomCue", bloom)
            : text("cue");
    if (focusIndex >= 0 && !board.children[focusIndex]?.disabled) board.children[focusIndex].focus();
  }
  function startStage(entry = "stage") {
    cancelCompletionReveal();
    setResultOpen(false, false);
    run = { tiles: stageData(selected), history: [], moves: 0, completed: false, hintUsed: false, undoUsed: false, flowDistance: [] };
    hintedPipeIndex = -1;
    boardFocusIndex = run.tiles.findIndex(tile => !tile.target);
    $("chapter").textContent = text("chapter", { n: Math.floor(selected / 5) + 1 });
    $("stageName").textContent = text("waterway", { n: selected + 1 });
    show("battle"); renderBoard(boardFocusIndex);
    window.WeightPlayAudio?.play?.("game.start");
    track("game_start", { stage: selected + 1, entry });
    track("waterway_started", { entry });
    requestAnimationFrame(() => $("board").children[boardFocusIndex]?.focus({ preventScroll: true }));

    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
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
    $("resultMastery").textContent = masteryText();
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
  function masteryText() {
    const bloom = beaconProgress(run.tiles, water());
    return `${text("replayGoal", { moves: save.best[selected] ?? run.moves })}${bloom.total ? text("bloomResult", bloom) : ""}`;
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
  function setResultOpen(open, syncFrame = true) {
    const result = $("result"), battle = $("battle"), owned = [...battle.querySelectorAll(":scope > header"), battle.querySelector(".battle-panel")];
    battle.classList.toggle("result-open", open);
    owned.forEach(node => {
      if (!node) return;
      node.inert = open;
      if (open) node.setAttribute("aria-hidden", "true");
      else node.removeAttribute("aria-hidden");
    });
    (__wpNotifyMeasurement(), result.hidden = !open);
    if (open) {
      resultActionClaimed = false;
      battle.scrollTop = 0;
      result.scrollTop = 0;
    }
    if (syncFrame) sharedFrame?.activate("battle", {covered: open || leaveOpen});

    if (open) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; if (__wpMeasurement.screen === "battle") __wpMeasurement.screen = null; __wpNotifyMeasurement(); }
}
  function setLeaveOpen(open, restoreFocus = true, syncFrame = true) {
    if (!$("result").hidden && open) return;
    const battle = $("battle"), dialog = $("leaveDialog");
    const owned = [...battle.querySelectorAll(":scope > header"), battle.querySelector(".battle-panel")];
    (__wpNotifyMeasurement(), leaveOpen = open);
    battle.classList.toggle("leave-open", open);
    owned.forEach(node => {
      if (!node) return;
      node.inert = open;
      if (open) node.setAttribute("aria-hidden", "true");
      else if ($("result").hidden) node.removeAttribute("aria-hidden");
    });
    if (open) {
      (__wpNotifyMeasurement(), dialog.hidden = false);
      $("continueBattle").focus();
    } else {
      if (restoreFocus && !battle.hidden) battleBack()?.focus();
      (__wpNotifyMeasurement(), dialog.hidden = true);
      if (run?.completed && $("result").hidden) scheduleCompletionReveal($("next").disabled ? $("resultStages") : $("next"));
    }
    if (syncFrame) sharedFrame?.activate("battle", {covered: open || !$('result').hidden});
  }
  function updateMainProgress() {
    $("mainProgress").textContent = `${text("waterway", { n: Math.min(save.unlocked, 30) })} / 30`;
  }
  function createFrameBridge() {
    const poster = "/assets/interface7-redrawn/animal-bamboo-pipes.webp";
    const stageConfig = {
      gameId: "animal-bamboo-pipes",
      poster,
      background: "/assets/lobby-block-atmosphere.svg",
      count: LEVELS.length,
      stage(index) {
        const level = LEVELS[index];
        const sluices = level.sluices?.length || 0;
        const beacons = level.beacons?.length || 0;
        const feature = sluices && beacons ? text("featureMixed")
          : sluices ? text("featureSluice")
            : beacons ? text("featureBloom", {n: beacons})
              : text("summary");
        const locked = index >= save.unlocked;
        const cleared = Boolean(save.done[index]);
        return {
          id: index + 1,
          kicker: text("chapter", {n: Math.floor(index / 5) + 1}),
          title: text("waterway", {n: index + 1}),
          subtitle: feature,
          status: locked ? text("locked") : cleared ? text("restored") : "",
          summary: text("summary"),
          details: [text("summary"), feature],
          locked,
          cleared,
          poster,
          posterPosition: "center",
        };
      },
    };
    return {
      stageConfig,
      getSelectedStage: () => selected,
      setSelectedStage(index) {
        selected = Math.max(0, Math.min(LEVELS.length - 1, Number(index) || 0));
        sharedFrame?.syncStageInfo();
      },
      getStageInfo() {
        return {
          label: text("choose"),
          progress: `${text("waterway", {n: selected + 1})} / ${LEVELS.length}`,
        };
      },
      startStage(index) {
        selected = Math.max(0, Math.min(LEVELS.length - 1, Number(index) || 0));
        startStage("stage");
      },
    };
  }
  function applyLocale() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.title = `${text("title")} | WeightPlay`;
    document.querySelectorAll("[data-bamboo-t]").forEach(node => { node.textContent = text(node.dataset.bambooT); });
    // The FAQ is game-owned. Apply it after the generic data-bamboo pass so a
    // stale route shell or later shared-localizer transaction cannot leave raw
    // faqTitle/faqQuestion/faqAnswer keys visible.
    window.BAMBOO_GUIDE?.apply?.(locale);
    document.querySelector(".locale").firstChild.textContent = `${text("language")} `;
    const mainReturn = screens.main.querySelector('[data-wp-return="main"]');
    if (mainReturn) {
      mainReturn.setAttribute("aria-label", text("returnLobby"));
      mainReturn.href = `/${LOCALE_ROUTES[locale] || "en"}/`;
    }
    document.querySelectorAll("[data-back]").forEach(node => node.setAttribute("aria-label", text("back")));
    $("rail").setAttribute("aria-label", text("stageSelector"));
    $("stage").querySelector("[data-wp-frame-nav]")?.setAttribute("aria-label", text("stageSelector"));
    $("board").setAttribute("aria-label", text("boardLabel"));
    screens.main.querySelector('[data-wp-frame-poster],.hero img')?.setAttribute("alt", text("coverAlt"));
    $("publicGuide")?.setAttribute("aria-label", text("guideTitle"));
    updateMainProgress();
    if (run) {
      $("chapter").textContent = text("chapter", { n: Math.floor(selected / 5) + 1 });
      $("stageName").textContent = text("waterway", { n: selected + 1 });
      $("resultText").textContent = text("resultText", { moves: run.moves, n: selected + 1 });
      $("resultMastery").textContent = run.completed ? masteryText() : "";
      $("resultPreview").textContent = run?.completed && selected < LEVELS.length - 1
        ? text("nextPreview", { n: selected + 2, chapter: text("chapter", { n: Math.floor((selected + 1) / 5) + 1 }) })
        : "";
      if (!screens.battle.hidden && $("result").hidden && !leaveOpen) renderBoard();
    }
    renderStages();
  }
  CODES.forEach(code => { const option = document.createElement("option"); option.value = code; option.textContent = window.BAMBOO_LOCALES[code].label; $("locale").append(option); });
  $("locale").value = locale;
  function changeLocale(nextLocale) {
    if (!CODES.includes(nextLocale)) return;
    locale = nextLocale;
    try {
      localStorage.setItem("weightPlayLocale", locale);
      localStorage.setItem("wp-locale", locale);
    } catch {}
    window.WonderI18n?.setLocale?.(locale);
    applyLocale();
  }
  $("locale").onchange = event => changeLocale(event.target.value);
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
  $("start").onclick = () => show("stage");
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
    setLeaveOpen(false, false, false);
    show("stage");
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
  $("restart").onclick = () => { if (run && !run.completed) track("restart_used", { turns_before: run.moves }); __wpReplayStart(() => startStage("restart")); };
  $("hint").onclick = () => {
    if (run?.completed) return;
    hintedPipeIndex = hintTargetIndex(run.tiles);
    if (hintedPipeIndex < 0) return;
    run.hintUsed = true;
    track("hint_used", { pipe: hintedPipeIndex + 1, turns: run.moves });
    boardFocusIndex = hintedPipeIndex;
    renderBoard(hintedPipeIndex);
  };
  $("retry").onclick = () => { if (!claimResultAction()) return; track("result_replay", { from: "result" }); setResultOpen(false); __wpReplayStart(() => startStage("replay")); };
  $("next").onclick = () => { if (selected >= 29 || !claimResultAction()) return; track("next_waterway_clicked", { from_waterway: selected + 1, to_waterway: selected + 2 }); setResultOpen(false); selected += 1; startStage("next"); };
  $("resultStages").onclick = () => { if (!claimResultAction()) return; track("return_to_waterways", { from: "result" }); setResultOpen(false); show("stage"); };
  applyLocale();
  if ($("gameFrame") && window.mountBambooFrame) {
    sharedFrame = window.mountBambooFrame(createFrameBridge());
    stageUI = sharedFrame.stageUI;
    renderStages();
  }
})();
