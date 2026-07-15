(() => {
  const GAME_ID = "shadow-wolf";
  const saveKey = "weightplay_shadow_wolf_v1";
  const localeKey = "weightPlayLocale";

  const $ = (id) => document.getElementById(id);
  const nodes = {
    localeSelect: $("localeSelect"),
    menuPanel: $("menuPanel"),
    mapPanel: $("mapPanel"),
    mapBackBtn: $("mapBackBtn"),
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
    eqWeaponIcon: $("eqWeaponIcon"),
    weaponSlot: $("weaponSlot"),
    eqArmorName: $("eqArmorName"),
    eqArmorEffect: $("eqArmorEffect"),
    eqArmorIcon: $("eqArmorIcon"),
    armorSlot: $("armorSlot"),
    eqBootsName: $("eqBootsName"),
    eqBootsEffect: $("eqBootsEffect"),
    eqBootsIcon: $("eqBootsIcon"),
    bootsSlot: $("bootsSlot"),
    statDmg: $("statDmg"),
    statSpeed: $("statSpeed"),
    statJump: $("statJump"),
    statCrit: $("statCrit"),
    attrPoints: $("attrPoints"),
    attrStrength: $("attrStrength"),
    attrAgility: $("attrAgility"),
    attrConstitution: $("attrConstitution"),
    attrLuck: $("attrLuck"),
    attributeChoiceDesc: $("attributeChoiceDesc"),
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
    adventureRecordText: $("adventureRecordText"),
    zoneButtons: Array.from(document.querySelectorAll("[data-zone]")),
    attributeButtons: Array.from(document.querySelectorAll("[data-attribute]")),
  };

  const amuletCost = 15;

  const text = {
    en: {
      title: "Shadow Wolf",
      menuTitle: "Dungeon Platform Adventure.",
      menuHint: "Move with A/D, jump twice with W/Space, attack with J, and dash with K. Defeat elites, choose exact attribute growth, and clear all 8 regions.",
      adventureRecordTitle: "Adventure Record",
      adventureRecordText: "Expeditions: {runs} · Best: Room {best}/8 · Behemoth clears: {wins}",
      diamondShopTitle: "Permanent Upgrade",
      amuletName: "Mist Amulet",
      amuletEffect: "Start every run with +10 Max HP (40 HP instead of 30 HP).",
      amuletOwned: "Owned: every run starts with 40 Max HP.",
      startRun: "Start Game",
      languageSelector: "Language selector",
      controlLegend: "A/D Move · W/Space Jump · J Attack · K/Shift Dash",
      roomLabel: "Room",
      keyLabel: "Points",
      arenaLabel: "Shadow Wolf arena",
      stageEyebrow: "EXPEDITION",
      stageTitle: "Choose an expedition",
      stageHint: "Drag the rail or choose an unlocked region to begin.",
      menu: "Menu",
      hudHp: "Wolf HP",
      chooseCard: "Choose a Relic Upgrade",
      chooseCardDesc: "Select one of these ancient relics to empower your wolf.",
      attributeChoiceTitle: "Level Up: Choose Your Growth",
      attributeChoiceDesc: "Spend both points before battle resumes. {points} remaining.",
      attributeStrength: "Strength",
      attributeAgility: "Agility",
      attributeConstitution: "Constitution",
      attributeLuck: "Luck",
      attributeDamagePreview: "Damage {from} → {to}",
      attributeSpeedPreview: "Speed {from} → {to}",
      attributeHpPreview: "Max HP {from} → {to}",
      attributeCritPreview: "Crit {from}% → {to}%",
      attributeChoiceAria: "Spend 1 point on {name}: {effect}",
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
      regionsCleared: "Regions cleared",

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
      report_win: "Legendary Wolf! You conquered all 8 regions, timed your double jumps, shaped your attributes, and defeated the Behemoth.",
      report_partial: "Good expedition! You reached Region {room}. Spend both level-up points and adjust your build for the next attempt.",
    },
    "zh-Hant": {
      title: "影狼傳說",
      menuTitle: "遺跡平台冒險之旅。",
      menuHint: "使用 A/D 移動，W/空白鍵進行跳躍或雙重跳躍，J 鍵揮爪攻擊，K 鍵衝刺。收集鑰匙解鎖裝備，通關 Room 3。",
      diamondShopTitle: "永久升級",
      amuletName: "迷霧護符",
      amuletEffect: "每局挑戰開始時最大生命值 +10 HP (以 40 HP 開局，原為 30 HP)。",
      amuletOwned: "已擁有：以 40 Max HP 開局。",
      startRun: "開始遊戲",
      languageSelector: "語言選擇",
      controlLegend: "A/D 移動 · W/空白鍵 跳躍 · J 攻擊 · K/Shift 衝刺",
      roomLabel: "房間",
      keyLabel: "鑰匙",
      arenaLabel: "影狼戰鬥場景",
      stageEyebrow: "影狼遠征",
      stageTitle: "選擇探索區域",
      stageHint: "左右滑動選擇已解鎖區域，點擊卡片開始挑戰。",
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

  Object.assign(text["zh-Hant"], {
    adventureRecordTitle: "\u5192\u96aa\u7d00\u9304",
    adventureRecordText: "\u51fa\u5f81\u6b21\u6578\uff1a{runs} \u00b7 \u6700\u4f73\uff1a\u623f\u9593 {best}/8 \u00b7 \u5de8\u7378\u901a\u95dc\uff1a{wins}",
    menuHint: "使用 A/D 移動、W 或空白鍵二段跳、J 攻擊、K 衝刺。擊敗精英、精確分配屬性，通過全部 8 個區域。",
    keyLabel: "點數",
    attributeChoiceTitle: "升級：選擇成長方向",
    attributeChoiceDesc: "分配完兩點後繼續戰鬥。剩餘 {points} 點。",
    attributeStrength: "力量",
    attributeAgility: "敏捷",
    attributeConstitution: "體質",
    attributeLuck: "幸運",
    attributeDamagePreview: "傷害 {from} → {to}",
    attributeSpeedPreview: "速度 {from} → {to}",
    attributeHpPreview: "最大生命 {from} → {to}",
    attributeCritPreview: "暴擊 {from}% → {to}%",
    attributeChoiceAria: "花費 1 點提升{name}：{effect}",
    report_win: "傳奇影狼！你通過全部 8 個區域、掌握二段跳、完成屬性配置，並擊敗巨獸。",
    report_partial: "這次抵達區域 {room}。下次記得分配完兩點升級點數，再依路線調整配置。",
    regionsCleared: "通過區域",
  });

  function preloadImage(src) {
    const image = new Image();
    image.src = src;
    return image;
  }

  const shadowAssetPaths = {
    bg: "../../assets/shadow-wolf-stage-bg.webp",
    bgCrystal: "../../assets/shadow-wolf-bg-crystal-cavern.png",
    bgJungle: "../../assets/shadow-wolf-bg-vine-jungle.png",
    bgRift: "../../assets/shadow-wolf-bg-shadow-rift.png",
    bgVolcanic: "../../assets/shadow-wolf-bg-volcanic-altar.png",
    wolf: "../../assets/shadow-wolf-hero.webp",
    enemyWolf: "../../assets/shadow-wolf-enemy-hunter.png",
    bat: "../../assets/shadow-wolf-enemy-bat-cutout.png",
    boar: "../../assets/shadow-wolf-enemy-boar-cutout.png",
    boss: "../../assets/shadow-wolf-boss-behemoth-cutout.png",
    bossBasilisk: "../../assets/shadow-wolf-boss-basilisk.png",
    bossGuardian: "../../assets/shadow-wolf-boss-guardian.png",
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

  const attributeChoiceIcons = {
    strength: "../../assets/shadow-wolf-relic-sharp-fang.webp",
    agility: "../../assets/shadow-wolf-relic-wind-boots.webp",
    constitution: "../../assets/shadow-wolf-relic-thick-fur.webp",
    luck: "../../assets/shadow-wolf-relic-shadow-lantern.webp",
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
    runs: 0,
    bestRoom: 0,
    wins: 0,
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
    baseJump: 10.5,
    baseCrit: 0.05,
    attributePoints: 0,
    strength: 0,
    agility: 0,
    constitution: 0,
    luck: 0,
    zone: 1,

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
  let damageNumbers = [];
  let selectedStage = 1;
  const stageNames = ["", "月影遺跡", "水晶斷橋", "古獸祭壇"];

  // Inputs
  let keysPressed = {};
  let mobileInput = { left: false, right: false };

  function loadLocalState() {
    try {
      const data = JSON.parse(localStorage.getItem(saveKey) || "{}");
      state.amuletUnlocked = !!data.amuletUnlocked;
      state.runs = Math.max(0, Number.parseInt(data.runs, 10) || 0);
      state.bestRoom = Math.max(0, Math.min(8, Number.parseInt(data.bestRoom, 10) || 0));
      state.wins = Math.max(0, Number.parseInt(data.wins, 10) || 0);
    } catch {
      state.amuletUnlocked = false;
      state.runs = 0;
      state.bestRoom = 0;
      state.wins = 0;
    }
  }

  function saveLocalState() {
    try {
      localStorage.setItem(saveKey, JSON.stringify({ amuletUnlocked: state.amuletUnlocked, runs: state.runs, bestRoom: state.bestRoom, wins: state.wins }));
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

  function renderAdventureRecord() {
    if (!nodes.adventureRecordText) return;
    nodes.adventureRecordText.textContent = t("adventureRecordText", { runs: state.runs, best: state.bestRoom, wins: state.wins });
  }

  function translateUI() {
    const locale = getLocale();
    document.documentElement.lang = locale;
    for (const el of document.querySelectorAll("[data-ui]")) {
      const key = el.dataset.ui;
      el.textContent = t(key);
    }
    for (const el of document.querySelectorAll("[data-ui-aria]")) {
      el.setAttribute("aria-label", t(el.dataset.uiAria));
    }
    nodes.localeSelect.value = getLocale();
    renderStageCards();
    const publicMeta = locale === "zh-Hant"
      ? { title: "影狼傳說 - WeightPlay", description: "探索影狼遺跡、收集遺物並挑戰首領的 13+ 動作冒險。" }
      : { title: "Shadow Wolf Legend - WeightPlay", description: "Explore Shadow Wolf ruins, collect relics, and challenge the boss in this 13+ action adventure." };
    document.title = publicMeta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", publicMeta.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", publicMeta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", publicMeta.description);
    updateDiamondShopUI();
    renderEquippedGear();
    renderAdventureRecord();
  }

  const stageCopy = {
    en: [
      ["Moonshade Gate", "Patrol wolves"],
      ["Mosscliff", "High ledge ambush"],
      ["Crystal Mouth", "Crystal spikes"],
      ["Dusk Bridge", "Bat swarm"],
      ["Vine Passage", "Twin traps"],
      ["Ancient Steps", "Boar guardian"],
      ["Rift Depths", "Elite hunt"],
      ["Behemoth Altar", "Boss battle"],
    ],
    "zh-Hant": [
      ["月影入口", "巡邏狼群"],
      ["苔石斷崖", "高台伏擊"],
      ["螢晶洞口", "水晶尖刺"],
      ["暮影橋頭", "飛蝠群"],
      ["藤蔓回廊", "雙重陷阱"],
      ["古樹祭階", "戰豬守衛"],
      ["裂谷深處", "精英狩獵"],
      ["古獸祭壇", "首領戰"],
    ],
  };

  function renderStageCards() {
    const copy = stageCopy[getLocale()];
    nodes.zoneButtons.forEach((button, index) => {
      const [title, hint] = copy[index];
      button.querySelector("span").textContent = title;
      button.querySelector("small").textContent = hint;
      button.setAttribute("aria-label", String(index + 1) + ". " + title + ": " + hint);
    });
  }

  function setScreen(screen) {
    document.body.dataset.shadowWolfScreen = screen;
    document.documentElement.dataset.shadowWolfScreen = screen;
  }

  function showStage() {
    nodes.menuPanel.classList.add("hidden");
    nodes.gamePanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.mapPanel.classList.remove("hidden");
    setScreen("stage");
    renderStageCards();
  }

  function showMain() {
    state.gameActive = false;
    cancelAnimationFrame(state.gameLoopId);
    nodes.gamePanel.classList.add("hidden");
    nodes.mapPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.menuPanel.classList.remove("hidden");
    setScreen("main");
    updateDiamondShopUI();
    renderAdventureRecord();
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

  // Attributes drive the entire progression system; there is no gear layer.
  function getStats() {
    return {
      dmg: state.baseDmg + state.strength * 2,
      speed: state.baseSpeed + state.agility * 0.12,
      jump: state.baseJump + state.agility * 0.08,
      crit: Math.min(0.7, state.baseCrit + state.luck * 0.012),
      maxHp: (state.amuletUnlocked ? 40 : 30) + state.constitution * 8,
      defense: state.constitution * 0.55,
      dodge: Math.min(0.35, state.agility * 0.012),
      expBonus: 1 + state.luck * 0.08,
      attackFrames: Math.max(7, 18 - state.agility),
    };
  }

  function renderStatsPanel() {
    const stats = getStats();
    nodes.statDmg.textContent = stats.dmg.toFixed(0);
    nodes.statSpeed.textContent = stats.speed.toFixed(1);
    nodes.statJump.textContent = stats.maxHp.toFixed(0);
    nodes.statCrit.textContent = `${Math.round(stats.crit * 100)}%`;
    nodes.attrPoints.textContent = state.attributePoints;
    nodes.attrStrength.textContent = state.strength;
    nodes.attrAgility.textContent = state.agility;
    nodes.attrConstitution.textContent = state.constitution;
    nodes.attrLuck.textContent = state.luck;

    nodes.hpText.textContent = `${Math.ceil(state.playerHp)}/${stats.maxHp}`;
    nodes.hpFill.style.width = `${(state.playerHp / stats.maxHp) * 100}%`;
    nodes.attributeButtons.forEach((button) => {
      button.disabled = state.attributePoints < 1;
    });
  }

  function attributePreview(attribute) {
    const before = getStats();
    state[attribute] += 1;
    const after = getStats();
    state[attribute] -= 1;
    if (attribute === "strength") return t("attributeDamagePreview", { from: before.dmg.toFixed(0), to: after.dmg.toFixed(0) });
    if (attribute === "agility") return t("attributeSpeedPreview", { from: before.speed.toFixed(1), to: after.speed.toFixed(1) });
    if (attribute === "constitution") return t("attributeHpPreview", { from: before.maxHp.toFixed(0), to: after.maxHp.toFixed(0) });
    return t("attributeCritPreview", { from: Math.round(before.crit * 100), to: Math.round(after.crit * 100) });
  }

  function renderAttributeDraft() {
    const attributes = ["strength", "agility", "constitution", "luck"];
    nodes.attributeChoiceDesc.textContent = t("attributeChoiceDesc", { points: state.attributePoints });
    nodes.draftCards.innerHTML = attributes.map((attribute) => {
      const name = t(`attribute${attribute[0].toUpperCase()}${attribute.slice(1)}`);
      const effect = attributePreview(attribute);
      return `
        <button class="attribute-choice" type="button" data-draft-attribute="${attribute}" aria-label="${t("attributeChoiceAria", { name, effect })}">
          <img src="${attributeChoiceIcons[attribute]}" alt="" />
          <span><strong>${name}</strong><small>${effect}</small></span>
          <b>+1</b>
        </button>
      `;
    }).join("");
  }

  function renderEquippedGear() {
    // Kept as a harmless compatibility hook for saved sessions from the old gear build.
  }

  // The background contains three readable stone surfaces. Keep every collision
  // surface on those visible ledges so the player never has to guess the floor.
  const stageTerrain = Object.freeze([
    { x: 0, y: 370, w: 800, h: 130, kind: "ground" },
    { x: 0, y: 170, w: 310, h: 24, kind: "ledge" },
    { x: 520, y: 210, w: 280, h: 24, kind: "ledge" },
  ]);
  const mainFloorY = stageTerrain[0].y;

  const zoneObstacleLayouts = {
    1: [{ x: 180, y: 302, w: 118 }, { x: 498, y: 286, w: 92 }],
    2: [{ x: 110, y: 310, w: 92 }, { x: 380, y: 270, w: 126 }, { x: 645, y: 310, w: 82 }],
    3: [{ x: 260, y: 315, w: 92 }, { x: 520, y: 250, w: 116 }],
    4: [{ x: 170, y: 270, w: 104, moving: true, minX: 110, maxX: 330, speed: 0.8 }, { x: 570, y: 300, w: 96 }],
    5: [{ x: 90, y: 285, w: 116 }, { x: 350, y: 325, w: 78, moving: true, minX: 310, maxX: 500, speed: 1.05 }, { x: 620, y: 258, w: 105 }],
    6: [{ x: 240, y: 292, w: 150 }, { x: 540, y: 320, w: 104 }],
    7: [{ x: 135, y: 315, w: 82, moving: true, minX: 80, maxX: 260, speed: 1.2 }, { x: 390, y: 255, w: 116 }, { x: 650, y: 298, w: 80 }],
    8: [{ x: 220, y: 315, w: 105 }, { x: 470, y: 315, w: 105 }],
  };

  // Calculated from each transparent PNG's alpha bounds: these align visible feet
  // with the collision-box bottom rather than assuming every sprite shares a canvas crop.
  const spriteAnchors = Object.freeze({
    heroY: -55.4,
    hunterY: -39.2,
    boarY: -27.1,
    behemothY: -11.6,
    basiliskY: -19.1,
    guardianY: -20.9,
  });

  function addBackgroundAlignedTerrain(spike) {
    platforms.push(...stageTerrain.map((platform) => ({ ...platform })));
    if (spike) spikesList.push(spike);
  }

  // Setup platform configurations per room
  function buildRoomGeometry() {
    platforms = [];
    spikesList = [];
    state.enemies = [];
    state.bullets = [];
    state.orbs = [];
    state.pickups = [];
    damageNumbers = [];

    const room = state.room;
    if (room === 1 || room === 4 || room === 7) {
      // Room 1: the hazard sits visibly on the main stone path, never below it.
      addBackgroundAlignedTerrain({ x: room === 4 ? 235 : room === 7 ? 470 : 350, y: mainFloorY - 25, w: room === 7 ? 150 : 100, h: 25 });

      // Spawns
      state.enemies.push({ x: 250, y: mainFloorY - 24, width: 24, height: 24, hp: 12, maxHp: 12, speed: 1.0, type: "wolf", bounds: { min: 80, max: 330 }, isElite: false });
      state.enemies.push({ x: 150, y: 146, width: 24, height: 24, hp: 12, maxHp: 12, speed: 1.0, type: "wolf", bounds: { min: 60, max: 280 }, isElite: false });
      
      // Elite drops Key
      state.enemies.push({ x: 680, y: 178, width: 32, height: 32, hp: 40, maxHp: 40, speed: 1.5, type: "wolf", bounds: { min: 550, max: 770 }, isElite: true });

      state.x = 80;
      state.y = mainFloorY - state.height;
    } else if (room === 2 || room === 5) {
      // Room 2 reuses the same illustrated ruins, with a smaller visible hazard.
      addBackgroundAlignedTerrain({ x: room === 5 ? 470 : 320, y: mainFloorY - 25, w: room === 5 ? 125 : 85, h: 25 });

      // Spawns (Bats shoot projectiles)
      state.enemies.push({ x: 280, y: 140, width: 24, height: 24, hp: 15, maxHp: 15, type: "bat", shootCooldown: 60 });
      state.enemies.push({ x: 480, y: 205, width: 24, height: 24, hp: 15, maxHp: 15, type: "bat", shootCooldown: 100 });
      
      // Elite Boar
      state.enemies.push({ x: 680, y: 176, width: 34, height: 34, hp: 80, maxHp: 80, speed: 1.2, type: "boar", bounds: { min: 550, max: 770 }, isElite: true });

      state.x = 60;
      state.y = mainFloorY - state.height;
    } else if (room === 8) {
      // Room 3: Flat arena boss chamber
      addBackgroundAlignedTerrain();

      // Giant Boss Behemoth
      state.enemies.push({ x: 570, y: mainFloorY - 110, width: 110, height: 110, hp: 180, maxHp: 180, speed: 1.45, type: "boss", variant: "behemoth", dir: -1, isElite: true, shootCooldown: 105 });

      state.x = 80;
      state.y = mainFloorY - state.height;
    } else {
      addBackgroundAlignedTerrain({ x: 430, y: mainFloorY - 25, w: 140, h: 25 });
      state.enemies.push({ x: 210, y: mainFloorY - 24, width: 26, height: 26, hp: 30, maxHp: 30, speed: 1.35, type: "wolf", bounds: { min: 80, max: 350 }, isElite: false });
      state.enemies.push({ x: 610, y: 176, width: 34, height: 34, hp: 65, maxHp: 65, speed: 1.35, type: "boar", bounds: { min: 530, max: 770 }, isElite: true });
      state.x = 80;
      state.y = mainFloorY - state.height;
    }

    (zoneObstacleLayouts[room] || []).forEach((obstacle) => {
      platforms.push({ ...obstacle, h: 22, kind: "generated", dir: 1 });
    });

    const miniBosses = {
      4: { variant: "basilisk", x: 560, y: mainFloorY - 82, width: 82, height: 82, hp: 105, maxHp: 105, speed: 1.35, shootCooldown: 105 },
      6: { variant: "guardian", x: 545, y: mainFloorY - 96, width: 96, height: 96, hp: 135, maxHp: 135, speed: 1.05, shootCooldown: 95 },
    };
    if (miniBosses[room]) {
      state.enemies = [{ ...miniBosses[room], type: "boss", dir: -1, isElite: true }];
    }
  }

  // Active game start trigger
  function startRun(startRoom = state.zone) {
    loadLocalState();
    state.runs += 1;
    saveLocalState();
    const stats = getStats();
    state.playerMaxHp = stats.maxHp;
    state.playerHp = state.playerMaxHp;
    state.level = 1;
    state.exp = 0;
    state.expNeed = 100;
    state.room = startRoom;
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
    nodes.mapPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.gamePanel.classList.remove("hidden");
    setScreen("battle");

    renderStatsPanel();
    renderEquippedGear();
    updateHUDText();

    state.gameActive = true;
    window.WonderSound?.play("start");

    cancelAnimationFrame(state.gameLoopId);
    state.gameLoopId = requestAnimationFrame(updateGameEngine);
  }

  function updateHUDText() {
    nodes.roomText.textContent = `${state.room}/8`;
    nodes.keyText.textContent = state.attributePoints;
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
    const stats = getStats();
    state.attackTimer = stats.attackFrames;
    window.WonderSound?.play("shoot");

    // Attack collision sweeps forward
    const slashRange = 124;
    const slashWidth = 90;
    
    let ax = state.x + state.width;
    if (state.facing === "left") {
      ax = state.x - slashRange;
    }
    let ay = state.y - 22;

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
        enemy.hitTimer = 10;
        damageNumbers.push({ x: enemy.x + enemy.width / 2, y: enemy.y - 4, value: Math.round(finalDmg), crit: isCrit, life: 34 });
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
    state.expNeed = Math.floor(90 * Math.pow(state.level, 1.55));
    state.attributePoints += 2;
    state.gameActive = false;
    cancelAnimationFrame(state.gameLoopId);
    window.WonderSound?.play("success");
    renderStatsPanel();
    updateHUDText();
    renderAttributeDraft();
    nodes.draftPanel.classList.remove("hidden");
  }

  function spendAttribute(attribute) {
    if (state.attributePoints < 1 || !Object.hasOwn(state, attribute)) return;
    state.attributePoints--;
    state[attribute]++;
    const stats = getStats();
    state.playerHp = Math.min(stats.maxHp, state.playerHp + (attribute === "constitution" ? 8 : 0));
    renderStatsPanel();
    updateHUDText();
    if (state.attributePoints > 0) {
      renderAttributeDraft();
      return;
    }
    nodes.draftPanel.classList.add("hidden");
    state.gameActive = true;
    state.gameLoopId = requestAnimationFrame(updateGameEngine);
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

    // Platform runs should stay uninterrupted: chest gear immediately occupies its sidebar slot.
    equipLoot();
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

    nodes.resultPanel.classList.remove("hidden");

    nodes.resultTitle.textContent = won ? t("runComplete") : t("runFailed");
    nodes.resultScore.textContent = won ? "8" : String(Math.max(0, state.room - 1));

    const cleared = won ? 8 : Math.max(0, state.room - 1);
    state.bestRoom = Math.max(state.bestRoom, won ? 8 : Math.max(0, state.room - 1));
    if (won) state.wins += 1;
    saveLocalState();
    renderAdventureRecord();
    let starsStr = "";
    if (cleared === 3) starsStr = "⭐⭐⭐⭐⭐";
    else if (cleared === 2) starsStr = "⭐⭐⭐";
    else if (cleared === 1) starsStr = "⭐";
    else starsStr = "☆";

    starsStr = cleared >= 8 ? "★★★" : cleared >= 5 ? "★★" : cleared >= 1 ? "★" : "—";
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

    platforms.forEach((platform) => {
      if (!platform.moving) return;
      platform.x += platform.speed * platform.dir;
      if (platform.x <= platform.minX || platform.x + platform.w >= platform.maxX) platform.dir *= -1;
    });

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
      if (enemy.hitTimer > 0) enemy.hitTimer--;
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
        // Hold a deliberate combat distance and aim at the player's predicted path.
        const playerCenter = state.x + state.width / 2;
        const bossCenter = enemy.x + enemy.width / 2;
        const horizontalGap = playerCenter - bossCenter;
        enemy.facing = horizontalGap < 0 ? "left" : "right";
        if (Math.abs(horizontalGap) > 180) enemy.x += Math.sign(horizontalGap) * enemy.speed * 0.9;
        if (Math.abs(horizontalGap) < 100) enemy.x -= Math.sign(horizontalGap || 1) * enemy.speed * 0.55;
        enemy.x = Math.max(20, Math.min(670, enemy.x));
        enemy.shootCooldown--;
        if (enemy.shootCooldown <= 0) {
          enemy.shootCooldown = 115 + Math.random() * 35;
          const predictedX = playerCenter + state.vx * 18;
          const baseAngle = Math.atan2((state.y + state.height / 2) - (enemy.y + 46), predictedX - bossCenter);
          for (let aOffset of [-0.18, 0, 0.18]) {
            state.bullets.push({ x: bossCenter, y: enemy.y + 46, vx: Math.cos(baseAngle + aOffset) * 3.8, vy: Math.sin(baseAngle + aOffset) * 3.8, size: 6 });
          }
          window.WonderSound?.play("shoot");
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
        state.exp += Math.ceil(orb.value * getStats().expBonus);
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

          // Elite seals now open the next route directly; no gear chest system.
          state.exp += Math.ceil(35 * getStats().expBonus);
          state.pickups.push({ x: 740, y: 184, type: "portal" });
        } else if (pickup.type === "portal") {
          state.pickups.splice(index, 1);
          if (state.room >= 8) endGame(true);
          else enterNextRoom();
        }
      }
    });

    // Render Canvas Frame
    drawCanvasFrame();

    state.gameLoopId = requestAnimationFrame(updateGameEngine);
  }

  function applyPlayerDamage(amt) {
    if (state.invincibilityTimer > 0) return;
    const stats = getStats();
    if (Math.random() < stats.dodge) return;
    state.playerHp = Math.max(0, state.playerHp - Math.max(0.5, amt - stats.defense));
    renderStatsPanel();

    if (state.playerHp <= 0) {
      endGame(false);
    }
  }

  function drawImageContain(ctx, image, x, y, w, h, flip = false) {
    if (!image || !image.complete || !image.naturalWidth) return false;
    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;
    ctx.save();
    if (flip) {
      ctx.translate(x + w, y);
      ctx.scale(-1, 1);
      x = 0;
      y = 0;
    }
    const imageRatio = sourceWidth / sourceHeight;
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

  function drawEnemyFallback(ctx, enemy) {
    ctx.save();
    ctx.fillStyle = enemy.isElite ? "#a855f7" : "#22d3ee";
    ctx.strokeStyle = "#e0f2fe";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(enemy.width / 2, enemy.height / 2, enemy.width / 2 + 5, enemy.height / 2 + 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#07121f";
    ctx.fillRect(enemy.width * 0.58, enemy.height * 0.32, 5, 5);
    ctx.restore();
  }

  function drawHeroFallback(ctx) {
    ctx.save();
    ctx.fillStyle = "#22d3ee";
    ctx.strokeStyle = "#e0f2fe";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(state.width / 2, state.height / 2, state.width / 2 + 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#07121f";
    ctx.fillRect(state.width * 0.62, state.height * 0.28, 6, 6);
    ctx.restore();
  }

  function drawTileCell(ctx, cellIndex, x, y, w, h) {
    if (!assets.tiles.complete || !assets.tiles.naturalWidth) return false;
    const cellW = assets.tiles.naturalWidth / 6;
    ctx.drawImage(assets.tiles, cellW * cellIndex, 0, cellW, assets.tiles.naturalHeight, x, y, w, h);
    return true;
  }

  function drawMossPlatform(ctx, plat) {
    if (plat.kind === "generated") {
      ctx.save();
      const stone = ctx.createLinearGradient(plat.x, plat.y, plat.x, plat.y + plat.h);
      stone.addColorStop(0, "#b8d58a");
      stone.addColorStop(0.18, "#5d824a");
      stone.addColorStop(0.22, "#526b4b");
      stone.addColorStop(1, "#263c39");
      ctx.fillStyle = stone;
      ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
      ctx.shadowBlur = 7;
      ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
      ctx.strokeStyle = "rgba(220, 255, 175, 0.62)";
      ctx.strokeRect(plat.x + .5, plat.y + .5, plat.w - 1, plat.h - 1);
      ctx.strokeStyle = "rgba(23, 39, 41, 0.85)";
      ctx.lineWidth = 1;
      for (let x = plat.x + 16; x < plat.x + plat.w; x += 28) ctx.strokeRect(x, plat.y + 8, 24, plat.h - 9);
      ctx.fillStyle = "rgba(191, 232, 123, 0.65)";
      ctx.fillRect(plat.x + 3, plat.y + 2, plat.w - 6, 3);
      ctx.restore();
      return;
    }
    // The illustrated ruins already contain the production platform art. This
    // restrained edge is only a collision cue, preventing a second mismatched
    // tile layer from covering the scene or suggesting a false floor.
    ctx.save();
    ctx.strokeStyle = plat.kind === "ground" ? "rgba(225, 255, 184, 0.28)" : "rgba(231, 255, 196, 0.44)";
    ctx.shadowColor = "rgba(9, 36, 23, 0.7)";
    ctx.shadowBlur = 4;
    ctx.lineWidth = plat.kind === "ground" ? 2 : 2.5;
    ctx.beginPath();
    ctx.moveTo(plat.x, plat.y + 0.5);
    ctx.lineTo(plat.x + plat.w, plat.y + 0.5);
    ctx.stroke();
    ctx.restore();
  }

  // Draw 2D Canvas side-scroller elements
  function drawCanvasFrame() {
    const ctx = nodes.gameCanvas.getContext("2d");
    ctx.clearRect(0, 0, 800, 500);

    // 1. Background image
    const background = state.room <= 2 ? assets.bg : state.room <= 4 ? assets.bgCrystal : state.room <= 6 ? assets.bgJungle : state.room === 7 ? assets.bgRift : assets.bgVolcanic;
    if (background.complete) {
      ctx.drawImage(background, 0, 0, 800, 500);
    } else {
      ctx.fillStyle = "#0c1020";
      ctx.fillRect(0, 0, 800, 500);
    }

    // 2. Draw platforms
    platforms.forEach((plat) => {
      drawMossPlatform(ctx, plat);
    });

    // 3. Draw crystalline thorn hazards instead of flat red triangles.
    spikesList.forEach((spike) => {
      const step = 20;
      const count = Math.ceil(spike.w / step);
      for (let i = 0; i < count; i++) {
        const x = spike.x + i * step;
        const gradient = ctx.createLinearGradient(x, spike.y, x, spike.y + spike.h);
        gradient.addColorStop(0, "#fef3c7");
        gradient.addColorStop(0.3, "#fb7185");
        gradient.addColorStop(1, "#7f1d1d");
        ctx.fillStyle = gradient;
        ctx.strokeStyle = "rgba(255, 228, 230, 0.72)";
        ctx.lineWidth = 1;
        ctx.shadowColor = "rgba(244, 63, 94, 0.72)";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(x, spike.y + spike.h);
        ctx.lineTo(x + step * 0.5, spike.y);
        ctx.lineTo(x + step, spike.y + spike.h);
        ctx.fill();
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    });

    // 4. Draw pickups (key, chest, portal)
    state.pickups.forEach((pickup) => {
      if (pickup.type === "key") {
        drawImageContain(ctx, assets.chestFx, pickup.x - 16, pickup.y - 16, 32, 32);
      } else if (pickup.type === "chest") {
        drawTileCell(ctx, 4, pickup.x - 24, pickup.y - 24, 48, 48);
      } else if (pickup.type === "portal") {
        drawTileCell(ctx, 3, pickup.x - 28, pickup.y - 28, 56, 56);
        drawPortal(ctx, pickup.x, pickup.y);
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
      if ((enemy.bounds && enemy.bounds.dir === -1) || enemy.facing === "left") {
        ctx.translate(enemy.x + enemy.width, enemy.y);
        ctx.scale(-1, 1);
      } else {
        ctx.translate(enemy.x, enemy.y);
      }

      if (enemy.type === "boss") {
        const bossSprite = enemy.variant === "basilisk" ? assets.bossBasilisk : enemy.variant === "guardian" ? assets.bossGuardian : assets.boss;
        const bossY = enemy.variant === "basilisk" ? spriteAnchors.basiliskY : enemy.variant === "guardian" ? spriteAnchors.guardianY : spriteAnchors.behemothY;
        const drewBoss = drawImageContain(ctx, bossSprite, -12, bossY, enemy.width + 24, enemy.height + 62);
        if (enemy.hitTimer > 0) {
          ctx.save(); ctx.globalAlpha = 0.72; ctx.globalCompositeOperation = "screen";
          drawImageContain(ctx, bossSprite, -12, bossY, enemy.width + 24, enemy.height + 62); ctx.restore();
        }
        if (!drewBoss) drawEnemyFallback(ctx, enemy);
      } else {
        const sprite = enemy.type === "boar" ? assets.boar : enemy.type === "wolf" ? assets.enemyWolf : assets.bat;
        const visualY = enemy.type === "wolf" ? spriteAnchors.hunterY : enemy.type === "boar" ? spriteAnchors.boarY : -10;
        const drewEnemy = drawImageContain(ctx, sprite, -22, visualY, enemy.width + 44, enemy.height + 60);
        if (enemy.hitTimer > 0) {
          ctx.save(); ctx.globalAlpha = 0.72; ctx.globalCompositeOperation = "screen";
          drawImageContain(ctx, sprite, -22, visualY, enemy.width + 44, enemy.height + 60); ctx.restore();
        }
        if (!drewEnemy) drawEnemyFallback(ctx, enemy);
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

    if (assets.wolf.complete && assets.wolf.naturalWidth) {
      // Render flashing hit texture
      if (state.invincibilityTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
        ctx.globalAlpha = 0.4;
      }
      if (!drawImageContain(ctx, assets.wolf, -20, spriteAnchors.heroY, state.width + 40, state.height + 72)) drawHeroFallback(ctx);
      ctx.globalAlpha = 1.0;
    } else {
      drawHeroFallback(ctx);
    }

    ctx.restore();

    // 9. Draw Slash Swipe overlay
    if (state.attackTimer > 0) drawClawArc(ctx);

    // 10. Update & Draw sparks particles
    updateSparksParticles(ctx);
    drawDamageNumbers(ctx);
  }

  function drawDamageNumbers(ctx) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = "800 17px system-ui";
    damageNumbers = damageNumbers.filter((number) => {
      number.y -= 0.75;
      number.life--;
      ctx.globalAlpha = Math.min(1, number.life / 12);
      ctx.fillStyle = number.crit ? "#fde047" : "#f8fafc";
      ctx.strokeStyle = "#07121f";
      ctx.lineWidth = 3;
      const label = `${number.crit ? "CRIT " : ""}${number.value}`;
      ctx.strokeText(label, number.x, number.y);
      ctx.fillText(label, number.x, number.y);
      return number.life > 0;
    });
    ctx.restore();
  }

  function drawClawArc(ctx) {
    const direction = state.facing === "left" ? -1 : 1;
    const originX = state.x + (direction > 0 ? state.width + 8 : -8);
    const originY = state.y + 18;
    const progress = 1 - state.attackTimer / getStats().attackFrames;
    ctx.save();
    ctx.translate(originX, originY);
    ctx.scale(direction, 1);
    ctx.lineCap = "round";
    ctx.globalAlpha = 0.95 - progress * 0.45;
    for (let line = 0; line < 3; line++) {
      ctx.beginPath();
      ctx.strokeStyle = line === 1 ? "#d8fbff" : "#26e7ff";
      ctx.lineWidth = 3 - line * 0.45;
      ctx.shadowColor = "#06b6d4";
      ctx.shadowBlur = 10;
      ctx.arc(8 + line * 7, 2, 24 + line * 5, -1.25 + progress * 0.4, 0.55 + progress * 0.4);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Visual effects
  function drawPortal(context, x, y) {
    context.save();
    context.translate(x, y);
    for (let ring = 0; ring < 3; ring += 1) {
      context.strokeStyle = ring === 0 ? "#a855f7" : "#22d3ee";
      context.globalAlpha = 0.9 - ring * 0.2;
      context.lineWidth = 5 - ring;
      context.beginPath();
      context.ellipse(0, 0, 20 - ring * 5, 29 - ring * 7, 0, 0, Math.PI * 2);
      context.stroke();
    }
    context.restore();
  }

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
    document.querySelector("#gamePanel .game-layout")?.append(nodes.resultPanel);
    loadLocalState();
    updateDiamondShopUI();
    translateUI();
    setupInputs();

    nodes.startBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      showStage();
    });

    nodes.zoneButtons.forEach((button) => {
      button.addEventListener("click", () => {
        window.WonderSound?.play("click");
        state.zone = Number(button.dataset.zone);
        startRun(state.zone);
      });
    });
    nodes.mapBackBtn.addEventListener("click", () => {
      showMain();
    });
    nodes.attributeButtons.forEach((button) => button.addEventListener("click", () => spendAttribute(button.dataset.attribute)));
    nodes.draftCards.addEventListener("click", (event) => {
      const choice = event.target.closest("[data-draft-attribute]");
      if (choice) spendAttribute(choice.dataset.draftAttribute);
    });

    nodes.retryBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      startRun();
    });

    nodes.menuBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      showStage();
    });

    nodes.resultMenuBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      showMain();
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
      if (!nodes.draftPanel.classList.contains("hidden")) renderAttributeDraft();
    });
    setScreen("main");

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
          attributePoints: state.attributePoints,
          attributes: {
            strength: state.strength,
            agility: state.agility,
            constitution: state.constitution,
            luck: state.luck,
          },
          stats: {
            dmg: stats.dmg,
            speed: stats.speed,
            maxHp: stats.maxHp,
            crit: stats.crit,
          },
          hpText: nodes.hpText.textContent,
          hp: Math.ceil(state.playerHp),
          maxHp: stats.maxHp,
          keys: state.keys,
          record: { runs: state.runs, bestRoom: state.bestRoom, wins: state.wins },
          player: {
            x: Math.round(state.x),
            y: Math.round(state.y),
            width: state.width,
            height: state.height,
            grounded: state.grounded,
          },
          terrain: platforms.map((platform) => ({ x: platform.x, y: platform.y, w: platform.w, h: platform.h, kind: platform.kind })),
          spikes: spikesList.map((spike) => ({ x: spike.x, y: spike.y, w: spike.w, h: spike.h })),
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
      forceDamageEffect() {
        const enemy = state.enemies[0];
        if (!enemy) return this.readState();
        enemy.hitTimer = 10;
        damageNumbers.push({ x: enemy.x + enemy.width / 2, y: enemy.y - 4, value: 18, crit: true, life: 34 });
        drawCanvasFrame();
        return { ...this.readState(), damageNumbers: damageNumbers.length, enemyHitTimer: enemy.hitTimer };
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
