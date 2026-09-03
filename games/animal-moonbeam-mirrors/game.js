(function () {
  "use strict";
  const locales = window.MOONBEAM_MIRRORS_LOCALES;
  const localeKeys = window.MOONBEAM_MIRRORS_LOCALE_KEYS;
  const rounds = [
    { mirrors: { 1: 0, 4: 1 }, initial: { 1: 0, 4: 1 }, goal: 5, startRow: 0 },
    { mirrors: { 0: 1, 1: 0, 3: 1, 4: 0 }, initial: { 0: 0, 1: 0, 3: 1, 4: 1 }, goal: 2, startRow: 0 },
    { mirrors: { 0: 1, 3: 1, 4: 1, 7: 1 }, initial: { 0: 1, 3: 0, 4: 1, 7: 0 }, goal: 8, startRow: 0 }
  ];
  const state = { locale: "en", sound: true, round: 0, orientations: {}, turns: 0, totalTurns: 0, best: null };
  const $ = (id) => document.getElementById(id);
  const safeStorage = { get(key) { try { return window.localStorage.getItem(key); } catch (_) { return null; } }, set(key, value) { try { window.localStorage.setItem(key, value); } catch (_) {} } };
  const routeLocaleMap = { en: "en", "zh-tw": "zh-Hant", "zh-hant": "zh-Hant", "zh-cn": "zh-Hans", "zh-hans": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const directions = { R: [1, 0], D: [0, 1], L: [-1, 0], U: [0, -1] };
  const slashTurns = { R: "U", U: "R", L: "D", D: "L" };
  const backslashTurns = { R: "D", D: "R", L: "U", U: "L" };
  function t(key, vars = {}) { const copy = locales[state.locale] || locales.en; return String(copy[key] || locales.en[key] || key).replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? "")); }
  function queryLocale() { const query = new URLSearchParams(location.search).get("lang"); if (query && locales[query]) return query; const segment = location.pathname.split("/").filter(Boolean)[0]?.toLowerCase(); return routeLocaleMap[segment] || safeStorage.get("weightplay-moonbeam-mirrors-locale") || "en"; }
  function tone(kind) { if (!state.sound || !(window.AudioContext || window.webkitAudioContext)) return; try { const Audio = window.AudioContext || window.webkitAudioContext; const context = new Audio(); const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.frequency.value = kind === "success" ? 620 : 170; gain.gain.setValueAtTime(0.0001, context.currentTime); gain.gain.exponentialRampToValueAtTime(0.024, context.currentTime + 0.01); gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.11); oscillator.connect(gain).connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.12); oscillator.addEventListener("ended", () => context.close(), { once: true }); } catch (_) {} }
  function emit(name) { document.dispatchEvent(new CustomEvent("weightplay:analytics", { detail: { event: name, game: "animal-moonbeam-mirrors" } })); }
  function applyLocale() {
    const copy = locales[state.locale] || locales.en;
    document.documentElement.lang = state.locale === "zh-Hant" ? "zh-TW" : state.locale;
    document.documentElement.dir = copy.direction || "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    $("settingsBtn").setAttribute("aria-label", t("settings")); $("settingsPanel").setAttribute("aria-label", t("settings")); $("localeSelect").setAttribute("aria-label", t("language")); $("soundToggle").setAttribute("aria-label", t(state.sound ? "soundOn" : "soundOff")); $("soundToggle").setAttribute("aria-checked", String(state.sound)); $("soundToggle").setAttribute("aria-pressed", String(state.sound)); $("battleSoundToggle").setAttribute("aria-label", t(state.sound ? "soundOn" : "soundOff")); $("battleSoundToggle").setAttribute("aria-pressed", String(state.sound)); $("battleSoundToggle").textContent = state.sound ? "♪" : "×";
    if (!$('battleView').hidden) renderBattle();
  }
  function populateLocales() { const select = $("localeSelect"); localeKeys.forEach((key) => { const option = document.createElement("option"); option.value = key; option.textContent = locales.en.languageNames[key]; select.append(option); }); select.value = state.locale; select.addEventListener("change", () => { state.locale = select.value; safeStorage.set("weightplay-moonbeam-mirrors-locale", state.locale); applyLocale(); }); }
  function showView(view) { $("mainView").hidden = view !== "main"; $("battleView").hidden = view !== "battle"; $("resultView").hidden = view !== "result"; $("leaveDialog").hidden = true; const guide = document.querySelector("[data-wp-game-guide].game-page-info-static"); if (guide) guide.hidden = view !== "main"; document.body.dataset.screen = view; window.scrollTo(0, 0); }
  function cloneRound() { const round = rounds[state.round]; state.orientations = Object.assign({}, round.initial); state.turns = 0; }
  function start() { state.round = 0; state.totalTurns = 0; cloneRound(); emit("moonbeam_start"); showView("battle"); renderBattle(); }
  function trace() {
    const round = rounds[state.round]; let x = -1; let y = round.startRow; let direction = "R"; const path = []; const seen = new Set();
    for (let step = 0; step < 32; step += 1) {
      const delta = directions[direction]; x += delta[0]; y += delta[1];
      if (x < 0 || x > 2 || y < 0 || y > 2) return { reached: false, path };
      const index = y * 3 + x; path.push(index); if (index === round.goal) return { reached: true, path };
      const key = `${x},${y},${direction}`; if (seen.has(key)) return { reached: false, path }; seen.add(key);
      if (Object.prototype.hasOwnProperty.call(round.mirrors, index)) direction = (state.orientations[index] === 0 ? slashTurns : backslashTurns)[direction];
    }
    return { reached: false, path };
  }
  function mirrorText(value) { return value === 0 ? "／" : "＼"; }
  function renderBoard() {
    const round = rounds[state.round]; const result = trace(); const board = $("board"); board.replaceChildren();
    for (let index = 0; index < 9; index += 1) {
      const cell = document.createElement("div"); cell.className = "board-cell"; cell.classList.toggle("is-beam", result.path.includes(index)); cell.classList.toggle("is-goal", index === round.goal);
      if (Object.prototype.hasOwnProperty.call(round.mirrors, index)) { const button = document.createElement("button"); button.type = "button"; button.className = "mirror-tile"; button.textContent = mirrorText(state.orientations[index]); button.setAttribute("aria-label", t("mirror", { number: index + 1 })); button.dataset.index = String(index); button.addEventListener("click", () => { state.orientations[index] = state.orientations[index] === 0 ? 1 : 0; state.turns += 1; state.totalTurns += 1; $("turnCount").textContent = String(state.totalTurns); $("beamStatus").textContent = ""; $("beamStatus").className = "feedback"; renderBoard(); }); cell.append(button); } else { const empty = document.createElement("span"); empty.className = "empty-cell"; empty.setAttribute("aria-hidden", "true"); empty.textContent = index === round.goal ? "☾" : ""; cell.append(empty); }
      board.append(cell);
    }
  }
  function renderBattle() { $("roundLabel").textContent = t("round", { current: state.round + 1, total: rounds.length }); $("turnCount").textContent = String(state.totalTurns); $("instruction").textContent = t("instruction"); renderBoard(); }
  function check() { const result = trace(); if (!result.reached) { $("beamStatus").textContent = t("wrong"); $("beamStatus").className = "feedback is-wrong"; tone("wrong"); emit("moonbeam_miss"); renderBoard(); return; } $("beamStatus").textContent = t("success"); $("beamStatus").className = "feedback is-correct"; tone("success"); emit("moonbeam_path_complete"); if (state.round < rounds.length - 1) { window.setTimeout(() => { state.round += 1; cloneRound(); renderBattle(); }, 260); return; } window.setTimeout(finish, 260); }
  function finish() { const key = "weightplay-moonbeam-mirrors-best-turns"; const prior = Number(safeStorage.get(key)); if (!prior || state.totalTurns < prior) safeStorage.set(key, String(state.totalTurns)); $("resultSummary").textContent = t("summary", { turns: state.totalTurns }); $("bestCount").textContent = safeStorage.get(key) || String(state.totalTurns); showView("result"); emit("moonbeam_complete"); }
  function reset() { cloneRound(); $("beamStatus").textContent = ""; $("beamStatus").className = "feedback"; renderBattle(); }
  function goHome() { showView("main"); applyLocale(); }
  function toggleSettings() { const panel = $("settingsPanel"); const open = panel.hidden; panel.hidden = !open; $("settingsBtn").setAttribute("aria-expanded", String(open)); }
  function toggleSound() { state.sound = !state.sound; applyLocale(); }
  function openLeave() { $("leaveDialog").hidden = false; $("continueBtn").focus(); }
  function closeLeave() { $("leaveDialog").hidden = true; $("homeBtn").focus(); }
  state.locale = queryLocale();
  document.addEventListener("DOMContentLoaded", () => { populateLocales(); applyLocale(); $("startBtn").addEventListener("click", start); $("replayBtn").addEventListener("click", start); $("checkBtn").addEventListener("click", check); $("resetBtn").addEventListener("click", reset); $("homeBtn").addEventListener("click", openLeave); $("leaveBtn").addEventListener("click", openLeave); $("continueBtn").addEventListener("click", closeLeave); $("confirmLeaveBtn").addEventListener("click", goHome); $("homeFromResult").addEventListener("click", goHome); $("settingsBtn").addEventListener("click", toggleSettings); $("soundToggle").addEventListener("click", toggleSound); $("battleSoundToggle").addEventListener("click", toggleSound); });
  window.MOONBEAM_MIRRORS_TEST = { rounds, start, trace, check, reset };
}());
