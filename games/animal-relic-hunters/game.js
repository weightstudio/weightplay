(() => {
  const GAME_ID = "animal-relic-hunters";
  const saveKey = "weightplay_relic_hunters_v1";
  const profileKey = "weightplay:animal-relic-hunters:profile:v1";
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
    backpackList: $("backpackList"),
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
    resultSummary: $("resultSummary"),
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
    rerollDraftBtn: $("rerollDraftBtn"),
    rerollDraftCost: $("rerollDraftCost"),
    rerollDraftStatus: $("rerollDraftStatus"),
  };

  const amuletCost = 15;
  const draftRerollCost = 3;

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
      rerollRelics: "Reroll relic choices",
      rerollRelicsUsed: "Reroll used for this level.",
      rerollRelicsNeedDiamonds: "Not enough Diamonds for a reroll.",
      lootFound: "Relic Chest Unlocked!",
      equipLoot: "Equip Gear",
      backpackTitle: "Backpack",
      backpackEmpty: "Open relic chests to collect permanent gear.",
      equipGearAction: "Equip",
      equippedTag: "Equipped",
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
      hudStage: "Rooms Cleared",
      runComplete: "Expedition Success!",
      runFailed: "Explorer Defeated",
      resultSummaryLevel: "Saved Level",
      resultSummaryRooms: "Rooms",
      resultSummaryKeys: "Run Keys",
      resultSummaryDiamonds: "Diamonds Earned",
      resultSummaryGear: "Equipped Gear",
      resultSummaryNoGear: "No gear equipped yet",
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
      relic_damage: "Crystal Fang",
      relic_damage_desc: "Increase bullet damage by 20%.",
      relic_heal: "Moonwell Breath",
      relic_heal_desc: "Restore 12 HP immediately.",

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
      rerollRelics: "重抽遺跡能力",
      rerollRelicsUsed: "本次升級已使用重抽。",
      rerollRelicsNeedDiamonds: "鑽石不足，無法重抽。",
      lootFound: "解鎖遺跡寶箱！",
      equipLoot: "裝備道具",
      backpackTitle: "背包",
      backpackEmpty: "開啟遺跡寶箱後，永久裝備會收藏在這裡。",
      equipGearAction: "裝備",
      equippedTag: "已穿戴",
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
      relic_damage: "水晶獸牙",
      relic_damage_desc: "子彈傷害提高 20%。",
      relic_heal: "月泉吐息",
      relic_heal_desc: "立刻恢復 12 點生命值。",

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

  Object.assign(text["zh-Hant"], {
    hudStage: "\u5df2\u901a\u95dc\u623f\u9593",
    resultSummaryLevel: "\u4fdd\u5b58\u7b49\u7d1a",
    resultSummaryRooms: "\u623f\u9593\u9032\u5ea6",
    resultSummaryKeys: "\u672c\u8f2a\u91d1\u9470",
    resultSummaryDiamonds: "\u7372\u5f97\u947d\u77f3",
    resultSummaryGear: "\u5df2\u7a7f\u6234\u88dd\u5099",
    resultSummaryNoGear: "\u5c1a\u672a\u7a7f\u6234\u88dd\u5099"
  });

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
    level: 1,
    exp: 0,
    expNeed: 100,
    room: 1,
    keys: 0,
    runKeys: 0,
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
    relicDamageCount: 0,

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

  let profile = createDefaultProfile();

  function createDefaultProfile() {
    return {
      level: 1,
      exp: 0,
      expNeed: 100,
      inventory: [],
      equipped: {
        weapon: null,
        armor: null,
        boots: null,
      },
    };
  }

  function normalizeProfile(data) {
    const next = createDefaultProfile();
    if (!data || typeof data !== "object") return next;

    next.level = Math.max(1, Math.floor(Number(data.level) || 1));
    next.exp = Math.max(0, Math.floor(Number(data.exp) || 0));
    next.expNeed = Math.max(100, Math.floor(Number(data.expNeed) || 100));

    if (Array.isArray(data.inventory)) {
      next.inventory = [...new Set(data.inventory.filter((key) => gearDb[key]))];
    }

    const equipped = data.equipped && typeof data.equipped === "object" ? data.equipped : {};
    for (const slot of ["weapon", "armor", "boots"]) {
      const key = equipped[slot];
      next.equipped[slot] = gearDb[key]?.slot === slot ? key : null;
      if (next.equipped[slot] && !next.inventory.includes(next.equipped[slot])) {
        next.inventory.push(next.equipped[slot]);
      }
    }

    while (next.exp >= next.expNeed) {
      next.exp -= next.expNeed;
      next.level += 1;
      next.expNeed = Math.floor(next.expNeed * 1.3);
    }

    return next;
  }

  function loadProfile() {
    try {
      profile = normalizeProfile(JSON.parse(localStorage.getItem(profileKey) || "{}"));
    } catch {
      profile = createDefaultProfile();
    }
    syncStateFromProfile();
  }

  function saveProfile() {
    try {
      localStorage.setItem(profileKey, JSON.stringify(profile));
    } catch {}
  }

  function syncStateFromProfile() {
    state.level = profile.level;
    state.exp = profile.exp;
    state.expNeed = profile.expNeed;
    state.eqWeapon = profile.equipped.weapon;
    state.eqArmor = profile.equipped.armor;
    state.eqBoots = profile.equipped.boots;
  }

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
    loadProfile();
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
    if (state.relicDamageCount > 0) {
      dmg *= Math.pow(1.2, state.relicDamageCount);
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

    const hp = Math.max(0, Math.ceil(state.playerHp));
    const maxHp = Math.ceil(stats.maxHp);
    nodes.hpText.textContent = `${hp}/${maxHp}`;
    nodes.hpFill.style.width = `${Math.max(0, Math.min(100, (state.playerHp / stats.maxHp) * 100))}%`;
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

    renderBackpack();
  }

  function renderBackpack() {
    if (!nodes.backpackList) return;

    nodes.backpackList.innerHTML = "";
    if (profile.inventory.length === 0) {
      const empty = document.createElement("p");
      empty.className = "backpack-empty";
      empty.textContent = t("backpackEmpty");
      nodes.backpackList.appendChild(empty);
      return;
    }

    profile.inventory.forEach((key) => {
      const g = gearDb[key];
      if (!g) return;

      const equippedKey = profile.equipped[g.slot];
      const equipped = equippedKey === key;
      const item = document.createElement("button");
      item.className = `backpack-item${equipped ? " is-equipped" : ""}`;
      item.type = "button";
      item.dataset.gearKey = key;
      item.innerHTML = `
        <img src="${g.iconSrc}" alt="" aria-hidden="true">
        <span class="backpack-copy">
          <strong>${t(g.nameKey)}</strong>
          <small>${t(g.effectKey)}</small>
        </span>
        <b>${equipped ? t("equippedTag") : t("equipGearAction")}</b>
      `;
      item.addEventListener("click", () => equipGearItem(key));
      nodes.backpackList.appendChild(item);
    });
  }

  function addGearToInventory(key) {
    if (!gearDb[key]) return;
    if (!profile.inventory.includes(key)) {
      profile.inventory.push(key);
      saveProfile();
    }
  }

  function equipGearItem(key) {
    const g = gearDb[key];
    if (!g) return;

    addGearToInventory(key);
    const oldStats = getStats();
    profile.equipped[g.slot] = key;
    syncStateFromProfile();
    const newStats = getStats();

    if (g.slot === "armor") {
      state.playerHp = Math.min(newStats.maxHp, state.playerHp + (newStats.maxHp - oldStats.maxHp));
    }

    saveProfile();
    renderStatsPanel();
    renderEquippedGear();
    updateHUDText();
    window.WonderSound?.play("success");
  }

  // Combat loop updates
  function startRun() {
    loadLocalState();
    syncStateFromProfile();
    const stats = getStats();
    state.playerMaxHp = stats.maxHp;
    state.playerHp = state.playerMaxHp;
    state.playerX = 400;
    state.playerY = 250;
    state.room = 1;
    state.keys = 0;
    state.runKeys = 0;

    // Reset run-only relic buffs. Level and equipment are permanent profile data.
    state.relicMagnetCount = 0;
    state.relicRateCount = 0;
    state.relicHpCount = 0;
    state.relicDamageCount = 0;

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
  let draftRerollUsed = false;

  function gainExp(amount) {
    state.exp += amount;
    profile.exp = state.exp;
    profile.expNeed = state.expNeed;
    profile.level = state.level;
    saveProfile();
  }

  function handleLevelUp() {
    state.level++;
    state.exp -= state.expNeed;
    state.expNeed = Math.floor(state.expNeed * 1.3);
    profile.level = state.level;
    profile.exp = state.exp;
    profile.expNeed = state.expNeed;
    saveProfile();
    window.WonderSound?.play("success");

    // Pause game loop
    state.gameActive = false;

    draftRerollUsed = false;
    nodes.rerollDraftStatus.textContent = "";
    renderDraftChoices();
    nodes.draftPanel.classList.remove("hidden");
    updateDraftRerollUI();
  }

  function renderDraftChoices(keepCurrent = false) {
    // Choose 3 random relics from a wider pool so rerolling has real choice value.
    if (!keepCurrent || currentDraftChoices.length === 0) {
      const pool = ["relic_magnet", "relic_speed", "relic_shield", "relic_damage", "relic_heal"];
      shuffle(pool);
      currentDraftChoices = pool.slice(0, 3);
    }

    nodes.draftCards.innerHTML = "";
    currentDraftChoices.forEach((relicId) => {
      const cardEl = document.createElement("button");
      cardEl.className = "draft-item-btn";
      cardEl.type = "button";
      
      let iconSrc = uiAssets.magnet;
      if (relicId === "relic_speed") iconSrc = uiAssets.rate;
      else if (relicId === "relic_shield") iconSrc = uiAssets.shield;
      else if (relicId === "relic_damage") iconSrc = uiAssets.attack;
      else if (relicId === "relic_heal") iconSrc = uiAssets.shield;

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
  }

  function updateDraftRerollUI() {
    const wallet = window.WeightPlayWallet?.read() || { diamonds: 0 };
    nodes.rerollDraftCost.textContent = draftRerollCost;
    nodes.rerollDraftBtn.disabled = draftRerollUsed || wallet.diamonds < draftRerollCost;
    if (draftRerollUsed) {
      nodes.rerollDraftStatus.textContent = t("rerollRelicsUsed");
    } else if (wallet.diamonds < draftRerollCost) {
      nodes.rerollDraftStatus.textContent = t("rerollRelicsNeedDiamonds");
    } else {
      nodes.rerollDraftStatus.textContent = "";
    }
  }

  function rerollDraftChoices() {
    if (draftRerollUsed) {
      updateDraftRerollUI();
      return;
    }

    const spent = window.WeightPlayWallet?.spendDiamonds(draftRerollCost);
    if (!spent) {
      nodes.rerollDraftStatus.textContent = t("rerollRelicsNeedDiamonds");
      updateDraftRerollUI();
      return;
    }

    draftRerollUsed = true;
    renderDraftChoices();
    updateDraftRerollUI();
    updateDiamondShopUI();
    window.WonderSound?.play("upgrade");
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
    } else if (relicId === "relic_damage") {
      state.relicDamageCount++;
    } else if (relicId === "relic_heal") {
      const stats = getStats();
      state.playerHp = Math.min(stats.maxHp, state.playerHp + 12);
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
    addGearToInventory(pickedKey);
    renderEquippedGear();

    nodes.lootPanel.classList.remove("hidden");
  }

  function equipLoot() {
    equipGearItem(currentLootItem);

    nodes.lootPanel.classList.add("hidden");

    // Resume loop
    state.gameActive = true;
    renderStatsPanel();
    renderEquippedGear();
    updateHUDText();
    state.gameLoopId = requestAnimationFrame(updateGameEngine);
  }

  function equippedGearSummary() {
    const keys = [state.eqWeapon, state.eqArmor, state.eqBoots].filter(Boolean);
    if (keys.length === 0) return t("resultSummaryNoGear");
    return keys.map((key) => t(gearDb[key].nameKey)).join(" / ");
  }

  function renderResultSummary({ cleared, diamondsEarned }) {
    if (!nodes.resultSummary) return;
    const rows = [
      [t("resultSummaryLevel"), `Lv.${profile.level}`],
      [t("resultSummaryRooms"), `${cleared}/3`],
      [t("resultSummaryKeys"), String(state.runKeys)],
      [t("resultSummaryDiamonds"), `+${diamondsEarned}`],
      [t("resultSummaryGear"), equippedGearSummary()],
    ];

    nodes.resultSummary.textContent = "";
    rows.forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "result-summary-row";
      const labelEl = document.createElement("span");
      labelEl.textContent = label;
      const valueEl = document.createElement("strong");
      valueEl.textContent = value;
      row.append(labelEl, valueEl);
      nodes.resultSummary.appendChild(row);
    });
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

    const diamondsEarned = won ? 8 : Math.max(0, cleared);
    const skillScore = `${Math.min(5, cleared + 2)}/5`;
    nodes.logicStars.textContent = skillScore;
    nodes.focusStars.textContent = skillScore;
    nodes.problemStars.textContent = skillScore;
    renderResultSummary({ cleared, diamondsEarned });

    if (won) {
      nodes.resultText.textContent = t("report_win");
      nodes.skillReportText.textContent = t("report_win");
      window.WeightPlayWallet?.addDiamonds(diamondsEarned);
      window.WonderSound?.play("win");
    } else {
      nodes.resultText.textContent = t("report_partial", { room: state.room });
      nodes.skillReportText.textContent = t("report_partial", { room: state.room });
      window.WeightPlayWallet?.addDiamonds(diamondsEarned);
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
        gainExp(orb.value);
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
          state.runKeys++;
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
        ctx.fillText("CHEST", pickup.x - 20, pickup.y - 20);
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
        ctx.fillText("PORTAL", pickup.x - 22, pickup.y - 32);
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
      ctx.save();
      ctx.translate(enemy.x, enemy.y);

      const sprite = enemy.type === "boar" || enemy.type === "boss" ? assets.boar : assets.jaguar;
      if (enemy.type === "boss") {
        // Giant boss uses the premium creature sprite instead of a placeholder circle.
        ctx.shadowColor = "rgba(212, 175, 55, 0.55)";
        ctx.shadowBlur = 18;
        ctx.fillStyle = "rgba(212, 175, 55, 0.16)";
        ctx.beginPath();
        ctx.ellipse(0, 8, enemy.size * 1.25, enemy.size * 0.9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        if (sprite.complete) {
          ctx.drawImage(sprite, -enemy.size * 1.25, -enemy.size * 1.2, enemy.size * 2.5, enemy.size * 2.5);
        } else {
          ctx.fillStyle = "#4b5563";
          ctx.fillRect(-enemy.size, -enemy.size, enemy.size * 2, enemy.size * 2);
        }
        ctx.fillStyle = "#fde68a";
        ctx.font = "bold 13px Outfit";
        ctx.textAlign = "center";
        ctx.fillText("BOSS", 0, -enemy.size - 10);
        ctx.textAlign = "left";
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

    nodes.rerollDraftBtn.addEventListener("click", () => {
      rerollDraftChoices();
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
      if (!nodes.draftPanel.classList.contains("hidden")) {
        renderDraftChoices(true);
        updateDraftRerollUI();
      }
    });

    if (new URLSearchParams(location.search).has("smoke")) {
      window.__animalRelicHuntersSmoke = {
        forceResult({ won = false, room = 2, keys = 1 } = {}) {
          loadLocalState();
          syncStateFromProfile();
          state.room = Math.max(1, Math.min(3, Number(room) || 1));
          state.runKeys = Math.max(0, Math.floor(Number(keys) || 0));
          nodes.menuPanel.classList.add("hidden");
          nodes.draftPanel.classList.add("hidden");
          nodes.lootPanel.classList.add("hidden");
          nodes.gamePanel.classList.remove("hidden");
          endGame(Boolean(won));
          return this.snapshot();
        },
        snapshot() {
          return {
            resultTitle: nodes.resultTitle.textContent,
            resultScore: nodes.resultScore.textContent,
            resultText: nodes.resultText.textContent,
            resultSummary: nodes.resultSummary?.textContent || "",
            skillReportText: nodes.skillReportText.textContent,
            wallet: window.WeightPlayWallet?.read?.() || null,
          };
        },
      };
    }

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
