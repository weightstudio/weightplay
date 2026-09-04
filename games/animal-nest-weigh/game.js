(function () {
  "use strict";

  const localeMap = window.ANIMAL_NEST_WEIGH_LOCALES || {};
  const localeList = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const rounds = [
    { name: "Twig Trail", nameZh: "樹枝小徑", nameAr: "درب الغصن", arc: 1, mechanicKey: "mechanicBalance", hint: "lessonHint1", request: "requestHeaviest", targetType: "heaviest", weights: [4, 7, 5], materials: ["twig", "reed", "feather"], minimumComparisons: 1 },
    { name: "Soft Lining", nameZh: "柔軟內襯", nameAr: "البطانة الناعمة", arc: 1, mechanicKey: "mechanicBalance", hint: "lessonHint2", request: "requestLightest", targetType: "lightest", weights: [6, 3, 5], materials: ["bark", "moss", "grass"], minimumComparisons: 1 },
    { name: "Middle Perch", nameZh: "中間棲枝", nameAr: "المجثم الأوسط", arc: 1, mechanicKey: "mechanicBalance", hint: "lessonHint3", request: "requestMiddle", targetType: "middle", weights: [5, 7, 3], materials: ["down", "reed", "bark"], minimumComparisons: 1 },
    { name: "Feather Rest", nameZh: "羽毛歇腳處", nameAr: "راحة الريش", arc: 1, mechanicKey: "mechanicBalance", hint: "lessonHint1", request: "requestHeaviest", targetType: "heaviest", weights: [8, 4, 6], materials: ["feather", "moss", "twig"], minimumComparisons: 1 },
    { name: "First Safe Bundle", nameZh: "第一束安全巢材", nameAr: "الحزمة الآمنة الأولى", arc: 1, mechanicKey: "mechanicBalance", checkpoint: true, hint: "lessonHint2", request: "requestLightest", targetType: "lightest", weights: [3, 8, 5], materials: ["grass", "bark", "reed"], minimumComparisons: 2 },
    { name: "Four-Tray Decoy", nameZh: "四盤誘餌", nameAr: "الطُعم ذو الصواني الأربع", arc: 2, mechanicKey: "mechanicDecoy", hint: "lessonHint1", request: "requestHeaviest", targetType: "heaviest", weights: [4, 9, 6, 2], materials: ["twig", "feather", "moss", "grass"], minimumComparisons: 1 },
    { name: "Second-Strongest Reed", nameZh: "次重蘆葦", nameAr: "القصب الثاني في الثقل", arc: 2, mechanicKey: "mechanicDecoy", hint: "lessonHint3", request: "requestSecondHeaviest", targetType: "secondHeaviest", weights: [8, 3, 6, 5], materials: ["bark", "reed", "down", "feather"], minimumComparisons: 1 },
    { name: "Second-Lightest Moss", nameZh: "次輕苔蘚", nameAr: "الطحلب الثاني في الخفة", arc: 2, mechanicKey: "mechanicDecoy", hint: "lessonHint2", request: "requestSecondLightest", targetType: "secondLightest", weights: [5, 2, 9, 4], materials: ["moss", "grass", "twig", "bark"], minimumComparisons: 2 },
    { name: "Hidden Feather", nameZh: "藏起來的羽毛", nameAr: "الريشة المخفية", arc: 2, mechanicKey: "mechanicDecoy", hint: "lessonHint1", request: "requestSecondHeaviest", targetType: "secondHeaviest", weights: [7, 4, 10, 3], materials: ["reed", "feather", "down", "grass"], minimumComparisons: 2 },
    { name: "Decoy Gate", nameZh: "誘餌關卡", nameAr: "بوابة الطُعم", arc: 2, mechanicKey: "mechanicDecoy", checkpoint: true, hint: "lessonHint2", request: "requestLightest", targetType: "lightest", weights: [6, 11, 2, 8], materials: ["bark", "feather", "moss", "reed"], minimumComparisons: 2 },
    { name: "Five-Way Balance", nameZh: "五向平衡", nameAr: "توازن الاتجاهات الخمسة", arc: 3, mechanicKey: "mechanicChain", hint: "lessonHint3", request: "requestMiddle", targetType: "middle", weights: [4, 9, 2, 7, 6], materials: ["twig", "reed", "moss", "feather", "bark"], minimumComparisons: 2 },
    { name: "Light Chain", nameZh: "輕材鏈", nameAr: "سلسلة الخفيف", arc: 3, mechanicKey: "mechanicChain", hint: "lessonHint2", request: "requestSecondLightest", targetType: "secondLightest", weights: [10, 3, 8, 5, 6], materials: ["down", "grass", "reed", "bark", "moss"], minimumComparisons: 2 },
    { name: "Strong Link", nameZh: "重量連結", nameAr: "الرابط الثقيل", arc: 3, mechanicKey: "mechanicChain", hint: "lessonHint1", request: "requestSecondHeaviest", targetType: "secondHeaviest", weights: [7, 2, 9, 4, 6], materials: ["feather", "moss", "twig", "reed", "grass"], minimumComparisons: 3 },
    { name: "Quiet Middle", nameZh: "安靜中材", nameAr: "الوسط الهادئ", arc: 3, mechanicKey: "mechanicChain", hint: "lessonHint3", request: "requestSecondLightest", targetType: "secondLightest", weights: [6, 11, 3, 8, 5], materials: ["bark", "down", "grass", "moss", "reed"], minimumComparisons: 3 },
    { name: "Chain Checkpoint", nameZh: "鏈結檢查點", nameAr: "نقطة فحص السلسلة", arc: 3, mechanicKey: "mechanicChain", checkpoint: true, hint: "lessonHint3", request: "requestMiddle", targetType: "middle", weights: [9, 4, 7, 2, 6], materials: ["feather", "twig", "reed", "moss", "bark"], minimumComparisons: 3 },
    { name: "Bark Between", nameZh: "樹皮之間", nameAr: "اللحاء بينهما", arc: 4, mechanicKey: "mechanicBalance", hint: "lessonHint2", request: "requestSecondLightest", targetType: "secondLightest", weights: [11, 5, 8, 3], materials: ["down", "bark", "reed", "moss"], minimumComparisons: 2 },
    { name: "Heavy Ridge", nameZh: "重量山脊", nameAr: "حافة الثقل", arc: 4, mechanicKey: "mechanicBalance", hint: "lessonHint1", request: "requestHeaviest", targetType: "heaviest", weights: [2, 9, 6, 12, 4], materials: ["grass", "feather", "moss", "down", "twig"], minimumComparisons: 3 },
    { name: "Reed Above", nameZh: "蘆葦之上", nameAr: "القصب الأعلى", arc: 4, mechanicKey: "mechanicBalance", hint: "lessonHint3", request: "requestSecondHeaviest", targetType: "secondHeaviest", weights: [8, 3, 10, 5, 7], materials: ["reed", "moss", "feather", "bark", "grass"], minimumComparisons: 3 },
    { name: "Nestful Four", nameZh: "四材滿巢", nameAr: "العش المليء بالأربع", arc: 4, mechanicKey: "mechanicBalance", hint: "lessonHint2", request: "requestSecondLightest", targetType: "secondLightest", weights: [4, 13, 7, 2, 9], materials: ["twig", "down", "reed", "moss", "feather"], minimumComparisons: 3 },
    { name: "Ridge Checkpoint", nameZh: "山脊檢查點", nameAr: "نقطة فحص الحافة", arc: 4, mechanicKey: "mechanicBalance", checkpoint: true, hint: "lessonHint3", request: "requestSecondHeaviest", targetType: "secondHeaviest", weights: [10, 5, 14, 3, 8], materials: ["bark", "grass", "feather", "moss", "reed"], minimumComparisons: 3 },
    { name: "Six-Tray Route", nameZh: "六盤路線", nameAr: "مسار الصواني الست", arc: 5, mechanicKey: "mechanicPressure", hint: "lessonHint3", request: "requestSecondHeaviest", targetType: "secondHeaviest", weights: [7, 2, 11, 5, 9, 4], materials: ["reed", "moss", "down", "grass", "feather", "twig"], minimumComparisons: 3 },
    { name: "Moss Under Reed", nameZh: "蘆葦下的苔蘚", nameAr: "الطحلب تحت القصب", arc: 5, mechanicKey: "mechanicPressure", hint: "lessonHint2", request: "requestSecondLightest", targetType: "secondLightest", weights: [12, 4, 8, 3, 10, 6], materials: ["down", "bark", "reed", "moss", "feather", "grass"], minimumComparisons: 3 },
    { name: "Feather Decoy Field", nameZh: "羽毛誘餌地", nameAr: "حقل طُعم الريش", arc: 5, mechanicKey: "mechanicPressure", hint: "lessonHint1", request: "requestSecondHeaviest", targetType: "secondHeaviest", weights: [5, 14, 2, 9, 7, 11], materials: ["twig", "feather", "moss", "reed", "grass", "down"], minimumComparisons: 4 },
    { name: "Bark Side Path", nameZh: "樹皮側路", nameAr: "الممر الجانبي للّحاء", arc: 5, mechanicKey: "mechanicPressure", hint: "lessonHint2", request: "requestSecondLightest", targetType: "secondLightest", weights: [8, 3, 13, 6, 10, 4], materials: ["reed", "moss", "down", "grass", "feather", "bark"], minimumComparisons: 4 },
    { name: "Pressure Checkpoint", nameZh: "壓力檢查點", nameAr: "نقطة فحص الضغط", arc: 5, mechanicKey: "mechanicPressure", checkpoint: true, hint: "lessonHint3", request: "requestSecondHeaviest", targetType: "secondHeaviest", weights: [15, 5, 9, 2, 12, 7], materials: ["down", "bark", "reed", "moss", "feather", "grass"], minimumComparisons: 4 },
    { name: "Mastery Seven", nameZh: "七材精通", nameAr: "إتقان المواد السبع", arc: 6, mechanicKey: "mechanicMastery", hint: "lessonHint1", request: "requestSecondHeaviest", targetType: "secondHeaviest", weights: [6, 13, 3, 10, 8, 15, 5], materials: ["twig", "reed", "moss", "feather", "down", "grass", "bark"], minimumComparisons: 4 },
    { name: "Lowest Feather", nameZh: "最輕羽毛", nameAr: "الريشة الأخف", arc: 6, mechanicKey: "mechanicMastery", hint: "lessonHint2", request: "requestLightest", targetType: "lightest", weights: [11, 4, 16, 7, 14, 2, 9], materials: ["bark", "moss", "down", "grass", "feather", "twig", "reed"], minimumComparisons: 4 },
    { name: "Second Light in Seven", nameZh: "七材次輕", nameAr: "الثاني في الخفة", arc: 6, mechanicKey: "mechanicMastery", hint: "lessonHint3", request: "requestSecondLightest", targetType: "secondLightest", weights: [8, 15, 3, 12, 5, 17, 10], materials: ["reed", "feather", "moss", "down", "grass", "bark", "twig"], minimumComparisons: 4 },
    { name: "Final Strong Link", nameZh: "最後重量連結", nameAr: "الرابط الثقيل الأخير", arc: 6, mechanicKey: "mechanicMastery", hint: "lessonHint1", request: "requestSecondHeaviest", targetType: "secondHeaviest", weights: [14, 6, 19, 4, 11, 8, 16], materials: ["down", "bark", "feather", "moss", "reed", "grass", "twig"], minimumComparisons: 5 },
    { name: "Taro's Master Nest", nameZh: "塔羅的精通巢", nameAr: "عش تارُو المتقن", arc: 6, mechanicKey: "mechanicMastery", checkpoint: true, hint: "lessonHint3", request: "requestHeaviest", targetType: "heaviest", weights: [9, 18, 5, 14, 7, 21, 11], materials: ["twig", "down", "moss", "feather", "grass", "reed", "bark"], minimumComparisons: 5 },
  ];
  const state = { locale: "en", screen: "main", round: 0, selectedPair: [], selectedTarget: null, comparison: null, comparisons: 0, completed: [], sound: true, wrong: false, resultVisible: false };
  const $ = (id) => document.getElementById(id);
  const safeGet = (key, fallback) => { try { return localStorage.getItem(key) || fallback; } catch (_error) { return fallback; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_error) {} };
  const progressKey = "weightplay-animal-nest-weigh-progress";
  const loadCompleted = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(progressKey) || "[]");
      return Array.isArray(parsed) ? [...new Set(parsed.filter((index) => Number.isInteger(index) && index >= 0 && index < rounds.length))].sort((a, b) => a - b) : [];
    } catch (_error) { return []; }
  };
  const saveCompleted = () => safeSet(progressKey, JSON.stringify([...state.completed].sort((a, b) => a - b)));
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
    const sorted = round.weights.map((weight, index) => ({ weight, index })).sort((a, b) => a.weight - b.weight);
    const rank = round.targetType === "heaviest" ? sorted.length - 1
      : round.targetType === "secondHeaviest" ? sorted.length - 2
      : round.targetType === "secondLightest" ? 1
      : round.targetType === "middle" ? Math.floor(sorted.length / 2)
      : 0;
    return sorted[Math.max(0, Math.min(sorted.length - 1, rank))].index;
  };
  const stageName = (round, index) => {
    if (state.locale === "zh-Hant") return round.nameZh;
    if (state.locale === "ar") return round.nameAr;
    if (state.locale === "en") return round.name;
    return copy("round", { number: index + 1, total: rounds.length });
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
    const guide = $("guideSection");
    if (guide) guide.hidden = screen !== "main";
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
      const checkpoint = round.checkpoint ? ` · ${copy("checkpoint")}` : "";
      return `<button class="stage-card${done ? " complete" : ""}" type="button" data-stage="${index}" data-wp-stage-card${unlocked ? " data-wp-enter-battle" : " disabled"}><span class="stage-number">${copy("round", { number: index + 1, total: rounds.length })}</span><strong>${stageName(round, index)}</strong><span>${copy(round.request)} · ${copy(round.mechanicKey)}${checkpoint}</span><b>${done ? copy("completed") : unlocked ? copy("readyStage") : copy("lockedStage")}</b></button>`;
    }).join("");
    $("stageList").querySelectorAll("[data-stage]").forEach((button) => button.addEventListener("click", () => startRound(Number(button.dataset.stage))));
  };
  const trayMarkup = (round, index, mode) => {
    const name = materialName(round.materials[index]);
    const material = round.materials[index];
    const pairSelected = state.selectedPair.includes(index);
    const targetSelected = state.selectedTarget === index;
    const selected = mode === "pair" ? pairSelected : targetSelected;
    const aria = mode === "pair" ? copy("compareTray", { name }) : copy("answerTray", { name });
    return `<button type="button" class="tray-card${selected ? " selected" : ""}" data-${mode}-tray="${index}" aria-label="${aria}" aria-pressed="${selected}"><span class="tray-icon material-${material}" aria-hidden="true"></span><strong>${name}</strong><small>${copy(mode === "pair" ? "tapToCompare" : "tapToChoose")}</small></button>`;
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
    const needsMore = state.comparison && state.comparisons < round.minimumComparisons;
    $("battleStatus").textContent = state.wrong ? copy("wrong") : needsMore ? copy("needMoreComparisons", { count: round.minimumComparisons }) : state.comparison ? copy("chooseAfterCompare") : copy("ready");
    $("comparisonText").classList.toggle("has-comparison", Boolean(state.comparison));
    $("battleStatus").classList.toggle("is-wrong", state.wrong);
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
    saveCompleted();
    state.resultVisible = true;
    renderResult();
  };
  const checkRound = () => {
    if (!state.comparison) { $("battleStatus").textContent = copy("needComparison"); return; }
    if (state.comparisons < rounds[state.round].minimumComparisons) { $("battleStatus").textContent = copy("needMoreComparisons", { count: rounds[state.round].minimumComparisons }); return; }
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
    return queryLocale || pathMap[pathLocale] || pathLocale || safeGet("weightplay-locale", "en");
  };
  const init = () => { state.completed = loadCompleted(); state.sound = safeGet("weightplay-animal-nest-weigh-sound", "on") !== "off"; bind(); applyLocale(initialLocale()); setScreen("main"); };
  window.__ANIMAL_NEST_WEIGH_TEST__ = { state, rounds, targetIndex, startRound, applyLocale };
  init();
}());
