import {
  LEVELS,
  activatePower,
  canSwap,
  cloneBoard,
  createState,
  objectiveCounts,
  playSwap,
} from "./cascade-core.js?v=20260929-castle-cascade-v7-i8";
import { CastleCascade2D } from "./castle-cascade-2d.js?v=20260929-castle-cascade-v7-i8";

const GAME_ID = "castle-cascade";
const SAVE_KEY = "wp-castle-cascade";
const LION_POSTER_URL = new URL("../../assets/weightplay-character-boom-mane-lion-block-v1.webp", import.meta.url).href;
const LOCALES = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
const SEGMENT_LOCALES = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
const ARC_START = [0, 5, 10, 15, 20, 25];
const OBJECTIVE_ORDER = ["crate", "chain", "key", "gate", "stone", "seal"];
const SELECTORS = ["#main", "#stage", "#battle"];
const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));
const number = (value) => Number(value).toLocaleString(locale);

let locale = readLocale();
let copy = window.CC_I18N?.[locale] || window.CC_I18N?.en;
let unlocked = readUnlocked();
let selectedStage = 0;
let gameState = null;
let selectedCell = -1;
let focusCell = 40;
let busy = false;
let screenEpoch = 0;
let renderer = null;
let canvas = document.querySelector("#sceneCanvas");
let lastRendererStats = null;
let boardAvailable = false;
let pendingResultStatus = null;
let leaveReturnFocus = null;

function readStorage(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function writeStorage(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Storage is optional. */ }
}

function readUnlocked() {
  const stored = Number.parseInt(readStorage(SAVE_KEY) || "1", 10);
  return Number.isFinite(stored) ? Math.max(1, Math.min(LEVELS.length, stored)) : 1;
}

function readLocale() {
  const routeSegment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  if (SEGMENT_LOCALES[routeSegment]) return SEGMENT_LOCALES[routeSegment];
  const saved = readStorage("wp-locale") || readStorage("weightPlayLocale");
  if (LOCALES.includes(saved)) return saved;
  const documentLocale = document.documentElement.lang;
  return LOCALES.includes(documentLocale) ? documentLocale : "en";
}

function text(key, values = {}) {
  let result = copy?.[key] ?? window.CC_I18N?.en?.[key] ?? key;
  if (typeof result !== "string") return result;
  for (const [name, value] of Object.entries(values)) result = result.replaceAll(`{${name}}`, String(value));
  return result;
}

function translatePage() {
  copy = window.CC_I18N?.[locale] || window.CC_I18N?.en;
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  document.title = `${text("title")} | WeightPlay`;
  document.querySelectorAll("[data-t]").forEach((node) => {
    const value = copy?.[node.dataset.t] ?? window.CC_I18N?.en?.[node.dataset.t];
    if (typeof value === "string") node.textContent = value;
  });
  document.querySelectorAll("[data-t-aria]").forEach((node) => node.setAttribute("aria-label", text(node.dataset.tAria)));
  document.querySelectorAll("[data-t-alt]").forEach((node) => node.setAttribute("alt", text(node.dataset.tAlt)));
  const description = `${text("title")}. ${text("summary")}`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", document.title);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", description);
  const schema = document.querySelector('script[type="application/ld+json"]');
  if (schema) {
    try {
      const data = JSON.parse(schema.textContent);
      data.name = text("title");
      data.description = description;
      data.inLanguage = locale;
      schema.textContent = JSON.stringify(data);
    } catch { /* Invalid optional metadata must not stop play. */ }
  }
  const select = document.querySelector("#locale");
  if (select) select.value = locale;
  renderStageList();
  if (gameState) renderBattleHud();
  window.dispatchEvent(new CustomEvent("wonder:locale-change", { detail: { locale } }));
}

function installLocaleSelect() {
  const select = document.querySelector("#locale");
  for (const supported of LOCALES) {
    const option = document.createElement("option");
    option.value = supported;
    option.textContent = window.CC_I18N?.[supported]?.localeName || supported;
    select.append(option);
  }
  select.addEventListener("change", () => {
    locale = select.value;
    writeStorage("wp-locale", locale);
    writeStorage("weightPlayLocale", locale);
    window.WonderI18n?.setLocale?.(locale, { navigate: false, dispatch: false });
    translatePage();
  });
}

function playSound(id) {
  window.WeightPlayAudio?.play?.(id);
}

function screen(id) {
  screenEpoch += 1;
  busy = false;
  for (const selector of SELECTORS) {
    const node = document.querySelector(selector);
    node.hidden = node.id !== id;
  }
  document.body.dataset.screen = id;
  document.querySelector("#result").hidden = true;
  document.querySelector("#leaveConfirm").hidden = true;
  pendingResultStatus = null;
  leaveReturnFocus = null;
  document.dispatchEvent(new Event("weightplay:shell-sync"));
  document.dispatchEvent(new Event("weightplay:stage-sync"));
  document.dispatchEvent(new Event("weightplay:battle-sync"));

  if (id !== "battle") {
    disposeRenderer();
    gameState = null;
    selectedCell = -1;
  } else if (gameState) {
    mountRenderer();
    renderAccessibleBoard();
    renderBattleHud();
  }
  requestAnimationFrame(() => {
    window.WeightPlayBattleCanvas?.sync?.();
    window.WeightPlayScreenFrame?.sync?.();
  });
  if (id === "battle") {
    window.dispatchEvent(new CustomEvent("weightplay:battle-open", { detail: { screen: id, gameId: GAME_ID } }));
  }
}

function disposeRenderer() {
  if (!renderer) return;
  lastRendererStats = renderer.stats?.() || null;
  const oldCanvas = canvas;
  renderer.dispose();
  renderer = null;
  oldCanvas?.replaceWith(oldCanvas.cloneNode(false));
  canvas = document.querySelector("#sceneCanvas");
}

function mountRenderer() {
  if (renderer || !gameState) return boardAvailable;
  canvas = document.querySelector("#sceneCanvas");
  try {
    renderer = new CastleCascade2D(canvas, handleCell, handleRendererFailure);
    renderer.setBoard(gameState.board, selectedCell, focusCell);
    boardAvailable = true;
    document.querySelector("#result").hidden = true;
    return true;
  } catch (error) {
    boardAvailable = false;
    lastRendererStats = { renderer: "unavailable", error: String(error?.message || error) };
    canvas?.replaceWith(canvas.cloneNode(false));
    canvas = document.querySelector("#sceneCanvas");
    showResult("renderer-error");
    return false;
  }
}

function handleRendererFailure(reason) {
  if (!gameState) return;
  boardAvailable = false;
  showResult(reason === "context-lost" ? "context-lost" : "renderer-error");
}

function objectiveSummary(level) {
  const obstacles = level.obstacles || {};
  const parts = [];
  for (const key of OBJECTIVE_ORDER) {
    const count = obstacles[key]?.length || 0;
    if (count) parts.push(`${number(count)} ${objectiveName(key, count)}`);
  }
  return parts.join(copy?.objectiveJoin || " · ") || text("objectiveEmpty");
}

function objectiveName(key, count) {
  if (count === 1) return copy?.objectiveSingularNames?.[key] || copy?.objectiveNames?.[key] || key;
  return copy?.objectiveNames?.[key] || key;
}

const OBJECTIVE_SPRITES = { crate: 5, chain: 6, key: 7, gate: 9, stone: 10, seal: 11 };

function makeObjectiveIndicators(counts, className = "objective-icons") {
  const strip = document.createElement("span");
  strip.className = className;
  strip.setAttribute("aria-hidden", "true");
  for (const key of OBJECTIVE_ORDER) {
    const count = counts[key] || 0;
    if (!count) continue;
    const sprite = OBJECTIVE_SPRITES[key];
    const chip = document.createElement("span");
    chip.className = "objective-chip";
    const icon = document.createElement("span");
    icon.className = "objective-icon";
    icon.style.setProperty("--sprite-x", `${(sprite % 5) * 25}%`);
    icon.style.setProperty("--sprite-y", `${Math.floor(sprite / 5) * (100 / 3)}%`);
    const amount = document.createElement("span");
    amount.className = "objective-count";
    amount.textContent = number(count);
    chip.append(icon, amount);
    strip.append(chip);
  }
  return strip;
}

function renderStageList() {
  const rail = document.querySelector("#stageRail");
  if (!rail) return;
  const activeCardHadFocus = rail.contains(document.activeElement);
  rail.replaceChildren();
  document.querySelector("#progress").textContent = text("progress", { count: number(unlocked) });
  for (let index = 0; index < LEVELS.length; index += 1) {
    const level = LEVELS[index];
    const arcIndex = Math.floor(index / 5);
    const objective = objectiveSummary(level);
    const stageText = `${text("stage")} ${number(index + 1)}`;
    const moveText = text("movesLeft", { count: number(level.moves) });
    const card = document.createElement("button");
    card.type = "button";
    card.className = `stage-card${index === selectedStage ? " selected" : ""}`;
    card.dataset.stageIndex = String(index);
    card.disabled = index >= unlocked;
    card.setAttribute("aria-label", text("stageAria", { stage: stageText, objective, moves: moveText }));
    card.setAttribute("aria-current", index === selectedStage ? "step" : "false");

    const title = document.createElement("strong");
    title.textContent = stageText;
    const art = document.createElement("img");
    art.src = LION_POSTER_URL;
    art.alt = "";
    art.setAttribute("aria-hidden", "true");
    const chapter = document.createElement("span");
    chapter.className = "stage-arc";
    chapter.textContent = `${text("arc")} ${number(arcIndex + 1)} · ${copy?.arcNames?.[arcIndex] || ""}`;
    const goal = document.createElement("span");
    goal.className = "stage-objective";
    const stageCounts = Object.fromEntries(OBJECTIVE_ORDER.map((key) => [key, level.obstacles?.[key]?.length || 0]));
    goal.append(makeObjectiveIndicators(stageCounts, "objective-icons stage-objective-icons"));
    const moves = document.createElement("span");
    moves.className = "stage-moves";
    moves.textContent = moveText;
    goal.append(moves);
    card.append(title, art, chapter, goal);
    card.addEventListener("click", () => startStage(index));
    rail.append(card);
  }
  if (activeCardHadFocus) rail.querySelector(`[data-stage-index="${selectedStage}"]`)?.focus({ preventScroll: true });
}

function renderBattleHud(board = gameState?.board) {
  if (!gameState) return;
  const stageText = `${text("stage")} ${number(gameState.stage + 1)}`;
  const counts = objectiveCounts(board || gameState.board);
  const goals = OBJECTIVE_ORDER.filter((key) => counts[key] > 0)
    .map((key) => `${number(counts[key])} ${objectiveName(key, counts[key])}`);
  document.querySelector("#stageLabel").textContent = stageText;
  document.querySelector("#goalIndicators").replaceChildren(makeObjectiveIndicators(counts));
  document.querySelector("#goalLabel").textContent = `${text("goal")}: ${goals.length ? goals.join(copy?.objectiveJoin || " · ") : text("objectiveEmpty")}`;
  document.querySelector("#movesLabel").textContent = text("movesLeft", { count: number(gameState.moves) });
}

function swappedBoard(board, a, b) {
  const result = cloneBoard(board);
  for (const field of ["c", "p", "key"]) [result[a][field], result[b][field]] = [result[b][field], result[a][field]];
  return result;
}

function tileDescription(tile, index) {
  const content = [];
  if (tile.c !== null && tile.c >= 0 && copy?.gemNames?.[tile.c]) content.push(copy.gemNames[tile.c]);
  if (tile.p) content.push(copy?.powerNames?.[tile.p] || tile.p);
  for (const [key, present] of [["crate", tile.box], ["chain", tile.chain], ["key", tile.key], ["gate", tile.gate], ["stone", tile.stone], ["seal", tile.seal], ["exit", tile.exit]]) {
    if (!present) continue;
    const name = copy?.obstacleNames?.[key] || key;
    if (key === "stone" && tile.stone === 1) content.push(`${name} 1`);
    else if (key === "stone" && tile.stone > 1) content.push(`${name} ${tile.stone}`);
    else content.push(name);
  }
  if (selectedCell === index) content.push(text("selectedCell"));
  return content.join(copy?.objectiveJoin || " · ") || text("cellEmpty");
}

function renderAccessibleBoard() {
  const board = document.querySelector("#board");
  if (!gameState || !board) return;
  const hadFocus = board.contains(document.activeElement);
  board.setAttribute("aria-busy", String(busy));
  board.setAttribute("aria-label", text("boardLabel"));
  const fragment = document.createDocumentFragment();
  gameState.board.forEach((tile, index) => {
    const row = Math.floor(index / 9) + 1;
    const col = (index % 9) + 1;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "grid-cell";
    button.dataset.index = String(index);
    button.tabIndex = index === focusCell ? 0 : -1;
    button.setAttribute("role", "gridcell");
    button.setAttribute("aria-label", text("cellLabel", { row: number(row), col: number(col), content: tileDescription(tile, index) }));
    button.setAttribute("aria-selected", String(index === selectedCell));
    button.setAttribute("aria-disabled", String(!canSwap(gameState.board, index)));
    button.addEventListener("click", () => handleCell(index));
    fragment.append(button);
  });
  board.replaceChildren(fragment);
  if (hadFocus) board.querySelector(`[data-index="${focusCell}"]`)?.focus({ preventScroll: true });
}

function focusBoardCell(index) {
  focusCell = Math.max(0, Math.min(80, index));
  renderer?.setBoard(gameState?.board || [], selectedCell, focusCell);
  renderAccessibleBoard();
}

function showResult(status) {
  if (!document.querySelector("#leaveConfirm").hidden) {
    pendingResultStatus = status;
    return;
  }
  pendingResultStatus = null;
  const layer = document.querySelector("#result");
  const title = document.querySelector("#resultTitle");
  const body = document.querySelector("#resultBody");
  const next = document.querySelector("#next");
  layer.hidden = false;
  if (status === "won") {
    title.textContent = text("win");
    body.textContent = text("resultWinBody", { moves: number(gameState?.moves || 0) });
    next.disabled = gameState?.stage >= LEVELS.length - 1;
    playSound("result.win");
  } else if (status === "lost") {
    title.textContent = text("lose");
    body.textContent = text("resultLoseBody");
    next.disabled = true;
    playSound("result.lose");
  } else if (status === "context-lost") {
    title.textContent = text("contextTitle");
    body.textContent = text("contextLost");
    next.disabled = true;
  } else if (status === "renderer-error") {
    title.textContent = text("rendererTitle");
    body.textContent = text("rendererError");
    next.disabled = true;
  } else {
    title.textContent = text("stuckTitle");
    body.textContent = text("stuck");
    next.disabled = true;
  }
  title.focus({ preventScroll: true });
}

function startStage(index) {
  if (!Number.isInteger(index) || index < 0 || index >= unlocked || index >= LEVELS.length) return;
  selectedStage = index;
  if (renderer) disposeRenderer();
  gameState = createState(index, unlocked);
  selectedCell = -1;
  focusCell = 40;
  busy = false;
  boardAvailable = false;
  document.querySelector("#result").hidden = true;
  document.querySelector("#leaveConfirm").hidden = true;
  pendingResultStatus = null;
  leaveReturnFocus = null;
  document.querySelector("#status").textContent = "";
  if (document.querySelector("#battle").hidden) {
    screen("battle");
  } else {
    screenEpoch += 1;
    mountRenderer();
    renderAccessibleBoard();
    renderBattleHud();
  }
  if (!boardAvailable) return;
  playSound("game.start");
  renderBattleHud();
  renderAccessibleBoard();
  renderer?.setBoard(gameState.board, selectedCell, focusCell);
  requestAnimationFrame(() => window.WeightPlayBattleCanvas?.sync?.());
}

function objectivesCue(batches) {
  const totals = { crate: 0, chain: 0, key: 0, gate: 0, stone: 0, seal: 0 };
  for (const batch of batches) for (const key of Object.keys(totals)) totals[key] += batch.stats?.[key] || 0;
  if (totals.crate) playSound("impact.wood");
  if (totals.stone) playSound("impact.stone");
  if (totals.gate) playSound("mechanism.unlock");
  if (Object.values(totals).some(Boolean)) playSound("puzzle.clear");
}

async function animateTurn(result, turnToken, visual = null) {
  const motionReduced = renderer?.reducedMotion;
  if (visual?.swap && renderer) {
    await renderer.animateSwap(visual.before, visual.after, visual.swap.a, visual.swap.b, true);
    if (turnToken !== screenEpoch || !renderer || !boardAvailable) return;
  }
  for (const batch of result.batches || []) {
    if (turnToken !== screenEpoch || !renderer || !boardAvailable) return;
    renderer.setBoard(batch.before, -1, focusCell);
    renderBattleHud(batch.before);
    if (!motionReduced) await renderer.animateClear(batch);
    if (turnToken !== screenEpoch || !renderer || !boardAvailable) return;
    renderBattleHud(batch.cleared);
    if (!motionReduced) await renderer.animateGravity(batch.cleared, batch.after, batch.movements, batch.deliveredKeys);
    else renderer.setBoard(batch.after, -1, focusCell);
    renderBattleHud(batch.after);
  }
  if (turnToken !== screenEpoch || !gameState) return;
  renderer?.setBoard(gameState.board, -1, focusCell);
  busy = false;
  renderBattleHud();
  renderAccessibleBoard();
  if (gameState.unlocked > unlocked) {
    unlocked = gameState.unlocked;
    writeStorage(SAVE_KEY, String(unlocked));
    renderStageList();
  }
  if (gameState.status === "won") document.querySelector("#status").textContent = text("win");
  else if (gameState.status === "lost") document.querySelector("#status").textContent = text("lose");
  else if (gameState.status === "stuck") document.querySelector("#status").textContent = text("stuck");
  if (["won", "lost", "stuck"].includes(gameState.status)) showResult(gameState.status);
}

function act(result, cue, visual = null) {
  if (!result.accepted) {
    playSound("feedback.error");
    document.querySelector("#status").textContent = result.reason === "no-match" ? text("invalid") : text("blocked");
    selectedCell = -1;
    renderer?.setBoard(gameState.board, selectedCell, focusCell);
    renderBattleHud();
    renderAccessibleBoard();
    if (result.reason === "no-match" && visual?.swap && renderer) {
      busy = true;
      const turnToken = screenEpoch;
      renderAccessibleBoard();
      void renderer.animateSwap(visual.before, visual.after, visual.swap.a, visual.swap.b, false).then(() => {
        if (turnToken !== screenEpoch || !gameState) return;
        renderer?.setBoard(gameState.board, selectedCell, focusCell);
        busy = false;
        renderAccessibleBoard();
      });
    }
    return;
  }
  busy = true;
  const announcements = [cue === "match" ? text("matchAccepted") : text("powerAccepted")];
  if (result.reshuffled) announcements.push(text("reshuffling"));
  document.querySelector("#status").textContent = announcements.join(" ");
  renderBattleHud(visual?.before || result.batches?.[0]?.before || gameState.board);
  renderAccessibleBoard();
  if (cue === "match") {
    playSound("board.move");
    playSound("puzzle.match");
  } else {
    playSound("puzzle.clear");
  }
  objectivesCue(result.batches || []);
  const turnToken = screenEpoch;
  void animateTurn(result, turnToken, visual);
}

function handleCell(index) {
  if (!gameState || busy || !boardAvailable || gameState.status !== "playing") return;
  focusCell = index;
  const tile = gameState.board[index];
  if (selectedCell < 0) {
    if (!canSwap(gameState.board, index)) {
      playSound("feedback.error");
      document.querySelector("#status").textContent = text("blocked");
      renderer?.setBoard(gameState.board, -1, focusCell);
      renderAccessibleBoard();
      return;
    }
    selectedCell = index;
    document.querySelector("#status").textContent = tile.p ? text("chooseSecond") : text("selected");
    renderer?.setBoard(gameState.board, selectedCell, focusCell);
    renderAccessibleBoard();
    return;
  }
  if (selectedCell === index) {
    selectedCell = -1;
    if (tile.p) {
      const result = activatePower(gameState, index);
      act(result, "power");
      return;
    }
    document.querySelector("#status").textContent = "";
    renderer?.setBoard(gameState.board, selectedCell, focusCell);
    renderAccessibleBoard();
    return;
  }
  const prior = selectedCell;
  selectedCell = -1;
  const before = cloneBoard(gameState.board);
  const after = swappedBoard(before, prior, index);
  const result = playSwap(gameState, prior, index);
  if (!result.accepted && result.reason === "invalid" && canSwap(gameState.board, index)) {
    selectedCell = index;
    document.querySelector("#status").textContent = text("chooseSecond");
    renderer?.setBoard(gameState.board, selectedCell, focusCell);
    renderAccessibleBoard();
    return;
  }
  act(result, result.reason === "match" ? "match" : "power", { before, after, swap: { a: prior, b: index } });
}

function handleKeydown(event) {
  const leaveDialog = document.querySelector("#leaveConfirm");
  if (!leaveDialog.hidden) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeLeaveConfirmation();
      return;
    }
    if (event.key === "Tab") {
      const actions = [...leaveDialog.querySelectorAll("button:not([disabled])")];
      const activeIndex = actions.indexOf(document.activeElement);
      if (event.shiftKey && activeIndex <= 0) {
        event.preventDefault();
        actions.at(-1)?.focus({ preventScroll: true });
      } else if (!event.shiftKey && activeIndex === actions.length - 1) {
        event.preventDefault();
        actions[0]?.focus({ preventScroll: true });
      } else if (activeIndex < 0) {
        event.preventDefault();
        actions[0]?.focus({ preventScroll: true });
      }
    }
    return;
  }
  const target = event.target.closest?.(".grid-cell");
  if (!target || !gameState) return;
  let next = focusCell;
  if (event.key === "ArrowLeft") next = focusCell % 9 ? focusCell - 1 : focusCell;
  else if (event.key === "ArrowRight") next = focusCell % 9 < 8 ? focusCell + 1 : focusCell;
  else if (event.key === "ArrowUp") next = focusCell >= 9 ? focusCell - 9 : focusCell;
  else if (event.key === "ArrowDown") next = focusCell < 72 ? focusCell + 9 : focusCell;
  else if (event.key === "Home") next = Math.floor(focusCell / 9) * 9;
  else if (event.key === "End") next = Math.floor(focusCell / 9) * 9 + 8;
  else return;
  event.preventDefault();
  if (next !== focusCell) focusBoardCell(next);
}

function requestLeaveBattle() {
  if (busy) return;
  if (!gameState || gameState.status !== "playing" || !document.querySelector("#result").hidden) {
    screen("stage");
    renderStageList();
    return;
  }
  const dialog = document.querySelector("#leaveConfirm");
  if (!dialog.hidden) return;
  leaveReturnFocus = document.activeElement;
  dialog.hidden = false;
  document.querySelector("#continueBattle").focus({ preventScroll: true });
}

function closeLeaveConfirmation() {
  const dialog = document.querySelector("#leaveConfirm");
  if (dialog.hidden) return;
  dialog.hidden = true;
  const pending = pendingResultStatus;
  pendingResultStatus = null;
  const returnFocus = leaveReturnFocus;
  leaveReturnFocus = null;
  if (pending && gameState) {
    showResult(pending);
    return;
  }
  if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
}

function returnToStageMap() {
  playSound("ui.click");
  pendingResultStatus = null;
  leaveReturnFocus = null;
  screen("stage");
  renderStageList();
}

function scrollChapter(direction) {
  const targetStage = Math.max(0, Math.min(LEVELS.length - 1, selectedStage + direction * 5));
  selectedStage = targetStage;
  renderStageList();
  document.querySelector(`[data-stage-index="${targetStage}"]`)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", inline: "center", block: "nearest" });
}

function bindControls() {
  document.querySelector("#start").addEventListener("click", () => { playSound("ui.click"); screen("stage"); });
  document.querySelector("#stage [data-back]").addEventListener("click", () => { playSound("ui.click"); screen("main"); });
  document.querySelector("#battle [data-back]").addEventListener("click", requestLeaveBattle);
  document.querySelector("#prevGroup").addEventListener("click", () => { playSound("ui.click"); scrollChapter(-1); });
  document.querySelector("#nextGroup").addEventListener("click", () => { playSound("ui.click"); scrollChapter(1); });
  document.querySelector("#toStages").addEventListener("click", () => { playSound("ui.click"); screen("stage"); renderStageList(); });
  document.querySelector("#retry").addEventListener("click", () => { playSound("ui.click"); startStage(selectedStage); });
  document.querySelector("#continueBattle").addEventListener("click", () => { playSound("ui.click"); closeLeaveConfirmation(); });
  document.querySelector("#returnToMap").addEventListener("click", returnToStageMap);
  document.querySelector("#next").addEventListener("click", () => {
    if (selectedStage + 1 < unlocked && selectedStage + 1 < LEVELS.length) startStage(selectedStage + 1);
  });
  document.addEventListener("keydown", handleKeydown);
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
}

window.__CASTLE_CASCADE_DIAGNOSTICS__ = Object.freeze({
  snapshot() {
    return deepFreeze({
      gameId: GAME_ID,
      locale,
      screen: document.body.dataset.screen,
      stage: gameState?.stage ?? null,
      moves: gameState?.moves ?? null,
      status: gameState?.status ?? null,
      unlocked,
      objectives: gameState ? objectiveCounts(gameState.board) : null,
      board: gameState ? gameState.board.map((tile) => ({ ...tile })) : null,
      renderer: renderer?.stats?.() || lastRendererStats || { renderer: "inactive" },
    });
  },
});

installLocaleSelect();
bindControls();
translatePage();
screen("main");
