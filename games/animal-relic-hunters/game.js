(() => {
  const ARENA_WIDTH = 800;
  const ARENA_HEIGHT = 1000;
  const GAME_ID = "animal-relic-hunters";
  const saveKey = "weightplay_relic_hunters_v1";
  const profileKey = "weightplay:animal-relic-hunters:profile:v1";
  const localeKey = "weightPlayLocale";

  const $ = (id) => document.getElementById(id);
  const nodes = {
    localeSelect: $("localeSelect"),
    menuPanel: $("menuPanel"),
    stagePanel: $("stagePanel"),
    expeditionRail: $("expeditionRail"),
    stageConfigMount: $("stageConfigMount"),
    showStageBtn: $("showStageBtn"),
    stageBackBtn: $("stageBackBtn"),
    stageTitle: $("stageTitle"),
    stageSetupText: $("stageSetupText"),
    gamePanel: $("gamePanel"),
    backToStageBtn: $("backToStageBtn"),
    draftPanel: $("draftPanel"),
    lootPanel: $("lootPanel"),
    resultPanel: $("resultPanel"),
    menuCover: $("menuCover"),
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
    goldText: $("goldText"),
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
    growthPrompt: $("growthPrompt"),
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
    goldBalance: $("goldBalance"),
    trainingPoints: $("trainingPoints"),
    trainingList: $("trainingList"),
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
      menuHint: "Move with WASD / virtual joystick. On desktop, hold the left mouse button in the arena to move toward the cursor. Defeat shadow beasts, collect Relic Orbs to level up, and find keys to unlock chests for Weapons, Armor, and Boots.",
      prototypeGoalsTitle: "Expedition Goal",
      prototypeGoalsText: "Clear Room 3, defeat the Behemoth Boss, collect Relic Orbs, and grow stronger with permanent training and gear upgrades.",
      diamondShopTitle: "Permanent Upgrade",
      goldLabel: "Gold",
      trainingTitle: "Permanent Training",
      trainingPoints: "Points",
      trainingNote: "Character level is permanent. Spend level points here so every run starts stronger.",
      growthReadyTitle: "Next permanent growth",
      growthReadyTraining: "Spend {points} training point(s) before the next run.",
      growthReadyGear: "Upgrade {gear} for {gold} gold.",
      growthReadyBoth: "Train first, then upgrade {gear} for {gold} gold.",
      growthReadyNone: "Fight for gold and EXP, then return here to train or upgrade gear.",
      train_damage: "Attack Training",
      train_damage_desc: "+2 damage per level.",
      train_hp: "Vitality Training",
      train_hp_desc: "+5 max HP per level.",
      train_speed: "Agility Training",
      train_speed_desc: "+0.2 move speed per level.",
      train_magnet: "Relic Sense",
      train_magnet_desc: "+15px pickup range per level.",
      trainAction: "Train",
      trainMax: "Max",
      upgradeGearAction: "Upgrade",
      upgradeNeedGold: "Need {gold} gold",
      gearLevelLabel: "Lv.{level}",
      goldEarned: "Gold",
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
      backToStage: "Back to Missions",
      sidebarInventory: "Equipped Gear",
      sidebarStats: "Character Stats",
      slotWeapon: "WEAPON",
      slotArmor: "ARMOR",
      slotBoots: "BOOTS",
      noneLabel: "None",
      statDamage: "Damage:",
      statMaxHp: "Max HP",
      statAttackRate: "Attack Rate:",
      statSpeed: "Speed:",
      statMagnetRange: "Magnet Range:",
      hudStage: "Rooms Cleared",
      runComplete: "Expedition Success!",
      runFailed: "Explorer Defeated",
      resultSummaryLevel: "Saved Level",
      resultSummaryRooms: "Rooms",
      resultSummaryKeys: "Run Keys",
      resultSummaryGold: "Gold Earned",
      resultSummaryGear: "Equipped Gear",
      resultSummaryNoGear: "No gear equipped yet",
      resultSummaryNext: "Next Growth",
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
      report_no_wins: "Keep exploring! Focus on picking up keys and keeping your health up.",
      bossWarning: "Boss Behemoth approaching!"
    },
    "zh-Hant": {
      title: "動物遺跡獵人",
      menuTitle: "探索古代遺跡。",
      menuHint: "使用 WASD 或虛擬搖桿移動。電腦版請在戰鬥場景按住滑鼠左鍵，朝游標方向移動。擊敗怪物，收集能量球升級，並獲得鑰匙以解鎖寶箱獲得武器、防具與鞋子。",
      prototypeGoalsTitle: "遠征目標",
      prototypeGoalsText: "通過第 3 個房間並擊敗遺跡巨獸 Boss，收集遺跡能量球，透過永久訓練與裝備升級變得更強。",
      diamondShopTitle: "永久升級",
      goldLabel: "金幣",
      trainingTitle: "永久訓練",
      trainingPoints: "點數",
      trainingNote: "角色等級會永久保存。把升級點數投到這裡，每次探險一開始都會更強。",
      train_damage: "攻擊訓練",
      train_damage_desc: "每級增加 2 點傷害。",
      train_hp: "體力訓練",
      train_hp_desc: "每級增加 5 點生命上限。",
      train_speed: "敏捷訓練",
      train_speed_desc: "每級增加 0.2 移動速度。",
      train_magnet: "遺跡感知",
      train_magnet_desc: "每級增加 15px 拾取範圍。",
      trainAction: "訓練",
      trainMax: "滿級",
      upgradeGearAction: "升級",
      upgradeNeedGold: "需要 {gold} 金幣",
      gearLevelLabel: "Lv.{level}",
      goldEarned: "金幣",
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
      statMaxHp: "生命上限",
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
    title: "動物遺跡獵人",
    menuTitle: "探索古代動物遺跡",
    menuHint: "使用 WASD 或虛擬搖桿移動。電腦版請在戰鬥場景按住滑鼠左鍵，朝游標方向移動。擊敗影獸、收集遺跡能量球升級，並找到金鑰開啟寶箱取得武器、防具與靴子。",
    prototypeGoalsTitle: "遠征目標",
    prototypeGoalsText: "通過第 3 個房間、擊敗遺跡巨獸 Boss、收集遺跡能量球，並透過永久訓練與裝備升級變得更強。",
    diamondShopTitle: "永久升級",
    goldLabel: "金幣",
    trainingTitle: "永久訓練",
    trainingPoints: "點數",
    trainingNote: "角色等級會永久保存。把升級點數投到這裡，每次探險一開始都會更強。",
    growthReadyTitle: "下一步永久成長",
    growthReadyTraining: "先使用 {points} 點訓練點數，下一場會直接變強。",
    growthReadyGear: "可用 {gold} 金幣升級 {gear}。",
    growthReadyBoth: "先點永久訓練，再用 {gold} 金幣升級 {gear}。",
    growthReadyNone: "戰鬥取得金幣與經驗，回到這裡升級訓練或裝備。",
    train_damage: "攻擊訓練",
    train_damage_desc: "每級增加 2 點傷害。",
    train_hp: "體力訓練",
    train_hp_desc: "每級增加 5 點生命上限。",
    train_speed: "敏捷訓練",
    train_speed_desc: "每級增加 0.2 移動速度。",
    train_magnet: "遺跡感知",
    train_magnet_desc: "每級增加 15px 拾取範圍。",
    trainAction: "訓練",
    trainMax: "滿級",
    upgradeGearAction: "升級",
    upgradeNeedGold: "需要 {gold} 金幣",
    gearLevelLabel: "Lv.{level}",
    goldEarned: "金幣",
    amuletName: "迷霧護符",
    amuletEffect: "每次探險開始時生命上限 +10（從 30 HP 變成 40 HP）。",
    amuletOwned: "已擁有：每次探險都會以 40 Max HP 開始。",
    startRun: "開始探險",
    menu: "選單",
    hudHp: "生命值",
    roomLabel: "房間",
    keysLabel: "鑰匙",
    chooseCard: "選擇遺跡能力",
    chooseCardDesc: "選擇一個古代遺跡能力，強化你的探險家。",
    rerollRelics: "重抽遺跡能力",
    rerollRelicsUsed: "本次升級已使用重抽。",
    rerollRelicsNeedDiamonds: "鑽石不足，無法重抽。",
    lootFound: "遺跡寶箱已開啟！",
    equipLoot: "穿戴裝備",
    backpackTitle: "背包",
    backpackEmpty: "開啟遺跡寶箱即可收集永久裝備。",
    equipGearAction: "穿戴",
    equippedTag: "已穿戴",
    tryAgain: "再玩一次",
      backToMenu: "返回選單",
      backToStage: "返回任務",
    sidebarInventory: "已穿戴裝備",
    sidebarStats: "角色能力",
    slotWeapon: "武器",
    slotArmor: "防具",
    slotBoots: "靴子",
    noneLabel: "無",
    statDamage: "傷害：",
    statMaxHp: "生命上限",
    statAttackRate: "攻擊間隔：",
    statSpeed: "移動速度：",
    statMagnetRange: "吸取範圍：",
    hudStage: "\u5df2\u901a\u95dc\u623f\u9593",
    resultSummaryLevel: "\u4fdd\u5b58\u7b49\u7d1a",
    resultSummaryRooms: "\u623f\u9593\u9032\u5ea6",
    resultSummaryKeys: "\u672c\u8f2a\u91d1\u9470",
    resultSummaryGold: "本輪金幣",
    resultSummaryGear: "\u5df2\u7a7f\u6234\u88dd\u5099",
    resultSummaryNoGear: "\u5c1a\u672a\u7a7f\u6234\u88dd\u5099",
    resultSummaryNext: "下一步成長",
    resultDisclaimer: "僅供遊戲娛樂與本機進度紀錄。",
    skillReportTitle: "能力分析報告",
    skillLogic: "邏輯力",
    skillFocus: "專注力",
    skillProblem: "問題解決",
    relic_magnet: "遺跡磁力",
    relic_magnet_desc: "吸取範圍增加 40px。",
    relic_speed: "燈火爆發",
    relic_speed_desc: "武器發射間隔降低 20%。",
    relic_shield: "守護之心",
    relic_shield_desc: "生命上限 +5，並立即恢復 5 HP。",
    relic_damage: "水晶獸牙",
    relic_damage_desc: "子彈傷害提高 20%。",
    relic_heal: "月泉吐息",
    relic_heal_desc: "立即恢復 12 HP。",
    gear_sword_rare: "水晶長劍",
    gear_sword_rare_desc: "+30% 子彈傷害",
    gear_dagger_epic: "遺跡短刃",
    gear_dagger_epic_desc: "-30% 射擊間隔",
    gear_armor_rare: "遺跡胸甲",
    gear_armor_rare_desc: "+10 生命上限",
    gear_armor_epic: "黃金遺跡鎧甲",
    gear_armor_epic_desc: "+20 生命上限",
    gear_boots_rare: "探險靴",
    gear_boots_rare_desc: "+20% 移動速度",
    gear_boots_epic: "疾風遺跡靴",
    gear_boots_epic_desc: "+40% 移動速度",
    rarity_rare: "稀有裝備",
    rarity_epic: "史詩裝備",
    report_win: "傳奇獵人！你擊敗遺跡巨獸、穿戴強力裝備，成功解開古代遺跡的謎團。",
    report_partial: "不錯的探險家！你抵達第 {room} 個房間。提升等級並換上更強裝備，下次就能挑戰遺跡巨獸。",
    report_no_wins: "繼續探索！先專注收集鑰匙、開啟寶箱，並保持生命值。",
    bossWarning: "遺跡巨獸即將出現！"
  });

  Object.assign(text.en, {
    startGame: "Start Game",
    chooseExpedition: "Choose Ruin Region",
    expeditionGoal: "3 rooms · Recommended Lv.{level}",
    expeditionLocked: "Complete Region {region} first",
    lootNewGear: "New gear added to backpack.",
    lootDuplicateGear: "Duplicate gear converted into +{gold} gold.",
    gearCurrentEffect: "Now: {effect}",
    gearNextEffect: "Next: {effect}",
    gearMaxLevel: "Max level",
  });

  Object.assign(text["zh-Hant"], {
    startGame: "\u958b\u59cb\u904a\u6232",
    chooseExpedition: "\u9078\u64c7\u907a\u8de1\u5340\u57df",
    expeditionGoal: "3 \u500b\u623f\u9593\u00b7\u5efa\u8b70 Lv.{level}",
    expeditionLocked: "\u5148\u5b8c\u6210\u7b2c {region} \u5340",
    lootNewGear: "\u65b0\u88dd\u5099\u5df2\u52a0\u5165\u80cc\u5305\u3002",
    lootDuplicateGear: "\u91cd\u8907\u88dd\u5099\u5df2\u8f49\u6210 +{gold} \u91d1\u5e63\u3002",
    gearCurrentEffect: "\u76ee\u524d\uff1a{effect}",
    gearNextEffect: "\u4e0b\u4e00\u7d1a\uff1a{effect}",
    gearMaxLevel: "\u5df2\u6eff\u7d1a",
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
  assets.hero.src = "../../assets/weightplay-boom-mane-lion.png";
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

  const expeditionDefs = [
    { id: 1, level: 1, en: "Moss Gate", zh: "\u82d4\u75d5\u4e4b\u9580" },
    { id: 2, level: 4, en: "Echo Gallery", zh: "\u56de\u8072\u9577\u5eca" },
    { id: 3, level: 7, en: "Crystal Vault", zh: "\u6c34\u6676\u5730\u5eab" },
    { id: 4, level: 10, en: "Sunken Shrine", zh: "\u6c89\u6c92\u795e\u6bbf" },
    { id: 5, level: 13, en: "Behemoth Throne", zh: "\u5de8\u7378\u738b\u5ea7" },
  ];

  // State Variables
  let state = {
    amuletUnlocked: false,
    playerMaxHp: 30,
    playerHp: 30,
    playerX: 400,
    playerY: ARENA_HEIGHT / 2,
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
    gold: 0,
    runGold: 0,

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
    bossWarningUntil: 0,
    lastHitSoundAt: 0,
  };

  let profile = createDefaultProfile();
  let selectedExpedition = 1;

  function createDefaultProfile() {
    return {
      level: 1,
      exp: 0,
      expNeed: 100,
      gold: 0,
      statPoints: 0,
      training: {
        damage: 0,
        hp: 0,
        speed: 0,
        magnet: 0,
      },
      gearLevels: {},
      inventory: [],
      equipped: {
        weapon: null,
        armor: null,
        boots: null,
      },
      unlockedExpedition: 1,
      bestExpedition: 0,
    };
  }

  function normalizeProfile(data) {
    const next = createDefaultProfile();
    if (!data || typeof data !== "object") return next;

    next.level = Math.max(1, Math.floor(Number(data.level) || 1));
    next.exp = Math.max(0, Math.floor(Number(data.exp) || 0));
    next.expNeed = Math.max(100, Math.floor(Number(data.expNeed) || 100));
    next.gold = Math.max(0, Math.floor(Number(data.gold) || 0));
    next.unlockedExpedition = Math.max(1, Math.min(5, Math.floor(Number(data.unlockedExpedition) || 1)));
    next.bestExpedition = Math.max(0, Math.min(5, Math.floor(Number(data.bestExpedition) || 0)));

    const training = data.training && typeof data.training === "object" ? data.training : {};
    for (const key of ["damage", "hp", "speed", "magnet"]) {
      next.training[key] = Math.max(0, Math.min(10, Math.floor(Number(training[key]) || 0)));
    }

    if (Array.isArray(data.inventory)) {
      next.inventory = [...new Set(data.inventory.filter((key) => gearDb[key]))];
    }

    const gearLevels = data.gearLevels && typeof data.gearLevels === "object" ? data.gearLevels : {};
    for (const key of next.inventory) {
      next.gearLevels[key] = Math.max(1, Math.min(10, Math.floor(Number(gearLevels[key]) || 1)));
    }

    const equipped = data.equipped && typeof data.equipped === "object" ? data.equipped : {};
    for (const slot of ["weapon", "armor", "boots"]) {
      const key = equipped[slot];
      next.equipped[slot] = gearDb[key]?.slot === slot ? key : null;
      if (next.equipped[slot] && !next.inventory.includes(next.equipped[slot])) {
        next.inventory.push(next.equipped[slot]);
      }
    }

    for (const key of next.inventory) {
      next.gearLevels[key] = Math.max(1, Math.min(10, Math.floor(Number(gearLevels[key]) || next.gearLevels[key] || 1)));
    }

    while (next.exp >= next.expNeed) {
      next.exp -= next.expNeed;
      next.level += 1;
      next.expNeed = Math.floor(next.expNeed * 1.3);
    }

    const spentPoints = Object.values(next.training).reduce((sum, value) => sum + value, 0);
    const earnedPoints = Math.max(0, next.level - 1);
    const storedPoints = Math.max(0, Math.floor(Number(data.statPoints) || 0));
    next.statPoints = Math.max(storedPoints, earnedPoints - spentPoints);

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
    state.gold = profile.gold;
    state.eqWeapon = profile.equipped.weapon;
    state.eqArmor = profile.equipped.armor;
    state.eqBoots = profile.equipped.boots;
  }

  // Keyboard Movement Vector
  let keysPressed = {};
  let touchStartPos = null;
  let moveVector = { x: 0, y: 0 };
  let mouseMoveActive = false;
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

  const ariaText = {
    en: {
      lobby: "Go back to lobby",
      language: "Language selector",
      stageBack: "Back to main",
      regions: "Ruin regions",
      battleBack: "Back to preparation"
    },
    "zh-Hant": {
      lobby: "\u8fd4\u56de\u5927\u5ef3",
      language: "\u8a9e\u8a00\u9078\u64c7\u5668",
      stageBack: "\u8fd4\u56de\u9996\u9801",
      regions: "\u907a\u8de1\u5340\u57df",
      battleBack: "\u8fd4\u56de\u884c\u524d\u6e96\u5099"
    }
  };

  function translateAriaLabels(locale) {
    const labels = ariaText[locale] || ariaText.en;
    nodes.menuBtn.setAttribute("aria-label", labels.lobby);
    nodes.localeSelect.setAttribute("aria-label", labels.language);
    nodes.stageBackBtn.setAttribute("aria-label", labels.stageBack);
    nodes.expeditionRail.setAttribute("aria-label", labels.regions);
    nodes.backToStageBtn.setAttribute("aria-label", labels.battleBack);
  }

  const trainingDefs = [
    { key: "damage", nameKey: "train_damage", descKey: "train_damage_desc", max: 10 },
    { key: "hp", nameKey: "train_hp", descKey: "train_hp_desc", max: 10 },
    { key: "speed", nameKey: "train_speed", descKey: "train_speed_desc", max: 10 },
    { key: "magnet", nameKey: "train_magnet", descKey: "train_magnet_desc", max: 10 },
  ];

  function gearLevel(key) {
    return Math.max(1, Math.min(10, Math.floor(Number(profile.gearLevels?.[key]) || 1)));
  }

  function gearUpgradeCost(key) {
    const g = gearDb[key];
    if (!g) return 999999;
    const level = gearLevel(key);
    const rarityBase = g.typeKey === "rarity_epic" ? 90 : 55;
    return Math.floor(rarityBase * Math.pow(1.45, level - 1));
  }

  function gearScaleAtLevel(level) {
    return 1 + (Math.max(1, Math.min(10, Math.floor(Number(level) || 1))) - 1) * 0.18;
  }

  function gearScale(key) {
    return gearScaleAtLevel(gearLevel(key));
  }

  function describeGearEffectAtLevel(key, level) {
    const g = gearDb[key];
    if (!g) return "";
    const scale = gearScaleAtLevel(level);
    if (g.bonusDmg) return `+${(g.bonusDmg * scale).toFixed(1)} ${t("statDamage").replace(":", "")}`;
    if (g.bonusRate) return `-${Math.round(g.bonusRate * scale * 100)}% ${t("statAttackRate").replace(":", "")}`;
    if (g.bonusHp) return `+${Math.round(g.bonusHp * scale)} ${t("statMaxHp") || "Max HP"}`;
    if (g.bonusSpeed) return `+${(g.bonusSpeed * scale).toFixed(1)} ${t("statSpeed").replace(":", "")}`;
    return t(g.effectKey);
  }

  function describeGearEffect(key) {
    return describeGearEffectAtLevel(key, gearLevel(key));
  }

  function describeGearNextEffect(key) {
    const level = gearLevel(key);
    if (level >= 10) return t("gearMaxLevel");
    return t("gearNextEffect", { effect: describeGearEffectAtLevel(key, level + 1) });
  }

  function duplicateGearGold(key) {
    const g = gearDb[key];
    if (!g) return 0;
    const base = g.typeKey === "rarity_epic" ? 55 : 30;
    return base + (gearLevel(key) * 5);
  }

  function nextGearUpgradeCandidate() {
    const equipped = Object.values(profile.equipped || {}).filter(Boolean);
    const owned = Array.from(new Set([...equipped, ...(profile.inventory || [])]));
    return owned
      .filter((key) => gearDb[key] && gearLevel(key) < 10)
      .map((key) => ({
        key,
        cost: gearUpgradeCost(key),
        name: t(gearDb[key].nameKey),
      }))
      .sort((a, b) => a.cost - b.cost)[0] || null;
  }

  function nextGrowthText() {
    const points = Math.max(0, Math.floor(Number(profile.statPoints) || 0));
    const gear = nextGearUpgradeCandidate();
    const canUpgradeGear = gear && profile.gold >= gear.cost;

    if (points > 0 && canUpgradeGear) {
      return t("growthReadyBoth", { points, gear: gear.name, gold: gear.cost });
    }
    if (points > 0) {
      return t("growthReadyTraining", { points });
    }
    if (canUpgradeGear) {
      return t("growthReadyGear", { gear: gear.name, gold: gear.cost });
    }
    return t("growthReadyNone");
  }

  function renderGrowthPrompt() {
    if (!nodes.growthPrompt) return;
    const body = nextGrowthText();
    nodes.growthPrompt.innerHTML = `
      <strong>${t("growthReadyTitle")}</strong>
      <span>${body}</span>
    `;
  }

  const metaText = {
    en: {
      description: "Explore ancient ruins, level up, collect chests, and equip Weapons, Armor, and Boots in this animal roguelite survivor.",
      ogDescription: "Defeat shadow beasts, collect keys, and equip rare gear to defeat the Behemoth!"
    },
    "zh-Hant": {
      description: "遊玩《動物遺跡獵人》，探索古代遺跡、累積等級、開啟寶箱，並穿戴武器、護甲與靴子挑戰遺跡巨獸。",
      ogDescription: "擊敗暗影野獸、收集鑰匙、穿戴稀有裝備，挑戰遺跡巨獸。"
    }
  };

  function focusGamePanel() {
    requestAnimationFrame(() => {
      nodes.gamePanel.scrollIntoView({ block: "start", inline: "nearest" });
    });
  }

  function showMain() {
    state.gameActive = false;
    cancelAnimationFrame(state.gameLoopId);
    document.body.classList.remove("relic-playing", "relic-stage-select");
    document.body.classList.remove("relic-result");
    nodes.gamePanel.classList.add("hidden");
    nodes.stagePanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.menuPanel.classList.remove("hidden");
    updateDiamondShopUI();
    renderTrainingPanel();
    renderEquippedGear();
  }

  function renderExpeditionStage() {
    const currentLocale = getLocale();
    selectedExpedition = Math.max(1, Math.min(profile.unlockedExpedition || 1, selectedExpedition));
    nodes.expeditionRail.innerHTML = expeditionDefs.map((region) => {
      const locked = region.id > profile.unlockedExpedition;
      const name = currentLocale === "zh-Hant" ? region.zh : region.en;
      return `<button class="expedition-card stage-card ${region.id === selectedExpedition ? "is-selected" : ""} ${locked ? "is-locked" : ""}" data-expedition="${region.id}" type="button" ${locked ? "disabled" : ""}>
        <span>${currentLocale === "zh-Hant" ? `\u7b2c ${region.id} \u5340` : `Region ${region.id}`}</span>
        <strong>${name}</strong>
        <small>${locked ? t("expeditionLocked", { region: region.id - 1 }) : t("expeditionGoal", { level: region.level })}</small>
      </button>`;
    }).join("");
    nodes.expeditionRail.querySelectorAll(".expedition-card:not(.is-locked)").forEach((button) => {
      button.addEventListener("click", () => {
        selectedExpedition = Number(button.dataset.expedition);
        window.WonderSound?.play("click");
        startRun();
      });
    });
    nodes.stageTitle.textContent = t("chooseExpedition");
    nodes.stageSetupText.textContent = t("expeditionGoal", { level: expeditionDefs[selectedExpedition - 1].level });
    window.requestAnimationFrame(() => nodes.expeditionRail.querySelector(".is-selected")?.scrollIntoView({ inline: "center", block: "nearest" }));
  }

  function showStage() {
    state.gameActive = false;
    cancelAnimationFrame(state.gameLoopId);
    document.body.classList.remove("relic-playing");
    document.body.classList.remove("relic-result");
    document.body.classList.add("relic-stage-select");
    nodes.menuPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.gamePanel.classList.add("hidden");
    nodes.stagePanel.classList.remove("hidden");
    updateDiamondShopUI();
    renderTrainingPanel();
    renderEquippedGear();
    renderExpeditionStage();
  }

  function translateUI() {
    const locale = getLocale();
    document.documentElement.lang = locale;
    document.title = `${t("title")} - WeightPlay`;
    document.querySelector("meta[name='description']")?.setAttribute("content", metaText[locale]?.description || metaText.en.description);
    document.querySelector("meta[property='og:description']")?.setAttribute("content", metaText[locale]?.ogDescription || metaText.en.ogDescription);
    nodes.menuCover?.setAttribute("alt", locale === "zh-Hant" ? "\u52d5\u7269\u907a\u8de1\u7375\u4eba\u5c01\u9762" : "Animal Relic Hunters cover");
    for (const el of document.querySelectorAll("[data-ui]")) {
      const key = el.dataset.ui;
      el.textContent = t(key);
    }
    nodes.localeSelect.value = locale;
    translateAriaLabels(locale);
    updateDiamondShopUI();
    renderTrainingPanel();
    renderEquippedGear();
    renderGrowthPrompt();
    if (!nodes.stagePanel.classList.contains("hidden")) renderExpeditionStage();
  }

  function updateDiamondShopUI() {
    const wallet = window.WeightPlayWallet?.read() || { diamonds: 0 };
    nodes.diamondBalance.textContent = wallet.diamonds;
    if (nodes.goldBalance) nodes.goldBalance.textContent = profile.gold;
    renderGrowthPrompt();

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

  function renderTrainingPanel() {
    if (!nodes.trainingList) return;
    nodes.trainingPoints.textContent = profile.statPoints;
    nodes.trainingList.innerHTML = "";

    trainingDefs.forEach((def) => {
      const level = profile.training[def.key] || 0;
      const row = document.createElement("div");
      row.className = "training-row";
      row.innerHTML = `
        <span class="training-copy">
          <strong>${t(def.nameKey)} ${t("gearLevelLabel", { level })}</strong>
          <small>${t(def.descKey)}</small>
        </span>
      `;
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = level >= def.max ? t("trainMax") : t("trainAction");
      button.disabled = level >= def.max || profile.statPoints <= 0;
      button.addEventListener("click", () => spendTrainingPoint(def.key));
      row.appendChild(button);
      nodes.trainingList.appendChild(row);
    });
  }

  function spendTrainingPoint(key) {
    const def = trainingDefs.find((item) => item.key === key);
    if (!def || profile.statPoints <= 0 || profile.training[key] >= def.max) return;
    profile.training[key] += 1;
    profile.statPoints -= 1;
    saveProfile();
    syncStateFromProfile();
    renderTrainingPanel();
    renderStatsPanel();
    renderGrowthPrompt();
    updateHUDText();
    window.WonderSound?.play("upgrade");
  }

  // Calculate stats based on relics and equipped gear
  function getStats() {
    let dmg = state.baseDamage + (profile.training.damage * 2);
    let rate = state.baseRate;
    let speed = state.playerSpeed + (profile.training.speed * 0.2);
    let magnet = state.baseMagnet + (profile.training.magnet * 15);

    // Apply Gear Weapon
    if (state.eqWeapon) {
      const g = gearDb[state.eqWeapon];
      const scale = gearScale(state.eqWeapon);
      if (g.bonusDmg) dmg += g.bonusDmg * scale;
      if (g.bonusRate) rate *= Math.max(0.35, 1 - (g.bonusRate * scale));
    }
    // Apply Relics Firing Rate
    if (state.relicRateCount > 0) {
      rate *= Math.pow(0.8, state.relicRateCount);
    }
    if (state.relicDamageCount > 0) {
      dmg *= Math.pow(1.2, state.relicDamageCount);
    }

    // Apply Gear Armor
    let maxHp = (state.amuletUnlocked ? 40 : 30) + (state.relicHpCount * 5) + (profile.training.hp * 5);
    if (state.eqArmor) {
      const g = gearDb[state.eqArmor];
      if (g.bonusHp) maxHp += g.bonusHp * gearScale(state.eqArmor);
    }

    // Apply Gear Boots
    if (state.eqBoots) {
      const g = gearDb[state.eqBoots];
      if (g.bonusSpeed) speed += g.bonusSpeed * gearScale(state.eqBoots);
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
      nodes.eqWeaponName.textContent = `${t(g.nameKey)} ${t("gearLevelLabel", { level: gearLevel(state.eqWeapon) })}`;
      nodes.eqWeaponEffect.textContent = describeGearEffect(state.eqWeapon);
      nodes.eqWeaponEffect.style.display = "inline-block";
    } else {
      nodes.eqWeaponName.textContent = t("noneLabel");
      nodes.eqWeaponEffect.style.display = "none";
    }

    // Armor
    if (state.eqArmor) {
      const g = gearDb[state.eqArmor];
      nodes.eqArmorName.textContent = `${t(g.nameKey)} ${t("gearLevelLabel", { level: gearLevel(state.eqArmor) })}`;
      nodes.eqArmorEffect.textContent = describeGearEffect(state.eqArmor);
      nodes.eqArmorEffect.style.display = "inline-block";
    } else {
      nodes.eqArmorName.textContent = t("noneLabel");
      nodes.eqArmorEffect.style.display = "none";
    }

    // Boots
    if (state.eqBoots) {
      const g = gearDb[state.eqBoots];
      nodes.eqBootsName.textContent = `${t(g.nameKey)} ${t("gearLevelLabel", { level: gearLevel(state.eqBoots) })}`;
      nodes.eqBootsEffect.textContent = describeGearEffect(state.eqBoots);
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
      const level = gearLevel(key);
      const cost = gearUpgradeCost(key);
      const item = document.createElement("div");
      item.className = `backpack-item${equipped ? " is-equipped" : ""}`;
      item.dataset.gearKey = key;
      item.innerHTML = `
        <img src="${g.iconSrc}" alt="" aria-hidden="true">
        <span class="backpack-copy">
          <strong>${t(g.nameKey)}</strong>
          <small>${t("gearCurrentEffect", { effect: describeGearEffect(key) })}</small>
          <small class="gear-next-effect">${describeGearNextEffect(key)}</small>
        </span>
        <span class="gear-level-tag">${t("gearLevelLabel", { level })}</span>
        <span class="backpack-actions">
          <button class="gear-equip-btn${equipped ? " is-equipped" : ""}" type="button">${equipped ? t("equippedTag") : t("equipGearAction")}</button>
          <button class="gear-upgrade-btn" type="button">${level >= 10 ? t("gearMaxLevel") : `${t("upgradeGearAction")} ${cost}`}</button>
        </span>
      `;
      item.querySelector(".gear-equip-btn").addEventListener("click", () => equipGearItem(key));
      const upgradeBtn = item.querySelector(".gear-upgrade-btn");
      upgradeBtn.disabled = level >= 10 || profile.gold < cost;
      upgradeBtn.title = profile.gold < cost ? t("upgradeNeedGold", { gold: cost }) : "";
      upgradeBtn.addEventListener("click", () => upgradeGearItem(key));
      nodes.backpackList.appendChild(item);
    });
  }

  function addGearToInventory(key) {
    if (!gearDb[key]) return;
    if (!profile.inventory.includes(key)) {
      profile.inventory.push(key);
      profile.gearLevels[key] = Math.max(1, Math.floor(Number(profile.gearLevels[key]) || 1));
      saveProfile();
    }
  }

  function claimGearDrop(key) {
    if (!gearDb[key]) return { isNew: false, duplicateGold: 0 };
    if (!profile.inventory.includes(key)) {
      addGearToInventory(key);
      return { isNew: true, duplicateGold: 0 };
    }

    const duplicateGold = duplicateGearGold(key);
    gainGold(duplicateGold);
    return { isNew: false, duplicateGold };
  }

  function upgradeGearItem(key) {
    if (!gearDb[key] || !profile.inventory.includes(key)) return;
    const level = gearLevel(key);
    if (level >= 10) return;
    const cost = gearUpgradeCost(key);
    if (profile.gold < cost) return;
    profile.gold -= cost;
    profile.gearLevels[key] = level + 1;
    saveProfile();
    syncStateFromProfile();
    renderStatsPanel();
    renderEquippedGear();
    renderTrainingPanel();
    updateDiamondShopUI();
    renderBackpack();
    updateHUDText();
    window.WonderSound?.play("upgrade");
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
    renderGrowthPrompt();
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
    state.playerY = ARENA_HEIGHT / 2;
    state.room = 1;
    state.expedition = selectedExpedition;
    state.keys = 0;
    state.runKeys = 0;
    state.runGold = 0;

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
    nodes.stagePanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.gamePanel.classList.remove("hidden");
    document.body.classList.remove("relic-stage-select");
    document.body.classList.remove("relic-result");
    document.body.classList.add("relic-playing");
    focusGamePanel();

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
    const difficulty = 1 + ((state.expedition || 1) - 1) * 0.24;
    // Spawn basic enemies around borders
    const enemyCount = 8 + room * 4;
    for (let i = 0; i < enemyCount; i++) {
      const side = Math.floor(Math.random() * 4);
      let ex = 0, ey = 0;
      if (side === 0) { ex = Math.random() * ARENA_WIDTH; ey = -40; }
      else if (side === 1) { ex = ARENA_WIDTH + 40; ey = Math.random() * ARENA_HEIGHT; }
      else if (side === 2) { ex = Math.random() * ARENA_WIDTH; ey = ARENA_HEIGHT + 40; }
      else { ex = -40; ey = Math.random() * ARENA_HEIGHT; }

      const isBoar = room > 1 && Math.random() > 0.4;
      state.enemies.push({
        x: ex,
        y: ey,
        type: isBoar ? "boar" : "jaguar",
        hp: Math.round((isBoar ? 25 + room * 10 : 12 + room * 5) * difficulty),
        maxHp: Math.round((isBoar ? 25 + room * 10 : 12 + room * 5) * difficulty),
        speed: isBoar ? 1.0 : 2.0,
        isElite: false,
        size: isBoar ? 24 : 20,
      });
    }

    // Spawn 1 Elite enemy in the center to drop the key
    setTimeout(() => {
      if (!state.gameActive) return;
      if (room === 3) {
        state.bossWarningUntil = performance.now() + 2400;
        window.WonderSound?.play("boss");
      }
      state.enemies.push({
        x: 400,
        y: -50,
        type: room === 3 ? "boss" : "boar",
        hp: Math.round((room === 3 ? 400 : 80 + room * 40) * difficulty),
        maxHp: Math.round((room === 3 ? 400 : 80 + room * 40) * difficulty),
        speed: room === 3 ? 1.2 : 1.5,
        isElite: true,
        size: room === 3 ? 45 : 32,
      });
    }, 4000);
  }

  function updateHUDText() {
    nodes.roomText.textContent = `${state.room}/3`;
    nodes.keyText.textContent = state.keys;
    if (nodes.goldText) nodes.goldText.textContent = state.runGold;
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
      trail: [],
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

  function gainGold(amount) {
    const value = Math.max(0, Math.floor(Number(amount) || 0));
    if (value <= 0) return;
    state.runGold += value;
    profile.gold += value;
    state.gold = profile.gold;
    saveProfile();
    updateDiamondShopUI();
    updateHUDText();
  }

  function handleLevelUp() {
    state.level++;
    state.exp -= state.expNeed;
    state.expNeed = Math.floor(state.expNeed * 1.3);
    profile.statPoints += 1;
    profile.level = state.level;
    profile.exp = state.exp;
    profile.expNeed = state.expNeed;
    saveProfile();
    window.WonderSound?.play("success");

    // Pause game loop
    state.gameActive = false;

    draftRerollUsed = false;
    nodes.rerollDraftStatus.textContent = "";
    renderTrainingPanel();
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
    const dropResult = claimGearDrop(pickedKey);
    nodes.lootIcon.innerHTML = `<img src="${g.iconSrc}" alt="" aria-hidden="true">`;
    nodes.lootName.textContent = t(g.nameKey);
    nodes.lootType.textContent = t(g.typeKey);
    nodes.lootEffect.textContent = [
      dropResult.isNew ? t("lootNewGear") : t("lootDuplicateGear", { gold: dropResult.duplicateGold }),
      t("gearCurrentEffect", { effect: describeGearEffect(pickedKey) }),
      describeGearNextEffect(pickedKey),
    ].join(" ");
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

  function renderResultSummary({ cleared }) {
    if (!nodes.resultSummary) return;
    const rows = [
      [t("resultSummaryLevel"), `Lv.${profile.level}`],
      [t("resultSummaryRooms"), `${cleared}/3`],
      [t("resultSummaryKeys"), String(state.runKeys)],
      [t("resultSummaryGold"), String(state.runGold)],
      [t("resultSummaryGear"), equippedGearSummary()],
      [t("resultSummaryNext"), nextGrowthText()],
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
    document.body.classList.remove("relic-playing", "relic-stage-select");
    document.body.classList.add("relic-result");

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

    const skillScore = `${Math.min(5, cleared + 2)}/5`;
    nodes.logicStars.textContent = skillScore;
    nodes.focusStars.textContent = skillScore;
    nodes.problemStars.textContent = skillScore;
    renderResultSummary({ cleared });

    if (won) {
      profile.bestExpedition = Math.max(profile.bestExpedition || 0, state.expedition || 1);
      profile.unlockedExpedition = Math.min(5, Math.max(profile.unlockedExpedition || 1, (state.expedition || 1) + 1));
      saveProfile();
      nodes.resultText.textContent = t("report_win");
      nodes.skillReportText.textContent = t("report_win");
      window.WonderSound?.play("win");
    } else {
      nodes.resultText.textContent = t("report_partial", { room: state.room });
      nodes.skillReportText.textContent = t("report_partial", { room: state.room });
      window.WonderSound?.play("wrong");
    }
  }

  // Portal Next Stage portal trigger
  function enterNextRoom() {
    state.room++;
    state.keys = 0;
    state.playerX = 100;
    state.playerY = ARENA_HEIGHT / 2;
    
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
      state.playerY = Math.max(20, Math.min(ARENA_HEIGHT - 20, state.playerY));
    }

    // 2. Automated Weapon Firing Timer
    shootTimer += 1 / 60;
    if (shootTimer >= stats.rate) {
      shootTimer = 0;
      fireBullet();
    }

    // 3. Move & Check Bullets
    state.bullets.forEach((bullet, index) => {
      bullet.trail.push({ x: bullet.x, y: bullet.y });
      if (bullet.trail.length > 10) bullet.trail.shift();
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
        const now = performance.now();
        if (now - state.lastHitSoundAt > 520) {
          state.lastHitSoundAt = now;
          window.WonderSound?.play("hit");
        }
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
          createDamageSparks(bullet.x, bullet.y, Math.max(1, Math.round(bullet.dmg)));

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

            // Drop gold for equipment upgrades.
            const goldCount = enemy.isElite ? 5 : 2;
            for (let k = 0; k < goldCount; k++) {
              state.pickups.push({
                x: enemy.x + (Math.random() * 28 - 14),
                y: enemy.y + (Math.random() * 28 - 14),
                type: "gold",
                value: enemy.isElite ? 12 : 5,
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
          state.pickups.push({ x: 300, y: ARENA_HEIGHT / 2, type: "chest" });
          state.pickups.push({ x: 500, y: ARENA_HEIGHT / 2, type: "portal" });
        } else if (pickup.type === "gold") {
          state.pickups.splice(pIndex, 1);
          gainGold(pickup.value || 1);
          window.WonderSound?.play("coin");
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
    ctx.clearRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    // 1. Ruin Room background
    if (assets.bg.complete) {
      drawImageCover(ctx, assets.bg, ARENA_WIDTH, ARENA_HEIGHT);
    } else {
      ctx.fillStyle = "#111827";
      ctx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);
    }

    if (state.bossWarningUntil > performance.now()) {
      ctx.save();
      ctx.fillStyle = "rgba(10, 20, 18, 0.78)";
      ctx.strokeStyle = "rgba(253, 230, 138, 0.85)";
      ctx.lineWidth = 2;
      ctx.roundRect(230, 18, 340, 46, 14);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#fde68a";
      ctx.font = "bold 20px Outfit";
      ctx.textAlign = "center";
      ctx.fillText(t("bossWarning"), 400, 48);
      ctx.restore();
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
      } else if (pickup.type === "gold") {
        ctx.save();
        ctx.fillStyle = "#facc15";
        ctx.strokeStyle = "#92400e";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pickup.x, pickup.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#3b2500";
        ctx.font = "bold 9px Outfit";
        ctx.textAlign = "center";
        ctx.fillText("$", pickup.x, pickup.y + 3);
        ctx.restore();
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
      const trailStart = bullet.trail[0];
      if (trailStart) {
        const glow = ctx.createLinearGradient(trailStart.x, trailStart.y, bullet.x, bullet.y);
        glow.addColorStop(0, "rgba(34, 211, 238, 0)");
        glow.addColorStop(0.56, "rgba(103, 232, 249, 0.22)");
        glow.addColorStop(1, "rgba(224, 251, 255, 0.78)");
        ctx.save();
        ctx.strokeStyle = glow;
        ctx.lineCap = "round";
        ctx.lineWidth = Math.max(2, bullet.size * 0.72);
        ctx.beginPath();
        bullet.trail.forEach((point, index) => {
          if (index === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.lineTo(bullet.x, bullet.y);
        ctx.stroke();
        ctx.restore();
      }

      ctx.save();
      ctx.fillStyle = "#dffbff";
      ctx.shadowColor = "#06b6d4";
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#22d3ee";
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, Math.max(2, bullet.size * 0.44), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
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

  function drawImageCover(ctx, image, width, height) {
    const scale = Math.max(width / image.width, height / image.height);
    const sourceWidth = width / scale;
    const sourceHeight = height / scale;
    const sourceX = (image.width - sourceWidth) / 2;
    const sourceY = (image.height - sourceHeight) / 2;
    ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
  }

  // Particle Effects system
  let particleSparksList = [];
  function createDamageSparks(x, y, damage = 0) {
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
    particleSparksList.push({
      x,
      y: y - 5,
      vx: 0,
      vy: -0.72,
      life: 26,
      maxLife: 26,
      type: "damage-label",
      damage,
    });
  }

  function updateDamageSparks(ctx) {
    for (let index = particleSparksList.length - 1; index >= 0; index--) {
      const p = particleSparksList[index];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      if (p.type === "damage-label") {
        const alpha = Math.max(0, p.life / p.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = "bold 13px Outfit";
        ctx.textAlign = "center";
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(4, 20, 32, 0.82)";
        ctx.fillStyle = "#e6fbff";
        ctx.strokeText(`-${p.damage}`, p.x, p.y);
        ctx.fillText(`-${p.damage}`, p.x, p.y);
        ctx.restore();
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 2, 2);
      }

      if (p.life <= 0) {
        particleSparksList.splice(index, 1);
      }
    }
  }

  // Keyboard Event registers
  function setupInputs() {
    window.addEventListener("keydown", (e) => {
      keysPressed[e.key] = true;
    });
    window.addEventListener("keyup", (e) => {
      keysPressed[e.key] = false;
    });

    function updateMouseMoveVector(event) {
      const rect = nodes.gameCanvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const targetX = ((event.clientX - rect.left) / rect.width) * nodes.gameCanvas.width;
      const targetY = ((event.clientY - rect.top) / rect.height) * nodes.gameCanvas.height;
      const dx = targetX - state.playerX;
      const dy = targetY - state.playerY;
      const distance = Math.hypot(dx, dy);
      if (distance < 8) {
        moveVector = { x: 0, y: 0 };
        return;
      }
      moveVector = { x: dx / distance, y: dy / distance };
    }

    // Desktop movement: hold the primary mouse button and steer toward its position.
    nodes.gameCanvas.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0 || !state.gameActive) return;
      mouseMoveActive = true;
      nodes.gameCanvas.setPointerCapture?.(event.pointerId);
      updateMouseMoveVector(event);
      event.preventDefault();
    });
    nodes.gameCanvas.addEventListener("pointermove", (event) => {
      if (!mouseMoveActive || event.pointerType !== "mouse") return;
      updateMouseMoveVector(event);
      event.preventDefault();
    });
    const stopMouseMove = (event) => {
      if (event.pointerType !== "mouse") return;
      mouseMoveActive = false;
      moveVector = { x: 0, y: 0 };
      if (nodes.gameCanvas.hasPointerCapture?.(event.pointerId)) nodes.gameCanvas.releasePointerCapture(event.pointerId);
    };
    nodes.gameCanvas.addEventListener("pointerup", stopMouseMove);
    nodes.gameCanvas.addEventListener("pointercancel", stopMouseMove);
    nodes.gameCanvas.addEventListener("lostpointercapture", () => {
      mouseMoveActive = false;
      moveVector = { x: 0, y: 0 };
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
    nodes.stageConfigMount.append(document.querySelector(".menu-shop"));
    updateDiamondShopUI();
    translateUI();
    setupInputs();

    // Event buttons
    nodes.showStageBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      showStage();
    });

    nodes.stageBackBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      showMain();
    });

    nodes.retryBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      startRun();
    });

    nodes.backToStageBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      showStage();
    });

    nodes.resultMenuBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      showStage();
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
        forceBossWarning() {
          state.bossWarningUntil = performance.now() + 2400;
          window.WonderSound?.play("boss");
          drawCanvasFrame();
          return { warningText: t("bossWarning"), bossWarningActive: state.bossWarningUntil > performance.now() };
        },
        forceGainGold(amount = 17) {
          gainGold(amount);
          return this.snapshot();
        },
        forceGearDrop(key = "sword-rare") {
          const result = claimGearDrop(key);
          renderEquippedGear();
          updateDiamondShopUI();
          updateHUDText();
          return { ...this.snapshot(), dropResult: result };
        },
        snapshot() {
          return {
            resultTitle: nodes.resultTitle.textContent,
            resultScore: nodes.resultScore.textContent,
            resultText: nodes.resultText.textContent,
            resultSummary: nodes.resultSummary?.textContent || "",
            skillReportText: nodes.skillReportText.textContent,
            runGold: state.runGold,
            goldText: nodes.goldText?.textContent || "",
            profile: JSON.parse(localStorage.getItem(profileKey) || "{}"),
            wallet: window.WeightPlayWallet?.read?.() || null,
            player: { x: state.playerX, y: state.playerY, active: state.gameActive },
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

  function updateBattleScale() {
    const viewport = window.visualViewport;
    const visualWidth = Math.round(viewport?.width || 0);
    const visualHeight = Math.round(viewport?.height || 0);
    const useVisual = visualWidth > 0 && visualHeight > 0 && Math.abs(visualWidth - innerWidth) <= 2 && visualHeight <= innerHeight + 2;
    document.documentElement.style.setProperty("--relic-vw", `${useVisual ? visualWidth : innerWidth}px`);
    document.documentElement.style.setProperty("--relic-vh", `${useVisual ? visualHeight : innerHeight}px`);
  }

  updateBattleScale();
  window.addEventListener("resize", updateBattleScale);
  window.addEventListener("orientationchange", updateBattleScale);
  window.visualViewport?.addEventListener("resize", updateBattleScale, { passive: true });
  window.addEventListener("DOMContentLoaded", init);
})();
