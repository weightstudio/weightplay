(function () {
  // DOM Elements
  const localeSelect = document.querySelector("#localeSelect");
  const languageLabel = document.querySelector("#languageLabel");
  const titleText = document.querySelector("#titleText");
  const stageSelectPanel = document.querySelector("#stageSelectPanel");
  const stageSelectTitle = document.querySelector("#stageSelectTitle");
  const stageGrid = document.querySelector("#stageGrid");
  
  const gameHud = document.querySelector("#gameHud");
  const levelIndicator = document.querySelector("#levelIndicator");
  const progressFill = document.querySelector("#progressFill");
  const scoreText = document.querySelector("#scoreText");
  const roundText = document.querySelector("#roundText");
  
  const gamePlayContent = document.querySelector("#gamePlayContent");
  const dropZone = document.querySelector("#dropZone");
  const foodCard = document.querySelector("#foodCard");
  const foodImage = document.querySelector("#foodImage");
  const foodName = document.querySelector("#foodName");
  const feedbackText = document.querySelector("#feedbackText");
  
  const resultPanel = document.querySelector("#resultPanel");
  const resultTitle = document.querySelector("#resultTitle");
  const resultText = document.querySelector("#resultText");
  
  const nextStageBtn = document.querySelector("#nextStageBtn");
  const againBtn = document.querySelector("#againBtn");
  const stageSelectBtn = document.querySelector("#stageSelectBtn");
  const lobbyLink = document.querySelector("#lobbyLink");
  const homeLink = document.querySelector("#homeLink");
  
  const loadingPanel = document.querySelector("#loadingPanel");
  const loadingText = document.querySelector("#loadingText");
  const loadingFill = document.querySelector("#loadingFill");

  // Game Constants
  const GAME_ID = "color-lunchbox";
  const UNLOCK_KEY = "colorLunchboxUnlockedStage";

  // Raw Foods Database
  const foodsDB = {
    strawberry: { nameKey: "food_strawberry", color: "red", image: "assets/food-strawberry.svg" },
    tomato: { nameKey: "food_tomato", color: "red", image: "assets/food-tomato.svg" },
    banana: { nameKey: "food_banana", color: "yellow", image: "assets/food-banana.svg" },
    cheese: { nameKey: "food_cheese", color: "yellow", image: "assets/food-cheese.svg" },
    blueberry: { nameKey: "food_blueberry", color: "blue", image: "assets/food-blueberry.svg" },
    milk: { nameKey: "food_milk", color: "blue", image: "assets/food-milk.svg" },
    broccoli: { nameKey: "food_broccoli", color: "green", image: "assets/food-broccoli.svg" },
    apple: { nameKey: "food_apple", color: "green", image: "assets/food-apple.svg" }
  };

  // Lunchboxes configurations
  const boxes = [
    { color: "red", labelKey: "color_red", className: "red" },
    { color: "yellow", labelKey: "color_yellow", className: "yellow" },
    { color: "blue", labelKey: "color_blue", className: "blue" },
    { color: "green", labelKey: "color_green", className: "green" }
  ];

  // Local Translations Dictionary
  const dictionary = {
    en: {
      title: "Color Lunchbox",
      language: "Language",
      chooseLevel: "Choose Level",
      scoreLabel: "Score",
      roundLabel: "Progress",
      ready: "Ready to play?",
      correct: "Yum! Correct!",
      wrong: "Try another box!",
      winTitle: "Level Complete!",
      winDesc: "You scored {score} points!",
      allClearTitle: "All Clear!",
      allClearDesc: "You completed all lunchboxes! Wonderful!",
      nextStage: "Next Level",
      again: "Play Again",
      levels: "Levels",
      lobby: "Lobby",
      stage1Name: "Level 1: Fruit Box",
      stage1Desc: "Match sweet strawberries, bananas, blueberries, and apples.",
      stage2Name: "Level 2: Veggie & Dairy",
      stage2Desc: "Match healthy tomatoes, broccoli, cheese, and milk.",
      stage3Name: "Level 3: Picnic Box",
      stage3Desc: "A complete combination picnic box. Double rounds!",
      food_strawberry: "Strawberry",
      food_tomato: "Tomato",
      food_banana: "Banana",
      food_cheese: "Cheese",
      food_milk: "Milk",
      food_blueberry: "Blueberry",
      food_broccoli: "Broccoli",
      food_apple: "Apple",
      color_red: "Red",
      color_yellow: "Yellow",
      color_blue: "Blue",
      color_green: "Green",
      locked: "Locked",
      play: "Play",
      loading: "Loading"
    },
    "zh-Hant": {
      title: "顏色便當盒",
      language: "語言",
      chooseLevel: "選擇關卡",
      scoreLabel: "分數",
      roundLabel: "進度",
      ready: "準備好了嗎？",
      correct: "放對了！好棒！",
      wrong: "再找找看其他盒子",
      winTitle: "便當準備完成！",
      winDesc: "你獲得了 {score} 分！",
      allClearTitle: "完美大通關！",
      allClearDesc: "你完成了所有的便當盒，太棒了！",
      nextStage: "下一關",
      again: "再玩一次",
      levels: "關卡列表",
      lobby: "回大廳",
      stage1Name: "第一關：鮮果便當",
      stage1Desc: "配對甜甜的香蕉、草莓、藍莓和青蘋果。",
      stage2Name: "第二關：蔬菜與乳酪",
      stage2Desc: "配對健康的番茄、青花菜、起司和牛奶。",
      stage3Name: "第三關：綜合野餐盒",
      stage3Desc: "綜合美味大拼盤！雙倍回合配對挑戰。",
      food_strawberry: "草莓",
      food_tomato: "番茄",
      food_banana: "香蕉",
      food_cheese: "起司",
      food_milk: "牛奶",
      food_blueberry: "藍莓",
      food_broccoli: "青花菜",
      food_apple: "蘋果",
      color_red: "紅色",
      color_yellow: "黃色",
      color_blue: "藍色",
      color_green: "綠色",
      locked: "未解鎖",
      play: "開始玩",
      loading: "載入中"
    }
  };

  // 3 Stages definitions
  const stages = [
    {
      id: 1,
      nameKey: "stage1Name",
      descKey: "stage1Desc",
      foods: ["strawberry", "banana", "blueberry", "apple"],
      rounds: 8 // Spawn 8 random items from this pool
    },
    {
      id: 2,
      nameKey: "stage2Name",
      descKey: "stage2Desc",
      foods: ["tomato", "cheese", "milk", "broccoli"],
      rounds: 8
    },
    {
      id: 3,
      nameKey: "stage3Name",
      descKey: "stage3Desc",
      foods: ["strawberry", "tomato", "banana", "cheese", "blueberry", "milk", "broccoli", "apple"],
      rounds: 12
    }
  ];

  // Game State
  const state = {
    stageIndex: 0,
    deck: [],
    index: 0,
    score: 0,
    attempts: 0,
    unlockedStage: 1,
    dragging: false,
    startX: 0,
    startY: 0,
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

  function shuffle(items) {
    return [...items].sort(() => Math.random() - 0.5);
  }

  // Load and save local unlocked stages
  function loadUnlockedStage() {
    try {
      const saved = Number(localStorage.getItem(UNLOCK_KEY));
      state.unlockedStage = Number.isFinite(saved) && saved >= 1 ? Math.min(saved, stages.length) : 1;
    } catch {
      state.unlockedStage = 1;
    }
  }

  function saveUnlockedStage(value) {
    state.unlockedStage = Math.max(state.unlockedStage, Math.min(value, stages.length));
    try {
      localStorage.setItem(UNLOCK_KEY, String(state.unlockedStage));
    } catch {}
  }

  // Translate static UI elements
  function translateStaticUI() {
    document.documentElement.lang = locale();
    localeSelect.value = locale();
    languageLabel.textContent = t("language");
    titleText.textContent = t("title");
    stageSelectTitle.textContent = t("chooseLevel");
    
    // HUD Labels
    document.querySelector("#scoreLabel").textContent = t("scoreLabel");
    document.querySelector("#roundLabel").textContent = t("roundLabel");
    
    // Loading Text
    document.querySelector("#loadingTitle").textContent = t("loading");

    // Action button labels
    nextStageBtn.textContent = t("nextStage");
    againBtn.textContent = t("again");
    stageSelectBtn.textContent = t("levels");
    lobbyLink.textContent = t("lobby");
    homeLink.setAttribute("aria-label", t("lobby"));

    if (!stageSelectPanel.classList.contains("hidden")) {
      renderStageCards();
    } else {
      updateHUD();
      // Translate current food name on screen
      if (state.deck.length > 0 && state.index < state.deck.length) {
        const food = state.deck[state.index];
        foodName.textContent = t(food.nameKey);
        foodImage.alt = t(food.nameKey);
      }
    }
  }

  // pre-loading
  function simulateLoading() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        state.ready = true;
        loadUnlockedStage();
        loadingPanel.classList.add("hidden");
        window.WonderAnalytics?.track("game_ready", { game_id: GAME_ID });
        showStageSelect();
      }
      loadingText.textContent = `${progress}%`;
      loadingFill.style.width = `${progress}%`;
    }, 30);
  }

  // Render stage select cards
  function showStageSelect() {
    resultPanel.classList.add("hidden");
    gameHud.classList.add("hidden");
    gamePlayContent.classList.add("hidden");
    stageSelectPanel.classList.remove("hidden");

    renderStageCards();
  }

  function renderStageCards() {
    stageGrid.replaceChildren(
      ...stages.map((stage, index) => {
        const isUnlocked = stage.id <= state.unlockedStage;
        const button = document.createElement("button");
        button.type = "button";
        button.className = `stage-card ${isUnlocked ? "unlocked" : "locked"}`;
        button.disabled = !isUnlocked;
        button.innerHTML = `
          <span>${isUnlocked ? t("play") : t("locked")}</span>
          <strong>${t(stage.nameKey)}</strong>
          <small>${t(stage.descKey)}</small>
        `;
        if (isUnlocked) {
          button.addEventListener("click", () => startStage(index));
        }
        return button;
      })
    );
  }

  // Set up colored lunchboxes
  function setupBoxes() {
    dropZone.replaceChildren(
      ...boxes.map((box) => {
        const element = document.createElement("button");
        element.className = `lunchbox ${box.className}`;
        element.type = "button";
        element.dataset.color = box.color;
        element.innerHTML = `<span></span><strong>${t(box.labelKey)}</strong>`;
        element.addEventListener("click", () => submitColor(box.color, element));
        return element;
      })
    );
  }

  // Start gameplay stage
  function startStage(stageIndex) {
    const stage = stages[stageIndex];
    state.stageIndex = stageIndex;
    state.score = 0;
    state.index = 0;
    state.attempts = 0;
    
    // Generate randomized food deck based on stage pool
    const pool = stage.foods.map(id => foodsDB[id]);
    const deck = [];
    while (deck.length < stage.rounds) {
      deck.push(...shuffle(pool));
    }
    state.deck = deck.slice(0, stage.rounds);

    // Track analytics event
    window.WonderAnalytics?.track("game_start", {
      game_id: GAME_ID,
      stage: stage.id,
      locale: locale()
    });

    stageSelectPanel.classList.add("hidden");
    resultPanel.classList.add("hidden");
    gameHud.classList.remove("hidden");
    gamePlayContent.classList.remove("hidden");
    
    feedbackText.textContent = t("ready");
    
    setupBoxes();
    updateHUD();
    loadFood();
  }

  function updateHUD() {
    const stage = stages[state.stageIndex];
    levelIndicator.textContent = `${t("stage1Name").split(":")[0]} ${stage.id} / ${stages.length}`; // Localized level text e.g. "Level 1 / 3"
    progressFill.style.width = `${(state.index / state.deck.length) * 100}%`;
    scoreText.textContent = state.score;
    roundText.textContent = `${state.index + 1} / ${state.deck.length}`;
  }

  function loadFood() {
    const food = state.deck[state.index];
    foodImage.src = food.image;
    foodImage.alt = t(food.nameKey);
    foodName.textContent = t(food.nameKey);
    
    foodCard.style.transform = "";
    foodCard.classList.remove("pop", "shake");
    // enable interactions
    foodCard.style.pointerEvents = "";
  }

  // Handle color drops
  function submitColor(color, target) {
    if (!state.ready) return;
    const food = state.deck[state.index];
    state.attempts += 1;

    if (color !== food.color) {
      feedbackText.textContent = t("wrong");
      window.WonderSound?.play("wrong");
      
      window.WonderAnalytics?.track("game_answer", {
        game_id: GAME_ID,
        result: "wrong",
        stage: stages[state.stageIndex].id,
        food: t(food.nameKey),
        selected_color: color,
        correct_color: food.color,
        round: state.index + 1
      });

      foodCard.classList.remove("shake");
      foodCard.offsetWidth; // Trigger reflow
      foodCard.classList.add("shake");
      
      target?.classList.add("miss");
      setTimeout(() => target?.classList.remove("miss"), 260);
      return;
    }

    // Score calculations
    state.score += Math.max(5, 12 - Math.min(state.attempts - state.index - 1, 5));
    scoreText.textContent = state.score;
    feedbackText.textContent = t("correct");
    window.WonderSound?.play("success");
    
    window.WonderAnalytics?.track("game_answer", {
      game_id: GAME_ID,
      result: "correct",
      stage: stages[state.stageIndex].id,
      food: t(food.nameKey),
      selected_color: color,
      round: state.index + 1
    });

    // Disable dragging during transition animation
    foodCard.style.pointerEvents = "none";
    
    target?.classList.add("hit");
    foodCard.classList.remove("pop");
    foodCard.offsetWidth; // Trigger reflow
    foodCard.classList.add("pop");

    setTimeout(() => {
      target?.classList.remove("hit");
      state.index += 1;
      
      if (state.index >= state.deck.length) {
        finishGame();
      } else {
        updateHUD();
        loadFood();
      }
    }, 520);
  }

  // Level Clear Success
  function finishGame() {
    progressFill.style.width = "100%";
    const stage = stages[state.stageIndex];
    
    // Save progress unlocks
    saveUnlockedStage(stage.id + 1);

    const isFinalStage = stage.id >= stages.length;
    resultTitle.textContent = isFinalStage ? t("allClearTitle") : t("winTitle");
    resultText.textContent = isFinalStage ? t("allClearDesc") : t("winDesc", { score: state.score });

    nextStageBtn.classList.toggle("hidden", isFinalStage);
    
    // Disable any interaction behind result panel
    foodCard.style.pointerEvents = "none";
    
    resultPanel.classList.remove("hidden");
    window.WonderSound?.play("win");
    
    window.WonderAnalytics?.track("game_complete", {
      game_id: GAME_ID,
      stage: stage.id,
      score: state.score,
      total_rounds: state.deck.length,
      attempts: state.attempts,
      locale: locale()
    });
  }

  // Pointer/Touch Drag & Drop Logic
  function getPoint(event) {
    const point = event.touches?.[0] || event;
    return { x: point.clientX, y: point.clientY };
  }

  function setDragPosition(x, y) {
    foodCard.style.transform = `translate(${x - state.startX}px, ${y - state.startY}px)`;
  }

  function startDrag(event) {
    if (!state.ready || foodCard.style.pointerEvents === "none") return;
    const point = getPoint(event);
    state.dragging = true;
    state.startX = point.x;
    state.startY = point.y;
    foodCard.classList.add("dragging");
    event.preventDefault();
  }

  function moveDrag(event) {
    if (!state.dragging) return;
    const point = getPoint(event);
    setDragPosition(point.x, point.y);
    event.preventDefault();
  }

  function endDrag(event) {
    if (!state.dragging) return;
    const point = getPoint(event.changedTouches?.[0] || event);
    state.dragging = false;
    foodCard.classList.remove("dragging");
    foodCard.style.transform = "";

    // Temporarily hide pointer events of foodCard to find drop target
    foodCard.style.pointerEvents = "none";
    const target = document.elementFromPoint(point.x, point.y)?.closest(".lunchbox");
    foodCard.style.pointerEvents = "";
    
    if (target) {
      submitColor(target.dataset.color, target);
    }
  }

  // Event Listeners
  foodCard.addEventListener("pointerdown", startDrag);
  window.addEventListener("pointermove", moveDrag);
  window.addEventListener("pointerup", endDrag);

  localeSelect.addEventListener("change", () => {
    window.WonderSound?.play("click");
    window.WonderI18n?.setLocale(localeSelect.value);
  });

  localeSelect.addEventListener("input", () => {
    window.WonderSound?.play("click");
    window.WonderI18n?.setLocale(localeSelect.value);
  });

  window.addEventListener("wonder:locale-change", translateStaticUI);

  againBtn.addEventListener("click", () => {
    window.WonderSound?.play("click");
    window.WonderAnalytics?.track("game_restart", {
      game_id: GAME_ID,
      stage: stages[state.stageIndex].id,
      locale: locale()
    });
    startStage(state.stageIndex);
  });

  nextStageBtn.addEventListener("click", () => {
    window.WonderSound?.play("click");
    startStage(Math.min(state.stageIndex + 1, stages.length - 1));
  });

  stageSelectBtn.addEventListener("click", () => {
    window.WonderSound?.play("click");
    showStageSelect();
  });

  // Initialization
  translateStaticUI();
  simulateLoading();

})();
