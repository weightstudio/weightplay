(() => {
  const GAME_ID = "bubble-bakery";
  const canvasRoot = document.querySelector(".bakery-game");
  if (canvasRoot) {
    canvasRoot.dataset.wpCanvasMaxWidth = "920";
    window.dispatchEvent(new Event("resize"));
  }
  const localeKey = "weightplayLocale";
  const sharedLocaleKey = "weightPlayLocale";
  const unlockKey = "weightplay_bubble_bakery_unlocked";
  const starKey = "weightplay_bubble_bakery_stars";
  const progressKey = "weightplay_bubble_bakery_progress";
  const statsKey = "weightplay_bubble_bakery_stats";
  const smokeMode = new URLSearchParams(location.search).has("smoke");

  const text = {
    en: {
      gameTitle: "Animal Bubble Bakery",
      pageTitle: "Animal Bubble Bakery - WeightPlay",
      language: "Language",
      localeSelect: "Language selection",
      coachCard: "Bakery coach",
      stageList: "Stage list",
      orderList: "Bakery orders",
      bubbleBoard: "Bubble board",
      bubbleSingle: "{animal}, row {row}, column {column}; connected group of 1, needs {minimum} to clear",
      bubbleOrderSingle: "{animal} order target, row {row}, column {column}; connected group of 1, needs {minimum} to clear",
      bubbleGroup: "{animal}, row {row}, column {column}; connected group of {count}; two clears, order minimum {minimum}",
      bubbleOrderGroup: "{animal} order target, row {row}, column {column}; connected group of {count}; two clears, order minimum {minimum}",
      bunny: "Bunny",
      whale: "Whale",
      chick: "Chick",
      frog: "Frog",
      fox: "Fox",
      chooseStage: "Choose Stage",
      menuHint: "Tap 2 or more connected matching bubbles to fill bakery orders.",
      startGame: "Start Game",
      back: "Back",
      stages: "Stages",
      loading: "Loading",
      nextStage: "Next Stage",
      retry: "Try Again",
      lobby: "Lobby",
      locked: "Stage locked",
      unlockRequirement: "Complete {stage} to unlock this tray.",
      moves: "Moves",
      score: "Score",
      stage: "Stage {n}",
      theme: "Order: {theme}",
      movesCount: "{n} moves",
      orderDone: "Order complete!",
      failed: "Try this order again.",
      resultWin: "You filled every order with {moves} moves left.",
      resultLose: "Collect the needed bubbles before moves run out.",
      smallGroup: "Tap 2 or more connected matching bubbles.",
      notOrderTarget: "Nice group, but the order needs the glowing animal bubbles.",
      orderStreak: "Order streak x{streak}! +{bonus}",
      collect: "Collect {n}",
      skillReport: "Skill Report",
      previousBest: "Previous Best",
      todayScore: "Today",
      improvement: "Improvement",
      logic: "Logic",
      focus: "Focus",
      problemSolving: "Problem Solving",
      targetHitEvidence: "Order hits {hits}/{moves}",
      largestGroupEvidence: "Largest group {count}",
      bestStreakEvidence: "Best streak x{count}",
      reportGreat: "Great progress! Your child planned groups well and stayed focused.",
      reportGood: "Good effort! Try again to improve focus and finish more orders.",
      reportNewBest: "Amazing progress! This is a new best score for this stage.",
      themeCozyStart: "Cozy Bunny Box",
      themeOceanCupcakes: "Ocean Cupcakes",
      themeSunnyChickTray: "Sunny Chick Tray",
      themeGardenMix: "Garden Mix",
      themeFoxBerryCake: "Fox Berry Cake",
      themeWhaleMintRolls: "Whale Mint Rolls",
      themeRainbowCookies: "Rainbow Cookies",
      themeForestPicnic: "Forest Picnic",
      themePartyTray: "Party Tray",
      themeMasterBakery: "Master Bakery",
      bakeryProgress: "Bakery Progress",
      clearedStages: "Cleared {done}/{total}",
      totalStars: "Stars {stars}/{total}",
      nextGoal: "Next: clear {stage}",
      perfectOrders: "Mastered {done}/{total}",
      nextPerfectGoal: "Replay: master {stage}",
      allOrdersDone: "All bakery orders complete!",
      stageNew: "New",
      stageImprove: "Improve",
      stageMastered: "Mastered",
      coachName: "Panko the Bakery Coach",
      coachTip: "Plan the biggest matching group first, then save moves for the glowing order bubbles.",
      recommendedTitle: "Panko's Pick",
      recommendedCopy: "{stage} · {theme}",
      recommendedNew: "Clear this order to unlock the next bakery tray.",
      recommendedImprove: "Replay this order to earn more stars.",
      recommendedMastered: "Everything is mastered. Replay your newest favorite order.",
      resultNextTitle: "Next bakery order",
      resultUnlocked: "New tray unlocked: {stage}",
      resultReplay: "Replay goal: earn more stars on {stage}",
      resultNextCopy: "{stage} · {theme}",
      resultAllClear: "All trays are open. Replay any order to master every star.",
      resultTryAgainGoal: "Try again: {stage} still needs these order bubbles.",
      customerStamps: "Customer Stamps",
      stampOrders: "Orders {orders}",
      stampStickers: "Stickers {stickers}",
      nextSticker: "{n} to next sticker",
      stickerReady: "Sticker ready!",
      resultStampWin: "Stamp +1 · {next}",
      resultStampLose: "Finish the order to earn a stamp.",
      groupTooSmall: "This tray needs a connected group of {count}.",
      sequenceNext: "Next order: {animal}.",
      recipeNext: "Tray {current}/{total} is ready!",
      recipeProgress: "Tray {current}/{total}",
      groupGoal: "Largest group {done}/{need}",
      pankoCheck: "Panko Check",
    },
    "zh-Hant": {
      gameTitle: "動物泡泡烘焙坊",
      pageTitle: "動物泡泡烘焙坊 - WeightPlay",
      language: "語言",
      localeSelect: "語言選擇",
      coachCard: "烘焙教練",
      stageList: "關卡列表",
      orderList: "烘焙訂單",
      bubbleBoard: "泡泡棋盤",
      bubbleSingle: "{animal}，第 {row} 列，第 {column} 欄；相連 1 個，需要 {minimum} 個才能消除",
      bubbleOrderSingle: "訂單目標 {animal}，第 {row} 列，第 {column} 欄；相連 1 個，需要 {minimum} 個才能消除",
      bubbleGroup: "{animal}，第 {row} 列，第 {column} 欄；相連 {count} 個；兩個即可消除，訂單門檻 {minimum} 個",
      bubbleOrderGroup: "訂單目標 {animal}，第 {row} 列，第 {column} 欄；相連 {count} 個；兩個即可消除，訂單門檻 {minimum} 個",
      bunny: "兔兔",
      whale: "鯨魚",
      chick: "小雞",
      frog: "青蛙",
      fox: "狐狸",
      chooseStage: "選擇關卡",
      menuHint: "點擊 2 個以上相連的相同動物泡泡，完成烘焙訂單。",
      startGame: "開始遊戲",
      back: "返回",
      stages: "關卡",
      loading: "載入中",
      nextStage: "下一關",
      retry: "再玩一次",
      lobby: "大廳",
      locked: "關卡尚未解鎖",
      unlockRequirement: "完成{stage}即可解鎖這個烘焙盤。",
      moves: "步數",
      score: "分數",
      stage: "第 {n} 關",
      theme: "訂單：{theme}",
      movesCount: "{n} 步",
      orderDone: "訂單完成！",
      failed: "再挑戰一次這張訂單。",
      resultWin: "你完成了所有訂單，還剩 {moves} 步。",
      resultLose: "步數用完前，要收集訂單需要的泡泡。",
      smallGroup: "請點擊 2 個以上相連的相同泡泡。",
      notOrderTarget: "這組可以消除，但訂單需要發光的動物泡泡。",
      orderStreak: "訂單連擊 x{streak}！+{bonus}",
      collect: "收集 {n}",
      skillReport: "能力小報告",
      previousBest: "之前最佳",
      todayScore: "本次分數",
      improvement: "進步幅度",
      logic: "邏輯",
      focus: "專注",
      problemSolving: "解題",
      targetHitEvidence: "訂單命中 {hits}/{moves}",
      largestGroupEvidence: "最大群組 {count}",
      bestStreakEvidence: "最高連擊 x{count}",
      reportGreat: "很棒的進步！孩子有好好規劃泡泡群組，也維持了專注。",
      reportGood: "努力得很好！再試一次，可以練習更專注並完成更多訂單。",
      reportNewBest: "太棒了！這一關拿到新的最佳分數。",
      themeCozyStart: "兔兔暖心盒",
      themeOceanCupcakes: "海洋杯子蛋糕",
      themeSunnyChickTray: "小雞陽光盤",
      themeGardenMix: "花園綜合盤",
      themeFoxBerryCake: "狐狸莓果蛋糕",
      themeWhaleMintRolls: "鯨魚薄荷捲",
      themeRainbowCookies: "彩虹餅乾盤",
      themeForestPicnic: "森林野餐盒",
      themePartyTray: "派對點心盤",
      themeMasterBakery: "大師烘焙訂單",
      bakeryProgress: "烘焙進度",
      clearedStages: "已完成 {done}/{total}",
      totalStars: "星星 {stars}/{total}",
      nextGoal: "下一步：完成{stage}",
      perfectOrders: "精通 {done}/{total}",
      nextPerfectGoal: "重玩：精通{stage}",
      allOrdersDone: "全部烘焙訂單完成！",
      stageNew: "新關卡",
      stageImprove: "再提升",
      stageMastered: "已精通",
      coachName: "Panko 烘焙教練",
      coachTip: "先找最大的相同泡泡群，再把步數留給發光的訂單泡泡。",
      recommendedTitle: "Panko 推薦",
      recommendedCopy: "{stage} · {theme}",
      recommendedNew: "完成這張訂單，就能解鎖下一個烘焙盤。",
      recommendedImprove: "重玩這張訂單，試著拿到更多星星。",
      recommendedMastered: "全部都精通了！可以重玩最新喜歡的訂單。",
      resultNextTitle: "下一張烘焙訂單",
      resultUnlocked: "新烘焙盤解鎖：{stage}",
      resultReplay: "重玩目標：在{stage}拿更多星星",
      resultNextCopy: "{stage} · {theme}",
      resultAllClear: "全部烘焙盤都開放了，重玩任何訂單來補滿星星。",
      resultTryAgainGoal: "再挑戰：{stage}還需要這些訂單泡泡。",
      customerStamps: "常客印章",
      stampOrders: "訂單 {orders}",
      stampStickers: "貼紙 {stickers}",
      nextSticker: "再 {n} 張換貼紙",
      stickerReady: "可以換貼紙了！",
      resultStampWin: "印章 +1 · {next}",
      resultStampLose: "完成訂單就能拿印章。",
      groupTooSmall: "這個烘焙盤需要至少 {count} 個相連泡泡。",
      sequenceNext: "下一個訂單：{animal}。",
      recipeNext: "第 {current}/{total} 盤準備好了！",
      recipeProgress: "第 {current}/{total} 盤",
      groupGoal: "最大群組 {done}/{need}",
      pankoCheck: "Panko 檢查",
    },
    es: {
      gameTitle: "Pastelería de Burbujas Animales", pageTitle: "Pastelería de Burbujas Animales - WeightPlay", language: "Idioma", localeSelect: "Selección de idioma",
      coachCard: "Entrenador de pastelería", stageList: "Lista de niveles", orderList: "Pedidos de pastelería", bubbleBoard: "Tablero de burbujas",
      bubbleSingle: "{animal}, fila {row}, columna {column}; grupo conectado de 1, necesita {minimum} para eliminarse",
      bubbleOrderSingle: "Objetivo del pedido: {animal}, fila {row}, columna {column}; grupo conectado de 1, necesita {minimum} para eliminarse",
      bubbleGroup: "{animal}, fila {row}, columna {column}; grupo conectado de {count}; dos eliminan, mínimo del pedido {minimum}",
      bubbleOrderGroup: "Objetivo del pedido: {animal}, fila {row}, columna {column}; grupo conectado de {count}; dos eliminan, mínimo del pedido {minimum}",
      bunny: "Conejo", whale: "Ballena", chick: "Pollito", frog: "Rana", fox: "Zorro",
      chooseStage: "Elegir nivel", menuHint: "Toca 2 o más burbujas iguales conectadas para completar los pedidos.", startGame: "Empezar", back: "Volver", stages: "Niveles", loading: "Cargando",
      nextStage: "Siguiente nivel", retry: "Intentar de nuevo", lobby: "Sala de juegos", locked: "Nivel bloqueado", unlockRequirement: "Completa {stage} para desbloquear esta bandeja.",
      moves: "Movimientos", score: "Puntuación", stage: "Nivel {n}", theme: "Pedido: {theme}", movesCount: "{n} movimientos", orderDone: "¡Pedido completado!", failed: "Intenta de nuevo este pedido.",
      resultWin: "Completaste todos los pedidos con {moves} movimientos restantes.", resultLose: "Recoge las burbujas necesarias antes de quedarte sin movimientos.",
      smallGroup: "Toca 2 o más burbujas iguales conectadas.", notOrderTarget: "Buen grupo, pero el pedido necesita las burbujas animales iluminadas.", orderStreak: "¡Racha de pedidos x{streak}! +{bonus}", collect: "Recoge {n}",
      skillReport: "Informe de habilidades", previousBest: "Mejor anterior", todayScore: "Hoy", improvement: "Mejora", logic: "Lógica", focus: "Concentración", problemSolving: "Resolución de problemas",
      targetHitEvidence: "Aciertos de pedido {hits}/{moves}", largestGroupEvidence: "Grupo mayor: {count}", bestStreakEvidence: "Mejor racha x{count}",
      reportGreat: "¡Gran progreso! Se planificaron bien los grupos y se mantuvo la concentración.", reportGood: "¡Buen esfuerzo! Inténtalo de nuevo para completar más pedidos.", reportNewBest: "¡Progreso increíble! Es una nueva mejor puntuación para este nivel.",
      themeCozyStart: "Caja acogedora del conejo", themeOceanCupcakes: "Cupcakes del océano", themeSunnyChickTray: "Bandeja soleada del pollito", themeGardenMix: "Mezcla del jardín", themeFoxBerryCake: "Pastel de bayas del zorro",
      themeWhaleMintRolls: "Rollos de menta de la ballena", themeRainbowCookies: "Galletas arcoíris", themeForestPicnic: "Pícnic del bosque", themePartyTray: "Bandeja de fiesta", themeMasterBakery: "Pastelería maestra",
      bakeryProgress: "Progreso de la pastelería", clearedStages: "Completados {done}/{total}", totalStars: "Estrellas {stars}/{total}", nextGoal: "Siguiente: completa {stage}", perfectOrders: "Dominados {done}/{total}",
      nextPerfectGoal: "Repetir: domina {stage}", allOrdersDone: "¡Todos los pedidos completados!", stageNew: "Nuevo", stageImprove: "Mejorar", stageMastered: "Dominado",
      coachName: "Panko, entrenador de pastelería", coachTip: "Planifica primero el grupo más grande y guarda movimientos para las burbujas iluminadas del pedido.", recommendedTitle: "Elección de Panko", recommendedCopy: "{stage} · {theme}",
      recommendedNew: "Completa este pedido para abrir la siguiente bandeja.", recommendedImprove: "Repite este pedido para ganar más estrellas.", recommendedMastered: "Todo está dominado. Repite tu pedido favorito más reciente.",
      resultNextTitle: "Siguiente pedido", resultUnlocked: "Nueva bandeja desbloqueada: {stage}", resultReplay: "Objetivo al repetir: gana más estrellas en {stage}", resultNextCopy: "{stage} · {theme}",
      resultAllClear: "Todas las bandejas están abiertas. Repite cualquier pedido para dominar todas las estrellas.", resultTryAgainGoal: "Inténtalo de nuevo: {stage} aún necesita estas burbujas.",
      customerStamps: "Sellos de cliente", stampOrders: "Pedidos {orders}", stampStickers: "Pegatinas {stickers}", nextSticker: "{n} para la siguiente pegatina", stickerReady: "¡Pegatina lista!",
      resultStampWin: "Sello +1 · {next}", resultStampLose: "Completa el pedido para ganar un sello.", groupTooSmall: "Esta bandeja necesita un grupo conectado de {count}.", sequenceNext: "Siguiente pedido: {animal}.",
      recipeNext: "¡La bandeja {current}/{total} está lista!", recipeProgress: "Bandeja {current}/{total}", groupGoal: "Grupo mayor {done}/{need}", pankoCheck: "Prueba de Panko",
    },
  };

  Object.assign(text.en, { leaveTitle:"Leave this order?", leaveText:"Your tray, moves, and order progress will reset.", keepBaking:"Keep baking", leaveOrder:"Leave order" });
  Object.assign(text["zh-Hant"], { leaveTitle:"\u8981\u96e2\u958b\u9019\u5f35\u8a02\u55ae\u55ce\uff1f", leaveText:"\u9019\u76e4\u6ce1\u6ce1\u3001\u6b65\u6578\u8207\u8a02\u55ae\u9032\u5ea6\u6703\u91cd\u65b0\u958b\u59cb\u3002", keepBaking:"\u7e7c\u7e8c\u70d8\u7119", leaveOrder:"\u96e2\u958b\u8a02\u55ae" });
  Object.assign(text.es, { leaveTitle:"¿Salir de este pedido?", leaveText:"Se reiniciarán la bandeja, los movimientos y el progreso del pedido.", keepBaking:"Seguir horneando", leaveOrder:"Salir del pedido" });

  const colors = [
    { id: "berry", labelKey: "bunny", asset: "../../assets/bubble-bakery-bunny.png" },
    { id: "sky", labelKey: "whale", asset: "../../assets/bubble-bakery-whale.png" },
    { id: "lemon", labelKey: "chick", asset: "../../assets/bubble-bakery-chick.png" },
    { id: "mint", labelKey: "frog", asset: "../../assets/bubble-bakery-frog.png" },
    { id: "grape", labelKey: "fox", asset: "../../assets/bubble-bakery-fox.png" },
  ];

  const bakeryStage = (titleEn, titleZh, ruleEn, ruleZh, moves, palette, orders, rules = {}) => ({
    titleEn, titleZh, ruleEn, ruleZh, moves, palette, orders, recipes: rules.recipes || [orders], ...rules,
  });

  const stages = [
    bakeryStage("Cozy Bunny Box", "兔兔暖心盒", "Clear connected groups of two or more.", "消除兩個以上相連泡泡。", 16, ["berry", "sky", "lemon"], { berry: 8, sky: 8 }),
    bakeryStage("Ocean Cupcakes", "海洋杯子蛋糕", "Choose between two order animals.", "在兩種訂單動物間選擇。", 17, ["berry", "sky", "lemon", "mint"], { sky: 10, lemon: 8 }),
    bakeryStage("Sunny Group Tray", "陽光群組盤", "Finish the order and make one group of three.", "完成訂單並做出三個相連群組。", 18, ["berry", "sky", "lemon", "mint"], { lemon: 10, berry: 8, mint: 6 }, { groupGoal: 3 }),
    bakeryStage("Garden Double Batch", "花園雙倍批次", "Groups of four earn two extra order bubbles.", "四個以上群組可多算兩個訂單泡泡。", 18, ["berry", "sky", "lemon", "mint"], { mint: 10, sky: 8 }, { comboThreshold: 4, comboBonus: 2 }),
    bakeryStage("Panko's First Check", "Panko 初次檢查", "Only groups of three or more fill the order.", "只有三個以上群組能填入訂單。", 19, ["berry", "sky", "lemon", "mint"], { berry: 9, lemon: 9, mint: 6 }, { minOrderGroup: 3, groupGoal: 4, checkpoint: true }),
    bakeryStage("Whale Mint Rolls", "鯨魚薄荷捲", "Build a group of four while filling three targets.", "完成三種目標並組出四個群組。", 20, ["sky", "lemon", "mint", "grape"], { sky: 10, mint: 10, lemon: 6 }, { groupGoal: 4 }),
    bakeryStage("Berry Cluster Cake", "莓果群組蛋糕", "Target groups need at least three bubbles.", "目標群組至少需要三個泡泡。", 20, ["berry", "sky", "lemon", "grape"], { berry: 12, grape: 9 }, { minOrderGroup: 3 }),
    bakeryStage("Fox Double Cookies", "狐狸雙倍餅乾", "Large fox and bunny groups fill orders faster.", "大型狐狸與兔兔群組能更快完成訂單。", 20, ["berry", "sky", "mint", "grape"], { grape: 12, berry: 10 }, { comboThreshold: 4, comboBonus: 2 }),
    bakeryStage("Rainbow Big Batches", "彩虹大批次", "Use groups of three; groups of five gain a bonus.", "使用三個群組，五個群組可再加成。", 21, ["berry", "sky", "lemon", "mint", "grape"], { berry: 9, lemon: 9, grape: 9 }, { minOrderGroup: 3, comboThreshold: 5, comboBonus: 2 }),
    bakeryStage("Panko's Big-Batch Check", "Panko 大批次檢查", "Fill every order with groups of four or more.", "所有訂單都要用四個以上群組完成。", 22, ["berry", "sky", "lemon", "mint"], { sky: 12, lemon: 12, mint: 8 }, { minOrderGroup: 4, groupGoal: 5, checkpoint: true }),
    bakeryStage("Bunny-First Queue", "兔兔優先隊列", "Orders must be filled in the shown sequence.", "必須依顯示順序完成訂單。", 19, ["berry", "sky", "lemon", "mint"], { berry: 8, sky: 8, lemon: 6 }, { sequence: true }),
    bakeryStage("Ocean Order Queue", "海洋訂單隊列", "Whale, frog, then fox orders take turns.", "鯨魚、青蛙、狐狸訂單依序輪流。", 20, ["berry", "sky", "mint", "grape"], { sky: 8, mint: 8, grape: 6 }, { sequence: true }),
    bakeryStage("Garden Order Queue", "花園訂單隊列", "Follow the queue and make a group of four.", "依序完成並做出四個群組。", 21, ["berry", "lemon", "mint", "grape"], { mint: 9, lemon: 8, grape: 6 }, { sequence: true, groupGoal: 4 }),
    bakeryStage("Fox Bonus Queue", "狐狸加成隊列", "Follow the queue; groups of four gain two extra.", "依序完成，四個群組可多算兩個。", 21, ["berry", "sky", "lemon", "grape"], { grape: 10, berry: 8, sky: 6 }, { sequence: true, comboThreshold: 4, comboBonus: 2 }),
    bakeryStage("Panko's Queue Check", "Panko 隊列檢查", "Complete two trays in order without resetting the board.", "不重置棋盤，依序完成兩盤訂單。", 24, ["berry", "sky", "lemon", "mint"], { berry: 6, sky: 6 }, { sequence: true, recipes: [{ berry: 6, sky: 6 }, { lemon: 7, mint: 7 }], checkpoint: true }),
    bakeryStage("Two-Tray Brunch", "雙盤早午餐", "A second recipe appears after the first tray.", "第一盤完成後會出現第二張食譜。", 22, ["berry", "sky", "lemon", "mint"], { berry: 7, lemon: 7 }, { recipes: [{ berry: 7, lemon: 7 }, { sky: 7, mint: 7 }] }),
    bakeryStage("Garden Two-Course", "花園雙道餐", "Plan one board across two different recipes.", "在同一棋盤規劃兩張不同食譜。", 23, ["berry", "lemon", "mint", "grape"], { mint: 8, grape: 6 }, { recipes: [{ mint: 8, grape: 6 }, { berry: 7, lemon: 7 }] }),
    bakeryStage("Berry Course Pair", "莓果雙道餐", "Two recipes also require a group of four.", "兩張食譜還要完成四個群組。", 24, ["berry", "sky", "lemon", "grape"], { berry: 8, grape: 7 }, { recipes: [{ berry: 8, grape: 7 }, { sky: 7, lemon: 7 }], groupGoal: 4 }),
    bakeryStage("Rainbow Course Pair", "彩虹雙道餐", "Large batches help finish both recipes.", "大型批次能加速完成兩張食譜。", 24, ["berry", "sky", "lemon", "mint", "grape"], { sky: 7, mint: 7 }, { recipes: [{ sky: 7, mint: 7 }, { berry: 7, lemon: 7, grape: 6 }], comboThreshold: 4, comboBonus: 2 }),
    bakeryStage("Panko's Three-Course Check", "Panko 三道餐檢查", "Serve three short recipes on one continuing board.", "在同一棋盤連續完成三張短食譜。", 27, ["berry", "sky", "lemon", "mint", "grape"], { berry: 6, sky: 6 }, { recipes: [{ berry: 6, sky: 6 }, { lemon: 6, mint: 6 }, { grape: 7, berry: 5 }], checkpoint: true }),
    bakeryStage("Big Queue", "大型隊列", "Follow the order using groups of three or more.", "依序使用三個以上群組完成。", 22, ["berry", "sky", "lemon", "mint"], { berry: 9, sky: 9, mint: 6 }, { sequence: true, minOrderGroup: 3 }),
    bakeryStage("Double-Course Bonus", "雙道加成餐", "Large groups earn bonuses across two recipes.", "大型群組在兩張食譜中都能取得加成。", 24, ["berry", "sky", "mint", "grape"], { sky: 8, grape: 7 }, { recipes: [{ sky: 8, grape: 7 }, { berry: 7, mint: 7 }], comboThreshold: 4, comboBonus: 2 }),
    bakeryStage("Careful Rainbow", "彩虹精準盤", "Groups need three; one group must reach five.", "群組至少三個，並要有一次達到五個。", 24, ["berry", "sky", "lemon", "mint", "grape"], { berry: 9, lemon: 9, grape: 6 }, { minOrderGroup: 3, groupGoal: 5 }),
    bakeryStage("Switching Trays", "切換烘焙盤", "Each recipe has its own ordered queue.", "每張食譜都有自己的依序隊列。", 25, ["berry", "sky", "lemon", "mint"], { berry: 7, lemon: 7 }, { sequence: true, recipes: [{ berry: 7, lemon: 7 }, { sky: 7, mint: 7 }] }),
    bakeryStage("Panko's Festival Check", "Panko 慶典檢查", "Two queued trays use three-bubble groups and bonuses.", "兩張依序烘焙盤結合三個群組與加成。", 27, ["berry", "sky", "lemon", "mint", "grape"], { berry: 7, sky: 7 }, { sequence: true, minOrderGroup: 3, recipes: [{ berry: 7, sky: 7 }, { lemon: 7, mint: 7, grape: 5 }], comboThreshold: 5, comboBonus: 2, checkpoint: true }),
    bakeryStage("Master Clusters", "大師群組", "Order groups need four and one must reach six.", "訂單群組至少四個，且要有一次達到六個。", 25, ["berry", "sky", "lemon", "mint"], { berry: 12, sky: 12, mint: 8 }, { minOrderGroup: 4, groupGoal: 6 }),
    bakeryStage("Master Queue", "大師隊列", "Queued groups need three; groups of five earn extra.", "依序群組至少三個，五個群組可加成。", 26, ["berry", "sky", "lemon", "grape"], { berry: 9, sky: 9, grape: 7 }, { sequence: true, minOrderGroup: 3, comboThreshold: 5, comboBonus: 2 }),
    bakeryStage("Triple Service", "三盤服務", "Three recipes share a five-group mastery target.", "三張食譜共用一次五個群組目標。", 29, ["berry", "sky", "lemon", "mint", "grape"], { berry: 6, sky: 6 }, { recipes: [{ berry: 6, sky: 6 }, { lemon: 6, mint: 6 }, { grape: 7, berry: 5 }], groupGoal: 5 }),
    bakeryStage("Grand Rehearsal", "慶典總彩排", "Two queued recipes combine minimum groups and bonuses.", "兩張依序食譜結合群組門檻與加成。", 28, ["berry", "sky", "lemon", "mint", "grape"], { berry: 7, lemon: 7 }, { sequence: true, minOrderGroup: 3, recipes: [{ berry: 7, lemon: 7 }, { sky: 7, mint: 7, grape: 5 }], comboThreshold: 5, comboBonus: 2 }),
    bakeryStage("Panko's Master Bakery", "Panko 大師烘焙坊", "Serve three queued trays with four-bubble groups and a group of six.", "用四個群組依序完成三盤，並做出一次六個群組。", 32, ["berry", "sky", "lemon", "mint", "grape"], { berry: 6, sky: 6 }, { sequence: true, minOrderGroup: 4, recipes: [{ berry: 6, sky: 6 }, { lemon: 6, mint: 6 }, { grape: 7, berry: 5 }], comboThreshold: 6, comboBonus: 2, groupGoal: 6, checkpoint: true }),
  ];

  const spanishStageCopy = [
    ["Caja acogedora del conejo", "Elimina grupos conectados de dos o más."],
    ["Cupcakes del océano", "Elige entre dos animales del pedido."],
    ["Bandeja soleada de grupos", "Completa el pedido y forma un grupo de tres."],
    ["Lote doble del jardín", "Los grupos de cuatro suman dos burbujas extra al pedido."],
    ["Primera prueba de Panko", "Solo los grupos de tres o más completan el pedido."],
    ["Rollos de menta de la ballena", "Forma un grupo de cuatro mientras completas tres objetivos."],
    ["Pastel de grupos de bayas", "Los grupos objetivo necesitan al menos tres burbujas."],
    ["Galletas dobles del zorro", "Los grupos grandes de zorro y conejo completan pedidos más rápido."],
    ["Grandes lotes arcoíris", "Usa grupos de tres; los de cinco reciben una bonificación."],
    ["Prueba de grandes lotes de Panko", "Completa cada pedido con grupos de cuatro o más."],
    ["Cola del conejo primero", "Completa los pedidos en la secuencia mostrada."],
    ["Cola de pedidos del océano", "Ballena, rana y zorro se turnan en los pedidos."],
    ["Cola de pedidos del jardín", "Sigue la cola y forma un grupo de cuatro."],
    ["Cola con premio del zorro", "Sigue la cola; los grupos de cuatro suman dos extra."],
    ["Prueba de colas de Panko", "Completa dos bandejas en orden sin reiniciar el tablero."],
    ["Brunch de dos bandejas", "Tras la primera bandeja aparece una segunda receta."],
    ["Menú de dos platos del jardín", "Planifica dos recetas distintas en un solo tablero."],
    ["Pareja de platos de bayas", "Las dos recetas también exigen un grupo de cuatro."],
    ["Pareja de platos arcoíris", "Los lotes grandes ayudan a completar ambas recetas."],
    ["Prueba de tres platos de Panko", "Sirve tres recetas breves en un tablero continuo."],
    ["Cola grande", "Sigue el orden usando grupos de tres o más."],
    ["Bonificación de dos platos", "Los grupos grandes dan premios en dos recetas."],
    ["Arcoíris cuidadoso", "Los grupos necesitan tres y uno debe alcanzar cinco."],
    ["Cambio de bandejas", "Cada receta tiene su propia cola ordenada."],
    ["Prueba del festival de Panko", "Dos bandejas en cola combinan grupos de tres y bonificaciones."],
    ["Grupos maestros", "Los grupos del pedido necesitan cuatro y uno debe alcanzar seis."],
    ["Cola maestra", "Los grupos en cola necesitan tres; los de cinco suman extra."],
    ["Servicio triple", "Tres recetas comparten el objetivo maestro de un grupo de cinco."],
    ["Gran ensayo", "Dos recetas en cola combinan mínimos de grupo y bonificaciones."],
    ["Pastelería maestra de Panko", "Sirve tres bandejas en cola con grupos de cuatro y uno de seis."],
  ];
  if (spanishStageCopy.length !== stages.length) throw new Error("Spanish bakery-stage coverage must match all stages.");
  stages.forEach((stage, index) => {
    [stage.titleEs, stage.ruleEs] = spanishStageCopy[index];
  });

  function validateStages() {
    if (stages.length !== 30) throw new Error(`Bubble Bakery requires 30 stages; found ${stages.length}.`);
    if (new Set(stages.map((stage) => stage.titleEn)).size !== stages.length) throw new Error("Bubble Bakery English stage titles must be unique.");
    const checkpoints = [];
    stages.forEach((stage, index) => {
      if (stage.checkpoint) checkpoints.push(index + 1);
      if (!Array.isArray(stage.recipes) || stage.recipes.length < 1) throw new Error(`Bubble Bakery Stage ${index + 1} needs a recipe.`);
      if (!Number.isFinite(stage.moves) || stage.moves < 1) throw new Error(`Bubble Bakery Stage ${index + 1} needs moves.`);
      if ((stage.minOrderGroup || 2) > 7) throw new Error(`Bubble Bakery Stage ${index + 1} minimum group is too large.`);
      stage.recipes.forEach((recipe) => Object.keys(recipe).forEach((id) => {
        if (!stage.palette.includes(id)) throw new Error(`Bubble Bakery Stage ${index + 1} recipe uses ${id} outside its palette.`);
        if (!Number.isFinite(recipe[id]) || recipe[id] < 1) throw new Error(`Bubble Bakery Stage ${index + 1} has an invalid ${id} target.`);
      }));
    });
    if (checkpoints.join() !== "5,10,15,20,25,30") throw new Error(`Bubble Bakery Panko checkpoints are invalid: ${checkpoints.join()}.`);
  }

  validateStages();

  const rows = 10;
  const cols = 7;
  const $ = (id) => document.getElementById(id);
  const nodes = {
    localeSelect: $("localeSelect"),
    mainPanel: $("mainPanel"),
    stagePanel: $("stagePanel"),
    startGameBtn: $("startGameBtn"),
    stageBackBtn: $("stageBackBtn"),
    recommendedOrder: $("recommendedOrder"),
    bakeryProgress: $("bakeryProgress"),
    stageGrid: $("stageGrid"),
    stageFeedback: $("stageFeedback"),
    playPanel: $("playPanel"),
    backToStagesBtn: $("backToStagesBtn"),
    movesText: $("movesText"),
    orderBar: $("orderBar"),
    board: $("board"),
    hintText: $("hintText"),
    resultPanel: $("resultPanel"),
    resultTitle: $("resultTitle"),
    starText: $("starText"),
    resultText: $("resultText"),
    resultNextOrder: $("resultNextOrder"),
    skillReport: $("skillReport"),
    nextStageBtn: $("nextStageBtn"),
    retryBtn: $("retryBtn"),
    resultStagesBtn: $("resultStagesBtn"),
    loadingPanel: $("loadingPanel"),
    loadingText: $("loadingText"),
    loadingFill: $("loadingFill"),
  };
  const leavePanel = document.createElement("section");
  leavePanel.className = "bakery-leave-panel hidden";
  leavePanel.setAttribute("role", "dialog");
  leavePanel.setAttribute("aria-modal", "true");
  leavePanel.setAttribute("aria-labelledby", "bakeryLeaveTitle");
  leavePanel.innerHTML = `<div class="bakery-leave-card"><h2 id="bakeryLeaveTitle"></h2><p id="bakeryLeaveText"></p><div><button id="keepBakingBtn" type="button"></button><button id="leaveOrderBtn" type="button"></button></div></div>`;
  nodes.playPanel.insertAdjacentElement("afterend", leavePanel);
  nodes.leaveTitle = leavePanel.querySelector("#bakeryLeaveTitle");
  nodes.leaveText = leavePanel.querySelector("#bakeryLeaveText");
  nodes.keepBakingBtn = leavePanel.querySelector("#keepBakingBtn");
  nodes.leaveOrderBtn = leavePanel.querySelector("#leaveOrderBtn");

  const storageFallback = new Map();

  function storageRead(key) {
    try {
      const value = localStorage.getItem(key);
      if (value !== null) storageFallback.set(key, value);
      return value ?? storageFallback.get(key) ?? null;
    } catch {
      return storageFallback.get(key) ?? null;
    }
  }

  function storageWrite(key, value) {
    const normalized = String(value);
    storageFallback.set(key, normalized);
    try {
      localStorage.setItem(key, normalized);
      return true;
    } catch {
      return false;
    }
  }

  const legacySavedLocale = storageRead(localeKey);
  const canonicalSavedLocale = storageRead(sharedLocaleKey);
  if (!canonicalSavedLocale && text[legacySavedLocale]) {
    window.WonderI18n?.setLocale?.(legacySavedLocale);
  }
  let locale = window.WonderI18n?.locale?.() || canonicalSavedLocale || (text[legacySavedLocale] ? legacySavedLocale : "en");
  let unlocked = clamp(Number(storageRead(unlockKey)) || 1, 1, stages.length);
  let stars = readStars();
  let currentStage = 0;
  let board = [];
  let orders = {};
  let initialOrders = {};
  let recipeIndex = 0;
  let moves = 0;
  let score = 0;
  let orderStreak = 0;
  let validMovesUsed = 0;
  let orderTargetMoves = 0;
  let largestGroup = 0;
  let bestOrderStreak = 0;
  let busy = false;
  let leaveConfirmOpen = false;
  let lastResult = null;
  let centeredStageFrame = 0;
  const popMs = 620;
  const dropMs = 920;

  function wait(ms) {
    return new Promise((resolve) => {
      let elapsed = 0;
      let previous = performance.now();
      const tick = (now) => {
        if (!leaveConfirmOpen) elapsed += now - previous;
        previous = now;
        if (elapsed >= ms) resolve();
        else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  function playNodeAnimation(node, keyframes, options) {
    if (!node || typeof node.animate !== "function") return wait(options.duration || 0);
    node.animate(keyframes, options);
    return wait((options.duration || 0) + 90);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function readStars() {
    try {
      return JSON.parse(storageRead(starKey) || "{}");
    } catch {
      return {};
    }
  }

  function saveStars() {
    storageWrite(starKey, JSON.stringify(stars));
  }

  function readProgress() {
    try {
      return JSON.parse(storageRead(progressKey) || "{}");
    } catch {
      return {};
    }
  }

  function saveProgress(progress) {
    storageWrite(progressKey, JSON.stringify(progress));
  }

  function readStats() {
    try {
      const parsed = JSON.parse(storageRead(statsKey) || "{}");
      return {
        orders: Math.max(0, Number(parsed.orders || 0)),
        plays: Math.max(0, Number(parsed.plays || 0)),
        bestStage: Math.max(0, Number(parsed.bestStage || 0)),
        lastWinAt: parsed.lastWinAt || "",
      };
    } catch {
      return { orders: 0, plays: 0, bestStage: 0, lastWinAt: "" };
    }
  }

  function saveStats(stats) {
    storageWrite(statsKey, JSON.stringify(stats));
  }

  function t(key, data = {}) {
    const value = text[locale]?.[key] || text.en[key] || key;
    return Object.entries(data).reduce((out, [name, item]) => out.replaceAll(`{${name}}`, String(item)), value);
  }

  function syncSharedLocale() {
    const storedLocale = window.WonderI18n?.actualLocale?.() || locale;
    storageWrite(localeKey, storedLocale);
    storageWrite(sharedLocaleKey, storedLocale);
    if (window.WonderI18n?.locale?.() !== locale) {
      window.WonderI18n?.setLocale?.(locale);
    } else {
      window.dispatchEvent(new CustomEvent("wonder:locale-change", { detail: { locale } }));
    }
  }

  function colorData(id) {
    return colors.find((item) => item.id === id) || colors[0];
  }

  function stageTitle(stage) {
    if (locale === "zh-Hant") return stage.titleZh;
    if (locale === "es") return stage.titleEs;
    return stage.titleEn;
  }

  function stageRule(stage) {
    if (locale === "zh-Hant") return stage.ruleZh;
    if (locale === "es") return stage.ruleEs;
    return stage.ruleEn;
  }

  function stageOrderIds(stage) {
    return [...new Set(stage.recipes.flatMap((recipe) => Object.keys(recipe)))];
  }

  function battleRuleSymbols(stage) {
    const symbols = [];
    if ((stage.minOrderGroup || 2) > 2) symbols.push(`≥${stage.minOrderGroup}`);
    if (stage.sequence) symbols.push("→");
    if (stage.comboThreshold) symbols.push(`+${stage.comboBonus || 0}`);
    return symbols.join("");
  }

  function activeSequenceTarget() {
    return Object.keys(orders).find((id) => orders[id] > 0) || "";
  }

  function isActiveOrderTarget(id) {
    if ((orders[id] || 0) <= 0) return false;
    return !stages[currentStage].sequence || id === activeSequenceTarget();
  }

  function playSound(name) {
    window.WonderSound?.play?.(name);
  }

  function track(event, payload = {}) {
    window.WonderAnalytics?.track(event, { game_id: GAME_ID, ...payload });
  }

  function localizeStatic() {
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : locale === "es" ? "es" : "en";
    document.title = t("pageTitle");
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
    document.querySelectorAll("[data-ui-aria-label]").forEach((node) => {
      node.setAttribute("aria-label", t(node.dataset.uiAriaLabel));
    });
    nodes.localeSelect.value = locale;
    nodes.localeSelect.setAttribute("aria-label", t("localeSelect"));
    document.querySelector(".coach-card")?.setAttribute("aria-label", t("coachCard"));
    nodes.stageGrid.setAttribute("aria-label", t("stageList"));
    nodes.orderBar.setAttribute("aria-label", t("orderList"));
    nodes.board.setAttribute("aria-label", t("bubbleBoard"));
    nodes.leaveTitle.textContent = t("leaveTitle");
    nodes.leaveText.textContent = t("leaveText");
    nodes.keepBakingBtn.textContent = t("keepBaking");
    nodes.leaveOrderBtn.textContent = t("leaveOrder");
  }

  function renderStageGrid() {
    nodes.stageGrid.innerHTML = "";
    stages.forEach((stage, index) => {
      const stageNo = index + 1;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "stage-card";
      const isLocked = stageNo > unlocked;
      if (isLocked) {
        button.classList.add("locked");
        button.setAttribute("aria-disabled", "true");
      }
      if (index === recommendedStageIndex()) button.classList.add("is-selected");
      const orderIcons = stageOrderIds(stage).map((id) => `<img src="${colorData(id).asset}" alt="" />`).join("");
      const got = stars[stageNo] || 0;
      const badgeKey = isLocked ? "locked" : got >= 3 ? "stageMastered" : got > 0 ? "stageImprove" : "stageNew";
      const unlockRequirement = isLocked ? t("unlockRequirement", { stage: t("stage", { n: stageNo - 1 }) }) : "";
      button.innerHTML = `
        <b class="stage-icons">${orderIcons}</b>
        <strong>${t("stage", { n: stageNo })}</strong>
        <small>${stageTitle(stage)} · ${t("movesCount", { n: stage.moves })}</small>
        <span class="stage-rule">${stageRule(stage)}</span>
        <span class="stage-stars">${starIcons(got, 3)}</span>
        <span class="stage-badge">${t(badgeKey)}</span>
        ${isLocked ? `<span class="stage-lock-requirement">${unlockRequirement}</span>` : ""}
        ${stage.checkpoint ? `<em class="panko-check"><img src="../../assets/weightplay-character-drum-belly-panda-safe-face-cutout.webp" alt="" />${t("pankoCheck")}</em>` : ""}
      `;
      if (isLocked) {
        button.setAttribute("aria-label", `${t("stage", { n: stageNo })}，${stageTitle(stage)}。${t("locked")}。${unlockRequirement}`);
      }
      button.dataset.unlockAfter = String(stageNo - 1);
      button.addEventListener("click", () => {
        if (isLocked) {
          announceLockedStage(stageNo);
          return;
        }
        startStage(index);
      });
      nodes.stageGrid.appendChild(button);
    });
    updateCenteredStageCard();
    const centerSelectedStage = () => {
      const selected = [...nodes.stageGrid.querySelectorAll(".stage-card:not(.locked)")].at(-1);
      if (!selected) return;
      nodes.stageGrid.scrollTo({
        left: selected.offsetLeft - (nodes.stageGrid.clientWidth - selected.offsetWidth) / 2,
        behavior: "auto",
      });
      updateCenteredStageCard();
    };
    centerSelectedStage();
    window.requestAnimationFrame(() => window.requestAnimationFrame(centerSelectedStage));
  }

  function updateCenteredStageCard() {
    const cards = [...nodes.stageGrid.querySelectorAll(".stage-card")];
    if (!cards.length) return;
    const center = nodes.stageGrid.scrollLeft + nodes.stageGrid.clientWidth / 2;
    const nearest = cards.reduce((best, card) => {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      return !best || distance < best.distance ? { card, distance } : best;
    }, null)?.card;
    cards.forEach((card) => card.classList.toggle("is-centered", card === nearest));
  }

  function scheduleCenteredStageCard() {
    if (centeredStageFrame) return;
    centeredStageFrame = requestAnimationFrame(() => {
      centeredStageFrame = 0;
      updateCenteredStageCard();
    });
  }

  function recommendedStageIndex() {
    const firstImprove = stages.findIndex((_, index) => {
      const stageNo = index + 1;
      return stageNo <= unlocked && (stars[stageNo] || 0) < 3;
    });
    if (firstImprove >= 0) return firstImprove;
    return clamp(unlocked - 1, 0, stages.length - 1);
  }

  function renderRecommendedOrder() {
    const index = recommendedStageIndex();
    const stageNo = index + 1;
    const stage = stages[index];
    const got = stars[stageNo] || 0;
    const reasonKey = got >= 3 ? "recommendedMastered" : got > 0 ? "recommendedImprove" : "recommendedNew";
    const orderIcons = stageOrderIds(stage).map((id) => `<img src="${colorData(id).asset}" alt="" />`).join("");
    nodes.recommendedOrder.innerHTML = `
      <div>
        <strong>${t("recommendedTitle")}</strong>
        <span>${t("recommendedCopy", { stage: t("stage", { n: stageNo }), theme: stageTitle(stage) })}</span>
        <em>${t(reasonKey)}</em>
      </div>
      <b class="recommend-icons">${orderIcons}</b>
    `;
  }

  function renderBakeryProgress() {
    const totalStars = stages.length * 3;
    const earnedStars = stages.reduce((sum, _, index) => sum + (stars[index + 1] || 0), 0);
    const cleared = stages.reduce((sum, _, index) => sum + ((stars[index + 1] || 0) > 0 ? 1 : 0), 0);
    const mastered = stages.reduce((sum, _, index) => sum + ((stars[index + 1] || 0) >= 3 ? 1 : 0), 0);
    const stamp = stampProgress(readStats());
    const nextClearStage = Math.min(stages.length, Math.max(1, cleared + 1));
    const nextMasterStage = stages.findIndex((_, index) => (stars[index + 1] || 0) < 3 && index + 1 <= unlocked) + 1;
    const nextLabel = nextMasterStage > 0
      ? t("nextPerfectGoal", { stage: t("stage", { n: nextMasterStage }) })
      : cleared >= stages.length
      ? t("allOrdersDone")
      : t("nextGoal", { stage: t("stage", { n: nextClearStage }) });
    nodes.bakeryProgress.innerHTML = `
      <strong>${t("bakeryProgress")}</strong>
      <span>${t("clearedStages", { done: cleared, total: stages.length })}</span>
      <span>${t("totalStars", { stars: earnedStars, total: totalStars })}</span>
      <span>${t("perfectOrders", { done: mastered, total: stages.length })}</span>
      <em>${nextLabel}</em>
      <div class="stamp-card" aria-label="${t("customerStamps")}">
        <b>${t("customerStamps")}</b>
        <span>${t("stampOrders", { orders: stamp.orders })}</span>
        <span>${t("stampStickers", { stickers: stamp.stickers })}</span>
        <i><span style="transform: scaleX(${stamp.ratio})"></span></i>
        <small>${stamp.nextText}</small>
      </div>
    `;
  }

  function stampProgress(stats) {
    const cycle = 5;
    const orders = Math.max(0, Number(stats.orders || 0));
    const filled = orders % cycle;
    const visibleFilled = orders > 0 && filled === 0 ? cycle : filled;
    const next = visibleFilled >= cycle ? cycle : cycle - visibleFilled;
    return {
      orders,
      stickers: Math.floor(orders / cycle),
      ratio: visibleFilled / cycle,
      nextText: visibleFilled >= cycle ? t("stickerReady") : t("nextSticker", { n: next }),
    };
  }

  function recordFinishStats(won, stageNo) {
    const stats = readStats();
    stats.plays += 1;
    if (won) {
      stats.orders += 1;
      stats.bestStage = Math.max(stats.bestStage || 0, stageNo);
      stats.lastWinAt = new Date().toISOString();
    }
    saveStats(stats);
    return stampProgress(stats);
  }

  function setBattleCovered(covered) {
    nodes.playPanel.inert = covered;
    if (covered) nodes.playPanel.setAttribute("aria-hidden", "true");
    else nodes.playPanel.removeAttribute("aria-hidden");
  }

  function setLeaveConfirmOpen(open, restoreFocus = true) {
    if (open === leaveConfirmOpen) return;
    leaveConfirmOpen = open;
    leavePanel.classList.toggle("hidden", !open);
    setBattleCovered(open);
    if (open) nodes.keepBakingBtn.focus({ preventScroll: true });
    else if (restoreFocus) nodes.backToStagesBtn.focus({ preventScroll: true });
  }

  function showMain(restoreStartFocus = false) {
    setLeaveConfirmOpen(false, false);
    document.body.classList.remove("is-bakery-playing", "is-bakery-stage-select", "is-bakery-result");
    document.body.classList.remove("wp-stage-select-active");
    window.WEIGHTPLAY_BUBBLE_BAKERY_ACTIVE = false;
    window.dispatchEvent(new CustomEvent("bubble-bakery:play-state", { detail: { playing: false } }));
    nodes.mainPanel.classList.remove("hidden");
    nodes.stagePanel.classList.add("hidden");
    nodes.playPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    setBattleCovered(false);
    busy = false;
    updateBakeryFrame();
    if (restoreStartFocus) requestAnimationFrame(() => nodes.startGameBtn.focus({ preventScroll: true }));
  }

  function updateBakeryFrame() {
    if (!document.body.classList.contains("is-bakery-playing") && !document.body.classList.contains("is-bakery-stage-select")) return;
    const viewport = window.visualViewport;
    const viewportWidth = viewport?.width || innerWidth;
    const viewportHeight = viewport?.height || innerHeight;
    const scale = Math.max(0.1, Math.min(viewportWidth / 390, viewportHeight / 788));
    const logicalWidth = viewportWidth / scale;
    const logicalHeight = viewportHeight / scale;
    const root = document.documentElement.style;
    root.setProperty("--bakery-frame-scale", String(scale));
    root.setProperty("--bakery-logical-width", `${logicalWidth}px`);
    root.setProperty("--bakery-logical-height", `${logicalHeight}px`);
    root.setProperty("--bakery-frame-left", "0px");
    root.setProperty("--bakery-frame-top", "0px");
  }

  addEventListener("resize", updateBakeryFrame, { passive: true });
  addEventListener("orientationchange", updateBakeryFrame, { passive: true });
  visualViewport?.addEventListener("resize", updateBakeryFrame, { passive: true });
  visualViewport?.addEventListener("scroll", updateBakeryFrame, { passive: true });

  let lockedAnnouncementAt = 0;

  function announceLockedStage(stageNo) {
    const now = performance.now();
    if (now - lockedAnnouncementAt < 120) return;
    lockedAnnouncementAt = now;
    const unlockRequirement = t("unlockRequirement", { stage: t("stage", { n: Math.max(1, stageNo - 1) }) });
    nodes.stageFeedback.textContent = `${t("locked")}。${unlockRequirement}`;
    showFloat(unlockRequirement);
    playSound("error");
  }

  function showStageSelect(focusStageIndex = null) {
    setLeaveConfirmOpen(false, false);
    document.body.classList.remove("is-bakery-playing", "is-bakery-result");
    document.body.classList.add("is-bakery-stage-select");
    window.WEIGHTPLAY_BUBBLE_BAKERY_ACTIVE = false;
    window.dispatchEvent(new CustomEvent("bubble-bakery:play-state", { detail: { playing: false } }));
    nodes.mainPanel.classList.add("hidden");
    nodes.stagePanel.classList.remove("hidden");
    nodes.playPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    setBattleCovered(false);
    updateBakeryFrame();
    busy = false;
    nodes.stageFeedback.textContent = "";
    renderRecommendedOrder();
    renderBakeryProgress();
    renderStageGrid();
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    requestAnimationFrame(() => {
      const cards = [...nodes.stageGrid.querySelectorAll(".stage-card:not(.locked)")];
      const exact = Number.isInteger(focusStageIndex) ? cards.find((card) => [...nodes.stageGrid.children].indexOf(card) === focusStageIndex) : null;
      (exact || nodes.stageGrid.querySelector(".stage-card.is-selected:not(.locked)") || cards.at(-1))?.focus({ preventScroll: true });
    });
  }

  function startStage(index) {
    setLeaveConfirmOpen(false, false);
    currentStage = index;
    const stage = stages[index];
    recipeIndex = 0;
    orders = { ...stage.recipes[recipeIndex] };
    initialOrders = { ...stage.recipes[recipeIndex] };
    moves = stage.moves;
    score = 0;
    orderStreak = 0;
    validMovesUsed = 0;
    orderTargetMoves = 0;
    largestGroup = 0;
    bestOrderStreak = 0;
    busy = false;
    lastResult = null;
    board = makeBoard(stage.palette, stage.minOrderGroup || 2);
    document.body.classList.remove("is-bakery-stage-select", "is-bakery-result");
    document.body.classList.add("is-bakery-playing");
    window.WEIGHTPLAY_BUBBLE_BAKERY_ACTIVE = true;
    window.dispatchEvent(new CustomEvent("bubble-bakery:play-state", { detail: { playing: true } }));
    nodes.mainPanel.classList.add("hidden");
    nodes.stagePanel.classList.add("hidden");
    nodes.playPanel.classList.remove("hidden");
    nodes.resultPanel.classList.add("hidden");
    setBattleCovered(false);
    window.WeightPlayGame?.exitMobileGameMode?.();
    nodes.playPanel.classList.remove("weightplay-active-viewport");
    updateBakeryFrame();
    nodes.hintText.textContent = stageRule(stage);
    nodes.orderBar.dataset.theme = t("stage", { n: index + 1 });
    renderAll();
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      nodes.playPanel.scrollIntoView?.({ block: "start", inline: "nearest", behavior: "auto" });
      nodes.board.querySelector(".bubble")?.focus({ preventScroll: true });
    });
    playSound("start");
    track("game_start", { level: index + 1 });
  }

  function makeBoard(palette, requiredGroup = 2) {
    const next = Array.from({ length: rows }, () => Array.from({ length: cols }, () => randomFrom(palette)));
    if (!hasPlayableGroup(next, requiredGroup)) {
      const seed = palette[0];
      for (let index = 0; index < requiredGroup; index += 1) next[0][index] = seed;
    }
    return next;
  }

  function randomFrom(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function hasPlayableGroup(nextBoard, requiredGroup = 2) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const id = nextBoard[r]?.[c];
        if (!id) continue;
        const seen = new Set();
        const stack = [[r, c]];
        while (stack.length) {
          const [row, col] = stack.pop();
          const key = `${row},${col}`;
          if (seen.has(key) || nextBoard[row]?.[col] !== id) continue;
          seen.add(key);
          if (seen.size >= requiredGroup) return true;
          stack.push([row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]);
        }
      }
    }
    return false;
  }

  function renderAll(dropMap = new Map()) {
    renderOrders();
    renderBoard(dropMap);
    updateHud();
  }

  function renderOrders() {
    nodes.orderBar.innerHTML = "";
    const progress = orderProgress();
    nodes.orderBar.classList.toggle("is-complete", progress.total > 0 && progress.done >= progress.total);
    const title = document.createElement("strong");
    title.className = "order-title";
    const stage = stages[currentStage];
    const recipeLabel = stage.recipes.length > 1 ? ` · ${recipeIndex + 1}/${stage.recipes.length}` : "";
    const ruleSymbols = battleRuleSymbols(stage);
    title.textContent = `${nodes.orderBar.dataset.theme || ""}${recipeLabel}${ruleSymbols ? ` · ${ruleSymbols}` : ""} · ${progress.done}/${progress.total}`;
    title.title = `${stageTitle(stage)} — ${stageRule(stage)}`;
    nodes.orderBar.appendChild(title);
    Object.entries(orders).forEach(([id, need]) => {
      const data = colorData(id);
      const remaining = Math.max(0, need);
      const chip = document.createElement("div");
      chip.className = "order-chip";
      if (stage.sequence && id === activeSequenceTarget()) chip.classList.add("is-sequence-active");
      chip.setAttribute("aria-label", `${t(data.labelKey)}: ${remaining}/${initialOrders[id]}`);
      chip.innerHTML = `<img class="order-icon" src="${data.asset}" alt="" /><span>${remaining}/${initialOrders[id]}</span>`;
      nodes.orderBar.appendChild(chip);
    });
    if (stage.groupGoal) {
      const goal = document.createElement("div");
      goal.className = "order-chip group-goal";
      goal.textContent = t("groupGoal", { done: Math.min(largestGroup, stage.groupGoal), need: stage.groupGoal });
      nodes.orderBar.appendChild(goal);
    }
    const meter = document.createElement("div");
    meter.className = "order-progress";
    meter.setAttribute("aria-hidden", "true");
    meter.innerHTML = `<i style="transform: scaleX(${progress.ratio})"></i><span>${progress.done}/${progress.total}</span>`;
    nodes.orderBar.appendChild(meter);
  }

  function orderProgress() {
    const total = Object.values(initialOrders).reduce((sum, need) => sum + Math.max(0, need), 0);
    const left = Object.values(orders).reduce((sum, need) => sum + Math.max(0, need), 0);
    const done = clamp(total - left, 0, total);
    return {
      total,
      done,
      ratio: total > 0 ? done / total : 0,
    };
  }

  function boardMetrics() {
    const styles = window.getComputedStyle(nodes.board);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
    const padLeft = parseFloat(styles.paddingLeft || "0") || 0;
    const padRight = parseFloat(styles.paddingRight || "0") || 0;
    const usableWidth = Math.max(1, nodes.board.clientWidth - padLeft - padRight - gap * (cols - 1));
    const cell = usableWidth / cols;
    return { pitch: cell + gap };
  }

  function renderBoard(dropMap = new Map()) {
    const { pitch } = boardMetrics();
    const groupInfo = buildGroupInfo();
    nodes.board.innerHTML = "";
    board.forEach((row, r) => {
      row.forEach((id, c) => {
        const data = colorData(id);
        const key = `${r},${c}`;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "bubble";
        button.style.visibility = "visible";
        button.style.opacity = "1";
        button.style.transform = "none";
        if (isActiveOrderTarget(id)) {
          button.classList.add("order-target");
        }
        const info = groupInfo.get(key);
        if (info?.size >= 2) {
          button.classList.add("match-ready");
          button.dataset.groupSize = String(info.size);
          if (isActiveOrderTarget(id)) button.classList.add("order-ready");
        }
        if (dropMap.has(key)) {
          const rowsToFall = dropMap.get(key);
          button.dataset.dropDistance = String(Math.max(1, rowsToFall) * pitch);
        }
        button.dataset.row = String(r);
        button.dataset.col = String(c);
        button.dataset.bubble = id;
        const labelValues = { animal: t(data.labelKey), row: r + 1, column: c + 1, count: info?.size || 1, minimum: stages[currentStage].minOrderGroup || 2 };
        const isOrderTarget = isActiveOrderTarget(id);
        const labelKey = info?.size >= 2 ? (isOrderTarget ? "bubbleOrderGroup" : "bubbleGroup") : (isOrderTarget ? "bubbleOrderSingle" : "bubbleSingle");
        button.setAttribute("aria-label", t(labelKey, labelValues));
        button.innerHTML = `<img src="${data.asset}" alt="" draggable="false" /><span class="order-target-ring" aria-hidden="true"></span>`;
        button.addEventListener("click", () => popGroup(r, c));
        nodes.board.appendChild(button);
      });
    });
  }

  function buildGroupInfo() {
    const info = new Map();
    const visited = new Set();
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const key = `${r},${c}`;
        if (visited.has(key) || !board[r]?.[c]) continue;
        const { group } = groupFrom(r, c);
        group.forEach(([gr, gc]) => visited.add(`${gr},${gc}`));
        if (group.length < 2) continue;
        group.forEach(([gr, gc]) => {
          info.set(`${gr},${gc}`, { size: group.length });
        });
      }
    }
    return info;
  }

  function groupFrom(startR, startC) {
    const id = board[startR]?.[startC];
    if (!id) return { id, group: [] };
    const seen = new Set();
    const stack = [[startR, startC]];
    const group = [];
    while (stack.length) {
      const [r, c] = stack.pop();
      const key = `${r},${c}`;
      if (seen.has(key) || board[r]?.[c] !== id) continue;
      seen.add(key);
      group.push([r, c]);
      [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]].forEach(([nr, nc]) => {
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) stack.push([nr, nc]);
      });
    }
    return { id, group };
  }

  async function popGroup(r, c) {
    if (busy || moves <= 0) return;
    const { id, group } = groupFrom(r, c);
    const stage = stages[currentStage];
    if (group.length < 2) {
      nodes.hintText.textContent = t("smallGroup");
      playSound("error");
      return;
    }
    const minimum = stage.minOrderGroup || 2;
    busy = true;
    nodes.board.setAttribute("aria-busy", "true");
    const wasNeeded = (orders[id] || 0) > 0;
    const meetsOrderMinimum = group.length >= minimum;
    const countsForOrder = wasNeeded && meetsOrderMinimum && (!stage.sequence || id === activeSequenceTarget());
    moves -= 1;
    validMovesUsed += 1;
    largestGroup = Math.max(largestGroup, group.length);
    const baseScore = group.length * group.length * 5;
    let bonus = 0;
    if (countsForOrder) {
      orderTargetMoves += 1;
      orderStreak += 1;
      bestOrderStreak = Math.max(bestOrderStreak, orderStreak);
      bonus = Math.round(group.length * 8 * Math.min(orderStreak, 5));
    } else {
      orderStreak = 0;
    }
    score += baseScore + bonus;
    if (countsForOrder) {
      const batchBonus = stage.comboThreshold && group.length >= stage.comboThreshold ? stage.comboBonus || 0 : 0;
      orders[id] = Math.max(0, orders[id] - group.length - batchBonus);
    }
    if (bonus > 0) {
      nodes.hintText.textContent = t("orderStreak", { streak: Math.min(orderStreak, 5), bonus });
      showFloat(t("orderStreak", { streak: Math.min(orderStreak, 5), bonus }), window.innerWidth / 2, window.innerHeight * 0.5);
    } else {
      nodes.hintText.textContent = wasNeeded && !meetsOrderMinimum
        ? t("groupTooSmall", { count: minimum })
        : wasNeeded && stage.sequence
        ? t("sequenceNext", { animal: t(colorData(activeSequenceTarget()).labelKey) })
        : wasNeeded ? stageRule(stage) : t("notOrderTarget");
      showFloat(wasNeeded && !meetsOrderMinimum ? t("groupTooSmall", { count: minimum }) : `+${baseScore}`, window.innerWidth / 2, window.innerHeight * 0.5);
    }
    playSound("pop");

    try {
      await markPopping(group);
      group.forEach(([gr, gc]) => {
        board[gr][gc] = null;
      });
      const dropMap = collapseBoard(stages[currentStage].palette);
      renderAll(dropMap);
      await animateDroppingBubbles();
    } finally {
      releaseBoardInput();
    }
    if (ordersFinished() && recipeIndex + 1 < stage.recipes.length) {
      recipeIndex += 1;
      orders = { ...stage.recipes[recipeIndex] };
      initialOrders = { ...stage.recipes[recipeIndex] };
      nodes.hintText.textContent = t("recipeNext", { current: recipeIndex + 1, total: stage.recipes.length });
      renderAll();
      nodes.board.querySelector(`.bubble[data-row="${r}"][data-col="${c}"]`)?.focus({ preventScroll: true });
      return;
    }
    if (isComplete()) return finish(true);
    if (moves <= 0) return finish(false);
    nodes.board.querySelector(`.bubble[data-row="${r}"][data-col="${c}"]`)?.focus({ preventScroll: true });
  }

  function releaseBoardInput() {
    nodes.board.classList.remove("is-popping");
    nodes.board.querySelectorAll(".bubble").forEach((node) => {
      node.getAnimations?.().forEach((animation) => animation.cancel());
      node.classList.remove("is-pop-source", "pop", "drop");
      delete node.dataset.dropDistance;
      node.style.transform = "none";
      node.style.opacity = "1";
      node.style.visibility = "visible";
      node.disabled = false;
    });
    nodes.board.setAttribute("aria-busy", "false");
    busy = false;
  }

  function markPopping(group) {
    nodes.board.classList.add("is-popping");
    const popKeys = new Set(group.map(([r, c]) => `${r},${c}`));
    const popNodes = Array.from(nodes.board.querySelectorAll(".bubble")).filter((node) => popKeys.has(`${node.dataset.row},${node.dataset.col}`));

    nodes.board.querySelectorAll(".bubble").forEach((node) => {
      node.disabled = true;
    });

    popNodes.forEach((node) => {
      node.getAnimations?.().forEach((animation) => animation.cancel());
      node.classList.add("is-pop-source", "pop");
    });

    return wait(popMs + 90).then(() => {
      nodes.board.classList.remove("is-popping");
      return wait(30);
    });
  }

  function animateDroppingBubbles() {
    const dropping = Array.from(nodes.board.querySelectorAll("[data-drop-distance]"));
    if (!dropping.length) return wait(0);
    dropping.forEach((node) => {
      const distance = Number(node.dataset.dropDistance) || 96;
      node.disabled = true;
      playNodeAnimation(node, [
        { opacity: 0.98, transform: `translateY(${-distance}px) scale(.985)` },
        { opacity: 1, transform: "translateY(0) scale(1)", offset: 0.62 },
        { opacity: 1, transform: "translateY(8%) scale(1.04, .95)", offset: 0.74 },
        { opacity: 1, transform: "translateY(-3.5%) scale(.985, 1.018)", offset: 0.86 },
        { opacity: 1, transform: "translateY(1.5%) scale(1.01, .992)", offset: 0.95 },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ], {
        duration: dropMs,
        easing: "cubic-bezier(.18,.72,.15,1.02)",
        fill: "both",
      });
    });

    return wait(dropMs + 90).then(() => {
      nodes.board.querySelectorAll(".bubble").forEach((node) => {
        node.getAnimations?.().forEach((animation) => animation.cancel());
        delete node.dataset.dropDistance;
        node.style.transform = "none";
        node.style.opacity = "1";
        node.style.visibility = "visible";
        node.disabled = false;
      });
      return wait(40);
    });
  }

  function collapseBoard(palette) {
    const next = Array.from({ length: rows }, () => Array.from({ length: cols }, () => null));
    const dropMap = new Map();
    for (let c = 0; c < cols; c++) {
      const kept = [];
      for (let r = rows - 1; r >= 0; r--) {
        if (board[r][c]) kept.push({ id: board[r][c], from: r });
      }
      let target = rows - 1;
      kept.forEach((item) => {
        next[target][c] = item.id;
        if (item.from !== target) dropMap.set(`${target},${c}`, Math.max(1, target - item.from));
        target -= 1;
      });
      while (target >= 0) {
        next[target][c] = randomFrom(palette);
        dropMap.set(`${target},${c}`, rows + target + 1);
        target -= 1;
      }
    }
    board = next;
    const requiredGroup = stages[currentStage].minOrderGroup || 2;
    if (!hasPlayableGroup(board, requiredGroup)) {
      const seed = activeSequenceTarget() || stages[currentStage].palette[0];
      for (let index = 0; index < requiredGroup; index += 1) {
        board[0][index] = seed;
        dropMap.set(`0,${index}`, rows + 1);
      }
    }
    return dropMap;
  }

  function ordersFinished() {
    return Object.values(orders).every((need) => need <= 0);
  }

  function isComplete() {
    const stage = stages[currentStage];
    return ordersFinished() && recipeIndex === stage.recipes.length - 1 && (!stage.groupGoal || largestGroup >= stage.groupGoal);
  }

  function updateHud() {
    nodes.movesText.textContent = moves;
  }

  function finish(won) {
    busy = true;
    document.body.classList.add("is-bakery-result");
    window.WEIGHTPLAY_BUBBLE_BAKERY_ACTIVE = false;
    window.dispatchEvent(new CustomEvent("bubble-bakery:play-state", { detail: { playing: false } }));
    const stageNo = currentStage + 1;
    const previousBest = Number(readProgress()[stageNo]?.bestScore || 0);
    let earned = 0;
    let unlockedStageNo = null;
    if (won) {
      earned = moves >= 7 ? 3 : moves >= 3 ? 2 : 1;
      stars[stageNo] = Math.max(stars[stageNo] || 0, earned);
      saveStars();
      if (stageNo === unlocked && unlocked < stages.length) {
        unlocked += 1;
        unlockedStageNo = unlocked;
        storageWrite(unlockKey, unlocked);
      }
    }
    const stamp = recordFinishStats(won, stageNo);
    const report = recordSkillReport({ stageNo, won, earned, previousBest });
    lastResult = { won, stageNo, earned, unlockedStageNo, stamp, moves, report };
    setBattleCovered(true);
    renderResult(lastResult);
    playSound(won ? "success" : "error");
    track("game_complete", { level: stageNo, success: won, score, moves_left: moves });
  }

  function renderResult(result) {
    nodes.resultPanel.classList.remove("hidden");
    nodes.resultTitle.textContent = result.won ? t("orderDone") : t("failed");
    nodes.resultText.textContent = result.won ? t("resultWin", { moves: result.moves }) : t("resultLose");
    nodes.starText.textContent = result.won ? starIcons(result.earned, 3) : t("failed");
    renderResultNextOrder(result);
    renderSkillReport(result.report);
    nodes.nextStageBtn.classList.toggle("hidden", !result.won || currentStage >= stages.length - 1);
    (result.won && currentStage < stages.length - 1 ? nodes.nextStageBtn : nodes.retryBtn).focus({ preventScroll: true });
  }

  function renderResultNextOrder({ won, stageNo, earned, unlockedStageNo, stamp }) {
    const targetIndex = won ? recommendedStageIndex() : currentStage;
    const targetStage = stages[targetIndex] || stages[currentStage];
    const targetStageNo = targetIndex + 1;
    const orderIcons = stageOrderIds(targetStage).map((id) => `<img src="${colorData(id).asset}" alt="" />`).join("");
    const localizedStamp = stampProgress({ orders: stamp.orders });
    const statusText = won
      ? unlockedStageNo
        ? t("resultUnlocked", { stage: t("stage", { n: unlockedStageNo }) })
        : earned >= 3 && targetStageNo >= stages.length
          ? t("resultAllClear")
          : t("resultReplay", { stage: t("stage", { n: targetStageNo }) })
      : t("resultTryAgainGoal", { stage: t("stage", { n: stageNo }) });

    nodes.resultNextOrder.innerHTML = `
      <strong>${t("resultNextTitle")}</strong>
      <span>${statusText}</span>
      <em>${t("resultNextCopy", { stage: t("stage", { n: targetStageNo }), theme: stageTitle(targetStage) })}</em>
      <small class="result-stamp">${won ? t("resultStampWin", { next: localizedStamp.nextText }) : t("resultStampLose")}</small>
      <b class="result-order-icons">${orderIcons}</b>
    `;
  }

  function recordSkillReport({ stageNo, won, earned, previousBest }) {
    const stage = stages[currentStage];
    const moveRatio = moves / Math.max(1, stage.moves);
    const orderScore = won ? 5 : Math.max(1, 3 - Object.values(orders).filter((need) => need > 0).length);
    const skillScores = {
      logic: clamp(won ? earned + 2 : orderScore, 1, 5),
      focus: clamp(Math.round(moveRatio * 4) + (won ? 1 : 0), 1, 5),
      problemSolving: clamp(won ? Math.max(3, earned + 1) : orderScore, 1, 5),
    };
    const progress = readProgress();
    const previous = progress[stageNo] || {};
    const bestScore = Math.max(previousBest, score);
    const improvementPercent = previousBest > 0 ? Math.round(((score - previousBest) / previousBest) * 100) : (score > 0 ? 100 : 0);
    progress[stageNo] = {
      lastScore: score,
      bestScore,
      playCount: Number(previous.playCount || 0) + 1,
      lastPlayedAt: new Date().toISOString(),
      improvementPercent,
      skillScores,
      evidence: {
        validMovesUsed,
        orderTargetMoves,
        largestGroup,
        bestOrderStreak,
      },
    };
    saveProgress(progress);

    return {
      previousBest,
      score,
      improvementPercent,
      skillScores,
      validMovesUsed,
      orderTargetMoves,
      largestGroup,
      bestOrderStreak,
      messageKey: bestScore > previousBest && previousBest > 0 ? "reportNewBest" : (won ? "reportGreat" : "reportGood"),
    };
  }

  function renderSkillReport(report) {
    const { previousBest, score: resultScore, improvementPercent, skillScores } = report;
    const improvementText = improvementPercent > 0 ? `+${improvementPercent}%` : `${improvementPercent}%`;
    nodes.skillReport.innerHTML = `
      <strong>${t("skillReport")}</strong>
      <div class="skill-score-row"><span>${t("previousBest")}</span><b>${previousBest}</b></div>
      <div class="skill-score-row"><span>${t("todayScore")}</span><b>${resultScore}</b></div>
      <div class="skill-score-row"><span>${t("improvement")}</span><b>${improvementText}</b></div>
      <div class="skill-stars"><span>${t("logic")}<small>${t("targetHitEvidence", { hits: report.orderTargetMoves, moves: report.validMovesUsed })}</small></span><b>${starIcons(skillScores.logic, 5)}</b></div>
      <div class="skill-stars"><span>${t("focus")}<small>${t("largestGroupEvidence", { count: report.largestGroup })}</small></span><b>${starIcons(skillScores.focus, 5)}</b></div>
      <div class="skill-stars"><span>${t("problemSolving")}<small>${t("bestStreakEvidence", { count: report.bestOrderStreak })}</small></span><b>${starIcons(skillScores.problemSolving, 5)}</b></div>
      <p>${t(report.messageKey)}</p>
    `;
  }

  function starIcons(count, total) {
    return `${"★".repeat(count)}${"☆".repeat(total - count)}`;
  }

  function showFloat(message, x = window.innerWidth / 2, y = window.innerHeight / 2) {
    const bubble = document.createElement("div");
    bubble.className = "board-float";
    bubble.textContent = message;
    const safeX = clamp(Number(x) || window.innerWidth / 2, 88, Math.max(88, window.innerWidth - 88));
    const safeY = clamp(Number(y) || window.innerHeight / 2, 72, Math.max(72, window.innerHeight - 72));
    bubble.style.left = `${safeX}px`;
    bubble.style.top = `${safeY}px`;
    document.body.appendChild(bubble);
    window.setTimeout(() => bubble.remove(), 850);
  }

  function initLoading() {
    const assets = [
      "../../assets/bubble-bakery-cover.webp",
      "../../assets/weightplay-character-drum-belly-panda-safe-face-cutout.webp",
      "assets/order-target-ring.png",
      ...colors.map((item) => item.asset),
    ];
    let loaded = 0;
    let released = false;
    const update = () => {
      const pct = Math.min(100, Math.round((loaded / assets.length) * 100));
      nodes.loadingText.textContent = `${pct}%`;
      nodes.loadingFill.style.width = `${pct}%`;
      if (pct >= 100 && !released) {
        released = true;
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
    window.setTimeout(() => {
      if (released) return;
      released = true;
      nodes.loadingText.textContent = "100%";
      nodes.loadingFill.style.width = "100%";
      nodes.loadingPanel.classList.add("hidden");
      track("game_ready", { fallback: true });
    }, 1200);
  }

  nodes.localeSelect.addEventListener("change", () => {
    const requested = nodes.localeSelect.value;
    window.WonderI18n?.setLocale?.(requested);
    locale = window.WonderI18n?.locale?.() || requested;
    syncSharedLocale();
    localizeStatic();
    renderRecommendedOrder();
    renderBakeryProgress();
    renderStageGrid();
    if (!nodes.resultPanel.classList.contains("hidden") && lastResult) {
      renderResult(lastResult);
    } else if (!nodes.playPanel.classList.contains("hidden")) {
      nodes.orderBar.dataset.theme = t("stage", { n: currentStage + 1 });
      renderAll();
    }
  });
  function rejectRepeatedScreenActivation(event) {
    if (!event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  nodes.startGameBtn.addEventListener("keydown", rejectRepeatedScreenActivation, true);
  nodes.stageGrid.addEventListener("scroll", scheduleCenteredStageCard, { passive: true });
  nodes.stageGrid.addEventListener("keydown", (event) => {
    if (event.target.closest(".stage-card")) rejectRepeatedScreenActivation(event);
  }, true);
  nodes.startGameBtn.addEventListener("click", showStageSelect);
  window.addEventListener("weightplay:tutorial-start", (event) => {
    if (event.detail?.gameId !== GAME_ID || nodes.mainPanel.classList.contains("hidden")) return;
    showStageSelect();
  });
  nodes.stageBackBtn.addEventListener("click", () => showMain(true));
  nodes.backToStagesBtn.addEventListener("click", () => setLeaveConfirmOpen(true));
  nodes.keepBakingBtn.addEventListener("click", () => setLeaveConfirmOpen(false));
  nodes.leaveOrderBtn.addEventListener("click", () => showStageSelect(currentStage));
  leavePanel.addEventListener("keydown", (event) => {
    rejectRepeatedScreenActivation(event);
    if (event.key === "Escape") { event.preventDefault(); setLeaveConfirmOpen(false); return; }
    if (event.key !== "Tab") return;
    if (event.shiftKey && document.activeElement === nodes.keepBakingBtn) { event.preventDefault(); nodes.leaveOrderBtn.focus({ preventScroll:true }); }
    else if (!event.shiftKey && document.activeElement === nodes.leaveOrderBtn) { event.preventDefault(); nodes.keepBakingBtn.focus({ preventScroll:true }); }
  }, true);
  nodes.resultStagesBtn.addEventListener("click", () => showStageSelect(currentStage));
  nodes.retryBtn.addEventListener("click", () => startStage(currentStage));
  nodes.nextStageBtn.addEventListener("click", () => startStage(Math.min(currentStage + 1, stages.length - 1)));
  nodes.resultPanel.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
  if (smokeMode) {
    window.__bubbleBakerySmoke = {
      forceFailure() {
        if (nodes.playPanel.classList.contains("hidden") || !nodes.resultPanel.classList.contains("hidden")) return null;
        moves = 0;
        finish(false);
        return { resultVisible: !nodes.resultPanel.classList.contains("hidden"), moves, boardButtons: nodes.board.querySelectorAll(".bubble").length };
      },
      stages() {
        return stages.map((stage, index) => ({
          id: index + 1,
          titleEn: stage.titleEn,
          titleZh: stage.titleZh,
          ruleEn: stage.ruleEn,
          recipes: stage.recipes.map((recipe) => ({ ...recipe })),
          minOrderGroup: stage.minOrderGroup || 2,
          sequence: Boolean(stage.sequence),
          comboThreshold: stage.comboThreshold || 0,
          groupGoal: stage.groupGoal || 0,
          checkpoint: Boolean(stage.checkpoint),
        }));
      },
      start(stageId) {
        startStage(clamp(Number(stageId) - 1, 0, stages.length - 1));
        return this.snapshot();
      },
      setBoard(nextBoard) {
        if (!Array.isArray(nextBoard) || nextBoard.length !== rows || nextBoard.some((row) => !Array.isArray(row) || row.length !== cols)) throw new Error("Smoke board must be 10x7.");
        board = nextBoard.map((row) => row.slice());
        renderAll();
        return this.snapshot();
      },
      setOrders(nextOrders) {
        orders = { ...nextOrders };
        initialOrders = { ...nextOrders };
        renderAll();
        return this.snapshot();
      },
      setMoves(nextMoves) {
        moves = clamp(Math.floor(Number(nextMoves) || 0), 0, 999);
        updateHud();
        return this.snapshot();
      },
      async popAt(row, column) {
        await popGroup(row, column);
        return this.snapshot();
      },
      snapshot() {
        return {
          stage: currentStage + 1,
          recipeIndex,
          orders: { ...orders },
          initialOrders: { ...initialOrders },
          moves,
          largestGroup,
          busy,
          resultVisible: !nodes.resultPanel.classList.contains("hidden"),
          resultTitle: nodes.resultTitle.textContent,
          bubbleCount: nodes.board.querySelectorAll(".bubble").length,
          activeTarget: activeSequenceTarget(),
          activeSequenceChips: nodes.orderBar.querySelectorAll(".order-chip.is-sequence-active").length,
          groupGoalText: nodes.orderBar.querySelector(".group-goal")?.textContent || "",
        };
      },
    };
  }
  document.querySelectorAll("img[data-fallback-src]").forEach((image) => {
    image.addEventListener("error", () => {
      const fallback = image.dataset.fallbackSrc;
      if (fallback && image.getAttribute("src") !== fallback) image.src = fallback;
    }, { once: true });
  });

  syncSharedLocale();
  localizeStatic();
  showMain();
  renderRecommendedOrder();
  renderBakeryProgress();
  renderStageGrid();
  initLoading();
})();
