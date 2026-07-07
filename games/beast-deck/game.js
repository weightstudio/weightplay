(() => {
  const GAME_ID = "beast-deck";
  const saveKey = "weightplay_beast_deck_v1";
  const localeKey = "weightPlayLocale";
  const amuletCost = 15;
  const maxMission = 8;

  const $ = (id) => document.getElementById(id);
  const nodes = {
    localeSelect: $("localeSelect"),
    menuPanel: $("menuPanel"),
    gamePanel: $("gamePanel"),
    draftPanel: $("draftPanel"),
    resultPanel: $("resultPanel"),
    startBtn: $("startBtn"),
    menuBtn: $("menuBtn"),
    retryBtn: $("retryBtn"),
    resultMenuBtn: $("resultMenuBtn"),
    stageText: $("stageText"),
    missionText: $("missionText"),
    hpText: $("hpText"),
    energyText: $("energyText"),
    deckText: $("deckText"),
    discardText: $("discardText"),
    handRow: $("handRow"),
    endTurnBtn: $("endTurnBtn"),
    enemyIntent: $("enemyIntent"),
    intentIcon: $("intentIcon"),
    intentText: $("intentText"),
    enemyAvatar: $("enemyAvatar"),
    enemyName: $("enemyName"),
    enemyHpFill: $("enemyHpFill"),
    enemyHpText: $("enemyHpText"),
    enemyStatusRow: $("enemyStatusRow"),
    battleLog: $("battleLog"),
    playerHpFill: $("playerHpFill"),
    playerHpText: $("playerHpText"),
    shieldDisplay: $("shieldDisplay"),
    shieldText: $("shieldText"),
    playerStatusRow: $("playerStatusRow"),
    draftCards: $("draftCards"),
    resultTitle: $("resultTitle"),
    resultScore: $("resultScore"),
    resultText: $("resultText"),
    skillReportText: $("skillReportText"),
    logicStars: $("logicStars"),
    focusStars: $("focusStars"),
    problemStars: $("problemStars"),
    loadingPanel: $("loadingPanel"),
    loadingText: $("loadingText"),
    loadingFill: $("loadingFill"),
    diamondBalance: $("diamondBalance"),
    amuletBtn: $("amuletBtn"),
    amuletStatus: $("amuletStatus"),
    profileLevelText: $("profileLevelText"),
    profileXpText: $("profileXpText"),
    profileBestText: $("profileBestText"),
    profileBonusText: $("profileBonusText"),
    stageGrid: $("stageGrid"),
  };

  const asset = (name) => `../../assets/${name}`;

  const metaText = {
    en: {
      description: "Play Beast Deck: The Mist Forest, a turn-based Roguelike deckbuilder game on WeightPlay. Build an animal power deck, level up locally, and unlock forest missions.",
      ogDescription: "Build your animal power deck, choose upgrades, level up, and defeat corrupted beasts in a mysterious mist forest.",
    },
    "zh-Hant": {
      description: "遊玩《獸王牌組：迷霧森林》，在 WeightPlay 體驗 13+ 動物卡牌 Roguelike。組出動物能力牌組、累積本機等級，並解鎖更深的森林任務。",
      ogDescription: "組出動物能力牌組，選擇升級、累積本機等級，並在迷霧森林中擊敗腐化野獸。",
    },
  };

  const text = {
    en: {
      title: "Beast Deck: The Mist Forest",
      language: "Language",
      menuTitle: "Enter the Mist Forest.",
      menuHint: "Build an animal power deck, read enemy intent, and clear forest missions. Your level and unlocked missions are saved on this device.",
      progressTitle: "Local Progress",
      progressText: "Clear missions to earn XP, level up, and unlock deeper forest routes. Progress is saved on this device.",
      profileLevel: "Level",
      profileXp: "XP",
      profileBest: "Best",
      profileBonus: "+{hp} Max HP from level",
      stageSelectTitle: "Choose a Mission",
      stageSelectHint: "Tap an unlocked mission to start.",
      lockedMission: "Locked",
      missionLabel: "Mission {mission}",
      missionReward: "{xp} XP",
      startMissionCard: "Start",
      controlCombat: "Turn-Based Strategy",
      controlUpgrades: "Draft Cards",
      controlDeck: "Persistent Level",
      diamondShopTitle: "Permanent Upgrade",
      amuletName: "Mist Amulet",
      amuletEffect: "Start every run with +10 Max HP.",
      amuletOwned: "Owned: every run starts with +10 Max HP.",
      amuletNeed: "Need {cost} diamonds.",
      startRun: "Start Selected Mission",
      menu: "Menu",
      hudStage: "Battle",
      hudMission: "Mission",
      hudHp: "Player HP",
      hudEnergy: "Energy",
      hudDeck: "Deck",
      hudDiscard: "Discard",
      shieldLabel: "Block",
      chooseCard: "Draft a Card",
      chooseCardDesc: "Choose one animal power to keep in this mission deck.",
      tryAgain: "Try Again",
      backToMenu: "Back to Menu",
      skillLogic: "Logic",
      skillFocus: "Focus",
      skillProblem: "Problem Solving",
      endTurn: "End Turn",
      runComplete: "Mission Complete!",
      runFailed: "Mission Failed",
      resultScoreLabel: "Mission Progress",
      resultDisclaimer: "For fun and local progress tracking only.",
      skillReportTitle: "Skill Report",
      loading: "Loading",
      card_wolf_pack: "Wolf Pack",
      card_wolf_pack_desc: "Deal 6 damage. If another attack was played this turn, deal 12 instead.",
      card_guard_bear: "Guard Bear",
      card_guard_bear_desc: "Gain 6 Block.",
      card_sky_hawk: "Sky Hawk",
      card_sky_hawk_desc: "Deal 14 damage and draw 1 card.",
      card_cheetah_sprint: "Cheetah Sprint",
      card_cheetah_sprint_desc: "Draw 2 cards and gain 1 Energy.",
      card_viper_venom: "Viper Venom",
      card_viper_venom_desc: "Apply 3 Poison to the enemy.",
      card_owl_wisdom: "Owl Wisdom",
      card_owl_wisdom_desc: "Draw 1 card.",
      card_iron_tortoise: "Iron Tortoise",
      card_iron_tortoise_desc: "Gain 15 Block.",
      intent_attack: "Attacking for {amount}",
      intent_defend: "Defending for {amount}",
      intent_poison: "Applying {amount} Poison",
      intent_buff: "Preparing a heavy strike",
      log_start: "Battle started against {enemy}.",
      log_play_card: "Played {card}. Cost: {cost}.",
      log_combo: "Combo! {card} deals {damage} damage.",
      log_poison_damage: "{enemy} takes {damage} Poison damage.",
      log_enemy_turn: "Enemy turn: {action}.",
      log_enemy_blocked: "{enemy}'s Block absorbed {blocked} damage.",
      log_enemy_damage_after_block: "{enemy}'s Block absorbed {blocked}. {damage} damage went through.",
      log_player_turn: "Your turn. Drew {count} cards. Energy restored to {energy}.",
      log_draft_added: "{card} joined your deck and will appear in your next opening hand.",
      log_win_battle: "Defeated {enemy}. Draft a new card.",
      log_win_boss: "Mission boss defeated. Gained {xp} XP.",
      log_loss: "You were defeated by {enemy}.",
      log_reshuffle: "Draw pile empty: discard pile reshuffled.",
      shieldAbsorbed: "Block absorbed all damage. {shield} Block left.",
      playerDamage: "Player took {damage} damage. {hp} HP remaining.",
      playerPoison: "Player took {damage} Poison damage. {hp} HP remaining.",
      levelUp: "Level up! Reached Level {level}.",
      report_win: "Mission {mission} cleared. You gained {xp} XP and unlocked deeper forest progress.",
      report_partial: "You cleared {count} battle(s) in Mission {mission}. Earned {xp} XP. Try again with a stronger deck plan.",
      report_no_wins: "No battles cleared yet. Read enemy intent, block large attacks, and build card combos."
    },
    "zh-Hant": {
      title: "獸王牌組：迷霧森林",
      language: "語言",
      menuTitle: "進入迷霧森林。",
      menuHint: "組出動物能力牌組，觀察敵人的意圖，逐步突破森林任務。等級與已解鎖關卡會儲存在本機。",
      progressTitle: "本機進度",
      progressText: "通關任務可獲得經驗、提升等級並解鎖更深的森林路線。進度會儲存在這台裝置。",
      profileLevel: "等級",
      profileXp: "經驗",
      profileBest: "最高",
      profileBonus: "等級加成：生命上限 +{hp}",
      stageSelectTitle: "選擇任務",
      stageSelectHint: "已解鎖任務會保留，可重複挑戰練等。",
      lockedMission: "未解鎖",
      missionLabel: "任務 {mission}",
      missionReward: "{xp} 經驗",
      controlCombat: "回合策略",
      controlUpgrades: "戰後選牌",
      controlDeck: "本機等級",
      diamondShopTitle: "永久升級",
      amuletName: "迷霧護符",
      amuletEffect: "每次挑戰生命上限 +10。",
      amuletOwned: "已擁有：每次挑戰生命上限 +10。",
      amuletNeed: "需要 {cost} 顆鑽石。",
      startRun: "開始任務",
      menu: "選單",
      hudStage: "戰鬥",
      hudMission: "任務",
      hudHp: "生命",
      hudEnergy: "能量",
      hudDeck: "牌庫",
      hudDiscard: "棄牌",
      shieldLabel: "格擋",
      chooseCard: "選擇卡牌",
      chooseCardDesc: "選一張動物能力卡，加入本次任務牌組。",
      tryAgain: "再試一次",
      backToMenu: "回到選單",
      skillLogic: "邏輯",
      skillFocus: "專注",
      skillProblem: "解題",
      endTurn: "結束回合",
      runComplete: "任務完成！",
      runFailed: "任務失敗",
      resultScoreLabel: "任務進度",
      resultDisclaimer: "僅作趣味與本機進度紀錄，不蒐集個人資料。",
      skillReportTitle: "能力報告",
      loading: "載入中",
      card_wolf_pack: "狼群突襲",
      card_wolf_pack_desc: "造成 6 點傷害。本回合若已打出攻擊卡，改為 12 點。",
      card_guard_bear: "守衛熊",
      card_guard_bear_desc: "獲得 6 點格擋。",
      card_sky_hawk: "天鷹俯衝",
      card_sky_hawk_desc: "造成 14 點傷害並抽 1 張牌。",
      card_cheetah_sprint: "獵豹疾跑",
      card_cheetah_sprint_desc: "抽 2 張牌並獲得 1 點能量。",
      card_viper_venom: "毒蛇之牙",
      card_viper_venom_desc: "給敵人 3 層中毒。",
      card_owl_wisdom: "貓頭鷹智慧",
      card_owl_wisdom_desc: "抽 1 張牌。",
      card_iron_tortoise: "鐵甲龜",
      card_iron_tortoise_desc: "獲得 15 點格擋。",
      intent_attack: "即將攻擊 {amount}",
      intent_defend: "即將防守 {amount}",
      intent_poison: "即將施加 {amount} 層中毒",
      intent_buff: "正在準備重擊",
      log_start: "與 {enemy} 的戰鬥開始。",
      log_play_card: "打出 {card}，消耗 {cost}。",
      log_combo: "連擊成功！{card} 造成 {damage} 點傷害。",
      log_poison_damage: "{enemy} 受到 {damage} 點中毒傷害。",
      log_enemy_turn: "敵方回合：{action}。",
      log_player_turn: "你的回合，抽 {count} 張牌，能量恢復為 {energy}。",
      log_win_battle: "擊敗 {enemy}，選擇一張新卡。",
      log_win_boss: "任務首領已擊敗，獲得 {xp} 經驗。",
      log_loss: "你被 {enemy} 擊敗。",
      log_reshuffle: "牌庫已空，重新洗入棄牌堆。",
      shieldAbsorbed: "格擋擋下所有傷害，剩餘 {shield} 點格擋。",
      playerDamage: "玩家受到 {damage} 點傷害，剩餘 {hp} HP。",
      playerPoison: "玩家受到 {damage} 點中毒傷害，剩餘 {hp} HP。",
      levelUp: "升級！目前等級 {level}。",
      report_win: "任務 {mission} 通關，獲得 {xp} 經驗，森林進度已推進。",
      report_partial: "任務 {mission} 已通過 {count} 場戰鬥，獲得 {xp} 經驗。調整牌組節奏再挑戰一次。",
      report_no_wins: "尚未通過戰鬥。先觀察敵人意圖，擋住大攻擊，再組合攻擊卡。"
    }
  };

  const cardDb = {
    "wolf-pack": { cost: 1, type: "attack", image: "wonder-beast-hyena.png", nameKey: "card_wolf_pack", descKey: "card_wolf_pack_desc" },
    "guard-bear": { cost: 1, type: "defense", image: "wonder-beast-bear.png", nameKey: "card_guard_bear", descKey: "card_guard_bear_desc" },
    "sky-hawk": { cost: 2, type: "attack", image: "wonder-beast-hawk.png", nameKey: "card_sky_hawk", descKey: "card_sky_hawk_desc" },
    "cheetah-sprint": { cost: 1, type: "utility", image: "wonder-beast-tiger.png", nameKey: "card_cheetah_sprint", descKey: "card_cheetah_sprint_desc" },
    "viper-venom": { cost: 1, type: "utility", image: "wonder-beast-crocodile.png", nameKey: "card_viper_venom", descKey: "card_viper_venom_desc" },
    "owl-wisdom": { cost: 0, type: "utility", image: "animal-guard-owl.png", nameKey: "card_owl_wisdom", descKey: "card_owl_wisdom_desc" },
    "iron-tortoise": { cost: 2, type: "defense", image: "wonder-beast-rhino.png", nameKey: "card_iron_tortoise", descKey: "card_iron_tortoise_desc" },
  };

  const enemyCatalog = {
    boar: { name: "Shadow Boar", nameZh: "影牙野豬", image: "wonder-beast-boar.png", hp: 24, intents: [{ type: "attack", val: 6 }, { type: "defend", val: 5 }, { type: "attack", val: 9 }] },
    viper: { name: "Corrupted Viper", nameZh: "腐化毒蛇", image: "wonder-beast-crocodile.png", hp: 34, intents: [{ type: "poison", val: 2 }, { type: "defend", val: 8 }, { type: "attack", val: 8 }] },
    behemoth: { name: "Mist Behemoth", nameZh: "迷霧巨獸", image: "wonder-beast-buffalo.png", hp: 58, intents: [{ type: "attack", val: 10 }, { type: "defend", val: 10 }, { type: "attack", val: 15 }, { type: "buff", val: 0 }] },
    rhino: { name: "Ironhide Rhino", nameZh: "鐵皮犀牛", image: "wonder-beast-rhino.png", hp: 42, intents: [{ type: "defend", val: 11 }, { type: "attack", val: 11 }, { type: "attack", val: 8 }] },
    tiger: { name: "Amber Tiger", nameZh: "琥珀猛虎", image: "wonder-beast-tiger.png", hp: 46, intents: [{ type: "attack", val: 12 }, { type: "attack", val: 7 }, { type: "buff", val: 0 }] },
    bear: { name: "Ancient Bear", nameZh: "古木巨熊", image: "wonder-beast-bear.png", hp: 52, intents: [{ type: "defend", val: 12 }, { type: "attack", val: 13 }, { type: "poison", val: 2 }] },
  };

  const missionTemplates = [
    { title: "Misty Trail", titleZh: "迷霧小徑", subtitle: "Learn intent reading.", subtitleZh: "熟悉敵人意圖。", enemies: ["boar", "viper", "behemoth"], xp: 70 },
    { title: "Thorn Ruins", titleZh: "荊棘遺跡", subtitle: "Defense matters more.", subtitleZh: "更重視防守節奏。", enemies: ["boar", "rhino", "behemoth"], xp: 85 },
    { title: "Amber Den", titleZh: "琥珀獸穴", subtitle: "Fast enemies punish greed.", subtitleZh: "高速敵人會懲罰貪攻。", enemies: ["viper", "tiger", "rhino"], xp: 105 },
    { title: "Old Grove", titleZh: "古林深處", subtitle: "Poison and shield mix.", subtitleZh: "中毒與護盾交錯。", enemies: ["bear", "viper", "behemoth"], xp: 125 },
    { title: "Moon Gate", titleZh: "月影門", subtitle: "Higher HP and sharper turns.", subtitleZh: "更高生命與更緊湊回合。", enemies: ["tiger", "rhino", "bear"], xp: 145 },
    { title: "Beast Crown", titleZh: "獸王冠冕", subtitle: "A serious forest trial.", subtitleZh: "真正的森林試煉。", enemies: ["rhino", "bear", "behemoth"], xp: 170 },
    { title: "Crystal Maw", titleZh: "水晶巨口", subtitle: "Late-game scaling starts.", subtitleZh: "後期強度開始提升。", enemies: ["viper", "tiger", "bear"], xp: 195 },
    { title: "Night Monarch", titleZh: "夜森君王", subtitle: "Endless practice route.", subtitleZh: "高難度練功路線。", enemies: ["tiger", "bear", "behemoth"], xp: 225 },
  ];

  let profile = normalizeProfile();
  let state = {};

  function clamp(num, min, max) {
    return Math.max(min, Math.min(max, num));
  }

  function xpToNext(level) {
    return 90 + (level - 1) * 35;
  }

  function levelHpBonus() {
    return Math.max(0, (profile.level - 1) * 2);
  }

  function normalizeProfile(data = {}) {
    return {
      amuletUnlocked: !!data.amuletUnlocked,
      level: clamp(Number(data.level) || 1, 1, 99),
      xp: Math.max(0, Number(data.xp) || 0),
      unlockedMission: clamp(Number(data.unlockedMission) || 1, 1, maxMission),
      bestMission: clamp(Number(data.bestMission) || 1, 1, maxMission),
      selectedMission: clamp(Number(data.selectedMission) || 1, 1, maxMission),
    };
  }

  function loadLocalState() {
    try {
      profile = normalizeProfile(JSON.parse(localStorage.getItem(saveKey) || "{}"));
    } catch {
      profile = normalizeProfile();
    }
    if (profile.selectedMission > profile.unlockedMission) profile.selectedMission = profile.unlockedMission;
  }

  function saveLocalState() {
    try {
      localStorage.setItem(saveKey, JSON.stringify(profile));
    } catch {}
  }

  function getLocale() {
    return localStorage.getItem(localeKey) === "zh-Hant" ? "zh-Hant" : "en";
  }

  function t(key, params = {}) {
    const locale = getLocale();
    const raw = text[locale]?.[key] || text.en[key] || key;
    return Object.entries(params).reduce((str, [k, v]) => str.replaceAll(`{${k}}`, String(v)), raw);
  }

  function getMission(id = profile.selectedMission) {
    return missionTemplates[clamp(id, 1, maxMission) - 1];
  }

  function missionTitle(id) {
    const mission = getMission(id);
    return getLocale() === "zh-Hant" ? mission.titleZh : mission.title;
  }

  function missionSubtitle(id) {
    const mission = getMission(id);
    return getLocale() === "zh-Hant" ? mission.subtitleZh : mission.subtitle;
  }

  function scaledEnemy(enemyKey, missionId) {
    const base = enemyCatalog[enemyKey];
    const scale = 1 + (missionId - 1) * 0.18;
    return {
      ...base,
      maxHp: Math.round(base.hp * scale),
      intents: base.intents.map((intent) => ({
        ...intent,
        val: intent.type === "buff" ? 0 : Math.max(1, Math.round(intent.val * scale)),
      })),
    };
  }

  function currentEnemy() {
    return scaledEnemy(getMission(state.mission).enemies[state.battle - 1], state.mission);
  }

  function enemyName(enemy) {
    return getLocale() === "zh-Hant" ? enemy.nameZh : enemy.name;
  }

  function translateUI() {
    const locale = getLocale();
    document.documentElement.lang = locale;
    document.title = `${t("title")} - WeightPlay`;
    document.querySelector("meta[name='description']")?.setAttribute("content", metaText[locale]?.description || metaText.en.description);
    document.querySelector("meta[property='og:description']")?.setAttribute("content", metaText[locale]?.ogDescription || metaText.en.ogDescription);
    document.querySelectorAll("[data-ui]").forEach((el) => {
      el.textContent = t(el.dataset.ui);
    });
    nodes.localeSelect.value = getLocale();
    updateDiamondShopUI();
    renderProgressUI();
    if (!nodes.gamePanel.classList.contains("hidden") && state.enemy) {
      nodes.enemyName.textContent = enemyName(state.enemy);
      displayIntent(state.enemy.intents[state.enemyIntentIndex]);
    }
  }

  function updateDiamondShopUI() {
    const wallet = window.WeightPlayWallet?.read() || { diamonds: 0 };
    nodes.diamondBalance.textContent = wallet.diamonds;
    nodes.amuletBtn.querySelector("strong").textContent = t("amuletName");
    nodes.amuletBtn.querySelector("small").textContent = profile.amuletUnlocked ? t("amuletOwned") : t("amuletEffect");
    if (profile.amuletUnlocked) {
      nodes.amuletStatus.textContent = t("amuletOwned");
      nodes.amuletBtn.disabled = true;
      nodes.amuletBtn.querySelector("b").style.display = "none";
    } else {
      nodes.amuletStatus.textContent = wallet.diamonds < amuletCost ? t("amuletNeed", { cost: amuletCost }) : "";
      nodes.amuletBtn.disabled = wallet.diamonds < amuletCost;
      nodes.amuletBtn.querySelector("b").style.display = "flex";
      nodes.amuletBtn.querySelector("b span").textContent = amuletCost;
    }
  }

  function renderProgressUI() {
    if (!nodes.stageGrid) return;
    nodes.profileLevelText.textContent = String(profile.level);
    nodes.profileXpText.textContent = `${profile.xp}/${xpToNext(profile.level)}`;
    nodes.profileBestText.textContent = String(profile.bestMission);
    nodes.profileBonusText.textContent = t("profileBonus", { hp: levelHpBonus() });
    nodes.stageGrid.innerHTML = "";

    for (let i = 1; i <= maxMission; i++) {
      const unlocked = i <= profile.unlockedMission;
      const button = document.createElement("button");
      button.type = "button";
      button.className = `stage-card${profile.selectedMission === i ? " selected" : ""}`;
      button.disabled = !unlocked;
      button.innerHTML = `
        <span>${t("missionLabel", { mission: i })}</span>
        <strong>${unlocked ? missionTitle(i) : t("lockedMission")}</strong>
        <small>${unlocked ? missionSubtitle(i) : ""}</small>
        <em>${unlocked ? `${t("missionReward", { xp: getMission(i).xp })} · ${t("startMissionCard")}` : ""}</em>
      `;
      button.addEventListener("click", () => {
        if (!unlocked) return;
        profile.selectedMission = i;
        saveLocalState();
        renderProgressUI();
        window.WonderSound?.play("click");
        startRun();
      });
      nodes.stageGrid.appendChild(button);
    }
  }

  function addXp(amount) {
    const gained = Math.max(0, Math.round(amount));
    state.xpEarned += gained;
    profile.xp += gained;
    while (profile.xp >= xpToNext(profile.level)) {
      profile.xp -= xpToNext(profile.level);
      profile.level += 1;
      log(t("levelUp", { level: profile.level }), "system");
      window.WonderSound?.play("success");
    }
    saveLocalState();
  }

  function triggerEnemyAnimation(className) {
    nodes.enemyAvatar.classList.add(className);
    setTimeout(() => nodes.enemyAvatar.classList.remove(className), 300);
  }

  function log(message, type = "system") {
    const p = document.createElement("p");
    p.className = `log-${type}`;
    p.textContent = message;
    nodes.battleLog.appendChild(p);
    nodes.battleLog.scrollTop = nodes.battleLog.scrollHeight;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function displayIntent(intent) {
    const view = {
      attack: { icon: "ATK", key: "intent_attack", color: "#fca5a5", bg: "rgba(239, 68, 68, 0.12)", border: "rgba(239, 68, 68, 0.25)" },
      defend: { icon: "DEF", key: "intent_defend", color: "#a7f3d0", bg: "rgba(16, 185, 129, 0.12)", border: "rgba(16, 185, 129, 0.25)" },
      poison: { icon: "POI", key: "intent_poison", color: "#d8b4fe", bg: "rgba(168, 85, 247, 0.12)", border: "rgba(168, 85, 247, 0.25)" },
      buff: { icon: "CHG", key: "intent_buff", color: "#fde047", bg: "rgba(245, 158, 11, 0.12)", border: "rgba(245, 158, 11, 0.25)" },
    }[intent.type];
    nodes.intentIcon.textContent = view.icon;
    nodes.intentText.textContent = intent.type === "buff" ? t(view.key) : t(view.key, { amount: intent.val });
    nodes.enemyIntent.style.color = view.color;
    nodes.enemyIntent.style.background = view.bg;
    nodes.enemyIntent.style.borderColor = view.border;
  }

  function drawCards(count) {
    for (let i = 0; i < count; i++) {
      if (state.drawPile.length === 0) {
        if (state.discardPile.length === 0) break;
        state.drawPile = [...state.discardPile];
        state.discardPile = [];
        shuffle(state.drawPile);
        log(t("log_reshuffle"), "system");
      }
      state.hand.push(state.drawPile.pop());
    }
  }

  function applyEnemyDamage(amount) {
    let damage = amount;
    const blocked = Math.min(state.enemyShield, damage);
    if (state.enemyShield >= damage) {
      state.enemyShield -= damage;
      damage = 0;
      if (blocked > 0) log(t("log_enemy_blocked", { enemy: enemyName(state.enemy), blocked }), "system");
    } else {
      damage -= state.enemyShield;
      state.enemyShield = 0;
      if (blocked > 0) log(t("log_enemy_damage_after_block", { enemy: enemyName(state.enemy), blocked, damage }), "system");
    }
    if (damage > 0) {
      state.enemyHp = Math.max(0, state.enemyHp - damage);
      triggerEnemyAnimation("hurt");
    }
  }

  function playCard(index) {
    if (!state.isPlayerTurn) return;
    const cardId = state.hand[index];
    const card = cardDb[cardId];
    if (!card || state.energy < card.cost) {
      window.WonderSound?.play("wrong");
      return;
    }

    state.energy -= card.cost;
    state.hand.splice(index, 1);
    state.discardPile.push(cardId);
    const cardName = t(card.nameKey);
    log(t("log_play_card", { card: cardName, cost: card.cost }), "player");

    if (cardId === "wolf-pack") {
      const damage = state.attacksPlayedThisTurn > 0 ? 12 : 6;
      if (damage === 12) log(t("log_combo", { card: cardName, damage }), "player-synergy");
      applyEnemyDamage(damage);
      state.attacksPlayedThisTurn++;
      window.WonderSound?.play("shoot");
    } else if (cardId === "guard-bear") {
      state.playerShield += 6;
      window.WonderSound?.play("upgrade");
    } else if (cardId === "sky-hawk") {
      applyEnemyDamage(14);
      state.attacksPlayedThisTurn++;
      drawCards(1);
      window.WonderSound?.play("shoot");
    } else if (cardId === "cheetah-sprint") {
      drawCards(2);
      state.energy += 1;
      window.WonderSound?.play("upgrade");
    } else if (cardId === "viper-venom") {
      state.enemyPoison += 3;
      window.WonderSound?.play("click");
    } else if (cardId === "owl-wisdom") {
      drawCards(1);
      window.WonderSound?.play("click");
    } else if (cardId === "iron-tortoise") {
      state.playerShield += 15;
      window.WonderSound?.play("upgrade");
    }

    renderStats();
    renderHand();
    if (state.enemyHp <= 0) {
      state.isPlayerTurn = false;
      window.WonderSound?.play("enemyDown");
      setTimeout(handleBattleWin, 500);
    }
  }

  function endPlayerTurn() {
    if (!state.isPlayerTurn) return;
    state.isPlayerTurn = false;
    nodes.endTurnBtn.disabled = true;
    state.discardPile.push(...state.hand);
    state.hand = [];
    renderHand();
    setTimeout(executeEnemyTurn, 500);
  }

  function executeEnemyTurn() {
    const intent = state.enemy.intents[state.enemyIntentIndex];
    triggerEnemyAnimation("attack");
    let actionText = "";
    if (intent.type === "attack") {
      let damage = intent.val;
      actionText = t("intent_attack", { amount: damage });
      if (state.playerShield >= damage) {
        state.playerShield -= damage;
        log(t("shieldAbsorbed", { shield: state.playerShield }), "system");
        window.WonderSound?.play("wallHit");
      } else {
        damage -= state.playerShield;
        state.playerShield = 0;
        state.playerHp = Math.max(0, state.playerHp - damage);
        log(t("playerDamage", { damage, hp: state.playerHp }), "enemy");
        window.WonderSound?.play("hit");
      }
    } else if (intent.type === "defend") {
      state.enemyShield += intent.val;
      actionText = t("intent_defend", { amount: intent.val });
      window.WonderSound?.play("upgrade");
    } else if (intent.type === "poison") {
      state.playerPoison += intent.val;
      actionText = t("intent_poison", { amount: intent.val });
      window.WonderSound?.play("click");
    } else if (intent.type === "buff") {
      actionText = t("intent_buff");
      const nextAttack = state.enemy.intents.find((item) => item.type === "attack");
      if (nextAttack) nextAttack.val += 2;
      window.WonderSound?.play("boss");
    }
    log(t("log_enemy_turn", { action: actionText }), "enemy");
    renderStats();

    if (state.playerHp <= 0) {
      setTimeout(() => endGame(false), 500);
      return;
    }

    if (state.enemyPoison > 0) {
      const poisonDamage = state.enemyPoison;
      state.enemyHp = Math.max(0, state.enemyHp - poisonDamage);
      state.enemyPoison--;
      triggerEnemyAnimation("hurt");
      log(t("log_poison_damage", { enemy: enemyName(state.enemy), damage: poisonDamage }), "system");
      renderStats();
      if (state.enemyHp <= 0) {
        setTimeout(handleBattleWin, 500);
        return;
      }
    }

    if (state.playerPoison > 0) {
      const poisonDamage = state.playerPoison;
      state.playerHp = Math.max(0, state.playerHp - poisonDamage);
      state.playerPoison--;
      log(t("playerPoison", { damage: poisonDamage, hp: state.playerHp }), "enemy");
      renderStats();
      if (state.playerHp <= 0) {
        setTimeout(() => endGame(false), 500);
        return;
      }
    }

    state.enemyIntentIndex = (state.enemyIntentIndex + 1) % state.enemy.intents.length;
    setTimeout(startPlayerTurn, 650);
  }

  function startPlayerTurn() {
    state.isPlayerTurn = true;
    nodes.endTurnBtn.disabled = false;
    state.energy = 3;
    state.playerShield = 0;
    state.enemyShield = 0;
    state.attacksPlayedThisTurn = 0;
    drawCards(3);
    log(t("log_player_turn", { count: 3, energy: 3 }), "player");
    displayIntent(state.enemy.intents[state.enemyIntentIndex]);
    renderStats();
    renderHand();
  }

  function handleBattleWin() {
    const isBoss = state.battle >= 3;
    if (isBoss) {
      const mission = getMission(state.mission);
      addXp(mission.xp);
      if (state.mission >= profile.unlockedMission && profile.unlockedMission < maxMission) {
        profile.unlockedMission = state.mission + 1;
      }
      profile.bestMission = Math.max(profile.bestMission, state.mission);
      profile.selectedMission = Math.min(profile.unlockedMission, state.mission + 1);
      saveLocalState();
      log(t("log_win_boss", { xp: mission.xp }), "system");
      window.WonderSound?.play("win");
      setTimeout(() => endGame(true), 900);
    } else {
      addXp(18 + state.mission * 2);
      log(t("log_win_battle", { enemy: enemyName(state.enemy) }), "system");
      window.WonderSound?.play("coin");
      setTimeout(showDraftScreen, 650);
    }
  }

  function showDraftScreen() {
    nodes.draftCards.innerHTML = "";
    const draftPool = ["sky-hawk", "cheetah-sprint", "viper-venom", "owl-wisdom", "iron-tortoise"];
    shuffle(draftPool);
    draftPool.slice(0, 3).forEach((cardId) => {
      const card = cardDb[cardId];
      const cardEl = document.createElement("button");
      cardEl.className = `card ${card.type}`;
      cardEl.type = "button";
      cardEl.innerHTML = cardMarkup(card);
      cardEl.addEventListener("click", () => {
        state.deck.push(cardId);
        state.guaranteedOpeningCard = cardId;
        state.lastDraftCard = cardId;
        state.playerHp = Math.min(state.playerMaxHp, state.playerHp + 10);
        state.battle += 1;
        nodes.draftPanel.classList.add("hidden");
        startNextBattle();
      });
      nodes.draftCards.appendChild(cardEl);
    });
    nodes.draftPanel.classList.remove("hidden");
  }

  function cardMarkup(card) {
    return `
      <div class="card-header">
        <span class="card-cost">${card.cost}</span>
      </div>
      <div class="card-icon"><img src="${asset(card.image)}" alt=""></div>
      <strong class="card-name">${t(card.nameKey)}</strong>
      <p class="card-desc">${t(card.descKey)}</p>
    `;
  }

  function startNextBattle() {
    state.enemy = currentEnemy();
    state.enemyHp = state.enemy.maxHp;
    state.enemyMaxHp = state.enemy.maxHp;
    state.playerShield = 0;
    state.enemyShield = 0;
    state.enemyPoison = 0;
    state.playerPoison = 0;
    state.enemyIntentIndex = 0;
    state.attacksPlayedThisTurn = 0;
    state.drawPile = [...state.deck];
    state.discardPile = [];
    state.hand = [];
    shuffle(state.drawPile);
    if (state.guaranteedOpeningCard) {
      const guaranteedIndex = state.drawPile.indexOf(state.guaranteedOpeningCard);
      if (guaranteedIndex >= 0) {
        state.drawPile.splice(guaranteedIndex, 1);
        state.drawPile.push(state.guaranteedOpeningCard);
      }
      state.guaranteedOpeningCard = null;
    }
    nodes.stageText.textContent = `${state.battle}/3`;
    nodes.missionText.textContent = String(state.mission);
    nodes.enemyName.textContent = enemyName(state.enemy);
    nodes.enemyAvatar.innerHTML = `<img src="${asset(state.enemy.image)}" alt="">`;
    nodes.battleLog.innerHTML = "";
    log(t("log_start", { enemy: enemyName(state.enemy) }), "system");
    if (state.lastDraftCard) {
      log(t("log_draft_added", { card: t(cardDb[state.lastDraftCard].nameKey) }), "player");
      state.lastDraftCard = null;
    }
    startPlayerTurn();
  }

  function renderStats() {
    nodes.playerHpText.textContent = `${state.playerHp}/${state.playerMaxHp}`;
    nodes.hpText.textContent = `${state.playerHp}/${state.playerMaxHp}`;
    nodes.playerHpFill.style.width = `${Math.max(0, (state.playerHp / state.playerMaxHp) * 100)}%`;
    nodes.shieldDisplay.style.display = state.playerShield > 0 ? "flex" : "none";
    nodes.shieldText.textContent = state.playerShield;
    nodes.energyText.textContent = `${state.energy}/3`;
    nodes.enemyHpText.textContent = `${state.enemyHp}/${state.enemyMaxHp}`;
    nodes.enemyHpFill.style.width = `${Math.max(0, (state.enemyHp / state.enemyMaxHp) * 100)}%`;
    nodes.deckText.textContent = state.drawPile.length;
    nodes.discardText.textContent = state.discardPile.length;
    nodes.playerStatusRow.innerHTML = state.playerPoison > 0 ? `<span class="status-badge poison">POI ${state.playerPoison}</span>` : "";
    nodes.enemyStatusRow.innerHTML = "";
    if (state.enemyPoison > 0) nodes.enemyStatusRow.innerHTML += `<span class="status-badge poison">POI ${state.enemyPoison}</span>`;
    if (state.enemyShield > 0) nodes.enemyStatusRow.innerHTML += `<span class="status-badge defend">DEF ${state.enemyShield}</span>`;
  }

  function renderHand() {
    nodes.handRow.innerHTML = "";
    state.hand.forEach((cardId, index) => {
      const card = cardDb[cardId];
      const cardEl = document.createElement("button");
      cardEl.className = `card ${card.type}`;
      cardEl.type = "button";
      cardEl.innerHTML = cardMarkup(card);
      if (state.energy < card.cost || !state.isPlayerTurn) cardEl.classList.add("disabled");
      cardEl.addEventListener("click", () => playCard(index));
      nodes.handRow.appendChild(cardEl);
    });
  }

  function endGame(won) {
    nodes.gamePanel.classList.add("hidden");
    nodes.resultPanel.classList.remove("hidden");
    const cleared = won ? 3 : Math.max(0, state.battle - 1);
    const stars = cleared === 3 ? "★★★★★" : cleared === 2 ? "★★★" : cleared === 1 ? "★" : "-";
    nodes.resultTitle.textContent = won ? t("runComplete") : t("runFailed");
    nodes.resultScore.textContent = won ? `${state.mission}/8` : `${cleared}/3`;
    nodes.logicStars.textContent = stars;
    nodes.focusStars.textContent = stars;
    nodes.problemStars.textContent = stars;
    if (won) {
      nodes.resultText.textContent = t("report_win", { mission: state.mission, xp: state.xpEarned });
      nodes.skillReportText.textContent = t("report_win", { mission: state.mission, xp: state.xpEarned });
    } else if (cleared > 0) {
      nodes.resultText.textContent = t("report_partial", { mission: state.mission, count: cleared, xp: state.xpEarned });
      nodes.skillReportText.textContent = t("report_partial", { mission: state.mission, count: cleared, xp: state.xpEarned });
      window.WonderSound?.play("wrong");
    } else {
      nodes.resultText.textContent = t("report_no_wins");
      nodes.skillReportText.textContent = t("report_no_wins");
      window.WonderSound?.play("wrong");
    }
    renderProgressUI();
    updateDiamondShopUI();
  }

  function resetRunState() {
    state = {
      playerMaxHp: 30 + levelHpBonus() + (profile.amuletUnlocked ? 10 : 0),
      playerHp: 30 + levelHpBonus() + (profile.amuletUnlocked ? 10 : 0),
      playerShield: 0,
      playerPoison: 0,
      mission: clamp(profile.selectedMission, 1, profile.unlockedMission),
      battle: 1,
      deck: [
        "wolf-pack", "wolf-pack", "wolf-pack", "wolf-pack",
        "guard-bear", "guard-bear", "guard-bear", "guard-bear",
        "sky-hawk", "cheetah-sprint"
      ],
      drawPile: [],
      discardPile: [],
      hand: [],
      energy: 3,
      enemy: null,
      enemyHp: 0,
      enemyMaxHp: 0,
      enemyPoison: 0,
      enemyShield: 0,
      enemyIntentIndex: 0,
      attacksPlayedThisTurn: 0,
      isPlayerTurn: true,
      xpEarned: 0,
      guaranteedOpeningCard: null,
      lastDraftCard: null,
    };
  }

  function startRun() {
    loadLocalState();
    resetRunState();
    nodes.menuPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.gamePanel.classList.remove("hidden");
    startNextBattle();
    window.WonderSound?.play("start");
    nodes.gamePanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function init() {
    loadLocalState();
    translateUI();
    renderProgressUI();
    updateDiamondShopUI();

    nodes.startBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      startRun();
    });
    nodes.endTurnBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      endPlayerTurn();
    });
    nodes.menuBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      nodes.gamePanel.classList.add("hidden");
      nodes.menuPanel.classList.remove("hidden");
      renderProgressUI();
      updateDiamondShopUI();
    });
    nodes.retryBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      startRun();
    });
    nodes.resultMenuBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      nodes.resultPanel.classList.add("hidden");
      nodes.menuPanel.classList.remove("hidden");
      renderProgressUI();
      updateDiamondShopUI();
    });
    nodes.localeSelect.addEventListener("change", (event) => {
      window.WonderSound?.play("click");
      window.WonderI18n?.setLocale?.(event.target.value);
    });
    nodes.amuletBtn.addEventListener("click", () => {
      const wallet = window.WeightPlayWallet?.read() || { diamonds: 0 };
      if (wallet.diamonds < amuletCost) return;
      const spent = window.WeightPlayWallet?.spendDiamonds(amuletCost);
      if (!spent) return;
      profile.amuletUnlocked = true;
      saveLocalState();
      updateDiamondShopUI();
      window.WonderSound?.play("success");
    });
    window.addEventListener("wonder:locale-change", translateUI);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 25) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        nodes.loadingPanel.style.display = "none";
      }
      nodes.loadingText.textContent = `${progress}%`;
      nodes.loadingFill.style.width = `${progress}%`;
    }, 60);
  }

  window.addEventListener("DOMContentLoaded", init);
})();
