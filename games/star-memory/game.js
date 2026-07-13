(function () {
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
  const stageAdReserve = document.querySelector("#stageAdReserve");
  const battleAdReserve = document.querySelector("#battleAdReserve");
  
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
  
  const nextLevelBtn = document.querySelector("#nextLevelBtn");
  const againBtn = document.querySelector("#againBtn");
  const stageSelectBtn = document.querySelector("#stageSelectBtn");
  
  const loadingPanel = document.querySelector("#loadingPanel");
  const loadingText = document.querySelector("#loadingText");
  const loadingFill = document.querySelector("#loadingFill");

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
    lion: "../../assets/weightplay-boom-mane-lion.png",
    cat: "../../assets/star-memory-cat.svg",
    cardBack: "../../assets/star-memory-card-back.svg"
  };

  // Local Translations Dictionary
  const dictionary = {
    en: {
      title: "Animal Star Memory",
      seoTitle: "Animal Star Memory - WeightPlay",
      seoDescription: "Flip animal and star cards, remember their positions, and clear 10 short memory stages in Animal Star Memory on WeightPlay.",
      ogTitle: "Animal Star Memory - Memory Matching Game",
      ogDescription: "Flip animal and star cards, remember their positions, and clear 10 short memory stages in Animal Star Memory on WeightPlay.",
      language: "Language",
      languageAria: "Choose language",
      stageBackAria: "Back to main page",
      battleBackAria: "Back to levels",
      gameStatsAria: "Game stats",
      mainIntro: "Remember where each animal and star is hiding, then clear all ten matching stages.",
      start: "Choose Level",
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
      loading: "Loading",
      stage1Name: "Level 1: Space Easy",
      stage2Name: "Level 2: Cosmic Trio",
      stage3Name: "Level 3: Deep Space",
      stage4Name: "Level 4: Animal Friends",
      stage5Name: "Level 5: Sweet Snacks",
      stage6Name: "Level 6: Galaxy Masters",
      stage7Name: "Level 7: Moon Garden",
      stage8Name: "Level 8: Animal Parade",
      stage9Name: "Level 9: Sweet Galaxy",
      stage10Name: "Level 10: Memory Master",
      stage1Desc: "Warm up with 2 pairs and unlimited moves.",
      stage2Desc: "Match 3 pairs with 8 moves limit.",
      stage3Desc: "Match 6 pairs under 16 moves.",
      stage4Desc: "Find 8 cute animals in 22 moves.",
      stage5Desc: "Match 10 delicious treats in 28 moves.",
      stage6Desc: "Combine space and animals in 35 moves.",
      stage7Desc: "A tighter space challenge with fewer safe moves.",
      stage8Desc: "More animal pairs with a careful move limit.",
      stage9Desc: "Space, animals, and sweets all mixed together.",
      stage10Desc: "The full 12-pair board for memory experts.",
      highScore: "High Score: {score}",
      reportPairs: "Pairs found",
      reportMoves: "Moves used",
      reportStreak: "Best streak"
    },
    "zh-Hant": {
      title: "\u52d5\u7269\u661f\u661f\u7ffb\u724c",
      seoTitle: "\u52d5\u7269\u661f\u661f\u7ffb\u724c - WeightPlay",
      seoDescription: "\u7ffb\u958b\u52d5\u7269\u8207\u661f\u661f\u5361\u724c\uff0c\u8a18\u4f4f\u4f4d\u7f6e\u4e26\u5b8c\u6210 10 \u500b\u77ed\u95dc\u5361\uff0c\u5728 WeightPlay \u7df4\u7fd2\u8a18\u61b6\u8207\u5c08\u6ce8\u3002",
      ogTitle: "\u52d5\u7269\u661f\u661f\u7ffb\u724c - \u8a18\u61b6\u914d\u5c0d\u904a\u6232",
      ogDescription: "\u7ffb\u958b\u52d5\u7269\u8207\u661f\u661f\u5361\u724c\uff0c\u8a18\u4f4f\u4f4d\u7f6e\u4e26\u5b8c\u6210 10 \u500b\u77ed\u95dc\u5361\uff0c\u5728 WeightPlay \u7df4\u7fd2\u8a18\u61b6\u8207\u5c08\u6ce8\u3002",
      language: "\u8a9e\u8a00",
      languageAria: "\u9078\u64c7\u8a9e\u8a00",
      stageBackAria: "\u8fd4\u56de\u9996\u9801",
      battleBackAria: "\u8fd4\u56de\u95dc\u5361",
      gameStatsAria: "\u904a\u6232\u72c0\u614b",
      mainIntro: "\u8a18\u4f4f\u6bcf\u5f35\u52d5\u7269\u8207\u661f\u661f\u5361\u724c\u7684\u4f4d\u7f6e\uff0c\u5b8c\u6210\u5168\u90e8 10 \u500b\u914d\u5c0d\u95dc\u5361\u3002",
      start: "\u9078\u64c7\u95dc\u5361",
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
      loading: "\u8f09\u5165\u4e2d",
      stage1Name: "\u7b2c 1 \u95dc\uff1a\u661f\u5149\u6696\u8eab",
      stage2Name: "\u7b2c 2 \u95dc\uff1a\u661f\u7a7a\u4e09\u7d44",
      stage3Name: "\u7b2c 3 \u95dc\uff1a\u6df1\u7a7a\u8a18\u61b6",
      stage4Name: "\u7b2c 4 \u95dc\uff1a\u52d5\u7269\u670b\u53cb",
      stage5Name: "\u7b2c 5 \u95dc\uff1a\u751c\u9ede\u5c0f\u9ede\u5fc3",
      stage6Name: "\u7b2c 6 \u95dc\uff1a\u661f\u6cb3\u9ad8\u624b",
      stage7Name: "\u7b2c 7 \u95dc\uff1a\u6708\u4eae\u82b1\u5712",
      stage8Name: "\u7b2c 8 \u95dc\uff1a\u52d5\u7269\u904a\u884c",
      stage9Name: "\u7b2c 9 \u95dc\uff1a\u751c\u871c\u661f\u6cb3",
      stage10Name: "\u7b2c 10 \u95dc\uff1a\u8a18\u61b6\u5927\u5e2b",
      stage1Desc: "\u5148\u7528 2 \u7d44\u5361\u724c\u6696\u8eab\uff0c\u6b65\u6578\u4e0d\u9650\u3002",
      stage2Desc: "\u7528 8 \u6b65\u914d\u5c0d 3 \u7d44\u5361\u724c\u3002",
      stage3Desc: "\u5728 16 \u6b65\u5167\u5b8c\u6210 6 \u7d44\u914d\u5c0d\u3002",
      stage4Desc: "\u7528 22 \u6b65\u627e\u51fa 8 \u7d44\u53ef\u611b\u52d5\u7269\u3002",
      stage5Desc: "\u7528 28 \u6b65\u914d\u5c0d 10 \u7d44\u751c\u9ede\u5716\u6848\u3002",
      stage6Desc: "\u7528 35 \u6b65\u5b8c\u6210\u661f\u7a7a\u8207\u52d5\u7269\u6df7\u5408\u6311\u6230\u3002",
      stage7Desc: "\u66f4\u7dca\u6e4a\u7684\u661f\u7a7a\u6311\u6230\uff0c\u6b65\u6578\u66f4\u5c11\u3002",
      stage8Desc: "\u66f4\u591a\u52d5\u7269\u914d\u5c0d\uff0c\u9700\u8981\u4ed4\u7d30\u8a18\u4f4d\u7f6e\u3002",
      stage9Desc: "\u661f\u7a7a\u3001\u52d5\u7269\u548c\u751c\u9ede\u6df7\u5408\u5728\u4e00\u8d77\u3002",
      stage10Desc: "\u5b8c\u6574 12 \u7d44\u5361\u724c\uff0c\u6311\u6230\u8a18\u61b6\u9ad8\u624b\u3002",
      highScore: "\u6700\u9ad8\u5206\uff1a{score}",
      reportPairs: "\u5df2\u627e\u5230\u914d\u5c0d",
      reportMoves: "\u4f7f\u7528\u6b65\u6578",
      reportStreak: "\u6700\u4f73\u9023\u7e8c\u914d\u5c0d"
    }
  };

  // Levels Configurations
  const stages = [
    {
      id: 1,
      nameKey: "stage1Name",
      descKey: "stage1Desc",
      grid: { r: 2, c: 2 },
      limit: Infinity,
      symbols: ["sun", "moon"],
      stars: [2, 3, Infinity]
    },
    {
      id: 2,
      nameKey: "stage2Name",
      descKey: "stage2Desc",
      grid: { r: 2, c: 3 },
      limit: 8,
      symbols: ["sun", "moon", "star"],
      stars: [4, 5, 8]
    },
    {
      id: 3,
      nameKey: "stage3Name",
      descKey: "stage3Desc",
      grid: { r: 3, c: 4 },
      limit: 16,
      symbols: ["sun", "moon", "star", "rocket", "ufo", "planet"],
      stars: [8, 10, 16]
    },
    {
      id: 4,
      nameKey: "stage4Name",
      descKey: "stage4Desc",
      grid: { r: 4, c: 4 },
      limit: 22,
      symbols: ["panda", "bear", "lion", "cat", "sun", "moon", "star", "rocket"],
      stars: [11, 13, 22]
    },
    {
      id: 5,
      nameKey: "stage5Name",
      descKey: "stage5Desc",
      grid: { r: 4, c: 5 },
      limit: 28,
      symbols: ["donut", "heart", "panda", "bear", "lion", "cat", "sun", "moon", "star", "rocket"],
      stars: [14, 17, 28]
    },
    {
      id: 6,
      nameKey: "stage6Name",
      descKey: "stage6Desc",
      grid: { r: 4, c: 6 },
      limit: 35,
      symbols: ["donut", "heart", "panda", "bear", "lion", "cat", "sun", "moon", "star", "rocket", "ufo", "planet"],
      stars: [18, 22, 35]
    },
    {
      id: 7,
      nameKey: "stage7Name",
      descKey: "stage7Desc",
      grid: { r: 3, c: 4 },
      limit: 14,
      symbols: ["sun", "moon", "star", "rocket", "ufo", "planet"],
      stars: [8, 10, 14]
    },
    {
      id: 8,
      nameKey: "stage8Name",
      descKey: "stage8Desc",
      grid: { r: 4, c: 4 },
      limit: 20,
      symbols: ["panda", "bear", "lion", "cat", "donut", "heart", "sun", "moon"],
      stars: [11, 14, 20]
    },
    {
      id: 9,
      nameKey: "stage9Name",
      descKey: "stage9Desc",
      grid: { r: 4, c: 5 },
      limit: 26,
      symbols: ["donut", "heart", "panda", "bear", "lion", "cat", "sun", "moon", "star", "rocket"],
      stars: [14, 18, 26]
    },
    {
      id: 10,
      nameKey: "stage10Name",
      descKey: "stage10Desc",
      grid: { r: 4, c: 6 },
      limit: 32,
      symbols: ["donut", "heart", "panda", "bear", "lion", "cat", "sun", "moon", "star", "rocket", "ufo", "planet"],
      stars: [18, 23, 32]
    }
  ];

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
    isLocked: false,
    ready: false
  };

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

  function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  // Load and save localStorage stats
  function loadProgress() {
    try {
      const saved = Number(localStorage.getItem(UNLOCK_KEY));
      state.unlockedLevel = Number.isFinite(saved) && saved >= 1 ? Math.min(saved, stages.length) : 1;
    } catch {
      state.unlockedLevel = 1;
    }
  }

  function saveProgress(unlockedLevel) {
    state.unlockedLevel = Math.max(state.unlockedLevel, unlockedLevel);
    try {
      localStorage.setItem(UNLOCK_KEY, String(state.unlockedLevel));
    } catch {
      // LocalStorage is optional.
    }
  }

  function getLevelHighScore(levelId) {
    try {
      return Number(localStorage.getItem(SCORE_KEY_PREFIX + levelId)) || 0;
    } catch {
      return 0;
    }
  }

  function saveLevelHighScore(levelId, score) {
    const currentHigh = getLevelHighScore(levelId);
    if (score > currentHigh) {
      try {
        localStorage.setItem(SCORE_KEY_PREFIX + levelId, String(score));
      } catch {}
    }
  }

  function getLevelStars(levelId) {
    try {
      return Number(localStorage.getItem(STARS_KEY_PREFIX + levelId)) || 0;
    } catch {
      return 0;
    }
  }

  function saveLevelStars(levelId, stars) {
    const currentStars = getLevelStars(levelId);
    if (stars > currentStars) {
      try {
        localStorage.setItem(STARS_KEY_PREFIX + levelId, String(stars));
      } catch {}
    }
  }

  // UI Translating
  function translateStaticUI() {
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
    document.querySelector("#lobbyLink").textContent = t("lobby");
    document.querySelector("#homeLink").setAttribute("aria-label", t("lobby"));
    stageBackBtn.setAttribute("aria-label", t("stageBackAria"));
    battleBackBtn.setAttribute("aria-label", t("battleBackAria"));
    gameHud.setAttribute("aria-label", t("gameStatsAria"));
    
    // HUD Level text
    if (!stageSelectPanel.classList.contains("hidden")) {
      renderStageGrid();
    } else {
      updateHUD();
    }
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
    const isPhoneCanvas = (document.body.classList.contains("memory-playing") || document.body.classList.contains("memory-stage"))
      && (window.matchMedia("(pointer: coarse)").matches || viewportWidth <= 700 || viewportHeight <= 430);
    document.body.classList.toggle("memory-expanded-canvas", isPhoneCanvas);
    if (isPhoneCanvas) {
      document.documentElement.style.setProperty("--memory-frame-scale", "1");
      document.documentElement.style.setProperty("--memory-frame-left", "4px");
      document.documentElement.style.setProperty("--memory-frame-top", "4px");
      document.documentElement.style.setProperty("--memory-frame-width", `${Math.max(1, viewportWidth - 8)}px`);
      document.documentElement.style.setProperty("--memory-frame-height", `${Math.max(1, viewportHeight - 64)}px`);
      return;
    }
    const availableWidth = Math.max(1, viewportWidth - 8);
    const availableHeight = Math.max(1, viewportHeight - 56 - 8);
    const scale = Math.min(availableWidth / 390, availableHeight / 788);
    const frameWidth = 390 * scale;
    const frameHeight = 788 * scale;
    const frameLeft = (viewportWidth - frameWidth) / 2;
    const frameTop = (viewportHeight - 56 - frameHeight) / 2;
    document.documentElement.style.setProperty("--memory-frame-scale", String(scale));
    document.documentElement.style.setProperty("--memory-frame-left", `${frameLeft}px`);
    document.documentElement.style.setProperty("--memory-frame-top", `${frameTop}px`);
    document.documentElement.style.setProperty("--memory-frame-width", `${frameWidth}px`);
    document.documentElement.style.setProperty("--memory-frame-height", `${frameHeight}px`);
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
    document.body.classList.remove("memory-stage", "memory-playing", "memory-expanded-canvas");
    document.body.classList.add("memory-main");
    resultPanel.classList.add("hidden");
    mainPanel.classList.remove("hidden");
    stageSelectPanel.classList.add("hidden");
    gameHud.classList.add("hidden");
    gameBoardPanel.classList.add("hidden");
    gameFeedback.classList.add("hidden");
    battleAdReserve.classList.add("hidden");
    stageAdReserve.classList.add("hidden");
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  // Stage Selection Screen
  function showStageSelect() {
    document.body.classList.remove("memory-main");
    document.body.classList.remove("memory-playing");
    document.body.classList.add("memory-stage");
    resultPanel.classList.add("hidden");
    mainPanel.classList.add("hidden");
    gameHud.classList.add("hidden");
    gameBoardPanel.classList.add("hidden");
    gameFeedback.classList.add("hidden");
    battleAdReserve.classList.add("hidden");
    stageAdReserve.classList.remove("hidden");
    stageSelectPanel.classList.remove("hidden");

    exitSharedPlayViewport();
    renderStageGrid();
    updateMemoryFrame();
    requestAnimationFrame(() => {
      exitSharedPlayViewport();
      updateMemoryFrame();
    });
  }

  function renderStageGrid() {
    stageGrid.replaceChildren(
      ...stages.map((stage, idx) => {
        const isUnlocked = stage.id <= state.unlockedLevel;
        const button = document.createElement("button");
        button.type = "button";
        button.className = `stage-card ${isUnlocked ? "unlocked" : "locked"}`;
        button.disabled = !isUnlocked;
        
        let starsStr = "";
        if (isUnlocked) {
          const starsEarned = getLevelStars(stage.id);
          starsStr = "⭐".repeat(starsEarned);
        }
        
        const highScoreVal = getLevelHighScore(stage.id);
        const scoreStr = highScoreVal > 0 ? `<br><small>${t("highScore", { score: highScoreVal })}</small>` : "";

        button.innerHTML = `
          <span>${isUnlocked ? t("play") : t("locked")}</span>
          <strong>${t(stage.nameKey)}</strong>
          <small>${t(stage.descKey)}</small>
          ${scoreStr}
          ${starsStr ? `<div class="stars-badge">${starsStr}</div>` : ""}
        `;
        
        if (isUnlocked) {
          button.addEventListener("click", () => startStage(idx));
        }
        return button;
      })
    );
    if (window.matchMedia("(max-width: 700px), (max-height: 430px)").matches) {
      requestAnimationFrame(() => {
        const unlocked = [...stageGrid.querySelectorAll(".stage-card.unlocked")].at(-1);
        unlocked?.scrollIntoView({ block: "nearest", inline: "center", behavior: "auto" });
      });
    }
  }

  // Start Gameplay Stage
  function startStage(stageIdx) {
    const stage = stages[stageIdx];
    state.stageIndex = stageIdx;
    state.score = 0;
    state.moves = 0;
    state.combo = 0;
    state.bestCombo = 0;
    state.matchedPairsCount = 0;
    state.selectedCards = [];
    state.isLocked = false;
    document.body.classList.remove("memory-stage");
    document.body.classList.add("memory-playing");
    stageAdReserve.classList.add("hidden");

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
    battleAdReserve.classList.remove("hidden");

    exitSharedPlayViewport();
    updateMemoryFrame();
    feedbackText.textContent = t("tipTap");
    comboContainer.classList.add("hidden");
    
    updateHUD();
    generateGameBoard(stage);
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
    cardGrid.style.gridTemplateColumns = `repeat(${stage.grid.c}, 1fr)`;
    
    cardGrid.replaceChildren(
      ...shuffledPairs.map((symbolId, cardIdx) => {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.symbol = symbolId;
        card.dataset.index = cardIdx;
        
        card.innerHTML = `
          <div class="card-inner">
            <div class="card-back"><img src="${assetLibrary.cardBack}" alt="" /></div>
            <div class="card-front"><img src="${assetLibrary[symbolId]}" alt="" /></div>
          </div>
        `;
        
        card.addEventListener("click", () => handleCardClick(card));
        return card;
      })
    );
  }

  // Card Click Handling
  function handleCardClick(card) {
    if (state.isLocked) return;
    if (card.classList.contains("flipped") || card.classList.contains("matched")) return;
    
    // Flip the card
    card.classList.add("flipped");
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
    
    if (symbol1 === symbol2) {
      // It's a match!
      state.matchedPairsCount += 1;
      state.combo += 1;
      state.bestCombo = Math.max(state.bestCombo, state.combo);
      
      // Calculate scores
      const matchScore = 100 + (state.combo - 1) * 50;
      state.score += matchScore;
      
      card1.classList.add("matched");
      card2.classList.add("matched");
      
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
      updateHUD();
      
      // Check for win
      if (state.matchedPairsCount === stage.symbols.length) {
        setTimeout(finishGame, 600);
      }
    } else {
      // Mismatch
      state.combo = 0;
      comboContainer.classList.add("hidden");
      feedbackText.textContent = t("tipMismatch");
      
      window.WonderSound?.play("wrong");
      
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        state.selectedCards = [];
        state.isLocked = false;
      }, 800);
      
      updateHUD();
      
      // Check for lose (out of moves)
      if (state.moves >= stage.limit) {
        setTimeout(gameOver, 900);
      }
    }
  }

  // Game Victory Handling
  function finishGame() {
    const stage = stages[state.stageIndex];
    
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
    resultTitle.textContent = stage.id === stages.length ? t("allClear") : t("victory");
    resultText.textContent = stage.id === stages.length ? t("allClearDesc", { count: stages.length }) : t("victoryDesc", { moves: state.moves });
    reportPairsLabel.textContent = t("reportPairs");
    reportPairsValue.textContent = `${state.matchedPairsCount} / ${stage.symbols.length}`;
    reportMovesLabel.textContent = t("reportMoves");
    reportMovesValue.textContent = state.moves;
    reportStreakLabel.textContent = t("reportStreak");
    reportStreakValue.textContent = `x${state.bestCombo}`;
    memoryReport.classList.remove("hidden");
    
    // Stars indicator
    document.querySelectorAll("#starContainer .star").forEach((star) => {
      const idx = Number(star.dataset.index);
      star.classList.toggle("active", idx <= starsEarned);
    });
    
    // Toggle next level button
    nextLevelBtn.classList.toggle("hidden", stage.id === stages.length);
    resultPanel.classList.remove("hidden");
    
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
    resultTitle.textContent = t("defeat");
    resultText.textContent = t("defeatDesc");
    memoryReport.classList.add("hidden");
    
    // Stars indicator (none)
    document.querySelectorAll("#starContainer .star").forEach((star) => {
      star.classList.remove("active");
    });
    
    nextLevelBtn.classList.add("hidden");
    resultPanel.classList.remove("hidden");
    
    window.WonderSound?.play("wrong");
  }

  // Event Listeners
  startBtn.addEventListener("click", () => {
    window.WonderSound?.play("click");
    showStageSelect();
  });
  stageBackBtn.addEventListener("click", showMain);
  battleBackBtn.addEventListener("click", showStageSelect);

  localeSelect.addEventListener("change", () => {
    window.WonderSound?.play("click");
    window.WonderI18n?.setLocale(localeSelect.value);
  });

  localeSelect.addEventListener("input", () => {
    window.WonderSound?.play("click");
    window.WonderI18n?.setLocale(localeSelect.value);
  });

  window.addEventListener("wonder:locale-change", translateStaticUI);

  window.addEventListener("weightplay:tutorial-start", (event) => {
    if (event.detail?.gameId !== GAME_ID || !document.body.classList.contains("memory-main")) return;
    showStageSelect();
  });

  againBtn.addEventListener("click", () => {
    window.WonderSound?.play("click");
    window.WonderAnalytics?.track("game_restart", {
      game_id: GAME_ID,
      stage: stages[state.stageIndex].id,
      locale: locale()
    });
    startStage(state.stageIndex);
  });

  nextLevelBtn.addEventListener("click", () => {
    window.WonderSound?.play("click");
    startStage(Math.min(state.stageIndex + 1, stages.length - 1));
  });

  stageSelectBtn.addEventListener("click", () => {
    window.WonderSound?.play("click");
    showStageSelect();
  });

  document.querySelector("#homeLink").addEventListener("click", (event) => {
    if (document.body.classList.contains("memory-main")) return;
    event.preventDefault();
    window.WonderSound?.play("click");
    if (document.body.classList.contains("memory-playing")) showStageSelect();
    else showMain();
  });

  // Initialization
  translateStaticUI();
  simulateLoading();

})();
