(() => {
  const GAME_ID = "animal-hidden-safari";
  const localeKey = "weightplayLocale";
  const unlockKey = "weightplay_hidden_safari_unlocked";
  const starKey = "weightplay_hidden_safari_stars";
  const progressKey = "weightplay_progress_animal-hidden-safari";

  const text = {
    en: {
      gameTitle: "Animal Hidden Safari",
      language: "Language",
      chooseStage: "Choose Habitat",
      menuHint: "Find animals blended into each natural habitat.",
      stages: "Habitats",
      loading: "Loading",
      hint: "Hint",
      findList: "Find These",
      nextStage: "Next Habitat",
      retry: "Try Again",
      lobby: "Lobby",
      locked: "Habitat locked",
      stage: "Habitat {n}",
      great: "Great find!",
      perfect: "Sharp safari eyes!",
      good: "Nice searching!",
      result: "You found {found}/{total} animals in {time}.",
      skillReport: "Skill Report",
      skillMessage: "Focus {focus} / Animal Knowledge {animal} / Problem Solving {solve}. Great progress through careful looking.",
      best: "Best {time}",
      noHints: "No hints left",
      found: "Found!",
      tryAgain: "Look closely",
      targets: {
        lion: "Lion",
        elephant: "Elephant",
        giraffe: "Giraffe",
        panda: "Panda",
        penguin: "Penguin",
        koala: "Koala",
        rabbit: "Rabbit",
        fox: "Fox",
        frog: "Frog",
        owl: "Owl",
      },
      habitat: {
        sunny: "Sunny Grassland",
        river: "River Crossing",
        sunset: "Sunset Trees",
        pond: "Pond Watch",
        jungle: "Jungle Edge",
        lookout: "Lookout Hill",
      },
    },
    "zh-Hant": {
      gameTitle: "動物探險找找看",
      language: "語言",
      chooseStage: "選擇棲地",
      menuHint: "在自然場景裡找出躲起來的動物，練習觀察力與專注力。",
      stages: "棲地",
      loading: "載入中",
      hint: "提示",
      findList: "要找到",
      nextStage: "下一個棲地",
      retry: "再試一次",
      lobby: "大廳",
      locked: "棲地尚未解鎖",
      stage: "棲地 {n}",
      great: "找得很好！",
      perfect: "觀察力超棒！",
      good: "很會找喔！",
      result: "你在 {time} 找到 {found}/{total} 隻動物。",
      skillReport: "能力報告",
      skillMessage: "專注力 {focus} / 動物知識 {animal} / 解題能力 {solve}。你很細心地觀察每個角落。",
      best: "最佳 {time}",
      noHints: "沒有提示了",
      found: "找到了！",
      tryAgain: "再仔細看看",
      targets: {
        lion: "獅子",
        elephant: "大象",
        giraffe: "長頸鹿",
        panda: "熊貓",
        penguin: "企鵝",
        koala: "無尾熊",
        rabbit: "兔子",
        fox: "狐狸",
        frog: "青蛙",
        owl: "貓頭鷹",
      },
      habitat: {
        sunny: "陽光草原",
        river: "河邊棲地",
        sunset: "夕陽森林",
        pond: "池塘觀察",
        jungle: "叢林邊緣",
        lookout: "瞭望山丘",
      },
    },
  };

  const targetAssets = {
    lion: "../../assets/animal-zoo-idle-lion.webp",
    elephant: "../../assets/animal-zoo-elephant.png",
    giraffe: "../../assets/animal-zoo-idle-giraffe.png",
    panda: "../../assets/animal-zoo-panda.png",
    penguin: "../../assets/animal-zoo-penguin.png",
    koala: "../../assets/tiny-weather-animal-koala.png",
    rabbit: "../../assets/tiny-weather-animal-rabbit.png",
    fox: "../../assets/tiny-weather-animal-fox.png",
    frog: "../../assets/bubble-bakery-frog.png",
    owl: "../../assets/animal-guard-owl.png",
  };

  const stages = [
    { habitat: "sunny", targets: [["lion", 48, 65, 66], ["elephant", 18, 72, 58], ["giraffe", 82, 58, 62], ["panda", 66, 80, 48], ["koala", 30, 48, 44], ["owl", 42, 27, 38]] },
    { habitat: "river", theme: "river", targets: [["penguin", 24, 74, 54], ["elephant", 75, 68, 58], ["frog", 43, 82, 40], ["owl", 64, 34, 40], ["panda", 54, 56, 48], ["fox", 35, 64, 42]] },
    { habitat: "sunset", theme: "sunset", targets: [["giraffe", 18, 54, 62], ["koala", 78, 44, 46], ["lion", 64, 73, 58], ["rabbit", 48, 32, 38], ["fox", 28, 82, 42], ["owl", 38, 42, 38]] },
    { habitat: "pond", theme: "pond", targets: [["frog", 18, 75, 44], ["penguin", 50, 73, 58], ["panda", 78, 66, 54], ["owl", 84, 32, 40], ["rabbit", 36, 84, 40], ["koala", 56, 54, 42]] },
    { habitat: "jungle", theme: "jungle", targets: [["koala", 22, 43, 50], ["owl", 54, 29, 40], ["rabbit", 76, 35, 42], ["panda", 70, 74, 56], ["lion", 42, 70, 58], ["fox", 34, 86, 42]] },
    { habitat: "lookout", theme: "lookout", targets: [["lion", 21, 68, 58], ["elephant", 46, 72, 60], ["giraffe", 78, 54, 62], ["panda", 64, 82, 50], ["frog", 34, 84, 42], ["owl", 54, 30, 40]] },
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
    hintBtn: $("hintBtn"),
    hintCount: $("hintCount"),
    scene: $("scene"),
    targetsLayer: $("targetsLayer"),
    floatLayer: $("floatLayer"),
    targetList: $("targetList"),
    timerText: $("timerText"),
    resultPanel: $("resultPanel"),
    resultTitle: $("resultTitle"),
    starText: $("starText"),
    resultText: $("resultText"),
    skillText: $("skillText"),
    nextStageBtn: $("nextStageBtn"),
    retryBtn: $("retryBtn"),
    resultStagesBtn: $("resultStagesBtn"),
    loadingPanel: $("loadingPanel"),
    loadingText: $("loadingText"),
    loadingFill: $("loadingFill"),
  };

  let locale = localStorage.getItem(localeKey) || "en";
  let unlocked = clamp(Number(localStorage.getItem(unlockKey)) || 1, 1, stages.length);
  let stars = readJson(starKey, {});
  let currentStage = 0;
  let found = new Set();
  let hintsLeft = 2;
  let mistakes = 0;
  let startTime = 0;
  let timerId = 0;
  let acceptingInput = false;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function t(key, data = {}) {
    const parts = key.split(".");
    let value = text[locale] || text.en;
    for (const part of parts) value = value?.[part];
    if (typeof value !== "string") value = key;
    return Object.entries(data).reduce((out, [name, item]) => out.replaceAll(`{${name}}`, String(item)), value);
  }

  function animalImg(id, className = "") {
    return `<img class="${className}" src="${targetAssets[id]}" alt="" loading="lazy" draggable="false" />`;
  }

  function playSound(name) {
    window.WonderSound?.play?.(name);
  }

  function track(event, payload = {}) {
    window.WonderAnalytics?.track?.(event, { game_id: GAME_ID, ...payload });
  }

  function localizeStatic() {
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : "en";
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
    nodes.localeSelect.value = locale;
  }

  function starIcons(count, total) {
    return `${"\u2605".repeat(count)}${"\u2606".repeat(total - count)}`;
  }

  function starsFor(stageNo) {
    return starIcons(stars[stageNo]?.stars || 0, 3);
  }

  function bestLine(stageNo) {
    const best = stars[stageNo]?.bestTime;
    return best ? ` / ${t("best", { time: formatTime(best) })}` : "";
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
        <b>${animalImg(stage.targets[0][0], "stage-animal")}</b>
        <strong>${t("stage", { n: stageNo })} - ${t(`habitat.${stage.habitat}`)}</strong>
        <span>${starsFor(stageNo)}${bestLine(stageNo)}</span>
      `;
      button.addEventListener("click", () => {
        if (stageNo > unlocked) {
          showFloatingText(t("locked"), 50, 50);
          playSound("click");
          return;
        }
        startStage(index);
      });
      nodes.stageGrid.appendChild(button);
    });
  }

  function showMenu() {
    stopTimer();
    acceptingInput = false;
    nodes.resultPanel.classList.add("hidden");
    nodes.playPanel.classList.add("hidden");
    nodes.menuPanel.classList.remove("hidden");
    renderStageGrid();
  }

  function startStage(index) {
    currentStage = index;
    found = new Set();
    hintsLeft = 2;
    mistakes = 0;
    startTime = Date.now();
    acceptingInput = true;
    nodes.resultPanel.classList.add("hidden");
    nodes.menuPanel.classList.add("hidden");
    nodes.playPanel.classList.remove("hidden");
    nodes.scene.dataset.theme = stages[index].theme || "sunny";
    renderScene();
    renderTargetList();
    updateHud();
    startTimer();
    track("game_start", { level: index + 1 });
    playSound("start");
  }

  function renderScene() {
    nodes.targetsLayer.innerHTML = "";
    stages[currentStage].targets.forEach(([id, x, y, size], index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "target";
      button.dataset.index = String(index);
      button.dataset.id = id;
      button.style.left = `${x}%`;
      button.style.top = `${y}%`;
      button.style.setProperty("--size", `${size}px`);
      button.setAttribute("aria-label", t(`targets.${id}`));
      button.innerHTML = animalImg(id, "target-animal");
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        chooseTarget(index, button);
      });
      nodes.targetsLayer.appendChild(button);
    });
    nodes.scene.onclick = (event) => {
      if (!acceptingInput || event.target !== nodes.scene) return;
      mistakes += 1;
      const rect = nodes.scene.getBoundingClientRect();
      showFloatingText(t("tryAgain"), ((event.clientX - rect.left) / rect.width) * 100, ((event.clientY - rect.top) / rect.height) * 100);
      playSound("error");
    };
  }

  function renderTargetList() {
    nodes.targetList.innerHTML = "";
    stages[currentStage].targets.forEach(([id], index) => {
      const chip = document.createElement("div");
      chip.className = `target-chip ${found.has(index) ? "done" : ""}`;
      chip.innerHTML = `<b>${animalImg(id, "chip-animal")}</b><span>${t(`targets.${id}`)}</span>`;
      nodes.targetList.appendChild(chip);
    });
  }

  function chooseTarget(index, button) {
    if (!acceptingInput || found.has(index)) return;
    found.add(index);
    button.classList.remove("hint");
    button.classList.add("found");
    showFloatingText(t("found"), Number.parseFloat(button.style.left), Number.parseFloat(button.style.top));
    playSound("coin");
    renderTargetList();
    updateHud();
    if (found.size >= stages[currentStage].targets.length) finishStage();
  }

  function useHint() {
    if (!acceptingInput) return;
    if (hintsLeft <= 0) {
      showFloatingText(t("noHints"), 50, 18);
      playSound("error");
      return;
    }
    const next = stages[currentStage].targets.findIndex((_, index) => !found.has(index));
    if (next < 0) return;
    hintsLeft -= 1;
    nodes.hintCount.textContent = hintsLeft;
    nodes.hintBtn.disabled = hintsLeft <= 0;
    document.querySelectorAll(".target.hint").forEach((item) => item.classList.remove("hint"));
    document.querySelector(`.target[data-index="${next}"]`)?.classList.add("hint");
    track("hint_used", { level: currentStage + 1 });
    playSound("select");
  }

  function updateHud() {
    const stage = stages[currentStage];
    nodes.stageText.textContent = `${t("stage", { n: currentStage + 1 })} - ${t(`habitat.${stage.habitat}`)}`;
    nodes.progressFill.style.width = `${(found.size / stage.targets.length) * 100}%`;
    nodes.hintCount.textContent = hintsLeft;
    nodes.hintBtn.disabled = hintsLeft <= 0;
  }

  function startTimer() {
    stopTimer();
    updateTimer();
    timerId = window.setInterval(updateTimer, 500);
  }

  function stopTimer() {
    if (timerId) window.clearInterval(timerId);
    timerId = 0;
  }

  function elapsedSeconds() {
    return Math.max(0, Math.floor((Date.now() - startTime) / 1000));
  }

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  }

  function updateTimer() {
    nodes.timerText.textContent = formatTime(elapsedSeconds());
  }

  function finishStage() {
    acceptingInput = false;
    stopTimer();
    const seconds = elapsedSeconds();
    const total = stages[currentStage].targets.length;
    const starCount = mistakes === 0 && hintsLeft === 2 ? 3 : mistakes <= 2 && hintsLeft >= 1 ? 2 : 1;
    const stageNo = currentStage + 1;
    const previous = stars[stageNo] || {};
    stars[stageNo] = {
      stars: Math.max(previous.stars || 0, starCount),
      bestTime: previous.bestTime ? Math.min(previous.bestTime, seconds) : seconds,
    };
    writeJson(starKey, stars);
    if (unlocked < stages.length && stageNo >= unlocked) {
      unlocked += 1;
      localStorage.setItem(unlockKey, String(unlocked));
    }
    saveProgress(starCount, seconds);
    nodes.resultTitle.textContent = starCount >= 3 ? t("perfect") : starCount >= 2 ? t("good") : t("great");
    nodes.starText.textContent = starIcons(starCount, 3);
    nodes.resultText.textContent = t("result", { found: total, total, time: formatTime(seconds) });
    nodes.skillText.textContent = t("skillMessage", {
      focus: starIcons(starCount, 5),
      animal: starIcons(3, 5),
      solve: starIcons(hintsLeft >= 1 ? 3 : 2, 5),
    });
    nodes.nextStageBtn.classList.toggle("hidden", currentStage >= stages.length - 1);
    nodes.resultPanel.classList.remove("hidden");
    track("game_complete", { level: stageNo, score: starCount * 100 - mistakes * 5, time_seconds: seconds });
    playSound("success");
  }

  function saveProgress(starCount, seconds) {
    const old = readJson(progressKey, { bestScore: 0, playCount: 0 });
    const score = Math.max(0, starCount * 100 - mistakes * 5 + Math.max(0, 120 - seconds));
    const previousBest = old.bestScore || 0;
    writeJson(progressKey, {
      lastScore: score,
      bestScore: Math.max(previousBest, score),
      playCount: (old.playCount || 0) + 1,
      lastPlayedAt: new Date().toISOString(),
      improvementPercent: previousBest ? Math.round(((score - previousBest) / previousBest) * 100) : 0,
      skillScores: {
        Focus: starCount,
        "Animal Knowledge": 3,
        "Problem Solving": hintsLeft >= 1 ? 3 : 2,
      },
    });
  }

  function showFloatingText(message, x, y) {
    const node = document.createElement("div");
    node.className = "float-text";
    node.textContent = message;
    node.style.left = `${x}%`;
    node.style.top = `${y}%`;
    nodes.floatLayer.appendChild(node);
    window.setTimeout(() => node.remove(), 950);
  }

  function preloadGameAssets() {
    const urls = [
      "../../assets/animal-hidden-safari-cover.webp",
      "../../assets/animal-hidden-safari-sunny-bg.webp",
      ...new Set(Object.values(targetAssets)),
    ];
    let done = 0;
    const update = () => {
      const pct = Math.round((done / urls.length) * 100);
      nodes.loadingText.textContent = `${pct}%`;
      nodes.loadingFill.style.width = `${pct}%`;
      if (done >= urls.length) window.setTimeout(() => nodes.loadingPanel.classList.add("hidden"), 180);
    };
    urls.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        done += 1;
        update();
      };
      img.src = src;
    });
    update();
  }

  function bind() {
    nodes.localeSelect.addEventListener("change", () => {
      locale = nodes.localeSelect.value;
      localStorage.setItem(localeKey, locale);
      localizeStatic();
      renderStageGrid();
      if (!nodes.playPanel.classList.contains("hidden")) {
        renderTargetList();
        updateHud();
      }
      window.dispatchEvent(new CustomEvent("wonder:locale-change", { detail: { locale } }));
    });
    nodes.backToStagesBtn.addEventListener("click", showMenu);
    nodes.resultStagesBtn.addEventListener("click", showMenu);
    nodes.retryBtn.addEventListener("click", () => startStage(currentStage));
    nodes.nextStageBtn.addEventListener("click", () => startStage(Math.min(stages.length - 1, currentStage + 1)));
    nodes.hintBtn.addEventListener("click", useHint);
  }

  localizeStatic();
  bind();
  showMenu();
  preloadGameAssets();
})();
