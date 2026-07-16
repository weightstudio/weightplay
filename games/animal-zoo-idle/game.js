(() => {
  const GAME_ID = "animal-zoo-idle";
  const localeKey = "weightPlayLocale";
  const saveKey = "weightplay_animal_zoo_idle_save_v3";
  const oldSaveKeys = ["weightplay_animal_zoo_idle_save_v2", "weightplay_animal_zoo_idle_save_v1"];

  const ASSETS = {
    cover: "../../assets/animal-zoo-idle-cover.webp",
    stage: "../../assets/animal-zoo-idle-stage-bg.webp",
    lion: "../../assets/weightplay-boom-mane-lion.png",
    giraffe: "../../assets/animal-zoo-idle-giraffe.webp",
    elephant: "../../assets/animal-zoo-elephant.png",
    panda: "../../assets/animal-zoo-panda.png",
    penguin: "../../assets/animal-zoo-penguin.png",
    rabbit: "../../assets/tiny-weather-animal-rabbit.png",
    fox: "../../assets/tiny-weather-animal-fox.png",
    koala: "../../assets/tiny-weather-animal-koala.png",
    tiger: "../../assets/wonder-beast-tiger.png",
    rhino: "../../assets/wonder-beast-rhino.png",
    crocodile: "../../assets/wonder-beast-crocodile.png",
    bear: "../../assets/wonder-beast-bear.png",
    keeper: "../../assets/weightplay-character-gear-horn-rhino-cutout.webp",
    gate1: "../../assets/animal-zoo-gate-lv1.png",
    gate2: "../../assets/animal-zoo-gate-lv2.png",
    gate3: "../../assets/animal-zoo-gate-lv3.png",
    ticketBooth: "../../assets/animal-zoo-idle-ticket-booth.webp",
    visitorMimi: "../../assets/weightplay-character-rainbow-hop-mimi-clean-cutout.webp",
    visitorPanko: "../../assets/weightplay-character-drum-belly-panda-safe-face-cutout.webp",
    visitorOtter: "../../assets/weightplay-character-bubble-fin-otter-cutout.webp",
  };

  const animals = [
    { id: "lion", asset: ASSETS.lion, baseIncome: 3, cost: 0, care: 5, x: 17, y: 45, size: 20 },
    { id: "giraffe", asset: ASSETS.giraffe, baseIncome: 6, cost: 650, care: 7, x: 60, y: 42, size: 22 },
    { id: "elephant", asset: ASSETS.elephant, baseIncome: 11, cost: 2400, care: 9, x: 46, y: 36, size: 18 },
    { id: "panda", asset: ASSETS.panda, baseIncome: 16, cost: 8200, care: 10, x: 72, y: 31, size: 12 },
    { id: "penguin", asset: ASSETS.penguin, baseIncome: 23, cost: 24000, care: 11, x: 57, y: 25, size: 10 },
    { id: "rabbit", asset: ASSETS.rabbit, baseIncome: 7, cost: 1400, care: 8, x: 57, y: 43, size: 11 },
    { id: "fox", asset: ASSETS.fox, baseIncome: 14, cost: 5200, care: 10, x: 30, y: 29, size: 13 },
    { id: "koala", asset: ASSETS.koala, baseIncome: 20, cost: 15000, care: 11, x: 72, y: 27, size: 12 },
    { id: "tiger", asset: ASSETS.tiger, baseIncome: 34, cost: 46000, care: 12, x: 47, y: 48, size: 13 },
    { id: "rhino", asset: ASSETS.rhino, baseIncome: 46, cost: 98000, care: 13, x: 60, y: 19, size: 16 },
    { id: "crocodile", asset: ASSETS.crocodile, baseIncome: 58, cost: 210000, care: 14, x: 38, y: 22, size: 15 },
    { id: "bear", asset: ASSETS.bear, baseIncome: 74, cost: 460000, care: 16, x: 15, y: 25, size: 17 },
  ];

  const maxGateLevel = 8;
  const careCooldownMs = 30000;
  const layoutVersion = 8;
  const milestones = [
    { id: "collect500", type: "ticketCollected", target: 500, reward: 180 },
    { id: "care3", type: "careCount", target: 3, reward: 260 },
    { id: "gate3", type: "gateLevel", target: 3, reward: 420 },
    { id: "animals4", type: "animalCount", target: 4, reward: 900 },
    { id: "collect5000", type: "ticketCollected", target: 5000, reward: 1200 },
    { id: "care12", type: "careCount", target: 12, reward: 1600 },
    { id: "gate6", type: "gateLevel", target: 6, reward: 2400 },
    { id: "animals8", type: "animalCount", target: 8, reward: 4200 },
    { id: "collect25000", type: "ticketCollected", target: 25000, reward: 9000 },
    { id: "animals12", type: "animalCount", target: 12, reward: 12000 },
  ];
  const habitatBonuses = [
    { count: 1, bonus: 0 },
    { count: 3, bonus: 0.08 },
    { count: 6, bonus: 0.16 },
    { count: 9, bonus: 0.26 },
    { count: 12, bonus: 0.38 },
  ];
  const facilities = [
    { id: "snackStand", asset: ASSETS.ticketBooth, maxLevel: 4, baseCost: 1200, incomeBonus: 0.04, careBonus: 0, visitorBonus: 0, x: 23, y: 18, size: 12 },
    { id: "viewDeck", asset: ASSETS.gate2, maxLevel: 4, baseCost: 4200, incomeBonus: 0.06, careBonus: 1, visitorBonus: 1, x: 67, y: 17, size: 10 },
    { id: "keeperPost", asset: ASSETS.keeper, maxLevel: 4, baseCost: 12800, incomeBonus: 0.03, careBonus: 3, visitorBonus: 0, x: 78, y: 22, size: 7 },
  ];

  const visitorAssets = [ASSETS.visitorMimi, ASSETS.visitorPanko, ASSETS.visitorOtter];

  const text = {
    en: {
      title: "Animal Zoo Idle",
      language: "Language",
      backToLobby: "Back to WeightPlay lobby.",
      backToMenu: "Back to park menu.",
      safariPark: "Safari park",
      animalShop: "Animal shop",
      menuTitle: "Build a growing animal park.",
      menuHint: "Welcome visitors, collect tickets, upgrade the zoo gate, and recruit more animals to grow your park.",
      start: "Open Park",
      coins: "Coins",
      tickets: "Ticket Box",
      visitors: "Visitors",
      report: "Report",
      reportTitle: "Zoo Growth Report",
      animalAlbum: "Animal Album",
      animalAlbumProgress: "{count}/{total} animals welcomed",
      animalAlbumLocked: "Keep growing your park",
      animalAlbumIncome: "+{n}/10s tickets",
      skillFocus: "Focus",
      skillLogic: "Logic",
      skillAnimalKnowledge: "Animal Knowledge",
      continue: "Continue",
      loading: "Loading",
      collect: "Collect",
      careAll: "Care",
      upgradeGate: "Upgrade Gate",
      recruit: "Recruit",
      gate: "Gate Lv.{n}",
      income: "{n}/10s",
      happiness: "Happiness",
      animals: "Animals",
      offline: "Welcome back! Visitors left {coins} coins in the ticket box.",
      notEnough: "Need {coins} more coins.",
      noTickets: "The ticket box is still empty.",
      collected: "Collected {coins} coins.",
      cared: "Animals are happier. More visitors are coming.",
      careWait: "Care is resting for {n}s.",
      careRouteHabitat: "Tidy Habitat",
      careRouteHabitatHint: "+8 happiness",
      careRouteEnrichment: "Enrichment Time",
      careRouteEnrichmentHint: "+{tickets} tickets",
      careRouteCancel: "Back",
      careRouteHabitatDone: "The habitat is sparkling. Happiness +8.",
      careRouteEnrichmentDone: "The animals loved it. +{tickets} tickets.",
      upgraded: "The gate looks better. Ticket income increased!",
      recruited: "{name} joined the zoo!",
      maxGate: "Max Gate",
      buyAnimal: "Buy",
      owned: "Owned",
      incomeShort: "+{n}/10s",
      careShort: "Care +{n}",
      nextGoal: "Next Goal",
      nextGoalReady: "Ready to recruit",
      nextGoalNeed: "Need {coins} more",
      nextGoalAll: "All animals recruited",
      todayGoal: "Today",
      todayGoalReady: "Ready",
      todayGoalCollect: "Collect the ticket box",
      todayGoalCare: "Care for the animals",
      todayGoalBuild: "Build the next upgrade",
      todayGoalTour: "Claim the tour reward",
      todayGoalComplete: "Park tour complete",
      taskBoard: "Zoo Tasks",
      taskCollect: "Collect {coins} from the ticket box",
      taskCollectReady: "Ticket box is ready",
      taskCare: "Care for animals",
      taskCareReady: "Animals are ready",
      taskCareWait: "Care rests {n}s",
      taskGate: "Upgrade the gate",
      taskGateReady: "Gate upgrade is ready",
      taskGateMax: "Gate fully upgraded",
      milestones: "Park Milestones",
      claim: "Claim",
      claimed: "Claimed",
      milestoneReward: "+{coins} coins",
      milestoneCollect500: "Collect 500 total tickets",
      milestoneCare3: "Care for animals 3 times",
      milestoneGate3: "Upgrade the gate to Lv.3",
      milestoneAnimals4: "Recruit 4 animals",
      milestoneCollect5000: "Collect 5,000 total tickets",
      milestoneCare12: "Care for animals 12 times",
      milestoneGate6: "Upgrade the gate to Lv.6",
      milestoneAnimals8: "Recruit 8 animals",
      milestoneCollect25000: "Collect 25,000 total tickets",
      milestoneAnimals12: "Recruit every animal",
      milestoneClaimed: "Milestone reward claimed!",
      tourBoard: "Daily Park Tour",
      tourRound: "Tour {n}",
      tourReward: "Reward +{coins} coins",
      tourCollect: "Collect {coins} tickets",
      tourCare: "Care for animals {count} times",
      tourBuild: "Build or recruit {count} time",
      tourClaim: "Claim Tour",
      tourComplete: "Park tour complete!",
      tourReputation: "Park Reputation",
      tourReputationBonus: "Permanent ticket income +{n}%",
      parkPlan: "Park Growth Plan",
      parkRank: "Gate progress",
      nextUpgrade: "Next gate upgrade",
      nextUpgradeMax: "All gate upgrades complete",
      incomeBoost: "+{n}/10s after upgrade",
      buildFocus: "Next Build",
      buildUpgradeGateTitle: "Upgrade the entrance",
      buildUpgradeGateDesc: "Better gates bring more visitors and raise ticket income.",
      buildRecruitTitle: "Open a new habitat",
      buildRecruitDesc: "Recruit {name} to add a new animal area and grow the park.",
      buildHabitatTitle: "Unlock habitat bonus",
      buildHabitatDesc: "Recruit {count} animals to activate the next park-wide income bonus.",
      buildCompleteTitle: "Park plan complete",
      buildCompleteDesc: "All current animals and gate upgrades are built.",
      buildReady: "Ready now",
      buildNeed: "Need {coins} more",
      facilityBoard: "Park Facilities",
      facilityLevel: "Lv.{n}",
      facilityMax: "Max",
      facilityUpgrade: "Upgrade",
      facilitySnackStand: "Snack Stand",
      facilitySnackStandDesc: "Better snacks raise ticket income.",
      facilityViewDeck: "View Deck",
      facilityViewDeckDesc: "A nicer view brings more visitors.",
      facilityKeeperPost: "Keeper Post",
      facilityKeeperPostDesc: "Keeper tools make animal care stronger.",
      facilityIncomeBoost: "+{n}% tickets",
      facilityCareBoost: "+{n} care",
      facilityVisitorBoost: "+{n} visitor",
      facilityBuilt: "{name} upgraded!",
      habitatBonus: "Habitat Bonus",
      habitatBonusCurrent: "+{n}% ticket income",
      habitatBonusNext: "Recruit {count} animals for +{n}%",
      habitatBonusMax: "All habitat bonuses active",
      dragHint: "Drag animals in the meadow to arrange your zoo.",
      reportGood: "Great care! Your zoo is growing and the animals looked happy.",
      reportTry: "Good effort. Recruit animals and upgrade the gate to grow faster.",
      lion: "Lion",
      giraffe: "Giraffe",
      elephant: "Elephant",
      panda: "Panda",
      penguin: "Penguin",
      rabbit: "Rabbit",
      fox: "Fox",
      koala: "Koala",
      tiger: "Tiger",
      rhino: "Rhino",
      crocodile: "Crocodile",
      bear: "Bear",
    },
    "zh-Hant": {},
  };

  text["zh-Hant"] = {
    title: "\u52d5\u7269\u5c0f\u5c0f\u6a02\u5712",
    language: "\u8a9e\u8a00",
    backToLobby: "\u8fd4\u56de WeightPlay \u5927\u5ef3\u3002",
    backToMenu: "\u8fd4\u56de\u6a02\u5712\u9078\u55ae\u3002",
    safariPark: "\u91ce\u751f\u52d5\u7269\u6a02\u5712",
    animalShop: "\u52d5\u7269\u5546\u5e97",
    menuTitle: "\u5efa\u8a2d\u4e00\u5ea7\u6703\u6210\u9577\u7684\u52d5\u7269\u6a02\u5712\u3002",
    menuHint: "\u6b61\u8fce\u53c3\u89c0\u8005\u3001\u6536\u96c6\u9580\u7968\u6536\u5165\u3001\u5347\u7d1a\u5927\u9580\uff0c\u4e26\u62db\u52df\u66f4\u591a\u52d5\u7269\u4f86\u64f4\u5efa\u6a02\u5712\u3002",
    start: "\u958b\u5712",
    coins: "\u91d1\u5e63",
    tickets: "\u7968\u7bb1",
    visitors: "\u53c3\u89c0\u8005",
    report: "\u5831\u544a",
    reportTitle: "\u6a02\u5712\u6210\u9577\u5831\u544a",
    animalAlbum: "\u52d5\u7269\u5716\u9451",
    animalAlbumProgress: "\u5df2\u6b61\u8fce {count}/{total} \u96bb\u52d5\u7269",
    animalAlbumLocked: "\u6301\u7e8c\u58ef\u5927\u6a02\u5712",
    animalAlbumIncome: "+{n}/10\u79d2\u9580\u7968",
    continue: "\u7e7c\u7e8c",
    loading: "\u8f09\u5165\u4e2d",
    collect: "\u6536\u7968",
    careAll: "\u7167\u9867",
    upgradeGate: "\u5347\u7d1a\u5927\u9580",
    recruit: "\u62db\u52df",
    gate: "\u5927\u9580 Lv.{n}",
    income: "{n}/10\u79d2",
    happiness: "\u5feb\u6a02\u5ea6",
    animals: "\u52d5\u7269",
    offline: "\u6b61\u8fce\u56de\u4f86\uff01\u53c3\u89c0\u8005\u5728\u7968\u7bb1\u7559\u4e0b {coins} \u91d1\u5e63\u3002",
    notEnough: "\u9084\u5dee {coins} \u91d1\u5e63\u3002",
    noTickets: "\u7968\u7bb1\u9084\u662f\u7a7a\u7684\u3002",
    collected: "\u6536\u5230 {coins} \u91d1\u5e63\u3002",
    cared: "\u52d5\u7269\u5011\u66f4\u958b\u5fc3\u4e86\uff01",
    careWait: "\u7167\u9867\u9700\u8981\u4f11\u606f {n} \u79d2\u3002",
    careRouteHabitat: "\u6574\u7406\u68f2\u5730",
    careRouteHabitatHint: "\u5feb\u6a02\u5ea6 +8",
    careRouteEnrichment: "\u8c50\u5bcc\u6d3b\u52d5",
    careRouteEnrichmentHint: "+{tickets} \u9580\u7968",
    careRouteCancel: "\u8fd4\u56de",
    careRouteHabitatDone: "\u68f2\u5730\u6574\u9f4a\u4eae\u6676\u6676\uff0c\u5feb\u6a02\u5ea6 +8\u3002",
    careRouteEnrichmentDone: "\u52d5\u7269\u5011\u5f88\u559c\u6b61\uff0c\u9580\u7968 +{tickets}\u3002",
    upgraded: "\u5927\u9580\u8b8a\u66f4\u6f02\u4eae\uff0c\u9580\u7968\u6536\u5165\u63d0\u5347\u4e86\uff01",
    recruited: "{name} \u52a0\u5165\u6a02\u5712\uff01",
    maxGate: "\u5927\u9580\u5df2\u6eff\u7d1a",
    buyAnimal: "\u8cfc\u8cb7",
    owned: "\u5df2\u64c1\u6709",
    incomeShort: "+{n}/10\u79d2",
    careShort: "\u7167\u9867 +{n}",
    nextGoal: "\u4e0b\u4e00\u500b\u76ee\u6a19",
    nextGoalReady: "\u53ef\u4ee5\u62db\u52df",
    nextGoalNeed: "\u9084\u5dee {coins}",
    nextGoalAll: "\u6240\u6709\u52d5\u7269\u90fd\u52a0\u5165\u4e86",
    todayGoal: "\u4eca\u65e5\u76ee\u6a19",
    todayGoalReady: "\u53ef\u4ee5\u884c\u52d5",
    todayGoalCollect: "\u6536\u53d6\u7968\u7bb1",
    todayGoalCare: "\u7167\u9867\u52d5\u7269",
    todayGoalBuild: "\u5efa\u8a2d\u4e0b\u4e00\u500b\u5347\u7d1a",
    todayGoalTour: "\u9818\u53d6\u5de1\u8ff4\u734e\u52f5",
    todayGoalComplete: "\u5712\u5340\u5de1\u8ff4\u5b8c\u6210",
    taskBoard: "\u6a02\u5712\u4efb\u52d9",
    taskCollect: "\u6536\u96c6\u7968\u7bb1\u7684 {coins}",
    taskCollectReady: "\u53ef\u4ee5\u6536\u7968\u4e86",
    taskCare: "\u7167\u9867\u52d5\u7269",
    taskCareReady: "\u52d5\u7269\u5011\u6e96\u5099\u597d\u4e86",
    taskCareWait: "\u7167\u9867\u4f11\u606f {n}\u79d2",
    taskGate: "\u5347\u7d1a\u5927\u9580",
    taskGateReady: "\u53ef\u4ee5\u5347\u7d1a\u5927\u9580",
    taskGateMax: "\u5927\u9580\u5df2\u7d93\u6eff\u7d1a",
    milestones: "\u5712\u5340\u91cc\u7a0b\u7891",
    claim: "\u9818\u53d6",
    claimed: "\u5df2\u9818\u53d6",
    milestoneReward: "+{coins} \u91d1\u5e63",
    milestoneCollect500: "\u7d2f\u8a08\u6536\u96c6 500 \u9580\u7968",
    milestoneCare3: "\u7167\u9867\u52d5\u7269 3 \u6b21",
    milestoneGate3: "\u5927\u9580\u5347\u5230 Lv.3",
    milestoneAnimals4: "\u62db\u52df 4 \u96bb\u52d5\u7269",
    milestoneCollect5000: "\u7d2f\u8a08\u6536\u96c6 5,000 \u9580\u7968",
    milestoneCare12: "\u7167\u9867\u52d5\u7269 12 \u6b21",
    milestoneGate6: "\u5927\u9580\u5347\u5230 Lv.6",
    milestoneAnimals8: "\u62db\u52df 8 \u96bb\u52d5\u7269",
    milestoneCollect25000: "\u7d2f\u8a08\u6536\u96c6 25,000 \u9580\u7968",
    milestoneAnimals12: "\u62db\u52df\u5168\u90e8\u52d5\u7269",
    milestoneClaimed: "\u91cc\u7a0b\u7891\u734e\u52f5\u5df2\u9818\u53d6\uff01",
    tourBoard: "\u6bcf\u65e5\u5712\u5340\u5de1\u8ff4",
    tourRound: "\u7b2c {n} \u8f2a\u5de1\u8ff4",
    tourReward: "\u734e\u52f5 +{coins} \u91d1\u5e63",
    tourCollect: "\u6536\u96c6 {coins} \u9580\u7968",
    tourCare: "\u7167\u9867\u52d5\u7269 {count} \u6b21",
    tourBuild: "\u5efa\u8a2d\u6216\u62db\u52df {count} \u6b21",
      tourClaim: "\u9818\u53d6\u5de1\u8ff4",
      tourComplete: "\u5712\u5340\u5de1\u8ff4\u5b8c\u6210\uff01",
      tourReputation: "\u5712\u5340\u8072\u671b",
      tourReputationBonus: "\u6c38\u4e45\u9580\u7968\u6536\u5165 +{n}%",
    parkPlan: "\u6a02\u5712\u6210\u9577\u8a08\u756b",
    parkRank: "\u5927\u9580\u9032\u5ea6",
    nextUpgrade: "\u4e0b\u4e00\u6b21\u5927\u9580\u5347\u7d1a",
    nextUpgradeMax: "\u5927\u9580\u5df2\u5168\u90e8\u5347\u7d1a",
    incomeBoost: "\u5347\u7d1a\u5f8c +{n}/10\u79d2",
    buildFocus: "\u4e0b\u4e00\u500b\u5efa\u8a2d",
    buildUpgradeGateTitle: "\u5347\u7d1a\u5165\u53e3\u5927\u9580",
    buildUpgradeGateDesc: "\u66f4\u6f02\u4eae\u7684\u5927\u9580\u6703\u5438\u5f15\u66f4\u591a\u53c3\u89c0\u8005\uff0c\u63d0\u5347\u9580\u7968\u6536\u5165\u3002",
    buildRecruitTitle: "\u958b\u653e\u65b0\u68f2\u5730",
    buildRecruitDesc: "\u62db\u52df {name}\uff0c\u589e\u52a0\u65b0\u52d5\u7269\u5340\uff0c\u8b93\u6a02\u5712\u7e7c\u7e8c\u8b8a\u5927\u3002",
    buildHabitatTitle: "\u89e3\u9396\u68f2\u5730\u52a0\u6210",
    buildHabitatDesc: "\u62db\u52df {count} \u96bb\u52d5\u7269\uff0c\u555f\u52d5\u4e0b\u4e00\u500b\u5168\u5712\u6536\u5165\u52a0\u6210\u3002",
    buildCompleteTitle: "\u5712\u5340\u8a08\u756b\u5b8c\u6210",
    buildCompleteDesc: "\u76ee\u524d\u7684\u52d5\u7269\u548c\u5927\u9580\u90fd\u5df2\u5efa\u8a2d\u5b8c\u6210\u3002",
    buildReady: "\u73fe\u5728\u53ef\u4ee5\u5efa\u8a2d",
    buildNeed: "\u9084\u5dee {coins}",
    facilityBoard: "\u5712\u5340\u8a2d\u65bd",
    facilityLevel: "Lv.{n}",
    facilityMax: "\u5df2\u6eff\u7d1a",
    facilityUpgrade: "\u5347\u7d1a",
    facilitySnackStand: "\u9ede\u5fc3\u4ead",
    facilitySnackStandDesc: "\u66f4\u597d\u7684\u9ede\u5fc3\u6703\u63d0\u5347\u9580\u7968\u6536\u5165\u3002",
    facilityViewDeck: "\u89c0\u666f\u53f0",
    facilityViewDeckDesc: "\u66f4\u597d\u7684\u89c0\u666f\u6703\u5e36\u4f86\u66f4\u591a\u53c3\u89c0\u8005\u3002",
    facilityKeeperPost: "\u4fdd\u80b2\u5c0f\u7ad9",
    facilityKeeperPostDesc: "\u7167\u9867\u5de5\u5177\u8b93\u52d5\u7269\u7167\u9867\u66f4\u6709\u6548\u3002",
    facilityIncomeBoost: "\u9580\u7968 +{n}%",
    facilityCareBoost: "\u7167\u9867 +{n}",
    facilityVisitorBoost: "\u53c3\u89c0\u8005 +{n}",
    facilityBuilt: "{name} \u5347\u7d1a\u4e86\uff01",
    habitatBonus: "\u68f2\u5730\u52a0\u6210",
    habitatBonusCurrent: "\u9580\u7968\u6536\u5165 +{n}%",
    habitatBonusNext: "\u62db\u52df {count} \u96bb\u52d5\u7269\u89e3\u9396 +{n}%",
    habitatBonusMax: "\u6240\u6709\u68f2\u5730\u52a0\u6210\u5df2\u555f\u52d5",
    dragHint: "\u53ef\u4ee5\u62d6\u66f3\u8349\u539f\u4e0a\u7684\u52d5\u7269\uff0c\u64fa\u6210\u81ea\u5df1\u559c\u6b61\u7684\u6a02\u5712\u3002",
    reportGood: "\u7167\u9867\u5f97\u5f88\u597d\uff01\u4f60\u7684\u52d5\u7269\u5712\u6b63\u5728\u7a69\u5b9a\u6210\u9577\u3002",
    reportTry: "\u8868\u73fe\u4e0d\u932f\uff01\u62db\u52df\u52d5\u7269\u548c\u5347\u7d1a\u5927\u9580\u53ef\u4ee5\u8b93\u6a02\u5712\u6210\u9577\u66f4\u5feb\u3002",
    skillFocus: "\u5c08\u6ce8",
    skillLogic: "\u908f\u8f2f",
    skillAnimalKnowledge: "\u52d5\u7269\u77e5\u8b58",
    lion: "\u7345\u5b50",
    giraffe: "\u9577\u9838\u9e7f",
    elephant: "\u5927\u8c61",
    panda: "\u718a\u8c93",
    penguin: "\u4f01\u9d5d",
    rabbit: "\u5154\u5b50",
    fox: "\u72d0\u72f8",
    koala: "\u7121\u5c3e\u718a",
    tiger: "\u8001\u864e",
    rhino: "\u7280\u725b",
    crocodile: "\u9c77\u9b5a",
    bear: "\u718a",
  };

  const $ = (id) => document.getElementById(id);
  const pageMeta = {
    en: {
      title: "Animal Zoo Idle - WeightPlay",
      description: "Run a lively animal park where visitors buy tickets while you care for animals, upgrade the zoo gate, recruit new animals, and grow your zoo in Animal Zoo Idle on WeightPlay.",
      ogTitle: "Animal Zoo Idle - WeightPlay",
      ogDescription: "A family-friendly zoo management game with visitor income, animal care, gate upgrades, animal recruitment, and local progress.",
    },
    "zh-Hant": {
      title: "\u52d5\u7269\u5c0f\u5c0f\u6a02\u5712 - WeightPlay",
      description: "\u5728 WeightPlay \u7d93\u71df\u71b1\u9b27\u7684\u52d5\u7269\u5712\uff0c\u6536\u53d6\u904a\u5ba2\u9580\u7968\u3001\u7167\u9867\u52d5\u7269\u3001\u5347\u7d1a\u5927\u9580\u4e26\u62db\u52df\u65b0\u52d5\u7269\uff0c\u8b93\u6a02\u5712\u6301\u7e8c\u6210\u9577\u3002",
      ogTitle: "\u52d5\u7269\u5c0f\u5c0f\u6a02\u5712 - WeightPlay",
      ogDescription: "\u9069\u5408\u89aa\u5b50\u7684\u52d5\u7269\u5712\u7d93\u71df\u904a\u6232\uff0c\u5305\u542b\u9580\u7968\u6536\u5165\u3001\u52d5\u7269\u7167\u9867\u3001\u5927\u9580\u5347\u7d1a\u3001\u52d5\u7269\u62db\u52df\u8207\u672c\u5730\u9032\u5ea6\u3002",
    },
  };
  const nodes = {
    localeSelect: $("localeSelect"),
    menuPanel: $("menuPanel"),
    gamePanel: $("gamePanel"),
    startBtn: $("startBtn"),
    backToMenuBtn: $("backToMenuBtn"),
    coinText: $("coinText"),
    incomeText: $("incomeText"),
    reportBtn: $("reportBtn"),
    offlineNotice: $("offlineNotice"),
    habitatGrid: $("habitatGrid"),
    resultPanel: $("resultPanel"),
    reportScore: $("reportScore"),
    reportText: $("reportText"),
    tourReport: $("tourReport"),
    animalAlbum: $("animalAlbum"),
    focusStars: $("focusStars"),
    logicStars: $("logicStars"),
    animalStars: $("animalStars"),
    closeReportBtn: $("closeReportBtn"),
    loadingPanel: $("loadingPanel"),
    loadingText: $("loadingText"),
    loadingFill: $("loadingFill"),
  };

  let locale = window.WonderI18n?.locale?.() || localStorage.getItem(localeKey) || "en";
  let save = loadSave();
  let tickCount = 0;
  let newlyRecruitedAnimalId = "";
  let facilityScrollLeft = 0;
  let careRouteChoiceOpen = false;

  function t(key, data = {}) {
    const value = text[locale]?.[key] || text.en[key] || key;
    return Object.entries(data).reduce((out, [name, item]) => out.replaceAll(`{${name}}`, String(item)), value);
  }

  function loadSave() {
    const fallback = {
      coins: 180,
      ticketBox: 0,
      gateLevel: 1,
      happiness: 76,
      playCount: 0,
      careCount: 0,
      careReadyAt: 0,
      lifetimeTickets: 0,
      claimedMilestones: {},
      tourRound: 1,
      tour: { collected: 0, cared: 0, built: 0 },
      careRoutes: { habitat: 0, enrichment: 0 },
      layoutVersion,
      bestScore: 0,
      lastScore: 0,
      lastPlayedAt: Date.now(),
      unlocked: { lion: true },
      positions: {},
      facilities: {},
    };
    try {
      const current = JSON.parse(localStorage.getItem(saveKey) || "null");
      if (current) return normalizeSave({ ...fallback, ...current });
      for (const key of oldSaveKeys) {
        const old = JSON.parse(localStorage.getItem(key) || "null");
        if (old) {
          return normalizeSave({
            ...fallback,
            coins: Math.max(180, Number(old.coins || 0)),
            ticketBox: Number(old.ticketBox || 0),
            gateLevel: Number(old.meadowLevel || old.gateLevel || 1),
            happiness: Number(old.happiness || 76),
            unlocked: { lion: true, giraffe: Boolean(old.animals?.giraffe) },
          });
        }
      }
      return fallback;
    } catch {
      return fallback;
    }
  }

  function normalizeSave(data) {
    data.unlocked = { lion: true, ...(data.unlocked || {}) };
    data.positions = { ...(data.positions || {}) };
    data.facilities = { ...(data.facilities || {}) };
    const shouldRefreshLayout = Number(data.layoutVersion || 0) < layoutVersion;
    for (const animal of animals) {
      const position = data.positions[animal.id] || {};
      const bounds = animalBounds(animal);
      if (shouldRefreshLayout) {
        data.positions[animal.id] = {
          x: clamp(animal.x, bounds.minX, bounds.maxX),
          y: clamp(animal.y, bounds.minY, bounds.maxY),
        };
        continue;
      }
      data.positions[animal.id] = {
        x: clamp(Number(position.x ?? animal.x), bounds.minX, bounds.maxX),
        y: clamp(Number(position.y ?? animal.y), bounds.minY, bounds.maxY),
      };
    }
    data.layoutVersion = layoutVersion;
    data.coins = Math.max(0, Number(data.coins || 0));
    data.ticketBox = Math.max(0, Number(data.ticketBox || 0));
    data.gateLevel = clamp(Math.floor(Number(data.gateLevel || 1)), 1, maxGateLevel);
    data.happiness = clamp(Number(data.happiness || 76), 18, 100);
    data.careReadyAt = Math.max(0, Number(data.careReadyAt || 0));
    data.lifetimeTickets = Math.max(0, Number(data.lifetimeTickets || 0));
    data.claimedMilestones = { ...(data.claimedMilestones || {}) };
    data.tourRound = clamp(Math.floor(Number(data.tourRound || 1)), 1, 999);
    data.tour = {
      collected: Math.max(0, Number(data.tour?.collected || 0)),
      cared: Math.max(0, Number(data.tour?.cared || 0)),
      built: Math.max(0, Number(data.tour?.built || 0)),
    };
    data.careRoutes = {
      habitat: Math.max(0, Number(data.careRoutes?.habitat || 0)),
      enrichment: Math.max(0, Number(data.careRoutes?.enrichment || 0)),
    };
    for (const facility of facilities) {
      data.facilities[facility.id] = clamp(Math.floor(Number(data.facilities[facility.id] || 0)), 0, facility.maxLevel);
    }
    return data;
  }

  function saveGame() {
    save.lastPlayedAt = Date.now();
    localStorage.setItem(saveKey, JSON.stringify(save));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function unlockedAnimals() {
    return animals.filter((animal) => save.unlocked[animal.id]);
  }

  function nextRecruit() {
    return animals.find((animal) => !save.unlocked[animal.id]);
  }

  function animalPosition(animal) {
    return save.positions?.[animal.id] || { x: animal.x, y: animal.y };
  }

  function animalBounds(animal) {
    const size = Number(animal.size || 14);
    return {
      minX: 5,
      maxX: Math.max(5, 82 - size),
      minY: 12,
      maxY: 54,
    };
  }

  function gateUpgradeCost() {
    return save.gateLevel >= maxGateLevel ? 0 : Math.round(620 * save.gateLevel * save.gateLevel * 1.22);
  }

  function incomePerTick(gateLevel = save.gateLevel) {
    const animalIncome = unlockedAnimals().reduce((sum, animal) => sum + animal.baseIncome, 0);
    const gateBonus = 1 + (gateLevel - 1) * 0.16;
    const happyBonus = 0.35 + save.happiness / 240;
    const habitatBonus = 1 + habitatBonusRate();
    const facilityBonus = 1 + facilityIncomeBonus();
    const reputationBonus = 1 + tourReputationRate();
    return Math.max(2, Math.round(animalIncome * gateBonus * happyBonus * habitatBonus * facilityBonus * reputationBonus));
  }

  function completedTours() {
    return Math.max(0, Number(save.tourRound || 1) - 1);
  }

  function tourReputationRate() {
    return Math.min(0.4, completedTours() * 0.02);
  }

  function facilityLevel(facility) {
    return clamp(Math.floor(Number(save.facilities?.[facility.id] || 0)), 0, facility.maxLevel);
  }

  function facilityCost(facility) {
    const level = facilityLevel(facility);
    if (level >= facility.maxLevel) return 0;
    return Math.round(facility.baseCost * Math.pow(2.15, level));
  }

  function facilityIncomeBonus() {
    return facilities.reduce((sum, facility) => sum + facilityLevel(facility) * facility.incomeBonus, 0);
  }

  function facilityCareBonus() {
    return facilities.reduce((sum, facility) => sum + facilityLevel(facility) * facility.careBonus, 0);
  }

  function facilityVisitorBonus() {
    return facilities.reduce((sum, facility) => sum + facilityLevel(facility) * facility.visitorBonus, 0);
  }

  function facilityName(facility) {
    if (facility.id === "snackStand") return t("facilitySnackStand");
    if (facility.id === "viewDeck") return t("facilityViewDeck");
    if (facility.id === "keeperPost") return t("facilityKeeperPost");
    return facility.id;
  }

  function facilityDesc(facility) {
    if (facility.id === "snackStand") return t("facilitySnackStandDesc");
    if (facility.id === "viewDeck") return t("facilityViewDeckDesc");
    if (facility.id === "keeperPost") return t("facilityKeeperPostDesc");
    return "";
  }

  function nextFacilityUpgrade() {
    return facilities
      .filter((facility) => facilityLevel(facility) < facility.maxLevel)
      .map((facility) => ({ facility, cost: facilityCost(facility) }))
      .sort((a, b) => Math.max(0, a.cost - save.coins) - Math.max(0, b.cost - save.coins))[0] || null;
  }

  function habitatBonusRate(count = unlockedAnimals().length) {
    return habitatBonuses.reduce((best, item) => (count >= item.count ? item.bonus : best), 0);
  }

  function nextHabitatBonus(count = unlockedAnimals().length) {
    return habitatBonuses.find((item) => item.count > count) || null;
  }

  function nextBuildGoal() {
    const recruit = nextRecruit();
    const nextBonus = nextHabitatBonus();
    const facilityUpgrade = nextFacilityUpgrade();
    const gateCost = gateUpgradeCost();
    const gateGoal = save.gateLevel < maxGateLevel ? {
      type: "gate",
      title: t("buildUpgradeGateTitle"),
      desc: t("buildUpgradeGateDesc"),
      cost: gateCost,
      progress: taskProgress(save.coins, gateCost),
      boost: Math.max(0, incomePerTick(save.gateLevel + 1) - incomePerTick(save.gateLevel)),
    } : null;
    const recruitGoal = recruit ? {
      type: "recruit",
      title: nextBonus && unlockedAnimals().length + 1 >= nextBonus.count ? t("buildHabitatTitle") : t("buildRecruitTitle"),
      desc: nextBonus && unlockedAnimals().length + 1 >= nextBonus.count
        ? t("buildHabitatDesc", { count: nextBonus.count })
        : t("buildRecruitDesc", { name: t(recruit.id) }),
      cost: recruit.cost,
      progress: taskProgress(save.coins, recruit.cost),
      animal: recruit,
    } : null;
    const facilityGoal = facilityUpgrade ? {
      type: "facility",
      title: facilityName(facilityUpgrade.facility),
      desc: facilityDesc(facilityUpgrade.facility),
      cost: facilityUpgrade.cost,
      progress: taskProgress(save.coins, facilityUpgrade.cost),
      facility: facilityUpgrade.facility,
    } : null;
    const candidates = [gateGoal, recruitGoal, facilityGoal].filter(Boolean);
    if (!candidates.length) {
      return {
        type: "complete",
        title: t("buildCompleteTitle"),
        desc: t("buildCompleteDesc"),
        cost: 0,
        progress: 1,
      };
    }
    return candidates.sort((a, b) => Math.max(0, a.cost - save.coins) - Math.max(0, b.cost - save.coins))[0];
  }

  function tourTargets(round = save.tourRound) {
    return {
      collected: 260 + (round - 1) * 180,
      cared: Math.min(6, 1 + Math.floor((round - 1) / 2)),
      built: Math.min(3, 1 + Math.floor((round - 1) / 4)),
      reward: 360 + (round - 1) * 170,
    };
  }

  function tourProgress() {
    const targets = tourTargets();
    return {
      collected: taskProgress(save.tour.collected, targets.collected),
      cared: taskProgress(save.tour.cared, targets.cared),
      built: taskProgress(save.tour.built, targets.built),
    };
  }

  function isTourComplete() {
    const targets = tourTargets();
    return save.tour.collected >= targets.collected
      && save.tour.cared >= targets.cared
      && save.tour.built >= targets.built;
  }

  function todayGoal() {
    const targets = tourTargets();
    if (isTourComplete()) {
      return {
        label: t("todayGoalTour"),
        status: t("todayGoalReady"),
        progress: 1,
        ready: true,
      };
    }
    const buildGoal = nextBuildGoal();
    const options = [
      {
        label: t("todayGoalCollect"),
        status: `${formatNumber(save.tour.collected)} / ${formatNumber(targets.collected)}`,
        progress: taskProgress(save.tour.collected, targets.collected),
        ready: save.tour.collected >= targets.collected,
      },
      {
        label: t("todayGoalCare"),
        status: `${formatNumber(save.tour.cared)} / ${formatNumber(targets.cared)}`,
        progress: taskProgress(save.tour.cared, targets.cared),
        ready: save.tour.cared >= targets.cared,
      },
      {
        label: buildGoal.type === "complete" ? t("todayGoalComplete") : t("todayGoalBuild"),
        status: `${formatNumber(save.tour.built)} / ${formatNumber(targets.built)}`,
        progress: taskProgress(save.tour.built, targets.built),
        ready: save.tour.built >= targets.built,
      },
    ];
    return options.find((goal) => !goal.ready) || options[0];
  }

  function visitorCount() {
    return clamp(Math.ceil(incomePerTick() / 18) + facilityVisitorBonus(), 2, 9);
  }

  function taskProgress(current, target) {
    if (target <= 0) return 1;
    return clamp(current / target, 0, 1);
  }

  function formatNumber(value) {
    const number = Math.floor(Number(value || 0));
    if (number >= 1000000) return `${Math.round((number / 1000000) * 10) / 10}M`;
    if (number >= 10000) return `${Math.round((number / 1000) * 10) / 10}K`;
    return String(number);
  }

  function formatCost(value) {
    return Math.floor(Number(value || 0)).toLocaleString(locale === "zh-Hant" ? "zh-TW" : "en-US");
  }

  function careWaitSeconds() {
    return Math.max(0, Math.ceil((Number(save.careReadyAt || 0) - Date.now()) / 1000));
  }

  function isCompactPlayShell() {
    return Boolean(window.matchMedia?.("(max-width: 820px)")?.matches && document.body.classList.contains("zoo-playing"));
  }

  function upgradeButtonLabel() {
    if (save.gateLevel >= maxGateLevel) return t("maxGate");
    return isCompactPlayShell() ? t("upgradeGate") : `${t("upgradeGate")} ${formatCost(gateUpgradeCost())}`;
  }

  function applyOffline() {
    const elapsedSeconds = Math.min(7200, Math.max(0, (Date.now() - Number(save.lastPlayedAt || Date.now())) / 1000));
    const earned = Math.floor((elapsedSeconds / 10) * incomePerTick() * 0.55);
    if (earned > 0) {
      save.ticketBox += earned;
      nodes.offlineNotice.textContent = t("offline", { coins: formatNumber(earned) });
      nodes.offlineNotice.classList.remove("hidden");
      window.setTimeout(() => nodes.offlineNotice.classList.add("hidden"), 3200);
    }
    saveGame();
  }

  function localizeStatic() {
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : "en";
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
    document.querySelectorAll("[data-ui-aria-label]").forEach((node) => {
      node.setAttribute("aria-label", t(node.dataset.uiAriaLabel));
    });
    nodes.localeSelect.value = locale;
    updatePageMetadata();
  }

  function updateMeta(selector, value) {
    const node = document.head.querySelector(selector);
    if (node) node.setAttribute("content", value);
  }

  function updatePageMetadata() {
    const meta = pageMeta[locale] || pageMeta.en;
    document.title = meta.title;
    updateMeta('meta[name="description"]', meta.description);
    updateMeta('meta[property="og:title"]', meta.ogTitle);
    updateMeta('meta[property="og:description"]', meta.ogDescription);
    updateMeta('meta[name="twitter:title"]', meta.ogTitle);
    updateMeta('meta[name="twitter:description"]', meta.ogDescription);
  }

  function render() {
    if (nodes.gamePanel.classList.contains("hidden")) return;
    nodes.coinText.textContent = formatNumber(save.coins);
    if (nodes.incomeText) nodes.incomeText.textContent = formatNumber(save.ticketBox);
    const card = nodes.habitatGrid.querySelector(".zoo-stage-card");
    if (!card) {
      nodes.habitatGrid.appendChild(renderPark());
      return;
    }
    updatePark(card);
  }

  function renderPark() {
    const card = document.createElement("article");
    card.className = "zoo-stage-card";
    card.innerHTML = `
      <div class="park-hud">
        <strong>${t("gate", { n: save.gateLevel })}</strong>
        <span>${t("income", { n: formatNumber(incomePerTick()) })}</span>
        <span>${t("animals")}: ${unlockedAnimals().length}/${animals.length}</span>
      </div>
      <div class="savanna-stage stage-lv-${save.gateLevel}" aria-label="${t("safariPark")}">
        <div class="gate image-asset"><img src="${gateAsset()}" alt="" draggable="false" /></div>
        <div class="stage-facilities"></div>
        <div class="visitor-line"></div>
        <img class="keeper image-asset" src="${ASSETS.keeper}" alt="" draggable="false" />
        <div class="animal-layer"></div>
        <div class="heart-field"></div>
      </div>
      <div class="care-panel">
        <div class="daily-focus-card" aria-live="polite"></div>
        <div class="zoo-task-board" aria-live="polite"></div>
        <div class="happy-meter"><span>${t("happiness")}</span><b>${Math.round(save.happiness)}%</b><i style="width:${save.happiness}%"></i></div>
        <div class="zoo-actions">
          <button type="button" data-action="collect">${t("collect")}</button>
          <button type="button" data-action="care">${t("careAll")}</button>
          <button type="button" data-action="upgrade" ${save.gateLevel >= maxGateLevel ? "disabled" : ""}>${upgradeButtonLabel()}</button>
          <button type="button" data-action="report">${t("report")}</button>
        </div>
        <div class="care-route-actions hidden" role="group" aria-label="${t("careAll")}" aria-live="polite">
          <button type="button" data-action="route-habitat"><strong>${t("careRouteHabitat")}</strong><small>${t("careRouteHabitatHint")}</small></button>
          <button type="button" data-action="route-enrichment"><strong>${t("careRouteEnrichment")}</strong><small>${t("careRouteEnrichmentHint", { tickets: formatNumber(careRouteTicketReward()) })}</small></button>
          <button type="button" data-action="route-cancel">${t("careRouteCancel")}</button>
        </div>
        <div class="park-plan-card" aria-live="polite"></div>
        <div class="tour-board" aria-live="polite"></div>
        <div class="habitat-bonus-card" aria-live="polite"></div>
        <div class="facility-board" aria-live="polite"></div>
        <div class="zoo-milestone-board" aria-live="polite"></div>
        <div class="animal-shop-head"><strong>${t("animals")}</strong><span>${t("dragHint")}</span></div>
        <div class="animal-shop" aria-label="${t("animalShop")}"></div>
      </div>
    `;
    renderVisitors(card.querySelector(".visitor-line"));
    renderStageFacilities(card.querySelector(".stage-facilities"));
    const animalLayer = card.querySelector(".animal-layer");
    renderAnimals(animalLayer);
    animalLayer.dataset.animalIds = unlockedAnimals().map((animal) => animal.id).join(",");
    card.querySelector('[data-action="collect"]').addEventListener("click", collectTickets);
    card.querySelector('[data-action="care"]').addEventListener("click", careAnimals);
    card.querySelector('[data-action="route-habitat"]').addEventListener("click", () => completeCareRoute("habitat"));
    card.querySelector('[data-action="route-enrichment"]').addEventListener("click", () => completeCareRoute("enrichment"));
    card.querySelector('[data-action="route-cancel"]').addEventListener("click", closeCareRoutes);
    card.querySelector('[data-action="upgrade"]').addEventListener("click", upgradeGate);
    card.querySelector('[data-action="report"]').addEventListener("click", showReport);
    renderDailyFocus(card.querySelector(".daily-focus-card"));
    renderParkPlan(card.querySelector(".park-plan-card"));
    renderTourBoard(card.querySelector(".tour-board"));
    renderHabitatBonus(card.querySelector(".habitat-bonus-card"));
    renderFacilityBoard(card.querySelector(".facility-board"));
    renderTaskBoard(card.querySelector(".zoo-task-board"));
    renderMilestones(card.querySelector(".zoo-milestone-board"));
    const shop = card.querySelector(".animal-shop");
    renderAnimalShop(shop);
    if (shop) shop.dataset.shopSignature = animalShopSignature();
    return card;
  }

  function updatePark(card) {
    const hud = card.querySelector(".park-hud");
    if (hud) {
      hud.children[0].textContent = t("gate", { n: save.gateLevel });
      hud.children[1].textContent = t("income", { n: formatNumber(incomePerTick()) });
      hud.children[2].textContent = `${t("animals")}: ${unlockedAnimals().length}/${animals.length}`;
    }
    const stage = card.querySelector(".savanna-stage");
    if (stage) {
      stage.classList.remove("stage-lv-1", "stage-lv-2", "stage-lv-3", "stage-lv-4", "stage-lv-5", "stage-lv-6", "stage-lv-7", "stage-lv-8");
      stage.classList.add(`stage-lv-${save.gateLevel}`);
    }
    const gate = card.querySelector(".gate img");
    if (gate && !gate.src.endsWith(gateAsset())) gate.src = gateAsset();
    const happyText = card.querySelector(".happy-meter b");
    const happyFill = card.querySelector(".happy-meter i");
    if (happyText) happyText.textContent = `${Math.round(save.happiness)}%`;
    if (happyFill) happyFill.style.width = `${save.happiness}%`;
    renderDailyFocus(card.querySelector(".daily-focus-card"));
    renderParkPlan(card.querySelector(".park-plan-card"));
    renderTourBoard(card.querySelector(".tour-board"));
    const upgrade = card.querySelector('[data-action="upgrade"]');
    if (upgrade) {
      upgrade.disabled = save.gateLevel >= maxGateLevel;
      upgrade.textContent = upgradeButtonLabel();
    }
    renderTaskBoard(card.querySelector(".zoo-task-board"));
    renderMilestones(card.querySelector(".zoo-milestone-board"));
    renderHabitatBonus(card.querySelector(".habitat-bonus-card"));
    renderStageFacilities(card.querySelector(".stage-facilities"));
    renderFacilityBoard(card.querySelector(".facility-board"));
    const shop = card.querySelector(".animal-shop");
    if (shop && shop.dataset.shopSignature !== animalShopSignature()) {
      renderAnimalShop(shop);
      shop.dataset.shopSignature = animalShopSignature();
    }
    const care = card.querySelector('[data-action="care"]');
    if (care) {
      const waitSeconds = careWaitSeconds();
      care.disabled = waitSeconds > 0;
      care.classList.toggle("cooling", waitSeconds > 0);
      const cooldownPercent = waitSeconds > 0 ? clamp((waitSeconds * 1000) / careCooldownMs, 0, 1) * 100 : 0;
      care.style.setProperty("--cooldown-pct", `${cooldownPercent}%`);
      care.setAttribute("aria-label", waitSeconds > 0 ? t("careWait", { n: waitSeconds }) : t("careAll"));
      care.textContent = waitSeconds > 0 ? `${t("careAll")} ${waitSeconds}s` : t("careAll");
    }
    const animalLayer = card.querySelector(".animal-layer");
    const animalIds = unlockedAnimals().map((animal) => animal.id).join(",");
    if (animalLayer && animalLayer.dataset.animalIds !== animalIds) {
      cancelAnimalDrag();
      animalLayer.innerHTML = "";
      renderAnimals(animalLayer);
      animalLayer.dataset.animalIds = animalIds;
    }
    renderVisitors(card.querySelector(".visitor-line"));
  }

  function gateAsset() {
    if (save.gateLevel >= 6) return ASSETS.gate3;
    if (save.gateLevel >= 3) return ASSETS.gate2;
    return ASSETS.gate1;
  }

  function renderVisitors(container) {
    if (!container) return;
    const signature = `${visitorCount()}`;
    if (container.dataset.visitorSignature === signature) return;
    container.dataset.visitorSignature = signature;
    container.innerHTML = "";
    const count = visitorCount();
    for (let i = 0; i < count; i += 1) {
      const img = document.createElement("img");
      img.src = visitorAssets[i % visitorAssets.length];
      img.alt = "";
      img.draggable = false;
      img.style.setProperty("--delay", `${i * -0.72}s`);
      img.style.setProperty("--lane", `${i % 3}`);
      container.appendChild(img);
    }
  }

  function renderAnimals(container) {
    for (const animal of unlockedAnimals()) {
      const position = animalPosition(animal);
      const wrap = document.createElement("div");
      wrap.className = `animal animal-${animal.id}`;
      wrap.dataset.name = t(animal.id);
      wrap.dataset.animalId = animal.id;
      wrap.style.left = `${position.x}%`;
      wrap.style.bottom = `${position.y}%`;
      wrap.style.width = `${animal.size}%`;
      if (newlyRecruitedAnimalId === animal.id) wrap.classList.add("new-arrival");
      wrap.innerHTML = `<img src="${animal.asset}" alt="" draggable="false" />`;
      attachAnimalDrag(wrap, animal);
      container.appendChild(wrap);
    }
    if (newlyRecruitedAnimalId) {
      const animalId = newlyRecruitedAnimalId;
      newlyRecruitedAnimalId = "";
      window.setTimeout(() => {
        document.querySelector(`.animal[data-animal-id="${animalId}"]`)?.classList.remove("new-arrival");
      }, 760);
    }
  }

  function renderStageFacilities(container) {
    if (!container) return;
    const signature = facilities.map((facility) => `${facility.id}:${facilityLevel(facility)}`).join("|");
    if (container.dataset.facilitySignature === signature) return;
    container.dataset.facilitySignature = signature;
    container.innerHTML = "";
    for (const facility of facilities) {
      const level = facilityLevel(facility);
      const wrap = document.createElement("div");
      wrap.className = `stage-facility facility-${facility.id} ${level > 0 ? "built" : "ghost"}`;
      const width = facility.size + level * 1.5;
      const safeLeft = clamp(facility.x, 2, Math.max(2, 95 - width));
      wrap.style.left = `${safeLeft}%`;
      wrap.style.bottom = `${facility.y}%`;
      wrap.style.width = `${width}%`;
      wrap.innerHTML = `
        <img src="${facility.asset}" alt="" draggable="false" />
        <span>${level > 0 ? t("facilityLevel", { n: level }) : t("facilityUpgrade")}</span>
      `;
      container.appendChild(wrap);
    }
  }

  function renderAnimalShop(container) {
    if (!container) return;
    container.innerHTML = "";
    for (const animal of animals) {
      const owned = Boolean(save.unlocked[animal.id]);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `animal-shop-card ${owned ? "owned" : ""}`;
      button.dataset.shopAnimal = animal.id;
      button.disabled = !owned && save.coins < animal.cost;
      button.innerHTML = `
        <img src="${animal.asset}" alt="" draggable="false" />
        <strong>${t(animal.id)}</strong>
        <span>${owned ? t("owned") : `${t("buyAnimal")} ${formatCost(animal.cost)}`}</span>
        <small>${t("incomeShort", { n: formatNumber(animal.baseIncome) })} / ${t("careShort", { n: animal.care })}</small>
      `;
      button.addEventListener("click", () => buyAnimal(animal.id));
      container.appendChild(button);
    }
  }

  function animalShopSignature() {
    return animals.map((animal) => {
      const owned = save.unlocked[animal.id] ? 1 : 0;
      const affordable = save.coins >= animal.cost ? 1 : 0;
      return `${animal.id}:${owned}:${affordable}`;
    }).join("|") + `:${locale}`;
  }

  function renderFacilityBoard(container) {
    if (!container) return;
    const existingList = container.querySelector(".facility-list");
    if (existingList) facilityScrollLeft = existingList.scrollLeft;
    const signature = facilities.map((facility) => {
      const level = facilityLevel(facility);
      const cost = facilityCost(facility);
      const maxed = level >= facility.maxLevel ? 1 : 0;
      const ready = !maxed && save.coins >= cost ? 1 : 0;
      return `${facility.id}:${level}:${cost}:${ready}:${maxed}`;
    }).join("|") + `:${locale}`;
    if (container.dataset.facilityBoardSignature === signature) return;
    const now = Date.now();
    if (Number(container.dataset.userScrollingUntil || 0) > now) return;
    container.dataset.facilityBoardSignature = signature;
    container.innerHTML = `
      <strong>${t("facilityBoard")}</strong>
      <div class="facility-list">
        ${facilities.map((facility) => {
          const level = facilityLevel(facility);
          const cost = facilityCost(facility);
          const maxed = level >= facility.maxLevel;
          const ready = !maxed && save.coins >= cost;
          const effects = [
            level > 0 && facility.incomeBonus ? t("facilityIncomeBoost", { n: Math.round(facility.incomeBonus * level * 100) }) : "",
            level > 0 && facility.careBonus ? t("facilityCareBoost", { n: facility.careBonus * level }) : "",
            level > 0 && facility.visitorBonus ? t("facilityVisitorBoost", { n: facility.visitorBonus * level }) : "",
          ].filter(Boolean).join(" / ");
          return `
            <button type="button" class="facility-card ${ready ? "ready" : ""} ${maxed ? "maxed" : ""}" data-facility="${facility.id}" ${maxed ? "disabled" : ""}>
              <img src="${facility.asset}" alt="" draggable="false" />
              <span>
                <strong>${facilityName(facility)}</strong>
                <small>${level >= facility.maxLevel ? t("facilityMax") : `${t("facilityLevel", { n: level })} - ${t("facilityUpgrade")} ${formatCost(cost)}`}</small>
                <em>${effects || facilityDesc(facility)}</em>
              </span>
            </button>
          `;
        }).join("")}
      </div>
    `;
    const newList = container.querySelector(".facility-list");
    if (newList) {
      newList.scrollLeft = facilityScrollLeft;
      requestAnimationFrame(() => {
        newList.scrollLeft = facilityScrollLeft;
      });
      newList.addEventListener("scroll", () => {
        facilityScrollLeft = newList.scrollLeft;
        container.dataset.userScrollingUntil = String(Date.now() + 1800);
      }, { passive: true });
      newList.addEventListener("pointerdown", () => {
        container.dataset.userScrollingUntil = String(Date.now() + 1800);
      }, { passive: true });
      newList.addEventListener("touchstart", () => {
        container.dataset.userScrollingUntil = String(Date.now() + 1800);
      }, { passive: true });
    }
    container.querySelectorAll("[data-facility]").forEach((button) => {
      button.addEventListener("click", () => upgradeFacility(button.dataset.facility));
    });
  }

  function renderDailyFocus(container) {
    if (!container) return;
    const goal = todayGoal();
    container.classList.toggle("ready", goal.ready);
    container.innerHTML = `
      <div>
        <strong>${t("todayGoal")}</strong>
        <span>${goal.status}</span>
      </div>
      <b>${goal.label}</b>
      <i style="--daily-progress:${Math.round(goal.progress * 100)}%"></i>
    `;
  }

  function renderTaskBoard(container) {
    if (!container) return;
    const collectTarget = Math.max(120, Math.round(incomePerTick() * 4));
    const gateCost = gateUpgradeCost();
    const waitSeconds = careWaitSeconds();
    const tasks = [
      {
        label: t("taskCollect", { coins: formatCost(collectTarget) }),
        status: save.ticketBox >= collectTarget ? t("taskCollectReady") : `${formatNumber(save.ticketBox)} / ${formatCost(collectTarget)}`,
        progress: taskProgress(save.ticketBox, collectTarget),
        ready: save.ticketBox >= collectTarget,
      },
      {
        label: t("taskCare"),
        status: waitSeconds <= 0 ? t("taskCareReady") : t("taskCareWait", { n: waitSeconds }),
        progress: waitSeconds <= 0 ? 1 : 1 - taskProgress(waitSeconds * 1000, careCooldownMs),
        ready: waitSeconds <= 0,
      },
      {
        label: t("taskGate"),
        status: save.gateLevel >= maxGateLevel ? t("taskGateMax") : (save.coins >= gateCost ? t("taskGateReady") : `${formatNumber(save.coins)} / ${formatCost(gateCost)}`),
        progress: save.gateLevel >= maxGateLevel ? 1 : taskProgress(save.coins, gateCost),
        ready: save.gateLevel >= maxGateLevel || save.coins >= gateCost,
      },
    ];
    container.innerHTML = `
      <strong>${t("taskBoard")}</strong>
      <div class="zoo-task-list">
        ${tasks.map((task) => `
          <div class="zoo-task ${task.ready ? "ready" : ""}">
            <span>${task.label}</span>
            <small>${task.status}</small>
            <i style="--task-progress:${Math.round(task.progress * 100)}%"></i>
          </div>
        `).join("")}
      </div>
    `;
  }

  function milestoneProgress(milestone) {
    if (milestone.type === "ticketCollected") return Math.min(save.lifetimeTickets, milestone.target);
    if (milestone.type === "careCount") return Math.min(save.careCount, milestone.target);
    if (milestone.type === "gateLevel") return Math.min(save.gateLevel, milestone.target);
    if (milestone.type === "animalCount") return Math.min(unlockedAnimals().length, milestone.target);
    return 0;
  }

  function milestoneLabel(milestone) {
    const labelKeys = {
      collect500: "milestoneCollect500",
      care3: "milestoneCare3",
      gate3: "milestoneGate3",
      animals4: "milestoneAnimals4",
      collect5000: "milestoneCollect5000",
      care12: "milestoneCare12",
      gate6: "milestoneGate6",
      animals8: "milestoneAnimals8",
      collect25000: "milestoneCollect25000",
      animals12: "milestoneAnimals12",
    };
    return labelKeys[milestone.id] ? t(labelKeys[milestone.id]) : milestone.id;
  }

  function renderMilestones(container) {
    if (!container) return;
    const nextMilestones = milestones.filter((milestone) => !save.claimedMilestones[milestone.id]).slice(0, 3);
    const visibleMilestones = nextMilestones.length ? nextMilestones : milestones.slice(-1);
    container.innerHTML = `
      <strong>${t("milestones")}</strong>
      <div class="zoo-milestone-list">
        ${visibleMilestones.map((milestone) => {
          const progress = milestoneProgress(milestone);
          const done = progress >= milestone.target;
          const claimed = Boolean(save.claimedMilestones[milestone.id]);
          return `
            <button type="button" class="zoo-milestone ${done ? "ready" : ""} ${claimed ? "claimed" : ""}" data-milestone="${milestone.id}" ${done && !claimed ? "" : "disabled"}>
              <span>${milestoneLabel(milestone)}</span>
              <small>${claimed ? t("claimed") : `${formatNumber(progress)} / ${formatNumber(milestone.target)} - ${t("milestoneReward", { coins: formatCost(milestone.reward) })}`}</small>
              <b>${done && !claimed ? t("claim") : ""}</b>
              <i style="--milestone-progress:${Math.round(taskProgress(progress, milestone.target) * 100)}%"></i>
            </button>
          `;
        }).join("")}
      </div>
    `;
    container.querySelectorAll("[data-milestone]").forEach((button) => {
      button.addEventListener("click", () => claimMilestone(button.dataset.milestone));
    });
  }

  function renderParkPlan(container) {
    if (!container) return;
    const goal = nextBuildGoal();
    const nextLevel = Math.min(maxGateLevel, save.gateLevel + 1);
    const currentIncome = incomePerTick(save.gateLevel);
    const nextIncome = save.gateLevel >= maxGateLevel ? currentIncome : incomePerTick(nextLevel);
    const boost = Math.max(0, nextIncome - currentIncome);
    const dots = Array.from({ length: maxGateLevel }, (_, index) => {
      const level = index + 1;
      return `<i class="${level <= save.gateLevel ? "active" : ""}" aria-hidden="true"></i>`;
    }).join("");
    const status = save.gateLevel >= maxGateLevel
      ? t("nextUpgradeMax")
      : `${t("nextUpgrade")} ${formatCost(gateUpgradeCost())}`;
    const missing = Math.max(0, goal.cost - save.coins);
    const goalStatus = goal.type === "complete"
      ? t("nextUpgradeMax")
      : (missing <= 0 ? t("buildReady") : t("buildNeed", { coins: formatCost(missing) }));
    container.classList.toggle("ready", missing <= 0 && goal.type !== "complete");
    container.classList.toggle("complete", goal.type === "complete");
    container.innerHTML = `
      <div>
        <strong>${t("buildFocus")}</strong>
        <span>${goalStatus}</span>
      </div>
      <b>${goal.title}</b>
      <small>${goal.desc}</small>
      <i style="--build-progress:${Math.round(goal.progress * 100)}%"></i>
      <div class="park-plan-track">${dots}</div>
      <small>${t("parkRank")}: ${save.gateLevel}/${maxGateLevel} - ${status}${boost > 0 ? ` - ${t("incomeBoost", { n: formatNumber(boost) })}` : ""}</small>
    `;
  }

  function renderTourBoard(container) {
    if (!container) return;
    const targets = tourTargets();
    const progress = tourProgress();
    const ready = isTourComplete();
    container.classList.toggle("ready", ready);
    container.innerHTML = `
      <div class="tour-head">
        <strong>${t("tourBoard")}</strong>
        <span>${t("tourRound", { n: save.tourRound })}</span>
      </div>
      <div class="tour-list">
        <span>
          <b>${t("tourCollect", { coins: formatCost(targets.collected) })}</b>
          <small>${formatNumber(save.tour.collected)} / ${formatNumber(targets.collected)}</small>
          <i style="--tour-progress:${Math.round(progress.collected * 100)}%"></i>
        </span>
        <span>
          <b>${t("tourCare", { count: targets.cared })}</b>
          <small>${formatNumber(save.tour.cared)} / ${formatNumber(targets.cared)}</small>
          <i style="--tour-progress:${Math.round(progress.cared * 100)}%"></i>
        </span>
        <span>
          <b>${t("tourBuild", { count: targets.built })}</b>
          <small>${formatNumber(save.tour.built)} / ${formatNumber(targets.built)}</small>
          <i style="--tour-progress:${Math.round(progress.built * 100)}%"></i>
        </span>
      </div>
      <button type="button" data-action="tour-claim" ${ready ? "" : "disabled"}>${ready ? t("tourClaim") : t("tourReward", { coins: formatCost(targets.reward) })}</button>
    `;
    container.querySelector('[data-action="tour-claim"]')?.addEventListener("click", claimTourReward);
  }

  function renderTourReport(container) {
    if (!container) return;
    const targets = tourTargets();
    const ready = isTourComplete();
    const rows = [
      { label: t("tourCollect", { coins: formatCost(targets.collected) }), value: save.tour.collected, target: targets.collected },
      { label: t("tourCare", { count: targets.cared }), value: save.tour.cared, target: targets.cared },
      { label: t("tourBuild", { count: targets.built }), value: save.tour.built, target: targets.built },
    ];
    container.innerHTML = `
      <div class="tour-report-head">
        <strong>${t("tourBoard")}</strong>
        <span>${t("tourRound", { n: save.tourRound })}</span>
      </div>
      <div class="tour-reputation">
        <b>${t("tourReputation")} ${completedTours()}</b>
        <span>${t("tourReputationBonus", { n: Math.round(tourReputationRate() * 100) })}</span>
      </div>
      <div class="tour-report-list">
        ${rows.map((row) => `
          <div>
            <span>${row.label}</span>
            <small>${formatNumber(Math.min(row.value, row.target))} / ${formatNumber(row.target)}</small>
            <i style="--tour-progress:${Math.round(taskProgress(row.value, row.target) * 100)}%"></i>
          </div>
        `).join("")}
      </div>
      <button type="button" data-action="tour-report-claim" ${ready ? "" : "disabled"}>${ready ? t("tourClaim") : t("tourReward", { coins: formatCost(targets.reward) })}</button>
    `;
    container.querySelector('[data-action="tour-report-claim"]')?.addEventListener("click", claimTourReward);
  }

  function renderHabitatBonus(container) {
    if (!container) return;
    const count = unlockedAnimals().length;
    const currentBonus = Math.round(habitatBonusRate(count) * 100);
    const nextBonus = nextHabitatBonus(count);
    const progressTarget = nextBonus?.count || animals.length;
    const progress = taskProgress(count, progressTarget);
    container.innerHTML = `
      <div>
        <strong>${t("habitatBonus")}</strong>
        <span>${t("habitatBonusCurrent", { n: currentBonus })}</span>
      </div>
      <i style="--habitat-progress:${Math.round(progress * 100)}%"></i>
      <small>${nextBonus ? t("habitatBonusNext", { count: nextBonus.count, n: Math.round(nextBonus.bonus * 100) }) : t("habitatBonusMax")}</small>
    `;
  }

  let activeAnimalDrag = null;

  function cancelAnimalDrag() {
    activeAnimalDrag?.cancel();
  }

  function attachAnimalDrag(element, animal) {
    element.addEventListener("pointerdown", (event) => {
      if (!save.unlocked[animal.id] || activeAnimalDrag || event.isPrimary === false || event.button !== 0) return;
      const stage = element.closest(".savanna-stage");
      if (!stage) return;
      event.preventDefault();
      try { element.setPointerCapture?.(event.pointerId); } catch { /* Synthetic pointers cannot always be captured. */ }
      element.classList.add("dragging");
      const pointerId = event.pointerId;
      const startPosition = { ...animalPosition(animal) };
      let pendingPosition = startPosition;
      let settled = false;
      const move = (moveEvent) => {
        if (moveEvent.pointerId !== pointerId) return;
        const rect = stage.getBoundingClientRect();
        const bounds = animalBounds(animal);
        const x = clamp(((moveEvent.clientX - rect.left) / rect.width) * 100, bounds.minX, bounds.maxX);
        const y = clamp(((rect.bottom - moveEvent.clientY) / rect.height) * 100, bounds.minY, bounds.maxY);
        element.style.left = x + "%";
        element.style.bottom = y + "%";
        pendingPosition = { x, y };
      };
      const cleanup = () => {
        if (settled) return;
        settled = true;
        element.classList.remove("dragging");
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerup", end);
        document.removeEventListener("pointercancel", cancel);
        element.removeEventListener("lostpointercapture", cancel);
        activeAnimalDrag = null;
        if (element.hasPointerCapture?.(pointerId)) {
          try { element.releasePointerCapture(pointerId); } catch { /* Capture may already be gone. */ }
        }
      };
      const end = (endEvent) => {
        if (settled || endEvent.pointerId !== pointerId) return;
        save.positions[animal.id] = pendingPosition;
        cleanup();
        saveGame();
      };
      const cancel = (cancelEvent) => {
        if (settled || (cancelEvent?.type?.startsWith("pointer") && cancelEvent.pointerId !== pointerId)) return;
        element.style.left = startPosition.x + "%";
        element.style.bottom = startPosition.y + "%";
        cleanup();
      };
      activeAnimalDrag = { pointerId, cancel };
      document.addEventListener("pointermove", move);
      document.addEventListener("pointerup", end);
      document.addEventListener("pointercancel", cancel);
      element.addEventListener("lostpointercapture", cancel);
    });
  }

  window.addEventListener("blur", cancelAnimalDrag);
  window.addEventListener("pagehide", cancelAnimalDrag);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimalDrag();
  });

  function collectTickets() {
    const amount = Math.floor(save.ticketBox);
    if (amount <= 0) {
      popToast(t("noTickets"));
      playSound("error");
      return;
    }
    save.coins += amount;
    save.ticketBox = 0;
    save.lifetimeTickets += amount;
    save.tour.collected += amount;
    popToast(t("collected", { coins: formatNumber(amount) }));
    playSound("coin");
    saveGame();
    render();
  }

  function careAnimals() {
    const waitSeconds = careWaitSeconds();
    if (waitSeconds > 0) {
      popToast(t("careWait", { n: waitSeconds }));
      playSound("error");
      render();
      return;
    }
    openCareRoutes();
  }

  function careRouteTicketReward() {
    return Math.max(12, Math.floor(incomePerTick() * 2));
  }

  function openCareRoutes() {
    careRouteChoiceOpen = true;
    const card = nodes.habitatGrid.querySelector(".zoo-stage-card");
    card?.querySelector(".zoo-actions")?.classList.add("hidden");
    card?.querySelector(".care-route-actions")?.classList.remove("hidden");
    requestAnimationFrame(() => card?.querySelector('[data-action="route-habitat"]')?.focus({ preventScroll: true }));
  }

  function closeCareRoutes(restoreFocus = true) {
    careRouteChoiceOpen = false;
    const card = nodes.habitatGrid.querySelector(".zoo-stage-card");
    card?.querySelector(".zoo-actions")?.classList.remove("hidden");
    card?.querySelector(".care-route-actions")?.classList.add("hidden");
    if (restoreFocus) requestAnimationFrame(() => card?.querySelector('[data-action="care"]')?.focus({ preventScroll: true }));
  }

  function completeCareRoute(route) {
    if (!careRouteChoiceOpen) return;
    closeCareRoutes(false);
    save.careCount += 1;
    save.tour.cared += 1;
    const gain = unlockedAnimals().reduce((sum, animal) => sum + animal.care, 0) + facilityCareBonus();
    const habitatBoost = route === "habitat" ? 8 : 0;
    const ticketReward = route === "enrichment" ? careRouteTicketReward() : 0;
    save.happiness = clamp(save.happiness + gain + habitatBoost, 18, 100);
    save.ticketBox += ticketReward;
    save.careRoutes[route] += 1;
    save.careReadyAt = Date.now() + careCooldownMs;
    popHearts();
    pulseAnimals();
    popToast(route === "habitat"
      ? t("careRouteHabitatDone")
      : t("careRouteEnrichmentDone", { tickets: formatNumber(ticketReward) }));
    playSound("success");
    window.WonderAnalytics?.track("zoo_care_route", { game_id: GAME_ID, route });
    saveGame();
    render();
    requestAnimationFrame(() => nodes.habitatGrid.querySelector('[data-action="collect"]')?.focus({ preventScroll: true }));
  }

  function upgradeGate() {
    if (save.gateLevel >= maxGateLevel) return;
    const cost = gateUpgradeCost();
    if (save.coins < cost) return notEnough(cost);
    save.coins -= cost;
    save.gateLevel += 1;
    save.tour.built += 1;
    save.happiness = clamp(save.happiness + 7, 18, 100);
    popToast(t("upgraded"));
    playSound("upgrade");
    saveGame();
    render();
  }

  function buyAnimal(animalId) {
    const animal = animals.find((item) => item.id === animalId);
    if (!animal || save.unlocked[animal.id]) return;
    if (save.coins < animal.cost) return notEnough(animal.cost);
    save.coins -= animal.cost;
    save.unlocked[animal.id] = true;
    save.tour.built += 1;
    save.positions[animal.id] = animalPosition(animal);
    save.happiness = clamp(save.happiness + 12, 18, 100);
    newlyRecruitedAnimalId = animal.id;
    popToast(t("recruited", { name: t(animal.id) }));
    playSound("upgrade");
    window.WonderAnalytics?.track("animal_unlock", { game_id: GAME_ID, animal_id: animal.id });
    saveGame();
    render();
  }

  function upgradeFacility(facilityId) {
    const facility = facilities.find((item) => item.id === facilityId);
    if (!facility) return;
    const level = facilityLevel(facility);
    if (level >= facility.maxLevel) return;
    const cost = facilityCost(facility);
    if (save.coins < cost) return notEnough(cost);
    save.coins -= cost;
    save.facilities[facility.id] = level + 1;
    save.tour.built += 1;
    save.happiness = clamp(save.happiness + 5 + facility.careBonus, 18, 100);
    popToast(t("facilityBuilt", { name: facilityName(facility) }));
    playSound("upgrade");
    window.WonderAnalytics?.track("zoo_facility_upgrade", { game_id: GAME_ID, facility_id: facility.id, level: save.facilities[facility.id] });
    saveGame();
    render();
  }

  function claimMilestone(milestoneId) {
    const milestone = milestones.find((item) => item.id === milestoneId);
    if (!milestone || save.claimedMilestones[milestone.id]) return;
    if (milestoneProgress(milestone) < milestone.target) return;
    save.claimedMilestones[milestone.id] = true;
    save.coins += milestone.reward;
    popToast(t("milestoneClaimed"));
    playSound("coin");
    window.WonderAnalytics?.track("zoo_milestone_claim", { game_id: GAME_ID, milestone_id: milestone.id });
    saveGame();
    render();
  }

  function claimTourReward() {
    if (!isTourComplete()) return;
    const reportOpen = !nodes.resultPanel.classList.contains("hidden");
    const targets = tourTargets();
    save.coins += targets.reward;
    save.tourRound += 1;
    save.tour = { collected: 0, cared: 0, built: 0 };
    popToast(t("tourComplete"));
    playSound("success");
    window.WonderAnalytics?.track("zoo_tour_complete", { game_id: GAME_ID, round: save.tourRound - 1 });
    saveGame();
    render();
    if (reportOpen) {
      renderTourReport(nodes.tourReport);
      requestAnimationFrame(() => nodes.closeReportBtn.focus({ preventScroll: true }));
    }
  }

  function notEnough(cost = 0) {
    const missing = Math.max(1, Math.ceil(Number(cost || 0) - save.coins));
    popToast(t("notEnough", { coins: formatCost(missing) }));
    playSound("error");
  }

  function popHearts() {
    const stage = document.querySelector(".heart-field");
    if (!stage) return;
    for (let i = 0; i < 6; i += 1) {
      const heart = document.createElement("i");
      heart.textContent = "\u2665";
      heart.style.left = `${24 + i * 9}%`;
      heart.style.animationDelay = `${i * 70}ms`;
      stage.appendChild(heart);
      window.setTimeout(() => heart.remove(), 900);
    }
  }

  function pulseAnimals() {
    document.querySelectorAll(".animal").forEach((animal, index) => {
      window.setTimeout(() => {
        animal.classList.remove("fed");
        void animal.offsetWidth;
        animal.classList.add("fed");
        window.setTimeout(() => animal.classList.remove("fed"), 560);
      }, index * 45);
    });
  }

  function showReport() {
    cancelAnimalDrag();
    const score = Math.round(save.coins / 12 + save.ticketBox / 10 + save.careCount * 16 + save.gateLevel * 55 + unlockedAnimals().length * 80);
    const previous = Number(save.bestScore || 0);
    save.playCount += 1;
    save.lastScore = score;
    save.bestScore = Math.max(previous, score);
    saveGame();
    nodes.reportScore.textContent = score;
    nodes.reportText.textContent = score >= previous ? t("reportGood") : t("reportTry");
    nodes.focusStars.textContent = starText(save.careCount * 32 + save.happiness);
    nodes.logicStars.textContent = starText(save.gateLevel * 90 + unlockedAnimals().length * 34);
    nodes.animalStars.textContent = starText(unlockedAnimals().length * 95);
    renderTourReport(nodes.tourReport);
    renderAnimalAlbum(nodes.animalAlbum);
    nodes.gamePanel.classList.add("report-open");
    nodes.habitatGrid.inert = true;
    nodes.gamePanel.querySelector(".resource-row").inert = true;
    nodes.resultPanel.classList.remove("hidden");
    requestAnimationFrame(() => nodes.closeReportBtn.focus({ preventScroll: true }));
    window.WonderAnalytics?.track("game_complete", { game_id: GAME_ID, score, animals: unlockedAnimals().length });
  }

  function closeReport() {
    nodes.resultPanel.classList.add("hidden");
    nodes.gamePanel.classList.remove("report-open");
    nodes.habitatGrid.inert = false;
    nodes.gamePanel.querySelector(".resource-row").inert = false;
    nodes.gamePanel.querySelector('[data-action="report"]')?.focus({ preventScroll: true });
  }

  function renderAnimalAlbum(container) {
    if (!container) return;
    const unlockedCount = unlockedAnimals().length;
    container.innerHTML = `
      <div class="animal-album-head">
        <strong>${t("animalAlbum")}</strong>
        <span>${t("animalAlbumProgress", { count: unlockedCount, total: animals.length })}</span>
      </div>
      <div class="animal-album-grid">
        ${animals.map((animal) => {
          const unlocked = Boolean(save.unlocked[animal.id]);
          return `
            <article class="animal-album-card ${unlocked ? "unlocked" : "locked"}">
              <img src="${animal.asset}" alt="${unlocked ? t(animal.id) : ""}" draggable="false" />
              <strong>${unlocked ? t(animal.id) : "?"}</strong>
              <small>${unlocked ? t("animalAlbumIncome", { n: formatNumber(animal.baseIncome) }) : t("animalAlbumLocked")}</small>
            </article>
          `;
        }).join("")}
      </div>
    `;
  }

  function starText(score) {
    const count = clamp(Math.ceil(score / 95), 1, 5);
    return "\u2605".repeat(count) + "\u2606".repeat(5 - count);
  }

  function popToast(message) {
    const toast = document.createElement("div");
    toast.className = "zoo-toast";
    toast.textContent = message;
    (nodes.gamePanel || document.body).appendChild(toast);
    window.setTimeout(() => toast.remove(), 1300);
  }

  function playSound(name) {
    window.WonderSound?.play?.(name);
  }

  function startGame() {
    if (!nodes.gamePanel.classList.contains("hidden")) return;
    document.body.classList.add("zoo-playing");
    document.querySelector(".zoo-app")?.classList.add("is-playing");
    nodes.localeSelect.closest(".language-picker")?.setAttribute("aria-hidden", "true");
    nodes.menuPanel.classList.add("hidden");
    nodes.gamePanel.classList.remove("hidden");
    updateZooBattleScale();
    applyOffline();
    render();
    requestAnimationFrame(render);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    window.WonderAnalytics?.track("game_start", { game_id: GAME_ID });
  }

  function updateZooBattleScale() {
    // The shared Battle Canvas controller is the single viewport-scale owner.
    // Zoo Idle declares the same 382x780 logical shell in its local CSS.
  }

  function showMenu() {
    if (nodes.gamePanel.classList.contains("hidden")) return;
    cancelAnimalDrag();
    document.body.classList.remove("zoo-playing");
    document.querySelector(".zoo-app")?.classList.remove("is-playing");
    nodes.localeSelect.closest(".language-picker")?.removeAttribute("aria-hidden");
    nodes.gamePanel.classList.add("hidden");
    nodes.menuPanel.classList.remove("hidden");
    closeReport();
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  window.addEventListener("resize", updateZooBattleScale, { passive: true });
  window.addEventListener("orientationchange", updateZooBattleScale, { passive: true });
  window.visualViewport?.addEventListener("resize", updateZooBattleScale, { passive: true });
  window.visualViewport?.addEventListener("scroll", updateZooBattleScale, { passive: true });

  function tickPark() {
    if (nodes.gamePanel.classList.contains("hidden")) return;
    tickCount += 1;
    save.ticketBox += incomePerTick();
    save.happiness = clamp(save.happiness - Math.max(0.12, 0.28 - facilityLevel(facilities[2]) * 0.03), 18, 100);
    if (tickCount % 3 === 0) saveGame();
    render();
  }

  function tickUi() {
    if (!nodes.gamePanel.classList.contains("hidden")) render();
  }

  function loadAssets() {
    const assets = [
      ASSETS.cover,
      ASSETS.stage,
      ASSETS.lion,
      ASSETS.keeper,
      ASSETS.gate1,
      ASSETS.ticketBooth,
      visitorAssets[0],
    ];
    let done = 0;
    const finish = () => {
      done += 1;
      const pct = Math.round((done / assets.length) * 100);
      nodes.loadingText.textContent = `${pct}%`;
      nodes.loadingFill.style.width = `${pct}%`;
      if (done >= assets.length) {
        window.WonderAnalytics?.track("game_ready", { game_id: GAME_ID });
        window.setTimeout(() => nodes.loadingPanel.classList.add("hidden"), 180);
      }
    };
    assets.forEach((src) => {
      const img = new Image();
      img.onload = finish;
      img.onerror = finish;
      img.src = src;
    });
    window.setTimeout(() => {
      if (!nodes.loadingPanel.classList.contains("hidden")) {
        nodes.loadingText.textContent = "100%";
        nodes.loadingFill.style.width = "100%";
        nodes.loadingPanel.classList.add("hidden");
      }
    }, 1400);
  }

  nodes.localeSelect.addEventListener("change", () => {
    locale = nodes.localeSelect.value;
    window.WonderI18n?.setLocale?.(locale);
    localStorage.setItem(localeKey, locale);
    window.dispatchEvent(new CustomEvent("wonder:locale-change", { detail: { locale } }));
    localizeStatic();
    render();
  });
  window.addEventListener("wonder:locale-change", (event) => {
    if (event.detail?.locale && event.detail.locale !== locale) {
      locale = event.detail.locale;
      nodes.localeSelect.value = locale;
      window.WonderI18n?.setLocale?.(locale);
      localStorage.setItem(localeKey, locale);
      localizeStatic();
      render();
    }
  });
  nodes.startBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    startGame();
  });
  nodes.backToMenuBtn.addEventListener("click", showMenu);
  window.addEventListener("weightplay:tutorial-start", (event) => {
    if (event.detail?.gameId === GAME_ID) startGame();
  });
  nodes.reportBtn?.addEventListener("click", showReport);
  nodes.closeReportBtn.addEventListener("click", closeReport);
  window.addEventListener("beforeunload", saveGame);

  localizeStatic();
  document.documentElement.dataset.zooIdleBasicReady = "true";
  loadAssets();
  window.setInterval(tickUi, 1000);
  window.setInterval(tickPark, 10000);
})();
