(() => {
  const GAME_ID = "animal-relic-hunters";
  const saveKey = "weightplay_relic_hunters_v1";
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
    joystickContainer: $("joystickContainer"),
    joystickKnob: $("joystickKnob"),
    eqWeaponName: $("eqWeaponName"),
    eqWeaponEffect: $("eqWeaponEffect"),
    eqArmorName: $("eqArmorName"),
    eqArmorEffect: $("eqArmorEffect"),
    eqBootsName: $("eqBootsName"),
    eqBootsEffect: $("eqBootsEffect"),
    statDmg: $("statDmg"),
    statRate: $("statRate"),
    statSpeed: $("statSpeed"),
    statMagnet: $("statMagnet"),
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
      title: "Animal Relic Hunters",
      menuTitle: "Explore the Ancient Ruins.",
      menuHint: "Move with WASD / virtual joystick. Defeat shadow beasts, collect Relic Orbs to level up, and find keys to unlock chests for Weapons, Armor, and Boots.",
      prototypeGoalsTitle: "Prototype test goals",
      prototypeGoalsText: "Clear Room 3, fight the Behemoth Boss, collect Relic Orbs, and verify the Equipment slots and Diamond upgrades work properly.",
      diamondShopTitle: "Permanent Upgrade",
      amuletName: "Mist Amulet",
      amuletEffect: "Start every run with +10 Max HP (40 HP instead of 30 HP).",
      amuletOwned: "Owned: every run starts with 40 Max HP.",
      startRun: "Start Expedition",
      menu: "Menu",
      hudHp: "Player HP",
      roomLabel: "Room",
      keysLabel: "Keys",
      chooseCard: "Choose a Relic Upgrade",
      chooseCardDesc: "Select one of these ancient relics to empower your explorer.",
      lootFound: "Relic Chest Unlocked!",
      equipLoot: "Equip Gear",
      tryAgain: "Try Again",
      backToMenu: "Back to Menu",
      sidebarInventory: "Equipped Gear",
      sidebarStats: "Character Stats",
      slotWeapon: "WEAPON",
      slotArmor: "ARMOR",
      slotBoots: "BOOTS",
      noneLabel: "None",
      statDamage: "Damage:",
      statAttackRate: "Attack Rate:",
      statSpeed: "Speed:",
      statMagnetRange: "Magnet Range:",
      runComplete: "Expedition Success!",
      runFailed: "Explorer Defeated",
      resultDisclaimer: "For fun and local progress tracking only.",
      skillReportTitle: "Ability Analysis Report",
      skillLogic: "Logic",
      skillFocus: "Focus",
      skillProblem: "Problem Solving",

      // Relic Upgrades
      relic_magnet: "Relic Magnet",
      relic_magnet_desc: "Increase collection magnet range by 40px.",
      relic_speed: "Lantern Burst",
      relic_speed_desc: "Decrease bullet firing interval by 20%.",
      relic_shield: "Shield Heart",
      relic_shield_desc: "Increase Max HP by 5 and heal 5 HP.",

      // Equipment Drops
      gear_sword_rare: "Crystal Sword",
      gear_sword_rare_desc: "+30% Bullet Damage",
      gear_dagger_epic: "Relic Dagger",
      gear_dagger_epic_desc: "-30% Shoot Interval",
      gear_armor_rare: "Ruin Chestplate",
      gear_armor_rare_desc: "+10 Max HP",
      gear_armor_epic: "Golden Relic Mail",
      gear_armor_epic_desc: "+20 Max HP",
      gear_boots_rare: "Explorer Boots",
      gear_boots_rare_desc: "+20% Move Speed",
      gear_boots_epic: "Hermes Sandals",
      gear_boots_epic_desc: "+40% Move Speed",

      // Gear Slot Rarity Label
      rarity_rare: "Rare Gear",
      rarity_epic: "Epic Gear",

      // Reports
      report_win: "Legendary hunter! You defeated the Behemoth, equipped rare relics, and solved the ruin mysteries.",
      report_partial: "Decent explorer! You reached Room {room}. Level up and equip stronger gear to beat the Behemoth.",
      report_no_wins: "Keep exploring! Focus on picking up keys and keeping your health up."
    },
    "zh-Hant": {
      title: "動物遺跡獵人",
      menuTitle: "探索古代遺跡。",
      menuHint: "使用 WASD 或虛擬搖桿移動。擊敗怪物，收集能量球升級，並獲得鑰匙以解鎖寶箱獲得武器、防具與鞋子。",
      prototypeGoalsTitle: "原型測試目標",
      prototypeGoalsText: "通關第 3 關並擊敗遺跡巨獸 Boss，收集遺跡能量球，驗證裝備槽與鑽石商店運作正常。",
      diamondShopTitle: "永久升級",
      amuletName: "迷霧護符",
      amuletEffect: "每局挑戰開始時 +10 最大生命值 (以 40 HP 開局，原為 30 HP)。",
      amuletOwned: "已擁有：以 40 Max HP 開局。",
      startRun: "開始探險",
      menu: "選單",
      hudHp: "角色生命",
      roomLabel: "房間",
      keysLabel: "鑰匙",
      chooseCard: "選擇遺跡能力",
      chooseCardDesc: "選擇古代遺跡之力以強化你的探險家能力。",
      lootFound: "解鎖遺跡寶箱！",
      equipLoot: "裝備道具",
      tryAgain: "再試一次",
      backToMenu: "回到主選單",
      sidebarInventory: "已穿戴裝備",
      sidebarStats: "角色屬性",
      slotWeapon: "武器槽",
      slotArmor: "防具槽",
      slotBoots: "鞋子槽",
      noneLabel: "無",
      statDamage: "傷害：",
      statAttackRate: "攻擊速率：",
      statSpeed: "移動速度：",
      statMagnetRange: "吸取範圍：",
      runComplete: "遺跡通關成功！",
      runFailed: "探險家倒下了",
      resultDisclaimer: "能力評估僅供趣味與本機進度追蹤。",
      skillReportTitle: "能力分析報告",
      skillLogic: "邏輯力",
      skillFocus: "專注力",
      skillProblem: "問題解決",

      // Relics Upgrades
      relic_magnet: "遺跡磁鐵",
      relic_magnet_desc: "能量球拾取吸引範圍增加 40 像素。",
      relic_speed: "燈籠射擊",
      relic_speed_desc: "武器自動射擊的冷卻間隔縮短 20%。",
      relic_shield: "護盾心靈",
      relic_shield_desc: "最大生命值增加 5 點，並恢復 5 點生命值。",

      // Equipment Drops
      gear_sword_rare: "晶體神劍",
      gear_sword_rare_desc: "+30% 子彈傷害",
      gear_dagger_epic: "遺跡匕首",
      gear_dagger_epic_desc: "-30% 射擊間隔",
      gear_armor_rare: "遺跡胸甲",
      gear_armor_rare_desc: "+10 最大生命值",
      gear_armor_epic: "金輝遺跡甲",
      gear_armor_epic_desc: "+20 最大生命值",
      gear_boots_rare: "探險長靴",
      gear_boots_rare_desc: "+20% 移動速度",
      gear_boots_epic: "赫密斯飛鞋",
      gear_boots_epic_desc: "+40% 移動速度",

      // Gear Slot Rarity Label
      rarity_rare: "稀有裝備",
      rarity_epic: "史詩裝備",

      // Reports
      report_win: "傳奇獵人！你擊敗了遺跡巨獸，穿上了頂級裝備，成功解開遺跡核心奧秘。",
      report_partial: "優秀的探險！你成功深入到第 {room} 間遺跡。多收集裝備與遺物以擊敗巨獸。",
      report_no_wins: "繼續加油！多收集鑰匙開啟寶箱，並維持好血量安全。"
    }
  };

  // Textures and Sprites
  const assets = {
    bg: new Image(),
    hero: new Image(),
    jaguar: new Image(),
    boar: new Image(),
    orb: new Image(),
    key: new Image(),
  };
  assets.bg.src = "../../assets/animal-relic-hunters-ruin-room.png";
  assets.hero.src = "../../assets/animal-relic-hunters-lion-explorer.png";
  assets.jaguar.src = "../../assets/animal-relic-hunters-shadow-jaguar.png";
  assets.boar.src = "../../assets/animal-relic-hunters-stone-boar.png";
  assets.orb.src = "../../assets/animal-relic-hunters-relic-orb.png";
  assets.key.src = "../../assets/animal-relic-hunters-golden-relic-key.png";

  const uiAssets = {
    attack: "../../assets/animal-relic-hunters-skill-attack-crystal.webp",
    rate: "../../assets/animal-relic-hunters-skill-lantern-burst.webp",
    shield: "../../assets/animal-relic-hunters-skill-shield-heart.webp",
    boots: "../../assets/animal-relic-hunters-skill-movement-boots.webp",
    magnet: "../../assets/animal-relic-hunters-skill-relic-magnet.webp",
  };

  const gearDb = {
    "sword-rare": { slot: "weapon", nameKey: "gear_sword_rare", typeKey: "rarity_rare", effectKey: "gear_sword_rare_desc", iconSrc: uiAssets.attack, bonusDmg: 3, bonusRate: 0 },
    "dagger-epic": { slot: "weapon", nameKey: "gear_dagger_epic", typeKey: "rarity_epic", effectKey: "gear_dagger_epic_desc", iconSrc: uiAssets.rate, bonusDmg: 0, bonusRate: 0.3 },
    "armor-rare": { slot: "armor", nameKey: "gear_armor_rare", typeKey: "rarity_rare", effectKey: "gear_armor_rare_desc", iconSrc: uiAssets.shield, bonusHp: 10 },
    "armor-epic": { slot: "armor", nameKey: "gear_armor_epic", typeKey: "rarity_epic", effectKey: "gear_armor_epic_desc", iconSrc: uiAssets.shield, bonusHp: 20 },
    "boots-rare": { slot: "boots", nameKey: "gear_boots_rare", typeKey: "rarity_rare", effectKey: "gear_boots_rare_desc", iconSrc: uiAssets.boots, bonusSpeed: 0.6 },
    "boots-epic": { slot: "boots", nameKey: "gear_boots_epic", typeKey: "rarity_epic", effectKey: "gear_boots_epic_desc", iconSrc: uiAssets.boots, bonusSpeed: 1.2 },
  };

  // State Variables
  let state = {
    amuletUnlocked: false,
    playerMaxHp: 30,
    playerHp: 30,
    playerX: 400,
    playerY: 250,
    playerSpeed: 3.0,
    playerAngle: 0,
    level: 1,
    exp: 0,
    expNeed: 100,
    room: 1,
    keys: 0,
    gameActive: false,
    gameLoopId: null,

    // Stats
    baseDamage: 10,
    baseRate: 1.2, // seconds
    baseMagnet: 80, // pixels

    // Relic Buffs
    relicMagnetCount: 0,
    relicRateCount: 0,
    relicHpCount: 0,

    // Equip slots
    eqWeapon: null,
    eqArmor: null,
    eqBoots: null,

    // Entities
    enemies: [],
    bullets: [],
    orbs: [],
    pickups: [], // keys, chests, portals
    particleSystems: [],
  };

  // Keyboard Movement Vector
  let keysPressed = {};
  let touchStartPos = null;
  let moveVector = { x: 0, y: 0 };
  let shootTimer = 0;

  // Safe read/write LocalStorage
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

  // Calculate stats based on relics and equipped gear
  function getStats() {
    let dmg = state.baseDamage;
    let rate = state.baseRate;
    let speed = state.playerSpeed;
    let magnet = state.baseMagnet;

    // Apply Gear Weapon
    if (state.eqWeapon) {
      const g = gearDb[state.eqWeapon];
      if (g.bonusDmg) dmg += g.bonusDmg;
      if (g.bonusRate) rate *= (1 - g.bonusRate);
    }
    // Apply Relics Firing Rate
    if (state.relicRateCount > 0) {
      rate *= Math.pow(0.8, state.relicRateCount);
    }

    // Apply Gear Armor
    let maxHp = (state.amuletUnlocked ? 40 : 30) + (state.relicHpCount * 5);
    if (state.eqArmor) {
      const g = gearDb[state.eqArmor];
      if (g.bonusHp) maxHp += g.bonusHp;
    }

    // Apply Gear Boots
    if (state.eqBoots) {
      const g = gearDb[state.eqBoots];
      if (g.bonusSpeed) speed += g.bonusSpeed;
    }

    // Apply Relic Magnet
    if (state.relicMagnetCount > 0) {
      magnet += state.relicMagnetCount * 40;
    }

    return { dmg, rate, speed, magnet, maxHp };
  }

  function renderStatsPanel() {
    const stats = getStats();
    nodes.statDmg.textContent = stats.dmg.toFixed(0);
    nodes.statRate.textContent = `${stats.rate.toFixed(2)}s`;
    nodes.statSpeed.textContent = stats.speed.toFixed(1);
    nodes.statMagnet.textContent = `${stats.magnet}px`;

    nodes.hpText.textContent = `${state.playerHp}/${stats.maxHp}`;
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
      nodes.eqWeaponName.textContent = t("noneLabel");
      nodes.eqWeaponEffect.style.display = "none";
    }

    // Armor
    if (state.eqArmor) {
      const g = gearDb[state.eqArmor];
      nodes.eqArmorName.textContent = t(g.nameKey);
      nodes.eqArmorEffect.textContent = t(g.effectKey);
      nodes.eqArmorEffect.style.display = "inline-block";
    } else {
      nodes.eqArmorName.textContent = t("noneLabel");
      nodes.eqArmorEffect.style.display = "none";
    }

    // Boots
    if (state.eqBoots) {
      const g = gearDb[state.eqBoots];
      nodes.eqBootsName.textContent = t(g.nameKey);
      nodes.eqBootsEffect.textContent = t(g.effectKey);
      nodes.eqBootsEffect.style.display = "inline-block";
    } else {
      nodes.eqBootsName.textContent = t("noneLabel");
      nodes.eqBootsEffect.style.display = "none";
    }
  }

  // Combat loop updates
  function startRun() {
    loadLocalState();
    const stats = getStats();
    state.playerMaxHp = stats.maxHp;
    state.playerHp = state.playerMaxHp;
    state.playerX = 400;
    state.playerY = 250;
    state.level = 1;
    state.exp = 0;
    state.expNeed = 100;
    state.room = 1;
    state.keys = 0;

    // Reset slots/relics
    state.eqWeapon = null;
    state.eqArmor = null;
    state.eqBoots = null;
    state.relicMagnetCount = 0;
    state.relicRateCount = 0;
    state.relicHpCount = 0;

    state.enemies = [];
    state.bullets = [];
    state.orbs = [];
    state.pickups = [];
    state.particleSystems = [];

    // Wave spawning trigger
    spawnRoomEntities();

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

  function spawnRoomEntities() {
    state.enemies = [];
    state.bullets = [];
    state.orbs = [];
    state.pickups = [];

    const room = state.room;
    // Spawn basic enemies around borders
    const enemyCount = 8 + room * 4;
    for (let i = 0; i < enemyCount; i++) {
      const side = Math.floor(Math.random() * 4);
      let ex = 0, ey = 0;
      if (side === 0) { ex = Math.random() * 800; ey = -40; }
      else if (side === 1) { ex = 840; ey = Math.random() * 500; }
      else if (side === 2) { ex = Math.random() * 800; ey = 540; }
      else { ex = -40; ey = Math.random() * 500; }

      const isBoar = room > 1 && Math.random() > 0.4;
      state.enemies.push({
        x: ex,
        y: ey,
        type: isBoar ? "boar" : "jaguar",
        hp: isBoar ? 25 + room * 10 : 12 + room * 5,
        maxHp: isBoar ? 25 + room * 10 : 12 + room * 5,
        speed: isBoar ? 1.0 : 2.0,
        isElite: false,
        size: isBoar ? 24 : 20,
      });
    }

    // Spawn 1 Elite enemy in the center to drop the key
    setTimeout(() => {
      if (!state.gameActive) return;
      state.enemies.push({
        x: 400,
        y: -50,
        type: room === 3 ? "boss" : "boar",
        hp: room === 3 ? 400 : 80 + room * 40,
        maxHp: room === 3 ? 400 : 80 + room * 40,
        speed: room === 3 ? 1.2 : 1.5,
        isElite: true,
        size: room === 3 ? 45 : 32,
      });
    }, 4000);
  }

  function updateHUDText() {
    nodes.roomText.textContent = `${state.room}/3`;
    nodes.keyText.textContent = state.keys;
    nodes.levelVal.textContent = state.level;
    nodes.expText.textContent = `${state.exp}/${state.expNeed}`;
    nodes.expFill.style.width = `${(state.exp / state.expNeed) * 100}%`;
  }

  // Firing function
  function fireBullet() {
    if (state.enemies.length === 0) return;

    // Find nearest enemy
    let nearest = null;
    let minDist = Infinity;
    state.enemies.forEach((enemy) => {
      const dx = enemy.x - state.playerX;
      const dy = enemy.y - state.playerY;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < minDist) {
        minDist = d;
        nearest = enemy;
      }
    });

    if (!nearest) return;

    const angle = Math.atan2(nearest.y - state.playerY, nearest.x - state.playerX);
    state.playerAngle = angle;

    const stats = getStats();
    state.bullets.push({
      x: state.playerX,
      y: state.playerY,
      vx: Math.cos(angle) * 7.5,
      vy: Math.sin(angle) * 7.5,
      dmg: stats.dmg,
      size: 6,
    });
    window.WonderSound?.play("shoot");
  }

  // Exp/Level up draft Relic selection
  let currentDraftChoices = [];
  function handleLevelUp() {
    state.level++;
    state.exp -= state.expNeed;
    state.expNeed = Math.floor(state.expNeed * 1.3);
    window.WonderSound?.play("success");

    // Pause game loop
    state.gameActive = false;

    // Choose 3 random relics
    const pool = ["relic_magnet", "relic_speed", "relic_shield"];
    shuffle(pool);

    nodes.draftCards.innerHTML = "";
    pool.forEach((relicId) => {
      const cardEl = document.createElement("button");
      cardEl.className = "draft-item-btn";
      cardEl.type = "button";
      
      let iconSrc = uiAssets.magnet;
      if (relicId === "relic_speed") iconSrc = uiAssets.rate;
      else if (relicId === "relic_shield") iconSrc = uiAssets.shield;

      cardEl.innerHTML = `
        <div class="draft-item-icon"><img src="${iconSrc}" alt="" aria-hidden="true"></div>
        <strong class="draft-item-name">${t(relicId)}</strong>
        <p class="draft-item-desc">${t(`${relicId}_desc`)}</p>
      `;

      cardEl.addEventListener("click", () => {
        applyRelic(relicId);
        nodes.draftPanel.classList.add("hidden");
        // Resume game loop
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
    if (relicId === "relic_magnet") {
      state.relicMagnetCount++;
    } else if (relicId === "relic_speed") {
      state.relicRateCount++;
    } else if (relicId === "relic_shield") {
      state.relicHpCount++;
      const stats = getStats();
      state.playerHp = Math.min(stats.maxHp, state.playerHp + 5);
    }
  }

  // Chest Drop Looting Equip
  let currentLootItem = null;
  function triggerChestLoot() {
    state.gameActive = false;
    window.WonderSound?.play("upgrade");

    // Random roll gear based on current room
    const rolls = {
      1: ["sword-rare", "armor-rare", "boots-rare"],
      2: ["sword-rare", "armor-rare", "boots-rare", "dagger-epic", "armor-epic", "boots-epic"],
      3: ["dagger-epic", "armor-epic", "boots-epic"],
    };

    const choices = rolls[state.room] || rolls[1];
    const pickedKey = choices[Math.floor(Math.random() * choices.length)];
    currentLootItem = pickedKey;

    const g = gearDb[pickedKey];
    nodes.lootIcon.innerHTML = `<img src="${g.iconSrc}" alt="" aria-hidden="true">`;
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
      // Recalculate maxHp differences
      const oldStats = getStats();
      state.eqArmor = currentLootItem;
      const newStats = getStats();
      state.playerHp += (newStats.maxHp - oldStats.maxHp);
    } else if (g.slot === "boots") {
      state.eqBoots = currentLootItem;
    }

    nodes.lootPanel.classList.add("hidden");
    window.WonderSound?.play("success");

    // Resume loop
    state.gameActive = true;
    renderStatsPanel();
    renderEquippedGear();
    updateHUDText();
    state.gameLoopId = requestAnimationFrame(updateGameEngine);
  }

  // Complete Game Run
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

  // Portal Next Stage portal trigger
  function enterNextRoom() {
    state.room++;
    state.keys = 0;
    state.playerX = 100;
    state.playerY = 250;
    
    // Heal player slightly between rooms
    const stats = getStats();
    state.playerHp = Math.min(stats.maxHp, state.playerHp + 10);

    spawnRoomEntities();
    renderStatsPanel();
    updateHUDText();
    window.WonderSound?.play("start");
  }

  // Shuffling
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Update Game Physics & Canvas rendering
  function updateGameEngine() {
    if (!state.gameActive) return;

    // 1. Move Player
    const stats = getStats();
    let moveX = 0;
    let moveY = 0;

    if (keysPressed["w"] || keysPressed["ArrowUp"]) moveY = -1;
    if (keysPressed["s"] || keysPressed["ArrowDown"]) moveY = 1;
    if (keysPressed["a"] || keysPressed["ArrowLeft"]) moveX = -1;
    if (keysPressed["d"] || keysPressed["ArrowRight"]) moveX = 1;

    // Apply joystick vector if present
    if (moveVector.x !== 0 || moveVector.y !== 0) {
      moveX = moveVector.x;
      moveY = moveVector.y;
    }

    if (moveX !== 0 || moveY !== 0) {
      const angle = Math.atan2(moveY, moveX);
      state.playerX += Math.cos(angle) * stats.speed;
      state.playerY += Math.sin(angle) * stats.speed;
      state.playerAngle = angle;

      // Keep boundaries
      state.playerX = Math.max(20, Math.min(780, state.playerX));
      state.playerY = Math.max(20, Math.min(480, state.playerY));
    }

    // 2. Automated Weapon Firing Timer
    shootTimer += 1 / 60;
    if (shootTimer >= stats.rate) {
      shootTimer = 0;
      fireBullet();
    }

    // 3. Move & Check Bullets
    state.bullets.forEach((bullet, index) => {
      bullet.x += bullet.vx;
      bullet.y += bullet.vy;

      // Out of bounds remove
      if (bullet.x < -10 || bullet.x > 810 || bullet.y < -10 || bullet.y > 510) {
        state.bullets.splice(index, 1);
      }
    });

    // 4. Move & Check Enemies
    state.enemies.forEach((enemy, eIndex) => {
      // Pathfind to player
      const dx = state.playerX - enemy.x;
      const dy = state.playerY - enemy.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 10) {
        enemy.x += (dx / dist) * enemy.speed;
        enemy.y += (dy / dist) * enemy.speed;
      }

      // Check player contact damage
      if (dist < enemy.size + 15) {
        state.playerHp = Math.max(0, state.playerHp - 0.15); // continuous contact dmg
        renderStatsPanel();
        if (state.playerHp <= 0) {
          endGame(false);
          return;
        }
      }

      // Bullet collision check
      state.bullets.forEach((bullet, bIndex) => {
        const bdx = bullet.x - enemy.x;
        const bdy = bullet.y - enemy.y;
        const bdist = Math.sqrt(bdx * bdx + bdy * bdy);

        if (bdist < enemy.size + bullet.size) {
          enemy.hp -= bullet.dmg;
          state.bullets.splice(bIndex, 1);

          // Spark particle system
          createDamageSparks(bullet.x, bullet.y);

          // Enemy Defeated
          if (enemy.hp <= 0) {
            state.enemies.splice(eIndex, 1);
            window.WonderSound?.play("enemyDown");

            // Drop Relic Orbs
            const orbCount = enemy.isElite ? 10 : 3;
            for (let k = 0; k < orbCount; k++) {
              state.orbs.push({
                x: enemy.x + (Math.random() * 20 - 10),
                y: enemy.y + (Math.random() * 20 - 10),
                value: enemy.isElite ? 20 : 10,
              });
            }

            // Drop key if Elite
            if (enemy.isElite) {
              if (state.room === 3) {
                // Boss defeated -> clear game!
                endGame(true);
              } else {
                state.pickups.push({
                  x: enemy.x,
                  y: enemy.y,
                  type: "key",
                });
              }
            }
          }
        }
      });
    });

    // 5. Relic Orbs Magnet Collection Check
    state.orbs.forEach((orb, oIndex) => {
      const odx = state.playerX - orb.x;
      const ody = state.playerY - orb.y;
      const odist = Math.sqrt(odx * odx + ody * ody);

      if (odist < stats.magnet) {
        // Move towards player
        orb.x += (odx / odist) * 5;
        orb.y += (ody / odist) * 5;
      }

      if (odist < 20) {
        state.orbs.splice(oIndex, 1);
        state.exp += orb.value;
        window.WonderSound?.play("coin");
        updateHUDText();

        if (state.exp >= state.expNeed) {
          handleLevelUp();
        }
      }
    });

    // 6. Check keys and Chest/Portal Pickups
    state.pickups.forEach((pickup, pIndex) => {
      const pdx = state.playerX - pickup.x;
      const pdy = state.playerY - pickup.y;
      const pdist = Math.sqrt(pdx * pdx + pdy * pdy);

      if (pdist < 30) {
        if (pickup.type === "key") {
          state.pickups.splice(pIndex, 1);
          state.keys++;
          window.WonderSound?.play("success");
          updateHUDText();

          // Spawn Chest and Portal
          state.pickups.push({ x: 300, y: 250, type: "chest" });
          state.pickups.push({ x: 500, y: 250, type: "portal" });
        } else if (pickup.type === "chest") {
          if (state.keys > 0) {
            state.keys--;
            state.pickups.splice(pIndex, 1);
            updateHUDText();
            triggerChestLoot();
          }
        } else if (pickup.type === "portal") {
          state.pickups.splice(pIndex, 1);
          enterNextRoom();
        }
      }
    });

    // Draw frame canvas
    drawCanvasFrame();

    state.gameLoopId = requestAnimationFrame(updateGameEngine);
  }

  // Draw Arena textures
  function drawCanvasFrame() {
    const ctx = nodes.gameCanvas.getContext("2d");
    ctx.clearRect(0, 0, 800, 500);

    // 1. Ruin Room background
    if (assets.bg.complete) {
      ctx.drawImage(assets.bg, 0, 0, 800, 500);
    } else {
      ctx.fillStyle = "#111827";
      ctx.fillRect(0, 0, 800, 500);
    }

    // 2. Draw Chests, Keys, Portals
    state.pickups.forEach((pickup) => {
      if (pickup.type === "key") {
        if (assets.key.complete) {
          ctx.drawImage(assets.key, pickup.x - 16, pickup.y - 16, 32, 32);
        } else {
          ctx.fillStyle = "#facc15";
          ctx.fillRect(pickup.x - 12, pickup.y - 12, 24, 24);
        }
      } else if (pickup.type === "chest") {
        // Draw locked chest box
        ctx.fillStyle = "#a16207";
        ctx.fillRect(pickup.x - 20, pickup.y - 15, 40, 30);
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 2;
        ctx.strokeRect(pickup.x - 20, pickup.y - 15, 40, 30);
        ctx.fillStyle = "#fbbf24";
        ctx.font = "12px Outfit";
        ctx.fillText("📦 CHEST", pickup.x - 24, pickup.y - 20);
      } else if (pickup.type === "portal") {
        // Draw glowing cyan portal
        ctx.strokeStyle = "#22d3ee";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(pickup.x, pickup.y, 25, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "rgba(34, 211, 238, 0.15)";
        ctx.beginPath();
        ctx.arc(pickup.x, pickup.y, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#22d3ee";
        ctx.font = "12px Outfit";
        ctx.fillText("🌀 PORTAL", pickup.x - 26, pickup.y - 32);
      }
    });

    // 3. Draw Relic EXP Orbs
    state.orbs.forEach((orb) => {
      if (assets.orb.complete) {
        ctx.drawImage(assets.orb, orb.x - 10, orb.y - 10, 20, 20);
      } else {
        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 4. Draw Bullets
    state.bullets.forEach((bullet) => {
      ctx.fillStyle = "#67e8f9";
      ctx.shadowColor = "#06b6d4";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    });

    // 5. Draw Enemies
    state.enemies.forEach((enemy) => {
      // Rotation calculations
      const angle = Math.atan2(state.playerY - enemy.y, state.playerX - enemy.x);
      ctx.save();
      ctx.translate(enemy.x, enemy.y);
      ctx.rotate(angle);

      const sprite = enemy.type === "boar" ? assets.boar : assets.jaguar;
      if (enemy.type === "boss") {
        // Giant Boss Behemoth
        ctx.fillStyle = "#dc2626";
        ctx.beginPath();
        ctx.arc(0, 0, enemy.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#000";
        ctx.font = "14px Outfit";
        ctx.fillText("👹 BOSS", -20, 5);
      } else if (sprite.complete) {
        ctx.drawImage(sprite, -enemy.size, -enemy.size, enemy.size * 2, enemy.size * 2);
      } else {
        ctx.fillStyle = enemy.type === "boar" ? "#4b5563" : "#7c3aed";
        ctx.fillRect(-enemy.size, -enemy.size, enemy.size * 2, enemy.size * 2);
      }

      ctx.restore();

      // Enemy HP Bar
      if (enemy.hp < enemy.maxHp) {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(enemy.x - enemy.size, enemy.y - enemy.size - 12, enemy.size * 2, 4);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(enemy.x - enemy.size, enemy.y - enemy.size - 12, (enemy.hp / enemy.maxHp) * enemy.size * 2, 4);
      }
    });

    // 6. Draw Hero Lion Explorer
    ctx.save();
    ctx.translate(state.playerX, state.playerY);
    ctx.rotate(state.playerAngle);
    if (assets.hero.complete) {
      ctx.drawImage(assets.hero, -22, -22, 44, 44);
    } else {
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();
      // Arrow indicator for direction
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(0, -6);
      ctx.lineTo(0, 6);
      ctx.fill();
    }
    ctx.restore();

    // 7. Draw Sparks particles
    updateDamageSparks(ctx);
  }

  // Particle Effects system
  let particleSparksList = [];
  function createDamageSparks(x, y) {
    for (let i = 0; i < 6; i++) {
      particleSparksList.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 20,
        color: `hsl(${180 + Math.random() * 40}, 100%, 75%)`,
      });
    }
  }

  function updateDamageSparks(ctx) {
    particleSparksList.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 2, 2);

      if (p.life <= 0) {
        particleSparksList.splice(index, 1);
      }
    });
  }

  // Keyboard Event registers
  function setupInputs() {
    window.addEventListener("keydown", (e) => {
      keysPressed[e.key] = true;
    });
    window.addEventListener("keyup", (e) => {
      keysPressed[e.key] = false;
    });

    // Touch Virtual Joystick Logic
    nodes.joystickContainer.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      const rect = nodes.joystickContainer.getBoundingClientRect();
      touchStartPos = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    });

    nodes.joystickContainer.addEventListener("touchmove", (e) => {
      if (!touchStartPos) return;
      e.preventDefault();
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartPos.x;
      const dy = touch.clientY - touchStartPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const maxRadius = 40;
      let ratio = 1;
      if (dist > maxRadius) {
        ratio = maxRadius / dist;
      }

      // Move knob UI
      nodes.joystickKnob.style.transform = `translate(${dx * ratio}px, ${dy * ratio}px)`;

      // Set movement speed multipliers
      moveVector.x = (dx / maxRadius) * ratio;
      moveVector.y = (dy / maxRadius) * ratio;
    });

    nodes.joystickContainer.addEventListener("touchend", () => {
      touchStartPos = null;
      nodes.joystickKnob.style.transform = "translate(0px, 0px)";
      moveVector = { x: 0, y: 0 };
    });
  }

  // Init handler
  function init() {
    loadLocalState();
    updateDiamondShopUI();
    translateUI();
    setupInputs();

    // Event buttons
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

    // Sync with global i18n
    window.addEventListener("wonder:locale-change", () => {
      translateUI();
      updateHUDText();
      renderStatsPanel();
    });

    // Loading screen fake simulation
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

  window.addEventListener("DOMContentLoaded", init);
})();
