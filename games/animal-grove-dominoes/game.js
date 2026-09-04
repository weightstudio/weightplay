(function () {
  "use strict";

  const locales = window.GROVE_CHAIN_LOCALES;
  const localeKeys = locales.__localeKeys;
  const GAME_VERSION = "v2";
  const rounds = [
    { start: "den", tiles: [["den", "creek"], ["creek", "moss"], ["moss", "nest"], ["nest", "moon"], ["moon", "den"]] },
    { start: "reef", tiles: [["reef", "tide"], ["tide", "shell"], ["shell", "grove"], ["grove", "den"], ["den", "reef"]] },
    { start: "pine", tiles: [["pine", "snow"], ["snow", "burrow"], ["burrow", "pond"], ["pond", "meadow"], ["meadow", "pine"]] },
  ];
  const state = { locale: "en", sound: true, roundIndex: 0, currentEnd: "", picks: 0, placed: [], rack: [], solved: 0 };
  const $ = (id) => document.getElementById(id);
  const safeStorage = { get(key) { try { return window.localStorage.getItem(key); } catch (_) { return null; } }, set(key, value) { try { window.localStorage.setItem(key, value); } catch (_) {} } };
  const routeLocaleMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const localeStorageKey = "weightplay-grove-chain-locale";

  function queryLocale() {
    const query = new URLSearchParams(window.location.search).get("lang");
    if (query && locales[query]) return query;
    const segment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    return routeLocaleMap[segment] || safeStorage.get(localeStorageKey) || "en";
  }
  function copy() { return locales[state.locale] || locales.en; }
  function t(key, vars = {}) { const value = copy()[key] || locales.en[key] || key; return String(value).replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? "")); }
  function habitat(token) { return copy().tokenNames?.[token] || locales.en.tokenNames[token] || token; }
  function track(name, detail = {}) {
    const event = { name, gameId: "animal-grove-dominoes", version: GAME_VERSION, at: Date.now(), ...detail };
    window.ANIMAL_GROVE_CHAIN_EVENTS = Array.isArray(window.ANIMAL_GROVE_CHAIN_EVENTS) ? window.ANIMAL_GROVE_CHAIN_EVENTS.slice(-39) : [];
    window.ANIMAL_GROVE_CHAIN_EVENTS.push(event);
  }
  function playTone(kind) {
    if (!state.sound || !(window.AudioContext || window.webkitAudioContext)) return;
    try { const AudioCtor = window.AudioContext || window.webkitAudioContext; const audio = new AudioCtor(); const oscillator = audio.createOscillator(); const gain = audio.createGain(); oscillator.frequency.value = kind === "success" ? 620 : 210; gain.gain.setValueAtTime(0.0001, audio.currentTime); gain.gain.exponentialRampToValueAtTime(0.03, audio.currentTime + 0.01); gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.13); oscillator.connect(gain).connect(audio.destination); oscillator.start(); oscillator.stop(audio.currentTime + 0.14); oscillator.addEventListener("ended", () => audio.close(), { once: true }); } catch (_) {}
  }
  function applyLocale() {
    document.documentElement.lang = state.locale === "zh-Hant" ? "zh-TW" : state.locale === "zh-Hans" ? "zh-CN" : state.locale;
    document.documentElement.dir = copy().direction || "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    document.querySelectorAll("[data-copy-aria-label]").forEach((node) => { node.setAttribute("aria-label", t(node.dataset.copyAriaLabel)); });
    $("settingsBtn").setAttribute("aria-label", t("settings"));
    $("settingsPanel").setAttribute("aria-label", t("settings"));
    $("battleSoundBtn").setAttribute("aria-label", state.sound ? t("soundOn") : t("soundOff"));
    $("battleSoundBtn").setAttribute("aria-pressed", String(state.sound));
    $("battleSoundBtn").textContent = state.sound ? "♪" : "×";
    $("soundBtn").textContent = state.sound ? t("soundOn") : t("soundOff");
    $("soundBtn").setAttribute("aria-pressed", String(state.sound));
    if (!$('battleView').hidden) renderRound();
  }
  function populateLocales() {
    const select = $("localeSelect");
    localeKeys.forEach((key) => { const option = document.createElement("option"); option.value = key; option.textContent = locales.en.languageNames[key]; select.append(option); });
    select.value = state.locale;
    select.addEventListener("change", () => { state.locale = select.value; safeStorage.set(localeStorageKey, state.locale); applyLocale(); track("locale_changed", { locale: state.locale }); });
  }
  function showView(id) {
    const main = id === "mainView";
    const result = id === "resultView";
    $("mainView").hidden = !main;
    const guide = document.querySelector(".guide-card, [data-wp-game-guide], .game-page-info-static");
    if (guide) guide.hidden = !main;
    $("battleView").hidden = main || result;
    $("resultView").hidden = !result;
    document.body.dataset.screen = main ? "main" : result ? "result" : "battle";
    $("settingsPanel").hidden = true;
    $("settingsBtn").setAttribute("aria-expanded", "false");
    window.scrollTo(0, 0);
  }
  function shuffle(items) { return [...items].sort((a, b) => (a[0].charCodeAt(0) + a[1].charCodeAt(0)) - (b[0].charCodeAt(0) + b[1].charCodeAt(0))); }
  function tileButton(tile, index) {
    const button = document.createElement("button");
    button.type = "button"; button.className = "habitat-tile"; button.dataset.index = String(index); button.dataset.habitat = tile[0]; button.setAttribute("aria-label", t("chooseTile", { left: habitat(tile[0]), right: habitat(tile[1]) }));
    button.innerHTML = `<span class="tile-art" aria-hidden="true"></span><span class="tile-glyph" aria-hidden="true">${tile[0] === state.currentEnd ? "↗" : "·"}</span><span class="tile-side">${habitat(tile[0])}</span><span class="tile-link" aria-hidden="true">→</span><span class="tile-side">${habitat(tile[1])}</span>`;
    button.addEventListener("click", () => choose(index, button));
    return button;
  }
  function renderChain() {
    const trackNode = $("chainTrack"); trackNode.replaceChildren();
    const nodes = [state.roundIndex === 0 ? rounds[state.roundIndex].start : rounds[state.roundIndex].start, ...state.placed.map((tile) => tile[1])];
    nodes.forEach((token, index) => { const node = document.createElement("span"); node.className = `chain-node${index === nodes.length - 1 ? " current" : ""}`; node.textContent = habitat(token); node.setAttribute("aria-label", habitat(token)); trackNode.append(node); if (index < nodes.length - 1) { const arrow = document.createElement("span"); arrow.className = "chain-arrow"; arrow.textContent = "→"; arrow.setAttribute("aria-hidden", "true"); trackNode.append(arrow); } });
  }
  function renderRound() {
    const round = rounds[state.roundIndex];
    $("roundLabel").textContent = t("round", { current: state.roundIndex + 1, total: rounds.length });
    $("endLabel").textContent = t("end", { habitat: habitat(state.currentEnd) });
    $("placedCount").textContent = String(state.placed.length);
    $("instruction").textContent = t("instruction");
    renderChain();
    const rackNode = $("tileRack"); rackNode.replaceChildren();
    state.rack.forEach((tile, index) => { if (!tile) return; rackNode.append(tileButton(tile, index)); });
  }
  function setFeedbackState(value) {
    [$("feedbackArt"), $("resultFeedbackArt")].forEach((node) => { if (node) node.dataset.feedback = value; });
  }
  function choose(index, button) {
    const tile = state.rack[index]; if (!tile) return;
    state.picks += 1; track("tile_selected", { round: state.roundIndex + 1, left: tile[0], right: tile[1], correct: tile[0] === state.currentEnd });
    if (tile[0] !== state.currentEnd) { button.classList.add("is-wrong"); $("battleStatus").textContent = t("wrong"); $("battleStatus").classList.add("is-wrong"); setFeedbackState("wrong"); playTone("wrong"); window.setTimeout(() => button.classList.remove("is-wrong"), 380); return; }
    button.disabled = true; button.classList.add("is-correct"); state.placed.push(tile); state.rack[index] = null; state.currentEnd = tile[1]; state.solved += 1; $("battleStatus").textContent = t("right"); $("battleStatus").classList.remove("is-wrong"); $("appStatus").textContent = t("right"); playTone("success"); renderRound(); setFeedbackState("matched");
    if (state.placed.length === 5) { window.setTimeout(() => { if (state.roundIndex < rounds.length - 1) { state.roundIndex += 1; startRound(); } else finish(); }, 420); }
  }
  function startRound() { const round = rounds[state.roundIndex]; state.currentEnd = round.start; state.placed = []; state.rack = shuffle(round.tiles); $("battleStatus").textContent = ""; $("battleStatus").classList.remove("is-wrong"); setFeedbackState("idle"); renderRound(); }
  function start() { state.roundIndex = 0; state.picks = 0; state.solved = 0; track("session_started"); showView("battleView"); startRound(); }
  function finish() { const key = "weightplay-grove-chain-best-picks"; const prior = Number(safeStorage.get(key)); if (!prior || state.picks < prior) safeStorage.set(key, String(state.picks)); $("resultText").textContent = t("finishText", { picks: state.picks }); $("bestValue").textContent = safeStorage.get(key) || String(state.picks); setFeedbackState("complete"); track("session_completed", { picks: state.picks }); showView("resultView"); }
  function goHome() { track("session_abandoned", { round: state.roundIndex + 1 }); showView("mainView"); applyLocale(); }
  function toggleSettings() { const panel = $("settingsPanel"); const open = panel.hidden; panel.hidden = !open; $("settingsBtn").setAttribute("aria-expanded", String(open)); }
  function toggleSound() { state.sound = !state.sound; applyLocale(); track("sound_changed", { enabled: state.sound }); }
  state.locale = queryLocale();
  document.addEventListener("DOMContentLoaded", () => { populateLocales(); applyLocale(); $("startBtn").addEventListener("click", start); $("replayBtn").addEventListener("click", start); $("homeBtn").addEventListener("click", goHome); $("battleBackBtn").addEventListener("click", goHome); $("leaveBtn").addEventListener("click", goHome); $("settingsBtn").addEventListener("click", toggleSettings); $("soundBtn").addEventListener("click", toggleSound); $("battleSoundBtn").addEventListener("click", toggleSound); });
  window.GROVE_CHAIN_TEST = { rounds, start, choose, state };
})();
