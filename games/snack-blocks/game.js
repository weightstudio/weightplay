(function () {
  const GAME_ID = "snack-blocks";
  const columns = 7;
  const rows = 10;
  const matchClearDuration = 360;
  const dropSettleDuration = 360;
  const snacks = ["ST", "CK", "JM", "GR", "CH", "PR"];
  const snackArt = {
    ST: { label: "Strawberry", asset: "assets/tile-strawberry.png" },
    CK: { label: "Cookie", asset: "assets/tile-cookie.png" },
    JM: { label: "Candy", asset: "assets/tile-candy.png" },
    GR: { label: "Grape", asset: "assets/tile-grape.png" },
    CH: { label: "Cheese", asset: "assets/tile-cheese.png" },
    PR: { label: "Pretzel", asset: "assets/tile-pretzel.png" },
  };
  const effectArt = {
    matchBurst: "assets/effect-match-burst.png",
  };
  const canonicalLocaleKey = "weightPlayLocale";
  const legacyLocaleKey = "weightplayLocale";
  const unlockKey = "snackBlocksUnlocked";
  const recordKey = "snackBlocksRecords";

  const stages = [
    { id: 1, chapter: "Picnic Path", goal: "score", target: 650, moves: 18, pool: ["ST", "CK", "JM", "GR"] },
    { id: 2, chapter: "Picnic Path", goal: "collect", snack: "ST", target: 9, moves: 19, pool: ["ST", "CK", "JM", "GR"] },
    { id: 3, chapter: "Picnic Path", goal: "burst", target: 4, moves: 20, pool: ["ST", "CK", "JM", "GR"] },
    { id: 4, chapter: "Picnic Path", goal: "score", target: 1300, moves: 21, pool: ["ST", "CK", "JM", "GR", "CH"] },
    { id: 5, chapter: "Picnic Path", checkpoint: "Picnic Bell", goal: "dual", snack: "ST", collectTarget: 10, scoreTarget: 1000, moves: 22, pool: ["ST", "CK", "JM", "GR", "CH"] },
    { id: 6, chapter: "Cookie Crossing", goal: "collect", snack: "CK", target: 11, moves: 22, pool: ["CK", "JM", "GR", "CH"] },
    { id: 7, chapter: "Cookie Crossing", goal: "cascade", target: 2, moves: 22, pool: ["CK", "JM", "GR", "CH", "PR"] },
    { id: 8, chapter: "Cookie Crossing", goal: "burst", target: 5, moves: 23, pool: ["ST", "CK", "GR", "CH", "PR"] },
    { id: 9, chapter: "Cookie Crossing", goal: "collectPair", snacks: ["CK", "JM"], target: 16, moves: 24, pool: ["ST", "CK", "JM", "CH", "PR"] },
    { id: 10, chapter: "Cookie Crossing", checkpoint: "Bakery Gate", goal: "dual", snack: "CK", collectTarget: 14, scoreTarget: 1500, moves: 25, pool: ["ST", "CK", "JM", "GR", "CH", "PR"] },
    { id: 11, chapter: "Grape Garden", goal: "collect", snack: "GR", target: 13, moves: 24, pool: ["ST", "JM", "GR", "CH"] },
    { id: 12, chapter: "Grape Garden", goal: "score", target: 2300, moves: 25, pool: ["ST", "CK", "GR", "CH", "PR"] },
    { id: 13, chapter: "Grape Garden", goal: "cascade", target: 2, moves: 25, pool: ["ST", "CK", "JM", "GR", "PR"] },
    { id: 14, chapter: "Grape Garden", goal: "collectPair", snacks: ["GR", "CH"], target: 18, moves: 26, pool: ["ST", "CK", "GR", "CH", "PR"] },
    { id: 15, chapter: "Grape Garden", checkpoint: "Garden Drum", goal: "dual", snack: "GR", collectTarget: 15, scoreTarget: 2100, moves: 27, pool: ["ST", "CK", "JM", "GR", "CH", "PR"] },
    { id: 16, chapter: "Cheese Workshop", goal: "burst", target: 5, moves: 25, pool: ["ST", "CK", "JM", "CH"] },
    { id: 17, chapter: "Cheese Workshop", goal: "collect", snack: "CH", target: 15, moves: 26, pool: ["CK", "JM", "GR", "CH", "PR"] },
    { id: 18, chapter: "Cheese Workshop", goal: "cascade", target: 3, moves: 27, pool: ["ST", "CK", "JM", "GR", "CH"] },
    { id: 19, chapter: "Cheese Workshop", goal: "collectPair", snacks: ["CH", "PR"], target: 20, moves: 28, pool: ["ST", "CK", "GR", "CH", "PR"] },
    { id: 20, chapter: "Cheese Workshop", checkpoint: "Workshop Clock", goal: "dual", snack: "CH", collectTarget: 17, scoreTarget: 2800, moves: 29, pool: ["ST", "CK", "JM", "GR", "CH", "PR"] },
    { id: 21, chapter: "Pretzel Bridge", goal: "collect", snack: "PR", target: 16, moves: 27, pool: ["ST", "JM", "GR", "CH", "PR"] },
    { id: 22, chapter: "Pretzel Bridge", goal: "burst", target: 6, moves: 28, pool: ["CK", "JM", "GR", "CH", "PR"] },
    { id: 23, chapter: "Pretzel Bridge", goal: "score", target: 3900, moves: 29, pool: ["ST", "CK", "JM", "GR", "CH", "PR"] },
    { id: 24, chapter: "Pretzel Bridge", goal: "collectPair", snacks: ["ST", "PR"], target: 22, moves: 30, pool: ["ST", "CK", "JM", "GR", "CH", "PR"] },
    { id: 25, chapter: "Pretzel Bridge", checkpoint: "Bridge Banquet", goal: "dual", snack: "PR", collectTarget: 19, scoreTarget: 3400, moves: 31, pool: ["ST", "CK", "JM", "GR", "CH", "PR"] },
    { id: 26, chapter: "Crown Feast", goal: "cascade", target: 3, moves: 29, pool: ["ST", "CK", "JM", "GR", "CH"] },
    { id: 27, chapter: "Crown Feast", goal: "burst", target: 6, moves: 30, pool: ["ST", "CK", "JM", "GR", "PR"] },
    { id: 28, chapter: "Crown Feast", goal: "collectPair", snacks: ["JM", "CH"], target: 24, moves: 31, pool: ["ST", "CK", "JM", "GR", "CH", "PR"] },
    { id: 29, chapter: "Crown Feast", goal: "score", target: 5000, moves: 32, pool: ["ST", "CK", "JM", "GR", "CH", "PR"] },
    { id: 30, chapter: "Crown Feast", checkpoint: "Crown Table", goal: "dual", snack: "JM", collectTarget: 22, scoreTarget: 4300, moves: 34, pool: ["ST", "CK", "JM", "GR", "CH", "PR"] },
  ];

  const text = {
    en: {
      brand: "WeightPlay",
      title: "Snack Blocks",
      language: "Language",
      stage: "Stage",
      moves: "Moves",
      target: "Goal",
      score: "Score",
      menuTitle: "Choose a snack stage.",
      menuText: "Use all moves, reach the goal, and chase your best score.",
      start: "Start Game",
      stageHelp: "Drag sideways and choose an unlocked stage.",
      stageName: "Stage {stage}",
      locked: "Locked",
      best: "Best {score}",
      hint: "Tap or drag a snack to swap with its neighbor.",
      goalScore: "Score {target}",
      goalCollect: "Collect {icon} x{target}",
      goalCollectPair: "Collect {first} + {second} x{target}",
      goalCascade: "Reach a x{target} cascade",
      goalBurst: "Clear {target} at once",
      goalDual: "{icon} x{collect} and {score} points",
      goalScoreKind: "Score goal",
      goalCollectKind: "Collect goal",
      goalCollectPairKind: "Pair goal",
      goalCascadeKind: "Cascade goal",
      goalBurstKind: "Big-match goal",
      goalDualKind: "Checkpoint",
      goalProgress: "{count} / {target}",
      goalReady: "Goal reached! Use remaining moves for a higher score.",
      loading: "Loading",
      clear: "Stage Clear!",
      failed: "Try Again!",
      clearText: "Score {score}. Goal {goal}. Best {best}.",
      finalClearText: "Score {score}. Goal {goal}. All snack stages cleared!",
      failedText: "Score {score}. Goal {goal}. Try a bigger combo.",
      next: "Next Stage",
      again: "Try Again",
      menu: "Stages",
      lobby: "Lobby",
      skillReport: "Skill Report",
      todayScore: "Today's Score",
      previousBest: "Previous Best",
      improvement: "Improvement",
      logicSkill: "Logic",
      problemSolvingSkill: "Problem Solving",
      focusSkill: "Focus",
      progressNewBest: "Great progress! You improved your best score.",
      progressImproved: "Nice improvement! Your planning was stronger this time.",
      progressSteady: "Good effort! Try again to improve focus and combo planning.",
      progressNote: "Scores are for fun and local progress tracking only.",
      boardAria: "Snack Blocks board",
      tileAria: "{snack}, row {row}, column {column}",
      homeAria: "Back to Kids lobby",
      languageAria: "Language",
      gameStatsAria: "Game stats",
      stageSelectAria: "Stage selection",
      stageBackAria: "Back to main",
      battleBackAria: "Back to stages",
      pauseAria: "Pause game",
      pauseTitle: "Game paused",
      pauseText: "Your board is waiting. Resume when you are ready.",
      resume: "Resume",
      leaveTitle: "Leave this stage?",
      leaveText: "Your board, moves, score, and combo will be lost.",
      keepPlaying: "Keep Playing",
      leaveStage: "Leave Stage",
      snackST: "Strawberry",
      snackCK: "Cookie",
      snackJM: "Candy",
      snackGR: "Grape",
      snackCH: "Cheese",
      snackPR: "Pretzel",
    },
    "zh-Hant": {
      brand: "WeightPlay",
      title: "動物零食方塊",
      language: "語言",
      stage: "關卡",
      moves: "步數",
      target: "目標",
      score: "分數",
      menuTitle: "選擇零食方塊關卡",
      menuText: "用完所有步數，達成目標，挑戰更好的分數。",
      stageName: "第 {stage} 關",
      locked: "尚未解鎖",
      best: "最佳 {score}",
      hint: "點擊或拖曳零食，和相鄰方塊交換位置。",
      goalScore: "分數達到 {target}",
      goalCollect: "收集 {icon} x{target}",
      goalScoreKind: "分數目標",
      goalCollectKind: "收集目標",
      goalProgress: "{count} / {target}",
      goalReady: "目標達成！用剩下的步數挑戰更高分。",
      loading: "載入中",
      clear: "關卡完成！",
      failed: "再試一次！",
      clearText: "分數 {score}。目標 {goal}。最佳 {best}。",
      finalClearText: "分數 {score}。目標 {goal}。所有零食關卡都完成了！",
      failedText: "分數 {score}。目標 {goal}。試著做出更大的連線。",
      next: "下一關",
      again: "再玩一次",
      menu: "關卡",
      lobby: "大廳",
      skillReport: "能力小報告",
      todayScore: "本次分數",
      previousBest: "之前最佳",
      improvement: "進步幅度",
      logicSkill: "邏輯",
      problemSolvingSkill: "解題",
      focusSkill: "專注",
      progressNewBest: "很棒！你刷新了自己的最佳分數。",
      progressImproved: "進步不錯！這次的規劃更穩定。",
      progressSteady: "努力得很好！再試一次，練習專注和連線規劃。",
      progressNote: "分數只用於遊戲樂趣與本機進步紀錄。",
    },
  };

  Object.assign(text["zh-Hant"], {
    brand: "WeightPlay",
    title: "動物零食方塊",
    language: "語言",
    stage: "關卡",
    moves: "步數",
    target: "目標",
    score: "分數",
    menuTitle: "選擇零食關卡",
    menuText: "用完所有步數、達成目標，並挑戰自己的最佳分數。",
    start: "開始遊戲",
    stageHelp: "左右滑動，選擇已解鎖的關卡。",
    stageName: "第 {stage} 關",
    locked: "尚未解鎖",
    best: "最佳 {score}",
    hint: "點選或拖曳零食，和相鄰方塊交換位置。",
    goalScore: "分數達到 {target}",
    goalCollect: "收集 {icon} x{target}",
    goalScoreKind: "分數目標",
    goalCollectKind: "收集目標",
    goalProgress: "{count} / {target}",
    goalReady: "目標達成！用剩餘步數挑戰更高分。",
    loading: "載入中",
    clear: "關卡完成！",
    failed: "再試一次！",
    clearText: "分數 {score}，目標 {goal}，最佳 {best}。",
    finalClearText: "分數 {score}，目標 {goal}。所有零食關卡都完成了！",
    failedText: "分數 {score}，目標 {goal}。再試一次，找出更大的連線。",
    next: "下一關",
    again: "再試一次",
    menu: "關卡",
    lobby: "大廳",
    skillReport: "技能報告",
    todayScore: "本次分數",
    previousBest: "之前最佳",
    improvement: "進步幅度",
    logicSkill: "邏輯",
    problemSolvingSkill: "解決問題",
    focusSkill: "專注",
    progressNewBest: "進步得很棒！你刷新了自己的最佳分數。",
    progressImproved: "很好的進步！這次的規劃更成熟了。",
    progressSteady: "做得不錯！再試一次，練習專注與連線規劃。",
    progressNote: "分數只用於遊戲樂趣與本機進度紀錄。",
    boardAria: "動物零食方塊棋盤",
    tileAria: "{snack}，第 {row} 列，第 {column} 欄",
    homeAria: "返回兒童遊戲大廳",
    languageAria: "語言",
    gameStatsAria: "遊戲狀態",
    stageSelectAria: "關卡選擇",
    stageBackAria: "返回主畫面",
    battleBackAria: "返回關卡",
    leaveTitle: "要離開這一關嗎？",
    leaveText: "目前的棋盤、步數、分數與連鎖會消失。",
    keepPlaying: "繼續遊玩",
    leaveStage: "離開這關",
    snackST: "草莓",
    snackCK: "餅乾",
    snackJM: "糖果",
    snackGR: "葡萄",
    snackCH: "起司",
    snackPR: "蝴蝶餅",
  });

  Object.assign(text["zh-Hant"], {
    goalCollectPair: "收集 {first} + {second} x{target}",
    goalCascade: "達成 x{target} 連鎖",
    goalBurst: "單次消除 {target} 個",
    goalDual: "{icon} x{collect} 並取得 {score} 分",
    goalCollectPairKind: "雙零食目標",
    goalCascadeKind: "連鎖目標",
    goalBurstKind: "大消除目標",
    goalDualKind: "檢查關",
  });

  text.es = {
    brand: "WeightPlay", title: "Bloques de Merienda Animal", language: "Idioma", stage: "Nivel", moves: "Movimientos", target: "Objetivo", score: "Puntuación",
    menuTitle: "Elige un nivel de meriendas.", menuText: "Usa todos los movimientos, alcanza el objetivo y supera tu mejor puntuación.", start: "Empezar", stageHelp: "Desliza a los lados y elige un nivel desbloqueado.",
    stageName: "Nivel {stage}", locked: "Bloqueado", best: "Mejor {score}", hint: "Toca o arrastra una merienda para intercambiarla con una vecina.",
    goalScore: "Consigue {target} puntos", goalCollect: "Recoge {icon} x{target}", goalCollectPair: "Recoge {first} + {second} x{target}", goalCascade: "Alcanza una cascada x{target}", goalBurst: "Elimina {target} de una vez", goalDual: "{icon} x{collect} y {score} puntos",
    goalScoreKind: "Objetivo de puntos", goalCollectKind: "Objetivo de recogida", goalCollectPairKind: "Objetivo doble", goalCascadeKind: "Objetivo de cascada", goalBurstKind: "Objetivo de grupo grande", goalDualKind: "Punto de control",
    goalProgress: "{count} / {target}", goalReady: "¡Objetivo alcanzado! Usa los movimientos restantes para ganar más puntos.", loading: "Cargando", clear: "¡Nivel completado!", failed: "¡Inténtalo de nuevo!",
    clearText: "Puntuación {score}. Objetivo {goal}. Mejor {best}.", finalClearText: "Puntuación {score}. Objetivo {goal}. ¡Todos los niveles completados!", failedText: "Puntuación {score}. Objetivo {goal}. Prueba un combo mayor.",
    next: "Siguiente nivel", again: "Intentar de nuevo", menu: "Niveles", lobby: "Sala de juegos", skillReport: "Informe de habilidades", todayScore: "Puntuación de hoy", previousBest: "Mejor anterior", improvement: "Mejora",
    logicSkill: "Lógica", problemSolvingSkill: "Resolución de problemas", focusSkill: "Concentración", progressNewBest: "¡Gran progreso! Mejoraste tu récord.", progressImproved: "¡Buena mejora! Esta vez planificaste mejor.", progressSteady: "¡Buen esfuerzo! Inténtalo otra vez para mejorar la atención y los combos.", progressNote: "Las puntuaciones solo sirven para divertirse y seguir el progreso local.",
    boardAria: "Tablero de Bloques de Merienda", tileAria: "{snack}, fila {row}, columna {column}", homeAria: "Volver a la sala Kids", languageAria: "Idioma", gameStatsAria: "Estadísticas del juego", stageSelectAria: "Selección de nivel", stageBackAria: "Volver al inicio", battleBackAria: "Volver a los niveles", leaveTitle: "¿Salir de esta etapa?", leaveText: "Perderás el tablero, los movimientos, la puntuación y el combo.", keepPlaying: "Seguir jugando", leaveStage: "Salir de la etapa",
    snackST: "Fresa", snackCK: "Galleta", snackJM: "Caramelo", snackGR: "Uva", snackCH: "Queso", snackPR: "Pretzel",
  };

  Object.assign(text["zh-Hant"], {
    pauseAria: "\u66ab\u505c\u904a\u6232",
    pauseTitle: "\u904a\u6232\u5df2\u66ab\u505c",
    pauseText: "\u68cb\u76e4\u6b63\u5728\u7b49\u4f60\uff0c\u6e96\u5099\u597d\u518d\u7e7c\u7e8c\u3002",
    resume: "\u7e7c\u7e8c\u904a\u73a9",
  });
  Object.assign(text.es, {
    pauseAria: "Pausar el juego",
    pauseTitle: "Juego en pausa",
    pauseText: "Tu tablero te espera. Continúa cuando quieras.",
    resume: "Continuar",
  });

  const stageNameTranslations = {
    "zh-Hant": {
      "Picnic Path": "野餐小徑",
      "Cookie Crossing": "餅乾渡口",
      "Grape Garden": "葡萄花園",
      "Cheese Workshop": "起司工坊",
      "Pretzel Bridge": "蝴蝶餅橋",
      "Crown Feast": "皇冠盛宴",
      "Picnic Bell": "野餐鈴檢查",
      "Bakery Gate": "烘焙坊大門",
      "Garden Drum": "花園鼓檢查",
      "Workshop Clock": "工坊鐘檢查",
      "Bridge Banquet": "橋上宴會",
      "Crown Table": "皇冠餐桌",
    },
    es: {
      "Picnic Path": "Sendero del pícnic", "Cookie Crossing": "Cruce de galletas", "Grape Garden": "Jardín de uvas", "Cheese Workshop": "Taller de queso", "Pretzel Bridge": "Puente de pretzels", "Crown Feast": "Banquete de la corona",
      "Picnic Bell": "Campana del pícnic", "Bakery Gate": "Puerta de la pastelería", "Garden Drum": "Tambor del jardín", "Workshop Clock": "Reloj del taller", "Bridge Banquet": "Banquete del puente", "Crown Table": "Mesa de la corona",
    },
  };

  const metadata = {
    en: {
      title: "Snack Blocks - WeightPlay",
      description: "Clear 30 saved Snack Blocks stages with score, collection, cascade, big-match, pair, and checkpoint goals.",
      ogTitle: "Snack Blocks - 30-Stage Match Puzzle Game",
      ogDescription: "Plan every swap across 30 saved stages and six distinct puzzle chapters in WeightPlay's animal snack match game.",
    },
    "zh-Hant": {
      title: "動物零食方塊 - WeightPlay",
      description: "遊玩動物零食方塊，交換相鄰零食圖案，在限定步數內完成分數或收集目標，練習邏輯、解題與專注力。",
      ogTitle: "動物零食方塊 - 關卡式三消益智遊戲",
      ogDescription: "交換零食方塊、完成關卡目標，挑戰更好的本機紀錄。",
    },
    es: {
      title: "Bloques de Merienda Animal - WeightPlay",
      description: "Completa 30 niveles guardados con objetivos de puntuación, recogida, cascada, grupos grandes, parejas y puntos de control.",
      ogTitle: "Bloques de Merienda Animal - Rompecabezas de 30 niveles",
      ogDescription: "Planifica cada intercambio en 30 niveles y seis capítulos de combinaciones de meriendas animales.",
    },
  };

  Object.assign(metadata["zh-Hant"], {
    title: "動物零食方塊 - WeightPlay",
    description: "交換相鄰的動物零食方塊，在限定步數內完成分數或收集目標，練習邏輯、解題與專注力。",
    ogTitle: "動物零食方塊 - 關卡式消除益智遊戲",
    ogDescription: "配對動物零食、完成關卡目標，並挑戰自己的最佳分數。",
  });

  if (!document.getElementById("leaveConfirmPanel")) {
    const panel = document.createElement("section");
    panel.id = "leaveConfirmPanel";
    panel.className = "leave-confirm-panel hidden";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", "leaveConfirmTitle");
    panel.setAttribute("aria-describedby", "leaveConfirmText");
    panel.innerHTML = `<div class="leave-confirm-card"><strong id="leaveConfirmTitle"></strong><p id="leaveConfirmText"></p><div><button id="keepPlayingBtn" type="button"></button><button id="leaveStageBtn" type="button"></button></div></div>`;
    document.querySelector(".snack-game")?.append(panel);
  }

  const nodes = {
    homeLink: document.getElementById("homeLink"),
    titleText: document.getElementById("titleText"),
    brandText: document.getElementById("brandText"),
    languageLabel: document.getElementById("languageLabel"),
    localeSelect: document.getElementById("localeSelect"),
    hud: document.getElementById("hud"),
    stageLabel: document.getElementById("stageLabel"),
    movesLabel: document.getElementById("movesLabel"),
    targetLabel: document.getElementById("targetLabel"),
    stageText: document.getElementById("stageText"),
    movesText: document.getElementById("movesText"),
    targetText: document.getElementById("targetText"),
    scoreLabel: document.getElementById("scoreLabel"),
    scoreText: document.getElementById("scoreText"),
    menuPanel: document.getElementById("menuPanel"),
    stagePanel: document.getElementById("stagePanel"),
    startBtn: document.getElementById("startBtn"),
    stageBackBtn: document.getElementById("stageBackBtn"),
    battleBackBtn: document.getElementById("battleBackBtn"),
    pauseBtn: document.getElementById("pauseBtn"),
    stageTitle: document.getElementById("stageTitle"),
    stageHelp: document.getElementById("stageHelp"),
    menuTitle: document.getElementById("menuTitle"),
    menuText: document.getElementById("menuText"),
    stageGrid: document.getElementById("stageGrid"),
    playPanel: document.getElementById("playPanel"),
    board: document.getElementById("board"),
    hintText: document.getElementById("hintText"),
    resultPanel: document.getElementById("resultPanel"),
    resultTitle: document.getElementById("resultTitle"),
    resultText: document.getElementById("resultText"),
    resultStars: document.getElementById("resultStars"),
    skillReport: document.getElementById("skillReport"),
    nextBtn: document.getElementById("nextBtn"),
    againBtn: document.getElementById("againBtn"),
    menuBtn: document.getElementById("menuBtn"),
    lobbyLink: document.getElementById("lobbyLink"),
    loadingPanel: document.getElementById("loadingPanel"),
    loadingTitle: document.getElementById("loadingTitle"),
    loadingText: document.getElementById("loadingText"),
    loadingFill: document.getElementById("loadingFill"),
    leaveConfirmPanel: document.getElementById("leaveConfirmPanel"),
    leaveConfirmTitle: document.getElementById("leaveConfirmTitle"),
    leaveConfirmText: document.getElementById("leaveConfirmText"),
    keepPlayingBtn: document.getElementById("keepPlayingBtn"),
    leaveStageBtn: document.getElementById("leaveStageBtn"),
  };

  const state = {
    locale: "en",
    board: [],
    selected: null,
    score: 0,
    moves: 0,
    combo: 1,
    goalCount: 0,
    bestCascade: 0,
    bestBurst: 0,
    goalReady: false,
    running: false,
    busy: false,
    currentStageIndex: 0,
    nextTileId: 1,
    dragStart: null,
    suppressClick: false,
    focusIndex: null,
    leaveConfirmOpen: false,
    decisionMode: null,
  };
  let boardGeneration = 0;
  let boardLifecycleSuspended = document.hidden;

  function invalidateBoardSession() {
    boardGeneration += 1;
    state.dragStart = null;
    state.selected = null;
    state.suppressClick = false;
  }

  function scheduleBoardTask(task, delay) {
    const generation = boardGeneration;
    let remaining = delay;
    let lastFrameAt = null;
    const tick = (now) => {
      if (generation !== boardGeneration || !state.running || !document.body.classList.contains("snack-playing")) return;
      if (boardLifecycleSuspended || document.hidden) {
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

  function suspendBoardTasks() {
    boardLifecycleSuspended = true;
  }

  function resumeBoardTasks() {
    boardLifecycleSuspended = document.hidden;
  }

  function setBattleCovered(covered) {
    for (const node of [nodes.hud, nodes.playPanel]) {
      node.inert = covered;
      if (covered) node.setAttribute("aria-hidden", "true");
      else node.removeAttribute("aria-hidden");
    }
  }

  function t(key, data = {}) {
    let value = (text[state.locale] && text[state.locale][key]) || text.en[key] || key;
    Object.keys(data).forEach((name) => {
      value = value.replaceAll(`{${name}}`, data[name]);
    });
    return value;
  }

  function applyDecisionText() {
    nodes.leaveConfirmTitle.textContent = t(state.decisionMode === "pause" ? "pauseTitle" : "leaveTitle");
    nodes.leaveConfirmText.textContent = t(state.decisionMode === "pause" ? "pauseText" : "leaveText");
    nodes.keepPlayingBtn.textContent = t(state.decisionMode === "pause" ? "resume" : "keepPlaying");
    nodes.leaveStageBtn.textContent = t("leaveStage");
  }

  function activeStage() {
    return stages[state.currentStageIndex];
  }

  function goalLabel(stage = activeStage()) {
    if (stage.goal === "collect") return t("goalCollect", { icon: t(`snack${stage.snack}`), target: stage.target });
    if (stage.goal === "collectPair") return t("goalCollectPair", {
      first: t(`snack${stage.snacks[0]}`),
      second: t(`snack${stage.snacks[1]}`),
      target: stage.target,
    });
    if (stage.goal === "cascade") return t("goalCascade", { target: stage.target });
    if (stage.goal === "burst") return t("goalBurst", { target: stage.target });
    if (stage.goal === "dual") return t("goalDual", {
      icon: t(`snack${stage.snack}`),
      collect: stage.collectTarget,
      score: stage.scoreTarget,
    });
    return t("goalScore", { target: stage.target });
  }

  function goalProgress(stage = activeStage()) {
    if (stage.goal === "collect" || stage.goal === "collectPair") return t("goalProgress", { count: state.goalCount, target: stage.target });
    if (stage.goal === "cascade") return t("goalProgress", { count: state.bestCascade, target: stage.target });
    if (stage.goal === "burst") return t("goalProgress", { count: state.bestBurst, target: stage.target });
    if (stage.goal === "dual") return `${state.goalCount}/${stage.collectTarget} · ${state.score}/${stage.scoreTarget}`;
    return `${state.score} / ${stage.target}`;
  }

  function goalMet(stage = activeStage()) {
    if (stage.goal === "collect" || stage.goal === "collectPair") return state.goalCount >= stage.target;
    if (stage.goal === "cascade") return state.bestCascade >= stage.target;
    if (stage.goal === "burst") return state.bestBurst >= stage.target;
    if (stage.goal === "dual") return state.goalCount >= stage.collectTarget && state.score >= stage.scoreTarget;
    return state.score >= stage.target;
  }

  function scoreBenchmark(stage = activeStage()) {
    if (stage.goal === "dual") return stage.scoreTarget;
    if (stage.goal === "score") return stage.target;
    return Math.max(650, stage.moves * 75);
  }

  function loadUnlocked() {
    try {
      const value = Number(localStorage.getItem(unlockKey));
      return Number.isFinite(value) && value > 0 ? Math.min(value, stages.length) : 1;
    } catch {
      return 1;
    }
  }

  function saveUnlocked(value) {
    try {
      localStorage.setItem(unlockKey, String(Math.min(value, stages.length)));
    } catch {
      // Progress persistence is optional.
    }
  }

  function loadRecords() {
    try {
      return JSON.parse(localStorage.getItem(recordKey)) || {};
    } catch {
      return {};
    }
  }

  function saveRecord(stageId, score) {
    const records = loadRecords();
    const previous = records[stageId];
    const previousBest = bestScoreFromRecord(previous);
    const bestScore = Math.max(previousBest, score);
    const playCount = (typeof previous === "object" && Number(previous.playCount)) || 0;
    const improvementPercent = previousBest > 0 ? Math.round(((score - previousBest) / previousBest) * 100) : score > 0 ? 100 : 0;
    const scoreRatio = score / Math.max(1, scoreBenchmark());
    const moveBonus = Math.min(1, Math.max(0, state.moves / Math.max(1, activeStage().moves)));
    records[stageId] = {
      lastScore: score,
      bestScore,
      playCount: playCount + 1,
      lastPlayedAt: new Date().toISOString(),
      improvementPercent,
      previousBest,
      skillScores: {
        logic: Math.min(5, Math.max(1, Math.ceil(scoreRatio * 3.2))),
        problemSolving: Math.min(5, Math.max(1, Math.ceil((scoreRatio + moveBonus) * 2.2))),
        focus: Math.min(5, Math.max(1, Math.ceil((goalMet() ? 3 : 2) + moveBonus * 2))),
      },
    };
    try {
      localStorage.setItem(recordKey, JSON.stringify(records));
    } catch {
      // Record persistence is optional.
    }
    return records;
  }

  function goalKindLabel(stage = activeStage()) {
    const keys = {
      collect: "goalCollectKind",
      collectPair: "goalCollectPairKind",
      cascade: "goalCascadeKind",
      burst: "goalBurstKind",
      dual: "goalDualKind",
      score: "goalScoreKind",
    };
    return t(keys[stage.goal] || "goalScoreKind");
  }

  function stageDisplayName(stage) {
    const name = stage.checkpoint || stage.chapter;
    return stageNameTranslations[state.locale]?.[name] || name;
  }

  function bestScoreFromRecord(record) {
    return typeof record === "number" ? record : Number(record?.bestScore) || 0;
  }

  function stars(value) {
    const filled = Math.max(1, Math.min(5, Math.round(value)));
    return "\u2605".repeat(filled) + "\u2606".repeat(5 - filled);
  }

  function renderSkillReport(progress, cleared) {
    const message =
      progress.previousBest <= 0 || progress.bestScore > progress.previousBest
        ? t("progressNewBest")
        : progress.improvementPercent > 0
          ? t("progressImproved")
          : t("progressSteady");
    nodes.skillReport.innerHTML = `
      <strong>${t("skillReport")}</strong>
      <div class="progress-line"><span>${t("todayScore")}</span><i>${progress.lastScore}</i></div>
      <div class="progress-line"><span>${t("previousBest")}</span><i>${progress.previousBest || "-"}</i></div>
      <div class="progress-line"><span>${t("improvement")}</span><i>${progress.improvementPercent > 0 ? "+" : ""}${progress.improvementPercent}%</i></div>
      <div class="skill-line"><span>${t("logicSkill")}</span><i>${stars(progress.skillScores.logic)}</i></div>
      <div class="skill-line"><span>${t("problemSolvingSkill")}</span><i>${stars(progress.skillScores.problemSolving)}</i></div>
      <div class="skill-line"><span>${t("focusSkill")}</span><i>${stars(progress.skillScores.focus)}</i></div>
      <p class="progress-message">${cleared ? message : t("progressSteady")}</p>
      <p class="progress-note">${t("progressNote")}</p>
    `;
  }

  function setLocale(next) {
    const current = window.WonderI18n?.actualLocale?.();
    const requested = next === "zh-Hant" && current === "zh-Hans" ? current : next || "en";
    if (current !== requested) window.WonderI18n?.setLocale?.(requested);
    const displayLocale = window.WonderI18n?.legacyLocale?.(requested) || requested;
    state.locale = text[displayLocale] ? displayLocale : "en";
    try {
      localStorage.setItem(canonicalLocaleKey, requested);
      localStorage.setItem(legacyLocaleKey, requested);
    } catch {
      // Locale persistence is optional.
    }
    document.documentElement.lang = requested;
    nodes.localeSelect.value = requested;
    applyText();
  }

  function applyText() {
    updateMetadata();
    nodes.brandText.textContent = t("brand");
    nodes.titleText.textContent = t("title");
    nodes.languageLabel.textContent = t("language");
    nodes.stageLabel.textContent = t("stage");
    nodes.movesLabel.textContent = t("moves");
    nodes.targetLabel.textContent = t("target");
    nodes.scoreLabel.textContent = t("score");
    nodes.menuTitle.textContent = t("title");
    nodes.menuText.textContent = t("menuText");
    nodes.startBtn.textContent = state.locale === "zh-Hant" ? "\u958b\u59cb\u904a\u6232" : t("start");
    nodes.stageTitle.textContent = t("menuTitle");
    nodes.stageHelp.textContent = state.locale === "zh-Hant" ? "\u5de6\u53f3\u6ed1\u52d5\uff0c\u9078\u64c7\u5df2\u89e3\u9396\u7684\u95dc\u5361\u3002" : t("stageHelp");
    nodes.hintText.textContent = t("hint");
    nodes.loadingTitle.textContent = t("loading");
    nodes.nextBtn.textContent = t("next");
    nodes.againBtn.textContent = t("again");
    nodes.menuBtn.textContent = t("menu");
    nodes.lobbyLink.textContent = t("lobby");
    nodes.homeLink.setAttribute("aria-label", t("homeAria"));
    nodes.localeSelect.setAttribute("aria-label", t("languageAria"));
    nodes.hud.setAttribute("aria-label", t("gameStatsAria"));
    nodes.stagePanel.setAttribute("aria-label", t("stageSelectAria"));
    nodes.stageBackBtn.setAttribute("aria-label", t("stageBackAria"));
    nodes.battleBackBtn.setAttribute("aria-label", t("battleBackAria"));
    nodes.pauseBtn.setAttribute("aria-label", t("pauseAria"));
    nodes.board.setAttribute("aria-label", t("boardAria"));
    applyDecisionText();
    renderStageGrid();
    updateHud();
    if (state.running && !state.busy) renderBoard();
  }

  function updateMetadata() {
    const current = metadata[state.locale] || metadata.en;
    document.title = current.title;
    setMeta("description", current.description);
    setMeta("og:title", current.ogTitle, true);
    setMeta("og:description", current.ogDescription, true);
  }

  function setMeta(name, content, property = false) {
    const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    const node = document.querySelector(selector);
    if (node) node.setAttribute("content", content);
  }

  function makeTile(type) {
    const tile = { id: state.nextTileId, type };
    state.nextTileId += 1;
    return tile;
  }

  function randomType() {
    const pool = activeStage().pool || snacks.slice(0, activeStage().types || snacks.length);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function getCell(row, col) {
    return state.board[row * columns + col];
  }

  function buildCleanBoard() {
    state.board = [];
    state.nextTileId = 1;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < columns; col += 1) {
        let value = randomType();
        let guard = 0;
        while (
          guard < 30 &&
          ((col >= 2 && getCell(row, col - 1)?.type === value && getCell(row, col - 2)?.type === value) ||
            (row >= 2 && getCell(row - 1, col)?.type === value && getCell(row - 2, col)?.type === value))
        ) {
          value = randomType();
          guard += 1;
        }
        state.board.push(makeTile(value));
      }
    }
  }

  function renderStageGrid(focusIndex = null) {
    const unlocked = loadUnlocked();
    const records = loadRecords();
    nodes.stageGrid.innerHTML = "";
    stages.forEach((stage, index) => {
      const button = document.createElement("button");
      const isUnlocked = index < unlocked;
      button.type = "button";
      button.dataset.stageIndex = String(index);
      button.className = `stage-card ${stage.checkpoint ? "checkpoint" : ""} ${isUnlocked ? "" : "locked"}`;
      button.setAttribute("aria-disabled", String(!isUnlocked));
      button.innerHTML = `
        <strong>${stage.id}</strong>
        <small class="stage-goal-kind ${stage.goal}">${goalKindLabel(stage)}</small>
        <span>${stageDisplayName(stage)}</span>
        <em>${isUnlocked ? `${goalLabel(stage)} · ${t("best", { score: bestScoreFromRecord(records[stage.id]) })}` : t("locked")}</em>
      `;
      button.addEventListener("click", () => {
        if (!isUnlocked || nodes.stageGrid.dataset.dragged === "true") return;
        startStage(index);
      });
      nodes.stageGrid.append(button);
    });
    requestAnimationFrame(() => {
      const unlockedCard = [...nodes.stageGrid.querySelectorAll(".stage-card:not(.locked)")].at(-1);
      scrollStageCardToCenter(unlockedCard, "auto");
      if (Number.isInteger(focusIndex)) {
        const focusCard = nodes.stageGrid.querySelector(`.stage-card:not(.locked)[data-stage-index="${focusIndex}"]`) || unlockedCard;
        focusCard?.focus({ preventScroll: true });
        scrollStageCardToCenter(focusCard, "auto");
      }
    });
  }

  function rejectRepeatedScreenActivation(event) {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  function scrollStageCardToCenter(card, behavior = "smooth") {
    if (!card) return;
    const left = Math.max(0, Math.min(
      card.offsetLeft + card.offsetWidth / 2 - nodes.stageGrid.clientWidth / 2,
      nodes.stageGrid.scrollWidth - nodes.stageGrid.clientWidth
    ));
    nodes.stageGrid.scrollTo({ left, behavior });
  }

  function centerNearestStage() {
    const cards = [...nodes.stageGrid.querySelectorAll(".stage-card")];
    if (!cards.length) return;
    const center = nodes.stageGrid.scrollLeft + nodes.stageGrid.clientWidth / 2;
    const nearest = cards.reduce((best, card) => {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      return !best || distance < best.distance ? { card, distance } : best;
    }, null)?.card;
    scrollStageCardToCenter(nearest);
  }

  function installStageDrag() {
    nodes.stageGrid.dataset.stageDragInstalled = "true";
    let pointerId = null;
    let startX = 0;
    let startScroll = 0;
    let moved = false;
    nodes.stageGrid.addEventListener("pointerdown", (event) => {
      if (nodes.stageGrid.dataset.wpStageRail === "true") return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startScroll = nodes.stageGrid.scrollLeft;
      moved = false;
      nodes.stageGrid.classList.add("dragging");
    });
    nodes.stageGrid.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 6 && !moved) {
        moved = true;
        nodes.stageGrid.setPointerCapture?.(pointerId);
      }
      if (!moved) return;
      nodes.stageGrid.scrollLeft = startScroll - delta;
    });
    const finish = (event) => {
      if (event.pointerId !== pointerId) return;
      if (nodes.stageGrid.hasPointerCapture?.(pointerId)) nodes.stageGrid.releasePointerCapture(pointerId);
      pointerId = null;
      nodes.stageGrid.classList.remove("dragging");
      if (moved) nodes.stageGrid.dataset.dragged = "true";
      centerNearestStage();
      setTimeout(() => { delete nodes.stageGrid.dataset.dragged; }, 120);
    };
    nodes.stageGrid.addEventListener("pointerup", finish);
    nodes.stageGrid.addEventListener("pointercancel", finish);
  }

  function showStage(focusIndex = null) {
    const unlocked = loadUnlocked();
    const stageToFocus = Number.isInteger(focusIndex)
      ? Math.max(0, Math.min(unlocked - 1, focusIndex))
      : Math.max(0, unlocked - 1);
    invalidateBoardSession();
    state.running = false;
    state.busy = false;
    nodes.menuPanel.classList.add("hidden");
    nodes.stagePanel.classList.remove("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.leaveConfirmPanel.classList.add("hidden");
    state.leaveConfirmOpen = false;
    state.decisionMode = null;
    setBattleCovered(false);
    nodes.hud.classList.add("hidden");
    nodes.playPanel.classList.add("hidden");
    document.body.classList.remove("snack-playing");
    document.body.classList.add("snack-stage");
    renderStageGrid(stageToFocus);
    exitSharedPlayViewport();
    updateSnackFrame();
    requestAnimationFrame(updateSnackFrame);
  }

  function showMain() {
    invalidateBoardSession();
    state.running = false;
    state.busy = false;
    nodes.stagePanel.classList.add("hidden");
    nodes.menuPanel.classList.remove("hidden");
    document.body.classList.remove("snack-stage");
    resetSnackFrame();
    nodes.startBtn.focus({ preventScroll: true });
  }

  function renderBoard(dropMap = new Map()) {
    nodes.board.innerHTML = "";
    state.board.forEach((tile, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `tile tile-${snacks.indexOf(tile.type)}`;
      button.innerHTML = `<img class="snack-image" src="${snackArt[tile.type].asset}" alt="" draggable="false" />`;
      button.dataset.index = String(index);
      button.dataset.tileId = String(tile.id);
      button.setAttribute("aria-label", t("tileAria", {
        snack: t(`snack${tile.type}`),
        row: Math.floor(index / columns) + 1,
        column: (index % columns) + 1,
      }));
      button.setAttribute("aria-pressed", String(state.selected === index));
      button.disabled = state.busy;
      if (dropMap.has(tile.id)) {
        button.classList.add("dropping");
        button.style.setProperty("--drop", `${-dropMap.get(tile.id) * 112}%`);
      }
      if (state.selected === index) button.classList.add("selected");
      button.addEventListener("pointerdown", onPointerDown);
      button.addEventListener("pointerup", onPointerUp);
      button.addEventListener("click", onTileClick);
      nodes.board.append(button);
    });
    if (!state.busy && Number.isInteger(state.focusIndex)) {
      nodes.board.querySelector(`[data-index="${state.focusIndex}"]`)?.focus({ preventScroll: true });
    }
  }

  function updateHud() {
    const oldScore = nodes.scoreText.textContent;
    nodes.stageText.textContent = String(activeStage().id);
    nodes.movesText.textContent = String(state.moves);
    nodes.targetText.textContent = goalProgress();
    nodes.scoreText.textContent = String(state.score);
    if (oldScore !== nodes.scoreText.textContent) bump(nodes.scoreText);
  }

  function bump(node) {
    node.classList.remove("score-pop");
    void node.offsetWidth;
    node.classList.add("score-pop");
  }

  function isNeighbor(a, b) {
    const ar = Math.floor(a / columns);
    const ac = a % columns;
    const br = Math.floor(b / columns);
    const bc = b % columns;
    return Math.abs(ar - br) + Math.abs(ac - bc) === 1;
  }

  function swap(a, b) {
    const temp = state.board[a];
    state.board[a] = state.board[b];
    state.board[b] = temp;
  }

  function findMatches() {
    const matched = new Set();
    for (let row = 0; row < rows; row += 1) {
      let runStart = 0;
      for (let col = 1; col <= columns; col += 1) {
        const same = col < columns && getCell(row, col)?.type === getCell(row, runStart)?.type;
        if (!same) {
          if (col - runStart >= 3) {
            for (let mark = runStart; mark < col; mark += 1) matched.add(row * columns + mark);
          }
          runStart = col;
        }
      }
    }
    for (let col = 0; col < columns; col += 1) {
      let runStart = 0;
      for (let row = 1; row <= rows; row += 1) {
        const same = row < rows && getCell(row, col)?.type === getCell(runStart, col)?.type;
        if (!same) {
          if (row - runStart >= 3) {
            for (let mark = runStart; mark < row; mark += 1) matched.add(mark * columns + col);
          }
          runStart = row;
        }
      }
    }
    return [...matched];
  }

  function markMatches(indices) {
    indices.forEach((index) => {
      const tile = nodes.board.querySelector(`[data-index="${index}"]`);
      if (tile) tile.classList.add("matching");
    });
    spawnMatchEffects(indices);
  }

  function spawnMatchEffects(indices) {
    indices.forEach((index, order) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      const effect = document.createElement("span");
      effect.className = "match-spark";
      effect.setAttribute("aria-hidden", "true");
      effect.style.left = `${((col + 0.5) / columns) * 100}%`;
      effect.style.top = `${((row + 0.5) / rows) * 100}%`;
      effect.style.setProperty("--burst-image", `url("${effectArt.matchBurst}")`);
      effect.style.animationDelay = `${Math.min(order * 18, 90)}ms`;
      nodes.board.append(effect);
    });
  }

  function collapse(matches) {
    const removed = new Set(matches);
    const newBoard = new Array(columns * rows);
    const dropMap = new Map();

    for (let col = 0; col < columns; col += 1) {
      const survivors = [];
      for (let row = rows - 1; row >= 0; row -= 1) {
        const index = row * columns + col;
        const tile = state.board[index];
        if (!removed.has(index)) survivors.push({ tile, oldRow: row });
      }

      let targetRow = rows - 1;
      survivors.forEach(({ tile, oldRow }) => {
        newBoard[targetRow * columns + col] = tile;
        const distance = Math.max(0, targetRow - oldRow);
        if (distance > 0) dropMap.set(tile.id, distance);
        targetRow -= 1;
      });

      while (targetRow >= 0) {
        const tile = makeTile(randomType());
        newBoard[targetRow * columns + col] = tile;
        dropMap.set(tile.id, targetRow + 1);
        targetRow -= 1;
      }
    }

    state.board = newBoard;
    return dropMap;
  }

  function resolveBoard() {
    const matches = findMatches();
    if (!matches.length) {
      state.combo = 1;
      state.busy = false;
      updateHud();
      renderBoard();
      checkEnd();
      return;
    }

    const stage = activeStage();
    state.score += matches.length * 12 * state.combo;
    state.bestCascade = Math.max(state.bestCascade, state.combo);
    state.bestBurst = Math.max(state.bestBurst, matches.length);
    if (stage.goal === "collect" || stage.goal === "dual") {
      state.goalCount += matches.filter((index) => state.board[index]?.type === stage.snack).length;
    } else if (stage.goal === "collectPair") {
      state.goalCount += matches.filter((index) => stage.snacks.includes(state.board[index]?.type)).length;
    }
    state.combo += 1;
    updateHud();
    if (!state.goalReady && goalMet(stage)) {
      state.goalReady = true;
      nodes.hintText.textContent = t("goalReady");
    }
    markMatches(matches);
    window.WonderSound?.play(matches.length >= 5 ? "success" : "coin");

    scheduleBoardTask(() => {
      const dropMap = collapse(matches);
      renderBoard(dropMap);
      scheduleBoardTask(resolveBoard, dropSettleDuration);
    }, matchClearDuration);
  }

  function trySwap(target) {
    if (!state.running || state.busy || state.selected === null || target === state.selected) return;
    state.focusIndex = target;
    if (!isNeighbor(state.selected, target)) {
      state.selected = target;
      renderBoard();
      return;
    }

    const first = state.selected;
    state.selected = null;
    state.busy = true;
    swap(first, target);
    renderBoard();

    if (!findMatches().length) {
      window.WonderSound?.play("wrong");
      scheduleBoardTask(() => {
        swap(first, target);
        state.combo = 1;
        state.busy = false;
        updateHud();
        renderBoard();
      }, 170);
      return;
    }

    state.moves -= 1;
    updateHud();
    window.WonderSound?.play("click");
    scheduleBoardTask(resolveBoard, 120);
  }

  function onTileClick(event) {
    if (state.suppressClick) {
      state.suppressClick = false;
      return;
    }
    if (state.dragStart) return;
    const index = Number(event.currentTarget.dataset.index);
    state.focusIndex = index;
    if (state.selected === null) {
      state.selected = index;
      renderBoard();
      return;
    }
    trySwap(index);
  }

  function onPointerDown(event) {
    const index = Number(event.currentTarget.dataset.index);
    state.dragStart = { index, x: event.clientX, y: event.clientY };
  }

  function onPointerUp(event) {
    if (!state.dragStart) return;
    const dx = event.clientX - state.dragStart.x;
    const dy = event.clientY - state.dragStart.y;
    const distance = Math.hypot(dx, dy);
    const start = state.dragStart.index;
    state.dragStart = null;
    if (distance < 20) return;

    let target = start;
    if (Math.abs(dx) > Math.abs(dy)) {
      target = start + (dx > 0 ? 1 : -1);
    } else {
      target = start + (dy > 0 ? columns : -columns);
    }
    if (target < 0 || target >= columns * rows || !isNeighbor(start, target)) return;
    state.selected = start;
    state.suppressClick = true;
    trySwap(target);
  }

  function updateSnackFrame() {
    if (!document.body.classList.contains("snack-stage") && !document.body.classList.contains("snack-playing")) return;
    const viewport = window.visualViewport;
    const layoutWidth = Math.max(1, document.documentElement.clientWidth || 0, innerWidth || 0, viewport?.width || 0);
    const viewportHeight = Math.max(1, document.documentElement.clientHeight || 0, innerHeight || 0, viewport?.height || 0);
    const viewportWidth = Math.min(layoutWidth, 920);
    const frameLeft = Math.max(0, (layoutWidth - viewportWidth) / 2);
    const shell = document.querySelector(".snack-game");
    shell?.classList.remove("weightplay-active-viewport");
    const scale = Math.min(Math.max(1, viewportWidth) / 390, Math.max(1, viewportHeight) / 788);
    const logicalWidth = viewportWidth / scale;
    const logicalHeight = viewportHeight / scale;
    document.documentElement.style.setProperty("--snack-frame-scale", String(scale));
    document.documentElement.style.setProperty("--snack-frame-left", `${frameLeft}px`);
    document.documentElement.style.setProperty("--snack-frame-top", "0px");
    document.documentElement.style.setProperty("--snack-logical-width", `${logicalWidth}px`);
    document.documentElement.style.setProperty("--snack-logical-height", `${logicalHeight}px`);
    document.documentElement.style.setProperty("--snack-frame-width", `${viewportWidth}px`);
    document.documentElement.style.setProperty("--snack-frame-height", `${viewportHeight}px`);
    shell?.style.setProperty("position", "fixed", "important");
    shell?.style.setProperty("inset", "auto", "important");
    shell?.style.setProperty("left", `${frameLeft}px`, "important");
    shell?.style.setProperty("top", "0px", "important");
    shell?.style.setProperty("width", `${logicalWidth}px`, "important");
    shell?.style.setProperty("min-width", "0px", "important");
    shell?.style.setProperty("max-width", "none", "important");
    shell?.style.setProperty("height", `${logicalHeight}px`, "important");
    shell?.style.setProperty("min-height", "0px", "important");
    shell?.style.setProperty("max-height", "none", "important");
    shell?.style.setProperty("transform", `scale(${scale})`, "important");
    shell?.style.setProperty("transform-origin", "top left", "important");
    if (shell) {
      shell.dataset.logicalWidth = logicalWidth.toFixed(4);
      shell.dataset.logicalHeight = logicalHeight.toFixed(4);
      shell.dataset.commonScale = scale.toFixed(6);
    }
  }

  function resetSnackFrame() {
    const shell = document.querySelector(".snack-game");
    for (const property of ["position", "inset", "left", "top", "width", "min-width", "max-width", "height", "min-height", "max-height", "transform", "transform-origin"]) shell?.style.removeProperty(property);
    if (shell) {
      delete shell.dataset.logicalWidth;
      delete shell.dataset.logicalHeight;
      delete shell.dataset.commonScale;
    }
  }

  function exitSharedPlayViewport() {
    window.WeightPlayGame?.exitMobileGameMode?.();
    document.body.classList.remove("weightplay-active-viewport", "wp-mobile-game-mode");
    document.querySelector(".snack-game")?.classList.remove("weightplay-active-viewport");
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    if (document.webkitFullscreenElement) document.webkitExitFullscreen?.();
  }

  window.addEventListener("resize", updateSnackFrame);
  window.addEventListener("orientationchange", updateSnackFrame);
  window.visualViewport?.addEventListener("resize", updateSnackFrame);
  window.visualViewport?.addEventListener("scroll", updateSnackFrame);

  function startStage(index) {
    if (index >= loadUnlocked()) return;
    invalidateBoardSession();
    window.WonderSound?.unlock();
    window.WonderSound?.play("start");
    state.currentStageIndex = index;
    state.score = 0;
    state.moves = activeStage().moves;
    state.combo = 1;
    state.goalCount = 0;
    state.bestCascade = 0;
    state.bestBurst = 0;
    state.goalReady = false;
    state.focusIndex = 0;
    state.selected = null;
    state.running = true;
    state.busy = false;
    buildCleanBoard();
    nodes.menuPanel.classList.add("hidden");
    nodes.stagePanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.leaveConfirmPanel.classList.add("hidden");
    state.leaveConfirmOpen = false;
    state.decisionMode = null;
    setBattleCovered(false);
    nodes.hud.classList.remove("hidden");
    nodes.playPanel.classList.remove("hidden");
    document.body.classList.remove("snack-stage");
    document.body.classList.add("snack-playing");
    document.querySelector(".snack-game")?.removeAttribute("data-play-viewport");
    updateHud();
    renderBoard();
    nodes.hintText.textContent = t("hint");
    exitSharedPlayViewport();
    updateSnackFrame();
    window.WonderAnalytics?.track("game_start", {
      game_id: GAME_ID,
      stage: activeStage().id,
      goal: activeStage().goal,
    });
    requestAnimationFrame(() => {
      exitSharedPlayViewport();
      updateSnackFrame();
    });
  }

  function checkEnd() {
    if (!state.running || state.busy) return;
    if (state.moves <= 0) finishStage(goalMet());
  }

  function finishStage(cleared) {
    invalidateBoardSession();
    state.running = false;
    state.busy = true;
    const stage = activeStage();
    const progress = saveRecord(stage.id, state.score)[stage.id];
    const best = progress.bestScore || state.score;
    if (cleared && stage.id < stages.length) {
      saveUnlocked(Math.max(loadUnlocked(), stage.id + 1));
    }

    nodes.resultTitle.textContent = cleared ? t("clear") : t("failed");
    nodes.resultText.textContent = cleared
      ? t(stage.id === stages.length ? "finalClearText" : "clearText", { score: state.score, goal: goalLabel(stage), best })
      : t("failedText", { score: state.score, goal: goalLabel(stage) });
    nodes.resultStars.textContent = cleared ? ratingStars() : "";
    renderSkillReport(progress, cleared);
    nodes.nextBtn.classList.toggle("hidden", !cleared || stage.id >= stages.length);
    nodes.hud.classList.add("hidden");
    nodes.playPanel.classList.add("hidden");
    nodes.resultPanel.classList.remove("hidden");
    requestAnimationFrame(() => (cleared && !nodes.nextBtn.classList.contains("hidden") ? nodes.nextBtn : nodes.againBtn).focus({ preventScroll: true }));
    window.WonderSound?.play(cleared ? "win" : "wrong");
    window.WonderAnalytics?.track("game_complete", {
      game_id: GAME_ID,
      stage: stage.id,
      score: state.score,
      goal: stage.goal,
      cleared,
    });
  }

  function ratingStars() {
    const stage = activeStage();
    const benchmark = scoreBenchmark(stage);
    const value = state.score >= benchmark * 1.55 ? 3 : state.score >= benchmark * 1.25 ? 2 : 1;
    return "\u2605".repeat(value);
  }

  function starRating() {
    const stage = activeStage();
    if (stage.goal === "collect") {
      if (state.goalCount >= stage.target + 8) return "★★★";
      if (state.goalCount >= stage.target + 4) return "★★";
      return "★";
    }
    if (state.score >= stage.target * 1.55) return "★★★";
    if (state.score >= stage.target * 1.25) return "★★";
    return "★";
  }

  function showMenu() {
    showStage(state.currentStageIndex);
    const shell = document.querySelector(".snack-game");
    shell?.setAttribute("data-play-viewport", "");
    for (const property of ["position", "inset", "left", "top", "width", "height", "min-height", "transform", "transform-origin"]) shell?.style.removeProperty(property);
    window.WonderAnalytics?.track("game_menu", { game_id: GAME_ID });
  }

  function focusBoardTile() {
    const index = Number.isInteger(state.focusIndex) ? state.focusIndex : 0;
    (nodes.board.querySelector(`[data-index="${index}"]`) || nodes.board.querySelector(".tile:not(:disabled)"))?.focus({ preventScroll: true });
  }

  function openBattleDecision(mode) {
    if (state.leaveConfirmOpen || !state.running || !nodes.resultPanel.classList.contains("hidden")) return;
    state.leaveConfirmOpen = true;
    state.decisionMode = mode;
    suspendBoardTasks();
    applyDecisionText();
    nodes.leaveConfirmPanel.classList.remove("hidden");
    setBattleCovered(true);
    requestAnimationFrame(() => nodes.keepPlayingBtn.focus({ preventScroll: true }));
  }

  function closeLeaveConfirm(restoreFocus = true) {
    if (!state.leaveConfirmOpen) return;
    const mode = state.decisionMode;
    state.leaveConfirmOpen = false;
    state.decisionMode = null;
    nodes.leaveConfirmPanel.classList.add("hidden");
    setBattleCovered(false);
    resumeBoardTasks();
    if (restoreFocus) requestAnimationFrame(() => mode === "pause" ? nodes.pauseBtn.focus({ preventScroll: true }) : focusBoardTile());
  }

  function leaveCurrentStage() {
    if (!state.leaveConfirmOpen) return;
    closeLeaveConfirm(false);
    showStage(state.currentStageIndex);
  }

  function installLoading() {
    let progress = 0;
    const id = window.setInterval(() => {
      progress = Math.min(100, progress + 20);
      nodes.loadingText.textContent = `${progress}%`;
      nodes.loadingFill.style.width = `${progress}%`;
      if (progress >= 100) {
        window.clearInterval(id);
        window.setTimeout(() => {
          nodes.loadingPanel.classList.add("hidden");
          window.WonderAnalytics?.track("game_ready", { game_id: GAME_ID });
        }, 120);
      }
    }, 70);
  }

  window.__snackBlocksSmoke = {
    stageCatalog() {
      return stages.map((stage) => ({ ...stage, pool: [...stage.pool], snacks: stage.snacks ? [...stage.snacks] : undefined }));
    },
    readState() {
      return {
        stage: activeStage().id,
        score: state.score,
        moves: state.moves,
        combo: state.combo,
        selected: state.selected,
        busy: state.busy,
        board: state.board.map((tile) => tile.type),
        goalCount: state.goalCount,
        bestCascade: state.bestCascade,
        bestBurst: state.bestBurst,
        goal: goalLabel(),
      };
    },
  };

  nodes.nextBtn.addEventListener("click", () => startStage(Math.min(state.currentStageIndex + 1, stages.length - 1)));
  nodes.againBtn.addEventListener("click", () => {
    window.WonderAnalytics?.track("game_restart", {
      game_id: GAME_ID,
      stage: activeStage().id,
    });
    startStage(state.currentStageIndex);
  });
  nodes.menuBtn.addEventListener("click", showMenu);
  nodes.startBtn.addEventListener("keydown", rejectRepeatedScreenActivation, true);
  nodes.stageGrid.addEventListener("keydown", rejectRepeatedScreenActivation, true);
  nodes.startBtn.addEventListener("click", () => showStage());
  nodes.stageBackBtn.addEventListener("click", showMain);
  nodes.battleBackBtn.addEventListener("click", () => openBattleDecision("leave"));
  nodes.pauseBtn.addEventListener("click", () => openBattleDecision("pause"));
  nodes.keepPlayingBtn.addEventListener("click", () => closeLeaveConfirm(true));
  nodes.leaveStageBtn.addEventListener("click", leaveCurrentStage);
  nodes.leaveConfirmPanel.addEventListener("keydown", (event) => {
    if (event.repeat && ["Enter", " "].includes(event.key)) {
      event.preventDefault();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeLeaveConfirm(true);
      return;
    }
    if (event.key !== "Tab" || !state.leaveConfirmOpen) return;
    if (event.shiftKey && document.activeElement === nodes.keepPlayingBtn) {
      event.preventDefault();
      nodes.leaveStageBtn.focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === nodes.leaveStageBtn) {
      event.preventDefault();
      nodes.keepPlayingBtn.focus({ preventScroll: true });
    }
  });
  nodes.localeSelect.addEventListener("change", (event) => setLocale(event.target.value));
  nodes.homeLink.addEventListener("click", (event) => {
    if (state.running || !nodes.resultPanel.classList.contains("hidden")) {
      event.preventDefault();
      showMenu();
    }
  });
  window.addEventListener("load", () => {
    if (window.WonderI18n?.locale?.() !== state.locale) window.WonderI18n?.setLocale?.(state.locale);
    applyText();
  }, { once: true });
  window.addEventListener("pagehide", suspendBoardTasks);
  window.addEventListener("pageshow", resumeBoardTasks);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) suspendBoardTasks();
    else resumeBoardTasks();
  });

  try {
    setLocale(localStorage.getItem(canonicalLocaleKey) || localStorage.getItem(legacyLocaleKey) || window.WonderI18n?.locale?.() || "en");
  } catch {
    setLocale("en");
  }
  installStageDrag();
  installLoading();
})();
