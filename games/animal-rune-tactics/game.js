(() => {
  const GAME_ID = "animal-rune-tactics";
  const saveKey = "weightplay_animal_rune_tactics_v1";
  const localeKey = "weightPlayLocale";
  const trainingCost = 18;
  const rerollCost = 3;
  const cols = 3;
  const rows = 4;
  const MISSION_COUNT = 30;
  const CHAPTER_SIZE = 5;
  const testMode = new URLSearchParams(window.location.search).get("test") === "1";

  const $ = (id) => document.getElementById(id);
  const asset = (name) => `../../assets/${name}`;
  const nodes = {
    localeSelect: $("localeSelect"),
    loadingPanel: $("loadingPanel"),
    loadingFill: $("loadingFill"),
    loadingText: $("loadingText"),
    menuPanel: $("menuPanel"),
    backBtn: $("backBtn"),
    gamePanel: $("gamePanel"),
    rewardPanel: $("rewardPanel"),
    resultPanel: $("resultPanel"),
    missionGrid: $("missionGrid"),
    profileLevel: $("profileLevel"),
    profileXp: $("profileXp"),
    profileBest: $("profileBest"),
    profileRunes: $("profileRunes"),
    growthSummary: $("growthSummary"),
    heroUpgradeGrid: $("heroUpgradeGrid"),
    trainingBtn: $("trainingBtn"),
    trainingStatus: $("trainingStatus"),
    grid: $("grid"),
    fxLayer: $("fxLayer"),
    turnRoster: $("turnRoster"),
    selectedCard: $("selectedCard"),
    battleLog: $("battleLog"),
    attackBtn: $("attackBtn"),
    guardBtn: $("guardBtn"),
    skillBtn: $("skillBtn"),
    endTurnBtn: $("endTurnBtn"),
    missionText: $("missionText"),
    turnText: $("turnText"),
    enemyCountText: $("enemyCountText"),
    rewardCards: $("rewardCards"),
    rerollBtn: $("rerollBtn"),
    resultTitle: $("resultTitle"),
    resultText: $("resultText"),
    resultRewardText: $("resultRewardText"),
    resultProgressText: $("resultProgressText"),
    resultNextText: $("resultNextText"),
    skillReportText: $("skillReportText"),
    nextBtn: $("nextBtn"),
    retryBtn: $("retryBtn"),
    menuBtn: $("menuBtn"),
  };

  const text = {
    en: {
      title: "Animal Rune Tactics",
      language: "Language",
      backToLobby: "Back to lobby",
      backToMenu: "Back to missions",
      backToMain: "Back to main menu",
      startGame: "Start Game",
      menuTitle: "Command the Rune Squad.",
      menuHint: "Choose a mission, move animal heroes on the rune grid, and clear enemies with smart positioning.",
      profileLevel: "Level",
      profileXp: "XP",
      profileBest: "Best Mission",
      profileRunes: "Runes",
      heroTrainingTitle: "Hero Training",
      heroTrainingHint: "Spend runes to permanently upgrade each animal hero.",
      heroLevel: "Lv.{level}",
      heroUpgradeCost: "Upgrade {cost}",
      heroUpgradeMax: "Max Level",
      lionRole: "Front attacker",
      owlRole: "Long-range burst",
      turtleRole: "Team protector",
      missionSelect: "Choose Mission",
      missionHint: "Unlocked missions are saved on this device.",
      missionCard: "Mission {n}",
      missionGoal: "Goal: defeat {enemies}",
      missionReward: "{xp} XP / {runes} Runes",
      missionEnemyLine: "Enemies: {enemies}",
      locked: "Locked",
      trainingTitle: "Training Slot",
      trainingText: "Permanent: heroes start each mission with +1 rune energy.",
      trainingOwned: "Owned: +1 starting energy.",
      trainingNeed: "Need {cost} diamonds.",
      trainingBuy: "Unlock for {cost}",
      startMission: "Start Mission",
      mission: "Mission",
      turn: "Turn",
      wallet: "Diamonds",
      enemiesLeft: "Enemies",
      attack: "Attack",
      guard: "Guard",
      skill: "Skill",
      endTurn: "End Turn",
      chooseHero: "Choose a hero, then move or attack.",
      chooseTarget: "{hero}: HP {hp}/{maxHp}, Energy {energy}.",
      ready: "Ready",
      acted: "Done",
      fallen: "Fallen",
      turnRosterTitle: "Squad Action",
      skillInfo: "Skill: {skill} - {desc}",
      skillInfoLabel: "Skill",
      skillLion: "Lion Pounce",
      skillLionDesc: "Deal heavy damage to the closest target.",
      skillOwl: "Rune Bolt",
      skillOwlDesc: "Strike from farther away with rune magic.",
      skillTurtle: "Shell Ward",
      skillTurtleDesc: "Guard the whole squad and heal 1 HP.",
      attackValue: "Attack {value}",
      guardValue: "Guard -1",
      guardHelp: "Reduce the next enemy hit by 1 damage.",
      skillValue: "Skill {value}",
      actionTarget: "{action} {value} damage to {target}.",
      heroTileLabel: "{hero}, HP {hp}/{maxHp}, {status}, row {row}, column {column}.",
      enemyTileLabel: "{enemy}, HP {hp}/{maxHp}, row {row}, column {column}.",
      moveTileLabel: "Move to row {row}, column {column}.",
      emptyTileLabel: "Row {row}, column {column}.",
      moved: "{hero} moved.",
      attacked: "{hero} attacked {enemy}.",
      guarded: "{hero} guarded.",
      skillUsed: "{hero} used a rune skill.",
      enemyTurn: "Enemies are moving.",
      chooseReward: "Choose a Rune Reward",
      reroll: "Reroll 3",
      rerollNeed: "Need 3 diamonds to reroll.",
      missionClear: "Mission Clear",
      missionFailed: "Mission Failed",
      resultWin: "Cleared Mission {mission}. Gained {xp} XP and {runes} Runes.",
      resultLose: "The rune squad fell in Mission {mission}. Keep your turtle guard near the front.",
      skillReport: "Skill Report",
      reportWin: "Strong planning: you used positioning, target focus, and reward choice to protect the squad.",
      reportLose: "Good practice: try guarding before enemy turns and focus one beast at a time.",
      nextMission: "Next Mission",
      retry: "Retry",
      menu: "Menu",
      lion: "Lion Guardian",
      owl: "Owl Mage",
      turtle: "Turtle Shield",
      wolf: "Shadow Wolf",
      raven: "Crystal Raven",
      stag: "Stone Stag",
      rewardPower: "Power Rune",
      rewardPowerDesc: "+1 hero attack.",
      rewardGuard: "Guardian Medal",
      rewardGuardDesc: "+1 max HP for all heroes.",
      rewardShard: "Rune Shard",
      rewardShardDesc: "+35 XP after the mission.",
      rewardRevive: "Revive Token",
      rewardReviveDesc: "Revive one fallen hero after victory.",
      rewardFocus: "Focus Rune",
      rewardFocusDesc: "+1 starting energy next mission.",
    },
    "zh-Hant": {
      title: "動物符文戰棋",
      language: "語言",
      backToMenu: "返回任務",
      menuTitle: "指揮符文小隊。",
      menuHint: "選擇任務，在符文格上移動動物英雄，用站位與集火清除敵人。",
      profileLevel: "等級",
      profileXp: "經驗",
      profileBest: "最佳任務",
      profileRunes: "符石",
      heroTrainingTitle: "英雄訓練",
      heroTrainingHint: "花費符石永久升級每位動物英雄。",
      heroLevel: "Lv.{level}",
      heroUpgradeCost: "升級 {cost}",
      heroUpgradeMax: "已滿級",
      lionRole: "前排攻擊",
      owlRole: "遠程爆發",
      turtleRole: "隊伍守護",
      missionSelect: "選擇任務",
      missionHint: "已解鎖任務會保存在這台裝置。",
      missionCard: "任務 {n}",
      missionGoal: "目標：擊敗 {enemies}",
      missionReward: "{xp} 經驗 / {runes} 符石",
      missionEnemyLine: "敵人：{enemies}",
      locked: "未解鎖",
      trainingTitle: "訓練欄位",
      trainingText: "永久：英雄每場任務開始時 +1 符文能量。",
      trainingOwned: "已擁有：起始能量 +1。",
      trainingNeed: "需要 {cost} 顆鑽石。",
      trainingBuy: "花費 {cost} 解鎖",
      startMission: "開始任務",
      mission: "任務",
      turn: "回合",
      wallet: "鑽石",
      enemiesLeft: "敵人",
      attack: "攻擊",
      guard: "防禦",
      skill: "技能",
      endTurn: "結束回合",
      chooseHero: "選擇英雄，再移動或攻擊。",
      chooseTarget: "{hero}：生命 {hp}/{maxHp}，能量 {energy}。",
      ready: "可行動",
      acted: "已行動",
      skillInfo: "技能：{skill} - {desc}",
      skillLion: "獅王撲擊",
      skillLionDesc: "對最近的目標造成高傷害。",
      skillOwl: "符文光彈",
      skillOwlDesc: "用符文魔法從更遠距離攻擊。",
      skillTurtle: "龜甲守護",
      skillTurtleDesc: "全隊進入防禦並恢復 1 生命。",
      attackValue: "攻擊 {value}",
      guardValue: "防守 -1",
      guardHelp: "下一次受到的敵方傷害減少 1 點。",
      skillValue: "技能 {value}",
      actionTarget: "對{target}使用{action}，造成 {value} 點傷害。",
      heroTileLabel: "{hero}，生命 {hp}/{maxHp}，{status}，第 {row} 列第 {column} 欄。",
      enemyTileLabel: "{enemy}，生命 {hp}/{maxHp}，第 {row} 列第 {column} 欄。",
      moveTileLabel: "移動到第 {row} 列第 {column} 欄。",
      emptyTileLabel: "第 {row} 列第 {column} 欄。",
      moved: "{hero} 移動了。",
      attacked: "{hero} 攻擊 {enemy}。",
      guarded: "{hero} 進入防禦。",
      skillUsed: "{hero} 使用符文技能。",
      enemyTurn: "敵人正在行動。",
      chooseReward: "選擇符文獎勵",
      reroll: "重抽 3",
      rerollNeed: "需要 3 顆鑽石才能重抽。",
      missionClear: "任務完成",
      missionFailed: "任務失敗",
      resultWin: "通過任務 {mission}，獲得 {xp} 經驗與 {runes} 符石。",
      resultLose: "符文小隊在任務 {mission} 倒下了。下次讓烏龜守衛站在前線。",
      skillReport: "能力報告",
      reportWin: "規劃表現很好：你運用站位、集火與獎勵選擇保護了小隊。",
      reportLose: "這是很好的練習：敵人回合前先防禦，並一次集火一隻野獸。",
      nextMission: "下一個任務",
      retry: "重試",
      menu: "選單",
      lion: "獅子守護者",
      owl: "貓頭鷹法師",
      turtle: "烏龜盾衛",
      wolf: "暗影狼",
      raven: "水晶鴉",
      stag: "石角鹿王",
      rewardPower: "力量符文",
      rewardPowerDesc: "英雄攻擊 +1。",
      rewardGuard: "守護勳章",
      rewardGuardDesc: "所有英雄生命上限 +1。",
      rewardShard: "符文碎片",
      rewardShardDesc: "任務後額外 +35 經驗。",
      rewardRevive: "復甦代幣",
      rewardReviveDesc: "勝利後復活一名倒下英雄。",
      rewardFocus: "專注符文",
      rewardFocusDesc: "下場任務起始能量 +1。",
    },
  };

  Object.assign(text.en, {
    missionPlan: "Plan: {plan}",
    missionTactic1: "Learn basic positioning against two wolves.",
    missionTactic2: "Protect the owl from a ranged raven.",
    missionTactic3: "Focus the boss stag after clearing guards.",
    missionTactic4: "Use turtle guard before two ravens fire.",
    missionTactic5: "Long fight: manage energy and focus targets.",
    missionTactic6: "Boss pressure: survive two stags and raven fire.",
  });

  Object.assign(text["zh-Hant"], {
    missionPlan: "重點：{plan}",
    missionTactic1: "練習站位，先處理兩隻近戰狼。",
    missionTactic2: "保護貓頭鷹，避免被遠程渡鴉壓制。",
    missionTactic3: "清掉護衛後集中攻擊石鹿首領。",
    missionTactic4: "兩隻渡鴉開火前，先讓烏龜守護隊伍。",
    missionTactic5: "長戰鬥：管理能量並集中火力。",
    missionTactic6: "首領壓力：撐過雙石鹿與渡鴉火力。",
  });

  Object.assign(text["zh-Hant"], {
    title: "動物符文戰棋",
    language: "語言",
    ready: "可行動",
    acted: "已行動",
    fallen: "倒下",
    turnRosterTitle: "隊伍行動",
    skillInfo: "技能：{skill} - {desc}",
    skillInfoLabel: "技能",
    skillLion: "獅子撲擊",
    skillLionDesc: "重擊最近的目標。",
    skillOwl: "符文箭",
    skillOwlDesc: "用符文魔法攻擊較遠的敵人。",
    skillTurtle: "守護殼",
    skillTurtleDesc: "保護同伴並吸收傷害。",
    chooseHero: "選擇英雄，再移動、攻擊或使用技能。",
    chooseTarget: "{hero}：生命 {hp}/{maxHp}，能量 {energy}。",
  });

  Object.assign(text.en, {
    missionStatusCurrent: "Selected",
    missionStatusUnlocked: "Tap to choose",
    missionRewardLabel: "Clear reward",
    startSelectedMission: "Start Mission {n}",
    progressionTitle: "Permanent Growth",
    progressionLevelLine: "Squad Lv.{level} / {xp} XP to next level",
    progressionHeroLine: "Hero upgrades: Lion Lv.{lion}, Owl Lv.{owl}, Turtle Lv.{turtle}",
    progressionBonusLine: "Saved bonuses: ATK +{atk}, HP +{hp}, Energy +{energy}, Revive Tokens {revives}",
    progressionNextUpgrade: "Next upgrade: {hero} needs {cost} more runes.",
    heroGrowthStats: "Permanent: HP +{hp} / ATK +{atk}",
    heroNextStats: "Next Lv.{level}: HP +{hp} / ATK +{atk}",
    heroUpgradeNeed: "Need {need} more runes",
    heroUpgradeReady: "Ready to upgrade",
    rewardPermanent: "Permanent growth",
    rewardReviveDesc: "Save 1 revive token. A fallen hero auto-revives in a future fight.",
    reviveTriggered: "{hero} used a revive token and returned to battle.",
    resultProgressTitle: "Saved Progress",
    resultRewardChosen: "Reward saved: {reward} — {effect}",
    resultRewardNone: "No rune reward was saved this attempt.",
    resultProgressLine: "Squad Lv.{level} · {xp}/100 XP · {runes} Runes · Best Mission {best}",
    resultMissionUnlocked: "Mission {mission} unlocked.",
    resultMissionReady: "Mission {mission} remains ready.",
    resultCampaignComplete: "All 30 missions are complete. Every mission remains replayable.",
    resultUpgradeReady: "{hero} can upgrade now in Heroes.",
    resultUpgradeNeed: "{hero} needs {need} more Runes to upgrade.",
    enemyTraits: "Traits: {traits}",
    traitWolf: "Pack Fang",
    traitWolfShort: "Pack",
    traitWolfDesc: "+1 damage while beside another wolf.",
    traitRaven: "Weakness Sight",
    traitRavenShort: "Hunt",
    traitRavenDesc: "Targets the hero with the lowest health.",
    traitStag: "Stone Hide",
    traitStagShort: "Armor",
    traitStagDesc: "Reduces the first hit each player turn by 1.",
    wolfPackHit: "Pack Fang: {enemy} dealt +1 damage.",
    ravenWeakHit: "Weakness Sight: {enemy} hunted the weakest hero.",
    stagArmorHit: "Stone Hide reduced 1 damage from {hero}.",
  });

  Object.assign(text["zh-Hant"], {
    missionStatusCurrent: "已選擇",
    missionStatusUnlocked: "點選挑戰",
    missionRewardLabel: "通關獎勵",
    startSelectedMission: "開始任務 {n}",
    progressionTitle: "永久成長",
    progressionLevelLine: "小隊 Lv.{level} / 距離下級 {xp} 經驗",
    progressionHeroLine: "英雄等級：獅子 Lv.{lion}、貓頭鷹 Lv.{owl}、烏龜 Lv.{turtle}",
    progressionBonusLine: "保存加成：攻擊 +{atk}、生命 +{hp}、能量 +{energy}、復甦代幣 {revives}",
    progressionNextUpgrade: "下一個升級：{hero} 還需要 {cost} 符石。",
    heroGrowthStats: "永久：生命 +{hp} / 攻擊 +{atk}",
    heroNextStats: "下一級 Lv.{level}：生命 +{hp} / 攻擊 +{atk}",
    heroUpgradeNeed: "還差 {need} 符石",
    heroUpgradeReady: "可以升級",
    rewardPermanent: "永久成長",
    rewardReviveDesc: "保存 1 枚復甦代幣，未來戰鬥中英雄倒下會自動復活。",
    reviveTriggered: "{hero} 使用復甦代幣回到戰鬥。",
    enemyTraits: "敵人特性：{traits}",
    traitWolf: "狼群利牙",
    traitWolfShort: "狼群",
    traitWolfDesc: "與另一隻狼相鄰時，攻擊傷害 +1。",
    traitRaven: "弱點視線",
    traitRavenShort: "獵弱",
    traitRavenDesc: "優先追擊目前生命比例最低的英雄。",
    traitStag: "石甲",
    traitStagShort: "石甲",
    traitStagDesc: "每個玩家回合首次受擊時，傷害減少 1。",
    wolfPackHit: "狼群利牙：{enemy} 額外造成 1 點傷害。",
    ravenWeakHit: "弱點視線：{enemy} 追擊生命最低的英雄。",
    stagArmorHit: "石甲使 {hero} 的傷害減少 1。",
  });

  // Keep the production Traditional Chinese dictionary separate from legacy
  // mojibake literals above, so every current UI surface has a safe source.
  Object.assign(text["zh-Hant"], {
    title: "動物符文戰棋", language: "語言", backToLobby: "返回大廳", backToMenu: "返回任務", backToMain: "返回主選單", startGame: "開始遊戲",
    menuTitle: "指揮你的符文小隊。", menuHint: "選擇任務，在符文格上移動動物英雄，透過站位與技能擊敗敵人。",
    profileLevel: "等級", profileXp: "經驗值", profileBest: "最佳任務", profileRunes: "符文",
    heroTrainingTitle: "英雄訓練", heroTrainingHint: "花費符文，永久提升每位動物英雄。", heroLevel: "Lv.{level}", heroUpgradeCost: "升級 {cost}", heroUpgradeMax: "最高等級",
    lionRole: "前排攻擊手", owlRole: "遠距爆發", turtleRole: "隊伍守護者",
    missionSelect: "選擇任務", missionHint: "已解鎖任務會保存在這台裝置。", missionCard: "任務 {n}", missionGoal: "目標：擊敗 {enemies}", missionReward: "{xp} 經驗值 / {runes} 符文", missionEnemyLine: "敵人：{enemies}", locked: "未解鎖",
    trainingTitle: "訓練欄位", trainingText: "永久效果：英雄每場任務起始能量 +1。", trainingOwned: "已擁有：起始能量 +1。", trainingNeed: "需要 {cost} 顆鑽石。", trainingBuy: "解鎖 {cost}",
    startMission: "開始任務", mission: "任務", turn: "回合", wallet: "鑽石", enemiesLeft: "敵人", attack: "攻擊", guard: "防守", skill: "技能", endTurn: "結束回合", health: "生命", energy: "能量",
    chooseHero: "選擇一位英雄，再移動或攻擊。", chooseTarget: "{hero}：生命 {hp}/{maxHp}，能量 {energy}。", ready: "可行動", acted: "已行動", fallen: "倒下", turnRosterTitle: "小隊行動", skillInfo: "技能：{skill} - {desc}", skillInfoLabel: "技能",
    skillLion: "獅王撲擊", skillLionDesc: "對最近目標造成重擊。", skillOwl: "符文箭", skillOwlDesc: "以符文魔法攻擊較遠的目標。", skillTurtle: "甲殼守護", skillTurtleDesc: "守護全隊並回復 1 點生命。",
    attackValue: "攻擊 {value}", guardValue: "防守 -1", guardHelp: "下一次受到的敵方傷害減少 1 點。", skillValue: "技能 {value}", actionTarget: "對{target}使用{action}，造成 {value} 點傷害。",
    heroTileLabel: "{hero}，生命 {hp}/{maxHp}，{status}，第 {row} 列第 {column} 欄。", enemyTileLabel: "{enemy}，生命 {hp}/{maxHp}，第 {row} 列第 {column} 欄。", moveTileLabel: "移動到第 {row} 列第 {column} 欄。", emptyTileLabel: "第 {row} 列第 {column} 欄。",
    moved: "{hero} 已移動。", attacked: "{hero} 攻擊了 {enemy}。", guarded: "{hero} 進入防守。", skillUsed: "{hero} 使用了符文技能。", enemyTurn: "敵人正在行動。",
    chooseReward: "選擇符文獎勵", reroll: "重抽 3", rerollNeed: "重抽需要 3 顆鑽石。", missionClear: "任務完成", missionFailed: "任務失敗", resultWin: "完成任務 {mission}，獲得 {xp} 經驗值和 {runes} 符文。", resultLose: "符文小隊在任務 {mission} 倒下。讓烏龜守在前排，集中攻擊同一隻敵人。",
    skillReport: "能力報告", reportWin: "規劃很棒：你用站位、集火和獎勵選擇保護了小隊。", reportLose: "這是很好的練習：敵人回合前先防守，並一次專注一隻野獸。", nextMission: "下一個任務", retry: "再試一次", menu: "選單",
    lion: "獅王守護者", owl: "月帽貓頭鷹法師", turtle: "苔殼烏龜", wolf: "暗影狼", raven: "水晶渡鴉", stag: "石角巨鹿",
    rewardPower: "力量符文", rewardPowerDesc: "所有英雄攻擊力 +1。", rewardGuard: "守護徽章", rewardGuardDesc: "所有英雄生命上限 +1。", rewardShard: "符文碎片", rewardShardDesc: "任務後額外獲得 35 經驗值。", rewardRevive: "復活代幣", rewardReviveDesc: "保留 1 枚復活代幣；未來戰鬥中可自動復活一位倒下英雄。", rewardFocus: "專注符文", rewardFocusDesc: "下次任務起始能量 +1。",
    missionPlan: "策略：{plan}", missionTactic1: "先學會在兩隻暗影狼前維持站位。", missionTactic2: "保護貓頭鷹，避免被遠程渡鴉擊倒。", missionTactic3: "清除守衛後，集中攻擊石角巨鹿。", missionTactic4: "兩隻渡鴉出手前，讓烏龜先防守。", missionTactic5: "長戰鬥要管理能量並集中目標。", missionTactic6: "Boss 壓力戰：撐過兩隻巨鹿與渡鴉火力。",
    missionStatusCurrent: "目前選擇", missionStatusUnlocked: "點擊選擇", missionRewardLabel: "通關獎勵", startSelectedMission: "開始任務 {n}", progressionTitle: "永久成長", progressionLevelLine: "小隊 Lv.{level} / 距離下級還差 {xp} 經驗值", progressionHeroLine: "英雄升級：獅王 Lv.{lion}、貓頭鷹 Lv.{owl}、烏龜 Lv.{turtle}", progressionBonusLine: "已保存加成：攻擊 +{atk}、生命 +{hp}、能量 +{energy}、復活代幣 {revives}", progressionNextUpgrade: "下一次升級：{hero} 還差 {cost} 枚符文。", heroGrowthStats: "永久：生命 +{hp} / 攻擊 +{atk}", heroNextStats: "下一級 Lv.{level}：生命 +{hp} / 攻擊 +{atk}", heroUpgradeNeed: "還差 {need} 枚符文", heroUpgradeReady: "可以升級", rewardPermanent: "永久成長", reviveTriggered: "{hero} 使用復活代幣回到戰場。"
  });

  Object.assign(text.en, { stageTabMissions: "Missions", stageTabHeroes: "Heroes", stageTabTraining: "Training" });
  Object.assign(text["zh-Hant"], { stageTabMissions: "\u4efb\u52d9", stageTabHeroes: "\u82f1\u96c4", stageTabTraining: "\u8a13\u7df4" });
  Object.assign(text["zh-Hant"], {
    resultProgressTitle: "\u5df2\u5132\u5b58\u9032\u5ea6",
    resultRewardChosen: "\u5df2\u5132\u5b58\u734e\u52f5\uff1a{reward} — {effect}",
    resultRewardNone: "\u9019\u6b21\u5617\u8a66\u6c92\u6709\u5132\u5b58\u7b26\u6587\u734e\u52f5\u3002",
    resultProgressLine: "\u5c0f\u968a Lv.{level} · {xp}/100 \u7d93\u9a57 · {runes} \u7b26\u6587 · \u6700\u4f73\u4efb\u52d9 {best}",
    resultMissionUnlocked: "\u5df2\u89e3\u9396\u4efb\u52d9 {mission}\u3002",
    resultMissionReady: "\u4efb\u52d9 {mission} \u4ecd\u53ef\u6311\u6230\u3002",
    resultCampaignComplete: "30 \u500b\u4efb\u52d9\u5df2\u5168\u90e8\u5b8c\u6210\uff0c\u6240\u6709\u4efb\u52d9\u4ecd\u53ef\u91cd\u73a9\u3002",
    resultUpgradeReady: "{hero} \u73fe\u5728\u53ef\u5728\u300c\u82f1\u96c4\u300d\u4e2d\u5347\u7d1a\u3002",
    resultUpgradeNeed: "{hero} \u518d\u9700 {need} \u679a\u7b26\u6587\u5373\u53ef\u5347\u7d1a\u3002",
  });
  Object.assign(text.en, {
    menu: "Back to Missions",
    boar: "Thorn Boar", runeFox: "Rune Fox", tideTurtle: "Tide Turtle", heron: "Relic Heron",
    salamander: "Ember Salamander", ram: "Cinder Ram", moth: "Moon Moth", archiveOwl: "Archive Owl",
    mirrorWolf: "Mirror Wolf", sealRaven: "Seal Raven", rhinoBoss: "Ironroot Rhino",
    serpentBoss: "Mirecoil Serpent", emberLionBoss: "Embermane Lion", griffinBoss: "Eclipse Griffin",
    chimeraBoss: "Rune Crown Chimera",
    traitBoar: "Thorn Counter", traitBoarShort: "Counter", traitBoarDesc: "Returns 1 damage after an adjacent hero hit.",
    traitRuneFox: "Foxstep", traitRuneFoxShort: "Blink", traitRuneFoxDesc: "Teleports behind the weakest hero after acting.",
    traitTideTurtle: "Shell Convoy", traitTideTurtleShort: "Guard", traitTideTurtleDesc: "Gives the nearest ally a one-hit guard.",
    traitHeron: "Current Wing", traitHeronShort: "Push", traitHeronDesc: "Pushes the hero it strikes one legal cell.",
    traitSalamander: "Ember Trail", traitSalamanderShort: "Burn", traitSalamanderDesc: "Leaves a damaging burn tile after moving.",
    traitRam: "Ramline", traitRamShort: "Charge", traitRamDesc: "Charges in a straight line when it sees a hero.",
    traitMoth: "Moon Dust", traitMothShort: "Silence", traitMothDesc: "Its hit disables that hero's next Skill.",
    traitArchiveOwl: "Watcher Mark", traitArchiveOwlShort: "Mark", traitArchiveOwlDesc: "Marks a hero so the next ranged hit deals +1 damage.",
    traitMirrorWolf: "Mirror Split", traitMirrorWolfShort: "Clone", traitMirrorWolfDesc: "Creates one adjacent 1-HP mirror clone.",
    traitSealRaven: "Seal Drain", traitSealRavenShort: "Drain", traitSealRavenDesc: "Drains 1 Energy from the hero it hits.",
    traitRhinoBoss: "Ironroot Rush", traitRhinoBossShort: "Boss", traitRhinoBossDesc: "Braces, charges a row, and leaves blocked rubble.",
    traitSerpentBoss: "Mirecoil", traitSerpentBossShort: "Boss", traitSerpentBossDesc: "Floods and pulls a column; regenerates unless hit twice in one turn.",
    traitEmberLionBoss: "Ember Cycle", traitEmberLionBossShort: "Boss", traitEmberLionBossDesc: "Alternates roar, leap, and wounded extra actions.",
    traitGriffinBoss: "Eclipse Flight", traitGriffinBossShort: "Boss", traitGriffinBossDesc: "Switches between flying ranged immunity and grounded sweeps.",
    traitChimeraBoss: "Sixfold Crown", traitChimeraBossShort: "Final", traitChimeraBossDesc: "Cycles charge, flood, burn, flight, and mirror summons at visible phases.",
    terrainRubble: "Rubble", terrainSnare: "Root Snare", terrainTide: "Tide", terrainBurn: "Burn",
    terrainCooling: "Cooling Rune", terrainOrbit: "Orbit Rune", terrainSeal: "Rune Seal",
    tileTerrainLabel: "{terrain}. {tile}", silenceBlocked: "Moon Dust silenced {hero}'s Skill.",
    terrainBurnHit: "Burn dealt 1 damage to {hero}.", terrainCoolingUsed: "{hero} restored 1 Energy on a Cooling Rune.",
    boarCounterHit: "Thorn Counter returned 1 damage to {hero}.", turtleGuarded: "Shell Convoy guarded {enemy}.",
    heronPushed: "Current Wing pushed {hero}.", foxTeleported: "Foxstep moved behind {hero}.",
    ramCharged: "Ramline charged {hero}.", mothSilenced: "Moon Dust silenced {hero}.",
    owlMarked: "Watcher Mark targeted {hero}.", ravenDrained: "Seal Drain removed 1 Energy from {hero}.",
    mirrorCloned: "Mirror Split created a 1-HP clone.", bossPhase: "{boss} entered phase {phase}.",
    resultCampaignComplete: "All 30 missions are complete. Every mission remains replayable.",
  });
  Object.assign(text["zh-Hant"], {
    menu: "返回任務",
    boar: "荊棘野豬", runeFox: "符步狐狸", tideTurtle: "潮汐烏龜", heron: "遺物蒼鷺",
    salamander: "餘燼蠑螈", ram: "燼角山羊", moth: "月塵飛蛾", archiveOwl: "典藏貓頭鷹",
    mirrorWolf: "鏡影狼", sealRaven: "封印渡鴉", rhinoBoss: "鐵根犀王",
    serpentBoss: "澤環巨蛇", emberLionBoss: "燼鬃獅王", griffinBoss: "蝕月獅鷲",
    chimeraBoss: "符冠奇美拉",
    traitBoar: "荊棘反擊", traitBoarShort: "反擊", traitBoarDesc: "遭鄰近英雄攻擊後，反擊 1 點傷害。",
    traitRuneFox: "狐步", traitRuneFoxShort: "閃現", traitRuneFoxDesc: "行動後傳送到生命最低英雄的後方。",
    traitTideTurtle: "甲殼護送", traitTideTurtleShort: "守護", traitTideTurtleDesc: "給最近的友軍一次抵擋。",
    traitHeron: "水流之翼", traitHeronShort: "推移", traitHeronDesc: "命中後把英雄推到一格合法位置。",
    traitSalamander: "餘燼足跡", traitSalamanderShort: "燃燒", traitSalamanderDesc: "移動後留下會造成傷害的燃燒格。",
    traitRam: "角羊直線", traitRamShort: "衝鋒", traitRamDesc: "看見直線上的英雄時發動衝鋒。",
    traitMoth: "月塵", traitMothShort: "沉默", traitMothDesc: "命中後封鎖該英雄下一次技能。",
    traitArchiveOwl: "觀星標記", traitArchiveOwlShort: "標記", traitArchiveOwlDesc: "標記英雄，使下一次遠程命中增加 1 點傷害。",
    traitMirrorWolf: "鏡像分裂", traitMirrorWolfShort: "分身", traitMirrorWolfDesc: "在相鄰空格產生一隻 1 生命分身。",
    traitSealRaven: "封印吸能", traitSealRavenShort: "吸能", traitSealRavenDesc: "命中英雄時吸收 1 點能量。",
    traitRhinoBoss: "鐵根衝陣", traitRhinoBossShort: "首領", traitRhinoBossDesc: "架勢防守、橫衝一列並留下阻擋碎石。",
    traitSerpentBoss: "澤環", traitSerpentBossShort: "首領", traitSerpentBossDesc: "淹沒並拉動一欄；每回合未被兩名英雄擊中就會再生。",
    traitEmberLionBoss: "燼火循環", traitEmberLionBossShort: "首領", traitEmberLionBossDesc: "輪流使用咆哮、飛躍與受傷後的額外行動。",
    traitGriffinBoss: "蝕月飛行", traitGriffinBossShort: "首領", traitGriffinBossDesc: "在免疫遠程的飛行與落地橫掃階段間切換。",
    traitChimeraBoss: "六重符冠", traitChimeraBossShort: "終王", traitChimeraBossDesc: "在可見階段中輪替衝鋒、水流、燃燒、飛行與鏡像召喚。",
    terrainRubble: "碎石", terrainSnare: "根鬚束縛", terrainTide: "潮汐", terrainBurn: "燃燒",
    terrainCooling: "冷卻符文", terrainOrbit: "環月符文", terrainSeal: "符文封印",
    tileTerrainLabel: "{terrain}。{tile}", silenceBlocked: "月塵封鎖了 {hero} 的技能。",
    terrainBurnHit: "燃燒對 {hero} 造成 1 點傷害。", terrainCoolingUsed: "{hero} 在冷卻符文恢復 1 點能量。",
    boarCounterHit: "荊棘反擊對 {hero} 造成 1 點傷害。", turtleGuarded: "甲殼護送守護了 {enemy}。",
    heronPushed: "水流之翼推動了 {hero}。", foxTeleported: "狐步移動到 {hero} 後方。",
    ramCharged: "角羊直線衝向 {hero}。", mothSilenced: "月塵沉默了 {hero}。",
    owlMarked: "觀星標記鎖定了 {hero}。", ravenDrained: "封印吸能從 {hero} 移除 1 點能量。",
    mirrorCloned: "鏡像分裂產生一隻 1 生命分身。", bossPhase: "{boss} 進入第 {phase} 階段。",
    resultCampaignComplete: "30 個任務已全部完成，所有任務仍可重玩。",
  });
  Object.assign(text.en, {
    boardLabel: "Rune tactics board",
    strategyTips: [
      "Break Wolf adjacency before trading damage; one move can remove Pack Fang from two attacks.",
      "Use Owl from two cells away so Thorn Boar cannot answer with a melee counter.",
      "A silenced hero can still move, attack or Guard, so use that turn to leave a charge lane.",
      "Hit Mirecoil Serpent with two different heroes during the same turn to stop regeneration.",
      "Use Lion while Eclipse Griffin flies, then spread before its grounded row sweep.",
      "Remove a one-HP Mirror clone before it blocks the movement lane you need.",
      "Treat Cooling, Seal and Orbit cells as resources; permanent stats do not replace positioning.",
    ],
  });
  Object.assign(text["zh-Hant"], {
    boardLabel: "\u7b26\u6587\u6230\u8853\u68cb\u76e4",
    strategyTips: [
      "先拆開暗影狼相鄰關係；一次移動可能同時移除兩次狼群加傷。",
      "讓貓頭鷹隔兩格攻擊，避免荊棘野豬發動近戰反擊。",
      "被沉默仍可移動、攻擊或防守，可先離開衝鋒線。",
      "同一回合用兩名不同英雄命中澤環巨蛇，才能停止再生。",
      "蝕月獅鷲飛行時用獅王攻擊，落地橫掃前則分散站位。",
      "盡快清掉 1 生命鏡影分身，避免需要的移動路線被堵住。",
      "把冷卻、封印與環月格當成資源；永久數值不能取代站位。",
    ],
  });

  const heroDefs = [
    { id: "lion", name: "lion", role: "lionRole", img: "weightplay-boom-mane-lion.png", hp: 7, atk: 3, skillName: "skillLion", skillDesc: "skillLionDesc", skill: "animal-rune-tactics-skill-lion-strike.webp" },
    { id: "owl", name: "owl", role: "owlRole", img: "animal-rune-tactics-hero-owl.webp", hp: 5, atk: 2, range: 2, skillName: "skillOwl", skillDesc: "skillOwlDesc", skill: "animal-rune-tactics-skill-owl-rune-bolt.webp" },
    { id: "turtle", name: "turtle", role: "turtleRole", img: "animal-rune-tactics-hero-turtle.webp", hp: 9, atk: 1, skillName: "skillTurtle", skillDesc: "skillTurtleDesc", skill: "animal-rune-tactics-skill-turtle-guard.webp" },
  ];

  const enemyDefs = [
    { id: "wolf", name: "wolf", img: "animal-rune-tactics-enemy-wolf.webp", hp: 5, atk: 2, trait: "traitWolf" },
    { id: "raven", name: "raven", img: "animal-rune-tactics-enemy-raven.webp", hp: 4, atk: 2, range: 2, trait: "traitRaven" },
    { id: "stag", name: "stag", img: "animal-rune-tactics-boss-stag.webp", hp: 12, atk: 3, trait: "traitStag", bossKit: "stag" },
    { id: "boar", name: "boar", img: "animal-gearpack-expedition-enemy-armored-boar.webp", hp: 7, atk: 2, trait: "traitBoar" },
    { id: "runeFox", name: "runeFox", img: "animal-gearpack-expedition-enemy-fox-scout.webp", hp: 5, atk: 2, trait: "traitRuneFox" },
    { id: "tideTurtle", name: "tideTurtle", img: "animal-rune-tactics-hero-turtle.webp", hp: 8, atk: 1, trait: "traitTideTurtle" },
    { id: "heron", name: "heron", img: "animal-rune-tactics-enemy-raven.webp", hp: 5, atk: 2, range: 2, trait: "traitHeron" },
    { id: "salamander", name: "salamander", img: "shadow-wolf-enemy-bat.webp", hp: 6, atk: 2, trait: "traitSalamander" },
    { id: "ram", name: "ram", img: "weightplay-character-gear-horn-rhino.png", hp: 8, atk: 3, trait: "traitRam" },
    { id: "moth", name: "moth", img: "weightplay-character-moon-cap-owl-cutout.webp", hp: 5, atk: 1, range: 2, trait: "traitMoth" },
    { id: "archiveOwl", name: "archiveOwl", img: "animal-auto-squad-boss-eclipse-archowl.webp", hp: 7, atk: 2, range: 2, trait: "traitArchiveOwl" },
    { id: "mirrorWolf", name: "mirrorWolf", img: "animal-crystal-survivor-shadow-fox-v2.webp", hp: 6, atk: 2, trait: "traitMirrorWolf" },
    { id: "sealRaven", name: "sealRaven", img: "animal-rune-tactics-enemy-raven.webp", hp: 6, atk: 2, range: 2, trait: "traitSealRaven" },
    { id: "rhinoBoss", name: "rhinoBoss", img: "animal-rune-tactics-boss-ironroot-rhino.webp", hp: 18, atk: 3, trait: "traitRhinoBoss", bossKit: "rhino" },
    { id: "serpentBoss", name: "serpentBoss", img: "animal-rune-tactics-boss-mirecoil-serpent.webp", hp: 20, atk: 3, range: 2, trait: "traitSerpentBoss", bossKit: "serpent" },
    { id: "emberLionBoss", name: "emberLionBoss", img: "animal-rune-tactics-boss-embermane-lion.webp", hp: 22, atk: 4, trait: "traitEmberLionBoss", bossKit: "emberLion" },
    { id: "griffinBoss", name: "griffinBoss", img: "animal-rune-tactics-boss-eclipse-griffin.webp", hp: 24, atk: 4, range: 2, trait: "traitGriffinBoss", bossKit: "griffin" },
    { id: "chimeraBoss", name: "chimeraBoss", img: "animal-rune-tactics-boss-rune-crown-chimera.webp", hp: 28, atk: 4, trait: "traitChimeraBoss", bossKit: "chimera" },
  ];

  const rewardPool = [
    { id: "power", icon: "animal-rune-tactics-reward-hero-equipment.webp", title: "rewardPower", desc: "rewardPowerDesc" },
    { id: "guard", icon: "animal-rune-tactics-reward-forest-medal.webp", title: "rewardGuard", desc: "rewardGuardDesc" },
    { id: "shard", icon: "animal-rune-tactics-reward-rune-shard.webp", title: "rewardShard", desc: "rewardShardDesc" },
    { id: "revive", icon: "animal-rune-tactics-reward-revive-token.webp", title: "rewardRevive", desc: "rewardReviveDesc" },
    { id: "focus", icon: "animal-rune-tactics-reward-training-slot.webp", title: "rewardFocus", desc: "rewardFocusDesc" },
  ];

  const tile = (x, y, type, extra = {}) => ({ x, y, type, ...extra });
  const mission = (id, nameEn, nameZht, enemies, tacticEn, tacticZht, terrain = [], bossId = null) => ({
    id, chapter: Math.ceil(id / CHAPTER_SIZE), nameEn, nameZht, enemies, tacticEn, tacticZht, terrain, bossId,
    xp: 37 + id * 8, runes: 8 + id * 2,
  });
  const missionDefs = [
    mission(1, "First Pawprints", "初踏符徑", ["wolf", "wolf"], "Break the Wolves' adjacency before focusing one target.", "先拆開狼群相鄰加成，再集中攻擊一個目標。"),
    mission(2, "Raven Sightline", "渡鴉視線", ["wolf", "raven"], "Keep the weakest hero outside the Raven's range.", "讓生命最低的英雄離開渡鴉射程。"),
    mission(3, "Broken Rune Bridge", "斷裂符橋", ["wolf", "raven"], "Choose a lane around the blocked bridge cells.", "繞過斷橋碎石選擇進攻路線。", [tile(1,1,"rubble"), tile(1,2,"rubble")]),
    mission(4, "Pack Crossroads", "狼群岔路", ["wolf", "wolf", "wolf"], "Hold one lane with Turtle while Lion splits the pack.", "讓烏龜守住一路，獅王拆散狼群。"),
    mission(5, "Stonehorn Trial", "石角試煉", ["stag", "wolf"], "Break Stone Hide twice and sidestep the Boss lane charge.", "兩次擊破石甲，並避開首領直線衝鋒。", [], "stag"),
    mission(6, "Bramble Teeth", "荊棘利齒", ["boar", "wolf"], "Use Owl range so Thorn Counter cannot punish every hit.", "用貓頭鷹遠攻，避免每次都被荊棘反擊。"),
    mission(7, "Foxstep Gate", "狐步之門", ["runeFox", "wolf"], "Protect the weakest hero before Foxstep reaches the back.", "先保護生命最低英雄，防止狐步繞後。"),
    mission(8, "Root Snare", "根鬚束縛", ["boar", "runeFox"], "Cross the center without ending the wrong hero on a Snare.", "穿越中央時別讓錯誤英雄停在束縛格。", [tile(1,0,"snare"), tile(1,2,"snare")]),
    mission(9, "Forge Pincer", "鍛林夾擊", ["boar", "runeFox", "runeFox"], "Remove a Fox flank before committing Lion beside the Boar.", "先清掉一側狐狸，再讓獅王接近野豬。"),
    mission(10, "Ironroot Rhino", "鐵根犀王", ["rhinoBoss", "boar"], "Bait the Rhino rush away from the center before rubble closes the board.", "引走犀王衝鋒，避免碎石封死中央。", [], "rhino"),
    mission(11, "Flooded Script", "水淹碑文", ["heron", "raven"], "Plan for Tide tiles to shift occupied cells after the enemy turn.", "預判敵方回合後潮汐格會移動站位。", [tile(1,0,"tide",{dx:0,dy:1}), tile(1,2,"tide",{dx:0,dy:1})]),
    mission(12, "Shell Convoy", "甲殼護送", ["tideTurtle", "wolf", "heron"], "Strip the Turtle's one-hit guard before attacking its protected ally.", "先消耗烏龜的一次守護，再攻擊被保護友軍。", [tile(1,1,"tide",{dx:0,dy:1})]),
    mission(13, "Heron Current", "蒼鷺水流", ["heron", "heron", "wolf"], "Leave legal landing cells so Current Wing cannot isolate Owl.", "保留合法落點，別讓水流之翼孤立貓頭鷹。", [tile(1,0,"tide",{dx:0,dy:1}), tile(1,3,"tide",{dx:0,dy:-1})]),
    mission(14, "Drowned Formation", "沉沒陣形", ["tideTurtle", "heron", "raven"], "Choose between breaking Shell Guard and stopping the Heron push.", "在打破甲殼守護與阻止蒼鷺推移間決定順序。", [tile(1,1,"tide",{dx:0,dy:1}), tile(1,2,"tide",{dx:0,dy:-1})]),
    mission(15, "Mirecoil Serpent", "澤環巨蛇", ["serpentBoss", "heron"], "Hit the Serpent with two heroes each turn to stop regeneration.", "每回合用兩名英雄命中巨蛇，阻止牠再生。", [tile(1,0,"tide",{dx:0,dy:1}), tile(1,2,"tide",{dx:0,dy:1})], "serpent"),
    mission(16, "Ember Footprints", "餘燼足跡", ["salamander", "wolf"], "Track the Salamander's previous cell before advancing.", "前進前先注意蠑螈上一格留下的餘燼。"),
    mission(17, "Ramline", "角羊直線", ["ram", "salamander"], "Sidestep the Ram's row instead of absorbing the full charge.", "離開角羊直線，別只靠防守硬接衝鋒。"),
    mission(18, "Cooling Runes", "冷卻符文", ["salamander", "raven"], "Route a low-Energy hero through a Cooling Rune.", "讓低能量英雄踩過冷卻符文恢復。", [tile(1,0,"cooling"), tile(1,3,"cooling")]),
    mission(19, "Caldera Split", "火口分隊", ["ram", "salamander", "salamander"], "Keep an escape cell open while charges divide the squad.", "衝鋒分割隊伍時保留一個逃生格。", [tile(1,1,"burn"), tile(1,2,"burn")]),
    mission(20, "Embermane Lion", "燼鬃獅王", ["emberLionBoss", "ram"], "Read the roar, leap, and wounded extra-action cycle.", "辨認咆哮、飛躍與受傷後額外行動循環。", [tile(1,1,"cooling"), tile(1,2,"burn")], "emberLion"),
    mission(21, "Moon Dust", "月塵棋盤", ["moth", "raven"], "Spend a Skill before Moon Dust can silence that hero.", "在月塵沉默前先用掉關鍵技能。"),
    mission(22, "Watcher Perch", "觀星棲台", ["archiveOwl", "moth"], "Move the marked hero before the next ranged strike.", "下一次遠程攻擊前移開被標記英雄。"),
    mission(23, "Orbit Runes", "環月符陣", ["moth", "archiveOwl"], "Predict the clockwise outer-ring rotation at round end.", "預判回合結束時外圈順時針轉動。", [tile(0,0,"orbit"),tile(1,0,"orbit"),tile(2,0,"orbit"),tile(2,1,"orbit"),tile(2,2,"orbit"),tile(2,3,"orbit"),tile(1,3,"orbit"),tile(0,3,"orbit"),tile(0,2,"orbit"),tile(0,1,"orbit")]),
    mission(24, "Eclipse Crossfire", "蝕月交火", ["moth", "archiveOwl", "raven"], "Order Skills, movement, and guard before silence and marks overlap.", "在沉默與標記重疊前安排技能、移動與防守順序。"),
    mission(25, "Eclipse Griffin", "蝕月獅鷲", ["griffinBoss", "moth"], "Use melee while it flies, then spread before its grounded sweep.", "飛行時用近戰，落地橫掃前分散站位。", [tile(0,0,"orbit"),tile(2,0,"orbit"),tile(2,3,"orbit"),tile(0,3,"orbit")], "griffin"),
    mission(26, "Mirror Pack", "鏡影狼群", ["mirrorWolf", "wolf"], "Reserve an adjacent cell or destroy the 1-HP clone immediately.", "保留相鄰空格，或立刻清除 1 生命分身。"),
    mission(27, "Sealfeather Court", "封印羽庭", ["sealRaven", "mirrorWolf"], "Protect Energy while controlling the clone's free cell.", "保護能量，同時控制分身可用空格。"),
    mission(28, "Six-Rune Locks", "六符封鎖", ["sealRaven", "archiveOwl", "mirrorWolf"], "Occupy three linked Seal cells to remove the enemy ward.", "讓三名英雄站上相連封印格，解除敵方護罩。", [tile(0,3,"seal"),tile(1,0,"seal"),tile(1,1,"seal"),tile(1,2,"seal"),tile(1,3,"seal"),tile(2,3,"seal")]),
    mission(29, "Crown Gauntlet", "王冠連戰", ["boar", "heron", "ram", "moth", "mirrorWolf"], "Answer five earlier mechanics without losing formation control.", "在不失去陣形控制下處理五種先前機制。"),
    mission(30, "Rune Crown Chimera", "符冠奇美拉", ["chimeraBoss", "sealRaven", "mirrorWolf"], "Adapt as every visible Boss phase changes the board rule.", "每個可見首領階段改變棋盤規則時立即調整。", [tile(1,0,"seal"),tile(1,3,"cooling")], "chimera"),
  ];

  let locale = localStorage.getItem(localeKey) || "en";

  function updateBattleScale() {
    const viewport = window.visualViewport;
    const visualWidth = Math.round(viewport?.width || 0);
    const visualHeight = Math.round(viewport?.height || 0);
    const useVisual = visualWidth > 0 && visualHeight > 0 && Math.abs(visualWidth - innerWidth) <= 2 && visualHeight <= innerHeight + 2;
    document.documentElement.style.setProperty("--rune-vw", `${useVisual ? visualWidth : innerWidth}px`);
    document.documentElement.style.setProperty("--rune-vh", `${useVisual ? visualHeight : innerHeight}px`);
  }

  updateBattleScale();
  window.addEventListener("resize", updateBattleScale);
  window.addEventListener("orientationchange", updateBattleScale);
  window.visualViewport?.addEventListener("resize", updateBattleScale, { passive: true });
  let selectedMission = 1;
  let profile = loadProfile();
  let state = null;
  let claimedRewardId = null;
  let gridCursor = { x: 0, y: 0 };
  let turnTransitionTimer = 0;

  function clearTurnTransition() {
    clearTimeout(turnTransitionTimer);
    turnTransitionTimer = 0;
  }

  function scheduleTurnTransition(callback, delay) {
    clearTurnTransition();
    turnTransitionTimer = window.setTimeout(() => {
      turnTransitionTimer = 0;
      callback();
    }, delay);
  }

  function t(key, vars = {}) {
    let value = (text[locale] && text[locale][key]) || text.en[key] || key;
    Object.entries(vars).forEach(([name, val]) => {
      value = value.replaceAll(`{${name}}`, val);
    });
    return value;
  }

  function focusPanel(node) {
    requestAnimationFrame(() => {
      node?.scrollIntoView?.({ block: "start", inline: "nearest" });
    });
  }

  function setBattleCovered(covered) {
    nodes.gamePanel.inert = covered;
    if (covered) nodes.gamePanel.setAttribute("aria-hidden", "true");
    else nodes.gamePanel.removeAttribute("aria-hidden");
  }

  function focusBattleGrid() {
    requestAnimationFrame(() => {
      nodes.grid.querySelector(`.tile[data-x="${gridCursor.x}"][data-y="${gridCursor.y}"]`)?.focus({ preventScroll: true });
    });
  }

  function keepDialogFocus(panel, event) {
    if (event.key !== "Tab" || panel.classList.contains("is-hidden")) return;
    const actions = [...panel.querySelectorAll("button:not(:disabled)")];
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
  }

  function loadProfile() {
    try {
      const parsed = JSON.parse(localStorage.getItem(saveKey) || "{}");
      const source = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
      const wholeNumber = (value, fallback, minimum = 0, maximum = Number.MAX_SAFE_INTEGER) => {
        const number = Number(value);
        return Number.isFinite(number) ? Math.min(maximum, Math.max(minimum, Math.floor(number))) : fallback;
      };
      const rawXp = wholeNumber(source.xp, 0);
      const heroLevels = source.heroLevels && typeof source.heroLevels === "object" && !Array.isArray(source.heroLevels)
        ? source.heroLevels
        : {};
      return {
        ...defaultProfile(),
        ...source,
        level: wholeNumber(source.level, 1, 1) + Math.floor(rawXp / 100),
        xp: rawXp % 100,
        runes: wholeNumber(source.runes, 0),
        bestMission: wholeNumber(source.bestMission, 1, 1, missionDefs.length),
        unlockedMission: wholeNumber(source.unlockedMission, 1, 1, missionDefs.length),
        training: source.training === true,
        heroLevels: {
          lion: wholeNumber(heroLevels.lion, 1, 1, 6),
          owl: wholeNumber(heroLevels.owl, 1, 1, 6),
          turtle: wholeNumber(heroLevels.turtle, 1, 1, 6),
        },
        bonusAtk: wholeNumber(source.bonusAtk, 0),
        bonusHp: wholeNumber(source.bonusHp, 0),
        bonusEnergy: wholeNumber(source.bonusEnergy, 0),
        reviveTokens: wholeNumber(source.reviveTokens, 0),
      };
    } catch {
      return defaultProfile();
    }
  }

  function defaultProfile() {
    return {
      level: 1,
      xp: 0,
      runes: 0,
      bestMission: 1,
      unlockedMission: 1,
      training: false,
      heroLevels: { lion: 1, owl: 1, turtle: 1 },
      bonusAtk: 0,
      bonusHp: 0,
      bonusEnergy: 0,
      reviveTokens: 0,
    };
  }

  function saveProfile() {
    localStorage.setItem(saveKey, JSON.stringify(profile));
  }

  function wallet() {
    return window.WeightPlayWallet?.read?.() || { diamonds: 0 };
  }

  function spendDiamonds(cost) {
    return window.WeightPlayWallet?.spendDiamonds?.(cost) || false;
  }

  function applyLocale() {
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : "en";
    document.title = `${t("title")} - WeightPlay`;
    const description = locale === "zh-Hant"
      ? "指揮獅王、貓頭鷹與烏龜完成 30 個回合制戰棋任務，破解符文地形、特殊敵人與六位階段首領，並保存本機成長。"
      : "Command three animal heroes through 30 authored rune-grid missions with terrain rules, special enemies, six phased Bosses, permanent upgrades, and local progress.";
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", `${t("title")} - WeightPlay`);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", `${t("title")} - WeightPlay`);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", description);
    nodes.backBtn.setAttribute("aria-label", state ? t("backToMenu") : t("backToLobby"));
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
    nodes.localeSelect.value = locale;
    nodes.localeSelect.setAttribute("aria-label", t("language"));
    nodes.grid.setAttribute("aria-label", t("boardLabel"));
    if (nodes.mainStartBtn) nodes.mainStartBtn.textContent = t("startGame");
    if (nodes.stagePanel) {
      nodes.stagePanel.querySelector("strong").textContent = t("missionSelect");
      nodes.stageBackBtn.setAttribute("aria-label", t("backToMain"));
    }
    renderMenu();
    if (state) render();
    localizeStrategyTips();
  }

  function localizeStrategyTips() {
    const tips = text[locale].strategyTips || text.en.strategyTips;
    document.querySelectorAll(".game-info-strategy li").forEach((item, index) => {
      if (tips[index]) item.textContent = tips[index];
    });
  }

  function renderMenu(focusHeroId = null) {
    nodes.profileLevel.textContent = profile.level;
    nodes.profileXp.textContent = `${profile.xp}/100`;
    nodes.profileBest.textContent = profile.bestMission;
    nodes.profileRunes.textContent = profile.runes || 0;
    renderGrowthSummary();
    nodes.trainingBtn.disabled = profile.training || wallet().diamonds < trainingCost;
    nodes.trainingStatus.textContent = profile.training ? t("trainingOwned") : wallet().diamonds < trainingCost ? t("trainingNeed", { cost: trainingCost }) : "";
    renderHeroUpgrades();
    nodes.missionGrid.innerHTML = "";
    missionDefs.forEach((mission) => {
      const btn = document.createElement("button");
      btn.type = "button";
      const isLocked = mission.id > profile.unlockedMission;
      const isActive = selectedMission === mission.id;
      btn.className = `mission-card ${isActive ? "is-active" : ""}`;
      btn.disabled = isLocked;
      btn.setAttribute("aria-pressed", String(isActive));
      const enemyNames = mission.enemies.map((id) => t(enemyDefs.find((enemy) => enemy.id === id)?.name || id)).join(" / ");
      const traitNames = [...new Set(mission.enemies.map((id) => enemyDefs.find((enemy) => enemy.id === id)?.trait).filter(Boolean))]
        .map((key) => t(key))
        .join(" / ");
      const missionName = locale === "zh-Hant" ? mission.nameZht : mission.nameEn;
      const missionTactic = locale === "zh-Hant" ? mission.tacticZht : mission.tacticEn;
      btn.innerHTML = `
        <span class="mission-card__top">
          <strong>${t("missionCard", { n: mission.id })} · ${missionName}</strong>
          <b>${isLocked ? t("locked") : isActive ? t("missionStatusCurrent") : t("missionStatusUnlocked")}</b>
        </span>
        <small>${t("missionRewardLabel")}: ${isLocked ? t("locked") : t("missionReward", { xp: mission.xp, runes: mission.runes })}</small>
        <span>${t("missionGoal", { enemies: enemyNames })}</span>
        <em>${t("missionPlan", { plan: missionTactic })}<b class="mission-card__traits">${t("enemyTraits", { traits: traitNames })}</b></em>`;
      btn.addEventListener("click", () => {
        selectedMission = mission.id;
        startMission(selectedMission);
      });
      nodes.missionGrid.appendChild(btn);
    });
    scrollSelectedMissionIntoView();
    if (focusHeroId !== null) {
      const preferred = nodes.heroUpgradeGrid.querySelector(`[data-hero-upgrade="${focusHeroId}"]:not(:disabled)`);
      const fallback = nodes.heroUpgradeGrid.querySelector("[data-hero-upgrade]:not(:disabled)")
        || nodes.stagePanel?.querySelector('[data-rune-stage-tab="heroes"]');
      (preferred || fallback)?.focus({ preventScroll: true });
    }
  }

  function scrollSelectedMissionIntoView() {
    const active = nodes.missionGrid.querySelector(".mission-card.is-active");
    if (!active) return;
    requestAnimationFrame(() => {
      active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });
  }

  function focusSelectedMission() {
    requestAnimationFrame(() => nodes.missionGrid.querySelector(".mission-card.is-active:not(:disabled)")?.focus({ preventScroll: true }));
  }

  function heroUpgradeCost(id) {
    const level = profile.heroLevels?.[id] || 1;
    return 18 + level * 12;
  }

  function growthStats(level) {
    return {
      hp: Math.max(0, level - 1),
      atk: Math.floor(level / 2),
    };
  }

  function renderGrowthSummary() {
    if (!nodes.growthSummary) return;
    const heroLevels = profile.heroLevels || {};
    const nextHero = heroDefs
      .map((hero) => ({ hero, level: heroLevels[hero.id] || 1, cost: heroUpgradeCost(hero.id) }))
      .filter((item) => item.level < 6)
      .sort((a, b) => a.cost - b.cost)[0];
    const nextLine = nextHero
      ? (profile.runes || 0) >= nextHero.cost
        ? `${t(nextHero.hero.name)}: ${t("heroUpgradeReady")}`
        : t("progressionNextUpgrade", { hero: t(nextHero.hero.name), cost: nextHero.cost - (profile.runes || 0) })
      : t("heroUpgradeMax");
    nodes.growthSummary.innerHTML = `
      <strong>${t("progressionTitle")}</strong>
      <span>${t("progressionLevelLine", { level: profile.level, xp: 100 - profile.xp })}</span>
      <span>${t("progressionHeroLine", { lion: heroLevels.lion || 1, owl: heroLevels.owl || 1, turtle: heroLevels.turtle || 1 })}</span>
      <span>${t("progressionBonusLine", { atk: profile.bonusAtk || 0, hp: profile.bonusHp || 0, energy: (profile.bonusEnergy || 0) + (profile.training ? 1 : 0), revives: profile.reviveTokens || 0 })}</span>
      <em>${nextLine}</em>`;
  }

  function renderHeroUpgrades() {
    if (!nodes.heroUpgradeGrid) return;
    nodes.heroUpgradeGrid.innerHTML = "";
    heroDefs.forEach((hero) => {
      const level = profile.heroLevels?.[hero.id] || 1;
      const cost = heroUpgradeCost(hero.id);
      const currentStats = growthStats(level);
      const nextStats = growthStats(Math.min(6, level + 1));
      const need = Math.max(0, cost - (profile.runes || 0));
      const card = document.createElement("div");
      card.className = "hero-upgrade-card";
      card.innerHTML = `
        <img src="${asset(hero.img)}" alt="" />
        <div>
          <strong>${t(hero.name)} ${t("heroLevel", { level })}</strong>
          <span>${t(hero.role)}</span>
          <small>${t("heroGrowthStats", { hp: currentStats.hp, atk: currentStats.atk })}</small>
          <small>${level >= 6 ? t("heroUpgradeMax") : t("heroNextStats", { level: level + 1, hp: nextStats.hp, atk: nextStats.atk })}</small>
          <em>${level >= 6 ? "" : need > 0 ? t("heroUpgradeNeed", { need }) : t("heroUpgradeReady")}</em>
        </div>
        <button type="button" data-hero-upgrade="${hero.id}" ${level >= 6 || (profile.runes || 0) < cost ? "disabled" : ""}>${level >= 6 ? t("heroUpgradeMax") : t("heroUpgradeCost", { cost })}</button>`;
      nodes.heroUpgradeGrid.appendChild(card);
    });
  }

  function upgradeHero(id) {
    const level = profile.heroLevels?.[id] || 1;
    const cost = heroUpgradeCost(id);
    if (level >= 6 || (profile.runes || 0) < cost) return;
    profile.runes -= cost;
    profile.heroLevels[id] = level + 1;
    saveProfile();
    renderMenu(id);
  }

  function installStandardStageFlow() {
    const menuCopy = nodes.menuPanel.querySelector(".menu-copy");
    const missionList = nodes.missionGrid.closest(".mission-list");
    const heroList = nodes.heroUpgradeGrid.closest(".hero-upgrade-list");
    const diamondCard = nodes.trainingBtn.closest(".diamond-card");
    const mainStart = document.createElement("button");
    mainStart.id = "mainStartBtn";
    mainStart.type = "button";
    mainStart.className = "primary-btn standard-main-start";
    mainStart.dataset.wpMainStart = "true";
    mainStart.textContent = t("startGame");
    menuCopy.insertBefore(mainStart, menuCopy.querySelector(".profile-grid"));
    const stagePanel = document.createElement("section");
    stagePanel.id = "stagePanel";
    stagePanel.className = "wp-standard-stage-panel is-hidden";
    stagePanel.dataset.wpStandardStageScreen = "true";
    stagePanel.innerHTML = `
      <header class="wp-standard-stage-heading"><button id="stageBackBtn" data-wp-return="stage" type="button" aria-label="${t("backToMain")}">&larr;</button><strong>${t("missionSelect")}</strong></header>
      <div class="rune-stage-workspace">
        <section class="rune-stage-view is-active" data-rune-stage-view="missions"></section>
        <section class="rune-stage-view" data-rune-stage-view="heroes"></section>
        <section class="rune-stage-view" data-rune-stage-view="training"></section>
      </div>
      <nav class="rune-stage-tabs">
        <button class="is-active" type="button" data-rune-stage-tab="missions" data-ui="stageTabMissions">Missions</button>
        <button type="button" data-rune-stage-tab="heroes" data-ui="stageTabHeroes">Heroes</button>
        <button type="button" data-rune-stage-tab="training" data-ui="stageTabTraining">Training</button>
      </nav>`;
    stagePanel.querySelector('[data-rune-stage-view="missions"]').append(missionList);
    stagePanel.querySelector('[data-rune-stage-view="heroes"]').append(nodes.growthSummary, heroList);
    stagePanel.querySelector('[data-rune-stage-view="training"]').append(diamondCard);
    nodes.menuPanel.after(stagePanel);
    const reserve = document.createElement("div");
    reserve.className = "wp-standard-stage-reserve is-hidden";
    reserve.setAttribute("aria-hidden", "true");
    stagePanel.after(reserve);
    Object.assign(nodes, { stagePanel, stageReserve: reserve, mainStartBtn: mainStart, stageBackBtn: stagePanel.querySelector("#stageBackBtn") });
    stagePanel.querySelectorAll("[data-rune-stage-tab]").forEach((button) => button.addEventListener("click", () => {
      const tab = button.dataset.runeStageTab;
      stagePanel.querySelectorAll("[data-rune-stage-tab]").forEach((item) => item.classList.toggle("is-active", item === button));
      stagePanel.querySelectorAll("[data-rune-stage-view]").forEach((view) => view.classList.toggle("is-active", view.dataset.runeStageView === tab));
    }));
  }

  function showStage() {
    nodes.menuPanel.classList.add("is-hidden");
    nodes.stagePanel.classList.remove("is-hidden");
    nodes.stageReserve.classList.remove("is-hidden");
    document.body.classList.add("wp-standard-stage-page");
    renderMenu();
    focusSelectedMission();
  }

  function showMainFromStage() {
    nodes.stagePanel.classList.add("is-hidden");
    nodes.stageReserve.classList.add("is-hidden");
    nodes.menuPanel.classList.remove("is-hidden");
    document.body.classList.remove("wp-standard-stage-page");
    requestAnimationFrame(() => nodes.mainStartBtn.focus({ preventScroll: true }));
  }

  function startMission(mission = selectedMission) {
    clearTurnTransition();
    claimedRewardId = null;
    const extraEnergy = (profile.training ? 1 : 0) + (profile.bonusEnergy || 0);
    const hpBonus = profile.bonusHp || 0;
    const missionDef = missionDefs.find((item) => item.id === mission) || missionDefs[0];
    state = {
      mission,
      missionDef,
      turn: 1,
      selected: "lion",
      acted: new Set(),
      phase: "player",
      rerolled: false,
      terrain: missionDef.terrain.map((item) => ({ ...item })),
      coolingUsed: new Set(),
      phaseEvents: [],
      heroes: heroDefs.map((h, idx) => {
        const level = profile.heroLevels?.[h.id] || 1;
        const maxHp = h.hp + hpBonus + level - 1;
        return {
          ...h,
          level,
          x: 0,
          y: idx,
          maxHp,
          hp: maxHp,
          atk: h.atk + (profile.bonusAtk || 0) + Math.floor(level / 2),
          energy: 1 + extraEnergy,
          guard: false,
          team: "hero",
        };
      }),
      enemies: makeEnemies(mission),
    };
    nodes.menuPanel.classList.add("is-hidden");
    nodes.stagePanel.classList.add("is-hidden");
    nodes.stageReserve.classList.add("is-hidden");
    document.body.classList.remove("wp-standard-stage-page");
    document.body.classList.add("is-rune-playing");
    nodes.backBtn.setAttribute("href", "#stage");
    nodes.backBtn.setAttribute("aria-label", t("backToMenu"));
    nodes.backBtn.setAttribute("data-wp-return", "battle");
    nodes.backBtn.replaceChildren(document.createTextNode("\u2190"));
    nodes.resultPanel.classList.add("is-hidden");
    nodes.rewardPanel.classList.add("is-hidden");
    setBattleCovered(false);
    nodes.gamePanel.classList.remove("is-hidden");
    log("chooseHero");
    render();
    focusPanel(nodes.gamePanel);
    focusBattleGrid();
  }

  function makeEnemies(mission) {
    const missionDef = missionDefs.find((item) => item.id === mission) || missionDefs[0];
    const formation = [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 1, y: 3 },
    ];
    return missionDef.enemies.map((id, index) => {
      const base = enemyDefs.find((enemy) => enemy.id === id) || enemyDefs[0];
      const { x, y } = formation[index] || formation[formation.length - 1];
      const hp = base.hp + Math.floor((mission - 1) / 8);
      return {
        ...base,
        uid: `${base.id}-${index}`,
        x,
        y,
        maxHp: hp,
        hp,
        atk: base.atk + Math.floor((mission - 1) / 12),
        armorReady: base.id === "stag" || base.id === "rhinoBoss",
        allyGuard: false,
        cloneMade: false,
        hitsThisTurn: 0,
        phasesTriggered: 0,
        flying: base.id === "griffinBoss",
        team: "enemy",
      };
    });
  }

  function terrainAt(x, y, type = null) {
    return state?.terrain?.find((item) => item.x === x && item.y === y && (!type || item.type === type)) || null;
  }

  function terrainName(type) {
    const key = { rubble: "terrainRubble", snare: "terrainSnare", tide: "terrainTide", burn: "terrainBurn", cooling: "terrainCooling", orbit: "terrainOrbit", seal: "terrainSeal" }[type];
    return key ? t(key) : type;
  }

  function insideBoard(x, y) {
    return x >= 0 && x < cols && y >= 0 && y < rows;
  }

  function canOccupy(x, y, ignoreUnit = null) {
    return insideBoard(x, y) && !terrainAt(x, y, "rubble") && ![...state.heroes, ...state.enemies].some((unit) => unit !== ignoreUnit && unit.hp > 0 && unit.x === x && unit.y === y);
  }

  function applyHeroTerrain(hero) {
    const terrain = terrainAt(hero.x, hero.y);
    if (!terrain) return;
    const key = `${terrain.x},${terrain.y}`;
    if (terrain.type === "snare") hero.snared = true;
    if (terrain.type === "burn") {
      hero.hp = Math.max(0, hero.hp - 1);
      playFx("attack-hit", hero.x, hero.y);
      log("terrainBurnHit", { hero: t(hero.name) });
      tryAutoRevive(hero);
    }
    if (terrain.type === "cooling" && !state.coolingUsed.has(key)) {
      state.coolingUsed.add(key);
      hero.energy = Math.min(3, hero.energy + 1);
      state.terrain = state.terrain.filter((item) => item.type !== "burn");
      log("terrainCoolingUsed", { hero: t(hero.name) });
    }
  }

  function sealWardActive() {
    if (state?.mission !== 28) return false;
    return livingHeroes().filter((hero) => terrainAt(hero.x, hero.y, "seal")).length < 3;
  }

  function render() {
    const focusedTile = document.activeElement?.closest?.("#grid .tile");
    const restoreGridFocus = Boolean(focusedTile);
    if (focusedTile) gridCursor = { x: Number(focusedTile.dataset.x), y: Number(focusedTile.dataset.y) };
    gridCursor.x = Math.max(0, Math.min(cols - 1, gridCursor.x));
    gridCursor.y = Math.max(0, Math.min(rows - 1, gridCursor.y));
    nodes.missionText.textContent = state.mission;
    nodes.turnText.textContent = state.turn;
    nodes.enemyCountText.textContent = `${livingEnemies().length}/${state.enemies.length}`;
    nodes.grid.innerHTML = "";
    const movable = validMoves();
    const attackable = validTargets();
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = "tile";
        tile.dataset.x = x;
        tile.dataset.y = y;
        tile.tabIndex = x === gridCursor.x && y === gridCursor.y ? 0 : -1;
        tile.setAttribute("aria-rowindex", String(y + 1));
        tile.setAttribute("aria-colindex", String(x + 1));
        const terrain = terrainAt(x, y);
        if (terrain) {
          tile.classList.add(`has-terrain-${terrain.type}`);
          tile.dataset.terrain = terrain.type;
        }
        if (movable.some((p) => p.x === x && p.y === y)) tile.classList.add("is-move");
        if (attackable.some((p) => p.x === x && p.y === y)) tile.classList.add("is-attack");
        tile.addEventListener("click", () => {
          gridCursor = { x, y };
          onTile(x, y);
        });
        const unit = unitAt(x, y);
        if (unit) {
          if (unit.team === "hero" && state.acted.has(unit.id)) tile.classList.add("is-acted");
          if (unit.team === "hero" && state.selected === unit.id) tile.classList.add("is-selected");
          tile.appendChild(renderUnit(unit));
          if (unit.team === "hero") {
            const status = state.acted.has(unit.id) ? t("acted") : t("ready");
            tile.setAttribute("aria-label", t("heroTileLabel", { hero: t(unit.name), hp: unit.hp, maxHp: unit.maxHp, status, row: y + 1, column: x + 1 }));
            tile.setAttribute("aria-pressed", String(state.selected === unit.id));
          } else {
            tile.setAttribute("aria-label", t("enemyTileLabel", { enemy: t(unit.name), hp: unit.hp, maxHp: unit.maxHp, row: y + 1, column: x + 1 }));
          }
        } else if (movable.some((p) => p.x === x && p.y === y)) {
          tile.setAttribute("aria-label", t("moveTileLabel", { row: y + 1, column: x + 1 }));
        } else {
          tile.setAttribute("aria-label", t("emptyTileLabel", { row: y + 1, column: x + 1 }));
        }
        if (terrain) {
          const baseLabel = tile.getAttribute("aria-label") || t("emptyTileLabel", { row: y + 1, column: x + 1 });
          tile.setAttribute("aria-label", t("tileTerrainLabel", { terrain: terrainName(terrain.type), tile: baseLabel }));
          const terrainMark = document.createElement("i");
          terrainMark.className = "terrain-mark";
          terrainMark.textContent = terrainName(terrain.type);
          terrainMark.setAttribute("aria-hidden", "true");
          tile.appendChild(terrainMark);
        }
        nodes.grid.appendChild(tile);
      }
    }
    renderSelected();
    renderTurnRoster();
    updateActionButtons();
    if (restoreGridFocus) {
      nodes.grid.querySelector(`.tile[data-x="${gridCursor.x}"][data-y="${gridCursor.y}"]`)?.focus({ preventScroll: true });
    }
  }

  function moveGridFocus(key, tile) {
    const direction = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    }[key];
    if (!direction) return false;
    const x = Math.max(0, Math.min(cols - 1, Number(tile.dataset.x) + direction[0]));
    const y = Math.max(0, Math.min(rows - 1, Number(tile.dataset.y) + direction[1]));
    gridCursor = { x, y };
    nodes.grid.querySelectorAll(".tile").forEach((item) => {
      item.tabIndex = Number(item.dataset.x) === x && Number(item.dataset.y) === y ? 0 : -1;
    });
    nodes.grid.querySelector(`.tile[data-x="${x}"][data-y="${y}"]`)?.focus({ preventScroll: true });
    return true;
  }

  function renderUnit(unit) {
    const wrap = document.createElement("div");
    wrap.className = unit.team === "enemy" ? "enemy" : `hero ${state?.acted?.has(unit.id) ? "has-acted" : "is-ready"}`;
    if (unit.bossKit) wrap.classList.add("is-boss");
    const img = document.createElement("img");
    img.className = "unit";
    img.src = asset(unit.img);
    img.alt = "";
    const hp = document.createElement("div");
    hp.className = "hpbar";
    hp.innerHTML = `<span style="width:${Math.max(0, Math.round((unit.hp / unit.maxHp) * 100))}%"></span>`;
    wrap.append(img, hp);
    if (unit.team === "enemy" && unit.trait) {
      const trait = document.createElement("span");
      trait.className = `enemy-trait-badge enemy-trait-badge--${unit.id}${unit.id === "stag" && !unit.armorReady ? " is-spent" : ""}`;
      trait.textContent = t(`${unit.trait}Short`);
      trait.title = `${t(unit.trait)}: ${t(`${unit.trait}Desc`)}`;
      wrap.appendChild(trait);
    }
    if (unit.team === "hero") {
      const badge = document.createElement("em");
      badge.className = "turn-badge";
      badge.textContent = state?.acted?.has(unit.id) ? t("acted") : t("ready");
      wrap.appendChild(badge);
    }
    return wrap;
  }

  function renderSelected() {
    const hero = selectedHero();
    if (!hero) {
      nodes.selectedCard.textContent = t("chooseHero");
      nodes.skillBtn.title = t("skill");
      return;
    }
    const status = state.acted.has(hero.id) ? t("acted") : t("ready");
    nodes.selectedCard.innerHTML = `
      <strong>${t(hero.name)} ${t("heroLevel", { level: hero.level })} · ${status}</strong>
      <span>${t("chooseTarget", { hero: t(hero.name), hp: hero.hp, maxHp: hero.maxHp, energy: hero.energy })}</span>
      <small>${t("skillInfo", { skill: t(hero.skillName), desc: t(hero.skillDesc) })}</small>`;
    nodes.selectedCard.querySelector("strong").textContent = `${t(hero.name)} ${t("heroLevel", { level: hero.level })} / ${status}`;
    const skillHelp = nodes.selectedCard.querySelector("small");
    skillHelp.className = "skill-help";
    skillHelp.innerHTML = `<b>${t("skillInfoLabel")}</b>${t("skillInfo", { skill: t(hero.skillName), desc: t(hero.skillDesc) })}`;
    nodes.skillBtn.title = t("skillInfo", { skill: t(hero.skillName), desc: t(hero.skillDesc) });
  }

  function renderTurnRoster() {
    if (!nodes.turnRoster || !state) return;
    const items = state.heroes.map((hero) => {
      const isSelected = state.selected === hero.id;
      const isFallen = hero.hp <= 0;
      const isDone = !isFallen && state.acted.has(hero.id);
      const status = isFallen ? t("fallen") : isDone ? t("acted") : t("ready");
      const className = ["turn-roster-item", isSelected ? "is-selected" : "", isDone ? "is-done" : "", isFallen ? "is-fallen" : ""].filter(Boolean).join(" ");
      return `
        <button class="${className}" type="button" data-roster-hero="${hero.id}" aria-pressed="${isSelected}" ${isFallen ? "disabled" : ""}>
          <img src="${asset(hero.img)}" alt="" aria-hidden="true" />
          <span>
            <strong>${t(hero.name)}</strong>
            <small>${status} / ${t("health")} ${Math.max(0, hero.hp)}/${hero.maxHp}</small>
          </span>
        </button>`;
    }).join("");
    nodes.turnRoster.innerHTML = `<strong class="turn-roster-title">${t("turnRosterTitle")}</strong><div>${items}</div>`;
    nodes.turnRoster.querySelectorAll("[data-roster-hero]").forEach((button) => {
      button.addEventListener("click", () => {
        state.selected = button.dataset.rosterHero;
        render();
      });
    });
  }

  function updateActionButtons() {
    const hero = selectedHero();
    const canAct = hero && !state.acted.has(hero.id) && state.phase === "player";
    const targets = hero ? validTargets() : [];
    const attackTarget = targets[0];
    const skillTarget = hero && hero.id !== "turtle" ? attackTarget || livingEnemies().sort((a, b) => distance(hero, a) - distance(hero, b))[0] : null;
    nodes.attackBtn.textContent = hero ? t("attackValue", { value: hero.atk }) : t("attack");
    nodes.guardBtn.textContent = hero ? t("guardValue") : t("guard");
    nodes.skillBtn.textContent = hero ? t("skillValue", { value: hero.id === "turtle" ? "+1" : hero.atk + 2 }) : t("skill");
    nodes.attackBtn.setAttribute("aria-label", attackTarget ? t("actionTarget", { action: t("attack"), value: hero.atk, target: t(attackTarget.name) }) : t("attack"));
    nodes.guardBtn.setAttribute("aria-label", hero ? `${t("guardValue")}. ${t("guardHelp")}` : t("guard"));
    nodes.skillBtn.setAttribute("aria-label", skillTarget ? t("actionTarget", { action: t(hero.skillName), value: hero.atk + 2, target: t(skillTarget.name) }) : hero ? t("skillInfo", { skill: t(hero.skillName), desc: t(hero.skillDesc) }) : t("skill"));
    nodes.attackBtn.disabled = !canAct || !targets.length;
    nodes.guardBtn.disabled = !canAct;
    nodes.skillBtn.disabled = !canAct || hero.energy <= 0 || hero.silenced;
    nodes.endTurnBtn.disabled = state.phase !== "player";
  }

  function selectedHero() {
    return state?.heroes.find((h) => h.id === state.selected && h.hp > 0);
  }

  function livingHeroes() {
    return state.heroes.filter((h) => h.hp > 0);
  }

  function livingEnemies() {
    return state.enemies.filter((e) => e.hp > 0);
  }

  function unitAt(x, y) {
    return [...state.heroes, ...state.enemies].find((u) => u.hp > 0 && u.x === x && u.y === y);
  }

  function distance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  function validMoves() {
    const hero = selectedHero();
    if (!hero || state.acted.has(hero.id) || hero.snared) return [];
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    return dirs
      .map(([dx, dy]) => ({ x: hero.x + dx, y: hero.y + dy }))
      .filter((p) => canOccupy(p.x, p.y, hero));
  }

  function validTargets() {
    const hero = selectedHero();
    if (!hero || state.acted.has(hero.id)) return [];
    const range = hero.range || 1;
    return livingEnemies().filter((enemy) => distance(hero, enemy) <= range);
  }

  function onTile(x, y) {
    const unit = unitAt(x, y);
    if (unit?.team === "hero" && state.phase === "player") {
      state.selected = unit.id;
      render();
      return;
    }
    const hero = selectedHero();
    if (!hero || state.acted.has(hero.id)) return;
    if (unit?.team === "enemy" && validTargets().includes(unit)) {
      attack(hero, unit, false);
      return;
    }
    if (validMoves().some((p) => p.x === x && p.y === y)) {
      hero.x = x;
      hero.y = y;
      markActed(hero);
      applyHeroTerrain(hero);
      playFx("dust-burst", x, y);
      log("moved", { hero: t(hero.name) });
      render();
      checkEnd();
    }
  }

  function attack(hero, enemy, isSkill) {
    let damage = hero.atk + (isSkill ? 2 : 0);
    const blockedByStoneHide = (enemy.id === "stag" || enemy.id === "rhinoBoss") && enemy.armorReady;
    const blockedByAllyGuard = enemy.allyGuard;
    const blockedByFlight = enemy.id === "griffinBoss" && enemy.flying && (hero.range || 1) > 1;
    if (blockedByFlight) damage = 0;
    if (blockedByStoneHide) {
      damage = Math.max(1, damage - 1);
      enemy.armorReady = false;
    }
    if (blockedByAllyGuard) {
      damage = Math.max(0, damage - 2);
      enemy.allyGuard = false;
    }
    if (sealWardActive()) damage = Math.max(1, damage - 1);
    enemy.hp -= damage;
    enemy.hitsThisTurn = (enemy.hitsThisTurn || 0) + 1;
    markActed(hero);
    playFx(isSkill ? "rune-burst" : "attack-hit", enemy.x, enemy.y);
    log(blockedByStoneHide ? "stagArmorHit" : isSkill ? "skillUsed" : "attacked", { hero: t(hero.name), enemy: t(enemy.name) });
    if (enemy.hp <= 0) enemy.hp = 0;
    if (enemy.id === "boar" && enemy.hp > 0 && distance(hero, enemy) <= 1) {
      hero.hp = Math.max(0, hero.hp - 1);
      playFx("attack-hit", hero.x, hero.y);
      log("boarCounterHit", { hero: t(hero.name) });
      tryAutoRevive(hero);
    }
    resolveBossPhases(enemy);
    render();
    checkEnd();
  }

  function markActed(hero) {
    state.acted.add(hero.id);
    hero.guard = false;
    if (hero.snared) hero.snared = false;
    state.selected = hero.id;
  }

  function guard() {
    const hero = selectedHero();
    if (!hero || state.acted.has(hero.id)) return;
    hero.guard = true;
    markActed(hero);
    playFx("guard-shield", hero.x, hero.y);
    log("guarded", { hero: t(hero.name) });
    render();
    checkEnd();
  }

  function skill() {
    const hero = selectedHero();
    if (!hero || hero.energy <= 0 || state.acted.has(hero.id)) return;
    if (hero.silenced) {
      hero.silenced = false;
      log("silenceBlocked", { hero: t(hero.name) });
      render();
      return;
    }
    hero.energy -= 1;
    if (hero.id === "turtle") {
      livingHeroes().forEach((h) => {
        h.guard = true;
        h.hp = Math.min(h.maxHp, h.hp + 1);
      });
      markActed(hero);
      playFx("healing-swirl", hero.x, hero.y);
      log("skillUsed", { hero: t(hero.name) });
      render();
      checkEnd();
      return;
    }
    const target = validTargets()[0] || livingEnemies().sort((a, b) => distance(hero, a) - distance(hero, b))[0];
    if (target) attack(hero, target, true);
  }

  function endTurn() {
    if (!state || state.phase !== "player") return;
    clearTurnTransition();
    livingHeroes().forEach((hero) => { hero.silenced = false; });
    state.phase = "enemy";
    log("enemyTurn");
    render();
    scheduleTurnTransition(enemyTurn, 500);
  }

  function bossThresholds(enemy) {
    return enemy?.bossKit ? [0.7, 0.35] : [];
  }

  function addTerrain(x, y, type, extra = {}) {
    if (!insideBoard(x, y)) return false;
    const existing = terrainAt(x, y);
    if (existing) Object.assign(existing, { type, ...extra });
    else state.terrain.push({ x, y, type, ...extra });
    return true;
  }

  function firstFreeAdjacent(unit) {
    return [[-1,0],[1,0],[0,-1],[0,1]]
      .map(([dx, dy]) => ({ x: unit.x + dx, y: unit.y + dy }))
      .find((cell) => canOccupy(cell.x, cell.y));
  }

  function summonMirrorClone(source) {
    const cell = firstFreeAdjacent(source);
    if (!cell) return false;
    const base = enemyDefs.find((enemy) => enemy.id === "mirrorWolf");
    state.enemies.push({ ...base, uid: `mirror-clone-${state.turn}-${state.enemies.length}`, ...cell, hp: 1, maxHp: 1, atk: 1, team: "enemy", isClone: true, cloneMade: true, hitsThisTurn: 0, phasesTriggered: 0 });
    log("mirrorCloned");
    return true;
  }

  function damageHero(target, amount, enemy, key = null) {
    const markedBonus = target.marked && (enemy.range || 1) > 1 ? 1 : 0;
    if (markedBonus) target.marked = false;
    const damage = Math.max(1, amount + markedBonus - (target.guard ? 1 : 0));
    target.hp = Math.max(0, target.hp - damage);
    playFx("attack-hit", target.x, target.y);
    tryAutoRevive(target);
    if (key) log(key, { enemy: t(enemy.name), hero: t(target.name) });
    return damage;
  }

  function pushHeroAway(enemy, hero) {
    const dx = Math.sign(hero.x - enemy.x);
    const dy = Math.sign(hero.y - enemy.y);
    const candidates = Math.abs(hero.x - enemy.x) >= Math.abs(hero.y - enemy.y)
      ? [{ x: hero.x + dx, y: hero.y }, { x: hero.x, y: hero.y + dy }]
      : [{ x: hero.x, y: hero.y + dy }, { x: hero.x + dx, y: hero.y }];
    const cell = candidates.find((candidate) => (candidate.x !== hero.x || candidate.y !== hero.y) && canOccupy(candidate.x, candidate.y, hero));
    if (!cell) return false;
    hero.x = cell.x;
    hero.y = cell.y;
    applyHeroTerrain(hero);
    log("heronPushed", { hero: t(hero.name) });
    return true;
  }

  function chargeEnemy(enemy, target) {
    const aligned = enemy.x === target.x || enemy.y === target.y;
    if (!aligned) return false;
    const dx = Math.sign(target.x - enemy.x);
    const dy = Math.sign(target.y - enemy.y);
    let next = { x: enemy.x + dx, y: enemy.y + dy };
    while (insideBoard(next.x, next.y) && !(next.x === target.x && next.y === target.y) && canOccupy(next.x, next.y, enemy)) {
      enemy.x = next.x;
      enemy.y = next.y;
      next = { x: enemy.x + dx, y: enemy.y + dy };
    }
    if (distance(enemy, target) <= 1) damageHero(target, enemy.atk + 1, enemy, "ramCharged");
    return true;
  }

  function resolveBossPhases(enemy) {
    if (!enemy?.bossKit || enemy.hp <= 0) return;
    const thresholds = bossThresholds(enemy);
    while ((enemy.phasesTriggered || 0) < thresholds.length && enemy.hp / enemy.maxHp <= thresholds[enemy.phasesTriggered]) {
      enemy.phasesTriggered += 1;
      const phase = enemy.phasesTriggered;
      state.phaseEvents.push({ boss: enemy.id, phase, turn: state.turn });
      if (enemy.bossKit === "stag") {
        enemy.armorReady = true;
        livingHeroes().filter((hero) => hero.y === enemy.y).forEach((hero) => damageHero(hero, 1 + phase, enemy));
      } else if (enemy.bossKit === "rhino") {
        enemy.armorReady = true;
        const rubbleCell = [{x:1,y:enemy.y},{x:1,y:(enemy.y + phase) % rows}].find((cell) => canOccupy(cell.x, cell.y));
        if (rubbleCell) addTerrain(rubbleCell.x, rubbleCell.y, "rubble");
        livingHeroes().filter((hero) => hero.y === enemy.y).forEach((hero) => damageHero(hero, 1 + phase, enemy));
      } else if (enemy.bossKit === "serpent") {
        addTerrain(1, phase === 1 ? 1 : 2, "tide", { dx: 0, dy: phase === 1 ? 1 : -1 });
        livingHeroes().forEach((hero) => {
          const dx = Math.sign(enemy.x - hero.x);
          if (canOccupy(hero.x + dx, hero.y, hero)) hero.x += dx;
        });
        enemy.hp = Math.min(enemy.maxHp, enemy.hp + phase);
      } else if (enemy.bossKit === "emberLion") {
        const cell = firstFreeAdjacent(enemy);
        if (cell) addTerrain(cell.x, cell.y, "burn");
        livingHeroes().forEach((hero) => damageHero(hero, phase, enemy));
        if (phase === 2) enemy.extraActions = 1;
      } else if (enemy.bossKit === "griffin") {
        enemy.flying = phase === 2;
        if (!enemy.flying) livingHeroes().filter((hero) => hero.y === enemy.y).forEach((hero) => damageHero(hero, 2, enemy));
      } else if (enemy.bossKit === "chimera") {
        if (phase === 1) {
          addTerrain(1, 1, "tide", { dx: 0, dy: 1 });
          addTerrain(1, 2, "burn");
        } else {
          enemy.flying = true;
          summonMirrorClone(enemy);
          addTerrain(1, 0, "rubble");
        }
      }
      log("bossPhase", { boss: t(enemy.name), phase });
    }
  }

  function moveEnemyToward(enemy, target) {
    const old = { x: enemy.x, y: enemy.y };
    const dx = Math.sign(target.x - enemy.x);
    const dy = Math.sign(target.y - enemy.y);
    const options = [{ x: enemy.x + dx, y: enemy.y }, { x: enemy.x, y: enemy.y + dy }];
    const move = options.find((cell) => canOccupy(cell.x, cell.y, enemy));
    if (!move) return false;
    enemy.x = move.x;
    enemy.y = move.y;
    if (enemy.id === "salamander") addTerrain(old.x, old.y, "burn", { expires: state.turn + 1 });
    return true;
  }

  function chooseEnemyTarget(enemy) {
    const heroes = [...livingHeroes()];
    if (["raven", "runeFox", "sealRaven"].includes(enemy.id)) {
      return heroes.sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp) || distance(enemy, a) - distance(enemy, b))[0];
    }
    return heroes.sort((a, b) => distance(enemy, a) - distance(enemy, b))[0];
  }

  function performEnemyAction(enemy) {
    if (enemy.hp <= 0) return;
    if (enemy.id === "tideTurtle") {
      const ally = livingEnemies().filter((other) => other !== enemy).sort((a, b) => distance(enemy, a) - distance(enemy, b))[0];
      if (ally && !ally.allyGuard) {
        ally.allyGuard = true;
        log("turtleGuarded", { enemy: t(ally.name) });
        return;
      }
    }
    if (enemy.id === "mirrorWolf" && !enemy.cloneMade && !enemy.isClone) {
      enemy.cloneMade = true;
      if (summonMirrorClone(enemy)) return;
    }
    const target = chooseEnemyTarget(enemy);
    if (!target) return;
    if ((enemy.id === "ram" || enemy.id === "rhinoBoss") && chargeEnemy(enemy, target)) return;
    const range = enemy.range || 1;
    if (distance(enemy, target) <= range) {
      const packBonus = enemy.id === "wolf" && livingEnemies().some((other) => other !== enemy && other.id === "wolf" && distance(enemy, other) === 1);
      damageHero(target, enemy.atk + (packBonus ? 1 : 0), enemy, packBonus ? "wolfPackHit" : enemy.id === "raven" ? "ravenWeakHit" : null);
      if (enemy.id === "heron") pushHeroAway(enemy, target);
      if (enemy.id === "moth") { target.silenced = true; log("mothSilenced", { hero: t(target.name) }); }
      if (enemy.id === "archiveOwl") { target.marked = true; log("owlMarked", { hero: t(target.name) }); }
      if (enemy.id === "sealRaven") { target.energy = Math.max(0, target.energy - 1); log("ravenDrained", { hero: t(target.name) }); }
    } else {
      moveEnemyToward(enemy, target);
    }
    if (enemy.id === "runeFox" && target.hp > 0) {
      const candidates = [{ x: Math.max(0, target.x - 1), y: target.y }, { x: target.x, y: Math.min(rows - 1, target.y + 1) }];
      const cell = candidates.find((candidate) => canOccupy(candidate.x, candidate.y, enemy));
      if (cell) { enemy.x = cell.x; enemy.y = cell.y; log("foxTeleported", { hero: t(target.name) }); }
    }
  }

  function applyTideAndOrbit() {
    state.terrain.filter((terrain) => terrain.type === "tide").forEach((terrain) => {
      const unit = unitAt(terrain.x, terrain.y);
      if (!unit) return;
      const next = { x: unit.x + (terrain.dx || 0), y: unit.y + (terrain.dy || 0) };
      if (canOccupy(next.x, next.y, unit)) { unit.x = next.x; unit.y = next.y; }
    });
    const ring = [[0,0],[1,0],[2,0],[2,1],[2,2],[2,3],[1,3],[0,3],[0,2],[0,1]];
    if (!state.terrain.some((terrain) => terrain.type === "orbit")) return;
    const movers = ring.map(([x,y], index) => ({ unit: unitAt(x,y), from:{x,y}, to:{x:ring[(index + 1) % ring.length][0],y:ring[(index + 1) % ring.length][1]} })).filter((item) => item.unit);
    const movingUnits = new Set(movers.map((item) => item.unit));
    movers.forEach((item) => {
      const blocker = unitAt(item.to.x, item.to.y);
      if ((!blocker || movingUnits.has(blocker)) && !terrainAt(item.to.x, item.to.y, "rubble")) { item.unit.x = item.to.x; item.unit.y = item.to.y; }
    });
  }

  function enemyTurn() {
    if (!state || state.phase !== "enemy") return;
    [...livingEnemies()].forEach((enemy) => {
      performEnemyAction(enemy);
      if (enemy.extraActions > 0 && enemy.hp > 0) { enemy.extraActions -= 1; performEnemyAction(enemy); }
    });
    applyTideAndOrbit();
    livingHeroes().forEach((hero) => {
      if (terrainAt(hero.x, hero.y, "burn")) {
        hero.hp = Math.max(0, hero.hp - 1);
        tryAutoRevive(hero);
        log("terrainBurnHit", { hero: t(hero.name) });
      }
    });
    const serpent = livingEnemies().find((enemy) => enemy.id === "serpentBoss");
    if (serpent && serpent.hitsThisTurn < 2) serpent.hp = Math.min(serpent.maxHp, serpent.hp + 2);
    livingHeroes().forEach((h) => {
      h.guard = false;
      h.energy = Math.min(3, h.energy + 1);
    });
    livingEnemies().forEach((enemy) => {
      if (enemy.id === "stag") enemy.armorReady = true;
      enemy.hitsThisTurn = 0;
    });
    state.terrain = state.terrain.filter((terrain) => !terrain.expires || terrain.expires > state.turn);
    state.turn += 1;
    state.acted = new Set();
    state.phase = "player";
    state.selected = livingHeroes()[0]?.id || null;
    render();
    checkEnd();
  }

  function checkEnd() {
    if (!state) return false;
    if (!livingEnemies().length) {
      state.phase = "settling";
      scheduleTurnTransition(showReward, 450);
      return true;
    }
    if (!livingHeroes().length) {
      state.phase = "settling";
      scheduleTurnTransition(() => showResult(false), 450);
      return true;
    }
    if (state.phase === "player" && state.acted.size >= livingHeroes().length) scheduleTurnTransition(endTurn, 450);
    return false;
  }

  function showReward() {
    if (!state || livingEnemies().length) return;
    clearTurnTransition();
    playFx("mission-clear", 2, 1);
    setBattleCovered(true);
    nodes.rewardPanel.classList.remove("is-hidden");
    renderRewards(false);
  }

  function renderRewards(isReroll) {
    if (isReroll && !spendDiamonds(rerollCost)) {
      log("rerollNeed");
      return;
    }
    nodes.rerollBtn.disabled = isReroll || wallet().diamonds < rerollCost;
    const choices = shuffle([...rewardPool]).slice(0, 3);
    nodes.rewardCards.innerHTML = "";
    choices.forEach((reward) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "reward-card";
      btn.innerHTML = `<img src="${asset(reward.icon)}" alt="" /><b>${t("rewardPermanent")}</b><strong>${t(reward.title)}</strong><span>${t(reward.desc)}</span>`;
      btn.addEventListener("click", () => claimReward(reward.id));
      nodes.rewardCards.appendChild(btn);
    });
    requestAnimationFrame(() => nodes.rewardCards.querySelector(".reward-card")?.focus({ preventScroll: true }));
  }

  function claimReward(id) {
    claimedRewardId = id;
    if (id === "power") profile.bonusAtk = (profile.bonusAtk || 0) + 1;
    if (id === "guard") profile.bonusHp = (profile.bonusHp || 0) + 1;
    if (id === "shard") profile.xp += 35;
    if (id === "focus") profile.bonusEnergy = (profile.bonusEnergy || 0) + 1;
    if (id === "revive") profile.reviveTokens = (profile.reviveTokens || 0) + 1;
    showResult(true);
  }

  function tryAutoRevive(hero) {
    if (!hero || hero.hp > 0 || (profile.reviveTokens || 0) <= 0) return false;
    profile.reviveTokens -= 1;
    hero.hp = Math.max(1, Math.ceil(hero.maxHp / 2));
    saveProfile();
    playFx("healing-swirl", hero.x, hero.y);
    log("reviveTriggered", { hero: t(hero.name) });
    return true;
  }

  function showResult(win) {
    clearTurnTransition();
    nodes.rewardPanel.classList.add("is-hidden");
    nodes.gamePanel.classList.add("is-hidden");
    setBattleCovered(true);
    const missionDef = missionDefs.find((item) => item.id === state.mission) || missionDefs[0];
    const xp = win ? missionDef.xp : 12;
    const runes = win ? missionDef.runes : 3;
    profile.xp += xp;
    profile.runes = (profile.runes || 0) + runes;
    while (profile.xp >= 100) {
      profile.xp -= 100;
      profile.level += 1;
    }
    const previousUnlockedMission = profile.unlockedMission;
    if (win) {
      profile.bestMission = Math.max(profile.bestMission, state.mission);
      profile.unlockedMission = Math.max(profile.unlockedMission, Math.min(missionDefs.length, state.mission + 1));
      selectedMission = Math.min(missionDefs.length, state.mission + 1);
    }
    saveProfile();
    nodes.resultTitle.textContent = t(win ? "missionClear" : "missionFailed");
    nodes.resultText.textContent = t(win ? "resultWin" : "resultLose", { mission: state.mission, xp, runes });
    const claimedReward = rewardPool.find((reward) => reward.id === claimedRewardId);
    nodes.resultRewardText.textContent = claimedReward
      ? t("resultRewardChosen", { reward: t(claimedReward.title), effect: t(claimedReward.desc) })
      : t("resultRewardNone");
    nodes.resultProgressText.textContent = t("resultProgressLine", {
      level: profile.level,
      xp: profile.xp,
      runes: profile.runes || 0,
      best: profile.bestMission,
    });
    const heroLevels = profile.heroLevels || {};
    const nextHero = heroDefs
      .map((hero) => ({ hero, level: heroLevels[hero.id] || 1, cost: heroUpgradeCost(hero.id) }))
      .filter((item) => item.level < 6)
      .sort((a, b) => a.cost - b.cost)[0];
    const missionDirection = profile.unlockedMission >= missionDefs.length && state.mission >= missionDefs.length
      ? t("resultCampaignComplete")
      : win && profile.unlockedMission > previousUnlockedMission
        ? t("resultMissionUnlocked", { mission: profile.unlockedMission })
        : t("resultMissionReady", { mission: Math.min(profile.unlockedMission, state.mission) });
    const upgradeDirection = nextHero
      ? (profile.runes || 0) >= nextHero.cost
        ? t("resultUpgradeReady", { hero: t(nextHero.hero.name) })
        : t("resultUpgradeNeed", { hero: t(nextHero.hero.name), need: nextHero.cost - (profile.runes || 0) })
      : t("heroUpgradeMax");
    nodes.resultNextText.textContent = `${missionDirection} ${upgradeDirection}`;
    nodes.skillReportText.textContent = t(win ? "reportWin" : "reportLose");
    const hasNextMission = win && state.mission < missionDefs.length;
    nodes.nextBtn.disabled = !hasNextMission;
    nodes.nextBtn.classList.toggle("is-hidden", !hasNextMission);
    nodes.resultPanel.classList.remove("is-hidden");
    renderMenu();
    requestAnimationFrame(() => (nodes.nextBtn.disabled ? nodes.retryBtn : nodes.nextBtn).focus({ preventScroll: true }));
  }

  function playFx(name, x, y) {
    const fx = document.createElement("img");
    fx.className = "fx";
    fx.src = asset(`animal-rune-tactics-fx-${name}.webp`);
    fx.alt = "";
    fx.style.left = `${((x + 0.5) / cols) * 84 + 8}%`;
    fx.style.top = `${((y + 0.5) / rows) * 84 + 8}%`;
    nodes.fxLayer.appendChild(fx);
    setTimeout(() => fx.remove(), 620);
  }

  function log(key, vars) {
    nodes.battleLog.textContent = t(key, vars);
  }

  function shuffle(list) {
    return list.sort(() => Math.random() - 0.5);
  }

  function showMenu() {
    clearTurnTransition();
    state = null;
    document.body.classList.remove("is-rune-playing");
    nodes.backBtn.setAttribute("href", "/");
    nodes.backBtn.setAttribute("aria-label", t("backToLobby"));
    nodes.backBtn.setAttribute("data-wp-return", "main");
    const logo = document.createElement("img");
    logo.src = "../../assets/weightplay-logo.png";
    logo.alt = "";
    nodes.backBtn.replaceChildren(document.createTextNode("\u2190"), logo);
    nodes.gamePanel.classList.add("is-hidden");
    nodes.rewardPanel.classList.add("is-hidden");
    nodes.resultPanel.classList.add("is-hidden");
    setBattleCovered(false);
    nodes.menuPanel.classList.add("is-hidden");
    nodes.stagePanel.classList.remove("is-hidden");
    nodes.stageReserve.classList.remove("is-hidden");
    document.body.classList.add("wp-standard-stage-page");
    renderMenu();
    focusSelectedMission();
  }

  function installTestHooks() {
    if (!testMode) return;
    window.__AnimalRuneTacticsTest = {
      forceMissionClear() {
        if (!state) startMission(selectedMission);
        state.enemies.forEach((enemy) => {
          enemy.hp = 0;
        });
        showReward();
      },
      readProfile() {
        return { ...profile };
      },
      restoreProfile(snapshot) {
        const previous = localStorage.getItem(saveKey);
        localStorage.setItem(saveKey, JSON.stringify(snapshot || {}));
        profile = loadProfile();
        selectedMission = Math.min(profile.unlockedMission, MISSION_COUNT);
        saveProfile();
        renderMenu();
        return { previous, profile: { ...profile } };
      },
      campaignPreview() {
        return {
          missionCount: missionDefs.length,
          chapterCount: Math.ceil(missionDefs.length / CHAPTER_SIZE),
          missions: missionDefs.map((missionDef) => ({
            id: missionDef.id,
            chapter: missionDef.chapter,
            nameEn: missionDef.nameEn,
            nameZht: missionDef.nameZht,
            enemies: [...missionDef.enemies],
            terrain: missionDef.terrain.map((item) => ({ ...item })),
            bossId: missionDef.bossId,
          })),
          enemies: enemyDefs.map((enemy) => ({ id: enemy.id, trait: enemy.trait, bossKit: enemy.bossKit || null, img: enemy.img })),
          bosses: enemyDefs.filter((enemy) => enemy.bossKit).map((enemy) => ({ id: enemy.id, kit: enemy.bossKit, img: enemy.img })),
        };
      },
      readWallet() {
        return wallet();
      },
      readBattleState() {
        if (!state) return null;
        return {
          turn: state.turn,
          phase: state.phase,
          heroes: state.heroes.map(({ id, hp, maxHp, x, y, energy, guard, snared, silenced, marked }) => ({ id, hp, maxHp, x, y, energy, guard, snared, silenced, marked })),
          enemies: state.enemies.map(({ id, uid, hp, maxHp, x, y, armorReady, allyGuard, cloneMade, flying, phasesTriggered, hitsThisTurn }) => ({ id, uid, hp, maxHp, x, y, armorReady, allyGuard, cloneMade, flying, phasesTriggered, hitsThisTurn })),
          terrain: state.terrain.map((item) => ({ ...item })),
          phaseEvents: state.phaseEvents.map((item) => ({ ...item })),
        };
      },
      startMission(mission) {
        startMission(Math.max(1, Math.min(MISSION_COUNT, Number(mission) || 1)));
        return this.readBattleState();
      },
      setUnitState(team, index, patch) {
        const unit = state?.[team]?.[index];
        if (!unit || !patch || typeof patch !== "object") return false;
        Object.assign(unit, patch);
        render();
        return true;
      },
      runEnemyTurn() {
        if (!state) return false;
        state.phase = "enemy";
        enemyTurn();
        return true;
      },
      attackEnemy(index = 0) {
        const hero = selectedHero();
        const enemy = state?.enemies?.[index];
        if (!hero || !enemy || enemy.hp <= 0) return false;
        attack(hero, enemy, false);
        return true;
      },
      beginPlayerTurn(selected = state?.heroes?.find((hero) => hero.hp > 0)?.id) {
        if (!state) return false;
        state.phase = "player";
        state.acted = new Set();
        state.selected = selected || null;
        render();
        return true;
      },
      decisionPreview() {
        return {
          selected: state?.selected || null,
          moves: validMoves().map((cell) => ({ ...cell })),
          targets: validTargets().map((enemy) => enemy.uid || enemy.id),
          sealWardActive: sealWardActive(),
        };
      },
      moveSelectedTo(x, y) {
        if (!state) return false;
        const allowed = validMoves().some((cell) => cell.x === Number(x) && cell.y === Number(y));
        if (!allowed) return false;
        onTile(Number(x), Number(y));
        return true;
      },
      damageEnemy(index = 0, amount = 1) {
        const enemy = state?.enemies?.[index];
        if (!enemy) return null;
        enemy.hp = Math.max(0, enemy.hp - Math.max(0, Number(amount) || 0));
        resolveBossPhases(enemy);
        render();
        return this.readBattleState();
      },
      forceMissionResult(mission, win = true) {
        startMission(Math.max(1, Math.min(MISSION_COUNT, Number(mission) || 1)));
        claimedRewardId = null;
        showResult(Boolean(win));
        return { profile: { ...profile }, mission: state.mission, nextDisabled: nodes.nextBtn.disabled, nextHidden: nodes.nextBtn.classList.contains("is-hidden"), resultText: nodes.resultText.textContent, nextText: nodes.resultNextText.textContent };
      },
    };
  }

  function bind() {
    window.addEventListener("wonder:locale-change", () => requestAnimationFrame(localizeStrategyTips));
    nodes.mainStartBtn.addEventListener("click", showStage);
    nodes.stageBackBtn.addEventListener("click", showMainFromStage);
    nodes.backBtn.addEventListener("click", (event) => {
      if (!state) return;
      event.preventDefault();
      showMenu();
    });
    nodes.localeSelect.addEventListener("change", () => {
      locale = nodes.localeSelect.value;
      localStorage.setItem(localeKey, locale);
      window.WonderI18n?.setLocale?.(locale);
      applyLocale();
      window.dispatchEvent(new CustomEvent("wonder:locale-change", { detail: { locale } }));
    });
    nodes.trainingBtn.addEventListener("click", () => {
      if (profile.training) return;
      if (spendDiamonds(trainingCost)) {
        profile.training = true;
        saveProfile();
        renderMenu();
      }
    });
    nodes.heroUpgradeGrid?.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
    });
    nodes.heroUpgradeGrid?.addEventListener("click", (event) => {
      const id = event.target?.closest?.("[data-hero-upgrade]")?.dataset?.heroUpgrade;
      if (id) upgradeHero(id);
    });
    nodes.grid.addEventListener("keydown", (event) => {
      const tile = event.target.closest?.(".tile");
      if (tile && moveGridFocus(event.key, tile)) event.preventDefault();
    });
    nodes.attackBtn.addEventListener("click", () => {
      const hero = selectedHero();
      const target = validTargets()[0];
      if (hero && target) attack(hero, target, false);
    });
    nodes.guardBtn.addEventListener("click", guard);
    nodes.skillBtn.addEventListener("click", skill);
    nodes.endTurnBtn.addEventListener("click", endTurn);
    nodes.rerollBtn.addEventListener("click", () => renderRewards(true));
    nodes.rewardPanel.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
      keepDialogFocus(nodes.rewardPanel, event);
    });
    nodes.resultPanel.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
      keepDialogFocus(nodes.resultPanel, event);
    });
    nodes.nextBtn.addEventListener("click", () => {
      selectedMission = Math.min(missionDefs.length, state.mission + 1);
      startMission(selectedMission);
    });
    nodes.retryBtn.addEventListener("click", () => startMission(state?.mission || selectedMission));
    nodes.menuBtn.addEventListener("click", showMenu);
  }

  function boot() {
    installStandardStageFlow();
    bind();
    installTestHooks();
    let progress = 0;
    const timer = setInterval(() => {
      progress += 25;
      nodes.loadingFill.style.width = `${progress}%`;
      nodes.loadingText.textContent = `${progress}%`;
      if (progress >= 100) {
        clearInterval(timer);
        nodes.loadingPanel.classList.add("is-hidden");
        applyLocale();
      }
    }, 90);
  }

  boot();
})();
