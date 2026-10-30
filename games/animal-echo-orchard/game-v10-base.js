(function () {
  "use strict";
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete", stageId: null, saveSucceeded: false };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((__wpMeasurement.screen) === "battle" && (__wpMeasurement.ended)) ? null : (__wpMeasurement.screen), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(false), node: document.body, stageIdAuthoritative: true, stageId: __wpMeasurement.stageId,
    activityMode: "input", idleSeconds: 300
  });
  function __wpNotifyMeasurement() {
    try {
      const analytics = window.WonderAnalytics;
      if (analytics?.game?.supportsSavedCompletionGate !== true) return;
      analytics.game.observeState(__wpReadMeasurement);
      if (__wpMeasurement.ended && __wpMeasurement.saveSucceeded && __wpMeasurement.stageId != null) analytics.completeStage?.(__wpMeasurement.stageId);
    } catch { /* Optional telemetry must never interrupt play. */ }
  }
  // Explicit authored replay actions count only when a new round was actually created.
  function __wpReplayStart(action) {
    const previous = __wpMeasurement.roundKey, value = action();
    if (__wpMeasurement.roundKey !== previous) { __wpMeasurement.restart = true; __wpNotifyMeasurement(); }
    return value;
  }
  window.addEventListener("weightplay:analytics-ready", __wpNotifyMeasurement);
  __wpNotifyMeasurement();

  const $ = (id) => document.getElementById(id);
  const locales = window.ECHO_ORCHARD_LOCALES || {};
  const stageCopy = {
    en: { stage: "Stage", arc: "Arc", checkpoint: "Checkpoint", locked: "Unlock the previous stage first", complete: "Complete", focus: ["order", "alternation", "repetition", "rhythm", "symmetry", "mastery"], arcs: ["Dawn Canopy", "Lantern Bend", "Creek Crossing", "Wind Garden", "Stone Circle", "Moon Crown"], result: "{count} of {total} stages answered. This stage took {attempts} tap attempts.", resultAll: "All {total} stages answered. Your fewest full-orchard taps: {best}." },
    "zh-Hant": { stage: "關卡", arc: "篇章", checkpoint: "檢查點", locked: "先完成前一關即可解鎖", complete: "已完成", focus: ["順序", "交替", "重複", "節奏", "對稱", "熟練"], arcs: ["晨曦樹冠", "燈籠轉角", "溪流渡口", "風之花園", "石環", "月冠"], result: "已回應 {count} / {total} 關。這關用了 {attempts} 次按鍵。", resultAll: "已回應全部 {total} 關。整座果園最少按鍵：{best}。" },
    "zh-Hans": { stage: "关卡", arc: "篇章", checkpoint: "检查点", locked: "先完成前一关即可解锁", complete: "已完成", focus: ["顺序", "交替", "重复", "节奏", "对称", "熟练"], arcs: ["晨曦树冠", "灯笼转角", "溪流渡口", "风之花园", "石环", "月冠"], result: "已回应 {count} / {total} 关。这关用了 {attempts} 次按键。", resultAll: "已回应全部 {total} 关。整座果园最少按键：{best}。" },
    ja: { stage: "ステージ", arc: "章", checkpoint: "チェックポイント", locked: "前のステージを完了すると解除", complete: "完了", focus: ["順番", "交互", "反復", "リズム", "対称", "熟練"], arcs: ["夜明けの樹冠", "灯りの曲がり角", "小川の渡し", "風の庭", "石の輪", "月の冠"], result: "{total}ステージ中 {count}ステージを完了。このステージは {attempts} 回タップしました。", resultAll: "{total}ステージをすべて完了。果樹園の最少タップ数：{best}。" },
    ko: { stage: "스테이지", arc: "장", checkpoint: "체크포인트", locked: "이전 스테이지를 완료하면 해제돼요", complete: "완료", focus: ["순서", "교대", "반복", "리듬", "대칭", "숙련"], arcs: ["새벽 나무관", "등불 모퉁이", "개울 건너기", "바람 정원", "돌 원", "달의 왕관"], result: "스테이지 {total}개 중 {count}개 완료. 이 스테이지에서 {attempts}번 눌렀어요.", resultAll: "스테이지 {total}개를 모두 완료했어요. 과수원 최소 누르기: {best}." },
    es: { stage: "Etapa", arc: "Arco", checkpoint: "Punto de control", locked: "Completa la etapa anterior para desbloquearla", complete: "Completada", focus: ["orden", "alternancia", "repetición", "ritmo", "simetría", "maestría"], arcs: ["Copa del alba", "Curva de faroles", "Cruce del arroyo", "Jardín del viento", "Círculo de piedra", "Corona lunar"], result: "{count} de {total} etapas respondidas. Esta etapa necesitó {attempts} toques.", resultAll: "Las {total} etapas respondidas. Menos toques del huerto: {best}." },
    "pt-BR": { stage: "Fase", arc: "Arco", checkpoint: "Ponto de controle", locked: "Conclua a fase anterior para desbloquear", complete: "Concluída", focus: ["ordem", "alternância", "repetição", "ritmo", "simetria", "maestria"], arcs: ["Copa do amanhecer", "Curva das lanternas", "Travessia do riacho", "Jardim do vento", "Círculo de pedra", "Coroa lunar"], result: "{count} de {total} fases respondidas. Esta fase levou {attempts} toques.", resultAll: "Todas as {total} fases respondidas. Menos toques no pomar: {best}." },
    fr: { stage: "Étape", arc: "Arc", checkpoint: "Point de contrôle", locked: "Termine l'étape précédente pour déverrouiller", complete: "Terminée", focus: ["ordre", "alternance", "répétition", "rythme", "symétrie", "maîtrise"], arcs: ["Cime de l'aube", "Virage des lanternes", "Passage du ruisseau", "Jardin du vent", "Cercle de pierre", "Couronne lunaire"], result: "{count} étape(s) sur {total} réussie(s). Cette étape a demandé {attempts} touches.", resultAll: "Les {total} étapes sont réussies. Minimum de touches du verger : {best}." },
    de: { stage: "Stufe", arc: "Bogen", checkpoint: "Kontrollpunkt", locked: "Schließe zuerst die vorige Stufe ab", complete: "Geschafft", focus: ["Reihenfolge", "Wechsel", "Wiederholung", "Rhythmus", "Symmetrie", "Meisterschaft"], arcs: ["Morgenkrone", "Laternenkurve", "Bachübergang", "Windgarten", "Steinkreis", "Mondkrone"], result: "{count} von {total} Stufen geschafft. Diese Stufe brauchte {attempts} Tipps.", resultAll: "Alle {total} Stufen geschafft. Wenigste Tipps im Obstgarten: {best}." },
    it: { stage: "Fase", arc: "Arco", checkpoint: "Punto di controllo", locked: "Completa la fase precedente per sbloccare", complete: "Completata", focus: ["ordine", "alternanza", "ripetizione", "ritmo", "simmetria", "maestria"], arcs: ["Chioma dell'alba", "Curva delle lanterne", "Attraversamento del ruscello", "Giardino del vento", "Cerchio di pietra", "Corona lunare"], result: "{count} fasi su {total} completate. Questa fase ha richiesto {attempts} tocchi.", resultAll: "Tutte le {total} fasi completate. Tocchi minimi nel frutteto: {best}." },
    ru: { stage: "Этап", arc: "Глава", checkpoint: "Контрольная точка", locked: "Сначала завершите предыдущий этап", complete: "Готово", focus: ["порядок", "чередование", "повтор", "ритм", "симметрия", "мастерство"], arcs: ["Крона рассвета", "Поворот фонариков", "Переправа через ручей", "Сад ветра", "Каменный круг", "Лунная корона"], result: "Этапов готово: {count} из {total}. На этот этап ушло нажатий: {attempts}.", resultAll: "Все {total} этапов готовы. Минимум нажатий в саду: {best}." },
    hi: { stage: "चरण", arc: "अध्याय", checkpoint: "जाँच बिंदु", locked: "पहले पिछला चरण पूरा करके खोलें", complete: "पूरा", focus: ["क्रम", "बारी", "दोहराव", "लय", "सममिति", "कौशल"], arcs: ["भोर का वृक्ष", "दीपों का मोड़", "धारा पार", "हवा का बाग़", "पत्थर का घेरा", "चाँद का मुकुट"], result: "{total} में से {count} चरण पूरे। इस चरण में {attempts} टैप लगे।", resultAll: "सभी {total} चरण पूरे। पूरे बाग़ में सबसे कम टैप: {best}।" },
    ar: { stage: "المرحلة", arc: "الفصل", checkpoint: "نقطة تحقق", locked: "أكمل المرحلة السابقة لفتحها", complete: "مكتملة", focus: ["الترتيب", "التناوب", "التكرار", "الإيقاع", "التناظر", "الإتقان"], arcs: ["تاج الفجر", "منعطف الفوانيس", "عبور الجدول", "حديقة الريح", "حلقة الحجارة", "تاج القمر"], result: "أكملت {count} من {total} مراحل. احتاجت هذه المرحلة إلى {attempts} نقرات.", resultAll: "أكملت المراحل الـ{total} كلها. أقل عدد نقرات في البستان: {best}." }
  };
  const stageSpecs = [
    ["amber", "mint", "coral"], ["mint", "coral", "amber", "violet"], ["coral", "amber", "coral", "mint"], ["violet", "mint", "amber", "coral", "mint"], ["amber", "violet", "mint", "coral", "amber"],
    ["mint", "amber", "violet", "coral", "violet", "mint"], ["coral", "coral", "mint", "amber", "violet"], ["violet", "amber", "mint", "amber", "coral", "violet"], ["amber", "coral", "violet", "mint", "coral", "amber"], ["mint", "violet", "mint", "coral", "amber", "coral", "violet"],
    ["coral", "mint", "amber", "violet", "amber", "mint", "coral"], ["violet", "coral", "mint", "amber", "violet", "coral", "mint"], ["amber", "amber", "coral", "violet", "mint", "coral", "violet"], ["mint", "coral", "mint", "amber", "violet", "amber", "coral", "mint"], ["coral", "violet", "amber", "mint", "coral", "amber", "violet", "mint"],
    ["violet", "mint", "coral", "amber", "coral", "mint", "amber", "violet"], ["amber", "coral", "amber", "violet", "mint", "coral", "mint", "violet"], ["mint", "violet", "coral", "mint", "amber", "violet", "amber", "coral"], ["coral", "amber", "violet", "coral", "mint", "amber", "mint", "violet"], ["amber", "mint", "violet", "coral", "amber", "violet", "mint", "coral", "amber"],
    ["mint", "coral", "amber", "mint", "violet", "coral", "amber", "violet", "mint"], ["violet", "amber", "violet", "mint", "coral", "amber", "coral", "mint", "violet"], ["coral", "mint", "amber", "coral", "violet", "mint", "amber", "mint", "coral"], ["amber", "violet", "coral", "mint", "amber", "coral", "violet", "mint", "amber"], ["mint", "amber", "mint", "coral", "violet", "coral", "amber", "violet", "mint"],
    ["coral", "violet", "mint", "amber", "violet", "coral", "mint", "amber", "coral", "violet"], ["violet", "mint", "amber", "coral", "mint", "violet", "amber", "coral", "amber", "mint"], ["amber", "coral", "violet", "amber", "mint", "coral", "violet", "mint", "amber", "coral"], ["mint", "violet", "coral", "mint", "amber", "violet", "coral", "amber", "mint", "violet"], ["coral", "amber", "mint", "violet", "coral", "mint", "amber", "violet", "mint", "coral", "amber"]
  ];
  const checkpointIds = new Set([5, 10, 15, 20, 25, 30]);
  const groves = stageSpecs.map((pattern, index) => ({ id: index + 1, arc: Math.floor(index / 5) + 1, focus: Math.min(5, Math.floor(index / 5)), checkpoint: checkpointIds.has(index + 1), pattern }));
  const fruits = ["amber", "mint", "coral", "violet"];
  const routeLocale = document.documentElement.lang && document.documentElement.lang !== "en" ? document.documentElement.lang : "";
  let locale = routeLocale || localStorage.getItem("weightplay-echo-orchard-locale") || "en";
  if (!locales[locale]) locale = "en";
  let sound = !window.WeightPlayAudio.isMuted();
  window.addEventListener("weightplay:audio-volume-change", () => { sound = !window.WeightPlayAudio.isMuted(); });
  let runSolved = new Set();
  let playbackGeneration = 0; let noteHandle = null; let watchStep = 0;
  let groveIndex = 0; let phase = "main"; let entered = []; let attempts = 0; let sessionAttempts = 0; let litFruit = ""; let timer = null; let feedback = "";
  let unlockedThrough = Math.max(1, Math.min(groves.length, Number(localStorage.getItem("weightplay-echo-orchard-unlocked-v2") || 1) || 1));
  let solved = new Set();
  try { solved = new Set(JSON.parse(localStorage.getItem("weightplay-echo-orchard-solved-v2") || "[]").filter((value) => Number.isInteger(value) && value >= 0 && value < groves.length)); } catch { solved = new Set(); }
  const solvedKey = "weightplay-echo-orchard-solved-v2";
  const confirmedPrefix = "weightplay-echo-orchard-confirmed-stage-v1:";
  const pendingSavedStages = new Set();
  let lastSaveSucceeded = false;
  const saveFailureCopy = {
    en: "Progress could not be saved. Replay this stage when storage is available.",
    "zh-Hant": "無法儲存進度，儲存空間可用時請重玩此關。",
    "zh-Hans": "无法保存进度，存储空间可用时请重玩此关。",
    ja: "進行状況を保存できませんでした。保存可能になったらこのステージを再プレイしてください。",
    ko: "진행 상황을 저장하지 못했어요. 저장할 수 있을 때 이 스테이지를 다시 플레이해 주세요.",
    es: "No se pudo guardar el progreso. Repite la etapa cuando haya almacenamiento disponible.",
    "pt-BR": "Não foi possível salvar o progresso. Jogue a fase novamente quando houver armazenamento disponível.",
    fr: "Impossible de sauvegarder la progression. Rejouez cette étape lorsque le stockage sera disponible.",
    de: "Der Fortschritt konnte nicht gespeichert werden. Spiele diese Stufe erneut, sobald Speicher verfügbar ist.",
    it: "Impossibile salvare i progressi. Rigioca il livello quando lo spazio sarà disponibile.",
    ru: "Не удалось сохранить прогресс. Повторите этап, когда хранилище станет доступно.",
    hi: "प्रगति सहेजी नहीं जा सकी। संग्रहण उपलब्ध होने पर यह चरण फिर खेलें।",
    ar: "تعذر حفظ التقدم. أعد المرحلة عندما تتوفر مساحة التخزين."
  };
  const validSolved = value => Array.isArray(value) && value.every(index => Number.isInteger(index) && index >= 0 && index < groves.length);
  function restoreConfirmedStages() {
    try {
      const raw = localStorage.getItem(solvedKey), saved = raw === null ? [] : JSON.parse(raw);
      if (!validSolved(saved)) return;
      const merged = new Set(saved);
      for (let id = 1; id <= groves.length; id++) {
        if (localStorage.getItem(confirmedPrefix + id) === "1") { merged.add(id - 1); pendingSavedStages.add(id); }
      }
      const bytes = JSON.stringify([...merged].sort((a, b) => a - b));
      if ([...merged].some(index => !saved.includes(index))) localStorage.setItem(solvedKey, bytes);
      const verified = JSON.parse(localStorage.getItem(solvedKey) || "[]");
      if (!validSolved(verified) || [...merged].some(index => !verified.includes(index))) return;
      solved = new Set(verified);
      for (const index of solved) unlockedThrough = Math.max(unlockedThrough, Math.min(groves.length, index + 2));
    } catch { /* Preserve unreadable or unwritable progress. */ }
  }
  function rememberSolvedStage(id) {
    pendingSavedStages.add(id);
    try { localStorage.setItem(confirmedPrefix + id, "1"); } catch { /* Keep the in-page queue. */ }
  }
  function flushSavedStageRewards() {
    const castle = window.WeightPlayCastle;
    if (!castle?.read) return;
    try {
      const saved = JSON.parse(localStorage.getItem(solvedKey) || "[]");
      if (!validSolved(saved)) return;
      for (const id of pendingSavedStages) {
        if (!saved.includes(id - 1)) continue;
        const receipt = `animal-echo-orchard:stage-${id}`;
        if (!Object.hasOwn(castle.read()?.completions || {}, receipt)) window.dispatchEvent(new CustomEvent("weightplay:game-completed", { detail: { gameId: "animal-echo-orchard", stageId: id, outcome: "win" } }));
        if (Object.hasOwn(castle.read()?.completions || {}, receipt)) pendingSavedStages.delete(id);
      }
    } catch { /* Retry on a later visit or collector readiness. */ }
  }
  window.addEventListener("weightplay:castle-ready", flushSavedStageRewards);
  restoreConfirmedStages(); flushSavedStageRewards();
  const copy = (key, vars = {}) => Object.entries(vars).reduce((out, [name, value]) => out.replaceAll(`{${name}}`, String(value)), (locales[locale] || locales.en)[key] || locales.en[key] || key);
  const campaign = () => stageCopy[locale] || stageCopy.en;
  const stageTitle = (index) => `${campaign().arcs[groves[index].arc - 1]} · ${campaign().stage} ${groves[index].id}`;
  const stageHint = (index) => `${campaign().focus[groves[index].focus]} · ${groves[index].checkpoint ? campaign().checkpoint : campaign().arc + " " + groves[index].arc}`;
  const canAccess = (index) => index < unlockedThrough || solved.has(index);
  const stageRecord = (index) => {
    const grove = groves[index];
    const locked = !canAccess(index);
    const cleared = solved.has(index);
    return {
      id: `grove-${grove.id}`,
      kicker: `${campaign().arc} ${grove.arc}`,
      title: `${campaign().stage} ${grove.id}`,
      subtitle: stageTitle(index),
      status: cleared ? campaign().complete : locked ? campaign().locked : "",
      summary: stageHint(index),
      details: "",
      locked,
      cleared,
      poster: "/assets/interface7-redrawn/animal-echo-orchard.webp",
      posterPosition: "center"
    };
  };
  const stageSummary = () => `${copy("groves")}: ${solved.size} / ${groves.length}`;
  const saveProgress = index => {
    try {
      const raw = localStorage.getItem(solvedKey), saved = raw === null ? [] : JSON.parse(raw);
      if (!validSolved(saved)) return false;
      const merged = [...new Set([...saved, index])].sort((a, b) => a - b);
      if (!saved.includes(index)) {
        const bytes = JSON.stringify(merged);
        localStorage.setItem(solvedKey, bytes);
        if (localStorage.getItem(solvedKey) !== bytes) return false;
      }
      solved = new Set(merged);
      unlockedThrough = Math.max(unlockedThrough, Math.min(groves.length, index + 2));
      try {
        const oldUnlocked = Number(localStorage.getItem("weightplay-echo-orchard-unlocked-v2")) || 1;
        localStorage.setItem("weightplay-echo-orchard-unlocked-v2", String(Math.max(oldUnlocked, unlockedThrough)));
      } catch { /* Solved stages recover the unlock on the next visit. */ }
      return true;
    } catch { return false; }
  };
  const bestValue = () => Number(localStorage.getItem("weightplay-echo-orchard-best-v1") || 0) || "—";
  const fruitName = (fruit) => copy(`fruit${fruit[0].toUpperCase()}${fruit.slice(1)}`);
  const announce = (name, data = {}) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: `echo_orchard_${name}`, grove: groveIndex + 1, attempts, ...data }); };
  function syncSharedSound(event) {
    const effectsVolume = Number(event.detail?.effectsVolume);
    if (!Number.isFinite(effectsVolume)) return;
    sound = window.WeightPlayAudio.setEnabled(effectsVolume > 0);
    localStorage.setItem("weightplay-echo-orchard-sound", sound ? "on" : "off");
    renderStatic();
  }
  function setSoundEnabled(enabled) {
    sound = window.WeightPlayAudio.setEnabled(Boolean(enabled));
    localStorage.setItem("weightplay-echo-orchard-sound", sound ? "on" : "off");
    if (window.WeightPlayAudio && window.WeightPlayAudio.isMuted() === sound) window.WeightPlayAudio.setMuted(!sound);
    renderStatic();
  }
  function show(screen) {
    phase = screen;
    const scene = screen === "result" ? "battle" : screen;
    document.body.dataset.screen = screen;
    document.querySelectorAll("[data-screen]:not(body)").forEach((node) => { node.hidden = node.dataset.screen !== scene; });
    const result = $("resultScreen");
    if (result) result.hidden = screen !== "result";
    const play = $("battleScreen")?.querySelector(".echo-content-host");
    if (play) { play.hidden = screen === "result"; play.inert = screen === "result"; }
    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[screen] ?? null;
      if (["result"].includes(screen) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
    window.dispatchEvent(new CustomEvent("weightplay:orchard-screen-change", { detail: { screen, scene } }));
  }
  function syncGuide() {
    const sections = document.querySelectorAll("[data-wp-game-guide] .game-info-sections > .game-info-section");
    const system = sections[1]?.querySelector("p");
    const steps = sections[2]?.querySelector("p");
    if (system) system.textContent = `${copy("readyHelp")} ${copy("retryHelp")}`;
    if (steps) steps.textContent = `${copy("readyHelp")} ${copy("repeatHelp")} ${copy("keyboardHelp")}`;
    const wrong = sections[7]?.querySelectorAll("dd")[2];
    if (wrong) wrong.textContent = copy("retryHelp");
  }
  function renderStatic() {
    const isArabic = locale === "ar";
    document.documentElement.lang = locale;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = copy(node.dataset.i18n); });
    $("backBtn")?.setAttribute("aria-label", copy("close"));
    $("stageBack")?.setAttribute("aria-label", copy("close"));
    $("stageList")?.setAttribute("aria-label", copy("groves"));
    $("battleBackBtn")?.setAttribute("aria-label", copy("close"));
    $("patternSlots")?.setAttribute("aria-label", copy("pattern"));
    $("orchardButtons")?.setAttribute("aria-label", copy("fruits"));
    $("localeSelect")?.setAttribute("aria-label", copy("language"));
    $("best").textContent = copy("best", { best: bestValue() });
    $("mainProgressText").textContent = stageSummary();
    $("stageSummary").textContent = stageSummary();
    renderStages(); renderBattle(); renderResult(); syncGuide();
  }
  function renderStages() {
    window.__ECHO_ORCHARD_I9__?.refreshStage?.();
  }
  function clearTimer(stopNote = true) {
    playbackGeneration += 1;
    if (timer) clearTimeout(timer);
    timer = null;
    if (stopNote) { noteHandle?.stop(); noteHandle = null; } litFruit = "";
  }
  function soundFruit(fruit) {
    noteHandle?.stop();
    noteHandle = window.WeightPlayAudio.note([261.63, 329.63, 392, 523.25][fruits.indexOf(fruit)]);
  }
  function startGrove(index, fromStage = false) {
    if (!canAccess(index)) return;
    clearTimer(); groveIndex = index; entered = []; attempts = 0; feedback = "ready"; watchStep = 0;
    if (index === 0 || fromStage) { sessionAttempts = 0; runSolved = new Set(); }
    show("battle"); phase = "ready"; renderBattle(); announce("start");
    lastSaveSucceeded = false; __wpMeasurement.stageId = index + 1; __wpMeasurement.saveSucceeded = false;
    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true;
    __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
  }
  function playPattern() {
    if (!["ready", "repeat", "pause"].includes(phase)) return;
    clearTimer(); window.WeightPlayAudio.unlock();
    const generation = playbackGeneration;
    phase = "watch"; entered = []; feedback = "watch"; watchStep = 0; renderBattle();
    const pattern = groves[groveIndex].pattern;
    const glow = () => {
      if (generation !== playbackGeneration || document.hidden) return;
      if (watchStep >= pattern.length) {
        litFruit = ""; phase = "repeat"; feedback = "yourTurn"; renderBattle(); return;
      }
      litFruit = pattern[watchStep]; watchStep += 1;
      soundFruit(litFruit); renderBattle();
      timer = setTimeout(() => {
        if (generation !== playbackGeneration) return;
        litFruit = ""; renderBattle(); timer = setTimeout(glow, 210);
      }, groveIndex < 5 ? 620 : 440);
    };
    timer = setTimeout(glow, 450);
  }
  function ensureBattleUI() {
    const prompt = $("prompt");
    if (!$("echoPhase")) {
      const panel = document.createElement("div"); panel.id = "echoPhase"; panel.className = "echo-phase";
      panel.innerHTML = '<span class="echo-phase-number" aria-hidden="true"></span><div><strong id="echoPhaseTitle"></strong><p id="echoPhaseHelp"></p></div>';
      const play = document.createElement("div"); play.className = "echo-content-host";
      prompt.before(play);
      play.append(panel, prompt, $("patternSlots"), $("orchardButtons"), $("battleScreen").querySelector(".battle-actions"), $("status"));
      prompt.hidden = true;
      panel.setAttribute("role", "status"); panel.setAttribute("aria-live", "polite");
    }
    const root = $("orchardButtons");
    if (!root.children.length) fruits.forEach((fruit, index) => {
      const button = document.createElement("button"); button.type = "button";
      button.className = `fruit-button fruit-${fruit}`; button.dataset.fruit = fruit;
      button.innerHTML = '<span class="echo-key" aria-hidden="true"></span><span class="fruit-icon" aria-hidden="true"></span><strong></strong><span class="echo-fruit-glow" aria-hidden="true"></span>';
      button.querySelector(".echo-key").textContent = String(index + 1);
      button.addEventListener("click", () => chooseFruit(fruit)); root.appendChild(button);
    });
  }
  function renderBattle() {
    if (!$("orchardButtons") || ["main", "stage", "result"].includes(phase)) return;
    ensureBattleUI();
    const grove = groves[groveIndex];
    $("battleScreen").dataset.echoPhase = phase;
    $("roundTitle").textContent = stageTitle(groveIndex);
    $("progressPill").textContent = `${campaign().stage} ${grove.id} / ${groves.length}`;
    const title = phase === "ready" ? copy("readyTitle") : copy(feedback === "selection" ? "yourTurn" : feedback || "watch");
    $("prompt").textContent = title;
    $("echoPhaseTitle").textContent = title;
    $("echoPhaseHelp").textContent = phase === "ready" ? copy(feedback === "resumed" ? "pauseHelp" : "readyHelp") :
      phase === "watch" ? `${copy("watchCount", {count: watchStep, total: grove.pattern.length})}` :
      phase === "repeat" ? copy("repeatHelp") : phase === "complete" ? copy("selection", {count: entered.length, total: grove.pattern.length}) : copy("retryHelp");
    $("echoPhase").querySelector(".echo-phase-number").textContent = phase === "complete" ? "✓" : phase === "pause" ? "↻" : phase === "repeat" ? "2" : "1";
    const slots = $("patternSlots"); slots.classList.add("echo-sequence");
    slots.style.setProperty("--echo-count", grove.pattern.length);
    if (slots.children.length !== grove.pattern.length) slots.replaceChildren(...grove.pattern.map(() => document.createElement("span")));
    [...slots.children].forEach((slot, index) => {
      const matched = entered[index] === grove.pattern[index];
      slot.className = `pattern-slot ${matched ? "matched" : ""} ${phase === "watch" && index === watchStep - 1 && litFruit ? "is-current" : ""}`;
      slot.textContent = matched ? String(fruits.indexOf(entered[index]) + 1) : String(index + 1);
      slot.dataset.fruit = matched ? entered[index] : "";
      slot.setAttribute("aria-label", `${copy("slot", {count: index + 1})}${matched ? ": " + fruitName(entered[index]) : ""}`);
    });
    $("orchardButtons").querySelectorAll(".fruit-button").forEach((button, index) => {
      const fruit = button.dataset.fruit;
      button.classList.toggle("is-lit", litFruit === fruit);
      button.classList.toggle("is-accepted", phase === "repeat" && entered.at(-1) === fruit);
      button.disabled = phase !== "repeat";
      button.setAttribute("aria-label", `${index + 1}: ${fruitName(fruit)}`);
      button.querySelector("strong").textContent = fruitName(fruit);
    });
    $("replayBtn").disabled = !["ready", "repeat", "pause"].includes(phase);
    $("replayBtn").textContent = phase === "watch" ? copy("watch") : phase === "ready" ? copy("watchAction") : copy("replay");
    $("status").textContent = phase === "repeat" ? copy("selection", {count: entered.length, total: grove.pattern.length}) :
      phase === "complete" ? copy("correct") : copy("keyboardHelp");
    $("status").className = phase === "complete" ? "status good" : "status";
  }
  function chooseFruit(fruit) {
    if (phase !== "repeat" || !fruits.includes(fruit) || document.querySelector('.wp-shell-settings-popover:not([hidden])') || document.querySelector('.echo-leave-dialog:not([hidden])')) return;
    const pattern = groves[groveIndex].pattern; attempts += 1; sessionAttempts += 1;
    const position = entered.length; soundFruit(fruit);
    if (fruit !== pattern[position]) {
      feedback = "wrong"; phase = "pause"; announce("wrong", {fruit}); renderBattle(); return;
    }
    entered = [...entered, fruit]; feedback = "selection"; announce("tap", {fruit, position: position + 1});
    if (entered.length === pattern.length) {
      clearTimer(false); lastSaveSucceeded = saveProgress(groveIndex);
      if (lastSaveSucceeded) { runSolved.add(groveIndex); rememberSolvedStage(groveIndex + 1); flushSavedStageRewards(); }
      __wpMeasurement.saveSucceeded = lastSaveSucceeded;
      feedback = "correct"; phase = "complete"; announce("complete"); renderBattle();
      timer = setTimeout(() => { show("result"); renderResult(); }, 750);
    } else renderBattle();
  }
  function renderResult() {
    if (!$("resultText")) return;
    const complete = solved.size === groves.length && groveIndex === groves.length - 1;
    $("resultTitle").textContent = complete ? copy("resultTitle") : copy("resultRound");
    $("resultText").textContent = complete
      ? campaign().resultAll.replaceAll("{best}", bestValue()).replaceAll("{total}", String(groves.length))
      : campaign().result.replaceAll("{count}", String(solved.size)).replaceAll("{total}", String(groves.length)).replaceAll("{attempts}", String(attempts));
    $("resultMapBtn").hidden = false;
    $("nextBtn").hidden = false;
    if (!lastSaveSucceeded) $("resultText").textContent = saveFailureCopy[locale] || saveFailureCopy.en;
    $("nextBtn").disabled = complete || !lastSaveSucceeded;
    $("nextBtn").setAttribute("aria-disabled", String(complete || !lastSaveSucceeded));
    $("resultReplayBtn").hidden = false;
    __wpNotifyMeasurement();
    if (complete && phase === "result" && runSolved.size === groves.length) {
      const old = Number(localStorage.getItem("weightplay-echo-orchard-best-v1") || 0);
      if (!old || sessionAttempts < old) localStorage.setItem("weightplay-echo-orchard-best-v1", String(sessionAttempts));
      $("resultText").textContent = campaign().resultAll.replaceAll("{best}", String(Math.min(old || sessionAttempts, sessionAttempts))).replaceAll("{total}", String(groves.length));
    }
  }
  function nextGrove() { const next = groveIndex + 1; if (next < groves.length && canAccess(next)) startGrove(next); else { show("stage"); renderStages(); } }
  function goBack() { clearTimer(); if (["ready", "battle", "watch", "repeat", "pause", "complete", "result"].includes(phase)) { show("stage"); renderStages(); } else if (phase === "stage") { show("main"); renderStatic(); } }
  function openStage() {
    show("stage");
    renderStages();
    window.__ECHO_ORCHARD_I9__?.refreshStage?.();
  }
  document.addEventListener("keydown", (event) => {
    if (event.repeat || event.altKey || event.metaKey || event.ctrlKey || event.target.closest("input,select,textarea,[contenteditable=true]") || document.querySelector('[role="dialog"]:not([hidden])') || document.querySelector('.wp-shell-settings-popover:not([hidden])')) return;
    const index = Number(event.key) - 1;
    if (phase === "repeat" && index >= 0 && index < fruits.length && /^[1-4]$/.test(event.key)) { event.preventDefault(); chooseFruit(fruits[index]); }
    if (event.key.toLowerCase() === "r" && ["ready", "repeat", "pause"].includes(phase)) { event.preventDefault(); playPattern(); }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && ["watch", "repeat", "pause"].includes(phase)) {
      clearTimer(); entered = []; phase = "ready"; feedback = "resumed"; renderBattle();
    }
  });
  window.addEventListener("pagehide", clearTimer);
  function bind() { $("startBtn").addEventListener("click", openStage); $("resultMapBtn").addEventListener("click", openStage); $("resultReplayBtn").addEventListener("click", () => { __wpReplayStart(() => startGrove(groveIndex)); }); $("nextBtn").addEventListener("click", nextGrove); $("replayBtn").addEventListener("click", playPattern); $("resetBtn").addEventListener("click", () => { __wpReplayStart(() => startGrove(groveIndex)); }); $("stageBack").addEventListener("click", () => { show("main"); renderStatic(); }); $("battleBackBtn").addEventListener("click", goBack); $("localeSelect").addEventListener("change", (event) => { locale = event.target.value; localStorage.setItem("weightplay-echo-orchard-locale", locale); renderStatic(); }); }
  window.addEventListener("weightplay:audio-volume-change", syncSharedSound);
  function boot() { bind(); $("localeSelect").value = locale; $("loading")?.setAttribute("hidden", ""); $("app").hidden = false; show("main"); renderStatic(); announce("loaded"); }
  window.__ECHO_ORCHARD_TEST__ = { groves, startGrove, playPattern, chooseFruit, copy, stageRecord, stageSummary, getState: () => ({ groveIndex, phase, entered: [...entered], solved: [...solved], unlockedThrough, attempts, screen: phase }) };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
}());
