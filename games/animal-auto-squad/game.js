(function () {
  const GAME_ID = "animal-auto-squad";
  const localeKey = "weightPlayLocale";
  const saveKey = "animal_auto_squad_save";

  // Localization Dictionary
  const text = {
    en: {
      title: "Animal Auto Squad",
      menuTitle: "Draft and position your animal squad!",
      menuHint: "Train your owned animals, choose a squad, and clear balanced five-wave forest stages. Each cleared stage unlocks the next challenge.",
      bestExpedition: "Best Run",
      expeditionsCleared: "Cleared Runs",
      teamLevel: "Team Level",
      diamonds: "Diamonds",
      trainingTitle: "Squad Training",
      trainingGold: "Training Gold",
      owned: "Owned",
      locked: "Locked",
      premium: "Premium",
      unlockGold: "Unlock {cost} Gold",
      unlockDiamond: "Unlock {cost} Diamonds",
      upgradeGold: "Upgrade {cost} Gold",
      freeUnit: "Starter",
      rosterHint: "Unlocked animals appear in your expedition backpack. Permanent levels are saved locally.",
      startExpedition: "Start Expedition",
      chooseExpedition: "Choose Expedition",
      stageSetup: "Pick an unlocked forest stage, then prepare your squad for the expedition.",
      yourSquadLabel: "Active Squad (Left: Frontline | Right: Backline)",
      benchLabel: "Storage Bench",
      shopLabel: "Character Backpack",
      startBattle: "Start Battle",
      round: "Wave",
      stage: "Stage",
      chooseStage: "Choose Stage",
      stageReady: "Ready",
      stageCleared: "Cleared",
      stageLocked: "Clear the previous stage",
      stageProgress: "Unlocked {unlocked}/{total}",
      stageWaveCount: "{count} waves",
      startStage: "Start Stage {stage}",
      nextStage: "Next Stage",
      stageClearText: "Stage {stage} cleared! Stage {next} is now unlocked.",
      allStagesClearText: "All forest stages cleared! Replay any stage to strengthen your squad.",
      gold: "Gold",
      supplies: "Supplies",
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
      guideHint: "Drag or tap owned animals from the backpack into your squad. Expedition upgrades use temporary Supplies and reset after the run.",
      level: "Lv.",
      buy: "Buy",
      sell: "Sell",
      upgradeRun: "Run Upgrade ({cost} Supplies)",
      backpackHint: "Owned animals only. Move them into the active squad, then spend Supplies for temporary expedition upgrades.",
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
      noSupplies: "Not enough supplies!",
      teamBonusTitle: "Permanent team bonus",
      teamBonusValue: "All owned animals enter expeditions with +{atk} ATK and +{hp} HP from Team Level.",
      teamBonusNext: "Next team level in {remaining} XP.",
      relicMaple: "Maple Shield: Front unit starts with Melon Shield.",
      relicOak: "Oak Seed: All units gain +1 Health in battle.",
      relicShadow: "Shadow Claw: All units gain +1 Attack in battle.",
      relicClover: "Clover Leaf: First shop reroll each round is free.",
      roundNum: "Stage {stage} - Wave {round}/5",
      teamLevelValue: "Lv.{level}  XP {xp}/{goal}"
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
      roundNum: "第 {stage} 關 - 第 {round}/5 波"
    }
  };

  const pageMeta = {
    en: {
      title: "Animal Auto Squad - Play Free Auto-Battler Game",
      description: "Animal Auto Squad is a free online 13+ strategy auto-battler. Draft chibi animal cards, level up your squad, choose relic buffs, and defeat shadow monsters.",
      ogDescription: "Draft and position your chibi animal squad. Train permanent units and clear six balanced five-wave forest stages.",
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
    { id: 0, nameEn: "Spark Paw Fox", nameZht: "\u661f\u722a\u72d0", imageKey: "sparkFox", tier: 1, atk: 2, hp: 2, roleEn: "Pounce", roleZht: "\u8df3\u64ca", descEn: "Buy: gains +1/+1. Battle: deals Lv damage to the lead enemy before each clash.", descZht: "\u8cfc\u8cb7\uff1a\u7372\u5f97 +1/+1\u3002\u6230\u9b25\uff1a\u6bcf\u6b21\u4ea4\u92d2\u524d\u5c0d\u6700\u524d\u65b9\u6575\u4eba\u9020\u6210\u7b49\u7d1a\u50b7\u5bb3\u3002" },
    { id: 1, nameEn: "Bubble Fin Otter", nameZht: "\u6ce1\u6ce1\u9c2d\u6c34\u737a", imageKey: "bubbleOtter", tier: 1, atk: 1, hp: 3, roleEn: "Tide Care", roleZht: "\u6f6e\u6c50\u6cbb\u7652", descEn: "Sell: gives a random ally +1 HP. Battle: heals the weakest ally by Lv.", descZht: "\u51fa\u552e\uff1a\u96a8\u6a5f\u968a\u53cb +1 \u751f\u547d\u3002\u6230\u9b25\uff1a\u6cbb\u7652\u751f\u547d\u6700\u4f4e\u7684\u968a\u53cb\u7b49\u7d1a\u9ede\u3002" },
    { id: 2, nameEn: "Drum Belly Panda", nameZht: "\u9f13\u809a\u718a\u8c93", imageKey: "drumPanda", tier: 2, atk: 3, hp: 2, roleEn: "Rhythm Guard", roleZht: "\u7bc0\u594f\u5b88\u8b77", descEn: "Buy: gives two allies +1 HP. Battle start: gives all allies +Lv HP.", descZht: "\u8cfc\u8cb7\uff1a\u5169\u540d\u968a\u53cb +1 \u751f\u547d\u3002\u958b\u6230\uff1a\u5168\u9ad4\u968a\u53cb +\u7b49\u7d1a \u751f\u547d\u3002" },
    { id: 3, nameEn: "Moon Cap Owl", nameZht: "\u6708\u5e3d\u8c93\u982d\u9df9", imageKey: "moonOwl", tier: 2, atk: 2, hp: 3, roleEn: "Starfall", roleZht: "\u661f\u843d\u9023\u64ca", descEn: "Sell: gains +1 extra Gold. Battle: randomly strikes two enemies.", descZht: "\u51fa\u552e\uff1a\u984d\u5916\u7372\u5f97 1 \u91d1\u5e63\u3002\u6230\u9b25\uff1a\u96a8\u6a5f\u653b\u64ca\u5169\u540d\u6575\u4eba\u3002" },
    { id: 4, nameEn: "Moss Shell Turtle", nameZht: "\u82d4\u6bbc\u70cf\u9f9c", imageKey: "mossTurtle", tier: 3, atk: 2, hp: 4, roleEn: "Shell Wall", roleZht: "\u5805\u6bbc\u9632\u7dda", descEn: "Battle start: starts shielded. Faint: gives the ally behind Melon Shield.", descZht: "\u958b\u6230\uff1a\u81ea\u5e36\u8b77\u76fe\u3002\u5012\u4e0b\uff1a\u4f7f\u5f8c\u65b9\u968a\u53cb\u7372\u5f97\u751c\u74dc\u8b77\u76fe\u3002" },
    { id: 5, nameEn: "Rainbow Hop Rabbit", nameZht: "\u5f69\u8679\u8df3\u5154", imageKey: "rainbowRabbit", tier: 3, atk: 4, hp: 2, roleEn: "Field Medic", roleZht: "\u5feb\u901f\u6cbb\u7652", descEn: "Buy: gives one free shop reroll. Battle: heals an ally for half its attack instead of attacking.", descZht: "\u8cfc\u8cb7\uff1a\u7372\u5f97\u4e00\u6b21\u514d\u8cbb\u5237\u65b0\u3002\u6230\u9b25\uff1a\u4e0d\u653b\u64ca\uff0c\u4ee5\u653b\u64ca\u529b\u4e00\u534a\u6cbb\u7652\u968a\u53cb\u3002" },
    { id: 6, nameEn: "Gear Horn Rhino", nameZht: "\u9f52\u8f2a\u89d2\u7280\u725b", imageKey: "gearRhino", tier: 4, atk: 3, hp: 4, roleEn: "Shield Wall", roleZht: "\u8b77\u76fe\u9632\u7dda", descEn: "Sell: buffs a random shop card +2/+2. Battle: grants shield equal to half its attack instead of attacking.", descZht: "\u51fa\u552e\uff1a\u96a8\u6a5f\u5546\u5e97\u5361 +2/+2\u3002\u6230\u9b25\uff1a\u4e0d\u653b\u64ca\uff0c\u4ee5\u653b\u64ca\u529b\u4e00\u534a\u8f49\u6210\u8b77\u76fe\u3002" },
    { id: 7, nameEn: "Boom Mane Lion", nameZht: "\u7206\u9b03\u7345", imageKey: "boomLion", tier: 4, atk: 4, hp: 4, roleEn: "Roar", roleZht: "\u9f13\u821e\u5486\u54ee", descEn: "Faint: gives all allies +Lv/+Lv.", descZht: "\u5012\u4e0b\uff1a\u5168\u9ad4\u968a\u53cb\u7372\u5f97 +\u7b49\u7d1a/+\u7b49\u7d1a\u3002" },
    { id: 8, nameEn: "Spark Paw Captain", nameZht: "\u661f\u722a\u968a\u9577", imageKey: "sparkFox", tier: 5, atk: 5, hp: 5, roleEn: "Command", roleZht: "\u968a\u9577\u6307\u63ee", descEn: "Buy: gives all allies +2 HP. Battle start: gives all allies +Lv attack.", descZht: "\u8cfc\u8cb7\uff1a\u5168\u9ad4\u968a\u53cb +2 \u751f\u547d\u3002\u958b\u6230\uff1a\u5168\u9ad4\u968a\u53cb +\u7b49\u7d1a \u653b\u64ca\u3002" },
    { id: 9, nameEn: "Rhino Guardian", nameZht: "\u7280\u725b\u5b88\u885b", imageKey: "gearRhino", tier: 5, atk: 6, hp: 6, roleEn: "Last Stand", roleZht: "\u6700\u5f8c\u9632\u7dda", descEn: "Faint: deals 4 x Lv damage to the lead enemy.", descZht: "\u5012\u4e0b\uff1a\u5c0d\u6700\u524d\u65b9\u6575\u4eba\u9020\u6210 4 x \u7b49\u7d1a\u50b7\u5bb3\u3002" }
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
    stagePanel: $("stagePanel"),
    showStageBtn: $("showStageBtn"),
    stageBackBtn: $("stageBackBtn"),
    stageSetupText: $("stageSetupText"),
    bestRoundsText: $("bestRoundsText"),
    clearedRunsText: $("clearedRunsText"),
    teamLevelText: $("teamLevelText"),
    teamBonusText: $("teamBonusText"),
    diamondText: $("diamondText"),
    trainingTitleText: $("trainingTitleText"),
    trainingGoldText: $("trainingGoldText"),
    trainingRoster: $("trainingRoster"),
    buySkinBtn: $("buySkinBtn"),
    equipSkinBtn: $("equipSkinBtn"),
    startBtn: $("startBtn"),
    stageSelectTitle: $("stageSelectTitle"),
    stageProgressText: $("stageProgressText"),
    stageRail: $("stageRail"),
    gamePanel: $("gamePanel"),
    stageHudLabel: $("stageHudLabel"),
    stageText: $("stageText"),
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
    nextStageBtn: $("nextStageBtn"),
    resultMenuBtn: $("resultMenuBtn"),
    quitRunBtn: $("quitRunBtn"),
    hintText: $("hintText")
  };

  const STARTER_ANIMAL_IDS = [0, 1];
  const PREMIUM_ANIMAL_IDS = [8, 9];
  const ANIMAL_UNLOCK_COSTS = {
    2: 25,
    3: 30,
    4: 40,
    5: 45,
    6: 55,
    7: 65
  };
  const PREMIUM_UNLOCK_COSTS = {
    8: 25,
    9: 30
  };
  const STAGE_COUNT = 6;
  const WAVES_PER_STAGE = 5;
  const STAGE_ENEMY_COUNTS = [
    [1, 1, 2, 2, 2],
    [1, 2, 2, 2, 3],
    [2, 2, 2, 3, 3],
    [2, 2, 3, 3, 3],
    [2, 3, 3, 3, 4],
    [2, 3, 3, 4, 4]
  ];

  // State Management
  let locale = window.WonderI18n?.locale?.() || localStorage.getItem(localeKey) || "en";
  let save = loadSave();
  let state = makeState();
  let selectedSlot = null; // for tap-to-select mobile fallback
  let pointerDrag = null;
  let imageCache = {};
  let canvasCtx = null;
  let animationId = null;
  let stageSnapTimer = null;
  let stageRenderVersion = 0;
  let stageScrollLockUntil = 0;

  const zhRuntimeText = {
    combatSummary: "小隊生命 {playerHp}/{playerMax}｜敵方生命 {enemyHp}/{enemyMax}",
    combatFront: "前排：{player} 對 {enemy}",
    foodGuideTitle: "食物效果"
  };

  Object.assign(zhRuntimeText, {
    language: "\u8a9e\u8a00",
    chooseExpedition: "\u9078\u64c7\u9060\u5f81",
    bestExpedition: "\u6700\u4f73\u9060\u5f81",
    expeditionsCleared: "\u5df2\u901a\u904e\u95dc\u5361",
    teamLevel: "\u5718\u968a\u7b49\u7d1a",
    teamLevelValue: "\u7b49\u7d1a {level}  \u7d93\u9a57\u503c {xp}/{goal}",
    stageSetup: "\u9078\u64c7\u5df2\u89e3\u9396\u7684\u68ee\u6797\u95dc\u5361\uff0c\u518d\u914d\u7f6e\u5c0f\u968a\u51fa\u767c\u9060\u5f81\u3002",
    none: "\u7121",
    attackShort: "\u653b",
    healthShort: "\u751f",
    trainingTitle: "\u5c0f\u968a\u8a13\u7df4",
    trainingGold: "\u8a13\u7df4\u91d1\u5e63",
    owned: "\u5df2\u64c1\u6709",
    locked: "\u672a\u89e3\u9396",
    premium: "\u83c1\u82f1",
    unlockGold: "\u7528 {cost} \u91d1\u5e63\u89e3\u9396",
    unlockDiamond: "\u7528 {cost} \u947d\u77f3\u89e3\u9396",
    upgradeGold: "\u7528 {cost} \u91d1\u5e63\u5347\u7d1a",
    freeUnit: "\u521d\u59cb\u89d2\u8272",
      rosterHint: "\u5df2\u89e3\u9396\u89d2\u8272\u6703\u51fa\u73fe\u5728\u9060\u5f81\u80cc\u5305\uff0c\u6c38\u4e45\u7b49\u7d1a\u6703\u5b58\u5728\u672c\u6a5f\u3002",
      shopLabel: "\u89d2\u8272\u80cc\u5305",
      supplies: "\u9060\u5f81\u7d20\u6750",
      guideHint: "\u5f9e\u80cc\u5305\u62d6\u66f3\u6216\u9ede\u9078\u5df2\u64c1\u6709\u89d2\u8272\u5230\u968a\u4f0d\u3002\u9060\u5f81\u5347\u7d1a\u4f7f\u7528\u81e8\u6642\u7d20\u6750\uff0c\u96e2\u958b\u9060\u5f81\u5f8c\u4e0d\u6703\u4fdd\u7559\u3002",
      upgradeRun: "\u9060\u5f81\u5347\u7d1a\uff08{cost} \u7d20\u6750\uff09",
      backpackHint: "\u53ea\u986f\u793a\u5df2\u64c1\u6709\u89d2\u8272\u3002\u653e\u5165\u4e0a\u9663\u5f8c\uff0c\u53ef\u7528\u81e8\u6642\u7d20\u6750\u5347\u7d1a\u3002",
      noSupplies: "\u9060\u5f81\u7d20\u6750\u4e0d\u8db3\uff01",
      teamBonusTitle: "\u6c38\u4e45\u5718\u968a\u52a0\u6210",
      teamBonusValue: "\u6240\u6709\u5df2\u64c1\u6709\u89d2\u8272\u9032\u5165\u9060\u5f81\u6642\uff0c\u6703\u56e0\u5718\u968a\u7b49\u7d1a\u7372\u5f97 +{atk} \u653b\u64ca\u548c +{hp} \u751f\u547d\u3002",
      teamBonusNext: "\u8ddd\u96e2\u4e0b\u4e00\u500b\u5718\u968a\u7b49\u7d1a\u9084\u9700 {remaining} XP\u3002",
      stage: "\u95dc\u5361",
      round: "\u6ce2\u6b21",
      chooseStage: "\u9078\u64c7\u95dc\u5361",
      stageReady: "\u53ef\u6311\u6230",
      stageCleared: "\u5df2\u901a\u95dc",
      stageLocked: "\u5148\u901a\u904e\u524d\u4e00\u95dc",
      stageProgress: "\u5df2\u89e3\u9396 {unlocked}/{total}",
      stageWaveCount: "{count} \u6ce2",
      startStage: "\u6311\u6230\u7b2c {stage} \u95dc",
      nextStage: "\u4e0b\u4e00\u95dc",
      stageClearText: "\u7b2c {stage} \u95dc\u901a\u904e\uff01\u5df2\u89e3\u9396\u7b2c {next} \u95dc\u3002",
      allStagesClearText: "\u5168\u90e8\u68ee\u6797\u95dc\u5361\u5df2\u901a\u95dc\uff01\u53ef\u91cd\u65b0\u6311\u6230\u4efb\u4f55\u95dc\u5361\u4f86\u57f9\u990a\u5c0f\u968a\u3002",
      menuHint: "\u8a13\u7df4\u5df2\u64c1\u6709\u89d2\u8272\uff0c\u7d44\u6210\u5c0f\u968a\uff0c\u6311\u6230\u6575\u4eba\u6578\u91cf\u5e73\u7a69\u6210\u9577\u7684 5 \u6ce2\u95dc\u5361\u3002\u901a\u95dc\u5f8c\u6703\u6c38\u4e45\u89e3\u9396\u4e0b\u4e00\u95dc\u3002"
  });

  function normalizeSave(data) {
    const source = data && typeof data === "object" ? data : {};
    const animalLevels = {};
    const incomingLevels = source.animalLevels && typeof source.animalLevels === "object" ? source.animalLevels : {};
    ANIMAL_METADATA.forEach((animal) => {
      animalLevels[animal.id] = Math.max(1, Math.min(20, Math.floor(Number(incomingLevels[animal.id]) || 1)));
    });
    const unlockedAnimals = new Set(STARTER_ANIMAL_IDS);
    if (Array.isArray(source.unlockedAnimals)) {
      source.unlockedAnimals.forEach((id) => {
        const normalizedId = Number(id);
        if (ANIMAL_METADATA.some((animal) => animal.id === normalizedId)) unlockedAnimals.add(normalizedId);
      });
    }
    const unlockedStage = Math.max(1, Math.min(STAGE_COUNT, Math.floor(Number(source.unlockedStage) || 1)));
    const selectedStage = Math.max(1, Math.min(unlockedStage, Math.floor(Number(source.selectedStage) || unlockedStage)));
    return {
      bestRound: Math.max(0, Number(source.bestRound) || 0),
      clearedRuns: Math.max(0, Number(source.clearedRuns) || 0),
      unlockedSkin: Boolean(source.unlockedSkin),
      selectedSkin: source.selectedSkin || "normal",
      teamLevel: Math.max(1, Number(source.teamLevel) || 1),
      teamXp: Math.max(0, Number(source.teamXp) || 0),
      coins: Math.max(0, Math.floor(source.coins === undefined ? 18 : Number(source.coins) || 0)),
      unlockedStage,
      selectedStage,
      completedStages: Array.isArray(source.completedStages)
        ? [...new Set(source.completedStages.map(Number).filter((stage) => stage >= 1 && stage <= STAGE_COUNT))].sort((a, b) => a - b)
        : [],
      unlockedAnimals: [...unlockedAnimals].sort((a, b) => a - b),
      animalLevels
    };
  }

  function isPremiumAnimal(id) {
    return PREMIUM_ANIMAL_IDS.includes(Number(id));
  }

  function isAnimalUnlocked(id) {
    save = normalizeSave(save);
    return save.unlockedAnimals.includes(Number(id));
  }

  function animalPermanentLevel(id) {
    save = normalizeSave(save);
    return Math.max(1, Number(save.animalLevels?.[id]) || 1);
  }

  function animalUnlockCost(id) {
    return ANIMAL_UNLOCK_COSTS[id] || 0;
  }

  function premiumUnlockCost(id) {
    return PREMIUM_UNLOCK_COSTS[id] || 25;
  }

  function animalUpgradeCost(id) {
    const level = animalPermanentLevel(id);
    const animal = ANIMAL_METADATA.find((item) => item.id === Number(id));
    const tier = Math.max(1, Number(animal?.tier) || 1);
    return 12 + level * 6 + tier * 4;
  }

  function saveAnimalLevel(id, level) {
    save = normalizeSave(save);
    save.animalLevels[id] = Math.max(save.animalLevels[id] || 1, Math.min(20, Math.floor(Number(level) || 1)));
    saveSave();
  }

  function teamXpGoal(level = save.teamLevel) {
    return 18 + Math.max(1, Number(level) || 1) * 7;
  }

  function teamBonus() {
    const level = Math.max(1, Number(save.teamLevel) || 1);
    return {
      atk: Math.floor((level - 1) / 3),
      hp: Math.floor((level - 1) / 2)
    };
  }

  function addTeamXp(amount) {
    save = normalizeSave(save);
    save.teamXp += Math.max(0, Number(amount) || 0);
    while (save.teamXp >= teamXpGoal(save.teamLevel)) {
      save.teamXp -= teamXpGoal(save.teamLevel);
      save.teamLevel += 1;
    }
    saveSave();
  }

  function addTrainingCoins(amount) {
    save = normalizeSave(save);
    save.coins += Math.max(0, Math.floor(Number(amount) || 0));
    saveSave();
  }

  function formatTeamLevel() {
    const normalized = normalizeSave(save);
    const value = t("teamLevelValue")
      .replace("{level}", normalized.teamLevel)
      .replace("{xp}", normalized.teamXp)
      .replace("{goal}", teamXpGoal(normalized.teamLevel));
    return value;
  }

  function formatTeamBonusNote() {
    const normalized = normalizeSave(save);
    const bonus = teamBonus();
    const remaining = Math.max(0, teamXpGoal(normalized.teamLevel) - normalized.teamXp);
    const title = t("teamBonusTitle");
    const value = t("teamBonusValue", { atk: bonus.atk, hp: bonus.hp });
    const next = t("teamBonusNext", { remaining });
    return `<strong>${title}</strong><span>${value} ${next}</span>`;
  }

  function installTestApi() {
    window.__ANIMAL_AUTO_SQUAD_TEST__ = {
      readSave: () => normalizeSave(save),
      teamBonus: () => teamBonus(),
      stagePreview: () => ({
        unlockedStage: normalizeSave(save).unlockedStage,
        selectedStage: normalizeSave(save).selectedStage,
        completedStages: normalizeSave(save).completedStages,
        enemyCounts: STAGE_ENEMY_COUNTS.map((waves) => [...waves]),
        firstWave: summarizeEnemyWave(1, 1),
        firstBossWave: summarizeEnemyWave(1, WAVES_PER_STAGE)
      }),
      trainingPreview: () => ({
        unlockedAnimals: normalizeSave(save).unlockedAnimals,
        foxLevel: animalPermanentLevel(0),
        premiumCosts: PREMIUM_ANIMAL_IDS.map((id) => ({ id, cost: premiumUnlockCost(id) })),
        normalUnlockCosts: Object.entries(ANIMAL_UNLOCK_COSTS).map(([id, cost]) => ({ id: Number(id), cost }))
      }),
      runPreview: () => {
        const previewState = makeState();
        previewState.backpack = createBackpackCards();
        return {
          supplies: previewState.gold,
          backpackIds: previewState.backpack.map((card) => card.id),
          firstUpgradeCost: runUpgradeCost(previewState.backpack[0]),
          firstAbility: previewState.backpack[0]
            ? [previewState.backpack[0].roleEn, previewState.backpack[0].descEn].filter(Boolean).join(": ")
            : ""
        };
      },
      combinePreview: () => {
        const base = createAnimalCard(0);
        const copy = createAnimalCard(0);
        combineCards(base, copy);
        combineCards(base, createAnimalCard(0));
        return { level: base.level, exp: base.exp, atk: base.currentAtk, hp: base.currentHp };
      },
      abilityPreview: () => {
        const toCombat = (card) => ({
          ...card,
          hp: card.currentHp,
          maxHp: card.maxHp,
          atk: card.currentAtk,
          shield: Boolean(card.hasShield),
          shieldHp: 0
        });
        const enemy = (id, hp = 10) => ({
          id,
          nameEn: `Test Enemy ${id}`,
          nameZht: `測試敵人 ${id}`,
          atk: 2,
          hp,
          maxHp: hp,
          shield: false,
          shieldHp: 0,
          level: 1
        });
        state.combat = {
          ...state.combat,
          playerSquad: [toCombat(createAnimalCard(0)), toCombat(createAnimalCard(3)), toCombat(createAnimalCard(6)), toCombat(createAnimalCard(5))],
          enemySquad: [enemy(0, 12), enemy(1, 8), enemy(2, 8), enemy(3, 8)],
          step: 0,
          effects: [],
          status: "",
          animating: true
        };
        resolveOrderedCombatStep(state.combat.playerSquad, state.combat.enemySquad);
        resolveOrderedCombatStep(state.combat.playerSquad, state.combat.enemySquad);
        resolveOrderedCombatStep(state.combat.playerSquad, state.combat.enemySquad);
        resolveOrderedCombatStep(state.combat.playerSquad, state.combat.enemySquad);
        const orderedPreview = {
          firstEnemyHp: state.combat.enemySquad[0]?.hp,
          randomEnemyDamageCount: state.combat.enemySquad.filter((unit, index) => index > 0 && unit.hp < unit.maxHp).length,
          rhinoShield: state.combat.playerSquad[2]?.shieldHp || 0,
          rabbitHp: state.combat.playerSquad[3]?.hp || 0,
          rabbitMax: state.combat.playerSquad[3]?.maxHp || 0,
          status: state.combat.status,
          effects: state.combat.effects.map((fx) => ({ type: fx.type, text: fx.text || "" }))
        };
        const enemyBackline = enemy(4, 8);
        state.combat.playerSquad = [toCombat(createAnimalCard(0)), toCombat(createAnimalCard(1))];
        state.combat.enemySquad = [enemy(0, 12), enemyBackline];
        resolveEnemySlotAction(enemyBackline, 1);
        return {
          ...orderedPreview,
          playerFrontHpAfterBackline: state.combat.playerSquad[0]?.hp,
          playerBackHpAfterBackline: state.combat.playerSquad[1]?.hp,
          activeActor: state.combat.activeActor,
          activeActors: state.combat.activeActors
        };
      },
      returnToMenu(stage = normalizeSave(save).selectedStage) {
        save = normalizeSave({ ...save, selectedStage: stage });
        saveSave();
        state.activeRun = false;
        renderMenu();
        return { selectedStage: normalizeSave(save).selectedStage, startText: nodes.startBtn.textContent.trim() };
      }
    };
  }

  function loadSave() {
    try {
      const data = localStorage.getItem(saveKey);
      return normalizeSave(data ? JSON.parse(data) : null);
    } catch (e) {
      return normalizeSave(null);
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
      stage: Math.max(1, Math.min(STAGE_COUNT, Number(save?.selectedStage) || 1)),
      round: 1,
      gold: 12,
      hearts: 4,
      relic: null,
      freeRerollThisRound: false,
      rerollsUsedThisRound: 0,
      squad: [null, null, null, null, null],
      bench: [null, null, null, null, null],
      backpack: [],
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
        activeActor: null,
        activeActors: [],
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
    renderTrainingRoster();
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
    installTestApi();
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
    clearTimeout(stageSnapTimer);
    selectedSlot = null;
    pointerDrag = null;
    state.activeRun = false;
    document.body.classList.remove("squad-active");
    document.body.classList.remove("squad-stage-select");
    save = loadSave();
    nodes.menuPanel.classList.remove("is-hidden");
    nodes.stagePanel.classList.add("is-hidden");
    nodes.gamePanel.classList.add("is-hidden");
    nodes.resultPanel.classList.add("is-hidden");
    nodes.combatSummary?.classList.add("is-hidden");
    nodes.bestRoundsText.textContent = t("stageProgress", { unlocked: save.unlockedStage, total: STAGE_COUNT });
    nodes.clearedRunsText.textContent = String(save.completedStages.length);
    if (nodes.teamLevelText) {
      nodes.teamLevelText.textContent = formatTeamLevel();
    }
    if (nodes.teamBonusText) {
      nodes.teamBonusText.innerHTML = formatTeamBonusNote();
    }
    updateWalletUI();
    renderStageSelector();
    renderTrainingRoster();
    updatePageMeta();
  }

  function showStageSelection() {
    clearTimeout(stageSnapTimer);
    window.WeightPlayGame?.exitMobileGameMode?.();
    document.body.classList.remove("squad-active");
    document.body.classList.add("squad-stage-select");
    nodes.menuPanel.classList.add("is-hidden");
    nodes.stagePanel.classList.remove("is-hidden");
    nodes.gamePanel.classList.add("is-hidden");
    nodes.resultPanel.classList.add("is-hidden");
    save = loadSave();
    renderStageSelector();
  }

  function stageLabel(stage) {
    return locale === "zh-Hant" ? `\u7b2c ${stage} \u95dc` : `Stage ${stage}`;
  }

  function selectStage(stage, shouldScroll = true) {
    clearTimeout(stageSnapTimer);
    save = normalizeSave(save);
    save.selectedStage = Math.max(1, Math.min(save.unlockedStage, Number(stage) || 1));
    saveSave();
    renderStageSelector(shouldScroll);
  }

  function renderStageSelector(shouldScroll = true) {
    if (!nodes.stageRail) return;
    clearTimeout(stageSnapTimer);
    const renderVersion = ++stageRenderVersion;
    save = normalizeSave(save);
    nodes.stageSelectTitle.textContent = t("chooseStage");
    nodes.stageProgressText.textContent = t("stageProgress", { unlocked: save.unlockedStage, total: STAGE_COUNT });
    nodes.stageSetupText.textContent = t("stageSetup");
    nodes.stageRail.innerHTML = "";

    for (let stage = 1; stage <= STAGE_COUNT; stage++) {
      const locked = stage > save.unlockedStage;
      const cleared = save.completedStages.includes(stage);
      const card = document.createElement("button");
      card.type = "button";
      card.className = `stage-card${stage === save.selectedStage ? " is-selected" : ""}${cleared ? " is-cleared" : ""}`;
      card.dataset.stage = String(stage);
      card.disabled = locked;
      card.innerHTML = `<strong>${stageLabel(stage)}</strong><span>${t("stageWaveCount", { count: WAVES_PER_STAGE })}</span><small>${locked ? t("stageLocked") : cleared ? t("stageCleared") : t("stageReady")}</small>`;
      card.addEventListener("click", () => selectStage(stage));
      nodes.stageRail.appendChild(card);
    }

    nodes.startBtn.textContent = t("startStage", { stage: save.selectedStage });
    if (shouldScroll) {
      stageScrollLockUntil = performance.now() + 500;
      requestAnimationFrame(() => {
        if (renderVersion !== stageRenderVersion) return;
        nodes.stageRail.querySelector(".stage-card.is-selected")?.scrollIntoView({ block: "nearest", inline: "center" });
      });
    }
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

  function renderTrainingRoster() {
    if (!nodes.trainingRoster || !nodes.trainingGoldText) return;
    save = normalizeSave(save);
    nodes.trainingGoldText.textContent = `${save.coins} ${t("gold")}`;
    nodes.trainingRoster.innerHTML = "";

    const hint = document.createElement("p");
    hint.className = "training-hint";
    hint.textContent = t("rosterHint");
    nodes.trainingRoster.appendChild(hint);

    ANIMAL_METADATA.forEach((animal) => {
      const unlocked = isAnimalUnlocked(animal.id);
      const level = animalPermanentLevel(animal.id);
      const premium = isPremiumAnimal(animal.id);
      const card = document.createElement("article");
      card.className = `training-card${unlocked ? " is-owned" : " is-locked"}${premium ? " is-premium" : ""}`;
      const name = locale === "zh-Hant" ? (animal.nameZht || animal.nameEn) : animal.nameEn;
      const status = STARTER_ANIMAL_IDS.includes(animal.id)
        ? t("freeUnit")
        : premium
          ? t("premium")
          : unlocked
            ? t("owned")
            : t("locked");
      const statBoost = Math.max(0, level - 1) * (premium ? 2 : 1);
      card.innerHTML = `
        <div class="training-art" style="background-image:url('${assetsToLoad[animal.imageKey] || assetsToLoad.boomLion}')"></div>
        <div class="training-copy">
          <strong>${name}</strong>
          <span>${status} · ${t("level")}${level}</span>
          <small>${locale === "zh-Hant" ? "攻" : "ATK"} ${animal.atk + statBoost} / ${locale === "zh-Hant" ? "生" : "HP"} ${animal.hp + statBoost}</small>
        </div>
      `;

      const action = document.createElement("button");
      action.type = "button";
      action.className = unlocked ? "training-action upgrade-action" : "training-action unlock-action";
      if (unlocked) {
        const cost = animalUpgradeCost(animal.id);
        action.textContent = t("upgradeGold", { cost });
        action.disabled = save.coins < cost || level >= 20;
        action.addEventListener("click", () => handleUpgradeAnimal(animal.id));
      } else if (premium) {
        const cost = premiumUnlockCost(animal.id);
        action.textContent = t("unlockDiamond", { cost });
        action.disabled = getWalletDiamonds() < cost;
        action.addEventListener("click", () => handleUnlockAnimal(animal.id));
      } else {
        const cost = animalUnlockCost(animal.id);
        action.textContent = t("unlockGold", { cost });
        action.disabled = save.coins < cost;
        action.addEventListener("click", () => handleUnlockAnimal(animal.id));
      }
      card.appendChild(action);
      nodes.trainingRoster.appendChild(card);
    });
  }

  function handleUnlockAnimal(id) {
    initAudio();
    save = normalizeSave(save);
    if (isAnimalUnlocked(id)) return;
    if (isPremiumAnimal(id)) {
      const cost = premiumUnlockCost(id);
      if (!spendWalletDiamonds(cost)) {
        alert(t("noDiamonds"));
        playSynth("click");
        return;
      }
    } else {
      const cost = animalUnlockCost(id);
      if (save.coins < cost) {
        alert(t("noGold"));
        playSynth("click");
        return;
      }
      save.coins -= cost;
    }
    save.unlockedAnimals = [...new Set([...save.unlockedAnimals, Number(id)])].sort((a, b) => a - b);
    saveSave();
    playSynth("buy");
    renderTrainingRoster();
  }

  function handleUpgradeAnimal(id) {
    initAudio();
    save = normalizeSave(save);
    if (!isAnimalUnlocked(id)) return;
    const currentLevel = animalPermanentLevel(id);
    if (currentLevel >= 20) return;
    const cost = animalUpgradeCost(id);
    if (save.coins < cost) {
      alert(t("noGold"));
      playSynth("click");
      return;
    }
    save.coins -= cost;
    save.animalLevels[id] = currentLevel + 1;
    saveSave();
    playSynth("combine");
    renderTrainingRoster();
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
    const languageLabel = document.querySelector(".locale > span");
    if (languageLabel) languageLabel.textContent = t("language");
    nodes.localeSelect.setAttribute("aria-label", locale === "zh-Hant" ? "選擇語言" : "Language selection");
    nodes.quitRunBtn.textContent = "\u2190";
    nodes.quitRunBtn.setAttribute("aria-label", t("quitRun"));
    
    // Menu elements
    $("menuHeadingText").textContent = t("menuTitle");
    $("menuSubText").textContent = t("menuHint");
    nodes.showStageBtn.textContent = t("chooseExpedition");
    nodes.startBtn.textContent = t("startStage", { stage: normalizeSave(save).selectedStage });
    $("bestRoundsText").previousElementSibling.textContent = t("bestExpedition");
    $("clearedRunsText").previousElementSibling.textContent = t("expeditionsCleared");
    if (nodes.teamLevelText?.previousElementSibling) {
      nodes.teamLevelText.previousElementSibling.textContent = locale === "zh-Hant" ? "\u5718\u968a\u7b49\u7d1a" : t("teamLevel");
    }
    if (nodes.teamLevelText) nodes.teamLevelText.textContent = formatTeamLevel();
    $("diamondText").previousElementSibling.textContent = t("diamonds");
    document.querySelector(".cosmetic-store .store-label").textContent = t("buySkin");
    if (nodes.trainingTitleText) nodes.trainingTitleText.textContent = t("trainingTitle");

    // HUD labels
    nodes.stageHudLabel.textContent = t("stage");
    nodes.roundText.previousElementSibling.textContent = t("round");
    nodes.goldText.previousElementSibling.textContent = t("supplies");
    nodes.heartText.previousElementSibling.textContent = t("hearts");
    nodes.relicText.previousElementSibling.textContent = t("activeRelic");
    if (!state.relic) nodes.relicText.textContent = t("none");

    // Prep labels
    document.querySelector(".squad-section h3").textContent = t("yourSquadLabel");
    const benchHeading = document.querySelector(".bench-section h3");
    if (benchHeading) benchHeading.textContent = t("benchLabel");
    document.querySelector(".shop-section h3").textContent = t("shopLabel");
    nodes.startBattleBtn.textContent = t("startBattle");
    nodes.hintText.textContent = t("guideHint");
    renderFoodGuide();

    nodes.rerollShopBtn.classList.add("is-hidden");

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
    nodes.nextStageBtn.textContent = t("nextStage");
    nodes.resultMenuBtn.textContent = t("backToMenu");

    renderCosmeticSection();
    if (!nodes.stagePanel.classList.contains("is-hidden")) renderStageSelector(false);
    renderTrainingRoster();
  }

  // Start Expedition Run
  function startExpedition() {
    initAudio();
    playSynth("click");
    state = makeState();
    state.stage = normalizeSave(save).selectedStage;
    state.backpack = createBackpackCards();
    state.activeRun = true;
    document.body.classList.add("squad-active");
    document.body.classList.remove("squad-stage-select");
    nodes.menuPanel.classList.add("is-hidden");
    nodes.stagePanel.classList.add("is-hidden");
    nodes.gamePanel.classList.remove("is-hidden");
    nodes.prepPhaseArea.classList.remove("is-hidden");
    nodes.combatArea.classList.add("is-hidden");

    // Initial Relic draft
    openRelicDraft();
    window.WonderAnalytics?.track("expedition_start", { game_id: GAME_ID, stage: state.stage });
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
    selectedSlot = null;
    state.freeRerollThisRound = state.relic?.id === 3; // Clover leaf gives free first reroll
    state.rerollsUsedThisRound = 0;
    translateUI();
    updateHUD();
    renderPrepScreen();
  }

  function updateHUD() {
    nodes.stageText.textContent = `${state.stage}/${STAGE_COUNT}`;
    nodes.roundText.textContent = `${state.round}/${WAVES_PER_STAGE}`;
    nodes.goldText.textContent = String(state.gold);
    nodes.heartText.textContent = `${state.hearts}/4`;
  }

  function createAnimalCard(id) {
    const source = ANIMAL_METADATA.find((animal) => animal.id === id) || ANIMAL_METADATA[0];
    const permanentLevel = animalPermanentLevel(source.id);
    const statBoost = Math.max(0, permanentLevel - 1) * (isPremiumAnimal(source.id) ? 2 : 1);
    return {
      ...source,
      exp: permanentLevel,
      level: permanentLevel,
      permanentLevel,
      currentAtk: source.atk + statBoost,
      currentHp: source.hp + statBoost,
      maxHp: source.hp + statBoost,
      hasShield: false
    };
  }

  function createBackpackCards() {
    save = normalizeSave(save);
    return save.unlockedAnimals
      .map((id) => createAnimalCard(Number(id)))
      .filter(Boolean);
  }

  // Legacy shop generator kept for old saves/tests that still call it directly.
  function generateShop() {
    // Reroll normal items if not frozen
    const tierLimit = Math.min(5, Math.ceil(state.round / 2)); // Tiers 1-5 unlocked as rounds progress
    let animalPool = ANIMAL_METADATA.filter((a) => a.tier <= tierLimit && isAnimalUnlocked(a.id));
    if (!animalPool.length) {
      animalPool = ANIMAL_METADATA.filter((a) => STARTER_ANIMAL_IDS.includes(a.id));
    }

    for (let i = 0; i < 3; i++) {
      if (!state.shop.frozenAnimals[i]) {
        const rand = animalPool[Math.floor(Math.random() * animalPool.length)];
        state.shop.animals[i] = createAnimalCard(rand.id);
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
    nodes.foodGuide.innerHTML = `<strong>${t("shopLabel")}</strong><span>${t("backpackHint")}</span>`;
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
      el.addEventListener("pointerup", pointerCardUp);
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

    if (isAnimal) {
      const abilityEl = document.createElement("div");
      abilityEl.className = "card-ability";
      const role = locale === "zh-Hant" ? (card.roleZht || card.roleEn || "") : (card.roleEn || "");
      const desc = locale === "zh-Hant" ? (card.descZht || card.descEn || "") : (card.descEn || "");
      abilityEl.textContent = [role, desc].filter(Boolean).join(": ");
      el.appendChild(abilityEl);
    }

    if (!isAnimal) {
      const effectEl = document.createElement("div");
      effectEl.className = "card-effect";
      effectEl.textContent = getItemEffectText(card);
      el.appendChild(effectEl);
      el.title = `${locale === "zh-Hant" ? (card.nameZht || card.nameEn) : card.nameEn}: ${effectEl.textContent}`;
    }

    // Level tag
    if (isAnimal) {
      const levelEl = document.createElement("div");
      levelEl.className = "card-level-tag";
      levelEl.textContent = `${t("level")}${card.level || 1}`;
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
      const attackLabel = locale === "zh-Hant" ? t("attackShort") : "ATK";
      const healthLabel = locale === "zh-Hant" ? t("healthShort") : "HP";
      statsEl.innerHTML = `<span class="card-atk">${attackLabel} ${card.currentAtk}</span><span class="card-hp">${healthLabel} ${card.currentHp}</span>`;
      el.appendChild(statsEl);
      el.title = `${locale === "zh-Hant" ? (card.nameZht || card.nameEn) : card.nameEn}: ${attackLabel} ${card.currentAtk}, ${healthLabel} ${card.currentHp}. ${locale === "zh-Hant" ? (card.descZht || card.descEn || "") : (card.descEn || "")}`;
      if (sourceArea === "shop-animal") {
        const costEl = document.createElement("div");
        costEl.className = "card-cost animal-cost";
        costEl.textContent = "3";
        el.appendChild(costEl);
      }
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
    el.addEventListener("pointerdown", pointerCardDown);
    el.addEventListener("pointermove", pointerCardMove);
    el.addEventListener("pointerup", pointerCardUp);
    el.addEventListener("pointercancel", pointerCardCancel);

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

  function pointerCardDown(e) {
    if (!state.activeRun || e.pointerType === "mouse") return;
    const area = e.currentTarget.dataset.area;
    const index = Number(e.currentTarget.dataset.slot);
    const card = getCardAt(area, index);
    if (!card) return;
    pointerDrag = {
      area,
      index,
      startX: e.clientX,
      startY: e.clientY,
      active: false,
      ghost: null
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }

  function pointerCardMove(e) {
    if (!pointerDrag) return;
    const dx = e.clientX - pointerDrag.startX;
    const dy = e.clientY - pointerDrag.startY;
    if (!pointerDrag.active && Math.hypot(dx, dy) < 10) return;
    if (!pointerDrag.active) {
      pointerDrag.active = true;
      pointerDrag.ghost = e.currentTarget.cloneNode(true);
      pointerDrag.ghost.classList.add("touch-drag-ghost");
      document.body.appendChild(pointerDrag.ghost);
      e.currentTarget.classList.add("dragging");
      selectedSlot = { area: pointerDrag.area, index: pointerDrag.index };
    }
    e.preventDefault();
    pointerDrag.ghost.style.left = `${e.clientX}px`;
    pointerDrag.ghost.style.top = `${e.clientY}px`;
    document.querySelectorAll(".card-item.drag-over").forEach((node) => node.classList.remove("drag-over"));
    const target = document.elementFromPoint(e.clientX, e.clientY)?.closest?.(".card-item");
    if (target && target.dataset.area) target.classList.add("drag-over");
  }

  function pointerCardUp(e) {
    if (!pointerDrag) return;
    const drag = pointerDrag;
    pointerDrag = null;
    document.querySelectorAll(".card-item.drag-over, .card-item.dragging").forEach((node) => {
      node.classList.remove("drag-over", "dragging");
    });
    drag.ghost?.remove();

    if (!drag.active) return;
    e.preventDefault();
    const target = document.elementFromPoint(e.clientX, e.clientY)?.closest?.(".card-item");
    selectedSlot = null;
    if (!target || !target.dataset.area) {
      renderPrepScreen();
      return;
    }
    executeAction(drag.area, drag.index, target.dataset.area, Number(target.dataset.slot));
  }

  function pointerCardCancel() {
    if (!pointerDrag) return;
    pointerDrag.ghost?.remove();
    pointerDrag = null;
    document.querySelectorAll(".card-item.drag-over, .card-item.dragging").forEach((node) => {
      node.classList.remove("drag-over", "dragging");
    });
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
    if (area === "backpack") return state.backpack[index];
    if (area === "shop-animal") return state.shop.animals[index];
    if (area === "shop-item") return state.shop.items[index];
    return null;
  }

  function setCardAt(area, index, card) {
    if (area === "squad") state.squad[index] = card;
    if (area === "bench") state.bench[index] = card;
    if (area === "backpack") state.backpack[index] = card;
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
    const placementAreas = ["squad", "bench", "backpack"];

    if (placementAreas.includes(srcArea) && placementAreas.includes(destArea)) {
      if (srcArea === destArea && srcIndex === destIndex) return;
      const targetCard = getCardAt(destArea, destIndex);
      setCardAt(srcArea, srcIndex, targetCard || null);
      setCardAt(destArea, destIndex, card);
      playSynth("click");
      updateHUD();
      renderPrepScreen();
      return;
    }

    // 1. Legacy buy animal from shop
    if (srcArea === "shop-animal" && (destArea === "squad" || destArea === "bench")) {
      if (state.gold < 3) {
        alert(t("noSupplies"));
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
        alert(t("noSupplies"));
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

  // Each duplicate directly advances the animal level so merges always feel readable.
  function combineCards(mainCard, secondaryCard) {
    const previousLevel = Math.max(1, Number(mainCard.level) || 1);
    const expGain = Math.max(1, Number(secondaryCard.exp) || 1);
    mainCard.exp = Math.max(1, Number(mainCard.exp) || 1) + expGain;
    mainCard.level = Math.min(9, Math.max(previousLevel + 1, mainCard.exp));

    const levelGain = Math.max(1, mainCard.level - previousLevel);
    mainCard.currentAtk = Math.round(mainCard.currentAtk + levelGain);
    mainCard.currentHp = Math.round(mainCard.currentHp + levelGain);
    mainCard.maxHp = Math.round(mainCard.maxHp + levelGain);
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

  function runUpgradeCost(card) {
    return 4 + Math.max(1, Number(card?.level) || 1) * 2;
  }

  function handleRunUpgradeSelected() {
    if (!selectedSlot) return;
    const card = getCardAt(selectedSlot.area, selectedSlot.index);
    if (!card || card.atk === undefined) return;
    const cost = runUpgradeCost(card);
    if (state.gold < cost) {
      alert(t("noSupplies"));
      return;
    }
    state.gold -= cost;
    card.level = Math.min(20, Math.max(1, Number(card.level) || 1) + 1);
    card.exp = Math.max(Number(card.exp) || 1, card.level);
    card.currentAtk += 1;
    card.currentHp += 2;
    card.maxHp += 2;
    selectedSlot = null;
    playSynth("combine");
    updateHUD();
    renderPrepScreen();
  }

  // Reroll Shop items
  function rerollShop() {
    initAudio();
    const rerollCost = state.freeRerollThisRound ? 0 : 1;
    if (state.gold < rerollCost) {
      alert(t("noSupplies"));
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
    if (!nodes.benchGrid) return;
    nodes.benchGrid.innerHTML = "";
    state.bench.forEach((card, idx) => {
      const el = makeCardElement(card, "bench", idx);
      nodes.benchGrid.appendChild(el);
    });
  }

  function renderShop() {
    nodes.shopRow.innerHTML = "";

    const visibleSlots = Math.max(5, state.backpack.length);
    for (let idx = 0; idx < visibleSlots; idx++) {
      const cell = document.createElement("div");
      cell.className = "shop-cell";
      cell.style.position = "relative";
      cell.appendChild(makeCardElement(state.backpack[idx] || null, "backpack", idx));
      nodes.shopRow.appendChild(cell);
    }

    const selectedCard = selectedSlot ? getCardAt(selectedSlot.area, selectedSlot.index) : null;
    if (selectedCard && selectedCard.atk !== undefined) {
      nodes.sellCardBtn.classList.remove("is-hidden");
      nodes.sellCardBtn.textContent = t("upgradeRun", { cost: runUpgradeCost(selectedCard) });
    } else {
      nodes.sellCardBtn.classList.add("is-hidden");
    }
  }

  function unitLevel(unit) {
    return Math.max(1, Number(unit?.level) || 1);
  }

  function addCombatEffect(type, x, y, text = "", textColor = "white") {
    const maxLife = type === "starfall" ? 28 : type === "buff" ? 24 : 18;
    state.combat.effects.push({ type, x, y, life: maxLife, maxLife, text, textColor });
  }

  function markActing(team, index, style = "attack") {
    const actor = { team, index, style, life: 26, maxLife: 26 };
    state.combat.activeActor = actor;
    state.combat.activeActors = (state.combat.activeActors || []).filter((item) => !(item.team === team && item.index === index));
    state.combat.activeActors.push(actor);
  }

  function removeDefeatedUnits(squad, team) {
    for (let i = squad.length - 1; i >= 0; i--) {
      if (squad[i].hp <= 0) {
        const fallen = squad.splice(i, 1)[0];
        triggerFaintAbility(fallen, team);
      }
    }
  }

  function combatPoint(team, index = 0) {
    const isPlayer = team === "player";
    const mobileCombat = window.matchMedia?.("(max-width: 640px)")?.matches;
    const xBase = isPlayer ? (mobileCombat ? 390 : 400) : (mobileCombat ? 570 : 560);
    const spacing = mobileCombat ? 84 : 100;
    return {
      x: xBase + (isPlayer ? -1 : 1) * index * spacing,
      y: mobileCombat ? 286 : 258
    };
  }

  function combatUnitName(unit) {
    return unit ? (locale === "zh-Hant" ? (unit.nameZht || unit.nameEn) : unit.nameEn) : "-";
  }

  function healWeakestAlly(squad, amount, team = "player") {
    const target = squad.filter((unit) => unit.hp > 0).sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp))[0];
    if (!target) return;
    target.hp = Math.min(target.maxHp, target.hp + amount);
    const idx = Math.max(0, squad.indexOf(target));
    const point = combatPoint(team, idx);
    addCombatEffect("heal", point.x, point.y, `+${amount}`, "#82ffd1");
  }

  function addUnitShield(unit, amount, team = "player", index = 0) {
    if (!unit || amount <= 0) return;
    unit.shieldHp = Math.max(0, Math.round(unit.shieldHp || 0)) + Math.max(1, Math.round(amount));
    unit.shield = unit.shieldHp > 0;
    const point = combatPoint(team, index);
    addCombatEffect("shield", point.x, point.y, `+${Math.max(1, Math.round(amount))}`, "#8fb7ff");
  }

  function damageTarget(unit, amount, x, y) {
    if (!unit || amount <= 0) return;
    let damage = Math.max(0, Math.round(amount));
    const shieldHp = Math.max(0, Math.round(unit.shieldHp || 0));
    if (shieldHp > 0) {
      const absorbed = Math.min(shieldHp, damage);
      unit.shieldHp = shieldHp - absorbed;
      unit.shield = unit.shieldHp > 0;
      damage -= absorbed;
      addCombatEffect("shield", x, y, `-${absorbed}`, "#8fb7ff");
    } else if (unit.shield) {
      unit.shield = false;
      damage = 0;
      addCombatEffect("shield", x, y, "Block", "#8fb7ff");
    }
    if (damage > 0) {
      unit.hp -= damage;
      addCombatEffect("hit", x, y, `-${damage}`, "yellow");
    }
  }

  function triggerBattleStartAbilities() {
    state.combat.playerSquad.forEach((unit) => {
      const level = unitLevel(unit);
      if (unit.id === 2) {
        state.combat.playerSquad.forEach((ally) => {
          ally.hp += level;
          ally.maxHp += level;
        });
        addCombatEffect("buff", 320, 245, `+${level} HP`, "#82ffd1");
      } else if (unit.id === 4) {
        addUnitShield(unit, Math.max(1, level), "player", state.combat.playerSquad.indexOf(unit));
      } else if (unit.id === 8) {
        state.combat.playerSquad.forEach((ally) => {
          ally.atk += level;
        });
        addCombatEffect("buff", 320, 245, `+${level} ATK`, "#ffd666");
      }
    });
  }

  function triggerBeforeClashAbilities() {
    const playerSquad = state.combat.playerSquad;
    const enemySquad = state.combat.enemySquad;
    playerSquad.forEach((unit) => {
      if (!enemySquad.length || unit.hp <= 0) return;
      const level = unitLevel(unit);
      if (unit.id === 0) {
        damageTarget(enemySquad[0], level, 560, 250);
      } else if (unit.id === 1) {
        healWeakestAlly(playerSquad, level);
      }
    });
    removeDefeatedUnits(enemySquad, "enemy");
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
    const bonus = teamBonus();
    state.combat.playerSquad = activeSquad.map((c) => ({
      ...c,
      hp: c.currentHp + bonus.hp,
      maxHp: c.maxHp + bonus.hp,
      atk: c.currentAtk + bonus.atk,
      shield: c.hasShield,
      shieldHp: c.hasShield ? Math.max(1, Math.ceil(c.currentHp * 0.35)) : 0
    }));

    // Trigger Maple Shield relic (first unit gets shield)
    if (state.relic?.id === 0 && state.combat.playerSquad.length) {
      addUnitShield(state.combat.playerSquad[0], 2, "player", 0);
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
    triggerBattleStartAbilities();

    // Generate a stage-specific wave instead of adding another enemy every round.
    state.combat.enemySquad = generateEnemySquad(state.stage, state.round);

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
    state.combat.activeActor = null;
    state.combat.activeActors = [];
    state.combat.effects = [];
    
    canvasCtx = nodes.gameCanvas.getContext("2d");
    combatLog(t("combatIntro"));
    updateCombatSummary();
    
    // Start animation loop
    runCombatAnimation();
    window.WonderAnalytics?.track("battle_start", { game_id: GAME_ID, stage: state.stage, wave: state.round });
  }

  function enemyWaveStats(stage, wave) {
    const safeStage = Math.max(1, Math.min(STAGE_COUNT, Number(stage) || 1));
    const safeWave = Math.max(1, Math.min(WAVES_PER_STAGE, Number(wave) || 1));
    const scale = 1 + (safeStage - 1) * 0.18 + (safeWave - 1) * 0.08;
    return {
      stage: safeStage,
      wave: safeWave,
      count: STAGE_ENEMY_COUNTS[safeStage - 1][safeWave - 1],
      atk: Math.max(1, Math.floor(1.25 * scale)),
      hp: Math.max(2, Math.round(2 * scale)),
      tierLimit: Math.min(ENEMY_METADATA.length, 1 + Math.floor((safeStage + safeWave - 2) / 2)),
      level: Math.max(1, Math.ceil((safeStage + safeWave - 1) / 3))
    };
  }

  function summarizeEnemyWave(stage, wave) {
    const stats = enemyWaveStats(stage, wave);
    return { count: stats.count, atk: stats.atk, hp: stats.hp, level: stats.level };
  }

  function generateEnemySquad(stage, wave) {
    const stats = enemyWaveStats(stage, wave);
    const squad = [];
    for (let i = 0; i < stats.count; i++) {
      // Pick random enemy matching difficulty tier
      const rand = ENEMY_METADATA[Math.floor(Math.random() * stats.tierLimit)];
      squad.push({
        id: rand.id,
        nameEn: rand.nameEn,
        nameZht: rand.nameZht,
        sx: rand.sx,
        sy: rand.sy,
        atk: stats.atk,
        hp: stats.hp,
        maxHp: stats.hp,
        shield: false,
        shieldHp: 0,
        level: stats.level
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

  function drawContainImage(image, x, y, w, h) {
    if (!image || !image.naturalWidth || !image.naturalHeight) return;
    const sourceRatio = image.naturalWidth / image.naturalHeight;
    const targetRatio = w / h;
    let drawW = w;
    let drawH = h;
    if (sourceRatio > targetRatio) {
      drawH = w / sourceRatio;
    } else {
      drawW = h * sourceRatio;
    }
    canvasCtx.drawImage(image, x + (w - drawW) / 2, y + (h - drawH) / 2, drawW, drawH);
  }

  function drawStatPill(textValue, x, y, color) {
    canvasCtx.save();
    canvasCtx.fillStyle = "rgba(6, 12, 18, 0.78)";
    canvasCtx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    canvasCtx.lineWidth = 1;
    canvasCtx.beginPath();
    canvasCtx.roundRect(x, y, 36, 16, 8);
    canvasCtx.fill();
    canvasCtx.stroke();
    canvasCtx.font = "bold 10px Outfit, system-ui";
    canvasCtx.textAlign = "center";
    canvasCtx.textBaseline = "middle";
    canvasCtx.fillStyle = color;
    canvasCtx.fillText(textValue, x + 18, y + 8);
    canvasCtx.restore();
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
      const actor = (state.combat.activeActors || []).find((item) => item.team === team && item.index === idx && item.life > 0);
      const isActing = actor?.team === team && actor.index === idx && actor.life > 0;
      const actorProgress = isActing ? 1 - actor.life / Math.max(1, actor.maxLife || 26) : 0;
      const bounce = isActing ? Math.sin(actorProgress * Math.PI) : 0;
      const actorOffset = bounce * (isActing && actor.style === "cast" ? 18 : 12);
      const scale = isActing ? 1 + bounce * 0.08 : 1;
      const centerY = (mobileCombat ? 286 : 258) - actorOffset;
      const x = targetX + shakeX - (w * scale) / 2;
      const y = centerY - (h * scale) / 2;
      const drawW = w * scale;
      const drawH = h * scale;
      const imageBox = { x: x + 9, y: y + 24, w: w - 18, h: h - 48 };
      state.combat.layout?.push({ team, index: idx, x, y, w: drawW, h: drawH, imageBox });

      // Draw backdrop
      canvasCtx.fillStyle = isPlayer ? "rgba(10, 30, 24, 0.9)" : "rgba(35, 12, 12, 0.9)";
      canvasCtx.strokeStyle = isPlayer ? "var(--mint)" : "var(--danger)";
      canvasCtx.lineWidth = 2;
      
      // Draw rounded rectangle
      canvasCtx.beginPath();
      canvasCtx.roundRect(x, y, drawW, drawH, 10);
      canvasCtx.fill();
      canvasCtx.stroke();
      if (isActing) {
        canvasCtx.strokeStyle = actor.style === "cast" ? "#8ff7ff" : "#ffd666";
        canvasCtx.lineWidth = 4;
        canvasCtx.globalAlpha = 0.82;
        canvasCtx.beginPath();
        canvasCtx.roundRect(x - 3, y - 3, drawW + 6, drawH + 6, 12);
        canvasCtx.stroke();
        canvasCtx.globalAlpha = 1;
      }
      
      // Draw character sprite
      if (isPlayer) {
        const portrait = imageCache[unit.imageKey] || imageCache.boomLion;
        drawContainImage(portrait, imageBox.x, imageBox.y, imageBox.w, imageBox.h);
      } else {
        const sheet = imageCache.enemies;
        if (sheet) {
          const sw = 682;
          const sh = 768;
          const cropRatio = sw / sh;
          const targetRatio = imageBox.w / imageBox.h;
          let drawW = imageBox.w;
          let drawH = imageBox.h;
          if (cropRatio > targetRatio) {
            drawH = imageBox.w / cropRatio;
          } else {
            drawW = imageBox.h * cropRatio;
          }
          canvasCtx.drawImage(sheet, unit.sx, unit.sy, sw, sh, imageBox.x + (imageBox.w - drawW) / 2, imageBox.y + (imageBox.h - drawH) / 2, drawW, drawH);
        }
      }

      drawUnitHealthBar(unit, x + 8, y + 8, w - 16, isPlayer);

      // Draw Melon shield overlay
      if (unit.shield || unit.shieldHp > 0) {
        canvasCtx.strokeStyle = "#5e8cf2";
        canvasCtx.lineWidth = 3;
        canvasCtx.beginPath();
        canvasCtx.arc(x + drawW/2, y + drawH/2 - 10, drawW/2 - 2, 0, Math.PI * 2);
        canvasCtx.stroke();
        if (unit.shieldHp > 0) {
          drawStatPill(`S${Math.round(unit.shieldHp)}`, x + drawW / 2 - 18, y + drawH - 40, "#9cc8ff");
        }
      }

      drawStatPill(`A${unit.atk}`, x + 6, y + drawH - 20, "#ffd666");
      drawStatPill(`H${Math.max(0, Math.round(unit.hp))}`, x + drawW - 42, y + drawH - 20, "#ff7081");

      if (isPlayer) {
        drawStatPill(`L${unitLevel(unit)}`, x + drawW / 2 - 18, y + 23, "#ffd666");
      }

      // Level star indicator for player units
      if (false && isPlayer && unit.level > 1) {
        canvasCtx.fillStyle = "var(--gold)";
        canvasCtx.fillText(`★${unit.level}`, x + w/2 - 8, y + 16);
      }

      canvasCtx.restore();
    });
    state.combat.activeActors = (state.combat.activeActors || []).filter((actor) => {
      actor.life--;
      return actor.life > 0;
    });
    state.combat.activeActor = state.combat.activeActors[state.combat.activeActors.length - 1] || null;
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
      const maxLife = Math.max(1, fx.maxLife || 18);
      const progress = 1 - fx.life / maxLife;
      const alpha = Math.max(0, fx.life / maxLife);
      const radius = 18 + progress * 42;

      canvasCtx.save();
      canvasCtx.globalAlpha = alpha;
      if (fx.type === "hit") {
        canvasCtx.strokeStyle = "#ffd666";
        canvasCtx.lineWidth = 4;
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 * i) / 8 + progress * 0.8;
          canvasCtx.beginPath();
          canvasCtx.moveTo(fx.x + Math.cos(angle) * 10, fx.y + Math.sin(angle) * 10);
          canvasCtx.lineTo(fx.x + Math.cos(angle) * radius, fx.y + Math.sin(angle) * radius);
          canvasCtx.stroke();
        }
      } else if (fx.type === "shield") {
        canvasCtx.strokeStyle = "#8fb7ff";
        canvasCtx.lineWidth = 5;
        canvasCtx.beginPath();
        canvasCtx.arc(fx.x, fx.y, radius * 0.72, 0, Math.PI * 2);
        canvasCtx.stroke();
        canvasCtx.fillStyle = "rgba(143, 183, 255, 0.16)";
        canvasCtx.fill();
      } else if (fx.type === "heal") {
        canvasCtx.strokeStyle = "#82ffd1";
        canvasCtx.lineWidth = 6;
        canvasCtx.beginPath();
        canvasCtx.moveTo(fx.x - 18, fx.y);
        canvasCtx.lineTo(fx.x + 18, fx.y);
        canvasCtx.moveTo(fx.x, fx.y - 18);
        canvasCtx.lineTo(fx.x, fx.y + 18);
        canvasCtx.stroke();
        canvasCtx.beginPath();
        canvasCtx.arc(fx.x, fx.y, radius * 0.55, 0, Math.PI * 2);
        canvasCtx.stroke();
      } else if (fx.type === "buff") {
        canvasCtx.fillStyle = "#ffd666";
        for (let i = 0; i < 3; i++) {
          const y = fx.y + 18 - progress * 44 - i * 10;
          canvasCtx.beginPath();
          canvasCtx.moveTo(fx.x - 12 + i * 12, y + 8);
          canvasCtx.lineTo(fx.x + i * 12, y - 8);
          canvasCtx.lineTo(fx.x + 12 + i * 12, y + 8);
          canvasCtx.closePath();
          canvasCtx.fill();
        }
      } else if (fx.type === "smoke") {
        canvasCtx.fillStyle = "rgba(210, 220, 230, 0.42)";
        for (let i = 0; i < 5; i++) {
          canvasCtx.beginPath();
          canvasCtx.arc(fx.x + (i - 2) * 11, fx.y + Math.sin(i) * 8, radius * (0.28 + i * 0.025), 0, Math.PI * 2);
          canvasCtx.fill();
        }
      } else if (fx.type === "starfall") {
        canvasCtx.strokeStyle = "#b9f7ff";
        canvasCtx.fillStyle = "#fff2a8";
        canvasCtx.lineWidth = 3;
        for (let i = 0; i < 5; i++) {
          const angle = -Math.PI / 2 + (i * Math.PI * 2) / 5;
          const x = fx.x + Math.cos(angle) * radius * 0.55;
          const y = fx.y + Math.sin(angle) * radius * 0.55;
          canvasCtx.beginPath();
          canvasCtx.arc(x, y, 5 + progress * 5, 0, Math.PI * 2);
          canvasCtx.fill();
        }
        canvasCtx.beginPath();
        canvasCtx.arc(fx.x, fx.y, radius * 0.8, 0, Math.PI * 2);
        canvasCtx.stroke();
      }
      
      // Floating text overlays (e.g. Damage numbers)
      if (fx.text) {
        canvasCtx.globalAlpha = 1;
        canvasCtx.font = "bold 20px Outfit, system-ui";
        canvasCtx.fillStyle = fx.textColor || "white";
        canvasCtx.strokeStyle = "black";
        canvasCtx.lineWidth = 3;
        canvasCtx.strokeText(fx.text, fx.x - 10, fx.y - 20 - progress * 18);
        canvasCtx.fillText(fx.text, fx.x - 10, fx.y - 20 - progress * 18);
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

    resolveOrderedCombatStep(playerSquad, enemySquad);
    return;

    triggerBeforeClashAbilities();
    if (!enemySquad.length) {
      combatLog(t("winText"));
      playSynth("win");
      setTimeout(() => endBattleRun("win"), 900);
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
    if (pUnit.id === 6) {
      pDmg = Math.max(0, pDmg - unitLevel(pUnit));
    }

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

  function resolveOrderedCombatStep(playerSquad, enemySquad) {
    const maxSlots = Math.max(playerSquad.length, enemySquad.length, 1);
    const slot = state.combat.step % maxSlots;
    state.combat.step++;
    playSynth("hit");

    if (slot === 0) {
      resolveDirectClash(playerSquad[0], enemySquad[0]);
    } else {
      const actions = [];
      if (playerSquad[slot]) actions.push(resolveUnitAbility(playerSquad[slot], "player", slot));
      if (enemySquad[slot]) actions.push(resolveEnemySlotAction(enemySquad[slot], slot));
      combatLog(actions.filter(Boolean).join("  |  ") || `${locale === "zh-Hant" ? "\u7b2c" : "Slot"} ${slot + 1}`);
    }

    setTimeout(() => {
      const before = playerSquad.length + enemySquad.length;
      removeDefeatedUnits(playerSquad, "player");
      removeDefeatedUnits(enemySquad, "enemy");
      if (before !== playerSquad.length + enemySquad.length) playSynth("faint");
    }, 220);
  }

  function resolveDirectClash(pUnit, eUnit) {
    if (!pUnit || !eUnit) return;
    state.combat.shakeFrames = 10;
    state.combat.shakeTarget = "player";
    markActing("player", 0, "attack");
    markActing("enemy", 0, "attack");
    const pPoint = combatPoint("player", 0);
    const ePoint = combatPoint("enemy", 0);
    damageTarget(pUnit, eUnit.atk, pPoint.x, pPoint.y);
    damageTarget(eUnit, pUnit.atk, ePoint.x, ePoint.y);
    combatLog(`${combatUnitName(pUnit)} ${locale === "zh-Hant" ? "\u8207" : "clashes with"} ${combatUnitName(eUnit)}`);
  }

  function resolveEnemySlotAction(unit, slot) {
    markActing("enemy", slot, "attack");
    const target = state.combat.playerSquad[0];
    if (!target) return "";
    const targetIndex = Math.max(0, state.combat.playerSquad.indexOf(target));
    const point = combatPoint("player", targetIndex);
    damageTarget(target, unit.atk, point.x, point.y);
    return `${combatUnitName(unit)} ${locale === "zh-Hant" ? "\u53cd\u64ca" : "strikes"}`;
  }

  function resolveUnitAbility(unit, team, slot) {
    const isPlayer = team === "player";
    const allies = isPlayer ? state.combat.playerSquad : state.combat.enemySquad;
    const enemies = isPlayer ? state.combat.enemySquad : state.combat.playerSquad;
    const enemyTeam = isPlayer ? "enemy" : "player";
    const level = unitLevel(unit);
    const halfAttack = Math.max(1, Math.ceil((unit.atk || 1) * 0.5));

    if (!enemies.length) return "";
    markActing(team, slot, unit.id === 3 || unit.id === 6 || unit.id === 7 || unit.id === 8 ? "cast" : "attack");
    if (unit.id === 1 || unit.id === 5) {
      healWeakestAlly(allies, halfAttack, team);
      return `${combatUnitName(unit)} ${locale === "zh-Hant" ? "\u6cbb\u7652\u968a\u53cb" : "heals an ally"}`;
    }
    if (unit.id === 6) {
      addUnitShield(unit, halfAttack, team, slot);
      return `${combatUnitName(unit)} ${locale === "zh-Hant" ? "\u6490\u8d77\u8b77\u76fe" : "raises a shield"}`;
    }
    if (unit.id === 3) {
      const frontTarget = enemies[0];
      const frontPoint = combatPoint(enemyTeam, 0);
      addCombatEffect("starfall", frontPoint.x, frontPoint.y, "", "#b9f7ff");
      damageTarget(frontTarget, Math.max(1, unit.atk + level - 1), frontPoint.x, frontPoint.y);
      const randomPool = enemies.filter((enemy) => enemy.hp > 0 && enemy !== frontTarget);
      const randomTarget = randomPool.length ? randomPool[Math.floor(Math.random() * randomPool.length)] : frontTarget;
      const randomIndex = Math.max(0, enemies.indexOf(randomTarget));
      const randomPoint = combatPoint(enemyTeam, randomIndex);
      addCombatEffect("starfall", randomPoint.x, randomPoint.y, "", "#b9f7ff");
      damageTarget(randomTarget, Math.max(1, Math.ceil(unit.atk * 0.75)), randomPoint.x, randomPoint.y);
      return `${combatUnitName(unit)} ${locale === "zh-Hant" ? "\u964d\u4e0b\u661f\u843d" : "casts Starfall"}`;
    }
    if (unit.id === 2 || unit.id === 4) {
      allies.forEach((ally, idx) => addUnitShield(ally, Math.max(1, level), team, idx));
      return `${combatUnitName(unit)} ${locale === "zh-Hant" ? "\u5b88\u8b77\u5168\u968a" : "guards the squad"}`;
    }
    if (unit.id === 7 || unit.id === 8) {
      allies.forEach((ally) => {
        ally.atk += Math.max(1, level);
        ally.maxHp += 1;
        ally.hp += 1;
      });
      const point = combatPoint(team, slot);
      addCombatEffect("buff", point.x, point.y, `+${level}`, "#ffd666");
      return `${combatUnitName(unit)} ${locale === "zh-Hant" ? "\u5f37\u5316\u968a\u53cb" : "rallies allies"}`;
    }

    const target = enemies[0];
    const point = combatPoint(enemyTeam, 0);
    damageTarget(target, unit.atk, point.x, point.y);
    return `${combatUnitName(unit)} ${locale === "zh-Hant" ? "\u653b\u64ca\u524d\u6392" : "attacks the front"}`;
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
      addTeamXp(4 + state.stage * 2 + state.round);
      addTrainingCoins(6 + state.stage * 2 + state.round);
      state.gold += 4 + Math.floor((state.stage + state.round) / 2);
      if (state.round >= WAVES_PER_STAGE) {
        const clearedStage = state.stage;
        state.activeRun = false;
        save = normalizeSave(save);
        save.clearedRuns++;
        save.bestRound = Math.max(save.bestRound, clearedStage * WAVES_PER_STAGE);
        save.completedStages = [...new Set([...save.completedStages, clearedStage])].sort((a, b) => a - b);
        save.unlockedStage = Math.max(save.unlockedStage, Math.min(STAGE_COUNT, clearedStage + 1));
        save.selectedStage = save.unlockedStage;
        addTeamXp(12 + clearedStage * 3);
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
      addTeamXp(Math.max(1, state.round));
      addTrainingCoins(Math.max(2, state.round));
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
      addTrainingCoins(Math.max(2, Math.ceil(state.round / 2)));
      state.gold += 2;
      // Draw: no heart lost, return to shop
      nodes.prepPhaseArea.classList.remove("is-hidden");
      nodes.combatArea.classList.add("is-hidden");
      nodes.combatSummary?.classList.add("is-hidden");
      startRoundPrep();
    }
    window.WonderAnalytics?.track("battle_end", { game_id: GAME_ID, stage: state.stage, wave: state.round, result });
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
      ? state.stage < STAGE_COUNT
        ? t("stageClearText", { stage: state.stage, next: state.stage + 1 })
        : t("allStagesClearText")
      : `${t("failText")} (${stageLabel(state.stage)} - ${t("round")} ${state.round}/${WAVES_PER_STAGE})`;
    nodes.nextStageBtn.classList.toggle("is-hidden", !isWin || state.stage >= STAGE_COUNT);
    nodes.skillReportText.innerHTML = `<strong>${t("skillReport")}</strong><br/>${t("skillsLearned")}`;
    
    playSynth(isWin ? "win" : "fail");
    window.WonderAnalytics?.track("expedition_end", { game_id: GAME_ID, stage: state.stage, wave: state.round, cleared: isWin });
  }

  function quitRun() {
    if (confirm("Are you sure you want to quit the current expedition run? All temporary squad progress will be lost.")) {
      initAudio();
      playSynth("sell");
      state.activeRun = false;
      showStageSelection();
    }
  }

  // Event Listeners Registration
  function setupEvents() {
    nodes.showStageBtn.addEventListener("click", showStageSelection);
    nodes.stageBackBtn.addEventListener("click", renderMenu);
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
      save = normalizeSave(save);
      save.selectedStage = state.stage;
      saveSave();
      startExpedition();
    });
    nodes.nextStageBtn.addEventListener("click", () => {
      save = normalizeSave(save);
      save.selectedStage = Math.min(save.unlockedStage, state.stage + 1);
      saveSave();
      nodes.resultPanel.classList.add("is-hidden");
      startExpedition();
    });
    nodes.resultMenuBtn.addEventListener("click", renderMenu);

    nodes.stageRail.addEventListener("scroll", () => {
      if (performance.now() < stageScrollLockUntil) return;
      clearTimeout(stageSnapTimer);
      const renderVersion = stageRenderVersion;
      stageSnapTimer = setTimeout(() => {
        if (renderVersion !== stageRenderVersion) return;
        const railBox = nodes.stageRail.getBoundingClientRect();
        const railCenter = railBox.left + railBox.width / 2;
        const cards = [...nodes.stageRail.querySelectorAll(".stage-card:not(:disabled)")];
        const nearest = cards.reduce((best, card) => {
          const box = card.getBoundingClientRect();
          const distance = Math.abs(box.left + box.width / 2 - railCenter);
          return !best || distance < best.distance ? { card, distance } : best;
        }, null);
        const nearestStage = Number(nearest?.card.dataset.stage);
        if (nearestStage && nearestStage !== normalizeSave(save).selectedStage) selectStage(nearestStage, true);
      }, 120);
    }, { passive: true });
    
    nodes.localeSelect.addEventListener("change", (e) => {
      setLocale(e.target.value);
    });

    nodes.sellCardBtn.addEventListener("click", handleRunUpgradeSelected);

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

  function updateBattleViewport() {
    const viewport = window.visualViewport;
    const viewportWidth = viewport?.width >= window.innerWidth * 0.75 ? viewport.width : window.innerWidth;
    const viewportHeight = viewport?.height >= window.innerHeight * 0.75 ? viewport.height : window.innerHeight;
    document.documentElement.style.setProperty("--squad-vw", `${viewportWidth}px`);
    document.documentElement.style.setProperty("--squad-vh", `${viewportHeight}px`);
  }

  updateBattleViewport();
  window.addEventListener("resize", updateBattleViewport, { passive: true });
  window.visualViewport?.addEventListener("resize", updateBattleViewport, { passive: true });
  window.visualViewport?.addEventListener("scroll", updateBattleViewport, { passive: true });

  // Initialization
  startApp();

})();
