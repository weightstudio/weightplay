import { createSalvageScene } from './scene3d.js?v=20261022-v11';
import { depthFraction, sonarStrength, sonarOutcome, missingRequirements, buyLivery } from './expedition-rules.mjs?v=20261022-v11';
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const t = (key, vars) => window.deepSeaT?.(key, vars) || key;
  const STORE_KEY = "weightplay:animal-deep-sea-salvage:v2-campaign";
  const LEGACY_KEYS = ["weightplay:animal-deep-sea-salvage:v1", "weightplay_animal_deep_sea_salvage_v1"];
  const MAX_OFFLINE_MS = 8 * 60 * 60 * 1000;
  const MIN_DIVE_MS = 4200;
  // The minimum-speed dive is the worst case for the eight-hour offline
  // window. Keep the guard above that derived maximum so an upgraded crew
  // cannot silently lose completed dives.
  const MAX_OFFLINE_CYCLES = Math.ceil(MAX_OFFLINE_MS / MIN_DIVE_MS) + 2;
  const OFFLINE_RATE = 0.72;
  const LOCALE_LABELS = {
    en: "English", "zh-Hant": "繁體中文", "zh-Hans": "简体中文", ja: "日本語", ko: "한국어", es: "Español",
    "pt-BR": "Português", fr: "Français", de: "Deutsch", it: "Italiano", ru: "Русский", hi: "हिन्दी", ar: "العربية",
  };
  const LOCALE_CODES = Object.keys(LOCALE_LABELS);

  const DIVE_FOCUSES = Object.freeze({
    balanced: { key: "focusBalanced", copyKey: "focusBalancedCopy", selectedKey: "focusBalancedSelected" },
    value: { key: "focusValue", copyKey: "focusValueCopy", selectedKey: "focusValueSelected" },
    museum: { key: "focusMuseum", copyKey: "focusMuseumCopy", selectedKey: "focusMuseumSelected" },
  });

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
      { id: "compass", key: "lootCompass", minDepth: 40, baseValue: 90, weight: 1, salvageMs: 700, rarity: "rare", collection: true },
      { id: "metal", key: "lootMetal", minDepth: 0, baseValue: 8, weight: 1, salvageMs: 350, rarity: "common", category: "supply", icon: "▦" },
      { id: "crate", key: "lootCrate", minDepth: 70, baseValue: 18, weight: 2, salvageMs: 500, rarity: "common", category: "supply", icon: "▤" },
      { id: "parts", key: "lootParts", minDepth: 140, baseValue: 26, weight: 1, salvageMs: 420, rarity: "common", category: "supply", icon: "⌁" },
      { id: "mineral", key: "lootMineral", minDepth: 260, baseValue: 56, weight: 2, salvageMs: 700, rarity: "uncommon", category: "mineral", icon: "◆" },
      { id: "pearl", key: "lootPearl", minDepth: 360, baseValue: 96, weight: 1, salvageMs: 620, rarity: "uncommon", category: "treasure", collection: true, icon: "✦" },
      { id: "antique", key: "lootAntique", minDepth: 500, baseValue: 150, weight: 2, salvageMs: 900, rarity: "uncommon", category: "antique", collection: true, icon: "◒" },
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
    museumMilestones: [
      { id: "curator", key: "museumMilestoneCurator", threshold: 2, reward: 200, valueBonus: 0.04 },
      { id: "archive", key: "museumMilestoneArchive", threshold: 4, reward: 500, valueBonus: 0.06 },
      { id: "hall", key: "museumMilestoneHall", threshold: 6, reward: 900, valueBonus: 0.08 },
      { id: "abyssal", key: "museumMilestoneAbyssal", threshold: 8, reward: 1600, valueBonus: 0.12 },
    ],
    upgrades: [
      { id: "dive", key: "upgradeDiving", effectKey: "effectDiving", max: 12, baseCost: 45, costScale: 1.52 },
      { id: "movement", key: "upgradeMovement", effectKey: "effectMovement", max: 12, baseCost: 60, costScale: 1.55 },
      { id: "salvage", key: "upgradeSalvage", effectKey: "effectSalvage", max: 10, baseCost: 80, costScale: 1.56 },
      { id: "cargo", key: "upgradeCargo", effectKey: "effectCargo", max: 8, baseCost: 95, costScale: 1.58 },
      { id: "depth", key: "upgradeDepth", effectKey: "effectDepth", max: 18, baseCost: 140, costScale: 1.38 },
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

  const CAMPAIGN_CONTRACTS = Object.freeze([
    { id: "harbour-01", arc: "Harbour Survey", zone: "harbour", focus: "balanced", target: 1, reward: 90 },
    { id: "harbour-02", arc: "Harbour Survey", zone: "harbour", focus: "value", target: 2, reward: 120 },
    { id: "harbour-03", arc: "Harbour Survey", zone: "harbour", focus: "museum", target: 2, reward: 150, minMuseum: 1 },
    { id: "harbour-04", arc: "Harbour Survey", zone: "harbour", focus: "balanced", target: 3, reward: 180, minUpgrade: ["salvage", 1] },
    { id: "harbour-05", arc: "Harbour Survey", zone: "harbour", focus: "museum", target: 2, reward: 210, minUpgrade: ["movement", 1] },
    { id: "wreck-01", arc: "Wreck Ledger", zone: "wreck", focus: "value", target: 1, reward: 240, minDepth: 180 },
    { id: "wreck-02", arc: "Wreck Ledger", zone: "wreck", focus: "balanced", target: 2, reward: 270, minDepth: 180 },
    { id: "wreck-03", arc: "Wreck Ledger", zone: "wreck", focus: "museum", target: 2, reward: 300, minDepth: 180, minMuseum: 2 },
    { id: "wreck-04", arc: "Wreck Ledger", zone: "wreck", focus: "value", target: 2, reward: 340, minDepth: 260, minUpgrade: ["cargo", 1] },
    { id: "wreck-05", arc: "Wreck Ledger", zone: "wreck", focus: "museum", target: 3, reward: 380, minDepth: 360, event: "ship" },
    { id: "canyon-01", arc: "Canyon Recovery", zone: "canyon", focus: "balanced", target: 2, reward: 420, minDepth: 420, minRobots: 2 },
    { id: "canyon-02", arc: "Canyon Recovery", zone: "canyon", focus: "value", target: 2, reward: 460, minDepth: 420, minUpgrade: ["movement", 2] },
    { id: "canyon-03", arc: "Canyon Recovery", zone: "canyon", focus: "museum", target: 2, reward: 500, minDepth: 500, minMuseum: 3 },
    { id: "canyon-04", arc: "Canyon Recovery", zone: "canyon", focus: "value", target: 3, reward: 560, minDepth: 500, minUpgrade: ["cargo", 2] },
    { id: "canyon-05", arc: "Canyon Recovery", zone: "canyon", focus: "balanced", target: 3, reward: 620, minDepth: 620, minRare: 1 },
    { id: "midnight-01", arc: "Midnight Museum", zone: "midnight", focus: "museum", target: 2, reward: 680, minDepth: 680, minUpgrade: ["depth", 6] },
    { id: "midnight-02", arc: "Midnight Museum", zone: "midnight", focus: "value", target: 3, reward: 740, minDepth: 680, event: "quake" },
    { id: "midnight-03", arc: "Midnight Museum", zone: "midnight", focus: "museum", target: 3, reward: 800, minDepth: 700, minMuseum: 4 },
    { id: "midnight-04", arc: "Midnight Museum", zone: "midnight", focus: "balanced", target: 3, reward: 860, minDepth: 760, minRobots: 2 },
    { id: "midnight-05", arc: "Midnight Museum", zone: "midnight", focus: "museum", target: 4, reward: 920, minDepth: 760, minRare: 2 },
    { id: "volcano-01", arc: "Volcano Signal", zone: "volcano", focus: "value", target: 2, reward: 980, minDepth: 920, minTech: ["depth", 1] },
    { id: "volcano-02", arc: "Volcano Signal", zone: "volcano", focus: "museum", target: 3, reward: 1040, minDepth: 920, event: "sonar" },
    { id: "volcano-03", arc: "Volcano Signal", zone: "volcano", focus: "value", target: 3, reward: 1100, minDepth: 1000, minUpgrade: ["salvage", 4] },
    { id: "volcano-04", arc: "Volcano Signal", zone: "volcano", focus: "balanced", target: 3, reward: 1180, minDepth: 1000, minRobots: 3 },
    { id: "volcano-05", arc: "Volcano Signal", zone: "volcano", focus: "museum", target: 4, reward: 1260, minDepth: 1100, minMuseum: 6 },
    { id: "ruins-01", arc: "Ruins Charter", zone: "ruins", focus: "balanced", target: 3, reward: 1340, minDepth: 1180, minRobots: 3 },
    { id: "ruins-02", arc: "Ruins Charter", zone: "ruins", focus: "museum", target: 4, reward: 1420, minDepth: 1180, event: "creature" },
    { id: "abyss-01", arc: "Abyss Charter", zone: "abyss", focus: "value", target: 3, reward: 1500, minDepth: 1500, minTech: ["depth", 3] },
    { id: "abyss-02", arc: "Abyss Charter", zone: "abyss", focus: "museum", target: 5, reward: 1640, minDepth: 1500, event: "hotspot" },
    { id: "abyss-03", arc: "Abyss Charter", zone: "abyss", focus: "balanced", target: 4, reward: 1800, minDepth: 1700, minPrestige: 1 },
  ]);

  const els = {
    loading: $("loading"), app: $("app"), landing: $("mainLanding"), dashboard: $("gameDashboard"), startGame: $("startGameButton"), locale: $("localeSelect"), reset: $("resetButton"),
    dispatch: $("dispatchButton"), quickDive: $("quickDiveButton"), collect: $("collectButton"),
    focusCopy: $("diveFocusCopy"), focusStatus: $("diveFocusStatus"), focusPanel: $("diveFocusPanel"),
    funds: $("fundsValue"), depth: $("depthValue"), robots: $("robotsValue"), multiplier: $("multiplierValue"),
    zoneName: $("zoneName"), zoneDepth: $("zoneDepth"), stateBadge: $("diveStateBadge"), canvas: $("oceanCanvas"),
    targetDepth: $("targetDepthValue"), nextDrop: $("nextDropValue"), progress: $("progressValue"), progressFill: $("progressFill"),
    diveStatus: $("diveStatus"), cargo: $("cargoValue"), currentDepth: $("currentDepthValue"), zoneList: $("zoneList"),
    zoneCount: $("zoneCount"), findLog: $("findLog"), totalDives: $("totalDivesLabel"), upgradeList: $("upgradeList"),
    robotList: $("robotList"), robotCount: $("robotCount"), museumGrid: $("museumGrid"), museumCount: $("museumCount"),
    dailyMissionList: $("dailyMissionList"), dailyMissionCount: $("dailyMissionCount"), missionList: $("missionList"), missionCount: $("missionCount"), contractList: $("contractList"), contractCount: $("contractCount"),
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
    version: 4, auroraOwned: false, livery: "default", museumPity: 0, eventPity: {}, pausedAt: 0, lastHaul: null, coins: 120, maxDepth: 120, zoneId: "harbour", robots: 1,
    upgrades: Object.fromEntries(CONFIG.upgrades.map((upgrade) => [upgrade.id, 0])),
    robotRoster: { scout: 1, salvager: 0, abyss: 0 },
    robotLevels: { scout: 0, salvager: 0, abyss: 0 },
    activeRobotType: "scout",
    museum: [], museumMilestonesClaimed: [], museumValueBonus: 0, recentFinds: [], missionsClaimed: [], contractsClaimed: [], contractProgress: {}, dailyKey: "", dailyClaimed: [], achievementsClaimed: [],
    research: 0, prestigeCount: 0, techLevels: Object.fromEntries(CONFIG.techUpgrades.map((upgrade) => [upgrade.id, 0])),
    totalDives: 0, totalSold: 0, totalValue: 0, totalWeight: 0, rareFound: 0, totalEvents: 0, lastEvent: null,
    dailyProgress: { dives: 0, sold: 0, events: 0 },
    settings: { sound: true, music: true, motion: true }, diveFocus: "balanced", started: false,
    lastSavedAt: Date.now(), currentDive: null, pendingOffline: 0,
  });

  const normalize = (raw) => {
    const state = freshState();
    if (!raw || typeof raw !== "object") return state;
    for (const key of ["coins", "maxDepth", "robots", "research", "prestigeCount", "museumValueBonus", "totalDives", "totalSold", "totalValue", "totalWeight", "rareFound", "totalEvents", "lastSavedAt", "pendingOffline"]) {
      if (Number.isFinite(Number(raw[key]))) state[key] = Number(raw[key]);
    }
    const normalizedZoneId = ZONE_ALIASES[raw.zoneId] || raw.zoneId;
    if (CONFIG.zones.some((zone) => zone.id === normalizedZoneId)) state.zoneId = normalizedZoneId;
    if (Array.isArray(raw.museum)) state.museum = [...new Set(raw.museum.filter((id) => CONFIG.loot.some((loot) => loot.id === id && loot.collection)))];
    if (Array.isArray(raw.museumMilestonesClaimed)) state.museumMilestonesClaimed = [...new Set(raw.museumMilestonesClaimed.filter((id) => CONFIG.museumMilestones.some((milestone) => milestone.id === id)))];
    if (Array.isArray(raw.recentFinds)) state.recentFinds = raw.recentFinds.slice(0, 8).filter((entry) => entry && typeof entry === "object");
    if (Array.isArray(raw.missionsClaimed)) state.missionsClaimed = raw.missionsClaimed.filter((id) => CONFIG.missions.some((mission) => mission.id === id));
    if (Array.isArray(raw.contractsClaimed)) state.contractsClaimed = raw.contractsClaimed.filter((id) => CAMPAIGN_CONTRACTS.some((contract) => contract.id === id));
    if (raw.contractProgress && typeof raw.contractProgress === "object") {
      state.contractProgress = Object.fromEntries(CAMPAIGN_CONTRACTS.map((contract) => [contract.id, clamp(Number(raw.contractProgress[contract.id]) || 0, 0, contract.target)]));
    }
    if (Array.isArray(raw.dailyClaimed)) state.dailyClaimed = raw.dailyClaimed.filter((id) => CONFIG.dailyMissions.some((mission) => mission.id === id));
    if (Array.isArray(raw.achievementsClaimed)) state.achievementsClaimed = raw.achievementsClaimed.filter((id) => CONFIG.achievements.some((achievement) => achievement.id === id));
    for (const upgrade of CONFIG.upgrades) state.upgrades[upgrade.id] = clamp(Number(raw.upgrades?.[upgrade.id] || 0), 0, upgrade.max);
    for (const robot of CONFIG.robotTypes) {
      state.robotRoster[robot.id] = clamp(Number(raw.robotRoster?.[robot.id] ?? (robot.id === "scout" ? raw.robots || 1 : 0)), 0, 8);
      state.robotLevels[robot.id] = clamp(Number(raw.robotLevels?.[robot.id] || 0), 0, robot.levelMax);
    }
    state.activeRobotType = CONFIG.robotTypes.some((robot) => robot.id === raw.activeRobotType && state.robotRoster[robot.id] > 0) ? raw.activeRobotType : "scout";
    for (const tech of CONFIG.techUpgrades) state.techLevels[tech.id] = clamp(Number(raw.techLevels?.[tech.id] || 0), 0, tech.max);
    state.dailyKey = typeof raw.dailyKey === "string" ? raw.dailyKey : "";
    state.dailyProgress = { ...state.dailyProgress, ...(raw.dailyProgress && typeof raw.dailyProgress === "object" ? raw.dailyProgress : {}) };
    for (const key of Object.keys(state.dailyProgress)) state.dailyProgress[key] = Math.max(0, Number(state.dailyProgress[key]) || 0);
    state.lastEvent = raw.lastEvent && typeof raw.lastEvent === "object" ? raw.lastEvent : null;
    state.diveFocus = Object.prototype.hasOwnProperty.call(DIVE_FOCUSES, raw.diveFocus) ? raw.diveFocus : "balanced";
    state.started = raw.started === true;
    state.auroraOwned = raw.auroraOwned === true;
    state.livery = state.auroraOwned && raw.livery === 'aurora' ? 'aurora' : 'default';
    state.museumPity = clamp(Number(raw.museumPity) || 0, 0, 3);
    state.eventPity = Object.fromEntries(CAMPAIGN_CONTRACTS.filter(c => c.event).map(c => [c.id, clamp(Number(raw.eventPity?.[c.id]) || 0, 0, 5)]));
    state.pausedAt = Math.max(0, Number(raw.pausedAt) || 0);
    state.lastHaul = raw.lastHaul && typeof raw.lastHaul === 'object' ? raw.lastHaul : null;
    state.settings = { ...state.settings, ...(raw.settings && typeof raw.settings === "object" ? raw.settings : {}) };
    for (const key of Object.keys(state.settings)) state.settings[key] = state.settings[key] !== false;
    state.coins = Math.max(0, state.coins); state.maxDepth = clamp(state.maxDepth, 120, 2200);
    state.museumValueBonus = clamp(Number(state.museumValueBonus) || 0, 0, 1.5);
    state.pendingOffline = Math.max(0, Math.round(Number(state.pendingOffline) || 0));
    if (CONFIG.robotTypes.every((robot) => state.robotRoster[robot.id] <= 0)) state.robotRoster.scout = 1;
    state.robots = clamp(CONFIG.robotTypes.reduce((sum, robot) => sum + state.robotRoster[robot.id], 0), 1, 24);
    if (raw.currentDive && Number.isFinite(Number(raw.currentDive.startedAt))) {
      state.currentDive = {
        startedAt: Number(raw.currentDive.startedAt),
        sonar: ['hit','miss'].includes(raw.currentDive.sonar) ? raw.currentDive.sonar : null,
        durationMs: clamp(Number(raw.currentDive.durationMs) || 17000, MIN_DIVE_MS, 40000),
        targetDepth: clamp(Number(raw.currentDive.targetDepth) || 70, 10, 1900),
        zoneId: CONFIG.zones.some((zone) => zone.id === (ZONE_ALIASES[raw.currentDive.zoneId] || raw.currentDive.zoneId)) ? (ZONE_ALIASES[raw.currentDive.zoneId] || raw.currentDive.zoneId) : state.zoneId,
        previewLootId: CONFIG.loot.some((loot) => loot.id === raw.currentDive.previewLootId) ? raw.currentDive.previewLootId : "metal",
        focus: Object.prototype.hasOwnProperty.call(DIVE_FOCUSES, raw.currentDive.focus) ? raw.currentDive.focus : state.diveFocus,
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
  // Keep unclaimed offline credits in the save too. Closing the dialog (or
  // leaving the page before pressing Collect) must not erase a completed run.
  let pendingOffline = Math.max(0, Math.round(Number(state.pendingOffline) || 0));
  let lastRender = 0;
  let panelsDirty = true;
  let scene = null;
  let frameId = 0;
  let tickId = 0;
  let saveInterval = 0;
  let disposed = false;
  let sonarAt = -10000;
  const effects = new Set();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionOn = () => state.settings.motion && !reducedMotion.matches;
  const sound = id => window.WeightPlayAudio?.play(id);
  const art = id => `<img class="object-art" data-object="${escapeHtml(id)}" width="48" height="48" alt="">`;
  const hydrateArt = () => {
    if (!scene) return;
    document.querySelectorAll('img[data-object]').forEach(img => {
      if (img.dataset.renderedObject === img.dataset.object) return;
      img.src = scene.icon(img.dataset.object); img.dataset.renderedObject = img.dataset.object;
    });
  };
  const animate = (node, frames, options) => {
    if (!node || !motionOn()) return;
    const animation = node.animate(frames, { duration: 240, easing: 'ease-out', ...options });
    effects.add(animation); animation.finished.catch(() => {}).finally(() => effects.delete(animation));
    return animation;
  };
  const clearEffects = () => { effects.forEach(effect => effect.cancel()); effects.clear(); document.querySelectorAll('.reward-flight').forEach(node => node.remove()); };
  const rewardFeedback = (source = $('haulImage')) => {
    sound('reward.coin');
    animate(els.funds, [{ color:'#fff4c6', transform:'scale(1.12)' }, { color:'#ffe2a0', transform:'scale(1)' }]);
    if (!motionOn() || !scene || !source || document.hidden || !state.started) return;
    const from = source.getBoundingClientRect(), to = els.funds.getBoundingClientRect();
    if (from.bottom < 0 || from.top > innerHeight) return;
    const coin = document.createElement('img'); coin.className = 'reward-flight'; coin.src = scene.icon('coin'); coin.alt = '';
    coin.style.left = `${from.left + from.width/2 - 13}px`; coin.style.top = `${from.top + from.height/2 - 13}px`; document.body.append(coin);
    const a = animate(coin, [{ transform:'translate(0,0) scale(1)', opacity:1 }, { transform:`translate(${to.left - from.left}px,${to.top - from.top}px) scale(.5)`, opacity:.2 }], { duration:450 });
    a?.finished.catch(() => {}).finally(() => coin.remove());
  };
  const confirmAction = (title, copy, action, label = t('confirm')) => {
    if (document.querySelector('.salvage-dialog')) return;
    const dialog = document.createElement('dialog'); dialog.className = 'salvage-dialog';
    dialog.innerHTML = `<h2 id="salvageDialogTitle">${escapeHtml(title)}</h2><p>${escapeHtml(copy)}</p><footer><button class="secondary" data-cancel>${escapeHtml(t('cancel'))}</button><button class="primary" data-confirm>${escapeHtml(label)}</button></footer>`;
    dialog.setAttribute('aria-labelledby','salvageDialogTitle'); document.body.append(dialog);
    const previous = document.activeElement;
    dialog.addEventListener('close', () => { dialog.remove(); previous?.focus?.({preventScroll:true}); }, { once:true });
    dialog.querySelector('[data-cancel]').onclick = () => dialog.close();
    dialog.querySelector('[data-confirm]').onclick = () => { dialog.close(); action(); };
    dialog.showModal(); dialog.querySelector('[data-cancel]').focus();
    animate(dialog,[{opacity:0,transform:'scale(.97)'},{opacity:1,transform:'scale(1)'}],{duration:160});
  };
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
    const diveDuration = Math.round(14000 * (1 - level("dive") * 0.055) / (1 + level("movement") * .025) / Math.max(0.5, 1 + techLevel("speed") * 0.04 + robots.speedBonus * 0.22));
    const capacity = Math.max(8, Math.round(8 + level("cargo") * 1.2 + Math.max(0, robots.capacityBonus) + (robots.count - 1) * 0.8));
    const finds = 1 + level("salvage");
    const valueMultiplier = researchMultiplier * (1 + level("value") * 0.12 + state.museumValueBonus);
    const rareChance = clamp(0.045 + level("rare") * 0.024 + techLevel("rare") * 0.018 + robots.rareBonus, 0.045, 0.58);
    const offlineRate = clamp(OFFLINE_RATE + techLevel("offline") * 0.035, OFFLINE_RATE, 0.98);
    return { researchMultiplier, diveDuration: clamp(diveDuration, MIN_DIVE_MS, 17000), capacity, finds, valueMultiplier, rareChance, offlineRate, robots };
  };

  const zoneLabel = (zone) => t(zone.nameKey) === zone.nameKey ? zone.name : t(zone.nameKey);
  const lootLabel = (loot) => t(loot.key) === loot.key ? loot.id : t(loot.key);
  const rarityLabel = (rarity) => t(rarity) === rarity ? rarity : t(rarity);

  const save = () => {
    state.lastSavedAt = Date.now();
    state.pendingOffline = pendingOffline;
    storageSet(STORE_KEY, JSON.stringify(state));
    if (els.saveState) { els.saveState.dataset.saving = "false"; els.saveState.textContent = "●"; }
  };
  const markSaving = () => {
    panelsDirty = true;
    if (els.saveState) { els.saveState.dataset.saving = "true"; els.saveState.textContent = "◌"; }
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(save, 380);
  };

  const showToast = (message) => {
    if (!els.toast) return;
    window.clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.hidden = false;
    animate(els.toast,[{opacity:0},{opacity:1}],{duration:160});
    toastTimer = window.setTimeout(() => { els.toast.hidden = true; }, 2600);
  };

  const applyMuseumMilestones = ({ silent = false, deferReward = false } = {}) => {
    let changed = false;
    for (const milestone of CONFIG.museumMilestones) {
      if (state.museum.length < milestone.threshold || state.museumMilestonesClaimed.includes(milestone.id)) continue;
      state.museumMilestonesClaimed.push(milestone.id);
      state.museumValueBonus = clamp(state.museumValueBonus + milestone.valueBonus, 0, 1.5);
      if (deferReward) pendingOffline += milestone.reward;
      else state.coins += milestone.reward;
      changed = true;
      if (!silent) showToast(t("museumMilestoneMessage", { name: t(milestone.key), value: number(milestone.reward), bonus: number(milestone.valueBonus * 100) }));
    }
    if (changed) {
      document.body.dataset.museumTier = String(state.museumMilestonesClaimed.length);
      markSaving();
    }
    return changed;
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

  const chooseLoot = (targetDepth, focus = state.diveFocus) => {
    const available = CONFIG.loot.filter((loot) => loot.minDepth <= targetDepth);
    if (!available.length) return CONFIG.loot[0];
    const rareRoll = Math.random() < clamp(derived().rareChance + (focus === "museum" ? 0.1 : 0), 0.045, 0.68);
    const pool = rareRoll
      ? available.filter((loot) => loot.rarity === "rare" || loot.rarity === "legendary")
      : available.filter((loot) => loot.rarity === "common" || loot.rarity === "uncommon");
    const selected = pool.length ? pool : available;
    const weights = selected.map((loot) => {
      const depthFit = Math.max(1, 125 - Math.max(0, targetDepth - loot.minDepth) * 0.08);
      const targetBoost = loot.special ? 0.35 : 1;
      const focusBoost = focus === "value"
        ? (lootIsCollection(loot) ? 0.62 : loot.special ? 1.55 : 1.18)
        : focus === "museum"
          ? (lootIsCollection(loot) ? 2.45 : loot.special ? 0.82 : 0.72)
          : 1;
      return depthFit * targetBoost * focusBoost;
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
    const targetDepth = Math.round(upper);
    const focus = Object.prototype.hasOwnProperty.call(DIVE_FOCUSES, state.diveFocus) ? state.diveFocus : "balanced";
    const undiscovered = CONFIG.loot.filter(loot => loot.collection && loot.minDepth <= targetDepth && !state.museum.includes(loot.id));
    const preview = focus === 'museum' && state.museumPity >= 2 && undiscovered.length ? undiscovered[0] : chooseLoot(targetDepth, focus);
    const salvageTime = Math.round((preview.salvageMs || 0) * 0.3);
    return { startedAt, durationMs: clamp(stats.diveDuration + salvageTime, MIN_DIVE_MS, 20000), targetDepth, zoneId: zone.id, previewLootId: preview.id, focus, sonar: null };
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
    const museumBefore = state.museum.length;
    const found = [];
    const suppressToast = offline || silent;
    const loadLoot = (loot) => {
      if (!loot) return false;
      const weight = Math.max(1, Number(loot.weight) || 1);
      if (cargoCount > 0 && cargoWeight + weight > stats.capacity) return false;
      const value = Math.max(1, loot.baseValue * stats.valueMultiplier * (dive.focus === "value" && !loot.collection ? 1.3 : 1) * (dive.sonar === "hit" ? 1.35 : 1) * (0.9 + Math.random() * 0.25));
      const payout = lootIsCollection(loot) ? Math.max(1, Math.round(value * 0.14)) : Math.round(value);
      cargoWeight += weight;
      cargoCount += 1;
      found.push(loot.id);
      state.totalValue += Math.round(value);
      addFind(loot, lootIsCollection(loot) ? payout : value, suppressToast);
      if (lootIsCollection(loot)) museumValue += payout;
      else soldValue += payout;
      return true;
    };
    loadLoot(CONFIG.loot.find(loot => loot.id === dive.previewLootId));
    for (let index = 0; index < lootCount * 3 && cargoCount < lootCount; index += 1) {
      loadLoot(chooseLoot(dive.targetDepth, dive.focus));
    }
    if (!cargoCount) loadLoot(CONFIG.loot[0]);
    const matchingEvents = CAMPAIGN_CONTRACTS.filter(c => c.event && !state.contractsClaimed.includes(c.id) && c.zone === dive.zoneId && c.focus === dive.focus && dive.targetDepth >= (c.minDepth || 0) && contractGateOpen(c));
    for (const c of matchingEvents) state.eventPity[c.id] = (state.eventPity[c.id] || 0) + 1;
    const due = matchingEvents.find(c => state.eventPity[c.id] >= 5);
    const event = due ? CONFIG.events.find(e => e.id === due.event) : rollEvent(dive.targetDepth);
    for (const c of matchingEvents) if (c.event === event?.id) state.eventPity[c.id] = 0;
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
    applyMuseumMilestones({ silent: suppressToast, deferReward: offline });
    earned = soldValue + museumValue;
    state.totalSold += soldValue;
    state.totalValue += eventBonus;
    state.totalDives += 1;
    if (dive.focus === 'museum') state.museumPity = state.museum.length > museumBefore ? 0 : state.museumPity + 1;
    state.dailyProgress.dives += 1;
    state.dailyProgress.sold += soldValue;
    advanceContracts(dive, { event });
    state.currentDive = null;
    const payout = Math.round(earned);
    if (offline) pendingOffline += Math.round(payout * stats.offlineRate);
    else state.coins += payout;
    state.lastHaul = { lootId: found[0], count: found.length, weight: cargoWeight, payout, sonar: dive.sonar, eventKey:event?.key || '', at: Date.now() };
    if (!suppressToast) { rewardFeedback(); animate(document.querySelector('.haul-receipt'), [{background:'#39655b'}, {background:'transparent'}], {duration:450}); }
    return { earned: payout, durationMs: dive.durationMs, finishedAt: dive.startedAt + dive.durationMs, event };
  };

  const processOffline = () => {
    if (!state.started || state.pausedAt) return;
    const now = Date.now();
    const savedAt = Number.isFinite(state.lastSavedAt) ? clamp(state.lastSavedAt, 0, now) : now;
    const horizon = Math.min(now, Math.min(savedAt, state.currentDive?.startedAt || savedAt) + MAX_OFFLINE_MS);
    let cycles = 0;
    if (!state.currentDive) state.currentDive = makeDive(savedAt);
    else {
      const finishedAt = Number(state.currentDive.startedAt) + Number(state.currentDive.durationMs);
      if (!Number.isFinite(finishedAt)) state.currentDive = makeDive(savedAt);
    }


    while (state.currentDive && state.currentDive.startedAt + state.currentDive.durationMs <= horizon && cycles < MAX_OFFLINE_CYCLES) {
      const result = settleDive({ offline: true, silent: true });
      const finishedAt = result.finishedAt;
      state.currentDive = makeDive(finishedAt);
      cycles += 1;
    }
    if ((cycles >= MAX_OFFLINE_CYCLES || now > horizon) && state.currentDive) state.currentDive.startedAt = now;
    state.lastSavedAt = now;
    state.pendingOffline = pendingOffline;
    // Persist the new dive anchor and any unclaimed payout immediately. This
    // keeps a dismissed offline dialog recoverable on the next visit.
    save();
    if (pendingOffline > 0) {
      els.offlineValue.textContent = `+${number(pendingOffline)} ${t("credits")}`;
      els.offlineModal.hidden = false;
    }
  };

  const phaseFor = (progress) => progress < 0.42 ? "diving" : progress < 0.73 ? "searching" : "returning";
  const phaseText = (phase) => t(phase);
  const progressFor = (now = Date.now()) => {
    if (!state.currentDive) return 0;
    return clamp(((state.pausedAt || now) - state.currentDive.startedAt) / state.currentDive.durationMs, 0, 1);
  };

  const upgradeCost = (upgrade) => Math.round(upgrade.baseCost * Math.pow(upgrade.costScale, level(upgrade.id)));
  const upgradeEffect = (upgrade, increment = 0) => {
    const current = Math.min(upgrade.max, level(upgrade.id) + increment);
    const effects = {
      dive: `${Math.round(100 - current * 5.5)}`, movement: `${current * 2.5}`, salvage: `${current}`,
      cargo: `${Math.round(current * 1.2)}`, depth: `${current * 100}`, value: `${current * 12}`, robots: `${current}`, rare: `${current * 2.4}`,
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

  const contractGateOpen = contract => missingRequirements(contract, state, effectiveMaxDepth(), totalRobots()).length === 0;
  const contractTitle = contract => `${zoneLabel(CONFIG.zones.find(z => z.id === contract.zone))} ${contract.id.split('-')[1]} · ${t(DIVE_FOCUSES[contract.focus].key)}`;
  const requirementText = contract => {
    const missing = missingRequirements(contract, state, effectiveMaxDepth(), totalRobots());
    const labels = missing.map(([kind, value, amount]) => {
      if (kind === 'upgrade') return `${t(CONFIG.upgrades.find(u => u.id === value).key)} ${t('level')} ${amount}`;
      if (kind === 'tech') return `${t(CONFIG.techUpgrades.find(u => u.id === value).key)} ${t('level')} ${amount}`;
      return `${t(kind)} ${value}${kind === 'depth' ? t('metres') : ''}`;
    });
    const event = CONFIG.events.find(e => e.id === contract.event);
    return [labels.length ? t('remainingNeeds', { needs: labels.join(' · ') }) : '', `${t(DIVE_FOCUSES[contract.focus].key)} · ${contract.target} ${t('dives')}`, event ? `${t(event.key)} · ${t('eventGuarantee')}` : ''].filter(Boolean).join(' · ');
  };
  const currentContract = () => CAMPAIGN_CONTRACTS.find(c => !state.contractsClaimed.includes(c.id));
  const claimContract = contract => {
    if (!contract || state.contractsClaimed.includes(contract.id) || (state.contractProgress[contract.id] || 0) < contract.target || !contractGateOpen(contract)) return;
    state.contractsClaimed.push(contract.id); state.coins += contract.reward;
    rewardFeedback($('contractAction')); showToast(`+${number(contract.reward)} ${t('credits')} · ${t('missionComplete')}`); markSaving(); render();
  };
  const renderContract = () => {
    const c = currentContract(); $('activeContractCount').textContent = `${state.contractsClaimed.length}/30`;
    $('contractTitle').textContent = c ? contractTitle(c) : t('claimedAll');
    $('contractRequirement').textContent = c ? requirementText(c) : t('autoLoopCopy');
    const ready = c && (state.contractProgress[c.id] || 0) >= c.target && contractGateOpen(c);
    $('contractAction').textContent = t(ready ? 'missionClaim' : 'configureNext'); $('contractAction').disabled = !c;
    $('contractReward').textContent = c ? `+${number(c.reward)} ${t('credits')}` : '';
    $('activeContractProgress').style.width = `${c ? Math.min(100,(state.contractProgress[c.id] || 0)/c.target*100) : 100}%`;
  };

  const contractMatchesDive = (contract, dive, result) => {
    if (!dive || dive.zoneId !== contract.zone || dive.focus !== contract.focus) return false;
    if (contract.minDepth && dive.targetDepth < contract.minDepth) return false;
    if (contract.event && result?.event?.id !== contract.event) return false;
    return contractGateOpen(contract);
  };
  const advanceContracts = (dive, result) => {
    let changed = false;
    for (const contract of CAMPAIGN_CONTRACTS) {
      if (state.contractsClaimed.includes(contract.id) || !contractMatchesDive(contract, dive, result)) continue;
      const current = Number(state.contractProgress[contract.id] || 0);
      if (current < contract.target) { state.contractProgress[contract.id] = current + 1; changed = true; }
    }
    return changed;
  };

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
        <strong>${escapeHtml(zoneLabel(zone))}</strong><small>${zone.minDepth}–${zone.maxDepth}${escapeHtml(t("metres"))} · ${escapeHtml(t(zone.habitatKey))}</small><em>${isUnlocked ? (selected ? "● " : "") + escapeHtml(t("zoneUnlocked")) : escapeHtml(t("zoneLocked"))}</em>
      </button>`;
    }).join("");
    els.zoneList.querySelectorAll("[data-zone]").forEach((button) => button.addEventListener("click", () => {
      const zone = CONFIG.zones.find((candidate) => candidate.id === button.dataset.zone);
      if (!zone || effectiveMaxDepth() < zone.minDepth) return;
      state.zoneId = zone.id;
      showToast(`${t("nextExpedition")} · ${zoneLabel(zone)}`);
      markSaving(); render();
    }));
  };

  const renderFindLog = () => {
    els.totalDives.textContent = `${number(state.totalDives)} ${t("dives")}`;
    els.findLog.innerHTML = state.recentFinds.length ? state.recentFinds.slice(0, 6).map((entry) => {
      const loot = CONFIG.loot.find((candidate) => candidate.id === entry.lootId) || CONFIG.loot[0];
      const weight = Number(entry.weight ?? loot.weight) || 0;
      const tag = entry.collection ? t("collectible") : t("sold");
      return `<div class="find-row">${art(loot.id)}<span>${escapeHtml(lootLabel(loot))} <small>· ${escapeHtml(rarityLabel(entry.rarity || loot.rarity))} · ${number(weight)}${escapeHtml(t("kg"))} · ${escapeHtml(tag)}</small></span><strong>+${number(entry.value)} ${escapeHtml(t("credits"))}</strong></div>`;
    }).join("") : `<p class="empty-copy">${escapeHtml(t("noFinds"))}</p>`;
  };

  const renderUpgrades = () => {
    els.upgradeList.innerHTML = CONFIG.upgrades.map((upgrade) => {
      const current = level(upgrade.id);
      const maxed = current >= upgrade.max;
      const cost = upgradeCost(upgrade);
      const effect = t(upgrade.effectKey, { value: upgradeEffect(upgrade) }) + (maxed ? '' : ` → ${t(upgrade.effectKey, {value:upgradeEffect(upgrade,1)})}`);
      return `<article class="upgrade-card">${art(upgrade.id)}<div><h3>${escapeHtml(t(upgrade.key))}</h3><p>${escapeHtml(t("effect"))} · ${escapeHtml(effect)}</p><small>${escapeHtml(t("level"))} ${current}/${upgrade.max}</small></div><button type="button" class="upgrade-action" data-upgrade="${upgrade.id}" ${maxed ? "disabled" : ""}><strong>${maxed ? escapeHtml(t("maxed")) : `−${number(cost)}`}</strong><span>${maxed ? "" : escapeHtml(t("buy"))}</span></button></article>`;
    }).join("");
    els.upgradeList.querySelectorAll("[data-upgrade]").forEach((button) => button.addEventListener("click", () => {
      const upgrade = CONFIG.upgrades.find((candidate) => candidate.id === button.dataset.upgrade);
      if (!upgrade || level(upgrade.id) >= upgrade.max) return;
      const cost = upgradeCost(upgrade);
      if (state.coins < cost) { sound("feedback.error"); showToast(`${t("cost")} · ${number(cost)} ${t("credits")}`); return; }
      state.coins -= cost; state.upgrades[upgrade.id] += 1;
      if (upgrade.id === "robots") {
        state.robotRoster.scout = clamp(Math.max(state.robotRoster.scout || 0, 1 + level("robots")), 1, 8);
        syncRobotCount();
      }
      if (upgrade.id === "depth") state.maxDepth = clamp(120 + level("depth") * 100, 120, 1920);
      sound("shop.purchase");
      showToast(t("levelUpMessage", { name: t(upgrade.key), level: level(upgrade.id) }));
      markSaving(); render();
    }));
  };

  const renderMuseum = () => {
    const collectionLoot = CONFIG.loot.filter(lootIsCollection);
    const bonus = Math.round(state.museumValueBonus * 100);
    document.body.dataset.museumTier = String(state.museumMilestonesClaimed.length);
    els.museumCount.textContent = `${state.museum.length}/${collectionLoot.length} ${t("found")}${bonus ? ` · +${bonus}% ${t("museumBonus")}` : ""}`;
    els.museumGrid.innerHTML = collectionLoot.map((loot) => {
      const found = state.museum.includes(loot.id);
      return `<article class="museum-card${found ? " discovered" : ""}"><div class="museum-icon" aria-hidden="true">${art(loot.id)}</div><div><strong>${escapeHtml(found ? lootLabel(loot) : t("unknownItem"))}</strong><small>${escapeHtml(found ? `${rarityLabel(loot.rarity)} · ${t("discovered")} · ${loot.weight}${t("kg")}` : `${t("undiscovered")} · ${loot.minDepth}${t("metres")}`)}</small></div></article>`;
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
      rewardFeedback(button); showToast(`+${number(mission.reward)} ${t("credits")} · ${t("missionComplete")}`); markSaving(); render();
    }));
    els.dailyMissionList.querySelectorAll("[data-daily]").forEach((button) => button.addEventListener("click", () => {
      const mission = CONFIG.dailyMissions.find((candidate) => candidate.id === button.dataset.daily);
      if (!mission || state.dailyClaimed.includes(mission.id) || dailyMissionProgress(mission) < mission.target) return;
      state.dailyClaimed.push(mission.id); state.coins += mission.reward;
      rewardFeedback(button); showToast(`+${number(mission.reward)} ${t("credits")} · ${t("missionComplete")}`); markSaving(); render();
    }));
    if (els.contractList) {
      const claimedContracts = CAMPAIGN_CONTRACTS.filter((contract) => state.contractsClaimed.includes(contract.id)).length;
      els.contractCount.textContent = `${claimedContracts}/${CAMPAIGN_CONTRACTS.length} ${t("missionClaimed")}`;
      els.contractList.innerHTML = CAMPAIGN_CONTRACTS.map((contract) => {
        const current = Math.min(contract.target, Number(state.contractProgress[contract.id] || 0));
        const claimed = state.contractsClaimed.includes(contract.id);
        const ready = !claimed && current >= contract.target && contractGateOpen(contract);
        const zone = CONFIG.zones.find((candidate) => candidate.id === contract.zone);
        const focus = DIVE_FOCUSES[contract.focus];
        const title = contractTitle(contract);
        const gate = contract.event ? ` · ${contract.event}` : contract.minDepth ? ` · ${number(contract.minDepth)}${t("metres")}` : "";
        const action = claimed ? t("missionClaimed") : ready ? t("missionClaim") : `${number(current)}/${number(contract.target)}`;
        return `<article class="mission-card${ready || claimed ? " complete" : ""}"><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(requirementText(contract))} · ${number(contract.reward)} ${escapeHtml(t("credits"))}</p><div class="mission-bar"><i style="width:${Math.round(clamp(current / contract.target * 100, 0, 100))}%"></i></div><small class="mission-progress">${escapeHtml(t("missionProgress"))} · ${number(current)}/${number(contract.target)}</small></div><button type="button" class="mission-action" data-contract="${contract.id}" ${claimed || !ready ? "disabled" : ""}>${escapeHtml(action)}</button></article>`;
      }).join("");
      els.contractList.querySelectorAll("[data-contract]").forEach((button) => button.addEventListener("click", () => {
        claimContract(CAMPAIGN_CONTRACTS.find(candidate => candidate.id === button.dataset.contract));

      }));
    }
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
      return `<article class="robot-card${active ? " active" : ""}${unlocked ? "" : " locked"}"><header>${art(robot.id)}<h3>${escapeHtml(t(robot.key))}</h3><span>${escapeHtml(status)}</span></header><p>${escapeHtml(t(robot.copyKey))}</p><div class="robot-stats"><span>${Math.round((robot.speedBonus + rank * 0.012) * 100)}% ${escapeHtml(t("speed"))}</span><span>+${number(robot.capacityBonus + rank * 0.35)}${escapeHtml(t("kg"))}</span><span>+${Math.round((robot.rareBonus + rank * 0.004) * 100)}%</span></div><div class="robot-actions"><button type="button" data-robot-select="${robot.id}" ${unlocked && owned ? "" : "disabled"}>${active ? escapeHtml(t("robotActive")) : escapeHtml(t("robotSelect"))}</button><button type="button" data-robot-hire="${robot.id}" ${!unlocked || owned >= 8 || state.coins < hireCost ? "disabled" : ""}>+1 · ${number(hireCost)}</button><button type="button" data-robot-upgrade="${robot.id}" ${!owned || rank >= robot.levelMax || state.coins < levelCost ? "disabled" : ""}>${rank >= robot.levelMax ? escapeHtml(t("maxed")) : `Lv.${rank + 1} · ${number(levelCost)}`}</button></div></article>`;
    }).join("");
    els.robotList.querySelectorAll("[data-robot-select]").forEach((button) => button.addEventListener("click", () => {
      if (!CONFIG.robotTypes.some((robot) => robot.id === button.dataset.robotSelect && state.robotRoster[robot.id] > 0 && effectiveMaxDepth() >= robot.unlockDepth)) return;
      state.activeRobotType = button.dataset.robotSelect; markSaving(); render();
    }));
    els.robotList.querySelectorAll("[data-robot-hire]").forEach((button) => button.addEventListener("click", () => {
      const robot = CONFIG.robotTypes.find((candidate) => candidate.id === button.dataset.robotHire);
      if (!robot || effectiveMaxDepth() < robot.unlockDepth || (state.robotRoster[robot.id] || 0) >= 8) return;
      const cost = robotHireCost(robot);
      if (state.coins < cost) { sound("feedback.error"); showToast(`${t("cost")} · ${number(cost)} ${t("credits")}`); return; }
      state.coins -= cost; state.robotRoster[robot.id] += 1; syncRobotCount();
      sound("shop.purchase"); showToast(t("robotHired", { name: t(robot.key) })); markSaving(); render();
    }));
    els.robotList.querySelectorAll("[data-robot-upgrade]").forEach((button) => button.addEventListener("click", () => {
      const robot = CONFIG.robotTypes.find((candidate) => candidate.id === button.dataset.robotUpgrade);
      if (!robot || !state.robotRoster[robot.id] || state.robotLevels[robot.id] >= robot.levelMax) return;
      const cost = robotLevelCost(robot);
      if (state.coins < cost) { sound("feedback.error"); showToast(`${t("cost")} · ${number(cost)} ${t("credits")}`); return; }
      state.coins -= cost; state.robotLevels[robot.id] += 1;
      sound("shop.purchase"); showToast(t("robotUpgraded", { name: t(robot.key), level: state.robotLevels[robot.id] })); markSaving(); render();
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
      return `<article class="achievement-card${complete ? " complete" : ""}"><div class="achievement-icon" aria-hidden="true">${art("ancientRelic")}</div><div><h3>${escapeHtml(t(achievement.key, { target: number(achievement.target) }))}</h3><p>${escapeHtml(t("missionReward"))} · ${number(achievement.reward)} ${escapeHtml(t("credits"))} · ${number(current)}/${number(achievement.target)}</p></div><button type="button" data-achievement="${achievement.id}" ${claimed || !complete ? "disabled" : ""}>${escapeHtml(action)}</button></article>`;
    }).join("");
    els.achievementList.querySelectorAll("[data-achievement]").forEach((button) => button.addEventListener("click", () => {
      const achievement = CONFIG.achievements.find((candidate) => candidate.id === button.dataset.achievement);
      if (!achievement || state.achievementsClaimed.includes(achievement.id) || achievementProgress(achievement) < achievement.target) return;
      state.achievementsClaimed.push(achievement.id); state.coins += achievement.reward;
      rewardFeedback(button); showToast(`+${number(achievement.reward)} ${t("credits")} · ${t("achievementDone")}`); markSaving(); render();
    }));
  };

  const techCost = (tech) => 1 + techLevel(tech.id) * 2;
  const researchReward = () => Math.min(12, 1 + Math.floor(state.totalSold / 3000) + Math.max(0,Math.floor((effectiveMaxDepth() - 760) / 200)));
  const techEffect = (tech) => {
    const value = techLevel(tech.id);
    const effects = { income: `${value * 10}%`, speed: `${value * 4}%`, rare: `${value * 1.8}%`, depth: `${value * 80}${t("metres")}`, offline: `${Math.round((OFFLINE_RATE + value * 0.035) * 100)}%` };
    return effects[tech.id] || "0";
  };

  const renderTechnology = () => {
    const ready = effectiveMaxDepth() >= 760 && state.totalSold >= 3000;
    els.research.textContent = number(state.research);
    els.researchMultiplier.textContent = `×${derived().researchMultiplier.toFixed(1)}`;
    els.techCopy.textContent = t(ready ? "techReady" : "techLocked") + (ready ? ` +${researchReward()} ${t('techPoints')}` : '');
    els.prestige.disabled = !ready;
    els.techUpgradeList.innerHTML = CONFIG.techUpgrades.map((tech) => {
      const current = techLevel(tech.id);
      const maxed = current >= tech.max;
      const cost = techCost(tech);
      return `<article class="tech-upgrade-card"><div><h3>${escapeHtml(t(tech.key))}</h3><p>${escapeHtml(t(tech.effectKey, { value: techEffect(tech) }))} · ${escapeHtml(t("level"))} ${current}/${tech.max}</p></div><button type="button" data-tech="${tech.id}" ${maxed || state.research < cost ? "disabled" : ""}>${maxed ? escapeHtml(t("maxed")) : `${number(cost)} ${t("techPoints")}`}</button></article>`;
    }).join("");
    els.techUpgradeList.querySelectorAll("[data-tech]").forEach((button) => button.addEventListener("click", () => {
      const tech = CONFIG.techUpgrades.find((candidate) => candidate.id === button.dataset.tech);
      if (!tech || techLevel(tech.id) >= tech.max) return;
      const cost = techCost(tech);
      if (state.research < cost) { showToast(`${t("techPoints")} · ${number(cost)}`); return; }
      state.research -= cost; state.techLevels[tech.id] += 1;
      sound("shop.purchase"); showToast(t("techUpgraded", { name: t(tech.key) })); markSaving(); render();
    }));
  };

  const renderEvent = () => {
    // Event identity lives in the fixed haul receipt, so it cannot move sonar
    // controls while a player is timing an input.
    els.eventBanner.hidden = true;
  };

  const renderDiveFocus = () => {
    const focus = DIVE_FOCUSES[state.diveFocus] || DIVE_FOCUSES.balanced;
    if (els.focusStatus) els.focusStatus.textContent = t(focus.key);
    if (els.focusCopy) els.focusCopy.textContent = state.diveFocus === "museum" ? t("collectionGuarantee") : t(focus.copyKey);
    els.focusPanel?.querySelectorAll("[data-focus]").forEach((button) => {
      const active = button.dataset.focus === state.diveFocus;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  };

  const applySettings = () => {
    document.body.dataset.motion = motionOn() ? "on" : "off";
    if (!motionOn()) clearEffects();
    document.body.dataset.music = state.settings.music ? "on" : "off";
    document.body.dataset.sound = state.settings.sound ? "on" : "off";
  };

  const renderSettings = () => {
    const settings = [
      { id: "motion", key: "motion", copyKey: "motionCopy" },
    ];
    els.settingsList.innerHTML = settings.map((setting) => `<div class="setting-row"><span><strong>${escapeHtml(t(setting.key))}</strong><small>${escapeHtml(t(setting.copyKey))}</small></span><button type="button" class="setting-toggle" data-setting="${setting.id}" data-enabled="${state.settings[setting.id]}">${state.settings[setting.id] ? escapeHtml(t("on")) : escapeHtml(t("off"))}</button></div>`).join("");
    els.settingsList.querySelectorAll("[data-setting]").forEach((button) => button.addEventListener("click", () => {
      const id = button.dataset.setting;
      if (!Object.prototype.hasOwnProperty.call(state.settings, id)) return;
      state.settings[id] = !state.settings[id]; applySettings(); markSaving(); render();
    }));
  };

  const syncSceneVisibility = () => {
    const started = state.started === true;
    if (els.landing) els.landing.hidden = started;
    if (els.dashboard) els.dashboard.hidden = !started;
    document.body.classList.toggle("deep-sea-game-started", started);
    document.body.dataset.gameStarted = String(started);
  };

  const renderLivery = () => {
    const wallet = window.WeightPlayWallet;
    const owned = state.auroraOwned;
    $('liveryShop').innerHTML = `${art('aurora')}<div><h3>${escapeHtml(t('liveryTitle'))}</h3><p>${escapeHtml(t('liveryCopy'))}</p><small><img src="/assets/weightplay-diamond.svg" class="diamond-icon" alt="">${escapeHtml(t('balance'))}: ${number(wallet?.read().diamonds || 0)} · ${escapeHtml(t(owned ? 'liveryOwned' : 'liveryBuy'))}</small></div><button class="secondary" id="liveryButton">${escapeHtml(t(owned ? (state.livery === 'aurora' ? 'liveryDefault' : 'liveryUse') : 'liveryBuy'))}</button>`;
    $('liveryButton').onclick = () => {
      if (state.auroraOwned) { state.livery = state.livery === 'aurora' ? 'default' : 'aurora'; markSaving(); render(); return; }
      if (!wallet || wallet.read().diamonds < 8) { sound('feedback.error'); showToast(t('insufficientDiamonds')); return; }
      confirmAction(t('liveryTitle'), `${t('liveryCopy')} ${t('liveryBuy')}`, () => {
        const result = buyLivery({ state, wallet, persist: () => { state.lastSavedAt = Date.now(); state.pendingOffline = pendingOffline; localStorage.setItem(STORE_KEY, JSON.stringify(state)); } });
        sound(result === 'purchased' ? 'shop.purchase' : 'feedback.error');
        showToast(t(result === 'purchased' ? 'liveryOwned' : result === 'insufficient' ? 'insufficientDiamonds' : 'purchaseFailed'));
        panelsDirty = true; render();
      }, t('liveryBuy'));
    };
  };
  const render = (now = Date.now()) => {
    syncSceneVisibility(); ensureDailyState();
    document.querySelector('[data-wp-main-progress]').textContent = `${number(effectiveMaxDepth())}${t('metres')} · ${t('museum')} ${state.museum.length}/${CONFIG.loot.filter(lootIsCollection).length} · ${t('campaignContracts')} ${state.contractsClaimed.length}/30`;
    const dive = state.currentDive;
    const progress = progressFor(now);
    const phase = phaseFor(progress);
    const zone = CONFIG.zones.find(candidate => candidate.id === dive?.zoneId) || activeZone();
    const stats = derived();
    els.funds.textContent = number(state.coins); els.depth.textContent = number(effectiveMaxDepth());
    els.robots.textContent = number(totalRobots()); els.multiplier.textContent = `×${stats.valueMultiplier.toFixed(1)}`;
    els.zoneName.textContent = zoneLabel(zone); els.zoneDepth.textContent = `${zone.minDepth}–${zone.maxDepth}${t('metres')}`;
    els.stateBadge.textContent = state.pausedAt ? t('stopPaused') : phaseText(phase); els.stateBadge.dataset.state = phase;
    els.targetDepth.textContent = `${number(dive?.targetDepth || 0)}${t('metres')}`;
    const haul = state.lastHaul;
    const preview = CONFIG.loot.find(loot => loot.id === (haul?.lootId || dive?.previewLootId)) || CONFIG.loot[0];
    $('haulLabel').textContent = t(haul ? 'haulReturned' : 'nextDrop');
    els.nextDrop.textContent = lootLabel(preview);
    $('haulImage').dataset.object = preview.id;
    $('haulDetail').textContent = haul ? `${haul.count} · ${haul.weight}${t('kg')}${haul.sonar === 'hit' ? ` · ${t('sonarHit')}` : ''}${haul.eventKey ? ` · ${t(haul.eventKey)}` : ''}` : t('autoLoopCopy');
    $('haulValue').textContent = haul ? `+${number(haul.payout)}` : '';
    els.progress.textContent = `${Math.round(progress * 100)}%`; els.progressFill.style.width = `${progress * 100}%`;
    els.diveStatus.textContent = state.pausedAt ? t('stopPaused') : phaseText(phase);
    els.cargo.textContent = `${stats.capacity}${t('kg')} · ${t('cargo')}`;
    els.currentDepth.textContent = `${number((dive?.targetDepth || 0) * depthFraction(progress))}${t('metres')}`;
    const sonarKey = dive?.sonar === 'hit' ? 'sonarHit' : dive?.sonar === 'miss' ? 'sonarMiss' : progress < .2 ? 'sonarWaiting' : progress >= .73 ? 'returning' : 'sonarReady';
    $('sonarState').textContent = t(sonarKey); $('sonarHint').textContent = t('sonarHint');
    els.quickDive.disabled = !dive || !!dive.sonar || !!state.pausedAt || progress < .2 || progress >= .73;
    els.quickDive.textContent = t(dive?.sonar ? 'sonarSpent' : 'sonarPulse');
    document.querySelector('.sonar-console').dataset.result = dive?.sonar || '';
    els.dispatch.textContent = t(state.pausedAt ? 'resumeExpedition' : 'pauseExpedition');
    els.collect.hidden = pendingOffline <= 0;
    if (panelsDirty) {
      panelsDirty = false;
      renderZones(); renderFindLog(); renderUpgrades(); renderRobots(); renderMuseum(); renderMissions(); renderAchievements(); renderTechnology(); renderDiveFocus(); renderSettings(); renderContract(); renderLivery();
    }
    renderEvent(); hydrateArt();
  };
  const tick = () => {
    if (document.hidden || disposed) return;
    const now = Date.now();
    if (state.started && !state.pausedAt) {
      if (!state.currentDive) startDive(now);
      if (now - state.currentDive.startedAt >= state.currentDive.durationMs) { settleDive(); startDive(now); markSaving(); }
    }
    if (now - lastRender > 220) { lastRender = now; render(now); }
  };
  const drawScene = time => {
    if (disposed) return;
    frameId = requestAnimationFrame(drawScene);
    if (!state.started || document.hidden || !scene) return;
    const p = progressFor();
    $('sonarNeedle').style.left = `${sonarStrength(state.currentDive?.startedAt || 0,state.pausedAt || Date.now()) * 97}%`;
    const rect = els.canvas.getBoundingClientRect();
    scene.draw({ progress:p, zone:state.currentDive?.zoneId || state.zoneId, motion:motionOn() && !state.pausedAt, skin:state.livery === 'aurora' ? 'aurora' : state.activeRobotType, visible:rect.bottom > 0 && rect.top < innerHeight, sonar:sonarAt, time });
  };
  const initScene = () => {
    try {
      scene?.dispose(); scene = createSalvageScene(els.canvas);
      document.querySelectorAll('[data-rendered-object]').forEach(img => delete img.dataset.renderedObject);
      $('sceneError').hidden = true; hydrateArt();
    } catch (error) { scene = null; $('sceneError').hidden = false; console.warn('Deep sea 3D view unavailable',error.message); }
  };
  const pauseExpedition = () => {
    if (state.pausedAt) { if (state.currentDive) state.currentDive.startedAt += Date.now() - state.pausedAt; state.pausedAt = 0; }
    else state.pausedAt = Date.now();
    markSaving(); render();
  };


  const setTab = (name) => {
    clearEffects();
    document.querySelectorAll("[data-tab]").forEach((button) => button.classList.toggle("active", button.dataset.tab === name));
    document.querySelectorAll("[data-panel]").forEach((panel) => { const active = panel.dataset.panel === name; panel.hidden = !active; panel.classList.toggle("active", active); if (active) animate(panel,[{opacity:0,transform:"translateY(5px)"},{opacity:1,transform:"translateY(0)"}],{duration:180}); });
  };

  const bind = () => {
    els.startGame?.addEventListener('click', () => {
      state.started = true;
      if (state.pausedAt) pauseExpedition();
      if (!state.currentDive) startDive();
      save(); render(); els.app.scrollIntoView({block:'start',behavior:'instant'}); animate(els.dashboard,[{opacity:0},{opacity:1}],{duration:180});
    });
    $('returnMainButton').addEventListener('click', () => {
      if (!state.pausedAt) pauseExpedition();
      state.started = false; clearEffects(); els.toast.hidden = true; save(); render(); els.startGame.focus({preventScroll:true}); els.app.scrollIntoView({block:'start',behavior:'instant'});
    });
    els.locale?.addEventListener('change', () => { save(); window.deepSeaSetLocale?.(els.locale.value); });
    els.reset?.addEventListener('click', () => confirmAction(t('reset'), t('resetConfirm'), () => {
      const permanent = { auroraOwned:state.auroraOwned, livery:state.livery, settings:state.settings };
      state = {...freshState(), ...permanent}; pendingOffline = 0; panelsDirty = true; clearEffects(); applySettings(); save(); render(); showToast(t('resetDone'));
    }));
    els.dispatch?.addEventListener('click', pauseExpedition);
    els.quickDive?.addEventListener('click', () => {
      if (!state.started || state.pausedAt) return;
      const outcome = sonarOutcome(state.currentDive,Date.now());
      if (!outcome) return;
      state.currentDive.sonar = outcome; sonarAt = Date.now();
      sound(outcome === 'hit' ? 'feedback.success' : 'feedback.error');
      animate(document.querySelector('.sonar-console'),[{filter:'brightness(1.5)'},{filter:'brightness(1)'}],{duration:320});
      showToast(t(outcome === 'hit' ? 'sonarHit' : 'sonarMiss')); markSaving(); render();
    });
    $('retrySceneButton').addEventListener('click', initScene);
    els.canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); $('sceneError').hidden = false; clearEffects(); });
    els.canvas.addEventListener('webglcontextrestored', initScene);
    $('contractAction').addEventListener('click', () => {
      const c = currentContract(); if (!c) return;
      if ((state.contractProgress[c.id] || 0) >= c.target && contractGateOpen(c)) { claimContract(c); return; }
      const zone = CONFIG.zones.find(z => z.id === c.zone);
      if (effectiveMaxDepth() >= zone.minDepth) state.zoneId = c.zone;
      state.diveFocus = c.focus;
      const missing = missingRequirements(c,state,effectiveMaxDepth(),totalRobots());
      if (missing.some(m => ['depth','upgrade'].includes(m[0]))) setTab('upgrades');
      else if (missing.some(m => ['tech','prestige'].includes(m[0]))) setTab('technology');
      else if (missing.some(m => m[0] === 'robots')) setTab('robots');
      showToast(t('configured')); markSaving(); render();
    });


    els.focusPanel?.querySelectorAll("[data-focus]").forEach((button) => button.addEventListener("click", () => {
      const focus = button.dataset.focus;
      if (!Object.prototype.hasOwnProperty.call(DIVE_FOCUSES, focus)) return;
      state.diveFocus = focus;
      showToast(t(DIVE_FOCUSES[focus].selectedKey));
      markSaving(); render();
    }));
    els.collect?.addEventListener("click", () => {
      if (!pendingOffline) { showToast(t("noFinds")); return; }
      state.coins += pendingOffline; rewardFeedback(els.collect); showToast(t("offlineMessage", { value: number(pendingOffline) })); pendingOffline = 0; markSaving(); render();
    });
    els.offlineCollect?.addEventListener("click", () => { if (!pendingOffline) { els.offlineModal.hidden = true; return; } state.coins += pendingOffline; rewardFeedback(els.collect); showToast(t("offlineMessage", { value: number(pendingOffline) })); pendingOffline = 0; els.offlineModal.hidden = true; markSaving(); render(); });
    els.offlineClose?.addEventListener("click", () => { els.offlineModal.hidden = true; });
    document.querySelectorAll("[data-tab]").forEach((button) => button.addEventListener("click", () => setTab(button.dataset.tab)));
    els.prestige?.addEventListener("click", () => {
      if (effectiveMaxDepth() < 760 || state.totalSold < 3000) return;
      confirmAction(t("prestige"), t("prestigeCopy"), () => {
      const permanent = {auroraOwned:state.auroraOwned, livery:state.livery, settings:state.settings};
      const museum = state.museum.slice();
      const museumMilestonesClaimed = state.museumMilestonesClaimed.slice();
      const museumValueBonus = state.museumValueBonus;
      const achievementsClaimed = state.achievementsClaimed.slice();
      const contractsClaimed = state.contractsClaimed.slice();
      const contractProgress = { ...state.contractProgress };
      const techLevels = { ...state.techLevels };
      const research = state.research + researchReward();
      const prestigeCount = state.prestigeCount + 1;
      state = {...freshState(), ...permanent};
      state.started = true;
      state.museum = museum; state.museumMilestonesClaimed = museumMilestonesClaimed; state.museumValueBonus = museumValueBonus;
      state.achievementsClaimed = achievementsClaimed; state.contractsClaimed = contractsClaimed; state.contractProgress = contractProgress; state.techLevels = techLevels;
      state.research = research; state.prestigeCount = prestigeCount; state.dailyKey = localDateKey();
      pendingOffline = 0; clearEffects(); applySettings(); startDive(); save(); render(); showToast(t("prestigeDone"));
      });
    });
    document.addEventListener('visibilitychange', () => {
      clearEffects();
      if (document.hidden) save();
      else { processOffline(); panelsDirty = true; render(); }
    });
    reducedMotion.addEventListener('change', applySettings);
    window.addEventListener('pagehide', () => {
      save(); disposed = true; clearTimeout(saveTimer); clearTimeout(toastTimer); clearInterval(tickId); clearInterval(saveInterval); cancelAnimationFrame(frameId); clearEffects(); scene?.dispose(); scene = null;
    });
    window.addEventListener('pageshow', event => {
      if (!event.persisted) return;
      disposed = false; processOffline(); initScene(); tickId = setInterval(tick,250); saveInterval = setInterval(save,5000); frameId = requestAnimationFrame(drawScene);
    });
    window.addEventListener("beforeunload", save);
  };

  window.__ANIMAL_DEEP_SEA_SALVAGE_TEST__ = {
    contracts: CAMPAIGN_CONTRACTS,
    getState: () => ({ contractsClaimed: [...state.contractsClaimed], contractProgress: { ...state.contractProgress }, totalDives: state.totalDives }),
    contractGateOpen,
  };
  applyStaticTranslations();
  applySettings();
  ensureDailyState();
  applyMuseumMilestones({ silent: true });
  processOffline();
  if (state.started && !state.currentDive) startDive();
  initScene();
  bind();
  render();
  const entryReady = () => {
    if (state.started) els.app.scrollIntoView({block:'start',behavior:'instant'});
    window.WeightPlayGameEntryLoader?.ready();
  };
  if (document.readyState === "complete") entryReady();
  else window.addEventListener("load", entryReady, { once: true });
  tickId = window.setInterval(tick, 250);
  saveInterval = window.setInterval(() => { if (!document.hidden) save(); }, 5000);
  frameId = window.requestAnimationFrame(drawScene);
  window.setTimeout(() => els.loading?.classList.add("is-hidden"), 260);
})();
