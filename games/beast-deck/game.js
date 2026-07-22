(() => {
  document.querySelector(".beast-deck-app")?.setAttribute("data-wp-canvas-max-width", "920");
  document.getElementById("gamePanel")?.setAttribute("data-wp-canvas-max-width", "920");
  const resultDialog = document.getElementById("resultPanel");
  resultDialog?.setAttribute("role", "dialog");
  resultDialog?.setAttribute("aria-modal", "true");
  resultDialog?.setAttribute("aria-labelledby", "resultTitle");
  resultDialog?.setAttribute("aria-describedby", "resultText resultRewards resultUnlock");

  const GAME_ID = "beast-deck";
  const saveKey = "weightplay_beast_deck_v1";
  const localeKey = "weightPlayLocale";
  const storageSession = new Map();
  const readStorage = (key) => {
    try {
      const value = localStorage.getItem(key);
      if (value !== null) storageSession.set(key, value);
      return value ?? storageSession.get(key) ?? null;
    } catch {
      return storageSession.get(key) ?? null;
    }
  };
  const writeStorage = (key, value) => {
    storageSession.set(key, value);
    try { localStorage.setItem(key, value); return true; } catch { return false; }
  };
  const amuletCost = 15;
  const packCost = 80;
  const maxGearRank = 3;
  const maxEquippedCards = 6;
  const maxMission = 30;
  let amuletConfirmPending = false;
  let amuletConfirmTimer = 0;
  let amuletConfirmRemaining = 0;
  let amuletConfirmDueAt = 0;
  let battleTransitionEpoch = 0;
  let backgroundSuspended = document.hidden || !document.hasFocus();
  const battleTransitions = new Set();
  let stageScrollTimer = 0;
  let browsedMission = 0;

  function cancelStageSettlement() {
    if (!stageScrollTimer) return;
    window.clearTimeout(stageScrollTimer);
    stageScrollTimer = 0;
  }

  function armBattleTransition(transition) {
    if (backgroundSuspended || transition.epoch !== battleTransitionEpoch) return;
    transition.dueAt = performance.now() + transition.remaining;
    transition.timer = window.setTimeout(() => {
      transition.timer = 0;
      battleTransitions.delete(transition);
      if (transition.epoch !== battleTransitionEpoch || backgroundSuspended) return;
      transition.callback();
    }, transition.remaining);
  }

  function cancelBattleTransitions() {
    battleTransitionEpoch += 1;
    battleTransitions.forEach((transition) => window.clearTimeout(transition.timer));
    battleTransitions.clear();
  }

  function scheduleBattleTransition(callback, delay) {
    const transition = {
      callback,
      remaining: Math.max(0, Number(delay) || 0),
      dueAt: 0,
      timer: 0,
      epoch: battleTransitionEpoch,
    };
    battleTransitions.add(transition);
    armBattleTransition(transition);
    return transition;
  }

  function armAmuletConfirmation() {
    if (!amuletConfirmPending || backgroundSuspended || amuletConfirmTimer) return;
    amuletConfirmDueAt = performance.now() + amuletConfirmRemaining;
    amuletConfirmTimer = window.setTimeout(() => {
      amuletConfirmTimer = 0;
      if (!amuletConfirmPending || backgroundSuspended) return;
      clearAmuletConfirmation();
      updateDiamondShopUI();
    }, amuletConfirmRemaining);
  }

  function suspendBackgroundBattle() {
    if (backgroundSuspended) return;
    backgroundSuspended = true;
    const now = performance.now();
    if (amuletConfirmTimer) {
      window.clearTimeout(amuletConfirmTimer);
      amuletConfirmTimer = 0;
      amuletConfirmRemaining = Math.max(0, amuletConfirmDueAt - now);
    }
    battleTransitions.forEach((transition) => {
      if (!transition.timer) return;
      window.clearTimeout(transition.timer);
      transition.timer = 0;
      transition.remaining = Math.max(0, transition.dueAt - now);
    });
  }

  function resumeBackgroundBattle() {
    if (!backgroundSuspended || document.hidden || !document.hasFocus() || leaveDecisionOpen) return;
    backgroundSuspended = false;
    armAmuletConfirmation();
    battleTransitions.forEach(armBattleTransition);
  }

  const $ = (id) => document.getElementById(id);
  if (!$("leavePanel")) {
    $("gamePanel")?.insertAdjacentHTML("beforeend", `
      <section id="leavePanel" class="leave-panel hidden" role="dialog" aria-modal="true" aria-labelledby="leaveTitle" aria-describedby="leaveMessage">
        <div class="leave-card">
          <h2 id="leaveTitle">Leave this mission?</h2>
          <p id="leaveMessage"></p>
          <div class="leave-actions">
            <button id="leaveKeepBtn" class="action-btn" type="button">Keep Playing</button>
            <button id="leaveConfirmBtn" class="soft-btn" type="button">Leave Mission</button>
          </div>
        </div>
      </section>`);
  }
  const nodes = {
    localeSelect: $("localeSelect"),
    menuPanel: $("menuPanel"),
    gamePanel: $("gamePanel"),
    draftPanel: $("draftPanel"),
    resultPanel: $("resultPanel"),
    resultRewards: $("resultRewards"),
    resultSaved: $("resultSaved"),
    resultUnlock: $("resultUnlock"),
    startBtn: $("startBtn"),
    nextMissionBtn: $("nextMissionBtn"),
    menuBtn: $("menuBtn"),
    leavePanel: $("leavePanel"),
    leaveTitle: $("leaveTitle"),
    leaveMessage: $("leaveMessage"),
    leaveKeepBtn: $("leaveKeepBtn"),
    leaveConfirmBtn: $("leaveConfirmBtn"),
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
    battlefield: document.querySelector(".battlefield"),
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
    profileCoinText: $("profileCoinText"),
    packBtn: $("packBtn"),
    packCost: $("packCost"),
    packStatus: $("packStatus"),
    deckBuildCount: $("deckBuildCount"),
    deckAnalysis: $("deckAnalysis"),
    deckSlots: $("deckSlots"),
    collectionGrid: $("collectionGrid"),
    gearGrid: $("gearGrid"),
    stageGrid: $("stageGrid"),
    selectedMissionSummary: $("selectedMissionSummary"),
  };

  const asset = (name) => `../../assets/${name}`;

  function dockMainUtilities() {
    const menuCopy = nodes.menuPanel.querySelector(".menu-copy");
    const sound = document.querySelector("button[data-sound-toggle]");
    const version = document.querySelector(".weightplay-version-badge");
    if (sound) {
      sound.classList.add("beast-main-utility");
      menuCopy.appendChild(sound);
    }
    if (version) menuCopy.appendChild(version);
  }

  function installStandardStageFlow() {
    const menuCopy = nodes.menuPanel.querySelector(".menu-copy");
    const stageSelect = nodes.stageGrid.closest(".stage-select");
    const collectionPanel = $("collectionPanel");
    const diamondShop = $("diamondShop");
    const progressPanel = menuCopy.querySelector(".prototype-goals");
    const profilePanel = $("profilePanel");
    const controlChips = menuCopy.querySelector(".control-chips");
    const mainStart = document.createElement("button");
    mainStart.id = "mainStartBtn";
    mainStart.type = "button";
    mainStart.className = "standard-main-start";
    mainStart.dataset.wpMainStart = "true";
    mainStart.dataset.ui = "startGame";
    menuCopy.insertBefore(mainStart, menuCopy.querySelector(".prototype-goals"));
    const stagePanel = document.createElement("section");
    stagePanel.id = "stagePanel";
    stagePanel.className = "wp-standard-stage-panel hidden";
    stagePanel.dataset.wpStandardStageScreen = "true";
    // The preparation tabs share one logical Stage Canvas. Keep the Stage active
    // while Missions is hidden, otherwise the shared scaler drops between tabs.
    stagePanel.dataset.wpStageRail = "true";
    stagePanel.dataset.wpStageInitiallyHidden = "true";
    stagePanel.innerHTML = `
      <header class="wp-standard-stage-heading"><button id="stageBackBtn" data-wp-return="stage" type="button" data-aria="backToMain" aria-label="Back">&larr;</button><strong data-ui="stageHubTitle">Mission Preparation</strong></header>
      <div class="beast-stage-workspace">
        <section class="beast-stage-view is-active" data-stage-view="missions"></section>
        <section class="beast-stage-view" data-stage-view="deck"></section>
        <section class="beast-stage-view" data-stage-view="shop"></section>
      </div>
      <nav class="beast-stage-tabs" data-aria="preparation" aria-label="Preparation">
        <button type="button" class="is-active" data-stage-tab="missions" data-ui="stageTabMissions" aria-pressed="true">Missions</button>
        <button type="button" data-stage-tab="deck" data-ui="stageTabDeck" aria-pressed="false">Deck</button>
        <button type="button" data-stage-tab="shop" data-ui="stageTabShop" aria-pressed="false">Upgrades</button>
      </nav>`;
    const missionView = stagePanel.querySelector('[data-stage-view="missions"]');
    const deckView = stagePanel.querySelector('[data-stage-view="deck"]');
    const shopView = stagePanel.querySelector('[data-stage-view="shop"]');
    missionView.append(stageSelect);
    nodes.startBtn.remove();
    deckView.append(progressPanel, profilePanel, controlChips, collectionPanel);
    shopView.append(diamondShop);
    nodes.menuPanel.after(stagePanel);
    Object.assign(nodes, { stagePanel, mainStartBtn: mainStart, stageBackBtn: stagePanel.querySelector("#stageBackBtn") });
  }

  function selectStageTab(tabName) {
    cancelStageSettlement();
    if (tabName !== "shop" && amuletConfirmPending) {
      clearAmuletConfirmation();
      updateDiamondShopUI();
    }
    nodes.stagePanel.querySelectorAll("[data-stage-tab]").forEach((button) => {
      const isActive = button.dataset.stageTab === tabName;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    nodes.stagePanel.querySelectorAll("[data-stage-view]").forEach((view) => {
      view.classList.toggle("is-active", view.dataset.stageView === tabName);
    });
    if (tabName === "missions") requestAnimationFrame(scrollStageToSelected);
  }

  function showStage() {
    if (leaveDecisionOpen) setLeaveDecision(false, { restoreFocus: false, resume: false });
    cancelBattleTransitions();
    clearCombatFeedback();
    clearAmuletConfirmation();
    document.body.classList.remove("beast-deck-playing");
    nodes.menuBtn.dataset.wpReturn = "battle";
    profile.selectedMission = profile.unlockedMission;
    browsedMission = profile.selectedMission;
    saveLocalState();
    nodes.menuPanel.classList.add("hidden");
    nodes.stagePanel.classList.remove("hidden");
    document.body.classList.add("wp-standard-stage-page");
    renderProgressUI();
    requestAnimationFrame(() => nodes.stageGrid.querySelector(".stage-card.selected:not(:disabled)")?.focus({ preventScroll: true }));
  }

  function showMainFromStage() {
    cancelStageSettlement();
    clearAmuletConfirmation();
    nodes.stagePanel.classList.add("hidden");
    nodes.menuPanel.classList.remove("hidden");
    document.body.classList.remove("wp-standard-stage-page");
    requestAnimationFrame(() => nodes.mainStartBtn.focus({ preventScroll: true }));
  }

  const metaText = {
    en: {
      description: "Play Beast Deck: The Mist Forest, a 30-mission animal deckbuilder with ten regional mechanics, six phase-changing Bosses, local cards and gear.",
      ogDescription: "Build animal-power decks, read enemy intent, counter ten regional mechanics, and defeat six distinct Bosses across 30 missions.",
    },
    "zh-Hant": {
      description: "在 WeightPlay 遊玩《獸王牌組：迷霧森林》：30 個任務、十種區域機制、六隻換階段首領，以及本機卡冊與裝備成長。",
      ogDescription: "組合動物能力牌、判讀敵人意圖，破解十種區域機制並挑戰 30 任務與六隻不同首領。",
    },
    "zh-Hans": {
      description: "在 WeightPlay 游玩《兽王牌组：迷雾森林》：30 个任务、十种区域机制、六只会切换阶段的首领，以及保存在本机的卡册与装备成长。",
      ogDescription: "组合动物能力牌、判断敌人意图，破解十种区域机制并挑战 30 个任务与六只不同首领。",
    },
    es: {
      description: "Juega Beast Deck: El Bosque de Niebla, un juego de construcción de mazos con 30 misiones, diez mecánicas regionales y seis jefes por fases.",
      ogDescription: "Crea mazos de poderes animales, interpreta las intenciones enemigas y derrota a seis jefes distintos en 30 misiones.",
    },
  };

  const text = {
    en: {
      title: "Beast Deck: The Mist Forest",
      language: "Language",
      menuTitle: "Enter the Mist Forest.",
      menuHint: "Build animal-power decks across 30 missions, counter ten regional mechanics, and defeat six phase-changing forest Bosses.",
      startGame: "Start Game",
      progressTitle: "Local Progress",
      missionSelection: "Mission selection",
      progressText: "Clear missions to earn XP and Beast Coins. Spend coins on packs, equip cards and gear, then push deeper into the forest.",
      profileLevel: "Level",
      profileXp: "XP",
      profileBest: "Best",
      profileCoins: "Coins",
      profileBonus: "+{hp} Max HP from level",
      collectionTitle: "Card Collection",
      collectionHint: "Equip up to 6 extra cards before a mission.",
      packTitle: "Draw Beast Pack",
      packHint: "Spend coins for a card or equipment for future runs.",
      packNeed: "Need {cost} coins.",
      packActionLabel: "Draw Beast Pack. Spend {cost} Beast Coins. Balance {balance} to {result}.",
      packInsufficientLabel: "Draw Beast Pack. Need {cost} Beast Coins. Balance {balance}.",
      packResultCard: "New card: {card}.",
      packResultCardEquipped: "New card: {card}. Added to Battle Deck.",
      packResultGear: "New equipment: {gear}.",
      packResultGearEquipped: "New equipment: {gear}. Equipped now.",
      packDuplicate: "{name} upgraded to Rank {rank}/{maxRank}.",
      packRewardCardType: "Card Reward",
      packRewardGearType: "Equipment Reward",
      deckBuildTitle: "Battle Deck",
      deckAnalysis: "Next mission: {total} cards - {attack} Attack / {defense} Defense / {utility} Tactics.",
      collectionOwnedTitle: "Owned Cards",
      equipmentTitle: "Equipment",
      equipCard: "Equip",
      unequipCard: "Remove",
      removeCardLabel: "Remove {card} from Battle Deck, slot {slot} of {count}",
      allCopiesEquipped: "All copies equipped",
      deckFull: "Battle Deck full",
      ownedCount: "Owned {count}",
      equippedCount: "Equipped {count}/{max}",
      gearEquipped: "Equipped",
      gearEquip: "Equip",
      gearNone: "No equipment yet",
      gearRank: "Rank {rank}/{maxRank}",
      gearStatHp: "+{amount} Max HP",
      gearStatEnergy: "+{amount} Energy each battle",
      gearStatBlock: "Start each battle with {amount} Block",
      stageSelectTitle: "Choose a Mission",
      stageSelectHint: "Swipe or drag missions, then tap any unlocked mission card to begin.",
      stageHubTitle: "Mission Preparation",
      stageTabMissions: "Missions",
      stageTabDeck: "Deck",
      stageTabShop: "Upgrades",
      lockedMission: "Locked",
      missionLabel: "Mission {mission}",
      missionReward: "{xp} XP",
      missionCoins: "{coins} coins",
      startMissionCard: "Tap to choose",
      missionSelectedCard: "Selected - tap to begin",
      selectedMissionTitle: "Selected Mission",
      selectedMissionReady: "{mission} is ready. Clear reward: {xp} XP + {coins} coins.",
      missionScout: "Scout: {enemies}. First battle: {first}.",
      loadoutReady: "Loadout: {cards}/{max} extra cards · Gear: {gear}.",
      noGear: "None",
      controlCombat: "Turn-Based Strategy",
      controlUpgrades: "Draft Cards",
      controlDeck: "Persistent Level",
      diamondShopTitle: "Permanent Upgrade",
      amuletName: "Mist Amulet",
      amuletEffect: "Start every run with +10 Max HP.",
      amuletOwned: "Owned: every run starts with +10 Max HP.",
      amuletNeed: "Need {cost} diamonds.",
      amuletNeedExact: "Need {cost} Diamonds · Have {balance}.",
      amuletConfirm: "Permanent +10 Max HP · Diamonds {balance} → {result}. Activate again to confirm.",
      amuletConfirmLabel: "Confirm Mist Amulet. Permanent plus 10 Max HP. Spend {cost} Diamonds. Balance {balance} to {result}.",
      startRun: "Start Selected Mission",
      backToLobby: "Back to lobby",
      backToMain: "Back",
      backToStage: "Back to missions",
      preparation: "Preparation",
      menu: "Menu",
      hudStage: "Battle",
      hudMission: "Mission",
      hudHp: "Player HP",
      hudEnergy: "Energy",
      hudDeck: "Deck",
      hudDiscard: "Discard",
      combatBlock: "Block",
      combatGainBlock: "Block +{amount}",
      combatApplyPoison: "Poison +{amount}",
      shieldLabel: "Block",
      chooseCard: "Draft a Card",
      chooseCardDesc: "Choose one animal power for this mission deck. The chosen card is guaranteed in the next opening hand.",
      draftPermanentHint: "Mission draft cards last for this mission only. Permanent cards come from Gold Beast Packs on the menu.",
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
      card_mist_curse: "Mist Curse",
      card_mist_curse_desc: "Costs 1 Energy to clear. If held when ending the turn, take 2 damage.",
      gear_mist_cloak: "Mist Cloak",
      gear_mist_cloak_desc: "+6 Max HP.",
      gear_hunter_charm: "Hunter Charm",
      gear_hunter_charm_desc: "+1 Energy each battle.",
      gear_forest_banner: "Forest Banner",
      gear_forest_banner_desc: "Start with 4 Block.",
      intent_attack: "Attacking for {amount}",
      intent_defend: "Defending for {amount}",
      intent_poison: "Applying {amount} Poison",
      intent_buff: "Preparing a heavy strike",
      intent_armor: "Reinforcing armor by {amount}",
      intent_riposte: "Riposting the next attack for {amount}",
      intent_exhaust: "Exhausting one card by +{amount} Energy",
      intent_mark: "Marking a card for {amount} damage",
      intent_regen: "Regenerating {amount} HP",
      intent_cleanse: "Cleansing Poison",
      intent_weak: "Weakening the next attack by {amount}",
      intent_seal: "Sealing {type} cards",
      intent_curse: "Adding {amount} Mist Curse",
      intent_fog: "Hiding the next intent in crown mist",
      cardPlayable: "Playable · Cost {cost} · Energy {energy}",
      cardNeedEnergy: "Need {need} more Energy · Cost {cost} · Energy {energy}",
      cardWaitTurn: "Wait for your turn · Cost {cost}",
      cardSealed: "{type} cards are sealed this turn",
      cardActionLabel: "{card}. {effect}. {status}",
      endTurnSafe: "No held-card damage",
      endTurnMarkHazard: "Marked {card}: {damage} HP",
      endTurnCurseHazard: "{count} Mist Curse card(s): {damage} HP",
      endTurnHazardSummary: "{details}. Total held-card damage {damage} HP",
      endTurnActionLabel: "End turn. {hazard}. Next enemy action: {intent}.",
      log_start: "Battle started against {enemy}.",
      log_play_card: "Played {card}. Cost: {cost}.",
      log_combo: "Combo! {card} deals {damage} damage.",
      log_poison_damage: "{enemy} takes {damage} Poison damage.",
      log_enemy_turn: "Enemy turn: {action}.",
      log_enemy_blocked: "{enemy}'s Block absorbed {blocked} damage.",
      log_enemy_damage_after_block: "{enemy}'s Block absorbed {blocked}. {damage} damage went through.",
      log_player_turn: "Your turn. Drew {count} cards. Energy restored to {energy}.",
      log_player_block: "You gained {amount} Block. It will absorb enemy attack damage this turn.",
      log_enemy_block_fade: "{enemy}'s remaining Block faded.",
      log_draft_added: "{card} joined this mission deck and is guaranteed in this opening hand.",
      enemyBlockStatus: "DEF {amount} absorbs your next damage.",
      enemyArmorStatus: "ARM {amount} reduces every direct hit.",
      enemyRiposteStatus: "RIP {amount} counters the next Attack card.",
      enemyWardStatus: "WARD: play {amount} more card type(s).",
      enemyRegenStatus: "REG {amount} heals after enemy actions.",
      playerWeakStatus: "WEAK {amount} reduces your next Attack.",
      playerExhaustStatus: "EXH raises {card}'s cost by 1.",
      playerMarkStatus: "MARK: play {card} or take {amount} damage.",
      playerSealStatus: "SEALED: {type}",
      log_armor_absorb: "{enemy}'s armor reduces the hit by {blocked}.",
      log_riposte: "{enemy} ripostes for {damage} damage.",
      log_exhaust: "{card} is Exhausted and costs 1 more Energy this turn.",
      log_mark: "{card} is Marked. Play it before ending the turn or take {damage} damage.",
      log_mark_hit: "The unplayed Mark deals {damage} damage.",
      log_regen: "{enemy} regenerates {amount} HP.",
      log_cleanse: "{enemy} cleanses all Poison.",
      log_weak: "Your next Attack loses {amount} damage.",
      log_seal: "{type} cards are sealed until the next enemy action.",
      log_curse: "{count} Mist Curse card(s) enter the discard pile.",
      log_curse_hold: "An uncleared Mist Curse deals {damage} damage.",
      log_curse_clear: "Mist Curse cleared from this battle.",
      log_ward_progress: "Ward recognizes {type}. {remaining} type(s) remain.",
      log_ward_break: "Attack, Defense and Utility resonate together. The Ward breaks.",
      log_boss_phase: "{enemy} enters Phase {phase}: {effect}.",
      phase_armor: "armor thickens",
      phase_riposte: "riposte grows sharper",
      phase_haste: "the hunt accelerates",
      phase_regen: "regeneration intensifies",
      phase_seal: "the forbidden card type rotates",
      phase_ward: "the triad Ward reforms",
      log_win_battle: "Defeated {enemy}. Draft a new card.",
      log_win_mission: "Mission elite defeated. Gained {xp} XP.",
      log_win_boss: "Mission boss defeated. Gained {xp} XP.",
      log_coin_gain: "Earned {coins} Beast Coins.",
      log_loss: "You were defeated by {enemy}.",
      log_reshuffle: "Draw pile empty: discard pile reshuffled.",
      shieldAbsorbed: "Block absorbed all damage. {shield} Block left.",
      playerDamage: "Player took {damage} damage. {hp} HP remaining.",
      playerPoison: "Player took {damage} Poison damage. {hp} HP remaining.",
      levelUp: "Level up! Reached Level {level}.",
      report_win: "Mission {mission} cleared. You gained {xp} XP and unlocked deeper forest progress.",
      report_partial: "You cleared {count} battle(s) in Mission {mission}. Earned {xp} XP. Try again with a stronger deck plan.",
      report_no_wins: "No battles cleared yet. Read enemy intent, block large attacks, and build card combos.",
      resultRewards: "Run rewards: +{xp} XP · +{coins} Beast Coins",
      resultSaved: "Saved: Lv.{level} · {xp}/{nextXp} XP · {coins} Beast Coins",
      resultUnlocked: "New mission unlocked: Mission {mission} — {name}",
      resultReady: "Next mission ready: Mission {mission} — {name}",
      resultComplete: "Forest campaign complete: all {count} missions unlocked.",
      resultRetry: "Saved progress retained. Retry Mission {mission} when ready."
    },
    "zh-Hant": {
      title: "獸王牌組：迷霧森林",
      language: "語言",
      menuTitle: "進入迷霧森林。",
      menuHint: "建立動物能力牌組、判斷敵人意圖，並完成全部 30 個森林任務。",
      startGame: "開始遊戲",
      progressTitle: "本地進度",
      missionSelection: "任務選擇",
      progressText: "通關任務可獲得經驗與獸王金幣。用金幣抽卡包、裝備卡牌與道具，再挑戰更深的森林路線。",
      profileLevel: "等級",
      profileXp: "經驗",
      profileBest: "最佳",
      profileCoins: "金幣",
      profileBonus: "等級提供生命上限 +{hp}",
      collectionTitle: "卡冊",
      collectionHint: "出戰前最多裝備 6 張額外卡牌。",
      packTitle: "金幣抽卡包",
      packHint: "消耗金幣，獲得未來出戰可用的卡牌或裝備。",
      packNeed: "需要 {cost} 金幣。",
      packActionLabel: "抽取獸王牌組卡包。花費 {cost} 獸王金幣。餘額從 {balance} 變為 {result}。",
      packInsufficientLabel: "抽取獸王牌組卡包。需要 {cost} 獸王金幣，目前持有 {balance}。",
      packResultCard: "獲得卡牌：{card}。",
      packResultCardEquipped: "獲得卡牌：{card}，已加入出戰牌組。",
      packResultGear: "獲得裝備：{gear}。",
      packResultGearEquipped: "獲得裝備：{gear}，已自動裝備。",
      packDuplicate: "{name} 強化至 {rank}/{maxRank} 階。",
      packRewardCardType: "卡牌獎勵",
      packRewardGearType: "裝備獎勵",
      deckBuildTitle: "出戰牌組",
      deckAnalysis: "下次任務：共 {total} 張牌 - 攻擊 {attack} / 防禦 {defense} / 戰術 {utility}。",
      collectionOwnedTitle: "持有卡牌",
      equipmentTitle: "裝備",
      equipCard: "裝備",
      unequipCard: "移除",
      removeCardLabel: "從出戰牌組移除 {card}，第 {slot} 張，共 {count} 張",
      allCopiesEquipped: "持有卡牌皆已裝備",
      deckFull: "出戰牌組已滿",
      ownedCount: "持有 {count}",
      equippedCount: "已裝備 {count}/{max}",
      gearEquipped: "已裝備",
      gearEquip: "裝備",
      gearNone: "尚未持有裝備",
      gearRank: "{rank}/{maxRank} 階",
      gearStatHp: "生命上限 +{amount}",
      gearStatEnergy: "每場戰鬥能量 +{amount}",
      gearStatBlock: "每場開始獲得 {amount} 點格擋",
      stageSelectTitle: "選擇任務",
      stageSelectHint: "左右滑動任務列，點擊任一已解鎖任務卡即可開始。",
      stageHubTitle: "任務準備",
      stageTabMissions: "任務",
      stageTabDeck: "牌組",
      stageTabShop: "升級",
      lockedMission: "未解鎖",
      missionLabel: "任務 {mission}",
      missionReward: "{xp} 經驗",
      missionCoins: "{coins} 金幣",
      startMissionCard: "點擊選擇",
      missionSelectedCard: "已選擇・點擊開始",
      selectedMissionTitle: "已選任務",
      selectedMissionReady: "{mission} 已準備。通關獎勵：{xp} 經驗 + {coins} 金幣。",
      missionScout: "偵察：{enemies}。首戰：{first}。",
      loadoutReady: "出戰配置：額外卡牌 {cards}/{max} · 裝備：{gear}。",
      noGear: "無",
      controlCombat: "回合策略",
      controlUpgrades: "抽選卡牌",
      controlDeck: "永久等級",
      diamondShopTitle: "永久升級",
      amuletName: "迷霧護符",
      amuletEffect: "每次出戰生命上限 +10。",
      amuletOwned: "已擁有：每次出戰生命上限 +10。",
      amuletNeed: "需要 {cost} 鑽石。",
      amuletNeedExact: "需要 {cost} 鑽石 · 持有 {balance}。",
      amuletConfirm: "永久生命上限 +10 · 鑽石 {balance} → {result}。再次啟用即可確認。",
      amuletConfirmLabel: "確認迷霧護符。永久生命上限加 10。花費 {cost} 鑽石。餘額從 {balance} 變為 {result}。",
      startRun: "開始選定任務",
      backToLobby: "返回大廳",
      backToMain: "返回",
      backToStage: "返回任務",
      preparation: "任務準備",
      menu: "選單",
      hudStage: "戰鬥",
      hudMission: "任務",
      hudHp: "生命",
      hudEnergy: "能量",
      hudDeck: "牌庫",
      hudDiscard: "棄牌",
      combatBlock: "格擋",
      combatGainBlock: "格擋 +{amount}",
      combatApplyPoison: "中毒 +{amount}",
      shieldLabel: "格擋",
      chooseCard: "選擇卡牌",
      chooseCardDesc: "選一張動物能力加入本次任務牌組，選到的卡會保證出現在下一場開手牌。",
      draftPermanentHint: "戰鬥中選到的卡只存在本次任務；永久卡冊要用選單的金幣卡包取得。",
      tryAgain: "再試一次",
      backToMenu: "回到選單",
      skillLogic: "邏輯",
      skillFocus: "專注",
      skillProblem: "問題解決",
      endTurn: "結束回合",
      runComplete: "任務完成！",
      runFailed: "任務失敗",
      resultScoreLabel: "任務進度",
      resultDisclaimer: "僅供遊玩與本地進度追蹤。",
      skillReportTitle: "能力報告",
      loading: "載入中",
      card_wolf_pack: "狼群突襲",
      card_wolf_pack_desc: "造成 6 點傷害。本回合若已打出攻擊卡，改為造成 12 點。",
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
      card_mist_curse: "迷霧詛咒",
      card_mist_curse_desc: "消耗 1 點能量清除；若回合結束仍留在手中，受到 2 點傷害。",
      gear_mist_cloak: "迷霧披風",
      gear_mist_cloak_desc: "生命上限 +6。",
      gear_hunter_charm: "獵手護符",
      gear_hunter_charm_desc: "每場戰鬥能量 +1。",
      gear_forest_banner: "森林戰旗",
      gear_forest_banner_desc: "戰鬥開始時獲得 4 點格擋。",
      intent_attack: "準備攻擊 {amount}",
      intent_defend: "準備防禦 {amount}",
      intent_poison: "準備施加 {amount} 層中毒",
      intent_buff: "準備蓄力重擊",
      intent_armor: "準備增加 {amount} 點護甲",
      intent_riposte: "準備以 {amount} 點傷害反擊下一張攻擊牌",
      intent_exhaust: "使一張牌疲勞並增加 {amount} 點能量消耗",
      intent_mark: "標記一張牌；未打出會受到 {amount} 點傷害",
      intent_regen: "準備恢復 {amount} 點生命",
      intent_cleanse: "準備淨化所有中毒",
      intent_weak: "使下一次攻擊降低 {amount} 點傷害",
      intent_seal: "封印{type}牌",
      intent_curse: "加入 {amount} 張迷霧詛咒",
      intent_fog: "以冠霧遮蔽下一個意圖",
      cardPlayable: "可打出 · 消耗 {cost} · 目前能量 {energy}",
      cardNeedEnergy: "還需要 {need} 點能量 · 消耗 {cost} · 目前能量 {energy}",
      cardWaitTurn: "等待玩家回合 · 消耗 {cost}",
      cardSealed: "本回合{type}牌遭到封印",
      cardActionLabel: "{card}。{effect}。{status}",
      endTurnSafe: "不會受到手牌傷害",
      endTurnMarkHazard: "標記牌 {card}：{damage} 點生命",
      endTurnCurseHazard: "{count} 張迷霧詛咒：{damage} 點生命",
      endTurnHazardSummary: "{details}。手牌傷害合計 {damage} 點生命",
      endTurnActionLabel: "結束回合。{hazard}。下一個敵方行動：{intent}。",
      log_start: "與 {enemy} 的戰鬥開始。",
      log_play_card: "打出 {card}，消耗 {cost}。",
      log_combo: "連擊成功！{card} 造成 {damage} 點傷害。",
      log_poison_damage: "{enemy} 受到 {damage} 點中毒傷害。",
      log_enemy_turn: "敵方回合：{action}。",
      log_enemy_blocked: "{enemy} 的格擋吸收了 {blocked} 點傷害。",
      log_enemy_damage_after_block: "{enemy} 的格擋吸收 {blocked} 點，仍受到 {damage} 點傷害。",
      log_player_turn: "你的回合，抽 {count} 張牌，能量恢復為 {energy}。",
      log_player_block: "你獲得 {amount} 點格擋，可吸收本回合敵方攻擊。",
      log_enemy_block_fade: "{enemy} 剩餘的格擋消退了。",
      log_draft_added: "{card} 已加入本次任務牌組，並保證出現在這場開手牌。",
      enemyBlockStatus: "DEF {amount} 會吸收你的下一次傷害。",
      enemyArmorStatus: "ARM {amount} 會削減每次直接傷害。",
      enemyRiposteStatus: "RIP {amount} 會反擊下一張攻擊牌。",
      enemyWardStatus: "WARD：還需使用 {amount} 種卡牌類型。",
      enemyRegenStatus: "REG {amount} 會在敵方行動後治療。",
      playerWeakStatus: "WEAK {amount} 會降低下一次攻擊。",
      playerExhaustStatus: "EXH：{card} 消耗增加 1。",
      playerMarkStatus: "MARK：打出 {card}，否則受到 {amount} 點傷害。",
      playerSealStatus: "封印：{type}",
      log_armor_absorb: "{enemy} 的護甲削減了 {blocked} 點傷害。",
      log_riposte: "{enemy} 反擊並造成 {damage} 點傷害。",
      log_exhaust: "{card} 陷入疲勞，本回合消耗增加 1。",
      log_mark: "{card} 被標記；回合結束前未打出會受到 {damage} 點傷害。",
      log_mark_hit: "未解除的標記造成 {damage} 點傷害。",
      log_regen: "{enemy} 恢復 {amount} 點生命。",
      log_cleanse: "{enemy} 淨化了所有中毒。",
      log_weak: "你的下一次攻擊降低 {amount} 點傷害。",
      log_seal: "{type}牌遭到封印，直到下一次敵方行動。",
      log_curse: "{count} 張迷霧詛咒進入棄牌堆。",
      log_curse_hold: "未清除的迷霧詛咒造成 {damage} 點傷害。",
      log_curse_clear: "迷霧詛咒已從本場戰鬥清除。",
      log_ward_progress: "結界感應到{type}牌，還需 {remaining} 種。",
      log_ward_break: "攻擊、防禦與功能牌同時共鳴，三相結界破除。",
      log_boss_phase: "{enemy} 進入第 {phase} 階段：{effect}。",
      phase_armor: "護甲增厚",
      phase_riposte: "反擊變得更銳利",
      phase_haste: "追獵速度提升",
      phase_regen: "再生能力增強",
      phase_seal: "禁用牌型輪替",
      phase_ward: "三相結界重組",
      log_win_battle: "擊敗 {enemy}，選一張新卡。",
      log_win_mission: "任務菁英已擊敗，獲得 {xp} 經驗。",
      log_win_boss: "任務首領被擊敗，獲得 {xp} 經驗。",
      log_coin_gain: "獲得 {coins} 枚獸王金幣。",
      log_loss: "你被 {enemy} 擊敗了。",
      log_reshuffle: "抽牌堆已空，棄牌堆重新洗入牌庫。",
      shieldAbsorbed: "格擋吸收所有傷害，剩餘 {shield} 點格擋。",
      playerDamage: "玩家受到 {damage} 點傷害，剩餘 {hp} HP。",
      playerPoison: "玩家受到 {damage} 點中毒傷害，剩餘 {hp} HP。",
      levelUp: "升級！達到等級 {level}。",
      report_win: "任務 {mission} 通關，獲得 {xp} 經驗並推進森林進度。",
      report_partial: "任務 {mission} 已通過 {count} 場戰鬥，獲得 {xp} 經驗。調整牌組再挑戰一次。",
      report_no_wins: "尚未通過戰鬥。觀察敵人意圖、用格擋承受大攻擊，並組出卡牌連擊。",
      resultRewards: "本次獎勵：+{xp} 經驗 · +{coins} 獸王金幣",
      resultSaved: "已保存：Lv.{level} · {xp}/{nextXp} 經驗 · {coins} 獸王金幣",
      resultUnlocked: "新任務解鎖：任務 {mission}—{name}",
      resultReady: "下一任務可進入：任務 {mission}—{name}",
      resultComplete: "森林戰役完成：全部 {count} 個任務已解鎖。",
      resultRetry: "已保留進度，可隨時重試任務 {mission}。"
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
    "mist-curse": { cost: 1, type: "curse", image: "beast-deck-boss-mist-crown.webp", nameKey: "card_mist_curse", descKey: "card_mist_curse_desc", draftable: false, temporary: true },
  };

  text.es = {
    title: "Beast Deck: El Bosque de Niebla",
    language: "Idioma",
    menuTitle: "Entra en el Bosque de Niebla.",
    menuHint: "Crea un mazo de poderes animales, interpreta la intención enemiga y completa las 30 misiones del bosque.",
    startGame: "Iniciar juego",
    progressTitle: "Progreso local",
    missionSelection: "Selección de misiones",
    progressText: "Completa misiones para ganar XP y Monedas Bestia. Compra sobres, equipa cartas y objetos, y avanza por el bosque.",
    profileLevel: "Nivel",
    profileXp: "XP",
    profileBest: "Récord",
    profileCoins: "Monedas",
    profileBonus: "+{hp} PV máximos por nivel",
    collectionTitle: "Colección de cartas",
    collectionHint: "Equipa hasta 6 cartas adicionales antes de una misión.",
    packTitle: "Abrir Sobre Bestia",
    packHint: "Gasta monedas para conseguir una carta o equipo para futuras partidas.",
    packNeed: "Necesitas {cost} monedas.",
    packActionLabel: "Abrir Sobre Bestia. Gasta {cost} Monedas Bestia. Saldo de {balance} a {result}.",
    packInsufficientLabel: "Abrir Sobre Bestia. Necesitas {cost} Monedas Bestia. Saldo {balance}.",
    packResultCard: "Nueva carta: {card}.",
    packResultCardEquipped: "Nueva carta: {card}. Añadida al mazo de batalla.",
    packResultGear: "Nuevo equipo: {gear}.",
    packResultGearEquipped: "Nuevo equipo: {gear}. Equipado ahora.",
    packDuplicate: "{name} mejoró al rango {rank}/{maxRank}.",
    packRewardCardType: "Premio de carta",
    packRewardGearType: "Premio de equipo",
    deckBuildTitle: "Mazo de batalla",
    deckAnalysis: "Siguiente misión: {total} cartas - {attack} Ataque / {defense} Defensa / {utility} Táctica.",
    collectionOwnedTitle: "Cartas obtenidas",
    equipmentTitle: "Equipo",
    equipCard: "Equipar",
    unequipCard: "Quitar",
    removeCardLabel: "Quitar {card} del mazo de batalla, espacio {slot} de {count}",
    allCopiesEquipped: "Todas las copias equipadas",
    deckFull: "Mazo de batalla lleno",
    ownedCount: "Tienes {count}",
    equippedCount: "Equipadas {count}/{max}",
    gearEquipped: "Equipado",
    gearEquip: "Equipar",
    gearNone: "Aún no hay equipo",
    gearRank: "Rango {rank}/{maxRank}",
    gearStatHp: "+{amount} PV máximos",
    gearStatEnergy: "+{amount} de energía en cada batalla",
    gearStatBlock: "Empieza cada batalla con {amount} de bloqueo",
    stageSelectTitle: "Elegir misión",
    stageSelectHint: "Desliza o arrastra las misiones y toca una desbloqueada para comenzar.",
    stageHubTitle: "Preparación de misión",
    stageTabMissions: "Misiones",
    stageTabDeck: "Mazo",
    stageTabShop: "Mejoras",
    lockedMission: "Bloqueada",
    missionLabel: "Misión {mission}",
    missionReward: "{xp} XP",
    missionCoins: "{coins} monedas",
    startMissionCard: "Toca para elegir",
    missionSelectedCard: "Elegida: toca para comenzar",
    selectedMissionTitle: "Misión elegida",
    selectedMissionReady: "{mission} está lista. Premio: {xp} XP + {coins} monedas.",
    missionScout: "Exploración: {enemies}. Primera batalla: {first}.",
    loadoutReady: "Equipo: {cards}/{max} cartas extra · Objeto: {gear}.",
    noGear: "Ninguno",
    controlCombat: "Estrategia por turnos",
    controlUpgrades: "Elección de cartas",
    controlDeck: "Nivel permanente",
    diamondShopTitle: "Mejora permanente",
    amuletName: "Amuleto de Niebla",
    amuletEffect: "Empieza cada partida con +10 PV máximos.",
    amuletOwned: "Obtenido: cada partida empieza con +10 PV máximos.",
    amuletNeed: "Necesitas {cost} diamantes.",
    amuletNeedExact: "Necesitas {cost} diamantes · Tienes {balance}.",
    amuletConfirm: "+10 PV máximos permanentes · Diamantes {balance} → {result}. Activa otra vez para confirmar.",
    amuletConfirmLabel: "Confirmar Amuleto de Niebla. Más 10 PV máximos permanentes. Gasta {cost} diamantes. Saldo de {balance} a {result}.",
    startRun: "Empezar misión elegida",
    backToLobby: "Volver al vestíbulo",
    backToMain: "Volver",
    backToStage: "Volver a misiones",
    preparation: "Preparación",
    menu: "Menú",
    hudStage: "Batalla",
    hudMission: "Misión",
    hudHp: "PV del jugador",
    hudEnergy: "Energía",
    hudDeck: "Mazo",
    hudDiscard: "Descarte",
    combatBlock: "Bloqueo",
    combatGainBlock: "Bloqueo +{amount}",
    combatApplyPoison: "Veneno +{amount}",
    shieldLabel: "Bloqueo",
    chooseCard: "Elige una carta",
    chooseCardDesc: "Elige un poder animal para el mazo de esta misión. La carta elegida aparecerá en la próxima mano inicial.",
    draftPermanentHint: "Las cartas elegidas duran solo esta misión. Las permanentes salen en Sobres Bestia de Oro del menú.",
    tryAgain: "Intentar de nuevo",
    backToMenu: "Volver al menú",
    skillLogic: "Lógica",
    skillFocus: "Concentración",
    skillProblem: "Resolución de problemas",
    endTurn: "Terminar turno",
    runComplete: "¡Misión completada!",
    runFailed: "Misión fallida",
    resultScoreLabel: "Progreso de misión",
    resultDisclaimer: "Solo para divertirse y registrar el progreso local.",
    skillReportTitle: "Informe de habilidades",
    loading: "Cargando",
    card_wolf_pack: "Manada de Lobos",
    card_wolf_pack_desc: "Inflige 6 de daño. Si jugaste otro ataque este turno, inflige 12.",
    card_guard_bear: "Oso Guardián",
    card_guard_bear_desc: "Obtén 6 de bloqueo.",
    card_sky_hawk: "Halcón Celeste",
    card_sky_hawk_desc: "Inflige 14 de daño y roba 1 carta.",
    card_cheetah_sprint: "Carrera del Guepardo",
    card_cheetah_sprint_desc: "Roba 2 cartas y obtén 1 de energía.",
    card_viper_venom: "Veneno de Víbora",
    card_viper_venom_desc: "Aplica 3 de veneno al enemigo.",
    card_owl_wisdom: "Sabiduría del Búho",
    card_owl_wisdom_desc: "Roba 1 carta.",
    card_iron_tortoise: "Tortuga de Hierro",
    card_iron_tortoise_desc: "Obtén 15 de bloqueo.",
    card_mist_curse: "Maldición de Niebla",
    card_mist_curse_desc: "Cuesta 1 de energía eliminarla. Si la conservas al terminar el turno, recibes 2 de daño.",
    gear_mist_cloak: "Capa de Niebla",
    gear_mist_cloak_desc: "+6 PV máximos.",
    gear_hunter_charm: "Talismán del Cazador",
    gear_hunter_charm_desc: "+1 de energía en cada batalla.",
    gear_forest_banner: "Estandarte del Bosque",
    gear_forest_banner_desc: "Empieza con 4 de bloqueo.",
    intent_attack: "Ataca por {amount}",
    intent_defend: "Se defiende por {amount}",
    intent_poison: "Aplica {amount} de veneno",
    intent_buff: "Prepara un golpe fuerte",
    intent_armor: "Refuerza la armadura en {amount}",
    intent_riposte: "Contraataca el próximo ataque por {amount}",
    intent_exhaust: "Aumenta en {amount} el coste de una carta",
    intent_mark: "Marca una carta para infligir {amount} de daño",
    intent_regen: "Regenera {amount} PV",
    intent_cleanse: "Elimina el veneno",
    intent_weak: "Reduce el próximo ataque en {amount}",
    intent_seal: "Sella cartas de {type}",
    intent_curse: "Añade {amount} Maldición de Niebla",
    intent_fog: "Oculta la siguiente intención en la niebla real",
    cardPlayable: "Se puede jugar · Coste {cost} · Energía {energy}",
    cardNeedEnergy: "Faltan {need} de energía · Coste {cost} · Energía {energy}",
    cardWaitTurn: "Espera tu turno · Coste {cost}",
    cardSealed: "Las cartas de {type} están selladas este turno",
    cardActionLabel: "{card}. {effect}. {status}",
    endTurnSafe: "Sin daño por cartas conservadas",
    endTurnMarkHazard: "{card} marcada: {damage} PV",
    endTurnCurseHazard: "Maldiciones de Niebla: {count}; daño: {damage} PV",
    endTurnHazardSummary: "{details}. Daño total por cartas conservadas: {damage} PV",
    endTurnActionLabel: "Terminar turno. {hazard}. Siguiente acción enemiga: {intent}.",
    log_start: "Comienza la batalla contra {enemy}.",
    log_play_card: "Jugaste {card}. Coste: {cost}.",
    log_combo: "¡Combo! {card} inflige {damage} de daño.",
    log_poison_damage: "{enemy} recibe {damage} de daño de veneno.",
    log_enemy_turn: "Turno enemigo: {action}.",
    log_enemy_blocked: "El bloqueo de {enemy} absorbió {blocked} de daño.",
    log_enemy_damage_after_block: "El bloqueo de {enemy} absorbió {blocked}. Pasaron {damage} de daño.",
    log_player_turn: "Tu turno. Robaste {count} cartas. Energía restaurada a {energy}.",
    log_player_block: "Obtuviste {amount} de bloqueo. Absorberá daño enemigo este turno.",
    log_enemy_block_fade: "El bloqueo restante de {enemy} desapareció.",
    log_draft_added: "{card} se unió al mazo de esta misión y aparecerá en la mano inicial.",
    enemyBlockStatus: "DEF {amount} absorbe tu próximo daño.",
    enemyArmorStatus: "ARM {amount} reduce cada golpe directo.",
    enemyRiposteStatus: "CON {amount} responde a la próxima carta de ataque.",
    enemyWardStatus: "BARRERA: juega {amount} tipo(s) de carta más.",
    enemyRegenStatus: "REG {amount} cura tras las acciones enemigas.",
    playerWeakStatus: "DÉBIL {amount} reduce tu próximo ataque.",
    playerExhaustStatus: "AGOT aumenta en 1 el coste de {card}.",
    playerMarkStatus: "MARCA: juega {card} o recibe {amount} de daño.",
    playerSealStatus: "SELLADO: {type}",
    log_armor_absorb: "La armadura de {enemy} reduce el golpe en {blocked}.",
    log_riposte: "{enemy} contraataca por {damage} de daño.",
    log_exhaust: "{card} queda agotada y cuesta 1 de energía más este turno.",
    log_mark: "{card} está marcada. Juégala antes de terminar el turno o recibe {damage} de daño.",
    log_mark_hit: "La marca no jugada inflige {damage} de daño.",
    log_regen: "{enemy} regenera {amount} PV.",
    log_cleanse: "{enemy} elimina todo el veneno.",
    log_weak: "Tu próximo ataque pierde {amount} de daño.",
    log_seal: "Las cartas de {type} quedan selladas hasta la siguiente acción enemiga.",
    log_curse: "{count} Maldición(es) de Niebla entran en el descarte.",
    log_curse_hold: "Una Maldición de Niebla sin eliminar inflige {damage} de daño.",
    log_curse_clear: "Maldición de Niebla eliminada de esta batalla.",
    log_ward_progress: "La barrera reconoce {type}. Faltan {remaining} tipo(s).",
    log_ward_break: "Ataque, defensa y táctica resuenan juntos. La barrera se rompe.",
    log_boss_phase: "{enemy} entra en la fase {phase}: {effect}.",
    phase_armor: "la armadura se engrosa",
    phase_riposte: "el contraataque se vuelve más fuerte",
    phase_haste: "la cacería se acelera",
    phase_regen: "la regeneración se intensifica",
    phase_seal: "cambia el tipo de carta prohibido",
    phase_ward: "la barrera triple se restaura",
    log_win_battle: "Derrotaste a {enemy}. Elige una carta nueva.",
    log_win_mission: "Élite de misión derrotada. Ganaste {xp} XP.",
    log_win_boss: "Jefe de misión derrotado. Ganaste {xp} XP.",
    log_coin_gain: "Ganaste {coins} Monedas Bestia.",
    log_loss: "{enemy} te derrotó.",
    log_reshuffle: "Mazo vacío: se barajó el descarte.",
    shieldAbsorbed: "El bloqueo absorbió todo el daño. Queda {shield} de bloqueo.",
    playerDamage: "Recibiste {damage} de daño. Quedan {hp} PV.",
    playerPoison: "Recibiste {damage} de daño de veneno. Quedan {hp} PV.",
    levelUp: "¡Subiste de nivel! Alcanzaste el nivel {level}.",
    report_win: "Misión {mission} completada. Ganaste {xp} XP y desbloqueaste más bosque.",
    report_partial: "Superaste {count} batalla(s) de la misión {mission}. Ganaste {xp} XP. Inténtalo con un plan de mazo más fuerte.",
    report_no_wins: "Aún no superaste ninguna batalla. Lee la intención enemiga, bloquea ataques fuertes y crea combos.",
    resultRewards: "Premios: +{xp} XP · +{coins} Monedas Bestia",
    resultSaved: "Guardado: Nv.{level} · {xp}/{nextXp} XP · {coins} Monedas Bestia",
    resultUnlocked: "Nueva misión desbloqueada: misión {mission} — {name}",
    resultReady: "Siguiente misión disponible: misión {mission} — {name}",
    resultComplete: "Campaña del bosque completada: {count} misiones desbloqueadas.",
    resultRetry: "Progreso guardado. Repite la misión {mission} cuando quieras."
  };
  const permanentCardIds = Object.keys(cardDb).filter((cardId) => cardDb[cardId].draftable !== false);

  const baseDeck = [
    "wolf-pack", "wolf-pack", "wolf-pack", "wolf-pack",
    "guard-bear", "guard-bear", "guard-bear", "guard-bear",
    "sky-hawk", "cheetah-sprint"
  ];

  const starterCollection = {
    "wolf-pack": 1,
    "guard-bear": 1,
    "sky-hawk": 1,
    "cheetah-sprint": 1,
  };

  const gearDb = {
    "mist-cloak": { nameKey: "gear_mist_cloak", descKey: "gear_mist_cloak_desc", statKey: "gearStatHp", image: "animal-relic-hunters-skill-shield-heart.webp", hp: 6 },
    "hunter-charm": { nameKey: "gear_hunter_charm", descKey: "gear_hunter_charm_desc", statKey: "gearStatEnergy", image: "animal-crystal-survivor-upgrade-cooldown.png", energy: 1 },
    "forest-banner": { nameKey: "gear_forest_banner", descKey: "gear_forest_banner_desc", statKey: "gearStatBlock", image: "animal-crystal-survivor-upgrade-attack.png", block: 4 },
  };

  const enemyCatalog = {
    boar: { name: "Shadow Boar", nameZh: "暗影野豬", image: "wonder-beast-boar.png", hp: 24, intents: [{ type: "attack", val: 6 }, { type: "defend", val: 5 }, { type: "attack", val: 9 }] },
    viper: { name: "Corrupted Viper", nameZh: "腐化毒蛇", image: "wonder-beast-crocodile.png", hp: 34, intents: [{ type: "poison", val: 2 }, { type: "defend", val: 8 }, { type: "attack", val: 8 }] },
    behemoth: { name: "Mist Behemoth", nameZh: "迷霧巨獸", image: "wonder-beast-buffalo.png", hp: 58, intents: [{ type: "attack", val: 10 }, { type: "defend", val: 10 }, { type: "attack", val: 15 }, { type: "buff", val: 0 }] },
    rhino: { name: "Ironhide Rhino", nameZh: "鐵皮犀牛", image: "wonder-beast-rhino.png", hp: 42, intents: [{ type: "defend", val: 11 }, { type: "attack", val: 11 }, { type: "attack", val: 8 }] },
    tiger: { name: "Amber Tiger", nameZh: "琥珀猛虎", image: "wonder-beast-tiger.png", hp: 46, intents: [{ type: "attack", val: 12 }, { type: "attack", val: 7 }, { type: "buff", val: 0 }] },
    bear: { name: "Ancient Bear", nameZh: "古林巨熊", image: "wonder-beast-bear.png", hp: 52, intents: [{ type: "defend", val: 12 }, { type: "attack", val: 13 }, { type: "poison", val: 2 }] },
    thornStag: { name: "Thornplate Stag", nameZh: "棘甲雄鹿", image: "animal-rune-tactics-boss-stag.webp", hp: 38, armor: 2, intents: [{ type: "attack", val: 8 }, { type: "armor", val: 1 }, { type: "attack", val: 11 }] },
    ironJackal: { name: "Ironroot Jackal", nameZh: "鐵根胡狼", image: "wonder-beast-hyena.png", hp: 43, intents: [{ type: "riposte", val: 4 }, { type: "attack", val: 10 }, { type: "exhaust", val: 1 }] },
    amberLynx: { name: "Amber Lynx", nameZh: "琥珀山貓", image: "wonder-beast-tiger.png", hp: 44, haste: true, intents: [{ type: "attack", val: 7 }, { type: "mark", val: 5 }, { type: "attack", val: 12 }, { type: "defend", val: 7 }] },
    mireToad: { name: "Mirecoil Toad", nameZh: "泥沼蟾蜍", image: "wonder-beast-crocodile.png", hp: 48, regen: 3, intents: [{ type: "poison", val: 2 }, { type: "regen", val: 5 }, { type: "weak", val: 4 }, { type: "attack", val: 10 }] },
    archiveOwl: { name: "Archive Owl", nameZh: "典藏夜梟", image: "animal-guard-owl.png", hp: 46, intents: [{ type: "seal", val: 0, seal: "attack" }, { type: "attack", val: 9 }, { type: "seal", val: 0, seal: "utility" }, { type: "defend", val: 9 }] },
    crownWolf: { name: "Crownmist Wolf", nameZh: "冠霧狼", image: "wonder-beast-hyena.png", hp: 50, fog: true, intents: [{ type: "curse", val: 1 }, { type: "attack", val: 12 }, { type: "fog", val: 0 }, { type: "attack", val: 8 }] },
    stonebackBoss: { name: "Stoneback Behemoth", nameZh: "磐背巨獸", image: "beast-deck-boss-stoneback.webp", hp: 72, armor: 3, isBoss: true, bossId: "stoneback", phaseMechanic: "armor", intents: [{ type: "armor", val: 2 }, { type: "attack", val: 12 }, { type: "defend", val: 10 }, { type: "attack", val: 16 }] },
    ironrootBoss: { name: "Ironroot Warden", nameZh: "鐵根守衛", image: "beast-deck-boss-ironroot.webp", hp: 76, isBoss: true, bossId: "ironroot", phaseMechanic: "riposte", intents: [{ type: "riposte", val: 5 }, { type: "attack", val: 13 }, { type: "exhaust", val: 1 }, { type: "attack", val: 17 }] },
    amberBoss: { name: "Amber Huntmaster", nameZh: "琥珀獵主", image: "beast-deck-boss-amber-huntmaster.webp", hp: 78, haste: true, isBoss: true, bossId: "amber", phaseMechanic: "haste", intents: [{ type: "mark", val: 7 }, { type: "attack", val: 9 }, { type: "weak", val: 4 }, { type: "attack", val: 15 }, { type: "defend", val: 8 }] },
    mirecoilBoss: { name: "Mirecoil Hydra", nameZh: "泥沼盤蛇", image: "beast-deck-boss-mirecoil-hydra.webp", hp: 84, regen: 4, isBoss: true, bossId: "mirecoil", phaseMechanic: "regen", intents: [{ type: "poison", val: 3 }, { type: "regen", val: 7 }, { type: "attack", val: 13 }, { type: "cleanse", val: 0 }, { type: "attack", val: 17 }] },
    moonBoss: { name: "Moon Archive Keeper", nameZh: "月典守藏者", image: "beast-deck-boss-moon-archive.webp", hp: 82, isBoss: true, bossId: "moon", phaseMechanic: "seal", intents: [{ type: "seal", val: 0, seal: "attack" }, { type: "attack", val: 12 }, { type: "seal", val: 0, seal: "defense" }, { type: "defend", val: 12 }, { type: "seal", val: 0, seal: "utility" }] },
    mistCrownBoss: { name: "Mist Crown Monarch", nameZh: "霧冠獸王", image: "beast-deck-boss-mist-crown.webp", hp: 92, ward: 3, isBoss: true, bossId: "mist-crown", phaseMechanic: "ward", intents: [{ type: "curse", val: 2 }, { type: "attack", val: 14 }, { type: "fog", val: 0 }, { type: "attack", val: 19 }, { type: "seal", val: 0, seal: "utility" }] },
  };
  const enemyNamesEs = {
    boar: "Jabalí Sombrío",
    viper: "Víbora Corrupta",
    behemoth: "Behemot del Bosque",
    rhino: "Rinoceronte de Hierro",
    tiger: "Tigre Ámbar",
    bear: "Oso Ancestral",
    thornStag: "Ciervo de Placas Espinosas",
    ironJackal: "Chacal Raíz de Hierro",
    amberLynx: "Lince Ámbar",
    mireToad: "Sapo Espiral del Pantano",
    archiveOwl: "Búho del Archivo",
    crownWolf: "Lobo de Niebla Coronada",
    stonebackBoss: "Behemot Lomo de Piedra",
    ironrootBoss: "Guardián Raíz de Hierro",
    amberBoss: "Maestro de la Cacería Ámbar",
    mirecoilBoss: "Hidra Espiral del Pantano",
    moonBoss: "Custodio del Archivo Lunar",
    mistCrownBoss: "Monarca de la Corona de Niebla"
  };
  Object.entries(enemyNamesEs).forEach(([id, nameEs]) => {
    if (enemyCatalog[id]) enemyCatalog[id].nameEs = nameEs;
  });

  const missionTemplates = [
    { title: "Misty Trail", titleZh: "迷霧小徑", subtitle: "Read simple attack and guard intents.", subtitleZh: "判讀基本攻擊與防禦意圖。", enemies: ["boar", "viper", "behemoth"], xp: 70, arc: 1 },
    { title: "Bramble Fork", titleZh: "荊棘岔路", subtitle: "Poison changes the safe turn.", subtitleZh: "中毒會改變安全回合。", enemies: ["viper", "boar", "thornStag"], xp: 78, arc: 1 },
    { title: "Moss Rampart", titleZh: "苔石壁壘", subtitle: "Armor reduces every direct hit.", subtitleZh: "護甲會削減每次直接傷害。", enemies: ["boar", "thornStag", "rhino"], xp: 86, arc: 1 },
    { title: "Stone Tracks", titleZh: "磐石足跡", subtitle: "Break armor before the heavy strike.", subtitleZh: "在重擊前突破護甲。", enemies: ["thornStag", "viper", "behemoth"], xp: 94, arc: 1 },
    { title: "Stoneback Hollow", titleZh: "磐背凹谷", subtitle: "Boss: armor thickens at each phase.", subtitleZh: "首領：每階段都會強化護甲。", enemies: ["thornStag", "behemoth", "stonebackBoss"], xp: 115, arc: 1, boss: true },
    { title: "Ironroot Gate", titleZh: "鐵根之門", subtitle: "Counter stances punish careless attacks.", subtitleZh: "反擊架勢會懲罰盲目攻擊。", enemies: ["rhino", "ironJackal", "bear"], xp: 122, arc: 2 },
    { title: "Hammer Run", titleZh: "鍛槌通道", subtitle: "Exhaust raises one card's next cost.", subtitleZh: "疲勞會提高一張牌的下次消耗。", enemies: ["ironJackal", "rhino", "behemoth"], xp: 130, arc: 2 },
    { title: "Rootwork Forge", titleZh: "根工鍛坊", subtitle: "Guard through counters, then burst.", subtitleZh: "先防住反擊，再集中爆發。", enemies: ["bear", "ironJackal", "rhino"], xp: 138, arc: 2 },
    { title: "Warden Steps", titleZh: "守衛階梯", subtitle: "Armor and riposte overlap.", subtitleZh: "護甲與反擊交錯出現。", enemies: ["thornStag", "ironJackal", "behemoth"], xp: 146, arc: 2 },
    { title: "Ironroot Citadel", titleZh: "鐵根堡壘", subtitle: "Boss: stronger counters after each phase.", subtitleZh: "首領：每階段反擊都會加強。", enemies: ["ironJackal", "rhino", "ironrootBoss"], xp: 170, arc: 2, boss: true },
    { title: "Amber Footpath", titleZh: "琥珀獸徑", subtitle: "Haste skips through intent patterns.", subtitleZh: "加速會跳躍敵人的意圖順序。", enemies: ["tiger", "amberLynx", "viper"], xp: 178, arc: 3 },
    { title: "Hunter's Mark", titleZh: "獵手標記", subtitle: "Play the marked card or suffer damage.", subtitleZh: "及時打出標記牌，否則會受傷。", enemies: ["amberLynx", "tiger", "ironJackal"], xp: 186, arc: 3 },
    { title: "Sunclaw Ridge", titleZh: "日爪山脊", subtitle: "Weak reduces your next attack.", subtitleZh: "虛弱會降低下一次攻擊。", enemies: ["tiger", "amberLynx", "bear"], xp: 194, arc: 3 },
    { title: "Predator Ring", titleZh: "獵獸環場", subtitle: "Marks and haste demand hand planning.", subtitleZh: "標記與加速要求預先規劃手牌。", enemies: ["amberLynx", "ironJackal", "tiger"], xp: 202, arc: 3 },
    { title: "Amber Hunt", titleZh: "琥珀大獵", subtitle: "Boss: phases accelerate the hunt.", subtitleZh: "首領：階段推進會加速追獵。", enemies: ["amberLynx", "tiger", "amberBoss"], xp: 230, arc: 3, boss: true },
    { title: "Mirecoil Bank", titleZh: "盤沼河岸", subtitle: "Regeneration rewards decisive damage.", subtitleZh: "再生迫使你集中輸出。", enemies: ["viper", "mireToad", "bear"], xp: 238, arc: 4 },
    { title: "Venom Pools", titleZh: "毒液池", subtitle: "Healing and poison race each other.", subtitleZh: "治療與中毒互相競速。", enemies: ["mireToad", "viper", "behemoth"], xp: 246, arc: 4 },
    { title: "Sinking Reeds", titleZh: "沉蘆濕地", subtitle: "Cleanse can erase a poison plan.", subtitleZh: "淨化會打亂中毒戰術。", enemies: ["viper", "mireToad", "rhino"], xp: 254, arc: 4 },
    { title: "Threefold Wake", titleZh: "三首甦醒", subtitle: "Weak, poison and healing combine.", subtitleZh: "虛弱、中毒與治療同時出現。", enemies: ["mireToad", "bear", "viper"], xp: 262, arc: 4 },
    { title: "Mirecoil Basin", titleZh: "盤沼深潭", subtitle: "Boss: each phase regenerates faster.", subtitleZh: "首領：每階段再生速度都會提高。", enemies: ["mireToad", "viper", "mirecoilBoss"], xp: 295, arc: 4, boss: true },
    { title: "Moon Archive", titleZh: "月影典藏", subtitle: "Seals temporarily disable one card type.", subtitleZh: "封印會暫時停用一種卡牌類型。", enemies: ["archiveOwl", "rhino", "tiger"], xp: 303, arc: 5 },
    { title: "Silent Index", titleZh: "寂靜索引", subtitle: "Build turns around rotating seals.", subtitleZh: "配合輪替封印調整出牌順序。", enemies: ["archiveOwl", "ironJackal", "bear"], xp: 311, arc: 5 },
    { title: "Lunar Stacks", titleZh: "月典書塔", subtitle: "Defense and utility seals alternate.", subtitleZh: "防禦與功能封印交替出現。", enemies: ["archiveOwl", "mireToad", "rhino"], xp: 319, arc: 5 },
    { title: "Keeper's Seal", titleZh: "守藏封印", subtitle: "All three card types are tested.", subtitleZh: "三種卡牌類型都會受到考驗。", enemies: ["archiveOwl", "amberLynx", "behemoth"], xp: 327, arc: 5 },
    { title: "Archive Heart", titleZh: "典藏核心", subtitle: "Boss: every phase changes the forbidden type.", subtitleZh: "首領：每階段都會改變禁用類型。", enemies: ["archiveOwl", "bear", "moonBoss"], xp: 365, arc: 5, boss: true },
    { title: "Crownmist Verge", titleZh: "冠霧邊界", subtitle: "Curses occupy draws until cleansed.", subtitleZh: "詛咒會占據抽牌，直到被清除。", enemies: ["crownWolf", "archiveOwl", "viper"], xp: 373, arc: 6 },
    { title: "Veiled Court", titleZh: "迷霧王庭", subtitle: "Fog conceals the next safe rhythm.", subtitleZh: "濃霧會遮蔽下一輪安全節奏。", enemies: ["crownWolf", "amberLynx", "mireToad"], xp: 381, arc: 6 },
    { title: "Triad Ward", titleZh: "三相結界", subtitle: "Use attack, defense and utility to break wards.", subtitleZh: "依序使用攻擊、防禦與功能牌破除結界。", enemies: ["archiveOwl", "crownWolf", "behemoth"], xp: 389, arc: 6 },
    { title: "Monarch Stair", titleZh: "獸王長階", subtitle: "Every prior mechanic returns together.", subtitleZh: "所有先前機制同時回歸。", enemies: ["ironJackal", "mireToad", "crownWolf"], xp: 397, arc: 6 },
    { title: "Mist Crown", titleZh: "霧冠王座", subtitle: "Final Boss: wards, curses and rotating seals.", subtitleZh: "最終首領：結界、詛咒與輪替封印。", enemies: ["crownWolf", "archiveOwl", "mistCrownBoss"], xp: 450, arc: 6, boss: true },
  ];
  const missionCopyEs = [
    ["Sendero Brumoso", "Interpreta intenciones sencillas de ataque y defensa."],
    ["Bifurcación de Zarzas", "El veneno cambia cuál es el turno seguro."],
    ["Muralla de Musgo", "La armadura reduce cada golpe directo."],
    ["Huellas de Piedra", "Rompe la armadura antes del golpe pesado."],
    ["Hondonada Lomo de Piedra", "Jefe: la armadura se refuerza en cada fase."],
    ["Puerta Raíz de Hierro", "Las posturas de contraataque castigan los ataques descuidados."],
    ["Paso del Martillo", "El agotamiento aumenta el próximo coste de una carta."],
    ["Forja de Raíces", "Defiéndete de los contraataques y después concentra el daño."],
    ["Escaleras del Guardián", "Armadura y contraataque se superponen."],
    ["Ciudadela Raíz de Hierro", "Jefe: los contraataques se fortalecen en cada fase."],
    ["Senda Ámbar", "La rapidez salta pasos del patrón de intenciones."],
    ["Marca del Cazador", "Juega la carta marcada o recibe daño."],
    ["Cresta Garra Solar", "La debilidad reduce tu próximo ataque."],
    ["Círculo de Depredadores", "Las marcas y la rapidez exigen planificar la mano."],
    ["Gran Cacería Ámbar", "Jefe: las fases aceleran la cacería."],
    ["Orilla Espiral del Pantano", "La regeneración premia el daño decisivo."],
    ["Charcas Venenosas", "La curación y el veneno compiten entre sí."],
    ["Juncos Hundidos", "La purificación puede borrar un plan de veneno."],
    ["Estela Triple", "Debilidad, veneno y curación se combinan."],
    ["Cuenca Espiral del Pantano", "Jefe: cada fase regenera más rápido."],
    ["Archivo Lunar", "Los sellos desactivan temporalmente un tipo de carta."],
    ["Índice Silencioso", "Adapta tus turnos a los sellos rotatorios."],
    ["Torres de Tomos Lunares", "Los sellos de defensa y táctica se alternan."],
    ["Sello del Custodio", "Se ponen a prueba los tres tipos de carta."],
    ["Corazón del Archivo", "Jefe: cada fase cambia el tipo prohibido."],
    ["Frontera de la Niebla Coronada", "Las maldiciones ocupan robos hasta que las eliminas."],
    ["Corte Velada", "La niebla oculta el siguiente ritmo seguro."],
    ["Barrera Triple", "Usa ataque, defensa y táctica para romper barreras."],
    ["Escalera del Monarca", "Todas las mecánicas anteriores regresan juntas."],
    ["Corona de Niebla", "Jefe final: barreras, maldiciones y sellos rotatorios."]
  ];
  missionTemplates.forEach((mission, index) => {
    [mission.titleEs, mission.subtitleEs] = missionCopyEs[index];
  });
  let profile = normalizeProfile();
  let state = {};
  let isAutoPositioningStage = false;
  let leaveDecisionOpen = false;
  const combatFeedbackTimers = new Map();

  function clamp(num, min, max) {
    return Math.max(min, Math.min(max, num));
  }

  function boundedWhole(value, fallback, minimum, maximum = Number.MAX_SAFE_INTEGER) {
    const number = typeof value === "string" && value.trim() === "" ? Number.NaN : Number(value);
    return Number.isFinite(number) && Number.isInteger(number)
      ? clamp(number, minimum, maximum)
      : fallback;
  }

  function xpToNext(level) {
    return 90 + (level - 1) * 35;
  }

  function levelHpBonus() {
    return Math.max(0, (profile.level - 1) * 2);
  }

  function normalizeCountMap(source, allowed, defaults = {}, maximum = Number.MAX_SAFE_INTEGER) {
    const result = { ...defaults };
    const values = source && typeof source === "object" && !Array.isArray(source) ? source : {};
    Object.keys(values).forEach((key) => {
      if (!allowed.includes(key)) return;
      const fallback = result[key] || 0;
      const count = boundedWhole(values[key], fallback, 0, maximum);
      if (count > 0) result[key] = Math.max(fallback, count);
    });
    return result;
  }

  function normalizeProfile(data = {}) {
    const source = data && typeof data === "object" && !Array.isArray(data) ? data : {};
    const level = boundedWhole(source.level, 1, 1, 99);
    const collection = normalizeCountMap(source.collection, permanentCardIds, starterCollection);
    const gear = normalizeCountMap(source.gear, Object.keys(gearDb), {}, maxGearRank);
    const equippedCounts = {};
    const equippedCards = Array.isArray(source.equippedCards)
      ? source.equippedCards.filter((id) => {
          if (typeof id !== "string" || !permanentCardIds.includes(id)) return false;
          equippedCounts[id] = (equippedCounts[id] || 0) + 1;
          return equippedCounts[id] <= (collection[id] || 0);
        }).slice(0, maxEquippedCards)
      : ["sky-hawk", "cheetah-sprint"].filter((id) => collection[id] > 0);
    const equippedGear = gearDb[source.equippedGear] && gear[source.equippedGear] > 0 ? source.equippedGear : "";
    return {
      amuletUnlocked: source.amuletUnlocked === true,
      level,
      xp: boundedWhole(source.xp, 0, 0, xpToNext(level) - 1),
      coins: boundedWhole(source.coins, 0, 0),
      collection,
      equippedCards,
      gear,
      equippedGear,
      unlockedMission: boundedWhole(source.unlockedMission, 1, 1, maxMission),
      bestMission: boundedWhole(source.bestMission, 1, 1, maxMission),
      selectedMission: boundedWhole(source.selectedMission, 1, 1, maxMission),
    };
  }

  function loadLocalState() {
    try {
      profile = normalizeProfile(JSON.parse(readStorage(saveKey) || "{}"));
    } catch {
      profile = normalizeProfile();
    }
    if (profile.selectedMission > profile.unlockedMission) profile.selectedMission = profile.unlockedMission;
    saveLocalState();
  }

  function saveLocalState() {
    writeStorage(saveKey, JSON.stringify(profile));
  }

  function getLocale() {
    const stored = readStorage(localeKey);
    return window.WonderI18n?.actualLocale?.() || window.WonderI18n?.locale?.() || (["zh-Hant", "zh-Hans", "es"].includes(stored) ? stored : "en");
  }

  function localizeChinese(value, locale = getLocale()) {
    if (locale !== "zh-Hans") return value;
    return window.WonderI18n?.simplifyChineseText?.(value) || value;
  }

  function t(key, params = {}) {
    const locale = getLocale();
    const zhRuntimeFallback = {};
    const sourceLocale = locale === "zh-Hans" ? "zh-Hant" : locale;
    const raw = (sourceLocale === "zh-Hant" ? zhRuntimeFallback[key] : "") || text[sourceLocale]?.[key] || text.en[key] || key;
    const interpolated = Object.entries(params).reduce((str, [k, v]) => str.replaceAll(`{${k}}`, String(v)), raw);
    return localizeChinese(interpolated, locale);
  }

  const leaveText = {
    en: {
      title: "Leave this mission?",
      message: ({ mission, battle, hp, maxHp, hand }) => `Mission ${mission}, Battle ${battle}/3: ${hp}/${maxHp} HP and ${hand} cards in hand. Leaving ends this mission and discards its current Battle progress and mission-only Draft cards. Saved level, XP, Beast Coins, collection, equipment, and unlocked missions stay safe.`,
      keep: "Keep Playing",
      leave: "Leave Mission",
    },
    "zh-Hant": {
      title: "要離開這次任務嗎？",
      message: ({ mission, battle, hp, maxHp, hand }) => `任務 ${mission}、戰鬥 ${battle}/3：生命 ${hp}/${maxHp}，手牌 ${hand} 張。離開會結束本次任務，並失去目前戰鬥進度與本次任務的選牌卡；已儲存的等級、XP、野獸金幣、卡冊、裝備與已解鎖任務都會保留。`,
      keep: "繼續戰鬥",
      leave: "離開任務",
    },
    "zh-Hans": {
      title: "要离开这次任务吗？",
      message: ({ mission, battle, hp, maxHp, hand }) => `任务 ${mission}、战斗 ${battle}/3：生命 ${hp}/${maxHp}，手牌 ${hand} 张。离开会结束本次任务，并失去当前战斗进度与本次任务的选牌卡；已保存的等级、XP、野兽金币、卡册、装备与已解锁任务都会保留。`,
      keep: "继续战斗",
      leave: "离开任务",
    },
    es: {
      title: "¿Salir de esta misión?",
      message: ({ mission, battle, hp, maxHp, hand }) => `Misión ${mission}, batalla ${battle}/3: ${hp}/${maxHp} PV y ${hand} cartas en la mano. Salir termina esta misión y descarta el progreso de la batalla y las cartas elegidas solo para esta misión. El nivel, XP, Monedas Bestia, colección, equipo y misiones desbloqueadas permanecen.`,
      keep: "Seguir jugando",
      leave: "Salir de la misión",
    },
    ja: {
      title: "このミッションを離れますか？",
      message: ({ mission, battle, hp, maxHp, hand }) => `ミッション ${mission}、バトル ${battle}/3：HP ${hp}/${maxHp}、手札 ${hand} 枚。離れるとこのミッションは終了し、現在のバトル進行とミッション限定のドラフトカードは失われます。保存済みのレベル、XP、ビーストコイン、コレクション、装備、解放済みミッションは保持されます。`,
      keep: "プレイを続ける",
      leave: "ミッションを離れる",
    },
    ko: {
      title: "이 미션에서 나가시겠어요?",
      message: ({ mission, battle, hp, maxHp, hand }) => `미션 ${mission}, 전투 ${battle}/3: HP ${hp}/${maxHp}, 손에 든 카드 ${hand}장. 나가면 이 미션이 종료되고 현재 전투 진행도와 미션 전용 드래프트 카드를 잃습니다. 저장된 레벨, XP, 야수 코인, 컬렉션, 장비, 해제한 미션은 유지됩니다.`,
      keep: "계속 플레이",
      leave: "미션 나가기",
    },
    "pt-BR": {
      title: "Sair desta missão?",
      message: ({ mission, battle, hp, maxHp, hand }) => `Missão ${mission}, batalha ${battle}/3: ${hp}/${maxHp} PV e ${hand} cartas na mão. Sair encerra esta missão e descarta o progresso da batalha atual e as cartas de Draft exclusivas desta missão. Seu nível, XP, Moedas de Fera, coleção, equipamento e missões desbloqueadas salvos permanecem seguros.`,
      keep: "Continuar jogando",
      leave: "Sair da missão",
    },
    fr: {
      title: "Quitter cette mission ?",
      message: ({ mission, battle, hp, maxHp, hand }) => `Mission ${mission}, combat ${battle}/3 : ${hp}/${maxHp} PV et ${hand} cartes en main. Quitter met fin à cette mission et efface la progression du combat actuel ainsi que les cartes de Draft propres à cette mission. Le niveau, l’XP, les Pièces de Bête, la collection, l’équipement et les missions débloquées enregistrés restent intacts.`,
      keep: "Continuer à jouer",
      leave: "Quitter la mission",
    },
    de: {
      title: "Diese Mission verlassen?",
      message: ({ mission, battle, hp, maxHp, hand }) => `Mission ${mission}, Kampf ${battle}/3: ${hp}/${maxHp} LP und ${hand} Karten auf der Hand. Beim Verlassen endet diese Mission; der aktuelle Kampffortschritt und missionsgebundene Draft-Karten gehen verloren. Gespeicherte Stufe, EP, Bestienmünzen, Sammlung, Ausrüstung und freigeschaltete Missionen bleiben erhalten.`,
      keep: "Weiterspielen",
      leave: "Mission verlassen",
    },
    it: {
      title: "Abbandonare questa missione?",
      message: ({ mission, battle, hp, maxHp, hand }) => `Missione ${mission}, battaglia ${battle}/3: ${hp}/${maxHp} PS e ${hand} carte in mano. Uscire termina questa missione e annulla i progressi della battaglia attuale e le carte Draft valide solo per questa missione. Livello, XP, Monete Bestia, collezione, equipaggiamento e missioni sbloccate salvati restano al sicuro.`,
      keep: "Continua a giocare",
      leave: "Abbandona missione",
    },
    ru: {
      title: "Покинуть эту миссию?",
      message: ({ mission, battle, hp, maxHp, hand }) => `Миссия ${mission}, бой ${battle}/3: ${hp}/${maxHp} ОЗ и ${hand} карт в руке. Выход завершит миссию и сбросит прогресс текущего боя и выбранные только для этой миссии карты. Сохранённые уровень, опыт, монеты зверей, коллекция, снаряжение и открытые миссии останутся в безопасности.`,
      keep: "Продолжить игру",
      leave: "Покинуть миссию",
    },
    hi: {
      title: "यह मिशन छोड़ें?",
      message: ({ mission, battle, hp, maxHp, hand }) => `मिशन ${mission}, युद्ध ${battle}/3: ${hp}/${maxHp} HP और हाथ में ${hand} कार्ड। छोड़ने पर यह मिशन समाप्त हो जाएगा तथा मौजूदा युद्ध की प्रगति और केवल इस मिशन के ड्राफ़्ट कार्ड मिट जाएँगे। सहेजा गया स्तर, XP, बीस्ट कॉइन, संग्रह, उपकरण और अनलॉक किए गए मिशन सुरक्षित रहेंगे।`,
      keep: "खेलना जारी रखें",
      leave: "मिशन छोड़ें",
    },
    ar: {
      title: "هل تريد مغادرة هذه المهمة؟",
      message: ({ mission, battle, hp, maxHp, hand }) => `المهمة ${mission}، المعركة ${battle}/3: نقاط الصحة ${hp}/${maxHp} و${hand} بطاقات في يدك. تؤدي المغادرة إلى إنهاء هذه المهمة وحذف تقدم المعركة الحالية وبطاقات الاختيار الخاصة بهذه المهمة. سيبقى المستوى ونقاط الخبرة وعملات الوحوش والمجموعة والمعدات والمهام المفتوحة المحفوظة بأمان.`,
      keep: "متابعة اللعب",
      leave: "مغادرة المهمة",
    },
  };

  function leaveCoveredLayers() {
    return [
      nodes.gamePanel.querySelector(".hud-row"),
      nodes.gamePanel.querySelector(".battlefield"),
      nodes.gamePanel.querySelector(".action-area"),
    ].filter(Boolean);
  }

  function updateLeaveDecisionCopy() {
    const copy = leaveText[getLocale()] || leaveText.en;
    nodes.leaveTitle.textContent = copy.title;
    nodes.leaveMessage.textContent = copy.message({
      mission: state.mission,
      battle: state.battle,
      hp: Math.max(0, Math.ceil(state.playerHp || 0)),
      maxHp: Math.max(1, Math.ceil(state.playerMaxHp || 1)),
      hand: state.hand?.length || 0,
    });
    nodes.leaveKeepBtn.textContent = copy.keep;
    nodes.leaveConfirmBtn.textContent = copy.leave;
  }

  function setLeaveDecision(active, { restoreFocus = true, resume = true } = {}) {
    if (active) {
      if (leaveDecisionOpen || nodes.gamePanel.classList.contains("hidden") || !state.enemy || !nodes.draftPanel.classList.contains("hidden") || !nodes.resultPanel.classList.contains("hidden")) return;
      leaveDecisionOpen = true;
      suspendBackgroundBattle();
      updateLeaveDecisionCopy();
      nodes.leavePanel.classList.remove("hidden");
    } else {
      const wasOpen = leaveDecisionOpen;
      leaveDecisionOpen = false;
      nodes.leavePanel.classList.add("hidden");
      if (wasOpen && resume) resumeBackgroundBattle();
      if (wasOpen && !resume) {
        cancelBattleTransitions();
        backgroundSuspended = document.hidden;
      }
    }
    leaveCoveredLayers().forEach((layer) => {
      layer.inert = active;
      if (active) layer.setAttribute("aria-hidden", "true");
      else layer.removeAttribute("aria-hidden");
    });
    if (active) requestAnimationFrame(() => nodes.leaveKeepBtn.focus({ preventScroll: true }));
    else if (restoreFocus && state.enemy) nodes.menuBtn.focus({ preventScroll: true });
  }

  function getMission(id = profile.selectedMission) {
    return missionTemplates[clamp(id, 1, maxMission) - 1];
  }

  function missionCoinReward(missionId = profile.selectedMission) {
    const mission = clamp(Number(missionId) || 1, 1, maxMission);
    return (16 + mission * 3) * 2 + (40 + mission * 8);
  }

  function nextMissionLabel(missionId) {
    const locale = getLocale();
    if (locale === "es") return `Siguiente misión: ${missionId}`;
    return locale === "en" ? `Next Mission: ${missionId}` : localizeChinese(`下一關：任務 ${missionId}`, locale);
  }

  function missionTitle(id) {
    const mission = getMission(id);
    const locale = getLocale();
    if (locale === "es") return mission.titleEs;
    return locale === "en" ? mission.title : localizeChinese(mission.titleZh, locale);
  }

  function missionSubtitle(id) {
    const mission = getMission(id);
    const locale = getLocale();
    if (locale === "es") return mission.subtitleEs;
    return locale === "en" ? mission.subtitle : localizeChinese(mission.subtitleZh, locale);
  }

  function scaledEnemy(enemyKey, missionId) {
    const base = enemyCatalog[enemyKey];
    const scale = 1 + (missionId - 1) * 0.045;
    return {
      ...base,
      maxHp: Math.round(base.hp * scale),
      intents: base.intents.map((intent) => ({
        ...intent,
        val: ["buff", "fog", "cleanse", "seal", "armor", "exhaust", "curse"].includes(intent.type) ? intent.val : Math.max(1, Math.round(intent.val * scale)),
      })),
    };
  }

  function currentEnemy() {
    const mission = getMission(state.mission);
    const enemy = scaledEnemy(mission.enemies[state.battle - 1], state.mission);
    if (state.battle !== 3 || mission.boss) return enemy;
    enemy.isElite = true;
    enemy.name = `Elite ${enemy.name}`;
    enemy.nameZh = `菁英${enemy.nameZh}`;
    enemy.nameEs = `Élite ${enemy.nameEs}`;
    if (mission.arc === 1) enemy.armor = (enemy.armor || 0) + 1;
    if (mission.arc === 2) enemy.riposteBonus = 2;
    if (mission.arc === 3) enemy.haste = true;
    if (mission.arc === 4) enemy.regen = (enemy.regen || 0) + 2;
    if (mission.arc === 5) enemy.armor = (enemy.armor || 0) + 2;
    if (mission.arc === 6) enemy.ward = 3;
    return enemy;
  }

  function enemyName(enemy) {
    const locale = getLocale();
    if (locale === "es") return enemy.nameEs || enemy.name;
    return locale === "en" ? enemy.name : localizeChinese(enemy.nameZh, locale);
  }

  function missionScout(id = profile.selectedMission) {
    const mission = getMission(id);
    const enemies = mission.enemies.map((enemyId) => enemyName(enemyCatalog[enemyId])).join(" → ");
    const firstEnemy = enemyCatalog[mission.enemies[0]];
    const firstIntent = firstEnemy.intents[0];
    const firstAction = ["buff", "fog", "cleanse"].includes(firstIntent.type)
      ? t(`intent_${firstIntent.type}`)
      : firstIntent.type === "seal"
        ? t("intent_seal", { type: cardTypeLabel(firstIntent.seal) })
        : t(`intent_${firstIntent.type}`, { amount: firstIntent.val });
    return t("missionScout", { enemies, first: `${enemyName(firstEnemy)} ${firstAction}` });
  }

  function syncPublicMetadata(locale = getLocale()) {
    const metadata = metaText[locale] || metaText.en;
    const description = document.querySelector("meta[name='description']");
    const ogDescription = document.querySelector("meta[property='og:description']");
    if (description?.content !== metadata.description) description?.setAttribute("content", metadata.description);
    if (ogDescription?.content !== metadata.ogDescription) ogDescription?.setAttribute("content", metadata.ogDescription);
  }

  function translateUI() {
    clearAmuletConfirmation();
    const locale = getLocale();
    document.documentElement.lang = locale;
    const pageTitle = `${t("title")} - WeightPlay`;
    document.title = pageTitle;
    syncPublicMetadata(locale);
    requestAnimationFrame(() => syncPublicMetadata(locale));
    window.setTimeout(() => syncPublicMetadata(locale), 180);
    window.setTimeout(() => syncPublicMetadata(locale), 1200);
    document.querySelector("meta[property='og:title']")?.setAttribute("content", pageTitle);
    document.querySelectorAll("[data-ui]").forEach((el) => {
      el.textContent = t(el.dataset.ui);
    });
    document.querySelectorAll("[data-aria]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.aria)));
    nodes.localeSelect.querySelector('option[value="en"]').textContent = "English";
    nodes.localeSelect.querySelector('option[value="zh-Hant"]').textContent = "\u7e41\u9ad4\u4e2d\u6587";
    nodes.localeSelect.querySelector('option[value="zh-Hans"]').textContent = "\u7b80\u4f53\u4e2d\u6587";
    nodes.localeSelect.value = getLocale();
    updateDiamondShopUI();
    renderProgressUI();
    renderCollectionUI();
    if (!nodes.gamePanel.classList.contains("hidden") && state.enemy) {
      nodes.enemyName.textContent = enemyName(state.enemy);
      displayIntent(state.enemy.intents[state.enemyIntentIndex]);
    }
    if (leaveDecisionOpen) updateLeaveDecisionCopy();
  }

  function updateDiamondShopUI() {
    const wallet = window.WeightPlayWallet?.read() || { diamonds: 0 };
    const resultingBalance = Math.max(0, wallet.diamonds - amuletCost);
    nodes.diamondBalance.textContent = wallet.diamonds;
    nodes.amuletBtn.querySelector("strong").textContent = t("amuletName");
    nodes.amuletBtn.querySelector("small").textContent = profile.amuletUnlocked ? t("amuletOwned") : t("amuletEffect");
    if (profile.amuletUnlocked) {
      clearAmuletConfirmation();
      nodes.amuletStatus.textContent = t("amuletOwned");
      nodes.amuletBtn.disabled = true;
      nodes.amuletBtn.querySelector("b").style.display = "none";
    } else {
      nodes.amuletStatus.textContent = wallet.diamonds < amuletCost
        ? t("amuletNeedExact", { cost: amuletCost, balance: wallet.diamonds })
        : amuletConfirmPending
          ? t("amuletConfirm", { balance: wallet.diamonds, result: resultingBalance })
          : "";
      nodes.amuletBtn.disabled = wallet.diamonds < amuletCost;
      nodes.amuletBtn.classList.toggle("is-confirming", amuletConfirmPending);
      nodes.amuletBtn.setAttribute("aria-label", amuletConfirmPending
        ? t("amuletConfirmLabel", { cost: amuletCost, balance: wallet.diamonds, result: resultingBalance })
        : `${t("amuletName")}. ${t("amuletEffect")} ${t("amuletNeedExact", { cost: amuletCost, balance: wallet.diamonds })}`);
      nodes.amuletBtn.querySelector("b").style.display = "flex";
      nodes.amuletBtn.querySelector("b span").textContent = amuletCost;
    }
  }

  function cardName(cardId) {
    return t(cardDb[cardId]?.nameKey || cardId);
  }

  function gearName(gearId) {
    return t(gearDb[gearId]?.nameKey || gearId);
  }

  function gearRank(gearId) {
    return clamp(profile.gear[gearId] || 0, 0, maxGearRank);
  }

  function gearBonus(gearId) {
    const gear = gearDb[gearId] || {};
    const rank = gearRank(gearId);
    return {
      hp: (gear.hp || 0) * rank,
      energy: (gear.energy || 0) * rank,
      block: (gear.block || 0) * rank,
    };
  }

  function gearBonusText(gearId) {
    const gear = gearDb[gearId] || {};
    const bonus = gearBonus(gearId);
    const amount = bonus.hp || bonus.energy || bonus.block || 0;
    return t(gear.statKey, { amount });
  }

  function equippedCardCount(cardId) {
    return profile.equippedCards.filter((id) => id === cardId).length;
  }

  function canEquipCard(cardId) {
    return (profile.collection[cardId] || 0) > equippedCardCount(cardId) && profile.equippedCards.length < maxEquippedCards;
  }

  function getDeckComposition() {
    return [...baseDeck, ...profile.equippedCards].reduce((summary, cardId) => {
      const type = cardDb[cardId]?.type;
      if (type && Object.hasOwn(summary, type)) summary[type] += 1;
      return summary;
    }, { attack: 0, defense: 0, utility: 0 });
  }

  function restoreLoadoutFocus(cardId, target) {
    window.requestAnimationFrame(() => {
      const matches = [...target.querySelectorAll(`[data-card-id="${cardId}"]`)];
      const button = matches.find((candidate) => !candidate.disabled) || matches.at(-1);
      button?.focus();
    });
  }

  function restoreGearFocus(gearId) {
    window.requestAnimationFrame(() => {
      nodes.gearGrid.querySelector(`[data-gear-id="${gearId}"]`)?.focus();
    });
  }

  function renderCollectionUI() {
    if (!nodes.collectionGrid) return;
    nodes.profileCoinText.textContent = String(profile.coins);
    nodes.packCost.textContent = String(packCost);
    nodes.packBtn.disabled = profile.coins < packCost;
    nodes.packBtn.setAttribute("aria-label", profile.coins < packCost
      ? t("packInsufficientLabel", { cost: packCost, balance: profile.coins })
      : t("packActionLabel", { cost: packCost, balance: profile.coins, result: profile.coins - packCost }));
    if (profile.coins < packCost && !nodes.packStatus.textContent) {
      nodes.packStatus.textContent = t("packNeed", { cost: packCost });
    }
    nodes.deckBuildCount.textContent = t("equippedCount", { count: profile.equippedCards.length, max: maxEquippedCards });
    const composition = getDeckComposition();
    nodes.deckAnalysis.textContent = t("deckAnalysis", {
      total: baseDeck.length + profile.equippedCards.length,
      attack: composition.attack,
      defense: composition.defense,
      utility: composition.utility,
    });
    nodes.deckSlots.innerHTML = "";
    if (!profile.equippedCards.length) {
      const empty = document.createElement("span");
      empty.className = "empty-slot";
      empty.textContent = t("collectionHint");
      nodes.deckSlots.appendChild(empty);
    } else {
      profile.equippedCards.forEach((cardId, index) => {
        const card = cardDb[cardId];
        const button = document.createElement("button");
        button.type = "button";
        button.className = `mini-card ${card.type}`;
        button.dataset.cardId = cardId;
        button.setAttribute("aria-label", t("removeCardLabel", { card: cardName(cardId), slot: index + 1, count: profile.equippedCards.length }));
        button.innerHTML = `<img src="${asset(card.image)}" alt=""><span>${cardName(cardId)}</span><small>${t("unequipCard")}</small>`;
        button.addEventListener("click", (event) => {
          const keyboardActivation = event.detail === 0;
          profile.equippedCards.splice(index, 1);
          saveLocalState();
          renderCollectionUI();
          if (keyboardActivation) restoreLoadoutFocus(cardId, nodes.collectionGrid);
          window.WonderSound?.play("click");
        });
        nodes.deckSlots.appendChild(button);
      });
    }

    nodes.collectionGrid.innerHTML = "";
    permanentCardIds.forEach((cardId) => {
      const card = cardDb[cardId];
      const owned = profile.collection[cardId] || 0;
      const equipped = equippedCardCount(cardId);
      const canEquip = canEquipCard(cardId);
      const cardStatus = canEquip
        ? t("equipCard")
        : owned <= equipped && owned > 0
          ? t("allCopiesEquipped")
          : owned > 0
            ? t("deckFull")
            : t("lockedMission");
      const button = document.createElement("button");
      button.type = "button";
      button.className = `collection-card ${card.type}`;
      button.dataset.cardId = cardId;
      button.disabled = !canEquip;
      button.setAttribute("aria-label", `${cardName(cardId)} · ${t(card.descKey)} · ${t("ownedCount", { count: owned })} · ${t("equippedCount", { count: equipped, max: owned })} · ${cardStatus}`);
      button.innerHTML = `
        <img src="${asset(card.image)}" alt="">
        <strong>${cardName(cardId)}</strong>
        <small>${t("ownedCount", { count: owned })} / ${t("equippedCount", { count: equipped, max: owned })}</small>
        <span>${cardStatus}</span>
      `;
      button.addEventListener("click", (event) => {
        if (!canEquip) return;
        const keyboardActivation = event.detail === 0;
        profile.equippedCards.push(cardId);
        saveLocalState();
        renderCollectionUI();
        if (keyboardActivation) {
          restoreLoadoutFocus(cardId, canEquipCard(cardId) ? nodes.collectionGrid : nodes.deckSlots);
        }
        window.WonderSound?.play("click");
      });
      nodes.collectionGrid.appendChild(button);
    });

    nodes.gearGrid.innerHTML = "";
    const ownedGearIds = Object.keys(gearDb).filter((gearId) => (profile.gear[gearId] || 0) > 0);
    if (!ownedGearIds.length) {
      const empty = document.createElement("span");
      empty.className = "empty-slot";
      empty.textContent = t("gearNone");
      nodes.gearGrid.appendChild(empty);
    }
    ownedGearIds.forEach((gearId) => {
      const gear = gearDb[gearId];
      const isEquipped = profile.equippedGear === gearId;
      const button = document.createElement("button");
      button.type = "button";
      button.className = `gear-card${isEquipped ? " equipped" : ""}`;
      button.dataset.gearId = gearId;
      button.setAttribute("aria-pressed", String(isEquipped));
      button.setAttribute("aria-label", `${gearName(gearId)} · ${t("gearRank", { rank: gearRank(gearId), maxRank: maxGearRank })} · ${gearBonusText(gearId)} · ${isEquipped ? t("gearEquipped") : t("gearEquip")}`);
      button.innerHTML = `
        <img src="${asset(gear.image)}" alt="">
        <strong>${gearName(gearId)}</strong>
        <small>${t("gearRank", { rank: gearRank(gearId), maxRank: maxGearRank })} · ${gearBonusText(gearId)}</small>
        <span>${isEquipped ? t("gearEquipped") : t("gearEquip")}</span>
      `;
      button.addEventListener("click", (event) => {
        const keyboardActivation = event.detail === 0;
        profile.equippedGear = gearId;
        saveLocalState();
        renderCollectionUI();
        if (keyboardActivation) restoreGearFocus(gearId);
        window.WonderSound?.play("upgrade");
      });
      nodes.gearGrid.appendChild(button);
    });
  }

  function drawPack() {
    if (profile.coins < packCost) {
      nodes.packStatus.textContent = t("packNeed", { cost: packCost });
      window.WonderSound?.play("wrong");
      return;
    }
    profile.coins -= packCost;
    const upgradeableGear = Object.keys(gearDb).filter((gearId) => gearRank(gearId) < maxGearRank);
    const roll = Math.random();
    if (roll < 0.72 || !upgradeableGear.length) {
      const pool = permanentCardIds;
      awardPackCard(pool[Math.floor(Math.random() * pool.length)]);
    } else {
      awardPackGear(upgradeableGear[Math.floor(Math.random() * upgradeableGear.length)]);
    }
    saveLocalState();
    renderCollectionUI();
    window.WonderSound?.play("success");
  }

  function showPackReward(image, typeLabel, message) {
    if (!nodes.packStatus) return;
    nodes.packStatus.classList.remove("is-reveal");
    nodes.packStatus.replaceChildren();

    const art = document.createElement("span");
    art.className = "pack-reward-art";
    const img = document.createElement("img");
    img.src = asset(image);
    img.alt = "";
    art.appendChild(img);

    const copy = document.createElement("span");
    copy.className = "pack-reward-copy";
    const label = document.createElement("small");
    label.textContent = typeLabel;
    const detail = document.createElement("strong");
    detail.textContent = message;
    copy.append(label, detail);
    nodes.packStatus.append(art, copy);

    // Restart the short reveal motion even when two packs award the same item.
    void nodes.packStatus.offsetWidth;
    nodes.packStatus.classList.add("is-reveal");
  }

  function awardPackCard(cardId) {
    profile.collection[cardId] = (profile.collection[cardId] || 0) + 1;
    let message;
    if (canEquipCard(cardId)) {
      profile.equippedCards.push(cardId);
      message = t("packResultCardEquipped", { card: cardName(cardId) });
    } else {
      message = t("packResultCard", { card: cardName(cardId) });
    }
    showPackReward(cardDb[cardId].image, t("packRewardCardType"), message);
  }

  function awardPackGear(gearId) {
    profile.gear[gearId] = clamp((profile.gear[gearId] || 0) + 1, 1, maxGearRank);
    const shouldEquip = !profile.equippedGear;
    if (shouldEquip) profile.equippedGear = gearId;
    const message = profile.gear[gearId] > 1
      ? t("packDuplicate", { name: gearName(gearId), rank: gearRank(gearId), maxRank: maxGearRank })
      : shouldEquip
        ? t("packResultGearEquipped", { gear: gearName(gearId) })
        : t("packResultGear", { gear: gearName(gearId) });
    showPackReward(gearDb[gearId].image, t("packRewardGearType"), message);
  }

  function renderProgressUI() {
    if (!nodes.stageGrid) return;
    if (!Number.isInteger(browsedMission) || browsedMission < 1 || browsedMission > maxMission) browsedMission = profile.selectedMission;
    nodes.profileLevelText.textContent = String(profile.level);
    nodes.profileXpText.textContent = `${profile.xp}/${xpToNext(profile.level)}`;
    nodes.profileBestText.textContent = String(profile.bestMission);
    nodes.profileBonusText.textContent = t("profileBonus", { hp: levelHpBonus() });
    nodes.startBtn.textContent = `${t("startRun")} · ${t("missionLabel", { mission: profile.selectedMission })}`;
    nodes.stageGrid.innerHTML = "";

    getVisibleMissionIds().forEach((i) => {
      const unlocked = i <= profile.unlockedMission;
      const button = document.createElement("button");
      button.type = "button";
      button.className = `stage-card${profile.selectedMission === i ? " selected" : ""}`;
      button.disabled = !unlocked;
      button.dataset.mission = String(i);
      button.setAttribute("aria-pressed", profile.selectedMission === i ? "true" : "false");
      button.innerHTML = `
        <span>${t("missionLabel", { mission: i })}</span>
        <strong>${unlocked ? missionTitle(i) : t("lockedMission")}</strong>
        <small>${unlocked ? missionSubtitle(i) : ""}</small>
        <em>${unlocked ? `${t("missionReward", { xp: getMission(i).xp })} · ${t("missionCoins", { coins: missionCoinReward(i) })} · <span data-stage-action>${profile.selectedMission === i ? t("missionSelectedCard") : t("startMissionCard")}</span>` : ""}</em>
      `;
      button.addEventListener("click", () => {
        if (!unlocked) return;
        profile.selectedMission = i;
        saveLocalState();
        window.WonderSound?.play("click");
        startRun();
      });
      nodes.stageGrid.appendChild(button);
    });
    updateStageSelectionUI();
    scrollStageToSelected();
  }

  function getVisibleMissionIds() {
    return Array.from({ length: maxMission }, (_, index) => index + 1);
  }

  function updateStageSelectionUI() {
    if (!nodes.stageGrid) return;
    nodes.startBtn.textContent = `${t("startRun")} · ${t("missionLabel", { mission: profile.selectedMission })}`;
    if (nodes.selectedMissionSummary) {
      const missionLabel = t("missionLabel", { mission: profile.selectedMission });
      const xp = getMission(profile.selectedMission).xp;
      const coins = missionCoinReward(profile.selectedMission);
      const gear = profile.equippedGear ? `${gearName(profile.equippedGear)} ${t("gearRank", { rank: gearRank(profile.equippedGear), maxRank: maxGearRank })}` : t("noGear");
      nodes.selectedMissionSummary.innerHTML = `
        <span>${t("selectedMissionTitle")}</span>
        <strong>${missionLabel}: ${missionTitle(profile.selectedMission)}</strong>
        <small>${t("selectedMissionReady", { mission: missionLabel, xp, coins })}</small>
        <small>${missionScout(profile.selectedMission)}</small>
        <small>${t("loadoutReady", { cards: profile.equippedCards.length, max: maxEquippedCards, gear })}</small>
      `;
    }
    nodes.stageGrid.querySelectorAll(".stage-card").forEach((card) => {
      const selected = Number(card.dataset.mission) === profile.selectedMission;
      const centered = Number(card.dataset.mission) === browsedMission;
      card.classList.toggle("selected", selected);
      card.classList.toggle("centered", centered);
      card.setAttribute("aria-pressed", selected ? "true" : "false");
      if (centered) card.setAttribute("aria-current", "true");
      else card.removeAttribute("aria-current");
      const action = card.querySelector("[data-stage-action]");
      if (action) action.textContent = selected ? t("missionSelectedCard") : t("startMissionCard");
    });
  }

  function scrollStageToSelected() {
    if (!nodes.stageGrid) return;
    const selected = nodes.stageGrid.querySelector(`.stage-card[data-mission="${browsedMission || profile.selectedMission}"]`);
    if (!selected) return;
    isAutoPositioningStage = true;
    requestAnimationFrame(() => {
      // Work in the rail's logical coordinates. scrollIntoView() uses transformed
      // screen geometry and can choose the wrong card after the Stage Canvas scales.
      const target = selected.offsetLeft + selected.offsetWidth / 2 - nodes.stageGrid.clientWidth / 2;
      nodes.stageGrid.scrollTo({ left: Math.max(0, target), behavior: "auto" });
      // The native scroll event can arrive after the next animation frame. Keep
      // it marked as programmatic long enough that it cannot overwrite the
      // saved selection with a neighboring card.
      window.setTimeout(() => {
        isAutoPositioningStage = false;
        // A player can begin swiping before the initial programmatic settle
        // finishes. Scroll events during that guard are intentionally ignored,
        // so reconcile the card that is actually centered once the guard lifts.
        selectNearestVisibleStage();
      }, 220);
    });
  }

  function selectNearestVisibleStage() {
    stageScrollTimer = 0;
    if (nodes.stagePanel?.classList.contains("hidden")) return;
    if (!nodes.stageGrid) return;
    const missionView = nodes.stageGrid.closest('[data-stage-view="missions"]');
    if (!missionView?.classList.contains("is-active") || nodes.stageGrid.clientWidth <= 0) return;
    const cards = [...nodes.stageGrid.querySelectorAll(".stage-card")];
    if (!cards.length) return;
    const gridBox = nodes.stageGrid.getBoundingClientRect();
    const center = gridBox.left + gridBox.width / 2;
    const nearest = cards.reduce((best, card) => {
      const box = card.getBoundingClientRect();
      const distance = Math.abs(box.left + box.width / 2 - center);
      return !best || distance < best.distance ? { card, distance } : best;
    }, null)?.card;
    const mission = Number(nearest?.dataset.mission);
    if (!mission || mission === browsedMission) return;
    browsedMission = clamp(mission, 1, maxMission);
    if (!nearest.disabled && mission !== profile.selectedMission) {
      profile.selectedMission = clamp(mission, 1, profile.unlockedMission);
      saveLocalState();
    }
    updateStageSelectionUI();
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

  function showCombatFeedback(message, tone = "damage") {
    if (!nodes.battlefield) return;
    const feedback = document.createElement("span");
    feedback.className = `combat-feedback ${tone}`;
    feedback.textContent = message;
    feedback.setAttribute("aria-hidden", "true");
    nodes.battlefield.appendChild(feedback);
    const timer = window.setTimeout(() => {
      combatFeedbackTimers.delete(feedback);
      feedback.remove();
    }, 720);
    combatFeedbackTimers.set(feedback, timer);
  }

  function clearCombatFeedback() {
    combatFeedbackTimers.forEach((timer, feedback) => {
      window.clearTimeout(timer);
      feedback.remove();
    });
    combatFeedbackTimers.clear();
    nodes.battlefield?.querySelectorAll(".combat-feedback").forEach((feedback) => feedback.remove());
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

  function cardTypeLabel(type) {
    const locale = getLocale();
    const labels = locale === "en"
      ? { attack: "Attack", defense: "Defense", utility: "Utility", curse: "Curse" }
      : locale === "es"
        ? { attack: "Ataque", defense: "Defensa", utility: "Táctica", curse: "Maldición" }
        : { attack: "攻擊", defense: "防禦", utility: "功能", curse: "詛咒" };
    return localizeChinese(labels[type] || String(type || ""), locale);
  }

  function displayIntent(intent) {
    const views = {
      attack: { icon: "ATK", key: "intent_attack", color: "#fca5a5", bg: "rgba(239, 68, 68, 0.12)", border: "rgba(239, 68, 68, 0.25)" },
      defend: { icon: "DEF", key: "intent_defend", color: "#a7f3d0", bg: "rgba(16, 185, 129, 0.12)", border: "rgba(16, 185, 129, 0.25)" },
      poison: { icon: "POI", key: "intent_poison", color: "#d8b4fe", bg: "rgba(168, 85, 247, 0.12)", border: "rgba(168, 85, 247, 0.25)" },
      buff: { icon: "CHG", key: "intent_buff", color: "#fde047", bg: "rgba(245, 158, 11, 0.12)", border: "rgba(245, 158, 11, 0.25)" },
      armor: { icon: "ARM", key: "intent_armor", color: "#cbd5e1", bg: "rgba(148, 163, 184, 0.14)", border: "rgba(148, 163, 184, 0.3)" },
      riposte: { icon: "RIP", key: "intent_riposte", color: "#fdba74", bg: "rgba(249, 115, 22, 0.12)", border: "rgba(249, 115, 22, 0.28)" },
      exhaust: { icon: "EXH", key: "intent_exhaust", color: "#f9a8d4", bg: "rgba(219, 39, 119, 0.12)", border: "rgba(219, 39, 119, 0.28)" },
      mark: { icon: "MRK", key: "intent_mark", color: "#fca5a5", bg: "rgba(220, 38, 38, 0.12)", border: "rgba(220, 38, 38, 0.28)" },
      regen: { icon: "REG", key: "intent_regen", color: "#86efac", bg: "rgba(34, 197, 94, 0.12)", border: "rgba(34, 197, 94, 0.28)" },
      cleanse: { icon: "CLR", key: "intent_cleanse", color: "#67e8f9", bg: "rgba(6, 182, 212, 0.12)", border: "rgba(6, 182, 212, 0.28)" },
      weak: { icon: "WEK", key: "intent_weak", color: "#d8b4fe", bg: "rgba(147, 51, 234, 0.12)", border: "rgba(147, 51, 234, 0.28)" },
      seal: { icon: "SEA", key: "intent_seal", color: "#c4b5fd", bg: "rgba(124, 58, 237, 0.12)", border: "rgba(124, 58, 237, 0.28)" },
      curse: { icon: "CRS", key: "intent_curse", color: "#e879f9", bg: "rgba(192, 38, 211, 0.12)", border: "rgba(192, 38, 211, 0.28)" },
      fog: { icon: "FOG", key: "intent_fog", color: "#cbd5e1", bg: "rgba(71, 85, 105, 0.22)", border: "rgba(148, 163, 184, 0.28)" },
    };
    const shownIntent = state.intentHidden && intent.type !== "fog" ? { type: "fog", val: 0 } : intent;
    const view = views[shownIntent.type] || views.attack;
    nodes.intentIcon.textContent = view.icon;
    if (["buff", "fog", "cleanse"].includes(shownIntent.type)) nodes.intentText.textContent = t(view.key);
    else if (shownIntent.type === "seal") nodes.intentText.textContent = t(view.key, { type: cardTypeLabel(shownIntent.seal) });
    else nodes.intentText.textContent = t(view.key, { amount: shownIntent.val });
    nodes.enemyIntent.style.color = view.color;
    nodes.enemyIntent.style.background = view.bg;
    nodes.enemyIntent.style.borderColor = view.border;
    updateEndTurnDecisionLabel();
  }

  function updateEndTurnDecisionLabel() {
    if (!nodes.endTurnBtn || !state.enemy) return;
    const hazards = [];
    let damage = 0;
    if (state.markedCardId && state.hand?.includes(state.markedCardId)) {
      const markDamage = Math.max(0, Number(state.markDamage) || 0);
      damage += markDamage;
      hazards.push(t("endTurnMarkHazard", { card: cardName(state.markedCardId), damage: markDamage }));
    }
    const curseCount = state.hand?.filter((cardId) => cardId === "mist-curse").length || 0;
    if (curseCount > 0) {
      const curseDamage = curseCount * 2;
      damage += curseDamage;
      hazards.push(t("endTurnCurseHazard", { count: curseCount, damage: curseDamage }));
    }
    const hazard = damage > 0
      ? t("endTurnHazardSummary", { details: hazards.join(" · "), damage })
      : t("endTurnSafe");
    nodes.endTurnBtn.setAttribute("aria-label", t("endTurnActionLabel", {
      hazard,
      intent: nodes.intentText?.textContent?.trim() || "-",
    }));
  }

  function effectiveCardCost(cardId) {
    return Math.max(0, (cardDb[cardId]?.cost || 0) + (state.exhaustCardId === cardId ? 1 : 0));
  }

  function applyPlayerDamage(amount) {
    let damage = Math.max(0, Math.round(amount));
    const blocked = Math.min(state.playerShield, damage);
    state.playerShield -= blocked;
    damage -= blocked;
    if (damage > 0) state.playerHp = Math.max(0, state.playerHp - damage);
    return { damage, blocked };
  }

  function recordPlayedType(type) {
    if (!state.enemyWard || !["attack", "defense", "utility"].includes(type)) return;
    state.wardTypesPlayed.add(type);
    const remaining = Math.max(0, 3 - state.wardTypesPlayed.size);
    if (remaining === 0) {
      state.enemyWard = 0;
      log(t("log_ward_break"), "player-synergy");
      showCombatFeedback("WARD BREAK", "block");
    } else {
      state.enemyWard = remaining;
      log(t("log_ward_progress", { type: cardTypeLabel(type), remaining }), "system");
    }
  }

  function updateBossPhase() {
    if (!state.enemy?.isBoss || state.enemyHp <= 0) return;
    const ratio = state.enemyHp / Math.max(1, state.enemyMaxHp);
    const nextPhase = ratio <= 1 / 3 ? 3 : ratio <= 2 / 3 ? 2 : 1;
    if (nextPhase <= state.bossPhase) return;
    const mechanic = state.enemy.phaseMechanic;
    while (state.bossPhase < nextPhase) {
      state.bossPhase += 1;
      const phase = state.bossPhase;
      if (mechanic === "armor") state.enemyArmor += phase;
      if (mechanic === "riposte") state.enemyRiposteBonus += 2;
      if (mechanic === "haste") state.enemyHasteStep = Math.min(3, state.enemyHasteStep + 1);
      if (mechanic === "regen") state.enemyRegen += 2;
      if (mechanic === "seal") state.enemySeal = ["attack", "defense", "utility"][phase - 1];
      if (mechanic === "ward") {
        state.wardTypesPlayed = new Set();
        state.enemyWard = 3;
      }
      log(t("log_boss_phase", { enemy: enemyName(state.enemy), phase, effect: t(`phase_${mechanic}`) }), "enemy");
      showCombatFeedback(`PHASE ${phase}`, "poison");
    }
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
    let damage = Math.max(0, Math.round(amount));
    if (state.enemyWard > 0) {
      showCombatFeedback(`WARD ${state.enemyWard}`, "block");
      return 0;
    }
    const armorBlocked = Math.min(state.enemyArmor, damage);
    if (armorBlocked > 0) {
      damage -= armorBlocked;
      log(t("log_armor_absorb", { enemy: enemyName(state.enemy), blocked: armorBlocked }), "system");
    }
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
      updateBossPhase();
    }
    if (blocked > 0) {
      const impact = damage > 0 ? `-${damage} · ${t("combatBlock")} ${blocked}` : `${t("combatBlock")} ${blocked}`;
      showCombatFeedback(impact, damage > 0 ? "damage" : "block");
    } else if (armorBlocked > 0) {
      const impact = damage > 0 ? `-${damage} · ARM ${armorBlocked}` : `ARM ${armorBlocked}`;
      showCombatFeedback(impact, damage > 0 ? "damage" : "block");
    } else if (damage > 0) {
      showCombatFeedback(`-${damage}`, "damage");
    }
    return damage;
  }

  function clearAmuletConfirmation() {
    window.clearTimeout(amuletConfirmTimer);
    amuletConfirmTimer = 0;
    amuletConfirmRemaining = 0;
    amuletConfirmDueAt = 0;
    amuletConfirmPending = false;
    nodes.amuletBtn?.classList.remove("is-confirming");
  }

  function buyMistAmulet() {
    const wallet = window.WeightPlayWallet?.read() || { diamonds: 0 };
    if (profile.amuletUnlocked || wallet.diamonds < amuletCost) return updateDiamondShopUI();
    if (!amuletConfirmPending) {
      amuletConfirmPending = true;
      window.clearTimeout(amuletConfirmTimer);
      amuletConfirmTimer = 0;
      amuletConfirmRemaining = 5000;
      armAmuletConfirmation();
      updateDiamondShopUI();
      return;
    }
    clearAmuletConfirmation();
    const spent = window.WeightPlayWallet?.spendDiamonds(amuletCost);
    if (!spent) return updateDiamondShopUI();
    profile.amuletUnlocked = true;
    saveLocalState();
    updateDiamondShopUI();
    window.WonderSound?.play("success");
  }

  function resolvePlayerAttack(baseDamage) {
    let damage = baseDamage;
    if (state.playerWeak > 0) {
      damage = Math.max(0, damage - state.playerWeak);
      log(t("log_weak", { amount: state.playerWeak }), "system");
      state.playerWeak = 0;
    }
    applyEnemyDamage(damage);
    if (state.enemyHp > 0 && state.enemyRiposte > 0) {
      const riposte = state.enemyRiposte;
      state.enemyRiposte = 0;
      const result = applyPlayerDamage(riposte);
      log(t("log_riposte", { enemy: enemyName(state.enemy), damage: result.damage }), "enemy");
      showCombatFeedback(`RIP -${result.damage}`, "poison");
    }
  }

  function playCard(index) {
    if (!state.isPlayerTurn) return;
    const cardId = state.hand[index];
    const card = cardDb[cardId];
    const cost = effectiveCardCost(cardId);
    if (!card || state.energy < cost || state.enemySeal === card.type) {
      window.WonderSound?.play("wrong");
      return;
    }

    state.energy -= cost;
    state.hand.splice(index, 1);
    if (card.temporary) {
      const deckIndex = state.deck.indexOf(cardId);
      if (deckIndex >= 0) state.deck.splice(deckIndex, 1);
    } else {
      state.discardPile.push(cardId);
    }
    if (state.markedCardId === cardId) {
      state.markedCardId = null;
      state.markDamage = 0;
    }
    recordPlayedType(card.type);
    const cardName = t(card.nameKey);
    log(t("log_play_card", { card: cardName, cost }), "player");
    showCombatFeedback(cardName, "card");

    if (cardId === "wolf-pack") {
      const damage = state.attacksPlayedThisTurn > 0 ? 12 : 6;
      if (damage === 12) log(t("log_combo", { card: cardName, damage }), "player-synergy");
      resolvePlayerAttack(damage);
      state.attacksPlayedThisTurn++;
      window.WonderSound?.play("shoot");
    } else if (cardId === "guard-bear") {
      state.playerShield += 6;
      log(t("log_player_block", { amount: 6 }), "system");
      showCombatFeedback(t("combatGainBlock", { amount: 6 }), "block");
      window.WonderSound?.play("upgrade");
    } else if (cardId === "sky-hawk") {
      resolvePlayerAttack(14);
      state.attacksPlayedThisTurn++;
      drawCards(1);
      window.WonderSound?.play("shoot");
    } else if (cardId === "cheetah-sprint") {
      drawCards(2);
      state.energy += 1;
      window.WonderSound?.play("upgrade");
    } else if (cardId === "viper-venom") {
      state.enemyPoison += 3;
      showCombatFeedback(t("combatApplyPoison", { amount: 3 }), "poison");
      window.WonderSound?.play("shoot");
    } else if (cardId === "owl-wisdom") {
      drawCards(1);
      window.WonderSound?.play("click");
    } else if (cardId === "iron-tortoise") {
      state.playerShield += 15;
      log(t("log_player_block", { amount: 15 }), "system");
      showCombatFeedback(t("combatGainBlock", { amount: 15 }), "block");
      window.WonderSound?.play("upgrade");
    } else if (cardId === "mist-curse") {
      log(t("log_curse_clear"), "player-synergy");
      window.WonderSound?.play("click");
    }

    renderStats();
    renderHand();
    if (state.playerHp <= 0) {
      state.isPlayerTurn = false;
      scheduleBattleTransition(() => endGame(false), 500);
    } else if (state.enemyHp <= 0) {
      state.isPlayerTurn = false;
      window.WonderSound?.play("enemyDown");
      scheduleBattleTransition(handleBattleWin, 500);
    } else {
      focusBattleDecision(index);
    }
  }

  function resolveEndTurnHazards() {
    const hpBefore = state.playerHp;
    if (state.markedCardId && state.hand.includes(state.markedCardId)) {
      const result = applyPlayerDamage(state.markDamage);
      log(t("log_mark_hit", { damage: result.damage }), "enemy");
    }
    state.markedCardId = null;
    state.markDamage = 0;
    const heldCurses = state.hand.filter((cardId) => cardId === "mist-curse").length;
    if (heldCurses > 0) {
      const damage = heldCurses * 2;
      const result = applyPlayerDamage(damage);
      log(t("log_curse_hold", { damage: result.damage }), "enemy");
    }
    return hpBefore - state.playerHp;
  }

  function endPlayerTurn() {
    if (!state.isPlayerTurn) return;
    state.isPlayerTurn = false;
    nodes.endTurnBtn.disabled = true;
    resolveEndTurnHazards();
    state.exhaustCardId = null;
    state.intentHidden = false;
    state.discardPile.push(...state.hand);
    state.hand = [];
    renderStats();
    renderHand();
    if (state.playerHp <= 0) scheduleBattleTransition(() => endGame(false), 500);
    else scheduleBattleTransition(executeEnemyTurn, 500);
  }

  function chooseNextDrawCard() {
    return state.drawPile[state.drawPile.length - 1] || state.deck.find((cardId) => cardId !== "mist-curse") || "wolf-pack";
  }

  function resolveEnemyIntent(intent) {
    let actionText = "";
    if (intent.type === "attack") {
      const result = applyPlayerDamage(intent.val);
      actionText = t("intent_attack", { amount: intent.val });
      if (result.damage > 0) log(t("playerDamage", { damage: result.damage, hp: state.playerHp }), "enemy");
      else log(t("shieldAbsorbed", { shield: state.playerShield }), "system");
      window.WonderSound?.play(result.damage > 0 ? "hit" : "wallHit");
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
    } else if (intent.type === "armor") {
      state.enemyArmor += intent.val;
      actionText = t("intent_armor", { amount: intent.val });
      window.WonderSound?.play("upgrade");
    } else if (intent.type === "riposte") {
      state.enemyRiposte = intent.val + state.enemyRiposteBonus;
      actionText = t("intent_riposte", { amount: state.enemyRiposte });
    } else if (intent.type === "exhaust") {
      state.exhaustCardId = chooseNextDrawCard();
      actionText = t("intent_exhaust", { amount: 1 });
      log(t("log_exhaust", { card: cardName(state.exhaustCardId) }), "enemy");
    } else if (intent.type === "mark") {
      state.markedCardId = chooseNextDrawCard();
      state.markDamage = intent.val;
      actionText = t("intent_mark", { amount: intent.val });
      log(t("log_mark", { card: cardName(state.markedCardId), damage: intent.val }), "enemy");
    } else if (intent.type === "regen") {
      state.enemyHp = Math.min(state.enemyMaxHp, state.enemyHp + intent.val);
      actionText = t("intent_regen", { amount: intent.val });
      log(t("log_regen", { enemy: enemyName(state.enemy), amount: intent.val }), "enemy");
    } else if (intent.type === "cleanse") {
      state.enemyPoison = 0;
      actionText = t("intent_cleanse");
      log(t("log_cleanse", { enemy: enemyName(state.enemy) }), "enemy");
    } else if (intent.type === "weak") {
      state.playerWeak = Math.max(state.playerWeak, intent.val);
      actionText = t("intent_weak", { amount: intent.val });
    } else if (intent.type === "seal") {
      state.enemySeal = intent.seal;
      actionText = t("intent_seal", { type: cardTypeLabel(intent.seal) });
      log(t("log_seal", { type: cardTypeLabel(intent.seal) }), "enemy");
    } else if (intent.type === "curse") {
      const count = Math.max(1, intent.val);
      for (let index = 0; index < count; index++) {
        state.deck.push("mist-curse");
        state.discardPile.push("mist-curse");
      }
      actionText = t("intent_curse", { amount: count });
      log(t("log_curse", { count }), "enemy");
    } else if (intent.type === "fog") {
      state.intentHidden = true;
      actionText = t("intent_fog");
    }
    return actionText;
  }

  function executeEnemyTurn() {
    if (state.enemyShield > 0) {
      log(t("log_enemy_block_fade", { enemy: enemyName(state.enemy) }), "system");
      state.enemyShield = 0;
    }
    state.enemySeal = null;
    state.enemyRiposte = 0;
    const intent = state.enemy.intents[state.enemyIntentIndex];
    triggerEnemyAnimation("attack");
    const actionText = resolveEnemyIntent(intent);
    log(t("log_enemy_turn", { action: actionText }), "enemy");

    if (state.enemyRegen > 0 && state.enemyHp > 0 && state.enemyHp < state.enemyMaxHp) {
      const healed = Math.min(state.enemyRegen, state.enemyMaxHp - state.enemyHp);
      state.enemyHp += healed;
      log(t("log_regen", { enemy: enemyName(state.enemy), amount: healed }), "enemy");
    }
    renderStats();
    if (state.playerHp <= 0) {
      scheduleBattleTransition(() => endGame(false), 500);
      return;
    }

    if (state.enemyPoison > 0) {
      const poisonDamage = state.enemyPoison;
      state.enemyHp = Math.max(0, state.enemyHp - poisonDamage);
      state.enemyPoison--;
      triggerEnemyAnimation("hurt");
      updateBossPhase();
      log(t("log_poison_damage", { enemy: enemyName(state.enemy), damage: poisonDamage }), "system");
      renderStats();
      if (state.enemyHp <= 0) {
        scheduleBattleTransition(handleBattleWin, 500);
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
        scheduleBattleTransition(() => endGame(false), 500);
        return;
      }
    }

    state.enemyIntentIndex = (state.enemyIntentIndex + state.enemyHasteStep) % state.enemy.intents.length;
    scheduleBattleTransition(startPlayerTurn, 650);
  }

  function startPlayerTurn() {
    state.isPlayerTurn = true;
    nodes.endTurnBtn.disabled = false;
    state.energy = state.maxEnergy || 3;
    state.playerShield = 0;
    if (state.gearBlock > 0 && !state.gearBlockAppliedThisBattle) {
      state.playerShield = state.gearBlock;
      state.gearBlockAppliedThisBattle = true;
      log(t("log_player_block", { amount: state.gearBlock }), "system");
    }
    state.attacksPlayedThisTurn = 0;
    drawCards(3);
    log(t("log_player_turn", { count: 3, energy: state.energy }), "player");
    displayIntent(state.enemy.intents[state.enemyIntentIndex]);
    renderStats();
    renderHand();
    focusBattleDecision(0);
  }

  function handleBattleWin() {
    const isMissionClear = state.battle >= 3;
    const coins = isMissionClear ? 40 + state.mission * 8 : 16 + state.mission * 3;
    profile.coins += coins;
    state.coinsEarned += coins;
    log(t("log_coin_gain", { coins }), "system");
    if (isMissionClear) {
      const mission = getMission(state.mission);
      state.unlockedBeforeResult = profile.unlockedMission;
      addXp(mission.xp);
      if (state.mission >= profile.unlockedMission && profile.unlockedMission < maxMission) {
        profile.unlockedMission = state.mission + 1;
      }
      profile.bestMission = Math.max(profile.bestMission, state.mission);
      profile.selectedMission = Math.min(profile.unlockedMission, state.mission + 1);
      saveLocalState();
      log(t(state.enemy?.isBoss ? "log_win_boss" : "log_win_mission", { xp: mission.xp }), "system");
      window.WonderSound?.play("win");
      scheduleBattleTransition(() => endGame(true), 900);
    } else {
      addXp(18 + state.mission * 2);
      log(t("log_win_battle", { enemy: enemyName(state.enemy) }), "system");
      window.WonderSound?.play("coin");
      scheduleBattleTransition(showDraftScreen, 650);
    }
  }

  function addDraftCardToMission(cardId) {
    state.deck.push(cardId);
    state.guaranteedOpeningCard = cardId;
    state.lastDraftCard = cardId;
    state.playerHp = Math.min(state.playerMaxHp, state.playerHp + 10);
    state.battle += 1;
  }

  function draftCoveredLayers() {
    return [
      nodes.gamePanel.querySelector(".hud-row"),
      nodes.gamePanel.querySelector(".battlefield"),
      nodes.gamePanel.querySelector(".action-area"),
    ].filter(Boolean);
  }

  function setDraftModalActive(active, focusPrimary = true) {
    nodes.draftPanel.classList.toggle("hidden", !active);
    draftCoveredLayers().forEach((layer) => {
      layer.inert = active;
      if (active) layer.setAttribute("aria-hidden", "true");
      else layer.removeAttribute("aria-hidden");
    });
    if (active && focusPrimary) {
      requestAnimationFrame(() => nodes.draftCards.querySelector("button:not(:disabled)")?.focus({ preventScroll: true }));
    }
  }

  function showDraftScreen() {
    nodes.draftCards.innerHTML = "";
    let draftLocked = false;
    const draftPool = ["sky-hawk", "cheetah-sprint", "viper-venom", "owl-wisdom", "iron-tortoise"];
    shuffle(draftPool);
    draftPool.slice(0, 3).forEach((cardId) => {
      const card = cardDb[cardId];
      const cardEl = document.createElement("button");
      cardEl.className = `card ${card.type}`;
      cardEl.type = "button";
      cardEl.innerHTML = cardMarkup(card);
      cardEl.setAttribute("aria-label", t("cardActionLabel", {
        card: t(card.nameKey),
        effect: t(card.descKey),
        status: t("chooseCardDesc"),
      }));
      cardEl.addEventListener("click", () => {
        if (draftLocked) return;
        draftLocked = true;
        nodes.draftCards.querySelectorAll("button").forEach((button) => {
          button.disabled = true;
          button.classList.toggle("draft-picked", button === cardEl);
        });
        addDraftCardToMission(cardId);
        setDraftModalActive(false, false);
        startNextBattle();
        requestAnimationFrame(() => nodes.handRow.querySelector("button:not(:disabled)")?.focus({ preventScroll: true }));
      });
      nodes.draftCards.appendChild(cardEl);
    });
    setDraftModalActive(true);
  }

  function cardMarkup(card, cost = card.cost) {
    return `
      <div class="card-header">
        <span class="card-cost">${cost}</span>
      </div>
      <div class="card-icon"><img src="${asset(card.image)}" alt=""></div>
      <strong class="card-name">${t(card.nameKey)}</strong>
      <p class="card-desc">${t(card.descKey)}</p>
    `;
  }

  function initializeEnemyMechanics(enemy) {
    state.enemyArmor = Math.max(0, enemy.armor || 0);
    state.enemyRiposte = 0;
    state.enemyRiposteBonus = Math.max(0, enemy.riposteBonus || 0);
    state.enemyRegen = Math.max(0, enemy.regen || 0);
    state.enemyHasteStep = enemy.haste ? 2 : 1;
    state.enemyWard = Math.max(0, enemy.ward || 0);
    state.wardTypesPlayed = new Set();
    state.bossPhase = 1;
    state.playerWeak = 0;
    state.exhaustCardId = null;
    state.markedCardId = null;
    state.markDamage = 0;
    state.enemySeal = null;
    state.intentHidden = false;
  }

  function startNextBattle() {
    state.enemy = currentEnemy();
    state.enemyHp = state.enemy.maxHp;
    state.enemyMaxHp = state.enemy.maxHp;
    state.playerShield = 0;
    state.enemyShield = 0;
    initializeEnemyMechanics(state.enemy);
    state.enemyPoison = 0;
    state.playerPoison = 0;
    state.enemyIntentIndex = 0;
    state.attacksPlayedThisTurn = 0;
    state.gearBlockAppliedThisBattle = false;
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
    nodes.enemyAvatar.classList.toggle("is-boss", Boolean(state.enemy.isBoss));
    nodes.enemyAvatar.innerHTML = `<img src="${asset(state.enemy.image)}" alt="">`;
    nodes.battleLog.innerHTML = "";
    log(t("log_start", { enemy: enemyName(state.enemy) }), "system");
    if (state.lastDraftCard) {
      state.highlightDraftCard = state.lastDraftCard;
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
    nodes.energyText.textContent = `${state.energy}/${state.maxEnergy || 3}`;
    nodes.enemyHpText.textContent = `${state.enemyHp}/${state.enemyMaxHp}`;
    nodes.enemyHpFill.style.width = `${Math.max(0, (state.enemyHp / state.enemyMaxHp) * 100)}%`;
    nodes.deckText.textContent = state.drawPile.length;
    nodes.discardText.textContent = state.discardPile.length;
    nodes.playerStatusRow.innerHTML = state.playerPoison > 0 ? `<span class="status-badge poison">POI ${state.playerPoison}</span>` : "";
    if (state.playerWeak > 0) nodes.playerStatusRow.innerHTML += `<span class="status-badge poison">${t("playerWeakStatus", { amount: state.playerWeak })}</span>`;
    if (state.exhaustCardId) nodes.playerStatusRow.innerHTML += `<span class="status-badge defend">${t("playerExhaustStatus", { card: cardName(state.exhaustCardId) })}</span>`;
    if (state.markedCardId) nodes.playerStatusRow.innerHTML += `<span class="status-badge poison">${t("playerMarkStatus", { card: cardName(state.markedCardId), amount: state.markDamage })}</span>`;
    if (state.enemySeal) nodes.playerStatusRow.innerHTML += `<span class="status-badge defend">${t("playerSealStatus", { type: cardTypeLabel(state.enemySeal) })}</span>`;
    nodes.enemyStatusRow.innerHTML = "";
    if (state.enemyPoison > 0) nodes.enemyStatusRow.innerHTML += `<span class="status-badge poison">POI ${state.enemyPoison}</span>`;
    if (state.enemyShield > 0) {
      nodes.enemyStatusRow.innerHTML += `<span class="status-badge defend" title="${t("enemyBlockStatus", { amount: state.enemyShield })}">${t("enemyBlockStatus", { amount: state.enemyShield })}</span>`;
    }
    if (state.enemyArmor > 0) nodes.enemyStatusRow.innerHTML += `<span class="status-badge defend">${t("enemyArmorStatus", { amount: state.enemyArmor })}</span>`;
    if (state.enemyRiposte > 0) nodes.enemyStatusRow.innerHTML += `<span class="status-badge poison">${t("enemyRiposteStatus", { amount: state.enemyRiposte })}</span>`;
    if (state.enemyWard > 0) nodes.enemyStatusRow.innerHTML += `<span class="status-badge poison">${t("enemyWardStatus", { amount: state.enemyWard })}</span>`;
    if (state.enemyRegen > 0) nodes.enemyStatusRow.innerHTML += `<span class="status-badge defend">${t("enemyRegenStatus", { amount: state.enemyRegen })}</span>`;
  }

  function renderHand() {
    nodes.handRow.innerHTML = "";
    state.hand.forEach((cardId, index) => {
      const card = cardDb[cardId];
      const cardEl = document.createElement("button");
      const cost = effectiveCardCost(cardId);
      const sealed = state.enemySeal === card.type;
      const canPlay = state.isPlayerTurn && state.energy >= cost && !sealed;
      const status = !state.isPlayerTurn
        ? t("cardWaitTurn", { cost })
        : sealed
          ? t("cardSealed", { type: cardTypeLabel(card.type) })
        : canPlay
          ? t("cardPlayable", { cost, energy: state.energy })
          : t("cardNeedEnergy", { need: cost - state.energy, cost, energy: state.energy });
      cardEl.className = `card ${card.type}`;
      cardEl.dataset.handIndex = index;
      if (state.highlightDraftCard === cardId) cardEl.classList.add("drafted-card");
      cardEl.type = "button";
      cardEl.innerHTML = cardMarkup(card, cost);
      cardEl.disabled = !canPlay;
      cardEl.classList.toggle("disabled", !canPlay);
      cardEl.setAttribute("aria-label", t("cardActionLabel", {
        card: t(card.nameKey),
        effect: t(card.descKey),
        status,
      }));
      cardEl.addEventListener("click", () => playCard(index));
      nodes.handRow.appendChild(cardEl);
    });
    updateEndTurnDecisionLabel();
  }

  function focusBattleDecision(preferredIndex) {
    const cards = [...nodes.handRow.querySelectorAll(".card:not(:disabled)")];
    const nextCard = cards.find((card) => Number(card.dataset.handIndex) >= preferredIndex)
      || cards.at(-1);
    (nextCard || nodes.endTurnBtn)?.focus({ preventScroll: true });
  }

  function syncResultPrimaryAction(won, canContinue) {
    const terminalVictory = won && state.mission >= maxMission;
    const primaryAction = canContinue
      ? nodes.nextMissionBtn
      : terminalVictory
        ? nodes.resultMenuBtn
        : nodes.retryBtn;
    [nodes.nextMissionBtn, nodes.retryBtn, nodes.resultMenuBtn].forEach((button) => {
      button?.classList.toggle("result-primary-action", button === primaryAction);
    });
    return primaryAction;
  }

  function endGame(won) {
    clearCombatFeedback();
    nodes.gamePanel.classList.add("result-open");
    nodes.resultPanel.classList.remove("hidden");
    nodes.resultPanel.scrollTop = 0;
    [nodes.gamePanel.querySelector(".hud-row"), nodes.gamePanel.querySelector(".battlefield"), nodes.gamePanel.querySelector(".action-area")].forEach((node) => {
      node?.setAttribute("inert", "");
      node?.setAttribute("aria-hidden", "true");
    });
    positionBattleSoundControl();
    const cleared = won ? 3 : Math.max(0, state.battle - 1);
    const stars = cleared === 3 ? "★★★" : cleared === 2 ? "★★" : cleared === 1 ? "★" : "-";
    nodes.resultTitle.textContent = won ? t("runComplete") : t("runFailed");
    nodes.resultScore.textContent = won ? `${state.mission}/${maxMission}` : `${cleared}/3`;
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
    nodes.resultRewards.textContent = t("resultRewards", { xp: state.xpEarned, coins: state.coinsEarned });
    nodes.resultSaved.textContent = t("resultSaved", { level: profile.level, xp: profile.xp, nextXp: xpToNext(profile.level), coins: profile.coins });
    if (won && state.mission >= maxMission) {
      nodes.resultUnlock.textContent = t("resultComplete", { count: maxMission });
    } else if (won) {
      const nextMission = Math.min(maxMission, state.mission + 1);
      const key = state.unlockedBeforeResult < nextMission ? "resultUnlocked" : "resultReady";
      nodes.resultUnlock.textContent = t(key, { mission: nextMission, name: missionTitle(nextMission) });
    } else {
      nodes.resultUnlock.textContent = t("resultRetry", { mission: state.mission });
    }
    const canContinue = won && state.mission < maxMission && profile.selectedMission > state.mission;
    if (nodes.nextMissionBtn) {
      nodes.nextMissionBtn.classList.toggle("hidden", !canContinue);
      if (canContinue) nodes.nextMissionBtn.textContent = nextMissionLabel(profile.selectedMission);
    }
    renderProgressUI();
    updateDiamondShopUI();
    syncResultPrimaryAction(won, canContinue)?.focus({ preventScroll: true });
  }

  function resetRunState() {
    const gear = gearBonus(profile.equippedGear);
    const maxHp = 30 + levelHpBonus() + (profile.amuletUnlocked ? 10 : 0) + gear.hp;
    const maxEnergy = 3 + gear.energy;
    state = {
      playerMaxHp: maxHp,
      playerHp: maxHp,
      playerShield: 0,
      playerPoison: 0,
      mission: clamp(profile.selectedMission, 1, profile.unlockedMission),
      battle: 1,
      deck: [...baseDeck, ...profile.equippedCards],
      drawPile: [],
      discardPile: [],
      hand: [],
      energy: maxEnergy,
      maxEnergy,
      gearBlock: gear.block,
      gearBlockAppliedThisBattle: false,
      enemy: null,
      enemyHp: 0,
      enemyMaxHp: 0,
      enemyPoison: 0,
      enemyShield: 0,
      enemyArmor: 0,
      enemyRiposte: 0,
      enemyRiposteBonus: 0,
      enemyRegen: 0,
      enemyHasteStep: 1,
      enemyWard: 0,
      wardTypesPlayed: new Set(),
      bossPhase: 1,
      enemyIntentIndex: 0,
      attacksPlayedThisTurn: 0,
      playerWeak: 0,
      exhaustCardId: null,
      markedCardId: null,
      markDamage: 0,
      enemySeal: null,
      intentHidden: false,
      isPlayerTurn: true,
      xpEarned: 0,
      coinsEarned: 0,
      unlockedBeforeResult: profile.unlockedMission,
      guaranteedOpeningCard: null,
      lastDraftCard: null,
      highlightDraftCard: null,
    };
  }

  function positionBattleSoundControl() {
    const applyPosition = () => {
      const toggle = document.querySelector("button[data-sound-toggle]");
      const panel = nodes.gamePanel.getBoundingClientRect();
      if (!toggle || panel.width <= 0 || panel.height <= 0) return;
      const size = 42;
      toggle.style.setProperty("left", `${Math.round(panel.right - size - 12)}px`, "important");
      toggle.style.setProperty("top", `${Math.round(panel.top + 12)}px`, "important");
      toggle.style.setProperty("right", "auto", "important");
      toggle.style.setProperty("bottom", "auto", "important");
    };
    applyPosition();
    requestAnimationFrame(applyPosition);
    window.setTimeout(applyPosition, 120);
  }

  function leaveStageCanvas() {
    cancelStageSettlement();
    nodes.menuBtn.setAttribute("data-wp-return", "battle");
    document.documentElement.classList.remove("wp-stage-select-active");
    document.body.classList.remove("wp-stage-select-active", "wp-standard-stage-page");
    document.querySelectorAll("[data-wp-logical-stage-canvas]").forEach((root) => {
      root.removeAttribute("data-wp-logical-stage-canvas");
    });
    document.querySelectorAll("[data-wp-stage-reserve-active]").forEach((reserve) => {
      reserve.removeAttribute("data-wp-stage-reserve-active");
    });
  }

  function startRun() {
    if (leaveDecisionOpen) setLeaveDecision(false, { restoreFocus: false, resume: false });
    cancelBattleTransitions();
    clearCombatFeedback();
    clearAmuletConfirmation();
    loadLocalState();
    resetRunState();
    setDraftModalActive(false, false);
    nodes.menuPanel.classList.add("hidden");
    nodes.stagePanel.classList.add("hidden");
    leaveStageCanvas();
    nodes.resultPanel.classList.add("hidden");
    nodes.gamePanel.classList.remove("result-open");
    [nodes.gamePanel.querySelector(".hud-row"), nodes.gamePanel.querySelector(".battlefield"), nodes.gamePanel.querySelector(".action-area")].forEach((node) => {
      node?.removeAttribute("inert");
      node?.removeAttribute("aria-hidden");
    });
    nodes.gamePanel.classList.remove("hidden");
    document.body.classList.add("beast-deck-playing");
    positionBattleSoundControl();
    startNextBattle();
    requestAnimationFrame(() => nodes.handRow.querySelector("button:not(:disabled)")?.focus({ preventScroll: true }));
    window.WonderSound?.play("start");
    nodes.gamePanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function exposeSmokeHooks() {
    if (!new URLSearchParams(window.location.search).has("smoke")) return;
    window.__beastDeckSmoke = {
      getState: () => ({
        mission: state.mission,
        battle: state.battle,
        deck: [...(state.deck || [])],
        hand: [...(state.hand || [])],
        drawPile: [...(state.drawPile || [])],
        discardPile: [...(state.discardPile || [])],
        energy: state.energy || 0,
        maxEnergy: state.maxEnergy || 0,
        isPlayerTurn: Boolean(state.isPlayerTurn),
        playerHp: state.playerHp || 0,
        enemyHp: state.enemyHp || 0,
        enemyIntentIndex: state.enemyIntentIndex || 0,
        pendingBattleTransitions: battleTransitions.size,
        backgroundSuspended,
        enemyShield: state.enemyShield || 0,
        enemyArmor: state.enemyArmor || 0,
        enemyRiposte: state.enemyRiposte || 0,
        enemyRegen: state.enemyRegen || 0,
        enemyHasteStep: state.enemyHasteStep || 1,
        enemyWard: state.enemyWard || 0,
        bossPhase: state.bossPhase || 1,
        playerWeak: state.playerWeak || 0,
        exhaustCardId: state.exhaustCardId || null,
        markedCardId: state.markedCardId || null,
        enemySeal: state.enemySeal || null,
        intentHidden: Boolean(state.intentHidden),
        playerShield: state.playerShield || 0,
        highlightDraftCard: state.highlightDraftCard || null,
      }),
      getStageSettlementState: () => ({
        browsedMission,
        selectedMission: profile.selectedMission,
        isAutoPositioningStage,
        hasPendingSettle: Boolean(stageScrollTimer),
        centeredMission: Number(nodes.stageGrid?.querySelector(".stage-card.centered")?.dataset.mission || 0),
      }),
      campaignDepth: () => ({
        missionCount: missionTemplates.length,
        arcs: [...new Set(missionTemplates.map((mission) => mission.arc))],
        bossMissions: missionTemplates.map((mission, index) => mission.boss ? index + 1 : 0).filter(Boolean),
        bosses: Object.entries(enemyCatalog).filter(([, enemy]) => enemy.isBoss).map(([id, enemy]) => ({ id, bossId: enemy.bossId, image: enemy.image, mechanic: enemy.phaseMechanic })),
        specialIntentTypes: [...new Set(Object.values(enemyCatalog).flatMap((enemy) => enemy.intents.map((intent) => intent.type)))],
        numericScaleAt30: Number((1 + (maxMission - 1) * 0.045).toFixed(3)),
        missions: missionTemplates.map((mission, index) => ({ id: index + 1, arc: mission.arc, boss: Boolean(mission.boss), enemies: [...mission.enemies] })),
        permanentCardIds: [...permanentCardIds],
        temporaryCardIds: Object.keys(cardDb).filter((cardId) => cardDb[cardId].temporary),
      }),
      campaignBalance: () => {
        let level = 1;
        let xp = 0;
        const rows = missionTemplates.map((mission, index) => {
          const missionId = index + 1;
          const playerMaxHp = 30 + Math.max(0, level - 1) * 2;
          const enemies = mission.enemies.map((enemyId) => scaledEnemy(enemyId, missionId));
          const maxAttack = Math.max(...enemies.flatMap((enemy) => enemy.intents.filter((intent) => intent.type === "attack").map((intent) => intent.val)), 0);
          const maxEnemyHp = Math.max(...enemies.map((enemy) => enemy.maxHp));
          const gainedXp = mission.xp + 2 * (18 + missionId * 2);
          xp += gainedXp;
          while (xp >= xpToNext(level)) {
            xp -= xpToNext(level);
            level += 1;
          }
          return { mission: missionId, playerMaxHp, maxAttack, maxEnemyHp, oneHitMargin: playerMaxHp - maxAttack, levelAfter: level };
        });
        return {
          rows,
          minimumOneHitMargin: Math.min(...rows.map((row) => row.oneHitMargin)),
          maximumEnemyHp: Math.max(...rows.map((row) => row.maxEnemyHp)),
          maximumAttack: Math.max(...rows.map((row) => row.maxAttack)),
          finalLevel: level,
          baseCardTypes: [...new Set(baseDeck.map((cardId) => cardDb[cardId].type))],
          curseCost: cardDb["mist-curse"].cost,
        };
      },
      runCampaignMechanicScenario: () => {
        const originalState = state;
        resetRunState();
        state.enemy = scaledEnemy("stonebackBoss", 5);
        state.enemyHp = state.enemy.maxHp;
        state.enemyMaxHp = state.enemy.maxHp;
        state.playerHp = 30;
        state.playerMaxHp = 30;
        state.playerShield = 0;
        state.enemyShield = 0;
        initializeEnemyMechanics(state.enemy);
        const armorHpBefore = state.enemyHp;
        const armorDamage = applyEnemyDamage(10);
        const armorHpAfter = state.enemyHp;
        state.enemyWard = 3;
        state.wardTypesPlayed = new Set();
        recordPlayedType("attack");
        recordPlayedType("defense");
        const wardBeforeFinalType = state.enemyWard;
        recordPlayedType("utility");
        const wardAfterFinalType = state.enemyWard;
        state.enemyArmor = 0;
        state.enemyRiposte = 5;
        const playerHpBeforeRiposte = state.playerHp;
        resolvePlayerAttack(4);
        const playerHpAfterRiposte = state.playerHp;
        state.enemyHp = Math.ceil(state.enemyMaxHp * 0.3);
        updateBossPhase();
        const bossPhase = state.bossPhase;
        const bossArmor = state.enemyArmor;
        state = originalState;
        return { armorHpBefore, armorHpAfter, armorDamage, wardBeforeFinalType, wardAfterFinalType, playerHpBeforeRiposte, playerHpAfterRiposte, bossPhase, bossArmor };
      },
      bossPhasePreviews: () => {
        const originalState = state;
        const previews = Object.entries(enemyCatalog).filter(([, enemy]) => enemy.isBoss).map(([id, base]) => {
          resetRunState();
          state.enemy = scaledEnemy(id, 30);
          state.enemyHp = Math.ceil(state.enemy.maxHp * 0.3);
          state.enemyMaxHp = state.enemy.maxHp;
          initializeEnemyMechanics(state.enemy);
          updateBossPhase();
          return {
            id,
            bossId: base.bossId,
            mechanic: base.phaseMechanic,
            phase: state.bossPhase,
            armor: state.enemyArmor,
            riposteBonus: state.enemyRiposteBonus,
            hasteStep: state.enemyHasteStep,
            regen: state.enemyRegen,
            seal: state.enemySeal,
            ward: state.enemyWard,
          };
        });
        state = originalState;
        return previews;
      },
      statusMechanicPreviews: () => {
        const originalState = state;
        resetRunState();
        state.enemy = scaledEnemy("crownWolf", 30);
        state.enemyHp = 60;
        state.enemyMaxHp = 100;
        state.playerHp = 40;
        state.playerMaxHp = 40;
        state.playerShield = 0;
        state.enemyShield = 0;
        state.enemyPoison = 0;
        state.playerPoison = 0;
        initializeEnemyMechanics(state.enemy);

        resolveEnemyIntent({ type: "armor", val: 2 });
        const armor = state.enemyArmor;
        resolveEnemyIntent({ type: "riposte", val: 4 });
        const riposte = state.enemyRiposte;
        state.drawPile = ["guard-bear"];
        resolveEnemyIntent({ type: "exhaust", val: 1 });
        const exhaustedCard = state.exhaustCardId;
        const exhaustedCost = effectiveCardCost(exhaustedCard);
        resolveEnemyIntent({ type: "mark", val: 6 });
        state.hand = [state.markedCardId];
        const markDamage = resolveEndTurnHazards();
        state.enemyHp = 50;
        resolveEnemyIntent({ type: "regen", val: 5 });
        const regenHp = state.enemyHp;
        state.enemyPoison = 4;
        resolveEnemyIntent({ type: "cleanse", val: 0 });
        const poisonAfterCleanse = state.enemyPoison;
        resolveEnemyIntent({ type: "weak", val: 4 });
        const weak = state.playerWeak;
        resolveEnemyIntent({ type: "seal", val: 0, seal: "attack" });
        state.hand = ["wolf-pack"];
        state.energy = 3;
        state.isPlayerTurn = true;
        renderHand();
        const sealedAttackDisabled = Boolean(nodes.handRow.querySelector("button")?.disabled);
        const cursesBefore = state.deck.filter((cardId) => cardId === "mist-curse").length;
        resolveEnemyIntent({ type: "curse", val: 1 });
        const cursesInserted = state.deck.filter((cardId) => cardId === "mist-curse").length - cursesBefore;
        state.hand = ["mist-curse"];
        state.playerShield = 0;
        const curseHoldDamage = resolveEndTurnHazards();
        state.intentHidden = false;
        resolveEnemyIntent({ type: "fog", val: 0 });
        displayIntent({ type: "attack", val: 12 });
        const fogIcon = nodes.intentIcon.textContent;
        const amber = scaledEnemy("amberLynx", 15);
        const hasteStep = amber.haste ? 2 : 1;
        state = originalState;
        return { armor, riposte, exhaustedCard, exhaustedCost, markDamage, regenHp, poisonAfterCleanse, weak, sealedAttackDisabled, cursesInserted, curseHoldDamage, fogIcon, hasteStep };
      },
      unlockCampaignForSmoke: (missionId = 30) => {
        const mission = clamp(Number(missionId) || 1, 1, maxMission);
        profile.unlockedMission = mission;
        profile.selectedMission = mission;
        saveLocalState();
        renderProgressUI();
        return { unlockedMission: profile.unlockedMission, selectedMission: profile.selectedMission };
      },
      forceBattle: (battle = 3) => {
        state.battle = clamp(Number(battle) || 1, 1, 3);
        startNextBattle();
        return {
          battle: state.battle,
          enemyName: enemyName(state.enemy),
          enemyImage: state.enemy.image,
          isBoss: Boolean(state.enemy.isBoss),
          isElite: Boolean(state.enemy.isElite),
          bossId: state.enemy.bossId || "",
          phaseMechanic: state.enemy.phaseMechanic || "",
        };
      },
      setHandAccessibilityState: ({ energy = state.energy, isPlayerTurn = state.isPlayerTurn, hand = state.hand } = {}) => {
        state.energy = Math.max(0, Number(energy) || 0);
        state.isPlayerTurn = Boolean(isPlayerTurn);
        state.hand = Array.isArray(hand) ? hand.filter((cardId) => cardDb[cardId]) : state.hand;
        renderStats();
        renderHand();
        return window.__beastDeckSmoke.getState();
      },
      setEndTurnDecisionState: ({ hand = state.hand, markedCardId = null, markDamage = 0 } = {}) => {
        state.hand = Array.isArray(hand) ? hand.filter((cardId) => cardDb[cardId]) : state.hand;
        state.markedCardId = markedCardId && cardDb[markedCardId] ? markedCardId : null;
        state.markDamage = Math.max(0, Number(markDamage) || 0);
        renderStats();
        renderHand();
        return nodes.endTurnBtn.getAttribute("aria-label") || "";
      },
      forceDraftChoice: (cardId = "iron-tortoise") => {
        addDraftCardToMission(cardId);
        setDraftModalActive(false, false);
        startNextBattle();
        return window.__beastDeckSmoke.getState();
      },
      openDraft: () => {
        showDraftScreen();
        return window.__beastDeckSmoke.getState();
      },
      forceDrawPack: () => {
        drawPack();
        return {
          profile: normalizeProfile(profile),
          packStatus: nodes.packStatus?.textContent || "",
          collectionText: nodes.collectionGrid?.textContent || "",
          gearText: nodes.gearGrid?.textContent || "",
        };
      },
      forceDrawCardPack: (cardId = "viper-venom") => {
        profile.coins = Math.max(profile.coins, packCost);
        profile.coins -= packCost;
        awardPackCard(cardId);
        saveLocalState();
        renderCollectionUI();
        return {
          profile: normalizeProfile(profile),
          packStatus: nodes.packStatus?.textContent || "",
          packReveal: {
            visible: nodes.packStatus?.classList.contains("is-reveal") || false,
            image: nodes.packStatus?.querySelector("img")?.getAttribute("src") || "",
            label: nodes.packStatus?.querySelector("small")?.textContent || "",
          },
          equippedText: nodes.deckSlots?.textContent || "",
          selectedSummaryText: nodes.selectedMissionSummary?.textContent || "",
        };
      },
      forceDrawGearPack: (gearId = "hunter-charm") => {
        profile.coins = Math.max(profile.coins, packCost);
        profile.coins -= packCost;
        awardPackGear(gearId);
        saveLocalState();
        renderCollectionUI();
        return {
          profile: normalizeProfile(profile),
          packStatus: nodes.packStatus?.textContent || "",
          packReveal: {
            visible: nodes.packStatus?.classList.contains("is-reveal") || false,
            image: nodes.packStatus?.querySelector("img")?.getAttribute("src") || "",
            label: nodes.packStatus?.querySelector("small")?.textContent || "",
          },
          gearText: nodes.gearGrid?.textContent || "",
          bonus: gearBonus(gearId),
        };
      },
      forceEnemyBlock: (amount = 9) => {
        state.enemyShield = amount;
        renderStats();
        return window.__beastDeckSmoke.getState();
      },
      forceArmorFeedback: ({ armor = 9, damage = 6 } = {}) => {
        clearCombatFeedback();
        state.enemyArmor = Math.max(0, Number(armor) || 0);
        state.enemyShield = 0;
        const hpBefore = state.enemyHp;
        const dealt = applyEnemyDamage(Math.max(0, Number(damage) || 0));
        return {
          hpBefore,
          hpAfter: state.enemyHp,
          dealt,
          feedback: [...nodes.battlefield.querySelectorAll(".combat-feedback")].map((node) => node.textContent?.trim() || ""),
        };
      },
      forceCombatFeedback: (message = "STALE FEEDBACK") => {
        showCombatFeedback(message, "damage");
        return nodes.battlefield.querySelectorAll(".combat-feedback").length;
      },
      playFirstAffordableCard: () => {
        const index = state.hand.findIndex((cardId) => effectiveCardCost(cardId) <= state.energy && state.enemySeal !== cardDb[cardId]?.type);
        if (index >= 0) playCard(index);
        const panel = nodes.gamePanel.getBoundingClientRect();
        const hand = nodes.handRow.getBoundingClientRect();
        return {
          state: window.__beastDeckSmoke.getState(),
          panel: { left: panel.left, width: panel.width, right: panel.right },
          hand: { left: hand.left, width: hand.width, right: hand.right },
        };
      },
      forceWinMission: () => {
        const mission = getMission(state.mission || profile.selectedMission);
        state.unlockedBeforeResult = profile.unlockedMission;
        const coins = 40 + state.mission * 8;
        profile.coins += coins;
        state.coinsEarned += coins;
        addXp(mission.xp);
        if (state.mission >= profile.unlockedMission && profile.unlockedMission < maxMission) {
          profile.unlockedMission = state.mission + 1;
        }
        profile.bestMission = Math.max(profile.bestMission, state.mission);
        profile.selectedMission = Math.min(profile.unlockedMission, state.mission + 1);
        saveLocalState();
        endGame(true);
        return {
          ...window.__beastDeckSmoke.getState(),
          selectedMission: profile.selectedMission,
          unlockedMission: profile.unlockedMission,
          level: profile.level,
          xp: profile.xp,
          coins: profile.coins,
          xpEarned: state.xpEarned,
          coinsEarned: state.coinsEarned,
          rewardsText: nodes.resultRewards?.textContent || "",
          savedText: nodes.resultSaved?.textContent || "",
          unlockText: nodes.resultUnlock?.textContent || "",
          nextMissionVisible: !nodes.nextMissionBtn?.classList.contains("hidden"),
          nextMissionText: nodes.nextMissionBtn?.textContent || "",
        };
      },
    };
  }

  function init() {
    installStandardStageFlow();
    dockMainUtilities();
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
    const rejectRepeatedBattleActivation = (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
    };
    nodes.endTurnBtn.addEventListener("keydown", rejectRepeatedBattleActivation);
    nodes.handRow.addEventListener("keydown", rejectRepeatedBattleActivation);
    nodes.draftPanel.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        return;
      }
      if (event.key !== "Tab" || nodes.draftPanel.classList.contains("hidden")) return;
      const choices = [...nodes.draftCards.querySelectorAll("button:not(:disabled)")];
      if (choices.length === 0) return;
      const first = choices[0];
      const last = choices.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    nodes.menuBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      setLeaveDecision(true);
    });
    nodes.menuBtn.addEventListener("keydown", rejectRepeatedBattleActivation);
    nodes.leaveKeepBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      setLeaveDecision(false);
    });
    nodes.leaveConfirmBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      setLeaveDecision(false, { restoreFocus: false, resume: false });
      nodes.gamePanel.classList.add("hidden");
      showStage();
      renderProgressUI();
      updateDiamondShopUI();
      renderCollectionUI();
    });
    nodes.leavePanel.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        setLeaveDecision(false);
        return;
      }
      if (event.key !== "Tab" || !leaveDecisionOpen) return;
      const actions = [nodes.leaveKeepBtn, nodes.leaveConfirmBtn];
      if (event.shiftKey && document.activeElement === actions[0]) {
        event.preventDefault();
        actions[1].focus();
      } else if (!event.shiftKey && document.activeElement === actions[1]) {
        event.preventDefault();
        actions[0].focus();
      }
    });
    nodes.retryBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      startRun();
    });
    nodes.nextMissionBtn?.addEventListener("click", () => {
      window.WonderSound?.play("click");
      startRun();
    });
    nodes.resultMenuBtn.addEventListener("click", () => {
      document.body.classList.remove("beast-deck-playing");
      window.WonderSound?.play("click");
      nodes.resultPanel.classList.add("hidden");
      nodes.gamePanel.classList.add("hidden");
      nodes.gamePanel.classList.remove("result-open");
      showStage();
      renderProgressUI();
      updateDiamondShopUI();
      renderCollectionUI();
    });
    nodes.resultPanel.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        return;
      }
      if (event.key !== "Tab" || nodes.resultPanel.classList.contains("hidden")) return;
      const actions = [...nodes.resultPanel.querySelectorAll("button:not(:disabled)")]
        .filter((button) => !button.classList.contains("hidden") && button.getClientRects().length);
      if (!actions.length) return;
      const first = actions[0];
      const last = actions.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    nodes.mainStartBtn.addEventListener("click", showStage);
    nodes.mainStartBtn.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
    });
    nodes.stageGrid.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ") && event.target.closest(".stage-card")) event.preventDefault();
    });
    nodes.stageBackBtn.addEventListener("click", showMainFromStage);
    nodes.stagePanel.querySelectorAll("[data-stage-tab]").forEach((button) => {
      button.addEventListener("click", () => selectStageTab(button.dataset.stageTab));
    });
    nodes.localeSelect.addEventListener("change", (event) => {
      window.WonderSound?.play("click");
      window.WonderI18n?.setLocale?.(event.target.value);
    });
    nodes.stageGrid?.addEventListener("scroll", () => {
      if (isAutoPositioningStage) return;
      window.clearTimeout(stageScrollTimer);
      stageScrollTimer = window.setTimeout(selectNearestVisibleStage, 120);
    }, { passive: true });
    nodes.stageGrid?.addEventListener("scrollend", () => {
      if (isAutoPositioningStage) return;
      cancelStageSettlement();
      selectNearestVisibleStage();
    }, { passive: true });
    nodes.stageGrid?.addEventListener("wheel", (event) => {
      if (event.ctrlKey || event.shiftKey) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      window.scrollBy({ top: event.deltaY, left: 0, behavior: "auto" });
    }, { passive: false });
    let isStageDragging = false;
    let stageDragStartX = 0;
    let stageDragStartLeft = 0;
    nodes.stageGrid?.addEventListener("pointerdown", (event) => {
      if (nodes.stageGrid.dataset.wpStageRail === "true") return;
      if (event.pointerType === "touch") return;
      isStageDragging = true;
      stageDragStartX = event.clientX;
      stageDragStartLeft = nodes.stageGrid.scrollLeft;
      nodes.stageGrid.classList.add("dragging");
      nodes.stageGrid.setPointerCapture?.(event.pointerId);
    });
    nodes.stageGrid?.addEventListener("pointermove", (event) => {
      if (!isStageDragging) return;
      event.preventDefault();
      nodes.stageGrid.scrollLeft = stageDragStartLeft - (event.clientX - stageDragStartX);
    });
    const endStageDrag = (event) => {
      if (!isStageDragging) return;
      isStageDragging = false;
      nodes.stageGrid.classList.remove("dragging");
      nodes.stageGrid.releasePointerCapture?.(event.pointerId);
      window.clearTimeout(stageScrollTimer);
      stageScrollTimer = window.setTimeout(selectNearestVisibleStage, 80);
    };
    nodes.stageGrid?.addEventListener("pointerup", endStageDrag);
    nodes.stageGrid?.addEventListener("pointercancel", endStageDrag);
    nodes.stageGrid?.addEventListener("pointerleave", endStageDrag);
    const rejectRepeatedLoadoutActivation = (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
    };
    nodes.deckSlots?.addEventListener("keydown", rejectRepeatedLoadoutActivation);
    nodes.collectionGrid?.addEventListener("keydown", rejectRepeatedLoadoutActivation);
    nodes.gearGrid?.addEventListener("keydown", rejectRepeatedLoadoutActivation);
    nodes.packBtn?.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
    });
    nodes.packBtn?.addEventListener("click", drawPack);
    nodes.amuletBtn.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
      }
    });
    nodes.amuletBtn.addEventListener("click", buyMistAmulet);
    exposeSmokeHooks();
    window.addEventListener("wonder:locale-change", translateUI);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) suspendBackgroundBattle();
      else resumeBackgroundBattle();
    });
    window.addEventListener("blur", suspendBackgroundBattle);
    window.addEventListener("focus", resumeBackgroundBattle);
    window.addEventListener("pagehide", suspendBackgroundBattle);
    window.addEventListener("pageshow", resumeBackgroundBattle);

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

  function updateBattleScale() {
    const viewport = window.visualViewport;
    const visualWidth = Math.round(viewport?.width || 0);
    const visualHeight = Math.round(viewport?.height || 0);
    const useVisual = visualWidth > 0 && visualHeight > 0 && Math.abs(visualWidth - innerWidth) <= 2 && visualHeight <= innerHeight + 2;
    document.documentElement.style.setProperty("--beast-vw", `${useVisual ? visualWidth : innerWidth}px`);
    document.documentElement.style.setProperty("--beast-vh", `${useVisual ? visualHeight : innerHeight}px`);
  }
  updateBattleScale();
  window.addEventListener("resize", updateBattleScale);
  window.addEventListener("orientationchange", updateBattleScale);
  window.visualViewport?.addEventListener("resize", updateBattleScale, { passive: true });
  window.addEventListener("DOMContentLoaded", init);
})();
