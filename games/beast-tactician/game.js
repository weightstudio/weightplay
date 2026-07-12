(() => {
  const GAME_ID = "beast-tactician";
  const isPublicRelease = !location.pathname.endsWith("/internal-test.html");
  const saveKey = "weightplay_beast_guardian_defense_v1";
  const soundKey = "weightplay_beast_guardian_sound_v1";
  const localeKey = "weightPlayLocale";
  const grid = { cols: 12, rows: 8 };
  const startTile = { x: 0, y: 3 };
  const coreTile = { x: 11, y: 4 };

  const $ = (id) => document.getElementById(id);
  const nodes = {
    localeSelect: $("localeSelect"),
    loadingPanel: $("loadingPanel"),
    loadingFill: $("loadingFill"),
    loadingText: $("loadingText"),
    menuPanel: $("menuPanel"),
    stagePanel: $("stagePanel"),
    techPanel: $("techPanel"),
    gamePanel: $("gamePanel"),
    resultPanel: $("resultPanel"),
    canvas: $("gameCanvas"),
    gameTitle: $("gameTitle"),
    languageLabel: $("languageLabel"),
    soundBtn: $("soundBtn"),
    releaseBadge: $("releaseBadge"),
    menuTitle: $("menuTitle"),
    menuHint: $("menuHint"),
    holdNotice: $("holdNotice"),
    bestStageLabel: $("bestStageLabel"),
    upgradePointLabel: $("upgradePointLabel"),
    diamondLabel: $("diamondLabel"),
    bestStageText: $("bestStageText"),
    upgradePointText: $("upgradePointText"),
    diamondText: $("diamondText"),
    startBtn: $("startBtn"),
    techBtn: $("techBtn"),
    techBackBtn: $("techBackBtn"),
    techTitle: $("techTitle"),
    techHint: $("techHint"),
    techGrid: $("techGrid"),
    stageTitle: $("stageTitle"),
    stageBackBtn: $("stageBackBtn"),
    stageRail: $("stageRail"),
    menuBtn: $("menuBtn"),
    buildTitle: $("buildTitle"),
    buildCards: $("buildCards"),
    selectedInfo: $("selectedInfo"),
    stageHudLabel: $("stageHudLabel"),
    coreHudLabel: $("coreHudLabel"),
    coinHudLabel: $("coinHudLabel"),
    waveHudLabel: $("waveHudLabel"),
    stageHudText: $("stageHudText"),
    coreText: $("coreText"),
    coinText: $("coinText"),
    waveText: $("waveText"),
    waveIntelPanel: $("waveIntelPanel"),
    waveIntelLabel: $("waveIntelLabel"),
    waveIntelText: $("waveIntelText"),
    speedBtn: $("speedBtn"),
    waveBtn: $("waveBtn"),
    upgradeBtn: $("upgradeBtn"),
    sellBtn: $("sellBtn"),
    reviveBtn: $("reviveBtn"),
    bossPanel: $("bossPanel"),
    bossLabel: $("bossLabel"),
    bossNameText: $("bossNameText"),
    bossMeterFill: $("bossMeterFill"),
    bossHpText: $("bossHpText"),
    bossHintText: $("bossHintText"),
    toast: $("toast"),
    resultTitle: $("resultTitle"),
    resultText: $("resultText"),
    resultStars: $("resultStars"),
    resultRewardText: $("resultRewardText"),
    skillReportText: $("skillReportText"),
    nextStageBtn: $("nextStageBtn"),
    rerollRewardBtn: $("rerollRewardBtn"),
    retryBtn: $("retryBtn"),
    resultMenuBtn: $("resultMenuBtn"),
  };
  const ctx = nodes.canvas.getContext("2d");

  const text = {
    en: {
      title: "Beast Guardian",
      language: "Language",
      localeName: "Traditional Chinese",
      releaseBadge: "Internal Release Candidate",
      publicReleaseBadge: "Playable Now",
      menuTitle: "Hero Tower Defense",
      menuHint:
        "Build anywhere on the forest grid, shape enemy routes, and command WeightPlay heroes with balanced animal soldiers through 10 defense stages.",
      holdNotice:
        "Public lobby remains Coming Soon until the user approves release. This route is for internal release validation.",
      publicNotice: "Build defenders, protect the crystal core, and unlock all 10 forest stages. Progress saves on this device.",
      bestStage: "Best Stage",
      upgradePoints: "Upgrade Points",
      diamonds: "Diamonds",
      start: "Start Defense",
      tech: "Tech Upgrades",
      back: "Back",
      menu: "Menu",
      chooseStage: "Choose Stage",
      locked: "Locked",
      cleared: "Cleared",
      stage: "Stage",
      core: "Core",
      coins: "Coins",
      wave: "Wave",
      build: "Build",
      startWave: "Start Wave",
      nextWave: "Next Wave",
      autoWave: "Next wave in {seconds}s",
      waveIntel: "Wave Intel",
      waveIntelReady: "Next: Wave {wave}/{total} - {enemies}",
      waveIntelActive: "Active: Wave {wave}/{total} - {remaining} left - {enemies}",
      waveIntelDone: "Stage clear after this wave.",
      routeOpen: "Route Open",
      routeBlocked: "Route Blocked - enemies attack defenders",
      coreCritical: "Core critical! Hold the route now.",
      keyboardFocus: "Tile {x},{y} - Enter builds/selects, number keys or Q/E change units.",
      buildReady: "Ready",
      buildNeedCoins: "Need {coins} coins",
      unitKindHero: "Hero",
      unitKindSoldier: "Soldier",
      roleLabel: "Role",
      attackSpeed: "Attack Speed",
      everySeconds: "Every {seconds}s",
      unitSupport: "Support",
      traitLabel: "Traits",
      traitSplash: "Splash {tiles} tiles",
      traitSlow: "Slow {percent}%",
      traitHealing: "Heal {points}",
      traitBuff: "Buff allies {percent}%",
      upgradeAction: "Upgrade ({coins})",
      sellAction: "Sell (+{coins})",
      selectedActionInfo: "Upgrade: {upgrade} coins | Sell: +{sell} coins",
      enemyWolf: "Wolves x{count}",
      enemyBoar: "Boars x{count}",
      enemyBat: "Bats x{count}",
      enemyBoss: "{boss} x{count}",
      upgrade: "Upgrade",
      sell: "Sell",
      revive: "Revive Core (5 Diamonds)",
      rerollReward: "Reroll Reward (3 Diamonds)",
      nextStage: "Next Stage",
      retry: "Retry",
      victory: "Defense Complete!",
      defeat: "Crystal Core Fell",
      techTitle: "Permanent Guardian Tech",
      techHint: "Spend upgrade points earned from victories. Upgrades are local-only and optional.",
      noCoins: "Not enough coins.",
      noDiamonds: "Not enough diamonds.",
      lockedStage: "Clear the previous stage first.",
      blocked: "Path blocked: enemies are attacking your defender.",
      bossIncoming: "{boss} is entering the battlefield!",
      blockedBuild: "That tile cannot be built.",
      occupied: "A defender already holds this tile.",
      built: "{name} deployed.",
      upgraded: "{name} upgraded to Lv.{level}.",
      sold: "Defender sold.",
      reviveUsed: "Core revived.",
      rewardSummary: "Reward: +{points} upgrade points, +{diamonds} diamonds",
      rewardRerolled: "Reward rerolled: +{points} upgrade points, +{diamonds} diamonds",
      rewardRerollUsed: "Reward rerolled.",
      starRating: "{stars}/3 Stars",
      buildFeedback: "Deployed",
      upgradeFeedback: "+Lv.{level}",
      sellFeedback: "+{coins} coins",
      soundOn: "SFX On",
      soundOff: "SFX Off",
      soundEnabled: "Sound enabled.",
      soundDisabled: "Sound disabled.",
      paused: "Paused",
      goldenFrame: "Golden Defender Frame",
      goldenFrameDesc: "Cosmetic gold frame for every deployed defender. Costs 15 Diamonds.",
      goldenFrameOwned: "Unlocked",
      goldenFrameBuy: "Unlock (15 Diamonds)",
      victoryText: "Stage {stage} cleared. Routes, blockers, upgrades, and hero timing worked together.",
      defeatText: "Good effort. Try a different route shape or upgrade key blockers earlier.",
      skillReport: "Skill Report: Logic, Problem Solving, and Focus practiced through path planning and upgrade timing.",
      skillReportWin3: "Skill Report: {stars}/3 Stars. Strong route planning kept the core at {core}%. Next, time hero focus fire even earlier on bosses.",
      skillReportWin2: "Skill Report: {stars}/3 Stars. Clear win with {core}% core HP. For a perfect clear, upgrade blockers earlier and stretch the route before burst waves.",
      skillReportWin1: "Skill Report: {stars}/3 Stars. Close clear with {core}% core HP. Add Medic or Sapper support sooner and avoid sealing the route too early.",
      skillReportLose: "Skill Report: The core fell. Reshape the route, keep one readable path open, and upgrade key blockers before the next pressure wave.",
      boss: "Boss",
      bossStage: "Boss Stage",
      bossPressure: "Boss Pressure",
      bossHoldRoute: "Hold the route",
      bossNoSignal: "No boss on field",
      waveClearFeedback: "Wave {wave} secured",
      bossShadowName: "Shadow Brute",
      bossForestName: "Forest Behemoth",
      guardianRoute: "Guardian Route",
      routeGate: "Gate",
      routeCore: "Core",
      threatIntel: "Threat",
      recommendedPlan: "Plan",
      rewardIntel: "Reward",
      cost: "Cost",
      range: "Range",
      hp: "HP",
      damage: "Damage",
      level: "Lv.",
      techPower: "Hero Power",
      techPowerDesc: "+10% hero damage per level.",
      techBulwark: "Guardian Bulwark",
      techBulwarkDesc: "+12 defender HP per level.",
      techEconomy: "Forest Economy",
      techEconomyDesc: "+20 starting coins per level.",
      techBuy: "Upgrade",
      loadFailed: "Load failed",
    },
    "zh-Hant": {},
  };

  text["zh-Hant"].routeGate = "\u5165\u53e3";
  text["zh-Hant"].routeCore = "\u6838\u5fc3";

  const assetSources = {
    bg: "../../assets/beast-tactician-battle-bg.webp",
    leo: "../../assets/weightplay-character-boom-mane-lion-cutout.webp",
    taro: "../../assets/weightplay-character-moss-shell-turtle-cutout.webp",
    orla: "../../assets/weightplay-character-moon-cap-owl-cutout.webp",
    fia: "../../assets/weightplay-character-spark-paw-fox-cutout.webp",
    rux: "../../assets/weightplay-character-gear-horn-rhino-cutout.webp",
    panko: "../../assets/weightplay-character-drum-belly-panda-safe-face-cutout.webp",
    bear: "../../assets/beast-tactician-hero-bear.webp",
    tiger: "../../assets/beast-tactician-hero-tiger.webp",
    deer: "../../assets/beast-tactician-hero-deer.webp",
    acornGuard: "../../assets/beast-tactician-soldier-acorn-guard.webp",
    scoutArcher: "../../assets/beast-tactician-soldier-scout-archer.webp",
    runeSapper: "../../assets/beast-tactician-soldier-rune-sapper.png",
    medicCub: "../../assets/beast-tactician-soldier-medic-cub.png",
    wolf: "../../assets/beast-tactician-enemy-wolf-cutout.webp?v=20260710-guardian-clean-cutouts1",
    boar: "../../assets/shadow-wolf-enemy-boar-cutout.webp?v=20260710-guardian-clean-cutouts1",
    bat: "../../assets/shadow-wolf-enemy-bat-cutout.webp?v=20260710-guardian-clean-cutouts1",
    boss: "../../assets/shadow-wolf-boss-behemoth-cutout.webp?v=20260710-guardian-clean-cutouts1",
    hit: "../../assets/shadow-wolf-fx-hit-spark.webp",
    slash: "../../assets/shadow-wolf-fx-claw-slash.webp",
    portal: "../../assets/shadow-wolf-fx-portal-glow.webp",
    skillFx: "../../assets/beast-tactician-skill-fx-atlas.webp",
  };
  const assets = {};
  const characterRenderMode = "static-procedural";
  const skillFxFrames = {
    heroStrike: 0,
    arrow: 1,
    heal: 2,
    slow: 3,
    gear: 4,
    bossPortal: 5,
  };

  const unitTypes = [
    {
      id: "guard",
      kind: "soldier",
      img: "acornGuard",
      name: { en: "Acorn Guard", "zh-Hant": "橡果守衛" },
      cost: 50,
      hp: 180,
      damage: 12,
      range: 1.25,
      cooldown: 0.8,
      note: { en: "Cheap blocker.", "zh-Hant": "便宜阻擋。" },
    },
    {
      id: "archer",
      kind: "soldier",
      img: "scoutArcher",
      name: { en: "Scout Archer", "zh-Hant": "斥候弓手" },
      cost: 75,
      hp: 85,
      damage: 12,
      range: 3,
      cooldown: 1.15,
      note: { en: "Reliable range.", "zh-Hant": "穩定遠程。" },
    },
    {
      id: "sapper",
      kind: "soldier",
      img: "runeSapper",
      name: { en: "Rune Sapper", "zh-Hant": "符文工兵" },
      cost: 100,
      hp: 120,
      damage: 22,
      range: 2.65,
      cooldown: 1.18,
      slow: 0.18,
      splash: 1.15,
      note: { en: "Area control.", "zh-Hant": "範圍控場。" },
    },
    {
      id: "medic",
      kind: "soldier",
      img: "medicCub",
      name: { en: "Medic Cub", "zh-Hant": "醫護幼獸" },
      cost: 80,
      hp: 135,
      damage: 0,
      range: 3,
      cooldown: 0.82,
      heal: 20,
      note: { en: "Repairs blockers.", "zh-Hant": "修復阻擋者。" },
    },
    {
      id: "leo",
      kind: "hero",
      img: "leo",
      name: { en: "Boom Mane Leo", "zh-Hant": "爆鬃雷歐" },
      cost: 180,
      hp: 265,
      damage: 24,
      range: 1.55,
      cooldown: 0.95,
      aura: "taunt",
      note: { en: "Elite frontline hero.", "zh-Hant": "頂級前線英雄。" },
    },
    {
      id: "taro",
      kind: "hero",
      img: "taro",
      name: { en: "Moss Shell Taro", "zh-Hant": "苔殼太郎" },
      cost: 170,
      hp: 310,
      damage: 12,
      range: 1.4,
      cooldown: 1.1,
      slow: 0.22,
      note: { en: "Best route blocker.", "zh-Hant": "最強路線阻擋。" },
    },
    {
      id: "orla",
      kind: "hero",
      img: "orla",
      name: { en: "Moon Cap Orla", "zh-Hant": "月帽歐拉" },
      cost: 155,
      hp: 115,
      damage: 28,
      range: 4.1,
      cooldown: 1.28,
      note: { en: "Long-range magic.", "zh-Hant": "遠程魔法。" },
    },
    {
      id: "fia",
      kind: "hero",
      img: "fia",
      name: { en: "Spark Paw Fia", "zh-Hant": "電爪菲亞" },
      cost: 160,
      hp: 135,
      damage: 34,
      range: 2.2,
      cooldown: 0.68,
      note: { en: "Boss striker.", "zh-Hant": "王關輸出。" },
    },
    {
      id: "rux",
      kind: "hero",
      img: "rux",
      name: { en: "Gear Horn Rux", "zh-Hant": "齒角魯克斯" },
      cost: 145,
      hp: 155,
      damage: 16,
      range: 2.6,
      cooldown: 0.95,
      buff: 0.12,
      note: { en: "Buffs nearby soldiers.", "zh-Hant": "強化附近士兵。" },
    },
    {
      id: "panko",
      kind: "hero",
      img: "panko",
      name: { en: "Drum Belly Panko", "zh-Hant": "鼓腹潘可" },
      cost: 140,
      hp: 150,
      damage: 7,
      range: 2.8,
      cooldown: 1.35,
      heal: 16,
      note: { en: "Heals blockers.", "zh-Hant": "治療阻擋者。" },
    },
    {
      id: "deer",
      kind: "hero",
      img: "deer",
      name: { en: "Nature Deer", "zh-Hant": "自然鹿" },
      cost: 150,
      hp: 140,
      damage: 18,
      range: 3.3,
      cooldown: 1.08,
      slow: 0.18,
      heal: 9,
      note: { en: "Nature control and healing.", "zh-Hant": "自然控場與治療。" },
    },
  ];

  const techs = [
    { id: "power", max: 5, cost: 1, label: "techPower", desc: "techPowerDesc" },
    { id: "bulwark", max: 5, cost: 1, label: "techBulwark", desc: "techBulwarkDesc" },
    { id: "economy", max: 5, cost: 1, label: "techEconomy", desc: "techEconomyDesc" },
  ];

  const stageIntel = [
    {
      threat: { en: "Basic wolves learn the lane.", "zh-Hant": "基礎狼群測試路線。" },
      plan: { en: "Guard bends with Archer support.", "zh-Hant": "守衛轉彎，弓手支援。" },
    },
    {
      threat: { en: "Split roots pressure two sides.", "zh-Hant": "分岔樹根形成雙線壓力。" },
      plan: { en: "Shape one long route, then add range.", "zh-Hant": "拉長單一路線，再補遠程。" },
    },
    {
      threat: { en: "Fast runners punish late builds.", "zh-Hant": "快速敵人懲罰太晚建置。" },
      plan: { en: "Open with Archer and cheap blockers.", "zh-Hant": "先放弓手與便宜阻擋。" },
    },
    {
      threat: { en: "Heavy armor strains blockers.", "zh-Hant": "重甲敵人壓迫阻擋者。" },
      plan: { en: "Upgrade Guard before the last wave.", "zh-Hant": "最後波前先升級守衛。" },
    },
    {
      threat: { en: "Shadow Brute enters with escorts.", "zh-Hant": "暗影巨漢帶護衛進場。" },
      plan: { en: "Taro anchors; Fia burns the boss.", "zh-Hant": "太郎定線，菲亞打王。" },
    },
    {
      threat: { en: "Mixed fast and heavy packs.", "zh-Hant": "快速與重甲混合壓力。" },
      plan: { en: "Use Sapper slow before hero burst.", "zh-Hant": "先用工兵緩速再接英雄爆發。" },
    },
    {
      threat: { en: "Blocked routes are punished harder.", "zh-Hant": "完全堵路會被更重懲罰。" },
      plan: { en: "Leave one lane open and heal blockers.", "zh-Hant": "保留一路，醫護修復阻擋。" },
    },
    {
      threat: { en: "Bats skip weak single-target plans.", "zh-Hant": "蝙蝠會突破薄弱單體配置。" },
      plan: { en: "Orla and Deer cover long angles.", "zh-Hant": "歐拉與自然鹿守長角度。" },
    },
    {
      threat: { en: "Dense packs create resource pressure.", "zh-Hant": "密集波次造成資源壓力。" },
      plan: { en: "Rux buffs Sapper and Archer clusters.", "zh-Hant": "魯克斯強化工兵與弓手群。" },
    },
    {
      threat: { en: "Forest Behemoth arrives after escorts.", "zh-Hant": "森林巨獸在護衛後登場。" },
      plan: { en: "Full hero line, Medic sustain, boss focus.", "zh-Hant": "全英雄線、醫護續戰、集中打王。" },
    },
  ];

  const stages = Array.from({ length: 10 }, (_, index) => {
    const stage = index + 1;
    return {
      id: stage,
      name: {
        en: [
          "Forest Gate",
          "Split Roots",
          "Broken Bridge",
          "Moss Yard",
          "Moonlit Ford",
          "Crystal Bend",
          "Engineer's Pass",
          "Echo Grove",
          "Last Rampart",
          "Behemoth Gate",
        ][index],
        "zh-Hant": [
          "森林門口",
          "分岔樹根",
          "斷橋",
          "苔原庭院",
          "月光淺灘",
          "水晶彎道",
          "工程師通道",
          "回音林",
          "最後壁壘",
          "巨獸之門",
        ][index],
      },
      waves: stage >= 10 ? 5 : stage >= 5 ? 4 : 3,
      threat: stage,
      startCoins: 320 + stage * 36,
      coreHp: 205 + stage * 42 + Math.max(0, stage - 8) * 70,
      enemyHp: 58 + stage * 20,
      enemySpeed: 36 + stage * 2.6,
      reward: { coins: 45 + stage * 12, diamonds: stage % 5 === 0 ? 2 : 1, points: stage % 2 === 0 ? 2 : 1 },
      intel: stageIntel[index],
      boss: stage === 5 || stage === 10,
      bossName: stage === 10 ? "Forest Behemoth" : stage === 5 ? "Shadow Brute" : "",
      bossHpScale: stage === 10 ? 9.4 : stage === 5 ? 5.6 : 0,
      bossDamage: stage === 10 ? 42 : stage === 5 ? 28 : 0,
      finalEscortCount: stage === 10 ? 4 : stage === 5 ? 2 : 0,
      spawnCadence: Math.max(0.28, 0.9 - stage * 0.035),
    };
  });

  function applyCleanTraditionalChineseContent() {
    Object.assign(text["zh-Hant"], {
      title: "獸王守衛",
      language: "語言",
      localeName: "繁體中文",
      releaseBadge: "內部 Release 候選版",
      menuTitle: "英雄塔防",
      menuHint: "在森林戰棋格上自由建置，改變敵人路線，指揮 WeightPlay 頂級英雄與平衡士兵守住 10 個防衛關卡。",
      holdNotice: "公開大廳仍維持敬請期待，直到使用者核准發布。此路線只用於內部 Release 驗證。",
      bestStage: "最高關卡",
      upgradePoints: "升級點",
      diamonds: "鑽石",
      start: "開始防衛",
      tech: "科技升級",
      back: "返回",
      menu: "選單",
      chooseStage: "選擇關卡",
      locked: "未解鎖",
      cleared: "已通關",
      stage: "關卡",
      core: "核心",
      coins: "金幣",
      wave: "波次",
      build: "建置",
      startWave: "開始波次",
      nextWave: "下一波",
      waveIntel: "波次情報",
      waveIntelReady: "下一波：第 {wave}/{total} 波 - {enemies}",
      waveIntelActive: "進行中：第 {wave}/{total} 波 - 剩餘 {remaining} - {enemies}",
      waveIntelDone: "這波結束後關卡通關。",
      routeOpen: "路線暢通",
      routeBlocked: "路線封鎖 - 敵人會攻擊守衛",
      coreCritical: "核心危急！立刻守住路線。",
      keyboardFocus: "格子 {x},{y} - Enter 建置/選取，數字鍵或 Q/E 切換單位。",
      buildReady: "可建置",
      buildNeedCoins: "需要 {coins} 金幣",
      unitKindHero: "英雄",
      unitKindSoldier: "士兵",
      roleLabel: "定位",
      attackSpeed: "攻擊速度",
      everySeconds: "每 {seconds} 秒",
      unitSupport: "支援",
      traitLabel: "特性",
      traitSplash: "濺射 {tiles} 格",
      traitSlow: "緩速 {percent}%",
      traitHealing: "治療 {points}",
      traitBuff: "強化友軍 {percent}%",
      upgradeAction: "升級（{coins}）",
      sellAction: "出售（+{coins}）",
      selectedActionInfo: "升級：{upgrade} 金幣 | 出售：+{sell} 金幣",
      enemyWolf: "暗狼 x{count}",
      enemyBoar: "鐵背野豬 x{count}",
      enemyBat: "影蝠 x{count}",
      enemyBoss: "{boss} x{count}",
      upgrade: "升級",
      sell: "出售",
      revive: "復甦核心（5 鑽石）",
      rerollReward: "重抽獎勵（3 鑽石）",
      nextStage: "下一關",
      retry: "重試",
      victory: "防衛完成！",
      defeat: "水晶核心陷落",
      techTitle: "守衛永久科技",
      techHint: "使用勝利獲得的升級點。升級只保存在本機，且完全自願。",
      noCoins: "金幣不足。",
      noDiamonds: "鑽石不足。",
      lockedStage: "請先通過前一關。",
      blocked: "路線被封鎖：敵人正在攻擊你的守衛。",
      bossIncoming: "{boss} 正在進入戰場！",
      blockedBuild: "這個格子不能建置。",
      occupied: "這個格子已有守衛。",
      built: "{name} 已部署。",
      upgraded: "{name} 升到 Lv.{level}。",
      sold: "守衛已出售。",
      reviveUsed: "核心已復甦。",
      rewardSummary: "獎勵：+{points} 升級點，+{diamonds} 鑽石",
      rewardRerolled: "重抽獎勵：+{points} 升級點，+{diamonds} 鑽石",
      rewardRerollUsed: "獎勵已重抽。",
      starRating: "{stars}/3 星",
      soundOn: "音效開",
      soundOff: "音效關",
      soundEnabled: "音效已開啟。",
      soundDisabled: "音效已關閉。",
      paused: "暫停",
      goldenFrame: "黃金守衛框",
      goldenFrameDesc: "為所有已部署守衛加上黃金外框。花費 15 鑽石。",
      goldenFrameOwned: "已解鎖",
      goldenFrameBuy: "解鎖（15 鑽石）",
      victoryText: "第 {stage} 關通關。路線、阻擋、升級與英雄時機配合成功。",
      defeatText: "打得不錯。試著改變路線形狀，或更早升級關鍵阻擋者。",
      skillReport: "能力報告：透過路線規劃與升級時機，練習邏輯、解題與專注力。",
      boss: "王",
      bossStage: "王關",
      bossPressure: "王壓力",
      bossHoldRoute: "守住路線",
      bossNoSignal: "場上沒有王",
      bossShadowName: "暗影蠻獸",
      bossForestName: "森林巨獸",
      guardianRoute: "守衛路線",
      routeGate: "入口",
      routeCore: "核心",
      threatIntel: "敵情",
      recommendedPlan: "建議",
      rewardIntel: "獎勵",
      cost: "花費",
      range: "射程",
      hp: "生命",
      damage: "傷害",
      level: "Lv.",
      techPower: "英雄火力",
      techPowerDesc: "每級英雄傷害 +10%。",
      techBulwark: "守衛壁壘",
      techBulwarkDesc: "每級守衛生命 +12。",
      techEconomy: "森林經濟",
      techEconomyDesc: "每級起始金幣 +20。",
      techBuy: "升級",
      loadFailed: "載入失敗",
    });

    const zhUnits = {
      guard: ["栗果守衛", "低成本阻擋者。"],
      archer: ["偵查弓手", "穩定遠程輸出。"],
      sapper: ["符文工兵", "範圍控制。"],
      medic: ["醫護幼獸", "修復阻擋者。"],
      leo: ["爆鬃里歐", "頂級前線英雄。"],
      taro: ["苔甲太郎", "最強路線阻擋者。"],
      orla: ["月帽歐菈", "長距離魔法輸出。"],
      fia: ["火花菲雅", "專精擊破 Boss。"],
      rux: ["齒角魯克斯", "強化附近士兵。"],
      panko: ["鼓腹潘可", "治療阻擋者。"],
      deer: ["自然鹿靈", "自然控制與治療。"],
    };
    unitTypes.forEach((unit) => {
      const zh = zhUnits[unit.id];
      if (!zh) return;
      unit.name["zh-Hant"] = zh[0];
      unit.note["zh-Hant"] = zh[1];
    });

    const zhStageIntel = [
      ["基礎暗狼測試主要路線。", "用守衛轉彎，搭配弓手支援。"],
      ["分岔樹根壓迫兩側。", "先拉長一條路線，再補遠程火力。"],
      ["高速奔襲會懲罰太晚建置。", "用弓手與便宜阻擋者開局。"],
      ["重甲敵人壓迫阻擋者。", "最後一波前先升級守衛。"],
      ["暗影蠻獸帶著護衛進場。", "太郎守住核心彎道，菲雅專心打王。"],
      ["高速與重甲混合壓力。", "英雄爆發前先用工兵緩速。"],
      ["完全封路會被更重懲罰。", "保留一條開放路線，並治療阻擋者。"],
      ["影蝠會跳過薄弱單體配置。", "歐菈與鹿靈覆蓋長角度。"],
      ["密集敵群造成資源壓力。", "魯克斯強化工兵與弓手群。"],
      ["森林巨獸會在護衛後抵達。", "完整英雄線、醫護續航、集中打王。"],
    ];
    stageIntel.forEach((intel, index) => {
      intel.threat["zh-Hant"] = zhStageIntel[index][0];
      intel.plan["zh-Hant"] = zhStageIntel[index][1];
    });

    const zhStageNames = ["森林入口", "分岔樹根", "斷裂橋", "苔蘚庭院", "月光淺灘", "水晶彎道", "工程師山徑", "回音林地", "最後壁壘", "巨獸之門"];
    stages.forEach((stage, index) => {
      stage.name["zh-Hant"] = zhStageNames[index];
    });
  }

  applyCleanTraditionalChineseContent();
  Object.assign(text["zh-Hant"], {
    skillReportWin3:
      "\u80fd\u529b\u5831\u544a\uff1a{stars}/3 \u661f\u3002\u8def\u7dda\u898f\u5283\u7a69\u5b9a\uff0c\u6838\u5fc3\u4fdd\u7559 {core}%\uff1b\u4e0b\u4e00\u6b65\u53ef\u4ee5\u66f4\u65e9\u96c6\u4e2d\u706b\u529b\u6253\u738b\u3002",
    skillReportWin2:
      "\u80fd\u529b\u5831\u544a\uff1a{stars}/3 \u661f\u3002\u9632\u885b\u6210\u529f\uff0c\u6838\u5fc3\u4fdd\u7559 {core}%\uff1b\u82e5\u60f3\u62ff\u6eff\u661f\uff0c\u63d0\u524d\u5347\u7d1a\u963b\u64cb\u8005\u4e26\u62c9\u9577\u8def\u7dda\u3002",
    skillReportWin1:
      "\u80fd\u529b\u5831\u544a\uff1a{stars}/3 \u661f\u3002\u9a5a\u96aa\u901a\u95dc\uff0c\u6838\u5fc3\u53ea\u5269 {core}%\uff1b\u4e0b\u6b21\u5148\u88dc\u91ab\u8b77\u6216\u5de5\u5175\uff0c\u907f\u514d\u592a\u65e9\u5c01\u8def\u5d29\u7dda\u3002",
    skillReportLose:
      "\u80fd\u529b\u5831\u544a\uff1a\u9019\u6b21\u6838\u5fc3\u5931\u5b88\u3002\u8abf\u6574\u8def\u7dda\u5f62\u72c0\uff0c\u4fdd\u7559\u53ef\u8b80\u8def\u5f91\uff0c\u4e26\u5728\u58d3\u529b\u6ce2\u524d\u5347\u7d1a\u95dc\u9375\u963b\u64cb\u8005\u3002",
    buildFeedback: "\u5df2\u90e8\u7f72",
    upgradeFeedback: "+Lv.{level}",
    sellFeedback: "+{coins} \u91d1\u5e63",
    waveClearFeedback: "\u7b2c {wave} \u6ce2\u5b88\u4f4f\u4e86",
    publicReleaseBadge: "\u7acb\u5373\u904a\u73a9",
    publicNotice: "\u5efa\u7f6e\u5b88\u885b\u3001\u4fdd\u8b77\u6c34\u6676\u6838\u5fc3\uff0c\u4e26\u89e3\u9396\u5168\u90e8 10 \u500b\u68ee\u6797\u95dc\u5361\u3002\u9032\u5ea6\u6703\u4fdd\u5b58\u5728\u9019\u53f0\u88dd\u7f6e\u3002",
    autoWave: "\u4e0b\u4e00\u6ce2\u5c07\u5728 {seconds} \u79d2\u5f8c\u81ea\u52d5\u958b\u59cb",
  });

  const state = {
    locale: "en",
    screen: "loading",
    save: null,
    selectedBuild: "guard",
    selectedDefender: null,
    keyboardTile: { x: 2, y: 3 },
    keyboardMode: false,
    pointerTile: null,
    currentStage: 1,
    stage: null,
    coins: 0,
    coreHp: 0,
    wave: 0,
    runningWave: false,
    waveSpawned: 0,
    waveToSpawn: 0,
    spawnTimer: 0,
    nextWaveTimer: 0,
    defenders: [],
    enemies: [],
    shots: [],
    effects: [],
    lastTs: 0,
    speed: 1,
    paused: false,
    gameOver: false,
    won: false,
    revived: false,
    coreCriticalShown: false,
    resultReward: null,
    manualSimulation: false,
    soundEnabled: false,
    audioCtx: null,
    impactShake: { life: 0, max: 0, strength: 0 },
    impactFlash: { life: 0, max: 0, color: "255, 209, 102" },
  };

  function t(key, values = {}) {
    let value = text[state.locale]?.[key] || text.en[key] || key;
    Object.entries(values).forEach(([name, replacement]) => {
      value = value.replaceAll(`{${name}}`, replacement);
    });
    return value;
  }

  function track(event, payload = {}) {
    window.WonderAnalytics?.track?.(event, { game_id: GAME_ID, internal: !isPublicRelease, ...payload });
  }

  function updateSoundButton() {
    if (!nodes.soundBtn) return;
    nodes.soundBtn.textContent = t(state.soundEnabled ? "soundOn" : "soundOff");
    nodes.soundBtn.setAttribute("aria-pressed", String(state.soundEnabled));
  }

  function setSoundEnabled(enabled, announce = false) {
    state.soundEnabled = Boolean(enabled);
    localStorage.setItem(soundKey, state.soundEnabled ? "on" : "off");
    updateSoundButton();
    if (announce) showToast(t(state.soundEnabled ? "soundEnabled" : "soundDisabled"));
    track("game_audio_toggle", { enabled: state.soundEnabled });
    if (state.soundEnabled) playSfx("toggle");
  }

  function ensureAudioContext() {
    if (!state.soundEnabled) return null;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    try {
      if (!state.audioCtx) state.audioCtx = new AudioContext();
      if (state.audioCtx.state === "suspended") state.audioCtx.resume?.();
      return state.audioCtx;
    } catch {
      return null;
    }
  }

  function playSfx(type) {
    const audio = ensureAudioContext();
    if (!audio) return false;
    const presets = {
      toggle: [660, 0.08, "sine", 0.028],
      build: [392, 0.1, "triangle", 0.035],
      upgrade: [784, 0.14, "triangle", 0.035],
      sell: [220, 0.08, "sawtooth", 0.022],
      wave: [330, 0.12, "square", 0.026],
      boss: [110, 0.26, "sawtooth", 0.032],
      victory: [880, 0.24, "triangle", 0.04],
      defeat: [146, 0.28, "sine", 0.034],
      revive: [523, 0.16, "sine", 0.038],
      reward: [698, 0.12, "triangle", 0.032],
      unlock: [988, 0.18, "triangle", 0.038],
    };
    const [frequency, duration, wave, volume] = presets[type] || presets.toggle;
    try {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = wave;
      oscillator.frequency.setValueAtTime(frequency, audio.currentTime);
      gain.gain.setValueAtTime(0.0001, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(volume, audio.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(audio.destination);
      oscillator.start();
      oscillator.stop(audio.currentTime + duration + 0.02);
      return true;
    } catch {
      return false;
    }
  }

  function prefersReducedMotion() {
    return Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
  }

  function triggerImpactFeedback(strength = 8, duration = 0.28, color = "255, 209, 102") {
    const reducedMotion = prefersReducedMotion();
    const safeStrength = reducedMotion ? 0 : strength;
    const safeDuration = reducedMotion ? Math.min(duration, 0.22) : duration;
    state.impactShake = {
      life: Math.max(state.impactShake.life || 0, safeDuration),
      max: Math.max(state.impactShake.max || 0, safeDuration),
      strength: Math.max(state.impactShake.strength || 0, safeStrength),
    };
    state.impactFlash = {
      life: Math.max(state.impactFlash.life || 0, safeDuration * 0.75),
      max: Math.max(state.impactFlash.max || 0, safeDuration * 0.75),
      color,
    };
  }

  function updateImpactFeedback(dt) {
    state.impactShake.life = Math.max(0, (state.impactShake.life || 0) - dt);
    state.impactFlash.life = Math.max(0, (state.impactFlash.life || 0) - dt);
    if (state.impactShake.life <= 0) state.impactShake.strength = 0;
  }

  function impactOffset() {
    const shake = state.impactShake;
    if (!shake?.life || !shake.max || !shake.strength) return { x: 0, y: 0, ratio: 0 };
    const ratio = Math.max(0, Math.min(1, shake.life / shake.max));
    const beat = performance.now() / 28;
    return {
      x: Math.sin(beat) * shake.strength * ratio,
      y: Math.cos(beat * 1.27) * shake.strength * ratio,
      ratio,
    };
  }

  function unitName(unit) {
    return unit.name[state.locale] || unit.name.en;
  }

  function unitKindLabel(unit) {
    return unit?.kind === "hero" ? t("unitKindHero") : t("unitKindSoldier");
  }

  function loadSave() {
    try {
      const parsed = JSON.parse(localStorage.getItem(saveKey) || "{}");
      return {
        bestStage: Math.max(1, Number(parsed.bestStage) || 1),
        diamonds: Math.max(0, Number(parsed.diamonds) || 12),
        upgradePoints: Math.max(0, Number(parsed.upgradePoints) || 0),
        tech: { power: 0, bulwark: 0, economy: 0, ...(parsed.tech || {}) },
        cosmetics: { goldenFrame: false, ...(parsed.cosmetics || {}) },
        clears: parsed.clears || {},
        stars: parsed.stars || {},
      };
    } catch {
      return { bestStage: 1, diamonds: 12, upgradePoints: 0, tech: { power: 0, bulwark: 0, economy: 0 }, cosmetics: { goldenFrame: false }, clears: {}, stars: {} };
    }
  }

  function save() {
    localStorage.setItem(saveKey, JSON.stringify(state.save));
    updateProfile();
  }

  function setScreen(screen) {
    state.screen = screen;
    document.body.classList.toggle("guardian-playing", screen === "game" || screen === "result");
    document.body.classList.toggle("guardian-stage", screen === "stages");
    [nodes.menuPanel, nodes.stagePanel, nodes.techPanel, nodes.gamePanel, nodes.resultPanel].forEach((panel) => panel?.classList.add("is-hidden"));
    if (screen === "menu") nodes.menuPanel.classList.remove("is-hidden");
    if (screen === "stages") nodes.stagePanel.classList.remove("is-hidden");
    if (screen === "tech") nodes.techPanel.classList.remove("is-hidden");
    if (screen === "game") nodes.gamePanel.classList.remove("is-hidden");
    if (screen === "result") nodes.resultPanel.classList.remove("is-hidden");
    updateBattleShell();
  }

  function updateBattleShell() {
    if (!document.body.classList.contains("guardian-playing")) return;
    const viewport = window.visualViewport;
    const width = viewport?.width >= window.innerWidth * 0.75 ? viewport.width : window.innerWidth;
    const height = viewport?.height >= window.innerHeight * 0.75 ? viewport.height : window.innerHeight;
    const style = document.documentElement.style;
    style.setProperty("--guardian-vw", `${width}px`);
    style.setProperty("--guardian-vh", `${height}px`);
  }

  function updateLocale() {
    document.documentElement.lang = state.locale;
    nodes.gameTitle.textContent = t("title");
    nodes.languageLabel.textContent = t("language");
    nodes.releaseBadge.textContent = t(isPublicRelease ? "publicReleaseBadge" : "releaseBadge");
    nodes.menuTitle.textContent = t("menuTitle");
    nodes.menuHint.textContent = t("menuHint");
    nodes.holdNotice.textContent = t(isPublicRelease ? "publicNotice" : "holdNotice");
    nodes.bestStageLabel.textContent = t("bestStage");
    nodes.upgradePointLabel.textContent = t("upgradePoints");
    nodes.diamondLabel.textContent = t("diamonds");
    nodes.startBtn.textContent = t("start");
    nodes.techBtn.textContent = t("tech");
    nodes.techBackBtn.textContent = t("back");
    nodes.stageTitle.textContent = t("chooseStage");
    nodes.stageBackBtn.textContent = "\u2190";
    nodes.menuBtn.textContent = t("menu");
    nodes.buildTitle.textContent = t("build");
    nodes.stageHudLabel.textContent = t("stage");
    nodes.coreHudLabel.textContent = t("core");
    nodes.coinHudLabel.textContent = t("coins");
    nodes.waveHudLabel.textContent = t("wave");
    nodes.waveIntelLabel.textContent = t("waveIntel");
    nodes.bossLabel.textContent = t("bossPressure");
    nodes.bossHintText.textContent = t("bossNoSignal");
    nodes.upgradeBtn.textContent = t("upgrade");
    nodes.sellBtn.textContent = t("sell");
    nodes.reviveBtn.textContent = t("revive");
    nodes.retryBtn.textContent = t("retry");
    nodes.resultMenuBtn.textContent = t("menu");
    nodes.nextStageBtn.textContent = t("nextStage");
    nodes.rerollRewardBtn.textContent = t("rerollReward");
    updateSoundButton();
    nodes.techTitle.textContent = t("techTitle");
    nodes.techHint.textContent = t("techHint");
    renderBuildCards();
    renderStages();
    renderTech();
    updateHud();
  }

  function updateProfile() {
    nodes.bestStageText.textContent = state.save.bestStage;
    nodes.upgradePointText.textContent = state.save.upgradePoints;
    nodes.diamondText.textContent = state.save.diamonds;
  }

  function renderBuildCards() {
    nodes.buildCards.innerHTML = "";
    unitTypes.forEach((unit) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `build-card ${state.selectedBuild === unit.id ? "is-selected" : ""}`;
      button.dataset.id = unit.id;
      button.innerHTML = `<img src="${assetSources[unit.img]}" alt="" /><div><strong>${unitName(unit)}</strong><span>${unitKindLabel(unit)} | ${t("cost")}: ${unit.cost}</span><span>${unit.note[state.locale] || unit.note.en}</span><span class="build-affordability"></span></div>`;
      button.addEventListener("click", () => {
        state.selectedBuild = unit.id;
        state.selectedDefender = null;
        renderBuildCards();
        renderSelectedInfo();
      });
      nodes.buildCards.appendChild(button);
    });
    updateBuildAffordability();
  }

  function updateBuildAffordability() {
    nodes.buildCards.querySelectorAll(".build-card").forEach((card) => {
      const unit = unitTypes.find((item) => item.id === card.dataset.id);
      if (!unit) return;
      const affordable = state.coins >= unit.cost;
      const missing = Math.max(0, Math.ceil(unit.cost - state.coins));
      card.classList.toggle("is-unaffordable", !affordable);
      card.dataset.affordable = String(affordable);
      card.setAttribute("aria-label", `${unitName(unit)}. ${t("cost")}: ${unit.cost}. ${affordable ? t("buildReady") : t("buildNeedCoins", { coins: missing })}`);
      const status = card.querySelector(".build-affordability");
      if (status) status.textContent = affordable ? t("buildReady") : t("buildNeedCoins", { coins: missing });
    });
  }

  function unitRoleText(unit) {
    if (!unit) return t("unitSupport");
    return unit.note[state.locale] || unit.note.en || t("unitSupport");
  }

  function formatUnitTempo(unit) {
    return t("everySeconds", { seconds: Number(unit?.cooldown || 0).toFixed(2) });
  }

  function unitTraitText(unit) {
    if (!unit) return "";
    const traits = [];
    if (unit.splash) traits.push(t("traitSplash", { tiles: Number(unit.splash).toFixed(1) }));
    if (unit.slow) traits.push(t("traitSlow", { percent: Math.round(unit.slow * 100) }));
    if (unit.heal) traits.push(t("traitHealing", { points: unit.heal }));
    if (unit.buff) traits.push(t("traitBuff", { percent: Math.round(unit.buff * 100) }));
    return traits.join(" | ");
  }

  function renderSelectedInfo() {
    if (state.selectedDefender) {
      const d = state.selectedDefender;
      const unit = unitTypes.find((item) => item.id === d.type);
      const traits = unitTraitText(unit);
      nodes.selectedInfo.innerHTML = `<strong>${d.name}</strong><span>${t("roleLabel")}: ${unitRoleText(unit)}</span>${traits ? `<span>${t("traitLabel")}: ${traits}</span>` : ""}<span>${t("level")} ${d.level} | ${t("hp")}: ${Math.ceil(d.hp)}/${d.maxHp}</span><span>${t("damage")}: ${Math.ceil(d.damage)} | ${t("range")}: ${d.range} | ${t("attackSpeed")}: ${formatUnitTempo(unit || d)}</span><span>${t("selectedActionInfo", { upgrade: upgradeCost(d), sell: sellRefund(d) })}</span>`;
      updateCommandButtons();
      return;
    }
    const unit = unitTypes.find((item) => item.id === state.selectedBuild);
    const traits = unitTraitText(unit);
    nodes.selectedInfo.innerHTML = unit
      ? `<strong>${unitName(unit)}</strong><span>${t("roleLabel")}: ${unitRoleText(unit)}</span>${traits ? `<span>${t("traitLabel")}: ${traits}</span>` : ""}<span>${t("cost")}: ${unit.cost} | ${t("hp")}: ${unit.hp}</span><span>${t("damage")}: ${unit.damage} | ${t("range")}: ${unit.range} | ${t("attackSpeed")}: ${formatUnitTempo(unit)}</span>`
      : "";
    updateCommandButtons();
  }

  function renderStages() {
    nodes.stageRail.innerHTML = "";
    stages.forEach((stage) => {
      const unlocked = stage.id <= state.save.bestStage;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "stage-card";
      button.setAttribute("aria-disabled", String(!unlocked));
      button.dataset.stageId = String(stage.id);
      if (stage.id === Math.min(10, state.save.bestStage)) button.setAttribute("aria-current", "true");
      const bestStars = Number(state.save.stars?.[stage.id] || 0);
      const status = !unlocked ? t("locked") : bestStars ? t("starRating", { stars: bestStars }) : state.save.clears[stage.id] ? t("cleared") : stage.boss ? t("bossStage") : t("stage");
      const rewardText = `+${stage.reward.points} ${t("upgradePoints")} / +${stage.reward.diamonds} ${t("diamonds")}`;
      button.innerHTML = `<strong>${stage.id}. ${stage.name[state.locale]}</strong><span class="stage-status">${status}</span><span>${stage.waves} ${t("wave")} | ${stage.boss ? t("boss") : t("guardianRoute")}</span><span class="stage-intel"><b>${t("threatIntel")}:</b> ${stage.intel.threat[state.locale] || stage.intel.threat.en}</span><span class="stage-intel"><b>${t("recommendedPlan")}:</b> ${stage.intel.plan[state.locale] || stage.intel.plan.en}</span><span class="stage-reward"><b>${t("rewardIntel")}:</b> ${rewardText}</span>`;
      button.addEventListener("click", () => {
        if (!unlocked) return showToast(t("lockedStage"));
        startStage(stage.id);
      });
      nodes.stageRail.appendChild(button);
    });
    requestAnimationFrame(() => centerStageCard(Math.min(10, state.save.bestStage)));
  }

  function centerStageCard(stageId) {
    const card = nodes.stageRail.querySelector(`[data-stage-id="${stageId}"]`);
    card?.scrollIntoView?.({ behavior: "auto", inline: "center", block: "nearest" });
  }

  function snapStageRailToNearest(behavior = "smooth") {
    const cards = Array.from(nodes.stageRail.querySelectorAll(".stage-card"));
    if (!cards.length) return;
    const railBox = nodes.stageRail.getBoundingClientRect();
    const railCenter = railBox.left + railBox.width / 2;
    const nearest = cards
      .map((card) => {
        const box = card.getBoundingClientRect();
        return { card, distance: Math.abs(box.left + box.width / 2 - railCenter) };
      })
      .sort((a, b) => a.distance - b.distance)[0]?.card;
    nearest?.scrollIntoView?.({ behavior, inline: "center", block: "nearest" });
  }

  function renderTech() {
    nodes.techGrid.innerHTML = "";
    techs.forEach((tech) => {
      const level = state.save.tech[tech.id] || 0;
      const card = document.createElement("div");
      card.className = "tech-card";
      const canBuy = level < tech.max && state.save.upgradePoints >= tech.cost;
      card.innerHTML = `<strong>${t(tech.label)} ${level}/${tech.max}</strong><span>${t(tech.desc)}</span>`;
      const button = document.createElement("button");
      button.type = "button";
      button.className = canBuy ? "primary-btn" : "secondary-btn";
      button.disabled = !canBuy;
      button.textContent = t("techBuy");
      button.addEventListener("click", () => {
        if (!canBuy) return;
        state.save.upgradePoints -= tech.cost;
        state.save.tech[tech.id] = level + 1;
        save();
        renderTech();
        playSfx("upgrade");
        track("game_permanent_upgrade", { tech: tech.id, level: level + 1, cost: tech.cost });
      });
      card.appendChild(button);
      nodes.techGrid.appendChild(card);
    });
    const owned = Boolean(state.save.cosmetics?.goldenFrame);
    const canBuyFrame = !owned && state.save.diamonds >= 15;
    const card = document.createElement("div");
    card.className = "tech-card";
    card.innerHTML = `<strong>${t("goldenFrame")}</strong><span>${t("goldenFrameDesc")}</span>`;
    const button = document.createElement("button");
    button.type = "button";
    button.className = canBuyFrame ? "primary-btn" : "secondary-btn";
    button.disabled = owned || !canBuyFrame;
    button.textContent = owned ? t("goldenFrameOwned") : t("goldenFrameBuy");
    button.addEventListener("click", buyGoldenFrame);
    card.appendChild(button);
    nodes.techGrid.appendChild(card);
  }

  function buyGoldenFrame() {
    state.save.cosmetics = { goldenFrame: false, ...(state.save.cosmetics || {}) };
    if (state.save.cosmetics.goldenFrame) return;
    if (state.save.diamonds < 15) return showToast(t("noDiamonds"));
    state.save.diamonds -= 15;
    state.save.cosmetics.goldenFrame = true;
    save();
    renderTech();
    playSfx("unlock");
    track("game_spend_virtual_currency", { stage: state.currentStage, item: "golden_defender_frame", currency: "diamonds", amount: 15 });
  }

  function startStage(id) {
    const stage = stages[id - 1];
    const tech = state.save.tech;
    state.currentStage = id;
    state.stage = stage;
    state.coins = stage.startCoins + tech.economy * 20;
    state.coreHp = stage.coreHp;
    state.wave = 0;
    state.runningWave = false;
    state.paused = false;
    state.waveSpawned = 0;
    state.waveToSpawn = 0;
    state.spawnTimer = 0;
    state.nextWaveTimer = 0;
    state.resultReward = null;
    state.defenders = [];
    state.enemies = [];
    state.shots = [];
    state.effects = [];
    state.selectedDefender = null;
    state.gameOver = false;
    state.won = false;
    state.revived = false;
    state.coreCriticalShown = false;
    state.selectedBuild = "guard";
    state.keyboardTile = { x: 2, y: 3 };
    state.keyboardMode = false;
    state.pointerTile = null;
    setScreen("game");
    renderBuildCards();
    renderSelectedInfo();
    updateHud();
    track("game_start", { stage: id });
  }

  function updateHud() {
    if (!nodes.stageHudText) return;
    nodes.stageHudText.textContent = state.stage ? `${state.currentStage}/10` : "-";
    nodes.coreText.textContent = Math.max(0, Math.ceil(state.coreHp));
    nodes.coinText.textContent = Math.floor(state.coins);
    nodes.waveText.textContent = state.stage ? `${state.wave}/${state.stage.waves}` : "0/0";
    const autoWavePending = !state.runningWave && state.nextWaveTimer > 0;
    nodes.waveBtn.textContent = state.runningWave
      ? t("nextWave")
      : autoWavePending
        ? t("autoWave", { seconds: Math.max(1, Math.ceil(state.nextWaveTimer)) })
        : t("startWave");
    nodes.waveBtn.disabled = state.runningWave || state.gameOver || autoWavePending;
    nodes.speedBtn.textContent = state.paused ? t("paused") : `${state.speed}x`;
    nodes.speedBtn.setAttribute("aria-pressed", String(state.paused));
    nodes.reviveBtn.disabled = state.revived || state.save.diamonds < 5 || state.coreHp > 0;
    updateCommandButtons();
    updateBuildAffordability();
    updateWaveIntel();
    updateBossPanel();
    updateCanvasAccessibility();
    renderSelectedInfo();
  }

  function updateCanvasAccessibility() {
    if (!nodes.canvas || !state.stage) return;
    nodes.canvas.setAttribute("aria-label", `${t("title")} ${t("keyboardFocus", { x: state.keyboardTile.x + 1, y: state.keyboardTile.y + 1 })}`);
  }

  function coreHpRatio() {
    if (!state.stage?.coreHp) return 1;
    return Math.max(0, Math.min(1, state.coreHp / state.stage.coreHp));
  }

  function isCoreCritical() {
    return Boolean(state.stage && !state.gameOver && coreHpRatio() <= 0.35);
  }

  function checkCoreCriticalFeedback() {
    if (!isCoreCritical() || state.coreCriticalShown) return;
    state.coreCriticalShown = true;
    showToast(t("coreCritical"));
    playSfx("defeat");
    triggerImpactFeedback(7, 0.24, "255, 70, 70");
    track("game_core_critical", { stage: state.currentStage, wave: state.wave, core_hp: Math.max(0, Math.ceil(state.coreHp)) });
  }

  function formatWaveEnemies(profile) {
    const count = (type) => Number(profile.counts?.[type] || 0);
    return [
      count("wolf") ? t("enemyWolf", { count: count("wolf") }) : "",
      count("boar") ? t("enemyBoar", { count: count("boar") }) : "",
      count("bat") ? t("enemyBat", { count: count("bat") }) : "",
      count("boss") ? t("enemyBoss", { boss: profile.bossName || t("boss"), count: count("boss") }) : "",
    ].filter(Boolean).join(" / ");
  }

  function localizedBossName(stage) {
    if (!stage?.boss) return "";
    if (stage.id === 10) return t("bossForestName");
    if (stage.id === 5) return t("bossShadowName");
    return stage.bossName || t("boss");
  }

  function updateWaveIntel() {
    if (!nodes.waveIntelText || !state.stage) return;
    const routeStatus = findPath(false) ? t("routeOpen") : t("routeBlocked");
    if (state.wave >= state.stage.waves && !state.runningWave) {
      nodes.waveIntelText.textContent = `${routeStatus} | ${t("waveIntelDone")}`;
      return;
    }
    const previewWave = state.runningWave ? state.wave : Math.min(state.stage.waves, state.wave + 1);
    const profile = waveProfile(state.currentStage, previewWave);
    const enemies = formatWaveEnemies(profile);
    const waveText = state.runningWave
      ? t("waveIntelActive", {
          wave: previewWave,
          total: state.stage.waves,
          remaining: Math.max(0, state.waveToSpawn - state.waveSpawned + state.enemies.length),
          enemies,
        })
      : t("waveIntelReady", { wave: previewWave, total: state.stage.waves, enemies });
    nodes.waveIntelText.textContent = `${routeStatus} | ${waveText}`;
  }

  function updateBossPanel() {
    if (!nodes.bossPanel) return;
    const boss = state.enemies.find((enemy) => enemy.boss && enemy.hp > 0);
    const upcomingBoss = state.stage?.boss && state.wave === state.stage.waves && state.runningWave;
    if (!boss && !upcomingBoss) {
      nodes.bossPanel.classList.add("is-hidden");
      nodes.bossNameText.textContent = localizedBossName(state.stage) || t("bossNoSignal");
      nodes.bossHpText.textContent = "0%";
      nodes.bossMeterFill.style.width = "0%";
      nodes.bossHintText.textContent = t("bossNoSignal");
      return;
    }
    const ratio = boss ? Math.max(0, Math.min(1, boss.hp / boss.maxHp)) : 1;
    nodes.bossPanel.classList.remove("is-hidden");
    const bossName = localizedBossName(state.stage) || t("boss");
    nodes.bossNameText.textContent = bossName;
    nodes.bossHpText.textContent = `${Math.ceil(ratio * 100)}%`;
    nodes.bossMeterFill.style.width = `${Math.ceil(ratio * 100)}%`;
    nodes.bossHintText.textContent = boss ? t("bossHoldRoute") : t("bossIncoming", { boss: bossName });
  }

  function showToast(message) {
    nodes.toast.textContent = message;
    nodes.toast.classList.remove("is-hidden");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => nodes.toast.classList.add("is-hidden"), 1800);
  }

  function tileToPoint(tile) {
    const board = getBoard();
    return {
      x: board.x + tile.x * board.cell + board.cell / 2,
      y: board.y + tile.y * board.cell + board.cell / 2,
    };
  }

  function pointToTile(x, y) {
    const board = getBoard();
    return {
      x: Math.floor((x - board.x) / board.cell),
      y: Math.floor((y - board.y) / board.cell),
    };
  }

  function getBoard() {
    const width = nodes.canvas.width;
    const height = nodes.canvas.height;
    const cell = Math.min(width / grid.cols, height / grid.rows);
    const boardWidth = cell * grid.cols;
    const boardHeight = cell * grid.rows;
    return { x: (width - boardWidth) / 2, y: (height - boardHeight) / 2, cell, width: boardWidth, height: boardHeight };
  }

  function isInside(tile) {
    return tile.x >= 0 && tile.x < grid.cols && tile.y >= 0 && tile.y < grid.rows;
  }

  function sameTile(a, b) {
    return a && b && a.x === b.x && a.y === b.y;
  }

  function defenderAt(tile) {
    return state.defenders.find((d) => d.tile.x === tile.x && d.tile.y === tile.y && d.hp > 0);
  }

  function canBuild(tile) {
    return isInside(tile) && !sameTile(tile, startTile) && !sameTile(tile, coreTile) && !defenderAt(tile);
  }

  function buildUnit(tile) {
    if (!canBuild(tile)) {
      showToast(defenderAt(tile) ? t("occupied") : t("blockedBuild"));
      return false;
    }
    const unit = unitTypes.find((item) => item.id === state.selectedBuild);
    if (!unit) return false;
    if (state.coins < unit.cost) {
      showToast(t("noCoins"));
      return false;
    }
    const tech = state.save.tech;
    const isHero = unit.kind === "hero";
    const maxHp = unit.hp + tech.bulwark * 12 + (isHero ? 20 : 0);
    const damage = unit.damage * (isHero ? 1 + tech.power * 0.1 : 1);
    state.coins -= unit.cost;
    const defender = {
      id: `${unit.id}-${Date.now()}-${Math.random()}`,
      type: unit.id,
      img: unit.img,
      sheet: "",
      kind: unit.kind,
      name: unitName(unit),
      tile: { ...tile },
      hp: maxHp,
      maxHp,
      damage,
      range: unit.range,
      cooldown: unit.cooldown,
      cd: 0,
      level: 1,
      cost: unit.cost,
      slow: unit.slow || 0,
      splash: unit.splash || 0,
      heal: unit.heal || 0,
      buff: unit.buff || 0,
      animTime: Math.random() * 0.4,
      actionPulse: 0,
      actionFrame: 0,
    };
    state.defenders.push(defender);
    addSkillEffect(tileToPoint(defender.tile), skillFxFrames.gear, 0.82, 0.36);
    addFloatingText(tileToPoint(defender.tile), t("buildFeedback"), "#d9f99d");
    showToast(t("built", { name: unitName(unit) }));
    playSfx("build");
    track("game_build_unit", { stage: state.currentStage, unit: unit.id, kind: unit.kind, cost: unit.cost });
    updateEnemyPaths();
    updateHud();
    return true;
  }

  function upgradeSelected() {
    const d = state.selectedDefender;
    if (!d || state.gameOver) return;
    const cost = upgradeCost(d);
    if (state.coins < cost) return showToast(t("noCoins"));
    state.coins -= cost;
    d.level += 1;
    d.maxHp += 32 + d.level * 8;
    d.hp = d.maxHp;
    d.damage *= 1.28;
    d.range += d.level % 2 === 0 ? 0.18 : 0;
    addSkillEffect(tileToPoint(d.tile), skillFxFrames.gear, 1.05, 0.5);
    addFloatingText(tileToPoint(d.tile), t("upgradeFeedback", { level: d.level }), "#fef08a");
    showToast(t("upgraded", { name: d.name, level: d.level }));
    playSfx("upgrade");
    track("game_upgrade_unit", { stage: state.currentStage, unit: d.type, level: d.level, cost });
    updateHud();
  }

  function sellSelected() {
    const d = state.selectedDefender;
    if (!d || state.gameOver) return;
    const refund = sellRefund(d);
    const point = tileToPoint(d.tile);
    state.coins += refund;
    state.defenders = state.defenders.filter((item) => item !== d);
    state.selectedDefender = null;
    addSkillEffect(point, skillFxFrames.heal, 0.85, 0.38);
    addFloatingText(point, t("sellFeedback", { coins: refund }), "#fde68a");
    showToast(t("sold"));
    playSfx("sell");
    track("game_sell_unit", { stage: state.currentStage, unit: d.type, level: d.level });
    updateEnemyPaths();
    updateHud();
  }

  function upgradeCost(defender) {
    return Math.round(defender.cost * (0.55 + defender.level * 0.42));
  }

  function sellRefund(defender) {
    return Math.round(defender.cost * 0.55 * defender.level);
  }

  function updateCommandButtons() {
    if (!nodes.upgradeBtn || !nodes.sellBtn) return;
    const d = state.selectedDefender;
    const hasSelection = Boolean(d && !state.gameOver);
    const cost = hasSelection ? upgradeCost(d) : 0;
    const refund = hasSelection ? sellRefund(d) : 0;
    nodes.upgradeBtn.disabled = !hasSelection || state.coins < cost;
    nodes.sellBtn.disabled = !hasSelection;
    nodes.upgradeBtn.textContent = hasSelection ? t("upgradeAction", { coins: cost }) : t("upgrade");
    nodes.sellBtn.textContent = hasSelection ? t("sellAction", { coins: refund }) : t("sell");
  }

  function startWave() {
    if (!state.stage || state.runningWave || state.gameOver) return;
    state.nextWaveTimer = 0;
    state.wave += 1;
    state.runningWave = true;
    state.waveSpawned = 0;
    state.waveToSpawn = waveEnemyCount(state.stage, state.wave);
    state.spawnTimer = 0;
    playSfx("wave");
    track("game_wave_start", { stage: state.currentStage, wave: state.wave, total_waves: state.stage.waves, enemies: state.waveToSpawn });
    updateHud();
  }

  function waveEnemyCount(stage, wave) {
    const base = 4 + Math.ceil(stage.id * 0.7) + wave + Math.floor(stage.threat / 4);
    return base + (stage.boss && wave === stage.waves ? 1 : 0);
  }

  function enemyTypeForSpawn(stage, wave, spawnIndex, total, isBoss) {
    if (isBoss) return "boss";
    const remainingBeforeBoss = total - spawnIndex - 1;
    if (stage.boss && wave === stage.waves && remainingBeforeBoss < stage.finalEscortCount) {
      return remainingBeforeBoss % 2 === 0 ? "boar" : "bat";
    }
    const mix = (spawnIndex + wave + stage.id + stage.threat) % 5;
    if (mix === 0 || mix === 4) return "boar";
    if (mix === 1) return "bat";
    return "wolf";
  }

  function waveProfile(stageId, wave) {
    const stage = stages[stageId - 1];
    const total = waveEnemyCount(stage, wave);
    const types = Array.from({ length: total }, (_, index) => {
      const isBoss = stage.boss && wave === stage.waves && index === total - 1;
      return enemyTypeForSpawn(stage, wave, index, total, isBoss);
    });
    const counts = types.reduce((map, type) => ({ ...map, [type]: (map[type] || 0) + 1 }), {});
    return {
      stage: stage.id,
      wave,
      total,
      types,
      counts,
      boss: Boolean(counts.boss),
      bossName: localizedBossName(stage),
      bossHp: stage.boss ? Math.round(stage.enemyHp * stage.bossHpScale) : 0,
      bossDamage: stage.bossDamage,
      finalEscortCount: stage.finalEscortCount,
      spawnCadence: stage.spawnCadence,
    };
  }

  function spawnEnemy() {
    const isBoss = state.stage.boss && state.wave === state.stage.waves && state.waveSpawned === state.waveToSpawn - 1;
    const type = enemyTypeForSpawn(state.stage, state.wave, state.waveSpawned, state.waveToSpawn, isBoss);
    const hpScale = isBoss ? state.stage.bossHpScale : type === "boar" ? 1.75 : type === "bat" ? 0.82 : 1;
    const speedScale = isBoss ? 0.58 : type === "bat" ? 1.35 : type === "boar" ? 0.72 : 1;
    const enemy = {
      id: `e-${Date.now()}-${Math.random()}`,
      type,
      img: isBoss ? "boss" : type,
      sheet: "",
      tile: { ...startTile },
      pos: tileToPoint(startTile),
      hp: state.stage.enemyHp * hpScale,
      maxHp: state.stage.enemyHp * hpScale,
      speed: state.stage.enemySpeed * speedScale,
      damage: isBoss ? state.stage.bossDamage : type === "boar" ? 18 : 11 + state.currentStage,
      attackCd: 0,
      path: [],
      pathIndex: 0,
      targetDefender: null,
      animTime: Math.random() * 0.4,
      actionPulse: 0,
      actionFrame: 0,
      hitPulse: 0,
      boss: isBoss,
      flying: type === "bat",
      slow: 0,
    };
    setEnemyPath(enemy);
    state.enemies.push(enemy);
    if (isBoss) {
      addSkillEffect(enemy.pos, skillFxFrames.bossPortal, 1.75, 0.82);
      triggerImpactFeedback(12, 0.36, "255, 70, 70");
      showToast(t("bossIncoming", { boss: localizedBossName(state.stage) || t("boss") }));
      playSfx("boss");
      track("game_boss_spawn", { stage: state.currentStage, wave: state.wave, boss: state.stage.bossName || "Boss" });
    }
    state.waveSpawned += 1;
    return enemy;
  }

  function findPath(ignoreBlockers = false) {
    return findPathFrom(startTile, ignoreBlockers);
  }

  function findPathFrom(originTile, ignoreBlockers = false) {
    const blocked = new Set();
    if (!ignoreBlockers) {
      state.defenders.forEach((d) => {
        if (d.hp > 0) blocked.add(`${d.tile.x},${d.tile.y}`);
      });
    }
    const key = (tile) => `${tile.x},${tile.y}`;
    const start = { ...originTile };
    const queue = [start];
    const came = new Map([[key(start), null]]);
    while (queue.length) {
      const current = queue.shift();
      if (sameTile(current, coreTile)) {
        const path = [];
        let cursor = current;
        while (cursor) {
          path.unshift(cursor);
          cursor = came.get(key(cursor));
        }
        return path;
      }
      [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
      ].forEach((delta) => {
        const next = { x: current.x + delta.x, y: current.y + delta.y };
        const nextKey = key(next);
        if (!isInside(next) || came.has(nextKey)) return;
        if (!sameTile(next, coreTile) && !sameTile(next, startTile) && blocked.has(nextKey)) return;
        came.set(nextKey, current);
        queue.push(next);
      });
    }
    return null;
  }

  function enemyAttackRange(enemy) {
    return enemy?.boss ? 2.15 : 1.45;
  }

  function nearestAttackableDefender(enemy) {
    return state.defenders
      .filter((d) => d.hp > 0 && tileDistance(enemy.tile, d.tile) <= enemyAttackRange(enemy))
      .sort((a, b) => tileDistance(enemy.tile, a.tile) - tileDistance(enemy.tile, b.tile))[0] || null;
  }

  function nearestBlocker(enemy) {
    const clearPath = findPath(true) || [];
    let best = null;
    let bestScore = Infinity;
    state.defenders.forEach((d) => {
      if (d.hp <= 0) return;
      const pathIndex = clearPath.findIndex((tile) => sameTile(tile, d.tile));
      const dist = Math.abs(enemy.tile.x - d.tile.x) + Math.abs(enemy.tile.y - d.tile.y);
      const score = (pathIndex >= 0 ? pathIndex : 99) + dist * 0.2;
      if (score < bestScore) {
        best = d;
        bestScore = score;
      }
    });
    return best;
  }

  function setEnemyPath(enemy) {
    if (enemy.flying) {
      enemy.path = [startTile, { x: 4, y: 2 }, { x: 7, y: 5 }, coreTile];
      enemy.pathIndex = 1;
      enemy.targetDefender = null;
      return;
    }
    const path = findPath(false);
    if (path) {
      const currentPathIndex = path.findIndex((tile) => sameTile(tile, enemy.tile));
      const currentPath = currentPathIndex >= 0 ? path : findPathFrom(enemy.tile, false);
      enemy.path = currentPath || path;
      enemy.pathIndex = currentPathIndex >= 0 ? Math.max(1, currentPathIndex + 1) : 1;
      enemy.targetDefender = null;
      return;
    }
    const attackTarget = nearestAttackableDefender(enemy);
    if (attackTarget) {
      enemy.path = [];
      enemy.pathIndex = 0;
      enemy.targetDefender = attackTarget;
      showToast(t("blocked"));
      return;
    }
    const fallbackPath = findPathFrom(enemy.tile, true);
    enemy.path = fallbackPath || [];
    enemy.pathIndex = fallbackPath ? 1 : 0;
    enemy.targetDefender = null;
    if (fallbackPath) showToast(t("blocked"));
  }

  function updateEnemyPaths() {
    state.enemies.forEach(setEnemyPath);
  }

  function update(dt) {
    if (state.screen !== "game" || state.gameOver) return;
    if (state.paused) return;
    const step = dt * state.speed;
    if (!state.manualSimulation && !state.runningWave && state.nextWaveTimer > 0) {
      const previousSecond = Math.ceil(state.nextWaveTimer);
      state.nextWaveTimer = Math.max(0, state.nextWaveTimer - step);
      if (state.nextWaveTimer === 0) startWave();
      else if (Math.ceil(state.nextWaveTimer) !== previousSecond) updateHud();
    }
    if (state.runningWave) {
      state.spawnTimer -= step;
      if (state.spawnTimer <= 0 && state.waveSpawned < state.waveToSpawn) {
        const spawned = spawnEnemy();
        const escortPressure = state.stage.boss && state.wave === state.stage.waves && state.waveToSpawn - state.waveSpawned <= state.stage.finalEscortCount + 1;
        state.spawnTimer = spawned?.boss ? 1.15 : escortPressure ? Math.max(0.24, state.stage.spawnCadence * 0.72) : state.stage.spawnCadence;
      }
      if (state.waveSpawned >= state.waveToSpawn && state.enemies.length === 0) {
        state.runningWave = false;
        if (state.wave >= state.stage.waves) return winStage();
        showWaveClearFeedback();
      }
    }
    updateDefenders(step);
    updateEnemies(step);
    checkCoreCriticalFeedback();
    updateShots(step);
    updateEffects(step);
    updateImpactFeedback(step);
    updateHud();
  }

  function cycleSpeedControl() {
    if (state.paused) {
      state.paused = false;
      state.speed = 1;
    } else if (state.speed === 1) {
      state.speed = 2;
    } else if (state.speed === 2) {
      state.speed = 3;
    } else {
      state.paused = true;
    }
    track("game_speed_change", { stage: state.currentStage, speed: state.speed, paused: state.paused });
    updateHud();
  }

  function updateDefenders(dt) {
    state.defenders.forEach((d) => {
      d.animTime = (d.animTime || 0) + dt;
      d.actionPulse = Math.max(0, (d.actionPulse || 0) - dt);
      d.hitPulse = Math.max(0, (d.hitPulse || 0) - dt);
      d.cd -= dt;
      if (d.heal && d.cd <= 0) {
        const ally = state.defenders.filter((item) => item.hp > 0 && item.hp < item.maxHp).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
        if (ally && tileDistance(d.tile, ally.tile) <= d.range + 0.6) {
          const healAmount = Math.min(ally.maxHp - ally.hp, d.heal * d.level);
          ally.hp = Math.min(ally.maxHp, ally.hp + healAmount);
          d.cd = d.cooldown;
          d.actionPulse = 0.32;
          d.actionFrame = 3;
          addSkillEffect(tileToPoint(ally.tile), skillFxFrames.heal, 1.1, 0.56);
          addFloatingText(tileToPoint(ally.tile), `+${Math.ceil(healAmount)}`, "#9ff7b8");
          return;
        }
      }
      const target = state.enemies
        .filter((e) => e.hp > 0 && tileDistance(d.tile, e.tile) <= d.range)
        .sort((a, b) => (b.boss ? 1 : 0) - (a.boss ? 1 : 0) || a.hp - b.hp)[0];
      if (!target || d.cd > 0) return;
      if (d.damage <= 0) return;
      let damage = d.damage * (1 + (nearbyRuxBuff(d) || 0));
      target.hp -= damage;
      target.hitPulse = Math.max(target.hitPulse || 0, target.boss ? 0.28 : 0.22);
      addFloatingText(target.pos, `-${Math.ceil(damage)}`, target.boss ? "#ffd166" : "#fff3bd");
      if (d.splash) {
        state.enemies
          .filter((enemy) => enemy !== target && enemy.hp > 0 && tileDistance(enemy.tile, target.tile) <= d.splash)
          .forEach((enemy) => {
            const splashDamage = damage * 0.48;
            enemy.hp -= splashDamage;
            enemy.hitPulse = Math.max(enemy.hitPulse || 0, enemy.boss ? 0.24 : 0.18);
            enemy.slow = Math.max(enemy.slow, d.slow || 0);
            addSkillEffect(enemy.pos, skillFxFrames.slow, enemy.boss ? 1.15 : 0.82, 0.38);
            addFloatingText(enemy.pos, `-${Math.ceil(splashDamage)}`, "#93f7ff");
          });
      }
      if (d.slow) target.slow = Math.max(target.slow, d.slow);
      const from = tileToPoint(d.tile);
      const isArrow = d.type === "archer" || d.type === "fia";
      const isSlow = Boolean(d.slow);
      const isGear = d.type === "rux";
      const fxFrame = isGear ? skillFxFrames.gear : isSlow ? skillFxFrames.slow : isArrow ? skillFxFrames.arrow : skillFxFrames.heroStrike;
      state.shots.push({
        from,
        to: { ...target.pos },
        life: 0.2,
        max: 0.2,
        color: isGear ? "#6ff7df" : isSlow ? "#93f7ff" : isArrow ? "#74d7ff" : "#ffd166",
        width: d.kind === "hero" ? 5 : 4,
      });
      addSkillEffect(target.pos, fxFrame, target.boss ? 1.35 : 0.92, target.boss ? 0.62 : 0.46);
      d.actionPulse = 0.32;
      d.actionFrame = 3;
      d.cd = Math.max(0.22, d.cooldown - d.level * 0.035);
      if (target.hp <= 0) {
        state.coins += target.boss ? 95 : 13 + state.currentStage;
        addSkillEffect(target.pos, target.boss ? skillFxFrames.bossPortal : skillFxFrames.heroStrike, target.boss ? 1.55 : 1, target.boss ? 0.72 : 0.5);
      }
    });
    state.enemies = state.enemies.filter((e) => e.hp > 0);
  }

  function nearbyRuxBuff(defender) {
    return state.defenders.some((d) => d.type === "rux" && d !== defender && tileDistance(d.tile, defender.tile) <= 2.2) ? 0.12 : 0;
  }

  function updateEnemies(dt) {
    state.enemies.forEach((enemy) => {
      enemy.animTime = (enemy.animTime || 0) + dt;
      enemy.actionPulse = Math.max(0, (enemy.actionPulse || 0) - dt);
      enemy.hitPulse = Math.max(0, (enemy.hitPulse || 0) - dt);
      enemy.tile = pointToTile(enemy.pos.x, enemy.pos.y);
      enemy.attackCd -= dt;
      if (!enemy.flying && !findPath(false)) {
        const attackTarget = nearestAttackableDefender(enemy);
        if (attackTarget) {
          enemy.targetDefender = attackTarget;
          attackDefender(enemy, dt);
          return;
        }
      }
      if (enemy.targetDefender && enemy.targetDefender.hp > 0) {
        attackDefender(enemy, dt);
        return;
      }
      if (enemy.targetDefender && enemy.targetDefender.hp <= 0) {
        state.defenders = state.defenders.filter((d) => d.hp > 0);
        setEnemyPath(enemy);
      }
      if (!enemy.path || !enemy.path.length || enemy.pathIndex >= enemy.path.length) {
        setEnemyPath(enemy);
      }
      const targetTile = enemy.path?.[enemy.pathIndex];
      if (!targetTile) {
        enemy.targetDefender = nearestAttackableDefender(enemy);
        if (enemy.targetDefender) attackDefender(enemy, dt);
        return;
      }
      const blockerOnTarget = !enemy.flying && defenderAt(targetTile);
      if (blockerOnTarget && tileDistance(enemy.tile, blockerOnTarget.tile) <= enemyAttackRange(enemy)) {
        enemy.targetDefender = blockerOnTarget;
        attackDefender(enemy, dt);
        return;
      }
      const targetPoint = tileToPoint(targetTile);
      const speed = enemy.speed * (enemy.slow ? 1 - enemy.slow : 1);
      enemy.slow = Math.max(0, enemy.slow - dt * 0.35);
      const dx = targetPoint.x - enemy.pos.x;
      const dy = targetPoint.y - enemy.pos.y;
      const dist = Math.hypot(dx, dy);
      const move = speed * dt;
      if (dist <= move) {
        enemy.pos = targetPoint;
        enemy.tile = { ...targetTile };
        enemy.pathIndex += 1;
        if (sameTile(enemy.tile, coreTile)) {
          state.coreHp -= enemy.boss ? 35 : 6 + Math.ceil(state.currentStage * 0.45);
          enemy.hp = 0;
          addSkillEffect(tileToPoint(coreTile), enemy.boss ? skillFxFrames.bossPortal : skillFxFrames.heroStrike, enemy.boss ? 1.45 : 1, 0.55);
          triggerImpactFeedback(enemy.boss ? 14 : 8, enemy.boss ? 0.42 : 0.28, enemy.boss ? "255, 70, 70" : "255, 209, 102");
          if (state.coreHp <= 0) loseStage();
        }
      } else {
        enemy.pos.x += (dx / dist) * move;
        enemy.pos.y += (dy / dist) * move;
      }
    });
    state.enemies = state.enemies.filter((e) => e.hp > 0);
    state.defenders = state.defenders.filter((d) => d.hp > 0);
  }

  function attackDefender(enemy) {
    const d = enemy.targetDefender;
    if (!d || d.hp <= 0) return;
    if (tileDistance(enemy.tile, d.tile) > enemyAttackRange(enemy)) {
      enemy.targetDefender = nearestAttackableDefender(enemy);
      return;
    }
    if (enemy.attackCd <= 0) {
      d.hp -= enemy.damage;
      d.hitPulse = Math.max(d.hitPulse || 0, enemy.boss ? 0.3 : 0.24);
      addFloatingText(tileToPoint(d.tile), `-${Math.ceil(enemy.damage)}`, "#ffb0b0");
      enemy.actionPulse = 0.28;
      enemy.actionFrame = 3;
      d.actionPulse = 0.28;
      d.actionFrame = 2;
      enemy.attackCd = enemy.boss ? 0.72 : 1.05;
      addSkillEffect(tileToPoint(d.tile), enemy.boss ? skillFxFrames.bossPortal : skillFxFrames.heroStrike, enemy.boss ? 1.32 : 0.96, 0.48);
      triggerImpactFeedback(enemy.boss ? 10 : 5, enemy.boss ? 0.34 : 0.18, enemy.boss ? "255, 70, 70" : "255, 209, 102");
      if (d.hp <= 0) {
        if (state.selectedDefender === d) state.selectedDefender = null;
        state.defenders = state.defenders.filter((item) => item.hp > 0);
        updateEnemyPaths();
      }
    }
  }

  function updateShots(dt) {
    state.shots.forEach((shot) => (shot.life -= dt));
    state.shots = state.shots.filter((shot) => shot.life > 0);
  }

  function addEffect(pos, type) {
    state.effects.push({ pos: { ...pos }, type, life: 0.42, max: 0.42 });
  }

  function addFloatingText(pos, textValue, color = "#fff3bd") {
    state.effects.push({
      pos: { ...pos },
      type: "floatingText",
      text: textValue,
      color,
      rise: 18,
      life: 0.72,
      max: 0.72,
    });
  }

  function addSkillEffect(pos, frame, scale = 1, max = 0.46) {
    if (assets.skillFx?.complete) {
      state.effects.push({ pos: { ...pos }, type: "skillFx", frame, scale, life: max, max });
      return;
    }
    addEffect(pos, frame === skillFxFrames.bossPortal ? "portal" : frame === skillFxFrames.heroStrike ? "slash" : "hit");
  }

  function updateEffects(dt) {
    state.effects.forEach((effect) => (effect.life -= dt));
    state.effects = state.effects.filter((effect) => effect.life > 0);
  }

  function showWaveClearFeedback() {
    const message = t("waveClearFeedback", { wave: state.wave });
    const core = tileToPoint(coreTile);
    showToast(message);
    addFloatingText(core, message, "#d9f99d");
    addSkillEffect(core, skillFxFrames.heal, 1.18, 0.52);
    playSfx("reward");
    track("game_wave_clear", { stage: state.currentStage, wave: state.wave, core_hp: Math.max(0, Math.ceil(state.coreHp)) });
    if (!state.manualSimulation && state.wave < state.stage.waves) state.nextWaveTimer = 5;
    updateHud();
  }

  function stageStars(stage, coreHp) {
    const ratio = Math.max(0, coreHp) / Math.max(1, stage.coreHp);
    if (ratio >= 0.7) return 3;
    if (ratio >= 0.35) return 2;
    return 1;
  }

  function resultSkillReport(won, stars = 0, coreHp = state.coreHp, stage = state.stage) {
    if (!won) return t("skillReportLose");
    const corePercent = Math.max(0, Math.min(100, Math.round((Math.max(0, coreHp) / Math.max(1, stage?.coreHp || 1)) * 100)));
    const key = stars >= 3 ? "skillReportWin3" : stars >= 2 ? "skillReportWin2" : "skillReportWin1";
    return t(key, { stars, core: corePercent });
  }

  function tileDistance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function winStage() {
    state.gameOver = true;
    state.won = true;
    const stage = state.stage;
    state.save.bestStage = Math.max(state.save.bestStage, Math.min(10, stage.id + 1));
    state.save.diamonds += stage.reward.diamonds;
    state.save.upgradePoints += stage.reward.points;
    state.save.clears[stage.id] = true;
    state.save.stars = { ...(state.save.stars || {}) };
    const stars = stageStars(stage, state.coreHp);
    state.save.stars[stage.id] = Math.max(Number(state.save.stars[stage.id] || 0), stars);
    state.resultReward = {
      stageId: stage.id,
      points: stage.reward.points,
      diamonds: stage.reward.diamonds,
      stars,
      rerolled: false,
    };
    save();
    nodes.resultTitle.textContent = t("victory");
    nodes.resultText.textContent = t("victoryText", { stage: stage.id });
    nodes.resultStars.textContent = t("starRating", { stars });
    nodes.skillReportText.textContent = resultSkillReport(true, stars, state.coreHp, stage);
    nodes.nextStageBtn.classList.toggle("is-hidden", stage.id >= 10);
    renderResultReward();
    setScreen("result");
    playSfx("victory");
    track("game_complete", { stage: stage.id, core_hp: Math.max(0, Math.ceil(state.coreHp)), waves: stage.waves, stars });
  }

  function loseStage() {
    if (state.gameOver) return;
    state.gameOver = true;
    state.won = false;
    nodes.resultTitle.textContent = t("defeat");
    nodes.resultText.textContent = t("defeatText");
    nodes.resultStars.textContent = "";
    nodes.resultRewardText.textContent = "";
    nodes.rerollRewardBtn.classList.add("is-hidden");
    nodes.skillReportText.textContent = resultSkillReport(false);
    nodes.nextStageBtn.classList.add("is-hidden");
    setScreen("result");
    playSfx("defeat");
    track("game_fail", { stage: state.currentStage, wave: state.wave, core_hp: Math.max(0, Math.ceil(state.coreHp)) });
  }

  function reviveCore() {
    if (state.coreHp > 0 || state.revived) return;
    if (state.save.diamonds < 5) return showToast(t("noDiamonds"));
    state.save.diamonds -= 5;
    state.coreHp = 35;
    state.gameOver = false;
    state.revived = true;
    state.coreCriticalShown = false;
    save();
    showToast(t("reviveUsed"));
    setScreen("game");
    playSfx("revive");
    track("game_spend_virtual_currency", { stage: state.currentStage, item: "core_revive", currency: "diamonds", amount: 5 });
  }

  function rerollRewardPoints(stageId, currentPoints) {
    return Math.min(3, currentPoints + 1 + (stageId % 2));
  }

  function renderResultReward() {
    const reward = state.resultReward;
    if (!reward) {
      nodes.resultRewardText.textContent = "";
      nodes.rerollRewardBtn.classList.add("is-hidden");
      return;
    }
    nodes.resultRewardText.textContent = t(reward.rerolled ? "rewardRerolled" : "rewardSummary", {
      points: reward.points,
      diamonds: reward.diamonds,
    });
    nodes.rerollRewardBtn.classList.remove("is-hidden");
    nodes.rerollRewardBtn.disabled = reward.rerolled || state.save.diamonds < 3;
    nodes.rerollRewardBtn.textContent = reward.rerolled ? t("rewardRerollUsed") : t("rerollReward");
  }

  function rerollReward() {
    const reward = state.resultReward;
    if (!reward || reward.rerolled) return;
    if (state.save.diamonds < 3) return showToast(t("noDiamonds"));
    const newPoints = rerollRewardPoints(reward.stageId, reward.points);
    const deltaPoints = Math.max(0, newPoints - reward.points);
    state.save.diamonds -= 3;
    state.save.upgradePoints += deltaPoints;
    reward.points = newPoints;
    reward.rerolled = true;
    save();
    renderResultReward();
    showToast(t("rewardRerollUsed"));
    playSfx("reward");
    track("game_spend_virtual_currency", { stage: reward.stageId, item: "reward_reroll", currency: "diamonds", amount: 3 });
    track("game_reward_reroll", { stage: reward.stageId, points: reward.points, delta_points: deltaPoints });
  }

  function draw() {
    resizeCanvas();
    const board = getBoard();
    ctx.clearRect(0, 0, nodes.canvas.width, nodes.canvas.height);
    const offset = impactOffset();
    ctx.save();
    ctx.translate(offset.x, offset.y);
    if (assets.bg?.complete) ctx.drawImage(assets.bg, 0, 0, nodes.canvas.width, nodes.canvas.height);
    ctx.fillStyle = "rgba(3, 8, 12, 0.46)";
    ctx.fillRect(0, 0, nodes.canvas.width, nodes.canvas.height);
    drawGrid(board);
    drawPathPreview(board);
    drawBossTelegraph(board);
    drawCoreDangerPulse(board);
    drawPlacementPreview(board);
    state.defenders.forEach((d) => drawDefender(d, board));
    state.enemies.forEach((e) => drawEnemy(e, board));
    drawShots();
    state.effects.forEach((effect) => drawEffect(effect, board));
    drawKeyboardCursor(board);
    ctx.restore();
    drawImpactFlash();
  }

  function drawImpactFlash() {
    const flash = state.impactFlash;
    if (!flash?.life || !flash.max) return;
    const alpha = Math.max(0, Math.min(0.22, (flash.life / flash.max) * 0.22));
    ctx.save();
    ctx.fillStyle = `rgba(${flash.color || "255, 209, 102"}, ${alpha})`;
    ctx.fillRect(0, 0, nodes.canvas.width, nodes.canvas.height);
    ctx.restore();
  }

  function resizeCanvas() {
    const width = Math.max(320, Math.round(nodes.canvas.clientWidth * window.devicePixelRatio));
    const height = Math.max(260, Math.round(nodes.canvas.clientHeight * window.devicePixelRatio));
    if (nodes.canvas.width !== width || nodes.canvas.height !== height) {
      nodes.canvas.width = width;
      nodes.canvas.height = height;
    }
  }

  function drawGrid(board) {
    for (let y = 0; y < grid.rows; y += 1) {
      for (let x = 0; x < grid.cols; x += 1) {
        const px = board.x + x * board.cell;
        const py = board.y + y * board.cell;
        const special = (x === startTile.x && y === startTile.y) || (x === coreTile.x && y === coreTile.y);
        ctx.fillStyle = special ? "rgba(255, 209, 102, 0.26)" : "rgba(116, 215, 255, 0.08)";
        ctx.fillRect(px + 2, py + 2, board.cell - 4, board.cell - 4);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
        ctx.strokeRect(px + 2, py + 2, board.cell - 4, board.cell - 4);
      }
    }
    drawRouteEndpointIcon(tileToPoint(startTile), "gate", board);
    drawRouteEndpointIcon(tileToPoint(coreTile), "core", board);
  }

  function drawRouteEndpointIcon(p, type, board) {
    const size = board.cell * (type === "core" ? 0.86 : 0.78);
    const pulse = 0.72 + Math.sin(performance.now() / (type === "core" ? 180 : 220)) * 0.14;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.shadowBlur = Math.max(10, board.cell * 0.18);
    ctx.shadowColor = type === "core" ? "rgba(255, 209, 102, 0.78)" : "rgba(125, 216, 125, 0.62)";
    if (type === "gate") {
      const arch = ctx.createLinearGradient(0, -size * 0.5, 0, size * 0.48);
      arch.addColorStop(0, "rgba(168, 118, 59, 0.98)");
      arch.addColorStop(0.55, "rgba(82, 64, 39, 0.96)");
      arch.addColorStop(1, "rgba(35, 74, 48, 0.96)");
      ctx.fillStyle = arch;
      ctx.strokeStyle = "rgba(217, 249, 157, 0.86)";
      ctx.lineWidth = Math.max(2, board.cell * 0.035);
      ctx.beginPath();
      ctx.moveTo(-size * 0.42, size * 0.42);
      ctx.lineTo(-size * 0.42, -size * 0.08);
      ctx.quadraticCurveTo(-size * 0.42, -size * 0.48, 0, -size * 0.48);
      ctx.quadraticCurveTo(size * 0.42, -size * 0.48, size * 0.42, -size * 0.08);
      ctx.lineTo(size * 0.42, size * 0.42);
      ctx.lineTo(size * 0.21, size * 0.42);
      ctx.lineTo(size * 0.21, -size * 0.04);
      ctx.quadraticCurveTo(size * 0.21, -size * 0.26, 0, -size * 0.26);
      ctx.quadraticCurveTo(-size * 0.21, -size * 0.26, -size * 0.21, -size * 0.04);
      ctx.lineTo(-size * 0.21, size * 0.42);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = `rgba(125, 216, 125, ${0.22 + pulse * 0.16})`;
      ctx.beginPath();
      ctx.ellipse(0, size * 0.46, size * 0.48, size * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#d9f99d";
      ctx.beginPath();
      ctx.moveTo(size * 0.06, -size * 0.06);
      ctx.lineTo(size * 0.23, 0);
      ctx.lineTo(size * 0.06, size * 0.06);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.strokeStyle = `rgba(255, 209, 102, ${0.58 + pulse * 0.22})`;
      ctx.lineWidth = Math.max(3, board.cell * 0.055);
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.52, 0, Math.PI * 2);
      ctx.stroke();
      const glow = ctx.createRadialGradient(-size * 0.14, -size * 0.18, size * 0.04, 0, 0, size * 0.48);
      glow.addColorStop(0, "rgba(255, 255, 255, 0.98)");
      glow.addColorStop(0.28, "rgba(147, 247, 255, 0.96)");
      glow.addColorStop(0.72, "rgba(45, 212, 191, 0.88)");
      glow.addColorStop(1, "rgba(20, 83, 45, 0.76)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.52);
      ctx.lineTo(size * 0.38, -size * 0.08);
      ctx.lineTo(size * 0.24, size * 0.45);
      ctx.lineTo(-size * 0.24, size * 0.45);
      ctx.lineTo(-size * 0.38, -size * 0.08);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(236, 253, 245, 0.88)";
      ctx.lineWidth = Math.max(1.5, board.cell * 0.026);
      ctx.stroke();
      ctx.fillStyle = `rgba(255, 209, 102, ${0.16 + pulse * 0.16})`;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.66, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawKeyboardCursor(board) {
    if (state.screen !== "game" || !state.keyboardMode || !isInside(state.keyboardTile)) return;
    const x = board.x + state.keyboardTile.x * board.cell + 4;
    const y = board.y + state.keyboardTile.y * board.cell + 4;
    const size = Math.max(10, board.cell - 8);
    ctx.save();
    ctx.lineWidth = Math.max(3, board.cell * 0.045);
    ctx.strokeStyle = "#ffd166";
    ctx.shadowColor = "rgba(255, 209, 102, 0.8)";
    ctx.shadowBlur = 12;
    ctx.strokeRect(x, y, size, size);
    ctx.restore();
  }

  function placementPreviewTile() {
    if (state.keyboardMode) return state.keyboardTile;
    return state.pointerTile;
  }

  function placementPreviewState() {
    if (state.screen !== "game" || state.gameOver || state.selectedDefender) return null;
    const tile = placementPreviewTile();
    if (!tile || !isInside(tile)) return null;
    const unit = unitTypes.find((item) => item.id === state.selectedBuild);
    if (!unit) return null;
    const canPlace = canBuild(tile);
    const affordable = state.coins >= unit.cost;
    return {
      tile,
      unit,
      canPlace,
      affordable,
      ok: canPlace && affordable,
    };
  }

  function drawPlacementPreview(board) {
    const preview = placementPreviewState();
    if (!preview) return;
    const p = tileToPoint(preview.tile);
    const radius = board.cell * preview.unit.range;
    const px = board.x + preview.tile.x * board.cell;
    const py = board.y + preview.tile.y * board.cell;
    const color = preview.ok ? "255, 209, 102" : "255, 112, 112";
    ctx.save();
    ctx.fillStyle = `rgba(${color}, 0.08)`;
    ctx.strokeStyle = `rgba(${color}, 0.72)`;
    ctx.lineWidth = Math.max(2, board.cell * 0.035);
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = `rgba(${color}, 0.16)`;
    ctx.fillRect(px + 3, py + 3, board.cell - 6, board.cell - 6);
    ctx.strokeStyle = `rgba(${color}, 0.96)`;
    ctx.lineWidth = Math.max(3, board.cell * 0.045);
    ctx.strokeRect(px + 4, py + 4, board.cell - 8, board.cell - 8);
    ctx.restore();
  }

  function drawPathPreview(board) {
    const preview = routePreviewSnapshot();
    const path = preview.path;
    if (!path) return;
    ctx.save();
    ctx.strokeStyle = "rgba(255, 209, 102, 0.7)";
    ctx.lineWidth = Math.max(4, board.cell * 0.08);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = "rgba(255, 209, 102, 0.42)";
    ctx.shadowBlur = Math.max(8, board.cell * 0.12);
    ctx.beginPath();
    path.forEach((tile, index) => {
      const p = tileToPoint(tile);
      if (index === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
    preview.arrows.forEach((arrow) => drawRouteArrow(arrow.from, arrow.to, board));
    ctx.restore();
  }

  function routePreviewSnapshot() {
    const path = findPath(false);
    const labelStart = t("routeGate");
    const labelEnd = t("routeCore");
    if (!path || path.length < 2) {
      return { path, arrows: [], arrowCount: 0, labelStart, labelEnd };
    }
    const step = Math.max(2, Math.floor(path.length / 4));
    const arrows = [];
    for (let index = 1; index < path.length; index += step) {
      arrows.push({ from: path[index - 1], to: path[index] });
    }
    if (arrows.length < 2 && path.length > 2) {
      arrows.push({ from: path[path.length - 2], to: path[path.length - 1] });
    }
    return { path, arrows, arrowCount: arrows.length, labelStart, labelEnd };
  }

  function drawRouteArrow(fromTile, toTile, board) {
    const from = tileToPoint(fromTile);
    const to = tileToPoint(toTile);
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const length = Math.max(8, board.cell * 0.16);
    const tip = {
      x: from.x + (to.x - from.x) * 0.62,
      y: from.y + (to.y - from.y) * 0.62,
    };
    ctx.save();
    ctx.fillStyle = "rgba(255, 243, 189, 0.96)";
    ctx.strokeStyle = "rgba(5, 9, 14, 0.68)";
    ctx.lineWidth = Math.max(1.5, board.cell * 0.025);
    ctx.beginPath();
    ctx.moveTo(tip.x + Math.cos(angle) * length, tip.y + Math.sin(angle) * length);
    ctx.lineTo(tip.x + Math.cos(angle + 2.5) * length, tip.y + Math.sin(angle + 2.5) * length);
    ctx.lineTo(tip.x + Math.cos(angle - 2.5) * length, tip.y + Math.sin(angle - 2.5) * length);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  }

  function bossTelegraphSnapshot() {
    const boss = state.enemies.find((enemy) => enemy.boss && enemy.hp > 0);
    const upcoming = Boolean(state.stage?.boss && state.wave === state.stage.waves && state.runningWave && !boss);
    const active = Boolean(upcoming || boss);
    return {
      active,
      upcoming,
      bossActive: Boolean(boss),
      bossName: localizedBossName(state.stage) || t("boss"),
      start: tileToPoint(startTile),
      core: tileToPoint(coreTile),
      bossPoint: boss?.pos || null,
    };
  }

  function drawBossTelegraph(board) {
    const telegraph = bossTelegraphSnapshot();
    if (!telegraph.active) return;
    const pulse = 0.55 + Math.sin(performance.now() / 150) * 0.18;
    ctx.save();
    ctx.lineWidth = Math.max(3, board.cell * 0.055);
    ctx.shadowBlur = Math.max(14, board.cell * 0.22);
    ctx.shadowColor = "rgba(255, 70, 70, 0.74)";
    ctx.strokeStyle = `rgba(255, 70, 70, ${pulse})`;
    ctx.fillStyle = "rgba(255, 70, 70, 0.10)";
    [telegraph.start, telegraph.core].forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, board.cell * 0.54, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    if (telegraph.bossPoint) {
      ctx.strokeStyle = "rgba(255, 209, 102, 0.92)";
      ctx.fillStyle = "rgba(255, 209, 102, 0.10)";
      ctx.beginPath();
      ctx.arc(telegraph.bossPoint.x, telegraph.bossPoint.y, board.cell * 0.82, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    if (telegraph.upcoming) {
      const label = t("bossIncoming", { boss: telegraph.bossName });
      const x = board.x + board.width / 2;
      const y = board.y + board.cell * 0.55;
      ctx.font = `900 ${Math.max(13, board.cell * 0.2)}px system-ui`;
      ctx.textAlign = "center";
      ctx.lineWidth = Math.max(4, board.cell * 0.05);
      ctx.strokeStyle = "rgba(5, 9, 14, 0.92)";
      ctx.fillStyle = "#ffd166";
      ctx.strokeText(label, x, y);
      ctx.fillText(label, x, y);
    }
    ctx.restore();
  }

  function drawCoreDangerPulse(board) {
    if (!isCoreCritical()) return;
    const core = tileToPoint(coreTile);
    const reducedMotion = prefersReducedMotion();
    const pulse = reducedMotion ? 0.76 : 0.62 + Math.sin(performance.now() / 120) * 0.2;
    const outer = board.cell * (reducedMotion ? 0.62 : 0.66 + Math.sin(performance.now() / 180) * 0.08);
    ctx.save();
    ctx.shadowColor = "rgba(255, 70, 70, 0.82)";
    ctx.shadowBlur = Math.max(12, board.cell * 0.24);
    ctx.lineWidth = Math.max(4, board.cell * 0.07);
    ctx.strokeStyle = `rgba(255, 70, 70, ${pulse})`;
    ctx.fillStyle = "rgba(255, 70, 70, 0.12)";
    ctx.beginPath();
    ctx.arc(core.x, core.y, outer, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([Math.max(5, board.cell * 0.12), Math.max(4, board.cell * 0.08)]);
    ctx.strokeStyle = "rgba(255, 209, 102, 0.88)";
    ctx.beginPath();
    ctx.arc(core.x, core.y, board.cell * 0.44, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawDefender(d, board) {
    const p = tileToPoint(d.tile);
    const size = board.cell * (d.kind === "hero" ? 0.9 : 0.78);
    ctx.save();
    if (state.selectedDefender === d) {
      ctx.strokeStyle = "#ffd166";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, board.cell * d.range, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (state.save.cosmetics?.goldenFrame) {
      ctx.strokeStyle = "rgba(255, 209, 102, 0.92)";
      ctx.lineWidth = Math.max(3, board.cell * 0.055);
      ctx.beginPath();
      ctx.arc(p.x, p.y, size * 0.58, 0, Math.PI * 2);
      ctx.stroke();
    }
    drawUnitImage(d, p, size);
    drawHitFlash(p, size, d.hitPulse || 0, d.kind === "hero");
    drawBar(p.x - size / 2, p.y - size / 2 - 9, size, 6, d.hp / d.maxHp, "#7dd87d");
    ctx.fillStyle = d.kind === "hero" ? "#ffd166" : "#e9f7ff";
    ctx.font = `${Math.max(11, board.cell * 0.18)}px system-ui`;
    ctx.textAlign = "center";
    ctx.fillText(`Lv.${d.level}`, p.x, p.y + size * 0.48);
    ctx.restore();
  }

  function drawEnemy(enemy, board) {
    const size = board.cell * (enemy.boss ? 1.25 : 0.74);
    ctx.save();
    drawEnemyImage(enemy, size);
    drawHitFlash(enemy.pos, size, enemy.hitPulse || 0, enemy.boss);
    drawBar(enemy.pos.x - size / 2, enemy.pos.y - size / 2 - 8, size, 6, enemy.hp / enemy.maxHp, enemy.boss ? "#ff7a7a" : "#ff9a9a");
    if (enemy.targetDefender) {
      ctx.strokeStyle = "rgba(255, 122, 122, 0.8)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(enemy.pos.x, enemy.pos.y);
      const p = tileToPoint(enemy.targetDefender.tile);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawEnemyImage(enemy, size) {
    const pose = unitPose(enemy, "enemy");
    const image = assets[enemy.img];
    if (image?.complete) drawImageWithPose(image, enemy.pos.x - size / 2, enemy.pos.y - size / 2, size, size, pose);
  }

  function enemyFrame(enemy) {
    if (enemy.actionPulse > 0) return actionBlendFrame(enemy.actionPulse, 0.28);
    if (enemy.targetDefender) return 2;
    return pingPongFrame(enemy.animTime || 0, enemy.boss ? 2.4 : 4.5);
  }

  function drawUnitImage(defender, p, size) {
    const pose = unitPose(defender, "defender");
    const image = assets[defender.img];
    if (image?.complete) drawImageWithPose(image, p.x - size / 2, p.y - size / 2, size, size, pose);
  }

  function defenderFrame(defender) {
    if (defender.actionPulse > 0) return actionBlendFrame(defender.actionPulse, 0.32);
    if (state.enemies.some((enemy) => enemy.targetDefender === defender)) return 2;
    return pingPongFrame(defender.animTime || 0, defender.kind === "hero" ? 2.8 : 3.6);
  }

  function pingPongFrame(time = 0, speed = 3) {
    const phase = (((time || 0) * speed) % 2 + 2) % 2;
    return phase <= 1 ? phase : 2 - phase;
  }

  function actionBlendFrame(actionPulse = 0, maxPulse = 0.32) {
    const progress = 1 - Math.max(0, Math.min(1, actionPulse / maxPulse));
    return progress <= 0.5 ? 2 + progress * 2 : 3 - (progress - 0.5) * 2;
  }

  function framePhaseDetail(frame) {
    const safe = Number.isFinite(frame) ? frame : 0;
    const base = Math.floor(safe);
    return {
      frame: Number(safe.toFixed(3)),
      base,
      next: Math.ceil(safe),
      blend: Number((safe - base).toFixed(3)),
    };
  }

  function unitPose(unit, role = "defender") {
    const time = unit?.animTime || 0;
    const actionPulse = unit?.actionPulse || 0;
    const hitPulse = unit?.hitPulse || 0;
    const attacking = actionPulse > 0;
    const blocked = role === "enemy" ? Boolean(unit?.targetDefender) : state.enemies.some((enemy) => enemy.targetDefender === unit);
    const pulseMax = role === "enemy" ? 0.28 : 0.32;
    const actionProgress = attacking ? 1 - Math.max(0, Math.min(1, actionPulse / pulseMax)) : 0;
    const actionEase = attacking ? Math.sin(actionProgress * Math.PI) : 0;
    const hitEase = Math.max(0, Math.min(1, hitPulse / (role === "enemy" ? 0.28 : 0.3)));
    const idleBob = Math.sin(time * (role === "enemy" ? 11.5 : 8.25)) * (role === "enemy" ? 0.035 : 0.024);
    const blockedJitter = blocked ? Math.sin(time * 24) * 0.018 : 0;
    const bossWeight = unit?.boss ? 0.68 : 1;
    const scaleX = 1 + actionEase * (role === "enemy" ? 0.11 : 0.09) + hitEase * 0.035 + (blocked ? 0.025 : 0);
    const scaleY = 1 - actionEase * (role === "enemy" ? 0.075 : 0.065) + hitEase * 0.025 - (blocked ? 0.02 : 0);
    const offsetY = (attacking ? -actionEase * 0.055 : idleBob + blockedJitter) * bossWeight - hitEase * 0.025;
    const offsetX = attacking ? (role === "enemy" ? -actionEase * 0.018 : actionEase * 0.018) : Math.sin(time * 5.5) * 0.01 * bossWeight + hitEase * (role === "enemy" ? 0.018 : -0.018);
    return {
      scaleX: Number(scaleX.toFixed(4)),
      scaleY: Number(scaleY.toFixed(4)),
      offsetX: Number(offsetX.toFixed(4)),
      offsetY: Number(offsetY.toFixed(4)),
      rotate: 0,
      blocked,
      attacking,
      hit: hitEase > 0,
    };
  }

  function drawHitFlash(point, size, hitPulse = 0, heavy = false) {
    if (!hitPulse) return;
    const alpha = Math.max(0, Math.min(1, hitPulse / (heavy ? 0.3 : 0.24)));
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = heavy ? `rgba(255, 232, 155, ${0.22 * alpha})` : `rgba(255, 255, 255, ${0.22 * alpha})`;
    ctx.strokeStyle = heavy ? `rgba(255, 209, 102, ${0.7 * alpha})` : `rgba(255, 245, 210, ${0.62 * alpha})`;
    ctx.lineWidth = Math.max(2, size * 0.045);
    ctx.beginPath();
    ctx.ellipse(point.x, point.y - size * 0.03, size * (heavy ? 0.48 : 0.42), size * 0.46, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawImageWithPose(image, x, y, width, height, pose = {}) {
    const scaleX = pose.scaleX || 1;
    const scaleY = pose.scaleY || 1;
    const offsetX = (pose.offsetX || 0) * width;
    const offsetY = (pose.offsetY || 0) * height;
    ctx.save();
    ctx.translate(x + width / 2 + offsetX, y + height / 2 + offsetY);
    if (pose.rotate) ctx.rotate(pose.rotate);
    ctx.scale(scaleX, scaleY);
    ctx.drawImage(image, -width / 2, -height / 2, width, height);
    ctx.restore();
  }

  function drawSpriteFrame(image, frame, frames, x, y, width, height, pose = {}) {
    const safeFrame = Math.max(0, Math.min(frames - 1, Number(frame) || 0));
    const baseFrame = Math.floor(safeFrame);
    const nextFrame = Math.min(frames - 1, Math.ceil(safeFrame));
    const blend = safeFrame - baseFrame;
    const sourceWidth = image.naturalWidth / frames;
    const scaleX = pose.scaleX || 1;
    const scaleY = pose.scaleY || 1;
    const offsetX = (pose.offsetX || 0) * width;
    const offsetY = (pose.offsetY || 0) * height;
    ctx.save();
    ctx.translate(x + width / 2 + offsetX, y + height / 2 + offsetY);
    if (pose.rotate) ctx.rotate(pose.rotate);
    ctx.scale(scaleX, scaleY);
    ctx.drawImage(image, sourceWidth * baseFrame, 0, sourceWidth, image.naturalHeight, -width / 2, -height / 2, width, height);
    if (blend > 0.02 && nextFrame !== baseFrame) {
      const previousAlpha = ctx.globalAlpha;
      ctx.globalAlpha = previousAlpha * blend;
      ctx.drawImage(image, sourceWidth * nextFrame, 0, sourceWidth, image.naturalHeight, -width / 2, -height / 2, width, height);
      ctx.globalAlpha = previousAlpha;
    }
    ctx.restore();
  }

  function drawShots() {
    state.shots.forEach((shot) => {
      const alpha = shot.life / shot.max;
      ctx.strokeStyle = shot.color.replace(")", `, ${alpha})`).replace("rgb", "rgba");
      ctx.lineWidth = shot.width || 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(shot.from.x, shot.from.y);
      ctx.lineTo(shot.to.x, shot.to.y);
      ctx.stroke();
    });
  }

  function drawEffect(effect, board) {
    if (effect.type === "floatingText") {
      const alpha = Math.max(0, effect.life / effect.max);
      const rise = (1 - alpha) * (effect.rise || 18);
      ctx.save();
      ctx.globalAlpha = Math.min(1, alpha * 1.2);
      ctx.font = `900 ${Math.max(12, board.cell * 0.22)}px system-ui`;
      ctx.textAlign = "center";
      ctx.lineWidth = Math.max(3, board.cell * 0.04);
      ctx.strokeStyle = "rgba(5, 9, 14, 0.92)";
      ctx.fillStyle = effect.color || "#fff3bd";
      ctx.strokeText(effect.text || "", effect.pos.x, effect.pos.y - rise);
      ctx.fillText(effect.text || "", effect.pos.x, effect.pos.y - rise);
      ctx.restore();
      return;
    }
    if (effect.type === "skillFx") {
      const image = assets.skillFx;
      if (!image?.complete) return;
      const alpha = Math.max(0, effect.life / effect.max);
      const size = board.cell * 1.12 * (effect.scale || 1) * (1 + (1 - alpha) * 0.18);
      ctx.save();
      ctx.globalAlpha = Math.min(1, alpha * 1.15);
      drawSpriteFrame(image, effect.frame || 0, 6, effect.pos.x - size / 2, effect.pos.y - size / 2, size, size);
      ctx.restore();
      return;
    }
    const image = assets[effect.type];
    if (!image?.complete) return;
    const alpha = Math.max(0, effect.life / effect.max);
    const size = board.cell * 0.92 * (1 + (1 - alpha) * 0.2);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(image, effect.pos.x - size / 2, effect.pos.y - size / 2, size, size);
    ctx.restore();
  }

  function drawBar(x, y, width, height, ratio, color) {
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width * Math.max(0, Math.min(1, ratio)), height);
  }

  function drawLabel(p, label, color) {
    ctx.fillStyle = color;
    ctx.font = "700 14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(label, p.x, p.y + 5);
  }

  function canvasPointer(event) {
    const rect = nodes.canvas.getBoundingClientRect();
    const scaleX = nodes.canvas.width / rect.width;
    const scaleY = nodes.canvas.height / rect.height;
    return { x: (event.clientX - rect.left) * scaleX, y: (event.clientY - rect.top) * scaleY };
  }

  function onCanvasClick(event) {
    if (state.screen !== "game" || state.gameOver) return;
    state.keyboardMode = false;
    const p = canvasPointer(event);
    const tile = pointToTile(p.x, p.y);
    state.pointerTile = isInside(tile) ? tile : null;
    const existing = defenderAt(tile);
    if (existing) {
      state.selectedDefender = existing;
      renderSelectedInfo();
      return;
    }
    buildUnit(tile);
  }

  function onCanvasPointerMove(event) {
    if (state.screen !== "game" || state.gameOver) return;
    const p = canvasPointer(event);
    const tile = pointToTile(p.x, p.y);
    state.pointerTile = isInside(tile) ? tile : null;
    state.keyboardMode = false;
  }

  function moveKeyboardTile(dx, dy) {
    state.keyboardMode = true;
    state.pointerTile = null;
    state.keyboardTile = {
      x: Math.max(0, Math.min(grid.cols - 1, state.keyboardTile.x + dx)),
      y: Math.max(0, Math.min(grid.rows - 1, state.keyboardTile.y + dy)),
    };
    updateCanvasAccessibility();
  }

  function activateKeyboardTile() {
    if (state.screen !== "game" || state.gameOver) return;
    state.keyboardMode = true;
    state.pointerTile = null;
    const existing = defenderAt(state.keyboardTile);
    if (existing) {
      state.selectedDefender = existing;
      renderSelectedInfo();
      updateCanvasAccessibility();
      return;
    }
    buildUnit(state.keyboardTile);
    updateCanvasAccessibility();
  }

  function selectBuildByIndex(index) {
    const unit = unitTypes[index];
    if (!unit) return;
    state.selectedBuild = unit.id;
    state.selectedDefender = null;
    state.keyboardMode = true;
    state.pointerTile = null;
    renderBuildCards();
    renderSelectedInfo();
  }

  function cycleBuildSelection(delta) {
    const current = Math.max(0, unitTypes.findIndex((unit) => unit.id === state.selectedBuild));
    const next = (current + delta + unitTypes.length) % unitTypes.length;
    selectBuildByIndex(next);
  }

  function onCanvasKeydown(event) {
    if (state.screen !== "game" || state.gameOver) return;
    const key = event.key;
    const handled = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", " ", "w", "W", "u", "U", "s", "S", "q", "Q", "e", "E", "Escape"].includes(key) || /^[1-9]$/.test(key);
    if (!handled) return;
    event.preventDefault();
    if (key === "ArrowUp") moveKeyboardTile(0, -1);
    else if (key === "ArrowDown") moveKeyboardTile(0, 1);
    else if (key === "ArrowLeft") moveKeyboardTile(-1, 0);
    else if (key === "ArrowRight") moveKeyboardTile(1, 0);
    else if (key === "Enter" || key === " ") activateKeyboardTile();
    else if (/^[1-9]$/.test(key)) selectBuildByIndex(Number(key) - 1);
    else if (key === "q" || key === "Q") cycleBuildSelection(-1);
    else if (key === "e" || key === "E") cycleBuildSelection(1);
    else if (key === "w" || key === "W") startWave();
    else if (key === "u" || key === "U") upgradeSelected();
    else if (key === "s" || key === "S") sellSelected();
    else if (key === "Escape") {
      state.selectedDefender = null;
      renderSelectedInfo();
    }
  }

  function loop(ts) {
    const dt = Math.min(0.05, (ts - (state.lastTs || ts)) / 1000);
    state.lastTs = ts;
    if (!state.manualSimulation) update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  async function preload() {
    const entries = Object.entries(assetSources);
    let loaded = 0;
    await Promise.all(
      entries.map(([key, src]) =>
        new Promise((resolve) => {
          const image = new Image();
          image.onload = () => {
            loaded += 1;
            const percent = Math.round((loaded / entries.length) * 100);
            nodes.loadingFill.style.width = `${percent}%`;
            nodes.loadingText.textContent = `${percent}%`;
            resolve();
          };
          image.onerror = () => resolve();
          image.src = src;
          assets[key] = image;
        })
      )
    );
    nodes.loadingPanel.classList.add("is-hidden");
  }

  function bindEvents() {
    nodes.localeSelect.addEventListener("change", () => {
      state.locale = nodes.localeSelect.value;
      localStorage.setItem(localeKey, state.locale);
      updateLocale();
    });
    nodes.startBtn.addEventListener("click", () => {
      setScreen("stages");
      renderStages();
    });
    nodes.techBtn.addEventListener("click", () => {
      renderTech();
      setScreen("tech");
    });
    nodes.techBackBtn.addEventListener("click", () => setScreen("menu"));
    nodes.stageBackBtn.addEventListener("click", () => setScreen("menu"));
    nodes.menuBtn.addEventListener("click", () => setScreen("stages"));
    nodes.waveBtn.addEventListener("click", startWave);
    nodes.upgradeBtn.addEventListener("click", upgradeSelected);
    nodes.sellBtn.addEventListener("click", sellSelected);
    nodes.reviveBtn.addEventListener("click", reviveCore);
    nodes.speedBtn.addEventListener("click", cycleSpeedControl);
    nodes.retryBtn.addEventListener("click", () => {
      track("game_restart", { stage: state.currentStage });
      startStage(state.currentStage);
    });
    nodes.resultMenuBtn.addEventListener("click", () => {
      track("game_result_menu", { stage: state.currentStage, won: state.won });
      setScreen("stages");
    });
    nodes.rerollRewardBtn.addEventListener("click", rerollReward);
    nodes.nextStageBtn.addEventListener("click", () => {
      const nextStage = Math.min(10, state.currentStage + 1);
      track("game_next_stage", { stage: state.currentStage, next_stage: nextStage });
      startStage(nextStage);
    });
    nodes.soundBtn?.addEventListener("click", () => setSoundEnabled(!state.soundEnabled, true));
    window.addEventListener("resize", updateBattleShell, { passive: true });
    nodes.canvas.addEventListener("pointerdown", onCanvasClick);
    nodes.canvas.addEventListener("pointermove", onCanvasPointerMove);
    nodes.canvas.addEventListener("pointerleave", () => {
      state.pointerTile = null;
    });
    nodes.canvas.addEventListener("keydown", onCanvasKeydown);
    nodes.canvas.addEventListener("focus", () => {
      state.keyboardMode = true;
      updateCanvasAccessibility();
    });
    let stageSnapTimer = 0;
    nodes.stageRail.addEventListener("scroll", () => {
      window.clearTimeout(stageSnapTimer);
      stageSnapTimer = window.setTimeout(snapStageRailToNearest, 120);
    });
  }

  function runWaveToCompletion(maxSeconds = 120) {
    let elapsed = 0;
    while (!state.gameOver && (state.runningWave || state.enemies.length > 0) && elapsed < maxSeconds) {
      update(0.05);
      elapsed += 0.05;
    }
    return elapsed;
  }

  function buildSimulationUnits(units) {
    return units.every((unit) => {
      state.selectedBuild = unit.id;
      return buildUnit(unit.tile);
    });
  }

  function upgradeSimulationDefenders(priorityTypes, maxUpgrades = 2) {
    let upgrades = 0;
    while (upgrades < maxUpgrades) {
      const candidate = state.defenders
        .filter((d) => priorityTypes.includes(d.type))
        .sort((a, b) => priorityTypes.indexOf(a.type) - priorityTypes.indexOf(b.type) || b.damage - a.damage)[0];
      if (!candidate) return upgrades;
      const cost = Math.round(candidate.cost * (0.55 + candidate.level * 0.42));
      if (state.coins < cost) return upgrades;
      state.selectedDefender = candidate;
      upgradeSelected();
      upgrades += 1;
    }
    return upgrades;
  }

  function simulateBalanceStage(stageId, tech, units, priorityTypes, maxSeconds = 360, reinforcements = [], maxUpgrades = 2) {
    state.save = {
      bestStage: 10,
      diamonds: 99,
      upgradePoints: 99,
      tech: { power: 0, bulwark: 0, economy: 0, ...tech },
      clears: {},
    };
    startStage(stageId);
    const built = buildSimulationUnits(units);
    const waveResults = [];
    let elapsed = 0;
    while (!state.gameOver && state.wave < state.stage.waves && elapsed < maxSeconds) {
      buildSimulationUnits(reinforcements.filter((unit) => unit.wave === state.wave + 1));
      upgradeSimulationDefenders(priorityTypes, maxUpgrades);
      startWave();
      elapsed += runWaveToCompletion(Math.min(120, maxSeconds - elapsed));
      waveResults.push({
        wave: state.wave,
        coreHp: Math.round(state.coreHp),
        defenders: state.defenders.length,
        coins: Math.floor(state.coins),
      });
    }
    const won = state.gameOver && state.won;
    const result = {
      stage: stageId,
      built,
      won,
      elapsed: Math.round(elapsed * 10) / 10,
      startCoreHp: state.stage.coreHp,
      coreHp: Math.max(0, Math.round(state.coreHp)),
      defenders: state.defenders.length,
      waveResults,
    };
    state.enemies = [];
    state.runningWave = false;
    return result;
  }

  function runCampaignBalanceSweep() {
    const sharedBossPlan = {
      units: [
        { id: "leo", tile: { x: 3, y: 3 } },
        { id: "orla", tile: { x: 4, y: 4 } },
        { id: "fia", tile: { x: 6, y: 3 } },
        { id: "archer", tile: { x: 5, y: 2 } },
      ],
      priority: ["leo", "fia", "orla", "archer", "taro", "rux", "panko", "deer", "guard"],
      reinforcements: [
        { wave: 2, id: "guard", tile: { x: 6, y: 2 } },
        { wave: 3, id: "archer", tile: { x: 7, y: 4 } },
        { wave: 3, id: "guard", tile: { x: 7, y: 2 } },
        { wave: 4, id: "taro", tile: { x: 8, y: 3 } },
      ],
    };
    const plans = [
      {
        stage: 1,
        tech: { power: 0, bulwark: 0, economy: 0 },
        units: [
          { id: "leo", tile: { x: 3, y: 3 } },
          { id: "guard", tile: { x: 3, y: 2 } },
          { id: "archer", tile: { x: 5, y: 4 } },
        ],
        priority: ["leo", "guard", "archer"],
        reinforcements: [
          { wave: 2, id: "guard", tile: { x: 6, y: 3 } },
          { wave: 3, id: "archer", tile: { x: 7, y: 4 } },
        ],
      },
      {
        stage: 2,
        tech: { power: 1, bulwark: 1, economy: 1 },
        units: [
          { id: "leo", tile: { x: 3, y: 3 } },
          { id: "guard", tile: { x: 4, y: 2 } },
          { id: "archer", tile: { x: 5, y: 4 } },
        ],
        priority: ["leo", "guard", "archer"],
        reinforcements: [
          { wave: 2, id: "archer", tile: { x: 7, y: 4 } },
          { wave: 3, id: "guard", tile: { x: 7, y: 2 } },
        ],
      },
      {
        stage: 3,
        tech: { power: 2, bulwark: 2, economy: 2 },
        units: [
          { id: "leo", tile: { x: 3, y: 3 } },
          { id: "orla", tile: { x: 4, y: 4 } },
          { id: "archer", tile: { x: 5, y: 2 } },
        ],
        priority: ["leo", "orla", "archer", "guard"],
        reinforcements: [
          { wave: 2, id: "guard", tile: { x: 6, y: 3 } },
          { wave: 3, id: "archer", tile: { x: 7, y: 4 } },
        ],
      },
      {
        stage: 4,
        tech: { power: 3, bulwark: 3, economy: 3 },
        units: [
          { id: "leo", tile: { x: 3, y: 3 } },
          { id: "fia", tile: { x: 4, y: 4 } },
          { id: "archer", tile: { x: 5, y: 2 } },
          { id: "guard", tile: { x: 6, y: 3 } },
        ],
        priority: ["leo", "fia", "archer", "guard", "taro"],
        reinforcements: [
          { wave: 2, id: "archer", tile: { x: 7, y: 4 } },
          { wave: 3, id: "guard", tile: { x: 7, y: 2 } },
        ],
      },
      { stage: 5, tech: { power: 5, bulwark: 5, economy: 5 }, ...sharedBossPlan },
      {
        stage: 6,
        tech: { power: 5, bulwark: 5, economy: 5 },
        units: [
          { id: "leo", tile: { x: 3, y: 3 } },
          { id: "fia", tile: { x: 6, y: 3 } },
          { id: "orla", tile: { x: 4, y: 4 } },
          { id: "guard", tile: { x: 4, y: 2 } },
          { id: "archer", tile: { x: 5, y: 2 } },
        ],
        priority: ["leo", "fia", "taro", "archer", "orla", "rux", "panko"],
        reinforcements: [
          { wave: 2, id: "guard", tile: { x: 7, y: 2 } },
          { wave: 3, id: "rux", tile: { x: 8, y: 2 } },
          { wave: 4, id: "panko", tile: { x: 9, y: 4 } },
        ],
      },
      {
        stage: 7,
        tech: { power: 5, bulwark: 5, economy: 5 },
        units: [
          { id: "leo", tile: { x: 3, y: 3 } },
          { id: "fia", tile: { x: 6, y: 3 } },
          { id: "orla", tile: { x: 5, y: 2 } },
          { id: "guard", tile: { x: 4, y: 2 } },
          { id: "archer", tile: { x: 4, y: 4 } },
        ],
        priority: ["leo", "fia", "taro", "orla", "rux", "archer", "panko"],
        reinforcements: [
          { wave: 2, id: "guard", tile: { x: 7, y: 2 } },
          { wave: 3, id: "rux", tile: { x: 8, y: 2 } },
          { wave: 4, id: "panko", tile: { x: 8, y: 3 } },
        ],
      },
      {
        stage: 8,
        tech: { power: 5, bulwark: 5, economy: 5 },
        units: [
          { id: "leo", tile: { x: 3, y: 3 } },
          { id: "fia", tile: { x: 6, y: 3 } },
          { id: "orla", tile: { x: 5, y: 2 } },
          { id: "guard", tile: { x: 4, y: 2 } },
          { id: "archer", tile: { x: 4, y: 4 } },
          { id: "archer", tile: { x: 7, y: 4 } },
        ],
        priority: ["leo", "fia", "orla", "taro", "deer", "rux", "panko"],
        reinforcements: [
          { wave: 2, id: "guard", tile: { x: 7, y: 2 } },
          { wave: 3, id: "deer", tile: { x: 8, y: 4 } },
          { wave: 3, id: "rux", tile: { x: 8, y: 2 } },
          { wave: 4, id: "panko", tile: { x: 8, y: 3 } },
        ],
      },
      {
        stage: 9,
        tech: { power: 5, bulwark: 5, economy: 5 },
        units: [
          { id: "leo", tile: { x: 3, y: 3 } },
          { id: "fia", tile: { x: 6, y: 3 } },
          { id: "orla", tile: { x: 5, y: 2 } },
          { id: "guard", tile: { x: 4, y: 2 } },
          { id: "archer", tile: { x: 4, y: 4 } },
          { id: "archer", tile: { x: 7, y: 4 } },
        ],
        priority: ["leo", "fia", "orla", "taro", "deer", "rux", "panko", "archer"],
        reinforcements: [
          { wave: 2, id: "guard", tile: { x: 7, y: 2 } },
          { wave: 2, id: "archer", tile: { x: 8, y: 3 } },
          { wave: 3, id: "deer", tile: { x: 8, y: 4 } },
          { wave: 3, id: "rux", tile: { x: 8, y: 2 } },
          { wave: 4, id: "panko", tile: { x: 8, y: 3 } },
        ],
        maxUpgrades: 0,
      },
      {
        stage: 10,
        tech: { power: 5, bulwark: 5, economy: 5 },
        units: [
          { id: "leo", tile: { x: 3, y: 3 } },
          { id: "fia", tile: { x: 6, y: 3 } },
          { id: "orla", tile: { x: 5, y: 2 } },
          { id: "guard", tile: { x: 4, y: 2 } },
          { id: "archer", tile: { x: 4, y: 4 } },
          { id: "archer", tile: { x: 7, y: 4 } },
        ],
        priority: ["leo", "fia", "orla", "taro", "deer", "rux", "panko", "archer"],
        reinforcements: [
          { wave: 2, id: "guard", tile: { x: 7, y: 2 } },
          { wave: 2, id: "archer", tile: { x: 8, y: 3 } },
          { wave: 3, id: "deer", tile: { x: 8, y: 4 } },
          { wave: 3, id: "rux", tile: { x: 8, y: 2 } },
          { wave: 4, id: "panko", tile: { x: 9, y: 4 } },
          { wave: 5, id: "guard", tile: { x: 9, y: 3 } },
        ],
        maxUpgrades: 0,
      },
    ];
    return plans.map((plan) =>
      simulateBalanceStage(
        plan.stage,
        plan.tech,
        plan.units,
        plan.priority,
        plan.stage >= 10 ? 540 : 420,
        plan.reinforcements,
        plan.maxUpgrades ?? 1
      )
    );
  }

  function runBalanceScenario() {
    state.manualSimulation = true;
    try {
      const early = simulateBalanceStage(
        1,
        { power: 0, bulwark: 0, economy: 0 },
        [
          { id: "leo", tile: { x: 3, y: 3 } },
          { id: "guard", tile: { x: 3, y: 2 } },
          { id: "archer", tile: { x: 5, y: 4 } },
        ],
        ["leo", "guard", "archer"],
        240,
        [
          { wave: 2, id: "guard", tile: { x: 6, y: 3 } },
          { wave: 3, id: "archer", tile: { x: 7, y: 4 } },
        ]
      );
      const miniBoss = simulateBalanceStage(
        5,
        { power: 5, bulwark: 5, economy: 5 },
        [
          { id: "leo", tile: { x: 3, y: 3 } },
          { id: "orla", tile: { x: 4, y: 4 } },
          { id: "fia", tile: { x: 6, y: 3 } },
          { id: "archer", tile: { x: 5, y: 2 } },
        ],
        ["leo", "fia", "orla", "archer"],
        360,
        [
          { wave: 2, id: "guard", tile: { x: 6, y: 2 } },
          { wave: 3, id: "archer", tile: { x: 7, y: 4 } },
          { wave: 3, id: "guard", tile: { x: 7, y: 2 } },
          { wave: 4, id: "taro", tile: { x: 8, y: 3 } },
        ]
      );
      const campaign = runCampaignBalanceSweep();
      return { early, miniBoss, campaign };
    } finally {
      state.manualSimulation = false;
    }
  }

  function runVisualQualityScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 10,
      diamonds: 99,
      upgradePoints: 99,
      tech: { power: 5, bulwark: 5, economy: 5 },
      clears: {},
    };
    startStage(10);
    state.coins = 1650;
    buildSimulationUnits([
      { id: "leo", tile: { x: 3, y: 3 } },
      { id: "taro", tile: { x: 4, y: 4 } },
      { id: "fia", tile: { x: 6, y: 3 } },
      { id: "orla", tile: { x: 5, y: 2 } },
      { id: "deer", tile: { x: 7, y: 4 } },
      { id: "rux", tile: { x: 8, y: 2 } },
      { id: "panko", tile: { x: 8, y: 4 } },
      { id: "guard", tile: { x: 4, y: 2 } },
      { id: "archer", tile: { x: 7, y: 3 } },
      { id: "sapper", tile: { x: 5, y: 5 } },
      { id: "medic", tile: { x: 6, y: 5 } },
    ]);
    upgradeSimulationDefenders(["leo", "fia", "orla", "taro", "deer"], 4);
    startWave();
    let elapsed = 0;
    while (!state.gameOver && elapsed < 9) {
      update(0.05);
      elapsed += 0.05;
    }
    if (state.enemies[0]) addSkillEffect(state.enemies[0].pos, skillFxFrames.heroStrike, 1.1, 0.5);
    state.defenders.slice(0, 3).forEach((defender, index) => addSkillEffect(tileToPoint(defender.tile), index, 0.9, 0.5));
    draw();
    const board = getBoard();
    const markers = [
      ...state.defenders.slice(0, 5).map((defender) => ({ type: defender.type, point: tileToPoint(defender.tile) })),
      ...state.enemies.slice(0, 3).map((enemy) => ({ type: enemy.type, point: enemy.pos })),
    ];
    const defenderTypes = state.defenders.map((defender) => defender.type);
    state.manualSimulation = false;
    return {
      stage: state.currentStage,
      defenders: state.defenders.length,
      defenderTypes,
      enemies: state.enemies.length,
      shots: state.shots.length,
      effects: state.effects.length,
      canvas: { width: nodes.canvas.width, height: nodes.canvas.height },
      board: { x: Math.round(board.x), y: Math.round(board.y), width: Math.round(board.width), height: Math.round(board.height) },
      markers,
    };
  }

  function runAnimationQualityScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 10,
      diamonds: 99,
      upgradePoints: 99,
      tech: { power: 5, bulwark: 5, economy: 5 },
      clears: {},
    };
    startStage(10);
    state.coins = 1400;
    buildSimulationUnits([
      { id: "leo", tile: { x: 3, y: 3 } },
      { id: "taro", tile: { x: 4, y: 4 } },
      { id: "fia", tile: { x: 6, y: 3 } },
      { id: "orla", tile: { x: 5, y: 2 } },
      { id: "deer", tile: { x: 7, y: 4 } },
      { id: "guard", tile: { x: 4, y: 2 } },
      { id: "archer", tile: { x: 7, y: 3 } },
    ]);
    startWave();
    let elapsed = 0;
    while (!state.gameOver && state.enemies.length < 2 && elapsed < 6) {
      update(0.05);
      elapsed += 0.05;
    }
    const defender = state.defenders[0];
    const enemy = state.enemies[0];
    const defenderIdlePoses = [];
    const enemyMovePoses = [];
    for (let i = 0; i < 36; i += 1) {
      update(0.05);
      if (defender) {
        defenderIdlePoses.push(unitPose(defender, "defender"));
      }
      if (enemy) {
        enemyMovePoses.push(unitPose(enemy, "enemy"));
      }
    }
    if (defender) {
      defender.actionPulse = 0.2;
      defender.actionFrame = 3;
    }
    if (enemy) {
      enemy.actionPulse = 0.2;
      enemy.actionFrame = 3;
    }
    const actionPoses = {
      defender: defender ? unitPose(defender, "defender") : null,
      enemy: enemy ? unitPose(enemy, "enemy") : null,
    };
    const blockedEnemy = { animTime: 0.3, actionPulse: 0, targetDefender: defender || null };
    const blockedEnemyPose = unitPose(blockedEnemy, "enemy");
    const poseSummary = (poses) => {
      if (!poses.length) return { offsetYRange: 0, offsetXRange: 0, scaleXRange: 0, scaleYRange: 0 };
      return {
        offsetYRange: Number((Math.max(...poses.map((pose) => pose.offsetY)) - Math.min(...poses.map((pose) => pose.offsetY))).toFixed(4)),
        offsetXRange: Number((Math.max(...poses.map((pose) => pose.offsetX)) - Math.min(...poses.map((pose) => pose.offsetX))).toFixed(4)),
        scaleXRange: Number((Math.max(...poses.map((pose) => pose.scaleX)) - Math.min(...poses.map((pose) => pose.scaleX))).toFixed(4)),
        scaleYRange: Number((Math.max(...poses.map((pose) => pose.scaleY)) - Math.min(...poses.map((pose) => pose.scaleY))).toFixed(4)),
      };
    };
    const result = {
      renderMode: characterRenderMode,
      defenderType: defender?.type || "",
      defenderImage: defender?.img || "",
      defenderSheet: defender?.sheet || "",
      enemyType: enemy?.type || "",
      enemyImage: enemy?.img || "",
      enemySheet: enemy?.sheet || "",
      characterSheetsLoaded: Object.keys(assets).filter((key) => /Sheet$/i.test(key) && assets[key]?.complete),
      sheetFrameBlendingActive: false,
      defenderPoseMotion: poseSummary(defenderIdlePoses),
      enemyPoseMotion: poseSummary(enemyMovePoses),
      actionPoses,
      blockedEnemyPose,
      defenders: state.defenders.length,
      enemies: state.enemies.length,
    };
    state.manualSimulation = false;
    return result;
  }

  function runBossHudScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 10,
      diamonds: 99,
      upgradePoints: 99,
      tech: { power: 5, bulwark: 5, economy: 5 },
      clears: {},
    };
    startStage(10);
    state.wave = state.stage.waves - 1;
    startWave();
    while (state.waveSpawned < state.waveToSpawn) spawnEnemy();
    const boss = state.enemies.find((enemy) => enemy.boss);
    if (boss) boss.hp = boss.maxHp * 0.57;
    updateHud();
    const result = {
      stage: state.currentStage,
      wave: state.wave,
      bossVisible: !nodes.bossPanel.classList.contains("is-hidden"),
      bossName: nodes.bossNameText.textContent,
      bossHp: nodes.bossHpText.textContent,
      bossMeterWidth: nodes.bossMeterFill.style.width,
      bossHint: nodes.bossHintText.textContent,
      bossCount: state.enemies.filter((enemy) => enemy.boss).length,
    };
    state.enemies = [];
    state.runningWave = false;
    updateHud();
    result.hiddenAfterClear = nodes.bossPanel.classList.contains("is-hidden");
    state.manualSimulation = false;
    return result;
  }

  function runBossTelegraphScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 10,
      diamonds: 99,
      upgradePoints: 99,
      tech: { power: 5, bulwark: 5, economy: 5 },
      clears: {},
      stars: {},
    };
    startStage(10);
    state.wave = state.stage.waves - 1;
    startWave();
    updateHud();
    draw();
    const board = getBoard();
    const upcoming = bossTelegraphSnapshot();
    const startSample = {
      x: Math.round(upcoming.start.x + board.cell * 0.54),
      y: Math.round(upcoming.start.y),
    };
    const upcomingPixelData = ctx.getImageData(startSample.x, startSample.y, 1, 1).data;
    while (state.waveSpawned < state.waveToSpawn) spawnEnemy();
    updateHud();
    draw();
    const active = bossTelegraphSnapshot();
    const bossSample = active.bossPoint
      ? {
          x: Math.round(active.bossPoint.x + board.cell * 0.82),
          y: Math.round(active.bossPoint.y),
        }
      : null;
    const activePixelData = bossSample ? ctx.getImageData(bossSample.x, bossSample.y, 1, 1).data : [0, 0, 0, 0];
    state.enemies = [];
    state.runningWave = false;
    updateHud();
    state.manualSimulation = false;
    return {
      upcomingActive: upcoming.active,
      upcoming: upcoming.upcoming,
      bossName: upcoming.bossName,
      startSample,
      upcomingPixel: { r: upcomingPixelData[0], g: upcomingPixelData[1], b: upcomingPixelData[2], a: upcomingPixelData[3] },
      bossActive: active.bossActive,
      activeBossName: active.bossName,
      bossSample,
      activePixel: { r: activePixelData[0], g: activePixelData[1], b: activePixelData[2], a: activePixelData[3] },
    };
  }

  function impactFeedbackSnapshot() {
    return {
      shakeLife: Number((state.impactShake.life || 0).toFixed(3)),
      shakeMax: Number((state.impactShake.max || 0).toFixed(3)),
      shakeStrength: Number((state.impactShake.strength || 0).toFixed(3)),
      flashLife: Number((state.impactFlash.life || 0).toFixed(3)),
      flashMax: Number((state.impactFlash.max || 0).toFixed(3)),
      flashColor: state.impactFlash.color || "",
      offset: impactOffset(),
      reducedMotion: prefersReducedMotion(),
    };
  }

  function resetImpactFeedback() {
    state.impactShake = { life: 0, max: 0, strength: 0 };
    state.impactFlash = { life: 0, max: 0, color: "255, 209, 102" };
  }

  function runImpactFeedbackScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 10,
      diamonds: 99,
      upgradePoints: 99,
      tech: { power: 5, bulwark: 5, economy: 5 },
      clears: {},
      stars: {},
    };
    resetImpactFeedback();
    startStage(10);
    state.wave = state.stage.waves - 1;
    startWave();
    while (state.waveSpawned < state.waveToSpawn) spawnEnemy();
    const bossSpawn = impactFeedbackSnapshot();
    state.paused = true;
    update(0.5);
    const paused = impactFeedbackSnapshot();
    state.paused = false;
    update(0.12);
    const decayed = impactFeedbackSnapshot();

    resetImpactFeedback();
    startStage(10);
    state.coins = 999;
    buildSimulationUnits([{ id: "leo", tile: { x: 5, y: 4 } }]);
    const defender = state.defenders[0];
    const blockerBoss = {
      type: "boss",
      tile: { x: 5, y: 3 },
      pos: tileToPoint({ x: 5, y: 3 }),
      hp: 400,
      maxHp: 400,
      damage: 42,
      boss: true,
      attackCd: 0,
      targetDefender: defender,
    };
    attackDefender(blockerBoss);
    const blockerHit = impactFeedbackSnapshot();

    resetImpactFeedback();
    startStage(10);
    state.coreHp = 100;
    const coreBoss = {
      type: "boss",
      tile: { x: 10, y: 4 },
      pos: tileToPoint({ x: 10, y: 4 }),
      path: [{ x: 10, y: 4 }, coreTile],
      pathIndex: 1,
      hp: 400,
      maxHp: 400,
      damage: 42,
      speed: 999,
      slow: 0,
      boss: true,
      attackCd: 0,
    };
    state.enemies = [coreBoss];
    updateEnemies(0.1);
    const coreHit = impactFeedbackSnapshot();
    draw();
    const flashPixel = ctx.getImageData(Math.round(nodes.canvas.width / 2), Math.round(nodes.canvas.height / 2), 1, 1).data;
    state.manualSimulation = false;
    return {
      bossSpawn,
      paused,
      decayed,
      blockerHit,
      coreHit,
      coreHp: state.coreHp,
      flashPixel: { r: flashPixel[0], g: flashPixel[1], b: flashPixel[2], a: flashPixel[3] },
    };
  }

  function runCoreCriticalScenario() {
    startStage(10);
    state.coreHp = state.stage.coreHp * 0.36;
    state.coreCriticalShown = false;
    resetImpactFeedback();
    checkCoreCriticalFeedback();
    const beforeCritical = {
      shown: state.coreCriticalShown,
      toast: nodes.toast.textContent || "",
      ratio: Number(coreHpRatio().toFixed(3)),
      impact: impactFeedbackSnapshot(),
    };

    state.coreHp = state.stage.coreHp * 0.34;
    checkCoreCriticalFeedback();
    draw();
    const board = getBoard();
    const core = tileToPoint(coreTile);
    const sample = {
      x: Math.round(core.x - board.cell * 0.66),
      y: Math.round(core.y),
    };
    const pixel = ctx.getImageData(sample.x, sample.y, 1, 1).data;
    const afterCritical = {
      shown: state.coreCriticalShown,
      toast: nodes.toast.textContent || "",
      ratio: Number(coreHpRatio().toFixed(3)),
      impact: impactFeedbackSnapshot(),
      sample,
      pixel: { r: pixel[0], g: pixel[1], b: pixel[2], a: pixel[3] },
    };

    state.coreCriticalShown = false;
    state.coreHp = 35;
    state.gameOver = false;
    state.revived = true;
    const afterReviveReset = {
      shown: state.coreCriticalShown,
      ratio: Number(coreHpRatio().toFixed(3)),
    };

    return { beforeCritical, afterCritical, afterReviveReset };
  }

  function runSoldierRoleScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 10,
      diamonds: 99,
      upgradePoints: 99,
      tech: { power: 0, bulwark: 0, economy: 0 },
      clears: {},
    };
    startStage(1);
    state.coins = 999;
    buildSimulationUnits([
      { id: "guard", tile: { x: 4, y: 3 } },
      { id: "medic", tile: { x: 4, y: 4 } },
    ]);
    const guard = state.defenders.find((defender) => defender.type === "guard");
    const medic = state.defenders.find((defender) => defender.type === "medic");
    if (guard) guard.hp = guard.maxHp - 42;
    if (medic) medic.cd = 0;
    const hpBeforeHeal = guard?.hp || 0;
    updateDefenders(0.05);
    const hpAfterHeal = guard?.hp || 0;
    const healText = state.effects.filter((effect) => effect.type === "floatingText").map((effect) => effect.text);

    state.defenders = [];
    state.enemies = [];
    state.effects = [];
    buildSimulationUnits([{ id: "sapper", tile: { x: 5, y: 3 } }]);
    const sapper = state.defenders.find((defender) => defender.type === "sapper");
    if (sapper) sapper.cd = 0;
    const enemyA = {
      type: "wolf",
      tile: { x: 6, y: 3 },
      pos: tileToPoint({ x: 6, y: 3 }),
      hp: 100,
      maxHp: 100,
      boss: false,
      slow: 0,
    };
    const enemyB = {
      type: "wolf",
      tile: { x: 6, y: 3 },
      pos: { ...enemyA.pos },
      hp: 100,
      maxHp: 100,
      boss: false,
      slow: 0,
    };
    state.enemies = [enemyA, enemyB];
    updateDefenders(0.05);
    const damageText = state.effects.filter((effect) => effect.type === "floatingText").map((effect) => effect.text);
    const result = {
      medicHeal: Math.round(hpAfterHeal - hpBeforeHeal),
      medicPose: medic ? unitPose(medic, "defender") : null,
      sapperPrimaryDamage: Math.round(100 - enemyA.hp),
      sapperSplashDamage: Math.round(100 - enemyB.hp),
      sapperSplashSlow: enemyB.slow,
      sapperPose: sapper ? unitPose(sapper, "defender") : null,
      healText,
      damageText,
      effects: state.effects.length,
    };
    state.manualSimulation = false;
    return result;
  }

  function runAutoWaveScenario() {
    state.manualSimulation = false;
    state.save = {
      bestStage: 10,
      diamonds: 0,
      upgradePoints: 0,
      tech: { power: 0, bulwark: 0, economy: 0 },
      clears: {},
    };
    startStage(1);
    state.wave = 1;
    state.waveSpawned = 1;
    state.waveToSpawn = 1;
    state.enemies = [];
    showWaveClearFeedback();
    const queued = { timer: state.nextWaveTimer, disabled: nodes.waveBtn.disabled, text: nodes.waveBtn.textContent };
    update(4.8);
    const beforeStart = { wave: state.wave, runningWave: state.runningWave, timer: state.nextWaveTimer };
    update(0.3);
    const started = { wave: state.wave, runningWave: state.runningWave, timer: state.nextWaveTimer };
    state.manualSimulation = false;
    return { queued, beforeStart, started };
  }

  function runDiamondSinkScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 1,
      diamonds: 20,
      upgradePoints: 0,
      tech: { power: 0, bulwark: 0, economy: 0 },
      cosmetics: { goldenFrame: false },
      clears: {},
    };
    startStage(1);
    winStage();
    const rewardBefore = { ...state.resultReward };
    const diamondsAfterWin = state.save.diamonds;
    const pointsAfterWin = state.save.upgradePoints;
    rerollReward();
    const rewardAfter = { ...state.resultReward };
    const diamondsAfterReroll = state.save.diamonds;
    const pointsAfterReroll = state.save.upgradePoints;
    buyGoldenFrame();
    const diamondsAfterFrame = state.save.diamonds;
    startStage(1);
    state.coins = 999;
    buildSimulationUnits([{ id: "guard", tile: { x: 4, y: 3 } }]);
    const result = {
      rewardBefore,
      rewardAfter,
      diamondsAfterWin,
      pointsAfterWin,
      diamondsAfterReroll,
      pointsAfterReroll,
      diamondsAfterFrame,
      starsText: nodes.resultStars.textContent,
      starsSaved: state.save.stars?.[1] || 0,
      goldenFrame: Boolean(state.save.cosmetics?.goldenFrame),
      defenderCount: state.defenders.length,
      rerollButtonText: nodes.rerollRewardBtn.textContent,
      resultRewardText: nodes.resultRewardText.textContent,
    };
    state.manualSimulation = false;
    return result;
  }

  function runStageSelectorScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 7,
      diamonds: 12,
      upgradePoints: 4,
      tech: { power: 0, bulwark: 0, economy: 0 },
      cosmetics: { goldenFrame: false },
      clears: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true },
    };
    setScreen("stages");
    renderStages();
    centerStageCard(7);
    const current = nodes.stageRail.querySelector('[aria-current="true"]');
    const previous = nodes.stageRail.querySelector('[data-stage-id="3"]');
    const future = nodes.stageRail.querySelector('[data-stage-id="8"]');
    nodes.stageRail.scrollLeft = nodes.stageRail.scrollWidth;
    snapStageRailToNearest("auto");
    const result = {
      cards: nodes.stageRail.querySelectorAll(".stage-card").length,
      horizontal: nodes.stageRail.scrollWidth > nodes.stageRail.clientWidth,
      snapType: getComputedStyle(nodes.stageRail).scrollSnapType,
      currentStage: Number(current?.dataset.stageId || 0),
      previousReplayable: previous?.getAttribute("aria-disabled") === "false",
      futureLocked: future?.getAttribute("aria-disabled") === "true",
      scrollLeft: nodes.stageRail.scrollLeft,
    };
    state.manualSimulation = false;
    return result;
  }

  function showStageScreenScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 7,
      diamonds: 12,
      upgradePoints: 4,
      tech: { power: 0, bulwark: 0, economy: 0 },
      cosmetics: { goldenFrame: false },
      clears: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true },
    };
    setScreen("stages");
    renderStages();
    centerStageCard(7);
    return {
      screen: state.screen,
      cards: nodes.stageRail.querySelectorAll(".stage-card").length,
      current: nodes.stageRail.querySelector('[aria-current="true"]')?.dataset.stageId || "",
      intelRows: nodes.stageRail.querySelectorAll(".stage-intel").length,
      rewardRows: nodes.stageRail.querySelectorAll(".stage-reward").length,
      currentText: nodes.stageRail.querySelector('[aria-current="true"]')?.textContent || "",
    };
  }

  function showTechScreenScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 10,
      diamonds: 20,
      upgradePoints: 8,
      tech: { power: 1, bulwark: 1, economy: 1 },
      cosmetics: { goldenFrame: false },
      clears: {},
    };
    updateProfile();
    renderTech();
    setScreen("tech");
    return {
      screen: state.screen,
      cards: nodes.techGrid.querySelectorAll(".tech-card").length,
      buttons: nodes.techGrid.querySelectorAll("button").length,
    };
  }

  function showResultScreenScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 10,
      diamonds: 20,
      upgradePoints: 8,
      tech: { power: 2, bulwark: 2, economy: 2 },
      cosmetics: { goldenFrame: true },
      clears: {},
    };
    startStage(10);
    winStage();
    return {
      screen: state.screen,
      title: nodes.resultTitle.textContent,
      starsText: nodes.resultStars.textContent,
      starsSaved: state.save.stars?.[10] || 0,
      hasReward: nodes.resultRewardText.textContent.length > 0,
      nextHidden: nodes.nextStageBtn.classList.contains("is-hidden"),
    };
  }

  function runResultSkillReportScenario() {
    state.manualSimulation = true;
    const previousLocale = state.locale;
    const previousSave = state.save;
    state.locale = "en";
    nodes.localeSelect.value = "en";
    state.save = {
      bestStage: 10,
      diamonds: 20,
      upgradePoints: 8,
      tech: { power: 2, bulwark: 2, economy: 2 },
      cosmetics: { goldenFrame: false },
      clears: {},
      stars: {},
    };
    updateLocale();
    startStage(1);
    state.coreHp = state.stage.coreHp;
    winStage();
    const perfect = nodes.skillReportText.textContent;
    startStage(2);
    state.coreHp = state.stage.coreHp * 0.4;
    winStage();
    const pressured = nodes.skillReportText.textContent;
    startStage(3);
    state.coreHp = 0;
    loseStage();
    const defeat = nodes.skillReportText.textContent;
    state.locale = "zh-Hant";
    nodes.localeSelect.value = "zh-Hant";
    updateLocale();
    startStage(4);
    state.coreHp = state.stage.coreHp * 0.2;
    winStage();
    const zhClose = nodes.skillReportText.textContent;
    state.locale = previousLocale;
    nodes.localeSelect.value = previousLocale;
    state.save = previousSave;
    updateLocale();
    state.manualSimulation = false;
    return {
      perfect,
      pressured,
      defeat,
      zhClose,
      uniqueReports: new Set([perfect, pressured, defeat, zhClose]).size,
    };
  }

  function runNextStageResultScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 3,
      diamonds: 20,
      upgradePoints: 8,
      tech: { power: 2, bulwark: 2, economy: 2 },
      cosmetics: { goldenFrame: false },
      clears: { 1: true, 2: true },
      stars: {},
    };
    startStage(3);
    state.coreHp = state.stage.coreHp;
    winStage();
    const beforeClick = {
      screen: state.screen,
      currentStage: state.currentStage,
      bestStage: state.save.bestStage,
      nextHidden: nodes.nextStageBtn.classList.contains("is-hidden"),
      nextText: nodes.nextStageBtn.textContent,
      starsText: nodes.resultStars.textContent,
      clearSaved: state.save.clears[3] === true,
      nextUnlocked: state.save.bestStage >= 4,
    };
    nodes.nextStageBtn.click();
    const afterClick = {
      screen: state.screen,
      currentStage: state.currentStage,
      bestStage: state.save.bestStage,
      wave: state.wave,
      runningWave: state.runningWave,
      coreHp: Math.ceil(state.coreHp),
      stageHud: nodes.stageHudText.textContent,
    };
    state.manualSimulation = false;
    return { beforeClick, afterClick };
  }

  function runWaveIntelScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 10,
      diamonds: 20,
      upgradePoints: 8,
      tech: { power: 2, bulwark: 2, economy: 2 },
      cosmetics: { goldenFrame: true },
      clears: {},
      stars: {},
    };
    startStage(10);
    const label = nodes.waveIntelLabel.textContent;
    const readyText = nodes.waveIntelText.textContent;
    startWave();
    const activeText = nodes.waveIntelText.textContent;
    state.runningWave = false;
    state.wave = state.stage.waves - 1;
    startWave();
    const bossText = nodes.waveIntelText.textContent;
    state.manualSimulation = false;
    return {
      label,
      readyText,
      activeText,
      bossText,
      wave: state.wave,
      waveToSpawn: state.waveToSpawn,
    };
  }

  function runKeyboardControlScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 10,
      diamonds: 20,
      upgradePoints: 8,
      tech: { power: 1, bulwark: 1, economy: 1 },
      cosmetics: { goldenFrame: false },
      clears: {},
      stars: {},
    };
    startStage(1);
    nodes.canvas.focus();
    const press = (key) => onCanvasKeydown({ key, preventDefault() {} });
    press("ArrowRight");
    press("ArrowDown");
    press("2");
    const selectedAfterNumber = state.selectedBuild;
    press("Enter");
    const builtCount = state.defenders.length;
    const builtType = state.defenders[0]?.type || "";
    press("Enter");
    const selectedType = state.selectedDefender?.type || "";
    const levelBeforeUpgrade = state.selectedDefender?.level || 0;
    press("u");
    const levelAfterUpgrade = state.selectedDefender?.level || 0;
    press("s");
    const soldCount = state.defenders.length;
    press("e");
    const selectedAfterCycle = state.selectedBuild;
    press("w");
    const waveStarted = state.runningWave === true && state.wave === 1;
    const ariaLabel = nodes.canvas.getAttribute("aria-label") || "";
    const result = {
      keyboardMode: state.keyboardMode,
      tile: { ...state.keyboardTile },
      selectedAfterNumber,
      selectedAfterCycle,
      builtCount,
      builtType,
      selectedType,
      levelBeforeUpgrade,
      levelAfterUpgrade,
      waveStarted,
      soldCount,
      ariaLabel,
    };
    state.manualSimulation = false;
    return result;
  }

  function runPlacementPreviewScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 10,
      diamonds: 20,
      upgradePoints: 8,
      tech: { power: 1, bulwark: 1, economy: 1 },
      cosmetics: { goldenFrame: false },
      clears: {},
      stars: {},
    };
    startStage(1);
    state.selectedBuild = "archer";
    state.selectedDefender = null;
    state.keyboardMode = false;
    state.pointerTile = null;
    state.coins = 999;
    draw();
    const board = getBoard();
    const tile = { x: 4, y: 4 };
    const unit = unitTypes.find((item) => item.id === state.selectedBuild);
    const center = tileToPoint(tile);
    const sampleX = Math.round(Math.min(nodes.canvas.width - 1, center.x + board.cell * unit.range));
    const sampleY = Math.round(Math.max(0, Math.min(nodes.canvas.height - 1, center.y)));
    const before = Array.from(ctx.getImageData(sampleX, sampleY, 1, 1).data);
    state.pointerTile = tile;
    draw();
    const after = Array.from(ctx.getImageData(sampleX, sampleY, 1, 1).data);
    const validPreview = placementPreviewState();
    state.pointerTile = startTile;
    const blockedPreview = placementPreviewState();
    state.pointerTile = tile;
    state.coins = 0;
    const unaffordablePreview = placementPreviewState();
    state.manualSimulation = false;
    return {
      selectedBuild: state.selectedBuild,
      validTile: { ...validPreview.tile },
      validCanPlace: validPreview.canPlace,
      validAffordable: validPreview.affordable,
      validOk: validPreview.ok,
      blockedCanPlace: blockedPreview.canPlace,
      blockedOk: blockedPreview.ok,
      unaffordableCanPlace: unaffordablePreview.canPlace,
      unaffordableAffordable: unaffordablePreview.affordable,
      unaffordableOk: unaffordablePreview.ok,
      rangeRadius: board.cell * validPreview.unit.range,
      pixelChanged: before.some((value, index) => value !== after[index]),
    };
  }

  function runBuildAffordabilityScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 10,
      diamonds: 20,
      upgradePoints: 8,
      tech: { power: 1, bulwark: 1, economy: 1 },
      cosmetics: { goldenFrame: false },
      clears: {},
      stars: {},
    };
    startStage(1);
    state.coins = 60;
    updateHud();
    const guardLow = nodes.buildCards.querySelector('[data-id="guard"]');
    const leoLow = nodes.buildCards.querySelector('[data-id="leo"]');
    const lowState = {
      guardAffordable: guardLow?.dataset.affordable,
      guardText: guardLow?.querySelector(".build-affordability")?.textContent || "",
      leoAffordable: leoLow?.dataset.affordable,
      leoText: leoLow?.querySelector(".build-affordability")?.textContent || "",
      leoClass: leoLow?.classList.contains("is-unaffordable") || false,
      leoAria: leoLow?.getAttribute("aria-label") || "",
    };
    state.coins = 999;
    updateHud();
    const leoHigh = nodes.buildCards.querySelector('[data-id="leo"]');
    const highState = {
      leoAffordable: leoHigh?.dataset.affordable,
      leoText: leoHigh?.querySelector(".build-affordability")?.textContent || "",
      leoClass: leoHigh?.classList.contains("is-unaffordable") || false,
      leoAria: leoHigh?.getAttribute("aria-label") || "",
    };
    state.manualSimulation = false;
    return { lowState, highState };
  }

  function runSelectedActionStateScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 10,
      diamonds: 20,
      upgradePoints: 8,
      tech: { power: 1, bulwark: 1, economy: 1 },
      cosmetics: { goldenFrame: false },
      clears: {},
      stars: {},
    };
    startStage(1);
    state.coins = 999;
    state.selectedBuild = "guard";
    buildUnit({ x: 2, y: 2 });
    state.selectedDefender = state.defenders[0];
    const cost = upgradeCost(state.selectedDefender);
    const refund = sellRefund(state.selectedDefender);
    state.coins = Math.max(0, cost - 1);
    updateHud();
    const lowState = {
      selectedInfo: nodes.selectedInfo.textContent,
      upgradeDisabled: nodes.upgradeBtn.disabled,
      sellDisabled: nodes.sellBtn.disabled,
      upgradeText: nodes.upgradeBtn.textContent,
      sellText: nodes.sellBtn.textContent,
      cost,
      refund,
    };
    state.coins = cost;
    updateHud();
    const readyState = {
      selectedInfo: nodes.selectedInfo.textContent,
      upgradeDisabled: nodes.upgradeBtn.disabled,
      sellDisabled: nodes.sellBtn.disabled,
      upgradeText: nodes.upgradeBtn.textContent,
      sellText: nodes.sellBtn.textContent,
    };
    state.manualSimulation = false;
    return { lowState, readyState };
  }

  function runActionFeedbackScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 10,
      diamonds: 20,
      upgradePoints: 8,
      tech: { power: 1, bulwark: 1, economy: 1 },
      cosmetics: { goldenFrame: false },
      clears: {},
      stars: {},
    };
    startStage(1);
    state.coins = 999;
    state.selectedBuild = "guard";
    buildUnit({ x: 2, y: 2 });
    const buildTexts = state.effects.filter((effect) => effect.type === "floatingText").map((effect) => effect.text);
    const buildFx = state.effects.filter((effect) => effect.type === "skillFx").map((effect) => effect.frame);
    state.effects = [];
    state.selectedDefender = state.defenders[0];
    upgradeSelected();
    const upgradeTexts = state.effects.filter((effect) => effect.type === "floatingText").map((effect) => effect.text);
    const upgradeFx = state.effects.filter((effect) => effect.type === "skillFx").map((effect) => effect.frame);
    state.effects = [];
    sellSelected();
    const sellTexts = state.effects.filter((effect) => effect.type === "floatingText").map((effect) => effect.text);
    const sellFx = state.effects.filter((effect) => effect.type === "skillFx").map((effect) => effect.frame);
    const result = {
      buildTexts,
      buildFx,
      upgradeTexts,
      upgradeFx,
      sellTexts,
      sellFx,
      defendersAfterSell: state.defenders.length,
    };
    state.manualSimulation = false;
    return result;
  }

  function runHitResponseScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 10,
      diamonds: 20,
      upgradePoints: 8,
      tech: { power: 1, bulwark: 1, economy: 1 },
      cosmetics: { goldenFrame: false },
      clears: {},
      stars: {},
    };
    startStage(1);
    state.coins = 999;
    state.selectedBuild = "leo";
    buildUnit({ x: 3, y: 3 });
    const defender = state.defenders[0];
    const enemy = {
      id: "hit-response-enemy",
      type: "wolf",
      img: "wolf",
      sheet: "",
      tile: { x: 4, y: 3 },
      pos: tileToPoint({ x: 4, y: 3 }),
      hp: 180,
      maxHp: 180,
      speed: 0,
      damage: 11,
      attackCd: 0,
      path: [],
      pathIndex: 0,
      targetDefender: null,
      animTime: 0.2,
      actionPulse: 0,
      actionFrame: 0,
      hitPulse: 0,
      boss: false,
      flying: false,
      slow: 0,
    };
    state.enemies = [enemy];
    state.effects = [];
    defender.cd = 0;
    updateDefenders(0.05);
    const enemyAfterHit = state.enemies[0];
    const enemyHitPose = enemyAfterHit ? unitPose(enemyAfterHit, "enemy") : null;
    const enemyDamageTexts = state.effects.filter((effect) => effect.type === "floatingText" && effect.text.startsWith("-")).map((effect) => effect.text);
    state.effects = [];
    enemy.targetDefender = defender;
    enemy.attackCd = 0;
    attackDefender(enemy);
    const defenderHitPose = unitPose(defender, "defender");
    const defenderDamageTexts = state.effects.filter((effect) => effect.type === "floatingText" && effect.text.startsWith("-")).map((effect) => effect.text);
    const result = {
      enemyHitPulse: enemyAfterHit?.hitPulse || 0,
      enemyHitPose,
      enemyDamageTexts,
      defenderHitPulse: defender.hitPulse || 0,
      defenderHitPose,
      defenderDamageTexts,
    };
    state.manualSimulation = false;
    return result;
  }

  function runWaveClearFeedbackScenario() {
    const previousAnalytics = window.WonderAnalytics;
    const events = [];
    window.WonderAnalytics = {
      track(event, payload) {
        events.push({ event, payload });
      },
    };
    state.manualSimulation = true;
    state.save = {
      bestStage: 10,
      diamonds: 20,
      upgradePoints: 8,
      tech: { power: 1, bulwark: 1, economy: 1 },
      cosmetics: { goldenFrame: false },
      clears: {},
      stars: {},
    };
    startStage(1);
    state.effects = [];
    state.wave = 1;
    state.runningWave = true;
    state.waveSpawned = 1;
    state.waveToSpawn = 1;
    state.enemies = [];
    update(0.05);
    const result = {
      runningWave: state.runningWave,
      wave: state.wave,
      toast: nodes.toast.textContent,
      texts: state.effects.filter((effect) => effect.type === "floatingText").map((effect) => effect.text),
      fx: state.effects.filter((effect) => effect.type === "skillFx").map((effect) => effect.frame),
      events,
    };
    window.WonderAnalytics = previousAnalytics;
    state.manualSimulation = false;
    return result;
  }

  function runSelectedBuildInfoScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 10,
      diamonds: 20,
      upgradePoints: 8,
      tech: { power: 1, bulwark: 1, economy: 1 },
      cosmetics: { goldenFrame: false },
      clears: {},
      stars: {},
    };
    startStage(1);
    state.selectedBuild = "sapper";
    state.selectedDefender = null;
    renderBuildCards();
    renderSelectedInfo();
    const buildInfo = nodes.selectedInfo.textContent;
    state.coins = 999;
    buildUnit({ x: 2, y: 2 });
    state.selectedDefender = state.defenders[0];
    renderSelectedInfo();
    const defenderInfo = nodes.selectedInfo.textContent;
    state.manualSimulation = false;
    return { buildInfo, defenderInfo };
  }

  function runRouteStatusScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 10,
      diamonds: 20,
      upgradePoints: 8,
      tech: { power: 1, bulwark: 1, economy: 1 },
      cosmetics: { goldenFrame: false },
      clears: {},
      stars: {},
    };
    startStage(1);
    const openText = nodes.waveIntelText.textContent;
    state.coins = 999;
    Array.from({ length: grid.rows }, (_, y) => ({ x: 1, y })).forEach((tile) => {
      state.selectedBuild = "guard";
      buildUnit(tile);
    });
    updateHud();
    const blockedText = nodes.waveIntelText.textContent;
    const pathBlocked = findPath(false) === null;
    state.manualSimulation = false;
    return { openText, blockedText, pathBlocked };
  }

  function makeScenarioEnemy(tile, overrides = {}) {
    return {
      id: `scenario-enemy-${Date.now()}-${Math.random()}`,
      type: "wolf",
      img: "wolf",
      sheet: "",
      tile: { ...tile },
      pos: tileToPoint(tile),
      hp: 160,
      maxHp: 160,
      speed: 62,
      damage: 13,
      attackCd: 0,
      path: [],
      pathIndex: 0,
      targetDefender: null,
      animTime: 0,
      actionPulse: 0,
      actionFrame: 0,
      hitPulse: 0,
      boss: false,
      flying: false,
      slow: 0,
      ...overrides,
    };
  }

  function addScenarioWall(x) {
    const unit = unitTypes.find((item) => item.id === "guard");
    Array.from({ length: grid.rows }, (_, y) => {
      if (sameTile({ x, y }, startTile) || sameTile({ x, y }, coreTile)) return;
      state.defenders.push({
        id: `scenario-wall-${x}-${y}`,
        type: "guard",
        img: unit.img,
        sheet: "",
        kind: "soldier",
        name: unitName(unit),
        tile: { x, y },
        hp: 120,
        maxHp: 120,
        damage: 0,
        range: unit.range,
        cooldown: unit.cooldown,
        cd: 0,
        level: 1,
        cost: unit.cost,
        slow: 0,
        splash: 0,
        heal: 0,
        buff: 0,
        animTime: 0,
        actionPulse: 0,
        actionFrame: 0,
      });
    });
  }

  function runBlockedRouteFallbackScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 10,
      diamonds: 20,
      upgradePoints: 8,
      tech: { power: 1, bulwark: 1, economy: 1 },
      cosmetics: { goldenFrame: false },
      clears: {},
      stars: {},
    };
    startStage(1);
    state.coins = 999;
    state.runningWave = true;
    state.wave = 1;
    state.waveSpawned = 1;
    state.waveToSpawn = 1;
    addScenarioWall(7);
    const farEnemy = makeScenarioEnemy({ x: 3, y: 4 });
    state.enemies = [farEnemy];
    setEnemyPath(farEnemy);
    const farBefore = { x: farEnemy.pos.x, y: farEnemy.pos.y };
    const farPathBlocked = findPathFrom(farEnemy.tile, false) === null;
    const farFallbackPath = farEnemy.path.map((tile) => ({ ...tile }));
    const farTargetBefore = farEnemy.targetDefender?.tile || null;
    updateEnemies(0.45);
    const farAfter = { x: farEnemy.pos.x, y: farEnemy.pos.y };

    state.defenders = [];
    addScenarioWall(7);
    const nearEnemy = makeScenarioEnemy({ x: 6, y: 4 });
    state.enemies = [nearEnemy];
    setEnemyPath(nearEnemy);
    const target = nearEnemy.targetDefender;
    const targetHpBefore = target?.hp || 0;
    updateEnemies(1.1);
    const targetHpAfter = target?.hp || 0;
    const result = {
      farPathBlocked,
      farTargetBefore,
      farFallbackPathLength: farFallbackPath.length,
      farMovedTowardCore: farAfter.x > farBefore.x + 1 || Math.abs(farAfter.y - farBefore.y) > 1,
      farBefore,
      farAfter,
      nearTargetTile: target?.tile || null,
      nearTargetHpBefore: targetHpBefore,
      nearTargetHpAfter: targetHpAfter,
      nearAttacked: targetHpAfter < targetHpBefore,
    };
    state.manualSimulation = false;
    return result;
  }

  function runRoutePreviewScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 10,
      diamonds: 20,
      upgradePoints: 8,
      tech: { power: 1, bulwark: 1, economy: 1 },
      cosmetics: { goldenFrame: false },
      clears: {},
      stars: {},
    };
    startStage(1);
    const preview = routePreviewSnapshot();
    draw();
    const board = getBoard();
    const firstArrow = preview.arrows[0];
    let arrowPixel = null;
    if (firstArrow) {
      const from = tileToPoint(firstArrow.from);
      const to = tileToPoint(firstArrow.to);
      const sample = {
        x: Math.round(from.x + (to.x - from.x) * 0.62),
        y: Math.round(from.y + (to.y - from.y) * 0.62),
      };
      const pixel = ctx.getImageData(sample.x, sample.y, 1, 1).data;
      arrowPixel = { r: pixel[0], g: pixel[1], b: pixel[2], a: pixel[3], sample };
    }
    state.manualSimulation = false;
    return {
      pathLength: preview.path?.length || 0,
      arrowCount: preview.arrowCount,
      labelStart: preview.labelStart,
      labelEnd: preview.labelEnd,
      startTile,
      coreTile,
      boardCell: board.cell,
      arrowPixel,
    };
  }

  function runTraditionalChineseReadabilityScenario() {
    state.manualSimulation = true;
    const previousLocale = state.locale;
    const previousSave = state.save;
    state.locale = "zh-Hant";
    nodes.localeSelect.value = "zh-Hant";
    state.save = {
      bestStage: 10,
      diamonds: 20,
      upgradePoints: 8,
      tech: { power: 2, bulwark: 2, economy: 2 },
      cosmetics: { goldenFrame: false },
      clears: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true },
      stars: {},
    };
    updateLocale();
    setScreen("stages");
    renderStages();
    const stageNames = stages.map((stage) => stage.name["zh-Hant"]);
    const stageText = nodes.stageRail.textContent || "";
    startStage(10);
    state.selectedBuild = "sapper";
    renderSelectedInfo();
    const selectedInfo = nodes.selectedInfo.textContent || "";
    const buildCardText = nodes.buildCards.textContent || "";
    const unitNames = unitTypes.map((unit) => unit.name["zh-Hant"]);
    const unitNotes = unitTypes.map((unit) => unit.note["zh-Hant"]);
    const waveReady = nodes.waveIntelText.textContent || "";
    state.wave = state.stage.waves - 1;
    startWave();
    const bossWave = nodes.waveIntelText.textContent || "";
    const sampledText = [
      nodes.gameTitle.textContent,
      nodes.menuTitle.textContent,
      nodes.releaseBadge.textContent,
      stageText,
      selectedInfo,
      buildCardText,
      waveReady,
      bossWave,
      localizedBossName(state.stage),
      ...unitNames,
      ...unitNotes,
      ...stageNames,
    ].join(" ");
    const hasMojibake = new RegExp("[\\uFFFD\\u0080\\uE70E\\uEA57\\uF389]").test(sampledText);
    const result = {
      title: nodes.gameTitle.textContent,
      localeName: text["zh-Hant"].localeName,
      menuTitle: nodes.menuTitle.textContent,
      releaseBadge: nodes.releaseBadge.textContent,
      stageNames,
      unitNames,
      unitNotes,
      selectedInfo,
      buildCardText,
      waveReady,
      bossWave,
      bossName: localizedBossName(state.stage),
      hasMojibake,
    };
    state.enemies = [];
    state.runningWave = false;
    state.locale = previousLocale;
    nodes.localeSelect.value = previousLocale;
    state.save = previousSave;
    updateLocale();
    setScreen("menu");
    state.manualSimulation = false;
    return result;
  }

  async function runSmokeScenario() {
    startStage(1);
    state.coins = 999;
    Array.from({ length: grid.rows }, (_, y) => ({ x: 1, y })).forEach((tile) => {
      state.selectedBuild = tile.y % 2 ? "guard" : "leo";
      buildUnit(tile);
    });
    const blockedPath = findPath(false) === null;
    const allNormalGroundBuildable = Array.from({ length: grid.rows }, (_, y) =>
      Array.from({ length: grid.cols }, (_, x) => ({ x, y }))
    )
      .flat()
      .filter((tile) => !sameTile(tile, startTile) && !sameTile(tile, coreTile))
      .every((tile) => isInside(tile));
    state.wave = 1;
    state.waveSpawned = 1;
    state.waveToSpawn = 2;
    spawnEnemy();
    const attackingBlocker = state.enemies.some((enemy) => enemy.targetDefender);
    Object.values(skillFxFrames).forEach((frame, index) => addSkillEffect(tileToPoint({ x: Math.min(grid.cols - 2, index + 2), y: 1 }), frame));
    const skillEffectFrames = state.effects.filter((effect) => effect.type === "skillFx").map((effect) => effect.frame);
    const bossWaveProfiles = [waveProfile(5, stages[4].waves), waveProfile(10, stages[9].waves)];
    state.enemies = [];
    state.runningWave = false;
    return {
      stages: stages.length,
      bossStages: stages.filter((stage) => stage.boss).map((stage) => stage.id),
      defenders: unitTypes.length,
      ordinarySoldiers: unitTypes.filter((unit) => unit.kind === "soldier").map((unit) => unit.id),
      characterRenderMode,
      staticDefenderAssets: unitTypes.filter((unit) => assets[unit.img]?.complete).map((unit) => unit.id),
      staticEnemyAssets: ["wolf", "boar", "bat", "boss"].filter((key) => assets[key]?.complete),
      staticEnemySources: Object.fromEntries(["wolf", "boar", "bat", "boss"].map((key) => [key, assetSources[key]])),
      characterSheetsLoaded: Object.keys(assets).filter((key) => /Sheet$/i.test(key) && assets[key]?.complete),
      skillFxLoaded: Boolean(assets.skillFx?.complete),
      skillEffectFrames,
      bossWaveProfiles,
      stageIntelComplete: stages.every((stage) => stage.intel?.threat?.en && stage.intel?.threat?.["zh-Hant"] && stage.intel?.plan?.en && stage.intel?.plan?.["zh-Hant"]),
      bossIntelStages: stages.filter((stage) => stage.boss && stage.intel?.threat?.en && stage.intel?.plan?.en).map((stage) => stage.id),
      allNormalGroundBuildable,
      blockedPath,
      attackingBlocker,
      publicHold: true,
      locale: state.locale,
    };
  }

  function runSoundReadinessScenario() {
    const previousEnabled = state.soundEnabled;
    const previousStored = localStorage.getItem(soundKey);
    setSoundEnabled(true);
    const enabledText = nodes.soundBtn?.textContent || "";
    const enabledPressed = nodes.soundBtn?.getAttribute("aria-pressed");
    const storedOn = localStorage.getItem(soundKey);
    const played = playSfx("toggle");
    setSoundEnabled(false);
    const disabledText = nodes.soundBtn?.textContent || "";
    const disabledPressed = nodes.soundBtn?.getAttribute("aria-pressed");
    const storedOff = localStorage.getItem(soundKey);
    state.soundEnabled = previousEnabled;
    if (previousStored === null) localStorage.removeItem(soundKey);
    else localStorage.setItem(soundKey, previousStored);
    updateSoundButton();
    return {
      enabledText,
      enabledPressed,
      storedOn,
      disabledText,
      disabledPressed,
      storedOff,
      audioAvailable: Boolean(window.AudioContext || window.webkitAudioContext),
      playAttempted: played,
    };
  }

  function runPauseSpeedScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 1,
      diamonds: 12,
      upgradePoints: 0,
      tech: { power: 0, bulwark: 0, economy: 0 },
      cosmetics: { goldenFrame: false },
      clears: {},
    };
    startStage(1);
    startWave();
    update(0.24);
    const enemy = state.enemies[0];
    cycleSpeedControl();
    const speed2Text = nodes.speedBtn.textContent;
    cycleSpeedControl();
    const speed3Text = nodes.speedBtn.textContent;
    cycleSpeedControl();
    const pausedText = nodes.speedBtn.textContent;
    const pausedPressed = nodes.speedBtn.getAttribute("aria-pressed");
    const before = {
      waveSpawned: state.waveSpawned,
      spawnTimer: Number(state.spawnTimer.toFixed(4)),
      enemyX: Number((enemy?.pos.x || 0).toFixed(4)),
      effects: state.effects.length,
    };
    update(1.2);
    const after = {
      waveSpawned: state.waveSpawned,
      spawnTimer: Number(state.spawnTimer.toFixed(4)),
      enemyX: Number((enemy?.pos.x || 0).toFixed(4)),
      effects: state.effects.length,
    };
    cycleSpeedControl();
    const resumedText = nodes.speedBtn.textContent;
    const resumedPressed = nodes.speedBtn.getAttribute("aria-pressed");
    const result = {
      speed2Text,
      speed3Text,
      pausedText,
      pausedPressed,
      before,
      after,
      resumedText,
      resumedPressed,
      paused: state.paused,
      speed: state.speed,
    };
    state.manualSimulation = false;
    return result;
  }

  function runAnalyticsScenario() {
    const previousAnalytics = window.WonderAnalytics;
    const previousSave = state.save;
    const previousSound = state.soundEnabled;
    const events = [];
    window.WonderAnalytics = {
      track(event, payload) {
        events.push({ event, payload });
      },
    };
    state.soundEnabled = false;
    state.save = {
      bestStage: 10,
      diamonds: 30,
      upgradePoints: 20,
      tech: { power: 0, bulwark: 0, economy: 0 },
      cosmetics: { goldenFrame: false },
      clears: {},
    };
    startStage(1);
    state.selectedBuild = "guard";
    buildUnit({ x: 2, y: 2 });
    state.selectedDefender = state.defenders[0];
    upgradeSelected();
    startWave();
    showWaveClearFeedback();
    state.coreHp = 0;
    loseStage();
    reviveCore();
    winStage();
    rerollReward();
    buyGoldenFrame();
    window.WonderAnalytics = previousAnalytics;
    state.save = previousSave;
    state.soundEnabled = previousSound;
    updateProfile();
    updateHud();
    renderTech();
    return {
      events: events.map((entry) => entry.event),
      payloads: events,
    };
  }

  async function init() {
    state.locale = localStorage.getItem(localeKey) || "en";
    if (!text[state.locale]) state.locale = "en";
    const zhOption = nodes.localeSelect.querySelector('option[value="zh-Hant"]');
    if (zhOption) zhOption.textContent = text["zh-Hant"].localeName;
    nodes.localeSelect.value = state.locale;
    state.save = loadSave();
    state.soundEnabled = localStorage.getItem(soundKey) === "on";
    updateProfile();
    bindEvents();
    updateLocale();
    setScreen("menu");
    await preload();
    requestAnimationFrame(loop);
    window.__BEAST_GUARDIAN_DEFENSE__ = {
      state,
      stages,
      unitTypes,
      findPath,
      waveProfile,
      runSmokeScenario,
      runBalanceScenario,
      runVisualQualityScenario,
      runAnimationQualityScenario,
      runBossHudScenario,
      runBossTelegraphScenario,
      runImpactFeedbackScenario,
      runCoreCriticalScenario,
      runSoldierRoleScenario,
      runAutoWaveScenario,
      runDiamondSinkScenario,
      runStageSelectorScenario,
      showStageScreenScenario,
      showTechScreenScenario,
      showResultScreenScenario,
      runResultSkillReportScenario,
      runNextStageResultScenario,
      runWaveIntelScenario,
      runKeyboardControlScenario,
      runPlacementPreviewScenario,
      runBuildAffordabilityScenario,
      runSelectedActionStateScenario,
      runActionFeedbackScenario,
      runHitResponseScenario,
      runWaveClearFeedbackScenario,
      runSelectedBuildInfoScenario,
      runRouteStatusScenario,
      runBlockedRouteFallbackScenario,
      runRoutePreviewScenario,
      runTraditionalChineseReadabilityScenario,
      runSoundReadinessScenario,
      runPauseSpeedScenario,
      runAnalyticsScenario,
    };
  }

  init().catch((error) => {
    console.error(error);
    nodes.loadingText.textContent = t("loadFailed");
  });
})();
