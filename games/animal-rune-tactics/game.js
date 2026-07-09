(() => {
  const GAME_ID = "animal-rune-tactics";
  const saveKey = "weightplay_animal_rune_tactics_v1";
  const localeKey = "weightPlayLocale";
  const trainingCost = 18;
  const rerollCost = 3;
  const cols = 4;
  const rows = 3;
  const testMode = new URLSearchParams(window.location.search).get("test") === "1";

  const $ = (id) => document.getElementById(id);
  const asset = (name) => `../../assets/${name}`;
  const nodes = {
    localeSelect: $("localeSelect"),
    loadingPanel: $("loadingPanel"),
    loadingFill: $("loadingFill"),
    loadingText: $("loadingText"),
    menuPanel: $("menuPanel"),
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
    startBtn: $("startBtn"),
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
    diamondText: $("diamondText"),
    rewardCards: $("rewardCards"),
    rerollBtn: $("rerollBtn"),
    resultTitle: $("resultTitle"),
    resultText: $("resultText"),
    skillReportText: $("skillReportText"),
    nextBtn: $("nextBtn"),
    retryBtn: $("retryBtn"),
    menuBtn: $("menuBtn"),
  };

  const text = {
    en: {
      title: "Animal Rune Tactics",
      language: "Language",
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
  });

  const heroDefs = [
    { id: "lion", name: "lion", role: "lionRole", img: "animal-rune-tactics-hero-lion.webp", hp: 7, atk: 3, skillName: "skillLion", skillDesc: "skillLionDesc", skill: "animal-rune-tactics-skill-lion-strike.webp" },
    { id: "owl", name: "owl", role: "owlRole", img: "animal-rune-tactics-hero-owl.webp", hp: 5, atk: 2, range: 2, skillName: "skillOwl", skillDesc: "skillOwlDesc", skill: "animal-rune-tactics-skill-owl-rune-bolt.webp" },
    { id: "turtle", name: "turtle", role: "turtleRole", img: "animal-rune-tactics-hero-turtle.webp", hp: 9, atk: 1, skillName: "skillTurtle", skillDesc: "skillTurtleDesc", skill: "animal-rune-tactics-skill-turtle-guard.webp" },
  ];

  const enemyDefs = [
    { id: "wolf", name: "wolf", img: "animal-rune-tactics-enemy-wolf.webp", hp: 5, atk: 2 },
    { id: "raven", name: "raven", img: "animal-rune-tactics-enemy-raven.webp", hp: 4, atk: 2, range: 2 },
    { id: "stag", name: "stag", img: "animal-rune-tactics-boss-stag.webp", hp: 10, atk: 3 },
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
  let selectedMission = 1;
  let profile = loadProfile();
  let state = null;

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
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
    nodes.localeSelect.value = locale;
    renderMenu();
    if (state) render();
  }

  function renderMenu() {
    nodes.profileLevel.textContent = profile.level;
    nodes.profileXp.textContent = `${profile.xp}/100`;
    nodes.profileBest.textContent = profile.bestMission;
    nodes.profileRunes.textContent = profile.runes || 0;
    renderGrowthSummary();
    nodes.diamondText.textContent = wallet().diamonds;
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
      btn.innerHTML = `
        <span class="mission-card__top">
          <strong>${t("missionCard", { n: mission.id })}</strong>
          <b>${isLocked ? t("locked") : isActive ? t("missionStatusCurrent") : t("missionStatusUnlocked")}</b>
        </span>
        <small>${t("missionRewardLabel")}: ${isLocked ? t("locked") : t("missionReward", { xp: mission.xp, runes: mission.runes })}</small>
        <span>${t("missionGoal", { enemies: enemyNames })}</span>
        <em>${t("missionPlan", { plan: t(mission.tactic) })}</em>`;
      btn.addEventListener("click", () => {
        selectedMission = mission.id;
        renderMenu();
      });
      nodes.missionGrid.appendChild(btn);
    });
    nodes.startBtn.textContent = t("startSelectedMission", { n: selectedMission });
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

  function startMission(mission = selectedMission) {
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
    nodes.resultPanel.classList.add("is-hidden");
    nodes.rewardPanel.classList.add("is-hidden");
    nodes.gamePanel.classList.remove("is-hidden");
    log("chooseHero");
    render();
    focusPanel(nodes.gamePanel);
  }

  function makeEnemies(mission) {
    const missionDef = missionDefs.find((item) => item.id === mission) || missionDefs[0];
    return missionDef.enemies.map((id, index) => {
      const base = enemyDefs.find((enemy) => enemy.id === id) || enemyDefs[0];
      const x = index % 2 === 0 ? 3 : 2;
      const y = Math.min(rows - 1, index);
      const hp = base.hp + mission + Math.floor(mission / 2);
      return { ...base, x, y, maxHp: hp, hp, atk: base.atk + (mission >= 5 ? 1 : 0), team: "enemy" };
    });
  }

  function render() {
    nodes.missionText.textContent = state.mission;
    nodes.turnText.textContent = state.turn;
    nodes.diamondText.textContent = wallet().diamonds;
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
        if (movable.some((p) => p.x === x && p.y === y)) tile.classList.add("is-move");
        if (attackable.some((p) => p.x === x && p.y === y)) tile.classList.add("is-attack");
        tile.addEventListener("click", () => onTile(x, y));
        const unit = unitAt(x, y);
        if (unit) {
          if (unit.team === "hero" && state.acted.has(unit.id)) tile.classList.add("is-acted");
          if (unit.team === "hero" && state.selected === unit.id) tile.classList.add("is-selected");
          tile.appendChild(renderUnit(unit));
        }
        nodes.grid.appendChild(tile);
      }
    }
    renderSelected();
    renderTurnRoster();
    updateActionButtons();
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
        <button class="${className}" type="button" data-roster-hero="${hero.id}" ${isFallen ? "disabled" : ""}>
          <img src="${asset(hero.img)}" alt="" aria-hidden="true" />
          <span>
            <strong>${t(hero.name)}</strong>
            <small>${status} / HP ${Math.max(0, hero.hp)}/${hero.maxHp}</small>
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
    nodes.attackBtn.disabled = !canAct || !validTargets().length;
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
    const damage = hero.atk + (isSkill ? 2 : 0);
    enemy.hp -= damage;
    markActed(hero);
    playFx(isSkill ? "rune-burst" : "attack-hit", enemy.x, enemy.y);
    log(isSkill ? "skillUsed" : "attacked", { hero: t(hero.name), enemy: t(enemy.name) });
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
      const target = livingHeroes().sort((a, b) => distance(enemy, a) - distance(enemy, b))[0];
      if (!target) return;
      const range = enemy.range || 1;
      if (distance(enemy, target) <= range) {
        const damage = Math.max(1, enemy.atk - (target.guard ? 1 : 0));
        target.hp = Math.max(0, target.hp - damage);
        playFx("attack-hit", target.x, target.y);
        tryAutoRevive(target);
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
    nodes.rewardPanel.classList.remove("is-hidden");
    renderRewards(false);
    focusPanel(nodes.rewardPanel);
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
  }

  function claimReward(id) {
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
    const missionDef = missionDefs.find((item) => item.id === state.mission) || missionDefs[0];
    const xp = win ? missionDef.xp : 12;
    const runes = win ? missionDef.runes : 3;
    profile.xp += xp;
    profile.runes = (profile.runes || 0) + runes;
    while (profile.xp >= 100) {
      profile.xp -= 100;
      profile.level += 1;
    }
    if (win) {
      profile.bestMission = Math.max(profile.bestMission, state.mission);
      profile.unlockedMission = Math.max(profile.unlockedMission, Math.min(missionDefs.length, state.mission + 1));
      selectedMission = Math.min(missionDefs.length, state.mission + 1);
    }
    saveProfile();
    nodes.resultTitle.textContent = t(win ? "missionClear" : "missionFailed");
    nodes.resultText.textContent = t(win ? "resultWin" : "resultLose", { mission: state.mission, xp, runes });
    nodes.skillReportText.textContent = t(win ? "reportWin" : "reportLose");
    nodes.nextBtn.disabled = !win || state.mission >= missionDefs.length;
    nodes.resultPanel.classList.remove("is-hidden");
    renderMenu();
    focusPanel(nodes.resultPanel);
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
    nodes.gamePanel.classList.add("is-hidden");
    nodes.rewardPanel.classList.add("is-hidden");
    nodes.resultPanel.classList.add("is-hidden");
    nodes.menuPanel.classList.remove("is-hidden");
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
    };
  }

  function bind() {
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
    nodes.startBtn.addEventListener("click", () => startMission(selectedMission));
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
