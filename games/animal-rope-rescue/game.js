(() => {
  const GAME_ID = "animal-rope-rescue";
  const localeKey = "weightPlayLocale";
  const saveKey = "weightplay_animal_vine_rescue_save_v1";

  const text = {
    en: {
      title: "Animal Vine Rescue",
      language: "Language",
      menuTitle: "Rescue fruit for hungry animals.",
      menuHint: "Cut the vine, drag the leaf, and bounce fruit into the animal basket.",
      start: "Choose Stage",
      stage: "Stage",
      score: "Score",
      stages: "Stages",
      cut: "Cut",
      hint: "Drag the leaf under the fruit, then press Cut. Keep dragging the leaf while the fruit falls.",
      fallHint: "Keep dragging the leaf under the falling fruit and bounce it toward the glowing basket.",
      loading: "Loading",
      nextStage: "Next Stage",
      retry: "Try Again",
      lobby: "Lobby",
      locked: "Stage locked",
      successTitle: "Fruit rescued!",
      failTitle: "Try that bounce again!",
      successText: "Great timing! The animal got the fruit.",
      failText: "Keep moving the leaf while the fruit falls and bounce it toward the basket.",
      completeText: "Amazing rescue route! You cleared every vine stage.",
      stageLabel: "Stage {n}",
      apple: "Apple",
      banana: "Banana",
      berry: "Berry",
      lion: "Lion",
      rabbit: "Rabbit",
      panda: "Panda",
      fox: "Fox",
      koala: "Koala",
    },
    "zh-Hant": {
      title: "動物藤蔓救援",
      language: "語言",
      menuTitle: "把水果送給肚子餓的動物。",
      menuHint: "切斷藤蔓，拖曳葉子，讓水果彈進動物籃子。",
      start: "選擇關卡",
      stage: "關卡",
      score: "分數",
      stages: "選關",
      cut: "切斷",
      hint: "先把葉子拖到水果下方，再按切斷。水果掉下來時也可以繼續拖葉子。",
      fallHint: "水果掉下來時繼續拖葉子，把它彈向發光的籃子。",
      loading: "載入中",
      nextStage: "下一關",
      retry: "再玩一次",
      lobby: "大廳",
      locked: "關卡尚未解鎖",
      successTitle: "水果送到了！",
      failTitle: "再試一次彈跳路線！",
      successText: "時機抓得很好，動物吃到水果了。",
      failText: "水果下落時繼續移動葉子，把它彈向籃子。",
      completeText: "太棒了！你完成了所有藤蔓救援關卡。",
      stageLabel: "第 {n} 關",
      apple: "蘋果",
      banana: "香蕉",
      berry: "莓果",
      lion: "獅子",
      rabbit: "兔子",
      panda: "熊貓",
      fox: "狐狸",
      koala: "無尾熊",
    },
  };
  const assets = {
    cover: "../../assets/animal-vine-rescue-cover.png",
    background: "../../assets/animal-vine-rescue-game-bg.webp",
    vine: "../../assets/animal-vine-rope.png",
    leaf: "../../assets/animal-vine-leaf-paddle.png",
    basket: "../../assets/animal-vine-basket.png",
    apple: "../../assets/animal-vine-fruit-apple.png",
    banana: "../../assets/animal-vine-fruit-banana.png",
    berry: "../../assets/animal-vine-fruit-berry.png",
    lion: "../../assets/weightplay-boom-mane-lion.png",
    rabbit: "../../assets/tiny-weather-animal-rabbit.png",
    panda: "../../assets/tiny-weather-animal-panda.png",
    fox: "../../assets/tiny-weather-animal-fox.png",
    koala: "../../assets/tiny-weather-animal-koala.png",
  };

  const stages = [
    { fruit: "apple", animal: "rabbit", startX: 48, targetX: 50, paddleX: 50, gravity: 980, wind: 0 },
    { fruit: "banana", animal: "lion", startX: 35, targetX: 68, paddleX: 52, gravity: 1040, wind: 24 },
    { fruit: "berry", animal: "panda", startX: 66, targetX: 34, paddleX: 48, gravity: 1080, wind: -22 },
    { fruit: "apple", animal: "fox", startX: 28, targetX: 74, paddleX: 45, gravity: 1120, wind: 40 },
    { fruit: "banana", animal: "koala", startX: 72, targetX: 28, paddleX: 55, gravity: 1160, wind: -36 },
    { fruit: "berry", animal: "rabbit", startX: 52, targetX: 50, paddleX: 50, gravity: 1220, wind: 0 },
    { fruit: "apple", animal: "lion", startX: 40, targetX: 26, paddleX: 58, gravity: 1260, wind: -42 },
    { fruit: "banana", animal: "fox", startX: 58, targetX: 76, paddleX: 42, gravity: 1320, wind: 44 },
  ];

  const $ = (id) => document.getElementById(id);
  const nodes = {
    localeSelect: $("localeSelect"),
    menuPanel: $("menuPanel"),
    stagePanel: $("stagePanel"),
    gamePanel: $("gamePanel"),
    startBtn: $("startBtn"),
    stageBackBtn: $("stageBackBtn"),
    stageText: $("stageText"),
    scoreText: $("scoreText"),
    playfield: $("playfield"),
    targetZone: $("targetZone"),
    targetAnimal: $("targetAnimal"),
    vineButton: $("vineButton"),
    cutNowBtn: $("cutNowBtn"),
    aimGuide: $("aimGuide"),
    targetGuide: $("targetGuide"),
    fallGuide: $("fallGuide"),
    fruit: $("fruit"),
    leafPaddle: $("leafPaddle"),
    floatText: $("floatText"),
    toastText: $("toastText"),
    hintText: $("hintText"),
    resultPanel: $("resultPanel"),
    resultTitle: $("resultTitle"),
    resultText: $("resultText"),
    starText: $("starText"),
    nextStageBtn: $("nextStageBtn"),
    retryBtn: $("retryBtn"),
    resultStagesBtn: $("resultStagesBtn"),
    loadingPanel: $("loadingPanel"),
    loadingText: $("loadingText"),
    loadingFill: $("loadingFill"),
  };

  let locale = window.WonderI18n?.locale?.() || localStorage.getItem(localeKey) || "en";
  let save = loadSave();
  let currentStage = 1;
  let running = false;
  let settled = false;
  let lastFrame = 0;
  let paddleX = 50;
  let fruit = { x: 50, y: 20, vx: 0, vy: 0, rot: 0, cut: false };

  function setPlayingState(isPlaying) {
    document.documentElement.classList.toggle("is-vine-playing", isPlaying);
    document.body.classList.toggle("is-vine-playing", isPlaying);
    if (!isPlaying) document.body.classList.remove("vine-expanded-canvas");
    window.WEIGHTPLAY_VINE_RESCUE_ACTIVE = isPlaying;
    window.WeightPlayGame?.updateVisualViewportVars?.();
    requestAnimationFrame(updateBattleScale);
    window.dispatchEvent(new CustomEvent("animal-vine-rescue:play-state", { detail: { playing: isPlaying } }));
  }

  function setStageState(isStage) {
    document.documentElement.classList.toggle("is-vine-stage-select", isStage);
    document.body.classList.toggle("is-vine-stage-select", isStage);
    window.WonderSound?.setGameActive?.(isStage);
    window.WeightPlayGame?.updateVisualViewportVars?.();
  }

  function t(key, data = {}) {
    const value = text[locale]?.[key] || text.en[key] || key;
    return Object.entries(data).reduce((out, [name, item]) => out.replaceAll(`{${name}}`, String(item)), value);
  }

  function loadSave() {
    try {
      return { unlocked: 1, stars: {}, bestScore: 0, playCount: 0, ...JSON.parse(localStorage.getItem(saveKey) || "{}") };
    } catch {
      return { unlocked: 1, stars: {}, bestScore: 0, playCount: 0 };
    }
  }

  function saveGame() {
    localStorage.setItem(saveKey, JSON.stringify(save));
  }

  function setLocale(next) {
    locale = next || "en";
    localStorage.setItem(localeKey, locale);
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : "en";
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
    renderStages();
    if (!nodes.gamePanel.classList.contains("hidden")) setupStage(currentStage);
  }

  function show(panel) {
    setPlayingState(panel === nodes.gamePanel);
    setStageState(panel === nodes.stagePanel);
    [nodes.menuPanel, nodes.stagePanel, nodes.gamePanel].forEach((node) => node.classList.add("hidden"));
    panel.classList.remove("hidden");
    window.scrollTo({ top: 0, left: 0, behavior: panel === nodes.gamePanel ? "auto" : "smooth" });
  }

  function renderStages() {
    nodes.stagePanel.innerHTML = `<div class="stage-shell-head"><button type="button" class="stage-return" data-stage-main aria-label="Back">&larr;</button><div><strong>${t("stages")}</strong><span>${t("menuHint")}</span></div></div><div class="stage-rail">` + stages
      .map((stage, index) => {
        const stageNo = index + 1;
        const locked = stageNo > save.unlocked;
        const got = save.stars[stageNo] || 0;
        return `
          <button class="stage-card ${locked ? "locked" : ""}" type="button" data-stage="${stageNo}">
            <strong>${t("stageLabel", { n: stageNo })}</strong>
            <span class="stage-card-route" aria-hidden="true">
              <img src="${assets[stage.fruit]}" alt="" />
              <b>→</b>
              <img src="${assets[stage.animal]}" alt="" />
            </span>
            <small>${t(stage.fruit)} → ${t(stage.animal)}</small>
            <span>${"★".repeat(got)}${"☆".repeat(3 - got)}</span>
          </button>
        `;
      })
      .join("") + `</div><div class="stage-ad-reserve" aria-hidden="true"></div>`;
  }

  function setupStage(stageNo) {
    currentStage = Math.max(1, Math.min(stages.length, stageNo));
    const stage = stages[currentStage - 1];
    running = false;
    settled = false;
    lastFrame = 0;
    paddleX = stage.paddleX;
    fruit = { x: stage.startX, y: 19, vx: stage.wind, vy: 0, rot: 0, cut: false };
    nodes.stageText.textContent = String(currentStage);
    nodes.scoreText.textContent = String(scoreForStage());
    nodes.targetZone.style.left = `${stage.targetX}%`;
    nodes.targetGuide.style.left = `${stage.targetX}%`;
    nodes.fallGuide.classList.remove("active");
    nodes.targetGuide.classList.remove("active");
    nodes.targetAnimal.src = assets[stage.animal];
    nodes.fruit.src = assets[stage.fruit];
    nodes.vineButton.classList.remove("cut");
    nodes.cutNowBtn.disabled = false;
    nodes.cutNowBtn.classList.remove("cut");
    nodes.vineButton.style.left = `${stage.startX}%`;
    nodes.aimGuide.classList.add("active");
    nodes.hintText.textContent = t("hint");
    positionElements();
  }

  function scoreForStage() {
    return Object.values(save.stars).reduce((total, star) => total + star * 100, 0);
  }

  function positionElements() {
    const stage = stages[currentStage - 1];
    nodes.fruit.style.left = `${fruit.x}%`;
    nodes.fruit.style.top = `${fruit.y}%`;
    nodes.fruit.style.rotate = `${fruit.rot}deg`;
    nodes.fallGuide.style.left = `${fruit.x}%`;
    nodes.leafPaddle.style.left = `${paddleX}%`;
    updateAimGuide(paddleX, stage.targetX);
  }

  function updateAimGuide(fromX, toX) {
    const startY = 78;
    const endY = 82;
    const dx = toX - fromX;
    const dy = endY - startY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    nodes.aimGuide.style.left = `${fromX}%`;
    nodes.aimGuide.style.top = `${startY}%`;
    nodes.aimGuide.style.width = `${length}%`;
    nodes.aimGuide.style.rotate = `${angle}deg`;
  }

  function cutVine() {
    if (running || settled) return;
    running = true;
    fruit.cut = true;
    nodes.vineButton.classList.add("cut");
    nodes.cutNowBtn.disabled = true;
    nodes.cutNowBtn.classList.add("cut");
    nodes.fallGuide.classList.add("active");
    nodes.targetGuide.classList.add("active");
    nodes.hintText.textContent = t("fallHint");
    lastFrame = performance.now();
    window.WonderSound?.play?.("click");
    requestAnimationFrame(tick);
  }

  function tick(now) {
    if (!running || settled) return;
    const dt = Math.min(0.028, (now - lastFrame) / 1000 || 0.016);
    lastFrame = now;
    const rect = nodes.playfield.getBoundingClientRect();
    const stage = stages[currentStage - 1];
    const fruitPx = rect.width * 0.12;
    let x = (fruit.x / 100) * rect.width;
    let y = (fruit.y / 100) * rect.height;
    const paddleY = rect.height * 0.76;
    const paddleW = Math.min(rect.width * 0.34, 190);
    const paddleCenter = (paddleX / 100) * rect.width;
    fruit.vy += stage.gravity * dt;
    fruit.vx += stage.wind * dt * 0.12;
    x += fruit.vx * dt;
    y += fruit.vy * dt;
    fruit.rot += fruit.vx * dt * 0.42;

    const hitPaddle = fruit.vy > 0 && y + fruitPx * 0.35 >= paddleY && y < paddleY + 26 && Math.abs(x - paddleCenter) < paddleW * 0.56;
    if (hitPaddle) {
      const offset = (x - paddleCenter) / (paddleW * 0.5);
      fruit.vy = -Math.max(610, rect.height * 1.08);
      fruit.vx += offset * 520;
      y = paddleY - fruitPx * 0.45;
      showFloat("+bounce");
      window.WonderSound?.play?.("pop");
    }

    fruit.x = (x / rect.width) * 100;
    fruit.y = (y / rect.height) * 100;
    positionElements();

    const targetCenter = (stage.targetX / 100) * rect.width;
    const basketY = rect.height * 0.86;
    if (y > basketY - fruitPx * 0.15 && y < basketY + fruitPx * 0.8 && Math.abs(x - targetCenter) < rect.width * 0.15) {
      finish(true);
      return;
    }
    if (y > rect.height + fruitPx || x < -fruitPx || x > rect.width + fruitPx) {
      finish(false);
      return;
    }
    requestAnimationFrame(tick);
  }

  function showFloat(message) {
    nodes.floatText.textContent = message;
    nodes.floatText.classList.remove("hidden");
    nodes.floatText.style.animation = "none";
    nodes.floatText.offsetHeight;
    nodes.floatText.style.animation = "";
    setTimeout(() => nodes.floatText.classList.add("hidden"), 850);
  }

  function showToast(message) {
    nodes.toastText.textContent = message;
    nodes.toastText.classList.remove("hidden");
    nodes.toastText.style.animation = "none";
    nodes.toastText.offsetHeight;
    nodes.toastText.style.animation = "";
    setTimeout(() => nodes.toastText.classList.add("hidden"), 1000);
  }

  function finish(success) {
    running = false;
    settled = true;
    setPlayingState(false);
    nodes.aimGuide.classList.remove("active");
    nodes.fallGuide.classList.remove("active");
    nodes.targetGuide.classList.remove("active");
    if (success) {
      const stars = fruit.y < 88 ? 3 : 2;
      save.stars[currentStage] = Math.max(save.stars[currentStage] || 0, stars);
      save.unlocked = Math.max(save.unlocked, Math.min(stages.length, currentStage + 1));
      save.playCount += 1;
      save.bestScore = Math.max(save.bestScore, scoreForStage());
      saveGame();
      window.WonderAnalytics?.track?.("stage_complete", { game_id: GAME_ID, stage: currentStage });
    }
    nodes.resultTitle.textContent = success ? t("successTitle") : t("failTitle");
    nodes.resultText.textContent = success && currentStage === stages.length ? t("completeText") : success ? t("successText") : t("failText");
    const starCount = success ? save.stars[currentStage] || 2 : 0;
    nodes.starText.textContent = `${"★".repeat(starCount)}${"☆".repeat(3 - starCount)}`;
    nodes.nextStageBtn.classList.toggle("hidden", !success || currentStage >= stages.length);
    nodes.resultPanel.classList.remove("hidden");
    window.WonderSound?.play?.(success ? "success" : "error");
  }

  function movePaddle(clientX) {
    const rect = nodes.playfield.getBoundingClientRect();
    paddleX = Math.max(16, Math.min(84, ((clientX - rect.left) / rect.width) * 100));
    positionElements();
  }

  function isVineCutPointer(event) {
    if (running || settled || fruit.cut) return false;
    const rect = nodes.playfield.getBoundingClientRect();
    const stage = stages[currentStage - 1];
    const xPct = ((event.clientX - rect.left) / rect.width) * 100;
    const yPct = ((event.clientY - rect.top) / rect.height) * 100;
    const nearVine = Math.abs(xPct - stage.startX) <= 12 && yPct <= 48;
    const nearFruit = Math.abs(xPct - fruit.x) <= 13 && Math.abs(yPct - fruit.y) <= 14;
    return nearVine || nearFruit;
  }

  function preload() {
    const list = Object.values(assets);
    let loaded = 0;
    let released = false;
    const done = () => {
      if (released) return;
      loaded += 1;
      const pct = Math.round((loaded / list.length) * 100);
      nodes.loadingText.textContent = `${pct}%`;
      nodes.loadingFill.style.width = `${pct}%`;
      if (loaded >= list.length) releaseLoading();
    };
    const releaseLoading = () => {
      if (released) return;
      released = true;
      nodes.loadingText.textContent = "100%";
      nodes.loadingFill.style.width = "100%";
      setTimeout(() => nodes.loadingPanel.classList.add("hidden"), 180);
    };
    window.setTimeout(releaseLoading, 2200);
    list.forEach((src) => {
      const img = new Image();
      img.onload = done;
      img.onerror = done;
      img.src = src;
    });
  }

  nodes.startBtn.addEventListener("click", () => {
    renderStages();
    show(nodes.stagePanel);
  });
  nodes.stageBackBtn.addEventListener("click", () => {
    renderStages();
    show(nodes.stagePanel);
  });
  nodes.stagePanel.addEventListener("click", (event) => {
    if (event.target.closest("[data-stage-main]")) {
      show(nodes.menuPanel);
      return;
    }
    const button = event.target.closest("[data-stage]");
    if (!button) return;
    const stageNo = Number(button.dataset.stage);
    if (stageNo > save.unlocked) {
      showToast(t("locked"));
      return;
    }
    setupStage(stageNo);
    show(nodes.gamePanel);
  });
  nodes.vineButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
    cutVine();
  });
  nodes.vineButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    cutVine();
  });
  nodes.cutNowBtn.addEventListener("click", (event) => {
    event.preventDefault();
    cutVine();
  });
  nodes.playfield.addEventListener("pointerdown", (event) => {
    if (isVineCutPointer(event)) {
      cutVine();
      return;
    }
    nodes.playfield.setPointerCapture?.(event.pointerId);
    movePaddle(event.clientX);
  });
  nodes.playfield.addEventListener("pointermove", (event) => {
    if (event.pressure > 0 || event.buttons) movePaddle(event.clientX);
  });
  nodes.nextStageBtn.addEventListener("click", () => {
    nodes.resultPanel.classList.add("hidden");
    setPlayingState(true);
    setupStage(currentStage + 1);
  });
  nodes.retryBtn.addEventListener("click", () => {
    nodes.resultPanel.classList.add("hidden");
    setPlayingState(true);
    setupStage(currentStage);
  });
  nodes.resultStagesBtn.addEventListener("click", () => {
    nodes.resultPanel.classList.add("hidden");
    renderStages();
    show(nodes.stagePanel);
  });
  nodes.localeSelect.addEventListener("change", (event) => {
    window.WonderI18n?.setLocale?.(event.target.value);
    setLocale(event.target.value);
  });
  window.addEventListener("wonder:locale-change", (event) => setLocale(event.detail?.locale || window.WonderI18n?.locale?.()));
  window.addEventListener("resize", positionElements);

  nodes.localeSelect.value = locale;
  setLocale(locale);

  function updateBattleScale() {
    const viewport = window.visualViewport;
    const viewportWidth = viewport?.width || window.innerWidth;
    const viewportHeight = viewport?.height || window.innerHeight;
    const isPhoneBattle = document.body.classList.contains("is-vine-playing")
      && (window.matchMedia("(pointer: coarse)").matches || viewportWidth <= 600 || viewportHeight <= 430);
    document.body.classList.toggle("vine-expanded-canvas", isPhoneBattle);
    if (isPhoneBattle) {
      document.documentElement.style.setProperty("--vine-battle-scale", "1");
      document.documentElement.style.setProperty("--vine-battle-width", `${Math.max(1, viewportWidth - 8)}px`);
      document.documentElement.style.setProperty("--vine-battle-content-height", `${Math.max(1, viewportHeight - 64)}px`);
      document.documentElement.style.setProperty("--vine-battle-left", "4px");
      document.documentElement.style.setProperty("--vine-battle-top", "4px");
      return;
    }
    const scale = Math.max(0.1, Math.min((viewportWidth - 8) / 390, (viewportHeight - 64) / 788));
    const width = 390 * scale;
    const contentHeight = 788 * scale;
    const totalHeight = contentHeight + 56;
    document.documentElement.style.setProperty("--vine-battle-scale", String(scale));
    document.documentElement.style.setProperty("--vine-battle-width", `${width}px`);
    document.documentElement.style.setProperty("--vine-battle-content-height", `${contentHeight}px`);
    document.documentElement.style.setProperty("--vine-battle-left", `${(viewportWidth - width) / 2}px`);
    document.documentElement.style.setProperty("--vine-battle-top", `${(viewportHeight - totalHeight) / 2}px`);
  }

  updateBattleScale();
  window.addEventListener("resize", updateBattleScale);
  window.addEventListener("orientationchange", updateBattleScale);
  window.visualViewport?.addEventListener("resize", updateBattleScale);
  window.visualViewport?.addEventListener("scroll", updateBattleScale);
  setupStage(1);
  preload();
})();
