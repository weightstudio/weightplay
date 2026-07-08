(() => {
  const GAME_ID = "animal-reef-fisher";
  const saveKey = "weightplay_animal_reef_fisher_v1";
  const localeKey = "weightPlayLocale";
  const W = 960;
  const H = 540;
  const expeditionSeconds = 90;
  const lureCost = 3;
  const sonarCost = 2;
  const isTestMode = new URLSearchParams(window.location.search).get("test") === "1";

  const $ = (id) => document.getElementById(id);
  const canvas = $("gameCanvas");
  const ctx = canvas.getContext("2d");
  const nodes = {
    localeSelect: $("localeSelect"),
    loadingPanel: $("loadingPanel"),
    loadingFill: $("loadingFill"),
    loadingText: $("loadingText"),
    menuPanel: $("menuPanel"),
    gamePanel: $("gamePanel"),
    resultPanel: $("resultPanel"),
    zoneRow: $("zoneRow"),
    gearGrid: $("gearGrid"),
    startBtn: $("startBtn"),
    mapBtn: $("mapBtn"),
    retryBtn: $("retryBtn"),
    resultMenuBtn: $("resultMenuBtn"),
    lureBtn: $("lureBtn"),
    sonarPrepBtn: $("sonarPrepBtn"),
    sonarBtn: $("sonarBtn"),
    notesText: $("notesText"),
    albumText: $("albumText"),
    diamondText: $("diamondText"),
    zoneText: $("zoneText"),
    timeText: $("timeText"),
    goalText: $("goalText"),
    hintText: $("hintText"),
    castFill: $("castFill"),
    tensionLane: $("tensionLane"),
    safeBand: $("safeBand"),
    tensionMarker: $("tensionMarker"),
    tensionStatus: $("tensionStatus"),
    resultTitle: $("resultTitle"),
    resultText: $("resultText"),
    skillReportText: $("skillReportText"),
  };

  const text = {
    en: {
      title: "Animal Reef Fisher",
      pageTitle: "Animal Reef Fisher - Free Reef Fishing Animal Game | WeightPlay",
      pageDescription: "Animal Reef Fisher is a 13+ WeightPlay browser game about reef expeditions, cast timing, line tension, sea-creature albums, and local gear upgrades.",
      language: "Language",
      menuTitle: "Cast into the coral reef and build your sea-creature album.",
      menuHint: "Choose a reef zone, control line tension, earn Reef Notes, and upgrade your gear locally.",
      reefNotes: "Reef Notes",
      album: "Album",
      diamonds: "Diamonds",
      startExpedition: "Start Expedition",
      reefMap: "Reef Map",
      zone: "Zone",
      time: "Time",
      goal: "Goal",
      retry: "Try Again",
      castHint: "Hold in the reef to charge, release to cast.",
      charging: "Release when the power reaches the water depth you want.",
      hooked: "Fish hooked. Drag the red marker left or right. Keep it in the green SAFE area.",
      tensionTitle: "Line Tension",
      tensionLow: "Loose",
      tensionSafe: "Safe",
      tensionHigh: "Tight",
      tensionMarker: "Drag",
      tensionStatusAim: "Cast first, then control the line here.",
      tensionStatusCharging: "Release to cast. The tension control starts after a fish bites.",
      tensionStatusHooked: "Drag here. Red marker must stay in SAFE.",
      tensionStatusSafe: "Good tension. Keep the red marker here.",
      tensionStatusDanger: "Danger. Move the marker back into SAFE.",
      landed: "Catch landed! Keep going before time runs out.",
      broke: "Line broke. The tension marker left the safe band too long.",
      escaped: "The fish escaped. Cast again and keep the marker centered.",
      sonarReady: "Sonar is ready for this expedition.",
      sonarUsed: "Sonar pulse reveals the next rare movement.",
      needDiamonds: "Need {cost} diamonds.",
      lureReady: "Rare lure ready for the next expedition.",
      buyLure: "Rare Lure {cost}D",
      buySonar: "Sonar Ping {cost}D",
      sonar: "Sonar",
      upgrade: "Upgrade",
      max: "Max",
      locked: "Locked",
      complete: "Complete",
      expeditionWin: "Expedition Complete",
      expeditionFail: "Expedition Ended",
      result: "Landed {catches} catches, discovered {newFish} new album entries, and earned {notes} Reef Notes.",
      reportWin: "Skill Report: strong focus and reaction. You managed line tension while choosing safer casts.",
      reportFail: "Skill Report: good practice. Upgrade gear and keep the marker inside the safe band earlier.",
    },
    "zh-Hant": {
      title: "動物珊瑚釣手",
      pageTitle: "動物珊瑚釣手 | WeightPlay",
      pageDescription: "動物珊瑚釣手是 WeightPlay 的 13+ 瀏覽器遊戲，玩家進行珊瑚礁遠征、掌握拋竿時機與魚線張力、收集海洋生物圖鑑，並在本機升級裝備。",
      language: "語言",
      menuTitle: "把釣線拋進珊瑚礁，建立你的海洋生物圖鑑。",
      menuHint: "選擇礁區、控制魚線張力、獲得礁石筆記，並在本機升級裝備。",
      reefNotes: "礁石筆記",
      album: "圖鑑",
      diamonds: "鑽石",
      startExpedition: "開始遠征",
      reefMap: "礁區地圖",
      zone: "礁區",
      time: "時間",
      goal: "目標",
      retry: "再試一次",
      castHint: "按住礁海畫面蓄力，放開即可拋竿。",
      charging: "蓄力到想要的水深時放開。",
      hooked: "魚上鉤了。左右拖曳紅色標記，讓它留在綠色安全區。",
      tensionTitle: "魚線張力",
      tensionLow: "太鬆",
      tensionSafe: "安全",
      tensionHigh: "太緊",
      tensionMarker: "拖曳",
      tensionStatusAim: "先拋竿，魚上鉤後在這裡控線。",
      tensionStatusCharging: "放開即可拋竿；魚咬餌後才需要控線。",
      tensionStatusHooked: "拖曳這裡，紅色標記要留在安全區。",
      tensionStatusSafe: "張力剛好，讓紅色標記維持在這裡。",
      tensionStatusDanger: "危險，快把標記拉回安全區。",
      landed: "成功收線！趁時間結束前繼續挑戰。",
      broke: "魚線斷了。張力標記離開安全區太久。",
      escaped: "魚逃走了。再拋一次，讓標記更靠近中央。",
      sonarReady: "聲納已準備在這次遠征使用。",
      sonarUsed: "聲納脈衝揭示下一段稀有移動。",
      needDiamonds: "需要 {cost} 顆鑽石。",
      lureReady: "稀有魚餌已準備在下一次遠征使用。",
      buyLure: "稀有魚餌 {cost}鑽",
      buySonar: "聲納脈衝 {cost}鑽",
      sonar: "聲納",
      upgrade: "升級",
      max: "滿級",
      locked: "未解鎖",
      complete: "完成",
      expeditionWin: "遠征完成",
      expeditionFail: "遠征結束",
      result: "收獲 {catches} 次，發現 {newFish} 個新圖鑑項目，並獲得 {notes} 份礁石筆記。",
      reportWin: "能力報告：專注與反應表現穩定。你能一邊控制魚線張力，一邊選擇更安全的拋竿時機。",
      reportFail: "能力報告：這次是很好的練習。升級裝備，並更早讓標記回到安全區。",
    },
  };

  const assetPaths = {
    bg: "../../assets/animal-reef-fisher-reef-bg.webp",
    otter: "../../assets/animal-reef-fisher-otter-fisher.webp",
    boat: "../../assets/animal-reef-fisher-boat-safe.webp",
    fishA: "../../assets/animal-reef-fisher-fish-sheet-a.webp",
    fishB: "../../assets/animal-reef-fisher-fish-sheet-b.webp",
    splash: "../../assets/animal-reef-fisher-fx-splash.webp",
    shimmer: "../../assets/animal-reef-fisher-fx-rare-shimmer.webp",
    sonar: "../../assets/animal-reef-fisher-fx-sonar-pulse.webp",
  };

  const zones = [
    { id: "sunny", name: { en: "Sunny Shore", "zh-Hant": "陽光淺灘" }, img: "../../assets/animal-reef-fisher-zone-sunny-shore.webp", goal: 2, unlock: 1, speed: 0.65 },
    { id: "kelp", name: { en: "Kelp Garden", "zh-Hant": "海藻花園" }, img: "../../assets/animal-reef-fisher-zone-kelp-garden.webp", goal: 3, unlock: 2, speed: 0.85 },
    { id: "coral", name: { en: "Coral Gate", "zh-Hant": "珊瑚門" }, img: "../../assets/animal-reef-fisher-zone-coral-gate.webp", goal: 3, unlock: 3, speed: 1.05 },
    { id: "moon", name: { en: "Moon Tide", "zh-Hant": "月潮礁" }, img: "../../assets/animal-reef-fisher-zone-moon-tide.webp", goal: 4, unlock: 4, speed: 1.22 },
    { id: "deep", name: { en: "Deep Blue", "zh-Hant": "深藍海域" }, img: "../../assets/animal-reef-fisher-zone-deep-blue.webp", goal: 4, unlock: 5, speed: 1.42 },
  ];

  const gear = [
    { id: "rod", name: { en: "Rod Strength", "zh-Hant": "釣竿強度" }, img: "../../assets/animal-reef-fisher-gear-rod-strength.webp", cost: 18 },
    { id: "reel", name: { en: "Reel Control", "zh-Hant": "捲線控制" }, img: "../../assets/animal-reef-fisher-gear-reel-control.webp", cost: 18 },
    { id: "line", name: { en: "Line Durability", "zh-Hant": "魚線耐久" }, img: "../../assets/animal-reef-fisher-gear-line-durability.webp", cost: 20 },
    { id: "bait", name: { en: "Bait Quality", "zh-Hant": "魚餌品質" }, img: "../../assets/animal-reef-fisher-gear-bait-quality.webp", cost: 16 },
    { id: "boat", name: { en: "Boat Range", "zh-Hant": "小船航程" }, img: "../../assets/animal-reef-fisher-gear-boat-range.webp", cost: 22 },
    { id: "scan", name: { en: "Reef Scanner", "zh-Hant": "礁區掃描" }, img: "../../assets/animal-reef-fisher-gear-reef-scanner.webp", cost: 20 },
  ];

  const fish = Array.from({ length: 12 }, (_, index) => ({
    id: `fish-${index + 1}`,
    sheet: index < 6 ? "fishA" : "fishB",
    sx: 0,
    sy: index % 6,
    rare: index === 5 || index === 11,
  }));

  let locale = localStorage.getItem(localeKey) || "en";
  if (!text[locale]) locale = "en";
  let save = loadSave();
  let selectedZone = save.selectedZone || "sunny";
  let state = "loading";
  let run = null;
  let pointer = { down: false, x: 0, y: 0, tensionPct: 50, source: "canvas" };
  let lastTime = performance.now();
  let raf = 0;
  const images = {};

  function t(key, vars = {}) {
    let value = (text[locale] && text[locale][key]) || text.en[key] || key;
    Object.entries(vars).forEach(([k, v]) => {
      value = value.replace(`{${k}}`, String(v));
    });
    return value;
  }

  function loadSave() {
    try {
      const raw = JSON.parse(localStorage.getItem(saveKey) || "{}");
      return {
        notes: Math.max(0, Number(raw.notes) || 0),
        unlockedZone: Math.max(1, Number(raw.unlockedZone) || 1),
        bestCatches: Math.max(0, Number(raw.bestCatches) || 0),
        album: Array.isArray(raw.album) ? raw.album : [],
        gear: { rod: 1, reel: 1, line: 1, bait: 1, boat: 1, scan: 1, ...(raw.gear || {}) },
        selectedZone: raw.selectedZone || "sunny",
        lureReady: Boolean(raw.lureReady),
        sonarReady: Boolean(raw.sonarReady),
      };
    } catch {
      return { notes: 0, unlockedZone: 1, bestCatches: 0, album: [], gear: { rod: 1, reel: 1, line: 1, bait: 1, boat: 1, scan: 1 }, selectedZone: "sunny", lureReady: false, sonarReady: false };
    }
  }

  function saveProgress() {
    localStorage.setItem(saveKey, JSON.stringify(save));
  }

  function track(name, data = {}) {
    if (window.WonderAnalytics && typeof window.WonderAnalytics.track === "function") {
      window.WonderAnalytics.track(name, { game: GAME_ID, ...data });
    }
  }

  function wallet() {
    return window.WeightPlayWallet ? window.WeightPlayWallet.read() : { diamonds: 0 };
  }

  function applyLocale() {
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : "en";
    document.title = t("pageTitle");
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", t("pageDescription"));
    nodes.localeSelect.value = locale;
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
    renderMenu();
    updateTensionGuide();
  }

  function loadImages() {
    const entries = Object.entries(assetPaths);
    let done = 0;
    return Promise.all(entries.map(([key, src]) => new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        images[key] = img;
        done += 1;
        const pct = Math.round((done / entries.length) * 100);
        nodes.loadingFill.style.width = `${pct}%`;
        nodes.loadingText.textContent = `${pct}%`;
        resolve();
      };
      img.onerror = () => {
        done += 1;
        resolve();
      };
      img.src = src;
    })));
  }

  function renderMenu() {
    nodes.notesText.textContent = Math.floor(save.notes);
    nodes.albumText.textContent = `${save.album.length}/12`;
    nodes.diamondText.textContent = wallet().diamonds;
    nodes.zoneRow.innerHTML = zones.map((zone, index) => {
      const locked = index + 1 > save.unlockedZone;
      return `
        <button class="zone-card ${zone.id === selectedZone ? "is-selected" : ""} ${locked ? "is-locked" : ""}" data-zone="${zone.id}" type="button">
          <img src="${zone.img}" alt="" />
          <strong>${zone.name[locale]}</strong>
          <span>${locked ? t("locked") : `${t("goal")} ${zone.goal}`}</span>
        </button>
      `;
    }).join("");
    nodes.gearGrid.innerHTML = gear.map((item) => {
      const level = Number(save.gear[item.id]) || 1;
      const cost = item.cost * level;
      const maxed = level >= 5;
      return `
        <div class="gear-card">
          <img src="${item.img}" alt="" />
          <div><strong>${item.name[locale]}</strong><span>Lv.${level}</span></div>
          <button class="secondary-btn" data-gear="${item.id}" type="button">${maxed ? t("max") : `${t("upgrade")} ${cost}`}</button>
        </div>
      `;
    }).join("");
    nodes.lureBtn.textContent = save.lureReady ? t("lureReady") : t("buyLure", { cost: lureCost });
    nodes.sonarPrepBtn.textContent = save.sonarReady ? t("sonarReady") : t("buySonar", { cost: sonarCost });
  }

  function showPanel(which) {
    nodes.menuPanel.classList.toggle("is-hidden", which !== "menu");
    nodes.gamePanel.classList.toggle("is-hidden", which !== "game");
    nodes.resultPanel.classList.toggle("is-hidden", which !== "result");
  }

  function focusPanel(node) {
    const align = () => node.scrollIntoView({ block: "start", behavior: "auto" });
    align();
    window.requestAnimationFrame(align);
    window.setTimeout(align, 80);
  }

  function startRun() {
    const zone = zones.find((z) => z.id === selectedZone) || zones[0];
    run = {
      zone,
      time: expeditionSeconds,
      catches: 0,
      newFish: 0,
      notes: 0,
      phase: "aim",
      castPower: 0,
      castDir: 1,
      tension: 50,
      fishPower: 0,
      fishTimer: 0,
      struggle: 0,
      hookFish: null,
      splashTimer: 0,
      sonarPulse: 0,
      finished: false,
      lureUsed: save.lureReady,
      sonarReady: save.sonarReady,
    };
    save.lureReady = false;
    save.sonarReady = false;
    save.selectedZone = selectedZone;
    saveProgress();
    nodes.zoneText.textContent = zone.name[locale];
    nodes.goalText.textContent = `${run.catches}/${zone.goal}`;
    nodes.hintText.textContent = t("castHint");
    updateTensionGuide();
    state = "game";
    showPanel("game");
    focusPanel(nodes.gamePanel);
    track("game_start", { zone: zone.id });
  }

  function finishRun(won) {
    if (!run || run.finished) return;
    run.finished = true;
    state = "result";
    const bonus = won ? 12 : 5;
    const earned = run.catches * (4 + save.gear.bait) + bonus;
    run.notes += earned;
    save.notes += earned;
    save.bestCatches = Math.max(save.bestCatches, run.catches);
    if (won) save.unlockedZone = Math.min(5, Math.max(save.unlockedZone, zones.indexOf(run.zone) + 2));
    saveProgress();
    nodes.resultTitle.textContent = won ? t("expeditionWin") : t("expeditionFail");
    nodes.resultText.textContent = t("result", { catches: run.catches, newFish: run.newFish, notes: earned });
    nodes.skillReportText.textContent = won ? t("reportWin") : t("reportFail");
    showPanel("result");
    focusPanel(nodes.resultPanel);
    renderMenu();
    track("game_complete", { zone: run.zone.id, won, catches: run.catches, newFish: run.newFish, notes: earned });
  }

  function hookFish() {
    const zoneIndex = zones.indexOf(run.zone);
    let pool = fish.slice(0, Math.min(12, 4 + zoneIndex * 2));
    if (run.lureUsed) pool = pool.concat(fish.filter((f) => f.rare));
    run.hookFish = pool[Math.floor(Math.random() * pool.length)];
    run.phase = "reel";
    run.tension = 50;
    run.struggle = 0;
    run.fishPower = 45 + Math.random() * 40;
    run.fishTimer = 1.2;
    run.splashTimer = 0.8;
    nodes.hintText.textContent = t("hooked");
    updateTensionGuide();
    track("fish_hooked", { fish: run.hookFish.id, zone: run.zone.id });
  }

  function landFish() {
    const id = run.hookFish.id;
    if (!save.album.includes(id)) {
      save.album.push(id);
      run.newFish += 1;
      track("album_unlock", { fish: id });
    }
    run.catches += 1;
    run.notes += 3;
    run.phase = "aim";
    run.hookFish = null;
    run.splashTimer = 0.8;
    nodes.goalText.textContent = `${run.catches}/${run.zone.goal}`;
    nodes.hintText.textContent = t("landed");
    updateTensionGuide();
    if (run.catches >= run.zone.goal) finishRun(true);
  }

  function lineBreak() {
    run.phase = "aim";
    run.hookFish = null;
    run.splashTimer = 1;
    nodes.hintText.textContent = t("broke");
    updateTensionGuide();
    track("line_break", { zone: run.zone.id });
  }

  function tensionRange() {
    if (!run) return { safeMin: 38, safeMax: 62, safe: true };
    const safeMin = 38 - save.gear.rod;
    const safeMax = 62 + save.gear.line;
    return {
      safeMin,
      safeMax,
      safe: run.tension >= safeMin && run.tension <= safeMax,
    };
  }

  function updateTensionGuide() {
    const range = tensionRange();
    nodes.safeBand.style.left = `${range.safeMin}%`;
    nodes.safeBand.style.width = `${range.safeMax - range.safeMin}%`;
    nodes.tensionLane.classList.toggle("is-active", Boolean(run && run.phase === "reel"));
    nodes.tensionLane.classList.toggle("is-safe", Boolean(run && run.phase === "reel" && range.safe));
    nodes.tensionLane.classList.toggle("is-danger", Boolean(run && run.phase === "reel" && !range.safe));
    if (!run || run.phase === "aim") nodes.tensionStatus.textContent = t("tensionStatusAim");
    else if (run.phase === "charging" || run.phase === "cast") nodes.tensionStatus.textContent = t("tensionStatusCharging");
    else if (run.phase === "reel") nodes.tensionStatus.textContent = range.safe ? t("tensionStatusSafe") : t("tensionStatusDanger");
    else nodes.tensionStatus.textContent = t("tensionStatusHooked");
  }

  function update(dt) {
    if (state !== "game" || !run || run.finished) return;
    run.time -= dt;
    if (run.time <= 0) {
      finishRun(run.catches >= run.zone.goal);
      return;
    }
    nodes.timeText.textContent = Math.max(0, Math.ceil(run.time));
    nodes.goalText.textContent = `${run.catches}/${run.zone.goal}`;

    if (run.phase === "charging") {
      run.castPower += dt * run.castDir * 62;
      if (run.castPower >= 100) {
        run.castPower = 100;
        run.castDir = -1;
      }
      if (run.castPower <= 0) {
        run.castPower = 0;
        run.castDir = 1;
      }
    }

    if (run.phase === "cast") {
      run.fishTimer -= dt;
      if (run.fishTimer <= 0) hookFish();
    }

    if (run.phase === "reel") {
      const gearControl = save.gear.reel * 0.4 + save.gear.line * 0.28;
      const target = pointer.down ? Math.max(0, Math.min(100, pointer.tensionPct)) : 50;
      const pull = Math.sin(performance.now() / 360) * run.zone.speed * 24 + (run.hookFish.rare ? 10 : 0);
      run.tension += (target - run.tension) * dt * (1.4 + gearControl) + pull * dt;
      run.tension = Math.max(0, Math.min(100, run.tension));
      const { safe } = tensionRange();
      if (!safe) run.struggle += dt;
      else run.struggle = Math.max(0, run.struggle - dt * 1.8);
      run.fishPower -= dt * (9 + save.gear.rod * 1.7 + save.gear.bait * 0.9);
      if (run.struggle > 2.2) lineBreak();
      if (run.fishPower <= 0 && run.phase === "reel") landFish();
    }

    run.splashTimer = Math.max(0, run.splashTimer - dt);
    run.sonarPulse = Math.max(0, run.sonarPulse - dt);
    nodes.castFill.style.width = `${run.phase === "charging" ? run.castPower : 0}%`;
    nodes.tensionMarker.style.left = `${run.tension}%`;
    updateTensionGuide();
  }

  function drawSpriteSheet(img, cols, rows, index, x, y, w, h) {
    if (!img || !img.width) return;
    const sx = (index % cols) * (img.width / cols);
    const sy = Math.floor(index / cols) * (img.height / rows);
    ctx.drawImage(img, sx, sy, img.width / cols, img.height / rows, x, y, w, h);
  }

  function drawFishSprite(fishData, x, y, w, h) {
    const img = images[fishData.sheet];
    if (!img || !img.width) return;
    const cols = 3;
    const rows = 6;
    const cellW = img.width / cols;
    const cellH = img.height / rows;
    const swimFrame = Math.floor(performance.now() / 180) % cols;
    const sx = swimFrame * cellW;
    const sy = fishData.sy * cellH;
    ctx.drawImage(img, sx, sy, cellW, cellH, x, y, w, h);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    if (images.bg) ctx.drawImage(images.bg, 0, 0, W, H);
    ctx.fillStyle = "rgba(2, 38, 48, 0.12)";
    ctx.fillRect(0, 0, W, H);

    if (images.boat) ctx.drawImage(images.boat, 34, 288, 196, 116);
    drawSpriteSheet(images.otter, 3, 2, run && run.phase === "reel" ? 2 : 0, 42, 236, 132, 132);

    if (run) {
      const powerY = 430 - (run.castPower / 100) * 270;
      ctx.strokeStyle = "rgba(255,255,255,0.75)";
      ctx.lineWidth = 5;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(172, 320);
      ctx.quadraticCurveTo(390, powerY, 600, powerY + 40);
      ctx.stroke();
      ctx.setLineDash([]);

      if (run.phase === "cast" || run.phase === "reel") {
        const t = performance.now() / 1000;
        const x = 500 + Math.sin(t * 1.4) * 80;
        const y = 240 + Math.cos(t * 1.1) * 45;
        const f = run.hookFish || fish[0];
        drawFishSprite(f, x, y, f.rare ? 132 : 112, f.rare ? 132 : 112);
        if (f.rare || run.sonarPulse > 0) drawSpriteSheet(images.shimmer, 1, 1, 0, x - 18, y - 18, 150, 110);
      }

      if (run.splashTimer > 0) {
        drawSpriteSheet(images.splash, 1, 1, 0, 540, 312, 150, 120);
      }
      if (run.sonarPulse > 0) {
        drawSpriteSheet(images.sonar, 1, 1, 0, 360, 120, 270, 270);
      }
    }
  }

  function tick(now) {
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    update(dt);
    draw();
    raf = requestAnimationFrame(tick);
  }

  function startCharge(evt) {
    if (state !== "game" || !run || run.phase !== "aim") return;
    pointer.down = true;
    updatePointer(evt);
    run.phase = "charging";
    run.castPower = 0;
    run.castDir = 1;
    nodes.hintText.textContent = t("charging");
    updateTensionGuide();
  }

  function releaseCast() {
    if (state !== "game" || !run) return;
    pointer.down = false;
    if (run.phase === "charging") {
      run.phase = "cast";
      run.fishTimer = Math.max(0.45, 1.45 - run.castPower / 100);
      updateTensionGuide();
      track("cast", { power: Math.round(run.castPower), zone: run.zone.id });
    }
  }

  function updatePointer(evt) {
    const point = evt.touches ? evt.touches[0] : evt;
    const rect = canvas.getBoundingClientRect();
    pointer.source = "canvas";
    pointer.x = point.clientX - rect.left;
    pointer.y = point.clientY - rect.top;
    pointer.tensionPct = Math.max(0, Math.min(100, (pointer.x / rect.width) * 100));
  }

  function updateLanePointer(evt) {
    const point = evt.touches ? evt.touches[0] : evt;
    const laneRect = nodes.tensionLane.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (point.clientX - laneRect.left) / laneRect.width));
    pointer.source = "lane";
    pointer.tensionPct = pct * 100;
    pointer.x = pct * canvasRect.width;
    pointer.y = canvasRect.height * 0.86;
  }

  function buyDiamondItem(type) {
    const cost = type === "lure" ? lureCost : sonarCost;
    if ((type === "lure" && save.lureReady) || (type === "sonar" && save.sonarReady)) return;
    if (!window.WeightPlayWallet || !window.WeightPlayWallet.spendDiamonds(cost)) {
      nodes.hintText.textContent = t("needDiamonds", { cost });
      return;
    }
    if (type === "lure") save.lureReady = true;
    else save.sonarReady = true;
    saveProgress();
    renderMenu();
    track(type === "lure" ? "rare_lure_purchase" : "sonar_purchase", { cost });
  }

  function upgradeGear(id) {
    const item = gear.find((g) => g.id === id);
    const level = Number(save.gear[id]) || 1;
    if (!item || level >= 5) return;
    const cost = item.cost * level;
    if (save.notes < cost) return;
    save.notes -= cost;
    save.gear[id] = level + 1;
    saveProgress();
    renderMenu();
    track("gear_upgrade", { gear: id, level: level + 1 });
  }

  nodes.zoneRow.addEventListener("click", (evt) => {
    const btn = evt.target.closest("[data-zone]");
    if (!btn) return;
    const zone = zones.find((z) => z.id === btn.dataset.zone);
    const index = zones.indexOf(zone);
    if (index + 1 > save.unlockedZone) return;
    selectedZone = zone.id;
    renderMenu();
  });
  nodes.gearGrid.addEventListener("click", (evt) => {
    const btn = evt.target.closest("[data-gear]");
    if (btn) upgradeGear(btn.dataset.gear);
  });
  nodes.startBtn.addEventListener("click", startRun);
  nodes.mapBtn.addEventListener("click", () => {
    state = "menu";
    showPanel("menu");
    renderMenu();
  });
  nodes.retryBtn.addEventListener("click", startRun);
  nodes.resultMenuBtn.addEventListener("click", () => {
    state = "menu";
    showPanel("menu");
    renderMenu();
  });
  nodes.lureBtn.addEventListener("click", () => buyDiamondItem("lure"));
  nodes.sonarPrepBtn.addEventListener("click", () => buyDiamondItem("sonar"));
  nodes.sonarBtn.addEventListener("click", () => {
    if (!run || !run.sonarReady) return;
    run.sonarReady = false;
    run.sonarPulse = 2.6;
    nodes.hintText.textContent = t("sonarUsed");
    track("sonar_use", { zone: run.zone.id });
  });
  nodes.localeSelect.addEventListener("change", () => {
    locale = nodes.localeSelect.value;
    localStorage.setItem(localeKey, locale);
    applyLocale();
  });
  canvas.addEventListener("pointerdown", startCharge);
  canvas.addEventListener("pointermove", (evt) => {
    if (pointer.down) updatePointer(evt);
  });
  window.addEventListener("pointerup", releaseCast);
  nodes.tensionLane.addEventListener("pointerdown", (evt) => {
    pointer.down = true;
    nodes.tensionLane.setPointerCapture?.(evt.pointerId);
    updateLanePointer(evt);
  });
  nodes.tensionLane.addEventListener("pointermove", (evt) => {
    if (pointer.down) updateLanePointer(evt);
  });
  nodes.tensionLane.addEventListener("pointercancel", () => {
    pointer.down = false;
  });

  if (isTestMode) {
    window.__AnimalReefFisherTest = {
      startRun,
      forceWin() {
        if (!run || run.finished) startRun();
        const firstFish = fish[0].id;
        if (!save.album.includes(firstFish)) {
          save.album.push(firstFish);
          run.newFish += 1;
        }
        run.catches = Math.max(run.zone.goal, 1);
        finishRun(true);
        return this.readState();
      },
      forceFail() {
        if (!run || run.finished) startRun();
        run.catches = 0;
        run.newFish = 0;
        finishRun(false);
        return this.readState();
      },
      setNotes(amount) {
        save.notes = Math.max(0, Number(amount) || 0);
        saveProgress();
        renderMenu();
        return this.readState();
      },
      readState() {
        return {
          state,
          selectedZone,
          save: JSON.parse(JSON.stringify(save)),
          run: run
            ? {
                phase: run.phase,
                catches: run.catches,
                newFish: run.newFish,
                finished: run.finished,
                zone: run.zone.id,
              }
            : null,
          wallet: wallet(),
        };
      },
      readWallet() {
        return wallet();
      },
      readFishSheetGrid() {
        return {
          cols: 3,
          rows: 6,
          sample: fish.map((item) => ({ id: item.id, sheet: item.sheet, sx: item.sx, sy: item.sy })),
        };
      },
      setReelPointerPercent(value) {
        pointer.down = true;
        pointer.source = "lane";
        pointer.tensionPct = Math.max(0, Math.min(100, Number(value) || 0));
        return { ...pointer };
      },
    };
  }

  applyLocale();
  loadImages().then(() => {
    nodes.loadingPanel.classList.add("is-hidden");
    state = "menu";
    showPanel("menu");
    track("game_view", { internalPrototype: true });
    lastTime = performance.now();
    raf = requestAnimationFrame(tick);
  });

  window.addEventListener("beforeunload", () => cancelAnimationFrame(raf));
})();
