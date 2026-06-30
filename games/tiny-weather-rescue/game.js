(() => {
  const GAME_ID = "tiny-weather-rescue";
  const localeKey = "weightplayLocale";
  const unlockKey = "weightplay_weather_unlocked";
  const starKey = "weightplay_weather_stars";

  const tools = {
    umbrella: { icon: "☂", className: "umbrella" },
    towel: { icon: "▤", className: "towel" },
    fan: { icon: "✦", className: "fan" },
    lantern: { icon: "◆", className: "lantern" },
    shelter: { icon: "⌂", className: "shelter" },
    snack: { icon: "●", className: "snack" },
  };

  const problems = {
    rain: { icon: "☔", tool: "umbrella" },
    puddle: { icon: "💧", tool: "towel" },
    heat: { icon: "☀", tool: "fan" },
    dark: { icon: "☁", tool: "lantern" },
    thunder: { icon: "⚡", tool: "shelter" },
    hungry: { icon: "○", tool: "snack" },
  };

  const stages = [
    { animal: "🐰", theme: "garden", rounds: ["rain", "puddle", "hungry", "heat"], target: 3 },
    { animal: "🦊", theme: "forest", rounds: ["dark", "rain", "thunder", "hungry", "puddle"], target: 4 },
    { animal: "🐼", theme: "bamboo", rounds: ["heat", "hungry", "rain", "dark", "puddle"], target: 4 },
    { animal: "🐧", theme: "ice", rounds: ["dark", "puddle", "thunder", "rain", "hungry", "heat"], target: 5 },
    { animal: "🦁", theme: "savanna", rounds: ["heat", "thunder", "hungry", "rain", "dark", "puddle"], target: 5 },
    { animal: "🐨", theme: "tree", rounds: ["rain", "dark", "heat", "puddle", "thunder", "hungry"], target: 5 },
  ].map((stage, index) => ({ ...stage, id: index + 1 }));

  const text = {
    en: {
      gameTitle: "Tiny Weather Rescue",
      language: "Language",
      chooseStage: "Choose Rescue",
      menuHint: "Watch the weather, pick the right rescue tool, and keep every animal calm.",
      stages: "Stages",
      loading: "Loading",
      nextStage: "Next Stage",
      retry: "Try Again",
      lobby: "Lobby",
      locked: "Stage locked",
      stage: "Stage {n}",
      rounds: "{done} / {total}",
      calm: "Calm {score}",
      stars: "{stars} / 3",
      clear: "Rescue Complete!",
      failed: "Needs More Care!",
      result: "You solved {score} weather problems. Best: {best} stars.",
      resultFailed: "Try again and match more tools before the rescue ends.",
      hint: "Pick a rescue tool for the weather card.",
      ready: "Ready",
      correct: "Nice rescue!",
      wrong: "Wrong tool. Keep going!",
      goal: "Goal {target}",
      umbrella: "Umbrella",
      towel: "Dry Towel",
      fan: "Cool Fan",
      lantern: "Lantern",
      shelter: "Shelter",
      snack: "Snack",
      rain: "Rain is falling",
      puddle: "Puddle splash",
      heat: "Too sunny",
      dark: "Clouds cover the trail",
      thunder: "Thunder nearby",
      hungry: "Animal is hungry",
    },
    "zh-Hant": {
      gameTitle: "小小天氣救援",
      language: "語言",
      chooseStage: "選擇救援",
      menuHint: "觀察天氣，選出正確道具，讓動物安心完成救援。",
      stages: "選關",
      loading: "載入中",
      nextStage: "下一關",
      retry: "再試一次",
      lobby: "大廳",
      locked: "關卡未解鎖",
      stage: "第 {n} 關",
      rounds: "{done} / {total}",
      calm: "安心 {score}",
      stars: "{stars} / 3",
      clear: "救援完成！",
      failed: "還需要照顧！",
      result: "你處理了 {score} 個天氣狀況。最佳：{best} 星。",
      resultFailed: "再試一次，在救援結束前配對更多正確道具。",
      hint: "依照天氣卡，選擇正確的救援道具。",
      ready: "準備",
      correct: "救援成功！",
      wrong: "道具不對，繼續加油！",
      goal: "目標 {target}",
      umbrella: "雨傘",
      towel: "乾毛巾",
      fan: "涼風扇",
      lantern: "小燈",
      shelter: "避難屋",
      snack: "點心",
      rain: "下雨了",
      puddle: "踩到水坑",
      heat: "太陽太熱",
      dark: "烏雲變暗",
      thunder: "雷聲靠近",
      hungry: "動物肚子餓",
    },
  };

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

  let locale = localStorage.getItem(localeKey) || window.WonderI18n?.locale?.() || "en";
  let unlocked = clamp(Number(localStorage.getItem(unlockKey)) || 1, 1, stages.length);
  let records = readRecords();
  let currentStage = 0;
  let roundIndex = 0;
  let score = 0;
  let running = false;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
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
    localStorage.setItem(unlockKey, String(unlocked));
  }

  function t(label, data = {}) {
    const value = (text[locale] || text.en)[label] || text.en[label] || label;
    return Object.entries(data).reduce((out, [name, item]) => out.replaceAll(`{${name}}`, String(item)), value);
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

  function renderStageGrid() {
    nodes.stageGrid.innerHTML = "";
    stages.forEach((stage, index) => {
      const stageNo = index + 1;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "stage-card";
      if (stageNo > unlocked) button.classList.add("locked");
      const best = records[stageNo] || 0;
      button.innerHTML = `
        <b>${stage.animal} ${problems[stage.rounds[0]].icon}</b>
        <strong>${t("stage", { n: stageNo })}</strong>
        <span>${t("goal", { target: stage.target })} · ${"★".repeat(best)}${"☆".repeat(3 - best)}</span>
      `;
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

  function startStage(index) {
    currentStage = index;
    roundIndex = 0;
    score = 0;
    running = true;
    nodes.menuPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.playPanel.classList.remove("hidden");
    nodes.hintText.textContent = t("hint");
    renderRound();
    track("game_start", { stage: currentStage + 1 });
  }

  function renderRound(feedback = "") {
    const stage = stages[currentStage];
    const problemKey = stage.rounds[roundIndex];
    const problem = problems[problemKey];
    nodes.stageText.textContent = t("stage", { n: stage.id });
    nodes.movesText.textContent = t("rounds", { done: roundIndex + 1, total: stage.rounds.length });
    nodes.starsText.textContent = t("calm", { score });
    nodes.board.innerHTML = `
      <div class="weather-scene ${stage.theme}">
        <div class="sky-badge">${problem.icon}</div>
        <div class="animal-badge">${stage.animal}</div>
        <div class="weather-card ${problemKey}">
          <span>${problem.icon}</span>
          <strong>${t(problemKey)}</strong>
        </div>
        <div class="tool-grid">
          ${Object.entries(tools).map(([key, tool]) => `
            <button class="tool-btn ${tool.className}" type="button" data-tool="${key}">
              <i>${tool.icon}</i>
              <span>${t(key)}</span>
            </button>
          `).join("")}
        </div>
        ${feedback ? `<div class="event-pop">${feedback}</div>` : ""}
      </div>
    `;
    nodes.board.querySelectorAll("[data-tool]").forEach((button) => {
      button.addEventListener("click", () => chooseTool(button.dataset.tool, button));
    });
  }

  function chooseTool(tool, button) {
    if (!running) return;
    const stage = stages[currentStage];
    const problemKey = stage.rounds[roundIndex];
    const correct = problems[problemKey].tool === tool;
    if (correct) {
      score += 1;
      button.classList.add("correct");
      nodes.hintText.textContent = t("correct");
      playSound("success");
    } else {
      button.classList.add("wrong");
      nodes.hintText.textContent = t("wrong");
      playSound("wrong");
    }
    track("weather_tool", { stage: stage.id, problem: problemKey, tool, correct });
    window.setTimeout(() => {
      roundIndex += 1;
      if (roundIndex >= stage.rounds.length) {
        finishStage();
        return;
      }
      renderRound(correct ? "+1" : "");
    }, 360);
  }

  function starCount(stage) {
    if (score >= stage.rounds.length) return 3;
    if (score >= stage.target) return 2;
    if (score >= Math.max(1, stage.target - 1)) return 1;
    return 0;
  }

  function finishStage() {
    running = false;
    const stage = stages[currentStage];
    const stars = starCount(stage);
    const cleared = score >= stage.target;
    records[stage.id] = Math.max(records[stage.id] || 0, stars);
    if (cleared && stage.id < stages.length) unlocked = Math.max(unlocked, stage.id + 1);
    saveRecords();
    nodes.playPanel.classList.add("hidden");
    nodes.resultPanel.classList.remove("hidden");
    nodes.resultTitle.textContent = cleared ? t("clear") : t("failed");
    nodes.starText.textContent = `${"★".repeat(stars)}${"☆".repeat(3 - stars)}`;
    nodes.resultText.textContent = cleared
      ? t("result", { score, best: records[stage.id] || stars })
      : t("resultFailed");
    nodes.nextStageBtn.classList.toggle("hidden", !cleared || stage.id >= stages.length);
    renderStageGrid();
    playSound(cleared ? "success" : "wrong");
    track("game_end", { stage: stage.id, score, stars, cleared });
  }

  function showMenu() {
    running = false;
    nodes.playPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.menuPanel.classList.remove("hidden");
    renderStageGrid();
  }

  function showFloatingText(message) {
    const toast = document.createElement("div");
    toast.className = "floating-toast";
    toast.textContent = message;
    document.body.append(toast);
    window.setTimeout(() => toast.remove(), 1300);
  }

  function installLoading() {
    let progress = 0;
    const id = window.setInterval(() => {
      progress = Math.min(100, progress + 25);
      nodes.loadingText.textContent = `${progress}%`;
      nodes.loadingFill.style.width = `${progress}%`;
      if (progress >= 100) {
        window.clearInterval(id);
        window.setTimeout(() => nodes.loadingPanel.classList.add("hidden"), 100);
      }
    }, 80);
  }

  nodes.localeSelect.addEventListener("change", (event) => {
    locale = event.target.value;
    localStorage.setItem(localeKey, locale);
    window.WonderI18n?.setLocale?.(locale);
    localizeStatic();
    renderStageGrid();
    if (running) renderRound();
  });
  nodes.backToStagesBtn.addEventListener("click", showMenu);
  nodes.resultStagesBtn.addEventListener("click", showMenu);
  nodes.retryBtn.addEventListener("click", () => startStage(currentStage));
  nodes.nextStageBtn.addEventListener("click", () => startStage(Math.min(currentStage + 1, stages.length - 1)));

  localizeStatic();
  renderStageGrid();
  installLoading();
})();
