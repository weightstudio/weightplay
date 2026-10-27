(() => {
  "use strict";
  // This local-only acceptance slice must never touch campaign or analytics.
  const localPracticeRequested=location.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&new URLSearchParams(location.search).get('practice')==='1';
  let practiceAdapter=null,practiceEnabled=false;
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((({main:"main",stage:"stage",battle:"battle",})[screen] ?? null) === "battle" && (__wpMeasurement.ended)) ? null : (({main:"main",stage:"stage",battle:"battle",})[screen] ?? null), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(state?.paused || state?.suspended || lifecycleSuspended), node: document.body,
    activityMode: "input", idleSeconds: 300
  });
  function __wpNotifyMeasurement() { if(localPracticeRequested)return;try { window.WonderAnalytics?.game?.observeState(__wpReadMeasurement); } catch { /* Optional telemetry. */ } }
  // Explicit authored replay actions count only when a new round was actually created.
  function __wpReplayStart(action) {
    const previous = __wpMeasurement.roundKey, value = action();
    if (__wpMeasurement.roundKey !== previous) { __wpMeasurement.restart = true; __wpNotifyMeasurement(); }
    return value;
  }
  window.addEventListener("weightplay:analytics-ready", __wpNotifyMeasurement);
  __wpNotifyMeasurement();


  const codes = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const transferCopy={
    en:['Swap','Swap the first two waiting passengers once.','Practice only: progress and rewards are not saved.'],
    'zh-Hant':['交換','交換候車隊伍前兩人，限用一次。','僅供練習：不會保存進度或獎勵。'],
    'zh-Hans':['交换','交换候车队伍前两人，限用一次。','仅供练习：不会保存进度或奖励。'],
    ja:['入替','待機列の先頭２人を１回だけ入れ替えます。','練習のみ：進行状況や報酬は保存されません。'],
    ko:['교환','대기 중인 앞의 두 명을 한 번 교환합니다.','연습 모드: 진행 상황과 보상은 저장되지 않습니다.'],
    es:['Cambiar','Intercambia una vez a los dos primeros en espera.','Solo práctica: no se guardan el progreso ni las recompensas.'],
    'pt-BR':['Trocar','Troque uma vez os dois primeiros da espera.','Apenas treino: progresso e recompensas não são salvos.'],
    fr:['Échanger','Échangez une fois les deux premiers voyageurs en attente.','Entraînement : progression et récompenses ne sont pas enregistrées.'],
    de:['Tauschen','Tausche einmal die ersten beiden Wartenden.','Nur Übung: Fortschritt und Belohnungen werden nicht gespeichert.'],
    it:['Scambia','Scambia una volta i primi due in attesa.','Solo allenamento: progressi e ricompense non vengono salvati.'],
    ru:['Обмен','Один раз поменяйте местами первых двух ожидающих.','Тренировка: прогресс и награды не сохраняются.'],
    hi:['बदलें','प्रतीक्षा में पहले दो यात्रियों को एक बार अदलें।','केवल अभ्यास: प्रगति और पुरस्कार सहेजे नहीं जाते।'],
    ar:['تبديل','بدّل أول راكبين في الانتظار مرة واحدة.','للتدريب فقط: لا يُحفظ التقدم أو المكافآت.']
  };
  const transferRules={
    en:['Gate: after {route} departs','Priority: direct boarding only'],
    'zh-Hant':['閘門：{route} 發車後開啟','優先乘客：只能直接上車'],
    'zh-Hans':['闸门：{route} 发车后开启','优先乘客：只能直接上车'],
    ja:['ゲート：{route}の発車後に開きます','優先乗客：直接乗車のみ'],
    ko:['차단문: {route} 출발 후 열림','우선 승객: 바로 탑승만 가능'],
    es:['Acceso: tras salir {route}','Prioridad: solo embarque directo'],
    'pt-BR':['Portão: após a saída de {route}','Prioridade: apenas embarque direto'],
    fr:['Accès : après le départ de {route}','Priorité : embarquement direct uniquement'],
    de:['Sperre: nach Abfahrt von {route}','Vorrang: nur direktes Einsteigen'],
    it:['Varco: dopo la partenza di {route}','Priorità: solo imbarco diretto'],
    ru:['Проход: после отправления {route}','Приоритет: только прямая посадка'],
    hi:['द्वार: {route} के जाने पर खुलेगा','प्राथमिक यात्री: सीधे बस में ही चढ़ेंगे'],
    ar:['البوابة: بعد مغادرة {route}','أولوية: الصعود المباشر فقط']
  };
  const palette = ["#ef6b62", "#4da8e8", "#f0bb4d", "#9a7ae9"];
  const routeCodes = ["A", "B", "C", "D"];
  const GAME_ID = "animal-bus-jam";
  const GAME_VERSION = 20;
  const INTERFACE_VERSION = 9;
  const busArt = ["coral", "sky", "sun", "violet"].map((color) => `/assets/animal-bus-jam-bus-${color}-block-v16.webp`);
  const passengerArt = ["coral", "sky", "sun", "violet"].map((color) => `/assets/animal-bus-jam-passenger-${color}-block-v16.webp`);
  const root = document;
  const engine = window.BUS_JAM_LEVELS;
  const levels = engine.levels;
  const dict = window.BUS_JAM_LOCALES;
  const $ = (id) => root.getElementById(id);
  const read = (key) => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const write = (key, value) => {
    if(localPracticeRequested)return;
    try { localStorage.setItem(key, value); } catch {}
  };

  const routeLocales = {
    en: "en",
    "zh-tw": "zh-Hant",
    "zh-cn": "zh-Hans",
    ja: "ja",
    ko: "ko",
    es: "es",
    "pt-br": "pt-BR",
    fr: "fr",
    de: "de",
    it: "it",
    ru: "ru",
    hi: "hi",
    ar: "ar",
  };
  const routeSegment = location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const routeLocale = routeLocales[routeSegment];
  let locale = routeLocale || read("weightPlayLocale") || read("wp-locale") || window.WonderI18n?.actualLocale?.() || "en";
  let screen = "main";
  let sceneGeneration = 0;
  let selected = 0;
  let levelIndex = 0;
  let state = null;
  let history = [];
  let moves = 0;
  let holds = 0;
  let assists = 0;
  let holdingTarget = 0;
  const bestKey = "animalBusJamMastery";
  const best = window.BUS_JAM_MASTERY.readBest(read(bestKey));
  const effects = new Set();
  let departingBusIndexes = [];
  let departureTimer = 0;
  let departureDeadline = 0;
  let departureRemaining = 0;
  let lifecycleSuspended = false;
  let windowActive = true;
  let pageVisible = !document.hidden;
  let pageCached = false;
  let resultActionClaimed = false;
  let inputType = "pointer";
  let feedbackKey = "status";
  let feedbackTone = "neutral";
  let feedbackVars = {};
  let stageSelector = null;
  const transferButton=document.createElement('button');
  transferButton.type='button';transferButton.hidden=true;transferButton.dataset.transferTicket='';
  const transferIcon=document.createElement('img');transferIcon.alt='';transferIcon.width=40;transferIcon.height=40;
  const transferText=document.createElement('span');transferButton.append(transferIcon,transferText);
  root.querySelector('.tools').append(transferButton);
  transferButton.addEventListener('click',useTransferTicket);
  const transferHelp=document.createElement('button');transferHelp.type='button';transferHelp.hidden=true;transferHelp.dataset.transferHelp='';transferHelp.textContent='?';
  root.querySelector('.holding-panel .panel-label').append(transferHelp);
  const transferDialog=document.createElement('dialog');transferDialog.id='transferHelpDialog';
  const transferHelpTitle=document.createElement('h2');transferHelpTitle.id='transferHelpTitle';transferDialog.setAttribute('aria-labelledby',transferHelpTitle.id);
  const transferHelpBody=document.createElement('div'),transferHelpClose=document.createElement('button');transferHelpClose.type='button';transferDialog.append(transferHelpTitle,transferHelpBody,transferHelpClose);document.body.append(transferDialog);
  transferHelp.addEventListener('click',()=>{if(!practiceEnabled||levelIndex<30)return;const level=levels[levelIndex],copy=transferCopy[locale]||transferCopy.en,rules=transferRules[locale]||transferRules.en;transferHelpTitle.textContent=t('guideTitle');transferHelpClose.textContent=t('back');transferHelpBody.replaceChildren();for(const text of [copy[1],...(level.transferGates||[]).map(g=>rules[0].replace('{route}',t('colors')[level.buses[g.unlockAfter-1].color])),...((level.transferPriority||[]).length?[`◆ ${rules[1]}`]:[])]){const p=document.createElement('p');p.textContent=text;transferHelpBody.append(p);}transferDialog.showModal();transferHelpClose.focus();});
  transferHelpClose.addEventListener('click',()=>transferDialog.close());transferDialog.addEventListener('close',()=>{if(!transferHelp.hidden)transferHelp.focus();});
  const progressKey = "animalBusJamProgress";
  let progress;
  try { progress = JSON.parse(read(progressKey) || "[]"); } catch { progress = []; }
  if (!Array.isArray(progress)) progress = [];
  if (!codes.includes(locale)) locale = "en";
  if (routeLocale && !localPracticeRequested) {
    write("weightPlayLocale", locale);
    write("wp-locale", locale);
    try { window.WonderI18n?.setLocale?.(locale); } catch {}
  }
  while (selected < 29 && progress[selected]) selected += 1;

  function viewportBucket() {
    const width = window.innerWidth || 0;
    const height = window.innerHeight || 0;
    if (width <= 480) return "phone";
    if (height < 520 && width > height) return "short-landscape";
    if (width <= 900 && height >= width) return "tablet-portrait";
    return "desktop-landscape";
  }

  function stopBucket(stop) {
    if (!Number.isInteger(stop) || stop < 1) return "unknown";
    if (stop <= 5) return "1-5";
    if (stop <= 15) return "6-15";
    return "16-30";
  }

  function track(event, payload = {}) {
    if(localPracticeRequested)return;
    try {
      (window.WonderAnalytics || window.WeightPlayAnalytics)?.track?.(event, {
        game_id: GAME_ID,
        game_version: GAME_VERSION,
        interface_version: INTERFACE_VERSION,
        locale: locale || document.documentElement.lang || "en",
        viewport_bucket: viewportBucket(),
        input_type: inputType,
        ...payload,
      });
    } catch {
      // Analytics must never block a player action or alter puzzle state.
    }
  }

  function trackFunnel(event, payload = {}) {
    const stop = Number.isInteger(levelIndex) && state ? levelIndex + 1 : null;
    track(event, { stop, stop_bucket: stopBucket(stop), ...payload });
  }

  document.addEventListener("pointerdown", (event) => {
    if (event.isPrimary === false) return;
    inputType = event.pointerType === "touch" ? "touch" : "pointer";
  }, true);
  document.addEventListener("keydown", (event) => {
    if (!event.isComposing) inputType = "keyboard";
  }, true);

  function t(key, vars = {}) {
    const active = dict[locale] || dict.en;
    let value = (key === "title" ? window.WEIGHTPLAY_GAME_TITLES?.[GAME_ID]?.[locale] : undefined) ?? active[key] ?? dict.en[key] ?? key;
    if (Array.isArray(value)) return value;
    return String(value).replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? "");
  }

  function renderFeedback() {
    const status = $("status");
    status.dataset.feedback = feedbackTone;
    status.textContent = t(feedbackKey, feedbackVars);
  }

  function announceFeedback(key, tone, vars = {}) {
    feedbackKey = key;
    feedbackTone = tone;
    feedbackVars = { ...vars };
    renderFeedback();
    const status = $("status");
    status.classList.remove("feedback-pop");
    void status.offsetWidth;
    status.classList.add("feedback-pop");
  }

  function save() {
    write(progressKey, JSON.stringify(progress));
  }

  function renderMainProgress() {
    const slot = $("mainProgress");
    if (slot) slot.textContent = t("progress", { done: progress.filter(Boolean).length });
  }

  function snapshot() {
    return {
      queues: state.queues.map((queue) => queue.slice()),
      waiting: state.waiting.slice(),
      busIndex: state.busIndex,
      busFilled: state.busFilled,
      ticket: state.ticket,
      moves,
      holds,
    };
  }

  function restore(saved) {
    state = {
      queues: saved.queues.map((queue) => queue.slice()),
      waiting: saved.waiting.slice(),
      busIndex: saved.busIndex,
      busFilled: saved.busFilled,
      ticket: saved.ticket,
    };
    moves = saved.moves;
    holds = saved.holds;
  }

  function applyLocale() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    root.querySelectorAll("[data-t]").forEach((element) => {
      element.textContent = t(element.dataset.t);
    });
    root.querySelectorAll("[data-t-aria]").forEach((element) => {
      element.setAttribute("aria-label", t(element.dataset.tAria));
    });
    root.querySelectorAll("[data-t-alt]").forEach((element) => {
      element.alt = t(element.dataset.tAlt);
    });
    const guide = root.querySelector('[data-t="guideBody"]');
    if (guide) guide.textContent = `${t("guideBody")} ${t("masteryGuide")}`;
    $("locale").value = locale;
    document.title = `${t("title")} | WeightPlay`;
    renderMainProgress();
    renderStage();
    if (screen === "battle" && state) render();
    renderFeedback();
    if ($("result").open) $("resultBody").textContent = t("resultBody", { n: levelIndex + 1, moves })+(localPracticeRequested?` ${(transferCopy[locale]||transferCopy.en)[2]}`:'');
    if ($("result").open) renderRating();
    if ($("leaveBattle").open) $("leaveBattleBody").textContent = t("leaveBody", { n: levelIndex + 1 });
  }

  function show(name) {
    if(transferDialog.open)transferDialog.close();
    clearEffects();
    if (name !== "battle") {
      window.clearTimeout(departureTimer);
      departureTimer = 0;
      departureDeadline = 0;
      departureRemaining = 0;
      departingBusIndexes = [];
      $("buses").replaceChildren();
    }
    const generation = ++sceneGeneration;
    ["main", "stage", "battle"].forEach((id) => {
      $(id).hidden = id !== name;
      document.body.classList.toggle(`wp-shell-${id}-active`, id === name);
    });
    $("generalReserve").hidden = name !== "battle";
    document.body.dataset.screen = name;
    document.body.dataset.gameView = name;
    screen = name;
    const content = $(name).querySelector(name === "main" ? ".main-content" : name === "stage" ? ".stage-content" : ".battle-content");
    content?.classList.remove("scene-enter");
    if (content) { void content.offsetWidth; content.classList.add("scene-enter"); }
    if (name === "main") renderMainProgress();
    if (name === "stage") renderStage();
    window.syncBusJamFrame?.();
    const sync = () => {
      if (generation !== sceneGeneration || screen !== name) return;
      const detail = { screen: name, generation };
      window.dispatchEvent(new CustomEvent("weightplay:battle-sync", { detail }));
      window.dispatchEvent(new CustomEvent("weightplay:shell-sync", { detail }));
      window.dispatchEvent(new CustomEvent("weightplay:stage-sync", { detail }));
      if (name === "battle") window.dispatchEvent(new CustomEvent("weightplay:battle-open", { detail }));
    };
    sync();
    requestAnimationFrame(() => requestAnimationFrame(sync));

    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[name] ?? null;
      if (["result"].includes(name) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
}

  function settleDeparture() {
    departureTimer = 0;
    departureDeadline = 0;
    departureRemaining = 0;
    if (lifecycleSuspended || screen !== "battle" || !departingBusIndexes.length) return;
    departingBusIndexes = [];
    render();
    if (engine.isComplete(levels[levelIndex], state)) finishLevel();
  }

  function scheduleDeparture(duration) {
    window.clearTimeout(departureTimer);
    departureRemaining = Math.max(0, duration);
    if (lifecycleSuspended) {
      departureTimer = 0;
      departureDeadline = 0;
      return;
    }
    departureDeadline = performance.now() + departureRemaining;
    departureTimer = window.setTimeout(settleDeparture, departureRemaining);
  }

  function suspendDeparture() {
    clearEffects();
    document.body.classList.add("bus-suspended");
    (__wpNotifyMeasurement(), lifecycleSuspended = true);
    if (!departureTimer) return;
    departureRemaining = Math.max(0, departureDeadline - performance.now());
    window.clearTimeout(departureTimer);
    departureTimer = 0;
    departureDeadline = 0;
  }

  function resumeDeparture() {
    if (!lifecycleSuspended || !windowActive || !pageVisible || pageCached) return;
    (__wpNotifyMeasurement(), lifecycleSuspended = false);
    document.body.classList.remove("bus-suspended");
    if (screen === "battle" && departingBusIndexes.length) scheduleDeparture(departureRemaining);
  }

  function selectStage(index) {
    selected = Math.max(0, Math.min(levels.length - 1, Number(index) || 0));
  }

  function renderStage() {
    if (screen !== "stage") return;
    $("progress").textContent = t("progress", { done: progress.filter(Boolean).length });
    stageSelector?.refresh(selected);
  }

  function updateBusCard(element, bus, index) {
    const active = index === state.busIndex;
    const departureOrder = departingBusIndexes.indexOf(index);
    const departing = departureOrder >= 0;
    const filled = departing ? bus.seats : active ? state.busFilled : 0;
    element.className = `bus${active ? " active" : ""}${departing ? " departing" : ""}`;
    element.dataset.busIndex = String(index);
    element.dataset.color = String(bus.color);
    element.dataset.departureOrder = departing ? String(departureOrder) : "";
    element.style.setProperty("--bus", palette[bus.color]);
    element.style.setProperty("--departure-order", departureOrder);
    if (departing) element.setAttribute("aria-hidden", "true");
    else element.removeAttribute("aria-hidden");
    const previousFilled = Number(element.dataset.filled || 0);
    element.dataset.filled = String(filled);
    element.innerHTML = `
      <div class="bus-head"><strong>${t("colors")[bus.color]}</strong><span class="bus-route">${active ? t("activeBus") : `R-${index + 1}`}</span></div>
      <img class="bus-art" src="${busArt[bus.color]}" alt="" aria-hidden="true">
      <div class="seats" aria-label="${t("busLabel", { color: t("colors")[bus.color], filled, capacity: bus.seats })}">${Array.from({ length: bus.seats }, (_, seat) => `<i class="${seat < filled ? "filled" : ""}${seat >= previousFilled && seat < filled ? " seat-arrived" : ""}"></i>`).join("")}</div>
    `;
  }

  function renderBuses(level) {
    const container = $("buses");
    const visibleIndexes = level.buses
      .map((_, index) => index)
      .filter((index) => index >= state.busIndex || departingBusIndexes.includes(index));
    const visibleSet = new Set(visibleIndexes.map(String));
    const elements = new Map(
      [...container.children].map((element) => [element.dataset.busIndex, element]),
    );

    [...container.children].forEach((element) => {
      if (!visibleSet.has(element.dataset.busIndex)) element.remove();
    });
    visibleIndexes.forEach((index, position) => {
      let element = elements.get(String(index));
      if (!element?.isConnected) {
        element = document.createElement("div");
        element.className = "bus";
      }
      updateBusCard(element, level.buses[index], index);
      if (container.children[position] !== element) {
        container.insertBefore(element, container.children[position] || null);
      }
    });
  }

  function passenger(color, queueIndex, itemIndex) {
    const front = itemIndex === 0;
    const matches = front && color === levels[levelIndex].buses[state.busIndex]?.color;
    const level=levels[levelIndex],transfer=localPracticeRequested&&practiceEnabled&&levelIndex>=30;
    const position=level.queues[queueIndex].length-state.queues[queueIndex].length+itemIndex;
    const priority=transfer&&level.transferPriority?.some(p=>p.lane===queueIndex&&p.position===position);
    const gated=transfer&&level.transferGates?.some(g=>g.lane===queueIndex&&state.busIndex<g.unlockAfter);
    const rule=priority?(transferRules[locale]||transferRules.en)[1]:'';
    return `<button class="passenger ${front ? "front" : ""}${matches ? " can-board" : ""}${priority?' transfer-priority':''}" data-queue="${queueIndex}" data-color="${color}" style="--person:${palette[color]}" aria-label="${t("personLabel", { color: t("colors")[color] })}${rule?` · ${rule}`:''}" ${front?(gated?"disabled aria-disabled=\"true\"":"data-wp-primary-action=\"true\""):"disabled tabindex=\"-1\" aria-hidden=\"true\" aria-disabled=\"true\""}>
      <span class="passenger-art-frame" aria-hidden="true"><img class="passenger-art" src="${passengerArt[color]}" alt=""><b>${routeCodes[color]}</b></span>
      <span>${t("colors")[color]}</span>
    </button>`;
  }

  function render() {
    const level = levels[levelIndex];
    engine.settle(level, state);
    const remaining = state.queues.reduce((sum, queue) => sum + queue.length, 0) + state.waiting.length;
    const chapterNumber = levelIndex>=30?2:level.chapter + 1;
    $("chapter").textContent = t("chapterShort", { n: chapterNumber });
    $("chapter").setAttribute("aria-label", t("chapter", { n: chapterNumber }));
    $("chapter").title = t("chapter", { n: chapterNumber });
    $("stageName").textContent = t("stop", { n: levelIndex + 1 });
    $("remaining").textContent = t("remaining", { n: remaining });
    $("dispatchGoal").textContent = t("dispatchGoal", { holds, target: holdingTarget })+(localPracticeRequested&&practiceEnabled&&levelIndex>=30?` · ${t('remaining',{n:remaining})}`:'');
    $("dispatchGoal").title = t("masteryGuide");
    root.querySelector(".holding-panel").dataset.pressure = state.waiting.length >= level.baySize ? "full" : "open";
    renderBuses(level);
    $("holdingCount").textContent = `${state.waiting.length}/${level.baySize}`;
    $("holding").innerHTML = Array.from({ length: level.baySize }, (_, index) => {
      const color = state.waiting[index];
      return color === undefined
        ? `<span class="holding-slot">${index + 1}</span>`
        : `<span class="holding-slot occupied" data-color="${color}" style="--person:${palette[color]}"><img class="holding-passenger-art" src="${passengerArt[color]}" alt="" aria-hidden="true"><b>${routeCodes[color]}</b></span>`;
    }).join("");
    $('queues').classList.toggle('transfer-compact',localPracticeRequested&&practiceEnabled&&levelIndex>=30&&state.queues.length>=4);
    $("queues").innerHTML = state.queues.map((queue, queueIndex) => `
      <div class="queue" role="listitem" style="--lane:${palette[queue[0]] || "#45d7d0"}">
        <span class="queue-label">${t("queueNumber", { n: queueIndex + 1 })}${localPracticeRequested&&practiceEnabled&&levelIndex>=30?(level.transferGates||[]).filter(g=>g.lane===queueIndex&&state.busIndex<g.unlockAfter).map(g=>` <span class="transfer-gate" aria-label="${(transferRules[locale]||transferRules.en)[0].replace('{route}',t('colors')[level.buses[g.unlockAfter-1].color])}" title="${(transferRules[locale]||transferRules.en)[0].replace('{route}',t('colors')[level.buses[g.unlockAfter-1].color])}"><img src="/assets/animal-bus-jam-expansion-drafts/siding-gate-v1-256.png" alt="" aria-hidden="true"><b>${routeCodes[level.buses[g.unlockAfter-1].color]}</b></span>`).join(''):''}</span>
        ${queue.length ? queue.map((color, itemIndex) => passenger(color, queueIndex, itemIndex)).join("") : `<span class="queue-empty">—</span>`}
      </div>
    `).join("");
    root.querySelectorAll(".passenger.front").forEach((button) => {
      button.onclick = (event) => dispatch(Number(button.dataset.queue), event.detail === 0);
    });
    $("undo").disabled = history.length === 0;
    const transferActive=localPracticeRequested&&practiceEnabled&&levelIndex>=30;
    root.querySelector('.dispatch-floor').classList.toggle('transfer-active',transferActive);
    transferButton.hidden=!transferActive;
    transferHelp.hidden=!transferActive;if(transferActive)transferHelp.setAttribute('aria-label',t('guideTitle'));
    if(transferActive){const text=transferCopy[locale]||transferCopy.en;transferIcon.src='/assets/animal-bus-jam-expansion-drafts/transfer-ticket-v1-256.png';transferText.textContent=text[0];transferButton.title=text[1];transferButton.setAttribute('aria-label',`${text[0]}. ${text[1]}`);transferButton.disabled=state.ticket!==1||state.waiting.length<2;}
  }

  function focusNextPassenger(queueIndex) {
    const nextPassenger = root.querySelector(`.passenger.front[data-queue="${queueIndex}"]`)
      || root.querySelector(".passenger.front");
    nextPassenger?.focus({ preventScroll: true });
  }

  function clearEffects() {
    effects.forEach(({ animation, node }) => { animation.cancel(); node?.remove(); });
    effects.clear();
  }

  function animateTransfer(color, from, target) {
    if (!from || !target || lifecycleSuspended || !target.isConnected) return;
    const to = target.getBoundingClientRect();
    if (effects.size >= 12) {
      const oldest = effects.values().next().value;
      oldest.animation.cancel(); oldest.node?.remove(); effects.delete(oldest);
    }
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const node = document.createElement("img");
    node.src = passengerArt[color];
    node.alt = "";
    node.setAttribute("aria-hidden", "true");
    node.className = "transfer-passenger";
    const size = Math.max(20, Math.min(46, from.height));
    const startX = from.left + from.width / 2 - size / 2;
    const startY = from.top + from.height / 2 - size / 2;
    node.style.cssText = `left:${startX}px;top:${startY}px;width:${size}px;height:${size}px;--person:${palette[color]}`;
    document.body.append(node);
    const dx = to.left + to.width / 2 - size / 2 - startX;
    const dy = to.top + to.height / 2 - size / 2 - startY;
    const animation = node.animate(reduced ? [{ opacity: 1 }, { opacity: 0 }] : [
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * .5}px,${dy * .5 - 16}px) scale(1.12)`, opacity: 1, offset: .5 },
      { transform: `translate(${dx}px,${dy}px) scale(.55)`, opacity: 0 },
    ], { duration: reduced ? 100 : 320, easing: "cubic-bezier(.2,.7,.25,1)" });
    const effect = { animation, node };
    effects.add(effect);
    const cleanup = () => { node.remove(); effects.delete(effect); };
    animation.onfinish = cleanup;
    animation.oncancel = cleanup;
  }

  function renderRating() {
    const stars = window.BUS_JAM_MASTERY.rating(holds, holdingTarget, assists);
    $("resultRating").innerHTML = `<span class="rating-stars" aria-hidden="true">${"★".repeat(stars)}${"☆".repeat(3 - stars)}</span><span>${t("masteryResult", { stars, holds, target: holdingTarget, assists })}</span>`;
  }

  function startLevel(index) {
    if(localPracticeRequested&&(!practiceEnabled||index<30||index>=60))return;
    if(index>=30&&(!localPracticeRequested||!practiceEnabled))return;
    clearEffects();
    window.clearTimeout(departureTimer);
    departureTimer = 0;
    departureDeadline = 0;
    departureRemaining = 0;
    departingBusIndexes = [];
    $("buses").replaceChildren();
    levelIndex = index;
    const level = levels[index];
    state = {
      queues: level.queues.map((queue) => queue.slice()),
      waiting: [],
      busIndex: 0,
      busFilled: 0,
      ...(index>=30?{ticket:1}:{}),
    };
    history = [];
    moves = 0;
    holds = 0;
    assists = 0;
    holdingTarget = index>=30?engine.transferAnalyze(level,state).holds:engine.analyze(level, state).holds;
    (__wpNotifyMeasurement(), $("result").close());
    $("deadlock").close();
    (__wpNotifyMeasurement(), $("leaveBattle").close());
    show("battle");
    window.WeightPlayAudio?.play("game.start");
    render();
    feedbackKey = "status";
    feedbackTone = "neutral";
    feedbackVars = {};
    renderFeedback();
    if(localPracticeRequested&&index>=30)$('status').textContent=(transferCopy[locale]||transferCopy.en)[1];
    trackFunnel("stop_start", { source: "stage_card" });

    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
}

  function dispatch(queueIndex, restoreKeyboardFocus = false) {
    if (screen !== "battle" || lifecycleSuspended || $("result").open || $("deadlock").open || $("leaveBattle").open || transferDialog.open) return;
    const level = levels[levelIndex];
    const color = state.queues[queueIndex]?.[0];
    const activeColor = level.buses[state.busIndex]?.color;
    if (color === undefined || activeColor === undefined) return;
    const previousWaiting = state.waiting.length;
    const sourceRect = root.querySelector(`.passenger.front[data-queue="${queueIndex}"] .passenger-art`)?.getBoundingClientRect();
    const waitingRects = [...root.querySelectorAll(".holding-slot.occupied")].map((slot) => slot.getBoundingClientRect());
    if (color !== activeColor && state.waiting.length >= level.baySize) {
      announceFeedback("holdingFull", "blocked");
      root.querySelector(".holding-panel")?.classList.remove("jam");
      requestAnimationFrame(() => root.querySelector(".holding-panel")?.classList.add("jam"));
      return;
    }
    history.push(snapshot());
    const previousBusIndex = state.busIndex;
    const events = [];
    const nextState = levelIndex>=30?engine.transferStep(level,state,queueIndex,events):engine.step(level,state,queueIndex,events);
    if (!nextState) {history.pop();const position=level.queues[queueIndex].length-state.queues[queueIndex].length;if(levelIndex>=30&&(level.transferPriority||[]).some(p=>p.lane===queueIndex&&p.position===position)){$('status').dataset.feedback='blocked';$('status').textContent=(transferRules[locale]||transferRules.en)[1];}else announceFeedback('hintRecover','blocked');return;}
    state = nextState;
    moves += 1;
    if (color !== activeColor) holds += 1;
    window.WeightPlayAudio?.play("board.move");
    trackFunnel("dispatch", {
      queue: queueIndex + 1,
      route: color,
      dispatch_type: color === activeColor ? "direct" : "holding",
      holding_count: state.waiting.length,
      move_count: moves,
    });
    if (state.busIndex > previousBusIndex) {
      departingBusIndexes = [...new Set([...departingBusIndexes, ...Array.from(
        { length: state.busIndex - previousBusIndex },
        (_, offset) => previousBusIndex + offset,
      )])];
      window.clearTimeout(departureTimer);
      const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
      const departureDuration = reducedMotion ? 100 : 900 + (departingBusIndexes.length - 1) * 90;
      scheduleDeparture(departureDuration);
    }
    render();
    root.querySelectorAll(".queue")[queueIndex]?.classList.add("queue-advance");
    let waitingIndex = 0;
    events.forEach((event) => {
      if (event.kind === "depart") return;
      const target = event.kind === "hold" ? $("holding").children[event.slot]
        : root.querySelector(`.bus[data-bus-index="${event.busIndex}"] .seats`)?.children[event.seat];
      animateTransfer(event.color, event.kind === "waiting-board" ? waitingRects[waitingIndex++] : sourceRect, target);
    });
    if (restoreKeyboardFocus) focusNextPassenger(queueIndex);
    const clearedWaiting = previousWaiting > state.waiting.length;
    const departed = state.busIndex > previousBusIndex;
    if (departed) {
      announceFeedback(clearedWaiting ? "feedbackDepartureClear" : "feedbackDeparture", "departure", { count: state.busIndex - previousBusIndex });
    } else if (clearedWaiting) {
      announceFeedback("feedbackClear", "clear", { count: previousWaiting - state.waiting.length });
    } else if (color === activeColor) {
      announceFeedback("feedbackDirect", "direct", { color: t("colors")[color] });
    } else {
      announceFeedback("feedbackHold", "hold", { color: t("colors")[color] });
    }

    if (engine.isComplete(level, state)) {
      if (departingBusIndexes.length === 0) finishLevel();
      return;
    }
    if (levelIndex>=30?!Number.isFinite(engine.transferAnalyze(level,state).holds):engine.isDeadlocked(level, state)) {
      trackFunnel("deadlock", { move_count: moves, holding_count: state.waiting.length });
      window.WeightPlayAudio?.play("result.lose");
      (__wpNotifyMeasurement(), $("deadlock").showModal());
    }
  }

  function finishLevel() {
    if (!state || !engine.isComplete(levels[levelIndex], state) || $("result").open) return;
    if(!localPracticeRequested)progress[levelIndex] = true;
    const result = { stars: window.BUS_JAM_MASTERY.rating(holds, holdingTarget, assists), holds };
    if(!localPracticeRequested){best[levelIndex] = window.BUS_JAM_MASTERY.keepBest(best[levelIndex], result);write(bestKey, JSON.stringify(best));save();}
    renderMainProgress();
    window.WeightPlayAudio?.play("result.win");
    $("resultBody").textContent = t("resultBody", { n: levelIndex + 1, moves })+(localPracticeRequested?` ${(transferCopy[locale]||transferCopy.en)[2]}`:'');
    renderRating();
    resultActionClaimed = false;
    $("resultStages").disabled = false;
    $("retry").disabled = false;
    $("next").disabled = localPracticeRequested||levelIndex >= levels.length - 1;
    trackFunnel("game_complete", { move_count: moves });
    (__wpNotifyMeasurement(), $("result").showModal());

    __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; if (__wpMeasurement.screen === "battle") __wpMeasurement.screen = null; __wpNotifyMeasurement();
}

  function claimResultAction(action) {
    if (!$("result").open || resultActionClaimed) return;
    resultActionClaimed = true;
    ["resultStages", "next", "retry"].forEach((id) => { $(id).disabled = true; });
    action();
  }

  function undo() {
    const saved = history.pop();
    if (!saved) return;
    clearEffects();
    assists += 1;
    window.clearTimeout(departureTimer);
    departureTimer = 0;
    departureDeadline = 0;
    departureRemaining = 0;
    departingBusIndexes = [];
    restore(saved);
    window.WeightPlayAudio?.play("board.undo");
    render();
    announceFeedback("undone", "undo");
    trackFunnel("undo", { move_count: moves });
  }

  function useTransferTicket(){
    if(!localPracticeRequested||!practiceEnabled||levelIndex<30||screen!=='battle'||lifecycleSuspended||$('result').open||$('deadlock').open||$('leaveBattle').open||transferDialog.open)return;
    const level=levels[levelIndex],events=[],next=engine.transferSwap(level,state,events);
    if(!next)return;
    const prior=state.busIndex;history.push(snapshot());state=next;moves++;
    if(state.busIndex>prior){departingBusIndexes=[...new Set([...departingBusIndexes,...Array.from({length:state.busIndex-prior},(_,i)=>prior+i)])];window.clearTimeout(departureTimer);scheduleDeparture(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches?100:900+(departingBusIndexes.length-1)*90);}
    render();$('status').textContent=(transferCopy[locale]||transferCopy.en)[1];
    if(engine.isComplete(level,state)){if(!departingBusIndexes.length)finishLevel();return;}
    if(!Number.isFinite(engine.transferAnalyze(level,state).holds)){window.WeightPlayAudio?.play('result.lose');$('deadlock').showModal();}
  }

  function hint() {
    const level = levels[levelIndex];
    const action=levelIndex>=30?engine.transferAnalyze(level,state).action:null;
    const queueIndex = levelIndex>=30?(action?.type==='dispatch'?action.lane:-1):engine.analyze(level, state).queue;
    assists += 1;
    if(action?.type==='swap'){transferButton.focus();$('status').textContent=(transferCopy[locale]||transferCopy.en)[1];window.WeightPlayAudio?.play('feedback.hint');return;}
    if (queueIndex < 0) { announceFeedback("hintRecover", "blocked"); return; }
    const button = root.querySelector(`.passenger.front[data-queue="${queueIndex}"]`);
    if (button) {
      announceFeedback("hintMove", "hint", {
        queue: queueIndex + 1,
        color: t("colors")[Number(button.dataset.color)],
      });
      window.WeightPlayAudio?.play("feedback.hint");
    }
    trackFunnel("hint", { recommended_queue: queueIndex >= 0 ? queueIndex + 1 : null });
    button?.focus();
    button?.classList.add("hint");
    window.setTimeout(() => button?.classList.remove("hint"), 700);
  }

  $("start").onclick = () => {
    track("game_start", { source: "main" });
    show("stage");
  };
  const stageBack = $("stage").querySelector("[data-back]");
  const battleBack = $("battle").querySelector("[data-back]");
  stageBack.onclick = () => show("main");
  battleBack.onclick = () => {
    if (departureTimer || $("result").open || $("deadlock").open) return;
    $("leaveBattleBody").textContent = t("leaveBody", { n: levelIndex + 1 });
    (__wpNotifyMeasurement(), $("leaveBattle").showModal());
  };
  $("continueBattle").onclick = () => (__wpNotifyMeasurement(), $("leaveBattle").close());
  $("returnToStage").onclick = () => {
    (__wpNotifyMeasurement(), $("leaveBattle").close());
    selected = levelIndex;
    show("stage");
  };
  $("leaveBattle").addEventListener("close", () => {
    if (screen === "battle") battleBack.focus();
  });
  $("undo").onclick = undo;
  $("hint").onclick = hint;
  const requestLevel=index=>localPracticeRequested?practiceAdapter?.challenge(GAME_ID,String(index+1)):startLevel(index);
  $("restart").onclick = () => __wpReplayStart(() => requestLevel(levelIndex));
  $("retry").onclick = () => claimResultAction(() => {
    trackFunnel("result_retry", { source: "result" });
    __wpReplayStart(() => requestLevel(levelIndex));
  });
  $("resultStages").onclick = () => claimResultAction(() => {
    trackFunnel("result_stage", { source: "result" });
    (__wpNotifyMeasurement(), $("result").close());
    selected = localPracticeRequested?levelIndex:Math.min(29, levelIndex + 1);
    show("stage");
  });
  $("next").onclick = () => claimResultAction(() => {
    if (levelIndex >= levels.length - 1) return;
    trackFunnel("result_next", { source: "result", next_stop: Math.min(30, levelIndex + 2) });
    (__wpNotifyMeasurement(), $("result").close());
    selected = Math.min(29, levelIndex + 1);
    startLevel(selected);
  });
  $("deadlockUndo").onclick = () => { $("deadlock").close(); undo(); };
  $("deadlockRetry").onclick = () => {
    trackFunnel("deadlock_retry");
    __wpReplayStart(() => requestLevel(levelIndex));
  };
  $("locale").innerHTML = codes.map((code) => `<option value="${code}">${dict[code]?.label || code}</option>`).join("");
  root.addEventListener("change", (event) => {
    if (event.target.id !== "locale") return;
    locale = event.target.value;
    write("weightPlayLocale", locale);
    write("wp-locale", locale);
    try { window.WonderI18n?.setLocale?.(locale); } catch {}
    applyLocale();
  });
  window.addEventListener("wonder:locale-change", (event) => {
    const next = event.detail?.actualLocale || event.detail?.locale;
    if (!codes.includes(next)) return;
    locale = next;
    write("weightPlayLocale", locale);
    write("wp-locale", locale);
    applyLocale();
    window.setTimeout(() => { if (locale === next) applyLocale(); }, 0);
  });
  window.addEventListener("blur", () => {
    windowActive = false;
    suspendDeparture();
  });
  window.addEventListener("focus", () => {
    windowActive = true;
    resumeDeparture();
  });
  window.addEventListener("pagehide", () => {
    pageCached = true;
    suspendDeparture();
  });
  window.addEventListener("pageshow", () => {
    pageCached = false;
    resumeDeparture();
  });
  document.addEventListener("visibilitychange", () => {
    pageVisible = !document.hidden;
    if (pageVisible) resumeDeparture();
    else suspendDeparture();
  });

  const stageConfig = window.BUS_JAM_STAGE_CONFIG({ t, levels, progress, best, isPractice:()=>localPracticeRequested&&practiceEnabled });
  window.BUS_JAM_I9 = {
    stageConfig,
    localPractice:()=>localPracticeRequested&&practiceEnabled,
    selected: () => selected,
    select: selectStage,
    start: (index) => {
      if (index > 0 && !progress[index - 1] && !(localPracticeRequested&&practiceEnabled&&index>=30)) return;
      requestLevel(index);
    },
    attach: (selector) => { stageSelector = selector; renderStage(); },
  };
  applyLocale();
  window.mountBusJamFrame();
  show("main");
  function waitForPracticeEntryReady(){return new Promise(resolve=>{let done=false;const observer=new MutationObserver(check),timer=setTimeout(()=>finish(false),25000);function finish(value){if(done)return;done=true;clearTimeout(timer);observer.disconnect();resolve(value);}function check(){const page=document.documentElement;if(window.WeightPlayGameEntryLoader?.isActive&&page.dataset.wpGameEntryLoaderInstalled==='true'&&page.dataset.wpGameEntryLoaderActive!=='true')finish(true);else if(document.querySelector('.wp-game-entry-loader[data-state="error"]'))finish(false);}observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-wp-game-entry-loader-installed','data-wp-game-entry-loader-active'],childList:true,subtree:true});check();});}
  if(localPracticeRequested)void waitForPracticeEntryReady().then(async ready=>{
    if(!ready)return;
    const {LocalPractice}=await import('../../src/game-local-practice.mjs');practiceAdapter=LocalPractice;
    if(!await LocalPractice.ready)return;
    await import('./transfer-levels-candidate.js?v=20261027-bus-transfer-candidate3');
    const candidates=window.BUS_JAM_TRANSFER_LEVELS;if(!Array.isArray(candidates)||candidates.length!==30||candidates.some((level,index)=>level.index!==30+index))return;
    const originalSelected=selected;
    await LocalPractice.register({gameId:GAME_ID,stageIds:Array.from({length:30},(_,i)=>String(i+31)),enable(enabled){
      practiceEnabled=enabled===true;
      if(practiceEnabled){if(levels.length===30)levels.push(...candidates);stageConfig.count=60;selected=30;}
      else{levels.length=30;stageConfig.count=30;selected=originalSelected;transferButton.hidden=true;if(screen==='battle'){if($('result').open)$('result').close();if($('deadlock').open)$('deadlock').close();show('main');}}
      stageSelector?.refresh(selected);renderMainProgress();
    },async startStage(id){const index=Number(id)-1;if(practiceEnabled&&Number.isSafeInteger(index)&&index>=30&&index<60)startLevel(index);}});
  }).catch(()=>{practiceEnabled=false;});
})();
