(() => {
  const GAME_ID = "beast-tactician";
  const isPublicRelease = !location.pathname.endsWith("/internal-test.html");
  const saveKey = "weightplay_beast_guardian_defense_v1";
  const soundKey = "weightplay_beast_guardian_sound_v1";
  const localeKey = "weightPlayLocale";
  const sessionStorageFallback = new Map();
  function readStorage(key) {
    try {
      const value = localStorage.getItem(key);
      if (value !== null) sessionStorageFallback.set(key, value);
      return value ?? sessionStorageFallback.get(key) ?? null;
    } catch {
      return sessionStorageFallback.get(key) ?? null;
    }
  }
  function writeStorage(key, value) {
    const serialized = String(value);
    sessionStorageFallback.set(key, serialized);
    try {
      localStorage.setItem(key, serialized);
      return true;
    } catch {
      return false;
    }
  }
  function activeI18nLocale() {
    try {
      return window.WonderI18n?.actualLocale?.() || window.WonderI18n?.locale?.() || "";
    } catch {
      return "";
    }
  }
  const grid = { cols: 12, rows: 8 };
  const startTile = { x: 0, y: 3 };
  const coreTile = { x: 11, y: 4 };
  const routeLayouts = [
    [[0, 3], [11, 4]], [[0, 1], [11, 6]], [[0, 6], [11, 1]], [[2, 0], [9, 7]], [[9, 0], [2, 7]],
    [[0, 4], [11, 2]], [[4, 0], [7, 7]], [[11, 1], [0, 6]], [[0, 7], [11, 0]], [[7, 0], [4, 7]],
    [[0, 2], [11, 5]], [[3, 7], [8, 0]], [[11, 5], [0, 2]], [[0, 5], [11, 3]], [[8, 7], [3, 0]],
    [[1, 0], [10, 7]], [[11, 3], [0, 4]], [[0, 0], [11, 7]], [[5, 7], [6, 0]], [[10, 0], [1, 7]],
    [[0, 1], [11, 5]], [[6, 0], [5, 7]], [[11, 6], [0, 3]], [[2, 7], [9, 0]], [[0, 6], [11, 2]],
    [[4, 7], [7, 0]], [[11, 0], [0, 7]], [[0, 3], [11, 6]], [[7, 7], [4, 0]], [[11, 4], [0, 1]],
  ].map(([start, core]) => ({ start: { x: start[0], y: start[1] }, core: { x: core[0], y: core[1] } }));

  const $ = (id) => document.getElementById(id);
  const gamePanelNode = $("gamePanel");
  if (gamePanelNode && !$("pauseDecisionPanel")) {
    gamePanelNode.insertAdjacentHTML("beforeend", `
      <section id="pauseDecisionPanel" class="modal-panel pause-decision-panel is-hidden" role="dialog" aria-modal="true" aria-labelledby="pauseDecisionTitle" aria-describedby="pauseDecisionText">
        <div class="modal-card pause-decision-card">
          <h2 id="pauseDecisionTitle"></h2>
          <p id="pauseDecisionText"></p>
          <div class="pause-decision-actions">
            <button id="pauseContinueBtn" class="primary-btn" type="button"></button>
            <button id="pauseLeaveBtn" class="secondary-btn" type="button"></button>
          </div>
        </div>
      </section>`);
  }
  const nodes = {
    mainBack: document.querySelector(".guardian-topbar .back-btn"),
    audioMenuBtn: $("audioMenuBtn"),
    audioPopover: $("audioPopover"),
    settingsTitle: $("settingsTitle"),
    soundSettingLabel: $("soundSettingLabel"),
    soundStateText: $("soundStateText"),
    localeSelect: $("localeSelect"),
    loadingPanel: $("loadingPanel"),
    loadingFill: $("loadingFill"),
    loadingText: $("loadingText"),
    menuPanel: $("menuPanel"),
    stagePanel: $("stagePanel"),
    techPanel: $("techPanel"),
    gamePanel: $("gamePanel"),
    resultPanel: $("resultPanel"),
    pauseDecisionPanel: $("pauseDecisionPanel"),
    pauseDecisionTitle: $("pauseDecisionTitle"),
    pauseDecisionText: $("pauseDecisionText"),
    pauseContinueBtn: $("pauseContinueBtn"),
    pauseLeaveBtn: $("pauseLeaveBtn"),
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
    mainProgress: $("mainProgress"),
    upgradePointText: $("upgradePointText"),
    diamondText: $("diamondText"),
    startBtn: $("startBtn"),
    techTitle: $("techTitle"),
    techHint: $("techHint"),
    techGrid: $("techGrid"),
    stageBackBtn: $("stageBackBtn"),
    stagePage: $("stagePage"),
    stageTabs: $("stageTabs"),
    stageTabBtn: $("stageTabBtn"),
    equipmentTabBtn: $("equipmentTabBtn"),
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
    resultProgressText: $("resultProgressText"),
    resultUnlockText: $("resultUnlockText"),
    resultPlanText: $("resultPlanText"),
    nextStageBtn: $("nextStageBtn"),
    rerollRewardBtn: $("rerollRewardBtn"),
    retryBtn: $("retryBtn"),
    resultMenuBtn: $("resultMenuBtn"),
  };
  // Stage and Battle own the complete General safe physical width. The shared
  // controllers keep one common child scale and expand the logical envelope;
  // Result and Pause inherit Battle because they remain its modal substates.
  nodes.stagePanel.dataset.wpCanvasMaxWidth = "920";
  nodes.gamePanel.dataset.wpCanvasMaxWidth = "920";
  // Runtime owns the Battle keyboard contract so older generated locale
  // shells receive the same shortcut metadata before their next regeneration.
  nodes.canvas.tabIndex = 0;
  nodes.canvas.setAttribute(
    "aria-keyshortcuts",
    "ArrowUp ArrowDown ArrowLeft ArrowRight Enter Space 1 2 3 4 5 6 7 8 9 Q E W U S Escape",
  );
  const ctx = nodes.canvas.getContext("2d");

  const text = {
    en: {
      title: "Beast Guardian",
      language: "Language",
      audioSettings: "Settings",
      soundEffects: "Sound Effects",
      backToLobby: "Back to WeightPlay General games",
      languageControl: "Language",
      backToMain: "Back to main",
      stageSelector: "Stage selector",
      stagePages: "Stage pages",
      stagesTab: "Stages",
      equipmentTab: "Equipment",
      backToStages: "Back to stages",
      pauseDecisionTitle: "Pause Stage {stage}?",
      pauseDecisionText: "Continue this exact Stage {stage} battle, or return to Stages and lose the current wave, defenders, coins, and core health.",
      continueBattle: "Continue Battle",
      returnToStages: "Return to Stages",
      localeName: "Traditional Chinese",
      releaseBadge: "Internal Release Candidate",
      publicReleaseBadge: "Playable Now",
      menuTitle: "Hero Tower Defense",
      menuHint:
        "Build anywhere on the forest grid, shape enemy routes, and command WeightPlay heroes with balanced animal soldiers through 30 defense stages.",
      holdNotice:
        "Public lobby remains Coming Soon until the user approves release. This route is for internal release validation.",
      publicNotice: "Build defenders, protect the crystal core, and unlock all 30 stages across six forest regions. Progress saves on this device.",
      bestStage: "Best Stage",
      upgradePoints: "Upgrade Points",
      diamonds: "Diamonds",
      start: "Start Game",
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
      traitBounce: "Chains {count} targets",
      traitBoss: "Boss damage +{percent}%",
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
      reviveConfirm: "Confirm Revive · {balance} → {result} Diamonds",
      reviveConfirmLabel: "Confirm Core Revive. Restore the core to 35 HP. Spend 5 Diamonds. Balance {balance} to {result}.",
      rerollReward: "Reroll Reward (3 Diamonds)",
      rerollRewardConfirm: "Confirm +{points} Points",
      rerollRewardPreview: "Reroll adds +{points} upgrade points · Diamonds {balance} → {result}. Tap again to confirm.",
      rerollRewardNeed: "Saved total: {points} upgrade points · {diamonds} diamonds · Need 3 / Have {diamonds}.",
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
      bossPhase: "{boss} changes tactics!",
      blockedBuild: "That tile cannot be built.",
      occupied: "A defender already holds this tile.",
      built: "{name} deployed.",
      upgraded: "{name} upgraded to Lv.{level}.",
      sold: "Defender sold.",
      reviveUsed: "Core revived.",
      rewardSummary: "Reward: +{points} upgrade points, +{diamonds} diamonds",
      rewardRerolled: "Reward rerolled: +{points} upgrade points, +{diamonds} diamonds",
      savedProgress: "Saved total: {points} upgrade points · {diamonds} diamonds",
      newRouteUnlocked: "New route unlocked: Stage {stage} — {name}",
      nextRouteReady: "Next route ready: Stage {stage} — {name}",
      campaignComplete: "Campaign complete: all 30 stages and six Boss routes cleared.",
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
      speedDecision: "Battle speed {current}. Activate to change to {next}.",
      speedPausedDecision: "Battle paused. Activate to resume at 1x.",
      goldenFrame: "Golden Defender Frame",
      goldenFrameDesc: "Cosmetic gold frame for every deployed defender. Costs 15 Diamonds.",
      goldenFrameOwned: "Unlocked",
      goldenFrameBuy: "Unlock (15 Diamonds)",
      goldenFrameConfirm: "Confirm · {balance}→{result}D",
      goldenFrameConfirmLabel: "Confirm Golden Defender Frame. Spend 15 Diamonds. Balance {balance} to {result}.",
      victoryText: "Stage {stage} cleared. Routes, blockers, upgrades, and hero timing worked together.",
      defeatText: "Good effort. Try a different route shape or upgrade key blockers earlier.",
      resultPlan: "Next Defense Plan",
      resultPlanWin3: "Next defense: {stars}/3 stars with {core}% core HP. Keep this route shape and focus hero fire earlier on the next boss.",
      resultPlanWin2: "Next defense: {stars}/3 stars with {core}% core HP. Upgrade blockers earlier and stretch the route before burst waves.",
      resultPlanWin1: "Next defense: {stars}/3 stars with {core}% core HP. Add Medic or Sapper support sooner and keep one readable route open.",
      resultPlanLose: "Retry plan: reshape the route, keep one readable path open, and upgrade key blockers before the next pressure wave.",
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
      techBuyLabel: "Upgrade {name} from Lv.{current} to Lv.{next}. {effect}. Cost {cost} upgrade point. Balance {balance} to {result}.",
      techNeedLabel: "{name} Lv.{current} to Lv.{next}. {effect}. Need {cost} upgrade point; balance {balance}.",
      techMaxLabel: "{name} is at maximum Lv.{max}. {effect}.",
      techPowerEffect: "Hero damage bonus {current}% to {next}%",
      techBulwarkEffect: "Defender HP bonus {current} to {next}",
      techEconomyEffect: "Starting coin bonus {current} to {next}",
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
      hp: 245,
      damage: 14,
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
      damage: 15,
      range: 4.2,
      cooldown: 1.05,
      note: { en: "Reliable range.", "zh-Hant": "穩定遠程。" },
    },
    {
      id: "sapper",
      kind: "soldier",
      img: "runeSapper",
      name: { en: "Rune Sapper", "zh-Hant": "符文工兵" },
      cost: 95,
      hp: 120,
      damage: 30,
      range: 2.8,
      cooldown: 1,
      slow: 0.34,
      splash: 1.45,
      note: { en: "Area control.", "zh-Hant": "範圍控場。" },
    },
    {
      id: "medic",
      kind: "soldier",
      img: "medicCub",
      name: { en: "Medic Cub", "zh-Hant": "醫護幼獸" },
      cost: 65,
      hp: 135,
      damage: 0,
      range: 3,
      cooldown: 0.82,
      heal: 30,
      available: false,
      note: { en: "Repairs blockers.", "zh-Hant": "修復阻擋者。" },
    },
    {
      id: "leo",
      kind: "hero",
      img: "leo",
      name: { en: "Boom Mane Leo", "zh-Hant": "爆鬃雷歐" },
      cost: 180,
      hp: 265,
      damage: 28,
      range: 1.7,
      cooldown: 0.95,
      aura: "taunt",
      splash: 1.25,
      note: { en: "Elite frontline hero.", "zh-Hant": "頂級前線英雄。" },
    },
    {
      id: "taro",
      kind: "hero",
      img: "taro",
      name: { en: "Moss Shell Taro", "zh-Hant": "苔殼太郎" },
      cost: 170,
      hp: 310,
      damage: 18,
      range: 1.4,
      cooldown: 1.1,
      slow: 0.42,
      note: { en: "Best route blocker.", "zh-Hant": "最強路線阻擋。" },
    },
    {
      id: "orla",
      kind: "hero",
      img: "orla",
      name: { en: "Moon Cap Orla", "zh-Hant": "月帽歐拉" },
      cost: 145,
      hp: 115,
      damage: 26,
      range: 4.6,
      cooldown: 1.08,
      bounce: 2,
      bounceRatio: 0.62,
      note: { en: "Long-range magic.", "zh-Hant": "遠程魔法。" },
    },
    {
      id: "fia",
      kind: "hero",
      img: "fia",
      name: { en: "Spark Paw Fia", "zh-Hant": "電爪菲亞" },
      cost: 140,
      hp: 135,
      damage: 42,
      range: 2.2,
      cooldown: 0.62,
      bossDamage: 0.55,
      note: { en: "Boss striker.", "zh-Hant": "王關輸出。" },
    },
    {
      id: "rux",
      kind: "hero",
      img: "rux",
      name: { en: "Gear Horn Rux", "zh-Hant": "齒角魯克斯" },
      cost: 145,
      hp: 155,
      damage: 20,
      range: 2.6,
      cooldown: 0.95,
      buff: 0.24,
      note: { en: "Buffs nearby soldiers.", "zh-Hant": "強化附近士兵。" },
    },
    {
      id: "panko",
      kind: "hero",
      img: "panko",
      name: { en: "Drum Belly Panko", "zh-Hant": "鼓腹潘可" },
      cost: 140,
      hp: 150,
      damage: 10,
      range: 2.8,
      cooldown: 1.35,
      heal: 28,
      available: false,
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
      slow: 0.38,
      heal: 15,
      available: false,
      note: { en: "Nature control and healing.", "zh-Hant": "自然控場與治療。" },
    },
  ];

  const techs = [
    { id: "power", max: 5, cost: 1, label: "techPower", desc: "techPowerDesc" },
    { id: "bulwark", max: 5, cost: 1, label: "techBulwark", desc: "techBulwarkDesc" },
    { id: "economy", max: 5, cost: 1, label: "techEconomy", desc: "techEconomyDesc" },
  ];

  const CAMPAIGN_ARCS = [
    {
      mechanic: "pathing",
      names: {
        en: ["Forest Gate", "Split Roots", "Broken Bridge", "Moss Yard", "Moonlit Ford"],
        ja: ["森の門", "分かれ根", "壊れた橋", "苔むす中庭", "月明かりの浅瀬"],
        "zh-Hant": ["森林入口", "分岔樹根", "斷橋", "苔原庭院", "月光淺灘"],
      },
      threats: {
        en: ["Basic wolves test the first bend.", "Two root lanes split the pack.", "Fast scouts punish late builds.", "Boars strain a single blocker.", "Shadow Brute breaks weak front lines."],
        "zh-Hant": ["基礎狼群測試第一個轉角。", "兩條樹根路線分散狼群。", "快速斥候懲罰太晚建置。", "野豬會壓垮單一阻擋者。", "暗影巨漢會突破薄弱前線。"],
      },
      plans: {
        en: ["Bend the route with Guards.", "Join both lanes before adding range.", "Open with Archer coverage.", "Upgrade one anchor and add healing.", "Use Taro to hold while Fia burns the Boss."],
        "zh-Hant": ["用守衛拉出轉彎路線。", "先讓雙線匯流，再補遠程。", "先用弓手覆蓋快速敵人。", "升級一名主坦並加入治療。", "太郎定線，菲亞集中攻擊 Boss。"],
      },
      boss: { en: "Shadow Brute", ja: "シャドウブルート", "zh-Hant": "暗影巨漢", ability: "siege" },
    },
    {
      mechanic: "flying",
      names: {
        en: ["Crystal Bend", "Bat Crossing", "Engineer's Pass", "Echo Grove", "Behemoth Gate"],
        ja: ["水晶の曲がり道", "コウモリの渡り場", "技師の峠", "こだまの森", "巨獣の門"],
        "zh-Hant": ["水晶彎道", "影蝠渡口", "工程師通道", "回音林", "巨獸之門"],
      },
      threats: {
        en: ["Flying bats ignore the ground maze.", "Two bat bursts cross the center.", "Fast and heavy packs alternate.", "Air and ground waves arrive together.", "Forest Behemoth calls escort waves."],
        "zh-Hant": ["飛行影蝠不理會地面迷宮。", "兩波影蝠會穿越中央。", "快速與重甲敵人交替出現。", "空中與地面波次同時進攻。", "森林巨獸會召集護衛波次。"],
      },
      plans: {
        en: ["Cover long angles with Archer and Orla.", "Keep ranged damage near the core.", "Slow boars before focusing bats.", "Split damage between route and sky.", "Clear escorts before committing Boss burst."],
        "zh-Hant": ["用弓手與歐拉覆蓋長距離。", "在核心附近保留遠程火力。", "先緩速野豬，再處理影蝠。", "把輸出分配給地面路線與空中。", "先清護衛，再集中爆發打 Boss。"],
      },
      boss: { en: "Forest Behemoth", ja: "森のベヒモス", "zh-Hant": "森林巨獸", ability: "summon" },
    },
    {
      mechanic: "armor",
      names: {
        en: ["Ironbark Trail", "Thorn Barricade", "Boar Hollow", "Root Forge", "Colossus Yard"],
        ja: ["鉄皮の小道", "いばらの防壁", "イノシシ谷", "根の鍛冶場", "巨像の中庭"],
        "zh-Hant": ["鐵皮木徑", "荊棘路障", "野豬谷", "樹根鍛坊", "巨像庭院"],
      },
      threats: {
        en: ["Ironbark guards arrive with breakable armor.", "Shielded packs protect fast followers.", "Boar columns pressure one route.", "Armor and bats demand mixed damage.", "Ironbark Colossus rebuilds its guard."],
        "zh-Hant": ["鐵皮守衛帶著可擊破護甲進場。", "有護甲的敵人保護快速追兵。", "野豬縱隊集中壓迫一路。", "護甲與影蝠要求混合火力。", "鐵皮巨像會重建防護。"],
      },
      plans: {
        en: ["Use sustained fire to break armor.", "Splash the shield line before runners pass.", "Create two blocker layers.", "Pair Sapper splash with ranged heroes.", "Break the guard before spending burst skills."],
        "zh-Hant": ["用持續火力擊破護甲。", "先用濺射削弱護甲線，避免快敵通過。", "建立兩層阻擋防線。", "用工兵濺射搭配遠程英雄。", "先破防護，再使用爆發技能。"],
      },
      boss: { en: "Ironbark Colossus", ja: "鉄皮の巨像", "zh-Hant": "鐵皮巨像", ability: "armor" },
    },
    {
      mechanic: "regrowth",
      names: {
        en: ["Mistwater Path", "Healing Spring", "Spore Circle", "Druid Ruins", "Ancient Heart"],
        ja: ["霧水の小道", "癒やしの泉", "胞子の環", "ドルイド遺跡", "古木の心"],
        "zh-Hant": ["霧水小徑", "療癒泉", "孢子環地", "德魯伊遺跡", "古木之心"],
      },
      threats: {
        en: ["Mist creatures recover while moving.", "Regrowth rewards unfinished targets.", "Split packs heal on separate lanes.", "Armored regenerators extend every fight.", "Verdant Ancient restores health in phases."],
        "zh-Hant": ["霧中生物移動時會恢復生命。", "沒有擊倒的目標會持續再生。", "分線敵群會各自在路上恢復。", "帶甲再生敵人會拖長戰鬥。", "翠綠古木會分階段恢復生命。"],
      },
      plans: {
        en: ["Focus one target instead of spreading shots.", "Place burst damage before the final bend.", "Make lanes meet inside one kill zone.", "Break armor, then finish targets quickly.", "Save hero focus for each healing phase."],
        "zh-Hant": ["集中擊倒一個目標，不要分散攻擊。", "在最後轉角前配置爆發火力。", "讓分線敵人在同一火力區匯合。", "先破甲，再快速收掉目標。", "為每次治療階段保留英雄集火。"],
      },
      boss: { en: "Verdant Ancient", ja: "翠緑の古木", "zh-Hant": "翠綠古木", ability: "regrowth" },
    },
    {
      mechanic: "surge",
      names: {
        en: ["Storm Approach", "Thunder Fork", "Gale Rampart", "Lightning Hollow", "Tempest Crown"],
        ja: ["嵐の前線", "雷鳴の分岐路", "強風の防壁", "稲妻谷", "暴風の王冠"],
        "zh-Hant": ["風暴前線", "雷鳴岔路", "強風壁壘", "閃電谷", "暴風王冠"],
      },
      threats: {
        en: ["Wounded enemies enter a speed surge.", "Bat surges punish an empty core lane.", "Boars accelerate after losing armor.", "Mixed surges arrive from every wave.", "Tempest Ravager hastens nearby escorts."],
        "zh-Hant": ["受傷敵人會進入加速狀態。", "影蝠加速會懲罰空虛的核心防線。", "野豬失去護甲後會加速。", "每波都有不同敵人進入加速。", "暴風掠奪者會加速附近護衛。"],
      },
      plans: {
        en: ["Build finishing damage near the core.", "Keep Orla behind the last bend.", "Slow before breaking armor.", "Stagger damage zones instead of one cluster.", "Separate escorts from the Boss with slows."],
        "zh-Hant": ["在核心附近配置收尾火力。", "讓歐拉守住最後轉角。", "破甲前先施加緩速。", "分段配置火力區，不要只堆一處。", "用緩速把護衛與 Boss 分開。"],
      },
      boss: { en: "Tempest Ravager", ja: "暴風の略奪者", "zh-Hant": "暴風掠奪者", ability: "haste" },
    },
    {
      mechanic: "eclipse",
      names: {
        en: ["Eclipse Gate", "Voidroot Maze", "Nightfall Bridge", "Crown Approach", "Emperor's Stand"],
        ja: ["月蝕の門", "虚根の迷宮", "夜幕の橋", "王冠への道", "皇帝の最終陣"],
        "zh-Hant": ["月蝕之門", "虛根迷宮", "夜幕斷橋", "王冠前線", "皇帝終戰"],
      },
      threats: {
        en: ["Eclipse packs combine flight and armor.", "Regrowth returns behind armored fronts.", "Surging bats cover heavy columns.", "Every earlier threat appears in sequence.", "Voidroot Emperor changes phase twice."],
        "zh-Hant": ["月蝕敵群同時結合飛行與護甲。", "再生敵人躲在重甲前線後方。", "加速影蝠掩護重型縱隊。", "先前所有威脅會依序出現。", "虛根皇帝會進行兩次階段轉換。"],
      },
      plans: {
        en: ["Use a complete ground-and-air formation.", "Focus regenerators after the armor line breaks.", "Keep a second damage zone near the core.", "Upgrade roles, not only one carry.", "Answer each phase: bats, armor, then the Emperor."],
        "zh-Hant": ["建立完整的地面與空中防線。", "破開護甲線後集中擊倒再生敵人。", "在核心附近保留第二火力區。", "平均升級角色功能，不只養一名主力。", "依序應對影蝠、護甲與皇帝三個階段。"],
      },
      boss: { en: "Voidroot Emperor", ja: "虚根の皇帝", "zh-Hant": "虛根皇帝", ability: "phase" },
    },
  ];

  const CAMPAIGN_NAME_TRANSLATIONS = {
    ko: "숲의 관문|갈라진 뿌리|무너진 다리|이끼 정원|달빛 여울|수정 굽이|박쥐 교차로|기술자의 고개|메아리 숲|베히모스 관문|철갑나무 길|가시 방벽|멧돼지 골짜기|뿌리 대장간|거상 정원|안개물 길|치유의 샘|포자 원형진|드루이드 폐허|고대의 심장|폭풍의 전조|천둥 갈림길|질풍 방벽|번개 골짜기|폭풍의 왕관|일식의 관문|공허뿌리 미로|해질녘 다리|왕관 진입로|황제의 최후진".split("|"),
    "pt-BR": "Portão da Floresta|Raízes Divididas|Ponte Quebrada|Pátio de Musgo|Vau ao Luar|Curva de Cristal|Travessia dos Morcegos|Passagem do Engenheiro|Bosque dos Ecos|Portão do Beemote|Trilha da Casca de Ferro|Barricada de Espinhos|Vale dos Javalis|Forja das Raízes|Pátio do Colosso|Caminho das Águas Nebulosas|Fonte Curativa|Círculo de Esporos|Ruínas Druídicas|Coração Ancestral|Aproximação da Tempestade|Bifurcação do Trovão|Muralha da Ventania|Vale dos Relâmpagos|Coroa da Tempestade|Portão do Eclipse|Labirinto das Raízes Vazias|Ponte do Anoitecer|Caminho da Coroa|Última Resistência do Imperador".split("|"),
    fr: "Porte de la Forêt|Racines Séparées|Pont Brisé|Cour de Mousse|Gué au Clair de Lune|Virage de Cristal|Passage des Chauves-souris|Col de l’Ingénieur|Bosquet des Échos|Porte du Béhémoth|Sentier d’Écorce de Fer|Barricade d’Épines|Creux des Sangliers|Atelier des Racines|Cour du Colosse|Chemin des Eaux Brumeuses|Source Guérisseuse|Cercle de Spores|Ruines Druidiques|Cœur Ancestral|Approche de la Tempête|Fourche du Tonnerre|Rempart des Rafales|Creux de la Foudre|Couronne de la Tempête|Porte de l’Éclipse|Labyrinthe des Racines du Néant|Pont du Crépuscule|Approche de la Couronne|Dernier Rempart de l’Empereur".split("|"),
    de: "Waldtor|Geteilte Wurzeln|Zerbrochene Brücke|Mooshof|Mondlichtfurt|Kristallbiegung|Fledermausquerung|Ingenieurspass|Echowald|Behemot-Tor|Eisenrindenpfad|Dornenbarrikade|Ebermulde|Wurzelschmiede|Koloss-Hof|Nebelwasserpfad|Heilquelle|Sporenkreis|Druidenruinen|Uraltes Herz|Sturmfront|Donnergabelung|Sturmwall|Blitzmulde|Sturmkrone|Finsternistor|Leerenwurzel-Labyrinth|Nachtfallbrücke|Kronenaufstieg|Letztes Bollwerk des Kaisers".split("|"),
    it: "Porta della Foresta|Radici Divise|Ponte Spezzato|Cortile di Muschio|Guado al Chiaro di Luna|Curva di Cristallo|Passaggio dei Pipistrelli|Passo dell’Ingegnere|Selva dell’Eco|Porta del Behemoth|Sentiero della Corteccia Ferrea|Barricata di Spine|Valle dei Cinghiali|Forgia delle Radici|Cortile del Colosso|Sentiero delle Acque Nebbiose|Fonte Curativa|Cerchio delle Spore|Rovine Druidiche|Cuore Ancestrale|Arrivo della Tempesta|Bivio del Tuono|Baluardo del Vento|Valle dei Fulmini|Corona della Tempesta|Porta dell’Eclissi|Labirinto delle Radici del Vuoto|Ponte del Crepuscolo|Ascesa alla Corona|Ultimo Baluardo dell’Imperatore".split("|"),
    ru: "Лесные врата|Разделённые корни|Разрушенный мост|Мшистый двор|Лунный брод|Хрустальный изгиб|Переправа летучих мышей|Перевал инженера|Роща эха|Врата бегемота|Тропа железной коры|Терновая баррикада|Кабанья лощина|Корневая кузница|Двор колосса|Туманный водный путь|Целебный источник|Круг спор|Руины друидов|Древнее сердце|Приближение бури|Громовая развилка|Ветряной бастион|Грозовая лощина|Корона бури|Врата затмения|Лабиринт пустых корней|Мост сумерек|Подступы к короне|Последний рубеж императора".split("|"),
  };
  const CAMPAIGN_BOSS_TRANSLATIONS = {
    ko: "그림자 야수|숲의 베히모스|철갑나무 거상|녹음의 고대목|폭풍 약탈자|공허뿌리 황제".split("|"),
    "pt-BR": "Bruto das Sombras|Beemote da Floresta|Colosso da Casca de Ferro|Ancião Verdejante|Devastador da Tempestade|Imperador das Raízes Vazias".split("|"),
    fr: "Brute des Ombres|Béhémoth de la Forêt|Colosse d’Écorce de Fer|Ancien Verdoyant|Ravageur de la Tempête|Empereur des Racines du Néant".split("|"),
    de: "Schattenbestie|Waldbehemot|Eisenrindenkoloss|Uralter Grüner|Sturmverwüster|Leerenwurzel-Kaiser".split("|"),
    it: "Bruto dell’Ombra|Behemoth della Foresta|Colosso della Corteccia Ferrea|Antico Verdeggiante|Devastatore della Tempesta|Imperatore delle Radici del Vuoto".split("|"),
    ru: "Теневой зверь|Лесной бегемот|Колосс железной коры|Древний хранитель зелени|Буревой разоритель|Император пустых корней".split("|"),
  };
  const CAMPAIGN_INTEL_TRANSLATIONS = {
    ko: {
      threats: "기본 늑대 무리가 첫 굽이를 시험합니다.|두 갈래 뿌리 길이 무리를 나눕니다.|빠른 정찰대는 늦은 배치를 파고듭니다.|멧돼지 무리가 한 명의 방어자를 압박합니다.|그림자 야수는 약한 전선을 돌파합니다.|비행 박쥐는 지상 미로를 무시합니다.|두 무리의 박쥐가 중앙을 가로지릅니다.|빠른 무리와 중장갑 무리가 번갈아 옵니다.|공중과 지상 공격이 동시에 시작됩니다.|숲의 베히모스가 호위 병력을 부릅니다.|철갑나무 경비병이 파괴 가능한 갑옷을 두르고 옵니다.|방패 무리가 빠른 추격대를 보호합니다.|멧돼지 종대가 한 경로를 집중 압박합니다.|갑옷과 박쥐를 상대하려면 혼합 화력이 필요합니다.|철갑나무 거상이 방어막을 재생합니다.|안개 생물은 이동하면서 체력을 회복합니다.|끝내지 못한 적은 계속 재생합니다.|갈라진 적 무리가 각 경로에서 회복합니다.|갑옷을 두른 재생 적이 전투를 길게 끕니다.|녹음의 고대목은 단계마다 체력을 회복합니다.|부상당한 적이 가속 상태에 들어갑니다.|가속 박쥐가 비어 있는 핵심 경로를 노립니다.|멧돼지는 갑옷을 잃은 뒤 가속합니다.|각 웨이브에서 서로 다른 적이 가속합니다.|폭풍 약탈자가 주변 호위병을 가속합니다.|일식 무리는 비행과 갑옷을 함께 사용합니다.|재생 적이 중장갑 전선 뒤에서 돌아옵니다.|가속 박쥐가 중장갑 종대를 엄호합니다.|앞서 등장한 모든 위협이 차례로 나타납니다.|공허뿌리 황제는 두 번 형태를 바꿉니다.".split("|"),
      plans: "경비병으로 경로에 굽이를 만드세요.|원거리 유닛을 추가하기 전에 두 경로를 합치세요.|궁수의 사거리로 빠른 적부터 막으세요.|핵심 방어자 한 명을 강화하고 치유를 더하세요.|타로가 버티는 동안 피아가 보스를 집중 공격하게 하세요.|궁수와 올라로 긴 사선을 덮으세요.|원거리 화력을 핵심부 가까이에 남겨 두세요.|멧돼지를 느리게 만든 뒤 박쥐를 집중 공격하세요.|지상 경로와 공중에 화력을 나누세요.|보스에게 화력을 집중하기 전에 호위병부터 정리하세요.|지속 화력으로 갑옷을 부수세요.|빠른 적이 지나가기 전에 방패 전열을 광역 공격하세요.|방어선을 두 겹으로 만드세요.|공병의 광역 공격과 원거리 영웅을 조합하세요.|폭발 기술을 쓰기 전에 방어막부터 부수세요.|공격을 분산하지 말고 한 목표에 집중하세요.|마지막 굽이 앞에 폭발 화력을 배치하세요.|두 경로가 하나의 처치 구역에서 만나게 하세요.|갑옷을 부순 뒤 적을 빠르게 마무리하세요.|각 회복 단계에 맞춰 영웅 집중 공격을 아껴 두세요.|핵심부 가까이에 마무리 화력을 배치하세요.|올라를 마지막 굽이 뒤에 두세요.|갑옷을 부수기 전에 먼저 둔화하세요.|화력 구역을 한곳에 몰지 말고 여러 구간에 나누세요.|둔화로 호위병과 보스를 떼어 놓으세요.|지상과 공중을 모두 막는 완전한 진형을 만드세요.|갑옷 전열이 무너지면 재생 적을 집중 공격하세요.|핵심부 가까이에 두 번째 화력 구역을 남겨 두세요.|한 명의 주력만 키우지 말고 역할별로 강화하세요.|박쥐, 갑옷, 황제 순서로 각 단계에 대응하세요.".split("|"),
    },
    "pt-BR": {
      threats: "Lobos básicos testam a primeira curva.|Duas trilhas de raízes dividem a alcateia.|Batedores velozes punem construções tardias.|Javalis pressionam um único bloqueador.|O Bruto das Sombras rompe linhas fracas.|Morcegos voadores ignoram o labirinto no chão.|Duas ondas de morcegos cruzam o centro.|Grupos rápidos e pesados se alternam.|Ondas aéreas e terrestres chegam juntas.|O Beemote da Floresta chama escoltas.|Guardas de casca de ferro chegam com armadura quebrável.|Grupos com escudo protegem perseguidores velozes.|Colunas de javalis pressionam uma rota.|Armadura e morcegos exigem dano misto.|O Colosso da Casca de Ferro refaz sua proteção.|Criaturas da névoa se curam em movimento.|Alvos não finalizados continuam se curando.|Grupos divididos se curam em rotas separadas.|Regeneradores blindados prolongam cada luta.|O Ancião Verdejante recupera vida por fases.|Inimigos feridos entram em aceleração.|Morcegos acelerados punem a rota central vazia.|Javalis aceleram após perder a armadura.|Acelerações mistas chegam em cada onda.|O Devastador da Tempestade acelera escoltas próximas.|Grupos do eclipse combinam voo e armadura.|Regeneradores retornam atrás da linha blindada.|Morcegos acelerados cobrem colunas pesadas.|Todas as ameaças anteriores chegam em sequência.|O Imperador das Raízes Vazias muda de fase duas vezes.".split("|"),
      plans: "Use Guardas para criar curvas na rota.|Una as duas rotas antes de adicionar alcance.|Comece com cobertura de Arqueiros.|Fortaleça um bloqueador e adicione cura.|Use Taro para segurar e Fia para atacar o Chefe.|Cubra ângulos longos com Arqueiros e Orla.|Mantenha dano à distância perto do núcleo.|Desacelere javalis antes de focar nos morcegos.|Divida o dano entre a rota e o céu.|Elimine escoltas antes de atacar o Chefe.|Use fogo contínuo para quebrar a armadura.|Ataque a linha de escudos antes que os rápidos passem.|Crie duas camadas de bloqueadores.|Combine o dano em área do Sapador com heróis de alcance.|Quebre a proteção antes de usar habilidades fortes.|Concentre fogo em um alvo por vez.|Coloque dano explosivo antes da última curva.|Faça as rotas se unirem em uma zona de abate.|Quebre a armadura e finalize os alvos rápido.|Guarde o foco dos heróis para cada fase de cura.|Coloque dano de finalização perto do núcleo.|Mantenha Orla atrás da última curva.|Desacelere antes de quebrar a armadura.|Separe as zonas de dano em vez de agrupar tudo.|Use lentidão para separar escoltas do Chefe.|Monte uma formação completa contra chão e ar.|Foque os regeneradores após romper a linha blindada.|Mantenha uma segunda zona de dano perto do núcleo.|Melhore cada função, não apenas um carregador.|Responda a cada fase: morcegos, armadura e Imperador.".split("|"),
    },
  };
  Object.assign(CAMPAIGN_INTEL_TRANSLATIONS["pt-BR"].threats, {
    15: "A névoa se cura em movimento.",
    20: "Feridos entram em aceleração.",
    29: "O Imperador muda duas vezes.",
  });
  Object.assign(CAMPAIGN_INTEL_TRANSLATIONS["pt-BR"].plans, {
    15: "Foque um alvo por vez.",
    20: "Finalize perto do núcleo.",
    29: "Morcegos, armadura, Chefe.",
  });
  CAMPAIGN_INTEL_TRANSLATIONS.fr = {
    threats: "Des loups ordinaires testent le premier virage.|Deux voies de racines divisent la meute.|Les éclaireurs rapides punissent les défenses tardives.|Les sangliers pressent un seul bloqueur.|La Brute des Ombres brise les lignes faibles.|Les chauves-souris ignorent le labyrinthe au sol.|Deux vagues de chauves-souris traversent le centre.|Les groupes rapides et lourds alternent.|Les vagues aériennes et terrestres arrivent ensemble.|Le Béhémoth de la Forêt appelle des escortes.|Les gardes d’écorce de fer arrivent avec une armure brisable.|Les groupes protégés couvrent les poursuivants rapides.|Les colonnes de sangliers pressent une voie.|Armure et chauves-souris exigent des dégâts mixtes.|Le Colosse d’Écorce de Fer renouvelle sa garde.|Les créatures de brume récupèrent en avançant.|Les cibles inachevées continuent de guérir.|Les groupes séparés guérissent sur chaque voie.|Les régénérateurs blindés prolongent chaque combat.|L’Ancien Verdoyant récupère sa vie par phases.|Les ennemis blessés accélèrent.|Les chauves-souris rapides punissent la voie centrale vide.|Les sangliers accélèrent après avoir perdu leur armure.|Des accélérations mixtes arrivent à chaque vague.|Le Ravageur de la Tempête accélère ses escortes.|Les groupes de l’éclipse mêlent vol et armure.|La régénération revient derrière la ligne blindée.|Les chauves-souris rapides couvrent les colonnes lourdes.|Toutes les menaces précédentes arrivent en séquence.|L’Empereur des Racines du Néant change deux fois de phase.".split("|"),
    plans: "Courbez la route avec des Gardes.|Réunissez les deux voies avant d’ajouter la portée.|Ouvrez avec la couverture des Archers.|Renforcez un bloqueur et ajoutez des soins.|Taro retient ; Fia frappe le Boss.|Couvrez les longs angles avec les Archers et Orla.|Gardez les dégâts à distance près du noyau.|Ralentissez les sangliers, puis visez les chauves-souris.|Répartissez les dégâts entre la route et le ciel.|Éliminez les escortes avant de frapper le Boss.|Brisez l’armure avec un feu soutenu.|Frappez la ligne de boucliers avant le passage des rapides.|Créez deux couches de bloqueurs.|Associez le Sapeur et les héros à distance.|Brisez la garde avant les compétences puissantes.|Concentrez le feu sur une cible.|Placez les dégâts explosifs avant le dernier virage.|Réunissez les voies dans une zone d’élimination.|Brisez l’armure, puis finissez vite les cibles.|Gardez le focus des héros pour chaque phase de soin.|Placez les dégâts finaux près du noyau.|Gardez Orla derrière le dernier virage.|Ralentissez avant de briser l’armure.|Étalez les zones de dégâts au lieu de tout grouper.|Séparez les escortes du Boss avec des ralentissements.|Formez une défense complète au sol et dans les airs.|Visez les régénérateurs après la rupture de l’armure.|Gardez une seconde zone de dégâts près du noyau.|Améliorez chaque rôle, pas un seul héros.|Répondez par ordre : chauves-souris, armure, Empereur.".split("|"),
  };
  Object.assign(CAMPAIGN_INTEL_TRANSLATIONS.fr.threats, {
    15: "La brume récupère en avançant.",
    26: "La régénération suit l’armure.",
    29: "L’Empereur change deux fois.",
  });
  Object.assign(CAMPAIGN_INTEL_TRANSLATIONS.fr.plans, {
    15: "Focalisez une cible.",
    26: "Visez les soins après l’armure.",
    29: "Ordre : vol, armure, Empereur.",
  });
  CAMPAIGN_INTEL_TRANSLATIONS.de = {
    threats: "Einfache Wölfe prüfen die erste Kurve.|Zwei Wurzelwege teilen das Rudel.|Schnelle Späher bestrafen späten Aufbau.|Eber bedrängen einen einzelnen Blocker.|Die Schattenbestie bricht schwache Fronten.|Fliegende Fledermäuse umgehen das Bodenlabyrinth.|Zwei Fledermauswellen kreuzen die Mitte.|Schnelle und schwere Gruppen wechseln sich ab.|Luft- und Bodenwellen treffen gemeinsam ein.|Der Waldbehemot ruft Begleiter.|Eisenrindenwachen kommen mit brechbarer Rüstung.|Geschützte Gruppen decken schnelle Verfolger.|Eberkolonnen bedrängen einen Weg.|Rüstung und Fledermäuse verlangen gemischten Schaden.|Der Eisenrindenkoloss erneuert seinen Schutz.|Nebelwesen heilen sich beim Bewegen.|Unbesiegte Ziele regenerieren weiter.|Geteilte Gruppen heilen auf getrennten Wegen.|Gepanzerte Regeneratoren verlängern jeden Kampf.|Der Uralte Grüne heilt sich phasenweise.|Verwundete Gegner beschleunigen.|Beschleunigte Fledermäuse bestrafen den leeren Kernweg.|Eber beschleunigen nach Rüstungsverlust.|Gemischte Schübe kommen in jeder Welle.|Der Sturmverwüster beschleunigt nahe Begleiter.|Finsternisgruppen verbinden Flug und Rüstung.|Regeneration kehrt hinter der Panzerfront zurück.|Schnelle Fledermäuse decken schwere Kolonnen.|Alle bisherigen Gefahren folgen nacheinander.|Der Leerenwurzel-Kaiser wechselt zweimal die Phase.".split("|"),
    plans: "Biege den Weg mit Wachen.|Führe beide Wege zusammen, dann ergänze Reichweite.|Beginne mit Bogenschützen-Abdeckung.|Verstärke einen Blocker und füge Heilung hinzu.|Taro hält; Fia greift den Boss an.|Decke lange Winkel mit Bogenschützen und Orla.|Halte Fernschaden nahe am Kern.|Verlangsame Eber, dann fokussiere Fledermäuse.|Teile Schaden zwischen Weg und Luft.|Besiege Begleiter vor dem Boss-Angriff.|Brich Rüstung mit Dauerfeuer.|Triff die Schildlinie, bevor Schnelle passieren.|Baue zwei Blockerschichten.|Kombiniere Flächenschaden und Fernhelden.|Brich den Schutz vor starken Fähigkeiten.|Konzentriere das Feuer auf ein Ziel.|Platziere Explosivschaden vor der letzten Kurve.|Führe Wege in einer Kampfzone zusammen.|Brich Rüstung und erledige Ziele schnell.|Spare Heldenfokus für jede Heilphase.|Platziere Endschaden nahe am Kern.|Halte Orla hinter der letzten Kurve.|Verlangsame vor dem Rüstungsbruch.|Verteile Schadenszonen statt alles zu bündeln.|Trenne Begleiter mit Verlangsamung vom Boss.|Baue eine vollständige Boden- und Luftabwehr.|Fokussiere Regeneratoren nach dem Rüstungsbruch.|Halte eine zweite Schadenszone nahe am Kern.|Verbessere jede Rolle, nicht nur einen Träger.|Reagiere der Reihe nach: Fledermäuse, Rüstung, Kaiser.".split("|"),
  };
  Object.assign(CAMPAIGN_INTEL_TRANSLATIONS.de.threats, {
    13: "Rüstung und Fledermäuse brauchen Mischschaden.",
    18: "Gepanzerte Regeneration verlängert Kämpfe.",
    21: "Schnelle Fledermäuse treffen den leeren Kern.",
    29: "Kaiser wechselt zweimal.",
  });
  Object.assign(CAMPAIGN_INTEL_TRANSLATIONS.de.plans, {
    13: "Kombiniere Fläche und Fernkampf.",
    18: "Brich Rüstung, erledige Ziele schnell.",
    21: "Halte Orla an der letzten Kurve.",
    29: "Flug, Rüstung, Kaiser.",
  });
  CAMPAIGN_INTEL_TRANSLATIONS.it = {
    threats: "I lupi base mettono alla prova la prima curva.|Due sentieri di radici dividono il branco.|Gli esploratori veloci puniscono le difese tardive.|I cinghiali premono su un solo difensore.|Il Bruto dell’Ombra spezza le linee deboli.|I pipistrelli volanti ignorano il labirinto a terra.|Due ondate di pipistrelli attraversano il centro.|Gruppi veloci e pesanti si alternano.|Ondate aeree e terrestri arrivano insieme.|Il Behemoth della Foresta chiama le scorte.|Le guardie di corteccia ferrea arrivano con armatura fragile.|I gruppi protetti coprono gli inseguitori veloci.|Colonne di cinghiali premono su una corsia.|Armatura e pipistrelli richiedono danni misti.|Il Colosso della Corteccia Ferrea ripristina la protezione.|Le creature della nebbia si curano in movimento.|I bersagli non finiti continuano a rigenerarsi.|I gruppi divisi si curano su corsie separate.|I rigeneratori corazzati allungano ogni scontro.|L’Antico Verdeggiante recupera vita a fasi.|I nemici feriti accelerano.|I pipistrelli accelerati puniscono la corsia centrale vuota.|I cinghiali accelerano dopo aver perso l’armatura.|Accelerazioni miste arrivano a ogni ondata.|Il Devastatore della Tempesta accelera le scorte vicine.|I gruppi dell’eclissi uniscono volo e armatura.|La rigenerazione ritorna dietro la linea corazzata.|Pipistrelli veloci coprono le colonne pesanti.|Tutte le minacce precedenti arrivano in sequenza.|L’Imperatore delle Radici del Vuoto cambia fase due volte.".split("|"),
    plans: "Piega il percorso con le Guardie.|Unisci le corsie prima di aggiungere gittata.|Inizia con la copertura degli Arcieri.|Potenzia un difensore e aggiungi cure.|Taro resiste; Fia colpisce il Boss.|Copri gli angoli lunghi con Arcieri e Orla.|Tieni i danni a distanza vicino al nucleo.|Rallenta i cinghiali, poi mira ai pipistrelli.|Dividi i danni tra percorso e cielo.|Elimina le scorte prima di attaccare il Boss.|Rompi l’armatura con fuoco continuo.|Colpisci gli scudi prima che passino i veloci.|Crea due strati di difensori.|Abbina danni ad area ed eroi a distanza.|Rompi la protezione prima delle abilità forti.|Concentra il fuoco su un bersaglio.|Metti danni esplosivi prima dell’ultima curva.|Unisci le corsie in una zona di eliminazione.|Rompi l’armatura e finisci presto i bersagli.|Conserva il focus degli eroi per ogni fase di cura.|Metti danni finali vicino al nucleo.|Tieni Orla dietro l’ultima curva.|Rallenta prima di rompere l’armatura.|Distribuisci le zone di danno invece di ammucchiarle.|Separa le scorte dal Boss con rallentamenti.|Crea una difesa completa a terra e in aria.|Mira ai rigeneratori dopo aver rotto l’armatura.|Tieni una seconda zona di danno vicino al nucleo.|Potenzia ogni ruolo, non un solo eroe.|Rispondi in ordine: pipistrelli, armatura, Imperatore.".split("|"),
  };
  Object.assign(CAMPAIGN_INTEL_TRANSLATIONS.it.threats, {
    10: "Guardie: armatura fragile.",
    15: "La nebbia si cura in movimento.",
    26: "Rigenerazione dietro l’armatura.",
    29: "Imperatore: due cambi.",
  });
  Object.assign(CAMPAIGN_INTEL_TRANSLATIONS.it.plans, {
    10: "Usa fuoco continuo.",
    15: "Concentra un bersaglio.",
    26: "Mira ai rigeneratori.",
    29: "Volo, armatura, Imperatore.",
  });
  CAMPAIGN_INTEL_TRANSLATIONS.ru = {
    threats: "Обычные волки проверяют первый поворот.|Две корневые тропы разделяют стаю.|Быстрые разведчики наказывают за позднюю защиту.|Кабаны давят на одного защитника.|Теневой зверь прорывает слабую линию.|Летучие мыши обходят наземный лабиринт.|Две волны мышей пересекают центр.|Быстрые и тяжёлые группы чередуются.|Воздушные и наземные волны приходят вместе.|Лесной исполин призывает охрану.|Железнокорые стражи приходят с разрушаемой бронёй.|Щитоносцы прикрывают быстрых преследователей.|Колонны кабанов давят на одну тропу.|Броня и мыши требуют смешанного урона.|Железнокорый колосс восстанавливает защиту.|Туманные существа лечатся в движении.|Незавершённые цели продолжают восстанавливаться.|Разделённые группы лечатся на разных тропах.|Бронированные целители затягивают каждый бой.|Зелёный древень восстанавливает здоровье по фазам.|Раненые враги ускоряются.|Ускоренные мыши атакуют пустую тропу у ядра.|Кабаны ускоряются после потери брони.|В каждой волне ускоряются разные враги.|Буревой разоритель ускоряет ближайшую охрану.|Затмённые группы сочетают полёт и броню.|Целители возвращаются за бронированной линией.|Быстрые мыши прикрывают тяжёлые колонны.|Все прежние угрозы появляются по очереди.|Император меняет фазу дважды.".split("|"),
    plans: "Изогните путь Стражами.|Сведите тропы вместе, затем добавьте дальний бой.|Сначала прикройте путь Лучниками.|Укрепите одного защитника и добавьте лечение.|Таро держит линию, а Фиа бьёт босса.|Перекройте длинные участки Лучниками и Орлой.|Держите дальний урон рядом с ядром.|Замедлите кабанов, затем атакуйте мышей.|Разделите урон между землёй и воздухом.|Сначала устраните охрану, затем атакуйте босса.|Разрушайте броню постоянным огнём.|Ударьте по линии щитов до прохода быстрых врагов.|Создайте два слоя защитников.|Сочетайте урон Сапёра по площади с дальними героями.|Сломайте защиту до применения мощных навыков.|Сосредоточьте огонь на одной цели.|Поставьте взрывной урон перед последним поворотом.|Сведите тропы в одну зону поражения.|Сломайте броню и быстро добейте цели.|Сохраняйте фокус героев для каждой фазы лечения.|Разместите добивающий урон рядом с ядром.|Держите Орлу за последним поворотом.|Замедлите врагов перед снятием брони.|Разнесите зоны урона по пути.|Отделите охрану от босса замедлением.|Постройте полную защиту от земли и воздуха.|Атакуйте целителей после прорыва брони.|Оставьте вторую зону урона рядом с ядром.|Усиливайте каждую роль, а не одного героя.|Мыши, броня, Император.".split("|"),
  };

  const stages = CAMPAIGN_ARCS.flatMap((arc, arcIndex) => arc.names.en.map((name, stageIndex) => {
    const stage = arcIndex * 5 + stageIndex + 1;
    const boss = stageIndex === 4;
    return {
      id: stage,
      arc: arcIndex + 1,
      mechanic: arc.mechanic,
      route: routeLayouts[stage - 1],
      name: { en: name, ja: arc.names.ja[stageIndex], "zh-Hant": arc.names["zh-Hant"][stageIndex] },
      waves: boss ? 5 : stageIndex <= 1 ? 3 : 4,
      threat: stage,
      startCoins: 360 + stage * 42,
      coreHp: 205 + stage * 24 + (boss ? (arcIndex + 1) * 18 : 0),
      enemyHp: 58 + stage * 6,
      enemySpeed: 36 + Math.min(42, stage * 1.4),
      reward: { coins: 45 + stage * 9, diamonds: boss ? 2 : 1, points: boss || stage % 2 === 0 ? 2 : 1 },
      intel: {
        threat: { en: arc.threats.en[stageIndex], "zh-Hant": arc.threats["zh-Hant"][stageIndex] },
        plan: { en: arc.plans.en[stageIndex], "zh-Hant": arc.plans["zh-Hant"][stageIndex] },
      },
      boss,
      bossName: boss ? arc.boss.en : "",
      bossNameJa: boss ? arc.boss.ja : "",
      bossNameZht: boss ? arc.boss["zh-Hant"] : "",
      bossNames: boss ? { en: arc.boss.en, ja: arc.boss.ja, "zh-Hant": arc.boss["zh-Hant"] } : {},
      bossAbility: boss ? arc.boss.ability : "",
      bossHpScale: boss ? 5.6 + arcIndex * 0.9 : 0,
      bossDamage: boss ? 28 + arcIndex * 5 : 0,
      finalEscortCount: boss ? 2 + Math.min(4, arcIndex) : 0,
      spawnCadence: Math.max(0.3, 0.88 - stage * 0.016),
    };
  }));
  Object.entries(CAMPAIGN_NAME_TRANSLATIONS).forEach(([locale, names]) => {
    stages.forEach((stage, index) => { stage.name[locale] = names[index]; });
  });
  Object.entries(CAMPAIGN_BOSS_TRANSLATIONS).forEach(([locale, names]) => {
    stages.filter((stage) => stage.boss).forEach((stage, index) => { stage.bossNames[locale] = names[index]; });
  });
  Object.entries(CAMPAIGN_INTEL_TRANSLATIONS).forEach(([locale, intel]) => {
    stages.forEach((stage, index) => {
      stage.intel.threat[locale] = intel.threats[index];
      stage.intel.plan[locale] = intel.plans[index];
    });
  });
  const STAGE_COUNT = stages.length;
  const STAGE_CARD_POOL_SIZE = 9;
  const STAGE_NAV_SHORTCUTS = "ArrowLeft ArrowRight Home End";
  let stageWindowStart = 0;
  let stageCardPool = [];
  let stageBrowseId = 0;
  let stageSettleFrame = 0;

  function clampStage(value, minimum = 1, maximum = STAGE_COUNT) {
    return Math.max(minimum, Math.min(maximum, Number(value) || minimum));
  }

  function cancelStageSettlement() {
    if (stageSettleFrame) window.cancelAnimationFrame(stageSettleFrame);
    stageSettleFrame = 0;
    nodes.stageRail?.style.removeProperty("scroll-behavior");
    nodes.stageRail?.style.removeProperty("scroll-snap-type");
    if (nodes.stageRail) delete nodes.stageRail.dataset.wpStageSettling;
  }

  function applyCleanTraditionalChineseContent() {
    Object.assign(text["zh-Hant"], {
      title: "獸王守衛",
      language: "語言",
      audioSettings: "設定",
      soundEffects: "音效",
      backToLobby: "返回 WeightPlay 一般遊戲大廳",
      languageControl: "語言",
      backToMain: "返回主頁",
      stageSelector: "關卡選擇列",
      stagePages: "關卡分頁",
      stagesTab: "關卡",
      equipmentTab: "裝備",
      backToStages: "返回關卡選擇",
      localeName: "繁體中文",
      releaseBadge: "內部 Release 候選版",
      menuTitle: "英雄塔防",
      menuHint: "在森林戰棋格上自由建置，改變敵人路線，指揮 WeightPlay 英雄與動物士兵守住六區共 30 個防衛關卡。",
      holdNotice: "公開大廳仍維持敬請期待，直到使用者核准發布。此路線只用於內部 Release 驗證。",
      bestStage: "最高關卡",
      upgradePoints: "升級點",
      diamonds: "鑽石",
      start: "開始遊戲",
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
      traitBounce: "彈跳 {count} 個目標",
      traitBoss: "Boss 傷害 +{percent}%",
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
      reviveConfirm: "確認復甦 · {balance} → {result} 鑽石",
      reviveConfirmLabel: "確認核心復甦。將核心恢復至 35 生命。花費 5 鑽石。餘額從 {balance} 變為 {result}。",
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
      bossPhase: "{boss} 改變戰術！",
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
      speedDecision: "\u6230\u9b25\u901f\u5ea6 {current}\u3002\u555f\u7528\u5f8c\u5207\u63db\u70ba {next}\u3002",
      speedPausedDecision: "\u6230\u9b25\u5df2\u66ab\u505c\u3002\u555f\u7528\u5f8c\u4ee5 1x \u7e7c\u7e8c\u3002",
      goldenFrame: "黃金守衛框",
      goldenFrameDesc: "為所有已部署守衛加上黃金外框。花費 15 鑽石。",
      goldenFrameOwned: "已解鎖",
      goldenFrameBuy: "解鎖（15 鑽石）",
      goldenFrameConfirm: "確認 · {balance}→{result}鑽",
      goldenFrameConfirmLabel: "確認黃金守衛框。花費 15 鑽石。餘額從 {balance} 變為 {result}。",
      victoryText: "第 {stage} 關通關。路線、阻擋、升級與英雄時機配合成功。",
      defeatText: "打得不錯。試著改變路線形狀，或更早升級關鍵阻擋者。",
      resultPlan: "下一場防線方案",
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
      techBuyLabel: "升級{name}，Lv.{current} 到 Lv.{next}。{effect}。花費 {cost} 升級點，餘額 {balance} 到 {result}。",
      techNeedLabel: "{name}，Lv.{current} 到 Lv.{next}。{effect}。需要 {cost} 升級點，目前餘額 {balance}。",
      techMaxLabel: "{name}已達最高 Lv.{max}。{effect}。",
      techPowerEffect: "英雄傷害加成 {current}% 到 {next}%",
      techBulwarkEffect: "守衛生命加成 {current} 到 {next}",
      techEconomyEffect: "起始金幣加成 {current} 到 {next}",
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

  }

  applyCleanTraditionalChineseContent();
  Object.assign(text["zh-Hant"], {
    pauseDecisionTitle: "\u66ab\u505c\u7b2c {stage} \u95dc\uff1f",
    pauseDecisionText: "\u7e7c\u7e8c\u76ee\u524d\u7684\u7b2c {stage} \u95dc\u6230\u9b25\uff0c\u6216\u8fd4\u56de\u95dc\u5361\u4e26\u5931\u53bb\u672c\u6ce2\u9032\u5ea6\u3001\u5b88\u885b\u3001\u91d1\u5e63\u8207\u6838\u5fc3\u751f\u547d\u3002",
    continueBattle: "\u7e7c\u7e8c\u6230\u9b25",
    returnToStages: "\u8fd4\u56de\u95dc\u5361",
    resultPlanWin3:
      "下一場防線：{stars}/3 星，核心保留 {core}%。沿用這條路線，並在下一隻王出現時更早集中英雄火力。",
    resultPlanWin2:
      "下一場防線：{stars}/3 星，核心保留 {core}%。更早升級阻擋者，並在爆發波前拉長敵人路線。",
    resultPlanWin1:
      "下一場防線：{stars}/3 星，核心保留 {core}%。提早補上醫護或工兵，並保留一條清楚可讀的路線。",
    resultPlanLose:
      "重試方案：調整路線形狀、保留一條清楚可讀的路徑，並在下一波壓力前升級關鍵阻擋者。",
    buildFeedback: "\u5df2\u90e8\u7f72",
    upgradeFeedback: "+Lv.{level}",
    sellFeedback: "+{coins} \u91d1\u5e63",
    waveClearFeedback: "\u7b2c {wave} \u6ce2\u5b88\u4f4f\u4e86",
    publicReleaseBadge: "\u7acb\u5373\u904a\u73a9",
    publicNotice: "\u5efa\u7f6e\u5b88\u885b\u3001\u4fdd\u8b77\u6c34\u6676\u6838\u5fc3\uff0c\u4e26\u89e3\u9396\u516d\u5340\u5171 30 \u500b\u95dc\u5361\u3002\u9032\u5ea6\u6703\u4fdd\u5b58\u5728\u9019\u53f0\u88dd\u7f6e\u3002",
    autoWave: "\u4e0b\u4e00\u6ce2\u5c07\u5728 {seconds} \u79d2\u5f8c\u81ea\u52d5\u958b\u59cb",
    savedProgress: "\u5df2\u4fdd\u5b58\u7e3d\u8a08\uff1a{points} \u5347\u7d1a\u9ede\u00b7{diamonds} \u947d\u77f3",
    newRouteUnlocked: "\u65b0\u8def\u7dda\u89e3\u9396\uff1a\u7b2c {stage} \u95dc\u2014{name}",
    nextRouteReady: "\u4e0b\u4e00\u8def\u7dda\u53ef\u9032\u5165\uff1a\u7b2c {stage} \u95dc\u2014{name}",
    campaignComplete: "\u6230\u5f79\u5b8c\u6210\uff1a30 \u95dc\u8207\u516d\u689d Boss \u8def\u7dda\u5df2\u901a\u95dc\u3002",
    rerollRewardConfirm: "\u78ba\u8a8d +{points} \u5347\u7d1a\u9ede",
    rerollRewardPreview: "\u91cd\u62bd\u589e\u52a0 +{points} \u5347\u7d1a\u9ede \u00b7 \u947d\u77f3 {balance} \u2192 {result}\u3002\u518d\u6b21\u9ede\u64ca\u78ba\u8a8d\u3002",
    rerollRewardNeed: "\u5df2\u4fdd\u5b58\u7e3d\u8a08\uff1a{points} \u5347\u7d1a\u9ede \u00b7 {diamonds} \u947d\u77f3 \u00b7 \u9700\u8981 3 / \u6301\u6709 {diamonds}\u3002",
  });

  text.es = {
    title: "Guardián de Bestias",
    language: "Idioma",
    audioSettings: "Configuración",
    soundEffects: "Efectos de sonido",
    backToLobby: "Volver a los juegos generales de WeightPlay",
    languageControl: "Idioma",
    backToMain: "Volver al inicio",
    stageSelector: "Selector de niveles",
    stagePages: "Páginas de nivel",
    stagesTab: "Niveles",
    equipmentTab: "Equipo",
    backToStages: "Volver a niveles",
    pauseDecisionTitle: "\u00bfPausar el nivel {stage}?",
    pauseDecisionText: "Contin\u00faa esta batalla exacta del nivel {stage} o vuelve a los niveles y pierde la oleada, los defensores, las monedas y la vida del n\u00facleo actuales.",
    continueBattle: "Continuar batalla",
    returnToStages: "Volver a niveles",
    localeName: "Español",
    releaseBadge: "Candidato interno",
    publicReleaseBadge: "Jugar ahora",
    menuTitle: "Defensa de héroes",
    menuHint: "Construye en la cuadrícula del bosque, modifica las rutas enemigas y dirige héroes y soldados animales durante 30 niveles de defensa.",
    holdNotice: "El juego seguirá como Próximamente en el vestíbulo público hasta recibir la aprobación. Esta ruta sirve para validar la versión.",
    publicNotice: "Despliega defensores, protege el núcleo de cristal y desbloquea 30 niveles en seis regiones. El progreso se guarda en este dispositivo.",
    bestStage: "Mejor nivel",
    upgradePoints: "Puntos de mejora",
    diamonds: "Diamantes",
    start: "Iniciar juego",
    tech: "Mejoras técnicas",
    back: "Volver",
    menu: "Menú",
    chooseStage: "Elegir nivel",
    locked: "Bloqueado",
    cleared: "Completado",
    stage: "Nivel",
    core: "Núcleo",
    coins: "Monedas",
    wave: "Oleada",
    build: "Construir",
    startWave: "Iniciar oleada",
    nextWave: "Siguiente oleada",
    autoWave: "Siguiente oleada en {seconds} s",
    waveIntel: "Informe de oleada",
    waveIntelReady: "Siguiente: oleada {wave}/{total} - {enemies}",
    waveIntelActive: "Activa: oleada {wave}/{total} - quedan {remaining} - {enemies}",
    waveIntelDone: "El nivel termina después de esta oleada.",
    routeOpen: "Ruta abierta",
    routeBlocked: "Ruta bloqueada: los enemigos atacan a los defensores",
    coreCritical: "¡Núcleo en peligro! Defiende la ruta.",
    keyboardFocus: "Casilla {x},{y}: Enter construye o selecciona; números o Q/E cambian de unidad.",
    buildReady: "Disponible",
    buildNeedCoins: "Faltan {coins} monedas",
    unitKindHero: "Héroe",
    unitKindSoldier: "Soldado",
    roleLabel: "Función",
    attackSpeed: "Velocidad de ataque",
    everySeconds: "Cada {seconds} s",
    unitSupport: "Apoyo",
    traitLabel: "Rasgos",
    traitSplash: "Área de {tiles} casillas",
    traitSlow: "Ralentiza {percent}%",
    traitHealing: "Cura {points}",
    traitBuff: "Potencia aliados {percent}%",
    traitBounce: "Salta a {count} objetivos",
    traitBoss: "Daño a jefe +{percent}%",
    upgradeAction: "Mejorar ({coins})",
    sellAction: "Vender (+{coins})",
    selectedActionInfo: "Mejora: {upgrade} monedas | Venta: +{sell} monedas",
    enemyWolf: "Lobos x{count}",
    enemyBoar: "Jabalíes x{count}",
    enemyBat: "Murciélagos x{count}",
    enemyBoss: "{boss} x{count}",
    upgrade: "Mejorar",
    sell: "Vender",
    revive: "Revivir núcleo (5 diamantes)",
    reviveConfirm: "Confirmar · {balance} → {result} diamantes",
    reviveConfirmLabel: "Confirma la reanimación del núcleo. Restaura 35 PV y gasta 5 diamantes. Saldo de {balance} a {result}.",
    rerollReward: "Cambiar recompensa (3 diamantes)",
    rerollRewardConfirm: "Confirmar +{points} puntos",
    rerollRewardPreview: "El cambio añade +{points} puntos de mejora · Diamantes {balance} → {result}. Toca otra vez para confirmar.",
    rerollRewardNeed: "Total guardado: {points} puntos de mejora · {diamonds} diamantes · Se necesitan 3 / Tienes {diamonds}.",
    nextStage: "Siguiente nivel",
    retry: "Reintentar",
    victory: "¡Defensa completada!",
    defeat: "El núcleo de cristal cayó",
    techTitle: "Técnica permanente de guardianes",
    techHint: "Gasta los puntos obtenidos en victorias. Las mejoras son opcionales y solo se guardan en este dispositivo.",
    noCoins: "No hay suficientes monedas.",
    noDiamonds: "No hay suficientes diamantes.",
    lockedStage: "Completa primero el nivel anterior.",
    blocked: "Ruta bloqueada: los enemigos atacan a tu defensor.",
    bossIncoming: "¡{boss} entra al campo de batalla!",
    bossPhase: "¡{boss} cambia de táctica!",
    blockedBuild: "No se puede construir en esta casilla.",
    occupied: "Ya hay un defensor en esta casilla.",
    built: "Se desplegó a {name}.",
    upgraded: "{name} subió al Nv.{level}.",
    sold: "Defensor vendido.",
    reviveUsed: "Núcleo revivido.",
    rewardSummary: "Recompensa: +{points} puntos de mejora, +{diamonds} diamantes",
    rewardRerolled: "Recompensa cambiada: +{points} puntos de mejora, +{diamonds} diamantes",
    savedProgress: "Total guardado: {points} puntos de mejora · {diamonds} diamantes",
    newRouteUnlocked: "Nueva ruta desbloqueada: nivel {stage} — {name}",
    nextRouteReady: "Siguiente ruta disponible: nivel {stage} — {name}",
    campaignComplete: "Campaña completada: superaste los 30 niveles y las seis rutas de jefes.",
    rewardRerollUsed: "Recompensa cambiada.",
    starRating: "{stars}/3 estrellas",
    buildFeedback: "Desplegado",
    upgradeFeedback: "+Nv.{level}",
    sellFeedback: "+{coins} monedas",
    soundOn: "Sonido activado",
    soundOff: "Sonido desactivado",
    soundEnabled: "Sonido activado.",
    soundDisabled: "Sonido desactivado.",
    paused: "Pausa",
    speedDecision: "Velocidad de batalla {current}. Activa para cambiar a {next}.",
    speedPausedDecision: "Batalla en pausa. Activa para reanudar a 1x.",
    goldenFrame: "Marco dorado de defensor",
    goldenFrameDesc: "Añade un marco dorado cosmético a todos los defensores desplegados. Cuesta 15 diamantes.",
    goldenFrameOwned: "Desbloqueado",
    goldenFrameBuy: "Desbloquear (15 diamantes)",
    goldenFrameConfirm: "Confirmar · {balance}→{result}D",
    goldenFrameConfirmLabel: "Confirma el marco dorado. Gasta 15 diamantes. Saldo de {balance} a {result}.",
    victoryText: "Nivel {stage} completado. Las rutas, bloqueos, mejoras y habilidades de héroe funcionaron en conjunto.",
    defeatText: "Buen intento. Prueba otra forma de ruta o mejora antes a los bloqueadores principales.",
    resultPlan: "Plan para la próxima defensa",
    resultPlanWin3: "Próxima defensa: {stars}/3 estrellas y núcleo al {core}%. Conserva esta ruta y concentra antes el fuego de los héroes en el próximo jefe.",
    resultPlanWin2: "Próxima defensa: {stars}/3 estrellas y núcleo al {core}%. Mejora antes a los bloqueadores y alarga la ruta antes de las oleadas intensas.",
    resultPlanWin1: "Próxima defensa: {stars}/3 estrellas y núcleo al {core}%. Añade antes apoyo médico o de zapador y conserva una ruta legible.",
    resultPlanLose: "Plan de reintento: rediseña la ruta, conserva un camino legible y mejora a los bloqueadores antes de la siguiente oleada difícil.",
    boss: "Jefe",
    bossStage: "Nivel de jefe",
    bossPressure: "Presión del jefe",
    bossHoldRoute: "Defiende la ruta",
    bossNoSignal: "No hay jefe en el campo",
    waveClearFeedback: "Oleada {wave} asegurada",
    bossShadowName: "Bruto Sombrío",
    bossForestName: "Coloso del Bosque",
    guardianRoute: "Ruta de guardián",
    routeGate: "Entrada",
    routeCore: "Núcleo",
    threatIntel: "Amenaza",
    recommendedPlan: "Plan",
    rewardIntel: "Recompensa",
    cost: "Coste",
    range: "Alcance",
    hp: "PV",
    damage: "Daño",
    level: "Nv.",
    techPower: "Poder de héroes",
    techPowerDesc: "+10% de daño de héroes por nivel.",
    techBulwark: "Baluarte guardián",
    techBulwarkDesc: "+12 PV de defensor por nivel.",
    techEconomy: "Economía del bosque",
    techEconomyDesc: "+20 monedas iniciales por nivel.",
    techBuy: "Mejorar",
    techBuyLabel: "Mejora {name} del Nv.{current} al Nv.{next}. {effect}. Cuesta {cost} punto de mejora. Saldo de {balance} a {result}.",
    techNeedLabel: "{name} del Nv.{current} al Nv.{next}. {effect}. Necesitas {cost} punto de mejora; saldo {balance}.",
    techMaxLabel: "{name} está al máximo: {max}. {effect}.",
    techPowerEffect: "Bonificación de daño de héroes de {current}% a {next}%",
    techBulwarkEffect: "Bonificación de PV de defensores de {current} a {next}",
    techEconomyEffect: "Bonificación de monedas iniciales de {current} a {next}",
    loadFailed: "Error de carga",
  };

  const unitCopyEs = {
    guard: ["Guardia Bellota", "Bloqueador económico."],
    archer: ["Arquero Explorador", "Ataque a distancia fiable."],
    sapper: ["Zapador Rúnico", "Control de área."],
    medic: ["Cachorro Médico", "Repara a los bloqueadores."],
    leo: ["Leo Melena Explosiva", "Héroe de primera línea de élite."],
    taro: ["Taro Caparazón Musgoso", "El mejor bloqueador de rutas."],
    orla: ["Orla Sombrero Lunar", "Magia de largo alcance."],
    fia: ["Fia Pata Chispeante", "Especialista contra jefes."],
    rux: ["Rux Cuerno de Engranaje", "Potencia a los soldados cercanos."],
    panko: ["Panko Barriga Tambor", "Cura a los bloqueadores."],
    deer: ["Ciervo Natural", "Control natural y curación."],
  };
  unitTypes.forEach((unit) => {
    unit.name.es = unitCopyEs[unit.id][0];
    unit.note.es = unitCopyEs[unit.id][1];
  });

  const campaignCopyEs = [
    {
      names: ["Entrada del Bosque", "Raíces Divididas", "Puente Roto", "Patio Musgoso", "Vado Lunar"],
      threats: ["Los lobos básicos ponen a prueba la primera curva.", "Dos rutas de raíces separan a la manada.", "Los exploradores rápidos castigan una defensa tardía.", "Los jabalíes presionan a un único bloqueador.", "El Bruto Sombrío rompe las primeras líneas débiles."],
      plans: ["Dobla la ruta con guardias.", "Une ambas rutas antes de añadir alcance.", "Empieza con cobertura de arqueros.", "Mejora un ancla y añade curación.", "Usa a Taro para contener mientras Fia ataca al jefe."],
      boss: "Bruto Sombrío",
    },
    {
      names: ["Curva de Cristal", "Cruce de Murciélagos", "Paso del Ingeniero", "Arboleda del Eco", "Puerta del Coloso"],
      threats: ["Los murciélagos voladores ignoran el laberinto terrestre.", "Dos ráfagas de murciélagos cruzan el centro.", "Manadas rápidas y pesadas se alternan.", "Las oleadas aéreas y terrestres llegan juntas.", "El Coloso del Bosque llama oleadas de escoltas."],
      plans: ["Cubre ángulos largos con arqueros y Orla.", "Reserva daño a distancia cerca del núcleo.", "Ralentiza a los jabalíes antes de atacar a los murciélagos.", "Divide el daño entre la ruta y el cielo.", "Elimina escoltas antes de concentrarte en el jefe."],
      boss: "Coloso del Bosque",
    },
    {
      names: ["Senda de Corteza Férrea", "Barricada de Espinas", "Hondonada del Jabalí", "Forja de Raíces", "Patio del Coloso"],
      threats: ["Los guardias de corteza férrea llegan con armadura rompible.", "Las manadas protegidas cubren a seguidores rápidos.", "Las columnas de jabalíes presionan una sola ruta.", "La armadura y los murciélagos exigen daño variado.", "El Coloso de Corteza Férrea reconstruye su defensa."],
      plans: ["Usa fuego continuo para romper la armadura.", "Ataca en área la línea protegida antes de que pasen los corredores.", "Crea dos capas de bloqueadores.", "Combina el área del zapador con héroes a distancia.", "Rompe la defensa antes de gastar habilidades explosivas."],
      boss: "Coloso de Corteza Férrea",
    },
    {
      names: ["Senda de Agua Brumosa", "Manantial Curativo", "Círculo de Esporas", "Ruinas Druídicas", "Corazón Antiguo"],
      threats: ["Las criaturas de la niebla se curan mientras avanzan.", "Los objetivos sin rematar vuelven a crecer.", "Las manadas separadas se curan en rutas distintas.", "Los regeneradores acorazados alargan cada combate.", "El Antiguo Verde recupera salud por fases."],
      plans: ["Concentra el fuego en un objetivo.", "Coloca daño explosivo antes de la última curva.", "Haz que las rutas coincidan en una sola zona de ataque.", "Rompe la armadura y remata con rapidez.", "Reserva el ataque de héroes para cada fase de curación."],
      boss: "Antiguo Verde",
    },
    {
      names: ["Acceso de la Tormenta", "Bifurcación del Trueno", "Muralla del Vendaval", "Hondonada del Rayo", "Corona de la Tempestad"],
      threats: ["Los enemigos heridos aceleran.", "Los murciélagos acelerados castigan una ruta vacía junto al núcleo.", "Los jabalíes aceleran cuando pierden la armadura.", "Cada oleada combina aceleraciones distintas.", "El Devastador de la Tempestad acelera a sus escoltas."],
      plans: ["Coloca daño de remate cerca del núcleo.", "Mantén a Orla detrás de la última curva.", "Ralentiza antes de romper la armadura.", "Separa las zonas de daño en vez de agruparlas.", "Separa a las escoltas del jefe con ralentizaciones."],
      boss: "Devastador de la Tempestad",
    },
    {
      names: ["Puerta del Eclipse", "Laberinto de Raíces Vacías", "Puente del Anochecer", "Acceso a la Corona", "Última Defensa del Emperador"],
      threats: ["Las manadas del eclipse combinan vuelo y armadura.", "La regeneración vuelve detrás de frentes acorazados.", "Murciélagos acelerados cubren columnas pesadas.", "Todas las amenazas anteriores aparecen en secuencia.", "El Emperador de Raíces Vacías cambia de fase dos veces."],
      plans: ["Forma una defensa completa contra tierra y aire.", "Ataca a los regeneradores después de romper la armadura.", "Mantén una segunda zona de daño cerca del núcleo.", "Mejora distintas funciones, no solo a un atacante.", "Responde a cada fase: murciélagos, armadura y Emperador."],
      boss: "Emperador de Raíces Vacías",
    },
  ];
  stages.forEach((stage, index) => {
    const copy = campaignCopyEs[Math.floor(index / 5)];
    const position = index % 5;
    stage.name.es = copy.names[position];
    stage.intel.threat.es = copy.threats[position];
    stage.intel.plan.es = copy.plans[position];
    stage.bossNameEs = stage.boss ? copy.boss : "";
  });

  // The Spanish source copy was historically saved through a Big5 code-page
  // conversion. Repair the known reversible substitutions once at boot so the
  // public Spanish journey stays readable without a second translation table.
  function repairSpanishCopy(value) {
    if (typeof value === "string") {
      return value
        .replaceAll("\u737a", "\u00e1")
        .replaceAll("\u7c3d", "\u00f1")
        .replaceAll("\u7e73", "\u00fa")
        .replaceAll("\u7a69", "\u00ed")
        .replaceAll("\u7c40", "\u00f3")
        .replaceAll("\u77c7", "\u00e9")
        .replaceAll("\u7652", "\u00a1")
        .replaceAll("\u7e5a", "\u00b7")
        .replaceAll("?rea", "\u00c1rea")
        .replaceAll("?ltima", "\u00daltima");
    }
    if (Array.isArray(value)) return value.map(repairSpanishCopy);
    if (value && typeof value === "object") {
      Object.keys(value).forEach((key) => {
        value[key] = repairSpanishCopy(value[key]);
      });
    }
    return value;
  }

  function repairSpanishDocument() {
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      if (!node.parentElement?.matches("script, style")) node.nodeValue = repairSpanishCopy(node.nodeValue);
      node = walker.nextNode();
    }
    document.querySelectorAll("[content], [alt], [aria-label], [title]").forEach((element) => {
      ["content", "alt", "aria-label", "title"].forEach((attribute) => {
        if (element.hasAttribute(attribute)) {
          element.setAttribute(attribute, repairSpanishCopy(element.getAttribute(attribute)));
        }
      });
    });
  }

  repairSpanishCopy(text.es);
  unitTypes.forEach((unit) => {
    unit.name.es = repairSpanishCopy(unit.name.es);
    unit.note.es = repairSpanishCopy(unit.note.es);
  });
  stages.forEach((stage) => {
    stage.name.es = repairSpanishCopy(stage.name.es);
    stage.intel.threat.es = repairSpanishCopy(stage.intel.threat.es);
    stage.intel.plan.es = repairSpanishCopy(stage.intel.plan.es);
    stage.bossNameEs = repairSpanishCopy(stage.bossNameEs);
  });

  Object.assign(text, {
    "zh-Hans": {
      resultPlan: "下一场防线方案",
      resultPlanWin3: "下一场防线：{stars}/3 星，核心保留 {core}%。沿用这条路线，并在下一只首领出现时更早集中英雄火力。",
      resultPlanWin2: "下一场防线：{stars}/3 星，核心保留 {core}%。更早升级阻挡者，并在爆发波前拉长敌人路线。",
      resultPlanWin1: "下一场防线：{stars}/3 星，核心保留 {core}%。提前补上医疗或工兵，并保留一条清楚可读的路线。",
      resultPlanLose: "重试方案：调整路线形状、保留一条清楚可读的路径，并在下一波压力前升级关键阻挡者。",
    },
    ja: {
      resultPlan: "次の防衛プラン",
      resultPlanWin3: "次の防衛：{stars}/3スター、コアHP {core}%。この経路を活かし、次のボスにはヒーローの集中攻撃を早めよう。",
      resultPlanWin2: "次の防衛：{stars}/3スター、コアHP {core}%。ブロッカーを早めに強化し、強襲ウェーブ前に経路を長くしよう。",
      resultPlanWin1: "次の防衛：{stars}/3スター、コアHP {core}%。メディックかサッパーを早めに加え、読みやすい経路を一本残そう。",
      resultPlanLose: "再挑戦プラン：経路を組み直し、通れる道を一本残して、次の高圧ウェーブ前に重要なブロッカーを強化しよう。",
    },
    ko: {
      resultPlan: "다음 방어 계획",
      resultPlanWin3: "다음 방어: {stars}/3별, 코어 HP {core}%. 이 경로를 유지하고 다음 보스에게 영웅 집중 공격을 더 일찍 시작하세요.",
      resultPlanWin2: "다음 방어: {stars}/3별, 코어 HP {core}%. 차단 유닛을 더 일찍 강화하고 강한 웨이브 전에 경로를 늘리세요.",
      resultPlanWin1: "다음 방어: {stars}/3별, 코어 HP {core}%. 의무병이나 공병을 더 일찍 배치하고 읽기 쉬운 경로 하나를 남기세요.",
      resultPlanLose: "재도전 계획: 경로를 다시 설계하고 통과 가능한 길 하나를 남긴 뒤 다음 압박 웨이브 전에 핵심 차단 유닛을 강화하세요.",
    },
    "pt-BR": {
      resultPlan: "Plano para a próxima defesa",
      resultPlanWin3: "Próxima defesa: {stars}/3 estrelas e núcleo com {core}% de PV. Mantenha esta rota e concentre o fogo dos heróis mais cedo no próximo chefe.",
      resultPlanWin2: "Próxima defesa: {stars}/3 estrelas e núcleo com {core}% de PV. Melhore os bloqueadores mais cedo e alongue a rota antes das ondas intensas.",
      resultPlanWin1: "Próxima defesa: {stars}/3 estrelas e núcleo com {core}% de PV. Adicione Médico ou Sapador mais cedo e mantenha uma rota legível.",
      resultPlanLose: "Plano de nova tentativa: redesenhe a rota, mantenha um caminho legível e melhore os bloqueadores antes da próxima onda de pressão.",
    },
    fr: {
      resultPlan: "Plan pour la prochaine défense",
      resultPlanWin3: "Prochaine défense : {stars}/3 étoiles et noyau à {core} %. Gardez ce tracé et concentrez plus tôt le feu des héros sur le prochain boss.",
      resultPlanWin2: "Prochaine défense : {stars}/3 étoiles et noyau à {core} %. Améliorez plus tôt les bloqueurs et allongez la route avant les vagues intenses.",
      resultPlanWin1: "Prochaine défense : {stars}/3 étoiles et noyau à {core} %. Ajoutez plus tôt un Médecin ou un Sapeur et gardez une route lisible.",
      resultPlanLose: "Plan de nouvelle tentative : redessinez la route, gardez un chemin lisible et améliorez les bloqueurs avant la prochaine vague difficile.",
    },
    de: {
      resultPlan: "Plan für die nächste Verteidigung",
      resultPlanWin3: "Nächste Verteidigung: {stars}/3 Sterne, Kern bei {core} %. Behalte diese Route bei und bündele das Heldenfeuer beim nächsten Boss früher.",
      resultPlanWin2: "Nächste Verteidigung: {stars}/3 Sterne, Kern bei {core} %. Verbessere Blocker früher und verlängere die Route vor starken Wellen.",
      resultPlanWin1: "Nächste Verteidigung: {stars}/3 Sterne, Kern bei {core} %. Setze Sanitäter oder Pionier früher ein und halte einen klaren Weg offen.",
      resultPlanLose: "Wiederholungsplan: Gestalte die Route neu, halte einen klaren Weg offen und verbessere wichtige Blocker vor der nächsten Druckwelle.",
    },
    it: {
      resultPlan: "Piano per la prossima difesa",
      resultPlanWin3: "Prossima difesa: {stars}/3 stelle e nucleo al {core}%. Mantieni questo percorso e concentra prima il fuoco degli eroi sul prossimo boss.",
      resultPlanWin2: "Prossima difesa: {stars}/3 stelle e nucleo al {core}%. Potenzia prima i bloccatori e allunga il percorso prima delle ondate intense.",
      resultPlanWin1: "Prossima difesa: {stars}/3 stelle e nucleo al {core}%. Aggiungi prima Medico o Geniere e mantieni un percorso leggibile.",
      resultPlanLose: "Piano di nuovo tentativo: ridisegna il percorso, mantieni un passaggio leggibile e potenzia i bloccatori chiave prima della prossima ondata difficile.",
    },
    ru: {
      resultPlan: "План следующей обороны",
      resultPlanWin3: "Следующая оборона: {stars}/3 звезды, ядро — {core}%. Сохрани этот маршрут и раньше сосредоточь огонь героев на следующем боссе.",
      resultPlanWin2: "Следующая оборона: {stars}/3 звезды, ядро — {core}%. Раньше улучшай блокирующих бойцов и удлиняй маршрут перед мощными волнами.",
      resultPlanWin1: "Следующая оборона: {stars}/3 звезды, ядро — {core}%. Раньше добавь медика или сапёра и оставь один понятный путь.",
      resultPlanLose: "План повторной попытки: измени маршрут, оставь один понятный путь и улучши ключевых блокирующих бойцов до следующей сложной волны.",
    },
    hi: {
      resultPlan: "अगली रक्षा की योजना",
      resultPlanWin3: "अगली रक्षा: {stars}/3 सितारे और कोर HP {core}%। यही रास्ता रखें और अगले बॉस पर हीरो की केंद्रित आग पहले शुरू करें।",
      resultPlanWin2: "अगली रक्षा: {stars}/3 सितारे और कोर HP {core}%। अवरोधकों को पहले उन्नत करें और कठिन लहरों से पहले रास्ता लंबा करें।",
      resultPlanWin1: "अगली रक्षा: {stars}/3 सितारे और कोर HP {core}%। मेडिक या सैपर को पहले लगाएँ और एक साफ खुला रास्ता रखें।",
      resultPlanLose: "दोबारा प्रयास की योजना: रास्ता फिर बनाएँ, एक साफ खुला मार्ग रखें और अगली कठिन लहर से पहले मुख्य अवरोधकों को उन्नत करें।",
    },
    ar: {
      resultPlan: "خطة الدفاع التالية",
      resultPlanWin3: "الدفاع التالي: {stars}/3 نجوم وصحة النواة {core}٪. حافظ على هذا المسار وركّز نيران الأبطال مبكرًا على الزعيم التالي.",
      resultPlanWin2: "الدفاع التالي: {stars}/3 نجوم وصحة النواة {core}٪. طوّر وحدات الصد مبكرًا وأطل المسار قبل الموجات القوية.",
      resultPlanWin1: "الدفاع التالي: {stars}/3 نجوم وصحة النواة {core}٪. أضف المسعف أو المهندس مبكرًا واترك مسارًا واضحًا مفتوحًا.",
      resultPlanLose: "خطة إعادة المحاولة: أعد تشكيل المسار، واترك طريقًا واضحًا مفتوحًا، وطوّر وحدات الصد الأساسية قبل موجة الضغط التالية.",
    },
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
  let rewardRerollConfirmTimer = 0;
  let rewardRerollConfirmDueAt = 0;
  let rewardRerollConfirmRemaining = 0;
  let goldenFrameConfirmPending = false;
  let goldenFrameConfirmTimer = 0;
  let goldenFrameConfirmDueAt = 0;
  let goldenFrameConfirmRemaining = 0;
  let reviveConfirmPending = false;
  let reviveConfirmTimer = 0;
  let reviveConfirmDueAt = 0;
  let reviveConfirmRemaining = 0;
  let leaveBattleConfirmPending = false;
  let leaveBattleWasPaused = false;
  let canvasPress = null;
  let toastPending = false;
  let toastTimer = 0;
  let toastDueAt = 0;
  let toastRemaining = 0;
  let battleFrame = 0;
  let battleHudElapsed = 0;
  let battleWindowFocused = document.hasFocus();
  let resultDecisionCommitted = false;

  function currentStartTile() {
    return state.stage?.route?.start || startTile;
  }

  function currentCoreTile() {
    return state.stage?.route?.core || coreTile;
  }

  function selectableUnitTypes() {
    return unitTypes.filter((unit) => unit.available !== false);
  }

  const healthTerms = {
    en: "Health",
    "zh-Hant": "生命",
    "zh-Hans": "生命值",
    ja: "体力",
    ko: "체력",
    es: "Salud",
    "pt-BR": "Vida",
    fr: "Santé",
    de: "Gesundheit",
    it: "Salute",
    ru: "Здоровье",
    hi: "स्वास्थ्य",
    ar: "الصحة",
  };

  function t(key, values = {}) {
    let value = key === "hp"
      ? (healthTerms[state.locale] || healthTerms.en)
      : (text[state.locale]?.[key] || text.en[key] || key);
    Object.entries(values).forEach(([name, replacement]) => {
      value = value.replaceAll(`{${name}}`, replacement);
    });
    return value;
  }

  const battleLevelTerms = {
    en: "Level",
    "zh-Hant": "等級",
    "zh-Hans": "等级",
    ja: "レベル",
    ko: "레벨",
    es: "Nivel",
    "pt-BR": "Nível",
    fr: "Niveau",
    de: "Stufe",
    it: "Livello",
    ru: "Уровень",
    hi: "स्तर",
    ar: "المستوى",
  };

  function localizedLevelText(level, minimum = 0) {
    const term = battleLevelTerms[state.locale] || battleLevelTerms.en;
    return `${term} ${Math.max(minimum, Math.floor(Number(level) || 0))}`;
  }

  function battleLevelText(level) {
    return localizedLevelText(level, 1);
  }

  function techLevelText(level) {
    return localizedLevelText(level);
  }

  function techLevelLabel(key, values) {
    const markers = {
      current: "__CURRENT_LEVEL__",
      next: "__NEXT_LEVEL__",
      max: "__MAX_LEVEL__",
    };
    let label = t(key, { ...values, ...markers });
    label = label.replace(/(?:Lv|Nv|Niv)\.\s*__(CURRENT|NEXT|MAX)_LEVEL__/giu, "__$1_LEVEL__");
    return label
      .replaceAll(markers.current, techLevelText(values.current))
      .replaceAll(markers.next, techLevelText(values.next))
      .replaceAll(markers.max, techLevelText(values.max));
  }

  function localizedValue(values) {
    if (!values) return "";
    return values[state.locale]
      || (state.locale === "zh-Hans" ? values["zh-Hant"] : "")
      || values.en
      || "";
  }

  function track(event, payload = {}) {
    window.WonderAnalytics?.track?.(event, { game_id: GAME_ID, internal: !isPublicRelease, ...payload });
  }

  function updateSoundButton() {
    if (!nodes.soundBtn) return;
    if (nodes.soundSettingLabel) nodes.soundSettingLabel.textContent = t("soundEffects");
    if (nodes.soundStateText) nodes.soundStateText.textContent = t(state.soundEnabled ? "soundOn" : "soundOff");
    nodes.soundBtn.setAttribute("aria-pressed", String(state.soundEnabled));
    nodes.soundBtn.setAttribute("aria-label", `${t("soundEffects")}: ${t(state.soundEnabled ? "soundOn" : "soundOff")}`);
  }

  function setAudioPopover(open, restoreFocus = false) {
    const nextOpen = Boolean(open);
    nodes.audioPopover?.classList.toggle("is-hidden", !nextOpen);
    nodes.audioMenuBtn?.setAttribute("aria-expanded", String(nextOpen));
    if (restoreFocus && !nextOpen) nodes.audioMenuBtn?.focus({ preventScroll: true });
  }

  function setStagePage(page, focusPanel = false) {
    const equipment = page === "equipment";
    nodes.stagePage?.classList.toggle("is-hidden", equipment);
    nodes.techPanel?.classList.toggle("is-hidden", !equipment);
    nodes.stageTabBtn?.classList.toggle("is-active", !equipment);
    nodes.equipmentTabBtn?.classList.toggle("is-active", equipment);
    nodes.stageTabBtn?.setAttribute("aria-selected", String(!equipment));
    nodes.equipmentTabBtn?.setAttribute("aria-selected", String(equipment));
    if (equipment) renderTech();
    else renderStages();
    if (focusPanel) {
      window.requestAnimationFrame(() => {
        const target = equipment
          ? nodes.techGrid?.querySelector("button:not(:disabled)") || nodes.equipmentTabBtn
          : nodes.stageRail?.querySelector('[aria-current="true"]') || nodes.stageTabBtn;
        target?.focus({ preventScroll: true });
      });
    }
  }

  function setSoundEnabled(enabled, announce = false) {
    state.soundEnabled = Boolean(enabled);
    writeStorage(soundKey, state.soundEnabled ? "on" : "off");
    updateSoundButton();
    if (announce) showToast(t(state.soundEnabled ? "soundEnabled" : "soundDisabled"));
    track("game_audio_toggle", { enabled: state.soundEnabled });
    if (state.soundEnabled) playSfx("toggle");
  }

  // The shared Version 4 Settings switch owns the visible control while this
  // adapter preserves Beast Guardian's existing SFX state and storage key.
  window.WonderSound = window.WonderSound || {};
  window.WonderSound.isMuted = () => !state.soundEnabled;
  window.WonderSound.setMuted = (muted) => setSoundEnabled(!Boolean(muted), true);
  nodes.soundBtn?.setAttribute("data-sound-toggle", "");
  document.addEventListener("keydown", (event) => {
    if (event.repeat
      && (event.key === "Enter" || event.key === " ")
      && event.target?.matches?.(".wp-shell-combined-sound-toggle")) {
      event.preventDefault();
    }
  }, true);

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
    return localizedValue(unit.name);
  }

  function unitKindLabel(unit) {
    return unit?.kind === "hero" ? t("unitKindHero") : t("unitKindSoldier");
  }

  function persistSave(value) {
    return writeStorage(saveKey, JSON.stringify(value));
  }

  function loadSave() {
    const defaultSave = () => ({
      bestStage: 1,
      diamonds: 12,
      upgradePoints: 0,
      tech: { power: 0, bulwark: 0, economy: 0 },
      cosmetics: { goldenFrame: false },
      clears: {},
      stars: {},
    });
    const wholeNumber = (value, fallback, min, max) => {
      const number = Number(value);
      if (!Number.isFinite(number)) return fallback;
      return Math.max(min, Math.min(max, Math.floor(number)));
    };
    const normalizeStageRecord = (value, normalizeValue) => {
      if (!value || typeof value !== "object" || Array.isArray(value)) return {};
      return Object.fromEntries(Object.entries(value).flatMap(([key, entry]) => {
        const stageId = Number(key);
        if (!Number.isInteger(stageId) || stageId < 1 || stageId > STAGE_COUNT) return [];
        const normalized = normalizeValue(entry);
        return normalized === undefined ? [] : [[stageId, normalized]];
      }));
    };
    let raw = null;
    try {
      raw = readStorage(saveKey);
      const parsedValue = JSON.parse(raw || "{}");
      const parsed = parsedValue && typeof parsedValue === "object" && !Array.isArray(parsedValue) ? parsedValue : {};
      const normalized = {
        bestStage: wholeNumber(parsed.bestStage, 1, 1, STAGE_COUNT),
        diamonds: wholeNumber(parsed.diamonds, 12, 0, Number.MAX_SAFE_INTEGER),
        upgradePoints: wholeNumber(parsed.upgradePoints, 0, 0, Number.MAX_SAFE_INTEGER),
        tech: Object.fromEntries(techs.map((tech) => [tech.id, wholeNumber(parsed.tech?.[tech.id], 0, 0, tech.max)])),
        cosmetics: { goldenFrame: parsed.cosmetics?.goldenFrame === true },
        clears: normalizeStageRecord(parsed.clears, (entry) => entry === true ? true : undefined),
        stars: normalizeStageRecord(parsed.stars, (entry) => wholeNumber(entry, 0, 0, 3)),
      };
      const canonical = JSON.stringify(normalized);
      if (raw !== canonical) persistSave(normalized);
      return normalized;
    } catch {
      const fallback = defaultSave();
      persistSave(fallback);
      return fallback;
    }
  }

  function save() {
    persistSave(state.save);
    updateProfile();
  }

  function restoreStageReturnOwnership() {
    if (state.screen !== "stages" && state.screen !== "tech") return;
    const stageHeader = nodes.stagePanel?.querySelector(
      ".wp-stage-shell-header,.wp-generated-stage-header",
    );
    if (!stageHeader || !nodes.stageBackBtn) return;
    if (nodes.stageBackBtn.parentElement !== stageHeader) {
      stageHeader.prepend(nodes.stageBackBtn);
    }
    nodes.stageBackBtn.hidden = false;
    nodes.stageBackBtn.classList.remove("hidden", "is-hidden", "wp-shell-legacy-control");
    nodes.stageBackBtn.removeAttribute("aria-hidden");
  }

  function setScreen(screen) {
    if (screen !== "game") cancelCanvasPress();
    if (screen !== "stages") cancelStageSettlement();
    if (screen !== "result") clearRewardRerollConfirmation();
    if (screen !== "result") clearReviveConfirmation();
    if (screen !== "tech") clearGoldenFrameConfirmation();
    state.screen = screen;
    const resultActive = screen === "result";
    const stageActive = screen === "stages" || screen === "tech";
    document.body.classList.toggle("guardian-playing", screen === "game" || screen === "result");
    document.body.classList.toggle("guardian-result", resultActive);
    document.body.classList.toggle("guardian-stage", stageActive);
    setBattleDecisionCoverage(resultActive);
    setAudioPopover(false);
    nodes.mainBack?.classList.toggle("is-hidden", stageActive);
    nodes.stageBackBtn?.classList.toggle("is-hidden", !stageActive);
    nodes.mainBack?.toggleAttribute("hidden", stageActive);
    nodes.stageBackBtn?.toggleAttribute("hidden", !stageActive);
    [nodes.menuPanel, nodes.stagePanel, nodes.gamePanel, nodes.resultPanel, nodes.pauseDecisionPanel].forEach((panel) => panel?.classList.add("is-hidden"));
    if (screen === "menu") nodes.menuPanel.classList.remove("is-hidden");
    if (stageActive) {
      nodes.stagePanel.classList.remove("is-hidden");
      setStagePage(screen === "tech" ? "equipment" : "stages");
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(restoreStageReturnOwnership);
      });
    }
    if (screen === "game") nodes.gamePanel.classList.remove("is-hidden");
    if (resultActive) {
      nodes.gamePanel.classList.remove("is-hidden");
      nodes.resultPanel.classList.remove("is-hidden");
      window.requestAnimationFrame(() => {
        syncResultActionHierarchy()?.focus({ preventScroll: true });
      });
    }
    updateBattleShell();
    syncBattleLoop();
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
    clearGoldenFrameConfirmation();
    clearReviveConfirmation();
    document.documentElement.lang = state.locale;
    nodes.mainBack?.setAttribute("aria-label", t("backToLobby"));
    nodes.localeSelect.setAttribute("aria-label", t("languageControl"));
    nodes.audioMenuBtn?.setAttribute("aria-label", t("audioSettings"));
    nodes.audioPopover?.setAttribute("aria-label", t("audioSettings"));
    if (nodes.settingsTitle) nodes.settingsTitle.textContent = t("audioSettings");
    nodes.stageBackBtn.setAttribute("aria-label", t("backToMain"));
    nodes.stageRail.setAttribute("aria-label", t("stageSelector"));
    nodes.stageTabs?.setAttribute("aria-label", t("stagePages"));
    nodes.menuBtn.setAttribute("aria-label", t("backToStages"));
    renderPauseDecision();
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
    nodes.stageTabBtn.textContent = t("stagesTab");
    nodes.equipmentTabBtn.textContent = t("equipmentTab");
    nodes.stageBackBtn.textContent = "\u2190";
    nodes.menuBtn.textContent = "\u2190";
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
    renderReviveAction();
    nodes.retryBtn.textContent = t("retry");
    nodes.resultMenuBtn.textContent = t("stagesTab");
    nodes.nextStageBtn.textContent = t("nextStage");
    nodes.rerollRewardBtn.textContent = t("rerollReward");
    updateSoundButton();
    nodes.techTitle.textContent = t("techTitle");
    nodes.techHint.textContent = t("techHint");
    renderBuildCards();
    renderStages();
    renderTech();
    updateProfile();
    updateHud();
  }

  function updateProfile() {
    const progress = `${state.save.bestStage} / ${STAGE_COUNT}`;
    nodes.bestStageText.textContent = progress;
    if (nodes.mainProgress) nodes.mainProgress.textContent = `${t("bestStage")} ${progress}`;
    nodes.upgradePointText.textContent = state.save.upgradePoints;
    nodes.diamondText.textContent = state.save.diamonds;
  }

  function renderBuildCards() {
    const preservedScrollLeft = nodes.buildCards.scrollLeft;
    nodes.buildCards.innerHTML = "";
    selectableUnitTypes().forEach((unit) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `build-card ${state.selectedBuild === unit.id ? "is-selected" : ""}`;
      button.dataset.id = unit.id;
      button.innerHTML = `<img src="${assetSources[unit.img]}" alt="" /><div><strong>${unitName(unit)}</strong><span>${unitKindLabel(unit)} | ${t("cost")}: ${unit.cost}</span><span>${localizedValue(unit.note)}</span><span class="build-affordability"></span></div>`;
      nodes.buildCards.appendChild(button);
    });
    updateBuildAffordability();
    nodes.buildCards.scrollLeft = preservedScrollLeft;
  }

  function updateBuildAffordability() {
    nodes.buildCards.querySelectorAll(".build-card").forEach((card) => {
      const unit = unitTypes.find((item) => item.id === card.dataset.id);
      if (!unit) return;
      const affordable = state.coins >= unit.cost;
      const missing = Math.max(0, Math.ceil(unit.cost - state.coins));
      const traits = unitTraitText(unit);
      const tacticalSummary = [
        unitKindLabel(unit),
        `${t("roleLabel")}: ${unitRoleText(unit)}`,
        traits ? `${t("traitLabel")}: ${traits}` : "",
        `${t("hp")}: ${unit.hp}`,
        `${t("damage")}: ${unit.damage}`,
        `${t("range")}: ${unit.range}`,
        `${t("attackSpeed")}: ${formatUnitTempo(unit)}`,
        `${t("cost")}: ${unit.cost}`,
        affordable ? t("buildReady") : t("buildNeedCoins", { coins: missing }),
      ].filter(Boolean);
      card.classList.toggle("is-unaffordable", !affordable);
      card.dataset.affordable = String(affordable);
      card.setAttribute("aria-pressed", String(state.selectedBuild === unit.id));
      card.setAttribute("aria-label", `${unitName(unit)}. ${tacticalSummary.join(". ")}`);
      const status = card.querySelector(".build-affordability");
      if (status) status.textContent = affordable ? t("buildReady") : t("buildNeedCoins", { coins: missing });
    });
  }

  function stageWindowLimit() {
    return Math.max(0, STAGE_COUNT - STAGE_CARD_POOL_SIZE);
  }

  function desiredStageWindow(stageId) {
    return Math.max(0, Math.min(stageWindowLimit(), stageId - 1 - Math.floor(STAGE_CARD_POOL_SIZE / 2)));
  }

  function createStageCard(poolIndex) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "stage-card";
    button.dataset.wpStagePoolNode = String(poolIndex + 1);
    button.addEventListener("click", () => {
      const stageId = Number(button.dataset.stageId);
      if (!Number.isInteger(stageId)) return;
      if (button.getAttribute("aria-disabled") === "true") return showToast(t("lockedStage"));
      startStage(stageId);
    });
    return button;
  }

  function bindStageCard(button, stageId) {
    const stage = stages[stageId - 1];
    if (!stage) return;
    const unlocked = stageId <= state.save.bestStage;
    const current = stageId === stageBrowseId;
    const recommended = unlocked && stageId === Math.min(STAGE_COUNT, state.save.bestStage);
    const bestStars = Number(state.save.stars?.[stageId] || 0);
    const status = !unlocked ? t("locked") : bestStars ? t("starRating", { stars: bestStars }) : state.save.clears[stageId] ? t("cleared") : stage.boss ? t("bossStage") : t("stage");
    const rewardText = `+${stage.reward.points} ${t("upgradePoints")} / +${stage.reward.diamonds} ${t("diamonds")}`;
    button.dir = document.documentElement.dir || "ltr";
    button.dataset.stageId = String(stageId);
    button.dataset.stageIndex = String(stageId - 1);
    button.dataset.index = String(stageId - 1);
    button.setAttribute("aria-posinset", String(stageId));
    button.setAttribute("aria-setsize", String(STAGE_COUNT));
    button.setAttribute("aria-keyshortcuts", STAGE_NAV_SHORTCUTS);
    button.setAttribute("aria-disabled", String(!unlocked));
    button.tabIndex = current ? 0 : -1;
    if (current) button.setAttribute("aria-current", "true");
    else button.removeAttribute("aria-current");
    if (recommended) button.dataset.wpStageRecommended = "true";
    else delete button.dataset.wpStageRecommended;
    button.innerHTML = `<strong>${stage.id}. ${localizedValue(stage.name)}</strong><span class="stage-status">${status}</span><span class="stage-intel"><span class="stage-threat"><b>${t("threatIntel")}:</b> ${localizedValue(stage.intel.threat)}</span><span class="stage-plan"><b>${t("recommendedPlan")}:</b> ${localizedValue(stage.intel.plan)}</span></span><span class="stage-meta">${stage.waves} ${t("wave")} · ${stage.boss ? t("boss") : t("guardianRoute")}</span><span class="stage-reward"><b>${t("rewardIntel")}:</b> ${rewardText}</span>`;
  }

  function buildStageCardPool() {
    const count = Math.min(STAGE_CARD_POOL_SIZE, STAGE_COUNT);
    nodes.stageRail.dir = "ltr";
    nodes.stageRail.replaceChildren();
    stageWindowStart = desiredStageWindow(stageBrowseId);
    stageCardPool = Array.from({ length: count }, (_, offset) => {
      const button = createStageCard(offset);
      bindStageCard(button, stageWindowStart + offset + 1);
      nodes.stageRail.append(button);
      return button;
    });
    Object.assign(nodes.stageRail.dataset, {
      wpStageVirtualized: "bounded-recycle",
      wpStagePoolSize: String(count),
      wpStageTotal: String(STAGE_COUNT),
      wpStageRecycleCount: "0",
      wpStageWindowStart: String(stageWindowStart + 1),
      wpStageWindowEnd: String(stageWindowStart + count),
      wpStageCenterObserver: "manual",
    });
  }

  function moveStageWindow(targetStart) {
    const target = Math.max(0, Math.min(stageWindowLimit(), targetStart));
    if (!stageCardPool.length) {
      buildStageCardPool();
      return 0;
    }
    let recycledCount = 0;
    while (stageWindowStart < target) {
      const recycled = nodes.stageRail.firstElementChild;
      const anchor = recycled?.nextElementSibling;
      const before = anchor?.getBoundingClientRect().left;
      stageWindowStart += 1;
      nodes.stageRail.append(recycled);
      bindStageCard(recycled, stageWindowStart + stageCardPool.length);
      recycledCount += 1;
      const after = anchor?.getBoundingClientRect().left;
      if (Number.isFinite(before) && Number.isFinite(after)) nodes.stageRail.scrollLeft += after - before;
    }
    while (stageWindowStart > target) {
      const recycled = nodes.stageRail.lastElementChild;
      const anchor = recycled?.previousElementSibling;
      const before = anchor?.getBoundingClientRect().left;
      stageWindowStart -= 1;
      nodes.stageRail.prepend(recycled);
      bindStageCard(recycled, stageWindowStart + 1);
      recycledCount += 1;
      const after = anchor?.getBoundingClientRect().left;
      if (Number.isFinite(before) && Number.isFinite(after)) nodes.stageRail.scrollLeft += after - before;
    }
    stageCardPool = [...nodes.stageRail.children];
    nodes.stageRail.dataset.wpStageWindowStart = String(stageWindowStart + 1);
    nodes.stageRail.dataset.wpStageWindowEnd = String(stageWindowStart + stageCardPool.length);
    if (recycledCount) nodes.stageRail.dataset.wpStageRecycleCount = String(Number(nodes.stageRail.dataset.wpStageRecycleCount || 0) + recycledCount);
    return recycledCount;
  }

  function ensureStageWindow(stageId) {
    if (!stageCardPool.length || stageCardPool.some((card) => !card.isConnected)) buildStageCardPool();
    moveStageWindow(desiredStageWindow(stageId));
    stageCardPool.forEach((button) => bindStageCard(button, Number(button.dataset.stageId)));
  }

  function stageRailGeometry() {
    const first = stageCardPool[0]?.getBoundingClientRect();
    const second = stageCardPool[1]?.getBoundingClientRect();
    const railRect = nodes.stageRail.getBoundingClientRect();
    const delta = first && second ? (second.left + second.width / 2) - (first.left + first.width / 2) : 0;
    return {
      center: railRect.left + railRect.width / 2,
      pitch: Math.abs(delta) || (first?.width || 264) + 14,
      orientation: Math.sign(delta) || 1,
    };
  }

  function nearestStageCard() {
    const { center } = stageRailGeometry();
    return stageCardPool.reduce((nearest, card) => {
      const box = card.getBoundingClientRect();
      const distance = Math.abs(box.left + box.width / 2 - center);
      return !nearest || distance < nearest.distance ? { card, distance } : nearest;
    }, null)?.card || null;
  }

  function currentStageLogicalPosition() {
    const card = nearestStageCard();
    if (!card) return stageBrowseId - 1;
    const stageId = Number(card.dataset.stageId);
    const box = card.getBoundingClientRect();
    const geometry = stageRailGeometry();
    return Math.max(0, Math.min(STAGE_COUNT - 1, (stageId - 1) + (geometry.center - (box.left + box.width / 2)) / (geometry.pitch * geometry.orientation)));
  }

  function positionStageRail(logicalPosition) {
    const logical = Math.max(0, Math.min(STAGE_COUNT - 1, logicalPosition));
    const anchorIndex = Math.round(logical);
    moveStageWindow(desiredStageWindow(anchorIndex + 1));
    const card = nodes.stageRail.querySelector(`[data-stage-id="${anchorIndex + 1}"]`);
    if (!card) return logical;
    card.scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" });
    const geometry = stageRailGeometry();
    const fraction = logical - anchorIndex;
    if (Math.abs(fraction) > 0.0001) nodes.stageRail.scrollLeft += fraction * geometry.orientation * geometry.pitch;
    nodes.stageRail.dataset.wpStageDragLogical = logical.toFixed(4);
    return logical;
  }

  function syncCenteredStageCard() {
    if (!stageCardPool.length || !nodes.stageRail.getClientRects().length) return null;
    const nearest = nearestStageCard();
    const stageId = Number(nearest?.dataset.stageId);
    if (Number.isInteger(stageId)) stageBrowseId = stageId;
    stageCardPool.forEach((card) => {
      const current = card === nearest;
      card.tabIndex = current ? 0 : -1;
      if (current) card.setAttribute("aria-current", "true");
      else card.removeAttribute("aria-current");
    });
    return nearest;
  }

  function settleStageRail(from, stageId, immediate = false) {
    cancelStageSettlement();
    const target = clampStage(stageId) - 1;
    stageBrowseId = target + 1;
    if (immediate) {
      positionStageRail(target);
      syncCenteredStageCard();
      return;
    }
    const started = performance.now();
    nodes.stageRail.style.setProperty("scroll-behavior", "auto", "important");
    nodes.stageRail.style.setProperty("scroll-snap-type", "none", "important");
    nodes.stageRail.dataset.wpStageSettling = "true";
    const animate = (now) => {
      const progress = Math.max(0, Math.min(1, (now - started) / 340));
      const eased = progress * progress * (3 - 2 * progress);
      positionStageRail(from + (target - from) * eased);
      if (progress < 1) stageSettleFrame = requestAnimationFrame(animate);
      else {
        stageSettleFrame = 0;
        positionStageRail(target);
        syncCenteredStageCard();
        nodes.stageRail.style.removeProperty("scroll-behavior");
        nodes.stageRail.style.removeProperty("scroll-snap-type");
        delete nodes.stageRail.dataset.wpStageSettling;
        nodes.stageRail.dispatchEvent(new CustomEvent("wonder:stage-snap", { detail: { index: target } }));
      }
    };
    stageSettleFrame = requestAnimationFrame(animate);
  }

  function renderStages() {
    stageBrowseId = clampStage(state.save.bestStage);
    ensureStageWindow(stageBrowseId);
    stageCardPool.forEach((button) => bindStageCard(button, Number(button.dataset.stageId)));
    requestAnimationFrame(() => centerStageCard(stageBrowseId));
  }

  function focusCurrentStage() {
    window.requestAnimationFrame(() => nodes.stageRail.querySelector('[aria-current="true"]')?.focus({ preventScroll: true }));
  }

  function centerStageCard(stageId) {
    stageBrowseId = clampStage(stageId);
    ensureStageWindow(stageBrowseId);
    stageCardPool.forEach((button) => bindStageCard(button, Number(button.dataset.stageId)));
    window.requestAnimationFrame(() => settleStageRail(stageBrowseId - 1, stageBrowseId, true));
  }

  function snapStageRailToNearest(behavior = "smooth") {
    const logical = currentStageLogicalPosition();
    settleStageRail(logical, Math.round(logical) + 1, behavior === "auto");
  }

  function installVirtualStageDrag() {
    const rail = nodes.stageRail;
    if (!rail || rail.dataset.wpStageVirtualDrag === "true") return;
    rail.dataset.wpStageVirtualDrag = "true";
    let pointerId = null;
    let startX = 0;
    let lastX = 0;
    let dragLogical = 0;
    let moved = false;
    let suppressClick = false;
    rail.addEventListener("pointerdown", (event) => {
      if (event.isPrimary === false || (event.button !== undefined && event.button !== 0)) return;
      cancelStageSettlement();
      pointerId = event.pointerId;
      startX = lastX = event.clientX;
      dragLogical = currentStageLogicalPosition();
      moved = false;
      rail.style.setProperty("scroll-behavior", "auto", "important");
      rail.style.setProperty("scroll-snap-type", "none", "important");
      rail.dataset.wpDragDown = "1";
      event.stopImmediatePropagation();
    }, true);
    document.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;
      const delta = event.clientX - lastX;
      lastX = event.clientX;
      if (!moved && Math.abs(event.clientX - startX) > 4) {
        moved = true;
        rail.classList.add("wp-stage-dragging");
      }
      if (moved) {
        const rect = rail.getBoundingClientRect();
        const scale = rect.width ? rail.clientWidth / rect.width : 1;
        const pitch = stageRailGeometry().pitch;
        if (event.cancelable) event.preventDefault();
        dragLogical = positionStageRail(dragLogical - delta * scale / pitch);
      }
      event.stopImmediatePropagation();
    }, true);
    const finish = (event) => {
      if (pointerId === null || (event.pointerId !== undefined && event.pointerId !== pointerId)) return;
      pointerId = null;
      rail.dataset.wpDragDown = "0";
      rail.classList.remove("wp-stage-dragging");
      if (moved) {
        if (event.cancelable) event.preventDefault();
        const from = dragLogical;
        settleStageRail(from, Math.round(from) + 1);
        suppressClick = true;
        setTimeout(() => { suppressClick = false; }, 0);
      } else {
        rail.style.removeProperty("scroll-behavior");
        rail.style.removeProperty("scroll-snap-type");
      }
      moved = false;
      event.stopImmediatePropagation();
    };
    document.addEventListener("pointerup", finish, true);
    document.addEventListener("pointercancel", finish, true);
    rail.addEventListener("click", (event) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
  }

  function unitRoleText(unit) {
    if (!unit) return t("unitSupport");
    return localizedValue(unit.note) || t("unitSupport");
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
    if (unit.bounce) traits.push(t("traitBounce", { count: unit.bounce }));
    if (unit.bossDamage) traits.push(t("traitBoss", { percent: Math.round(unit.bossDamage * 100) }));
    return traits.join(" | ");
  }

  function renderSelectedInfo() {
    if (state.selectedDefender) {
      const d = state.selectedDefender;
      const unit = unitTypes.find((item) => item.id === d.type);
      const traits = unitTraitText(unit);
      nodes.selectedInfo.innerHTML = `<strong>${d.name}</strong><span>${t("roleLabel")}: ${unitRoleText(unit)}</span>${traits ? `<span>${t("traitLabel")}: ${traits}</span>` : ""}<span>${battleLevelText(d.level)} | ${t("hp")}: ${Math.ceil(d.hp)}/${d.maxHp}</span><span>${t("damage")}: ${Math.ceil(d.damage)} | ${t("range")}: ${d.range} | ${t("attackSpeed")}: ${formatUnitTempo(unit || d)}</span><span>${t("selectedActionInfo", { upgrade: upgradeCost(d), sell: sellRefund(d) })}</span>`;
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

  function techEffectPreview(tech, level) {
    const nextLevel = Math.min(tech.max, level + 1);
    if (tech.id === "power") return t("techPowerEffect", { current: level * 10, next: nextLevel * 10 });
    if (tech.id === "bulwark") return t("techBulwarkEffect", { current: level * 12, next: nextLevel * 12 });
    return t("techEconomyEffect", { current: level * 20, next: nextLevel * 20 });
  }

  function renderTech() {
    nodes.techGrid.innerHTML = "";
    techs.forEach((tech) => {
      const level = state.save.tech[tech.id] || 0;
      const card = document.createElement("div");
      card.className = "tech-card";
      const canBuy = level < tech.max && state.save.upgradePoints >= tech.cost;
      card.innerHTML = `<strong>${t(tech.label)} — ${techLevelText(level)} / ${tech.max}</strong><span>${t(tech.desc)}</span>`;
      const button = document.createElement("button");
      button.type = "button";
      button.className = canBuy ? "primary-btn" : "secondary-btn";
      button.disabled = !canBuy;
      button.dataset.techId = tech.id;
      button.textContent = t("techBuy");
      const labelData = {
        name: t(tech.label),
        current: level,
        next: Math.min(tech.max, level + 1),
        max: tech.max,
        effect: techEffectPreview(tech, level),
        cost: tech.cost,
        balance: state.save.upgradePoints,
        result: Math.max(0, state.save.upgradePoints - tech.cost),
      };
      button.setAttribute("aria-label", level >= tech.max
        ? techLevelLabel("techMaxLabel", labelData)
        : canBuy
          ? techLevelLabel("techBuyLabel", labelData)
          : techLevelLabel("techNeedLabel", labelData));
      button.addEventListener("keydown", (event) => {
        if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
      });
      button.addEventListener("click", (event) => {
        if (!canBuy) return;
        const restoreKeyboardFocus = event.detail === 0;
        clearGoldenFrameConfirmation();
        state.save.upgradePoints -= tech.cost;
        state.save.tech[tech.id] = level + 1;
        save();
        renderTech();
        if (restoreKeyboardFocus) window.requestAnimationFrame(() => nodes.techGrid.querySelector(`[data-tech-id="${tech.id}"]`)?.focus({ preventScroll: true }));
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
    button.dataset.cosmeticId = "goldenFrame";
    button.className = canBuyFrame ? "primary-btn" : "secondary-btn";
    button.disabled = owned || !canBuyFrame;
    const resultingBalance = Math.max(0, state.save.diamonds - 15);
    button.textContent = owned
      ? t("goldenFrameOwned")
      : goldenFrameConfirmPending
        ? t("goldenFrameConfirm", { balance: state.save.diamonds, result: resultingBalance })
        : t("goldenFrameBuy");
    button.classList.toggle("is-confirming", goldenFrameConfirmPending && !owned);
    button.setAttribute("aria-label", goldenFrameConfirmPending
      ? t("goldenFrameConfirmLabel", { balance: state.save.diamonds, result: resultingBalance })
      : `${t("goldenFrame")}. ${t("goldenFrameDesc")}`);
    button.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
    });
    button.addEventListener("click", buyGoldenFrame);
    card.appendChild(button);
    nodes.techGrid.appendChild(card);
  }

  function clearGoldenFrameConfirmation() {
    clearTimeout(goldenFrameConfirmTimer);
    goldenFrameConfirmTimer = 0;
    goldenFrameConfirmDueAt = 0;
    goldenFrameConfirmRemaining = 0;
    goldenFrameConfirmPending = false;
  }

  function armGoldenFrameConfirmation(delay = 5000) {
    clearTimeout(goldenFrameConfirmTimer);
    goldenFrameConfirmRemaining = Math.max(1, delay);
    goldenFrameConfirmDueAt = performance.now() + goldenFrameConfirmRemaining;
    goldenFrameConfirmTimer = setTimeout(() => {
      if (!goldenFrameConfirmPending) return;
      clearGoldenFrameConfirmation();
      renderTech();
    }, goldenFrameConfirmRemaining);
  }

  function buyGoldenFrame() {
    state.save.cosmetics = { goldenFrame: false, ...(state.save.cosmetics || {}) };
    if (state.save.cosmetics.goldenFrame) return;
    if (state.save.diamonds < 15) return showToast(t("noDiamonds"));
    if (!goldenFrameConfirmPending) {
      goldenFrameConfirmPending = true;
      armGoldenFrameConfirmation();
      renderTech();
      window.requestAnimationFrame(() => nodes.techGrid.querySelector('[data-cosmetic-id="goldenFrame"]')?.focus({ preventScroll: true }));
      return;
    }
    const transferFocus = document.activeElement?.dataset?.cosmeticId === "goldenFrame";
    clearGoldenFrameConfirmation();
    state.save.diamonds -= 15;
    state.save.cosmetics.goldenFrame = true;
    save();
    renderTech();
    if (transferFocus) nodes.equipmentTabBtn?.focus({ preventScroll: true });
    playSfx("unlock");
    track("game_spend_virtual_currency", { stage: state.currentStage, item: "golden_defender_frame", currency: "diamonds", amount: 15 });
  }

  function startStage(id) {
    clearReviveConfirmation();
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
    window.requestAnimationFrame(() => nodes.canvas.focus({ preventScroll: true }));
    track("game_start", { stage: id });
  }

  function updateHud() {
    if (!nodes.stageHudText) return;
    nodes.stageHudText.textContent = state.stage ? `${state.currentStage}/${STAGE_COUNT}` : "-";
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
    const nextSpeed = state.speed === 1 ? "2x" : state.speed === 2 ? "3x" : t("paused");
    nodes.speedBtn.setAttribute("aria-label", state.paused
      ? t("speedPausedDecision")
      : t("speedDecision", { current: `${state.speed}x`, next: nextSpeed }));
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
    if (state.locale === "es") return stage.bossNameEs || stage.bossName || t("boss");
    return localizedValue(stage.bossNames) || stage.bossName || t("boss");
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

  function hideToast() {
    clearTimeout(toastTimer);
    toastPending = false;
    toastTimer = 0;
    toastDueAt = 0;
    toastRemaining = 0;
    nodes.toast.classList.add("is-hidden");
    nodes.toast.textContent = "";
  }

  function armToastTimer(duration) {
    toastRemaining = Math.max(1, duration);
    if (document.hidden || !battleWindowFocused) return;
    toastDueAt = performance.now() + toastRemaining;
    toastTimer = setTimeout(hideToast, toastRemaining);
  }

  function showToast(message, duration = 1600) {
    clearTimeout(toastTimer);
    toastPending = true;
    toastTimer = 0;
    toastDueAt = 0;
    toastRemaining = 0;
    nodes.toast.textContent = message;
    nodes.toast.classList.remove("is-hidden");
    armToastTimer(duration);
  }

  function suspendToastFeedback() {
    if (!toastPending || !toastTimer) return;
    toastRemaining = Math.max(1, toastDueAt - performance.now());
    clearTimeout(toastTimer);
    toastTimer = 0;
    toastDueAt = 0;
  }

  function resumeToastFeedback() {
    if (!toastPending || toastTimer || document.hidden || !battleWindowFocused) return;
    armToastTimer(toastRemaining || 1600);
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
    return isInside(tile) && !sameTile(tile, currentStartTile()) && !sameTile(tile, currentCoreTile()) && !defenderAt(tile);
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
      bounce: unit.bounce || 0,
      bounceRatio: unit.bounceRatio || 0,
      bossDamage: unit.bossDamage || 0,
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
    addFloatingText(tileToPoint(d.tile), `↑ ${battleLevelText(d.level)}`, "#fef08a");
    showToast(`${d.name} ↑ ${battleLevelText(d.level)}`);
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
    if (!state.stage || state.runningWave || state.gameOver || state.nextWaveTimer > 0) return;
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
    const positionInArc = (stage.id - 1) % 5;
    const base = 4 + stage.arc * 2 + wave + Math.floor(positionInArc / 2);
    return base + (stage.boss && wave === stage.waves ? 1 : 0);
  }

  function enemyTypeForSpawn(stage, wave, spawnIndex, total, isBoss) {
    if (isBoss) return "boss";
    const remainingBeforeBoss = total - spawnIndex - 1;
    if (stage.boss && wave === stage.waves && remainingBeforeBoss <= stage.finalEscortCount) {
      return remainingBeforeBoss % 2 === 0 ? "boar" : "bat";
    }
    const mix = (spawnIndex + wave + stage.id + stage.threat) % 6;
    if (stage.mechanic === "flying") return mix <= 2 ? "bat" : mix === 3 ? "boar" : "wolf";
    if (stage.mechanic === "armor") return mix <= 2 ? "boar" : mix === 3 ? "bat" : "wolf";
    if (stage.mechanic === "regrowth") return mix <= 2 ? "wolf" : mix <= 4 ? "boar" : "bat";
    if (stage.mechanic === "surge") return mix % 2 === 0 ? "bat" : "boar";
    if (stage.mechanic === "eclipse") return ["wolf", "boar", "bat"][mix % 3];
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
      mechanic: stage.mechanic,
      bossAbility: stage.bossAbility,
      finalEscortCount: stage.finalEscortCount,
      spawnCadence: stage.spawnCadence,
    };
  }

  function spawnEnemy() {
    const isBoss = state.stage.boss && state.wave === state.stage.waves && state.waveSpawned === state.waveToSpawn - 1;
    const type = enemyTypeForSpawn(state.stage, state.wave, state.waveSpawned, state.waveToSpawn, isBoss);
    const hpScale = isBoss ? state.stage.bossHpScale : type === "boar" ? 1.75 : type === "bat" ? 0.82 : 1;
    const speedScale = isBoss ? 0.58 : type === "bat" ? 1.35 : type === "boar" ? 0.72 : 1;
    const maxHp = state.stage.enemyHp * hpScale;
    const armored = state.stage.mechanic === "armor" || state.stage.mechanic === "eclipse" || state.stage.bossAbility === "armor";
    const regenerative = state.stage.mechanic === "regrowth" || state.stage.mechanic === "eclipse" || state.stage.bossAbility === "regrowth";
    const surging = state.stage.mechanic === "surge" || state.stage.mechanic === "eclipse" || state.stage.bossAbility === "haste" || state.stage.bossAbility === "phase";
    const enemy = {
      id: `e-${Date.now()}-${Math.random()}`,
      type,
      img: isBoss ? "boss" : type,
      sheet: "",
      tile: { ...currentStartTile() },
      pos: tileToPoint(currentStartTile()),
      hp: maxHp,
      maxHp,
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
      bossAbility: isBoss ? state.stage.bossAbility : "",
      flying: type === "bat",
      slow: 0,
      guardHp: armored ? maxHp * (isBoss ? 0.5 : 0.24) : 0,
      regenRate: regenerative ? maxHp * (isBoss ? 0.018 : 0.008) : 0,
      surgeReady: surging,
      surged: false,
      phaseStep: 0,
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

  function spawnBossSupport(type) {
    const hpScale = type === "boar" ? 1.45 : type === "bat" ? 0.72 : 0.9;
    const speedScale = type === "bat" ? 1.42 : type === "boar" ? 0.78 : 1.08;
    const maxHp = state.stage.enemyHp * hpScale;
    const enemy = {
      id: `support-${Date.now()}-${Math.random()}`,
      type,
      img: type,
      sheet: "",
      tile: { ...currentStartTile() },
      pos: tileToPoint(currentStartTile()),
      hp: maxHp,
      maxHp,
      speed: state.stage.enemySpeed * speedScale,
      damage: type === "boar" ? 20 : 12 + state.currentStage,
      attackCd: 0,
      path: [],
      pathIndex: 0,
      targetDefender: null,
      animTime: Math.random() * 0.4,
      actionPulse: 0,
      actionFrame: 0,
      hitPulse: 0,
      boss: false,
      bossAbility: "",
      flying: type === "bat",
      slow: 0,
      guardHp: state.stage.mechanic === "armor" || state.stage.mechanic === "eclipse" ? maxHp * 0.2 : 0,
      regenRate: state.stage.mechanic === "regrowth" || state.stage.mechanic === "eclipse" ? maxHp * 0.007 : 0,
      surgeReady: state.stage.mechanic === "surge" || state.stage.mechanic === "eclipse",
      surged: false,
      phaseStep: 0,
    };
    setEnemyPath(enemy);
    state.enemies.push(enemy);
    addSkillEffect(enemy.pos, skillFxFrames.bossPortal, 0.9, 0.45);
    return enemy;
  }

  function damageEnemy(enemy, amount) {
    let remaining = Math.max(0, Number(amount) || 0);
    if (enemy.guardHp > 0) {
      const absorbed = Math.min(enemy.guardHp, remaining);
      enemy.guardHp -= absorbed;
      remaining -= absorbed;
      if (absorbed > 0) addFloatingText(enemy.pos, `-${Math.ceil(absorbed)}`, "#8ee8ff");
    }
    enemy.hp -= remaining;
    return remaining;
  }

  function triggerBossPhase(enemy, supportTypes = []) {
    enemy.phaseStep += 1;
    supportTypes.forEach(spawnBossSupport);
    showToast(t("bossPhase", { boss: localizedBossName(state.stage) || t("boss") }));
    addSkillEffect(enemy.pos, skillFxFrames.bossPortal, 1.5, 0.7);
    triggerImpactFeedback(9, 0.3, "126, 249, 255");
    playSfx("boss");
  }

  function updateEnemySpecial(enemy, dt) {
    const hpRatioBefore = enemy.hp / Math.max(1, enemy.maxHp);
    if (enemy.regenRate > 0 && enemy.hp > 0 && enemy.hp < enemy.maxHp) {
      enemy.hp = Math.min(enemy.maxHp, enemy.hp + enemy.regenRate * dt);
    }
    if (enemy.surgeReady && !enemy.surged && enemy.hp <= enemy.maxHp * 0.5) {
      enemy.surged = true;
      enemy.speed *= enemy.boss ? 1.28 : 1.42;
      enemy.damage *= enemy.boss ? 1.18 : 1.1;
      addSkillEffect(enemy.pos, skillFxFrames.gear, enemy.boss ? 1.35 : 0.85, 0.55);
    }
    if (!enemy.boss) return;
    if (enemy.bossAbility === "summon" && enemy.phaseStep === 0 && hpRatioBefore <= 0.62) {
      triggerBossPhase(enemy, ["wolf", "bat"]);
    } else if (enemy.bossAbility === "armor" && enemy.phaseStep === 0 && hpRatioBefore <= 0.55) {
      enemy.guardHp += enemy.maxHp * 0.35;
      triggerBossPhase(enemy);
    } else if (enemy.bossAbility === "regrowth" && enemy.phaseStep === 0 && hpRatioBefore <= 0.5) {
      enemy.hp = Math.min(enemy.maxHp, enemy.hp + enemy.maxHp * 0.2);
      triggerBossPhase(enemy, ["wolf"]);
    } else if (enemy.bossAbility === "haste" && enemy.phaseStep === 0 && hpRatioBefore <= 0.58) {
      state.enemies.filter((other) => other !== enemy).forEach((other) => { other.speed *= 1.25; });
      triggerBossPhase(enemy, ["bat", "bat"]);
    } else if (enemy.bossAbility === "phase") {
      if (enemy.phaseStep === 0 && hpRatioBefore <= 0.67) triggerBossPhase(enemy, ["bat", "bat"]);
      else if (enemy.phaseStep === 1 && hpRatioBefore <= 0.34) {
        enemy.guardHp += enemy.maxHp * 0.22;
        triggerBossPhase(enemy, ["boar", "wolf"]);
      }
    }
  }

  function findPath(ignoreBlockers = false) {
    return findPathFrom(currentStartTile(), ignoreBlockers);
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
      if (sameTile(current, currentCoreTile())) {
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
        if (!sameTile(next, currentCoreTile()) && !sameTile(next, currentStartTile()) && blocked.has(nextKey)) return;
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
      const start = currentStartTile();
      const core = currentCoreTile();
      enemy.path = [start, { x: Math.round((start.x + core.x) / 2), y: 2 }, { x: Math.round((start.x + core.x) / 2), y: 5 }, core];
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
    battleHudElapsed += dt;
    if (battleHudElapsed >= 0.1) {
      battleHudElapsed = 0;
      updateHud();
    }
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

  function suspendUnattendedBattle(reason) {
    cancelCanvasPress();
    if (state.screen === "game" && !state.gameOver && !state.paused) {
      state.paused = true;
      track("game_speed_change", { stage: state.currentStage, speed: state.speed, paused: true, reason });
      updateHud();
    }
    syncBattleLoop();
  }

  function suspendTransactionConfirmations() {
    const now = performance.now();
    if (goldenFrameConfirmPending && goldenFrameConfirmTimer) {
      goldenFrameConfirmRemaining = Math.max(1, goldenFrameConfirmDueAt - now);
      clearTimeout(goldenFrameConfirmTimer);
      goldenFrameConfirmTimer = 0;
      goldenFrameConfirmDueAt = 0;
    }
    if (reviveConfirmPending && reviveConfirmTimer) {
      reviveConfirmRemaining = Math.max(1, reviveConfirmDueAt - now);
      clearTimeout(reviveConfirmTimer);
      reviveConfirmTimer = 0;
      reviveConfirmDueAt = 0;
    }
    if (state.resultReward?.rerollPending && rewardRerollConfirmTimer) {
      rewardRerollConfirmRemaining = Math.max(1, rewardRerollConfirmDueAt - now);
      clearTimeout(rewardRerollConfirmTimer);
      rewardRerollConfirmTimer = 0;
      rewardRerollConfirmDueAt = 0;
    }
  }

  function resumeTransactionConfirmations() {
    if (document.hidden || !battleWindowFocused) return;
    if (goldenFrameConfirmPending && !goldenFrameConfirmTimer) armGoldenFrameConfirmation(goldenFrameConfirmRemaining || 5000);
    if (reviveConfirmPending && !reviveConfirmTimer) armReviveConfirmation(reviveConfirmRemaining || 5000);
    if (state.resultReward?.rerollPending && !rewardRerollConfirmTimer) armRewardRerollConfirmation(rewardRerollConfirmRemaining || 5000);
  }

  function handleBattleVisibilityChange() {
    if (document.hidden) {
      suspendTransactionConfirmations();
      suspendToastFeedback();
      suspendUnattendedBattle("page_hidden");
    } else {
      resumeTransactionConfirmations();
      resumeToastFeedback();
      syncBattleLoop();
    }
  }

  function setBattleDecisionCoverage(covered) {
    nodes.gamePanel.querySelectorAll(":scope > .hud-row, :scope > .boss-panel, :scope > .battle-layout, :scope > .command-row").forEach((layer) => {
      layer.inert = covered;
      if (covered) layer.setAttribute("aria-hidden", "true");
      else layer.removeAttribute("aria-hidden");
    });
  }

  function renderPauseDecision() {
    if (!nodes.pauseDecisionPanel) return;
    nodes.pauseDecisionTitle.textContent = t("pauseDecisionTitle", { stage: state.currentStage });
    nodes.pauseDecisionText.textContent = t("pauseDecisionText", { stage: state.currentStage });
    nodes.pauseContinueBtn.textContent = t("continueBattle");
    nodes.pauseLeaveBtn.textContent = t("returnToStages");
  }

  function clearLeaveBattleConfirmation(restoreBattle = true) {
    if (!leaveBattleConfirmPending) return;
    leaveBattleConfirmPending = false;
    nodes.pauseDecisionPanel.classList.add("is-hidden");
    setBattleDecisionCoverage(false);
    if (restoreBattle && state.screen === "game" && !state.gameOver) {
      state.paused = leaveBattleWasPaused;
      updateHud();
      window.requestAnimationFrame(() => nodes.menuBtn.focus({ preventScroll: true }));
    }
    syncBattleLoop();
  }

  function requestLeaveBattle() {
    if (leaveBattleConfirmPending || state.screen !== "game" || state.gameOver) return;
    leaveBattleWasPaused = state.paused;
    state.paused = true;
    leaveBattleConfirmPending = true;
    renderPauseDecision();
    setBattleDecisionCoverage(true);
    nodes.pauseDecisionPanel.classList.remove("is-hidden");
    updateHud();
    syncBattleLoop();
    window.requestAnimationFrame(() => nodes.pauseContinueBtn.focus({ preventScroll: true }));
  }

  function leaveBattleForStages() {
    clearLeaveBattleConfirmation(false);
    setScreen("stages");
    renderStages();
    focusCurrentStage();
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
      if (target.boss && d.bossDamage) damage *= 1 + d.bossDamage;
      const healthDamage = damageEnemy(target, damage);
      target.hitPulse = Math.max(target.hitPulse || 0, target.boss ? 0.28 : 0.22);
      if (healthDamage > 0) addFloatingText(target.pos, `-${Math.ceil(healthDamage)}`, target.boss ? "#ffd166" : "#fff3bd");
      if (d.splash) {
        state.enemies
          .filter((enemy) => enemy !== target && enemy.hp > 0 && tileDistance(enemy.tile, target.tile) <= d.splash)
          .forEach((enemy) => {
            const splashDamage = damage * 0.48;
            const splashHealthDamage = damageEnemy(enemy, splashDamage);
            enemy.hitPulse = Math.max(enemy.hitPulse || 0, enemy.boss ? 0.24 : 0.18);
            enemy.slow = Math.max(enemy.slow, d.slow || 0);
            addSkillEffect(enemy.pos, skillFxFrames.slow, enemy.boss ? 1.15 : 0.82, 0.38);
            if (splashHealthDamage > 0) addFloatingText(enemy.pos, `-${Math.ceil(splashHealthDamage)}`, "#93f7ff");
          });
      }
      if (d.slow) target.slow = Math.max(target.slow, d.slow);
      if (d.bounce) {
        const struck = new Set([target]);
        let previous = target;
        let bounceDamage = damage * (d.bounceRatio || 0.6);
        for (let hop = 0; hop < d.bounce; hop += 1) {
          const next = state.enemies
            .filter((enemy) => enemy.hp > 0 && !struck.has(enemy) && tileDistance(enemy.tile, previous.tile) <= 2.35)
            .sort((a, b) => tileDistance(a.tile, previous.tile) - tileDistance(b.tile, previous.tile))[0];
          if (!next) break;
          struck.add(next);
          const bouncedHealthDamage = damageEnemy(next, bounceDamage);
          next.hitPulse = Math.max(next.hitPulse || 0, 0.2);
          state.shots.push({ from: { ...previous.pos }, to: { ...next.pos }, life: 0.16, max: 0.16, color: "#bca7ff", width: 4 });
          addSkillEffect(next.pos, skillFxFrames.gear, 0.9, 0.38);
          if (bouncedHealthDamage > 0) addFloatingText(next.pos, `-${Math.ceil(bouncedHealthDamage)}`, "#d8c8ff");
          previous = next;
          bounceDamage *= 0.68;
        }
      }
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
      updateEnemySpecial(enemy, dt);
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
      const slowResistance = state.stage?.mechanic === "eclipse" ? 0.5 : 0;
      const effectiveSlow = enemy.slow * (1 - slowResistance);
      const speed = enemy.speed * (effectiveSlow ? 1 - effectiveSlow : 1);
      enemy.slow = Math.max(0, enemy.slow - dt * 0.35);
      const dx = targetPoint.x - enemy.pos.x;
      const dy = targetPoint.y - enemy.pos.y;
      const dist = Math.hypot(dx, dy);
      const move = speed * dt;
      if (dist <= move) {
        enemy.pos = targetPoint;
        enemy.tile = { ...targetTile };
        enemy.pathIndex += 1;
        if (sameTile(enemy.tile, currentCoreTile())) {
          state.coreHp -= enemy.boss ? 35 : 6 + Math.ceil(Math.min(state.currentStage, 18) * 0.32);
          enemy.hp = 0;
          addSkillEffect(tileToPoint(currentCoreTile()), enemy.boss ? skillFxFrames.bossPortal : skillFxFrames.heroStrike, enemy.boss ? 1.45 : 1, 0.55);
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
      enemy.attackCd = enemy.bossAbility === "siege" ? 0.52 : enemy.boss ? 0.72 : 1.05;
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
    const core = tileToPoint(currentCoreTile());
    const message = t("waveClearFeedback", { wave: state.wave });
    addSkillEffect(core, skillFxFrames.heal, 1.18, 0.52);
    addFloatingText(core, message, "#9fffd0");
    showToast(message);
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

  function resultTacticalPlan(won, stars = 0, coreHp = state.coreHp, stage = state.stage) {
    if (!won) return t("resultPlanLose");
    const corePercent = Math.max(0, Math.min(100, Math.round((Math.max(0, coreHp) / Math.max(1, stage?.coreHp || 1)) * 100)));
    const key = stars >= 3 ? "resultPlanWin3" : stars >= 2 ? "resultPlanWin2" : "resultPlanWin1";
    return t(key, { stars, core: corePercent });
  }

  function ensureResultActionStructure() {
    const actions = nodes.nextStageBtn.closest(".result-actions");
    if (!actions) return;
    let rewardActions = actions.querySelector(".result-reward-actions");
    let navActions = actions.querySelector(".result-nav-actions");
    if (!rewardActions) {
      rewardActions = document.createElement("div");
      rewardActions.className = "result-reward-actions";
      actions.append(rewardActions);
    }
    if (!navActions) {
      navActions = document.createElement("div");
      navActions.className = "result-nav-actions";
      actions.append(navActions);
    }
    rewardActions.append(nodes.rerollRewardBtn, nodes.reviveBtn);
    navActions.append(nodes.resultMenuBtn, nodes.nextStageBtn, nodes.retryBtn);
  }

  function syncResultActionHierarchy() {
    ensureResultActionStructure();
    const nextAvailable = !nodes.nextStageBtn.disabled;
    const primaryAction = nextAvailable
      ? nodes.nextStageBtn
      : nodes.resultMenuBtn;
    [nodes.nextStageBtn, nodes.retryBtn, nodes.resultMenuBtn].forEach((button) => {
      const isPrimary = button === primaryAction;
      button.classList.toggle("primary-btn", isPrimary);
      button.classList.toggle("secondary-btn", !isPrimary);
    });
    [nodes.rerollRewardBtn, nodes.reviveBtn].forEach((button) => {
      button.classList.remove("primary-btn");
      button.classList.add("secondary-btn");
    });
    return primaryAction;
  }

  function commitResultDecision(action) {
    if (resultDecisionCommitted || state.screen !== "result" || nodes.resultPanel.classList.contains("is-hidden")) return false;
    resultDecisionCommitted = true;
    action();
    return true;
  }

  function tileDistance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function winStage() {
    state.gameOver = true;
    state.won = true;
    const stage = state.stage;
    const previousBestStage = state.save.bestStage;
    state.save.bestStage = Math.max(state.save.bestStage, Math.min(STAGE_COUNT, stage.id + 1));
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
      newlyUnlocked: stage.id < STAGE_COUNT && previousBestStage < stage.id + 1,
      rerolled: false,
      rerollPending: false,
    };
    save();
    nodes.resultTitle.textContent = t("victory");
    nodes.resultText.textContent = t("victoryText", { stage: stage.id });
    nodes.resultStars.textContent = t("starRating", { stars });
    nodes.resultPlanText.textContent = resultTacticalPlan(true, stars, state.coreHp, stage);
    nodes.nextStageBtn.classList.remove("is-hidden");
    nodes.nextStageBtn.disabled = stage.id >= STAGE_COUNT;
    nodes.reviveBtn.classList.add("is-hidden");
    renderResultReward();
    resultDecisionCommitted = false;
    setScreen("result");
    playSfx("victory");
    track("game_complete", { stage: stage.id, core_hp: Math.max(0, Math.ceil(state.coreHp)), waves: stage.waves, stars });
  }

  function loseStage() {
    if (state.gameOver) return;
    clearReviveConfirmation();
    state.gameOver = true;
    state.won = false;
    nodes.resultTitle.textContent = t("defeat");
    nodes.resultText.textContent = t("defeatText");
    nodes.resultStars.textContent = "";
    nodes.resultRewardText.textContent = "";
    nodes.resultProgressText.textContent = "";
    nodes.resultUnlockText.textContent = "";
    nodes.rerollRewardBtn.classList.add("is-hidden");
    nodes.reviveBtn.classList.toggle("is-hidden", state.revived);
    nodes.reviveBtn.disabled = state.revived || state.save.diamonds < 5;
    nodes.resultPlanText.textContent = resultTacticalPlan(false);
    nodes.nextStageBtn.classList.remove("is-hidden");
    nodes.nextStageBtn.disabled = true;
    resultDecisionCommitted = false;
    setScreen("result");
    playSfx("defeat");
    track("game_fail", { stage: state.currentStage, wave: state.wave, core_hp: Math.max(0, Math.ceil(state.coreHp)) });
  }

  function reviveCore() {
    if (state.coreHp > 0 || state.revived) return;
    if (state.save.diamonds < 5) {
      clearReviveConfirmation();
      return showToast(t("noDiamonds"));
    }
    if (!reviveConfirmPending) {
      reviveConfirmPending = true;
      armReviveConfirmation();
      renderReviveAction();
      window.requestAnimationFrame(() => nodes.reviveBtn.focus({ preventScroll: true }));
      return;
    }
    clearReviveConfirmation();
    state.save.diamonds -= 5;
    state.coreHp = 35;
    state.gameOver = false;
    state.revived = true;
    state.coreCriticalShown = false;
    save();
    showToast(t("reviveUsed"));
    setScreen("game");
    window.requestAnimationFrame(() => nodes.canvas.focus({ preventScroll: true }));
    playSfx("revive");
    track("game_spend_virtual_currency", { stage: state.currentStage, item: "core_revive", currency: "diamonds", amount: 5 });
  }

  function renderReviveAction() {
    const resultingBalance = Math.max(0, state.save.diamonds - 5);
    nodes.reviveBtn.textContent = reviveConfirmPending
      ? t("reviveConfirm", { balance: state.save.diamonds, result: resultingBalance })
      : t("revive");
    nodes.reviveBtn.classList.toggle("is-confirming", reviveConfirmPending);
    nodes.reviveBtn.setAttribute("aria-label", reviveConfirmPending
      ? t("reviveConfirmLabel", { balance: state.save.diamonds, result: resultingBalance })
      : t("revive"));
  }

  function clearReviveConfirmation() {
    clearTimeout(reviveConfirmTimer);
    reviveConfirmTimer = 0;
    reviveConfirmDueAt = 0;
    reviveConfirmRemaining = 0;
    reviveConfirmPending = false;
    renderReviveAction();
  }

  function armReviveConfirmation(delay = 5000) {
    clearTimeout(reviveConfirmTimer);
    reviveConfirmRemaining = Math.max(1, delay);
    reviveConfirmDueAt = performance.now() + reviveConfirmRemaining;
    reviveConfirmTimer = setTimeout(() => {
      if (!reviveConfirmPending) return;
      clearReviveConfirmation();
    }, reviveConfirmRemaining);
  }

  function rerollRewardPoints(stageId, currentPoints) {
    return Math.min(3, currentPoints + 1 + (stageId % 2));
  }

  function renderResultReward() {
    const reward = state.resultReward;
    if (!reward) {
      nodes.resultRewardText.textContent = "";
      nodes.resultProgressText.textContent = "";
      nodes.resultUnlockText.textContent = "";
      nodes.rerollRewardBtn.classList.add("is-hidden");
      return;
    }
    nodes.resultRewardText.textContent = t(reward.rerolled ? "rewardRerolled" : "rewardSummary", {
      points: reward.points,
      diamonds: reward.diamonds,
    });
    const rerolledPoints = rerollRewardPoints(reward.stageId, reward.points);
    const pointGain = Math.max(0, rerolledPoints - reward.points);
    const resultingBalance = Math.max(0, state.save.diamonds - 3);
    nodes.resultProgressText.textContent = reward.rerollPending
      ? t("rerollRewardPreview", { points: pointGain, balance: state.save.diamonds, result: resultingBalance })
      : state.save.diamonds < 3 && !reward.rerolled
        ? t("rerollRewardNeed", { points: state.save.upgradePoints, diamonds: state.save.diamonds })
        : t("savedProgress", { points: state.save.upgradePoints, diamonds: state.save.diamonds });
    if (reward.stageId >= STAGE_COUNT) {
      nodes.resultUnlockText.textContent = t("campaignComplete");
    } else {
      const nextStage = stages[reward.stageId];
      nodes.resultUnlockText.textContent = t(reward.newlyUnlocked ? "newRouteUnlocked" : "nextRouteReady", {
        stage: nextStage.id,
        name: localizedValue(nextStage.name),
      });
    }
    nodes.rerollRewardBtn.classList.remove("is-hidden");
    nodes.rerollRewardBtn.disabled = reward.rerolled || state.save.diamonds < 3;
    nodes.rerollRewardBtn.textContent = reward.rerolled
      ? t("rewardRerollUsed")
      : reward.rerollPending
        ? t("rerollRewardConfirm", { points: pointGain })
        : t("rerollReward");
    nodes.rerollRewardBtn.classList.toggle("is-confirming", Boolean(reward.rerollPending && !reward.rerolled));
    nodes.rerollRewardBtn.setAttribute("aria-label", reward.rerollPending
      ? t("rerollRewardPreview", { points: pointGain, balance: state.save.diamonds, result: resultingBalance })
      : nodes.resultProgressText.textContent);
  }

  function clearRewardRerollConfirmation() {
    clearTimeout(rewardRerollConfirmTimer);
    rewardRerollConfirmTimer = 0;
    rewardRerollConfirmDueAt = 0;
    rewardRerollConfirmRemaining = 0;
    if (state.resultReward) state.resultReward.rerollPending = false;
  }

  function armRewardRerollConfirmation(delay = 5000) {
    clearTimeout(rewardRerollConfirmTimer);
    rewardRerollConfirmRemaining = Math.max(1, delay);
    rewardRerollConfirmDueAt = performance.now() + rewardRerollConfirmRemaining;
    rewardRerollConfirmTimer = setTimeout(() => {
      if (!state.resultReward?.rerollPending) return;
      clearRewardRerollConfirmation();
      renderResultReward();
    }, rewardRerollConfirmRemaining);
  }

  function rerollReward() {
    const reward = state.resultReward;
    if (!reward || reward.rerolled) return;
    if (state.save.diamonds < 3) {
      renderResultReward();
      return showToast(t("noDiamonds"));
    }
    const newPoints = rerollRewardPoints(reward.stageId, reward.points);
    const deltaPoints = Math.max(0, newPoints - reward.points);
    if (!reward.rerollPending) {
      reward.rerollPending = true;
      armRewardRerollConfirmation();
      renderResultReward();
      return;
    }
    clearRewardRerollConfirmation();
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
    if (assets.bg?.complete) drawImageCover(assets.bg);
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

  function drawImageCover(image) {
    const canvasRatio = nodes.canvas.width / nodes.canvas.height;
    const imageRatio = image.naturalWidth / image.naturalHeight;
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = image.naturalWidth;
    let sourceHeight = image.naturalHeight;
    if (imageRatio > canvasRatio) {
      sourceWidth = image.naturalHeight * canvasRatio;
      sourceX = (image.naturalWidth - sourceWidth) / 2;
    } else {
      sourceHeight = image.naturalWidth / canvasRatio;
      sourceY = (image.naturalHeight - sourceHeight) / 2;
    }
    ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, nodes.canvas.width, nodes.canvas.height);
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
    const start = currentStartTile();
    const core = currentCoreTile();
    for (let y = 0; y < grid.rows; y += 1) {
      for (let x = 0; x < grid.cols; x += 1) {
        const px = board.x + x * board.cell;
        const py = board.y + y * board.cell;
        const special = (x === start.x && y === start.y) || (x === core.x && y === core.y);
        ctx.fillStyle = special ? "rgba(255, 209, 102, 0.26)" : "rgba(116, 215, 255, 0.08)";
        ctx.fillRect(px + 2, py + 2, board.cell - 4, board.cell - 4);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
        ctx.strokeRect(px + 2, py + 2, board.cell - 4, board.cell - 4);
      }
    }
    drawRouteEndpointIcon(tileToPoint(start), "gate", board);
    drawRouteEndpointIcon(tileToPoint(core), "core", board);
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
      start: tileToPoint(currentStartTile()),
      core: tileToPoint(currentCoreTile()),
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
    const core = tileToPoint(currentCoreTile());
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
    ctx.fillText(battleLevelText(d.level), p.x, p.y + size * 0.48);
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

  function applyCanvasPress(event) {
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

  function cancelCanvasPress(pointerId = null) {
    if (!canvasPress || (pointerId !== null && canvasPress.pointerId !== pointerId)) return false;
    const owner = canvasPress.pointerId;
    canvasPress = null;
    try {
      if (nodes.canvas.hasPointerCapture?.(owner)) nodes.canvas.releasePointerCapture(owner);
    } catch {}
    return true;
  }

  function beginCanvasPress(event) {
    if (canvasPress || state.screen !== "game" || state.gameOver || leaveBattleConfirmPending) return;
    if (event.isPrimary === false || (event.button !== undefined && event.button !== 0)) return;
    canvasPress = { pointerId: event.pointerId };
    try { nodes.canvas.setPointerCapture?.(event.pointerId); } catch {}
  }

  function finishCanvasPress(event) {
    if (!canvasPress || canvasPress.pointerId !== event.pointerId) return;
    canvasPress = null;
    try {
      if (nodes.canvas.hasPointerCapture?.(event.pointerId)) nodes.canvas.releasePointerCapture(event.pointerId);
    } catch {}
    applyCanvasPress(event);
  }

  function onCanvasPointerMove(event) {
    if (state.screen !== "game" || state.gameOver) return;
    if (event.isPrimary === false) return;
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
    const unit = selectableUnitTypes()[index];
    if (!unit) return;
    state.selectedBuild = unit.id;
    state.selectedDefender = null;
    state.keyboardMode = true;
    state.pointerTile = null;
    renderBuildCards();
    renderSelectedInfo();
  }

  function cycleBuildSelection(delta) {
    const selectable = selectableUnitTypes();
    const current = Math.max(0, selectable.findIndex((unit) => unit.id === state.selectedBuild));
    const next = (current + delta + selectable.length) % selectable.length;
    selectBuildByIndex(next);
  }

  function onCanvasKeydown(event) {
    if (state.screen !== "game" || state.gameOver) return;
    const key = event.key;
    const handled = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", " ", "w", "W", "u", "U", "s", "S", "q", "Q", "e", "E", "Escape"].includes(key) || /^[1-9]$/.test(key);
    if (!handled) return;
    event.preventDefault();
    const commitsTransaction = ["Enter", " ", "w", "W", "u", "U", "s", "S"].includes(key);
    if (event.repeat && commitsTransaction) return;
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

  function shouldRunBattleLoop() {
    return state.screen === "game" && !state.gameOver && !leaveBattleConfirmPending && !document.hidden && battleWindowFocused;
  }

  function stopBattleLoop() {
    if (!battleFrame) return;
    cancelAnimationFrame(battleFrame);
    battleFrame = 0;
  }

  function startBattleLoop() {
    if (!shouldRunBattleLoop() || battleFrame) return;
    state.lastTs = performance.now();
    battleFrame = requestAnimationFrame(loop);
  }

  function syncBattleLoop() {
    if (shouldRunBattleLoop()) startBattleLoop();
    else stopBattleLoop();
  }

  function loop(ts) {
    battleFrame = 0;
    if (!shouldRunBattleLoop()) return;
    const dt = Math.min(0.05, (ts - (state.lastTs || ts)) / 1000);
    state.lastTs = ts;
    if (!state.manualSimulation) update(dt);
    draw();
    if (shouldRunBattleLoop()) battleFrame = requestAnimationFrame(loop);
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
    let mainEntryKeyboardKey = "";
    let battleExitKeyboardKey = "";
    nodes.resultPanel.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        return;
      }
      if (event.key !== "Tab") return;
      const actions = Array.from(nodes.resultPanel.querySelectorAll("button"))
        .filter((button) => !button.disabled && !button.classList.contains("is-hidden") && button.getClientRects().length > 0);
      if (!actions.length) return;
      const first = actions[0];
      const last = actions[actions.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      } else if (!actions.includes(document.activeElement)) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    });
    nodes.localeSelect.addEventListener("change", () => {
      const requested = nodes.localeSelect.value;
      let sharedLocaleUpdated = false;
      try { window.WonderI18n?.setLocale?.(requested); sharedLocaleUpdated = true; } catch {}
      state.locale = (sharedLocaleUpdated ? activeI18nLocale() : "") || requested;
      if (state.locale === "es") repairSpanishDocument();
      writeStorage(localeKey, requested);
      updateLocale();
    });
    nodes.startBtn.addEventListener("keydown", (event) => {
      if (!event.repeat && (event.key === "Enter" || event.key === " ")) mainEntryKeyboardKey = event.key;
    });
    nodes.startBtn.addEventListener("click", () => {
      setScreen("stages");
      renderStages();
      focusCurrentStage();
    });
    nodes.stageTabBtn?.addEventListener("click", () => {
      state.screen = "stages";
      setStagePage("stages", true);
    });
    nodes.equipmentTabBtn?.addEventListener("click", () => {
      state.screen = "tech";
      setStagePage("equipment", true);
    });
    nodes.stageBackBtn.addEventListener("click", () => {
      setScreen("menu");
      window.requestAnimationFrame(() => nodes.startBtn.focus({ preventScroll: true }));
    });
    nodes.menuBtn.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
    });
    nodes.menuBtn.addEventListener("click", requestLeaveBattle);
    nodes.pauseContinueBtn.addEventListener("click", () => clearLeaveBattleConfirmation(true));
    nodes.pauseLeaveBtn.addEventListener("click", leaveBattleForStages);
    nodes.pauseDecisionPanel.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        if (event.repeat) {
          event.preventDefault();
          return;
        }
        battleExitKeyboardKey = event.key;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        clearLeaveBattleConfirmation(true);
        return;
      }
      if (event.key !== "Tab") return;
      if (event.shiftKey && document.activeElement === nodes.pauseContinueBtn) {
        event.preventDefault();
        nodes.pauseLeaveBtn.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === nodes.pauseLeaveBtn) {
        event.preventDefault();
        nodes.pauseContinueBtn.focus({ preventScroll: true });
      }
    });
    nodes.waveBtn.addEventListener("click", startWave);
    nodes.upgradeBtn.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
    });
    nodes.upgradeBtn.addEventListener("click", upgradeSelected);
    nodes.sellBtn.addEventListener("click", sellSelected);
    nodes.reviveBtn.addEventListener("click", reviveCore);
    nodes.speedBtn.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
    });
    nodes.speedBtn.addEventListener("click", cycleSpeedControl);
    document.addEventListener("visibilitychange", handleBattleVisibilityChange);
    window.addEventListener("blur", () => {
      battleWindowFocused = false;
      suspendTransactionConfirmations();
      suspendToastFeedback();
      suspendUnattendedBattle("window_blur");
    });
    window.addEventListener("focus", () => {
      battleWindowFocused = true;
      resumeTransactionConfirmations();
      resumeToastFeedback();
      syncBattleLoop();
    });
    window.addEventListener("pagehide", () => {
      suspendTransactionConfirmations();
      suspendToastFeedback();
      cancelCanvasPress();
      stopBattleLoop();
    });
    window.addEventListener("pageshow", () => {
      resumeTransactionConfirmations();
      resumeToastFeedback();
      syncBattleLoop();
    });
    nodes.retryBtn.addEventListener("click", () => {
      commitResultDecision(() => {
        track("game_restart", { stage: state.currentStage });
        startStage(state.currentStage);
      });
    });
    nodes.resultMenuBtn.addEventListener("click", () => {
      commitResultDecision(() => {
        track("game_result_menu", { stage: state.currentStage, won: state.won });
        setScreen("stages");
        renderStages();
        focusCurrentStage();
      });
    });
    nodes.rerollRewardBtn.addEventListener("click", rerollReward);
    nodes.nextStageBtn.addEventListener("click", () => {
      commitResultDecision(() => {
        const nextStage = Math.min(STAGE_COUNT, state.currentStage + 1);
        track("game_next_stage", { stage: state.currentStage, next_stage: nextStage });
        startStage(nextStage);
      });
    });
    nodes.soundBtn?.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
    });
    nodes.soundBtn?.addEventListener("click", () => setSoundEnabled(!state.soundEnabled, true));
    nodes.audioMenuBtn?.addEventListener("click", () => {
      const open = nodes.audioMenuBtn.getAttribute("aria-expanded") !== "true";
      setAudioPopover(open);
      if (open) window.requestAnimationFrame(() => nodes.soundBtn?.focus({ preventScroll: true }));
    });
    document.addEventListener("pointerdown", (event) => {
      if (nodes.audioPopover?.classList.contains("is-hidden")) return;
      if (event.target.closest(".audio-control")) return;
      setAudioPopover(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !nodes.audioPopover?.classList.contains("is-hidden")) {
        event.preventDefault();
        setAudioPopover(false, true);
      }
    });
    window.addEventListener("resize", updateBattleShell, { passive: true });
    nodes.canvas.addEventListener("pointerdown", beginCanvasPress);
    nodes.canvas.addEventListener("pointerup", finishCanvasPress);
    nodes.canvas.addEventListener("pointercancel", (event) => cancelCanvasPress(event.pointerId));
    nodes.canvas.addEventListener("lostpointercapture", (event) => cancelCanvasPress(event.pointerId));
    nodes.canvas.addEventListener("pointermove", onCanvasPointerMove);
    nodes.canvas.addEventListener("pointerleave", () => {
      state.pointerTile = null;
    });
    nodes.canvas.addEventListener("keydown", onCanvasKeydown);
    nodes.canvas.addEventListener("focus", () => {
      state.keyboardMode = true;
      updateCanvasAccessibility();
    });
    nodes.stageRail.addEventListener("keydown", (event) => {
      const card = event.target.closest(".stage-card");
      if (card && ["Home", "End", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        const rtl = document.documentElement.dir === "rtl";
        const direction = event.key === "ArrowRight" ? (rtl ? -1 : 1) : event.key === "ArrowLeft" ? (rtl ? 1 : -1) : 0;
        const stageId = event.key === "Home" ? 1 : event.key === "End" ? STAGE_COUNT : Number(card.dataset.stageId) + direction;
        event.preventDefault();
        stageBrowseId = clampStage(stageId);
        ensureStageWindow(stageBrowseId);
        stageCardPool.forEach((button) => bindStageCard(button, Number(button.dataset.stageId)));
        centerStageCard(stageBrowseId);
        window.requestAnimationFrame(() => nodes.stageRail.querySelector(`[data-stage-id="${stageBrowseId}"]`)?.focus({ preventScroll: true }));
        return;
      }
      if (event.repeat && (event.key === mainEntryKeyboardKey || event.key === battleExitKeyboardKey)) event.preventDefault();
      if (card && card.getAttribute("aria-disabled") === "true" && (event.key === "Enter" || event.key === " ")) event.preventDefault();
    });
    document.addEventListener("keyup", (event) => {
      if (event.key === mainEntryKeyboardKey) mainEntryKeyboardKey = "";
      if (event.key === battleExitKeyboardKey) battleExitKeyboardKey = "";
    });
    window.addEventListener("blur", () => {
      cancelCanvasPress();
      mainEntryKeyboardKey = "";
      battleExitKeyboardKey = "";
    });
    // The shared Stage controller owns pointer tracking, click suppression,
    // and nearest-card settling. A second scroll timer or mouse drag handler
    // here makes touch compatibility events fight that controller mid-gesture.
    let stageCenteredTimer = 0;
    nodes.stageRail.addEventListener("scroll", () => {
      if (nodes.stageRail.dataset.wpStageVirtualized === "bounded-recycle") return;
      window.clearTimeout(stageCenteredTimer);
      stageCenteredTimer = window.setTimeout(syncCenteredStageCard, 120);
    }, { passive: true });
    nodes.stageRail.addEventListener("wonder:stage-snap", syncCenteredStageCard);
    nodes.stageRail.addEventListener("wheel", (event) => {
      const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (!delta) return;
      event.preventDefault();
      const from = currentStageLogicalPosition();
      settleStageRail(from, Math.round(from) + (delta > 0 ? 2 : 0));
    }, { passive: false });
    installVirtualStageDrag();

    let buildDrag = null;
    let ignoreBuildClick = false;
    nodes.buildCards.addEventListener("wheel", (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      nodes.buildCards.scrollLeft += event.deltaY;
    }, { passive: false });
    const chooseBuildCard = (card) => {
      state.selectedBuild = card.dataset.id;
      state.selectedDefender = null;
      renderBuildCards();
      renderSelectedInfo();
    };
    nodes.buildCards.addEventListener("click", (event) => {
      if (ignoreBuildClick) {
        ignoreBuildClick = false;
        return;
      }
      const card = event.target.closest(".build-card");
      if (!card || !nodes.buildCards.contains(card)) return;
      chooseBuildCard(card);
    });
    nodes.buildCards.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch" || event.button !== 0) return;
      buildDrag = { pointerId: event.pointerId, startX: event.clientX, startLeft: nodes.buildCards.scrollLeft, moved: false };
      nodes.buildCards.setPointerCapture?.(event.pointerId);
    });
    nodes.buildCards.addEventListener("pointermove", (event) => {
      if (!buildDrag || event.pointerId !== buildDrag.pointerId) return;
      const delta = event.clientX - buildDrag.startX;
      if (Math.abs(delta) > 5) {
        event.preventDefault();
        buildDrag.moved = true;
        nodes.buildCards.classList.add("is-dragging");
        nodes.buildCards.scrollLeft = buildDrag.startLeft - delta;
      }
    });
    const finishBuildDrag = (event) => {
      if (!buildDrag || event.pointerId !== buildDrag.pointerId) return;
      const dragged = buildDrag.moved;
      const selectedCard = !dragged ? document.elementFromPoint(event.clientX, event.clientY)?.closest(".build-card") : null;
      if (nodes.buildCards.hasPointerCapture?.(event.pointerId)) nodes.buildCards.releasePointerCapture(event.pointerId);
      nodes.buildCards.classList.remove("is-dragging");
      buildDrag = null;
      if (selectedCard && nodes.buildCards.contains(selectedCard)) chooseBuildCard(selectedCard);
      ignoreBuildClick = dragged || Boolean(selectedCard);
      if (ignoreBuildClick) setTimeout(() => { ignoreBuildClick = false; }, 0);
    };
    nodes.buildCards.addEventListener("pointerup", finishBuildDrag);
    nodes.buildCards.addEventListener("pointercancel", (event) => {
      if (!buildDrag || event.pointerId !== buildDrag.pointerId) return;
      if (nodes.buildCards.hasPointerCapture?.(event.pointerId)) nodes.buildCards.releasePointerCapture(event.pointerId);
      nodes.buildCards.classList.remove("is-dragging");
      buildDrag = null;
      ignoreBuildClick = true;
      setTimeout(() => { ignoreBuildClick = false; }, 0);
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
      bestStage: STAGE_COUNT,
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
    const advancedPlan = {
      tech: { power: 5, bulwark: 5, economy: 5 },
      units: [
        { id: "leo", tile: { x: 3, y: 3 } },
        { id: "fia", tile: { x: 6, y: 3 } },
        { id: "orla", tile: { x: 5, y: 2 } },
        { id: "taro", tile: { x: 4, y: 4 } },
        { id: "archer", tile: { x: 4, y: 2 } },
        { id: "sapper", tile: { x: 7, y: 4 } },
        { id: "medic", tile: { x: 7, y: 2 } },
      ],
      priority: ["leo", "fia", "orla", "taro", "sapper", "archer", "medic", "rux", "panko", "deer"],
      reinforcements: [
        { wave: 2, id: "rux", tile: { x: 8, y: 2 } },
        { wave: 3, id: "panko", tile: { x: 8, y: 3 } },
        { wave: 4, id: "deer", tile: { x: 8, y: 4 } },
        { wave: 5, id: "guard", tile: { x: 9, y: 3 } },
      ],
      maxUpgrades: 2,
    };
    for (let stage = 11; stage <= STAGE_COUNT; stage += 1) plans.push({ stage, ...advancedPlan });
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
    const activeCore = currentCoreTile();
    const coreApproach = { x: Math.max(0, activeCore.x - 1), y: activeCore.y };
    const coreBoss = {
      type: "boss",
      tile: coreApproach,
      pos: tileToPoint(coreApproach),
      path: [coreApproach, activeCore],
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
    nodes.canvas.dispatchEvent(new KeyboardEvent("keydown", { key: "w", bubbles: true }));
    const keyboardDuringCountdown = { wave: state.wave, runningWave: state.runningWave, timer: state.nextWaveTimer };
    update(4.8);
    const beforeStart = { wave: state.wave, runningWave: state.runningWave, timer: state.nextWaveTimer };
    update(0.3);
    const started = { wave: state.wave, runningWave: state.runningWave, timer: state.nextWaveTimer };
    state.manualSimulation = false;
    return { queued, keyboardDuringCountdown, beforeStart, started };
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
    state.save.diamonds = 2;
    renderResultReward();
    rerollReward();
    const insufficientState = {
      diamonds: state.save.diamonds,
      progress: nodes.resultProgressText.textContent,
      disabled: nodes.rerollRewardBtn.disabled,
    };
    state.save.diamonds = diamondsAfterWin;
    renderResultReward();
    rerollReward();
    const pendingState = {
      diamonds: state.save.diamonds,
      points: state.save.upgradePoints,
      reward: { ...state.resultReward },
      progress: nodes.resultProgressText.textContent,
      button: nodes.rerollRewardBtn.textContent,
      confirming: nodes.rerollRewardBtn.classList.contains("is-confirming"),
    };
    rerollReward();
    const rewardAfter = { ...state.resultReward };
    const diamondsAfterReroll = state.save.diamonds;
    const pointsAfterReroll = state.save.upgradePoints;
    const progressAfterReroll = nodes.resultProgressText.textContent;
    const unlockAfterReroll = nodes.resultUnlockText.textContent;
    buyGoldenFrame();
    const framePending = {
      diamonds: state.save.diamonds,
      owned: Boolean(state.save.cosmetics?.goldenFrame),
      button: nodes.techGrid.querySelector('[data-cosmetic-id="goldenFrame"]')?.textContent || "",
      aria: nodes.techGrid.querySelector('[data-cosmetic-id="goldenFrame"]')?.getAttribute("aria-label") || "",
    };
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
      insufficientState,
      pendingState,
      diamondsAfterReroll,
      pointsAfterReroll,
      progressAfterReroll,
      unlockAfterReroll,
      framePending,
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

  function getVirtualStageState() {
    return {
      poolSize: stageCardPool.length,
      total: STAGE_COUNT,
      start: stageWindowStart + 1,
      end: stageWindowStart + stageCardPool.length,
      recycleCount: Number(nodes.stageRail.dataset.wpStageRecycleCount || 0),
      browsed: stageBrowseId,
      settling: nodes.stageRail.dataset.wpStageSettling === "true",
      ids: stageCardPool.map((card) => Number(card.dataset.stageId)),
    };
  }

  function browseVirtualStage(stageId) {
    stageBrowseId = clampStage(stageId);
    ensureStageWindow(stageBrowseId);
    stageCardPool.forEach((button) => bindStageCard(button, Number(button.dataset.stageId)));
    positionStageRail(stageBrowseId - 1);
    syncCenteredStageCard();
    return getVirtualStageState();
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

  function showResultScreenScenario(stageId = STAGE_COUNT, won = true, diamonds = 20) {
    state.manualSimulation = true;
    state.save = {
      bestStage: STAGE_COUNT,
      diamonds,
      upgradePoints: 8,
      tech: { power: 2, bulwark: 2, economy: 2 },
      cosmetics: { goldenFrame: true },
      clears: {},
    };
    startStage(stageId);
    if (won) winStage();
    else {
      state.coreHp = 0;
      loseStage();
    }
    return {
      screen: state.screen,
      title: nodes.resultTitle.textContent,
      starsText: nodes.resultStars.textContent,
      starsSaved: state.save.stars?.[stageId] || 0,
      hasReward: nodes.resultRewardText.textContent.length > 0,
      progressText: nodes.resultProgressText.textContent,
      unlockText: nodes.resultUnlockText.textContent,
      resultParent: nodes.resultPanel.parentElement?.id || "",
      nextHidden: nodes.nextStageBtn.classList.contains("is-hidden"),
      nextDisabled: nodes.nextStageBtn.disabled,
    };
  }

  function beginTransactionConfirmationScenario(kind) {
    clearGoldenFrameConfirmation();
    clearReviveConfirmation();
    clearRewardRerollConfirmation();
    if (kind === "goldenFrame") {
      showTechScreenScenario();
      buyGoldenFrame();
    } else if (kind === "revive") {
      showResultScreenScenario(1, false, 20);
      reviveCore();
    } else if (kind === "rewardReroll") {
      showResultScreenScenario(1, true, 20);
      rerollReward();
    }
    return transactionConfirmationScenarioState(kind);
  }

  function transactionConfirmationScenarioState(kind) {
    return {
      pending: kind === "goldenFrame"
        ? goldenFrameConfirmPending
        : kind === "revive"
          ? reviveConfirmPending
          : Boolean(state.resultReward?.rerollPending),
      diamonds: state.save.diamonds,
      screen: state.screen,
    };
  }

  function beginInsufficientFundsToastScenario() {
    showTechScreenScenario();
    state.save.diamonds = 0;
    buyGoldenFrame();
    return toastScenarioState();
  }

  function toastScenarioState() {
    return {
      visible: !nodes.toast.classList.contains("is-hidden"),
      text: nodes.toast.textContent,
      screen: state.screen,
      diamonds: state.save.diamonds,
    };
  }

  function runResultTacticalPlanScenario() {
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
    const perfect = nodes.resultPlanText.textContent;
    startStage(2);
    state.coreHp = state.stage.coreHp * 0.4;
    winStage();
    const pressured = nodes.resultPlanText.textContent;
    startStage(3);
    state.coreHp = 0;
    loseStage();
    const defeat = nodes.resultPlanText.textContent;
    state.locale = "zh-Hant";
    nodes.localeSelect.value = "zh-Hant";
    updateLocale();
    startStage(4);
    state.coreHp = state.stage.coreHp * 0.2;
    winStage();
    const zhClose = nodes.resultPlanText.textContent;
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
      progressText: nodes.resultProgressText.textContent,
      unlockText: nodes.resultUnlockText.textContent,
      resultParent: nodes.resultPanel.parentElement?.id || "",
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
      guardPressed: guardLow?.getAttribute("aria-pressed") || "",
      guardAria: guardLow?.getAttribute("aria-label") || "",
      leoAffordable: leoLow?.dataset.affordable,
      leoText: leoLow?.querySelector(".build-affordability")?.textContent || "",
      leoClass: leoLow?.classList.contains("is-unaffordable") || false,
      leoAria: leoLow?.getAttribute("aria-label") || "",
      leoPressed: leoLow?.getAttribute("aria-pressed") || "",
    };
    state.coins = 999;
    updateHud();
    const leoHigh = nodes.buildCards.querySelector('[data-id="leo"]');
    const highState = {
      leoAffordable: leoHigh?.dataset.affordable,
      leoText: leoHigh?.querySelector(".build-affordability")?.textContent || "",
      leoClass: leoHigh?.classList.contains("is-unaffordable") || false,
      leoAria: leoHigh?.getAttribute("aria-label") || "",
      leoPressed: leoHigh?.getAttribute("aria-pressed") || "",
    };
    state.manualSimulation = false;
    return {
      lowState,
      highState,
      selectedInfoRole: nodes.selectedInfo.getAttribute("role") || "",
      selectedInfoLive: nodes.selectedInfo.getAttribute("aria-live") || "",
      selectedInfoAtomic: nodes.selectedInfo.getAttribute("aria-atomic") || "",
    };
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

  function runBattleLevelLocalizationScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 1,
      diamonds: 12,
      upgradePoints: 0,
      tech: { power: 0, bulwark: 0, economy: 0 },
      cosmetics: { goldenFrame: false },
      clears: {},
      stars: {},
    };
    startStage(1);
    state.coins = 999;
    state.selectedBuild = "guard";
    buildUnit({ x: 2, y: 2 });
    state.selectedDefender = state.defenders[0];
    updateHud();
    const before = nodes.selectedInfo.textContent;
    state.effects = [];
    upgradeSelected();
    const feedback = state.effects
      .filter((effect) => effect.type === "floatingText")
      .map((effect) => effect.text);
    const result = {
      locale: state.locale,
      level: state.selectedDefender.level,
      expected: battleLevelText(state.selectedDefender.level),
      before,
      selectedInfo: nodes.selectedInfo.textContent,
      toast: nodes.toast.textContent,
      feedback,
    };
    state.manualSimulation = false;
    return result;
  }

  function runTechLevelLocalizationScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: 10,
      diamonds: 20,
      upgradePoints: 2,
      tech: { power: 0, bulwark: 0, economy: 5 },
      cosmetics: { goldenFrame: false },
      clears: {},
      stars: {},
    };
    updateProfile();
    renderTech();
    setScreen("tech");
    const readCards = () => [...nodes.techGrid.querySelectorAll(".tech-card")]
      .slice(0, techs.length)
      .map((card) => ({
        title: card.querySelector("strong")?.textContent || "",
        label: card.querySelector("button")?.getAttribute("aria-label") || "",
        disabled: Boolean(card.querySelector("button")?.disabled),
      }));
    const before = readCards();
    nodes.techGrid.querySelector('[data-tech-id="power"]')?.click();
    const result = {
      locale: state.locale,
      expectedZero: techLevelText(0),
      expectedOne: techLevelText(1),
      expectedFive: techLevelText(5),
      before,
      after: readCards(),
      balance: state.save.upgradePoints,
      power: state.save.tech.power,
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

  function runCampaignDepthScenario() {
    state.manualSimulation = true;
    state.save = {
      bestStage: STAGE_COUNT,
      diamonds: 99,
      upgradePoints: 99,
      tech: { power: 5, bulwark: 5, economy: 5 },
      cosmetics: { goldenFrame: true },
      clears: {},
      stars: {},
    };
    const mechanicSnapshots = [11, 16, 21, 26].map((stageId) => {
      startStage(stageId);
      state.wave = 1;
      state.waveSpawned = 0;
      state.waveToSpawn = 2;
      const enemy = spawnEnemy();
      const startHp = enemy.hp;
      const startSpeed = enemy.speed;
      enemy.hp = enemy.maxHp * 0.45;
      updateEnemySpecial(enemy, 1);
      return {
        stage: stageId,
        mechanic: state.stage.mechanic,
        guardHp: Math.round(enemy.guardHp),
        regenerated: enemy.regenRate > 0 && enemy.hp > enemy.maxHp * 0.45,
        surged: enemy.surged,
        speedIncreased: enemy.speed > startSpeed,
        slowResistance: state.stage.mechanic === "eclipse" ? 0.5 : 0,
        startHp: Math.round(startHp),
      };
    });
    const bossSnapshots = stages.filter((stage) => stage.boss).map((stage) => {
      startStage(stage.id);
      state.wave = stage.waves;
      state.waveSpawned = 0;
      state.waveToSpawn = 1;
      const boss = spawnEnemy();
      const guardBefore = boss.guardHp;
      const supportsBefore = state.enemies.length - 1;
      boss.hp = boss.maxHp * (boss.bossAbility === "phase" ? 0.6 : 0.5);
      updateEnemySpecial(boss, 0.2);
      if (boss.bossAbility === "phase") {
        boss.hp = boss.maxHp * 0.3;
        updateEnemySpecial(boss, 0.2);
      }
      return {
        stage: stage.id,
        name: localizedBossName(stage),
        ability: boss.bossAbility,
        phaseStep: boss.phaseStep,
        supportsAdded: state.enemies.length - 1 - supportsBefore,
        guardAdded: boss.guardHp > guardBefore,
        regenerated: boss.hp > boss.maxHp * 0.3 && boss.bossAbility === "regrowth",
        surged: boss.surged,
      };
    });
    state.enemies = [];
    state.runningWave = false;
    state.manualSimulation = false;
    return { mechanicSnapshots, bossSnapshots };
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
    const bossWaveProfiles = stages.filter((stage) => stage.boss).map((stage) => waveProfile(stage.id, stage.waves));
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
      mechanicFamilies: [...new Set(stages.map((stage) => stage.mechanic))],
      bossAbilities: stages.filter((stage) => stage.boss).map((stage) => stage.bossAbility),
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

  function runBackgroundPauseScenario() {
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
    const before = {
      waveSpawned: state.waveSpawned,
      spawnTimer: Number(state.spawnTimer.toFixed(4)),
      enemyX: Number((enemy?.pos.x || 0).toFixed(4)),
      coreHp: state.coreHp,
      effects: state.effects.length,
    };
    const hiddenDescriptor = Object.getOwnPropertyDescriptor(document, "hidden");
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
    const pausedText = nodes.speedBtn.textContent;
    const pausedPressed = nodes.speedBtn.getAttribute("aria-pressed");
    update(1.2);
    const after = {
      waveSpawned: state.waveSpawned,
      spawnTimer: Number(state.spawnTimer.toFixed(4)),
      enemyX: Number((enemy?.pos.x || 0).toFixed(4)),
      coreHp: state.coreHp,
      effects: state.effects.length,
    };
    if (hiddenDescriptor) Object.defineProperty(document, "hidden", hiddenDescriptor);
    else delete document.hidden;
    document.dispatchEvent(new Event("visibilitychange"));
    const stayedPaused = state.paused;
    cycleSpeedControl();
    const resumedText = nodes.speedBtn.textContent;
    const resumedPressed = nodes.speedBtn.getAttribute("aria-pressed");
    const result = { before, after, pausedText, pausedPressed, stayedPaused, resumedText, resumedPressed, paused: state.paused, speed: state.speed };
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
    rerollReward();
    buyGoldenFrame();
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
    state.locale = activeI18nLocale() || readStorage(localeKey) || "en";
    const runtimeLocalizer = window.WeightPlayGameRuntimeLocalizer;
    if (!text[state.locale] && runtimeLocalizer?.locale === state.locale) text[state.locale] = text.en;
    if (!text[state.locale]) state.locale = "en";
    const zhOption = nodes.localeSelect.querySelector('option[value="zh-Hant"]');
    if (zhOption) zhOption.textContent = text["zh-Hant"].localeName;
    if (!nodes.localeSelect.querySelector('option[value="es"]')) {
      nodes.localeSelect.add(new Option("Espa\u00f1ol", "es"));
    }
    nodes.localeSelect.value = state.locale;
    if (state.locale === "es") repairSpanishDocument();
    state.save = loadSave();
    state.soundEnabled = readStorage(soundKey) === "on";
    updateProfile();
    bindEvents();
    updateLocale();
    setScreen("menu");
    await preload();
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
      getVirtualStageState,
      browseVirtualStage,
      runStageSelectorScenario,
      showStageScreenScenario,
      showTechScreenScenario,
      showResultScreenScenario,
      beginTransactionConfirmationScenario,
      transactionConfirmationScenarioState,
      beginInsufficientFundsToastScenario,
      toastScenarioState,
      runResultTacticalPlanScenario,
      runNextStageResultScenario,
      runWaveIntelScenario,
      runKeyboardControlScenario,
      runPlacementPreviewScenario,
      runBuildAffordabilityScenario,
      runSelectedActionStateScenario,
      runActionFeedbackScenario,
      runBattleLevelLocalizationScenario,
      runTechLevelLocalizationScenario,
      runHitResponseScenario,
      runWaveClearFeedbackScenario,
      runSelectedBuildInfoScenario,
      runRouteStatusScenario,
      runBlockedRouteFallbackScenario,
      runRoutePreviewScenario,
      runTraditionalChineseReadabilityScenario,
      runCampaignDepthScenario,
      runSoundReadinessScenario,
      runPauseSpeedScenario,
      runBackgroundPauseScenario,
      runAnalyticsScenario,
    };
  }

  init().catch((error) => {
    console.error(error);
    nodes.loadingText.textContent = t("loadFailed");
  });
})();
