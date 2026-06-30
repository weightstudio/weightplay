(() => {
  const GAME_ID = "shape-train";
  const localeKey = "weightplayLocale";
  const unlockKey = "weightplay_shape_train_unlocked";
  const starKey = "weightplay_shape_train_stars";

  const text = {
    en: {
      gameTitle: "Shape Train",
      language: "Language",
      chooseStage: "Choose Stage",
      menuHint: "Match shape friends to the right train cars.",
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
      stage: "Stage {n}",
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
      gameTitle: "形狀小火車",
      language: "語言",
      chooseStage: "選擇關卡",
      menuHint: "把形狀朋友送到相同形狀的車廂。",
      stages: "選關",
      loading: "載入中",
      nextStage: "下一關",
      retry: "再玩一次",
      lobby: "大廳",
      locked: "關卡未解鎖",
      perfect: "完美列車長！",
      good: "配對很棒！",
      keep: "再試試看！",
      result: "你幫 {count} 位形狀朋友搭上火車。",
      stage: "第 {n} 關",
      prompt: "把{shape}送到一樣的車廂。",
      correct: "上車成功！",
      wrong: "找一樣的形狀看看。",
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

  const shapes = {
    circle: { className: "shape-circle", color: "#ff595e", icon: "●" },
    square: { className: "shape-square", color: "#1982c4", icon: "■" },
    triangle: { className: "shape-triangle", color: "#ffca3a", icon: "▲" },
    star: { className: "shape-star", color: "#8ac926", icon: "★" },
    diamond: { className: "shape-diamond", color: "#6a4c93", icon: "◆" },
    heart: { className: "shape-heart", color: "#ff7ab6", icon: "♥" },
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
  let currentShape = "circle";
  let selectedPassenger = false;
  let acceptingInput = false;

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
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
    nodes.localeSelect.value = locale;
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
        <b>${stage.cars.map((shape) => shapes[shape].icon).join(" ")}</b>
        <strong>${t("stage", { n: stageNo })}</strong>
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
  }

  function showMenu() {
    nodes.menuPanel.classList.remove("hidden");
    nodes.playPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    selectedPassenger = false;
    renderStageGrid();
  }

  function startStage(index) {
    currentStage = index;
    currentTask = 0;
    mistakes = 0;
    acceptingInput = true;
    selectedPassenger = false;
    nodes.menuPanel.classList.add("hidden");
    nodes.playPanel.classList.remove("hidden");
    nodes.resultPanel.classList.add("hidden");
    renderCars();
    renderTask();
    playSound("start");
    track("game_start", { level: index + 1 });
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
      car.style.background = `linear-gradient(180deg, ${shapes[shape].color}, ${shade(shapes[shape].color, -20)})`;
      car.innerHTML = `<span>${shapes[shape].icon}</span>`;
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
    nodes.passengerShape.className = shape.className;
    nodes.passengerShape.style.background = shape.color;
    nodes.passengerBtn.style.borderColor = shape.color;
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
      nodes.feedbackText.textContent = t("wrong");
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
    car.classList.add("correct");
    nodes.feedbackText.textContent = t("correct");
    playSound("success");
    track("game_answer", { level: currentStage + 1, correct: true, task: currentShape, answer: shape });
    setTimeout(() => {
      currentTask += 1;
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
    stars[stageNo] = Math.max(stars[stageNo] || 0, earned);
    saveStars();
    if (stageNo === unlocked && unlocked < stages.length) {
      unlocked += 1;
      localStorage.setItem(unlockKey, String(unlocked));
    }
    nodes.progressFill.style.width = "100%";
    nodes.resultTitle.textContent = earned === 3 ? t("perfect") : earned === 2 ? t("good") : t("keep");
    nodes.starText.textContent = "★".repeat(earned) + "☆".repeat(3 - earned);
    nodes.resultText.textContent = t("result", { count: stages[currentStage].tasks.length });
    nodes.nextStageBtn.classList.toggle("hidden", currentStage >= stages.length - 1);
    nodes.resultPanel.classList.remove("hidden");
    playSound("win");
    track("game_complete", { level: stageNo, stars: earned, mistakes });
  }

  function shade(hex, percent) {
    const value = Number.parseInt(hex.slice(1), 16);
    const amount = Math.round(2.55 * percent);
    const r = clamp((value >> 16) + amount, 0, 255);
    const g = clamp(((value >> 8) & 0xff) + amount, 0, 255);
    const b = clamp((value & 0xff) + amount, 0, 255);
    return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
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
    nodes.localeSelect.addEventListener("change", () => {
      locale = nodes.localeSelect.value;
      localStorage.setItem(localeKey, locale);
      localizeStatic();
      renderStageGrid();
      if (!nodes.playPanel.classList.contains("hidden")) {
        renderTask();
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
