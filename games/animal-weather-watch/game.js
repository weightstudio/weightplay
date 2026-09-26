(function () {
  "use strict";
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((({main:"main",stage:"stage",battle:"battle",})[currentScreen] ?? null) === "battle" && (__wpMeasurement.ended)) ? null : (({main:"main",stage:"stage",battle:"battle",})[currentScreen] ?? null), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(false), node: document.body,
    activityMode: "input", idleSeconds: 300
  });
  function __wpNotifyMeasurement() { try { window.WonderAnalytics?.game?.observeState(__wpReadMeasurement); } catch { /* Optional telemetry. */ } }
  window.addEventListener("weightplay:analytics-ready", __wpNotifyMeasurement);
  __wpNotifyMeasurement();

  const $ = (id) => document.getElementById(id);
  const locales = window.WEATHER_WATCH_LOCALES || {};
  const routeLocaleMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const routeSegment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const signs = { sun: "☀", cloud: "☁", rain: "☂" };
  const START_LABELS = { en:"Start Game","zh-Hant":"開始遊戲","zh-Hans":"开始游戏",ja:"ゲーム開始",ko:"게임 시작",es:"Iniciar juego","pt-BR":"Iniciar jogo",fr:"Démarrer le jeu",de:"Spiel starten",it:"Avvia gioco",ru:"Начать игру",hi:"खेल शुरू करें",ar:"ابدأ اللعبة" };
  const STAGES_LABELS = { en:"Stages","zh-Hant":"關卡","zh-Hans":"关卡",ja:"ステージ",ko:"스테이지",es:"Niveles","pt-BR":"Fases",fr:"Niveaux",de:"Level",it:"Livelli",ru:"Уровни",hi:"स्तर",ar:"المراحل" };
  const REPLAY_LABELS = { en:"Replay","zh-Hant":"重新遊玩","zh-Hans":"重新游玩",ja:"リプレイ",ko:"다시 플레이",es:"Repetir","pt-BR":"Repetir",fr:"Rejouer",de:"Wiederholen",it:"Rigioca",ru:"Повторить",hi:"फिर खेलें",ar:"إعادة اللعب" };
  const LEAVE_COPY = {
    en:["Leave this forecast?","Your current answer and checks for {name} will be discarded. Completed forecasts stay available.","Continue playing","Return to stages"],
    "zh-Hant":["離開這份預報？","{name}目前的答案與本輪檢查次數會被放棄；已完成的預報會保留。","繼續遊戲","返回關卡"],
    "zh-Hans":["离开这份预报？","{name}当前的答案与本轮检查次数会被放弃；已完成的预报会保留。","继续游戏","返回关卡"],
    ja:["この予報を離れますか？","{name} の現在の回答と今回の確認回数は破棄されます。完了済みの予報は残ります。","プレイを続ける","ステージへ戻る"],
    ko:["이 예보를 나갈까요?","{name}의 현재 답과 이번 확인 횟수는 사라집니다. 완료한 예보는 유지됩니다.","계속 플레이","스테이지로 돌아가기"],
    es:["¿Salir de este pronóstico?","Se descartarán la respuesta actual y las comprobaciones de {name}. Los pronósticos completados se conservarán.","Seguir jugando","Volver a niveles"],
    "pt-BR":["Sair desta previsão?","A resposta atual e as verificações de {name} serão descartadas. As previsões concluídas serão mantidas.","Continuar jogando","Voltar às fases"],
    fr:["Quitter cette prévision ?","La réponse actuelle et les vérifications de {name} seront abandonnées. Les prévisions terminées resteront enregistrées.","Continuer à jouer","Retour aux niveaux"],
    de:["Diese Vorhersage verlassen?","Die aktuelle Antwort und Prüfungen für {name} werden verworfen. Abgeschlossene Vorhersagen bleiben erhalten.","Weiterspielen","Zurück zu den Leveln"],
    it:["Uscire da questa previsione?","La risposta attuale e i controlli di {name} verranno annullati. Le previsioni completate resteranno disponibili.","Continua a giocare","Torna ai livelli"],
    ru:["Выйти из прогноза?","Текущий ответ и проверки для {name} будут сброшены. Завершённые прогнозы сохранятся.","Продолжить игру","Вернуться к уровням"],
    hi:["इस पूर्वानुमान से बाहर जाएँ?","{name} का मौजूदा उत्तर और इस दौर की जाँचें हट जाएँगी। पूरे किए गए पूर्वानुमान बने रहेंगे।","खेल जारी रखें","स्तरों पर लौटें"],
    ar:["مغادرة هذا التنبؤ؟","سيتم تجاهل الإجابة الحالية ومرات التحقق في {name}. ستبقى التنبؤات المكتملة محفوظة.","متابعة اللعب","العودة إلى المراحل"]
  };
  const signArtClass = (type) => `weather-art weather-${type}`;
  const plans = [
    { id: 1, name: "plan1", hint: "hint1", sequence: ["sun", "cloud", "sun"], answer: "cloud", shelter: "shelter1", rule: "rule1" },
    { id: 2, name: "plan2", hint: "hint2", sequence: ["rain", "cloud", "cloud"], answer: "rain", shelter: "shelter2", rule: "rule2" },
    { id: 3, name: "plan3", hint: "hint3", sequence: ["sun", "rain", "cloud"], answer: "sun", shelter: "shelter3", rule: "rule3" }
  ];
  const storedLocale = localStorage.getItem("weightplay-animal-weather-watch-locale");
  let locale = (routeLocaleMap[routeSegment] && locales[routeLocaleMap[routeSegment]]) ? routeLocaleMap[routeSegment] : storedLocale || "en";
  if (!locales[locale]) locale = "en";
  let sound = localStorage.getItem("weightplay-animal-weather-watch-sound") !== "off";
  let planIndex = 0; let selected = ""; let checks = 0; let sessionChecks = 0; let solved = new Set(); let feedback = ""; let currentScreen = "main";
  let frame = null; let pendingSettlement = null; let leaveOpen = false;
  const copy = (key, vars = {}) => Object.entries(vars).reduce((out, [name, value]) => out.replaceAll(`{${name}}`, String(value)), (locales[locale] || locales.en)[key] || locales.en[key] || key);
  const signName = (type) => copy(`sign${type[0].toUpperCase()}${type.slice(1)}`);
  const bestValue = () => Number(localStorage.getItem("weightplay-animal-weather-watch-best-v1") || 0) || "—";
  const announce = (name, data = {}) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: `animal_weather_watch_${name}`, forecast: planIndex + 1, checks, ...data }); };
  const challengeSelectors = [".battle-header", "#progressPill", "#prompt", "#rule", "#sequence", "#selection", "#choiceGrid", ".battle-actions", "#status"];
  function setChallengeHidden(hidden) { challengeSelectors.forEach((selector) => document.querySelectorAll(selector).forEach((node) => { node.hidden = hidden; })); }
  function show(screen) {
    currentScreen = screen;
    const scene = screen === "result" ? "battle" : screen;
    document.querySelectorAll("#app > [data-screen]").forEach((node) => { const active = node.dataset.screen === scene; node.hidden = !active; node.inert = !active; });
    const result = $("resultScreen"), live = $("weatherBattleLive"), isResult = screen === "result";
    if (result) { result.hidden = !isResult; result.inert = !isResult; }
    if (live) { live.hidden = isResult; live.inert = isResult || scene !== "battle"; }
    document.body.dataset.screen = scene; document.body.dataset.weatherState = screen;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"; document.body.dir = locale === "ar" ? "rtl" : "ltr";
    $("gameGuide").hidden = screen !== "main"; frame?.activate(scene, { covered: isResult });
    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[screen] ?? null;
      if (["result"].includes(screen) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if ((__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen; __wpNotifyMeasurement(); }
  }
  function mountInterface7() {
    if (!window.WeightPlayScreenFrame?.mount) throw Error("Interface 7 shared frame unavailable");
    const root = $("app"), mainRoot = $("mainScreen"), mainHeader = mainRoot.querySelector("header");
    const mainTitle = mainHeader.querySelector("[data-wp-game-title]"); mainTitle.dataset.wpFrameTitle = "";
    const poster = mainRoot.querySelector(".main-cover"); poster.dataset.wpFramePoster = "";
    const summary = mainRoot.querySelector(".main-summary"); summary.dataset.wpFrameSummary = "";
    $("mainProgress").dataset.wpFrameProgress = ""; $("startBtn").dataset.wpFrameAction = "primary";
    mainRoot.querySelector(".cover-badge")?.remove(); mainRoot.querySelector(".eyebrow")?.remove(); mainRoot.querySelector(".main-copy > h1")?.remove();
    $("mapBtn")?.remove(); $("best")?.remove(); $("settingsBtn")?.remove(); $("stageUtilityBtn")?.remove(); $("battleUtilityBtn")?.remove();
    const localeSelect = $("localeSelect"), retained = document.createElement("div");
    retained.hidden = true; retained.setAttribute("aria-hidden","true"); retained.append(localeSelect); root.append(retained); $("settingsPanel")?.remove();
    const stageRoot = $("stageScreen"), stageHeader = stageRoot.querySelector("header");
    let stageTitle = stageHeader.querySelector("[data-wp-frame-title]");
    if (!stageTitle) { stageTitle = document.createElement("strong"); stageTitle.dataset.wpFrameTitle = ""; stageHeader.append(stageTitle); }
    stageTitle.textContent = copy("title"); stageTitle.hidden = true;
    let workspace = $("stageWorkspace");
    if (!workspace) { workspace = document.createElement("div"); workspace.id = "stageWorkspace"; workspace.className = "stage-workspace"; const rail = $("stageList"); rail.before(workspace); workspace.append(rail); }
    const nav = stageRoot.querySelector(".stage-tabs"); nav.dataset.wpFrameStageNav = ""; nav.replaceChildren();
    const stageTab = document.createElement("button"); stageTab.id = "stagesTab"; stageTab.type = "button"; stageTab.setAttribute("role","tab"); stageTab.setAttribute("aria-selected","true"); stageTab.dataset.wpFrameAction = "tab"; stageTab.dataset.wpFrameStageSlot = "stages"; nav.append(stageTab); stageRoot.append(workspace, nav);
    const posterSrc = poster.currentSrc || poster.src; stageRoot.dataset.wpStageArt = posterSrc; stageRoot.style.setProperty("--wp-stage-art", 'url("' + posterSrc + '")');
    const battleRoot = $("battleScreen"), battleHeader = battleRoot.querySelector("header");
    let battleTitle = battleHeader.querySelector("[data-wp-frame-title]");
    if (!battleTitle) { battleTitle = document.createElement("strong"); battleTitle.dataset.wpFrameTitle = ""; battleHeader.append(battleTitle); }
    battleTitle.textContent = copy("title"); battleTitle.hidden = true;
    let live = $("weatherBattleLive");
    if (!live) { live = document.createElement("div"); live.id = "weatherBattleLive"; live.className = "weather-battle-live"; const result = $("resultScreen"); [...battleRoot.children].filter((node) => node !== battleHeader && node !== result).forEach((node) => live.append(node)); battleHeader.after(live); }
    const result = $("resultScreen"); result.dataset.wpBattleSubstate = "result"; result.hidden = true; result.inert = true;
    let leave = $("leaveDialog");
    if (!leave) {
      leave = document.createElement("section"); leave.id = "leaveDialog"; leave.className = "weather-leave-layer"; leave.hidden = true;
      leave.setAttribute("role","dialog"); leave.setAttribute("aria-modal","true"); leave.setAttribute("aria-labelledby","leaveDialogTitle");
      leave.innerHTML = '<div class="weather-leave-card"><h2 id="leaveDialogTitle"></h2><p id="leaveDialogText"></p><div class="weather-leave-actions"><button id="continueBtn" class="primary" type="button"></button><button id="leaveBtn" class="secondary" type="button"></button></div></div>';
      battleRoot.append(leave);
    }
    frame = window.WeightPlayScreenFrame.mount({root, scenes:{
      main:{root:mainRoot,header:mainHeader,content:mainRoot.querySelector(".main-copy")},
      stage:{root:stageRoot,header:stageHeader,content:workspace},
      battle:{root:battleRoot,header:battleHeader,content:live}
    }, localeSelect});
    return localeSelect;
  }
  function renderStatic() {
    document.documentElement.lang = locale; document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"; document.body.dir = locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = copy(node.dataset.i18n); });
    document.querySelector(".main-return")?.setAttribute("aria-label", copy("returnToWeightPlay"));
    $("backBtn").setAttribute("aria-label", copy("back")); $("stageBackBtn").setAttribute("aria-label", copy("back"));
    $("sequence").setAttribute("aria-label", copy("weatherSigns")); $("choiceGrid").setAttribute("aria-label", copy("nextWeatherSign")); $("localeSelect").value = locale;
    $("startBtn").textContent = START_LABELS[locale] || START_LABELS.en;
    const stageTab = $("stagesTab"); if (stageTab) { stageTab.textContent = STAGES_LABELS[locale] || STAGES_LABELS.en; stageTab.setAttribute("aria-label", stageTab.textContent); }
    const resultMap = $("resultMapBtn"); if (resultMap) resultMap.textContent = STAGES_LABELS[locale] || STAGES_LABELS.en;
    const replay = $("replayBtn"); if (replay) replay.textContent = REPLAY_LABELS[locale] || REPLAY_LABELS.en;
    renderLeaveCopy(); renderStages(); renderBattle(); renderResult(); frame?.refresh();
  }
  function renderStages() {
    const root = $("stageList"); if (!root) return;
    root.replaceChildren();
    plans.forEach((plan, index) => {
      const button = document.createElement("button");
      button.type = "button"; button.className = "stage-card"; button.setAttribute("aria-label", copy("enterForecast", { name: copy(plan.name) })); if (index === plans.length - 1) button.dataset.wpStageRecommended = "true";
      button.innerHTML = `<span><strong>${copy(plan.name)}</strong><small>${copy(plan.hint)}</small></span><span class="arrow" aria-hidden="true">${solved.has(index) ? "✓" : "→"}</span>`;
      button.addEventListener("click", () => startPlan(index, true)); root.appendChild(button);
    });
  }
  function startPlan(index, fromStage = false) { planIndex = index; selected = ""; checks = 0; feedback = ""; if (index === 0 || fromStage) sessionChecks = 0; show("battle"); renderBattle(); announce("start");
    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
}
  function renderBattle() {
    if (!$("choiceGrid") || currentScreen !== "battle") return;
    const plan = plans[planIndex]; $("progressPill").textContent = `${planIndex + 1} / ${plans.length}`; $("prompt").textContent = copy("prompt"); $("rule").textContent = copy(plan.rule);
    const sequence = $("sequence"); sequence.replaceChildren();
    plan.sequence.forEach((type) => { const item = document.createElement("div"); item.className = "sign"; item.setAttribute("role", "listitem"); item.innerHTML = `<span class="sign-icon ${signArtClass(type)}" aria-hidden="true">${signs[type]}</span><strong>${signName(type)}</strong>`; sequence.appendChild(item); });
    const next = document.createElement("div"); next.className = "sign next"; next.setAttribute("role", "listitem"); next.innerHTML = `<span class="sign-icon" aria-hidden="true">?</span><small aria-hidden="true">?</small>`; sequence.appendChild(next);
    $("selection").textContent = selected ? copy("selected", { name: signName(selected) }) : copy("selectPrompt");
    const root = $("choiceGrid"); root.replaceChildren();
    ["sun", "cloud", "rain"].forEach((type) => { const button = document.createElement("button"); button.type = "button"; button.className = "choice"; button.setAttribute("aria-label", signName(type)); button.setAttribute("aria-pressed", String(selected === type)); button.innerHTML = `<span class="sign-icon ${signArtClass(type)}" aria-hidden="true">${signs[type]}</span><strong>${signName(type)}</strong>`; button.addEventListener("click", () => { selected = type; feedback = ""; renderBattle(); }); root.appendChild(button); });
    $("checkBtn").disabled = !selected; $("status").textContent = feedback ? copy(feedback) : ""; $("status").className = feedback === "correct" ? "status good" : feedback === "wrong" ? "status try" : "status";
  }
  function cancelPendingSettlement() { if (!pendingSettlement) return; clearTimeout(pendingSettlement.timer); pendingSettlement = null; }
  function scheduleResult() {
    cancelPendingSettlement(); const pending = { remaining:280, started:performance.now(), timer:0, fire:null };
    pending.fire = () => { if (pendingSettlement !== pending) return; pendingSettlement = null; show("result"); renderResult(); };
    pending.timer = setTimeout(pending.fire, pending.remaining); pendingSettlement = pending;
  }
  function pausePendingSettlement() { const pending = pendingSettlement; if (!pending?.timer) return; clearTimeout(pending.timer); pending.remaining = Math.max(0, pending.remaining - (performance.now() - pending.started)); pending.timer = 0; }
  function resumePendingSettlement() { const pending = pendingSettlement; if (!pending || pending.timer) return; pending.started = performance.now(); pending.timer = setTimeout(pending.fire, pending.remaining); }
  function checkForecast() {
    if (!selected) return; checks += 1; sessionChecks += 1; const correct = selected === plans[planIndex].answer; feedback = correct ? "correct" : "wrong"; announce("check", { selected, correct });
    if (correct) { solved.add(planIndex); renderBattle(); scheduleResult(); } else renderBattle();
  }
  function renderResult() {
    if (!$("resultText")) return; const complete = solved.size === plans.length;
    if (complete) { const old = Number(localStorage.getItem("weightplay-animal-weather-watch-best-v1") || 0); if (!old || sessionChecks < old) localStorage.setItem("weightplay-animal-weather-watch-best-v1", String(sessionChecks)); }
    $("resultTitle").textContent = complete ? copy("resultTitle") : copy("resultLevel");
    $("resultText").textContent = copy("resultText", { count: solved.size, checks: sessionChecks, best: bestValue() });
    $("resultMapBtn").hidden = false; $("nextBtn").hidden = false; $("nextBtn").disabled = complete; $("replayBtn").hidden = false;
  }
  function nextPlan() { const nextIndex = planIndex + 1; if (nextIndex < plans.length) startPlan(nextIndex); else show("stage"); }
  function replayPlan() { startPlan(planIndex, false); }
  function renderLeaveCopy() {
    if (!$("leaveDialog")) return; const c = LEAVE_COPY[locale] || LEAVE_COPY.en;
    $("leaveDialogTitle").textContent = c[0]; $("leaveDialogText").textContent = c[1].replace("{name}", copy(plans[planIndex].name)); $("continueBtn").textContent = c[2]; $("leaveBtn").textContent = c[3];
  }
  function openLeave() {
    if (currentScreen !== "battle" || leaveOpen) return; leaveOpen = true; pausePendingSettlement(); renderLeaveCopy();
    $("weatherBattleLive").inert = true; $("leaveDialog").hidden = false; frame.activate("battle", { covered:true }); $("continueBtn").focus({preventScroll:true});
  }
  function closeLeave() {
    if (!leaveOpen) return; leaveOpen = false; $("leaveDialog").hidden = true; $("weatherBattleLive").inert = false; frame.activate("battle"); resumePendingSettlement(); $("backBtn").focus({preventScroll:true});
  }
  function confirmLeave() {
    if (!leaveOpen) return; cancelPendingSettlement(); leaveOpen = false; $("leaveDialog").hidden = true; $("weatherBattleLive").inert = false; selected = ""; checks = 0; feedback = ""; show("stage"); renderStages();
  }
  function goBack() {
    if (currentScreen === "battle") openLeave();
    else if (currentScreen === "result") { show("stage"); renderStages(); }
    else if (currentScreen === "stage") { show("main"); renderStatic(); }
  }
  function bind() {
    $("startBtn").addEventListener("click", () => { show("stage"); renderStages(); announce("start"); });
    $("resultMapBtn").addEventListener("click", () => { show("stage"); renderStages(); }); $("nextBtn").addEventListener("click", nextPlan); $("replayBtn").addEventListener("click", replayPlan);
    $("checkBtn").addEventListener("click", checkForecast);
    $("resetBtn").addEventListener("click", () => { selected = ""; checks = 0; feedback = ""; renderBattle(); announce("reset");
      __wpMeasurement.roundKey = {}; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.restart = true; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement(); });
    $("backBtn").addEventListener("click", goBack); $("stageBackBtn").addEventListener("click", goBack); $("continueBtn").addEventListener("click", closeLeave); $("leaveBtn").addEventListener("click", confirmLeave);
    $("localeSelect").addEventListener("change", (event) => { locale = event.target.value; localStorage.setItem("weightplay-animal-weather-watch-locale", locale); renderStatic(); });
    document.addEventListener("keydown", (event) => {
      if (!leaveOpen) return; if (event.key === "Escape") { event.preventDefault(); closeLeave(); return; } if (event.key !== "Tab") return;
      const actions = [$("continueBtn"), $("leaveBtn")].filter((node) => !node.disabled && !node.hidden), first = actions[0], last = actions[actions.length - 1];
      if (!actions.includes(document.activeElement)) { event.preventDefault(); first?.focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    });
  }
  function boot() { mountInterface7(); bind(); $("loading").hidden = true; $("app").hidden = false; show("main"); renderStatic(); announce("loaded"); }
  window.__ANIMAL_WEATHER_WATCH_TEST__ = { plans, startPlan, getState: () => ({ planIndex, selected, solved: [...solved], checks, screen: currentScreen }) };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
}());
