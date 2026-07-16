(() => {
  const GAME_ID = "animal-rope-rescue";
  const localeKey = "weightPlayLocale";
  const saveKey = "weightplay_animal_vine_rescue_save_v1";

  const text = {
    en: {
      title: "Animal Vine Rescue",
      language: "Language",
      backToLobby: "Back to WeightPlay lobby",
      backToMain: "Back to main menu",
      backToStages: "Back to stages",
      playfield: "Animal Vine Rescue playfield",
      cutVine: "Cut vine",
      leafControl: "Leaf trampoline position",
      leafPosition: "Leaf at {value} percent",
      menuTitle: "Rescue fruit for hungry animals.",
      menuHint: "Cut the vine, drag the leaf, and bounce fruit into the animal basket.",
      start: "Choose Stage",
      stage: "Stage",
      score: "Delivery",
      stages: "Stages",
      cut: "Cut",
      hint: "Drag the leaf or use ← →, then press Cut. Keep moving while the fruit falls.",
      readyHint: "Move leaf, then Cut.",
      fallHint: "Keep dragging or using ← → under the fruit and bounce it toward the glowing basket.",
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
      deliveryProgress: "Delivery {current}/{total}",
      bounceProgress: "Bounce {current}/{total}",
      nextDelivery: "Great catch! Get ready for delivery {current}/{total}.",
      checkpoint: "Panko Check",
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
      backToLobby: "返回 WeightPlay 大廳",
      backToMain: "返回主選單",
      backToStages: "返回選關",
      playfield: "動物藤蔓救援遊玩區",
      cutVine: "剪斷藤蔓",
      leafControl: "葉子彈墊位置",
      leafPosition: "葉子在 {value}% 位置",
      menuTitle: "把水果送給肚子餓的動物。",
      menuHint: "切斷藤蔓，拖曳葉子，讓水果彈進動物籃子。",
      start: "選擇關卡",
      stage: "關卡",
      score: "配送",
      stages: "選關",
      cut: "切斷",
      hint: "拖葉子或按 ← → 移到水果下方，再按切斷；掉落時也要繼續移動。",
      readyHint: "移動葉子，再按切斷。",
      fallHint: "水果掉下來時，繼續拖葉子或按 ← →，把它彈向發光的籃子。",
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
      deliveryProgress: "配送 {current}/{total}",
      bounceProgress: "彈跳 {current}/{total}",
      nextDelivery: "接得好！準備配送第 {current}/{total} 份水果。",
      checkpoint: "Panko 檢核",
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
    panko: "../../assets/weightplay-character-drum-belly-panda-safe-face-cutout.webp",
  };
  const seo = {
    en: {
      title: "Animal Vine Rescue - WeightPlay",
      description: "Cut vines, move the leaf trampoline, and guide fruit to hungry animals in Animal Vine Rescue, a family-friendly animal physics puzzle on WeightPlay.",
    },
    "zh-Hant": {
      title: "動物藤蔓救援 - WeightPlay",
      description: "在動物藤蔓救援中剪斷藤蔓、移動葉子彈墊，把水果送進飢餓動物的籃子；這是一款適合家庭遊玩的動物物理益智遊戲。",
    },
  };

  const rescueStage = (titleEn, titleZh, ruleEn, ruleZh, config) => ({
    titleEn, titleZh, ruleEn, ruleZh,
    gravity: 1080,
    wind: 0,
    requiredBounces: 1,
    bouncePower: 1,
    targetTolerance: 15,
    ...config,
  });

  const stages = [
    rescueStage("First Apple Drop", "第一顆蘋果", "One calm bounce", "平靜的一次彈跳", { fruit: "apple", animal: "rabbit", startX: 48, targetX: 50, paddleX: 50, gravity: 980 }),
    rescueStage("Sunny Banana Arc", "陽光香蕉弧線", "Guide a rightward breeze", "順著右風引導", { fruit: "banana", animal: "lion", startX: 35, targetX: 68, paddleX: 52, wind: 24 }),
    rescueStage("Berry Return", "莓果回程", "Guide a leftward breeze", "順著左風引導", { fruit: "berry", animal: "panda", startX: 66, targetX: 34, paddleX: 48, wind: -22 }),
    rescueStage("Fox's Long Basket", "狐狸的遠方籃子", "Cross the whole clearing", "橫越整片空地", { fruit: "apple", animal: "fox", startX: 28, targetX: 74, paddleX: 45, wind: 38, targetTolerance: 13 }),
    rescueStage("Panko's Balance Check", "Panko 平衡檢核", "Follow a gently moving basket", "追上緩慢移動的籃子", { fruit: "banana", animal: "koala", startX: 72, targetX: 34, paddleX: 55, wind: -24, basketMotion: { amplitude: 7, speed: 1.2 }, checkpoint: true }),

    rescueStage("Rabbit's Rolling Cart", "兔兔移動餐車", "Basket drifts side to side", "籃子會左右移動", { fruit: "berry", animal: "rabbit", startX: 52, targetX: 50, paddleX: 50, basketMotion: { amplitude: 9, speed: 1.45 } }),
    rescueStage("Lion's Return Cart", "獅子的回程餐車", "Meet the basket on its return", "在籃子回程時接住", { fruit: "apple", animal: "lion", startX: 40, targetX: 30, paddleX: 58, wind: -18, basketMotion: { amplitude: 11, speed: 1.75, phase: 1.5 } }),
    rescueStage("Fox Cart Chase", "狐狸餐車追逐", "Aim ahead of a quick basket", "瞄準快速籃子的前方", { fruit: "banana", animal: "fox", startX: 58, targetX: 66, paddleX: 42, wind: 20, basketMotion: { amplitude: 12, speed: 2 } }),
    rescueStage("Narrow Panda Basket", "熊貓窄籃", "Moving basket, smaller opening", "移動籃子與較小入口", { fruit: "berry", animal: "panda", startX: 28, targetX: 62, paddleX: 46, wind: 14, basketMotion: { amplitude: 10, speed: 1.7 }, targetTolerance: 11 }),
    rescueStage("Panko's Moving-Basket Check", "Panko 移動籃檢核", "Two bounces into a moving basket", "彈跳兩次再進移動籃", { fruit: "apple", animal: "koala", startX: 70, targetX: 34, paddleX: 54, wind: -16, basketMotion: { amplitude: 13, speed: 1.85 }, requiredBounces: 2, checkpoint: true }),

    rescueStage("High Wind, Low Calm", "高處有風、低處平靜", "Wind fades below the treetops", "風在樹梢下減弱", { fruit: "banana", animal: "rabbit", startX: 30, targetX: 68, paddleX: 48, windZones: { splitY: 48, top: 44, bottom: 4 } }),
    rescueStage("Calm Then Crosswind", "先平靜再側風", "Wind begins below midair", "水果下降後才起風", { fruit: "berry", animal: "lion", startX: 70, targetX: 32, paddleX: 52, windZones: { splitY: 50, top: 0, bottom: -42 } }),
    rescueStage("Reversing Breeze", "反轉微風", "Wind reverses after the bounce", "彈跳後風向反轉", { fruit: "apple", animal: "fox", startX: 32, targetX: 66, paddleX: 48, wind: 34, afterBounceWind: -34 }),
    rescueStage("Two-Layer Orchard", "雙層果園風", "Read opposite upper and lower winds", "判斷上下相反風向", { fruit: "banana", animal: "panda", startX: 68, targetX: 30, paddleX: 52, windZones: { splitY: 46, top: -38, bottom: 30 }, targetTolerance: 12 }),
    rescueStage("Panko's Wind Check", "Panko 風向檢核", "Layered wind and a moving basket", "分層風向加上移動籃", { fruit: "berry", animal: "koala", startX: 30, targetX: 64, paddleX: 48, windZones: { splitY: 48, top: 34, bottom: -28 }, basketMotion: { amplitude: 8, speed: 1.6 }, checkpoint: true }),

    rescueStage("Double-Leaf Lesson", "雙彈葉子課", "Bounce twice before delivery", "配送前必須彈跳兩次", { fruit: "apple", animal: "rabbit", startX: 50, targetX: 48, paddleX: 50, requiredBounces: 2, bouncePower: .9 }),
    rescueStage("Two-Bounce Crosswind", "雙彈側風", "Correct the route on bounce two", "第二次彈跳修正路線", { fruit: "banana", animal: "lion", startX: 30, targetX: 70, paddleX: 44, wind: 22, requiredBounces: 2, bouncePower: .92 }),
    rescueStage("Drifting Double Bounce", "漂移雙彈", "Two bounces, moving basket", "彈跳兩次並追移動籃", { fruit: "berry", animal: "fox", startX: 70, targetX: 34, paddleX: 56, wind: -18, requiredBounces: 2, basketMotion: { amplitude: 9, speed: 1.5 }, bouncePower: .94 }),
    rescueStage("Soft Leaf Control", "柔葉控制", "A softer leaf needs closer steering", "較柔的葉子需要貼近控制", { fruit: "apple", animal: "panda", startX: 34, targetX: 64, paddleX: 48, windZones: { splitY: 52, top: 16, bottom: -12 }, requiredBounces: 2, bouncePower: .82, targetTolerance: 12 }),
    rescueStage("Panko's Twin-Bounce Check", "Panko 雙彈檢核", "Two bounces, reverse wind, moving basket", "雙彈、反向風與移動籃", { fruit: "banana", animal: "koala", startX: 68, targetX: 32, paddleX: 52, wind: -26, afterBounceWind: 24, requiredBounces: 2, basketMotion: { amplitude: 10, speed: 1.7 }, checkpoint: true }),

    rescueStage("Two-Fruit Picnic", "雙水果野餐", "Deliver two fruit without leaving Battle", "不離開遊玩畫面連送兩份", { paddleX: 50, deliveries: [{ fruit: "apple", animal: "rabbit", startX: 40, targetX: 62, wind: 12 }, { fruit: "berry", animal: "panda", startX: 66, targetX: 34, wind: -18 }] }),
    rescueStage("Breeze Picnic", "微風野餐", "Two fruit with opposite winds", "兩份水果使用相反風向", { paddleX: 50, deliveries: [{ fruit: "banana", animal: "lion", startX: 30, targetX: 68, wind: 30 }, { fruit: "apple", animal: "fox", startX: 70, targetX: 32, wind: -30 }] }),
    rescueStage("Rolling-Cart Picnic", "移動餐車野餐", "Two fruit share one moving basket", "兩份水果共用移動籃", { paddleX: 50, basketMotion: { amplitude: 9, speed: 1.55 }, deliveries: [{ fruit: "berry", animal: "rabbit", startX: 34, targetX: 58, wind: 14 }, { fruit: "banana", animal: "koala", startX: 66, targetX: 42, wind: -14 }] }),
    rescueStage("Mixed-Bounce Picnic", "混合彈跳野餐", "One bounce, then two", "先彈一次，再彈兩次", { paddleX: 50, deliveries: [{ fruit: "apple", animal: "panda", startX: 30, targetX: 66, wind: 20, requiredBounces: 1 }, { fruit: "berry", animal: "fox", startX: 68, targetX: 34, wind: -18, requiredBounces: 2, bouncePower: .9 }] }),
    rescueStage("Panko's Picnic Check", "Panko 野餐檢核", "Two deliveries with layered wind", "分層風向的雙份配送", { paddleX: 50, windZones: { splitY: 48, top: 28, bottom: -20 }, basketMotion: { amplitude: 7, speed: 1.45 }, deliveries: [{ fruit: "banana", animal: "lion", startX: 32, targetX: 64 }, { fruit: "apple", animal: "koala", startX: 68, targetX: 36, requiredBounces: 2 }], checkpoint: true }),

    rescueStage("Narrow Current", "窄籃氣流", "Narrow basket and reversing wind", "窄籃加上反轉風向", { fruit: "berry", animal: "rabbit", startX: 30, targetX: 68, paddleX: 48, wind: 30, afterBounceWind: -26, targetTolerance: 10 }),
    rescueStage("Moving Double Mastery", "移動雙彈精通", "Two bounces into a quick basket", "雙彈進入快速移動籃", { fruit: "apple", animal: "lion", startX: 70, targetX: 34, paddleX: 52, requiredBounces: 2, basketMotion: { amplitude: 12, speed: 2.05 }, bouncePower: .9, targetTolerance: 11 }),
    rescueStage("Layered Delivery Pair", "分層風配送組", "Two deliveries, two wind plans", "兩份配送、兩套風向計畫", { paddleX: 50, deliveries: [{ fruit: "banana", animal: "fox", startX: 28, targetX: 70, windZones: { splitY: 50, top: 36, bottom: -12 } }, { fruit: "berry", animal: "panda", startX: 70, targetX: 30, wind: -28, afterBounceWind: 24, requiredBounces: 2 }] }),
    rescueStage("Grand Rehearsal", "盛大彩排", "Three different rescue routes", "連續三種不同救援路線", { paddleX: 50, basketMotion: { amplitude: 7, speed: 1.4 }, deliveries: [{ fruit: "apple", animal: "rabbit", startX: 34, targetX: 64, wind: 18 }, { fruit: "banana", animal: "lion", startX: 68, targetX: 34, windZones: { splitY: 48, top: -30, bottom: 20 } }, { fruit: "berry", animal: "fox", startX: 30, targetX: 68, requiredBounces: 2, bouncePower: .9 }] }),
    rescueStage("Panko's Grand Rescue", "Panko 終極救援", "Three fruit, layered wind, twin bounce, moving basket", "三水果、分層風、雙彈與移動籃", { paddleX: 50, basketMotion: { amplitude: 10, speed: 1.75 }, targetTolerance: 11, deliveries: [{ fruit: "apple", animal: "rabbit", startX: 30, targetX: 66, windZones: { splitY: 48, top: 30, bottom: -18 } }, { fruit: "banana", animal: "panda", startX: 70, targetX: 34, wind: -28, afterBounceWind: 24, requiredBounces: 2 }, { fruit: "berry", animal: "koala", startX: 34, targetX: 64, windZones: { splitY: 52, top: 22, bottom: -24 }, requiredBounces: 2, bouncePower: .88 }], checkpoint: true }),
  ];

  function validateStages() {
    if (stages.length !== 30) throw new Error(`Animal Vine Rescue requires 30 stages, found ${stages.length}.`);
    if (new Set(stages.map((stage) => stage.titleEn)).size !== 30) throw new Error("Animal Vine Rescue stage titles must be unique.");
    const checkpoints = stages.map((stage, index) => stage.checkpoint ? index + 1 : 0).filter(Boolean);
    if (checkpoints.join(",") !== "5,10,15,20,25,30") throw new Error(`Unexpected Panko checkpoints: ${checkpoints.join(",")}`);
  }
  validateStages();

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
  let currentDelivery = 0;
  let bounceCount = 0;
  let stageStartedAt = 0;
  let basketX = 50;
  let deliveryTimer = 0;
  let running = false;
  let settled = false;
  let lastFrame = 0;
  let paddleX = 50;
  let fruit = { x: 50, y: 20, vx: 0, vy: 0, rot: 0, cut: false };

  function setPlayingState(isPlaying) {
    document.documentElement.classList.toggle("is-vine-playing", isPlaying);
    document.body.classList.toggle("is-vine-playing", isPlaying);
    window.WEIGHTPLAY_VINE_RESCUE_ACTIVE = isPlaying;
    window.WeightPlayGame?.updateVisualViewportVars?.();
    window.dispatchEvent(new CustomEvent("animal-vine-rescue:play-state", { detail: { playing: isPlaying } }));
  }

  function setStageState(isStage) {
    document.documentElement.classList.toggle("is-vine-stage-select", isStage);
    document.body.classList.toggle("is-vine-stage-select", isStage);
    window.WonderSound?.setGameActive?.(isStage);
    window.WeightPlayGame?.updateVisualViewportVars?.();
    requestAnimationFrame(updateStageScale);
  }

  function t(key, data = {}) {
    const value = text[locale]?.[key] || text.en[key] || key;
    return Object.entries(data).reduce((out, [name, item]) => out.replaceAll(`{${name}}`, String(item)), value);
  }

  function stageTitle(stage) {
    return locale === "zh-Hant" ? stage.titleZh : stage.titleEn;
  }

  function stageRule(stage) {
    return locale === "zh-Hant" ? stage.ruleZh : stage.ruleEn;
  }

  function stageRoutes(stage) {
    return Array.isArray(stage.deliveries) && stage.deliveries.length ? stage.deliveries : [stage];
  }

  function routeFor(stage, index = currentDelivery) {
    return { ...stage, ...stageRoutes(stage)[Math.max(0, Math.min(stageRoutes(stage).length - 1, index))] };
  }

  function basketPositionFor(stage, route, elapsedMs) {
    const motion = route.basketMotion || stage.basketMotion;
    if (!motion) return route.targetX;
    const phase = Number(motion.phase) || 0;
    const x = route.targetX + Number(motion.amplitude || 0) * Math.sin((elapsedMs / 1000) * Number(motion.speed || 1) + phase);
    return Math.max(16, Math.min(84, x));
  }

  function windFor(stage, route, y, bounces) {
    const zones = route.windZones || stage.windZones;
    let value = Number(route.wind ?? stage.wind ?? 0);
    if (zones) value = y < Number(zones.splitY || 50) ? Number(zones.top || 0) : Number(zones.bottom || 0);
    const reversed = route.afterBounceWind ?? stage.afterBounceWind;
    if (bounces > 0 && reversed !== undefined) value = Number(reversed || 0);
    return value;
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
    const seoCopy = seo[locale] || seo.en;
    document.title = seoCopy.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", seoCopy.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", seoCopy.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", seoCopy.description);
    document.querySelector('[data-wp-return="main"]')?.setAttribute("aria-label", t("backToLobby"));
    nodes.localeSelect.setAttribute("aria-label", t("language"));
    nodes.stageBackBtn.setAttribute("aria-label", t("backToStages"));
    nodes.playfield.setAttribute("aria-label", t("playfield"));
    nodes.vineButton.setAttribute("aria-label", t("cutVine"));
    nodes.leafPaddle.setAttribute("aria-label", t("leafControl"));
    updatePaddleAccessibility();
    renderStages();
    if (!nodes.gamePanel.classList.contains("hidden")) setupStage(currentStage);
  }

  function show(panel) {
    if (panel !== nodes.gamePanel) {
      running = false;
      window.clearTimeout(deliveryTimer);
    }
    setPlayingState(panel === nodes.gamePanel);
    setStageState(panel === nodes.stagePanel);
    [nodes.menuPanel, nodes.stagePanel, nodes.gamePanel].forEach((node) => node.classList.add("hidden"));
    panel.classList.remove("hidden");
    window.scrollTo({ top: 0, left: 0, behavior: panel === nodes.gamePanel ? "auto" : "smooth" });
  }

  function renderStages() {
    nodes.stagePanel.innerHTML = `<div class="stage-shell-head"><button type="button" class="stage-return" data-wp-return="stage" data-stage-main aria-label="${t("backToMain")}">&larr;</button><div><strong>${t("stages")}</strong><span>${t("menuHint")}</span></div></div><div class="stage-rail">` + stages
      .map((stage, index) => {
        const stageNo = index + 1;
        const locked = stageNo > save.unlocked;
        const got = save.stars[stageNo] || 0;
        return `
          <button class="stage-card ${locked ? "locked" : ""}" type="button" data-stage="${stageNo}" aria-disabled="${locked ? "true" : "false"}">
            ${stage.checkpoint ? `<img class="stage-checkpoint" src="${assets.panko}" alt="" aria-hidden="true" />` : ""}
            <strong>${t("stageLabel", { n: stageNo })} · ${stageTitle(stage)}</strong>
            <span class="stage-card-route" aria-hidden="true">
              <img src="${assets[routeFor(stage, 0).fruit]}" alt="" />
              <b>→</b>
              <img src="${assets[routeFor(stage, 0).animal]}" alt="" />
            </span>
            <small>${stageRule(stage)}</small>
            <small>${t(routeFor(stage, 0).fruit)} → ${t(routeFor(stage, 0).animal)}${stageRoutes(stage).length > 1 ? ` · ${stageRoutes(stage).length}×` : ""}</small>
            ${stage.checkpoint ? `<small class="stage-card-check">${t("checkpoint")}</small>` : ""}
            ${locked ? `<small class="stage-card-lock">${t("locked")}</small>` : ""}
            <span>${"★".repeat(got)}${"☆".repeat(3 - got)}</span>
          </button>
        `;
      })
      .join("") + `</div>`;
    installStageRailDrag();
  }

  function focusStage(stageNo = save.unlocked) {
    requestAnimationFrame(() => {
      const rail = nodes.stagePanel.querySelector(".stage-rail");
      const card = rail?.querySelector(`[data-stage="${Math.max(1, Math.min(stages.length, stageNo))}"]`);
      if (!rail || !card || nodes.stagePanel.classList.contains("hidden")) return;
      rail.scrollTo({
        left: Math.max(0, card.offsetLeft + card.offsetWidth / 2 - rail.clientWidth / 2),
        behavior: "instant",
      });
      card.focus({ preventScroll: true });
    });
  }

  function showStages(stageNo = save.unlocked) {
    renderStages();
    show(nodes.stagePanel);
    focusStage(stageNo);
  }

  function installStageRailDrag() {
    const rail = nodes.stagePanel.querySelector(".stage-rail");
    if (!rail) return;
    let pointerId = null;
    let startX = 0;
    let startScroll = 0;
    let dragged = false;
    const snapNearest = () => {
      const cards = [...rail.querySelectorAll(".stage-card")];
      const railCenter = rail.scrollLeft + rail.clientWidth / 2;
      const nearest = cards.reduce((best, card) => {
        const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - railCenter);
        return !best || distance < best.distance ? { card, distance } : best;
      }, null);
      if (nearest) rail.scrollTo({ left: Math.max(0, nearest.card.offsetLeft + nearest.card.offsetWidth / 2 - rail.clientWidth / 2), behavior: "smooth" });
    };
    const dragSurface = nodes.stagePanel;
    const beginDrag = (event, id) => {
      if (rail.dataset.wpStageRail === "true") return;
      if (!event.target.closest(".stage-rail")) return;
      pointerId = id;
      startX = event.clientX;
      startScroll = rail.scrollLeft;
      dragged = false;
      rail.style.scrollSnapType = "none";
    };
    const moveDrag = (event, id) => {
      if (id !== pointerId) return;
      const delta = event.clientX - startX;
      if (!dragged && Math.abs(delta) < 5) return;
      dragged = true;
      rail.scrollLeft = startScroll - delta;
      event.preventDefault();
    };
    const finishDrag = (id) => {
      if (id !== pointerId) return;
      if (dragged) {
        rail.dataset.suppressClick = "true";
        rail.style.scrollSnapType = "";
        snapNearest();
        window.setTimeout(() => delete rail.dataset.suppressClick, 0);
      }
      if (!dragged) rail.style.scrollSnapType = "";
      pointerId = null;
    };
    dragSurface.addEventListener("pointerdown", (event) => beginDrag(event, `pointer-${event.pointerId}`), true);
    dragSurface.addEventListener("pointermove", (event) => moveDrag(event, `pointer-${event.pointerId}`), true);
    dragSurface.addEventListener("pointerup", (event) => finishDrag(`pointer-${event.pointerId}`), true);
    dragSurface.addEventListener("pointercancel", (event) => finishDrag(`pointer-${event.pointerId}`), true);
    dragSurface.addEventListener("mousedown", (event) => beginDrag(event, "mouse"), true);
    dragSurface.addEventListener("mousemove", (event) => moveDrag(event, "mouse"), true);
    dragSurface.addEventListener("mouseup", () => finishDrag("mouse"), true);
  }

  function setupStage(stageNo) {
    currentStage = Math.max(1, Math.min(stages.length, stageNo));
    const stage = stages[currentStage - 1];
    window.clearTimeout(deliveryTimer);
    currentDelivery = 0;
    bounceCount = 0;
    paddleX = stage.paddleX;
    setupDelivery(stage);
  }

  function setupDelivery(stage = stages[currentStage - 1]) {
    const route = routeFor(stage);
    running = false;
    settled = false;
    lastFrame = 0;
    bounceCount = 0;
    stageStartedAt = performance.now();
    basketX = route.targetX;
    fruit = { x: route.startX, y: 19, vx: Number(route.wind || 0), vy: 0, rot: 0, cut: false };
    nodes.stageText.textContent = String(currentStage);
    nodes.scoreText.textContent = `${currentDelivery + 1}/${stageRoutes(stage).length}`;
    nodes.targetZone.style.left = `${basketX}%`;
    nodes.targetGuide.style.left = `${basketX}%`;
    nodes.fallGuide.classList.remove("active");
    nodes.targetGuide.classList.remove("active");
    nodes.targetAnimal.src = assets[route.animal];
    nodes.fruit.src = assets[route.fruit];
    nodes.vineButton.classList.remove("cut");
    nodes.cutNowBtn.disabled = false;
    nodes.cutNowBtn.classList.remove("cut");
    nodes.vineButton.style.left = `${route.startX}%`;
    nodes.aimGuide.classList.add("active");
    nodes.hintText.textContent = `${stageRule(stage)} · ${t("readyHint")}`;
    positionElements();
  }

  function scoreForStage() {
    return Object.values(save.stars).reduce((total, star) => total + star * 100, 0);
  }

  function positionElements() {
    const stage = stages[currentStage - 1];
    const route = routeFor(stage);
    nodes.fruit.style.left = `${fruit.x}%`;
    nodes.fruit.style.top = `${fruit.y}%`;
    nodes.fruit.style.rotate = `${fruit.rot}deg`;
    nodes.fallGuide.style.left = `${fruit.x}%`;
    nodes.leafPaddle.style.left = `${paddleX}%`;
    nodes.targetZone.style.left = `${basketX}%`;
    nodes.targetGuide.style.left = `${basketX}%`;
    updatePaddleAccessibility();
    updateAimGuide(paddleX, basketX || route.targetX);
  }

  function updatePaddleAccessibility() {
    const value = Math.round(paddleX);
    nodes.leafPaddle.setAttribute("aria-valuenow", String(value));
    nodes.leafPaddle.setAttribute("aria-valuetext", t("leafPosition", { value }));
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
    requestAnimationFrame(() => nodes.leafPaddle.focus({ preventScroll: true }));
    lastFrame = performance.now();
    window.WonderSound?.play?.("click");
    requestAnimationFrame(tick);
  }

  function applyLeafBounce(route, playfieldHeight, offset = 0) {
    bounceCount += 1;
    fruit.vy = -Math.max(610, playfieldHeight * 1.08) * Number(route.bouncePower || 1);
    fruit.vx += offset * 520;
    return { bounceCount, vx: fruit.vx, vy: fruit.vy };
  }

  function tick(now) {
    if (!running || settled) return;
    const dt = Math.min(0.028, (now - lastFrame) / 1000 || 0.016);
    lastFrame = now;
    const rect = nodes.playfield.getBoundingClientRect();
    const stage = stages[currentStage - 1];
    const route = routeFor(stage);
    const fruitPx = rect.width * 0.12;
    let x = (fruit.x / 100) * rect.width;
    let y = (fruit.y / 100) * rect.height;
    const paddleY = rect.height * 0.76;
    const paddleW = Math.min(rect.width * 0.34, 190);
    const paddleCenter = (paddleX / 100) * rect.width;
    basketX = basketPositionFor(stage, route, now - stageStartedAt);
    fruit.vy += Number(route.gravity || stage.gravity) * dt;
    fruit.vx += windFor(stage, route, fruit.y, bounceCount) * dt * 0.12;
    x += fruit.vx * dt;
    y += fruit.vy * dt;
    fruit.rot += fruit.vx * dt * 0.42;

    const hitPaddle = fruit.vy > 0 && y + fruitPx * 0.35 >= paddleY && y < paddleY + 26 && Math.abs(x - paddleCenter) < paddleW * 0.56;
    if (hitPaddle) {
      const offset = (x - paddleCenter) / (paddleW * 0.5);
      applyLeafBounce(route, rect.height, offset);
      y = paddleY - fruitPx * 0.45;
      showFloat(t("bounceProgress", { current: Math.min(bounceCount, Number(route.requiredBounces || 1)), total: Number(route.requiredBounces || 1) }));
      window.WonderSound?.play?.("pop");
    }

    fruit.x = (x / rect.width) * 100;
    fruit.y = (y / rect.height) * 100;
    positionElements();

    const targetCenter = (basketX / 100) * rect.width;
    const basketY = rect.height * 0.86;
    const requiredBounces = Number(route.requiredBounces || stage.requiredBounces || 1);
    const targetTolerance = Number(route.targetTolerance || stage.targetTolerance || 15) / 100;
    if (bounceCount >= requiredBounces && y > basketY - fruitPx * 0.15 && y < basketY + fruitPx * 0.8 && Math.abs(x - targetCenter) < rect.width * targetTolerance) {
      completeDelivery();
      return;
    }
    if (y > rect.height + fruitPx || x < -fruitPx || x > rect.width + fruitPx) {
      finish(false);
      return;
    }
    requestAnimationFrame(tick);
  }

  function completeDelivery() {
    const stage = stages[currentStage - 1];
    const total = stageRoutes(stage).length;
    running = false;
    if (currentDelivery + 1 >= total) {
      finish(true);
      return;
    }
    currentDelivery += 1;
    nodes.scoreText.textContent = `${currentDelivery + 1}/${total}`;
    showToast(t("nextDelivery", { current: currentDelivery + 1, total }));
    deliveryTimer = window.setTimeout(() => setupDelivery(stage), 420);
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
    (success && currentStage < stages.length ? nodes.nextStageBtn : nodes.retryBtn).focus();
    window.WonderSound?.play?.(success ? "success" : "error");
  }

  function movePaddle(clientX) {
    const rect = nodes.playfield.getBoundingClientRect();
    paddleX = Math.max(16, Math.min(84, ((clientX - rect.left) / rect.width) * 100));
    positionElements();
  }

  function setPaddlePosition(value) {
    paddleX = Math.max(16, Math.min(84, value));
    positionElements();
  }

  function isVineCutPointer(event) {
    if (running || settled || fruit.cut) return false;
    const rect = nodes.playfield.getBoundingClientRect();
    const stage = stages[currentStage - 1];
    const route = routeFor(stage);
    const xPct = ((event.clientX - rect.left) / rect.width) * 100;
    const yPct = ((event.clientY - rect.top) / rect.height) * 100;
    const nearVine = Math.abs(xPct - route.startX) <= 12 && yPct <= 48;
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
    showStages(save.unlocked);
  });
  nodes.stageBackBtn.addEventListener("click", () => {
    showStages(currentStage);
  });
  nodes.stagePanel.addEventListener("click", (event) => {
    if (event.target.closest("[data-stage-main]")) {
      show(nodes.menuPanel);
      return;
    }
    const button = event.target.closest("[data-stage]");
    if (!button) return;
    if (nodes.stagePanel.querySelector(".stage-rail")?.dataset.suppressClick) return;
    const stageNo = Number(button.dataset.stage);
    if (stageNo > save.unlocked) {
      showToast(t("locked"));
      return;
    }
    setupStage(stageNo);
    show(nodes.gamePanel);
    requestAnimationFrame(() => nodes.leafPaddle.focus({ preventScroll: true }));
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
  nodes.leafPaddle.addEventListener("keydown", (event) => {
    if (settled || !nodes.resultPanel.classList.contains("hidden")) return;
    const key = event.key;
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(key)) return;
    event.preventDefault();
    if (key === "Home") setPaddlePosition(16);
    else if (key === "End") setPaddlePosition(84);
    else setPaddlePosition(paddleX + (key === "ArrowLeft" ? -4 : 4));
    window.WonderSound?.play?.("click");
  });
  nodes.nextStageBtn.addEventListener("click", () => {
    nodes.resultPanel.classList.add("hidden");
    setupStage(currentStage + 1);
    requestAnimationFrame(() => nodes.leafPaddle.focus({ preventScroll: true }));
  });
  nodes.retryBtn.addEventListener("click", () => {
    nodes.resultPanel.classList.add("hidden");
    setupStage(currentStage);
    requestAnimationFrame(() => nodes.leafPaddle.focus({ preventScroll: true }));
  });
  nodes.resultStagesBtn.addEventListener("click", () => {
    nodes.resultPanel.classList.add("hidden");
    showStages(save.unlocked);
  });
  nodes.localeSelect.addEventListener("change", (event) => {
    window.WonderI18n?.setLocale?.(event.target.value);
    setLocale(event.target.value);
  });
  window.addEventListener("wonder:locale-change", (event) => setLocale(event.detail?.locale || window.WonderI18n?.locale?.()));
  window.addEventListener("weightplay:tutorial-start", (event) => {
    if (event.detail?.gameId !== GAME_ID || nodes.menuPanel.classList.contains("hidden")) return;
    showStages(save.unlocked);
  });
  window.addEventListener("resize", positionElements);

  nodes.localeSelect.value = locale;
  setLocale(locale);

  function updateStageScale() {
    if (!document.body.classList.contains("is-vine-stage-select")) return;
    const viewport = window.visualViewport;
    const viewportWidth = viewport?.width || window.innerWidth;
    const viewportHeight = viewport?.height || window.innerHeight;
    const scale = Math.max(0.01, Math.min((viewportWidth - 8) / 390, (viewportHeight - 8) / 788));
    document.documentElement.style.setProperty("--vine-stage-scale", String(scale));
    document.documentElement.style.setProperty("--vine-stage-top", `${viewportHeight - 4 - 788 * scale}px`);
  }

  window.addEventListener("resize", updateStageScale);
  window.addEventListener("orientationchange", updateStageScale);
  window.visualViewport?.addEventListener("resize", updateStageScale);
  window.visualViewport?.addEventListener("scroll", updateStageScale);

  const testMode = ["127.0.0.1", "localhost"].includes(location.hostname) || new URLSearchParams(location.search).has("wp_test");
  if (testMode) {
    const snapshot = () => {
      const stage = stages[currentStage - 1];
      const route = routeFor(stage);
      return {
        stage: currentStage,
        delivery: currentDelivery + 1,
        deliveries: stageRoutes(stage).length,
        title: stageTitle(stage),
        rule: stageRule(stage),
        fruit: route.fruit,
        animal: route.animal,
        requiredBounces: Number(route.requiredBounces || 1),
        bounceCount,
        movingBasket: Boolean(route.basketMotion),
        windZones: Boolean(route.windZones),
        reverseWind: route.afterBounceWind !== undefined,
        targetTolerance: Number(route.targetTolerance || 15),
        resultVisible: !nodes.resultPanel.classList.contains("hidden"),
      };
    };
    window.__ANIMAL_VINE_RESCUE_TEST__ = {
      stagePreview: () => stages.map((stage, index) => ({
        stage: index + 1,
        titleEn: stage.titleEn,
        checkpoint: Boolean(stage.checkpoint),
        deliveries: stageRoutes(stage).length,
        movingBasket: Boolean(stage.basketMotion || stageRoutes(stage).some((route) => route.basketMotion)),
        windZones: Boolean(stage.windZones || stageRoutes(stage).some((route) => route.windZones)),
        reverseWind: Boolean(stage.afterBounceWind !== undefined || stageRoutes(stage).some((route) => route.afterBounceWind !== undefined)),
        doubleBounce: stageRoutes(stage).some((route) => Number(route.requiredBounces || stage.requiredBounces || 1) >= 2),
        narrowBasket: stageRoutes(stage).some((route) => Number(route.targetTolerance || stage.targetTolerance || 15) < 15),
      })),
      mechanicPreview: (stageNo, y = 30, bounces = 0, elapsedMs = 0, delivery = 0) => {
        const stage = stages[Math.max(0, Math.min(stages.length - 1, Number(stageNo) - 1))];
        const route = routeFor(stage, delivery);
        return {
          basketX: basketPositionFor(stage, route, Number(elapsedMs) || 0),
          wind: windFor(stage, route, Number(y) || 0, Number(bounces) || 0),
          requiredBounces: Number(route.requiredBounces || 1),
          bouncePower: Number(route.bouncePower || 1),
        };
      },
      openStage: (stageNo) => {
        save.unlocked = stages.length;
        setupStage(stageNo);
        show(nodes.gamePanel);
        return snapshot();
      },
      advanceDelivery: () => {
        window.clearTimeout(deliveryTimer);
        const stage = stages[currentStage - 1];
        if (currentDelivery + 1 < stageRoutes(stage).length) {
          currentDelivery += 1;
          setupDelivery(stage);
        } else {
          finish(true);
        }
        return snapshot();
      },
      applyBounce: (offset = 0) => {
        const stage = stages[currentStage - 1];
        const route = routeFor(stage);
        return { ...applyLeafBounce(route, nodes.playfield.getBoundingClientRect().height || 602, Number(offset) || 0), ...snapshot() };
      },
      snapshot,
    };
  }
  setupStage(1);
  preload();
})();
