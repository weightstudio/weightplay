(() => {
  const GAME_ID = "shape-train";
  const localeKey = "weightplayLocale";
  const canonicalLocaleKey = "weightPlayLocale";
  const unlockKey = "weightplay_shape_train_unlocked";
  const starKey = "weightplay_shape_train_stars";
  const sessionStorageFallback = new Map();

  function readStorage(key) {
    try {
      const value = localStorage.getItem(key);
      if (value !== null) sessionStorageFallback.set(key, value);
      return value ?? sessionStorageFallback.get(key) ?? null;
    } catch {
      return sessionStorageFallback.get(key) ?? null;
    }
  }

  function writeStorage(key, value) {
    const serialized = String(value);
    sessionStorageFallback.set(key, serialized);
    try {
      localStorage.setItem(key, serialized);
      return true;
    } catch {
      return false;
    }
  }

  const text = {
    en: {
      pageTitle: "Animal Shape Train - WeightPlay",
      metaDescription:
        "Play Animal Shape Train on WeightPlay, a gentle preschool animal train game for matching colorful shapes, practicing early logic, and building hand-eye coordination.",
      metaOgTitle: "Animal Shape Train - Preschool Shape Matching Game",
      metaOgDescription: "Help animal shape passengers board the right train cars in a short, picture-based preschool matching game.",
      gameTitle: "Animal Shape Train",
      language: "Language",
      chooseStage: "Choose Stage",
      menuHint: "Match shape friends to the right train cars.",
      previewAction: "Tap or drag the shape friend",
      back: "Back",
      battleBack: "Back to stages",
      leaveTitle: "Leave this route?",
      leaveMessage: "Boarded passengers, retries, and progress in this run will reset.",
      keepPlaying: "Keep Playing",
      leaveStage: "Leave Route",
      trainCars: "Train cars",
      passenger: "Shape passenger: {shape}",
      stageList: "Stage list",
      guideStrategy: "Strategy Tips",
      guideTipName: "Say the shape name out loud before placing it.",
      guideTipLook: "Look at both the outline and the color when a stage has similar pieces.",
      guideTipRetry: "If a child misses, encourage another look instead of rushing.",
      stages: "Stages",
      loading: "Loading",
      nextStage: "Next Stage",
      retry: "Try Again",
      lobby: "Lobby",
      locked: "Stage locked",
      perfect: "Perfect conductor!",
      good: "Great matching!",
      keep: "Keep trying!",
      result: "You helped {count} shape friends ride the train.",
      skillReport: "Skill Report",
      logic: "Logic",
      logicValue: "{count} shape matches",
      focus: "Focus",
      focusValue: "First try: {firstTry} · Retries: {retries}",
      coordination: "Hand-Eye Coordination",
      coordinationValue: "{count} friends boarded",
      firstFinish: "First finish: {stars} stars",
      progress: "Today: {stars} stars · Previous best: {previous}",
      newBest: "New best: {stars} stars · Previous best: {previous}",
      stage: "Stage {n}",
      stageGoal: "{cars} cars / {tasks} passengers",
      checkpoint: "Conductor Check",
      rules: { direct: "Shape Match", outline: "Outline Cars", moving: "Switching Cars", memory: "Remember Passenger", ticket: "Boarding Pass", expert: "Conductor Mix" },
      selectFirst: "Tap the passenger before choosing a car.",
      rememberPassenger: "Tap to see the passenger again.",
      prompt: "Send the {shape} to its matching car.",
      correct: "All aboard!",
      wrong: "Try the matching car.",
      shapes: {
        circle: "circle",
        square: "square",
        triangle: "triangle",
        star: "star",
        diamond: "diamond",
        heart: "heart",
      },
    },
    "zh-Hant": {
      pageTitle: "動物形狀小火車 - WeightPlay",
      metaDescription: "在 WeightPlay 遊玩動物形狀小火車，幫可愛的形狀乘客搭上正確車廂，練習形狀辨識、基礎邏輯與手眼協調。",
      metaOgTitle: "動物形狀小火車 - 兒童形狀配對遊戲",
      metaOgDescription: "幫動物形狀乘客搭上正確的小火車車廂，適合短時間遊玩的親子形狀配對遊戲。",
      gameTitle: "動物形狀小火車",
      language: "語言",
      chooseStage: "選擇關卡",
      menuHint: "把形狀朋友送到正確的小火車車廂。",
      previewAction: "點擊或拖曳形狀朋友",
      back: "返回",
      battleBack: "返回關卡",
      leaveTitle: "要離開這條路線嗎？",
      leaveMessage: "這一局已上車的乘客、重試次數和路線進度都會重設。",
      keepPlaying: "繼續玩",
      leaveStage: "離開路線",
      trainCars: "小火車車廂",
      passenger: "形狀乘客：{shape}",
      stageList: "關卡列表",
      guideStrategy: "遊玩小技巧",
      guideTipName: "放入車廂前，可以先一起說出形狀名稱。",
      guideTipLook: "遇到相似圖形時，同時看看外框和顏色。",
      guideTipRetry: "配對錯誤時，鼓勵孩子再看一次，不用急。",
      stages: "關卡",
      loading: "載入中",
      nextStage: "下一關",
      retry: "再試一次",
      lobby: "大廳",
      locked: "關卡尚未解鎖",
      perfect: "完美列車長！",
      good: "配對很棒！",
      keep: "繼續練習！",
      result: "你幫 {count} 位形狀朋友搭上小火車。",
      skillReport: "技能報告",
      logic: "邏輯",
      logicValue: "完成 {count} 次形狀配對",
      focus: "專注",
      focusValue: "一次成功 {firstTry} 次 · 再試 {retries} 次",
      coordination: "手眼協調",
      coordinationValue: "送 {count} 位朋友上車",
      firstFinish: "第一次完成：{stars} 顆星",
      progress: "本次：{stars} 顆星 · 之前最佳：{previous}",
      newBest: "新的最佳：{stars} 顆星 · 之前最佳：{previous}",
      stage: "第 {n} 關",
      stageGoal: "{cars} 種車廂 / {tasks} 位乘客",
      checkpoint: "列車長檢核",
      rules: { direct: "形狀配對", outline: "輪廓車廂", moving: "換位車廂", memory: "記住乘客", ticket: "上車票", expert: "列車長綜合" },
      selectFirst: "先點一下形狀乘客，再選擇車廂。",
      rememberPassenger: "點一下就能再看乘客。",
      prompt: "把{shape}送到相同形狀的車廂。",
      correct: "上車成功！",
      wrong: "找找相同形狀的車廂。",
      shapes: {
        circle: "圓形",
        square: "正方形",
        triangle: "三角形",
        star: "星形",
        diamond: "菱形",
        heart: "愛心",
      },
    },
    es: {
      pageTitle: "Tren de Formas de Animales - WeightPlay",
      metaDescription:
        "Juega a Tren de Formas de Animales en WeightPlay: ayuda a los simpáticos pasajeros a subir al vagón correcto mientras practicas formas, lógica inicial y coordinación ojo-mano.",
      metaOgTitle: "Tren de Formas de Animales - Juego infantil de formas",
      metaOgDescription: "Ayuda a los pasajeros con forma de animal a subir al vagón correcto en un breve juego infantil de asociación visual.",
      gameTitle: "Tren de Formas de Animales",
      language: "Idioma",
      chooseStage: "Elegir nivel",
      menuHint: "Lleva a cada amigo con forma hasta el vagón correcto.",
      previewAction: "Toca o arrastra al amigo con forma",
      back: "Volver",
      battleBack: "Volver a los niveles",
      leaveTitle: "¿Salir de esta ruta?",
      leaveMessage: "Se reiniciarán los pasajeros a bordo, los reintentos y el progreso de esta partida.",
      keepPlaying: "Seguir jugando",
      leaveStage: "Salir de la ruta",
      trainCars: "Vagones del tren",
      passenger: "Pasajero con forma: {shape}",
      stageList: "Lista de niveles",
      guideStrategy: "Consejos de juego",
      guideTipName: "Di el nombre de la forma en voz alta antes de colocarla.",
      guideTipLook: "Mira tanto el contorno como el color cuando haya piezas parecidas.",
      guideTipRetry: "Si el niño se equivoca, anímalo a mirar de nuevo sin apresurarlo.",
      stages: "Niveles",
      loading: "Cargando",
      nextStage: "Siguiente nivel",
      retry: "Intentar de nuevo",
      lobby: "Sala de juegos",
      locked: "Nivel bloqueado",
      perfect: "¡Maquinista perfecto!",
      good: "¡Muy buena asociación!",
      keep: "¡Sigue intentándolo!",
      result: "Ayudaste a {count} amigos con forma a subir al tren.",
      skillReport: "Informe de habilidades",
      logic: "Lógica",
      logicValue: "{count} asociaciones de formas",
      focus: "Atención",
      focusValue: "A la primera: {firstTry} · Reintentos: {retries}",
      coordination: "Coordinación ojo-mano",
      coordinationValue: "{count} amigos subieron al tren",
      firstFinish: "Primera llegada: {stars} estrellas",
      progress: "Hoy: {stars} estrellas · Mejor anterior: {previous}",
      newBest: "Nuevo récord: {stars} estrellas · Mejor anterior: {previous}",
      stage: "Nivel {n}",
      stageGoal: "{cars} vagones / {tasks} pasajeros",
      checkpoint: "Prueba del maquinista",
      rules: { direct: "Asociar formas", outline: "Vagones de contorno", moving: "Vagones cambiantes", memory: "Recuerda al pasajero", ticket: "Billete de embarque", expert: "Desafío del maquinista" },
      selectFirst: "Toca primero al pasajero y luego elige un vagón.",
      rememberPassenger: "Toca para volver a ver al pasajero.",
      prompt: "Lleva {shape} al vagón con la misma forma.",
      correct: "¡Todos a bordo!",
      wrong: "Prueba con el vagón de la misma forma.",
      shapes: {
        circle: "círculo",
        square: "cuadrado",
        triangle: "triángulo",
        star: "estrella",
        diamond: "rombo",
        heart: "corazón",
      },
    },
  };
  text.ko = Object.assign(Object.create(text.en), {
    stage: "스테이지 {n}",
    locked: "잠긴 스테이지",
  });

  const trainCarAsset = "../../assets/shape-train-car.svg";
  const shapes = {
    circle: { token: "../../assets/shape-train-badge-circle.svg" },
    square: { token: "../../assets/shape-train-badge-square.svg" },
    triangle: { token: "../../assets/shape-train-badge-triangle.svg" },
    star: { token: "../../assets/shape-train-badge-star.svg" },
    diamond: { token: "../../assets/shape-train-badge-diamond.svg" },
    heart: { token: "../../assets/shape-train-badge-heart.svg" },
  };
  const passengerAnimals = {
    circle: "../../assets/weightplay-character-rainbow-hop-mimi-clean-cutout.webp",
    square: "../../assets/weightplay-character-drum-belly-panda-clean-cutout.webp",
    triangle: "../../assets/weightplay-character-spark-paw-captain-cutout.webp",
    star: "../../assets/weightplay-character-boom-mane-lion-cutout.webp",
    diamond: "../../assets/weightplay-character-bubble-fin-otter-cutout.webp",
    heart: "../../assets/weightplay-character-moon-cap-owl-cutout.webp",
  };

  const makeStage = (cars, tasks, options = {}) => ({ cars, tasks, rule: "direct", ...options });
  const stages = [
    makeStage(["circle", "square"], ["circle", "square", "circle", "square"]),
    makeStage(["circle", "square", "triangle"], ["triangle", "circle", "square", "triangle", "circle"]),
    makeStage(["circle", "square", "triangle", "star"], ["star", "triangle", "circle", "square", "star", "circle"]),
    makeStage(["square", "triangle", "star", "diamond"], ["diamond", "square", "star", "triangle", "diamond", "star"]),
    makeStage(["circle", "star", "diamond", "heart"], ["heart", "circle", "diamond", "star", "heart", "diamond"], { checkpoint: true }),
    makeStage(["circle", "square", "triangle", "star", "diamond", "heart"], ["circle", "heart", "triangle", "diamond", "square", "star", "heart", "circle"], { rule: "outline", outline: true }),
    makeStage(["circle", "square", "triangle"], ["square", "triangle", "circle", "square", "triangle"], { rule: "outline", outline: true }),
    makeStage(["triangle", "star", "diamond"], ["diamond", "triangle", "star", "diamond", "star"], { rule: "outline", outline: true }),
    makeStage(["circle", "diamond", "heart", "square"], ["heart", "diamond", "circle", "square", "heart", "circle"], { rule: "outline", outline: true }),
    makeStage(["circle", "square", "triangle", "star", "diamond", "heart"], ["star", "circle", "heart", "triangle", "diamond", "square", "heart", "star"], { rule: "outline", outline: true, checkpoint: true }),
    makeStage(["circle", "square", "triangle"], ["circle", "triangle", "square", "circle", "square"], { rule: "moving", moving: true }),
    makeStage(["star", "diamond", "heart"], ["heart", "star", "diamond", "heart", "diamond"], { rule: "moving", moving: true }),
    makeStage(["circle", "triangle", "star", "heart"], ["triangle", "heart", "circle", "star", "triangle", "heart"], { rule: "moving", moving: true }),
    makeStage(["square", "star", "diamond", "heart"], ["diamond", "square", "heart", "star", "diamond", "square"], { rule: "moving", moving: true }),
    makeStage(["circle", "square", "triangle", "star", "diamond", "heart"], ["heart", "circle", "diamond", "triangle", "star", "square", "circle", "heart"], { rule: "moving", moving: true, checkpoint: true }),
    makeStage(["circle", "square", "triangle"], ["triangle", "square", "circle", "triangle", "circle"], { rule: "memory", memory: true }),
    makeStage(["star", "diamond", "heart"], ["diamond", "heart", "star", "diamond", "heart"], { rule: "memory", memory: true }),
    makeStage(["circle", "star", "heart", "square"], ["star", "circle", "heart", "square", "star", "heart"], { rule: "memory", memory: true }),
    makeStage(["triangle", "star", "diamond", "heart"], ["heart", "triangle", "diamond", "star", "heart", "diamond"], { rule: "memory", memory: true }),
    makeStage(["circle", "square", "triangle", "star", "diamond", "heart"], ["square", "heart", "circle", "diamond", "triangle", "star", "square", "heart"], { rule: "memory", memory: true, checkpoint: true }),
    makeStage(["circle", "square", "triangle"], ["circle", "triangle", "square", "triangle", "circle"], { rule: "ticket", requireSelect: true }),
    makeStage(["star", "diamond", "heart"], ["heart", "diamond", "star", "heart", "star"], { rule: "ticket", requireSelect: true }),
    makeStage(["circle", "triangle", "diamond", "heart"], ["diamond", "circle", "heart", "triangle", "diamond", "heart"], { rule: "ticket", requireSelect: true }),
    makeStage(["square", "triangle", "star", "heart"], ["star", "square", "triangle", "heart", "star", "square"], { rule: "ticket", requireSelect: true }),
    makeStage(["circle", "square", "triangle", "star", "diamond", "heart"], ["triangle", "heart", "square", "diamond", "circle", "star", "heart", "triangle"], { rule: "ticket", requireSelect: true, checkpoint: true }),
    makeStage(["circle", "square", "triangle", "star"], ["star", "circle", "triangle", "square", "star", "triangle"], { rule: "expert", outline: true, moving: true }),
    makeStage(["circle", "star", "diamond", "heart"], ["heart", "diamond", "circle", "star", "heart", "circle"], { rule: "expert", memory: true, requireSelect: true }),
    makeStage(["square", "triangle", "star", "diamond"], ["diamond", "triangle", "square", "star", "diamond", "square"], { rule: "expert", outline: true, requireSelect: true }),
    makeStage(["circle", "square", "triangle", "star", "diamond"], ["triangle", "diamond", "circle", "star", "square", "diamond", "triangle"], { rule: "expert", moving: true, memory: true }),
    makeStage(["circle", "square", "triangle", "star", "diamond", "heart"], ["heart", "circle", "diamond", "triangle", "square", "star", "heart", "diamond"], { rule: "expert", outline: true, moving: true, memory: true, requireSelect: true, checkpoint: true }),
  ];

  const $ = (id) => document.getElementById(id);
  const nodes = {
    localeSelect: $("localeSelect"),
    menuPanel: $("menuPanel"),
    stagePanel: $("stagePanel"),
    startGameBtn: $("startGameBtn"),
    stageBackBtn: $("stageBackBtn"),
    stageGrid: $("stageGrid"),
    playPanel: $("playPanel"),
    backToStagesBtn: $("backToStagesBtn"),
    stageText: $("stageText"),
    progressFill: $("progressFill"),
    carGrid: $("carGrid"),
    trainTrack: document.querySelector(".train-track"),
    promptText: $("promptText"),
    passengerBtn: $("passengerBtn"),
    passengerShape: $("passengerShape"),
    feedbackText: $("feedbackText"),
    resultPanel: $("resultPanel"),
    resultTitle: $("resultTitle"),
    starText: $("starText"),
    resultText: $("resultText"),
    skillReportTitle: $("skillReportTitle"),
    logicLabel: $("logicLabel"),
    logicValue: $("logicValue"),
    focusLabel: $("focusLabel"),
    focusValue: $("focusValue"),
    coordinationLabel: $("coordinationLabel"),
    coordinationValue: $("coordinationValue"),
    progressComparison: $("progressComparison"),
    nextStageBtn: $("nextStageBtn"),
    retryBtn: $("retryBtn"),
    resultStagesBtn: $("resultStagesBtn"),
    resultLobby: document.querySelector("#resultPanel [data-ui='lobby']"),
    loadingPanel: $("loadingPanel"),
    loadingText: $("loadingText"),
    loadingFill: $("loadingFill"),
  };
  const resultActions = document.createElement("div");
  resultActions.className = "result-actions";
  resultActions.append(nodes.resultStagesBtn, nodes.nextStageBtn, nodes.retryBtn);
  nodes.resultLobby?.before(resultActions);
  nodes.resultLobby?.classList.add("hidden");
  nodes.resultLobby?.setAttribute("aria-hidden", "true");

  const ruleBadge = document.createElement("span");
  ruleBadge.id = "ruleBadge";
  ruleBadge.className = "rule-badge";
  ruleBadge.setAttribute("aria-hidden", "true");
  nodes.stageText.before(ruleBadge);
  nodes.ruleBadge = ruleBadge;

  const ruleBadges = Object.freeze({
    direct: "\u25cf",
    outline: "\u25cb",
    moving: "\u2194",
    memory: "\u25c9",
    ticket: "\u25a3",
    expert: "\u2605",
  });

  const leaveConfirmPanel = document.createElement("div");
  leaveConfirmPanel.id = "leaveConfirmPanel";
  leaveConfirmPanel.className = "shape-leave-confirm hidden";
  leaveConfirmPanel.setAttribute("role", "dialog");
  leaveConfirmPanel.setAttribute("aria-modal", "true");
  leaveConfirmPanel.setAttribute("aria-labelledby", "leaveConfirmTitle");
  leaveConfirmPanel.setAttribute("aria-describedby", "leaveConfirmMessage");
  leaveConfirmPanel.innerHTML = `
    <div class="leave-confirm-card">
      <strong id="leaveConfirmTitle"></strong>
      <p id="leaveConfirmMessage"></p>
      <div class="leave-confirm-actions">
        <button id="keepPlayingBtn" type="button"></button>
        <button id="leaveStageBtn" type="button"></button>
      </div>
    </div>
  `;
  nodes.playPanel.appendChild(leaveConfirmPanel);
  nodes.leaveConfirmPanel = leaveConfirmPanel;
  nodes.leaveConfirmTitle = $("leaveConfirmTitle");
  nodes.leaveConfirmMessage = $("leaveConfirmMessage");
  nodes.keepPlayingBtn = $("keepPlayingBtn");
  nodes.leaveStageBtn = $("leaveStageBtn");

  const legacySavedLocale = readStorage(localeKey);
  const canonicalSavedLocale = readStorage(canonicalLocaleKey);
  if (!canonicalSavedLocale && ["en", "zh-Hant", "zh-Hans"].includes(legacySavedLocale)) {
    writeStorage(canonicalLocaleKey, legacySavedLocale);
    try { window.WonderI18n?.setLocale?.(legacySavedLocale); } catch {}
  }
  let locale = window.WonderI18n?.locale?.() || canonicalSavedLocale || legacySavedLocale || "en";
  let unlocked = readUnlocked();
  let stars = readStars();
  let currentStage = 0;
  let currentTask = 0;
  let mistakes = 0;
  let firstTryMatches = 0;
  let currentTaskMistakes = 0;
  let currentShape = "circle";
  let selectedPassenger = false;
  let acceptingInput = false;
  let feedbackKey = "";
  let lastResult = null;
  let resultSettled = false;
  let stageEntryToken = 0;
  let taskTransitionToken = 0;
  let taskWindowFocused = true;
  let taskLifecycleSuspended = document.hidden;
  let floatingToast = null;
  let floatingToastTimer = 0;
  let memoryFrame = 0;
  let memoryToken = 0;
  let leaveConfirmOpen = false;
  let leaveConfirmTrigger = null;

  function cancelMemoryPassenger() {
    memoryToken += 1;
    if (memoryFrame) cancelAnimationFrame(memoryFrame);
    memoryFrame = 0;
    nodes.passengerBtn.classList.remove("is-memory-hidden");
  }

  function scheduleMemoryPassenger() {
    cancelMemoryPassenger();
    if (!stages[currentStage]?.memory) return;
    const token = ++memoryToken;
    let elapsed = 0;
    let previous = null;
    const step = (now) => {
      if (token !== memoryToken || !document.body.classList.contains("shape-playing")) return;
      if (taskLifecycleSuspended || document.hidden) {
        previous = null;
        memoryFrame = requestAnimationFrame(step);
        return;
      }
      if (previous !== null) elapsed += Math.min(48, now - previous);
      previous = now;
      if (elapsed < 1500) {
        memoryFrame = requestAnimationFrame(step);
        return;
      }
      memoryFrame = 0;
      nodes.passengerBtn.classList.add("is-memory-hidden");
      nodes.promptText.textContent = t("rememberPassenger");
    };
    memoryFrame = requestAnimationFrame(step);
  }

  function invalidateTaskTransition() {
    cancelMemoryPassenger();
    taskTransitionToken += 1;
    acceptingInput = false;
    selectedPassenger = false;
  }

  function scheduleTaskTransition(task, delay) {
    const token = taskTransitionToken;
    let remaining = delay;
    let lastFrameAt = null;
    const tick = (now) => {
      if (token !== taskTransitionToken || !document.body.classList.contains("shape-playing")) return;
      if (taskLifecycleSuspended || document.hidden) {
        lastFrameAt = null;
        requestAnimationFrame(tick);
        return;
      }
      if (lastFrameAt !== null) remaining -= Math.max(0, now - lastFrameAt);
      lastFrameAt = now;
      if (remaining <= 0) task();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function suspendTaskTransitions() {
    taskLifecycleSuspended = true;
  }

  function resumeTaskTransitions() {
    taskLifecycleSuspended = document.hidden || !taskWindowFocused || leaveConfirmOpen;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function readUnlocked() {
    const parsed = Number(readStorage(unlockKey));
    const repaired = clamp(Number.isFinite(parsed) ? Math.floor(parsed) : 1, 1, stages.length);
    writeStorage(unlockKey, repaired);
    return repaired;
  }

  function readStars() {
    let parsed;
    try {
      parsed = JSON.parse(readStorage(starKey) || "{}");
    } catch {
      parsed = {};
    }
    const repaired = {};
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      Object.entries(parsed).forEach(([stage, value]) => {
        const stageNo = Number(stage);
        const starCount = Number(value);
        if (!Number.isInteger(stageNo) || stageNo < 1 || stageNo > stages.length || !Number.isFinite(starCount) || starCount <= 0) return;
        repaired[stageNo] = clamp(Math.floor(starCount), 1, 3);
      });
    }
    writeStorage(starKey, JSON.stringify(repaired));
    return repaired;
  }

  function saveStars() {
    writeStorage(starKey, JSON.stringify(stars));
  }

  function t(key, data) {
    const parts = key.split(".");
    let value = text[locale] || text.en;
    for (const part of parts) value = value?.[part];
    if (typeof value !== "string") value = key;
    return Object.entries(data || {}).reduce((out, [name, item]) => out.replaceAll(`{${name}}`, item), value);
  }

  function playSound(name) {
    window.WonderSound?.play?.(name);
  }

  function track(event, payload = {}) {
    window.WonderAnalytics?.track(event, { game_id: GAME_ID, ...payload });
  }

  function localizeStatic() {
    document.documentElement.lang = window.WonderI18n?.actualLocale?.() || locale;
    updatePageMeta();
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
    nodes.localeSelect.value = locale;
    nodes.localeSelect.setAttribute("aria-label", t("language"));
    nodes.stageBackBtn.setAttribute("aria-label", t("back"));
    nodes.stageGrid.setAttribute("aria-label", t("stageList"));
    nodes.backToStagesBtn.setAttribute("aria-label", t("battleBack"));
    nodes.trainTrack?.setAttribute("aria-label", t("trainCars"));
    nodes.passengerBtn.setAttribute("aria-label", t("passenger", { shape: t(`shapes.${currentShape}`) }));
    nodes.leaveConfirmTitle.textContent = t("leaveTitle");
    nodes.leaveConfirmMessage.textContent = t("leaveMessage");
    nodes.keepPlayingBtn.textContent = t("keepPlaying");
    nodes.leaveStageBtn.textContent = t("leaveStage");
    const strategy = document.querySelector(".game-info-strategy");
    if (strategy) {
      const heading = strategy.querySelector("h3");
      const tips = strategy.querySelectorAll("li");
      if (heading) heading.textContent = t("guideStrategy");
      ["guideTipName", "guideTipLook", "guideTipRetry"].forEach((key, index) => {
        if (tips[index]) tips[index].textContent = t(key);
      });
    }
  }

  function preserveGameLocaleAfterSharedGuide() {
    queueMicrotask(localizeStatic);
    setTimeout(localizeStatic, 0);
    setTimeout(localizeStatic, 260);
    requestAnimationFrame(positionMainSoundToggle);
    setTimeout(positionMainSoundToggle, 300);
  }

  function positionMainSoundToggle() {
    if (document.body.classList.contains("shape-playing") || document.body.classList.contains("wp-standard-stage-page")) return;
    const toggle = document.querySelector(".sound-toggle");
    const title = document.querySelector(".title-block")?.getBoundingClientRect();
    const topbar = document.querySelector(".topbar")?.getBoundingClientRect();
    if (!toggle || !title || !topbar) return;
    const rtl = document.documentElement.dir === "rtl";
    const x = rtl ? title.left + 6 : title.right - 48;
    toggle.style.setProperty("left", `${Math.round(x)}px`, "important");
    toggle.style.setProperty("top", `${Math.round(topbar.top + 3)}px`, "important");
    toggle.style.setProperty("right", "auto", "important");
    toggle.style.setProperty("bottom", "auto", "important");
  }

  function updateMetaContent(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.setAttribute("content", value);
  }

  function updatePageMeta() {
    document.title = t("pageTitle");
    updateMetaContent('meta[name="description"]', t("metaDescription"));
    updateMetaContent('meta[property="og:title"]', t("metaOgTitle"));
    updateMetaContent('meta[property="og:description"]', t("metaOgDescription"));
    updateMetaContent('meta[name="twitter:title"]', t("metaOgTitle"));
    updateMetaContent('meta[name="twitter:description"]', t("metaOgDescription"));
  }

  function activateStageNumber(stageNo) {
    if (stageNo > unlocked) {
      showFloatingText(t("locked"));
      playSound("click");
      return;
    }
    startStage(stageNo - 1);
  }

  let centeredStageFrame = 0;
  function updateCenteredStageCard() {
    const cards = [...nodes.stageGrid.querySelectorAll(".stage-card")];
    if (!cards.length || !document.body.classList.contains("wp-standard-stage-page")) return;
    const railRect = nodes.stageGrid.getBoundingClientRect(), railCenter = railRect.left + railRect.width / 2;
    const centered = cards.reduce((nearest, card) => {
      const rect = card.getBoundingClientRect(), distance = Math.abs(rect.left + rect.width / 2 - railCenter);
      return !nearest || distance < nearest.distance ? { card, distance } : nearest;
    }, null)?.card;
    cards.forEach((card) => {
      const isCentered = card === centered;
      card.classList.toggle("is-centered", isCentered);
      if (isCentered) card.setAttribute("aria-current", "true"); else card.removeAttribute("aria-current");
    });
  }

  function scheduleCenteredStageCard() {
    cancelAnimationFrame(centeredStageFrame);
    centeredStageFrame = requestAnimationFrame(updateCenteredStageCard);
  }

  function centerCurrentStage(token = stageEntryToken) {
    if (token !== stageEntryToken || !document.body.classList.contains("wp-standard-stage-page")) return;
    const available = [...nodes.stageGrid.querySelectorAll(".stage-card:not(.locked)")].at(-1);
    if (!available) return;
    const target = available.offsetLeft - (nodes.stageGrid.clientWidth - available.offsetWidth) / 2;
    nodes.stageGrid.style.setProperty("scroll-behavior", "auto", "important");
    nodes.stageGrid.style.setProperty("scroll-snap-type", "none", "important");
    nodes.stageGrid.scrollLeft = target;
    scheduleCenteredStageCard();
    requestAnimationFrame(() => {
      if (token !== stageEntryToken) return;
      nodes.stageGrid.style.removeProperty("scroll-behavior");
      nodes.stageGrid.style.removeProperty("scroll-snap-type");
    });
  }

  function scheduleCurrentStageCenter() {
    const token = ++stageEntryToken;
    centerCurrentStage(token);
    requestAnimationFrame(() => requestAnimationFrame(() => centerCurrentStage(token)));
    [160, 600].forEach((delay) => setTimeout(() => centerCurrentStage(token), delay));
    document.fonts?.ready?.then(() => centerCurrentStage(token));
  }

  function focusCurrentStage() {
    const available = [...nodes.stageGrid.querySelectorAll(".stage-card:not(.locked)")].at(-1);
    available?.focus({ preventScroll: true });
  }

  function renderStageGrid() {
    nodes.stageGrid.innerHTML = "";
    stages.forEach((stage, index) => {
      const stageNo = index + 1;
      const button = document.createElement("button");
      button.className = "stage-card";
      button.type = "button";
      button.dataset.stage = String(stageNo);
      if (stageNo > unlocked) button.classList.add("locked");
      button.innerHTML = `
        <b class="stage-shapes">${stage.cars.map((shape) => `<img src="${shapes[shape].token}" alt="" />`).join("")}</b>
        <strong>${t("stage", { n: stageNo })}</strong>
        <em>${t(`rules.${stage.rule}`)}${stage.checkpoint ? ` · ${t("checkpoint")}` : ""}</em>
        <span>${"★".repeat(stars[stageNo] || 0)}${"☆".repeat(3 - (stars[stageNo] || 0))}</span>
      `;
      nodes.stageGrid.appendChild(button);
    });
    scheduleCenteredStageCard();
  }

  function updateStageFrame() {
    if (!document.body.classList.contains("wp-standard-stage-page")) return;
    const viewport = window.visualViewport;
    const safeWidth = Math.round(viewport?.width || innerWidth);
    const width = Math.min(Math.max(1, safeWidth), 920);
    const height = Math.round(viewport?.height || innerHeight);
    const scale = Math.min(width / 390, height / 844);
    const logicalWidth = width / scale;
    const logicalHeight = height / scale;
    const root = document.documentElement.style;
    root.setProperty("--shape-stage-scale", String(scale));
    root.setProperty("--shape-stage-left", `${(viewport?.offsetLeft || 0) + Math.max(0, (safeWidth - width) / 2)}px`);
    root.setProperty("--shape-stage-top", "0px");
    root.setProperty("--shape-stage-logical-width", `${logicalWidth}px`);
    root.setProperty("--shape-stage-logical-height", `${logicalHeight}px`);
    nodes.stagePanel.dataset.wpCommonScale = String(scale);
    nodes.stagePanel.dataset.wpLogicalWidth = String(logicalWidth);
    nodes.stagePanel.dataset.wpLogicalHeight = String(logicalHeight);
  }

  function updateShapeFrame() {
    if (!document.body.classList.contains("shape-playing")) return;
    const viewport = window.visualViewport;
    const visualWidth = Math.round(viewport?.width || 0);
    const visualHeight = Math.round(viewport?.height || 0);
    const useVisual = visualWidth > 0
      && visualHeight > 0
      && Math.abs(visualWidth - innerWidth) <= 2
      && visualHeight <= innerHeight + 2;
    const safeWidth = useVisual ? visualWidth : innerWidth;
    const width = Math.min(Math.max(1, safeWidth), 920);
    document.documentElement.style.setProperty("--shape-vw", `${width}px`);
    document.documentElement.style.setProperty("--shape-vh", `${useVisual ? visualHeight : innerHeight}px`);
    const height = useVisual ? visualHeight : innerHeight;
    const scale = Math.min(width / 362, height / 710);
    nodes.playPanel.dataset.wpCommonScale = String(scale);
    nodes.playPanel.dataset.wpLogicalWidth = String(width / scale);
    nodes.playPanel.dataset.wpLogicalHeight = String(height / scale);
    requestAnimationFrame(updateResultControlSize);
  }

  function updateResultControlSize() {
    const declaredScale = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--wp-battle-canvas-scale")
    );
    const transform = getComputedStyle(nodes.playPanel).transform;
    const renderedScale = transform && transform !== "none"
      ? Math.abs(new DOMMatrixReadOnly(transform).a)
      : Number.NaN;
    const scale = Number.isFinite(renderedScale) && renderedScale > 0
      ? renderedScale
      : Number.isFinite(declaredScale) && declaredScale > 0 ? declaredScale : 1;
    const root = document.documentElement.style;
    root.setProperty(
      "--shape-result-control-min-height",
      `${Math.max(50, 50 / scale)}px`
    );
    root.setProperty("--shape-result-action-font-size", `${Math.max(14, 13 / scale)}px`);
    root.setProperty("--shape-result-essential-font-size", `${Math.max(17, 13 / scale)}px`);
    root.setProperty("--shape-result-detail-font-size", `${Math.max(12, 12 / scale)}px`);
    requestAnimationFrame(() => calibrateResultControlSize(0));
  }

  function calibrateResultControlSize(attempt) {
    if (nodes.resultPanel.classList.contains("hidden") || attempt >= 3) return;
    const button = nodes.resultPanel.querySelector(".result-actions button");
    const renderedHeight = button?.getBoundingClientRect().height || 0;
    if (renderedHeight >= 49) return;
    const root = document.documentElement.style;
    const currentHeight = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--shape-result-control-min-height")
    ) || 48;
    root.setProperty(
      "--shape-result-control-min-height",
      `${currentHeight * (49.5 / Math.max(1, renderedHeight))}px`
    );
    requestAnimationFrame(() => calibrateResultControlSize(attempt + 1));
  }

  new MutationObserver(() => {
    if (!nodes.resultPanel.classList.contains("hidden")) updateResultControlSize();
  }).observe(nodes.resultPanel, { attributes: true, attributeFilter: ["class", "style"] });

  function exitSharedPlayViewport() {
    window.WeightPlayGame?.exitMobileGameMode?.();
    document.body.classList.remove("weightplay-active-viewport", "wp-mobile-game-mode");
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    if (document.webkitFullscreenElement) document.webkitExitFullscreen?.();
  }

  function setLeaveConfirmOwnership(active) {
    [".play-head", ".train-track", ".passenger-area", ".feedback"].forEach((selector) => {
      const node = nodes.playPanel.querySelector(selector);
      if (!node) return;
      node.inert = active;
      if (active) node.setAttribute("aria-hidden", "true");
      else node.removeAttribute("aria-hidden");
    });
  }

  function closeLeaveConfirm(restoreFocus = true) {
    if (!leaveConfirmOpen) return;
    leaveConfirmOpen = false;
    nodes.leaveConfirmPanel.classList.add("hidden");
    setLeaveConfirmOwnership(false);
    resumeTaskTransitions();
    const trigger = leaveConfirmTrigger;
    leaveConfirmTrigger = null;
    if (restoreFocus && trigger?.isConnected) trigger.focus({ preventScroll: true });
  }

  function openLeaveConfirm() {
    if (leaveConfirmOpen || !document.body.classList.contains("shape-playing") || nodes.playPanel.classList.contains("is-result")) return;
    leaveConfirmOpen = true;
    leaveConfirmTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : nodes.backToStagesBtn;
    suspendTaskTransitions();
    setLeaveConfirmOwnership(true);
    nodes.leaveConfirmPanel.classList.remove("hidden");
    requestAnimationFrame(() => nodes.keepPlayingBtn.focus({ preventScroll: true }));
  }

  function leaveCurrentRoute() {
    closeLeaveConfirm(false);
    showMenu(true);
  }

  window.addEventListener("resize", updateShapeFrame);
  window.addEventListener("resize", updateStageFrame);
  window.addEventListener("resize", scheduleCenteredStageCard, { passive: true });
  window.addEventListener("orientationchange", updateShapeFrame);
  window.addEventListener("orientationchange", updateStageFrame);
  window.visualViewport?.addEventListener("resize", updateShapeFrame, { passive: true });
  window.visualViewport?.addEventListener("resize", updateStageFrame, { passive: true });
  window.visualViewport?.addEventListener("resize", scheduleCenteredStageCard, { passive: true });

  function showMenu(focusStage = true) {
    closeLeaveConfirm(false);
    clearFloatingText();
    invalidateTaskTransition();
    nodes.menuPanel.classList.add("hidden");
    nodes.stagePanel.classList.remove("hidden");
    nodes.playPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.playPanel.classList.remove("is-result");
    setResultOwnership(false);
    document.body.classList.remove("shape-playing");
    document.body.classList.add("wp-standard-stage-page");
    document.querySelector(".shape-game")?.setAttribute("data-play-viewport", "");
    selectedPassenger = false;
    renderStageGrid();
    updateStageFrame();
    scheduleCurrentStageCenter();
    if (focusStage) requestAnimationFrame(focusCurrentStage);
  }

  function showMain(focusStart = false) {
    clearFloatingText();
    invalidateTaskTransition();
    stageEntryToken += 1;
    nodes.stagePanel.classList.add("hidden");
    nodes.menuPanel.classList.remove("hidden");
    document.body.classList.remove("wp-standard-stage-page");
    requestAnimationFrame(positionMainSoundToggle);
    if (focusStart) restoreMainStartFocus();
  }

  function restoreMainStartFocus() {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!nodes.menuPanel.classList.contains("hidden")) nodes.startGameBtn.focus({ preventScroll: true });
    }));
  }

  function focusPlayPanel() {
    const targetY = Math.max(0, nodes.playPanel.getBoundingClientRect().top + window.scrollY - 8);
    window.scrollTo({ top: targetY, left: 0, behavior: "auto" });
    requestAnimationFrame(() => {
      const refreshedY = Math.max(0, nodes.playPanel.getBoundingClientRect().top + window.scrollY - 8);
      window.scrollTo({ top: refreshedY, left: 0, behavior: "auto" });
    });
  }

  function startStage(index) {
    closeLeaveConfirm(false);
    clearFloatingText();
    invalidateTaskTransition();
    currentStage = index;
    currentTask = 0;
    mistakes = 0;
    firstTryMatches = 0;
    currentTaskMistakes = 0;
    acceptingInput = true;
    selectedPassenger = false;
    feedbackKey = "";
    lastResult = null;
    nodes.menuPanel.classList.add("hidden");
    nodes.stagePanel.classList.add("hidden");
    nodes.playPanel.classList.remove("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.playPanel.classList.remove("is-result");
    setResultOwnership(false);
    document.body.classList.remove("wp-standard-stage-page");
    document.body.classList.add("shape-playing");
    nodes.playPanel.dataset.rule = stages[index].rule;
    nodes.ruleBadge.textContent = ruleBadges[stages[index].rule] || ruleBadges.direct;
    nodes.playPanel.classList.toggle("is-outline", Boolean(stages[index].outline));
    document.querySelector(".shape-game")?.removeAttribute("data-play-viewport");
    renderCars();
    renderTask();
    exitSharedPlayViewport();
    updateShapeFrame();
    playSound("start");
    track("game_start", { level: index + 1 });
    requestAnimationFrame(() => {
      exitSharedPlayViewport();
      updateShapeFrame();
    });
  }

  function renderCars() {
    const stage = stages[currentStage];
    nodes.carGrid.innerHTML = "";
    nodes.carGrid.dataset.carCount = String(stage.cars.length);
    nodes.carGrid.style.gridTemplateColumns = `repeat(${Math.min(stage.cars.length, 4)}, minmax(0, 1fr))`;
    const offset = stage.moving ? currentTask % stage.cars.length : 0;
    const carOrder = [...stage.cars.slice(offset), ...stage.cars.slice(0, offset)];
    carOrder.forEach((shape) => {
      const car = document.createElement("button");
      car.className = "train-car";
      car.type = "button";
      car.dataset.shape = shape;
      car.innerHTML = `
        <img class="car-art" src="${trainCarAsset}" alt="" />
        <img class="car-shape" src="${shapes[shape].token}" alt="${t(`shapes.${shape}`)}" />
      `;
      car.addEventListener("keydown", (event) => {
        if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
      });
      car.addEventListener("click", () => chooseCar(shape, car));
      car.addEventListener("dragover", (event) => event.preventDefault());
      car.addEventListener("drop", (event) => {
        event.preventDefault();
        chooseCar(shape, car);
      });
      nodes.carGrid.appendChild(car);
    });
  }

  function renderTask() {
    const stage = stages[currentStage];
    currentShape = stage.tasks[currentTask];
    const shape = shapes[currentShape];
    nodes.stageText.textContent = `${t("stage", { n: currentStage + 1 })} · ${t(`rules.${stage.rule}`)}`;
    nodes.progressFill.style.width = `${(currentTask / stage.tasks.length) * 100}%`;
    nodes.promptText.textContent = t("prompt", { shape: t(`shapes.${currentShape}`) });
    nodes.feedbackText.textContent = "";
    feedbackKey = "";
    nodes.passengerShape.className = "shape-token";
    nodes.passengerShape.dataset.shape = currentShape;
    nodes.passengerShape.innerHTML = `
      <img class="passenger-animal" src="${passengerAnimals[currentShape]}" alt="" />
      <img class="passenger-shape-badge" src="${shape.token}" alt="${t(`shapes.${currentShape}`)}" />
    `;
    nodes.passengerBtn.setAttribute("aria-label", t("passenger", { shape: t(`shapes.${currentShape}`) }));
    nodes.passengerBtn.classList.remove("wrong");
    selectedPassenger = false;
    markTarget(false);
    scheduleMemoryPassenger();
  }

  function chooseCar(shape, car) {
    if (!acceptingInput) return;
    const stage = stages[currentStage];
    if (stage.requireSelect && !selectedPassenger) {
      mistakes += 1;
      currentTaskMistakes += 1;
      feedbackKey = "selectFirst";
      nodes.feedbackText.textContent = t(feedbackKey);
      nodes.passengerBtn.classList.add("wrong");
      playSound("wrong");
      return;
    }
    if (!selectedPassenger) {
      selectedPassenger = true;
      markTarget(true);
    }
    if (shape !== currentShape) {
      mistakes += 1;
      currentTaskMistakes += 1;
      feedbackKey = "wrong";
      nodes.feedbackText.textContent = t(feedbackKey);
      car.classList.remove("wrong");
      nodes.passengerBtn.classList.remove("wrong");
      void car.offsetWidth;
      car.classList.add("wrong");
      nodes.passengerBtn.classList.add("wrong");
      playSound("wrong");
      track("game_answer", { level: currentStage + 1, correct: false, task: currentShape, answer: shape });
      return;
    }

    acceptingInput = false;
    if (currentTaskMistakes === 0) firstTryMatches += 1;
    car.classList.add("correct");
    feedbackKey = "correct";
    nodes.feedbackText.textContent = t(feedbackKey);
    playSound("success");
    track("game_answer", { level: currentStage + 1, correct: true, task: currentShape, answer: shape });
    scheduleTaskTransition(() => {
      currentTask += 1;
      currentTaskMistakes = 0;
      car.classList.remove("correct");
      if (currentTask >= stages[currentStage].tasks.length) {
        finishStage();
      } else {
        acceptingInput = true;
        if (stages[currentStage].moving) renderCars();
        renderTask();
      }
    }, 520);
  }

  function markTarget(active) {
    nodes.carGrid.querySelectorAll(".train-car").forEach((car) => {
      car.classList.toggle("target", active && car.dataset.shape === currentShape);
    });
  }

  function finishStage() {
    invalidateTaskTransition();
    const stageNo = currentStage + 1;
    const earned = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    const previousBest = stars[stageNo] || 0;
    stars[stageNo] = Math.max(stars[stageNo] || 0, earned);
    saveStars();
    if (stageNo === unlocked && unlocked < stages.length) {
      unlocked += 1;
      writeStorage(unlockKey, unlocked);
    }
    nodes.progressFill.style.width = "100%";
    lastResult = { earned, previousBest, count: stages[currentStage].tasks.length };
    resultSettled = false;
    renderResult(lastResult);
    nodes.playPanel.classList.add("is-result");
    nodes.resultPanel.classList.remove("hidden");
    updateResultControlSize();
    setResultOwnership(true);
    nodes.playPanel.scrollTop = 0;
    nodes.playPanel.scrollLeft = 0;
    requestAnimationFrame(() => {
      nodes.playPanel.scrollTop = 0;
      nodes.playPanel.scrollLeft = 0;
      (nodes.resultPanel.querySelector(".primary-action") || nodes.retryBtn).focus({ preventScroll: true });
    });
    playSound("win");
    track("game_complete", { level: stageNo, stars: earned, mistakes });
  }

  function renderResult(result) {
    nodes.resultTitle.textContent = result.earned === 3 ? t("perfect") : result.earned === 2 ? t("good") : t("keep");
    nodes.starText.textContent = "★".repeat(result.earned) + "☆".repeat(3 - result.earned);
    nodes.resultText.textContent = t("result", { count: result.count });
    renderSkillReport(result.earned, result.previousBest);
    const hasNextStage = currentStage < stages.length - 1;
    nodes.nextStageBtn.classList.remove("hidden");
    nodes.nextStageBtn.disabled = !hasNextStage;
    nodes.nextStageBtn.setAttribute("aria-disabled", String(!hasNextStage));
    nodes.nextStageBtn.classList.toggle("primary-action", hasNextStage);
    nodes.resultStagesBtn.classList.toggle("primary-action", !hasNextStage);
    nodes.retryBtn.classList.remove("primary-action");
  }

  function setResultOwnership(active) {
    [".play-head", ".train-track", ".passenger-area", ".feedback"].forEach((selector) => {
      const node = nodes.playPanel.querySelector(selector);
      if (!node) return;
      node.inert = active;
      if (active) node.setAttribute("aria-hidden", "true");
      else node.removeAttribute("aria-hidden");
    });
  }

  function visibleResultActions() {
    return [...nodes.resultPanel.querySelectorAll("button, a")].filter((node) => !node.classList.contains("hidden") && !node.disabled && node.getClientRects().length > 0);
  }

  function settleResult(action) {
    if (resultSettled || nodes.resultPanel.classList.contains("hidden")) return;
    resultSettled = true;
    action();
  }

  function refreshActiveTaskLocale() {
    nodes.stageText.textContent = `${t("stage", { n: currentStage + 1 })} · ${t(`rules.${stages[currentStage].rule}`)}`;
    nodes.promptText.textContent = t("prompt", { shape: t(`shapes.${currentShape}`) });
    nodes.passengerShape.querySelector(".passenger-shape-badge")?.setAttribute("alt", t(`shapes.${currentShape}`));
    nodes.passengerBtn.setAttribute("aria-label", t("passenger", { shape: t(`shapes.${currentShape}`) }));
    nodes.carGrid.querySelectorAll(".train-car").forEach((car) => {
      car.querySelector(".car-shape")?.setAttribute("alt", t(`shapes.${car.dataset.shape}`));
    });
    if (feedbackKey) nodes.feedbackText.textContent = t(feedbackKey);
  }

  function renderSkillReport(earned, previousBest) {
    const matches = stages[currentStage].tasks.length;
    nodes.skillReportTitle.textContent = t("skillReport");
    nodes.logicLabel.textContent = t("logic");
    nodes.logicValue.textContent = t("logicValue", { count: matches });
    nodes.focusLabel.textContent = t("focus");
    nodes.focusValue.textContent = t("focusValue", { firstTry: firstTryMatches, retries: mistakes });
    nodes.coordinationLabel.textContent = t("coordination");
    nodes.coordinationValue.textContent = t("coordinationValue", { count: matches });
    nodes.progressComparison.textContent = previousBest > 0
      ? t(earned > previousBest ? "newBest" : "progress", { stars: earned, previous: previousBest })
      : t("firstFinish", { stars: earned });
  }

  function clearFloatingText() {
    if (floatingToastTimer) clearTimeout(floatingToastTimer);
    floatingToastTimer = 0;
    floatingToast?.remove();
    floatingToast = null;
  }

  function showFloatingText(message) {
    clearFloatingText();
    const toast = document.createElement("div");
    toast.className = "floating-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.setAttribute("aria-atomic", "true");
    toast.textContent = message;
    Object.assign(toast.style, {
      position: "fixed",
      left: "50%",
      top: "52%",
      zIndex: "40",
      transform: "translate(-50%, -50%)",
      padding: "12px 18px",
      borderRadius: "999px",
      background: "rgba(23, 49, 79, 0.9)",
      color: "#fff",
      fontWeight: "900",
      pointerEvents: "none",
      animation: "toastUp 1.15s ease forwards",
    });
    document.body.appendChild(toast);
    floatingToast = toast;
    toast.addEventListener("animationend", () => {
      if (floatingToast === toast) clearFloatingText();
    }, { once: true });
    floatingToastTimer = setTimeout(() => {
      if (floatingToast === toast) clearFloatingText();
    }, 1200);
  }

  function initPassenger() {
    nodes.passengerBtn.addEventListener("click", () => {
      if (!acceptingInput) return;
      if (nodes.passengerBtn.classList.contains("is-memory-hidden")) {
        nodes.passengerBtn.classList.remove("is-memory-hidden");
        nodes.promptText.textContent = t("prompt", { shape: t(`shapes.${currentShape}`) });
        scheduleMemoryPassenger();
      }
      selectedPassenger = true;
      markTarget(true);
      playSound("click");
    });
    nodes.passengerBtn.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", currentShape);
      selectedPassenger = true;
      markTarget(true);
    });
  }

  function initStageRail() {
    nodes.stageGrid.addEventListener("scroll", scheduleCenteredStageCard, { passive: true });
    nodes.stageGrid.addEventListener("wonder:stage-snap", scheduleCenteredStageCard);
    nodes.stageGrid.addEventListener("pointerdown", (event) => {
      if (!document.body.classList.contains("wp-standard-stage-page") || event.isPrimary === false || event.button !== 0) return;
      stageEntryToken += 1;
    }, true);
  nodes.stageGrid.addEventListener("click", (event) => {
      const directHit = event.target.closest?.(".stage-card");
      const coordinateHit = [...nodes.stageGrid.querySelectorAll(".stage-card")].find((card) => {
        const rect = card.getBoundingClientRect();
        return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      });
      const hit = directHit || coordinateHit;
      if (!hit) return;
      event.preventDefault();
      event.stopPropagation();
      activateStageNumber(Number(hit.dataset.stage));
    }, true);
  }

  function initLoading() {
    let progress = 0;
    const timer = setInterval(() => {
      progress = Math.min(100, progress + 20);
      nodes.loadingText.textContent = `${progress}%`;
      nodes.loadingFill.style.width = `${progress}%`;
      if (progress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          nodes.loadingPanel.classList.add("hidden");
          track("game_ready");
        }, 180);
      }
    }, 110);
  }

  function bindEvents() {
    const rejectRepeatedScreenActivation = (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
    };
    nodes.startGameBtn.addEventListener("keydown", rejectRepeatedScreenActivation);
    nodes.stageGrid.addEventListener("keydown", (event) => {
      if (event.target.closest(".stage-card")) rejectRepeatedScreenActivation(event);
    });
    nodes.startGameBtn.addEventListener("click", () => showMenu(true));
    nodes.stageBackBtn.addEventListener("click", restoreMainStartFocus, true);
    nodes.stageBackBtn.addEventListener("click", () => showMain(true));
    nodes.localeSelect.addEventListener("change", () => {
      const requested = nodes.localeSelect.value;
      try { window.WonderI18n?.setLocale?.(requested); } catch {}
      locale = window.WonderI18n?.locale?.() || requested;
      writeStorage(localeKey, requested);
      localizeStatic();
      preserveGameLocaleAfterSharedGuide();
      renderStageGrid();
      if (!nodes.resultPanel.classList.contains("hidden") && lastResult) {
        renderResult(lastResult);
      } else if (!nodes.playPanel.classList.contains("hidden")) {
        refreshActiveTaskLocale();
      }
    });
    nodes.backToStagesBtn.addEventListener("click", openLeaveConfirm);
    nodes.keepPlayingBtn.addEventListener("click", () => closeLeaveConfirm(true));
    nodes.leaveStageBtn.addEventListener("click", leaveCurrentRoute);
    nodes.leaveConfirmPanel.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        closeLeaveConfirm(true);
        return;
      }
      if (event.key !== "Tab") return;
      const actions = [nodes.keepPlayingBtn, nodes.leaveStageBtn];
      const index = actions.indexOf(document.activeElement);
      const nextIndex = event.shiftKey ? (index <= 0 ? actions.length - 1 : index - 1) : (index >= actions.length - 1 ? 0 : index + 1);
      event.preventDefault();
      actions[nextIndex].focus({ preventScroll: true });
    }, true);
    nodes.resultStagesBtn.addEventListener("click", () => settleResult(() => showMenu(true)));
    nodes.retryBtn.addEventListener("click", () => {
      settleResult(() => {
        track("game_restart", { level: currentStage + 1, mistakes });
        startStage(currentStage);
      });
    });
    nodes.nextStageBtn.addEventListener("click", () => settleResult(() => startStage(Math.min(currentStage + 1, stages.length - 1))));
    nodes.resultPanel.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      if (event.key !== "Tab" || nodes.resultPanel.classList.contains("hidden")) return;
      const actions = visibleResultActions();
      if (!actions.length) return;
      const index = actions.indexOf(document.activeElement);
      const nextIndex = event.shiftKey
        ? (index <= 0 ? actions.length - 1 : index - 1)
        : (index < 0 || index >= actions.length - 1 ? 0 : index + 1);
      event.preventDefault();
      actions[nextIndex].focus({ preventScroll: true });
    }, true);
  }

  const style = document.createElement("style");
  style.textContent = "@keyframes toastUp{to{transform:translate(-50%,-120%);opacity:0}}";
  document.head.appendChild(style);

  localizeStatic();
  window.addEventListener("load", preserveGameLocaleAfterSharedGuide, { once: true });
  window.addEventListener("resize", () => requestAnimationFrame(positionMainSoundToggle));
  window.addEventListener("blur", () => {
    taskWindowFocused = false;
    suspendTaskTransitions();
  });
  window.addEventListener("focus", () => {
    taskWindowFocused = true;
    resumeTaskTransitions();
  });
  window.addEventListener("pagehide", suspendTaskTransitions);
  window.addEventListener("pageshow", resumeTaskTransitions);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) suspendTaskTransitions();
    else resumeTaskTransitions();
  });
  bindEvents();
  initPassenger();
  initStageRail();
  renderStageGrid();
  initLoading();
  if (new URLSearchParams(location.search).has("smoke")) {
    window.__shapeTrainSmoke = {
      stages: stages.map((stage, index) => ({ id: index + 1, cars: [...stage.cars], tasks: [...stage.tasks], rule: stage.rule, checkpoint: Boolean(stage.checkpoint), outline: Boolean(stage.outline), moving: Boolean(stage.moving), memory: Boolean(stage.memory), requireSelect: Boolean(stage.requireSelect) })),
      unlockAll() {
        unlocked = stages.length;
        writeStorage(unlockKey, unlocked);
        showMenu();
      },
      startStage(number) { startStage(clamp(Number(number) || 1, 1, stages.length) - 1); },
      snapshot() { return { stage: currentStage + 1, task: currentTask, shape: currentShape, selectedPassenger, mistakes, acceptingInput }; },
    };
  }
})();
