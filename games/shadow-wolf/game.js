(() => {
  const GAME_ID = "shadow-wolf";
  const saveKey = "weightplay_shadow_wolf_v1";
  const localeKey = "weightPlayLocale";

  const $ = (id) => document.getElementById(id);
  const nodes = {
    localeSelect: $("localeSelect"),
    menuPanel: $("menuPanel"),
    gamePanel: $("gamePanel"),
    draftPanel: $("draftPanel"),
    lootPanel: $("lootPanel"),
    resultPanel: $("resultPanel"),
    startBtn: $("startBtn"),
    menuBtn: $("menuBtn"),
    retryBtn: $("retryBtn"),
    resultMenuBtn: $("resultMenuBtn"),
    hpText: $("hpText"),
    hpFill: $("hpFill"),
    levelVal: $("levelVal"),
    expText: $("expText"),
    expFill: $("expFill"),
    roomText: $("roomText"),
    keyText: $("keyText"),
    gameCanvas: $("gameCanvas"),
    btnLeft: $("btnLeft"),
    btnRight: $("btnRight"),
    btnJump: $("btnJump"),
    btnAttack: $("btnAttack"),
    eqWeaponName: $("eqWeaponName"),
    eqWeaponEffect: $("eqWeaponEffect"),
    eqArmorName: $("eqArmorName"),
    eqArmorEffect: $("eqArmorEffect"),
    eqBootsName: $("eqBootsName"),
    eqBootsEffect: $("eqBootsEffect"),
    statDmg: $("statDmg"),
    statSpeed: $("statSpeed"),
    statJump: $("statJump"),
    statCrit: $("statCrit"),
    draftCards: $("draftCards"),
    lootIcon: $("lootIcon"),
    lootName: $("lootName"),
    lootType: $("lootType"),
    lootEffect: $("lootEffect"),
    equipLootBtn: $("equipLootBtn"),
    resultTitle: $("resultTitle"),
    resultScore: $("resultScore"),
    resultText: $("resultText"),
    skillReportText: $("skillReportText"),
    logicStars: $("logicStars"),
    focusStars: $("focusStars"),
    problemStars: $("problemStars"),
    loadingPanel: $("loadingPanel"),
    loadingText: $("loadingText"),
    loadingFill: $("loadingFill"),
    diamondBalance: $("diamondBalance"),
    amuletBtn: $("amuletBtn"),
    amuletCost: $("amuletCost"),
    amuletStatus: $("amuletStatus"),
  };

  const amuletCost = 15;

  const text = {
    en: {
      title: "Shadow Wolf",
      menuTitle: "Dungeon Platform Adventure.",
      menuHint: "Move with A/D, jump/double-jump with W/Space, attack with J, and dash with K. Collect keys to open chest upgrades, and clear Room 3.",
      prototypeGoalsTitle: "Prototype test goals",
      prototypeGoalsText: "Jump over platforms and spikes, slash bat/wolf enemies, open loot chests, and verify equipped item buffs are active.",
      diamondShopTitle: "Permanent Upgrade",
      amuletName: "Mist Amulet",
      amuletEffect: "Start every run with +10 Max HP (40 HP instead of 30 HP).",
      amuletOwned: "Owned: every run starts with 40 Max HP.",
      startRun: "Start Expedition",
      menu: "Menu",
      hudHp: "Wolf HP",
      chooseCard: "Choose a Relic Upgrade",
      chooseCardDesc: "Select one of these ancient relics to empower your wolf.",
      lootFound: "Relic Chest Unlocked!",
      equipLoot: "Equip Gear",
      tryAgain: "Try Again",
      backToMenu: "Back to Menu",
      sidebarInventory: "Equipped Gear",
      sidebarStats: "Character Stats",
      slotWeapon: "WEAPON",
      slotArmor: "ARMOR",
      slotBoots: "BOOTS",
      runComplete: "Expedition Success!",
      runFailed: "Wolf Defeated",
      resultDisclaimer: "For fun and local progress tracking only.",
      skillReportTitle: "Ability Analysis Report",
      skillLogic: "Logic",
      skillFocus: "Focus",
      skillProblem: "Problem Solving",

      // Relic Upgrades
      relic_fang: "Sharp Fang",
      relic_fang_desc: "Increase claw sweep base Damage by +3.",
      relic_fur: "Thick Fur",
      relic_fur_desc: "Increase Max HP by +5 and heal 5 HP.",
      relic_boots: "Wind Boots",
      relic_boots_desc: "Increase Jump velocity by +0.8 units.",

      // Equipment Drops
      gear_sword_rare: "Crystal Fang",
      gear_sword_rare_desc: "+4 Claw Damage",
      gear_dagger_epic: "Relic Claw",
      gear_dagger_epic_desc: "+8 Damage & +10% Crit",
      gear_armor_rare: "Wolf Collar",
      gear_armor_rare_desc: "+10 Max HP",
      gear_armor_epic: "Leather Saddle",
      gear_armor_epic_desc: "+20 Max HP",
      gear_boots_rare: "Explorer Boots",
      gear_boots_rare_desc: "+1.0 Jump Force",
      gear_boots_epic: "Swift Boots",
      gear_boots_epic_desc: "+1.5 Jump & +20% Speed",

      // Gear Slot Rarity Label
      rarity_rare: "Rare Gear",
      rarity_epic: "Epic Gear",

      // Reports
      report_win: "Legendary Wolf! You conquered the spikes, timed your double jumps, equipped rare teeth/saddles, and clawed the Behemoth.",
      report_partial: "Decent climber! You reached Room {room}. Level up and equip stronger claws and saddles to clear Room 3.",
    },
    "zh-Hant": {
      title: "影狼傳說",
      menuTitle: "遺跡平台冒險之旅。",
      menuHint: "使用 A/D 移動，W/空白鍵進行跳躍或雙重跳躍，J 鍵揮爪攻擊，K 鍵衝刺。收集鑰匙解鎖裝備，通關 Room 3。",
      prototypeGoalsTitle: "原型測試目標",
      prototypeGoalsText: "跨越浮空平台與地底刺針陷阱，揮爪砍殺影怪，打開寶箱並驗證裝備加成屬性數值正常。",
      diamondShopTitle: "永久升級",
      amuletName: "迷霧護符",
      amuletEffect: "每局挑戰開始時最大生命值 +10 HP (以 40 HP 開局，原為 30 HP)。",
      amuletOwned: "已擁有：以 40 Max HP 開局。",
      startRun: "開始探險",
      menu: "選單",
      hudHp: "影狼生命",
      chooseCard: "選擇遺跡能力",
      chooseCardDesc: "選擇古代遺物能力以大幅增加野獸戰鬥屬性。",
      lootFound: "解鎖遺跡寶箱！",
      equipLoot: "裝備道具",
      tryAgain: "再試一次",
      backToMenu: "回到主選單",
      sidebarInventory: "已穿戴裝備",
      sidebarStats: "角色屬性",
      slotWeapon: "武器槽",
      slotArmor: "防具槽",
      slotBoots: "鞋子槽",
      runComplete: "遺跡冒險成功！",
      runFailed: "野獸倒下了",
      resultDisclaimer: "能力評估僅供趣味與本機進度追蹤。",
      skillReportTitle: "能力分析報告",
      skillLogic: "邏輯力",
      skillFocus: "專注力",
      skillProblem: "問題解決",

      // Relics Upgrades
      relic_fang: "鋒利尖牙",
      relic_fang_desc: "揮爪基礎傷害力增加 3 點。",
      relic_fur: "堅韌皮毛",
      relic_fur_desc: "最大生命值增加 5 點，並恢復 5 點生命值。",
      relic_boots: "疾風護腿",
      relic_boots_desc: "垂直跳躍初速度增加 0.8 單位。",

      // Equipment Drops
      gear_sword_rare: "水晶獸齒",
      gear_sword_rare_desc: "+4 揮爪傷害",
      gear_dagger_epic: "遺跡鋼爪",
      gear_dagger_epic_desc: "+8 傷害與 +10% 暴擊機率",
      gear_armor_rare: "野性項圈",
      gear_armor_rare_desc: "+10 最大生命值",
      gear_armor_epic: "皮革護鞍",
      gear_armor_epic_desc: "+20 最大生命值",
      gear_boots_rare: "探險短靴",
      gear_boots_rare_desc: "+1.0 跳躍彈跳高度",
      gear_boots_epic: "飛羽神靴",
      gear_boots_epic_desc: "+1.5 跳躍與 +20% 移動速度",

      // Gear Slot Rarity Label
      rarity_rare: "稀有裝備",
      rarity_epic: "史詩裝備",

      // Reports
      report_win: "傳奇影狼！你穿越了棘刺機關，靈活二段跳，穿戴稀有尖牙與項圈，撕裂了遺跡巨獸！",
      report_partial: "優秀的冒險！你到達了第 {room} 間房。多收集高品質利爪與飛靴以挑戰巨獸 Boss。",
    }
  };

  function preloadImage(src) {
    const image = new Image();
    image.src = src;
    return image;
  }

  const shadowAssetPaths = {
    bg: "../../assets/shadow-wolf-stage-bg.webp",
    wolf: "../../assets/shadow-wolf-hero.webp",
    enemyWolf: "../../assets/shadow-wolf-enemy-wolf.webp",
    bat: "../../assets/shadow-wolf-enemy-bat.webp",
    boar: "../../assets/shadow-wolf-enemy-boar.webp",
    boss: "../../assets/shadow-wolf-boss-behemoth.webp",
    tiles: "../../assets/shadow-wolf-platform-tiles.webp",
    clawFx: "../../assets/shadow-wolf-fx-claw-slash.webp",
    dashFx: "../../assets/shadow-wolf-fx-dash-trail.webp",
    hitFx: "../../assets/shadow-wolf-fx-hit-spark.webp",
    projectileFx: "../../assets/shadow-wolf-fx-shadow-projectile.webp",
    chestFx: "../../assets/shadow-wolf-fx-chest-sparkle.webp",
    portalFx: "../../assets/shadow-wolf-fx-portal-glow.webp",
    relicSpark: "../../assets/shadow-wolf-relic-mist-amulet.webp",
  };

  const assets = Object.fromEntries(
    Object.entries(shadowAssetPaths).map(([key, src]) => [key, preloadImage(src)])
  );

  const relicIconMap = {
    relic_fang: "../../assets/shadow-wolf-relic-sharp-fang.webp",
    relic_fur: "../../assets/shadow-wolf-relic-thick-fur.webp",
    relic_boots: "../../assets/shadow-wolf-relic-wind-boots.webp",
  };

  const gearDb = {
    "sword-rare": { slot: "weapon", nameKey: "gear_sword_rare", typeKey: "rarity_rare", effectKey: "gear_sword_rare_desc", iconSrc: "../../assets/shadow-wolf-gear-crystal-fang.webp", bonusDmg: 4, bonusCrit: 0 },
    "dagger-epic": { slot: "weapon", nameKey: "gear_dagger_epic", typeKey: "rarity_epic", effectKey: "gear_dagger_epic_desc", iconSrc: "../../assets/shadow-wolf-gear-relic-claw.webp", bonusDmg: 8, bonusCrit: 0.1 },
    "armor-rare": { slot: "armor", nameKey: "gear_armor_rare", typeKey: "rarity_rare", effectKey: "gear_armor_rare_desc", iconSrc: "../../assets/shadow-wolf-gear-wolf-collar.webp", bonusHp: 10 },
    "armor-epic": { slot: "armor", nameKey: "gear_armor_epic", typeKey: "rarity_epic", effectKey: "gear_armor_epic_desc", iconSrc: "../../assets/shadow-wolf-gear-leather-harness.webp", bonusHp: 20 },
    "boots-rare": { slot: "boots", nameKey: "gear_boots_rare", typeKey: "rarity_rare", effectKey: "gear_boots_rare_desc", iconSrc: "../../assets/shadow-wolf-gear-explorer-boots.webp", bonusJump: 1.0, bonusSpeed: 0 },
    "boots-epic": { slot: "boots", nameKey: "gear_boots_epic", typeKey: "rarity_epic", effectKey: "gear_boots_epic_desc", iconSrc: "../../assets/shadow-wolf-gear-swift-boots.webp", bonusJump: 1.5, bonusSpeed: 0.8 },
  };

  // State Variables
  let state = {
    amuletUnlocked: false,
    playerMaxHp: 30,
    playerHp: 30,
    level: 1,
    exp: 0,
    expNeed: 100,
    room: 1,
    keys: 0,
    gameActive: false,
    gameLoopId: null,

    // Wolf Physics States
    x: 80,
    y: 350,
    vx: 0,
    vy: 0,
    width: 38,
    height: 30,
    grounded: false,
    doubleJumpAvailable: true,
    facing: "right",
    dashCooldown: 0,
    dashTimer: 0,
    attackTimer: 0,
    invincibilityTimer: 0,

    // Base Stats
    baseDmg: 10,
    baseSpeed: 3.5,
    baseJump: 8.5,
    baseCrit: 0.05,

    // Relic buff counts
    relicAtkCount: 0,
    relicHpCount: 0,
    relicJumpCount: 0,

    // Equipment Slots
    eqWeapon: null,
    eqArmor: null,
    eqBoots: null,

    // 2D Entities
    enemies: [],
    bullets: [], // Enemy projectiles
    orbs: [],
    pickups: [],
    particles: [],
  };

  // Level platforms geometry lists
  let platforms = [];
  let spikesList = [];

  // Inputs
  let keysPressed = {};
  let mobileInput = { left: false, right: false };

  function loadLocalState() {
    try {
      const data = JSON.parse(localStorage.getItem(saveKey) || "{}");
      state.amuletUnlocked = !!data.amuletUnlocked;
    } catch {
      state.amuletUnlocked = false;
    }
  }

  function saveLocalState() {
    try {
      localStorage.setItem(saveKey, JSON.stringify({ amuletUnlocked: state.amuletUnlocked }));
    } catch {}
  }

  function getLocale() {
    return localStorage.getItem(localeKey) === "zh-Hant" ? "zh-Hant" : "en";
  }

  function t(key, params = {}) {
    const locale = getLocale();
    const raw = text[locale][key] || text.en[key] || key;
    return Object.entries(params).reduce((str, [k, v]) => str.replaceAll(`{${k}}`, String(v)), raw);
  }

  function assetImg(src, alt = "") {
    return `<img src="${src}" alt="${alt}" loading="lazy" decoding="async" />`;
  }

  function translateUI() {
    document.documentElement.lang = getLocale();
    for (const el of document.querySelectorAll("[data-ui]")) {
      const key = el.dataset.ui;
      el.textContent = t(key);
    }
    nodes.localeSelect.value = getLocale();
    updateDiamondShopUI();
    renderEquippedGear();
  }

  function updateDiamondShopUI() {
    const wallet = window.WeightPlayWallet?.read() || { diamonds: 0 };
    nodes.diamondBalance.textContent = wallet.diamonds;

    if (state.amuletUnlocked) {
      nodes.amuletStatus.textContent = t("amuletOwned");
      nodes.amuletBtn.disabled = true;
      nodes.amuletBtn.querySelector("strong").textContent = t("amuletName");
      nodes.amuletBtn.querySelector("small").textContent = t("amuletOwned");
      nodes.amuletBtn.querySelector("b").style.display = "none";
    } else {
      nodes.amuletStatus.textContent = "";
      nodes.amuletBtn.disabled = wallet.diamonds < amuletCost;
      nodes.amuletBtn.querySelector("strong").textContent = t("amuletName");
      nodes.amuletBtn.querySelector("small").textContent = t("amuletEffect");
      nodes.amuletBtn.querySelector("b").style.display = "flex";
      nodes.amuletBtn.querySelector("b span").textContent = amuletCost;
    }
  }

  // Calculate actual stats based on levels, relics, and equipment
  function getStats() {
    let dmg = state.baseDmg + (state.relicAtkCount * 3);
    let speed = state.baseSpeed;
    let jump = state.baseJump + (state.relicJumpCount * 0.8);
    let crit = state.baseCrit;

    // Apply weapon
    if (state.eqWeapon) {
      const g = gearDb[state.eqWeapon];
      if (g.bonusDmg) dmg += g.bonusDmg;
      if (g.bonusCrit) crit += g.bonusCrit;
    }

    // Apply boots
    if (state.eqBoots) {
      const g = gearDb[state.eqBoots];
      if (g.bonusJump) jump += g.bonusJump;
      if (g.bonusSpeed) speed += g.bonusSpeed;
    }

    // Apply max HP
    let maxHp = (state.amuletUnlocked ? 40 : 30) + (state.relicHpCount * 5);
    if (state.eqArmor) {
      const g = gearDb[state.eqArmor];
      if (g.bonusHp) maxHp += g.bonusHp;
    }

    return { dmg, speed, jump, crit, maxHp };
  }

  function renderStatsPanel() {
    const stats = getStats();
    nodes.statDmg.textContent = stats.dmg.toFixed(0);
    nodes.statSpeed.textContent = stats.speed.toFixed(1);
    nodes.statJump.textContent = stats.jump.toFixed(1);
    nodes.statCrit.textContent = `${Math.round(stats.crit * 100)}%`;

    nodes.hpText.textContent = `${Math.ceil(state.playerHp)}/${stats.maxHp}`;
    nodes.hpFill.style.width = `${(state.playerHp / stats.maxHp) * 100}%`;
  }

  function renderEquippedGear() {
    // Weapon
    if (state.eqWeapon) {
      const g = gearDb[state.eqWeapon];
      nodes.eqWeaponName.textContent = t(g.nameKey);
      nodes.eqWeaponEffect.textContent = t(g.effectKey);
      nodes.eqWeaponEffect.style.display = "inline-block";
    } else {
      nodes.eqWeaponName.textContent = "None";
      nodes.eqWeaponEffect.style.display = "none";
    }

    // Armor
    if (state.eqArmor) {
      const g = gearDb[state.eqArmor];
      nodes.eqArmorName.textContent = t(g.nameKey);
      nodes.eqArmorEffect.textContent = t(g.effectKey);
      nodes.eqArmorEffect.style.display = "inline-block";
    } else {
      nodes.eqArmorName.textContent = "None";
      nodes.eqArmorEffect.style.display = "none";
    }

    // Boots
    if (state.eqBoots) {
      const g = gearDb[state.eqBoots];
      nodes.eqBootsName.textContent = t(g.nameKey);
      nodes.eqBootsEffect.textContent = t(g.effectKey);
      nodes.eqBootsEffect.style.display = "inline-block";
    } else {
      nodes.eqBootsName.textContent = "None";
      nodes.eqBootsEffect.style.display = "none";
    }
  }

  // Setup platform configurations per room
  function buildRoomGeometry() {
    platforms = [];
    spikesList = [];
    state.enemies = [];
    state.bullets = [];
    state.orbs = [];
    state.pickups = [];

    const room = state.room;
    if (room === 1) {
      // Room 1: Forest Platform tutorial
      platforms.push({ x: 0, y: 440, w: 250, h: 60 });
      platforms.push({ x: 320, y: 380, w: 180, h: 20 });
      platforms.push({ x: 580, y: 320, w: 220, h: 180 });
      platforms.push({ x: 100, y: 220, w: 120, h: 20 });

      // Spikes pit in middle gap
      spikesList.push({ x: 250, y: 475, w: 330, h: 25 });

      // Spawns
      state.enemies.push({ x: 380, y: 340, width: 24, height: 24, hp: 12, maxHp: 12, speed: 1.0, type: "wolf", bounds: { min: 320, max: 480 }, isElite: false });
      state.enemies.push({ x: 140, y: 180, width: 24, height: 24, hp: 12, maxHp: 12, speed: 1.0, type: "wolf", bounds: { min: 100, max: 200 }, isElite: false });
      
      // Elite drops Key
      state.enemies.push({ x: 680, y: 280, width: 32, height: 32, hp: 40, maxHp: 40, speed: 1.5, type: "wolf", bounds: { min: 580, max: 760 }, isElite: true });

      state.x = 80;
      state.y = 350;
    } else if (room === 2) {
      // Room 2: Floating stones and Spikes Cave
      platforms.push({ x: 0, y: 440, w: 150, h: 60 });
      platforms.push({ x: 220, y: 360, w: 120, h: 20 });
      platforms.push({ x: 420, y: 280, w: 120, h: 20 });
      platforms.push({ x: 220, y: 200, w: 120, h: 20 });
      platforms.push({ x: 600, y: 240, w: 200, h: 260 });

      spikesList.push({ x: 150, y: 475, w: 450, h: 25 });

      // Spawns (Bats shoot projectiles)
      state.enemies.push({ x: 280, y: 140, width: 24, height: 24, hp: 15, maxHp: 15, type: "bat", shootCooldown: 60 });
      state.enemies.push({ x: 480, y: 220, width: 24, height: 24, hp: 15, maxHp: 15, type: "bat", shootCooldown: 100 });
      
      // Elite Boar
      state.enemies.push({ x: 680, y: 200, width: 34, height: 34, hp: 80, maxHp: 80, speed: 1.2, type: "boar", bounds: { min: 600, max: 760 }, isElite: true });

      state.x = 60;
      state.y = 350;
    } else {
      // Room 3: Flat arena boss chamber
      platforms.push({ x: 0, y: 440, w: 800, h: 60 });
      platforms.push({ x: 120, y: 300, w: 150, h: 20 });
      platforms.push({ x: 530, y: 300, w: 150, h: 20 });

      // Giant Boss Behemoth
      state.enemies.push({ x: 600, y: 360, width: 64, height: 64, hp: 300, maxHp: 300, speed: 2.2, type: "boss", dir: -1, isElite: true, shootCooldown: 90 });

      state.x = 80;
      state.y = 350;
    }
  }

  // Active game start trigger
  function startRun() {
    loadLocalState();
    const stats = getStats();
    state.playerMaxHp = stats.maxHp;
    state.playerHp = state.playerMaxHp;
    state.level = 1;
    state.exp = 0;
    state.expNeed = 100;
    state.room = 1;
    state.keys = 0;

    state.eqWeapon = null;
    state.eqArmor = null;
    state.eqBoots = null;

    state.relicAtkCount = 0;
    state.relicHpCount = 0;
    state.relicJumpCount = 0;

    state.vx = 0;
    state.vy = 0;
    state.grounded = false;
    state.doubleJumpAvailable = true;
    state.dashCooldown = 0;
    state.dashTimer = 0;
    state.attackTimer = 0;
    state.invincibilityTimer = 0;

    buildRoomGeometry();

    nodes.menuPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.gamePanel.classList.remove("hidden");

    renderStatsPanel();
    renderEquippedGear();
    updateHUDText();

    state.gameActive = true;
    window.WonderSound?.play("start");

    cancelAnimationFrame(state.gameLoopId);
    state.gameLoopId = requestAnimationFrame(updateGameEngine);
  }

  function updateHUDText() {
    nodes.roomText.textContent = `${state.room}/3`;
    nodes.keyText.textContent = state.keys;
    nodes.levelVal.textContent = state.level;
    nodes.expText.textContent = `${state.exp}/${state.expNeed}`;
    nodes.expFill.style.width = `${(state.exp / state.expNeed) * 100}%`;
  }

  // Double Jump, Dash, Attack Slash
  function makePlayerJump() {
    const stats = getStats();
    if (state.grounded) {
      state.vy = -stats.jump;
      state.grounded = false;
      state.doubleJumpAvailable = true;
      window.WonderSound?.play("click");
    } else if (state.doubleJumpAvailable) {
      state.vy = -stats.jump * 0.95;
      state.doubleJumpAvailable = false;
      window.WonderSound?.play("click");
      createJumpDust(state.x + state.width / 2, state.y + state.height);
    }
  }

  function makePlayerAttack() {
    if (state.attackTimer > 0) return;
    state.attackTimer = 18; // Slash duration frames
    window.WonderSound?.play("shoot");

    // Attack collision sweeps forward
    const stats = getStats();
    const slashRange = 50;
    const slashWidth = 40;
    
    let ax = state.x + state.width;
    if (state.facing === "left") {
      ax = state.x - slashRange;
    }
    let ay = state.y - 5;

    state.enemies.forEach((enemy, idx) => {
      if (enemy.hp <= 0) return;

      // Check intersection with slash AABB
      if (
        ax + slashRange > enemy.x &&
        ax < enemy.x + enemy.width &&
        ay + slashWidth > enemy.y &&
        ay < enemy.y + enemy.height
      ) {
        // Critical hit check
        const isCrit = Math.random() < stats.crit;
        let finalDmg = stats.dmg;
        if (isCrit) finalDmg *= 1.5;

        enemy.hp -= finalDmg;
        createSlashSparks(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, isCrit);
        window.WonderSound?.play("hit");

        if (enemy.hp <= 0) {
          handleEnemyDefeated(enemy);
          state.enemies.splice(idx, 1);
        }
      }
    });
  }

  function makePlayerDash() {
    if (state.dashCooldown > 0) return;
    state.dashTimer = 15; // 15 frames dash duration
    state.dashCooldown = 60; // 1 second cooldown
    state.invincibilityTimer = 15;
    window.WonderSound?.play("click");
    createDashGhost(state.x, state.y);
  }

  function handleEnemyDefeated(enemy) {
    window.WonderSound?.play("enemyDown");
    
    // Spawn EXP orbs
    const value = enemy.isElite ? (enemy.type === "boss" ? 0 : 30) : 10;
    const count = enemy.isElite ? 8 : 2;
    for (let i = 0; i < count; i++) {
      state.orbs.push({
        x: enemy.x + Math.random() * enemy.width,
        y: enemy.y + Math.random() * enemy.height,
        vx: (Math.random() - 0.5) * 4,
        vy: -3 - Math.random() * 2,
        value: value,
      });
    }

    // Elite drops golden key
    if (enemy.isElite) {
      if (enemy.type === "boss") {
        // Boss defeated -> win expedition!
        endGame(true);
      } else {
        state.pickups.push({
          x: enemy.x + enemy.width / 2,
          y: enemy.y + enemy.height / 2,
          type: "key",
        });
      }
    }
  }

  // Level Up relic draft overlay
  function handleLevelUp() {
    state.level++;
    state.exp -= state.expNeed;
    state.expNeed = Math.floor(state.expNeed * 1.35);
    window.WonderSound?.play("success");

    // Pause physics
    state.gameActive = false;

    // Pick 3 relics
    const pool = ["relic_fang", "relic_fur", "relic_boots"];
    shuffle(pool);

    nodes.draftCards.innerHTML = "";
    pool.forEach((relicId) => {
      const cardEl = document.createElement("button");
      cardEl.className = "draft-item-btn";
      cardEl.type = "button";
      const iconHtml = assetImg(relicIconMap[relicId], t(relicId));

      cardEl.innerHTML = `
        <div class="draft-item-icon">${iconHtml}</div>
        <strong class="draft-item-name">${t(relicId)}</strong>
        <p class="draft-item-desc">${t(`${relicId}_desc`)}</p>
      `;

      cardEl.addEventListener("click", () => {
        applyRelic(relicId);
        nodes.draftPanel.classList.add("hidden");
        // Resume
        state.gameActive = true;
        renderStatsPanel();
        updateHUDText();
        state.gameLoopId = requestAnimationFrame(updateGameEngine);
      });

      nodes.draftCards.appendChild(cardEl);
    });

    nodes.draftPanel.classList.remove("hidden");
  }

  function applyRelic(relicId) {
    if (relicId === "relic_fang") {
      state.relicAtkCount++;
    } else if (relicId === "relic_fur") {
      state.relicHpCount++;
      const stats = getStats();
      state.playerHp = Math.min(stats.maxHp, state.playerHp + 5);
    } else if (relicId === "relic_boots") {
      state.relicJumpCount++;
    }
  }

  // Chest looting modal
  let currentLootItem = null;
  function triggerChestLoot() {
    state.gameActive = false;
    window.WonderSound?.play("upgrade");

    const rolls = {
      1: ["sword-rare", "armor-rare", "boots-rare"],
      2: ["dagger-epic", "armor-epic", "boots-epic"],
    };

    const choices = rolls[state.room] || rolls[1];
    const picked = choices[Math.floor(Math.random() * choices.length)];
    currentLootItem = picked;

    const g = gearDb[picked];
    nodes.lootIcon.innerHTML = assetImg(g.iconSrc, t(g.nameKey));
    nodes.lootName.textContent = t(g.nameKey);
    nodes.lootType.textContent = t(g.typeKey);
    nodes.lootEffect.textContent = t(g.effectKey);

    nodes.lootPanel.classList.remove("hidden");
  }

  function equipLoot() {
    const g = gearDb[currentLootItem];
    if (g.slot === "weapon") {
      state.eqWeapon = currentLootItem;
    } else if (g.slot === "armor") {
      const oldStats = getStats();
      state.eqArmor = currentLootItem;
      const newStats = getStats();
      state.playerHp += (newStats.maxHp - oldStats.maxHp);
    } else if (g.slot === "boots") {
      state.eqBoots = currentLootItem;
    }

    nodes.lootPanel.classList.add("hidden");
    window.WonderSound?.play("success");

    state.gameActive = true;
    renderStatsPanel();
    renderEquippedGear();
    updateHUDText();
    state.gameLoopId = requestAnimationFrame(updateGameEngine);
  }

  // Dungeons exit advance
  function enterNextRoom() {
    state.room++;
    state.keys = 0;
    
    // Partially heal wolf between rooms
    const stats = getStats();
    state.playerHp = Math.min(stats.maxHp, state.playerHp + 10);

    buildRoomGeometry();
    renderStatsPanel();
    updateHUDText();
    window.WonderSound?.play("start");
  }

  // End Expedition
  function endGame(won) {
    state.gameActive = false;
    cancelAnimationFrame(state.gameLoopId);

    nodes.gamePanel.classList.add("hidden");
    nodes.resultPanel.classList.remove("hidden");

    nodes.resultTitle.textContent = won ? t("runComplete") : t("runFailed");
    nodes.resultScore.textContent = won ? "3" : String(state.room - 1);

    const cleared = won ? 3 : (state.room - 1);
    let starsStr = "";
    if (cleared === 3) starsStr = "⭐⭐⭐⭐⭐";
    else if (cleared === 2) starsStr = "⭐⭐⭐";
    else if (cleared === 1) starsStr = "⭐";
    else starsStr = "☆";

    nodes.logicStars.textContent = starsStr;
    nodes.focusStars.textContent = starsStr;
    nodes.problemStars.textContent = starsStr;

    if (won) {
      nodes.resultText.textContent = t("report_win");
      nodes.skillReportText.textContent = t("report_win");
      window.WeightPlayWallet?.addDiamonds(8);
      window.WonderSound?.play("win");
    } else {
      nodes.resultText.textContent = t("report_partial", { room: state.room });
      nodes.skillReportText.textContent = t("report_partial", { room: state.room });
      window.WeightPlayWallet?.addDiamonds(state.room - 1);
      window.WonderSound?.play("wrong");
    }
  }

  // Physics Loop frame updates
  function updateGameEngine() {
    if (!state.gameActive) return;

    // Redundant input values checking
    const stats = getStats();
    let moveDir = 0;
    if (keysPressed["a"] || keysPressed["ArrowLeft"] || mobileInput.left) {
      moveDir = -1;
      state.facing = "left";
    }
    if (keysPressed["d"] || keysPressed["ArrowRight"] || mobileInput.right) {
      moveDir = 1;
      state.facing = "right";
    }

    // Apply Dash speed boost
    let curSpeed = stats.speed;
    if (state.dashTimer > 0) {
      state.dashTimer--;
      curSpeed = stats.speed * 2.2;
      moveDir = state.facing === "right" ? 1 : -1;
    }

    state.vx = moveDir * curSpeed;

    // Apply Gravity AABB physics
    const gravityForce = 0.45;
    state.vy += gravityForce;

    // Apply positions
    state.x += state.vx;
    state.y += state.vy;

    // Cooldown ticks
    if (state.dashCooldown > 0) state.dashCooldown--;
    if (state.attackTimer > 0) state.attackTimer--;
    if (state.invincibilityTimer > 0) state.invincibilityTimer--;

    // Keep borders check
    if (state.x < 0) state.x = 0;
    if (state.x > 800 - state.width) state.x = 800 - state.width;

    // Platform Collisions AABB Check
    state.grounded = false;
    platforms.forEach((plat) => {
      // Check collision
      if (
        state.x + state.width > plat.x &&
        state.x < plat.x + plat.w &&
        state.y + state.height >= plat.y &&
        state.y + state.height - state.vy <= plat.y + 10
      ) {
        state.y = plat.y - state.height;
        state.vy = 0;
        state.grounded = true;
        state.doubleJumpAvailable = true;
      }
    });

    // Spikes Collisions
    spikesList.forEach((spike) => {
      if (
        state.x + state.width > spike.x &&
        state.x < spike.x + spike.w &&
        state.y + state.height > spike.y
      ) {
        // Fall into spikes respawns with penalty!
        if (state.invincibilityTimer === 0) {
          state.playerHp -= 5;
          state.invincibilityTimer = 40;
          state.x = 80;
          state.y = 200;
          state.vx = 0;
          state.vy = 0;
          window.WonderSound?.play("wrong");
          renderStatsPanel();

          if (state.playerHp <= 0) {
            endGame(false);
            return;
          }
        }
      }
    });

    // Move & Shoot enemies
    state.enemies.forEach((enemy, index) => {
      // Wolf/Boar walks along platform bounds
      if (enemy.type === "wolf" || enemy.type === "boar") {
        enemy.x += enemy.speed * (enemy.bounds.dir || 1);
        if (enemy.x <= enemy.bounds.min) enemy.bounds.dir = 1;
        if (enemy.x + enemy.width >= enemy.bounds.max) enemy.bounds.dir = -1;

        // Player Contact Damage check
        if (
          state.x + state.width > enemy.x &&
          state.x < enemy.x + enemy.width &&
          state.y + state.height > enemy.y &&
          state.y < enemy.y + enemy.height
        ) {
          applyPlayerDamage(enemy.type === "boar" ? 0.25 : 0.15);
        }
      } else if (enemy.type === "bat") {
        // Shoots projectiles
        enemy.shootCooldown--;
        if (enemy.shootCooldown <= 0) {
          enemy.shootCooldown = 120 + Math.random() * 60; // 2-3s cooldown
          const angle = Math.atan2((state.y + state.height / 2) - enemy.y, (state.x + state.width / 2) - enemy.x);
          state.bullets.push({
            x: enemy.x + enemy.width / 2,
            y: enemy.y + enemy.height / 2,
            vx: Math.cos(angle) * 3.5,
            vy: Math.sin(angle) * 3.5,
            size: 5,
          });
        }
      } else if (enemy.type === "boss") {
        // Boss AI: Charge & Projectiles
        enemy.shootCooldown--;
        if (enemy.shootCooldown <= 0) {
          enemy.shootCooldown = 90 + Math.random() * 40;
          // Charge at player or shoot 3-way bullets
          if (Math.random() > 0.4) {
            enemy.dir = state.x < enemy.x ? -1 : 1;
            enemy.x += enemy.speed * 12 * enemy.dir;
            enemy.x = Math.max(20, Math.min(720, enemy.x));
            window.WonderSound?.play("shoot");
          } else {
            // Shoot bullets
            const baseAngle = Math.atan2((state.y + state.height / 2) - enemy.y, (state.x + state.width / 2) - enemy.x);
            for (let aOffset of [-0.3, 0, 0.3]) {
              state.bullets.push({
                x: enemy.x + enemy.width / 2,
                y: enemy.y + enemy.height / 2,
                vx: Math.cos(baseAngle + aOffset) * 4.5,
                vy: Math.sin(baseAngle + aOffset) * 4.5,
                size: 6,
              });
            }
          }
        }

        // Boss contact dmg
        if (
          state.x + state.width > enemy.x &&
          state.x < enemy.x + enemy.width &&
          state.y + state.height > enemy.y &&
          state.y < enemy.y + enemy.height
        ) {
          applyPlayerDamage(0.35);
        }
      }
    });

    // Move & Check enemy bullets
    state.bullets.forEach((bullet, index) => {
      bullet.x += bullet.vx;
      bullet.y += bullet.vy;

      // Contact player
      if (
        bullet.x > state.x &&
        bullet.x < state.x + state.width &&
        bullet.y > state.y &&
        bullet.y < state.y + state.height
      ) {
        state.bullets.splice(index, 1);
        applyPlayerDamage(5.0);
      }

      // Out of bounds
      if (bullet.x < -10 || bullet.x > 810 || bullet.y < -10 || bullet.y > 510) {
        state.bullets.splice(index, 1);
      }
    });

    // Move & Collect Relic Orbs
    state.orbs.forEach((orb, index) => {
      // Apply gravity to drop orbs
      orb.vy += 0.2;
      orb.x += orb.vx;
      orb.y += orb.vy;

      // Rest on platforms
      platforms.forEach((plat) => {
        if (
          orb.x > plat.x &&
          orb.x < plat.x + plat.w &&
          orb.y >= plat.y &&
          orb.y - orb.vy <= plat.y + 10
        ) {
          orb.y = plat.y - 2;
          orb.vx = 0;
          orb.vy = 0;
        }
      });

      // Magnet check
      const odx = (state.x + state.width / 2) - orb.x;
      const ody = (state.y + state.height / 2) - orb.y;
      const dist = Math.sqrt(odx * odx + ody * ody);

      if (dist < 100) {
        orb.x += (odx / dist) * 6;
        orb.y += (ody / dist) * 6;
      }

      if (dist < 20) {
        state.orbs.splice(index, 1);
        state.exp += orb.value;
        window.WonderSound?.play("coin");
        updateHUDText();

        if (state.exp >= state.expNeed) {
          handleLevelUp();
        }
      }
    });

    // Pickups Contact Check
    state.pickups.forEach((pickup, index) => {
      const pdx = (state.x + state.width / 2) - pickup.x;
      const pdy = (state.y + state.height / 2) - pickup.y;
      const dist = Math.sqrt(pdx * pdx + pdy * pdy);

      if (dist < 26) {
        if (pickup.type === "key") {
          state.pickups.splice(index, 1);
          state.keys++;
          window.WonderSound?.play("success");
          updateHUDText();

          // Spawn Chest and Portal
          state.pickups.push({ x: 620, y: state.room === 1 ? 290 : 210, type: "chest" });
          state.pickups.push({ x: 740, y: state.room === 1 ? 290 : 210, type: "portal" });
        } else if (pickup.type === "chest") {
          if (state.keys > 0) {
            state.keys--;
            state.pickups.splice(index, 1);
            updateHUDText();
            triggerChestLoot();
          }
        } else if (pickup.type === "portal") {
          state.pickups.splice(index, 1);
          enterNextRoom();
        }
      }
    });

    // Render Canvas Frame
    drawCanvasFrame();

    state.gameLoopId = requestAnimationFrame(updateGameEngine);
  }

  function applyPlayerDamage(amt) {
    if (state.invincibilityTimer > 0) return;
    state.playerHp = Math.max(0, state.playerHp - amt);
    renderStatsPanel();

    if (state.playerHp <= 0) {
      endGame(false);
    }
  }

  function drawImageContain(ctx, image, x, y, w, h, flip = false) {
    if (!image || !image.complete || !image.naturalWidth) return false;
    ctx.save();
    if (flip) {
      ctx.translate(x + w, y);
      ctx.scale(-1, 1);
      x = 0;
      y = 0;
    }
    const imageRatio = image.naturalWidth / image.naturalHeight;
    const boxRatio = w / h;
    let drawW = w;
    let drawH = h;
    if (imageRatio > boxRatio) {
      drawH = w / imageRatio;
    } else {
      drawW = h * imageRatio;
    }
    const drawX = x + (w - drawW) / 2;
    const drawY = y + (h - drawH) / 2;
    ctx.drawImage(image, drawX, drawY, drawW, drawH);
    ctx.restore();
    return true;
  }

  function drawTileCell(ctx, cellIndex, x, y, w, h) {
    if (!assets.tiles.complete || !assets.tiles.naturalWidth) return false;
    const cellW = assets.tiles.naturalWidth / 6;
    ctx.drawImage(assets.tiles, cellW * cellIndex, 0, cellW, assets.tiles.naturalHeight, x, y, w, h);
    return true;
  }

  function drawMossPlatform(ctx, plat) {
    if (drawTileCell(ctx, 0, plat.x, plat.y - 8, plat.w, plat.h + 8)) return;
    ctx.fillStyle = "#1e293b";
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 3;
    ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
    ctx.strokeRect(plat.x, plat.y, plat.w, plat.h);
  }

  // Draw 2D Canvas side-scroller elements
  function drawCanvasFrame() {
    const ctx = nodes.gameCanvas.getContext("2d");
    ctx.clearRect(0, 0, 800, 500);

    // 1. Background image
    if (assets.bg.complete) {
      ctx.drawImage(assets.bg, 0, 0, 800, 500);
    } else {
      ctx.fillStyle = "#0c1020";
      ctx.fillRect(0, 0, 800, 500);
    }

    // 2. Draw platforms
    platforms.forEach((plat) => {
      drawMossPlatform(ctx, plat);
    });

    // 3. Draw spike hazard triangles
    ctx.fillStyle = "#ef4444";
    spikesList.forEach((spike) => {
      const step = 20;
      const count = Math.ceil(spike.w / step);
      for (let i = 0; i < count; i++) {
        ctx.beginPath();
        ctx.moveTo(spike.x + i * step, spike.y + spike.h);
        ctx.lineTo(spike.x + (i + 0.5) * step, spike.y);
        ctx.lineTo(spike.x + (i + 1) * step, spike.y + spike.h);
        ctx.fill();
      }
    });

    // 4. Draw pickups (key, chest, portal)
    state.pickups.forEach((pickup) => {
      if (pickup.type === "key") {
        drawImageContain(ctx, assets.chestFx, pickup.x - 16, pickup.y - 16, 32, 32);
      } else if (pickup.type === "chest") {
        drawTileCell(ctx, 4, pickup.x - 24, pickup.y - 24, 48, 48);
      } else if (pickup.type === "portal") {
        drawTileCell(ctx, 3, pickup.x - 28, pickup.y - 28, 56, 56);
        drawImageContain(ctx, assets.portalFx, pickup.x - 30, pickup.y - 30, 60, 60);
      }
    });

    // 5. Draw experience crystals
    state.orbs.forEach((orb) => {
      if (assets.relicSpark.complete) {
        drawImageContain(ctx, assets.relicSpark, orb.x - 12, orb.y - 12, 24, 24);
      } else {
        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 6. Draw enemy projectiles
    state.bullets.forEach((bullet) => {
      drawImageContain(ctx, assets.projectileFx, bullet.x - bullet.size * 2, bullet.y - bullet.size * 2, bullet.size * 4, bullet.size * 4);
    });

    // 7. Draw enemies
    state.enemies.forEach((enemy) => {
      ctx.save();
      // Face direction logic
      if (enemy.bounds && enemy.bounds.dir === -1) {
        ctx.translate(enemy.x + enemy.width, enemy.y);
        ctx.scale(-1, 1);
      } else {
        ctx.translate(enemy.x, enemy.y);
      }

      if (enemy.type === "boss") {
        drawImageContain(ctx, assets.boss, 0, -34, enemy.width, enemy.height + 34);
      } else {
        const sprite = enemy.type === "boar" ? assets.boar : enemy.type === "wolf" ? assets.enemyWolf : assets.bat;
        if (sprite.complete) {
          drawImageContain(ctx, sprite, 0, -enemy.height * 0.2, enemy.width, enemy.height * 1.35);
        } else {
          ctx.fillStyle = enemy.type === "boar" ? "#64748b" : "#475569";
          ctx.fillRect(0, 0, enemy.width, enemy.height);
        }
      }
      ctx.restore();

      // Enemy HP Bar
      if (enemy.hp < enemy.maxHp) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(enemy.x, enemy.y - 10, enemy.width, 4);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(enemy.x, enemy.y - 10, (enemy.hp / enemy.maxHp) * enemy.width, 4);
      }
    });

    // 8. Draw shadow wolf explorer hero
    ctx.save();
    if (state.facing === "left") {
      ctx.translate(state.x + state.width, state.y);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(state.x, state.y);
    }

    if (assets.wolf.complete) {
      // Render flashing hit texture
      if (state.invincibilityTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
        ctx.globalAlpha = 0.4;
      }
      drawImageContain(ctx, assets.wolf, 0, -state.height * 0.45, state.width, state.height * 1.55);
      ctx.globalAlpha = 1.0;
    } else {
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(0, 0, state.width, state.height);
    }

    ctx.restore();

    // 9. Draw Slash Swipe overlay
    if (state.attackTimer > 0) {
      let ax = state.x + state.width + 10;
      if (state.facing === "left") {
        ax = state.x - 30;
      }
      drawImageContain(ctx, assets.clawFx, ax - 24, state.y + state.height / 2 - 24, 48, 48, state.facing === "left");
    }

    // 10. Update & Draw sparks particles
    updateSparksParticles(ctx);
  }

  // Visual effects
  let sparksList = [];
  function createSlashSparks(x, y, isCrit) {
    const color = isCrit ? "#facc15" : "#22d3ee";
    const count = isCrit ? 12 : 6;
    for (let i = 0; i < count; i++) {
      sparksList.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 20,
        color: color,
      });
    }
  }

  function createJumpDust(x, y) {
    for (let i = 0; i < 4; i++) {
      sparksList.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 2,
        vy: -0.5 - Math.random(),
        life: 15,
        color: "#ffffff33",
      });
    }
  }

  function createDashGhost(x, y) {
    for (let i = 0; i < 3; i++) {
      sparksList.push({
        x: x + i * 10 * (state.facing === "right" ? -1 : 1),
        y: y,
        vx: 0,
        vy: 0,
        life: 10,
        color: "#06b6d444",
      });
    }
  }

  function updateSparksParticles(ctx) {
    sparksList.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 3, 3);

      if (p.life <= 0) {
        sparksList.splice(index, 1);
      }
    });
  }

  // Registers keyboard input steer
  function setupInputs() {
    window.addEventListener("keydown", (e) => {
      keysPressed[e.key.toLowerCase()] = true;
      if (e.key === " " || e.key.toLowerCase() === "w" || e.key === "ArrowUp") {
        makePlayerJump();
      }
      if (e.key.toLowerCase() === "j") {
        makePlayerAttack();
      }
      if (e.key.toLowerCase() === "k" || e.key === "Shift") {
        makePlayerDash();
      }
    });

    window.addEventListener("keyup", (e) => {
      keysPressed[e.key.toLowerCase()] = false;
    });

    // Mobile buttons triggers
    nodes.btnLeft.addEventListener("touchstart", (e) => { e.preventDefault(); mobileInput.left = true; });
    nodes.btnLeft.addEventListener("touchend", () => { mobileInput.left = false; });
    nodes.btnRight.addEventListener("touchstart", (e) => { e.preventDefault(); mobileInput.right = true; });
    nodes.btnRight.addEventListener("touchend", () => { mobileInput.right = false; });
    
    nodes.btnJump.addEventListener("touchstart", (e) => {
      e.preventDefault();
      makePlayerJump();
    });
    nodes.btnAttack.addEventListener("touchstart", (e) => {
      e.preventDefault();
      makePlayerAttack();
    });
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Init page triggers
  function init() {
    loadLocalState();
    updateDiamondShopUI();
    translateUI();
    setupInputs();

    nodes.startBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      startRun();
    });

    nodes.retryBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      startRun();
    });

    nodes.menuBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      state.gameActive = false;
      cancelAnimationFrame(state.gameLoopId);
      nodes.gamePanel.classList.add("hidden");
      nodes.menuPanel.classList.remove("hidden");
      updateDiamondShopUI();
    });

    nodes.resultMenuBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      nodes.resultPanel.classList.add("hidden");
      nodes.menuPanel.classList.remove("hidden");
      updateDiamondShopUI();
    });

    nodes.localeSelect.addEventListener("change", (e) => {
      window.WonderSound?.play("click");
      window.WonderI18n?.setLocale?.(e.target.value);
    });

    nodes.equipLootBtn.addEventListener("click", () => {
      equipLoot();
    });

    nodes.amuletBtn.addEventListener("click", () => {
      const wallet = window.WeightPlayWallet?.read() || { diamonds: 0 };
      if (wallet.diamonds >= amuletCost) {
        const spent = window.WeightPlayWallet?.spendDiamonds(amuletCost);
        if (spent) {
          state.amuletUnlocked = true;
          saveLocalState();
          window.WonderSound?.play("success");
          updateDiamondShopUI();
        }
      }
    });

    window.addEventListener("wonder:locale-change", () => {
      translateUI();
      updateHUDText();
      renderStatsPanel();
    });

    // Faked Loading screen loop
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 25) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        nodes.loadingPanel.style.display = "none";
      }
      nodes.loadingText.textContent = `${progress}%`;
      nodes.loadingFill.style.width = `${progress}%`;
    }, 60);
  }

  function exposeInternalTestHarness() {
    if (!document.querySelector("[data-internal-shadow-wolf-test='true']")) return;

    window.__ShadowWolfInternalTest = {
      readState() {
        const stats = getStats();
        return {
          locale: getLocale(),
          active: state.gameActive,
          room: state.room,
          level: state.level,
          hpText: nodes.hpText.textContent,
          hp: Math.ceil(state.playerHp),
          maxHp: stats.maxHp,
          keys: state.keys,
          enemies: state.enemies.map((enemy) => ({ type: enemy.type, hp: Math.ceil(enemy.hp), x: Math.round(enemy.x), y: Math.round(enemy.y) })),
          equipment: {
            weapon: state.eqWeapon,
            armor: state.eqArmor,
            boots: state.eqBoots,
          },
          panels: {
            menu: !nodes.menuPanel.classList.contains("hidden"),
            game: !nodes.gamePanel.classList.contains("hidden"),
            draft: !nodes.draftPanel.classList.contains("hidden"),
            loot: !nodes.lootPanel.classList.contains("hidden"),
            result: !nodes.resultPanel.classList.contains("hidden"),
          },
        };
      },
      readAssets() {
        return Object.fromEntries(
          Object.entries(assets).map(([key, image]) => [
            key,
            {
              src: image.currentSrc || image.src,
              loaded: Boolean(image.complete && image.naturalWidth),
              width: image.naturalWidth || 0,
              height: image.naturalHeight || 0,
            },
          ])
        );
      },
      startRun() {
        startRun();
        return this.readState();
      },
      forceLevelUp() {
        handleLevelUp();
        return this.readState();
      },
      forceLoot(itemId = "sword-rare") {
        currentLootItem = gearDb[itemId] ? itemId : "sword-rare";
        const g = gearDb[currentLootItem];
        state.gameActive = false;
        nodes.lootIcon.innerHTML = assetImg(g.iconSrc, t(g.nameKey));
        nodes.lootName.textContent = t(g.nameKey);
        nodes.lootType.textContent = t(g.typeKey);
        nodes.lootEffect.textContent = t(g.effectKey);
        nodes.lootPanel.classList.remove("hidden");
        return this.readState();
      },
      forceWin() {
        endGame(true);
        return this.readState();
      },
      forceFail() {
        endGame(false);
        return this.readState();
      },
    };
  }

  window.addEventListener("DOMContentLoaded", exposeInternalTestHarness);
  window.addEventListener("DOMContentLoaded", init);
})();
