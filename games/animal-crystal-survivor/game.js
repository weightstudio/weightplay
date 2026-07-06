(() => {
  const GAME_ID = "animal-crystal-survivor";
  const saveKey = "weightplay_animal_crystal_survivor_v1";
  const localeKey = "weightPlayLocale";
  const W = 1024;
  const H = 1024;
  const RUN_SECONDS = 180;
  const crystalCharmCost = 12;

  const $ = (id) => document.getElementById(id);
  const canvas = $("gameCanvas");
  const ctx = canvas.getContext("2d");
  const nodes = {
    localeSelect: $("localeSelect"),
    menuPanel: $("menuPanel"),
    gamePanel: $("gamePanel"),
    upgradePanel: $("upgradePanel"),
    resultPanel: $("resultPanel"),
    startBtn: $("startBtn"),
    menuBtn: $("menuBtn"),
    retryBtn: $("retryBtn"),
    resultMenuBtn: $("resultMenuBtn"),
    timeText: $("timeText"),
    keyText: $("keyText"),
    levelText: $("levelText"),
    hpText: $("hpText"),
    xpFill: $("xpFill"),
    hintText: $("hintText"),
    upgradeCards: $("upgradeCards"),
    resultTitle: $("resultTitle"),
    resultScore: $("resultScore"),
    resultText: $("resultText"),
    skillReportText: $("skillReportText"),
    reactionStars: $("reactionStars"),
    focusStars: $("focusStars"),
    problemStars: $("problemStars"),
    loadingPanel: $("loadingPanel"),
    loadingText: $("loadingText"),
    loadingFill: $("loadingFill"),
    diamondBalance: $("diamondBalance"),
    charmBtn: $("charmBtn"),
    charmCost: $("charmCost"),
    charmStatus: $("charmStatus"),
  };

  const text = {
    en: {
      title: "Animal Crystal Survivor",
      language: "Language",
      menuTitle: "Survive the Crystal Grove.",
      menuHint: "Goal: collect golden keys before 3:00. Crystals give XP, and upgrades help the ranger survive longer.",
      prototypeGoalsTitle: "Prototype test goals",
      prototypeGoalsText: "In one run, collect at least 1 key, level up once, choose an upgrade, then confirm Retry and Menu both work.",
      controlMove: "Tap or drag to move",
      controlKeys: "WASD / Arrow keys",
      controlAttack: "Auto attack",
      diamondShopTitle: "Run Boost",
      charmName: "Crystal Charm",
      charmEffect: "Permanent: start each run with +1 HP and wider crystal pickup.",
      charmOwned: "Owned: every run starts with the Crystal Charm bonus.",
      charmBuy: "Unlock for {cost}",
      charmNeed: "Need {cost} diamonds.",
      charmBought: "Crystal Charm unlocked.",
      startRun: "Start Run",
      menu: "Menu",
      time: "Time",
      keys: "Keys",
      level: "Level",
      hp: "HP",
      crystals: "Crystals",
      playHint: "Goal: collect golden keys before 3:00. Grab crystals to level up, then choose upgrades when the cards appear.",
      hintKeyClose: "Golden key nearby: move through it to raise your score.",
      hintCrystal: "Crystals are on the ground: collect them to fill the XP bar.",
      hintCombat: "Auto attack is working: keep shadows inside the soft green range.",
      hintUpgradeSoon: "Almost leveled up: collect one more crystal and pick a stronger ability.",
      loading: "Loading",
      chooseUpgrade: "Choose an upgrade",
      tryAgain: "Try Again",
      backToMenu: "Back to Menu",
      reaction: "Reaction",
      focus: "Focus",
      problemSolving: "Problem Solving",
      timeUp: "Time Up!",
      runFailed: "Run Ended",
      resultLine: "Keys {keys} | Level {level} | Time {time}s | Best {best}",
      resultScoreLabel: "Golden Keys Collected",
      improved: "Great progress! You improved your best key score.",
      keepGoing: "Good effort. Short practice helps reaction and focus.",
      skillReportTitle: "Skill Report",
      skillReportStrong: "Strong run: you kept moving, reached level {level}, and finished with a golden-key score of {keys} while watching the shadows.",
      skillReportFocus: "Good focus practice: your next goal is to collect more crystals early so upgrades arrive sooner.",
      skillReportRecover: "Brave survival effort: watch the danger rings and move early when shadows get close.",
      resultDisclaimer: "For fun and local progress tracking only.",
      upgradeAttack: "Crystal Power",
      upgradeAttackDesc: "Projectiles calm shadows faster.",
      upgradeRange: "Longer Range",
      upgradeRangeDesc: "The ranger can target farther shadows.",
      upgradeSpeed: "Fleet Paws",
      upgradeSpeedDesc: "Move faster through the grove.",
      upgradeMaxHp: "Guardian Heart",
      upgradeMaxHpDesc: "Increase max HP and heal.",
      upgradeAttackSpeed: "Quick Seeds",
      upgradeAttackSpeedDesc: "Attack more often.",
      upgradePickupRadius: "Crystal Magnet",
      upgradePickupRadiusDesc: "Collect nearby crystals and keys from farther away.",
    },
    "zh-Hant": {
      title: "\u52d5\u7269\u6c34\u6676\u751f\u5b58\u6230",
      language: "\u8a9e\u8a00",
      menuTitle: "\u5728\u7d50\u6676\u68ee\u6797\u4e2d\u751f\u5b58\u4e0b\u53bb\u3002",
      menuHint: "\u76ee\u6a19\uff1a\u5728 3:00 \u4e4b\u524d\u6536\u96c6\u91d1\u9470\u3002\u6c34\u6676\u6703\u589e\u52a0\u7d93\u9a57\uff0c\u5347\u7d1a\u53ef\u4ee5\u8b93\u5de1\u5b88\u54e1\u6490\u5f97\u66f4\u4e45\u3002",
      prototypeGoalsTitle: "\u539f\u578b\u6e2c\u8a66\u76ee\u6a19",
      prototypeGoalsText: "\u4e00\u5c40\u5167\u81f3\u5c11\u6536\u96c6 1 \u628a\u91d1\u9470\u3001\u5347\u7d1a 1 \u6b21\u3001\u9078\u64c7\u4e00\u500b\u5f37\u5316\uff0c\u518d\u78ba\u8a8d\u91cd\u8a66\u548c\u9078\u55ae\u90fd\u80fd\u4f7f\u7528\u3002",
      controlMove: "\u9ede\u64ca\u6216\u62d6\u66f3\u79fb\u52d5",
      controlKeys: "WASD / \u65b9\u5411\u9375",
      controlAttack: "\u81ea\u52d5\u653b\u64ca",
      diamondShopTitle: "\u6311\u6230\u52a0\u6210",
      charmName: "\u6c34\u6676\u8b77\u7b26",
      charmEffect: "\u6c38\u4e45\uff1a\u6bcf\u5c40\u958b\u59cb\u6642 +1 \u751f\u547d\uff0c\u4e26\u63d0\u9ad8\u6c34\u6676\u62fe\u53d6\u7bc4\u570d\u3002",
      charmOwned: "\u5df2\u64c1\u6709\uff1a\u6bcf\u5c40\u90fd\u6703\u5957\u7528\u6c34\u6676\u8b77\u7b26\u52a0\u6210\u3002",
      charmBuy: "\u82b1\u8cbb {cost} \u89e3\u9396",
      charmNeed: "\u9700\u8981 {cost} \u9846\u947d\u77f3\u3002",
      charmBought: "\u5df2\u89e3\u9396\u6c34\u6676\u8b77\u7b26\u3002",
      startRun: "\u958b\u59cb\u6311\u6230",
      menu: "\u9078\u55ae",
      time: "\u6642\u9593",
      keys: "\u91d1\u9470",
      level: "\u7b49\u7d1a",
      hp: "\u751f\u547d",
      crystals: "\u6c34\u6676",
      playHint: "\u76ee\u6a19\uff1a\u5728 3:00 \u4e4b\u524d\u6536\u96c6\u91d1\u9470\u3002\u62ff\u6c34\u6676\u5347\u7d1a\uff0c\u5361\u7247\u51fa\u73fe\u6642\u9078\u4e00\u500b\u5f37\u5316\u3002",
      hintKeyClose: "\u91d1\u9470\u5728\u9644\u8fd1\uff1a\u7a7f\u904e\u5b83\u5c31\u80fd\u63d0\u9ad8\u5206\u6578\u3002",
      hintCrystal: "\u5730\u4e0a\u6709\u6c34\u6676\uff1a\u6536\u96c6\u5b83\u5011\u4f86\u586b\u6eff\u7d93\u9a57\u689d\u3002",
      hintCombat: "\u81ea\u52d5\u653b\u64ca\u6b63\u5728\u751f\u6548\uff1a\u8b93\u5f71\u5b50\u7559\u5728\u6de1\u7da0\u8272\u7bc4\u570d\u5167\u3002",
      hintUpgradeSoon: "\u5feb\u5347\u7d1a\u4e86\uff1a\u518d\u6536\u4e00\u9846\u6c34\u6676\uff0c\u7136\u5f8c\u9078\u64c7\u66f4\u5f37\u7684\u80fd\u529b\u3002",
      loading: "\u8f09\u5165\u4e2d",
      chooseUpgrade: "\u9078\u64c7\u4e00\u500b\u5347\u7d1a",
      tryAgain: "\u518d\u8a66\u4e00\u6b21",
      backToMenu: "\u56de\u5230\u9078\u55ae",
      reaction: "\u53cd\u61c9",
      focus: "\u5c08\u6ce8",
      problemSolving: "\u554f\u984c\u89e3\u6c7a",
      timeUp: "\u6642\u9593\u5230\uff01",
      runFailed: "\u6311\u6230\u7d50\u675f",
      resultLine: "\u91d1\u9470 {keys} | \u7b49\u7d1a {level} | \u5b58\u6d3b {time} \u79d2 | \u6700\u4f73 {best}",
      resultScoreLabel: "\u6536\u96c6\u5230\u7684\u91d1\u9470",
      improved: "\u9032\u6b65\u5f88\u597d\uff01\u4f60\u5237\u65b0\u4e86\u81ea\u5df1\u7684\u91d1\u9470\u7d00\u9304\u3002",
      keepGoing: "\u8868\u73fe\u4e0d\u932f\u3002\u77ed\u6642\u9593\u7df4\u7fd2\u80fd\u5e6b\u52a9\u53cd\u61c9\u548c\u5c08\u6ce8\u3002",
      skillReportTitle: "\u80fd\u529b\u56de\u994b",
      skillReportStrong: "\u9019\u5c40\u5f88\u7a69\uff1a\u4f60\u6301\u7e8c\u79fb\u52d5\u3001\u9054\u5230 {level} \u7d1a\uff0c\u4e26\u5728\u7559\u610f\u5f71\u5b50\u6642\u6536\u96c6\u4e86 {keys} \u628a\u91d1\u9470\u3002",
      skillReportFocus: "\u9019\u662f\u5f88\u597d\u7684\u5c08\u6ce8\u7df4\u7fd2\uff1a\u4e0b\u4e00\u5c40\u53ef\u4ee5\u65e9\u9ede\u6536\u96c6\u6c34\u6676\uff0c\u8b93\u5347\u7d1a\u66f4\u5feb\u51fa\u73fe\u3002",
      skillReportRecover: "\u751f\u5b58\u8868\u73fe\u5f88\u52c7\u6562\uff1a\u7559\u610f\u5371\u96aa\u5708\uff0c\u5f71\u5b50\u9760\u8fd1\u524d\u5148\u79fb\u52d5\u3002",
      resultDisclaimer: "\u50c5\u4f9b\u904a\u6232\u6a02\u8da3\u8207\u672c\u6a5f\u9032\u6b65\u8ffd\u8e64\u53c3\u8003\u3002",
      upgradeAttack: "\u6c34\u6676\u529b\u91cf",
      upgradeAttackDesc: "\u6295\u5c04\u7269\u66f4\u5feb\u5b89\u64ab\u5f71\u5b50\u3002",
      upgradeRange: "\u5de1\u5b88\u8ddd\u96e2",
      upgradeRangeDesc: "\u53ef\u4ee5\u9396\u5b9a\u66f4\u9060\u7684\u5f71\u5b50\u3002",
      upgradeSpeed: "\u8fc5\u6377\u8173\u6b65",
      upgradeSpeedDesc: "\u5728\u68ee\u6797\u4e2d\u79fb\u52d5\u66f4\u5feb\u3002",
      upgradeMaxHp: "\u5b88\u8b77\u4e4b\u5fc3",
      upgradeMaxHpDesc: "\u63d0\u9ad8\u751f\u547d\u4e0a\u9650\u4e26\u6062\u5fa9\u751f\u547d\u3002",
      upgradeAttackSpeed: "\u5feb\u901f\u7a2e\u5b50",
      upgradeAttackSpeedDesc: "\u653b\u64ca\u9593\u9694\u7e2e\u77ed\u3002",
      upgradePickupRadius: "\u6c34\u6676\u78c1\u529b",
      upgradePickupRadiusDesc: "\u53ef\u4ee5\u5f9e\u66f4\u9060\u8655\u6536\u96c6\u6c34\u6676\u8207\u91d1\u9470\u3002",
    },
  };

  const assetPaths = {
    arena: "../../assets/animal-crystal-survivor-forest-arena.webp",
    hero: "../../assets/animal-crystal-survivor-ranger.webp",
    basic: "../../assets/animal-crystal-survivor-shadow-fox-v2.webp",
    runner: "../../assets/animal-crystal-survivor-shadow-panther-v2.webp",
    tank: "../../assets/animal-crystal-survivor-crystal-boar-v2.webp",
    xp: "../../assets/animal-crystal-survivor-xp-crystal.webp",
    key: "../../assets/animal-crystal-survivor-golden-key.webp",
    seed: "../../assets/animal-crystal-survivor-crystal-seed-shot-v2.webp",
    blade: "../../assets/animal-crystal-survivor-leaf-blade-shot-v2.webp",
    upgradeAttack: "../../assets/animal-crystal-survivor-upgrade-attack.png",
    upgradeRange: "../../assets/animal-crystal-survivor-upgrade-range.png",
    upgradeSpeed: "../../assets/animal-crystal-survivor-upgrade-speed.png",
    upgradeMaxHp: "../../assets/animal-crystal-survivor-upgrade-max-hp.png",
    upgradeCooldown: "../../assets/animal-crystal-survivor-upgrade-cooldown.png",
    upgradePickup: "../../assets/animal-crystal-survivor-upgrade-pickup.png",
  };

  const upgrades = [
    { id: "attack", icon: "upgradeAttack", name: "upgradeAttack", desc: "upgradeAttackDesc" },
    { id: "range", icon: "upgradeRange", name: "upgradeRange", desc: "upgradeRangeDesc" },
    { id: "speed", icon: "upgradeSpeed", name: "upgradeSpeed", desc: "upgradeSpeedDesc" },
    { id: "maxHp", icon: "upgradeMaxHp", name: "upgradeMaxHp", desc: "upgradeMaxHpDesc" },
    { id: "cooldown", icon: "upgradeCooldown", name: "upgradeAttackSpeed", desc: "upgradeAttackSpeedDesc" },
    { id: "pickup", icon: "upgradePickup", name: "upgradePickupRadius", desc: "upgradePickupRadiusDesc" },
  ];

  const images = {};
  let locale = window.WonderI18n?.locale?.() || localStorage.getItem(localeKey) || "en";
  let save = loadSave();
  let state = makeState();
  let lastFrame = 0;
  let pointerDown = false;
  let runToken = 0;
  const soundGate = {};
  const keys = new Set();
  const movementKeys = new Set(["arrowleft", "arrowright", "arrowup", "arrowdown", "a", "d", "w", "s"]);

  function playSound(name, gap = 0.08) {
    const now = performance.now();
    if (soundGate[name] && now - soundGate[name] < gap * 1000) return;
    soundGate[name] = now;
    window.WonderSound?.play(name);
  }

  function loadSave() {
    try {
      return { bestKeys: 0, bestLevel: 1, playCount: 0, crystalCharm: false, ...JSON.parse(localStorage.getItem(saveKey) || "{}") };
    } catch {
      return { bestKeys: 0, bestLevel: 1, playCount: 0, crystalCharm: false };
    }
  }

  function persist() {
    localStorage.setItem(saveKey, JSON.stringify(save));
  }

  function t(key, data = {}) {
    const value = text[locale]?.[key] || text.en[key] || key;
    return Object.entries(data).reduce((out, [name, item]) => out.replaceAll(`{${name}}`, String(item)), value);
  }

  function makePlayer() {
    const hasCharm = Boolean(save.crystalCharm);
    const maxHp = hasCharm ? 8 : 7;
    return {
      x: W / 2,
      y: H / 2,
      tx: W / 2,
      ty: H / 2,
      hp: maxHp,
      maxHp,
      speed: 238,
      range: 238,
      damage: 1,
      cooldown: 0.78,
      shotTimer: 0,
      pickup: hasCharm ? 68 : 54,
    };
  }

  function makeState() {
    return {
      mode: "menu",
      timeLeft: RUN_SECONDS,
      player: makePlayer(),
      level: 1,
      xp: 0,
      xpNeed: 4,
      keys: 0,
      calmed: 0,
      survived: 0,
      spawnTimer: 0.95,
      key: randomPoint(120),
      enemies: [],
      xpDrops: [],
      shots: [],
      sparks: [],
      floaters: [],
    };
  }

  function randomPoint(pad = 70) {
    return { x: pad + Math.random() * (W - pad * 2), y: pad + Math.random() * (H - pad * 2) };
  }

  function image(src) {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    return img;
  }

  function preload() {
    const entries = Object.entries(assetPaths);
    let done = 0;
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      nodes.loadingText.textContent = "100%";
      nodes.loadingFill.style.width = "100%";
      nodes.loadingPanel.classList.add("hidden");
      draw();
      window.WonderAnalytics?.track("game_ready", { game_id: GAME_ID, prototype: true });
      maybeAutostartSmokeRun();
    };
    entries.forEach(([key, src]) => {
      const img = image(src);
      images[key] = img;
      img.onload = img.onerror = () => {
        done += 1;
        const pct = Math.round((done / entries.length) * 100);
        nodes.loadingText.textContent = `${pct}%`;
        nodes.loadingFill.style.width = `${pct}%`;
        if (done >= entries.length) finish();
      };
    });
    window.setTimeout(finish, 1600);
  }

  function setLocale(next) {
    locale = next || "en";
    localStorage.setItem(localeKey, locale);
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : "en";
    if (window.WonderI18n?.locale?.() !== locale) {
      window.WonderI18n?.setLocale?.(locale);
    } else {
      window.dispatchEvent(new CustomEvent("wonder:locale-change", { detail: { locale } }));
    }
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
    nodes.localeSelect.value = locale;
    renderHud();
    updateDiamondShop();
  }

  function getWallet() {
    return window.WeightPlayWallet || null;
  }

  function diamondBalance() {
    return getWallet()?.read?.().diamonds || 0;
  }

  function updateDiamondShop(message = "") {
    if (!nodes.charmBtn || !nodes.diamondBalance) return;
    const owned = Boolean(save.crystalCharm);
    const balance = diamondBalance();
    nodes.diamondBalance.textContent = String(balance);
    nodes.charmCost.textContent = owned ? "\u2713" : String(crystalCharmCost);
    nodes.charmBtn.disabled = owned || balance < crystalCharmCost;
    nodes.charmBtn.setAttribute("aria-label", `${t("charmName")} - ${owned ? t("charmOwned") : t("charmBuy", { cost: crystalCharmCost })}`);
    nodes.charmStatus.textContent = message || (owned ? t("charmOwned") : t("charmBuy", { cost: crystalCharmCost }));
  }

  function buyCrystalCharm() {
    if (save.crystalCharm) {
      updateDiamondShop();
      return;
    }
    const wallet = getWallet();
    if (!wallet?.spendDiamonds || !wallet.spendDiamonds(crystalCharmCost)) {
      updateDiamondShop(t("charmNeed", { cost: crystalCharmCost }));
      playSound("wrong", 0.2);
      return;
    }
    save.crystalCharm = true;
    persist();
    updateDiamondShop(t("charmBought"));
    playSound("success", 0.2);
    window.WonderAnalytics?.track("diamond_spend", { game_id: GAME_ID, item: "crystal_charm", cost: crystalCharmCost, balance: diamondBalance() });
  }

  function show(panel) {
    [nodes.menuPanel, nodes.gamePanel, nodes.resultPanel, nodes.upgradePanel].forEach((node) => node.classList.add("hidden"));
    panel.classList.remove("hidden");
  }

  function scheduleLoop(token = runToken) {
    requestAnimationFrame((now) => loop(now, token));
  }

  function clearInput() {
    keys.clear();
    pointerDown = false;
  }

  function startRun() {
    runToken += 1;
    clearInput();
    state = makeState();
    state.mode = "running";
    prepareSmokeCombatDemo();
    save.playCount += 1;
    persist();
    show(nodes.gamePanel);
    renderHud();
    lastFrame = performance.now();
    playSound("start", 0.2);
    window.WonderAnalytics?.track("game_start", { game_id: GAME_ID, locale, prototype: true });
    scheduleLoop();
  }

  function maybeAutostartSmokeRun() {
    const search = window.location?.search || "";
    if (!search.includes("smoke=1") || !search.includes("autostart=1")) return;
    window.setTimeout(() => {
      if (state.mode === "menu") startRun();
    }, 40);
  }

  function prepareSmokeCombatDemo() {
    const search = window.location?.search || "";
    if (!search.includes("smoke=1") || !search.includes("combatdemo=1")) return;
    const p = state.player;
    state.spawnTimer = 999;
    state.key = { x: p.x - 170, y: p.y - 28 };
    state.enemies.push({
      x: p.x + 136,
      y: p.y + 6,
      hp: 7,
      maxHp: 7,
      speed: 12,
      size: 72,
      damage: 0.55,
      image: "tank",
      hit: 0,
      touch: 0,
    });
  }

  function loop(now, token = runToken) {
    if (token !== runToken) return;
    const dt = Math.min(0.033, (now - lastFrame) / 1000 || 0);
    lastFrame = now;
    if (state.mode === "running") update(dt);
    draw();
    if (state.mode === "running") scheduleLoop(token);
  }

  function update(dt) {
    state.timeLeft = Math.max(0, state.timeLeft - dt);
    state.survived = RUN_SECONDS - state.timeLeft;
    movePlayer(dt);
    spawnEnemies(dt);
    updateEnemies(dt);
    updateShots(dt);
    updateDrops();
    updateKey();
    updateFloaters(dt);
    renderHud();
    if (state.timeLeft <= 0) endRun("time");
    if (state.player.hp <= 0) endRun("fail");
  }

  function movePlayer(dt) {
    const p = state.player;
    let dx = 0;
    let dy = 0;
    if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
    if (keys.has("arrowright") || keys.has("d")) dx += 1;
    if (keys.has("arrowup") || keys.has("w")) dy -= 1;
    if (keys.has("arrowdown") || keys.has("s")) dy += 1;
    if (dx || dy) {
      const len = Math.hypot(dx, dy) || 1;
      p.x += (dx / len) * p.speed * dt;
      p.y += (dy / len) * p.speed * dt;
      p.tx = p.x;
      p.ty = p.y;
    } else {
      const mx = p.tx - p.x;
      const my = p.ty - p.y;
      const dist = Math.hypot(mx, my);
      if (dist > 3) {
        const step = Math.min(dist, p.speed * dt);
        p.x += (mx / dist) * step;
        p.y += (my / dist) * step;
      }
    }
    p.x = Math.max(42, Math.min(W - 42, p.x));
    p.y = Math.max(42, Math.min(H - 42, p.y));
    p.shotTimer -= dt;
    if (p.shotTimer <= 0) shootNearest();
  }

  function spawnEnemies(dt) {
    state.spawnTimer -= dt;
    if (state.spawnTimer > 0) return;
    if (state.enemies.length >= 18) {
      state.spawnTimer = 0.6;
      return;
    }
    const elapsed = RUN_SECONDS - state.timeLeft;
    const type = elapsed > 65 && Math.random() < 0.23 ? "tank" : elapsed > 35 && Math.random() < 0.34 ? "runner" : "basic";
    const edge = Math.floor(Math.random() * 4);
    const pos = randomPoint(0);
    if (edge === 0) pos.y = -54;
    if (edge === 1) pos.x = W + 54;
    if (edge === 2) pos.y = H + 54;
    if (edge === 3) pos.x = -54;
    const stats = {
      basic: { hp: 2, speed: 68, size: 62, damage: 0.32, image: "basic" },
      runner: { hp: 1.5, speed: 102, size: 58, damage: 0.28, image: "runner" },
      tank: { hp: 5, speed: 44, size: 82, damage: 0.55, image: "tank" },
    }[type];
    state.enemies.push({ ...pos, ...stats, maxHp: stats.hp, hit: 0, touch: 0 });
    state.spawnTimer = Math.max(0.85, 1.85 - elapsed * 0.0038);
  }

  function updateEnemies(dt) {
    const p = state.player;
    state.enemies.forEach((enemy) => {
      const dx = p.x - enemy.x;
      const dy = p.y - enemy.y;
      const dist = Math.hypot(dx, dy) || 1;
      enemy.x += (dx / dist) * enemy.speed * dt;
      enemy.y += (dy / dist) * enemy.speed * dt;
      enemy.hit = Math.max(0, enemy.hit - dt);
      enemy.touch = Math.max(0, enemy.touch - dt);
      if (dist < (enemy.size + 42) * 0.42 && enemy.touch <= 0) {
        p.hp = Math.max(0, p.hp - enemy.damage);
        enemy.touch = 1.05;
        addSpark(p.x, p.y - 34, "#ff7b7b");
        addFloater(`-${Math.ceil(enemy.damage)}`, p.x, p.y - 74, "#ffb4b4");
        playSound("hit", 0.35);
      }
    });
  }

  function shootNearest() {
    const p = state.player;
    let target = null;
    let best = Infinity;
    state.enemies.forEach((enemy) => {
      const dist = Math.hypot(enemy.x - p.x, enemy.y - p.y);
      if (dist <= p.range && dist < best) {
        target = enemy;
        best = dist;
      }
    });
    if (!target) return;
    state.shots.push({ x: p.x, y: p.y - 22, px: p.x, py: p.y - 22, target, speed: 620, damage: p.damage, image: p.damage > 1.45 ? "blade" : "seed" });
    p.shotTimer = p.cooldown;
  }

  function updateShots(dt) {
    state.shots = state.shots.filter((shot) => {
      if (!state.enemies.includes(shot.target) || shot.target.hp <= 0) return false;
      const dx = shot.target.x - shot.x;
      const dy = shot.target.y - shot.y;
      const dist = Math.hypot(dx, dy) || 1;
      const step = Math.min(dist, shot.speed * dt);
      shot.px = shot.x;
      shot.py = shot.y;
      shot.x += (dx / dist) * step;
      shot.y += (dy / dist) * step;
      if (dist <= 24) {
        shot.target.hp -= shot.damage;
        shot.target.hit = 0.16;
        addSpark(shot.target.x, shot.target.y, "#67e8f9");
        if (shot.target.hp <= 0) calmEnemy(shot.target);
        return false;
      }
      return true;
    });
    state.sparks = state.sparks.filter((spark) => {
      spark.life -= dt;
      spark.y -= dt * 44;
      return spark.life > 0;
    });
  }

  function calmEnemy(enemy) {
    state.calmed += 1;
    state.xpDrops.push({ x: enemy.x, y: enemy.y, value: 1 });
    state.enemies = state.enemies.filter((item) => item !== enemy);
  }

  function updateDrops() {
    const p = state.player;
    state.xpDrops = state.xpDrops.filter((drop) => {
      const dist = Math.hypot(drop.x - p.x, drop.y - p.y);
      if (dist < p.pickup) {
        state.xp += drop.value;
        addSpark(drop.x, drop.y, "#fef08a");
        addFloater(`+${drop.value}`, drop.x, drop.y - 18, "#fef08a");
        playSound("coin", 0.12);
        if (state.xp >= state.xpNeed) levelUp();
        return false;
      }
      if (dist < p.pickup * 2.2) {
        drop.x += (p.x - drop.x) * 0.08;
        drop.y += (p.y - drop.y) * 0.08;
      }
      return true;
    });
  }

  function updateKey() {
    const p = state.player;
    if (Math.hypot(state.key.x - p.x, state.key.y - p.y) < p.pickup + 8) {
      state.keys += 1;
      state.key = randomPoint(120);
      addSpark(p.x, p.y - 52, "#ffe76c");
      addFloater("+1", p.x, p.y - 90, "#ffe76c");
      playSound("success", 0.12);
      window.WonderAnalytics?.track("game_key_collect", { game_id: GAME_ID, keys: state.keys, prototype: true });
    }
  }

  function levelUp() {
    state.xp -= state.xpNeed;
    state.xpNeed = Math.ceil(state.xpNeed * 1.28 + 2);
    state.level += 1;
    state.mode = "upgrade";
    renderUpgradeCards();
    nodes.upgradePanel.classList.remove("hidden");
    playSound("upgrade", 0.2);
    window.WonderAnalytics?.track("game_level_up", { game_id: GAME_ID, level: state.level, prototype: true });
  }

  function renderUpgradeCards() {
    const options = [...upgrades].sort(() => Math.random() - 0.5).slice(0, 3);
    nodes.upgradeCards.innerHTML = options
      .map((item) => `
        <button class="upgrade-card" type="button" data-upgrade="${item.id}">
          <span class="upgrade-icon"><img src="${assetPaths[item.icon]}" alt="" /></span>
          <b>${t(item.name)}</b>
          <small>${t(item.desc)}</small>
        </button>
      `)
      .join("");
  }

  function applyUpgrade(id) {
    if (state.mode !== "upgrade") return;
    const p = state.player;
    if (id === "attack") p.damage += 0.55;
    if (id === "range") p.range += 48;
    if (id === "speed") p.speed += 32;
    if (id === "maxHp") {
      p.maxHp += 1;
      p.hp = Math.min(p.maxHp, p.hp + 1.4);
    }
    if (id === "cooldown") p.cooldown = Math.max(0.34, p.cooldown * 0.86);
    if (id === "pickup") p.pickup += 24;
    state.mode = "running";
    nodes.upgradePanel.classList.add("hidden");
    playSound("click", 0.1);
    window.WonderAnalytics?.track("game_upgrade_choice", { game_id: GAME_ID, upgrade: id, level: state.level, prototype: true });
    lastFrame = performance.now();
    scheduleLoop();
  }

  function addSpark(x, y, color) {
    state.sparks.push({ x, y, color, life: 0.45 });
  }

  function addFloater(textValue, x, y, color) {
    state.floaters.push({ text: textValue, x, y, color, life: 0.82 });
  }

  function updateFloaters(dt) {
    state.floaters = state.floaters.filter((floater) => {
      floater.life -= dt;
      floater.y -= dt * 58;
      return floater.life > 0;
    });
  }

  function endRun(reason) {
    if (state.mode === "result") return;
    state.mode = "result";
    const previousBestKeys = save.bestKeys || 0;
    const improved = state.keys > previousBestKeys;
    save.bestKeys = Math.max(save.bestKeys || 0, state.keys);
    save.bestLevel = Math.max(save.bestLevel || 1, state.level);
    persist();
    renderResult(reason, previousBestKeys, improved);
    show(nodes.resultPanel);
    playSound(reason === "time" ? "win" : "wrong", 0.4);
    window.WonderAnalytics?.track("game_complete", { game_id: GAME_ID, reason, keys: state.keys, level: state.level, prototype: true });
  }

  function renderResult(reason, previousBestKeys, improved) {
    const survived = Math.round(state.survived);
    const best = Math.max(previousBestKeys || 0, state.keys);
    const reactionScore = Math.min(5, 2 + Math.floor(survived / 44));
    const focusScore = Math.min(5, 1 + state.keys);
    const problemScore = Math.min(5, Math.max(1, state.level));
    nodes.resultTitle.textContent = reason === "time" ? t("timeUp") : t("runFailed");
    nodes.resultScore.textContent = String(state.keys);
    nodes.resultText.textContent = `${t("resultLine", { keys: state.keys, level: state.level, time: survived, best })} ${improved ? t("improved") : t("keepGoing")}`;
    nodes.reactionStars.textContent = stars(reactionScore);
    nodes.focusStars.textContent = stars(focusScore);
    nodes.problemStars.textContent = stars(problemScore);
    nodes.skillReportText.textContent = skillReport({ reason, reactionScore, focusScore, problemScore });
  }

  function skillReport({ reason, reactionScore, focusScore, problemScore }) {
    const data = { keys: state.keys, level: state.level };
    if (reason === "time" || (reactionScore >= 4 && focusScore >= 3 && problemScore >= 2)) {
      return t("skillReportStrong", data);
    }
    if (focusScore >= 3 || problemScore >= 3) {
      return t("skillReportFocus", data);
    }
    return t("skillReportRecover", data);
  }

  function installSmokeHooks() {
    if (!window.location?.search?.includes("smoke=1")) return;
    window.__animalCrystalSurvivorSmoke = {
      snapshot: () => ({
        mode: state.mode,
        keys: state.keys,
        key: { ...state.key },
        player: { ...state.player },
        level: state.level,
        xp: state.xp,
        xpNeed: state.xpNeed,
        timeLeft: state.timeLeft,
        calmed: state.calmed,
        enemies: state.enemies.map((enemy) => ({
          x: enemy.x,
          y: enemy.y,
          hp: enemy.hp,
          maxHp: enemy.maxHp,
          speed: enemy.speed,
          damage: enemy.damage,
          size: enemy.size,
          danger: Math.hypot(enemy.x - state.player.x, enemy.y - state.player.y) <= 170,
        })),
        shots: state.shots.map((shot) => ({ x: shot.x, y: shot.y, px: shot.px, py: shot.py, damage: shot.damage, image: shot.image })),
        xpDrops: state.xpDrops.map((drop) => ({ x: drop.x, y: drop.y, value: drop.value })),
        floaters: state.floaters.map((floater) => ({ text: floater.text, x: floater.x, y: floater.y, life: floater.life })),
        resultScore: nodes.resultScore.textContent,
        resultText: nodes.resultText.textContent,
        skillReportText: nodes.skillReportText.textContent,
        upgradeVisible: !nodes.upgradePanel.classList.contains("hidden"),
        crystalCharm: Boolean(save.crystalCharm),
        diamondBalance: diamondBalance(),
      }),
      collectKeyAtPlayer: () => {
        state.key = { x: state.player.x, y: state.player.y };
        updateKey();
        renderHud();
      },
      collectXpAtPlayer: (value = state.xpNeed) => {
        state.xpDrops.push({ x: state.player.x, y: state.player.y, value });
        updateDrops();
        renderHud();
      },
      applyUpgradeForTest: (id) => {
        state.mode = "upgrade";
        applyUpgrade(id);
        renderHud();
      },
      clearCombatForTest: () => {
        state.enemies = [];
        state.shots = [];
        state.xpDrops = [];
        state.sparks = [];
        state.floaters = [];
        state.player.shotTimer = 0;
        renderHud();
      },
      setSpawnTimerForTest: (value) => {
        state.spawnTimer = value;
      },
      spawnEnemyForTest: (options = {}) => {
        const p = state.player;
        const enemy = {
          x: options.x ?? p.x + 120,
          y: options.y ?? p.y,
          hp: options.hp ?? 1,
          speed: options.speed ?? 0,
          size: options.size ?? 62,
          damage: options.damage ?? 0.55,
          image: options.image || "basic",
          maxHp: options.maxHp ?? options.hp ?? 1,
          hit: 0,
          touch: 0,
        };
        state.enemies.push(enemy);
        return enemy;
      },
    };
  }

  function stars(count) {
    return "*".repeat(count) + "-".repeat(Math.max(0, 5 - count));
  }

  function renderHud() {
    nodes.timeText.textContent = formatTime(state.timeLeft);
    nodes.keyText.textContent = String(state.keys);
    nodes.levelText.textContent = String(state.level);
    nodes.hpText.textContent = `${Math.ceil(state.player.hp)}/${state.player.maxHp}`;
    nodes.xpFill.style.width = `${Math.min(100, (state.xp / state.xpNeed) * 100)}%`;
    renderActionHint();
  }

  function renderActionHint() {
    if (state.mode !== "running") {
      nodes.hintText.textContent = t("playHint");
      return;
    }

    const p = state.player;
    const keyDistance = Math.hypot(state.key.x - p.x, state.key.y - p.y);
    const hasCloseEnemy = state.enemies.some((enemy) => Math.hypot(enemy.x - p.x, enemy.y - p.y) <= p.range);
    const nextHint =
      state.xpNeed - state.xp <= 1 && state.xpDrops.length > 0
        ? "hintUpgradeSoon"
        : keyDistance <= 220
          ? "hintKeyClose"
          : state.xpDrops.length > 0
            ? "hintCrystal"
            : hasCloseEnemy
              ? "hintCombat"
              : "playHint";

    nodes.hintText.textContent = t(nextHint);
  }

  function formatTime(value) {
    const total = Math.max(0, Math.ceil(value));
    const minutes = Math.floor(total / 60);
    const seconds = String(total % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  function drawImageCentered(img, x, y, size, angle = 0, alpha = 1) {
    if (!img?.complete || !img.naturalWidth) return;
    const ratio = img.naturalWidth / img.naturalHeight;
    const drawWidth = ratio >= 1 ? size : size * ratio;
    const drawHeight = ratio >= 1 ? size / ratio : size;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    if (images.arena?.complete) ctx.drawImage(images.arena, 0, 0, W, H);
    ctx.save();
    ctx.fillStyle = "rgba(6, 24, 23, 0.18)";
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
    drawKey();
    state.xpDrops.forEach((drop) => drawImageCentered(images.xp, drop.x, drop.y, 34));
    state.enemies.forEach(drawEnemy);
    state.shots.forEach((shot) => {
      const angle = Math.atan2(shot.target.y - shot.y, shot.target.x - shot.x);
      drawShotTrail(shot);
      drawImageCentered(images[shot.image || "seed"], shot.x, shot.y, shot.image === "blade" ? 52 : 42, angle);
    });
    drawImageCentered(images.hero, state.player.x, state.player.y, 92);
    drawRange();
    state.sparks.forEach((spark) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, spark.life / 0.45);
      ctx.fillStyle = spark.color;
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, 16 + (1 - spark.life / 0.45) * 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    state.floaters.forEach(drawFloater);
  }

  function drawFloater(floater) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, floater.life / 0.82);
    ctx.font = "900 30px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.lineWidth = 7;
    ctx.strokeStyle = "rgba(4, 20, 18, 0.72)";
    ctx.fillStyle = floater.color;
    ctx.strokeText(floater.text, floater.x, floater.y);
    ctx.fillText(floater.text, floater.x, floater.y);
    ctx.restore();
  }

  function drawRange() {
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "#b7f4d7";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(state.player.x, state.player.y, state.player.range, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawShotTrail(shot) {
    let fromX = shot.px || shot.x;
    let fromY = shot.py || shot.y;
    const trailLength = Math.hypot((shot.x || 0) - fromX, (shot.y || 0) - fromY);
    if (trailLength < 34 && shot.target) {
      const dx = shot.x - shot.target.x;
      const dy = shot.y - shot.target.y;
      const dist = Math.hypot(dx, dy) || 1;
      fromX = shot.x + (dx / dist) * 46;
      fromY = shot.y + (dy / dist) * 46;
    }
    const isBlade = shot.image === "blade";
    const color = isBlade ? "183, 244, 215" : "103, 232, 249";
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = `rgba(${color}, 0.72)`;
    ctx.shadowBlur = isBlade ? 18 : 14;
    ctx.strokeStyle = `rgba(${color}, 0.52)`;
    ctx.lineWidth = isBlade ? 16 : 12;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(shot.x, shot.y);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.72)";
    ctx.lineWidth = isBlade ? 5 : 4;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(shot.x, shot.y);
    ctx.stroke();
    ctx.restore();
  }

  function drawKey() {
    ctx.save();
    ctx.globalAlpha = 0.32;
    ctx.fillStyle = "#fff7ad";
    ctx.beginPath();
    ctx.arc(state.key.x, state.key.y, 44 + Math.sin(performance.now() / 180) * 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    drawImageCentered(images.key, state.key.x, state.key.y, 54);
  }

  function drawEnemy(enemy) {
    const hpPct = Math.max(0, enemy.hp / enemy.maxHp);
    const visualSize = enemy.image === "tank" ? enemy.size * 1.9 : enemy.image === "runner" ? enemy.size * 1.65 : enemy.size * 1.55;
    drawEnemyDanger(enemy);
    drawImageCentered(images[enemy.image], enemy.x, enemy.y, visualSize, 0, enemy.hit > 0 ? 0.72 : 1);
    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 42, 0.58)";
    ctx.fillRect(enemy.x - 28, enemy.y - visualSize * 0.34 - 12, 56, 7);
    ctx.fillStyle = "#8ef28b";
    ctx.fillRect(enemy.x - 28, enemy.y - visualSize * 0.34 - 12, 56 * hpPct, 7);
    ctx.restore();
  }

  function drawEnemyDanger(enemy) {
    const dist = Math.hypot(enemy.x - state.player.x, enemy.y - state.player.y);
    if (dist > 170) return;
    const danger = Math.max(0, 1 - dist / 170);
    const pulse = (Math.sin(performance.now() / 110) + 1) * 0.5;
    const radius = enemy.size * (0.58 + danger * 0.28 + pulse * 0.06);
    ctx.save();
    ctx.globalAlpha = 0.18 + danger * 0.32;
    ctx.strokeStyle = "#ff7b5f";
    ctx.lineWidth = 5 + danger * 5;
    ctx.shadowColor = "rgba(255, 123, 95, 0.58)";
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const client = event.touches?.[0] || event;
    return {
      x: ((client.clientX - rect.left) / rect.width) * W,
      y: ((client.clientY - rect.top) / rect.height) * H,
    };
  }

  function moveTarget(event) {
    if (state.mode !== "running") return;
    event.preventDefault();
    const point = canvasPoint(event);
    state.player.tx = point.x;
    state.player.ty = point.y;
  }

  canvas.addEventListener("pointerdown", (event) => {
    pointerDown = true;
    moveTarget(event);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (pointerDown) moveTarget(event);
  });
  window.addEventListener("pointerup", () => {
    pointerDown = false;
  });
  window.addEventListener("pointercancel", () => {
    pointerDown = false;
  });
  canvas.addEventListener("pointerleave", () => {
    pointerDown = false;
  });
  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (movementKeys.has(key)) {
      event.preventDefault();
      keys.add(key);
    }
  });
  window.addEventListener("keyup", (event) => {
    keys.delete(event.key.toLowerCase());
  });
  window.addEventListener("blur", clearInput);

  nodes.localeSelect.addEventListener("change", (event) => setLocale(event.target.value));
  nodes.startBtn.addEventListener("click", startRun);
  nodes.charmBtn?.addEventListener("click", buyCrystalCharm);
  nodes.retryBtn.addEventListener("click", startRun);
  nodes.menuBtn.addEventListener("click", () => {
    runToken += 1;
    clearInput();
    state.mode = "menu";
    playSound("click", 0.1);
    show(nodes.menuPanel);
  });
  nodes.resultMenuBtn.addEventListener("click", () => {
    runToken += 1;
    clearInput();
    state.mode = "menu";
    playSound("click", 0.1);
    show(nodes.menuPanel);
  });
  nodes.upgradeCards.addEventListener("click", (event) => {
    const card = event.target.closest("[data-upgrade]");
    if (card) applyUpgrade(card.dataset.upgrade);
  });
  window.addEventListener("weightplay:locale-change", (event) => setLocale(event.detail?.locale || locale));

  setLocale(locale);
  installSmokeHooks();
  preload();
})();
