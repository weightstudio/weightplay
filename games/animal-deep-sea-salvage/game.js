(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const t = (key, vars) => window.deepSeaT?.(key, vars) || key;
  const STORE_KEY = "weightplay:animal-deep-sea-salvage:v1";
  const LEGACY_KEYS = ["weightplay_animal_deep_sea_salvage_v1"];
  const MAX_OFFLINE_MS = 8 * 60 * 60 * 1000;
  const OFFLINE_RATE = 0.72;
  const LOCALE_LABELS = {
    en: "English", "zh-Hant": "繁體中文", "zh-Hans": "简体中文", ja: "日本語", ko: "한국어", es: "Español",
    "pt-BR": "Português", fr: "Français", de: "Deutsch", it: "Italiano", ru: "Русский", hi: "हिन्दी", ar: "العربية",
  };
  const LOCALE_CODES = Object.keys(LOCALE_LABELS);

  const CONFIG = Object.freeze({
    zones: [
      { id: "harbour", name: "Shallow Sea", nameKey: "zoneShallow", minDepth: 0, maxDepth: 180, color: "#5bd3da", habitatKey: "habitatShallow" },
      { id: "wreck", name: "Wreck Waters", nameKey: "zoneWreck", minDepth: 180, maxDepth: 420, color: "#f1bb65", habitatKey: "habitatWreck" },
      { id: "canyon", name: "Deep Canyon", nameKey: "zoneCanyon", minDepth: 420, maxDepth: 680, color: "#67b5db", habitatKey: "habitatCanyon" },
      { id: "midnight", name: "Dark Midnight", nameKey: "zoneMidnight", minDepth: 680, maxDepth: 920, color: "#a6a4ff", habitatKey: "habitatMidnight" },
      { id: "volcano", name: "Seafloor Volcano", nameKey: "zoneVolcano", minDepth: 920, maxDepth: 1180, color: "#f2876d", habitatKey: "habitatVolcano" },
      { id: "ruins", name: "Ancient Ruins", nameKey: "zoneRuins", minDepth: 1180, maxDepth: 1500, color: "#d8b37d", habitatKey: "habitatRuins" },
      { id: "abyss", name: "Unknown Abyss", nameKey: "zoneAbyss", minDepth: 1500, maxDepth: 1900, color: "#8db5ff", habitatKey: "habitatAbyss" },
    ],
    loot: [
      { id: "metal", key: "lootMetal", minDepth: 0, baseValue: 8, weight: 1, salvageMs: 350, rarity: "common", category: "supply", icon: "▦" },
      { id: "crate", key: "lootCrate", minDepth: 70, baseValue: 18, weight: 2, salvageMs: 500, rarity: "common", category: "supply", icon: "▤" },
      { id: "parts", key: "lootParts", minDepth: 140, baseValue: 26, weight: 1, salvageMs: 420, rarity: "common", category: "supply", icon: "⌁" },
      { id: "mineral", key: "lootMineral", minDepth: 260, baseValue: 56, weight: 2, salvageMs: 700, rarity: "uncommon", category: "mineral", icon: "◆" },
      { id: "pearl", key: "lootPearl", minDepth: 360, baseValue: 96, weight: 1, salvageMs: 620, rarity: "uncommon", category: "treasure", icon: "✦" },
      { id: "antique", key: "lootAntique", minDepth: 500, baseValue: 150, weight: 2, salvageMs: 900, rarity: "uncommon", category: "antique", icon: "◒" },
      { id: "fossil", key: "lootFossil", minDepth: 700, baseValue: 260, weight: 1, salvageMs: 1100, rarity: "rare", category: "collection", collection: true, icon: "◉" },
      { id: "sunkenShip", key: "lootSunkenShip", minDepth: 180, baseValue: 520, weight: 6, salvageMs: 2200, rarity: "rare", category: "target", special: true, collection: true, icon: "▰" },
      { id: "cargoContainer", key: "lootCargoContainer", minDepth: 260, baseValue: 430, weight: 5, salvageMs: 1800, rarity: "rare", category: "target", special: true, icon: "▣" },
      { id: "volcanicCore", key: "lootVolcanicCore", minDepth: 920, baseValue: 680, weight: 3, salvageMs: 1900, rarity: "rare", category: "collection", special: true, collection: true, icon: "✹" },
      { id: "aircraftWreck", key: "lootAircraftWreck", minDepth: 1000, baseValue: 820, weight: 5, salvageMs: 2600, rarity: "rare", category: "target", special: true, collection: true, icon: "✈" },
      { id: "giantBones", key: "lootGiantBones", minDepth: 1180, baseValue: 1120, weight: 4, salvageMs: 2800, rarity: "legendary", category: "collection", special: true, collection: true, icon: "♒" },
      { id: "ancientRelic", key: "lootAncientRelic", minDepth: 1320, baseValue: 1450, weight: 2, salvageMs: 2400, rarity: "legendary", category: "collection", special: true, collection: true, icon: "♜" },
      { id: "mysteryDevice", key: "lootMysteryDevice", minDepth: 1500, baseValue: 1900, weight: 1, salvageMs: 2100, rarity: "legendary", category: "collection", special: true, collection: true, icon: "⌬" },
      { id: "abyssalCrown", key: "lootAbyssalCrown", minDepth: 1700, baseValue: 2800, weight: 2, salvageMs: 3200, rarity: "legendary", category: "collection", special: true, collection: true, icon: "♛" },
    ],
    upgrades: [
      { id: "dive", key: "upgradeDiving", effectKey: "effectDiving", max: 12, baseCost: 45, costScale: 1.52 },
      { id: "movement", key: "upgradeMovement", effectKey: "effectMovement", max: 12, baseCost: 60, costScale: 1.55 },
      { id: "salvage", key: "upgradeSalvage", effectKey: "effectSalvage", max: 10, baseCost: 80, costScale: 1.56 },
      { id: "cargo", key: "upgradeCargo", effectKey: "effectCargo", max: 8, baseCost: 95, costScale: 1.58 },
      { id: "depth", key: "upgradeDepth", effectKey: "effectDepth", max: 18, baseCost: 140, costScale: 1.62 },
      { id: "value", key: "upgradeValue", effectKey: "effectValue", max: 10, baseCost: 125, costScale: 1.6 },
      { id: "robots", key: "upgradeRobots", effectKey: "effectRobots", max: 7, baseCost: 380, costScale: 1.86 },
      { id: "rare", key: "upgradeRare", effectKey: "effectRare", max: 10, baseCost: 210, costScale: 1.68 },
    ],
    missions: [
      { id: "first-dive", key: "missionDive", metric: "dives", target: 1, reward: 70 },
      { id: "deep-pocket", key: "missionValue", metric: "sold", target: 500, reward: 150 },
      { id: "new-current", key: "missionDepth", metric: "depth", target: 420, reward: 260 },
      { id: "cabinet", key: "missionMuseum", metric: "museum", target: 3, reward: 360 },
      { id: "crew", key: "missionRobots", metric: "robots", target: 3, reward: 700 },
      { id: "rare-haul", key: "missionRare", metric: "rare", target: 3, reward: 880 },
      { id: "captain", key: "missionDive", metric: "dives", target: 20, reward: 1200 },
    ],
    dailyMissions: [
      { id: "daily-dives", key: "dailyDive", metric: "dives", target: 3, reward: 110 },
      { id: "daily-salvage", key: "dailySalvage", metric: "sold", target: 320, reward: 160 },
      { id: "daily-event", key: "dailyEvent", metric: "events", target: 1, reward: 220 },
    ],
    achievements: [
      { id: "achievement-first", key: "achievementFirst", metric: "dives", target: 1, reward: 120 },
      { id: "achievement-depth", key: "achievementDepth", metric: "depth", target: 920, reward: 480 },
      { id: "achievement-collection", key: "achievementCollection", metric: "museum", target: 5, reward: 650 },
      { id: "achievement-events", key: "achievementEvents", metric: "events", target: 5, reward: 540 },
      { id: "achievement-weight", key: "achievementWeight", metric: "weight", target: 80, reward: 720 },
      { id: "achievement-crew", key: "achievementCrew", metric: "robots", target: 6, reward: 900 },
    ],
    robotTypes: [
      { id: "scout", key: "robotScout", copyKey: "robotScoutCopy", unlockDepth: 0, speedBonus: 0.1, capacityBonus: 0, rareBonus: 0, levelMax: 8, color: "#6ee7e2" },
      { id: "salvager", key: "robotSalvager", copyKey: "robotSalvagerCopy", unlockDepth: 420, speedBonus: 0.04, capacityBonus: 2, rareBonus: 0.025, levelMax: 8, color: "#ffd36b" },
      { id: "abyss", key: "robotAbyss", copyKey: "robotAbyssCopy", unlockDepth: 1180, speedBonus: -0.01, capacityBonus: 3, rareBonus: 0.08, levelMax: 8, color: "#a6a4ff" },
    ],
    events: [
      { id: "ship", key: "eventShip", copyKey: "eventShipCopy", minDepth: 180, weight: 2.3, bonus: 1.25, lootId: "sunkenShip" },
      { id: "treasure", key: "eventTreasure", copyKey: "eventTreasureCopy", minDepth: 360, weight: 1.8, bonus: 1.55, lootId: "pearl" },
      { id: "quake", key: "eventQuake", copyKey: "eventQuakeCopy", minDepth: 680, weight: 1.25, bonus: 1.18 },
      { id: "sonar", key: "eventSonar", copyKey: "eventSonarCopy", minDepth: 920, weight: 1.1, bonus: 1.42, lootId: "volcanicCore" },
      { id: "creature", key: "eventCreature", copyKey: "eventCreatureCopy", minDepth: 1180, weight: 0.8, bonus: 1.65, lootId: "giantBones" },
      { id: "ruins", key: "eventRuins", copyKey: "eventRuinsCopy", minDepth: 1320, weight: 0.65, bonus: 1.72, lootId: "ancientRelic" },
      { id: "hotspot", key: "eventHotspot", copyKey: "eventHotspotCopy", minDepth: 1500, weight: 0.5, bonus: 1.95, lootId: "mysteryDevice" },
    ],
    techUpgrades: [
      { id: "income", key: "techIncome", effectKey: "techIncomeEffect", max: 8 },
      { id: "speed", key: "techSpeed", effectKey: "techSpeedEffect", max: 8 },
      { id: "rare", key: "techRare", effectKey: "techRareEffect", max: 8 },
      { id: "depth", key: "techDepth", effectKey: "techDepthEffect", max: 8 },
      { id: "offline", key: "techOffline", effectKey: "techOfflineEffect", max: 8 },
    ],
  });

  const els = {
    loading: $("loading"), app: $("app"), locale: $("localeSelect"), reset: $("resetButton"),
    dispatch: $("dispatchButton"), quickDive: $("quickDiveButton"), collect: $("collectButton"),
    funds: $("fundsValue"), depth: $("depthValue"), robots: $("robotsValue"), multiplier: $("multiplierValue"),
    zoneName: $("zoneName"), zoneDepth: $("zoneDepth"), stateBadge: $("diveStateBadge"), canvas: $("oceanCanvas"),
    targetDepth: $("targetDepthValue"), nextDrop: $("nextDropValue"), progress: $("progressValue"), progressFill: $("progressFill"),
    diveStatus: $("diveStatus"), cargo: $("cargoValue"), currentDepth: $("currentDepthValue"), zoneList: $("zoneList"),
    zoneCount: $("zoneCount"), findLog: $("findLog"), totalDives: $("totalDivesLabel"), upgradeList: $("upgradeList"),
    robotList: $("robotList"), robotCount: $("robotCount"), museumGrid: $("museumGrid"), museumCount: $("museumCount"),
    dailyMissionList: $("dailyMissionList"), dailyMissionCount: $("dailyMissionCount"), missionList: $("missionList"), missionCount: $("missionCount"),
    achievementList: $("achievementList"), achievementCount: $("achievementCount"),
    techCopy: $("techCopy"), techUpgradeList: $("techUpgradeList"), research: $("researchValue"), researchMultiplier: $("researchMultiplier"), prestige: $("prestigeButton"),
    eventBanner: $("eventBanner"), eventTitle: $("eventTitle"), eventCopy: $("eventCopy"), eventBonusValue: $("eventBonusValue"), settingsList: $("settingsList"),
    saveState: $("saveState"), offlineModal: $("offlineModal"), offlineValue: $("offlineValue"), offlineCollect: $("offlineCollectButton"), offlineClose: $("offlineCloseButton"),
    toast: $("toast"),
  };

  const memoryStorage = new Map();
  const storageGet = (key) => {
    try { return window.localStorage?.getItem(key) ?? memoryStorage.get(key) ?? null; } catch { return memoryStorage.get(key) ?? null; }
  };
  const storageSet = (key, value) => {
    memoryStorage.set(key, value);
    try { window.localStorage?.setItem(key, value); } catch { /* memory fallback keeps this session playable */ }
  };
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const number = (value) => new Intl.NumberFormat(window.DEEP_SEA_LOCALE === "zh-Hant" ? "zh-TW" : undefined, { maximumFractionDigits: 0 }).format(Math.max(0, Math.round(value || 0)));
  const escapeHtml = (value) => String(value).replace(/[&<>"']/gu, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));

  const ZONE_ALIASES = { kelp: "wreck", trench: "volcano", rift: "ruins" };
  const freshState = () => ({
    version: 2, coins: 120, maxDepth: 120, zoneId: "harbour", robots: 1,
    upgrades: Object.fromEntries(CONFIG.upgrades.map((upgrade) => [upgrade.id, 0])),
    robotRoster: { scout: 1, salvager: 0, abyss: 0 },
    robotLevels: { scout: 0, salvager: 0, abyss: 0 },
    activeRobotType: "scout",
    museum: [], recentFinds: [], missionsClaimed: [], dailyKey: "", dailyClaimed: [], achievementsClaimed: [],
    research: 0, prestigeCount: 0, techLevels: Object.fromEntries(CONFIG.techUpgrades.map((upgrade) => [upgrade.id, 0])),
    totalDives: 0, totalSold: 0, totalValue: 0, totalWeight: 0, rareFound: 0, totalEvents: 0, lastEvent: null,
    dailyProgress: { dives: 0, sold: 0, events: 0 },
    settings: { sound: true, music: true, motion: true },
    lastSavedAt: Date.now(), currentDive: null,
  });

  const normalize = (raw) => {
    const state = freshState();
    if (!raw || typeof raw !== "object") return state;
    for (const key of ["coins", "maxDepth", "robots", "research", "prestigeCount", "totalDives", "totalSold", "totalValue", "totalWeight", "rareFound", "totalEvents", "lastSavedAt"]) {
      if (Number.isFinite(Number(raw[key]))) state[key] = Number(raw[key]);
    }
    const normalizedZoneId = ZONE_ALIASES[raw.zoneId] || raw.zoneId;
    if (CONFIG.zones.some((zone) => zone.id === normalizedZoneId)) state.zoneId = normalizedZoneId;
    if (Array.isArray(raw.museum)) state.museum = raw.museum.filter((id) => CONFIG.loot.some((loot) => loot.id === id && loot.collection));
    if (Array.isArray(raw.recentFinds)) state.recentFinds = raw.recentFinds.slice(0, 8).filter((entry) => entry && typeof entry === "object");
    if (Array.isArray(raw.missionsClaimed)) state.missionsClaimed = raw.missionsClaimed.filter((id) => CONFIG.missions.some((mission) => mission.id === id));
    if (Array.isArray(raw.dailyClaimed)) state.dailyClaimed = raw.dailyClaimed.filter((id) => CONFIG.dailyMissions.some((mission) => mission.id === id));
    if (Array.isArray(raw.achievementsClaimed)) state.achievementsClaimed = raw.achievementsClaimed.filter((id) => CONFIG.achievements.some((achievement) => achievement.id === id));
    for (const upgrade of CONFIG.upgrades) state.upgrades[upgrade.id] = clamp(Number(raw.upgrades?.[upgrade.id] || 0), 0, upgrade.max);
    for (const robot of CONFIG.robotTypes) {
      state.robotRoster[robot.id] = clamp(Number(raw.robotRoster?.[robot.id] ?? (robot.id === "scout" ? raw.robots || 1 : 0)), 0, 8);
      state.robotLevels[robot.id] = clamp(Number(raw.robotLevels?.[robot.id] || 0), 0, robot.levelMax);
    }
    state.activeRobotType = CONFIG.robotTypes.some((robot) => robot.id === raw.activeRobotType) ? raw.activeRobotType : "scout";
    for (const tech of CONFIG.techUpgrades) state.techLevels[tech.id] = clamp(Number(raw.techLevels?.[tech.id] || 0), 0, tech.max);
    state.dailyKey = typeof raw.dailyKey === "string" ? raw.dailyKey : "";
    state.dailyProgress = { ...state.dailyProgress, ...(raw.dailyProgress && typeof raw.dailyProgress === "object" ? raw.dailyProgress : {}) };
    for (const key of Object.keys(state.dailyProgress)) state.dailyProgress[key] = Math.max(0, Number(state.dailyProgress[key]) || 0);
    state.lastEvent = raw.lastEvent && typeof raw.lastEvent === "object" ? raw.lastEvent : null;
    state.settings = { ...state.settings, ...(raw.settings && typeof raw.settings === "object" ? raw.settings : {}) };
    for (const key of Object.keys(state.settings)) state.settings[key] = state.settings[key] !== false;
    state.coins = Math.max(0, state.coins); state.maxDepth = clamp(state.maxDepth, 120, 2200);
    if (CONFIG.robotTypes.every((robot) => state.robotRoster[robot.id] <= 0)) state.robotRoster.scout = 1;
    state.robots = clamp(CONFIG.robotTypes.reduce((sum, robot) => sum + state.robotRoster[robot.id], 0), 1, 24);
    if (raw.currentDive && Number.isFinite(Number(raw.currentDive.startedAt))) {
      state.currentDive = {
        startedAt: Number(raw.currentDive.startedAt),
        durationMs: clamp(Number(raw.currentDive.durationMs) || 17000, 4500, 40000),
        targetDepth: clamp(Number(raw.currentDive.targetDepth) || 70, 10, 1900),
        zoneId: CONFIG.zones.some((zone) => zone.id === (ZONE_ALIASES[raw.currentDive.zoneId] || raw.currentDive.zoneId)) ? (ZONE_ALIASES[raw.currentDive.zoneId] || raw.currentDive.zoneId) : state.zoneId,
        previewLootId: CONFIG.loot.some((loot) => loot.id === raw.currentDive.previewLootId) ? raw.currentDive.previewLootId : "metal",
      };
    }
    return state;
  };

  const loadState = () => {
    let raw = null;
    try { raw = JSON.parse(storageGet(STORE_KEY) || "null"); } catch { raw = null; }
    if (!raw) {
      for (const legacyKey of LEGACY_KEYS) {
        try { raw = JSON.parse(storageGet(legacyKey) || "null"); } catch { raw = null; }
        if (raw) break;
      }
    }
    return normalize(raw);
  };

  let state = loadState();
  let pendingOffline = 0;
  let lastRender = 0;
  let saveTimer = 0;
  let toastTimer = 0;

  const level = (id) => Number(state.upgrades[id] || 0);
  const activeZone = () => CONFIG.zones.find((zone) => zone.id === state.zoneId) || CONFIG.zones[0];
  const techLevel = (id) => Number(state.techLevels?.[id] || 0);
  const effectiveMaxDepth = () => clamp(state.maxDepth + techLevel("depth") * 80, 120, 2200);
  const totalRobots = () => CONFIG.robotTypes.reduce((sum, robot) => sum + Number(state.robotRoster?.[robot.id] || 0), 0) || 1;
  const syncRobotCount = () => { state.robots = clamp(totalRobots(), 1, 24); return state.robots; };
  const localDateKey = (date = new Date()) => {
    const year = date.getFullYear(); const month = String(date.getMonth() + 1).padStart(2, "0"); const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const ensureDailyState = () => {
    const today = localDateKey();
    if (state.dailyKey === today) return false;
    state.dailyKey = today; state.dailyClaimed = []; state.dailyProgress = { dives: 0, sold: 0, events: 0 }; markSaving();
    return true;
  };
  const robotProfile = () => {
    const count = totalRobots();
    const profile = CONFIG.robotTypes.reduce((result, robot) => {
      const owned = Number(state.robotRoster?.[robot.id] || 0);
      const rank = Number(state.robotLevels?.[robot.id] || 0);
      if (!owned) return result;
      result.speedBonus += owned * (robot.speedBonus + rank * 0.012);
      result.capacityBonus += owned * (robot.capacityBonus + rank * 0.35);
      result.rareBonus += owned * (robot.rareBonus + rank * 0.004);
      return result;
    }, { speedBonus: 0, capacityBonus: 0, rareBonus: 0 });
    return { ...profile, count };
  };
  const derived = () => {
    const robots = robotProfile();
    const researchMultiplier = 1 + state.prestigeCount * 0.08 + techLevel("income") * 0.1;
    const diveDuration = Math.round(17000 * (1 - level("dive") * 0.055) / Math.max(0.5, 1 + techLevel("speed") * 0.04 + robots.speedBonus * 0.22));
    const capacity = Math.max(8, Math.round(8 + level("cargo") * 1.2 + Math.max(0, robots.capacityBonus) + (robots.count - 1) * 0.8));
    const finds = 1 + Math.floor(level("salvage") / 2);
    const targetBoost = 1 + level("movement") * 0.06;
    const valueMultiplier = researchMultiplier * (1 + level("value") * 0.12);
    const rareChance = clamp(0.045 + level("rare") * 0.024 + techLevel("rare") * 0.018 + robots.rareBonus, 0.045, 0.58);
    const offlineRate = clamp(OFFLINE_RATE + techLevel("offline") * 0.035, OFFLINE_RATE, 0.98);
    return { researchMultiplier, diveDuration: clamp(diveDuration, 4200, 17000), capacity, finds, targetBoost, valueMultiplier, rareChance, offlineRate, robots };
  };

  const zoneLabel = (zone) => t(zone.nameKey) === zone.nameKey ? zone.name : t(zone.nameKey);
  const lootLabel = (loot) => t(loot.key) === loot.key ? loot.id : t(loot.key);
  const rarityLabel = (rarity) => t(rarity) === rarity ? rarity : t(rarity);

  const save = () => {
    state.lastSavedAt = Date.now();
    storageSet(STORE_KEY, JSON.stringify(state));
    if (els.saveState) { els.saveState.dataset.saving = "false"; els.saveState.textContent = "●"; }
  };
  const markSaving = () => {
    if (els.saveState) { els.saveState.dataset.saving = "true"; els.saveState.textContent = "◌"; }
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(save, 380);
  };

  const showToast = (message) => {
    if (!els.toast) return;
    window.clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.hidden = false;
    toastTimer = window.setTimeout(() => { els.toast.hidden = true; }, 2600);
  };

  const weightedPick = (items, weights) => {
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    let cursor = Math.random() * total;
    for (let index = 0; index < items.length; index += 1) {
      cursor -= weights[index];
      if (cursor <= 0) return items[index];
    }
    return items[items.length - 1];
  };

  const lootIsCollection = (loot) => Boolean(loot?.collection);

  const chooseLoot = (targetDepth) => {
    const available = CONFIG.loot.filter((loot) => loot.minDepth <= targetDepth);
    if (!available.length) return CONFIG.loot[0];
    const rareRoll = Math.random() < derived().rareChance;
    const pool = rareRoll
      ? available.filter((loot) => loot.rarity === "rare" || loot.rarity === "legendary")
      : available.filter((loot) => loot.rarity === "common" || loot.rarity === "uncommon");
    const selected = pool.length ? pool : available;
    const weights = selected.map((loot) => {
      const depthFit = Math.max(1, 125 - Math.max(0, targetDepth - loot.minDepth) * 0.08);
      const targetBoost = loot.special ? 0.35 : 1;
      return depthFit * targetBoost;
    });
    return weightedPick(selected, weights);
  };

  const rollEvent = (targetDepth) => {
    if (Math.random() > 0.22) return null;
    const available = CONFIG.events.filter((event) => event.minDepth <= targetDepth);
    return available.length ? weightedPick(available, available.map((event) => event.weight)) : null;
  };

  const makeDive = (startedAt = Date.now()) => {
    const zone = activeZone();
    const stats = derived();
    const hullDepth = effectiveMaxDepth();
    const lower = Math.min(zone.maxDepth - 10, Math.max(zone.minDepth + 10, 28));
    const upper = Math.max(lower, Math.min(hullDepth, zone.maxDepth));
    const targetDepth = clamp(Math.round((lower + Math.random() * Math.max(20, upper - lower)) * stats.targetBoost), lower, upper);
    const preview = chooseLoot(targetDepth);
    const salvageTime = Math.round((preview.salvageMs || 0) * 0.3);
    return { startedAt, durationMs: clamp(stats.diveDuration + salvageTime, 4200, 20000), targetDepth, zoneId: zone.id, previewLootId: preview.id };
  };

  const startDive = (startedAt = Date.now()) => {
    state.currentDive = makeDive(startedAt);
    markSaving();
  };

  const addFind = (loot, value, suppressToast = false) => {
    if (loot.rarity === "rare" || loot.rarity === "legendary") {
      state.rareFound += 1;
    }
    if (lootIsCollection(loot) && !state.museum.includes(loot.id)) state.museum.unshift(loot.id);
    state.totalWeight += Math.max(0, Number(loot.weight) || 0);
    state.recentFinds.unshift({ lootId: loot.id, value: Math.round(value), weight: loot.weight, salvageMs: loot.salvageMs, rarity: loot.rarity, collection: lootIsCollection(loot), at: Date.now() });
    state.recentFinds = state.recentFinds.slice(0, 8);
    if (!suppressToast) {
      const message = t(lootIsCollection(loot) ? "collectionMessage" : "lootMessage", { name: lootLabel(loot), value: number(value), credits: t("credits") });
      showToast(`${message}${lootIsCollection(loot) ? ` · ${t("collectible")}` : ""}`);
    }
  };

  const settleDive = ({ offline = false, silent = false } = {}) => {
    const dive = state.currentDive || makeDive();
    const stats = derived();
    const lootCount = clamp(stats.finds + Math.floor(Math.random() * 2), 1, Math.max(1, stats.capacity));
    let cargoWeight = 0;
    let cargoCount = 0;
    let earned = 0;
    let soldValue = 0;
    let museumValue = 0;
    const suppressToast = offline || silent;
    const loadLoot = (loot) => {
      if (!loot) return false;
      const weight = Math.max(1, Number(loot.weight) || 1);
      if (cargoCount > 0 && cargoWeight + weight > stats.capacity) return false;
      const value = Math.max(1, loot.baseValue * stats.valueMultiplier * (0.9 + Math.random() * 0.25));
      const payout = lootIsCollection(loot) ? Math.max(1, Math.round(value * 0.14)) : Math.round(value);
      cargoWeight += weight;
      cargoCount += 1;
      state.totalValue += Math.round(value);
      addFind(loot, lootIsCollection(loot) ? payout : value, suppressToast);
      if (lootIsCollection(loot)) museumValue += payout;
      else soldValue += payout;
      return true;
    };
    for (let index = 0; index < lootCount * 3 && cargoCount < lootCount; index += 1) {
      loadLoot(chooseLoot(dive.targetDepth));
    }
    if (!cargoCount) loadLoot(CONFIG.loot[0]);
    const event = rollEvent(dive.targetDepth);
    let eventBonus = 0;
    if (event) {
      state.totalEvents += 1;
      state.dailyProgress.events += 1;
      state.lastEvent = { id: event.id, key: event.key, copyKey: event.copyKey, bonus: event.bonus, depth: dive.targetDepth, at: Date.now() };
      const target = event.lootId ? CONFIG.loot.find((loot) => loot.id === event.lootId) : null;
      if (target && target.minDepth <= dive.targetDepth) loadLoot(target);
      eventBonus = Math.max(8, Math.round((soldValue + museumValue) * (event.bonus - 1)));
      soldValue += eventBonus;
      if (!suppressToast) showToast(`${t(event.key)} · +${number(eventBonus)} ${t("credits")}`);
    }
    earned = soldValue + museumValue;
    state.totalSold += soldValue;
    state.totalValue += eventBonus;
    state.totalDives += 1;
    state.dailyProgress.dives += 1;
    state.dailyProgress.sold += soldValue;
    state.currentDive = null;
    const payout = Math.round(earned);
    if (offline) pendingOffline += Math.round(payout * stats.offlineRate);
    else state.coins += payout;
    return { earned: payout, durationMs: dive.durationMs, finishedAt: dive.startedAt + dive.durationMs, event };
  };

  const processOffline = () => {
    const now = Date.now();
    const savedAt = Number.isFinite(state.lastSavedAt) ? state.lastSavedAt : now;
    const horizon = Math.min(now, savedAt + MAX_OFFLINE_MS);
    let cursor = savedAt;
    let cycles = 0;
    if (!state.currentDive) state.currentDive = makeDive(cursor);
    while (state.currentDive && state.currentDive.startedAt + state.currentDive.durationMs <= horizon && cycles < 120) {
      const result = settleDive({ offline: true, silent: true });
      const finishedAt = result.finishedAt;
      state.currentDive = makeDive(finishedAt);
      cursor = finishedAt;
      cycles += 1;
    }
    if (cycles >= 120 && state.currentDive) state.currentDive.startedAt = horizon;
    state.lastSavedAt = now;
    if (pendingOffline > 0) {
      els.offlineValue.textContent = `+${number(pendingOffline)} ${t("credits")}`;
      window.setTimeout(() => { els.offlineModal.hidden = false; }, 500);
    }
  };

  const phaseFor = (progress) => progress < 0.46 ? "diving" : progress < 0.76 ? "searching" : "returning";
  const phaseText = (phase) => t(phase);
  const progressFor = (now = Date.now()) => {
    if (!state.currentDive) return 0;
    return clamp((now - state.currentDive.startedAt) / state.currentDive.durationMs, 0, 1);
  };

  const upgradeCost = (upgrade) => Math.round(upgrade.baseCost * Math.pow(upgrade.costScale, level(upgrade.id)));
  const upgradeEffect = (upgrade) => {
    const current = level(upgrade.id);
    const effects = {
      dive: `${Math.round(100 - current * 5.5)}%`, movement: `${current * 6}%`, salvage: `${Math.floor(current / 2)}`,
      cargo: `${current}`, depth: `${current * 100}`, value: `${current * 12}`, robots: `${current}`, rare: `${current * 2.4}`,
    };
    return effects[upgrade.id] || "0";
  };

  const metricValue = (metric, daily = false) => {
    const source = daily ? state.dailyProgress : state;
    if (metric === "dives") return Number(source.dives ?? source.totalDives ?? 0);
    if (metric === "sold") return Number(source.sold ?? source.totalSold ?? 0);
    if (metric === "depth") return effectiveMaxDepth();
    if (metric === "museum") return state.museum.length;
    if (metric === "robots") return totalRobots();
    if (metric === "rare") return state.rareFound;
    if (metric === "events") return Number(source.events ?? source.totalEvents ?? 0);
    if (metric === "weight") return state.totalWeight;
    return 0;
  };

  const missionProgress = (mission) => metricValue(mission.metric || "dives");
  const dailyMissionProgress = (mission) => metricValue(mission.metric || "dives", true);
  const achievementProgress = (achievement) => metricValue(achievement.metric || "dives");

  const applyStaticTranslations = () => {
    const locale = window.DEEP_SEA_LOCALE || "en";
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.title = `${t("title")} | WeightPlay`;
    document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
    document.querySelectorAll("[data-i18n-aria]").forEach((node) => { node.setAttribute("aria-label", t(node.dataset.i18nAria)); });
    if (els.locale && !els.locale.options.length) {
      for (const code of LOCALE_CODES) {
        const option = document.createElement("option"); option.value = code; option.textContent = LOCALE_LABELS[code]; els.locale.append(option);
      }
    }
    if (els.locale) els.locale.value = locale;
  };

  const renderZones = () => {
    const depthCap = effectiveMaxDepth();
    const unlocked = CONFIG.zones.filter((zone) => depthCap >= zone.minDepth).length;
    els.zoneCount.textContent = `${unlocked}/${CONFIG.zones.length} ${t("zoneUnlocked")}`;
    els.zoneList.innerHTML = CONFIG.zones.map((zone) => {
      const isUnlocked = depthCap >= zone.minDepth;
      const selected = state.zoneId === zone.id;
      return `<button type="button" class="zone-card${selected ? " selected" : ""}${isUnlocked ? "" : " locked"}" data-zone="${zone.id}" style="--zone-color:${zone.color}" ${isUnlocked ? "" : "disabled"}>
        <strong>${escapeHtml(zoneLabel(zone))}</strong><small>${zone.minDepth}–${zone.maxDepth}${escapeHtml(t("metres"))} · ${escapeHtml(t(zone.habitatKey))}</small><em>${isUnlocked ? (selected ? "● " : "") + escapeHtml(t("zoneUnlocked")) : "🔒 " + escapeHtml(t("zoneLocked"))}</em>
      </button>`;
    }).join("");
    els.zoneList.querySelectorAll("[data-zone]").forEach((button) => button.addEventListener("click", () => {
      const zone = CONFIG.zones.find((candidate) => candidate.id === button.dataset.zone);
      if (!zone || effectiveMaxDepth() < zone.minDepth) return;
      state.zoneId = zone.id;
      state.currentDive = null;
      startDive();
      showToast(t("zoneMessage", { name: zoneLabel(zone) }));
      markSaving(); render();
    }));
  };

  const renderFindLog = () => {
    els.totalDives.textContent = `${number(state.totalDives)} ${t("dives")}`;
    els.findLog.innerHTML = state.recentFinds.length ? state.recentFinds.slice(0, 6).map((entry) => {
      const loot = CONFIG.loot.find((candidate) => candidate.id === entry.lootId) || CONFIG.loot[0];
      const weight = Number(entry.weight ?? loot.weight) || 0;
      const tag = entry.collection ? t("collectible") : t("sold");
      return `<div class="find-row"><span>${escapeHtml(lootLabel(loot))} <small>· ${escapeHtml(rarityLabel(entry.rarity || loot.rarity))} · ${number(weight)}${escapeHtml(t("kg"))} · ${escapeHtml(tag)}</small></span><strong>+${number(entry.value)} ${escapeHtml(t("credits"))}</strong></div>`;
    }).join("") : `<p class="empty-copy">${escapeHtml(t("noFinds"))}</p>`;
  };

  const renderUpgrades = () => {
    els.upgradeList.innerHTML = CONFIG.upgrades.map((upgrade) => {
      const current = level(upgrade.id);
      const maxed = current >= upgrade.max;
      const cost = upgradeCost(upgrade);
      const effect = t(upgrade.effectKey, { value: upgradeEffect(upgrade) });
      return `<article class="upgrade-card"><div><h3>${escapeHtml(t(upgrade.key))}</h3><p>${escapeHtml(t("effect"))} · ${escapeHtml(effect)}</p><small>${escapeHtml(t("level"))} ${current}/${upgrade.max}</small></div><button type="button" class="upgrade-action" data-upgrade="${upgrade.id}" ${maxed ? "disabled" : ""}><strong>${maxed ? escapeHtml(t("maxed")) : `+${number(cost)}`}</strong><span>${maxed ? "" : escapeHtml(t("buy"))}</span></button></article>`;
    }).join("");
    els.upgradeList.querySelectorAll("[data-upgrade]").forEach((button) => button.addEventListener("click", () => {
      const upgrade = CONFIG.upgrades.find((candidate) => candidate.id === button.dataset.upgrade);
      if (!upgrade || level(upgrade.id) >= upgrade.max) return;
      const cost = upgradeCost(upgrade);
      if (state.coins < cost) { showToast(`${t("cost")} · ${number(cost)} ${t("credits")}`); return; }
      state.coins -= cost; state.upgrades[upgrade.id] += 1;
      if (upgrade.id === "robots") {
        state.robotRoster.scout = clamp(Math.max(state.robotRoster.scout || 0, 1 + level("robots")), 1, 8);
        syncRobotCount();
      }
      if (upgrade.id === "depth") state.maxDepth = clamp(120 + level("depth") * 100, 120, 1920);
      showToast(t("levelUpMessage", { name: t(upgrade.key), level: level(upgrade.id) }));
      markSaving(); render();
    }));
  };

  const renderMuseum = () => {
    const collectionLoot = CONFIG.loot.filter(lootIsCollection);
    els.museumCount.textContent = `${state.museum.length}/${collectionLoot.length} ${t("found")}`;
    els.museumGrid.innerHTML = collectionLoot.map((loot) => {
      const found = state.museum.includes(loot.id);
      return `<article class="museum-card${found ? " discovered" : ""}"><div class="museum-icon" aria-hidden="true">${found ? loot.icon : "·"}</div><div><strong>${escapeHtml(found ? lootLabel(loot) : t("unknownItem"))}</strong><small>${escapeHtml(found ? `${rarityLabel(loot.rarity)} · ${t("discovered")} · ${loot.weight}${t("kg")}` : t("undiscovered"))}</small></div></article>`;
    }).join("");
  };

  const renderMissions = () => {
    const completeCount = CONFIG.missions.filter((mission) => state.missionsClaimed.includes(mission.id)).length;
    els.missionCount.textContent = `${completeCount}/${CONFIG.missions.length} ${t("missionClaimed")}`;
    const missionCard = (mission, current, claimed, attribute) => {
      const complete = current >= mission.target;
      const action = claimed ? t("missionClaimed") : complete ? t("missionClaim") : `${number(current)}/${number(mission.target)}`;
      return `<article class="mission-card${complete ? " complete" : ""}"><div><h3>${escapeHtml(t(mission.key, { target: number(mission.target) }))}</h3><p>${escapeHtml(t("missionReward"))} · ${number(mission.reward)} ${escapeHtml(t("credits"))}</p><div class="mission-bar"><i style="width:${Math.round(clamp(current / mission.target * 100, 0, 100))}%"></i></div><small class="mission-progress">${escapeHtml(t("missionProgress"))} · ${number(current)}/${number(mission.target)}</small></div><button type="button" class="mission-action" ${attribute}="${mission.id}" ${claimed || !complete ? "disabled" : ""}>${escapeHtml(action)}</button></article>`;
    };
    const dailyComplete = CONFIG.dailyMissions.filter((mission) => state.dailyClaimed.includes(mission.id)).length;
    els.dailyMissionCount.textContent = `${dailyComplete}/${CONFIG.dailyMissions.length} ${t("missionClaimed")}`;
    els.dailyMissionList.innerHTML = CONFIG.dailyMissions.map((mission) => missionCard(mission, Math.min(mission.target, dailyMissionProgress(mission)), state.dailyClaimed.includes(mission.id), "data-daily")).join("");
    els.missionList.innerHTML = CONFIG.missions.map((mission) => missionCard(mission, Math.min(mission.target, missionProgress(mission)), state.missionsClaimed.includes(mission.id), "data-mission")).join("");
    els.missionList.querySelectorAll("[data-mission]").forEach((button) => button.addEventListener("click", () => {
      const mission = CONFIG.missions.find((candidate) => candidate.id === button.dataset.mission);
      if (!mission || state.missionsClaimed.includes(mission.id) || missionProgress(mission) < mission.target) return;
      state.missionsClaimed.push(mission.id); state.coins += mission.reward;
      showToast(`+${number(mission.reward)} ${t("credits")} · ${t("missionComplete")}`); markSaving(); render();
    }));
    els.dailyMissionList.querySelectorAll("[data-daily]").forEach((button) => button.addEventListener("click", () => {
      const mission = CONFIG.dailyMissions.find((candidate) => candidate.id === button.dataset.daily);
      if (!mission || state.dailyClaimed.includes(mission.id) || dailyMissionProgress(mission) < mission.target) return;
      state.dailyClaimed.push(mission.id); state.coins += mission.reward;
      showToast(`+${number(mission.reward)} ${t("credits")} · ${t("missionComplete")}`); markSaving(); render();
    }));
  };

  const robotHireCost = (robot) => Math.round(420 * Math.pow(1.45, Math.max(0, totalRobots() - 1)) * (robot.id === "scout" ? 1 : robot.id === "salvager" ? 1.5 : 2.25));
  const robotLevelCost = (robot) => Math.round(260 * (Number(state.robotLevels?.[robot.id] || 0) + 1) * (1 + Number(state.robotRoster?.[robot.id] || 0) * 0.18));

  const renderRobots = () => {
    const depthCap = effectiveMaxDepth();
    els.robotCount.textContent = `${number(totalRobots())} ${t("robots")} · ${escapeHtml(t("activeRobot"))}: ${escapeHtml(t(CONFIG.robotTypes.find((robot) => robot.id === state.activeRobotType)?.key || "robotScout"))}`;
    els.robotList.innerHTML = CONFIG.robotTypes.map((robot) => {
      const owned = Number(state.robotRoster?.[robot.id] || 0);
      const rank = Number(state.robotLevels?.[robot.id] || 0);
      const unlocked = depthCap >= robot.unlockDepth;
      const active = state.activeRobotType === robot.id;
      const hireCost = robotHireCost(robot);
      const levelCost = robotLevelCost(robot);
      const status = !unlocked ? `${t("robotUnlock")} ${number(robot.unlockDepth)}${t("metres")}` : `${number(owned)} ${t("owned")}`;
      return `<article class="robot-card${active ? " active" : ""}${unlocked ? "" : " locked"}"><header><h3>${escapeHtml(t(robot.key))}</h3><span>${escapeHtml(status)}</span></header><p>${escapeHtml(t(robot.copyKey))}</p><div class="robot-stats"><span>⚡ ${Math.round((robot.speedBonus + rank * 0.012) * 100)}% ${escapeHtml(t("speed"))}</span><span>▣ +${number(robot.capacityBonus + rank * 0.35)}${escapeHtml(t("kg"))}</span><span>✦ +${Math.round((robot.rareBonus + rank * 0.004) * 100)}%</span></div><div class="robot-actions"><button type="button" data-robot-select="${robot.id}" ${unlocked ? "" : "disabled"}>${active ? escapeHtml(t("robotActive")) : escapeHtml(t("robotSelect"))}</button><button type="button" data-robot-hire="${robot.id}" ${!unlocked || owned >= 8 || state.coins < hireCost ? "disabled" : ""}>+1 · ${number(hireCost)}</button><button type="button" data-robot-upgrade="${robot.id}" ${!owned || rank >= robot.levelMax || state.coins < levelCost ? "disabled" : ""}>${rank >= robot.levelMax ? escapeHtml(t("maxed")) : `Lv.${rank + 1} · ${number(levelCost)}`}</button></div></article>`;
    }).join("");
    els.robotList.querySelectorAll("[data-robot-select]").forEach((button) => button.addEventListener("click", () => {
      if (!CONFIG.robotTypes.some((robot) => robot.id === button.dataset.robotSelect && effectiveMaxDepth() >= robot.unlockDepth)) return;
      state.activeRobotType = button.dataset.robotSelect; markSaving(); render();
    }));
    els.robotList.querySelectorAll("[data-robot-hire]").forEach((button) => button.addEventListener("click", () => {
      const robot = CONFIG.robotTypes.find((candidate) => candidate.id === button.dataset.robotHire);
      if (!robot || effectiveMaxDepth() < robot.unlockDepth || (state.robotRoster[robot.id] || 0) >= 8) return;
      const cost = robotHireCost(robot);
      if (state.coins < cost) { showToast(`${t("cost")} · ${number(cost)} ${t("credits")}`); return; }
      state.coins -= cost; state.robotRoster[robot.id] += 1; syncRobotCount();
      showToast(t("robotHired", { name: t(robot.key) })); markSaving(); render();
    }));
    els.robotList.querySelectorAll("[data-robot-upgrade]").forEach((button) => button.addEventListener("click", () => {
      const robot = CONFIG.robotTypes.find((candidate) => candidate.id === button.dataset.robotUpgrade);
      if (!robot || !state.robotRoster[robot.id] || state.robotLevels[robot.id] >= robot.levelMax) return;
      const cost = robotLevelCost(robot);
      if (state.coins < cost) { showToast(`${t("cost")} · ${number(cost)} ${t("credits")}`); return; }
      state.coins -= cost; state.robotLevels[robot.id] += 1;
      showToast(t("robotUpgraded", { name: t(robot.key), level: state.robotLevels[robot.id] })); markSaving(); render();
    }));
  };

  const renderAchievements = () => {
    const claimedCount = CONFIG.achievements.filter((achievement) => state.achievementsClaimed.includes(achievement.id)).length;
    els.achievementCount.textContent = `${claimedCount}/${CONFIG.achievements.length} ${t("achievementClaimed")}`;
    els.achievementList.innerHTML = CONFIG.achievements.map((achievement) => {
      const current = Math.min(achievement.target, achievementProgress(achievement));
      const complete = current >= achievement.target;
      const claimed = state.achievementsClaimed.includes(achievement.id);
      const action = claimed ? t("achievementClaimed") : complete ? t("achievementClaim") : `${number(current)}/${number(achievement.target)}`;
      return `<article class="achievement-card${complete ? " complete" : ""}"><div class="achievement-icon" aria-hidden="true">${complete ? "★" : "◇"}</div><div><h3>${escapeHtml(t(achievement.key, { target: number(achievement.target) }))}</h3><p>${escapeHtml(t("missionReward"))} · ${number(achievement.reward)} ${escapeHtml(t("credits"))} · ${number(current)}/${number(achievement.target)}</p></div><button type="button" data-achievement="${achievement.id}" ${claimed || !complete ? "disabled" : ""}>${escapeHtml(action)}</button></article>`;
    }).join("");
    els.achievementList.querySelectorAll("[data-achievement]").forEach((button) => button.addEventListener("click", () => {
      const achievement = CONFIG.achievements.find((candidate) => candidate.id === button.dataset.achievement);
      if (!achievement || state.achievementsClaimed.includes(achievement.id) || achievementProgress(achievement) < achievement.target) return;
      state.achievementsClaimed.push(achievement.id); state.coins += achievement.reward;
      showToast(`+${number(achievement.reward)} ${t("credits")} · ${t("achievementDone")}`); markSaving(); render();
    }));
  };

  const techCost = (tech) => 1 + techLevel(tech.id) * 2;
  const techEffect = (tech) => {
    const value = techLevel(tech.id);
    const effects = { income: `${value * 10}%`, speed: `${value * 4}%`, rare: `${value * 1.8}%`, depth: `${value * 80}${t("metres")}`, offline: `${Math.round((OFFLINE_RATE + value * 0.035) * 100)}%` };
    return effects[tech.id] || "0";
  };

  const renderTechnology = () => {
    const ready = effectiveMaxDepth() >= 760 && state.totalSold >= 3000;
    els.research.textContent = number(state.research);
    els.researchMultiplier.textContent = `×${derived().researchMultiplier.toFixed(1)}`;
    els.techCopy.textContent = t(ready ? "techReady" : "techLocked");
    els.prestige.disabled = !ready;
    els.techUpgradeList.innerHTML = CONFIG.techUpgrades.map((tech) => {
      const current = techLevel(tech.id);
      const maxed = current >= tech.max;
      const cost = techCost(tech);
      return `<article class="tech-upgrade-card"><div><h3>${escapeHtml(t(tech.key))}</h3><p>${escapeHtml(t(tech.effectKey, { value: techEffect(tech) }))} · ${escapeHtml(t("level"))} ${current}/${tech.max}</p></div><button type="button" data-tech="${tech.id}" ${maxed || state.research < cost ? "disabled" : ""}>${maxed ? escapeHtml(t("maxed")) : `✦ ${number(cost)}`}</button></article>`;
    }).join("");
    els.techUpgradeList.querySelectorAll("[data-tech]").forEach((button) => button.addEventListener("click", () => {
      const tech = CONFIG.techUpgrades.find((candidate) => candidate.id === button.dataset.tech);
      if (!tech || techLevel(tech.id) >= tech.max) return;
      const cost = techCost(tech);
      if (state.research < cost) { showToast(`${t("techPoints")} · ${number(cost)}`); return; }
      state.research -= cost; state.techLevels[tech.id] += 1;
      showToast(t("techUpgraded", { name: t(tech.key) })); markSaving(); render();
    }));
  };

  const renderEvent = () => {
    if (!state.lastEvent) { els.eventBanner.hidden = true; return; }
    els.eventBanner.hidden = false;
    els.eventTitle.textContent = t(state.lastEvent.key || "eventHotspot");
    els.eventCopy.textContent = t(state.lastEvent.copyKey || "eventHotspotCopy");
    els.eventBonusValue.textContent = `×${Number(state.lastEvent.bonus || 1).toFixed(2)}`;
  };

  const applySettings = () => {
    document.body.dataset.motion = state.settings.motion ? "on" : "off";
    document.body.dataset.music = state.settings.music ? "on" : "off";
    document.body.dataset.sound = state.settings.sound ? "on" : "off";
  };

  const renderSettings = () => {
    const settings = [
      { id: "sound", key: "sound", copyKey: "soundCopy" },
      { id: "music", key: "music", copyKey: "musicCopy" },
      { id: "motion", key: "motion", copyKey: "motionCopy" },
    ];
    els.settingsList.innerHTML = settings.map((setting) => `<div class="setting-row"><span><strong>${escapeHtml(t(setting.key))}</strong><small>${escapeHtml(t(setting.copyKey))}</small></span><button type="button" class="setting-toggle" data-setting="${setting.id}" data-enabled="${state.settings[setting.id]}">${state.settings[setting.id] ? escapeHtml(t("on")) : escapeHtml(t("off"))}</button></div>`).join("");
    els.settingsList.querySelectorAll("[data-setting]").forEach((button) => button.addEventListener("click", () => {
      const id = button.dataset.setting;
      if (!Object.prototype.hasOwnProperty.call(state.settings, id)) return;
      state.settings[id] = !state.settings[id]; applySettings(); markSaving(); render();
    }));
  };

  const render = (now = Date.now()) => {
    ensureDailyState();
    const dive = state.currentDive || makeDive(now);
    if (!state.currentDive) state.currentDive = dive;
    const progress = progressFor(now);
    const phase = phaseFor(progress);
    const zone = CONFIG.zones.find((candidate) => candidate.id === dive.zoneId) || activeZone();
    const depth = Math.round(dive.targetDepth * (0.08 + progress * 0.92));
    const stats = derived();
    els.funds.textContent = number(state.coins);
    els.depth.textContent = number(effectiveMaxDepth());
    els.robots.textContent = number(totalRobots());
    els.multiplier.textContent = `×${stats.valueMultiplier.toFixed(1)}`;
    els.zoneName.textContent = zoneLabel(zone);
    els.zoneDepth.textContent = `${zone.minDepth}–${zone.maxDepth}${t("metres")}`;
    els.stateBadge.textContent = phaseText(phase);
    els.stateBadge.dataset.state = phase;
    els.targetDepth.textContent = `${number(dive.targetDepth)}${t("metres")}`;
    const preview = CONFIG.loot.find((loot) => loot.id === dive.previewLootId) || CONFIG.loot[0];
    els.nextDrop.textContent = `${t("nextDrop")} · ${lootLabel(preview)} · ${t("salvageTime")} ${Math.max(1, Math.ceil((preview.salvageMs || 0) / 100) / 10)}${t("seconds")}`;
    els.progress.textContent = `${Math.round(progress * 100)}%`;
    els.progressFill.style.width = `${Math.round(progress * 100)}%`;
    els.diveStatus.textContent = phaseText(phase);
    els.cargo.textContent = `${Math.min(stats.capacity, Math.max(0, Math.floor(progress * stats.capacity)))} / ${stats.capacity}${t("kg")}`;
    els.currentDepth.textContent = `${number(depth)}${t("metres")}`;
    renderZones(); renderFindLog(); renderUpgrades(); renderRobots(); renderMuseum(); renderMissions(); renderAchievements(); renderTechnology(); renderEvent(); renderSettings();
    if (els.saveState && !els.saveState.dataset.saving) els.saveState.textContent = "●";
  };

  const tick = () => {
    const now = Date.now();
    if (state.currentDive && now - state.currentDive.startedAt >= state.currentDive.durationMs) {
      settleDive();
      startDive(now);
      markSaving();
    }
    if (now - lastRender > 220) { lastRender = now; render(now); }
  };

  const drawRoundRect = (context, x, y, width, height, radius) => {
    if (context.roundRect) context.roundRect(x, y, width, height, radius);
    else { context.rect(x, y, width, height); }
  };
  const drawScene = (time = 0) => {
    const canvas = els.canvas;
    const context = canvas?.getContext("2d");
    if (!context) return;
    const width = canvas.width; const height = canvas.height;
    const animationTime = state.settings.motion ? time : 0;
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#0c5a78"); gradient.addColorStop(0.42, "#073a5b"); gradient.addColorStop(1, "#020c1b");
    context.fillStyle = gradient; context.fillRect(0, 0, width, height);
    context.globalAlpha = 0.22;
    for (let index = 0; index < 9; index += 1) {
      context.strokeStyle = index % 2 ? "#89e7ed" : "#4e9dc6"; context.lineWidth = 2;
      context.beginPath();
      for (let x = -20; x <= width + 20; x += 24) context.lineTo(x, 42 + index * 9 + Math.sin((x + animationTime * 0.025 + index * 40) / 36) * 3);
      context.stroke();
    }
    context.globalAlpha = 0.3;
    for (let index = 1; index < 7; index += 1) { context.strokeStyle = "#93d9df"; context.lineWidth = 1; context.setLineDash([5, 9]); context.beginPath(); context.moveTo(0, index * 82); context.lineTo(width, index * 82); context.stroke(); }
    context.setLineDash([]); context.globalAlpha = 1;
    context.fillStyle = "rgba(2, 11, 23, .82)"; context.beginPath(); context.moveTo(0, height - 55); context.lineTo(105, height - 92); context.lineTo(210, height - 56); context.lineTo(310, height - 112); context.lineTo(410, height - 68); context.lineTo(530, height - 110); context.lineTo(650, height - 52); context.lineTo(width, height - 85); context.lineTo(width, height); context.lineTo(0, height); context.fill();
    for (let index = 0; index < 20; index += 1) {
      const x = (index * 83 + 32) % width; const y = ((index * 57 + animationTime * 0.018) % (height + 45)) - 25;
      context.fillStyle = index % 3 === 0 ? "#8de8dd" : "#4faed0"; context.globalAlpha = 0.35 + (index % 4) * 0.08; context.beginPath(); context.arc(x, y, 1.5 + (index % 3), 0, Math.PI * 2); context.fill();
    }
    context.globalAlpha = 1;
    const sceneZone = activeZone();
    if (sceneZone.id === "harbour") {
      context.strokeStyle = "rgba(93, 221, 181, .65)"; context.lineWidth = 4;
      for (let index = 0; index < 8; index += 1) { const x = 36 + index * 118; context.beginPath(); context.moveTo(x, height - 42); context.quadraticCurveTo(x - 16, height - 102, x + 4, height - 142); context.stroke(); context.beginPath(); context.moveTo(x + 7, height - 42); context.quadraticCurveTo(x + 28, height - 92, x + 18, height - 126); context.stroke(); }
      context.fillStyle = "rgba(248, 213, 124, .8)"; for (let index = 0; index < 4; index += 1) { context.beginPath(); context.ellipse(120 + index * 178, 214 + (index % 2) * 34, 17, 7, 0.1, 0, Math.PI * 2); context.fill(); }
    } else if (sceneZone.id === "wreck") {
      context.fillStyle = "rgba(132, 84, 61, .8)"; context.strokeStyle = "rgba(240, 177, 104, .65)"; context.lineWidth = 3; context.beginPath(); context.moveTo(120, height - 72); context.lineTo(190, height - 138); context.lineTo(430, height - 128); context.lineTo(505, height - 76); context.closePath(); context.fill(); context.stroke(); context.fillStyle = "rgba(11, 30, 48, .8)"; context.fillRect(245, height - 130, 52, 33); context.fillRect(330, height - 124, 52, 27);
    } else if (sceneZone.id === "canyon") {
      context.fillStyle = "rgba(27, 71, 103, .9)"; context.beginPath(); context.moveTo(0, height - 46); context.lineTo(110, height - 220); context.lineTo(200, height - 82); context.lineTo(295, height - 250); context.lineTo(390, height - 60); context.lineTo(505, height - 206); context.lineTo(650, height - 52); context.lineTo(width, height - 160); context.lineTo(width, height); context.lineTo(0, height); context.fill();
    } else if (sceneZone.id === "midnight") {
      context.strokeStyle = "rgba(187, 160, 255, .74)"; context.lineWidth = 2; context.fillStyle = "rgba(166, 164, 255, .34)";
      for (let index = 0; index < 5; index += 1) { const x = 80 + index * 138; const y = 218 + (index % 2) * 54; context.beginPath(); context.arc(x, y, 18, Math.PI, 0); context.fill(); context.stroke(); context.beginPath(); context.moveTo(x - 12, y); context.lineTo(x - 19, y + 34); context.moveTo(x, y); context.lineTo(x, y + 42); context.moveTo(x + 12, y); context.lineTo(x + 19, y + 34); context.stroke(); }
    } else if (sceneZone.id === "volcano") {
      context.fillStyle = "rgba(238, 91, 73, .18)"; context.beginPath(); context.arc(width * 0.76, height - 84, 92, 0, Math.PI * 2); context.fill();
      context.fillStyle = "rgba(255, 133, 93, .7)"; context.beginPath(); context.arc(width * 0.78, height - 64, 24, 0, Math.PI * 2); context.fill();
    } else if (sceneZone.id === "ruins") {
      context.fillStyle = "rgba(205, 170, 119, .38)";
      for (let index = 0; index < 4; index += 1) context.fillRect(72 + index * 145, height - 136 - (index % 2) * 24, 34, 92 + (index % 2) * 24);
    } else if (sceneZone.id === "abyss") {
      context.fillStyle = "rgba(146, 169, 255, .8)";
      for (let index = 0; index < 12; index += 1) { context.beginPath(); context.arc((index * 97 + 44) % width, 92 + ((index * 71) % 270), 1.5 + (index % 2), 0, Math.PI * 2); context.fill(); }
    }
    const dive = state.currentDive || makeDive(); const progress = progressFor(); const robotTotal = Math.min(6, totalRobots());
    context.fillStyle = "#152d3e"; context.strokeStyle = "#f3bc58"; context.lineWidth = 3; context.beginPath(); drawRoundRect(context, width * 0.5 - 78, 20, 156, 32, 9); context.fill(); context.stroke();
    context.fillStyle = "#f3bc58"; context.beginPath(); context.arc(width * 0.5 - 38, 36, 7, 0, Math.PI * 2); context.arc(width * 0.5 + 38, 36, 7, 0, Math.PI * 2); context.fill();
    for (let index = 0; index < robotTotal; index += 1) {
      const offset = (index - (robotTotal - 1) / 2) * Math.min(102, width / Math.max(3, robotTotal + 1));
      const robotY = 80 + progress * 340 + (index % 2) * 14;
      const robotX = width * 0.5 + offset + Math.sin(animationTime * 0.0011 + index * 1.7) * 22;
      context.strokeStyle = "rgba(255, 214, 124, .62)"; context.lineWidth = 2; context.beginPath(); context.moveTo(width * 0.5 + offset * 0.25, 38); context.lineTo(robotX, robotY - 34); context.stroke();
      context.save(); context.translate(robotX, robotY); context.shadowBlur = 18; context.shadowColor = index % 3 === 1 ? "#ffd36b" : "#6ee7e2"; context.fillStyle = index % 3 === 1 ? "#d9943e" : "#eeae40"; context.strokeStyle = "#ffe0a0"; context.lineWidth = 3; context.beginPath(); drawRoundRect(context, -43, -28, 86, 56, 16); context.fill(); context.stroke(); context.shadowBlur = 0;
      context.fillStyle = "#06243a"; context.beginPath(); drawRoundRect(context, -26, -14, 52, 30, 10); context.fill(); context.fillStyle = "#6ee7e2"; context.beginPath(); context.arc(-11, 0, 4, 0, Math.PI * 2); context.arc(11, 0, 4, 0, Math.PI * 2); context.fill(); context.strokeStyle = "#6ee7e2"; context.lineWidth = 2; context.beginPath(); context.arc(0, 2, 8, 0.15, Math.PI - 0.15); context.stroke();
      context.strokeStyle = "#c8e6e8"; context.lineWidth = 6; context.beginPath(); context.moveTo(-38, 21); context.lineTo(-60, 35); context.moveTo(38, 21); context.lineTo(60, 35); context.stroke(); context.fillStyle = "#ffd36b"; context.beginPath(); context.arc(-62, 37, 6, 0, Math.PI * 2); context.arc(62, 37, 6, 0, Math.PI * 2); context.fill(); context.restore();
    }
    context.fillStyle = "rgba(255,211,107,.85)"; context.font = "700 15px system-ui"; context.fillText(`${number(Math.round(dive.targetDepth * (0.08 + progress * 0.92)))}${t("metres")}`, 18, 30);
    window.requestAnimationFrame(drawScene);
  };

  const setTab = (name) => {
    document.querySelectorAll("[data-tab]").forEach((button) => button.classList.toggle("active", button.dataset.tab === name));
    document.querySelectorAll("[data-panel]").forEach((panel) => { const active = panel.dataset.panel === name; panel.hidden = !active; panel.classList.toggle("active", active); });
  };

  const bind = () => {
    els.locale?.addEventListener("change", () => window.deepSeaSetLocale?.(els.locale.value));
    els.reset?.addEventListener("click", () => {
      if (!window.confirm(t("resetConfirm"))) return;
      state = freshState(); pendingOffline = 0; startDive(); save(); render(); showToast(t("resetDone"));
    });
    els.dispatch?.addEventListener("click", () => {
      if (!state.currentDive) startDive();
      showToast(state.currentDive ? t("autoLoopCopy") : t("diveNow")); render();
    });
    els.quickDive?.addEventListener("click", () => {
      if (!state.currentDive) startDive();
      state.currentDive.startedAt = Date.now() - state.currentDive.durationMs + 120;
      showToast(t("diveNow")); markSaving(); render();
    });
    els.collect?.addEventListener("click", () => {
      if (!pendingOffline) { showToast(t("noFinds")); return; }
      state.coins += pendingOffline; showToast(t("offlineMessage", { value: number(pendingOffline) })); pendingOffline = 0; markSaving(); render();
    });
    els.offlineCollect?.addEventListener("click", () => { if (!pendingOffline) { els.offlineModal.hidden = true; return; } state.coins += pendingOffline; showToast(t("offlineMessage", { value: number(pendingOffline) })); pendingOffline = 0; els.offlineModal.hidden = true; markSaving(); render(); });
    els.offlineClose?.addEventListener("click", () => { els.offlineModal.hidden = true; });
    document.querySelectorAll("[data-tab]").forEach((button) => button.addEventListener("click", () => setTab(button.dataset.tab)));
    els.prestige?.addEventListener("click", () => {
      if (effectiveMaxDepth() < 760 || state.totalSold < 3000) return;
      if (!window.confirm(t("prestigeCopy"))) return;
      const museum = state.museum.slice();
      const achievementsClaimed = state.achievementsClaimed.slice();
      const techLevels = { ...state.techLevels };
      const research = state.research + 1;
      const prestigeCount = state.prestigeCount + 1;
      state = freshState();
      state.museum = museum; state.achievementsClaimed = achievementsClaimed; state.techLevels = techLevels;
      state.research = research; state.prestigeCount = prestigeCount; state.dailyKey = localDateKey();
      pendingOffline = 0; applySettings(); startDive(); save(); render(); showToast(t("prestigeDone"));
    });
    document.addEventListener("visibilitychange", () => { if (document.hidden) save(); });
    window.addEventListener("beforeunload", save);
  };

  applyStaticTranslations();
  applySettings();
  ensureDailyState();
  processOffline();
  if (!state.currentDive) startDive();
  bind();
  render();
  window.setInterval(tick, 250);
  window.setInterval(save, 5000);
  window.requestAnimationFrame(drawScene);
  window.setTimeout(() => els.loading?.classList.add("is-hidden"), 260);
})();
