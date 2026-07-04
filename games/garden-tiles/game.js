(() => {
  const GAME_ID = "garden-tiles";
  const UNLOCK_KEY = "gardenTilesUnlocked";
  const STARS_KEY = "gardenTilesStars";
  const titleText = document.querySelector("#titleText");
  const languageLabel = document.querySelector("#languageLabel");
  const localeSelect = document.querySelector("#localeSelect");
  const levelLabel = document.querySelector("#levelLabel");
  const movesLabel = document.querySelector("#movesLabel");
  const pairsLabel = document.querySelector("#pairsLabel");
  const levelText = document.querySelector("#levelText");
  const movesText = document.querySelector("#movesText");
  const pairsText = document.querySelector("#pairsText");
  const levelSelect = document.querySelector("#levelSelect");
  const levelSelectTitle = document.querySelector("#levelSelectTitle");
  const levelMessage = document.querySelector("#levelMessage");
  const levelGrid = document.querySelector("#levelGrid");
  const boardPanel = document.querySelector("#boardPanel");
  const board = document.querySelector("#board");
  const message = document.querySelector("#message");
  const resultPanel = document.querySelector("#resultPanel");
  const resultTitle = document.querySelector("#resultTitle");
  const resultText = document.querySelector("#resultText");
  const stars = document.querySelector("#stars");
  const nextBtn = document.querySelector("#nextBtn");
  const againBtn = document.querySelector("#againBtn");
  const levelsBtn = document.querySelector("#levelsBtn");
  const lobbyLink = document.querySelector("#lobbyLink");
  const loadingPanel = document.querySelector("#loadingPanel");

  const dictionary = {
    en: {
      title: "Pet Garden Tiles",
      language: "Language",
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
      next: "Next Level",
      again: "Play Again",
      levels: "Levels",
      lobby: "Lobby",
      allClear: "All levels cleared.",
    },
    "zh-Hant": {
      title: "\u5bf5\u7269\u82b1\u5712\u65b9\u584a",
      language: "\u8a9e\u8a00",
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
      next: "\u4e0b\u4e00\u95dc",
      again: "\u518d\u73a9\u4e00\u6b21",
      levels: "\u9078\u95dc",
      lobby: "\u5927\u5ef3",
      allClear: "\u5168\u90e8\u95dc\u5361\u5b8c\u6210\u3002",
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
    { id: "lion", label: "Lion", asset: "../../assets/tiny-weather-animal-lion.png" },
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
    titleText.textContent = t("title");
    languageLabel.textContent = t("language");
    levelLabel.textContent = t("level");
    movesLabel.textContent = t("moves");
    pairsLabel.textContent = t("pairs");
    levelSelectTitle.textContent = t("chooseLevel");
    nextBtn.textContent = t("next");
    againBtn.textContent = t("again");
    levelsBtn.textContent = t("levels");
    lobbyLink.textContent = t("lobby");
    renderLevelGrid();
    updateHud();
  }

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
    resultPanel.classList.add("hidden");
    boardPanel.classList.add("hidden");
    levelSelect.classList.remove("hidden");
    message.textContent = "";
    levelMessage.textContent = "";
    renderLevelGrid();
    updateHud();
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
    board.style.setProperty("--cols", level.cols);
    levelSelect.classList.add("hidden");
    boardPanel.classList.remove("hidden");
    resultPanel.classList.add("hidden");
    renderBoard();
    showMessage(t("selectFirst"));
    updateHud();
    window.WonderAnalytics?.track?.("game_start", { game_id: GAME_ID, level: index + 1 });
    window.WonderAnalytics?.track?.("level_start", { game_id: GAME_ID, level: index + 1 });
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

  function renderBoard() {
    board.innerHTML = "";
    for (const tile of tiles) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "tile";
      button.dataset.index = String(tile.index);
      button.dataset.tileId = tile.art.id;
      button.innerHTML = `<img class="tile-image" src="${tile.art.asset}" alt="" draggable="false" />`;
      button.setAttribute("aria-label", tile.art.label);
      if (tile.matched) button.classList.add("matched");
      if (selectedTile?.index === tile.index) button.classList.add("selected");
      board.append(button);
    }
  }

  function selectTile(index) {
    if (busy) return;
    const tile = tiles.find((item) => item.index === index);
    if (!tile || tile.matched) return;
    if (!selectedTile) {
      selectedTile = tile;
      renderBoard();
      window.WonderSound?.play?.("click");
      return;
    }
    if (selectedTile.index === tile.index) {
      selectedTile = null;
      renderBoard();
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
      renderBoard();
      if (matchedPairs === levels[currentLevelIndex].pairs) finishLevel();
    } else {
      const first = selectedTile.index;
      const second = tile.index;
      selectedTile = null;
      busy = true;
      showMessage(t("miss"));
      window.WonderSound?.play?.("wrong");
      renderBoard();
      markWrong(first, second);
      setTimeout(() => {
        busy = false;
        renderBoard();
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
    starMap[levelNumber] = Math.max(starMap[levelNumber] || 0, starCount);
    unlocked = Math.max(unlocked, Math.min(levels.length, levelNumber + 1));
    saveProgress();
    resultTitle.textContent = t("clear");
    stars.textContent = "\u2605".repeat(starCount) + "\u2606".repeat(3 - starCount);
    resultText.textContent = t("result", { moves, pairs: matchedPairs });
    nextBtn.classList.toggle("hidden", currentLevelIndex >= levels.length - 1);
    resultPanel.classList.remove("hidden");
    window.WonderAnalytics?.track?.("game_complete", { game_id: GAME_ID, level: levelNumber, moves, stars: starCount, cleared: true });
    window.WonderAnalytics?.track?.("level_clear", { game_id: GAME_ID, level: levelNumber, moves, stars: starCount });
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
  localeSelect.addEventListener("change", () => {
    window.WonderI18n?.setLocale?.(localeSelect.value);
    applyText();
  });
  window.addEventListener("wonder:locale-change", () => {
    localeSelect.value = locale();
    applyText();
  });

  localeSelect.value = locale();
  applyText();
  showLevelSelect();
  loadingPanel.classList.add("hidden");
  window.WonderAnalytics?.track?.("game_ready", { game_id: GAME_ID });
  window.WeightPlayGameReady = true;
})();

window.setTimeout(() => {
  if (window.WeightPlayGameReady) return;
  document.querySelector("#loadingPanel")?.classList.add("hidden");
  window.WeightPlayGameReady = true;
}, 2200);
