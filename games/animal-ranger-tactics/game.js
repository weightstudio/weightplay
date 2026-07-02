(() => {
  const GAME_ID = "animal-ranger-tactics";
  const UNLOCK_KEY = "animalRangerUnlocked";
  const STARS_KEY = "animalRangerStars";
  const BEST_KEY = "animalRangerBest";

  const $ = (id) => document.querySelector(`#${id}`);
  const nodes = {
    titleText: $("titleText"),
    languageLabel: $("languageLabel"),
    localeSelect: $("localeSelect"),
    missionLabel: $("missionLabel"),
    missionText: $("missionText"),
    turnLabel: $("turnLabel"),
    turnText: $("turnText"),
    actionLabel: $("actionLabel"),
    actionText: $("actionText"),
    scoreLabel: $("scoreLabel"),
    scoreText: $("scoreText"),
    animalsLegend: $("animalsLegend"),
    habitatLegend: $("habitatLegend"),
    threatLegend: $("threatLegend"),
    scoreHint: $("scoreHint"),
    missionSelect: $("missionSelect"),
    missionSelectTitle: $("missionSelectTitle"),
    missionGrid: $("missionGrid"),
    missionMessage: $("missionMessage"),
    playPanel: $("playPanel"),
    biomeImage: $("biomeImage"),
    biomeTitle: $("biomeTitle"),
    biomeGoal: $("biomeGoal"),
    grid: $("grid"),
    rangerRow: $("rangerRow"),
    patrolTitle: $("patrolTitle"),
    patrolText: $("patrolText"),
    restoreTitle: $("restoreTitle"),
    restoreText: $("restoreText"),
    researchTitle: $("researchTitle"),
    researchText: $("researchText"),
    endTurnBtn: $("endTurnBtn"),
    menuBtn: $("menuBtn"),
    hintText: $("hintText"),
    resultPanel: $("resultPanel"),
    resultTitle: $("resultTitle"),
    stars: $("stars"),
    resultText: $("resultText"),
    skillReport: $("skillReport"),
    nextBtn: $("nextBtn"),
    againBtn: $("againBtn"),
    levelsBtn: $("levelsBtn"),
    lobbyLink: $("lobbyLink"),
    loadingPanel: $("loadingPanel"),
  };

  const dictionary = {
    en: {
      title: "Animal Ranger Tactics",
      language: "Language",
      mission: "Mission",
      turn: "Turn",
      actions: "Actions",
      balance: "Balance",
      chooseMission: "Choose Mission",
      locked: "Mission locked",
      patrol: "Patrol",
      patrolText: "Reduce threat in one habitat.",
      restore: "Restore",
      restoreText: "Repair habitat and help wildlife recover.",
      research: "Research",
      researchText: "Boost animal growth and future balance.",
      endTurn: "End Turn",
      missions: "Missions",
      retry: "Retry",
      nextMission: "Next Mission",
      lobby: "Lobby",
      loading: "Loading",
      selectCell: "Select a habitat, then choose an action.",
      noActions: "No actions left. End the turn.",
      actionPatrol: "Rangers lowered the threat.",
      actionRestore: "Habitat quality improved.",
      actionResearch: "Animal recovery planning improved.",
      complete: "Mission Complete",
      failed: "Mission Failed",
      resultWin: "Ecosystem balance {score}. Wildlife is stable enough to continue.",
      resultLose: "Ecosystem balance {score}. Try a different action order.",
      allClear: "All missions cleared.",
      logic: "Logic",
      focus: "Focus",
      planning: "Planning",
      reportGreat: "Great strategy. You balanced risk, habitat, and wildlife recovery.",
      reportGood: "Good effort. Try watching high-threat habitats one turn earlier.",
      animalsLabel: "Animals",
      habitatLabel: "Habitat",
      threatLabel: "Threat",
      targetLabel: "Target",
      scoreHint: "Keep animals and habitats high, keep threats low. Reach the target balance to clear the mission.",
      m1: "Forest Corridor",
      m1Goal: "Keep connected forest habitats safe for lions and owls.",
      m2: "Wetland Recovery",
      m2Goal: "Restore wetland quality before animal growth slows down.",
      m3: "Grassland Watch",
      m3Goal: "Control fast-rising threats across open grassland.",
      m4: "River Crossing",
      m4Goal: "Protect mixed habitats while research demand grows.",
      m5: "Night Patrol",
      m5Goal: "Threats spread faster. Prioritize patrol timing.",
      m6: "Reserve Master Plan",
      m6Goal: "A hard reserve plan that needs all three ranger roles.",
      lion: "Lion Ranger",
      lionRole: "Threat control",
      elephant: "Elephant Ranger",
      elephantRole: "Habitat repair",
      owl: "Owl Ranger",
      owlRole: "Research planning",
    },
    "zh-Hant": {
      title: "動物巡守戰略",
      language: "語言",
      mission: "任務",
      turn: "回合",
      actions: "行動",
      balance: "平衡",
      chooseMission: "選擇任務",
      locked: "任務未解鎖",
      patrol: "巡守",
      patrolText: "降低一個棲地的威脅。",
      restore: "修復",
      restoreText: "修復棲地，幫助野生動物恢復。",
      research: "研究",
      researchText: "提升動物成長與未來平衡。",
      endTurn: "結束回合",
      missions: "任務",
      retry: "再試一次",
      nextMission: "下一個任務",
      lobby: "大廳",
      loading: "載入中",
      animalsLabel: "動物",
      habitatLabel: "棲地",
      threatLabel: "威脅",
      targetLabel: "目標",
      scoreHint: "讓動物與棲地越高越好，威脅越低越好。達到目標平衡即可過關。",
      selectCell: "先選一個棲地格，再選擇行動。",
      noActions: "沒有行動點了，請結束回合。",
      actionPatrol: "巡守員降低了威脅。",
      actionRestore: "棲地品質提升了。",
      actionResearch: "動物恢復計畫提升了。",
      complete: "任務完成",
      failed: "任務失敗",
      resultWin: "生態平衡 {score}。野生動物已足夠穩定，可以繼續下一個任務。",
      resultLose: "生態平衡 {score}。試試不同的行動順序。",
      allClear: "所有任務都完成了。",
      logic: "邏輯",
      focus: "專注",
      planning: "規劃",
      reportGreat: "很棒的策略！你平衡了風險、棲地與動物恢復。",
      reportGood: "表現不錯。下次可以更早處理高威脅棲地。",
      m1: "森林走廊",
      m1Goal: "保護相連森林，讓獅子與貓頭鷹能穩定活動。",
      m2: "濕地修復",
      m2Goal: "在動物成長變慢前，修復濕地品質。",
      m3: "草原巡防",
      m3Goal: "控制開闊草原上快速升高的威脅。",
      m4: "河岸通道",
      m4Goal: "在研究需求提高時，保護混合棲地。",
      m5: "夜間巡守",
      m5Goal: "威脅擴散更快，請掌握巡守時機。",
      m6: "保護區總計畫",
      m6Goal: "困難任務，需要完整運用三種巡守角色。",
      lion: "獅子巡守員",
      lionRole: "威脅控制",
      elephant: "大象巡守員",
      elephantRole: "棲地修復",
      owl: "貓頭鷹巡守員",
      owlRole: "研究規劃",
    },
  };

  const missions = [
    { title: "m1", goal: "m1Goal", biome: "../../assets/animal-ranger-forest.svg", turns: 7, startThreat: 26, growth: 6, target: 66 },
    { title: "m2", goal: "m2Goal", biome: "../../assets/animal-ranger-wetland.svg", turns: 8, startThreat: 32, growth: 6, target: 70 },
    { title: "m3", goal: "m3Goal", biome: "../../assets/animal-ranger-grassland.svg", turns: 8, startThreat: 38, growth: 8, target: 72 },
    { title: "m4", goal: "m4Goal", biome: "../../assets/animal-ranger-wetland.svg", turns: 9, startThreat: 42, growth: 8, target: 75 },
    { title: "m5", goal: "m5Goal", biome: "../../assets/animal-ranger-forest.svg", turns: 9, startThreat: 48, growth: 9, target: 78 },
    { title: "m6", goal: "m6Goal", biome: "../../assets/animal-ranger-grassland.svg", turns: 10, startThreat: 52, growth: 10, target: 82 },
  ];

  const rangers = [
    { key: "lion", role: "lionRole", image: "../../assets/animal-ranger-lion.svg" },
    { key: "elephant", role: "elephantRole", image: "../../assets/animal-ranger-elephant.svg" },
    { key: "owl", role: "owlRole", image: "../../assets/animal-ranger-owl.svg" },
  ];

  const state = {
    unlocked: readNumber(UNLOCK_KEY, 1),
    stars: readJson(STARS_KEY, {}),
    best: readJson(BEST_KEY, {}),
    missionIndex: 0,
    turn: 1,
    actions: 3,
    selected: -1,
    cells: [],
    score: 0,
    completed: false,
  };

  function locale() {
    return window.WonderI18n?.locale?.() || "en";
  }

  function t(key, params = {}) {
    const table = dictionary[locale()] || dictionary.en;
    let value = table[key] || dictionary.en[key] || key;
    for (const [name, param] of Object.entries(params)) value = value.replaceAll(`{${name}}`, String(param));
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
    localStorage.setItem(UNLOCK_KEY, String(state.unlocked));
    localStorage.setItem(STARS_KEY, JSON.stringify(state.stars));
    localStorage.setItem(BEST_KEY, JSON.stringify(state.best));
  }

  function translateStatic() {
    document.documentElement.lang = locale();
    nodes.titleText.textContent = t("title");
    nodes.languageLabel.textContent = t("language");
    nodes.missionLabel.textContent = t("mission");
    nodes.turnLabel.textContent = t("turn");
    nodes.actionLabel.textContent = t("actions");
    nodes.scoreLabel.textContent = t("balance");
    nodes.animalsLegend.textContent = t("animalsLabel");
    nodes.habitatLegend.textContent = t("habitatLabel");
    nodes.threatLegend.textContent = t("threatLabel");
    nodes.scoreHint.textContent = t("scoreHint");
    nodes.missionSelectTitle.textContent = t("chooseMission");
    nodes.patrolTitle.textContent = t("patrol");
    nodes.patrolText.textContent = t("patrolText");
    nodes.restoreTitle.textContent = t("restore");
    nodes.restoreText.textContent = t("restoreText");
    nodes.researchTitle.textContent = t("research");
    nodes.researchText.textContent = t("researchText");
    nodes.endTurnBtn.textContent = t("endTurn");
    nodes.menuBtn.textContent = t("missions");
    nodes.nextBtn.textContent = t("nextMission");
    nodes.againBtn.textContent = t("retry");
    nodes.levelsBtn.textContent = t("missions");
    nodes.lobbyLink.textContent = t("lobby");
    if (nodes.localeSelect.value !== locale()) nodes.localeSelect.value = locale();
    renderMissionSelect();
    if (!nodes.playPanel.classList.contains("hidden")) renderGame();
  }

  function renderMissionSelect() {
    nodes.missionGrid.innerHTML = "";
    missions.forEach((mission, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `mission-card${index + 1 > state.unlocked ? " locked" : ""}`;
      button.innerHTML = `
        <img src="${mission.biome}" alt="" />
        <strong>${index + 1}. ${t(mission.title)}</strong>
        <span>${t(mission.goal)}</span>
        <span>${"★".repeat(state.stars[index] || 0)}${"☆".repeat(3 - (state.stars[index] || 0))}</span>
      `;
      button.addEventListener("click", () => {
        if (index + 1 > state.unlocked) {
          nodes.missionMessage.textContent = t("locked");
          return;
        }
        startMission(index);
      });
      nodes.missionGrid.append(button);
    });
  }

  function createCells(mission) {
    return Array.from({ length: 16 }, (_, index) => {
      const wave = (index % 4) * 4 + Math.floor(index / 4) * 3;
      return {
        animals: clamp(52 + ((index * 7) % 24) - mission.startThreat / 5, 18, 95),
        habitat: clamp(58 + ((index * 11) % 26) - mission.startThreat / 6, 20, 95),
        threat: clamp(mission.startThreat + wave + ((index * 13) % 16), 8, 95),
      };
    });
  }

  function startMission(index) {
    state.missionIndex = index;
    state.turn = 1;
    state.actions = 3;
    state.selected = -1;
    state.completed = false;
    state.cells = createCells(missions[index]);
    state.score = calcScore();
    nodes.missionSelect.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.playPanel.classList.remove("hidden");
    nodes.hintText.textContent = t("selectCell");
    window.WonderSound?.play("start");
    window.WonderAnalytics?.track("game_start", { game_id: GAME_ID, mission: index + 1, locale: locale() });
    renderGame();
    nodes.playPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderGame() {
    const mission = missions[state.missionIndex];
    nodes.missionText.textContent = `${state.missionIndex + 1} / ${missions.length}`;
    nodes.turnText.textContent = `${state.turn} / ${mission.turns}`;
    nodes.actionText.textContent = state.actions;
    nodes.scoreText.textContent = state.score;
    nodes.biomeImage.src = mission.biome;
    nodes.biomeTitle.textContent = t(mission.title);
    nodes.biomeGoal.textContent = `${t(mission.goal)} ${t("targetLabel")}: ${mission.target}`;
    renderGrid();
    renderRangers();
    document.querySelectorAll("[data-action]").forEach((button) => {
      button.disabled = state.actions <= 0 || state.selected < 0;
    });
  }

  function renderGrid() {
    nodes.grid.innerHTML = "";
    const biome = missions[state.missionIndex].biome;
    state.cells.forEach((cell, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `cell${state.selected === index ? " selected" : ""}`;
      button.innerHTML = `
        <img src="${biome}" alt="" />
        <div class="cell-stats">
          <span><b>${t("animalsLabel")}</b><em>${Math.round(cell.animals)}</em></span>
          <span class="meter animals"><i style="width:${cell.animals}%"></i></span>
          <span><b>${t("habitatLabel")}</b><em>${Math.round(cell.habitat)}</em></span>
          <span class="meter habitat"><i style="width:${cell.habitat}%"></i></span>
          <span><b>${t("threatLabel")}</b><em>${Math.round(cell.threat)}</em></span>
          <span class="meter threat"><i style="width:${cell.threat}%"></i></span>
        </div>
      `;
      button.addEventListener("click", () => {
        state.selected = index;
        nodes.hintText.textContent = t("selectCell");
        renderGame();
      });
      nodes.grid.append(button);
    });
  }

  function renderRangers() {
    nodes.rangerRow.innerHTML = "";
    rangers.forEach((ranger) => {
      const card = document.createElement("div");
      card.className = "ranger-card";
      card.innerHTML = `<img src="${ranger.image}" alt="" /><div><strong>${t(ranger.key)}</strong><span>${t(ranger.role)}</span></div>`;
      nodes.rangerRow.append(card);
    });
  }

  function applyAction(action) {
    if (state.actions <= 0) {
      nodes.hintText.textContent = t("noActions");
      return;
    }
    if (state.selected < 0) {
      nodes.hintText.textContent = t("selectCell");
      return;
    }
    const cell = state.cells[state.selected];
    if (action === "patrol") {
      cell.threat = clamp(cell.threat - 24, 0, 100);
      cell.animals = clamp(cell.animals + 4, 0, 100);
      nodes.hintText.textContent = t("actionPatrol");
    }
    if (action === "restore") {
      cell.habitat = clamp(cell.habitat + 23, 0, 100);
      cell.threat = clamp(cell.threat - 8, 0, 100);
      nodes.hintText.textContent = t("actionRestore");
    }
    if (action === "research") {
      cell.animals = clamp(cell.animals + 18, 0, 100);
      cell.habitat = clamp(cell.habitat + 7, 0, 100);
      nodes.hintText.textContent = t("actionResearch");
    }
    state.actions -= 1;
    state.score = calcScore();
    window.WonderSound?.play("click");
    renderGame();
  }

  function endTurn() {
    const mission = missions[state.missionIndex];
    if (state.turn >= mission.turns) {
      finishMission();
      return;
    }
    state.turn += 1;
    state.actions = 3;
    state.selected = -1;
    state.cells = state.cells.map((cell, index) => {
      const pressure = mission.growth + ((state.turn + index) % 5);
      return {
        animals: clamp(cell.animals + Math.round(cell.habitat / 18) - Math.round(cell.threat / 22), 0, 100),
        habitat: clamp(cell.habitat - Math.round(cell.threat / 24) + (cell.animals > 65 ? 2 : 0), 0, 100),
        threat: clamp(cell.threat + pressure - (cell.habitat > 70 ? 3 : 0), 0, 100),
      };
    });
    state.score = calcScore();
    window.WonderSound?.play("pop");
    renderGame();
  }

  function calcScore() {
    const totals = state.cells.reduce(
      (acc, cell) => {
        acc.animals += cell.animals;
        acc.habitat += cell.habitat;
        acc.threat += cell.threat;
        return acc;
      },
      { animals: 0, habitat: 0, threat: 0 },
    );
    const avgAnimals = totals.animals / state.cells.length;
    const avgHabitat = totals.habitat / state.cells.length;
    const avgThreat = totals.threat / state.cells.length;
    return Math.round(clamp((avgAnimals * 0.42 + avgHabitat * 0.42 + (100 - avgThreat) * 0.5), 0, 100));
  }

  function finishMission() {
    const mission = missions[state.missionIndex];
    state.score = calcScore();
    const won = state.score >= mission.target;
    const earnedStars = won ? (state.score >= mission.target + 14 ? 3 : state.score >= mission.target + 7 ? 2 : 1) : 0;
    if (won) {
      state.unlocked = Math.max(state.unlocked, Math.min(missions.length, state.missionIndex + 2));
      state.stars[state.missionIndex] = Math.max(state.stars[state.missionIndex] || 0, earnedStars);
      state.best[state.missionIndex] = Math.max(state.best[state.missionIndex] || 0, state.score);
      saveProgress();
    }
    nodes.resultTitle.textContent = won ? t("complete") : t("failed");
    nodes.stars.textContent = "★".repeat(earnedStars) + "☆".repeat(3 - earnedStars);
    nodes.resultText.textContent = t(won ? "resultWin" : "resultLose", { score: state.score });
    nodes.skillReport.innerHTML = [
      [t("logic"), Math.min(5, Math.max(1, Math.ceil(state.score / 20)))],
      [t("focus"), Math.min(5, Math.max(1, Math.ceil((100 - highThreatCount() * 9) / 20)))],
      [t("planning"), Math.min(5, Math.max(1, earnedStars + 2))],
    ]
      .map(([label, value]) => `<div><span>${label}</span><strong>${"★".repeat(value)}${"☆".repeat(5 - value)}</strong></div>`)
      .join("");
    nodes.hintText.textContent = won ? t("reportGreat") : t("reportGood");
    nodes.nextBtn.disabled = !won || state.missionIndex >= missions.length - 1;
    nodes.resultPanel.classList.remove("hidden");
    window.WonderAnalytics?.track("game_complete", {
      game_id: GAME_ID,
      mission: state.missionIndex + 1,
      score: state.score,
      success: won,
      locale: locale(),
    });
  }

  function highThreatCount() {
    return state.cells.filter((cell) => cell.threat >= 70).length;
  }

  function showMissionSelect() {
    nodes.playPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.missionSelect.classList.remove("hidden");
    renderMissionSelect();
    nodes.missionSelect.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => applyAction(button.dataset.action));
  });
  nodes.endTurnBtn.addEventListener("click", endTurn);
  nodes.menuBtn.addEventListener("click", showMissionSelect);
  nodes.levelsBtn.addEventListener("click", showMissionSelect);
  nodes.againBtn.addEventListener("click", () => startMission(state.missionIndex));
  nodes.nextBtn.addEventListener("click", () => startMission(Math.min(state.missionIndex + 1, missions.length - 1)));
  nodes.localeSelect.addEventListener("change", () => window.WonderI18n?.setLocale?.(nodes.localeSelect.value));
  window.addEventListener("wonder:locale-change", translateStatic);

  translateStatic();
  renderMissionSelect();
  setTimeout(() => nodes.loadingPanel.classList.add("hidden"), 450);
})();
