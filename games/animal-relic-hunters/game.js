(() => {
  ["stagePanel", "gamePanel"].forEach((id) => {
    document.getElementById(id)?.setAttribute("data-wp-canvas-max-width", "920");
  });

  const ARENA_WIDTH = 800;
  const ARENA_HEIGHT = 1000;
  const ROOM_ENTRY_GRACE_MS = 1500;
  const EXPEDITION_COUNT = 30;
  const ROOMS_PER_EXPEDITION = 3;
  const EXPEDITIONS_PER_REGION = 5;
  const GAME_ID = "animal-relic-hunters";
  const saveKey = "weightplay_relic_hunters_v1";
  const profileKey = "weightplay:animal-relic-hunters:profile:v1";
  const localeKey = "weightPlayLocale";
  const storageSession = new Map();
  const readStorage = (key) => {
    try {
      const value = localStorage.getItem(key);
      if (value !== null) storageSession.set(key, value);
      return value ?? storageSession.get(key) ?? null;
    } catch {
      return storageSession.get(key) ?? null;
    }
  };
  const writeStorage = (key, value) => {
    storageSession.set(key, value);
    try { localStorage.setItem(key, value); return true; } catch { return false; }
  };

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
    pauseBtn: $("pauseBtn"),
    pausePanel: $("pausePanel"),
    resumeBtn: $("resumeBtn"),
    pauseStageBtn: $("pauseStageBtn"),
    pauseTitle: $("pauseTitle"),
    pauseMessage: $("pauseMessage"),
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
    lootComparison: $("lootComparison"),
    equipLootBtn: $("equipLootBtn"),
    keepLootBtn: $("keepLootBtn"),
    resultTitle: $("resultTitle"),
    resultScore: $("resultScore"),
    resultText: $("resultText"),
    resultSummary: $("resultSummary"),
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
  document.querySelector(".game-layout")?.append(nodes.resultPanel);

  const amuletCost = 15;
  const draftRerollCost = 3;
  let amuletPurchasePending = false;
  let amuletConfirmTimer = 0;
  let amuletConfirmRemaining = 0;
  let amuletConfirmDueAt = 0;

  const text = {
    en: {
      title: "Animal Relic Hunters",
      menuTitle: "Explore the Ancient Ruins.",
      menuHint: "Tap anywhere in the arena to move there, or keep dragging to guide the explorer continuously. WASD and arrow keys also work. Defeat shadow beasts, collect Relic Orbs to level up, and find keys to unlock chests for Weapons, Armor, and Boots.",
      prototypeGoalsTitle: "Expedition Goal",
      prototypeGoalsText: "Clear three rooms in each of 30 expeditions, learn each ruin's hazard, and defeat six regional Guardians while growing through permanent training and gear.",
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
      draftShortcutHint: "Keyboard: press 1, 2, or 3 to choose. Press R to reroll.",
      rerollRelics: "Reroll relic choices",
      rerollRelicsConfirm: "Confirm reroll",
      rerollRelicsLabel: "Replace all three relic choices. Costs 3 Diamonds. Current balance {balance}.",
      rerollRelicsConfirmLabel: "Confirm relic reroll. Spend 3 Diamonds. Balance {before} to {after}. Replaces all three relic choices.",
      rerollRelicsDecision: "Replace all three relic choices. Press again to confirm: {before} → {after} Diamonds.",
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
      report_win: "Expedition clear! You read the ruin's threat pattern, protected your gear route, and defeated its final guardian.",
      report_partial: "You reached Room {room}. Adjust your relic choices and equipment before challenging this guardian again.",
      report_no_wins: "Keep exploring! Focus on picking up keys and keeping your health up.",
      bossWarning: "Ruin Guardian approaching!"
    },
    "zh-Hant": {
      title: "動物遺跡獵人",
      menuTitle: "探索古代遺跡。",
      menuHint: "點擊戰鬥場景即可移動到該處，按住拖曳則會持續跟隨指向；也可使用 WASD 或方向鍵。擊敗怪物、收集能量球升級，並取得鑰匙開啟裝備寶箱。",
      prototypeGoalsTitle: "遠征目標",
      prototypeGoalsText: "完成 30 個遠征的三房戰鬥，辨識不同遺跡威脅，並擊敗六位區域守護者；永久訓練與裝備會陪你繼續前進。",
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
      draftShortcutHint: "鍵盤：按 1、2、3 選擇，按 R 重抽。",
      rerollRelics: "重抽遺跡能力",
      rerollRelicsConfirm: "確認重抽",
      rerollRelicsLabel: "更換全部三個遺跡能力選項。花費 3 顆鑽石。目前餘額 {balance}。",
      rerollRelicsConfirmLabel: "確認重抽遺跡能力。花費 3 顆鑽石。餘額由 {before} 變為 {after}。更換全部三個選項。",
      rerollRelicsDecision: "更換全部三個遺跡能力選項。再按一次確認：{before} → {after} 顆鑽石。",
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
      report_win: "遠征完成！你辨識了遺跡威脅、守住裝備路線，並擊敗最後的守護者。",
      report_partial: "你抵達第 {room} 個房間。調整遺物與裝備後，再次挑戰這位守護者。",
      report_no_wins: "繼續加油！多收集鑰匙開啟寶箱，並維持好血量安全。"
    }
  };

  Object.assign(text["zh-Hant"], {
    title: "動物遺跡獵人",
    menuTitle: "探索古代動物遺跡",
    menuHint: "點擊戰鬥場景即可移動到該處，按住拖曳則會持續跟隨指向；也可使用 WASD 或方向鍵。擊敗影獸、收集遺跡能量球升級，並找到金鑰開啟裝備寶箱。",
    prototypeGoalsTitle: "遠征目標",
    prototypeGoalsText: "完成 30 個遠征的三房戰鬥，辨識不同遺跡威脅，並擊敗六位區域守護者；永久訓練與裝備會陪你繼續前進。",
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
    draftShortcutHint: "鍵盤：按 1、2、3 選擇，按 R 重抽。",
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
    report_win: "遠征完成！你辨識了遺跡威脅、守住裝備路線，並擊敗最後的守護者。",
    report_partial: "你抵達第 {room} 個房間。調整遺物與裝備後，再次挑戰這位守護者。",
    report_no_wins: "繼續探索！先專注收集鑰匙、開啟寶箱，並保持生命值。",
    bossWarning: "遺跡守護者即將出現！"
  });

  text.es = {
    title: "Cazadores Animales de Reliquias",
    menuTitle: "Explora las Ruinas Antiguas.",
    menuHint: "Toca cualquier punto de la arena para moverte allí o mantén y arrastra para guiar al explorador. También puedes usar WASD o las flechas. Derrota bestias sombrías, recoge Orbes Reliquia y encuentra llaves para abrir cofres de equipo.",
    prototypeGoalsTitle: "Objetivo de la expedición",
    prototypeGoalsText: "Supera tres salas en cada una de las 30 expediciones, aprende los peligros de cada ruina y derrota a seis Guardianes regionales mientras mejoras entrenamiento y equipo permanentes.",
    diamondShopTitle: "Mejora permanente",
    goldLabel: "Oro",
    trainingTitle: "Entrenamiento permanente",
    trainingPoints: "Puntos",
    trainingNote: "El nivel del personaje es permanente. Gasta puntos para comenzar cada partida con más fuerza.",
    growthReadyTitle: "Siguiente mejora permanente",
    growthReadyTraining: "Gasta {points} punto(s) de entrenamiento antes de la próxima partida.",
    growthReadyGear: "Mejora {gear} por {gold} de oro.",
    growthReadyBoth: "Entrena primero y después mejora {gear} por {gold} de oro.",
    growthReadyNone: "Combate para ganar oro y EXP; vuelve para entrenar o mejorar equipo.",
    train_damage: "Entrenamiento de ataque",
    train_damage_desc: "+2 de daño por nivel.",
    train_hp: "Entrenamiento de vitalidad",
    train_hp_desc: "+5 PV máximos por nivel.",
    train_speed: "Entrenamiento de agilidad",
    train_speed_desc: "+0,2 de velocidad de movimiento por nivel.",
    train_magnet: "Sentido de reliquias",
    train_magnet_desc: "+15 px de alcance de recogida por nivel.",
    trainAction: "Entrenar",
    trainMax: "Máximo",
    upgradeGearAction: "Mejorar",
    upgradeNeedGold: "Necesitas {gold} de oro",
    gearLevelLabel: "Nv.{level}",
    goldEarned: "Oro",
    amuletName: "Amuleto de Niebla",
    amuletEffect: "Empieza cada partida con +10 PV máximos: 40 en vez de 30.",
    amuletOwned: "Obtenido: cada partida comienza con 40 PV máximos.",
    startRun: "Empezar expedición",
    menu: "Menú",
    hudHp: "PV del jugador",
    roomLabel: "Sala",
    keysLabel: "Llaves",
    chooseCard: "Elige una mejora reliquia",
    chooseCardDesc: "Elige una reliquia antigua para potenciar a tu explorador.",
    draftShortcutHint: "Teclado: pulsa 1, 2 o 3 para elegir. Pulsa R para cambiar opciones.",
    rerollRelics: "Cambiar reliquias",
    rerollRelicsConfirm: "Confirmar cambio",
    rerollRelicsLabel: "Cambia las tres opciones de reliquia. Cuesta 3 diamantes. Saldo actual: {balance}.",
    rerollRelicsConfirmLabel: "Confirma el cambio de reliquias. Gasta 3 diamantes. Saldo de {before} a {after}. Cambia las tres opciones.",
    rerollRelicsDecision: "Cambia las tres opciones de reliquia. Pulsa otra vez para confirmar: {before} → {after} diamantes.",
    rerollRelicsUsed: "Ya cambiaste las opciones de este nivel.",
    rerollRelicsNeedDiamonds: "No hay suficientes diamantes para cambiar opciones.",
    lootFound: "¡Cofre de reliquias abierto!",
    equipLoot: "Equipar objeto",
    backpackTitle: "Mochila",
    backpackEmpty: "Abre cofres de reliquias para conseguir equipo permanente.",
    equipGearAction: "Equipar",
    equippedTag: "Equipado",
    tryAgain: "Intentar de nuevo",
    backToMenu: "Volver al menú",
    backToStage: "Volver a misiones",
    sidebarInventory: "Equipo activo",
    sidebarStats: "Atributos del personaje",
    slotWeapon: "ARMA",
    slotArmor: "ARMADURA",
    slotBoots: "BOTAS",
    noneLabel: "Ninguno",
    statDamage: "Daño:",
    statMaxHp: "PV máximos",
    statAttackRate: "Cadencia:",
    statSpeed: "Velocidad:",
    statMagnetRange: "Alcance de recogida:",
    hudStage: "Salas superadas",
    runComplete: "¡Expedición completada!",
    runFailed: "Explorador derrotado",
    resultSummaryLevel: "Nivel guardado",
    resultSummaryRooms: "Salas",
    resultSummaryKeys: "Llaves de la partida",
    resultSummaryGold: "Oro obtenido",
    resultSummaryGear: "Equipo activo",
    resultSummaryNoGear: "Aún no hay equipo activo",
    resultSummaryNext: "Siguiente mejora",
    resultDisclaimer: "Solo para divertirse y registrar el progreso local.",
    skillReportTitle: "Informe de habilidades",
    skillLogic: "Lógica",
    skillFocus: "Concentración",
    skillProblem: "Resolución de problemas",
    relic_magnet: "Imán de Reliquias",
    relic_magnet_desc: "Aumenta 40 px el alcance de recogida.",
    relic_speed: "Estallido de Linterna",
    relic_speed_desc: "Reduce un 20 % el intervalo entre disparos.",
    relic_shield: "Corazón Escudo",
    relic_shield_desc: "Aumenta 5 los PV máximos y cura 5 PV.",
    relic_damage: "Colmillo de Cristal",
    relic_damage_desc: "Aumenta un 20 % el daño de proyectil.",
    relic_heal: "Aliento del Pozo Lunar",
    relic_heal_desc: "Restaura 12 PV de inmediato.",
    gear_sword_rare: "Espada de Cristal",
    gear_sword_rare_desc: "+30 % de daño de proyectil",
    gear_dagger_epic: "Daga Reliquia",
    gear_dagger_epic_desc: "-30 % de intervalo de disparo",
    gear_armor_rare: "Coraza de las Ruinas",
    gear_armor_rare_desc: "+10 PV máximos",
    gear_armor_epic: "Malla Reliquia Dorada",
    gear_armor_epic_desc: "+20 PV máximos",
    gear_boots_rare: "Botas de Explorador",
    gear_boots_rare_desc: "+20 % de velocidad de movimiento",
    gear_boots_epic: "Sandalias de Hermes",
    gear_boots_epic_desc: "+40 % de velocidad de movimiento",
    rarity_rare: "Equipo raro",
    rarity_epic: "Equipo épico",
    report_win: "¡Expedición completada! Interpretaste el patrón de amenazas, protegiste la ruta del equipo y derrotaste al guardián final.",
    report_partial: "Llegaste a la sala {room}. Ajusta tus reliquias y equipo antes de volver a desafiar a este guardián.",
    report_no_wins: "¡Sigue explorando! Concéntrate en recoger llaves y conservar la salud.",
    bossWarning: "¡Se acerca el Guardián de las Ruinas!",
    startGame: "Empezar",
    chooseExpedition: "Elegir expedición",
    expeditionGoal: "3 salas · Nivel recomendado {level}",
    expeditionLocked: "Completa primero la expedición {region}",
    lootNewGear: "Nuevo equipo añadido a la mochila.",
    lootDuplicateGear: "Equipo repetido convertido en +{gold} de oro.",
    gearCurrentEffect: "Ahora: {effect}",
    gearNextEffect: "Siguiente: {effect}",
    gearMaxLevel: "Nivel máximo",
    gearCompareActive: "Activo en este espacio.",
    gearCompareEmpty: "Espacio vacío: equipa para activar este efecto.",
    gearCompareReplace: "Sustituye a {gear}: {effect}",
    equipLootChoice: "Equipar {gear}",
    keepLootChoice: "Conservar equipo actual",
    continueLootChoice: "Continuar",
    lootAlreadyEquipped: "Ya está equipado",
    lootDecisionLabel: "Elige si equipar {gear} o conservar el equipo actual.",
    amuletConfirmTitle: "Confirmar Amuleto de Niebla",
    amuletConfirmEffect: "Permanente: cada partida empieza con 40 PV en vez de 30. Confirma {before} → {after} diamantes.",
    amuletConfirmStatus: "+10 PV máximos permanentes en cada partida. Saldo {before} → {after} diamantes.",
    amuletNeedDiamonds: "Necesitas 15 diamantes. Saldo actual {balance}/15.",
    amuletBuyLabel: "Compra permanentemente el Amuleto de Niebla. Cada partida empieza con 40 PV en vez de 30. Cuesta 15 diamantes. Saldo {balance}.",
    amuletConfirmLabel: "Confirmar Amuleto de Niebla permanente. Gasta 15 diamantes. Saldo de {before} a {after}. Cada partida empieza con 40 PV.",
    resultSummaryProgress: "Progreso de misión",
    resultUnlocked: "Nueva expedición desbloqueada: {region}",
    resultReady: "Expedición disponible: {region}",
    resultAllCleared: "Completadas las 30 expediciones y los seis Guardianes de las Ruinas",
    nextExpedition: "Siguiente misión"
  };

  Object.assign(text.en, {
    startGame: "Start Game",
    chooseExpedition: "Choose Expedition",
    expeditionGoal: "3 rooms · Recommended Lv.{level}",
    expeditionLocked: "Complete Expedition {region} first",
    lootNewGear: "New gear added to backpack.",
    lootDuplicateGear: "Duplicate gear converted into +{gold} gold.",
    gearCurrentEffect: "Now: {effect}",
    gearNextEffect: "Next: {effect}",
    gearMaxLevel: "Max level",
    gearCompareActive: "Active in this slot.",
    gearCompareEmpty: "Slot empty: equip to activate this effect.",
    gearCompareReplace: "Replaces {gear}: {effect}",
    equipLootChoice: "Equip {gear}",
    keepLootChoice: "Keep current gear",
    continueLootChoice: "Continue",
    lootAlreadyEquipped: "Already equipped",
    lootDecisionLabel: "Choose whether to equip {gear} or keep the current loadout.",
    amuletConfirmTitle: "Confirm Mist Amulet",
    amuletConfirmEffect: "Permanent: every run starts at 40 HP instead of 30 HP. Confirm {before} → {after} Diamonds.",
    amuletConfirmStatus: "Permanent +10 Max HP every run. Balance {before} → {after} Diamonds.",
    amuletNeedDiamonds: "Need 15 Diamonds. Current balance {balance}/15.",
    amuletBuyLabel: "Buy Mist Amulet permanently. Every run starts with 40 HP instead of 30 HP. Costs 15 Diamonds. Current balance {balance}.",
    amuletConfirmLabel: "Confirm permanent Mist Amulet. Spend 15 Diamonds. Balance {before} to {after}. Every run starts with 40 HP.",
    resultSummaryProgress: "Mission Progress",
    resultUnlocked: "New expedition unlocked: {region}",
    resultReady: "Ready expedition: {region}",
    resultAllCleared: "All 30 expeditions and six ruin Guardians cleared",
    nextExpedition: "Next Mission",
  });

  Object.assign(text["zh-Hant"], {
    startGame: "\u958b\u59cb\u904a\u6232",
    chooseExpedition: "\u9078\u64c7\u9060\u5f81",
    expeditionGoal: "3 \u500b\u623f\u9593\u00b7\u5efa\u8b70 Lv.{level}",
    expeditionLocked: "\u5148\u5b8c\u6210\u9060\u5f81 {region}",
    lootNewGear: "\u65b0\u88dd\u5099\u5df2\u52a0\u5165\u80cc\u5305\u3002",
    lootDuplicateGear: "\u91cd\u8907\u88dd\u5099\u5df2\u8f49\u6210 +{gold} \u91d1\u5e63\u3002",
    gearCurrentEffect: "\u76ee\u524d\uff1a{effect}",
    gearNextEffect: "\u4e0b\u4e00\u7d1a\uff1a{effect}",
    gearMaxLevel: "\u5df2\u6eff\u7d1a",
    gearCompareActive: "\u6b64\u88dd\u5099\u6b63\u5728\u751f\u6548\u3002",
    gearCompareEmpty: "\u6b64\u6b04\u4f4d\u70ba\u7a7a\uff1a\u7a7f\u6234\u5f8c\u555f\u7528\u6548\u679c\u3002",
    gearCompareReplace: "\u5c07\u53d6\u4ee3 {gear}\uff1a{effect}",
    equipLootChoice: "\u7a7f\u6234 {gear}",
    keepLootChoice: "\u4fdd\u7559\u76ee\u524d\u88dd\u5099",
    continueLootChoice: "\u7e7c\u7e8c",
    lootAlreadyEquipped: "\u5df2\u7a7f\u6234",
    lootDecisionLabel: "\u9078\u64c7\u7a7f\u6234 {gear}\uff0c\u6216\u4fdd\u7559\u76ee\u524d\u914d\u88dd\u3002",
    amuletConfirmTitle: "\u78ba\u8a8d\u8ff7\u9727\u8b77\u7b26",
    amuletConfirmEffect: "\u6c38\u4e45\uff1a\u6bcf\u6b21\u63a2\u96aa\u5f9e 30 HP \u63d0\u5347\u70ba 40 HP\u3002\u78ba\u8a8d {before} \u2192 {after} \u9846\u947d\u77f3\u3002",
    amuletConfirmStatus: "\u6bcf\u6b21\u63a2\u96aa\u6c38\u4e45 +10 \u6700\u5927\u751f\u547d\u3002\u9918\u984d {before} \u2192 {after} \u9846\u947d\u77f3\u3002",
    amuletNeedDiamonds: "\u9700\u8981 15 \u9846\u947d\u77f3\u3002\u76ee\u524d\u9918\u984d {balance}/15\u3002",
    amuletBuyLabel: "\u6c38\u4e45\u8cfc\u8cb7\u8ff7\u9727\u8b77\u7b26\u3002\u6bcf\u6b21\u63a2\u96aa\u5f9e 30 HP \u63d0\u5347\u70ba 40 HP\u3002\u82b1\u8cbb 15 \u9846\u947d\u77f3\u3002\u76ee\u524d\u9918\u984d {balance}\u3002",
    amuletConfirmLabel: "\u78ba\u8a8d\u6c38\u4e45\u8cfc\u8cb7\u8ff7\u9727\u8b77\u7b26\u3002\u82b1\u8cbb 15 \u9846\u947d\u77f3\u3002\u9918\u984d {before} \u8b8a\u70ba {after}\u3002\u6bcf\u6b21\u63a2\u96aa\u5f9e 40 HP \u958b\u59cb\u3002",
    resultSummaryProgress: "\u4efb\u52d9\u9032\u5ea6",
    resultUnlocked: "\u65b0\u9060\u5f81\u5df2\u89e3\u9396\uff1a{region}",
    resultReady: "\u53ef\u6311\u6230\u9060\u5f81\uff1a{region}",
    resultAllCleared: "\u5df2\u5b8c\u6210 30 \u500b\u9060\u5f81\u8207\u516d\u5927\u907a\u8de1\u5b88\u8b77\u8005",
    nextExpedition: "\u4e0b\u4e00\u4efb\u52d9",
  });

  // Textures and Sprites
  const assets = {
    bg: new Image(),
    hero: new Image(),
    jaguar: new Image(),
    boar: new Image(),
    orb: new Image(),
    key: new Image(),
    bossMoss: new Image(),
    bossEcho: new Image(),
    bossCrystal: new Image(),
    bossMire: new Image(),
    bossMoon: new Image(),
    bossCrown: new Image(),
  };
  assets.bg.src = "../../assets/animal-relic-hunters-ruin-room.png";
  assets.hero.src = "../../assets/weightplay-boom-mane-lion.png";
  assets.jaguar.src = "../../assets/animal-relic-hunters-shadow-jaguar.png";
  assets.boar.src = "../../assets/animal-relic-hunters-stone-boar.png";
  assets.orb.src = "../../assets/animal-relic-hunters-relic-orb.png";
  assets.key.src = "../../assets/animal-relic-hunters-golden-relic-key.png";
  assets.bossMoss.src = "../../assets/animal-relic-hunters-boss-moss.webp";
  assets.bossEcho.src = "../../assets/animal-relic-hunters-boss-echo.webp";
  assets.bossCrystal.src = "../../assets/animal-relic-hunters-boss-crystal.webp";
  assets.bossMire.src = "../../assets/animal-relic-hunters-boss-mire.webp";
  assets.bossMoon.src = "../../assets/animal-relic-hunters-boss-moon.webp";
  assets.bossCrown.src = "../../assets/animal-relic-hunters-boss-crown.webp";

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

  const bulletVisualProfiles = Object.freeze({
    default: Object.freeze({
      tailStart: "rgba(34, 211, 238, 0)",
      tailMid: "rgba(103, 232, 249, 0.24)",
      tailEnd: "rgba(224, 251, 255, 0.82)",
      shell: "#dffbff",
      core: "#22d3ee",
      shadow: "#06b6d4",
      mote: "#67e8f9",
      moteShape: "circle",
    }),
    "sword-rare": Object.freeze({
      tailStart: "rgba(249, 115, 22, 0)",
      tailMid: "rgba(251, 191, 36, 0.3)",
      tailEnd: "rgba(255, 247, 204, 0.9)",
      shell: "#fff7cc",
      core: "#f59e0b",
      shadow: "#f97316",
      mote: "#fde047",
      moteShape: "slash",
    }),
    "dagger-epic": Object.freeze({
      tailStart: "rgba(168, 85, 247, 0)",
      tailMid: "rgba(216, 180, 254, 0.3)",
      tailEnd: "rgba(250, 232, 255, 0.9)",
      shell: "#fae8ff",
      core: "#d946ef",
      shadow: "#a855f7",
      mote: "#f0abfc",
      moteShape: "diamond",
    }),
  });

  function getBulletVisualProfile(weaponKey) {
    return bulletVisualProfiles[weaponKey] || bulletVisualProfiles.default;
  }

  const expeditionBlueprints = [
    ["Moss Gate", "\u82d4\u75d5\u4e4b\u9580", "chase"],
    ["Rootway Ambush", "\u6839\u9053\u4f0f\u64ca", "rush"],
    ["Thorn Circle", "\u834a\u68d8\u74b0\u5f91", "swarm"],
    ["Verdant Reliquary", "\u7fe0\u7da0\u8056\u7269\u5eab", "split"],
    ["Moss Guardian", "\u82d4\u539f\u5b88\u8b77\u8005", "boss-moss"],
    ["Echo Gallery", "\u56de\u8072\u9577\u5eca", "ranged"],
    ["Whisper Steps", "\u4f4e\u8a9e\u77f3\u968e", "crossfire"],
    ["Resonant Hall", "\u5171\u9cf4\u5927\u5ef3", "pulse"],
    ["Bell Chamber", "\u9234\u97f3\u5bc6\u5ba4", "ranged-rush"],
    ["Echo Warden", "\u56de\u97f3\u76e3\u5b88", "boss-echo"],
    ["Crystal Vault", "\u6c34\u6676\u5730\u5eab", "shield"],
    ["Prism Crossing", "\u68f1\u93e1\u4ea4\u9053", "shield-rush"],
    ["Shatter Mine", "\u788e\u6676\u7926\u5751", "split-shield"],
    ["Facet Labyrinth", "\u6676\u9762\u8ff7\u5bae", "warded"],
    ["Prism Colossus", "\u68f1\u6676\u5de8\u50cf", "boss-crystal"],
    ["Sunken Shrine", "\u6c89\u6c92\u795e\u6bbf", "regen"],
    ["Flooded Nave", "\u6c34\u6df9\u4e2d\u6bbf", "slow"],
    ["Mire Procession", "\u6fa4\u5730\u968a\u4f0d", "regen-swarm"],
    ["Drowned Archive", "\u6c89\u6c92\u66f8\u5eab", "slow-ranged"],
    ["Mirecoil Hydra", "\u6fa4\u74b0\u591a\u982d\u7378", "boss-mire"],
    ["Moon Archive", "\u6708\u5f71\u66f8\u5eab", "orbit"],
    ["Ink Observatory", "\u58a8\u8272\u89c0\u6e2c\u5ba4", "ranged-orbit"],
    ["Lunar Stacks", "\u6708\u5149\u66f8\u67b6", "silence"],
    ["Astral Index", "\u661f\u754c\u7d22\u5f15", "pulse-orbit"],
    ["Archive Keeper", "\u66f8\u5eab\u5b88\u5bc6\u8005", "boss-moon"],
    ["Crown Approach", "\u738b\u51a0\u9032\u8def", "gauntlet"],
    ["Obsidian Causeway", "\u9ed1\u66dc\u77f3\u9053", "warded-ranged"],
    ["Relic Furnace", "\u8056\u7269\u7194\u7210", "rush-regen"],
    ["Six-Seal Court", "\u516d\u5370\u5ead\u9662", "all-specials"],
    ["Relic Crown Monarch", "\u8056\u7269\u51a0\u5195\u738b", "boss-crown"],
  ];
  const expeditionNamesEs = [
    "Puerta del Musgo", "Emboscada del Camino de Raíces", "Círculo de Espinas", "Relicario Verde", "Guardián del Musgo",
    "Galería del Eco", "Escaleras Susurrantes", "Salón Resonante", "Cámara de la Campana", "Guardián del Eco",
    "Bóveda de Cristal", "Cruce Prismático", "Mina Fragmentada", "Laberinto de Facetas", "Coloso Prismático",
    "Santuario Sumergido", "Nave Inundada", "Procesión del Pantano", "Archivo Ahogado", "Hidra Espiral del Pantano",
    "Archivo Lunar", "Observatorio de Tinta", "Estanterías Lunares", "Índice Astral", "Custodio del Archivo",
    "Camino a la Corona", "Calzada de Obsidiana", "Horno de Reliquias", "Corte de los Seis Sellos", "Monarca de la Corona Reliquia"
  ];

  const expeditionDefs = expeditionBlueprints.map(([en, zh, rule], index) => ({
    id: index + 1,
    level: 1 + Math.floor(index * 0.8),
    region: Math.floor(index / EXPEDITIONS_PER_REGION) + 1,
    checkpoint: (index + 1) % EXPEDITIONS_PER_REGION === 0,
    en,
    zh,
    es: expeditionNamesEs[index],
    rule,
  }));

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
    enemyShots: [],
    orbs: [],
    pickups: [], // keys, chests, portals
    particleSystems: [],
    slowUntil: 0,
    silencedUntil: 0,
    bossWarningUntil: 0,
    lastHitSoundAt: 0,
    roomGraceUntil: 0,
  };

  let profile = createDefaultProfile();
  let selectedExpedition = 1;
  let browsedExpedition = 1;
  let resultNextExpedition = 0;
  let resultMapIsPrimary = false;
  let eliteSpawnTimer = 0;
  let eliteSpawnDueAt = 0;
  let eliteSpawnCallback = null;
  let eliteSpawnRemaining = 0;
  let backgroundSuspendedAt = 0;
  let backgroundBattleSuspended = false;
  let manualPauseActive = false;
  let pauseDialogMode = "pause";

  function clearEliteSpawnTimer() {
    window.clearTimeout(eliteSpawnTimer);
    eliteSpawnTimer = 0;
    eliteSpawnDueAt = 0;
    eliteSpawnCallback = null;
    eliteSpawnRemaining = 0;
  }

  function armEliteSpawn(callback, delay) {
    const wait = Math.max(0, Number(delay) || 0);
    eliteSpawnCallback = callback;
    eliteSpawnRemaining = wait;
    eliteSpawnDueAt = performance.now() + wait;
    eliteSpawnTimer = window.setTimeout(() => {
      eliteSpawnTimer = 0;
      eliteSpawnDueAt = 0;
      eliteSpawnRemaining = 0;
      const task = eliteSpawnCallback;
      eliteSpawnCallback = null;
      task?.();
    }, wait);
  }

  function suspendBackgroundBattle() {
    clearMovementInput();
    suspendAmuletConfirmation();
    suspendDraftRerollConfirmation();
    if (backgroundSuspendedAt || (!state.gameActive && !eliteSpawnTimer)) return;
    backgroundSuspendedAt = performance.now();
    backgroundBattleSuspended = state.gameActive;
    cancelAnimationFrame(state.gameLoopId);
    if (eliteSpawnTimer) {
      eliteSpawnRemaining = Math.max(0, eliteSpawnDueAt - backgroundSuspendedAt);
      window.clearTimeout(eliteSpawnTimer);
      eliteSpawnTimer = 0;
    }
  }

  function resumeBackgroundBattle() {
    resumeAmuletConfirmation();
    resumeDraftRerollConfirmation();
    if (!backgroundSuspendedAt || document.hidden) return;
    const elapsed = Math.max(0, performance.now() - backgroundSuspendedAt);
    backgroundSuspendedAt = 0;
    ["roomGraceUntil", "slowUntil", "silencedUntil", "bossWarningUntil", "lastHitSoundAt"].forEach((key) => {
      if (state[key] > 0) state[key] += elapsed;
    });
    state.enemies.forEach((enemy) => {
      if (enemy.lastHitAt > 0) enemy.lastHitAt += elapsed;
    });
    if (eliteSpawnCallback && !eliteSpawnTimer) armEliteSpawn(eliteSpawnCallback, eliteSpawnRemaining);
    if (backgroundBattleSuspended && state.gameActive) {
      cancelAnimationFrame(state.gameLoopId);
      state.gameLoopId = requestAnimationFrame(updateGameEngine);
    }
    backgroundBattleSuspended = false;
  }

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
    if (!data || typeof data !== "object" || Array.isArray(data)) return next;

    const boundedWhole = (value, fallback, minimum, maximum = Number.MAX_SAFE_INTEGER) => {
      const number = typeof value === "string" && value.trim() === "" ? Number.NaN : Number(value);
      return Number.isFinite(number) && Number.isInteger(number)
        ? Math.max(minimum, Math.min(maximum, number))
        : fallback;
    };

    next.level = boundedWhole(data.level, 1, 1);
    next.exp = boundedWhole(data.exp, 0, 0);
    next.expNeed = boundedWhole(data.expNeed, 100, 100);
    next.gold = boundedWhole(data.gold, 0, 0);
    next.unlockedExpedition = boundedWhole(data.unlockedExpedition, 1, 1, EXPEDITION_COUNT);
    next.bestExpedition = boundedWhole(data.bestExpedition, 0, 0, EXPEDITION_COUNT);

    const training = data.training && typeof data.training === "object" && !Array.isArray(data.training) ? data.training : {};
    for (const key of ["damage", "hp", "speed", "magnet"]) {
      next.training[key] = boundedWhole(training[key], 0, 0, 10);
    }

    if (Array.isArray(data.inventory)) {
      next.inventory = [...new Set(data.inventory.filter((key) => typeof key === "string" && gearDb[key]))];
    }

    const gearLevels = data.gearLevels && typeof data.gearLevels === "object" && !Array.isArray(data.gearLevels) ? data.gearLevels : {};
    for (const key of next.inventory) {
      next.gearLevels[key] = boundedWhole(gearLevels[key], 1, 1, 10);
    }

    const equipped = data.equipped && typeof data.equipped === "object" && !Array.isArray(data.equipped) ? data.equipped : {};
    for (const slot of ["weapon", "armor", "boots"]) {
      const key = equipped[slot];
      next.equipped[slot] = gearDb[key]?.slot === slot ? key : null;
      if (next.equipped[slot] && !next.inventory.includes(next.equipped[slot])) {
        next.inventory.push(next.equipped[slot]);
      }
    }

    for (const key of next.inventory) {
      next.gearLevels[key] = boundedWhole(gearLevels[key], next.gearLevels[key] || 1, 1, 10);
    }

    while (next.exp >= next.expNeed) {
      next.exp -= next.expNeed;
      next.level += 1;
      next.expNeed = Math.floor(next.expNeed * 1.3);
    }

    const spentPoints = Object.values(next.training).reduce((sum, value) => sum + value, 0);
    const earnedPoints = Math.max(0, next.level - 1);
    const storedPoints = boundedWhole(data.statPoints, 0, 0);
    next.statPoints = Math.max(storedPoints, earnedPoints - spentPoints);

    return next;
  }

  function loadProfile() {
    try {
      profile = normalizeProfile(JSON.parse(readStorage(profileKey) || "{}"));
    } catch {
      profile = createDefaultProfile();
    }
    saveProfile();
    syncStateFromProfile();
  }

  function saveProfile() {
    writeStorage(profileKey, JSON.stringify(profile));
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
  let moveVector = { x: 0, y: 0 };
  let movePointerId = null;
  let moveTarget = null;
  let shootTimer = 0;

  // Safe read/write LocalStorage
  function loadLocalState() {
    try {
      const data = JSON.parse(readStorage(saveKey) || "{}");
      state.amuletUnlocked = Boolean(data && typeof data === "object" && !Array.isArray(data) && data.amuletUnlocked === true);
    } catch {
      state.amuletUnlocked = false;
    }
    saveLocalState();
    loadProfile();
  }

  function saveLocalState() {
    writeStorage(saveKey, JSON.stringify({ amuletUnlocked: state.amuletUnlocked }));
  }

  function getLocale() {
    const stored = readStorage(localeKey);
    return window.WonderI18n?.actualLocale?.() || window.WonderI18n?.locale?.() || stored || "en";
  }

  function t(key, params = {}) {
    const locale = getLocale();
    const raw = text[locale]?.[key] || text.en[key] || key;
    return Object.entries(params).reduce((str, [k, v]) => str.replaceAll(`{${k}}`, String(v)), raw);
  }

  const ariaText = {
    en: {
      lobby: "Go back to lobby",
      language: "Language selector",
      stageBack: "Back to main",
      regions: "Ruin regions",
      battleBack: "Back to preparation",
      arena: "Battle arena. Tap or drag to move; WASD and arrow keys also work."
    },
    "zh-Hant": {
      lobby: "\u8fd4\u56de\u5927\u5ef3",
      language: "\u8a9e\u8a00\u9078\u64c7\u5668",
      stageBack: "\u8fd4\u56de\u9996\u9801",
      regions: "\u907a\u8de1\u5340\u57df",
      battleBack: "\u8fd4\u56de\u884c\u524d\u6e96\u5099",
      arena: "\u6230\u9b25\u5340\u57df\u3002\u9ede\u64ca\u6216\u62d6\u66f3\u79fb\u52d5\uff0c\u4e5f\u53ef\u4f7f\u7528 WASD \u6216\u65b9\u5411\u9375\u3002"
    },
    es: {
      lobby: "Volver al vestíbulo",
      language: "Selector de idioma",
      stageBack: "Volver a la pantalla principal",
      regions: "Regiones de las ruinas",
      battleBack: "Volver a la preparación",
      arena: "Arena de batalla. Toca o arrastra para moverte; también puedes usar WASD o las flechas."
    }
  };

  const pauseText = {
    en: {
      action: "Pause",
      title: "Expedition Paused",
      message: "The room clock and all movement are frozen.",
      resume: "Resume",
    },
    "zh-Hant": {
      action: "\u66ab\u505c",
      title: "\u9060\u5f81\u5df2\u66ab\u505c",
      message: "\u623f\u9593\u8a08\u6642\u8207\u6240\u6709\u79fb\u52d5\u5747\u5df2\u51cd\u7d50\u3002",
      resume: "\u7e7c\u7e8c",
    },
    es: {
      action: "Pausa",
      title: "Expedici\u00f3n en pausa",
      message: "El reloj de la sala y todo movimiento est\u00e1n detenidos.",
      resume: "Reanudar",
    },
  };

  const leaveText = {
    en: {
      title: "Leave this expedition?",
      message: ({ expedition, room, hp, maxHp, keys, gold }) => `Expedition ${expedition}, Room ${room}: ${hp}/${maxHp} HP, ${keys} keys, ${gold} run Gold. Leaving loses this run, its room progress, keys, and relic upgrades. Permanent level, training, backpack, equipped gear, and saved Gold stay safe.`,
      resume: "Keep Exploring",
      leave: "Leave Expedition",
    },
    "zh-Hant": {
      title: "要離開這次遠征嗎？",
      message: ({ expedition, room, hp, maxHp, keys, gold }) => `遠征 ${expedition}、房間 ${room}：生命 ${hp}/${maxHp}、${keys} 把鑰匙、本局金幣 ${gold}。離開會失去本局、房間進度、鑰匙與遺物升級；永久等級、訓練、背包、已裝備道具與已儲存金幣都會保留。`,
      resume: "繼續探索",
      leave: "離開遠征",
    },
    es: {
      title: "¿Salir de esta expedición?",
      message: ({ expedition, room, hp, maxHp, keys, gold }) => `Expedición ${expedition}, sala ${room}: ${hp}/${maxHp} puntos de vida, ${keys} llaves y ${gold} de oro de la partida. Salir pierde esta partida, su progreso de sala, llaves y mejoras de reliquia. El nivel permanente, entrenamiento, mochila, equipo y oro guardado permanecen.`,
      resume: "Continuar la exploración",
      leave: "Salir de la expedición",
    },
  };

  function updatePauseDialogCopy() {
    const locale = getLocale();
    if (pauseDialogMode === "leave") {
      const copy = leaveText[locale] || leaveText.en;
      nodes.pauseTitle.textContent = copy.title;
      nodes.pauseMessage.textContent = copy.message({
        expedition: state.expedition,
        room: state.room,
        hp: Math.max(0, Math.ceil(state.playerHp)),
        maxHp: Math.max(1, Math.ceil(state.playerMaxHp)),
        keys: state.runKeys,
        gold: state.runGold,
      });
      nodes.resumeBtn.textContent = copy.resume;
      nodes.pauseStageBtn.textContent = copy.leave;
      return;
    }
    const copy = pauseText[locale] || pauseText.en;
    nodes.pauseTitle.textContent = copy.title;
    nodes.pauseMessage.textContent = copy.message;
    nodes.resumeBtn.textContent = copy.resume;
    nodes.pauseStageBtn.textContent = t("backToStage");
  }

  function translateAriaLabels(locale) {
    const labels = ariaText[locale] || ariaText.en;
    nodes.menuBtn.setAttribute("aria-label", labels.lobby);
    nodes.localeSelect.setAttribute("aria-label", labels.language);
    nodes.stageBackBtn.setAttribute("aria-label", labels.stageBack);
    nodes.expeditionRail.setAttribute("aria-label", labels.regions);
    nodes.backToStageBtn.setAttribute("aria-label", labels.battleBack);
    nodes.gameCanvas.setAttribute("aria-label", labels.arena);
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
    if (g.bonusDmg) return `+${(g.bonusDmg * scale).toFixed(1)} ${t("statDamage").replace(/[:：]\s*$/, "")}`;
    if (g.bonusRate) return `-${Math.round(g.bonusRate * scale * 100)}% ${t("statAttackRate").replace(/[:：]\s*$/, "")}`;
    if (g.bonusHp) return `+${Math.round(g.bonusHp * scale)} ${t("statMaxHp") || "Max HP"}`;
    if (g.bonusSpeed) return `+${(g.bonusSpeed * scale).toFixed(1)} ${t("statSpeed").replace(/[:：]\s*$/, "")}`;
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

  function describeGearComparison(key) {
    const gear = gearDb[key];
    if (!gear) return "";
    const equippedKey = profile.equipped?.[gear.slot];
    if (equippedKey === key) return t("gearCompareActive");
    if (!equippedKey || !gearDb[equippedKey]) return t("gearCompareEmpty");
    return t("gearCompareReplace", {
      gear: t(gearDb[equippedKey].nameKey),
      effect: describeGearEffect(equippedKey),
    });
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
      description: "Clear 30 three-room animal relic expeditions, master ten special enemy behaviors, collect gear, and defeat six phase-changing ruin Guardians.",
      ogDescription: "Explore six ruin regions across 30 missions, build relic gear, counter special threats, and defeat six distinct Guardians."
    },
    "zh-Hant": {
      description: "遊玩《動物遺跡獵人》的 30 個三房遠征，掌握十種特殊敵人行為、收集裝備，並擊敗六位會換階段的遺跡守護者。",
      ogDescription: "探索六個遺跡區域與 30 個任務，建立遺物配裝、破解特殊威脅並擊敗六位不同守護者。"
    }
  };
  metaText.es = {
    description: "Supera 30 expediciones de tres salas, domina diez comportamientos especiales, reúne equipo y derrota a seis Guardianes que cambian de fase.",
    ogDescription: "Explora seis regiones y 30 misiones, crea equipo reliquia, responde a amenazas especiales y derrota a seis Guardianes distintos."
  };

  function focusGamePanel() {
    requestAnimationFrame(() => {
      nodes.gamePanel.scrollIntoView({ block: "start", inline: "nearest" });
      nodes.gameCanvas.focus({ preventScroll: true });
    });
  }

  function setResultModalActive(active) {
    document.querySelectorAll(".game-layout > .arena-viewport, .game-layout > .inventory-sidebar, .game-layout > #pauseBtn").forEach((layer) => {
      layer.inert = active;
      if (active) layer.setAttribute("aria-hidden", "true");
      else layer.removeAttribute("aria-hidden");
    });
    if (active) requestAnimationFrame(() => (resultMapIsPrimary ? nodes.resultMenuBtn : nodes.retryBtn).focus({ preventScroll: true }));
  }

  function setDraftModalActive(active, restoreBattleFocus = true) {
    if (!active) clearDraftRerollConfirmation(false);
    document.querySelectorAll(".game-layout > .arena-viewport, .game-layout > .inventory-sidebar, .game-layout > #pauseBtn").forEach((layer) => {
      layer.inert = active;
      if (active) layer.setAttribute("aria-hidden", "true");
      else layer.removeAttribute("aria-hidden");
    });
    if (active) requestAnimationFrame(() => nodes.draftCards.querySelector(".draft-item-btn")?.focus({ preventScroll: true }));
    else if (restoreBattleFocus) nodes.gameCanvas.focus({ preventScroll: true });
  }

  function setLootModalActive(active, restoreBattleFocus = true) {
    document.querySelectorAll(".game-layout > .arena-viewport, .game-layout > .inventory-sidebar, .game-layout > #pauseBtn").forEach((layer) => {
      layer.inert = active;
      if (active) layer.setAttribute("aria-hidden", "true");
      else layer.removeAttribute("aria-hidden");
    });
    if (active) {
      nodes.lootPanel.setAttribute("role", "dialog");
      nodes.lootPanel.setAttribute("aria-modal", "true");
      const primary = nodes.equipLootBtn.disabled ? nodes.keepLootBtn : nodes.equipLootBtn;
      primary.focus({ preventScroll: true });
    } else if (restoreBattleFocus) {
      nodes.gameCanvas.focus({ preventScroll: true });
    }
  }

  function setPauseModalActive(active, restoreBattleFocus = true, mode = "pause") {
    const closingMode = pauseDialogMode;
    if (active) {
      if (manualPauseActive || !state.gameActive || !nodes.draftPanel.classList.contains("hidden") || !nodes.lootPanel.classList.contains("hidden") || document.body.classList.contains("relic-result")) return;
      pauseDialogMode = mode;
      manualPauseActive = true;
      clearMovementInput();
      suspendBackgroundBattle();
      updatePauseDialogCopy();
      nodes.pausePanel.classList.remove("hidden");
      document.body.classList.add("relic-paused");
    } else {
      const wasPaused = manualPauseActive;
      manualPauseActive = false;
      nodes.pausePanel.classList.add("hidden");
      document.body.classList.remove("relic-paused");
      if (wasPaused) resumeBackgroundBattle();
      pauseDialogMode = "pause";
    }
    document.querySelectorAll(".game-layout > .arena-viewport, .game-layout > .inventory-sidebar, .game-layout > #pauseBtn").forEach((layer) => {
      layer.inert = active;
      if (active) layer.setAttribute("aria-hidden", "true");
      else layer.removeAttribute("aria-hidden");
    });
    if (active) requestAnimationFrame(() => nodes.resumeBtn.focus({ preventScroll: true }));
    else if (restoreBattleFocus && state.gameActive) {
      (closingMode === "leave" ? nodes.backToStageBtn : nodes.gameCanvas).focus({ preventScroll: true });
    }
  }

  function updateResultPrimaryAction() {
    const next = resultNextExpedition > 0 && document.body.classList.contains("relic-result");
    nodes.retryBtn.textContent = t(next ? "nextExpedition" : "tryAgain");
    nodes.retryBtn.setAttribute("aria-label", t(next ? "nextExpedition" : "tryAgain"));
    nodes.retryBtn.classList.toggle("primary-btn", !resultMapIsPrimary);
    nodes.retryBtn.classList.toggle("menu-btn", resultMapIsPrimary);
    nodes.resultMenuBtn.classList.toggle("primary-btn", resultMapIsPrimary);
    nodes.resultMenuBtn.classList.toggle("menu-btn", !resultMapIsPrimary);
  }

  function showMain() {
    clearEliteSpawnTimer();
    clearAmuletConfirmation();
    state.gameActive = false;
    setPauseModalActive(false, false);
    clearMovementInput();
    cancelAnimationFrame(state.gameLoopId);
    document.body.classList.remove("relic-playing", "relic-stage-select");
    document.body.classList.remove("relic-result");
    resultNextExpedition = 0;
    resultMapIsPrimary = false;
    setResultModalActive(false);
    setLootModalActive(false, false);
    nodes.gamePanel.classList.add("hidden");
    nodes.stagePanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.menuPanel.classList.remove("hidden");
    updateDiamondShopUI();
    renderTrainingPanel();
    renderEquippedGear();
    requestAnimationFrame(() => nodes.showStageBtn.focus({ preventScroll: true }));
  }

  function syncCenteredExpedition() {
    if (nodes.stagePanel.classList.contains("hidden")) return;
    const cards = [...nodes.expeditionRail.querySelectorAll(".expedition-card")];
    const railRect = nodes.expeditionRail.getBoundingClientRect();
    if (!cards.length || railRect.width <= 0) return;
    const railCenter = railRect.left + railRect.width / 2;
    const centered = cards.reduce((best, card) => {
      const cardRect = card.getBoundingClientRect();
      const distance = Math.abs(cardRect.left + cardRect.width / 2 - railCenter);
      return !best || distance < best.distance ? { card, distance } : best;
    }, null)?.card;
    if (!centered) return;
    browsedExpedition = Number(centered.dataset.expedition) || selectedExpedition;
    cards.forEach((card) => {
      const isCentered = card === centered;
      card.classList.toggle("is-centered", isCentered);
      if (isCentered) card.setAttribute("aria-current", "true");
      else card.removeAttribute("aria-current");
    });
    const expedition = expeditionDefs[browsedExpedition - 1];
    nodes.stageSetupText.textContent = centered.disabled
      ? t("expeditionLocked", { region: browsedExpedition - 1 })
      : t("expeditionGoal", { level: expedition.level });
  }

  function renderExpeditionStage(focusSelected = false) {
    const currentLocale = getLocale();
    selectedExpedition = Math.max(1, Math.min(profile.unlockedExpedition || 1, selectedExpedition));
    browsedExpedition = selectedExpedition;
    nodes.expeditionRail.innerHTML = expeditionDefs.map((expedition) => {
      const locked = expedition.id > profile.unlockedExpedition;
      const name = currentLocale === "zh-Hant" ? expedition.zh : currentLocale === "es" ? expedition.es : expedition.en;
      const checkpoint = expedition.checkpoint
        ? (currentLocale === "zh-Hant" ? "\u5b88\u8b77\u8005" : currentLocale === "es" ? "Guardián" : "Guardian")
        : (currentLocale === "zh-Hant" ? `\u5340\u57df ${expedition.region}` : currentLocale === "es" ? `Región ${expedition.region}` : `Region ${expedition.region}`);
      return `<button class="expedition-card stage-card ${expedition.id === selectedExpedition ? "is-selected is-centered" : ""} ${locked ? "is-locked" : ""} ${expedition.checkpoint ? "is-checkpoint" : ""}" data-expedition="${expedition.id}" data-stage-index="${expedition.id - 1}" type="button" ${expedition.id === selectedExpedition ? 'aria-current="true"' : ""} ${locked ? "disabled" : ""}>
        <span>${currentLocale === "zh-Hant" ? `\u9060\u5f81 ${expedition.id}` : currentLocale === "es" ? `Expedición ${expedition.id}` : `Expedition ${expedition.id}`} \u00b7 ${checkpoint}</span>
        <strong>${name}</strong>
        <small>${locked ? t("expeditionLocked", { region: expedition.id - 1 }) : t("expeditionGoal", { level: expedition.level })}</small>
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
    window.requestAnimationFrame(() => {
      const selected = nodes.expeditionRail.querySelector(".is-selected:not(:disabled)")
        || nodes.expeditionRail.querySelector(".expedition-card:not(:disabled)");
      selected?.scrollIntoView({ inline: "center", block: "nearest" });
      if (focusSelected) selected?.focus({ preventScroll: true });
      window.requestAnimationFrame(syncCenteredExpedition);
    });
  }

  function showStage() {
    clearEliteSpawnTimer();
    state.gameActive = false;
    setPauseModalActive(false, false);
    clearMovementInput();
    cancelAnimationFrame(state.gameLoopId);
    document.body.classList.remove("wp-logical-battle-active");
    document.body.classList.remove("relic-playing");
    document.body.classList.remove("relic-result");
    document.body.classList.add("relic-stage-select");
    resultNextExpedition = 0;
    resultMapIsPrimary = false;
    setResultModalActive(false);
    setLootModalActive(false, false);
    nodes.menuPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.gamePanel.classList.add("hidden");
    nodes.stagePanel.classList.remove("hidden");
    updateDiamondShopUI();
    renderTrainingPanel();
    renderEquippedGear();
    renderExpeditionStage(true);
  }

  function translateUI() {
    const locale = getLocale();
    document.documentElement.lang = locale;
    document.title = `${t("title")} - WeightPlay`;
    document.querySelector("meta[name='description']")?.setAttribute("content", metaText[locale]?.description || metaText.en.description);
    document.querySelector("meta[property='og:description']")?.setAttribute("content", metaText[locale]?.ogDescription || metaText.en.ogDescription);
    nodes.menuCover?.setAttribute("alt", locale === "zh-Hant" ? "\u52d5\u7269\u907a\u8de1\u7375\u4eba\u5c01\u9762" : locale === "es" ? "Portada de Cazadores Animales de Reliquias" : "Animal Relic Hunters cover");
    for (const el of document.querySelectorAll("[data-ui]")) {
      const key = el.dataset.ui;
      el.textContent = t(key);
    }
    nodes.localeSelect.value = locale;
    translateAriaLabels(locale);
    const pauseCopy = pauseText[locale] || pauseText.en;
    nodes.pauseBtn.setAttribute("aria-label", pauseCopy.action);
    nodes.pauseBtn.setAttribute("title", pauseCopy.action);
    updatePauseDialogCopy();
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
      clearAmuletConfirmation();
      nodes.amuletStatus.textContent = t("amuletOwned");
      nodes.amuletBtn.disabled = true;
      nodes.amuletBtn.classList.remove("is-confirming");
      nodes.amuletBtn.querySelector("strong").textContent = t("amuletName");
      nodes.amuletBtn.querySelector("small").textContent = t("amuletOwned");
      nodes.amuletBtn.querySelector("b").style.display = "none";
      nodes.amuletBtn.setAttribute("aria-label", t("amuletOwned"));
    } else {
      const after = Math.max(0, wallet.diamonds - amuletCost);
      nodes.amuletStatus.textContent = amuletPurchasePending
        ? t("amuletConfirmStatus", { before: wallet.diamonds, after })
        : wallet.diamonds < amuletCost
          ? t("amuletNeedDiamonds", { balance: wallet.diamonds })
          : "";
      nodes.amuletBtn.disabled = false;
      nodes.amuletBtn.classList.toggle("is-confirming", amuletPurchasePending);
      nodes.amuletBtn.querySelector("strong").textContent = amuletPurchasePending ? t("amuletConfirmTitle") : t("amuletName");
      nodes.amuletBtn.querySelector("small").textContent = amuletPurchasePending ? t("amuletConfirmEffect", { before: wallet.diamonds, after }) : t("amuletEffect");
      nodes.amuletBtn.querySelector("b").style.display = "flex";
      nodes.amuletBtn.querySelector("b span").textContent = amuletPurchasePending ? `${amuletCost} · ${wallet.diamonds}→${after}` : amuletCost;
      nodes.amuletBtn.setAttribute("aria-label", amuletPurchasePending ? t("amuletConfirmLabel", { before: wallet.diamonds, after }) : t("amuletBuyLabel", { balance: wallet.diamonds }));
    }
  }

  function clearAmuletConfirmation() {
    clearTimeout(amuletConfirmTimer);
    amuletConfirmTimer = 0;
    amuletConfirmRemaining = 0;
    amuletConfirmDueAt = 0;
    amuletPurchasePending = false;
  }

  function armAmuletConfirmation(delay = amuletConfirmRemaining) {
    if (!amuletPurchasePending || document.hidden) return;
    clearTimeout(amuletConfirmTimer);
    amuletConfirmRemaining = Math.max(0, Number(delay) || 0);
    amuletConfirmDueAt = performance.now() + amuletConfirmRemaining;
    amuletConfirmTimer = window.setTimeout(() => {
      amuletConfirmTimer = 0;
      amuletConfirmRemaining = 0;
      amuletConfirmDueAt = 0;
      if (!amuletPurchasePending || document.hidden) return;
      amuletPurchasePending = false;
      updateDiamondShopUI();
    }, amuletConfirmRemaining);
  }

  function suspendAmuletConfirmation() {
    if (!amuletPurchasePending || !amuletConfirmTimer) return;
    amuletConfirmRemaining = Math.max(0, amuletConfirmDueAt - performance.now());
    clearTimeout(amuletConfirmTimer);
    amuletConfirmTimer = 0;
    amuletConfirmDueAt = 0;
  }

  function resumeAmuletConfirmation() {
    if (!amuletPurchasePending || amuletConfirmTimer || document.hidden) return;
    armAmuletConfirmation();
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
      button.dataset.trainingKey = def.key;
      button.textContent = level >= def.max ? t("trainMax") : t("trainAction");
      button.disabled = level >= def.max || profile.statPoints <= 0;
      button.addEventListener("click", (event) => spendTrainingPoint(def.key, event.detail === 0));
      row.appendChild(button);
      nodes.trainingList.appendChild(row);
    });
  }

  function restoreTrainingFocus(key) {
    window.requestAnimationFrame(() => {
      const preferred = nodes.trainingList.querySelector(`[data-training-key="${key}"]:not(:disabled)`);
      const fallback = nodes.trainingList.querySelector("button:not(:disabled)");
      (preferred || fallback)?.focus();
    });
  }

  function spendTrainingPoint(key, restoreFocus = false) {
    clearAmuletConfirmation();
    updateDiamondShopUI();
    const def = trainingDefs.find((item) => item.key === key);
    if (!def || profile.statPoints <= 0 || profile.training[key] >= def.max) return;
    profile.training[key] += 1;
    profile.statPoints -= 1;
    saveProfile();
    syncStateFromProfile();
    renderTrainingPanel();
    if (restoreFocus) restoreTrainingFocus(key);
    renderStatsPanel();
    renderGrowthPrompt();
    updateHUDText();
    updateResultPrimaryAction();
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
          <small class="gear-compare-effect">${describeGearComparison(key)}</small>
          <small class="gear-next-effect">${describeGearNextEffect(key)}</small>
        </span>
        <span class="gear-level-tag">${t("gearLevelLabel", { level })}</span>
        <span class="backpack-actions">
          <button class="gear-equip-btn${equipped ? " is-equipped" : ""}" type="button">${equipped ? t("equippedTag") : t("equipGearAction")}</button>
          <button class="gear-upgrade-btn" type="button">${level >= 10 ? t("gearMaxLevel") : `${t("upgradeGearAction")} ${cost}`}</button>
        </span>
      `;
      item.querySelector(".gear-equip-btn").addEventListener("click", () => equipGearItem(key, true));
      const upgradeBtn = item.querySelector(".gear-upgrade-btn");
      upgradeBtn.disabled = level >= 10 || profile.gold < cost;
      upgradeBtn.title = profile.gold < cost ? t("upgradeNeedGold", { gold: cost }) : "";
      upgradeBtn.addEventListener("click", () => upgradeGearItem(key, true));
      nodes.backpackList.appendChild(item);
    });
  }

  function restoreBackpackActionFocus(key, actionClass) {
    requestAnimationFrame(() => {
      const item = nodes.backpackList.querySelector(`[data-gear-key="${key}"]`);
      const preferred = item?.querySelector(actionClass);
      const target = preferred && !preferred.disabled
        ? preferred
        : item?.querySelector("button:not(:disabled)") || nodes.backpackList.querySelector("button:not(:disabled)");
      target?.focus({ preventScroll: true });
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

  function upgradeGearItem(key, restoreFocus = false) {
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
    if (restoreFocus) restoreBackpackActionFocus(key, ".gear-upgrade-btn");
    window.WonderSound?.play("upgrade");
  }

  function equipGearItem(key, restoreFocus = false) {
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
    renderBackpack();
    renderGrowthPrompt();
    updateHUDText();
    if (restoreFocus) restoreBackpackActionFocus(key, ".gear-equip-btn");
    window.WonderSound?.play("success");
  }

  // Combat loop updates
  function startRun() {
    clearEliteSpawnTimer();
    state.gameActive = false;
    setPauseModalActive(false, false);
    clearAmuletConfirmation();
    clearMovementInput();
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
    state.enemyShots = [];
    state.orbs = [];
    state.pickups = [];
    state.particleSystems = [];
    state.slowUntil = 0;
    state.silencedUntil = 0;

    // Wave spawning trigger
    spawnRoomEntities();

    nodes.menuPanel.classList.add("hidden");
    nodes.stagePanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.gamePanel.classList.remove("hidden");
    document.body.classList.remove("relic-stage-select");
    document.body.classList.remove("relic-result");
    document.body.classList.add("relic-playing");
    resultNextExpedition = 0;
    resultMapIsPrimary = false;
    setResultModalActive(false);
    setLootModalActive(false, false);
    focusGamePanel();

    renderStatsPanel();
    renderEquippedGear();
    updateHUDText();

    state.gameActive = true;
    window.WonderSound?.play("start");
    
    cancelAnimationFrame(state.gameLoopId);
    state.gameLoopId = requestAnimationFrame(updateGameEngine);
  }

  const regionThreatPools = {
    1: ["chaser", "rusher", "splitter"],
    2: ["chaser", "shooter", "pulser", "rusher"],
    3: ["tank", "ward", "splitter", "rusher"],
    4: ["regenerator", "slower", "tank", "shooter"],
    5: ["orbiter", "shooter", "silencer", "pulser"],
    6: ["ward", "rusher", "shooter", "regenerator", "orbiter", "silencer"],
  };

  const encounter = (formations, rooms, tuning = {}) => ({
    formations,
    rooms: rooms.map((room) => room.trim().split(/\s+/)),
    grace: tuning.grace || [2200, 1900, 1700],
    eliteDelay: tuning.eliteDelay || [8000, 7400, 6800],
    hpMultiplier: tuning.hpMultiplier || 1,
    speedMultiplier: tuning.speedMultiplier || 1,
    eliteHp: tuning.eliteHp || [3.2, 3.6, 4.2],
    eliteSpeed: tuning.eliteSpeed || 1,
  });

  // Each named expedition owns three authored rooms. The visible mission rule
  // now changes threat order and entry geometry instead of only changing count.
  const encounterProfiles = {
    chase: encounter(["north", "sides", "corners"], ["chaser chaser chaser", "chaser chaser chaser rusher", "chaser chaser rusher chaser splitter"], { grace:[3500,2800,2400], eliteDelay:[12000,11500,11000], hpMultiplier:.62, speedMultiplier:.72, eliteHp:[1.8,2.1,2.4], eliteSpeed:.78 }),
    rush: encounter(["sides", "pincer", "columns"], ["chaser rusher chaser rusher", "rusher chaser rusher chaser rusher", "rusher rusher chaser splitter rusher chaser"], { grace:[2800,2400,2100], eliteDelay:[10500,10000,9500], hpMultiplier:.76, speedMultiplier:.84, eliteHp:[2.2,2.5,2.8], eliteSpeed:.86 }),
    swarm: encounter(["corners", "surround", "north"], ["chaser chaser splitter chaser", "chaser splitter chaser splitter chaser", "splitter chaser chaser splitter rusher chaser"], { hpMultiplier:.84, speedMultiplier:.9, eliteDelay:[9500,9000,8500] }),
    split: encounter(["columns", "corners", "surround"], ["splitter chaser splitter chaser chaser", "splitter splitter chaser rusher splitter chaser", "splitter rusher splitter chaser splitter rusher chaser"], { hpMultiplier:.9, eliteDelay:[9000,8500,8000] }),
    "boss-moss": encounter(["north", "pincer", "ring"], ["chaser rusher splitter chaser rusher", "rusher splitter rusher chaser splitter chaser", "splitter rusher chaser splitter rusher chaser splitter"], { eliteDelay:[8500,8000,7600] }),
    ranged: encounter(["north", "south", "sides"], ["shooter chaser shooter chaser chaser", "shooter shooter chaser rusher chaser shooter", "shooter chaser shooter chaser rusher shooter chaser"]),
    crossfire: encounter(["sides", "columns", "cross"], ["shooter chaser shooter chaser rusher", "shooter shooter chaser shooter chaser rusher", "shooter rusher shooter chaser shooter rusher chaser"]),
    pulse: encounter(["ring", "corners", "surround"], ["pulser chaser chaser pulser chaser", "pulser shooter chaser pulser rusher chaser", "pulser shooter pulser chaser rusher shooter chaser"]),
    "ranged-rush": encounter(["south", "pincer", "cross"], ["shooter rusher chaser shooter rusher", "rusher shooter rusher chaser shooter rusher", "shooter rusher pulser chaser shooter rusher chaser"]),
    "boss-echo": encounter(["columns", "cross", "ring"], ["shooter pulser chaser shooter rusher", "pulser shooter rusher shooter chaser pulser", "shooter pulser rusher shooter pulser chaser rusher"]),
    shield: encounter(["north", "sides", "corners"], ["ward chaser tank chaser ward", "ward tank chaser rusher ward chaser", "ward chaser tank ward rusher tank chaser"]),
    "shield-rush": encounter(["pincer", "columns", "surround"], ["ward rusher chaser ward rusher chaser", "rusher ward rusher tank chaser ward", "ward rusher tank rusher ward chaser rusher"]),
    "split-shield": encounter(["corners", "ring", "sides"], ["splitter ward chaser splitter tank chaser", "ward splitter ward chaser splitter rusher tank", "splitter ward rusher splitter tank ward chaser rusher"]),
    warded: encounter(["cross", "north", "ring"], ["ward tank ward chaser rusher tank", "ward ward tank rusher chaser ward tank", "tank ward rusher ward chaser tank ward rusher"]),
    "boss-crystal": encounter(["columns", "surround", "ring"], ["ward tank rusher ward chaser tank", "ward rusher tank ward splitter chaser ward", "ward tank rusher ward splitter tank chaser rusher"]),
    regen: encounter(["south", "sides", "north"], ["regenerator chaser tank regenerator chaser tank", "regenerator shooter chaser tank regenerator rusher", "regenerator tank shooter regenerator chaser rusher tank"]),
    slow: encounter(["sides", "pincer", "corners"], ["slower chaser slower tank chaser rusher", "slower tank chaser slower shooter rusher tank", "slower rusher tank slower shooter chaser rusher"]),
    "regen-swarm": encounter(["corners", "surround", "ring"], ["regenerator chaser splitter regenerator chaser tank", "splitter regenerator chaser slower splitter tank rusher", "regenerator splitter slower chaser splitter tank rusher regenerator"]),
    "slow-ranged": encounter(["columns", "cross", "sides"], ["slower shooter chaser slower shooter tank", "shooter slower shooter chaser tank rusher slower", "slower shooter rusher slower shooter tank chaser regenerator"]),
    "boss-mire": encounter(["north", "ring", "surround"], ["regenerator slower tank chaser shooter regenerator", "slower regenerator shooter tank rusher slower regenerator", "regenerator slower shooter tank rusher regenerator slower chaser"]),
    orbit: encounter(["ring", "corners", "surround"], ["orbiter chaser orbiter shooter chaser rusher", "orbiter shooter chaser orbiter pulser rusher shooter", "orbiter shooter pulser chaser orbiter rusher shooter"]),
    "ranged-orbit": encounter(["sides", "ring", "cross"], ["shooter orbiter chaser shooter orbiter rusher", "orbiter shooter orbiter chaser pulser shooter rusher", "shooter orbiter pulser shooter chaser orbiter rusher"]),
    silence: encounter(["north", "columns", "pincer"], ["silencer chaser shooter silencer chaser orbiter", "silencer shooter rusher orbiter silencer chaser shooter", "silencer orbiter shooter rusher silencer pulser chaser"]),
    "pulse-orbit": encounter(["corners", "ring", "surround"], ["pulser orbiter chaser pulser shooter orbiter", "orbiter pulser shooter rusher orbiter silencer chaser", "pulser orbiter silencer shooter rusher orbiter pulser chaser"]),
    "boss-moon": encounter(["columns", "cross", "ring"], ["orbiter silencer shooter chaser pulser orbiter", "silencer orbiter pulser shooter rusher silencer orbiter", "orbiter silencer pulser shooter orbiter rusher silencer chaser"]),
    gauntlet: encounter(["north", "south", "surround"], ["ward rusher shooter chaser regenerator orbiter silencer", "rusher shooter ward regenerator orbiter silencer chaser rusher", "ward shooter rusher regenerator orbiter silencer pulser chaser"]),
    "warded-ranged": encounter(["sides", "cross", "columns"], ["ward shooter ward chaser silencer shooter rusher", "shooter ward silencer tank shooter ward rusher chaser", "ward shooter silencer rusher tank ward shooter orbiter"]),
    "rush-regen": encounter(["pincer", "corners", "surround"], ["rusher regenerator rusher chaser slower rusher tank", "regenerator rusher slower rusher shooter chaser regenerator rusher", "rusher regenerator silencer slower rusher tank shooter chaser"]),
    "all-specials": encounter(["ring", "cross", "surround"], ["ward regenerator orbiter silencer shooter rusher pulser", "slower ward shooter orbiter regenerator silencer rusher chaser", "ward rusher shooter regenerator orbiter silencer pulser slower tank"]),
    "boss-crown": encounter(["columns", "surround", "ring"], ["ward shooter rusher regenerator orbiter silencer pulser", "rusher ward silencer shooter regenerator orbiter slower chaser", "ward rusher shooter regenerator orbiter silencer pulser slower tank chaser"]),
  };

  const guardianBehaviors = ["moss", "echo", "crystal", "mire", "moon", "crown"];
  const guardianNames = {
    moss: { en: "Moss Guardian", zh: "苔原守護者" },
    echo: { en: "Echo Warden", zh: "回聲監守" },
    crystal: { en: "Prism Colossus", zh: "水晶巨像" },
    mire: { en: "Mirecoil Hydra", zh: "澤環多頭獸" },
    moon: { en: "Archive Keeper", zh: "書庫守密者" },
    crown: { en: "Relic Crown Monarch", zh: "遺物冠冕王" },
  };
  guardianNames.moss.es = "Guardián del Musgo";
  guardianNames.echo.es = "Guardián del Eco";
  guardianNames.crystal.es = "Coloso Prismático";
  guardianNames.mire.es = "Hidra Espiral del Pantano";
  guardianNames.moon.es = "Custodio del Archivo";
  guardianNames.crown.es = "Monarca de la Corona Reliquia";

  function guardianSpriteForBehavior(behavior) {
    return {
      moss: assets.bossMoss,
      echo: assets.bossEcho,
      crystal: assets.bossCrystal,
      mire: assets.bossMire,
      moon: assets.bossMoon,
      crown: assets.bossCrown,
    }[behavior] || null;
  }

  function missionDefinition(id = state.expedition) {
    return expeditionDefs[Math.max(1, Math.min(EXPEDITION_COUNT, Number(id) || 1)) - 1];
  }

  function edgeSpawnPoint() {
    const side = Math.floor(Math.random() * 4);
    if (side === 0) return { x: Math.random() * ARENA_WIDTH, y: -40 };
    if (side === 1) return { x: ARENA_WIDTH + 40, y: Math.random() * ARENA_HEIGHT };
    if (side === 2) return { x: Math.random() * ARENA_WIDTH, y: ARENA_HEIGHT + 40 };
    return { x: -40, y: Math.random() * ARENA_HEIGHT };
  }

  function formationSpawnPoint(formation, index, count) {
    const ratio = (index + 1) / (count + 1);
    const horizontal = 80 + ratio * (ARENA_WIDTH - 160);
    const vertical = 100 + ratio * (ARENA_HEIGHT - 200);
    if (formation === "north") return { x: horizontal, y: 55 };
    if (formation === "south") return { x: horizontal, y: ARENA_HEIGHT - 55 };
    if (formation === "sides" || formation === "pincer") return { x: index % 2 ? ARENA_WIDTH - 55 : 55, y: vertical };
    if (formation === "columns") return { x: horizontal, y: index % 2 ? ARENA_HEIGHT - 55 : 55 };
    if (formation === "corners") {
      return [
        { x: 55, y: 90 }, { x: ARENA_WIDTH - 55, y: 90 },
        { x: ARENA_WIDTH - 55, y: ARENA_HEIGHT - 90 }, { x: 55, y: ARENA_HEIGHT - 90 },
      ][index % 4];
    }
    if (formation === "cross") {
      return [
        { x: ARENA_WIDTH / 2, y: 55 }, { x: ARENA_WIDTH - 55, y: ARENA_HEIGHT / 2 },
        { x: ARENA_WIDTH / 2, y: ARENA_HEIGHT - 55 }, { x: 55, y: ARENA_HEIGHT / 2 },
      ][index % 4];
    }
    if (formation === "ring" || formation === "surround") {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / Math.max(1, count);
      return {
        x: ARENA_WIDTH / 2 + Math.cos(angle) * (ARENA_WIDTH / 2 - 55),
        y: ARENA_HEIGHT / 2 + Math.sin(angle) * (ARENA_HEIGHT / 2 - 55),
      };
    }
    return edgeSpawnPoint();
  }

  function createThreat(behavior, x, y, options = {}) {
    const mission = missionDefinition();
    const room = state.room || 1;
    const difficulty = 1 + ((mission.id - 1) * 0.035) + ((room - 1) * 0.08);
    const tankLike = ["tank", "ward", "regenerator", "slower"].includes(behavior);
    const baseHp = tankLike ? 38 : 22;
    const baseSpeed = behavior === "rusher" ? 2.35 : behavior === "orbiter" ? 1.75 : tankLike ? 1.05 : 1.65;
    const maxHp = Math.round((baseHp + mission.region * 4) * difficulty * (options.hpMultiplier || 1));
    return {
      x,
      y,
      type: tankLike ? "boar" : "jaguar",
      behavior,
      hp: maxHp,
      maxHp,
      speed: baseSpeed * (options.speedMultiplier || 1),
      baseSpeed,
      isElite: Boolean(options.isElite),
      isBoss: Boolean(options.isBoss),
      size: options.size || (tankLike ? 25 : 21),
      shieldHits: behavior === "ward" ? 2 : 0,
      abilityTimer: Math.random() * 90,
      shotTimer: 45 + Math.random() * 80,
      phaseFlags: new Set(),
      tint: options.tint || "",
      label: options.label || "",
    };
  }

  function createGuardian(region, checkpoint, options = {}) {
    const behavior = checkpoint ? guardianBehaviors[region - 1] : guardianBehaviors[Math.max(0, region - 1)];
    const hpMultiplier = checkpoint ? 8.6 : (options.hpMultiplier || 4.2);
    const guardian = createThreat(behavior, ARENA_WIDTH / 2, -70, {
      isElite: true,
      isBoss: checkpoint,
      hpMultiplier,
      speedMultiplier: checkpoint ? 0.82 : (options.speedMultiplier || 1),
      size: checkpoint ? 92 : 38,
      label: checkpoint
        ? guardianNames[behavior][getLocale() === "zh-Hant" ? "zh" : getLocale() === "es" ? "es" : "en"]
        : (getLocale() === "zh-Hant" ? "菁英" : getLocale() === "es" ? "ÉLITE" : "ELITE"),
    });
    guardian.type = checkpoint ? "boss" : (region >= 3 ? "boar" : "jaguar");
    guardian.shieldHits = behavior === "crystal" || behavior === "crown" ? (checkpoint ? 6 : 3) : guardian.shieldHits;
    return guardian;
  }

  function spawnRoomEntities() {
    clearEliteSpawnTimer();
    state.enemies = [];
    state.bullets = [];
    state.enemyShots = [];
    state.orbs = [];
    state.pickups = [];
    state.roomGraceUntil = performance.now() + ROOM_ENTRY_GRACE_MS;

    const room = state.room;
    const expedition = state.expedition;
    const mission = missionDefinition(expedition);
    const encounterProfile = encounterProfiles[mission.rule];
    const roomIndex = Math.max(0, Math.min(ROOMS_PER_EXPEDITION - 1, room - 1));
    const roomThreats = encounterProfile?.rooms[roomIndex] || regionThreatPools[mission.region];
    const formation = encounterProfile?.formations[roomIndex] || "surround";
    state.roomGraceUntil = performance.now() + (encounterProfile?.grace[roomIndex] || ROOM_ENTRY_GRACE_MS);
    for (let i = 0; i < roomThreats.length; i += 1) {
      const point = formationSpawnPoint(formation, i, roomThreats.length);
      state.enemies.push(createThreat(roomThreats[i], point.x, point.y, {
        hpMultiplier: encounterProfile?.hpMultiplier || 1,
        speedMultiplier: encounterProfile?.speedMultiplier || 1,
      }));
    }

    // Every room has one key carrier. Room 3 becomes a named regional Guardian
    // only at missions 5/10/15/20/25/30; other missions use a smaller Elite.
    armEliteSpawn(() => {
      if (state.room !== room || state.expedition !== expedition) return;
      const checkpoint = room === ROOMS_PER_EXPEDITION && mission.checkpoint;
      if (room === ROOMS_PER_EXPEDITION) {
        state.bossWarningUntil = performance.now() + 2400;
        window.WonderSound?.play("boss");
      }
      state.enemies.push(createGuardian(mission.region, checkpoint, {
        hpMultiplier: encounterProfile?.eliteHp[roomIndex],
        speedMultiplier: encounterProfile?.eliteSpeed,
      }));
    }, encounterProfile?.eliteDelay[roomIndex] || 6800);
  }

  function updateHUDText() {
    nodes.roomText.textContent = `${state.room}/${ROOMS_PER_EXPEDITION}`;
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
      visualKey: state.eqWeapon || "default",
    });
    window.WonderSound?.play("shoot");
  }

  // Exp/Level up draft Relic selection
  let currentDraftChoices = [];
  let draftRerollUsed = false;
  let draftRerollPending = false;
  let draftRerollConfirmTimer = 0;
  let draftRerollConfirmRemaining = 0;
  let draftRerollConfirmDueAt = 0;

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
    clearMovementInput();

    clearDraftRerollConfirmation(false);
    draftRerollUsed = false;
    nodes.rerollDraftStatus.textContent = "";
    renderTrainingPanel();
    renderDraftChoices();
    nodes.draftPanel.classList.remove("hidden");
    updateDraftRerollUI();
    setDraftModalActive(true);
  }

  function chooseDraftRelic(relicId) {
    clearDraftRerollConfirmation(false);
    applyRelic(relicId);
    nodes.draftPanel.classList.add("hidden");
    state.gameActive = true;
    renderStatsPanel();
    updateHUDText();
    setDraftModalActive(false);
    state.gameLoopId = requestAnimationFrame(updateGameEngine);
  }

  function renderDraftChoices(keepCurrent = false) {
    // Choose 3 random relics from a wider pool so rerolling has real choice value.
    if (!keepCurrent || currentDraftChoices.length === 0) {
      const pool = ["relic_magnet", "relic_speed", "relic_shield", "relic_damage", "relic_heal"];
      shuffle(pool);
      currentDraftChoices = pool.slice(0, 3);
    }

    nodes.draftCards.innerHTML = "";
    currentDraftChoices.forEach((relicId, index) => {
      const cardEl = document.createElement("button");
      cardEl.className = "draft-item-btn";
      cardEl.type = "button";
      cardEl.setAttribute("aria-keyshortcuts", String(index + 1));
      
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
        chooseDraftRelic(relicId);
      });

      nodes.draftCards.appendChild(cardEl);
    });
  }

  function updateDraftRerollUI() {
    const wallet = window.WeightPlayWallet?.read() || { diamonds: 0 };
    const after = Math.max(0, wallet.diamonds - draftRerollCost);
    const label = nodes.rerollDraftBtn.querySelector('[data-ui="rerollRelics"]');
    if ((draftRerollUsed || wallet.diamonds < draftRerollCost) && draftRerollPending) {
      clearDraftRerollConfirmation(false);
    }
    nodes.rerollDraftCost.textContent = draftRerollCost;
    nodes.rerollDraftBtn.disabled = draftRerollUsed || wallet.diamonds < draftRerollCost;
    nodes.rerollDraftBtn.classList.toggle("is-confirming", draftRerollPending);
    nodes.rerollDraftBtn.setAttribute("aria-pressed", String(draftRerollPending));
    nodes.rerollDraftBtn.setAttribute("aria-label", draftRerollPending
      ? t("rerollRelicsConfirmLabel", { before: wallet.diamonds, after })
      : t("rerollRelicsLabel", { balance: wallet.diamonds }));
    if (label) label.textContent = draftRerollPending ? t("rerollRelicsConfirm") : t("rerollRelics");
    if (draftRerollUsed) {
      nodes.rerollDraftStatus.textContent = t("rerollRelicsUsed");
    } else if (wallet.diamonds < draftRerollCost) {
      nodes.rerollDraftStatus.textContent = t("rerollRelicsNeedDiamonds");
    } else if (draftRerollPending) {
      nodes.rerollDraftStatus.textContent = t("rerollRelicsDecision", { before: wallet.diamonds, after });
    } else {
      nodes.rerollDraftStatus.textContent = "";
    }
  }

  function clearDraftRerollConfirmation(render = true) {
    window.clearTimeout(draftRerollConfirmTimer);
    draftRerollConfirmTimer = 0;
    draftRerollConfirmRemaining = 0;
    draftRerollConfirmDueAt = 0;
    draftRerollPending = false;
    if (render) updateDraftRerollUI();
  }

  function armDraftRerollConfirmation(delay = draftRerollConfirmRemaining) {
    window.clearTimeout(draftRerollConfirmTimer);
    draftRerollConfirmRemaining = Math.max(0, Number(delay) || 0);
    draftRerollConfirmDueAt = performance.now() + draftRerollConfirmRemaining;
    draftRerollConfirmTimer = window.setTimeout(() => {
      draftRerollConfirmTimer = 0;
      draftRerollConfirmRemaining = 0;
      draftRerollConfirmDueAt = 0;
      draftRerollPending = false;
      updateDraftRerollUI();
    }, draftRerollConfirmRemaining);
  }

  function suspendDraftRerollConfirmation() {
    if (!draftRerollPending || !draftRerollConfirmTimer) return;
    draftRerollConfirmRemaining = Math.max(0, draftRerollConfirmDueAt - performance.now());
    window.clearTimeout(draftRerollConfirmTimer);
    draftRerollConfirmTimer = 0;
    draftRerollConfirmDueAt = 0;
  }

  function resumeDraftRerollConfirmation() {
    if (!draftRerollPending || draftRerollConfirmTimer || document.hidden) return;
    armDraftRerollConfirmation();
  }

  function rerollDraftChoices() {
    if (draftRerollUsed) {
      updateDraftRerollUI();
      return;
    }

    const wallet = window.WeightPlayWallet?.read() || { diamonds: 0 };
    if (wallet.diamonds < draftRerollCost) {
      clearDraftRerollConfirmation(false);
      updateDraftRerollUI();
      return;
    }
    if (!draftRerollPending) {
      draftRerollPending = true;
      updateDraftRerollUI();
      nodes.rerollDraftBtn.focus({ preventScroll: true });
      armDraftRerollConfirmation(5000);
      return;
    }

    clearDraftRerollConfirmation(false);
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
    nodes.draftCards.querySelector(".draft-item-btn")?.focus();
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
  function presentLootDecision(pickedKey) {
    currentLootItem = pickedKey;
    const g = gearDb[pickedKey];
    const dropResult = claimGearDrop(pickedKey);
    const alreadyEquipped = profile.equipped?.[g.slot] === pickedKey;
    const gearName = t(g.nameKey);
    nodes.lootIcon.innerHTML = `<img src="${g.iconSrc}" alt="" aria-hidden="true">`;
    nodes.lootName.textContent = gearName;
    nodes.lootType.textContent = t(g.typeKey);
    nodes.lootEffect.textContent = [
      dropResult.isNew ? t("lootNewGear") : t("lootDuplicateGear", { gold: dropResult.duplicateGold }),
      t("gearCurrentEffect", { effect: describeGearEffect(pickedKey) }),
      describeGearNextEffect(pickedKey),
    ].join(" ");
    nodes.lootComparison.textContent = describeGearComparison(pickedKey);
    nodes.equipLootBtn.textContent = alreadyEquipped ? t("lootAlreadyEquipped") : t("equipLootChoice", { gear: gearName });
    nodes.equipLootBtn.disabled = alreadyEquipped;
    nodes.keepLootBtn.textContent = alreadyEquipped ? t("continueLootChoice") : t("keepLootChoice");
    nodes.lootPanel.setAttribute("aria-label", t("lootDecisionLabel", { gear: gearName }));
    renderEquippedGear();
    nodes.lootPanel.classList.remove("hidden");
    setLootModalActive(true);
    return dropResult;
  }

  function triggerChestLoot() {
    state.gameActive = false;
    clearMovementInput();
    window.WonderSound?.play("upgrade");

    // Random roll gear based on current room
    const rolls = {
      1: ["sword-rare", "armor-rare", "boots-rare"],
      2: ["sword-rare", "armor-rare", "boots-rare", "dagger-epic", "armor-epic", "boots-epic"],
      3: ["dagger-epic", "armor-epic", "boots-epic"],
    };

    const choices = rolls[state.room] || rolls[1];
    const pickedKey = choices[Math.floor(Math.random() * choices.length)];
    presentLootDecision(pickedKey);
  }

  function finishLootDecision(shouldEquip) {
    if (shouldEquip) equipGearItem(currentLootItem);
    nodes.lootPanel.classList.add("hidden");
    state.gameActive = true;
    setLootModalActive(false);
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

  function expeditionName(id) {
    const expedition = expeditionDefs[Math.max(1, Math.min(EXPEDITION_COUNT, Number(id) || 1)) - 1];
    return getLocale() === "zh-Hant" ? expedition.zh : getLocale() === "es" ? expedition.es : expedition.en;
  }

  function renderResultSummary({ cleared, newlyUnlocked = 0, won = false }) {
    if (!nodes.resultSummary) return;
    const highestUnlocked = Math.max(1, Math.min(EXPEDITION_COUNT, Number(profile.unlockedExpedition) || 1));
    const progressText = newlyUnlocked
      ? t("resultUnlocked", { region: expeditionName(newlyUnlocked) })
      : won && (state.expedition || 1) >= EXPEDITION_COUNT && highestUnlocked >= EXPEDITION_COUNT
        ? t("resultAllCleared")
        : t("resultReady", { region: expeditionName(highestUnlocked) });
    const rows = [
      [t("resultSummaryLevel"), `Lv.${profile.level}`],
      [t("resultSummaryRooms"), `${cleared}/${ROOMS_PER_EXPEDITION}`],
      [t("resultSummaryKeys"), String(state.runKeys)],
      [t("resultSummaryGold"), String(state.runGold)],
      [t("resultSummaryGear"), equippedGearSummary()],
      [t("resultSummaryProgress"), progressText],
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
    clearEliteSpawnTimer();
    state.gameActive = false;
    setPauseModalActive(false, false);
    clearMovementInput();
    cancelAnimationFrame(state.gameLoopId);
    nodes.lootPanel.classList.add("hidden");
    setLootModalActive(false, false);

    nodes.gamePanel.classList.remove("hidden");
    nodes.resultPanel.classList.remove("hidden");
    document.body.classList.remove("relic-stage-select");
    document.body.classList.add("relic-playing", "relic-result");

    nodes.resultTitle.textContent = won ? t("runComplete") : t("runFailed");
    nodes.resultScore.textContent = won ? String(ROOMS_PER_EXPEDITION) : String(state.room - 1);

    const cleared = won ? ROOMS_PER_EXPEDITION : (state.room - 1);
    const previousUnlocked = Math.max(1, Math.min(EXPEDITION_COUNT, Number(profile.unlockedExpedition) || 1));
    let newlyUnlocked = 0;
    if (won) {
      profile.bestExpedition = Math.max(profile.bestExpedition || 0, state.expedition || 1);
      profile.unlockedExpedition = Math.min(EXPEDITION_COUNT, Math.max(profile.unlockedExpedition || 1, (state.expedition || 1) + 1));
      if (profile.unlockedExpedition > previousUnlocked) newlyUnlocked = profile.unlockedExpedition;
      saveProfile();
      nodes.resultText.textContent = t("report_win");
      window.WonderSound?.play("win");
    } else {
      nodes.resultText.textContent = t("report_partial", { room: state.room });
      window.WonderSound?.play("wrong");
    }
    resultNextExpedition = won && (state.expedition || 1) < EXPEDITION_COUNT && profile.unlockedExpedition >= (state.expedition || 1) + 1
      ? (state.expedition || 1) + 1
      : 0;
    resultMapIsPrimary = won && (state.expedition || 1) === EXPEDITION_COUNT;
    renderResultSummary({ cleared, newlyUnlocked, won });
    updateResultPrimaryAction();
    setResultModalActive(true);
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

  function launchEnemyShot(enemy, angle, kind = "relic") {
    const speed = kind === "silence" ? 3.1 : 3.7;
    state.enemyShots.push({
      x: enemy.x,
      y: enemy.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: kind === "pulse" ? 9 : 7,
      damage: enemy.isBoss ? 5 : 3,
      kind,
      life: 260,
    });
  }

  function radialEnemyShots(enemy, count = 8, kind = "pulse") {
    for (let index = 0; index < count; index += 1) {
      launchEnemyShot(enemy, (Math.PI * 2 * index) / count, kind);
    }
  }

  function summonThreats(enemy, behavior, count = 2) {
    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * 2 * index) / count;
      state.enemies.push(createThreat(
        behavior,
        enemy.x + Math.cos(angle) * (enemy.size + 26),
        enemy.y + Math.sin(angle) * (enemy.size + 26),
        { hpMultiplier: 0.72 }
      ));
    }
  }

  function updateGuardianPhases(enemy) {
    if (!enemy.isBoss) return;
    const ratio = enemy.hp / enemy.maxHp;
    enemy.phaseFlags ||= new Set();
    for (const threshold of [0.7, 0.35]) {
      if (ratio > threshold || enemy.phaseFlags.has(threshold)) continue;
      enemy.phaseFlags.add(threshold);
      if (enemy.behavior === "moss") summonThreats(enemy, "rusher", threshold === 0.7 ? 2 : 3);
      if (enemy.behavior === "echo") radialEnemyShots(enemy, threshold === 0.7 ? 8 : 12, "pulse");
      if (enemy.behavior === "crystal") enemy.shieldHits += threshold === 0.7 ? 4 : 6;
      if (enemy.behavior === "mire") {
        enemy.hp = Math.min(enemy.maxHp, enemy.hp + enemy.maxHp * 0.1);
        summonThreats(enemy, "slower", 2);
      }
      if (enemy.behavior === "moon") {
        radialEnemyShots(enemy, 10, "silence");
        summonThreats(enemy, "orbiter", 2);
      }
      if (enemy.behavior === "crown") {
        enemy.shieldHits += 3;
        radialEnemyShots(enemy, 12, "silence");
        summonThreats(enemy, threshold === 0.7 ? "rusher" : "regenerator", 3);
      }
    }
  }

  function moveEnemyByBehavior(enemy, dx, dy, dist) {
    enemy.abilityTimer = (enemy.abilityTimer || 0) + 1;
    enemy.shotTimer = Math.max(0, (enemy.shotTimer || 0) - 1);
    updateGuardianPhases(enemy);

    const ranged = ["shooter", "silencer", "echo", "moon", "crown", "pulser"].includes(enemy.behavior);
    if (ranged && enemy.shotTimer <= 0) {
      const baseAngle = Math.atan2(dy, dx);
      if (["echo", "pulser"].includes(enemy.behavior)) radialEnemyShots(enemy, enemy.isBoss ? 10 : 6, "pulse");
      else if (enemy.behavior === "moon") {
        [-0.24, 0, 0.24].forEach((offset) => launchEnemyShot(enemy, baseAngle + offset, "silence"));
      } else if (enemy.behavior === "crown") {
        [-0.18, 0, 0.18].forEach((offset) => launchEnemyShot(enemy, baseAngle + offset, "silence"));
      } else {
        launchEnemyShot(enemy, baseAngle, enemy.behavior === "silencer" ? "silence" : "relic");
      }
      enemy.shotTimer = enemy.isBoss ? 100 : 145;
    }

    if (["regenerator", "mire", "crown"].includes(enemy.behavior) && performance.now() - (enemy.lastHitAt || 0) > 900) {
      enemy.hp = Math.min(enemy.maxHp, enemy.hp + enemy.maxHp * (enemy.isBoss ? 0.00018 : 0.00028));
    }

    if (dist <= 10) return;
    let moveAngle = Math.atan2(dy, dx);
    let speed = enemy.speed;
    if (enemy.behavior === "rusher" || enemy.behavior === "moss" || enemy.behavior === "crown") {
      const cycle = enemy.abilityTimer % 210;
      speed *= cycle > 145 && cycle < 190 ? 2.15 : 0.82;
    }
    if (enemy.behavior === "orbiter" || enemy.behavior === "moon") {
      moveAngle += dist > 210 ? 0.45 : Math.PI / 2;
      speed *= dist < 130 ? 0.45 : 1;
    } else if (ranged && dist < 190) {
      moveAngle += Math.PI;
      speed *= 0.8;
    } else if (ranged && dist < 310) {
      speed = 0;
    }
    enemy.x += Math.cos(moveAngle) * speed;
    enemy.y += Math.sin(moveAngle) * speed;
  }

  function updateEnemyShots() {
    for (let index = state.enemyShots.length - 1; index >= 0; index -= 1) {
      const shot = state.enemyShots[index];
      shot.x += shot.vx;
      shot.y += shot.vy;
      shot.life -= 1;
      const dx = state.playerX - shot.x;
      const dy = state.playerY - shot.y;
      if (Math.hypot(dx, dy) < shot.size + 15) {
        state.playerHp = Math.max(0, state.playerHp - shot.damage);
        if (shot.kind === "silence") state.silencedUntil = performance.now() + 1500;
        if (shot.kind === "pulse") state.slowUntil = performance.now() + 1200;
        state.enemyShots.splice(index, 1);
        window.WonderSound?.play("hit");
        renderStatsPanel();
        if (state.playerHp <= 0) endGame(false);
      } else if (shot.life <= 0 || shot.x < -30 || shot.x > ARENA_WIDTH + 30 || shot.y < -30 || shot.y > ARENA_HEIGHT + 30) {
        state.enemyShots.splice(index, 1);
      }
    }
  }

  // Update Game Physics & Canvas rendering
  function updateGameEngine() {
    if (!state.gameActive) return;
    if (document.hidden) {
      suspendBackgroundBattle();
      return;
    }
    const roomInGrace = performance.now() < state.roomGraceUntil;

    // 1. Move Player
    const stats = getStats();
    let moveX = 0;
    let moveY = 0;

    if (keysPressed["w"] || keysPressed["ArrowUp"]) moveY = -1;
    if (keysPressed["s"] || keysPressed["ArrowDown"]) moveY = 1;
    if (keysPressed["a"] || keysPressed["ArrowLeft"]) moveX = -1;
    if (keysPressed["d"] || keysPressed["ArrowRight"]) moveX = 1;

    const keyboardMoving = moveX !== 0 || moveY !== 0;
    if (keyboardMoving) {
      moveTarget = null;
    } else if (moveTarget) {
      const targetDx = moveTarget.x - state.playerX;
      const targetDy = moveTarget.y - state.playerY;
      const targetDistance = Math.hypot(targetDx, targetDy);
      if (targetDistance <= 8) {
        moveTarget = null;
        moveVector = { x: 0, y: 0 };
      } else {
        moveVector = { x: targetDx / targetDistance, y: targetDy / targetDistance };
      }
    }

    if (!keyboardMoving && (moveVector.x !== 0 || moveVector.y !== 0)) {
      moveX = moveVector.x;
      moveY = moveVector.y;
    }

    if (moveX !== 0 || moveY !== 0) {
      const angle = Math.atan2(moveY, moveX);
      const movementSpeed = stats.speed * (performance.now() < state.slowUntil ? 0.58 : 1);
      state.playerX += Math.cos(angle) * movementSpeed;
      state.playerY += Math.sin(angle) * movementSpeed;

      // Keep boundaries
      state.playerX = Math.max(20, Math.min(780, state.playerX));
      state.playerY = Math.max(20, Math.min(ARENA_HEIGHT - 20, state.playerY));
    }

    // 2. Automated Weapon Firing Timer
    shootTimer += 1 / 60;
    if (shootTimer >= stats.rate && performance.now() >= state.silencedUntil) {
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
      if (bullet.x < -10 || bullet.x > ARENA_WIDTH + 10 || bullet.y < -10 || bullet.y > ARENA_HEIGHT + 10) {
        state.bullets.splice(index, 1);
      }
    });

    // 4. Move & Check Enemies
    state.enemies.forEach((enemy, eIndex) => {
      // Every threat family owns a real movement or attack rule rather than
      // sharing one chase loop with larger numbers.
      const dx = state.playerX - enemy.x;
      const dy = state.playerY - enemy.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (!roomInGrace) moveEnemyByBehavior(enemy, dx, dy, dist);

      // Check player contact damage
      if (!roomInGrace && dist < enemy.size + 15) {
        const contactDamage = enemy.isBoss ? 0.24 : enemy.behavior === "rusher" ? 0.2 : 0.15;
        state.playerHp = Math.max(0, state.playerHp - contactDamage);
        if (["slower", "mire"].includes(enemy.behavior)) state.slowUntil = performance.now() + 800;
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
          if (enemy.shieldHits > 0) {
            enemy.shieldHits -= 1;
            state.bullets.splice(bIndex, 1);
            createDamageSparks(bullet.x, bullet.y, 0);
            return;
          }
          enemy.hp -= bullet.dmg;
          enemy.lastHitAt = performance.now();
          state.bullets.splice(bIndex, 1);

          // Spark particle system
          createDamageSparks(bullet.x, bullet.y, Math.max(1, Math.round(bullet.dmg)));

          // Enemy Defeated
          if (enemy.hp <= 0) {
            state.enemies.splice(eIndex, 1);
            if (enemy.behavior === "splitter") summonThreats(enemy, "rusher", 2);
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
              if (state.room === ROOMS_PER_EXPEDITION) {
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

    if (!roomInGrace) updateEnemyShots();

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
      const visual = getBulletVisualProfile(bullet.visualKey);
      const trailStart = bullet.trail[0];
      if (trailStart) {
        const glow = ctx.createLinearGradient(trailStart.x, trailStart.y, bullet.x, bullet.y);
        glow.addColorStop(0, visual.tailStart);
        glow.addColorStop(0.56, visual.tailMid);
        glow.addColorStop(1, visual.tailEnd);
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

        const angle = Math.atan2(bullet.vy, bullet.vx);
        ctx.fillStyle = visual.mote;
        bullet.trail.forEach((point, index) => {
          if (index % 3 !== 1) return;
          const alpha = (index + 1) / bullet.trail.length;
          ctx.globalAlpha = 0.2 + alpha * 0.6;
          ctx.save();
          ctx.translate(point.x, point.y);
          if (visual.moteShape === "slash") {
            ctx.rotate(angle);
            ctx.fillRect(-3, -1, 6, 2);
          } else if (visual.moteShape === "diamond") {
            ctx.rotate(Math.PI / 4);
            ctx.fillRect(-2, -2, 4, 4);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, 1.7, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        });
        ctx.restore();
      }

      ctx.save();
      ctx.fillStyle = visual.shell;
      ctx.shadowColor = visual.shadow;
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = visual.core;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, Math.max(2, bullet.size * 0.44), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    state.enemyShots.forEach((shot) => {
      const silence = shot.kind === "silence";
      ctx.save();
      ctx.fillStyle = silence ? "#c084fc" : shot.kind === "pulse" ? "#fb7185" : "#f59e0b";
      ctx.strokeStyle = silence ? "#f5d0fe" : "#fef3c7";
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 10;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(shot.x, shot.y, shot.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });

    // 5. Draw Enemies
    state.enemies.forEach((enemy) => {
      ctx.save();
      ctx.translate(enemy.x, enemy.y);

      const threatColors = {
        rusher: "#fb7185",
        shooter: "#f59e0b",
        pulser: "#f97316",
        splitter: "#84cc16",
        ward: "#38bdf8",
        regenerator: "#34d399",
        slower: "#2dd4bf",
        orbiter: "#818cf8",
        silencer: "#c084fc",
        moss: "#84cc16",
        echo: "#f59e0b",
        crystal: "#38bdf8",
        mire: "#34d399",
        moon: "#818cf8",
        crown: "#e879f9",
      };
      const threatColor = threatColors[enemy.behavior];
      if (threatColor) {
        ctx.strokeStyle = threatColor;
        ctx.globalAlpha = enemy.isBoss ? 0.88 : 0.58;
        ctx.lineWidth = enemy.isBoss ? 5 : 3;
        ctx.beginPath();
        ctx.arc(0, 3, enemy.size + (enemy.isBoss ? 12 : 6), 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      const guardianSprite = guardianSpriteForBehavior(enemy.behavior);
      const sprite = enemy.isBoss && guardianSprite?.complete
        ? guardianSprite
        : enemy.type === "boar" || enemy.type === "boss" ? assets.boar : assets.jaguar;
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
        ctx.fillText(enemy.label || "GUARDIAN", 0, -enemy.size - 14);
        ctx.textAlign = "left";
      } else if (sprite.complete) {
        ctx.drawImage(sprite, -enemy.size, -enemy.size, enemy.size * 2, enemy.size * 2);
      } else {
        ctx.fillStyle = enemy.type === "boar" ? "#4b5563" : "#7c3aed";
        ctx.fillRect(-enemy.size, -enemy.size, enemy.size * 2, enemy.size * 2);
      }

      if (enemy.shieldHits > 0) {
        ctx.strokeStyle = "#7dd3fc";
        ctx.lineWidth = 4;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(0, 0, enemy.size + 9, 0, Math.PI * 2);
        ctx.stroke();
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
  function clearMovementInput() {
    keysPressed = {};
    moveVector = { x: 0, y: 0 };
    moveTarget = null;
    if (movePointerId !== null && nodes.gameCanvas.hasPointerCapture?.(movePointerId)) {
      nodes.gameCanvas.releasePointerCapture(movePointerId);
    }
    movePointerId = null;
  }

  function setupInputs() {
    window.addEventListener("keydown", (e) => {
      if (manualPauseActive) return;
      if (!nodes.draftPanel.classList.contains("hidden")) {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        const choiceIndex = ["1", "2", "3"].indexOf(e.key);
        if (choiceIndex >= 0) {
          e.preventDefault();
          nodes.draftCards.querySelectorAll(".draft-item-btn")[choiceIndex]?.click();
        } else if (e.key.toLowerCase() === "r" && !nodes.rerollDraftBtn.disabled) {
          e.preventDefault();
          if (e.repeat) return;
          nodes.rerollDraftBtn.click();
        }
        return;
      }
      if (!state.gameActive) return;
      keysPressed[e.key] = true;
      if (["w", "a", "s", "d", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
    });
    window.addEventListener("keyup", (e) => {
      keysPressed[e.key] = false;
    });
    window.addEventListener("blur", clearMovementInput);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) suspendBackgroundBattle();
      else if (!manualPauseActive) resumeBackgroundBattle();
    });
    window.addEventListener("pagehide", suspendBackgroundBattle);
    window.addEventListener("pageshow", () => {
      if (!manualPauseActive) resumeBackgroundBattle();
    });

    function updateMoveTarget(event) {
      const rect = nodes.gameCanvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      moveTarget = {
        x: Math.max(20, Math.min(780, ((event.clientX - rect.left) / rect.width) * nodes.gameCanvas.width)),
        y: Math.max(20, Math.min(ARENA_HEIGHT - 20, ((event.clientY - rect.top) / rect.height) * nodes.gameCanvas.height)),
      };
    }

    // Crystal Survivor-style movement: tap a destination or keep dragging to
    // continuously update it. Keyboard input remains an equivalent override.
    nodes.gameCanvas.addEventListener("pointerdown", (event) => {
      if (!state.gameActive || event.isPrimary === false || movePointerId !== null || (event.button !== undefined && event.button !== 0)) return;
      movePointerId = event.pointerId;
      nodes.gameCanvas.setPointerCapture?.(event.pointerId);
      updateMoveTarget(event);
      event.preventDefault();
    });
    nodes.gameCanvas.addEventListener("pointermove", (event) => {
      if (movePointerId !== event.pointerId) return;
      updateMoveTarget(event);
      event.preventDefault();
    });
    const releaseMovePointer = (event) => {
      if (event.pointerId !== movePointerId) return;
      movePointerId = null;
      if (nodes.gameCanvas.hasPointerCapture?.(event.pointerId)) nodes.gameCanvas.releasePointerCapture(event.pointerId);
    };
    const cancelMovePointer = (event) => {
      if (event.pointerId !== movePointerId) return;
      movePointerId = null;
      moveTarget = null;
      moveVector = { x: 0, y: 0 };
      if (nodes.gameCanvas.hasPointerCapture?.(event.pointerId)) nodes.gameCanvas.releasePointerCapture(event.pointerId);
    };
    nodes.gameCanvas.addEventListener("pointerup", releaseMovePointer);
    nodes.gameCanvas.addEventListener("pointercancel", cancelMovePointer);
    nodes.gameCanvas.addEventListener("lostpointercapture", (event) => {
      if (event.pointerId !== movePointerId) return;
      movePointerId = null;
      moveTarget = null;
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
    nodes.showStageBtn.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
    });
    nodes.expeditionRail.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ") && event.target.closest(".expedition-card")) event.preventDefault();
    });
    nodes.expeditionRail.addEventListener("wonder:stage-snap", () => window.requestAnimationFrame(syncCenteredExpedition));
    nodes.expeditionRail.addEventListener("scrollend", syncCenteredExpedition);

    nodes.stageBackBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      showMain();
    });

    nodes.retryBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      if (resultNextExpedition) selectedExpedition = resultNextExpedition;
      startRun();
    });

    nodes.backToStageBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      setPauseModalActive(true, true, "leave");
    });

    nodes.pauseBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      setPauseModalActive(true);
    });
    nodes.pauseBtn.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
    });
    nodes.resumeBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      setPauseModalActive(false);
    });
    nodes.pauseStageBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      showStage();
    });
    nodes.pausePanel.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        nodes.resumeBtn.click();
        return;
      }
      if (event.key !== "Tab" || nodes.pausePanel.classList.contains("hidden")) return;
      const actions = [nodes.resumeBtn, nodes.pauseStageBtn].filter((button) => !button.disabled);
      const first = actions[0];
      const last = actions[actions.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    nodes.resultMenuBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      showStage();
    });

    nodes.resultPanel.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        return;
      }
      if (event.key !== "Tab" || nodes.resultPanel.classList.contains("hidden")) return;
      const actions = [nodes.retryBtn, nodes.resultMenuBtn].filter((button) => !button.disabled);
      if (!actions.length) return;
      const first = actions[0];
      const last = actions[actions.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    });

    nodes.localeSelect.addEventListener("change", (e) => {
      window.WonderSound?.play("click");
      window.WonderI18n?.setLocale?.(e.target.value);
    });

    nodes.draftPanel.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        return;
      }
      if (event.key !== "Tab" || nodes.draftPanel.classList.contains("hidden")) return;
      const actions = [...nodes.draftCards.querySelectorAll(".draft-item-btn"), nodes.rerollDraftBtn].filter((button) => !button.disabled);
      if (!actions.length) return;
      const first = actions[0];
      const last = actions[actions.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    });

    nodes.equipLootBtn.addEventListener("click", () => {
      finishLootDecision(true);
    });

    nodes.keepLootBtn.addEventListener("click", () => {
      finishLootDecision(false);
    });

    nodes.lootPanel.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        return;
      }
      if (event.key !== "Tab" || nodes.lootPanel.classList.contains("hidden")) return;
      const actions = [nodes.equipLootBtn, nodes.keepLootBtn].filter((button) => !button.disabled);
      if (!actions.length) return;
      const first = actions[0];
      const last = actions[actions.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    });

    nodes.rerollDraftBtn.addEventListener("click", () => {
      rerollDraftChoices();
    });

    nodes.trainingList?.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
    });

    nodes.backpackList?.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ") && event.target.closest(".gear-upgrade-btn")) {
        event.preventDefault();
      }
    });

    nodes.amuletBtn.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
      }
    });

    nodes.amuletBtn.addEventListener("click", () => {
      if (state.amuletUnlocked) return;
      const wallet = window.WeightPlayWallet?.read() || { diamonds: 0 };
      if (wallet.diamonds < amuletCost) {
        clearAmuletConfirmation();
        updateDiamondShopUI();
        return;
      }
      if (!amuletPurchasePending) {
        amuletPurchasePending = true;
        updateDiamondShopUI();
        armAmuletConfirmation(5000);
        return;
      }
      clearAmuletConfirmation();
      const spent = window.WeightPlayWallet?.spendDiamonds(amuletCost);
      if (spent) {
        state.amuletUnlocked = true;
        saveLocalState();
        window.WonderSound?.play("success");
        updateDiamondShopUI();
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
          state.room = Math.max(1, Math.min(ROOMS_PER_EXPEDITION, Number(room) || 1));
          state.runKeys = Math.max(0, Math.floor(Number(keys) || 0));
          nodes.menuPanel.classList.add("hidden");
          nodes.draftPanel.classList.add("hidden");
          setDraftModalActive(false, false);
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
        forceLootDecision(key = "dagger-epic") {
          state.gameActive = false;
          const dropResult = presentLootDecision(key);
          return { ...this.snapshot(), dropResult };
        },
        forceDraft() {
          state.gameActive = true;
          handleLevelUp();
          return {
            choices: currentDraftChoices.slice(),
            active: state.gameActive,
          };
        },
        replaceRoomForTest(room = 1) {
          state.room = Math.max(1, Math.min(ROOMS_PER_EXPEDITION, Number(room) || 1));
          spawnRoomEntities();
          return this.snapshot();
        },
        forceCurrentEliteForTest() {
          const task = eliteSpawnCallback;
          window.clearTimeout(eliteSpawnTimer);
          eliteSpawnTimer = 0;
          eliteSpawnDueAt = 0;
          eliteSpawnRemaining = 0;
          eliteSpawnCallback = null;
          task?.();
          return this.snapshot();
        },
        forceOpeningContactForTest() {
          state.enemies.forEach((enemy) => {
            enemy.x = state.playerX;
            enemy.y = state.playerY;
          });
          return this.snapshot();
        },
        campaignPreview() {
          return {
            count: expeditionDefs.length,
            ids: expeditionDefs.map((mission) => mission.id),
            regionCounts: Array.from({ length: 6 }, (_, index) => expeditionDefs.filter((mission) => mission.region === index + 1).length),
            checkpoints: expeditionDefs.filter((mission) => mission.checkpoint).map((mission) => mission.id),
            rules: [...new Set(expeditionDefs.map((mission) => mission.rule))],
            threatTypes: [...new Set(Object.values(regionThreatPools).flat())],
            encounters: expeditionDefs.map((mission) => {
              const profile = encounterProfiles[mission.rule];
              return {
                id: mission.id,
                rule: mission.rule,
                formations: profile.formations.slice(),
                rooms: profile.rooms.map((room) => room.slice()),
                grace: profile.grace.slice(),
                eliteDelay: profile.eliteDelay.slice(),
                hpMultiplier: profile.hpMultiplier,
                speedMultiplier: profile.speedMultiplier,
              };
            }),
            guardianBehaviors: guardianBehaviors.slice(),
            guardianAssets: guardianBehaviors.map((behavior) => {
              const asset = guardianSpriteForBehavior(behavior);
              return {
                behavior,
                src: asset?.src || "",
                complete: Boolean(asset?.complete),
                width: Number(asset?.naturalWidth) || 0,
                height: Number(asset?.naturalHeight) || 0,
              };
            }),
            finalScale: 1 + ((EXPEDITION_COUNT - 1) * 0.035) + ((ROOMS_PER_EXPEDITION - 1) * 0.08),
          };
        },
        guardianPhasePreview() {
          const previousEnemies = state.enemies;
          const previousShots = state.enemyShots;
          const previews = guardianBehaviors.map((behavior, index) => {
            state.enemies = [];
            state.enemyShots = [];
            const guardian = createThreat(behavior, 400, 400, { isElite: true, isBoss: true, hpMultiplier: 8, size: 54 });
            guardian.hp = guardian.maxHp * 0.3;
            if (behavior === "crystal" || behavior === "crown") guardian.shieldHits = 0;
            updateGuardianPhases(guardian);
            return {
              behavior,
              summons: state.enemies.length,
              shots: state.enemyShots.length,
              shieldHits: guardian.shieldHits,
              healed: guardian.hp > guardian.maxHp * 0.3,
              phases: guardian.phaseFlags.size,
            };
          });
          state.enemies = previousEnemies;
          state.enemyShots = previousShots;
          return previews;
        },
        prepareExpeditionForTest(expedition = EXPEDITION_COUNT, room = ROOMS_PER_EXPEDITION) {
          selectedExpedition = Math.max(1, Math.min(EXPEDITION_COUNT, Number(expedition) || 1));
          profile.unlockedExpedition = Math.max(profile.unlockedExpedition || 1, selectedExpedition);
          saveProfile();
          startRun();
          state.room = Math.max(1, Math.min(ROOMS_PER_EXPEDITION, Number(room) || 1));
          spawnRoomEntities();
          updateHUDText();
          return this.snapshot();
        },
        spawnGuardianForTest() {
          clearEliteSpawnTimer();
          const mission = missionDefinition();
          const guardian = createGuardian(mission.region, state.room === ROOMS_PER_EXPEDITION && mission.checkpoint);
          guardian.x = ARENA_WIDTH / 2;
          guardian.y = 260;
          state.enemies.push(guardian);
          state.bossWarningUntil = performance.now() + 2400;
          drawCanvasFrame();
          return {
            mission: mission.id,
            region: mission.region,
            checkpoint: mission.checkpoint,
            behavior: guardian.behavior,
            isBoss: guardian.isBoss,
            hp: guardian.hp,
            shieldHits: guardian.shieldHits,
          };
        },
        bulletVisuals() {
          return ["default", "sword-rare", "dagger-epic"].map((key) => ({
            key,
            ...getBulletVisualProfile(key),
          }));
        },
        refreshShopForTest() {
          updateDiamondShopUI();
          return this.snapshot();
        },
        previewBulletVisuals() {
          state.gameActive = false;
          cancelAnimationFrame(state.gameLoopId);
          state.enemies = [];
          state.pickups = [];
          state.orbs = [];
          state.bullets = ["default", "sword-rare", "dagger-epic"].map((visualKey, row) => ({
            x: 590,
            y: 140 + row * 110,
            vx: 7.5,
            vy: 0,
            dmg: 1,
            size: 8,
            visualKey,
            trail: Array.from({ length: 10 }, (_, index) => ({
              x: 350 + index * 24,
              y: 140 + row * 110,
            })),
          }));
          drawCanvasFrame();
          return state.bullets.map(({ visualKey, trail }) => ({ visualKey, trailPoints: trail.length }));
        },
        snapshot() {
          return {
            resultTitle: nodes.resultTitle.textContent,
            resultScore: nodes.resultScore.textContent,
            resultText: nodes.resultText.textContent,
            resultSummary: nodes.resultSummary?.textContent || "",
            runGold: state.runGold,
            goldText: nodes.goldText?.textContent || "",
            profile: JSON.parse(readStorage(profileKey) || JSON.stringify(profile)),
            wallet: window.WeightPlayWallet?.read?.() || null,
            expedition: state.expedition,
            room: state.room,
            enemyCount: state.enemies.length,
            enemyBehaviors: state.enemies.map((enemy) => enemy.behavior),
            eliteCount: state.enemies.filter((enemy) => enemy.isElite).length,
            eliteSpawnPending: Boolean(eliteSpawnTimer || eliteSpawnCallback),
            player: { x: state.playerX, y: state.playerY, hp: state.playerHp, maxHp: state.playerMaxHp, active: state.gameActive },
            moveTarget: moveTarget ? { ...moveTarget } : null,
            roomGraceRemaining: Math.max(0, state.roomGraceUntil - (backgroundSuspendedAt || performance.now())),
            paused: manualPauseActive,
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
