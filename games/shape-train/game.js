(() => {
  const GAME_ID = "shape-train";
  const localeKey = "weightplayLocale";
  const unlockKey = "weightplay_shape_train_unlocked";
  const starKey = "weightplay_shape_train_stars";

  const text = {
    en: {
      pageTitle: "Animal Shape Train - WeightPlay",
      metaDescription:
        "Play Animal Shape Train on WeightPlay, a gentle preschool animal train game for matching colorful shapes, practicing early logic, and building hand-eye coordination.",
      metaOgTitle: "Animal Shape Train - Preschool Shape Matching Game",
      metaOgDescription: "Help animal shape passengers board the right train cars in a short, picture-based preschool matching game.",
      gameTitle: "Animal Shape Train",
      language: "Language",
      chooseStage: "Choose Stage",
      menuHint: "Match shape friends to the right train cars.",
      previewAction: "Tap or drag the shape friend",
      stages: "Stages",
      loading: "Loading",
      nextStage: "Next Stage",
      retry: "Try Again",
      lobby: "Lobby",
      locked: "Stage locked",
      perfect: "Perfect conductor!",
      good: "Great matching!",
      keep: "Keep trying!",
      result: "You helped {count} shape friends ride the train.",
      skillReport: "Skill Report",
      logic: "Logic",
      logicValue: "{count} shape matches",
      focus: "Focus",
      focusValue: "First try: {firstTry} · Retries: {retries}",
      coordination: "Hand-Eye Coordination",
      coordinationValue: "{count} friends boarded",
      firstFinish: "First finish: {stars} stars",
      progress: "Today: {stars} stars · Previous best: {previous}",
      newBest: "New best: {stars} stars · Previous best: {previous}",
      stage: "Stage {n}",
      stageGoal: "{cars} cars / {tasks} passengers",
      prompt: "Send the {shape} to its matching car.",
      correct: "All aboard!",
      wrong: "Try the matching car.",
      shapes: {
        circle: "circle",
        square: "square",
        triangle: "triangle",
        star: "star",
        diamond: "diamond",
        heart: "heart",
      },
    },
    "zh-Hant": {
      pageTitle: "動物形狀小火車 - WeightPlay",
      metaDescription: "在 WeightPlay 遊玩動物形狀小火車，幫可愛的形狀乘客搭上正確車廂，練習形狀辨識、基礎邏輯與手眼協調。",
      metaOgTitle: "動物形狀小火車 - 兒童形狀配對遊戲",
      metaOgDescription: "幫動物形狀乘客搭上正確的小火車車廂，適合短時間遊玩的親子形狀配對遊戲。",
      gameTitle: "動物形狀小火車",
      language: "語言",
      chooseStage: "選擇關卡",
      menuHint: "把形狀朋友送到正確的小火車車廂。",
      previewAction: "點擊或拖曳形狀朋友",
      stages: "關卡",
      loading: "載入中",
      nextStage: "下一關",
      retry: "再試一次",
      lobby: "大廳",
      locked: "關卡尚未解鎖",
      perfect: "完美列車長！",
      good: "配對很棒！",
      keep: "繼續練習！",
      result: "你幫 {count} 位形狀朋友搭上小火車。",
      skillReport: "技能報告",
      logic: "邏輯",
      logicValue: "完成 {count} 次形狀配對",
      focus: "專注",
      focusValue: "一次成功 {firstTry} 次 · 再試 {retries} 次",
      coordination: "手眼協調",
      coordinationValue: "送 {count} 位朋友上車",
      firstFinish: "第一次完成：{stars} 顆星",
      progress: "本次：{stars} 顆星 · 之前最佳：{previous}",
      newBest: "新的最佳：{stars} 顆星 · 之前最佳：{previous}",
      stage: "第 {n} 關",
      stageGoal: "{cars} 種車廂 / {tasks} 位乘客",
      prompt: "把{shape}送到相同形狀的車廂。",
      correct: "上車成功！",
      wrong: "找找相同形狀的車廂。",
      shapes: {
        circle: "圓形",
        square: "正方形",
        triangle: "三角形",
        star: "星形",
        diamond: "菱形",
        heart: "愛心",
      },
    },
  };

  const trainCarAsset = "../../assets/shape-train-car.svg";
  const shapes = {
    circle: { token: "../../assets/shape-token-circle.svg" },
    square: { token: "../../assets/shape-token-square.svg" },
    triangle: { token: "../../assets/shape-token-triangle.svg" },
    star: { token: "../../assets/shape-token-star.svg" },
    diamond: { token: "../../assets/shape-token-diamond.svg" },
    heart: { token: "../../assets/shape-token-heart.svg" },
  };

  const stages = [
    { cars: ["circle", "square"], tasks: ["circle", "square", "circle", "square"] },
    { cars: ["circle", "square", "triangle"], tasks: ["triangle", "circle", "square", "triangle", "circle"] },
    { cars: ["circle", "square", "triangle", "star"], tasks: ["star", "triangle", "circle", "square", "star", "circle"] },
    { cars: ["square", "triangle", "star", "diamond"], tasks: ["diamond", "square", "star", "triangle", "diamond", "star"] },
    { cars: ["circle", "star", "diamond", "heart"], tasks: ["heart", "circle", "diamond", "star", "heart", "diamond"] },
    { cars: ["circle", "square", "triangle", "star", "diamond", "heart"], tasks: ["circle", "heart", "triangle", "diamond", "square", "star", "heart", "circle"] },
  ];

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
    progressFill: $("progressFill"),
    carGrid: $("carGrid"),
    promptText: $("promptText"),
    passengerBtn: $("passengerBtn"),
    passengerShape: $("passengerShape"),
    feedbackText: $("feedbackText"),
    resultPanel: $("resultPanel"),
    resultTitle: $("resultTitle"),
    starText: $("starText"),
    resultText: $("resultText"),
    skillReportTitle: $("skillReportTitle"),
    logicLabel: $("logicLabel"),
    logicValue: $("logicValue"),
    focusLabel: $("focusLabel"),
    focusValue: $("focusValue"),
    coordinationLabel: $("coordinationLabel"),
    coordinationValue: $("coordinationValue"),
    progressComparison: $("progressComparison"),
    nextStageBtn: $("nextStageBtn"),
    retryBtn: $("retryBtn"),
    resultStagesBtn: $("resultStagesBtn"),
    loadingPanel: $("loadingPanel"),
    loadingText: $("loadingText"),
    loadingFill: $("loadingFill"),
  };

  let locale = localStorage.getItem(localeKey) || "en";
  let unlocked = clamp(Number(localStorage.getItem(unlockKey)) || 1, 1, stages.length);
  let stars = readStars();
  let currentStage = 0;
  let currentTask = 0;
  let mistakes = 0;
  let firstTryMatches = 0;
  let currentTaskMistakes = 0;
  let currentShape = "circle";
  let selectedPassenger = false;
  let acceptingInput = false;
  let feedbackKey = "";
  let lastResult = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function readStars() {
    try {
      return JSON.parse(localStorage.getItem(starKey) || "{}");
    } catch {
      return {};
    }
  }

  function saveStars() {
    localStorage.setItem(starKey, JSON.stringify(stars));
  }

  function t(key, data) {
    const parts = key.split(".");
    let value = text[locale] || text.en;
    for (const part of parts) value = value?.[part];
    if (typeof value !== "string") value = key;
    return Object.entries(data || {}).reduce((out, [name, item]) => out.replaceAll(`{${name}}`, item), value);
  }

  function playSound(name) {
    window.WonderSound?.play?.(name);
  }

  function track(event, payload = {}) {
    window.WonderAnalytics?.track(event, { game_id: GAME_ID, ...payload });
  }

  function localizeStatic() {
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : "en";
    updatePageMeta();
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
    nodes.localeSelect.value = locale;
  }

  function updateMetaContent(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.setAttribute("content", value);
  }

  function updatePageMeta() {
    document.title = t("pageTitle");
    updateMetaContent('meta[name="description"]', t("metaDescription"));
    updateMetaContent('meta[property="og:title"]', t("metaOgTitle"));
    updateMetaContent('meta[property="og:description"]', t("metaOgDescription"));
    updateMetaContent('meta[name="twitter:title"]', t("metaOgTitle"));
    updateMetaContent('meta[name="twitter:description"]', t("metaOgDescription"));
  }

  function renderStageGrid() {
    nodes.stageGrid.innerHTML = "";
    stages.forEach((stage, index) => {
      const stageNo = index + 1;
      const button = document.createElement("button");
      button.className = "stage-card";
      button.type = "button";
      if (stageNo > unlocked) button.classList.add("locked");
      button.innerHTML = `
        <b class="stage-shapes">${stage.cars.map((shape) => `<img src="${shapes[shape].token}" alt="" />`).join("")}</b>
        <strong>${t("stage", { n: stageNo })}</strong>
        <em>${t("stageGoal", { cars: stage.cars.length, tasks: stage.tasks.length })}</em>
        <span>${"★".repeat(stars[stageNo] || 0)}${"☆".repeat(3 - (stars[stageNo] || 0))}</span>
      `;
      button.addEventListener("click", () => {
        if (stageNo > unlocked) {
          showFloatingText(t("locked"));
          playSound("click");
          return;
        }
        startStage(index);
      });
      nodes.stageGrid.appendChild(button);
    });
    requestAnimationFrame(() => {
      const available = [...nodes.stageGrid.querySelectorAll(".stage-card:not(.locked)")].at(-1);
      available?.scrollIntoView({ block: "nearest", inline: "center", behavior: "auto" });
    });
  }

  function updateShapeFrame() {
    if (!document.body.classList.contains("shape-playing")) return;
    const viewport = window.visualViewport;
    const visualWidth = Math.round(viewport?.width || 0);
    const visualHeight = Math.round(viewport?.height || 0);
    const useVisual = visualWidth > 0
      && visualHeight > 0
      && Math.abs(visualWidth - innerWidth) <= 2
      && visualHeight <= innerHeight + 2;
    document.documentElement.style.setProperty("--shape-vw", `${useVisual ? visualWidth : innerWidth}px`);
    document.documentElement.style.setProperty("--shape-vh", `${useVisual ? visualHeight : innerHeight}px`);
  }

  function exitSharedPlayViewport() {
    window.WeightPlayGame?.exitMobileGameMode?.();
    document.body.classList.remove("weightplay-active-viewport", "wp-mobile-game-mode");
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    if (document.webkitFullscreenElement) document.webkitExitFullscreen?.();
  }

  window.addEventListener("resize", updateShapeFrame);
  window.addEventListener("orientationchange", updateShapeFrame);
  window.visualViewport?.addEventListener("resize", updateShapeFrame, { passive: true });

  function showMenu() {
    nodes.menuPanel.classList.add("hidden");
    nodes.stagePanel.classList.remove("hidden");
    nodes.playPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.playPanel.classList.remove("is-result");
    document.body.classList.remove("shape-playing");
    document.body.classList.add("wp-standard-stage-page");
    document.querySelector(".shape-game")?.setAttribute("data-play-viewport", "");
    selectedPassenger = false;
    renderStageGrid();
  }

  function showMain() {
    nodes.stagePanel.classList.add("hidden");
    nodes.menuPanel.classList.remove("hidden");
    document.body.classList.remove("wp-standard-stage-page");
  }

  function focusPlayPanel() {
    const targetY = Math.max(0, nodes.playPanel.getBoundingClientRect().top + window.scrollY - 8);
    window.scrollTo({ top: targetY, left: 0, behavior: "auto" });
    requestAnimationFrame(() => {
      const refreshedY = Math.max(0, nodes.playPanel.getBoundingClientRect().top + window.scrollY - 8);
      window.scrollTo({ top: refreshedY, left: 0, behavior: "auto" });
    });
  }

  function startStage(index) {
    currentStage = index;
    currentTask = 0;
    mistakes = 0;
    firstTryMatches = 0;
    currentTaskMistakes = 0;
    acceptingInput = true;
    selectedPassenger = false;
    feedbackKey = "";
    lastResult = null;
    nodes.menuPanel.classList.add("hidden");
    nodes.stagePanel.classList.add("hidden");
    nodes.playPanel.classList.remove("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.playPanel.classList.remove("is-result");
    document.body.classList.remove("wp-standard-stage-page");
    document.body.classList.add("shape-playing");
    document.querySelector(".shape-game")?.removeAttribute("data-play-viewport");
    renderCars();
    renderTask();
    exitSharedPlayViewport();
    updateShapeFrame();
    playSound("start");
    track("game_start", { level: index + 1 });
    requestAnimationFrame(() => {
      exitSharedPlayViewport();
      updateShapeFrame();
    });
  }

  function renderCars() {
    const stage = stages[currentStage];
    nodes.carGrid.innerHTML = "";
    nodes.carGrid.style.gridTemplateColumns = `repeat(${Math.min(stage.cars.length, 4)}, minmax(0, 1fr))`;
    stage.cars.forEach((shape) => {
      const car = document.createElement("button");
      car.className = "train-car";
      car.type = "button";
      car.dataset.shape = shape;
      car.innerHTML = `
        <img class="car-art" src="${trainCarAsset}" alt="" />
        <img class="car-shape" src="${shapes[shape].token}" alt="${t(`shapes.${shape}`)}" />
      `;
      car.addEventListener("click", () => chooseCar(shape, car));
      car.addEventListener("dragover", (event) => event.preventDefault());
      car.addEventListener("drop", (event) => {
        event.preventDefault();
        chooseCar(shape, car);
      });
      nodes.carGrid.appendChild(car);
    });
  }

  function renderTask() {
    const stage = stages[currentStage];
    currentShape = stage.tasks[currentTask];
    const shape = shapes[currentShape];
    nodes.stageText.textContent = t("stage", { n: currentStage + 1 });
    nodes.progressFill.style.width = `${(currentTask / stage.tasks.length) * 100}%`;
    nodes.promptText.textContent = t("prompt", { shape: t(`shapes.${currentShape}`) });
    nodes.feedbackText.textContent = "";
    feedbackKey = "";
    nodes.passengerShape.className = "shape-token";
    nodes.passengerShape.dataset.shape = currentShape;
    nodes.passengerShape.innerHTML = `<img src="${shape.token}" alt="${t(`shapes.${currentShape}`)}" />`;
    nodes.passengerBtn.classList.remove("wrong");
    selectedPassenger = false;
    markTarget(false);
  }

  function chooseCar(shape, car) {
    if (!acceptingInput) return;
    if (!selectedPassenger) {
      selectedPassenger = true;
      markTarget(true);
    }
    if (shape !== currentShape) {
      mistakes += 1;
      currentTaskMistakes += 1;
      feedbackKey = "wrong";
      nodes.feedbackText.textContent = t(feedbackKey);
      car.classList.remove("wrong");
      nodes.passengerBtn.classList.remove("wrong");
      void car.offsetWidth;
      car.classList.add("wrong");
      nodes.passengerBtn.classList.add("wrong");
      playSound("wrong");
      track("game_answer", { level: currentStage + 1, correct: false, task: currentShape, answer: shape });
      return;
    }

    acceptingInput = false;
    if (currentTaskMistakes === 0) firstTryMatches += 1;
    car.classList.add("correct");
    feedbackKey = "correct";
    nodes.feedbackText.textContent = t(feedbackKey);
    playSound("success");
    track("game_answer", { level: currentStage + 1, correct: true, task: currentShape, answer: shape });
    setTimeout(() => {
      currentTask += 1;
      currentTaskMistakes = 0;
      car.classList.remove("correct");
      if (currentTask >= stages[currentStage].tasks.length) {
        finishStage();
      } else {
        acceptingInput = true;
        renderTask();
      }
    }, 520);
  }

  function markTarget(active) {
    nodes.carGrid.querySelectorAll(".train-car").forEach((car) => {
      car.classList.toggle("target", active && car.dataset.shape === currentShape);
    });
  }

  function finishStage() {
    const stageNo = currentStage + 1;
    const earned = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    const previousBest = stars[stageNo] || 0;
    stars[stageNo] = Math.max(stars[stageNo] || 0, earned);
    saveStars();
    if (stageNo === unlocked && unlocked < stages.length) {
      unlocked += 1;
      localStorage.setItem(unlockKey, String(unlocked));
    }
    nodes.progressFill.style.width = "100%";
    lastResult = { earned, previousBest, count: stages[currentStage].tasks.length };
    renderResult(lastResult);
    nodes.playPanel.classList.add("is-result");
    nodes.resultPanel.classList.remove("hidden");
    playSound("win");
    track("game_complete", { level: stageNo, stars: earned, mistakes });
  }

  function renderResult(result) {
    nodes.resultTitle.textContent = result.earned === 3 ? t("perfect") : result.earned === 2 ? t("good") : t("keep");
    nodes.starText.textContent = "★".repeat(result.earned) + "☆".repeat(3 - result.earned);
    nodes.resultText.textContent = t("result", { count: result.count });
    renderSkillReport(result.earned, result.previousBest);
    nodes.nextStageBtn.classList.toggle("hidden", currentStage >= stages.length - 1);
  }

  function refreshActiveTaskLocale() {
    nodes.stageText.textContent = t("stage", { n: currentStage + 1 });
    nodes.promptText.textContent = t("prompt", { shape: t(`shapes.${currentShape}`) });
    nodes.passengerShape.querySelector("img")?.setAttribute("alt", t(`shapes.${currentShape}`));
    nodes.carGrid.querySelectorAll(".train-car").forEach((car) => {
      car.querySelector(".car-shape")?.setAttribute("alt", t(`shapes.${car.dataset.shape}`));
    });
    if (feedbackKey) nodes.feedbackText.textContent = t(feedbackKey);
  }

  function renderSkillReport(earned, previousBest) {
    const matches = stages[currentStage].tasks.length;
    nodes.skillReportTitle.textContent = t("skillReport");
    nodes.logicLabel.textContent = t("logic");
    nodes.logicValue.textContent = t("logicValue", { count: matches });
    nodes.focusLabel.textContent = t("focus");
    nodes.focusValue.textContent = t("focusValue", { firstTry: firstTryMatches, retries: mistakes });
    nodes.coordinationLabel.textContent = t("coordination");
    nodes.coordinationValue.textContent = t("coordinationValue", { count: matches });
    nodes.progressComparison.textContent = previousBest > 0
      ? t(earned > previousBest ? "newBest" : "progress", { stars: earned, previous: previousBest })
      : t("firstFinish", { stars: earned });
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

  function initPassenger() {
    nodes.passengerBtn.addEventListener("click", () => {
      if (!acceptingInput) return;
      selectedPassenger = true;
      markTarget(true);
      playSound("click");
    });
    nodes.passengerBtn.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", currentShape);
      selectedPassenger = true;
      markTarget(true);
    });
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
    nodes.startGameBtn.addEventListener("click", showMenu);
    nodes.stageBackBtn.addEventListener("click", showMain);
    nodes.localeSelect.addEventListener("change", () => {
      locale = nodes.localeSelect.value;
      localStorage.setItem(localeKey, locale);
      localizeStatic();
      renderStageGrid();
      if (!nodes.resultPanel.classList.contains("hidden") && lastResult) {
        renderResult(lastResult);
      } else if (!nodes.playPanel.classList.contains("hidden")) {
        refreshActiveTaskLocale();
      }
    });
    nodes.backToStagesBtn.addEventListener("click", showMenu);
    nodes.resultStagesBtn.addEventListener("click", showMenu);
    nodes.retryBtn.addEventListener("click", () => {
      track("game_restart", { level: currentStage + 1, mistakes });
      startStage(currentStage);
    });
    nodes.nextStageBtn.addEventListener("click", () => startStage(Math.min(currentStage + 1, stages.length - 1)));
  }

  const style = document.createElement("style");
  style.textContent = "@keyframes toastUp{to{transform:translate(-50%,-120%);opacity:0}}";
  document.head.appendChild(style);

  localizeStatic();
  bindEvents();
  initPassenger();
  renderStageGrid();
  initLoading();
})();
