(function () {
  "use strict";

  const locales = window.PATTERN_PATCH_LOCALES;
  const localeKeys = locales.__localeKeys;
  const rounds = [
    { pattern: ["leaf", "sun", "leaf", "moon", "?", "moon", "leaf", "sun", "leaf"], answer: "sun", options: ["sun", "star", "droplet"] },
    { pattern: ["moon", "dot", "leaf", "moon", "?", "leaf", "moon", "dot", "leaf"], answer: "dot", options: ["dot", "wave", "star"] },
    { pattern: ["diamond", "circle", "diamond", "circle", "?", "circle", "diamond", "circle", "diamond"], answer: "diamond", options: ["diamond", "triangle", "flower"] },
  ];
  const symbols = { leaf: "✦", sun: "☀", moon: "☾", dot: "•", star: "★", droplet: "●", wave: "≈", diamond: "◆", circle: "○", triangle: "▲", flower: "✿" };
  const markerFiles = Object.fromEntries(Object.keys(symbols).map((token) => [token, `assets/animal-pattern-patch-marker-${token}.png`]));
  markerFiles.mismatch = "assets/animal-pattern-patch-marker-mismatch.png";
  markerFiles.completion = "assets/animal-pattern-patch-marker-completion.png";
  const state = { locale: "en", sound: true, roundIndex: 0, checks: 0, solved: 0 };
  const $ = (id) => document.getElementById(id);
  const safeStorage = {
    get(key) { try { return window.localStorage.getItem(key); } catch (_) { return null; } },
    set(key, value) { try { window.localStorage.setItem(key, value); } catch (_) { /* private mode */ } },
  };
  const routeLocaleMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  function queryLocale() {
    const value = new URLSearchParams(window.location.search).get("lang");
    if (value && locales[value]) return value;
    const routeSegment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    const routedLocale = routeLocaleMap[routeSegment];
    return routedLocale && locales[routedLocale] ? routedLocale : (safeStorage.get("weightplay-pattern-locale") || "en");
  }
  function t(key, vars = {}) { const copy = locales[state.locale] || locales.en; const text = copy[key] || locales.en[key] || key; return text.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? "")); }
  function applyLocale() {
    const copy = locales[state.locale] || locales.en;
    document.documentElement.lang = state.locale === "zh-Hant" ? "zh-TW" : state.locale === "zh-Hans" ? "zh-CN" : state.locale;
    document.documentElement.dir = copy.direction || "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    const soundText = $("soundToggle").querySelector("[data-copy]");
    if (soundText) soundText.textContent = t(state.sound ? "soundOn" : "soundOff");
    $("soundToggle").setAttribute("aria-pressed", String(state.sound));
    $("soundToggle").setAttribute("aria-checked", String(state.sound));
    $("battleSoundToggle").setAttribute("aria-pressed", String(state.sound));
    $("battleSoundToggle").textContent = state.sound ? "♪" : "×";
    $("battleSoundToggle").setAttribute("aria-label", t(state.sound ? "soundOn" : "soundOff"));
    $("mainSettingsBtn").setAttribute("aria-label", t("settings"));
    $("mainSettingsPopover").setAttribute("aria-label", t("settings"));
    $("homeFromBattle").setAttribute("aria-label", t("home"));
    $("patternGrid").setAttribute("aria-label", t("patternGrid"));
    $("localeSelect").setAttribute("aria-label", t("language"));
    if (!$('battleView').hidden) renderRound();
  }
  function populateLocales() {
    const select = $("localeSelect");
    localeKeys.forEach((key) => { const option = document.createElement("option"); option.value = key; option.textContent = locales.en.languageNames[key]; select.append(option); });
    select.value = state.locale;
    select.addEventListener("change", () => { state.locale = select.value; safeStorage.set("weightplay-pattern-locale", state.locale); applyLocale(); });
  }
  function playTone(kind) {
    if (!state.sound || !(window.AudioContext || window.webkitAudioContext)) return;
    try { const AudioCtor = window.AudioContext || window.webkitAudioContext; const audio = new AudioCtor(); const oscillator = audio.createOscillator(); const gain = audio.createGain(); oscillator.frequency.value = kind === "success" ? 640 : 220; gain.gain.setValueAtTime(0.0001, audio.currentTime); gain.gain.exponentialRampToValueAtTime(0.035, audio.currentTime + 0.01); gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.13); oscillator.connect(gain).connect(audio.destination); oscillator.start(); oscillator.stop(audio.currentTime + 0.14); oscillator.addEventListener("ended", () => audio.close(), { once: true }); } catch (_) { /* optional audio */ }
  }
  function showView(id) {
    const mainActive = id === "mainView";
    const resultActive = id === "resultView";
    $("mainView").hidden = !mainActive;
    $("battleView").hidden = mainActive;
    $("resultView").hidden = !resultActive;
    $("gameGuide").hidden = !mainActive;
    $("leaveDialog").hidden = true;
    $("mainView").classList.toggle("is-active", mainActive);
    $("battleView").classList.toggle("is-active", !mainActive);
    $("resultView").classList.toggle("is-active", resultActive);
    document.body.dataset.screen = mainActive ? "main" : resultActive ? "result" : "battle";
    if (mainActive) {
      $("mainSettingsPopover").hidden = true;
      $("mainSettingsBtn").setAttribute("aria-expanded", "false");
    }
    window.scrollTo(0, 0);
  }
  function makeToken(token, label, interactive, callback) {
    const node = interactive ? document.createElement("button") : document.createElement("div");
    node.className = "token"; node.dataset.token = token; if (interactive) node.type = "button";
    node.setAttribute("aria-label", label);
    if (token === "?") { const symbol = document.createElement("span"); symbol.setAttribute("aria-hidden", "true"); symbol.textContent = "?"; node.append(symbol); }
    else { const art = document.createElement("img"); art.className = "token-art"; art.src = markerFiles[token]; art.alt = ""; art.setAttribute("aria-hidden", "true"); node.append(art); }
    if (interactive) node.addEventListener("click", callback);
    return node;
  }
  function setFeedback(key, marker) {
    const feedback = $("feedback"); feedback.replaceChildren();
    const art = document.createElement("img"); art.className = "feedback-art"; art.src = markerFiles[marker]; art.alt = ""; art.setAttribute("aria-hidden", "true");
    const copy = document.createElement("span"); copy.textContent = t(key); feedback.append(art, copy);
  }
  function renderRound() {
    const round = rounds[state.roundIndex];
    $("roundLabel").textContent = t("round", { current: state.roundIndex + 1, total: rounds.length });
    $("instruction").textContent = t("instruction");
    $("patternGrid").replaceChildren(...round.pattern.map((token, index) => makeToken(token, token === "?" ? t("missing") : t("patternTile", { row: Math.floor(index / 3) + 1, tile: (index % 3) + 1, token: (locales[state.locale].tokenNames || {})[token] || token }), false)));
    $("optionGrid").replaceChildren(...round.options.map((token) => { const option = makeToken(token, t("option", { token: (locales[state.locale].tokenNames || {})[token] || token }), true, () => choose(token, option)); option.classList.add("option-token"); return option; }));
    $("checkCount").textContent = String(state.checks); $("feedback").textContent = ""; $("feedback").classList.remove("is-wrong");
  }
  function choose(token, node) {
    state.checks += 1; $("checkCount").textContent = String(state.checks);
    const round = rounds[state.roundIndex];
    if (token !== round.answer) { node.classList.add("is-wrong"); setFeedback("wrong", "mismatch"); $("feedback").classList.add("is-wrong"); playTone("wrong"); window.setTimeout(() => node.classList.remove("is-wrong"), 420); return; }
    node.classList.add("is-correct"); node.disabled = true; state.solved += 1; $("feedback").classList.remove("is-wrong"); setFeedback("correct", "completion"); $("appStatus").textContent = t("correct"); playTone("success");
    window.setTimeout(() => { if (state.roundIndex < rounds.length - 1) { state.roundIndex += 1; renderRound(); } else finish(); }, 460);
  }
  function start() { state.roundIndex = 0; state.checks = 0; state.solved = 0; showView("battleView"); renderRound(); }
  function finish() { const key = "weightplay-pattern-patch-best-checks"; const prior = Number(safeStorage.get(key)); if (!prior || state.checks < prior) safeStorage.set(key, String(state.checks)); $("resultSummary").textContent = t("summary"); $("bestCount").textContent = safeStorage.get(key) || String(state.checks); showView("resultView"); }
  function goHome() { showView("mainView"); applyLocale(); }
  function toggleSound() { state.sound = !state.sound; applyLocale(); }
  function toggleSettings() { const popover = $("mainSettingsPopover"); const open = popover.hidden; popover.hidden = !open; $("mainSettingsBtn").setAttribute("aria-expanded", String(open)); }
  function openLeaveDialog() { $("leaveDialog").hidden = false; $("continueBtn").focus(); }
  function closeLeaveDialog() { $("leaveDialog").hidden = true; $("homeFromBattle").focus(); }
  state.locale = queryLocale();
  document.addEventListener("DOMContentLoaded", () => {
    document.body.dataset.screen = "main";
    populateLocales();
    applyLocale();
    $("startButton").addEventListener("click", start);
    $("replayButton").addEventListener("click", start);
    $("homeFromBattle").addEventListener("click", openLeaveDialog);
    $("leaveBtn").addEventListener("click", openLeaveDialog);
    $("continueBtn").addEventListener("click", closeLeaveDialog);
    $("confirmLeaveBtn").addEventListener("click", goHome);
    $("homeFromResult").addEventListener("click", goHome);
    $("mainSettingsBtn").addEventListener("click", toggleSettings);
    $("soundToggle").addEventListener("click", toggleSound);
    $("battleSoundToggle").addEventListener("click", toggleSound);
  });
  window.PATTERN_PATCH_TEST = { rounds, symbols, start, renderRound };
})();
