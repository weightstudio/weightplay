(function () {
  "use strict";

  const locales = window.MEADOW_FIND_LOCALES;
  const localeKeys = locales.__localeKeys;
  const rounds = [
    { base: ["leaf", "droplet", "circle", "triangle", "star", "wave", "diamond", "dot", "crescent"], changedIndex: 4, changedTo: "sun" },
    { base: ["circle", "wave", "leaf", "diamond", "dot", "star", "crescent", "triangle", "droplet"], changedIndex: 7, changedTo: "hex" },
    { base: ["sun", "dot", "diamond", "wave", "leaf", "crescent", "hex", "circle", "triangle"], changedIndex: 2, changedTo: "flower" },
  ];
  const symbols = { leaf: "✦", droplet: "●", circle: "○", triangle: "▲", star: "★", wave: "≈", diamond: "◆", dot: "•", crescent: "☾", sun: "☀", hex: "⬢", flower: "✿" };
  const spritePositions = { leaf: "0%", droplet: "14.2857%", circle: "28.5714%", triangle: "42.8571%", star: "57.1428%", wave: "14.2857%", diamond: "28.5714%", dot: "42.8571%", crescent: "71.4285%", sun: "57.1428%", hex: "42.8571%", flower: "28.5714%" };
  const state = { locale: "en", sound: true, roundIndex: 0, checks: 0, solved: 0 };
  const startLabels = { en: "Start Game", "zh-Hant": "開始遊戲", "zh-Hans": "开始游戏", ja: "ゲームを始める", ko: "게임 시작", es: "Iniciar juego", "pt-BR": "Iniciar jogo", fr: "Démarrer le jeu", de: "Spiel starten", it: "Inizia il gioco", ru: "Начать игру", hi: "गेम शुरू करें", ar: "ابدأ اللعبة" };
  const $ = (id) => document.getElementById(id);
  const safeStorage = {
    get(key) { try { return window.localStorage.getItem(key); } catch (_) { return null; } },
    set(key, value) { try { window.localStorage.setItem(key, value); } catch (_) { /* private mode */ } },
  };

  function queryLocale() {
    const value = new URLSearchParams(window.location.search).get("lang");
    const routeSegment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    const routeMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
    const persisted = safeStorage.get("weightPlayLocale") || safeStorage.get("weightplayLocale") || safeStorage.get("wp-locale") || safeStorage.get("weightplay-meadow-locale");
    return value && locales[value] ? value : (routeMap[routeSegment] || persisted || "en");
  }
  function t(key, vars = {}) {
    const copy = locales[state.locale] || locales.en;
    let text = copy[key] || locales.en[key] || key;
    return text.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ""));
  }
  function setText(selector, key) { const node = document.querySelector(selector); if (node) node.textContent = t(key); }
  function applyLocale() {
    const copy = locales[state.locale] || locales.en;
    document.documentElement.lang = state.locale === "zh-Hant" ? "zh-TW" : state.locale === "zh-Hans" ? "zh-CN" : state.locale;
    document.documentElement.dir = copy.direction || "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    $("startButton").textContent = startLabels[state.locale] || t("start");
    const mainReturn = document.querySelector(".main-return[data-wp-return='main']");
    if (mainReturn) mainReturn.setAttribute("aria-label", t("backToLobby"));
    const soundText = $("soundToggle").querySelector("[data-copy]");
    if (soundText) soundText.textContent = t(state.sound ? "soundOn" : "soundOff");
    $("soundToggle").setAttribute("aria-pressed", String(state.sound));
    $("battleSoundToggle").setAttribute("aria-pressed", String(state.sound));
    $("battleSoundToggle").setAttribute("aria-label", t(state.sound ? "soundOn" : "soundOff"));
    $("battleSoundToggle").textContent = state.sound ? "♪" : "×";
    $("localeSelect").setAttribute("aria-label", t("language"));
    if (!$("battleView").hidden) renderRound();
  }
  function populateLocales() {
    const select = $("localeSelect");
    localeKeys.forEach((key) => { const option = document.createElement("option"); option.value = key; option.textContent = locales.en.languageNames[key]; select.append(option); });
    select.value = state.locale;
    select.addEventListener("change", () => { state.locale = select.value; safeStorage.set("weightplay-meadow-locale", state.locale); applyLocale(); });
  }
  function playTone(kind) {
    if (!state.sound || !window.AudioContext && !window.webkitAudioContext) return;
    try {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      const audio = new AudioCtor();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.frequency.value = kind === "success" ? 640 : 220;
      gain.gain.setValueAtTime(0.0001, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.035, audio.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.13);
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start(); oscillator.stop(audio.currentTime + 0.14);
      oscillator.addEventListener("ended", () => audio.close(), { once: true });
    } catch (_) { /* audio is an optional enhancement */ }
  }
  function showView(id) {
    const mainActive = id === "mainScreen";
    const resultActive = id === "resultView";
    $("mainScreen").hidden = !mainActive;
    $("battleView").hidden = mainActive;
    $("resultView").hidden = !resultActive;
    $("mainScreen").classList.toggle("is-active", mainActive);
    $("battleView").classList.toggle("is-active", !mainActive);
    $("battleView").classList.toggle("is-result", resultActive);
    $("resultView").classList.toggle("is-active", resultActive);
    document.body.dataset.screen = mainActive ? "main" : resultActive ? "result" : "battle";
    window.scrollTo(0, 0);
  }
  function makeTile(token, index, interactive) {
    const node = interactive ? document.createElement("button") : document.createElement("div");
    node.className = "tile";
    node.dataset.index = String(index);
    node.dataset.shape = token;
    if (interactive) node.setAttribute("data-wp-primary-action", "");
    node.setAttribute("aria-label", t("tile", { row: Math.floor(index / 3) + 1, tile: (index % 3) + 1, shape: (locales[state.locale].shapeNames || {})[token] || token }));
    const symbol = document.createElement("span");
    symbol.setAttribute("aria-hidden", "true"); symbol.textContent = symbols[token];
    symbol.classList.toggle("has-sprite", spritePositions[token] !== undefined);
    if (spritePositions[token] !== undefined) symbol.style.setProperty("--sprite-position", spritePositions[token]);
    node.append(symbol);
    if (interactive) { node.type = "button"; node.addEventListener("click", () => chooseTile(index, node)); }
    return node;
  }
  function renderRound() {
    const round = rounds[state.roundIndex];
    $("roundLabel").textContent = t("round", { current: state.roundIndex + 1, total: rounds.length });
    $("instruction").textContent = t("instruction");
    $("beforeGrid").replaceChildren(...round.base.map((token, index) => makeTile(token, index, false)));
    const after = round.base.map((token, index) => index === round.changedIndex ? round.changedTo : token);
    $("afterGrid").replaceChildren(...after.map((token, index) => makeTile(token, index, true)));
    $("checkCount").textContent = String(state.checks);
    $("feedback").textContent = "";
    $("feedback").classList.remove("is-wrong");
  }
  function chooseTile(index, node) {
    state.checks += 1; $("checkCount").textContent = String(state.checks);
    const round = rounds[state.roundIndex];
    if (index !== round.changedIndex) {
      node.classList.add("is-wrong"); $("feedback").textContent = t("wrong", { row: Math.floor(index / 3) + 1, tile: (index % 3) + 1 }); $("feedback").classList.add("is-wrong"); playTone("wrong");
      window.setTimeout(() => node.classList.remove("is-wrong"), 420);
      return;
    }
    node.classList.add("is-correct"); node.disabled = true; state.solved += 1; playTone("success"); $("feedback").classList.remove("is-wrong"); $("feedback").textContent = t("correct"); $("appStatus").textContent = t("correct");
    window.setTimeout(() => { if (state.roundIndex < rounds.length - 1) { state.roundIndex += 1; renderRound(); } else finish(); }, 460);
  }
  function start() { state.roundIndex = 0; state.checks = 0; state.solved = 0; showView("battleView"); renderRound(); }
  function finish() {
    const key = "weightplay-meadow-best-checks"; const prior = Number(safeStorage.get(key)); if (!prior || state.checks < prior) safeStorage.set(key, String(state.checks));
    $("resultSummary").textContent = t("summary"); $("bestCount").textContent = safeStorage.get(key) || String(state.checks); showView("resultView");
  }
  function goHome() { showView("mainScreen"); applyLocale(); }
  function toggleSound() { state.sound = !state.sound; applyLocale(); }
  state.locale = queryLocale();
  document.addEventListener("DOMContentLoaded", () => { populateLocales(); applyLocale(); $("startButton").addEventListener("click", start); $("replayButton").addEventListener("click", start); $("homeFromBattle").addEventListener("click", goHome); $("homeFromResult").addEventListener("click", goHome); $("soundToggle").addEventListener("click", toggleSound); $("battleSoundToggle").addEventListener("click", toggleSound); });
  window.MEADOW_FIND_TEST = { rounds, symbols, start, renderRound };
})();
