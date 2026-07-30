(function () {
  const canonicalLocaleKey = "weightPlayLocale";
  const legacyLocaleKey = "weightplayLocale";
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
  const canonicalSavedLocale = readStorage(canonicalLocaleKey);
  const legacySavedLocale = readStorage(legacyLocaleKey);
  if (!canonicalSavedLocale && ["en", "zh-Hant", "zh-Hans", "es"].includes(legacySavedLocale)) {
    window.WonderI18n?.setLocale?.(legacySavedLocale);
  }

  // DOM Elements
  const localeSelect = document.querySelector("#localeSelect");
  const languageLabel = document.querySelector("#languageLabel");
  const titleText = document.querySelector("#titleText");
  const mainPanel = document.querySelector("#mainPanel");
  const mainTitle = document.querySelector("#mainTitle");
  const mainIntro = document.querySelector("#mainIntro");
  const startBtn = document.querySelector("#startBtn");
  const stageSelectPanel = document.querySelector("#stageSelectPanel");
  const stageSelectTitle = document.querySelector("#stageSelectTitle");
  const stageBackBtn = document.querySelector("#stageBackBtn");
  const battleBackBtn = document.querySelector("#battleBackBtn");
  const stageGrid = document.querySelector("#stageGrid");
  const memoryGame = document.querySelector(".star-memory-game");
  
  const gameHud = document.querySelector("#gameHud");
  const levelIndicator = document.querySelector("#levelIndicator");
  const levelFill = document.querySelector("#levelFill");
  const scoreText = document.querySelector("#scoreText");
  const movesText = document.querySelector("#movesText");
  
  const gameBoardPanel = document.querySelector("#gameBoardPanel");
  const cardGrid = document.querySelector("#cardGrid");
  
  const gameFeedback = document.querySelector("#gameFeedback");
  const feedbackText = document.querySelector("#feedbackText");
  const comboContainer = document.querySelector("#comboContainer");
  const comboText = document.querySelector("#comboText");
  
  const resultPanel = document.querySelector("#resultPanel");
  const resultTitle = document.querySelector("#resultTitle");
  const resultText = document.querySelector("#resultText");
  const starContainer = document.querySelector("#starContainer");
  const memoryReport = document.querySelector("#memoryReport");
  const reportPairsLabel = document.querySelector("#reportPairsLabel");
  const reportPairsValue = document.querySelector("#reportPairsValue");
  const reportMovesLabel = document.querySelector("#reportMovesLabel");
  const reportMovesValue = document.querySelector("#reportMovesValue");
  const reportStreakLabel = document.querySelector("#reportStreakLabel");
  const reportStreakValue = document.querySelector("#reportStreakValue");
  const skillReportTitle = document.querySelector("#skillReportTitle");
  const skillReportIntro = document.querySelector("#skillReportIntro");
  const progressComparison = document.querySelector("#progressComparison");
  
  const nextLevelBtn = document.querySelector("#nextLevelBtn");
  const againBtn = document.querySelector("#againBtn");
  const stageSelectBtn = document.querySelector("#stageSelectBtn");
  
  const loadingPanel = document.querySelector("#loadingPanel");
  const loadingText = document.querySelector("#loadingText");
  const loadingFill = document.querySelector("#loadingFill");
  const leaveConfirmPanel = document.createElement("section");
  leaveConfirmPanel.id = "leaveConfirmPanel";
  leaveConfirmPanel.className = "leave-confirm-panel hidden";
  leaveConfirmPanel.setAttribute("role", "dialog");
  leaveConfirmPanel.setAttribute("aria-modal", "true");
  leaveConfirmPanel.setAttribute("aria-labelledby", "leaveConfirmTitle");
  leaveConfirmPanel.innerHTML = `<div class="leave-confirm-card"><h2 id="leaveConfirmTitle"></h2><p id="leaveConfirmText"></p><div><button id="keepPlayingBtn" type="button"></button><button id="leaveLevelBtn" type="button"></button></div></div>`;
  memoryGame.append(leaveConfirmPanel);
  const leaveConfirmTitle = leaveConfirmPanel.querySelector("#leaveConfirmTitle");
  const leaveConfirmText = leaveConfirmPanel.querySelector("#leaveConfirmText");
  const keepPlayingBtn = leaveConfirmPanel.querySelector("#keepPlayingBtn");
  const leaveLevelBtn = leaveConfirmPanel.querySelector("#leaveLevelBtn");

  // Game Constants
  const GAME_ID = "star-memory";
  const UNLOCK_KEY = "starMemoryUnlockedLevel";
  const STARS_KEY_PREFIX = "starMemoryLevelStars_";
  const SCORE_KEY_PREFIX = "starMemoryLevelScore_";

  // Card image asset library
  const assetLibrary = {
    sun: "../../assets/star-memory-sun.svg",
    moon: "../../assets/star-memory-moon.svg",
    star: "../../assets/star-memory-star.svg",
    rocket: "../../assets/star-memory-rocket.svg",
    ufo: "../../assets/star-memory-ufo.svg",
    planet: "../../assets/star-memory-planet.svg",
    donut: "../../assets/star-memory-donut.svg",
    heart: "../../assets/star-memory-heart.svg",
    panda: "../../assets/star-memory-panda.svg",
    bear: "../../assets/star-memory-bear.svg",
    lion: "../../assets/star-memory-lion.svg",
    cat: "../../assets/star-memory-cat.svg",
    rabbit: "../../assets/star-memory-rabbit.svg",
    fox: "../../assets/star-memory-fox.svg",
    owl: "../../assets/star-memory-owl.svg",
    frog: "../../assets/star-memory-frog.svg",
    whale: "../../assets/star-memory-whale.svg",
    chick: "../../assets/star-memory-chick.svg",
    penguin: "../../assets/star-memory-penguin.svg",
    koala: "../../assets/star-memory-koala.svg",
    cardBack: "../../assets/star-memory-card-back.svg"
  };

  // Local Translations Dictionary
  const dictionary = {
    en: {
      title: "Animal Star Memory",
      seoTitle: "Animal Star Memory - WeightPlay",
      seoDescription: "Clear 30 saved animal memory stages with previews, moon shuffles, ordered pairs, rotating constellations, and six friendly Star Keeper checks.",
      ogTitle: "Animal Star Memory - Memory Matching Game",
      ogDescription: "Clear 30 animal memory stages with preview, shuffle, order, and rotating-board rules across six Star Keeper checks.",
      language: "Language",
      languageAria: "Choose language",
      stageBackAria: "Back to main page",
      battleBackAria: "Back to levels",
      leaveTitle: "Leave this level?",
      leaveText: "Your pairs, moves, score, and streak will be lost.",
      keepPlaying: "Keep Playing",
      leaveLevel: "Leave Level",
      gameStatsAria: "Game stats",
      mainIntro: "Follow 30 starlight trails where previews, shuffles, ordered pairs, and rotating constellations change how each board is remembered.",
      start: "Start Game",
      chooseLevel: "Choose Level",
      level: "Level {current} / {total}",
      score: "Score",
      moves: "Moves",
      movesLimit: "{current} / {limit}",
      movesInfinite: "{current} / No limit",
      locked: "Locked",
      play: "Play",
      victory: "Level Clear!",
      defeat: "Moves Out!",
      allClear: "All Levels Clear!",
      victoryDesc: "You cleared the level in {moves} moves!",
      defeatDesc: "Try again to unlock the next level.",
      allClearDesc: "Fantastic! You cleared all {count} levels!",
      nextLevel: "Next Level",
      again: "Play Again",
      levels: "Levels",
      lobby: "Lobby",
      tipTap: "Tap cards to find matching pairs!",
      tipMatch: "Match found!",
      tipMismatch: "Not a match. Try again!",
      tipCombo: "Combo x{count}!",
      hiddenCard: "Hidden card, row {row}, column {column}",
      revealedCard: "Revealed {animal}, row {row}, column {column}",
      matchedCard: "Matched {animal}, row {row}, column {column}",
      animalPanda: "panda",
      animalBear: "bear",
      animalLion: "lion",
      animalCat: "cat",
      animalRabbit: "rabbit",
      animalFox: "fox",
      animalOwl: "owl",
      animalFrog: "frog",
      animalWhale: "whale",
      animalChick: "chick",
      animalPenguin: "penguin",
      animalKoala: "koala",
      loading: "Loading",
      parkCheck: "Star Keeper Check",
      ruleNormal: "Classic pairs",
      rulePreview: "Opening preview",
      ruleShuffle: "Moon shuffle after a miss",
      ruleOrder: "Match the shown animal next",
      ruleRotate: "Constellation shifts after a match",
      ruleFinal: "Mixed starlight rules",
      previewing: "Watch closely. The cards will hide soon!",
      orderTarget: "Find the {animal} pair next.",
      wrongOrder: "That pair matches, but another animal comes first.",
      highScore: "High Score: {score}",
      skillReport: "Skill Report",
      reportIntroWin: "This round practiced remembering positions, staying focused, and choosing the next pair.",
      reportIntroTry: "Good effort! Every pair you found was useful memory and focus practice.",
      reportPairs: "Memory",
      reportMoves: "Focus",
      reportStreak: "Problem Solving",
      reportPairsValue: "{current} / {total} pairs",
      reportMovesValue: "{moves} moves",
      reportStreakValue: "Best streak x{streak}",
      todayScore: "Today's score: {score}",
      scoreProgress: "Today's score: {score} · Previous best: {previous}",
      newBest: "New best: {score}! Previous best: {previous}"
    },
    "zh-Hant": {
      title: "\u52d5\u7269\u661f\u661f\u7ffb\u724c",
      seoTitle: "\u52d5\u7269\u661f\u661f\u7ffb\u724c - WeightPlay",
      seoDescription: "\u5b8c\u6210 30 \u500b\u52d5\u7269\u8a18\u61b6\u95dc\u5361\uff0c\u6311\u6230\u958b\u5834\u9810\u89bd\u3001\u6708\u5149\u6d17\u724c\u3001\u6307\u5b9a\u9806\u5e8f\u3001\u661f\u5ea7\u79fb\u52d5\u8207\u516d\u5834\u5b88\u8b77\u8005\u6aa2\u67e5\u3002",
      ogTitle: "\u52d5\u7269\u661f\u661f\u7ffb\u724c - \u8a18\u61b6\u914d\u5c0d\u904a\u6232",
      ogDescription: "\u901a\u904e 30 \u500b\u52d5\u7269\u8a18\u61b6\u95dc\u5361\uff0c\u904b\u7528\u9810\u89bd\u3001\u6d17\u724c\u3001\u9806\u5e8f\u8207\u661f\u5ea7\u79fb\u52d5\u898f\u5247\uff0c\u5b8c\u6210\u516d\u5834\u661f\u5149\u5b88\u8b77\u8005\u6aa2\u67e5\u3002",
      language: "\u8a9e\u8a00",
      languageAria: "\u9078\u64c7\u8a9e\u8a00",
      stageBackAria: "\u8fd4\u56de\u9996\u9801",
      battleBackAria: "\u8fd4\u56de\u95dc\u5361",
      leaveTitle: "\u8981\u96e2\u958b\u9019\u4e00\u95dc\u55ce\uff1f",
      leaveText: "\u76ee\u524d\u7684\u914d\u5c0d\u3001\u6b65\u6578\u3001\u5206\u6578\u8207\u9023\u7e8c\u914d\u5c0d\u6703\u6d88\u5931\u3002",
      keepPlaying: "\u7e7c\u7e8c\u914d\u5c0d",
      leaveLevel: "\u96e2\u958b\u9019\u95dc",
      gameStatsAria: "\u904a\u6232\u72c0\u614b",
      start: "\u958b\u59cb\u904a\u6232",
      mainIntro: "\u8ddf\u8457 30 \u689d\u661f\u5149\u8def\u7dda\u524d\u9032\uff0c\u9810\u89bd\u3001\u6d17\u724c\u3001\u9806\u5e8f\u8207\u661f\u5ea7\u79fb\u52d5\u6703\u6539\u8b8a\u6bcf\u4e00\u76e4\u7684\u8a18\u61b6\u65b9\u5f0f\u3002",
      chooseLevel: "\u9078\u64c7\u95dc\u5361",
      level: "\u7b2c {current} / {total} \u95dc",
      score: "\u5206\u6578",
      moves: "\u6b65\u6578",
      movesLimit: "{current} / {limit}",
      movesInfinite: "{current} / \u4e0d\u9650\u6b65\u6578",
      locked: "\u672a\u89e3\u9396",
      play: "\u958b\u59cb",
      victory: "\u95dc\u5361\u5b8c\u6210\uff01",
      defeat: "\u6b65\u6578\u7528\u5b8c\u4e86\uff01",
      allClear: "\u5168\u90e8\u95dc\u5361\u5b8c\u6210\uff01",
      victoryDesc: "\u4f60\u7528 {moves} \u6b65\u5b8c\u6210\u95dc\u5361\uff01",
      defeatDesc: "\u518d\u8a66\u4e00\u6b21\uff0c\u627e\u5230\u66f4\u597d\u7684\u914d\u5c0d\u9806\u5e8f\u3002",
      allClearDesc: "\u592a\u68d2\u4e86\uff01\u4f60\u5b8c\u6210\u5168\u90e8 {count} \u500b\u95dc\u5361\uff01",
      nextLevel: "\u4e0b\u4e00\u95dc",
      again: "\u518d\u73a9\u4e00\u6b21",
      levels: "\u95dc\u5361",
      lobby: "\u5927\u5ef3",
      tipTap: "\u9ede\u958b\u5361\u724c\uff0c\u627e\u51fa\u76f8\u540c\u5716\u6848\uff01",
      tipMatch: "\u914d\u5c0d\u6210\u529f\uff01",
      tipMismatch: "\u9084\u4e0d\u662f\u4e00\u5c0d\uff0c\u518d\u8a18\u4e00\u4e0b\u4f4d\u7f6e\uff01",
      tipCombo: "\u9023\u7e8c\u914d\u5c0d x{count}\uff01",
      hiddenCard: "\u96b1\u85cf\u724c\uff0c\u7b2c {row} \u5217\uff0c\u7b2c {column} \u6b04",
      revealedCard: "\u5df2\u7ffb\u958b{animal}\uff0c\u7b2c {row} \u5217\uff0c\u7b2c {column} \u6b04",
      matchedCard: "\u5df2\u914d\u5c0d{animal}\uff0c\u7b2c {row} \u5217\uff0c\u7b2c {column} \u6b04",
      animalPanda: "\u718a\u8c93",
      animalBear: "\u68d5\u718a",
      animalLion: "\u7345\u5b50",
      animalCat: "\u8c93\u54aa",
      animalRabbit: "\u5154\u5b50",
      animalFox: "\u72d0\u72f8",
      animalOwl: "\u8c93\u982d\u9df9",
      animalFrog: "\u9752\u86d9",
      animalWhale: "\u9be8\u9b5a",
      animalChick: "\u5c0f\u96de",
      animalPenguin: "\u4f01\u9d5d",
      animalKoala: "\u7121\u5c3e\u718a",
      loading: "\u8f09\u5165\u4e2d",
      parkCheck: "\u661f\u5149\u5b88\u8b77\u8005\u6aa2\u67e5",
      ruleNormal: "\u7d93\u5178\u914d\u5c0d",
      rulePreview: "\u958b\u5834\u9810\u89bd",
      ruleShuffle: "\u7b54\u932f\u5f8c\u6708\u5149\u6d17\u724c",
      ruleOrder: "\u4f9d\u63d0\u793a\u9806\u5e8f\u914d\u5c0d",
      ruleRotate: "\u914d\u5c0d\u5f8c\u661f\u5ea7\u79fb\u52d5",
      ruleFinal: "\u6df7\u5408\u661f\u5149\u898f\u5247",
      previewing: "\u4ed4\u7d30\u770b\uff0c\u5361\u724c\u5f88\u5feb\u6703\u84cb\u8d77\u4f86\uff01",
      orderTarget: "\u4e0b\u4e00\u7d44\u8acb\u627e {animal}\uff01",
      wrongOrder: "\u9019\u7d44\u5716\u6848\u76f8\u540c\uff0c\u4f46\u8981\u5148\u627e\u53e6\u4e00\u7a2e\u52d5\u7269\u3002",
      highScore: "\u6700\u9ad8\u5206\uff1a{score}",
      skillReport: "\u6280\u80fd\u5831\u544a",
      reportIntroWin: "\u9019\u4e00\u5c40\u7df4\u7fd2\u4e86\u8a18\u4f4f\u4f4d\u7f6e\u3001\u4fdd\u6301\u5c08\u6ce8\uff0c\u4ee5\u53ca\u9078\u64c7\u4e0b\u4e00\u7d44\u914d\u5c0d\u3002",
      reportIntroTry: "\u5f88\u597d\u7684\u5617\u8a66\uff01\u6bcf\u627e\u5230\u4e00\u7d44\uff0c\u90fd\u662f\u8a18\u61b6\u8207\u5c08\u6ce8\u7df4\u7fd2\u3002",
      reportPairs: "\u8a18\u61b6",
      reportMoves: "\u5c08\u6ce8",
      reportStreak: "\u554f\u984c\u89e3\u6c7a",
      reportPairsValue: "{current} / {total} \u7d44\u914d\u5c0d",
      reportMovesValue: "\u4f7f\u7528 {moves} \u6b65",
      reportStreakValue: "\u6700\u4f73\u9023\u7e8c x{streak}",
      todayScore: "\u672c\u6b21\u5206\u6578\uff1a{score}",
      scoreProgress: "\u672c\u6b21\u5206\u6578\uff1a{score} \u00b7 \u4e0a\u6b21\u6700\u4f73\uff1a{previous}",
      newBest: "\u65b0\u7684\u6700\u4f73\u5206\u6578\uff1a{score}\uff01\u4e0a\u6b21\u6700\u4f73\uff1a{previous}"
    },
    es: {
      title: "Memoria Estelar Animal",
      seoTitle: "Memoria Estelar Animal - WeightPlay",
      seoDescription: "Completa 30 niveles guardados de memoria animal con vistas previas, barajados lunares, parejas ordenadas, constelaciones giratorias y seis pruebas amistosas de guardianes.",
      ogTitle: "Memoria Estelar Animal - Juego de parejas",
      ogDescription: "Completa 30 niveles de memoria animal con reglas de vista previa, barajado, orden y tablero giratorio en seis pruebas estelares.",
      language: "Idioma",
      languageAria: "Elegir idioma",
      stageBackAria: "Volver a la página principal",
      battleBackAria: "Volver a los niveles",
      leaveTitle: "¿Salir de este nivel?",
      leaveText: "Perderás las parejas, los movimientos, la puntuación y la racha.",
      keepPlaying: "Seguir jugando",
      leaveLevel: "Salir del nivel",
      gameStatsAria: "Estadísticas del juego",
      mainIntro: "Sigue 30 rutas de luz estelar donde las vistas previas, los barajados, el orden y las constelaciones móviles cambian la forma de recordar cada tablero.",
      start: "Empezar",
      chooseLevel: "Elegir nivel",
      level: "Nivel {current} / {total}",
      score: "Puntuación",
      moves: "Movimientos",
      movesLimit: "{current} / {limit}",
      movesInfinite: "{current} / Sin límite",
      locked: "Bloqueado",
      play: "Jugar",
      victory: "¡Nivel completado!",
      defeat: "¡Sin movimientos!",
      allClear: "¡Todos los niveles completados!",
      victoryDesc: "¡Completaste el nivel en {moves} movimientos!",
      defeatDesc: "Inténtalo de nuevo para desbloquear el siguiente nivel.",
      allClearDesc: "¡Fantástico! ¡Completaste los {count} niveles!",
      nextLevel: "Siguiente nivel",
      again: "Jugar de nuevo",
      levels: "Niveles",
      lobby: "Sala de juegos",
      tipTap: "¡Toca las cartas para encontrar las parejas!",
      tipMatch: "¡Pareja encontrada!",
      tipMismatch: "No forman pareja. ¡Prueba otra vez!",
      tipCombo: "¡Combo x{count}!",
      hiddenCard: "Carta oculta, fila {row}, columna {column}",
      revealedCard: "{animal} visible, fila {row}, columna {column}",
      matchedCard: "{animal} emparejado, fila {row}, columna {column}",
      animalPanda: "panda", animalBear: "oso", animalLion: "león", animalCat: "gato",
      animalRabbit: "conejo", animalFox: "zorro", animalOwl: "búho", animalFrog: "rana",
      animalWhale: "ballena", animalChick: "pollito", animalPenguin: "pingüino", animalKoala: "koala",
      loading: "Cargando",
      parkCheck: "Prueba del guardián estelar",
      ruleNormal: "Parejas clásicas",
      rulePreview: "Vista previa inicial",
      ruleShuffle: "Barajado lunar tras un fallo",
      ruleOrder: "Encuentra ahora el animal indicado",
      ruleRotate: "La constelación se mueve tras una pareja",
      ruleFinal: "Reglas estelares combinadas",
      previewing: "Observa bien. ¡Las cartas se ocultarán pronto!",
      orderTarget: "Encuentra ahora la pareja de {animal}.",
      wrongOrder: "La pareja es correcta, pero antes va otro animal.",
      highScore: "Récord: {score}",
      skillReport: "Informe de habilidades",
      reportIntroWin: "Esta ronda practicó recordar posiciones, mantener la atención y elegir la siguiente pareja.",
      reportIntroTry: "¡Buen intento! Cada pareja encontrada ejercitó la memoria y la atención.",
      reportPairs: "Memoria",
      reportMoves: "Concentración",
      reportStreak: "Resolución de problemas",
      reportPairsValue: "{current} / {total} parejas",
      reportMovesValue: "{moves} movimientos",
      reportStreakValue: "Mejor racha x{streak}",
      todayScore: "Puntuación de hoy: {score}",
      scoreProgress: "Puntuación de hoy: {score} · Mejor anterior: {previous}",
      newBest: "¡Nuevo récord: {score}! Mejor anterior: {previous}"
    },
    de: {
      title: "Tierisches Sternen-Memo", seoTitle: "Tierisches Sternen-Memo - WeightPlay",
      seoDescription: "Spiele 30 Tier-Memo-Level mit Vorschauen, Mondmischen, Reihenfolgen, drehenden Sternbildern und sechs freundlichen Sternwächter-Prüfungen.",
      ogTitle: "Tierisches Sternen-Memo - Kartenpaare finden", ogDescription: "Finde Tierpaare in 30 Memo-Leveln mit Vorschau-, Misch-, Reihenfolge- und Drehregeln.",
      language: "Sprache", languageAria: "Sprache auswählen", stageBackAria: "Zurück zur Startseite", battleBackAria: "Zurück zur Rundenauswahl",
      leaveTitle: "Diese Runde verlassen?", leaveText: "Gefundene Paare, Züge, Punkte und deine Serie gehen verloren.", keepPlaying: "Weiterspielen", leaveLevel: "Runde verlassen",
      gameStatsAria: "Spielstand", mainIntro: "Folge 30 Sternenlichtpfaden. Vorschauen, Mischen, Reihenfolgen und drehende Sternbilder verändern jedes Memo-Feld.",
      start: "Spiel starten", chooseLevel: "Spielrunde auswählen", level: "Runde {current} / {total}", score: "Punkte", moves: "Züge",
      movesLimit: "{current} / {limit}", movesInfinite: "{current} / Ohne Limit", locked: "Gesperrt", play: "Spielen",
      victory: "Runde geschafft!", defeat: "Keine Züge mehr!", allClear: "Alle Spielrunden geschafft!",
      victoryDesc: "Du hast die Runde mit {moves} Zügen geschafft!", defeatDesc: "Versuche es noch einmal und merke dir die Karten neu.", allClearDesc: "Großartig! Du hast alle {count} Spielrunden geschafft!",
      nextLevel: "Nächste Runde", again: "Noch einmal", levels: "Rundenauswahl", lobby: "Spieleauswahl",
      tipTap: "Decke Karten auf und finde gleiche Tierpaare!", tipMatch: "Paar gefunden!", tipMismatch: "Noch kein Paar. Merke dir die beiden Plätze!", tipCombo: "Serie x{count}!",
      hiddenCard: "Verdeckte Karte, Reihe {row}, Spalte {column}", revealedCard: "{animal} aufgedeckt, Reihe {row}, Spalte {column}", matchedCard: "{animal} gefunden, Reihe {row}, Spalte {column}",
      animalPanda: "Panda", animalBear: "Bär", animalLion: "Löwe", animalCat: "Katze", animalRabbit: "Kaninchen", animalFox: "Fuchs",
      animalOwl: "Eule", animalFrog: "Frosch", animalWhale: "Wal", animalChick: "Küken", animalPenguin: "Pinguin", animalKoala: "Koala",
      loading: "Laden", parkCheck: "Sternwächter-Prüfung", ruleNormal: "Klassische Paare", rulePreview: "Vorschau am Anfang",
      ruleShuffle: "Nach einem Fehlversuch mischt der Mond", ruleOrder: "Finde als Nächstes das gezeigte Tier", ruleRotate: "Nach einem Paar dreht sich das Sternbild", ruleFinal: "Gemischte Sternenregeln",
      previewing: "Schau genau hin. Gleich werden die Karten verdeckt!", orderTarget: "Finde als Nächstes das {animal}-Paar.", wrongOrder: "Dieses Paar stimmt, aber ein anderes Tier ist zuerst dran.",
      highScore: "Bestwert: {score}", skillReport: "Spielbericht",
      reportIntroWin: "Diese Runde übte das Merken von Plätzen, aufmerksames Suchen und die Wahl des nächsten Paars.", reportIntroTry: "Guter Versuch! Jedes gefundene Paar trainierte Gedächtnis und Aufmerksamkeit.",
      reportPairs: "Gedächtnis", reportMoves: "Aufmerksamkeit", reportStreak: "Lösungswege", reportPairsValue: "{current} / {total} Paare", reportMovesValue: "{moves} Züge",
      reportStreakValue: "Beste Serie x{streak}", todayScore: "Heutige Punkte: {score}", scoreProgress: "Heutige Punkte: {score} · Bisheriger Bestwert: {previous}", newBest: "Neuer Bestwert: {score}! Vorher: {previous}"
    }
  };

  // Thirty authored memory routes in six five-stage lessons.
  const symbolSets = {
    p2: ["panda", "cat"],
    p3: ["panda", "cat", "bear"],
    p4: ["panda", "cat", "bear", "lion"],
    p5: ["panda", "cat", "bear", "lion", "rabbit"],
    p6: ["panda", "cat", "bear", "lion", "rabbit", "fox"],
    p8: ["panda", "bear", "lion", "cat", "rabbit", "fox", "owl", "frog"],
    p10: ["panda", "bear", "lion", "cat", "rabbit", "fox", "owl", "frog", "whale", "chick"],
    p12: ["panda", "bear", "lion", "cat", "rabbit", "fox", "owl", "frog", "whale", "chick", "penguin", "koala"],
  };
  const grids = { p2: { r: 2, c: 2 }, p3: { r: 3, c: 2 }, p4: { r: 4, c: 2 }, p5: { r: 5, c: 2 }, p6: { r: 4, c: 3 }, p8: { r: 4, c: 4 }, p10: { r: 5, c: 4 }, p12: { r: 6, c: 4 } };
  function memoryStage(id, en, zh, descEn, descZh, set, limit, rules = {}) {
    const pairCount = symbolSets[set].length;
    return {
      id, title: { en, "zh-Hant": zh }, description: { en: descEn, "zh-Hant": descZh },
      grid: grids[set], symbols: symbolSets[set], limit,
      stars: [pairCount + Math.ceil(pairCount * 0.35), pairCount + Math.ceil(pairCount * 0.8), limit],
      checkpoint: id % 5 === 0,
      checkpointSymbol: ["cat", "bear", "owl", "lion", "penguin", "koala"][Math.floor((id - 1) / 5)],
      ...rules,
    };
  }
  const stages = [
    memoryStage(1, "First Pawprints", "第一道腳印", "Learn two calm pairs with no move limit.", "用兩組配對認識基本翻牌，步數不限。", "p2", Infinity),
    memoryStage(2, "Three Friends", "三位朋友", "Remember three pairs on a wide beginner board.", "在橫向入門牌面記住三組動物。", "p3", 8),
    memoryStage(3, "Riverside Four", "河岸四夥伴", "Four pairs introduce a longer left-to-right scan.", "四組配對練習由左到右觀察。", "p4", 12),
    memoryStage(4, "Forest Footpath", "森林小徑", "Six pairs fill the first taller memory board.", "六組配對第一次填滿較高的牌面。", "p6", 18),
    memoryStage(5, "Cat Keeper Check", "貓咪守護者檢查", "A brief opening preview prepares the first six-pair review.", "先短暫預覽全部卡牌，再完成第一次六組檢查。", "p6", 17, { previewMs: 1800 }),
    memoryStage(6, "Dawn Preview", "晨光預覽", "Watch four pairs before every card turns over.", "先看清四組卡牌，再讓全部卡牌蓋起來。", "p4", 11, { previewMs: 1800 }),
    memoryStage(7, "Short Starlight", "短暫星光", "Five pairs are visible for a shorter opening moment.", "五組卡牌只在開場短暫出現。", "p5", 15, { previewMs: 1400 }),
    memoryStage(8, "Cloud Window", "雲間窗口", "Six previewed pairs test a complete first impression.", "預覽六組卡牌，測試一次完整觀察。", "p6", 18, { previewMs: 1200 }),
    memoryStage(9, "Fading Meadow", "漸暗草原", "Eight pairs appear briefly before the meadow darkens.", "八組卡牌短暫出現後，草原會恢復遮蓋。", "p8", 24, { previewMs: 1100 }),
    memoryStage(10, "Bear Keeper Check", "熊熊守護者檢查", "Remember eight pairs, then the moon shuffles them once.", "記住八組卡牌後，月光會在開場重新洗牌一次。", "p8", 25, { previewMs: 1600, shuffleAfterPreview: true }),
    memoryStage(11, "Moonlit Mix", "月光混牌", "A missed guess shuffles the remaining hidden symbols.", "每次猜錯後，尚未配對的圖案會重新洗牌。", "p6", 22, { mismatchShuffle: true }),
    memoryStage(12, "Moving Burrows", "移動洞穴", "Eight pairs change places after every miss.", "八組卡牌會在每次猜錯後改變位置。", "p8", 29, { mismatchShuffle: true }),
    memoryStage(13, "Firefly Confusion", "螢火蟲迷陣", "Ten hidden pairs make every moon shuffle matter.", "十組隱藏配對讓每次月光洗牌都必須重新判斷。", "p10", 37, { mismatchShuffle: true }),
    memoryStage(14, "Remember, Then Move", "先記住再移動", "An opening preview is followed by shuffles after mistakes.", "開場先預覽，之後猜錯就會洗牌。", "p8", 28, { previewMs: 1300, mismatchShuffle: true }),
    memoryStage(15, "Owl Keeper Check", "貓頭鷹守護者檢查", "Ten previewed pairs face the Owl Keeper's moon shuffles.", "十組預覽卡牌接受貓頭鷹守護者的月光洗牌檢查。", "p10", 36, { previewMs: 1500, mismatchShuffle: true }),
    memoryStage(16, "Panda Comes First", "貓熊先出發", "Match six animal pairs in the order shown.", "依提示順序完成六組動物配對。", "p6", 24, { ordered: true }),
    memoryStage(17, "Forest Roll Call", "森林點名", "Eight pairs must follow the keeper's animal list.", "八組卡牌必須依照守護者的動物名單完成。", "p8", 31, { ordered: true }),
    memoryStage(18, "Ten-Star Parade", "十星遊行", "A ten-animal parade rewards careful ordered recall.", "十種動物依序遊行，需要仔細記住位置。", "p10", 40, { ordered: true }),
    memoryStage(19, "Previewed Parade", "預覽遊行", "Preview eight pairs, then follow their required order.", "先預覽八組卡牌，再依指定順序配對。", "p8", 30, { previewMs: 1500, ordered: true }),
    memoryStage(20, "Lion Keeper Check", "獅子守護者檢查", "Ordered pairs and moon shuffles combine in one review.", "順序配對與答錯洗牌在同一次檢查中結合。", "p10", 44, { ordered: true, mismatchShuffle: true }),
    memoryStage(21, "Turning Sky", "轉動星空", "After each match, the remaining constellation shifts one place.", "每次配對後，其餘星座圖案會移動一格。", "p8", 29, { matchRotate: true }),
    memoryStage(22, "Orbit of Ten", "十星軌道", "Ten pairs keep rotating after successful matches.", "十組圖案會在每次成功配對後持續轉動。", "p10", 38, { matchRotate: true }),
    memoryStage(23, "Wide Constellation", "廣闊星座", "The full twelve-pair sky shifts as it becomes emptier.", "完整十二組星空會隨著配對完成而改變。", "p12", 47, { matchRotate: true }),
    memoryStage(24, "Seen in Motion", "看見移動", "Preview ten pairs before the constellation begins to turn.", "先預覽十組卡牌，再面對持續轉動的星座。", "p10", 38, { previewMs: 1500, matchRotate: true }),
    memoryStage(25, "Penguin Keeper Check", "企鵝守護者檢查", "Twelve pairs rotate after matches and shuffle after misses.", "十二組卡牌答對會轉動、答錯會洗牌。", "p12", 52, { matchRotate: true, mismatchShuffle: true }),
    memoryStage(26, "Ordered Dawn", "晨光順序", "Preview eight pairs, then match the named animals in order.", "預覽八組卡牌後，依提示動物順序完成。", "p8", 32, { previewMs: 1400, ordered: true }),
    memoryStage(27, "Changing Orbit", "變化軌道", "Ten pairs rotate on success and shuffle on mistakes.", "十組卡牌答對轉動、答錯洗牌。", "p10", 44, { matchRotate: true, mismatchShuffle: true }),
    memoryStage(28, "Vanishing Star Map", "消失星圖", "Preview all twelve pairs before moon shuffles begin.", "先預覽全部十二組卡牌，再開始月光洗牌。", "p12", 50, { previewMs: 1300, mismatchShuffle: true }),
    memoryStage(29, "Keeper's Orbit", "守護者軌道", "Ordered twelve-pair recall continues while the sky rotates.", "十二組配對必須依序完成，星空還會持續轉動。", "p12", 54, { ordered: true, matchRotate: true }),
    memoryStage(30, "Koala Grand Star Check", "無尾熊終極星光檢查", "Preview, order, moon shuffles, and constellation shifts meet in the finale.", "預覽、順序、答錯洗牌與星座移動在最終檢查中全部出現。", "p12", 60, { previewMs: 1600, ordered: true, mismatchShuffle: true, matchRotate: true }),
  ];

  const spanishStageCopy = [
    ["Primeras huellas", "Aprende dos parejas tranquilas sin límite de movimientos."],
    ["Tres amigos", "Recuerda tres parejas en un tablero inicial ancho."],
    ["Cuatro junto al río", "Cuatro parejas introducen una observación más larga de izquierda a derecha."],
    ["Sendero del bosque", "Seis parejas llenan el primer tablero alto de memoria."],
    ["Prueba del guardián gato", "Una breve vista previa prepara la primera prueba de seis parejas."],
    ["Vista previa al amanecer", "Observa cuatro parejas antes de que se oculten todas las cartas."],
    ["Luz estelar breve", "Cinco parejas aparecen durante un instante más corto."],
    ["Ventana entre nubes", "Seis parejas visibles ponen a prueba tu primera impresión completa."],
    ["Pradera que se apaga", "Ocho parejas aparecen brevemente antes de que la pradera se oscurezca."],
    ["Prueba del guardián oso", "Recuerda ocho parejas y luego deja que la luna las baraje una vez."],
    ["Mezcla a la luz de la luna", "Cada fallo baraja los símbolos ocultos que quedan."],
    ["Madrigueras móviles", "Ocho parejas cambian de lugar después de cada fallo."],
    ["Confusión de luciérnagas", "Diez parejas ocultas hacen importante cada barajado lunar."],
    ["Recuerda y luego muévete", "Tras una vista previa inicial, los fallos vuelven a barajar las cartas."],
    ["Prueba del guardián búho", "Diez parejas vistas antes afrontan los barajados lunares del búho."],
    ["El panda va primero", "Encuentra seis parejas animales en el orden indicado."],
    ["Lista del bosque", "Ocho parejas deben seguir la lista de animales del guardián."],
    ["Desfile de diez estrellas", "Un desfile de diez animales premia el recuerdo ordenado."],
    ["Desfile en vista previa", "Observa ocho parejas y después sigue el orden requerido."],
    ["Prueba del guardián león", "Las parejas ordenadas y los barajados por fallo se combinan en una prueba."],
    ["Cielo giratorio", "Tras cada pareja, la constelación restante se mueve un lugar."],
    ["Órbita de diez", "Diez parejas siguen girando después de cada acierto."],
    ["Constelación extensa", "El cielo completo de doce parejas se mueve mientras se vacía."],
    ["Vista en movimiento", "Observa diez parejas antes de que la constelación empiece a girar."],
    ["Prueba del guardián pingüino", "Doce parejas giran al acertar y se barajan al fallar."],
    ["Amanecer ordenado", "Observa ocho parejas y encuentra los animales nombrados en orden."],
    ["Órbita cambiante", "Diez parejas giran con los aciertos y se barajan con los fallos."],
    ["Mapa estelar fugaz", "Observa las doce parejas antes de que comiencen los barajados lunares."],
    ["Órbita del guardián", "El recuerdo ordenado de doce parejas continúa mientras gira el cielo."],
    ["Gran prueba estelar del koala", "La vista previa, el orden, los barajados y los movimientos de constelación se unen en la final."],
  ];
  if (spanishStageCopy.length !== stages.length) throw new Error("Spanish memory-stage coverage must match all stages.");
  stages.forEach((stage, index) => {
    [stage.title.es, stage.description.es] = spanishStageCopy[index];
  });

  const germanStageCopy = [
    ["Erste Pfotenspuren", "Lerne zwei ruhige Paare ganz ohne Zuglimit kennen."],
    ["Drei Freunde", "Merke dir drei Paare auf einem breiten Anfängerfeld."],
    ["Vier am Fluss", "Vier Paare üben das längere Suchen von links nach rechts."],
    ["Waldpfad", "Sechs Paare füllen das erste höhere Memo-Feld."],
    ["Katzen-Sternwächter-Prüfung", "Eine kurze Vorschau bereitet die erste Prüfung mit sechs Paaren vor."],
    ["Vorschau im Morgengrauen", "Sieh dir vier Paare an, bevor alle Karten verdeckt werden."],
    ["Kurzes Sternenlicht", "Fünf Paare sind nur für einen kurzen Augenblick sichtbar."],
    ["Wolkenfenster", "Sechs sichtbare Paare prüfen deinen ersten Gesamteindruck."],
    ["Verblassende Wiese", "Acht Paare erscheinen kurz, bevor die Wiese dunkel wird."],
    ["Bären-Sternwächter-Prüfung", "Merke dir acht Paare; danach mischt der Mond sie einmal."],
    ["Mischen im Mondlicht", "Nach einem Fehlversuch werden die übrigen verdeckten Tiere gemischt."],
    ["Wandernde Baue", "Acht Paare wechseln nach jedem Fehlversuch ihre Plätze."],
    ["Glühwürmchen-Wirrwarr", "Zehn verdeckte Paare machen jedes Mondmischen wichtig."],
    ["Erst merken, dann bewegen", "Nach der Vorschau mischen Fehlversuche die Karten neu."],
    ["Eulen-Sternwächter-Prüfung", "Zehn vorher sichtbare Paare treffen auf das Mondmischen der Eule."],
    ["Panda zuerst", "Finde sechs Tierpaare in der angezeigten Reihenfolge."],
    ["Tierliste im Wald", "Acht Paare folgen der Tierliste des Sternwächters."],
    ["Parade der zehn Sterne", "Zehn Tiere belohnen sorgfältiges Merken in Reihenfolge."],
    ["Parade mit Vorschau", "Sieh acht Paare an und folge danach der geforderten Reihenfolge."],
    ["Löwen-Sternwächter-Prüfung", "Reihenfolge und Mondmischen treffen in einer Prüfung zusammen."],
    ["Drehender Himmel", "Nach jedem Paar rückt das übrige Sternbild um einen Platz weiter."],
    ["Zehner-Umlaufbahn", "Zehn Paare drehen sich nach jedem Treffer weiter."],
    ["Weites Sternbild", "Der Himmel mit zwölf Paaren bewegt sich, während er leerer wird."],
    ["In Bewegung gesehen", "Sieh zehn Paare an, bevor das Sternbild sich zu drehen beginnt."],
    ["Pinguin-Sternwächter-Prüfung", "Zwölf Paare drehen sich nach Treffern und mischen sich nach Fehlern."],
    ["Geordneter Morgen", "Sieh acht Paare an und finde die genannten Tiere der Reihe nach."],
    ["Wechselnde Umlaufbahn", "Zehn Paare drehen sich bei Treffern und mischen sich bei Fehlern."],
    ["Verschwindende Sternkarte", "Sieh alle zwölf Paare an, bevor das Mondmischen beginnt."],
    ["Umlaufbahn der Wächter", "Zwölf Paare bleiben in Reihenfolge, während der Himmel sich dreht."],
    ["Koalas große Sternenprüfung", "Vorschau, Reihenfolge, Mondmischen und Sternbild-Drehung treffen im Finale zusammen."],
  ];
  if (germanStageCopy.length !== stages.length) throw new Error("German memory-stage coverage must match all stages.");
  stages.forEach((stage, index) => {
    [stage.title.de, stage.description.de] = germanStageCopy[index];
  });

  // Game State
  const state = {
    stageIndex: 0,
    score: 0,
    moves: 0,
    combo: 0,
    bestCombo: 0,
    unlockedLevel: 1,
    selectedCards: [],
    matchedPairsCount: 0,
    orderIndex: 0,
    isLocked: false,
    ready: false
  };
  let leaveConfirmOpen = false;
  let resultActionCommitted = false;
  let roundGeneration = 0;
  let windowFocused = document.hasFocus();
  let roundLifecycleSuspended = document.hidden || !windowFocused;
  const roundTasks = new Set();

  function scheduleRoundTask(task, delay) {
    const scheduled = {
      generation: roundGeneration,
      lastFrameAt: null,
      remaining: delay
    };
    roundTasks.add(scheduled);
    const tick = (now) => {
      if (scheduled.generation !== roundGeneration || !document.body.classList.contains("memory-playing")) {
        roundTasks.delete(scheduled);
        return;
      }
      if (roundLifecycleSuspended || document.hidden) {
        scheduled.lastFrameAt = null;
        requestAnimationFrame(tick);
        return;
      }
      if (scheduled.lastFrameAt !== null) scheduled.remaining -= Math.max(0, now - scheduled.lastFrameAt);
      scheduled.lastFrameAt = now;
      if (scheduled.remaining <= 0) {
        roundTasks.delete(scheduled);
        task();
      } else {
        requestAnimationFrame(tick);
      }
    };
    return requestAnimationFrame(tick);
  }

  function scheduleCommittedResult(delay) {
    const generation = roundGeneration;
    let remaining = delay;
    let lastStartedAt = document.hidden ? null : performance.now();
    const settle = () => {
      if (generation !== roundGeneration || !document.body.classList.contains("memory-playing")) return;
      const stage = stages[state.stageIndex];
      if (state.matchedPairsCount !== stage.symbols.length) return;
      if (document.hidden) {
        lastStartedAt = null;
        document.addEventListener("visibilitychange", settle, { once: true });
        return;
      }
      const now = performance.now();
      if (lastStartedAt !== null) remaining -= Math.max(0, now - lastStartedAt);
      if (remaining <= 0) {
        finishGame();
        return;
      }
      lastStartedAt = now;
      setTimeout(settle, remaining);
    };
    return setTimeout(settle, remaining);
  }

  function suspendRoundTasks() {
    roundLifecycleSuspended = true;
    roundTasks.forEach((task) => { task.lastFrameAt = null; });
  }

  function resumeRoundTasks() {
    roundLifecycleSuspended = document.hidden || !windowFocused;
    roundTasks.forEach((task) => { task.lastFrameAt = null; });
  }

  function cancelRoundTasks() {
    roundGeneration += 1;
    state.selectedCards = [];
    state.isLocked = false;
  }

  function setBattleCovered(covered) {
    for (const node of [gameHud, gameBoardPanel, gameFeedback]) {
      node.inert = covered;
      if (covered) node.setAttribute("aria-hidden", "true");
      else node.removeAttribute("aria-hidden");
    }
  }

  window.addEventListener("blur", () => {
    windowFocused = false;
    suspendRoundTasks();
  });
  window.addEventListener("focus", () => {
    windowFocused = true;
    resumeRoundTasks();
  });
  window.addEventListener("pagehide", suspendRoundTasks);
  window.addEventListener("pageshow", resumeRoundTasks);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) suspendRoundTasks();
    else resumeRoundTasks();
  });

  // Helper Functions
  function locale() {
    return window.WonderI18n?.locale() || "en";
  }

  function t(key, params = {}) {
    const table = dictionary[locale()] || dictionary.en;
    const fallback = dictionary.en;
    let text = table[key] || fallback[key] || key;
    return Object.entries(params).reduce((str, [name, val]) => {
      return str.replaceAll(`{${name}}`, String(val));
    }, text);
  }

  function stageCopy(stage, field) {
    return stage[field]?.[locale()] || stage[field]?.en || "";
  }

  function stageRuleKey(stage) {
    if ((stage.previewMs || stage.shuffleAfterPreview) && (stage.ordered || stage.mismatchShuffle || stage.matchRotate)) return "ruleFinal";
    if (stage.ordered) return "ruleOrder";
    if (stage.matchRotate) return "ruleRotate";
    if (stage.mismatchShuffle || stage.shuffleAfterPreview) return "ruleShuffle";
    if (stage.previewMs) return "rulePreview";
    return "ruleNormal";
  }

  function animalName(symbol) {
    return t(`animal${symbol[0].toUpperCase()}${symbol.slice(1)}`);
  }

  const germanTutorial = {
    title: "Finde die passenden Tierkarten.",
    close: "Spiel starten",
    closeAria: "Anleitung schließen",
    helpAria: "Spielanleitung",
    steps: [
      ["Karte aufdecken", "Tippe auf eine Karte, um das Tier zu sehen."],
      ["Paar finden", "Merke dir die Plätze und decke zwei gleiche Tiere auf."],
      ["Besondere Runden", "Achte später auf Vorschauen, Mischen und die vorgegebene Reihenfolge."],
    ],
  };

  function localizeOwnedTutorial() {
    if (locale() !== "de") return;
    const setText = (node, value) => {
      if (node && node.textContent !== value) node.textContent = value;
    };
    document.querySelector(".wp-tutorial-button")?.setAttribute("aria-label", germanTutorial.helpAria);
    const backdrop = document.querySelector('.wp-tutorial-backdrop[data-game-id="star-memory"]');
    if (!backdrop) return;
    backdrop.setAttribute("data-runtime-localize", "off");
    const title = backdrop.querySelector(".wp-tutorial-head strong");
    const close = backdrop.querySelector(".wp-tutorial-close");
    const action = backdrop.querySelector(".wp-tutorial-action");
    setText(title, germanTutorial.title);
    close?.setAttribute("aria-label", germanTutorial.closeAria);
    setText(action, germanTutorial.close);
    backdrop.querySelectorAll(".wp-tutorial-step").forEach((step, index) => {
      const copy = germanTutorial.steps[index];
      if (!copy) return;
      const heading = step.querySelector("b");
      const body = step.querySelector("span");
      setText(heading, copy[0]);
      setText(body, copy[1]);
    });
  }

  const tutorialObserver = new MutationObserver((records) => {
    const tutorialChanged = records.some((record) => {
      if (record.target instanceof Element && record.target.matches('.wp-tutorial-backdrop[data-game-id="star-memory"]')) return true;
      return [...record.addedNodes].some((node) => node instanceof Element
        && (node.matches('.wp-tutorial-backdrop[data-game-id="star-memory"]')
          || node.querySelector('.wp-tutorial-backdrop[data-game-id="star-memory"]')));
    });
    if (tutorialChanged) localizeOwnedTutorial();
  });
  tutorialObserver.observe(document.body, { childList: true, subtree: true });

  function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  // Load and save localStorage stats
  function loadProgress() {
    const saved = Number(readStorage(UNLOCK_KEY));
    state.unlockedLevel = Number.isFinite(saved) && saved >= 1 ? Math.min(saved, stages.length) : 1;
  }

  function saveProgress(unlockedLevel) {
    state.unlockedLevel = Math.max(state.unlockedLevel, unlockedLevel);
    writeStorage(UNLOCK_KEY, state.unlockedLevel);
  }

  function getLevelHighScore(levelId) {
    return Number(readStorage(SCORE_KEY_PREFIX + levelId)) || 0;
  }

  function saveLevelHighScore(levelId, score) {
    const currentHigh = getLevelHighScore(levelId);
    if (score > currentHigh) {
      writeStorage(SCORE_KEY_PREFIX + levelId, score);
    }
  }

  function getLevelStars(levelId) {
    return Number(readStorage(STARS_KEY_PREFIX + levelId)) || 0;
  }

  function saveLevelStars(levelId, stars) {
    const currentStars = getLevelStars(levelId);
    if (stars > currentStars) {
      writeStorage(STARS_KEY_PREFIX + levelId, stars);
    }
  }

  // UI Translating
  function translateStaticUI() {
    const gameRoot = document.querySelector(".star-memory-game");
    if (locale() === "de") {
      gameRoot?.setAttribute("data-runtime-localize", "off");
      document.body.setAttribute("data-runtime-localize", "off");
    } else {
      gameRoot?.removeAttribute("data-runtime-localize");
      document.body.removeAttribute("data-runtime-localize");
    }
    document.documentElement.lang = locale();
    localeSelect.value = locale();
    updateSeoText();
    languageLabel.textContent = t("language");
    localeSelect.setAttribute("aria-label", t("languageAria"));
    titleText.textContent = t("title");
    mainTitle.textContent = t("title");
    mainIntro.textContent = t("mainIntro");
    startBtn.textContent = t("start");
    stageSelectTitle.textContent = t("chooseLevel");
    
    // HUD Labels
    document.querySelector("#scoreLabel").textContent = t("score");
    document.querySelector("#movesLabel").textContent = t("moves");
    
    // Button labels
    nextLevelBtn.textContent = t("nextLevel");
    againBtn.textContent = t("again");
    stageSelectBtn.textContent = t("levels");
    document.querySelector("#homeLink").setAttribute("aria-label", t("lobby"));
    stageBackBtn.setAttribute("aria-label", t("stageBackAria"));
    battleBackBtn.setAttribute("aria-label", t("battleBackAria"));
    leaveConfirmTitle.textContent = t("leaveTitle");
    leaveConfirmText.textContent = t("leaveText");
    keepPlayingBtn.textContent = t("keepPlaying");
    leaveLevelBtn.textContent = t("leaveLevel");
    gameHud.setAttribute("aria-label", t("gameStatsAria"));
    
    // HUD Level text
    if (!stageSelectPanel.classList.contains("hidden")) {
      renderStageGrid();
    } else {
      updateHUD();
    }
    cardGrid.querySelectorAll(".card").forEach((card) => {
      updateCardAccessibility(card, card.classList.contains("matched") ? "matched" : card.classList.contains("flipped") ? "revealed" : "hidden");
    });
  }

  function setMeta(selector, attr, value) {
    const node = document.querySelector(selector);
    if (node) {
      node.setAttribute(attr, value);
    }
  }

  function updateSeoText() {
    document.title = t("seoTitle");
    setMeta('meta[name="description"]', "content", t("seoDescription"));
    setMeta('meta[property="og:title"]', "content", t("ogTitle"));
    setMeta('meta[property="og:description"]', "content", t("ogDescription"));
  }

  // Loading Simulation
  function simulateLoading() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        state.ready = true;
        loadProgress();
        loadingPanel.classList.add("hidden");
        window.WonderAnalytics?.track("game_ready", { game_id: GAME_ID });
        showMain();
      }
      loadingText.textContent = `${progress}%`;
      loadingFill.style.width = `${progress}%`;
    }, 40);
  }

  function updateMemoryFrame() {
    if (!document.body.classList.contains("memory-stage") && !document.body.classList.contains("memory-playing")) return;
    const viewport = window.visualViewport;
    const viewportWidth = viewport?.width || window.innerWidth;
    const viewportHeight = viewport?.height || window.innerHeight;
    const availableWidth = Math.max(1, Math.min(viewportWidth, 920));
    const availableHeight = Math.max(1, viewportHeight);
    const shortLandscape = availableWidth / availableHeight >= 1.5 && availableHeight <= 430;
    const minimumLogicalWidth = shortLandscape ? 760 : 390;
    const minimumLogicalHeight = shortLandscape ? 360 : 788;
    const scale = Math.min(availableWidth / minimumLogicalWidth, availableHeight / minimumLogicalHeight);
    const logicalWidth = availableWidth / scale;
    const logicalHeight = availableHeight / scale;
    const frameLeft = (viewport?.offsetLeft || 0) + Math.max(0, (viewportWidth - availableWidth) / 2);
    const frameTop = viewport?.offsetTop || 0;
    document.documentElement.style.setProperty("--memory-frame-scale", String(scale));
    document.documentElement.style.setProperty("--memory-frame-left", `${frameLeft}px`);
    document.documentElement.style.setProperty("--memory-frame-top", `${frameTop}px`);
    document.documentElement.style.setProperty("--memory-frame-width", `${availableWidth}px`);
    document.documentElement.style.setProperty("--memory-frame-height", `${availableHeight}px`);
    document.documentElement.style.setProperty("--memory-logical-width", `${logicalWidth}px`);
    document.documentElement.style.setProperty("--memory-logical-height", `${logicalHeight}px`);
    memoryGame.dataset.wpCommonScale = String(scale);
    memoryGame.dataset.wpLogicalWidth = String(logicalWidth);
    memoryGame.dataset.wpLogicalHeight = String(logicalHeight);
    memoryGame.dataset.wpLogicalBattleCanvas = `${logicalWidth}x${logicalHeight}`;
    requestAnimationFrame(() => fitMemoryBoard());
  }

  function resetMemoryFrame() {
    for (const property of ["position", "inset", "left", "top", "width", "min-width", "max-width", "height", "min-height", "max-height", "margin", "overflow", "transform", "transform-origin"]) {
      memoryGame.style.removeProperty(property);
    }
    delete memoryGame.dataset.wpCommonScale;
    delete memoryGame.dataset.wpLogicalWidth;
    delete memoryGame.dataset.wpLogicalHeight;
    delete memoryGame.dataset.wpLogicalBattleCanvas;
    [
      "--memory-frame-scale",
      "--memory-frame-left",
      "--memory-frame-top",
      "--memory-frame-width",
      "--memory-frame-height",
      "--memory-logical-width",
      "--memory-logical-height",
    ].forEach((property) => document.documentElement.style.removeProperty(property));
  }

  function syncSharedScene(scene) {
    if (scene === "battle") {
      window.dispatchEvent(new Event("weightplay:stage-sync"));
      window.dispatchEvent(new Event("weightplay:battle-sync"));
    } else {
      window.dispatchEvent(new Event("weightplay:battle-sync"));
      window.dispatchEvent(new Event("weightplay:stage-sync"));
    }
    window.dispatchEvent(new Event("weightplay:shell-sync"));
    if (scene === "main") resetMemoryFrame();
  }

  const MEMORY_CARD_LOGICAL_SIZE = 112;
  const MEMORY_BOARD_MAX_SCALE = 2.25;

  function fitMemoryBoard(stage = stages[state.stageIndex]) {
    if (!stage || !document.body.classList.contains("memory-playing") || document.body.classList.contains("memory-result")) return;
    const panelStyle = getComputedStyle(gameBoardPanel);
    const gridStyle = getComputedStyle(cardGrid);
    const gap = Number.parseFloat(gridStyle.gap) || 8;
    const horizontalPadding = (Number.parseFloat(panelStyle.paddingLeft) || 0) + (Number.parseFloat(panelStyle.paddingRight) || 0);
    const verticalPadding = (Number.parseFloat(panelStyle.paddingTop) || 0) + (Number.parseFloat(panelStyle.paddingBottom) || 0);
    const availableWidth = Math.max(1, gameBoardPanel.clientWidth - horizontalPadding - 8);
    const availableHeight = Math.max(1, gameBoardPanel.clientHeight - verticalPadding - 8);
    const boardWidth = stage.grid.c * MEMORY_CARD_LOGICAL_SIZE + (stage.grid.c - 1) * gap;
    const boardHeight = stage.grid.r * MEMORY_CARD_LOGICAL_SIZE + (stage.grid.r - 1) * gap;
    const boardScale = Math.min(MEMORY_BOARD_MAX_SCALE, availableWidth / boardWidth, availableHeight / boardHeight);

    cardGrid.style.setProperty("--memory-grid-rows", stage.grid.r);
    cardGrid.style.setProperty("--memory-board-width", `${boardWidth}px`);
    cardGrid.style.setProperty("--memory-board-height", `${boardHeight}px`);
    cardGrid.style.setProperty("--memory-board-scale", String(boardScale));
    cardGrid.dataset.wpBoardScale = String(boardScale);
  }

  function exitSharedPlayViewport() {
    window.WeightPlayGame?.exitMobileGameMode?.();
    document.body.classList.remove("weightplay-active-viewport");
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    if (document.webkitFullscreenElement) document.webkitExitFullscreen?.();
  }

  window.addEventListener("resize", updateMemoryFrame);
  window.addEventListener("orientationchange", updateMemoryFrame);
  window.visualViewport?.addEventListener("resize", updateMemoryFrame);
  window.visualViewport?.addEventListener("scroll", updateMemoryFrame);

  function showMain() {
    cancelRoundTasks();
    document.body.classList.remove("memory-stage", "memory-playing", "memory-result");
    document.body.classList.add("memory-main");
    resultPanel.classList.add("hidden");
    mainPanel.classList.remove("hidden");
    stageSelectPanel.classList.add("hidden");
    gameHud.classList.add("hidden");
    gameBoardPanel.classList.add("hidden");
    gameFeedback.classList.add("hidden");
    exitSharedPlayViewport();
    resetMemoryFrame();
    syncSharedScene("main");
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => startBtn.focus({ preventScroll: true }));
    });
  }

  // Stage Selection Screen
  function showStageSelect(focusStageIndex = Math.max(0, Math.min(stages.length, state.unlockedLevel) - 1)) {
    cancelRoundTasks();
    document.body.classList.remove("memory-main");
    document.body.classList.remove("memory-playing");
    document.body.classList.remove("memory-result");
    document.body.classList.add("memory-stage");
    resultPanel.classList.add("hidden");
    mainPanel.classList.add("hidden");
    gameHud.classList.add("hidden");
    gameBoardPanel.classList.add("hidden");
    gameFeedback.classList.add("hidden");
    stageSelectPanel.classList.remove("hidden");

    exitSharedPlayViewport();
    syncSharedScene("stage");
    renderStageGrid(focusStageIndex);
    updateMemoryFrame();
    requestAnimationFrame(() => {
      exitSharedPlayViewport();
      updateMemoryFrame();
    });
  }

  function renderStageGrid(focusStageIndex = null) {
    stageGrid.replaceChildren(
      ...stages.map((stage, idx) => {
        const isUnlocked = stage.id <= state.unlockedLevel;
        const button = document.createElement("button");
        button.type = "button";
        button.className = `stage-card ${isUnlocked ? "unlocked" : "locked"}`;
        button.dataset.index = String(idx);
        button.setAttribute("aria-disabled", String(!isUnlocked));
        button.dataset.stageId = String(stage.id);
        button.dataset.checkpoint = String(stage.checkpoint);
        button.dataset.rules = [stage.previewMs && "preview", stage.mismatchShuffle && "shuffle", stage.shuffleAfterPreview && "opening-shuffle", stage.ordered && "order", stage.matchRotate && "rotate"].filter(Boolean).join(",") || "classic";
        
        let starsStr = "";
        if (isUnlocked) {
          const starsEarned = getLevelStars(stage.id);
          starsStr = "⭐".repeat(starsEarned);
        }
        
        const highScoreVal = getLevelHighScore(stage.id);
        const scoreStr = highScoreVal > 0 ? `<br><small>${t("highScore", { score: highScoreVal })}</small>` : "";

        button.innerHTML = `
          ${stage.checkpoint ? `<img class="stage-keeper" src="${assetLibrary[stage.checkpointSymbol]}" alt="" draggable="false" />` : ""}
          <span>${stage.checkpoint ? `${isUnlocked ? "" : `${t("locked")} · `}${t("parkCheck")}` : isUnlocked ? t("play") : t("locked")}</span>
          <strong>${stageCopy(stage, "title")}</strong>
          <small>${stageCopy(stage, "description")}</small>
          <em>${t(stageRuleKey(stage))}</em>
          ${scoreStr}
          ${starsStr ? `<div class="stars-badge">${starsStr}</div>` : ""}
        `;
        
        if (isUnlocked) {
          button.addEventListener("click", () => startStage(idx));
        }
        return button;
      })
    );
    requestAnimationFrame(() => {
      const unlocked = [...stageGrid.querySelectorAll(".stage-card.unlocked")];
      const target = Number.isInteger(focusStageIndex)
        ? stageGrid.querySelector(`.stage-card.unlocked[data-index="${focusStageIndex}"]`) || unlocked.at(-1)
        : unlocked.at(-1);
      stageGrid.querySelectorAll(".stage-card.selected").forEach((card) => card.classList.remove("selected"));
      target?.classList.add("selected");
      target?.scrollIntoView({ block: "nearest", inline: "center", behavior: "auto" });
      if (Number.isInteger(focusStageIndex)) target?.focus({ preventScroll: true });
    });
  }

  function nearestStageCard() {
    const cards = [...stageGrid.querySelectorAll(".stage-card")];
    const center = stageGrid.scrollLeft + stageGrid.clientWidth / 2;
    return cards.reduce((best, card) => {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      return !best || distance < best.distance ? { card, distance } : best;
    }, null)?.card;
  }
  function highlightNearestStage() {
    const nearest = nearestStageCard();
    if (nearest) {
      stageGrid.querySelectorAll(".stage-card.selected").forEach((card) => card.classList.remove("selected"));
      nearest.classList.add("selected");
    }
    return nearest;
  }
  stageGrid.addEventListener("wonder:stage-snap", highlightNearestStage);
  // Start Gameplay Stage
  function startStage(stageIdx) {
    cancelRoundTasks();
    const stage = stages[stageIdx];
    state.stageIndex = stageIdx;
    state.score = 0;
    state.moves = 0;
    state.combo = 0;
    state.bestCombo = 0;
    state.matchedPairsCount = 0;
    state.orderIndex = 0;
    state.selectedCards = [];
    state.isLocked = false;
    document.body.classList.remove("memory-stage");
    document.body.classList.remove("memory-result");
    document.body.classList.add("memory-playing");
    syncSharedScene("battle");

    // Analytics event
    window.WonderAnalytics?.track("game_start", {
      game_id: GAME_ID,
      stage: stage.id,
      locale: locale()
    });

    resultPanel.classList.add("hidden");
    stageSelectPanel.classList.add("hidden");
    gameHud.classList.remove("hidden");
    gameBoardPanel.classList.remove("hidden");
    gameFeedback.classList.remove("hidden");

    exitSharedPlayViewport();
    updateMemoryFrame();
    feedbackText.textContent = t(stageRuleKey(stage));
    comboContainer.classList.add("hidden");
    
    updateHUD();
    generateGameBoard(stage);
    beginStagePreview(stage);
    requestAnimationFrame(updateMemoryFrame);
  }

  function updateHUD() {
    const stage = stages[state.stageIndex];
    levelIndicator.textContent = t("level", { current: stage.id, total: stages.length });
    levelFill.style.width = `${(state.matchedPairsCount / stage.symbols.length) * 100}%`;
    scoreText.textContent = state.score;
    
    if (stage.limit === Infinity) {
      movesText.textContent = t("movesInfinite", { current: state.moves });
    } else {
      movesText.textContent = t("movesLimit", { current: state.moves, limit: stage.limit });
    }
  }

  // Generate Card Board
  function generateGameBoard(stage) {
    // Collect paired symbols
    const pairs = [...stage.symbols, ...stage.symbols];
    const shuffledPairs = shuffle(pairs);
    
    // Setup grid columns CSS variables
    cardGrid.style.setProperty("--grid-cols", stage.grid.c);
    cardGrid.style.setProperty("--memory-grid-rows", stage.grid.r);
    cardGrid.style.gridTemplateColumns = `repeat(${stage.grid.c}, 1fr)`;
    cardGrid.style.gridTemplateRows = `repeat(${stage.grid.r}, 1fr)`;
    
    cardGrid.replaceChildren(
      ...shuffledPairs.map((symbolId, cardIdx) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "card";
        card.dataset.symbol = symbolId;
        card.dataset.index = cardIdx;
        
        card.innerHTML = `
          <div class="card-inner">
            <div class="card-back"><img src="${assetLibrary.cardBack}" alt="" /></div>
            <div class="card-front"><img src="${assetLibrary[symbolId]}" alt="" /></div>
          </div>
        `;
        
        card.addEventListener("keydown", (event) => {
          if (event.repeat && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
          }
        });
        card.addEventListener("click", () => handleCardClick(card));
        updateCardAccessibility(card, "hidden");
        return card;
      })
    );
    requestAnimationFrame(() => fitMemoryBoard(stage));
    requestAnimationFrame(() => cardGrid.querySelector(".card:not(:disabled)")?.focus({ preventScroll: true }));
  }

  function setRoundInstruction(stage) {
    if (stage.ordered && state.orderIndex < stage.symbols.length) {
      feedbackText.textContent = t("orderTarget", { animal: animalName(stage.symbols[state.orderIndex]) });
    } else {
      feedbackText.textContent = t(stageRuleKey(stage));
    }
  }

  function remapHiddenSymbols(mode = "shuffle") {
    const cards = [...cardGrid.querySelectorAll(".card:not(.matched):not(.flipped)")];
    if (cards.length < 2) return;
    const symbols = cards.map((card) => card.dataset.symbol);
    const mapped = mode === "rotate" ? [symbols.at(-1), ...symbols.slice(0, -1)] : shuffle(symbols);
    cards.forEach((card, index) => {
      const symbol = mapped[index];
      card.dataset.symbol = symbol;
      card.querySelector(".card-front img").src = assetLibrary[symbol];
      updateCardAccessibility(card, "hidden");
    });
  }

  function beginStagePreview(stage) {
    if (!stage.previewMs) {
      setRoundInstruction(stage);
      return;
    }
    state.isLocked = true;
    feedbackText.textContent = t("previewing");
    cardGrid.querySelectorAll(".card").forEach((card) => {
      card.classList.add("flipped", "preview-card");
      updateCardAccessibility(card, "revealed");
    });
    scheduleRoundTask(() => {
      cardGrid.querySelectorAll(".card.preview-card").forEach((card) => {
        card.classList.remove("flipped", "preview-card");
        updateCardAccessibility(card, "hidden");
      });
      if (stage.shuffleAfterPreview) remapHiddenSymbols("shuffle");
      state.isLocked = false;
      setRoundInstruction(stage);
      cardGrid.querySelector(".card:not(:disabled)")?.focus({ preventScroll: true });
    }, stage.previewMs);
  }

  function updateCardAccessibility(card, stateName) {
    const stage = stages[state.stageIndex];
    const index = Number(card.dataset.index);
    const animalKey = `animal${card.dataset.symbol[0].toUpperCase()}${card.dataset.symbol.slice(1)}`;
    const values = {
      row: Math.floor(index / stage.grid.c) + 1,
      column: index % stage.grid.c + 1,
      animal: t(animalKey),
    };
    card.setAttribute("aria-pressed", String(stateName !== "hidden"));
    card.setAttribute("aria-label", t(stateName === "matched" ? "matchedCard" : stateName === "revealed" ? "revealedCard" : "hiddenCard", values));
    if (stateName === "matched") {
      card.disabled = true;
      card.setAttribute("aria-hidden", "true");
      card.tabIndex = -1;
    }
  }

  function focusNextPlayable(afterCard) {
    const cards = [...cardGrid.querySelectorAll(".card:not(:disabled)")];
    if (!cards.length) return;
    const afterIndex = Number(afterCard?.dataset.index ?? -1);
    const next = cards.find((card) => Number(card.dataset.index) > afterIndex) || cards[0];
    requestAnimationFrame(() => next.focus({ preventScroll: true }));
  }

  // Card Click Handling
  function handleCardClick(card) {
    if (state.isLocked) return;
    if (card.classList.contains("flipped") || card.classList.contains("matched")) return;
    
    // Flip the card
    card.classList.add("flipped");
    updateCardAccessibility(card, "revealed");
    window.WonderSound?.play("click");
    state.selectedCards.push(card);
    
    if (state.selectedCards.length === 2) {
      verifyMatch();
    }
  }

  // Card Match Verification
  function verifyMatch() {
    state.isLocked = true;
    state.moves += 1;
    
    const [card1, card2] = state.selectedCards;
    const symbol1 = card1.dataset.symbol;
    const symbol2 = card2.dataset.symbol;
    
    const stage = stages[state.stageIndex];
    
    const followsOrder = !stage.ordered || symbol1 === stage.symbols[state.orderIndex];
    if (symbol1 === symbol2 && followsOrder) {
      // It's a match!
      state.matchedPairsCount += 1;
      if (stage.ordered) state.orderIndex += 1;
      state.combo += 1;
      state.bestCombo = Math.max(state.bestCombo, state.combo);
      
      // Calculate scores
      const matchScore = 100 + (state.combo - 1) * 50;
      state.score += matchScore;
      
      card1.classList.add("matched");
      card2.classList.add("matched");
      updateCardAccessibility(card1, "matched");
      updateCardAccessibility(card2, "matched");
      
      // Feedback
      feedbackText.textContent = t("tipMatch");
      if (state.combo > 1) {
        comboText.textContent = `x${state.combo}`;
        comboContainer.classList.remove("hidden");
        // Simple scale animations
        comboContainer.style.animation = "none";
        setTimeout(() => comboContainer.style.animation = "", 10);
      }
      
      window.WonderSound?.play("success");
      
      // Analytics: match pair
      window.WonderAnalytics?.track("level_complete", {
        game_id: GAME_ID,
        stage: stage.id,
        pair_symbol: symbol1,
        combo: state.combo,
        locale: locale()
      });
      
      state.selectedCards = [];
      state.isLocked = false;
      if (stage.matchRotate) remapHiddenSymbols("rotate");
      updateHUD();
      setRoundInstruction(stage);
      focusNextPlayable(card2);
      
      // Check for win
      if (state.matchedPairsCount === stage.symbols.length) {
        scheduleCommittedResult(600);
      }
    } else {
      // Mismatch
      state.combo = 0;
      comboContainer.classList.add("hidden");
      feedbackText.textContent = symbol1 === symbol2 && !followsOrder ? t("wrongOrder") : t("tipMismatch");
      
      window.WonderSound?.play("wrong");
      
      scheduleRoundTask(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        updateCardAccessibility(card1, "hidden");
        updateCardAccessibility(card2, "hidden");
        if (stage.mismatchShuffle) remapHiddenSymbols("shuffle");
        state.selectedCards = [];
        state.isLocked = false;
        setRoundInstruction(stage);
        card2.focus({ preventScroll: true });
      }, 800);
      
      updateHUD();
      
      // Check for lose (out of moves)
      if (state.moves >= stage.limit) {
        scheduleRoundTask(gameOver, 900);
      }
    }
  }

  // Game Victory Handling
  function finishGame() {
    cancelRoundTasks();
    const stage = stages[state.stageIndex];
    const isFinalStage = stage.id === stages.length;
    const previousBest = getLevelHighScore(stage.id);
    
    // Save progress to unlock next level
    saveProgress(stage.id + 1);
    
    // Calculate star ratings
    let starsEarned = 1;
    if (state.moves <= stage.stars[0]) {
      starsEarned = 3;
    } else if (state.moves <= stage.stars[1]) {
      starsEarned = 2;
    }
    
    // Add remaining moves score bonus
    const movesBonus = stage.limit !== Infinity ? Math.max(0, stage.limit - state.moves) * 50 : 0;
    state.score += movesBonus;
    
    // Save High Scores
    saveLevelHighScore(stage.id, state.score);
    saveLevelStars(stage.id, starsEarned);
    
    // Victory UI
    resultTitle.textContent = isFinalStage ? t("allClear") : t("victory");
    resultText.textContent = isFinalStage ? t("allClearDesc", { count: stages.length }) : t("victoryDesc", { moves: state.moves });
    renderSkillReport(stage, true, previousBest);
    memoryReport.classList.remove("hidden");
    
    // Stars indicator
    document.querySelectorAll("#starContainer .star").forEach((star) => {
      const idx = Number(star.dataset.index);
      star.classList.toggle("active", idx <= starsEarned);
    });
    
    // Keep the canonical three-action Result geometry stable. The next-stage
    // action remains visible but unavailable after the final stage.
    nextLevelBtn.disabled = isFinalStage;
    nextLevelBtn.setAttribute("aria-disabled", String(isFinalStage));
    const primaryAction = isFinalStage ? stageSelectBtn : nextLevelBtn;
    [stageSelectBtn, nextLevelBtn, againBtn].forEach((action) => {
      action.classList.toggle("result-primary", action === primaryAction);
      action.classList.toggle("result-secondary", action !== primaryAction);
    });
    document.body.classList.add("memory-result");
    resultActionCommitted = false;
    resultPanel.classList.remove("hidden");
    primaryAction.focus({ preventScroll: true });
    
    window.WonderSound?.play("win");
    
    // Analytics Level Complete
    window.WonderAnalytics?.track("game_complete", {
      game_id: GAME_ID,
      stage: stage.id,
      score: state.score,
      moves: state.moves,
      stars: starsEarned,
      locale: locale()
    });
  }

  // Game Over Handling
  function gameOver() {
    cancelRoundTasks();
    const stage = stages[state.stageIndex];
    resultTitle.textContent = t("defeat");
    resultText.textContent = t("defeatDesc");
    renderSkillReport(stage, false, getLevelHighScore(stage.id));
    memoryReport.classList.remove("hidden");
    
    // Stars indicator (none)
    document.querySelectorAll("#starContainer .star").forEach((star) => {
      star.classList.remove("active");
    });
    
    nextLevelBtn.disabled = true;
    nextLevelBtn.setAttribute("aria-disabled", "true");
    [stageSelectBtn, nextLevelBtn, againBtn].forEach((action) => {
      action.classList.toggle("result-primary", action === againBtn);
      action.classList.toggle("result-secondary", action !== againBtn);
    });
    document.body.classList.add("memory-result");
    resultActionCommitted = false;
    resultPanel.classList.remove("hidden");
    againBtn.focus({ preventScroll: true });
    
    window.WonderSound?.play("wrong");
  }

  function renderSkillReport(stage, completed, previousBest) {
    skillReportTitle.textContent = t("skillReport");
    skillReportIntro.textContent = t(completed ? "reportIntroWin" : "reportIntroTry");
    reportPairsLabel.textContent = t("reportPairs");
    reportPairsValue.textContent = t("reportPairsValue", { current: state.matchedPairsCount, total: stage.symbols.length });
    reportMovesLabel.textContent = t("reportMoves");
    reportMovesValue.textContent = t("reportMovesValue", { moves: state.moves });
    reportStreakLabel.textContent = t("reportStreak");
    reportStreakValue.textContent = t("reportStreakValue", { streak: state.bestCombo });
    progressComparison.textContent = previousBest > 0
      ? t(completed && state.score > previousBest ? "newBest" : "scoreProgress", { score: state.score, previous: previousBest })
      : t("todayScore", { score: state.score });
  }

  // Event Listeners
  const rejectRepeatedActivation = (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };
  function focusMemoryCard() {
    (state.selectedCards[0]?.isConnected ? state.selectedCards[0] : cardGrid.querySelector(".card:not(:disabled)"))?.focus({ preventScroll: true });
  }
  function openLeaveConfirm() {
    if (leaveConfirmOpen || !document.body.classList.contains("memory-playing") || !resultPanel.classList.contains("hidden")) return;
    leaveConfirmOpen = true;
    suspendRoundTasks();
    leaveConfirmPanel.classList.remove("hidden");
    setBattleCovered(true);
    requestAnimationFrame(() => keepPlayingBtn.focus({ preventScroll: true }));
  }
  function closeLeaveConfirm(restoreFocus = true) {
    if (!leaveConfirmOpen) return;
    leaveConfirmOpen = false;
    leaveConfirmPanel.classList.add("hidden");
    setBattleCovered(false);
    resumeRoundTasks();
    if (restoreFocus) requestAnimationFrame(focusMemoryCard);
  }
  function leaveCurrentLevel() {
    closeLeaveConfirm(false);
    showStageSelect(state.stageIndex);
  }
  startBtn.addEventListener("keydown", rejectRepeatedActivation);
  stageGrid.addEventListener("keydown", (event) => {
    if (event.target.closest(".stage-card")) rejectRepeatedActivation(event);
  });
  resultPanel.addEventListener("keydown", rejectRepeatedActivation, true);
  startBtn.addEventListener("click", () => {
    window.WonderSound?.play("click");
    showStageSelect();
  });
  stageBackBtn.addEventListener("click", showMain);
  battleBackBtn.addEventListener("click", openLeaveConfirm);
  keepPlayingBtn.addEventListener("click", () => closeLeaveConfirm(true));
  leaveLevelBtn.addEventListener("click", leaveCurrentLevel);
  leaveConfirmPanel.addEventListener("keydown", (event) => {
    rejectRepeatedActivation(event);
    if (event.key === "Escape") { event.preventDefault(); closeLeaveConfirm(true); return; }
    if (event.key !== "Tab") return;
    if (event.shiftKey && document.activeElement === keepPlayingBtn) { event.preventDefault(); leaveLevelBtn.focus({ preventScroll: true }); }
    else if (!event.shiftKey && document.activeElement === leaveLevelBtn) { event.preventDefault(); keepPlayingBtn.focus({ preventScroll: true }); }
  });

  localeSelect.addEventListener("change", () => {
    window.WonderSound?.play("click");
    window.WonderI18n?.setLocale(localeSelect.value);
  });

  localeSelect.addEventListener("input", () => {
    window.WonderSound?.play("click");
    window.WonderI18n?.setLocale(localeSelect.value);
  });

  window.addEventListener("wonder:locale-change", () => {
    translateStaticUI();
    localizeOwnedTutorial();
  });

  window.addEventListener("weightplay:tutorial-start", (event) => {
    if (event.detail?.gameId !== GAME_ID || !document.body.classList.contains("memory-main")) return;
    showStageSelect();
  });

  function commitResultAction(action) {
    if (resultActionCommitted || resultPanel.classList.contains("hidden")) return;
    resultActionCommitted = true;
    action();
  }

  againBtn.addEventListener("click", () => commitResultAction(() => {
    window.WonderSound?.play("click");
    window.WonderAnalytics?.track("game_restart", {
      game_id: GAME_ID,
      stage: stages[state.stageIndex].id,
      locale: locale()
    });
    startStage(state.stageIndex);
  }));

  nextLevelBtn.addEventListener("click", () => {
    if (nextLevelBtn.disabled) return;
    commitResultAction(() => {
      window.WonderSound?.play("click");
      startStage(Math.min(state.stageIndex + 1, stages.length - 1));
    });
  });

  stageSelectBtn.addEventListener("click", () => commitResultAction(() => {
    window.WonderSound?.play("click");
    showStageSelect();
  }));

  document.querySelector("#homeLink").addEventListener("click", (event) => {
    if (document.body.classList.contains("memory-main")) return;
    event.preventDefault();
    window.WonderSound?.play("click");
    if (document.body.classList.contains("memory-playing")) showStageSelect(state.stageIndex);
    else showMain();
  });

  // Initialization
  translateStaticUI();
  localizeOwnedTutorial();
  simulateLoading();

})();
