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
  // Authored observations: pattern, number of readings, editable positions.
  // Positions are stable save identities; no random templates masquerade as stages.
  const rows = [
    ["sc",4,[3]], ["rs",6,[5]], ["cr",6,[4]], ["sr",6,[1,5]], ["sccs",8,[2,7]],
    ["src",6,[5]], ["crs",6,[3]], ["rcs",6,[1,4]], ["scr",8,[6,7]], ["srcc",8,[3,5,7]],
    ["sscc",8,[6,7]], ["rrss",8,[4,5]], ["ccrr",8,[1,6]], ["ssrc",8,[5,7]], ["srrc",8,[2,4,7]],
    ["sc",6,[2]], ["src",6,[1]], ["scc",8,[2,5]], ["rrsc",8,[0,6]], ["scrr",8,[1,3,6]],
    ["sc",6,[3]], ["src",6,[4]], ["sscc",8,[2,6]], ["rrsc",8,[1,5]], ["scrr",8,[0,3,6]],
    ["sc",8,[1,4,7]], ["src",8,[0,4,7]], ["sscr",8,[2,5,7]], ["rrcs",8,[0,3,6]], ["scrs",8,[0,3,5,6]]
  ];
  const symbols = { s:"sun", c:"cloud", r:"rain" };
  const plans = rows.map(([pattern, length, slots], index) => ({
    id:index + 1, arc:Math.floor(index / 5), checkpoint:index % 5 === 4,
    pattern:[...pattern].map(s => symbols[s]), slots,
    sequence:Array.from({length}, (_, i) => symbols[pattern[i % pattern.length]]),
    repair:index >= 20 && index < 25
  }));
  const SAVE_KEY = "weightplay-animal-weather-watch-campaign-v2";
  const readStorage = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
  const writeStorage = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Session remains playable. */ } };
  let progress = { cleared:[], best:{} };
  try { const value = JSON.parse(readStorage(SAVE_KEY)); if (value && Array.isArray(value.cleared)) {
    progress.cleared = [...new Set(value.cleared.filter(n => Number.isInteger(n) && n >= 0 && n < plans.length))];
    for (const [key, best] of Object.entries(value.best || {})) if (/^\d+$/.test(key) && Number(key) < plans.length && Number.isInteger(best) && best > 0) progress.best[key] = best;
  } } catch { /* Ignore malformed data, preserve legacy keys. */ }
  const unlocked = () => Math.min(plans.length - 1, Math.max(readStorage("weightplay-animal-weather-watch-best-v1") ? 2 : 0, ...progress.cleared.map(n => n + 1)));
  const campaignCopy = (key, vars = {}) => Object.entries(vars).reduce((s,[k,v]) => s.replaceAll(`{${k}}`,String(v)), (window.WEATHER_WATCH_REBUILD[locale] || window.WEATHER_WATCH_REBUILD.en)[key]);
  const planName = (plan) => `${String(plan.id).padStart(2,"0")} · ${campaignCopy("arcs")[plan.arc]}${plan.checkpoint ? " ◆" : ""}`;
  const storedLocale = readStorage("weightplay-animal-weather-watch-locale");
  let locale = (routeLocaleMap[routeSegment] && locales[routeLocaleMap[routeSegment]]) ? routeLocaleMap[routeSegment] : storedLocale || "en";
  if (!locales[locale]) locale = "en";
  let sound = readStorage("weightplay-animal-weather-watch-sound") !== "off";
  let planIndex = 0; let selected = ""; let checks = 0; let sessionChecks = 0; let solved = new Set(); let feedback = ""; let currentScreen = "main";
  let frame = null; let stageRailController = null; let pendingSettlement = null; let leaveOpen = false;
  let answers = {}; let activeSlot = 0; let hintOpen = false; let settled = false;
  solved = new Set(progress.cleared);
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
    const battleHeaderInfo = $("battleHeaderInfo"); if (battleHeaderInfo) battleHeaderInfo.hidden = isResult;
    document.body.dataset.screen = scene; document.body.dataset.weatherState = screen;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"; document.body.dir = locale === "ar" ? "rtl" : "ltr";
    $("gameGuide").hidden = screen !== "main"; frame?.activate(scene, { covered: isResult });
    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[screen] ?? null;
      if (["result"].includes(screen) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if ((__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen; __wpNotifyMeasurement(); }
  }
  function mountInterface9() {
    if (!window.WeightPlayScreenFrame?.mount || !window.WeightPlayPlayUI?.mountStage) throw Error("Interface 9 shared play UI unavailable");
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
    frame = window.WeightPlayScreenFrame.mount({root, playUI:true, scenes:{
      main:{root:mainRoot,header:mainHeader,content:mainRoot.querySelector(".main-copy")},
      stage:{root:stageRoot,header:stageHeader,content:workspace},
      battle:{root:battleRoot,header:battleHeader,content:live,headerInfo:$("battleHeaderInfo")}
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
    document.querySelector(".main-summary").textContent = campaignCopy("intro");
    $("mainProgress").textContent = campaignCopy("progress", {count:solved.size});
  }
  function renderStages() {
    const page = $("stageWorkspace"), rail = $("stageList"); if (!page || !rail) return;
    const stageData = (index) => {
      const plan = plans[index], locked = index > unlocked(), cleared = solved.has(index);
      return {
        id: plan.id,
        kicker: plan.checkpoint ? campaignCopy("checkpoint") : campaignCopy("case"),
        title: planName(plan),
        subtitle: campaignCopy("tasks")[plan.repair ? 2 : plan.arc >= 3 ? 1 : 0],
        status: locked ? campaignCopy("locked") : cleared ? `${campaignCopy("cleared")} · ${campaignCopy("best",{count:progress.best[index] || "—"})}` : campaignCopy("ready"),
        summary: campaignCopy("rules")[plan.arc],
        details: [campaignCopy("instruction"), campaignCopy("rules")[plan.arc]],
        locked,
        cleared,
      };
    };
    const config = {
      gameId: "animal-weather-watch",
      poster: "/assets/interface7-redrawn/animal-weather-watch.webp",
      background: "/assets/lobby-block-atmosphere.svg",
      count: plans.length,
      stage: stageData,
    };
    if (!stageRailController) {
      stageRailController = window.WeightPlayPlayUI.mountStage({
        page,
        rail,
        config,
        selected: unlocked(),
        onStart: (index) => startPlan(index, true),
        isActive: () => frame?.active === "stage",
      });
      if (!stageRailController) throw Error("Interface 9 shared Stage selector could not initialize");
    } else stageRailController.refresh(unlocked());
  }
  function startPlan(index, fromStage = false) { if (!plans[index] || index > unlocked()) return; cancelPendingSettlement(); planIndex = index; selected = ""; checks = 0; feedback = ""; answers = {}; activeSlot = plans[index].slots[0]; hintOpen = false; settled = false;
    if (plans[index].repair) plans[index].slots.forEach(slot => { const types = ["sun","cloud","rain"]; answers[slot] = types[(types.indexOf(plans[index].sequence[slot]) + 1) % 3]; });
    if (index === 0 || fromStage) sessionChecks = 0; show("battle"); renderBattle(); announce("start");
    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
}
  function renderBattle() {
    if (!$("choiceGrid") || currentScreen !== "battle") return;
    const plan = plans[planIndex]; $("progressPill").textContent = `${planIndex + 1} / ${plans.length}`; $("progressPill").setAttribute("aria-label", `${planName(plan)} · ${planIndex + 1} / ${plans.length}`);
    $("prompt").textContent = campaignCopy("tasks")[plan.repair ? 2 : plan.arc >= 3 ? 1 : 0];
    $("rule").textContent = hintOpen ? campaignCopy("rules")[plan.arc] + " (" + plan.pattern.map(signName).join(" → ") + ")" : campaignCopy("instruction");
    $("hintBtn").textContent = campaignCopy(hintOpen ? "hideHint" : "hint"); $("hintBtn").setAttribute("aria-pressed", String(hintOpen));
    $("checkBtn").textContent = campaignCopy("check"); $("resetBtn").textContent = campaignCopy("reset");
    const sequence = $("sequence"); sequence.replaceChildren();
    sequence.dataset.feedback = feedback; sequence.classList.toggle("show-groups", hintOpen);
    plan.sequence.forEach((expected, i) => {
      const editable = plan.slots.includes(i), type = editable ? answers[i] : expected;
      const item = document.createElement(editable ? "button" : "div");
      item.className = `sign${editable ? " editable" : ""}${editable && i === activeSlot ? " active-slot" : ""}${feedback === "wrong" && editable && type !== expected ? " mismatch" : ""}`;
      item.style.setProperty("--group", i % plan.pattern.length); item.dataset.position = i;
      if (editable) { item.type = "button"; item.disabled = settled; item.setAttribute("aria-pressed",String(i === activeSlot)); item.setAttribute("aria-label",campaignCopy("slot",{count:i+1}) + ": " + (type ? signName(type) : "?")); item.addEventListener("click",()=> { activeSlot=i; renderBattle(); }); }
      else item.setAttribute("role","listitem");
      item.innerHTML = `<small class="reading-number">${String(i + 1).padStart(2,"0")}</small><span class="sign-icon ${type ? signArtClass(type) : "unknown"}" aria-hidden="true">${type ? signs[type] : "?"}</span><strong>${type ? signName(type) : "?"}</strong><span class="cycle-mark" aria-hidden="true">${i % plan.pattern.length + 1}</span>`;
      sequence.appendChild(item);
    });
    $("selection").textContent = campaignCopy("slot",{count:activeSlot+1}) + " · " + campaignCopy("choose");
    const root = $("choiceGrid"); root.replaceChildren();
    ["sun", "cloud", "rain"].forEach((type) => { const button = document.createElement("button"); button.type = "button"; button.className = "choice"; button.disabled = settled; button.setAttribute("aria-label", signName(type)); button.setAttribute("aria-pressed", String(answers[activeSlot] === type)); button.innerHTML = `<span class="sign-icon ${signArtClass(type)}" aria-hidden="true">${signs[type]}</span><strong>${signName(type)}</strong>`; button.addEventListener("click", () => placeSign(type)); root.appendChild(button); });
    $("checkBtn").disabled = settled || plan.slots.some(slot => !answers[slot]); $("resetBtn").disabled = settled; $("hintBtn").disabled = settled;
    $("status").textContent = feedback ? campaignCopy(feedback === "wrong" ? "wrong" : "correct") : campaignCopy("checks",{count:checks}); $("status").className = feedback === "correct" ? "status good" : feedback === "wrong" ? "status try" : "status";
  }
  function placeSign(type) { if (settled || leaveOpen || currentScreen !== "battle") return; answers[activeSlot] = type; selected = type; feedback = ""; window.WeightPlayAudio?.play("card.place"); const empty = plans[planIndex].slots.find(slot => !answers[slot]); if (empty !== undefined) activeSlot = empty; renderBattle(); }
  function cancelPendingSettlement() { if (!pendingSettlement) return; clearTimeout(pendingSettlement.timer); pendingSettlement = null; }
  function scheduleResult() {
    cancelPendingSettlement(); const pending = { remaining:650, started:performance.now(), timer:0, fire:null };
    pending.fire = () => { if (pendingSettlement !== pending) return; pendingSettlement = null; show("result"); renderResult(); };
    pending.timer = setTimeout(pending.fire, pending.remaining); pendingSettlement = pending;
  }
  function pausePendingSettlement() { const pending = pendingSettlement; if (!pending?.timer) return; clearTimeout(pending.timer); pending.remaining = Math.max(0, pending.remaining - (performance.now() - pending.started)); pending.timer = 0; }
  function resumePendingSettlement() { const pending = pendingSettlement; if (!pending || pending.timer) return; pending.started = performance.now(); pending.timer = setTimeout(pending.fire, pending.remaining); }
  function checkForecast() {
    const plan = plans[planIndex]; if (settled || leaveOpen || plan.slots.some(slot=>!answers[slot])) return;
    checks += 1; sessionChecks += 1; const correct = plan.slots.every(slot => answers[slot] === plan.sequence[slot]); feedback = correct ? "correct" : "wrong"; announce("check", { selected, correct });
    window.WeightPlayAudio?.play(correct ? "feedback.success" : "feedback.error");
    if (correct) { settled = true; solved.add(planIndex); progress.cleared = [...solved]; progress.best[planIndex] = Math.min(progress.best[planIndex] || Infinity, checks); writeStorage(SAVE_KEY,JSON.stringify(progress)); renderBattle(); scheduleResult(); } else { hintOpen = true; activeSlot = plan.slots.find(slot=>answers[slot] !== plan.sequence[slot]); renderBattle(); }
  }
  function renderResult() {
    if (!$("resultText")) return; const complete = solved.size === plans.length;
    $("resultTitle").textContent = campaignCopy(complete ? "final" : "success");
    $("resultText").textContent = `${planName(plans[planIndex])} · ${campaignCopy("checks",{count:checks})} · ${campaignCopy("best",{count:progress.best[planIndex] || "—"})}`;
    $("resultReason").textContent = campaignCopy("rules")[plans[planIndex].arc];
    $("resultProgress").textContent = campaignCopy("progress",{count:solved.size});
    $("resultMapBtn").hidden = false; $("nextBtn").hidden = false; $("nextBtn").disabled = planIndex >= plans.length - 1; $("replayBtn").hidden = false;
  }
  function nextPlan() { const nextIndex = planIndex + 1; if (nextIndex < plans.length) startPlan(nextIndex); else show("stage"); }
  function replayPlan() { startPlan(planIndex, false); }
  function renderLeaveCopy() {
    if (!$("leaveDialog")) return; const c = LEAVE_COPY[locale] || LEAVE_COPY.en;
    $("leaveDialogTitle").textContent = c[0]; $("leaveDialogText").textContent = c[1].replace("{name}", planName(plans[planIndex])); $("continueBtn").textContent = c[2]; $("leaveBtn").textContent = c[3];
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
    $("hintBtn").addEventListener("click", () => { hintOpen = !hintOpen; renderBattle(); });
    $("resetBtn").addEventListener("click", () => { if (settled) return; selected = ""; answers = {}; activeSlot = plans[planIndex].slots[0]; feedback = ""; renderBattle(); announce("reset");
      __wpMeasurement.roundKey = {}; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.restart = true; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement(); });
    $("backBtn").addEventListener("click", goBack); $("stageBackBtn").addEventListener("click", goBack); $("continueBtn").addEventListener("click", closeLeave); $("leaveBtn").addEventListener("click", confirmLeave);
    $("localeSelect").addEventListener("change", (event) => { locale = event.target.value; writeStorage("weightplay-animal-weather-watch-locale", locale); renderStatic(); });
    document.addEventListener("keydown", (event) => {
      if (!leaveOpen) { if (currentScreen !== "battle" || settled || event.target.closest("button,select,input")) return; if (["1","2","3"].includes(event.key)) { event.preventDefault(); placeSign(["sun","cloud","rain"][Number(event.key)-1]); } else if (event.key === "Enter") { event.preventDefault(); checkForecast(); } else if (["ArrowLeft","ArrowRight"].includes(event.key)) { event.preventDefault(); const slots=plans[planIndex].slots, direction=event.key === "ArrowRight" ? 1 : -1; activeSlot=slots[(slots.indexOf(activeSlot)+direction+slots.length)%slots.length]; renderBattle(); } return; } if (event.key === "Escape") { event.preventDefault(); closeLeave(); return; } if (event.key !== "Tab") return;
      const actions = [$("continueBtn"), $("leaveBtn")].filter((node) => !node.disabled && !node.hidden), first = actions[0], last = actions[actions.length - 1];
      if (!actions.includes(document.activeElement)) { event.preventDefault(); first?.focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    });
  }
  function boot() { mountInterface9(); bind(); $("app").hidden = false; show("main"); renderStatic(); announce("loaded"); }
  window.__ANIMAL_WEATHER_WATCH_TEST__ = { plans, startPlan, getState: () => ({ planIndex, selected, solved: [...solved], checks, screen: currentScreen }) };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
}());
