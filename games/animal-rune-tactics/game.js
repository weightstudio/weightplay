(() => {
  const GAME_ID = "animal-rune-tactics";
  const saveKey = "weightplay_animal_rune_tactics_v1";
  const localeKey = "weightPlayLocale";
  function readStorage(key) { try { return localStorage.getItem(key); } catch { return null; } }
  function writeStorage(key, value) { try { localStorage.setItem(key, value); return true; } catch { return false; } }
  const trainingCost = 18;
  const rerollCost = 3;
  const cols = 3;
  const rows = 4;
  const MISSION_COUNT = 30;
  const CHAPTER_SIZE = 5;
  const testMode = new URLSearchParams(window.location.search).get("test") === "1";

  const $ = (id) => document.getElementById(id);
  document.querySelector(".rune-app")?.setAttribute("data-wp-canvas-max-width", "920");
  const asset = (name) => `../../assets/${name}`;
  const resultCard = document.querySelector("#resultPanel .overlay-card");
  if (resultCard && !resultCard.querySelector(".result-squad-art")) {
    const resultSquadArt = document.createElement("div");
    resultSquadArt.className = "result-squad-art";
    resultSquadArt.setAttribute("aria-hidden", "true");
    [
      ["result-clear-fx", "animal-rune-tactics-fx-mission-clear.webp"],
      ["result-hero result-hero-lion", "animal-rune-tactics-hero-lion.webp"],
      ["result-hero result-hero-owl", "animal-rune-tactics-hero-owl.webp"],
      ["result-hero result-hero-turtle", "animal-rune-tactics-hero-turtle.webp"],
    ].forEach(([className, source]) => {
      const image = document.createElement("img");
      image.className = className;
      image.src = asset(source);
      image.alt = "";
      image.decoding = "async";
      resultSquadArt.append(image);
    });
    resultCard.prepend(resultSquadArt);
  }
  const nodes = {
    localeSelect: $("localeSelect"),
    loadingPanel: $("loadingPanel"),
    loadingFill: $("loadingFill"),
    loadingText: $("loadingText"),
    menuPanel: $("menuPanel"),
    backBtn: $("backBtn"),
    gamePanel: $("gamePanel"),
    pauseBtn: $("pauseBtn"),
    pausePanel: $("pausePanel"),
    resumeBtn: $("resumeBtn"),
    pauseMenuBtn: $("pauseMenuBtn"),
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
      trainingConfirm: "Press again to unlock permanent +1 starting Energy. Diamonds {before} → {after}.",
      trainingConfirmAction: "Confirm permanent Training Slot. Diamonds {before} to {after}.",
      trainingPurchased: "Unlocked: +1 starting Energy. Diamonds {before} → {after}.",
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
      skillSquadResult: "{skill}: guard all heroes and heal up to 1 HP each.",
      skillEnergyChange: "Costs 1 Energy. Energy {energy} to {remaining}.",
      skillEnergyNeed: "Requires 1 Energy; current {energy}.",
      skillSilenced: "Unavailable while silenced.",
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
      trainingConfirm: "再按一次解鎖永久起始能量 +1。鑽石 {before} → {after}。",
      trainingConfirmAction: "確認永久訓練欄位。鑽石 {before} 到 {after}。",
      trainingPurchased: "已解鎖：起始能量 +1。鑽石 {before} → {after}。",
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
    trainingTitle: "訓練欄位", trainingText: "永久效果：英雄每場任務起始能量 +1。", trainingOwned: "已擁有：起始能量 +1。", trainingNeed: "需要 {cost} 顆鑽石。", trainingBuy: "解鎖 {cost}", trainingConfirm: "再按一次解鎖永久起始能量 +1。鑽石 {before} → {after}。", trainingConfirmAction: "確認永久訓練欄位。鑽石 {before} 到 {after}。", trainingPurchased: "已解鎖：起始能量 +1。鑽石 {before} → {after}。",
    startMission: "開始任務", mission: "任務", turn: "回合", wallet: "鑽石", enemiesLeft: "敵人", attack: "攻擊", guard: "防守", skill: "技能", endTurn: "結束回合", health: "生命", energy: "能量",
    chooseHero: "選擇一位英雄，再移動或攻擊。", chooseTarget: "{hero}：生命 {hp}/{maxHp}，能量 {energy}。", ready: "可行動", acted: "已行動", fallen: "倒下", turnRosterTitle: "小隊行動", skillInfo: "技能：{skill} - {desc}", skillInfoLabel: "技能",
    skillLion: "獅王撲擊", skillLionDesc: "對最近目標造成重擊。", skillOwl: "符文箭", skillOwlDesc: "以符文魔法攻擊較遠的目標。", skillTurtle: "甲殼守護", skillTurtleDesc: "守護全隊並回復 1 點生命。",
    attackValue: "攻擊 {value}", guardValue: "防守 -1", guardHelp: "下一次受到的敵方傷害減少 1 點。", skillValue: "技能 {value}", actionTarget: "對{target}使用{action}，造成 {value} 點傷害。",
    skillSquadResult: "{skill}：全隊進入防守，並各自最多回復 1 點生命。", skillEnergyChange: "消耗 1 點能量；能量 {energy} → {remaining}。", skillEnergyNeed: "需要 1 點能量；目前為 {energy}。", skillSilenced: "沉默期間無法使用。",
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
    chooseHero: "Choose a hero. Move once, then take one action.",
    pause: "Pause",
    pauseTitle: "Battle Paused",
    pauseHint: "The enemy turn and every pending action stay frozen until you continue.",
    resume: "Resume",
    pauseMenu: "Back to Missions",
  });
  Object.assign(text["zh-Hant"], {
    chooseHero: "選擇英雄：可先移動一次，再執行一個行動。",
    pause: "\u66ab\u505c",
    pauseTitle: "\u6230\u9b25\u5df2\u66ab\u505c",
    pauseHint: "\u6575\u65b9\u56de\u5408\u8207\u6240\u6709\u5f85\u8655\u7406\u52d5\u4f5c\u90fd\u6703\u51cd\u7d50\uff0c\u76f4\u5230\u4f60\u7e7c\u7e8c\u904a\u6232\u3002",
    resume: "\u7e7c\u7e8c",
    pauseMenu: "\u8fd4\u56de\u4efb\u52d9",
  });
  Object.assign(text.en, { battleDetails: "Battle details" });
  Object.assign(text["zh-Hant"], { battleDetails: "\u6230\u9b25\u8a73\u7d30\u8cc7\u8a0a" });
  text["zh-Hans"] = {
    battleDetails: "\u6218\u6597\u8be6\u7ec6\u4fe1\u606f",
    pauseHint: "\u654c\u65b9\u56de\u5408\u548c\u6240\u6709\u5f85\u5904\u7406\u52a8\u4f5c\u90fd\u4f1a\u6682\u505c，\u76f4\u5230\u4f60\u7ee7\u7eed\u6e38\u620f\u3002",
  };

  text.es = {
    title: "Tácticas de Runas Animales",
    language: "Idioma",
    backToLobby: "Volver al vestíbulo",
    backToMenu: "Volver a misiones",
    backToMain: "Volver al menú principal",
    startGame: "Comenzar juego",
    menuTitle: "Dirige al Escuadrón Rúnico.",
    menuHint: "Elige una misión, mueve héroes animales por la cuadrícula rúnica y derrota enemigos con una buena posición.",
    profileLevel: "Nivel",
    profileXp: "XP",
    profileBest: "Mejor misión",
    profileRunes: "Runas",
    heroTrainingTitle: "Entrenamiento de héroes",
    heroTrainingHint: "Gasta runas para mejorar permanentemente a cada héroe animal.",
    heroLevel: "Nv.{level}",
    heroUpgradeCost: "Mejorar {cost}",
    heroUpgradeMax: "Nivel máximo",
    lionRole: "Atacante frontal",
    owlRole: "Daño a larga distancia",
    turtleRole: "Protector del equipo",
    missionSelect: "Elegir misión",
    missionHint: "Las misiones desbloqueadas se guardan en este dispositivo.",
    missionCard: "Misión {n}",
    missionGoal: "Objetivo: derrota a {enemies}",
    missionReward: "{xp} XP / {runes} runas",
    missionEnemyLine: "Enemigos: {enemies}",
    locked: "Bloqueada",
    trainingTitle: "Espacio de entrenamiento",
    trainingText: "Permanente: los héroes empiezan cada misión con +1 de energía rúnica.",
    trainingOwned: "Obtenido: +1 de energía inicial.",
    trainingNeed: "Necesitas {cost} diamantes.",
    trainingBuy: "Desbloquear por {cost}",
    trainingConfirm: "Pulsa otra vez para obtener +1 de energía inicial permanente. Diamantes {before} → {after}.",
    trainingConfirmAction: "Confirmar espacio de entrenamiento permanente. Diamantes {before} a {after}.",
    trainingPurchased: "Obtenido: +1 de energía inicial. Diamantes {before} → {after}.",
    startMission: "Empezar misión",
    mission: "Misión",
    turn: "Turno",
    wallet: "Diamantes",
    enemiesLeft: "Enemigos",
    attack: "Atacar",
    guard: "Defender",
    skill: "Habilidad",
    endTurn: "Terminar turno",
    chooseHero: "Elige un héroe y después muévelo o ataca.",
    chooseTarget: "{hero}: PV {hp}/{maxHp}, energía {energy}.",
    ready: "Listo",
    acted: "Terminado",
    fallen: "Caído",
    turnRosterTitle: "Acciones del escuadrón",
    skillInfo: "Habilidad: {skill} - {desc}",
    skillInfoLabel: "Habilidad",
    skillLion: "Salto del León",
    skillLionDesc: "Inflige mucho daño al objetivo más cercano.",
    skillOwl: "Rayo Rúnico",
    skillOwlDesc: "Ataca desde más lejos con magia rúnica.",
    skillTurtle: "Protección del Caparazón",
    skillTurtleDesc: "Defiende a todo el escuadrón y cura 1 PV.",
    attackValue: "Ataque {value}",
    guardValue: "Defensa -1",
    guardHelp: "Reduce en 1 el próximo golpe enemigo.",
    skillValue: "Habilidad {value}",
    actionTarget: "{action}: {value} de daño a {target}.",
    skillSquadResult: "{skill}: defiende a todos los héroes y cura hasta 1 PV a cada uno.",
    skillEnergyChange: "Cuesta 1 de energía. Energía de {energy} a {remaining}.",
    skillEnergyNeed: "Necesita 1 de energía; actual: {energy}.",
    skillSilenced: "No disponible durante el silencio.",
    heroTileLabel: "{hero}, PV {hp}/{maxHp}, {status}, fila {row}, columna {column}.",
    enemyTileLabel: "{enemy}, PV {hp}/{maxHp}, fila {row}, columna {column}.",
    moveTileLabel: "Mover a fila {row}, columna {column}.",
    emptyTileLabel: "Fila {row}, columna {column}.",
    moved: "{hero} se movió.",
    attacked: "{hero} atacó a {enemy}.",
    guarded: "{hero} se defendió.",
    skillUsed: "{hero} usó una habilidad rúnica.",
    enemyTurn: "Los enemigos se mueven.",
    chooseReward: "Elige un premio rúnico",
    reroll: "Cambiar 3",
    rerollNeed: "Necesitas 3 diamantes para cambiar premios.",
    missionClear: "Misión completada",
    missionFailed: "Misión fallida",
    resultWin: "Completaste la misión {mission}. Ganaste {xp} XP y {runes} runas.",
    resultLose: "El escuadrón cayó en la misión {mission}. Mantén a la Tortuga cerca del frente.",
    skillReport: "Informe de habilidades",
    reportWin: "Buena planificación: usaste posición, concentración de objetivos y premios para proteger al escuadrón.",
    reportLose: "Buena práctica: defiende antes del turno enemigo y concéntrate en una bestia cada vez.",
    nextMission: "Siguiente misión",
    retry: "Reintentar",
    menu: "Volver a misiones",
    lion: "León Guardián",
    owl: "Búho Mago",
    turtle: "Tortuga Escudo",
    wolf: "Lobo Sombrío",
    raven: "Cuervo de Cristal",
    stag: "Ciervo de Piedra",
    rewardPower: "Runa de Poder",
    rewardPowerDesc: "+1 al ataque de los héroes.",
    rewardGuard: "Medalla del Guardián",
    rewardGuardDesc: "+1 PV máximo para todos los héroes.",
    rewardShard: "Fragmento Rúnico",
    rewardShardDesc: "+35 XP después de la misión.",
    rewardRevive: "Ficha de Reanimación",
    rewardReviveDesc: "Guarda 1 ficha. Un héroe caído revive automáticamente en una batalla futura.",
    rewardFocus: "Runa de Concentración",
    rewardFocusDesc: "+1 de energía inicial en la próxima misión.",
    missionPlan: "Plan: {plan}",
    missionTactic1: "Aprende la posición básica contra dos lobos.",
    missionTactic2: "Protege al Búho de un Cuervo a distancia.",
    missionTactic3: "Concéntrate en el Ciervo jefe después de eliminar a sus guardias.",
    missionTactic4: "Usa la defensa de la Tortuga antes de que disparen dos Cuervos.",
    missionTactic5: "Batalla larga: administra energía y concentra objetivos.",
    missionTactic6: "Presión de jefe: sobrevive a dos Ciervos y al fuego del Cuervo.",
    missionStatusCurrent: "Elegida",
    missionStatusUnlocked: "Toca para elegir",
    missionRewardLabel: "Premio",
    startSelectedMission: "Empezar misión {n}",
    progressionTitle: "Crecimiento permanente",
    progressionLevelLine: "Escuadrón Nv.{level} / faltan {xp} XP para subir",
    progressionHeroLine: "Mejoras: León Nv.{lion}, Búho Nv.{owl}, Tortuga Nv.{turtle}",
    progressionBonusLine: "Bonos guardados: ATQ +{atk}, PV +{hp}, energía +{energy}, fichas {revives}",
    progressionNextUpgrade: "Siguiente mejora: {hero} necesita {cost} runas más.",
    heroGrowthStats: "Permanente: PV +{hp} / ATQ +{atk}",
    heroNextStats: "Siguiente Nv.{level}: PV +{hp} / ATQ +{atk}",
    heroUpgradeNeed: "Faltan {need} runas",
    heroUpgradeReady: "Mejora disponible",
    rewardPermanent: "Crecimiento permanente",
    reviveTriggered: "{hero} usó una ficha de reanimación y volvió a la batalla.",
    resultProgressTitle: "Progreso guardado"
  };
  Object.assign(text.es, {
    chooseHero: "Elige un héroe: muévete una vez y luego realiza una acción.",
    pause: "Pausar",
    pauseTitle: "Batalla en pausa",
    pauseHint: "El turno enemigo y todas las acciones pendientes quedan congelados hasta que continúes.",
    resume: "Continuar",
    pauseMenu: "Volver a misiones",
    resultRewardChosen: "Premio guardado: {reward} — {effect}",
    resultRewardNone: "No se guardó ningún premio rúnico en este intento.",
    resultProgressLine: "Escuadrón Nv.{level} · {xp}/100 XP · {runes} runas · Mejor misión {best}",
    resultMissionUnlocked: "Misión {mission} desbloqueada.",
    resultMissionReady: "La misión {mission} sigue disponible.",
    resultCampaignComplete: "Las 30 misiones están completas. Todas se pueden repetir.",
    resultUpgradeReady: "{hero} puede mejorar ahora en Héroes.",
    resultUpgradeNeed: "{hero} necesita {need} runas más para mejorar.",
    enemyTraits: "Rasgos: {traits}",
    traitWolf: "Colmillo de Manada",
    traitWolfShort: "Manada",
    traitWolfDesc: "+1 de daño junto a otro lobo.",
    traitRaven: "Vista de la Debilidad",
    traitRavenShort: "Caza",
    traitRavenDesc: "Ataca al héroe con menos salud.",
    traitStag: "Piel de Piedra",
    traitStagShort: "Armadura",
    traitStagDesc: "Reduce en 1 el primer golpe de cada turno del jugador.",
    wolfPackHit: "Colmillo de Manada: {enemy} infligió +1 de daño.",
    ravenWeakHit: "Vista de la Debilidad: {enemy} cazó al héroe más débil.",
    stagArmorHit: "Piel de Piedra redujo en 1 el daño de {hero}.",
    stageTabMissions: "Misiones",
    stageTabHeroes: "Héroes",
    stageTabTraining: "Entrenamiento",
    endTurnDecision: "Terminar turno. Aún hay {count} héroes listos: {heroes}. Los enemigos actuarán.",
    endTurnDecisionNone: "Terminar turno. Todos los héroes vivos actuaron. Los enemigos actuarán.",
    boar: "Jabalí Espinoso",
    runeFox: "Zorro Rúnico",
    tideTurtle: "Tortuga de Marea",
    heron: "Garza Reliquia",
    salamander: "Salamandra de Brasas",
    ram: "Carnero de Ceniza",
    moth: "Polilla Lunar",
    archiveOwl: "Búho del Archivo",
    mirrorWolf: "Lobo Espejo",
    sealRaven: "Cuervo del Sello",
    rhinoBoss: "Rinoceronte Raíz de Hierro",
    serpentBoss: "Serpiente Espiral del Pantano",
    emberLionBoss: "León Melena de Brasas",
    griffinBoss: "Grifo del Eclipse",
    chimeraBoss: "Quimera de la Corona Rúnica",
    traitBoar: "Contraataque Espinoso",
    traitBoarShort: "Contraataque",
    traitBoarDesc: "Devuelve 1 de daño tras un golpe de un héroe adyacente.",
    traitRuneFox: "Paso del Zorro",
    traitRuneFoxShort: "Salto",
    traitRuneFoxDesc: "Se teletransporta detrás del héroe más débil después de actuar.",
    traitTideTurtle: "Convoy del Caparazón",
    traitTideTurtleShort: "Guardia",
    traitTideTurtleDesc: "Da al aliado más cercano una defensa de un golpe.",
    traitHeron: "Ala de Corriente",
    traitHeronShort: "Empuje",
    traitHeronDesc: "Empuja al héroe golpeado una casilla legal.",
    traitSalamander: "Rastro de Brasas",
    traitSalamanderShort: "Quemadura",
    traitSalamanderDesc: "Deja una casilla ardiente después de moverse.",
    traitRam: "Línea del Carnero",
    traitRamShort: "Carga",
    traitRamDesc: "Carga en línea recta cuando ve a un héroe.",
    traitMoth: "Polvo Lunar",
    traitMothShort: "Silencio",
    traitMothDesc: "Su golpe desactiva la próxima habilidad del héroe.",
    traitArchiveOwl: "Marca del Vigía",
    traitArchiveOwlShort: "Marca",
    traitArchiveOwlDesc: "Marca a un héroe para que el próximo golpe a distancia inflija +1 de daño.",
    traitMirrorWolf: "División Espejo",
    traitMirrorWolfShort: "Clon",
    traitMirrorWolfDesc: "Crea un clon adyacente con 1 PV.",
    traitSealRaven: "Drenaje del Sello",
    traitSealRavenShort: "Drenaje",
    traitSealRavenDesc: "Drena 1 de energía al héroe golpeado.",
    traitRhinoBoss: "Carga Raíz de Hierro",
    traitRhinoBossShort: "Jefe",
    traitRhinoBossDesc: "Se prepara, carga una fila y deja escombros bloqueados.",
    traitSerpentBoss: "Espiral del Pantano",
    traitSerpentBossShort: "Jefe",
    traitSerpentBossDesc: "Inunda y atrae una columna; regenera si no recibe dos golpes en un turno.",
    traitEmberLionBoss: "Ciclo de Brasas",
    traitEmberLionBossShort: "Jefe",
    traitEmberLionBossDesc: "Alterna rugido, salto y acciones extra al quedar herido.",
    traitGriffinBoss: "Vuelo del Eclipse",
    traitGriffinBossShort: "Jefe",
    traitGriffinBossDesc: "Alterna inmunidad a distancia en vuelo y barridos en tierra.",
    traitChimeraBoss: "Corona Séxtuple",
    traitChimeraBossShort: "Final",
    traitChimeraBossDesc: "Alterna carga, inundación, fuego, vuelo y clones en fases visibles.",
    terrainRubble: "Escombros",
    terrainSnare: "Trampa de Raíces",
    terrainTide: "Marea",
    terrainBurn: "Quemadura",
    terrainCooling: "Runa Refrigerante",
    terrainOrbit: "Runa Orbital",
    terrainSeal: "Sello Rúnico",
    tileTerrainLabel: "{terrain}. {tile}",
    silenceBlocked: "El Polvo Lunar silenció la habilidad de {hero}.",
    terrainBurnHit: "La quemadura infligió 1 de daño a {hero}.",
    terrainCoolingUsed: "{hero} recuperó 1 de energía en una Runa Refrigerante.",
    boarCounterHit: "Contraataque Espinoso devolvió 1 de daño a {hero}.",
    turtleGuarded: "Convoy del Caparazón protegió a {enemy}.",
    heronPushed: "Ala de Corriente empujó a {hero}.",
    foxTeleported: "Paso del Zorro se movió detrás de {hero}.",
    ramCharged: "Línea del Carnero cargó contra {hero}.",
    mothSilenced: "Polvo Lunar silenció a {hero}.",
    owlMarked: "Marca del Vigía señaló a {hero}.",
    ravenDrained: "Drenaje del Sello quitó 1 de energía a {hero}.",
    mirrorCloned: "División Espejo creó un clon con 1 PV.",
    bossPhase: "{boss} entró en la fase {phase}.",
    boardLabel: "Tablero de tácticas rúnicas",
    strategyTips: [
      "Rompe la proximidad de los Lobos antes de intercambiar daño; un movimiento puede quitar Colmillo de Manada a dos ataques.",
      "Usa al Búho desde dos casillas para que el Jabalí no responda con un contraataque cuerpo a cuerpo.",
      "Un héroe silenciado aún puede moverse, atacar o defender; usa el turno para salir de una línea de carga.",
      "Golpea a la Serpiente con dos héroes distintos durante el mismo turno para detener su regeneración.",
      "Usa al León mientras el Grifo vuela y sepárate antes de su barrido terrestre.",
      "Elimina un clon de 1 PV antes de que bloquee el carril que necesitas.",
      "Trata las casillas Refrigerantes, de Sello y Orbitales como recursos; los atributos permanentes no sustituyen la posición."
    ]
  });
  Object.assign(text.en, {
    menu: "Back to Missions",
    endTurnDecision: "End turn. {count} heroes are still ready: {heroes}. Enemies will act next.",
    endTurnDecisionNone: "End turn. All living heroes have acted. Enemies will act next.",
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
    endTurnDecision: "結束回合。仍有 {count} 位英雄可行動：{heroes}。接著敵人將行動。",
    endTurnDecisionNone: "結束回合。所有存活英雄都已行動，接著敵人將行動。",
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

  Object.assign(text.en, {
    positioned: "Positioned",
    moveReady: "{hero} moved and can still act.",
    moveThenActHint: "Move once, then attack, guard, or use a Skill.",
    runeChain: "Rune Chain x{count}: +{bonus} damage!",
    runeChainHint: "Focus {enemy}: the next squad hit gains +{bonus} damage.",
    runeChainReady: "Start a Rune Chain by focusing one enemy.",
    battlePreview: "Mission Briefing",
    squadRule: "Squad rule",
  });
  Object.assign(text["zh-Hant"], {
    positioned: "已站位",
    moveReady: "{hero} 已移動，仍可行動。",
    moveThenActHint: "每回合可先移動一次，再攻擊、防守或使用技能。",
    runeChain: "符文連擊 x{count}：傷害 +{bonus}！",
    runeChainHint: "集火 {enemy}：小隊下一次命中傷害 +{bonus}。",
    runeChainReady: "集火同一名敵人可累積符文連擊。",
    battlePreview: "任務情報",
    squadRule: "小隊規則",
  });
  Object.assign(text.es, {
    positioned: "En posición",
    moveReady: "{hero} se movió y aún puede actuar.",
    moveThenActHint: "Muévete una vez y luego ataca, defiende o usa una habilidad.",
    runeChain: "Cadena rúnica x{count}: +{bonus} de daño.",
    runeChainHint: "Concentra el ataque en {enemy}: el siguiente golpe gana +{bonus} de daño.",
    runeChainReady: "Concentra ataques en un enemigo para crear una cadena rúnica.",
    battlePreview: "Informe de misión",
    squadRule: "Regla del escuadrón",
  });

  // Portuguese needs game-authored terminology here. The shared runtime
  // catalog provides broad fallback coverage, but generic word replacement
  // cannot distinguish a tactical Turn from the verb "turn", or Resume from
  // a résumé. Keep the core Battle, Pause, and accessibility language local.
  text["pt-BR"] = Object.assign({}, text.en, {
    title: "Táticas de Runas Animais",
    language: "Idioma",
    backToLobby: "Voltar ao lobby",
    backToMenu: "Voltar às missões",
    backToMain: "Voltar ao menu principal",
    startGame: "Iniciar jogo",
    menuTitle: "Comande o Esquadrão Rúnico.",
    menuHint: "Escolha uma missão, mova os heróis animais pelo tabuleiro rúnico e vença com bom posicionamento.",
    missionSelect: "Escolher missão",
    missionHint: "As missões desbloqueadas ficam salvas neste dispositivo.",
    missionCard: "Missão {n}",
    missionGoal: "Objetivo: derrotar {enemies}",
    missionReward: "{xp} XP / {runes} Runas",
    missionEnemyLine: "Inimigos: {enemies}",
    locked: "Bloqueada",
    startMission: "Iniciar missão",
    mission: "Missão",
    turn: "Turno",
    enemiesLeft: "Inimigos",
    attack: "Atacar",
    guard: "Defender",
    skill: "Habilidade",
    endTurn: "Fim do turno",
    chooseHero: "Escolha um herói. Mova uma vez e depois realize uma ação.",
    chooseTarget: "{hero}: Vida {hp}/{maxHp}, Energia {energy}.",
    ready: "Pronto",
    positioned: "Posicionado",
    acted: "Concluído",
    fallen: "Caído",
    turnRosterTitle: "Ações do esquadrão",
    health: "Vida",
    energy: "Energia",
    skillInfo: "Habilidade: {skill} — {desc}",
    skillInfoLabel: "Habilidade",
    skillLion: "Salto do Leão",
    skillLionDesc: "Causa muito dano ao alvo mais próximo.",
    skillOwl: "Raio Rúnico",
    skillOwlDesc: "Ataca de mais longe com magia rúnica.",
    skillTurtle: "Proteção do Casco",
    skillTurtleDesc: "Defende todo o esquadrão e recupera 1 ponto de Vida.",
    attackValue: "Ataque {value}",
    guardValue: "Defesa -1",
    guardHelp: "Reduz em 1 o dano do próximo ataque inimigo.",
    skillValue: "Habilidade {value}",
    actionTarget: "{action}: causa {value} de dano a {target}.",
    skillSquadResult: "{skill}: defende todos os heróis e recupera até 1 ponto de Vida de cada um.",
    skillEnergyChange: "Custa 1 de Energia. Energia: {energy} → {remaining}.",
    skillEnergyNeed: "Requer 1 de Energia; atual: {energy}.",
    skillSilenced: "Indisponível enquanto estiver silenciado.",
    heroTileLabel: "{hero}, Vida {hp}/{maxHp}, {status}, linha {row}, coluna {column}.",
    enemyTileLabel: "{enemy}, Vida {hp}/{maxHp}, linha {row}, coluna {column}.",
    moveTileLabel: "Mover para a linha {row}, coluna {column}.",
    emptyTileLabel: "Linha {row}, coluna {column}.",
    moved: "{hero} se moveu.",
    attacked: "{hero} atacou {enemy}.",
    guarded: "{hero} se defendeu.",
    skillUsed: "{hero} usou uma habilidade rúnica.",
    enemyTurn: "Os inimigos estão agindo.",
    pause: "Pausar",
    pauseTitle: "Batalha pausada",
    pauseHint: "O turno inimigo e todas as ações pendentes ficam congelados até você continuar.",
    resume: "Continuar",
    pauseMenu: "Voltar às missões",
    battleDetails: "Detalhes da batalha",
    boardLabel: "Tabuleiro de táticas rúnicas",
    endTurnDecision: "Encerrar o turno. {count} heróis ainda estão prontos: {heroes}. Os inimigos agirão em seguida.",
    endTurnDecisionNone: "Encerrar o turno. Todos os heróis vivos já agiram. Os inimigos agirão em seguida.",
    lion: "Leão Guardião",
    owl: "Coruja Maga",
    turtle: "Tartaruga Escudo",
    wolf: "Lobo Sombrio",
    raven: "Corvo de Cristal",
    stag: "Cervo de Pedra",
    boar: "Javali Espinhoso",
    runeFox: "Raposa Rúnica",
    tideTurtle: "Tartaruga da Maré",
    heron: "Garça Relíquia",
    salamander: "Salamandra de Brasa",
    ram: "Carneiro de Cinzas",
    moth: "Mariposa Lunar",
    archiveOwl: "Coruja do Arquivo",
    mirrorWolf: "Lobo Espelho",
    sealRaven: "Corvo do Selo",
    rhinoBoss: "Rinoceronte Raiz de Ferro",
    serpentBoss: "Serpente Espiral do Pântano",
    emberLionBoss: "Leão Juba de Brasa",
    griffinBoss: "Grifo do Eclipse",
    chimeraBoss: "Quimera da Coroa Rúnica",
    traitRaven: "Visão da Fraqueza",
    traitRavenShort: "Caçada",
    traitRavenDesc: "Ataca o herói com a menor proporção de PV.",
    traitStag: "Pele de Pedra",
    traitStagShort: "Armadura",
    traitStagDesc: "Reduz em 1 o primeiro dano de cada turno do jogador.",
    missionPlan: "Plano: {plan}",
    missionStatusCurrent: "Selecionada",
    missionStatusUnlocked: "Toque para escolher",
    missionRewardLabel: "Recompensa",
    startSelectedMission: "Iniciar missão {n}",
    enemyTraits: "Características: {traits}",
    moveReady: "{hero} se moveu e ainda pode agir.",
    moveThenActHint: "Mova uma vez e depois ataque, defenda ou use uma Habilidade.",
    runeChain: "Corrente Rúnica x{count}: +{bonus} de dano!",
    runeChainHint: "Concentre em {enemy}: o próximo golpe do esquadrão recebe +{bonus} de dano.",
    runeChainReady: "Concentre ataques em um inimigo para iniciar uma Corrente Rúnica.",
    battlePreview: "Resumo da missão",
    squadRule: "Regra do esquadrão",
    strategyTips: text.en.strategyTips.map(
      (tip) => window.WeightPlayGameRuntimeLocales?.["pt-BR"]?.[tip] || tip,
    ),
  });

  const heroDefs = [
    { id: "lion", name: "lion", role: "lionRole", img: "weightplay-boom-mane-lion.png", hp: 7, atk: 3, skillName: "skillLion", skillDesc: "skillLionDesc", skill: "animal-rune-tactics-skill-lion-strike.webp" },
    { id: "owl", name: "owl", role: "owlRole", img: "animal-rune-tactics-hero-owl.png", hp: 5, atk: 2, range: 2, skillName: "skillOwl", skillDesc: "skillOwlDesc", skill: "animal-rune-tactics-skill-owl-rune-bolt.webp" },
    { id: "turtle", name: "turtle", role: "turtleRole", img: "animal-rune-tactics-hero-turtle.png", hp: 9, atk: 1, skillName: "skillTurtle", skillDesc: "skillTurtleDesc", skill: "animal-rune-tactics-skill-turtle-guard.webp" },
  ];

  const enemyDefs = [
    { id: "wolf", name: "wolf", img: "animal-rune-tactics-enemy-wolf.png", hp: 5, atk: 2, trait: "traitWolf" },
    { id: "raven", name: "raven", img: "animal-rune-tactics-enemy-raven.png", hp: 4, atk: 2, range: 2, trait: "traitRaven" },
    { id: "stag", name: "stag", img: "animal-rune-tactics-boss-stag.png", hp: 12, atk: 3, trait: "traitStag", bossKit: "stag" },
    { id: "boar", name: "boar", img: "animal-gearpack-expedition-enemy-armored-boar.webp", hp: 7, atk: 2, trait: "traitBoar" },
    { id: "runeFox", name: "runeFox", img: "animal-gearpack-expedition-enemy-fox-scout.webp", hp: 5, atk: 2, trait: "traitRuneFox" },
    { id: "tideTurtle", name: "tideTurtle", img: "animal-rune-tactics-hero-turtle.png", hp: 8, atk: 1, trait: "traitTideTurtle" },
    { id: "heron", name: "heron", img: "animal-rune-tactics-enemy-raven.png", hp: 5, atk: 2, range: 2, trait: "traitHeron" },
    { id: "salamander", name: "salamander", img: "shadow-wolf-enemy-bat.webp", hp: 6, atk: 2, trait: "traitSalamander" },
    { id: "ram", name: "ram", img: "weightplay-character-gear-horn-rhino.png", hp: 8, atk: 3, trait: "traitRam" },
    { id: "moth", name: "moth", img: "weightplay-character-moon-cap-owl-cutout.webp", hp: 5, atk: 1, range: 2, trait: "traitMoth" },
    { id: "archiveOwl", name: "archiveOwl", img: "animal-auto-squad-boss-eclipse-archowl.webp", hp: 7, atk: 2, range: 2, trait: "traitArchiveOwl" },
    { id: "mirrorWolf", name: "mirrorWolf", img: "animal-crystal-survivor-shadow-fox-v2.webp", hp: 6, atk: 2, trait: "traitMirrorWolf" },
    { id: "sealRaven", name: "sealRaven", img: "animal-rune-tactics-enemy-raven.png", hp: 6, atk: 2, range: 2, trait: "traitSealRaven" },
    { id: "rhinoBoss", name: "rhinoBoss", img: "animal-rune-tactics-boss-ironroot-rhino.png", hp: 18, atk: 3, trait: "traitRhinoBoss", bossKit: "rhino" },
    { id: "serpentBoss", name: "serpentBoss", img: "animal-rune-tactics-boss-mirecoil-serpent.png", hp: 20, atk: 3, range: 2, trait: "traitSerpentBoss", bossKit: "serpent" },
    { id: "emberLionBoss", name: "emberLionBoss", img: "animal-rune-tactics-boss-embermane-lion.png", hp: 22, atk: 4, trait: "traitEmberLionBoss", bossKit: "emberLion" },
    { id: "griffinBoss", name: "griffinBoss", img: "animal-rune-tactics-boss-eclipse-griffin.png", hp: 24, atk: 4, range: 2, trait: "traitGriffinBoss", bossKit: "griffin" },
    { id: "chimeraBoss", name: "chimeraBoss", img: "animal-rune-tactics-boss-rune-crown-chimera.png", hp: 28, atk: 4, trait: "traitChimeraBoss", bossKit: "chimera" },
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
  const missionCopyEs = [
    ["Primeras Huellas", "Rompe la proximidad de los Lobos antes de concentrarte en un objetivo."],
    ["Línea de Visión del Cuervo", "Mantén al héroe más débil fuera del alcance del Cuervo."],
    ["Puente Rúnico Roto", "Elige una ruta alrededor de las casillas bloqueadas del puente."],
    ["Cruce de la Manada", "La Tortuga sostiene un carril mientras el León separa la manada."],
    ["Prueba del Cuerno de Piedra", "Rompe dos veces Piel de Piedra y esquiva la carga del jefe."],
    ["Dientes de Zarza", "Usa el alcance del Búho para evitar el Contraataque Espinoso."],
    ["Puerta del Paso del Zorro", "Protege al héroe más débil antes de que el Zorro llegue atrás."],
    ["Trampa de Raíces", "Cruza el centro sin dejar al héroe equivocado sobre una trampa."],
    ["Pinza de la Forja", "Elimina un flanco del Zorro antes de acercar al León al Jabalí."],
    ["Rinoceronte Raíz de Hierro", "Aleja su carga del centro antes de que los escombros cierren el tablero."],
    ["Escritura Inundada", "Prevé el movimiento de las casillas de Marea después del turno enemigo."],
    ["Convoy del Caparazón", "Quita la defensa de un golpe antes de atacar al aliado protegido."],
    ["Corriente de la Garza", "Deja casillas legales para que Ala de Corriente no aísle al Búho."],
    ["Formación Ahogada", "Decide entre romper la defensa y detener el empuje de la Garza."],
    ["Serpiente Espiral del Pantano", "Golpea con dos héroes cada turno para impedir su regeneración."],
    ["Huellas de Brasas", "Observa la casilla anterior de la Salamandra antes de avanzar."],
    ["Línea del Carnero", "Sal de su fila en vez de recibir toda la carga defendiendo."],
    ["Runas Refrigerantes", "Haz pasar a un héroe con poca energía por una Runa Refrigerante."],
    ["División de la Caldera", "Mantén una salida libre mientras las cargas separan al escuadrón."],
    ["León Melena de Brasas", "Lee el ciclo de rugido, salto y acción extra al quedar herido."],
    ["Polvo Lunar", "Usa una habilidad antes de que el Polvo Lunar silencie al héroe."],
    ["Atalaya del Vigía", "Mueve al héroe marcado antes del próximo golpe a distancia."],
    ["Runas Orbitales", "Prevé la rotación horaria del anillo exterior al final de la ronda."],
    ["Fuego Cruzado del Eclipse", "Ordena habilidades, movimiento y defensa antes de que coincidan silencio y marcas."],
    ["Grifo del Eclipse", "Usa cuerpo a cuerpo mientras vuela y sepárate antes de su barrido terrestre."],
    ["Manada Espejo", "Reserva una casilla adyacente o elimina de inmediato el clon de 1 PV."],
    ["Corte de Plumas Selladas", "Protege la energía mientras controlas la casilla libre del clon."],
    ["Cerraduras de Seis Runas", "Ocupa tres Sellos conectados para quitar la barrera enemiga."],
    ["Desafío de la Corona", "Responde a cinco mecánicas anteriores sin perder el control de la formación."],
    ["Quimera de la Corona Rúnica", "Adáptate cada vez que una fase visible cambie la regla del tablero."]
  ];
  missionDefs.forEach((definition, index) => {
    [definition.nameEs, definition.tacticEs] = missionCopyEs[index];
  });
  const missionCopyPt = [
    ["Primeiras Pegadas", "Separe os Lobos antes de concentrar os ataques em um alvo."],
    ["Linha de Visão do Corvo", "Mantenha o herói mais vulnerável fora do alcance do Corvo."],
    ["Ponte Rúnica Partida", "Escolha uma rota ao redor das casas bloqueadas da ponte."],
    ["Encruzilhada da Alcateia", "Use a Tartaruga para segurar uma rota enquanto o Leão divide a alcateia."],
    ["Prova do Chifre de Pedra", "Quebre a Pele de Pedra duas vezes e saia da rota de investida do chefe."],
    ["Dentes de Espinho", "Use o alcance da Coruja para evitar o Contra-ataque Espinhoso."],
    ["Portão da Raposa", "Proteja o herói mais vulnerável antes que a Raposa chegue à retaguarda."],
    ["Armadilha de Raízes", "Atravesse o centro sem deixar o herói errado sobre uma armadilha."],
    ["Pinça da Forja", "Elimine um flanco da Raposa antes de aproximar o Leão do Javali."],
    ["Rinoceronte Raiz de Ferro", "Afaste a investida do centro antes que os escombros fechem o tabuleiro."],
    ["Escrita Inundada", "Preveja o deslocamento das casas de Maré após o turno inimigo."],
    ["Comboio do Casco", "Remova a defesa de um golpe antes de atacar o aliado protegido."],
    ["Corrente da Garça", "Deixe casas livres para que a Garça não isole a Coruja."],
    ["Formação Submersa", "Escolha entre quebrar a defesa e impedir o empurrão da Garça."],
    ["Serpente Espiral do Pântano", "Acerte a Serpente com dois heróis no mesmo turno para impedir sua regeneração."],
    ["Pegadas de Brasa", "Observe a casa anterior da Salamandra antes de avançar."],
    ["Rota do Carneiro", "Saia da linha do Carneiro em vez de absorver toda a investida."],
    ["Runas de Resfriamento", "Leve um herói com pouca Energia até uma Runa de Resfriamento."],
    ["Divisão da Caldeira", "Mantenha uma saída livre enquanto as investidas separam o esquadrão."],
    ["Leão Juba de Brasa", "Leia o ciclo de rugido, salto e ação extra quando o chefe estiver ferido."],
    ["Poeira Lunar", "Use uma Habilidade antes que a Poeira Lunar silencie o herói."],
    ["Poleiro do Vigia", "Mova o herói marcado antes do próximo ataque à distância."],
    ["Runas Orbitais", "Preveja a rotação horária do anel externo no fim da rodada."],
    ["Fogo Cruzado do Eclipse", "Ordene Habilidades, movimento e defesa antes que silêncio e marcas se combinem."],
    ["Grifo do Eclipse", "Ataque corpo a corpo enquanto ele voa e separe o grupo antes da varredura no solo."],
    ["Alcateia Espelho", "Reserve uma casa adjacente ou destrua imediatamente o clone de 1 PV."],
    ["Corte das Penas Seladas", "Proteja a Energia enquanto controla a casa livre do clone."],
    ["Trancas das Seis Runas", "Ocupe três casas de Selo conectadas para remover a proteção inimiga."],
    ["Desafio da Coroa", "Responda a cinco mecânicas anteriores sem perder o controle da formação."],
    ["Quimera da Coroa Rúnica", "Adapte-se sempre que uma fase visível do chefe mudar a regra do tabuleiro."],
  ];
  missionDefs.forEach((definition, index) => {
    [definition.namePt, definition.tacticPt] = missionCopyPt[index];
  });

  Object.assign(text["pt-BR"], {
    profileLevel: "Nível",
    profileXp: "XP",
    profileBest: "Melhor missão",
    profileRunes: "Runas",
    heroTrainingTitle: "Treinamento de heróis",
    heroTrainingHint: "Use Runas para melhorar permanentemente seus heróis.",
    heroLevel: "Nv.{level}",
    heroUpgradeCost: "Melhorar por {cost}",
    heroUpgradeMax: "Nível máximo",
    lionRole: "Atacante da linha de frente",
    owlRole: "Atacante rúnica à distância",
    turtleRole: "Defensor e curador",
    trainingTitle: "Espaço de treinamento",
    trainingText: "Permanente: os heróis começam cada missão com +1 de Energia Rúnica.",
    trainingOwned: "Adquirido: +1 de Energia inicial.",
    trainingNeed: "São necessários {cost} Diamantes.",
    trainingBuy: "Desbloquear por {cost}",
    trainingConfirm: "Pressione novamente para confirmar +1 de Energia inicial permanente. Diamantes: {before} → {after}.",
    trainingConfirmAction: "Confirmar Espaço de Treinamento permanente. Diamantes: {before} → {after}.",
    trainingPurchased: "Desbloqueado: +1 de Energia inicial. Diamantes: {before} → {after}.",
    stageTabMissions: "Missões",
    stageTabHeroes: "Heróis",
    stageTabTraining: "Treinamento",
    progressionTitle: "Progresso permanente",
    progressionLevelLine: "Esquadrão Nv.{level} / faltam {xp} XP para o próximo nível",
    progressionHeroLine: "Melhorias: Leão Nv.{lion}, Coruja Nv.{owl}, Tartaruga Nv.{turtle}",
    progressionBonusLine: "Bônus salvos: Ataque +{atk}, Vida +{hp}, Energia +{energy}, Fichas de Reviver {revives}",
    progressionNextUpgrade: "Próxima melhoria: faltam {cost} Runas para {hero}.",
    heroGrowthStats: "Permanente: Vida +{hp} / Ataque +{atk}",
    heroNextStats: "Próximo Nv.{level}: Vida +{hp} / Ataque +{atk}",
    heroUpgradeNeed: "Faltam {need} Runas",
    heroUpgradeReady: "Melhoria disponível",
    rewardPermanent: "Progresso permanente",
    reviveTriggered: "{hero} usou uma Ficha de Reviver e voltou à batalha.",
    resultProgressTitle: "Progresso salvo",
    resultRewardChosen: "Recompensa salva: {reward} — {effect}",
    resultRewardNone: "Nenhuma recompensa rúnica foi salva nesta tentativa.",
    resultProgressLine: "Esquadrão Nv.{level} · {xp}/100 XP · {runes} Runas · Melhor missão {best}",
    resultMissionUnlocked: "Missão {mission} desbloqueada.",
    resultMissionReady: "A Missão {mission} continua disponível.",
    resultCampaignComplete: "Todas as 30 missões foram concluídas e continuam disponíveis para repetir.",
    resultUpgradeReady: "{hero} já pode ser melhorado na aba Heróis.",
    resultUpgradeNeed: "Faltam {need} Runas para melhorar {hero}.",
    traitWolf: "Presa da Alcateia",
    traitWolfShort: "Alcateia",
    traitWolfDesc: "+1 de dano enquanto estiver ao lado de outro Lobo.",
    traitRaven: "Visão da Fraqueza",
    traitRavenShort: "Caçada",
    traitRavenDesc: "Ataca o herói com a menor proporção de Vida.",
    traitStag: "Pele de Pedra",
    traitStagShort: "Armadura",
    traitStagDesc: "Reduz em 1 o primeiro dano de cada turno do jogador.",
    traitBoar: "Contra-ataque Espinhoso",
    traitBoarShort: "Contra-ataque",
    traitBoarDesc: "Devolve 1 de dano após sobreviver a um ataque corpo a corpo adjacente.",
    traitRuneFox: "Passo da Raposa",
    traitRuneFoxShort: "Salto",
    traitRuneFoxDesc: "Teleporta-se para trás do herói mais vulnerável após agir.",
    traitTideTurtle: "Comboio do Casco",
    traitTideTurtleShort: "Defesa",
    traitTideTurtleDesc: "Concede ao aliado mais próximo uma defesa contra um golpe.",
    traitHeron: "Asa da Corrente",
    traitHeronShort: "Empurrão",
    traitHeronDesc: "Empurra o herói atingido para uma casa livre.",
    traitSalamander: "Trilha de Brasas",
    traitSalamanderShort: "Queimadura",
    traitSalamanderDesc: "Deixa uma casa em chamas depois de se mover.",
    traitRam: "Investida em Linha",
    traitRamShort: "Investida",
    traitRamDesc: "Investe em linha reta quando avista um herói.",
    traitMoth: "Poeira Lunar",
    traitMothShort: "Silêncio",
    traitMothDesc: "O golpe impede a próxima Habilidade do herói.",
    traitArchiveOwl: "Marca do Observador",
    traitArchiveOwlShort: "Marca",
    traitArchiveOwlDesc: "Marca um herói; o próximo ataque à distância causa +1 de dano.",
    traitMirrorWolf: "Divisão Espelhada",
    traitMirrorWolfShort: "Clone",
    traitMirrorWolfDesc: "Cria um clone adjacente com 1 ponto de Vida.",
    traitSealRaven: "Dreno do Selo",
    traitSealRavenShort: "Dreno",
    traitSealRavenDesc: "Remove 1 de Energia do herói atingido.",
    traitRhinoBoss: "Investida Raiz de Ferro",
    traitRhinoBossShort: "Chefe",
    traitRhinoBossDesc: "Prepara-se, investe por uma linha e deixa escombros bloqueados.",
    traitSerpentBoss: "Espiral do Pântano",
    traitSerpentBossShort: "Chefe",
    traitSerpentBossDesc: "Inunda e puxa uma coluna; regenera-se se não receber dois golpes no mesmo turno.",
    traitEmberLionBoss: "Ciclo de Brasas",
    traitEmberLionBossShort: "Chefe",
    traitEmberLionBossDesc: "Alterna rugido, salto e uma ação extra quando ferido.",
    traitGriffinBoss: "Voo do Eclipse",
    traitGriffinBossShort: "Chefe",
    traitGriffinBossDesc: "Alterna entre imunidade à distância durante o voo e varreduras no solo.",
    traitChimeraBoss: "Coroa Sêxtupla",
    traitChimeraBossShort: "Final",
    traitChimeraBossDesc: "Alterna investida, maré, fogo, voo e invocações espelhadas em fases visíveis.",
    terrainRubble: "Escombros",
    terrainSnare: "Armadilha de Raízes",
    terrainTide: "Maré",
    terrainBurn: "Queimadura",
    terrainCooling: "Runa de Resfriamento",
    terrainOrbit: "Runa Orbital",
    terrainSeal: "Selo Rúnico",
    tileTerrainLabel: "{terrain}. {tile}",
    silenceBlocked: "A Poeira Lunar silenciou a Habilidade de {hero}.",
    terrainBurnHit: "A Queimadura causou 1 de dano a {hero}.",
    terrainCoolingUsed: "{hero} recuperou 1 de Energia em uma Runa de Resfriamento.",
    boarCounterHit: "O Contra-ataque Espinhoso devolveu 1 de dano a {hero}.",
    turtleGuarded: "O Comboio do Casco protegeu {enemy}.",
    heronPushed: "A Asa da Corrente empurrou {hero}.",
    foxTeleported: "O Passo da Raposa se moveu para trás de {hero}.",
    ramCharged: "A Investida em Linha atingiu {hero}.",
    mothSilenced: "A Poeira Lunar silenciou {hero}.",
    owlMarked: "A Marca do Observador escolheu {hero}.",
    ravenDrained: "O Dreno do Selo removeu 1 de Energia de {hero}.",
    mirrorCloned: "A Divisão Espelhada criou um clone com 1 ponto de Vida.",
    bossPhase: "{boss} entrou na fase {phase}.",
    boardLabel: "Tabuleiro de táticas rúnicas",
  });

  const routeLocale = ({
    en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", es: "es", ja: "ja", ko: "ko",
    "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru",
  })[location.pathname.split("/").filter(Boolean)[0]?.toLowerCase()];
  let locale = routeLocale || readStorage(localeKey) || window.WonderI18n?.actualLocale?.() || window.WonderI18n?.locale?.() || "en";

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
  let centeredMission = 1;
  let profile = loadProfile();
  let state = null;
  let claimedRewardId = null;
  let resultDecisionCommitted = false;
  let gridCursor = { x: 0, y: 0 };
  let turnTransitionTimer = 0;
  let turnTransitionTask = null;
  let turnTransitionDueAt = 0;
  let endTurnKeyboardFocusRequested = false;
  let trainingIntentPending = false;
  let trainingIntentTimer = 0;
  let trainingIntentDueAt = 0;
  let trainingIntentRemaining = 0;
  let trainingMessage = "";
  let trainingMessageTimer = 0;
  let battlePaused = false;
  let pauseFocusOwner = nodes.pauseBtn;
  let lifecycleSuspended = document.hidden;
  let renderedMovementMission = null;
  let movementAnimationActive = false;
  let movementAnimationTimer = 0;
  let lastMovementEvidence = [];

  function unitRenderKey(unit) {
    return `${unit.team}:${unit.uid || unit.id}`;
  }

  function resetMovementAnimationTracking() {
    clearTimeout(movementAnimationTimer);
    movementAnimationTimer = 0;
    movementAnimationActive = false;
    renderedMovementMission = null;
    nodes.grid.removeAttribute("aria-busy");
    nodes.grid.querySelectorAll("[data-unit-key]").forEach((unit) => unit.getAnimations().forEach((animation) => animation.cancel()));
  }

  function captureUnitRects() {
    return new Map([...nodes.grid.querySelectorAll("[data-unit-key]")].map((unit) => [unit.dataset.unitKey, unit.getBoundingClientRect()]));
  }

  function animateMovedUnits(previousRects) {
    clearTimeout(movementAnimationTimer);
    movementAnimationTimer = 0;
    lastMovementEvidence = [];
    if (!previousRects.size || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      movementAnimationActive = false;
      nodes.grid.removeAttribute("aria-busy");
      return 0;
    }
    nodes.grid.querySelectorAll("[data-unit-key]").forEach((unit) => {
      const previous = previousRects.get(unit.dataset.unitKey);
      if (!previous) return;
      const next = unit.getBoundingClientRect();
      const dx = previous.left - next.left;
      const dy = previous.top - next.top;
      if (Math.hypot(dx, dy) < 2) return;
      const distanceCells = Math.max(1, Math.round(Math.hypot(dx / Math.max(1, next.width), dy / Math.max(1, next.height))));
      const duration = Math.min(520, 260 + distanceCells * 70);
      unit.classList.add("is-moving");
      const animation = unit.animate([
        { transform: `translate(${dx}px, ${dy}px) scale(.94)`, offset: 0 },
        { transform: `translate(${dx * .38}px, ${dy * .38}px) scale(1.04)`, offset: .68 },
        { transform: "translate(0, 0) scale(1)", offset: 1 },
      ], { duration, easing: "cubic-bezier(.22,.78,.22,1)", fill: "both" });
      animation.finished.catch(() => {}).finally(() => unit.classList.remove("is-moving"));
      lastMovementEvidence.push({ key: unit.dataset.unitKey, dx, dy, duration });
    });
    movementAnimationActive = lastMovementEvidence.length > 0;
    if (movementAnimationActive) nodes.grid.setAttribute("aria-busy", "true");
    else nodes.grid.removeAttribute("aria-busy");
    if (movementAnimationActive) {
      const longest = Math.max(...lastMovementEvidence.map((item) => item.duration));
      movementAnimationTimer = window.setTimeout(() => {
        movementAnimationTimer = 0;
        movementAnimationActive = false;
        nodes.grid.removeAttribute("aria-busy");
        if (state && !nodes.gamePanel.classList.contains("is-hidden")) {
          render();
          if (endTurnKeyboardFocusRequested && state.phase === "player") {
            endTurnKeyboardFocusRequested = false;
            requestAnimationFrame(() => nodes.endTurnBtn.focus({ preventScroll: true }));
          }
        }
      }, longest + 20);
    }
    return lastMovementEvidence.length;
  }

  function clearTurnTransition() {
    clearTimeout(turnTransitionTimer);
    turnTransitionTimer = 0;
    turnTransitionTask = null;
    turnTransitionDueAt = 0;
  }

  function armTurnTransition() {
    if (!turnTransitionTask || turnTransitionTimer || lifecycleSuspended || document.hidden) return;
    const task = turnTransitionTask;
    turnTransitionDueAt = performance.now() + task.delay;
    turnTransitionTimer = window.setTimeout(() => {
      turnTransitionTimer = 0;
      turnTransitionDueAt = 0;
      if (document.hidden) {
        if (turnTransitionTask === task) task.delay = 0;
        return;
      }
      if (turnTransitionTask !== task) return;
      turnTransitionTask = null;
      task.callback();
    }, task.delay);
  }

  function scheduleTurnTransition(callback, delay) {
    clearTurnTransition();
    turnTransitionTask = { callback, delay };
    armTurnTransition();
  }

  function suspendTurnTransition() {
    if (turnTransitionTask && turnTransitionTimer) turnTransitionTask.delay = Math.max(0, turnTransitionDueAt - performance.now());
    clearTimeout(turnTransitionTimer);
    turnTransitionTimer = 0;
    turnTransitionDueAt = 0;
  }

  function resumeTurnTransition() {
    if (battlePaused || lifecycleSuspended) return;
    armTurnTransition();
  }

  function t(key, vars = {}) {
    const sourceLocale = locale === "zh-Hans" ? "zh-Hant" : locale;
    let value = text[locale]?.[key] || text[sourceLocale]?.[key] || text.en[key] || key;
    Object.entries(vars).forEach(([name, val]) => {
      value = value.replaceAll(`{${name}}`, val);
    });
    return locale === "zh-Hans" ? window.WonderI18n?.simplifyChineseText?.(value) || value : value;
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

  function setPauseActionAvailable(available) {
    nodes.pauseBtn.disabled = !available;
    nodes.pauseBtn.classList.toggle("is-hidden", !available);
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

  function closePause({ restoreFocus = true, resume = true } = {}) {
    if (!battlePaused) return;
    const focusOwner = pauseFocusOwner?.isConnected ? pauseFocusOwner : nodes.pauseBtn;
    battlePaused = false;
    nodes.pausePanel.classList.add("is-hidden");
    nodes.pauseBtn.setAttribute("aria-expanded", "false");
    nodes.backBtn.setAttribute("aria-expanded", "false");
    setPauseActionAvailable(true);
    setBattleCovered(false);
    if (resume) resumeTurnTransition();
    pauseFocusOwner = nodes.pauseBtn;
    if (restoreFocus) requestAnimationFrame(() => focusOwner.focus({ preventScroll: true }));
  }

  function openPause(focusOwner = nodes.pauseBtn) {
    if (!state || state.phase === "reward" || battlePaused || !nodes.rewardPanel.classList.contains("is-hidden") || !nodes.resultPanel.classList.contains("is-hidden")) return;
    pauseFocusOwner = focusOwner?.isConnected ? focusOwner : nodes.pauseBtn;
    battlePaused = true;
    suspendTurnTransition();
    setBattleCovered(true);
    nodes.pausePanel.classList.remove("is-hidden");
    nodes.pauseBtn.setAttribute("aria-expanded", "true");
    nodes.backBtn.setAttribute("aria-expanded", "true");
    setPauseActionAvailable(false);
    requestAnimationFrame(() => nodes.resumeBtn.focus({ preventScroll: true }));
  }

  function leavePauseForMissions() {
    closePause({ restoreFocus: false, resume: false });
    showMenu();
  }

  function loadProfile() {
    try {
      const parsed = JSON.parse(readStorage(saveKey) || "{}");
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
    return writeStorage(saveKey, JSON.stringify(profile));
  }

  function wallet() {
    return window.WeightPlayWallet?.read?.() || { diamonds: 0 };
  }

  function spendDiamonds(cost) {
    return window.WeightPlayWallet?.spendDiamonds?.(cost) || false;
  }

  function applyLocale() {
    document.documentElement.lang = locale;
    document.title = `${t("title")} - WeightPlay`;
    const chineseDescription = "指揮獅王、貓頭鷹與烏龜完成 30 個回合制戰棋任務，破解符文地形、特殊敵人與六位階段首領，並保存本機成長。";
    const description = locale === "zh-Hans"
      ? window.WonderI18n?.simplifyChineseText?.(chineseDescription) || chineseDescription
      : locale === "zh-Hant"
        ? chineseDescription
        : locale === "es"
          ? "Dirige a tres héroes animales en 30 misiones rúnicas con terreno, enemigos especiales, seis jefes por fases y mejoras permanentes."
          : locale === "pt-BR"
            ? "Comande três heróis animais em 30 missões rúnicas com terrenos, inimigos especiais, seis chefes em fases e melhorias permanentes."
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
    nodes.pauseBtn.setAttribute("aria-label", t("pause"));
    nodes.grid.setAttribute("aria-label", t("boardLabel"));
    document.querySelector(".battle-secondary")?.setAttribute("aria-label", t("battleDetails"));
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
    const sourceLocale = locale === "zh-Hans" ? "zh-Hant" : locale;
    const tips = text[sourceLocale]?.strategyTips || text.en.strategyTips;
    document.querySelectorAll(".game-info-strategy li").forEach((item, index) => {
      if (tips[index]) item.textContent = locale === "zh-Hans" ? window.WonderI18n?.simplifyChineseText?.(tips[index]) || tips[index] : tips[index];
    });
  }

  function resetTrainingIntent({ clearMessage = true } = {}) {
    trainingIntentPending = false;
    trainingIntentRemaining = 0;
    trainingIntentDueAt = 0;
    window.clearTimeout(trainingIntentTimer);
    trainingIntentTimer = 0;
    window.clearTimeout(trainingMessageTimer);
    trainingMessageTimer = 0;
    if (clearMessage) trainingMessage = "";
  }

  function armTrainingIntent(delay = trainingIntentRemaining) {
    if (!trainingIntentPending || trainingIntentTimer || lifecycleSuspended || document.hidden) return;
    trainingIntentRemaining = Math.max(0, Number(delay) || 0);
    trainingIntentDueAt = performance.now() + trainingIntentRemaining;
    trainingIntentTimer = window.setTimeout(() => {
      trainingIntentTimer = 0;
      trainingIntentDueAt = 0;
      resetTrainingIntent();
      renderTrainingChoice();
    }, trainingIntentRemaining);
  }

  function suspendTrainingIntent() {
    if (!trainingIntentPending || !trainingIntentTimer) return;
    trainingIntentRemaining = Math.max(0, trainingIntentDueAt - performance.now());
    window.clearTimeout(trainingIntentTimer);
    trainingIntentTimer = 0;
    trainingIntentDueAt = 0;
  }

  function resumeTrainingIntent() {
    if (!trainingIntentPending || trainingIntentTimer || lifecycleSuspended || document.hidden) return;
    armTrainingIntent();
  }

  function suspendAppLifecycle() {
    lifecycleSuspended = true;
    suspendTurnTransition();
    suspendTrainingIntent();
  }

  function resumeAppLifecycle() {
    if (document.hidden || !document.hasFocus()) return;
    lifecycleSuspended = false;
    resumeTurnTransition();
    resumeTrainingIntent();
  }

  function resumeAppLifecycleFromTrustedInput(event) {
    if (!event.isTrusted || document.hidden || !lifecycleSuspended) return;
    lifecycleSuspended = false;
    resumeTurnTransition();
    resumeTrainingIntent();
  }

  function renderTrainingChoice() {
    const balance = Number(wallet().diamonds) || 0;
    nodes.trainingBtn.disabled = profile.training || balance < trainingCost;
    nodes.trainingStatus.textContent = trainingMessage || (profile.training
      ? t("trainingOwned")
      : balance < trainingCost
        ? t("trainingNeed", { cost: trainingCost })
        : "");
    nodes.trainingBtn.setAttribute("aria-label", trainingIntentPending
      ? t("trainingConfirmAction", { before: balance, after: balance - trainingCost })
      : profile.training
        ? t("trainingOwned")
        : t("trainingBuy", { cost: trainingCost }));
  }

  function activateTraining() {
    if (profile.training) return;
    const before = Number(wallet().diamonds) || 0;
    if (before < trainingCost) {
      resetTrainingIntent();
      renderTrainingChoice();
      return;
    }
    if (!trainingIntentPending) {
      trainingIntentPending = true;
      trainingIntentRemaining = 5000;
      trainingMessage = t("trainingConfirm", { before, after: before - trainingCost });
      renderTrainingChoice();
      armTrainingIntent();
      return;
    }
    resetTrainingIntent({ clearMessage: false });
    if (!spendDiamonds(trainingCost)) {
      trainingMessage = "";
      renderTrainingChoice();
      return;
    }
    const after = Number(wallet().diamonds) || 0;
    profile.training = true;
    saveProfile();
    trainingMessage = t("trainingPurchased", { before, after });
    renderMenu();
    trainingMessageTimer = window.setTimeout(() => {
      trainingMessage = "";
      renderTrainingChoice();
    }, 5000);
    requestAnimationFrame(() => nodes.stagePanel?.querySelector('[data-rune-stage-tab="training"]')?.focus({ preventScroll: true }));
  }

  function renderMenu(focusHeroId = null) {
    nodes.profileLevel.textContent = profile.level;
    nodes.profileXp.textContent = `${profile.xp}/100`;
    nodes.profileBest.textContent = profile.bestMission;
    nodes.profileRunes.textContent = profile.runes || 0;
    renderGrowthSummary();
    renderTrainingChoice();
    renderHeroUpgrades();
    nodes.missionGrid.innerHTML = "";
    missionDefs.forEach((mission) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.missionId = String(mission.id);
      const isLocked = mission.id > profile.unlockedMission;
      const isActive = selectedMission === mission.id;
      const isCentered = centeredMission === mission.id;
      btn.className = `mission-card ${isActive ? "is-active" : ""} ${isCentered ? "is-centered" : ""}`;
      btn.dataset.stageIndex = String(mission.id - 1);
      btn.dataset.wpStageCentered = String(isCentered);
      btn.disabled = isLocked;
      btn.setAttribute("aria-pressed", String(isActive));
      if (isCentered) btn.setAttribute("aria-current", "true");
      const enemyNames = mission.enemies.map((id) => t(enemyDefs.find((enemy) => enemy.id === id)?.name || id)).join(" / ");
      const traitNames = [...new Set(mission.enemies.map((id) => enemyDefs.find((enemy) => enemy.id === id)?.trait).filter(Boolean))]
        .map((key) => t(key))
        .join(" / ");
      const missionNameSource = locale === "zh-Hant" || locale === "zh-Hans" ? mission.nameZht : locale === "es" ? mission.nameEs : locale === "pt-BR" ? mission.namePt : mission.nameEn;
      const missionTacticSource = locale === "zh-Hant" || locale === "zh-Hans" ? mission.tacticZht : locale === "es" ? mission.tacticEs : locale === "pt-BR" ? mission.tacticPt : mission.tacticEn;
      const missionName = locale === "zh-Hans" ? window.WonderI18n?.simplifyChineseText?.(missionNameSource) || missionNameSource : missionNameSource;
      const missionTactic = locale === "zh-Hans" ? window.WonderI18n?.simplifyChineseText?.(missionTacticSource) || missionTacticSource : missionTacticSource;
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
    renderMissionBriefing();
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

  function setCenteredMission(missionId) {
    const nextMission = Math.max(1, Math.min(MISSION_COUNT, Number(missionId) || selectedMission));
    centeredMission = nextMission;
    nodes.missionGrid.querySelectorAll(".mission-card").forEach((card) => {
      const isCentered = Number(card.dataset.missionId) === centeredMission;
      card.classList.toggle("is-centered", isCentered);
      card.dataset.wpStageCentered = String(isCentered);
      if (isCentered) card.setAttribute("aria-current", "true");
      else card.removeAttribute("aria-current");
    });
    renderMissionBriefing();
  }

  function renderMissionBriefing() {
    if (!nodes.missionBriefing) return;
    const mission = missionDefs.find((item) => item.id === centeredMission) || missionDefs[0];
    const missionNameSource = locale === "zh-Hant" || locale === "zh-Hans" ? mission.nameZht : locale === "es" ? mission.nameEs : locale === "pt-BR" ? mission.namePt : mission.nameEn;
    const missionTacticSource = locale === "zh-Hant" || locale === "zh-Hans" ? mission.tacticZht : locale === "es" ? mission.tacticEs : locale === "pt-BR" ? mission.tacticPt : mission.tacticEn;
    const missionName = locale === "zh-Hans" ? window.WonderI18n?.simplifyChineseText?.(missionNameSource) || missionNameSource : missionNameSource;
    const missionTactic = locale === "zh-Hans" ? window.WonderI18n?.simplifyChineseText?.(missionTacticSource) || missionTacticSource : missionTacticSource;
    const enemies = mission.enemies.map((id) => {
      const enemy = enemyDefs.find((item) => item.id === id) || enemyDefs[0];
      return `<span class="mission-briefing__enemy"><img src="${asset(enemy.img)}" alt="" /><b>${t(enemy.name)}</b><small>${t(`${enemy.trait}Short`)}</small></span>`;
    }).join("");
    nodes.missionBriefing.innerHTML = `
      <div class="mission-briefing__head"><strong>${t("battlePreview")}</strong><em>${t("missionCard", { n: mission.id })} · ${missionName}</em></div>
      <div class="mission-briefing__enemies">${enemies}</div>
      <p><b>${t("squadRule")}</b>${t("moveThenActHint")} ${t("runeChainReady")}</p>
      <p>${missionTactic}</p>`;
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
    const profileGrid = menuCopy.querySelector(".profile-grid");
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
    stagePanel.dataset.wpCanvasMaxWidth = "920";
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
    missionList.querySelector(":scope > .section-head")?.remove();
    stagePanel.querySelector('[data-rune-stage-view="missions"]').append(missionList);
    const missionBriefing = document.createElement("section");
    missionBriefing.className = "mission-briefing";
    missionBriefing.setAttribute("aria-live", "polite");
    missionList.append(missionBriefing);
    stagePanel.querySelector('[data-rune-stage-view="heroes"]').append(profileGrid, nodes.growthSummary, heroList);
    stagePanel.querySelector('[data-rune-stage-view="training"]').append(diamondCard);
    nodes.menuPanel.after(stagePanel);
    Object.assign(nodes, { stagePanel, mainStartBtn: mainStart, stageBackBtn: stagePanel.querySelector("#stageBackBtn"), missionBriefing });
    nodes.missionGrid.addEventListener("wonder:stage-snap", (event) => {
      setCenteredMission(Number(event.detail?.index) + 1);
    });
    stagePanel.querySelectorAll("[data-rune-stage-tab]").forEach((button) => button.addEventListener("click", () => {
      const tab = button.dataset.runeStageTab;
      if (tab !== "training") resetTrainingIntent();
      stagePanel.querySelectorAll("[data-rune-stage-tab]").forEach((item) => item.classList.toggle("is-active", item === button));
      stagePanel.querySelectorAll("[data-rune-stage-view]").forEach((view) => view.classList.toggle("is-active", view.dataset.runeStageView === tab));
    }));
  }

  function showStage() {
    resetTrainingIntent();
    selectedMission = Math.min(profile.unlockedMission, MISSION_COUNT);
    centeredMission = selectedMission;
    nodes.menuPanel.classList.add("is-hidden");
    nodes.stagePanel.classList.remove("is-hidden");
    document.body.classList.add("wp-standard-stage-page");
    renderMenu();
    focusSelectedMission();
  }

  function showMainFromStage() {
    resetTrainingIntent();
    nodes.stagePanel.classList.add("is-hidden");
    nodes.menuPanel.classList.remove("is-hidden");
    document.body.classList.remove("wp-standard-stage-page");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      nodes.mainStartBtn.focus({ preventScroll: true });
    }));
  }

  function startMission(mission = selectedMission) {
    resetTrainingIntent();
    clearTurnTransition();
    endTurnKeyboardFocusRequested = false;
    claimedRewardId = null;
    const extraEnergy = (profile.training ? 1 : 0) + (profile.bonusEnergy || 0);
    const hpBonus = profile.bonusHp || 0;
    const missionDef = missionDefs.find((item) => item.id === mission) || missionDefs[0];
    resetMovementAnimationTracking();
    state = {
      mission,
      missionDef,
      turn: 1,
      selected: "lion",
      acted: new Set(),
      moved: new Set(),
      chainTarget: null,
      chainCount: 0,
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
    document.body.classList.remove("wp-standard-stage-page");
    document.body.classList.add("is-rune-playing");
    nodes.backBtn.setAttribute("href", "#stage");
    nodes.backBtn.setAttribute("aria-label", t("backToMenu"));
    nodes.backBtn.setAttribute("data-wp-return", "battle");
    nodes.backBtn.setAttribute("aria-controls", "pausePanel");
    nodes.backBtn.setAttribute("aria-expanded", "false");
    nodes.backBtn.replaceChildren(document.createTextNode("\u2190"));
    nodes.resultPanel.classList.add("is-hidden");
    nodes.rewardPanel.classList.add("is-hidden");
    nodes.pausePanel.classList.add("is-hidden");
    nodes.pauseBtn.setAttribute("aria-expanded", "false");
    battlePaused = false;
    setPauseActionAvailable(true);
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
      playFx("attack-hit", hero.x, hero.y, { value: -1 });
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
    const previousRects = renderedMovementMission === state?.mission ? captureUnitRects() : new Map();
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
          if (unit.team === "hero" && state.moved.has(unit.id) && !state.acted.has(unit.id)) tile.classList.add("is-positioned");
          if (unit.team === "hero" && state.selected === unit.id) tile.classList.add("is-selected");
          tile.appendChild(renderUnit(unit));
          if (unit.team === "hero") {
            const status = state.acted.has(unit.id) ? t("acted") : state.moved.has(unit.id) ? t("positioned") : t("ready");
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
    renderedMovementMission = state?.mission ?? null;
    animateMovedUnits(previousRects);
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
    wrap.className = unit.team === "enemy" ? "enemy" : `hero ${state?.acted?.has(unit.id) ? "has-acted" : state?.moved?.has(unit.id) ? "is-positioned" : "is-ready"}`;
    wrap.dataset.unitKey = unitRenderKey(unit);
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
      badge.textContent = state?.acted?.has(unit.id) ? t("acted") : state?.moved?.has(unit.id) ? t("positioned") : t("ready");
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
    const status = state.acted.has(hero.id) ? t("acted") : state.moved.has(hero.id) ? t("positioned") : t("ready");
    const chainTarget = livingEnemies().find((enemy) => (enemy.uid || enemy.id) === state.chainTarget);
    const chainBonus = chainTarget ? Math.min(2, state.chainCount) : 0;
    const chainHint = chainTarget
      ? t("runeChainHint", { enemy: t(chainTarget.name), bonus: chainBonus })
      : t("runeChainReady");
    nodes.selectedCard.innerHTML = `
      <strong>${t(hero.name)} ${t("heroLevel", { level: hero.level })} · ${status}</strong>
      <span>${t("chooseTarget", { hero: t(hero.name), hp: hero.hp, maxHp: hero.maxHp, energy: hero.energy })}</span>
      <small>${t("moveThenActHint")}</small>`;
    nodes.selectedCard.querySelector("strong").textContent = `${t(hero.name)} ${t("heroLevel", { level: hero.level })} / ${status}`;
    const skillHelp = nodes.selectedCard.querySelector("small");
    skillHelp.className = "skill-help";
    skillHelp.innerHTML = `<b>${t(hero.skillName)}</b><span>${t(hero.skillDesc)}</span><i>${chainHint}</i>`;
    nodes.skillBtn.title = t("skillInfo", { skill: t(hero.skillName), desc: t(hero.skillDesc) });
  }

  function renderTurnRoster() {
    if (!nodes.turnRoster || !state) return;
    const items = state.heroes.map((hero) => {
      const isSelected = state.selected === hero.id;
      const isFallen = hero.hp <= 0;
      const isDone = !isFallen && state.acted.has(hero.id);
      const isPositioned = !isFallen && !isDone && state.moved.has(hero.id);
      const status = isFallen ? t("fallen") : isDone ? t("acted") : isPositioned ? t("positioned") : t("ready");
      const className = ["turn-roster-item", isSelected ? "is-selected" : "", isDone ? "is-done" : "", isPositioned ? "is-positioned" : "", isFallen ? "is-fallen" : ""].filter(Boolean).join(" ");
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
    const canAct = hero && !state.acted.has(hero.id) && state.phase === "player" && !movementAnimationActive;
    const targets = hero ? validTargets() : [];
    const attackTarget = targets[0];
    const skillTarget = hero && hero.id !== "turtle" ? attackTarget || livingEnemies().sort((a, b) => distance(hero, a) - distance(hero, b))[0] : null;
    const attackBonus = attackTarget ? chainBonusFor(attackTarget) : 0;
    const skillBonus = skillTarget ? chainBonusFor(skillTarget) : 0;
    nodes.attackBtn.textContent = hero ? t("attackValue", { value: hero.atk + attackBonus }) : t("attack");
    nodes.guardBtn.textContent = hero ? t("guardValue") : t("guard");
    nodes.skillBtn.textContent = hero ? t("skillValue", { value: hero.id === "turtle" ? "+1" : hero.atk + 2 + skillBonus }) : t("skill");
    nodes.attackBtn.setAttribute("aria-label", attackTarget ? t("actionTarget", { action: t("attack"), value: hero.atk + attackBonus, target: t(attackTarget.name) }) : t("attack"));
    nodes.guardBtn.setAttribute("aria-label", hero ? `${t("guardValue")}. ${t("guardHelp")}` : t("guard"));
    if (hero) {
      const skillResult = hero.id === "turtle"
        ? t("skillSquadResult", { skill: t(hero.skillName) })
        : skillTarget
          ? t("actionTarget", { action: t(hero.skillName), value: hero.atk + 2 + skillBonus, target: t(skillTarget.name) })
          : t("skillInfo", { skill: t(hero.skillName), desc: t(hero.skillDesc) });
      const energyResult = hero.energy > 0
        ? t("skillEnergyChange", { energy: hero.energy, remaining: hero.energy - 1 })
        : t("skillEnergyNeed", { energy: hero.energy });
      nodes.skillBtn.setAttribute("aria-label", `${skillResult} ${energyResult}${hero.silenced ? ` ${t("skillSilenced")}` : ""}`);
    } else {
      nodes.skillBtn.setAttribute("aria-label", t("skill"));
    }
    nodes.attackBtn.disabled = !canAct || !targets.length;
    nodes.guardBtn.disabled = !canAct;
    nodes.skillBtn.disabled = !canAct || hero.energy <= 0 || hero.silenced;
    nodes.endTurnBtn.disabled = state.phase !== "player" || movementAnimationActive;
    const readyHeroNames = state.heroes
      .filter((candidate) => candidate.hp > 0 && !state.acted.has(candidate.id))
      .map((candidate) => t(candidate.name));
    let readyHeroList = readyHeroNames.join(", ");
    try {
      readyHeroList = new Intl.ListFormat(document.documentElement.lang || locale, { style: "long", type: "conjunction" }).format(readyHeroNames);
    } catch {
      // The comma-separated fallback remains complete in older browsers.
    }
    nodes.endTurnBtn.setAttribute(
      "aria-label",
      readyHeroNames.length
        ? t("endTurnDecision", { count: readyHeroNames.length, heroes: readyHeroList })
        : t("endTurnDecisionNone"),
    );
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
    if (!hero || state.acted.has(hero.id) || state.moved.has(hero.id) || hero.snared) return [];
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
    if (!state || state.phase !== "player" || movementAnimationActive) return;
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
      state.moved.add(hero.id);
      state.selected = hero.id;
      applyHeroTerrain(hero);
      playFx("dust-burst", x, y);
      playCue("click");
      log("moveReady", { hero: t(hero.name) });
      render();
      checkEnd();
    }
  }

  function chainBonusFor(enemy) {
    if (!enemy || (enemy.uid || enemy.id) !== state.chainTarget) return 0;
    return Math.min(2, state.chainCount);
  }

  function attack(hero, enemy, isSkill) {
    const chainBonus = chainBonusFor(enemy);
    let damage = hero.atk + (isSkill ? 2 : 0) + chainBonus;
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
    const enemyKey = enemy.uid || enemy.id;
    if (damage > 0) {
      state.chainCount = state.chainTarget === enemyKey ? state.chainCount + 1 : 1;
      state.chainTarget = enemyKey;
    } else {
      state.chainCount = 0;
      state.chainTarget = null;
    }
    markActed(hero);
    playFx(isSkill ? "rune-burst" : "attack-hit", enemy.x, enemy.y, { value: -damage });
    playCue(isSkill ? "shoot" : "hit");
    log(blockedByStoneHide ? "stagArmorHit" : isSkill ? "skillUsed" : "attacked", { hero: t(hero.name), enemy: t(enemy.name) });
    if (chainBonus > 0 && damage > 0) {
      playFx("rune-burst", enemy.x, enemy.y, { value: chainBonus, chain: true });
      playCue("success");
      log("runeChain", { count: state.chainCount, bonus: chainBonus });
    }
    if (enemy.hp <= 0) {
      enemy.hp = 0;
      playCue("enemyDown");
    }
    if (enemy.id === "boar" && enemy.hp > 0 && distance(hero, enemy) <= 1) {
      hero.hp = Math.max(0, hero.hp - 1);
      playFx("attack-hit", hero.x, hero.y, { value: -1 });
      playCue("wrong");
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
    playCue("upgrade");
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
        const before = h.hp;
        h.guard = true;
        h.hp = Math.min(h.maxHp, h.hp + 1);
        playFx("healing-swirl", h.x, h.y, { value: h.hp > before ? 1 : null });
      });
      markActed(hero);
      playCue("success");
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
    playFx("attack-hit", target.x, target.y, { value: -damage });
    playCue("wrong");
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
      playFx("rune-burst", enemy.x, enemy.y);
      playCue("boss");
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
    state.moved = new Set();
    state.chainTarget = null;
    state.chainCount = 0;
    state.phase = "player";
    state.selected = livingHeroes()[0]?.id || null;
    render();
    const ended = checkEnd();
    if (!ended && endTurnKeyboardFocusRequested && state?.phase === "player" && !movementAnimationActive) {
      endTurnKeyboardFocusRequested = false;
      requestAnimationFrame(() => nodes.endTurnBtn.focus({ preventScroll: true }));
    }
    if (ended) endTurnKeyboardFocusRequested = false;
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
    state.phase = "reward";
    setPauseActionAvailable(false);
    playFx("mission-clear", 2, 1);
    playCue("win");
    render();
    scheduleTurnTransition(() => {
      if (!state || state.phase !== "reward" || livingEnemies().length) return;
      setBattleCovered(true);
      nodes.rewardPanel.classList.remove("is-hidden");
      renderRewards(false);
    }, 320);
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

  function commitResultDecision(action) {
    if (resultDecisionCommitted || nodes.resultPanel.classList.contains("is-hidden")) return false;
    resultDecisionCommitted = true;
    action();
    return true;
  }

  function showResult(win) {
    resultDecisionCommitted = false;
    clearTurnTransition();
    nodes.rewardPanel.classList.add("is-hidden");
    nodes.gamePanel.classList.add("is-hidden");
    setBattleCovered(true);
    setPauseActionAvailable(false);
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
    const primaryResultAction = hasNextMission ? nodes.nextBtn : win ? nodes.menuBtn : nodes.retryBtn;
    nodes.nextBtn.disabled = !hasNextMission;
    nodes.nextBtn.classList.toggle("is-hidden", !hasNextMission);
    [nodes.nextBtn, nodes.retryBtn, nodes.menuBtn].forEach((button) => {
      button.classList.toggle("primary-btn", button === primaryResultAction);
      button.classList.toggle("secondary-btn", button !== primaryResultAction);
    });
    nodes.resultPanel.classList.remove("is-hidden");
    renderMenu();
    requestAnimationFrame(() => primaryResultAction.focus({ preventScroll: true }));
  }

  function playCue(name) {
    window.WonderSound?.play?.(name);
  }

  function playFx(name, x, y, options = {}) {
    const fx = document.createElement("img");
    fx.className = `fx fx-${name}`;
    fx.src = asset(`animal-rune-tactics-fx-${name}.webp`);
    fx.alt = "";
    const left = `${((x + 0.5) / cols) * 84 + 8}%`;
    const top = `${((y + 0.5) / rows) * 84 + 8}%`;
    fx.style.left = left;
    fx.style.top = top;
    nodes.fxLayer.appendChild(fx);
    setTimeout(() => fx.remove(), 620);
    if (Number.isFinite(options.value) && options.value !== 0) {
      const value = document.createElement("span");
      value.className = `fx-value ${options.value > 0 ? "is-positive" : "is-damage"}${options.chain ? " is-chain" : ""}`;
      value.textContent = `${options.value > 0 ? "+" : ""}${options.value}`;
      value.style.left = left;
      value.style.top = top;
      nodes.fxLayer.appendChild(value);
      setTimeout(() => value.remove(), 780);
    }
  }

  function log(key, vars) {
    nodes.battleLog.textContent = t(key, vars);
  }

  function shuffle(list) {
    return list.sort(() => Math.random() - 0.5);
  }

  function showMenu() {
    resetTrainingIntent();
    clearTurnTransition();
    endTurnKeyboardFocusRequested = false;
    state = null;
    document.body.classList.remove("is-rune-playing");
    nodes.backBtn.setAttribute("href", "/");
    nodes.backBtn.setAttribute("aria-label", t("backToLobby"));
    nodes.backBtn.setAttribute("data-wp-return", "main");
    nodes.backBtn.removeAttribute("aria-controls");
    nodes.backBtn.removeAttribute("aria-expanded");
    const logo = document.createElement("img");
    logo.src = "../../assets/weightplay-logo.png";
    logo.alt = "";
    nodes.backBtn.replaceChildren(document.createTextNode("\u2190"), logo);
    nodes.gamePanel.classList.add("is-hidden");
    nodes.rewardPanel.classList.add("is-hidden");
    nodes.resultPanel.classList.add("is-hidden");
    nodes.pausePanel.classList.add("is-hidden");
    nodes.pauseBtn.setAttribute("aria-expanded", "false");
    battlePaused = false;
    setPauseActionAvailable(false);
    setBattleCovered(false);
    nodes.menuPanel.classList.add("is-hidden");
    nodes.stagePanel.classList.remove("is-hidden");
    document.body.classList.add("wp-standard-stage-page");
    centeredMission = selectedMission;
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
        const previous = readStorage(saveKey);
        writeStorage(saveKey, JSON.stringify(snapshot || {}));
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
          moved: [...state.moved],
          acted: [...state.acted],
          chainTarget: state.chainTarget,
          chainCount: state.chainCount,
          heroes: state.heroes.map(({ id, hp, maxHp, x, y, energy, guard, snared, silenced, marked }) => ({ id, hp, maxHp, x, y, energy, guard, snared, silenced, marked })),
          enemies: state.enemies.map(({ id, uid, hp, maxHp, x, y, armorReady, allyGuard, cloneMade, flying, phasesTriggered, hitsThisTurn }) => ({ id, uid, hp, maxHp, x, y, armorReady, allyGuard, cloneMade, flying, phasesTriggered, hitsThisTurn })),
          terrain: state.terrain.map((item) => ({ ...item })),
          phaseEvents: state.phaseEvents.map((item) => ({ ...item })),
        };
      },
      movementEvidence() {
        return {
          active: movementAnimationActive,
          movements: lastMovementEvidence.map((item) => ({ ...item })),
          animations: [...nodes.grid.querySelectorAll("[data-unit-key]")].reduce((total, unit) => total + unit.getAnimations().length, 0),
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
        resetMovementAnimationTracking();
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
        state.moved = new Set();
        state.chainTarget = null;
        state.chainCount = 0;
        state.selected = selected || null;
        resetMovementAnimationTracking();
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
    document.addEventListener("pointerdown", resumeAppLifecycleFromTrustedInput, true);
    document.addEventListener("keydown", resumeAppLifecycleFromTrustedInput, true);
    document.addEventListener("click", resumeAppLifecycleFromTrustedInput, true);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) suspendAppLifecycle();
      else resumeAppLifecycle();
    });
    window.addEventListener("blur", suspendAppLifecycle);
    window.addEventListener("focus", resumeAppLifecycle);
    window.addEventListener("pagehide", suspendAppLifecycle);
    window.addEventListener("pageshow", resumeAppLifecycle);
    const syncRuntimeLocale = () => {
      const requested = document.documentElement.lang;
      if (text[requested] && requested !== locale) {
        locale = requested;
        applyLocale();
        return;
      }
      requestAnimationFrame(localizeStrategyTips);
    };
    new MutationObserver(syncRuntimeLocale).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    window.addEventListener("wonder:locale-change", syncRuntimeLocale);
    queueMicrotask(syncRuntimeLocale);
    nodes.mainStartBtn.addEventListener("click", showStage);
    nodes.stageBackBtn.addEventListener("click", showMainFromStage);
    nodes.backBtn.addEventListener("click", (event) => {
      if (!state) return;
      event.preventDefault();
      openPause(nodes.backBtn);
    });
    nodes.localeSelect.addEventListener("change", () => {
      resetTrainingIntent();
      const requested = nodes.localeSelect.value;
      window.WonderI18n?.setLocale?.(requested);
      locale = text[requested]
        ? requested
        : window.WonderI18n?.actualLocale?.() || window.WonderI18n?.locale?.() || requested;
      writeStorage(localeKey, requested);
      applyLocale();
      window.dispatchEvent(new CustomEvent("wonder:locale-change", { detail: { locale } }));
    });
    nodes.trainingBtn.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
    });
    nodes.trainingBtn.addEventListener("click", activateTraining);
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
    nodes.endTurnBtn.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
    });
    nodes.endTurnBtn.addEventListener("click", (event) => {
      endTurnKeyboardFocusRequested = event.detail === 0;
      endTurn();
    });
    nodes.pauseBtn.addEventListener("click", () => openPause(nodes.pauseBtn));
    nodes.resumeBtn.addEventListener("click", () => closePause());
    nodes.pauseMenuBtn.addEventListener("click", leavePauseForMissions);
    nodes.pausePanel.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        closePause();
        return;
      }
      keepDialogFocus(nodes.pausePanel, event);
    });
    nodes.rerollBtn.addEventListener("click", () => renderRewards(true));
    nodes.rewardPanel.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
      keepDialogFocus(nodes.rewardPanel, event);
    });
    nodes.resultPanel.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
      keepDialogFocus(nodes.resultPanel, event);
    });
    nodes.nextBtn.addEventListener("click", () => commitResultDecision(() => {
      selectedMission = Math.min(missionDefs.length, state.mission + 1);
      startMission(selectedMission);
    }));
    nodes.retryBtn.addEventListener("click", () => commitResultDecision(() => startMission(state?.mission || selectedMission)));
    nodes.menuBtn.addEventListener("click", () => commitResultDecision(showMenu));
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
