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
      remaining: "{count} left",
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
      gameTitle: "\u52d5\u7269\u63a2\u96aa\u627e\u627e\u770b",
      language: "\u8a9e\u8a00",
      chooseStage: "\u9078\u64c7\u68f2\u5730",
      menuHint: "\u5728\u5927\u81ea\u7136\u5834\u666f\u88e1\u627e\u51fa\u85cf\u8d77\u4f86\u7684\u52d5\u7269\uff0c\u7df4\u7fd2\u89c0\u5bdf\u529b\u8207\u5c08\u6ce8\u3002",
      stages: "\u68f2\u5730",
      loading: "\u8f09\u5165\u4e2d",
      hint: "\u63d0\u793a",
      findList: "\u8981\u627e\u7684\u52d5\u7269",
      nextStage: "\u4e0b\u4e00\u500b\u68f2\u5730",
      retry: "\u518d\u8a66\u4e00\u6b21",
      lobby: "\u5927\u5ef3",
      locked: "\u68f2\u5730\u5c1a\u672a\u89e3\u9396",
      stage: "\u68f2\u5730 {n}",
      great: "\u627e\u5f97\u5f88\u597d\uff01",
      perfect: "\u597d\u654f\u92b3\u7684\u89c0\u5bdf\u773c\uff01",
      good: "\u5f88\u6703\u627e\u55b2\uff01",
      result: "\u4f60\u5728 {time} \u5167\u627e\u5230 {found}/{total} \u96bb\u52d5\u7269\u3002",
      skillReport: "\u80fd\u529b\u5831\u544a",
      skillMessage: "\u5c08\u6ce8 {focus} / \u52d5\u7269\u8a8d\u8b58 {animal} / \u89e3\u984c\u80fd\u529b {solve}\u3002\u4f60\u900f\u904e\u4ed4\u7d30\u89c0\u5bdf\u5b8c\u6210\u4e86\u5f88\u68d2\u7684\u9032\u6b65\u3002",
      best: "\u6700\u4f73 {time}",
      noHints: "\u6c92\u6709\u63d0\u793a\u4e86",
      found: "\u627e\u5230\u4e86\uff01",
      tryAgain: "\u518d\u4ed4\u7d30\u770b\u770b",
      remaining: "\u9084\u5269 {count} \u500b",
      targets: {
        lion: "\u7345\u5b50",
        elephant: "\u5927\u8c61",
        giraffe: "\u9577\u9838\u9e7f",
        panda: "\u8c93\u718a",
        penguin: "\u4f01\u9d5d",
        koala: "\u7121\u5c3e\u718a",
        rabbit: "\u5154\u5b50",
        fox: "\u72d0\u72f8",
        frog: "\u9752\u86d9",
        owl: "\u8c93\u982d\u9df9",
      },
      habitat: {
        sunny: "\u967d\u5149\u8349\u539f",
        river: "\u6cb3\u908a\u68f2\u5730",
        sunset: "\u5915\u967d\u6a39\u6797",
        pond: "\u6c60\u5858\u89c0\u5bdf",
        jungle: "\u53e2\u6797\u908a\u7de3",
        lookout: "\u9060\u773a\u5c71\u4e18",
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
    remainingText: $("remainingText"),
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
    nodes.remainingText.textContent = t("remaining", { count: Math.max(0, stage.targets.length - found.size) });
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
