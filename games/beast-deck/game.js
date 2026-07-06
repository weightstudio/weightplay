(() => {
  const GAME_ID = "beast-deck";
  const saveKey = "weightplay_beast_deck_v1";
  const localeKey = "weightPlayLocale";

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
    amuletCost: $("amuletCost"),
    amuletStatus: $("amuletStatus"),
  };

  const amuletCost = 15;

  const text = {
    en: {
      title: "Beast Deck: The Mist Forest",
      language: "Language",
      menuTitle: "Enter the Mist Forest.",
      menuHint: "Goal: Build a deck of animal cards and survive 3 stages of corrupted beast battles. Use defense cards to block intents, and attacks to defeat the beasts.",
      prototypeGoalsTitle: "Prototype test goals",
      prototypeGoalsText: "Clear all 3 battles, test card play mechanics, and verify the Diamond Shop permanent upgrade works properly.",
      diamondShopTitle: "Permanent Upgrade",
      amuletName: "Mist Amulet",
      amuletEffect: "Start every run with +10 Max HP (40 HP instead of 30 HP).",
      amuletOwned: "Owned: every run starts with 40 Max HP.",
      amuletBuy: "Unlock for {cost}",
      amuletNeed: "Need {cost} diamonds.",
      amuletBought: "Mist Amulet unlocked.",
      startRun: "Start Run",
      menu: "Menu",
      hudStage: "Battle",
      hudHp: "Player HP",
      hudEnergy: "Energy",
      hudDeck: "Deck",
      hudDiscard: "Discard",
      chooseCard: "Draft a Card",
      chooseCardDesc: "Select one of these animal power cards to add to your deck for the rest of the run.",
      tryAgain: "Try Again",
      backToMenu: "Back to Menu",
      skillLogic: "Logic",
      skillFocus: "Focus",
      skillProblem: "Problem Solving",
      endTurn: "End Turn",
      runComplete: "Run Complete!",
      runFailed: "Run Ended",
      resultDisclaimer: "For fun and local progress tracking only.",
      skillReportTitle: "Skill Report",
      
      // Cards
      card_wolf_pack: "Wolf Pack",
      card_wolf_pack_desc: "Deal 6 damage. Synergy: Deal 12 damage instead if an attack card was played this turn.",
      card_guard_bear: "Guard Bear",
      card_guard_bear_desc: "Gain 6 Block.",
      card_sky_hawk: "Sky Hawk",
      card_sky_hawk_desc: "Deal 14 damage and draw 1 card.",
      card_cheetah_sprint: "Cheetah Sprint",
      card_cheetah_sprint_desc: "Draw 2 cards, gain 1 Energy.",
      card_viper_venom: "Viper Venom",
      card_viper_venom_desc: "Apply 3 Poison to enemy.",
      card_owl_wisdom: "Owl Wisdom",
      card_owl_wisdom_desc: "Draw 1 card.",
      card_iron_tortoise: "Iron Tortoise",
      card_iron_tortoise_desc: "Gain 15 Block.",

      // Intents
      intent_attack: "Attacking for {amount}",
      intent_defend: "Defending for {amount}",
      intent_poison: "Applying {amount} Poison",
      intent_buff: "Preparing heavy strike!",

      // Logs
      log_start: "Battle started against {enemy}!",
      log_play_card: "Played {card} (Cost: {cost})",
      log_block_synergy: "Synergy active! {card} deals double damage ({damage} damage)!",
      log_poison_damage: "{enemy} takes {damage} Poison damage.",
      log_enemy_turn: "Enemy Turn: {action}",
      log_player_turn: "Your Turn! Drawn {count} cards. Resets Energy to {energy}.",
      log_win_battle: "Defeated {enemy}! Gained 1 Diamond.",
      log_win_boss: "Defeated the Mist Behemoth! Gained 5 Diamonds!",
      log_loss: "You were defeated by {enemy}.",

      // Evaluations
      report_win: "Excellent victory! You cleared all 3 battles, building a deck with strategic synergies.",
      report_partial: "Good try! You cleared {count} battle(s). Practice logic and resource calculations to go further.",
      report_no_wins: "Keep practicing! Analyze enemy intents and balance your attack and defense play."
    },
    "zh-Hant": {
      title: "獸王牌組：迷霧森林",
      language: "語言",
      menuTitle: "進入迷霧森林。",
      menuHint: "目標：構築動物卡組，在 3 場腐化野獸戰鬥中生存。使用防守卡阻擋敵方攻擊意圖，使用攻擊卡擊敗牠們。",
      prototypeGoalsTitle: "原型測試目標",
      prototypeGoalsText: "完成全部 3 場戰鬥，測試卡牌出牌機制，並驗證鑽石商店永久升級可正常運作。",
      diamondShopTitle: "永久升級",
      amuletName: "迷霧護符",
      amuletEffect: "每局開始時 +10 最大生命值 (以 40 HP 開局，原為 30 HP)。",
      amuletOwned: "已擁有：每局均以 40 HP 開局。",
      amuletBuy: "花費 {cost} 鑽石解鎖",
      amuletNeed: "需要 {cost} 顆鑽石。",
      amuletBought: "已成功解鎖迷霧護符。",
      startRun: "開始挑戰",
      menu: "選單",
      hudStage: "戰鬥",
      hudHp: "玩家生命",
      hudEnergy: "能量",
      hudDeck: "牌組",
      hudDiscard: "棄牌",
      chooseCard: "選擇卡牌",
      chooseCardDesc: "選擇一張動物卡牌，加入你此局的牌組中。",
      tryAgain: "再試一次",
      backToMenu: "回到主選單",
      skillLogic: "邏輯力",
      skillFocus: "專注力",
      skillProblem: "問題解決",
      endTurn: "結束回合",
      runComplete: "通關挑戰！",
      runFailed: "挑戰結束",
      resultDisclaimer: "分數僅供趣味與本機進度追蹤。",
      skillReportTitle: "能力分析報告",
      
      // Cards
      card_wolf_pack: "狼群連擊",
      card_wolf_pack_desc: "造成 6 點傷害。連鎖：若本回合已使用其他攻擊卡，則造成 12 點傷害。",
      card_guard_bear: "熊靈防護",
      card_guard_bear_desc: "獲得 6 點護盾。",
      card_sky_hawk: "鷹隼突擊",
      card_sky_hawk_desc: "造成 14 點傷害並抽取 1 張牌。",
      card_cheetah_sprint: "獵豹神速",
      card_cheetah_sprint_desc: "抽取 2 張牌，獲得 1 點能量。",
      card_viper_venom: "毒蛇囓咬",
      card_viper_venom_desc: "對敵人施加 3 點中毒效果。",
      card_owl_wisdom: "貓頭鷹智慧",
      card_owl_wisdom_desc: "抽取 1 張牌。",
      card_iron_tortoise: "鐵甲巨龜",
      card_iron_tortoise_desc: "獲得 15 點護盾。",

      // Intents
      intent_attack: "準備攻擊 {amount} 點傷害",
      intent_defend: "準備獲得 {amount} 點護盾",
      intent_poison: "準備施加 {amount} 點中毒",
      intent_buff: "準備發動強力一擊！",

      // Logs
      log_start: "與 {enemy} 的戰鬥開始了！",
      log_play_card: "使用了 {card} (消耗能量: {cost})",
      log_block_synergy: "卡牌連鎖觸發！{card} 造成雙倍傷害 ({damage} 點)！",
      log_poison_damage: "{enemy} 受到 {damage} 點中毒傷害。",
      log_enemy_turn: "敵方回合：{action}",
      log_player_turn: "你的回合！抽取 {count} 張牌，能量恢復為 {energy} 點。",
      log_win_battle: "擊敗了 {enemy}！獲得 1 顆鑽石。",
      log_win_boss: "擊敗了迷霧巨獸！獲得 5 顆鑽石！",
      log_loss: "你被 {enemy} 擊敗了。",

      // Evaluations
      report_win: "卓越的勝利！你完成了所有 3 場戰鬥，構築了具備強大戰略連鎖的牌組。",
      report_partial: "表現不錯！你擊敗了 {count} 個對手。多練習邏輯計算與出牌順序以挑戰更遠關卡。",
      report_no_wins: "繼續加油！多觀察敵人的出牌意圖，並平衡好攻擊與防守牌的使用。"
    }
  };

  const cardDb = {
    "wolf-pack": { id: "wolf-pack", cost: 1, type: "attack", icon: "🐺", nameKey: "card_wolf_pack", descKey: "card_wolf_pack_desc" },
    "guard-bear": { id: "guard-bear", cost: 1, type: "defense", icon: "🐻", nameKey: "card_guard_bear", descKey: "card_guard_bear_desc" },
    "sky-hawk": { id: "sky-hawk", cost: 2, type: "attack", icon: "🦅", nameKey: "card_sky_hawk", descKey: "card_sky_hawk_desc" },
    "cheetah-sprint": { id: "cheetah-sprint", cost: 1, type: "utility", icon: "🐆", nameKey: "card_cheetah_sprint", descKey: "card_cheetah_sprint_desc" },
    "viper-venom": { id: "viper-venom", cost: 1, type: "utility", icon: "🐍", nameKey: "card_viper_venom", descKey: "card_viper_venom_desc" },
    "owl-wisdom": { id: "owl-wisdom", cost: 0, type: "utility", icon: "🦉", nameKey: "card_owl_wisdom", descKey: "card_owl_wisdom_desc" },
    "iron-tortoise": { id: "iron-tortoise", cost: 2, type: "defense", icon: "🐢", nameKey: "card_iron_tortoise", descKey: "card_iron_tortoise_desc" },
  };

  const enemies = {
    1: { name: "Shadow Boar", nameZh: "暗影野豬", avatar: "🐗", maxHp: 24, intents: [{ type: "attack", val: 6 }, { type: "defend", val: 5 }, { type: "attack", val: 9 }] },
    2: { name: "Corrupted Viper", nameZh: "腐化毒蛇", avatar: "🐍", maxHp: 35, intents: [{ type: "poison", val: 2 }, { type: "defend", val: 8 }, { type: "attack", val: 8 }] },
    3: { name: "Mist Behemoth", nameZh: "迷霧巨獸", avatar: "🐻", maxHp: 60, intents: [{ type: "attack", val: 10 }, { type: "defend", val: 10 }, { type: "attack", val: 15 }, { type: "buff", val: 0 }] },
  };

  // Game state variables
  let state = {
    amuletUnlocked: false,
    playerMaxHp: 30,
    playerHp: 30,
    playerShield: 0,
    playerPoison: 0,
    stage: 1,
    deck: [],
    drawPile: [],
    discardPile: [],
    hand: [],
    energy: 3,
    enemyHp: 0,
    enemyPoison: 0,
    enemyShield: 0,
    enemyIntentIndex: 0,
    attacksPlayedThisTurn: 0,
    isPlayerTurn: true,
  };

  // Safe read from LocalStorage
  function loadLocalState() {
    try {
      const data = JSON.parse(localStorage.getItem(saveKey) || "{}");
      state.amuletUnlocked = !!data.amuletUnlocked;
    } catch {
      state.amuletUnlocked = false;
    }
  }

  function saveLocalState() {
    try {
      localStorage.setItem(saveKey, JSON.stringify({ amuletUnlocked: state.amuletUnlocked }));
    } catch {}
  }

  // Locale setup
  function getLocale() {
    return localStorage.getItem(localeKey) === "zh-Hant" ? "zh-Hant" : "en";
  }

  function t(key, params = {}) {
    const locale = getLocale();
    const raw = text[locale][key] || text.en[key] || key;
    return Object.entries(params).reduce((str, [k, v]) => str.replaceAll(`{${k}}`, String(v)), raw);
  }

  const combatLogText = {
    en: {
      shieldAbsorbed: "Player Shield absorbed all damage. ({shield} left)",
      playerDamage: "Player took {damage} damage! ({hp} HP remaining)",
      playerPoison: "Player took {damage} Poison damage. ({hp} HP remaining)",
    },
    "zh-Hant": {
      shieldAbsorbed: "\u73a9\u5bb6\u8b77\u76fe\u64cb\u4e0b\u4e86\u5168\u90e8\u50b7\u5bb3\u3002(\u5269\u9918 {shield})",
      playerDamage: "\u73a9\u5bb6\u53d7\u5230 {damage} \u9ede\u50b7\u5bb3\uff01(\u5269\u9918 {hp} HP)",
      playerPoison: "\u73a9\u5bb6\u53d7\u5230 {damage} \u9ede\u4e2d\u6bd2\u50b7\u5bb3\u3002(\u5269\u9918 {hp} HP)",
    },
  };

  function combatText(key, params = {}) {
    const locale = getLocale();
    const raw = combatLogText[locale]?.[key] || combatLogText.en[key] || key;
    return Object.entries(params).reduce((str, [k, v]) => str.replaceAll(`{${k}}`, String(v)), raw);
  }

  function translateUI() {
    document.documentElement.lang = getLocale();
    for (const el of document.querySelectorAll("[data-ui]")) {
      const key = el.dataset.ui;
      el.textContent = t(key);
    }
    nodes.localeSelect.value = getLocale();
    updateDiamondShopUI();
  }

  function updateDiamondShopUI() {
    const wallet = window.WeightPlayWallet?.read() || { diamonds: 0 };
    nodes.diamondBalance.textContent = wallet.diamonds;

    if (state.amuletUnlocked) {
      nodes.amuletStatus.textContent = t("amuletOwned");
      nodes.amuletBtn.disabled = true;
      nodes.amuletBtn.querySelector("strong").textContent = t("amuletName");
      nodes.amuletBtn.querySelector("small").textContent = t("amuletOwned");
      nodes.amuletBtn.querySelector("b").style.display = "none";
    } else {
      nodes.amuletStatus.textContent = "";
      nodes.amuletBtn.disabled = wallet.diamonds < amuletCost;
      nodes.amuletBtn.querySelector("strong").textContent = t("amuletName");
      nodes.amuletBtn.querySelector("small").textContent = t("amuletEffect");
      nodes.amuletBtn.querySelector("b").style.display = "flex";
      nodes.amuletBtn.querySelector("b span").textContent = amuletCost;
    }
  }

  // Combat animations helper
  function triggerEnemyAnimation(className) {
    nodes.enemyAvatar.classList.add(className);
    setTimeout(() => {
      nodes.enemyAvatar.classList.remove(className);
    }, 300);
  }

  // Print text to log display
  function log(message, type = "system") {
    const p = document.createElement("p");
    p.className = `log-${type}`;
    p.innerHTML = message;
    nodes.battleLog.appendChild(p);
    nodes.battleLog.scrollTop = nodes.battleLog.scrollHeight;
  }

  // Shuffle array utility
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Turn management
  function endPlayerTurn() {
    if (!state.isPlayerTurn) return;
    state.isPlayerTurn = false;
    nodes.endTurnBtn.disabled = true;

    // Discard remaining hand
    state.discardPile.push(...state.hand);
    state.hand = [];
    renderHand();

    log("------------");
    setTimeout(executeEnemyTurn, 600);
  }

  function executeEnemyTurn() {
    const enemyData = enemies[state.stage];
    const intent = enemyData.intents[state.enemyIntentIndex];

    triggerEnemyAnimation("attack");
    let intentDesc = "";

    // 1. Process Enemy Action
    if (intent.type === "attack") {
      let dmg = intent.val;
      intentDesc = t("intent_attack", { amount: dmg });
      log(t("log_enemy_turn", { action: intentDesc }), "enemy");

      // Deal damage minus shield
      if (state.playerShield >= dmg) {
        state.playerShield -= dmg;
        log(combatText("shieldAbsorbed", { shield: state.playerShield }), "system");
        window.WonderSound?.play("wallHit");
      } else {
        dmg -= state.playerShield;
        state.playerShield = 0;
        state.playerHp = Math.max(0, state.playerHp - dmg);
        log(combatText("playerDamage", { damage: dmg, hp: state.playerHp }), "enemy");
        window.WonderSound?.play("hit");
      }
    } else if (intent.type === "defend") {
      state.enemyShield = intent.val;
      intentDesc = t("intent_defend", { amount: intent.val });
      log(t("log_enemy_turn", { action: intentDesc }), "enemy");
      window.WonderSound?.play("upgrade");
    } else if (intent.type === "poison") {
      state.playerPoison += intent.val;
      intentDesc = t("intent_poison", { amount: intent.val });
      log(t("log_enemy_turn", { action: intentDesc }), "enemy");
      window.WonderSound?.play("click");
    } else if (intent.type === "buff") {
      // Mist Behemoth special buff -> raises its next attack
      intentDesc = t("intent_buff");
      log(t("log_enemy_turn", { action: intentDesc }), "enemy");
      window.WonderSound?.play("boss");
    }

    renderStats();

    // Check Player Defeat
    if (state.playerHp <= 0) {
      setTimeout(() => endGame(false), 600);
      return;
    }

    // 2. Poison ticks on Enemy
    if (state.enemyPoison > 0) {
      const poisonDmg = state.enemyPoison;
      state.enemyHp = Math.max(0, state.enemyHp - poisonDmg);
      triggerEnemyAnimation("hurt");
      log(t("log_poison_damage", { enemy: getEnemyName(enemyData), damage: poisonDmg }), "system");
      state.enemyPoison--;
      renderStats();
      
      if (state.enemyHp <= 0) {
        window.WonderSound?.play("enemyDown");
        setTimeout(handleBattleWin, 600);
        return;
      }
    }

    // 3. Poison ticks on Player
    if (state.playerPoison > 0) {
      const poisonDmg = state.playerPoison;
      state.playerHp = Math.max(0, state.playerHp - poisonDmg);
      log(combatText("playerPoison", { damage: poisonDmg, hp: state.playerHp }), "enemy");
      state.playerPoison--;
      renderStats();

      if (state.playerHp <= 0) {
        setTimeout(() => endGame(false), 600);
        return;
      }
    }

    // Advance Intent Index
    state.enemyIntentIndex = (state.enemyIntentIndex + 1) % enemyData.intents.length;

    // Start Player Turn
    setTimeout(startPlayerTurn, 800);
  }

  function startPlayerTurn() {
    state.isPlayerTurn = true;
    nodes.endTurnBtn.disabled = false;

    state.energy = 3;
    state.playerShield = 0;
    state.enemyShield = 0;
    state.attacksPlayedThisTurn = 0;

    // Draw cards
    drawCards(3);

    const enemyData = enemies[state.stage];
    log(t("log_player_turn", { count: 3, energy: 3 }), "player");
    
    // Choose next intent
    const nextIntent = enemyData.intents[state.enemyIntentIndex];
    displayIntent(nextIntent);

    renderStats();
    renderHand();
  }

  function getEnemyName(enemy) {
    return getLocale() === "zh-Hant" ? enemy.nameZh : enemy.name;
  }

  function displayIntent(intent) {
    if (intent.type === "attack") {
      nodes.intentIcon.textContent = "⚔️";
      nodes.intentText.textContent = t("intent_attack", { amount: intent.val });
      nodes.enemyIntent.style.color = "#fca5a5";
      nodes.enemyIntent.style.background = "rgba(239, 68, 68, 0.12)";
      nodes.enemyIntent.style.borderColor = "rgba(239, 68, 68, 0.25)";
    } else if (intent.type === "defend") {
      nodes.intentIcon.textContent = "🛡️";
      nodes.intentText.textContent = t("intent_defend", { amount: intent.val });
      nodes.enemyIntent.style.color = "#a7f3d0";
      nodes.enemyIntent.style.background = "rgba(16, 185, 129, 0.12)";
      nodes.enemyIntent.style.borderColor = "rgba(16, 185, 129, 0.25)";
    } else if (intent.type === "poison") {
      nodes.intentIcon.textContent = "🧪";
      nodes.intentText.textContent = t("intent_poison", { amount: intent.val });
      nodes.enemyIntent.style.color = "#d8b4fe";
      nodes.enemyIntent.style.background = "rgba(168, 85, 247, 0.12)";
      nodes.enemyIntent.style.borderColor = "rgba(168, 85, 247, 0.25)";
    } else if (intent.type === "buff") {
      nodes.intentIcon.textContent = "⚡";
      nodes.intentText.textContent = t("intent_buff");
      nodes.enemyIntent.style.color = "#fde047";
      nodes.enemyIntent.style.background = "rgba(245, 158, 11, 0.12)";
      nodes.enemyIntent.style.borderColor = "rgba(245, 158, 11, 0.25)";
    }
  }

  function drawCards(count) {
    for (let i = 0; i < count; i++) {
      if (state.drawPile.length === 0) {
        if (state.discardPile.length === 0) break; // no cards to draw
        state.drawPile = [...state.discardPile];
        state.discardPile = [];
        shuffle(state.drawPile);
        log("Draw pile empty: reshuffled discard pile.", "system");
      }
      state.hand.push(state.drawPile.pop());
    }
  }

  function playCard(index) {
    if (!state.isPlayerTurn) return;
    const cardId = state.hand[index];
    const card = cardDb[cardId];

    if (state.energy < card.cost) {
      window.WonderSound?.play("wrong");
      return;
    }

    state.energy -= card.cost;
    state.hand.splice(index, 1);
    state.discardPile.push(cardId);

    const cardName = t(card.nameKey);
    log(t("log_play_card", { card: cardName, cost: card.cost }), "player");

    // Execute Card Action
    if (card.id === "wolf-pack") {
      let dmg = 6;
      if (state.attacksPlayedThisTurn > 0) {
        dmg = 12;
        log(t("log_block_synergy", { card: cardName, damage: dmg }), "player-synergy");
      }
      
      // deal damage, subtract shield first
      if (state.enemyShield >= dmg) {
        state.enemyShield -= dmg;
      } else {
        dmg -= state.enemyShield;
        state.enemyShield = 0;
        state.enemyHp = Math.max(0, state.enemyHp - dmg);
      }
      state.attacksPlayedThisTurn++;
      triggerEnemyAnimation("hurt");
      window.WonderSound?.play("shoot");
    } else if (card.id === "guard-bear") {
      state.playerShield += 6;
      window.WonderSound?.play("upgrade");
    } else if (card.id === "sky-hawk") {
      let dmg = 14;
      if (state.enemyShield >= dmg) {
        state.enemyShield -= dmg;
      } else {
        dmg -= state.enemyShield;
        state.enemyShield = 0;
        state.enemyHp = Math.max(0, state.enemyHp - dmg);
      }
      state.attacksPlayedThisTurn++;
      triggerEnemyAnimation("hurt");
      drawCards(1);
      window.WonderSound?.play("shoot");
    } else if (card.id === "cheetah-sprint") {
      drawCards(2);
      state.energy += 1;
      window.WonderSound?.play("upgrade");
    } else if (card.id === "viper-venom") {
      state.enemyPoison += 3;
      window.WonderSound?.play("click");
    } else if (card.id === "owl-wisdom") {
      drawCards(1);
      window.WonderSound?.play("click");
    } else if (card.id === "iron-tortoise") {
      state.playerShield += 15;
      window.WonderSound?.play("upgrade");
    }

    renderStats();
    renderHand();

    // Check Enemy Defeat
    if (state.enemyHp <= 0) {
      window.WonderSound?.play("enemyDown");
      state.isPlayerTurn = false; // block playing further
      setTimeout(handleBattleWin, 600);
    }
  }

  function handleBattleWin() {
    const enemyData = enemies[state.stage];
    
    if (state.stage === 3) {
      // Defeated Boss!
      log(t("log_win_boss"), "system");
      window.WeightPlayWallet?.addDiamonds(5);
      window.WonderSound?.play("win");
      setTimeout(() => endGame(true), 1000);
    } else {
      // Normal win -> Draft a card
      log(t("log_win_battle", { enemy: getEnemyName(enemyData) }), "system");
      window.WeightPlayWallet?.addDiamonds(1);
      window.WonderSound?.play("coin");
      setTimeout(showDraftScreen, 800);
    }
  }

  // Card Drafting flow
  function showDraftScreen() {
    nodes.draftCards.innerHTML = "";
    
    // Choose 3 random cards from the pool
    const draftPool = ["sky-hawk", "cheetah-sprint", "viper-venom", "owl-wisdom", "iron-tortoise"];
    shuffle(draftPool);
    const choices = draftPool.slice(0, 3);

    choices.forEach((cardId) => {
      const card = cardDb[cardId];
      const cardEl = document.createElement("button");
      cardEl.className = `card ${card.type}`;
      cardEl.type = "button";
      cardEl.innerHTML = `
        <div class="card-header">
          <span class="card-cost">${card.cost}</span>
        </div>
        <div class="card-icon">${card.icon}</div>
        <strong class="card-name">${t(card.nameKey)}</strong>
        <p class="card-desc">${t(card.descKey)}</p>
      `;
      cardEl.addEventListener("click", () => {
        state.deck.push(cardId);
        // Heal 10 HP between stages
        state.playerHp = Math.min(state.playerMaxHp, state.playerHp + 10);
        state.stage++;
        nodes.draftPanel.classList.add("hidden");
        startNextStage();
      });
      nodes.draftCards.appendChild(cardEl);
    });

    nodes.draftPanel.classList.remove("hidden");
  }

  function startNextStage() {
    const enemyData = enemies[state.stage];
    state.enemyHp = enemyData.maxHp;
    state.playerShield = 0;
    state.enemyShield = 0;
    state.enemyPoison = 0;
    state.playerPoison = 0;
    state.enemyIntentIndex = 0;
    state.attacksPlayedThisTurn = 0;

    nodes.stageText.textContent = `${state.stage}/3`;
    nodes.enemyName.textContent = getEnemyName(enemyData);
    nodes.enemyAvatar.textContent = enemyData.avatar;

    // Reset combat piles
    state.drawPile = [...state.deck];
    state.discardPile = [];
    state.hand = [];
    shuffle(state.drawPile);

    nodes.battleLog.innerHTML = "";
    log(t("log_start", { enemy: getEnemyName(enemyData) }), "system");

    startPlayerTurn();
  }

  // Rendering Functions
  function renderStats() {
    // Player
    nodes.playerHpText.textContent = `${state.playerHp}/${state.playerMaxHp}`;
    nodes.hpText.textContent = `${state.playerHp}/${state.playerMaxHp}`;
    nodes.playerHpFill.style.width = `${(state.playerHp / state.playerMaxHp) * 100}%`;
    
    if (state.playerShield > 0) {
      nodes.shieldDisplay.style.display = "flex";
      nodes.shieldText.textContent = state.playerShield;
    } else {
      nodes.shieldDisplay.style.display = "none";
    }

    // Energy
    nodes.energyText.textContent = `${state.energy}/3`;

    // Enemy
    const enemyData = enemies[state.stage];
    nodes.enemyHpText.textContent = `${state.enemyHp}/${enemyData.maxHp}`;
    nodes.enemyHpFill.style.width = `${(state.enemyHp / enemyData.maxHp) * 100}%`;

    // Deck stats
    nodes.deckText.textContent = state.drawPile.length;
    nodes.discardText.textContent = state.discardPile.length;

    // Render player statuses
    nodes.playerStatusRow.innerHTML = "";
    if (state.playerPoison > 0) {
      nodes.playerStatusRow.innerHTML += `<span class="status-badge poison">🧪 ${state.playerPoison}</span>`;
    }

    // Render enemy statuses
    nodes.enemyStatusRow.innerHTML = "";
    if (state.enemyPoison > 0) {
      nodes.enemyStatusRow.innerHTML += `<span class="status-badge poison">🧪 ${state.enemyPoison}</span>`;
    }
    if (state.enemyShield > 0) {
      nodes.enemyStatusRow.innerHTML += `<span class="status-badge defend">🛡️ ${state.enemyShield}</span>`;
    }
  }

  function renderHand() {
    nodes.handRow.innerHTML = "";
    state.hand.forEach((cardId, index) => {
      const card = cardDb[cardId];
      const cardEl = document.createElement("button");
      cardEl.className = `card ${card.type}`;
      cardEl.type = "button";
      cardEl.innerHTML = `
        <div class="card-header">
          <span class="card-cost">${card.cost}</span>
        </div>
        <div class="card-icon">${card.icon}</div>
        <strong class="card-name">${t(card.nameKey)}</strong>
        <p class="card-desc">${t(card.descKey)}</p>
      `;

      if (state.energy < card.cost || !state.isPlayerTurn) {
        cardEl.style.opacity = "0.5";
      }

      cardEl.addEventListener("click", () => {
        playCard(index);
      });
      nodes.handRow.appendChild(cardEl);
    });
  }

  // End Game
  function endGame(won) {
    nodes.gamePanel.classList.add("hidden");
    nodes.resultPanel.classList.remove("hidden");

    nodes.resultTitle.textContent = won ? t("runComplete") : t("runFailed");
    nodes.resultScore.textContent = won ? "3" : String(state.stage - 1);
    
    // Star rankings based on stages cleared
    const stagesCleared = won ? 3 : (state.stage - 1);
    let starsStr = "";
    if (stagesCleared === 3) starsStr = "⭐⭐⭐⭐⭐";
    else if (stagesCleared === 2) starsStr = "⭐⭐⭐";
    else if (stagesCleared === 1) starsStr = "⭐";
    else starsStr = "";

    nodes.logicStars.textContent = starsStr || "☆";
    nodes.focusStars.textContent = starsStr || "☆";
    nodes.problemStars.textContent = starsStr || "☆";

    // Set evaluation texts
    if (won) {
      nodes.resultText.textContent = t("report_win");
      nodes.skillReportText.textContent = t("report_win");
    } else if (stagesCleared > 0) {
      nodes.resultText.textContent = t("report_partial", { count: stagesCleared });
      nodes.skillReportText.textContent = t("report_partial", { count: stagesCleared });
      window.WonderSound?.play("wrong");
    } else {
      nodes.resultText.textContent = t("report_no_wins");
      nodes.skillReportText.textContent = t("report_no_wins");
      window.WonderSound?.play("wrong");
    }
  }

  // Run start logic
  function startRun() {
    loadLocalState();
    state.playerMaxHp = state.amuletUnlocked ? 40 : 30;
    state.playerHp = state.playerMaxHp;
    state.stage = 1;

    // Build starting deck (10 cards)
    state.deck = [
      "wolf-pack", "wolf-pack", "wolf-pack", "wolf-pack",
      "guard-bear", "guard-bear", "guard-bear", "guard-bear",
      "sky-hawk", "cheetah-sprint"
    ];

    nodes.menuPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.gamePanel.classList.remove("hidden");

    startNextStage();
    window.WonderSound?.play("start");
  }

  // Init handlers
  function init() {
    loadLocalState();
    updateDiamondShopUI();
    translateUI();

    // Event listeners
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
      updateDiamondShopUI();
    });

    nodes.localeSelect.addEventListener("change", (e) => {
      window.WonderSound?.play("click");
      window.WonderI18n?.setLocale?.(e.target.value);
    });

    nodes.amuletBtn.addEventListener("click", () => {
      const wallet = window.WeightPlayWallet?.read() || { diamonds: 0 };
      if (wallet.diamonds >= amuletCost) {
        const spent = window.WeightPlayWallet?.spendDiamonds(amuletCost);
        if (spent) {
          state.amuletUnlocked = true;
          saveLocalState();
          window.WonderSound?.play("success");
          updateDiamondShopUI();
        }
      }
    });

    // Handle global translation changes
    window.addEventListener("wonder:locale-change", () => {
      translateUI();
      if (nodes.gamePanel.classList.contains("hidden") === false) {
        // update enemy name on-the-fly if active
        nodes.enemyName.textContent = getEnemyName(enemies[state.stage]);
        displayIntent(enemies[state.stage].intents[state.enemyIntentIndex]);
      }
    });

    // Loading screen fake simulation
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
