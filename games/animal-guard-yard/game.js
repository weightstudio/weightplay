(() => {
  const GAME_ID = "animal-guard-yard";
  const GAME_VERSION = "v21";
  const INTERFACE_VERSION = 6;
  const localeKey = "weightplayLocale";
  const unlockKey = "weightplay_animal_guard_unlocked";
  const bestKey = "weightplay_animal_guard_best";
  const profileKey = "weightplay_animal_guard_profile";
  const progressKey = "weightplay_animal_guard_progress";

  document.querySelectorAll("img[data-fallback-src]").forEach((image) => {
    image.addEventListener(
      "error",
      () => {
        const fallback = image.dataset.fallbackSrc;
        if (fallback && image.getAttribute("src") !== fallback) {
          image.src = fallback;
          image.removeAttribute("data-fallback-src");
        }
      },
      { once: true }
    );
  });

  const text = {
    en: {
      gameTitle: "Animal Guard Yard",
      language: "Language",
      back: "Back",
      backToLobby: "Back to lobby",
      walletAria: "Animal Guard Yard wallet",
      beastGuideAria: "Beast guide",
      stageListAria: "Stage list",
      animalUpgradesAria: "Animal upgrades",
      animalShopAria: "Animal shop",
      menuAria: "Animal Guard Yard menu",
      gameScreenAria: "Animal Guard Yard fixed game screen",
      sunEnergyAria: "Sun energy",
      homeHeartsAria: "Home hearts",
      animalGuardsAria: "Animal guards",
      defenseLanesAria: "Animal defense lanes",
      chooseStage: "Choose Stage",
      menuHint: "Place animal guards and stop the wild beasts.",
      stages: "Stages",
      openPause: "Pause battle",
      pauseTitle: "Battle paused",
      pauseHint: "Continue when you are ready, or leave this battle.",
      resume: "Continue",
      leaveBattle: "Leave Battle",
      loading: "Loading",
      nextStage: "Next Stage",
      retry: "Try Again",
      lobby: "Lobby",
      locked: "Stage locked",
      victory: "Yard protected!",
      defeat: "Wild beasts reached the yard!",
      resultWin: "You cleared Stage {n} with {hp} home hearts left.",
      resultLose: "Try placing guards earlier and collect every sun.",
      resultScore: "Score {score}",
      previousBest: "Previous Best {score}",
      newBest: "New best!",
      improvement: "Improvement {value}%",
      perfectClear: "Perfect Clear!",
      perfectBadge: "Perfect",
      perfectBonus: "Perfect defense bonus +{coins} coins",
      masteryTitle: "Garden Medals",
      masteryProgress: "{current}/{total} perfect defenses",
      masteryNext: "Next reward at {count} medals",
      masteryComplete: "All garden medals earned!",
      masteryNewMedal: "New garden medal earned!",
      masteryMilestone: "Medal milestone +{coins} coins",
      stageCleared: "Cleared",
      stageBest: "Best {score}",
      progressNew: "Great progress! Your yard defense reached a new best.",
      progressSteady: "Good effort. Try placing guards earlier to improve your next run.",
      progressNote: "Scores are for fun and local progress tracking only.",
      stage: "Stage {n}",
      wave: "Stage {n} - Beasts {left}",
      select: "Choose an animal, then tap a grass tile.",
      noEnergy: "Need more sun.",
      noCoins: "Need more coins.",
      noDiamonds: "Need more diamonds.",
      occupied: "This tile already has a guard.",
      started: "Defend the yard!",
      danger: "\u26a0\ufe0f Beasts are close!",
      kennelTitle: "Animal Training",
      kennelHint: "Upgrade guards with coins. Unlock rare animals with diamonds.",
      shopTitle: "Rare Animal Shop",
      shopHint: "Spend shared WeightPlay diamonds on special animal guards.",
      tabStages: "Stages",
      tabAnimals: "Animals",
      tabShop: "Shop",
      level: "Lv {n}",
      upgrade: "Upgrade",
      unlock: "Unlock",
      owned: "Owned",
      nextLevel: "Next Lv {n}",
      nextStats: "+{damage} ATK / +{hp} HP / {cooldown}s faster",
      unlockHint: "Unlock to train this guard.",
      coinToken: "coins",
      diamondToken: "diamonds",
      sunToken: "sun",
      reward: "Reward +{coins} coins",
      unitCat: "Cat",
      unitDog: "Dog",
      unitOwl: "Owl",
      unitFox: "Fox",
      roleRanged: "Ranged",
      roleTankMelee: "Tank Melee",
      roleFastRanged: "Fast Ranged",
      roleCrossLane: "Cross-lane",
      abilityCat: "Every 4th seed pierces",
      abilityDog: "Bite slow",
      abilityOwl: "Feather slow",
      abilityFox: "Cross-lane volley",
      catTactic: "Every fourth seed pierces through a second beast in the same lane.",
      pierce: "PIERCE!",
      dogTactic: "Blocks the lane and briefly slows bites.",
      owlTactic: "Fast shots keep rushing beasts slowed.",
      foxTactic: "Fires a strong leaf shot, then supports a nearby lane with a lighter volley.",
      costShort: "Cost",
      atkShort: "ATK",
      hpShort: "HP",
      beastGuideTitle: "Beast Guide",
      beastGuideHint: "Learn what each wild beast does before choosing a stage.",
      threatPreview: "Stage threats",
      threatNormal: "Normal",
      threatFast: "Fast",
      threatShield: "Shield",
      threatHealer: "Healer",
      threatBurrow: "Burrower",
      threatThief: "Sun thief",
      threatBoss: "Boss",
      beastNormalDesc: "Balanced beasts. Stop them with early cats or dogs.",
      beastFastDesc: "Fast beasts rush lanes. Place guards before they appear.",
      beastShieldDesc: "Shield beasts have high HP. Use stronger trained guards.",
      beastHealerDesc: "Healers restore the beast in front. Focus them before the lane recovers.",
      beastBurrowDesc: "Burrowers warn before moving to a nearby lane. Keep two lanes covered.",
      beastThiefDesc: "Sun thieves take 12 sun unless they are stopped before their pouch glows.",
      beastBossDesc: "Boss beasts roar and slow nearby guards. Build a layered defense.",
      bossRoar: "Boss roar!",
      bossShell: "Shell closed!",
      bossShellOpen: "Shell open!",
      bossBurrow: "Changing lane!",
      bossRush: "Rush coming!",
      bossGale: "Gale push!",
      bossMoon: "Moon pulse!",
      healerPulse: "HEAL",
      thiefPulse: "-12 SUN",
      fast: "Fast beasts",
      shield: "Shield beasts",
      swarm: "Swarm night",
      boss: "Boss at the gate",
      basic: "First defense",
      crossfire: "Cross-lane ambush",
      tankTrial: "Shield stampede",
      grandBoss: "Grand boss garden",
      stagePlan1: "Start with Cat damage, then add a Dog before the final beasts.",
      stagePlan2: "Fast beasts hit the outer lanes. Place a Dog blocker early.",
      stagePlan3: "Shield beasts are tough. Focus Cats and add Owl slows.",
      stagePlan4: "Center lanes get crowded. Build the middle first, then sides.",
      stagePlan5: "Boss stage. Block the boss lane and slow it with Owls.",
      stagePlan6: "More lanes and speed. Upgrade Dogs and spread Cat damage.",
      stagePlan7: "Shield-heavy stage. Use Owl slows and Fox burst if unlocked.",
      stagePlan8: "Grand boss. Save sun for center lanes and extra blockers.",
    },
    "zh-Hant": {
      gameTitle: "\u52d5\u7269\u5b88\u885b\u5ead\u9662",
      language: "\u8a9e\u8a00",
      back: "\u8fd4\u56de",
      backToLobby: "\u8fd4\u56de\u5927\u5ef3",
      walletAria: "\u52d5\u7269\u5b88\u885b\u5ead\u9662\u9322\u5305",
      beastGuideAria: "\u91ce\u7378\u5716\u9451",
      stageListAria: "\u95dc\u5361\u6e05\u55ae",
      animalUpgradesAria: "\u52d5\u7269\u5347\u7d1a",
      animalShopAria: "\u52d5\u7269\u5546\u5e97",
      menuAria: "\u52d5\u7269\u5b88\u885b\u5ead\u9662\u9078\u55ae",
      gameScreenAria: "\u52d5\u7269\u5b88\u885b\u5ead\u9662\u56fa\u5b9a\u904a\u6232\u756b\u9762",
      sunEnergyAria: "\u967d\u5149\u80fd\u91cf",
      homeHeartsAria: "\u5bb6\u5712\u611b\u5fc3",
      animalGuardsAria: "\u52d5\u7269\u5b88\u885b",
      defenseLanesAria: "\u52d5\u7269\u9632\u885b\u8def\u7dda",
      chooseStage: "\u9078\u64c7\u95dc\u5361",
      menuHint: "\u653e\u7f6e\u52d5\u7269\u5b88\u885b\uff0c\u64cb\u4f4f\u91ce\u7378\u9032\u653b\u3002",
      stages: "\u95dc\u5361",
      openPause: "\u66ab\u505c\u6230\u9b25",
      pauseTitle: "\u6230\u9b25\u5df2\u66ab\u505c",
      pauseHint: "\u6e96\u5099\u597d\u5c31\u7e7c\u7e8c\uff0c\u4e5f\u53ef\u4ee5\u96e2\u958b\u9019\u5834\u6230\u9b25\u3002",
      resume: "\u7e7c\u7e8c",
      leaveBattle: "\u96e2\u958b\u6230\u9b25",
      loading: "\u8f09\u5165\u4e2d",
      nextStage: "\u4e0b\u4e00\u95dc",
      retry: "\u518d\u8a66\u4e00\u6b21",
      lobby: "\u5927\u5ef3",
      locked: "\u95dc\u5361\u5c1a\u672a\u89e3\u9396",
      victory: "\u5ead\u9662\u5b88\u4f4f\u4e86\uff01",
      defeat: "\u91ce\u7378\u95d6\u9032\u5ead\u9662\u4e86\uff01",
      resultWin: "\u4f60\u901a\u904e\u7b2c {n} \u95dc\uff0c\u5269\u4e0b {hp} \u9846\u5bb6\u5712\u611b\u5fc3\u3002",
      resultLose: "\u8a66\u8457\u65e9\u9ede\u653e\u7f6e\u5b88\u885b\uff0c\u4e26\u6536\u96c6\u6bcf\u4e00\u9846\u967d\u5149\u3002",
      resultScore: "\u5206\u6578 {score}",
      previousBest: "\u904e\u53bb\u6700\u4f73 {score}",
      newBest: "\u65b0\u7684\u6700\u4f73\u7d00\u9304\uff01",
      improvement: "\u9032\u6b65 {value}%",
      perfectClear: "\u5b8c\u7f8e\u5b88\u4f4f\uff01",
      perfectBadge: "\u5b8c\u7f8e",
      perfectBonus: "\u5b8c\u7f8e\u9632\u885b\u734e\u52f5 +{coins} \u91d1\u5e63",
      masteryTitle: "\u5ead\u9662\u52f3\u7ae0",
      masteryProgress: "{current}/{total} \u679a\u5b8c\u7f8e\u9632\u885b",
      masteryNext: "\u4e0b\u500b\u734e\u52f5\uff1a{count} \u679a\u52f3\u7ae0",
      masteryComplete: "\u5df2\u6536\u96c6\u5168\u90e8\u5ead\u9662\u52f3\u7ae0\uff01",
      masteryNewMedal: "\u7372\u5f97\u65b0\u7684\u5ead\u9662\u52f3\u7ae0\uff01",
      masteryMilestone: "\u52f3\u7ae0\u91cc\u7a0b\u7891 +{coins} \u91d1\u5e63",
      stageCleared: "\u5df2\u901a\u904e",
      stageBest: "\u6700\u4f73 {score}",
      progressNew: "\u5f88\u68d2\u7684\u9032\u6b65\uff01\u9019\u6b21\u7684\u5ead\u9662\u9632\u885b\u9054\u5230\u65b0\u7684\u6700\u4f73\u7d00\u9304\u3002",
      progressSteady: "\u52aa\u529b\u5f97\u5f88\u597d\u3002\u4e0b\u6b21\u53ef\u4ee5\u66f4\u65e9\u653e\u7f6e\u5b88\u885b\uff0c\u8b93\u9632\u7dda\u66f4\u7a69\u3002",
      progressNote: "\u5206\u6578\u53ea\u7528\u65bc\u904a\u6232\u6a02\u8da3\u8207\u672c\u6a5f\u9032\u6b65\u7d00\u9304\u3002",
      stage: "\u7b2c {n} \u95dc",
      wave: "\u7b2c {n} \u95dc - \u91ce\u7378 {left}",
      select: "\u9078\u64c7\u4e00\u96bb\u52d5\u7269\uff0c\u518d\u9ede\u8349\u5730\u683c\u5b50\u653e\u7f6e\u3002",
      noEnergy: "\u967d\u5149\u4e0d\u8db3\u3002",
      noCoins: "\u91d1\u5e63\u4e0d\u8db3\u3002",
      noDiamonds: "\u947d\u77f3\u4e0d\u8db3\u3002",
      occupied: "\u9019\u500b\u683c\u5b50\u5df2\u7d93\u6709\u5b88\u885b\u4e86\u3002",
      started: "\u5b88\u4f4f\u5ead\u9662\uff01",
      danger: "\u26a0\ufe0f \u91ce\u7378\u9760\u8fd1\u5bb6\u5712\uff01",
      kennelTitle: "\u52d5\u7269\u8a13\u7df4",
      kennelHint: "\u7528\u91d1\u5e63\u5347\u7d1a\u5b88\u885b\uff0c\u7528\u947d\u77f3\u89e3\u9396\u7a00\u6709\u52d5\u7269\u3002",
      shopTitle: "\u7a00\u6709\u52d5\u7269\u5546\u5e97",
      shopHint: "\u4f7f\u7528 WeightPlay \u5171\u7528\u947d\u77f3\u8cfc\u8cb7\u7279\u6b8a\u52d5\u7269\u5b88\u885b\u3002",
      tabStages: "\u95dc\u5361",
      tabAnimals: "\u52d5\u7269",
      tabShop: "\u5546\u5e97",
      level: "Lv {n}",
      upgrade: "\u5347\u7d1a",
      unlock: "\u89e3\u9396",
      owned: "\u5df2\u64c1\u6709",
      nextLevel: "\u4e0b\u4e00\u7d1a Lv {n}",
      nextStats: "\u653b\u64ca +{damage} / \u751f\u547d +{hp} / \u51b7\u537b\u52a0\u5feb {cooldown} \u79d2",
      unlockHint: "\u89e3\u9396\u5f8c\u624d\u80fd\u8a13\u7df4\u9019\u96bb\u5b88\u885b\u3002",
      coinToken: "\u91d1\u5e63",
      diamondToken: "\u947d\u77f3",
      sunToken: "\u967d\u5149",
      reward: "\u734e\u52f5 +{coins} \u91d1\u5e63",
      unitCat: "\u8c93\u9a0e\u58eb",
      unitDog: "\u72d7\u6230\u58eb",
      unitOwl: "\u8c93\u982d\u9df9\u6cd5\u5e2b",
      unitFox: "\u72d0\u72f8\u904a\u4fe0",
      roleRanged: "\u9060\u7a0b",
      roleTankMelee: "\u5766\u514b\u8fd1\u6230",
      roleFastRanged: "\u5feb\u901f\u9060\u7a0b",
      roleCrossLane: "\u8de8\u7dda\u5c04\u64ca",
      abilityCat: "\u6bcf 4 \u767c\u7a2e\u5b50\u7a7f\u900f",
      abilityDog: "\u54ac\u64ca\u6e1b\u901f",
      abilityOwl: "\u7fbd\u7bad\u7de9\u901f",
      abilityFox: "\u8de8\u7dda\u9023\u5c04",
      catTactic: "\u6bcf\u7b2c\u56db\u767c\u7a2e\u5b50\u6703\u7a7f\u900f\u540c\u4e00\u8def\u7dda\u7684\u7b2c\u4e8c\u96bb\u91ce\u7378\u3002",
      pierce: "\u7a7f\u900f\uff01",
      dogTactic: "\u64cb\u4f4f\u540c\u7dda\u91ce\u7378\uff0c\u54ac\u64ca\u6703\u77ed\u66ab\u6e1b\u901f\u3002",
      owlTactic: "\u5feb\u901f\u5c04\u64ca\uff0c\u53ef\u58d3\u4f4f\u885d\u523a\u578b\u91ce\u7378\u3002",
      foxTactic: "\u4e3b\u653b\u767c\u5c04\u5f37\u529b\u8449\u5f48\uff0c\u518d\u4ee5\u8f03\u5f31\u7684\u9023\u5c04\u652f\u63f4\u9644\u8fd1\u7dda\u8def\u3002",
      costShort: "\u82b1\u8cbb",
      atkShort: "\u653b\u64ca",
      hpShort: "\u751f\u547d",
      beastGuideTitle: "\u91ce\u7378\u5716\u9451",
      beastGuideHint: "\u9078\u95dc\u524d\u5148\u770b\u6bcf\u7a2e\u91ce\u7378\u7684\u7279\u6027\u3002",
      threatPreview: "\u95dc\u5361\u6575\u4eba",
      threatNormal: "\u4e00\u822c",
      threatFast: "\u5feb\u901f",
      threatShield: "\u76fe\u724c",
      threatHealer: "\u7642\u7652",
      threatBurrow: "\u947d\u5730",
      threatThief: "\u5077\u967d\u5149",
      threatBoss: "Boss",
      beastNormalDesc: "\u5e73\u8861\u578b\u91ce\u7378\uff0c\u65e9\u9ede\u653e\u8c93\u9a0e\u58eb\u6216\u72d7\u6230\u58eb\u5c31\u80fd\u64cb\u4f4f\u3002",
      beastFastDesc: "\u5feb\u901f\u7a81\u9032\u7684\u91ce\u7378\uff0c\u51fa\u73fe\u524d\u5c31\u8981\u5148\u5e03\u9632\u3002",
      beastShieldDesc: "\u751f\u547d\u5f88\u9ad8\u7684\u91cd\u7532\u91ce\u7378\uff0c\u9700\u8981\u8a13\u7df4\u904e\u7684\u5b88\u885b\u96c6\u4e2d\u653b\u64ca\u3002",
      beastHealerDesc: "\u7642\u7652\u7378\u6703\u56de\u5fa9\u524d\u65b9\u540c\u8def\u91ce\u7378\uff0c\u5148\u96c6\u706b\u5b83\u624d\u4e0d\u6703\u8b93\u9632\u7dda\u767d\u6253\u3002",
      beastBurrowDesc: "\u947d\u5730\u7378\u6703\u5148\u9810\u8b66\u518d\u63db\u5230\u76f8\u9130\u8def\u7dda\uff0c\u8acb\u540c\u6642\u7167\u9867\u5169\u8def\u3002",
      beastThiefDesc: "\u967d\u5149\u76dc\u6703\u5077\u8d70 12 \u9ede\u967d\u5149\uff0c\u5728\u888b\u5b50\u767c\u4eae\u524d\u64cb\u4f4f\u5b83\u3002",
      beastBossDesc: "Boss \u6703\u5486\u54ee\u4e26\u8b93\u9644\u8fd1\u5b88\u885b\u8b8a\u6162\uff0c\u8acb\u63d0\u524d\u5efa\u7acb\u591a\u5c64\u9632\u7dda\u3002",
      bossRoar: "Boss \u5486\u54ee\uff01",
      bossShell: "\u6676\u6bbc\u5408\u8d77\uff01",
      bossShellOpen: "\u6676\u6bbc\u6253\u958b\uff01",
      bossBurrow: "\u6e96\u5099\u63db\u7dda\uff01",
      bossRush: "\u885d\u523a\u8981\u4f86\u4e86\uff01",
      bossGale: "\u75be\u98a8\u63a8\u9032\uff01",
      bossMoon: "\u6708\u5149\u8108\u885d\uff01",
      healerPulse: "\u7642\u7652",
      thiefPulse: "-12 \u967d\u5149",
      fast: "\u5feb\u901f\u91ce\u7378",
      shield: "\u91cd\u7532\u91ce\u7378",
      swarm: "\u591c\u665a\u7fa4\u8972",
      boss: "Boss \u58d3\u5883",
      basic: "\u7b2c\u4e00\u9053\u9632\u7dda",
      crossfire: "\u8de8\u7dda\u5947\u8972",
      tankTrial: "\u76fe\u724c\u8a66\u7df4",
      grandBoss: "\u6700\u7d42\u5ead\u9662",
      stagePlan1: "先用貓咪輸出，最後一波前補上小狗。",
      stagePlan2: "外側快獸較多，提早放小狗擋路。",
      stagePlan3: "盾獸血厚，用貓咪集火並搭配貓頭鷹緩速。",
      stagePlan4: "中央壓力最高，先守中路再補兩側。",
      stagePlan5: "Boss 關，Boss 路線放小狗並用貓頭鷹拖慢。",
      stagePlan6: "路線更多且速度更快，升級小狗並分散貓咪。",
      stagePlan7: "盾獸很多，靠貓頭鷹緩速與狐狸爆發。",
      stagePlan8: "最終 Boss，保留陽光補中路與防線。",
    },
  };

  const foregroundPlacementCopy = {
    en: "Bring this game to the foreground, then tap the grass tile again.",
    "zh-Hant": "請先回到此遊戲畫面，再點一次草地格子。",
    "zh-Hans": "请先回到此游戏画面，再点一次草地格子。",
    ja: "このゲームを前面に戻して、草地マスをもう一度タップしてください。",
    ko: "이 게임을 화면 앞으로 가져온 뒤 잔디 칸을 다시 누르세요.",
    es: "Vuelve a esta ventana del juego y toca otra vez la casilla de césped.",
    "pt-BR": "Volte para esta janela do jogo e toque novamente no espaço de grama.",
    fr: "Revenez sur cette fenêtre de jeu, puis touchez à nouveau la case d’herbe.",
    de: "Bringe dieses Spiel nach vorn und tippe erneut auf das Grasfeld.",
    it: "Torna a questa finestra di gioco, poi tocca di nuovo la casella d’erba.",
    ru: "Вернитесь в окно игры и снова нажмите клетку с травой.",
    hi: "इस गेम को सामने लाएँ, फिर घास वाले खाने पर दोबारा टैप करें।",
    ar: "أعِد نافذة اللعبة إلى الواجهة، ثم اضغط مربع العشب مرة أخرى.",
  };
  const lanePressureCopy = {
    en: "Lane {lane} is next—cover it before the beast arrives.",
    "zh-Hant": "第 {lane} 路線即將受壓，先補上防守。",
    "zh-Hans": "第 {lane} 路线即将受压，先补上防守。",
    ja: "次は{lane}レーンが危険です。獣が来る前に守りましょう。",
    ko: "다음은 {lane}번 라인입니다. 야수가 오기 전에 지키세요.",
    es: "El carril {lane} es el siguiente: protégelo antes de que llegue la bestia.",
    "pt-BR": "A faixa {lane} vem a seguir — proteja-a antes que a fera chegue.",
    fr: "La voie {lane} est la prochaine : protégez-la avant l’arrivée de la bête.",
    de: "Bahn {lane} ist als Nächstes unter Druck – sichere sie vor dem Biest.",
    it: "La corsia {lane} è la prossima: proteggila prima che arrivi la bestia.",
    ru: "Следом под угрозой линия {lane} — защитите её до прихода зверя.",
    hi: "अगली दबाव वाली लेन {lane} है—जानवर आने से पहले उसे बचाएँ।",
    ar: "الممر {lane} هو التالي تحت الضغط — احمه قبل وصول الوحش.",
  };
  const defeatRecapCopy = {
    en: "Last breach: Lane {lane} — {threat} (beast {encounter}/{total}); {sun} sun remained after {guards} guards. On Retry, cover this lane earlier and collect sun drops.",
    "zh-Hant": "最後突破：第 {lane} 路線 — {threat}（第 {encounter}/{total} 隻野獸）；放置 {guards} 隻守衛後還剩 {sun} 點陽光。再試一次時，提早守住這條路線並收集陽光。",
    "zh-Hans": "最后突破：第 {lane} 路线 — {threat}（第 {encounter}/{total} 只野兽）；放置 {guards} 只守卫后还剩 {sun} 点阳光。再试一次时，提早守住这条路线并收集阳光。",
    ja: "最後の突破：{lane}レーンの{threat}（{encounter}/{total}体目）。守衛{guards}体を置いた時点で、太陽が{sun}残っていました。再挑戦では、このレーンを早めに守り、太陽を集めましょう。",
    ko: "마지막 돌파: {lane}번 라인의 {threat} (전체 {total}마리 중 {encounter}번째)입니다. 수호대 {guards}마리를 배치한 뒤 태양 {sun}이 남아 있었습니다. 다시 도전할 때 이 라인을 먼저 지키고 태양을 모아 보세요.",
    es: "Última brecha: {threat} en el carril {lane} (bestia {encounter}/{total}); quedaban {sun} de sol tras colocar {guards} guardianes. En el siguiente intento, protege antes ese carril y recoge el sol.",
    "pt-BR": "Última brecha: {threat} na faixa {lane} (fera {encounter}/{total}); restavam {sun} de sol após posicionar {guards} guardiões. Na próxima tentativa, proteja essa faixa antes e recolha o sol.",
    fr: "Dernière brèche : {threat} sur la voie {lane} ({encounter}/{total}); il restait {sun} de soleil après la pose de {guards} gardiens. À la prochaine tentative, protégez cette voie plus tôt et récupérez le soleil.",
    de: "Letzter Durchbruch: {threat} auf Bahn {lane} (Bestie {encounter}/{total}); nach {guards} platzierten Wächtern blieben {sun} Sonnen übrig. Schütze diese Bahn beim nächsten Versuch früher und sammle die Sonne.",
    it: "Ultima breccia: {threat} sulla corsia {lane} (bestia {encounter}/{total}); dopo {guards} guardie piazzate restavano {sun} unità di sole. Al prossimo tentativo, proteggi prima questa corsia e raccogli il sole.",
    ru: "Последний прорыв: {threat} на линии {lane} (зверь {encounter}/{total}); после размещения {guards} защитников оставалось солнца: {sun}. В следующей попытке защитите эту линию раньше и собирайте солнце.",
    hi: "आखिरी घुसपैठ: लेन {lane} में {threat} ({encounter}/{total}वाँ जानवर); {guards} गार्ड लगाने के बाद {sun} सूरज बचा था। अगली कोशिश में इस लेन को पहले बचाएँ और सूरज इकट्ठा करें।",
    ar: "آخر اختراق: {threat} في الممر {lane} (الوحش {encounter} من {total})؛ بقيت {sun} من طاقة الشمس بعد وضع {guards} من الحراس. في المحاولة التالية، احمِ هذا الممر مبكرًا واجمع الشمس.",
  };
  const defeatRecapThreatLabels = {
    en: { normal: "Normal", fast: "Fast", shield: "Shield", healer: "Healer", burrow: "Burrower", thief: "Sun thief", boss: "Boss" },
    "zh-Hant": { normal: "一般野獸", fast: "快速野獸", shield: "盾牌野獸", healer: "療癒野獸", burrow: "鑽地獸", thief: "偷陽光野獸", boss: "Boss" },
    "zh-Hans": { normal: "一般野兽", fast: "快速野兽", shield: "盾牌野兽", healer: "治疗野兽", burrow: "钻地兽", thief: "偷阳光野兽", boss: "Boss" },
    ja: { normal: "通常の獣", fast: "素早い獣", shield: "盾獣", healer: "回復獣", burrow: "穴掘り獣", thief: "太陽泥棒", boss: "ボス" },
    ko: { normal: "일반 야수", fast: "빠른 야수", shield: "방패 야수", healer: "치유 야수", burrow: "굴착 야수", thief: "태양 도둑", boss: "보스" },
    es: { normal: "bestia normal", fast: "bestia veloz", shield: "bestia con escudo", healer: "bestia sanadora", burrow: "excavador", thief: "ladrón de sol", boss: "jefe" },
    "pt-BR": { normal: "fera comum", fast: "fera veloz", shield: "fera com escudo", healer: "fera curadora", burrow: "escavadora", thief: "ladra-sol", boss: "chefe" },
    fr: { normal: "bête normale", fast: "bête rapide", shield: "bête à bouclier", healer: "bête soigneuse", burrow: "bête fouisseuse", thief: "voleur de soleil", boss: "boss" },
    de: { normal: "normales Biest", fast: "schnelles Biest", shield: "Schild-Biest", healer: "Heiler-Biest", burrow: "Gräber-Biest", thief: "Sonnen-Dieb", boss: "Boss" },
    it: { normal: "bestia normale", fast: "bestia veloce", shield: "bestia con scudo", healer: "bestia guaritrice", burrow: "bestia scavatrice", thief: "ladro di sole", boss: "boss" },
    ru: { normal: "обычный зверь", fast: "быстрый зверь", shield: "зверь со щитом", healer: "зверь-целитель", burrow: "зверь-землерой", thief: "вор солнца", boss: "босс" },
    hi: { normal: "साधारण जानवर", fast: "तेज़ जानवर", shield: "ढाल वाला जानवर", healer: "चिकित्सक जानवर", burrow: "बिल खोदने वाला जानवर", thief: "सूरज चोर", boss: "बॉस" },
    ar: { normal: "وحش عادي", fast: "وحش سريع", shield: "وحش بدرع", healer: "وحش معالج", burrow: "وحش حفّار", thief: "سارق الشمس", boss: "الزعيم" },
  };
  const trainingBridgeCopy = {
    en: {
      result: "Next goal: open Animals to see how saved coins can train your guards.",
      menu: "Coins are for Animal Training. Open Animals to see your next training goal.",
      target: "Next training: {unit} → Level {level} for {cost} coins.",
      save: "Next training: save {needed} more coins for {unit} at Level {level}.",
    },
    "zh-Hant": {
      result: "下一個目標：打開「動物」，查看如何用累積的金幣訓練守衛。",
      menu: "金幣可以用於動物訓練。打開「動物」查看下一個訓練目標。",
      target: "下一項訓練：{unit} → {cost} 枚金幣升至第 {level} 級。",
      save: "下一項訓練：再存 {needed} 枚金幣，就能讓 {unit} 升至第 {level} 級。",
    },
    "zh-Hans": {
      result: "下一个目标：打开“动物”，查看如何用累积的金币训练守卫。",
      menu: "金币可以用于动物训练。打开“动物”查看下一个训练目标。",
      target: "下一项训练：{unit} → {cost} 枚金币升至第 {level} 级。",
      save: "下一项训练：再存 {needed} 枚金币，就能让 {unit} 升至第 {level} 级。",
    },
    ja: {
      result: "次の目標：動物を開いて、貯めたコインで守衛を訓練する方法を確認しましょう。",
      menu: "コインは動物の訓練に使えます。動物を開いて次の訓練目標を確認しましょう。",
      target: "次の訓練：{unit} → {cost}コインでレベル{level}。",
      save: "次の訓練：{unit}をレベル{level}にするには、あと{needed}コイン貯めましょう。",
    },
    ko: {
      result: "다음 목표: 동물을 열어 모은 코인으로 수호대를 훈련하는 방법을 확인하세요.",
      menu: "코인은 동물 훈련에 사용합니다. 동물에서 다음 훈련 목표를 확인하세요.",
      target: "다음 훈련 목표: {unit} · 레벨 {level}, 코인 {cost}개.",
      save: "다음 훈련 목표: {unit} · 레벨 {level}까지 코인 {needed}개를 더 모으세요.",
    },
    es: {
      result: "Siguiente objetivo: abre Animales para ver cómo entrenar a tus guardianes con las monedas guardadas.",
      menu: "Las monedas sirven para entrenar animales. Abre Animales para ver tu próximo objetivo.",
      target: "Próximo entrenamiento: {unit} → nivel {level} por {cost} monedas.",
      save: "Próximo entrenamiento: ahorra {needed} monedas más para subir {unit} al nivel {level}.",
    },
    "pt-BR": {
      result: "Próxima meta: abra Animais para ver como treinar seus guardiões com as moedas guardadas.",
      menu: "As moedas servem para treinar animais. Abra Animais para ver sua próxima meta.",
      target: "Próximo treino: {unit} → nível {level} por {cost} moedas.",
      save: "Próximo treino: guarde mais {needed} moedas para levar {unit} ao nível {level}.",
    },
    fr: {
      result: "Prochain objectif : ouvrez Animaux pour voir comment entraîner vos gardiens avec les pièces épargnées.",
      menu: "Les pièces servent à entraîner les animaux. Ouvrez Animaux pour voir votre prochain objectif.",
      target: "Prochain entraînement : {unit} → niveau {level} pour {cost} pièces.",
      save: "Prochain entraînement : économisez encore {needed} pièces pour passer {unit} au niveau {level}.",
    },
    de: {
      result: "Nächstes Ziel: Öffne Tiere, um zu sehen, wie du deine Wächter mit gesparten Münzen trainierst.",
      menu: "Münzen sind für das Tiertraining. Öffne Tiere, um dein nächstes Ziel zu sehen.",
      target: "Nächstes Ziel: {unit} → Stufe {level} für {cost} Münzen.",
      save: "Nächstes Ziel: Spare noch {needed} Münzen, um {unit} auf Stufe {level} zu bringen.",
    },
    it: {
      result: "Prossimo obiettivo: apri Animali per vedere come allenare le guardie con le monete risparmiate.",
      menu: "Le monete servono per allenare gli animali. Apri Animali per vedere il prossimo obiettivo.",
      target: "Prossimo allenamento: {unit} → livello {level} per {cost} monete.",
      save: "Prossimo allenamento: raccogli ancora {needed} monete per portare {unit} al livello {level}.",
    },
    ru: {
      result: "Следующая цель: откройте «Животные», чтобы узнать, как тренировать защитников за накопленные монеты.",
      menu: "Монеты нужны для тренировки животных. Откройте «Животные», чтобы увидеть следующую цель.",
      target: "Следующая тренировка: {unit} → уровень {level} за {cost} монет.",
      save: "Следующая тренировка: накопите ещё {needed} монет, чтобы поднять {unit} до уровня {level}.",
    },
    hi: {
      result: "अगला लक्ष्य: जमा सिक्कों से गार्ड को प्रशिक्षित करने का तरीका देखने के लिए जानवर खोलें।",
      menu: "सिक्कों से जानवरों का प्रशिक्षण होता है। अगला लक्ष्य देखने के लिए जानवर खोलें।",
      target: "अगला प्रशिक्षण: {unit} → स्तर {level} पर जाने के लिए {cost} सिक्के।",
      save: "अगला प्रशिक्षण: {unit} · स्तर {level} तक पहुँचने के लिए {needed} सिक्के और बचाएँ।",
    },
    ar: {
      result: "الهدف التالي: افتح الحيوانات لمعرفة كيفية تدريب الحراس بالعملات المحفوظة.",
      menu: "العملات مخصصة لتدريب الحيوانات. افتح الحيوانات لرؤية الهدف التالي.",
      target: "التدريب التالي: {unit} ← المستوى {level} مقابل {cost} من العملات.",
      save: "التدريب التالي: ادّخر {needed} عملة إضافية لترقية {unit} إلى المستوى {level}.",
    },
  };
  text.ko = Object.assign(Object.create(text.en), {
    locked: "잠긴 스테이지",
    resultWin: "스테이지 {n} 완료! 집 하트가 {hp}개 남았어요.",
    stage: "스테이지 {n}",
    wave: "스테이지 {n} · 남은 야수 {left}",
  });

  text.es = {
    gameTitle: "Guardianes Animales del Jardín",
    language: "Idioma",
    back: "Volver",
    backToLobby: "Volver al vestíbulo",
    walletAria: "Monedero de Guardianes Animales del Jardín",
    beastGuideAria: "Guía de bestias",
    stageListAria: "Lista de niveles",
    animalUpgradesAria: "Mejoras de animales",
    animalShopAria: "Tienda de animales",
    menuAria: "Menú de Guardianes Animales del Jardín",
    gameScreenAria: "Pantalla fija de Guardianes Animales del Jardín",
    sunEnergyAria: "Energía solar",
    homeHeartsAria: "Corazones del hogar",
    animalGuardsAria: "Guardianes animales",
    defenseLanesAria: "Carriles de defensa animal",
    chooseStage: "Elegir nivel",
    menuHint: "Coloca guardianes animales y detén a las bestias salvajes.",
    stages: "Niveles",
    openPause: "Pausar batalla",
    pauseTitle: "Batalla en pausa",
    pauseHint: "Continúa cuando estés listo o abandona esta batalla.",
    resume: "Continuar",
    leaveBattle: "Abandonar batalla",
    loading: "Cargando",
    nextStage: "Siguiente nivel",
    retry: "Intentar de nuevo",
    lobby: "Vestíbulo",
    locked: "Nivel bloqueado",
    victory: "¡Jardín protegido!",
    defeat: "¡Las bestias llegaron al jardín!",
    resultWin: "Completaste el nivel {n} con {hp} corazones del hogar.",
    resultLose: "Coloca guardianes antes y recoge cada sol.",
    resultScore: "Puntuación {score}",
    previousBest: "Récord anterior {score}",
    newBest: "¡Nuevo récord!",
    improvement: "Mejora {value}%",
    perfectClear: "¡Defensa perfecta!",
    perfectBadge: "Perfecto",
    perfectBonus: "Bonificación por defensa perfecta: +{coins} monedas",
    masteryTitle: "Medallas del Jardín",
    masteryProgress: "{current}/{total} defensas perfectas",
    masteryNext: "Siguiente premio con {count} medallas",
    masteryComplete: "¡Conseguiste todas las medallas del jardín!",
    masteryNewMedal: "¡Nueva medalla del jardín!",
    masteryMilestone: "Hito de medallas: +{coins} monedas",
    stageCleared: "Completado",
    stageBest: "Récord {score}",
    progressNew: "¡Gran progreso! La defensa del jardín alcanzó un nuevo récord.",
    progressSteady: "Buen esfuerzo. Coloca guardianes antes para mejorar el próximo intento.",
    progressNote: "Las puntuaciones solo sirven para divertirse y registrar el progreso local.",
    stage: "Nivel {n}",
    wave: "Nivel {n} - Bestias {left}",
    select: "Elige un animal y toca una casilla de césped.",
    noEnergy: "Necesitas más sol.",
    noCoins: "Necesitas más monedas.",
    noDiamonds: "Necesitas más diamantes.",
    occupied: "Esta casilla ya tiene un guardián.",
    started: "¡Defiende el jardín!",
    danger: "⚠️ ¡Las bestias están cerca!",
    kennelTitle: "Entrenamiento animal",
    kennelHint: "Mejora guardianes con monedas. Desbloquea animales raros con diamantes.",
    shopTitle: "Tienda de animales raros",
    shopHint: "Usa los diamantes compartidos de WeightPlay para conseguir guardianes especiales.",
    tabStages: "Niveles",
    tabAnimals: "Animales",
    tabShop: "Tienda",
    level: "Nv. {n}",
    upgrade: "Mejorar",
    unlock: "Desbloquear",
    owned: "Obtenido",
    nextLevel: "Siguiente: Nv. {n}",
    nextStats: "+{damage} ATQ / +{hp} PV / {cooldown} s más rápido",
    unlockHint: "Desbloquea este guardián para entrenarlo.",
    coinToken: "monedas",
    diamondToken: "diamantes",
    sunToken: "sol",
    reward: "Premio: +{coins} monedas",
    unitCat: "Gato",
    unitDog: "Perro",
    unitOwl: "Búho",
    unitFox: "Zorro",
    roleRanged: "A distancia",
    roleTankMelee: "Tanque cuerpo a cuerpo",
    roleFastRanged: "Ataque rápido a distancia",
    roleCrossLane: "Ataque entre carriles",
    abilityCat: "Cada 4.ª semilla atraviesa",
    abilityDog: "Mordisco ralentizador",
    abilityOwl: "Pluma ralentizadora",
    abilityFox: "Descarga entre carriles",
    catTactic: "Cada cuarta semilla atraviesa y alcanza a una segunda bestia del mismo carril.",
    pierce: "¡ATRAVIESA!",
    dogTactic: "Bloquea el carril y sus mordiscos ralentizan brevemente.",
    owlTactic: "Sus disparos rápidos mantienen lentas a las bestias veloces.",
    foxTactic: "Lanza una hoja potente y apoya un carril cercano con una descarga más ligera.",
    costShort: "Coste",
    atkShort: "ATQ",
    hpShort: "PV",
    beastGuideTitle: "Guía de bestias",
    beastGuideHint: "Aprende qué hace cada bestia salvaje antes de elegir nivel.",
    threatPreview: "Amenazas del nivel",
    threatNormal: "Normal",
    threatFast: "Veloz",
    threatShield: "Escudo",
    threatHealer: "Sanador",
    threatBurrow: "Excavador",
    threatThief: "Ladrón de sol",
    threatBoss: "Jefe",
    beastNormalDesc: "Bestias equilibradas. Deténlas pronto con gatos o perros.",
    beastFastDesc: "Bestias veloces que recorren los carriles. Coloca guardianes antes de que aparezcan.",
    beastShieldDesc: "Bestias con escudo y muchos PV. Usa guardianes entrenados más fuertes.",
    beastHealerDesc: "Los sanadores restauran a la bestia de delante. Concéntrate en ellos antes de que recuperen el carril.",
    beastBurrowDesc: "Los excavadores avisan antes de cambiar a un carril cercano. Protege dos carriles.",
    beastThiefDesc: "Los ladrones roban 12 de sol si no los detienes antes de que brille su bolsa.",
    beastBossDesc: "Los jefes rugen y ralentizan a los guardianes cercanos. Construye una defensa en capas.",
    bossRoar: "¡Rugido del jefe!",
    bossShell: "¡Caparazón cerrado!",
    bossShellOpen: "¡Caparazón abierto!",
    bossBurrow: "¡Cambio de carril!",
    bossRush: "¡Se acerca una embestida!",
    bossGale: "¡Empuje del vendaval!",
    bossMoon: "¡Pulso lunar!",
    healerPulse: "CURA",
    thiefPulse: "-12 SOL",
    fast: "Bestias veloces",
    shield: "Bestias con escudo",
    swarm: "Enjambre nocturno",
    boss: "Jefe en la puerta",
    basic: "Primera defensa",
    crossfire: "Emboscada entre carriles",
    tankTrial: "Estampida acorazada",
    grandBoss: "Jardín del gran jefe",
    stagePlan1: "Empieza con el daño del Gato y añade un Perro antes de las últimas bestias.",
    stagePlan2: "Las bestias veloces atacan los carriles exteriores. Coloca pronto un Perro.",
    stagePlan3: "Las bestias con escudo resisten mucho. Concentra Gatos y añade la ralentización del Búho.",
    stagePlan4: "Los carriles centrales se llenan. Defiende primero el centro y después los lados.",
    stagePlan5: "Nivel de jefe. Bloquea su carril y ralentízalo con Búhos.",
    stagePlan6: "Hay más carriles y velocidad. Mejora Perros y reparte el daño de los Gatos.",
    stagePlan7: "Muchos escudos. Usa la ralentización del Búho y el daño explosivo del Zorro.",
    stagePlan8: "Gran jefe. Reserva sol para los carriles centrales y más bloqueadores."
  };

  // Keep the Battle unit label locale-owned even when the shared page
  // localizer has no full game dictionary for a route locale.
  const abilityCatLocaleCopy = {
    en: "Every 4th seed pierces",
    "zh-Hant": "\u6bcf 4 \u767c\u7a2e\u5b50\u7a7f\u900f",
    "zh-Hans": "\u6bcf 4 \u9897\u79cd\u5b50\u7a7f\u900f",
    ja: "4\u767a\u3054\u3068\u306b\u7a2e\u304c\u8cab\u901a\u3057\u307e\u3059",
    ko: "4\ubc88\uc9f8 \uc528\uc557\ub9c8\ub2e4 \uad00\ud1b5\ud569\ub2c8\ub2e4",
    es: "Cada 4.\u00aa semilla atraviesa",
    "pt-BR": "A cada 4\u00aa semente, o disparo atravessa",
    fr: "Toutes les 4 graines, le tir transperce",
    de: "Jeder vierte Samen durchdringt",
    it: "Ogni quarto seme perfora",
    ru: "\u041a\u0430\u0436\u0434\u043e\u0435 4-\u0435 \u0441\u0435\u043c\u044f \u043f\u0440\u043e\u0431\u0438\u0432\u0430\u0435\u0442",
    hi: "\u0939\u0930 \u091a\u094c\u0925\u093e \u092c\u0940\u091c \u092a\u093e\u0930 \u0915\u0930 \u091c\u093e\u0924\u093e \u0939\u0948",
    ar: "\u0643\u0644 \u0628\u0630\u0631\u0629 \u0631\u0627\u0628\u0639\u0629 \u062a\u062e\u062a\u0631\u0642",
  };
  Object.entries(abilityCatLocaleCopy).forEach(([code, value]) => {
    text[code] = Object.assign(text[code] || Object.create(text.en), { abilityCat: value });
  });

  const units = [
    { id: "cat", nameKey: "unitCat", roleKey: "roleRanged", abilityKey: "abilityCat", attackStyle: "ranged", cost: 45, hp: 92, damage: 18, cooldown: 930, range: 9, pierceEvery: 4, unlockCost: 0 },
    { id: "dog", nameKey: "unitDog", roleKey: "roleTankMelee", abilityKey: "abilityDog", attackStyle: "melee", cost: 58, hp: 350, damage: 42, cooldown: 820, range: 1.5, unlockCost: 0 },
    { id: "owl", nameKey: "unitOwl", roleKey: "roleFastRanged", abilityKey: "abilityOwl", attackStyle: "ranged", cost: 105, hp: 78, damage: 14, cooldown: 680, range: 9, unlockCost: 0 },
    { id: "fox", nameKey: "unitFox", roleKey: "roleCrossLane", abilityKey: "abilityFox", attackStyle: "cross", cost: 120, hp: 128, damage: 34, cooldown: 880, range: 9, targetRows: 1, unlockCost: 5 },
  ];

  const spriteAssets = {
    cat: "../../assets/animal-guard-cat.png",
    dog: "../../assets/animal-guard-dog.png",
    owl: "../../assets/animal-guard-owl.png",
    fox: "../../assets/animal-guard-fox.png",
    normal: "../../assets/animal-guard-beast-normal.webp",
    fast: "../../assets/animal-guard-beast-fast.webp",
    shield: "../../assets/animal-guard-beast-shield.webp",
    healer: "../../assets/animal-guard-beast-normal.webp",
    burrow: "../../assets/animal-guard-beast-fast.webp",
    thief: "../../assets/animal-guard-beast-shield.webp",
    boss: "../../assets/animal-guard-beast-boss.webp",
    bossRhino: "../../assets/animal-guard-beast-boss.webp",
    bossTortoise: "../../assets/animal-guard-yard-boss-prism-shell-tortoise.webp",
    bossBadger: "../../assets/animal-guard-yard-boss-burrow-badger-chief.webp",
    bossBoar: "../../assets/animal-guard-yard-boss-ember-mane-boar.webp",
    bossEagle: "../../assets/animal-guard-yard-boss-gale-wing-eagle.webp",
    bossElk: "../../assets/animal-guard-yard-boss-moon-crown-elk.webp",
  };
  const diamondIcon = "../../assets/weightplay-diamond.svg?v=20260704-blue-diamond1";
  const heartIcon = "../../assets/weightplay-heart.svg";
  const impactFxAsset = "../../assets/animal-guard-beast-impact-fx.webp";
  const masteryMilestones = new Map([[5, 45], [15, 120], [30, 260]]);

  const projectileAssets = {
    cat: "../../assets/animal-guard-projectile-seed.svg",
    owl: "../../assets/animal-guard-projectile-feather.svg",
    fox: "../../assets/animal-guard-projectile-leaf.svg",
  };

  const stageBlueprints = [
    ["First Sun", "\u521d\u967d\u8349\u5730", "Learn Cat range before the first quick beast arrives.", "\u5148\u8a8d\u8b58\u8c93\u9a0e\u58eb\u5c04\u7a0b\uff0c\u518d\u64cb\u4f4f\u7b2c\u4e00\u96bb\u5feb\u7378\u3002", ["normal"]],
    ["Two-Lane Footprints", "\u96d9\u8def\u8173\u5370", "Cover the two marked lanes instead of filling one row.", "\u540c\u6642\u5b88\u5169\u689d\u9810\u544a\u8def\u7dda\uff0c\u4e0d\u8981\u53ea\u64e0\u4e00\u8def\u3002", ["normal", "fast"]],
    ["Shield in the Clover", "\u82dc\u84ff\u76fe\u5f71", "Put a Dog in front and ranged guards behind it.", "\u72d7\u6230\u58eb\u653e\u524d\u9762\uff0c\u9060\u7a0b\u5b88\u885b\u653e\u5f8c\u9762\u3002", ["normal", "shield"]],
    ["Dusk Dash", "\u9ec3\u660f\u5feb\u8dd1", "Watch the lane warning and prepare before fast beasts enter.", "\u770b\u6e05\u8def\u7dda\u9810\u8b66\uff0c\u5feb\u7378\u51fa\u73fe\u524d\u5148\u5e03\u9632\u3002", ["fast", "shield"]],
    ["Moss Horn Gate", "\u82d4\u89d2\u5927\u9580", "Moss Horn Rhino roars; split guards across front and back positions.", "\u82d4\u89d2\u7280\u725b\u6703\u5486\u54ee\uff0c\u524d\u5f8c\u5169\u5c64\u90fd\u8981\u6709\u5b88\u885b\u3002", ["normal", "shield"]],
    ["Healing Leaves", "\u7642\u7652\u8449\u5f91", "Focus the healer before it restores the beast ahead.", "\u5148\u96c6\u706b\u7642\u7652\u7378\uff0c\u5225\u8b93\u5b83\u56de\u5fa9\u524d\u65b9\u91ce\u7378\u3002", ["normal", "healer"]],
    ["Patient Shield", "\u8010\u5fc3\u7834\u76fe", "Layer Cat shots behind a Dog while the healer is exposed.", "\u7528\u72d7\u6230\u58eb\u64cb\u4f4f\uff0c\u8c93\u9a0e\u58eb\u5728\u5f8c\u65b9\u96c6\u706b\u7642\u7652\u7378\u3002", ["shield", "healer"]],
    ["Rainy Recovery", "\u96e8\u4e2d\u56de\u5fa9", "Owl slow gives time to finish healers between shield waves.", "\u8c93\u982d\u9df9\u6e1b\u901f\u53ef\u722d\u53d6\u6642\u9593\uff0c\u8d95\u5728\u76fe\u7378\u9593\u96d9\u89e3\u6c7a\u7642\u7652\u7378\u3002", ["fast", "healer", "shield"]],
    ["Prism Procession", "\u68f1\u93e1\u968a\u4f0d", "Save sun for two complete lanes rather than many weak guards.", "\u4fdd\u7559\u967d\u5149\u5b8c\u6210\u5169\u689d\u9632\u7dda\uff0c\u4e0d\u8981\u5230\u8655\u653e\u5f31\u5c0f\u5b88\u885b\u3002", ["healer", "shield", "fast"]],
    ["Prism Shell Court", "\u6676\u6bbc\u4e4b\u5ead", "The tortoise closes its shell; save burst damage for the open window.", "\u6676\u6bbc\u9678\u9f9c\u6703\u5408\u4e0a\u5916\u6bbc\uff0c\u7b49\u5b83\u6253\u958b\u518d\u96c6\u4e2d\u8f38\u51fa\u3002", ["healer", "shield"]],
    ["Loose Soil", "\u9b06\u8edf\u571f\u5f91", "A burrower warns before changing one lane up or down.", "\u947d\u5730\u7378\u6703\u9810\u8b66\u5f8c\u4e0a\u4e0b\u63db\u7dda\uff0c\u76f8\u9130\u8def\u4e5f\u8981\u5e03\u9632\u3002", ["normal", "burrow"]],
    ["Crossed Tunnels", "\u4ea4\u932f\u5730\u9053", "Use Fox or spread ranged guards across neighboring lanes.", "\u7528\u72d0\u72f8\u8de8\u7dda\u652f\u63f4\uff0c\u6216\u628a\u9060\u7a0b\u5b88\u885b\u5206\u6563\u5230\u76f8\u9130\u8def\u3002", ["burrow", "fast"]],
    ["Burrow and Shield", "\u947d\u5730\u8207\u76fe", "Do not let one blocker carry the whole center lane.", "\u4e0d\u8981\u53ea\u9760\u4e00\u96bb\u72d7\u6230\u58eb\u5b88\u6574\u689d\u4e2d\u8def\u3002", ["burrow", "shield"]],
    ["Underleaf Ambush", "\u8449\u5e95\u5947\u8972", "Read the warning icon; a burrower may leave its starting lane.", "\u770b\u6e05\u9810\u8b66\u5716\u793a\uff0c\u947d\u5730\u7378\u4e0d\u4e00\u5b9a\u7559\u5728\u539f\u8def\u3002", ["burrow", "healer", "fast"]],
    ["Badger Tunnel Hall", "\u737e\738b\u5730\u9053", "The chief changes lanes twice; keep the middle three lanes ready.", "\u737e\738b\u6703\u5169\u6b21\u63db\u7dda\uff0c\u4e2d\u9593\u4e09\u8def\u90fd\u8981\u4fdd\u7559\u9632\u5b88\u3002", ["burrow", "shield"]],
    ["Empty Sun Pouch", "\u7a7a\u967d\u5149\u888b", "Stop sun thieves before their pouch glows and removes 12 sun.", "\u967d\u5149\u76dc\u7684\u888b\u5b50\u767c\u4eae\u524d\u64cb\u4f4f\u5b83\uff0c\u5426\u5247\u6703\u5931\u53bb 12 \u9ede\u967d\u5149\u3002", ["normal", "thief"]],
    ["Guard the Harvest", "\u5b88\u4f4f\u6536\u6210", "Collect drops promptly and spend before a thief can take them.", "\u53ca\u6642\u6536\u967d\u5149\u4e26\u5148\u82b1\u5728\u95dc\u9375\u5b88\u885b\u4e0a\u3002", ["thief", "fast"]],
    ["Hot Footprints", "\u71b1\u6c23\u8173\u5370", "Block thieves while Owl slows the fast escort.", "\u72d7\u6230\u58eb\u64cb\u76dc\u7378\uff0c\u8c93\u982d\u9df9\u62d6\u6162\u5feb\u901f\u8b77\u885b\u3002", ["thief", "fast", "shield"]],
    ["Ember Crossing", "\u9918\u71fc\u4ea4\u53c9\u53e3", "Keep a spare blocker for the lane marked by the rush warning.", "\u70ba\u885d\u523a\u9810\u8b66\u7684\u8def\u7dda\u4fdd\u7559\u4e00\u96bb\u64cb\u8def\u5b88\u885b\u3002", ["thief", "burrow", "fast"]],
    ["Ember Mane Arena", "\u71fc\u9b03\u7af6\u6280\u5834", "The boar announces a rush; a Dog absorbs it while ranged guards fire.", "\u71fc\u9b03\u91ce\u8c6c\u6703\u9810\u544a\u885d\u523a\uff0c\u7528\u72d7\u6230\u58eb\u627f\u53d7\uff0c\u5f8c\u6392\u96c6\u706b\u3002", ["thief", "fast"]],
    ["Wind-Tossed Seeds", "\u98a8\u4e2d\u7a2e\u5b50", "Fast beasts arrive in alternating outer lanes.", "\u5feb\u7378\u6703\u5728\u5169\u689d\u5916\u8def\u4ea4\u66ff\u51fa\u73fe\u3002", ["fast", "normal"]],
    ["Feather and Shell", "\u98db\u7fbd\u8207\u786c\u6bbc", "Combine Owl slow with Cat pierce against packed shields.", "\u7528\u8c93\u982d\u9df9\u6e1b\u901f\u642d\u914d\u8c93\u9a0e\u58eb\u7a7f\u900f\u5c04\u64ca\u3002", ["shield", "fast", "healer"]],
    ["Gusty Tunnels", "\u9663\u98a8\u5730\u9053", "Burrowers and fast beasts test neighboring-lane coverage.", "\u947d\u5730\u7378\u8207\u5feb\u7378\u6703\u6aa2\u9a57\u76f8\u9130\u8def\u652f\u63f4\u3002", ["burrow", "fast"]],
    ["High Perch Alarm", "\u9ad8\u68f2\u8b66\u5831", "Build from the middle outward before the gale arrives.", "\u75be\u98a8\u4f86\u81e8\u524d\uff0c\u5f9e\u4e2d\u9593\u5411\u5916\u5efa\u7acb\u9632\u7dda\u3002", ["burrow", "thief", "shield"]],
    ["Gale Wing Summit", "\u75be\u7ffc\u5c71\u9802", "The eagle pushes guards' attack timing back; stagger strong guards across lanes.", "\u75be\u7ffc\u9df9\u6703\u5ef6\u5f8c\u5b88\u885b\u653b\u64ca\uff0c\u5f37\u529b\u5b88\u885b\u8981\u5206\u6563\u914d\u7f6e\u3002", ["fast", "shield"]],
    ["Moonlit Mix", "\u6708\u4e0b\u6df7\u7de8", "Identify the icon first: healer, thief, or burrower needs a different answer.", "\u5148\u8fa8\u8a8d\u5716\u793a\uff1a\u7642\u7652\u3001\u5077\u967d\u5149\u8207\u947d\u5730\u90fd\u6709\u4e0d\u540c\u89e3\u6cd5\u3002", ["healer", "thief", "burrow"]],
    ["Three Quiet Lanes", "\u4e09\u689d\u975c\u8def", "Prepare three complete defenses before the mixed escort arrives.", "\u6df7\u5408\u8b77\u885b\u5230\u4f86\u524d\uff0c\u5148\u5b8c\u6210\u4e09\u689d\u9632\u7dda\u3002", ["shield", "healer", "fast"]],
    ["Starlight Switch", "\u661f\u5149\u63db\u7dda", "Expect burrowers to move while thieves pressure your sun reserve.", "\u947d\u5730\u7378\u6703\u63db\u7dda\uff0c\u967d\u5149\u76dc\u540c\u6642\u58d3\u7e2e\u8cc7\u6e90\u3002", ["burrow", "thief", "fast"]],
    ["Crown Approach", "\u738b\u51a0\u4e4b\u8def", "Save one full lane of sun for the final guardian's moon pulse.", "\u70ba\u6700\u7d42\u5b88\u8b77\u8005\u7684\u6708\u5149\u8108\u885d\u4fdd\u7559\u4e00\u689d\u5b8c\u6574\u9632\u7dda\u7684\u967d\u5149\u3002", ["healer", "shield", "thief"]],
    ["Moon Crown Garden", "\u6708\u51a0\u82b1\u5712", "The elk delays every guard and restores itself with a moon pulse; use every guard role.", "\u6708\u51a0\u9e7f\u7684\u6708\u5149\u8108\u885d\u6703\u5ef6\u5f8c\u5168\u9ad4\u5b88\u885b\u4e26\u56de\u5fa9\u81ea\u5df1\uff0c\u56db\u7a2e\u5b88\u885b\u90fd\u6709\u7528\u9014\u3002", ["healer", "burrow", "thief", "shield"]],
  ];

  const spanishStageCopy = [
    ["Primer Sol", "Aprende el alcance del Gato antes de que llegue la primera bestia veloz."],
    ["Huellas en Dos Carriles", "Protege los dos carriles marcados en vez de llenar una sola fila."],
    ["Escudo entre Tréboles", "Coloca un Perro delante y guardianes a distancia detrás."],
    ["Carrera al Anochecer", "Observa el aviso de carril y prepárate antes de que entren las bestias veloces."],
    ["Puerta del Cuerno Musgoso", "El Rinoceronte de Cuerno Musgoso ruge; reparte guardianes entre posiciones delanteras y traseras."],
    ["Hojas Curativas", "Concéntrate en el sanador antes de que restaure a la bestia de delante."],
    ["Escudo Paciente", "Acumula disparos de Gato tras un Perro mientras el sanador esté expuesto."],
    ["Recuperación bajo la Lluvia", "La ralentización del Búho da tiempo para eliminar sanadores entre oleadas de escudos."],
    ["Procesión Prismática", "Reserva sol para dos carriles completos en vez de colocar muchos guardianes débiles."],
    ["Corte del Caparazón Prismático", "La tortuga cierra su caparazón; reserva el daño explosivo para cuando lo abra."],
    ["Tierra Suelta", "Un excavador avisa antes de subir o bajar un carril."],
    ["Túneles Cruzados", "Usa al Zorro o reparte guardianes a distancia entre carriles vecinos."],
    ["Excavador y Escudo", "No dejes que un solo bloqueador sostenga todo el carril central."],
    ["Emboscada bajo las Hojas", "Lee el icono de aviso; un excavador puede abandonar su carril inicial."],
    ["Salón del Jefe Tejón", "El jefe cambia dos veces de carril; mantén preparados los tres carriles centrales."],
    ["Bolsa de Sol Vacía", "Detén a los ladrones antes de que brille su bolsa y se lleven 12 de sol."],
    ["Protege la Cosecha", "Recoge pronto las caídas y gasta el sol antes de que un ladrón pueda llevárselo."],
    ["Huellas Ardientes", "Bloquea a los ladrones mientras el Búho ralentiza a sus escoltas veloces."],
    ["Cruce de Brasas", "Guarda un bloqueador para el carril marcado por el aviso de embestida."],
    ["Arena de la Melena de Brasas", "El jabalí anuncia su embestida; un Perro la absorbe mientras disparan los guardianes traseros."],
    ["Semillas al Viento", "Las bestias veloces llegan alternando entre los carriles exteriores."],
    ["Pluma y Caparazón", "Combina la ralentización del Búho con las semillas perforantes del Gato contra escudos agrupados."],
    ["Túneles Ventosos", "Excavadores y bestias veloces ponen a prueba la cobertura de carriles vecinos."],
    ["Alarma en la Atalaya", "Construye desde el centro hacia fuera antes de que llegue el vendaval."],
    ["Cumbre del Ala Vendaval", "El águila retrasa los ataques; distribuye guardianes fuertes entre los carriles."],
    ["Mezcla bajo la Luna", "Identifica primero el icono: sanador, ladrón y excavador necesitan respuestas distintas."],
    ["Tres Carriles Tranquilos", "Prepara tres defensas completas antes de que llegue la escolta mixta."],
    ["Cambio de Luz Estelar", "Los excavadores cambiarán de carril mientras los ladrones presionan tu reserva de sol."],
    ["Camino a la Corona", "Reserva suficiente sol para un carril completo ante el pulso lunar del guardián final."],
    ["Jardín de la Corona Lunar", "El alce retrasa a todos los guardianes y se cura con un pulso lunar; utiliza los cuatro roles."]
  ];

  const bossCheckpoints = {
    5: { id: "bossRhino", mechanic: "roar", hp: 700, speed: 4.8, damage: 34 },
    10: { id: "bossTortoise", mechanic: "shell", hp: 980, speed: 4.3, damage: 36 },
    15: { id: "bossBadger", mechanic: "burrow", hp: 1180, speed: 5.2, damage: 39 },
    20: { id: "bossBoar", mechanic: "rush", hp: 1420, speed: 5.4, damage: 43 },
    25: { id: "bossEagle", mechanic: "gale", hp: 1680, speed: 5.8, damage: 46 },
    30: { id: "bossElk", mechanic: "moon", hp: 2050, speed: 5.6, damage: 50 },
  };

  const enemyBase = {
    normal: { hp: 82, speed: 8.4, damage: 12 }, fast: { hp: 68, speed: 14.6, damage: 10 },
    shield: { hp: 160, speed: 7.2, damage: 19 }, healer: { hp: 100, speed: 7.8, damage: 11, ability: "heal" },
    burrow: { hp: 112, speed: 10.2, damage: 14, ability: "burrow" }, thief: { hp: 122, speed: 10.8, damage: 13, ability: "steal" },
  };

  const stages = stageBlueprints.map(([en, zh, planEn, planZh, threats], index) => {
    const stageNo = index + 1;
    const [es, planEs] = spanishStageCopy[index];
    const region = Math.floor(index / 5);
    const scale = 1 + index * 0.055;
    const zombies = threats.map((type) => ({ type, ...enemyBase[type], hp: Math.round(enemyBase[type].hp * scale), damage: Math.round(enemyBase[type].damage * (1 + index * 0.025)) }));
    const checkpoint = bossCheckpoints[stageNo];
    return {
      title: { en, "zh-Hant": zh, es }, plan: { en: planEn, "zh-Hant": planZh, es: planEs },
      theme: ["sunny", "rain", "swamp", "sunset", "boss", "boss"][region], energy: 155 + region * 18 + (index % 5) * 8,
      hp: 4 + Math.floor(index / 10), rows: 5, cols: 9, total: 9 + region * 3 + (index % 5) * 2,
      interval: Math.max(1780, 2820 - index * 36), zombies,
      planRows: stageNo <= 2 ? [0, 0, 0, 1, 3, 2, 4, 0, 0, 2] : [2, 1, 3, 0, 4, 2, 0, 4, 1, 3],
      boss: checkpoint ? { type: checkpoint.id, isBoss: true, ...checkpoint } : null,
    };
  });

  const $ = (id) => document.getElementById(id);
  const nodes = {
    localeSelect: $("localeSelect"),
    coinText: $("coinText"),
    diamondText: $("diamondText"),
    kennelGrid: $("kennelGrid"),
    shopGrid: $("shopGrid"),
    beastGuide: $("beastGuide"),
    masterySummary: $("masterySummary"),
    menuTabs: $("menuTabs"),
    mainPanel: $("mainPanel"),
    startGameBtn: $("startGameBtn"),
    stageBackMainBtn: $("stageBackMainBtn"),
    menuPanel: $("menuPanel"),
    stageGrid: $("stageGrid"),
    stageTrainingCue: $("stageTrainingCue"),
    animalTrainingCue: $("animalTrainingCue"),
    playPanel: $("playPanel"),
    gameShell: document.querySelector("#playPanel .fixed-game-shell"),
    backToStagesBtn: $("backToStagesBtn"),
    pauseBtn: $("pauseBtn"),
    pausePanel: $("pausePanel"),
    resumeBtn: $("resumeBtn"),
    leaveBattleBtn: $("leaveBattleBtn"),
    energyText: $("energyText"),
    baseText: $("baseText"),
    waveText: $("waveText"),
    waveTimer: $("waveTimer"),
    unitBar: $("unitBar"),
    yardBoard: $("yardBoard"),
    dangerAlert: $("dangerAlert"),
    hintText: $("hintText"),
    resultPanel: $("resultPanel"),
    resultTitle: $("resultTitle"),
    resultText: $("resultText"),
    nextStageBtn: $("nextStageBtn"),
    retryBtn: $("retryBtn"),
    resultStagesBtn: $("resultStagesBtn"),
    loadingPanel: $("loadingPanel"),
    loadingText: $("loadingText"),
    loadingFill: $("loadingFill"),
  };
  nodes.menuPanel.dataset.wpCanvasMaxWidth = "920";
  nodes.playPanel.dataset.wpCanvasMaxWidth = "920";

  const sessionStorageFallback = new Map();

  function readStorage(key) {
    try {
      const value = localStorage.getItem(key);
      if (value !== null) sessionStorageFallback.set(key, value);
      return value ?? sessionStorageFallback.get(key) ?? null;
    } catch {
      return sessionStorageFallback.get(key) ?? null;
    }
  }

  function writeStorage(key, value) {
    const serialized = String(value);
    sessionStorageFallback.set(key, serialized);
    try {
      localStorage.setItem(key, serialized);
      return true;
    } catch {
      return false;
    }
  }

  let locale = window.WonderI18n?.actualLocale?.() || window.WonderI18n?.locale?.() || readStorage(localeKey) || "en";
  let unlocked = clamp(Number(readStorage(unlockKey)) || 1, 1, stages.length);
  let profile = loadProfile();
  let currentStage = 0;
  let selectedUnit = units[0].id;
  let activeMenuTab = "stages";
  let running = false;
  let paused = false;
  let lifecycleSuspended = false;
  let windowFocused = document.hasFocus();
  let pageActive = true;
  let foregroundPlacementBlocked = false;
  let energy = 0;
  let baseHp = 3;
  let spawned = 0;
  let nextSpawnAt = 0;
  let nextSunAt = 0;
  let lastTick = 0;
  let entities = [];
  let projectiles = [];
  let cells = [];
  let raf = 0;
  let resultActionClaimed = false;
  let guardPlacements = 0;
  let waveCheckpoints = new Set();
  let lastResultOutcome = "";
  let sessionHadBattle = false;
  let boardRect = { width: 1, height: 1 };
  let coinsEarned = 0;
  let lastDangerAt = 0;
  let currentSpawnDelay = 1;
  let nextSpawnPlan = null;
  let lastBreachSnapshot = null;
  let viewportWidth = 0;
  let viewportHeight = 0;
  let viewportMode = "";
  let activeScene = "main";
  let sceneGeneration = 0;
  const STAGE_POOL_SIZE = 9;
  const STAGE_NAV_SHORTCUTS = "ArrowLeft ArrowRight Home End";
  let stageWindowStart = 0;
  let stageCardPool = [];
  let stageBrowseIndex = 0;
  let stageSettleFrame = 0;

  function activateScene(scene) {
    if (!['main', 'stage', 'battle'].includes(scene)) return sceneGeneration;
    if (scene !== "stage") cancelStageSettlement();
    activeScene = scene;
    sceneGeneration += 1;
    document.documentElement.dataset.screen = scene;
    document.documentElement.dataset.wpActiveScene = scene;
    document.body.dataset.screen = scene;
    document.body.dataset.wpActiveScene = scene;
    document.documentElement.classList.toggle("guard-yard-stage", scene === "stage");
    document.body.classList.toggle("guard-yard-stage", scene === "stage");
    document.documentElement.classList.toggle("guard-yard-playing", scene === "battle");
    document.body.classList.toggle("guard-yard-playing", scene === "battle");
    ["main", "stage", "battle"].forEach((name) => {
      document.documentElement.classList.toggle(`wp-shell-${name}-active`, scene === name);
      document.body.classList.toggle(`wp-shell-${name}-active`, scene === name);
    });
    document.documentElement.classList.toggle("wp-stage-select-active", scene === "stage");
    document.body.classList.toggle("wp-stage-select-active", scene === "stage");
    const ownership = [
      [nodes.mainPanel, scene === "main"],
      [nodes.menuPanel, scene === "stage"],
      [nodes.playPanel, scene === "battle"],
    ];
    ownership.forEach(([panel, enabled]) => {
      panel.classList.toggle("hidden", !enabled);
      panel.inert = !enabled;
      if (enabled) panel.removeAttribute("aria-hidden");
      else panel.setAttribute("aria-hidden", "true");
      panel.dataset.sceneGeneration = String(sceneGeneration);
    });
    const mainReturn = document.querySelector('.home-link[data-wp-return="main"]');
    const mainHeader = mainReturn?.closest(".wp-main-shell-header, .topbar");
    if (mainReturn) {
      mainReturn.hidden = scene !== "main";
      mainReturn.classList.toggle("hidden", scene !== "main");
      mainReturn.setAttribute("aria-hidden", String(scene !== "main"));
      mainReturn.tabIndex = scene === "main" ? 0 : -1;
    }
    if (mainHeader) {
      mainHeader.hidden = scene !== "main";
      mainHeader.classList.toggle("hidden", scene !== "main");
      mainHeader.setAttribute("aria-hidden", String(scene !== "main"));
    }
    window.dispatchEvent(new Event("weightplay:shell-sync"));
    return sceneGeneration;
  }

  function updateGuardYardViewport() {
    const viewport = window.visualViewport;
    const visualWidth = Math.round(viewport?.width || 0);
    const visualHeight = Math.round(viewport?.height || 0);
    const visualMatchesLayout = visualWidth > 0
      && visualHeight > 0
      && Math.abs(visualWidth - window.innerWidth) <= 2
      && visualHeight <= window.innerHeight + 2;
    const safeWidth = visualMatchesLayout ? visualWidth : window.innerWidth;
    const height = visualMatchesLayout ? visualHeight : window.innerHeight;
    const mode = activeScene === "stage" ? "stage" : activeScene === "battle" ? "playing" : "main";
    if (safeWidth === viewportWidth && height === viewportHeight && mode === viewportMode) return;
    viewportWidth = safeWidth;
    viewportHeight = height;
    viewportMode = mode;
    const reserveHeight = mode === "main"
      ? 0
      : Math.max(0, Number(window.WeightPlayAudience?.reserveHeight) || 0);
    const availableHeight = Math.max(1, height - reserveHeight);
    const width = Math.min(Math.max(1, safeWidth), 920);
    document.documentElement.style.setProperty("--guard-yard-vw", `${width}px`);
    document.documentElement.style.setProperty("--guard-yard-vh", `${availableHeight}px`);
    const isStage = mode === "stage";
    const isPlaying = mode === "playing";
    if (isStage || isPlaying) {
      const minimumLogicalWidth = 390;
      const minimumLogicalHeight = isStage ? 788 : 450;
      const scale = Math.min(
        Math.max(1, width) / minimumLogicalWidth,
        availableHeight / minimumLogicalHeight
      );
      const logicalWidth = width / scale;
      const logicalHeight = availableHeight / scale;
      document.documentElement.style.setProperty("--guard-yard-frame-scale", String(scale));
      document.documentElement.style.setProperty("--guard-yard-frame-left", `${Math.max(0, (safeWidth - width) / 2)}px`);
      document.documentElement.style.setProperty("--guard-yard-frame-top", "0px");
      document.documentElement.style.setProperty("--guard-yard-logical-width", `${logicalWidth}px`);
      document.documentElement.style.setProperty("--guard-yard-logical-height", `${logicalHeight}px`);
      const canvas = isStage ? document.querySelector("#menuPanel") : document.querySelector("#playPanel");
      if (canvas) {
        canvas.dataset.logicalWidth = logicalWidth.toFixed(4);
        canvas.dataset.logicalHeight = logicalHeight.toFixed(4);
        canvas.dataset.commonScale = scale.toFixed(6);
      }
    }
  }

  updateGuardYardViewport();
  window.addEventListener("resize", updateGuardYardViewport, { passive: true });
  window.visualViewport?.addEventListener("resize", updateGuardYardViewport, { passive: true });

  function t(key, data) {
    const parts = key.split(".");
    const sourceLocale = locale === "zh-Hans" ? "zh-Hant" : locale;
    let value = text[sourceLocale] || text.en;
    for (const part of parts) value = value?.[part];
    if (typeof value !== "string") value = key;
    value = Object.entries(data || {}).reduce((out, [name, item]) => out.replaceAll(`{${name}}`, item), value);
    return locale === "zh-Hans" ? window.WonderI18n?.simplifyChineseText?.(value) || value : value;
  }

  function trainingBridge(kind, coins = 0) {
    const copy = trainingBridgeCopy[locale] || trainingBridgeCopy.en;
    const value = copy[kind] || trainingBridgeCopy.en[kind];
    return value.replaceAll("{coins}", String(Math.max(0, Math.round(coins))));
  }

  function trainingTargetLine() {
    const ownedUnits = units
      .filter((unit) => isOwned(unit.id))
      .sort((a, b) => upgradeCost(a.id) - upgradeCost(b.id) || units.indexOf(a) - units.indexOf(b));
    const target = ownedUnits[0];
    if (!target) return trainingBridge("menu");
    const cost = upgradeCost(target.id);
    const level = unitLevel(target.id) + 1;
    const coins = Math.max(0, Math.round(Number(profile.coins) || 0));
    const kind = coins >= cost ? "target" : "save";
    const copy = trainingBridgeCopy[locale] || trainingBridgeCopy.en;
    const value = copy[kind] || trainingBridgeCopy.en[kind];
    return value
      .replaceAll("{unit}", t(target.nameKey))
      .replaceAll("{level}", String(level))
      .replaceAll("{cost}", String(cost))
      .replaceAll("{needed}", String(Math.max(0, cost - coins)));
  }

  function foregroundPlacementMessage() {
    return foregroundPlacementCopy[locale] || foregroundPlacementCopy.en;
  }

  function lanePressureMessage(row = nextSpawnPlan?.row) {
    const lane = clamp(Number(row) + 1 || 1, 1, stages[currentStage]?.rows || 5);
    const value = lanePressureCopy[locale] || lanePressureCopy.en;
    const message = value.replaceAll("{lane}", String(lane));
    return locale === "zh-Hans" ? window.WonderI18n?.simplifyChineseText?.(message) || message : message;
  }

  function defeatRecapMessage(snapshot) {
    if (!snapshot) return "";
    const copy = defeatRecapCopy[locale] || defeatRecapCopy.en;
    const labels = defeatRecapThreatLabels[locale] || defeatRecapThreatLabels.en;
    const threatKey = String(snapshot.type || "normal").startsWith("boss") ? "boss" : String(snapshot.type || "normal");
    const message = copy
      .replaceAll("{lane}", String(clamp(Number(snapshot.row) + 1 || 1, 1, stages[currentStage]?.rows || 5)))
      .replaceAll("{threat}", labels[threatKey] || labels.normal)
      .replaceAll("{encounter}", String(Math.max(1, Number(snapshot.encounter) || 1)))
      .replaceAll("{total}", String(Math.max(1, Number(snapshot.total) || stages[currentStage]?.total || 1)))
      .replaceAll("{sun}", String(Math.max(0, Math.floor(Number(snapshot.energy) || 0))))
      .replaceAll("{guards}", String(Math.max(0, Number(snapshot.guards) || 0)));
    return locale === "zh-Hans" ? window.WonderI18n?.simplifyChineseText?.(message) || message : message;
  }

  function stageCopy(stage, field) {
    const sourceLocale = locale === "zh-Hans" ? "zh-Hant" : locale;
    const value = stage?.[field]?.[sourceLocale] || stage?.[field]?.en || "";
    return locale === "zh-Hans" ? window.WonderI18n?.simplifyChineseText?.(value) || value : value;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function loadProfile() {
    const defaults = {
      coins: 0,
      owned: { cat: true, dog: true, owl: true, fox: false },
      levels: { cat: 1, dog: 1, owl: 1, fox: 1 },
    };
    try {
      const saved = JSON.parse(readStorage(profileKey) || "{}");
      return {
        coins: Math.max(0, Number(saved.coins) || 0),
        owned: { ...defaults.owned, ...(saved.owned || {}) },
        levels: { ...defaults.levels, ...(saved.levels || {}) },
      };
    } catch {
      return defaults;
    }
  }

  function saveProfile() {
    writeStorage(profileKey, JSON.stringify(profile));
  }

  function loadProgress() {
    try {
      return JSON.parse(readStorage(progressKey) || "{}");
    } catch {
      return {};
    }
  }

  function saveProgress(score, won = false, perfect = false) {
    const previous = loadProgress();
    const previousBest = Number(previous.bestScore) || 0;
    const bestScore = Math.max(previousBest, score);
    const improvementPercent = previousBest > 0 ? Math.round(((score - previousBest) / previousBest) * 100) : (score > 0 ? 100 : 0);
    const stageKey = String(currentStage + 1);
    const stageRecords = typeof previous.stageRecords === "object" && previous.stageRecords ? { ...previous.stageRecords } : {};
    const previousStage = typeof stageRecords[stageKey] === "object" && stageRecords[stageKey] ? stageRecords[stageKey] : {};
    const playedAt = new Date().toISOString();
    const earnedNewMedal = Boolean(won && perfect && !previousStage.perfect);
    stageRecords[stageKey] = {
      cleared: Boolean(previousStage.cleared || won),
      perfect: Boolean(previousStage.perfect || perfect),
      bestScore: Math.max(Number(previousStage.bestScore) || 0, score),
      lastScore: score,
      plays: (Number(previousStage.plays) || 0) + 1,
      lastPlayedAt: playedAt,
    };
    const medalCount = Object.values(stageRecords).filter((stageRecord) => stageRecord?.perfect).length;
    const priorClaims = Array.isArray(previous.masteryMilestones) ? previous.masteryMilestones.map(Number).filter(Number.isFinite) : [];
    const newMilestones = [...masteryMilestones.keys()].filter((threshold) => medalCount >= threshold && !priorClaims.includes(threshold));
    const masteryMilestonesClaimed = [...new Set([...priorClaims, ...newMilestones])].sort((a, b) => a - b);
    const masteryCoins = newMilestones.reduce((total, threshold) => total + (masteryMilestones.get(threshold) || 0), 0);
    const record = {
      lastScore: score,
      bestScore,
      playCount: (Number(previous.playCount) || 0) + 1,
      lastPlayedAt: playedAt,
      improvementPercent,
      stage: currentStage + 1,
      stageRecords,
      masteryMilestones: masteryMilestonesClaimed,
    };
    writeStorage(progressKey, JSON.stringify(record));
    return {
      ...record,
      previousBest,
      improved: score > previousBest,
      medalCount,
      newMedal: earnedNewMedal,
      newMilestones,
      masteryCoins,
    };
  }

  function renderResultReport(message, progress, won = false, defeatRecap = "") {
    nodes.resultText.replaceChildren();

    const summary = document.createElement("p");
    summary.className = "result-summary";
    summary.textContent = message;
    nodes.resultText.appendChild(summary);

    if (!won && defeatRecap) {
      const recap = document.createElement("p");
      recap.className = "progress-message defeat-recap";
      recap.setAttribute("role", "status");
      recap.textContent = defeatRecap;
      nodes.resultText.appendChild(recap);
    }

    const trainingCue = document.createElement("p");
    trainingCue.id = "resultTrainingCue";
    trainingCue.className = "training-bridge-cue";
    trainingCue.textContent = trainingBridge("result", coinsEarned);
    nodes.resultText.appendChild(trainingCue);

    const stats = document.createElement("div");
    stats.className = "result-stats";
    [
      t("resultScore", { score: progress.lastScore }),
      progress.previousBest > 0 ? t("previousBest", { score: progress.previousBest }) : t("newBest"),
      progress.improved ? t("newBest") : t("improvement", { value: progress.improvementPercent }),
    ].forEach((textValue) => {
      const item = document.createElement("span");
      item.textContent = textValue;
      stats.appendChild(item);
    });
    nodes.resultText.appendChild(stats);

    if (won && currentStage < stages.length - 1) {
      const nextStage = stages[currentStage + 1];
      const preview = document.createElement("section");
      preview.className = "next-stage-preview";
      preview.setAttribute("aria-label", t("nextStage"));
      const previewTitle = document.createElement("strong");
      previewTitle.textContent = `${t("nextStage")}: ${t("stage", { n: currentStage + 2 })}`;
      const previewThreats = document.createElement("span");
      const threatTypes = [...new Set([...(nextStage.boss ? [nextStage.boss.type] : []), ...nextStage.zombies.map((item) => item.type)])];
      previewThreats.textContent = `${t("threatPreview")}: ${threatTypes.slice(0, 4).map((type) => stageThreatLabel(type)).join(", ")}`;
      preview.append(previewTitle, previewThreats);
      nodes.resultText.appendChild(preview);
    }

    const mastery = document.createElement("section");
    mastery.className = "mastery-result";
    const masteryTitle = document.createElement("strong");
    masteryTitle.textContent = t("masteryTitle");
    const masteryProgress = document.createElement("span");
    masteryProgress.textContent = t("masteryProgress", { current: progress.medalCount || 0, total: stages.length });
    mastery.append(masteryTitle, masteryProgress);
    if (progress.newMedal) {
      const medalNote = document.createElement("em");
      medalNote.textContent = t("masteryNewMedal");
      mastery.appendChild(medalNote);
    }
    if (progress.masteryCoins > 0) {
      const milestoneNote = document.createElement("em");
      milestoneNote.textContent = t("masteryMilestone", { coins: progress.masteryCoins });
      mastery.appendChild(milestoneNote);
    }
    nodes.resultText.appendChild(mastery);

    const encouragement = document.createElement("p");
    encouragement.className = "progress-message";
    encouragement.textContent = progress.improved ? t("progressNew") : t("progressSteady");
    nodes.resultText.appendChild(encouragement);

    const note = document.createElement("small");
    note.textContent = t("progressNote");
    nodes.resultText.appendChild(note);
  }

  function readDiamonds() {
    return window.WeightPlayWallet?.read?.().diamonds || 0;
  }

  function unitLevel(unitId) {
    return Math.max(1, Number(profile.levels[unitId]) || 1);
  }

  function isOwned(unitId) {
    return !!profile.owned[unitId];
  }

  function trainedUnit(unit) {
    return trainedUnitAtLevel(unit, unitLevel(unit.id));
  }

  function trainedUnitAtLevel(unit, level) {
    return {
      ...unit,
      level,
      hp: Math.round(unit.hp * (1 + (level - 1) * 0.18)),
      damage: Math.round(unit.damage * (1 + (level - 1) * 0.11)),
      cooldown: Math.max(520, Math.round(unit.cooldown * (1 - (level - 1) * 0.018))),
    };
  }

  function upgradeCost(unitId) {
    return Math.round(70 * Math.pow(1.42, unitLevel(unitId) - 1));
  }

  function upgradePreview(unit) {
    if (!isOwned(unit.id)) return t("unlockHint");
    const current = trainedUnit(unit);
    const next = trainedUnitAtLevel(unit, current.level + 1);
    const cooldownDelta = Math.max(0, current.cooldown - next.cooldown) / 1000;
    return `${t("nextLevel", { n: next.level })}: ${t("nextStats", {
      damage: next.damage - current.damage,
      hp: next.hp - current.hp,
      cooldown: cooldownDelta.toFixed(2).replace(/\.?0+$/u, ""),
    })}`;
  }

  function playSound(name) {
    window.WonderSound?.play?.(name);
  }

  function viewportBucket() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (width <= 480) return "phone";
    if (height < 520 && width > height) return "short-landscape";
    if (width <= 900 && height >= width) return "tablet-portrait";
    return "desktop-landscape";
  }

  function track(event, payload = {}) {
    try {
      window.WonderAnalytics?.track(event, {
        game_id: GAME_ID,
        game_version: GAME_VERSION,
        interface_version: INTERFACE_VERSION,
        locale: locale || document.documentElement.lang || "en",
        viewport_bucket: viewportBucket(),
        stage: currentStage + 1,
        ...payload,
      });
    } catch {
      // Analytics must never block a player action or alter battle state.
    }
  }

  function localizeStatic() {
    document.documentElement.lang = window.WonderI18n?.actualLocale?.() || locale;
    document.title = `${t("gameTitle")} - WeightPlay`;
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
    document.querySelectorAll("[data-ui-aria-label]").forEach((node) => {
      node.setAttribute("aria-label", t(node.dataset.uiAriaLabel));
    });
    const ariaLabels = {
      ".home-link": "backToLobby",
      "#localeSelect": "language",
      "#stageBackMainBtn": "back",
      ".wallet-row": "walletAria",
      "#beastGuide": "beastGuideAria",
      "#stageGrid": "stageListAria",
      "#kennelGrid": "animalUpgradesAria",
      "#shopGrid": "animalShopAria",
      "#menuTabs": "menuAria",
      ".fixed-game-shell": "gameScreenAria",
      ".resource-pill": "sunEnergyAria",
      ".base-pill": "homeHeartsAria",
      "#unitBar": "animalGuardsAria",
      "#yardBoard": "defenseLanesAria",
    };
    Object.entries(ariaLabels).forEach(([selector, key]) => {
      document.querySelector(selector)?.setAttribute("aria-label", t(key));
    });
    nodes.localeSelect.value = locale;
    renderWallet();
    renderTrainingBridge();
    renderMasterySummary();
  }

  function clearFloatingText() {
    document.querySelectorAll(".floating").forEach((bubble) => bubble.remove());
  }

  function showFloatingText(message) {
    clearFloatingText();
    const bubble = document.createElement("div");
    bubble.className = "floating";
    bubble.setAttribute("role", "status");
    bubble.setAttribute("aria-live", "polite");
    bubble.textContent = message;
    document.body.appendChild(bubble);
    window.setTimeout(() => bubble.remove(), 1200);
  }

  function showBoardText(message, x, y, variant = "") {
    const bubble = document.createElement("div");
    bubble.className = `board-pop ${variant}`.trim();
    bubble.textContent = message;
    bubble.style.left = `${x * 100}%`;
    bubble.style.top = `${y * 100}%`;
    nodes.yardBoard.appendChild(bubble);
    window.setTimeout(() => bubble.remove(), 900);
  }

  function cancelStageSettlement() {
    if (stageSettleFrame) cancelAnimationFrame(stageSettleFrame);
    stageSettleFrame = 0;
    nodes.stageGrid?.style.removeProperty("scroll-behavior");
    nodes.stageGrid?.style.removeProperty("scroll-snap-type");
    if (nodes.stageGrid) delete nodes.stageGrid.dataset.wpStageSettling;
  }

  const stageWindowLimit = () => Math.max(0, stages.length - STAGE_POOL_SIZE);
  const desiredStageWindow = (index) => clamp(index - Math.floor(STAGE_POOL_SIZE / 2), 0, stageWindowLimit());

  function createStageCard(poolIndex) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "stage-card";
    button.dataset.wpStagePoolNode = String(poolIndex + 1);
    return button;
  }

  function bindStageCard(button, index) {
    const stage = stages[index];
    if (!stage) return;
    const stageNo = index + 1;
    const locked = stageNo > unlocked;
    const active = index === stageBrowseIndex;
    const selected = index === clamp(Math.max(currentStage, unlocked - 1), 0, stages.length - 1);
    const progress = loadProgress();
    const records = typeof progress.stageRecords === "object" && progress.stageRecords ? progress.stageRecords : {};
    const record = typeof records[String(stageNo)] === "object" && records[String(stageNo)] ? records[String(stageNo)] : {};
    const cleared = Boolean(record.cleared) || stageNo <= (Number(readStorage(bestKey)) || 0);
    const perfect = Boolean(record.perfect);
    const bestScore = Number(record.bestScore) || 0;
    const progressMeta = locked
      ? `<div class="stage-progress"><em class="stage-lock">${t("locked")}</em></div>`
      : cleared || bestScore > 0
        ? `<div class="stage-progress">${cleared ? `<em>${t("stageCleared")}</em>` : ""}${perfect ? `<em class="perfect">${t("perfectBadge")}</em>` : ""}${bestScore > 0 ? `<small>${t("stageBest", { score: bestScore })}</small>` : ""}</div>`
        : "";
    const iconUnit = units[Math.min(index, units.length - 1)]?.id || "cat";
    button.dir = document.documentElement.dir || "ltr";
    const adjacent = index === stageBrowseIndex - 1 ? " is-prev" : index === stageBrowseIndex + 1 ? " is-next" : "";
    button.className = `stage-card${selected ? " selected" : ""}${active ? " is-centered" : ""}${adjacent}${locked ? " locked" : ""}${cleared ? " cleared" : ""}`;
    button.dataset.stageIndex = String(index);
    button.dataset.stageLabel = t("stage", { n: stageNo });
    button.setAttribute("aria-label", `${t("stage", { n: stageNo })}. ${stageCopy(stage, "title")}${locked ? `. ${t("locked")}` : ""}`);
    button.setAttribute("aria-disabled", String(locked));
    button.setAttribute("aria-current", String(active));
    button.setAttribute("aria-posinset", String(stageNo));
    button.setAttribute("aria-setsize", String(stages.length));
    button.setAttribute("aria-keyshortcuts", STAGE_NAV_SHORTCUTS);
    button.tabIndex = active ? 0 : -1;
    if (active && !locked) button.dataset.wpStageRecommended = "true";
    else delete button.dataset.wpStageRecommended;
    button.innerHTML = `<b class="stage-animal">${animalSprite(iconUnit)}</b><strong>${t("stage", { n: stageNo })}</strong><span>${stageCopy(stage, "title")}</span><small class="stage-plan">${stageCopy(stage, "plan")}</small>${progressMeta}${stageThreatPreview(stage)}`;
  }

  function buildStagePool() {
    nodes.stageGrid.dir = "ltr";
    nodes.stageGrid.replaceChildren();
    stageWindowStart = desiredStageWindow(stageBrowseIndex);
    stageCardPool = Array.from({ length: Math.min(STAGE_POOL_SIZE, stages.length) }, (_, offset) => {
      const button = createStageCard(offset);
      bindStageCard(button, stageWindowStart + offset);
      nodes.stageGrid.append(button);
      return button;
    });
    Object.assign(nodes.stageGrid.dataset, {
      wpStageVirtualized: "bounded-recycle",
      wpStagePoolSize: String(stageCardPool.length),
      wpStageTotal: String(stages.length),
      wpStageRecycleCount: "0",
      wpStageCenterObserver: "manual",
    });
  }

  function moveStageWindow(targetStart) {
    const target = clamp(targetStart, 0, stageWindowLimit());
    if (!stageCardPool.length || stageCardPool.some((card) => !card.isConnected)) buildStagePool();
    let recycled = 0;
    while (stageWindowStart < target) {
      const card = nodes.stageGrid.firstElementChild;
      const anchor = card?.nextElementSibling;
      const before = anchor?.getBoundingClientRect().left;
      stageWindowStart += 1;
      nodes.stageGrid.append(card);
      bindStageCard(card, stageWindowStart + stageCardPool.length - 1);
      const after = anchor?.getBoundingClientRect().left;
      if (Number.isFinite(before) && Number.isFinite(after)) nodes.stageGrid.scrollLeft += after - before;
      recycled += 1;
    }
    while (stageWindowStart > target) {
      const card = nodes.stageGrid.lastElementChild;
      const anchor = card?.previousElementSibling;
      const before = anchor?.getBoundingClientRect().left;
      stageWindowStart -= 1;
      nodes.stageGrid.prepend(card);
      bindStageCard(card, stageWindowStart);
      const after = anchor?.getBoundingClientRect().left;
      if (Number.isFinite(before) && Number.isFinite(after)) nodes.stageGrid.scrollLeft += after - before;
      recycled += 1;
    }
    stageCardPool = [...nodes.stageGrid.children];
    nodes.stageGrid.dataset.wpStageWindowStart = String(stageWindowStart + 1);
    nodes.stageGrid.dataset.wpStageWindowEnd = String(stageWindowStart + stageCardPool.length);
    if (recycled) nodes.stageGrid.dataset.wpStageRecycleCount = String(Number(nodes.stageGrid.dataset.wpStageRecycleCount || 0) + recycled);
  }

  function ensureStageWindow(index) {
    if (!stageCardPool.length || stageCardPool.some((card) => !card.isConnected)) buildStagePool();
    moveStageWindow(desiredStageWindow(index));
    stageCardPool.forEach((card) => bindStageCard(card, Number(card.dataset.stageIndex)));
  }

  function stageRailGeometry() {
    const first = stageCardPool[0]?.getBoundingClientRect();
    const second = stageCardPool[1]?.getBoundingClientRect();
    const rail = nodes.stageGrid.getBoundingClientRect();
    const delta = first && second ? (second.left + second.width / 2) - (first.left + first.width / 2) : 0;
    return { center: rail.left + rail.width / 2, pitch: Math.abs(delta) || 280, orientation: Math.sign(delta) || 1 };
  }

  function nearestStageCard() {
    const { center } = stageRailGeometry();
    return stageCardPool.reduce((nearest, card) => {
      const box = card.getBoundingClientRect();
      const distance = Math.abs(box.left + box.width / 2 - center);
      return !nearest || distance < nearest.distance ? { card, distance } : nearest;
    }, null)?.card || null;
  }

  function currentStageLogicalPosition() {
    const card = nearestStageCard();
    if (!card) return stageBrowseIndex;
    const box = card.getBoundingClientRect();
    const geometry = stageRailGeometry();
    return clamp(Number(card.dataset.stageIndex) + (geometry.center - (box.left + box.width / 2)) / (geometry.pitch * geometry.orientation), 0, stages.length - 1);
  }

  function positionStageRail(logicalPosition) {
    const logical = clamp(logicalPosition, 0, stages.length - 1);
    const anchorIndex = Math.round(logical);
    moveStageWindow(desiredStageWindow(anchorIndex));
    const card = nodes.stageGrid.querySelector(`[data-stage-index="${anchorIndex}"]`);
    if (card) {
      // scrollIntoView() on every pointermove causes a layout/scroll feedback
      // loop on the transformed Stage Canvas. Calculate the logical target
      // directly so drag updates stay within one frame and never jump.
      const rail = nodes.stageGrid;
      const railBox = rail.getBoundingClientRect();
      const cardBox = card.getBoundingClientRect();
      const coordinateScale = railBox.width > 0 ? rail.clientWidth / railBox.width : 1;
      const anchorScroll = rail.scrollLeft
        + ((cardBox.left + cardBox.width / 2) - (railBox.left + railBox.width / 2)) * coordinateScale;
      const fraction = logical - anchorIndex;
      const target = anchorScroll + fraction * stageRailGeometry().orientation * stageRailGeometry().pitch;
      const maximum = Math.max(0, rail.scrollWidth - rail.clientWidth);
      const immediateScroll = rail.dataset.wpStageDragDown !== "1" && rail.dataset.wpStageSettling !== "true";
      const previousBehavior = rail.style.getPropertyValue("scroll-behavior");
      const previousPriority = rail.style.getPropertyPriority("scroll-behavior");
      if (immediateScroll) rail.style.setProperty("scroll-behavior", "auto", "important");
      rail.scrollLeft = Math.max(0, Math.min(maximum, target));
      if (immediateScroll) {
        if (previousBehavior) rail.style.setProperty("scroll-behavior", previousBehavior, previousPriority);
        else rail.style.removeProperty("scroll-behavior");
      }
    }
    nodes.stageGrid.dataset.wpStageDragLogical = logical.toFixed(4);
    return logical;
  }

  function syncCenteredStageCard() {
    const nearest = nearestStageCard();
    const index = Number(nearest?.dataset.stageIndex);
    if (Number.isInteger(index)) stageBrowseIndex = index;
    stageCardPool.forEach((card) => bindStageCard(card, Number(card.dataset.stageIndex)));
    const stagePanel = document.querySelector("#stageTabPanel");
    if (stagePanel) {
      stagePanel.dataset.prevStageLabel = stageBrowseIndex > 0 ? t("stage", { n: stageBrowseIndex }) : "";
      stagePanel.dataset.nextStageLabel = stageBrowseIndex + 1 < stages.length ? t("stage", { n: stageBrowseIndex + 2 }) : "";
    }
    return nearest;
  }

  function settleStageRail(from, targetIndex, immediate = false) {
    cancelStageSettlement();
    const target = clamp(targetIndex, 0, stages.length - 1);
    stageBrowseIndex = target;
    if (immediate) {
      positionStageRail(target);
      // Chromium may defer the geometry update from scrollIntoView. Keyboard
      // navigation already owns an exact logical target, so commit that target
      // directly instead of letting pre-scroll geometry restore the old card.
      stageBrowseIndex = target;
      stageCardPool.forEach((card) => bindStageCard(card, Number(card.dataset.stageIndex)));
      const stagePanel = document.querySelector("#stageTabPanel");
      if (stagePanel) {
        stagePanel.dataset.prevStageLabel = target > 0 ? t("stage", { n: target }) : "";
        stagePanel.dataset.nextStageLabel = target + 1 < stages.length ? t("stage", { n: target + 2 }) : "";
      }
      return;
    }
    const started = performance.now();
    nodes.stageGrid.style.setProperty("scroll-behavior", "auto", "important");
    nodes.stageGrid.style.setProperty("scroll-snap-type", "none", "important");
    nodes.stageGrid.dataset.wpStageSettling = "true";
    const animate = (now) => {
      if (activeScene !== "stage") return cancelStageSettlement();
      const progress = clamp((now - started) / 340, 0, 1);
      const eased = progress * progress * (3 - 2 * progress);
      positionStageRail(from + (target - from) * eased);
      if (progress < 1) stageSettleFrame = requestAnimationFrame(animate);
      else {
        stageSettleFrame = 0;
        positionStageRail(target);
        syncCenteredStageCard();
        nodes.stageGrid.style.removeProperty("scroll-behavior");
        nodes.stageGrid.style.removeProperty("scroll-snap-type");
        delete nodes.stageGrid.dataset.wpStageSettling;
      }
    };
    stageSettleFrame = requestAnimationFrame(animate);
  }

  function rejectRepeatedScreenActivation(event) {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  function focusSelectedStage() {
    const card = nodes.stageGrid.querySelector('.stage-card[aria-current="true"]') || nodes.stageGrid.querySelector(".stage-card:not(.locked)");
    card?.focus({ preventScroll: true });
    settleStageRail(stageBrowseIndex, Number(card?.dataset.stageIndex) || 0, true);
  }

  function bindStageGridSelection() {
    if (nodes.stageGrid.dataset.selectionBound === "1") return;
    nodes.stageGrid.dataset.selectionBound = "1";
    nodes.stageGrid.addEventListener("dragstart", (event) => event.preventDefault());
    nodes.stageGrid.addEventListener("keydown", (event) => {
      const card = event.target.closest(".stage-card");
      if (!card || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      const currentIndex = Number(card.dataset.stageIndex);
      const rtl = document.documentElement.dir === "rtl";
      const nextIndex = event.key === "Home" ? 0
        : event.key === "End" ? stages.length - 1
          : clamp(currentIndex + (event.key === "ArrowRight" ? (rtl ? -1 : 1) : (rtl ? 1 : -1)), 0, stages.length - 1);
      event.stopImmediatePropagation();
      stageBrowseIndex = nextIndex;
      ensureStageWindow(nextIndex);
      const target = nodes.stageGrid.querySelector(`[data-stage-index="${nextIndex}"]`);
      if (!target) return;
      event.preventDefault();
      settleStageRail(currentStageLogicalPosition(), nextIndex, true);
      nodes.stageGrid.querySelector(`[data-stage-index="${nextIndex}"]`)?.focus({ preventScroll: true });
    });
    const recenterStagePool = () => {
      if (activeScene === "stage") requestAnimationFrame(() => settleStageRail(stageBrowseIndex, stageBrowseIndex, true));
    };
    window.addEventListener("resize", recenterStagePool, { passive: true });
    window.visualViewport?.addEventListener("resize", recenterStagePool, { passive: true });
    nodes.stageGrid.addEventListener("click", (event) => {
      const button = event.target.closest(".stage-card");
      if (!button || !nodes.stageGrid.contains(button)) return;
      const index = Number(button.dataset.stageIndex);
      if (!Number.isInteger(index)) return;
      if (index + 1 > unlocked) {
        showFloatingText(t("locked"));
        playSound("click");
        return;
      }
      startStage(index);
    });
    let pointerId = null;
    let startX = 0;
    let lastX = 0;
    let logical = 0;
    let moved = false;
    let suppressClick = false;
    let dragFrame = 0;
    let pendingDragLogical = 0;
    let previousScrollBehavior = "";
    let previousScrollBehaviorPriority = "";
    nodes.stageGrid.dataset.wpStageVirtualDrag = "true";
    nodes.stageGrid.addEventListener("pointerdown", (event) => {
      if (event.isPrimary === false || (event.button !== undefined && event.button !== 0)) return;
      cancelStageSettlement();
      if (dragFrame) cancelAnimationFrame(dragFrame);
      dragFrame = 0;
      pointerId = event.pointerId;
      startX = lastX = event.clientX;
      logical = currentStageLogicalPosition();
      pendingDragLogical = logical;
      moved = false;
      nodes.stageGrid.dataset.wpStageDragDown = "1";
      previousScrollBehavior = nodes.stageGrid.style.getPropertyValue("scroll-behavior");
      previousScrollBehaviorPriority = nodes.stageGrid.style.getPropertyPriority("scroll-behavior");
      nodes.stageGrid.style.setProperty("scroll-behavior", "auto", "important");
      nodes.stageGrid.style.setProperty("scroll-snap-type", "none", "important");
      event.stopImmediatePropagation();
    }, true);
    document.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;
      const delta = event.clientX - lastX;
      lastX = event.clientX;
      if (!moved && Math.abs(event.clientX - startX) > 4) moved = true;
      if (moved) {
        if (event.cancelable) event.preventDefault();
        logical = clamp(logical - delta / stageRailGeometry().pitch, 0, stages.length - 1);
        pendingDragLogical = logical;
        if (!dragFrame) {
          dragFrame = requestAnimationFrame(() => {
            dragFrame = 0;
            if (pointerId !== null) positionStageRail(pendingDragLogical);
          });
        }
      }
      event.stopImmediatePropagation();
    }, true);
    const finish = (event) => {
      if (pointerId === null || (event.pointerId !== undefined && event.pointerId !== pointerId)) return;
      pointerId = null;
      if (moved) {
        if (event.cancelable) event.preventDefault();
        if (dragFrame) cancelAnimationFrame(dragFrame);
        dragFrame = 0;
        positionStageRail(pendingDragLogical);
        logical = pendingDragLogical;
        settleStageRail(logical, Math.round(logical));
        suppressClick = true;
        setTimeout(() => { suppressClick = false; }, 0);
      } else {
        nodes.stageGrid.style.removeProperty("scroll-snap-type");
        if (previousScrollBehavior) nodes.stageGrid.style.setProperty("scroll-behavior", previousScrollBehavior, previousScrollBehaviorPriority);
        else nodes.stageGrid.style.removeProperty("scroll-behavior");
      }
      nodes.stageGrid.dataset.wpStageDragDown = "0";
      moved = false;
      event.stopImmediatePropagation();
    };
    document.addEventListener("pointerup", finish, true);
    document.addEventListener("pointercancel", finish, true);
    nodes.stageGrid.addEventListener("click", (event) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
  }

  function renderStageGrid() {
    stageBrowseIndex = clamp(Math.max(currentStage, unlocked - 1), 0, stages.length - 1);
    ensureStageWindow(stageBrowseIndex);
    bindStageGridSelection();
    const stageCardTop = Math.max(0, nodes.stageGrid.clientHeight * 0.38 - 95);
    nodes.stageGrid.style.setProperty("--guard-stage-card-top", `${stageCardTop}px`);
    window.requestAnimationFrame(() => settleStageRail(stageBrowseIndex, stageBrowseIndex, true));
  }

  function renderBeastGuide() {
    if (!nodes.beastGuide) return;
    const beasts = [
      ["normal", "threatNormal", "beastNormalDesc"],
      ["fast", "threatFast", "beastFastDesc"],
      ["shield", "threatShield", "beastShieldDesc"],
      ["healer", "threatHealer", "beastHealerDesc"],
      ["burrow", "threatBurrow", "beastBurrowDesc"],
      ["thief", "threatThief", "beastThiefDesc"],
      ["boss", "threatBoss", "beastBossDesc"],
    ];
    nodes.beastGuide.innerHTML = `
      <div class="beast-guide-head">
        <strong>${t("beastGuideTitle")}</strong>
        <span>${t("beastGuideHint")}</span>
      </div>
      <div class="beast-guide-list">
        ${beasts.map(([type, labelKey, descKey]) => `
          <article class="beast-guide-card">
            ${zombieSprite(type)}
            <div>
              <strong>${t(labelKey)}</strong>
              <span>${t(descKey)}</span>
            </div>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderWallet() {
    if (nodes.coinText) nodes.coinText.textContent = profile.coins;
    if (nodes.diamondText) nodes.diamondText.textContent = readDiamonds();
  }

  function renderTrainingBridge() {
    if (nodes.stageTrainingCue) nodes.stageTrainingCue.textContent = trainingBridge("menu");
    if (nodes.animalTrainingCue) nodes.animalTrainingCue.textContent = `${trainingBridge("menu")} ${trainingTargetLine()}`;
  }

  function renderMasterySummary() {
    if (!nodes.masterySummary) return;
    const progress = loadProgress();
    const stageRecords = typeof progress.stageRecords === "object" && progress.stageRecords ? progress.stageRecords : {};
    const medalCount = Object.values(stageRecords).filter((stageRecord) => stageRecord?.perfect).length;
    const nextMilestone = [...masteryMilestones.keys()].find((threshold) => threshold > medalCount);
    nodes.masterySummary.innerHTML = `
      <strong>${t("masteryTitle")}</strong>
      <span>${t("masteryProgress", { current: medalCount, total: stages.length })}</span>
      <small>${nextMilestone ? t("masteryNext", { count: nextMilestone }) : t("masteryComplete")}</small>
    `;
  }

  function animalSprite(unitId) {
    return `
      <span class="animal-sprite ${unitId}" aria-hidden="true">
        <img src="${spriteAssets[unitId] || spriteAssets.cat}" alt="" draggable="false" />
      </span>
    `;
  }

  function zombieSprite(type) {
    return `
      <span class="zombie-sprite ${type}" aria-hidden="true">
        <img src="${spriteAssets[type] || spriteAssets.normal}" alt="" draggable="false" />
      </span>
    `;
  }

  function stageThreatPreview(stage) {
    const types = [...new Set(stage.zombies.map((item) => item.type))];
    if (stage.boss) types.unshift(stage.boss.type);
    const icons = types.slice(0, 4).map((type) => {
      const label = stageThreatLabel(type);
      return `<span class="stage-threat" title="${label}">${zombieSprite(type)}<em>${label}</em></span>`;
    }).join("");
    return `<div class="stage-threats" aria-label="${t("threatPreview")}">${icons}</div>`;
  }

  function stageThreatLabel(type) {
    const key = {
      normal: "threatNormal",
      fast: "threatFast",
      shield: "threatShield",
      healer: "threatHealer",
      burrow: "threatBurrow",
      thief: "threatThief",
      bossRhino: "threatBoss",
      bossTortoise: "threatBoss",
      bossBadger: "threatBoss",
      bossBoar: "threatBoss",
      bossEagle: "threatBoss",
      bossElk: "threatBoss",
      boss: "threatBoss",
    }[type] || "threatNormal";
    return t(key);
  }

  function costToken(token, amount) {
    if (token === "coin") {
      return `<span class="cost-token"><img class="cost-icon" src="../../assets/coin.png" alt="" draggable="false" /><span>${amount}</span></span>`;
    }
    return `<span class="cost-token diamond-token" aria-label="${t("diamondToken")} ${amount}"><img class="cost-icon" src="${diamondIcon}" alt="" draggable="false" /><span>${amount}</span></span>`;
  }

  function renderKennel() {
    if (!nodes.kennelGrid) return;
    nodes.kennelGrid.innerHTML = "";
    units.forEach((unit) => {
      const trained = trainedUnit(unit);
      const owned = isOwned(unit.id);
      const card = document.createElement("div");
      card.className = `kennel-card ${owned ? "" : "locked"}`;
      const cost = owned ? upgradeCost(unit.id) : unit.unlockCost;
      const canBuy = owned ? profile.coins >= cost : readDiamonds() >= cost;
      const tokenType = owned ? "coin" : "diamond";
      const actionLabel = owned ? t("upgrade") : t("unlock");
      card.innerHTML = `
        <div class="kennel-animal">${animalSprite(unit.id)}</div>
        <div>
          <strong>${t(unit.nameKey)} <small>${t("level", { n: trained.level })}</small></strong>
          <span>${t(trained.roleKey)} / ATK ${trained.damage} / HP ${trained.hp} / ${t("sunToken").toUpperCase()} ${trained.cost}</span>
          <small class="unit-tactic">${t(`${unit.id}Tactic`)}</small>
          <em class="kennel-next">${upgradePreview(unit)}</em>
        </div>
        <button type="button" data-kennel-unit="${unit.id}" ${canBuy ? "" : "disabled"}>
          <span>${actionLabel}</span>
          <b>${costToken(tokenType, cost)}</b>
        </button>
      `;
      nodes.kennelGrid.appendChild(card);
    });
  }

  function renderShop() {
    if (!nodes.shopGrid) return;
    nodes.shopGrid.innerHTML = "";
    const shopUnits = units.filter((unit) => unit.unlockCost > 0);
    nodes.shopGrid.classList.toggle("is-single", shopUnits.length === 1);
    shopUnits.forEach((unit) => {
      const owned = isOwned(unit.id);
      const trained = trainedUnit(unit);
      const card = document.createElement("div");
      card.className = `shop-card ${owned ? "owned" : ""}`;
      card.innerHTML = `
        <div class="shop-hero">${animalSprite(unit.id)}</div>
        <div>
          <strong>${t(unit.nameKey)}</strong>
          <span>${t(trained.roleKey)} / ATK ${trained.damage} / HP ${trained.hp} / ${t("sunToken").toUpperCase()} ${trained.cost}</span>
          <small class="unit-tactic">${t(`${unit.id}Tactic`)}</small>
        </div>
        <button type="button" data-kennel-unit="${unit.id}" ${owned || readDiamonds() < unit.unlockCost ? "disabled" : ""}>
          ${owned ? t("owned") : `<span>${t("unlock")}</span><b>${costToken("diamond", unit.unlockCost)}</b>`}
        </button>
      `;
      nodes.shopGrid.appendChild(card);
    });
  }

  function showMenuTab(tab) {
    activeMenuTab = tab;
    document.querySelectorAll("[data-tab-panel]").forEach((panel) => {
      panel.classList.toggle("hidden", panel.dataset.tabPanel !== activeMenuTab);
    });
    nodes.menuTabs?.querySelectorAll("button[data-menu-tab]").forEach((button) => {
      button.classList.toggle("active", button.dataset.menuTab === activeMenuTab);
    });
    renderWallet();
    renderTrainingBridge();
    renderMasterySummary();
    renderBeastGuide();
    renderStageGrid();
    renderKennel();
    renderShop();
  }

  function showMenu() {
    clearFloatingText();
    lifecycleSuspended = false;
    running = false;
    paused = false;
    cancelAnimationFrame(raf);
    window.WeightPlayGame?.exitMobileGameMode?.();
    activateScene("stage");
    updateGuardYardViewport();
    if (nodes.spawnWarning) {
      nodes.spawnWarning.remove();
      nodes.spawnWarning = null;
    }
    clearIncomingLane();
    entities.forEach((entity) => entity.el?.remove?.());
    projectiles.forEach((projectile) => projectile.el?.remove?.());
    entities = [];
    projectiles = [];
    cells = [];
    nodes.gameShell.classList.remove("hidden");
    nodes.gameShell.inert = false;
    nodes.gameShell.removeAttribute("aria-hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.pausePanel.classList.add("hidden");
    showMenuTab(activeMenuTab);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      focusSelectedStage();
    });
  }

  function showMain() {
    clearFloatingText();
    lifecycleSuspended = false;
    running = false;
    paused = false;
    cancelAnimationFrame(raf);
    window.WeightPlayGame?.exitMobileGameMode?.();
    activateScene("main");
    updateGuardYardViewport();
    nodes.gameShell.classList.remove("hidden");
    nodes.gameShell.inert = false;
    nodes.gameShell.removeAttribute("aria-hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.pausePanel.classList.add("hidden");
    window.requestAnimationFrame(() => {
      nodes.startGameBtn?.focus({ preventScroll: true });
    });
  }

  function startStage(index) {
    clearFloatingText();
    lifecycleSuspended = false;
    foregroundPlacementBlocked = false;
    updateGuardYardViewport();
    currentStage = index;
    const stage = stages[currentStage];
    running = true;
    paused = false;
    energy = stage.energy;
    baseHp = stage.hp;
    spawned = 0;
    nextSpawnAt = 900;
    currentSpawnDelay = nextSpawnAt;
    nextSpawnPlan = makeSpawnPlan();
    nextSunAt = 1400;
    lastTick = performance.now();
    entities = [];
    projectiles = [];
    cells = [];
    coinsEarned = 0;
    guardPlacements = 0;
    waveCheckpoints = new Set();
    lastResultOutcome = "";
    lastBreachSnapshot = null;
    sessionHadBattle = true;
    lastDangerAt = 0;
    selectedUnit = units.find((unit) => isOwned(unit.id))?.id || units[0].id;
    activateScene("battle");
    nodes.gameShell.classList.remove("hidden");
    nodes.gameShell.inert = false;
    nodes.gameShell.removeAttribute("aria-hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.pausePanel.classList.add("hidden");
    updateGuardYardViewport();
    nodes.hintText.textContent = t("select");
    buildBoard(stage);
    renderUnits();
    updateHud();
    track("stage_start", { outcome: "started" });
    track("game_start", { level: index + 1 });
    playSound("start");
    window.WeightPlayGame?.exitMobileGameMode?.();
    raf = requestAnimationFrame(tick);
  }

  function suspendBattleLifecycle() {
    if (lifecycleSuspended || !running || paused) return;
    lifecycleSuspended = true;
    running = false;
    cancelAnimationFrame(raf);
  }

  function resumeBattleLifecycle() {
    if (!lifecycleSuspended || !windowFocused || !pageActive || document.hidden) return;
    lifecycleSuspended = false;
    if (paused || nodes.playPanel.classList.contains("hidden") || !nodes.resultPanel.classList.contains("hidden")) return;
    running = true;
    lastTick = performance.now();
    raf = requestAnimationFrame(tick);
  }

  function isPlacementAction(event) {
    return Boolean(event?.target?.closest?.(".cell"));
  }

  function rejectVisiblePlayerAction(event) {
    if (!document.hidden && isPlacementAction(event)) {
      nodes.hintText.textContent = foregroundPlacementMessage();
      if (!foregroundPlacementBlocked) track("placement_blocked_foreground");
      foregroundPlacementBlocked = true;
    }
    return false;
  }

  function markVisibleActionReclaimed(event) {
    if (!foregroundPlacementBlocked || !isPlacementAction(event)) return;
    foregroundPlacementBlocked = false;
    nodes.hintText.textContent = t("select");
    track("visible_action_reclaimed");
  }

  function reclaimVisiblePlayerAction(event) {
    if (document.hidden) return false;
    if (windowFocused && pageActive && !lifecycleSuspended) {
      markVisibleActionReclaimed(event);
      return true;
    }
    if (!event?.isTrusted) return rejectVisiblePlayerAction(event);
    // Some embedded browsers can leave a stale pagehide flag behind while the
    // same document is visibly interactive. A trusted action on that visible
    // document is stronger evidence than the stale lifecycle flag, so reclaim
    // both owners before allowing the player's intended target action.
    pageActive = true;
    windowFocused = true;
    resumeBattleLifecycle();
    if (lifecycleSuspended) return rejectVisiblePlayerAction(event);
    markVisibleActionReclaimed(event);
    return true;
  }

  function showPause() {
    if (!running || paused) return;
    running = false;
    paused = true;
    cancelAnimationFrame(raf);
    nodes.gameShell.inert = true;
    nodes.gameShell.setAttribute("aria-hidden", "true");
    nodes.pausePanel.classList.remove("hidden");
    window.requestAnimationFrame(() => nodes.resumeBtn.focus({ preventScroll: true }));
  }

  function resumeBattle() {
    if (!paused) return;
    paused = false;
    nodes.pausePanel.classList.add("hidden");
    nodes.gameShell.inert = false;
    nodes.gameShell.removeAttribute("aria-hidden");
    running = true;
    lastTick = performance.now();
    raf = requestAnimationFrame(tick);
    window.requestAnimationFrame(() => nodes.pauseBtn.focus({ preventScroll: true }));
  }

  function buildBoard(stage) {
    nodes.yardBoard.innerHTML = "";
    nodes.yardBoard.dataset.theme = stage.theme || "sunny";
    nodes.yardBoard.classList.remove("is-danger");
    nodes.yardBoard.style.setProperty("--grid-cols", stage.cols);
    nodes.yardBoard.style.setProperty("--grid-rows", stage.rows);
    boardRect = { width: nodes.yardBoard.clientWidth, height: nodes.yardBoard.clientHeight };
    nodes.dangerAlert = document.createElement("div");
    nodes.dangerAlert.id = "dangerAlert";
    nodes.dangerAlert.className = "danger-alert hidden";
    nodes.dangerAlert.setAttribute("aria-live", "polite");
    nodes.dangerAlert.textContent = t("danger");
    nodes.yardBoard.appendChild(nodes.dangerAlert);
    nodes.spawnWarning = document.createElement("div");
    nodes.spawnWarning.className = "spawn-warning hidden";
    nodes.spawnWarning.setAttribute("aria-hidden", "true");
    nodes.yardBoard.appendChild(nodes.spawnWarning);
    nodes.lanePressureAlert = document.createElement("div");
    nodes.lanePressureAlert.className = "lane-pressure-alert hidden";
    nodes.lanePressureAlert.setAttribute("role", "status");
    nodes.lanePressureAlert.setAttribute("aria-live", "polite");
    nodes.lanePressureAlert.setAttribute("aria-atomic", "true");
    nodes.yardBoard.appendChild(nodes.lanePressureAlert);
    for (let row = 0; row < stage.rows; row += 1) {
      for (let col = 0; col < stage.cols; col += 1) {
        const cell = document.createElement("button");
        cell.className = "cell";
        cell.type = "button";
        cell.style.left = `${(col / stage.cols) * 100}%`;
        cell.style.top = `${(row / stage.rows) * 100}%`;
        cell.style.width = `${100 / stage.cols}%`;
        cell.style.height = `${100 / stage.rows}%`;
        cell.addEventListener("click", () => placeUnit(row, col));
        nodes.yardBoard.appendChild(cell);
        cells.push({ row, col, button: cell, unit: null });
      }
    }
  }

  function renderUnits() {
    nodes.unitBar.innerHTML = "";
    units.filter((unit) => isOwned(unit.id)).forEach((unit) => {
      const trained = trainedUnit(unit);
      const button = document.createElement("button");
      button.className = "unit-card";
      button.type = "button";
      button.dataset.unitId = unit.id;
      button.setAttribute("aria-label", `${t(unit.nameKey)}: ${t(unit.roleKey)}. ${t(unit.abilityKey)}`);
      button.setAttribute("aria-pressed", String(unit.id === selectedUnit));
      if (unit.id === selectedUnit) button.classList.add("selected");
      if (energy < trained.cost) button.classList.add("disabled");
      button.innerHTML = `
        <span class="mini-animal">${animalSprite(unit.id)}</span>
        <span class="unit-info">
          <strong>${t(unit.nameKey)}</strong>
          <b class="role-badge" title="${t(trained.abilityKey)}">${t(trained.roleKey)}</b>
          <small class="unit-stats">
            <span>${t("costShort")} ${trained.cost}</span>
            <span>${t("level", { n: trained.level })}</span>
          </small>
        </span>
      `;
      button.addEventListener("click", () => {
        const restoreFocus = document.activeElement === button;
        selectedUnit = unit.id;
        track("guard_selected");
        playSound("click");
        renderUnits();
        if (restoreFocus) {
          nodes.unitBar.querySelector(`[data-unit-id="${unit.id}"]`)?.focus({ preventScroll: true });
        }
      });
      nodes.unitBar.appendChild(button);
    });
  }

  function placeUnit(row, col) {
    if (!running) return;
    const cell = cells.find((item) => item.row === row && item.col === col);
    const baseUnit = units.find((item) => item.id === selectedUnit);
    if (!cell || !baseUnit) return;
    const unit = trainedUnit(baseUnit);
    if (!isOwned(unit.id)) {
      showFloatingText(t("noDiamonds"));
      playSound("error");
      return;
    }
    if (cell.unit) {
      showFloatingText(t("occupied"));
      playSound("error");
      return;
    }
    if (energy < unit.cost) {
      showFloatingText(t("noEnergy"));
      playSound("error");
      return;
    }
    energy -= unit.cost;
    const guard = {
      kind: "guard",
      id: unit.id,
      row,
      col,
      hp: unit.hp,
      maxHp: unit.hp,
      cooldown: 0,
      attackCount: 0,
      piercingShots: 0,
      data: unit,
      el: document.createElement("div"),
      hpEl: document.createElement("span"),
      reachEl: null,
      facing: "left",
    };
    guard.el.className = "actor";
    guard.el.innerHTML = animalSprite(unit.id);
    guard.hpEl.className = "hp-bar guard-hp";
    guard.hpEl.innerHTML = "<i></i>";
    if (unit.attackStyle === "cross") {
      const rowReach = unit.targetRows || 1;
      const startRow = Math.max(0, row - rowReach);
      const endRow = Math.min(stages[currentStage].rows - 1, row + rowReach);
      guard.reachEl = document.createElement("span");
      guard.reachEl.className = "cross-lane-reach";
      guard.reachEl.setAttribute("aria-hidden", "true");
      guard.reachEl.style.top = `${(startRow / stages[currentStage].rows) * 100}%`;
      guard.reachEl.style.height = `${((endRow - startRow + 1) / stages[currentStage].rows) * 100}%`;
      nodes.yardBoard.appendChild(guard.reachEl);
    }
    nodes.yardBoard.appendChild(guard.el);
    nodes.yardBoard.appendChild(guard.hpEl);
    cell.unit = guard;
    entities.push(guard);
    guardPlacements += 1;
    track("guard_placed", { placement_number: guardPlacements });
    if (guardPlacements === 1) {
      track("first_guard_placed");
      if (nodes.lanePressureAlert) {
        nodes.lanePressureAlert.textContent = lanePressureMessage();
        const pressureRow = Number(nextSpawnPlan?.row) || 0;
        nodes.lanePressureAlert.classList.toggle("is-low-lane", pressureRow < stages[currentStage].rows / 2);
        nodes.lanePressureAlert.classList.remove("hidden");
      }
    }
    updateEntityElement(guard);
    pulseClass(guard.el, "is-placed", 420);
    spawnImpact(cellCenterX(col), laneProjectileY(row), "place");
    updateHud();
    renderUnits();
    playSound("select");
  }

  function spawnZombie() {
    const stage = stages[currentStage];
    if (spawned >= stage.total) return;
    spawned += 1;
    const waveProgress = Math.round((spawned / stage.total) * 100);
    [25, 50, 75, 100].forEach((checkpoint) => {
      if (waveProgress < checkpoint || waveCheckpoints.has(checkpoint)) return;
      waveCheckpoints.add(checkpoint);
      track("wave_checkpoint", { checkpoint_percent: checkpoint, outcome: "in_progress" });
    });
    const plan = nextSpawnPlan || makeSpawnPlan(spawned);
    const data = plan?.data || stage.zombies[0];
    const row = Number.isInteger(plan?.row) ? plan.row : Math.floor(Math.random() * stage.rows);
    const zombie = {
      kind: "zombie",
      spawnNumber: spawned,
      type: data.type,
      isBoss: Boolean(data.isBoss),
      mechanic: data.mechanic || data.ability || "",
      row,
      x: 1.04,
      hp: data.hp,
      maxHp: data.hp,
      speed: data.speed / 100000,
      damage: data.damage,
      biteCooldown: 0,
      abilityCooldown: data.isBoss ? 2200 : data.ability === "heal" ? 3000 : data.ability === "burrow" ? 3600 : 0,
      bossRoarCooldown: data.isBoss ? 1800 : 0,
      shellClosed: false,
      rushMs: 0,
      warned: false,
      el: document.createElement("div"),
      hpEl: document.createElement("span"),
    };
    zombie.el.className = `zombie ${data.type}${data.isBoss ? " is-boss" : ""}`;
    zombie.el.innerHTML = zombieSprite(data.type);
    zombie.hpEl.className = "hp-bar zombie-hp";
    zombie.hpEl.innerHTML = "<i></i>";
    nodes.yardBoard.appendChild(zombie.el);
    nodes.yardBoard.appendChild(zombie.hpEl);
    updateEntityElement(zombie);
    zombie.el.classList.add("is-entering");
    window.setTimeout(() => zombie.el.classList.remove("is-entering"), 520);
    entities.push(zombie);
  }

  function spawnSun() {
    const stage = stages[currentStage];
    const drop = document.createElement("button");
    drop.className = "energy-drop";
    drop.type = "button";
    drop.textContent = "\u2600";
    drop.style.left = `${12 + Math.random() * 72}%`;
    drop.style.top = `${10 + Math.random() * 58}%`;
    const sunLife = Math.max(2600, 4600 - currentStage * 450);
    drop.style.setProperty("--sun-life", `${sunLife}ms`);
    drop.addEventListener("click", () => {
      energy += 35;
      drop.remove();
      updateHud();
      renderUnits();
      playSound("coin");
    }, { once: true });
    nodes.yardBoard.appendChild(drop);
    window.setTimeout(() => drop.remove(), sunLife);
    if (stage.total - spawned < 3) energy += 5;
  }

  function tick(now) {
    if (!running) return;
    updateGuardYardViewport();
    const dt = Math.min(48, now - lastTick);
    lastTick = now;
    nextSpawnAt -= dt;
    nextSunAt -= dt;
    if (nextSpawnAt <= 0) {
      spawnZombie();
      currentSpawnDelay = stages[currentStage].interval * (0.82 + Math.random() * 0.36);
      nextSpawnAt = currentSpawnDelay;
      nextSpawnPlan = makeSpawnPlan();
    }
    if (nextSunAt <= 0) {
      spawnSun();
      nextSunAt = 2500 + Math.random() * 1500;
    }
    updateGuards(dt);
    updateProjectiles(dt);
    updateZombies(dt);
    cleanupDead();
    updateHud();
    if (baseHp <= 0) return finish(false);
    const zombiesLeft = entities.some((item) => item.kind === "zombie") || spawned < stages[currentStage].total;
    if (!zombiesLeft) return finish(true);
    raf = requestAnimationFrame(tick);
  }

  function updateGuards(dt) {
    entities.filter((item) => item.kind === "guard").forEach((guard) => {
      const slowed = guard.roarSlowMs > 0;
      guard.roarSlowMs = Math.max(0, (guard.roarSlowMs || 0) - dt);
      guard.cooldown -= dt * (slowed ? 0.45 : 1);
      guard.el.classList.toggle("is-roar-slowed", guard.roarSlowMs > 0);
      const target = findTargetForGuard(guard);
      if (target) faceTarget(guard, target);
      if (target && guard.cooldown <= 0) {
        if (guard.data.attackStyle === "melee") {
          meleeAttack(guard, target);
        } else {
          shoot(guard, target);
        }
        guard.cooldown = guard.data.cooldown;
      }
      updateEntityElement(guard);
    });
  }

  function findTargetForGuard(guard) {
    const stage = stages[currentStage];
    const guardX = cellCenterX(guard.col, stage);
    const range = guard.data.range / stage.cols;
    const rangeStart = Math.max(-0.08, guardX - range);
    const rangeEnd = Math.min(1.08, guardX + range);
    const rowReach = guard.data.attackStyle === "cross" ? guard.data.targetRows || 1 : 0;
    return entities
      .filter((item) => (
        item.kind === "zombie"
        && Math.abs(item.row - guard.row) <= rowReach
        && item.x >= rangeStart
        && item.x <= rangeEnd
      ))
      .sort((a, b) => (
        Math.abs(a.row - guard.row) - Math.abs(b.row - guard.row)
        || Math.abs(a.x - guardX) - Math.abs(b.x - guardX)
      ))[0];
  }

  function findFoxSupportTarget(guard, primaryTarget) {
    const stage = stages[currentStage];
    const guardX = cellCenterX(guard.col, stage);
    const range = guard.data.range / stage.cols;
    const rangeStart = Math.max(-0.08, guardX - range);
    const rangeEnd = Math.min(1.08, guardX + range);
    const rowReach = guard.data.targetRows || 1;
    return entities
      .filter((item) => (
        item.kind === "zombie"
        && item !== primaryTarget
        && item.row !== primaryTarget.row
        && Math.abs(item.row - guard.row) <= rowReach
        && item.x >= rangeStart
        && item.x <= rangeEnd
      ))
      .sort((a, b) => Math.abs(a.x - guardX) - Math.abs(b.x - guardX))[0];
  }

  function faceTarget(guard, target) {
    const stage = stages[currentStage];
    const guardX = cellCenterX(guard.col, stage);
    guard.facing = target.x >= guardX ? "right" : "left";
    guard.el.classList.toggle("facing-right", guard.facing === "right");
  }

  function applyDamage(target, damage, impactType, impactY) {
    if (target.shellClosed) damage = Math.max(1, Math.round(damage * 0.22));
    target.hp -= damage;
    pulseClass(target.el, "is-hit");
    spawnImpact(target.x, impactY, impactType);
    showBoardText(`-${damage}`, target.x, Math.max(0.06, impactY - 0.08));
    if (target.hp <= 0 && !target.rewarded) {
      target.rewarded = true;
      const coinGain = target.isBoss ? 30 : target.type === "shield" ? 8 : target.type === "fast" ? 5 : 6;
      const energyGain = target.isBoss ? 24 : target.type === "shield" ? 9 : target.type === "fast" ? 6 : 5;
      coinsEarned += coinGain;
      energy += energyGain;
      showBoardText(`+${coinGain}`, target.x, impactY + 0.02, "coin-pop");
      showBoardText(`+${energyGain} ${t("sunToken")}`, target.x, Math.min(0.94, impactY + 0.1), "energy-pop");
      updateHud();
    }
    playSound("hit");
  }

  function meleeAttack(guard, target) {
    faceTarget(guard, target);
    pulseClass(guard.el, "is-shooting");
    const y = laneProjectileY(target.row);
    applyDamage(target, guard.data.damage, guard.id, y);
    if (guard.id === "dog") applySlow(target, 0.55, 950);
  }

  function shoot(guard, target) {
    faceTarget(guard, target);
    pulseClass(guard.el, "is-shooting");
    guard.attackCount += 1;
    guard.el.dataset.attackCount = String(guard.attackCount);
    const piercing = guard.id === "cat" && guard.attackCount % guard.data.pierceEvery === 0;
    if (piercing) {
      guard.piercingShots += 1;
      guard.el.dataset.piercingShots = String(guard.piercingShots);
      showBoardText(t("pierce"), cellCenterX(guard.col), laneProjectileY(guard.row) - 0.08, "pierce-pop");
    }
    spawnProjectile(guard, target, guard.data.damage, false, piercing);
    if (guard.id === "fox") {
      const supportTarget = findFoxSupportTarget(guard, target);
      if (supportTarget) spawnProjectile(guard, supportTarget, Math.max(1, Math.round(guard.data.damage * 0.6)), true);
    }
    playSound("shoot");
  }

  function spawnProjectile(guard, target, damage, isSupportShot = false, isPiercing = false) {
    const stage = stages[currentStage];
    const guardX = cellCenterX(guard.col, stage);
    const direction = target.x >= guardX ? 1 : -1;
    const laneY = laneProjectileY(target.row, stage);
    const projectile = {
      row: target.row,
      x: clamp(guardX + direction * 0.25 / stage.cols, -0.04, 1.04),
      y: laneY,
      vx: 0.00095 * direction,
      direction,
      damage,
      unitId: guard.id,
      target,
      remainingHits: isPiercing ? 2 : 1,
      hitTargets: new Set(),
      isPiercing,
      el: document.createElement("div"),
    };
    projectile.el.className = `projectile ${guard.id} ${isSupportShot ? "support-shot" : ""} ${isPiercing ? "piercing-shot" : ""} ${direction < 0 ? "left" : "right"}`;
    projectile.el.innerHTML = `<img src="${projectileAssets[guard.id] || projectileAssets.cat}" alt="" draggable="false" />`;
    nodes.yardBoard.appendChild(projectile.el);
    projectiles.push(projectile);
  }

  function applySlow(target, factor, duration) {
    if (!target || target.kind !== "zombie" || target.dead) return;
    target.slowMs = Math.max(Number(target.slowMs) || 0, duration);
    target.slowFactor = Math.min(Number(target.slowFactor) || 1, factor);
    target.el?.classList.add("is-slowed");
  }

  function updateProjectiles(dt) {
    projectiles.forEach((shot) => {
      const previousX = shot.x;
      shot.x += shot.vx * dt;
      const minX = Math.min(previousX, shot.x) - 0.012;
      const maxX = Math.max(previousX, shot.x) + 0.035;
      const hit = entities.find((item) => (
        item.kind === "zombie"
        && !item.dead
        && !shot.hitTargets.has(item)
        && item.row === shot.row
        && item.x >= minX
        && item.x <= maxX
      ));
      if (hit) {
        applyDamage(hit, shot.damage, shot.unitId, shot.y);
        if (shot.unitId === "owl") applySlow(hit, 0.72, 1250);
        shot.hitTargets.add(hit);
        shot.remainingHits -= 1;
        if (shot.isPiercing) {
          hit.catPiercedHits = (hit.catPiercedHits || 0) + 1;
          hit.el.dataset.catPiercedHits = String(hit.catPiercedHits);
          pulseClass(hit.el, "is-pierced", 520);
        }
        if (shot.remainingHits <= 0) shot.dead = true;
      }
      if (shot.x > 1.08 || shot.x < -0.08) shot.dead = true;
      shot.el.style.transform = `translate(${shot.x * boardRect.width}px, ${shot.y * boardRect.height}px) translate(-50%, -50%)`;
    });
    projectiles = projectiles.filter((shot) => {
      if (shot.dead) shot.el.remove();
      return !shot.dead;
    });
  }

  function updateZombies(dt) {
    entities.filter((item) => item.kind === "zombie").forEach((zombie) => {
      zombie.slowMs = Math.max(0, (Number(zombie.slowMs) || 0) - dt);
      if (zombie.slowMs <= 0) zombie.slowFactor = 1;
      zombie.el.classList.toggle("is-slowed", zombie.slowMs > 0);
      updateEnemyAbility(zombie, dt);
      if ((zombie.rushChargeMs || 0) > 0) {
        zombie.rushChargeMs = Math.max(0, zombie.rushChargeMs - dt);
        if (zombie.rushChargeMs === 0) {
          zombie.el.classList.remove("is-burrow-warning");
          zombie.rushMs = 1050;
          pulseClass(zombie.el, "is-rushing", 1050);
        }
      }
      const blocking = entities.find((item) => item.kind === "guard" && item.row === zombie.row && Math.abs(cellCenterX(item.col) - zombie.x) < 0.065);
      if (blocking) {
        zombie.biteCooldown -= dt;
        if (zombie.biteCooldown <= 0) {
          blocking.hp -= zombie.damage;
          zombie.biteCooldown = 940;
          pulseClass(zombie.el, "is-biting");
          pulseClass(blocking.el, "is-hit");
          spawnImpact(cellCenterX(blocking.col), laneProjectileY(blocking.row), "bite");
          playSound("hit");
        }
      } else {
        zombie.rushMs = Math.max(0, (zombie.rushMs || 0) - dt);
        zombie.x -= zombie.speed * dt * (zombie.slowFactor || 1) * (zombie.rushMs > 0 ? 2.35 : 1);
      }
      zombie.el.classList.toggle("near-home", zombie.x < 0.24);
      if (!zombie.warned && zombie.x < 0.26) {
        zombie.warned = true;
        showDanger(zombie.row);
      }
      if (zombie.x < -0.04) {
        zombie.dead = true;
        lastBreachSnapshot = {
          row: zombie.row,
          type: zombie.type,
          encounter: zombie.spawnNumber,
          total: stages[currentStage].total,
          energy,
          guards: guardPlacements,
        };
        baseHp -= 1;
        track("home_heart_lost", { remaining_hearts: Math.max(0, baseHp), outcome: "damage" });
        pulseDanger();
        playSound("error");
      }
      updateEntityElement(zombie);
    });
  }

  function updateEnemyAbility(zombie, dt) {
    if (zombie.dead) return;
    if (zombie.isBoss) return updateBossAbility(zombie, dt);
    if (zombie.mechanic === "heal") {
      zombie.abilityCooldown -= dt;
      if (zombie.abilityCooldown <= 0) {
        const target = entities
          .filter((item) => item.kind === "zombie" && item !== zombie && !item.dead && item.row === zombie.row && item.x < zombie.x && item.hp < item.maxHp)
          .sort((a, b) => b.x - a.x)[0];
        if (target) {
          target.hp = Math.min(target.maxHp, target.hp + Math.max(18, Math.round(target.maxHp * 0.12)));
          pulseClass(zombie.el, "is-casting", 520);
          showBoardText(t("healerPulse"), zombie.x, Math.max(0.08, laneProjectileY(zombie.row) - 0.1), "heal-pop");
        }
        zombie.abilityCooldown = 3400;
      }
    } else if (zombie.mechanic === "burrow") {
      zombie.abilityCooldown -= dt;
      if (zombie.abilityCooldown < 700 && !zombie.burrowWarned) {
        zombie.burrowWarned = true;
        pulseClass(zombie.el, "is-burrow-warning", 650);
      }
      if (zombie.abilityCooldown <= 0) {
        const direction = zombie.row === 0 ? 1 : zombie.row === stages[currentStage].rows - 1 ? -1 : (Math.random() < 0.5 ? -1 : 1);
        zombie.row = clamp(zombie.row + direction, 0, stages[currentStage].rows - 1);
        zombie.burrowWarned = false;
        zombie.abilityCooldown = 4400;
        pulseClass(zombie.el, "is-entering", 480);
      }
    } else if (zombie.mechanic === "steal" && !zombie.stoleSun && zombie.x < 0.72) {
      zombie.stoleSun = true;
      energy = Math.max(0, energy - 12);
      pulseClass(zombie.el, "is-casting", 520);
      showBoardText(t("thiefPulse"), zombie.x, Math.max(0.08, laneProjectileY(zombie.row) - 0.1), "thief-pop");
    }
  }

  function updateBossAbility(zombie, dt) {
    if (zombie.mechanic === "roar") return updateBossRoar(zombie, dt);
    zombie.abilityCooldown -= dt;
    if (zombie.abilityCooldown > 0 || zombie.x <= 0.1) return;
    if (zombie.mechanic === "shell") {
      zombie.shellClosed = !zombie.shellClosed;
      zombie.el.classList.toggle("is-shell-closed", zombie.shellClosed);
      showBoardText(t(zombie.shellClosed ? "bossShell" : "bossShellOpen"), zombie.x, Math.max(0.08, laneProjectileY(zombie.row) - 0.12), "roar-pop");
      zombie.abilityCooldown = zombie.shellClosed ? 1900 : 2700;
      return;
    }
    if (zombie.mechanic === "burrow") {
      showBoardText(t("bossBurrow"), zombie.x, Math.max(0.08, laneProjectileY(zombie.row) - 0.12), "roar-pop");
      zombie.row = (zombie.row + (zombie.row >= 3 ? -2 : 2)) % stages[currentStage].rows;
      pulseClass(zombie.el, "is-entering", 520);
      zombie.abilityCooldown = 4200;
      return;
    }
    if (zombie.mechanic === "rush") {
      showBoardText(t("bossRush"), zombie.x, Math.max(0.08, laneProjectileY(zombie.row) - 0.12), "roar-pop");
      zombie.rushChargeMs = 700;
      zombie.el.classList.add("is-burrow-warning");
      zombie.abilityCooldown = 5000;
      return;
    }
    const guards = entities.filter((item) => item.kind === "guard" && !item.dead && (zombie.mechanic === "moon" || Math.abs(item.row - zombie.row) <= 1));
    guards.forEach((guard) => {
      guard.cooldown += zombie.mechanic === "moon" ? 1150 : 850;
      guard.roarSlowMs = Math.max(guard.roarSlowMs || 0, zombie.mechanic === "moon" ? 1400 : 700);
      pulseClass(guard.el, "is-roar-hit", 520);
    });
    if (zombie.mechanic === "moon") zombie.hp = Math.min(zombie.maxHp, zombie.hp + Math.round(zombie.maxHp * 0.045));
    showBoardText(t(zombie.mechanic === "moon" ? "bossMoon" : "bossGale"), zombie.x, Math.max(0.08, laneProjectileY(zombie.row) - 0.12), "roar-pop");
    pulseClass(zombie.el, "is-roaring", 620);
    zombie.abilityCooldown = zombie.mechanic === "moon" ? 5200 : 4600;
  }

  function updateBossRoar(zombie, dt) {
    zombie.bossRoarCooldown -= dt;
    if (zombie.bossRoarCooldown > 0 || zombie.x <= 0.1 || zombie.dead) return;
    const sameLaneGuards = entities.filter((item) => item.kind === "guard" && item.row === zombie.row && !item.dead);
    sameLaneGuards.forEach((guard) => {
      guard.roarSlowMs = Math.max(guard.roarSlowMs || 0, 2200);
      pulseClass(guard.el, "is-roar-hit", 520);
    });
    pulseClass(zombie.el, "is-roaring", 620);
    spawnImpact(Math.max(0.12, zombie.x - 0.04), laneProjectileY(zombie.row), "roar");
    showBoardText(t("bossRoar"), Math.max(0.18, zombie.x - 0.04), Math.max(0.1, laneProjectileY(zombie.row) - 0.12), "roar-pop");
    zombie.bossRoarCooldown = 5200;
  }

  function cleanupDead() {
    entities.forEach((entity) => {
      if (entity.hp <= 0) entity.dead = true;
      if (entity.dead) {
        entity.el.remove();
        entity.hpEl?.remove();
        entity.reachEl?.remove();
        if (entity.kind === "guard") {
          const cell = cells.find((item) => item.unit === entity);
          if (cell) cell.unit = null;
        }
      }
    });
    entities = entities.filter((entity) => !entity.dead);
  }

  function updateEntityElement(entity) {
    const stage = stages[currentStage];
    if (entity.kind === "guard") {
      const x = cellCenterX(entity.col, stage) * boardRect.width;
      const y = laneCenterY(entity.row, stage) * boardRect.height;
      entity.el.style.setProperty("--actor-x", `${x}px`);
      entity.el.style.setProperty("--actor-y", `${y}px`);
      entity.el.style.transform = "translate(var(--actor-x), var(--actor-y)) translate(-50%, -50%)";
      updateHpBar(entity, x, y + (boardRect.height / stage.rows) * 0.35);
    } else {
      const y = laneCenterY(entity.row, stage) * boardRect.height;
      entity.el.style.setProperty("--actor-x", `${entity.x * boardRect.width}px`);
      entity.el.style.setProperty("--actor-y", `${y}px`);
      entity.el.style.transform = "translate(var(--actor-x), var(--actor-y)) translate(-50%, -50%)";
      updateHpBar(entity, entity.x * boardRect.width, y + (boardRect.height / stage.rows) * 0.36);
    }
  }

  function updateHpBar(entity, x, y) {
    if (!entity.hpEl) return;
    entity.hpEl.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    entity.hpEl.querySelector("i").style.width = `${clamp((entity.hp / entity.maxHp) * 100, 0, 100)}%`;
  }

  function cellCenterX(col, stage = stages[currentStage]) {
    return (col + 0.5) / stage.cols;
  }

  function laneCenterY(row, stage = stages[currentStage]) {
    return (row + 0.44) / stage.rows;
  }

  function laneProjectileY(row, stage = stages[currentStage]) {
    return (row + 0.44) / stage.rows;
  }

  function pulseClass(element, className, duration = 260) {
    if (!element) return;
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
    window.setTimeout(() => element.classList.remove(className), duration);
  }

  function spawnImpact(x, y, type) {
    const spark = document.createElement("div");
    spark.className = `impact ${type || "hit"}`;
    spark.style.left = `${x * 100}%`;
    spark.style.top = `${y * 100}%`;
    nodes.yardBoard.appendChild(spark);
    window.setTimeout(() => spark.remove(), 420);
  }

  function showDanger(row) {
    const now = performance.now();
    pulseDanger();
    if (now - lastDangerAt > 1100) {
      lastDangerAt = now;
      showBoardText(t("danger"), 0.22, Math.max(0.08, laneProjectileY(row) - 0.08));
      playSound("error");
    }
  }

  function pulseDanger() {
    nodes.yardBoard.classList.add("is-danger");
    if (nodes.dangerAlert) {
      nodes.dangerAlert.textContent = t("danger");
      nodes.dangerAlert.classList.remove("hidden");
    }
    window.setTimeout(() => {
      nodes.yardBoard.classList.remove("is-danger");
      nodes.dangerAlert?.classList.add("hidden");
    }, 900);
  }

  function updateHud() {
    const left = Math.max(0, stages[currentStage].total - spawned + entities.filter((item) => item.kind === "zombie").length);
    nodes.energyText.textContent = Math.floor(energy);
    nodes.baseText.textContent = Math.max(0, baseHp);
    nodes.waveText.textContent = t("wave", { n: currentStage + 1, left });
    updateWaveTimer(left);
    renderWallet();
  }

  function makeSpawnPlan(nextSpawnNumber = spawned + 1) {
    const stage = stages[currentStage];
    if (!stage || nextSpawnNumber > stage.total) return null;
    const scripted = Array.isArray(stage.planRows) && stage.planRows.length > 0
      ? { row: stage.planRows[(nextSpawnNumber - 1) % stage.planRows.length] }
      : null;
    const data = stage.boss && nextSpawnNumber === stage.total
      ? stage.boss
      : findStageEnemy(stage, scripted?.type) || stage.zombies[Math.floor(Math.random() * stage.zombies.length)];
    return {
      data,
      row: Number.isInteger(scripted?.row) ? clamp(scripted.row, 0, stage.rows - 1) : Math.floor(Math.random() * stage.rows),
    };
  }

  function findStageEnemy(stage, type) {
    if (!type) return null;
    return stage.zombies.find((item) => item.type === type) || null;
  }

  function updateWaveTimer(left) {
    nodes.waveTimer?.classList.add("hidden");
    updateSpawnWarning(left);
  }

  function updateSpawnWarning(left) {
    if (!nodes.spawnWarning) return;
    const remainingSpawns = Math.max(0, stages[currentStage].total - spawned);
    const shouldShow = running && left > 0 && remainingSpawns > 0 && nextSpawnPlan;
    nodes.spawnWarning.classList.toggle("hidden", !shouldShow);
    if (!shouldShow) {
      clearIncomingLane();
      return;
    }
    const remaining = clamp(nextSpawnAt / Math.max(1, currentSpawnDelay), 0, 1);
    nodes.spawnWarning.style.left = "calc(100% - (100% / var(--grid-cols)) * 0.5)";
    nodes.spawnWarning.style.top = `${laneCenterY(nextSpawnPlan.row) * 100}%`;
    nodes.spawnWarning.style.setProperty("--spawn-left", `${Math.round(remaining * 100)}%`);
    nodes.spawnWarning.classList.toggle("is-hot", remaining < 0.28);
    syncIncomingLane(nextSpawnPlan.row, remaining);
    const src = spriteAssets[nextSpawnPlan.data.type] || spriteAssets.normal;
    const seconds = Math.max(1, Math.ceil(nextSpawnAt / 1000));
    nodes.spawnWarning.innerHTML = `<img src="${src}" alt="" draggable="false" /><b>${seconds}</b>`;
  }

  function syncIncomingLane(row, remaining) {
    const hot = remaining < 0.28;
    const opacity = (0.18 + (1 - remaining) * 0.34).toFixed(2);
    cells.forEach((cell) => {
      const isIncoming = cell.row === row;
      cell.button.classList.toggle("incoming-lane", isIncoming);
      cell.button.classList.toggle("incoming-lane-hot", isIncoming && hot);
      if (isIncoming) {
        cell.button.style.setProperty("--incoming-opacity", opacity);
      } else {
        cell.button.style.removeProperty("--incoming-opacity");
      }
    });
  }

  function clearIncomingLane() {
    cells.forEach((cell) => {
      cell.button.classList.remove("incoming-lane", "incoming-lane-hot");
      cell.button.style.removeProperty("--incoming-opacity");
    });
  }

  function finish(won) {
    lifecycleSuspended = false;
    running = false;
    cancelAnimationFrame(raf);
    let resultMessage = "";
    let finalScore = 0;
    let perfect = false;
    if (won) {
      perfect = baseHp >= stages[currentStage].hp;
      const perfectBonus = perfect ? 20 + currentStage * 8 : 0;
      const clearBonus = 18 + currentStage * 10 + Math.max(0, baseHp) * 4;
      coinsEarned += clearBonus + perfectBonus;
      unlocked = Math.max(unlocked, Math.min(stages.length, currentStage + 2));
      writeStorage(unlockKey, String(unlocked));
      const best = Math.max(Number(readStorage(bestKey)) || 0, currentStage + 1);
      writeStorage(bestKey, String(best));
      nodes.resultTitle.textContent = t("victory");
      resultMessage = `${t("resultWin", { n: currentStage + 1, hp: Math.max(0, baseHp) })} ${t("reward", { coins: coinsEarned })}`;
      if (perfectBonus > 0) resultMessage = `${t("perfectClear")} ${resultMessage} ${t("perfectBonus", { coins: perfectBonus })}`;
      playSound("win");
    } else {
      nodes.resultTitle.textContent = t("defeat");
      resultMessage = `${t("resultLose")} ${t("reward", { coins: coinsEarned })}`;
      playSound("lose");
    }
    finalScore = (currentStage + 1) * 60 + Math.max(0, baseHp) * 8 + coinsEarned + (won ? 80 : 0);
    const progress = saveProgress(finalScore, won, perfect);
    if (progress.masteryCoins > 0) {
      coinsEarned += progress.masteryCoins;
      resultMessage = `${resultMessage} ${t("masteryMilestone", { coins: progress.masteryCoins })}`;
    }
    renderResultReport(resultMessage, progress, won, defeatRecapMessage(lastBreachSnapshot));
    lastResultOutcome = won ? "win" : "loss";
    track("stage_result", {
      outcome: lastResultOutcome,
      remaining_hearts: Math.max(0, baseHp),
      score: finalScore,
    });
    track("coin_reward", {
      outcome: lastResultOutcome,
      amount: Math.max(0, Math.round(coinsEarned)),
    });
    track(won ? "game_complete" : "game_over", {
      level: currentStage + 1,
      hp: baseHp,
      score: finalScore,
      best_score: progress.bestScore,
      improvement_percent: progress.improvementPercent,
    });
    if (coinsEarned > 0) {
      profile.coins += coinsEarned;
      saveProfile();
    }
    const canContinue = won && currentStage < stages.length - 1;
    const primaryResultAction = canContinue
      ? nodes.nextStageBtn
      : won
        ? nodes.resultStagesBtn
        : nodes.retryBtn;
    nodes.nextStageBtn.classList.remove("hidden");
    nodes.nextStageBtn.disabled = !canContinue;
    nodes.nextStageBtn.setAttribute("aria-disabled", String(!canContinue));
    [nodes.nextStageBtn, nodes.retryBtn, nodes.resultStagesBtn].forEach((action) => {
      action.classList.toggle("result-primary", action === primaryResultAction);
    });
    resultActionClaimed = false;
    document.documentElement.classList.add("guard-yard-playing");
    document.body.classList.add("guard-yard-playing");
    nodes.playPanel.classList.remove("hidden");
    nodes.gameShell.classList.add("hidden");
    nodes.gameShell.inert = true;
    nodes.resultPanel.classList.remove("hidden");
    primaryResultAction.focus({ preventScroll: true });
    renderWallet();
    renderKennel();
  }

  function claimResultAction() {
    if (nodes.resultPanel.classList.contains("hidden") || resultActionClaimed) return false;
    resultActionClaimed = true;
    return true;
  }

  function trackResultAction(action) {
    track("result_action", { action, outcome: lastResultOutcome || "unknown" });
    if (action === "retry") track("retry", { outcome: lastResultOutcome || "unknown" });
    if (action === "next") track("next_stage", { outcome: "continued" });
    if (action === "return") track("stage_return", { outcome: lastResultOutcome || "unknown" });
  }

  function returnToMain() {
    if (sessionHadBattle) {
      track("return_session", { outcome: "returned" });
      sessionHadBattle = false;
    }
    showMain();
  }

  function restoreKennelActionFocus(unitId, ownerGrid) {
    window.requestAnimationFrame(() => {
      const sameAction = ownerGrid?.querySelector(
        `button[data-kennel-unit="${unitId}"]:not(:disabled)`
      );
      const fallbackAction = ownerGrid?.querySelector("button[data-kennel-unit]:not(:disabled)");
      const ownerTab = nodes.menuTabs?.querySelector(
        `[data-menu-tab="${ownerGrid === nodes.shopGrid ? "shop" : "animals"}"]`
      );
      (sameAction || fallbackAction || ownerTab)?.focus({ preventScroll: true });
    });
  }

  function handleKennelAction(unitId, ownerGrid) {
    const unit = units.find((item) => item.id === unitId);
    if (!unit) return;
    if (!isOwned(unitId)) {
      if (!window.WeightPlayWallet?.spendDiamonds?.(unit.unlockCost)) {
        showFloatingText(t("noDiamonds"));
        playSound("error");
        return;
      }
      profile.owned[unitId] = true;
      saveProfile();
      showFloatingText(`${t(unit.nameKey)} ${t("owned")}`);
      playSound("win");
    } else {
      const cost = upgradeCost(unitId);
      if (profile.coins < cost) {
        showFloatingText(t("noCoins"));
        playSound("error");
        return;
      }
      profile.coins -= cost;
      profile.levels[unitId] = unitLevel(unitId) + 1;
      saveProfile();
      track("upgrade_purchase", {
        unit_id: unit.id,
        level: unitLevel(unitId),
      });
      showFloatingText(`${t(unit.nameKey)} ${t("level", { n: unitLevel(unitId) })}`);
      playSound("coin");
    }
    renderWallet();
    renderTrainingBridge();
    renderKennel();
    renderShop();
    renderUnits();
    restoreKennelActionFocus(unitId, ownerGrid);
  }

  function initLoading() {
    const assets = [
      "../../assets/animal-guard-yard-poster.webp",
      ...Object.values(spriteAssets),
      "../../assets/menu-battle.png",
      "../../assets/menu-character.png",
      "../../assets/upgrade-coin.png",
      "../../assets/coin.png",
      diamondIcon,
      heartIcon,
      impactFxAsset,
    ];
    let loaded = 0;
    const update = () => {
      const pct = Math.min(100, Math.round((loaded / assets.length) * 100));
      nodes.loadingText.textContent = `${pct}%`;
      nodes.loadingFill.style.width = `${pct}%`;
      if (pct >= 100) {
        nodes.loadingPanel.classList.add("hidden");
        track("game_ready");
      }
    };
    assets.forEach((src) => {
      const image = new Image();
      image.onload = image.onerror = () => {
        loaded += 1;
        update();
      };
      image.src = src;
    });
    update();
  }

  nodes.localeSelect.addEventListener("change", () => {
    const requested = nodes.localeSelect.value;
    window.WonderI18n?.setLocale?.(requested);
    locale = window.WonderI18n?.actualLocale?.() || window.WonderI18n?.locale?.() || requested;
    writeStorage(localeKey, requested);
    localizeStatic();
    renderStageGrid();
    renderKennel();
    renderUnits();
    updateHud();
  });
  nodes.kennelGrid?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-kennel-unit]");
    if (!button) return;
    handleKennelAction(button.dataset.kennelUnit, nodes.kennelGrid);
  });
  nodes.shopGrid?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-kennel-unit]");
    if (!button) return;
    handleKennelAction(button.dataset.kennelUnit, nodes.shopGrid);
  });
  nodes.menuTabs?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-menu-tab]");
    if (!button) return;
    showMenuTab(button.dataset.menuTab);
    if (button.dataset.menuTab === "animals") {
      track("animals_open", { action: "open" });
      track("upgrade_view", { unit_count: units.length });
    }
    playSound("click");
  });
  nodes.playPanel.addEventListener("click", (event) => {
    if (reclaimVisiblePlayerAction(event)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
  nodes.startGameBtn?.addEventListener("keydown", rejectRepeatedScreenActivation, true);
  nodes.stageGrid.addEventListener("keydown", rejectRepeatedScreenActivation, true);
  nodes.kennelGrid?.addEventListener("keydown", rejectRepeatedScreenActivation, true);
  nodes.shopGrid?.addEventListener("keydown", rejectRepeatedScreenActivation, true);
  nodes.startGameBtn?.addEventListener("click", () => showMenu());
  nodes.stageBackMainBtn?.addEventListener("click", returnToMain);
  nodes.backToStagesBtn.addEventListener("click", showPause);
  nodes.pauseBtn.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
  });
  nodes.pauseBtn.addEventListener("click", showPause);
  nodes.resumeBtn.addEventListener("click", resumeBattle);
  nodes.leaveBattleBtn.addEventListener("click", () => {
    track("stage_return", { outcome: "abandoned" });
    showMenu();
  });
  nodes.pausePanel.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      return;
    }
    if (event.key === "Tab") {
      const actions = [nodes.resumeBtn, nodes.leaveBattleBtn].filter((button) => !button.disabled && button.getClientRects().length > 0);
      if (!actions.length) return;
      const index = actions.indexOf(document.activeElement);
      const nextIndex = event.shiftKey
        ? (index <= 0 ? actions.length - 1 : index - 1)
        : (index < 0 || index >= actions.length - 1 ? 0 : index + 1);
      event.preventDefault();
      actions[nextIndex].focus({ preventScroll: true });
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      resumeBattle();
    }
  });
  nodes.resultPanel.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
    }
  });
  nodes.resultStagesBtn.addEventListener("click", () => {
    if (!claimResultAction()) return;
    trackResultAction("return");
    showMenu();
  });
  nodes.retryBtn.addEventListener("click", () => {
    if (!claimResultAction()) return;
    trackResultAction("retry");
    startStage(currentStage);
  });
  nodes.nextStageBtn.addEventListener("click", () => {
    if (!claimResultAction()) return;
    trackResultAction("next");
    startStage(Math.min(currentStage + 1, stages.length - 1));
  });
  if (new URLSearchParams(location.search).has("test")) {
    window.__AnimalGuardYardTest = {
      finish,
      startStage,
      setLastBreachForTest: (snapshot = {}) => {
        lastBreachSnapshot = {
          row: snapshot.row ?? 0,
          type: snapshot.type || "normal",
          encounter: snapshot.encounter ?? 1,
          total: snapshot.total ?? stages[currentStage].total,
          energy: snapshot.energy ?? energy,
          guards: snapshot.guards ?? guardPlacements,
        };
      },
      spawnForTest: (count = 1) => {
        for (let index = 0; index < count; index += 1) spawnZombie();
        updateHud();
      },
      storageSnapshot: () => ({
        unlocked: Number(readStorage(unlockKey)) || 1,
        progress: JSON.parse(readStorage(progressKey) || "{}"),
        profile: JSON.parse(readStorage(profileKey) || "{}"),
      }),
      campaign: stages.map((stage, index) => ({
        stage: index + 1,
        title: stage.title.en,
        threats: stage.zombies.map((enemy) => enemy.type),
        boss: stage.boss ? { type: stage.boss.type, mechanic: stage.boss.mechanic, asset: spriteAssets[stage.boss.type] } : null,
      })),
    };
  }
  window.addEventListener("resize", () => {
    boardRect = { width: nodes.yardBoard.clientWidth, height: nodes.yardBoard.clientHeight };
    entities.forEach(updateEntityElement);
  });
  window.addEventListener("blur", () => {
    windowFocused = false;
    suspendBattleLifecycle();
  });
  window.addEventListener("focus", () => {
    windowFocused = true;
    resumeBattleLifecycle();
  });
  window.addEventListener("pagehide", () => {
    pageActive = false;
    suspendBattleLifecycle();
  });
  window.addEventListener("pageshow", () => {
    pageActive = true;
    resumeBattleLifecycle();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) suspendBattleLifecycle();
    else resumeBattleLifecycle();
  });

  localizeStatic();
  showMenuTab(activeMenuTab);
  showMain();
  initLoading();
})();
