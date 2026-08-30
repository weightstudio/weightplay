(function () {
  "use strict";

  const localeMap = window.ANIMAL_NEST_WEIGH_LOCALES || {};
  const localeList = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const rounds = [
    { hint: "lessonHint1", request: "requestHeaviest", targetType: "heaviest", weights: [4, 7, 5], materials: ["twig", "reed", "feather"] },
    { hint: "lessonHint2", request: "requestLightest", targetType: "lightest", weights: [6, 3, 5], materials: ["bark", "moss", "grass"] },
    { hint: "lessonHint3", request: "requestMiddle", targetType: "middle", weights: [5, 7, 3], materials: ["down", "reed", "bark"] },
  ];
  const state = { locale: "en", screen: "main", round: 0, selectedPair: [], selectedTarget: null, comparison: null, comparisons: 0, completed: [], sound: true, wrong: false, resultVisible: false };
  const $ = (id) => document.getElementById(id);
  const safeGet = (key, fallback) => { try { return localStorage.getItem(key) || fallback; } catch (_error) { return fallback; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_error) {} };
  const copy = (key, vars = {}) => {
    const dictionary = localeMap[state.locale] || localeMap.en || {};
    let value = dictionary[key] || key;
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replace(new RegExp("\\{" + name + "\\}", "g"), String(replacement)); });
    return value;
  };
  const bestTotal = () => Number(safeGet("weightplay-animal-nest-weigh-best", "0")) || 0;
  const showToast = (message) => { $("toast").textContent = message; $("toast").classList.add("visible"); window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => $("toast").classList.remove("visible"), 1800); };
  const materialName = (key) => copy("material_" + key);
  const targetIndex = (round) => {
    const sorted = [...round.weights].sort((a, b) => a - b);
    const value = round.targetType === "heaviest" ? sorted.at(-1) : round.targetType === "lightest" ? sorted[0] : sorted[1];
    return round.weights.indexOf(value);
  };
  const applyText = () => {
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = copy(node.dataset.copy); });
    document.querySelectorAll("[data-copy-aria-label]").forEach((node) => { node.setAttribute("aria-label", copy(node.dataset.copyAriaLabel)); });
    $("soundBtn").textContent = state.sound ? copy("soundOn") : copy("soundOff");
    $("soundBtn").setAttribute("aria-pressed", String(state.sound));
    $("battleSoundBtn").setAttribute("aria-label", copy("sound"));
    $("battleSoundBtn").setAttribute("aria-pressed", String(state.sound));
    $("mainProgress").textContent = copy("progress", { count: state.completed.length });
    if (state.screen === "stage") renderStages();
    if (state.screen === "battle") renderBattle();
  };
  const setScreen = (screen) => {
    state.screen = screen;
    document.body.dataset.screen = screen;
    $("guideSection").hidden = screen !== "main";
    ["main", "stage", "battle"].forEach((name) => { const element = $(name + "Screen"); element.hidden = name !== screen; element.classList.toggle("active", name === screen); });
    if (screen === "main") applyText();
    if (screen === "stage") renderStages();
    if (screen === "battle") renderBattle();
    window.scrollTo(0, 0);
  };
  const stageUnlocked = (index) => index === 0 || state.completed.includes(index - 1);
  const renderStages = () => {
    $("stageList").innerHTML = rounds.map((round, index) => {
      const done = state.completed.includes(index);
      const unlocked = stageUnlocked(index);
      return `<button class="stage-card${done ? " complete" : ""}" type="button" data-stage="${index}" data-wp-stage-card${unlocked ? " data-wp-enter-battle" : " disabled"}><span class="stage-number">${copy("round", { number: index + 1, total: rounds.length })}</span><strong>${copy(round.request)}</strong><span>${copy(round.hint)}</span><b>${done ? copy("completed") : unlocked ? copy("readyStage") : copy("lockedStage")}</b></button>`;
    }).join("");
    $("stageList").querySelectorAll("[data-stage]").forEach((button) => button.addEventListener("click", () => startRound(Number(button.dataset.stage))));
  };
  const trayMarkup = (round, index, mode) => {
    const name = materialName(round.materials[index]);
    const pairSelected = state.selectedPair.includes(index);
    const targetSelected = state.selectedTarget === index;
    const selected = mode === "pair" ? pairSelected : targetSelected;
    const aria = mode === "pair" ? copy("compareTray", { name }) : copy("answerTray", { name });
    return `<button type="button" class="tray-card${selected ? " selected" : ""}" data-${mode}-tray="${index}" aria-label="${aria}" aria-pressed="${selected}"><span class="tray-icon" aria-hidden="true"><i></i><i></i><i></i></span><strong>${name}</strong><small>${copy(mode === "pair" ? "tapToCompare" : "tapToChoose")}</small></button>`;
  };
  const comparisonMessage = () => {
    if (!state.comparison) return copy("comparisonEmpty");
    const round = rounds[state.round];
    const [first, second] = state.comparison.pair;
    const firstName = materialName(round.materials[first]);
    const secondName = materialName(round.materials[second]);
    const relation = round.weights[first] === round.weights[second] ? copy("equal") : round.weights[first] > round.weights[second] ? copy("heavier") : copy("lighter");
    return copy("comparisonResult", { first: firstName, second: secondName, relation });
  };
  const renderBattle = () => {
    const round = rounds[state.round];
    $("battleHeading").textContent = copy("round", { number: state.round + 1, total: rounds.length });
    $("roundHint").textContent = copy(round.hint);
    $("progressBadge").textContent = copy("progressBadge", { count: state.completed.length });
    $("requestText").textContent = copy(round.request);
    $("comparisonCount").textContent = copy("comparisonCount", { count: state.comparisons });
    $("compareBoard").innerHTML = round.materials.map((_material, index) => trayMarkup(round, index, "pair")).join("");
    $("answerBoard").innerHTML = round.materials.map((_material, index) => trayMarkup(round, index, "answer")).join("");
    $("comparisonText").textContent = comparisonMessage();
    $("battleStatus").textContent = state.wrong ? copy("wrong") : state.comparison ? copy("chooseAfterCompare") : copy("ready");
    $("compareBtn").disabled = state.selectedPair.length !== 2;
    $("checkBtn").disabled = state.selectedTarget === null;
    $("compareBoard").querySelectorAll("[data-pair-tray]").forEach((button) => button.addEventListener("click", () => {
      const index = Number(button.dataset.pairTray);
      state.selectedPair = state.selectedPair.includes(index) ? state.selectedPair.filter((item) => item !== index) : state.selectedPair.length < 2 ? [...state.selectedPair, index] : [state.selectedPair[1], index];
      state.wrong = false;
      renderBattle();
    }));
    $("answerBoard").querySelectorAll("[data-answer-tray]").forEach((button) => button.addEventListener("click", () => { state.selectedTarget = Number(button.dataset.answerTray); state.wrong = false; renderBattle(); }));
    if (state.resultVisible) {
      renderResult();
    } else {
      $("resultPanel").hidden = true;
      $("battlePanel").hidden = false;
    }
  };
  const compareSelected = () => {
    if (state.selectedPair.length !== 2) { $("battleStatus").textContent = copy("needPair"); return; }
    state.comparisons += 1;
    state.comparison = { pair: [...state.selectedPair] };
    state.wrong = false;
    renderBattle();
  };
  const clearPair = () => { state.selectedPair = []; state.comparison = null; state.wrong = false; renderBattle(); };
  const renderResult = () => {
    const final = state.round === rounds.length - 1;
    const total = state.comparisons;
    const previousBest = bestTotal();
    $("battlePanel").hidden = true;
    $("resultPanel").hidden = false;
    $("resultHeading").textContent = copy(final ? "finishTitle" : "resultTitle");
    $("resultText").textContent = copy(final ? "finishText" : "resultText");
    const best = final ? Math.min(total, previousBest || total) : bestTotal();
    $("resultStats").textContent = copy("stats", { comparisons: total, best: best ? copy("best", { count: best }) : copy("noBest") });
    $("resultPrimaryBtn").textContent = copy(final ? "replay" : "next");
    $("resultPrimaryBtn").onclick = () => final ? startRound(0) : startRound(state.round + 1);
    $("mainProgress").textContent = copy("progress", { count: state.completed.length });
  };
  const resetRound = () => { state.selectedPair = []; state.selectedTarget = null; state.comparison = null; state.comparisons = 0; state.wrong = false; state.resultVisible = false; renderBattle(); };
  const showResult = () => {
    const final = state.round === rounds.length - 1;
    const total = state.comparisons;
    const previousBest = bestTotal();
    if (final && (!previousBest || total < previousBest)) safeSet("weightplay-animal-nest-weigh-best", String(total));
    if (!state.completed.includes(state.round)) state.completed.push(state.round);
    state.resultVisible = true;
    renderResult();
  };
  const checkRound = () => {
    if (!state.comparison) { $("battleStatus").textContent = copy("needComparison"); return; }
    if (state.selectedTarget === null) { $("battleStatus").textContent = copy("needAnswer"); return; }
    if (state.selectedTarget === targetIndex(rounds[state.round])) { state.wrong = false; showResult(); }
    else { state.wrong = true; renderBattle(); }
  };
  const startRound = (index) => { state.round = Math.max(0, Math.min(rounds.length - 1, index)); resetRound(); setScreen("battle"); };
  const applyLocale = (locale) => {
    state.locale = localeList.includes(locale) && localeMap[locale] ? locale : "en";
    safeSet("weightplay-locale", state.locale);
    document.documentElement.lang = state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    $("languageSelect").value = state.locale;
    applyText();
  };
  const bind = () => {
    $("startBtn").addEventListener("click", () => setScreen("stage"));
    $("mapBtn").addEventListener("click", () => setScreen("stage"));
    $("mainSettingsBtn").addEventListener("click", () => { const open = $("settingsPanel").hidden; $("settingsPanel").hidden = !open; $("mainSettingsBtn").setAttribute("aria-expanded", String(open)); });
    $("closeSettingsBtn").addEventListener("click", () => { $("settingsPanel").hidden = true; $("mainSettingsBtn").setAttribute("aria-expanded", "false"); });
    $("stageBackBtn").addEventListener("click", () => setScreen("main"));
    $("stageInfoBtn").addEventListener("click", () => showToast(copy("mapIntro")));
    $("battleBackBtn").addEventListener("click", () => setScreen("stage"));
    $("compareBtn").addEventListener("click", compareSelected);
    $("clearPairBtn").addEventListener("click", clearPair);
    $("checkBtn").addEventListener("click", checkRound);
    $("resetBtn").addEventListener("click", resetRound);
    $("resultMapBtn").addEventListener("click", () => setScreen("stage"));
    $("resultHomeBtn").addEventListener("click", () => setScreen("main"));
    [$('soundBtn'), $('battleSoundBtn')].forEach((button) => button.addEventListener("click", () => { state.sound = !state.sound; safeSet("weightplay-animal-nest-weigh-sound", state.sound ? "on" : "off"); applyText(); }));
    $("languageSelect").addEventListener("change", (event) => applyLocale(event.target.value));
  };
  const initialLocale = () => {
    const queryLocale = new URLSearchParams(location.search).get("lang");
    const pathLocale = location.pathname.match(/^\/(en|zh-tw|zh-cn|ja|ko|es|pt-br|fr|de|it|ru|hi|ar)\//)?.[1];
    const pathMap = { "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", "pt-br": "pt-BR" };
    return queryLocale || pathMap[pathLocale] || safeGet("weightplay-locale", "en");
  };
  const init = () => { state.sound = safeGet("weightplay-animal-nest-weigh-sound", "on") !== "off"; bind(); applyLocale(initialLocale()); setScreen("main"); };
  window.__ANIMAL_NEST_WEIGH_TEST__ = { state, rounds, targetIndex, startRound, applyLocale };
  init();
}());
