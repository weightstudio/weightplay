(() => {
  const GAME_ID = "beast-tactician";
  const saveKey = "weightplay_tactician_v1";
  const localeKey = "weightPlayLocale";

  const $ = (id) => document.getElementById(id);
  const nodes = {
    localeSelect: $("localeSelect"),
    menuPanel: $("menuPanel"),
    gamePanel: $("gamePanel"),
    draftPanel: $("draftPanel"),
    lootPanel: $("lootPanel"),
    resultPanel: $("resultPanel"),
    startBtn: $("startBtn"),
    menuBtn: $("menuBtn"),
    retryBtn: $("retryBtn"),
    resultMenuBtn: $("resultMenuBtn"),
    roomText: $("roomText"),
    apText: $("apText"),
    timelineList: $("timelineList"),
    heroesColumn: $("heroesColumn"),
    enemiesColumn: $("enemiesColumn"),
    actionPrompt: $("actionPrompt"),
    activeHeroName: $("activeHeroName"),
    skillCardsRow: $("skillCardsRow"),
    endTurnBtn: $("endTurnBtn"),
    lootIcon: $("lootIcon"),
    lootName: $("lootName"),
    lootType: $("lootType"),
    lootEffect: $("lootEffect"),
    equipLootBtn: $("equipLootBtn"),
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
    sidebarWeaponSlot: $("sidebarWeaponSlot"),
    sidebarArmorSlot: $("sidebarArmorSlot"),
    eqWeaponIcon: $("eqWeaponIcon"),
    eqWeaponName: $("eqWeaponName"),
    eqWeaponEffect: $("eqWeaponEffect"),
    eqArmorIcon: $("eqArmorIcon"),
    eqArmorName: $("eqArmorName"),
    eqArmorEffect: $("eqArmorEffect"),
    statLevel: $("statLevel"),
    statAtk: $("statAtk"),
    statDef: $("statDef"),
    statSpeed: $("statSpeed"),
    draftCards: $("draftCards"),
  };

  const amuletCost = 15;

  const text = {
    en: {
      title: "Beast Tactician",
      menuTitle: "Lead your Animal Squad.",
      menuHint: "Defeat shadow monsters in turn-based squad combat. Collect Weapon and Armor drops, level up to choose relic buffs, and defeat the Boss in Room 3.",
      prototypeGoalsTitle: "Prototype test goals",
      prototypeGoalsText: "Clear Room 3, defeat the giant Boss Behemoth, verify team level up buffs, and equip gear on Bear, Tiger, and Deer.",
      diamondShopTitle: "Permanent Upgrade",
      amuletName: "Mist Amulet",
      amuletEffect: "Start every run with +10 Max HP for all squad members.",
      amuletOwned: "Owned: squad starts with +10 Max HP.",
      startRun: "Start Expedition",
      menu: "Menu",
      sidebarInventory: "Squad Inventory",
      sidebarStats: "Character Stats",
      slotWeapon: "WEAPON",
      slotArmor: "ARMOR",
      runComplete: "Expedition Success!",
      runFailed: "Squad Defeated",
      resultDisclaimer: "For fun and local progress tracking only.",
      skillReportTitle: "Ability Analysis Report",
      skillLogic: "Logic",
      skillFocus: "Focus",
      skillProblem: "Problem Solving",

      // Class heroes English Names
      bear: "Shield Bear",
      tiger: "Flame Tiger",
      deer: "Nature Deer",

      // Skills English Description
      bear_skill1: "Guard Strike",
      bear_skill1_desc: "Deal 8 dmg.",
      bear_skill2: "Iron Wall",
      bear_skill2_desc: "Gain 12 Shield & Taunt for 2 turns.",
      tiger_skill1: "Shadow Slash",
      tiger_skill1_desc: "Deal 12 dmg.",
      tiger_skill2: "Frenzy",
      tiger_skill2_desc: "Gain Frenzy: next attack +50% dmg.",
      deer_skill1: "Vines Trap",
      deer_skill1_desc: "Deal 5 dmg & delay target turn timeline.",
      deer_skill2: "Rejuvenate",
      deer_skill2_desc: "Heal an ally for 12 HP.",

      // Monsters English Names
      wolf: "Shadow Wolf",
      golem: "Stone Golem",
      boss: "Behemoth Boss",

      // Relic Upgrades
      relic_atk: "Relic Talisman",
      relic_atk_desc: "Increase squad base Attack Power by +2.",
      relic_def: "Dwarven Shield",
      relic_def_desc: "Increase squad base Defense by +2.",
      relic_speed: "Swift Feather",
      relic_speed_desc: "Increase squad Speed by +2.",

      // Equipment Drops
      gear_sword_rare: "Crystal Sword",
      gear_sword_rare_desc: "+6 Attack Power",
      gear_dagger_epic: "Relic Dagger",
      gear_dagger_epic_desc: "+12 Attack Power",
      gear_armor_rare: "Ruin Chestplate",
      gear_armor_rare_desc: "+4 Defense",
      gear_armor_epic: "Golden Relic Mail",
      gear_armor_epic_desc: "+8 Defense",

      // Gear Slot Rarity Label
      rarity_rare: "Rare Gear",
      rarity_epic: "Epic Gear",

      // Prompts
      prompt_select_skill: "Select a Skill card below...",
      prompt_select_enemy: "Select an enemy target on screen!",
      prompt_select_ally: "Select a friendly squad target!",
      prompt_turn_enemy: "Enemy turn: thinking...",
      prompt_turn_win: "Room Cleared! Touch chest/portal.",

      // Reports
      report_win: "Legendary Tactician! Your team setups, taunts, and heals were flawlessly synchronized to defeat the Boss.",
      report_partial: "Decent strategist! You reached Room {room}. Level up and equip stronger gear to beat the Behemoth.",
    },
    "zh-Hant": {
      title: "獸王守衛",
      menuTitle: "率領你的動物小隊。",
      menuHint: "在回合制小隊戰鬥中擊敗影怪。收集武器和防具，升級挑選遺物能力，並在 Room 3 擊敗巨獸。",
      prototypeGoalsTitle: "原型測試目標",
      prototypeGoalsText: "通關 Room 3 並擊敗巨獸 Boss，驗證小隊升級遺物與在熊、虎、鹿身上穿戴裝備的功能正常。",
      diamondShopTitle: "永久升級",
      amuletName: "迷霧護符",
      amuletEffect: "每局開始挑戰時，小隊所有英雄最大生命值 +10 HP。",
      amuletOwned: "已擁有：開局小隊全員額外獲得 +10 Max HP。",
      startRun: "開始探險",
      menu: "選單",
      sidebarInventory: "小隊背包",
      sidebarStats: "英雄屬性",
      slotWeapon: "武器槽",
      slotArmor: "防具槽",
      runComplete: "探險成功！",
      runFailed: "全軍覆沒",
      resultDisclaimer: "能力評估僅供趣味與本機進度追蹤。",
      skillReportTitle: "能力分析報告",
      skillLogic: "邏輯力",
      skillFocus: "專注力",
      skillProblem: "問題解決",

      // Class heroes Chinese Names
      bear: "熊衛",
      tiger: "虎刺",
      deer: "鹿祭",

      // Skills Chinese Description
      bear_skill1: "護衛重擊",
      bear_skill1_desc: "造成 8 點基礎傷害。",
      bear_skill2: "鐵壁防護",
      bear_skill2_desc: "護盾增加 12 點，並嘲諷敵人 2 回合。",
      tiger_skill1: "暗影之爪",
      tiger_skill1_desc: "造成 12 點高額傷害。",
      tiger_skill2: "狂暴蓄能",
      tiger_skill2_desc: "獲得狂暴狀態：下次攻擊力增加 50%。",
      deer_skill1: "藤蔓束縛",
      deer_skill1_desc: "造成 5 點傷害並延後目標時間軸順序。",
      deer_skill2: "復甦之光",
      deer_skill2_desc: "為一名友軍恢復 12 點生命值。",

      // Monsters Chinese Names
      wolf: "暗影狼怪",
      golem: "古老石怪",
      boss: "巨獸首領",

      // Relic Upgrades
      relic_atk: "遺跡護身符",
      relic_atk_desc: "小隊基礎攻擊力增加 +2 點。",
      relic_def: "矮人盾牌",
      relic_def_desc: "小隊基礎防禦力增加 +2 點。",
      relic_speed: "神速之羽",
      relic_speed_desc: "小隊基礎速度增加 +2 點。",

      // Equipment Drops
      gear_sword_rare: "晶體神劍",
      gear_sword_rare_desc: "+6 攻擊力",
      gear_dagger_epic: "遺跡匕首",
      gear_dagger_epic_desc: "+12 攻擊力",
      gear_armor_rare: "遺跡胸甲",
      gear_armor_rare_desc: "+4 防禦力",
      gear_armor_epic: "金輝遺跡甲",
      gear_armor_epic_desc: "+8 防禦力",

      // Gear Slot Rarity Label
      rarity_rare: "稀有裝備",
      rarity_epic: "史詩裝備",

      // Prompts
      prompt_select_skill: "請在下方選擇技能卡...",
      prompt_select_enemy: "請在畫面上選擇敵方目標！",
      prompt_select_ally: "請選擇小隊友軍目標！",
      prompt_turn_enemy: "敵方回合：思考中...",
      prompt_turn_win: "戰鬥勝利！點擊寶箱/傳送門進一步前進。",

      // Reports
      report_win: "傳奇戰術家！您的小隊站位、嘲諷格擋與群體治療完美配合，成功擊殺了巨獸首領！",
      report_partial: "優秀的謀略家！您成功推進至第 {room} 間房。多搭配裝備、提升英雄屬性來擊敗巨獸。",
    }
  };

  const gearDb = {
    "sword-rare": { slot: "weapon", nameKey: "gear_sword_rare", typeKey: "rarity_rare", effectKey: "gear_sword_rare_desc", icon: "⚔️", atk: 6, def: 0 },
    "dagger-epic": { slot: "weapon", nameKey: "gear_dagger_epic", typeKey: "rarity_epic", effectKey: "gear_dagger_epic_desc", icon: "🗡️", atk: 12, def: 0 },
    "armor-rare": { slot: "armor", nameKey: "gear_armor_rare", typeKey: "rarity_rare", effectKey: "gear_armor_rare_desc", icon: "🛡️", atk: 0, def: 4 },
    "armor-epic": { slot: "armor", nameKey: "gear_armor_epic", typeKey: "rarity_epic", effectKey: "gear_armor_epic_desc", icon: "🥋", atk: 0, def: 8 },
  };

  // State Variables
  let state = {
    amuletUnlocked: false,
    room: 1,
    ap: 1,
    activeTimelineIndex: 0,
    selectedSkillIndex: null,
    selectedSidebarHero: "bear",
    gameActive: false,

    // Squad heroes
    heroes: {
      bear: { id: "bear", nameKey: "bear", icon: "🐻", hp: 30, maxHp: 30, shield: 0, speed: 10, baseAtk: 6, baseDef: 4, level: 1, exp: 0, weapon: null, armor: null, status: {} },
      tiger: { id: "tiger", nameKey: "tiger", icon: "🐯", hp: 20, maxHp: 20, shield: 0, speed: 14, baseAtk: 12, baseDef: 1, level: 1, exp: 0, weapon: null, armor: null, status: {} },
      deer: { id: "deer", nameKey: "deer", icon: "🦌", hp: 16, maxHp: 16, shield: 0, speed: 12, baseAtk: 4, baseDef: 2, level: 1, exp: 0, weapon: null, armor: null, status: {} },
    },

    // Enemies in active room
    enemies: [],

    // Timeline array ordered by Speed
    timeline: [],

    // Pickups (keys, chest, portal)
    pickups: [],
  };

  // LocalStorage helper
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

  function getLocale() {
    return localStorage.getItem(localeKey) === "zh-Hant" ? "zh-Hant" : "en";
  }

  function t(key, params = {}) {
    const locale = getLocale();
    const raw = text[locale][key] || text.en[key] || key;
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
    renderInventorySidebar();
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

  // Calculate actual stats for sidebar
  function getHeroStats(heroId) {
    const h = state.heroes[heroId];
    let atk = h.baseAtk;
    let def = h.baseDef;
    let maxHp = h.maxHp;

    if (h.weapon && gearDb[h.weapon]) {
      atk += gearDb[h.weapon].atk;
    }
    if (h.armor && gearDb[h.armor]) {
      def += gearDb[h.armor].def;
    }

    return { atk, def, speed: h.speed, maxHp };
  }

  function renderInventorySidebar() {
    const heroId = state.selectedSidebarHero;
    const h = state.heroes[heroId];
    const stats = getHeroStats(heroId);

    // Active Tab button highlight
    document.querySelectorAll(".squad-members-tabs button").forEach(btn => {
      if (btn.dataset.hero === heroId) btn.classList.add("active");
      else btn.classList.remove("active");
    });

    // Weapon
    if (h.weapon && gearDb[h.weapon]) {
      const g = gearDb[h.weapon];
      nodes.eqWeaponIcon.textContent = g.icon;
      nodes.eqWeaponName.textContent = t(g.nameKey);
      nodes.eqWeaponEffect.textContent = t(g.effectKey);
      nodes.eqWeaponEffect.style.display = "inline-block";
    } else {
      nodes.eqWeaponIcon.textContent = "⚔️";
      nodes.eqWeaponName.textContent = "None";
      nodes.eqWeaponEffect.style.display = "none";
    }

    // Armor
    if (h.armor && gearDb[h.armor]) {
      const g = gearDb[h.armor];
      nodes.eqArmorIcon.textContent = g.icon;
      nodes.eqArmorName.textContent = t(g.nameKey);
      nodes.eqArmorEffect.textContent = t(g.effectKey);
      nodes.eqArmorEffect.style.display = "inline-block";
    } else {
      nodes.eqArmorIcon.textContent = "🛡️";
      nodes.eqArmorName.textContent = "None";
      nodes.eqArmorEffect.style.display = "none";
    }

    // Stats
    nodes.statLevel.textContent = `Lv.${h.level} (${h.exp}/100)`;
    nodes.statAtk.textContent = stats.atk;
    nodes.statDef.textContent = stats.def;
    nodes.statSpeed.textContent = stats.speed;
  }

  // Start Expedition
  function startRun() {
    loadLocalState();
    
    // Set maxHp modifier based on Mist Amulet permanent shop upgrade
    const extraHp = state.amuletUnlocked ? 10 : 0;
    
    state.heroes.bear.maxHp = 30 + extraHp;
    state.heroes.bear.hp = 30 + extraHp;
    state.heroes.bear.level = 1;
    state.heroes.bear.exp = 0;
    state.heroes.bear.baseAtk = 6;
    state.heroes.bear.baseDef = 4;
    state.heroes.bear.status = {};
    state.heroes.bear.weapon = null;
    state.heroes.bear.armor = null;

    state.heroes.tiger.maxHp = 20 + extraHp;
    state.heroes.tiger.hp = 20 + extraHp;
    state.heroes.tiger.level = 1;
    state.heroes.tiger.exp = 0;
    state.heroes.tiger.baseAtk = 12;
    state.heroes.tiger.baseDef = 1;
    state.heroes.tiger.status = {};
    state.heroes.tiger.weapon = null;
    state.heroes.tiger.armor = null;

    state.heroes.deer.maxHp = 16 + extraHp;
    state.heroes.deer.hp = 16 + extraHp;
    state.heroes.deer.level = 1;
    state.heroes.deer.exp = 0;
    state.heroes.deer.baseAtk = 4;
    state.heroes.deer.baseDef = 2;
    state.heroes.deer.status = {};
    state.heroes.deer.weapon = null;
    state.heroes.deer.armor = null;

    state.room = 1;
    state.ap = 1;
    state.selectedSkillIndex = null;
    state.selectedSidebarHero = "bear";

    nodes.menuPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.gamePanel.classList.remove("hidden");

    renderInventorySidebar();
    spawnRoomEnemies();

    state.gameActive = true;
    window.WonderSound?.play("start");
  }

  function spawnRoomEnemies() {
    state.enemies = [];
    state.selectedSkillIndex = null;
    state.ap = 1;
    nodes.roomText.textContent = `${state.room}/3`;
    nodes.apText.textContent = state.ap;

    const r = state.room;
    if (r === 1) {
      // 2 Shadow Wolves
      state.enemies.push({ id: "wolf1", nameKey: "wolf", icon: "🐺", hp: 25, maxHp: 25, speed: 11, atk: 6, status: {} });
      state.enemies.push({ id: "wolf2", nameKey: "wolf", icon: "🐺", hp: 25, maxHp: 25, speed: 11, atk: 6, status: {} });
    } else if (r === 2) {
      // 2 Golems
      state.enemies.push({ id: "golem1", nameKey: "golem", icon: "🗿", hp: 45, maxHp: 45, speed: 8, atk: 10, status: {} });
      state.enemies.push({ id: "golem2", nameKey: "golem", icon: "🗿", hp: 45, maxHp: 45, speed: 8, atk: 10, status: {} });
    } else {
      // Boss Behemoth
      state.enemies.push({ id: "boss", nameKey: "boss", icon: "👹", hp: 120, maxHp: 120, speed: 9, atk: 15, status: {} });
    }

    rebuildTimeline();
  }

  // Reorder queue timeline by Speed
  function rebuildTimeline() {
    const list = [];
    
    // Add alive heroes
    Object.values(state.heroes).forEach(h => {
      if (h.hp > 0) {
        list.push({ isHero: true, id: h.id, speed: h.speed, icon: h.icon, nameKey: h.nameKey });
      }
    });

    // Add alive enemies
    state.enemies.forEach(e => {
      if (e.hp > 0) {
        list.push({ isHero: false, id: e.id, speed: e.speed, icon: e.icon, nameKey: e.nameKey });
      }
    });

    // Sort by Speed descending
    list.sort((a, b) => b.speed - a.speed);
    state.timeline = list;
    state.activeTimelineIndex = 0;

    renderTimelineUI();
    renderBattlefield();
    startTurn();
  }

  function renderTimelineUI() {
    nodes.timelineList.innerHTML = "";
    state.timeline.forEach((item, index) => {
      const el = document.createElement("div");
      el.className = `timeline-item ${item.isHero ? "" : "enemy"} ${index === state.activeTimelineIndex ? "active" : ""}`;
      el.textContent = item.icon;
      
      const num = document.createElement("span");
      num.className = "timeline-item-number";
      num.textContent = index + 1;
      el.appendChild(num);

      nodes.timelineList.appendChild(el);
    });
  }

  function renderBattlefield() {
    // 1. Heroes Columns
    nodes.heroesColumn.innerHTML = "";
    Object.values(state.heroes).forEach(h => {
      const isDead = h.hp <= 0;
      const el = document.createElement("div");
      el.id = `hero-${h.id}`;
      el.className = `character-card ${h.hp <= 0 ? "opacity-50" : ""}`;
      
      // Calculate shield percentages
      const maxHp = getHeroStats(h.id).maxHp;
      const hpPct = Math.max(0, (h.hp / maxHp) * 100);
      const shieldPct = Math.min(100, (h.shield / maxHp) * 100);

      // Render statuses
      let badgeHtml = "";
      if (h.status.taunt > 0) badgeHtml += `<span class="status-badge taunt">TAUNT (${h.status.taunt})</span>`;
      if (h.status.frenzy) badgeHtml += `<span class="status-badge frenzy">FRENZY</span>`;

      el.innerHTML = `
        <div class="character-avatar">${isDead ? "💀" : h.icon}</div>
        <div class="character-meta">
          <div class="character-name-row">
            <strong>${t(h.nameKey)}</strong>
            <span>${h.hp.toFixed(0)}/${maxHp}</span>
          </div>
          <div class="bar-bg">
            <div class="bar-fill health" style="width: ${hpPct}%"></div>
          </div>
          ${h.shield > 0 ? `
            <div class="bar-bg">
              <div class="bar-fill shield" style="width: ${shieldPct}%"></div>
            </div>
            <span class="shield-text">🛡️ +${h.shield}</span>
          ` : ""}
          <div class="status-badges">${badgeHtml}</div>
        </div>
      `;

      el.addEventListener("click", () => {
        handleTargetClick(h.id, true);
      });

      nodes.heroesColumn.appendChild(el);
    });

    // 2. Enemies Columns
    nodes.enemiesColumn.innerHTML = "";
    state.enemies.forEach(e => {
      const isDead = e.hp <= 0;
      const el = document.createElement("div");
      el.id = `enemy-${e.id}`;
      el.className = `character-card ${isDead ? "opacity-50" : ""}`;

      const hpPct = Math.max(0, (e.hp / e.maxHp) * 100);

      let badgeHtml = "";
      if (e.status.delay > 0) badgeHtml += `<span class="status-badge delay">DELAYED</span>`;

      el.innerHTML = `
        <div class="character-avatar">${isDead ? "💀" : e.icon}</div>
        <div class="character-meta">
          <div class="character-name-row">
            <strong>${t(e.nameKey)}</strong>
            <span>${e.hp.toFixed(0)}/${e.maxHp}</span>
          </div>
          <div class="bar-bg">
            <div class="bar-fill health" style="width: ${hpPct}%"></div>
          </div>
          <div class="status-badges">${badgeHtml}</div>
        </div>
      `;

      el.addEventListener("click", () => {
        handleTargetClick(e.id, false);
      });

      nodes.enemiesColumn.appendChild(el);
    });
  }

  // Combat Turn triggers
  function startTurn() {
    if (!state.gameActive) return;

    // Check Win/Fail conditions
    const heroesAlive = Object.values(state.heroes).some(h => h.hp > 0);
    const enemiesAlive = state.enemies.some(e => e.hp > 0);

    if (!heroesAlive) {
      endGame(false);
      return;
    }
    if (!enemiesAlive) {
      handleRoomClear();
      return;
    }

    const activeItem = state.timeline[state.activeTimelineIndex];
    if (activeItem.isHero) {
      // Hero turn
      state.ap = 1;
      nodes.apText.textContent = state.ap;
      
      const h = state.heroes[activeItem.id];
      nodes.activeHeroName.textContent = t(h.nameKey);
      
      // Remove highlighting
      document.querySelectorAll(".character-card").forEach(el => el.classList.remove("active"));
      $(`hero-${h.id}`)?.classList.add("active");

      // Decrement status counts
      if (h.status.taunt > 0) h.status.taunt--;

      renderSkillCards(h.id);
      nodes.actionPrompt.textContent = t("prompt_select_skill");
      nodes.endTurnBtn.disabled = false;
    } else {
      // Enemy turn
      nodes.endTurnBtn.disabled = true;
      nodes.skillCardsRow.innerHTML = "";
      nodes.activeHeroName.textContent = t(activeItem.nameKey);
      nodes.actionPrompt.textContent = t("prompt_turn_enemy");

      // Remove highlighting
      document.querySelectorAll(".character-card").forEach(el => el.classList.remove("active"));
      $(`enemy-${activeItem.id}`)?.classList.add("active");

      setTimeout(() => {
        executeEnemyAI(activeItem.id);
      }, 1000);
    }
  }

  // Render Skill selection buttons
  const heroSkills = {
    bear: [
      { id: "bear_skill1", icon: "⚔️", cost: 0, target: "enemy" },
      { id: "bear_skill2", icon: "🛡️", cost: 1, target: "self" },
    ],
    tiger: [
      { id: "tiger_skill1", icon: "爪", cost: 0, target: "enemy" },
      { id: "tiger_skill2", icon: "🔥", cost: 1, target: "self" },
    ],
    deer: [
      { id: "deer_skill1", icon: "🌿", cost: 0, target: "enemy" },
      { id: "deer_skill2", icon: "✨", cost: 1, target: "ally" },
    ],
  };

  function renderSkillCards(heroId) {
    nodes.skillCardsRow.innerHTML = "";
    const list = heroSkills[heroId];
    state.selectedSkillIndex = null;

    list.forEach((skill, idx) => {
      const btn = document.createElement("button");
      btn.className = "skill-card-btn";
      btn.type = "button";
      btn.disabled = skill.cost > state.ap;

      btn.innerHTML = `
        <span class="skill-icon">${skill.icon}</span>
        <strong class="skill-name">${t(skill.id)}</strong>
        <span class="skill-desc" style="font-size:0.65rem;color:var(--text-muted)">${t(`${skill.id}_desc`)}</span>
        <span class="skill-cost">${skill.cost} AP</span>
      `;

      btn.addEventListener("click", () => {
        window.WonderSound?.play("click");
        selectSkill(idx);
      });

      nodes.skillCardsRow.appendChild(btn);
    });
  }

  function selectSkill(idx) {
    state.selectedSkillIndex = idx;
    
    // Highlight active card
    document.querySelectorAll(".skill-card-btn").forEach((btn, i) => {
      if (i === idx) btn.classList.add("selected");
      else btn.classList.remove("selected");
    });

    const activeItem = state.timeline[state.activeTimelineIndex];
    const skill = heroSkills[activeItem.id][idx];

    // Highlight targetable entities
    document.querySelectorAll(".character-card").forEach(el => el.classList.remove("targetable"));

    if (skill.target === "enemy") {
      nodes.actionPrompt.textContent = t("prompt_select_enemy");
      state.enemies.forEach(e => {
        if (e.hp > 0) $(`enemy-${e.id}`)?.classList.add("targetable");
      });
    } else if (skill.target === "self") {
      // Auto-cast immediately
      castSkillOnTarget(activeItem.id, activeItem.id);
    } else if (skill.target === "ally") {
      nodes.actionPrompt.textContent = t("prompt_select_ally");
      Object.values(state.heroes).forEach(h => {
        if (h.hp > 0) $(`hero-${h.id}`)?.classList.add("targetable");
      });
    }
  }

  // Handle targeting click on battlefield cards
  function handleTargetClick(targetId, isHero) {
    if (state.selectedSkillIndex === null) return;
    
    const activeItem = state.timeline[state.activeTimelineIndex];
    const skill = heroSkills[activeItem.id][state.selectedSkillIndex];

    if (skill.target === "enemy" && !isHero) {
      castSkillOnTarget(activeItem.id, targetId);
    } else if (skill.target === "ally" && isHero) {
      castSkillOnTarget(activeItem.id, targetId);
    }
  }

  // Execute skill calculation
  function castSkillOnTarget(casterId, targetId) {
    const idx = state.selectedSkillIndex;
    const skill = heroSkills[casterId][idx];
    
    state.ap -= skill.cost;
    nodes.apText.textContent = state.ap;

    const caster = state.heroes[casterId];
    const stats = getHeroStats(casterId);

    // Remove targetable class
    document.querySelectorAll(".character-card").forEach(el => el.classList.remove("targetable"));

    if (casterId === "bear") {
      if (idx === 0) {
        // Guard Strike (dmg target enemy)
        const target = state.enemies.find(e => e.id === targetId);
        if (target) {
          dealDamageToEnemy(target, stats.atk);
          window.WonderSound?.play("hit");
        }
      } else {
        // Iron Wall (shield & taunt self)
        caster.shield += 12;
        caster.status.taunt = 3; // active this turn + 2 next turns
        playAnimation(caster.id, "heal", true);
        window.WonderSound?.play("success");
      }
    } else if (casterId === "tiger") {
      if (idx === 0) {
        // Shadow Slash (dmg target enemy)
        const target = state.enemies.find(e => e.id === targetId);
        if (target) {
          let multiplier = 1;
          if (caster.status.frenzy) {
            multiplier = 1.5;
            delete caster.status.frenzy;
          }
          dealDamageToEnemy(target, stats.atk * multiplier);
          window.WonderSound?.play("hit");
        }
      } else {
        // Frenzy self
        caster.status.frenzy = true;
        playAnimation(caster.id, "heal", true);
        window.WonderSound?.play("success");
      }
    } else if (casterId === "deer") {
      if (idx === 0) {
        // Vines Trap (dmg target enemy & delay timeline)
        const target = state.enemies.find(e => e.id === targetId);
        if (target) {
          dealDamageToEnemy(target, stats.atk);
          target.status.delay = true;
          // Apply timeline shift delay
          shiftTimelineDelay(targetId);
          window.WonderSound?.play("hit");
        }
      } else {
        // Rejuvenate (heal ally)
        const target = state.heroes[targetId];
        if (target) {
          const targetStats = getHeroStats(targetId);
          target.hp = Math.min(targetStats.maxHp, target.hp + 12);
          playAnimation(targetId, "heal", true);
          window.WonderSound?.play("success");
        }
      }
    }

    renderBattlefield();
    state.selectedSkillIndex = null;
    nodes.skillCardsRow.innerHTML = "";

    // Turn finished, auto advance timeline after 1 second
    setTimeout(advanceTimeline, 1200);
  }

  function dealDamageToEnemy(enemy, rawDmg) {
    enemy.hp = Math.max(0, enemy.hp - rawDmg);
    playAnimation(enemy.id, "shake", false);
  }

  function playAnimation(id, animName, isHero) {
    const selector = isHero ? `hero-${id}` : `enemy-${id}`;
    const el = $(selector);
    if (el) {
      el.classList.add(animName);
      setTimeout(() => {
        el.classList.remove(animName);
      }, 500);
    }
  }

  function shiftTimelineDelay(enemyId) {
    // Find item in timeline and shift it back by 2 positions
    const idx = state.timeline.findIndex(item => !item.isHero && item.id === enemyId);
    if (idx !== -1 && idx < state.timeline.length - 1) {
      const item = state.timeline.splice(idx, 1)[0];
      const targetIdx = Math.min(state.timeline.length, idx + 2);
      state.timeline.splice(targetIdx, 0, item);
      renderTimelineUI();
    }
  }

  function advanceTimeline() {
    state.activeTimelineIndex++;
    if (state.activeTimelineIndex >= state.timeline.length) {
      state.activeTimelineIndex = 0;
    }
    renderTimelineUI();
    startTurn();
  }

  // Enemy AI Logic
  function executeEnemyAI(enemyId) {
    const enemy = state.enemies.find(e => e.id === enemyId);
    if (!enemy || enemy.hp <= 0) {
      advanceTimeline();
      return;
    }

    // Determine target hero based on threat/Taunt
    let targetId = "bear";
    if (state.heroes.bear.status.taunt > 0 && state.heroes.bear.hp > 0) {
      targetId = "bear";
    } else {
      // Find alive hero with lowest HP
      let minHp = Infinity;
      Object.values(state.heroes).forEach(h => {
        if (h.hp > 0 && h.hp < minHp) {
          minHp = h.hp;
          targetId = h.id;
        }
      });
    }

    const targetHero = state.heroes[targetId];
    if (targetHero) {
      const stats = getHeroStats(targetId);
      // Golem has slow charge, wolf has bites
      const baseDmg = enemy.atk;
      let dmg = Math.max(1, baseDmg - stats.def);

      // Block with shield first
      if (targetHero.shield > 0) {
        if (targetHero.shield >= dmg) {
          targetHero.shield -= dmg;
          dmg = 0;
        } else {
          dmg -= targetHero.shield;
          targetHero.shield = 0;
        }
      }

      targetHero.hp = Math.max(0, targetHero.hp - dmg);
      playAnimation(targetId, "shake", true);
      window.WonderSound?.play("hit");
    }

    renderBattlefield();

    // Advance timeline
    setTimeout(advanceTimeline, 1200);
  }

  // Handlers for stage progression
  function handleRoomClear() {
    window.WonderSound?.play("upgrade");
    
    // Add EXP to all heroes
    Object.values(state.heroes).forEach(h => {
      h.exp += 50;
      if (h.exp >= 100) {
        h.level++;
        h.exp -= 100;
        h.maxHp += 5;
        h.hp = h.maxHp;
        h.baseAtk += 2;
        h.baseDef += 1;
      }
    });

    renderInventorySidebar();

    // Trigger Loot Chest overlay
    triggerChestLoot();
  }

  let currentLootItem = null;
  function triggerChestLoot() {
    state.gameActive = false;
    
    const pool = {
      1: ["sword-rare", "armor-rare"],
      2: ["dagger-epic", "armor-epic"],
      3: [],
    };

    const choices = pool[state.room] || [];
    if (choices.length === 0) {
      // If Room 3 cleared, end game directly
      if (state.room === 3) {
        endGame(true);
      } else {
        enterNextRoom();
      }
      return;
    }

    const picked = choices[Math.floor(Math.random() * choices.length)];
    currentLootItem = picked;

    const g = gearDb[picked];
    nodes.lootIcon.textContent = g.icon;
    nodes.lootName.textContent = t(g.nameKey);
    nodes.lootType.textContent = t(g.typeKey);
    nodes.lootEffect.textContent = t(g.effectKey);

    nodes.lootPanel.classList.remove("hidden");
  }

  // Equip gear selection
  function equipLoot() {
    const g = gearDb[currentLootItem];
    
    // Auto assign item to matching hero
    if (g.slot === "weapon") {
      // Give to Tiger or Bear
      if (state.heroes.tiger.weapon === null) {
        state.heroes.tiger.weapon = currentLootItem;
      } else {
        state.heroes.bear.weapon = currentLootItem;
      }
    } else if (g.slot === "armor") {
      if (state.heroes.bear.armor === null) {
        state.heroes.bear.armor = currentLootItem;
      } else {
        state.heroes.tiger.armor = currentLootItem;
      }
    }

    nodes.lootPanel.classList.add("hidden");
    window.WonderSound?.play("success");

    renderInventorySidebar();
    
    // Choose passive relics draft before next room
    triggerRelicDraft();
  }

  function triggerRelicDraft() {
    const relicsPool = ["relic_atk", "relic_def", "relic_speed"];
    shuffle(relicsPool);

    nodes.draftCards.innerHTML = "";
    relicsPool.forEach(relicId => {
      const btn = document.createElement("button");
      btn.className = "draft-item-btn";
      btn.type = "button";

      let icon = "🔮";
      if (relicId === "relic_atk") icon = "💥";
      else if (relicId === "relic_def") icon = "🛡️";
      else if (relicId === "relic_speed") icon = "⚡";

      btn.innerHTML = `
        <div class="draft-item-icon">${icon}</div>
        <strong class="draft-item-name">${t(relicId)}</strong>
        <p class="draft-item-desc">${t(`${relicId}_desc`)}</p>
      `;

      btn.addEventListener("click", () => {
        applyRelicBuff(relicId);
        nodes.draftPanel.classList.add("hidden");
        enterNextRoom();
      });

      nodes.draftCards.appendChild(btn);
    });

    nodes.draftPanel.classList.remove("hidden");
  }

  function applyRelicBuff(relicId) {
    Object.values(state.heroes).forEach(h => {
      if (relicId === "relic_atk") h.baseAtk += 2;
      else if (relicId === "relic_def") h.baseDef += 2;
      else if (relicId === "relic_speed") h.speed += 2;
    });
    window.WonderSound?.play("success");
  }

  function enterNextRoom() {
    state.room++;
    state.gameActive = true;
    
    // Fully heal team between rooms
    Object.values(state.heroes).forEach(h => {
      const stats = getHeroStats(h.id);
      h.hp = stats.maxHp;
      h.shield = 0;
      h.status = {};
    });

    spawnRoomEnemies();
    renderInventorySidebar();
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // End Game results evaluation
  function endGame(won) {
    state.gameActive = false;
    nodes.gamePanel.classList.add("hidden");
    nodes.resultPanel.classList.remove("hidden");

    nodes.resultTitle.textContent = won ? t("runComplete") : t("runFailed");
    nodes.resultScore.textContent = won ? "3" : String(state.room - 1);

    const cleared = won ? 3 : (state.room - 1);
    let starsStr = "";
    if (cleared === 3) starsStr = "⭐⭐⭐⭐⭐";
    else if (cleared === 2) starsStr = "⭐⭐⭐";
    else if (cleared === 1) starsStr = "⭐";
    else starsStr = "☆";

    nodes.logicStars.textContent = starsStr;
    nodes.focusStars.textContent = starsStr;
    nodes.problemStars.textContent = starsStr;

    if (won) {
      nodes.resultText.textContent = t("report_win");
      nodes.skillReportText.textContent = t("report_win");
      window.WeightPlayWallet?.addDiamonds(8);
      window.WonderSound?.play("win");
    } else {
      nodes.resultText.textContent = t("report_partial", { room: state.room });
      nodes.skillReportText.textContent = t("report_partial", { room: state.room });
      window.WeightPlayWallet?.addDiamonds(state.room - 1);
      window.WonderSound?.play("wrong");
    }
  }

  // Initialize page triggers
  function init() {
    loadLocalState();
    updateDiamondShopUI();
    translateUI();

    nodes.startBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      startRun();
    });

    nodes.retryBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      startRun();
    });

    nodes.menuBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      state.gameActive = false;
      nodes.gamePanel.classList.add("hidden");
      nodes.menuPanel.classList.remove("hidden");
      updateDiamondShopUI();
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

    nodes.equipLootBtn.addEventListener("click", () => {
      equipLoot();
    });

    nodes.endTurnBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      advanceTimeline();
    });

    // Tab buttons for inventory hero details
    document.querySelectorAll(".squad-members-tabs button").forEach(btn => {
      btn.addEventListener("click", () => {
        window.WonderSound?.play("click");
        state.selectedSidebarHero = btn.dataset.hero;
        renderInventorySidebar();
      });
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

    window.addEventListener("wonder:locale-change", () => {
      translateUI();
      renderBattlefield();
    });

    // Faked Loading screen loop
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
