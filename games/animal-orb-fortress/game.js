(() => {
  const GAME_ID = "animal-orb-fortress";
  const saveKey = "weightplay_animal_orb_fortress_v1";
  const localeKey = "weightPlayLocale";
  const W = 960;
  const H = 540;
  const rerollCost = 3;

  const $ = (id) => document.getElementById(id);
  const nodes = {
    localeSelect: $("localeSelect"),
    loadingPanel: $("loadingPanel"),
    loadingFill: $("loadingFill"),
    loadingText: $("loadingText"),
    menuPanel: $("menuPanel"),
    gamePanel: $("gamePanel"),
    upgradePanel: $("upgradePanel"),
    resultPanel: $("resultPanel"),
    startBtn: $("startBtn"),
    mapBtn: $("mapBtn"),
    retryBtn: $("retryBtn"),
    resultMenuBtn: $("resultMenuBtn"),
    roomGrid: $("roomGrid"),
    bestRaidText: $("bestRaidText"),
    starStoneText: $("starStoneText"),
    diamondText: $("diamondText"),
    waveText: $("waveText"),
    coreText: $("coreText"),
    shotText: $("shotText"),
    hintText: $("hintText"),
    upgradeCards: $("upgradeCards"),
    upgradeStatus: $("upgradeStatus"),
    rerollBtn: $("rerollBtn"),
    resultTitle: $("resultTitle"),
    resultText: $("resultText"),
    skillReportText: $("skillReportText"),
  };
  const canvas = $("gameCanvas");
  const ctx = canvas.getContext("2d");

  const text = {
    en: {
      title: "Animal Orb Fortress",
      language: "Language",
      menuTitle: "Aim the spirit orb through the crystal fortress.",
      menuHint: "Clear three waves, choose upgrades, earn Star Stones, and grow fortress rooms locally.",
      bestRaid: "Best Raid",
      starStones: "Star Stones",
      diamonds: "Diamonds",
      startRaid: "Start Raid",
      raidMap: "Raid Map",
      wave: "Wave",
      core: "Core",
      shots: "Shots",
      aimHint: "Drag from the launcher, preview the bounce path, then release.",
      orbReady: "Orb ready. Bank shots into shadow beasts before they reach the core.",
      orbFlying: "Spirit orb is flying. Watch the bounce route and prepare the next aim.",
      fortressHit: "A shadow beast hit the core. Aim earlier or use wider angles.",
      waveClear: "Wave clear. Choose one blessing before the next wave.",
      chooseUpgrade: "Choose a fortress blessing",
      reroll: "Reroll for 3 diamonds",
      rerolled: "Relic choices refreshed.",
      rerollNeed: "Need 3 diamonds to reroll.",
      retry: "Retry",
      raidClear: "Raid Clear",
      raidFailed: "Raid Failed",
      resultWin: "Cleared wave {wave}/3, earned {stones} Star Stones, and protected {core} core HP.",
      resultLose: "Reached wave {wave}/3 and earned {stones} Star Stones. Upgrade rooms and try a safer bounce route.",
      reportWin: "Skill Report: strong logic and reaction. You used bounce planning and upgrade choice to protect the fortress.",
      reportLose: "Skill Report: good practice. Next run, aim earlier and use walls to hit multiple beasts.",
      upgradeDamage: "Bigger Orb",
      upgradeDamageDesc: "+1 orb damage.",
      upgradeSplit: "Split Orb",
      upgradeSplitDesc: "Fire a second weaker orb after release.",
      upgradePierce: "Piercing Shine",
      upgradePierceDesc: "The orb can hit the same beast again sooner.",
      upgradeRecharge: "Faster Recharge",
      upgradeRechargeDesc: "Ready the next shot sooner.",
      upgradeShield: "Core Shield",
      upgradeShieldDesc: "Restore 4 core HP.",
      upgradeMagnet: "Scout Magnet",
      upgradeMagnetDesc: "+2 Star Stones after the raid.",
      roomForge: "Orb Forge",
      roomForgeDesc: "+1 base orb damage per level.",
      roomShield: "Core Shield",
      roomShieldDesc: "+4 starting core HP per level.",
      roomDen: "Companion Den",
      roomDenDesc: "Adds helper chip damage at level 2+.",
      roomTower: "Scout Tower",
      roomTowerDesc: "+1 bonus Star Stone per raid level.",
      level: "Lv.{n}",
      upgradeRoom: "Upgrade {cost}",
      maxed: "Max",
    },
    "zh-Hant": {
      title: "動物星珠要塞",
      language: "語言",
      menuTitle: "瞄準星珠，穿越水晶要塞。",
      menuHint: "清除三波敵人、選擇升級、獲得星石，並把要塞房間永久升級。",
      bestRaid: "最佳突襲",
      starStones: "星石",
      diamonds: "鑽石",
      startRaid: "開始突襲",
      raidMap: "突襲地圖",
      wave: "波次",
      core: "核心",
      shots: "射擊",
      aimHint: "從發射器拖曳瞄準，預覽反彈路線後放開。",
      orbReady: "星珠已準備好。用牆面反彈擊中影獸，別讓牠們靠近核心。",
      orbFlying: "星珠正在飛行。觀察反彈路線，準備下一次瞄準。",
      fortressHit: "影獸撞到核心了。更早瞄準，或改用更寬的反彈角度。",
      waveClear: "波次完成。選擇一個祝福後進入下一波。",
      chooseUpgrade: "選擇一個要塞祝福",
      reroll: "花 3 鑽石重抽",
      rerolled: "遺物選項已刷新。",
      rerollNeed: "需要 3 顆鑽石才能重抽。",
      retry: "再試一次",
      raidClear: "突襲成功",
      raidFailed: "突襲失敗",
      resultWin: "完成第 {wave}/3 波，獲得 {stones} 顆星石，並保留 {core} 點核心生命。",
      resultLose: "抵達第 {wave}/3 波並獲得 {stones} 顆星石。升級房間後再試更安全的反彈路線。",
      reportWin: "能力回饋：邏輯與反應很穩。你透過反彈規劃與升級選擇保護了要塞。",
      reportLose: "能力回饋：這是很好的練習。下一局可以更早瞄準，利用牆面一次擊中多隻影獸。",
      upgradeDamage: "巨大星珠",
      upgradeDamageDesc: "星珠傷害 +1。",
      upgradeSplit: "分裂星珠",
      upgradeSplitDesc: "發射後額外射出一顆較弱星珠。",
      upgradePierce: "穿透星芒",
      upgradePierceDesc: "星珠可以更快再次命中同一隻影獸。",
      upgradeRecharge: "快速充能",
      upgradeRechargeDesc: "更快準備下一次射擊。",
      upgradeShield: "核心護盾",
      upgradeShieldDesc: "恢復 4 點核心生命。",
      upgradeMagnet: "偵查磁力",
      upgradeMagnetDesc: "突襲結束後額外 +2 星石。",
      roomForge: "星珠鍛造室",
      roomForgeDesc: "每級提高基礎星珠傷害。",
      roomShield: "核心護盾室",
      roomShieldDesc: "每級提高 4 點起始核心生命。",
      roomDen: "夥伴巢穴",
      roomDenDesc: "2 級後提供輔助傷害。",
      roomTower: "偵查高塔",
      roomTowerDesc: "每個突襲等級額外 +1 星石。",
      level: "Lv.{n}",
      upgradeRoom: "升級 {cost}",
      maxed: "已滿",
    },
  };

  const assets = {
    bg: "../../assets/animal-orb-fortress-arena-bg.webp",
    lion: "../../assets/animal-orb-fortress-hero-lion.webp",
    orbs: "../../assets/animal-orb-fortress-orb-set.webp",
    beasts: "../../assets/animal-orb-fortress-shadow-beasts.webp",
    boss: "../../assets/animal-orb-fortress-boss-golem.webp",
    rooms: "../../assets/animal-orb-fortress-room-icons.webp",
    upgrades: "../../assets/animal-orb-fortress-upgrade-icons.webp",
    revive: "../../assets/animal-orb-fortress-diamond-revive.webp",
    fx: "../../assets/animal-orb-fortress-fx.webp",
  };

  const pageMeta = {
    en: {
      title: "Animal Orb Fortress - Free Animal Ricochet Roguelite",
      description: "Animal Orb Fortress is a 13+ animal ricochet roguelite where players aim spirit orbs, clear boss waves, and grow a crystal fortress locally.",
      ogDescription: "Aim animal spirit orbs through crystal fortress rooms, clear boss waves, choose upgrades, and grow permanent rooms with local progress.",
      twitterDescription: "Plan bounce shots, defeat boss waves, and build a crystal animal fortress with local progress.",
    },
    "zh-Hant": {
      title: "動物星珠要塞 - 免費動物反彈 Roguelite",
      description: "動物星珠要塞是一款 13+ 動物反彈 Roguelite，玩家瞄準星珠、清除首領波次，並在本機累積水晶要塞進度。",
      ogDescription: "用動物星珠穿越水晶要塞房間，規劃反彈路線、擊退首領波次、選擇升級並累積永久進度。",
      twitterDescription: "規劃反彈射擊、擊敗首領波次，並在本機進度中建設水晶動物要塞。",
    },
  };

  const roomDefs = [
    { id: "forge", icon: 0, name: "roomForge", desc: "roomForgeDesc" },
    { id: "shield", icon: 2, name: "roomShield", desc: "roomShieldDesc" },
    { id: "den", icon: 1, name: "roomDen", desc: "roomDenDesc" },
    { id: "tower", icon: 3, name: "roomTower", desc: "roomTowerDesc" },
  ];
  const upgradeDefs = [
    { id: "damage", icon: 0, name: "upgradeDamage", desc: "upgradeDamageDesc" },
    { id: "split", icon: 1, name: "upgradeSplit", desc: "upgradeSplitDesc" },
    { id: "pierce", icon: 2, name: "upgradePierce", desc: "upgradePierceDesc" },
    { id: "recharge", icon: 3, name: "upgradeRecharge", desc: "upgradeRechargeDesc" },
    { id: "shield", icon: 4, name: "upgradeShield", desc: "upgradeShieldDesc" },
    { id: "magnet", icon: 5, name: "upgradeMagnet", desc: "upgradeMagnetDesc" },
  ];

  const images = {};
  let locale = window.WonderI18n?.locale?.() || localStorage.getItem(localeKey) || "en";
  let save = loadSave();
  let state = makeState();
  let lastFrame = 0;
  let raf = 0;
  let pointer = { active: false, x: 0, y: 0 };
  let soundAt = {};

  function t(key, data = {}) {
    const value = text[locale]?.[key] || text.en[key] || key;
    return Object.entries(data).reduce((out, [name, item]) => out.replaceAll(`{${name}}`, String(item)), value);
  }

  function setMeta(selector, value) {
    document.querySelector(selector)?.setAttribute("content", value);
  }

  function updatePageMeta() {
    const meta = pageMeta[locale] || pageMeta.en;
    document.title = meta.title;
    setMeta("meta[name='description']", meta.description);
    setMeta("meta[property='og:title']", meta.title);
    setMeta("meta[property='og:description']", meta.ogDescription);
    setMeta("meta[name='twitter:title']", meta.title);
    setMeta("meta[name='twitter:description']", meta.twitterDescription);
  }

  function playSound(name, gap = 0.08) {
    const now = performance.now();
    if (soundAt[name] && now - soundAt[name] < gap * 1000) return;
    soundAt[name] = now;
    window.WonderSound?.play(name);
  }

  function loadSave() {
    try {
      const parsed = JSON.parse(localStorage.getItem(saveKey) || "{}");
      return {
        bestRaid: 1,
        starStones: 0,
        playCount: 0,
        rooms: { forge: 0, shield: 0, den: 0, tower: 0 },
        ...parsed,
        rooms: { forge: 0, shield: 0, den: 0, tower: 0, ...(parsed.rooms || {}) },
      };
    } catch {
      return { bestRaid: 1, starStones: 0, playCount: 0, rooms: { forge: 0, shield: 0, den: 0, tower: 0 } };
    }
  }

  function persist() {
    localStorage.setItem(saveKey, JSON.stringify(save));
  }

  function makeState() {
    const shieldLevel = save?.rooms?.shield || 0;
    const forgeLevel = save?.rooms?.forge || 0;
    return {
      mode: "menu",
      wave: 1,
      raidTier: Math.max(1, save?.bestRaid || 1),
      core: 20 + shieldLevel * 4,
      maxCore: 20 + shieldLevel * 4,
      baseDamage: 2 + forgeLevel,
      shotCount: 0,
      stonesEarned: 0,
      bonusStones: 0,
      rerolled: false,
      readyTimer: 0,
      orbCooldown: 0.55,
      split: false,
      pierce: false,
      enemies: [],
      orbs: [],
      sparks: [],
      preview: [],
      launcher: { x: W / 2, y: H - 64 },
    };
  }

  function walletDiamonds() {
    return window.WeightPlayWallet?.read?.().diamonds || 0;
  }

  function show(panel) {
    [nodes.menuPanel, nodes.gamePanel, nodes.upgradePanel, nodes.resultPanel].forEach((node) => node.classList.add("is-hidden"));
    panel.classList.remove("is-hidden");
  }

  function setLocale(next) {
    locale = next || "en";
    localStorage.setItem(localeKey, locale);
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : "en";
    if (window.WonderI18n?.locale?.() !== locale) window.WonderI18n?.setLocale?.(locale);
    else window.dispatchEvent(new CustomEvent("wonder:locale-change", { detail: { locale } }));
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
    updatePageMeta();
    nodes.localeSelect.value = locale;
    renderMenu();
    renderHud();
    renderUpgradeCards();
  }

  function preload() {
    const entries = Object.entries(assets);
    let done = 0;
    const finish = () => {
      nodes.loadingText.textContent = "100%";
      nodes.loadingFill.style.width = "100%";
      nodes.loadingPanel.classList.add("is-hidden");
      renderMenu();
      draw();
      maybeSmokeStart();
    };
    entries.forEach(([key, src]) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      images[key] = img;
      img.onload = img.onerror = () => {
        done += 1;
        const pct = Math.round((done / entries.length) * 100);
        nodes.loadingText.textContent = `${pct}%`;
        nodes.loadingFill.style.width = `${pct}%`;
        if (done >= entries.length) finish();
      };
    });
    window.setTimeout(finish, 1800);
  }

  function roomCost(id) {
    return 8 + (save.rooms[id] || 0) * 6;
  }

  function renderMenu() {
    nodes.bestRaidText.textContent = String(save.bestRaid || 1);
    nodes.starStoneText.textContent = String(save.starStones || 0);
    nodes.diamondText.textContent = String(walletDiamonds());
    nodes.roomGrid.innerHTML = roomDefs
      .map((room) => {
        const level = save.rooms[room.id] || 0;
        const cost = roomCost(room.id);
        const canUpgrade = level < 5 && save.starStones >= cost;
        return `
          <div class="room-card">
            <img src="../../assets/animal-orb-fortress-room-icons.webp" alt="" style="${atlasPosition(room.icon, roomDefs.length)}" />
            <div>
              <strong>${t(room.name)}</strong>
              <span>${t("level", { n: level })} - ${t(room.desc)}</span>
            </div>
            <button type="button" data-room="${room.id}" ${canUpgrade ? "" : "disabled"}>${level >= 5 ? t("maxed") : t("upgradeRoom", { cost })}</button>
          </div>`;
      })
      .join("");
  }

  function upgradeRoom(id) {
    const level = save.rooms[id] || 0;
    const cost = roomCost(id);
    if (level >= 5 || save.starStones < cost) return;
    save.starStones -= cost;
    save.rooms[id] = level + 1;
    persist();
    playSound("success", 0.2);
    renderMenu();
    window.WonderAnalytics?.track("room_upgrade", { game_id: GAME_ID, room: id, level: save.rooms[id] });
  }

  function startRaid() {
    cancelAnimationFrame(raf);
    state = makeState();
    state.mode = "running";
    save.playCount += 1;
    persist();
    spawnWave();
    show(nodes.gamePanel);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    nodes.hintText.textContent = t("orbReady");
    renderHud();
    lastFrame = performance.now();
    playSound("start", 0.2);
    window.WonderAnalytics?.track("raid_start", { game_id: GAME_ID, tier: state.raidTier });
    loop(lastFrame);
  }

  function spawnWave() {
    state.enemies = [];
    const tier = state.raidTier;
    const wave = state.wave;
    if (wave >= 3) {
      state.enemies.push(makeEnemy("boss", W / 2, 96, 20 + tier * 4, 13, 55));
    } else {
      const count = 2 + wave + Math.min(2, tier - 1);
      for (let i = 0; i < count; i += 1) {
        const kind = i % 3 === 0 ? "skitter" : i % 3 === 1 ? "thorn" : "wisp";
        state.enemies.push(makeEnemy(kind, 128 + i * (720 / Math.max(1, count - 1)), 82 + (i % 2) * 42, 4 + wave * 2 + tier, kind === "thorn" ? 9 : 15, kind === "thorn" ? 33 : 27));
      }
    }
    renderHud();
  }

  function makeEnemy(kind, x, y, hp, speed, size) {
    return { kind, x, y, hp, maxHp: hp, speed, size, hitTimer: 0 };
  }

  function renderHud() {
    nodes.waveText.textContent = `${Math.min(state.wave, 3)}/3`;
    nodes.coreText.textContent = `${Math.max(0, Math.ceil(state.core))}/${state.maxCore}`;
    nodes.shotText.textContent = String(state.shotCount);
  }

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const source = event.touches?.[0] || event.changedTouches?.[0] || event;
    return {
      x: ((source.clientX - rect.left) / rect.width) * W,
      y: ((source.clientY - rect.top) / rect.height) * H,
    };
  }

  function onPointerStart(event) {
    if (state.mode !== "running" || !canFireOrb()) return;
    event.preventDefault();
    pointer.active = true;
    Object.assign(pointer, canvasPoint(event));
    state.preview = previewPath(pointer.x, pointer.y);
  }

  function onPointerMove(event) {
    if (!pointer.active) return;
    event.preventDefault();
    Object.assign(pointer, canvasPoint(event));
    state.preview = previewPath(pointer.x, pointer.y);
  }

  function onPointerEnd(event) {
    if (!pointer.active) return;
    event.preventDefault();
    pointer.active = false;
    Object.assign(pointer, canvasPoint(event));
    releaseOrb(pointer.x, pointer.y);
  }

  function aimVector(x, y) {
    const dx = x - state.launcher.x;
    const dy = y - state.launcher.y;
    const len = Math.max(1, Math.hypot(dx, dy));
    const power = 520;
    return { vx: (dx / len) * power, vy: (dy / len) * power };
  }

  function previewPath(x, y) {
    const v = aimVector(x, y);
    let px = state.launcher.x;
    let py = state.launcher.y;
    let vx = v.vx;
    let vy = v.vy;
    const points = [{ x: px, y: py }];
    for (let i = 0; i < 85; i += 1) {
      px += vx * 0.035;
      py += vy * 0.035;
      if (px < 46 || px > W - 46) {
        vx *= -1;
        px = Math.max(46, Math.min(W - 46, px));
      }
      if (py < 46 || py > H - 46) {
        vy *= -1;
        py = Math.max(46, Math.min(H - 46, py));
      }
      if (i % 10 === 0) points.push({ x: px, y: py });
    }
    return points;
  }

  function releaseOrb(x, y) {
    if (!canFireOrb()) return;
    const v = aimVector(x, y);
    const limit = activeOrbLimit();
    state.orbs.push(makeOrb(v.vx, v.vy, state.shotCount % 5));
    if (state.split && state.orbs.length < limit) state.orbs.push(makeOrb(v.vx * 0.78 + 80, v.vy * 0.78, (state.shotCount + 1) % 5, 0.72));
    state.preview = [];
    state.shotCount += 1;
    state.readyTimer = state.orbCooldown;
    nodes.hintText.textContent = t("orbFlying");
    playSound("pop", 0.08);
    window.WonderAnalytics?.track("shot_fired", { game_id: GAME_ID, wave: state.wave, split: state.split });
    renderHud();
  }

  function makeOrb(vx, vy, skin, damageScale = 1) {
    return { x: state.launcher.x, y: state.launcher.y, vx, vy, r: 20, life: 5.2, damage: Math.max(1, Math.round(state.baseDamage * damageScale)), skin, hits: new Map() };
  }

  function activeOrbLimit() {
    return state.split ? 3 : 2;
  }

  function canFireOrb() {
    return state.readyTimer <= 0 && state.orbs.length < activeOrbLimit();
  }

  function loop(now) {
    const dt = Math.min(0.033, (now - lastFrame) / 1000 || 0.016);
    lastFrame = now;
    if (state.mode === "running") {
      update(dt);
      draw();
      raf = requestAnimationFrame(loop);
    }
  }

  function update(dt) {
    state.readyTimer = Math.max(0, state.readyTimer - dt);
    state.enemies.forEach((enemy) => {
      const dx = state.launcher.x - enemy.x;
      const dy = state.launcher.y - enemy.y;
      const len = Math.max(1, Math.hypot(dx, dy));
      enemy.x += (dx / len) * enemy.speed * dt;
      enemy.y += (dy / len) * enemy.speed * dt;
      enemy.hitTimer = Math.max(0, enemy.hitTimer - dt);
      if (Math.hypot(enemy.x - state.launcher.x, enemy.y - state.launcher.y) < enemy.size * 0.7) {
        state.core -= enemy.kind === "boss" ? 4 : enemy.kind === "thorn" ? 3 : 2;
        enemy.hp = 0;
        nodes.hintText.textContent = t("fortressHit");
        playSound("wrong", 0.2);
        renderHud();
      }
    });
    state.enemies = state.enemies.filter((enemy) => enemy.hp > 0);

    state.orbs.forEach((orb) => updateOrb(orb, dt));
    state.orbs = state.orbs.filter((orb) => orb.life > 0);
    state.sparks.forEach((spark) => (spark.life -= dt));
    state.sparks = state.sparks.filter((spark) => spark.life > 0);

    if (state.core <= 0) finishRaid(false);
    else if (state.enemies.length === 0) {
      if (state.wave >= 3) finishRaid(true);
      else showUpgrade();
    } else if (canFireOrb()) {
      nodes.hintText.textContent = t("orbReady");
    }
  }

  function updateOrb(orb, dt) {
    orb.life -= dt;
    orb.x += orb.vx * dt;
    orb.y += orb.vy * dt;
    if (orb.x < 38 || orb.x > W - 38) {
      orb.vx *= -1;
      orb.x = Math.max(38, Math.min(W - 38, orb.x));
      playSound("click", 0.08);
    }
    if (orb.y < 38 || orb.y > H - 38) {
      orb.vy *= -1;
      orb.y = Math.max(38, Math.min(H - 38, orb.y));
      playSound("click", 0.08);
    }
    state.enemies.forEach((enemy) => {
      const recent = orb.hits.get(enemy) || 0;
      if (recent > 0) {
        orb.hits.set(enemy, recent - dt);
        return;
      }
      const enemyVisualRadius = enemy.kind === "boss" ? 62 : enemy.size * 0.78;
      if (Math.hypot(orb.x - enemy.x, orb.y - enemy.y) < orb.r + enemyVisualRadius) {
        enemy.hp -= orb.damage;
        enemy.hitTimer = 0.16;
        orb.hits.set(enemy, state.pierce ? 0.2 : 0.55);
        state.sparks.push({ x: enemy.x, y: enemy.y, life: 0.25 });
        playSound("hit", 0.06);
      }
    });
  }

  function showUpgrade() {
    state.mode = "upgrade";
    cancelAnimationFrame(raf);
    state.stonesEarned += 3 + state.wave + (save.rooms.tower || 0);
    nodes.hintText.textContent = t("waveClear");
    renderUpgradeCards();
    show(nodes.upgradePanel);
    window.WonderAnalytics?.track("wave_clear", { game_id: GAME_ID, wave: state.wave });
  }

  function currentUpgradeChoices() {
    const seed = state.wave + state.shotCount + (state.rerolled ? 5 : 0);
    return [0, 1, 2].map((offset) => upgradeDefs[(seed + offset) % upgradeDefs.length]);
  }

  function renderUpgradeCards() {
    if (!nodes.upgradeCards) return;
    const choices = currentUpgradeChoices();
    nodes.upgradeStatus.textContent = state.rerolled ? t("rerolled") : "";
    nodes.rerollBtn.textContent = `${t("reroll")} (${walletDiamonds()})`;
    nodes.rerollBtn.disabled = state.rerolled;
    nodes.upgradeCards.innerHTML = choices
      .map(
        (upgrade) => `
          <button type="button" class="upgrade-card" data-upgrade="${upgrade.id}">
            <span class="upgrade-icon" aria-hidden="true" style="${atlasBackground(upgrade.icon, upgradeDefs.length)}"></span>
            <strong>${t(upgrade.name)}</strong>
            <span>${t(upgrade.desc)}</span>
          </button>`
      )
      .join("");
  }

  function atlasPosition(index, count) {
    const x = count <= 1 ? 50 : (index / (count - 1)) * 100;
    return `object-position:${x}% 50%`;
  }

  function atlasBackground(index, count) {
    const x = count <= 1 ? 50 : (index / (count - 1)) * 100;
    return `background-position:${x}% 50%;background-size:${count * 100}% 100%;`;
  }

  function chooseUpgrade(id) {
    if (state.mode !== "upgrade") return;
    if (id === "damage") state.baseDamage += 1;
    if (id === "split") state.split = true;
    if (id === "pierce") state.pierce = true;
    if (id === "recharge") state.orbCooldown = Math.max(0.25, state.orbCooldown - 0.16);
    if (id === "shield") state.core = Math.min(state.maxCore, state.core + 4);
    if (id === "magnet") state.bonusStones += 2;
    state.wave += 1;
    state.rerolled = false;
    spawnWave();
    state.mode = "running";
    show(nodes.gamePanel);
    playSound("success", 0.2);
    window.WonderAnalytics?.track("upgrade_pick", { game_id: GAME_ID, upgrade: id, wave: state.wave });
    lastFrame = performance.now();
    loop(lastFrame);
  }

  function rerollChoices() {
    if (state.mode !== "upgrade" || state.rerolled) return;
    const wallet = window.WeightPlayWallet;
    if (!wallet?.spendDiamonds || !wallet.spendDiamonds(rerollCost)) {
      nodes.upgradeStatus.textContent = t("rerollNeed");
      playSound("wrong", 0.2);
      return;
    }
    state.rerolled = true;
    renderUpgradeCards();
    window.WonderAnalytics?.track("relic_reroll", { game_id: GAME_ID, cost: rerollCost });
  }

  function finishRaid(win) {
    if (state.mode === "result") return;
    state.mode = "result";
    cancelAnimationFrame(raf);
    const stones = Math.max(1, state.stonesEarned + state.bonusStones + (win ? 5 : 1));
    save.starStones += stones;
    if (win) save.bestRaid = Math.max(save.bestRaid || 1, state.raidTier + 1);
    persist();
    nodes.resultTitle.textContent = t(win ? "raidClear" : "raidFailed");
    nodes.resultText.textContent = t(win ? "resultWin" : "resultLose", {
      wave: Math.min(3, state.wave),
      stones,
      core: Math.max(0, Math.ceil(state.core)),
    });
    nodes.skillReportText.textContent = t(win ? "reportWin" : "reportLose");
    show(nodes.resultPanel);
    renderMenu();
    playSound(win ? "success" : "wrong", 0.2);
    window.WonderAnalytics?.track("raid_result", { game_id: GAME_ID, win, wave: Math.min(3, state.wave), stones });
  }

  function drawAtlas(img, index, count, x, y, size) {
    if (!img?.complete || !img.naturalWidth) return;
    const sw = img.naturalWidth / count;
    const sh = img.naturalHeight;
    ctx.drawImage(img, sw * index, 0, sw, sh, x - size / 2, y - size / 2, size, size);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    if (images.bg?.complete) ctx.drawImage(images.bg, 0, 0, W, H);
    ctx.fillStyle = "rgba(3, 10, 28, 0.34)";
    ctx.fillRect(0, 0, W, H);
    const contrastGlow = ctx.createRadialGradient(W * 0.5, H * 0.35, 80, W * 0.5, H * 0.45, W * 0.7);
    contrastGlow.addColorStop(0, "rgba(24, 41, 84, 0.18)");
    contrastGlow.addColorStop(0.62, "rgba(8, 18, 42, 0.24)");
    contrastGlow.addColorStop(1, "rgba(3, 9, 24, 0.46)");
    ctx.fillStyle = contrastGlow;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(126, 255, 202, 0.6)";
    ctx.lineWidth = 5;
    ctx.strokeRect(34, 34, W - 68, H - 68);

    if (state.preview.length > 1) {
      ctx.strokeStyle = "rgba(255, 230, 112, 0.86)";
      ctx.lineWidth = 4;
      ctx.setLineDash([12, 10]);
      ctx.beginPath();
      ctx.moveTo(state.preview[0].x, state.preview[0].y);
      state.preview.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
      ctx.setLineDash([]);
    }

    state.enemies.forEach(drawEnemy);
    state.orbs.forEach((orb) => drawAtlas(images.orbs, orb.skin || 0, 5, orb.x, orb.y, 48));
    state.sparks.forEach((spark) => {
      ctx.globalAlpha = Math.max(0, spark.life / 0.25);
      drawAtlas(images.fx, 1, 4, spark.x, spark.y, 70);
      ctx.globalAlpha = 1;
    });

    drawAtlas(images.lion, 0, 1, state.launcher.x, state.launcher.y + 8, 86);
    drawCore();
  }

  function drawEnemy(enemy) {
    const size = enemy.kind === "boss" ? 132 : enemy.size * 2.25;
    ctx.save();
    ctx.shadowColor = enemy.kind === "thorn" ? "rgba(255, 202, 86, 0.75)" : enemy.kind === "boss" ? "rgba(255, 86, 128, 0.75)" : "rgba(132, 210, 255, 0.72)";
    ctx.shadowBlur = enemy.hitTimer > 0 ? 28 : 18;
    ctx.fillStyle = enemy.kind === "boss" ? "rgba(69, 13, 35, 0.56)" : "rgba(7, 20, 48, 0.52)";
    ctx.beginPath();
    ctx.ellipse(enemy.x, enemy.y + size * 0.08, size * 0.52, size * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
    if (enemy.kind === "boss") drawAtlas(images.boss, 0, 1, enemy.x, enemy.y, size);
    else drawAtlas(images.beasts, enemy.kind === "skitter" ? 0 : enemy.kind === "thorn" ? 1 : 2, 3, enemy.x, enemy.y, size);
    ctx.restore();
    const barW = Math.max(48, size * 0.58);
    ctx.fillStyle = "rgba(2,8,20,0.82)";
    ctx.fillRect(enemy.x - barW / 2 - 2, enemy.y - size * 0.48 - 2, barW + 4, 11);
    ctx.fillStyle = enemy.hitTimer > 0 ? "#fff06a" : "#ff6478";
    ctx.fillRect(enemy.x - barW / 2, enemy.y - size * 0.48, barW * Math.max(0, enemy.hp / enemy.maxHp), 7);
  }

  function drawCore() {
    const pct = Math.max(0, state.core / state.maxCore);
    ctx.fillStyle = "rgba(4, 20, 18, 0.78)";
    ctx.beginPath();
    ctx.arc(state.launcher.x, state.launcher.y, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = pct > 0.35 ? "#7dffd0" : "#ff6878";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(state.launcher.x, state.launcher.y, 49, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
    ctx.stroke();
  }

  function maybeSmokeStart() {
    const params = new URLSearchParams(location.search);
    if (params.get("smoke") === "1" && params.get("autostart") === "1") {
      window.setTimeout(startRaid, 80);
    }
  }

  nodes.localeSelect.addEventListener("change", (event) => setLocale(event.target.value));
  nodes.startBtn.addEventListener("click", startRaid);
  nodes.retryBtn.addEventListener("click", startRaid);
  nodes.mapBtn.addEventListener("click", () => {
    state.mode = "menu";
    cancelAnimationFrame(raf);
    show(nodes.menuPanel);
    renderMenu();
  });
  nodes.resultMenuBtn.addEventListener("click", () => {
    show(nodes.menuPanel);
    renderMenu();
  });
  nodes.roomGrid.addEventListener("click", (event) => {
    const id = event.target?.dataset?.room;
    if (id) upgradeRoom(id);
  });
  nodes.upgradeCards.addEventListener("click", (event) => {
    const id = event.target?.closest?.("[data-upgrade]")?.dataset?.upgrade;
    if (id) chooseUpgrade(id);
  });
  nodes.rerollBtn.addEventListener("click", rerollChoices);
  canvas.addEventListener("pointerdown", onPointerStart);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerEnd);
  canvas.addEventListener("pointercancel", onPointerEnd);

  window.__animalOrbFortressSmoke = {
    snapshot: () => ({
      mode: state.mode,
      wave: state.wave,
      core: state.core,
      maxCore: state.maxCore,
      shotCount: state.shotCount,
      enemies: state.enemies.length,
      enemyKinds: state.enemies.map((enemy) => enemy.kind),
      orbs: state.orbs.length,
      activeOrbLimit: activeOrbLimit(),
      stonesEarned: state.stonesEarned,
      rerolled: state.rerolled,
      walletDiamonds: walletDiamonds(),
      save,
      title: t("title"),
    }),
    forceClearWave: () => {
      state.enemies = [];
      update(0.016);
    },
    forceCoreBreach: () => {
      state.enemies = [makeEnemy("skitter", state.launcher.x, state.launcher.y - 10, 1, 0, 42)];
      state.core = 1;
      update(0.016);
    },
    forceWin: () => finishRaid(true),
    forceCollisionProbe: () => {
      const enemy = makeEnemy("skitter", state.launcher.x, state.launcher.y - 90, 8, 0, 42);
      const orb = makeOrb(0, -80, 0);
      orb.x = enemy.x;
      orb.y = enemy.y + orb.r + enemy.size * 0.7 - 2;
      state.enemies = [enemy];
      state.orbs = [orb];
      const before = enemy.hp;
      updateOrb(orb, 0.016);
      return { before, after: enemy.hp, damage: before - enemy.hp, distance: Math.hypot(orb.x - enemy.x, orb.y - enemy.y) };
    },
  };

  setLocale(locale);
  preload();
})();
