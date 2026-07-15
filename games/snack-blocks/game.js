(function () {
  const GAME_ID = "snack-blocks";
  const columns = 7;
  const rows = 10;
  const matchClearDuration = 360;
  const dropSettleDuration = 360;
  const snacks = ["ST", "CK", "JM", "GR", "CH", "PR"];
  const snackArt = {
    ST: { label: "Strawberry", asset: "assets/tile-strawberry.png" },
    CK: { label: "Cookie", asset: "assets/tile-cookie.png" },
    JM: { label: "Candy", asset: "assets/tile-candy.png" },
    GR: { label: "Grape", asset: "assets/tile-grape.png" },
    CH: { label: "Cheese", asset: "assets/tile-cheese.png" },
    PR: { label: "Pretzel", asset: "assets/tile-pretzel.png" },
  };
  const effectArt = {
    matchBurst: "assets/effect-match-burst.png",
  };
  const localeKey = "weightplayLocale";
  const unlockKey = "snackBlocksUnlocked";
  const recordKey = "snackBlocksRecords";

  const stages = [
    { id: 1, goal: "score", target: 650, moves: 18, types: 4 },
    { id: 2, goal: "score", target: 900, moves: 20, types: 4 },
    { id: 3, goal: "score", target: 1200, moves: 22, types: 5 },
    { id: 4, goal: "score", target: 1500, moves: 24, types: 5 },
    { id: 5, goal: "collect", snack: "ST", target: 10, moves: 24, types: 5 },
    { id: 6, goal: "score", target: 1900, moves: 25, types: 6 },
    { id: 7, goal: "collect", snack: "CK", target: 12, moves: 25, types: 6 },
    { id: 8, goal: "score", target: 2400, moves: 26, types: 6 },
    { id: 9, goal: "collect", snack: "JM", target: 13, moves: 26, types: 6 },
    { id: 10, goal: "score", target: 2850, moves: 27, types: 6 },
    { id: 11, goal: "collect", snack: "GR", target: 14, moves: 27, types: 6 },
    { id: 12, goal: "score", target: 3300, moves: 28, types: 6 },
    { id: 13, goal: "collect", snack: "CH", target: 15, moves: 28, types: 6 },
    { id: 14, goal: "score", target: 3800, moves: 29, types: 6 },
    { id: 15, goal: "collect", snack: "PR", target: 16, moves: 29, types: 6 },
    { id: 16, goal: "score", target: 4300, moves: 30, types: 6 },
    { id: 17, goal: "collect", snack: "ST", target: 18, moves: 30, types: 6 },
    { id: 18, goal: "score", target: 4850, moves: 31, types: 6 },
    { id: 19, goal: "collect", snack: "CK", target: 20, moves: 31, types: 6 },
    { id: 20, goal: "score", target: 5500, moves: 32, types: 6 },
  ];

  const text = {
    en: {
      brand: "WeightPlay",
      title: "Snack Blocks",
      language: "Language",
      stage: "Stage",
      moves: "Moves",
      target: "Goal",
      score: "Score",
      menuTitle: "Choose a snack stage.",
      menuText: "Use all moves, reach the goal, and chase your best score.",
      start: "Start Game",
      stageHelp: "Drag sideways and choose an unlocked stage.",
      stageName: "Stage {stage}",
      locked: "Locked",
      best: "Best {score}",
      hint: "Tap or drag a snack to swap with its neighbor.",
      goalScore: "Score {target}",
      goalCollect: "Collect {icon} x{target}",
      goalScoreKind: "Score goal",
      goalCollectKind: "Collect goal",
      goalProgress: "{count} / {target}",
      goalReady: "Goal reached! Use remaining moves for a higher score.",
      loading: "Loading",
      clear: "Stage Clear!",
      failed: "Try Again!",
      clearText: "Score {score}. Goal {goal}. Best {best}.",
      finalClearText: "Score {score}. Goal {goal}. All snack stages cleared!",
      failedText: "Score {score}. Goal {goal}. Try a bigger combo.",
      next: "Next Stage",
      again: "Try Again",
      menu: "Stages",
      lobby: "Lobby",
      skillReport: "Skill Report",
      todayScore: "Today's Score",
      previousBest: "Previous Best",
      improvement: "Improvement",
      logicSkill: "Logic",
      problemSolvingSkill: "Problem Solving",
      focusSkill: "Focus",
      progressNewBest: "Great progress! You improved your best score.",
      progressImproved: "Nice improvement! Your planning was stronger this time.",
      progressSteady: "Good effort! Try again to improve focus and combo planning.",
      progressNote: "Scores are for fun and local progress tracking only.",
    },
    "zh-Hant": {
      brand: "WeightPlay",
      title: "動物零食方塊",
      language: "語言",
      stage: "關卡",
      moves: "步數",
      target: "目標",
      score: "分數",
      menuTitle: "選擇零食方塊關卡",
      menuText: "用完所有步數，達成目標，挑戰更好的分數。",
      stageName: "第 {stage} 關",
      locked: "尚未解鎖",
      best: "最佳 {score}",
      hint: "點擊或拖曳零食，和相鄰方塊交換位置。",
      goalScore: "分數達到 {target}",
      goalCollect: "收集 {icon} x{target}",
      goalScoreKind: "分數目標",
      goalCollectKind: "收集目標",
      goalProgress: "{count} / {target}",
      goalReady: "目標達成！用剩下的步數挑戰更高分。",
      loading: "載入中",
      clear: "關卡完成！",
      failed: "再試一次！",
      clearText: "分數 {score}。目標 {goal}。最佳 {best}。",
      finalClearText: "分數 {score}。目標 {goal}。所有零食關卡都完成了！",
      failedText: "分數 {score}。目標 {goal}。試著做出更大的連線。",
      next: "下一關",
      again: "再玩一次",
      menu: "關卡",
      lobby: "大廳",
      skillReport: "能力小報告",
      todayScore: "本次分數",
      previousBest: "之前最佳",
      improvement: "進步幅度",
      logicSkill: "邏輯",
      problemSolvingSkill: "解題",
      focusSkill: "專注",
      progressNewBest: "很棒！你刷新了自己的最佳分數。",
      progressImproved: "進步不錯！這次的規劃更穩定。",
      progressSteady: "努力得很好！再試一次，練習專注和連線規劃。",
      progressNote: "分數只用於遊戲樂趣與本機進步紀錄。",
    },
  };

  const metadata = {
    en: {
      title: "Snack Blocks - WeightPlay",
      description: "Clear snack matching stages, beat move goals, and unlock new levels in Snack Blocks, a mobile-friendly puzzle game on WeightPlay.",
      ogTitle: "Snack Blocks - Stage Match Puzzle Game",
      ogDescription: "Clear snack matching stages, beat move goals, and unlock new levels in Snack Blocks, a mobile-friendly puzzle game on WeightPlay.",
    },
    "zh-Hant": {
      title: "動物零食方塊 - WeightPlay",
      description: "遊玩動物零食方塊，交換相鄰零食圖案，在限定步數內完成分數或收集目標，練習邏輯、解題與專注力。",
      ogTitle: "動物零食方塊 - 關卡式三消益智遊戲",
      ogDescription: "交換零食方塊、完成關卡目標，挑戰更好的本機紀錄。",
    },
  };

  const nodes = {
    homeLink: document.getElementById("homeLink"),
    titleText: document.getElementById("titleText"),
    brandText: document.getElementById("brandText"),
    languageLabel: document.getElementById("languageLabel"),
    localeSelect: document.getElementById("localeSelect"),
    hud: document.getElementById("hud"),
    stageLabel: document.getElementById("stageLabel"),
    movesLabel: document.getElementById("movesLabel"),
    targetLabel: document.getElementById("targetLabel"),
    stageText: document.getElementById("stageText"),
    movesText: document.getElementById("movesText"),
    targetText: document.getElementById("targetText"),
    scoreLabel: document.getElementById("scoreLabel"),
    scoreText: document.getElementById("scoreText"),
    menuPanel: document.getElementById("menuPanel"),
    stagePanel: document.getElementById("stagePanel"),
    startBtn: document.getElementById("startBtn"),
    stageBackBtn: document.getElementById("stageBackBtn"),
    battleBackBtn: document.getElementById("battleBackBtn"),
    stageTitle: document.getElementById("stageTitle"),
    stageHelp: document.getElementById("stageHelp"),
    menuTitle: document.getElementById("menuTitle"),
    menuText: document.getElementById("menuText"),
    stageGrid: document.getElementById("stageGrid"),
    playPanel: document.getElementById("playPanel"),
    board: document.getElementById("board"),
    hintText: document.getElementById("hintText"),
    resultPanel: document.getElementById("resultPanel"),
    resultTitle: document.getElementById("resultTitle"),
    resultText: document.getElementById("resultText"),
    resultStars: document.getElementById("resultStars"),
    skillReport: document.getElementById("skillReport"),
    nextBtn: document.getElementById("nextBtn"),
    againBtn: document.getElementById("againBtn"),
    menuBtn: document.getElementById("menuBtn"),
    lobbyLink: document.getElementById("lobbyLink"),
    loadingPanel: document.getElementById("loadingPanel"),
    loadingTitle: document.getElementById("loadingTitle"),
    loadingText: document.getElementById("loadingText"),
    loadingFill: document.getElementById("loadingFill"),
  };

  const state = {
    locale: "en",
    board: [],
    selected: null,
    score: 0,
    moves: 0,
    combo: 1,
    goalCount: 0,
    goalReady: false,
    running: false,
    busy: false,
    currentStageIndex: 0,
    nextTileId: 1,
    dragStart: null,
    suppressClick: false,
  };

  function t(key, data = {}) {
    let value = (text[state.locale] && text[state.locale][key]) || text.en[key] || key;
    Object.keys(data).forEach((name) => {
      value = value.replaceAll(`{${name}}`, data[name]);
    });
    return value;
  }

  function activeStage() {
    return stages[state.currentStageIndex];
  }

  function goalLabel(stage = activeStage()) {
    return stage.goal === "collect"
      ? t("goalCollect", { icon: snackArt[stage.snack].label, target: stage.target })
      : t("goalScore", { target: stage.target });
  }

  function goalProgress(stage = activeStage()) {
    return stage.goal === "collect"
      ? t("goalProgress", { count: state.goalCount, target: stage.target })
      : `${state.score} / ${stage.target}`;
  }

  function goalMet(stage = activeStage()) {
    return stage.goal === "collect" ? state.goalCount >= stage.target : state.score >= stage.target;
  }

  function loadUnlocked() {
    try {
      const value = Number(localStorage.getItem(unlockKey));
      return Number.isFinite(value) && value > 0 ? Math.min(value, stages.length) : 1;
    } catch {
      return 1;
    }
  }

  function saveUnlocked(value) {
    try {
      localStorage.setItem(unlockKey, String(Math.min(value, stages.length)));
    } catch {
      // Progress persistence is optional.
    }
  }

  function loadRecords() {
    try {
      return JSON.parse(localStorage.getItem(recordKey)) || {};
    } catch {
      return {};
    }
  }

  function saveRecord(stageId, score) {
    const records = loadRecords();
    const previous = records[stageId];
    const previousBest = bestScoreFromRecord(previous);
    const bestScore = Math.max(previousBest, score);
    const playCount = (typeof previous === "object" && Number(previous.playCount)) || 0;
    const improvementPercent = previousBest > 0 ? Math.round(((score - previousBest) / previousBest) * 100) : score > 0 ? 100 : 0;
    const scoreRatio = score / Math.max(1, activeStage().target);
    const moveBonus = Math.min(1, Math.max(0, state.moves / Math.max(1, activeStage().moves)));
    records[stageId] = {
      lastScore: score,
      bestScore,
      playCount: playCount + 1,
      lastPlayedAt: new Date().toISOString(),
      improvementPercent,
      previousBest,
      skillScores: {
        logic: Math.min(5, Math.max(1, Math.ceil(scoreRatio * 3.2))),
        problemSolving: Math.min(5, Math.max(1, Math.ceil((scoreRatio + moveBonus) * 2.2))),
        focus: Math.min(5, Math.max(1, Math.ceil((goalMet() ? 3 : 2) + moveBonus * 2))),
      },
    };
    try {
      localStorage.setItem(recordKey, JSON.stringify(records));
    } catch {
      // Record persistence is optional.
    }
    return records;
  }

  function goalKindLabel(stage = activeStage()) {
    return stage.goal === "collect" ? t("goalCollectKind") : t("goalScoreKind");
  }

  function bestScoreFromRecord(record) {
    return typeof record === "number" ? record : Number(record?.bestScore) || 0;
  }

  function stars(value) {
    const filled = Math.max(1, Math.min(5, Math.round(value)));
    return "\u2605".repeat(filled) + "\u2606".repeat(5 - filled);
  }

  function renderSkillReport(progress, cleared) {
    const message =
      progress.previousBest <= 0 || progress.bestScore > progress.previousBest
        ? t("progressNewBest")
        : progress.improvementPercent > 0
          ? t("progressImproved")
          : t("progressSteady");
    nodes.skillReport.innerHTML = `
      <strong>${t("skillReport")}</strong>
      <div class="progress-line"><span>${t("todayScore")}</span><i>${progress.lastScore}</i></div>
      <div class="progress-line"><span>${t("previousBest")}</span><i>${progress.previousBest || "-"}</i></div>
      <div class="progress-line"><span>${t("improvement")}</span><i>${progress.improvementPercent > 0 ? "+" : ""}${progress.improvementPercent}%</i></div>
      <div class="skill-line"><span>${t("logicSkill")}</span><i>${stars(progress.skillScores.logic)}</i></div>
      <div class="skill-line"><span>${t("problemSolvingSkill")}</span><i>${stars(progress.skillScores.problemSolving)}</i></div>
      <div class="skill-line"><span>${t("focusSkill")}</span><i>${stars(progress.skillScores.focus)}</i></div>
      <p class="progress-message">${cleared ? message : t("progressSteady")}</p>
      <p class="progress-note">${t("progressNote")}</p>
    `;
  }

  function setLocale(locale) {
    state.locale = text[locale] ? locale : "en";
    try {
      localStorage.setItem(localeKey, state.locale);
    } catch {
      // Locale persistence is optional.
    }
    document.documentElement.lang = state.locale;
    nodes.localeSelect.value = state.locale;
    applyText();
  }

  function applyText() {
    updateMetadata();
    nodes.brandText.textContent = t("brand");
    nodes.titleText.textContent = t("title");
    nodes.languageLabel.textContent = t("language");
    nodes.stageLabel.textContent = t("stage");
    nodes.movesLabel.textContent = t("moves");
    nodes.targetLabel.textContent = t("target");
    nodes.scoreLabel.textContent = t("score");
    nodes.menuTitle.textContent = t("title");
    nodes.menuText.textContent = t("menuText");
    nodes.startBtn.textContent = state.locale === "zh-Hant" ? "\u958b\u59cb\u904a\u6232" : t("start");
    nodes.stageTitle.textContent = t("menuTitle");
    nodes.stageHelp.textContent = state.locale === "zh-Hant" ? "\u5de6\u53f3\u6ed1\u52d5\uff0c\u9078\u64c7\u5df2\u89e3\u9396\u7684\u95dc\u5361\u3002" : t("stageHelp");
    nodes.hintText.textContent = t("hint");
    nodes.loadingTitle.textContent = t("loading");
    nodes.nextBtn.textContent = t("next");
    nodes.againBtn.textContent = t("again");
    nodes.menuBtn.textContent = t("menu");
    nodes.lobbyLink.textContent = t("lobby");
    renderStageGrid();
    updateHud();
  }

  function updateMetadata() {
    const current = metadata[state.locale] || metadata.en;
    document.title = current.title;
    setMeta("description", current.description);
    setMeta("og:title", current.ogTitle, true);
    setMeta("og:description", current.ogDescription, true);
  }

  function setMeta(name, content, property = false) {
    const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    const node = document.querySelector(selector);
    if (node) node.setAttribute("content", content);
  }

  function makeTile(type) {
    const tile = { id: state.nextTileId, type };
    state.nextTileId += 1;
    return tile;
  }

  function randomType() {
    return snacks[Math.floor(Math.random() * activeStage().types)];
  }

  function getCell(row, col) {
    return state.board[row * columns + col];
  }

  function buildCleanBoard() {
    state.board = [];
    state.nextTileId = 1;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < columns; col += 1) {
        let value = randomType();
        let guard = 0;
        while (
          guard < 30 &&
          ((col >= 2 && getCell(row, col - 1)?.type === value && getCell(row, col - 2)?.type === value) ||
            (row >= 2 && getCell(row - 1, col)?.type === value && getCell(row - 2, col)?.type === value))
        ) {
          value = randomType();
          guard += 1;
        }
        state.board.push(makeTile(value));
      }
    }
  }

  function renderStageGrid() {
    const unlocked = loadUnlocked();
    const records = loadRecords();
    nodes.stageGrid.innerHTML = "";
    stages.forEach((stage, index) => {
      const button = document.createElement("button");
      const isUnlocked = index < unlocked;
      button.type = "button";
      button.className = `stage-card ${isUnlocked ? "" : "locked"}`;
      button.setAttribute("aria-disabled", String(!isUnlocked));
      button.innerHTML = `
        <strong>${stage.id}</strong>
        <small class="stage-goal-kind ${stage.goal}">${goalKindLabel(stage)}</small>
        <span>${t("stageName", { stage: stage.id })}</span>
        <em>${isUnlocked ? `${goalLabel(stage)} · ${t("best", { score: bestScoreFromRecord(records[stage.id]) })}` : t("locked")}</em>
      `;
      button.addEventListener("click", () => {
        if (!isUnlocked || nodes.stageGrid.dataset.dragged === "true") return;
        startStage(index);
      });
      nodes.stageGrid.append(button);
    });
    requestAnimationFrame(() => {
      const unlockedCard = [...nodes.stageGrid.querySelectorAll(".stage-card:not(.locked)")].at(-1);
      scrollStageCardToCenter(unlockedCard, "auto");
    });
  }

  function scrollStageCardToCenter(card, behavior = "smooth") {
    if (!card) return;
    const left = Math.max(0, Math.min(
      card.offsetLeft + card.offsetWidth / 2 - nodes.stageGrid.clientWidth / 2,
      nodes.stageGrid.scrollWidth - nodes.stageGrid.clientWidth
    ));
    nodes.stageGrid.scrollTo({ left, behavior });
  }

  function centerNearestStage() {
    const cards = [...nodes.stageGrid.querySelectorAll(".stage-card")];
    if (!cards.length) return;
    const center = nodes.stageGrid.scrollLeft + nodes.stageGrid.clientWidth / 2;
    const nearest = cards.reduce((best, card) => {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      return !best || distance < best.distance ? { card, distance } : best;
    }, null)?.card;
    scrollStageCardToCenter(nearest);
  }

  function installStageDrag() {
    nodes.stageGrid.dataset.stageDragInstalled = "true";
    let pointerId = null;
    let startX = 0;
    let startScroll = 0;
    let moved = false;
    nodes.stageGrid.addEventListener("pointerdown", (event) => {
      if (nodes.stageGrid.dataset.wpStageRail === "true") return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startScroll = nodes.stageGrid.scrollLeft;
      moved = false;
      nodes.stageGrid.classList.add("dragging");
    });
    nodes.stageGrid.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 6 && !moved) {
        moved = true;
        nodes.stageGrid.setPointerCapture?.(pointerId);
      }
      if (!moved) return;
      nodes.stageGrid.scrollLeft = startScroll - delta;
    });
    const finish = (event) => {
      if (event.pointerId !== pointerId) return;
      if (nodes.stageGrid.hasPointerCapture?.(pointerId)) nodes.stageGrid.releasePointerCapture(pointerId);
      pointerId = null;
      nodes.stageGrid.classList.remove("dragging");
      if (moved) nodes.stageGrid.dataset.dragged = "true";
      centerNearestStage();
      setTimeout(() => { delete nodes.stageGrid.dataset.dragged; }, 120);
    };
    nodes.stageGrid.addEventListener("pointerup", finish);
    nodes.stageGrid.addEventListener("pointercancel", finish);
  }

  function showStage() {
    nodes.menuPanel.classList.add("hidden");
    nodes.stagePanel.classList.remove("hidden");
    document.body.classList.add("snack-stage");
    renderStageGrid();
    exitSharedPlayViewport();
    updateSnackFrame();
    requestAnimationFrame(updateSnackFrame);
  }

  function showMain() {
    nodes.stagePanel.classList.add("hidden");
    nodes.menuPanel.classList.remove("hidden");
    document.body.classList.remove("snack-stage");
    resetSnackFrame();
  }

  function renderBoard(dropMap = new Map()) {
    nodes.board.innerHTML = "";
    state.board.forEach((tile, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `tile tile-${snacks.indexOf(tile.type)}`;
      button.innerHTML = `<img class="snack-image" src="${snackArt[tile.type].asset}" alt="" draggable="false" />`;
      button.dataset.index = String(index);
      button.dataset.tileId = String(tile.id);
      button.setAttribute("aria-label", snackArt[tile.type].label);
      if (dropMap.has(tile.id)) {
        button.classList.add("dropping");
        button.style.setProperty("--drop", `${-dropMap.get(tile.id) * 112}%`);
      }
      if (state.selected === index) button.classList.add("selected");
      button.addEventListener("pointerdown", onPointerDown);
      button.addEventListener("pointerup", onPointerUp);
      button.addEventListener("click", onTileClick);
      nodes.board.append(button);
    });
  }

  function updateHud() {
    const oldScore = nodes.scoreText.textContent;
    nodes.stageText.textContent = String(activeStage().id);
    nodes.movesText.textContent = String(state.moves);
    nodes.targetText.textContent = goalProgress();
    nodes.scoreText.textContent = String(state.score);
    if (oldScore !== nodes.scoreText.textContent) bump(nodes.scoreText);
  }

  function bump(node) {
    node.classList.remove("score-pop");
    void node.offsetWidth;
    node.classList.add("score-pop");
  }

  function isNeighbor(a, b) {
    const ar = Math.floor(a / columns);
    const ac = a % columns;
    const br = Math.floor(b / columns);
    const bc = b % columns;
    return Math.abs(ar - br) + Math.abs(ac - bc) === 1;
  }

  function swap(a, b) {
    const temp = state.board[a];
    state.board[a] = state.board[b];
    state.board[b] = temp;
  }

  function findMatches() {
    const matched = new Set();
    for (let row = 0; row < rows; row += 1) {
      let runStart = 0;
      for (let col = 1; col <= columns; col += 1) {
        const same = col < columns && getCell(row, col)?.type === getCell(row, runStart)?.type;
        if (!same) {
          if (col - runStart >= 3) {
            for (let mark = runStart; mark < col; mark += 1) matched.add(row * columns + mark);
          }
          runStart = col;
        }
      }
    }
    for (let col = 0; col < columns; col += 1) {
      let runStart = 0;
      for (let row = 1; row <= rows; row += 1) {
        const same = row < rows && getCell(row, col)?.type === getCell(runStart, col)?.type;
        if (!same) {
          if (row - runStart >= 3) {
            for (let mark = runStart; mark < row; mark += 1) matched.add(mark * columns + col);
          }
          runStart = row;
        }
      }
    }
    return [...matched];
  }

  function markMatches(indices) {
    indices.forEach((index) => {
      const tile = nodes.board.querySelector(`[data-index="${index}"]`);
      if (tile) tile.classList.add("matching");
    });
    spawnMatchEffects(indices);
  }

  function spawnMatchEffects(indices) {
    indices.forEach((index, order) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      const effect = document.createElement("span");
      effect.className = "match-spark";
      effect.setAttribute("aria-hidden", "true");
      effect.style.left = `${((col + 0.5) / columns) * 100}%`;
      effect.style.top = `${((row + 0.5) / rows) * 100}%`;
      effect.style.setProperty("--burst-image", `url("${effectArt.matchBurst}")`);
      effect.style.animationDelay = `${Math.min(order * 18, 90)}ms`;
      nodes.board.append(effect);
    });
  }

  function collapse(matches) {
    const removed = new Set(matches);
    const newBoard = new Array(columns * rows);
    const dropMap = new Map();

    for (let col = 0; col < columns; col += 1) {
      const survivors = [];
      for (let row = rows - 1; row >= 0; row -= 1) {
        const index = row * columns + col;
        const tile = state.board[index];
        if (!removed.has(index)) survivors.push({ tile, oldRow: row });
      }

      let targetRow = rows - 1;
      survivors.forEach(({ tile, oldRow }) => {
        newBoard[targetRow * columns + col] = tile;
        const distance = Math.max(0, targetRow - oldRow);
        if (distance > 0) dropMap.set(tile.id, distance);
        targetRow -= 1;
      });

      while (targetRow >= 0) {
        const tile = makeTile(randomType());
        newBoard[targetRow * columns + col] = tile;
        dropMap.set(tile.id, targetRow + 1);
        targetRow -= 1;
      }
    }

    state.board = newBoard;
    return dropMap;
  }

  function resolveBoard() {
    const matches = findMatches();
    if (!matches.length) {
      state.combo = 1;
      state.busy = false;
      updateHud();
      renderBoard();
      checkEnd();
      return;
    }

    const stage = activeStage();
    state.score += matches.length * 12 * state.combo;
    if (stage.goal === "collect") {
      state.goalCount += matches.filter((index) => state.board[index]?.type === stage.snack).length;
    }
    state.combo += 1;
    updateHud();
    if (!state.goalReady && goalMet(stage)) {
      state.goalReady = true;
      nodes.hintText.textContent = t("goalReady");
    }
    markMatches(matches);
    window.WonderSound?.play(matches.length >= 5 ? "success" : "coin");

    window.setTimeout(() => {
      const dropMap = collapse(matches);
      renderBoard(dropMap);
      window.setTimeout(resolveBoard, dropSettleDuration);
    }, matchClearDuration);
  }

  function trySwap(target) {
    if (!state.running || state.busy || state.selected === null || target === state.selected) return;
    if (!isNeighbor(state.selected, target)) {
      state.selected = target;
      renderBoard();
      return;
    }

    const first = state.selected;
    state.selected = null;
    state.busy = true;
    swap(first, target);
    renderBoard();

    if (!findMatches().length) {
      window.WonderSound?.play("wrong");
      window.setTimeout(() => {
        swap(first, target);
        state.combo = 1;
        state.busy = false;
        updateHud();
        renderBoard();
      }, 170);
      return;
    }

    state.moves -= 1;
    updateHud();
    window.WonderSound?.play("click");
    window.setTimeout(resolveBoard, 120);
  }

  function onTileClick(event) {
    if (state.suppressClick) {
      state.suppressClick = false;
      return;
    }
    if (state.dragStart) return;
    const index = Number(event.currentTarget.dataset.index);
    if (state.selected === null) {
      state.selected = index;
      renderBoard();
      return;
    }
    trySwap(index);
  }

  function onPointerDown(event) {
    const index = Number(event.currentTarget.dataset.index);
    state.dragStart = { index, x: event.clientX, y: event.clientY };
  }

  function onPointerUp(event) {
    if (!state.dragStart) return;
    const dx = event.clientX - state.dragStart.x;
    const dy = event.clientY - state.dragStart.y;
    const distance = Math.hypot(dx, dy);
    const start = state.dragStart.index;
    state.dragStart = null;
    if (distance < 20) return;

    let target = start;
    if (Math.abs(dx) > Math.abs(dy)) {
      target = start + (dx > 0 ? 1 : -1);
    } else {
      target = start + (dy > 0 ? columns : -columns);
    }
    if (target < 0 || target >= columns * rows || !isNeighbor(start, target)) return;
    state.selected = start;
    state.suppressClick = true;
    trySwap(target);
  }

  function updateSnackFrame() {
    if (!document.body.classList.contains("snack-stage") && !document.body.classList.contains("snack-playing")) return;
    const viewport = window.visualViewport;
    const viewportWidth = viewport?.width || innerWidth;
    const viewportHeight = viewport?.height || innerHeight;
    const shell = document.querySelector(".snack-game");
    shell?.classList.remove("weightplay-active-viewport");
    const scale = Math.min(Math.max(1, viewportWidth - 8) / 390, Math.max(1, viewportHeight - 8) / 788);
    const width = 390 * scale;
    const height = 788 * scale;
    const left = (viewportWidth - width) / 2;
    const top = viewportHeight - height - 4;
    document.documentElement.style.setProperty("--snack-frame-scale", String(scale));
    document.documentElement.style.setProperty("--snack-frame-left", `${left}px`);
    document.documentElement.style.setProperty("--snack-frame-top", `${top}px`);
    document.documentElement.style.setProperty("--snack-frame-width", `${width}px`);
    document.documentElement.style.setProperty("--snack-frame-height", `${height}px`);
    shell?.style.setProperty("position", "fixed", "important");
    shell?.style.setProperty("inset", "auto", "important");
    shell?.style.setProperty("left", `${left}px`, "important");
    shell?.style.setProperty("top", `${top}px`, "important");
    shell?.style.setProperty("width", "390px", "important");
    shell?.style.setProperty("height", "788px", "important");
    shell?.style.setProperty("min-height", "788px", "important");
    shell?.style.setProperty("transform", `scale(${scale})`, "important");
    shell?.style.setProperty("transform-origin", "top left", "important");
  }

  function resetSnackFrame() {
    const shell = document.querySelector(".snack-game");
    for (const property of ["position", "inset", "left", "top", "width", "height", "min-height", "transform", "transform-origin"]) shell?.style.removeProperty(property);
  }

  function exitSharedPlayViewport() {
    window.WeightPlayGame?.exitMobileGameMode?.();
    document.body.classList.remove("weightplay-active-viewport", "wp-mobile-game-mode");
    document.querySelector(".snack-game")?.classList.remove("weightplay-active-viewport");
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    if (document.webkitFullscreenElement) document.webkitExitFullscreen?.();
  }

  window.addEventListener("resize", updateSnackFrame);
  window.addEventListener("orientationchange", updateSnackFrame);
  window.visualViewport?.addEventListener("resize", updateSnackFrame);
  window.visualViewport?.addEventListener("scroll", updateSnackFrame);

  function startStage(index) {
    if (index >= loadUnlocked()) return;
    window.WonderSound?.unlock();
    window.WonderSound?.play("start");
    state.currentStageIndex = index;
    state.score = 0;
    state.moves = activeStage().moves;
    state.combo = 1;
    state.goalCount = 0;
    state.goalReady = false;
    state.selected = null;
    state.running = true;
    state.busy = false;
    buildCleanBoard();
    nodes.menuPanel.classList.add("hidden");
    nodes.stagePanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.hud.classList.remove("hidden");
    nodes.playPanel.classList.remove("hidden");
    document.body.classList.remove("snack-stage");
    document.body.classList.add("snack-playing");
    document.querySelector(".snack-game")?.removeAttribute("data-play-viewport");
    updateHud();
    renderBoard();
    nodes.hintText.textContent = t("hint");
    exitSharedPlayViewport();
    updateSnackFrame();
    window.WonderAnalytics?.track("game_start", {
      game_id: GAME_ID,
      stage: activeStage().id,
      goal: activeStage().goal,
    });
    requestAnimationFrame(() => {
      exitSharedPlayViewport();
      updateSnackFrame();
    });
  }

  function checkEnd() {
    if (!state.running || state.busy) return;
    if (state.moves <= 0) finishStage(goalMet());
  }

  function finishStage(cleared) {
    state.running = false;
    state.busy = true;
    const stage = activeStage();
    const progress = saveRecord(stage.id, state.score)[stage.id];
    const best = progress.bestScore || state.score;
    if (cleared && stage.id < stages.length) {
      saveUnlocked(Math.max(loadUnlocked(), stage.id + 1));
    }

    nodes.resultTitle.textContent = cleared ? t("clear") : t("failed");
    nodes.resultText.textContent = cleared
      ? t(stage.id === stages.length ? "finalClearText" : "clearText", { score: state.score, goal: goalLabel(stage), best })
      : t("failedText", { score: state.score, goal: goalLabel(stage) });
    nodes.resultStars.textContent = cleared ? ratingStars() : "";
    renderSkillReport(progress, cleared);
    nodes.nextBtn.classList.toggle("hidden", !cleared || stage.id >= stages.length);
    nodes.hud.classList.add("hidden");
    nodes.playPanel.classList.add("hidden");
    nodes.resultPanel.classList.remove("hidden");
    window.WonderSound?.play(cleared ? "win" : "wrong");
    window.WonderAnalytics?.track("game_complete", {
      game_id: GAME_ID,
      stage: stage.id,
      score: state.score,
      goal: stage.goal,
      cleared,
    });
  }

  function ratingStars() {
    const stage = activeStage();
    const value =
      stage.goal === "collect"
        ? state.goalCount >= stage.target + 8
          ? 3
          : state.goalCount >= stage.target + 4
            ? 2
            : 1
        : state.score >= stage.target * 1.55
          ? 3
          : state.score >= stage.target * 1.25
            ? 2
            : 1;
    return "\u2605".repeat(value);
  }

  function starRating() {
    const stage = activeStage();
    if (stage.goal === "collect") {
      if (state.goalCount >= stage.target + 8) return "★★★";
      if (state.goalCount >= stage.target + 4) return "★★";
      return "★";
    }
    if (state.score >= stage.target * 1.55) return "★★★";
    if (state.score >= stage.target * 1.25) return "★★";
    return "★";
  }

  function showMenu() {
    state.running = false;
    state.busy = false;
    nodes.hud.classList.add("hidden");
    nodes.playPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.menuPanel.classList.add("hidden");
    nodes.stagePanel.classList.remove("hidden");
    document.body.classList.remove("snack-playing");
    document.body.classList.add("snack-stage");
    const shell = document.querySelector(".snack-game");
    shell?.setAttribute("data-play-viewport", "");
    for (const property of ["position", "inset", "left", "top", "width", "height", "min-height", "transform", "transform-origin"]) shell?.style.removeProperty(property);
    renderStageGrid();
    window.WonderAnalytics?.track("game_menu", { game_id: GAME_ID });
  }

  function installLoading() {
    let progress = 0;
    const id = window.setInterval(() => {
      progress = Math.min(100, progress + 20);
      nodes.loadingText.textContent = `${progress}%`;
      nodes.loadingFill.style.width = `${progress}%`;
      if (progress >= 100) {
        window.clearInterval(id);
        window.setTimeout(() => {
          nodes.loadingPanel.classList.add("hidden");
          window.WonderAnalytics?.track("game_ready", { game_id: GAME_ID });
        }, 120);
      }
    }, 70);
  }

  nodes.nextBtn.addEventListener("click", () => startStage(Math.min(state.currentStageIndex + 1, stages.length - 1)));
  nodes.againBtn.addEventListener("click", () => {
    window.WonderAnalytics?.track("game_restart", {
      game_id: GAME_ID,
      stage: activeStage().id,
    });
    startStage(state.currentStageIndex);
  });
  nodes.menuBtn.addEventListener("click", showMenu);
  nodes.startBtn.addEventListener("click", showStage);
  nodes.stageBackBtn.addEventListener("click", showMain);
  nodes.battleBackBtn.addEventListener("click", showStage);
  nodes.localeSelect.addEventListener("change", (event) => setLocale(event.target.value));
  nodes.homeLink.addEventListener("click", (event) => {
    if (state.running || !nodes.resultPanel.classList.contains("hidden")) {
      event.preventDefault();
      showMenu();
    }
  });

  try {
    setLocale(localStorage.getItem(localeKey) || window.WonderI18n?.locale?.() || "en");
  } catch {
    setLocale("en");
  }
  installStageDrag();
  installLoading();
})();
