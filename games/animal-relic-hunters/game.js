(() => {
  ["stagePanel", "gamePanel"].forEach((id) => {
    document.getElementById(id)?.setAttribute("data-wp-canvas-max-width", "920");
  });
  document.getElementById("stagePanel")?.setAttribute("data-wp-stage-landscape-width", "760");
  document.getElementById("stagePanel")?.setAttribute("data-wp-stage-landscape-height", "334");

  const ARENA_WIDTH = 800;
  const ARENA_HEIGHT = 1000;
  const ROOM_ENTRY_GRACE_MS = 1500;
  const EXPEDITION_COUNT = 30;
  const ROOMS_PER_EXPEDITION = 3;
  const EXPEDITIONS_PER_REGION = 5;
  const GAME_ID = "animal-relic-hunters";
  const GAME_VERSION = 22;
  const INTERFACE_VERSION = 6;
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
    stageWorkspace: $("stageWorkspace"),
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
    campaignProgress: $("campaignProgress"),
    menuBtn: $("menuBtn"),
    retryBtn: $("retryBtn"),
    resultNextBtn: $("resultNextBtn"),
    resultMenuBtn: $("resultMenuBtn"),
    hpText: $("hpText"),
    hpFill: $("hpFill"),
    levelVal: $("levelVal"),
    expText: $("expText"),
    expFill: $("expFill"),
    roomText: $("roomText"),
    keyText: $("keyText"),
    goldText: $("goldText"),
    roomObjective: $("roomObjective"),
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
      menuHint: "Guide the explorer by tapping or dragging; relic weapons fire automatically. Defeat shadow beasts, collect Relic Orbs, and recover room keys.",
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
      roomObjectiveStart: "Find the golden key to open this room's relic chest.",
      roomObjectiveKey: "Find the golden key, then unlock the relic chest.",
      roomObjectiveChest: "Use the key on the relic chest; then enter the cyan portal.",
      roomObjectivePortal: "Relic claimed. Enter the cyan portal to the next room.",
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
      menuHint: "點擊或拖曳引導探險者；遺跡武器自動攻擊。擊敗影獸、收集遺跡能量球、找回房間金鑰。",
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
      amuletEffect: "每局挑戰開始時 +10 最大生命值（以 40 生命值開局，原為 30 生命值）。",
      amuletOwned: "已擁有：以 40 生命值開局。",
      startRun: "開始探險",
      menu: "選單",
      hudHp: "角色生命",
      roomLabel: "房間",
      keysLabel: "鑰匙",
      roomObjectiveStart: "先找到金色鑰匙，開啟這個房間的遺跡寶箱。",
      roomObjectiveKey: "找到金色鑰匙，再用它開啟遺跡寶箱。",
      roomObjectiveChest: "用鑰匙開啟遺跡寶箱，再進入青色傳送門。",
      roomObjectivePortal: "已取得遺物。進入青色傳送門前往下一個房間。",
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
    menuHint: "點擊或拖曳引導探險者；遺跡武器自動攻擊。擊敗影獸、收集遺跡能量球、找回房間金鑰。",
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
    amuletEffect: "每次探險開始時生命上限 +10（從 30 生命值變成 40 生命值）。",
    amuletOwned: "已擁有：每次探險都會以 40 生命值開始。",
    startRun: "開始探險",
    menu: "選單",
    hudHp: "生命值",
    roomLabel: "房間",
    keysLabel: "鑰匙",
    roomObjectiveStart: "先找到金色鑰匙，開啟這個房間的遺跡寶箱。",
    roomObjectiveKey: "找到金色鑰匙，再用它開啟遺跡寶箱。",
    roomObjectiveChest: "用鑰匙開啟遺跡寶箱，再進入青色傳送門。",
    roomObjectivePortal: "已取得遺物。進入青色傳送門前往下一個房間。",
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
    relic_shield_desc: "生命上限 +5，並立即恢復 5 點生命值。",
    relic_damage: "水晶獸牙",
    relic_damage_desc: "子彈傷害提高 20%。",
    relic_heal: "月泉吐息",
    relic_heal_desc: "立即恢復 12 點生命值。",
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

  text["zh-Hant"].gearLevelLabel = "\u7b49\u7d1a {level}";

  text.es = {
    title: "Cazadores Animales de Reliquias",
    menuTitle: "Explora las Ruinas Antiguas.",
    menuHint: "Guía al explorador tocando o arrastrando; las armas reliquia disparan solas. Derrota bestias sombrías, recoge Orbes Reliquia y recupera las llaves.",
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
    roomObjectiveStart: "Encuentra la llave dorada para abrir el cofre de reliquias de esta sala.",
    roomObjectiveKey: "Encuentra la llave dorada y abre el cofre de reliquias.",
    roomObjectiveChest: "Usa la llave en el cofre; después entra en el portal cian.",
    roomObjectivePortal: "Reliquia conseguida. Entra en el portal cian hacia la siguiente sala.",
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
    campaignProgress: "Expediciones completadas: {count} / 30",
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

  Object.assign(text, {
    "zh-Hans": {
      menuHint: "点击或拖曳引导探险者；遗迹武器自动攻击。击败影兽、收集遗迹能量球、找回房间金钥。"
    },
    ja: {
      menuHint: "タップやドラッグで探検家を導き、自動攻撃で影の獣を倒し、オーブと部屋の鍵を集めよう。"
    },
    ko: {
      menuHint: "탭·드래그로 탐험가를 이끌고 자동 발사로 그림자 야수를 물리쳐 오브와 열쇠를 모으세요."
    },
    "pt-BR": {
      menuHint: "Guie o explorador tocando ou arrastando; armas de relíquia disparam sozinhas. Derrote feras sombrias, colete Orbes de Relíquia e recupere chaves."
    },
    fr: {
      menuHint: "Guidez l’explorateur en touchant ou glissant; les armes tirent seules. Vainquez bêtes d’ombre, collectez Orbes de Relique et récupérez les clés."
    },
    de: {
      menuHint: "Führe die Entdeckerin per Tippen oder Ziehen; Reliktwaffen feuern automatisch. Besiege Schattenbestien, sammle Orbs und hole die Schlüssel zurück."
    },
    it: {
      menuHint: "Guida l’esploratore toccando o trascinando; le armi reliquia sparano automaticamente. Sconfiggi bestie d’ombra, raccogli Sfere e recupera le chiavi."
    },
    ru: {
      menuHint: "Ведите исследователя касанием или свайпом; оружие стреляет автоматически. Побеждайте теневых зверей, собирайте сферы и возвращайте ключи."
    },
    hi: {
      menuHint: "एरीना में टैप या ड्रैग से खोजकर्ता को चलाएँ; अवशेष हथियार अपने-आप हमला करते हैं। छाया-दैत्यों को हराएँ, ऑर्ब और कमरे की चाबियाँ पाएँ।"
    },
    ar: {
      menuHint: "المس أو اسحب في الساحة لتوجيه المستكشف بينما تطلق أسلحة الآثار تلقائيًا. اهزم وحوش الظلال، واجمع كرات الآثار، واستعد مفاتيح كل غرفة."
    }
  });

  Object.assign(text.en, {
    startGame: "Start Game",
    campaignProgress: "Expeditions cleared: {count} / 30",
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
    campaignProgress: "\u5df2\u5b8c\u6210\u9060\u5f81\uff1a{count} / 30",
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
    amuletConfirmEffect: "\u6c38\u4e45\uff1a\u6bcf\u6b21\u63a2\u96aa\u5f9e 30 \u751f\u547d\u503c \u63d0\u5347\u70ba 40 \u751f\u547d\u503c\u3002\u78ba\u8a8d {before} \u2192 {after} \u9846\u947d\u77f3\u3002",
    amuletConfirmStatus: "\u6bcf\u6b21\u63a2\u96aa\u6c38\u4e45 +10 \u6700\u5927\u751f\u547d\u3002\u9918\u984d {before} \u2192 {after} \u9846\u947d\u77f3\u3002",
    amuletNeedDiamonds: "\u9700\u8981 15 \u9846\u947d\u77f3\u3002\u76ee\u524d\u9918\u984d {balance}/15\u3002",
    amuletBuyLabel: "\u6c38\u4e45\u8cfc\u8cb7\u8ff7\u9727\u8b77\u7b26\u3002\u6bcf\u6b21\u63a2\u96aa\u5f9e 30 \u751f\u547d\u503c \u63d0\u5347\u70ba 40 \u751f\u547d\u503c\u3002\u82b1\u8cbb 15 \u9846\u947d\u77f3\u3002\u76ee\u524d\u9918\u984d {balance}\u3002",
    amuletConfirmLabel: "\u78ba\u8a8d\u6c38\u4e45\u8cfc\u8cb7\u8ff7\u9727\u8b77\u7b26\u3002\u82b1\u8cbb 15 \u9846\u947d\u77f3\u3002\u9918\u984d {before} \u8b8a\u70ba {after}\u3002\u6bcf\u6b21\u63a2\u96aa\u5f9e 40 \u751f\u547d\u503c \u958b\u59cb\u3002",
    resultSummaryProgress: "\u4efb\u52d9\u9032\u5ea6",
    resultUnlocked: "\u65b0\u9060\u5f81\u5df2\u89e3\u9396\uff1a{region}",
    resultReady: "\u53ef\u6311\u6230\u9060\u5f81\uff1a{region}",
    resultAllCleared: "\u5df2\u5b8c\u6210 30 \u500b\u9060\u5f81\u8207\u516d\u5927\u907a\u8de1\u5b88\u8b77\u8005",
    nextExpedition: "\u4e0b\u4e00\u4efb\u52d9",
  });

  Object.assign(text["zh-Hans"], {
    title: "动物遗迹猎人",
    menuTitle: "探索古代遗迹。",
    menuHint: "点击或拖曳引导探险者；遗迹武器自动攻击。击败影兽、收集遗迹能量球、找回每个房间的钥匙。",
    prototypeGoalsTitle: "远征目标",
    prototypeGoalsText: "完成 30 次三房间远征，学习每个遗迹的威胁，并击败六位区域守护者，同时通过永久训练和装备不断成长。",
    startGame: "开始游戏",
    campaignProgress: "已完成远征：{count} / 30",
  });
  Object.assign(text.ja, {
    title: "どうぶつレリックハンター",
    menuTitle: "古代遺跡を探検しよう。",
    menuHint: "タップやドラッグで探検家を導き、自動攻撃で影の獣を倒し、オーブと各部屋の鍵を集めよう。",
    prototypeGoalsTitle: "遠征の目標",
    prototypeGoalsText: "30回の三部屋遠征で遺跡ごとの脅威を学び、永久訓練と装備で成長しながら6体の地域ガーディアンを倒そう。",
    startGame: "ゲーム開始",
    campaignProgress: "クリアした遠征：{count} / 30",
  });
  Object.assign(text.ko, {
    title: "동물 유물 사냥꾼",
    menuTitle: "고대 유적을 탐험하세요.",
    menuHint: "탭하거나 드래그해 탐험가를 이끌고 자동 공격으로 그림자 야수를 물리치며 각 방의 열쇠와 오브를 모으세요.",
    prototypeGoalsTitle: "원정 목표",
    prototypeGoalsText: "30번의 세 방 원정에서 유적의 위협을 배우고 영구 훈련과 장비로 성장하며 여섯 지역 수호자를 물리치세요.",
    startGame: "게임 시작",
    campaignProgress: "완료한 원정: {count} / 30",
  });
  Object.assign(text["pt-BR"], {
    title: "Caçadores de Relíquias Animais",
    menuTitle: "Explore as ruínas antigas.",
    menuHint: "Guie o explorador tocando ou arrastando; armas de relíquia disparam sozinhas. Derrote feras sombrias, colete Orbes de Relíquia e recupere as chaves de cada sala.",
    prototypeGoalsTitle: "Objetivo da expedição",
    prototypeGoalsText: "Conclua 30 expedições de três salas, aprenda as ameaças de cada ruína e derrote seis Guardiões regionais enquanto evolui com treino e equipamento permanentes.",
    startGame: "Começar jogo",
    campaignProgress: "Expedições concluídas: {count} / 30",
  });
  Object.assign(text.fr, {
    title: "Chasseurs de reliques animaliers",
    menuTitle: "Explorez les ruines anciennes.",
    menuHint: "Guidez l’explorateur en touchant ou glissant ; les armes tirent seules. Vainquez les bêtes d’ombre, collectez les Orbes de Relique et récupérez les clés de chaque salle.",
    prototypeGoalsTitle: "Objectif de l’expédition",
    prototypeGoalsText: "Terminez 30 expéditions de trois salles, apprenez les menaces de chaque ruine et vainquez six Gardiens régionaux grâce à l’entraînement et à l’équipement permanents.",
    startGame: "Commencer",
    campaignProgress: "Expéditions terminées : {count} / 30",
  });
  Object.assign(text.de, {
    title: "Tierische Reliktjäger",
    menuTitle: "Erkunde die alten Ruinen.",
    menuHint: "Führe die Entdeckerin per Tippen oder Ziehen; Reliktwaffen feuern automatisch. Besiege Schattenbestien, sammle Orbs und hole die Schlüssel jedes Raums zurück.",
    prototypeGoalsTitle: "Expeditionsziel",
    prototypeGoalsText: "Schließe 30 Expeditionen mit je drei Räumen ab, lerne die Gefahren jeder Ruine kennen und besiege sechs regionale Wächter mit dauerhafter Ausbildung und Ausrüstung.",
    startGame: "Spiel starten",
    campaignProgress: "Abgeschlossene Expeditionen: {count} / 30",
  });
  Object.assign(text.it, {
    title: "Cacciatori di reliquie animali",
    menuTitle: "Esplora le rovine antiche.",
    menuHint: "Guida l’esploratore toccando o trascinando; le armi reliquia sparano automaticamente. Sconfiggi le bestie d’ombra, raccogli le Sfere e recupera le chiavi di ogni stanza.",
    prototypeGoalsTitle: "Obiettivo della spedizione",
    prototypeGoalsText: "Completa 30 spedizioni di tre stanze, impara le minacce di ogni rovina e sconfiggi sei Guardiani regionali crescendo con addestramento ed equipaggiamento permanenti.",
    startGame: "Inizia partita",
    campaignProgress: "Spedizioni completate: {count} / 30",
  });
  Object.assign(text.ru, {
    title: "Охотники за звериными реликвиями",
    menuTitle: "Исследуйте древние руины.",
    menuHint: "Ведите исследователя касанием или свайпом; оружие стреляет автоматически. Побеждайте теневых зверей, собирайте сферы и возвращайте ключи из каждой комнаты.",
    prototypeGoalsTitle: "Цель экспедиции",
    prototypeGoalsText: "Пройдите 30 экспедиций по три комнаты, изучите угрозы каждой руины и победите шестерых региональных хранителей с помощью постоянной тренировки и снаряжения.",
    startGame: "Начать игру",
    campaignProgress: "Завершено экспедиций: {count} / 30",
  });
  Object.assign(text.hi, {
    title: "पशु अवशेष शिकारी",
    menuTitle: "प्राचीन खंडहरों का अन्वेषण करें।",
    menuHint: "टैप या ड्रैग से खोजकर्ता को चलाएँ; अवशेष हथियार अपने-आप हमला करते हैं। छाया-दैत्यों को हराएँ, ऑर्ब इकट्ठे करें और हर कमरे की चाबियाँ वापस पाएँ।",
    prototypeGoalsTitle: "अभियान का लक्ष्य",
    prototypeGoalsText: "तीन कमरों वाले 30 अभियानों को पूरा करें, हर खंडहर के खतरे सीखें और स्थायी प्रशिक्षण व उपकरणों के साथ छह क्षेत्रीय संरक्षकों को हराएँ।",
    startGame: "खेल शुरू करें",
    campaignProgress: "पूरे किए गए अभियान: {count} / 30",
  });
  Object.assign(text.ar, {
    title: "صيادو الآثار الحيوانية",
    menuTitle: "استكشف الآثار القديمة.",
    menuHint: "المس أو اسحب في الساحة لتوجيه المستكشف بينما تطلق أسلحة الآثار تلقائيًا. اهزم وحوش الظلال، واجمع كرات الآثار، واستعد مفاتيح كل غرفة.",
    prototypeGoalsTitle: "هدف الرحلة",
    prototypeGoalsText: "أكمل 30 رحلة من ثلاث غرف، وتعلّم أخطار كل أثر، واهزم ستة حراس إقليميين مع تطوير التدريب والمعدات الدائمة.",
    startGame: "ابدأ اللعبة",
    campaignProgress: "الرحلات المكتملة: {count} / 30",
  });

  Object.assign(text.en, {
    combatHit: "Relic weapon hit · {damage} damage",
    combatWard: "Ward struck · one charge removed",
    combatHurt: "Enemy impact · keep moving",
  });
  Object.assign(text["zh-Hant"], {
    combatHit: "遺跡武器命中・造成 {damage} 點傷害",
    combatWard: "護盾命中・消耗 1 層",
    combatHurt: "受到敵方衝擊・持續移動",
  });
  Object.assign(text.es, {
    combatHit: "Impacto del arma reliquia · {damage} de daño",
    combatWard: "Impacto en la barrera · se elimina 1 carga",
    combatHurt: "Impacto enemigo · sigue moviéndote",
  });
  Object.assign(text["zh-Hans"], {
    combatHit: "遗迹武器命中 · 造成 {damage} 点伤害",
    combatWard: "护盾命中 · 消耗 1 层",
    combatHurt: "受到敌方冲击 · 继续移动",
  });
  Object.assign(text.ja, {
    combatHit: "遺物武器ヒット・{damage}ダメージ",
    combatWard: "結界に命中・残り1層",
    combatHurt: "敵の攻撃を受けた・動き続けよう",
  });
  Object.assign(text.ko, {
    combatHit: "유물 무기 적중 · 피해 {damage}",
    combatWard: "보호막 적중 · 1회 차감",
    combatHurt: "적의 충격 · 계속 움직이세요",
  });
  Object.assign(text["pt-BR"], {
    combatHit: "Arma de relíquia atingiu · {damage} de dano",
    combatWard: "Barreira atingida · 1 carga removida",
    combatHurt: "Impacto inimigo · continue se movendo",
  });
  Object.assign(text.fr, {
    combatHit: "Impact de l’arme relique · {damage} dégâts",
    combatWard: "Impact sur la barrière · 1 charge retirée",
    combatHurt: "Impact ennemi · continuez à bouger",
  });
  Object.assign(text.de, {
    combatHit: "Reliktwaffe trifft · {damage} Schaden",
    combatWard: "Wardschild getroffen · 1 Ladung entfernt",
    combatHurt: "Feindtreffer · weiter bewegen",
  });
  Object.assign(text.it, {
    combatHit: "Colpo dell’arma reliquia · {damage} danni",
    combatWard: "Colpo alla barriera · rimossa 1 carica",
    combatHurt: "Impatto nemico · continua a muoverti",
  });
  Object.assign(text.ru, {
    combatHit: "Попадание оружия-реликвии · урон: {damage}",
    combatWard: "Удар по барьеру · снят 1 заряд",
    combatHurt: "Удар врага · продолжайте двигаться",
  });
  Object.assign(text.hi, {
    combatHit: "अवशेष हथियार का प्रहार · {damage} क्षति",
    combatWard: "वार्ड पर प्रहार · 1 चार्ज घटा",
    combatHurt: "शत्रु का प्रहार · चलते रहें",
  });
  Object.assign(text.ar, {
    combatHit: "إصابة بسلاح الأثر · ضرر {damage}",
    combatWard: "إصابة الحاجز · أزيلت شحنة واحدة",
    combatHurt: "ضربة من العدو · واصل الحركة",
  });

  // Arabic owns the complete runtime surface so Stage, Battle, Loot, Result,
  // training, gear and accessible decisions never fall back to English.
  Object.assign(text.ar, {
    diamondShopTitle: "ترقية دائمة",
    goldLabel: "ذهب",
    trainingTitle: "تدريب دائم",
    trainingPoints: "نقاط",
    trainingNote: "مستوى الشخصية دائم. أنفق نقاط المستوى هنا لتبدأ كل رحلة بقوة أكبر.",
    growthReadyTitle: "النمو الدائم التالي",
    growthReadyTraining: "أنفق {points} من نقاط التدريب قبل الرحلة التالية.",
    growthReadyGear: "طوّر {gear} مقابل {gold} من الذهب.",
    growthReadyBoth: "درّب أولًا، ثم طوّر {gear} مقابل {gold} من الذهب.",
    growthReadyNone: "قاتل لتحصل على الذهب والخبرة، ثم عدّ للتدريب أو تطوير المعدات.",
    train_damage: "تدريب الهجوم",
    train_damage_desc: "+2 ضرر لكل مستوى.",
    train_hp: "تدريب الحيوية",
    train_hp_desc: "+5 إلى الحد الأقصى للصحة لكل مستوى.",
    train_speed: "تدريب الرشاقة",
    train_speed_desc: "+0.2 إلى سرعة الحركة لكل مستوى.",
    train_magnet: "حسّ الآثار",
    train_magnet_desc: "+15 بكسل إلى مدى الالتقاط لكل مستوى.",
    trainAction: "تدريب",
    trainMax: "الحد الأقصى",
    upgradeGearAction: "تطوير",
    upgradeNeedGold: "تحتاج إلى {gold} من الذهب",
    gearLevelLabel: "المستوى {level}",
    goldEarned: "ذهب",
    amuletName: "تميمة الضباب",
    amuletEffect: "ابدأ كل رحلة بزيادة 10 في الحد الأقصى للصحة (40 بدلًا من 30).",
    amuletOwned: "مملوكة: تبدأ كل رحلة بـ40 من الصحة القصوى.",
    startRun: "ابدأ الرحلة",
    menu: "القائمة",
    hudHp: "صحة اللاعب",
    roomLabel: "الغرفة",
    keysLabel: "المفاتيح",
    roomObjectiveStart: "اعثر على المفتاح الذهبي لفتح صندوق الآثار في هذه الغرفة.",
    roomObjectiveKey: "اعثر على المفتاح الذهبي، ثم افتح صندوق الآثار.",
    roomObjectiveChest: "استخدم المفتاح على الصندوق، ثم ادخل البوابة الفيروزية.",
    roomObjectivePortal: "حصلت على الأثر. ادخل البوابة الفيروزية إلى الغرفة التالية.",
    chooseCard: "اختر ترقية أثر",
    chooseCardDesc: "اختر أثرًا قديمًا لتعزيز مستكشفك.",
    draftShortcutHint: "لوحة المفاتيح: اضغط 1 أو 2 أو 3 للاختيار، واضغط R لإعادة السحب.",
    rerollRelics: "إعادة سحب خيارات الآثار",
    rerollRelicsConfirm: "تأكيد إعادة السحب",
    rerollRelicsLabel: "استبدل خيارات الآثار الثلاثة. التكلفة 3 ألماسات. رصيدك الحالي {balance}.",
    rerollRelicsConfirmLabel: "أكد إعادة سحب الآثار. أنفق 3 ألماسات. الرصيد من {before} إلى {after}. ستُستبدل الخيارات الثلاثة.",
    rerollRelicsDecision: "استبدل خيارات الآثار الثلاثة. اضغط مرة أخرى للتأكيد: {before} ← {after} ألماسات.",
    rerollRelicsUsed: "استُخدمت إعادة السحب لهذا المستوى.",
    rerollRelicsNeedDiamonds: "لا تملك ألماسات كافية لإعادة السحب.",
    lootFound: "فُتح صندوق الأثر!",
    equipLoot: "تجهيز المعدات",
    backpackTitle: "الحقيبة",
    backpackEmpty: "افتح صناديق الآثار لجمع المعدات الدائمة.",
    equipGearAction: "تجهيز",
    equippedTag: "مجهّز",
    tryAgain: "حاول مرة أخرى",
    backToMenu: "العودة إلى القائمة",
    backToStage: "العودة إلى المهمات",
    sidebarInventory: "المعدات المجهّزة",
    sidebarStats: "إحصاءات الشخصية",
    slotWeapon: "السلاح",
    slotArmor: "الدرع",
    slotBoots: "الأحذية",
    noneLabel: "لا شيء",
    statDamage: "الضرر:",
    statMaxHp: "الحد الأقصى للصحة",
    statAttackRate: "معدل الهجوم:",
    statSpeed: "السرعة:",
    statMagnetRange: "مدى المغناطيس:",
    hudStage: "الغرف المكتملة",
    runComplete: "نجحت الرحلة!",
    runFailed: "هُزم المستكشف",
    resultSummaryLevel: "المستوى المحفوظ",
    resultSummaryRooms: "الغرف",
    resultSummaryKeys: "مفاتيح الرحلة",
    resultSummaryGold: "الذهب المكتسب",
    resultSummaryGear: "المعدات المجهّزة",
    resultSummaryNoGear: "لم تُجهّز معدات بعد",
    resultSummaryNext: "النمو التالي",
    resultDisclaimer: "للترفيه وتتبع التقدم محليًا فقط.",
    skillReportTitle: "تقرير تحليل القدرات",
    skillLogic: "المنطق",
    skillFocus: "التركيز",
    skillProblem: "حل المشكلات",
    relic_magnet: "مغناطيس الأثر",
    relic_magnet_desc: "زد مدى جذب العناصر 40 بكسل.",
    relic_speed: "اندفاعة الفانوس",
    relic_speed_desc: "قلّل الفاصل بين طلقات السلاح 20٪.",
    relic_shield: "قلب الدرع",
    relic_shield_desc: "زد الحد الأقصى للصحة 5 واستعد 5 صحة.",
    relic_damage: "ناب الكريستال",
    relic_damage_desc: "زد ضرر الرصاصة 20٪.",
    relic_heal: "نَفَس البئر القمري",
    relic_heal_desc: "استعد 12 من الصحة فورًا.",
    gear_sword_rare: "سيف الكريستال",
    gear_sword_rare_desc: "+30٪ ضرر الرصاص",
    gear_dagger_epic: "خنجر الأثر",
    gear_dagger_epic_desc: "-30٪ من فاصل الإطلاق",
    gear_armor_rare: "درع الصدر الخرِب",
    gear_armor_rare_desc: "+10 إلى الحد الأقصى للصحة",
    gear_armor_epic: "بريد الأثر الذهبي",
    gear_armor_epic_desc: "+20 إلى الحد الأقصى للصحة",
    gear_boots_rare: "حذاء المستكشف",
    gear_boots_rare_desc: "+20٪ سرعة الحركة",
    gear_boots_epic: "صنادل هرمس",
    gear_boots_epic_desc: "+40٪ سرعة الحركة",
    rarity_rare: "معدات نادرة",
    rarity_epic: "معدات أسطورية",
    report_win: "اكتملت الرحلة! قرأت نمط خطر الأثر، وحميت طريق معداتك، وهزمت حارسه الأخير.",
    report_partial: "وصلت إلى الغرفة {room}. عدّل اختيارات آثارك ومعداتك قبل تحدي هذا الحارس مجددًا.",
    report_no_wins: "واصل الاستكشاف! ركّز على جمع المفاتيح والحفاظ على صحتك.",
    bossWarning: "حارس الأثر يقترب!",
    startGame: "ابدأ اللعبة",
    campaignProgress: "الرحلات المكتملة: {count} / 30",
    chooseExpedition: "اختر الرحلة",
    expeditionGoal: "3 غرف · المستوى الموصى به {level}",
    expeditionLocked: "أكمل الرحلة {region} أولًا",
    lootNewGear: "أُضيفت معدات جديدة إلى الحقيبة.",
    lootDuplicateGear: "حُوّلت المعدات المكررة إلى {gold}+ من الذهب.",
    gearCurrentEffect: "الآن: {effect}",
    gearNextEffect: "التالي: {effect}",
    gearMaxLevel: "أعلى مستوى",
    gearCompareActive: "نشط في هذه الخانة.",
    gearCompareEmpty: "الخانة فارغة: جهّزها لتفعيل هذا التأثير.",
    gearCompareReplace: "يستبدل {gear}: {effect}",
    equipLootChoice: "جهّز {gear}",
    keepLootChoice: "احتفظ بالمعدات الحالية",
    continueLootChoice: "متابعة",
    lootAlreadyEquipped: "مجهّز بالفعل",
    lootDecisionLabel: "اختر تجهيز {gear} أو الاحتفاظ بالتشكيلة الحالية.",
    amuletConfirmTitle: "تأكيد تميمة الضباب",
    amuletConfirmEffect: "دائمة: تبدأ كل رحلة بـ40 صحة بدلًا من 30. أكد {before} ← {after} ألماسات.",
    amuletConfirmStatus: "+10 إلى الحد الأقصى للصحة دائمًا. الرصيد {before} ← {after} ألماسات.",
    amuletNeedDiamonds: "تحتاج إلى 15 ألماسة. الرصيد الحالي {balance}/15.",
    amuletBuyLabel: "اشترِ تميمة الضباب دائمًا. تبدأ كل رحلة بـ40 صحة بدلًا من 30. التكلفة 15 ألماسة. الرصيد الحالي {balance}.",
    amuletConfirmLabel: "أكد شراء تميمة الضباب الدائمة. أنفق 15 ألماسة. الرصيد من {before} إلى {after}. تبدأ كل رحلة بـ40 صحة.",
    resultSummaryProgress: "تقدم المهمة",
    resultUnlocked: "فُتحت رحلة جديدة: {region}",
    resultReady: "الرحلة الجاهزة: {region}",
    resultAllCleared: "اكتملت الرحلات الثلاثون وحراس الآثار الستة",
    nextExpedition: "المهمة التالية",
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

  const enemyShotVisualProfiles = Object.freeze({
    bolt: Object.freeze({ fill: "#f59e0b", stroke: "#fff7d6", shadow: "#f59e0b", shape: "chevron" }),
    pulse: Object.freeze({ fill: "#fb7185", stroke: "#fff1f2", shadow: "#fb7185", shape: "double-ring" }),
    silence: Object.freeze({ fill: "#c084fc", stroke: "#faf5ff", shadow: "#c084fc", shape: "diamond-cross" }),
  });

  function getEnemyShotVisualProfile(kind) {
    return enemyShotVisualProfiles[kind] || enemyShotVisualProfiles.bolt;
  }

  function drawEnemyShot(ctx, shot) {
    const profile = getEnemyShotVisualProfile(shot.kind);
    const size = Math.max(8, Number(shot.size) || 8);
    ctx.save();
    ctx.translate(shot.x, shot.y);
    ctx.fillStyle = profile.fill;
    ctx.strokeStyle = profile.stroke;
    ctx.shadowColor = profile.shadow;
    ctx.shadowBlur = 11;
    ctx.lineWidth = Math.max(2, size * 0.22);

    if (profile.shape === "double-ring") {
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.42, 0, Math.PI * 2);
      ctx.stroke();
    } else if (profile.shape === "diamond-cross") {
      ctx.rotate(Math.PI / 4);
      ctx.beginPath();
      ctx.rect(-size * 0.72, -size * 0.72, size * 1.44, size * 1.44);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.moveTo(-size * 0.38, 0);
      ctx.lineTo(size * 0.38, 0);
      ctx.moveTo(0, -size * 0.38);
      ctx.lineTo(0, size * 0.38);
      ctx.stroke();
    } else {
      const angle = Math.atan2(Number(shot.vy) || 0, Number(shot.vx) || 1);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(size, 0);
      ctx.lineTo(-size * 0.7, -size * 0.78);
      ctx.lineTo(-size * 0.28, 0);
      ctx.lineTo(-size * 0.7, size * 0.78);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
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
  const expeditionNamesAr = [
    "بوابة الطحالب", "كمين طريق الجذور", "دائرة الأشواك", "خزانة الآثار الخضراء", "حارس الطحالب",
    "رواق الصدى", "درجات الهمس", "القاعة الرنانة", "حجرة الجرس", "حارس الصدى",
    "قبو الكريستال", "ممر المنشور", "منجم الشظايا", "متاهة الأوجه", "عملاق المنشور",
    "المزار الغارق", "الصحن المغمور", "موكب المستنقع", "الأرشيف الغارق", "هيدرا المستنقع الحلزونية",
    "أرشيف القمر", "مرصد الحبر", "رفوف القمر", "الفهرس النجمي", "حارس الأرشيف",
    "طريق التاج", "جسر السبج", "فرن الآثار", "بلاط الأختام الستة", "ملك تاج الأثر"
  ];

  const expeditionDefs = expeditionBlueprints.map(([en, zh, rule], index) => ({
    id: index + 1,
    level: 1 + Math.floor(index * 0.8),
    region: Math.floor(index / EXPEDITIONS_PER_REGION) + 1,
    checkpoint: (index + 1) % EXPEDITIONS_PER_REGION === 0,
    en,
    zh,
    es: expeditionNamesEs[index],
    ar: expeditionNamesAr[index],
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
    playerHitUntil: 0,
    roomGraceUntil: 0,
  };

  let profile = createDefaultProfile();
  let selectedExpedition = 1;
  let browsedExpedition = 1;
  const EXPEDITION_CARD_POOL_SIZE = 9;
  let expeditionCardPool = [];
  let expeditionWindowStart = 0;
  let expeditionDrag = null;
  let expeditionSettleFrame = 0;
  let suppressExpeditionClick = false;
  let resultNextExpedition = 0;
  let resultMapIsPrimary = false;
  let lastTrackedObjectiveKey = "";
  let combatFeedbackText = "";
  let combatFeedbackUntil = 0;
  let lastCombatFeedbackAt = 0;
  let eliteSpawnTimer = 0;
  let eliteSpawnDueAt = 0;
  let eliteSpawnCallback = null;
  let eliteSpawnRemaining = 0;
  let backgroundSuspendedAt = 0;
  let backgroundBattleSuspended = false;
  let manualPauseActive = false;
  let pauseDialogMode = "pause";
  let windowFocused = document.hasFocus();

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
    if (!backgroundSuspendedAt || document.hidden || !windowFocused) return;
    const elapsed = Math.max(0, performance.now() - backgroundSuspendedAt);
    backgroundSuspendedAt = 0;
    ["roomGraceUntil", "slowUntil", "silencedUntil", "bossWarningUntil", "lastHitSoundAt", "playerHitUntil"].forEach((key) => {
      if (state[key] > 0) state[key] += elapsed;
    });
    state.enemies.forEach((enemy) => {
      if (enemy.lastHitAt > 0) enemy.lastHitAt += elapsed;
      if (enemy.hitFlashUntil > 0) enemy.hitFlashUntil += elapsed;
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

  function viewportBucket() {
    const width = Math.max(0, Number(window.innerWidth) || 0);
    return width < 600 ? "compact" : width < 900 ? "medium" : "wide";
  }

  function inferredInputType(fallback = "unknown") {
    if (movePointerId !== null || moveTarget) return "pointer";
    if (Object.values(keysPressed).some(Boolean)) return "keyboard";
    return fallback;
  }

  function trackGrowthEvent(name, details = {}) {
    const track = window.WonderAnalytics?.track;
    if (typeof track !== "function") return;
    try {
      track.call(window.WonderAnalytics, name, {
        game_id: GAME_ID,
        game_version: GAME_VERSION,
        interface_version: INTERFACE_VERSION,
        locale: getLocale(),
        viewport_bucket: viewportBucket(),
        input_type: details.input_type || inferredInputType(),
        expedition: state.expedition || selectedExpedition || 1,
        room: state.room || 1,
        ...details,
      });
    } catch {
      // Analytics must never affect gameplay or block the local game loop.
    }
  }

  function t(key, params = {}) {
    const locale = getLocale();
    const raw = text[locale]?.[key] || text.en[key] || key;
    return Object.entries(params).reduce((str, [k, v]) => str.replaceAll(`{${k}}`, String(v)), raw);
  }

  function objectiveText(key) {
    const locale = getLocale();
    const localized = text[locale]?.[key];
    const source = text.en[key] || key;
    const translated = !localized && locale !== "en"
      ? window.WeightPlayGameRuntimeLocalizer?.translate?.(source)
      : "";
    return translated || localized || source;
  }

  function showCombatFeedback(key, params = {}, duration = 1250) {
    const now = performance.now();
    if (now - lastCombatFeedbackAt < 320) return;
    lastCombatFeedbackAt = now;
    combatFeedbackText = t(key, params);
    combatFeedbackUntil = now + duration;
    if (nodes.roomObjective) {
      nodes.roomObjective.hidden = false;
      nodes.roomObjective.textContent = combatFeedbackText;
    }
  }

  function markEnemyImpact(enemy, { damage = 0, blocked = false, visualKey = "default" } = {}) {
    if (!enemy) return;
    enemy.hitFlashUntil = performance.now() + 260;
    enemy.hitVisualKey = visualKey;
    showCombatFeedback(blocked ? "combatWard" : "combatHit", blocked ? {} : { damage: Math.max(1, Math.round(Number(damage) || 0)) });
  }

  function markPlayerImpact() {
    state.playerHitUntil = performance.now() + 280;
    showCombatFeedback("combatHurt");
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

  Object.assign(ariaText, {
    "zh-Hans": { lobby: "返回大厅", language: "语言选择器", stageBack: "返回主页", regions: "遗迹区域", battleBack: "返回准备界面", arena: "战斗场地。点击或拖曳移动，也可使用 WASD 和方向键。" },
    ja: { lobby: "ロビーに戻る", language: "言語セレクター", stageBack: "メインに戻る", regions: "遺跡の地域", battleBack: "準備画面に戻る", arena: "バトルアリーナ。タップまたはドラッグで移動し、WASDや矢印キーも使えます。" },
    ko: { lobby: "로비로 돌아가기", language: "언어 선택기", stageBack: "메인으로 돌아가기", regions: "유적 지역", battleBack: "준비 화면으로 돌아가기", arena: "전투 아레나. 탭하거나 드래그해 이동하고 WASD와 방향키도 사용할 수 있습니다." },
    "pt-BR": { lobby: "Voltar ao lobby", language: "Seletor de idioma", stageBack: "Voltar ao início", regions: "Regiões das ruínas", battleBack: "Voltar à preparação", arena: "Arena de batalha. Toque ou arraste para mover; WASD e as setas também funcionam." },
    fr: { lobby: "Retourner au lobby", language: "Sélecteur de langue", stageBack: "Retour à l’accueil", regions: "Régions des ruines", battleBack: "Retour à la préparation", arena: "Arène de combat. Touchez ou faites glisser pour bouger ; WASD et les flèches fonctionnent aussi." },
    de: { lobby: "Zur Lobby zurück", language: "Sprachauswahl", stageBack: "Zur Hauptseite", regions: "Ruinenregionen", battleBack: "Zur Vorbereitung zurück", arena: "Kampfarena. Tippen oder ziehen Sie zum Bewegen; WASD und Pfeiltasten funktionieren ebenfalls." },
    it: { lobby: "Torna alla lobby", language: "Selettore lingua", stageBack: "Torna alla schermata principale", regions: "Regioni delle rovine", battleBack: "Torna alla preparazione", arena: "Arena di battaglia. Tocca o trascina per muoverti; funzionano anche WASD e le frecce." },
    ru: { lobby: "Вернуться в лобби", language: "Выбор языка", stageBack: "Вернуться в меню", regions: "Регионы руин", battleBack: "Вернуться к подготовке", arena: "Арена боя. Нажимайте или проводите для движения; также работают WASD и стрелки." },
    hi: { lobby: "लॉबी पर लौटें", language: "भाषा चयनकर्ता", stageBack: "मुख्य पृष्ठ पर लौटें", regions: "खंडहर क्षेत्र", battleBack: "तैयारी पर लौटें", arena: "युद्ध क्षेत्र। चलने के लिए टैप या ड्रैग करें; WASD और तीर कुंजियाँ भी काम करती हैं।" },
    ar: { lobby: "العودة إلى الردهة", language: "محدد اللغة", stageBack: "العودة إلى الرئيسية", regions: "مناطق الآثار", battleBack: "العودة إلى التحضير", arena: "ساحة المعركة. المس أو اسحب للتحرك، ويمكنك أيضًا استخدام WASD ومفاتيح الأسهم." },
  });

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
    ar: {
      action: "إيقاف مؤقت",
      title: "الرحلة متوقفة مؤقتًا",
      message: "توقّف مؤقت الغرفة وكل الحركة.",
      resume: "متابعة",
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
    ar: {
      title: "هل تريد مغادرة هذه الرحلة؟",
      message: ({ expedition, room, hp, maxHp, keys, gold }) => `الرحلة ${expedition}، الغرفة ${room}: الصحة ${hp}/${maxHp}، المفاتيح ${keys}، ذهب الرحلة ${gold}. المغادرة تفقد هذه الرحلة وتقدم الغرفة والمفاتيح وترقيات الآثار. يبقى المستوى الدائم والتدريب والحقيبة والمعدات والذهب المحفوظ آمنًا.`,
      resume: "متابعة الاستكشاف",
      leave: "مغادرة الرحلة",
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
    nodes.gameCanvas.setAttribute("aria-keyshortcuts", "w a s d ArrowUp ArrowDown ArrowLeft ArrowRight");
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

  function renderCampaignProgress() {
    if (!nodes.campaignProgress) return;
    const count = Math.max(0, Math.min(30, Math.floor(Number(profile.bestExpedition) || 0)));
    nodes.campaignProgress.textContent = t("campaignProgress", { count });
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
  metaText.ar = {
    description: "أكمل 30 رحلة من ثلاث غرف، وأتقن سلوكيات عشرة أعداء مميزين، واجمع المعدات، واهزم ستة حراس للآثار يتغيرون عبر المراحل.",
    ogDescription: "استكشف ست مناطق آثار عبر 30 مهمة، وابنِ معداتك، وتصدَّ للتهديدات الخاصة، واهزم ستة حراس مختلفين."
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
    if (active) {
      requestAnimationFrame(() => {
        const primaryAction = resultNextExpedition
          ? nodes.resultNextBtn
          : (resultMapIsPrimary ? nodes.resultMenuBtn : nodes.retryBtn);
        primaryAction.focus({ preventScroll: true });
      });
    }
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
      nodes.lootPanel.setAttribute("aria-labelledby", "lootTitle");
      nodes.lootPanel.setAttribute("aria-describedby", "lootName lootType lootEffect lootComparison");
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
    const copy = resultActionText[getLocale()] || resultActionText.en;
    const hasNext = resultNextExpedition > 0 && document.body.classList.contains("relic-result");
    nodes.resultMenuBtn.textContent = copy.stages;
    nodes.resultNextBtn.textContent = copy.next;
    nodes.retryBtn.textContent = copy.replay;
    nodes.resultMenuBtn.setAttribute("aria-label", copy.stages);
    nodes.resultNextBtn.setAttribute("aria-label", copy.next);
    nodes.retryBtn.setAttribute("aria-label", copy.replay);
    nodes.resultNextBtn.disabled = !hasNext;
    nodes.resultNextBtn.setAttribute("aria-disabled", String(!hasNext));
    nodes.resultNextBtn.classList.toggle("primary-btn", hasNext);
    nodes.resultNextBtn.classList.toggle("menu-btn", !hasNext);
    nodes.resultMenuBtn.className = resultMapIsPrimary ? "primary-btn" : "menu-btn";
    nodes.retryBtn.className = !hasNext && !resultMapIsPrimary ? "primary-btn retry-btn" : "menu-btn retry-btn";
  }

  const stageTabText = {
    en: { team: "Team", stages: "Stages", equipment: "Equipment", nav: "Expedition preparation" },
    "zh-Hant": { team: "\u968a\u4f0d", stages: "\u95dc\u5361", equipment: "\u88dd\u5099", nav: "\u9060\u5f81\u6e96\u5099" },
    "zh-Hans": { team: "\u961f\u4f0d", stages: "\u5173\u5361", equipment: "\u88c5\u5907", nav: "\u8fdc\u5f81\u51c6\u5907" },
    ja: { team: "\u30c1\u30fc\u30e0", stages: "\u30b9\u30c6\u30fc\u30b8", equipment: "\u88c5\u5099", nav: "\u63a2\u691c\u6e96\u5099" },
    ko: { team: "\ud300", stages: "\uc2a4\ud14c\uc774\uc9c0", equipment: "\uc7a5\ube44", nav: "\ud0d0\ud5d8 \uc900\ube44" },
    es: { team: "Equipo", stages: "Misiones", equipment: "Equipamiento", nav: "Preparaci\u00f3n" },
    "pt-BR": { team: "Equipe", stages: "Fases", equipment: "Equipamento", nav: "Prepara\u00e7\u00e3o" },
    fr: { team: "\u00c9quipe", stages: "Niveaux", equipment: "\u00c9quipement", nav: "Pr\u00e9paration" },
    de: { team: "Team", stages: "Stufen", equipment: "Ausr\u00fcstung", nav: "Vorbereitung" },
    it: { team: "Squadra", stages: "Livelli", equipment: "Equipaggiamento", nav: "Preparazione" },
    ru: { team: "\u041a\u043e\u043c\u0430\u043d\u0434\u0430", stages: "\u042d\u0442\u0430\u043f\u044b", equipment: "\u0421\u043d\u0430\u0440\u044f\u0436\u0435\u043d\u0438\u0435", nav: "\u041f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u043a\u0430" },
    hi: { team: "\u091f\u0940\u092e", stages: "\u091a\u0930\u0923", equipment: "\u0909\u092a\u0915\u0930\u0923", nav: "\u0905\u092d\u093f\u092f\u093e\u0928 \u0924\u0948\u092f\u093e\u0930\u0940" },
    ar: { team: "\u0627\u0644\u0641\u0631\u064a\u0642", stages: "\u0627\u0644\u0645\u0631\u0627\u062d\u0644", equipment: "\u0627\u0644\u0645\u0639\u062f\u0627\u062a", nav: "\u062a\u062d\u0636\u064a\u0631 \u0627\u0644\u0628\u0639\u062b\u0629" },
  };

  const resultActionText = {
    en: { stages: "Stages", next: "Next Stage", replay: "Replay" },
    "zh-Hant": { stages: "\u95dc\u5361", next: "\u4e0b\u4e00\u95dc", replay: "\u91cd\u73a9" },
    "zh-Hans": { stages: "\u5173\u5361", next: "\u4e0b\u4e00\u5173", replay: "\u91cd\u73a9" },
    ja: { stages: "\u30b9\u30c6\u30fc\u30b8", next: "\u6b21\u306e\u30b9\u30c6\u30fc\u30b8", replay: "\u30ea\u30d7\u30ec\u30a4" },
    ko: { stages: "\uc2a4\ud14c\uc774\uc9c0", next: "\ub2e4\uc74c \uc2a4\ud14c\uc774\uc9c0", replay: "\ub2e4\uc2dc \ud50c\ub808\uc774" },
    es: { stages: "Misiones", next: "Siguiente", replay: "Repetir" },
    "pt-BR": { stages: "Fases", next: "Pr\u00f3xima", replay: "Repetir" },
    fr: { stages: "Niveaux", next: "Suivant", replay: "Rejouer" },
    de: { stages: "Stufen", next: "Weiter", replay: "Wiederholen" },
    it: { stages: "Livelli", next: "Avanti", replay: "Rigioca" },
    ru: { stages: "\u042d\u0442\u0430\u043f\u044b", next: "\u0414\u0430\u043b\u0435\u0435", replay: "\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c" },
    hi: { stages: "\u091a\u0930\u0923", next: "\u0905\u0917\u0932\u093e", replay: "\u092b\u093f\u0930 \u0916\u0947\u0932\u0947\u0902" },
    ar: { stages: "\u0627\u0644\u0645\u0631\u0627\u062d\u0644", next: "\u0627\u0644\u062a\u0627\u0644\u064a", replay: "\u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u0644\u0639\u0628" },
  };

  function updateStageTabsCopy() {
    const copy = stageTabText[getLocale()] || stageTabText.en;
    const nav = nodes.stagePanel.querySelector(".stage-bottom-tabs");
    nav.setAttribute("aria-label", copy.nav);
    nav.querySelector('[data-stage-tab="team"]').textContent = copy.team;
    nav.querySelector('[data-stage-tab="stages"]').textContent = copy.stages;
    nav.querySelector('[data-stage-tab="equipment"]').textContent = copy.equipment;
  }

  function selectStageTab(tabName, { focus = false } = {}) {
    nodes.stagePanel.querySelectorAll("[data-stage-tab]").forEach((button) => {
      const active = button.dataset.stageTab === tabName;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
      if (active && focus) button.focus({ preventScroll: true });
    });
    nodes.stagePanel.querySelectorAll("[data-stage-view]").forEach((view) => {
      view.classList.toggle("is-active", view.dataset.stageView === tabName);
    });
    if (tabName === "stages") {
      requestAnimationFrame(() => {
        renderExpeditionStage(false);
        window.dispatchEvent(new Event("resize"));
      });
    }
  }

  let mainFocusSettlementToken = 0;

  function restoreMainStartFocus() {
    const token = ++mainFocusSettlementToken;
    let observer = null;
    let stopTimer = 0;
    const settle = () => {
      if (token !== mainFocusSettlementToken || nodes.menuPanel.classList.contains("hidden")) {
        observer?.disconnect();
        clearTimeout(stopTimer);
        return;
      }
      const active = document.activeElement;
      const visibleOwner = active && active !== document.body && active.getClientRects().length > 0;
      if (visibleOwner && active !== nodes.showStageBtn) return;
      nodes.showStageBtn.focus({ preventScroll: true });
    };
    settle();
    requestAnimationFrame(settle);
    observer = new MutationObserver(settle);
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    [80, 400, 1000].forEach((delay) => setTimeout(settle, delay));
    stopTimer = setTimeout(() => observer.disconnect(), 1600);
  }

  function setScreenOwner(screen) {
    document.body.dataset.screen = screen;
    for (const candidate of ["main", "stage", "battle"]) {
      document.body.classList.toggle(`wp-shell-${candidate}-active`, candidate === screen);
    }
    document.body.classList.toggle("wp-stage-select-active", screen === "stage");
    document.documentElement.classList.toggle("wp-stage-select-active", screen === "stage");
    window.dispatchEvent(new CustomEvent("weightplay:shell-sync", { detail: { screen } }));
    window.dispatchEvent(new CustomEvent("weightplay:stage-sync", { detail: { screen } }));
    window.dispatchEvent(new CustomEvent("weightplay:battle-sync", { detail: { screen } }));
    if (screen === "battle") window.dispatchEvent(new CustomEvent("weightplay:battle-open", { detail: { screen } }));
  }

  function showMain() {
    cancelExpeditionStageMotion();
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
    setScreenOwner("main");
    updateDiamondShopUI();
    renderTrainingPanel();
    renderEquippedGear();
    renderCampaignProgress();
    restoreMainStartFocus();
  }

  function expeditionWindowLimit() { return Math.max(0, expeditionDefs.length - EXPEDITION_CARD_POOL_SIZE); }
  function desiredExpeditionWindow(index) { return Math.max(0, Math.min(expeditionWindowLimit(), index - Math.floor(EXPEDITION_CARD_POOL_SIZE / 2))); }
  function expeditionCardCopy(expedition) {
    const currentLocale = getLocale();
    const name = currentLocale === "zh-Hant" ? expedition.zh : currentLocale === "es" ? expedition.es : currentLocale === "ar" ? expedition.ar : expedition.en;
    const checkpoint = expedition.checkpoint
      ? (currentLocale === "zh-Hant" ? "守護者" : currentLocale === "es" ? "Guardián" : currentLocale === "ar" ? "حارس" : "Guardian")
      : (currentLocale === "zh-Hant" ? `區域 ${expedition.region}` : currentLocale === "es" ? `Región ${expedition.region}` : currentLocale === "ar" ? `المنطقة ${expedition.region}` : `Region ${expedition.region}`);
    const label = currentLocale === "zh-Hant" ? `遠征 ${expedition.id}` : currentLocale === "es" ? `Expedición ${expedition.id}` : currentLocale === "ar" ? `الرحلة ${expedition.id}` : `Expedition ${expedition.id}`;
    return { name, checkpoint, label };
  }
  function bindExpeditionCard(card, index) {
    const expedition = expeditionDefs[index];
    if (!expedition) { card.hidden = true; return; }
    const locked = expedition.id > profile.unlockedExpedition;
    const copy = expeditionCardCopy(expedition);
    const current = expedition.id === browsedExpedition;
    card.hidden = false;
    card.className = `expedition-card stage-card${expedition.id === selectedExpedition ? " is-selected" : ""}${current ? " is-centered" : ""}${locked ? " is-locked" : ""}${expedition.checkpoint ? " is-checkpoint" : ""}`;
    card.dataset.expedition = String(expedition.id);
    card.dataset.stageIndex = String(index);
    card.tabIndex = current ? 0 : -1;
    card.setAttribute("aria-posinset", String(index + 1));
    card.setAttribute("aria-setsize", String(expeditionDefs.length));
    card.setAttribute("aria-disabled", String(locked));
    if (current) card.setAttribute("aria-current", "true"); else card.removeAttribute("aria-current");
    card.setAttribute("aria-label", `${copy.label}. ${copy.name}. ${locked ? t("expeditionLocked", { region: expedition.id - 1 }) : t("expeditionGoal", { level: expedition.level })}`);
    card.innerHTML = `<span>${copy.label} · ${copy.checkpoint}</span><strong>${copy.name}</strong><small>${locked ? t("expeditionLocked", { region: expedition.id - 1 }) : t("expeditionGoal", { level: expedition.level })}</small>`;
  }
  function buildExpeditionPool() {
    nodes.expeditionRail.innerHTML = "";
    expeditionWindowStart = desiredExpeditionWindow(browsedExpedition - 1);
    expeditionCardPool = Array.from({ length: Math.min(EXPEDITION_CARD_POOL_SIZE, expeditionDefs.length) }, (_, offset) => {
      const card = document.createElement("button");
      card.type = "button";
      card.dataset.wpPoolIdentity = `relic-pool-${offset}`;
      bindExpeditionCard(card, expeditionWindowStart + offset);
      card.addEventListener("click", (event) => {
        if (suppressExpeditionClick) return;
        const id = Number(card.dataset.expedition);
        browsedExpedition = id;
        syncExpeditionCards();
        updateExpeditionSetup();
        if (card.getAttribute("aria-disabled") === "true") return;
        selectedExpedition = id;
        window.WonderSound?.play("click");
        startRun(event.detail === 0 ? "keyboard" : "pointer");
      });
      nodes.expeditionRail.append(card);
      return card;
    });
    nodes.expeditionRail.dataset.wpStageVirtualized = "bounded-recycle";
    nodes.expeditionRail.dataset.wpStagePoolSize = String(expeditionCardPool.length);
    nodes.expeditionRail.dataset.wpStageTotal = String(expeditionDefs.length);
    nodes.expeditionRail.dataset.wpStageRecycleCount = "0";
  }
  function moveExpeditionWindow(target) {
    target = Math.max(0, Math.min(expeditionWindowLimit(), target));
    let recycled = 0;
    while (expeditionWindowStart < target) {
      const card = nodes.expeditionRail.firstElementChild;
      expeditionWindowStart += 1;
      nodes.expeditionRail.append(card);
      bindExpeditionCard(card, expeditionWindowStart + expeditionCardPool.length - 1);
      recycled += 1;
    }
    while (expeditionWindowStart > target) {
      const card = nodes.expeditionRail.lastElementChild;
      expeditionWindowStart -= 1;
      nodes.expeditionRail.prepend(card);
      bindExpeditionCard(card, expeditionWindowStart);
      recycled += 1;
    }
    expeditionCardPool = [...nodes.expeditionRail.children];
    nodes.expeditionRail.dataset.wpStageWindowStart = String(expeditionWindowStart);
    nodes.expeditionRail.dataset.wpStageWindowEnd = String(expeditionWindowStart + expeditionCardPool.length - 1);
    if (recycled) nodes.expeditionRail.dataset.wpStageRecycleCount = String(Number(nodes.expeditionRail.dataset.wpStageRecycleCount || 0) + recycled);
  }
  function updateExpeditionSetup() {
    const expedition = expeditionDefs[browsedExpedition - 1];
    nodes.stageSetupText.textContent = browsedExpedition > profile.unlockedExpedition ? t("expeditionLocked", { region: browsedExpedition - 1 }) : t("expeditionGoal", { level: expedition.level });
  }
  function syncExpeditionCards() { expeditionCardPool.forEach((card) => bindExpeditionCard(card, Number(card.dataset.stageIndex))); }
  function syncCenteredExpedition() {
    if (nodes.stagePanel.classList.contains("hidden") || expeditionDrag || expeditionSettleFrame) return;
    const cards = expeditionCardPool.filter((card) => !card.hidden);
    const railRect = nodes.expeditionRail.getBoundingClientRect();
    if (!cards.length || railRect.width <= 0) return;
    const center = railRect.left + railRect.width / 2;
    const centered = cards.reduce((best, card) => {
      const rect = card.getBoundingClientRect(), distance = Math.abs(rect.left + rect.width / 2 - center);
      return !best || distance < best.distance ? { card, distance } : best;
    }, null)?.card;
    if (!centered) return;
    browsedExpedition = Number(centered.dataset.expedition) || selectedExpedition;
    syncExpeditionCards();
    updateExpeditionSetup();
  }
  function renderExpeditionStage(focusSelected = false) {
    selectedExpedition = Math.max(1, Math.min(profile.unlockedExpedition || 1, selectedExpedition));
    browsedExpedition = selectedExpedition;
    if (expeditionCardPool.length !== Math.min(EXPEDITION_CARD_POOL_SIZE, expeditionDefs.length) || !expeditionCardPool.every((card) => card.isConnected)) buildExpeditionPool();
    moveExpeditionWindow(desiredExpeditionWindow(browsedExpedition - 1));
    syncExpeditionCards();
    nodes.stageTitle.textContent = t("title");
    updateExpeditionSetup();
    requestAnimationFrame(() => {
      const card = nodes.expeditionRail.querySelector("[aria-current='true']");
      card?.scrollIntoView({ inline: "center", block: "nearest" });
      if (focusSelected) card?.focus({ preventScroll: true });
    });
  }
  function expeditionPitch() {
    const cards = expeditionCardPool.filter((card) => !card.hidden);
    return cards.length > 1 ? Math.abs(cards[1].offsetLeft - cards[0].offsetLeft) || 282 : (cards[0]?.offsetWidth || 264) + 18;
  }
  function positionExpeditionLogical(logical, focus = false) {
    logical = Math.max(0, Math.min(expeditionDefs.length - 1, logical));
    const anchor = Math.round(logical);
    browsedExpedition = anchor + 1;
    moveExpeditionWindow(desiredExpeditionWindow(anchor));
    syncExpeditionCards();
    updateExpeditionSetup();
    const card = nodes.expeditionRail.querySelector(`[data-expedition="${browsedExpedition}"]`);
    const rtl = document.documentElement.dir === "rtl" ? -1 : 1;
    // The shared Stage stylesheet keeps native rails smooth for ordinary
    // selectors. This V6 rail is game-owned and positions a recycled card on
    // every key/drag frame; leaving smooth scrolling enabled lets an older
    // animation overwrite the newer logical target (for example 1 -> 10).
    const previousBehavior = nodes.expeditionRail.style.getPropertyValue("scroll-behavior");
    const previousPriority = nodes.expeditionRail.style.getPropertyPriority("scroll-behavior");
    nodes.expeditionRail.style.setProperty("scroll-behavior", "auto", "important");
    try {
      nodes.expeditionRail.scrollTo({ left: card.offsetLeft - nodes.expeditionRail.offsetLeft - (nodes.expeditionRail.clientWidth - card.offsetWidth) / 2, behavior: "auto" });
      nodes.expeditionRail.scrollLeft += (logical - anchor) * expeditionPitch() * rtl;
      nodes.expeditionRail.dataset.wpStageDragLogical = logical.toFixed(4);
      if (focus) card.focus({ preventScroll: true });
    } finally {
      if (previousBehavior) nodes.expeditionRail.style.setProperty("scroll-behavior", previousBehavior, previousPriority);
      else nodes.expeditionRail.style.removeProperty("scroll-behavior");
    }
    return logical;
  }
  function cancelExpeditionStageMotion() {
    if (expeditionSettleFrame) cancelAnimationFrame(expeditionSettleFrame);
    expeditionSettleFrame = 0;
    expeditionDrag = null;
    suppressExpeditionClick = false;
    nodes.expeditionRail.style.removeProperty("scroll-snap-type");
    delete nodes.expeditionRail.dataset.wpStageSettling;
    delete nodes.expeditionRail.dataset.wpStageDragLogical;
  }
  function finishExpeditionDrag(event) {
    if (event.pointerId !== expeditionDrag?.id) return;
    const drag = expeditionDrag;
    expeditionDrag = null;
    if (nodes.expeditionRail.hasPointerCapture?.(event.pointerId)) nodes.expeditionRail.releasePointerCapture(event.pointerId);
    if (!drag.moved) { nodes.expeditionRail.style.removeProperty("scroll-snap-type"); return; }
    event.preventDefault();
    const from = drag.logical, target = Math.round(from), started = performance.now();
    nodes.expeditionRail.dataset.wpStageSettling = "true";
    const settle = (now) => {
      const progress = Math.min(1, (now - started) / 340), eased = progress * progress * (3 - 2 * progress);
      positionExpeditionLogical(from + (target - from) * eased);
      if (progress < 1) expeditionSettleFrame = requestAnimationFrame(settle);
      else { expeditionSettleFrame = 0; positionExpeditionLogical(target); nodes.expeditionRail.style.removeProperty("scroll-snap-type"); delete nodes.expeditionRail.dataset.wpStageSettling; }
    };
    expeditionSettleFrame = requestAnimationFrame(settle);
    suppressExpeditionClick = true;
    setTimeout(() => { suppressExpeditionClick = false; }, 0);
    event.stopImmediatePropagation();
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
    setScreenOwner("stage");
    selectStageTab("stages");
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
    renderCampaignProgress();
    updateStageTabsCopy();
    updateResultPrimaryAction();
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
    if (!amuletPurchasePending || document.hidden || !windowFocused) return;
    clearTimeout(amuletConfirmTimer);
    amuletConfirmRemaining = Math.max(0, Number(delay) || 0);
    amuletConfirmDueAt = performance.now() + amuletConfirmRemaining;
    amuletConfirmTimer = window.setTimeout(() => {
      amuletConfirmTimer = 0;
      amuletConfirmRemaining = 0;
      amuletConfirmDueAt = 0;
      if (!amuletPurchasePending || document.hidden || !windowFocused) return;
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
    if (!amuletPurchasePending || amuletConfirmTimer || document.hidden || !windowFocused) return;
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
      button.addEventListener("click", (event) => {
        spendTrainingPoint(def.key, document.activeElement === event.currentTarget);
      });
      row.appendChild(button);
      nodes.trainingList.appendChild(row);
    });
  }

  function restoreTrainingFocus(key) {
    const focusPreferredTraining = () => {
      const preferred = nodes.trainingList.querySelector(`[data-training-key="${key}"]:not(:disabled)`);
      const fallback = nodes.trainingList.querySelector("button:not(:disabled)");
      (preferred || fallback)?.focus();
      return preferred || fallback || null;
    };
    // Re-rendering replaces the activated button. Restore focus immediately
    // so pointer and keyboard activation share the same synchronous boundary;
    // retain one frame of fallback for browsers that defer focus on rebuilt
    // controls.
    const focused = focusPreferredTraining();
    if (focused && document.activeElement !== focused) window.requestAnimationFrame(focusPreferredTraining);
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
  function startRun(inputType = "programmatic") {
    cancelExpeditionStageMotion();
    clearEliteSpawnTimer();
    state.gameActive = false;
    setPauseModalActive(false, false);
    clearAmuletConfirmation();
    clearMovementInput();
    loadLocalState();
    syncStateFromProfile();

    // Reset run-only relic buffs before deriving the next expedition's base stats.
    state.relicMagnetCount = 0;
    state.relicRateCount = 0;
    state.relicHpCount = 0;
    state.relicDamageCount = 0;

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

    state.enemies = [];
    state.bullets = [];
    state.enemyShots = [];
    state.orbs = [];
    state.pickups = [];
    state.particleSystems = [];
    state.slowUntil = 0;
    state.silencedUntil = 0;
    state.playerHitUntil = 0;
    combatFeedbackText = "";
    combatFeedbackUntil = 0;
    lastCombatFeedbackAt = 0;

    // Wave spawning trigger
    spawnRoomEntities();

    nodes.menuPanel.classList.add("hidden");
    nodes.stagePanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.gamePanel.classList.remove("hidden");
    document.body.classList.remove("relic-stage-select");
    document.body.classList.remove("relic-result");
    document.body.classList.add("relic-playing");
    setScreenOwner("battle");
    resultNextExpedition = 0;
    resultMapIsPrimary = false;
    setResultModalActive(false);
    setLootModalActive(false, false);
    focusGamePanel();

    renderStatsPanel();
    renderEquippedGear();

    state.gameActive = true;
    lastTrackedObjectiveKey = "";
    trackGrowthEvent("game_start", { input_type: inputType });
    trackGrowthEvent("room_start", { input_type: inputType });
    updateHUDText();
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
    // Expedition 1 Room 3 is the first guardian/key decision, not a hidden
    // damage check. Keep the same authored threats and reduced stats, but
    // give the player a longer protected setup to read the room and let
    // auto-fire thin the opening pressure before contact begins. The Room 3
    // guardian waits until that authored five-threat opening has had time to
    // resolve instead of stacking on top of it during first-time routing.
    chase: encounter(["north", "sides", "corners"], ["chaser chaser chaser", "chaser chaser chaser rusher", "chaser chaser rusher chaser splitter"], { grace:[3500,2800,7200], eliteDelay:[12000,11500,16000], hpMultiplier:.62, speedMultiplier:.72, eliteHp:[1.8,2.1,2.4], eliteSpeed:.78 }),
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
  guardianNames.moss.ar = "حارس الطحالب";
  guardianNames.echo.ar = "حارس الصدى";
  guardianNames.crystal.ar = "عملاق المنشور";
  guardianNames.mire.ar = "هيدرا المستنقع الحلزونية";
  guardianNames.moon.ar = "حارس الأرشيف";
  guardianNames.crown.ar = "ملك تاج الأثر";

  function localizedGuardianName(behavior, locale = getLocale()) {
    const names = guardianNames[behavior] || {};
    const key = locale === "zh-Hant" ? "zh" : locale;
    return names[key] || names.en || "Guardian";
  }

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
      hitFlashUntil: 0,
      hitVisualKey: "default",
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
        ? localizedGuardianName(behavior)
        : (getLocale() === "zh-Hant" ? "菁英" : getLocale() === "es" ? "ÉLITE" : getLocale() === "ar" ? "نخبة" : "ELITE"),
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
    state.playerHitUntil = 0;
    combatFeedbackText = "";
    combatFeedbackUntil = 0;

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
    updateRoomObjective();
  }

  function updateRoomObjective() {
    if (!nodes.roomObjective) return;
    if (combatFeedbackText && combatFeedbackUntil > performance.now()) {
      nodes.roomObjective.hidden = false;
      nodes.roomObjective.textContent = combatFeedbackText;
      return;
    }
    combatFeedbackText = "";
    combatFeedbackUntil = 0;
    const activeTypes = new Set(state.pickups.map((pickup) => pickup.type));
    const key = activeTypes.has("key")
      ? "roomObjectiveKey"
      : activeTypes.has("chest")
        ? "roomObjectiveChest"
          : activeTypes.has("portal")
            ? "roomObjectivePortal"
          : state.gameActive ? "roomObjectiveStart" : "";
    nodes.roomObjective.hidden = !key;
    nodes.roomObjective.textContent = key ? objectiveText(key) : "";
    if (!key) {
      lastTrackedObjectiveKey = "";
    } else if (key !== lastTrackedObjectiveKey) {
      lastTrackedObjectiveKey = key;
      trackGrowthEvent("objective_cue_visible", { cue: key });
    }
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
    trackGrowthEvent("draft_open", { level: state.level });
  }

  function chooseDraftRelic(relicId) {
    clearDraftRerollConfirmation(false);
    trackGrowthEvent("draft_select", { level: state.level, relic: relicId });
    applyRelic(relicId);
    if (state.exp >= state.expNeed) {
      handleLevelUp();
      updateHUDText();
      return;
    }
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
    if (!draftRerollPending || document.hidden || !windowFocused) return;
    window.clearTimeout(draftRerollConfirmTimer);
    draftRerollConfirmRemaining = Math.max(0, Number(delay) || 0);
    draftRerollConfirmDueAt = performance.now() + draftRerollConfirmRemaining;
    draftRerollConfirmTimer = window.setTimeout(() => {
      draftRerollConfirmTimer = 0;
      draftRerollConfirmRemaining = 0;
      draftRerollConfirmDueAt = 0;
      if (!windowFocused || document.hidden) return;
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
    if (!draftRerollPending || draftRerollConfirmTimer || document.hidden || !windowFocused) return;
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
    trackGrowthEvent("loot_choice", {
      choice: shouldEquip ? "equip" : "keep",
      gear: currentLootItem,
    });
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
    const locale = getLocale();
    return locale === "zh-Hant" ? expedition.zh : locale === "es" ? expedition.es : locale === "ar" ? expedition.ar : expedition.en;
  }

  const resultLevelLabels = {
    en: "Saved Level",
    "zh-Hant": "保存等級",
    "zh-Hans": "保存等级",
    ja: "保存レベル",
    ko: "저장된 레벨",
    es: "Nivel guardado",
    "pt-BR": "Nível salvo",
    fr: "Niveau sauvegardé",
    de: "Gespeicherte Stufe",
    it: "Livello salvato",
    ru: "Сохранённый уровень",
    hi: "सहेजा गया स्तर",
    ar: "المستوى المحفوظ",
  };

  function renderResultSummary({ cleared, newlyUnlocked = 0, won = false }) {
    if (!nodes.resultSummary) return;
    const highestUnlocked = Math.max(1, Math.min(EXPEDITION_COUNT, Number(profile.unlockedExpedition) || 1));
    const progressText = newlyUnlocked
      ? t("resultUnlocked", { region: expeditionName(newlyUnlocked) })
      : won && (state.expedition || 1) >= EXPEDITION_COUNT && highestUnlocked >= EXPEDITION_COUNT
        ? t("resultAllCleared")
        : t("resultReady", { region: expeditionName(highestUnlocked) });
    const rows = [
      [resultLevelLabels[getLocale()] || resultLevelLabels.en, String(Math.max(1, Math.floor(Number(profile.level) || 1)))],
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
    trackGrowthEvent(won ? "game_complete" : "game_fail", {
      cleared_rooms: won ? ROOMS_PER_EXPEDITION : Math.max(0, state.room - 1),
    });
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
    trackGrowthEvent("portal_enter", { from_room: state.room });
    state.room++;
    state.keys = 0;
    state.playerX = 100;
    state.playerY = ARENA_HEIGHT / 2;
    
    // Heal player slightly between rooms
    const stats = getStats();
    state.playerHp = Math.min(stats.maxHp, state.playerHp + 10);
    state.playerHitUntil = 0;
    combatFeedbackText = "";
    combatFeedbackUntil = 0;

    spawnRoomEntities();
    lastTrackedObjectiveKey = "";
    trackGrowthEvent("room_start");
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
        markPlayerImpact();
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
        markPlayerImpact();
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
            markEnemyImpact(enemy, { blocked: true, visualKey: bullet.visualKey });
            createDamageSparks(bullet.x, bullet.y, 0);
            return;
          }
          enemy.hp -= bullet.dmg;
          enemy.lastHitAt = performance.now();
          state.bullets.splice(bIndex, 1);
          markEnemyImpact(enemy, { damage: bullet.dmg, visualKey: bullet.visualKey });

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

        if (state.gameActive && state.exp >= state.expNeed) {
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
          trackGrowthEvent("key_pickup", { keys: state.keys, run_keys: state.runKeys });
          window.WonderSound?.play("success");
          updateHUDText();

          // Spawn Chest and Portal
          state.pickups.push({ x: 300, y: ARENA_HEIGHT / 2, type: "chest" });
          state.pickups.push({ x: 500, y: ARENA_HEIGHT / 2, type: "portal" });
          updateRoomObjective();
        } else if (pickup.type === "gold") {
          state.pickups.splice(pIndex, 1);
          gainGold(pickup.value || 1);
          window.WonderSound?.play("coin");
        } else if (pickup.type === "chest") {
          if (state.keys > 0) {
            state.keys--;
            state.pickups.splice(pIndex, 1);
            trackGrowthEvent("chest_open", { keys_remaining: state.keys });
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
    if (combatFeedbackText && combatFeedbackUntil <= performance.now()) updateRoomObjective();
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
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
    state.pickups.forEach((pickup) => {
        if (pickup.type === "key") {
          const pulse = reducedMotion ? 1 : 1 + Math.sin(performance.now() / 220) * 0.08;
          ctx.save();
          ctx.translate(pickup.x, pickup.y);
          ctx.scale(pulse, pulse);
          ctx.shadowColor = "#fde68a";
          ctx.shadowBlur = 18;
          ctx.strokeStyle = "#fde68a";
          ctx.lineWidth = 3;
          ctx.setLineDash([6, 4]);
          ctx.beginPath();
          ctx.arc(0, 0, 27, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.shadowBlur = 0;
          ctx.fillStyle = "rgba(253, 230, 138, 0.9)";
          ctx.beginPath();
          ctx.moveTo(0, -43);
          ctx.lineTo(9, -31);
          ctx.lineTo(-9, -31);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
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
        ctx.save();
        ctx.translate(pickup.x, pickup.y);
        ctx.shadowColor = "#fbbf24";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#78350f";
        ctx.strokeStyle = "#fde68a";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(-23, -17, 46, 34, 6);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#a16207";
        ctx.fillRect(-21, -4, 42, 17);
        ctx.fillStyle = "#fbbf24";
        ctx.fillRect(-3, -16, 6, 32);
        ctx.beginPath();
        ctx.arc(0, -1, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#3b2500";
        ctx.beginPath();
        ctx.arc(0, -2, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(-1, -1, 2, 6);
        ctx.restore();
      } else if (pickup.type === "portal") {
        const pulse = 1 + Math.sin(performance.now() / 180) * 0.08;
        ctx.save();
        ctx.translate(pickup.x, pickup.y);
        ctx.scale(pulse, pulse);
        ctx.shadowColor = "#22d3ee";
        ctx.shadowBlur = 14;
        ctx.strokeStyle = "#22d3ee";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "rgba(34, 211, 238, 0.15)";
        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "#a5f3fc";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 16, -Math.PI * 0.72, Math.PI * 0.72);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-5, -8);
        ctx.lineTo(5, 0);
        ctx.lineTo(-5, 8);
        ctx.stroke();
        ctx.restore();
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

    state.enemyShots.forEach((shot) => drawEnemyShot(ctx, shot));

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

      const hitRemaining = Math.max(0, (enemy.hitFlashUntil || 0) - performance.now());
      if (hitRemaining > 0) {
        const progress = hitRemaining / 260;
        const visual = getBulletVisualProfile(enemy.hitVisualKey);
        ctx.globalAlpha = 0.22 * progress;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, 0, enemy.size * 0.92, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.95 * progress;
        ctx.strokeStyle = visual.core;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(0, 0, enemy.size + 11 + (1 - progress) * 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
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
    const playerHitRemaining = Math.max(0, (state.playerHitUntil || 0) - performance.now());
    if (playerHitRemaining > 0) {
      const progress = playerHitRemaining / 280;
      ctx.globalAlpha = 0.9 * progress;
      ctx.strokeStyle = "#fb7185";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 29 + (1 - progress) * 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
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
    if (damage > 0) {
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
    window.addEventListener("blur", () => {
      windowFocused = false;
      clearMovementInput();
      suspendBackgroundBattle();
      if (state.gameActive && !manualPauseActive) setPauseModalActive(true);
    });
    window.addEventListener("focus", () => {
      windowFocused = true;
      if (!manualPauseActive) resumeBackgroundBattle();
    });
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
    const menuShop = document.querySelector(".menu-shop");
    const trainingPanel = menuShop.querySelector(".training-panel");
    nodes.stagePanel.querySelector('[data-stage-view="team"]').append(trainingPanel);
    nodes.stageConfigMount.append(menuShop);
    updateDiamondShopUI();
    translateUI();
    setupInputs();
    setScreenOwner("main");

    // Event buttons
    nodes.showStageBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      showStage();
    });
    nodes.showStageBtn.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
    });
    nodes.expeditionRail.dataset.wpStageVirtualDrag = "true";
    nodes.expeditionRail.dataset.wpStageCenterObserver = "manual";
    addEventListener("keydown", (event) => {
      const card = event.target.closest?.("#expeditionRail .expedition-card");
      if (!card) return;
      if ((event.key === "Enter" || event.key === " ") && (event.repeat || card.getAttribute("aria-disabled") === "true")) { event.preventDefault(); event.stopImmediatePropagation(); return; }
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const current = Number(card.dataset.stageIndex), rtl = document.documentElement.dir === "rtl";
      const step = event.key === "ArrowRight" ? (rtl ? -1 : 1) : (rtl ? 1 : -1);
      const next = event.key === "Home" ? 0 : event.key === "End" ? expeditionDefs.length - 1 : Math.max(0, Math.min(expeditionDefs.length - 1, current + step));
      positionExpeditionLogical(next, true);
    }, true);
    addEventListener("pointerdown", (event) => {
      if (!event.target.closest?.("#expeditionRail") || event.isPrimary === false || (event.button !== undefined && event.button !== 0)) return;
      if (expeditionSettleFrame) cancelAnimationFrame(expeditionSettleFrame);
      expeditionSettleFrame = 0;
      expeditionDrag = { id: event.pointerId, startX: event.clientX, lastX: event.clientX, logical: browsedExpedition - 1, moved: false };
      nodes.expeditionRail.style.setProperty("scroll-snap-type", "none", "important");
      event.stopImmediatePropagation();
    }, true);
    addEventListener("pointermove", (event) => {
      if (event.pointerId !== expeditionDrag?.id) return;
      const delta = event.clientX - expeditionDrag.lastX;
      expeditionDrag.lastX = event.clientX;
      if (!expeditionDrag.moved && Math.abs(event.clientX - expeditionDrag.startX) > 4) {
        expeditionDrag.moved = true;
        nodes.expeditionRail.setPointerCapture?.(event.pointerId);
      }
      if (expeditionDrag.moved) {
        event.preventDefault();
        const rtl = document.documentElement.dir === "rtl" ? -1 : 1;
        expeditionDrag.logical = positionExpeditionLogical(expeditionDrag.logical - delta * rtl / expeditionPitch());
      }
      event.stopImmediatePropagation();
    }, true);
    addEventListener("pointerup", finishExpeditionDrag, true);
    addEventListener("pointercancel", finishExpeditionDrag, true);
    addEventListener("click", (event) => {
      if (!suppressExpeditionClick || !event.target.closest?.("#expeditionRail")) return;
      suppressExpeditionClick = false;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
    nodes.expeditionRail.addEventListener("wonder:stage-snap", () => window.requestAnimationFrame(syncCenteredExpedition));
    nodes.expeditionRail.addEventListener("scrollend", syncCenteredExpedition);

    nodes.stageBackBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      showMain();
    });

    nodes.stagePanel.querySelectorAll("[data-stage-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        window.WonderSound?.play("click");
        selectStageTab(button.dataset.stageTab);
      });
    });

    nodes.retryBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      trackGrowthEvent("retry", { input_type: "result" });
      startRun("retry");
    });

    nodes.resultNextBtn.addEventListener("click", () => {
      if (!resultNextExpedition) return;
      window.WonderSound?.play("click");
      selectedExpedition = resultNextExpedition;
      trackGrowthEvent("next", { input_type: "result", next_expedition: selectedExpedition });
      startRun("next");
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
      const actions = [nodes.resultMenuBtn, nodes.resultNextBtn, nodes.retryBtn].filter((button) => !button.disabled);
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
        forceQueuedDrafts(count = 2) {
          const total = Math.max(2, Math.min(4, Math.floor(Number(count) || 2)));
          let required = 0;
          let nextNeed = state.expNeed;
          for (let index = 0; index < total; index++) {
            required += nextNeed;
            nextNeed = Math.floor(nextNeed * 1.3);
          }
          state.exp = required;
          profile.exp = state.exp;
          profile.expNeed = state.expNeed;
          profile.level = state.level;
          saveProfile();
          state.gameActive = true;
          handleLevelUp();
          updateHUDText();
          return {
            choices: currentDraftChoices.slice(),
            requested: total,
            level: state.level,
            exp: state.exp,
            expNeed: state.expNeed,
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
        previewObjectivePickups(phase = "chest") {
          state.pickups = phase === "key"
            ? [{ x: 300, y: ARENA_HEIGHT / 2, type: "key" }]
            : phase === "portal"
              ? [{ x: 500, y: ARENA_HEIGHT / 2, type: "portal" }]
              : [
                { x: 300, y: ARENA_HEIGHT / 2, type: "chest" },
                { x: 500, y: ARENA_HEIGHT / 2, type: "portal" },
              ];
          updateRoomObjective();
          drawCanvasFrame();
          return state.pickups.map((pickup) => pickup.type);
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
        enemyShotVisuals() {
          return ["bolt", "pulse", "silence"].map((kind) => ({
            kind,
            ...getEnemyShotVisualProfile(kind),
          }));
        },
        previewEnemyShotVisuals() {
          startRun();
          state.gameActive = false;
          cancelAnimationFrame(state.gameLoopId);
          state.enemies = [];
          state.pickups = [];
          state.orbs = [];
          state.bullets = [];
          state.enemyShots = ["bolt", "pulse", "silence"].flatMap((kind, row) =>
            Array.from({ length: 3 }, (_, column) => ({
              kind,
              x: 250 + column * 150,
              y: 260 + row * 220,
              vx: kind === "bolt" ? 4 : 0,
              vy: kind === "bolt" ? 1 : 0,
              size: 11,
              damage: 1,
            })));
          drawCanvasFrame();
          return state.enemyShots.map(({ kind, x, y, size }) => ({ kind, x, y, size }));
        },
        previewCombatFeedbackForTest(kind = "enemy") {
          const previousEnemies = state.enemies;
          const previousPlayerHitUntil = state.playerHitUntil;
          const previousFeedback = { text: combatFeedbackText, until: combatFeedbackUntil, lastAt: lastCombatFeedbackAt };
          combatFeedbackText = "";
          combatFeedbackUntil = 0;
          lastCombatFeedbackAt = 0;
          if (kind === "enemy") {
            const target = createThreat("chaser", state.playerX + 80, state.playerY, { size: 24 });
            state.enemies = [target];
            markEnemyImpact(target, { damage: 12, visualKey: "sword-rare" });
          } else {
            markPlayerImpact();
          }
          drawCanvasFrame();
          const result = {
            kind,
            feedbackText: nodes.roomObjective?.textContent || "",
            feedbackVisible: nodes.roomObjective?.hidden !== true,
            enemyFlashRemaining: Math.max(0, (state.enemies[0]?.hitFlashUntil || 0) - performance.now()),
            playerHitRemaining: Math.max(0, (state.playerHitUntil || 0) - performance.now()),
          };
          state.enemies = previousEnemies;
          state.playerHitUntil = previousPlayerHitUntil;
          combatFeedbackText = previousFeedback.text;
          combatFeedbackUntil = previousFeedback.until;
          lastCombatFeedbackAt = previousFeedback.lastAt;
          updateRoomObjective();
          drawCanvasFrame();
          return result;
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
            combatFeedback: {
              text: nodes.roomObjective?.textContent || "",
              active: Boolean(combatFeedbackText && combatFeedbackUntil > performance.now()),
            },
            enemyHitFlashCount: state.enemies.filter((enemy) => (enemy.hitFlashUntil || 0) > performance.now()).length,
            playerHitRemaining: Math.max(0, (state.playerHitUntil || 0) - performance.now()),
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
