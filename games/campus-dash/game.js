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
  const startTitle = document.querySelector("#startTitle");
  const startText = document.querySelector("#startText");
  const startBtn = document.querySelector("#startBtn");
  const resultPanel = document.querySelector("#resultPanel");
  const resultTitle = document.querySelector("#resultTitle");
  const resultText = document.querySelector("#resultText");
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
      score: "Score",
      time: "Time",
      combo: "Combo",
      startTitle: "Pick a lane. Dash fast.",
      startText: "Tap the left or right side, or swipe, to dodge between the three lanes.",
      start: "Start",
      resultTitle: "Run Complete!",
      resultText: "Score {score}  Best {best}",
      again: "Run Again",
      lobby: "Lobby",
      loading: "Loading",
      leaderboard: "Local Top 5",
      emptyRank: "No runs yet",
    },
    "zh-Hant": {
      title: "草原閃電跑",
      language: "語言",
      score: "分數",
      time: "時間",
      combo: "連擊",
      startTitle: "選擇路線，快速衝刺。",
      startText: "點左邊或右邊，也可以滑動，在三條路線之間閃避障礙。",
      start: "開始",
      resultTitle: "奔跑完成！",
      resultText: "分數 {score}  最佳 {best}",
      again: "再跑一次",
      lobby: "大廳",
      loading: "載入中",
      leaderboard: "本機前 5 名",
      emptyRank: "還沒有紀錄",
    },
  };

  function loadImage(src) {
    const image = new Image();
    image.src = src;
    return image;
  }

  const sprites = {
    hero: loadImage("../../assets/campus-dash-runner.svg"),
    coin: loadImage("../../assets/campus-dash-coin.svg"),
    cone: loadImage("../../assets/campus-dash-cone.svg"),
    bag: loadImage("../../assets/campus-dash-bag.svg"),
    books: loadImage("../../assets/campus-dash-books.svg"),
    puddle: loadImage("../../assets/campus-dash-puddle.svg"),
  };

  let state = makeState();
  let lastTime = 0;
  let pointerStartX = null;

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
      speed: 390,
      spawnTimer: 0.4,
      coinTimer: 0.9,
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
    scoreLabel.textContent = t("score");
    timeLabel.textContent = t("time");
    comboLabel.textContent = t("combo");
    startTitle.textContent = t("startTitle");
    startText.textContent = t("startText");
    startBtn.textContent = t("start");
    resultTitle.textContent = t("resultTitle");
    againBtn.textContent = t("again");
    lobbyLink.textContent = t("lobby");
    loadingTitle.textContent = t("loading");
  }

  function preloadGame() {
    let percent = 0;
    const timer = setInterval(() => {
      percent += 25;
      loadingText.textContent = `${Math.min(100, percent)}%`;
      loadingFill.style.width = `${Math.min(100, percent)}%`;
      if (percent >= 100) {
        clearInterval(timer);
        loadingPanel.classList.add("hidden");
        draw();
        window.WonderAnalytics?.track("game_ready", { game_id: GAME_ID });
      }
    }, 80);
  }

  function startRun() {
    state = makeState();
    state.running = true;
    startPanel.classList.add("hidden");
    resultPanel.classList.add("hidden");
    hud.classList.remove("hidden");
    lastTime = performance.now();
    window.WonderSound?.play("click");
    window.WonderAnalytics?.track("game_start", { game_id: GAME_ID, locale: locale() });
    requestAnimationFrame(loop);
  }

  function loop(now) {
    const dt = Math.min(0.033, (now - lastTime) / 1000 || 0);
    lastTime = now;
    update(dt);
    draw();
    if (state.running) requestAnimationFrame(loop);
  }

  function update(dt) {
    state.timeLeft = Math.max(0, state.timeLeft - dt);
    state.speed += dt * 6;
    state.x += (lanes[state.targetLane] - state.x) * Math.min(1, dt * 12);
    state.spawnTimer -= dt;
    state.coinTimer -= dt;

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
    const lane = Math.floor(Math.random() * 3);
    const kinds = ["bag", "cone", "books", "puddle"];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    state.obstacles.push({ lane, x: lanes[lane], y: -90, size: 82, kind });
  }

  function spawnCoin() {
    const lane = Math.floor(Math.random() * 3);
    state.coins.push({ lane, x: lanes[lane], y: -65, size: 42, used: false });
  }

  function checkCollisions() {
    const heroBox = { x: state.x - 40, y: state.y - 54, w: 80, h: 108 };
    for (const obstacle of state.obstacles) {
      if (overlaps(heroBox, { x: obstacle.x - 38, y: obstacle.y - 38, w: 76, h: 76 })) {
        obstacle.y = H + 100;
        state.score = Math.max(0, state.score - 80);
        state.combo = 1;
        addSpark(state.x, state.y - 60, "-80", "#ef4444");
        window.WonderSound?.play("wrong");
      }
    }
    for (const coin of state.coins) {
      if (!coin.used && overlaps(heroBox, { x: coin.x - 26, y: coin.y - 26, w: 52, h: 52 })) {
        coin.used = true;
        state.score += 50 * state.combo;
        state.combo = Math.min(9, state.combo + 1);
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
    state.targetLane = Math.max(0, Math.min(2, state.targetLane + delta));
    window.WonderSound?.play("click");
  }

  function finishRun() {
    state.running = false;
    state.finished = true;
    hud.classList.add("hidden");
    saveScore(state.score);
    const best = getScores()[0] || state.score;
    resultTitle.textContent = t("resultTitle");
    resultText.textContent = t("resultText", { score: state.score, best });
    renderLeaderboard();
    resultPanel.classList.remove("hidden");
    window.WonderSound?.play("win");
    window.WonderAnalytics?.track("game_complete", {
      game_id: GAME_ID,
      score: state.score,
      locale: locale(),
    });
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
    const laneColors = ["#38bdf8", "#f97316", "#22c55e"];

    for (let lane = 0; lane < 3; lane += 1) {
      const fill = ctx.createLinearGradient(0, topY, 0, H);
      fill.addColorStop(0, laneColors[lane]);
      fill.addColorStop(0.58, lane === state.targetLane ? "#fef08a" : laneColors[lane]);
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

    ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
    ctx.lineWidth = 7;
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

    drawLaneHint();
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
      ctx.drawImage(sprites.hero, -86, -112, 172, 210);
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
  startBtn.addEventListener("click", startRun);
  againBtn.addEventListener("click", () => {
    window.WonderAnalytics?.track("game_restart", { game_id: GAME_ID, score: state.score, locale: locale() });
    startRun();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") moveLane(-1);
    if (event.key === "ArrowRight") moveLane(1);
  });
  canvas.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    pointerStartX = event.clientX;
  });
  canvas.addEventListener("pointerup", (event) => {
    event.preventDefault();
    if (pointerStartX == null) return;
    const dx = event.clientX - pointerStartX;
    if (Math.abs(dx) > 24) moveLane(dx > 0 ? 1 : -1);
    else {
      const rect = canvas.getBoundingClientRect();
      moveLane(event.clientX < rect.left + rect.width / 2 ? -1 : 1);
    }
    pointerStartX = null;
  });

  renderStaticText();
  updateHud();
  preloadGame();
})();
