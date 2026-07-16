(() => {
  const GAME_ID = "animal-orb-fortress";
  const saveKey = "weightplay_animal_orb_fortress_v1";
  const localeKey = "weightPlayLocale";
  let W = 960;
  let H = 540;
  const rerollCost = 3;
  const MAX_RAID_TIER = 20;
  const WAVES_PER_RAID = 3;

  const $ = (id) => document.getElementById(id);
  const nodes = {
    lobbyReturn: document.querySelector(".topbar .back-btn"),
    localeSelect: $("localeSelect"),
    loadingPanel: $("loadingPanel"),
    loadingFill: $("loadingFill"),
    loadingText: $("loadingText"),
    menuPanel: $("menuPanel"),
    stagePanel: $("stagePanel"),
    gamePanel: $("gamePanel"),
    upgradePanel: $("upgradePanel"),
    resultPanel: $("resultPanel"),
    startBtn: $("startBtn"),
    stageBackBtn: $("stageBackBtn"),
    stageRail: $("stageRail"),
    stageProgressText: $("stageProgressText"),
    mapBtn: $("battleBackBtn"),
    retryBtn: $("retryBtn"),
    nextStageBtn: $("nextStageBtn"),
    resultMenuBtn: $("resultMenuBtn"),
    roomGrid: $("roomGrid"),
    bestRaidText: $("bestRaidText"),
    starStoneText: $("starStoneText"),
    diamondText: $("diamondText"),
    waveText: $("waveText"),
    coreText: $("coreText"),
    shotText: $("shotText"),
    hintText: $("hintText"),
    upgradeCards: $("upgradeCards"),
    upgradeStatus: $("upgradeStatus"),
    rerollBtn: $("rerollBtn"),
    resultTitle: $("resultTitle"),
    resultText: $("resultText"),
    skillReportText: $("skillReportText"),
  };
  const canvas = $("gameCanvas");
  const ctx = canvas.getContext("2d");

  const text = {
    en: {
      title: "Animal Orb Fortress",
      language: "Language",
      backToLobby: "Back to lobby",
      fortressRooms: "Fortress rooms",
      arenaLabel: "Animal Orb Fortress arena",
      menuTitle: "Aim the spirit orb through the crystal fortress.",
      menuHint: "Choose a raid route, plan ricochet shots, and protect the fortress core.",
      bestRaid: "Best Raid",
      starStones: "Star Stones",
      diamonds: "Diamonds",
      openRaidMap: "Choose Raid",
      raidMap: "Raid Map",
      raidTiers: "Raid tiers",
      returnMain: "Return to main",
      fortressWorkshop: "Fortress Workshop",
      stageProgress: "{unlocked}/20 routes unlocked · 3 waves each",
      tierLocked: "Locked",
      enterRaid: "Enter",
      nextStage: "Next Stage",
      tier1Name: "Crystal Gate",
      tier1Desc: "Learn wall bounces against scouting beasts.",
      tier2Name: "Moss Arcade",
      tier2Desc: "More enemies arrive with tougher armor.",
      tier3Name: "Echo Courtyard",
      tier3Desc: "Survive the strongest assault and final golem.",
      tier4Name: "Forest Crown",
      tier5Name: "Thorn Bridge",
      tier6Name: "Venom Garden",
      tier7Name: "Root Labyrinth",
      tier8Name: "Marsh Guardian",
      tier9Name: "Moon Stair",
      tier10Name: "Wisp Gallery",
      tier11Name: "Mirror Ruins",
      tier12Name: "Lunar Sentinel",
      tier13Name: "Eclipse Gate",
      tier14Name: "Black Crystal Hall",
      tier15Name: "Shadow Furnace",
      tier16Name: "Eclipse Regent",
      tier17Name: "Golem Approach",
      tier18Name: "Core Foundry",
      tier19Name: "Last Bastion",
      tier20Name: "Heart of the Fortress",
      zone1Desc: "Crystal woodland patrols test clean bank shots.",
      zone2Desc: "Thorn beasts favor armor and crowded lanes.",
      zone3Desc: "Moon wisps move quickly through ruined halls.",
      zone4Desc: "Eclipse troops arrive behind crystal shields.",
      zone5Desc: "Golem guards combine every previous threat.",
      ruleFormation: "Formation",
      ruleSwarm: "Swarm",
      ruleArmored: "Shielded",
      ruleGuardian: "Elite guard",
      tierShort: "R{tier}",
      wave: "Wave",
      core: "Core",
      shots: "Shots",
      aimHint: "Drag from the launcher, preview the bounce path, then release.",
      keyboardAim: "Aim {angle}° from center. Left/Right adjust; Space or Enter fires.",
      arenaControlLabel: "Animal Orb Fortress arena. Aim {angle} degrees from center. Use Left and Right arrows to adjust; Space or Enter to fire.",
      orbReady: "Orb ready. Bank shots into shadow beasts before they reach the core.",
      orbFlying: "Spirit orb is flying. Watch the bounce route and prepare the next aim.",
      fortressHit: "A shadow beast hit the core. Aim earlier or use wider angles.",
      waveClear: "Wave clear. Choose one blessing before the next wave.",
      chooseUpgrade: "Choose a fortress blessing",
      reroll: "Reroll for 3 diamonds",
      rerolled: "Relic choices refreshed.",
      rerollNeed: "Need 3 Diamonds. Current balance {balance}/3.",
      rerollConfirm: "Confirm 3 · {before}→{after}",
      rerollDecision: "Refresh all three blessings once this wave. Tap again to confirm: {before} → {after} Diamonds.",
      rerollLabel: "Refresh all three blessing choices once this wave. Costs 3 Diamonds. Current balance {balance}.",
      rerollConfirmLabel: "Confirm one blessing reroll. Spend 3 Diamonds. Balance {before} to {after}.",
      retry: "Retry",
      raidClear: "Raid Clear",
      raidFailed: "Raid Failed",
      resultWin: "Cleared route {tier}, wave {wave}/3, earned {stones} Star Stones, and protected {core} core HP.",
      resultLose: "Reached route {tier}, wave {wave}/3 and earned {stones} Star Stones. Upgrade rooms and try a safer bounce route.",
      progressUnlocked: "Progress saved: {total} Star Stones total; route {best} is now unlocked.",
      progressComplete: "Progress saved: {total} Star Stones total; all 20 routes are cleared.",
      progressSaved: "Progress saved: {total} Star Stones total; best unlocked route remains {best}.",
      reportWin: "Skill Report: strong logic and reaction. You used bounce planning and upgrade choice to protect the fortress.",
      reportLose: "Skill Report: good practice. Next run, aim earlier and use walls to hit multiple beasts.",
      upgradeDamage: "Bigger Orb",
      upgradeDamageDesc: "+1 orb damage.",
      upgradeSplit: "Split Orb",
      upgradeSplitDesc: "Add a third echo orb to each release.",
      upgradePierce: "Piercing Shine",
      upgradePierceDesc: "The orb can hit the same beast again sooner.",
      upgradeRecharge: "Faster Recharge",
      upgradeRechargeDesc: "Ready the next shot sooner.",
      upgradeShield: "Core Shield",
      upgradeShieldDesc: "Restore 4 core HP.",
      upgradeMagnet: "Scout Magnet",
      upgradeMagnetDesc: "+2 Star Stones after the raid.",
      roomForge: "Orb Forge",
      roomForgeDesc: "+1 base orb damage per level.",
      roomShield: "Core Shield",
      roomShieldDesc: "+4 starting core HP per level.",
      roomDen: "Companion Den",
      roomDenDesc: "Adds helper chip damage at level 2+.",
      companionLocked: "Unlocks helper strikes at Lv.2.",
      companionCurrent: "Helper strike: {damage} damage every 4s.",
      companionNext: "Next level: {damage} damage.",
      roomTower: "Scout Tower",
      roomTowerDesc: "+1 bonus Star Stone per raid level.",
      level: "Lv.{n}",
      upgradeRoom: "Upgrade {cost}",
      maxed: "Max",
    },
    "zh-Hant": {
      title: "動物星珠要塞",
      language: "語言",
      backToLobby: "返回大廳",
      fortressRooms: "要塞房間",
      arenaLabel: "動物星珠要塞競技場",
      menuTitle: "瞄準星珠，穿越水晶要塞。",
      menuHint: "選擇突襲路線、規劃反彈射擊，守住要塞核心。",
      bestRaid: "最佳突襲",
      starStones: "星石",
      diamonds: "鑽石",
      openRaidMap: "選擇關卡",
      raidMap: "突襲地圖",
      raidTiers: "突襲關卡",
      returnMain: "返回主畫面",
      fortressWorkshop: "要塞工坊",
      stageProgress: "已解鎖 {unlocked}/20 條路線 · 每關 3 波",
      tierLocked: "尚未解鎖",
      enterRaid: "進入",
      nextStage: "下一關",
      tier1Name: "水晶門",
      tier1Desc: "熟悉牆面反彈，擊退偵查影獸。",
      tier2Name: "苔痕長廊",
      tier2Desc: "敵人更多，護甲與壓力也更強。",
      tier3Name: "回音庭院",
      tier3Desc: "撐過最強攻勢，擊敗最終魔像。",
      tier4Name: "森林王冠",
      tier5Name: "荊棘橋",
      tier6Name: "毒霧花園",
      tier7Name: "盤根迷宮",
      tier8Name: "沼澤守衛",
      tier9Name: "月光階梯",
      tier10Name: "幽光迴廊",
      tier11Name: "鏡面遺跡",
      tier12Name: "月之守衛",
      tier13Name: "蝕影之門",
      tier14Name: "黑晶大廳",
      tier15Name: "暗影熔爐",
      tier16Name: "蝕影王座",
      tier17Name: "魔像前線",
      tier18Name: "核心鑄造場",
      tier19Name: "最終壁壘",
      tier20Name: "要塞之心",
      zone1Desc: "水晶森林的巡邏隊，考驗穩定反彈。",
      zone2Desc: "荊棘影獸偏重護甲與密集進攻。",
      zone3Desc: "月光幽靈會高速穿過遺跡。",
      zone4Desc: "蝕影部隊帶著水晶護盾出擊。",
      zone5Desc: "魔像守軍會混合先前所有威脅。",
      ruleFormation: "陣形戰",
      ruleSwarm: "敵群戰",
      ruleArmored: "護盾戰",
      ruleGuardian: "菁英守衛",
      tierShort: "關{tier}",
      wave: "波次",
      core: "核心",
      shots: "射擊",
      aimHint: "從發射器拖曳瞄準，預覽反彈路線後放開。",
      keyboardAim: "瞄準偏移 {angle}°。左右方向鍵調整，空白鍵或 Enter 發射。",
      arenaControlLabel: "動物星珠要塞競技場。瞄準偏移 {angle} 度。使用左右方向鍵調整，空白鍵或 Enter 發射。",
      orbReady: "星珠已準備好。用牆面反彈擊中影獸，別讓牠們靠近核心。",
      orbFlying: "星珠正在飛行。觀察反彈路線，準備下一次瞄準。",
      fortressHit: "影獸撞到核心了。更早瞄準，或改用更寬的反彈角度。",
      waveClear: "波次完成。選擇一個祝福後進入下一波。",
      chooseUpgrade: "選擇一個要塞祝福",
      reroll: "花 3 鑽石重抽",
      rerolled: "遺物選項已刷新。",
      rerollNeed: "需要 3 顆鑽石。目前餘額 {balance}/3。",
      rerollConfirm: "確認 3 · {before}→{after}",
      rerollDecision: "本波一次刷新全部三個祝福。再點一次確認：{before} → {after} 顆鑽石。",
      rerollLabel: "本波一次刷新全部三個祝福。花費 3 顆鑽石。目前餘額 {balance}。",
      rerollConfirmLabel: "確認重抽一次祝福。花費 3 顆鑽石。餘額 {before} 變為 {after}。",
      retry: "再試一次",
      raidClear: "突襲成功",
      raidFailed: "突襲失敗",
      resultWin: "完成第 {tier} 關、第 {wave}/3 波，獲得 {stones} 顆星石，並保留 {core} 點核心生命。",
      resultLose: "抵達第 {tier} 關、第 {wave}/3 波並獲得 {stones} 顆星石。升級房間後再試更安全的反彈路線。",
      progressUnlocked: "進度已保存：累積星石 {total} 顆；已解鎖第 {best} 關。",
      progressComplete: "進度已保存：累積星石 {total} 顆；20 關已全部完成。",
      progressSaved: "進度已保存：累積星石 {total} 顆；最佳已解鎖第 {best} 關。",
      reportWin: "能力回饋：邏輯與反應很穩。你透過反彈規劃與升級選擇保護了要塞。",
      reportLose: "能力回饋：這是很好的練習。下一局可以更早瞄準，利用牆面一次擊中多隻影獸。",
      upgradeDamage: "巨大星珠",
      upgradeDamageDesc: "星珠傷害 +1。",
      upgradeSplit: "分裂星珠",
      upgradeSplitDesc: "發射後額外射出一顆較弱星珠。",
      upgradePierce: "穿透星芒",
      upgradePierceDesc: "星珠可以更快再次命中同一隻影獸。",
      upgradeRecharge: "快速充能",
      upgradeRechargeDesc: "更快準備下一次射擊。",
      upgradeShield: "核心護盾",
      upgradeShieldDesc: "恢復 4 點核心生命。",
      upgradeMagnet: "偵查磁力",
      upgradeMagnetDesc: "突襲結束後額外 +2 星石。",
      roomForge: "星珠鍛造室",
      roomForgeDesc: "每級提高基礎星珠傷害。",
      roomShield: "核心護盾室",
      roomShieldDesc: "每級提高 4 點起始核心生命。",
      roomDen: "夥伴巢穴",
      roomDenDesc: "2 級後提供輔助傷害。",
      companionLocked: "升到 Lv.2 解鎖夥伴支援攻擊。",
      companionCurrent: "夥伴支援：每 4 秒造成 {damage} 傷害。",
      companionNext: "下一級：{damage} 傷害。",
      roomTower: "偵查高塔",
      roomTowerDesc: "每個突襲等級額外 +1 星石。",
      level: "Lv.{n}",
      upgradeRoom: "升級 {cost}",
      maxed: "已滿",
    },
  };

  const assets = {
    bg: "../../assets/animal-orb-fortress-arena-bg.webp",
    lion: "../../assets/weightplay-boom-mane-lion.png",
    orbs: "../../assets/animal-orb-fortress-orb-set.webp",
    beasts: "../../assets/animal-orb-fortress-shadow-beasts.webp",
    boss: "../../assets/animal-orb-fortress-boss-golem.webp",
    revive: "../../assets/animal-orb-fortress-diamond-revive.webp",
    fx: "../../assets/animal-orb-fortress-fx.webp",
  };

  const pageMeta = {
    en: {
      title: "Animal Orb Fortress - Free Animal Ricochet Roguelite",
      description: "Animal Orb Fortress is a 13+ animal ricochet roguelite where players aim spirit orbs, clear boss waves, and grow a crystal fortress locally.",
      ogDescription: "Aim animal spirit orbs through crystal fortress rooms, clear boss waves, choose upgrades, and grow permanent rooms with local progress.",
      twitterDescription: "Plan bounce shots, defeat boss waves, and build a crystal animal fortress with local progress.",
    },
    "zh-Hant": {
      title: "動物星珠要塞 - 免費動物反彈 Roguelite",
      description: "動物星珠要塞是一款 13+ 動物反彈 Roguelite，玩家瞄準星珠、清除首領波次，並在本機累積水晶要塞進度。",
      ogDescription: "用動物星珠穿越水晶要塞房間，規劃反彈路線、擊退首領波次、選擇升級並累積永久進度。",
      twitterDescription: "規劃反彈射擊、擊敗首領波次，並在本機進度中建設水晶動物要塞。",
    },
  };

  const roomDefs = [
    { id: "forge", iconSrc: "../../assets/animal-orb-fortress-room-icon-1.webp", name: "roomForge", desc: "roomForgeDesc" },
    { id: "shield", iconSrc: "../../assets/animal-orb-fortress-room-icon-3.webp", name: "roomShield", desc: "roomShieldDesc" },
    { id: "den", iconSrc: "../../assets/animal-orb-fortress-room-icon-2.webp", name: "roomDen", desc: "roomDenDesc" },
    { id: "tower", iconSrc: "../../assets/animal-orb-fortress-room-icon-4.webp", name: "roomTower", desc: "roomTowerDesc" },
  ];
  const raidDefs = Array.from({ length: MAX_RAID_TIER }, (_, index) => {
    const tier = index + 1;
    const zone = Math.ceil(tier / 4);
    const rule = ["ruleFormation", "ruleSwarm", "ruleArmored", "ruleGuardian"][index % 4];
    return { tier, zone, name: `tier${tier}Name`, desc: `zone${zone}Desc`, rule };
  });
  const upgradeDefs = [
    { id: "damage", iconSrc: "../../assets/animal-orb-fortress-upgrade-icon-1.webp", name: "upgradeDamage", desc: "upgradeDamageDesc" },
    { id: "split", iconSrc: "../../assets/animal-orb-fortress-upgrade-icon-2.webp", name: "upgradeSplit", desc: "upgradeSplitDesc" },
    { id: "pierce", iconSrc: "../../assets/animal-orb-fortress-upgrade-icon-3.webp", name: "upgradePierce", desc: "upgradePierceDesc" },
    { id: "recharge", iconSrc: "../../assets/animal-orb-fortress-upgrade-icon-4.webp", name: "upgradeRecharge", desc: "upgradeRechargeDesc" },
    { id: "shield", iconSrc: "../../assets/animal-orb-fortress-upgrade-icon-5.webp", name: "upgradeShield", desc: "upgradeShieldDesc" },
    { id: "magnet", iconSrc: "../../assets/animal-orb-fortress-upgrade-icon-6.webp", name: "upgradeMagnet", desc: "upgradeMagnetDesc" },
  ];

  const images = {};
  let locale = window.WonderI18n?.locale?.() || localStorage.getItem(localeKey) || "en";
  let save = loadSave();
  let selectedTier = 1;
  let state = makeState();
  let lastFrame = 0;
  let raf = 0;
  let pointer = { active: false, x: 0, y: 0 };
  let keyboardAimDeg = -90;
  let soundAt = {};
  let preloadFinished = false;

  function t(key, data = {}) {
    const value = text[locale]?.[key] || text.en[key] || key;
    return Object.entries(data).reduce((out, [name, item]) => out.replaceAll(`{${name}}`, String(item)), value);
  }

  function setMeta(selector, value) {
    document.querySelector(selector)?.setAttribute("content", value);
  }

  function updatePageMeta() {
    const meta = pageMeta[locale] || pageMeta.en;
    document.title = meta.title;
    setMeta("meta[name='description']", meta.description);
    setMeta("meta[property='og:title']", meta.title);
    setMeta("meta[property='og:description']", meta.ogDescription);
    setMeta("meta[name='twitter:title']", meta.title);
    setMeta("meta[name='twitter:description']", meta.twitterDescription);
  }

  function playSound(name, gap = 0.08) {
    const now = performance.now();
    if (soundAt[name] && now - soundAt[name] < gap * 1000) return;
    soundAt[name] = now;
    window.WonderSound?.play(name);
  }

  function loadSave() {
    try {
      const parsed = JSON.parse(localStorage.getItem(saveKey) || "{}");
      return {
        bestRaid: 1,
        starStones: 0,
        playCount: 0,
        rooms: { forge: 0, shield: 0, den: 0, tower: 0 },
        ...parsed,
        rooms: { forge: 0, shield: 0, den: 0, tower: 0, ...(parsed.rooms || {}) },
      };
    } catch {
      return { bestRaid: 1, starStones: 0, playCount: 0, rooms: { forge: 0, shield: 0, den: 0, tower: 0 } };
    }
  }

  function persist() {
    localStorage.setItem(saveKey, JSON.stringify(save));
  }

  function makeState() {
    const shieldLevel = save?.rooms?.shield || 0;
    const forgeLevel = save?.rooms?.forge || 0;
    const denLevel = save?.rooms?.den || 0;
    return {
      mode: "menu",
      wave: 1,
      raidTier: selectedTier,
      core: 20 + shieldLevel * 4,
      maxCore: 20 + shieldLevel * 4,
      baseDamage: 2 + forgeLevel,
      shotCount: 0,
      stonesEarned: 0,
      bonusStones: 0,
      rerolled: false,
      rerollPending: false,
      readyTimer: 0,
      orbCooldown: 0.48,
      split: false,
      pierce: false,
      enemies: [],
      orbs: [],
      sparks: [],
      companionDamage: companionDamage(denLevel),
      companionTimer: 1.2,
      companionHits: 0,
      preview: [],
      launcher: { x: W / 2, y: H - 64 },
    };
  }

  function walletDiamonds() {
    return window.WeightPlayWallet?.read?.().diamonds || 0;
  }

  function show(panel) {
    [nodes.menuPanel, nodes.stagePanel, nodes.gamePanel, nodes.upgradePanel, nodes.resultPanel].forEach((node) => node.classList.add("is-hidden"));
    const resultOpen = panel === nodes.resultPanel;
    if (resultOpen) nodes.gamePanel.classList.remove("is-hidden");
    panel.classList.remove("is-hidden");
    $("battleLive").inert = resultOpen;
    $("battleLive").setAttribute("aria-hidden", resultOpen ? "true" : "false");
    document.body.classList.toggle("orb-fortress-playing", panel !== nodes.menuPanel);
    updateOrbBattleScale();
    fitOrbArena();
    window.requestAnimationFrame(fitOrbArena);
    if (panel === nodes.stagePanel) window.requestAnimationFrame(centerUnlockedStage);
  }

  function updateOrbBattleScale() {
    if (!document.body.classList.contains("orb-fortress-playing")) return;
    const viewport = window.visualViewport;
    const visualWidth = Math.round(viewport?.width || 0);
    const visualHeight = Math.round(viewport?.height || 0);
    const useVisual = visualWidth > 0 && visualHeight > 0 && Math.abs(visualWidth - innerWidth) <= 2 && visualHeight <= innerHeight + 2;
    const root = document.documentElement.style;
    root.setProperty("--orb-vw", `${useVisual ? visualWidth : innerWidth}px`);
    root.setProperty("--orb-vh", `${useVisual ? visualHeight : innerHeight}px`);
  }

  function fitOrbArena() {
    if (!document.body.classList.contains("orb-fortress-playing") || nodes.gamePanel.classList.contains("is-hidden")) return;
    const panelStyle = getComputedStyle(nodes.gamePanel);
    const rows = panelStyle.gridTemplateRows.split(/\s+/).map(Number.parseFloat).filter(Number.isFinite);
    const columns = panelStyle.gridTemplateColumns.split(/\s+/).map(Number.parseFloat).filter(Number.isFinite);
    const horizontal = (window.visualViewport?.height || innerHeight) <= 560;
    const panelWidth = nodes.gamePanel.clientWidth - Number.parseFloat(panelStyle.paddingLeft) - Number.parseFloat(panelStyle.paddingRight);
    const panelHeight = nodes.gamePanel.clientHeight - Number.parseFloat(panelStyle.paddingTop) - Number.parseFloat(panelStyle.paddingBottom);
    const trackWidth = horizontal ? (columns[1] || panelWidth) : panelWidth;
    const trackHeight = horizontal ? (rows[0] || panelHeight) : (rows[1] || panelHeight);
    const arenaHeight = Math.max(1, Math.min(trackHeight, trackWidth / (W / H)));
    const arenaWidth = arenaHeight * (W / H);
    canvas.style.setProperty("width", `${arenaWidth}px`, "important");
    canvas.style.setProperty("height", `${arenaHeight}px`, "important");
  }

  function configureArena() {
    W = 720;
    H = 1200;
    canvas.width = W;
    canvas.height = H;
    canvas.dataset.orientation = "portrait";
    document.documentElement.style.setProperty("--orb-arena-ratio", `${W} / ${H}`);
  }

  function refreshOrbBattleLayout() {
    updateOrbBattleScale();
    fitOrbArena();
    window.requestAnimationFrame(fitOrbArena);
  }

  window.addEventListener?.("resize", refreshOrbBattleLayout, { passive: true });
  window.addEventListener?.("orientationchange", refreshOrbBattleLayout, { passive: true });
  window.visualViewport?.addEventListener("resize", refreshOrbBattleLayout, { passive: true });

  function setLocale(next) {
    locale = next || "en";
    localStorage.setItem(localeKey, locale);
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : "en";
    if (window.WonderI18n?.locale?.() !== locale) window.WonderI18n?.setLocale?.(locale);
    else window.dispatchEvent(new CustomEvent("wonder:locale-change", { detail: { locale } }));
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
    nodes.lobbyReturn.setAttribute("aria-label", t("backToLobby"));
    nodes.localeSelect.setAttribute("aria-label", t("language"));
    nodes.roomGrid.setAttribute("aria-label", t("fortressRooms"));
    nodes.stagePanel.setAttribute("aria-label", t("raidMap"));
    nodes.stageRail.setAttribute("aria-label", t("raidTiers"));
    nodes.stageBackBtn.setAttribute("aria-label", t("returnMain"));
    canvas.setAttribute("aria-label", t("arenaLabel"));
    nodes.mapBtn.setAttribute("aria-label", t("raidMap"));
    nodes.resultMenuBtn.setAttribute("aria-label", t("raidMap"));
    updatePageMeta();
    nodes.localeSelect.value = locale;
    renderMenu();
    renderHud();
    renderUpgradeCards();
  }

  function preload() {
    const entries = Object.entries(assets);
    let done = 0;
    const finish = () => {
      if (preloadFinished) return;
      preloadFinished = true;
      nodes.loadingText.textContent = "100%";
      nodes.loadingFill.style.width = "100%";
      nodes.loadingPanel.classList.add("is-hidden");
      renderMenu();
      draw();
      maybeSmokeStart();
    };
    entries.forEach(([key, src]) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      images[key] = img;
      img.onload = img.onerror = () => {
        done += 1;
        const pct = Math.round((done / entries.length) * 100);
        nodes.loadingText.textContent = `${pct}%`;
        nodes.loadingFill.style.width = `${pct}%`;
        if (done >= entries.length) finish();
      };
    });
    window.setTimeout(finish, 1800);
  }

  function exposeBasicReady() {
    nodes.loadingPanel.classList.add("is-hidden");
    document.body.dataset.orbFortressBasicReady = "true";
    window.__ANIMAL_ORB_FORTRESS_BOOTED__ = true;
    window.__ANIMAL_ORB_FORTRESS_FIRST_SCREEN__ = {
      title: t("title"),
      locale,
      controls: ["localeSelect", "startBtn"],
      rooms: roomDefs.length,
    };
  }

  function roomCost(id) {
    return 8 + (save.rooms[id] || 0) * 6;
  }

  function companionDamage(level = save.rooms.den || 0) {
    return level >= 2 ? level - 1 : 0;
  }

  function roomProgressText(room, level) {
    if (room.id !== "den") return t(room.desc);
    const currentDamage = companionDamage(level);
    if (currentDamage <= 0) return t("companionLocked");
    const current = t("companionCurrent", { damage: currentDamage });
    if (level >= 5) return current;
    return `${current} ${t("companionNext", { damage: companionDamage(level + 1) })}`;
  }

  function renderMenu() {
    const unlocked = Math.max(1, Math.min(MAX_RAID_TIER, save.bestRaid || 1));
    nodes.bestRaidText.textContent = String(unlocked);
    nodes.starStoneText.textContent = String(save.starStones || 0);
    nodes.diamondText.textContent = String(walletDiamonds());
    nodes.stageProgressText.textContent = t("stageProgress", { unlocked });
    nodes.stageRail.innerHTML = raidDefs
      .map((raid) => {
        const locked = raid.tier > unlocked;
        return `
          <button class="raid-card${locked ? " is-locked" : ""}" type="button" data-tier="${raid.tier}" data-zone="${raid.zone}" aria-disabled="${locked}">
            <span class="raid-number">${raid.tier}</span>
            <strong>${t(raid.name)}</strong>
            <span>${t(raid.desc)}</span>
            <em>${t(raid.rule)} · ${locked ? t("tierLocked") : `${t("enterRaid")} · ${WAVES_PER_RAID} ${t("wave")}`}</em>
          </button>`;
      })
      .join("");
    nodes.roomGrid.innerHTML = roomDefs
      .map((room) => {
        const level = save.rooms[room.id] || 0;
        const cost = roomCost(room.id);
        const canUpgrade = level < 5 && save.starStones >= cost;
        return `
          <div class="room-card">
            <img src="${room.iconSrc}" alt="" />
            <div>
              <strong>${t(room.name)}</strong>
              <span>${t("level", { n: level })} - ${roomProgressText(room, level)}</span>
            </div>
            <button type="button" data-room="${room.id}" ${canUpgrade ? "" : "disabled"}>${level >= 5 ? t("maxed") : t("upgradeRoom", { cost })}</button>
          </div>`;
      })
      .join("");
    if (!nodes.stagePanel.classList.contains("is-hidden")) window.requestAnimationFrame(centerUnlockedStage);
  }

  function centerUnlockedStage() {
    const unlocked = Math.max(1, Math.min(MAX_RAID_TIER, save.bestRaid || 1));
    const card = nodes.stageRail.querySelector(`[data-tier="${unlocked}"]`);
    if (!card) return;
    const left = card.offsetLeft - (nodes.stageRail.clientWidth - card.offsetWidth) / 2;
    nodes.stageRail.scrollTo({ left: Math.max(0, left), behavior: "auto" });
  }

  function upgradeRoom(id) {
    const level = save.rooms[id] || 0;
    const cost = roomCost(id);
    if (level >= 5 || save.starStones < cost) return;
    save.starStones -= cost;
    save.rooms[id] = level + 1;
    persist();
    playSound("success", 0.2);
    renderMenu();
    window.WonderAnalytics?.track("room_upgrade", { game_id: GAME_ID, room: id, level: save.rooms[id] });
  }

  function startRaid(tier = selectedTier) {
    cancelAnimationFrame(raf);
    selectedTier = Math.max(1, Math.min(MAX_RAID_TIER, Number(tier) || 1));
    configureArena();
    state = makeState();
    keyboardAimDeg = -90;
    state.mode = "running";
    save.playCount += 1;
    persist();
    spawnWave();
    show(nodes.gamePanel);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    nodes.hintText.textContent = t("orbReady");
    renderHud();
    window.requestAnimationFrame(() => {
      canvas.focus({ preventScroll: true });
      updateKeyboardAimPreview();
    });
    lastFrame = performance.now();
    playSound("start", 0.2);
    window.WonderAnalytics?.track("raid_start", { game_id: GAME_ID, tier: state.raidTier });
    loop(lastFrame);
  }

  function raidProfile(tier) {
    const zone = Math.ceil(tier / 4);
    const step = (tier - 1) % 4;
    return {
      zone,
      step,
      hpScale: 1 + (tier - 1) * 0.06,
      speedScale: 1 + (tier - 1) * 0.018 + (step === 1 ? 0.08 : 0),
      countBonus: Math.floor((tier - 1) / 4) + (step === 1 ? 2 : 0),
      shieldHits: step === 2 ? Math.min(3, Math.ceil(zone / 2)) : zone >= 4 ? 1 : 0,
      eliteWave: step === 3,
      bossMinions: Math.max(0, zone - 1),
      tint: ["rgba(24,80,52,.04)", "rgba(84,74,18,.10)", "rgba(38,48,112,.12)", "rgba(82,28,106,.14)", "rgba(120,32,38,.16)"][zone - 1],
    };
  }

  function enemyKindFor(zone, index) {
    const patterns = [
      ["skitter", "thorn", "wisp"],
      ["thorn", "skitter", "thorn", "wisp"],
      ["wisp", "skitter", "wisp", "thorn"],
      ["thorn", "wisp", "skitter", "wisp"],
      ["skitter", "thorn", "wisp", "thorn", "wisp"],
    ];
    const pattern = patterns[Math.max(0, Math.min(patterns.length - 1, zone - 1))];
    return pattern[index % pattern.length];
  }

  function spawnWave() {
    state.enemies = [];
    const tier = state.raidTier;
    const wave = state.wave;
    const profile = raidProfile(tier);
    if (wave >= WAVES_PER_RAID) {
      const bossHp = Math.round((22 + tier * 3) * (1 + (tier - 1) * 0.045));
      state.enemies.push(makeEnemy("boss", W / 2, Math.max(96, H * 0.09), bossHp, 13 * profile.speedScale, 55, { elite: tier >= 16, shield: profile.shieldHits }));
      for (let i = 0; i < profile.bossMinions; i += 1) {
        const x = W * (0.18 + (i / Math.max(1, profile.bossMinions - 1)) * 0.64);
        const kind = enemyKindFor(profile.zone, i + tier);
        state.enemies.push(makeEnemy(kind, x, Math.max(190, H * 0.16) + (i % 2) * 62, Math.round((7 + tier * 0.7) * profile.hpScale), (kind === "thorn" ? 9 : 15) * profile.speedScale, kind === "thorn" ? 33 : 27, { shield: Math.max(0, profile.shieldHits - 1) }));
      }
    } else {
      const count = Math.min(10, 2 + wave + profile.countBonus);
      for (let i = 0; i < count; i += 1) {
        const kind = enemyKindFor(profile.zone, i + wave);
        const side = W * 0.14;
        const span = W - side * 2;
        const hp = Math.round((4 + wave * 2 + tier * 0.62) * profile.hpScale * (kind === "thorn" ? 1.18 : 1));
        state.enemies.push(makeEnemy(kind, side + i * (span / Math.max(1, count - 1)), Math.max(82, H * 0.075) + (i % 2) * 54, hp, (kind === "thorn" ? 9 : kind === "wisp" ? 16 : 14) * profile.speedScale, kind === "thorn" ? 33 : 27, { shield: profile.shieldHits }));
      }
      if (wave === 2 && profile.eliteWave) {
        const kind = enemyKindFor(profile.zone, tier + 2);
        state.enemies.push(makeEnemy(kind, W / 2, Math.max(230, H * 0.2), Math.round((12 + tier) * profile.hpScale), 11 * profile.speedScale, 42, { elite: true, shield: profile.shieldHits }));
      }
    }
    renderHud();
  }

  function makeEnemy(kind, x, y, hp, speed, size, options = {}) {
    const shield = Math.max(0, options.shield || 0);
    return { kind, x, y, hp, maxHp: hp, speed: speed * (H / 540), size, hitTimer: 0, shield, maxShield: shield, elite: Boolean(options.elite) };
  }

  function renderHud() {
    nodes.waveText.textContent = `${t("tierShort", { tier: state.raidTier })} · ${Math.min(state.wave, 3)}/3`;
    nodes.coreText.textContent = `${Math.max(0, Math.ceil(state.core))}/${state.maxCore}`;
    nodes.shotText.textContent = String(state.shotCount);
  }

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const source = event.touches?.[0] || event.changedTouches?.[0] || event;
    return {
      x: ((source.clientX - rect.left) / rect.width) * W,
      y: ((source.clientY - rect.top) / rect.height) * H,
    };
  }

  function onPointerStart(event) {
    if (state.mode !== "running" || !canFireOrb()) return;
    event.preventDefault();
    pointer.active = true;
    Object.assign(pointer, canvasPoint(event));
    state.preview = previewPath(pointer.x, pointer.y);
  }

  function onPointerMove(event) {
    if (!pointer.active) return;
    event.preventDefault();
    Object.assign(pointer, canvasPoint(event));
    state.preview = previewPath(pointer.x, pointer.y);
  }

  function onPointerEnd(event) {
    if (!pointer.active) return;
    event.preventDefault();
    pointer.active = false;
    Object.assign(pointer, canvasPoint(event));
    releaseOrb(pointer.x, pointer.y);
  }

  function aimVector(x, y) {
    const dx = x - state.launcher.x;
    const dy = y - state.launcher.y;
    const len = Math.max(1, Math.hypot(dx, dy));
    const power = 520 * (H / 540);
    return { vx: (dx / len) * power, vy: (dy / len) * power };
  }

  function previewPath(x, y) {
    const v = aimVector(x, y);
    let px = state.launcher.x;
    let py = state.launcher.y;
    let vx = v.vx;
    let vy = v.vy;
    const points = [{ x: px, y: py }];
    for (let i = 0; i < 85; i += 1) {
      px += vx * 0.035;
      py += vy * 0.035;
      if (px < 46 || px > W - 46) {
        vx *= -1;
        px = Math.max(46, Math.min(W - 46, px));
      }
      if (py < 46 || py > H - 46) {
        vy *= -1;
        py = Math.max(46, Math.min(H - 46, py));
      }
      if (i % 10 === 0) points.push({ x: px, y: py });
    }
    return points;
  }

  function keyboardAimPoint() {
    const radians = keyboardAimDeg * Math.PI / 180;
    const distance = Math.max(W, H);
    return {
      x: state.launcher.x + Math.cos(radians) * distance,
      y: state.launcher.y + Math.sin(radians) * distance,
    };
  }

  function updateKeyboardAimPreview() {
    if (state.mode !== "running") return;
    const target = keyboardAimPoint();
    const angle = Math.round(keyboardAimDeg + 90);
    state.preview = previewPath(target.x, target.y);
    nodes.hintText.textContent = t("keyboardAim", { angle });
    canvas.setAttribute("aria-label", t("arenaControlLabel", { angle }));
  }

  function onCanvasKeydown(event) {
    if (state.mode !== "running") return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      keyboardAimDeg = Math.max(-165, Math.min(-15, keyboardAimDeg + (event.key === "ArrowLeft" ? -6 : 6)));
      updateKeyboardAimPreview();
      return;
    }
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    if (!canFireOrb()) {
      nodes.hintText.textContent = t("orbFlying");
      return;
    }
    const target = keyboardAimPoint();
    releaseOrb(target.x, target.y);
  }

  function releaseOrb(x, y) {
    if (!canFireOrb()) return;
    const v = aimVector(x, y);
    const limit = activeOrbLimit();
    const volley = [
      { vx: v.vx, vy: v.vy, skin: state.shotCount % 5, scale: 1 },
      { vx: v.vx * 0.86 - 68, vy: v.vy * 0.9, skin: (state.shotCount + 1) % 5, scale: 0.72 },
    ];
    if (state.split) volley.push({ vx: v.vx * 0.82 + 74, vy: v.vy * 0.88, skin: (state.shotCount + 2) % 5, scale: 0.62 });
    volley.forEach((shot) => {
      if (state.orbs.length < limit) state.orbs.push(makeOrb(shot.vx, shot.vy, shot.skin, shot.scale));
    });
    state.preview = [];
    state.shotCount += 1;
    state.readyTimer = state.orbCooldown;
    nodes.hintText.textContent = t("orbFlying");
    playSound("pop", 0.08);
    window.WonderAnalytics?.track("shot_fired", { game_id: GAME_ID, wave: state.wave, split: state.split });
    renderHud();
  }

  function makeOrb(vx, vy, skin, damageScale = 1) {
    return { x: state.launcher.x, y: state.launcher.y, vx, vy, r: 20, life: 5.2, damage: Math.max(1, Math.round(state.baseDamage * damageScale)), skin, hits: new Map() };
  }

  function activeOrbLimit() {
    return state.split ? 6 : 4;
  }

  function canFireOrb() {
    return state.readyTimer <= 0 && state.orbs.length < activeOrbLimit();
  }

  function loop(now) {
    const dt = Math.min(0.033, (now - lastFrame) / 1000 || 0.016);
    lastFrame = now;
    if (state.mode === "running") {
      update(dt);
      draw();
      raf = requestAnimationFrame(loop);
    }
  }

  function update(dt) {
    state.readyTimer = Math.max(0, state.readyTimer - dt);
    state.enemies.forEach((enemy) => {
      const dx = state.launcher.x - enemy.x;
      const dy = state.launcher.y - enemy.y;
      const len = Math.max(1, Math.hypot(dx, dy));
      enemy.x += (dx / len) * enemy.speed * dt;
      enemy.y += (dy / len) * enemy.speed * dt;
      enemy.hitTimer = Math.max(0, enemy.hitTimer - dt);
      if (Math.hypot(enemy.x - state.launcher.x, enemy.y - state.launcher.y) < enemy.size * 0.7) {
        state.core -= enemy.kind === "boss" ? 4 : enemy.kind === "thorn" ? 3 : 2;
        enemy.hp = 0;
        nodes.hintText.textContent = t("fortressHit");
        playSound("wrong", 0.2);
        renderHud();
      }
    });
    updateCompanion(dt);
    state.enemies = state.enemies.filter((enemy) => enemy.hp > 0);

    state.orbs.forEach((orb) => updateOrb(orb, dt));
    state.orbs = state.orbs.filter((orb) => orb.life > 0);
    state.sparks.forEach((spark) => (spark.life -= dt));
    state.sparks = state.sparks.filter((spark) => spark.life > 0);

    if (state.core <= 0) finishRaid(false);
    else if (state.enemies.length === 0) {
      if (state.wave >= WAVES_PER_RAID) finishRaid(true);
      else showUpgrade();
    } else if (canFireOrb()) {
      nodes.hintText.textContent = t("orbReady");
    }
  }

  function updateCompanion(dt) {
    if (state.companionDamage <= 0 || state.enemies.length === 0) return;
    state.companionTimer = Math.max(0, state.companionTimer - dt);
    if (state.companionTimer > 0) return;
    const target = state.enemies
      .filter((enemy) => enemy.hp > 0)
      .sort((a, b) => Math.hypot(a.x - state.launcher.x, a.y - state.launcher.y) - Math.hypot(b.x - state.launcher.x, b.y - state.launcher.y))[0];
    if (!target) return;
    if (target.shield > 0) target.shield -= 1;
    else target.hp -= state.companionDamage;
    target.hitTimer = 0.22;
    state.companionHits += 1;
    state.companionTimer = 4;
    state.sparks.push({
      kind: "companion",
      x: target.x,
      y: target.y,
      fromX: state.launcher.x,
      fromY: state.launcher.y - 44,
      life: 0.34,
      maxLife: 0.34,
    });
    playSound("hit", 0.08);
  }

  function updateOrb(orb, dt) {
    orb.life -= dt;
    orb.x += orb.vx * dt;
    orb.y += orb.vy * dt;
    if (orb.x < 38 || orb.x > W - 38) {
      orb.vx *= -1;
      orb.x = Math.max(38, Math.min(W - 38, orb.x));
      playSound("click", 0.08);
    }
    if (orb.y < 38 || orb.y > H - 38) {
      orb.vy *= -1;
      orb.y = Math.max(38, Math.min(H - 38, orb.y));
      playSound("click", 0.08);
    }
    state.enemies.forEach((enemy) => {
      const recent = orb.hits.get(enemy) || 0;
      if (recent > 0) {
        orb.hits.set(enemy, recent - dt);
        return;
      }
      const enemyVisualRadius = enemy.kind === "boss" ? 76 : enemy.size * 1.05;
      if (Math.hypot(orb.x - enemy.x, orb.y - enemy.y) < orb.r + enemyVisualRadius) {
        if (enemy.shield > 0) enemy.shield -= 1;
        else enemy.hp -= orb.damage;
        enemy.hitTimer = 0.16;
        orb.hits.set(enemy, state.pierce ? 0.2 : 0.55);
        state.sparks.push({ x: enemy.x, y: enemy.y, life: 0.25 });
        playSound("hit", 0.06);
      }
    });
  }

  function showUpgrade() {
    state.mode = "upgrade";
    cancelAnimationFrame(raf);
    state.stonesEarned += 3 + state.wave + (save.rooms.tower || 0);
    nodes.hintText.textContent = t("waveClear");
    renderUpgradeCards();
    show(nodes.upgradePanel);
    window.WonderAnalytics?.track("wave_clear", { game_id: GAME_ID, wave: state.wave });
  }

  function currentUpgradeChoices() {
    const seed = state.wave + state.shotCount + (state.rerolled ? 5 : 0);
    return [0, 1, 2].map((offset) => upgradeDefs[(seed + offset) % upgradeDefs.length]);
  }

  let rerollConfirmTimer = 0;

  function clearRerollConfirmation() {
    clearTimeout(rerollConfirmTimer);
    state.rerollPending = false;
  }

  function renderUpgradeCards() {
    if (!nodes.upgradeCards) return;
    const choices = currentUpgradeChoices();
    const balance = walletDiamonds();
    nodes.upgradeStatus.textContent = state.rerolled
      ? t("rerolled")
      : state.rerollPending
        ? t("rerollDecision", { before: balance, after: Math.max(0, balance - rerollCost) })
        : "";
    nodes.rerollBtn.textContent = state.rerollPending
      ? t("rerollConfirm", { before: balance, after: Math.max(0, balance - rerollCost) })
      : `${t("reroll")} (${balance})`;
    nodes.rerollBtn.setAttribute("aria-label", state.rerollPending
      ? t("rerollConfirmLabel", { before: balance, after: Math.max(0, balance - rerollCost) })
      : t("rerollLabel", { balance }));
    nodes.rerollBtn.classList.toggle("is-confirming", state.rerollPending);
    nodes.rerollBtn.disabled = state.rerolled;
    nodes.upgradeCards.innerHTML = choices
      .map(
        (upgrade) => `
          <button type="button" class="upgrade-card" data-upgrade="${upgrade.id}">
            <img class="upgrade-icon" src="${upgrade.iconSrc}" alt="" />
            <strong>${t(upgrade.name)}</strong>
            <span>${t(upgrade.desc)}</span>
          </button>`
      )
      .join("");
  }

  function chooseUpgrade(id) {
    if (state.mode !== "upgrade") return;
    clearRerollConfirmation();
    if (id === "damage") state.baseDamage += 1;
    if (id === "split") state.split = true;
    if (id === "pierce") state.pierce = true;
    if (id === "recharge") state.orbCooldown = Math.max(0.25, state.orbCooldown - 0.16);
    if (id === "shield") state.core = Math.min(state.maxCore, state.core + 4);
    if (id === "magnet") state.bonusStones += 2;
    state.wave += 1;
    state.rerolled = false;
    spawnWave();
    state.mode = "running";
    show(nodes.gamePanel);
    playSound("success", 0.2);
    window.WonderAnalytics?.track("upgrade_pick", { game_id: GAME_ID, upgrade: id, wave: state.wave });
    lastFrame = performance.now();
    loop(lastFrame);
  }

  function rerollChoices() {
    if (state.mode !== "upgrade" || state.rerolled) return;
    const balance = walletDiamonds();
    if (balance < rerollCost) {
      clearRerollConfirmation();
      nodes.upgradeStatus.textContent = t("rerollNeed", { balance });
      nodes.rerollBtn.classList.remove("is-confirming");
      playSound("wrong", 0.2);
      return;
    }
    if (!state.rerollPending) {
      state.rerollPending = true;
      renderUpgradeCards();
      rerollConfirmTimer = window.setTimeout(() => {
        if (state.mode !== "upgrade" || state.rerolled) return;
        state.rerollPending = false;
        renderUpgradeCards();
      }, 5000);
      return;
    }
    clearRerollConfirmation();
    const wallet = window.WeightPlayWallet;
    if (!wallet?.spendDiamonds || !wallet.spendDiamonds(rerollCost)) {
      nodes.upgradeStatus.textContent = t("rerollNeed", { balance: walletDiamonds() });
      playSound("wrong", 0.2);
      return;
    }
    state.rerolled = true;
    renderUpgradeCards();
    window.WonderAnalytics?.track("relic_reroll", { game_id: GAME_ID, cost: rerollCost });
  }

  function finishRaid(win) {
    if (state.mode === "result") return;
    state.mode = "result";
    cancelAnimationFrame(raf);
    const stones = Math.max(1, state.stonesEarned + state.bonusStones + (win ? 5 : 1));
    save.starStones += stones;
    if (win) save.bestRaid = Math.max(1, Math.min(MAX_RAID_TIER, Math.max(save.bestRaid || 1, state.raidTier + 1)));
    persist();
    nodes.resultTitle.textContent = t(win ? "raidClear" : "raidFailed");
    const resultSummary = t(win ? "resultWin" : "resultLose", {
      tier: state.raidTier,
      wave: Math.min(3, state.wave),
      stones,
      core: Math.max(0, Math.ceil(state.core)),
    });
    const progressKey = win ? (state.raidTier < MAX_RAID_TIER ? "progressUnlocked" : "progressComplete") : "progressSaved";
    nodes.resultText.textContent = `${resultSummary} ${t(progressKey, {
      total: save.starStones,
      best: Math.max(1, Math.min(MAX_RAID_TIER, save.bestRaid || 1)),
    })}`;
    nodes.skillReportText.textContent = t(win ? "reportWin" : "reportLose");
    const hasNextStage = win && state.raidTier < MAX_RAID_TIER;
    nodes.nextStageBtn.classList.toggle("is-unavailable", !hasNextStage);
    nodes.nextStageBtn.disabled = !hasNextStage;
    show(nodes.resultPanel);
    (hasNextStage ? nodes.nextStageBtn : nodes.retryBtn).focus({ preventScroll: true });
    renderMenu();
    playSound(win ? "success" : "wrong", 0.2);
    window.WonderAnalytics?.track("raid_result", { game_id: GAME_ID, win, wave: Math.min(3, state.wave), stones });
  }

  function drawAtlas(img, index, count, x, y, size) {
    if (!img?.complete || !img.naturalWidth) return;
    const sw = img.naturalWidth / count;
    const sh = img.naturalHeight;
    ctx.drawImage(img, sw * index, 0, sw, sh, x - size / 2, y - size / 2, size, size);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    if (images.bg?.complete) drawImageCover(images.bg, 0, 0, W, H);
    ctx.fillStyle = "rgba(3, 10, 28, 0.34)";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = raidProfile(state.raidTier).tint;
    ctx.fillRect(0, 0, W, H);
    const contrastGlow = ctx.createRadialGradient(W * 0.5, H * 0.35, 80, W * 0.5, H * 0.45, W * 0.7);
    contrastGlow.addColorStop(0, "rgba(24, 41, 84, 0.18)");
    contrastGlow.addColorStop(0.62, "rgba(8, 18, 42, 0.24)");
    contrastGlow.addColorStop(1, "rgba(3, 9, 24, 0.46)");
    ctx.fillStyle = contrastGlow;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(126, 255, 202, 0.6)";
    ctx.lineWidth = 5;
    ctx.strokeRect(34, 34, W - 68, H - 68);

    if (state.preview.length > 1) {
      ctx.strokeStyle = "rgba(255, 230, 112, 0.86)";
      ctx.lineWidth = 4;
      ctx.setLineDash([12, 10]);
      ctx.beginPath();
      ctx.moveTo(state.preview[0].x, state.preview[0].y);
      state.preview.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
      ctx.setLineDash([]);
    }

    state.enemies.forEach(drawEnemy);
    state.orbs.forEach((orb) => drawAtlas(images.orbs, orb.skin || 0, 5, orb.x, orb.y, 48));
    state.sparks.forEach((spark) => {
      const maxLife = spark.maxLife || 0.25;
      ctx.globalAlpha = Math.max(0, spark.life / maxLife);
      if (spark.kind === "companion") {
        ctx.strokeStyle = "#7dffd0";
        ctx.lineWidth = 9;
        ctx.shadowColor = "#f7df62";
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.moveTo(spark.fromX, spark.fromY);
        ctx.lineTo(spark.x, spark.y);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      drawAtlas(images.fx, 1, 4, spark.x, spark.y, 70);
      ctx.globalAlpha = 1;
    });

    drawCore();
    drawAtlas(images.lion, 0, 1, state.launcher.x, state.launcher.y + 8, 86);
  }

  function drawImageCover(image, x, y, width, height) {
    const sourceRatio = image.naturalWidth / image.naturalHeight;
    const targetRatio = width / height;
    let sourceWidth = image.naturalWidth;
    let sourceHeight = image.naturalHeight;
    let sourceX = 0;
    let sourceY = 0;
    if (sourceRatio > targetRatio) {
      sourceWidth = image.naturalHeight * targetRatio;
      sourceX = (image.naturalWidth - sourceWidth) / 2;
    } else {
      sourceHeight = image.naturalWidth / targetRatio;
      sourceY = (image.naturalHeight - sourceHeight) / 2;
    }
    ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
  }

  function drawEnemy(enemy) {
    const size = enemy.kind === "boss" ? 132 : enemy.size * 2.25;
    ctx.save();
    const aura = enemy.kind === "thorn" ? "#ffd56a" : enemy.kind === "boss" ? "#ff5f91" : "#8ee7ff";
    const shadow = enemy.kind === "thorn" ? "rgba(255, 202, 86, 0.9)" : enemy.kind === "boss" ? "rgba(255, 86, 128, 0.9)" : "rgba(132, 210, 255, 0.88)";
    const halo = ctx.createRadialGradient(enemy.x, enemy.y, size * 0.14, enemy.x, enemy.y, size * 0.9);
    halo.addColorStop(0, "rgba(3, 10, 30, 0.18)");
    halo.addColorStop(0.58, "rgba(3, 10, 30, 0.5)");
    halo.addColorStop(1, "rgba(3, 10, 30, 0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, size * 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = shadow;
    ctx.shadowBlur = enemy.hitTimer > 0 ? 46 : 32;
    ctx.fillStyle = enemy.kind === "boss" ? "rgba(45, 4, 35, 0.96)" : "rgba(1, 7, 26, 0.94)";
    ctx.beginPath();
    ctx.ellipse(enemy.x, enemy.y + size * 0.1, size * 0.74, size * 0.58, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = aura;
    ctx.lineWidth = enemy.kind === "boss" ? 8 : 5;
    ctx.globalAlpha = enemy.hitTimer > 0 ? 1 : 0.88;
    ctx.stroke();
    ctx.globalAlpha = 1;
    if (enemy.kind === "boss") drawAtlas(images.boss, 0, 1, enemy.x, enemy.y, size);
    else drawAtlas(images.beasts, enemy.kind === "skitter" ? 0 : enemy.kind === "thorn" ? 1 : 2, 3, enemy.x, enemy.y, size);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = enemy.hitTimer > 0 ? "#fff7a8" : "rgba(244, 255, 236, 0.98)";
    ctx.lineWidth = enemy.kind === "boss" ? 4.5 : 3;
    ctx.beginPath();
    ctx.ellipse(enemy.x, enemy.y + size * 0.08, size * 0.54, size * 0.44, 0, 0, Math.PI * 2);
    ctx.stroke();
    if (enemy.elite) {
      ctx.strokeStyle = "#ffd86b";
      ctx.lineWidth = 7;
      ctx.setLineDash([12, 8]);
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, size * 0.68, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    if (enemy.shield > 0) {
      ctx.strokeStyle = "rgba(126, 233, 255, 0.96)";
      ctx.lineWidth = 6;
      ctx.shadowColor = "#7de9ff";
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, size * 0.76, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    ctx.restore();
    const barW = Math.max(48, size * 0.58);
    ctx.fillStyle = "rgba(0, 5, 17, 0.96)";
    ctx.fillRect(enemy.x - barW / 2 - 3, enemy.y - size * 0.5 - 3, barW + 6, 13);
    ctx.fillStyle = "rgba(221, 247, 255, 0.22)";
    ctx.fillRect(enemy.x - barW / 2 - 1, enemy.y - size * 0.5 - 1, barW + 2, 9);
    ctx.fillStyle = enemy.hitTimer > 0 ? "#fff06a" : "#ff6478";
    ctx.fillRect(enemy.x - barW / 2, enemy.y - size * 0.5, barW * Math.max(0, enemy.hp / enemy.maxHp), 7);
  }

  function drawCore() {
    const pct = Math.max(0, state.core / state.maxCore);
    ctx.fillStyle = "rgba(4, 20, 18, 0.34)";
    ctx.beginPath();
    ctx.arc(state.launcher.x, state.launcher.y, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = pct > 0.35 ? "#7dffd0" : "#ff6878";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(state.launcher.x, state.launcher.y, 49, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
    ctx.stroke();
  }

  function maybeSmokeStart() {
    const params = new URLSearchParams(location.search);
    if (params.get("smoke") === "1" && params.get("autostart") === "1") {
      window.setTimeout(startRaid, 80);
    }
  }

  nodes.localeSelect.addEventListener("change", (event) => setLocale(event.target.value));
  nodes.startBtn.addEventListener("click", () => {
    show(nodes.stagePanel);
    renderMenu();
  });
  nodes.stageBackBtn.addEventListener("click", () => show(nodes.menuPanel));
  nodes.stageRail.addEventListener("click", (event) => {
    const tier = Number(event.target?.closest?.("[data-tier]")?.dataset?.tier);
    if (tier && tier <= Math.max(1, Math.min(MAX_RAID_TIER, save.bestRaid || 1))) startRaid(tier);
  });
  nodes.retryBtn.addEventListener("click", () => startRaid(state.raidTier));
  nodes.nextStageBtn.addEventListener("click", () => {
    if (!nodes.nextStageBtn.disabled && state.raidTier < MAX_RAID_TIER) startRaid(state.raidTier + 1);
  });
  nodes.mapBtn.addEventListener("click", () => {
    state.mode = "stage";
    cancelAnimationFrame(raf);
    show(nodes.stagePanel);
    renderMenu();
  });
  nodes.resultMenuBtn.addEventListener("click", () => {
    show(nodes.stagePanel);
    renderMenu();
  });
  nodes.roomGrid.addEventListener("click", (event) => {
    const id = event.target?.dataset?.room;
    if (id) upgradeRoom(id);
  });
  nodes.upgradeCards.addEventListener("click", (event) => {
    const id = event.target?.closest?.("[data-upgrade]")?.dataset?.upgrade;
    if (id) chooseUpgrade(id);
  });
  nodes.rerollBtn.addEventListener("click", rerollChoices);
  canvas.addEventListener("pointerdown", onPointerStart);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerEnd);
  canvas.addEventListener("pointercancel", onPointerEnd);
  canvas.addEventListener("keydown", onCanvasKeydown);

  window.__animalOrbFortressSmoke = {
    snapshot: () => ({
      mode: state.mode,
      wave: state.wave,
      raidTier: state.raidTier,
      core: state.core,
      maxCore: state.maxCore,
      shotCount: state.shotCount,
      enemies: state.enemies.length,
      enemyKinds: state.enemies.map((enemy) => enemy.kind),
      totalEnemyHp: state.enemies.reduce((total, enemy) => total + enemy.hp, 0),
      maxEnemySpeed: state.enemies.reduce((max, enemy) => Math.max(max, enemy.speed), 0),
      shieldedEnemies: state.enemies.filter((enemy) => enemy.shield > 0).length,
      eliteEnemies: state.enemies.filter((enemy) => enemy.elite).length,
      orbs: state.orbs.length,
      activeOrbLimit: activeOrbLimit(),
      previewPoints: state.preview.length,
      keyboardAim: Math.round(keyboardAimDeg + 90),
      stonesEarned: state.stonesEarned,
      companionDamage: state.companionDamage,
      companionTimer: state.companionTimer,
      companionHits: state.companionHits,
      rerolled: state.rerolled,
      walletDiamonds: walletDiamonds(),
      save,
      title: t("title"),
    }),
    forceClearWave: () => {
      state.enemies = [];
      update(0.016);
    },
    forceCoreBreach: () => {
      state.enemies = [makeEnemy("skitter", state.launcher.x, state.launcher.y - 10, 1, 0, 42)];
      state.core = 1;
      update(0.016);
    },
    forceWin: () => finishRaid(true),
    forceCollisionProbe: () => {
      const enemy = makeEnemy("skitter", state.launcher.x, state.launcher.y - 90, 8, 0, 42);
      const orb = makeOrb(0, -80, 0);
      orb.x = enemy.x;
      orb.y = enemy.y + orb.r + enemy.size * 0.7 - 2;
      state.enemies = [enemy];
      state.orbs = [orb];
      const before = enemy.hp;
      updateOrb(orb, 0.016);
      return { before, after: enemy.hp, damage: before - enemy.hp, distance: Math.hypot(orb.x - enemy.x, orb.y - enemy.y) };
    },
    setRoomLevel: (id, level) => {
      if (!roomDefs.some((room) => room.id === id)) return null;
      save.rooms[id] = Math.max(0, Math.min(5, Math.floor(Number(level) || 0)));
      persist();
      renderMenu();
      return save.rooms[id];
    },
    setBestRaid: (tier) => {
      save.bestRaid = Math.max(1, Math.min(MAX_RAID_TIER, Math.floor(Number(tier) || 1)));
      persist();
      renderMenu();
      return save.bestRaid;
    },
    forceCompanionStrike: () => {
      const target = makeEnemy("skitter", state.launcher.x, state.launcher.y - 180, 8, 0, 42);
      state.enemies = [target];
      state.companionTimer = 0;
      const before = target.hp;
      updateCompanion(0.016);
      return {
        before,
        after: target.hp,
        damage: before - target.hp,
        companionHits: state.companionHits,
        effect: state.sparks.at(-1)?.kind || "",
      };
    },
  };

  setLocale(locale);
  exposeBasicReady();
  preload();
})();
