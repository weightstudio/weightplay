(() => {
  const stageReserve = document.getElementById("stageAdReserve");
  document.querySelectorAll(".wp-stage-physical-reserve").forEach((reserve) => {
    if (reserve !== stageReserve) reserve.remove();
  });
  stageReserve?.classList.add("wp-stage-physical-reserve");
  document.getElementById("stagePanel")?.setAttribute("data-wp-canvas-max-width", "920");
  document.getElementById("gamePanel")?.setAttribute("data-wp-canvas-max-width", "920");

  const GAME_ID = "animal-crystal-survivor";
  const saveKey = "weightplay_animal_crystal_survivor_v1";
  const localeKey = "weightPlayLocale";
  const W = 1024;
  const H = 1760;
  const MAX_BACKING_PIXELS = 900000;
  const MIN_BACKING_SCALE = 0.25;
  const RUN_SECONDS = 180;
  const STAGE_COUNT = 30;
  const crystalCharmCost = 12;

  const $ = (id) => document.getElementById(id);
  const resultCard = document.querySelector("#resultPanel .result-card");
  if (resultCard && !resultCard.querySelector(".result-ranger-art")) {
    const resultRangerArt = document.createElement("img");
    resultRangerArt.className = "result-ranger-art";
    resultRangerArt.src = "/assets/animal-crystal-survivor-ranger.webp";
    resultRangerArt.alt = "";
    resultRangerArt.setAttribute("aria-hidden", "true");
    resultRangerArt.decoding = "async";
    resultCard.prepend(resultRangerArt);
  }
  const canvas = $("gameCanvas");
  const displayCtx = canvas.getContext("2d", { alpha: false, desynchronized: true });
  const renderCanvas = document.createElement("canvas");
  const ctx = renderCanvas.getContext("2d", { alpha: false });
  const arenaLayer = document.createElement("canvas");
  const arenaCtx = arenaLayer.getContext("2d", { alpha: false });
  const nodes = {
    localeSelect: $("localeSelect"),
    topbar: document.querySelector(".topbar"),
    stagePanelHead: document.querySelector(".stage-panel-head"),
    settingsControl: $("settingsControl"),
    settingsBtn: $("settingsBtn"),
    settingsPopover: $("settingsPopover"),
    soundStateText: $("soundStateText"),
    menuPanel: $("menuPanel"),
    mainProgress: $("mainProgress"),
    stagePanel: $("stagePanel"),
    stagePage: $("stagePage"),
    equipmentPage: $("equipmentPage"),
    stageTabBtn: $("stageTabBtn"),
    equipmentTabBtn: $("equipmentTabBtn"),
    gamePanel: $("gamePanel"),
    upgradePanel: $("upgradePanel"),
    resultPanel: $("resultPanel"),
    startBtn: $("startBtn"),
    stageBackBtn: $("stageBackBtn"),
    stageSelectTitle: $("stageSelectTitle"),
    stageProgressText: $("stageProgressText"),
    stageSetupText: $("stageSetupText"),
    stageRail: $("stageRail"),
    stageText: $("stageText"),
    menuBtn: $("menuBtn"),
    retryBtn: $("retryBtn"),
    nextStageBtn: $("nextStageBtn"),
    resultMenuBtn: $("resultMenuBtn"),
    timeText: $("timeText"),
    keyText: $("keyText"),
    levelText: $("levelText"),
    hpText: $("hpText"),
    xpFill: $("xpFill"),
    hintText: $("hintText"),
    upgradeCards: $("upgradeCards"),
    resultTitle: $("resultTitle"),
    resultScore: $("resultScore"),
    resultText: $("resultText"),
    skillReportText: $("skillReportText"),
    reactionStars: $("reactionStars"),
    focusStars: $("focusStars"),
    problemStars: $("problemStars"),
    loadingPanel: $("loadingPanel"),
    loadingText: $("loadingText"),
    loadingFill: $("loadingFill"),
    diamondBalance: $("diamondBalance"),
    charmBtn: $("charmBtn"),
    charmCost: $("charmCost"),
    charmStatus: $("charmStatus"),
    menuSoundBtn: $("menuSoundBtn"),
    expeditionRecordText: $("expeditionRecordText"),
    patrolRankText: $("patrolRankText"),
    patrolRankProgressText: $("patrolRankProgressText"),
    patrolRankFill: $("patrolRankFill"),
    resultRankText: $("resultRankText"),
  };

  const text = {
    en: {
      title: "Animal Crystal Survivor",
      pageDescription: "Animal Crystal Survivor is a 30-stage Crystal Grove campaign with key objectives, six upgrades, changing hazards, and six original animal Bosses.",
      ogDescription: "A 30-stage action-survival campaign with six regions, readable hazards, auto-attacks, build choices, and six distinct animal Bosses.",
      language: "Language",
      audioSettings: "Settings",
      soundEffects: "Sound Effects",
      soundOn: "Sound on",
      soundOff: "Sound off",
      menuTitle: "Survive the Crystal Grove.",
      menuHint: "Goal: collect golden keys before 3:00. Crystals give XP, and upgrades help the ranger survive longer.",
      mainProgress: "Stages cleared {cleared} / 30",
      stageTab: "Stages",
      equipmentTab: "Equipment",
      expeditionRecordTitle: "Expedition Record",
      expeditionRecordText: "Best {keys} keys · Highest level {level} · {runs} runs",
      patrolRankTitle: "Patrol Rank: {rank}",
      patrolRankProgress: "{current} / {target} lifetime keys",
      patrolRankComplete: "Top rank · {current} lifetime keys",
      patrolRankUp: "Rank up! You are now {rank}.",
      patrolRankNext: "Patrol progress: {current} / {target} keys toward {rank}.",
      rankScout: "Crystal Scout",
      rankKeeper: "Grove Keeper",
      rankRanger: "Crystal Ranger",
      rankGuardian: "Grove Guardian",
      rankWarden: "Crystal Warden",
      controlMove: "Tap or drag to move",
      controlKeys: "WASD / Arrow keys",
      controlAttack: "Auto attack",
      chooseStage: "Choose Stage",
      stage: "Stage",
      stageProgress: "{unlocked} / 30 unlocked",
      stageSetup: "Swipe through six regions. Every fifth stage is a Boss checkpoint with a different survival rule.",
      stageSwipe: "↔ Swipe",
      stageDeploy: "Tap an unlocked stage to patrol",
      stageLocked: "Locked",
      stageReady: "Ready",
      stageCleared: "Cleared",
      bossCheckpoint: "Boss checkpoint",
      objective: "Collect {keys} keys · survive 3:00{boss}",
      bossObjective: " · defeat the Boss",
      nextStage: "Next Stage",
      diamondShopTitle: "Run Boost",
      charmName: "Crystal Charm",
      charmEffect: "Permanent run start: Max HP 7 → 8 · pickup radius 54 → 68.",
      charmOwned: "Owned and saved: Max HP 8 · pickup radius 68 every run.",
      charmBuy: "Unlock for {cost}",
      charmNeed: "Need {cost} diamonds · balance {balance}.",
      charmBought: "Unlocked and saved · {balance} diamonds remain.",
      charmConfirm: "Confirm permanent boost · Diamonds {before} → {after}. Tap again.",
      charmConfirmLabel: "Confirm Crystal Charm. Spend 12 Diamonds. Balance {before} to {after}.",
      enableSound: "Enable sound",
      disableSound: "Disable sound",
      startRun: "Start Run",
      menu: "Menu",
      backToLobby: "Back to lobby",
      playfield: "Animal Crystal Survivor playfield",
      playfieldState: "Stage {stage}/{stageCount}. Time {time}. Golden keys {keys}/{target}. HP {hp}/{maxHp}. Level {level}. Move with WASD or arrow keys, or click, tap, and drag. The ranger automatically attacks the nearest enemy in range. Stage rule: {rule}",
      time: "Time",
      keys: "Keys",
      level: "Level",
      hp: "HP",
      crystals: "Crystals",
      playHint: "Goal: collect golden keys before 3:00. Grab crystals to level up, then choose upgrades when the cards appear.",
      hintKeyClose: "Golden key nearby: move through it to raise your score.",
      hintCrystal: "Crystals are on the ground: collect them to fill the XP bar.",
      hintCombat: "Auto attack is working: keep shadows inside the soft green range.",
      hintUpgradeSoon: "Almost leveled up: collect one more crystal and pick a stronger ability.",
      loading: "Loading",
      chooseUpgrade: "Choose an upgrade",
      tryAgain: "Try Again",
      backToMenu: "Back to Menu",
      backToStages: "Back to stages",
      reaction: "Reaction",
      focus: "Focus",
      problemSolving: "Problem Solving",
      timeUp: "Time Up!",
      runFailed: "Run Ended",
      stageClear: "Stage Clear!",
      objectiveMissed: "Objective Incomplete",
      objectiveMissedLine: "Reach {keys} keys{boss} before time expires to clear this stage.",
      bossStillActive: " and calm the Boss",
      resultLine: "Keys {keys} | Level {level} | Time {time}s | Best {best}",
      resultScoreLabel: "Golden Keys Collected",
      improved: "Great progress! You improved your best key score.",
      keepGoing: "Good effort. Short practice helps reaction and focus.",
      skillReportTitle: "Skill Report",
      skillReportStrong: "Strong run: you kept moving, reached level {level}, and finished with a golden-key score of {keys} while watching the shadows.",
      skillReportFocus: "Good focus practice: your next goal is to collect more crystals early so upgrades arrive sooner.",
      skillReportRecover: "Brave survival effort: watch the danger rings and move early when shadows get close.",
      resultDisclaimer: "For fun and local progress tracking only.",
      upgradeAttack: "Crystal Power",
      upgradeAttackDesc: "Projectiles calm shadows faster.",
      upgradeRange: "Longer Range",
      upgradeRangeDesc: "The ranger can target farther shadows.",
      upgradeSpeed: "Fleet Paws",
      upgradeSpeedDesc: "Move faster through the grove.",
      upgradeMaxHp: "Guardian Heart",
      upgradeMaxHpDesc: "Increase max HP and heal.",
      upgradeAttackSpeed: "Quick Seeds",
      upgradeAttackSpeedDesc: "Attack more often.",
      upgradePickupRadius: "Crystal Magnet",
      upgradePickupRadiusDesc: "Collect nearby crystals and keys from farther away.",
      upgradeValue: "{stat}: {current} → {next}",
      statDamage: "Damage",
      statRange: "Range",
      statSpeed: "Move speed",
      statHp: "Max HP",
      statCooldown: "Attack interval",
      statPickup: "Pickup radius",
    },
    "zh-Hant": {
      title: "\u52d5\u7269\u6c34\u6676\u751f\u5b58\u6230",
      pageDescription: "\u300a\u52d5\u7269\u6c34\u6676\u751f\u5b58\u6230\u300b\u662f 30 \u95dc\u6c34\u6676\u6797\u5730\u6230\u5f79\uff0c\u5305\u542b\u91d1\u9470\u76ee\u6a19\u3001\u516d\u7a2e\u5347\u7d1a\u3001\u8b8a\u5316\u5371\u96aa\u8207\u516d\u96bb\u539f\u5275\u52d5\u7269\u9996\u9818\u3002",
      ogDescription: "30 \u95dc\u52d5\u4f5c\u751f\u5b58\u6230\u5f79\uff0c\u5305\u542b\u516d\u500b\u5340\u57df\u3001\u53ef\u8b80\u5371\u96aa\u3001\u81ea\u52d5\u653b\u64ca\u3001\u5efa\u69cb\u9078\u64c7\u8207\u516d\u96bb\u7368\u7279\u9996\u9818\u3002",
      language: "\u8a9e\u8a00",
      audioSettings: "\u8a2d\u5b9a",
      soundEffects: "\u97f3\u6548",
      soundOn: "\u97f3\u6548\u958b\u555f",
      soundOff: "\u97f3\u6548\u95dc\u9589",
      menuTitle: "\u5728\u7d50\u6676\u68ee\u6797\u4e2d\u751f\u5b58\u4e0b\u53bb\u3002",
      menuHint: "\u76ee\u6a19\uff1a\u5728 3:00 \u4e4b\u524d\u6536\u96c6\u91d1\u9470\u3002\u6c34\u6676\u6703\u589e\u52a0\u7d93\u9a57\uff0c\u5347\u7d1a\u53ef\u4ee5\u8b93\u5de1\u5b88\u54e1\u6490\u5f97\u66f4\u4e45\u3002",
      mainProgress: "\u5df2\u901a\u95dc {cleared} / 30",
      stageTab: "\u95dc\u5361",
      equipmentTab: "\u88dd\u5099",
      expeditionRecordTitle: "\u63a2\u96aa\u7d00\u9304",
      expeditionRecordText: "\u6700\u4f73 {keys} \u628a\u91d1\u9470 \u00b7 \u6700\u9ad8 {level} \u7d1a \u00b7 \u5df2\u5b8c\u6210 {runs} \u6b21\u9060\u5f81",
      patrolRankTitle: "\u5de1\u5b88\u968e\u7d1a\uff1a{rank}",
      patrolRankProgress: "\u7d2f\u7a4d\u91d1\u9470 {current} / {target}",
      patrolRankComplete: "\u6700\u9ad8\u968e\u7d1a \u00b7 \u7d2f\u7a4d {current} \u628a\u91d1\u9470",
      patrolRankUp: "\u968e\u7d1a\u63d0\u5347\uff01\u4f60\u73fe\u5728\u662f{rank}\u3002",
      patrolRankNext: "\u5de1\u5b88\u9032\u5ea6\uff1a{current} / {target}\uff0c\u4e0b\u4e00\u968e\u70ba{rank}\u3002",
      rankScout: "\u6c34\u6676\u898b\u7fd2\u751f",
      rankKeeper: "\u68ee\u6797\u5b88\u8b77\u54e1",
      rankRanger: "\u6c34\u6676\u5de1\u5b88\u54e1",
      rankGuardian: "\u68ee\u6797\u5b88\u885b",
      rankWarden: "\u6c34\u6676\u76e3\u8b77\u8005",
      controlMove: "\u9ede\u64ca\u6216\u62d6\u66f3\u79fb\u52d5",
      controlKeys: "WASD / \u65b9\u5411\u9375",
      controlAttack: "\u81ea\u52d5\u653b\u64ca",
      chooseStage: "\u9078\u64c7\u95dc\u5361",
      stage: "\u95dc\u5361",
      stageProgress: "\u5df2\u89e3\u9396 {unlocked} / 30",
      stageSetup: "\u5de6\u53f3\u6ed1\u904e\u516d\u500b\u5340\u57df\u3002\u6bcf\u7b2c\u4e94\u95dc\u90fd\u662f\u5177\u6709\u7368\u7279\u751f\u5b58\u898f\u5247\u7684\u9996\u9818\u6aa2\u67e5\u9ede\u3002",
      stageSwipe: "\u2194 \u6ed1\u52d5",
      stageDeploy: "\u9ede\u64ca\u5df2\u89e3\u9396\u95dc\u5361\u51fa\u767c",
      stageLocked: "\u672a\u89e3\u9396",
      stageReady: "\u53ef\u6311\u6230",
      stageCleared: "\u5df2\u901a\u95dc",
      bossCheckpoint: "\u9996\u9818\u6aa2\u67e5\u9ede",
      objective: "\u6536\u96c6 {keys} \u628a\u91d1\u9470\u00b7\u751f\u5b58 3:00{boss}",
      bossObjective: "\u00b7\u64ca\u6557\u9996\u9818",
      nextStage: "\u4e0b\u4e00\u95dc",
      diamondShopTitle: "\u6311\u6230\u52a0\u6210",
      charmName: "\u6c34\u6676\u8b77\u7b26",
      charmEffect: "\u6c38\u4e45\u958b\u5c40\uff1a\u751f\u547d\u4e0a\u9650 7 → 8 · \u62fe\u53d6\u7bc4\u570d 54 → 68\u3002",
      charmOwned: "\u5df2\u64c1\u6709\u4e26\u4fdd\u5b58\uff1a\u6bcf\u5c40\u751f\u547d\u4e0a\u9650 8 · \u62fe\u53d6\u7bc4\u570d 68\u3002",
      charmBuy: "\u82b1\u8cbb {cost} \u89e3\u9396",
      charmNeed: "\u9700\u8981 {cost} \u9846\u947d\u77f3 · \u76ee\u524d {balance} \u9846\u3002",
      charmBought: "\u5df2\u89e3\u9396\u4e26\u4fdd\u5b58 · \u5269\u9918 {balance} \u9846\u947d\u77f3\u3002",
      charmConfirm: "\u78ba\u8a8d\u6c38\u4e45\u52a0\u6210 · \u947d\u77f3 {before} → {after}\u3002\u518d\u6b21\u9ede\u64ca\u78ba\u8a8d\u3002",
      charmConfirmLabel: "\u78ba\u8a8d\u8cfc\u8cb7\u6c34\u6676\u8b77\u7b26\u3002\u82b1\u8cbb 12 \u9846\u947d\u77f3\uff0c\u9918\u984d\u7531 {before} \u8b8a\u70ba {after}\u3002",
      enableSound: "\u958b\u555f\u97f3\u6548",
      disableSound: "\u95dc\u9589\u97f3\u6548",
      startRun: "\u958b\u59cb\u6311\u6230",
      menu: "\u9078\u55ae",
      backToLobby: "\u56de\u5230\u5927\u5ef3",
      playfield: "\u52d5\u7269\u6c34\u6676\u751f\u5b58\u6230\u904a\u73a9\u5340",
      playfieldState: "\u95dc\u5361 {stage}/{stageCount}\u3002\u5269\u9918\u6642\u9593 {time}\u3002\u91d1\u9470 {keys}/{target}\u3002\u751f\u547d {hp}/{maxHp}\u3002\u7b49\u7d1a {level}\u3002\u4f7f\u7528 WASD \u6216\u65b9\u5411\u9375\u79fb\u52d5\uff0c\u4e5f\u53ef\u9ede\u64ca\u3001\u89f8\u63a7\u6216\u62d6\u66f3\u3002\u5de1\u5b88\u54e1\u6703\u81ea\u52d5\u653b\u64ca\u7bc4\u570d\u5167\u6700\u8fd1\u7684\u6575\u4eba\u3002\u95dc\u5361\u898f\u5247\uff1a{rule}",
      time: "\u6642\u9593",
      keys: "\u91d1\u9470",
      level: "\u7b49\u7d1a",
      hp: "\u751f\u547d",
      crystals: "\u6c34\u6676",
      playHint: "\u76ee\u6a19\uff1a\u5728 3:00 \u4e4b\u524d\u6536\u96c6\u91d1\u9470\u3002\u62ff\u6c34\u6676\u5347\u7d1a\uff0c\u5361\u7247\u51fa\u73fe\u6642\u9078\u4e00\u500b\u5f37\u5316\u3002",
      hintKeyClose: "\u91d1\u9470\u5728\u9644\u8fd1\uff1a\u7a7f\u904e\u5b83\u5c31\u80fd\u63d0\u9ad8\u5206\u6578\u3002",
      hintCrystal: "\u5730\u4e0a\u6709\u6c34\u6676\uff1a\u6536\u96c6\u5b83\u5011\u4f86\u586b\u6eff\u7d93\u9a57\u689d\u3002",
      hintCombat: "\u81ea\u52d5\u653b\u64ca\u6b63\u5728\u751f\u6548\uff1a\u8b93\u5f71\u5b50\u7559\u5728\u6de1\u7da0\u8272\u7bc4\u570d\u5167\u3002",
      hintUpgradeSoon: "\u5feb\u5347\u7d1a\u4e86\uff1a\u518d\u6536\u4e00\u9846\u6c34\u6676\uff0c\u7136\u5f8c\u9078\u64c7\u66f4\u5f37\u7684\u80fd\u529b\u3002",
      loading: "\u8f09\u5165\u4e2d",
      chooseUpgrade: "\u9078\u64c7\u4e00\u500b\u5347\u7d1a",
      tryAgain: "\u518d\u8a66\u4e00\u6b21",
      backToMenu: "\u56de\u5230\u9078\u55ae",
      backToStages: "\u56de\u5230\u95dc\u5361",
      reaction: "\u53cd\u61c9",
      focus: "\u5c08\u6ce8",
      problemSolving: "\u554f\u984c\u89e3\u6c7a",
      timeUp: "\u6642\u9593\u5230\uff01",
      runFailed: "\u6311\u6230\u7d50\u675f",
      stageClear: "\u95dc\u5361\u5b8c\u6210\uff01",
      objectiveMissed: "\u76ee\u6a19\u672a\u5b8c\u6210",
      objectiveMissedLine: "\u6642\u9593\u5167\u6536\u96c6 {keys} \u628a\u91d1\u9470{boss}\u624d\u80fd\u901a\u95dc\u3002",
      bossStillActive: "\u4e26\u5b89\u64ab\u9996\u9818",
      resultLine: "\u91d1\u9470 {keys} | \u7b49\u7d1a {level} | \u5b58\u6d3b {time} \u79d2 | \u6700\u4f73 {best}",
      resultScoreLabel: "\u6536\u96c6\u5230\u7684\u91d1\u9470",
      improved: "\u9032\u6b65\u5f88\u597d\uff01\u4f60\u5237\u65b0\u4e86\u81ea\u5df1\u7684\u91d1\u9470\u7d00\u9304\u3002",
      keepGoing: "\u8868\u73fe\u4e0d\u932f\u3002\u77ed\u6642\u9593\u7df4\u7fd2\u80fd\u5e6b\u52a9\u53cd\u61c9\u548c\u5c08\u6ce8\u3002",
      skillReportTitle: "\u80fd\u529b\u56de\u994b",
      skillReportStrong: "\u9019\u5c40\u5f88\u7a69\uff1a\u4f60\u6301\u7e8c\u79fb\u52d5\u3001\u9054\u5230 {level} \u7d1a\uff0c\u4e26\u5728\u7559\u610f\u5f71\u5b50\u6642\u6536\u96c6\u4e86 {keys} \u628a\u91d1\u9470\u3002",
      skillReportFocus: "\u9019\u662f\u5f88\u597d\u7684\u5c08\u6ce8\u7df4\u7fd2\uff1a\u4e0b\u4e00\u5c40\u53ef\u4ee5\u65e9\u9ede\u6536\u96c6\u6c34\u6676\uff0c\u8b93\u5347\u7d1a\u66f4\u5feb\u51fa\u73fe\u3002",
      skillReportRecover: "\u751f\u5b58\u8868\u73fe\u5f88\u52c7\u6562\uff1a\u7559\u610f\u5371\u96aa\u5708\uff0c\u5f71\u5b50\u9760\u8fd1\u524d\u5148\u79fb\u52d5\u3002",
      resultDisclaimer: "\u50c5\u4f9b\u904a\u6232\u6a02\u8da3\u8207\u672c\u6a5f\u9032\u6b65\u8ffd\u8e64\u53c3\u8003\u3002",
      upgradeAttack: "\u6c34\u6676\u529b\u91cf",
      upgradeAttackDesc: "\u6295\u5c04\u7269\u66f4\u5feb\u5b89\u64ab\u5f71\u5b50\u3002",
      upgradeRange: "\u5de1\u5b88\u8ddd\u96e2",
      upgradeRangeDesc: "\u53ef\u4ee5\u9396\u5b9a\u66f4\u9060\u7684\u5f71\u5b50\u3002",
      upgradeSpeed: "\u8fc5\u6377\u8173\u6b65",
      upgradeSpeedDesc: "\u5728\u68ee\u6797\u4e2d\u79fb\u52d5\u66f4\u5feb\u3002",
      upgradeMaxHp: "\u5b88\u8b77\u4e4b\u5fc3",
      upgradeMaxHpDesc: "\u63d0\u9ad8\u751f\u547d\u4e0a\u9650\u4e26\u6062\u5fa9\u751f\u547d\u3002",
      upgradeAttackSpeed: "\u5feb\u901f\u7a2e\u5b50",
      upgradeAttackSpeedDesc: "\u653b\u64ca\u9593\u9694\u7e2e\u77ed\u3002",
      upgradePickupRadius: "\u6c34\u6676\u78c1\u529b",
      upgradePickupRadiusDesc: "\u53ef\u4ee5\u5f9e\u66f4\u9060\u8655\u6536\u96c6\u6c34\u6676\u8207\u91d1\u9470\u3002",
      upgradeValue: "{stat}\uff1a{current} → {next}",
      statDamage: "\u50b7\u5bb3",
      statRange: "\u653b\u64ca\u7bc4\u570d",
      statSpeed: "\u79fb\u52d5\u901f\u5ea6",
      statHp: "\u751f\u547d\u4e0a\u9650",
      statCooldown: "\u653b\u64ca\u9593\u9694",
      statPickup: "\u62fe\u53d6\u7bc4\u570d",
    },
  };
  text.es = {
    title:"Superviviente de Cristal Animal",pageDescription:"Campaña de 30 niveles en la Arboleda de Cristal con objetivos de llaves, seis mejoras, peligros cambiantes y seis jefes animales originales.",ogDescription:"Campaña de supervivencia de 30 niveles con seis regiones, peligros legibles, ataque automático, elecciones de mejora y seis jefes distintos.",language:"Idioma",audioSettings:"Configuración",soundEffects:"Efectos de sonido",soundOn:"Sonido activado",soundOff:"Sonido desactivado",
    menuTitle:"Sobrevive en la Arboleda de Cristal.",menuHint:"Objetivo: recoge llaves doradas antes de 3:00. Los cristales dan XP y las mejoras ayudan al guardabosques.",expeditionRecordTitle:"Registro de expedición",expeditionRecordText:"Mejor: {keys} llaves · Nivel máximo {level} · {runs} partidas",patrolRankTitle:"Rango de patrulla: {rank}",patrolRankProgress:"{current} / {target} llaves acumuladas",patrolRankComplete:"Rango máximo · {current} llaves acumuladas",patrolRankUp:"¡Subes de rango! Ahora eres {rank}.",patrolRankNext:"Progreso: {current} / {target} llaves para {rank}.",rankScout:"Explorador de cristal",rankKeeper:"Cuidador de la arboleda",rankRanger:"Guardabosques de cristal",rankGuardian:"Guardián de la arboleda",rankWarden:"Custodio de cristal",
    controlMove:"Toca o arrastra para moverte",controlKeys:"WASD / Flechas",controlAttack:"Ataque automático",chooseStage:"Elegir nivel",stage:"Nivel",stageProgress:"{unlocked} / 30 desbloqueados",stageSetup:"Desliza por seis regiones. Cada quinto nivel es un jefe con una regla de supervivencia distinta.",stageSwipe:"↔ Desliza",stageDeploy:"Toca un nivel desbloqueado para patrullar",stageLocked:"Bloqueado",stageReady:"Listo",stageCleared:"Completado",bossCheckpoint:"Punto de jefe",objective:"Recoge {keys} llaves · sobrevive 3:00{boss}",bossObjective:" · derrota al jefe",nextStage:"Siguiente nivel",
    diamondShopTitle:"Mejora de partida",charmName:"Amuleto de cristal",charmEffect:"Inicio permanente: Vida máx. 7 → 8 · radio de recogida 54 → 68.",charmOwned:"En propiedad y guardado: Vida máx. 8 · radio 68 en cada partida.",charmBuy:"Desbloquear por {cost}",charmNeed:"Necesitas {cost} diamantes · saldo {balance}.",charmBought:"Desbloqueado y guardado · quedan {balance} diamantes.",charmConfirm:"Confirma la mejora permanente · Diamantes {before} → {after}. Toca otra vez.",charmConfirmLabel:"Confirma el Amuleto de cristal. Gasta 12 diamantes. Saldo de {before} a {after}.",enableSound:"Activar sonido",disableSound:"Desactivar sonido",startRun:"Empezar partida",menu:"Menú",backToLobby:"Volver al vestíbulo",
    playfield:"Zona de juego de Superviviente de Cristal Animal",playfieldState:"Nivel {stage}/{stageCount}. Tiempo {time}. Llaves {keys}/{target}. Vida {hp}/{maxHp}. Nivel {level}. Muévete con WASD, flechas, clic, toque o arrastre. El guardabosques ataca al enemigo más cercano dentro del alcance. Regla: {rule}",time:"Tiempo",keys:"Llaves",level:"Nivel",hp:"Vida",crystals:"Cristales",playHint:"Recoge llaves antes de 3:00. Toma cristales para subir de nivel y elige mejoras cuando aparezcan.",hintKeyClose:"Llave dorada cerca: atraviésala para aumentar tu puntuación.",hintCrystal:"Hay cristales en el suelo: recógelos para llenar la barra de XP.",hintCombat:"El ataque automático funciona: mantén las sombras dentro del círculo verde.",hintUpgradeSoon:"Casi subes de nivel: recoge otro cristal y elige una habilidad más fuerte.",loading:"Cargando",chooseUpgrade:"Elige una mejora",
    tryAgain:"Reintentar",backToMenu:"Volver al menú",backToStages:"Volver a niveles",reaction:"Reacción",focus:"Atención",problemSolving:"Resolución de problemas",timeUp:"¡Tiempo!",runFailed:"Partida terminada",stageClear:"¡Nivel completado!",objectiveMissed:"Objetivo incompleto",objectiveMissedLine:"Consigue {keys} llaves{boss} antes de que acabe el tiempo.",bossStillActive:" y calma al jefe",resultLine:"Llaves {keys} | Nivel {level} | Tiempo {time} s | Mejor {best}",resultScoreLabel:"Llaves doradas recogidas",improved:"¡Gran progreso! Mejoraste tu récord de llaves.",keepGoing:"Buen intento. La práctica breve ayuda a la reacción y atención.",skillReportTitle:"Informe de habilidades",skillReportStrong:"Partida sólida: seguiste moviéndote, alcanzaste el nivel {level} y recogiste {keys} llaves mientras vigilabas las sombras.",skillReportFocus:"Buena práctica de atención: recoge antes los cristales para obtener mejoras más pronto.",skillReportRecover:"Valiente intento: observa los círculos de peligro y muévete antes de que se acerquen las sombras.",resultDisclaimer:"Solo para diversión y seguimiento local del progreso.",
    upgradeAttack:"Poder de cristal",upgradeAttackDesc:"Los proyectiles calman sombras más rápido.",upgradeRange:"Mayor alcance",upgradeRangeDesc:"El guardabosques apunta a sombras más lejanas.",upgradeSpeed:"Patas veloces",upgradeSpeedDesc:"Muévete más rápido por la arboleda.",upgradeMaxHp:"Corazón guardián",upgradeMaxHpDesc:"Aumenta la vida máxima y cura.",upgradeAttackSpeed:"Semillas rápidas",upgradeAttackSpeedDesc:"Ataca con más frecuencia.",upgradePickupRadius:"Imán de cristal",upgradePickupRadiusDesc:"Recoge cristales y llaves desde más lejos.",upgradeValue:"{stat}: {current} → {next}",statDamage:"Daño",statRange:"Alcance",statSpeed:"Velocidad",statHp:"Vida máxima",statCooldown:"Intervalo de ataque",statPickup:"Radio de recogida"
  };
  text.en.mainStart = "Start Game";
  text["zh-Hant"].mainStart = "\u958b\u59cb\u904a\u6232";
  text.es.mainStart = "Comenzar juego";
  Object.entries({
    en: ["Stages cleared {cleared} / 30", "Stages", "Equipment"],
    "zh-Hant": ["\u5df2\u901a\u95dc {cleared} / 30", "\u95dc\u5361", "\u88dd\u5099"],
    "zh-Hans": ["\u5df2\u901a\u5173 {cleared} / 30", "\u5173\u5361", "\u88c5\u5907"],
    ja: ["\u30af\u30ea\u30a2 {cleared} / 30", "\u30b9\u30c6\u30fc\u30b8", "\u88c5\u5099"],
    ko: ["\uc644\ub8cc\ud55c \uc2a4\ud14c\uc774\uc9c0 {cleared} / 30", "\uc2a4\ud14c\uc774\uc9c0", "\uc7a5\ube44"],
    es: ["Niveles superados {cleared} / 30", "Niveles", "Equipo"],
    pt: ["Fases conclu\u00eddas {cleared} / 30", "Fases", "Equipamento"],
    fr: ["Niveaux termin\u00e9s {cleared} / 30", "Niveaux", "\u00c9quipement"],
    de: ["Abgeschlossene Stufen {cleared} / 30", "Stufen", "Ausr\u00fcstung"],
    it: ["Livelli completati {cleared} / 30", "Livelli", "Equipaggiamento"],
    ru: ["\u041f\u0440\u043e\u0439\u0434\u0435\u043d\u043e {cleared} / 30", "\u042d\u0442\u0430\u043f\u044b", "\u0421\u043d\u0430\u0440\u044f\u0436\u0435\u043d\u0438\u0435"],
    hi: ["\u092a\u0942\u0930\u0947 \u0939\u0941\u090f \u0938\u094d\u091f\u0947\u091c {cleared} / 30", "\u0938\u094d\u091f\u0947\u091c", "\u0909\u092a\u0915\u0930\u0923"],
    ar: ["\u0627\u0644\u0645\u0631\u0627\u062d\u0644 \u0627\u0644\u0645\u0643\u062a\u0645\u0644\u0629 {cleared} / 30", "\u0627\u0644\u0645\u0631\u0627\u062d\u0644", "\u0627\u0644\u0645\u0639\u062f\u0627\u062a"],
  }).forEach(([code, labels]) => {
    text[code] ||= {};
    [text[code].mainProgress, text[code].stageTab, text[code].equipmentTab] = labels;
  });

  const assetPaths = {
    arena: "../../assets/animal-crystal-survivor-forest-arena.webp",
    hero: "../../assets/animal-crystal-survivor-ranger.webp",
    basic: "../../assets/animal-crystal-survivor-shadow-fox-v2.webp",
    runner: "../../assets/animal-crystal-survivor-shadow-panther-v2.webp",
    tank: "../../assets/animal-crystal-survivor-crystal-boar-v2.webp",
    xp: "../../assets/animal-crystal-survivor-xp-crystal.webp",
    key: "../../assets/animal-crystal-survivor-golden-key.webp",
    seed: "../../assets/animal-crystal-survivor-crystal-seed-shot-v2.webp",
    blade: "../../assets/animal-crystal-survivor-leaf-blade-shot-v2.webp",
    upgradeAttack: "../../assets/animal-crystal-survivor-upgrade-attack.png",
    upgradeRange: "../../assets/animal-crystal-survivor-upgrade-range.png",
    upgradeSpeed: "../../assets/animal-crystal-survivor-upgrade-speed.png",
    upgradeMaxHp: "../../assets/animal-crystal-survivor-upgrade-max-hp.png",
    upgradeCooldown: "../../assets/animal-crystal-survivor-upgrade-cooldown.png",
    upgradePickup: "../../assets/animal-crystal-survivor-upgrade-pickup.png",
    bossRoot: "../../assets/animal-crystal-survivor-boss-root-stalker.webp",
    bossPrism: "../../assets/animal-crystal-survivor-boss-prism-moth-queen.webp",
    bossBriar: "../../assets/animal-crystal-survivor-boss-briar-boar-king.webp",
    bossCinder: "../../assets/animal-crystal-survivor-boss-cinder-panther.webp",
    bossTempest: "../../assets/animal-crystal-survivor-boss-tempest-roc.webp",
    bossEclipse: "../../assets/animal-crystal-survivor-boss-eclipse-colossus.webp",
  };

  const upgrades = [
    { id: "attack", icon: "upgradeAttack", name: "upgradeAttack", desc: "upgradeAttackDesc" },
    { id: "range", icon: "upgradeRange", name: "upgradeRange", desc: "upgradeRangeDesc" },
    { id: "speed", icon: "upgradeSpeed", name: "upgradeSpeed", desc: "upgradeSpeedDesc" },
    { id: "maxHp", icon: "upgradeMaxHp", name: "upgradeMaxHp", desc: "upgradeMaxHpDesc" },
    { id: "cooldown", icon: "upgradeCooldown", name: "upgradeAttackSpeed", desc: "upgradeAttackSpeedDesc" },
    { id: "pickup", icon: "upgradePickup", name: "upgradePickupRadius", desc: "upgradePickupRadiusDesc" },
  ];

  const regions = [
    { en: "Crystal Grove", zh: "\u6c34\u6676\u6797\u5730", color: "rgba(32,103,67,.2)" },
    { en: "Moon Shards", zh: "\u6708\u5149\u788e\u5883", color: "rgba(86,62,154,.24)" },
    { en: "Briar Maze", zh: "\u834a\u68d8\u8ff7\u5bae", color: "rgba(126,74,32,.24)" },
    { en: "Ember Rift", zh: "\u9918\u71fc\u88c2\u8c37", color: "rgba(164,55,24,.25)" },
    { en: "Storm Crown", zh: "\u98a8\u66b4\u4e4b\u51a0", color: "rgba(27,78,153,.27)" },
    { en: "Eclipse Heart", zh: "\u65e5\u8755\u6838\u5fc3", color: "rgba(70,27,95,.3)" },
  ];

  const stageRows = [
    ["First Patrol", "\u521d\u6b21\u5de1\u908f", "Learn key routes while ordinary shadow foxes approach.", "\u5728\u666e\u901a\u5f71\u72d0\u903c\u8fd1\u6642\u719f\u6089\u91d1\u9470\u8def\u7dda\u3002", "basic"],
    ["Crystal Current", "\u6c34\u6676\u6d41", "Loose crystals drift toward the nearest shadow.", "\u6389\u843d\u7684\u6c34\u6676\u6703\u7de9\u6162\u98c4\u5411\u6700\u8fd1\u7684\u5f71\u7378\u3002", "drift"],
    ["Panther Dusk", "\u9ed1\u8c79\u66ae\u8272", "Fast panthers arrive in marked rush groups.", "\u5feb\u901f\u9ed1\u8c79\u6703\u6210\u7fa4\u885d\u5165\u3002", "runnerRush"],
    ["Boar Ring", "\u91ce\u8c6c\u74b0\u9663", "Armored boars close the arena from opposite edges.", "\u88dd\u7532\u91ce\u8c6c\u5f9e\u76f8\u5c0d\u908a\u7de3\u58d3\u7e2e\u7a7a\u9593\u3002", "tankRing"],
    ["Root Stalker", "\u6839\u7cfb\u8ffd\u7375\u8005", "Root circles slow movement; defeat the guardian before time expires.", "\u6839\u7cfb\u5708\u6703\u6e1b\u901f\uff1b\u6642\u9593\u5167\u64ca\u6557\u5b88\u885b\u3002", "root", "bossRoot"],
    ["Moth Lanterns", "\u98db\u86fe\u71c8\u706b", "Prism pulses force wide turns around the arena.", "\u68f1\u93e1\u8108\u885d\u8feb\u4f7f\u73a9\u5bb6\u4ee5\u5927\u5f27\u7dda\u8ff4\u907f\u3002", "prismPulse"],
    ["Mirrored Trail", "\u93e1\u50cf\u5c0f\u5f91", "Two warning circles appear at mirrored positions.", "\u5169\u500b\u8b66\u793a\u5708\u6703\u5728\u93e1\u50cf\u4f4d\u7f6e\u51fa\u73fe\u3002", "mirror"],
    ["Shard Orbit", "\u788e\u7247\u8ecc\u9053", "Rotating shard zones make the center unsafe in intervals.", "\u65cb\u8f49\u788e\u7247\u5340\u6703\u9593\u6b47\u5c01\u9396\u4e2d\u592e\u3002", "orbit"],
    ["Veiled Pack", "\u68f1\u5149\u7378\u7fa4", "Every third enemy enters with a temporary crystal shield.", "\u6bcf\u7b2c\u4e09\u96bb\u6575\u4eba\u6703\u5e36\u8457\u77ed\u66ab\u6c34\u6676\u8b77\u76fe\u3002", "shielded"],
    ["Prism Moth Queen", "\u68f1\u93e1\u98db\u86fe\u5973\u738b", "The Queen alternates a crystal shield with radial prism bursts.", "\u5973\u738b\u5728\u6c34\u6676\u8b77\u76fe\u8207\u653e\u5c04\u68f1\u5149\u9593\u8f2a\u66ff\u3002", "prism", "bossPrism"],
    ["Root Patches", "\u6839\u7cfb\u6591\u584a", "Telegraphed roots punish standing still.", "\u6709\u9810\u544a\u7684\u6839\u7cfb\u6703\u61f2\u7f70\u505c\u7559\u4e0d\u52d5\u3002", "rootPatches"],
    ["Thorn Lanes", "\u834a\u68d8\u8d70\u5eca", "Alternating thorn lanes leave one readable escape route.", "\u4ea4\u66ff\u834a\u68d8\u8d70\u5eca\u6703\u7559\u4e0b\u4e00\u689d\u53ef\u8b80\u7684\u9003\u751f\u8def\u3002", "thornLanes"],
    ["Bramble Surge", "\u85e4\u68d8\u5954\u6d41", "Boars pause, flash, then charge instead of walking steadily.", "\u91ce\u8c6c\u6703\u5148\u505c\u9813\u767c\u5149\uff0c\u518d\u767c\u52d5\u885d\u92d2\u3002", "charge"],
    ["Crossing Tusks", "\u4ea4\u932f\u7360\u7259", "Chargers enter from four sides while roots mark the center.", "\u885d\u92d2\u7378\u5f9e\u56db\u908a\u9032\u5165\uff0c\u6839\u7cfb\u540c\u6642\u6a19\u8a18\u4e2d\u592e\u3002", "chargeRoots"],
    ["Briar Boar King", "\u834a\u68d8\u91ce\u8c6c\u738b", "The King announces long charges and leaves thorn patches behind.", "\u91ce\u8c6c\u738b\u6703\u9810\u544a\u9577\u8ddd\u96e2\u885d\u92d2\uff0c\u4e26\u7559\u4e0b\u834a\u68d8\u3002", "briar", "bossBriar"],
    ["Scorch Marks", "\u7126\u71b1\u5370\u8a18", "Orange warning circles ignite after a clear delay.", "\u6a59\u8272\u8b66\u793a\u5708\u6703\u5728\u660e\u78ba\u5ef6\u9072\u5f8c\u9ede\u71c3\u3002", "scorch"],
    ["Ember Trail", "\u9918\u71fc\u8db3\u8de1", "Fast enemies leave short-lived hot ground when defeated.", "\u5feb\u901f\u6575\u4eba\u88ab\u64ca\u6557\u5f8c\u7559\u4e0b\u77ed\u66ab\u71b1\u5340\u3002", "emberTrail"],
    ["Furnace Edges", "\u7194\u7210\u908a\u7de3", "The safe area shifts away from one glowing edge.", "\u5b89\u5168\u5340\u6703\u96e2\u958b\u767c\u5149\u908a\u7de3\u79fb\u52d5\u3002", "hotEdge"],
    ["Cinder Hunt", "\u71fc\u5f71\u7375\u5834", "Cinder panthers blink, then reappear beside warning marks.", "\u71fc\u5f71\u9ed1\u8c79\u6703\u9583\u73fe\uff0c\u518d\u5f9e\u8b66\u793a\u5370\u8a18\u65c1\u51fa\u73fe\u3002", "blink"],
    ["Cinder Panther", "\u71fc\u706b\u9ed1\u8c79", "The Panther blinks across the grove and burns each landing point.", "\u9ed1\u8c79\u6703\u8de8\u5834\u9583\u73fe\uff0c\u4e26\u9ede\u71c3\u6bcf\u500b\u843d\u9ede\u3002", "cinder", "bossCinder"],
    ["Lightning Signs", "\u9583\u96fb\u5fb5\u5146", "Blue circles mark each lightning strike before impact.", "\u85cd\u8272\u5708\u6703\u5728\u9583\u96fb\u843d\u4e0b\u524d\u6a19\u8a18\u4f4d\u7f6e\u3002", "lightning"],
    ["Gale Drift", "\u5f37\u98a8\u504f\u79fb", "A changing wind pushes loose drops, changing collection routes.", "\u8b8a\u5316\u7684\u98a8\u6703\u63a8\u52d5\u6389\u843d\u7269\uff0c\u6539\u8b8a\u6536\u96c6\u8def\u7dda\u3002", "gale"],
    ["Chain Thunder", "\u9023\u9396\u96f7\u9cf4", "Lightning strikes the player mark, then two mirrored marks.", "\u9583\u96fb\u5148\u653b\u64ca\u73a9\u5bb6\u5370\u8a18\uff0c\u518d\u653b\u64ca\u5169\u500b\u93e1\u50cf\u9ede\u3002", "chainLightning"],
    ["Roc Scouts", "\u96f7\u9ce5\u65a5\u5019", "Runner waves arrive between alternating lightning lanes.", "\u5feb\u901f\u7378\u6f6e\u6703\u5728\u4ea4\u66ff\u9583\u96fb\u8d70\u5eca\u4e4b\u9593\u51fa\u73fe\u3002", "stormLanes"],
    ["Tempest Roc", "\u66b4\u98a8\u5de8\u9d6c", "The Roc dives through a marked lane and calls three lightning zones.", "\u5de8\u9d6c\u6703\u7a7f\u8d8a\u6a19\u8a18\u8d70\u5eca\u4fef\u885d\uff0c\u4e26\u53ec\u559a\u4e09\u500b\u96f7\u5340\u3002", "tempest", "bossTempest"],
    ["Eclipse Ring", "\u65e5\u8755\u4e4b\u74b0", "Stay inside the slowly moving light ring when darkness pulses.", "\u9ed1\u6697\u8108\u885d\u6642\u8981\u7559\u5728\u7de9\u6162\u79fb\u52d5\u7684\u5149\u74b0\u5167\u3002", "eclipseRing"],
    ["Rotating Seal", "\u65cb\u8f49\u5c01\u5370", "Root, scorch, and lightning warnings rotate one at a time.", "\u6839\u7cfb\u3001\u71b1\u5340\u8207\u9583\u96fb\u8b66\u793a\u6703\u4f9d\u5e8f\u8f2a\u66ff\u3002", "rotatingSeal"],
    ["Shadow Convergence", "\u6697\u5f71\u532f\u6d41", "Shielded enemies and charge waves demand target priority.", "\u5e36\u76fe\u6575\u4eba\u8207\u885d\u92d2\u6f6e\u8981\u6c42\u6b63\u78ba\u76ee\u6a19\u9806\u5e8f\u3002", "convergence"],
    ["Last Key Road", "\u6700\u5f8c\u91d1\u9470\u8def", "Keys move between safe pockets while combined hazards return.", "\u7d44\u5408\u5371\u96aa\u91cd\u73fe\u6642\uff0c\u91d1\u9470\u6703\u5728\u5b89\u5168\u7a7a\u9593\u9593\u79fb\u52d5\u3002", "lastRoad"],
    ["Eclipse Colossus", "\u65e5\u8755\u5de8\u50cf", "The final guardian rotates all three warnings around a moving safe ring.", "\u6700\u7d42\u5b88\u885b\u5728\u79fb\u52d5\u5b89\u5168\u74b0\u5468\u570d\u8f2a\u66ff\u4e09\u7a2e\u8b66\u793a\u3002", "eclipse", "bossEclipse"],
  ];

  const stages = stageRows.map((row, index) => ({
    number: index + 1,
    region: Math.floor(index / 5),
    nameEn: row[0],
    nameZh: row[1],
    ruleEn: row[2],
    ruleZh: row[3],
    modifier: row[4],
    bossImage: row[5] || null,
    targetKeys: 2 + Math.floor(index / 6),
  }));
  const spanishRegionNames = ["Arboleda de Cristal","Fragmentos Lunares","Laberinto de Zarzas","Grieta de Brasas","Corona de Tormenta","Corazón del Eclipse"];
  regions.forEach((region,index)=>{region.es=spanishRegionNames[index];});
  const spanishStageRows = [
    ["Primera patrulla","Aprende las rutas de llaves mientras se acercan zorros de sombra."],
    ["Corriente de cristal","Los cristales sueltos derivan hacia la sombra más cercana."],
    ["Ocaso de panteras","Panteras rápidas llegan en grupos de carga marcados."],
    ["Anillo de jabalíes","Jabalíes acorazados cierran la arena desde lados opuestos."],
    ["Acechador de raíces","Los círculos de raíces ralentizan; derrota al guardián antes del tiempo."],
    ["Faroles de polilla","Pulsos prisma obligan a dar giros amplios por la arena."],
    ["Sendero reflejado","Dos círculos de aviso aparecen en posiciones reflejadas."],
    ["Órbita de fragmentos","Zonas giratorias vuelven inseguro el centro por intervalos."],
    ["Manada velada","Cada tercer enemigo entra con un escudo temporal de cristal."],
    ["Reina Polilla Prisma","La Reina alterna escudo de cristal y explosiones radiales."],
    ["Zonas de raíces","Raíces anunciadas castigan quedarse quieto."],
    ["Carriles de espinas","Carriles alternos dejan una ruta de escape legible."],
    ["Oleada de zarzas","Los jabalíes paran, destellan y luego cargan."],
    ["Colmillos cruzados","Cargadores llegan de cuatro lados mientras las raíces marcan el centro."],
    ["Rey Jabalí de Zarzas","El Rey anuncia cargas largas y deja espinas detrás."],
    ["Marcas ardientes","Círculos naranjas se encienden tras una demora clara."],
    ["Rastro de brasas","Enemigos rápidos dejan suelo caliente al caer."],
    ["Bordes del horno","La zona segura se aleja de un borde brillante."],
    ["Caza de ceniza","Panteras de ceniza parpadean y reaparecen junto a las marcas."],
    ["Pantera de Ceniza","La Pantera cruza la arboleda y quema cada lugar donde cae."],
    ["Señales de relámpago","Círculos azules marcan cada impacto antes de caer."],
    ["Deriva del vendaval","El viento empuja los objetos y cambia las rutas de recogida."],
    ["Trueno encadenado","El rayo golpea tu marca y luego dos marcas reflejadas."],
    ["Exploradores del Roc","Oleadas rápidas llegan entre carriles alternos de rayos."],
    ["Roc de la Tempestad","El Roc atraviesa un carril marcado y llama tres zonas de rayos."],
    ["Anillo del eclipse","Quédate dentro del anillo móvil cuando pulse la oscuridad."],
    ["Sello giratorio","Avisos de raíces, fuego y rayos se alternan uno por uno."],
    ["Convergencia de sombras","Enemigos con escudo y cargas exigen priorizar objetivos."],
    ["Camino de la última llave","Las llaves se mueven entre zonas seguras mientras vuelven los peligros."],
    ["Coloso del Eclipse","El guardián final rota los tres avisos alrededor de un anillo seguro móvil."]
  ];
  stages.forEach((stage,index)=>{stage.nameEs=spanishStageRows[index][0];stage.ruleEs=spanishStageRows[index][1];});

  const patrolRanks = [
    { threshold: 0, name: "rankScout" },
    { threshold: 10, name: "rankKeeper" },
    { threshold: 30, name: "rankRanger" },
    { threshold: 75, name: "rankGuardian" },
    { threshold: 150, name: "rankWarden" },
  ];

  const images = {};
  let locale = window.WonderI18n?.locale?.() || localStorage.getItem(localeKey) || "en";
  let save = loadSave();
  let state = makeState();
  let playfieldLabelSignature = "";
  let hudValues = Object.create(null);
  let hintValue = "";
  let nextHintUpdate = 0;
  let backingScale = 1;
  let arenaLayerSignature = "";
  const renderMetrics = { arenaLayerBuilds: 0, hudWrites: 0, hintEvaluations: 0, fallbackFrameClears: 0 };
  let charmPurchasePending = false;
  let charmConfirmTimer = 0;
  let lastFrame = 0;
  let battlePanelMetrics = null;
  let activePointerId = null;
  let runToken = 0;
  let battleSuspended = false;
  const soundGate = {};
  const keys = new Set();
  const movementKeys = new Set(["arrowleft", "arrowright", "arrowup", "arrowdown", "a", "d", "w", "s"]);

  function playSound(name, gap = 0.08) {
    const now = performance.now();
    if (soundGate[name] && now - soundGate[name] < gap * 1000) return;
    soundGate[name] = now;
    window.WonderSound?.play(name);
  }

  function loadSave() {
    try {
      const stored = JSON.parse(localStorage.getItem(saveKey) || "{}");
      const source = stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
      const wholeNumber = (value, fallback, minimum = 0) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? Math.max(minimum, Math.floor(parsed)) : fallback;
      };
      const unlockedStage = Math.min(STAGE_COUNT, wholeNumber(source.unlockedStage, 1, 1));
      const selectedStage = Math.min(unlockedStage, wholeNumber(source.selectedStage, unlockedStage, 1));
      return {
        bestKeys: wholeNumber(source.bestKeys, 0),
        bestLevel: wholeNumber(source.bestLevel, 1, 1),
        playCount: wholeNumber(source.playCount, 0),
        totalKeys: wholeNumber(source.totalKeys, 0),
        crystalCharm: source.crystalCharm === true,
        unlockedStage,
        selectedStage,
        completedStages: Array.isArray(source.completedStages)
          ? [...new Set(source.completedStages.map(Number).filter((stage) => stage >= 1 && stage <= STAGE_COUNT))].sort((a, b) => a - b)
          : [],
        stageBestKeys: source.stageBestKeys && typeof source.stageBestKeys === "object" ? { ...source.stageBestKeys } : {},
      };
    } catch {
      return { bestKeys: 0, bestLevel: 1, playCount: 0, totalKeys: 0, crystalCharm: false, unlockedStage: 1, selectedStage: 1, completedStages: [], stageBestKeys: {} };
    }
  }

  function persist() {
    localStorage.setItem(saveKey, JSON.stringify(save));
  }

  function t(key, data = {}) {
    const value = text[locale]?.[key] || text.en[key] || key;
    return Object.entries(data).reduce((out, [name, item]) => out.replaceAll(`{${name}}`, String(item)), value);
  }

  function renderExpeditionRecord() {
    if (!nodes.expeditionRecordText) return;
    nodes.expeditionRecordText.textContent = t("expeditionRecordText", {
      keys: Math.max(0, Number(save.bestKeys) || 0),
      level: Math.max(1, Number(save.bestLevel) || 1),
      runs: Math.max(0, Number(save.playCount) || 0),
    });
    renderPatrolRank();
  }

  function renderMainProgress() {
    if (!nodes.mainProgress) return;
    nodes.mainProgress.textContent = t("mainProgress", { cleared: save.completedStages.length });
  }

  function setStagePage(page = "stages") {
    const equipmentOpen = page === "equipment";
    nodes.stagePage?.classList.toggle("hidden", equipmentOpen);
    nodes.equipmentPage?.classList.toggle("hidden", !equipmentOpen);
    nodes.stageTabBtn?.classList.toggle("is-active", !equipmentOpen);
    nodes.equipmentTabBtn?.classList.toggle("is-active", equipmentOpen);
    nodes.stageTabBtn?.setAttribute("aria-pressed", String(!equipmentOpen));
    nodes.equipmentTabBtn?.setAttribute("aria-pressed", String(equipmentOpen));
    if (equipmentOpen) {
      nodes.stageSelectTitle.textContent = t("equipmentTab");
      renderExpeditionRecord();
      updateDiamondShop();
    } else {
      renderStageSelector(false);
    }
  }

  function patrolRankFor(totalKeys = 0) {
    const total = Math.max(0, Number(totalKeys) || 0);
    let index = 0;
    patrolRanks.forEach((rank, rankIndex) => {
      if (total >= rank.threshold) index = rankIndex;
    });
    const current = patrolRanks[index];
    const next = patrolRanks[index + 1] || null;
    const progress = next
      ? Math.max(0, Math.min(1, total / next.threshold))
      : 1;
    return { index, current, next, total, progress };
  }

  function renderPatrolRank() {
    if (!nodes.patrolRankText || !nodes.patrolRankProgressText || !nodes.patrolRankFill) return;
    const rank = patrolRankFor(save.totalKeys);
    nodes.patrolRankText.textContent = t("patrolRankTitle", { rank: t(rank.current.name) });
    nodes.patrolRankProgressText.textContent = rank.next
      ? t("patrolRankProgress", { current: rank.total, target: rank.next.threshold })
      : t("patrolRankComplete", { current: rank.total });
    nodes.patrolRankFill.style.width = `${Math.round(rank.progress * 100)}%`;
  }

  function updatePageMeta() {
    const pageTitle = `${t("title")} - WeightPlay`;
    const description = t("pageDescription");
    const ogDescription = t("ogDescription");
    document.title = pageTitle;
    document.querySelector?.('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector?.('meta[property="og:title"]')?.setAttribute("content", pageTitle);
    document.querySelector?.('meta[property="og:description"]')?.setAttribute("content", ogDescription);
  }

  function makePlayer() {
    const hasCharm = Boolean(save.crystalCharm);
    const maxHp = hasCharm ? 8 : 7;
    return {
      x: W / 2,
      y: H / 2,
      tx: W / 2,
      ty: H / 2,
      hp: maxHp,
      maxHp,
      speed: 238,
      range: 238,
      damage: 1,
      cooldown: 0.78,
      shotTimer: 0,
      pickup: hasCharm ? 68 : 54,
    };
  }

  function makeState() {
    const stageNumber = Math.max(1, Math.min(STAGE_COUNT, Number(save?.selectedStage) || 1));
    return {
      mode: "menu",
      stage: stageNumber,
      stageConfig: stages[stageNumber - 1],
      timeLeft: RUN_SECONDS,
      player: makePlayer(),
      level: 1,
      xp: 0,
      xpNeed: 4,
      keys: 0,
      calmed: 0,
      survived: 0,
      spawnTimer: 0.95,
      spawnCount: 0,
      key: randomPoint(120),
      enemies: [],
      xpDrops: [],
      shots: [],
      sparks: [],
      floaters: [],
      hazards: [],
      mechanicTimer: 2.8,
      mechanicStep: 0,
      hazardDamageTimer: 0,
      bossSpawned: false,
      bossDefeated: false,
    };
  }

  function randomPoint(pad = 70) {
    return { x: pad + Math.random() * (W - pad * 2), y: pad + Math.random() * (H - pad * 2) };
  }

  function image(src) {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    return img;
  }

  function preload() {
    const entries = Object.entries(assetPaths);
    let done = 0;
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      nodes.loadingText.textContent = "100%";
      nodes.loadingFill.style.width = "100%";
      nodes.loadingPanel.classList.add("hidden");
      draw();
      window.WonderAnalytics?.track("game_ready", { game_id: GAME_ID, prototype: true });
      maybeAutostartSmokeRun();
    };
    entries.forEach(([key, src]) => {
      const img = image(src);
      images[key] = img;
      img.onload = img.onerror = () => {
        done += 1;
        const pct = Math.round((done / entries.length) * 100);
        nodes.loadingText.textContent = `${pct}%`;
        nodes.loadingFill.style.width = `${pct}%`;
        if (done >= entries.length) finish();
      };
    });
    window.setTimeout(finish, 1600);
  }

  function setLocale(next) {
    clearCharmConfirmation();
    const current = window.WonderI18n?.actualLocale?.();
    const requested = next === "zh-Hant" && current === "zh-Hans" ? current : next || "en";
    if (current !== requested) window.WonderI18n?.setLocale?.(requested);
    locale = window.WonderI18n?.legacyLocale?.(requested) || requested;
    localStorage.setItem(localeKey, requested);
    document.documentElement.lang = requested;
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
    document.querySelectorAll("[data-aria-ui]").forEach((node) => {
      node.setAttribute("aria-label", t(node.dataset.ariaUi));
    });
    playfieldLabelSignature = "";
    nodes.menuBtn.setAttribute("aria-label", t("menu"));
    nodes.resultMenuBtn.setAttribute("aria-label", t("backToStages"));
    nodes.settingsBtn?.setAttribute("aria-label", t("audioSettings"));
    nodes.settingsPopover?.setAttribute("aria-label", t("audioSettings"));
    updatePageMeta();
    nodes.localeSelect.value = requested;
    renderMainProgress();
    renderExpeditionRecord();
    renderHud(true);
    updateDiamondShop();
    updateMenuSound();
    if (!nodes.stagePanel.classList.contains("hidden")) renderStageSelector(false);
  }

  function getWallet() {
    return window.WeightPlayWallet || null;
  }

  function diamondBalance() {
    return getWallet()?.read?.().diamonds || 0;
  }

  function updateMenuSound() {
    if (!nodes.menuSoundBtn) return;
    const muted = Boolean(window.WonderSound?.isMuted?.());
    nodes.menuSoundBtn.setAttribute("aria-pressed", String(!muted));
    nodes.menuSoundBtn.setAttribute("aria-label", `${t("soundEffects")}: ${t(muted ? "soundOff" : "soundOn")}`);
    if (nodes.soundStateText) nodes.soundStateText.textContent = t(muted ? "soundOff" : "soundOn");
  }

  function setSettingsOpen(open, restoreFocus = false) {
    const nextOpen = Boolean(open);
    nodes.settingsPopover?.classList.toggle("hidden", !nextOpen);
    nodes.settingsBtn?.setAttribute("aria-expanded", String(nextOpen));
    if (!nextOpen && restoreFocus) nodes.settingsBtn?.focus({ preventScroll: true });
  }

  function updateDiamondShop(message = "") {
    if (!nodes.charmBtn || !nodes.diamondBalance) return;
    const owned = Boolean(save.crystalCharm);
    const balance = diamondBalance();
    nodes.diamondBalance.textContent = String(balance);
    nodes.charmCost.textContent = owned ? "\u2713" : String(crystalCharmCost);
    nodes.charmBtn.disabled = owned || balance < crystalCharmCost;
    const after = Math.max(0, balance - crystalCharmCost);
    const status = message || (owned
      ? t("charmOwned")
      : charmPurchasePending
        ? t("charmConfirm", { before: balance, after })
      : balance < crystalCharmCost
        ? t("charmNeed", { cost: crystalCharmCost, balance })
        : t("charmBuy", { cost: crystalCharmCost }));
    nodes.charmBtn.setAttribute("aria-label", charmPurchasePending ? t("charmConfirmLabel", { before:balance, after }) : `${t("charmName")} · ${owned ? t("charmOwned") : t("charmEffect")} · ${status}`);
    nodes.charmBtn.classList[charmPurchasePending ? "add" : "remove"]("is-confirming");
    nodes.charmStatus.textContent = status;
  }

  function clearCharmConfirmation(render = false) {
    if (typeof clearTimeout === "function") clearTimeout(charmConfirmTimer);
    charmConfirmTimer = 0;
    charmPurchasePending = false;
    if (render) updateDiamondShop();
  }

  function buyCrystalCharm() {
    if (save.crystalCharm) {
      clearCharmConfirmation();
      updateDiamondShop();
      return;
    }
    const balance = diamondBalance();
    if (balance < crystalCharmCost) {
      clearCharmConfirmation();
      updateDiamondShop(t("charmNeed", { cost: crystalCharmCost, balance }));
      playSound("wrong", 0.2);
      return;
    }
    if (!charmPurchasePending) {
      charmPurchasePending = true;
      charmConfirmTimer = setTimeout(() => clearCharmConfirmation(true), 5000);
      updateDiamondShop();
      return;
    }
    clearCharmConfirmation();
    const wallet = getWallet();
    if (!wallet?.spendDiamonds || !wallet.spendDiamonds(crystalCharmCost)) {
      updateDiamondShop(t("charmNeed", { cost: crystalCharmCost, balance: diamondBalance() }));
      playSound("wrong", 0.2);
      return;
    }
    save.crystalCharm = true;
    persist();
    updateDiamondShop(t("charmBought", { balance: diamondBalance() }));
    playSound("success", 0.2);
    window.WonderAnalytics?.track("diamond_spend", { game_id: GAME_ID, item: "crystal_charm", cost: crystalCharmCost, balance: diamondBalance() });
  }

  function show(panel) {
    [nodes.menuPanel, nodes.stagePanel, nodes.gamePanel, nodes.resultPanel, nodes.upgradePanel].forEach((node) => node.classList.add("hidden"));
    const resultOpen = panel === nodes.resultPanel;
    if (resultOpen) nodes.gamePanel.classList.remove("hidden");
    panel.classList.remove("hidden");
    const battleLive = $("battleLive");
    battleLive.inert = resultOpen;
    if (resultOpen) battleLive.setAttribute("aria-hidden", "true");
    else battleLive.removeAttribute("aria-hidden");
    const stageOpen = panel === nodes.stagePanel;
    setSettingsOpen(false);
    if (stageOpen) nodes.stagePanelHead?.append(nodes.settingsControl);
    else nodes.topbar?.append(nodes.settingsControl);
    document.body?.classList.toggle("crystal-stage-select", stageOpen);
    document.body?.classList.toggle("crystal-playing", panel !== nodes.menuPanel && !stageOpen);
    updateCrystalBattleViewport();
    if (resultOpen) requestAnimationFrame(updateCrystalBattleViewport);
  }

  function updateCrystalBattleViewport() {
    const battleOpen = document.body?.classList.contains("crystal-playing");
    const stageOpen = document.body?.classList.contains("crystal-stage-select");
    if (!battleOpen && !stageOpen) return;
    const viewport = window.visualViewport;
    const visualWidth = Math.round(viewport?.width || 0);
    const visualHeight = Math.round(viewport?.height || 0);
    const useVisual = visualWidth > 0
      && visualHeight > 0
      && Math.abs(visualWidth - innerWidth) <= 2
      && visualHeight <= innerHeight + 2;
    const root = document.documentElement.style;
    root.setProperty("--crystal-vw", `${useVisual ? visualWidth : innerWidth}px`);
    root.setProperty("--crystal-vh", `${useVisual ? visualHeight : innerHeight}px`);
    if (stageOpen) return;
    const resultOpen = !nodes.resultPanel.classList.contains("hidden");
    if (!resultOpen) {
      battlePanelMetrics = measureBattlePanel();
    } else if (battlePanelMetrics) {
      nodes.resultPanel.classList.toggle("transformed-host", battlePanelMetrics.transformed);
      nodes.resultPanel.style.width = `${battlePanelMetrics.width}px`;
      nodes.resultPanel.style.height = `${battlePanelMetrics.height}px`;
      nodes.resultPanel.style.minHeight = `${battlePanelMetrics.height}px`;
      nodes.resultPanel.style.top = `${-battlePanelMetrics.paddingTop}px`;
    }
    syncCanvasBackingStore();
  }

  function syncCanvasBackingStore(force = false) {
    if (!document.body?.classList.contains("crystal-playing")) return false;
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;
    const deviceScale = Math.min(2, Math.max(1, Number(window.devicePixelRatio) || 1));
    const displayScale = Math.min(rect.width / W, rect.height / H) * deviceScale;
    const pixelBudgetScale = Math.sqrt(MAX_BACKING_PIXELS / (W * H));
    const nextScale = Math.max(MIN_BACKING_SCALE, Math.min(1, displayScale, pixelBudgetScale));
    const width = Math.max(1, Math.floor(W * nextScale));
    const height = Math.max(1, Math.floor(H * nextScale));
    if (!force
      && renderCanvas.width === width
      && renderCanvas.height === height) return false;
    renderCanvas.width = width;
    renderCanvas.height = height;
    // Keep the visible output surface on the same physical-pixel budget as
    // the render layer. CSS preserves the logical playfield geometry and
    // pointer mapping, so a larger fixed backing store only adds a second
    // full-frame upscale/composite on every animation frame.
    canvas.width = width;
    canvas.height = height;
    backingScale = Math.min(width / W, height / H);
    ctx.setTransform(backingScale, 0, 0, backingScale, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    displayCtx.imageSmoothingEnabled = true;
    displayCtx.imageSmoothingQuality = "high";
    arenaLayerSignature = "";
    ensureArenaLayer();
    return true;
  }

  function measureBattlePanel() {
    const panelStyle = getComputedStyle(nodes.gamePanel);
    const panelRect = nodes.gamePanel.getBoundingClientRect();
    const transform = panelStyle.transform === "none" ? null : new DOMMatrixReadOnly(panelStyle.transform);
    const scale = Math.abs(transform?.a || 1);
    return {
      width: panelRect.width / scale,
      height: panelRect.height / scale,
      paddingTop: Number.parseFloat(panelStyle.paddingTop) || 0,
      transformed: Math.abs(scale - 1) > 0.001,
    };
  }

  window.addEventListener?.("resize", updateCrystalBattleViewport, { passive: true });
  window.addEventListener?.("orientationchange", updateCrystalBattleViewport, { passive: true });
  window.visualViewport?.addEventListener("resize", updateCrystalBattleViewport, { passive: true });

  function scheduleLoop(token = runToken) {
    requestAnimationFrame((now) => loop(now, token));
  }

  function clearInput() {
    keys.clear();
    const pointerId = activePointerId;
    activePointerId = null;
    if (pointerId !== null && canvas.hasPointerCapture?.(pointerId)) canvas.releasePointerCapture(pointerId);
  }

  function resetFrameClock() {
    lastFrame = performance.now();
  }

  function stageName(config) {
    return locale === "zh-Hant" ? config.nameZh : locale === "es" ? config.nameEs : config.nameEn;
  }

  function stageRule(config) {
    return locale === "zh-Hant" ? config.ruleZh : locale === "es" ? config.ruleEs : config.ruleEn;
  }

  function showStageSelection(shouldScroll = true) {
    runToken += 1;
    clearInput();
    setUpgradeModalOpen(false, false);
    state.mode = "stage";
    show(nodes.stagePanel);
    setStagePage("stages");
    renderStageSelector(shouldScroll);
    requestAnimationFrame(() => nodes.stageRail.querySelector(".stage-card.is-selected")?.focus({ preventScroll: true }));
  }

  function renderStageSelector(shouldScroll = true) {
    if (!nodes.stageRail) return;
    nodes.stageSelectTitle.textContent = locale === "zh-Hant" ? "\u9078\u64c7\u6c34\u6676\u8def\u7dda" : locale === "es" ? "Elige una ruta de cristal" : "Choose a Crystal Route";
    nodes.stageProgressText.textContent = t("stageProgress", { unlocked: save.unlockedStage });
    nodes.stageSetupText.textContent = t("stageSetup");
    $("stageSwipeText").textContent = t("stageSwipe");
    $("stageDeployText").textContent = t("stageDeploy");
    nodes.stageRail.innerHTML = "";
    stages.forEach((config) => {
      const locked = config.number > save.unlockedStage;
      const cleared = save.completedStages.includes(config.number);
      const selected = config.number === save.selectedStage;
      const region = regions[config.region];
      const card = document.createElement("button");
      card.type = "button";
      card.className = `stage-card${selected ? " is-selected is-browsed" : ""}${cleared ? " is-cleared" : ""}${config.bossImage ? " is-boss-stage" : ""}`;
      card.dataset.stage = String(config.number);
      card.setAttribute("aria-disabled", String(locked));
      card.style.setProperty("--stage-overlay", region.color);
      if (locked) card.tabIndex = -1;
      const regionName = locale === "zh-Hant" ? region.zh : locale === "es" ? region.es : region.en;
      const bossText = config.bossImage ? `<small>${t("bossCheckpoint")}</small>` : "";
      const objective = t("objective", { keys: config.targetKeys, boss: config.bossImage ? t("bossObjective") : "" });
      card.innerHTML = `<em>${regionName}</em><strong>${locale === "zh-Hant" ? `\u7b2c ${config.number} \u95dc` : `${t("stage")} ${config.number}`}</strong><span>${stageName(config)}</span><small>${stageRule(config)}</small>${bossText}<small>${objective}</small><small>${locked ? t("stageLocked") : cleared ? t("stageCleared") : t("stageReady")}</small>`;
      card.setAttribute("aria-label", `${regionName}. ${stageName(config)}. ${stageRule(config)}. ${objective}. ${locked ? t("stageLocked") : cleared ? t("stageCleared") : t("stageReady")}`);
      card.addEventListener("click", () => {
        if (locked) return;
        if (save.selectedStage !== config.number) {
          save.selectedStage = config.number;
          persist();
          renderStageSelector(true);
          return;
        }
        startRun();
      });
      nodes.stageRail.appendChild(card);
    });
    if (shouldScroll) requestAnimationFrame(() => nodes.stageRail.querySelector(".stage-card.is-selected")?.scrollIntoView({ block: "nearest", inline: "center" }));
  }

  let stageScrollTimer = 0;
  function syncStageFromRail() {
    clearTimeout(stageScrollTimer);
    stageScrollTimer = setTimeout(() => {
      if (nodes.stagePanel.classList.contains("hidden")) return;
      const railRect = nodes.stageRail.getBoundingClientRect();
      const center = railRect.left + railRect.width / 2;
      const cards = [...nodes.stageRail.querySelectorAll(".stage-card")];
      const nearest = cards.reduce((best, card) => {
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - center);
        return !best || distance < best.distance ? { card, distance } : best;
      }, null)?.card;
      const stageNumber = Number(nearest?.dataset.stage);
      if (!stageNumber || stageNumber > save.unlockedStage) return;
      save.selectedStage = stageNumber;
      persist();
      cards.forEach((card) => {
        const active = card === nearest;
        card.classList.toggle("is-selected", active);
        card.classList.toggle("is-browsed", active);
        if (active) card.setAttribute("aria-current", "true");
        else card.removeAttribute("aria-current");
      });
    }, 90);
  }

  function startRun() {
    clearCharmConfirmation();
    setUpgradeModalOpen(false, false);
    runToken += 1;
    clearInput();
    state = makeState();
    state.stage = save.selectedStage;
    state.stageConfig = stages[state.stage - 1];
    state.mode = "running";
    battleSuspended = Boolean(document.hidden);
    prepareSmokeCombatDemo();
    save.playCount += 1;
    persist();
    renderMainProgress();
    renderExpeditionRecord();
    show(nodes.gamePanel);
    window.WeightPlayGame?.exitMobileGameMode?.();
    window.scrollTo?.({ top: 0, left: 0, behavior: "instant" });
    hudValues = Object.create(null);
    hintValue = "";
    nextHintUpdate = 0;
    renderMetrics.arenaLayerBuilds = 0;
    renderMetrics.hudWrites = 0;
    renderMetrics.hintEvaluations = 0;
    renderMetrics.fallbackFrameClears = 0;
    syncCanvasBackingStore(true);
    renderHud(true);
    requestAnimationFrame(() => {
      syncCanvasBackingStore();
      canvas.focus({ preventScroll: true });
    });
    lastFrame = performance.now();
    playSound("start", 0.2);
    window.WonderAnalytics?.track("game_start", { game_id: GAME_ID, locale, prototype: true });
    scheduleLoop();
  }

  function maybeAutostartSmokeRun() {
    const search = window.location?.search || "";
    if (!search.includes("smoke=1") || !search.includes("autostart=1")) return;
    window.setTimeout(() => {
      if (state.mode === "menu") startRun();
    }, 40);
  }

  function prepareSmokeCombatDemo() {
    const search = window.location?.search || "";
    if (!search.includes("smoke=1") || !search.includes("combatdemo=1")) return;
    const p = state.player;
    state.spawnTimer = 999;
    state.key = { x: p.x - 170, y: p.y - 28 };
    state.enemies.push({
      x: p.x + 136,
      y: p.y + 6,
      hp: 7,
      maxHp: 7,
      speed: 12,
      size: 72,
      damage: 0.55,
      image: "tank",
      hit: 0,
      touch: 0,
    });
  }

  function loop(now, token = runToken) {
    if (token !== runToken) return;
    const elapsedDt = Math.max(0, (now - lastFrame) / 1000 || 0);
    const physicsDt = Math.min(0.033, elapsedDt);
    lastFrame = now;
    if (state.mode === "running" && !battleSuspended) update(physicsDt, elapsedDt);
    draw();
    if (state.mode === "running") scheduleLoop(token);
  }

  function update(dt, elapsedDt = dt) {
    state.timeLeft = Math.max(0, state.timeLeft - elapsedDt);
    state.survived = RUN_SECONDS - state.timeLeft;
    movePlayer(dt);
    updateStageMechanics(dt);
    spawnEnemies(dt);
    updateEnemies(dt);
    updateShots(dt);
    updateDrops();
    updateKey();
    updateFloaters(dt);
    renderHud();
    if (state.timeLeft <= 0) endRun("time");
    if (state.player.hp <= 0) endRun("fail");
  }

  function addHazard(kind, options = {}) {
    state.hazards.push({
      kind,
      x: options.x ?? state.player.x,
      y: options.y ?? state.player.y,
      r: options.r ?? 100,
      width: options.width ?? 150,
      height: options.height ?? H,
      warn: options.warn ?? 1.15,
      life: options.life ?? 2.5,
      damage: options.damage ?? 0.75,
      color: options.color || "#f59e0b",
      tick: 0,
    });
  }

  function spawnBoss() {
    const config = state.stageConfig;
    if (!config?.bossImage || state.bossSpawned) return;
    state.bossSpawned = true;
    const edge = config.modifier === "tempest" ? 0 : 1;
    const hp = 22 + state.stage * 1.25;
    state.enemies.push({
      x: edge ? W + 120 : W / 2,
      y: edge ? H * 0.34 : -120,
      hp,
      maxHp: hp,
      speed: 34 + config.region * 3,
      baseSpeed: 34 + config.region * 3,
      size: 148,
      damage: 0.9,
      image: config.bossImage,
      hit: 0,
      touch: 0,
      isBoss: true,
      shielded: config.modifier === "prism",
      abilityTimer: 2.2,
      chargeTimer: 2.8,
    });
    addFloater(locale === "zh-Hant" ? "\u9996\u9818\u73fe\u8eab" : locale === "es" ? "LLEGA EL JEFE" : "BOSS ARRIVES", W / 2, 130, "#ffe76c");
  }

  function updateStageMechanics(dt) {
    const config = state.stageConfig || stages[0];
    if (config.bossImage && state.survived >= 18 && !state.bossSpawned) spawnBoss();
    state.mechanicTimer -= dt;
    state.hazardDamageTimer = Math.max(0, state.hazardDamageTimer - dt);
    const interval = Math.max(2.1, 5.2 - config.region * 0.38);
    if (state.mechanicTimer <= 0) {
      state.mechanicTimer = interval;
      state.mechanicStep += 1;
      triggerStageMechanic(config.modifier);
    }
    const p = state.player;
    state.hazards = state.hazards.filter((hazard) => {
      hazard.warn -= dt;
      hazard.life -= dt;
      hazard.tick = Math.max(0, hazard.tick - dt);
      const active = hazard.warn <= 0;
      const inside = hazard.kind === "lane"
        ? Math.abs(p.x - hazard.x) <= hazard.width / 2 && Math.abs(p.y - hazard.y) <= hazard.height / 2
        : Math.hypot(p.x - hazard.x, p.y - hazard.y) <= hazard.r;
      if (active && inside && hazard.tick <= 0) {
        p.hp = Math.max(0, p.hp - hazard.damage);
        hazard.tick = 0.82;
        addSpark(p.x, p.y, hazard.color);
        playSound("hit", 0.3);
      }
      return hazard.life > 0;
    });
    if (state.safeZone) {
      state.safeZone.angle += dt * 0.42;
      state.safeZone.x = W / 2 + Math.cos(state.safeZone.angle) * 190;
      state.safeZone.y = H / 2 + Math.sin(state.safeZone.angle * 0.7) * 300;
      state.safeZone.pulse -= dt;
      if (state.safeZone.pulse <= 0) {
        state.safeZone.pulse = 2.4;
        if (Math.hypot(p.x - state.safeZone.x, p.y - state.safeZone.y) > state.safeZone.r) {
          p.hp = Math.max(0, p.hp - 0.8);
          addFloater("-1", p.x, p.y - 60, "#d8b4fe");
          playSound("hit", 0.3);
        }
      }
    }
    if (["gale", "lastRoad"].includes(config.modifier)) {
      const direction = Math.sin(state.survived / 5) >= 0 ? 1 : -1;
      state.xpDrops.forEach((drop) => { drop.x = Math.max(20, Math.min(W - 20, drop.x + direction * 24 * dt)); });
    }
    updateBossMechanics(dt);
  }

  function triggerStageMechanic(modifier) {
    const p = state.player;
    const mirrorCircle = (color = "#a78bfa") => {
      addHazard("circle", { x: p.x, y: p.y, r: 95, color });
      addHazard("circle", { x: W - p.x, y: H - p.y, r: 95, color });
    };
    if (["root", "rootPatches", "chargeRoots", "briar"].includes(modifier)) addHazard("circle", { x: p.x, y: p.y, r: 110, color: "#65a30d", damage: 0.55, life: 3.4 });
    if (["prismPulse", "mirror", "prism"].includes(modifier)) mirrorCircle();
    if (modifier === "orbit") {
      for (let i = 0; i < 3; i += 1) {
        const angle = state.mechanicStep * 0.7 + i * Math.PI * 2 / 3;
        addHazard("circle", { x: W / 2 + Math.cos(angle) * 230, y: H / 2 + Math.sin(angle) * 360, r: 82, color: "#c084fc" });
      }
    }
    if (["thornLanes", "stormLanes"].includes(modifier)) {
      const vertical = state.mechanicStep % 2 === 0;
      addHazard("lane", { x: vertical ? W * 0.25 : W / 2, y: vertical ? H / 2 : H * 0.34, width: vertical ? 150 : W, height: vertical ? H : 150, color: modifier === "stormLanes" ? "#60a5fa" : "#84cc16" });
      addHazard("lane", { x: vertical ? W * 0.75 : W / 2, y: vertical ? H / 2 : H * 0.66, width: vertical ? 150 : W, height: vertical ? H : 150, color: modifier === "stormLanes" ? "#60a5fa" : "#84cc16" });
    }
    if (["scorch", "emberTrail", "blink", "cinder"].includes(modifier)) addHazard("circle", { x: p.x, y: p.y, r: 105, color: "#f97316", damage: 0.7, life: 3.8 });
    if (modifier === "hotEdge") {
      const left = state.mechanicStep % 2 === 0;
      addHazard("lane", { x: left ? 90 : W - 90, y: H / 2, width: 180, height: H, color: "#fb923c", life: 4.4 });
    }
    if (["lightning", "chainLightning", "tempest"].includes(modifier)) {
      addHazard("circle", { x: p.x, y: p.y, r: 90, color: "#60a5fa", warn: 1.35, life: 2.6, damage: 0.9 });
      if (modifier !== "lightning") mirrorCircle("#60a5fa");
    }
    if (["eclipseRing", "rotatingSeal", "lastRoad", "eclipse"].includes(modifier) && !state.safeZone) state.safeZone = { x: W / 2, y: H / 2, r: modifier === "eclipse" ? 190 : 220, angle: 0, pulse: 2.4 };
    if (["rotatingSeal", "convergence", "lastRoad", "eclipse"].includes(modifier)) {
      const modes = ["rootPatches", "scorch", "lightning"];
      triggerStageMechanic(modes[state.mechanicStep % modes.length]);
    }
  }

  function updateBossMechanics(dt) {
    const boss = state.enemies.find((enemy) => enemy.isBoss);
    if (!boss) return;
    boss.abilityTimer -= dt;
    boss.chargeTimer -= dt;
    if (state.stageConfig.modifier === "prism") boss.shielded = Math.floor(state.survived / 3) % 2 === 0;
    if (["briar", "tempest"].includes(state.stageConfig.modifier)) {
      boss.speed = boss.chargeTimer <= 0 ? boss.baseSpeed * 4.2 : boss.baseSpeed;
      if (boss.chargeTimer <= -0.75) boss.chargeTimer = 4.6;
    }
    if (["cinder", "blink"].includes(state.stageConfig.modifier) && boss.abilityTimer <= 0) {
      addHazard("circle", { x: boss.x, y: boss.y, r: 112, color: "#f97316", warn: 0.7, life: 3.6 });
      boss.x = Math.max(100, Math.min(W - 100, state.player.x + (Math.random() < 0.5 ? -210 : 210)));
      boss.y = Math.max(120, Math.min(H - 120, state.player.y + (Math.random() < 0.5 ? -230 : 230)));
      boss.abilityTimer = 5.4;
    }
  }

  function movePlayer(dt) {
    const p = state.player;
    const rooted = state.hazards.some((hazard) => hazard.warn <= 0 && hazard.color === "#65a30d" && Math.hypot(p.x - hazard.x, p.y - hazard.y) <= hazard.r);
    const moveSpeed = p.speed * (rooted ? 0.55 : 1);
    let dx = 0;
    let dy = 0;
    if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
    if (keys.has("arrowright") || keys.has("d")) dx += 1;
    if (keys.has("arrowup") || keys.has("w")) dy -= 1;
    if (keys.has("arrowdown") || keys.has("s")) dy += 1;
    if (dx || dy) {
      const len = Math.hypot(dx, dy) || 1;
      p.x += (dx / len) * moveSpeed * dt;
      p.y += (dy / len) * moveSpeed * dt;
      p.tx = p.x;
      p.ty = p.y;
    } else {
      const mx = p.tx - p.x;
      const my = p.ty - p.y;
      const dist = Math.hypot(mx, my);
      if (dist > 3) {
        const step = Math.min(dist, moveSpeed * dt);
        p.x += (mx / dist) * step;
        p.y += (my / dist) * step;
      }
    }
    p.x = Math.max(42, Math.min(W - 42, p.x));
    p.y = Math.max(42, Math.min(H - 42, p.y));
    p.shotTimer -= dt;
    if (p.shotTimer <= 0) shootNearest();
  }

  function spawnEnemies(dt) {
    state.spawnTimer -= dt;
    if (state.spawnTimer > 0) return;
    if (state.enemies.length >= 18) {
      state.spawnTimer = 0.6;
      return;
    }
    const elapsed = RUN_SECONDS - state.timeLeft;
    const config = state.stageConfig || stages[0];
    const runnerChance = ["runnerRush", "blink", "cinder", "stormLanes"].includes(config.modifier) ? 0.58 : 0.26 + config.region * 0.035;
    const tankChance = ["tankRing", "charge", "chargeRoots", "briar", "convergence"].includes(config.modifier) ? 0.5 : 0.16 + config.region * 0.025;
    const type = ["basic", "drift"].includes(config.modifier)
      ? elapsed > 65 && Math.random() < 0.23 ? "tank" : elapsed > 35 && Math.random() < 0.34 ? "runner" : "basic"
      : (() => {
          const roll = Math.random();
          return elapsed > 42 && roll < tankChance ? "tank" : elapsed > 22 && roll < tankChance + runnerChance ? "runner" : "basic";
        })();
    const edge = Math.floor(Math.random() * 4);
    const pos = randomPoint(0);
    if (edge === 0) pos.y = -54;
    if (edge === 1) pos.x = W + 54;
    if (edge === 2) pos.y = H + 54;
    if (edge === 3) pos.x = -54;
    const stageHp = 1 + Math.floor((state.stage - 1) / 10) * 0.35;
    const stats = {
      basic: { hp: 2, speed: 68, size: 62, damage: 0.32, image: "basic" },
      runner: { hp: 1.5, speed: 102, size: 58, damage: 0.28, image: "runner" },
      tank: { hp: 5, speed: 44, size: 82, damage: 0.55, image: "tank" },
    }[type];
    state.spawnCount += 1;
    const hp = stats.hp * stageHp;
    const shielded = ["shielded", "convergence"].includes(config.modifier) && state.spawnCount % 3 === 0;
    state.enemies.push({ ...pos, ...stats, hp, maxHp: hp, baseSpeed: stats.speed, hit: 0, touch: 0, shielded, shieldHp: shielded ? 1.5 + config.region * 0.4 : 0, chargeTimer: Math.random() * 2 + 1.2 });
    state.spawnTimer = Math.max(0.72, 1.9 - elapsed * 0.0035 - config.region * 0.06);
  }

  const chargingEnemyModifiers = new Set(["charge", "chargeRoots", "briar", "convergence"]);

  function updateEnemies(dt) {
    const p = state.player;
    const chargingEnemies = chargingEnemyModifiers.has(state.stageConfig?.modifier);
    state.enemies.forEach((enemy) => {
      const dx = p.x - enemy.x;
      const dy = p.y - enemy.y;
      const dist = Math.hypot(dx, dy) || 1;
      if (!enemy.isBoss && chargingEnemies) {
        enemy.chargeTimer -= dt;
        enemy.speed = enemy.chargeTimer <= 0 ? (enemy.baseSpeed || enemy.speed) * 2.8 : (enemy.baseSpeed || enemy.speed);
        if (enemy.chargeTimer <= -0.55) enemy.chargeTimer = 3.1 + Math.random() * 1.6;
      }
      enemy.x += (dx / dist) * enemy.speed * dt;
      enemy.y += (dy / dist) * enemy.speed * dt;
      enemy.hit = Math.max(0, enemy.hit - dt);
      enemy.touch = Math.max(0, enemy.touch - dt);
      if (dist < (enemy.size + 42) * 0.42 && enemy.touch <= 0) {
        p.hp = Math.max(0, p.hp - enemy.damage);
        enemy.touch = 1.05;
        addSpark(p.x, p.y - 34, "#ff7b7b");
        addFloater(`-${Math.ceil(enemy.damage)}`, p.x, p.y - 74, "#ffb4b4");
        playSound("hit", 0.35);
      }
    });
  }

  function shootNearest() {
    const p = state.player;
    let target = null;
    let best = Infinity;
    state.enemies.forEach((enemy) => {
      const dist = Math.hypot(enemy.x - p.x, enemy.y - p.y);
      if (dist <= p.range && dist < best) {
        target = enemy;
        best = dist;
      }
    });
    if (!target) return;
    state.shots.push({ x: p.x, y: p.y - 22, px: p.x, py: p.y - 22, target, speed: 620, damage: p.damage, image: p.damage > 1.45 ? "blade" : "seed" });
    p.shotTimer = p.cooldown;
  }

  function updateShots(dt) {
    state.shots = state.shots.filter((shot) => {
      if (!state.enemies.includes(shot.target) || shot.target.hp <= 0) return false;
      const dx = shot.target.x - shot.x;
      const dy = shot.target.y - shot.y;
      const dist = Math.hypot(dx, dy) || 1;
      const step = Math.min(dist, shot.speed * dt);
      shot.px = shot.x;
      shot.py = shot.y;
      shot.x += (dx / dist) * step;
      shot.y += (dy / dist) * step;
      if (dist <= 24) {
        damageEnemy(shot.target, shot.damage);
        shot.target.hit = 0.16;
        addSpark(shot.target.x, shot.target.y, "#67e8f9");
        return false;
      }
      return true;
    });
    state.sparks = state.sparks.filter((spark) => {
      spark.life -= dt;
      spark.y -= dt * 44;
      return spark.life > 0;
    });
  }

  function calmEnemy(enemy) {
    state.calmed += 1;
    if (enemy.isBoss) {
      state.bossDefeated = true;
      state.keys += 2;
      addFloater(locale === "zh-Hant" ? "\u9996\u9818\u64ca\u7834 +2" : locale === "es" ? "JEFE CALMADO +2" : "BOSS CALMED +2", enemy.x, enemy.y - 80, "#ffe76c");
    }
    state.xpDrops.push({ x: enemy.x, y: enemy.y, value: enemy.isBoss ? 4 : 1 });
    state.enemies = state.enemies.filter((item) => item !== enemy);
    if (state.stageConfig?.modifier === "emberTrail") addHazard("circle", { x: enemy.x, y: enemy.y, r: 78, warn: 0.15, life: 2.5, color: "#f97316", damage: 0.45 });
  }

  function damageEnemy(enemy, damage) {
    if (!enemy) return { blocked: false, hp: 0 };
    if (enemy.shielded && (enemy.shieldHp > 0 || enemy.isBoss)) {
      if (!enemy.isBoss) {
        enemy.shieldHp = Math.max(0, enemy.shieldHp - damage);
        if (enemy.shieldHp <= 0) enemy.shielded = false;
      }
      addFloater(locale === "zh-Hant" ? "\u8b77\u76fe" : locale === "es" ? "ESCUDO" : "SHIELD", enemy.x, enemy.y - 58, "#c4b5fd");
      return { blocked: true, hp: enemy.hp };
    }
    enemy.hp -= damage;
    if (enemy.hp <= 0) calmEnemy(enemy);
    return { blocked: false, hp: Math.max(0, enemy.hp) };
  }

  function updateDrops() {
    const p = state.player;
    state.xpDrops = state.xpDrops.filter((drop) => {
      if (state.stageConfig?.modifier === "drift" && state.enemies.length) {
        const target = state.enemies.reduce((best, enemy) => Math.hypot(enemy.x - drop.x, enemy.y - drop.y) < Math.hypot(best.x - drop.x, best.y - drop.y) ? enemy : best, state.enemies[0]);
        drop.x += (target.x - drop.x) * 0.0018;
        drop.y += (target.y - drop.y) * 0.0018;
      }
      const dist = Math.hypot(drop.x - p.x, drop.y - p.y);
      if (dist < p.pickup) {
        state.xp += drop.value;
        addSpark(drop.x, drop.y, "#fef08a");
        addFloater(`+${drop.value}`, drop.x, drop.y - 18, "#fef08a");
        playSound("coin", 0.12);
        if (state.xp >= state.xpNeed) levelUp();
        return false;
      }
      if (dist < p.pickup * 2.2) {
        drop.x += (p.x - drop.x) * 0.08;
        drop.y += (p.y - drop.y) * 0.08;
      }
      return true;
    });
  }

  function updateKey() {
    const p = state.player;
    if (Math.hypot(state.key.x - p.x, state.key.y - p.y) < p.pickup + 8) {
      state.keys += 1;
      state.key = randomPoint(120);
      addSpark(p.x, p.y - 52, "#ffe76c");
      addFloater("+1", p.x, p.y - 90, "#ffe76c");
      playSound("success", 0.12);
      window.WonderAnalytics?.track("game_key_collect", { game_id: GAME_ID, keys: state.keys, prototype: true });
    }
  }

  function levelUp() {
    state.xp -= state.xpNeed;
    state.xpNeed = Math.ceil(state.xpNeed * 1.28 + 2);
    state.level += 1;
    state.mode = "upgrade";
    renderUpgradeCards();
    setUpgradeModalOpen(true);
    playSound("upgrade", 0.2);
    window.WonderAnalytics?.track("game_level_up", { game_id: GAME_ID, level: state.level, prototype: true });
  }

  function renderUpgradeCards() {
    const options = [...upgrades].sort(() => Math.random() - 0.5).slice(0, 3);
    nodes.upgradeCards.innerHTML = options
      .map((item) => `
        <button class="upgrade-card" type="button" data-upgrade="${item.id}">
          <span class="upgrade-icon"><img src="${assetPaths[item.icon]}" alt="" /></span>
          <b>${t(item.name)}</b>
          <em>${upgradePreview(item.id)}</em>
          <small>${t(item.desc)}</small>
        </button>
      `)
      .join("");
  }

  function setUpgradeModalOpen(open, restoreFocus = true) {
    nodes.upgradePanel.classList[open ? "remove" : "add"]("hidden");
    nodes.gamePanel.inert = open;
    if (open) {
      nodes.gamePanel.setAttribute("aria-hidden", "true");
      nodes.upgradeCards.querySelector?.(".upgrade-card")?.focus?.({ preventScroll: true });
      return;
    }
    nodes.gamePanel.removeAttribute?.("aria-hidden");
    if (restoreFocus && !nodes.gamePanel.classList.contains("hidden")) canvas.focus?.({ preventScroll: true });
  }

  function formatUpgradeValue(value, unit = "") {
    const rounded = Math.round(value * 100) / 100;
    return `${rounded}${unit}`;
  }

  function upgradePreview(id) {
    const p = state.player;
    const previews = {
      attack: ["statDamage", p.damage, p.damage + 0.55, ""],
      range: ["statRange", p.range, p.range + 48, "px"],
      speed: ["statSpeed", p.speed, p.speed + 32, ""],
      maxHp: ["statHp", p.maxHp, p.maxHp + 1, ""],
      cooldown: ["statCooldown", p.cooldown, Math.max(0.34, p.cooldown * 0.86), "s"],
      pickup: ["statPickup", p.pickup, p.pickup + 24, "px"],
    };
    const [stat, current, next, unit] = previews[id];
    return t("upgradeValue", {
      stat: t(stat),
      current: formatUpgradeValue(current, unit),
      next: formatUpgradeValue(next, unit),
    });
  }

  function applyUpgrade(id) {
    if (state.mode !== "upgrade") return;
    const p = state.player;
    if (id === "attack") p.damage += 0.55;
    if (id === "range") p.range += 48;
    if (id === "speed") p.speed += 32;
    if (id === "maxHp") {
      p.maxHp += 1;
      p.hp = Math.min(p.maxHp, p.hp + 1.4);
    }
    if (id === "cooldown") p.cooldown = Math.max(0.34, p.cooldown * 0.86);
    if (id === "pickup") p.pickup += 24;
    state.mode = "running";
    setUpgradeModalOpen(false);
    playSound("click", 0.1);
    window.WonderAnalytics?.track("game_upgrade_choice", { game_id: GAME_ID, upgrade: id, level: state.level, prototype: true });
    lastFrame = performance.now();
    scheduleLoop();
  }

  function addSpark(x, y, color) {
    state.sparks.push({ x, y, color, life: 0.45 });
  }

  function addFloater(textValue, x, y, color) {
    state.floaters.push({ text: textValue, x, y, color, life: 0.82 });
  }

  function updateFloaters(dt) {
    state.floaters = state.floaters.filter((floater) => {
      floater.life -= dt;
      floater.y -= dt * 58;
      return floater.life > 0;
    });
  }

  function endRun(reason) {
    if (state.mode === "result") return;
    state.mode = "result";
    const previousBestKeys = save.bestKeys || 0;
    const previousRank = patrolRankFor(save.totalKeys);
    const improved = state.keys > previousBestKeys;
    const stageCleared = reason === "time"
      && state.keys >= state.stageConfig.targetKeys
      && (!state.stageConfig.bossImage || state.bossDefeated);
    save.bestKeys = Math.max(save.bestKeys || 0, state.keys);
    save.bestLevel = Math.max(save.bestLevel || 1, state.level);
    save.totalKeys = Math.max(0, Number(save.totalKeys) || 0) + Math.max(0, state.keys);
    save.stageBestKeys[state.stage] = Math.max(Number(save.stageBestKeys[state.stage]) || 0, state.keys);
    if (stageCleared) {
      if (!save.completedStages.includes(state.stage)) save.completedStages.push(state.stage);
      save.completedStages.sort((a, b) => a - b);
      save.unlockedStage = Math.max(save.unlockedStage, Math.min(STAGE_COUNT, state.stage + 1));
    }
    persist();
    renderExpeditionRecord();
    renderResult(reason, previousBestKeys, improved, previousRank.index, stageCleared);
    if (document.body) battlePanelMetrics = measureBattlePanel();
    show(nodes.resultPanel);
    const primaryAction = stageCleared && state.stage < STAGE_COUNT
      ? nodes.nextStageBtn
      : stageCleared
        ? nodes.resultMenuBtn
        : nodes.retryBtn;
    [nodes.retryBtn, nodes.nextStageBtn, nodes.resultMenuBtn].forEach((button) => {
      button.classList.toggle("result-primary", button === primaryAction);
    });
    primaryAction.focus({ preventScroll: true });
    playSound(stageCleared ? "win" : "wrong", 0.4);
    window.WonderAnalytics?.track("game_complete", { game_id: GAME_ID, reason, keys: state.keys, level: state.level, prototype: true });
  }

  function renderResult(reason, previousBestKeys, improved, previousRankIndex, stageCleared = false) {
    const survived = Math.round(state.survived);
    const best = Math.max(previousBestKeys || 0, state.keys);
    const reactionScore = Math.min(5, 2 + Math.floor(survived / 44));
    const focusScore = Math.min(5, 1 + state.keys);
    const problemScore = Math.min(5, Math.max(1, state.level));
    nodes.resultTitle.textContent = stageCleared ? t("stageClear") : reason === "time" ? t("objectiveMissed") : t("runFailed");
    nodes.resultScore.textContent = String(state.keys);
    const objectiveLine = !stageCleared && reason === "time"
      ? t("objectiveMissedLine", { keys: state.stageConfig.targetKeys, boss: state.stageConfig.bossImage ? t("bossStillActive") : "" })
      : improved ? t("improved") : t("keepGoing");
    nodes.resultText.textContent = `${t("resultLine", { keys: state.keys, level: state.level, time: survived, best })} ${objectiveLine}`;
    nodes.nextStageBtn.classList.toggle("hidden", !stageCleared || state.stage >= STAGE_COUNT);
    const rank = patrolRankFor(save.totalKeys);
    nodes.resultRankText.textContent = rank.index > previousRankIndex
      ? t("patrolRankUp", { rank: t(rank.current.name) })
      : rank.next
        ? t("patrolRankNext", { current: rank.total, target: rank.next.threshold, rank: t(rank.next.name) })
        : t("patrolRankComplete", { current: rank.total });
    nodes.reactionStars.textContent = stars(reactionScore);
    nodes.focusStars.textContent = stars(focusScore);
    nodes.problemStars.textContent = stars(problemScore);
    nodes.skillReportText.textContent = skillReport({ reason, reactionScore, focusScore, problemScore });
  }

  function skillReport({ reason, reactionScore, focusScore, problemScore }) {
    const data = { keys: state.keys, level: state.level };
    if (reason === "time" || (reactionScore >= 4 && focusScore >= 3 && problemScore >= 2)) {
      return t("skillReportStrong", data);
    }
    if (focusScore >= 3 || problemScore >= 3) {
      return t("skillReportFocus", data);
    }
    return t("skillReportRecover", data);
  }

  function installSmokeHooks() {
    if (!window.location?.search?.includes("smoke=1")) return;
    window.__animalCrystalSurvivorSmoke = {
      snapshot: () => ({
        mode: state.mode,
        stage: state.stage,
        stageName: stageName(state.stageConfig),
        stageModifier: state.stageConfig.modifier,
        keys: state.keys,
        key: { ...state.key },
        player: { ...state.player },
        level: state.level,
        xp: state.xp,
        xpNeed: state.xpNeed,
        timeLeft: state.timeLeft,
        calmed: state.calmed,
        enemies: state.enemies.map((enemy) => ({
          x: enemy.x,
          y: enemy.y,
          hp: enemy.hp,
          maxHp: enemy.maxHp,
          speed: enemy.speed,
          damage: enemy.damage,
          size: enemy.size,
          image: enemy.image,
          isBoss: Boolean(enemy.isBoss),
          shielded: Boolean(enemy.shielded),
          danger: Math.hypot(enemy.x - state.player.x, enemy.y - state.player.y) <= 170,
        })),
        shots: state.shots.map((shot) => ({ x: shot.x, y: shot.y, px: shot.px, py: shot.py, damage: shot.damage, image: shot.image })),
        xpDrops: state.xpDrops.map((drop) => ({ x: drop.x, y: drop.y, value: drop.value })),
        floaters: state.floaters.map((floater) => ({ text: floater.text, x: floater.x, y: floater.y, life: floater.life })),
        resultScore: nodes.resultScore.textContent,
        resultText: nodes.resultText.textContent,
        skillReportText: nodes.skillReportText.textContent,
        upgradeVisible: !nodes.upgradePanel.classList.contains("hidden"),
        crystalCharm: Boolean(save.crystalCharm),
        diamondBalance: diamondBalance(),
        totalKeys: Math.max(0, Number(save.totalKeys) || 0),
        patrolRank: patrolRankFor(save.totalKeys).index,
        patrolRankText: nodes.patrolRankText?.textContent || "",
        patrolRankProgressText: nodes.patrolRankProgressText?.textContent || "",
        patrolRankProgressPercent: Math.round(patrolRankFor(save.totalKeys).progress * 100),
        resultRankText: nodes.resultRankText?.textContent || "",
        hazards: state.hazards.map((hazard) => ({ kind: hazard.kind, x: hazard.x, y: hazard.y, warn: hazard.warn, life: hazard.life, color: hazard.color })),
        safeZone: state.safeZone ? { ...state.safeZone } : null,
        bossSpawned: state.bossSpawned,
        bossDefeated: state.bossDefeated,
        renderMetrics: {
          ...renderMetrics,
          backingWidth: renderCanvas.width,
          backingHeight: renderCanvas.height,
          backingPixels: renderCanvas.width * renderCanvas.height,
          backingScale,
        },
      }),
      setTotalKeysForTest: (total = 0) => {
        save.totalKeys = Math.max(0, Number(total) || 0);
        persist();
        renderPatrolRank();
        return patrolRankFor(save.totalKeys);
      },
      startStageForTest: (stageNumber = 1) => {
        save.unlockedStage = Math.max(save.unlockedStage, Math.min(STAGE_COUNT, Number(stageNumber) || 1));
        save.selectedStage = Math.max(1, Math.min(save.unlockedStage, Number(stageNumber) || 1));
        persist();
        startRun();
      },
      triggerMechanicForTest: () => {
        state.mechanicStep += 1;
        triggerStageMechanic(state.stageConfig.modifier);
        return state.hazards.length;
      },
      spawnBossForTest: () => {
        spawnBoss();
        return state.enemies.find((enemy) => enemy.isBoss) || null;
      },
      strikeBossForTest: (damage = 3) => {
        const boss = state.enemies.find((enemy) => enemy.isBoss);
        return boss ? damageEnemy(boss, Number(damage) || 0) : null;
      },
      collectKeyAtPlayer: () => {
        state.key = { x: state.player.x, y: state.player.y };
        updateKey();
        renderHud();
      },
      collectXpAtPlayer: (value = state.xpNeed) => {
        state.xpDrops.push({ x: state.player.x, y: state.player.y, value });
        updateDrops();
        renderHud();
      },
      finishRunForTest: (keys = state.keys) => {
        state.keys = Math.max(0, Number(keys) || 0);
        endRun("time");
      },
      applyUpgradeForTest: (id) => {
        state.mode = "upgrade";
        applyUpgrade(id);
        renderHud();
      },
      clearCombatForTest: () => {
        state.enemies = [];
        state.shots = [];
        state.xpDrops = [];
        state.sparks = [];
        state.floaters = [];
        state.player.shotTimer = 0;
        renderHud();
      },
      setSpawnTimerForTest: (value) => {
        state.spawnTimer = value;
      },
      spawnEnemyForTest: (options = {}) => {
        const p = state.player;
        const enemy = {
          x: options.x ?? p.x + 120,
          y: options.y ?? p.y,
          hp: options.hp ?? 1,
          speed: options.speed ?? 0,
          size: options.size ?? 62,
          damage: options.damage ?? 0.55,
          image: options.image || "basic",
          maxHp: options.maxHp ?? options.hp ?? 1,
          hit: 0,
          touch: 0,
        };
        state.enemies.push(enemy);
        return enemy;
      },
    };
  }

  function stars(count) {
    return "*".repeat(count) + "-".repeat(Math.max(0, 5 - count));
  }

  function writeHudValue(key, node, value, property = "textContent") {
    if (hudValues[key] === value) return;
    hudValues[key] = value;
    node[property] = value;
    renderMetrics.hudWrites += 1;
  }

  function renderHud(force = false) {
    const time = formatTime(state.timeLeft);
    const hp = Math.max(0, Math.ceil(state.player.hp));
    if (force) hudValues = Object.create(null);
    writeHudValue("stage", nodes.stageText, `${state.stage}/${STAGE_COUNT}`);
    writeHudValue("time", nodes.timeText, time);
    writeHudValue("keys", nodes.keyText, String(state.keys));
    writeHudValue("level", nodes.levelText, String(state.level));
    writeHudValue("hp", nodes.hpText, `${hp}/${state.player.maxHp}`);
    writeHudValue("xp", nodes.xpFill.style, `${Math.min(100, (state.xp / state.xpNeed) * 100)}%`, "width");
    const playfieldSignature = [locale, state.stage, time, state.keys, hp, state.player.maxHp, state.level, state.stageConfig?.modifier].join("|");
    if (playfieldSignature !== playfieldLabelSignature) {
      playfieldLabelSignature = playfieldSignature;
      canvas.setAttribute("aria-label", t("playfieldState", {
        stage: state.stage,
        stageCount: STAGE_COUNT,
        time,
        keys: state.keys,
        target: state.stageConfig?.targetKeys || 0,
        hp,
        maxHp: state.player.maxHp,
        level: state.level,
        rule: stageRule(state.stageConfig || stages[0]),
      }));
    }
    renderActionHint(force);
  }

  function renderActionHint(force = false) {
    if (!force && state.mode === "running" && state.survived < nextHintUpdate) return;
    nextHintUpdate = state.survived + 0.25;
    renderMetrics.hintEvaluations += 1;
    if (state.mode !== "running") {
      const value = t("playHint");
      if (hintValue !== value) {
        hintValue = value;
        nodes.hintText.textContent = value;
        renderMetrics.hudWrites += 1;
      }
      return;
    }

    const p = state.player;
    const keyDistance = Math.hypot(state.key.x - p.x, state.key.y - p.y);
    const hasCloseEnemy = state.enemies.some((enemy) => Math.hypot(enemy.x - p.x, enemy.y - p.y) <= p.range);
    const nextHint =
      state.xpNeed - state.xp <= 1 && state.xpDrops.length > 0
        ? "hintUpgradeSoon"
        : keyDistance <= 220
          ? "hintKeyClose"
          : state.xpDrops.length > 0
            ? "hintCrystal"
            : hasCloseEnemy
              ? "hintCombat"
              : "playHint";

    const value = t(nextHint);
    if (hintValue !== value) {
      hintValue = value;
      nodes.hintText.textContent = value;
      renderMetrics.hudWrites += 1;
    }
  }

  function formatTime(value) {
    const total = Math.max(0, Math.ceil(value));
    const minutes = Math.floor(total / 60);
    const seconds = String(total % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  function drawImageCentered(img, x, y, size, angle = 0, alpha = 1) {
    if (!img?.complete || !img.naturalWidth) return;
    const ratio = img.naturalWidth / img.naturalHeight;
    const drawWidth = ratio >= 1 ? size : size * ratio;
    const drawHeight = ratio >= 1 ? size / ratio : size;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
  }

  function drawImageCover(img, x, y, width, height, target = ctx) {
    if (!img?.complete || !img.naturalWidth || !img.naturalHeight) return;
    const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
    const sourceWidth = width / scale;
    const sourceHeight = height / scale;
    const sourceX = (img.naturalWidth - sourceWidth) / 2;
    const sourceY = (img.naturalHeight - sourceHeight) / 2;
    target.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
  }

  function ensureArenaLayer() {
    const color = regions[state.stageConfig?.region || 0]?.color || "rgba(6, 24, 23, 0.18)";
    const signature = `${renderCanvas.width}x${renderCanvas.height}|${color}|${images.arena?.naturalWidth || 0}`;
    if (signature === arenaLayerSignature || !images.arena?.complete || !images.arena.naturalWidth) return;
    arenaLayer.width = renderCanvas.width;
    arenaLayer.height = renderCanvas.height;
    arenaCtx.setTransform(backingScale, 0, 0, backingScale, 0, 0);
    arenaCtx.clearRect(0, 0, W, H);
    drawImageCover(images.arena, 0, 0, W, H, arenaCtx);
    arenaCtx.fillStyle = color;
    arenaCtx.fillRect(0, 0, W, H);
    arenaLayerSignature = signature;
    renderMetrics.arenaLayerBuilds += 1;
  }

  function draw() {
    const frameNow = performance.now();
    ensureArenaLayer();
    if (arenaLayer.width && arenaLayer.height) {
      ctx.drawImage(arenaLayer, 0, 0, arenaLayer.width, arenaLayer.height, 0, 0, W, H);
    } else {
      ctx.clearRect(0, 0, W, H);
      renderMetrics.fallbackFrameClears += 1;
    }
    drawStageHazards(frameNow);
    drawKey(frameNow);
    state.xpDrops.forEach((drop) => drawImageCentered(images.xp, drop.x, drop.y, 34));
    state.enemies.forEach((enemy) => drawEnemy(enemy, frameNow));
    state.shots.forEach((shot) => {
      const angle = Math.atan2(shot.target.y - shot.y, shot.target.x - shot.x);
      drawShotTrail(shot);
      drawImageCentered(images[shot.image || "seed"], shot.x, shot.y, shot.image === "blade" ? 52 : 42, angle);
    });
    drawImageCentered(images.hero, state.player.x, state.player.y, 92);
    drawRange();
    state.sparks.forEach((spark) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, spark.life / 0.45);
      ctx.fillStyle = spark.color;
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, 16 + (1 - spark.life / 0.45) * 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    state.floaters.forEach(drawFloater);
    displayCtx.drawImage(renderCanvas, 0, 0);
  }

  function drawStageHazards(frameNow) {
    if (state.safeZone) {
      ctx.save();
      ctx.fillStyle = "rgba(24,8,38,.28)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(state.safeZone.x, state.safeZone.y, state.safeZone.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "rgba(254,240,138,.92)";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(state.safeZone.x, state.safeZone.y, state.safeZone.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    state.hazards.forEach((hazard) => {
      const active = hazard.warn <= 0;
      const pulse = 0.58 + Math.sin(frameNow / 100) * 0.18;
      ctx.save();
      ctx.globalAlpha = active ? 0.34 : pulse;
      ctx.fillStyle = hazard.color;
      ctx.strokeStyle = hazard.color;
      ctx.lineWidth = active ? 8 : 5;
      ctx.setLineDash(active ? [] : [18, 14]);
      if (hazard.kind === "lane") {
        ctx.fillRect(hazard.x - hazard.width / 2, hazard.y - hazard.height / 2, hazard.width, hazard.height);
        ctx.strokeRect(hazard.x - hazard.width / 2, hazard.y - hazard.height / 2, hazard.width, hazard.height);
      } else {
        if (active) {
          ctx.beginPath();
          ctx.arc(hazard.x, hazard.y, hazard.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(hazard.x, hazard.y, hazard.r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    });
  }

  function drawFloater(floater) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, floater.life / 0.82);
    ctx.font = "900 30px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.lineWidth = 7;
    ctx.strokeStyle = "rgba(4, 20, 18, 0.72)";
    ctx.fillStyle = floater.color;
    ctx.strokeText(floater.text, floater.x, floater.y);
    ctx.fillText(floater.text, floater.x, floater.y);
    ctx.restore();
  }

  function drawRange() {
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "#b7f4d7";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(state.player.x, state.player.y, state.player.range, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawShotTrail(shot) {
    let fromX = shot.px || shot.x;
    let fromY = shot.py || shot.y;
    const trailLength = Math.hypot((shot.x || 0) - fromX, (shot.y || 0) - fromY);
    if (trailLength < 34 && shot.target) {
      const dx = shot.x - shot.target.x;
      const dy = shot.y - shot.target.y;
      const dist = Math.hypot(dx, dy) || 1;
      fromX = shot.x + (dx / dist) * 46;
      fromY = shot.y + (dy / dist) * 46;
    }
    const isBlade = shot.image === "blade";
    const color = isBlade ? "183, 244, 215" : "103, 232, 249";
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = `rgba(${color}, 0.52)`;
    ctx.lineWidth = isBlade ? 16 : 12;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(shot.x, shot.y);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.72)";
    ctx.lineWidth = isBlade ? 5 : 4;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(shot.x, shot.y);
    ctx.stroke();
    ctx.restore();
  }

  function drawKey(frameNow) {
    ctx.save();
    ctx.globalAlpha = 0.32;
    ctx.fillStyle = "#fff7ad";
    ctx.beginPath();
    ctx.arc(state.key.x, state.key.y, 44 + Math.sin(frameNow / 180) * 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    drawImageCentered(images.key, state.key.x, state.key.y, 54);
  }

  function drawEnemy(enemy, frameNow) {
    const hpPct = Math.max(0, enemy.hp / enemy.maxHp);
    const visualSize = enemy.isBoss ? enemy.size * 2.25 : enemy.image === "tank" ? enemy.size * 1.9 : enemy.image === "runner" ? enemy.size * 1.65 : enemy.size * 1.55;
    drawEnemyDanger(enemy, frameNow);
    if (enemy.shielded) {
      ctx.save();
      ctx.strokeStyle = "rgba(196,181,253,.9)";
      ctx.lineWidth = enemy.isBoss ? 12 : 7;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.size * (enemy.isBoss ? 1.15 : .72), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    drawImageCentered(images[enemy.image], enemy.x, enemy.y, visualSize, 0, enemy.hit > 0 ? 0.72 : 1);
    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 42, 0.58)";
    const barWidth = enemy.isBoss ? 150 : 56;
    const barHeight = enemy.isBoss ? 14 : 7;
    ctx.fillRect(enemy.x - barWidth / 2, enemy.y - visualSize * 0.34 - 18, barWidth, barHeight);
    ctx.fillStyle = "#8ef28b";
    ctx.fillRect(enemy.x - barWidth / 2, enemy.y - visualSize * 0.34 - 18, barWidth * hpPct, barHeight);
    ctx.restore();
  }

  function drawEnemyDanger(enemy, frameNow) {
    const dist = Math.hypot(enemy.x - state.player.x, enemy.y - state.player.y);
    if (dist > 170) return;
    const danger = Math.max(0, 1 - dist / 170);
    const pulse = (Math.sin(frameNow / 110) + 1) * 0.5;
    const radius = enemy.size * (0.58 + danger * 0.28 + pulse * 0.06);
    ctx.save();
    ctx.globalAlpha = 0.18 + danger * 0.32;
    ctx.strokeStyle = "#ff7b5f";
    ctx.lineWidth = 5 + danger * 5;
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const client = event.touches?.[0] || event;
    return {
      x: ((client.clientX - rect.left) / rect.width) * W,
      y: ((client.clientY - rect.top) / rect.height) * H,
    };
  }

  function moveTarget(event) {
    if (state.mode !== "running") return;
    event.preventDefault();
    const point = canvasPoint(event);
    state.player.tx = point.x;
    state.player.ty = point.y;
  }

  canvas.addEventListener("pointerdown", (event) => {
    if (event.isPrimary === false || (event.button !== undefined && event.button !== 0)) return;
    if (activePointerId !== null && activePointerId !== event.pointerId) return;
    activePointerId = event.pointerId;
    canvas.setPointerCapture?.(event.pointerId);
    moveTarget(event);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (activePointerId === event.pointerId) moveTarget(event);
  });
  const releasePointer = (event) => {
    if (activePointerId === event.pointerId) activePointerId = null;
  };
  window.addEventListener("pointerup", releasePointer);
  window.addEventListener("pointercancel", releasePointer);
  canvas.addEventListener("pointerleave", releasePointer);
  canvas.addEventListener("lostpointercapture", releasePointer);
  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (movementKeys.has(key)) {
      event.preventDefault();
      keys.add(key);
    }
  });
  window.addEventListener("keyup", (event) => {
    keys.delete(event.key.toLowerCase());
  });
  window.addEventListener("blur", clearInput);
  window.addEventListener("pagehide", () => {
    clearInput();
    battleSuspended = true;
    resetFrameClock();
  });
  window.addEventListener("pageshow", () => {
    battleSuspended = false;
    resetFrameClock();
  });
  document.addEventListener("visibilitychange", () => {
    clearInput();
    battleSuspended = Boolean(document.hidden);
    resetFrameClock();
  });

  nodes.localeSelect.addEventListener("change", (event) => setLocale(event.target.value));
  nodes.settingsBtn?.addEventListener("click", () => {
    const open = nodes.settingsBtn.getAttribute("aria-expanded") !== "true";
    setSettingsOpen(open);
    if (open) window.requestAnimationFrame(() => nodes.menuSoundBtn?.focus({ preventScroll: true }));
  });
  document.addEventListener("pointerdown", (event) => {
    if (nodes.settingsPopover?.classList.contains("hidden")) return;
    if (event.target.closest(".settings-control")) return;
    setSettingsOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || nodes.settingsPopover?.classList.contains("hidden")) return;
    event.preventDefault();
    setSettingsOpen(false, true);
  });
  nodes.startBtn.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
  });
  nodes.startBtn.addEventListener("click", () => showStageSelection(true));
  nodes.stageTabBtn?.addEventListener("click", () => setStagePage("stages"));
  nodes.equipmentTabBtn?.addEventListener("click", () => setStagePage("equipment"));
  nodes.stageBackBtn.addEventListener("click", () => {
    state.mode = "menu";
    renderMainProgress();
    show(nodes.menuPanel);
    nodes.startBtn.focus({ preventScroll: true });
  });
  nodes.stageRail.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ") && event.target.closest(".stage-card")) event.preventDefault();
  });
  nodes.stageRail.addEventListener("scroll", syncStageFromRail, { passive: true });
  nodes.charmBtn?.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
  });
  nodes.charmBtn?.addEventListener("click", buyCrystalCharm);
  nodes.menuSoundBtn?.addEventListener("click", () => {
    clearCharmConfirmation(true);
    const muted = Boolean(window.WonderSound?.isMuted?.());
    window.WonderSound?.setMuted?.(!muted);
    updateMenuSound();
  });
  nodes.retryBtn.addEventListener("click", startRun);
  nodes.nextStageBtn.addEventListener("click", () => {
    save.selectedStage = Math.min(save.unlockedStage, state.stage + 1);
    persist();
    showStageSelection(true);
  });
  nodes.resultPanel.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      return;
    }
    if (event.key !== "Tab" || nodes.resultPanel.classList.contains("hidden")) return;
    const actions = [nodes.retryBtn, nodes.nextStageBtn, nodes.resultMenuBtn].filter((button) => !button.disabled && !button.classList.contains("hidden"));
    if (event.shiftKey && document.activeElement === actions[0]) {
      event.preventDefault();
      actions.at(-1).focus();
    } else if (!event.shiftKey && document.activeElement === actions.at(-1)) {
      event.preventDefault();
      actions[0].focus();
    }
  });
  nodes.menuBtn.addEventListener("click", () => {
    runToken += 1;
    clearInput();
    state.mode = "stage";
    playSound("click", 0.1);
    showStageSelection(true);
  });
  nodes.resultMenuBtn.addEventListener("click", () => {
    runToken += 1;
    clearInput();
    state.mode = "stage";
    playSound("click", 0.1);
    showStageSelection(true);
  });
  nodes.upgradeCards.addEventListener("click", (event) => {
    const card = event.target.closest("[data-upgrade]");
    if (card) applyUpgrade(card.dataset.upgrade);
  });
  nodes.upgradePanel.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      return;
    }
    if (event.key !== "Tab" || nodes.upgradePanel.classList.contains("hidden")) return;
    const actions = [...nodes.upgradeCards.querySelectorAll(".upgrade-card:not(:disabled)")];
    if (!actions.length) return;
    if (event.shiftKey && document.activeElement === actions[0]) {
      event.preventDefault();
      actions.at(-1).focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === actions.at(-1)) {
      event.preventDefault();
      actions[0].focus({ preventScroll: true });
    }
  });
  window.addEventListener("weightplay:locale-change", (event) => setLocale(event.detail?.locale || locale));

  setLocale(locale);
  installSmokeHooks();
  preload();
})();
