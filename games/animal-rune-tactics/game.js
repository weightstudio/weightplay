(() => {
  const GAME_ID = "animal-rune-tactics";
  const saveKey = "weightplay_animal_rune_tactics_v1";
  const localeKey = "weightPlayLocale";
  const trainingCost = 18;
  const rerollCost = 3;
  const cols = 3;
  const rows = 4;
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
    resultCampaignComplete: "All six missions are unlocked. Replay to refine your squad.",
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
    resultCampaignComplete: "\u516d\u500b\u4efb\u52d9\u5df2\u5168\u90e8\u89e3\u9396\uff0c\u53ef\u91cd\u73a9\u4e26\u7cbe\u9032\u5c0f\u968a\u3002",
    resultUpgradeReady: "{hero} \u73fe\u5728\u53ef\u5728\u300c\u82f1\u96c4\u300d\u4e2d\u5347\u7d1a\u3002",
    resultUpgradeNeed: "{hero} \u518d\u9700 {need} \u679a\u7b26\u6587\u5373\u53ef\u5347\u7d1a\u3002",
  });
  Object.assign(text.en, {
    boardLabel: "Rune tactics board",
    strategyTips: [
      "Move the lion toward the front first so enemies focus on the tougher hero.",
      "Use the owl's ranged rune skill to finish enemies before they reach the back row.",
      "Guard with the turtle before dangerous enemy turns to keep the squad alive.",
      "Save Diamond rerolls for runs where all reward choices miss your current plan.",
    ],
  });
  Object.assign(text["zh-Hant"], {
    boardLabel: "\u7b26\u6587\u6230\u8853\u68cb\u76e4",
    strategyTips: [
      "\u5148\u8b93\u7345\u738b\u524d\u9032\uff0c\u5438\u5f15\u6575\u4eba\u653b\u64ca\u8f03\u8010\u6253\u7684\u82f1\u96c4\u3002",
      "\u7528\u8c93\u982d\u9df9\u7684\u9060\u7a0b\u7b26\u6587\u6280\u80fd\uff0c\u5728\u6575\u4eba\u62b5\u9054\u5f8c\u6392\u524d\u64ca\u6557\u5b83\u5011\u3002",
      "\u5728\u5371\u96aa\u7684\u6575\u65b9\u56de\u5408\u524d\u8b93\u70cf\u9f9c\u9632\u5b88\uff0c\u5e6b\u52a9\u5c0f\u968a\u7e7c\u7e8c\u4f5c\u6230\u3002",
      "\u7576\u6240\u6709\u734e\u52f5\u90fd\u4e0d\u9069\u5408\u7576\u524d\u6230\u8853\u6642\uff0c\u518d\u4f7f\u7528\u947d\u77f3\u91cd\u62bd\u3002",
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
    { id: "stag", name: "stag", img: "animal-rune-tactics-boss-stag.webp", hp: 10, atk: 3, trait: "traitStag" },
  ];

  const rewardPool = [
    { id: "power", icon: "animal-rune-tactics-reward-hero-equipment.webp", title: "rewardPower", desc: "rewardPowerDesc" },
    { id: "guard", icon: "animal-rune-tactics-reward-forest-medal.webp", title: "rewardGuard", desc: "rewardGuardDesc" },
    { id: "shard", icon: "animal-rune-tactics-reward-rune-shard.webp", title: "rewardShard", desc: "rewardShardDesc" },
    { id: "revive", icon: "animal-rune-tactics-reward-revive-token.webp", title: "rewardRevive", desc: "rewardReviveDesc" },
    { id: "focus", icon: "animal-rune-tactics-reward-training-slot.webp", title: "rewardFocus", desc: "rewardFocusDesc" },
  ];

  const missionDefs = [
    { id: 1, xp: 45, runes: 10, enemies: ["wolf", "wolf"], tactic: "missionTactic1" },
    { id: 2, xp: 65, runes: 14, enemies: ["wolf", "raven"], tactic: "missionTactic2" },
    { id: 3, xp: 90, runes: 18, enemies: ["wolf", "raven", "stag"], tactic: "missionTactic3" },
    { id: 4, xp: 115, runes: 22, enemies: ["raven", "raven", "stag"], tactic: "missionTactic4" },
    { id: 5, xp: 140, runes: 28, enemies: ["wolf", "wolf", "raven", "stag"], tactic: "missionTactic5" },
    { id: 6, xp: 170, runes: 34, enemies: ["raven", "raven", "stag", "stag"], tactic: "missionTactic6" },
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

  function loadProfile() {
    try {
      const parsed = JSON.parse(localStorage.getItem(saveKey) || "{}");
      return {
        ...defaultProfile(),
        ...parsed,
        heroLevels: { lion: 1, owl: 1, turtle: 1, ...(parsed.heroLevels || {}) },
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
      ? "免費 13+ 動物回合制戰棋遊戲。指揮獅王、貓頭鷹與烏龜，在符文戰場完成任務並保存本機進度。"
      : "Play Animal Rune Tactics, a free 13+ turn-based animal squad tactics game with rune grid battles, local progress, rewards, and optional diamond rerolls.";
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

  function renderMenu() {
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
      btn.innerHTML = `
        <span class="mission-card__top">
          <strong>${t("missionCard", { n: mission.id })}</strong>
          <b>${isLocked ? t("locked") : isActive ? t("missionStatusCurrent") : t("missionStatusUnlocked")}</b>
        </span>
        <small>${t("missionRewardLabel")}: ${isLocked ? t("locked") : t("missionReward", { xp: mission.xp, runes: mission.runes })}</small>
        <span>${t("missionGoal", { enemies: enemyNames })}</span>
        <em>${t("missionPlan", { plan: t(mission.tactic) })}<b class="mission-card__traits">${t("enemyTraits", { traits: traitNames })}</b></em>`;
      btn.addEventListener("click", () => {
        selectedMission = mission.id;
        startMission(selectedMission);
      });
      nodes.missionGrid.appendChild(btn);
    });
    scrollSelectedMissionIntoView();
  }

  function scrollSelectedMissionIntoView() {
    const active = nodes.missionGrid.querySelector(".mission-card.is-active");
    if (!active) return;
    requestAnimationFrame(() => {
      active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });
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
    renderMenu();
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
  }

  function showMainFromStage() {
    nodes.stagePanel.classList.add("is-hidden");
    nodes.stageReserve.classList.add("is-hidden");
    nodes.menuPanel.classList.remove("is-hidden");
    document.body.classList.remove("wp-standard-stage-page");
  }

  function startMission(mission = selectedMission) {
    claimedRewardId = null;
    const extraEnergy = (profile.training ? 1 : 0) + (profile.bonusEnergy || 0);
    const hpBonus = profile.bonusHp || 0;
    state = {
      mission,
      turn: 1,
      selected: "lion",
      acted: new Set(),
      phase: "player",
      rerolled: false,
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
      { x: 1, y: 3 },
    ];
    return missionDef.enemies.map((id, index) => {
      const base = enemyDefs.find((enemy) => enemy.id === id) || enemyDefs[0];
      const { x, y } = formation[index] || formation[formation.length - 1];
      const hp = base.hp + mission + Math.floor(mission / 2);
      return { ...base, x, y, maxHp: hp, hp, atk: base.atk + (mission >= 5 ? 1 : 0), armorReady: base.id === "stag", team: "enemy" };
    });
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
    nodes.skillBtn.disabled = !canAct || hero.energy <= 0;
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
    if (!hero || state.acted.has(hero.id)) return [];
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    return dirs
      .map(([dx, dy]) => ({ x: hero.x + dx, y: hero.y + dy }))
      .filter((p) => p.x >= 0 && p.x < cols && p.y >= 0 && p.y < rows && !unitAt(p.x, p.y));
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
      playFx("dust-burst", x, y);
      log("moved", { hero: t(hero.name) });
      render();
      checkEnd();
    }
  }

  function attack(hero, enemy, isSkill) {
    let damage = hero.atk + (isSkill ? 2 : 0);
    const blockedByStoneHide = enemy.id === "stag" && enemy.armorReady;
    if (blockedByStoneHide) {
      damage = Math.max(1, damage - 1);
      enemy.armorReady = false;
    }
    enemy.hp -= damage;
    markActed(hero);
    playFx(isSkill ? "rune-burst" : "attack-hit", enemy.x, enemy.y);
    log(blockedByStoneHide ? "stagArmorHit" : isSkill ? "skillUsed" : "attacked", { hero: t(hero.name), enemy: t(enemy.name) });
    if (enemy.hp <= 0) enemy.hp = 0;
    render();
    checkEnd();
  }

  function markActed(hero) {
    state.acted.add(hero.id);
    hero.guard = false;
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
    state.phase = "enemy";
    log("enemyTurn");
    render();
    setTimeout(enemyTurn, 500);
  }

  function enemyTurn() {
    livingEnemies().forEach((enemy) => {
      const heroes = livingHeroes();
      const target = enemy.id === "raven"
        ? heroes.sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp) || distance(enemy, a) - distance(enemy, b))[0]
        : heroes.sort((a, b) => distance(enemy, a) - distance(enemy, b))[0];
      if (!target) return;
      const range = enemy.range || 1;
      if (distance(enemy, target) <= range) {
        const packBonus = enemy.id === "wolf" && livingEnemies().some((other) => other !== enemy && other.id === "wolf" && distance(enemy, other) === 1);
        const damage = Math.max(1, enemy.atk + (packBonus ? 1 : 0) - (target.guard ? 1 : 0));
        target.hp = Math.max(0, target.hp - damage);
        playFx("attack-hit", target.x, target.y);
        tryAutoRevive(target);
        if (packBonus) log("wolfPackHit", { enemy: t(enemy.name) });
        if (enemy.id === "raven") log("ravenWeakHit", { enemy: t(enemy.name) });
      } else {
        const dx = Math.sign(target.x - enemy.x);
        const dy = Math.sign(target.y - enemy.y);
        const options = [{ x: enemy.x + dx, y: enemy.y }, { x: enemy.x, y: enemy.y + dy }];
        const move = options.find((p) => p.x >= 0 && p.x < cols && p.y >= 0 && p.y < rows && !unitAt(p.x, p.y));
        if (move) {
          enemy.x = move.x;
          enemy.y = move.y;
        }
      }
    });
    livingHeroes().forEach((h) => {
      h.guard = false;
      h.energy = Math.min(3, h.energy + 1);
    });
    livingEnemies().forEach((enemy) => {
      if (enemy.id === "stag") enemy.armorReady = true;
    });
    state.turn += 1;
    state.acted = new Set();
    state.phase = "player";
    state.selected = livingHeroes()[0]?.id || null;
    render();
    checkEnd();
  }

  function checkEnd() {
    if (!livingEnemies().length) {
      setTimeout(showReward, 450);
      return true;
    }
    if (!livingHeroes().length) {
      setTimeout(() => showResult(false), 450);
      return true;
    }
    if (state.acted.size >= livingHeroes().length) setTimeout(endTurn, 450);
    return false;
  }

  function showReward() {
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
    nodes.nextBtn.disabled = !win || state.mission >= missionDefs.length;
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
    focusPanel(nodes.menuPanel);
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
      readWallet() {
        return wallet();
      },
      readBattleState() {
        if (!state) return null;
        return {
          turn: state.turn,
          phase: state.phase,
          heroes: state.heroes.map(({ id, hp, maxHp, x, y }) => ({ id, hp, maxHp, x, y })),
          enemies: state.enemies.map(({ id, hp, maxHp, x, y, armorReady }) => ({ id, hp, maxHp, x, y, armorReady })),
        };
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
