(function () {
  const GAME_ID = "animal-auto-squad";
  const localeKey = "weightPlayLocale";
  const saveKey = "animal_auto_squad_save";

  // Localization Dictionary
  const text = {
    en: {
      title: "Animal Auto Squad",
      menuTitle: "Draft and position your animal squad!",
      menuHint: "Assemble Squirrels, Otters, Owls, and Lions. Feed them apples or honey, buy relics, and complete the 10-round Forest Expedition!",
      bestExpedition: "Best Run",
      expeditionsCleared: "Cleared Runs",
      diamonds: "Diamonds",
      startExpedition: "Start Expedition",
      yourSquadLabel: "Active Squad (Left: Frontline | Right: Backline)",
      benchLabel: "Storage Bench",
      shopLabel: "Expedition Shop",
      startBattle: "Start Battle",
      round: "Round",
      gold: "Gold",
      hearts: "Hearts",
      activeRelic: "Relic",
      chooseRelic: "Choose an Expedition Relic",
      relicDesc: "Select one relic to buff your squad for the entire expedition run.",
      defeatTitle: "Expedition Failed!",
      reviveHint: "Your Hearts reached 0. Spend 5 Diamonds to revive with 2 Hearts and continue your expedition?",
      giveUp: "Give Up",
      retry: "Try Again",
      backToMenu: "Main Menu",
      quitRun: "Quit Run",
      combatIntro: "Prepare for Battle!",
      combatSummary: "Squad HP {playerHp}/{playerMax} | Enemy HP {enemyHp}/{enemyMax}",
      combatFront: "Front: {player} vs {enemy}",
      foodGuideTitle: "Food effects",
      guideHint: "Drag or tap cards to select, then tap target slot to buy, move, combine, or feed. Level up matching animals!",
      level: "Lv.",
      buy: "Buy",
      sell: "Sell",
      reroll: "Reroll",
      freeze: "Freeze",
      unfreeze: "Unfreeze",
      buySkin: "Unlock Golden Skin (15 💎)",
      equipSkin: "Equip Golden Skin",
      unequipSkin: "Equip Normal Skin",
      relicReroll: "Reroll Relics (3 💎)",
      reviveAction: "Revive (5 💎)",
      winText: "Victory! You defeated the shadow beasts.",
      failText: "Defeat! Your squad fainted.",
      drawText: "Draw! Both squads fainted simultaneously.",
      expeditionClear: "Expedition Cleared!",
      expeditionFail: "Expedition Failed!",
      skillReport: "Logical deduction, planning, and tactical positioning improved!",
      skillsLearned: "Skills Trained: Logic, Problem Solving, Strategic Planning.",
      appleDesc: "Apple: +1/+1 stats",
      honeyDesc: "Honey: +2 HP. Buy: +1 Gold",
      melonDesc: "Melon: Gives Melon Shield",
      chocolateDesc: "Chocolate: +2 Exp",
      noDiamonds: "Not enough diamonds!",
      noGold: "Not enough gold!",
      relicMaple: "Maple Shield: Front unit starts with Melon Shield.",
      relicOak: "Oak Seed: All units gain +1 Health in battle.",
      relicShadow: "Shadow Claw: All units gain +1 Attack in battle.",
      relicClover: "Clover Leaf: First shop reroll each round is free.",
      roundNum: "Round {round}/10"
    },
    "zh-Hant": {
      title: "動物自走小隊",
      menuTitle: "挑選並擺放你的動物小隊！",
      menuHint: "募集松鼠、水獺、貓頭鷹和獅子。餵食蘋果或蜂蜜、購買聖物，並完成10回合的森林遠征！",
      bestExpedition: "最佳遠征",
      expeditionsCleared: "通關次數",
      diamonds: "鑽石",
      startExpedition: "開始遠征",
      yourSquadLabel: "作戰小隊 (左：前線 | 右：後方)",
      benchLabel: "備戰區",
      shopLabel: "遠征商店",
      startBattle: "開始戰鬥",
      round: "回合",
      gold: "金幣",
      hearts: "生命值",
      activeRelic: "聖物",
      chooseRelic: "選擇一個遠征聖物",
      relicDesc: "選擇一個聖物，為你的小隊在整場遠征中提供加成。",
      defeatTitle: "遠征失敗！",
      reviveHint: "你的生命值歸零了。花費 5 顆鑽石復活並以 2 生命值繼續遠征？",
      giveUp: "放棄",
      retry: "再試一次",
      backToMenu: "主選單",
      quitRun: "放棄遠征",
      combatIntro: "準備戰鬥！",
      guideHint: "拖曳或點擊卡片選取，再點擊目標欄位來購買、移動、合成或餵食。合成相同動物可升級！",
      level: "等級",
      buy: "購買",
      sell: "出售",
      reroll: "重置",
      freeze: "鎖定",
      unfreeze: "解鎖",
      buySkin: "解鎖黃金外觀 (15 💎)",
      equipSkin: "使用黃金外觀",
      unequipSkin: "使用普通外觀",
      relicReroll: "重置聖物 (3 💎)",
      reviveAction: "復活 (5 💎)",
      winText: "勝利！你擊退了暗影野獸。",
      failText: "戰敗！你的小隊全數昏厥。",
      drawText: "平手！兩方小隊同時昏厥。",
      expeditionClear: "遠征成功通關！",
      expeditionFail: "遠征失敗！",
      skillReport: "邏輯推理、規劃及戰術擺位能力提升！",
      skillsLearned: "訓練技能：邏輯、問題解決、策略規劃。",
      appleDesc: "蘋果：獲得 +1/+1 屬性",
      honeyDesc: "蜂蜜：獲得 +2 生命，且購買時獲得 1 金幣",
      melonDesc: "甜瓜：獲得甜瓜護盾",
      chocolateDesc: "巧克力：獲得 +2 經驗值",
      noDiamonds: "鑽石不足！",
      noGold: "金幣不足！",
      relicMaple: "楓葉護盾：前線單位戰鬥開始時獲得甜瓜護盾。",
      relicOak: "橡樹種子：全體單位在戰鬥中獲得 +1 生命。",
      relicShadow: "暗影爪痕：全體單位在戰鬥中獲得 +1 攻擊力。",
      relicClover: "幸運草：每回合第一次商店重置免費。",
      roundNum: "第 {round}/10 回合"
    }
  };

  const pageMeta = {
    en: {
      title: "Animal Auto Squad - Play Free Auto-Battler Game",
      description: "Animal Auto Squad is a free online 13+ strategy auto-battler. Draft chibi animal cards, level up your squad, choose relic buffs, and defeat shadow monsters.",
      ogDescription: "Draft and position your chibi animal squad. Combine matching warriors, buy relics, and complete the 10-round Forest Expedition.",
      twitterDescription: "Draft animal cards, level up your squad, and defeat the shadow boss in this free online strategy auto-battler."
    },
    "zh-Hant": {
      title: "動物自走小隊 - 免費策略自走棋網頁遊戲",
      description: "《動物自走小隊》是一款免費的 13+ 策略自走棋遊戲。挑選可愛動物卡牌、合成升級小隊、選擇聖物加成，並擊退暗影野獸完成森林遠征！",
      ogDescription: "挑選並擺放你的動物小隊。合成相同卡牌升級、購買食物和聖物，挑戰10回合森林遠征。",
      twitterDescription: "挑選動物卡牌、升級小隊，在免費網頁策略自走棋中擊敗暗影頭目。"
    }
  };

  // Sound Synth settings
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  function playSynth(type) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === "buy") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
        gainNode.gain.setValueAtTime(0.12, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === "sell") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === "combine") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(440, now + 0.06);
        osc.frequency.setValueAtTime(880, now + 0.12);
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === "hit") {
        // Low triangle sweep + noise-like click
        osc.type = "triangle";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "faint") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === "shield") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === "buff") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.25);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === "win") {
        // Major arpeggio
        const notes = [261.6, 329.6, 392.0, 523.3];
        notes.forEach((f, idx) => {
          const oscNode = audioCtx.createOscillator();
          const gainNode2 = audioCtx.createGain();
          oscNode.connect(gainNode2);
          gainNode2.connect(audioCtx.destination);
          oscNode.type = "sine";
          oscNode.frequency.setValueAtTime(f, now + idx * 0.08);
          gainNode2.gain.setValueAtTime(0.08, now + idx * 0.08);
          gainNode2.gain.linearRampToValueAtTime(0, now + idx * 0.08 + 0.25);
          oscNode.start(now + idx * 0.08);
          oscNode.stop(now + idx * 0.08 + 0.25);
        });
      } else if (type === "fail") {
        // Sad slide
        osc.type = "sine";
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.linearRampToValueAtTime(180, now + 0.4);
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "revive") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.5);
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch (e) {
      console.warn("Audio failed to play:", e);
    }
  }

  // Helper selectors
  const $ = (id) => document.getElementById(id);

  // Asset configuration
  const ANIMAL_METADATA = [
    { id: 0, nameEn: "Spark Paw Fox", nameZht: "\u661f\u722a\u72d0", imageKey: "sparkFox", tier: 1, atk: 2, hp: 2, descEn: "Buy: gains +1/+1.", descZht: "\u8cfc\u8cb7\uff1a\u7372\u5f97 +1/+1\u3002" },
    { id: 1, nameEn: "Bubble Fin Otter", nameZht: "\u6ce1\u6ce1\u9c2d\u6c34\u737a", imageKey: "bubbleOtter", tier: 1, atk: 1, hp: 3, descEn: "Sell: gives a random ally +1 HP.", descZht: "\u51fa\u552e\uff1a\u96a8\u6a5f\u968a\u53cb +1 \u751f\u547d\u3002" },
    { id: 2, nameEn: "Drum Belly Panda", nameZht: "\u9f13\u809a\u718a\u8c93", imageKey: "drumPanda", tier: 2, atk: 3, hp: 2, descEn: "Buy: gives two allies +1 HP.", descZht: "\u8cfc\u8cb7\uff1a\u5169\u540d\u968a\u53cb +1 \u751f\u547d\u3002" },
    { id: 3, nameEn: "Moon Cap Owl", nameZht: "\u6708\u5e3d\u8c93\u982d\u9df9", imageKey: "moonOwl", tier: 2, atk: 2, hp: 3, descEn: "Sell: gains +1 extra Gold.", descZht: "\u51fa\u552e\uff1a\u984d\u5916\u7372\u5f97 1 \u91d1\u5e63\u3002" },
    { id: 4, nameEn: "Moss Shell Turtle", nameZht: "\u82d4\u6bbc\u70cf\u9f9c", imageKey: "mossTurtle", tier: 3, atk: 2, hp: 4, descEn: "Faint: gives the ally behind Melon Shield.", descZht: "\u5012\u4e0b\uff1a\u4f7f\u5f8c\u65b9\u968a\u53cb\u7372\u5f97\u751c\u74dc\u8b77\u76fe\u3002" },
    { id: 5, nameEn: "Rainbow Hop Rabbit", nameZht: "\u5f69\u8679\u8df3\u5154", imageKey: "rainbowRabbit", tier: 3, atk: 4, hp: 2, descEn: "Buy: gives one free shop reroll.", descZht: "\u8cfc\u8cb7\uff1a\u7372\u5f97\u4e00\u6b21\u514d\u8cbb\u5237\u65b0\u3002" },
    { id: 6, nameEn: "Gear Horn Rhino", nameZht: "\u9f52\u8f2a\u89d2\u7280\u725b", imageKey: "gearRhino", tier: 4, atk: 3, hp: 4, descEn: "Sell: buffs a random shop card +2/+2.", descZht: "\u51fa\u552e\uff1a\u96a8\u6a5f\u5546\u5e97\u5361 +2/+2\u3002" },
    { id: 7, nameEn: "Boom Mane Lion", nameZht: "\u7206\u9b03\u7345", imageKey: "boomLion", tier: 4, atk: 4, hp: 4, descEn: "Faint: gives all allies +1/+1.", descZht: "\u5012\u4e0b\uff1a\u5168\u9ad4\u968a\u53cb +1/+1\u3002" },
    { id: 8, nameEn: "Spark Paw Captain", nameZht: "\u661f\u722a\u968a\u9577", imageKey: "sparkFox", tier: 5, atk: 5, hp: 5, descEn: "Buy: gives all allies +2 HP.", descZht: "\u8cfc\u8cb7\uff1a\u5168\u9ad4\u968a\u53cb +2 \u751f\u547d\u3002" },
    { id: 9, nameEn: "Rhino Guardian", nameZht: "\u7280\u725b\u5b88\u885b", imageKey: "gearRhino", tier: 5, atk: 6, hp: 6, descEn: "Faint: deals 4 damage to the lead enemy.", descZht: "\u5012\u4e0b\uff1a\u5c0d\u6700\u524d\u65b9\u6575\u4eba\u9020\u6210 4 \u50b7\u5bb3\u3002" }
  ];

  const ITEM_METADATA = [
    { id: 0, nameEn: "Apple", nameZht: "\u860b\u679c", imageKey: "foodApple", descEn: "+1/+1 stats.", descZht: "+1/+1 \u5c6c\u6027\u3002" },
    { id: 1, nameEn: "Honey", nameZht: "\u8702\u871c", imageKey: "foodHoney", descEn: "+2 HP. Buy: +1 Gold.", descZht: "+2 \u751f\u547d\uff0c\u8cfc\u8cb7\u5f8c\u56de 1 \u91d1\u5e63\u3002" },
    { id: 2, nameEn: "Melon", nameZht: "\u751c\u74dc", imageKey: "foodMelon", descEn: "Gives Melon Shield.", descZht: "\u7372\u5f97\u751c\u74dc\u8b77\u76fe\u3002" },
    { id: 3, nameEn: "Chocolate", nameZht: "\u5de7\u514b\u529b", imageKey: "foodChocolate", descEn: "+2 Exp points.", descZht: "+2 \u7d93\u9a57\u3002" }
  ];

  const RELIC_METADATA = [
    { id: 0, nameEn: "Maple Shield", nameZht: "楓葉護盾", sx: 0, descEn: "Front unit starts with Melon Shield.", descZht: "前線單位戰鬥開始時獲得甜瓜護盾。" },
    { id: 1, nameEn: "Oak Seed", nameZht: "橡樹種子", sx: 384, descEn: "All units gain +1 Health in battle.", descZht: "全體單位在戰鬥中獲得 +1 生命。" },
    { id: 2, nameEn: "Shadow Claw", nameZht: "暗影爪痕", sx: 768, descEn: "All units gain +1 Attack in battle.", descZht: "全體單位在戰鬥中獲得 +1 攻擊力。" },
    { id: 3, nameEn: "Clover Leaf", nameZht: "幸運草", sx: 1152, descEn: "First shop reroll each round is free.", descZht: "每回合第一次商店重置免費。" }
  ];

  const ENEMY_METADATA = [
    { id: 0, nameEn: "Shadow Squirrel", nameZht: "影之松鼠", sx: 0, sy: 0 },
    { id: 1, nameEn: "Shadow Wolf", nameZht: "影之灰狼", sx: 682, sy: 0 },
    { id: 2, nameEn: "Shadow Boar", nameZht: "影之野豬", sx: 1365, sy: 0 },
    { id: 3, nameEn: "Shadow Badger", nameZht: "影之獾", sx: 0, sy: 768 },
    { id: 4, nameEn: "Shadow Golem", nameZht: "影之魔像", sx: 682, sy: 768 }
  ];

  // Game UI DOM Nodes
  const nodes = {
    mainGameTitle: $("mainGameTitle"),
    localeSelect: $("localeSelect"),
    loadingPanel: $("loadingPanel"),
    loadingFill: $("loadingFill"),
    loadingText: $("loadingText"),
    menuPanel: $("menuPanel"),
    bestRoundsText: $("bestRoundsText"),
    clearedRunsText: $("clearedRunsText"),
    diamondText: $("diamondText"),
    buySkinBtn: $("buySkinBtn"),
    equipSkinBtn: $("equipSkinBtn"),
    startBtn: $("startBtn"),
    gamePanel: $("gamePanel"),
    roundText: $("roundText"),
    goldText: $("goldText"),
    heartText: $("heartText"),
    relicText: $("relicText"),
    prepPhaseArea: $("prepPhaseArea"),
    squadGrid: $("squadGrid"),
    benchGrid: $("benchGrid"),
    shopRow: $("shopRow"),
    rerollShopBtn: $("rerollShopBtn"),
    sellCardBtn: $("sellCardBtn"),
    startBattleBtn: $("startBattleBtn"),
    combatArea: $("combatArea"),
    gameCanvas: $("gameCanvas"),
    combatStatusText: $("combatStatusText"),
    combatSummary: $("combatSummary"),
    foodGuide: $("foodGuide"),
    relicDraftPanel: $("relicDraftPanel"),
    relicChoices: $("relicChoices"),
    rerollRelicsBtn: $("rerollRelicsBtn"),
    defeatRevivePanel: $("defeatRevivePanel"),
    reviveBtn: $("reviveBtn"),
    giveUpBtn: $("giveUpBtn"),
    resultPanel: $("resultPanel"),
    resultTitle: $("resultTitle"),
    resultText: $("resultText"),
    skillReportText: $("skillReportText"),
    retryBtn: $("retryBtn"),
    resultMenuBtn: $("resultMenuBtn"),
    quitRunBtn: $("quitRunBtn"),
    hintText: $("hintText")
  };

  // State Management
  let locale = window.WonderI18n?.locale?.() || localStorage.getItem(localeKey) || "en";
  let save = loadSave();
  let state = makeState();
  let selectedSlot = null; // for tap-to-select mobile fallback
  let imageCache = {};
  let canvasCtx = null;
  let animationId = null;

  const zhRuntimeText = {
    combatSummary: "小隊生命 {playerHp}/{playerMax}｜敵方生命 {enemyHp}/{enemyMax}",
    combatFront: "前排：{player} 對 {enemy}",
    foodGuideTitle: "食物效果"
  };

  function loadSave() {
    try {
      const data = localStorage.getItem(saveKey);
      return data ? JSON.parse(data) : { bestRound: 0, clearedRuns: 0, unlockedSkin: false, selectedSkin: "normal" };
    } catch (e) {
      return { bestRound: 0, clearedRuns: 0, unlockedSkin: false, selectedSkin: "normal" };
    }
  }

  function saveSave() {
    try {
      localStorage.setItem(saveKey, JSON.stringify(save));
    } catch (e) {}
  }

  function makeState() {
    return {
      activeRun: false,
      round: 1,
      gold: 10,
      hearts: 4,
      relic: null,
      freeRerollThisRound: false,
      rerollsUsedThisRound: 0,
      squad: [null, null, null, null, null],
      bench: [null, null, null, null, null],
      shop: {
        animals: [null, null, null],
        items: [null, null],
        frozenAnimals: [false, false, false],
        frozenItems: [false, false]
      },
      combat: {
        playerSquad: [],
        enemySquad: [],
        step: 0,
        log: [],
        status: "",
        animating: false,
        timer: 0,
        playerActiveIndex: 0,
        enemyActiveIndex: 0,
        shakeFrames: 0,
        shakeTarget: "",
        effects: [] // visual particle FX
      }
    };
  }

  function t(key, data = {}) {
    const value = (locale === "zh-Hant" && zhRuntimeText[key]) || text[locale]?.[key] || text.en[key] || key;
    return Object.entries(data).reduce((out, [name, item]) => out.replaceAll(`{${name}}`, String(item)), value);
  }

  function updatePageMeta() {
    const meta = pageMeta[locale] || pageMeta.en;
    document.title = meta.title;
    const setMeta = (selector, val) => document.querySelector(selector)?.setAttribute("content", val);
    setMeta("meta[name='description']", meta.description);
    setMeta("meta[property='og:title']", meta.title);
    setMeta("meta[property='og:description']", meta.ogDescription);
    setMeta("meta[name='twitter:title']", meta.title);
    setMeta("meta[name='twitter:description']", meta.twitterDescription);
  }

  function getWalletDiamonds() {
    return window.WeightPlayWallet?.read?.().diamonds || 0;
  }

  function spendWalletDiamonds(amount) {
    if (window.WeightPlayWallet?.spendDiamonds) {
      const ok = window.WeightPlayWallet.spendDiamonds(amount);
      if (ok) {
        updateWalletUI();
        return true;
      }
    }
    return false;
  }

  function updateWalletUI() {
    nodes.diamondText.textContent = String(getWalletDiamonds());
    renderCosmeticSection();
  }

  // Preloading required sheets
  const assetsToLoad = {
    cover: "../../assets/animal-auto-squad-cover.webp",
    bg: "../../assets/animal-auto-squad-bg.webp",
    enemies: "../../assets/animal-auto-squad-enemies.webp",
    items: "../../assets/animal-auto-squad-items.webp",
    fx: "../../assets/animal-auto-squad-fx.webp",
    sparkFox: "../../assets/weightplay-character-spark-paw-fox-cutout.webp",
    bubbleOtter: "../../assets/weightplay-character-bubble-fin-otter-cutout.webp",
    drumPanda: "../../assets/weightplay-character-drum-belly-panda-safe-face-cutout.webp",
    moonOwl: "../../assets/weightplay-character-moon-cap-owl-cutout.webp",
    mossTurtle: "../../assets/weightplay-character-moss-shell-turtle-cutout.webp",
    rainbowRabbit: "../../assets/weightplay-character-rainbow-hop-mimi-clean-cutout.webp",
    gearRhino: "../../assets/weightplay-character-gear-horn-rhino-cutout.webp",
    boomLion: "../../assets/weightplay-character-boom-mane-lion-cutout.webp",
    foodApple: "assets/food-apple.svg",
    foodHoney: "assets/food-honey.svg",
    foodMelon: "assets/food-melon.svg",
    foodChocolate: "assets/food-chocolate.svg"
  };

  let loadedCount = 0;
  let assetsReady = false;
  let appStarted = false;
  let preloadStarted = false;
  const totalAssets = Object.keys(assetsToLoad).length;

  function updateLoadingProgress() {
    const pct = Math.floor((loadedCount / totalAssets) * 100);
    nodes.loadingFill.style.width = pct + "%";
    nodes.loadingText.textContent = pct + "%";
  }

  function preloadAssets(onDone = () => {}) {
    if (assetsReady) {
      onDone();
      return;
    }
    loadedCount = 0;
    updateLoadingProgress();
    for (const [key, src] of Object.entries(assetsToLoad)) {
      const img = new Image();
      img.decoding = "async";
      const completeAsset = () => {
        loadedCount++;
        updateLoadingProgress();
        if (loadedCount === totalAssets) {
          assetsReady = true;
          nodes.loadingPanel.classList.add("is-hidden");
          window.__ANIMAL_AUTO_SQUAD_READY__ = true;
          onDone();
        }
      };
      img.onload = () => {
        imageCache[key] = img;
        completeAsset();
      };
      img.onerror = () => {
        console.error("Failed to load asset:", src);
        completeAsset();
      };
      img.src = src;
    }
  }

  function scheduleAssetPreload() {
    if (preloadStarted) return;
    preloadStarted = true;

    const startPreload = () => preloadAssets();
    if (window.location.search.includes("smoke=first-screen")) {
      window.setTimeout(startPreload, 1200);
      return;
    }
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(startPreload, { timeout: 1800 });
      return;
    }
    window.setTimeout(startPreload, 800);
  }

  function startApp() {
    if (appStarted) return;
    appStarted = true;
    setupEvents();
    setLocale(locale);
    renderMenu();
    nodes.loadingPanel.classList.add("is-hidden");
    window.__ANIMAL_AUTO_SQUAD_BOOTED__ = true;
    window.__ANIMAL_AUTO_SQUAD_FIRST_SCREEN__ = {
      booted: true,
      title: document.title,
      language: locale,
      startText: nodes.startBtn.textContent.trim(),
      loadingHidden: nodes.loadingPanel.classList.contains("is-hidden"),
      menuHidden: nodes.menuPanel.classList.contains("is-hidden")
    };
    scheduleAssetPreload();
  }

  // Render Functions
  function renderMenu() {
    nodes.menuPanel.classList.remove("is-hidden");
    nodes.gamePanel.classList.add("is-hidden");
    nodes.resultPanel.classList.add("is-hidden");
    nodes.combatSummary?.classList.add("is-hidden");
    nodes.bestRoundsText.textContent = t("roundNum", { round: save.bestRound });
    nodes.clearedRunsText.textContent = String(save.clearedRuns);
    updateWalletUI();
    updatePageMeta();
  }

  function renderCosmeticSection() {
    if (save.unlockedSkin) {
      nodes.buySkinBtn.classList.add("is-hidden");
      nodes.equipSkinBtn.classList.remove("is-hidden");
      if (save.selectedSkin === "golden") {
        nodes.equipSkinBtn.textContent = t("unequipSkin");
        nodes.equipSkinBtn.className = "secondary-btn skin-equipped";
      } else {
        nodes.equipSkinBtn.textContent = t("equipSkin");
        nodes.equipSkinBtn.className = "primary-btn";
      }
    } else {
      nodes.buySkinBtn.classList.remove("is-hidden");
      nodes.buySkinBtn.textContent = t("buySkin");
      nodes.equipSkinBtn.classList.add("is-hidden");
    }
  }

  function handleBuySkin() {
    initAudio();
    if (getWalletDiamonds() < 15) {
      alert(t("noDiamonds"));
      playSynth("click");
      return;
    }
    if (spendWalletDiamonds(15)) {
      save.unlockedSkin = true;
      save.selectedSkin = "golden";
      saveSave();
      playSynth("win");
      renderCosmeticSection();
      window.WonderAnalytics?.track("cosmetic_skin_purchase", { game_id: GAME_ID, cost: 15 });
    }
  }

  function handleEquipSkin() {
    initAudio();
    save.selectedSkin = save.selectedSkin === "golden" ? "normal" : "golden";
    saveSave();
    playSynth("click");
    renderCosmeticSection();
  }

  // Language Setup
  function setLocale(next) {
    locale = next || "en";
    localStorage.setItem(localeKey, locale);
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : "en";
    if (window.WonderI18n?.locale?.() !== locale) {
      window.WonderI18n?.setLocale?.(locale);
    } else {
      window.dispatchEvent(new CustomEvent("wonder:locale-change", { detail: { locale } }));
    }
    translateUI();
    updatePageMeta();
  }

  function translateUI() {
    // Top headings
    nodes.mainGameTitle.textContent = t("title");
    nodes.localeSelect.value = locale;
    nodes.quitRunBtn.textContent = t("quitRun");
    
    // Menu elements
    $("menuHeadingText").textContent = t("menuTitle");
    $("menuSubText").textContent = t("menuHint");
    nodes.startBtn.textContent = t("startExpedition");
    $("bestRoundsText").previousElementSibling.textContent = t("bestExpedition");
    $("clearedRunsText").previousElementSibling.textContent = t("expeditionsCleared");
    $("diamondText").previousElementSibling.textContent = t("diamonds");
    document.querySelector(".cosmetic-store .store-label").textContent = t("buySkin");

    // HUD labels
    nodes.roundText.previousElementSibling.textContent = t("round");
    nodes.goldText.previousElementSibling.textContent = t("gold");
    nodes.heartText.previousElementSibling.textContent = t("hearts");
    nodes.relicText.previousElementSibling.textContent = t("activeRelic");

    // Prep labels
    document.querySelector(".squad-section h3").textContent = t("yourSquadLabel");
    document.querySelector(".bench-section h3").textContent = t("benchLabel");
    document.querySelector(".shop-section h3").textContent = t("shopLabel");
    nodes.startBattleBtn.textContent = t("startBattle");
    nodes.hintText.textContent = t("guideHint");
    renderFoodGuide();

    // Reroll shop label
    const rerollCost = state.freeRerollThisRound ? 0 : 1;
    nodes.rerollShopBtn.textContent = `${t("reroll")} (${rerollCost} ${t("gold")})`;

    // Relic Modal labels
    document.querySelector("#relicDraftPanel h2").textContent = t("chooseRelic");
    document.querySelector("#relicDraftPanel .status-line").textContent = t("relicDesc");

    // Defeat Modal labels
    document.querySelector("#defeatRevivePanel h2").textContent = t("defeatTitle");
    document.querySelector("#defeatRevivePanel .status-line").textContent = t("reviveHint");
    nodes.reviveBtn.textContent = t("reviveAction");
    nodes.giveUpBtn.textContent = t("giveUp");

    // Result labels
    nodes.resultTitle.textContent = state.hearts > 0 ? t("expeditionClear") : t("expeditionFail");
    nodes.retryBtn.textContent = t("retry");
    nodes.resultMenuBtn.textContent = t("backToMenu");

    renderCosmeticSection();
  }

  // Start Expedition Run
  function startExpedition() {
    initAudio();
    playSynth("click");
    state = makeState();
    state.activeRun = true;
    nodes.menuPanel.classList.add("is-hidden");
    nodes.gamePanel.classList.remove("is-hidden");
    nodes.prepPhaseArea.classList.remove("is-hidden");
    nodes.combatArea.classList.add("is-hidden");

    // Initial Relic draft
    openRelicDraft();
    window.WonderAnalytics?.track("expedition_start", { game_id: GAME_ID });
  }

  function openRelicDraft() {
    nodes.relicDraftPanel.classList.remove("is-hidden");
    renderRelicChoices();
  }

  function renderRelicChoices() {
    nodes.relicChoices.innerHTML = "";
    // Pick 2 random relics
    const pool = [...RELIC_METADATA];
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const choices = shuffled.slice(0, 2);

    choices.forEach((relic) => {
      const card = document.createElement("div");
      card.className = "relic-card";
      card.innerHTML = `
        <div class="relic-icon-art relic-icon-${relic.id}" aria-hidden="true"><span></span></div>
        <h4>${locale === "zh-Hant" ? relic.nameZht : relic.nameEn}</h4>
        <p>${locale === "zh-Hant" ? relic.descZht : relic.descEn}</p>
      `;
      card.addEventListener("click", () => {
        selectRelic(relic);
      });
      nodes.relicChoices.appendChild(card);
    });

    nodes.rerollRelicsBtn.textContent = t("relicReroll");
    nodes.rerollRelicsBtn.onclick = rerollRelics;
  }

  function selectRelic(relic) {
    state.relic = relic;
    nodes.relicText.textContent = locale === "zh-Hant" ? relic.nameZht : relic.nameEn;
    nodes.relicDraftPanel.classList.add("is-hidden");
    playSynth("buy");

    // First round preparation
    startRoundPrep();
  }

  function rerollRelics() {
    if (getWalletDiamonds() < 3) {
      alert(t("noDiamonds"));
      playSynth("click");
      return;
    }
    if (spendWalletDiamonds(3)) {
      playSynth("revive");
      renderRelicChoices();
      window.WonderAnalytics?.track("relic_reroll", { game_id: GAME_ID, cost: 3 });
    }
  }

  // Round Setup and Shop Drafting
  function startRoundPrep() {
    state.gold = 10;
    state.freeRerollThisRound = state.relic?.id === 3; // Clover leaf gives free first reroll
    state.rerollsUsedThisRound = 0;
    translateUI();
    updateHUD();
    generateShop();
    renderPrepScreen();
  }

  function updateHUD() {
    nodes.roundText.textContent = `${state.round}/10`;
    nodes.goldText.textContent = String(state.gold);
    nodes.heartText.textContent = `${state.hearts}/4`;
  }

  // Generate random tier pool of animals
  function generateShop() {
    // Reroll normal items if not frozen
    const tierLimit = Math.min(5, Math.ceil(state.round / 2)); // Tiers 1-5 unlocked as rounds progress
    const animalPool = ANIMAL_METADATA.filter((a) => a.tier <= tierLimit);

    for (let i = 0; i < 3; i++) {
      if (!state.shop.frozenAnimals[i]) {
        const rand = animalPool[Math.floor(Math.random() * animalPool.length)];
        state.shop.animals[i] = { ...rand, exp: 1, level: 1, currentAtk: rand.atk, currentHp: rand.hp, maxHp: rand.hp, hasShield: false };
      }
    }

    for (let i = 0; i < 2; i++) {
      if (!state.shop.frozenItems[i]) {
        const rand = ITEM_METADATA[Math.floor(Math.random() * ITEM_METADATA.length)];
        state.shop.items[i] = { ...rand };
      }
    }
  }

  function renderPrepScreen() {
    renderFoodGuide();
    renderSquad();
    renderBench();
    renderShop();
  }

  function renderFoodGuide() {
    if (!nodes.foodGuide) return;
    const items = [t("appleDesc"), t("honeyDesc"), t("melonDesc"), t("chocolateDesc")];
    nodes.foodGuide.innerHTML = `<strong>${t("foodGuideTitle")}</strong>${items.map((item) => `<span>${item}</span>`).join("")}`;
  }

  function getItemEffectText(card) {
    if (!card || card.atk !== undefined) return "";
    return locale === "zh-Hant" ? (card.descZht || card.descEn || "") : (card.descEn || "");
  }

  // Cards UI helpers
  function makeCardElement(card, sourceArea, index) {
    const el = document.createElement("div");
    if (!card) {
      el.className = "card-item empty-slot";
      el.dataset.slot = String(index);
      el.dataset.area = sourceArea;
      
      // Drag/Drop Listeners
      el.addEventListener("dragover", dragOver);
      el.addEventListener("dragleave", dragLeave);
      el.addEventListener("drop", dragDrop);
      el.addEventListener("click", () => handleSlotTap(sourceArea, index));
      return el;
    }

    el.className = "card-item";
    if (save.selectedSkin === "golden" && card.id === 8) {
      el.classList.add("mascot-golden");
    }
    el.draggable = true;
    el.dataset.allowNativeDrag = "true";
    el.dataset.slot = String(index);
    el.dataset.area = sourceArea;

    // Inside details
    const isAnimal = card.atk !== undefined;
    
    // Thumbnail graphic
    const graphic = document.createElement("div");
    graphic.className = "card-graphic";
    if (isAnimal) {
      graphic.classList.add("character-icon");
      graphic.style.backgroundImage = `url('${assetsToLoad[card.imageKey] || assetsToLoad.boomLion}')`;
      graphic.style.aspectRatio = "1 / 1";
      graphic.style.backgroundPosition = "center";
      graphic.style.backgroundSize = "contain";
    } else {
      // Food uses independent icons so no sheet crop can show the wrong item.
      graphic.classList.add("food-icon");
      graphic.style.backgroundImage = `url('${assetsToLoad[card.imageKey] || assetsToLoad.foodApple}')`;
      graphic.style.aspectRatio = "1 / 1";
      graphic.style.backgroundPosition = "center";
      graphic.style.backgroundSize = "contain";
    }
    el.appendChild(graphic);

    // Title / Name
    const nameEl = document.createElement("div");
    nameEl.className = "card-name";
    nameEl.textContent = locale === "zh-Hant" ? (card.nameZht || card.nameEn) : card.nameEn;
    el.appendChild(nameEl);

    if (!isAnimal) {
      const effectEl = document.createElement("div");
      effectEl.className = "card-effect";
      effectEl.textContent = getItemEffectText(card);
      el.appendChild(effectEl);
      el.title = `${locale === "zh-Hant" ? (card.nameZht || card.nameEn) : card.nameEn}: ${effectEl.textContent}`;
    }

    // Level tag
    if (isAnimal && card.level > 1) {
      const levelEl = document.createElement("div");
      levelEl.className = "card-level-tag";
      levelEl.textContent = `${t("level")}${card.level}`;
      el.appendChild(levelEl);
    }

    // Shield Badge
    if (card.hasShield) {
      const shieldEl = document.createElement("div");
      shieldEl.className = "card-shield-tag";
      shieldEl.textContent = "Shield";
      el.appendChild(shieldEl);
    }

    // Stats
    if (isAnimal) {
      const statsEl = document.createElement("div");
      statsEl.className = "card-stats";
      statsEl.innerHTML = `<span class="card-atk">ATK ${card.currentAtk}</span><span class="card-hp">HP ${card.currentHp}</span>`;
      el.appendChild(statsEl);
      el.title = `${locale === "zh-Hant" ? (card.nameZht || card.nameEn) : card.nameEn}: ATK ${card.currentAtk}, HP ${card.currentHp}. ${locale === "zh-Hant" ? (card.descZht || card.descEn || "") : (card.descEn || "")}`;
    } else {
      // Cost
      const costEl = document.createElement("div");
      costEl.className = "card-cost";
      costEl.textContent = "3";
      el.appendChild(costEl);
    }

    // Selection highlight for Tap-to-select mobile UI
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      handleSlotTap(sourceArea, index);
    });

    // Drag listeners
    el.addEventListener("dragstart", (e) => {
      initAudio();
      e.dataTransfer.setData("text/plain", JSON.stringify({ area: sourceArea, index }));
      el.classList.add("dragging");
    });
    el.addEventListener("dragend", () => {
      el.classList.remove("dragging");
    });
    el.addEventListener("dragover", dragOver);
    el.addEventListener("dragleave", dragLeave);
    el.addEventListener("drop", dragDrop);

    return el;
  }

  // Drag and Drop Logic
  function dragOver(e) {
    e.preventDefault();
    this.classList.add("drag-over");
  }

  function dragLeave() {
    this.classList.remove("drag-over");
  }

  function dragDrop(e) {
    e.preventDefault();
    this.classList.remove("drag-over");
    try {
      const source = JSON.parse(e.dataTransfer.getData("text/plain"));
      const targetArea = this.dataset.area;
      const targetIndex = parseInt(this.dataset.slot);
      
      executeAction(source.area, source.index, targetArea, targetIndex);
    } catch (err) {
      console.warn("Drag drop error:", err);
    }
  }

  // Mobile/Tap Fallback
  function handleSlotTap(area, index) {
    initAudio();
    if (!state.activeRun) return;

    if (selectedSlot === null) {
      // If tapping an empty slot as first action, ignore
      const card = getCardAt(area, index);
      if (!card) return;
      selectedSlot = { area, index };
      highlightSelectedCard(true);
      playSynth("click");
      renderPrepScreen();
    } else {
      const source = selectedSlot;
      
      // If tapping the exact same slot, deselect it
      if (source.area === area && source.index === index) {
        selectedSlot = null;
        highlightSelectedCard(false);
        playSynth("click");
        renderPrepScreen();
        return;
      }

      const sourceCard = getCardAt(source.area, source.index);
      const targetCard = getCardAt(area, index);

      if (targetCard) {
        // If they are both animal cards and have matching IDs, merge them
        const isSrcAnimal = sourceCard.atk !== undefined;
        const isTgtAnimal = targetCard.atk !== undefined;
        if (isSrcAnimal && isTgtAnimal && sourceCard.id === targetCard.id) {
          selectedSlot = null;
          highlightSelectedCard(false);
          executeAction(source.area, source.index, area, index);
        }
        // If source is food/item and target is animal, feed them
        else if (source.area === "shop-item" && isTgtAnimal) {
          selectedSlot = null;
          highlightSelectedCard(false);
          executeAction(source.area, source.index, area, index);
        }
        // Otherwise, switch active selection to the tapped card!
        else {
          selectedSlot = { area, index };
          highlightSelectedCard(true);
          playSynth("click");
          renderPrepScreen();
        }
      } else {
        // Tapped empty slot: execute move/buy action
        selectedSlot = null;
        highlightSelectedCard(false);
        executeAction(source.area, source.index, area, index);
      }
    }
  }

  function getCardAt(area, index) {
    if (area === "squad") return state.squad[index];
    if (area === "bench") return state.bench[index];
    if (area === "shop-animal") return state.shop.animals[index];
    if (area === "shop-item") return state.shop.items[index];
    return null;
  }

  function setCardAt(area, index, card) {
    if (area === "squad") state.squad[index] = card;
    if (area === "bench") state.bench[index] = card;
    if (area === "shop-animal") state.shop.animals[index] = card;
    if (area === "shop-item") state.shop.items[index] = card;
  }

  function highlightSelectedCard(highlight) {
    // clear all selected outlines
    document.querySelectorAll(".card-item").forEach((el) => {
      el.style.borderStyle = "";
      el.style.borderColor = "";
    });

    if (highlight && selectedSlot) {
      const parent = $(`${selectedSlot.area}Grid`) || $("shopRow");
      if (parent) {
        const item = parent.querySelector(`[data-slot="${selectedSlot.index}"][data-area="${selectedSlot.area}"]`);
        if (item) {
          item.style.borderStyle = "solid";
          item.style.borderColor = "var(--mint)";
        }
      }
    }
  }

  // Central game economy and positioning handler
  function executeAction(srcArea, srcIndex, destArea, destIndex) {
    const card = getCardAt(srcArea, srcIndex);
    if (!card) return;

    // 1. Buy Animal from Shop
    if (srcArea === "shop-animal" && (destArea === "squad" || destArea === "bench")) {
      if (state.gold < 3) {
        alert(t("noGold"));
        return;
      }
      const targetCard = getCardAt(destArea, destIndex);
      if (!targetCard) {
        // Empty slot: buy
        state.gold -= 3;
        setCardAt(srcArea, srcIndex, null);
        setCardAt(destArea, destIndex, card);
        triggerBuyAbility(card);
        playSynth("buy");
      } else if (targetCard.id === card.id) {
        // Combine shop with existing
        state.gold -= 3;
        setCardAt(srcArea, srcIndex, null);
        combineCards(targetCard, card);
        playSynth("combine");
      }
    }

    // 2. Buy Food / Relic from Shop
    else if (srcArea === "shop-item" && (destArea === "squad" || destArea === "bench")) {
      const targetCard = getCardAt(destArea, destIndex);
      if (!targetCard) return; // food must be fed to animal
      if (state.gold < 3) {
        alert(t("noGold"));
        return;
      }
      state.gold -= 3;
      setCardAt(srcArea, srcIndex, null);
      feedAnimal(targetCard, card);
      playSynth("buy");
    }

    // 3. Move/Combine inside active zones
    else if ((srcArea === "squad" || srcArea === "bench") && (destArea === "squad" || destArea === "bench")) {
      if (srcArea === destArea && srcIndex === destIndex) return;

      const targetCard = getCardAt(destArea, destIndex);
      if (!targetCard) {
        // Move to empty
        setCardAt(srcArea, srcIndex, null);
        setCardAt(destArea, destIndex, card);
        playSynth("click");
      } else if (targetCard.id === card.id) {
        // Combine
        setCardAt(srcArea, srcIndex, null);
        combineCards(targetCard, card);
        playSynth("combine");
      } else {
        // Swap slots
        setCardAt(srcArea, srcIndex, targetCard);
        setCardAt(destArea, destIndex, card);
        playSynth("click");
      }
    }

    updateHUD();
    renderPrepScreen();
  }

  // Level combination calculations (SAP rule)
  function combineCards(mainCard, secondaryCard) {
    mainCard.exp += secondaryCard.exp;
    // Combine raw base stats
    mainCard.currentAtk += 1;
    mainCard.currentHp += 1;
    mainCard.maxHp += 1;

    // Check level ups
    let newLevel = 1;
    if (mainCard.exp >= 6) {
      newLevel = 3;
      mainCard.currentAtk += 3;
      mainCard.currentHp += 3;
      mainCard.maxHp += 3;
    } else if (mainCard.exp >= 3) {
      newLevel = 2;
      mainCard.currentAtk += 1.5; // Round upward in float or convert integer
      mainCard.currentHp += 1.5;
      mainCard.maxHp += 1.5;
      mainCard.currentAtk = Math.ceil(mainCard.currentAtk);
      mainCard.currentHp = Math.ceil(mainCard.currentHp);
      mainCard.maxHp = Math.ceil(mainCard.maxHp);
    }
    
    if (newLevel > mainCard.level) {
      mainCard.level = newLevel;
    }
  }

  // Food / Relic feeding mechanic
  function feedAnimal(animal, food) {
    if (food.id === 0) {
      // Apple: +1/+1
      animal.currentAtk += 1;
      animal.currentHp += 1;
      animal.maxHp += 1;
      playSynth("buff");
    } else if (food.id === 1) {
      // Honey: +2 HP, gain 1 gold back immediately
      animal.currentHp += 2;
      animal.maxHp += 2;
      state.gold = Math.min(10, state.gold + 1);
      playSynth("buff");
    } else if (food.id === 2) {
      // Melon: gives Melon Shield
      animal.hasShield = true;
      playSynth("shield");
    } else if (food.id === 3) {
      // Chocolate: +2 Exp
      combineCards(animal, { exp: 2, level: 1, atk: 0, hp: 0 });
      playSynth("combine");
    }
    window.WonderAnalytics?.track("feed_food", { game_id: GAME_ID, food_id: food.id });
  }

  // Skill Card Triggers
  function triggerBuyAbility(card) {
    const level = card.level;
    if (card.id === 0) {
      // Squirrel: gain +1/+1 (+2/+2 at Lv2, +3/+3 at Lv3)
      card.currentAtk += level;
      card.currentHp += level;
      card.maxHp += level;
      playSynth("buff");
    } else if (card.id === 2) {
      // Beaver: give 2 random allies +1 HP
      buffRandomAllies(2, 0, level);
    } else if (card.id === 5) {
      // Raccoon: free reroll this round
      state.freeRerollThisRound = true;
      translateUI();
    } else if (card.id === 8) {
      // Lion: give all allies +2 HP
      state.squad.concat(state.bench).forEach((c) => {
        if (c && c !== card) {
          c.currentHp += 2 * level;
          c.maxHp += 2 * level;
        }
      });
      playSynth("buff");
    }
  }

  function triggerSellAbility(card) {
    const level = card.level;
    if (card.id === 1) {
      // Otter: +1 HP to random ally
      buffRandomAllies(1, 0, level);
    } else if (card.id === 3) {
      // Owl: +1 Gold on sell
      state.gold = Math.min(10, state.gold + level);
    } else if (card.id === 6) {
      // Fox: +2/+2 to random shop card
      const shopAnimals = state.shop.animals.filter(Boolean);
      if (shopAnimals.length) {
        const rand = shopAnimals[Math.floor(Math.random() * shopAnimals.length)];
        rand.currentAtk += 2 * level;
        rand.currentHp += 2 * level;
        rand.maxHp += 2 * level;
        playSynth("buff");
      }
    }
  }

  function buffRandomAllies(count, atkVal, hpVal) {
    const allies = state.squad.concat(state.bench).filter((c) => c !== null);
    if (!allies.length) return;
    for (let i = 0; i < count; i++) {
      const rand = allies[Math.floor(Math.random() * allies.length)];
      rand.currentAtk += atkVal;
      rand.currentHp += hpVal;
      rand.maxHp += hpVal;
    }
    playSynth("buff");
  }

  // Sell Action (handled by double tap, special button, or dropping out of grid)
  // Let's make a Sell overlay button or drop zone, or simple tap behavior.
  // Tap-to-select: if card selected, show a "Sell" button in the shop header!
  // This is extremely simple and clean.
  function handleSellSelected() {
    if (!selectedSlot) return;
    const card = getCardAt(selectedSlot.area, selectedSlot.index);
    if (!card) return;

    triggerSellAbility(card);
    state.gold = Math.min(10, state.gold + 1); // sell price is always 1 gold
    setCardAt(selectedSlot.area, selectedSlot.index, null);
    selectedSlot = null;
    playSynth("sell");
    updateHUD();
    renderPrepScreen();
  }

  // Reroll Shop items
  function rerollShop() {
    initAudio();
    const rerollCost = state.freeRerollThisRound ? 0 : 1;
    if (state.gold < rerollCost) {
      alert(t("noGold"));
      return;
    }

    state.gold -= rerollCost;
    state.freeRerollThisRound = false;
    state.rerollsUsedThisRound++;
    
    playSynth("sell");
    generateShop();
    updateHUD();
    renderPrepScreen();
  }

  // Toggle freeze item status
  function toggleFreeze(area, idx) {
    initAudio();
    if (area === "animal") {
      state.shop.frozenAnimals[idx] = !state.shop.frozenAnimals[idx];
    } else {
      state.shop.frozenItems[idx] = !state.shop.frozenItems[idx];
    }
    playSynth("click");
    renderPrepScreen();
  }

  // Rendering Shop grids
  function renderSquad() {
    nodes.squadGrid.innerHTML = "";
    state.squad.forEach((card, idx) => {
      const el = makeCardElement(card, "squad", idx);
      nodes.squadGrid.appendChild(el);
    });
  }

  function renderBench() {
    nodes.benchGrid.innerHTML = "";
    state.bench.forEach((card, idx) => {
      const el = makeCardElement(card, "bench", idx);
      nodes.benchGrid.appendChild(el);
    });
  }

  function renderShop() {
    nodes.shopRow.innerHTML = "";
    
    // Animals (slots 0-2)
    state.shop.animals.forEach((card, idx) => {
      const cell = document.createElement("div");
      cell.className = "shop-cell";
      cell.style.position = "relative";
      
      const itemEl = makeCardElement(card, "shop-animal", idx);
      cell.appendChild(itemEl);

      // Freeze button overlay if card exists
      if (card) {
        const freezeBtn = document.createElement("button");
        freezeBtn.className = "card-frozen-tag";
        freezeBtn.style.top = "auto";
        freezeBtn.style.bottom = "6px";
        freezeBtn.style.cursor = "pointer";
        freezeBtn.textContent = state.shop.frozenAnimals[idx] ? t("unfreeze") : t("freeze");
        freezeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleFreeze("animal", idx);
        });
        cell.appendChild(freezeBtn);
      }
      nodes.shopRow.appendChild(cell);
    });

    // Items (slots 0-1, placed in shop slots 3-4)
    state.shop.items.forEach((card, idx) => {
      const cell = document.createElement("div");
      cell.className = "shop-cell";
      cell.style.position = "relative";

      const itemEl = makeCardElement(card, "shop-item", idx);
      cell.appendChild(itemEl);

      if (card) {
        const freezeBtn = document.createElement("button");
        freezeBtn.className = "card-frozen-tag";
        freezeBtn.style.top = "auto";
        freezeBtn.style.bottom = "6px";
        freezeBtn.style.cursor = "pointer";
        freezeBtn.textContent = state.shop.frozenItems[idx] ? t("unfreeze") : t("freeze");
        freezeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleFreeze("item", idx);
        });
        cell.appendChild(freezeBtn);
      }
      nodes.shopRow.appendChild(cell);
    });

    // Toggle static Sell Button visibility based on selection
    if (selectedSlot) {
      nodes.sellCardBtn.classList.remove("is-hidden");
      nodes.sellCardBtn.textContent = `${t("sell")} (+1 ${t("gold")})`;
    } else {
      nodes.sellCardBtn.classList.add("is-hidden");
    }
  }

  // Combat Execution
  function startBattle() {
    initAudio();
    playSynth("click");

    // Gather active players (non-null in squad)
    const activeSquad = state.squad.filter(Boolean);
    if (!activeSquad.length) {
      alert("Position at least one animal in your squad before entering battle!");
      return;
    }

    // Prepare combatants (deep clone to not alter permanent state)
    state.combat.playerSquad = activeSquad.map((c) => ({
      ...c,
      hp: c.currentHp,
      maxHp: c.maxHp,
      atk: c.currentAtk,
      shield: c.hasShield
    }));

    // Trigger Maple Shield relic (first unit gets shield)
    if (state.relic?.id === 0 && state.combat.playerSquad.length) {
      state.combat.playerSquad[0].shield = true;
    }
    // Trigger Oak Seed relic (+1 HP in combat)
    if (state.relic?.id === 1) {
      state.combat.playerSquad.forEach((c) => {
        c.hp += 1;
        c.maxHp += 1;
      });
    }
    // Trigger Shadow Claw relic (+1 Atk in combat)
    if (state.relic?.id === 2) {
      state.combat.playerSquad.forEach((c) => c.atk += 1);
    }

    // Generate Enemy shadow team based on round difficulty
    state.combat.enemySquad = generateEnemySquad(state.round);

    // Swap views
    nodes.prepPhaseArea.classList.add("is-hidden");
    nodes.combatArea.classList.remove("is-hidden");
    nodes.combatSummary?.classList.remove("is-hidden");
    nodes.hintText.textContent = "";

    // Reset combat state
    state.combat.step = 0;
    state.combat.log = [];
    state.combat.animating = true;
    state.combat.timer = 0;
    state.combat.effects = [];
    
    canvasCtx = nodes.gameCanvas.getContext("2d");
    combatLog(t("combatIntro"));
    updateCombatSummary();
    
    // Start animation loop
    runCombatAnimation();
    window.WonderAnalytics?.track("battle_start", { game_id: GAME_ID, round: state.round });
  }

  function generateEnemySquad(round) {
    const enemiesCount = Math.min(5, Math.ceil(round / 2) + 1);
    const squad = [];
    const limit = Math.min(ENEMY_METADATA.length, Math.ceil(round / 2));
    
    for (let i = 0; i < enemiesCount; i++) {
      // Pick random enemy matching difficulty tier
      const rand = ENEMY_METADATA[Math.floor(Math.random() * limit)];
      // Enemy stats ramp up with round count
      const scale = 1 + (round - 1) * 0.28;
      const baseAtk = Math.max(1, Math.round(2 * scale));
      const baseHp = Math.max(1, Math.round(3 * scale));
      
      squad.push({
        id: rand.id,
        nameEn: rand.nameEn,
        nameZht: rand.nameZht,
        sx: rand.sx,
        sy: rand.sy,
        atk: baseAtk,
        hp: baseHp,
        maxHp: baseHp,
        shield: false
      });
    }
    return squad;
  }

  function combatLog(message) {
    state.combat.status = message;
    nodes.combatStatusText.textContent = message;
  }

  // Rendering Loop for Auto-Battle Canvas
  function runCombatAnimation() {
    if (!state.combat.animating) return;
    animationId = requestAnimationFrame(runCombatAnimation);

    // Clear Canvas
    canvasCtx.clearRect(0, 0, 960, 540);

    // Draw battlefield background
    if (imageCache.bg) {
      canvasCtx.drawImage(imageCache.bg, 0, 0, 960, 540);
    } else {
      canvasCtx.fillStyle = "#0c1f17";
      canvasCtx.fillRect(0, 0, 960, 540);
    }

    // Step logic every 90 frames
    state.combat.timer++;
    if (state.combat.timer >= 90) {
      state.combat.timer = 0;
      resolveCombatStep();
    }
    updateCombatSummary();

    // Draw Squad lines
    state.combat.layout = [];
    drawSquadLine(state.combat.playerSquad, "player");
    drawSquadLine(state.combat.enemySquad, "enemy");
    window.__ANIMAL_AUTO_SQUAD_COMBAT_LAYOUT__ = state.combat.layout;

    // Draw active particle effects
    drawEffects();
  }

  function drawSquadLine(squad, team) {
    const isPlayer = team === "player";
    const mobileCombat = window.matchMedia?.("(max-width: 640px)")?.matches;
    const xBase = isPlayer ? (mobileCombat ? 390 : 400) : (mobileCombat ? 570 : 560); // front unit centers
    const spacing = mobileCombat ? 84 : 100;
    
    squad.forEach((unit, idx) => {
      // Slide active slots forward
      const targetX = xBase + (isPlayer ? -1 : 1) * idx * spacing;
      
      // Draw card frame
      canvasCtx.save();
      canvasCtx.shadowColor = "black";
      canvasCtx.shadowBlur = 10;
      
      // Apply shake frame offsets if shaking
      let shakeX = 0;
      if (state.combat.shakeFrames > 0 && state.combat.shakeTarget === team && idx === 0) {
        shakeX = Math.sin(state.combat.shakeFrames) * 8;
        state.combat.shakeFrames--;
      }
      
      const w = mobileCombat ? 82 : 88;
      const h = mobileCombat ? 116 : 112;
      const x = targetX + shakeX - w / 2;
      const y = (mobileCombat ? 286 : 258) - h / 2;
      state.combat.layout?.push({ team, index: idx, x, y, w, h });

      // Draw backdrop
      canvasCtx.fillStyle = isPlayer ? "rgba(10, 30, 24, 0.9)" : "rgba(35, 12, 12, 0.9)";
      canvasCtx.strokeStyle = isPlayer ? "var(--mint)" : "var(--danger)";
      canvasCtx.lineWidth = 2;
      
      // Draw rounded rectangle
      canvasCtx.beginPath();
      canvasCtx.roundRect(x, y, w, h, 10);
      canvasCtx.fill();
      canvasCtx.stroke();
      
      // Draw character sprite
      if (isPlayer) {
        const portrait = imageCache[unit.imageKey] || imageCache.boomLion;
        if (portrait) canvasCtx.drawImage(portrait, x + 10, y + 20, w - 20, h - 58);
      } else {
        const sheet = imageCache.enemies;
        if (sheet) {
          const sw = 682;
          const sh = 768;
          canvasCtx.drawImage(sheet, unit.sx, unit.sy, sw, sh, x + 12, y + 20, w - 24, h - 60);
        }
      }

      drawUnitHealthBar(unit, x + 8, y + 8, w - 16, isPlayer);

      // Draw Melon shield overlay
      if (unit.shield) {
        canvasCtx.strokeStyle = "#5e8cf2";
        canvasCtx.lineWidth = 3;
        canvasCtx.beginPath();
        canvasCtx.arc(x + w/2, y + h/2 - 10, w/2 - 2, 0, Math.PI * 2);
        canvasCtx.stroke();
      }

      // Draw Stats HUD bottom
      canvasCtx.fillStyle = "rgba(0, 0, 0, 0.75)";
      canvasCtx.fillRect(x + 2, y + h - 22, w - 4, 20);

      canvasCtx.font = "bold 11px Outfit, system-ui";
      canvasCtx.fillStyle = "var(--gold)";
      canvasCtx.fillText(`ATK ${unit.atk}`, x + 6, y + h - 8);

      canvasCtx.fillStyle = "var(--danger)";
      const hpText = `HP ${Math.max(0, unit.hp)}`;
      const hpWidth = canvasCtx.measureText(hpText).width;
      canvasCtx.fillText(hpText, x + w - hpWidth - 6, y + h - 8);

      // Level star indicator for player units
      if (isPlayer && unit.level > 1) {
        canvasCtx.fillStyle = "var(--gold)";
        canvasCtx.fillText(`★${unit.level}`, x + w/2 - 8, y + 16);
      }

      canvasCtx.restore();
    });
  }

  function drawUnitHealthBar(unit, x, y, width, isPlayer) {
    const hp = Math.max(0, Math.round(unit.hp || 0));
    const maxHp = Math.max(1, Math.round(unit.maxHp || hp || 1));
    const pct = Math.max(0, Math.min(1, hp / maxHp));
    const barHeight = 12;

    canvasCtx.save();
    canvasCtx.fillStyle = "rgba(0, 0, 0, 0.82)";
    canvasCtx.strokeStyle = "rgba(255, 255, 255, 0.72)";
    canvasCtx.lineWidth = 2;
    canvasCtx.beginPath();
    canvasCtx.roundRect(x, y, width, barHeight, 7);
    canvasCtx.fill();
    canvasCtx.stroke();

    canvasCtx.fillStyle = pct > 0.45 ? "#53f29d" : pct > 0.22 ? "#ffd666" : "#ff5266";
    canvasCtx.beginPath();
    canvasCtx.roundRect(x + 2, y + 2, Math.max(4, (width - 4) * pct), barHeight - 4, 5);
    canvasCtx.fill();

    canvasCtx.font = "bold 10px Outfit, system-ui";
    canvasCtx.textAlign = "center";
    canvasCtx.textBaseline = "middle";
    canvasCtx.lineWidth = 3;
    canvasCtx.strokeStyle = "rgba(0, 0, 0, 0.9)";
    canvasCtx.fillStyle = isPlayer ? "#ffffff" : "#ffe1e6";
    canvasCtx.strokeText(`${hp}/${maxHp}`, x + width / 2, y + barHeight / 2 + 0.5);
    canvasCtx.fillText(`${hp}/${maxHp}`, x + width / 2, y + barHeight / 2 + 0.5);
    canvasCtx.restore();
  }

  function updateCombatSummary() {
    if (!nodes.combatSummary || !state.combat.animating) return;
    const sumHp = (squad) => squad.reduce((total, unit) => total + Math.max(0, Math.round(unit.hp || 0)), 0);
    const sumMax = (squad) => squad.reduce((total, unit) => total + Math.max(1, Math.round(unit.maxHp || unit.hp || 1)), 0);
    const playerHp = sumHp(state.combat.playerSquad);
    const playerMax = sumMax(state.combat.playerSquad);
    const enemyHp = sumHp(state.combat.enemySquad);
    const enemyMax = sumMax(state.combat.enemySquad);
    const playerFront = state.combat.playerSquad[0];
    const enemyFront = state.combat.enemySquad[0];
    const playerName = playerFront ? (locale === "zh-Hant" ? playerFront.nameZht : playerFront.nameEn) : "-";
    const enemyName = enemyFront ? (locale === "zh-Hant" ? enemyFront.nameZht : enemyFront.nameEn) : "-";
    const summary = t("combatSummary", { playerHp, playerMax, enemyHp, enemyMax });
    const front = t("combatFront", { player: playerName, enemy: enemyName });
    nodes.combatSummary.innerHTML = `<strong>${summary}</strong><span>${front}</span>`;
  }

  function drawEffects() {
    state.combat.effects = state.combat.effects.filter((fx) => {
      fx.life--;
      
      canvasCtx.save();
      // Draw particle overlay
      if (fx.type === "hit") {
        canvasCtx.drawImage(imageCache.fx, 0, 0, 307, 512, fx.x - 40, fx.y - 40, 80, 80);
      } else if (fx.type === "shield") {
        canvasCtx.drawImage(imageCache.fx, 307, 0, 307, 512, fx.x - 40, fx.y - 40, 80, 80);
      } else if (fx.type === "heal") {
        canvasCtx.drawImage(imageCache.fx, 614, 0, 307, 512, fx.x - 40, fx.y - 40, 80, 80);
      } else if (fx.type === "buff") {
        canvasCtx.drawImage(imageCache.fx, 921, 0, 307, 512, fx.x - 40, fx.y - 40, 80, 80);
      } else if (fx.type === "smoke") {
        canvasCtx.drawImage(imageCache.fx, 1228, 0, 307, 512, fx.x - 40, fx.y - 40, 80, 80);
      }
      
      // Floating text overlays (e.g. Damage numbers)
      if (fx.text) {
        canvasCtx.font = "bold 20px Outfit, system-ui";
        canvasCtx.fillStyle = fx.textColor || "white";
        canvasCtx.strokeStyle = "black";
        canvasCtx.lineWidth = 3;
        canvasCtx.strokeText(fx.text, fx.x - 10, fx.y - 20 + (15 - fx.life));
        canvasCtx.fillText(fx.text, fx.x - 10, fx.y - 20 + (15 - fx.life));
      }

      canvasCtx.restore();
      return fx.life > 0;
    });
  }

  // Sequential Combat Turn Steps logic
  function resolveCombatStep() {
    const playerSquad = state.combat.playerSquad;
    const enemySquad = state.combat.enemySquad;

    // Check end condition
    if (!playerSquad.length && !enemySquad.length) {
      combatLog(t("drawText"));
      playSynth("fail");
      setTimeout(() => endBattleRun("draw"), 1500);
      return;
    }
    if (!playerSquad.length) {
      combatLog(t("failText"));
      playSynth("fail");
      setTimeout(() => endBattleRun("lose"), 1500);
      return;
    }
    if (!enemySquad.length) {
      combatLog(t("winText"));
      playSynth("win");
      setTimeout(() => endBattleRun("win"), 1500);
      return;
    }

    // Clash frontmost units
    const pUnit = playerSquad[0];
    const eUnit = enemySquad[0];

    // Trigger visual shake/bump animation
    state.combat.shakeFrames = 10;
    state.combat.shakeTarget = "player";
    playSynth("hit");

    // Apply shield logic
    let pDmg = eUnit.atk;
    let eDmg = pUnit.atk;

    if (pUnit.shield) {
      pDmg = 0;
      pUnit.shield = false;
      state.combat.effects.push({ type: "shield", x: 400, y: 250, life: 15 });
    }
    if (eUnit.shield) {
      eDmg = 0;
      eUnit.shield = false;
      state.combat.effects.push({ type: "shield", x: 560, y: 250, life: 15 });
    }

    pUnit.hp -= pDmg;
    eUnit.hp -= eDmg;

    // Hit visual overlays
    state.combat.effects.push({ type: "hit", x: 480, y: 250, life: 12 });
    if (pDmg > 0) {
      state.combat.effects.push({ type: "smoke", x: 400, y: 250, life: 15, text: `-${pDmg}`, textColor: "var(--danger)" });
    }
    if (eDmg > 0) {
      state.combat.effects.push({ type: "smoke", x: 560, y: 250, life: 15, text: `-${eDmg}`, textColor: "var(--danger)" });
    }

    combatLog(`${locale === "zh-Hant" ? pUnit.nameZht : pUnit.nameEn} ⚔️ ${locale === "zh-Hant" ? eUnit.nameZht : eUnit.nameEn}`);

    // Check faints
    setTimeout(() => {
      let fainted = false;
      if (pUnit.hp <= 0) {
        playerSquad.shift();
        state.combat.effects.push({ type: "smoke", x: 400, y: 250, life: 20 });
        triggerFaintAbility(pUnit, "player");
        fainted = true;
      }
      if (eUnit.hp <= 0) {
        enemySquad.shift();
        state.combat.effects.push({ type: "smoke", x: 560, y: 250, life: 20 });
        triggerFaintAbility(eUnit, "enemy");
        fainted = true;
      }
      if (fainted) {
        playSynth("faint");
      }
    }, 400);
  }

  // Combat Faint triggers
  function triggerFaintAbility(unit, team) {
    const isPlayer = team === "player";
    const squad = isPlayer ? state.combat.playerSquad : state.combat.enemySquad;
    const level = unit.level || 1;

    if (isPlayer) {
      if (unit.id === 4) {
        // Turtle: Melon shield to behind ally
        if (squad.length) {
          squad[0].shield = true;
          state.combat.effects.push({ type: "shield", x: 400 - 100, y: 250, life: 15 });
        }
      } else if (unit.id === 7) {
        // Wolf: give all allies +1/+1
        squad.forEach((c) => {
          c.atk += level;
          c.hp += level;
        });
        state.combat.effects.push({ type: "buff", x: 250, y: 250, life: 20 });
      } else if (unit.id === 9) {
        // Bear: deals 4 dmg to lead enemy
        const enemySquad = state.combat.enemySquad;
        if (enemySquad.length) {
          enemySquad[0].hp -= 4 * level;
          state.combat.effects.push({ type: "hit", x: 560, y: 250, life: 15, text: `-${4 * level}`, textColor: "yellow" });
        }
      }
    }
  }

  // End Battle results
  function endBattleRun(result) {
    state.combat.animating = false;
    cancelAnimationFrame(animationId);

    if (result === "win") {
      // Victory: next round
      if (state.round >= 10) {
        // Finished Stage Clear!
        state.activeRun = false;
        save.clearedRuns++;
        save.bestRound = 10;
        saveSave();
        openResultScreen(true);
      } else {
        state.round++;
        if (state.round > save.bestRound) {
          save.bestRound = state.round;
          saveSave();
        }
        // Return to shop prep
        nodes.prepPhaseArea.classList.remove("is-hidden");
        nodes.combatArea.classList.add("is-hidden");
        nodes.combatSummary?.classList.add("is-hidden");
        startRoundPrep();
      }
    } else if (result === "lose") {
      // Defeat: lose 1 Heart
      state.hearts--;
      updateHUD();
      if (state.hearts <= 0) {
        // Run fail, open Revive draft
        openRevivePopup();
      } else {
        // Return to shop prep
        nodes.prepPhaseArea.classList.remove("is-hidden");
        nodes.combatArea.classList.add("is-hidden");
        nodes.combatSummary?.classList.add("is-hidden");
        startRoundPrep();
      }
    } else {
      // Draw: no heart lost, return to shop
      nodes.prepPhaseArea.classList.remove("is-hidden");
      nodes.combatArea.classList.add("is-hidden");
      nodes.combatSummary?.classList.add("is-hidden");
      startRoundPrep();
    }
    window.WonderAnalytics?.track("battle_end", { game_id: GAME_ID, round: state.round, result });
  }

  // Revival Popup (spend 5 diamonds)
  function openRevivePopup() {
    nodes.defeatRevivePanel.classList.remove("is-hidden");
    nodes.reviveBtn.textContent = t("reviveAction");
  }

  function handleRevive() {
    initAudio();
    if (getWalletDiamonds() < 5) {
      alert(t("noDiamonds"));
      playSynth("click");
      return;
    }
    if (spendWalletDiamonds(5)) {
      nodes.defeatRevivePanel.classList.add("is-hidden");
      state.hearts = 2;
      playSynth("revive");
      
      // Return to shop prep
      nodes.prepPhaseArea.classList.remove("is-hidden");
      nodes.combatArea.classList.add("is-hidden");
      startRoundPrep();
      window.WonderAnalytics?.track("expedition_revive", { game_id: GAME_ID, cost: 5 });
    }
  }

  function handleGiveUp() {
    initAudio();
    playSynth("click");
    nodes.defeatRevivePanel.classList.add("is-hidden");
    state.activeRun = false;
    openResultScreen(false);
  }

  // Result Board View
  function openResultScreen(isWin) {
    nodes.gamePanel.classList.add("is-hidden");
    nodes.resultPanel.classList.remove("is-hidden");

    nodes.resultTitle.textContent = isWin ? t("expeditionClear") : t("expeditionFail");
    nodes.resultText.textContent = isWin
      ? t("winText")
      : `${t("failText")} (${t("round")}: ${state.round})`;
    nodes.skillReportText.innerHTML = `<strong>${t("skillReport")}</strong><br/>${t("skillsLearned")}`;
    
    playSynth(isWin ? "win" : "fail");
    window.WonderAnalytics?.track("expedition_end", { game_id: GAME_ID, round: state.round, cleared: isWin });
  }

  function quitRun() {
    if (confirm("Are you sure you want to quit the current expedition run? All temporary squad progress will be lost.")) {
      initAudio();
      playSynth("sell");
      state.activeRun = false;
      renderMenu();
    }
  }

  // Event Listeners Registration
  function setupEvents() {
    nodes.startBtn.addEventListener("click", startExpedition);
    nodes.rerollShopBtn.addEventListener("click", rerollShop);
    nodes.startBattleBtn.addEventListener("click", startBattle);
    nodes.quitRunBtn.addEventListener("click", quitRun);
    
    nodes.buySkinBtn.addEventListener("click", handleBuySkin);
    nodes.equipSkinBtn.addEventListener("click", handleEquipSkin);
    
    nodes.reviveBtn.addEventListener("click", handleRevive);
    nodes.giveUpBtn.addEventListener("click", handleGiveUp);
    
    nodes.retryBtn.addEventListener("click", () => {
      nodes.resultPanel.classList.add("is-hidden");
      startExpedition();
    });
    nodes.resultMenuBtn.addEventListener("click", renderMenu);
    
    nodes.localeSelect.addEventListener("change", (e) => {
      setLocale(e.target.value);
    });

    nodes.sellCardBtn.addEventListener("click", handleSellSelected);

    window.addEventListener("wonder:locale-change", (e) => {
      const next = e.detail?.locale || window.WonderI18n?.locale?.();
      if (next && next !== locale) {
        setLocale(next);
      }
    });

    // Close overlays on document tap to reset selections
    document.addEventListener("click", () => {
      if (selectedSlot !== null) {
        selectedSlot = null;
        highlightSelectedCard(false);
        renderPrepScreen();
      }
    });
  }

  // Initialization
  startApp();

})();
