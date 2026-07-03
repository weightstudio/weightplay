(() => {
  const GAME_ID = "fruit-merge";
  const BEST_KEY = "fruitMergeBestScore";
  const PROGRESS_KEY = "weightplay_fruit_merge_progress";
  const LEADERBOARD_KEY = "weightplay_fruit_merge_leaderboard";
  const canvas = document.querySelector("#gameCanvas");
  const ctx = canvas.getContext("2d");
  const localeSelect = document.querySelector("#localeSelect");
  const titleText = document.querySelector("#titleText");
  const languageLabel = document.querySelector("#languageLabel");
  const scoreLabel = document.querySelector("#scoreLabel");
  const bestLabel = document.querySelector("#bestLabel");
  const nextLabel = document.querySelector("#nextLabel");
  const scoreText = document.querySelector("#scoreText");
  const bestText = document.querySelector("#bestText");
  const nextFruitText = document.querySelector("#nextFruitText");
  const largestLabel = document.querySelector("#largestLabel");
  const largestFruitText = document.querySelector("#largestFruitText");
  const largestFruitToken = document.querySelector("#largestFruitToken");
  const goalText = document.querySelector("#goalText");
  const goalFill = document.querySelector("#goalFill");
  const dropBtn = document.querySelector("#dropBtn");
  const restartBtn = document.querySelector("#restartBtn");
  const startBtn = document.querySelector("#startBtn");
  const menuPanel = document.querySelector("#menuPanel");
  const menuTitle = document.querySelector("#menuTitle");
  const menuDesc = document.querySelector("#menuDesc");
  const resultPanel = document.querySelector("#resultPanel");
  const resultTitle = document.querySelector("#resultTitle");
  const resultText = document.querySelector("#resultText");
  const menuLeaderboard = document.querySelector("#menuLeaderboard");
  const resultLeaderboard = document.querySelector("#resultLeaderboard");
  const playAgainBtn = document.querySelector("#playAgainBtn");
  const lobbyLink = document.querySelector("#lobbyLink");
  const loadingPanel = document.querySelector("#loadingPanel");
  const loadingText = document.querySelector("#loadingText");
  const loadingFill = document.querySelector("#loadingFill");
  const toast = document.querySelector("#toast");

  const W = canvas.width;
  const H = canvas.height;
  const wallLeft = 44;
  const wallRight = W - 44;
  const floorY = H - 42;
  const dangerY = 164;
  const dropY = 122;
  const Matter = window.Matter;
  const Engine = Matter?.Engine;
  const World = Matter?.World;
  const Bodies = Matter?.Bodies;
  const Body = Matter?.Body;

  const dictionary = {
    en: {
      title: "Animal Merge Tower",
      language: "Language",
      score: "Score",
      best: "Best",
      next: "Next",
      largest: "Largest",
      goal: "Goal: {name}",
      bestAnimal: "Best Animal {name}",
      combo: "Combo x{count}!",
      drop: "Drop",
      restart: "Restart",
      menuTitle: "Merge to the Lion King",
      menuDesc: "Drop animal balls carefully. Matching animals merge into the next bigger animal. Keep the tower below the red line.",
      start: "Start",
      gameOver: "Game Over",
      result: "Score {score}  Best {best}",
      resultScore: "Score {score}",
      previousBest: "Previous Best {score}",
      todayScore: "Today's Score {score}",
      improvement: "Improvement {value}%",
      skillReport: "Skill Report",
      logicSkill: "Logic",
      problemSolvingSkill: "Problem Solving",
      coordinationSkill: "Hand-Eye Coordination",
      progressNewBest: "Amazing progress! You improved your best score.",
      progressImproved: "Great progress! You improved from your last best.",
      progressSteady: "Good effort! Try again to improve planning and placement.",
      progressNote: "Scores are for fun and local progress tracking only.",
      leaderboardTitle: "Your Best Runs",
      noLeaderboard: "Play once to start your local best-run list.",
      leaderboardRow: "#{rank}  Score {score}  {animal}",
      playAgain: "Play Again",
      lobby: "Lobby",
      newBest: "New Best!",
      fruit0: "Mouse Ball",
      fruit1: "Rabbit Ball",
      fruit2: "Fox Ball",
      fruit3: "Penguin Ball",
      fruit4: "Koala Ball",
      fruit5: "Owl Ball",
      fruit6: "Panda Ball",
      fruit7: "Lion Cub Ball",
      fruit8: "Giraffe Ball",
      fruit9: "Elephant Ball",
      fruit10: "Lion King Ball",
    },
    "zh-Hant": {
      title: "動物合成塔",
      language: "語言",
      score: "分數",
      best: "最佳",
      next: "下一顆",
      largest: "最大合成",
      goal: "目標：{name}",
      bestAnimal: "最佳動物 {name}",
      combo: "連續合成 x{count}！",
      drop: "落下",
      restart: "重新開始",
      menuTitle: "一路合成到獅王",
      menuDesc: "小心落下動物球。相同動物會合成下一個更大的動物，別讓塔超過紅線。",
      start: "開始",
      gameOver: "遊戲結束",
      result: "分數 {score}  最佳 {best}",
      resultScore: "分數 {score}",
      previousBest: "之前最佳 {score}",
      todayScore: "本次分數 {score}",
      improvement: "進步 {value}%",
      skillReport: "能力報告",
      logicSkill: "邏輯",
      problemSolvingSkill: "問題解決",
      coordinationSkill: "手眼協調",
      progressNewBest: "太棒了！你突破了自己的最佳分數。",
      progressImproved: "很棒的進步！你比之前更會安排落點了。",
      progressSteady: "做得很好！再試一次，練習更好的放置位置。",
      progressNote: "分數只用於遊戲樂趣與本機進步紀錄。",
      leaderboardTitle: "你的最佳挑戰",
      noLeaderboard: "玩一場後，這裡會記錄你的本機最佳成績。",
      leaderboardRow: "第 {rank} 名  分數 {score}  {animal}",
      playAgain: "再玩一次",
      lobby: "大廳",
      newBest: "新紀錄！",
      fruit0: "老鼠球",
      fruit1: "兔兔球",
      fruit2: "狐狸球",
      fruit3: "企鵝球",
      fruit4: "無尾熊球",
      fruit5: "貓頭鷹球",
      fruit6: "熊貓球",
      fruit7: "小獅子球",
      fruit8: "長頸鹿球",
      fruit9: "大象球",
      fruit10: "獅王球",
    },  };

  const imageLoadTasks = [];

  function loadImage(src) {
    const image = new Image();
    image.decoding = "async";
    imageLoadTasks.push(new Promise((resolve) => {
      image.onload = image.onerror = resolve;
    }));
    image.src = src;
    return image;
  }

  const fruits = [
    { radius: 28, color: "#4854d9", accent: "#91a3ff", score: 2 },
    { radius: 34, color: "#d93652", accent: "#ff94a7", score: 4 },
    { radius: 42, color: "#ff4d63", accent: "#ffd35d", score: 8 },
    { radius: 52, color: "#7a4ce0", accent: "#c5a5ff", score: 14 },
    { radius: 64, color: "#ff9438", accent: "#ffd28a", score: 22 },
    { radius: 76, color: "#e83f4b", accent: "#ffac8a", score: 34 },
    { radius: 90, color: "#a8d957", accent: "#f4ff9e", score: 52 },
    { radius: 106, color: "#ffb182", accent: "#ffe0c8", score: 78 },
    { radius: 122, color: "#f5b43b", accent: "#75c95b", score: 118 },
    { radius: 142, color: "#8fd94f", accent: "#fff28a", score: 176 },
    { radius: 166, color: "#2fbd65", accent: "#1d8b45", score: 300 },
  ];

  const tokenSources = [
    "../../assets/animal-merge-token-0.png",
    "../../assets/animal-merge-token-1.png",
    "../../assets/animal-merge-token-2.png",
    "../../assets/animal-merge-token-3.png",
    "../../assets/animal-merge-token-4.png",
    "../../assets/animal-merge-token-5.png",
    "../../assets/animal-merge-token-6.png",
    "../../assets/animal-merge-token-7.png",
    "../../assets/animal-merge-token-8.png",
    "../../assets/animal-merge-token-9.png",
    "../../assets/animal-merge-token-10.png",
  ];
  const tokenImages = tokenSources.map((src) => loadImage(src));

  let fruitId = 1;
  let fruitsOnBoard = [];
  let currentLevel = 0;
  let nextLevel = 0;
  let maxReachedLevel = 0;
  let mergeBursts = [];
  let aimX = W / 2;
  let score = 0;
  let mergeCount = 0;
  let comboCount = 0;
  let comboUntil = 0;
  let bestScore = Number(localStorage.getItem(BEST_KEY) || 0);
  let running = false;
  let gameOver = false;
  let canDropAt = 0;
  let lastTime = performance.now();
  let toastTimer = null;
  let engine = null;
  let world = null;

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

  function applyText() {
    document.documentElement.lang = locale();
    titleText.textContent = t("title");
    languageLabel.textContent = t("language");
    scoreLabel.textContent = t("score");
    bestLabel.textContent = t("best");
    nextLabel.textContent = t("next");
    dropBtn.textContent = t("drop");
    restartBtn.textContent = t("restart");
    menuTitle.textContent = t("menuTitle");
    menuDesc.textContent = t("menuDesc");
    startBtn.textContent = t("start");
    playAgainBtn.textContent = t("playAgain");
    lobbyLink.textContent = t("lobby");
    updateHud();
    renderLeaderboard(menuLeaderboard, readLeaderboard());
    renderLeaderboard(resultLeaderboard, readLeaderboard());
  }

  function setLocale(value) {
    window.WonderI18n?.setLocale?.(value);
    applyText();
  }

  function updateLoadingProgress(percent) {
    const value = Math.max(0, Math.min(100, Math.round(percent)));
    if (loadingText) loadingText.textContent = `${value}%`;
    if (loadingFill) loadingFill.style.width = `${value}%`;
  }

  function preloadGameImages() {
    const total = Math.max(1, imageLoadTasks.length);
    let loaded = 0;
    updateLoadingProgress(0);
    return Promise.all(imageLoadTasks.map((task) => task.then(() => {
      loaded += 1;
      updateLoadingProgress((loaded / total) * 100);
    })));
  }

  function randomNextLevel() {
    const poolMax = score > 900 ? 4 : score > 320 ? 3 : 2;
    return Math.floor(Math.random() * (poolMax + 1));
  }

  function resetGame(showMenu = false, source = "menu") {
    initPhysicsWorld();
    fruitsOnBoard = [];
    currentLevel = randomNextLevel();
    nextLevel = randomNextLevel();
    maxReachedLevel = currentLevel;
    mergeBursts = [];
    aimX = W / 2;
    score = 0;
    mergeCount = 0;
    comboCount = 0;
    comboUntil = 0;
    fruitId = 1;
    running = !showMenu;
    gameOver = false;
    canDropAt = performance.now() + 300;
    document.body.classList.toggle("fruit-playing", !showMenu);
    resultPanel.classList.add("hidden");
    menuPanel.classList.toggle("hidden", !showMenu);
    updateHud();
    if (!showMenu) {
      window.WonderAnalytics?.track?.("game_start", { game_id: GAME_ID, source });
    }
  }

  function updateHud() {
    scoreText.textContent = score;
    bestText.textContent = bestScore;
    nextFruitText.innerHTML = animalTokenMarkup(nextLevel);
    nextFruitText.setAttribute("aria-label", t(`fruit${nextLevel}`));
    nextFruitText.title = t(`fruit${nextLevel}`);
    largestLabel.textContent = t("largest");
    largestFruitText.textContent = t(`fruit${maxReachedLevel}`);
    largestFruitToken.innerHTML = animalTokenMarkup(maxReachedLevel);
    largestFruitToken.setAttribute("aria-label", t(`fruit${maxReachedLevel}`));
    goalText.textContent = t("goal", { name: t("fruit10") });
    goalFill.style.width = `${Math.round((maxReachedLevel / (fruits.length - 1)) * 100)}%`;
  }

  function dropFruit() {
    if (!running || gameOver || performance.now() < canDropAt) return;
    const spec = fruits[currentLevel];
    const x = clamp(aimX, wallLeft + spec.radius, wallRight - spec.radius);
    const fruit = {
      id: fruitId++,
      level: currentLevel,
      x,
      y: dropY,
      vx: 0,
      vy: 0,
      radius: spec.radius,
      angle: 0,
      merging: false,
      bornAt: performance.now(),
    };
    fruit.body = createFruitBody(fruit);
    fruitsOnBoard.push(fruit);
    maxReachedLevel = Math.max(maxReachedLevel, currentLevel);
    World.add(world, fruit.body);
    currentLevel = nextLevel;
    nextLevel = randomNextLevel();
    canDropAt = performance.now() + 520;
    window.WonderSound?.play?.("click");
    updateHud();
  }

  function initPhysicsWorld() {
    if (!Matter) {
      showToast("Physics loading failed");
      return;
    }
    engine = Engine.create({
      enableSleeping: true,
      positionIterations: 12,
      velocityIterations: 10,
      constraintIterations: 4,
    });
    world = engine.world;
    engine.gravity.y = 1.45;

    const wallOptions = {
      isStatic: true,
      restitution: 0.02,
      friction: 1,
      render: { visible: false },
    };
    World.add(world, [
      Bodies.rectangle(wallLeft - 18, H / 2, 36, H, wallOptions),
      Bodies.rectangle(wallRight + 18, H / 2, 36, H, wallOptions),
      Bodies.rectangle(W / 2, floorY + 18, wallRight - wallLeft + 72, 36, wallOptions),
    ]);
  }

  function createFruitBody(fruit, velocity = { x: 0, y: 0 }) {
    const body = Bodies.circle(fruit.x, fruit.y, fruit.radius, {
      label: "fruit",
      restitution: 0.04,
      friction: 0.96,
      frictionStatic: 1.2,
      frictionAir: 0.018,
      density: 0.0012,
      sleepThreshold: 72,
      slop: 0.01,
    });
    body.fruitId = fruit.id;
    Body.setVelocity(body, velocity);
    return body;
  }

  function syncFruitsFromBodies() {
    for (const fruit of fruitsOnBoard) {
      if (!fruit.body) continue;
      fruit.x = fruit.body.position.x;
      fruit.y = fruit.body.position.y;
      fruit.vx = fruit.body.velocity.x * 60;
      fruit.vy = fruit.body.velocity.y * 60;
      fruit.angle = fruit.body.angle;
      fruit.sleeping = fruit.body.isSleeping;
    }
  }

  function step(dt) {
    Engine.update(engine, Math.min(33.33, dt * 1000));
    syncFruitsFromBodies();
    resolveMerges();
    syncFruitsFromBodies();
    updateMergeBursts(dt);
    checkGameOver(dt);
  }

  function resolveMerges() {
    const removeIds = new Set();
    const additions = [];
    for (let i = 0; i < fruitsOnBoard.length; i += 1) {
      for (let j = i + 1; j < fruitsOnBoard.length; j += 1) {
        const a = fruitsOnBoard[i];
        const b = fruitsOnBoard[j];
        if (removeIds.has(a.id) || removeIds.has(b.id) || a.level !== b.level || a.level >= fruits.length - 1) continue;
        if (!shouldMerge(a, b)) continue;
        const next = fruits[a.level + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 1;
        const nx = dx / dist;
        const ny = dy / dist;
        const velocityA = a.body?.velocity || { x: a.vx / 60, y: a.vy / 60 };
        const velocityB = b.body?.velocity || { x: b.vx / 60, y: b.vy / 60 };
        const relativeVx = (velocityB.x - velocityA.x) * 60;
        const relativeVy = (velocityB.y - velocityA.y) * 60;
        const impact = Math.min(420, Math.max(90, Math.abs(relativeVx * nx + relativeVy * ny) + Math.hypot(relativeVx, relativeVy) * 0.28));
        const mergedVelocity = {
          x: (velocityA.x + velocityB.x) * 0.46 + nx * impact * 0.0025,
          y: Math.min((velocityA.y + velocityB.y) * 0.42 + ny * impact * 0.0018, 5.2),
        };
        const merged = {
          id: fruitId++,
          level: a.level + 1,
          x: clamp((a.x + b.x) / 2, wallLeft + next.radius, wallRight - next.radius),
          y: Math.min((a.y + b.y) / 2, floorY - next.radius),
          vx: mergedVelocity.x * 60,
          vy: mergedVelocity.y * 60,
          radius: next.radius,
          angle: (a.angle + b.angle) / 2,
          pop: 0.24,
          bornAt: performance.now(),
        };
        if (a.body) World.remove(world, a.body);
        if (b.body) World.remove(world, b.body);
        merged.body = createFruitBody(merged, mergedVelocity);
        Body.setAngle(merged.body, merged.angle);
        World.add(world, merged.body);
        removeIds.add(a.id);
        removeIds.add(b.id);
        additions.push(merged);
        spawnMergeBurst(merged.x, merged.y, next.color, impact);
        addMergeScore(next.score);
        mergeCount += 1;
        maxReachedLevel = Math.max(maxReachedLevel, merged.level);
        if (merged.level === fruits.length - 1) showToast(t("fruit10"));
        window.WonderSound?.play?.("success");
        break;
      }
    }
    if (!removeIds.size) return;
    fruitsOnBoard = fruitsOnBoard.filter((fruit) => !removeIds.has(fruit.id)).concat(additions);
    updateHud();
  }

  function addMergeScore(baseScore) {
    const now = performance.now();
    comboCount = now <= comboUntil ? comboCount + 1 : 1;
    comboUntil = now + 2200;
    const multiplier = Math.min(5, comboCount);
    score += baseScore * multiplier;
    if (multiplier > 1) showToast(t("combo", { count: multiplier }));
  }

  function shouldMerge(a, b) {
    if (a.level !== b.level || a.level >= fruits.length - 1) return false;
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    const mergeDistance = a.radius + b.radius + 3;
    return dist <= mergeDistance;
  }

  function spawnMergeBurst(x, y, color, impact) {
    mergeBursts.push({ x, y, color, life: 0.34, maxLife: 0.34, impact });
  }

  function updateMergeBursts(dt) {
    for (const fruit of fruitsOnBoard) {
      if (fruit.pop > 0) fruit.pop = Math.max(0, fruit.pop - dt);
    }
    mergeBursts = mergeBursts
      .map((burst) => ({ ...burst, life: burst.life - dt }))
      .filter((burst) => burst.life > 0);
  }

  function checkGameOver(dt) {
    let dangerTime = 0;
    for (const fruit of fruitsOnBoard) {
      const old = fruit.dangerTime || 0;
      const age = performance.now() - fruit.bornAt;
      const topAboveLine = fruit.y - fruit.radius < dangerY;
      const notFreshDrop = age > 1800;
      const stableEnough = fruit.sleeping || Math.hypot(fruit.vx, fruit.vy) < 135 || fruit.vy < 70;
      fruit.dangerTime = topAboveLine && notFreshDrop && stableEnough ? old + dt : 0;
      dangerTime = Math.max(dangerTime, fruit.dangerTime);
    }
    if (dangerTime > 0.9) endGame();
  }

  function endGame() {
    if (gameOver) return;
    running = false;
    gameOver = true;
    document.body.classList.remove("fruit-playing");
    const previousBest = bestScore;
    const newBest = score > previousBest;
    if (newBest) {
      bestScore = score;
      localStorage.setItem(BEST_KEY, String(bestScore));
      showToast(t("newBest"));
    }
    const progress = saveProgress(score, previousBest, bestScore);
    const leaderboard = recordLeaderboard(score, maxReachedLevel);
    resultTitle.textContent = t("gameOver");
    renderResultReport(progress, newBest);
    renderLeaderboard(resultLeaderboard, leaderboard);
    resultPanel.classList.remove("hidden");
    window.WonderAnalytics?.track?.("game_complete", { game_id: GAME_ID, score, best_score: bestScore, new_best: newBest, cleared: false });
    window.WonderAnalytics?.track?.("score_game_over", { game_id: GAME_ID, score, best_score: bestScore });
    updateHud();
  }

  function readProgress() {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveProgress(finalScore, previousBest, currentBest) {
    const old = readProgress();
    const improvementPercent = previousBest > 0 ? Math.round(((finalScore - previousBest) / previousBest) * 100) : 0;
    const progress = {
      lastScore: finalScore,
      bestScore: currentBest,
      playCount: (Number(old.playCount) || 0) + 1,
      lastPlayedAt: new Date().toISOString(),
      improvementPercent,
      maxReachedLevel,
      highestLevel: Math.max(Number(old.highestLevel) || 0, maxReachedLevel),
      skillScores: buildSkillScores(finalScore),
    };
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch {
      // Local progress is optional.
    }
    return { ...progress, previousBest };
  }

  function readLeaderboard() {
    try {
      const rows = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || "[]");
      return Array.isArray(rows) ? rows : [];
    } catch {
      return [];
    }
  }

  function recordLeaderboard(finalScore, level) {
    const rows = readLeaderboard();
    rows.push({
      score: finalScore,
      highestLevel: level,
      playedAt: new Date().toISOString(),
    });
    const topRows = rows
      .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
      .slice(0, 5);
    try {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topRows));
    } catch {
      // Local leaderboard is optional.
    }
    return topRows;
  }

  function renderLeaderboard(target, rows) {
    if (!target) return;
    target.replaceChildren();
    const title = document.createElement("strong");
    title.textContent = t("leaderboardTitle");
    target.appendChild(title);
    if (!rows.length) {
      const empty = document.createElement("span");
      empty.textContent = t("noLeaderboard");
      target.appendChild(empty);
      return;
    }
    rows.slice(0, 5).forEach((row, index) => {
      const item = document.createElement("span");
      item.textContent = t("leaderboardRow", {
        rank: index + 1,
        score: Number(row.score || 0),
        animal: t(`fruit${clamp(Number(row.highestLevel) || 0, 0, fruits.length - 1)}`),
      });
      target.appendChild(item);
    });
  }

  function buildSkillScores(finalScore) {
    const maxLevel = fruitsOnBoard.reduce((value, fruit) => Math.max(value, fruit.level || 0), 0);
    return {
      logic: clamp(1 + Math.floor(maxLevel / 2), 1, 5),
      problemSolving: clamp(1 + Math.floor(finalScore / 220), 1, 5),
      coordination: clamp(1 + Math.floor(mergeCount / 4), 1, 5),
    };
  }

  function renderStars(value) {
    return "★".repeat(value) + "☆".repeat(5 - value);
  }

  function renderResultReport(progress, newBest) {
    resultText.replaceChildren();

    const summary = document.createElement("p");
    summary.className = "result-summary";
    summary.textContent = t("result", { score: progress.lastScore, best: progress.bestScore });
    resultText.appendChild(summary);

    const stats = document.createElement("div");
    stats.className = "result-stats";
    [
      t("todayScore", { score: progress.lastScore }),
      t("previousBest", { score: progress.previousBest }),
      t("improvement", { value: Math.max(0, progress.improvementPercent) }),
      t("bestAnimal", { name: t(`fruit${progress.highestLevel}`) }),
    ].forEach((item) => {
      const chip = document.createElement("span");
      chip.textContent = item;
      stats.appendChild(chip);
    });
    resultText.appendChild(stats);

    const report = document.createElement("section");
    report.className = "skill-report";
    const title = document.createElement("strong");
    title.textContent = t("skillReport");
    report.appendChild(title);
    [
      [t("logicSkill"), progress.skillScores.logic],
      [t("problemSolvingSkill"), progress.skillScores.problemSolving],
      [t("coordinationSkill"), progress.skillScores.coordination],
    ].forEach(([name, value]) => {
      const row = document.createElement("div");
      row.className = "skill-row";
      const label = document.createElement("span");
      label.textContent = name;
      const stars = document.createElement("b");
      stars.textContent = renderStars(value);
      row.append(label, stars);
      report.appendChild(row);
    });
    resultText.appendChild(report);

    const message = document.createElement("p");
    message.className = "result-encouragement";
    message.textContent = newBest ? t("progressNewBest") : progress.improvementPercent > 0 ? t("progressImproved") : t("progressSteady");
    resultText.appendChild(message);

    const note = document.createElement("small");
    note.textContent = t("progressNote");
    resultText.appendChild(note);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawBoard();
    for (const fruit of fruitsOnBoard) drawFruit(fruit);
    drawMergeBursts();
    if (running && !gameOver) drawDropPreview();
  }

  function drawBoard() {
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, "#eaf7ff");
    gradient.addColorStop(1, "#fff8dc");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#29364d";
    roundRect(ctx, wallLeft - 18, 82, 18, floorY - 70, 8);
    ctx.fill();
    roundRect(ctx, wallRight, 82, 18, floorY - 70, 8);
    ctx.fill();
    roundRect(ctx, wallLeft - 18, floorY, wallRight - wallLeft + 36, 26, 8);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 77, 99, 0.78)";
    ctx.lineWidth = 6;
    ctx.setLineDash([20, 16]);
    ctx.beginPath();
    ctx.moveTo(wallLeft, dangerY);
    ctx.lineTo(wallRight, dangerY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(41, 54, 77, 0.72)";
    ctx.font = "900 24px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(t("next"), W / 2, 42);
  }

  function drawDropPreview() {
    const spec = fruits[currentLevel];
    const x = clamp(aimX, wallLeft + spec.radius, wallRight - spec.radius);
    ctx.strokeStyle = "rgba(41, 54, 77, 0.24)";
    ctx.lineWidth = 4;
    ctx.setLineDash([12, 12]);
    ctx.beginPath();
    ctx.moveTo(x, dropY - 42);
    ctx.lineTo(x, floorY);
    ctx.stroke();
    ctx.setLineDash([]);
    drawFruit({ level: currentLevel, x, y: dropY, radius: spec.radius, angle: 0, preview: true });
  }

  function drawFruit(fruit) {
    const spec = fruits[fruit.level];
    const image = tokenImages[fruit.level];
    ctx.save();
    ctx.globalAlpha = fruit.preview ? 0.72 : 1;
    ctx.translate(fruit.x, fruit.y);
    const popScale = fruit.pop ? 1 + Math.sin((fruit.pop / 0.24) * Math.PI) * 0.12 : 1;
    ctx.scale(popScale, popScale);
    ctx.rotate(fruit.angle || 0);

    if (image?.complete && image.naturalWidth) {
      const size = fruit.radius * 2.12;
      ctx.drawImage(image, -size / 2, -size / 2, size, size);
    } else {
      const gradient = ctx.createRadialGradient(-fruit.radius * 0.34, -fruit.radius * 0.42, fruit.radius * 0.12, 0, 0, fruit.radius);
      gradient.addColorStop(0, spec.accent);
      gradient.addColorStop(0.48, spec.color);
      gradient.addColorStop(1, "rgba(23, 32, 51, 0.42)");
      ctx.beginPath();
      ctx.arc(0, 0, fruit.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    ctx.globalAlpha *= 0.18;
    ctx.beginPath();
    ctx.ellipse(-fruit.radius * 0.32, -fruit.radius * 0.36, fruit.radius * 0.2, fruit.radius * 0.11, -0.45, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();

    ctx.restore();
  }

  function drawMergeBursts() {
    for (const burst of mergeBursts) {
      const progress = 1 - burst.life / burst.maxLife;
      const radius = 28 + progress * (70 + burst.impact * 0.05);
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - progress);
      ctx.strokeStyle = burst.color;
      ctx.lineWidth = 8 * (1 - progress) + 2;
      ctx.beginPath();
      ctx.arc(burst.x, burst.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha *= 0.65;
      ctx.fillStyle = burst.color;
      for (let i = 0; i < 8; i += 1) {
        const angle = (i / 8) * Math.PI * 2;
        const px = burst.x + Math.cos(angle) * radius * 0.9;
        const py = burst.y + Math.sin(angle) * radius * 0.9;
        ctx.beginPath();
        ctx.arc(px, py, 5 * (1 - progress) + 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function animalTokenMarkup(level) {
    return `<img src="${tokenSources[level]}" alt="" aria-hidden="true" />`;
  }

  function roundRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
  }

  function canvasX(event) {
    const rect = canvas.getBoundingClientRect();
    return ((event.clientX - rect.left) / rect.width) * W;
  }

  function showToast(text) {
    toast.textContent = text;
    toast.classList.remove("hidden");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add("hidden"), 900);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function loop(now) {
    const dt = Math.min(0.033, (now - lastTime) / 1000);
    lastTime = now;
    if (running && !gameOver) step(dt);
    draw();
    requestAnimationFrame(loop);
  }

  canvas.addEventListener("pointermove", (event) => {
    aimX = canvasX(event);
  });

  canvas.addEventListener("pointerdown", (event) => {
    aimX = canvasX(event);
    canvas.setPointerCapture?.(event.pointerId);
  });

  canvas.addEventListener("pointerup", (event) => {
    aimX = canvasX(event);
    dropFruit();
    canvas.releasePointerCapture?.(event.pointerId);
  });

  dropBtn.addEventListener("click", dropFruit);
  restartBtn.addEventListener("click", () => {
    window.WonderAnalytics?.track?.("game_restart", { game_id: GAME_ID, score, source: "button" });
    resetGame(false, "restart");
  });
  startBtn.addEventListener("click", () => {
    window.WonderSound?.play?.("start");
    resetGame(false, "start");
  });
  playAgainBtn.addEventListener("click", () => {
    window.WonderAnalytics?.track?.("game_restart", { game_id: GAME_ID, score, source: "result" });
    resetGame(false, "result");
  });

  localeSelect.value = locale();
  localeSelect.addEventListener("change", () => setLocale(localeSelect.value));
  window.addEventListener("wonder:locale-change", () => {
    localeSelect.value = locale();
    applyText();
  });

  applyText();
  if (!Matter) {
    showToast("Physics loading failed");
    loadingPanel.classList.add("hidden");
    return;
  }
  preloadGameImages().then(() => {
    resetGame(true);
    loadingPanel.classList.add("hidden");
    window.WonderAnalytics?.track?.("game_ready", { game_id: GAME_ID });
    requestAnimationFrame((now) => {
      lastTime = now;
      loop(now);
    });
  });
})();
