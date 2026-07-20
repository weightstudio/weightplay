(function () {
  const canonicalLocaleKey = "weightPlayLocale";
  const legacyLocaleKey = "weightplayLocale";
  const storageFallback = new Map();

  function storageRead(key) {
    try {
      const value = localStorage.getItem(key);
      if (value !== null) storageFallback.set(key, value);
      return value ?? storageFallback.get(key) ?? null;
    } catch {
      return storageFallback.get(key) ?? null;
    }
  }

  function storageWrite(key, value) {
    const normalized = String(value);
    storageFallback.set(key, normalized);
    try {
      localStorage.setItem(key, normalized);
      return true;
    } catch {
      return false;
    }
  }

  const canonicalSavedLocale = storageRead(canonicalLocaleKey);
  const legacySavedLocale = storageRead(legacyLocaleKey);
  if (!canonicalSavedLocale && ["en", "zh-Hant", "zh-Hans", "es"].includes(legacySavedLocale)) {
    storageWrite(canonicalLocaleKey, legacySavedLocale);
    window.WonderI18n?.setLocale?.(legacySavedLocale);
  }

  const canvas = document.querySelector("#gameCanvas");
  const ctx = canvas.getContext("2d");
  const localeSelect = document.querySelector("#localeSelect");
  const languageLabel = document.querySelector("#languageLabel");
  const titleText = document.querySelector("#titleText");
  const hud = document.querySelector("#hud");
  const scoreLabel = document.querySelector("#scoreLabel");
  const timeLabel = document.querySelector("#timeLabel");
  const comboLabel = document.querySelector("#comboLabel");
  const scoreText = document.querySelector("#scoreText");
  const timeText = document.querySelector("#timeText");
  const comboText = document.querySelector("#comboText");
  const startPanel = document.querySelector("#startPanel");
  const mainPanel = document.querySelector("#mainPanel");
  const canvasWrap = document.querySelector(".canvas-wrap");
  const homeLink = document.querySelector(".home-link");
  const startTitle = document.querySelector("#startTitle");
  const startText = document.querySelector("#startText");
  const controlChips = document.querySelector("#controlChips");
  const startBtn = document.querySelector("#startBtn");
  const stagePanel = document.querySelector("#stagePanel");
  const stageBackBtn = document.querySelector("#stageBackBtn");
  const stageTitle = document.querySelector("#stageTitle");
  const stageProgress = document.querySelector("#stageProgress");
  const stageHint = document.querySelector("#stageHint");
  const stageRail = document.querySelector("#stageRail");
  const stageDots = document.querySelector("#stageDots");
  const battleBackBtn = document.querySelector("#battleBackBtn");
  const resultPanel = document.querySelector("#resultPanel");
  const resultTitle = document.querySelector("#resultTitle");
  const resultText = document.querySelector("#resultText");
  const skillReportTitle = document.querySelector("#skillReportTitle");
  const skillReportIntro = document.querySelector("#skillReportIntro");
  const reactionLabel = document.querySelector("#reactionLabel");
  const reactionValue = document.querySelector("#reactionValue");
  const focusLabel = document.querySelector("#focusLabel");
  const focusValue = document.querySelector("#focusValue");
  const coordinationLabel = document.querySelector("#coordinationLabel");
  const coordinationValue = document.querySelector("#coordinationValue");
  const progressComparison = document.querySelector("#progressComparison");
  const leaderboard = document.querySelector("#leaderboard");
  const nextRouteBtn = document.querySelector("#nextRouteBtn") || (() => {
    const button = document.createElement("button");
    button.id = "nextRouteBtn";
    button.className = "hidden";
    button.type = "button";
    leaderboard.after(button);
    return button;
  })();
  const againBtn = document.querySelector("#againBtn");
  const lobbyLink = document.querySelector("#lobbyLink");
  const loadingPanel = document.querySelector("#loadingPanel");
  const loadingTitle = document.querySelector("#loadingTitle");
  const loadingText = document.querySelector("#loadingText");
  const loadingFill = document.querySelector("#loadingFill");
  const dashGame = document.querySelector(".dash-game");
  const laneStatus = document.createElement("p");
  laneStatus.id = "laneStatus";
  laneStatus.className = "dash-lane-status";
  laneStatus.setAttribute("role", "status");
  laneStatus.setAttribute("aria-live", "polite");
  laneStatus.setAttribute("aria-atomic", "true");
  canvasWrap.append(laneStatus);
  dashGame?.setAttribute("data-wp-canvas-max-width", "920");
  const leavePanel = document.createElement("section");
  leavePanel.className = "leave-panel hidden";
  leavePanel.setAttribute("role", "dialog");
  leavePanel.setAttribute("aria-modal", "true");
  leavePanel.setAttribute("aria-labelledby", "leaveTitle");
  leavePanel.innerHTML = `<div class="leave-card"><h2 id="leaveTitle"></h2><p id="leaveText"></p><div><button id="keepRunningBtn" type="button"></button><button id="leaveRouteBtn" type="button"></button></div></div>`;
  dashGame.append(leavePanel);
  const leaveTitle = leavePanel.querySelector("#leaveTitle");
  const leaveText = leavePanel.querySelector("#leaveText");
  const keepRunningBtn = leavePanel.querySelector("#keepRunningBtn");
  const leaveRouteBtn = leavePanel.querySelector("#leaveRouteBtn");

  const GAME_ID = "campus-dash";
  const LEADERBOARD_KEY = "campusDashLeaderboard";
  const PROGRESS_KEY = "campusDashProgressV2";
  const W = canvas.width;
  const H = canvas.height;
  const lanes = [W * 0.26, W * 0.5, W * 0.74];

  const dictionary = {
    en: {
      title: "Safari Dash",
      language: "Language",
      backToLobby: "Back to WeightPlay lobby",
      controls: "Controls",
      backToMenu: "Back to menu",
      gameLabel: "Safari Dash game",
      description: "Clear 30 saved Safari Dash routes with star trails, two-lane gates, sticky mud, five objective types, and six Guardian Checks.",
      score: "Score",
      time: "Time",
      combo: "Combo",
      startTitle: "Pick a lane. Dash fast.",
      startText: "Clear 30 saved routes where trail rules, objectives, and Guardian patterns change how you run.",
      controlTap: "Tap left / right",
      controlSwipe: "Swipe lanes",
      controlKeyboard: "A/D or Left/Right",
      start: "Start Game",
      chooseRoute: "Choose a Safari Route",
      stageProgress: "{unlocked} / 30 unlocked",
      stageHint: "Swipe the route cards. Every fifth route is a Guardian Check.",
      stageSelection: "Safari routes",
      stageLocked: "Clear the previous route",
      stageReady: "Ready",
      stageCleared: "Cleared",
      guardianCheck: "Guardian Check",
      routeRules: "Route rules",
      objectiveCoins: "Collect {target} stars",
      objectiveCombo: "Reach combo x{target}",
      objectiveClean: "Finish with at most {target} bumps",
      objectiveScore: "Score {target} points",
      objectiveFinish: "Reach the finish",
      routeClear: "Route {stage} cleared!",
      routeFailed: "Route goal missed. Try this route again.",
      nextRoute: "Next route unlocked: {stage}",
      allRoutesClear: "All 30 safari routes are clear!",
      routes: "Routes",
      ruleClassic: "Open trail",
      ruleTrail: "Star trail",
      ruleGate: "Two-lane gates",
      ruleMud: "Sticky mud",
      rulePulse: "Guardian pattern",
      resultTitle: "Run Complete!",
      resultText: "Score {score}  Best {best}",
      skillReport: "Skill Report",
      skillIntro: "This run practiced quick choices, steady focus, and lane control.",
      reaction: "Reaction",
      reactionValue: "{count} lane changes",
      focus: "Focus",
      focusValue: "{coins} collected · {bumps} bumps",
      coordination: "Hand-Eye Coordination",
      coordinationValue: "Best combo x{combo}",
      firstRun: "Today's score: {score}",
      progress: "Today's score: {score} · Previous best: {previous}",
      newBest: "New best: {score}! Previous best: {previous}",
      again: "Run Again",
      lobby: "Lobby",
      loading: "Loading",
      leaderboard: "Local Top 5",
      emptyRank: "No runs yet",
      laneLeft: "left lane",
      laneCenter: "center lane",
      laneRight: "right lane",
      laneMoved: "Moved to the {lane}",
    },
    "zh-Hant": {
      title: "\u8349\u539f\u9583\u96fb\u8dd1",
      language: "\u8a9e\u8a00",
      backToLobby: "\u8fd4\u56de WeightPlay \u5927\u5ef3",
      controls: "\u64cd\u4f5c\u65b9\u5f0f",
      backToMenu: "\u8fd4\u56de\u9078\u55ae",
      gameLabel: "\u8349\u539f\u9583\u96fb\u8dd1\u904a\u6232",
      description: "\u5b8c\u6210 30 \u689d\u53ef\u5b58\u6a94\u7684\u8349\u539f\u8def\u7dda\uff0c\u6311\u6230\u661f\u661f\u8ecc\u8de1\u3001\u96d9\u8def\u969c\u7919\u9580\u3001\u9ecf\u6ed1\u6ce5\u6f25\u3001\u4e94\u7a2e\u76ee\u6a19\u8207\u516d\u5834\u5b88\u8b77\u8005\u6aa2\u67e5\u3002",
      score: "\u5206\u6578",
      time: "\u6642\u9593",
      combo: "\u9023\u64ca",
      startTitle: "\u9078\u597d\u8dd1\u9053\uff0c\u5feb\u901f\u885d\u523a\u3002",
      startText: "\u6311\u6230 30 \u689d\u53ef\u5b58\u6a94\u8def\u7dda\uff0c\u6bcf\u95dc\u7684\u8ecc\u8de1\u898f\u5247\u3001\u76ee\u6a19\u8207\u5b88\u8b77\u8005\u9663\u578b\u90fd\u6703\u6539\u8b8a\u8dd1\u6cd5\u3002",
      controlTap: "\u9ede\u5de6\u908a / \u53f3\u908a",
      controlSwipe: "\u5de6\u53f3\u6ed1\u52d5",
      controlKeyboard: "A/D \u6216 \u2190/\u2192",
      start: "\u958b\u59cb\u904a\u6232",
      chooseRoute: "\u9078\u64c7\u8349\u539f\u8def\u7dda",
      stageProgress: "\u5df2\u89e3\u9396 {unlocked} / 30",
      stageHint: "\u5de6\u53f3\u6ed1\u52d5\u8def\u7dda\u5361\uff0c\u6bcf 5 \u95dc\u6703\u9047\u5230\u5b88\u8b77\u8005\u6aa2\u67e5\u3002",
      stageSelection: "\u8349\u539f\u8def\u7dda",
      stageLocked: "\u5148\u901a\u904e\u524d\u4e00\u689d\u8def\u7dda",
      stageReady: "\u53ef\u6311\u6230",
      stageCleared: "\u5df2\u5b8c\u6210",
      guardianCheck: "\u5b88\u8b77\u8005\u6aa2\u67e5",
      routeRules: "\u8def\u7dda\u898f\u5247",
      objectiveCoins: "\u6536\u96c6 {target} \u9846\u661f\u661f",
      objectiveCombo: "\u9054\u5230\u9023\u64ca x{target}",
      objectiveClean: "\u78b0\u649e\u4e0d\u8d85\u904e {target} \u6b21",
      objectiveScore: "\u53d6\u5f97 {target} \u5206",
      objectiveFinish: "\u62b5\u9054\u7d42\u9ede",
      routeClear: "\u7b2c {stage} \u689d\u8def\u7dda\u5b8c\u6210\uff01",
      routeFailed: "\u5c1a\u672a\u9054\u6210\u8def\u7dda\u76ee\u6a19\uff0c\u518d\u8a66\u4e00\u6b21\u3002",
      nextRoute: "\u5df2\u89e3\u9396\u7b2c {stage} \u689d\u8def\u7dda",
      allRoutesClear: "30 \u689d\u8349\u539f\u8def\u7dda\u5168\u90e8\u5b8c\u6210\uff01",
      routes: "\u8def\u7dda",
      ruleClassic: "\u958b\u653e\u8349\u5f91",
      ruleTrail: "\u661f\u661f\u8ecc\u8de1",
      ruleGate: "\u96d9\u8def\u969c\u7919\u9580",
      ruleMud: "\u9ecf\u6ed1\u6ce5\u6f25",
      rulePulse: "\u5b88\u8b77\u8005\u9663\u578b",
      resultTitle: "\u5954\u8dd1\u5b8c\u6210\uff01",
      resultText: "\u5206\u6578 {score}  \u6700\u4f73 {best}",
      skillReport: "\u6280\u80fd\u5831\u544a",
      skillIntro: "\u9019\u6b21\u5954\u8dd1\u7df4\u7fd2\u4e86\u5feb\u901f\u9078\u64c7\u3001\u4fdd\u6301\u5c08\u6ce8\uff0c\u4ee5\u53ca\u63a7\u5236\u8dd1\u9053\u3002",
      reaction: "\u53cd\u61c9",
      reactionValue: "\u63db\u9053 {count} \u6b21",
      focus: "\u5c08\u6ce8",
      focusValue: "\u6536\u96c6 {coins} \u500b \u00b7 \u78b0\u5230 {bumps} \u6b21",
      coordination: "\u624b\u773c\u5354\u8abf",
      coordinationValue: "\u6700\u4f73\u9023\u64ca x{combo}",
      firstRun: "\u672c\u6b21\u5206\u6578\uff1a{score}",
      progress: "\u672c\u6b21\u5206\u6578\uff1a{score} \u00b7 \u4e0a\u6b21\u6700\u4f73\uff1a{previous}",
      newBest: "\u65b0\u7684\u6700\u4f73\u5206\u6578\uff1a{score}\uff01\u4e0a\u6b21\u6700\u4f73\uff1a{previous}",
      again: "\u518d\u8dd1\u4e00\u6b21",
      lobby: "\u5927\u5ef3",
      loading: "\u8f09\u5165\u4e2d",
      leaderboard: "\u672c\u6a5f\u524d 5 \u540d",
      emptyRank: "\u9084\u6c92\u6709\u7d00\u9304",
      laneLeft: "\u5de6\u5074\u8dd1\u9053",
      laneCenter: "\u4e2d\u9593\u8dd1\u9053",
      laneRight: "\u53f3\u5074\u8dd1\u9053",
      laneMoved: "\u5df2\u79fb\u5230{lane}",
    },
    es: {
      title: "Carrera Relámpago de Safari", language: "Idioma", backToLobby: "Volver a la sala de WeightPlay", controls: "Controles", backToMenu: "Volver al menú", gameLabel: "Juego Carrera Relámpago de Safari",
      description: "Completa 30 rutas guardadas con senderos de estrellas, puertas de dos carriles, barro pegajoso, cinco tipos de objetivo y seis pruebas de guardianes.", score: "Puntuación", time: "Tiempo", combo: "Combo",
      startTitle: "Elige un carril. Corre rápido.", startText: "Completa 30 rutas guardadas cuyas reglas, objetivos y patrones de guardianes cambian tu forma de correr.", controlTap: "Toca izquierda / derecha", controlSwipe: "Desliza entre carriles", controlKeyboard: "A/D o ←/→", start: "Empezar",
      chooseRoute: "Elegir una ruta de safari", stageProgress: "{unlocked} / 30 desbloqueadas", stageHint: "Desliza las tarjetas. Cada quinta ruta es una prueba de guardián.", stageSelection: "Rutas de safari", stageLocked: "Completa la ruta anterior", stageReady: "Lista", stageCleared: "Completada", guardianCheck: "Prueba de guardián", routeRules: "Reglas de la ruta",
      objectiveCoins: "Recoge {target} estrellas", objectiveCombo: "Alcanza un combo x{target}", objectiveClean: "Termina con un máximo de {target} choques", objectiveScore: "Consigue {target} puntos", objectiveFinish: "Llega a la meta",
      routeClear: "¡Ruta {stage} completada!", routeFailed: "No se alcanzó el objetivo. Intenta la ruta otra vez.", nextRoute: "Siguiente ruta desbloqueada: {stage}", allRoutesClear: "¡Las 30 rutas están completadas!", routes: "Rutas",
      ruleClassic: "Sendero abierto", ruleTrail: "Rastro de estrellas", ruleGate: "Puertas de dos carriles", ruleMud: "Barro pegajoso", rulePulse: "Patrón del guardián",
      resultTitle: "¡Carrera completada!", resultText: "Puntuación {score}  Mejor {best}", skillReport: "Informe de habilidades", skillIntro: "Esta carrera practicó decisiones rápidas, atención constante y control de carriles.", reaction: "Reacción", reactionValue: "{count} cambios de carril", focus: "Concentración", focusValue: "{coins} recogidas · {bumps} choques", coordination: "Coordinación visual", coordinationValue: "Mejor combo x{combo}",
      firstRun: "Puntuación de hoy: {score}", progress: "Puntuación de hoy: {score} · Mejor anterior: {previous}", newBest: "¡Nuevo récord: {score}! Mejor anterior: {previous}", again: "Correr de nuevo", lobby: "Sala de juegos", loading: "Cargando", leaderboard: "5 mejores locales", emptyRank: "Aún no hay carreras",
      laneLeft: "carril izquierdo", laneCenter: "carril central", laneRight: "carril derecho", laneMoved: "Te moviste al {lane}",
    },
  };

  Object.assign(dictionary.en, {
    nextRouteAction: "Next Route",
    leaveTitle: "Leave this route?",
    leaveText: "Your time, stars, score, and combo in this run will reset.",
    keepRunning: "Keep running",
    leaveRoute: "Leave route",
  });
  Object.assign(dictionary["zh-Hant"], {
    nextRouteAction: "\u4e0b\u4e00\u689d\u8def\u7dda",
    leaveTitle: "\u8981\u96e2\u958b\u9019\u689d\u8def\u7dda\u55ce\uff1f",
    leaveText: "\u9019\u6b21\u5954\u8dd1\u7684\u6642\u9593\u3001\u661f\u661f\u3001\u5206\u6578\u8207\u9023\u64ca\u6703\u91cd\u65b0\u958b\u59cb\u3002",
    keepRunning: "\u7e7c\u7e8c\u5954\u8dd1",
    leaveRoute: "\u96e2\u958b\u8def\u7dda",
  });
  Object.assign(dictionary.es, {
    nextRouteAction: "Siguiente ruta",
    leaveTitle: "¿Salir de esta ruta?",
    leaveText: "Se reiniciarán el tiempo, las estrellas, la puntuación y el combo de esta carrera.",
    keepRunning: "Seguir corriendo",
    leaveRoute: "Salir de la ruta",
  });
  Object.assign(dictionary, {
    "zh-Hans": { nextRouteAction: "\u4e0b\u4e00\u6761\u8def\u7ebf" },
    ja: { nextRouteAction: "\u6b21\u306e\u30eb\u30fc\u30c8" },
    ko: { nextRouteAction: "\ub2e4\uc74c \uacbd\ub85c" },
    "pt-BR": { nextRouteAction: "Pr\u00f3xima rota" },
    fr: { nextRouteAction: "Itin\u00e9raire suivant" },
    de: { nextRouteAction: "N\u00e4chste Route" },
    it: { nextRouteAction: "Percorso successivo" },
    ru: { nextRouteAction: "\u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0439 \u043c\u0430\u0440\u0448\u0440\u0443\u0442" },
  });

  const regionNames = [
    ["Sunrise Savanna", "\u6668\u66e6\u8349\u539f"],
    ["Acacia Crossing", "\u91d1\u5408\u6b61\u8def\u53e3"],
    ["Marshlight Bend", "\u6fa4\u5149\u5f4e\u9053"],
    ["Red Canyon Run", "\u8d64\u5cfd\u8dd1\u9053"],
    ["Moonwater Reserve", "\u6708\u6c34\u4fdd\u8b77\u5340"],
    ["Crown Safari", "\u738b\u51a0\u8349\u539f"],
  ];
  ["Sabana del amanecer", "Cruce de acacias", "Curva del pantano luminoso", "Carrera del cañón rojo", "Reserva de aguas lunares", "Safari de la corona"]
    .forEach((name, index) => regionNames[index].push(name));

  function route(id, nameEn, nameZht, mechanics, objective, duration, bossEn = "", bossZht = "") {
    return {
      id,
      region: Math.ceil(id / 5),
      nameEn,
      nameZht,
      mechanics,
      objective,
      duration,
      checkpoint: id % 5 === 0,
      bossEn,
      bossZht,
    };
  }

  const ROUTES = [
    route(1, "First Pawprints", "\u7b2c\u4e00\u9053\u8db3\u8de1", ["classic"], ["finish", 0], 28),
    route(2, "Golden Star Trail", "\u91d1\u8272\u661f\u8ecc", ["trail"], ["coins", 6], 30),
    route(3, "Cone Weave", "\u4ea4\u932f\u8def\u9310", ["classic", "gate"], ["clean", 2], 30),
    route(4, "Three-Lane Rhythm", "\u4e09\u7dda\u7bc0\u594f", ["trail", "gate"], ["combo", 4], 32),
    route(5, "Zebra Stripe Check", "\u6591\u99ac\u689d\u7d0b\u6aa2\u67e5", ["gate", "pulse"], ["score", 300], 34, "Zebra Pathfinder", "\u6591\u99ac\u5c0b\u8def\u8005"),
    route(6, "Acacia Star Line", "\u91d1\u5408\u6b61\u661f\u7dda", ["trail"], ["coins", 8], 32),
    route(7, "Satchel Switchback", "\u884c\u56ca\u5f4e\u9053", ["gate"], ["clean", 2], 34),
    route(8, "Bookstack Gates", "\u66f8\u5806\u96d9\u9580", ["gate", "classic"], ["score", 350], 34),
    route(9, "Acacia Zigzag", "\u91d1\u5408\u6b61\u4e4b\u5b57\u8def", ["trail", "gate"], ["combo", 5], 35),
    route(10, "Rhino Rush Check", "\u72a7\u725b\u885d\u523a\u6aa2\u67e5", ["gate", "pulse"], ["clean", 1], 36, "Rhino Trailkeeper", "\u72a7\u725b\u5b88\u5f91\u8005"),
    route(11, "Marsh Star Steps", "\u6fa4\u5730\u661f\u6b65", ["mud", "trail"], ["coins", 9], 34),
    route(12, "Puddle Patience", "\u6c34\u6f25\u8010\u5fc3\u8def", ["mud"], ["clean", 2], 35),
    route(13, "Crocodile Crossing", "\u9c77\u9b5a\u6e21\u53e3", ["mud", "gate"], ["score", 400], 36),
    route(14, "Reedbed Star Chain", "\u8606\u82c7\u661f\u93c8", ["mud", "trail", "gate"], ["combo", 6], 37),
    route(15, "Hippo Pool Check", "\u6cb3\u99ac\u6c34\u6f6d\u6aa2\u67e5", ["mud", "pulse"], ["coins", 10], 38, "Hippo Waterwarden", "\u6cb3\u99ac\u5b88\u6c34\u8005"),
    route(16, "Red Rock Sprint", "\u8d64\u5ca9\u885d\u523a", ["classic", "gate"], ["score", 450], 36),
    route(17, "Echoing Star Trail", "\u56de\u8072\u661f\u8ecc", ["trail", "gate"], ["coins", 11], 38),
    route(18, "Twin Canyon Gates", "\u96d9\u5cfd\u8c37\u9580", ["gate", "pulse"], ["clean", 1], 38),
    route(19, "Cliffside Combo", "\u61f8\u5d16\u9023\u64ca", ["trail", "gate", "pulse"], ["combo", 7], 40),
    route(20, "Eagle Shadow Check", "\u98db\u9df9\u4e4b\u5f71\u6aa2\u67e5", ["gate", "pulse", "trail"], ["score", 550], 40, "Eagle Skykeeper", "\u98db\u9df9\u5929\u969b\u5b88\u8b77\u8005"),
    route(21, "Moonwater Drift", "\u6708\u6c34\u6f02\u79fb", ["mud", "gate"], ["clean", 1], 38),
    route(22, "Firefly Star Chain", "\u87a2\u706b\u661f\u93c8", ["trail", "mud"], ["coins", 12], 40),
    route(23, "Night Gate Rhythm", "\u591c\u8272\u96d9\u9580\u7bc0\u594f", ["gate", "pulse"], ["combo", 7], 40),
    route(24, "Reserve Relay", "\u4fdd\u8b77\u5340\u63a5\u529b", ["mud", "trail", "gate"], ["score", 600], 42),
    route(25, "Lion Pride Check", "\u7345\u7fa4\u6aa2\u67e5", ["mud", "gate", "pulse"], ["clean", 1], 42, "Lion Pridekeeper", "\u7345\u7fa4\u5b88\u8b77\u8005"),
    route(26, "Crown Gate Entry", "\u738b\u51a0\u5165\u53e3", ["gate", "trail"], ["coins", 13], 40),
    route(27, "Royal Mud Maze", "\u738b\u5bb6\u6ce5\u6f25\u8ff7\u5bae", ["mud", "gate"], ["clean", 1], 42),
    route(28, "Keeper Star Relay", "\u5b88\u8b77\u661f\u63a5\u529b", ["trail", "pulse", "gate"], ["combo", 8], 42),
    route(29, "All-Trail Gauntlet", "\u5168\u8def\u7dda\u8a66\u7149", ["mud", "trail", "gate", "pulse"], ["score", 700], 44),
    route(30, "Elephant Crown Check", "\u8c61\u738b\u4e4b\u51a0\u6aa2\u67e5", ["mud", "trail", "gate", "pulse"], ["coins", 15], 45, "Elephant Crownkeeper", "\u8c61\u738b\u51a0\u5b88\u8b77\u8005"),
  ];

  const spanishRouteCopy = [
    ["Primeras huellas", ""], ["Rastro de estrellas doradas", ""], ["Zigzag de conos", ""], ["Ritmo de tres carriles", ""], ["Prueba de rayas de cebra", "Cebra exploradora"],
    ["Línea estelar de acacias", ""], ["Curva de la mochila", ""], ["Puertas de libros", ""], ["Zigzag de acacias", ""], ["Prueba de embestida del rinoceronte", "Rinoceronte guardasenderos"],
    ["Pasos estelares del pantano", ""], ["Paciencia entre charcos", ""], ["Cruce del cocodrilo", ""], ["Cadena estelar de juncos", ""], ["Prueba de la charca del hipopótamo", "Hipopótamo guardián del agua"],
    ["Carrera de roca roja", ""], ["Rastro de estrellas con eco", ""], ["Puertas gemelas del cañón", ""], ["Combo junto al acantilado", ""], ["Prueba de la sombra del águila", "Águila guardiana del cielo"],
    ["Deriva de aguas lunares", ""], ["Cadena estelar de luciérnagas", ""], ["Ritmo de puertas nocturnas", ""], ["Relevo de la reserva", ""], ["Prueba de la manada de leones", "León guardián de la manada"],
    ["Entrada de la puerta de la corona", ""], ["Laberinto de barro real", ""], ["Relevo estelar del guardián", ""], ["Desafío de todos los senderos", ""], ["Prueba de la corona del elefante", "Elefante guardián de la corona"],
  ];
  if (spanishRouteCopy.length !== ROUTES.length) throw new Error("Spanish safari-route coverage must match all routes.");
  ROUTES.forEach((config, index) => {
    [config.nameEs, config.bossEs] = spanishRouteCopy[index];
  });

  function loadProgress() {
    try {
      const source = JSON.parse(storageRead(PROGRESS_KEY) || "{}");
      const unlocked = Math.max(1, Math.min(30, Number(source.unlocked) || 1));
      return {
        unlocked,
        selected: Math.max(1, Math.min(unlocked, Number(source.selected) || unlocked)),
        completed: [...new Set(Array.isArray(source.completed) ? source.completed.map(Number).filter((id) => id >= 1 && id <= 30) : [])],
      };
    } catch {
      return { unlocked: 1, selected: 1, completed: [] };
    }
  }

  function saveProgress() {
    storageWrite(PROGRESS_KEY, JSON.stringify(progress));
  }

  let progress = loadProgress();
  function loadImage(src) {
    const image = new Image();
    image.src = src;
    return image;
  }

  const sprites = {
    runway: loadImage("../../assets/campus-dash-savanna-runway.jpg"),
    hero: loadImage("../../assets/campus-dash-spark-fox-runner.png"),
    coin: loadImage("../../assets/campus-dash-coin-premium.webp"),
    cone: loadImage("../../assets/campus-dash-cone-premium.webp"),
    bag: loadImage("../../assets/campus-dash-bag-premium.webp"),
    books: loadImage("../../assets/campus-dash-books-premium.webp"),
    puddle: loadImage("../../assets/campus-dash-puddle-premium.webp"),
  };

  let state = makeState();
  let lastTime = 0;
  let lifecycleSuspended = false;
  let leaveOpen = false;
  let pointerStartX = null;
  let activePointerId = null;
  let routeScrollTimer = 0;

  function clearPointerInput() {
    if (activePointerId !== null) {
      try { canvas.releasePointerCapture?.(activePointerId); } catch { /* Capture may already be gone. */ }
    }
    pointerStartX = null;
    activePointerId = null;
  }

  function setLeaveOpen(open, restoreFocus = true) {
    if (open === leaveOpen) return;
    leaveOpen = open;
    clearPointerInput();
    leavePanel.classList.toggle("hidden", !open);
    canvasWrap.inert = open;
    hud.inert = open;
    if (open) {
      canvasWrap.setAttribute("aria-hidden", "true");
      hud.setAttribute("aria-hidden", "true");
      keepRunningBtn.focus({ preventScroll: true });
    } else {
      canvasWrap.removeAttribute("aria-hidden");
      hud.removeAttribute("aria-hidden");
      lastTime = performance.now();
      if (restoreFocus) battleBackBtn.focus({ preventScroll: true });
    }
  }

  function locale() {
    return window.WonderI18n?.locale() || "en";
  }

  function t(key, params = {}) {
    const table = dictionary[locale()] || dictionary.en;
    return Object.entries(params).reduce((text, [name, value]) => {
      return text.replaceAll(`{${name}}`, String(value));
    }, table[key] || dictionary.en[key] || key);
  }

  function makeState() {
    const routeConfig = ROUTES[Math.max(0, Math.min(29, (progress?.selected || 1) - 1))] || ROUTES[0];
    return {
      running: false,
      finished: false,
      lane: 1,
      targetLane: 1,
      x: lanes[1],
      y: H - 155,
      stage: routeConfig.id,
      route: routeConfig,
      timeLeft: routeConfig.duration,
      score: 0,
      combo: 1,
      bestCombo: 0,
      laneChanges: 0,
      coinsCollected: 0,
      obstaclesHit: 0,
      speed: 390,
      spawnTimer: 0.4,
      coinTimer: 0.9,
      patternTimer: 2.6,
      patternStep: 0,
      mudSlow: 0,
      lanePulse: 0,
      lanePulseLane: 1,
      lanePulseDir: 0,
      obstacles: [],
      coins: [],
      sparks: [],
    };
  }

  function renderStaticText() {
    document.documentElement.lang = locale();
    localeSelect.value = locale();
    languageLabel.textContent = t("language");
    titleText.textContent = t("title");
    document.title = `${t("title")} - WeightPlay`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t("description"));
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", `${t("title")} - WeightPlay`);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", t("description"));
    homeLink.setAttribute("aria-label", t("backToLobby"));
    controlChips.setAttribute("aria-label", t("controls"));
    battleBackBtn.setAttribute("aria-label", t("backToMenu"));
    canvas.setAttribute("aria-label", t("gameLabel"));
    scoreLabel.textContent = t("score");
    timeLabel.textContent = t("time");
    comboLabel.textContent = t("combo");
    startTitle.textContent = t("startTitle");
    startText.textContent = t("startText");
    controlChips.innerHTML = [t("controlTap"), t("controlSwipe"), t("controlKeyboard")].map((item) => `<span>${item}</span>`).join("");
    startBtn.textContent = t("start");
    stageBackBtn.setAttribute("aria-label", t("backToMenu"));
    stageTitle.textContent = t("chooseRoute");
    stageHint.textContent = t("stageHint");
    stageRail.setAttribute("aria-label", t("stageSelection"));
    resultTitle.textContent = t("resultTitle");
    nextRouteBtn.textContent = t("nextRouteAction");
    againBtn.textContent = t("again");
    lobbyLink.textContent = t("routes");
    leaveTitle.textContent = t("leaveTitle");
    leaveText.textContent = t("leaveText");
    keepRunningBtn.textContent = t("keepRunning");
    leaveRouteBtn.textContent = t("leaveRoute");
    loadingTitle.textContent = t("loading");
    if (!stagePanel.classList.contains("hidden")) renderStageSelector(false);
  }

  function preloadGame() {
    let percent = 0;
    let completed = false;
    const completeLoading = () => {
      if (completed) return;
      completed = true;
      loadingText.textContent = "100%";
      loadingFill.style.width = "100%";
      loadingPanel.classList.add("hidden");
      draw();
      window.WonderAnalytics?.track("game_ready", { game_id: GAME_ID });
    };
    const timer = setInterval(() => {
      percent += 25;
      loadingText.textContent = `${Math.min(100, percent)}%`;
      loadingFill.style.width = `${Math.min(100, percent)}%`;
      if (percent >= 100) {
        clearInterval(timer);
        completeLoading();
      }
    }, 80);
    window.setTimeout(() => {
      clearInterval(timer);
      completeLoading();
    }, 900);
  }

  function updateDashFrame() {
    if (!document.body.classList.contains("dash-playing") && !document.body.classList.contains("dash-stage-select")) return;
    const viewport = window.visualViewport;
    const viewportWidth = viewport?.width || innerWidth;
    const viewportHeight = viewport?.height || innerHeight;
    document.body.classList.remove("dash-expanded-canvas");
    const safeWidth = Math.min(Math.max(1, viewportWidth), 920);
    const frameLeft = (viewportWidth - safeWidth) / 2;
    const scale = Math.min(safeWidth / 382, Math.max(1, viewportHeight) / 780);
    const logicalWidth = safeWidth / scale;
    const logicalHeight = viewportHeight / scale;
    const frame = document.querySelector(".dash-game");
    document.documentElement.style.setProperty("--dash-frame-scale", String(scale));
    document.documentElement.style.setProperty("--dash-logical-width", `${logicalWidth}px`);
    document.documentElement.style.setProperty("--dash-logical-height", `${logicalHeight}px`);
    document.documentElement.style.setProperty("--dash-frame-left", `${frameLeft}px`);
    if (frame) {
      frame.dataset.logicalWidth = logicalWidth.toFixed(4);
      frame.dataset.logicalHeight = logicalHeight.toFixed(4);
      frame.dataset.commonScale = scale.toFixed(6);
    }
  }

  function exitSharedPlayViewport() {
    window.WeightPlayGame?.exitMobileGameMode?.();
    document.body.classList.remove("weightplay-active-viewport", "wp-mobile-game-mode");
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    if (document.webkitFullscreenElement) document.webkitExitFullscreen?.();
  }

  function showMain() {
    setLeaveOpen(false, false);
    clearPointerInput();
    state.running = false;
    document.body.classList.remove("dash-playing", "dash-stage-select", "dash-expanded-canvas");
    document.querySelector(".dash-game")?.classList.remove("is-playing");
    document.querySelector(".dash-game")?.setAttribute("data-play-viewport", "");
    mainPanel.classList.remove("hidden");
    stagePanel.classList.add("hidden");
    canvasWrap.classList.add("hidden");
    hud.classList.add("hidden");
    resultPanel.classList.add("hidden");
    canvasWrap.inert = false;
    canvasWrap.removeAttribute("aria-hidden");
    requestAnimationFrame(() => startBtn.focus({ preventScroll: true }));
  }

  function objectiveText(config) {
    const [type, target] = config.objective;
    return t(`objective${type[0].toUpperCase()}${type.slice(1)}`, { target });
  }

  function ruleText(mechanic) {
    return t(`rule${mechanic[0].toUpperCase()}${mechanic.slice(1)}`);
  }

  function routeName(config) {
    if (locale() === "zh-Hant") return config.nameZht;
    if (locale() === "es") return config.nameEs;
    return config.nameEn;
  }

  let centeredRouteFrame = 0;
  function updateCenteredRouteCard() {
    centeredRouteFrame = 0;
    const cards = [...stageRail.querySelectorAll(".stage-card")];
    if (!cards.length || !document.body.classList.contains("dash-stage-select")) return;
    const railRect = stageRail.getBoundingClientRect();
    const railCenter = railRect.left + railRect.width / 2;
    let centeredCard = cards[0];
    let centeredDistance = Infinity;
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - railCenter);
      if (distance < centeredDistance) {
        centeredCard = card;
        centeredDistance = distance;
      }
    });
    cards.forEach((card) => {
      const isCentered = card === centeredCard;
      card.classList.toggle("is-centered", isCentered);
      if (isCentered) card.setAttribute("aria-current", "true");
      else card.removeAttribute("aria-current");
    });
  }

  function scheduleCenteredRouteCard() {
    if (centeredRouteFrame) return;
    centeredRouteFrame = requestAnimationFrame(updateCenteredRouteCard);
  }

  stageRail.addEventListener("scroll", scheduleCenteredRouteCard, { passive: true });
  window.addEventListener("resize", scheduleCenteredRouteCard, { passive: true });
  window.visualViewport?.addEventListener("resize", scheduleCenteredRouteCard, { passive: true });

  function renderStageSelector(centerSelected = true) {
    stageProgress.textContent = t("stageProgress", { unlocked: progress.unlocked });
    stageRail.innerHTML = "";
    stageDots.innerHTML = "";
    ROUTES.forEach((config) => {
      const locked = config.id > progress.unlocked;
      const cleared = progress.completed.includes(config.id);
      const card = document.createElement("button");
      card.type = "button";
      card.className = `stage-card${config.id === progress.selected ? " is-selected" : ""}${config.checkpoint ? " is-checkpoint" : ""}`;
      card.dataset.stage = String(config.id);
      card.dataset.stageIndex = String(config.id - 1);
      card.dataset.rules = config.mechanics.join(",");
      card.disabled = locked;
      card.setAttribute("role", "listitem");
      card.innerHTML = `
        <span class="stage-region">${regionNames[config.region - 1][locale() === "zh-Hant" ? 1 : locale() === "es" ? 2 : 0]}</span>
        <strong>${config.id}. ${routeName(config)}</strong>
        ${config.checkpoint ? `<em>${t("guardianCheck")} · ${locale() === "zh-Hant" ? config.bossZht : locale() === "es" ? config.bossEs : config.bossEn}</em>` : ""}
        <small>${objectiveText(config)}</small>
        <span class="stage-rule">${config.mechanics.map(ruleText).join(" · ")}</span>
        <b>${locked ? t("stageLocked") : cleared ? t("stageCleared") : t("stageReady")}</b>`;
      card.addEventListener("click", () => {
        if (locked) return;
        progress.selected = config.id;
        saveProgress();
        renderStageSelector(false);
        startRun();
      });
      stageRail.appendChild(card);
      const dot = document.createElement("i");
      dot.className = `${config.id === progress.selected ? "is-selected " : ""}${config.checkpoint ? "is-checkpoint" : ""}`.trim();
      stageDots.appendChild(dot);
    });
    if (centerSelected) {
      requestAnimationFrame(() => {
        const selectedCard = stageRail.querySelector(".stage-card.is-selected");
        if (selectedCard && !stageRail.hasAttribute("data-wp-stage-rail")) {
          stageRail.scrollLeft = selectedCard.offsetLeft - (stageRail.clientWidth - selectedCard.offsetWidth) / 2;
        }
        requestAnimationFrame(updateCenteredRouteCard);
      });
    } else scheduleCenteredRouteCard();
  }

  function showStageSelection() {
    setLeaveOpen(false, false);
    clearPointerInput();
    state.running = false;
    document.body.classList.remove("dash-playing", "dash-expanded-canvas");
    document.body.classList.add("dash-stage-select");
    document.querySelector(".dash-game")?.classList.remove("is-playing");
    mainPanel.classList.add("hidden");
    canvasWrap.classList.add("hidden");
    hud.classList.add("hidden");
    resultPanel.classList.add("hidden");
    stagePanel.classList.remove("hidden");
    renderStageSelector(true);
    exitSharedPlayViewport();
    updateDashFrame();
    requestAnimationFrame(() => stageRail.querySelector(".stage-card.is-selected:not(:disabled)")?.focus({ preventScroll: true }));
  }

  window.addEventListener("resize", updateDashFrame);
  window.addEventListener("orientationchange", updateDashFrame);
  window.visualViewport?.addEventListener("resize", updateDashFrame);
  window.visualViewport?.addEventListener("scroll", updateDashFrame);

  function startRun() {
    setLeaveOpen(false, false);
    clearPointerInput();
    lifecycleSuspended = document.hidden;
    state = makeState();
    state.running = true;
    document.body.classList.remove("dash-stage-select");
    document.body.classList.add("dash-playing");
    document.querySelector(".dash-game")?.classList.add("is-playing");
    document.querySelector(".dash-game")?.removeAttribute("data-play-viewport");
    mainPanel.classList.add("hidden");
    stagePanel.classList.add("hidden");
    canvasWrap.classList.remove("hidden");
    canvasWrap.inert = false;
    canvasWrap.removeAttribute("aria-hidden");
    resultPanel.classList.add("hidden");
    hud.classList.remove("hidden");
    lastTime = performance.now();
    window.WonderSound?.play("click");
    exitSharedPlayViewport();
    updateDashFrame();
    window.WonderAnalytics?.track("game_start", { game_id: GAME_ID, locale: locale() });
    requestAnimationFrame(loop);
    requestAnimationFrame(() => {
      exitSharedPlayViewport();
      updateDashFrame();
      canvas.focus({ preventScroll: true });
    });
  }

  function loop(now) {
    if (lifecycleSuspended || document.hidden || leaveOpen) {
      lastTime = now;
      if (state.running) requestAnimationFrame(loop);
      return;
    }
    const elapsed = Math.max(0, (now - lastTime) / 1000 || 0);
    const dt = Math.min(0.033, elapsed);
    lastTime = now;
    update(dt, elapsed);
    draw();
    if (state.running) requestAnimationFrame(loop);
  }

  function update(dt, timerDt = dt) {
    state.timeLeft = Math.max(0, state.timeLeft - timerDt);
    state.speed += dt * 6;
    state.mudSlow = Math.max(0, state.mudSlow - dt);
    const laneResponse = state.mudSlow > 0 ? 5.4 : 12;
    state.x += (lanes[state.targetLane] - state.x) * Math.min(1, dt * laneResponse);
    state.spawnTimer -= dt;
    state.coinTimer -= dt;
    state.patternTimer -= dt;
    state.lanePulse = Math.max(0, state.lanePulse - dt);

    if (state.spawnTimer <= 0) {
      spawnObstacle();
      const elapsed = state.route.duration - state.timeLeft;
      state.spawnTimer = Math.max(0.46, 1.16 - elapsed * 0.006 - state.stage * 0.006);
    }
    if (state.coinTimer <= 0) {
      spawnCoin();
      state.coinTimer = state.route.mechanics.includes("trail") ? 0.58 + Math.random() * 0.22 : 0.92 + Math.random() * 0.4;
    }
    if (state.patternTimer <= 0 && (state.route.mechanics.includes("gate") || state.route.mechanics.includes("pulse"))) {
      spawnRoutePattern();
      state.patternTimer = state.route.mechanics.includes("pulse") ? 2.15 : 3.15;
    }

    for (const item of [...state.obstacles, ...state.coins]) item.y += state.speed * dt;
    state.obstacles = state.obstacles.filter((item) => item.y < H + 90);
    state.coins = state.coins.filter((item) => item.y < H + 90 && !item.used);
    state.sparks = state.sparks.filter((spark) => {
      spark.life -= dt;
      spark.y -= dt * 90;
      return spark.life > 0;
    });

    checkCollisions();
    updateHud();
    if (state.timeLeft <= 0) finishRun();
  }

  function spawnObstacle() {
    const lane = chooseClearDropLane(-90, 154);
    if (lane < 0) return;
    const kinds = state.route.mechanics.includes("mud") ? ["puddle", "puddle", "bag", "books"] : ["bag", "cone", "books"];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    state.obstacles.push({ lane, x: lanes[lane], y: -90, size: 82, kind });
  }

  function spawnCoin() {
    let lane = chooseClearDropLane(-65, 138);
    if (state.route.mechanics.includes("trail")) {
      const preferred = state.patternStep % 4 < 2 ? state.patternStep % 3 : 2 - (state.patternStep % 3);
      const preferredClear = chooseClearDropLane(-65, 138, [preferred]);
      if (preferredClear >= 0) lane = preferredClear;
      state.patternStep += 1;
    }
    if (lane < 0) return;
    state.coins.push({ lane, x: lanes[lane], y: -65, size: 42, used: false });
  }

  function chooseClearDropLane(y, clearance, preferred = [0, 1, 2]) {
    const candidates = preferred.filter((lane) => {
      const drops = [...state.obstacles, ...state.coins.filter((coin) => !coin.used)];
      return drops.every((drop) => drop.lane !== lane || Math.abs(drop.y - y) >= clearance);
    });
    if (!candidates.length) return -1;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function spawnRoutePattern() {
    const sequence = state.route.checkpoint ? [1, 0, 2, 1, 2, 0] : [0, 2, 1, 0, 1, 2];
    const safeLane = sequence[state.patternStep % sequence.length];
    const kind = state.route.mechanics.includes("mud") && state.patternStep % 2 ? "puddle" : state.route.checkpoint ? "cone" : "books";
    [0, 1, 2].filter((lane) => lane !== safeLane).forEach((lane) => {
      state.obstacles.push({ lane, x: lanes[lane], y: -120, size: 82, kind, pattern: true });
    });
    if (state.route.mechanics.includes("trail")) {
      state.coins.push({ lane: safeLane, x: lanes[safeLane], y: -70, size: 42, used: false, pattern: true });
    }
    state.patternStep += 1;
  }

  function checkCollisions() {
    const heroBox = { x: state.x - 40, y: state.y - 54, w: 80, h: 108 };
    for (const obstacle of state.obstacles) {
      if (overlaps(heroBox, { x: obstacle.x - 38, y: obstacle.y - 38, w: 76, h: 76 })) {
        obstacle.y = H + 100;
        state.score = Math.max(0, state.score - 80);
        state.combo = 1;
        state.obstaclesHit += 1;
        if (obstacle.kind === "puddle" && state.route.mechanics.includes("mud")) state.mudSlow = 1.25;
        addSpark(state.x, state.y - 60, "-80", "#ef4444");
        window.WonderSound?.play("wrong");
      }
    }
    for (const coin of state.coins) {
      if (!coin.used && overlaps(heroBox, { x: coin.x - 26, y: coin.y - 26, w: 52, h: 52 })) {
        coin.used = true;
        state.score += 50 * state.combo;
        state.combo = Math.min(9, state.combo + 1);
        state.bestCombo = Math.max(state.bestCombo, state.combo - 1);
        state.coinsCollected += 1;
        addSpark(coin.x, coin.y, `+${50 * (state.combo - 1)}`, "#fbbf24");
        window.WonderSound?.play("success");
      }
    }
  }

  function overlaps(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function addSpark(x, y, text, color) {
    state.sparks.push({ x, y, text, color, life: 0.75 });
  }

  function moveLane(delta) {
    if (!state.running) return;
    const nextLane = Math.max(0, Math.min(2, state.targetLane + delta));
    if (nextLane === state.targetLane) return;
    state.targetLane = nextLane;
    state.laneChanges += 1;
    state.lanePulse = 0.36;
    state.lanePulseLane = nextLane;
    state.lanePulseDir = Math.sign(delta);
    laneStatus.textContent = t("laneMoved", { lane: t(["laneLeft", "laneCenter", "laneRight"][nextLane]) });
    window.WonderSound?.play("click");
  }

  function finishRun() {
    clearPointerInput();
    state.running = false;
    state.finished = true;
    hud.classList.add("hidden");
    const previousBest = getScores()[0] || 0;
    saveScore(state.score);
    const best = getScores()[0] || state.score;
    const cleared = routeSucceeded();
    if (cleared) {
      progress.completed = [...new Set([...progress.completed, state.stage])].sort((a, b) => a - b);
      if (state.stage < 30) progress.unlocked = Math.max(progress.unlocked, state.stage + 1);
      progress.selected = state.stage;
      saveProgress();
    }
    resultTitle.textContent = cleared ? t("routeClear", { stage: state.stage }) : t("routeFailed");
    const routeUpdate = cleared
      ? state.stage >= 30 ? t("allRoutesClear") : t("nextRoute", { stage: state.stage + 1 })
      : objectiveText(state.route);
    resultText.textContent = `${t("resultText", { score: state.score, best })} · ${routeUpdate}`;
    renderSkillReport(previousBest);
    renderLeaderboard();
    nextRouteBtn.classList.toggle("hidden", !cleared || state.stage >= 30 || progress.unlocked < state.stage + 1);
    canvasWrap.inert = true;
    canvasWrap.setAttribute("aria-hidden", "true");
    resultPanel.classList.remove("hidden");
    requestAnimationFrame(() => (nextRouteBtn.classList.contains("hidden") ? againBtn : nextRouteBtn).focus({ preventScroll: true }));
    window.WonderSound?.play("win");
    window.WonderAnalytics?.track("game_complete", {
      game_id: GAME_ID,
      score: state.score,
      stage: state.stage,
      cleared,
      locale: locale(),
    });
  }

  function routeSucceeded() {
    const [type, target] = state.route.objective;
    if (type === "coins") return state.coinsCollected >= target;
    if (type === "combo") return state.bestCombo >= target;
    if (type === "clean") return state.obstaclesHit <= target;
    if (type === "score") return state.score >= target;
    return true;
  }

  function renderSkillReport(previousBest) {
    skillReportTitle.textContent = t("skillReport");
    skillReportIntro.textContent = t("skillIntro");
    reactionLabel.textContent = t("reaction");
    reactionValue.textContent = t("reactionValue", { count: state.laneChanges });
    focusLabel.textContent = t("focus");
    focusValue.textContent = t("focusValue", { coins: state.coinsCollected, bumps: state.obstaclesHit });
    coordinationLabel.textContent = t("coordination");
    coordinationValue.textContent = t("coordinationValue", { combo: state.bestCombo });
    progressComparison.textContent = previousBest > 0
      ? t(state.score > previousBest ? "newBest" : "progress", { score: state.score, previous: previousBest })
      : t("firstRun", { score: state.score });
  }

  function exposeSmokeHooks() {
    if (!new URLSearchParams(window.location.search).has("smoke")) return;
    window.__campusDashSmoke = {
      getState: () => ({
        running: state.running,
        lane: state.targetLane,
        score: state.score,
        time: state.timeLeft,
        stage: state.stage,
        laneChanges: state.laneChanges,
        coinsCollected: state.coinsCollected,
        obstaclesHit: state.obstaclesHit,
        bestCombo: state.bestCombo,
        obstacles: state.obstacles.map(({ lane, x, y, kind }) => ({ lane, x, y, kind })),
        coins: state.coins.map(({ lane, x, y }) => ({ lane, x, y })),
      }),
      routeCatalog: () => ROUTES.map((config) => ({
        id: config.id,
        region: config.region,
        checkpoint: config.checkpoint,
        mechanics: [...config.mechanics],
        objective: [...config.objective],
        duration: config.duration,
        bossEn: config.bossEn,
      })),
      restoreProgress: (snapshot = {}) => {
        progress = {
          unlocked: Math.max(1, Math.min(30, Number(snapshot.unlocked) || 1)),
          selected: Math.max(1, Math.min(Number(snapshot.unlocked) || 1, Number(snapshot.selected) || 1)),
          completed: [...new Set(Array.isArray(snapshot.completed) ? snapshot.completed.map(Number).filter((id) => id >= 1 && id <= 30) : [])],
        };
        saveProgress();
        return { ...progress, completed: [...progress.completed] };
      },
      readProgress: () => ({ ...progress, completed: [...progress.completed] }),
      selectRoute: (id) => {
        progress.selected = Math.max(1, Math.min(progress.unlocked, Number(id) || 1));
        saveProgress();
        state = makeState();
        return { stage: state.stage, mechanics: [...state.route.mechanics], objective: [...state.route.objective] };
      },
      routePattern: (id) => {
        progress.unlocked = 30;
        progress.selected = Math.max(1, Math.min(30, Number(id) || 1));
        state = makeState();
        spawnRoutePattern();
        return {
          stage: state.stage,
          obstacles: state.obstacles.map(({ lane, kind, pattern }) => ({ lane, kind, pattern })),
          coins: state.coins.map(({ lane, pattern }) => ({ lane, pattern })),
        };
      },
      spawnSequence: (count = 24) => {
        state = makeState();
        for (let index = 0; index < count; index += 1) {
          spawnObstacle();
          spawnCoin();
        }
        return {
          obstacles: state.obstacles.map(({ lane, y }) => ({ lane, y })),
          coins: state.coins.map(({ lane, y }) => ({ lane, y })),
        };
      },
      collisionSequence: () => {
        state = makeState();
        state.running = true;
        const collideCoin = () => {
          state.coins = [{ lane: state.targetLane, x: state.x, y: state.y, size: 42, used: false }];
          checkCollisions();
          state.coins = [];
          return { score: state.score, multiplier: state.combo, bestCombo: state.bestCombo, coins: state.coinsCollected, bumps: state.obstaclesHit };
        };
        const firstCoin = collideCoin();
        const secondCoin = collideCoin();
        state.obstacles = [{ lane: state.targetLane, x: state.x, y: state.y, size: 82, kind: "cone" }];
        checkCollisions();
        state.obstacles = [];
        const obstacle = { score: state.score, multiplier: state.combo, bestCombo: state.bestCombo, coins: state.coinsCollected, bumps: state.obstaclesHit };
        const afterResetCoin = collideCoin();
        return { firstCoin, secondCoin, obstacle, afterResetCoin };
      },
      finish: () => {
        state.running = false;
        state.finished = true;
        finishRun();
        const box = resultPanel.getBoundingClientRect();
        return {
          resultVisible: !resultPanel.classList.contains("hidden"),
          resultBox: { left: box.left, top: box.top, width: box.width, height: box.height },
          animationFrames: resultPanel.getAnimations().flatMap((animation) => animation.effect?.getKeyframes?.() || []),
        };
      },
      setReportEvidence: (evidence = {}) => {
        state.score = Number(evidence.score) || 0;
        state.laneChanges = Number(evidence.laneChanges) || 0;
        state.coinsCollected = Number(evidence.coinsCollected) || 0;
        state.obstaclesHit = Number(evidence.obstaclesHit) || 0;
        state.bestCombo = Math.max(0, Number(evidence.bestCombo) || 0);
      },
    };
  }

  function getScores() {
    try {
      return JSON.parse(storageRead(LEADERBOARD_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function saveScore(score) {
    const scores = [...getScores(), score].sort((a, b) => b - a).slice(0, 5);
    storageWrite(LEADERBOARD_KEY, JSON.stringify(scores));
  }

  function renderLeaderboard() {
    const scores = getScores();
    const rows = scores.length
      ? scores.map((score, index) => `<div><span>#${index + 1}</span><strong>${score}</strong></div>`).join("")
      : `<div><span>${t("emptyRank")}</span><strong>0</strong></div>`;
    leaderboard.innerHTML = `<div><span>${t("leaderboard")}</span><strong></strong></div>${rows}`;
  }

  function updateHud() {
    const oldScore = scoreText.textContent;
    const oldCombo = comboText.textContent;
    scoreText.textContent = String(state.score);
    timeText.textContent = String(Math.ceil(state.timeLeft));
    comboText.textContent = `x${state.combo}`;
    if (oldScore !== scoreText.textContent) bump(scoreText);
    if (oldCombo !== comboText.textContent) bump(comboText);
  }

  function bump(node) {
    node.classList.remove("score-pop");
    void node.offsetWidth;
    node.classList.add("score-pop");
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawBackground();
    drawLanes();
    for (const coin of state.coins) if (!coin.used) drawCoin(coin);
    for (const obstacle of state.obstacles) drawObstacle(obstacle);
    drawHero();
    for (const spark of state.sparks) drawSpark(spark);
  }

  function drawBackground() {
    if (sprites.runway.complete && sprites.runway.naturalWidth) {
      ctx.drawImage(sprites.runway, 0, 0, W, H);
      const shade = ctx.createLinearGradient(0, 0, 0, H);
      shade.addColorStop(0, "rgba(8, 48, 92, 0.04)");
      shade.addColorStop(0.56, "rgba(255, 221, 126, 0.02)");
      shade.addColorStop(1, "rgba(73, 35, 8, 0.18)");
      ctx.fillStyle = shade;
      ctx.fillRect(0, 0, W, H);
      return;
    }
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#7dd3fc");
    sky.addColorStop(0.34, "#38bdf8");
    sky.addColorStop(0.66, "#bbf7d0");
    sky.addColorStop(1, "#16a34a");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    const sun = ctx.createRadialGradient(W * 0.78, 96, 16, W * 0.78, 96, 128);
    sun.addColorStop(0, "rgba(254, 249, 195, 0.95)");
    sun.addColorStop(0.48, "rgba(250, 204, 21, 0.36)");
    sun.addColorStop(1, "rgba(250, 204, 21, 0)");
    ctx.fillStyle = sun;
    ctx.fillRect(0, 0, W, 260);

    drawCloud(98, 88, 1.05);
    drawCloud(420, 64, 0.86);
    drawCloud(590, 152, 0.74);

    drawCampusBlock(42, 164, 172, 152, "#f97316", "#fed7aa");
    drawCampusBlock(506, 146, 164, 168, "#2563eb", "#bfdbfe");
    drawCampusBlock(242, 128, 238, 192, "#f8fafc", "#fde68a");

    ctx.fillStyle = "#14532d";
    ctx.fillRect(0, 320, W, 90);

    for (const tree of [
      [38, 286, 0.92],
      [164, 302, 0.74],
      [548, 286, 0.86],
      [662, 310, 0.7],
    ]) {
      drawTree(tree[0], tree[1], tree[2]);
    }

    const glow = ctx.createRadialGradient(W * 0.5, H * 0.74, 30, W * 0.5, H * 0.74, 420);
    glow.addColorStop(0, "rgba(255, 255, 255, 0.2)");
    glow.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
  }

  function drawLanes() {
    const topY = 294;
    const bottomY = H + 18;
    const top = [W * 0.31, W * 0.44, W * 0.56, W * 0.69];
    const bottom = [W * 0.06, W * 0.36, W * 0.64, W * 0.94];
    const laneColors = ["rgba(247, 184, 73, 0.18)", "rgba(255, 228, 133, 0.24)", "rgba(247, 184, 73, 0.18)"];

    for (let lane = 0; lane < 3; lane += 1) {
      const fill = ctx.createLinearGradient(0, topY, 0, H);
      fill.addColorStop(0, laneColors[lane]);
      fill.addColorStop(0.58, lane === state.targetLane ? "rgba(255, 249, 181, 0.45)" : laneColors[lane]);
      fill.addColorStop(1, laneColors[lane]);
      ctx.globalAlpha = lane === state.targetLane ? 0.92 : 0.68;
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.moveTo(top[lane], topY);
      ctx.lineTo(top[lane + 1], topY);
      ctx.lineTo(bottom[lane + 1], bottomY);
      ctx.lineTo(bottom[lane], bottomY);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.strokeStyle = "rgba(255, 247, 213, 0.8)";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.moveTo(top[i], topY);
      ctx.lineTo(bottom[i], bottomY);
      ctx.stroke();
    }

    ctx.setLineDash([26, 34]);
    ctx.lineDashOffset = -((60 - state.timeLeft) * state.speed * 0.16);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.62)";
    ctx.lineWidth = 5;
    for (let lane = 0; lane < 3; lane += 1) {
      ctx.beginPath();
      ctx.moveTo((top[lane] + top[lane + 1]) / 2, topY + 22);
      ctx.lineTo((bottom[lane] + bottom[lane + 1]) / 2, H);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;

    for (let y = 378; y < H; y += 118) {
      const ratio = (y - topY) / (H - topY);
      const left = lerp(top[0], bottom[0], ratio);
      const right = lerp(top[3], bottom[3], ratio);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.26)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
      ctx.stroke();
    }

    drawLanePulse(top, bottom, topY, bottomY);
    drawLaneHint();
  }

  function drawLanePulse(top, bottom, topY, bottomY) {
    if (!state.lanePulse) return;
    const lane = state.lanePulseLane;
    const progress = 1 - state.lanePulse / 0.36;
    const alpha = Math.max(0, state.lanePulse / 0.36);
    const inset = 10 + progress * 18;
    ctx.save();
    ctx.globalAlpha = 0.42 * alpha;
    ctx.fillStyle = "#fef08a";
    ctx.beginPath();
    ctx.moveTo(top[lane] + inset * 0.38, topY + inset);
    ctx.lineTo(top[lane + 1] - inset * 0.38, topY + inset);
    ctx.lineTo(bottom[lane + 1] - inset, bottomY - inset * 2);
    ctx.lineTo(bottom[lane] + inset, bottomY - inset * 2);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 0.72 * alpha;
    ctx.strokeStyle = "#fef9c3";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    const centerX = lanes[lane];
    const arrowY = H - 134 - progress * 24;
    const arrowDir = state.lanePulseDir || 1;
    ctx.beginPath();
    ctx.moveTo(centerX - arrowDir * 46, arrowY);
    ctx.lineTo(centerX + arrowDir * 18, arrowY);
    ctx.lineTo(centerX + arrowDir * 2, arrowY - 16);
    ctx.moveTo(centerX + arrowDir * 18, arrowY);
    ctx.lineTo(centerX + arrowDir * 2, arrowY + 16);
    ctx.stroke();
    ctx.restore();
  }

  function drawHero() {
    ctx.save();
    ctx.translate(state.x, state.y);
    const lean = (state.targetLane - 1) * 0.08;
    ctx.rotate(lean);
    ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
    ctx.beginPath();
    ctx.ellipse(0, 124, 62, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    if (sprites.hero.complete && sprites.hero.naturalWidth) {
      ctx.drawImage(sprites.hero, -108, -134, 216, 216);
    }
    ctx.restore();
  }

  function drawObstacle(item) {
    ctx.save();
    ctx.translate(item.x, item.y);
    const scale = Math.max(0.72, Math.min(1.35, 0.72 + item.y / H * 0.52));
    ctx.scale(scale, scale);
    const image = sprites[item.kind];
    if (image?.complete && image.naturalWidth) {
      ctx.drawImage(image, -70, -70, 140, 140);
    }
    ctx.restore();
  }

  function drawCoin(item) {
    ctx.save();
    ctx.translate(item.x, item.y);
    const scale = Math.max(0.72, Math.min(1.24, 0.72 + item.y / H * 0.48));
    ctx.scale(scale, scale);
    if (sprites.coin.complete && sprites.coin.naturalWidth) {
      ctx.drawImage(sprites.coin, -34, -34, 68, 68);
    }
    ctx.restore();
  }

  function drawSpark(spark) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, spark.life / 0.75);
    ctx.shadowBlur = 16;
    ctx.shadowColor = spark.color;
    ctx.fillStyle = spark.color;
    ctx.font = "900 38px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(spark.text, spark.x, spark.y);
    ctx.restore();
  }

  function drawCampusBlock(x, y, w, h, base, light) {
    const facade = ctx.createLinearGradient(x, y, x + w, y + h);
    facade.addColorStop(0, base);
    facade.addColorStop(1, light);
    ctx.fillStyle = facade;
    roundRect(x, y, w, h, 10);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
    for (let row = y + 24; row < y + h - 18; row += 32) {
      for (let col = x + 18; col < x + w - 16; col += 34) {
        roundRect(col, row, 18, 14, 4);
        ctx.fill();
      }
    }

    ctx.fillStyle = "#475569";
    roundRect(x + w * 0.42, y + h - 34, w * 0.16, 34, 5);
    ctx.fill();

    ctx.strokeStyle = "rgba(15, 23, 42, 0.2)";
    ctx.lineWidth = 3;
    ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);
  }

  function drawCloud(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
    ctx.beginPath();
    ctx.arc(-34, 10, 24, 0, Math.PI * 2);
    ctx.arc(-5, -6, 32, 0, Math.PI * 2);
    ctx.arc(32, 8, 26, 0, Math.PI * 2);
    ctx.arc(58, 14, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawTree(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "#92400e";
    roundRect(-9, 28, 18, 56, 6);
    ctx.fill();
    ctx.fillStyle = "#16a34a";
    ctx.beginPath();
    ctx.arc(-24, 22, 34, 0, Math.PI * 2);
    ctx.arc(8, 0, 38, 0, Math.PI * 2);
    ctx.arc(34, 28, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawLaneHint() {
    const baseY = H - 84;
    const pulse = 0.72 + Math.sin(performance.now() / 180) * 0.18;
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = "rgba(15, 23, 42, 0.62)";
    roundRect(W * 0.16 - 48, baseY - 42, 96, 84, 24);
    ctx.fill();
    roundRect(W * 0.84 - 48, baseY - 42, 96, 84, 24);
    ctx.fill();
    ctx.strokeStyle = `rgba(255, 255, 255, ${pulse})`;
    ctx.lineWidth = 9;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(W * 0.17 + 18, baseY - 22);
    ctx.lineTo(W * 0.13 - 18, baseY);
    ctx.lineTo(W * 0.17 + 18, baseY + 22);
    ctx.moveTo(W * 0.83 - 18, baseY - 22);
    ctx.lineTo(W * 0.87 + 18, baseY);
    ctx.lineTo(W * 0.83 - 18, baseY + 22);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.arc(lanes[i], H - 44, i === state.targetLane ? 11 : 7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function lerp(a, b, amount) {
    return a + (b - a) * amount;
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }

  localeSelect.addEventListener("change", () => {
    window.WonderI18n?.setLocale(localeSelect.value);
    renderStaticText();
    if (state.finished) {
      const cleared = progress.completed.includes(state.stage);
      const routeUpdate = cleared
        ? state.stage >= 30 ? t("allRoutesClear") : t("nextRoute", { stage: Math.min(30, state.stage + 1) })
        : objectiveText(state.route);
      resultTitle.textContent = cleared ? t("routeClear", { stage: state.stage }) : t("routeFailed");
      resultText.textContent = `${t("resultText", { score: state.score, best: getScores()[0] || state.score })} · ${routeUpdate}`;
      renderLeaderboard();
    }
  });
  localeSelect.addEventListener("input", () => {
    window.WonderI18n?.setLocale(localeSelect.value);
    renderStaticText();
  });
  window.addEventListener("wonder:locale-change", renderStaticText);
  window.addEventListener("weightplay:tutorial-start", (event) => {
    if (event.detail?.gameId === GAME_ID && !state.running) startRun();
  });
  startBtn.addEventListener("click", showStageSelection);
  const suppressRepeatedActivation = (event) => {
    if (!event.repeat || !["Enter", " "].includes(event.key) || !event.target.closest("button")) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  };
  startBtn.addEventListener("keydown", suppressRepeatedActivation, true);
  stageRail.addEventListener("keydown", suppressRepeatedActivation, true);
  stageBackBtn.addEventListener("click", showMain);
  battleBackBtn.addEventListener("click", () => {
    if (state.running && resultPanel.classList.contains("hidden")) setLeaveOpen(true);
  });
  keepRunningBtn.addEventListener("click", () => setLeaveOpen(false));
  leaveRouteBtn.addEventListener("click", showStageSelection);
  leavePanel.addEventListener("keydown", (event) => {
    if (event.repeat && ["Enter", " "].includes(event.key)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setLeaveOpen(false);
      return;
    }
    if (event.key !== "Tab") return;
    if (event.shiftKey && document.activeElement === keepRunningBtn) {
      event.preventDefault();
      leaveRouteBtn.focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === leaveRouteBtn) {
      event.preventDefault();
      keepRunningBtn.focus({ preventScroll: true });
    }
  }, true);
  homeLink.addEventListener("click", (event) => {
    if (!document.body.classList.contains("dash-playing")) return;
    event.preventDefault();
    if (state.running && resultPanel.classList.contains("hidden")) setLeaveOpen(true);
  });
  againBtn.addEventListener("click", () => {
    window.WonderAnalytics?.track("game_restart", { game_id: GAME_ID, score: state.score, locale: locale() });
    startRun();
  });
  nextRouteBtn.addEventListener("click", () => {
    const nextStage = state.stage + 1;
    if (nextRouteBtn.classList.contains("hidden") || nextStage > 30 || nextStage > progress.unlocked || !progress.completed.includes(state.stage)) return;
    progress.selected = nextStage;
    saveProgress();
    startRun();
  });
  lobbyLink.addEventListener("click", showStageSelection);
  resultPanel.addEventListener("keydown", (event) => {
    if (event.repeat && ["Enter", " "].includes(event.key)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if (event.key !== "Tab") return;
    const actions = [...resultPanel.querySelectorAll('button:not([disabled]), a[href]')]
      .filter((action) => !action.classList.contains("hidden") && action.getClientRects().length);
    const first = actions[0];
    const last = actions.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, true);
  stageRail.addEventListener("wonder:stage-snap", (event) => {
    const stage = Number(event.detail?.index) + 1;
    if (stage < 1 || stage > 30) return;
    stageRail.querySelectorAll(".stage-card").forEach((card) => card.classList.toggle("is-selected", Number(card.dataset.stage) === stage));
    [...stageDots.children].forEach((dot, index) => dot.classList.toggle("is-selected", index + 1 === stage));
    if (stage <= progress.unlocked) {
      progress.selected = stage;
      saveProgress();
    }
  });
  stageRail.addEventListener("scroll", () => {
    window.clearTimeout(routeScrollTimer);
    routeScrollTimer = window.setTimeout(() => {
      const railBox = stageRail.getBoundingClientRect();
      const center = railBox.left + railBox.width / 2;
      const nearest = [...stageRail.querySelectorAll(".stage-card")].reduce((best, card) => {
        const box = card.getBoundingClientRect();
        const distance = Math.abs(box.left + box.width / 2 - center);
        return !best || distance < best.distance ? { card, distance } : best;
      }, null)?.card;
      if (!nearest) return;
      const stage = Number(nearest.dataset.stage);
      stageRail.querySelectorAll(".stage-card").forEach((card) => card.classList.toggle("is-selected", card === nearest));
      [...stageDots.children].forEach((dot, index) => dot.classList.toggle("is-selected", index + 1 === stage));
      if (stage <= progress.unlocked) {
        progress.selected = stage;
        saveProgress();
      }
    }, 160);
  }, { passive: true });
  canvas.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (!state.running || !["arrowleft", "arrowright", "a", "d"].includes(key)) return;
    event.preventDefault();
    if (event.repeat) return;
    moveLane(key === "arrowleft" || key === "a" ? -1 : 1);
  });
  canvas.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    canvas.focus({ preventScroll: true });
    pointerStartX = event.clientX;
    activePointerId = event.pointerId;
    canvas.setPointerCapture?.(event.pointerId);
  });
  canvas.addEventListener("pointerup", (event) => {
    event.preventDefault();
    if (pointerStartX == null || event.pointerId !== activePointerId) return;
    const dx = event.clientX - pointerStartX;
    if (Math.abs(dx) > 24) moveLane(dx > 0 ? 1 : -1);
    else {
      const rect = canvas.getBoundingClientRect();
      moveLane(event.clientX < rect.left + rect.width / 2 ? -1 : 1);
    }
    clearPointerInput();
  });
  canvas.addEventListener("pointercancel", (event) => {
    if (event.pointerId !== activePointerId) return;
    clearPointerInput();
  });
  canvas.addEventListener("lostpointercapture", (event) => {
    if (event.pointerId === activePointerId) clearPointerInput();
  });
  window.addEventListener("blur", clearPointerInput);
  window.addEventListener("pagehide", () => {
    lifecycleSuspended = true;
    clearPointerInput();
  });
  window.addEventListener("pageshow", () => {
    lifecycleSuspended = document.hidden;
    if (!lifecycleSuspended && state.running) lastTime = performance.now();
  });
  document.addEventListener("visibilitychange", () => {
    lifecycleSuspended = document.hidden;
    if (lifecycleSuspended) clearPointerInput();
    else if (state.running) lastTime = performance.now();
  });

  renderStaticText();
  updateHud();
  exposeSmokeHooks();
  preloadGame();
})();
