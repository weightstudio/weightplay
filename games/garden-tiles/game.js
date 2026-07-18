(() => {
  const GAME_ID = "garden-tiles";
  const UNLOCK_KEY = "gardenTilesUnlocked";
  const STARS_KEY = "gardenTilesStars";
  const titleText = document.querySelector("#titleText");
  const languageLabel = document.querySelector("#languageLabel");
  const localeSelect = document.querySelector("#localeSelect");
  const homeLink = document.querySelector("#homeLink");
  const mainPanel = document.querySelector("#mainPanel");
  const mainTitle = document.querySelector("#mainTitle");
  const mainIntro = document.querySelector("#mainIntro");
  const startBtn = document.querySelector("#startBtn");
  const statusbar = document.querySelector("#statusbar");
  const levelLabel = document.querySelector("#levelLabel");
  const movesLabel = document.querySelector("#movesLabel");
  const pairsLabel = document.querySelector("#pairsLabel");
  const levelText = document.querySelector("#levelText");
  const movesText = document.querySelector("#movesText");
  const pairsText = document.querySelector("#pairsText");
  const levelSelect = document.querySelector("#levelSelect");
  const levelSelectTitle = document.querySelector("#levelSelectTitle");
  const levelBackBtn = document.querySelector("#levelBackBtn");
  const levelMessage = document.querySelector("#levelMessage");
  const levelGrid = document.querySelector("#levelGrid");
  const boardPanel = document.querySelector("#boardPanel");
  const board = document.querySelector("#board");
  const battleBackBtn = document.querySelector("#battleBackBtn");
  const message = document.querySelector("#message");
  const resultPanel = document.querySelector("#resultPanel");
  const resultTitle = document.querySelector("#resultTitle");
  const resultText = document.querySelector("#resultText");
  const stars = document.querySelector("#stars");
  const skillReportTitle = document.querySelector("#skillReportTitle");
  const memoryLabel = document.querySelector("#memoryLabel");
  const memoryValue = document.querySelector("#memoryValue");
  const focusLabel = document.querySelector("#focusLabel");
  const focusValue = document.querySelector("#focusValue");
  const problemLabel = document.querySelector("#problemLabel");
  const problemValue = document.querySelector("#problemValue");
  const progressComparison = document.querySelector("#progressComparison");
  const nextBtn = document.querySelector("#nextBtn");
  const againBtn = document.querySelector("#againBtn");
  const levelsBtn = document.querySelector("#levelsBtn");
  const lobbyLink = document.querySelector("#lobbyLink");
  const loadingPanel = document.querySelector("#loadingPanel");

  statusbar?.prepend(battleBackBtn);

  const dictionary = {
    en: {
      title: "Pet Garden Tiles",
      pageTitle: "Pet Garden Tiles - WeightPlay",
      pageDescription: "Match hidden animal and garden pictures through 30 calm memory challenges with previews, mist, gusts, parades, and six saved checkpoints.",
      language: "Language",
      mainIntro: "Remember the garden pictures and clear 30 calm challenges across six garden chapters.",
      start: "Choose Level",
      level: "Level",
      moves: "Moves",
      pairs: "Pairs",
      pairCount: "{count} pairs",
      starGoal: "3-star: {moves} moves",
      chapter: "Chapter {chapter}: {name}",
      checkpoint: "Garden Checkpoint",
      rules: {
        classic: "Classic Memory",
        preview: "Morning Preview",
        mist: "Garden Mist",
        gust: "Playful Gust",
        parade: "Garden Parade",
      },
      chooseLevel: "Choose Level",
      locked: "Level locked",
      selectFirst: "Pick a tile, then find its matching pair.",
      matched: "Nice match.",
      miss: "Try another pair.",
      clear: "Level Clear",
      result: "{moves} moves. {pairs} pairs matched.",
      skillReport: "Skill Report",
      memory: "Memory",
      memoryValue: "{pairs} pairs found",
      focus: "Focus",
      focusValue: "{moves} moves · Retries: {retries}",
      problem: "Problem Solving",
      problemValue: "{stars} stars earned",
      firstFinish: "First finish: {stars} stars",
      progress: "Today: {stars} stars · Previous best: {previous}",
      newBest: "New best: {stars} stars · Previous best: {previous}",
      next: "Next Level",
      again: "Play Again",
      levels: "Levels",
      lobby: "Lobby",
      allClear: "All levels cleared.",
      homeAria: "Back to lobby",
      languageAria: "Language",
      statusAria: "Game status",
      stageBackAria: "Back",
      battleBackAria: "Back to levels",
      boardAria: "Garden tile board",
      hiddenTile: "Hidden garden card",
      tileNames: {
        cat: "Cat", dog: "Dog", fox: "Fox", owl: "Owl", rabbit: "Rabbit", panda: "Panda", penguin: "Penguin", koala: "Koala",
        lion: "Lion", elephant: "Elephant", giraffe: "Giraffe", whale: "Whale", chick: "Chick", frog: "Frog", apple: "Apple", banana: "Banana",
        berry: "Berry", leaf: "Leaf", seed: "Seed", feather: "Feather", keeper: "Keeper", visitor: "Visitor", ticket: "Ticket booth", basket: "Basket",
      },
    },
    "zh-Hant": {
      title: "\u5bf5\u7269\u82b1\u5712\u65b9\u584a",
      pageTitle: "\u5bf5\u7269\u82b1\u5712\u65b9\u584a - WeightPlay",
      pageDescription: "\u5728 30 \u500b\u7121\u5012\u6578\u7684\u82b1\u5712\u8a18\u61b6\u6311\u6230\u4e2d\uff0c\u7ffb\u627e\u52d5\u7269\u8207\u82b1\u5712\u5716\u6848\uff0c\u61c9\u5c0d\u9810\u89bd\u3001\u8584\u9727\u3001\u5fae\u98a8\u8207\u904a\u884c\u898f\u5247\u3002",
      language: "\u8a9e\u8a00",
      mainIntro: "\u8a18\u4f4f\u82b1\u5712\u5716\u6848\u7684\u4f4d\u7f6e\uff0c\u9010\u6b65\u5b8c\u6210 6 \u500b\u82b1\u5712\u7bc7\u7ae0\u3001\u5171 30 \u500b\u6eab\u548c\u6311\u6230\u3002",
      start: "\u9078\u64c7\u95dc\u5361",
      level: "\u95dc\u5361",
      moves: "\u6b65\u6578",
      pairs: "\u914d\u5c0d",
      pairCount: "{count} \u7d44\u914d\u5c0d",
      starGoal: "\u4e09\u661f\uff1a{moves} \u6b65",
      chapter: "\u7b2c {chapter} \u7ae0\uff1a{name}",
      checkpoint: "\u82b1\u5712\u6aa2\u67e5\u9ede",
      rules: {
        classic: "\u7d93\u5178\u8a18\u61b6",
        preview: "\u6668\u5149\u9810\u89bd",
        mist: "\u82b1\u5712\u8584\u9727",
        gust: "\u8abf\u76ae\u5fae\u98a8",
        parade: "\u82b1\u5712\u904a\u884c",
      },
      chooseLevel: "\u9078\u64c7\u95dc\u5361",
      locked: "\u95dc\u5361\u5c1a\u672a\u89e3\u9396",
      selectFirst: "\u5148\u9078\u4e00\u5f35\u65b9\u584a\uff0c\u518d\u627e\u51fa\u76f8\u540c\u7684\u914d\u5c0d\u3002",
      matched: "\u914d\u5c0d\u6210\u529f\uff01",
      miss: "\u518d\u8a66\u8a66\u53e6\u4e00\u7d44\u3002",
      clear: "\u95dc\u5361\u5b8c\u6210",
      result: "\u7528\u4e86 {moves} \u6b65\uff0c\u5b8c\u6210 {pairs} \u7d44\u914d\u5c0d\u3002",
      skillReport: "\u6280\u80fd\u5831\u544a",
      memory: "\u8a18\u61b6",
      memoryValue: "\u627e\u5230 {pairs} \u7d44\u914d\u5c0d",
      focus: "\u5c08\u6ce8",
      focusValue: "{moves} \u6b65 \u00b7 \u91cd\u8a66 {retries} \u6b21",
      problem: "\u89e3\u984c\u80fd\u529b",
      problemValue: "\u7372\u5f97 {stars} \u9846\u661f",
      firstFinish: "\u7b2c\u4e00\u6b21\u5b8c\u6210\uff1a{stars} \u9846\u661f",
      progress: "\u672c\u6b21\uff1a{stars} \u9846\u661f \u00b7 \u4e4b\u524d\u6700\u4f73\uff1a{previous}",
      newBest: "\u65b0\u7684\u6700\u4f73\uff1a{stars} \u9846\u661f \u00b7 \u4e4b\u524d\u6700\u4f73\uff1a{previous}",
      next: "\u4e0b\u4e00\u95dc",
      again: "\u518d\u73a9\u4e00\u6b21",
      levels: "\u9078\u95dc",
      lobby: "\u5927\u5ef3",
      allClear: "\u5168\u90e8\u95dc\u5361\u5b8c\u6210\u3002",
      homeAria: "\u56de\u5230\u5927\u5ef3",
      languageAria: "\u8a9e\u8a00",
      statusAria: "\u904a\u6232\u72c0\u614b",
      stageBackAria: "\u8fd4\u56de",
      battleBackAria: "\u8fd4\u56de\u9078\u95dc",
      boardAria: "\u82b1\u5712\u65b9\u584a\u914d\u5c0d\u76e4\u9762",
      hiddenTile: "\u84cb\u4f4f\u7684\u82b1\u5712\u5716\u5361",
      tileNames: {
        cat: "\u8c93\u54aa", dog: "\u5c0f\u72d7", fox: "\u72d0\u72f8", owl: "\u8c93\u982d\u9df9", rabbit: "\u5154\u5b50", panda: "\u8c93\u718a", penguin: "\u4f01\u9d5d", koala: "\u7121\u5c3e\u718a",
        lion: "\u7345\u5b50", elephant: "\u5927\u8c61", giraffe: "\u9577\u9818\u9e7f", whale: "\u9be8\u9b5a", chick: "\u5c0f\u96de", frog: "\u9752\u86d9", apple: "\u860b\u679c", banana: "\u9999\u8549",
        berry: "\u8393\u679c", leaf: "\u6a39\u8449", seed: "\u7a2e\u5b50", feather: "\u7fbd\u6bdb", keeper: "\u7ba1\u7406\u54e1", visitor: "\u904a\u5ba2", ticket: "\u552e\u7968\u5c0f\u5c4b", basket: "\u63d0\u7c43",
      },
    },
    es: {
      title: "Fichas del Jardín de Mascotas",
      pageTitle: "Fichas del Jardín de Mascotas - WeightPlay",
      pageDescription: "Encuentra parejas de animales y objetos del jardín en 30 retos tranquilos de memoria con vistas previas, niebla, ráfagas, desfiles y seis puntos de control guardados.",
      language: "Idioma",
      mainIntro: "Recuerda dónde están las imágenes del jardín y completa 30 retos tranquilos repartidos en seis capítulos.",
      start: "Elegir nivel",
      level: "Nivel",
      moves: "Movimientos",
      pairs: "Parejas",
      pairCount: "{count} parejas",
      starGoal: "3 estrellas: {moves} movimientos",
      chapter: "Capítulo {chapter}: {name}",
      checkpoint: "Punto de control del jardín",
      rules: {
        classic: "Memoria clásica",
        preview: "Vista previa matinal",
        mist: "Niebla del jardín",
        gust: "Ráfaga juguetona",
        parade: "Desfile del jardín",
      },
      chooseLevel: "Elegir nivel",
      locked: "Nivel bloqueado",
      selectFirst: "Elige una ficha y encuentra su pareja.",
      matched: "Buena pareja.",
      miss: "Prueba con otra pareja.",
      clear: "Nivel completado",
      result: "{moves} movimientos. {pairs} parejas encontradas.",
      skillReport: "Informe de habilidades",
      memory: "Memoria",
      memoryValue: "{pairs} parejas encontradas",
      focus: "Concentración",
      focusValue: "{moves} movimientos · Reintentos: {retries}",
      problem: "Resolución de problemas",
      problemValue: "{stars} estrellas obtenidas",
      firstFinish: "Primera victoria: {stars} estrellas",
      progress: "Hoy: {stars} estrellas · Mejor anterior: {previous}",
      newBest: "Nuevo récord: {stars} estrellas · Mejor anterior: {previous}",
      next: "Siguiente nivel",
      again: "Jugar de nuevo",
      levels: "Niveles",
      lobby: "Sala de juegos",
      allClear: "Has completado todos los niveles.",
      homeAria: "Volver a la sala de juegos",
      languageAria: "Idioma",
      statusAria: "Estado del juego",
      stageBackAria: "Volver",
      battleBackAria: "Volver a los niveles",
      boardAria: "Tablero de fichas del jardín",
      hiddenTile: "Ficha del jardín oculta",
      tileNames: {
        cat: "Gato", dog: "Perro", fox: "Zorro", owl: "Búho", rabbit: "Conejo", panda: "Panda", penguin: "Pingüino", koala: "Koala",
        lion: "León", elephant: "Elefante", giraffe: "Jirafa", whale: "Ballena", chick: "Pollito", frog: "Rana", apple: "Manzana", banana: "Plátano",
        berry: "Baya", leaf: "Hoja", seed: "Semilla", feather: "Pluma", keeper: "Cuidador", visitor: "Visitante", ticket: "Taquilla", basket: "Cesta",
      },
    },
  };
  const tileArt = [
    { id: "cat", label: "Cat", asset: "../../assets/animal-guard-cat.png" },
    { id: "dog", label: "Dog", asset: "../../assets/animal-guard-dog.png" },
    { id: "fox", label: "Fox", asset: "../../assets/animal-guard-fox.png" },
    { id: "owl", label: "Owl", asset: "../../assets/animal-guard-owl.png" },
    { id: "rabbit", label: "Rabbit", asset: "../../assets/tiny-weather-animal-rabbit.png" },
    { id: "panda", label: "Panda", asset: "../../assets/tiny-weather-animal-panda.png" },
    { id: "penguin", label: "Penguin", asset: "../../assets/tiny-weather-animal-penguin.png" },
    { id: "koala", label: "Koala", asset: "../../assets/tiny-weather-animal-koala.png" },
    { id: "lion", label: "Lion", asset: "../../assets/weightplay-boom-mane-lion.png" },
    { id: "elephant", label: "Elephant", asset: "../../assets/animal-zoo-elephant.png" },
    { id: "giraffe", label: "Giraffe", asset: "../../assets/animal-zoo-idle-giraffe.png" },
    { id: "whale", label: "Whale", asset: "../../assets/bubble-bakery-whale.png" },
    { id: "chick", label: "Chick", asset: "../../assets/bubble-bakery-chick.png" },
    { id: "frog", label: "Frog", asset: "../../assets/bubble-bakery-frog.png" },
    { id: "apple", label: "Apple", asset: "../../assets/animal-vine-fruit-apple.png" },
    { id: "banana", label: "Banana", asset: "../../assets/animal-vine-fruit-banana.png" },
    { id: "berry", label: "Berry", asset: "../../assets/animal-vine-fruit-berry.png" },
    { id: "leaf", label: "Leaf", asset: "../../assets/animal-guard-projectile-leaf.svg" },
    { id: "seed", label: "Seed", asset: "../../assets/animal-guard-projectile-seed.svg" },
    { id: "feather", label: "Feather", asset: "../../assets/animal-guard-projectile-feather.svg" },
    { id: "keeper", label: "Keeper", asset: "../../assets/animal-zoo-keeper.png" },
    { id: "visitor", label: "Visitor", asset: "../../assets/animal-zoo-visitor-child.png" },
    { id: "ticket", label: "Ticket Booth", asset: "../../assets/animal-zoo-idle-ticket-booth.png" },
    { id: "basket", label: "Basket", asset: "../../assets/animal-vine-basket.png" },
  ];
  const chapterNames = {
    en: ["Seedling Walk", "Morning Greenhouse", "Misty Pond", "Breezy Orchard", "Animal Parade", "Moonlit Conservatory"],
    "zh-Hant": ["\u5ae9\u82bd\u5c0f\u5f91", "\u6668\u5149\u6eab\u5ba4", "\u8584\u9727\u6c60\u5858", "\u5fae\u98a8\u679c\u5712", "\u52d5\u7269\u904a\u884c", "\u6708\u5149\u82b1\u623f"],
    es: ["Paseo de los brotes", "Invernadero matinal", "Estanque brumoso", "Huerto con brisa", "Desfile de animales", "Invernadero a la luz de la luna"],
  };
  const levelBlueprints = [
    [4, ["classic"]], [5, ["classic"]], [6, ["classic"]], [7, ["classic"]], [8, ["classic", "preview"]],
    [6, ["preview"]], [7, ["preview"]], [8, ["preview"]], [9, ["preview"]], [10, ["preview", "classic"]],
    [6, ["mist"]], [7, ["mist"]], [8, ["mist"]], [9, ["mist", "preview"]], [10, ["mist", "preview"]],
    [7, ["gust"]], [8, ["gust"]], [9, ["gust"]], [10, ["gust", "preview"]], [11, ["gust", "mist"]],
    [8, ["parade"]], [9, ["parade"]], [10, ["parade"]], [11, ["parade", "preview"]], [12, ["parade", "mist"]],
    [9, ["gust", "parade"]], [10, ["mist", "parade"]], [11, ["preview", "gust", "parade"]], [12, ["mist", "gust", "parade"]], [14, ["preview", "mist", "gust", "parade"]],
  ];
  const levels = levelBlueprints.map(([pairs, rules], index) => ({
    pairs,
    rules,
    chapter: Math.floor(index / 5) + 1,
    checkpoint: (index + 1) % 5 === 0,
    starMoves: [pairs + Math.ceil(pairs * 0.35), pairs + Math.ceil(pairs * 0.8)],
  }));

  let unlocked = readNumber(UNLOCK_KEY, 1);
  let starMap = readJson(STARS_KEY, {});
  let currentLevelIndex = 0;
  let selectedTile = null;
  let tiles = [];
  let moves = 0;
  let matchedPairs = 0;
  let busy = false;
  let resultStarCount = 0;
  let resultPreviousBest = 0;
  let roundGeneration = 0;
  let roundLifecycleSuspended = document.hidden;
  let previewing = false;
  let firstPickTaskToken = 0;
  const roundTasks = new Set();

  function invalidateRoundTasks() {
    roundGeneration += 1;
    roundTasks.clear();
    busy = false;
    previewing = false;
    firstPickTaskToken += 1;
  }

  function scheduleRoundTask(callback, delay) {
    const task = {
      generation: roundGeneration,
      lastFrameAt: null,
      remaining: delay,
    };
    roundTasks.add(task);

    const tick = (now) => {
      if (task.generation !== roundGeneration || !document.body.classList.contains("garden-playing")) {
        roundTasks.delete(task);
        return;
      }
      if (roundLifecycleSuspended || document.hidden) {
        task.lastFrameAt = null;
        requestAnimationFrame(tick);
        return;
      }
      if (task.lastFrameAt !== null) task.remaining -= Math.max(0, now - task.lastFrameAt);
      task.lastFrameAt = now;
      if (task.remaining > 0) {
        requestAnimationFrame(tick);
        return;
      }
      roundTasks.delete(task);
      callback();
    };

    requestAnimationFrame(tick);
  }

  function suspendRoundTasks() {
    roundLifecycleSuspended = true;
    for (const task of roundTasks) task.lastFrameAt = null;
  }

  function resumeRoundTasks() {
    roundLifecycleSuspended = document.hidden;
    for (const task of roundTasks) task.lastFrameAt = null;
  }

  function setBattleCovered(covered) {
    for (const node of [statusbar, boardPanel]) {
      node.inert = covered;
      if (covered) node.setAttribute("aria-hidden", "true");
      else node.removeAttribute("aria-hidden");
    }
  }

  function locale() {
    return window.WonderI18n?.locale?.() || "en";
  }

  function t(key, params = {}) {
    const table = dictionary[locale()] || dictionary.en;
    const fallback = dictionary.en;
    let value = table[key] || fallback[key] || key;
    for (const [name, param] of Object.entries(params)) {
      value = value.replaceAll(`{${name}}`, String(param));
    }
    return value;
  }

  function tileName(art) {
    const names = dictionary[locale()]?.tileNames || dictionary.en.tileNames;
    return names[art.id] || art.label;
  }

  function ruleLabel(rule) {
    return dictionary[locale()]?.rules?.[rule] || dictionary.en.rules[rule] || rule;
  }

  function readNumber(key, fallback) {
    const value = Number(localStorage.getItem(key));
    return Number.isFinite(value) && value > 0 ? value : fallback;
  }

  function readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  }

  function saveProgress() {
    localStorage.setItem(UNLOCK_KEY, String(unlocked));
    localStorage.setItem(STARS_KEY, JSON.stringify(starMap));
  }

  function applyText() {
    document.documentElement.lang = locale();
    document.title = t("pageTitle");
    document.querySelector('meta[name="description"]')?.setAttribute("content", t("pageDescription"));
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", t("pageTitle"));
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", t("pageDescription"));
    titleText.textContent = t("title");
    mainTitle.textContent = t("title");
    mainIntro.textContent = t("mainIntro");
    startBtn.textContent = t("start");
    languageLabel.textContent = t("language");
    levelLabel.textContent = t("level");
    movesLabel.textContent = t("moves");
    pairsLabel.textContent = t("pairs");
    levelSelectTitle.textContent = t("chooseLevel");
    nextBtn.textContent = t("next");
    againBtn.textContent = t("again");
    levelsBtn.textContent = t("levels");
    lobbyLink.textContent = t("lobby");
    homeLink.setAttribute("aria-label", t("homeAria"));
    localeSelect.setAttribute("aria-label", t("languageAria"));
    statusbar.setAttribute("aria-label", t("statusAria"));
    levelBackBtn.setAttribute("aria-label", t("stageBackAria"));
    battleBackBtn.setAttribute("aria-label", t("battleBackAria"));
    board.setAttribute("aria-label", t("boardAria"));
    renderLevelGrid();
    if (tiles.length) renderBoard();
    updateHud();
    if (!resultPanel.classList.contains("hidden") && resultStarCount > 0) renderResult(resultStarCount, resultPreviousBest);
  }

  function showMain() {
    invalidateRoundTasks();
    document.body.classList.remove("garden-stage", "garden-playing");
    document.body.classList.add("garden-main");
    resultPanel.classList.add("hidden");
    setBattleCovered(false);
    mainPanel.classList.remove("hidden");
    statusbar.classList.add("hidden");
    levelSelect.classList.add("hidden");
    boardPanel.classList.add("hidden");
    const shell = document.querySelector(".garden-game");
    for (const property of ["position", "inset", "left", "top", "width", "height", "min-height", "max-height", "transform", "transform-origin"]) shell?.style.removeProperty(property);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  function updateGardenFrame() {
    if (!document.body.classList.contains("garden-playing") && !document.body.classList.contains("garden-stage")) return;
    const viewport = window.visualViewport;
    const viewportWidth = viewport?.width || innerWidth;
    const viewportHeight = viewport?.height || innerHeight;
    const shell = document.querySelector(".garden-game");
    shell?.classList.remove("weightplay-active-viewport");
    const logicalWidth = 390;
    const logicalHeight = 788;
    const scale = Math.max(0.1, Math.min((viewportWidth - 8) / logicalWidth, (viewportHeight - 8) / logicalHeight));
    const width = logicalWidth * scale;
    const contentHeight = logicalHeight * scale;
    const root = document.documentElement.style;
    root.setProperty("--garden-frame-scale", String(scale));
    root.setProperty("--garden-frame-width", `${width}px`);
    root.setProperty("--garden-frame-height", `${contentHeight}px`);
    root.setProperty("--garden-frame-left", `${Math.max(0, (viewportWidth - width) / 2)}px`);
    root.setProperty("--garden-frame-top", `${Math.max(0, viewportHeight - contentHeight - 4)}px`);
    shell?.style.setProperty("position", "fixed", "important");
    shell?.style.setProperty("inset", "auto", "important");
    shell?.style.setProperty("left", "var(--garden-frame-left)", "important");
    shell?.style.setProperty("top", "var(--garden-frame-top)", "important");
    shell?.style.setProperty("width", "390px", "important");
    shell?.style.setProperty("height", "788px", "important");
    shell?.style.setProperty("min-height", "788px", "important");
    shell?.style.setProperty("max-height", "none", "important");
    shell?.style.setProperty("transform", "scale(var(--garden-frame-scale))", "important");
    shell?.style.setProperty("transform-origin", "top left", "important");
  }

  addEventListener("resize", updateGardenFrame, { passive: true });
  addEventListener("orientationchange", updateGardenFrame, { passive: true });
  visualViewport?.addEventListener("resize", updateGardenFrame, { passive: true });
  visualViewport?.addEventListener("scroll", updateGardenFrame, { passive: true });

  function renderLevelGrid() {
    levelGrid.innerHTML = "";
    levels.forEach((level, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.level = String(index);
      const stars = starMap[index + 1] || 0;
      const isLocked = index + 1 > unlocked;
      button.innerHTML = `
        <em>${t("chapter", { chapter: level.chapter, name: chapterNames[locale()]?.[level.chapter - 1] || chapterNames.en[level.chapter - 1] })}</em>
        <strong>${index + 1}</strong>
        <span>${t("pairCount", { count: level.pairs })}</span>
        <span class="level-rules">${level.rules.map(ruleLabel).join(" + ")}</span>
        ${level.checkpoint ? `<b>${t("checkpoint")}</b>` : ""}
        <small${isLocked ? ' class="level-lock"' : ""}>${isLocked ? t("locked") : t("starGoal", { moves: level.starMoves[0] })}</small>
      `;
      if (isLocked) button.classList.add("locked");
      if (stars > 0) button.classList.add("completed");
      if (index + 1 === unlocked) button.classList.add("challenge");
      button.setAttribute("aria-disabled", String(isLocked));
      button.setAttribute("aria-label", `${t("level")} ${index + 1}${isLocked ? `, ${t("locked")}` : ""}`);
      levelGrid.append(button);
    });
  }

  function showLevelSelect() {
    invalidateRoundTasks();
    document.body.classList.remove("garden-main", "garden-playing");
    document.body.classList.add("garden-stage");
    resultPanel.classList.add("hidden");
    setBattleCovered(false);
    mainPanel.classList.add("hidden");
    statusbar.classList.add("hidden");
    boardPanel.classList.add("hidden");
    levelSelect.classList.remove("hidden");
    message.textContent = "";
    levelMessage.textContent = "";
    renderLevelGrid();
    updateHud();
    updateGardenFrame();
    if (window.matchMedia("(max-width: 520px)").matches) {
      requestAnimationFrame(() => levelGrid.querySelector("button.challenge")?.scrollIntoView({ block: "nearest", inline: "center", behavior: "auto" }));
    }
    requestAnimationFrame(() => (levelGrid.querySelector("button.challenge") || levelGrid.querySelector("button:not(.locked)"))?.focus({ preventScroll: true }));
  }

  function startLevel(index) {
    if (index + 1 > unlocked) {
      showMessage(t("locked"));
      window.WonderSound?.play?.("wrong");
      return;
    }
    invalidateRoundTasks();
    currentLevelIndex = index;
    const level = levels[index];
    selectedTile = null;
    moves = 0;
    matchedPairs = 0;
    busy = false;
    tiles = makeTiles(level.pairs, index);
    previewing = level.rules.includes("preview");
    const totalCards = level.pairs * 2;
    const columns = chooseBattleColumns(totalCards);
    board.style.setProperty("--cols", columns);
    const rowCount = Math.ceil(totalCards / columns);
    board.style.setProperty("--rows", rowCount);
    board.style.setProperty("--board-aspect", String(columns / rowCount));
    document.body.classList.remove("garden-stage");
    document.body.classList.add("garden-playing");
    window.WeightPlayGame?.exitMobileGameMode?.();
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    if (document.webkitFullscreenElement) document.webkitExitFullscreen?.();
    document.querySelector(".garden-game")?.classList.remove("weightplay-active-viewport");
    statusbar.classList.remove("hidden");
    levelSelect.classList.add("hidden");
    boardPanel.classList.remove("hidden");
    resultPanel.classList.add("hidden");
    setBattleCovered(false);
    renderBoard();
    showMessage(previewing ? ruleLabel("preview") : t("selectFirst"));
    updateHud();
    updateGardenFrame();
    requestAnimationFrame(() => {
      window.WeightPlayGame?.exitMobileGameMode?.();
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
      if (document.webkitFullscreenElement) document.webkitExitFullscreen?.();
      document.querySelector(".garden-game")?.classList.remove("weightplay-active-viewport");
      updateGardenFrame();
      board.querySelector(".tile:not(:disabled)")?.focus({ preventScroll: true });
    });
    if (previewing) {
      busy = true;
      scheduleRoundTask(() => {
        previewing = false;
        busy = false;
        renderBoard();
        showMessage(t("selectFirst"));
        board.querySelector(".tile:not(:disabled)")?.focus({ preventScroll: true });
      }, 1100);
    }
    window.WonderAnalytics?.track?.("game_start", { game_id: GAME_ID, level: index + 1 });
    window.WonderAnalytics?.track?.("level_start", { game_id: GAME_ID, level: index + 1 });
  }

  function chooseBattleColumns(totalCards) {
    const availableWidth = 366;
    const availableHeight = 650;
    let bestColumns = 3;
    let bestTileSize = 0;
    for (let columns = 3; columns <= 6; columns += 1) {
      const rows = Math.ceil(totalCards / columns);
      const tileSize = Math.min(availableWidth / columns, availableHeight / rows);
      if (tileSize > bestTileSize) {
        bestTileSize = tileSize;
        bestColumns = columns;
      }
    }
    return bestColumns;
  }

  function makeTiles(pairCount, levelIndex) {
    const levelIcons = tileArt.slice(0, Math.min(tileArt.length, pairCount + 3));
    const picks = [];
    for (let i = 0; i < pairCount; i += 1) {
      const art = levelIcons[(i + levelIndex) % levelIcons.length];
      picks.push({ art, matched: false, id: `${i}a` }, { art, matched: false, id: `${i}b` });
    }
    return shuffle(picks).map((tile, index) => ({ ...tile, index }));
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function renderBoard(focusIndex = null) {
    board.innerHTML = "";
    for (const tile of tiles) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "tile";
      button.dataset.index = String(tile.index);
      button.dataset.tileId = tile.art.id;
      button.innerHTML = `<img class="tile-image" src="${tile.art.asset}" alt="" draggable="false" />`;
      const selected = selectedTile?.index === tile.index;
      button.setAttribute("aria-label", selected || previewing ? tileName(tile.art) : t("hiddenTile"));
      button.setAttribute("aria-pressed", String(selected));
      if (tile.matched) {
        button.classList.add("matched");
        button.disabled = true;
        button.tabIndex = -1;
        button.setAttribute("aria-hidden", "true");
      }
      if (selected) button.classList.add("selected");
      if (previewing) button.classList.add("preview");
      board.append(button);
    }
    if (focusIndex != null) requestAnimationFrame(() => board.querySelector(`[data-index="${focusIndex}"]:not(:disabled)`)?.focus());
  }

  function selectTile(index) {
    if (busy) return;
    const tile = tiles.find((item) => item.index === index);
    if (!tile || tile.matched) return;
    if (!selectedTile) {
      selectedTile = tile;
      renderBoard(tile.index);
      window.WonderSound?.play?.("click");
      if (levels[currentLevelIndex].rules.includes("mist")) {
        const token = ++firstPickTaskToken;
        scheduleRoundTask(() => {
          if (token !== firstPickTaskToken || selectedTile?.index !== tile.index) return;
          selectedTile = null;
          renderBoard(tile.index);
          showMessage(ruleLabel("mist"));
        }, 1200);
      }
      return;
    }
    if (selectedTile.index === tile.index) {
      selectedTile = null;
      renderBoard(tile.index);
      return;
    }
    moves += 1;
    firstPickTaskToken += 1;
    if (selectedTile.art.id === tile.art.id) {
      selectedTile.matched = true;
      tile.matched = true;
      matchedPairs += 1;
      selectedTile = null;
      showMessage(t("matched"));
      window.WonderSound?.play?.("success");
      renderBoard(tiles.find((item) => !item.matched)?.index ?? null);
      if (levels[currentLevelIndex].rules.includes("parade") && matchedPairs < levels[currentLevelIndex].pairs) {
        rotateUnmatchedTiles();
        renderBoard(tiles.find((item) => !item.matched)?.index ?? null);
      }
      if (matchedPairs === levels[currentLevelIndex].pairs) finishLevel();
    } else {
      const first = selectedTile.index;
      const second = tile.index;
      selectedTile = null;
      busy = true;
      showMessage(t("miss"));
      window.WonderSound?.play?.("wrong");
      renderBoard(second);
      markWrong(first, second);
      scheduleRoundTask(() => {
        if (levels[currentLevelIndex].rules.includes("gust")) shuffleUnmatchedTiles();
        busy = false;
        renderBoard(second);
      }, 360);
    }
    updateHud();
  }

  function reorderUnmatched(nextUnmatched) {
    const positions = tiles.filter((tile) => !tile.matched).map((tile) => tile.index);
    nextUnmatched.forEach((tile, position) => { tile.index = positions[position]; });
    tiles.sort((a, b) => a.index - b.index);
  }

  function shuffleUnmatchedTiles() {
    reorderUnmatched(shuffle(tiles.filter((tile) => !tile.matched)));
  }

  function rotateUnmatchedTiles() {
    const unmatched = tiles.filter((tile) => !tile.matched);
    if (unmatched.length > 1) unmatched.unshift(unmatched.pop());
    reorderUnmatched(unmatched);
  }

  function markWrong(first, second) {
    for (const index of [first, second]) {
      const button = board.querySelector(`[data-index="${index}"]`);
      button?.classList.add("wrong");
      const tile = tiles.find((item) => item.index === index);
      if (button && tile) button.setAttribute("aria-label", tileName(tile.art));
    }
  }

  function finishLevel() {
    const starCount = getStarsForLevel(currentLevelIndex, moves);
    const levelNumber = currentLevelIndex + 1;
    const previousBest = starMap[levelNumber] || 0;
    starMap[levelNumber] = Math.max(starMap[levelNumber] || 0, starCount);
    unlocked = Math.max(unlocked, Math.min(levels.length, levelNumber + 1));
    saveProgress();
    resultStarCount = starCount;
    resultPreviousBest = previousBest;
    renderResult(starCount, previousBest);
    setBattleCovered(true);
    resultPanel.classList.remove("hidden");
    requestAnimationFrame(() => (nextBtn.classList.contains("hidden") ? againBtn : nextBtn).focus({ preventScroll: true }));
    window.WonderAnalytics?.track?.("game_complete", { game_id: GAME_ID, level: levelNumber, moves, stars: starCount, cleared: true });
    window.WonderAnalytics?.track?.("level_clear", { game_id: GAME_ID, level: levelNumber, moves, stars: starCount });
  }

  function renderResult(starCount, previousBest) {
    resultTitle.textContent = t("clear");
    stars.textContent = "\u2605".repeat(starCount) + "\u2606".repeat(3 - starCount);
    resultText.textContent = t("result", { moves, pairs: matchedPairs });
    renderSkillReport(starCount, previousBest);
    nextBtn.classList.toggle("hidden", currentLevelIndex >= levels.length - 1);
  }

  function renderSkillReport(starCount, previousBest) {
    const retries = Math.max(0, moves - matchedPairs);
    skillReportTitle.textContent = t("skillReport");
    memoryLabel.textContent = t("memory");
    memoryValue.textContent = t("memoryValue", { pairs: matchedPairs });
    focusLabel.textContent = t("focus");
    focusValue.textContent = t("focusValue", { moves, retries });
    problemLabel.textContent = t("problem");
    problemValue.textContent = t("problemValue", { stars: starCount });
    progressComparison.textContent = previousBest > 0
      ? t(starCount > previousBest ? "newBest" : "progress", { stars: starCount, previous: previousBest })
      : t("firstFinish", { stars: starCount });
  }

  function getStarsForLevel(index, moveCount) {
    const [three, two] = levels[index].starMoves;
    if (moveCount <= three) return 3;
    if (moveCount <= two) return 2;
    return 1;
  }

  function updateHud() {
    levelText.textContent = `${currentLevelIndex + 1} / ${levels.length}`;
    movesText.textContent = String(moves);
    const total = levels[currentLevelIndex]?.pairs || 0;
    pairsText.textContent = `${matchedPairs} / ${total}`;
  }

  function showMessage(text) {
    message.textContent = text;
    levelMessage.textContent = text;
  }

  board.addEventListener("keydown", (event) => {
    if (!event.repeat || !["Enter", " "].includes(event.key) || !event.target.closest("[data-index]")) return;
    event.preventDefault();
  });

  resultPanel.addEventListener("keydown", (event) => {
    if (!event.repeat || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
  });

  board.addEventListener("click", (event) => {
    const button = event.target.closest("[data-index]");
    if (!button) return;
    selectTile(Number(button.dataset.index));
  });

  levelGrid.addEventListener("click", (event) => {
    const directHit = event.target.closest?.("[data-level]");
    const coordinateHit = [...levelGrid.querySelectorAll("[data-level]")].find((card) => {
      const rect = card.getBoundingClientRect();
      return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    });
    const button = directHit || coordinateHit;
    if (!button) return;
    button.focus({ preventScroll: true });
    startLevel(Number(button.dataset.level));
  });

  nextBtn.addEventListener("click", () => startLevel(Math.min(currentLevelIndex + 1, levels.length - 1)));
  againBtn.addEventListener("click", () => {
    window.WonderAnalytics?.track?.("game_restart", { game_id: GAME_ID, level: currentLevelIndex + 1 });
    startLevel(currentLevelIndex);
  });
  levelsBtn.addEventListener("click", showLevelSelect);
  startBtn.addEventListener("click", showLevelSelect);
  levelBackBtn.addEventListener("click", showMain);
  battleBackBtn.addEventListener("click", showLevelSelect);
  homeLink.addEventListener("click", (event) => {
    if (document.body.classList.contains("garden-main")) return;
    event.preventDefault();
    if (document.body.classList.contains("garden-playing")) showLevelSelect();
    else showMain();
  });
  localeSelect.addEventListener("change", () => {
    window.WonderI18n?.setLocale?.(localeSelect.value);
    applyText();
  });
  window.addEventListener("wonder:locale-change", () => {
    localeSelect.value = locale();
    applyText();
  });
  window.addEventListener("weightplay:tutorial-start", (event) => {
    if (event.detail?.gameId === GAME_ID && document.body.classList.contains("garden-main")) showLevelSelect();
  });
  window.addEventListener("pagehide", suspendRoundTasks);
  window.addEventListener("pageshow", resumeRoundTasks);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) suspendRoundTasks();
    else resumeRoundTasks();
  });

  localeSelect.value = locale();
  applyText();
  showMain();
  loadingPanel.classList.add("hidden");
  window.WonderAnalytics?.track?.("game_ready", { game_id: GAME_ID });
  window.WeightPlayGameReady = true;
})();

window.setTimeout(() => {
  if (window.WeightPlayGameReady) return;
  document.querySelector("#loadingPanel")?.classList.add("hidden");
  window.WeightPlayGameReady = true;
}, 2200);
