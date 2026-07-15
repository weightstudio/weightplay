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
      pageDescription: "Relax with large-print pet garden tile matching. Match animals, flowers, birds, tools, and cozy garden items across gentle levels on WeightPlay.",
      language: "Language",
      mainIntro: "Remember the garden pictures and match every pair across ten levels.",
      start: "Choose Level",
      level: "Level",
      moves: "Moves",
      pairs: "Pairs",
      pairCount: "{count} pairs",
      starGoal: "3-star: {moves} moves",
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
      tileNames: {
        cat: "Cat", dog: "Dog", fox: "Fox", owl: "Owl", rabbit: "Rabbit", panda: "Panda", penguin: "Penguin", koala: "Koala",
        lion: "Lion", elephant: "Elephant", giraffe: "Giraffe", whale: "Whale", chick: "Chick", frog: "Frog", apple: "Apple", banana: "Banana",
        berry: "Berry", leaf: "Leaf", seed: "Seed", feather: "Feather", keeper: "Keeper", visitor: "Visitor", ticket: "Ticket booth", basket: "Basket",
      },
    },
    "zh-Hant": {
      title: "\u5bf5\u7269\u82b1\u5712\u65b9\u584a",
      pageTitle: "\u5bf5\u7269\u82b1\u5712\u65b9\u584a - WeightPlay",
      pageDescription: "\u5728 WeightPlay \u7528\u5927\u5b57\u9ad4\u8f15\u9b06\u914d\u5c0d\u5bf5\u7269\u82b1\u5712\u65b9\u584a\uff0c\u5728\u6eab\u548c\u7684\u95dc\u5361\u4e2d\u627e\u51fa\u52d5\u7269\u3001\u82b1\u6735\u3001\u9ce5\u985e\u3001\u5de5\u5177\u8207\u82b1\u5712\u7269\u4ef6\u7684\u914d\u5c0d\u3002",
      language: "\u8a9e\u8a00",
      mainIntro: "\u8a18\u4f4f\u82b1\u5712\u5716\u6848\u7684\u4f4d\u7f6e\uff0c\u5728 10 \u500b\u95dc\u5361\u4e2d\u627e\u51fa\u6240\u6709\u76f8\u540c\u914d\u5c0d\u3002",
      start: "\u9078\u64c7\u95dc\u5361",
      level: "\u95dc\u5361",
      moves: "\u6b65\u6578",
      pairs: "\u914d\u5c0d",
      pairCount: "{count} \u7d44\u914d\u5c0d",
      starGoal: "\u4e09\u661f\uff1a{moves} \u6b65",
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
      tileNames: {
        cat: "\u8c93\u54aa", dog: "\u5c0f\u72d7", fox: "\u72d0\u72f8", owl: "\u8c93\u982d\u9df9", rabbit: "\u5154\u5b50", panda: "\u8c93\u718a", penguin: "\u4f01\u9d5d", koala: "\u7121\u5c3e\u718a",
        lion: "\u7345\u5b50", elephant: "\u5927\u8c61", giraffe: "\u9577\u9818\u9e7f", whale: "\u9be8\u9b5a", chick: "\u5c0f\u96de", frog: "\u9752\u86d9", apple: "\u860b\u679c", banana: "\u9999\u8549",
        berry: "\u8393\u679c", leaf: "\u6a39\u8449", seed: "\u7a2e\u5b50", feather: "\u7fbd\u6bdb", keeper: "\u7ba1\u7406\u54e1", visitor: "\u904a\u5ba2", ticket: "\u552e\u7968\u5c0f\u5c4b", basket: "\u63d0\u7c43",
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
  const levels = [
    { pairs: 6, cols: 4, starMoves: [12, 15] },
    { pairs: 8, cols: 4, starMoves: [16, 20] },
    { pairs: 10, cols: 5, starMoves: [20, 25] },
    { pairs: 12, cols: 4, starMoves: [24, 30] },
    { pairs: 14, cols: 4, starMoves: [28, 35] },
    { pairs: 15, cols: 5, starMoves: [30, 38] },
    { pairs: 16, cols: 4, starMoves: [32, 41] },
    { pairs: 18, cols: 6, starMoves: [36, 46] },
    { pairs: 20, cols: 5, starMoves: [40, 52] },
    { pairs: 24, cols: 6, starMoves: [48, 62] },
  ];

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
    document.body.classList.remove("garden-stage", "garden-playing");
    document.body.classList.add("garden-main");
    resultPanel.classList.add("hidden");
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
      button.innerHTML = `
        <strong>${index + 1}</strong>
        <span>${t("pairCount", { count: level.pairs })}</span>
        <small>${t("starGoal", { moves: level.starMoves[0] })}</small>
      `;
      if (index + 1 > unlocked) button.classList.add("locked");
      if (stars > 0) button.classList.add("completed");
      if (index + 1 === unlocked) button.classList.add("challenge");
      button.setAttribute("aria-label", `${t("level")} ${index + 1}`);
      levelGrid.append(button);
    });
  }

  function showLevelSelect() {
    document.body.classList.remove("garden-main", "garden-playing");
    document.body.classList.add("garden-stage");
    resultPanel.classList.add("hidden");
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
  }

  function startLevel(index) {
    if (index + 1 > unlocked) {
      showMessage(t("locked"));
      window.WonderSound?.play?.("wrong");
      return;
    }
    currentLevelIndex = index;
    const level = levels[index];
    selectedTile = null;
    moves = 0;
    matchedPairs = 0;
    busy = false;
    tiles = makeTiles(level.pairs, index);
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
    renderBoard();
    showMessage(t("selectFirst"));
    updateHud();
    updateGardenFrame();
    requestAnimationFrame(() => {
      window.WeightPlayGame?.exitMobileGameMode?.();
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
      if (document.webkitFullscreenElement) document.webkitExitFullscreen?.();
      document.querySelector(".garden-game")?.classList.remove("weightplay-active-viewport");
      updateGardenFrame();
    });
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
      button.setAttribute("aria-label", tileName(tile.art));
      const selected = selectedTile?.index === tile.index;
      button.setAttribute("aria-pressed", String(selected));
      if (tile.matched) {
        button.classList.add("matched");
        button.disabled = true;
        button.tabIndex = -1;
        button.setAttribute("aria-hidden", "true");
      }
      if (selected) button.classList.add("selected");
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
      return;
    }
    if (selectedTile.index === tile.index) {
      selectedTile = null;
      renderBoard(tile.index);
      return;
    }
    moves += 1;
    if (selectedTile.art.id === tile.art.id) {
      selectedTile.matched = true;
      tile.matched = true;
      matchedPairs += 1;
      selectedTile = null;
      showMessage(t("matched"));
      window.WonderSound?.play?.("success");
      renderBoard(tiles.find((item) => !item.matched)?.index ?? null);
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
      setTimeout(() => {
        busy = false;
        renderBoard(second);
      }, 360);
    }
    updateHud();
  }

  function markWrong(first, second) {
    for (const index of [first, second]) {
      const button = board.querySelector(`[data-index="${index}"]`);
      button?.classList.add("wrong");
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
    resultPanel.classList.remove("hidden");
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

  board.addEventListener("click", (event) => {
    const button = event.target.closest("[data-index]");
    if (!button) return;
    selectTile(Number(button.dataset.index));
  });

  levelGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-level]");
    if (!button) return;
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
