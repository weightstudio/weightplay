(function () {
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
  const againBtn = document.querySelector("#againBtn");
  const lobbyLink = document.querySelector("#lobbyLink");
  const loadingPanel = document.querySelector("#loadingPanel");
  const loadingTitle = document.querySelector("#loadingTitle");
  const loadingText = document.querySelector("#loadingText");
  const loadingFill = document.querySelector("#loadingFill");

  const GAME_ID = "campus-dash";
  const LEADERBOARD_KEY = "campusDashLeaderboard";
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
      description: "Swipe lanes, dodge safari obstacles, collect stars, and chase a local high score in Safari Dash.",
      score: "Score",
      time: "Time",
      combo: "Combo",
      startTitle: "Pick a lane. Dash fast.",
      startText: "Tap the left or right side, or swipe, to dodge between the three lanes.",
      controlTap: "Tap left / right",
      controlSwipe: "Swipe lanes",
      controlKeyboard: "A/D or Left/Right",
      start: "Start",
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
    },
    "zh-Hant": {
      title: "\u8349\u539f\u9583\u96fb\u8dd1",
      language: "\u8a9e\u8a00",
      backToLobby: "\u8fd4\u56de WeightPlay \u5927\u5ef3",
      controls: "\u64cd\u4f5c\u65b9\u5f0f",
      backToMenu: "\u8fd4\u56de\u9078\u55ae",
      gameLabel: "\u8349\u539f\u9583\u96fb\u8dd1\u904a\u6232",
      description: "\u5728\u4e09\u689d\u8dd1\u9053\u4e4b\u9593\u9583\u907f\u8349\u539f\u969c\u7919\u3001\u6536\u96c6\u661f\u661f\uff0c\u6311\u6230\u672c\u6a5f\u6700\u9ad8\u5206\u3002",
      score: "\u5206\u6578",
      time: "\u6642\u9593",
      combo: "\u9023\u64ca",
      startTitle: "\u9078\u597d\u8dd1\u9053\uff0c\u5feb\u901f\u885d\u523a\u3002",
      startText: "\u9ede\u756b\u9762\u5de6\u53f3\u5074\u6216\u6ed1\u52d5\uff0c\u5728\u4e09\u689d\u8dd1\u9053\u9593\u9583\u907f\u969c\u7919\u3002",
      controlTap: "\u9ede\u5de6\u908a / \u53f3\u908a",
      controlSwipe: "\u5de6\u53f3\u6ed1\u52d5",
      controlKeyboard: "A/D \u6216 \u2190/\u2192",
      start: "\u958b\u59cb",
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
    },
  };
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
  let pointerStartX = null;
  let activePointerId = null;

  function clearPointerInput() {
    if (activePointerId !== null) {
      try { canvas.releasePointerCapture?.(activePointerId); } catch { /* Capture may already be gone. */ }
    }
    pointerStartX = null;
    activePointerId = null;
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
    return {
      running: false,
      finished: false,
      lane: 1,
      targetLane: 1,
      x: lanes[1],
      y: H - 155,
      timeLeft: 60,
      score: 0,
      combo: 1,
      bestCombo: 0,
      laneChanges: 0,
      coinsCollected: 0,
      obstaclesHit: 0,
      speed: 390,
      spawnTimer: 0.4,
      coinTimer: 0.9,
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
    resultTitle.textContent = t("resultTitle");
    againBtn.textContent = t("again");
    lobbyLink.textContent = t("lobby");
    loadingTitle.textContent = t("loading");
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
    if (!document.body.classList.contains("dash-playing")) return;
    const viewport = window.visualViewport;
    const viewportWidth = viewport?.width || innerWidth;
    const viewportHeight = viewport?.height || innerHeight;
    document.body.classList.remove("dash-expanded-canvas");
    const scale = Math.min(Math.max(1, viewportWidth - 8) / 382, Math.max(1, viewportHeight - 8) / 780);
    const width = 382 * scale;
    const height = 780 * scale;
    document.documentElement.style.setProperty("--dash-frame-scale", String(scale));
    document.documentElement.style.setProperty("--dash-frame-left", `${(viewportWidth - width) / 2}px`);
    document.documentElement.style.setProperty("--dash-frame-top", `${Math.max(4, viewportHeight - 4 - height)}px`);
    document.documentElement.style.setProperty("--dash-frame-width", `${width}px`);
    document.documentElement.style.setProperty("--dash-frame-height", `${height}px`);
  }

  function exitSharedPlayViewport() {
    window.WeightPlayGame?.exitMobileGameMode?.();
    document.body.classList.remove("weightplay-active-viewport", "wp-mobile-game-mode");
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    if (document.webkitFullscreenElement) document.webkitExitFullscreen?.();
  }

  function showMain() {
    clearPointerInput();
    state.running = false;
    document.body.classList.remove("dash-playing", "dash-expanded-canvas");
    document.querySelector(".dash-game")?.classList.remove("is-playing");
    document.querySelector(".dash-game")?.setAttribute("data-play-viewport", "");
    mainPanel.classList.remove("hidden");
    canvasWrap.classList.add("hidden");
    hud.classList.add("hidden");
    resultPanel.classList.add("hidden");
    canvasWrap.inert = false;
    canvasWrap.removeAttribute("aria-hidden");
    requestAnimationFrame(() => startBtn.focus({ preventScroll: true }));
  }

  window.addEventListener("resize", updateDashFrame);
  window.addEventListener("orientationchange", updateDashFrame);
  window.visualViewport?.addEventListener("resize", updateDashFrame);
  window.visualViewport?.addEventListener("scroll", updateDashFrame);

  function startRun() {
    clearPointerInput();
    state = makeState();
    state.running = true;
    document.body.classList.add("dash-playing");
    document.querySelector(".dash-game")?.classList.add("is-playing");
    document.querySelector(".dash-game")?.removeAttribute("data-play-viewport");
    mainPanel.classList.add("hidden");
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
    state.x += (lanes[state.targetLane] - state.x) * Math.min(1, dt * 12);
    state.spawnTimer -= dt;
    state.coinTimer -= dt;
    state.lanePulse = Math.max(0, state.lanePulse - dt);

    if (state.spawnTimer <= 0) {
      spawnObstacle();
      state.spawnTimer = Math.max(0.38, 1.05 - (60 - state.timeLeft) * 0.009);
    }
    if (state.coinTimer <= 0) {
      spawnCoin();
      state.coinTimer = 0.9 + Math.random() * 0.45;
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
    const kinds = ["bag", "cone", "books", "puddle"];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    state.obstacles.push({ lane, x: lanes[lane], y: -90, size: 82, kind });
  }

  function spawnCoin() {
    const lane = chooseClearDropLane(-65, 138);
    if (lane < 0) return;
    state.coins.push({ lane, x: lanes[lane], y: -65, size: 42, used: false });
  }

  function chooseClearDropLane(y, clearance) {
    const candidates = [0, 1, 2].filter((lane) => {
      const drops = [...state.obstacles, ...state.coins.filter((coin) => !coin.used)];
      return drops.every((drop) => drop.lane !== lane || Math.abs(drop.y - y) >= clearance);
    });
    if (!candidates.length) return -1;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function checkCollisions() {
    const heroBox = { x: state.x - 40, y: state.y - 54, w: 80, h: 108 };
    for (const obstacle of state.obstacles) {
      if (overlaps(heroBox, { x: obstacle.x - 38, y: obstacle.y - 38, w: 76, h: 76 })) {
        obstacle.y = H + 100;
        state.score = Math.max(0, state.score - 80);
        state.combo = 1;
        state.obstaclesHit += 1;
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
    resultTitle.textContent = t("resultTitle");
    resultText.textContent = t("resultText", { score: state.score, best });
    renderSkillReport(previousBest);
    renderLeaderboard();
    canvasWrap.inert = true;
    canvasWrap.setAttribute("aria-hidden", "true");
    resultPanel.classList.remove("hidden");
    requestAnimationFrame(() => againBtn.focus({ preventScroll: true }));
    window.WonderSound?.play("win");
    window.WonderAnalytics?.track("game_complete", {
      game_id: GAME_ID,
      score: state.score,
      locale: locale(),
    });
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
      getState: () => ({ running: state.running, lane: state.targetLane, score: state.score, time: state.timeLeft, laneChanges: state.laneChanges, coinsCollected: state.coinsCollected, obstaclesHit: state.obstaclesHit, bestCombo: state.bestCombo }),
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
      return JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function saveScore(score) {
    const scores = [...getScores(), score].sort((a, b) => b - a).slice(0, 5);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(scores));
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
      resultText.textContent = t("resultText", { score: state.score, best: getScores()[0] || state.score });
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
  startBtn.addEventListener("click", startRun);
  battleBackBtn.addEventListener("click", showMain);
  homeLink.addEventListener("click", (event) => {
    if (!document.body.classList.contains("dash-playing")) return;
    event.preventDefault();
    showMain();
  });
  againBtn.addEventListener("click", () => {
    window.WonderAnalytics?.track("game_restart", { game_id: GAME_ID, score: state.score, locale: locale() });
    startRun();
  });
  canvas.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (!state.running || !["arrowleft", "arrowright", "a", "d"].includes(key)) return;
    event.preventDefault();
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
  window.addEventListener("pagehide", clearPointerInput);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearPointerInput();
    else if (state.running) lastTime = performance.now();
  });

  renderStaticText();
  updateHud();
  exposeSmokeHooks();
  preloadGame();
})();
