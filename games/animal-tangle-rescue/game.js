(function () {
  "use strict";

  const localeMap = window.TANGLE_RESCUE_LOCALES || {};
  const localeList = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const animals = ["animalFox", "animalBadger", "animalOtter", "animalHare"];
  const animalColors = ["#5c9ccc", "#ca7b62", "#6ca878", "#a56eae"];
  const boards = [
    { name: "boardOne", hint: "boardHint1", target: ["animalOtter", "animalHare", "animalFox", "animalBadger"], start: ["animalFox", "animalBadger", "animalOtter", "animalHare"] },
    { name: "boardTwo", hint: "boardHint2", target: ["animalBadger", "animalFox", "animalHare", "animalOtter"], start: ["animalHare", "animalOtter", "animalFox", "animalBadger"] },
    { name: "boardThree", hint: "boardHint3", target: ["animalHare", "animalOtter", "animalBadger", "animalFox"], start: ["animalBadger", "animalHare", "animalFox", "animalOtter"] },
  ];
  const state = { locale: "en", screen: "main", board: 0, current: [], selected: -1, swaps: 0, completed: [], sound: true, best: {}, statusKey: "ready", statusVars: {}, statusError: false };
  const $ = (id) => document.getElementById(id);
  const safeGet = (key, fallback) => { try { return localStorage.getItem(key) || fallback; } catch (_error) { return fallback; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_error) {} };
  const normalizeLocale = (value) => localeList.includes(value) && localeMap[value] ? value : "";
  const initialLocale = () => normalizeLocale(window.WonderI18n?.actualLocale?.() || window.WonderI18n?.localeFromPath?.() || document.documentElement.lang || safeGet("weightPlayLocale", safeGet("weightplay-locale", "en"))) || "en";
  const copy = (key, vars = {}) => {
    const dictionary = localeMap[state.locale] || localeMap.en || {};
    let value = dictionary[key] || (localeMap.en && localeMap.en[key]) || key;
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replace(new RegExp("\\{" + name + "\\}", "g"), String(replacement)); });
    return value;
  };
  const bestKey = () => "weightplay-animal-tangle-rescue-best-" + state.board;
  const bestForBoard = () => Number(safeGet(bestKey(), "0")) || 0;
  const titleForAnimal = (animalKey) => copy(animalKey);
  const indexForAnimal = (animalKey) => animals.indexOf(animalKey);
  const analytics = (eventName, details = {}) => {
    try { window.gtag?.("event", eventName, { game_id: "animal-tangle-rescue", game_version: "v2", ...details }); } catch (_error) {}
    window.__tangleRescueEvents = window.__tangleRescueEvents || [];
    window.__tangleRescueEvents.push({ eventName, ...details });
  };
  const playTone = (frequency = 440) => {
    if (!state.sound) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.035, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(); oscillator.stop(context.currentTime + 0.12);
      oscillator.addEventListener("ended", () => context.close().catch(() => {}), { once: true });
    } catch (_error) {}
  };
  const showToast = (message) => { $("toast").textContent = message; $("toast").classList.add("visible"); window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => $("toast").classList.remove("visible"), 1800); };
  const setScreen = (screen) => {
    state.screen = screen;
    document.body.dataset.screen = screen;
    ["main", "stage", "battle", "result"].forEach((name) => {
      const element = $(name + "Screen");
      if (!element) return;
      element.hidden = name !== screen;
      element.classList.toggle("active", name === screen);
    });
    $("guideScreen").hidden = screen !== "main";
    if (screen === "main") applyText();
    if (screen === "stage") renderStages();
    if (screen === "battle") renderBattle();
    window.scrollTo(0, 0);
  };
  const routeColor = (animalKey) => animalColors[indexForAnimal(animalKey)] || animalColors[0];
  const routePath = (fromRow, toRow, width, height) => {
    const left = 112;
    const right = width - 112;
    const startY = ((fromRow + 0.5) / boards[state.board].target.length) * height;
    const endY = ((toRow + 0.5) / boards[state.board].target.length) * height;
    const bend = Math.max(36, (right - left) * 0.28);
    return `M ${left} ${startY} C ${left + bend} ${startY}, ${right - bend} ${endY}, ${right} ${endY}`;
  };
  const renderBoard = () => {
    const board = boards[state.board];
    const diagram = $("boardDiagram");
    const height = 292;
    const width = Math.max(diagram.clientWidth || 640, 320);
    const paths = state.current.map((animalKey, row) => {
      const targetRow = board.target.indexOf(animalKey);
      return `<path d="${routePath(row, targetRow, width, height)}" stroke="${routeColor(animalKey)}"></path>`;
    }).join("");
    const rows = state.current.map((animalKey, row) => {
      const animalIndex = indexForAnimal(animalKey);
      const selected = state.selected === row;
      const targetKey = board.target[row];
      return `<div class="board-row"><button class="endpoint-card${selected ? " selected" : ""}" type="button" data-endpoint="${row}" aria-pressed="${selected}" aria-label="${copy("swapName", { number: row + 1 })}: ${titleForAnimal(animalKey)}${selected ? " — " + copy("selected") : ""}"><span class="paw-chip paw-${animalIndex}">●</span><span><strong>${titleForAnimal(animalKey)}</strong><small>${copy("current")}</small></span></button><span class="board-dot" aria-hidden="true"></span><div class="shelter-card"><span><strong>${titleForAnimal(targetKey)}</strong><small>${copy("shelter", { number: row + 1 })}</small></span><span class="shelter-icon" aria-hidden="true">⌂</span></div></div>`;
    }).join("");
    diagram.innerHTML = `<svg class="route-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true">${paths}</svg>${rows}`;
    diagram.querySelectorAll("[data-endpoint]").forEach((button) => button.addEventListener("click", () => selectEndpoint(Number(button.dataset.endpoint))));
  };
  const renderStages = () => {
    $("stageList").innerHTML = boards.map((board, index) => {
      const done = state.completed.includes(index);
      const unlocked = index === 0 || state.completed.includes(index - 1);
      return `<button class="stage-card${done ? " complete" : ""}" type="button" data-stage="${index}"${unlocked ? "" : " disabled"}><span class="stage-number">${copy("round", { number: index + 1, total: boards.length })}</span><span><strong>${copy(board.name)}</strong><small>${copy(board.hint)}</small></span><b>${done ? copy("completed") : unlocked ? copy("readyStage") : "—"}</b></button>`;
    }).join("");
    $("stageList").querySelectorAll("[data-stage]").forEach((button) => button.addEventListener("click", () => startBoard(Number(button.dataset.stage))));
  };
  const renderBattle = () => {
    const board = boards[state.board];
    $("battleHeading").textContent = copy("round", { number: state.board + 1, total: boards.length });
    $("roundHint").textContent = `${copy(board.name)} · ${copy(board.hint)}`;
    $("progressBadge").textContent = copy("progressBadge", { count: state.completed.length });
    $("battleStatus").textContent = copy(state.statusKey, state.statusVars);
    $("battleStatus").classList.toggle("error", state.statusError);
    renderBoard();
  };
  const renderResult = (moves) => {
    const final = state.completed.length === boards.length;
    const oldBest = bestForBoard();
    const best = !oldBest || moves < oldBest ? moves : oldBest;
    if (!oldBest || moves < oldBest) safeSet(bestKey(), String(moves));
    $("resultHeading").textContent = copy(final ? "finalTitle" : "resultTitle");
    $("resultText").textContent = copy(final ? "finalText" : "resultText");
    $("resultStats").textContent = copy("stats", { moves: copy("placements", { count: moves }), best: copy("placements", { count: best }) });
    $("resultPrimaryBtn").textContent = copy(final ? "replay" : "next");
    $("resultPrimaryBtn").onclick = () => final ? startBoard(0) : startBoard(state.board + 1);
    setScreen("result");
  };
  const selectEndpoint = (row) => {
    if (state.selected < 0) {
      state.selected = row;
      state.statusKey = "selectSecond";
      state.statusVars = {};
      state.statusError = false;
      analytics("tangle_endpoint_selected", { row });
      renderBattle();
      return;
    }
    if (state.selected === row) {
      state.selected = -1;
      state.statusKey = "ready";
      state.statusVars = {};
      state.statusError = false;
      renderBattle();
      return;
    }
    const first = state.selected;
    const firstName = titleForAnimal(state.current[first]);
    const secondName = titleForAnimal(state.current[row]);
    [state.current[first], state.current[row]] = [state.current[row], state.current[first]];
    state.selected = -1;
    state.swaps += 1;
    state.statusKey = "swapped";
    state.statusVars = { first: firstName, second: secondName };
    state.statusError = false;
    analytics("tangle_endpoint_swapped", { first, second: row, swaps: state.swaps });
    playTone(520);
    $("battleStatus").textContent = copy(state.statusKey, state.statusVars);
    renderBoard();
    $("battleStatus").classList.remove("error");
  };
  const checkBoard = () => {
    const board = boards[state.board];
    if (state.current.every((value, index) => value === board.target[index])) {
      if (!state.completed.includes(state.board)) state.completed.push(state.board);
      safeSet("weightplay-animal-tangle-rescue-completed", JSON.stringify(state.completed));
      analytics("tangle_board_completed", { board: state.board, swaps: state.swaps });
      playTone(760);
      renderResult(state.swaps);
      return;
    }
    analytics("tangle_board_checked", { board: state.board, correct: false, swaps: state.swaps });
    state.statusKey = "incorrect";
    state.statusVars = {};
    state.statusError = true;
    $("battleStatus").textContent = copy(state.statusKey);
    $("battleStatus").classList.add("error");
    showToast(copy("incorrect"));
  };
  const resetBoard = () => { state.current = boards[state.board].start.slice(); state.selected = -1; state.swaps = 0; state.statusKey = "ready"; state.statusVars = {}; state.statusError = false; analytics("tangle_board_reset", { board: state.board }); renderBattle(); };
  const startBoard = (index) => { state.board = Math.max(0, Math.min(boards.length - 1, index)); state.current = boards[state.board].start.slice(); state.selected = -1; state.swaps = 0; state.statusKey = "ready"; state.statusVars = {}; state.statusError = false; analytics("tangle_board_started", { board: state.board }); setScreen("battle"); };
  const applyText = () => {
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = copy(node.dataset.copy); });
    document.querySelectorAll("[data-copy-aria-label]").forEach((node) => node.setAttribute("aria-label", copy(node.dataset.copyAriaLabel)));
    $("soundBtn").textContent = state.sound ? copy("soundOn") : copy("soundOff");
    $("soundBtn").setAttribute("aria-pressed", String(state.sound));
    $("battleSoundBtn").setAttribute("aria-label", copy("soundOn"));
    $("battleSoundBtn").setAttribute("aria-pressed", String(state.sound));
    $("mainProgress").textContent = copy("progress", { count: state.completed.length });
    if (state.screen === "stage") renderStages();
    if (state.screen === "battle") renderBattle();
  };
  const applyLocale = (locale) => { state.locale = normalizeLocale(locale) || "en"; safeSet("weightplay-locale", state.locale); safeSet("weightPlayLocale", state.locale); document.documentElement.lang = state.locale; document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr"; $("languageSelect").value = state.locale; applyText(); };
  const openLeaveDialog = () => { $("leaveDialog").hidden = false; $("cancelLeaveBtn").focus(); };
  const closeLeaveDialog = () => { $("leaveDialog").hidden = true; $("leaveBtn").focus(); };
  const bind = () => {
    $("startBtn").addEventListener("click", () => setScreen("stage"));
    $("guideStartBtn").addEventListener("click", () => setScreen("stage"));
    $("mapBtn").addEventListener("click", () => setScreen("stage"));
    $("mainSettingsBtn").addEventListener("click", () => { const open = $("settingsPanel").hidden; $("settingsPanel").hidden = !open; $("mainSettingsBtn").setAttribute("aria-expanded", String(open)); });
    $("closeSettingsBtn").addEventListener("click", () => { $("settingsPanel").hidden = true; $("mainSettingsBtn").setAttribute("aria-expanded", "false"); });
    $("stageBackBtn").addEventListener("click", () => setScreen("main"));
    $("stageInfoBtn").addEventListener("click", () => { setScreen("main"); $("guideScreen").open = true; $("guideScreen").scrollIntoView({ block: "start" }); });
    $("battleBackBtn").addEventListener("click", () => setScreen("stage"));
    $("checkBtn").addEventListener("click", checkBoard);
    $("resetBtn").addEventListener("click", resetBoard);
    $("leaveBtn").addEventListener("click", openLeaveDialog);
    $("cancelLeaveBtn").addEventListener("click", closeLeaveDialog);
    $("confirmLeaveBtn").addEventListener("click", () => { closeLeaveDialog(); setScreen("stage"); });
    $("resultMapBtn").addEventListener("click", () => setScreen("stage"));
    $("resultHomeBtn").addEventListener("click", () => setScreen("main"));
    [$('soundBtn'), $('battleSoundBtn')].forEach((button) => button.addEventListener("click", () => { state.sound = !state.sound; safeSet("weightplay-animal-tangle-rescue-sound", state.sound ? "on" : "off"); applyText(); }));
    $("languageSelect").addEventListener("change", (event) => { const requested = normalizeLocale(event.target.value) || "en"; try { window.WonderI18n?.setLocale?.(requested); } catch (_error) {} applyLocale(requested); });
  };
  const init = () => {
    try { const saved = JSON.parse(safeGet("weightplay-animal-tangle-rescue-completed", "[]")); state.completed = Array.isArray(saved) ? saved.filter((index) => Number.isInteger(index) && index >= 0 && index < boards.length) : []; } catch (_error) { state.completed = []; }
    state.sound = safeGet("weightplay-animal-tangle-rescue-sound", "on") !== "off";
    bind();
    window.addEventListener("wonder:locale-change", (event) => applyLocale(event.detail?.locale || window.WonderI18n?.actualLocale?.() || document.documentElement.lang));
    applyLocale(initialLocale());
    window.setTimeout(() => { $("loadingScreen").hidden = true; $("app").hidden = false; setScreen("main"); }, 90);
  };
  init();
}());
