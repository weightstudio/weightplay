(() => {
  const GAME_ID = "shadow-wolf";
  const saveKey = "weightplay_shadow_wolf_v1";
  const localeKey = "weightPlayLocale";
  const storageSession = new Map();
  const STAGE_COUNT = 30;
  const BOSS_STAGES = new Set([5, 10, 15, 20, 25, 30]);

  function readStorage(key) {
    try {
      const value = localStorage.getItem(key);
      if (value !== null) storageSession.set(key, value);
      return value ?? storageSession.get(key) ?? null;
    } catch {
      return storageSession.get(key) ?? null;
    }
  }

  function writeStorage(key, value) {
    const serialized = String(value);
    storageSession.set(key, serialized);
    try {
      localStorage.setItem(key, serialized);
      return true;
    } catch {
      return false;
    }
  }

  const stage = (id, nameEn, nameZht, hintEn, hintZht, hazard, enemies, boss = "") => ({
    id,
    region: Math.ceil(id / 5),
    nameEn,
    nameZht,
    hintEn,
    hintZht,
    hazard,
    enemies,
    boss,
  });

  const STAGE_DEFINITIONS = Object.freeze([
    stage(1, "Moonshade Gate", "月影之門", "Patrol timing and one spike bed", "巡邏節奏與單一尖刺區", "spikes", ["wolf", "wolf"]),
    stage(2, "Split Ledge", "分岔岩台", "Double-jump between separated ledges", "以二段跳跨越分離岩台", "ledges", ["wolf", "wolf", "boar"]),
    stage(3, "Bat Lanterns", "蝙蝠燈徑", "Dodge aimed shots on the upper route", "在上層路線閃避瞄準射擊", "spikes", ["bat", "bat", "wolf"]),
    stage(4, "Fang Crossing", "尖牙渡口", "Patrol, bat fire, and a moving ledge", "巡邏、蝙蝠火力與移動岩台", "moving", ["wolf", "bat", "boar"]),
    stage(5, "Basilisk Hollow", "蛇王幽谷", "Venom pools and a tail-sweep Boss", "毒池與甩尾首領", "venom", [], "basilisk"),
    stage(6, "Crystal Mouth", "水晶裂口", "Move after every falling-crystal warning", "看見落晶警示後立刻移動", "crystal", ["wolf", "crystal-bat"]),
    stage(7, "Echo Steps", "回音石階", "Cross between crystal spread volleys", "穿過水晶散射彈的空隙", "crystal", ["crystal-bat", "crystal-bat", "wolf"]),
    stage(8, "Glass Causeway", "琉璃堤道", "Moving platforms under crystal fall", "在落晶下使用移動岩台", "crystal-moving", ["crystal-bat", "boar"]),
    stage(9, "Shard Ambush", "碎晶伏擊", "Punish an armored boar after its charge", "裝甲野豬衝鋒落空後反擊", "crystal", ["crystal-bat", "armored-boar", "wolf"]),
    stage(10, "Stone Guardian", "石衛聖堂", "Break frontal guard after a ground slam", "地震後繞過正面防禦", "shockwave", [], "guardian"),
    stage(11, "Rootwild Verge", "根野邊境", "Bramble lanes slow careless movement", "荊棘帶會拖慢魯莽移動", "bramble", ["wolf", "armored-boar"]),
    stage(12, "Hanging Vines", "垂藤高台", "Choose between ranged and ground threats", "在遠程與地面威脅間取捨", "moving", ["bat", "bat", "armored-boar"]),
    stage(13, "Burrow Run", "地穴奔襲", "Opposing boar charges cross both lanes", "兩側野豬交錯衝鋒", "bramble", ["charger-boar", "charger-boar", "bat"]),
    stage(14, "Thorn Relay", "荊棘封鎖", "Open safe ground before roots spread", "在根刺擴散前打開安全地面", "root", ["armored-boar", "crystal-bat", "wolf"]),
    stage(15, "Thorn Colossus", "棘根巨像", "Expose the core after a root smash", "根拳重擊落空後核心會暴露", "root", [], "colossus"),
    stage(16, "Ember Threshold", "餘燼門檻", "Fire lanes cycle on and off", "火焰地帶週期性啟閉", "fire", ["ember-wolf", "bat"]),
    stage(17, "Cinder Pursuit", "燼火追獵", "Ember wolves leave temporary fire trails", "燼狼會留下短暫火徑", "fire", ["ember-wolf", "ember-wolf", "boar"]),
    stage(18, "Furnace Lift", "熔爐升台", "Fast platforms pass above flame lanes", "高速岩台穿越火焰地帶", "fire-moving", ["ember-wolf", "crystal-bat"]),
    stage(19, "Ashwing Roost", "灰翼巢穴", "Prioritize diving and ground threats", "判斷空中俯衝與地面威脅", "fire", ["dive-bat", "dive-bat", "ember-wolf"]),
    stage(20, "Cinder Wyvern", "燼翼飛龍", "Survive an aerial fan, then punish landing", "躲過空中火扇後反擊落地空檔", "fire", [], "wyvern"),
    stage(21, "Rift Approach", "裂隙前庭", "Periodic gusts alter horizontal movement", "週期裂風會改變水平移動", "gust", ["wolf", "rift-bat"]),
    stage(22, "Vanishing Perch", "消逝棲台", "Track blinking bats between marked perches", "追蹤在標記棲台間閃現的蝙蝠", "gust", ["rift-bat", "rift-bat", "boar"]),
    stage(23, "Mirror Hunt", "鏡影狩獵", "Mirror wolves split into fragile echoes", "鏡狼倒下後會分裂成脆弱殘影", "mirror", ["mirror-wolf", "mirror-wolf", "rift-bat"]),
    stage(24, "Eclipse Bridge", "蝕月長橋", "Read gusts, blinking shots, and one moving ledge", "依序判讀裂風、閃現射擊與移動岩台", "gust-moving", ["mirror-wolf", "rift-bat", "armored-boar"]),
    stage(25, "Eclipse Stag", "蝕月靈鹿", "Bait a shielded dash into terrain", "引誘護盾衝鋒撞上地形", "gust", [], "stag"),
    stage(26, "Crown Path", "王冠之路", "Elite counters return in a mixed encounter", "精英反制規則組合回歸", "mixed", ["armored-boar", "crystal-bat", "ember-wolf"]),
    stage(27, "Sixfold Trial", "六相試煉", "Six roles arrive in staggered pairs", "六種角色分批成對登場", "mixed", ["wolf", "crystal-bat", "charger-boar", "ember-wolf", "rift-bat", "mirror-wolf"]),
    stage(28, "Broken Altar", "破碎祭壇", "Four terrain cycles share clear warnings", "四種地形循環各有清楚警示", "all", ["dive-bat", "armored-boar", "mirror-wolf"]),
    stage(29, "Last Seal", "最後封印", "Three elite counters guard the crown", "三種精英反制守住王冠", "all", ["armored-boar", "rift-bat", "ember-wolf", "crystal-bat"]),
    stage(30, "Behemoth Crown", "巨獸王冠", "Final Boss combines crystal, roots, and charge", "最終首領結合落晶、根刺與衝鋒", "all", [], "behemoth"),
  ]);

  const $ = (id) => document.getElementById(id);
  const nodes = {
    localeSelect: $("localeSelect"),
    menuPanel: $("menuPanel"),
    mapPanel: $("mapPanel"),
    mapBackBtn: $("mapBackBtn"),
    gamePanel: $("gamePanel"),
    draftPanel: $("draftPanel"),
    lootPanel: $("lootPanel"),
    resultPanel: $("resultPanel"),
    pauseBtn: $("pauseBtn"),
    pausePanel: $("pausePanel"),
    resumeBtn: $("resumeBtn"),
    pauseStagesBtn: $("pauseStagesBtn"),
    startBtn: $("startBtn"),
    menuBtn: document.querySelector("#gamePanel #menuBtn, #battleMenuBtn"),
    retryBtn: $("retryBtn"),
    nextStageBtn: $("nextStageBtn"),
    resultMenuBtn: $("resultMenuBtn"),
    hpText: $("hpText"),
    hpFill: $("hpFill"),
    levelVal: $("levelVal"),
    expText: $("expText"),
    expFill: $("expFill"),
    roomText: $("roomText"),
    keyText: $("keyText"),
    gameCanvas: $("gameCanvas"),
    btnLeft: $("btnLeft"),
    btnRight: $("btnRight"),
    btnJump: $("btnJump"),
    btnAttack: $("btnAttack"),
    btnDash: $("btnDash"),
    eqWeaponName: $("eqWeaponName"),
    eqWeaponEffect: $("eqWeaponEffect"),
    eqWeaponIcon: $("eqWeaponIcon"),
    weaponSlot: $("weaponSlot"),
    eqArmorName: $("eqArmorName"),
    eqArmorEffect: $("eqArmorEffect"),
    eqArmorIcon: $("eqArmorIcon"),
    armorSlot: $("armorSlot"),
    eqBootsName: $("eqBootsName"),
    eqBootsEffect: $("eqBootsEffect"),
    eqBootsIcon: $("eqBootsIcon"),
    bootsSlot: $("bootsSlot"),
    statDmg: $("statDmg"),
    statSpeed: $("statSpeed"),
    statJump: $("statJump"),
    statCrit: $("statCrit"),
    attrPoints: $("attrPoints"),
    attrStrength: $("attrStrength"),
    attrAgility: $("attrAgility"),
    attrConstitution: $("attrConstitution"),
    attrLuck: $("attrLuck"),
    attributeChoiceDesc: $("attributeChoiceDesc"),
    draftCards: $("draftCards"),
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
    adventureRecordText: $("adventureRecordText"),
    zoneButtons: Array.from(document.querySelectorAll("[data-zone]")),
    attributeButtons: Array.from(document.querySelectorAll("[data-attribute]")),
  };

  function ensureMainInformationScope() {
    let campaignSummary = $("campaignSummary");
    if (!campaignSummary) {
      const summary = document.createElement("p");
      summary.className = "campaign-summary";
      summary.innerHTML = '<span data-ui="regionsCleared">Stage progress</span>: <strong id="campaignSummary">0 / 30</strong>';
      nodes.startBtn?.before(summary);
      campaignSummary = $("campaignSummary");
    }

    let workshopButton = $("stageWorkshopBtn");
    if (!workshopButton) {
      workshopButton = document.createElement("button");
      workshopButton.id = "stageWorkshopBtn";
      workshopButton.className = "stage-workshop-btn";
      workshopButton.type = "button";
      workshopButton.setAttribute("aria-controls", "stageManagementPanel");
      workshopButton.setAttribute("aria-expanded", "false");
      workshopButton.dataset.ui = "diamondShopTitle";
      workshopButton.textContent = t("diamondShopTitle");
      nodes.mapPanel?.querySelector(".stage-header")?.append(workshopButton);
    }
    workshopButton.classList.add("wp-stage-header-action");
    workshopButton.dataset.uiAria = "diamondShopTitle";

    const stageHeader = nodes.mapPanel?.querySelector(".stage-header");
    const stageTitle = stageHeader?.querySelector("[data-ui='stageTitle']");
    const stageTitleGroup = stageTitle?.parentElement;
    if (stageHeader && stageTitle && stageTitleGroup && stageTitleGroup !== stageHeader) {
      stageHeader.insertBefore(stageTitle, stageTitleGroup);
      stageTitleGroup.remove();
    }

    let managementPanel = $("stageManagementPanel");
    if (!managementPanel) {
      managementPanel = document.createElement("section");
      managementPanel.id = "stageManagementPanel";
      managementPanel.className = "stage-management-panel hidden";
      managementPanel.setAttribute("role", "dialog");
      managementPanel.setAttribute("aria-modal", "true");
      managementPanel.setAttribute("aria-labelledby", "stageManagementTitle");
      managementPanel.innerHTML = '<div class="stage-management-card"><button id="stageManagementCloseBtn" class="play-return stage-management-close" type="button" aria-label="Back to stages" data-ui-aria="backToStages">&larr;</button></div>';
      nodes.mapPanel?.querySelector(".stage-ad-reserve")?.before(managementPanel);
    }

    const managementCard = managementPanel.querySelector(".stage-management-card");
    const record = document.querySelector(".goals-card");
    const shop = document.querySelector(".menu-shop");
    if (record) {
      const title = record.querySelector("h2, h3");
      if (title) {
        title.id = "stageManagementTitle";
        title.dataset.ui = "adventureRecordTitle";
      }
      managementCard?.append(record);
    }
    if (shop) managementCard?.append(shop);

    nodes.campaignSummary = campaignSummary;
    nodes.stageWorkshopBtn = workshopButton;
    nodes.stageManagementPanel = managementPanel;
    nodes.stageManagementCloseBtn = $("stageManagementCloseBtn");
  }

  const amuletCost = 15;
  let amuletConfirmPending = false;
  let amuletConfirmTimer = 0;
  let amuletConfirmRemaining = 0;
  let amuletConfirmDueAt = 0;
  let mainEntryKeyboardKey = "";

  const text = {
    en: {
      title: "Shadow Wolf",
      menuTitle: "Dungeon Platform Adventure.",
      menuHint: "Move, double-jump, slash, and dash through 30 saved stages. Learn each hazard and enemy counter, shape exact attributes, and defeat six regional Bosses.",
      adventureRecordTitle: "Adventure Record",
      adventureRecordText: "Attempts: {runs} · Unlocked: {unlocked}/30 · Cleared: {best}/30 · Crown clears: {wins}",
      diamondShopTitle: "Permanent Upgrade",
      amuletName: "Mist Amulet",
      amuletEffect: "Start every run with +10 Max HP (40 HP instead of 30 HP).",
      amuletOwned: "Owned: every run starts with 40 Max HP.",
      amuletDecision: "Permanent unlock. Tap again to confirm: {before} → {after} Diamonds.",
      amuletConfirm: "Confirm · {before}→{after}",
      amuletLabel: "Mist Amulet permanent upgrade. Costs 15 Diamonds. Current balance {balance}.",
      amuletConfirmLabel: "Confirm Mist Amulet permanent upgrade. Spend 15 Diamonds. Balance {before} to {after}.",
      amuletNeed: "Need 15 Diamonds. Current balance: {balance}.",
      startRun: "Start Game",
      languageSelector: "Language selector",
      backToLobby: "Back to lobby",
      coverAlt: "Shadow Wolf Legend cover",
      stageSelection: "Stage selection",
      backToMain: "Back to main",
      stageRail: "Stage rail",
      backToStages: "Back to stages",
      pauseBattle: "Pause battle",
      pauseEyebrow: "EXPEDITION PAUSED",
      pauseTitle: "Battle Paused",
      pauseHint: "The battle is frozen. Resume when you are ready.",
      resumeBattle: "Resume",
      moveLeft: "Move left",
      moveRight: "Move right",
      jumpAction: "Jump",
      attackAction: "Attack",
      dashAction: "Dash",
      desktopControlsLabel: "Desktop controls: A/D move, W or Space jump, J attack, K or Shift dash.",
      controlLegend: "A/D Move · W/Space Jump · J Attack · K/Shift Dash",
      roomLabel: "Stage",
      keyLabel: "Points",
      arenaLabel: "Shadow Wolf arena",
      stageEyebrow: "EXPEDITION",
      stageTitle: "Choose an expedition",
      stageHint: "Drag the rail and choose an unlocked stage. Boss checkpoints are 5, 10, 15, 20, 25, and 30.",
      menu: "Menu",
      hudHp: "Wolf HP",
      chooseCard: "Choose a Relic Upgrade",
      chooseCardDesc: "Select one of these ancient relics to empower your wolf.",
      attributeChoiceTitle: "Level Up: Choose Your Growth",
      attributeChoiceDesc: "Spend both points before battle resumes. {points} remaining.",
      attributeStrength: "Strength",
      attributeAgility: "Agility",
      attributeConstitution: "Constitution",
      attributeLuck: "Luck",
      attributeDamagePreview: "Damage {from} → {to}",
      attributeSpeedPreview: "Speed {from} → {to}",
      attributeHpPreview: "Max HP {from} → {to}",
      attributeCritPreview: "Crit {from}% → {to}%",
      attributeChoiceAria: "Spend 1 point on {name}: {effect}",
      lootFound: "Relic Chest Unlocked!",
      equipLoot: "Equip Gear",
      tryAgain: "Try Again",
      nextStage: "Next Stage",
      replayStage: "Replay Stage",
      backToMenu: "Back to Stages",
      sidebarInventory: "Equipped Gear",
      sidebarStats: "Character Stats",
      slotWeapon: "WEAPON",
      slotArmor: "ARMOR",
      slotBoots: "BOOTS",
      runComplete: "Expedition Success!",
      runFailed: "Wolf Defeated",
      resultDisclaimer: "For fun and local progress tracking only.",
      skillReportTitle: "Ability Analysis Report",
      skillLogic: "Logic",
      skillFocus: "Focus",
      skillProblem: "Problem Solving",
      regionsCleared: "Stage progress",

      // Relic Upgrades
      relic_fang: "Sharp Fang",
      relic_fang_desc: "Increase claw sweep base Damage by +3.",
      relic_fur: "Thick Fur",
      relic_fur_desc: "Increase Max HP by +5 and heal 5 HP.",
      relic_boots: "Wind Boots",
      relic_boots_desc: "Increase Jump velocity by +0.8 units.",

      // Equipment Drops
      gear_sword_rare: "Crystal Fang",
      gear_sword_rare_desc: "+4 Claw Damage",
      gear_dagger_epic: "Relic Claw",
      gear_dagger_epic_desc: "+8 Damage & +10% Crit",
      gear_armor_rare: "Wolf Collar",
      gear_armor_rare_desc: "+10 Max HP",
      gear_armor_epic: "Leather Saddle",
      gear_armor_epic_desc: "+20 Max HP",
      gear_boots_rare: "Explorer Boots",
      gear_boots_rare_desc: "+1.0 Jump Force",
      gear_boots_epic: "Swift Boots",
      gear_boots_epic_desc: "+1.5 Jump & +20% Speed",

      // Gear Slot Rarity Label
      rarity_rare: "Rare Gear",
      rarity_epic: "Epic Gear",

      // Reports
      report_win: "Stage {stage} cleared. The next trail is unlocked, and this stage remains available for replay.",
      report_partial: "Stage {stage} remains uncleared. Read its hazard warning, adjust your attribute choices, and try again.",
      report_skill_win: "You read the stage rule, controlled the route, and finished the encounter.",
      report_skill_partial: "The route is still open: watch the warning cycle and save dash or double-jump for the counter window.",
    },
    "zh-Hant": {
      title: "影狼傳說",
      menuTitle: "遺跡平台冒險之旅。",
      menuHint: "使用 A/D 移動，W/空白鍵進行跳躍或雙重跳躍，J 鍵揮爪攻擊，K 鍵衝刺。收集鑰匙解鎖裝備，通關 Room 3。",
      diamondShopTitle: "永久升級",
      amuletName: "迷霧護符",
      amuletEffect: "每局挑戰開始時最大生命值 +10 HP (以 40 HP 開局，原為 30 HP)。",
      amuletOwned: "已擁有：以 40 Max HP 開局。",
      startRun: "開始遊戲",
      languageSelector: "語言選擇",
      backToLobby: "返回遊戲大廳",
      coverAlt: "影狼傳說封面",
      stageSelection: "關卡選擇",
      backToMain: "返回主畫面",
      stageRail: "關卡滑軌",
      backToStages: "返回關卡選擇",
      moveLeft: "向左移動",
      moveRight: "向右移動",
      jumpAction: "跳躍",
      attackAction: "攻擊",
      dashAction: "衝刺",
      desktopControlsLabel: "桌面操作：A/D 移動，W 或空白鍵跳躍，J 攻擊，K 或 Shift 衝刺。",
      controlLegend: "A/D 移動 · W/空白鍵 跳躍 · J 攻擊 · K/Shift 衝刺",
      roomLabel: "房間",
      keyLabel: "鑰匙",
      arenaLabel: "影狼戰鬥場景",
      stageEyebrow: "影狼遠征",
      stageTitle: "選擇探索區域",
      stageHint: "左右滑動選擇已解鎖區域，點擊卡片開始挑戰。",
      menu: "選單",
      hudHp: "影狼生命",
      chooseCard: "選擇遺跡能力",
      chooseCardDesc: "選擇古代遺物能力以大幅增加野獸戰鬥屬性。",
      lootFound: "解鎖遺跡寶箱！",
      equipLoot: "裝備道具",
      tryAgain: "再試一次",
      backToMenu: "回到主選單",
      sidebarInventory: "已穿戴裝備",
      sidebarStats: "角色屬性",
      slotWeapon: "武器槽",
      slotArmor: "防具槽",
      slotBoots: "鞋子槽",
      runComplete: "遺跡冒險成功！",
      runFailed: "野獸倒下了",
      resultDisclaimer: "能力評估僅供趣味與本機進度追蹤。",
      skillReportTitle: "能力分析報告",
      skillLogic: "邏輯力",
      skillFocus: "專注力",
      skillProblem: "問題解決",

      // Relics Upgrades
      relic_fang: "鋒利尖牙",
      relic_fang_desc: "揮爪基礎傷害力增加 3 點。",
      relic_fur: "堅韌皮毛",
      relic_fur_desc: "最大生命值增加 5 點，並恢復 5 點生命值。",
      relic_boots: "疾風護腿",
      relic_boots_desc: "垂直跳躍初速度增加 0.8 單位。",

      // Equipment Drops
      gear_sword_rare: "水晶獸齒",
      gear_sword_rare_desc: "+4 揮爪傷害",
      gear_dagger_epic: "遺跡鋼爪",
      gear_dagger_epic_desc: "+8 傷害與 +10% 暴擊機率",
      gear_armor_rare: "野性項圈",
      gear_armor_rare_desc: "+10 最大生命值",
      gear_armor_epic: "皮革護鞍",
      gear_armor_epic_desc: "+20 最大生命值",
      gear_boots_rare: "探險短靴",
      gear_boots_rare_desc: "+1.0 跳躍彈跳高度",
      gear_boots_epic: "飛羽神靴",
      gear_boots_epic_desc: "+1.5 跳躍與 +20% 移動速度",

      // Gear Slot Rarity Label
      rarity_rare: "稀有裝備",
      rarity_epic: "史詩裝備",

      // Reports
      report_win: "傳奇影狼！你穿越了棘刺機關，靈活二段跳，穿戴稀有尖牙與項圈，撕裂了遺跡巨獸！",
      report_partial: "優秀的冒險！你到達了第 {room} 間房。多收集高品質利爪與飛靴以挑戰巨獸 Boss。",
    }
  };

  Object.assign(text["zh-Hant"], {
    pauseBattle: "暫停戰鬥",
    pauseEyebrow: "遠征已暫停",
    pauseTitle: "戰鬥暫停",
    pauseHint: "戰鬥已完全停止，準備好後再繼續。",
    resumeBattle: "繼續戰鬥",
    adventureRecordTitle: "\u5192\u96aa\u7d00\u9304",
    adventureRecordText: "\u51fa\u5f81\u6b21\u6578\uff1a{runs} \u00b7 \u6700\u4f73\uff1a\u623f\u9593 {best}/8 \u00b7 \u5de8\u7378\u901a\u95dc\uff1a{wins}",
    amuletDecision: "\u6c38\u4e45\u89e3\u9396\u3002\u518d\u9ede\u4e00\u6b21\u78ba\u8a8d\uff1a{before} \u2192 {after} \u9846\u947d\u77f3\u3002",
    amuletConfirm: "\u78ba\u8a8d \u00b7 {before}\u2192{after}",
    amuletLabel: "\u9727\u5f71\u8b77\u7b26\u6c38\u4e45\u5347\u7d1a\uff0c\u9700\u8981 15 \u9846\u947d\u77f3\u3002\u76ee\u524d\u9918\u984d {balance}\u3002",
    amuletConfirmLabel: "\u78ba\u8a8d\u9727\u5f71\u8b77\u7b26\u6c38\u4e45\u5347\u7d1a\u3002\u82b1\u8cbb 15 \u9846\u947d\u77f3\uff0c\u9918\u984d\u5f9e {before} \u8b8a\u70ba {after}\u3002",
    amuletNeed: "\u9700\u8981 15 \u9846\u947d\u77f3\u3002\u76ee\u524d\u9918\u984d\uff1a{balance}\u3002",
    menuHint: "使用 A/D 移動、W 或空白鍵二段跳、J 攻擊、K 衝刺。擊敗精英、精確分配屬性，通過全部 8 個區域。",
    keyLabel: "點數",
    attributeChoiceTitle: "升級：選擇成長方向",
    attributeChoiceDesc: "分配完兩點後繼續戰鬥。剩餘 {points} 點。",
    attributeStrength: "力量",
    attributeAgility: "敏捷",
    attributeConstitution: "體質",
    attributeLuck: "幸運",
    attributeDamagePreview: "傷害 {from} → {to}",
    attributeSpeedPreview: "速度 {from} → {to}",
    attributeHpPreview: "最大生命 {from} → {to}",
    attributeCritPreview: "暴擊 {from}% → {to}%",
    attributeChoiceAria: "花費 1 點提升{name}：{effect}",
    report_win: "傳奇影狼！你通過全部 8 個區域、掌握二段跳、完成屬性配置，並擊敗巨獸。",
    report_partial: "這次抵達區域 {room}。下次記得分配完兩點升級點數，再依路線調整配置。",
    regionsCleared: "通過區域",
  });

  Object.assign(text["zh-Hant"], {
    adventureRecordText: "\u6311\u6230\u6b21\u6578\uff1a{runs} \u00b7 \u5df2\u89e3\u9396\uff1a{unlocked}/30 \u00b7 \u5df2\u901a\u95dc\uff1a{best}/30 \u00b7 \u738b\u51a0\u901a\u95dc\uff1a{wins}",
    menuHint: "\u4f7f\u7528 A/D \u79fb\u52d5\u3001W \u6216\u7a7a\u767d\u9375\u4e8c\u6bb5\u8df3\u3001J \u653b\u64ca\u3001K \u885d\u523a\u3002\u901a\u904e 30 \u500b\u5b58\u6a94\u95dc\u5361\uff0c\u5b78\u6703\u5730\u5f62\u8207\u6575\u4eba\u53cd\u5236\uff0c\u64ca\u6557\u516d\u96bb\u5340\u57df\u9996\u9818\u3002",
    stageHint: "\u5de6\u53f3\u62d6\u66f3\u9078\u64c7\u5df2\u89e3\u9396\u95dc\u5361\u3002\u9996\u9818\u95dc\u70ba 5\u300110\u300115\u300120\u300125\u300130\u3002",
    backToMenu: "\u8fd4\u56de\u95dc\u5361",
    nextStage: "\u4e0b\u4e00\u95dc",
    replayStage: "\u91cd\u73a9\u672c\u95dc",
    report_win: "\u7b2c {stage} \u95dc\u5df2\u901a\u904e\u3002\u4e0b\u4e00\u689d\u8def\u7dda\u5df2\u89e3\u9396\uff0c\u672c\u95dc\u4ecd\u53ef\u91cd\u65b0\u6311\u6230\u3002",
    report_partial: "\u7b2c {stage} \u95dc\u5c1a\u672a\u901a\u904e\u3002\u89c0\u5bdf\u5730\u5f62\u8b66\u793a\u3001\u8abf\u6574\u5c6c\u6027\u5f8c\u518d\u8a66\u4e00\u6b21\u3002",
    report_skill_win: "\u4f60\u8b80\u61c2\u95dc\u5361\u898f\u5247\u3001\u63a7\u5236\u79fb\u52d5\u8def\u7dda\uff0c\u4e26\u5b8c\u6210\u6574\u5834\u5c0d\u6230\u3002",
    report_skill_partial: "\u8def\u7dda\u9084\u6c92\u6709\u95dc\u9589\uff1a\u89c0\u5bdf\u8b66\u793a\u5faa\u74b0\uff0c\u628a\u885d\u523a\u6216\u4e8c\u6bb5\u8df3\u7559\u7d66\u53cd\u64ca\u7a97\u53e3\u3002",
    regionsCleared: "\u95dc\u5361\u9032\u5ea6",
    roomLabel: "\u95dc\u5361",
  });

  text.es = {
    title: "Lobo Sombrío",
    menuTitle: "Aventura de plataformas en las ruinas.",
    menuHint: "Muévete, usa el doble salto, ataca y corre por 30 niveles guardados. Aprende cada peligro y enemigo, distribuye cuatro atributos y derrota a seis jefes regionales.",
    adventureRecordTitle: "Registro de aventura",
    adventureRecordText: "Intentos: {runs} · Desbloqueados: {unlocked}/30 · Completados: {best}/30 · Coronas: {wins}",
    diamondShopTitle: "Mejora permanente",
    amuletName: "Amuleto de Niebla",
    amuletEffect: "Empieza cada partida con +10 PV máximos (40 PV en lugar de 30).",
    amuletOwned: "Obtenido: cada partida empieza con 40 PV máximos.",
    amuletDecision: "Desbloqueo permanente. Toca otra vez para confirmar: {before} → {after} diamantes.",
    amuletConfirm: "Confirmar · {before}→{after}",
    amuletLabel: "Mejora permanente Amuleto de Niebla. Cuesta 15 diamantes. Saldo actual: {balance}.",
    amuletConfirmLabel: "Confirma el Amuleto de Niebla. Gasta 15 diamantes. Saldo de {before} a {after}.",
    amuletNeed: "Necesitas 15 diamantes. Saldo actual: {balance}.",
    startRun: "Comenzar juego",
    languageSelector: "Selector de idioma",
    backToLobby: "Volver al vestíbulo",
    coverAlt: "Portada de Lobo Sombrío",
    stageSelection: "Selección de nivel",
    backToMain: "Volver al inicio",
    stageRail: "Carrusel de niveles",
    backToStages: "Volver a niveles",
    pauseBattle: "Pausar batalla",
    pauseEyebrow: "EXPEDICIÓN EN PAUSA",
    pauseTitle: "Batalla en pausa",
    pauseHint: "La batalla está detenida. Continúa cuando estés listo.",
    resumeBattle: "Continuar",
    moveLeft: "Mover a la izquierda",
    moveRight: "Mover a la derecha",
    jumpAction: "Saltar",
    attackAction: "Atacar",
    dashAction: "Correr",
    desktopControlsLabel: "Controles: A/D para moverte, W o Espacio para saltar, J para atacar y K o Mayús para correr.",
    controlLegend: "A/D Mover · W/Espacio Saltar · J Atacar · K/Mayús Correr",
    roomLabel: "Nivel",
    keyLabel: "Puntos",
    arenaLabel: "Arena de Lobo Sombrío",
    stageEyebrow: "EXPEDICIÓN",
    stageTitle: "Elige una expedición",
    stageHint: "Arrastra el carrusel y elige un nivel desbloqueado. Los jefes aparecen en 5, 10, 15, 20, 25 y 30.",
    menu: "Menú",
    hudHp: "PV del lobo",
    chooseCard: "Elige una mejora de reliquia",
    chooseCardDesc: "Elige una reliquia antigua para fortalecer a tu lobo.",
    attributeChoiceTitle: "Subida de nivel: elige tu crecimiento",
    attributeChoiceDesc: "Gasta los dos puntos antes de reanudar la batalla. Quedan {points}.",
    attributeStrength: "Fuerza",
    attributeAgility: "Agilidad",
    attributeConstitution: "Constitución",
    attributeLuck: "Suerte",
    attributeDamagePreview: "Daño {from} → {to}",
    attributeSpeedPreview: "Velocidad {from} → {to}",
    attributeHpPreview: "PV máximos {from} → {to}",
    attributeCritPreview: "Crítico {from}% → {to}%",
    attributeChoiceAria: "Gasta 1 punto en {name}: {effect}",
    lootFound: "¡Cofre de reliquia desbloqueado!",
    equipLoot: "Equipar objeto",
    tryAgain: "Intentar de nuevo",
    nextStage: "Siguiente nivel",
    replayStage: "Repetir nivel",
    backToMenu: "Volver a niveles",
    sidebarInventory: "Equipo equipado",
    sidebarStats: "Atributos del personaje",
    slotWeapon: "ARMA",
    slotArmor: "ARMADURA",
    slotBoots: "BOTAS",
    runComplete: "¡Expedición completada!",
    runFailed: "El lobo cayó",
    resultDisclaimer: "Solo para diversión y seguimiento local del progreso.",
    skillReportTitle: "Informe de habilidades",
    skillLogic: "Lógica",
    skillFocus: "Concentración",
    skillProblem: "Resolución de problemas",
    regionsCleared: "Progreso de niveles",
    relic_fang: "Colmillo Afilado",
    relic_fang_desc: "Aumenta el daño base del barrido de garras en 3.",
    relic_fur: "Pelaje Grueso",
    relic_fur_desc: "Aumenta los PV máximos en 5 y recupera 5 PV.",
    relic_boots: "Botas de Viento",
    relic_boots_desc: "Aumenta la velocidad de salto en 0,8 unidades.",
    gear_sword_rare: "Colmillo de Cristal",
    gear_sword_rare_desc: "+4 de daño de garra",
    gear_dagger_epic: "Garra Reliquia",
    gear_dagger_epic_desc: "+8 de daño y +10% de crítico",
    gear_armor_rare: "Collar de Lobo",
    gear_armor_rare_desc: "+10 PV máximos",
    gear_armor_epic: "Arnés de Cuero",
    gear_armor_epic_desc: "+20 PV máximos",
    gear_boots_rare: "Botas de Explorador",
    gear_boots_rare_desc: "+1,0 de fuerza de salto",
    gear_boots_epic: "Botas Veloces",
    gear_boots_epic_desc: "+1,5 de salto y +20% de velocidad",
    rarity_rare: "Equipo raro",
    rarity_epic: "Equipo épico",
    report_win: "Nivel {stage} completado. Se desbloqueó la siguiente ruta y puedes repetir este nivel.",
    report_partial: "El nivel {stage} sigue sin completar. Lee el aviso del peligro, ajusta los atributos e inténtalo de nuevo.",
    report_skill_win: "Interpretaste la regla del nivel, controlaste la ruta y terminaste el encuentro.",
    report_skill_partial: "La ruta sigue abierta: observa el ciclo de avisos y reserva la carrera o el doble salto para responder.",
  };

  // Keep Result-owned coaching copy local to the game. The shared runtime
  // catalog translates the remaining Japanese UI, but this dynamic sentence
  // is created only after settlement and must never fall back to English.
  text.ja = {
    report_skill_partial: "ルートはまだ開いています。警告の周期を見極め、反撃のタイミングまでダッシュか二段ジャンプを温存しましょう。",
  };

  const stageCopyEs = [
    ["Puerta de Sombra Lunar", "Ritmo de patrulla y una zona de pinchos"],
    ["Cornisa Dividida", "Doble salto entre cornisas separadas"],
    ["Faroles de Murciélago", "Esquiva disparos dirigidos en la ruta superior"],
    ["Cruce del Colmillo", "Patrulla, fuego de murciélagos y una cornisa móvil"],
    ["Hondonada del Basilisco", "Charcos de veneno y barrido de cola del jefe"],
    ["Boca de Cristal", "Muévete después de cada aviso de cristal"],
    ["Peldaños del Eco", "Cruza entre descargas de cristales"],
    ["Calzada de Vidrio", "Plataformas móviles bajo la lluvia de cristales"],
    ["Emboscada de Fragmentos", "Castiga al jabalí acorazado después de su carga"],
    ["Guardián de Piedra", "Rompe su defensa frontal después del golpe al suelo"],
    ["Límite de Raíces Salvajes", "Las zarzas frenan los movimientos imprudentes"],
    ["Enredaderas Colgantes", "Elige entre amenazas a distancia y terrestres"],
    ["Carrera de Madriguera", "Cargas de jabalíes cruzan ambas rutas"],
    ["Relevo de Espinas", "Abre terreno seguro antes de que crezcan las raíces"],
    ["Coloso de Espinas", "Expón el núcleo después de su golpe de raíces"],
    ["Umbral de Brasas", "Las franjas de fuego se encienden por ciclos"],
    ["Persecución de Ceniza", "Los lobos de brasa dejan rastros temporales de fuego"],
    ["Elevador del Horno", "Plataformas rápidas pasan sobre franjas de fuego"],
    ["Nido de Ala Ceniza", "Prioriza amenazas en picado y terrestres"],
    ["Dracónido de Ceniza", "Sobrevive al abanico aéreo y castiga su aterrizaje"],
    ["Acceso a la Grieta", "Ráfagas periódicas alteran el movimiento horizontal"],
    ["Percha Evanescente", "Sigue a los murciélagos que saltan entre perchas marcadas"],
    ["Cacería del Espejo", "Los lobos espejo se dividen en ecos frágiles"],
    ["Puente del Eclipse", "Lee las ráfagas, disparos intermitentes y una cornisa móvil"],
    ["Ciervo del Eclipse", "Atrae su carga protegida contra el terreno"],
    ["Camino de la Corona", "Los enemigos de élite regresan combinados"],
    ["Prueba Séxtuple", "Seis funciones aparecen en parejas escalonadas"],
    ["Altar Roto", "Cuatro ciclos del terreno tienen avisos claros"],
    ["Último Sello", "Tres enemigos de élite protegen la corona"],
    ["Corona del Coloso", "El jefe final combina cristales, raíces y cargas"],
  ];
  STAGE_DEFINITIONS.forEach((definition, index) => {
    definition.nameEs = stageCopyEs[index][0];
    definition.hintEs = stageCopyEs[index][1];
  });

  function preloadImage(src) {
    const image = new Image();
    image.src = src;
    return image;
  }

  const shadowAssetPaths = {
    bg: "../../assets/shadow-wolf-stage-bg.webp",
    bgCrystal: "../../assets/shadow-wolf-bg-crystal-cavern.webp",
    bgJungle: "../../assets/shadow-wolf-bg-vine-jungle.webp",
    bgRift: "../../assets/shadow-wolf-bg-shadow-rift.webp",
    bgVolcanic: "../../assets/shadow-wolf-bg-volcanic-altar.webp",
    wolf: "../../assets/shadow-wolf-hero.webp",
    enemyWolf: "../../assets/shadow-wolf-enemy-hunter.webp",
    bat: "../../assets/shadow-wolf-enemy-bat-cutout.png",
    boar: "../../assets/shadow-wolf-enemy-boar-cutout.png",
    boss: "../../assets/shadow-wolf-boss-behemoth-cutout.png",
    bossBasilisk: "../../assets/shadow-wolf-boss-basilisk.webp",
    bossGuardian: "../../assets/shadow-wolf-boss-guardian.webp",
    bossColossus: "../../assets/shadow-wolf-boss-thorn-colossus.webp",
    bossWyvern: "../../assets/shadow-wolf-boss-cinder-wyvern.webp",
    bossStag: "../../assets/shadow-wolf-boss-eclipse-stag.webp",
    tiles: "../../assets/shadow-wolf-platform-tiles.webp",
    clawFx: "../../assets/shadow-wolf-fx-claw-slash.webp",
    dashFx: "../../assets/shadow-wolf-fx-dash-trail.webp",
    hitFx: "../../assets/shadow-wolf-fx-hit-spark.webp",
    projectileFx: "../../assets/shadow-wolf-fx-shadow-projectile.webp",
    chestFx: "../../assets/shadow-wolf-fx-chest-sparkle.webp",
    portalFx: "../../assets/shadow-wolf-fx-portal-glow.webp",
    relicSpark: "../../assets/shadow-wolf-relic-mist-amulet.webp",
  };

  const assets = Object.fromEntries(
    Object.entries(shadowAssetPaths).map(([key, src]) => [key, preloadImage(src)])
  );

  const relicIconMap = {
    relic_fang: "../../assets/shadow-wolf-relic-sharp-fang.webp",
    relic_fur: "../../assets/shadow-wolf-relic-thick-fur.webp",
    relic_boots: "../../assets/shadow-wolf-relic-wind-boots.webp",
  };

  const attributeChoiceIcons = {
    strength: "../../assets/shadow-wolf-relic-sharp-fang.webp",
    agility: "../../assets/shadow-wolf-relic-wind-boots.webp",
    constitution: "../../assets/shadow-wolf-relic-thick-fur.webp",
    luck: "../../assets/shadow-wolf-relic-shadow-lantern.webp",
  };

  const gearDb = {
    "sword-rare": { slot: "weapon", nameKey: "gear_sword_rare", typeKey: "rarity_rare", effectKey: "gear_sword_rare_desc", iconSrc: "../../assets/shadow-wolf-gear-crystal-fang.webp", bonusDmg: 4, bonusCrit: 0 },
    "dagger-epic": { slot: "weapon", nameKey: "gear_dagger_epic", typeKey: "rarity_epic", effectKey: "gear_dagger_epic_desc", iconSrc: "../../assets/shadow-wolf-gear-relic-claw.webp", bonusDmg: 8, bonusCrit: 0.1 },
    "armor-rare": { slot: "armor", nameKey: "gear_armor_rare", typeKey: "rarity_rare", effectKey: "gear_armor_rare_desc", iconSrc: "../../assets/shadow-wolf-gear-wolf-collar.webp", bonusHp: 10 },
    "armor-epic": { slot: "armor", nameKey: "gear_armor_epic", typeKey: "rarity_epic", effectKey: "gear_armor_epic_desc", iconSrc: "../../assets/shadow-wolf-gear-leather-harness.webp", bonusHp: 20 },
    "boots-rare": { slot: "boots", nameKey: "gear_boots_rare", typeKey: "rarity_rare", effectKey: "gear_boots_rare_desc", iconSrc: "../../assets/shadow-wolf-gear-explorer-boots.webp", bonusJump: 1.0, bonusSpeed: 0 },
    "boots-epic": { slot: "boots", nameKey: "gear_boots_epic", typeKey: "rarity_epic", effectKey: "gear_boots_epic_desc", iconSrc: "../../assets/shadow-wolf-gear-swift-boots.webp", bonusJump: 1.5, bonusSpeed: 0.8 },
  };

  // State Variables
  let state = {
    amuletUnlocked: false,
    runs: 0,
    bestRoom: 0,
    wins: 0,
    unlockedStage: 1,
    selectedStage: 1,
    completedStages: [],
    playerMaxHp: 30,
    playerHp: 30,
    level: 1,
    exp: 0,
    expNeed: 100,
    room: 1,
    stageCleared: false,
    hazardClock: 0,
    keys: 0,
    gameActive: false,
    gameLoopId: null,

    // Wolf Physics States
    x: 80,
    y: 350,
    vx: 0,
    vy: 0,
    width: 38,
    height: 30,
    grounded: false,
    doubleJumpAvailable: true,
    facing: "right",
    dashCooldown: 0,
    dashTimer: 0,
    attackTimer: 0,
    invincibilityTimer: 0,
    entryGraceFrames: 0,

    // Base Stats
    baseDmg: 10,
    baseSpeed: 3.5,
    baseJump: 10.5,
    baseCrit: 0.05,
    attributePoints: 0,
    strength: 0,
    agility: 0,
    constitution: 0,
    luck: 0,
    zone: 1,

    // Relic buff counts
    relicAtkCount: 0,
    relicHpCount: 0,
    relicJumpCount: 0,

    // Equipment Slots
    eqWeapon: null,
    eqArmor: null,
    eqBoots: null,

    // 2D Entities
    enemies: [],
    bullets: [], // Enemy projectiles
    orbs: [],
    pickups: [],
    particles: [],
  };
  let backgroundBattleSuspended = false;
  let windowFocused = document.hasFocus();
  let battlePaused = false;
  let settlementPending = false;
  let settlementTimer = 0;
  let settlementDeadline = 0;
  let settlementRemaining = 0;
  const SIMULATION_STEP_MS = 1000 / 60;
  const MAX_SIMULATION_STEPS = 6;
  let simulationAccumulator = 0;
  let simulationFrameAt = 0;

  function resetSimulationClock() {
    simulationAccumulator = 0;
    simulationFrameAt = 0;
  }

  // Level platforms geometry lists
  let platforms = [];
  let spikesList = [];
  let hazardZones = [];
  let damageNumbers = [];
  let selectedStage = 1;
  const stageNames = ["", "月影遺跡", "水晶斷橋", "古獸祭壇"];

  // Inputs
  let keysPressed = {};
  let mobileInput = { left: false, right: false };
  const mobilePointerOwners = { left: null, right: null };

  function clearActiveInputs() {
    Object.keys(keysPressed).forEach((key) => { keysPressed[key] = false; });
    mobileInput.left = false;
    mobileInput.right = false;
    mobilePointerOwners.left = null;
    mobilePointerOwners.right = null;
  }

  function loadLocalState() {
    try {
      const data = JSON.parse(readStorage(saveKey) || "{}");
      state.amuletUnlocked = !!data.amuletUnlocked;
      state.runs = Math.max(0, Number.parseInt(data.runs, 10) || 0);
      const legacyBestRoom = Math.max(0, Math.min(8, Number.parseInt(data.bestRoom, 10) || 0));
      const migratedUnlock = legacyBestRoom >= 8 ? STAGE_COUNT : Math.min(STAGE_COUNT, Math.max(1, legacyBestRoom * 4 + 1));
      state.unlockedStage = Math.max(1, Math.min(STAGE_COUNT, Number.parseInt(data.unlockedStage, 10) || migratedUnlock));
      state.selectedStage = Math.max(1, Math.min(state.unlockedStage, Number.parseInt(data.selectedStage, 10) || state.unlockedStage));
      state.completedStages = Array.isArray(data.completedStages)
        ? [...new Set(data.completedStages.map(Number).filter((value) => value >= 1 && value <= STAGE_COUNT))].sort((a, b) => a - b)
        : Array.from({ length: Math.max(0, state.unlockedStage - 1) }, (_, index) => index + 1);
      state.bestRoom = Math.max(state.completedStages.length, Math.min(STAGE_COUNT, Number.parseInt(data.bestStage, 10) || 0));
      state.wins = Math.max(0, Number.parseInt(data.wins, 10) || 0);
    } catch {
      state.amuletUnlocked = false;
      state.runs = 0;
      state.bestRoom = 0;
      state.wins = 0;
      state.unlockedStage = 1;
      state.selectedStage = 1;
      state.completedStages = [];
    }
  }

  function saveLocalState() {
    writeStorage(saveKey, JSON.stringify({
      amuletUnlocked: state.amuletUnlocked,
      runs: state.runs,
      bestRoom: Math.min(8, Math.ceil(state.bestRoom * 8 / STAGE_COUNT)),
      bestStage: state.bestRoom,
      wins: state.wins,
      unlockedStage: state.unlockedStage,
      selectedStage: state.selectedStage,
      completedStages: state.completedStages,
    }));
  }

  function getLocale() {
    const requested = window.WonderI18n?.locale?.() || readStorage(localeKey) || "en";
    return text[requested] || window.WonderI18n?.supportedLocales?.includes(requested) ? requested : "en";
  }

  function t(key, params = {}) {
    const locale = getLocale();
    const raw = text[locale]?.[key] || text.en[key] || key;
    return Object.entries(params).reduce((str, [k, v]) => str.replaceAll(`{${k}}`, String(v)), raw);
  }

  function assetImg(src, alt = "") {
    return `<img src="${src}" alt="${alt}" loading="lazy" decoding="async" />`;
  }

  function renderAdventureRecord() {
    if (nodes.campaignSummary) nodes.campaignSummary.textContent = `${state.completedStages.length} / ${STAGE_COUNT}`;
    if (nodes.adventureRecordText) nodes.adventureRecordText.textContent = t("adventureRecordText", { runs: state.runs, best: state.bestRoom, wins: state.wins, unlocked: state.unlockedStage });
  }

  function translateUI() {
    const locale = getLocale();
    document.documentElement.lang = locale;
    for (const el of document.querySelectorAll("[data-ui]")) {
      const key = el.dataset.ui;
      el.textContent = t(key);
    }
    for (const el of document.querySelectorAll("[data-ui-aria]")) {
      el.setAttribute("aria-label", t(el.dataset.uiAria));
    }
    for (const el of document.querySelectorAll("[data-ui-alt]")) {
      el.setAttribute("alt", t(el.dataset.uiAlt));
    }
    nodes.localeSelect.value = getLocale();
    renderStageCards();
    const publicMeta = locale === "zh-Hant"
      ? { title: "\u5f71\u72fc\u50b3\u8aaa - WeightPlay", description: "\u638c\u63e1 30 \u500b\u5e73\u53f0\u52d5\u4f5c\u95dc\u5361\u3001\u53cd\u5236\u7279\u6b8a\u6575\u4eba\u3001\u914d\u7f6e\u56db\u7a2e\u5c6c\u6027\uff0c\u4e26\u64ca\u6557\u516d\u96bb\u4e0d\u540c\u9996\u9818\u3002" }
      : locale === "es"
        ? { title: "Lobo Sombrío - WeightPlay", description: "Supera 30 niveles de plataformas, responde a enemigos especiales, distribuye cuatro atributos y derrota a seis jefes distintos." }
        : { title: "Shadow Wolf Legend - WeightPlay", description: "Master 30 platform-action stages, counter special enemies, shape four attributes, and defeat six distinct Shadow Wolf Bosses." };
    document.title = publicMeta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", publicMeta.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", publicMeta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", publicMeta.description);
    updateDiamondShopUI();
    renderEquippedGear();
    renderAdventureRecord();
  }

  const stageCopy = {
    en: [
      ["Moonshade Gate", "Patrol wolves"],
      ["Mosscliff", "High ledge ambush"],
      ["Crystal Mouth", "Crystal spikes"],
      ["Dusk Bridge", "Bat swarm"],
      ["Vine Passage", "Twin traps"],
      ["Ancient Steps", "Boar guardian"],
      ["Rift Depths", "Elite hunt"],
      ["Behemoth Altar", "Boss battle"],
    ],
    "zh-Hant": [
      ["月影入口", "巡邏狼群"],
      ["苔石斷崖", "高台伏擊"],
      ["螢晶洞口", "水晶尖刺"],
      ["暮影橋頭", "飛蝠群"],
      ["藤蔓回廊", "雙重陷阱"],
      ["古樹祭階", "戰豬守衛"],
      ["裂谷深處", "精英狩獵"],
      ["古獸祭壇", "首領戰"],
    ],
  };

  function renderStageCards() {
    const rail = document.querySelector(".world-map-grid.stage-rail");
    if (!rail) return;
    rail.innerHTML = "";
    const locale = getLocale();
    STAGE_DEFINITIONS.forEach((definition) => {
      const locked = definition.id > state.unlockedStage;
      const cleared = state.completedStages.includes(definition.id);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `zone-node stage-card${definition.boss ? " boss-zone" : ""}${definition.id === state.selectedStage ? " is-selected" : ""}${cleared ? " is-cleared" : ""}`;
      button.dataset.zone = String(definition.id);
      button.disabled = locked;
      const title = locale === "zh-Hant" ? definition.nameZht : locale === "es" ? definition.nameEs : definition.nameEn;
      const hint = locale === "zh-Hant" ? definition.hintZht : locale === "es" ? definition.hintEs : definition.hintEn;
      const stateLabel = locked
        ? locale === "zh-Hant" ? "\u5c1a\u672a\u89e3\u9396" : locale === "es" ? "Bloqueado" : "Locked"
        : cleared
          ? locale === "zh-Hant" ? "\u5df2\u901a\u95dc" : locale === "es" ? "Completado" : "Cleared"
          : locale === "zh-Hant" ? "\u53ef\u6311\u6230" : locale === "es" ? "Disponible" : "Ready";
      const regionLabel = locale === "zh-Hant" ? `\u5340\u57df ${definition.region}` : locale === "es" ? `Región ${definition.region}` : `Region ${definition.region}`;
      button.innerHTML = `<b>${String(definition.id).padStart(2, "0")} · ${regionLabel}</b><span>${title}</span><small>${hint}</small><small>${stateLabel}</small>`;
      button.setAttribute("aria-label", `${definition.id}. ${title}: ${hint}. ${stateLabel}`);
      button.addEventListener("keydown", (event) => {
        if (mainEntryKeyboardKey && event.repeat && event.key === mainEntryKeyboardKey) event.preventDefault();
      });
      button.addEventListener("click", () => {
        if (locked) return;
        window.WonderSound?.play("click");
        state.selectedStage = definition.id;
        saveLocalState();
        startRun(definition.id);
      });
      rail.appendChild(button);
    });
    nodes.zoneButtons = Array.from(rail.querySelectorAll("[data-zone]"));
    requestAnimationFrame(() => rail.querySelector(".is-selected")?.scrollIntoView({ block: "nearest", inline: "center" }));
  }

  function setScreen(screen) {
    document.body.dataset.shadowWolfScreen = screen;
    document.documentElement.dataset.shadowWolfScreen = screen;
  }

  function stageManagementCoveredRegions() {
    return Array.from(nodes.stageManagementPanel?.parentElement?.children || [])
      .filter((node) => node !== nodes.stageManagementPanel && !node.classList.contains("stage-ad-reserve"));
  }

  function closeStageManagement(restoreFocus = true) {
    if (!nodes.stageManagementPanel || nodes.stageManagementPanel.classList.contains("hidden")) return;
    nodes.stageManagementPanel.classList.add("hidden");
    nodes.stageWorkshopBtn?.setAttribute("aria-expanded", "false");
    stageManagementCoveredRegions().forEach((region) => {
      region.inert = false;
      region.removeAttribute("aria-hidden");
    });
    if (restoreFocus && document.body.dataset.shadowWolfScreen === "stage") nodes.stageWorkshopBtn?.focus({ preventScroll: true });
  }

  function openStageManagement() {
    if (document.body.dataset.shadowWolfScreen !== "stage" || !nodes.stageManagementPanel?.classList.contains("hidden")) return;
    clearAmuletConfirmation();
    renderAdventureRecord();
    updateDiamondShopUI();
    nodes.stageManagementPanel.classList.remove("hidden");
    nodes.stageWorkshopBtn?.setAttribute("aria-expanded", "true");
    stageManagementCoveredRegions().forEach((region) => {
      region.inert = true;
      region.setAttribute("aria-hidden", "true");
    });
    nodes.stageManagementCloseBtn?.focus({ preventScroll: true });
  }

  function trapStageManagementFocus(event) {
    if (nodes.stageManagementPanel?.classList.contains("hidden")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeStageManagement(true);
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [nodes.stageManagementCloseBtn, nodes.amuletBtn].filter((node) => node && !node.disabled);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  }

  function showStage() {
    cancelPendingSettlement();
    closeStageManagement(false);
    closePause(false);
    clearAmuletConfirmation();
    clearActiveInputs();
    state.gameActive = false;
    cancelAnimationFrame(state.gameLoopId);
    setResultModalOpen(false, false);
    nodes.menuPanel.classList.add("hidden");
    nodes.gamePanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.mapPanel.classList.remove("hidden");
    setScreen("stage");
    renderStageCards();
  }

  function showMain() {
    cancelPendingSettlement();
    closeStageManagement(false);
    closePause(false);
    clearAmuletConfirmation();
    clearActiveInputs();
    setResultModalOpen(false, false);
    state.gameActive = false;
    cancelAnimationFrame(state.gameLoopId);
    nodes.gamePanel.classList.add("hidden");
    nodes.mapPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.menuPanel.classList.remove("hidden");
    setScreen("main");
    updateDiamondShopUI();
    renderAdventureRecord();
  }

  function clearAmuletConfirmation() {
    clearTimeout(amuletConfirmTimer);
    amuletConfirmTimer = 0;
    amuletConfirmRemaining = 0;
    amuletConfirmDueAt = 0;
    amuletConfirmPending = false;
    nodes.amuletBtn?.classList.remove("is-confirming");
  }

  function armAmuletConfirmation(delay = amuletConfirmRemaining) {
    if (!amuletConfirmPending || document.hidden) return;
    clearTimeout(amuletConfirmTimer);
    amuletConfirmRemaining = Math.max(0, Number(delay) || 0);
    amuletConfirmDueAt = performance.now() + amuletConfirmRemaining;
    amuletConfirmTimer = window.setTimeout(() => {
      amuletConfirmTimer = 0;
      amuletConfirmRemaining = 0;
      amuletConfirmDueAt = 0;
      if (!amuletConfirmPending || document.hidden) return;
      clearAmuletConfirmation();
      updateDiamondShopUI();
    }, amuletConfirmRemaining);
  }

  function suspendAmuletConfirmation() {
    if (!amuletConfirmPending || !amuletConfirmTimer) return;
    amuletConfirmRemaining = Math.max(0, amuletConfirmDueAt - performance.now());
    clearTimeout(amuletConfirmTimer);
    amuletConfirmTimer = 0;
    amuletConfirmDueAt = 0;
  }

  function resumeAmuletConfirmation() {
    if (!amuletConfirmPending || amuletConfirmTimer || document.hidden) return;
    armAmuletConfirmation();
  }

  function updateDiamondShopUI() {
    const wallet = window.WeightPlayWallet?.read() || { diamonds: 0 };
    nodes.diamondBalance.textContent = wallet.diamonds;

    if (state.amuletUnlocked) {
      clearAmuletConfirmation();
      nodes.amuletStatus.textContent = t("amuletOwned");
      nodes.amuletBtn.disabled = true;
      nodes.amuletBtn.removeAttribute("aria-label");
      nodes.amuletBtn.querySelector("strong").textContent = t("amuletName");
      nodes.amuletBtn.querySelector("small").textContent = t("amuletOwned");
      nodes.amuletBtn.querySelector("b").style.display = "none";
    } else {
      const after = Math.max(0, wallet.diamonds - amuletCost);
      nodes.amuletStatus.textContent = amuletConfirmPending
        ? t("amuletDecision", { before: wallet.diamonds, after })
        : wallet.diamonds < amuletCost
          ? t("amuletNeed", { balance: wallet.diamonds })
          : "";
      nodes.amuletBtn.disabled = wallet.diamonds < amuletCost;
      nodes.amuletBtn.classList.toggle("is-confirming", amuletConfirmPending);
      nodes.amuletBtn.setAttribute("aria-label", amuletConfirmPending
        ? t("amuletConfirmLabel", { before: wallet.diamonds, after })
        : t("amuletLabel", { balance: wallet.diamonds }));
      nodes.amuletBtn.querySelector("strong").textContent = t("amuletName");
      nodes.amuletBtn.querySelector("small").textContent = t("amuletEffect");
      nodes.amuletBtn.querySelector("b").style.display = "flex";
      nodes.amuletBtn.querySelector("b span").textContent = amuletConfirmPending
        ? t("amuletConfirm", { before: wallet.diamonds, after })
        : amuletCost;
    }
  }

  // Attributes drive the entire progression system; there is no gear layer.
  function getStats() {
    return {
      dmg: state.baseDmg + state.strength * 2,
      speed: state.baseSpeed + state.agility * 0.12,
      jump: state.baseJump + state.agility * 0.08,
      crit: Math.min(0.7, state.baseCrit + state.luck * 0.012),
      maxHp: (state.amuletUnlocked ? 40 : 30) + state.constitution * 8,
      defense: state.constitution * 0.55,
      dodge: Math.min(0.35, state.agility * 0.012),
      expBonus: 1 + state.luck * 0.08,
      attackFrames: Math.max(7, 18 - state.agility),
    };
  }

  function renderStatsPanel() {
    const stats = getStats();
    nodes.statDmg.textContent = stats.dmg.toFixed(0);
    nodes.statSpeed.textContent = stats.speed.toFixed(1);
    nodes.statJump.textContent = stats.maxHp.toFixed(0);
    nodes.statCrit.textContent = `${Math.round(stats.crit * 100)}%`;
    nodes.attrPoints.textContent = state.attributePoints;
    nodes.attrStrength.textContent = state.strength;
    nodes.attrAgility.textContent = state.agility;
    nodes.attrConstitution.textContent = state.constitution;
    nodes.attrLuck.textContent = state.luck;

    nodes.hpText.textContent = `${Math.ceil(state.playerHp)}/${stats.maxHp}`;
    nodes.hpFill.style.width = `${(state.playerHp / stats.maxHp) * 100}%`;
    nodes.attributeButtons.forEach((button) => {
      button.disabled = state.attributePoints < 1;
    });
  }

  function attributePreview(attribute) {
    const before = getStats();
    state[attribute] += 1;
    const after = getStats();
    state[attribute] -= 1;
    if (attribute === "strength") return t("attributeDamagePreview", { from: before.dmg.toFixed(0), to: after.dmg.toFixed(0) });
    if (attribute === "agility") return t("attributeSpeedPreview", { from: before.speed.toFixed(1), to: after.speed.toFixed(1) });
    if (attribute === "constitution") return t("attributeHpPreview", { from: before.maxHp.toFixed(0), to: after.maxHp.toFixed(0) });
    return t("attributeCritPreview", { from: Math.round(before.crit * 100), to: Math.round(after.crit * 100) });
  }

  function renderAttributeDraft() {
    const attributes = ["strength", "agility", "constitution", "luck"];
    nodes.attributeChoiceDesc.textContent = t("attributeChoiceDesc", { points: state.attributePoints });
    nodes.draftCards.innerHTML = attributes.map((attribute) => {
      const name = t(`attribute${attribute[0].toUpperCase()}${attribute.slice(1)}`);
      const effect = attributePreview(attribute);
      return `
        <button class="attribute-choice" type="button" data-draft-attribute="${attribute}" aria-label="${t("attributeChoiceAria", { name, effect })}">
          <img src="${attributeChoiceIcons[attribute]}" alt="" />
          <span><strong>${name}</strong><small>${effect}</small></span>
          <b>+1</b>
        </button>
      `;
    }).join("");
  }

  function draftCoveredRegions() {
    const siblings = Array.from(nodes.draftPanel.parentElement?.children || [])
      .filter((node) => node !== nodes.draftPanel && node !== nodes.resultPanel);
    const sidebar = nodes.gamePanel.querySelector(".attribute-sidebar");
    return sidebar ? [...siblings, sidebar] : siblings;
  }

  function setDraftModalOpen(open) {
    nodes.draftPanel.classList[open ? "remove" : "add"]("hidden");
    draftCoveredRegions().forEach((region) => {
      region.inert = open;
      if (open) region.setAttribute("aria-hidden", "true");
      else region.removeAttribute("aria-hidden");
    });
    window.requestAnimationFrame(() => {
      const target = open ? nodes.draftCards.querySelector(".attribute-choice") : nodes.gameCanvas;
      target?.focus({ preventScroll: true });
    });
  }

  function trapDraftFocus(event) {
    if (event.key !== "Tab" || nodes.draftPanel.classList.contains("hidden")) return;
    const choices = Array.from(nodes.draftCards.querySelectorAll(".attribute-choice:not(:disabled)"));
    if (!choices.length) return;
    const first = choices[0];
    const last = choices.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function renderEquippedGear() {
    // Kept as a harmless compatibility hook for saved sessions from the old gear build.
  }

  // The background contains three readable stone surfaces. Keep every collision
  // surface on those visible ledges so the player never has to guess the floor.
  const stageTerrain = Object.freeze([
    { x: 0, y: 370, w: 800, h: 130, kind: "ground" },
    { x: 0, y: 170, w: 310, h: 24, kind: "ledge" },
    { x: 520, y: 210, w: 280, h: 24, kind: "ledge" },
  ]);
  const mainFloorY = stageTerrain[0].y;

  const zoneObstacleLayouts = {
    1: [{ x: 180, y: 302, w: 118 }, { x: 498, y: 286, w: 92 }],
    2: [{ x: 110, y: 310, w: 92 }, { x: 380, y: 270, w: 126 }, { x: 645, y: 310, w: 82 }],
    3: [{ x: 260, y: 315, w: 92 }, { x: 520, y: 250, w: 116 }],
    4: [{ x: 170, y: 270, w: 104, moving: true, minX: 110, maxX: 330, speed: 0.8 }, { x: 570, y: 300, w: 96 }],
    5: [{ x: 90, y: 285, w: 116 }, { x: 350, y: 325, w: 78, moving: true, minX: 310, maxX: 500, speed: 1.05 }, { x: 620, y: 258, w: 105 }],
    6: [{ x: 240, y: 292, w: 150 }, { x: 540, y: 320, w: 104 }],
    7: [{ x: 135, y: 315, w: 82, moving: true, minX: 80, maxX: 260, speed: 1.2 }, { x: 390, y: 255, w: 116 }, { x: 650, y: 298, w: 80 }],
    8: [{ x: 220, y: 315, w: 105 }, { x: 470, y: 315, w: 105 }],
  };

  // Calculated from each transparent PNG's alpha bounds: these align visible feet
  // with the collision-box bottom rather than assuming every sprite shares a canvas crop.
  const spriteAnchors = Object.freeze({
    heroY: -55.4,
    hunterY: -39.2,
    boarY: -27.1,
    behemothY: -11.6,
    basiliskY: -19.1,
    guardianY: -20.9,
  });

  function addBackgroundAlignedTerrain(spike) {
    platforms.push(...stageTerrain.map((platform) => ({ ...platform })));
    if (spike) spikesList.push(spike);
  }

  // Setup platform configurations per room
  function buildLegacyRoomGeometry() {
    platforms = [];
    spikesList = [];
    state.enemies = [];
    state.bullets = [];
    state.orbs = [];
    state.pickups = [];
    damageNumbers = [];

    const room = state.room;
    if (room === 1 || room === 4 || room === 7) {
      // Room 1: the hazard sits visibly on the main stone path, never below it.
      addBackgroundAlignedTerrain({ x: room === 4 ? 235 : room === 7 ? 470 : 350, y: mainFloorY - 25, w: room === 7 ? 150 : 100, h: 25 });

      // Spawns
      state.enemies.push({ x: 250, y: mainFloorY - 24, width: 24, height: 24, hp: 12, maxHp: 12, speed: 1.0, type: "wolf", bounds: { min: 80, max: 330 }, isElite: false });
      state.enemies.push({ x: 150, y: 146, width: 24, height: 24, hp: 12, maxHp: 12, speed: 1.0, type: "wolf", bounds: { min: 60, max: 280 }, isElite: false });
      
      // Elite drops Key
      state.enemies.push({ x: 680, y: 178, width: 32, height: 32, hp: 40, maxHp: 40, speed: 1.5, type: "wolf", bounds: { min: 550, max: 770 }, isElite: true });

      state.x = 80;
      state.y = mainFloorY - state.height;
    } else if (room === 2 || room === 5) {
      // Room 2 reuses the same illustrated ruins, with a smaller visible hazard.
      addBackgroundAlignedTerrain({ x: room === 5 ? 470 : 320, y: mainFloorY - 25, w: room === 5 ? 125 : 85, h: 25 });

      // Spawns (Bats shoot projectiles)
      state.enemies.push({ x: 280, y: 140, width: 24, height: 24, hp: 15, maxHp: 15, type: "bat", shootCooldown: 60 });
      state.enemies.push({ x: 480, y: 205, width: 24, height: 24, hp: 15, maxHp: 15, type: "bat", shootCooldown: 100 });
      
      // Elite Boar
      state.enemies.push({ x: 680, y: 176, width: 34, height: 34, hp: 80, maxHp: 80, speed: 1.2, type: "boar", bounds: { min: 550, max: 770 }, isElite: true });

      state.x = 60;
      state.y = mainFloorY - state.height;
    } else if (room === 8) {
      // Room 3: Flat arena boss chamber
      addBackgroundAlignedTerrain();

      // Giant Boss Behemoth
      state.enemies.push({ x: 570, y: mainFloorY - 110, width: 110, height: 110, hp: 180, maxHp: 180, speed: 1.45, type: "boss", variant: "behemoth", dir: -1, isElite: true, shootCooldown: 105 });

      state.x = 80;
      state.y = mainFloorY - state.height;
    } else {
      addBackgroundAlignedTerrain({ x: 430, y: mainFloorY - 25, w: 140, h: 25 });
      state.enemies.push({ x: 210, y: mainFloorY - 24, width: 26, height: 26, hp: 30, maxHp: 30, speed: 1.35, type: "wolf", bounds: { min: 80, max: 350 }, isElite: false });
      state.enemies.push({ x: 610, y: 176, width: 34, height: 34, hp: 65, maxHp: 65, speed: 1.35, type: "boar", bounds: { min: 530, max: 770 }, isElite: true });
      state.x = 80;
      state.y = mainFloorY - state.height;
    }

    (zoneObstacleLayouts[room] || []).forEach((obstacle) => {
      platforms.push({ ...obstacle, h: 22, kind: "generated", dir: 1 });
    });

    const miniBosses = {
      4: { variant: "basilisk", x: 560, y: mainFloorY - 82, width: 82, height: 82, hp: 105, maxHp: 105, speed: 1.35, shootCooldown: 105 },
      6: { variant: "guardian", x: 545, y: mainFloorY - 96, width: 96, height: 96, hp: 135, maxHp: 135, speed: 1.05, shootCooldown: 95 },
    };
    if (miniBosses[room]) {
      state.enemies = [{ ...miniBosses[room], type: "boss", dir: -1, isElite: true }];
    }
  }

  function stageDefinition(stageNo = state.room) {
    return STAGE_DEFINITIONS[Math.max(1, Math.min(STAGE_COUNT, Number(stageNo) || 1)) - 1];
  }

  function enemyProfile(type, index, stageNo) {
    const stageBand = Math.floor((stageNo - 1) / 8);
    const isBat = type.includes("bat");
    const isBoar = type.includes("boar");
    const baseType = isBat ? "bat" : isBoar ? "boar" : "wolf";
    const width = isBoar ? 36 : isBat ? 28 : 30;
    const height = isBoar ? 34 : isBat ? 28 : 30;
    const baseHp = isBoar ? 34 : isBat ? 18 : 22;
    const xPositions = [220, 430, 650, 310, 560, 720];
    const y = isBat ? (index % 2 ? 190 : 125) : mainFloorY - height;
    return {
      x: xPositions[index % xPositions.length],
      y,
      width,
      height,
      hp: baseHp + stageBand * 4,
      maxHp: baseHp + stageBand * 4,
      speed: 1 + stageBand * 0.08 + (type === "charger-boar" ? 0.45 : 0),
      type,
      baseType,
      bounds: { min: 70, max: 770, dir: index % 2 ? -1 : 1 },
      shootCooldown: 55 + index * 24,
      actionClock: 30 + index * 18,
      isElite: type !== baseType,
      armored: type === "armored-boar",
      armorOpen: false,
      hasSplit: type === "mirror-wolf",
    };
  }

  function bossProfile(variant, stageNo) {
    const profiles = {
      basilisk: { hp: 130, speed: 1.25, width: 98, height: 88 },
      guardian: { hp: 165, speed: 0.95, width: 110, height: 106 },
      colossus: { hp: 195, speed: 0.8, width: 120, height: 116 },
      wyvern: { hp: 210, speed: 1.4, width: 126, height: 110 },
      stag: { hp: 230, speed: 1.75, width: 128, height: 108 },
      behemoth: { hp: 270, speed: 1.25, width: 132, height: 122 },
    };
    const profile = profiles[variant] || profiles.behemoth;
    return {
      x: 590,
      y: mainFloorY - profile.height,
      width: profile.width,
      height: profile.height,
      hp: profile.hp,
      maxHp: profile.hp,
      speed: profile.speed,
      type: "boss",
      baseType: "boss",
      variant,
      dir: -1,
      isElite: true,
      shootCooldown: 90,
      actionClock: 0,
      phase: 0,
      vulnerable: variant !== "guardian" && variant !== "stag" && variant !== "colossus",
      shielded: variant === "guardian" || variant === "stag",
      stageNo,
    };
  }

  function addStageHazards(definition) {
    const hazard = definition.hazard;
    if (["spikes", "ledges", "moving", "mixed"].includes(hazard)) {
      spikesList.push({ x: 350, y: mainFloorY - 24, w: 100, h: 24, kind: "spike", active: true });
    }
    if (hazard.includes("moving") || hazard === "ledges") {
      platforms.push({ x: 300, y: 275, w: 120, h: 22, kind: "generated", moving: true, minX: 180, maxX: 510, speed: 1, dir: 1 });
      platforms.push({ x: 585, y: 230, w: 105, h: 22, kind: "generated", moving: false, dir: 1 });
    }
    if (["crystal", "crystal-moving", "shockwave", "venom", "bramble", "root", "fire", "fire-moving", "gust", "gust-moving", "mirror", "all"].includes(hazard)) {
      const kind = hazard.startsWith("crystal") ? "crystal" : hazard.startsWith("fire") ? "fire" : hazard.startsWith("gust") ? "gust" : hazard === "venom" ? "venom" : hazard === "shockwave" ? "shockwave" : "root";
      hazardZones.push({ kind, x: 330, y: mainFloorY - 22, w: 140, h: 22, active: false, warning: true, clock: 0 });
    }
    if (hazard === "all") {
      hazardZones.push({ kind: "crystal", x: 120, y: mainFloorY - 22, w: 90, h: 22, active: false, warning: true, clock: 45 });
      hazardZones.push({ kind: "fire", x: 590, y: mainFloorY - 22, w: 100, h: 22, active: false, warning: true, clock: 90 });
    }
  }

  function buildRoomGeometry() {
    platforms = stageTerrain.map((platform) => ({ ...platform }));
    spikesList = [];
    hazardZones = [];
    state.enemies = [];
    state.bullets = [];
    state.orbs = [];
    state.pickups = [];
    damageNumbers = [];
    const definition = stageDefinition();
    addStageHazards(definition);
    const layout = zoneObstacleLayouts[((definition.id - 1) % 8) + 1] || [];
    layout.forEach((obstacle) => platforms.push({ ...obstacle, h: 22, kind: "generated", dir: 1 }));
    if (definition.boss) state.enemies.push(bossProfile(definition.boss, definition.id));
    else definition.enemies.forEach((type, index) => state.enemies.push(enemyProfile(type, index, definition.id)));
    state.x = 70;
    state.y = mainFloorY - state.height;
    state.entryGraceFrames = 300;
  }

  // Active game start trigger
  function startRun(startStage = state.selectedStage) {
    cancelPendingSettlement();
    closePause(false);
    clearActiveInputs();
    setResultModalOpen(false, false);
    loadLocalState();
    const playableStage = Math.max(1, Math.min(state.unlockedStage, Number(startStage) || state.selectedStage || 1));
    state.selectedStage = playableStage;
    state.runs += 1;
    saveLocalState();
    const stats = getStats();
    state.playerMaxHp = stats.maxHp;
    state.playerHp = state.playerMaxHp;
    state.level = 1;
    state.exp = 0;
    state.expNeed = 100;
    state.room = playableStage;
    state.stageCleared = false;
    state.hazardClock = 0;
    state.keys = 0;

    state.eqWeapon = null;
    state.eqArmor = null;
    state.eqBoots = null;

    state.relicAtkCount = 0;
    state.relicHpCount = 0;
    state.relicJumpCount = 0;

    state.vx = 0;
    state.vy = 0;
    state.grounded = false;
    state.doubleJumpAvailable = true;
    state.dashCooldown = 0;
    state.dashTimer = 0;
    state.attackTimer = 0;
    state.invincibilityTimer = 0;

    buildRoomGeometry();

    nodes.menuPanel.classList.add("hidden");
    nodes.mapPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.gamePanel.classList.remove("hidden");
    setScreen("battle");

    renderStatsPanel();
    renderEquippedGear();
    updateHUDText();

    state.gameActive = true;
    nodes.gameCanvas.focus({ preventScroll: true });
    window.WonderSound?.play("start");

    cancelAnimationFrame(state.gameLoopId);
    resetSimulationClock();
    state.gameLoopId = requestAnimationFrame(updateGameEngine);
  }

  function updateHUDText() {
    nodes.roomText.textContent = `${state.room}/${STAGE_COUNT}`;
    nodes.keyText.textContent = state.attributePoints;
    nodes.levelVal.textContent = state.level;
    nodes.expText.textContent = `${state.exp}/${state.expNeed}`;
    nodes.expFill.style.width = `${(state.exp / state.expNeed) * 100}%`;
  }

  // Double Jump, Dash, Attack Slash
  function makePlayerJump() {
    const stats = getStats();
    if (state.grounded) {
      state.vy = -stats.jump;
      state.grounded = false;
      state.doubleJumpAvailable = true;
      window.WonderSound?.play("click");
    } else if (state.doubleJumpAvailable) {
      state.vy = -stats.jump * 0.95;
      state.doubleJumpAvailable = false;
      window.WonderSound?.play("click");
      createJumpDust(state.x + state.width / 2, state.y + state.height);
    }
  }

  function makePlayerAttack() {
    if (state.attackTimer > 0) return;
    const stats = getStats();
    state.attackTimer = stats.attackFrames;
    window.WonderSound?.play("shoot");

    // Attack collision sweeps forward
    const slashRange = 124;
    const slashWidth = 90;
    
    let ax = state.x + state.width;
    if (state.facing === "left") {
      ax = state.x - slashRange;
    }
    let ay = state.y - 22;

    const defeatedEnemies = [];
    state.enemies.forEach((enemy) => {
      if (enemy.hp <= 0) return;

      // Check intersection with slash AABB
      if (
        ax + slashRange > enemy.x &&
        ax < enemy.x + enemy.width &&
        ay + slashWidth > enemy.y &&
        ay < enemy.y + enemy.height
      ) {
        // Critical hit check
        const isCrit = Math.random() < stats.crit;
        let finalDmg = stats.dmg;
        if (isCrit) finalDmg *= 1.5;

        if (enemy.armored && !enemy.armorOpen) finalDmg *= 0.2;
        if (enemy.type === "boss" && (enemy.shielded || enemy.vulnerable === false)) finalDmg *= 0.15;
        enemy.hp -= finalDmg;
        enemy.hitTimer = 10;
        damageNumbers.push({ x: enemy.x + enemy.width / 2, y: enemy.y - 4, value: Math.round(finalDmg), crit: isCrit, life: 34 });
        createSlashSparks(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, isCrit);
        window.WonderSound?.play("hit");

        if (enemy.hp <= 0) {
          handleEnemyDefeated(enemy);
          defeatedEnemies.push(enemy);
        }
      }
    });
    if (defeatedEnemies.length) {
      const defeatedSet = new Set(defeatedEnemies);
      state.enemies = state.enemies.filter((enemy) => !defeatedSet.has(enemy));
    }
  }

  function makePlayerDash() {
    if (state.dashCooldown > 0) return;
    state.dashTimer = 15; // 15 frames dash duration
    state.dashCooldown = 60; // 1 second cooldown
    state.invincibilityTimer = 15;
    window.WonderSound?.play("click");
    createDashGhost(state.x, state.y);
  }

  function handleEnemyDefeated(enemy) {
    window.WonderSound?.play("enemyDown");
    
    // Spawn EXP orbs
    const value = enemy.isElite ? (enemy.type === "boss" ? 0 : 30) : 10;
    const count = enemy.isElite ? 8 : 2;
    for (let i = 0; i < count; i++) {
      state.orbs.push({
        x: enemy.x + Math.random() * enemy.width,
        y: enemy.y + Math.random() * enemy.height,
        vx: (Math.random() - 0.5) * 4,
        vy: -3 - Math.random() * 2,
        value: value,
      });
    }

    if (enemy.hasSplit) {
      state.enemies.push(
        { ...enemyProfile("mirror-echo", 3, state.room), x: Math.max(40, enemy.x - 24), hp: 8, maxHp: 8, hasSplit: false },
        { ...enemyProfile("mirror-echo", 4, state.room), x: Math.min(730, enemy.x + 24), hp: 8, maxHp: 8, hasSplit: false },
      );
    }

    const remaining = state.enemies.filter((candidate) => candidate !== enemy && candidate.hp > 0).length;
    if (enemy.type === "boss" || remaining === 0) {
      scheduleWinSettlement();
    }
  }

  // Level Up relic draft overlay
  function handleLevelUp() {
    state.level++;
    state.exp -= state.expNeed;
    state.expNeed = Math.floor(90 * Math.pow(state.level, 1.55));
    state.attributePoints += 2;
    state.gameActive = false;
    clearActiveInputs();
    cancelAnimationFrame(state.gameLoopId);
    window.WonderSound?.play("success");
    renderStatsPanel();
    updateHUDText();
    renderAttributeDraft();
    setDraftModalOpen(true);
  }

  function spendAttribute(attribute) {
    if (state.attributePoints < 1 || !Object.hasOwn(state, attribute)) return;
    state.attributePoints--;
    state[attribute]++;
    const stats = getStats();
    state.playerHp = Math.min(stats.maxHp, state.playerHp + (attribute === "constitution" ? 8 : 0));
    renderStatsPanel();
    updateHUDText();
    if (state.attributePoints > 0) {
      renderAttributeDraft();
      window.requestAnimationFrame(() => nodes.draftCards.querySelector(".attribute-choice")?.focus({ preventScroll: true }));
      return;
    }
    setDraftModalOpen(false);
    state.gameActive = true;
    resetSimulationClock();
    state.gameLoopId = requestAnimationFrame(updateGameEngine);
  }

  // Chest looting modal
  let currentLootItem = null;
  function triggerChestLoot() {
    state.gameActive = false;
    clearActiveInputs();
    window.WonderSound?.play("upgrade");

    const rolls = {
      1: ["sword-rare", "armor-rare", "boots-rare"],
      2: ["dagger-epic", "armor-epic", "boots-epic"],
    };

    const choices = rolls[state.room] || rolls[1];
    const picked = choices[Math.floor(Math.random() * choices.length)];
    currentLootItem = picked;

    const g = gearDb[picked];
    nodes.lootIcon.innerHTML = assetImg(g.iconSrc, t(g.nameKey));
    nodes.lootName.textContent = t(g.nameKey);
    nodes.lootType.textContent = t(g.typeKey);
    nodes.lootEffect.textContent = t(g.effectKey);

    // Platform runs should stay uninterrupted: chest gear immediately occupies its sidebar slot.
    equipLoot();
  }

  function equipLoot() {
    const g = gearDb[currentLootItem];
    if (g.slot === "weapon") {
      state.eqWeapon = currentLootItem;
    } else if (g.slot === "armor") {
      const oldStats = getStats();
      state.eqArmor = currentLootItem;
      const newStats = getStats();
      state.playerHp += (newStats.maxHp - oldStats.maxHp);
    } else if (g.slot === "boots") {
      state.eqBoots = currentLootItem;
    }

    nodes.lootPanel.classList.add("hidden");
    window.WonderSound?.play("success");

    state.gameActive = true;
    renderStatsPanel();
    renderEquippedGear();
    updateHUDText();
    resetSimulationClock();
    state.gameLoopId = requestAnimationFrame(updateGameEngine);
  }

  // Dungeons exit advance
  function enterNextRoom() {
    state.room++;
    state.keys = 0;
    
    // Partially heal wolf between rooms
    const stats = getStats();
    state.playerHp = Math.min(stats.maxHp, state.playerHp + 10);

    buildRoomGeometry();
    renderStatsPanel();
    updateHUDText();
    window.WonderSound?.play("start");
  }

  // End Expedition
  function resultCoveredRegions() {
    const arenaSiblings = Array.from(nodes.resultPanel.parentElement?.children || []).filter((node) => node !== nodes.resultPanel);
    const sidebar = nodes.gamePanel.querySelector(".attribute-sidebar");
    return sidebar ? [...arenaSiblings, sidebar] : arenaSiblings;
  }

  function pauseCoveredRegions() {
    const arenaSiblings = Array.from(nodes.pausePanel.parentElement?.children || []).filter((node) => node !== nodes.pausePanel);
    const sidebar = nodes.gamePanel.querySelector(".attribute-sidebar");
    return sidebar ? [...arenaSiblings, sidebar] : arenaSiblings;
  }

  function cancelPendingSettlement() {
    clearTimeout(settlementTimer);
    settlementTimer = 0;
    settlementDeadline = 0;
    settlementRemaining = 0;
    settlementPending = false;
  }

  function suspendPendingSettlement() {
    if (!settlementPending || !settlementTimer) return;
    settlementRemaining = Math.max(0, settlementDeadline - performance.now());
    clearTimeout(settlementTimer);
    settlementTimer = 0;
    settlementDeadline = 0;
  }

  function resumePendingSettlement() {
    if (!settlementPending || settlementTimer || !state.gameActive || document.hidden || !windowFocused) return;
    const delay = Math.max(0, settlementRemaining);
    settlementDeadline = performance.now() + delay;
    settlementTimer = window.setTimeout(() => {
      settlementTimer = 0;
      settlementDeadline = 0;
      settlementRemaining = 0;
      if (document.hidden || !windowFocused) {
        suspendPendingSettlement();
        return;
      }
      endGame(true);
    }, delay);
  }

  function scheduleWinSettlement() {
    if (settlementPending || !state.gameActive) return;
    settlementPending = true;
    settlementRemaining = 260;
    clearActiveInputs();
    resumePendingSettlement();
  }

  function openPause() {
    if (!state.gameActive || settlementPending || battlePaused || !nodes.draftPanel.classList.contains("hidden") || !nodes.resultPanel.classList.contains("hidden")) return;
    battlePaused = true;
    state.gameActive = false;
    clearActiveInputs();
    cancelAnimationFrame(state.gameLoopId);
    nodes.pausePanel.classList.remove("hidden");
    nodes.pauseBtn.setAttribute("aria-expanded", "true");
    pauseCoveredRegions().forEach((region) => {
      region.inert = true;
      region.setAttribute("aria-hidden", "true");
    });
    nodes.resumeBtn.focus({ preventScroll: true });
  }

  function closePause(resume = true) {
    if (!battlePaused && nodes.pausePanel?.classList.contains("hidden")) return;
    battlePaused = false;
    nodes.pausePanel.classList.add("hidden");
    nodes.pauseBtn.setAttribute("aria-expanded", "false");
    pauseCoveredRegions().forEach((region) => {
      region.inert = false;
      region.removeAttribute("aria-hidden");
    });
    if (!resume) return;
    state.gameActive = true;
    cancelAnimationFrame(state.gameLoopId);
    resetSimulationClock();
    state.gameLoopId = requestAnimationFrame(updateGameEngine);
    nodes.gameCanvas.focus({ preventScroll: true });
  }

  function trapPauseFocus(event) {
    if (nodes.pausePanel.classList.contains("hidden")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closePause(true);
      return;
    }
    if (event.key !== "Tab") return;
    if (event.shiftKey && document.activeElement === nodes.resumeBtn) {
      event.preventDefault();
      nodes.pauseStagesBtn.focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === nodes.pauseStagesBtn) {
      event.preventDefault();
      nodes.resumeBtn.focus({ preventScroll: true });
    }
  }

  function setResultModalOpen(open, focusPrimary = true) {
    nodes.resultPanel.classList[open ? "remove" : "add"]("hidden");
    resultCoveredRegions().forEach((region) => {
      region.inert = open;
      if (open) region.setAttribute("aria-hidden", "true");
      else region.removeAttribute("aria-hidden");
    });
    if (open && focusPrimary) (nodes.resultPanel.querySelector(".result-actions .primary-btn") || nodes.retryBtn).focus({ preventScroll: true });
  }

  function syncResultActionHierarchy(nextAvailable) {
    nodes.nextStageBtn.disabled = !nextAvailable;
    [nodes.resultMenuBtn, nodes.nextStageBtn, nodes.retryBtn].forEach((button) => {
      button.classList.remove("primary-btn");
      button.classList.add("secondary-btn");
    });
    const primary = nextAvailable
      ? nodes.nextStageBtn
      : state.stageCleared ? nodes.resultMenuBtn : nodes.retryBtn;
    primary.classList.remove("secondary-btn");
    primary.classList.add("primary-btn");
  }

  function trapResultFocus(event) {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      return;
    }
    if (event.key !== "Tab" || nodes.resultPanel.classList.contains("hidden")) return;
    const focusable = [nodes.resultMenuBtn, nodes.nextStageBtn, nodes.retryBtn].filter((button) => !button.disabled);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  }

  function legacyEndGame(won) {
    if (!state.gameActive) return;
    state.gameActive = false;
    clearActiveInputs();
    cancelAnimationFrame(state.gameLoopId);

    nodes.resultTitle.textContent = won ? t("runComplete") : t("runFailed");
    nodes.resultScore.textContent = won ? "8" : String(Math.max(0, state.room - 1));

    const cleared = won ? 8 : Math.max(0, state.room - 1);
    state.bestRoom = Math.max(state.bestRoom, won ? 8 : Math.max(0, state.room - 1));
    if (won) state.wins += 1;
    saveLocalState();
    renderAdventureRecord();
    let starsStr = "";
    if (cleared === 3) starsStr = "⭐⭐⭐⭐⭐";
    else if (cleared === 2) starsStr = "⭐⭐⭐";
    else if (cleared === 1) starsStr = "⭐";
    else starsStr = "☆";

    starsStr = cleared >= 8 ? "★★★" : cleared >= 5 ? "★★" : cleared >= 1 ? "★" : "—";
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
    setResultModalOpen(true);
  }

  function endGame(won) {
    if (!state.gameActive) return;
    cancelPendingSettlement();
    state.gameActive = false;
    clearActiveInputs();
    cancelAnimationFrame(state.gameLoopId);
    const clearedStage = state.room;
    nodes.resultPanel.dataset.settledStage = String(clearedStage);
    state.stageCleared = Boolean(won);
    nodes.resultTitle.textContent = won ? t("runComplete") : t("runFailed");
    nodes.resultScore.textContent = `${clearedStage}/${STAGE_COUNT}`;

    if (won) {
      if (!state.completedStages.includes(clearedStage)) state.completedStages.push(clearedStage);
      state.completedStages.sort((a, b) => a - b);
      state.bestRoom = Math.max(state.bestRoom, clearedStage);
      state.unlockedStage = Math.max(state.unlockedStage, Math.min(STAGE_COUNT, clearedStage + 1));
      if (clearedStage === STAGE_COUNT) state.wins += 1;
      window.WeightPlayWallet?.addDiamonds(BOSS_STAGES.has(clearedStage) ? (clearedStage === STAGE_COUNT ? 8 : 2) : 1);
      nodes.resultText.textContent = clearedStage === STAGE_COUNT
        ? "All 30 stages and six region bosses cleared! Replay any stage to refine your squad."
        : t("report_win", { stage: clearedStage });
      nodes.skillReportText.textContent = t("report_skill_win", { stage: clearedStage });
      window.WonderSound?.play("win");
    } else {
      nodes.resultText.textContent = t("report_partial", { stage: clearedStage });
      nodes.skillReportText.textContent = t("report_skill_partial", { stage: clearedStage });
      window.WonderSound?.play("wrong");
    }

    nodes.logicStars.textContent = won ? "\u2605\u2605\u2605" : "\u2605";
    nodes.focusStars.textContent = won ? "\u2605\u2605\u2605" : "\u2605";
    nodes.problemStars.textContent = won ? "\u2605\u2605\u2605" : "\u2605";
    state.selectedStage = won && clearedStage < STAGE_COUNT ? clearedStage + 1 : clearedStage;
    saveLocalState();
    renderAdventureRecord();
    syncResultActionHierarchy(won && clearedStage < STAGE_COUNT);
    setResultModalOpen(true);
  }

  function fireBossFan(enemy, count = 3, speed = 3.8) {
    const bossCenter = enemy.x + enemy.width / 2;
    const predictedX = state.x + state.width / 2 + state.vx * 14;
    const baseAngle = Math.atan2((state.y + state.height / 2) - (enemy.y + enemy.height * 0.45), predictedX - bossCenter);
    const spread = count === 1 ? [0] : Array.from({ length: count }, (_, index) => (index - (count - 1) / 2) * 0.18);
    spread.forEach((offset) => state.bullets.push({ x: bossCenter, y: enemy.y + enemy.height * 0.45, vx: Math.cos(baseAngle + offset) * speed, vy: Math.sin(baseAngle + offset) * speed, size: 6, kind: "boss" }));
  }

  function updateBossEnemy(enemy) {
    enemy.actionClock = (enemy.actionClock || 0) + 1;
    const nextPhase = enemy.hp <= enemy.maxHp * 0.35 ? 2 : enemy.hp <= enemy.maxHp * 0.7 ? 1 : 0;
    if (nextPhase > enemy.phase) {
      enemy.phase = nextPhase;
      enemy.shootCooldown = 10;
      hazardZones.push({ kind: enemy.variant === "wyvern" ? "fire" : enemy.variant === "basilisk" ? "venom" : "root", x: nextPhase === 1 ? 140 : 520, y: mainFloorY - 22, w: 120, h: 22, active: false, warning: true, clock: 0, expires: 260 });
    }
    if (enemy.openTimer > 0) {
      enemy.openTimer--;
      if (enemy.openTimer === 0) {
        enemy.shielded = enemy.variant === "guardian" || enemy.variant === "stag";
        enemy.vulnerable = enemy.variant !== "colossus";
      }
    }

    const playerCenter = state.x + state.width / 2;
    const bossCenter = enemy.x + enemy.width / 2;
    const gap = playerCenter - bossCenter;
    enemy.facing = gap < 0 ? "left" : "right";
    enemy.shootCooldown--;

    if (enemy.variant === "basilisk") {
      if (Math.abs(gap) > 160) enemy.x += Math.sign(gap) * enemy.speed;
      if (enemy.shootCooldown <= 0) {
        fireBossFan(enemy, 3 + enemy.phase * 2, 3.6);
        hazardZones.push({ kind: "venom", x: Math.max(40, state.x - 35), y: mainFloorY - 22, w: 100, h: 22, active: true, warning: false, clock: 80, expires: 190 });
        enemy.shootCooldown = 125 - enemy.phase * 18;
      }
    } else if (enemy.variant === "guardian") {
      if (enemy.actionClock % Math.max(115, 175 - enemy.phase * 22) === 0) {
        enemy.shielded = false;
        enemy.openTimer = 65;
        state.bullets.push({ x: enemy.x, y: mainFloorY - 12, vx: -5.2, vy: 0, size: 9, kind: "shockwave" });
        state.bullets.push({ x: enemy.x + enemy.width, y: mainFloorY - 12, vx: 5.2, vy: 0, size: 9, kind: "shockwave" });
      }
    } else if (enemy.variant === "colossus") {
      if (enemy.actionClock % Math.max(120, 190 - enemy.phase * 28) === 0) {
        enemy.vulnerable = true;
        enemy.openTimer = 75;
        hazardZones.push({ kind: "root", x: Math.max(45, state.x - 45), y: mainFloorY - 24, w: 110, h: 24, active: false, warning: true, clock: 25, expires: 170 });
      }
    } else if (enemy.variant === "wyvern") {
      const airborne = enemy.actionClock % 220 < 130;
      enemy.y += ((airborne ? 125 : mainFloorY - enemy.height) - enemy.y) * 0.08;
      enemy.vulnerable = !airborne;
      if (airborne && enemy.shootCooldown <= 0) {
        fireBossFan(enemy, 4 + enemy.phase, 4.1);
        enemy.shootCooldown = 80 - enemy.phase * 10;
      } else if (!airborne && enemy.actionClock % 220 === 145) {
        state.bullets.push({ x: enemy.x, y: mainFloorY - 12, vx: -5.8, vy: 0, size: 10, kind: "shockwave" });
      }
    } else if (enemy.variant === "stag") {
      if (!enemy.charging && enemy.actionClock % Math.max(105, 165 - enemy.phase * 20) === 0) {
        enemy.charging = true;
        enemy.chargeDir = Math.sign(gap || -1);
      }
      if (enemy.charging) {
        enemy.x += enemy.chargeDir * (8 + enemy.phase * 1.5);
        if (enemy.x <= 20 || enemy.x >= 650) {
          enemy.x = Math.max(20, Math.min(650, enemy.x));
          enemy.charging = false;
          enemy.shielded = false;
          enemy.openTimer = 60;
        }
      }
    } else {
      if (Math.abs(gap) > 180) enemy.x += Math.sign(gap) * enemy.speed;
      if (enemy.shootCooldown <= 0) {
        if (enemy.phase === 0) fireBossFan(enemy, 3, 3.8);
        else if (enemy.phase === 1) hazardZones.push({ kind: "crystal", x: Math.max(50, state.x - 40), y: mainFloorY - 22, w: 100, h: 22, active: false, warning: true, clock: 20, expires: 165 });
        else {
          hazardZones.push({ kind: "root", x: 250, y: mainFloorY - 22, w: 120, h: 22, active: false, warning: true, clock: 10, expires: 150 });
          fireBossFan(enemy, 5, 4.2);
        }
        enemy.shootCooldown = 105 - enemy.phase * 15;
      }
    }

    enemy.x = Math.max(20, Math.min(670, enemy.x));
    if (state.x + state.width > enemy.x && state.x < enemy.x + enemy.width && state.y + state.height > enemy.y && state.y < enemy.y + enemy.height) applyPlayerDamage(enemy.charging ? 7 : 4);
  }

  function updateStageHazards() {
    state.hazardClock++;
    hazardZones = hazardZones.filter((zone) => {
      if (zone.expires !== undefined) zone.expires--;
      const phase = (state.hazardClock + (zone.clock || 0)) % 180;
      zone.warning = phase < 55;
      zone.active = phase >= 55 && phase < 105;
      if (zone.kind === "gust" && zone.active) state.x += state.room % 2 ? 0.55 : -0.55;
      if (zone.active && zone.kind !== "gust" && state.x + state.width > zone.x && state.x < zone.x + zone.w && state.y + state.height > zone.y) applyPlayerDamage(zone.kind === "fire" ? 2.5 : 2);
      return zone.expires === undefined || zone.expires > 0;
    });
  }

  // Physics Loop frame updates
  function stepGameEngine() {
    if (!state.gameActive) return;
    if (state.entryGraceFrames > 0) state.entryGraceFrames--;

    // Redundant input values checking
    const stats = getStats();
    let moveDir = 0;
    if (keysPressed["a"] || keysPressed["arrowleft"] || mobileInput.left) {
      moveDir = -1;
      state.facing = "left";
    }
    if (keysPressed["d"] || keysPressed["arrowright"] || mobileInput.right) {
      moveDir = 1;
      state.facing = "right";
    }

    // Apply Dash speed boost
    let curSpeed = stats.speed;
    if (state.dashTimer > 0) {
      state.dashTimer--;
      curSpeed = stats.speed * 2.2;
      moveDir = state.facing === "right" ? 1 : -1;
    }

    state.vx = moveDir * curSpeed;
    updateStageHazards();

    platforms.forEach((platform) => {
      if (!platform.moving) return;
      platform.x += platform.speed * platform.dir;
      if (platform.x <= platform.minX || platform.x + platform.w >= platform.maxX) platform.dir *= -1;
    });

    // Apply Gravity AABB physics
    const gravityForce = 0.45;
    state.vy += gravityForce;

    // Apply positions
    state.x += state.vx;
    state.y += state.vy;

    // Cooldown ticks
    if (state.dashCooldown > 0) state.dashCooldown--;
    if (state.attackTimer > 0) state.attackTimer--;
    if (state.invincibilityTimer > 0) state.invincibilityTimer--;

    // Keep borders check
    if (state.x < 0) state.x = 0;
    if (state.x > 800 - state.width) state.x = 800 - state.width;

    // Platform Collisions AABB Check
    state.grounded = false;
    platforms.forEach((plat) => {
      // Check collision
      if (
        state.x + state.width > plat.x &&
        state.x < plat.x + plat.w &&
        state.y + state.height >= plat.y &&
        state.y + state.height - state.vy <= plat.y + 10
      ) {
        state.y = plat.y - state.height;
        state.vy = 0;
        state.grounded = true;
        state.doubleJumpAvailable = true;
      }
    });

    // Spikes Collisions
    spikesList.forEach((spike) => {
      if (
        state.x + state.width > spike.x &&
        state.x < spike.x + spike.w &&
        state.y + state.height > spike.y
      ) {
        // Fall into spikes respawns with penalty!
        if (state.invincibilityTimer === 0 && state.entryGraceFrames <= 0) {
          state.playerHp -= 5;
          state.invincibilityTimer = 40;
          state.x = 80;
          state.y = 200;
          state.vx = 0;
          state.vy = 0;
          window.WonderSound?.play("wrong");
          renderStatsPanel();

          if (state.playerHp <= 0) {
            endGame(false);
            return;
          }
        }
      }
    });

    // Move & Shoot enemies
    state.enemies.forEach((enemy, index) => {
      if (enemy.hitTimer > 0) enemy.hitTimer--;
      // Wolf/Boar walks along platform bounds
      if (enemy.baseType === "wolf" || enemy.baseType === "boar") {
        enemy.actionClock = (enemy.actionClock || 0) + 1;
        if (enemy.type === "charger-boar" && enemy.actionClock % 150 > 112) enemy.speed = 5.5;
        else if (enemy.baseType === "boar") enemy.speed = Math.min(enemy.speed, 1.8);
        enemy.x += enemy.speed * (enemy.bounds.dir || 1);
        if (enemy.x <= enemy.bounds.min) {
          enemy.bounds.dir = 1;
          if (enemy.armored) { enemy.armorOpen = true; enemy.openTimer = 70; }
        }
        if (enemy.x + enemy.width >= enemy.bounds.max) {
          enemy.bounds.dir = -1;
          if (enemy.armored) { enemy.armorOpen = true; enemy.openTimer = 70; }
        }
        if (enemy.openTimer > 0 && --enemy.openTimer === 0) enemy.armorOpen = false;
        if (enemy.type === "ember-wolf" && enemy.actionClock % 90 === 0) hazardZones.push({ kind: "fire", x: enemy.x, y: mainFloorY - 22, w: 72, h: 22, active: false, warning: true, clock: 55, expires: 145 });

        // Player Contact Damage check
        if (
          state.x + state.width > enemy.x &&
          state.x < enemy.x + enemy.width &&
          state.y + state.height > enemy.y &&
          state.y < enemy.y + enemy.height
        ) {
          applyPlayerDamage(enemy.baseType === "boar" ? 3.5 : 2.5);
        }
      } else if (enemy.baseType === "bat") {
        enemy.actionClock = (enemy.actionClock || 0) + 1;
        if (enemy.type === "rift-bat" && enemy.actionClock % 135 === 0) enemy.x = enemy.x < 400 ? 650 : 170;
        if (enemy.type === "dive-bat" && enemy.actionClock % 150 > 105) {
          enemy.x += Math.sign(state.x - enemy.x) * 2.8;
          enemy.y += Math.sign(state.y - enemy.y) * 2.2;
        }
        // Shoots projectiles
        enemy.shootCooldown--;
        if (enemy.shootCooldown <= 0) {
          enemy.shootCooldown = enemy.type === "crystal-bat" ? 105 : 120 + Math.random() * 45;
          const angle = Math.atan2((state.y + state.height / 2) - enemy.y, (state.x + state.width / 2) - enemy.x);
          const offsets = enemy.type === "crystal-bat" ? [-0.22, 0, 0.22] : [0];
          offsets.forEach((offset) => state.bullets.push({ x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height / 2, vx: Math.cos(angle + offset) * 3.5, vy: Math.sin(angle + offset) * 3.5, size: 5, kind: enemy.type }));
        }
      } else if (enemy.type === "boss") {
        updateBossEnemy(enemy);
        return;
        // Hold a deliberate combat distance and aim at the player's predicted path.
        const playerCenter = state.x + state.width / 2;
        const bossCenter = enemy.x + enemy.width / 2;
        const horizontalGap = playerCenter - bossCenter;
        enemy.facing = horizontalGap < 0 ? "left" : "right";
        if (Math.abs(horizontalGap) > 180) enemy.x += Math.sign(horizontalGap) * enemy.speed * 0.9;
        if (Math.abs(horizontalGap) < 100) enemy.x -= Math.sign(horizontalGap || 1) * enemy.speed * 0.55;
        enemy.x = Math.max(20, Math.min(670, enemy.x));
        enemy.shootCooldown--;
        if (enemy.shootCooldown <= 0) {
          enemy.shootCooldown = 115 + Math.random() * 35;
          const predictedX = playerCenter + state.vx * 18;
          const baseAngle = Math.atan2((state.y + state.height / 2) - (enemy.y + 46), predictedX - bossCenter);
          for (let aOffset of [-0.18, 0, 0.18]) {
            state.bullets.push({ x: bossCenter, y: enemy.y + 46, vx: Math.cos(baseAngle + aOffset) * 3.8, vy: Math.sin(baseAngle + aOffset) * 3.8, size: 6 });
          }
          window.WonderSound?.play("shoot");
        }

        // Boss contact dmg
        if (
          state.x + state.width > enemy.x &&
          state.x < enemy.x + enemy.width &&
          state.y + state.height > enemy.y &&
          state.y < enemy.y + enemy.height
        ) {
          applyPlayerDamage(0.35);
        }
      }
    });

    // Move & Check enemy bullets
    for (let index = state.bullets.length - 1; index >= 0; index--) {
      const bullet = state.bullets[index];
      bullet.x += bullet.vx;
      bullet.y += bullet.vy;

      // Contact player
      if (
        bullet.x > state.x &&
        bullet.x < state.x + state.width &&
        bullet.y > state.y &&
        bullet.y < state.y + state.height
      ) {
        state.bullets.splice(index, 1);
        applyPlayerDamage(5.0);
      }

      // Out of bounds
      if (bullet.x < -10 || bullet.x > 810 || bullet.y < -10 || bullet.y > 510) {
        const currentIndex = state.bullets.indexOf(bullet);
        if (currentIndex >= 0) state.bullets.splice(currentIndex, 1);
      }
    }

    // Move & Collect Relic Orbs
    state.orbs.forEach((orb, index) => {
      // Apply gravity to drop orbs
      orb.vy += 0.2;
      orb.x += orb.vx;
      orb.y += orb.vy;

      // Rest on platforms
      platforms.forEach((plat) => {
        if (
          orb.x > plat.x &&
          orb.x < plat.x + plat.w &&
          orb.y >= plat.y &&
          orb.y - orb.vy <= plat.y + 10
        ) {
          orb.y = plat.y - 2;
          orb.vx = 0;
          orb.vy = 0;
        }
      });

      // Magnet check
      const odx = (state.x + state.width / 2) - orb.x;
      const ody = (state.y + state.height / 2) - orb.y;
      const dist = Math.sqrt(odx * odx + ody * ody);

      if (dist < 100) {
        orb.x += (odx / dist) * 6;
        orb.y += (ody / dist) * 6;
      }

      if (dist < 20) {
        state.orbs.splice(index, 1);
        state.exp += Math.ceil(orb.value * getStats().expBonus);
        window.WonderSound?.play("coin");
        updateHUDText();

        if (state.exp >= state.expNeed) {
          handleLevelUp();
        }
      }
    });

    if (!state.gameActive) return;

    // Pickups Contact Check
    state.pickups.forEach((pickup, index) => {
      const pdx = (state.x + state.width / 2) - pickup.x;
      const pdy = (state.y + state.height / 2) - pickup.y;
      const dist = Math.sqrt(pdx * pdx + pdy * pdy);

      if (dist < 26) {
        if (pickup.type === "key") {
          state.pickups.splice(index, 1);
          state.keys++;
          window.WonderSound?.play("success");
          updateHUDText();

          // Elite seals now open the next route directly; no gear chest system.
          state.exp += Math.ceil(35 * getStats().expBonus);
          state.pickups.push({ x: 740, y: 184, type: "portal" });
        } else if (pickup.type === "portal") {
          state.pickups.splice(index, 1);
          if (state.room >= 8) endGame(true);
          else enterNextRoom();
        }
      }
    });

  }

  function advanceSimulation(deltaMs) {
    simulationAccumulator += Math.max(0, Math.min(100, Number(deltaMs) || 0));
    let steps = 0;
    while (simulationAccumulator + 0.0001 >= SIMULATION_STEP_MS && state.gameActive && !settlementPending && steps < MAX_SIMULATION_STEPS) {
      stepGameEngine();
      simulationAccumulator -= SIMULATION_STEP_MS;
      steps++;
    }
    if (steps === MAX_SIMULATION_STEPS && simulationAccumulator >= SIMULATION_STEP_MS) simulationAccumulator %= SIMULATION_STEP_MS;
    return steps;
  }

  function updateGameEngine(timestamp = performance.now()) {
    if (!state.gameActive) return;
    if (document.hidden || !windowFocused) {
      suspendBackgroundBattle();
      return;
    }
    if (!simulationFrameAt) simulationFrameAt = timestamp - SIMULATION_STEP_MS;
    const delta = timestamp - simulationFrameAt;
    simulationFrameAt = timestamp;
    advanceSimulation(delta);
    drawCanvasFrame();
    if (state.gameActive) state.gameLoopId = requestAnimationFrame(updateGameEngine);
  }

  function suspendBackgroundBattle() {
    clearActiveInputs();
    suspendAmuletConfirmation();
    suspendPendingSettlement();
    if (!state.gameActive) return;
    backgroundBattleSuspended = true;
    cancelAnimationFrame(state.gameLoopId);
    resetSimulationClock();
  }

  function resumeBackgroundBattle() {
    resumeAmuletConfirmation();
    resumePendingSettlement();
    if (!backgroundBattleSuspended) return;
    backgroundBattleSuspended = false;
    if (!state.gameActive || battlePaused) return;
    cancelAnimationFrame(state.gameLoopId);
    resetSimulationClock();
    state.gameLoopId = requestAnimationFrame(updateGameEngine);
  }

  function applyPlayerDamage(amt) {
    if (!state.gameActive || settlementPending || state.entryGraceFrames > 0 || state.invincibilityTimer > 0) return;
    const stats = getStats();
    if (Math.random() < stats.dodge) return;
    state.playerHp = Math.max(0, state.playerHp - Math.max(0.5, amt - stats.defense));
    renderStatsPanel();

    if (state.playerHp <= 0) {
      endGame(false);
    }
  }

  function drawImageContain(ctx, image, x, y, w, h, flip = false) {
    if (!image || !image.complete || !image.naturalWidth) return false;
    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;
    ctx.save();
    if (flip) {
      ctx.translate(x + w, y);
      ctx.scale(-1, 1);
      x = 0;
      y = 0;
    }
    const imageRatio = sourceWidth / sourceHeight;
    const boxRatio = w / h;
    let drawW = w;
    let drawH = h;
    if (imageRatio > boxRatio) {
      drawH = w / imageRatio;
    } else {
      drawW = h * imageRatio;
    }
    const drawX = x + (w - drawW) / 2;
    const drawY = y + (h - drawH) / 2;
    ctx.drawImage(image, drawX, drawY, drawW, drawH);
    ctx.restore();
    return true;
  }

  function drawEnemyFallback(ctx, enemy) {
    ctx.save();
    ctx.fillStyle = enemy.isElite ? "#a855f7" : "#22d3ee";
    ctx.strokeStyle = "#e0f2fe";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(enemy.width / 2, enemy.height / 2, enemy.width / 2 + 5, enemy.height / 2 + 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#07121f";
    ctx.fillRect(enemy.width * 0.58, enemy.height * 0.32, 5, 5);
    ctx.restore();
  }

  function drawHeroFallback(ctx) {
    ctx.save();
    ctx.fillStyle = "#22d3ee";
    ctx.strokeStyle = "#e0f2fe";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(state.width / 2, state.height / 2, state.width / 2 + 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#07121f";
    ctx.fillRect(state.width * 0.62, state.height * 0.28, 6, 6);
    ctx.restore();
  }

  function drawTileCell(ctx, cellIndex, x, y, w, h) {
    if (!assets.tiles.complete || !assets.tiles.naturalWidth) return false;
    const cellW = assets.tiles.naturalWidth / 6;
    ctx.drawImage(assets.tiles, cellW * cellIndex, 0, cellW, assets.tiles.naturalHeight, x, y, w, h);
    return true;
  }

  function drawMossPlatform(ctx, plat) {
    if (plat.kind === "generated") {
      ctx.save();
      const stone = ctx.createLinearGradient(plat.x, plat.y, plat.x, plat.y + plat.h);
      stone.addColorStop(0, "#b8d58a");
      stone.addColorStop(0.18, "#5d824a");
      stone.addColorStop(0.22, "#526b4b");
      stone.addColorStop(1, "#263c39");
      ctx.fillStyle = stone;
      ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
      ctx.shadowBlur = 7;
      ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
      ctx.strokeStyle = "rgba(220, 255, 175, 0.62)";
      ctx.strokeRect(plat.x + .5, plat.y + .5, plat.w - 1, plat.h - 1);
      ctx.strokeStyle = "rgba(23, 39, 41, 0.85)";
      ctx.lineWidth = 1;
      for (let x = plat.x + 16; x < plat.x + plat.w; x += 28) ctx.strokeRect(x, plat.y + 8, 24, plat.h - 9);
      ctx.fillStyle = "rgba(191, 232, 123, 0.65)";
      ctx.fillRect(plat.x + 3, plat.y + 2, plat.w - 6, 3);
      ctx.restore();
      return;
    }
    // The illustrated ruins already contain the production platform art. This
    // restrained edge is only a collision cue, preventing a second mismatched
    // tile layer from covering the scene or suggesting a false floor.
    ctx.save();
    ctx.strokeStyle = plat.kind === "ground" ? "rgba(225, 255, 184, 0.28)" : "rgba(231, 255, 196, 0.44)";
    ctx.shadowColor = "rgba(9, 36, 23, 0.7)";
    ctx.shadowBlur = 4;
    ctx.lineWidth = plat.kind === "ground" ? 2 : 2.5;
    ctx.beginPath();
    ctx.moveTo(plat.x, plat.y + 0.5);
    ctx.lineTo(plat.x + plat.w, plat.y + 0.5);
    ctx.stroke();
    ctx.restore();
  }

  // Draw 2D Canvas side-scroller elements
  function drawCanvasFrame() {
    const ctx = nodes.gameCanvas.getContext("2d");
    const viewportWidth = nodes.gameCanvas.width;
    const viewportHeight = nodes.gameCanvas.height;
    const cameraX = Math.max(0, Math.min(800 - viewportWidth, state.x + state.width / 2 - viewportWidth / 2));
    const cameraY = Math.max(0, Math.min(500 - viewportHeight, state.y + state.height / 2 - viewportHeight / 2));
    ctx.clearRect(0, 0, viewportWidth, viewportHeight);
    ctx.save();
    ctx.translate(-cameraX, -cameraY);

    // 1. Background image
    const region = Math.ceil(state.room / 5);
    const background = region === 1 ? assets.bg : region === 2 ? assets.bgCrystal : region === 3 ? assets.bgJungle : region === 4 ? assets.bgVolcanic : region === 5 ? assets.bgRift : assets.bgVolcanic;
    if (background.complete) {
      ctx.drawImage(background, 0, 0, 800, 500);
    } else {
      ctx.fillStyle = "#0c1020";
      ctx.fillRect(0, 0, 800, 500);
    }

    // 2. Draw platforms
    platforms.forEach((plat) => {
      drawMossPlatform(ctx, plat);
    });

    // 3. Draw crystalline thorn hazards instead of flat red triangles.
    spikesList.forEach((spike) => {
      const step = 20;
      const count = Math.ceil(spike.w / step);
      for (let i = 0; i < count; i++) {
        const x = spike.x + i * step;
        const gradient = ctx.createLinearGradient(x, spike.y, x, spike.y + spike.h);
        gradient.addColorStop(0, "#fef3c7");
        gradient.addColorStop(0.3, "#fb7185");
        gradient.addColorStop(1, "#7f1d1d");
        ctx.fillStyle = gradient;
        ctx.strokeStyle = "rgba(255, 228, 230, 0.72)";
        ctx.lineWidth = 1;
        ctx.shadowColor = "rgba(244, 63, 94, 0.72)";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(x, spike.y + spike.h);
        ctx.lineTo(x + step * 0.5, spike.y);
        ctx.lineTo(x + step, spike.y + spike.h);
        ctx.fill();
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    });

    hazardZones.forEach((zone) => {
      const colors = { crystal: "#67e8f9", fire: "#fb923c", venom: "#a3e635", root: "#84cc16", shockwave: "#facc15", gust: "#c4b5fd" };
      ctx.save();
      ctx.globalAlpha = zone.active ? 0.72 : 0.28;
      ctx.fillStyle = colors[zone.kind] || "#a78bfa";
      ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
      ctx.strokeStyle = zone.active ? "#ffffff" : colors[zone.kind] || "#a78bfa";
      ctx.lineWidth = zone.active ? 3 : 2;
      ctx.setLineDash(zone.warning ? [8, 6] : []);
      ctx.strokeRect(zone.x, zone.y, zone.w, zone.h);
      ctx.restore();
    });

    // 4. Draw pickups (key, chest, portal)
    state.pickups.forEach((pickup) => {
      if (pickup.type === "key") {
        drawImageContain(ctx, assets.chestFx, pickup.x - 16, pickup.y - 16, 32, 32);
      } else if (pickup.type === "chest") {
        drawTileCell(ctx, 4, pickup.x - 24, pickup.y - 24, 48, 48);
      } else if (pickup.type === "portal") {
        drawTileCell(ctx, 3, pickup.x - 28, pickup.y - 28, 56, 56);
        drawPortal(ctx, pickup.x, pickup.y);
      }
    });

    // 5. Draw experience crystals
    state.orbs.forEach((orb) => {
      if (assets.relicSpark.complete) {
        drawImageContain(ctx, assets.relicSpark, orb.x - 12, orb.y - 12, 24, 24);
      } else {
        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 6. Draw enemy projectiles
    state.bullets.forEach((bullet) => {
      drawImageContain(ctx, assets.projectileFx, bullet.x - bullet.size * 2, bullet.y - bullet.size * 2, bullet.size * 4, bullet.size * 4);
    });

    // 7. Draw enemies
    state.enemies.forEach((enemy) => {
      ctx.save();
      // Face direction logic
      if ((enemy.bounds && enemy.bounds.dir === -1) || enemy.facing === "left") {
        ctx.translate(enemy.x + enemy.width, enemy.y);
        ctx.scale(-1, 1);
      } else {
        ctx.translate(enemy.x, enemy.y);
      }

      if (enemy.type === "boss") {
        const bossSprites = { basilisk: assets.bossBasilisk, guardian: assets.bossGuardian, colossus: assets.bossColossus, wyvern: assets.bossWyvern, stag: assets.bossStag, behemoth: assets.boss };
        const bossSprite = bossSprites[enemy.variant] || assets.boss;
        const bossY = enemy.variant === "basilisk" ? spriteAnchors.basiliskY : enemy.variant === "guardian" ? spriteAnchors.guardianY : enemy.variant === "behemoth" ? spriteAnchors.behemothY : -18;
        const drewBoss = drawImageContain(ctx, bossSprite, -12, bossY, enemy.width + 24, enemy.height + 62);
        if (enemy.hitTimer > 0) {
          ctx.save(); ctx.globalAlpha = 0.72; ctx.globalCompositeOperation = "screen";
          drawImageContain(ctx, bossSprite, -12, bossY, enemy.width + 24, enemy.height + 62); ctx.restore();
        }
        if (!drewBoss) drawEnemyFallback(ctx, enemy);
      } else {
        const sprite = enemy.baseType === "boar" ? assets.boar : enemy.baseType === "wolf" ? assets.enemyWolf : assets.bat;
        const visualY = enemy.baseType === "wolf" ? spriteAnchors.hunterY : enemy.baseType === "boar" ? spriteAnchors.boarY : -10;
        const drewEnemy = drawImageContain(ctx, sprite, -22, visualY, enemy.width + 44, enemy.height + 60);
        if (enemy.hitTimer > 0) {
          ctx.save(); ctx.globalAlpha = 0.72; ctx.globalCompositeOperation = "screen";
          drawImageContain(ctx, sprite, -22, visualY, enemy.width + 44, enemy.height + 60); ctx.restore();
        }
        if (!drewEnemy) drawEnemyFallback(ctx, enemy);
      }
      ctx.restore();

      if (enemy.shielded || enemy.vulnerable === false || (enemy.armored && !enemy.armorOpen)) {
        ctx.save();
        ctx.strokeStyle = enemy.shielded ? "#93c5fd" : "#facc15";
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.ellipse(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width * 0.62, enemy.height * 0.62, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Enemy HP Bar
      if (enemy.hp < enemy.maxHp) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(enemy.x, enemy.y - 10, enemy.width, 4);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(enemy.x, enemy.y - 10, (enemy.hp / enemy.maxHp) * enemy.width, 4);
      }
    });

    // 8. Draw shadow wolf explorer hero
    ctx.save();
    if (state.facing === "left") {
      ctx.translate(state.x + state.width, state.y);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(state.x, state.y);
    }

    if (assets.wolf.complete && assets.wolf.naturalWidth) {
      // Render flashing hit texture
      if (state.invincibilityTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
        ctx.globalAlpha = 0.4;
      }
      if (!drawImageContain(ctx, assets.wolf, -20, spriteAnchors.heroY, state.width + 40, state.height + 72)) drawHeroFallback(ctx);
      ctx.globalAlpha = 1.0;
    } else {
      drawHeroFallback(ctx);
    }

    ctx.restore();

    // 9. Draw Slash Swipe overlay
    if (state.attackTimer > 0) drawClawArc(ctx);

    // 10. Update & Draw sparks particles
    updateSparksParticles(ctx);
    drawDamageNumbers(ctx);
    ctx.restore();
  }

  function drawDamageNumbers(ctx) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = "800 17px system-ui";
    damageNumbers = damageNumbers.filter((number) => {
      number.y -= 0.75;
      number.life--;
      ctx.globalAlpha = Math.min(1, number.life / 12);
      ctx.fillStyle = number.crit ? "#fde047" : "#f8fafc";
      ctx.strokeStyle = "#07121f";
      ctx.lineWidth = 3;
      const label = `${number.crit ? "CRIT " : ""}${number.value}`;
      ctx.strokeText(label, number.x, number.y);
      ctx.fillText(label, number.x, number.y);
      return number.life > 0;
    });
    ctx.restore();
  }

  function drawClawArc(ctx) {
    const direction = state.facing === "left" ? -1 : 1;
    const originX = state.x + (direction > 0 ? state.width + 8 : -8);
    const originY = state.y + 18;
    const progress = 1 - state.attackTimer / getStats().attackFrames;
    ctx.save();
    ctx.translate(originX, originY);
    ctx.scale(direction, 1);
    ctx.lineCap = "round";
    ctx.globalAlpha = 0.95 - progress * 0.45;
    for (let line = 0; line < 3; line++) {
      ctx.beginPath();
      ctx.strokeStyle = line === 1 ? "#d8fbff" : "#26e7ff";
      ctx.lineWidth = 3 - line * 0.45;
      ctx.shadowColor = "#06b6d4";
      ctx.shadowBlur = 10;
      ctx.arc(8 + line * 7, 2, 24 + line * 5, -1.25 + progress * 0.4, 0.55 + progress * 0.4);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Visual effects
  function drawPortal(context, x, y) {
    context.save();
    context.translate(x, y);
    for (let ring = 0; ring < 3; ring += 1) {
      context.strokeStyle = ring === 0 ? "#a855f7" : "#22d3ee";
      context.globalAlpha = 0.9 - ring * 0.2;
      context.lineWidth = 5 - ring;
      context.beginPath();
      context.ellipse(0, 0, 20 - ring * 5, 29 - ring * 7, 0, 0, Math.PI * 2);
      context.stroke();
    }
    context.restore();
  }

  let sparksList = [];
  function createSlashSparks(x, y, isCrit) {
    const color = isCrit ? "#facc15" : "#22d3ee";
    const count = isCrit ? 12 : 6;
    for (let i = 0; i < count; i++) {
      sparksList.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 20,
        color: color,
      });
    }
  }

  function createJumpDust(x, y) {
    for (let i = 0; i < 4; i++) {
      sparksList.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 2,
        vy: -0.5 - Math.random(),
        life: 15,
        color: "#ffffff33",
      });
    }
  }

  function createDashGhost(x, y) {
    for (let i = 0; i < 3; i++) {
      sparksList.push({
        x: x + i * 10 * (state.facing === "right" ? -1 : 1),
        y: y,
        vx: 0,
        vy: 0,
        life: 10,
        color: "#06b6d444",
      });
    }
  }

  function updateSparksParticles(ctx) {
    sparksList.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 3, 3);

      if (p.life <= 0) {
        sparksList.splice(index, 1);
      }
    });
  }

  // Registers keyboard input steer
  function setupInputs() {
    window.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
      const handled = ["a", "d", "arrowleft", "arrowright", "w", "arrowup", " ", "j", "k", "shift"].includes(key);
      if (!handled || !state.gameActive || document.activeElement !== nodes.gameCanvas) return;
      e.preventDefault();
      keysPressed[key] = true;
      if (e.repeat && ["w", "arrowup", " ", "j", "k", "shift"].includes(key)) return;
      if (key === " " || key === "w" || key === "arrowup") {
        makePlayerJump();
      }
      if (key === "j") {
        makePlayerAttack();
      }
      if (key === "k" || key === "shift") {
        makePlayerDash();
      }
    });

    window.addEventListener("keyup", (e) => {
      keysPressed[e.key.toLowerCase()] = false;
    });
    nodes.gameCanvas.addEventListener("blur", clearActiveInputs);
    window.addEventListener("blur", () => {
      windowFocused = false;
      suspendBackgroundBattle();
    });
    window.addEventListener("focus", () => {
      windowFocused = true;
      if (!document.hidden) resumeBackgroundBattle();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) suspendBackgroundBattle();
      else if (windowFocused) resumeBackgroundBattle();
    });
    window.addEventListener("pagehide", suspendBackgroundBattle);
    window.addEventListener("pageshow", () => {
      if (!document.hidden && windowFocused) resumeBackgroundBattle();
    });

    // Pointer cancellation, focus loss, and screen changes must never leave movement latched.
    const bindHoldButton = (button, direction) => {
      const release = (event) => {
        if (event?.pointerId !== undefined && event.pointerId !== mobilePointerOwners[direction]) return;
        mobilePointerOwners[direction] = null;
        mobileInput[direction] = false;
      };
      button.addEventListener("pointerdown", (event) => {
        if (event.button !== undefined && event.button !== 0) return;
        if (mobilePointerOwners[direction] !== null && mobilePointerOwners[direction] !== event.pointerId) return;
        event.preventDefault();
        mobilePointerOwners[direction] = event.pointerId;
        mobileInput[direction] = true;
        button.setPointerCapture?.(event.pointerId);
      });
      button.addEventListener("pointerup", release);
      button.addEventListener("pointercancel", release);
      button.addEventListener("lostpointercapture", release);
      button.addEventListener("blur", release);
    };
    const bindActionButton = (button, action) => {
      let keyboardHeld = false;
      let lastKeyboardActivation = -Infinity;
      button.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        event.stopPropagation();
        if (event.repeat || keyboardHeld) return;
        keyboardHeld = true;
        lastKeyboardActivation = performance.now();
        action();
      });
      button.addEventListener("keyup", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        event.stopPropagation();
        keyboardHeld = false;
      });
      button.addEventListener("blur", () => { keyboardHeld = false; });
      button.addEventListener("pointerdown", (event) => {
        if (event.button !== undefined && event.button !== 0) return;
        event.preventDefault();
        action();
      });
      button.addEventListener("click", (event) => {
        if (event.detail === 0 && performance.now() - lastKeyboardActivation > 500) action();
      });
    };
    bindHoldButton(nodes.btnLeft, "left");
    bindHoldButton(nodes.btnRight, "right");
    bindActionButton(nodes.btnJump, makePlayerJump);
    bindActionButton(nodes.btnAttack, makePlayerAttack);
    bindActionButton(nodes.btnDash, makePlayerDash);
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Init page triggers
  function installResponsiveBattleOwner() {
    const root = document.querySelector("#gamePanel .shadow-game-layout");
    if (!root) return;
    root.classList.add("game-layout");
    nodes.resultPanel.classList.add("battle-result");
    const reserve = document.querySelector("#gamePanel .battle-ad-reserve");
    const container = root.querySelector(".canvas-container");
    const metrics = window.__weightPlayLayoutMetrics ||= {};
    let scheduled = 0;

    const syncCanvasViewport = () => {
      const rect = container?.getBoundingClientRect();
      if (!rect || rect.width < 2 || rect.height < 2) return;
      const aspect = rect.width / rect.height;
      const worldAspect = 800 / 500;
      const logicalWidth = Math.max(1, Math.round(aspect >= worldAspect ? 800 : 500 * aspect));
      const logicalHeight = Math.max(1, Math.round(aspect >= worldAspect ? 800 / aspect : 500));
      if (nodes.gameCanvas.width !== logicalWidth) nodes.gameCanvas.width = logicalWidth;
      if (nodes.gameCanvas.height !== logicalHeight) nodes.gameCanvas.height = logicalHeight;
    };

    const update = () => {
      scheduled = 0;
      const active = document.body.dataset.shadowWolfScreen === "battle" && !nodes.gamePanel.classList.contains("hidden");
      document.body.classList.toggle("wp-logical-battle-active", active);
      if (!active) {
        ["position", "inset", "top", "left", "width", "min-width", "max-width", "height", "min-height", "max-height", "margin", "transform", "transform-origin", "overflow"]
          .forEach((property) => root.style.removeProperty(property));
        ["position", "inset", "top", "left", "width", "height", "margin", "transform"]
          .forEach((property) => reserve?.style.removeProperty(property));
        root.setAttribute("data-wp-logical-battle-canvas", "responsive");
        return;
      }
      const viewport = window.visualViewport;
      const width = Math.max(1, document.documentElement.clientWidth || innerWidth, viewport?.width || 0);
      const height = Math.max(1, document.documentElement.clientHeight || innerHeight, viewport?.height || 0);
      const availableWidth = Math.min(width, 920);
      const availableHeight = Math.max(1, height - 56);
      const landscape = availableWidth / availableHeight >= 1.25;
      const minimumWidth = landscape ? 760 : 390;
      const minimumHeight = landscape ? 334 : 788;
      const scale = Math.max(0.01, Math.min(availableWidth / minimumWidth, availableHeight / minimumHeight));
      const logicalWidth = availableWidth / scale;
      const logicalHeight = availableHeight / scale;
      const left = Math.max(0, (width - availableWidth) / 2);
      root.setAttribute("data-wp-logical-battle-canvas", `${logicalWidth.toFixed(3)}x${logicalHeight.toFixed(3)}`);
      Object.entries({
        position: "fixed", inset: "auto", top: "0px", left: `${left}px`, width: `${logicalWidth}px`,
        "min-width": `${logicalWidth}px`, "max-width": `${logicalWidth}px`, height: `${logicalHeight}px`,
        "min-height": `${logicalHeight}px`, "max-height": `${logicalHeight}px`, margin: "0", transform: `scale(${scale})`,
        "transform-origin": "top left", overflow: "hidden",
      }).forEach(([property, value]) => root.style.setProperty(property, value, "important"));
      if (reserve) Object.entries({
        position: "fixed", inset: "auto", top: `${availableHeight}px`, left: "0px", width: `${width}px`, height: "56px",
        margin: "0", transform: "none",
      }).forEach(([property, value]) => reserve.style.setProperty(property, value, "important"));
      metrics.battleApplied = (metrics.battleApplied || 0) + 1;
      requestAnimationFrame(syncCanvasViewport);
    };
    const schedule = () => {
      if (!scheduled) scheduled = requestAnimationFrame(update);
    };
    new MutationObserver(schedule).observe(document.body, { attributes: true, attributeFilter: ["data-shadow-wolf-screen", "class"] });
    new MutationObserver(schedule).observe(nodes.gamePanel, { attributes: true, attributeFilter: ["class", "hidden"] });
    new ResizeObserver(syncCanvasViewport).observe(container);
    addEventListener("resize", schedule, { passive: true });
    window.visualViewport?.addEventListener("resize", schedule, { passive: true });
    schedule();
  }

  function init() {
    ensureMainInformationScope();
    installResponsiveBattleOwner();
    document.querySelector("#gamePanel .shadow-game-layout")?.append(nodes.resultPanel);
    loadLocalState();
    updateDiamondShopUI();
    translateUI();
    setupInputs();

    nodes.startBtn.addEventListener("keydown", (event) => {
      if (!event.repeat && (event.key === "Enter" || event.key === " ")) mainEntryKeyboardKey = event.key;
    });
    nodes.startBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      showStage();
      requestAnimationFrame(() => document.querySelector(".stage-card.is-selected")?.focus({ preventScroll: true }));
    });
    document.addEventListener("keyup", (event) => {
      if (event.key === mainEntryKeyboardKey) mainEntryKeyboardKey = "";
    });
    window.addEventListener("blur", () => {
      mainEntryKeyboardKey = "";
    });

    nodes.mapBackBtn.addEventListener("click", () => {
      showMain();
    });
    nodes.stageWorkshopBtn?.addEventListener("click", openStageManagement);
    nodes.stageManagementCloseBtn?.addEventListener("click", () => closeStageManagement(true));
    nodes.stageManagementPanel?.addEventListener("keydown", trapStageManagementFocus);
    nodes.attributeButtons.forEach((button) => button.addEventListener("click", () => spendAttribute(button.dataset.attribute)));
    nodes.draftCards.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
    });
    nodes.draftCards.addEventListener("click", (event) => {
      const choice = event.target.closest("[data-draft-attribute]");
      if (choice) spendAttribute(choice.dataset.draftAttribute);
    });
    nodes.draftPanel.addEventListener("keydown", trapDraftFocus);
    nodes.resultPanel.addEventListener("keydown", trapResultFocus);
    nodes.pausePanel.addEventListener("keydown", trapPauseFocus);
    nodes.pauseBtn.addEventListener("click", openPause);
    nodes.resumeBtn.addEventListener("click", () => closePause(true));
    nodes.pauseStagesBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      showStage();
      requestAnimationFrame(() => document.querySelector(".stage-card.is-selected")?.focus({ preventScroll: true }));
    });

    nodes.retryBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      startRun(Number(nodes.resultPanel.dataset.settledStage) || state.selectedStage);
    });

    nodes.nextStageBtn.addEventListener("click", () => {
      if (nodes.nextStageBtn.disabled) return;
      window.WonderSound?.play("click");
      const settledStage = Number(nodes.resultPanel.dataset.settledStage) || state.selectedStage;
      startRun(Math.min(STAGE_COUNT, settledStage + 1));
    });

    nodes.menuBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      openPause();
    });

    nodes.resultMenuBtn.addEventListener("click", () => {
      window.WonderSound?.play("click");
      showStage();
      requestAnimationFrame(() => document.querySelector(".stage-card.is-selected")?.focus({ preventScroll: true }));
    });

    nodes.localeSelect.addEventListener("change", (e) => {
      window.WonderSound?.play("click");
      window.WonderI18n?.setLocale?.(e.target.value);
    });

    nodes.equipLootBtn.addEventListener("click", () => {
      equipLoot();
    });

    nodes.amuletBtn.addEventListener("click", () => {
      const wallet = window.WeightPlayWallet?.read() || { diamonds: 0 };
      if (wallet.diamonds < amuletCost) {
        clearAmuletConfirmation();
        updateDiamondShopUI();
        return;
      }
      if (!amuletConfirmPending) {
        amuletConfirmPending = true;
        updateDiamondShopUI();
        armAmuletConfirmation(5000);
        window.WonderSound?.play("click");
        return;
      }
      clearAmuletConfirmation();
      const spent = window.WeightPlayWallet?.spendDiamonds(amuletCost);
      if (spent) {
        state.amuletUnlocked = true;
        saveLocalState();
        window.WonderSound?.play("success");
      }
      updateDiamondShopUI();
    });

    window.addEventListener("wonder:locale-change", () => {
      clearAmuletConfirmation();
      translateUI();
      updateHUDText();
      renderStatsPanel();
      if (!nodes.draftPanel.classList.contains("hidden")) renderAttributeDraft();
    });
    setScreen("main");

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

  function exposeInternalTestHarness() {
    if (!document.querySelector("[data-internal-shadow-wolf-test='true']")) return;

    window.__ShadowWolfInternalTest = {
      readState() {
        const stats = getStats();
        return {
          locale: getLocale(),
          active: state.gameActive,
          settlementPending,
          paused: battlePaused,
          room: state.room,
          level: state.level,
          attributePoints: state.attributePoints,
          attributes: {
            strength: state.strength,
            agility: state.agility,
            constitution: state.constitution,
            luck: state.luck,
          },
          stats: {
            dmg: stats.dmg,
            speed: stats.speed,
            maxHp: stats.maxHp,
            crit: stats.crit,
          },
          hpText: nodes.hpText.textContent,
          hp: Math.ceil(state.playerHp),
          maxHp: stats.maxHp,
          entryGraceFrames: state.entryGraceFrames,
          keys: state.keys,
          record: { runs: state.runs, bestRoom: state.bestRoom, wins: state.wins, unlockedStage: state.unlockedStage, selectedStage: state.selectedStage, completedStages: [...state.completedStages] },
          player: {
            x: Math.round(state.x),
            y: Math.round(state.y),
            width: state.width,
            height: state.height,
            grounded: state.grounded,
            doubleJumpAvailable: state.doubleJumpAvailable,
            vx: state.vx,
            vy: state.vy,
            attackTimer: state.attackTimer,
            dashTimer: state.dashTimer,
            dashCooldown: state.dashCooldown,
          },
          terrain: platforms.map((platform) => ({ x: platform.x, y: platform.y, w: platform.w, h: platform.h, kind: platform.kind })),
          spikes: spikesList.map((spike) => ({ x: spike.x, y: spike.y, w: spike.w, h: spike.h })),
          hazards: hazardZones.map((zone) => ({ kind: zone.kind, active: zone.active, warning: zone.warning })),
          bullets: state.bullets.map((bullet) => ({ kind: bullet.kind || "normal", x: Math.round(bullet.x), y: Math.round(bullet.y) })),
          enemies: state.enemies.map((enemy) => ({ type: enemy.type, baseType: enemy.baseType, variant: enemy.variant || "", hp: Math.ceil(enemy.hp), maxHp: enemy.maxHp, phase: enemy.phase || 0, shielded: Boolean(enemy.shielded), vulnerable: enemy.vulnerable !== false, armored: Boolean(enemy.armored), armorOpen: Boolean(enemy.armorOpen), x: Math.round(enemy.x), y: Math.round(enemy.y) })),
          equipment: {
            weapon: state.eqWeapon,
            armor: state.eqArmor,
            boots: state.eqBoots,
          },
          panels: {
            menu: !nodes.menuPanel.classList.contains("hidden"),
            game: !nodes.gamePanel.classList.contains("hidden"),
            draft: !nodes.draftPanel.classList.contains("hidden"),
            loot: !nodes.lootPanel.classList.contains("hidden"),
            result: !nodes.resultPanel.classList.contains("hidden"),
            pause: !nodes.pausePanel.classList.contains("hidden"),
          },
        };
      },
      readAssets() {
        return Object.fromEntries(
          Object.entries(assets).map(([key, image]) => [
            key,
            {
              src: image.currentSrc || image.src,
              loaded: Boolean(image.complete && image.naturalWidth),
              width: image.naturalWidth || 0,
              height: image.naturalHeight || 0,
            },
          ])
        );
      },
      framePacingProbe(fps = 60, durationMs = 1000) {
        cancelAnimationFrame(state.gameLoopId);
        const frameRate = Math.max(1, Number(fps) || 60);
        const duration = Math.max(SIMULATION_STEP_MS, Number(durationMs) || 1000);
        const frameCount = Math.max(1, Math.round(duration / 1000 * frameRate));
        state.gameActive = true;
        state.x = 100;
        state.y = mainFloorY - state.height;
        state.vx = 0;
        state.vy = 0;
        state.grounded = true;
        state.entryGraceFrames = 9999;
        state.dashTimer = 0;
        state.dashCooldown = 0;
        state.attackTimer = 0;
        state.invincibilityTimer = 0;
        state.hazardClock = 0;
        state.enemies = [];
        state.bullets = [];
        state.orbs = [];
        state.pickups = [];
        state.playerHp = Math.max(1, state.playerHp || getStats().maxHp);
        platforms = stageTerrain.map((platform) => ({ ...platform }));
        spikesList = [];
        hazardZones = [];
        clearActiveInputs();
        keysPressed.d = true;
        resetSimulationClock();
        for (let frame = 0; frame < frameCount; frame++) advanceSimulation(duration / frameCount);
        const result = { fps: frameRate, x: Math.round(state.x * 100) / 100, hazardClock: state.hazardClock, steps: Math.round(duration / SIMULATION_STEP_MS) };
        state.gameActive = false;
        clearActiveInputs();
        resetSimulationClock();
        showMain();
        return result;
      },
      projectileBatchProbe() {
        cancelAnimationFrame(state.gameLoopId);
        cancelPendingSettlement();
        state.gameActive = true;
        state.entryGraceFrames = 0;
        state.invincibilityTimer = 0;
        state.luck = 0;
        state.eqWeapon = null;
        state.eqArmor = null;
        state.eqBoots = null;
        state.x = 100;
        state.y = mainFloorY - state.height;
        state.vx = 0;
        state.vy = 0;
        state.grounded = true;
        state.playerHp = getStats().maxHp;
        state.enemies = [];
        state.orbs = [];
        state.pickups = [];
        platforms = stageTerrain.map((platform) => ({ ...platform }));
        spikesList = [];
        hazardZones = [];
        state.bullets = [
          { x: -12, y: 100, vx: 0, vy: 0, size: 5, kind: "expired-probe" },
          { x: state.x + state.width / 2, y: state.y + state.height / 2, vx: 0, vy: 0, size: 5, kind: "hit-probe" },
        ];
        const beforeHp = state.playerHp;
        stepGameEngine();
        const result = { beforeHp, afterHp: state.playerHp, bullets: state.bullets.map((bullet) => ({ ...bullet })) };
        state.gameActive = false;
        showMain();
        return result;
      },
      startRun() {
        startRun();
        return this.readState();
      },
      campaignDefinition() {
        return STAGE_DEFINITIONS.map((definition) => ({ ...definition, enemies: [...definition.enemies] }));
      },
      restoreSave(snapshot = {}) {
        writeStorage(saveKey, JSON.stringify(snapshot));
        loadLocalState();
        renderAdventureRecord();
        renderStageCards();
        return this.readState();
      },
      startStage(stageNo) {
        state.unlockedStage = Math.max(state.unlockedStage, Math.max(1, Math.min(STAGE_COUNT, Number(stageNo) || 1)));
        state.selectedStage = Math.max(1, Math.min(state.unlockedStage, Number(stageNo) || 1));
        saveLocalState();
        startRun(state.selectedStage);
        return this.readState();
      },
      forceDefeatStage() {
        const enemies = [...state.enemies];
        enemies.forEach((enemy) => {
          enemy.hp = 0;
          handleEnemyDefeated(enemy);
          const index = state.enemies.indexOf(enemy);
          if (index >= 0) state.enemies.splice(index, 1);
        });
        return this.readState();
      },
      forceBossPhase(phase = 1) {
        const boss = state.enemies.find((enemy) => enemy.type === "boss");
        if (!boss) return this.readState();
        boss.hp = boss.maxHp * (Number(phase) >= 2 ? 0.3 : 0.65);
        updateBossEnemy(boss);
        return this.readState();
      },
      primeEnemyBehavior(type) {
        const enemy = state.enemies.find((candidate) => candidate.type === type);
        if (!enemy) return this.readState();
        enemy.shootCooldown = 1;
        if (type === "ember-wolf") enemy.actionClock = 89;
        if (type === "rift-bat") enemy.actionClock = 134;
        if (type === "dive-bat") enemy.actionClock = 106;
        if (type === "charger-boar") enemy.actionClock = 112;
        if (type === "armored-boar") enemy.x = enemy.bounds.min;
        return this.readState();
      },
      primeClusterAttack() {
        const targets = state.enemies.slice(0, 2);
        if (targets.length < 2) return this.readState();
        state.x = 100;
        state.facing = "right";
        state.attackTimer = 0;
        targets.forEach((enemy, index) => {
          enemy.x = state.x + state.width + 20 + index * 28;
          enemy.y = state.y;
          enemy.hp = 1;
          enemy.maxHp = Math.max(enemy.maxHp, 1);
          enemy.armored = false;
          enemy.shielded = false;
          enemy.vulnerable = true;
        });
        return this.readState();
      },
      defeatEnemyByType(type) {
        const enemy = state.enemies.find((candidate) => candidate.type === type);
        if (!enemy) return this.readState();
        enemy.hp = 0;
        handleEnemyDefeated(enemy);
        const index = state.enemies.indexOf(enemy);
        if (index >= 0) state.enemies.splice(index, 1);
        return this.readState();
      },
      forceLevelUp() {
        handleLevelUp();
        return this.readState();
      },
      forceDamageEffect() {
        const enemy = state.enemies[0];
        if (!enemy) return this.readState();
        enemy.hitTimer = 10;
        damageNumbers.push({ x: enemy.x + enemy.width / 2, y: enemy.y - 4, value: 18, crit: true, life: 34 });
        drawCanvasFrame();
        return { ...this.readState(), damageNumbers: damageNumbers.length, enemyHitTimer: enemy.hitTimer };
      },
      forcePlayerDamage(amount = 5) {
        applyPlayerDamage(Math.max(0.5, Number(amount) || 5));
        return this.readState();
      },
      forceLoot(itemId = "sword-rare") {
        currentLootItem = gearDb[itemId] ? itemId : "sword-rare";
        const g = gearDb[currentLootItem];
        state.gameActive = false;
        nodes.lootIcon.innerHTML = assetImg(g.iconSrc, t(g.nameKey));
        nodes.lootName.textContent = t(g.nameKey);
        nodes.lootType.textContent = t(g.typeKey);
        nodes.lootEffect.textContent = t(g.effectKey);
        nodes.lootPanel.classList.remove("hidden");
        return this.readState();
      },
      forceWin() {
        endGame(true);
        return this.readState();
      },
      scheduleWin() {
        scheduleWinSettlement();
        return this.readState();
      },
      forceFail() {
        endGame(false);
        return this.readState();
      },
    };
  }

  window.addEventListener("DOMContentLoaded", exposeInternalTestHarness);
  window.addEventListener("DOMContentLoaded", init);
})();
