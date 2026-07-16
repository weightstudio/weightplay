(() => {
  const GAME_ID = "tiny-weather-rescue";
  const localeKey = "weightplayLocale";
  const unlockKey = "weightplay_weather_unlocked";
  const starKey = "weightplay_weather_stars";
  const progressKey = "weightplay_weather_progress";

  const tools = {
    umbrella: { icon: "../../assets/tiny-weather-tool-umbrella.svg", className: "umbrella" },
    towel: { icon: "../../assets/tiny-weather-tool-towel.svg", className: "towel" },
    fan: { icon: "../../assets/tiny-weather-tool-fan.svg", className: "fan" },
    lantern: { icon: "../../assets/tiny-weather-tool-lantern.svg", className: "lantern" },
    house: { icon: "../../assets/tiny-weather-tool-house.svg", className: "house" },
    apple: { icon: "../../assets/tiny-weather-tool-apple.svg", className: "apple" },
    boots: { icon: "../../assets/tiny-weather-tool-boots.svg", className: "boots" },
    blanket: { icon: "../../assets/tiny-weather-tool-blanket.svg", className: "blanket" },
  };

  const problems = {
    rain: { icon: "\u{1F327}\u{FE0F}", tool: "umbrella", scene: "rain" },
    puddle: { icon: "\u{1F4A7}", tool: "towel", scene: "puddle" },
    heat: { icon: "\u{2600}\u{FE0F}", tool: "fan", scene: "heat" },
    dark: { icon: "\u{1F311}", tool: "lantern", scene: "dark" },
    thunder: { icon: "\u{26A1}", tool: "house", scene: "thunder" },
    hungry: { icon: "\u{1F924}", tool: "apple", scene: "hungry" },
    muddy: { icon: "\u{1F43E}", tool: "boots", scene: "muddy" },
    cold: { icon: "\u{2744}\u{FE0F}", tool: "blanket", scene: "cold" },
    windy: { icon: "\u{1F32C}\u{FE0F}", tool: "house", scene: "windy" },
  };

  const animalAssets = {
    rabbit: "../../assets/tiny-weather-animal-rabbit.png",
    fox: "../../assets/tiny-weather-animal-fox.png",
    panda: "../../assets/tiny-weather-animal-panda.png",
    penguin: "../../assets/tiny-weather-animal-penguin.png",
    lion: "../../assets/weightplay-boom-mane-lion.png",
    koala: "../../assets/tiny-weather-animal-koala.png",
  };

  const stages = [
    { animalId: "rabbit", theme: "garden", rounds: ["rain", "puddle", "hungry", "heat"], choices: ["umbrella", "towel", "apple", "fan"], target: 3 },
    { animalId: "fox", theme: "forest", rounds: ["dark", "thunder", "rain", "cold"], choices: ["lantern", "house", "umbrella", "blanket"], target: 3 },
    { animalId: "panda", theme: "bamboo", rounds: ["muddy", "puddle", "heat", "hungry", "rain"], choices: ["boots", "towel", "fan", "apple", "umbrella"], target: 4 },
    { animalId: "penguin", theme: "ice", rounds: ["cold", "dark", "windy", "thunder", "puddle"], choices: ["blanket", "lantern", "house", "towel", "umbrella"], target: 4 },
    { animalId: "lion", theme: "savanna", rounds: ["heat", "hungry", "muddy", "thunder", "rain", "cold"], choices: ["fan", "apple", "boots", "house", "umbrella", "blanket"], target: 5 },
    { animalId: "koala", theme: "tree", rounds: ["rain", "dark", "windy", "puddle", "hungry", "cold"], choices: ["umbrella", "lantern", "house", "towel", "apple", "blanket", "fan"], target: 5 },
  ].map((stage, index) => ({ ...stage, id: index + 1 }));

  const text = {
    en: {
      gameTitle: "Animal Helper Quest",
      seoTitle: "Animal Helper Quest - WeightPlay",
      seoDescription: "Help cute animals through weather, hunger, mud, darkness, and gentle care missions in Animal Helper Quest.",
      ogTitle: "Animal Helper Quest - Animal Care Game",
      ogDescription: "Tap or drag the right care item to help cute animals through gentle missions.",
      language: "Language",
      languageAria: "Language",
      back: "Back",
      backToStages: "Back to stages",
      chooseStage: "Choose Help Mission",
      menuHint: "Help the little animal. Tap or drag the right care item to it.",
      stages: "Stages",
      loading: "Loading",
      nextStage: "Next Stage",
      retry: "Try Again",
      lobby: "Lobby",
      locked: "Stage locked",
      stage: "Stage {n}",
      progress: "{done}/{total}",
      calm: "Help {score}",
      clear: "Help Complete!",
      failed: "Needs More Care!",
      result: "{score} helpers finished. Best: {best} stars.",
      resultFailed: "Try again and help more animals.",
      reportTitle: "Skill Report",
      previousBest: "Previous Best",
      todayScore: "Today's Score",
      improvement: "Improvement",
      problemSolving: "Problem Solving",
      focus: "Focus",
      animalCare: "Animal Care",
      reportGreat: "Great progress! Your child chose helpful items carefully and solved the care mission.",
      reportGood: "Good effort! Try again to improve focus and choose the best care item.",
      reportTry: "Nice practice! Look at what the animal needs, then try a helpful item.",
      hint: "Tap a care item, or drag it to the animal.",
      whatHelps: "What helps?",
      correct: "Happy helper!",
      wrong: "Try another care item.",
      goal: "Goal {target}",
      rain: "It is raining.",
      puddle: "The animal is wet.",
      heat: "It is too hot.",
      dark: "It is too dark.",
      thunder: "Thunder is nearby.",
      hungry: "The animal is hungry.",
      muddy: "The path is muddy.",
      cold: "It is too cold.",
      windy: "The wind is too strong.",
      rabbit: "Rabbit",
      fox: "Fox",
      panda: "Panda",
      penguin: "Penguin",
      lion: "Lion",
      koala: "Koala",
      umbrella: "Umbrella",
      towel: "Towel",
      fan: "Fan",
      lantern: "Lamp",
      house: "House",
      apple: "Apple",
      boots: "Boots",
      blanket: "Blanket",
    },
    "zh-Hant": {
      gameTitle: "\u52d5\u7269\u5e6b\u5e6b\u968a",
      seoTitle: "\u52d5\u7269\u5e6b\u5e6b\u968a - WeightPlay",
      seoDescription: "\u5e6b\u52a9\u53ef\u611b\u5c0f\u52d5\u7269\u89e3\u6c7a\u4e0b\u96e8\u3001\u98e2\u9913\u3001\u6ce5\u6fd8\u3001\u5929\u9ed1\u8207\u5176\u4ed6\u6eab\u548c\u7167\u9867\u4efb\u52d9\u3002",
      ogTitle: "\u52d5\u7269\u5e6b\u5e6b\u968a - \u52d5\u7269\u7167\u9867\u904a\u6232",
      ogDescription: "\u9ede\u4e00\u4e0b\u6216\u62d6\u66f3\u6b63\u78ba\u7684\u7167\u9867\u9053\u5177\uff0c\u5e6b\u52a9\u53ef\u611b\u5c0f\u52d5\u7269\u5b8c\u6210\u4efb\u52d9\u3002",
      language: "\u8a9e\u8a00",
      languageAria: "\u8a9e\u8a00",
      back: "\u8fd4\u56de",
      backToStages: "\u8fd4\u56de\u9078\u95dc",
      chooseStage: "\u9078\u64c7\u5e6b\u5fd9\u4efb\u52d9",
      menuHint: "\u5e6b\u5c0f\u52d5\u7269\uff0c\u9ede\u6216\u62d6\u66f3\u6b63\u78ba\u7167\u9867\u9053\u5177\u7d66\u5b83\u3002",
      stages: "\u9078\u95dc",
      loading: "\u8f09\u5165\u4e2d",
      nextStage: "\u4e0b\u4e00\u95dc",
      retry: "\u518d\u8a66\u4e00\u6b21",
      lobby: "\u5927\u5ef3",
      locked: "\u95dc\u5361\u672a\u89e3\u9396",
      stage: "\u7b2c {n} \u95dc",
      progress: "{done}/{total}",
      calm: "\u5e6b\u5fd9 {score}",
      clear: "\u5e6b\u5fd9\u5b8c\u6210\uff01",
      failed: "\u9084\u9700\u8981\u7167\u9867\uff01",
      result: "\u5b8c\u6210 {score} \u500b\u5e6b\u5fd9\u4efb\u52d9\u3002\u6700\u4f73\uff1a{best} \u661f\u3002",
      resultFailed: "\u518d\u8a66\u4e00\u6b21\uff0c\u5e6b\u52a9\u66f4\u591a\u5c0f\u52d5\u7269\u3002",
      reportTitle: "\u80fd\u529b\u5c0f\u5831\u544a",
      previousBest: "\u4e4b\u524d\u6700\u4f73",
      todayScore: "\u672c\u6b21\u5206\u6578",
      improvement: "\u9032\u6b65",
      problemSolving: "\u554f\u984c\u89e3\u6c7a",
      focus: "\u5c08\u6ce8\u529b",
      animalCare: "\u52d5\u7269\u7167\u9867",
      reportGreat: "\u5f88\u68d2\uff01\u9019\u6b21\u6709\u4ed4\u7d30\u770b\u60c5\u5883\uff0c\u4e5f\u9078\u5230\u9069\u5408\u7684\u7167\u9867\u9053\u5177\u3002",
      reportGood: "\u505a\u5f97\u4e0d\u932f\uff01\u518d\u8a66\u4e00\u6b21\u53ef\u4ee5\u66f4\u719f\u6089\u6bcf\u500b\u52d5\u7269\u9700\u8981\u4ec0\u9ebc\u3002",
      reportTry: "\u597d\u52aa\u529b\uff01\u5148\u770b\u770b\u5c0f\u52d5\u7269\u9047\u5230\u4ec0\u9ebc\u554f\u984c\uff0c\u518d\u9078\u7167\u9867\u9053\u5177\u3002",
      hint: "\u9ede\u7167\u9867\u9053\u5177\uff0c\u6216\u62d6\u5230\u5c0f\u52d5\u7269\u8eab\u4e0a\u3002",
      whatHelps: "\u4ec0\u9ebc\u53ef\u4ee5\u5e6b\u5fd9\uff1f",
      correct: "\u5c0f\u52d5\u7269\u958b\u5fc3\u4e86\uff01",
      wrong: "\u518d\u8a66\u4e00\u500b\u7167\u9867\u9053\u5177\u3002",
      goal: "\u76ee\u6a19 {target}",
      rain: "\u5916\u9762\u5728\u4e0b\u96e8\u3002",
      puddle: "\u5c0f\u52d5\u7269\u6fd5\u6fd5\u7684\u3002",
      heat: "\u592a\u967d\u592a\u71b1\u4e86\u3002",
      dark: "\u5929\u8272\u592a\u6697\u4e86\u3002",
      thunder: "\u96f7\u8072\u9760\u8fd1\u4e86\u3002",
      hungry: "\u5c0f\u52d5\u7269\u809a\u5b50\u9913\u4e86\u3002",
      muddy: "\u8def\u4e0a\u90fd\u662f\u6ce5\u5df4\u3002",
      cold: "\u5929\u6c23\u592a\u51b7\u4e86\u3002",
      windy: "\u98a8\u592a\u5927\u4e86\u3002",
      rabbit: "\u5154\u5b50",
      fox: "\u72d0\u72f8",
      panda: "\u8c93\u718a",
      penguin: "\u4f01\u9d5d",
      lion: "\u7345\u5b50",
      koala: "\u7121\u5c3e\u718a",
      umbrella: "\u96e8\u5098",
      towel: "\u6bdb\u5dfe",
      fan: "\u98a8\u6247",
      lantern: "\u5c0f\u71c8",
      house: "\u5c0f\u5c4b",
      apple: "\u860b\u679c",
      boots: "\u96e8\u9774",
      blanket: "\u6bef\u5b50",
    },
  };

  const $ = (id) => document.getElementById(id);
  const nodes = {
    localeSelect: $("localeSelect"),
    menuPanel: $("menuPanel"),
    stagePanel: $("stagePanel"),
    startGameBtn: $("startGameBtn"),
    stageBackBtn: $("stageBackBtn"),
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
    skillReport: $("skillReport"),
    nextStageBtn: $("nextStageBtn"),
    retryBtn: $("retryBtn"),
    resultStagesBtn: $("resultStagesBtn"),
    loadingPanel: $("loadingPanel"),
    loadingText: $("loadingText"),
    loadingFill: $("loadingFill"),
    homeLink: document.querySelector(".home-link"),
  };

  let locale = localStorage.getItem(localeKey) || window.WonderI18n?.locale?.() || "en";
  let unlocked = clamp(Number(localStorage.getItem(unlockKey)) || 1, 1, stages.length);
  let records = readRecords();
  let currentStage = 0;
  let roundIndex = 0;
  let score = 0;
  let mistakes = 0;
  let running = false;
  let busy = false;
  let dragState = null;
  let careTransitionToken = 0;

  function invalidateCareTransition() {
    careTransitionToken += 1;
    busy = false;
  }

  function scheduleCareTask(task, delay) {
    const token = careTransitionToken;
    const startedAt = performance.now();
    const tick = (now) => {
      if (token !== careTransitionToken || !running || !document.body.classList.contains("helper-playing")) return;
      if (now - startedAt >= delay) task();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

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

  function readProgress() {
    try {
      return JSON.parse(localStorage.getItem(progressKey) || "{}");
    } catch {
      return {};
    }
  }

  function saveProgress(stageId, entry) {
    const progress = readProgress();
    progress[stageId] = entry;
    localStorage.setItem(progressKey, JSON.stringify(progress));
  }

  function t(label, data = {}) {
    const table = text[locale] || text.en;
    const value = table[label] || text.en[label] || label;
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
    document.title = t("seoTitle");
    setMeta('meta[name="description"]', "content", t("seoDescription"));
    setMeta('meta[property="og:title"]', "content", t("ogTitle"));
    setMeta('meta[property="og:description"]', "content", t("ogDescription"));
    nodes.localeSelect.value = locale;
    nodes.localeSelect.setAttribute("aria-label", t("languageAria"));
    nodes.stageBackBtn.setAttribute("aria-label", t("back"));
    nodes.backToStagesBtn.setAttribute("aria-label", t("backToStages"));
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
  }

  function setMeta(selector, attr, value) {
    const node = document.querySelector(selector);
    if (node) node.setAttribute(attr, value);
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
      const firstProblem = problems[stage.rounds[0]];
      button.innerHTML = `
        <b class="stage-animal">
          <img src="${animalAssets[stage.animalId]}" alt="" />
          <span>${firstProblem.icon}</span>
        </b>
        <strong>${t("stage", { n: stageNo })}</strong>
        <span>${t(stage.animalId)} \u00b7 ${t("goal", { target: stage.target })} \u00b7 ${"\u2605".repeat(best)}${"\u2606".repeat(3 - best)}</span>
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
    requestAnimationFrame(() => {
      const unlockedCard = [...nodes.stageGrid.querySelectorAll(".stage-card:not(.locked)")].at(-1);
      unlockedCard?.scrollIntoView({ block: "nearest", inline: "center", behavior: "auto" });
    });
  }

  function updateWeatherFrame() {
    if (!document.body.classList.contains("helper-playing") && !document.body.classList.contains("wp-standard-stage-page")) return;
    const viewport = window.visualViewport;
    const visualWidth = Math.round(viewport?.width || 0);
    const visualHeight = Math.round(viewport?.height || 0);
    const useVisual = visualWidth > 0
      && visualHeight > 0
      && Math.abs(visualWidth - innerWidth) <= 2
      && visualHeight <= innerHeight + 2;
    const width = useVisual ? visualWidth : innerWidth;
    const height = useVisual ? visualHeight : innerHeight;
    const scale = Math.max(0.1, Math.min((width - 8) / 390, (height - 8) / 788));
    const renderedWidth = 390 * scale;
    const renderedHeight = 788 * scale;
    document.documentElement.style.setProperty("--weather-frame-scale", String(scale));
    document.documentElement.style.setProperty("--weather-frame-left", `${Math.max(0, (width - renderedWidth) / 2)}px`);
    document.documentElement.style.setProperty("--weather-frame-top", `${Math.max(0, height - renderedHeight - 4)}px`);
    const shell = document.querySelector(".weather-game");
    ["position", "inset", "left", "top", "width", "height", "min-height", "transform", "transform-origin"].forEach((property) => shell?.style.removeProperty(property));
  }

  function exitSharedPlayViewport() {
    window.WeightPlayGame?.exitMobileGameMode?.();
    document.body.classList.remove("weightplay-active-viewport", "wp-mobile-game-mode");
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    if (document.webkitFullscreenElement) document.webkitExitFullscreen?.();
  }

  window.addEventListener("resize", updateWeatherFrame);
  window.addEventListener("orientationchange", updateWeatherFrame);
  window.visualViewport?.addEventListener("resize", updateWeatherFrame, { passive: true });

  let stageDrag = null;
  const settleStageRail = () => {
    const cards = [...nodes.stageGrid.querySelectorAll(".stage-card")];
    const center = nodes.stageGrid.scrollLeft + nodes.stageGrid.clientWidth / 2;
    const nearest = cards.reduce((best, card) => {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      return !best || distance < best.distance ? { card, distance } : best;
    }, null)?.card;
    if (nearest) nodes.stageGrid.scrollTo({ left: nearest.offsetLeft - (nodes.stageGrid.clientWidth - nearest.offsetWidth) / 2, behavior: "smooth" });
  };
  nodes.stageGrid.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    stageDrag = { id: event.pointerId, x: event.clientX, scrollLeft: nodes.stageGrid.scrollLeft, moved: false };
    nodes.stageGrid.dataset.dragApplied = "0";
  });
  nodes.stageGrid.addEventListener("pointermove", (event) => {
    if (!stageDrag || event.pointerId !== stageDrag.id) return;
    const delta = event.clientX - stageDrag.x;
    if (Math.abs(delta) >= 6 && !stageDrag.moved) {
      stageDrag.moved = true;
      nodes.stageGrid.setPointerCapture?.(event.pointerId);
    }
    if (!stageDrag.moved) return;
    event.preventDefault();
    nodes.stageGrid.scrollLeft = stageDrag.scrollLeft - delta;
    nodes.stageGrid.dataset.dragApplied = String(delta);
  });
  const endStageDrag = (event) => {
    if (!stageDrag || event.pointerId !== stageDrag.id) return;
    if (stageDrag.moved) settleStageRail();
    if (nodes.stageGrid.hasPointerCapture?.(event.pointerId)) nodes.stageGrid.releasePointerCapture?.(event.pointerId);
    stageDrag = null;
  };
  nodes.stageGrid.addEventListener("pointerup", endStageDrag);
  nodes.stageGrid.addEventListener("pointercancel", endStageDrag);

  function startStage(index) {
    invalidateCareTransition();
    cleanupDrag();
    currentStage = index;
    roundIndex = 0;
    score = 0;
    mistakes = 0;
    running = true;
    busy = false;
    nodes.menuPanel.classList.add("hidden");
    nodes.stagePanel.classList.add("hidden");
    document.body.classList.remove("wp-standard-stage-page");
    nodes.resultPanel.classList.add("hidden");
    nodes.playPanel.classList.remove("result-active");
    nodes.playPanel.classList.remove("hidden");
    document.body.classList.add("helper-playing");
    document.querySelector(".weather-game")?.removeAttribute("data-play-viewport");
    nodes.hintText.textContent = t("hint");
    renderRound("", true);
    exitSharedPlayViewport();
    updateWeatherFrame();
    track("game_start", { stage: currentStage + 1 });
    requestAnimationFrame(() => {
      exitSharedPlayViewport();
      updateWeatherFrame();
    });
    window.setTimeout(() => {
      exitSharedPlayViewport();
      updateWeatherFrame();
    }, 160);
  }

  function progressPercent(stage) {
    return Math.round((roundIndex / stage.rounds.length) * 100);
  }

  function renderRound(feedback = "", focusTool = false) {
    cleanupDrag();
    const stage = stages[currentStage];
    const problemKey = stage.rounds[roundIndex];
    const problem = problems[problemKey];
    const percent = progressPercent(stage);
    const choices = toolChoices(stage, problemKey);
    nodes.stageText.textContent = t("stage", { n: stage.id });
    nodes.movesText.innerHTML = `<b>${t("progress", { done: roundIndex + 1, total: stage.rounds.length })}</b><i style="width:${percent}%"></i>`;
    nodes.starsText.textContent = t("calm", { score });
    nodes.board.innerHTML = `
      <div class="weather-scene ${stage.theme} ${problem.scene}">
        <div class="rescue-scene">
          <div class="weather-effects" aria-hidden="true">${weatherEffects(problemKey)}</div>
          <div class="problem-cue" aria-label="${t("whatHelps")}"><span>${problem.icon}</span><b aria-hidden="true">→</b><strong aria-hidden="true">?</strong><small>${t("whatHelps")}</small></div>
          <div class="animal-zone" data-drop-zone="true">
            <div class="animal-shadow"></div>
            <img class="animal-sprite" src="${animalAssets[stage.animalId]}" alt="${t(stage.animalId)}" />
          </div>
          <div class="need-line">${t(problemKey)}</div>
        </div>
        <div class="tool-grid">
          ${choices.map((key) => {
            const tool = tools[key];
            return `
            <button class="tool-btn ${tool.className}" type="button" data-tool="${key}" aria-label="${t(key)}">
              <i><img src="${tool.icon}" alt="" /></i>
              <span>${t(key)}</span>
            </button>
          `;
          }).join("")}
        </div>
        ${feedback ? `<div class="event-pop">${feedback}</div>` : ""}
      </div>
    `;
    nodes.board.querySelectorAll("[data-tool]").forEach((button) => installToolControl(button));
    if (focusTool) requestAnimationFrame(() => nodes.board.querySelector(".tool-btn")?.focus({ preventScroll: true }));
  }

  function toolChoices(stage, problemKey) {
    const choices = stage.choices || Object.keys(tools);
    const shuffled = seededShuffle(choices, stage.id * 97 + roundIndex * 31);
    const correctTool = problems[problemKey]?.tool;
    if (shuffled.length > 1 && shuffled[0] === correctTool) {
      const offset = ((stage.id + roundIndex) % (shuffled.length - 1)) + 1;
      return [...shuffled.slice(offset), ...shuffled.slice(0, offset)];
    }
    return shuffled;
  }

  function seededShuffle(items, seed) {
    const output = [...items];
    let value = seed || 1;
    for (let index = output.length - 1; index > 0; index -= 1) {
      value = (value * 1664525 + 1013904223) >>> 0;
      const swapIndex = value % (index + 1);
      [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
    }
    return output;
  }

  function weatherEffects(problemKey) {
    if (problemKey === "rain") return "<span>\u{1F4A7}</span><span>\u{2601}\u{FE0F}</span><span>\u{1F4A7}</span>";
    if (problemKey === "puddle") return "<span>\u{1F4A6}</span><span>\u{1F4A7}</span>";
    if (problemKey === "heat") return "<span>\u{2600}\u{FE0F}</span><span>\u{1F321}\u{FE0F}</span>";
    if (problemKey === "dark") return "<span>\u{1F319}</span><span>\u{2728}</span>";
    if (problemKey === "thunder") return "<span>\u{26A1}</span><span>\u{1F329}\u{FE0F}</span>";
    if (problemKey === "muddy") return "<span>\u{1F43E}</span><span>\u{1F7E4}</span>";
    if (problemKey === "cold") return "<span>\u{2744}\u{FE0F}</span><span>\u{1F9CA}</span>";
    if (problemKey === "windy") return "<span>\u{1F32C}\u{FE0F}</span><span>\u{1F343}</span>";
    return "<span>\u{1F37D}\u{FE0F}</span><span>\u{2754}</span>";
  }

  function installToolControl(button) {
    button.addEventListener("click", () => {
      if (button.dataset.skipClick === "1") return;
      chooseTool(button.dataset.tool, button);
    });
    button.addEventListener("pointerdown", (event) => {
      if (!running || busy) return;
      dragState = {
        tool: button.dataset.tool,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
        ghost: null,
        button,
      };
      button.setPointerCapture?.(event.pointerId);
    });
    button.addEventListener("pointermove", (event) => {
      if (!dragState || dragState.tool !== button.dataset.tool) return;
      const dx = event.clientX - dragState.startX;
      const dy = event.clientY - dragState.startY;
      if (Math.hypot(dx, dy) > 8) dragState.moved = true;
      if (dragState.moved && !dragState.ghost) dragState.ghost = makeGhost(dragState.button, event.clientX, event.clientY);
      moveGhost(event.clientX, event.clientY);
      nodes.board.querySelector(".animal-zone")?.classList.toggle("drag-over", isOverAnimal(event.clientX, event.clientY));
    });
    button.addEventListener("pointerup", (event) => {
      if (!dragState || dragState.tool !== button.dataset.tool) return;
      if (dragState.moved) {
        button.dataset.skipClick = "1";
        window.setTimeout(() => {
          delete button.dataset.skipClick;
        }, 0);
      }
      const shouldDrop = dragState.moved && isOverAnimal(event.clientX, event.clientY);
      cleanupDrag();
      if (shouldDrop) chooseTool(button.dataset.tool, button);
    });
    button.addEventListener("pointercancel", cleanupDrag);
    button.addEventListener("lostpointercapture", () => {
      requestAnimationFrame(() => {
        if (dragState?.button === button) cleanupDrag();
      });
    });
  }

  function makeGhost(button, x, y) {
    const ghost = document.createElement("div");
    ghost.className = "tool-drag-ghost";
    ghost.innerHTML = button.querySelector("i")?.innerHTML || "";
    document.body.append(ghost);
    moveGhost(x, y, ghost);
    return ghost;
  }

  function moveGhost(x, y, ghost = dragState?.ghost) {
    if (!ghost) return;
    ghost.style.left = `${x}px`;
    ghost.style.top = `${y}px`;
  }

  function isOverAnimal(x, y) {
    const zone = nodes.board.querySelector(".animal-zone");
    if (!zone) return false;
    const rect = zone.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }

  function cleanupDrag() {
    const activeDrag = dragState;
    dragState = null;
    nodes.board.querySelector(".animal-zone")?.classList.remove("drag-over");
    activeDrag?.ghost?.remove();
    if (activeDrag?.button?.hasPointerCapture?.(activeDrag.pointerId)) {
      activeDrag.button.releasePointerCapture?.(activeDrag.pointerId);
    }
  }

  function chooseTool(tool, button) {
    if (!running || busy) return;
    busy = true;
    const stage = stages[currentStage];
    const problemKey = stage.rounds[roundIndex];
    const correct = problems[problemKey].tool === tool;
    const zone = nodes.board.querySelector(".animal-zone");
    if (correct) {
      score += 1;
      button.classList.add("correct");
      zone?.classList.add("happy");
      showFace("\u{1F604}", "happy");
      nodes.hintText.textContent = t("correct");
      playSound("success");
    } else {
      mistakes += 1;
      button.classList.add("wrong");
      zone?.classList.add("sad");
      showFace("\u{1F622}", "sad");
      nodes.hintText.textContent = t("wrong");
      playSound("wrong");
    }
    track("weather_tool", { stage: stage.id, problem: problemKey, tool, correct, mistakes });
    scheduleCareTask(() => {
      busy = false;
      if (!correct) {
        button.classList.remove("wrong");
        zone?.classList.remove("sad");
        return;
      }
      roundIndex += 1;
      if (roundIndex >= stage.rounds.length) {
        finishStage();
        return;
      }
      renderRound(correct ? "+1" : "", true);
    }, 760);
  }

  function showFace(face, kind) {
    const pop = document.createElement("div");
    pop.className = `face-pop ${kind}`;
    pop.textContent = face;
    nodes.board.querySelector(".rescue-scene")?.append(pop);
    window.setTimeout(() => pop.remove(), 720);
  }

  function starCount(stage) {
    if (score >= stage.rounds.length && mistakes === 0) return 3;
    if (score >= stage.target && mistakes <= 2) return 2;
    if (score >= Math.max(1, stage.target - 1)) return 1;
    return 0;
  }

  function skillStars(value) {
    const count = clamp(value, 1, 5);
    return `${"\u2605".repeat(count)}${"\u2606".repeat(5 - count)}`;
  }

  function scoreStars(maxScore, offset = 0) {
    return clamp(Math.ceil((score / maxScore) * 5) + offset, 1, 5);
  }

  function updateProgress(stage, stars) {
    const previous = readProgress()[stage.id] || {};
    const previousBest = Number(previous.bestScore) || 0;
    const bestScore = Math.max(previousBest, score);
    const improvementPercent = previousBest > 0 ? Math.round(((score - previousBest) / previousBest) * 100) : score > 0 ? 100 : 0;
    saveProgress(stage.id, {
      lastScore: score,
      bestScore,
      previousBest,
      playCount: (Number(previous.playCount) || 0) + 1,
      lastPlayedAt: new Date().toISOString(),
      improvementPercent,
      stars,
      total: stage.rounds.length,
      mistakes,
    });
  }

  function renderSkillReport(stage) {
    const progress = readProgress()[stage.id] || {};
    const previousBest = Number(progress.previousBest) || 0;
    const improvementPercent = Number(progress.improvementPercent) || 0;
    const messageKey = score >= stage.target ? (mistakes <= 1 ? "reportGreat" : "reportGood") : "reportTry";
    nodes.skillReport.innerHTML = `
      <h2>${t("reportTitle")}</h2>
      <dl>
        <dt>${t("previousBest")}</dt><dd>${previousBest} / ${stage.rounds.length}</dd>
        <dt>${t("todayScore")}</dt><dd>${score} / ${stage.rounds.length}</dd>
        <dt>${t("improvement")}</dt><dd>${improvementPercent > 0 ? `+${improvementPercent}%` : "0%"}</dd>
        <dt>${t("problemSolving")}</dt><dd class="stars">${skillStars(scoreStars(stage.rounds.length))}</dd>
        <dt>${t("focus")}</dt><dd class="stars">${skillStars(scoreStars(stage.rounds.length, -1))}</dd>
        <dt>${t("animalCare")}</dt><dd class="stars">${skillStars(scoreStars(stage.rounds.length))}</dd>
      </dl>
      <p>${t(messageKey)}</p>
    `;
  }

  function finishStage() {
    invalidateCareTransition();
    cleanupDrag();
    running = false;
    const stage = stages[currentStage];
    const stars = starCount(stage);
    const cleared = score >= stage.target;
    updateProgress(stage, stars);
    records[stage.id] = Math.max(records[stage.id] || 0, stars);
    if (cleared && stage.id < stages.length) unlocked = Math.max(unlocked, stage.id + 1);
    saveRecords();
    nodes.playPanel.classList.add("result-active");
    nodes.resultPanel.classList.remove("hidden");
    nodes.resultTitle.textContent = cleared ? t("clear") : t("failed");
    nodes.starText.textContent = `${"\u2605".repeat(stars)}${"\u2606".repeat(3 - stars)}`;
    nodes.resultText.textContent = cleared
      ? t("result", { score, best: records[stage.id] || stars })
      : t("resultFailed");
    renderSkillReport(stage);
    nodes.nextStageBtn.classList.toggle("hidden", !cleared || stage.id >= stages.length);
    (cleared && stage.id < stages.length ? nodes.nextStageBtn : nodes.retryBtn).focus({ preventScroll: true });
    renderStageGrid();
    playSound(cleared ? "success" : "wrong");
    track("game_complete", { stage: stage.id, score, stars, cleared, mistakes });
  }

  function showMenu() {
    invalidateCareTransition();
    running = false;
    busy = false;
    cleanupDrag();
    nodes.playPanel.classList.add("hidden");
    nodes.playPanel.classList.remove("result-active");
    nodes.resultPanel.classList.add("hidden");
    nodes.menuPanel.classList.add("hidden");
    nodes.stagePanel.classList.remove("hidden");
    document.body.classList.remove("helper-playing");
    document.body.classList.add("wp-standard-stage-page");
    document.querySelector(".weather-game")?.setAttribute("data-play-viewport", "");
    renderStageGrid();
    updateWeatherFrame();
  }

  function showMain() {
    cleanupDrag();
    nodes.stagePanel.classList.add("hidden");
    nodes.menuPanel.classList.remove("hidden");
    document.body.classList.remove("wp-standard-stage-page");
  }

  function showFloatingText(message) {
    const toast = document.createElement("div");
    toast.className = "floating-toast";
    toast.textContent = message;
    document.body.append(toast);
    window.setTimeout(() => toast.remove(), 1300);
  }

  window.addEventListener("blur", cleanupDrag);
  window.addEventListener("pagehide", cleanupDrag);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cleanupDrag();
  });

  function installLoading() {
    let progress = 0;
    const id = window.setInterval(() => {
      progress = Math.min(100, progress + 25);
      nodes.loadingText.textContent = `${progress}%`;
      nodes.loadingFill.style.width = `${progress}%`;
      if (progress >= 100) {
        window.clearInterval(id);
        window.setTimeout(() => {
          nodes.loadingPanel.classList.add("hidden");
          track("game_ready");
        }, 100);
      }
    }, 80);
  }

  nodes.startGameBtn.addEventListener("click", showMenu);
  nodes.stageBackBtn.addEventListener("click", showMain);
  nodes.localeSelect.addEventListener("change", (event) => {
    locale = event.target.value;
    localStorage.setItem(localeKey, locale);
    window.WonderI18n?.setLocale?.(locale);
    localizeStatic();
    renderStageGrid();
    if (running) renderRound();
  });
  nodes.backToStagesBtn.addEventListener("click", showMenu);
  nodes.homeLink.addEventListener("click", (event) => {
    if (!document.body.classList.contains("helper-playing")) return;
    event.preventDefault();
    showMenu();
  });
  nodes.resultStagesBtn.addEventListener("click", showMenu);
  nodes.retryBtn.addEventListener("click", () => {
    track("game_restart", { stage: currentStage + 1 });
    startStage(currentStage);
  });
  nodes.nextStageBtn.addEventListener("click", () => startStage(Math.min(currentStage + 1, stages.length - 1)));

  localizeStatic();
  renderStageGrid();
  installLoading();
})();
