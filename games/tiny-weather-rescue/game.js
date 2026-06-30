(() => {
  const GAME_ID = "tiny-weather-rescue";
  const localeKey = "weightplayLocale";
  const unlockKey = "weightplay_weather_unlocked";
  const starKey = "weightplay_weather_stars";
  const gridSize = 5;

  const text = {
    en: {
      gameTitle: "Tiny Weather Rescue",
      language: "Language",
      chooseStage: "Choose Stage",
      menuHint: "Guide animals to the cozy shelter.",
      stages: "Stages",
      loading: "Loading",
      nextStage: "Next Stage",
      retry: "Try Again",
      lobby: "Lobby",
      locked: "Stage locked",
      stage: "Stage {n}",
      moves: "{moves} moves",
      stars: "{stars} / 3",
      clear: "Rescue Complete!",
      failed: "Try another route!",
      result: "You collected {stars} stars and reached the shelter.",
      resultFailed: "The animal needs a safer path.",
      hint: "Tap a glowing nearby tile.",
      starGet: "Star collected!",
      rain: "Rain costs one extra move.",
      wind: "Wind pushes you forward.",
      puddle: "Puddle is slippery.",
      storm: "Storm blocks this route.",
      shelter: "Shelter reached!",
    },
    "zh-Hant": {
      gameTitle: "小小天氣救援",
      language: "語言",
      chooseStage: "選擇關卡",
      menuHint: "帶動物避開天氣危險，走到溫暖小屋。",
      stages: "選關",
      loading: "載入中",
      nextStage: "下一關",
      retry: "再試一次",
      lobby: "大廳",
      locked: "關卡未解鎖",
      stage: "第 {n} 關",
      moves: "剩 {moves} 步",
      stars: "{stars} / 3",
      clear: "救援成功！",
      failed: "換條路試試！",
      result: "你收集 {stars} 顆星星並抵達小屋。",
      resultFailed: "動物需要更安全的路線。",
      hint: "點亮起來的相鄰格。",
      starGet: "拿到星星！",
      rain: "下雨格會多花一步。",
      wind: "風會把你往前吹。",
      puddle: "水坑很滑，要小心。",
      storm: "閃電格不能走。",
      shelter: "抵達小屋！",
    },
  };

  const tiles = {
    path: { icon: "·", className: "path" },
    rain: { icon: "\u{1F327}", className: "rain" },
    wind: { icon: "\u{1F32C}", className: "wind" },
    puddle: { icon: "\u{1F4A7}", className: "puddle" },
    storm: { icon: "\u{26A1}", className: "storm" },
    star: { icon: "\u{2B50}", className: "star" },
    shelter: { icon: "\u{1F3E0}", className: "shelter" },
  };

  const stages = [
    { animal: "\u{1F430}", moves: 12, start: [4, 0], shelter: [0, 4], stars: [[3, 1], [2, 3], [0, 2]], hazards: { rain: [[3, 2]], puddle: [[1, 2]], wind: [[2, 1]], storm: [[1, 3]] } },
    { animal: "\u{1F98A}", moves: 13, start: [4, 4], shelter: [0, 0], stars: [[3, 3], [2, 1], [0, 2]], hazards: { rain: [[4, 2], [2, 3]], puddle: [[1, 1]], wind: [[3, 2]], storm: [[2, 2]] } },
    { animal: "\u{1F43F}", moves: 13, start: [4, 2], shelter: [0, 2], stars: [[4, 0], [2, 4], [1, 1]], hazards: { rain: [[3, 2], [1, 3]], puddle: [[2, 0]], wind: [[3, 4]], storm: [[2, 2]] } },
    { animal: "\u{1F43C}", moves: 14, start: [4, 0], shelter: [0, 4], stars: [[4, 3], [2, 2], [1, 4]], hazards: { rain: [[3, 0], [3, 3]], puddle: [[2, 1], [1, 2]], wind: [[2, 3]], storm: [[1, 1], [3, 2]] } },
    { animal: "\u{1F9A6}", moves: 15, start: [4, 4], shelter: [0, 0], stars: [[4, 1], [2, 2], [0, 3]], hazards: { rain: [[3, 4], [2, 0]], puddle: [[3, 1], [1, 3]], wind: [[2, 4]], storm: [[1, 1], [2, 3]] } },
    { animal: "\u{1F98C}", moves: 16, start: [4, 2], shelter: [0, 2], stars: [[4, 0], [2, 1], [1, 4]], hazards: { rain: [[4, 3], [2, 2], [0, 1]], puddle: [[3, 0], [1, 2]], wind: [[3, 4], [2, 0]], storm: [[1, 1], [3, 2], [2, 3]] } },
  ];

  const $ = (id) => document.getElementById(id);
  const nodes = {
    localeSelect: $("localeSelect"),
    menuPanel: $("menuPanel"),
    stageGrid: $("stageGrid"),
    playPanel: $("playPanel"),
    backToStagesBtn: $("backToStagesBtn"),
    stageText: $("stageText"),
    movesText: $("movesText"),
    starsText: $("starsText"),
    board: $("board"),
    hintText: $("hintText"),
    resultPanel: $("resultPanel"),
    resultTitle: $("resultTitle"),
    starText: $("starText"),
    resultText: $("resultText"),
    nextStageBtn: $("nextStageBtn"),
    retryBtn: $("retryBtn"),
    resultStagesBtn: $("resultStagesBtn"),
    loadingPanel: $("loadingPanel"),
    loadingText: $("loadingText"),
    loadingFill: $("loadingFill"),
  };

  let locale = localStorage.getItem(localeKey) || "en";
  let unlocked = clamp(Number(localStorage.getItem(unlockKey)) || 1, 1, stages.length);
  let records = readRecords();
  let currentStage = 0;
  let player = [0, 0];
  let moves = 0;
  let collected = new Set();
  let running = false;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function key(pos) {
    return `${pos[0]},${pos[1]}`;
  }

  function readRecords() {
    try {
      return JSON.parse(localStorage.getItem(starKey) || "{}");
    } catch {
      return {};
    }
  }

  function saveRecords() {
    localStorage.setItem(starKey, JSON.stringify(records));
  }

  function t(label, data = {}) {
    const value = (text[locale] || text.en)[label] || text.en[label] || label;
    return Object.entries(data).reduce((out, [name, item]) => out.replaceAll(`{${name}}`, item), value);
  }

  function playSound(name) {
    window.WonderSound?.play?.(name);
  }

  function track(event, payload = {}) {
    window.WonderAnalytics?.track(event, { game_id: GAME_ID, ...payload });
  }

  function localizeStatic() {
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : "en";
    nodes.localeSelect.value = locale;
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
  }

  function stageTile(stage, row, col) {
    if (same([row, col], stage.shelter)) return "shelter";
    if (stage.stars.some((pos) => same(pos, [row, col])) && !collected.has(key([row, col]))) return "star";
    for (const [kind, positions] of Object.entries(stage.hazards)) {
      if (positions.some((pos) => same(pos, [row, col]))) return kind;
    }
    return "path";
  }

  function same(a, b) {
    return a[0] === b[0] && a[1] === b[1];
  }

  function neighbors(pos) {
    return [
      [pos[0] - 1, pos[1]],
      [pos[0] + 1, pos[1]],
      [pos[0], pos[1] - 1],
      [pos[0], pos[1] + 1],
    ].filter(([row, col]) => row >= 0 && row < gridSize && col >= 0 && col < gridSize);
  }

  function renderStageGrid() {
    nodes.stageGrid.innerHTML = "";
    stages.forEach((stage, index) => {
      const stageNo = index + 1;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "stage-card";
      if (stageNo > unlocked) button.classList.add("locked");
      const score = records[stageNo] || 0;
      button.innerHTML = `<b>${stage.animal} ${tiles.shelter.icon}</b><strong>${t("stage", { n: stageNo })}</strong><span>${"★".repeat(score)}${"☆".repeat(3 - score)}</span>`;
      button.addEventListener("click", () => {
        if (stageNo > unlocked) {
          showFloatingText(t("locked"));
          playSound("click");
          return;
        }
        startStage(index);
      });
      nodes.stageGrid.append(button);
    });
  }

  function renderBoard() {
    const stage = stages[currentStage];
    const reachable = new Set(neighbors(player).map(key));
    nodes.board.innerHTML = "";
    for (let row = 0; row < gridSize; row += 1) {
      for (let col = 0; col < gridSize; col += 1) {
        const pos = [row, col];
        const kind = stageTile(stage, row, col);
        const button = document.createElement("button");
        button.type = "button";
        button.className = `cell ${tiles[kind].className}`;
        button.dataset.row = String(row);
        button.dataset.col = String(col);
        if (reachable.has(key(pos)) && kind !== "storm") button.classList.add("reachable");
        if (same(player, pos)) {
          button.classList.add("player");
          button.textContent = stage.animal;
        } else {
          button.textContent = tiles[kind].icon;
        }
        button.addEventListener("click", () => moveTo(pos, button));
        nodes.board.append(button);
      }
    }
    updateHud();
  }

  function moveTo(pos, button) {
    if (!running) return;
    const stage = stages[currentStage];
    const kind = stageTile(stage, pos[0], pos[1]);
    if (!neighbors(player).some((item) => same(item, pos)) || kind === "storm") {
      button.classList.remove("bad");
      void button.offsetWidth;
      button.classList.add("bad");
      nodes.hintText.textContent = kind === "storm" ? t("storm") : t("hint");
      playSound("wrong");
      return;
    }

    player = [...pos];
    moves -= kind === "rain" ? 2 : 1;
    if (kind === "star") {
      collected.add(key(pos));
      nodes.hintText.textContent = t("starGet");
      playSound("success");
    } else if (kind === "rain") {
      nodes.hintText.textContent = t("rain");
      playSound("click");
    } else if (kind === "wind") {
      nodes.hintText.textContent = t("wind");
      playSound("click");
      const pushed = [pos[0] - 1, pos[1]];
      if (pushed[0] >= 0 && stageTile(stage, pushed[0], pushed[1]) !== "storm") player = pushed;
    } else if (kind === "puddle") {
      nodes.hintText.textContent = t("puddle");
      playSound("click");
    } else if (kind === "shelter") {
      nodes.hintText.textContent = t("shelter");
      playSound("success");
    } else {
      nodes.hintText.textContent = t("hint");
      playSound("click");
    }

    track("game_answer", { level: currentStage + 1, tile: kind, moves_left: moves });
    renderBoard();
    if (same(player, stage.shelter)) finishStage(true);
    else if (moves <= 0) finishStage(false);
  }

  function updateHud() {
    nodes.stageText.textContent = t("stage", { n: currentStage + 1 });
    nodes.movesText.textContent = t("moves", { moves: Math.max(0, moves) });
    nodes.starsText.textContent = t("stars", { stars: collected.size });
  }

  function startStage(index) {
    const stage = stages[index];
    currentStage = index;
    player = [...stage.start];
    moves = stage.moves;
    collected = new Set();
    running = true;
    nodes.menuPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.playPanel.classList.remove("hidden");
    nodes.hintText.textContent = t("hint");
    playSound("start");
    renderBoard();
    track("game_start", { level: index + 1 });
  }

  function finishStage(cleared) {
    const stageNo = currentStage + 1;
    running = false;
    const earned = cleared ? Math.max(1, collected.size) : 0;
    if (cleared) {
      records[stageNo] = Math.max(records[stageNo] || 0, earned);
      saveRecords();
      if (stageNo === unlocked && unlocked < stages.length) {
        unlocked += 1;
        localStorage.setItem(unlockKey, String(unlocked));
      }
    }
    nodes.resultTitle.textContent = cleared ? t("clear") : t("failed");
    nodes.starText.textContent = "★".repeat(earned) + "☆".repeat(3 - earned);
    nodes.resultText.textContent = cleared ? t("result", { stars: collected.size }) : t("resultFailed");
    nodes.nextStageBtn.classList.toggle("hidden", !cleared || currentStage >= stages.length - 1);
    nodes.resultPanel.classList.remove("hidden");
    playSound(cleared ? "win" : "wrong");
    track("game_complete", { level: stageNo, cleared, stars: earned });
  }

  function showMenu() {
    running = false;
    nodes.menuPanel.classList.remove("hidden");
    nodes.playPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    renderStageGrid();
  }

  function showFloatingText(message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    Object.assign(toast.style, {
      position: "fixed",
      left: "50%",
      top: "52%",
      zIndex: "40",
      transform: "translate(-50%, -50%)",
      padding: "12px 18px",
      borderRadius: "999px",
      background: "rgba(23, 49, 79, 0.9)",
      color: "#fff",
      fontWeight: "900",
      animation: "toastUp 1.15s ease forwards",
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1200);
  }

  function initLoading() {
    let progress = 0;
    const timer = setInterval(() => {
      progress = Math.min(100, progress + 20);
      nodes.loadingText.textContent = `${progress}%`;
      nodes.loadingFill.style.width = `${progress}%`;
      if (progress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          nodes.loadingPanel.classList.add("hidden");
          track("game_ready");
        }, 180);
      }
    }, 110);
  }

  function bindEvents() {
    nodes.localeSelect.addEventListener("change", () => {
      locale = nodes.localeSelect.value;
      localStorage.setItem(localeKey, locale);
      localizeStatic();
      renderStageGrid();
      if (!nodes.playPanel.classList.contains("hidden")) {
        nodes.hintText.textContent = t("hint");
        renderBoard();
      }
    });
    nodes.backToStagesBtn.addEventListener("click", showMenu);
    nodes.resultStagesBtn.addEventListener("click", showMenu);
    nodes.retryBtn.addEventListener("click", () => startStage(currentStage));
    nodes.nextStageBtn.addEventListener("click", () => startStage(Math.min(currentStage + 1, stages.length - 1)));
  }

  const style = document.createElement("style");
  style.textContent = "@keyframes toastUp{to{transform:translate(-50%,-120%);opacity:0}}";
  document.head.appendChild(style);

  localizeStatic();
  bindEvents();
  renderStageGrid();
  initLoading();
})();
