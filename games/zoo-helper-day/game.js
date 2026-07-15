(() => {
  const GAME_ID = "zoo-helper-day";
  const assetVersion = "20260708-zoo-helper-day-clear-icons1";
  const localeKey = "weightPlayLocale";
  const unlockKey = "weightplay_zoo_helper_unlocked";
  const starKey = "weightplay_zoo_helper_stars";

  const text = {
    en: {
      gameTitle: "Zoo Helper Day",
      language: "Language",
      chooseStage: "Choose Stage",
      menuHint: "Help animals finish gentle care tasks.",
      stages: "Stages",
      loading: "Loading",
      nextStage: "Next Stage",
      retry: "Try Again",
      lobby: "Lobby",
      locked: "Stage locked",
      great: "Great job!",
      perfect: "Perfect helper!",
      good: "Good helper!",
      keep: "Keep helping!",
      result: "Shift complete: {station} earned {tickets} tickets and kept visitor happiness at {mood}%.",
      skillReport: "Skill Report",
      animalKnowledge: "Animal Knowledge",
      animalValue: "{count} care needs matched",
      focus: "Focus",
      focusValue: "First try: {firstTry} · Retries: {retries}",
      coordination: "Hand-Eye Coordination",
      coordinationValue: "{count} care choices completed",
      firstFinish: "First finish · {stars} stars",
      progress: "This time: {stars} · Previous best: {previous}",
      newBest: "New best: {stars} · Previous best: {previous}",
      stage: "Stage {n}",
      stageGoal: "{station} shift / {tickets} tickets",
      task: "{station}: help {animal} with {item}.",
      tickets: "Tickets {count}",
      mood: "Happiness {count}%",
      correct: "Nice help!",
      wrong: "Try another item.",
      careItemsAria: "Care item choices",
      items: {
        fruit: "Fruit",
        water: "Water",
        brush: "Brush",
        toy: "Toy",
        leaf: "Leaves",
        shower: "Shower",
        fish: "Fish",
        ball: "Ball",
      },
      animals: {
        lion: "Lion",
        panda: "Panda",
        elephant: "Elephant",
        penguin: "Penguin",
        giraffe: "Giraffe",
        monkey: "Monkey",
        koala: "Koala",
        zebra: "Zebra",
      },
      stations: {
        savanna: "Savanna Feeding",
        bamboo: "Bamboo Grove",
        bath: "Elephant Bath",
        ice: "Penguin Pool",
        lookout: "Giraffe Lookout",
        nursery: "Koala Nursery",
      },
    },
    "zh-Hant": {
      gameTitle: "動物園幫忙日",
      language: "語言",
      chooseStage: "選擇關卡",
      menuHint: "幫動物完成溫柔的照顧任務。",
      stages: "關卡",
      loading: "載入中",
      nextStage: "下一關",
      retry: "再試一次",
      lobby: "大廳",
      locked: "關卡尚未解鎖",
      great: "做得很好！",
      perfect: "完美小幫手！",
      good: "很棒的小幫手！",
      keep: "繼續幫忙！",
      result: "工作日完成：{station} 賺到 {tickets} 張票，遊客開心度保持 {mood}%。",
      skillReport: "技能報告",
      animalKnowledge: "動物知識",
      animalValue: "配對 {count} 個照顧需求",
      focus: "專注",
      focusValue: "一次成功 {firstTry} 次 · 重試 {retries} 次",
      coordination: "手眼協調",
      coordinationValue: "完成 {count} 次照顧選擇",
      firstFinish: "第一次完成 · {stars} 顆星",
      progress: "這次 {stars} 顆星 · 之前最佳 {previous} 顆星",
      newBest: "新的最佳：{stars} 顆星 · 之前最佳 {previous} 顆星",
      stage: "第 {n} 關",
      stageGoal: "{station} 班次 / {tickets} 張票",
      task: "{station}：幫 {animal} 準備{item}。",
      tickets: "票券 {count}",
      mood: "開心度 {count}%",
      correct: "幫得真好！",
      wrong: "試試看其他道具。",
      careItemsAria: "照顧道具選項",
      items: {
        fruit: "水果",
        water: "水",
        brush: "刷子",
        toy: "玩具",
        leaf: "葉子",
        shower: "沖澡",
        fish: "魚",
        ball: "球",
      },
      animals: {
        lion: "獅子",
        panda: "貓熊",
        elephant: "大象",
        penguin: "企鵝",
        giraffe: "長頸鹿",
        monkey: "猴子",
        koala: "無尾熊",
        zebra: "斑馬",
      },
      stations: {
        savanna: "草原餵食區",
        bamboo: "竹林休息區",
        bath: "大象沖澡區",
        ice: "企鵝水池",
        lookout: "長頸鹿觀景台",
        nursery: "無尾熊育幼區",
      },
    },
  };

  const itemIcons = {
    fruit: "../../assets/zoo-helper-day-fruit-apple.svg",
    water: "../../assets/zoo-helper-day-water-drop.svg",
    brush: "../../assets/zoo-helper-day-care-brush.svg",
    toy: "../../assets/zoo-helper-day-toy-block.svg",
    leaf: "../../assets/zoo-helper-day-leaf-bunch.svg",
    shower: "../../assets/zoo-helper-day-shower-head.svg",
    fish: "../../assets/zoo-helper-day-fish-treat.svg",
    ball: "../../assets/zoo-helper-day-play-ball.svg",
  };

  function iconSrc(item) {
    return `${itemIcons[item]}?v=${assetVersion}`;
  }

  function itemMeta(item) {
    return {
      id: item,
      label: t(`items.${item}`),
      icon: iconSrc(item),
    };
  }

  const animalAssets = {
    lion: "../../assets/weightplay-boom-mane-lion.png",
    panda: "../../assets/animal-zoo-panda.png",
    elephant: "../../assets/animal-zoo-elephant.png",
    penguin: "../../assets/animal-zoo-penguin.png",
    giraffe: "../../assets/animal-zoo-idle-giraffe.png",
    koala: "../../assets/tiny-weather-animal-koala.png",
  };

  const stages = [
    { animal: "lion", station: "savanna", tickets: 45, tasks: ["fruit", "water", "brush", "toy"], pool: ["fruit", "water", "brush", "toy", "leaf"] },
    { animal: "panda", station: "bamboo", tickets: 58, tasks: ["leaf", "water", "brush", "ball"], pool: ["leaf", "water", "brush", "ball", "fish"] },
    { animal: "elephant", station: "bath", tickets: 72, tasks: ["shower", "fruit", "water", "toy", "brush"], pool: ["shower", "fruit", "water", "toy", "brush"] },
    { animal: "penguin", station: "ice", tickets: 86, tasks: ["fish", "water", "ball", "brush", "fruit"], pool: ["fish", "water", "ball", "brush", "fruit"] },
    { animal: "giraffe", station: "lookout", tickets: 98, tasks: ["leaf", "water", "fruit", "brush", "toy"], pool: ["leaf", "water", "fruit", "brush", "toy"] },
    { animal: "koala", station: "nursery", tickets: 112, tasks: ["leaf", "water", "brush", "toy", "fruit"], pool: ["leaf", "water", "brush", "toy", "fruit", "ball"] },
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
    stationText: $("stationText"),
    ticketText: $("ticketText"),
    moodText: $("moodText"),
    progressFill: $("progressFill"),
    animalCard: $("animalCard"),
    animalEmoji: $("animalEmoji"),
    animalName: $("animalName"),
    requestText: $("requestText"),
    itemGrid: $("itemGrid"),
    feedbackText: $("feedbackText"),
    resultPanel: $("resultPanel"),
    resultTitle: $("resultTitle"),
    starText: $("starText"),
    resultText: $("resultText"),
    skillReportTitle: $("skillReportTitle"),
    animalKnowledgeLabel: $("animalKnowledgeLabel"),
    animalKnowledgeValue: $("animalKnowledgeValue"),
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
    gameShell: document.querySelector(".zoo-game"),
  };

  let locale = window.WonderI18n?.locale?.() || localStorage.getItem(localeKey) || "en";
  let unlocked = clamp(Number(localStorage.getItem(unlockKey)) || 1, 1, stages.length);
  let stars = readStars();
  let currentStage = 0;
  let currentTask = 0;
  let mistakes = 0;
  let firstTryTasks = 0;
  let currentTaskMistakes = 0;
  let lastResult = null;
  let acceptingInput = false;

  function updateBattleViewport() {
    if (!document.body.classList.contains("zoo-helper-playing")) return;
    const viewport = window.visualViewport;
    const width = Math.round(Math.min(viewport?.width || window.innerWidth, window.innerWidth));
    const height = Math.max(0, Math.round(Math.min(viewport?.height || window.innerHeight, window.innerHeight)));
    document.documentElement.classList.remove("wp-mobile-game-mode");
    document.body.classList.remove("wp-mobile-game-mode");
    nodes.gameShell?.classList.remove("weightplay-active-viewport");
    document.documentElement.style.setProperty("--zoo-live-width", `${width}px`);
    document.documentElement.style.setProperty("--zoo-live-height", `${height}px`);
    nodes.gameShell?.style.setProperty("position", "fixed", "important");
    nodes.gameShell?.style.setProperty("inset", "0 auto auto 50%", "important");
    nodes.gameShell?.style.setProperty("width", `${width}px`, "important");
    nodes.gameShell?.style.setProperty("max-width", "none", "important");
    nodes.gameShell?.style.setProperty("height", `${height}px`, "important");
    nodes.gameShell?.style.setProperty("min-height", "0", "important");
    nodes.gameShell?.style.setProperty("max-height", `${height}px`, "important");
    nodes.gameShell?.style.setProperty("transform", "translateX(-50%)", "important");
  }

  function setBattleViewport(active) {
    document.body.classList.toggle("zoo-helper-playing", active);
    if (active) {
      nodes.gameShell?.removeAttribute("data-play-viewport");
      window.WeightPlayGame?.exitMobileGameMode?.();
      updateBattleViewport();
      requestAnimationFrame(updateBattleViewport);
      setTimeout(updateBattleViewport, 160);
    } else {
      nodes.gameShell?.setAttribute("data-play-viewport", "");
      window.WeightPlayGame?.exitMobileGameMode?.();
      for (const property of ["position", "inset", "width", "max-width", "height", "min-height", "max-height", "transform"]) {
        nodes.gameShell?.style.removeProperty(property);
      }
    }
  }

  window.addEventListener("resize", updateBattleViewport);
  window.visualViewport?.addEventListener("resize", updateBattleViewport);

  function t(key, data) {
    const parts = key.split(".");
    let value = text[locale] || text.en;
    for (const part of parts) value = value?.[part];
    if (typeof value !== "string") value = key;
    return Object.entries(data || {}).reduce((out, [name, item]) => out.replaceAll(`{${name}}`, item), value);
  }

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
    nodes.itemGrid.setAttribute("aria-label", t("careItemsAria"));
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
        <b class="stage-icon"><img src="${animalAssets[stage.animal]}" alt="" /></b>
        <strong>${t("stage", { n: stageNo })} - ${t(`stations.${stage.station}`)}</strong>
        <em>${t("stageGoal", { station: t(`stations.${stage.station}`), tickets: stage.tickets })}</em>
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
    nodes.menuPanel.classList.add("hidden");
    nodes.stagePanel.classList.remove("hidden");
    nodes.playPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    setBattleViewport(false);
    document.body.classList.add("wp-standard-stage-page");
    renderStageGrid();
  }

  function showMain() {
    nodes.stagePanel.classList.add("hidden");
    nodes.menuPanel.classList.remove("hidden");
    document.body.classList.remove("wp-standard-stage-page");
  }

  function startStage(index) {
    currentStage = index;
    currentTask = 0;
    mistakes = 0;
    firstTryTasks = 0;
    currentTaskMistakes = 0;
    lastResult = null;
    acceptingInput = true;
    nodes.menuPanel.classList.add("hidden");
    nodes.stagePanel.classList.add("hidden");
    document.body.classList.remove("wp-standard-stage-page");
    nodes.playPanel.classList.remove("hidden");
    nodes.resultPanel.classList.add("hidden");
    setBattleViewport(true);
    track("game_start", { level: index + 1 });
    playSound("start");
    renderTask();
  }

  function renderTask() {
    const stage = stages[currentStage];
    const wanted = stage.tasks[currentTask];
    const mood = clamp(100 - mistakes * 12, 40, 100);
    nodes.stageText.textContent = t("stage", { n: currentStage + 1 });
    nodes.progressFill.style.width = `${(currentTask / stage.tasks.length) * 100}%`;
    nodes.stationText.textContent = t(`stations.${stage.station}`);
    nodes.ticketText.textContent = t("tickets", { count: stage.tickets + currentTask * 3 });
    nodes.moodText.textContent = t("mood", { count: mood });
    nodes.animalEmoji.innerHTML = `<img src="${animalAssets[stage.animal]}" alt="" />`;
    nodes.animalName.textContent = t(`animals.${stage.animal}`);
    nodes.requestText.textContent = t("task", { station: t(`stations.${stage.station}`), animal: t(`animals.${stage.animal}`), item: t(`items.${wanted}`) });
    nodes.animalCard.setAttribute("aria-label", nodes.requestText.textContent);
    nodes.feedbackText.textContent = "";
    renderItems(stage, wanted);
    requestAnimationFrame(() => nodes.animalCard.focus());
  }

  function renderItems(stage, wanted) {
    const choices = [wanted, ...stage.pool.filter((item) => item !== wanted)].slice(0, 4);
    choices.sort(() => Math.random() - 0.5);
    nodes.itemGrid.replaceChildren();
    nodes.itemGrid.setAttribute("aria-busy", "false");
    choices.forEach((item) => {
      const meta = itemMeta(item);
      const button = document.createElement("button");
      button.className = "item-card";
      button.type = "button";
      button.draggable = true;
      button.dataset.item = meta.id;
      button.dataset.icon = meta.icon;
      button.dataset.label = meta.label;
      button.setAttribute("aria-label", meta.label);

      const iconBox = document.createElement("b");
      const icon = new Image();
      icon.alt = meta.label;
      icon.loading = "eager";
      icon.decoding = "async";
      icon.dataset.item = meta.id;
      icon.onload = () => {
        if (button.dataset.item !== meta.id) return;
        iconBox.replaceChildren(icon);
      };
      icon.src = meta.icon;
      iconBox.replaceChildren(icon);

      const label = document.createElement("span");
      label.textContent = meta.label;
      button.replaceChildren(iconBox, label);

      button.addEventListener("click", () => chooseItem(meta.id, button));
      button.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", meta.id);
      });
      nodes.itemGrid.appendChild(button);
    });
    requestAnimationFrame(syncItemCards);
  }

  function syncItemCards() {
    nodes.itemGrid.querySelectorAll(".item-card").forEach((button) => {
      const item = button.dataset.item;
      const meta = itemMeta(item);
      const image = button.querySelector("img");
      const label = button.querySelector("span");
      if (button.dataset.icon !== meta.icon) button.dataset.icon = meta.icon;
      if (button.dataset.label !== meta.label) button.dataset.label = meta.label;
      button.setAttribute("aria-label", meta.label);
      if (label && label.textContent !== meta.label) label.textContent = meta.label;
      if (image && (image.dataset.item !== item || image.getAttribute("src") !== meta.icon)) {
        image.dataset.item = item;
        image.alt = meta.label;
        image.src = meta.icon;
      }
    });
  }

  function chooseItem(item, button) {
    if (!acceptingInput) return;
    const stage = stages[currentStage];
    const wanted = stage.tasks[currentTask];
    if (item !== wanted) {
      mistakes += 1;
      currentTaskMistakes += 1;
      nodes.feedbackText.textContent = t("wrong");
      button?.setAttribute("aria-invalid", "true");
      setTimeout(() => button?.removeAttribute("aria-invalid"), 900);
      nodes.animalCard.classList.remove("wrong");
      button?.classList.remove("wrong");
      void nodes.animalCard.offsetWidth;
      nodes.animalCard.classList.add("wrong");
      button?.classList.add("wrong");
      playSound("wrong");
      track("game_answer", { level: currentStage + 1, correct: false, task: wanted, item });
      return;
    }

    acceptingInput = false;
    nodes.itemGrid.setAttribute("aria-busy", "true");
    nodes.itemGrid.querySelectorAll(".item-card").forEach((choice) => { choice.disabled = true; });
    if (currentTaskMistakes === 0) firstTryTasks += 1;
    button?.classList.add("correct");
    nodes.animalCard.classList.remove("happy");
    void nodes.animalCard.offsetWidth;
    nodes.animalCard.classList.add("happy");
    nodes.feedbackText.textContent = t("correct");
    playSound("success");
    track("game_answer", { level: currentStage + 1, correct: true, task: wanted, item });
    setTimeout(() => {
      currentTask += 1;
      if (currentTask >= stage.tasks.length) {
        finishStage();
      } else {
        currentTaskMistakes = 0;
        acceptingInput = true;
        renderTask();
      }
    }, 520);
  }

  function finishStage() {
    const stageNo = currentStage + 1;
    const stage = stages[currentStage];
    const earned = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    const mood = clamp(100 - mistakes * 12, 40, 100);
    const tickets = Math.max(0, stage.tickets + stage.tasks.length * 3 - mistakes * 4);
    const previousBest = stars[stageNo] || 0;
    stars[stageNo] = Math.max(stars[stageNo] || 0, earned);
    saveStars();
    if (stageNo === unlocked && unlocked < stages.length) {
      unlocked += 1;
      localStorage.setItem(unlockKey, String(unlocked));
    }
    nodes.progressFill.style.width = "100%";
    lastResult = { earned, previousBest, tickets, mood, taskCount: stage.tasks.length, firstTryTasks, mistakes };
    renderResult();
    nodes.resultPanel.classList.remove("hidden");
    requestAnimationFrame(() => nodes.resultPanel.focus());
    playSound("win");
    track("game_complete", { level: stageNo, stars: earned, mistakes });
  }

  function showFloatingText(message) {
    const toast = document.createElement("div");
    toast.className = "floating-toast";
    toast.textContent = message;
    Object.assign(toast.style, {
      position: "fixed",
      left: "50%",
      top: "52%",
      zIndex: "40",
      transform: "translate(-50%, -50%)",
      padding: "12px 18px",
      borderRadius: "999px",
      background: "rgba(24, 49, 38, 0.9)",
      color: "#fff",
      fontWeight: "900",
      animation: "toastUp 1.15s ease forwards",
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1200);
  }

  function initDragDrop() {
    nodes.animalCard.addEventListener("dragover", (event) => event.preventDefault());
    nodes.animalCard.addEventListener("drop", (event) => {
      event.preventDefault();
      const item = event.dataTransfer.getData("text/plain");
      const button = nodes.itemGrid.querySelector(`[data-item="${item}"]`);
      chooseItem(item, button);
    });
  }

  function initLoading() {
    const assets = [...new Set(["../../assets/zoo-helper-day-cover.png", ...Object.values(animalAssets), ...Object.keys(itemIcons).map(iconSrc)])];
    let loaded = 0;
    const finish = () => {
      loaded += 1;
      const progress = Math.round((loaded / assets.length) * 100);
      nodes.loadingText.textContent = `${progress}%`;
      nodes.loadingFill.style.width = `${progress}%`;
      if (loaded >= assets.length) {
        setTimeout(() => {
          nodes.loadingPanel.classList.add("hidden");
          track("game_ready");
        }, 180);
      }
    };
    assets.forEach((src) => {
      const img = new Image();
      img.onload = finish;
      img.onerror = finish;
      img.src = src;
    });
  }

  function renderResult() {
    if (!lastResult) return;
    const { earned, previousBest, tickets, mood, taskCount, firstTryTasks: firstTry, mistakes: retries } = lastResult;
    const stage = stages[currentStage];
    nodes.resultTitle.textContent = earned === 3 ? t("perfect") : earned === 2 ? t("good") : t("keep");
    nodes.starText.textContent = "★".repeat(earned) + "☆".repeat(3 - earned);
    nodes.resultText.textContent = t("result", { station: t(`stations.${stage.station}`), tickets, mood });
    nodes.skillReportTitle.textContent = t("skillReport");
    nodes.animalKnowledgeLabel.textContent = t("animalKnowledge");
    nodes.animalKnowledgeValue.textContent = t("animalValue", { count: taskCount });
    nodes.focusLabel.textContent = t("focus");
    nodes.focusValue.textContent = t("focusValue", { firstTry, retries });
    nodes.coordinationLabel.textContent = t("coordination");
    nodes.coordinationValue.textContent = t("coordinationValue", { count: taskCount });
    nodes.progressComparison.textContent = previousBest === 0
      ? t("firstFinish", { stars: earned })
      : t(earned > previousBest ? "newBest" : "progress", { stars: earned, previous: previousBest });
    nodes.nextStageBtn.classList.toggle("hidden", currentStage >= stages.length - 1);
  }

  function bindEvents() {
    nodes.startGameBtn.addEventListener("click", showMenu);
    nodes.stageBackBtn.addEventListener("click", showMain);
    nodes.localeSelect.addEventListener("change", () => {
      locale = nodes.localeSelect.value;
      window.WonderI18n?.setLocale?.(locale);
      localStorage.setItem(localeKey, locale);
      localizeStatic();
      renderStageGrid();
      if (!nodes.resultPanel.classList.contains("hidden")) renderResult();
      else if (!nodes.playPanel.classList.contains("hidden")) renderTask();
    });
    window.addEventListener("wonder:locale-change", (event) => {
      const nextLocale = event.detail?.locale || window.WonderI18n?.locale?.() || "en";
      if (nextLocale === locale) return;
      locale = nextLocale;
      localStorage.setItem(localeKey, locale);
      localizeStatic();
      renderStageGrid();
      if (!nodes.resultPanel.classList.contains("hidden")) renderResult();
      else if (!nodes.playPanel.classList.contains("hidden")) renderTask();
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
  initDragDrop();
  renderStageGrid();
  initLoading();
})();
