(function () {
  const localeSelect = document.querySelector("#localeSelect");
  const languageLabel = document.querySelector("#languageLabel");
  const titleText = document.querySelector("#titleText");
  const mainPanel = document.querySelector("#mainPanel");
  const mainTitle = document.querySelector("#mainTitle");
  const mainIntro = document.querySelector("#mainIntro");
  const startBtn = document.querySelector("#startBtn");
  const stageSelectPanel = document.querySelector("#stageSelectPanel");
  const stageSelectTitle = document.querySelector("#stageSelectTitle");
  const stageBackBtn = document.querySelector("#stageBackBtn");
  const stageHelpBtn = document.querySelector("#helpBtn");
  const stageTabBtn = document.querySelector("#stageTabBtn");
  const stageGrid = document.querySelector("#stageGrid");
  const stageStatus = document.querySelector("#stageStatus");
  const gameHud = document.querySelector("#gameHud");
  const levelIndicator = document.querySelector("#levelIndicator");
  const progressFill = document.querySelector("#progressFill");
  const scoreText = document.querySelector("#scoreText");
  const roundText = document.querySelector("#roundText");
  const gamePlayContent = document.querySelector("#gamePlayContent");
  const dropZone = document.querySelector("#dropZone");
  const foodCard = document.querySelector("#foodCard");
  const foodImage = document.querySelector("#foodImage");
  const foodName = document.querySelector("#foodName");
  const guardianBanner = document.querySelector("#guardianBanner");
  const guardianImage = document.querySelector("#guardianImage");
  const guardianName = document.querySelector("#guardianName");
  const guardianRule = document.querySelector("#guardianRule");
  const feedbackText = document.querySelector("#feedbackText");
  const resultPanel = document.querySelector("#resultPanel");
  const resultTitle = document.querySelector("#resultTitle");
  const resultGuardian = document.querySelector("#resultGuardian") || (() => {
    const element = document.createElement("div");
    element.id = "resultGuardian";
    element.className = "result-guardian hidden";
    element.innerHTML = '<img id="resultGuardianImage" src="" alt="" /><strong id="resultGuardianText"></strong>';
    resultTitle.after(element);
    return element;
  })();
  const resultGuardianImage = resultGuardian.querySelector("#resultGuardianImage");
  const resultGuardianText = resultGuardian.querySelector("#resultGuardianText");
  const rewardParade = document.querySelector("#rewardParade");
  const resultText = document.querySelector("#resultText");
  const nextStageBtn = document.querySelector("#nextStageBtn");
  const againBtn = document.querySelector("#againBtn");
  const stageSelectBtn = document.querySelector("#stageSelectBtn");
  const homeLink = document.querySelector("#homeLink");
  const battleBackBtn = document.querySelector("#battleBackBtn");
  const battleHelpBtn = document.querySelector("#battleHelpBtn");
  const loadingPanel = document.querySelector("#loadingPanel");
  const loadingText = document.querySelector("#loadingText");
  const loadingFill = document.querySelector("#loadingFill");
  const lunchGame = document.querySelector(".lunch-game");
  lunchGame?.setAttribute("data-wp-canvas-max-width", "920");
  if ((window.WonderI18n?.actualLocale?.() || document.documentElement.lang) === "pt-BR") {
    // This game owns its Portuguese Battle and Stage copy. Keep the shared
    // runtime catalog from reinterpreting already-localized color vocabulary
    // as unrelated "core" terminology used by other games.
    lunchGame?.setAttribute("data-runtime-localize", "off");
  }
  const leaveConfirmPanel = document.createElement("section");
  leaveConfirmPanel.className = "leave-confirm-panel hidden";
  leaveConfirmPanel.setAttribute("role", "dialog");
  leaveConfirmPanel.setAttribute("aria-modal", "true");
  leaveConfirmPanel.setAttribute("aria-labelledby", "leaveConfirmTitle");
  leaveConfirmPanel.innerHTML = `<div class="leave-confirm-card"><h2 id="leaveConfirmTitle"></h2><p id="leaveConfirmText"></p><div><button id="keepSortingBtn" type="button"></button><button id="leaveLevelBtn" type="button"></button></div></div>`;
  lunchGame.append(leaveConfirmPanel);
  const leaveConfirmTitle = leaveConfirmPanel.querySelector("#leaveConfirmTitle");
  const leaveConfirmText = leaveConfirmPanel.querySelector("#leaveConfirmText");
  const keepSortingBtn = leaveConfirmPanel.querySelector("#keepSortingBtn");
  const leaveLevelBtn = leaveConfirmPanel.querySelector("#leaveLevelBtn");
  const helpPanel = document.createElement("section");
  helpPanel.className = "game-help-panel hidden";
  helpPanel.setAttribute("role", "dialog");
  helpPanel.setAttribute("aria-modal", "true");
  helpPanel.setAttribute("aria-labelledby", "gameHelpTitle");
  helpPanel.inert = true;
  helpPanel.innerHTML = `<div class="game-help-card"><h2 id="gameHelpTitle"></h2><ol><li><span>1</span><p id="gameHelpLook"></p></li><li><span>2</span><p id="gameHelpChoose"></p></li><li><span>3</span><p id="gameHelpFinish"></p></li></ol><button id="gameHelpCloseBtn" type="button"></button></div>`;
  lunchGame.append(helpPanel);
  const gameHelpTitle = helpPanel.querySelector("#gameHelpTitle");
  const gameHelpLook = helpPanel.querySelector("#gameHelpLook");
  const gameHelpChoose = helpPanel.querySelector("#gameHelpChoose");
  const gameHelpFinish = helpPanel.querySelector("#gameHelpFinish");
  const gameHelpCloseBtn = helpPanel.querySelector("#gameHelpCloseBtn");
  const GAME_ID = "color-lunchbox";
  const UNLOCK_KEY = "colorLunchboxUnlockedStage";
  const PROGRESS_KEY = "weightplay_color_lunchbox_progress";
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

  const foodsDB = {
    strawberry: { nameKey: "food_strawberry", color: "red", image: "assets/food-strawberry.svg" },
    tomato: { nameKey: "food_tomato", color: "red", image: "assets/food-tomato.svg" },
    banana: { nameKey: "food_banana", color: "yellow", image: "assets/food-banana.svg" },
    cheese: { nameKey: "food_cheese", color: "yellow", image: "assets/food-cheese.svg" },
    blueberry: { nameKey: "food_blueberry", color: "blue", image: "assets/food-blueberry.svg" },
    milk: { nameKey: "food_milk", color: "blue", image: "assets/food-milk.svg" },
    broccoli: { nameKey: "food_broccoli", color: "green", image: "assets/food-broccoli.svg" },
    apple: { nameKey: "food_apple", color: "green", image: "assets/food-apple.svg" },
    carrot: { nameKey: "food_carrot", color: "orange", image: "assets/food-carrot.svg" },
    orange: { nameKey: "food_orange", color: "orange", image: "assets/food-orange.svg" },
    eggplant: { nameKey: "food_eggplant", color: "purple", image: "assets/food-eggplant.svg" },
    grapes: { nameKey: "food_grapes", color: "purple", image: "assets/food-grapes.svg" },
    rice: { nameKey: "food_rice", color: "white", image: "assets/food-rice.svg" },
    yogurt: { nameKey: "food_yogurt", color: "white", image: "assets/food-yogurt.svg" },
    bread: { nameKey: "food_bread", color: "brown", image: "assets/food-bread.svg" },
    chocolate: { nameKey: "food_chocolate", color: "brown", image: "assets/food-chocolate.svg" },
    watermelon: { nameKey: "food_watermelon", color: "red", image: "assets/food-watermelon.svg" },
    corn: { nameKey: "food_corn", color: "yellow", image: "assets/food-corn.svg" },
    cucumber: { nameKey: "food_cucumber", color: "green", image: "assets/food-cucumber.svg" },
    fish: { nameKey: "food_fish", color: "gray", image: "assets/food-fish.svg" },
    peach: { nameKey: "food_peach", color: "pink", image: "assets/food-peach.svg" },
    blackSesame: { nameKey: "food_black_sesame", color: "black", image: "assets/food-black-sesame.svg" },
    soda: { nameKey: "food_soda", color: "cyan", image: "assets/food-soda.svg" },
    purplePotato: { nameKey: "food_purple_potato", color: "purple", image: "assets/food-purple-potato.svg" },
  };

  const colorDB = {
    red: { labelKey: "color_red", className: "red" },
    yellow: { labelKey: "color_yellow", className: "yellow" },
    blue: { labelKey: "color_blue", className: "blue" },
    green: { labelKey: "color_green", className: "green" },
    orange: { labelKey: "color_orange", className: "orange" },
    purple: { labelKey: "color_purple", className: "purple" },
    white: { labelKey: "color_white", className: "white" },
    brown: { labelKey: "color_brown", className: "brown" },
    gray: { labelKey: "color_gray", className: "gray" },
    pink: { labelKey: "color_pink", className: "pink" },
    black: { labelKey: "color_black", className: "black" },
    cyan: { labelKey: "color_cyan", className: "cyan" },
  };

  const dictionary = {
    en: {
      title: "Animal Color Lunchbox",
      language: "Language",
      chooseLevel: "Choose Level",
      startGame: "Start Game",
      scoreLabel: "Score",
      roundLabel: "Progress",
      levelLabel: "Level",
      ready: "Drag the food to the matching lunchbox.",
      voicePrompt: "Put {food} into the {color} lunchbox.",
      picturePrompt: "Match the picture!",
      lunchboxChoice: "{color} lunchbox",
      correct: "Yum! Correct!",
      wrong: "Try another box!",
      boxesMoving: "The lunchboxes are changing places.",
      guardianCheckpoint: "Friendly Guardian Check",
      winTitle: "Level Complete!",
      winDesc: "Score {score}. You unlocked the next lunchbox.",
      perfectDesc: "Perfect sorting! Score {score}. You unlocked the next lunchbox.",
      allClearTitle: "All Clear!",
      allClearDesc: "You completed every lunchbox level. Wonderful!",
      perfectAllClearDesc: "Perfect sorting! You completed every lunchbox level. Wonderful!",
      nextStage: "Next Level",
      again: "Play Again",
      levels: "Levels",
      lobby: "Lobby",
      locked: "Locked",
      lockedFeedback: "{stage} is locked. Finish Level {required} first.",
      play: "Play",
      loading: "Loading",
      stageMeta: "{foods} foods / {colors} colors",
      resultScore: "Score {score}",
      previousBest: "Previous Best: {score}",
      newBest: "New best!",
      improvement: "Improvement: {value}%",
      skillReport: "Skill Report",
      colorRecognition: "Color Recognition",
      focusSkill: "Focus",
      handEye: "Hand-Eye Coordination",
      progressMessageNew: "Great progress! You improved your best score.",
      progressMessageSteady: "Good effort! Try again to improve focus and color matching.",
      progressNote: "Scores are for fun and progress tracking only.",
      stage1Name: "Level 1: Fruit Starter",
      stage1Desc: "Classic red, yellow, blue, and green foods.",
      stage2Name: "Level 2: Breakfast Box",
      stage2Desc: "New orange, purple, white, and brown foods.",
      stage3Name: "Level 3: Garden Picnic",
      stage3Desc: "Fresh picnic foods with four new color choices.",
      stage4Name: "Level 4: Sweet Snack",
      stage4Desc: "Sort soft pink, black, white, and brown treats.",
      stage5Name: "Level 5: Market Mix",
      stage5Desc: "A busy market with five different foods.",
      stage6Name: "Level 6: Rainbow Lunch",
      stage6Desc: "A brighter lunch with orange and purple boxes.",
      stage7Name: "Level 7: Cool Drinks",
      stage7Desc: "Blue, cyan, white, and yellow make a chilly set.",
      stage8Name: "Level 8: Veggie Day",
      stage8Desc: "Green, orange, purple, and red vegetables appear.",
      stage9Name: "Level 9: Big Buffet",
      stage9Desc: "Five foods from different themes are mixed together.",
      stage10Name: "Level 10: Color Party",
      stage10Desc: "The final party mixes five colorful foods.",
      stage11Name: "Level 11: Rainbow Review",
      stage11Desc: "Five foods with five boxes, including tricky similar colors.",
      stage12Name: "Level 12: Expert Lunch Rush",
      stage12Desc: "Six color boxes appear, but only five foods are served.",
      food_strawberry: "Strawberry",
      food_tomato: "Tomato",
      food_banana: "Banana",
      food_cheese: "Cheese",
      food_milk: "Milk",
      food_blueberry: "Blueberry",
      food_broccoli: "Broccoli",
      food_apple: "Apple",
      food_carrot: "Carrot",
      food_orange: "Orange",
      food_eggplant: "Eggplant",
      food_grapes: "Grapes",
      food_rice: "Rice",
      food_yogurt: "Yogurt",
      food_bread: "Bread",
      food_chocolate: "Chocolate",
      food_watermelon: "Watermelon",
      food_corn: "Corn",
      food_cucumber: "Cucumber",
      food_fish: "Fish",
      food_peach: "Peach",
      food_black_sesame: "Black Sesame",
      food_soda: "Soda",
      food_purple_potato: "Purple Potato",
      color_red: "Red",
      color_yellow: "Yellow",
      color_blue: "Blue",
      color_green: "Green",
      color_orange: "Orange",
      color_purple: "Purple",
      color_white: "White",
      color_brown: "Brown",
      color_gray: "Gray",
      color_pink: "Pink",
      color_black: "Black",
      color_cyan: "Cyan",
    },
    "zh-Hant": {},

  };

  dictionary["zh-Hant"] = {
    title: "動物顏色便當盒",
    language: "語言",
    chooseLevel: "選擇關卡",
    startGame: "開始遊戲",
    scoreLabel: "分數",
    roundLabel: "進度",
    levelLabel: "關卡",
    ready: "把食物拖到相同顏色的便當盒。",
    picturePrompt: "看圖片配對！",
    correct: "答對了！好棒！",
    wrong: "再試試另一個盒子。",
    boxesMoving: "便當盒正在交換位置。",
    guardianCheckpoint: "友善守護員檢查",
    winTitle: "關卡完成！",
    winDesc: "分數 {score}。已解鎖下一個便當盒關卡。",
    perfectDesc: "完美分類！分數 {score}。已解鎖下一個便當盒關卡。",
    allClearTitle: "全部完成！",
    allClearDesc: "你完成了所有顏色便當盒關卡，太棒了！",
    perfectAllClearDesc: "完美分類！你完成了所有顏色便當盒關卡，太棒了！",
    nextStage: "下一關",
    again: "再玩一次",
    levels: "關卡",
    lobby: "大廳",
    locked: "未解鎖",
    lockedFeedback: "{stage} 尚未解鎖，請先完成第 {required} 關。",
    play: "開始玩",
    loading: "載入中",
    stageMeta: "{foods} 題 / {colors} 種顏色",
    resultScore: "分數 {score}",
    previousBest: "之前最佳：{score}",
    newBest: "新的最佳紀錄！",
    improvement: "進步：{value}%",
    skillReport: "能力報告",
    colorRecognition: "顏色辨識",
    focusSkill: "專注",
    handEye: "手眼協調",
    progressMessageNew: "很棒的進步！你刷新了自己的最佳紀錄。",
    progressMessageSteady: "表現不錯！再試一次可以練習專注和顏色配對。",
    progressNote: "分數只用於遊戲鼓勵與本機進步紀錄。",
    stage1Name: "第 1 關：水果入門",
    stage1Desc: "經典紅、黃、藍、綠食物。",
    stage2Name: "第 2 關：早餐便當",
    stage2Desc: "加入橘、紫、白、棕色食物。",
    stage3Name: "第 3 關：花園野餐",
    stage3Desc: "新鮮野餐食物與四種顏色選擇。",
    stage4Name: "第 4 關：甜點點心",
    stage4Desc: "分類粉紅、黑、白、棕色小點心。",
    stage5Name: "第 5 關：市場混合",
    stage5Desc: "熱鬧市場中出現五種不同食物。",
    stage6Name: "第 6 關：彩虹午餐",
    stage6Desc: "更明亮的午餐，加入橘色和紫色盒子。",
    stage7Name: "第 7 關：清涼飲品",
    stage7Desc: "藍、青、白、黃組成清涼挑戰。",
    stage8Name: "第 8 關：蔬菜日",
    stage8Desc: "綠、橘、紫、紅色蔬菜登場。",
    stage9Name: "第 9 關：大餐自助吧",
    stage9Desc: "來自不同主題的五種食物混在一起。",
    stage10Name: "第 10 關：顏色派對",
    stage10Desc: "最後派對混合五種繽紛食物。",
    stage11Name: "第 11 關：彩虹複習",
    stage11Desc: "五種食物與五個盒子，包含容易混淆的相近顏色。",
    stage12Name: "第 12 關：高手午餐快手",
    stage12Desc: "六種顏色盒子登場，但只會出現五種食物。",
    food_strawberry: "草莓",
    food_tomato: "番茄",
    food_banana: "香蕉",
    food_cheese: "起司",
    food_milk: "牛奶",
    food_blueberry: "藍莓",
    food_broccoli: "花椰菜",
    food_apple: "蘋果",
    food_carrot: "胡蘿蔔",
    food_orange: "橘子",
    food_eggplant: "茄子",
    food_grapes: "葡萄",
    food_rice: "白飯",
    food_yogurt: "優格",
    food_bread: "麵包",
    food_chocolate: "巧克力",
    food_watermelon: "西瓜",
    food_corn: "玉米",
    food_cucumber: "小黃瓜",
    food_fish: "魚",
    food_peach: "桃子",
    food_black_sesame: "黑芝麻",
    food_soda: "汽水",
    food_purple_potato: "紫薯",
    color_red: "紅色",
    color_yellow: "黃色",
    color_blue: "藍色",
    color_green: "綠色",
    color_orange: "橘色",
    color_purple: "紫色",
    color_white: "白色",
    color_brown: "棕色",
    color_gray: "灰色",
    color_pink: "粉紅色",
    color_black: "黑色",
    color_cyan: "青色",
  };

  dictionary["zh-Hant"].voicePrompt = "\u628a {food} \u653e\u9032 {color} \u4fbf\u7576\u76d2\u3002";
  dictionary["zh-Hant"].lunchboxChoice = "{color}\u4fbf\u7576\u76d2";

  dictionary.es = {
    title: "Fiambrera de Colores Animales", language: "Idioma", chooseLevel: "Elegir nivel", startGame: "Iniciar juego",
    scoreLabel: "Puntuación", roundLabel: "Progreso", levelLabel: "Nivel",
    ready: "Arrastra la comida hasta la fiambrera del mismo color.", voicePrompt: "Pon {food} en la fiambrera {color}.", picturePrompt: "¡Relaciona la imagen!", lunchboxChoice: "Fiambrera {color}",
    correct: "¡Bien! ¡Correcto!", wrong: "¡Prueba con otra caja!", boxesMoving: "Las fiambreras están cambiando de lugar.", guardianCheckpoint: "Prueba amistosa del guardián",
    winTitle: "¡Nivel completado!", winDesc: "Puntuación: {score}. Has desbloqueado la siguiente fiambrera.", perfectDesc: "¡Clasificación perfecta! Puntuación: {score}. Has desbloqueado la siguiente fiambrera.",
    allClearTitle: "¡Todo completado!", allClearDesc: "Has completado todos los niveles de fiambreras. ¡Genial!", perfectAllClearDesc: "¡Clasificación perfecta! Has completado todos los niveles. ¡Genial!",
    nextStage: "Siguiente nivel", again: "Jugar de nuevo", levels: "Niveles", lobby: "Sala de juegos", locked: "Bloqueado", lockedFeedback: "{stage} está bloqueado. Completa primero el nivel {required}.", play: "Jugar", loading: "Cargando",
    stageMeta: "{foods} comidas / {colors} colores", resultScore: "Puntuación: {score}", previousBest: "Mejor anterior: {score}", newBest: "¡Nuevo récord!", improvement: "Mejora: {value}%",
    skillReport: "Informe de habilidades", colorRecognition: "Reconocimiento de colores", focusSkill: "Concentración", handEye: "Coordinación visual",
    progressMessageNew: "¡Gran progreso! Has mejorado tu mejor puntuación.", progressMessageSteady: "¡Buen esfuerzo! Juega otra vez para practicar la atención y los colores.", progressNote: "Las puntuaciones solo sirven para divertirse y seguir el progreso.",
    food_strawberry: "Fresa", food_tomato: "Tomate", food_banana: "Plátano", food_cheese: "Queso", food_milk: "Leche", food_blueberry: "Arándano", food_broccoli: "Brócoli", food_apple: "Manzana",
    food_carrot: "Zanahoria", food_orange: "Naranja", food_eggplant: "Berenjena", food_grapes: "Uvas", food_rice: "Arroz", food_yogurt: "Yogur", food_bread: "Pan", food_chocolate: "Chocolate",
    food_watermelon: "Sandía", food_corn: "Maíz", food_cucumber: "Pepino", food_fish: "Pescado", food_peach: "Melocotón", food_black_sesame: "Sésamo negro", food_soda: "Refresco", food_purple_potato: "Batata morada",
    color_red: "roja", color_yellow: "amarilla", color_blue: "azul", color_green: "verde", color_orange: "naranja", color_purple: "morada", color_white: "blanca", color_brown: "marrón", color_gray: "gris", color_pink: "rosa", color_black: "negra", color_cyan: "cian",
  };

  dictionary["pt-BR"] = {
    title: "Marmita Colorida dos Animais", language: "Idioma", chooseLevel: "Escolher nível", startGame: "Iniciar jogo",
    scoreLabel: "Pontos", roundLabel: "Progresso", levelLabel: "Nível",
    ready: "Arraste o alimento até a marmita da mesma cor.", voicePrompt: "Coloque {food} na marmita {color}.", picturePrompt: "Combine a imagem!", lunchboxChoice: "Marmita {color}",
    correct: "Muito bem!", wrong: "Tente outra marmita!", boxesMoving: "As marmitas estão mudando de lugar.", guardianCheckpoint: "Desafio amigável do Guardião",
    winTitle: "Nível concluído!", winDesc: "Pontos: {score}. Você desbloqueou a próxima marmita.", perfectDesc: "Combinação perfeita! Pontos: {score}. Você desbloqueou a próxima marmita.",
    allClearTitle: "Tudo concluído!", allClearDesc: "Você completou todos os níveis. Parabéns!", perfectAllClearDesc: "Combinação perfeita! Você completou todos os níveis. Parabéns!",
    nextStage: "Próximo nível", again: "Jogar de novo", levels: "Níveis", lobby: "Jogos", locked: "Bloqueado", lockedFeedback: "{stage} está bloqueado. Conclua primeiro o Nível {required}.", play: "Jogar", loading: "Carregando",
    stageMeta: "{foods} alimentos / {colors} cores", resultScore: "Pontos: {score}", previousBest: "Melhor anterior: {score}", newBest: "Novo recorde!", improvement: "Melhora: {value}%",
    skillReport: "Relatório de habilidades", colorRecognition: "Reconhecimento de cores", focusSkill: "Atenção", handEye: "Coordenação motora",
    progressMessageNew: "Que progresso! Você superou sua melhor pontuação.", progressMessageSteady: "Bom trabalho! Jogue novamente para praticar a atenção e as cores.", progressNote: "A pontuação serve apenas para diversão e acompanhamento do progresso.",
    food_strawberry: "Morango", food_tomato: "Tomate", food_banana: "Banana", food_cheese: "Queijo", food_milk: "Leite", food_blueberry: "Mirtilo", food_broccoli: "Brócolis", food_apple: "Maçã",
    food_carrot: "Cenoura", food_orange: "Laranja", food_eggplant: "Berinjela", food_grapes: "Uvas", food_rice: "Arroz", food_yogurt: "Iogurte", food_bread: "Pão", food_chocolate: "Chocolate",
    food_watermelon: "Melancia", food_corn: "Milho", food_cucumber: "Pepino", food_fish: "Peixe", food_peach: "Pêssego", food_black_sesame: "Gergelim preto", food_soda: "Bebida azul", food_purple_potato: "Batata-roxa",
    color_red: "vermelha", color_yellow: "amarela", color_blue: "azul", color_green: "verde", color_orange: "laranja", color_purple: "roxa", color_white: "branca", color_brown: "marrom", color_gray: "cinza", color_pink: "rosa", color_black: "preta", color_cyan: "ciano",
    leaveTitle: "Sair deste nível?", leaveText: "O progresso e os pontos deste nível serão reiniciados.", keepSorting: "Continuar organizando", leaveLevel: "Sair do nível",
    helpAria: "Como jogar", helpTitle: "Como preparar a marmita", helpLook: "Observe o alimento e sua cor.", helpChoose: "Toque nele ou arraste-o até a marmita da mesma cor.", helpFinish: "Guarde os cinco alimentos para concluir o nível.", helpClose: "Continuar organizando",
    guardianCelebration: "{guardian} comemora com você!",
  };

  Object.assign(dictionary.en, {
    leaveTitle: "Leave this lunchbox?",
    leaveText: "Your sorting progress and score in this level will reset.",
    keepSorting: "Keep sorting",
    leaveLevel: "Leave level",
    helpAria: "How to play",
    helpTitle: "How to pack the lunchbox",
    helpLook: "Look at the food and its color.",
    helpChoose: "Tap or drag it to the lunchbox with the same color.",
    helpFinish: "Pack all five foods to finish the level.",
    helpClose: "Keep sorting",
    guardianCelebration: "{guardian} celebrates with you!",
  });
  Object.assign(dictionary["zh-Hant"], {
    leaveTitle: "\u8981\u96e2\u958b\u9019\u500b\u9910\u76d2\u55ce\uff1f",
    leaveText: "\u9019\u4e00\u95dc\u7684\u5206\u985e\u9032\u5ea6\u8207\u5206\u6578\u6703\u91cd\u65b0\u958b\u59cb\u3002",
    keepSorting: "\u7e7c\u7e8c\u5206\u985e",
    leaveLevel: "\u96e2\u958b\u95dc\u5361",
    helpAria: "\u73a9\u6cd5\u8aaa\u660e",
    helpTitle: "\u600e\u9ebc\u88dd\u597d\u4fbf\u7576\u76d2",
    helpLook: "\u770b\u770b\u98df\u7269\u548c\u5b83\u7684\u984f\u8272\u3002",
    helpChoose: "\u9ede\u4e00\u4e0b\u6216\u62d6\u66f3\u5230\u76f8\u540c\u984f\u8272\u7684\u4fbf\u7576\u76d2\u3002",
    helpFinish: "\u653e\u597d\u4e94\u500b\u98df\u7269\u5c31\u80fd\u904e\u95dc\u3002",
    helpClose: "\u7e7c\u7e8c\u5206\u985e",
    guardianCelebration: "{guardian}\u966a\u4f60\u4e00\u8d77\u6176\u795d\uff01",
  });
  Object.assign(dictionary.es, {
    leaveTitle: "¿Salir de esta fiambrera?",
    leaveText: "Se reiniciarán el progreso de clasificación y la puntuación de este nivel.",
    keepSorting: "Seguir clasificando",
    leaveLevel: "Salir del nivel",
    helpAria: "C\u00f3mo jugar",
    helpTitle: "C\u00f3mo preparar la fiambrera",
    helpLook: "Mira la comida y su color.",
    helpChoose: "T\u00f3cala o arr\u00e1strala a la fiambrera del mismo color.",
    helpFinish: "Guarda los cinco alimentos para completar el nivel.",
    helpClose: "Seguir clasificando",
    guardianCelebration: "\u00a1{guardian} celebra contigo!",
  });

  const pageMetadata = {
    en: {
      title: "Animal Color Lunchbox - WeightPlay",
      metaTitle: "Animal Color Lunchbox - Color Matching Game",
      description: "Clear 30 short color-sorting levels with picture clues, safe moving boxes, friendly animal Guardians, and supportive retries.",
    },
    "zh-Hant": {
      title: "動物顏色便當盒 - WeightPlay",
      metaTitle: "動物顏色便當盒 - 顏色分類遊戲",
      description: "在動物顏色便當盒完成 30 個短篇顏色分類關卡，包含圖片提示、安全換位、友善動物守護員與溫和重試。",
    },
    es: {
      title: "Fiambrera de Colores Animales - WeightPlay",
      metaTitle: "Fiambrera de Colores Animales - Juego de clasificación",
      description: "Completa 30 niveles breves de clasificación por color con pistas visuales, cajas móviles seguras, guardianes animales amistosos y reintentos amables.",
    },
    "pt-BR": {
      title: "Marmita Colorida dos Animais - WeightPlay",
      metaTitle: "Marmita Colorida dos Animais - Jogo de combinar cores",
      description: "Complete 30 níveis curtos de combinação de cores com pistas visuais, marmitas que se movem com segurança, Guardiões amigáveis e novas tentativas sem punição.",
    },
  };

  const guardians = Object.freeze({
    mimi: { nameEn: "Rainbow Hop Mimi", nameZh: "彩虹跳跳咪咪", nameEs: "Mimi Salto Arcoíris", image: "../../assets/weightplay-character-rainbow-hop-mimi-clean-cutout.webp" },
    orla: { nameEn: "Moon Cap Orla", nameZh: "月帽歐拉", nameEs: "Orla Gorro Lunar", image: "../../assets/weightplay-character-moon-cap-owl-cutout.webp" },
    nori: { nameEn: "Bubble Fin Nori", nameZh: "泡泡鰭諾里", nameEs: "Nori Aleta Burbuja", image: "../../assets/weightplay-character-bubble-fin-otter-cutout.webp" },
    pogo: { nameEn: "Drum Belly Pogo", nameZh: "鼓肚波哥", nameEs: "Pogo Barriga Tambor", image: "../../assets/weightplay-character-drum-belly-panda-clean-cutout.webp" },
    taro: { nameEn: "Moss Shell Taro", nameZh: "苔殼塔羅", nameEs: "Taro Caparazón de Musgo", image: "../../assets/weightplay-character-moss-shell-turtle-cutout.webp" },
    fia: { nameEn: "Spark Paw Fia", nameZh: "星爪菲亞", nameEs: "Fia Pata Chispa", image: "../../assets/weightplay-character-spark-paw-fox-cutout.webp" },
  });

  Object.assign(guardians.mimi, { namePt: "Mimi Salto Arco-Íris" });
  Object.assign(guardians.orla, { namePt: "Orla Chapéu Lunar" });
  Object.assign(guardians.nori, { namePt: "Nori Nadadeira de Bolhas" });
  Object.assign(guardians.pogo, { namePt: "Pogo Barriga de Tambor" });
  Object.assign(guardians.taro, { namePt: "Taro Casco de Musgo" });
  Object.assign(guardians.fia, { namePt: "Fia Pata Cintilante" });

  const stage = (id, nameEn, nameZh, descEn, descZh, colors, foods, rules = {}) => ({ id, nameEn, nameZh, descEn, descZh, colors, foods, rounds: 5, ...rules });

  const stages = [
    stage(1, "Fruit Starter", "水果入門", "Four clear colors and fixed boxes.", "四種清楚顏色與固定盒位。", ["red", "yellow", "blue", "green"], ["strawberry", "banana", "blueberry", "apple", "tomato"]),
    stage(2, "Breakfast Box", "早餐便當", "Meet orange, purple, white, and brown.", "認識橘、紫、白與棕色。", ["orange", "purple", "white", "brown"], ["carrot", "eggplant", "rice", "bread", "orange"]),
    stage(3, "Garden Picnic", "花園野餐", "Fruit and vegetables share four boxes.", "水果與蔬菜共用四個盒子。", ["red", "yellow", "green", "purple"], ["tomato", "corn", "cucumber", "grapes", "strawberry"]),
    stage(4, "Sweet Snack", "甜點點心", "Compare pink, black, white, and brown.", "比較粉紅、黑、白與棕色。", ["pink", "black", "white", "brown"], ["peach", "blackSesame", "yogurt", "chocolate", "rice"]),
    stage(5, "Mimi's Picnic Check", "咪咪的野餐檢查", "Mimi swaps the boxes once after three foods.", "咪咪會在三份食物後交換一次盒位。", ["orange", "blue", "green", "gray"], ["orange", "blueberry", "broccoli", "fish", "carrot"], { guardian: "mimi", shuffle: "once" }),
    stage(6, "Warm Color Table", "暖色餐桌", "Red, pink, orange, and yellow sit together.", "紅、粉紅、橘與黃一起出現。", ["red", "pink", "orange", "yellow"], ["strawberry", "peach", "carrot", "banana", "tomato"]),
    stage(7, "Cool Drink Table", "冷色飲品桌", "Blue, cyan, white, and purple sit together.", "藍、青、白與紫一起出現。", ["blue", "cyan", "white", "purple"], ["blueberry", "soda", "milk", "yogurt", "grapes"]),
    stage(8, "Light and Dark", "明暗顏色", "Sort white, gray, brown, and black foods.", "分類白、灰、棕與黑色食物。", ["white", "gray", "brown", "black"], ["rice", "fish", "bread", "chocolate", "blackSesame"]),
    stage(9, "Picture-Only Picnic", "圖片野餐", "Use pictures and color swatches instead of printed names.", "用圖片與色塊配對，不依賴印刷名稱。", ["pink", "gray", "black", "yellow"], ["peach", "fish", "blackSesame", "banana", "corn"], { pictureOnly: true }),
    stage(10, "Orla's Morning Check", "歐拉的早晨檢查", "Orla settles the boxes into new places after each match.", "歐拉會在每次配對後讓盒子換到新位置。", ["red", "orange", "purple", "cyan"], ["strawberry", "orange", "grapes", "soda", "watermelon"], { guardian: "orla", shuffle: "each" }),
    stage(11, "Red or Pink?", "紅色還是粉紅？", "Look closely at similar warm colors.", "仔細分辨相近暖色。", ["red", "pink", "orange", "yellow", "green"], ["tomato", "peach", "orange", "corn", "cucumber"]),
    stage(12, "Blue or Cyan?", "藍色還是青色？", "Six boxes include close cool colors.", "六個盒子包含相近冷色。", ["blue", "cyan", "white", "gray", "black", "purple"], ["blueberry", "soda", "yogurt", "fish", "blackSesame"], { decoys: 1 }),
    stage(13, "Pantry Neutrals", "餐櫃中性色", "Compare white, gray, brown, and black pantry foods.", "比較白、灰、棕與黑色餐櫃食物。", ["white", "gray", "brown", "black"], ["rice", "yogurt", "fish", "bread", "blackSesame"]),
    stage(14, "Extra Empty Box", "多一個空盒", "One visible box has no matching food.", "其中一個可見盒子沒有對應食物。", ["red", "yellow", "green", "purple", "orange", "cyan"], ["strawberry", "banana", "apple", "grapes", "carrot"], { decoys: 1 }),
    stage(15, "Nori's Cool Check", "諾里的清涼檢查", "Nori uses picture-first cool colors and one decoy.", "諾里使用圖片優先的冷色與一個干擾盒。", ["blue", "cyan", "white", "yellow", "gray", "purple"], ["blueberry", "soda", "yogurt", "banana", "fish"], { guardian: "nori", pictureOnly: true, decoys: 1 }),
    stage(16, "Vegetable Basket", "蔬菜籃", "Vegetable shapes become the main clue.", "以蔬菜外形作為主要線索。", ["green", "orange", "purple", "red"], ["broccoli", "cucumber", "carrot", "purplePotato", "tomato"]),
    stage(17, "Fruit Basket", "水果籃", "Five fruit shapes cross warm and green colors.", "五種水果跨越暖色與綠色。", ["red", "pink", "orange", "yellow", "green"], ["watermelon", "peach", "orange", "banana", "apple"]),
    stage(18, "Breakfast Basket", "早餐籃", "Breakfast foods mix five color families.", "早餐食物混合五種顏色。", ["white", "yellow", "brown", "blue", "purple"], ["rice", "cheese", "bread", "milk", "grapes"]),
    stage(19, "Snack Basket", "點心籃", "Treats mix light, dark, and warm colors.", "點心混合明暗與暖色。", ["pink", "black", "white", "brown", "orange"], ["peach", "blackSesame", "yogurt", "chocolate", "carrot"]),
    stage(20, "Pogo's Buffet Check", "波哥的自助餐檢查", "Pogo adds two harmless unused boxes.", "波哥加入兩個不影響答案的空盒。", ["red", "yellow", "green", "purple", "brown", "cyan", "gray"], ["tomato", "corn", "cucumber", "grapes", "bread"], { guardian: "pogo", decoys: 2 }),
    stage(21, "Moving Lunchboxes", "會移動的便當盒", "Boxes settle into new places after every match.", "每次配對後盒子會換到新位置。", ["red", "yellow", "blue", "green"], ["strawberry", "banana", "blueberry", "broccoli", "tomato"], { shuffle: "each" }),
    stage(22, "Warm Picture Match", "暖色圖片配對", "Match warm colors with picture-first prompts.", "使用圖片優先提示配對暖色。", ["red", "pink", "orange", "yellow"], ["watermelon", "peach", "orange", "corn", "carrot"], { pictureOnly: true }),
    stage(23, "Cool Picture Match", "冷色圖片配對", "Match cool and neutral colors by picture.", "使用圖片配對冷色與中性色。", ["blue", "cyan", "white", "purple", "gray"], ["blueberry", "soda", "yogurt", "grapes", "fish"], { pictureOnly: true }),
    stage(24, "Follow the Settle", "看清楚再配對", "Similar colors move only after a correct answer.", "相近顏色只會在答對後移動。", ["red", "pink", "orange", "yellow", "green"], ["tomato", "peach", "orange", "banana", "apple"], { shuffle: "each" }),
    stage(25, "Taro's Garden Check", "塔羅的花園檢查", "Taro mirrors the boxes once halfway through.", "塔羅會在中途把盒位鏡像交換一次。", ["green", "orange", "purple", "red", "yellow"], ["broccoli", "carrot", "purplePotato", "tomato", "corn"], { guardian: "taro", shuffle: "half" }),
    stage(26, "Six-Box Rainbow", "六盒彩虹", "Six boxes widen the choice without longer play.", "六個盒子增加選擇，但不延長遊玩。", ["red", "yellow", "blue", "green", "orange", "purple"], ["strawberry", "banana", "blueberry", "broccoli", "carrot"], { decoys: 1 }),
    stage(27, "Warm and Cool Relay", "暖冷色接力", "Foods alternate between warm and cool groups.", "食物在暖色與冷色之間輪流出現。", ["red", "blue", "orange", "cyan", "yellow"], ["strawberry", "blueberry", "carrot", "soda", "corn"], { order: "alternating" }),
    stage(28, "Helpful Decoys", "友善干擾盒", "Two unused boxes stay available for careful looking.", "保留兩個未使用盒子，鼓勵仔細觀察。", ["red", "yellow", "green", "purple", "brown", "cyan", "gray"], ["tomato", "corn", "cucumber", "grapes", "bread"], { decoys: 2 }),
    stage(29, "Festival Practice", "慶典練習", "Six close-color boxes settle after every match.", "六個相近色盒子在每次配對後換位。", ["red", "pink", "orange", "yellow", "green", "purple"], ["watermelon", "peach", "orange", "corn", "grapes"], { shuffle: "each", decoys: 1 }),
    stage(30, "Fia's Rainbow Festival", "菲亞的彩虹慶典", "Fia combines pictures, decoys, and safe box shuffles.", "菲亞結合圖片、干擾盒與安全換位。", ["red", "pink", "orange", "yellow", "green", "purple"], ["strawberry", "peach", "carrot", "banana", "cucumber"], { guardian: "fia", pictureOnly: true, shuffle: "each", decoys: 1 }),
  ];

  const spanishStageCopy = [
    ["Inicio con frutas", "Cuatro colores claros y cajas fijas."],
    ["Fiambrera de desayuno", "Conoce el naranja, morado, blanco y marrón."],
    ["Pícnic en el jardín", "Frutas y verduras comparten cuatro cajas."],
    ["Merienda dulce", "Compara rosa, negro, blanco y marrón."],
    ["Prueba de pícnic de Mimi", "Mimi intercambia las cajas una vez tras tres comidas."],
    ["Mesa de colores cálidos", "Rojo, rosa, naranja y amarillo aparecen juntos."],
    ["Mesa de bebidas frías", "Azul, cian, blanco y morado aparecen juntos."],
    ["Claro y oscuro", "Clasifica comidas blancas, grises, marrones y negras."],
    ["Pícnic solo con imágenes", "Usa imágenes y muestras de color en lugar de nombres."],
    ["Prueba matinal de Orla", "Orla coloca las cajas en nuevos lugares tras cada acierto."],
    ["¿Rojo o rosa?", "Observa con cuidado los colores cálidos parecidos."],
    ["¿Azul o cian?", "Seis cajas incluyen colores fríos parecidos."],
    ["Neutros de la despensa", "Compara alimentos blancos, grises, marrones y negros."],
    ["Una caja vacía extra", "Una caja visible no tiene comida correspondiente."],
    ["Prueba fría de Nori", "Nori usa imágenes de colores fríos y una caja señuelo."],
    ["Cesta de verduras", "Las formas de las verduras son la pista principal."],
    ["Cesta de frutas", "Cinco frutas recorren colores cálidos y verdes."],
    ["Cesta de desayuno", "Los alimentos del desayuno mezclan cinco familias de color."],
    ["Cesta de meriendas", "Los dulces mezclan colores claros, oscuros y cálidos."],
    ["Prueba de bufé de Pogo", "Pogo añade dos cajas sin usar que no causan daño."],
    ["Fiambreras móviles", "Las cajas cambian de lugar después de cada acierto."],
    ["Imágenes de colores cálidos", "Relaciona colores cálidos usando primero las imágenes."],
    ["Imágenes de colores fríos", "Relaciona por imagen colores fríos y neutros."],
    ["Sigue el cambio", "Los colores parecidos solo se mueven tras una respuesta correcta."],
    ["Prueba del jardín de Taro", "Taro refleja la posición de las cajas una vez a mitad del nivel."],
    ["Arcoíris de seis cajas", "Seis cajas amplían las opciones sin alargar la partida."],
    ["Relevo cálido y frío", "Las comidas alternan entre grupos cálidos y fríos."],
    ["Señuelos útiles", "Dos cajas sin usar permanecen para fomentar una mirada cuidadosa."],
    ["Práctica del festival", "Seis cajas de colores cercanos cambian tras cada acierto."],
    ["Festival arcoíris de Fia", "Fia combina imágenes, señuelos y cambios seguros de cajas."],
  ];
  if (spanishStageCopy.length !== stages.length) throw new Error("Spanish lunchbox-stage coverage must match all stages.");
  stages.forEach((item, index) => {
    [item.nameEs, item.descEs] = spanishStageCopy[index];
  });

  const portugueseStageCopy = [
    ["Primeiras frutas", "Quatro cores bem diferentes e marmitas em posições fixas."],
    ["Marmita do café da manhã", "Conheça as cores laranja, roxa, branca e marrom."],
    ["Piquenique no jardim", "Frutas e verduras compartilham quatro marmitas."],
    ["Lanche doce", "Compare alimentos rosa, pretos, brancos e marrons."],
    ["Desafio de piquenique da Mimi", "Mimi troca as marmitas de lugar uma vez, depois do terceiro alimento."],
    ["Mesa de cores quentes", "Vermelho, rosa, laranja e amarelo aparecem juntos."],
    ["Mesa de bebidas em cores frias", "Azul, ciano, branco e roxo aparecem juntos."],
    ["Claro e escuro", "Organize alimentos brancos, cinza, marrons e pretos."],
    ["Piquenique só com imagens", "Use imagens e amostras de cor em vez de nomes escritos."],
    ["Desafio matinal da Orla", "Orla acomoda as marmitas em novos lugares depois de cada acerto."],
    ["Vermelho ou rosa?", "Observe com atenção as cores quentes parecidas."],
    ["Azul ou ciano?", "Seis marmitas incluem cores frias parecidas."],
    ["Cores neutras da despensa", "Compare alimentos brancos, cinza, marrons e pretos."],
    ["Uma marmita vazia a mais", "Uma das marmitas visíveis não combina com nenhum alimento."],
    ["Desafio de cores frias do Nori", "Nori usa primeiro as imagens de cores frias e inclui uma marmita que não será usada."],
    ["Cesta de verduras", "Os formatos das verduras se tornam a pista principal."],
    ["Cesta de frutas", "Cinco formatos de frutas passam por cores quentes e verdes."],
    ["Cesta do café da manhã", "Os alimentos do café da manhã misturam cinco grupos de cores."],
    ["Cesta de lanches", "Os lanches misturam cores claras, escuras e quentes."],
    ["Desafio do bufê do Pogo", "Pogo acrescenta duas marmitas extras que não precisam ser usadas."],
    ["Marmitas em movimento", "As marmitas se acomodam em novos lugares depois de cada acerto."],
    ["Imagens de cores quentes", "Combine cores quentes usando primeiro as imagens."],
    ["Imagens de cores frias", "Combine pela imagem as cores frias e neutras."],
    ["Espere as marmitas pararem", "As cores parecidas só mudam de lugar depois de uma resposta correta."],
    ["Desafio do jardim do Taro", "Taro inverte a ordem das marmitas uma vez, na metade do nível."],
    ["Arco-íris de seis marmitas", "Seis marmitas ampliam as escolhas sem deixar a partida mais longa."],
    ["Revezamento quente e frio", "Os alimentos alternam entre grupos de cores quentes e frias."],
    ["Marmitas extras para observar", "Duas marmitas não utilizadas ficam visíveis para incentivar a observação cuidadosa."],
    ["Treino para o festival", "Seis marmitas de cores parecidas se acomodam depois de cada acerto."],
    ["Festival Arco-Íris da Fia", "Fia combina imagens, uma marmita extra e mudanças de lugar seguras."],
  ];
  if (portugueseStageCopy.length !== stages.length) throw new Error("Portuguese lunchbox-stage coverage must match all stages.");
  stages.forEach((item, index) => {
    [item.namePt, item.descPt] = portugueseStageCopy[index];
  });

  validateStageData();

  const state = {
    stageIndex: 0,
    deck: [],
    index: 0,
    score: 0,
    mistakes: 0,
    unlockedStage: 1,
    dragging: false,
    activePointerId: null,
    boxTransitioning: false,
    startX: 0,
    startY: 0,
    ready: false,
  };
  let leaveConfirmOpen = false;
  let helpOpen = false;
  let helpReturnTarget = null;

  function locale() {
    const requested = window.WonderI18n?.actualLocale?.();
    if (requested && dictionary[requested]) return requested;
    return window.WonderI18n?.locale() || "en";
  }

  function t(key, params = {}) {
    const table = dictionary[locale()] || dictionary.en;
    const fallback = dictionary.en;
    const raw = table[key] || fallback[key] || key;
    return Object.entries(params).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), raw);
  }

  function installOwnedPortugueseLocalizer() {
    if (locale() !== "pt-BR" || window.WeightPlayGameRuntimeLocalizer) return;

    const exactTranslations = new Map([
      ["Start Game", "Iniciar jogo"],
      ["Sort food by color.", "Separe os alimentos por cor."],
      ["Look", "Observe"],
      ["Check each food color.", "Observe a cor de cada alimento."],
      ["Drag", "Arraste"],
      ["Drag food into the matching lunchbox.", "Arraste o alimento até a marmita da mesma cor."],
      ["Clear", "Conclua"],
      ["Sort everything correctly to finish.", "Separe todos os alimentos corretamente para concluir."],
      ["Start Playing", "Começar a jogar"],
      ["Close tutorial", "Fechar tutorial"],
      ["How to play", "Como jogar"],
      ["Back to lobby", "Voltar ao início"],
    ]);

    const translate = (value) => exactTranslations.get(String(value).trim()) || String(value);
    const translateElement = (element) => {
      if (!(element instanceof Element)) return;
      for (const attribute of ["aria-label", "title", "placeholder"]) {
        const current = element.getAttribute(attribute);
        if (current && exactTranslations.has(current.trim())) element.setAttribute(attribute, translate(current));
      }
    };
    const translateTree = (root) => {
      if (!root) return;
      if (root.nodeType === Node.TEXT_NODE) {
        const original = root.nodeValue || "";
        const trimmed = original.trim();
        if (exactTranslations.has(trimmed)) root.nodeValue = original.replace(trimmed, translate(trimmed));
        return;
      }
      if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
      if (root.nodeType === Node.ELEMENT_NODE) translateElement(root);
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        if (walker.currentNode.nodeType === Node.TEXT_NODE) translateTree(walker.currentNode);
        else translateElement(walker.currentNode);
      }
    };

    window.WeightPlayGameRuntimeLocalizer = Object.freeze({
      locale: "pt-BR",
      source: "color-lunchbox-owned",
      translate,
      translateTree,
    });
    translateTree(document.documentElement);
    new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "characterData") translateTree(record.target);
        for (const node of record.addedNodes) translateTree(node);
      }
    }).observe(document.documentElement, { childList: true, characterData: true, subtree: true });
  }

  installOwnedPortugueseLocalizer();

  const startLabelObserver = new MutationObserver(() => {
    if (locale() !== "pt-BR") return;
    const label = t("startGame");
    if (startBtn.textContent !== label) startBtn.textContent = label;
  });
  startLabelObserver.observe(startBtn, { childList: true, characterData: true, subtree: true });

  function setMeta(selector, attr, value) {
    const element = document.head.querySelector(selector);
    if (element) element.setAttribute(attr, value);
  }

  function updatePageMetadata() {
    const meta = pageMetadata[locale()] || pageMetadata.en;
    document.title = meta.title;
    setMeta('meta[name="description"]', "content", meta.description);
    setMeta('meta[property="og:title"]', "content", meta.metaTitle);
    setMeta('meta[property="og:description"]', "content", meta.description);
    setMeta('meta[name="twitter:title"]', "content", meta.metaTitle);
    setMeta('meta[name="twitter:description"]', "content", meta.description);
  }

  function shuffle(items) {
    return [...items].sort(() => Math.random() - 0.5);
  }

  function validateStageData() {
    const guardianStages = [5, 10, 15, 20, 25, 30];
    const allowedShuffle = new Set([undefined, "once", "each", "half"]);
    for (const stage of stages) {
      const uniqueFoods = new Set(stage.foods);
      if (uniqueFoods.size !== stage.foods.length) {
        throw new Error(`Color Lunchbox stage ${stage.id} has duplicate foods.`);
      }
      if (stage.rounds > uniqueFoods.size) {
        throw new Error(`Color Lunchbox stage ${stage.id} has more rounds than unique foods.`);
      }
      if (stage.rounds !== 5) throw new Error(`Color Lunchbox stage ${stage.id} must stay at five foods.`);
      if (!allowedShuffle.has(stage.shuffle)) throw new Error(`Color Lunchbox stage ${stage.id} has an invalid shuffle rule.`);
      if (Boolean(stage.guardian) !== guardianStages.includes(stage.id)) throw new Error(`Color Lunchbox stage ${stage.id} has an invalid Guardian checkpoint.`);
      if (stage.guardian && !guardians[stage.guardian]) throw new Error(`Color Lunchbox stage ${stage.id} references a missing Guardian.`);
      for (const foodId of stage.foods) {
        const food = foodsDB[foodId];
        if (!food) throw new Error(`Color Lunchbox stage ${stage.id} references missing food ${foodId}.`);
        if (!stage.colors.includes(food.color)) {
          throw new Error(`Color Lunchbox stage ${stage.id} is missing ${food.color} box for ${foodId}.`);
        }
      }
      const usedColors = new Set(stage.foods.map((foodId) => foodsDB[foodId].color));
      const unusedColors = stage.colors.filter((color) => !usedColors.has(color));
      if ((stage.decoys || 0) !== unusedColors.length) throw new Error(`Color Lunchbox stage ${stage.id} decoy count does not match unused boxes.`);
    }
  }

  function stageName(stage) {
    if (locale() === "zh-Hant") return stage.nameZh;
    if (locale() === "es") return stage.nameEs;
    if (locale() === "pt-BR") return stage.namePt;
    return stage.nameEn;
  }

  function stageDescription(stage) {
    if (locale() === "zh-Hant") return stage.descZh;
    if (locale() === "es") return stage.descEs;
    if (locale() === "pt-BR") return stage.descPt;
    return stage.descEn;
  }

  function loadUnlockedStage() {
    try {
      const saved = Number(storageRead(UNLOCK_KEY));
      state.unlockedStage = Number.isFinite(saved) && saved >= 1 ? Math.min(saved, stages.length) : 1;
    } catch {
      state.unlockedStage = 1;
    }
  }

  function saveUnlockedStage(value) {
    state.unlockedStage = Math.max(state.unlockedStage, Math.min(value, stages.length));
    try {
      storageWrite(UNLOCK_KEY, String(state.unlockedStage));
    } catch {
      // Local progress is optional.
    }
  }

  function translateStaticUI() {
    document.documentElement.lang = locale();
    updatePageMetadata();
    localeSelect.value = locale();
    languageLabel.textContent = t("language");
    titleText.textContent = t("title");
    mainTitle.textContent = t("title");
    mainIntro.textContent = locale() === "zh-Hant"
      ? "把彩色食物放進相同顏色的便當盒，完成 30 個短篇關卡與六次友善守護員檢查。"
      : locale() === "es"
        ? "Clasifica alimentos de colores en 30 niveles breves y seis pruebas amistosas de guardianes."
        : locale() === "pt-BR"
          ? "Organize alimentos coloridos em 30 níveis curtos e seis desafios amigáveis dos Guardiões."
          : "Sort colorful foods through 30 short levels and six friendly Guardian checks.";
    startBtn.textContent = t("startGame");
    stageSelectTitle.textContent = t("title");
    stageTabBtn.textContent = t("levels");
    document.querySelector("#scoreLabel").textContent = t("scoreLabel");
    document.querySelector("#roundLabel").textContent = t("roundLabel");
    document.querySelector("#loadingTitle").textContent = t("loading");
    nextStageBtn.textContent = t("nextStage");
    againBtn.textContent = t("again");
    stageSelectBtn.textContent = t("levels");
    homeLink.setAttribute("aria-label", t("lobby"));
    leaveConfirmTitle.textContent = t("leaveTitle");
    leaveConfirmText.textContent = t("leaveText");
    keepSortingBtn.textContent = t("keepSorting");
    leaveLevelBtn.textContent = t("leaveLevel");
    stageHelpBtn.setAttribute("aria-label", t("helpAria"));
    battleHelpBtn.setAttribute("aria-label", t("helpAria"));
    gameHelpTitle.textContent = t("helpTitle");
    gameHelpLook.textContent = t("helpLook");
    gameHelpChoose.textContent = t("helpChoose");
    gameHelpFinish.textContent = t("helpFinish");
    gameHelpCloseBtn.textContent = t("helpClose");
    feedbackText.textContent = state.deck.length ? feedbackText.textContent : t("ready");

    if (!stageSelectPanel.classList.contains("hidden")) renderStageCards();
    if (!gameHud.classList.contains("hidden")) updateHUD();
    if (state.deck.length > 0 && state.index < state.deck.length) {
      const stage = stages[state.stageIndex];
      applyStagePresentation(stage);
      if (!state.dragging && !state.boxTransitioning) setupBoxes(stage);
      loadFood();
    }
  }

  function simulateLoading() {
    const assets = [...Object.values(foodsDB).map((food) => food.image), ...Object.values(guardians).map((guardian) => guardian.image)];
    let loaded = 0;
    function step() {
      loaded += 1;
      const percent = Math.min(100, Math.round((loaded / Math.max(assets.length, 1)) * 100));
      loadingText.textContent = `${percent}%`;
      loadingFill.style.width = `${percent}%`;
      if (loaded >= assets.length) {
        state.ready = true;
        loadUnlockedStage();
        loadingPanel.classList.add("hidden");
        window.WonderAnalytics?.track("game_ready", { game_id: GAME_ID });
        showMain();
      }
    }
    assets.forEach((src) => {
      const image = new Image();
      image.onload = step;
      image.onerror = step;
      image.src = src;
    });
  }

  function updateLunchFrame() {
    if (!document.body.classList.contains("lunch-stage") && !document.body.classList.contains("lunch-playing")) return;
    [battleBackBtn, battleHelpBtn].forEach((button) => {
      ["width", "min-width", "max-width", "height", "min-height", "max-height"].forEach((property) => {
        button.style.setProperty(property, "48px", "important");
      });
    });
  }

  function exitSharedPlayViewport() {
    window.WeightPlayGame?.exitMobileGameMode?.();
    document.body.classList.remove("weightplay-active-viewport");
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    if (document.webkitFullscreenElement) document.webkitExitFullscreen?.();
  }

  function setBattleCovered(covered) {
    [gameHud, gamePlayContent].forEach((region) => {
      region.inert = covered;
      region.setAttribute("aria-hidden", covered ? "true" : "false");
    });
  }

  function restoreNativeBattleHeader() {
    if (battleBackBtn.parentElement !== gameHud) gameHud.prepend(battleBackBtn);
    document.querySelectorAll(".wp-generated-battle-header, .wp-generated-stage-header").forEach((header) => header.remove());
  }

  let nativeHeaderRepairFrame = 0;
  const nativeHeaderObserver = new MutationObserver(() => {
    if (!document.body.matches(".lunch-playing, .lunch-stage")) return;
    const polluted = battleBackBtn.parentElement !== gameHud
      || document.querySelector(".wp-generated-battle-header, .wp-generated-stage-header");
    if (!polluted || nativeHeaderRepairFrame) return;
    nativeHeaderRepairFrame = requestAnimationFrame(() => {
      nativeHeaderRepairFrame = 0;
      restoreNativeBattleHeader();
    });
  });
  nativeHeaderObserver.observe(lunchGame, { childList: true, subtree: true });

  function setLeaveConfirmOpen(open, restoreFocus = true) {
    if (open === leaveConfirmOpen) return;
    leaveConfirmOpen = open;
    clearFoodDrag();
    leaveConfirmPanel.classList.toggle("hidden", !open);
    setBattleCovered(open);
    if (open) keepSortingBtn.focus({ preventScroll: true });
    else if (restoreFocus) battleBackBtn.focus({ preventScroll: true });
  }

  function setHelpOpen(open, returnTarget = null, restoreFocus = true) {
    if (open === helpOpen) return;
    if (open && (leaveConfirmOpen || !resultPanel.classList.contains("hidden"))) return;
    helpOpen = open;
    clearFoodDrag();
    if (open) helpReturnTarget = returnTarget;
    helpPanel.classList.toggle("hidden", !open);
    helpPanel.inert = !open;

    if (document.body.classList.contains("lunch-playing")) {
      setBattleCovered(open);
    } else if (document.body.classList.contains("lunch-stage")) {
      stageSelectPanel.inert = open;
      stageSelectPanel.setAttribute("aria-hidden", open ? "true" : "false");
    }

    if (open) {
      gameHelpCloseBtn.focus({ preventScroll: true });
    } else {
      const focusTarget = helpReturnTarget;
      helpReturnTarget = null;
      if (restoreFocus && focusTarget?.isConnected) focusTarget.focus({ preventScroll: true });
    }
  }

  let roundTransitionToken = 0;
  let roundLifecycleSuspended = document.hidden;
  let roundWindowFocused = true;

  function clearFoodDrag() {
    const pointerId = state.activePointerId;
    state.activePointerId = null;
    state.dragging = false;
    foodCard.classList.remove("dragging");
    foodCard.style.transform = "";
    if (pointerId !== null && foodCard.hasPointerCapture?.(pointerId)) {
      try { foodCard.releasePointerCapture(pointerId); } catch { /* The browser may already have released it. */ }
    }
  }

  function invalidateRoundTransition() {
    roundTransitionToken += 1;
    clearFoodDrag();
    state.boxTransitioning = false;
    dropZone.classList.remove("settling");
    foodCard.classList.remove("dragging", "pop", "shake");
    foodCard.style.transform = "";
    foodCard.style.pointerEvents = "";
    dropZone.querySelectorAll(".hit, .miss").forEach((box) => box.classList.remove("hit", "miss"));
  }

  function scheduleRoundTask(task, delay) {
    const token = roundTransitionToken;
    let elapsed = 0;
    let previous = performance.now();
    const tick = (now) => {
      if (token !== roundTransitionToken || !document.body.classList.contains("lunch-playing")) return;
      if (!leaveConfirmOpen && !helpOpen && !roundLifecycleSuspended && !document.hidden) elapsed += now - previous;
      previous = now;
      if (elapsed >= delay) task();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", updateLunchFrame);
  window.addEventListener("orientationchange", updateLunchFrame);
  visualViewport?.addEventListener("resize", updateLunchFrame, { passive: true });
  visualViewport?.addEventListener("scroll", updateLunchFrame, { passive: true });

  function syncSharedScene(scene) {
    if (scene === "battle") {
      window.dispatchEvent(new Event("weightplay:stage-sync"));
      window.dispatchEvent(new Event("weightplay:battle-sync"));
    } else {
      window.dispatchEvent(new Event("weightplay:battle-sync"));
      window.dispatchEvent(new Event("weightplay:stage-sync"));
    }
    window.dispatchEvent(new Event("weightplay:shell-sync"));
  }

  function showMain(restoreStartFocus = false) {
    setHelpOpen(false, null, false);
    setLeaveConfirmOpen(false, false);
    invalidateRoundTransition();
    restoreNativeBattleHeader();
    document.body.classList.remove("lunch-stage", "lunch-playing");
    document.body.classList.add("lunch-main");
    resultPanel.classList.add("hidden");
    mainPanel.classList.remove("hidden");
    stageSelectPanel.classList.add("hidden");
    gameHud.classList.add("hidden");
    gamePlayContent.classList.add("hidden");
    setBattleCovered(false);
    syncSharedScene("main");
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    if (restoreStartFocus) requestAnimationFrame(() => startBtn.focus({ preventScroll: true }));
  }

  function showStageSelect(focusCurrent = false) {
    setHelpOpen(false, null, false);
    setLeaveConfirmOpen(false, false);
    invalidateRoundTransition();
    restoreNativeBattleHeader();
    document.body.classList.remove("lunch-main");
    document.body.classList.remove("lunch-playing");
    document.body.classList.add("lunch-stage");
    resultPanel.classList.add("hidden");
    mainPanel.classList.add("hidden");
    gameHud.classList.add("hidden");
    gamePlayContent.classList.add("hidden");
    setBattleCovered(false);
    stageSelectPanel.classList.remove("hidden");
    exitSharedPlayViewport();
    renderStageCards();
    if (focusCurrent) requestAnimationFrame(() => requestAnimationFrame(() => {
      const unlocked = [...stageGrid.querySelectorAll(".stage-card.unlocked")];
      unlocked[Math.min(state.stageIndex, unlocked.length - 1)]?.focus({ preventScroll: true });
    }));
    updateLunchFrame();
    syncSharedScene("stage");
    requestAnimationFrame(updateLunchFrame);
  }

  let centeredStageFrame = 0;
  function updateCenteredStageCard() {
    centeredStageFrame = 0;
    if (stageGrid.dataset.wpStageVirtualizationInstalled === "true") return;
    const cards = [...stageGrid.querySelectorAll(".stage-card")];
    if (!cards.length || !document.body.classList.contains("lunch-stage")) return;
    const railRect = stageGrid.getBoundingClientRect();
    const railCenter = railRect.left + railRect.width / 2;
    let centeredCard = cards[0];
    let centeredDistance = Infinity;
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - railCenter);
      if (distance < centeredDistance) {
        centeredCard = card;
        centeredDistance = distance;
      }
    });
    cards.forEach((card) => {
      const isCentered = card === centeredCard;
      card.classList.toggle("is-centered", isCentered);
      if (isCentered) card.setAttribute("aria-current", "true");
      else card.removeAttribute("aria-current");
    });
  }

  function scheduleCenteredStageCard() {
    if (centeredStageFrame) return;
    centeredStageFrame = requestAnimationFrame(updateCenteredStageCard);
  }

  stageGrid.addEventListener("scroll", scheduleCenteredStageCard, { passive: true });
  window.addEventListener("resize", scheduleCenteredStageCard, { passive: true });
  visualViewport?.addEventListener("resize", scheduleCenteredStageCard, { passive: true });

  function renderStageCards() {
    stageStatus.textContent = "";
    stageGrid.replaceChildren(
      ...stages.map((stage, index) => {
        const isUnlocked = stage.id <= state.unlockedStage;
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.stageIndex = String(index);
        button.className = `stage-card ${isUnlocked ? "unlocked" : "locked"}`;
        button.setAttribute("aria-disabled", String(!isUnlocked));
        button.innerHTML = `
          <span>${isUnlocked ? t("play") : t("locked")}</span>
          ${stage.guardian ? `<img class="stage-guardian" src="${guardians[stage.guardian].image}" alt="" />` : ""}
          <strong>${stageName(stage)}</strong>
          <small>${stageDescription(stage)}</small>
          <em>${t("stageMeta", { foods: stage.rounds, colors: stage.colors.length })}</em>
          <div class="stage-card-colors" aria-hidden="true">
            ${stage.colors.map((color) => `<i class="${colorDB[color].className}"></i>`).join("")}
          </div>
        `;
        button.addEventListener("click", () => {
          if (isUnlocked) startStage(index);
          else rejectLockedStage(button, index);
        });
        return button;
      }),
    );
    requestAnimationFrame(() => {
      const unlocked = [...stageGrid.querySelectorAll(".stage-card.unlocked")].at(-1);
      stageGrid.scrollTop = 0;
      if (unlocked && !stageGrid.hasAttribute("data-wp-stage-rail")) {
        stageGrid.scrollLeft = Math.max(
          0,
          unlocked.offsetLeft - (stageGrid.clientWidth - unlocked.offsetWidth) / 2,
        );
      }
      requestAnimationFrame(updateCenteredStageCard);
    });
  }

  let lockedStagePointer = null;

  function rejectLockedStage(button, index) {
    stageStatus.textContent = t("lockedFeedback", { stage: stageName(stages[index]), required: index });
    requestAnimationFrame(() => button.focus({ preventScroll: true }));
  }

  function lockedStageAtPoint(x, y) {
    return [...stageGrid.querySelectorAll(".stage-card.locked")].find((card) => {
      const rect = card.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    });
  }

  stageGrid.addEventListener("pointerdown", (event) => {
    if (event.isPrimary === false || event.button !== 0) return;
    const button = lockedStageAtPoint(event.clientX, event.clientY);
    lockedStagePointer = button ? { button, id: event.pointerId, x: event.clientX, y: event.clientY, moved: false } : null;
  }, true);
  document.addEventListener("pointermove", (event) => {
    if (!lockedStagePointer || event.pointerId !== lockedStagePointer.id) return;
    lockedStagePointer.moved ||= Math.hypot(event.clientX - lockedStagePointer.x, event.clientY - lockedStagePointer.y) > 6;
  }, true);
  const finishLockedStagePointer = (event) => {
    if (!lockedStagePointer || event.pointerId !== lockedStagePointer.id) return;
    const activation = lockedStagePointer;
    lockedStagePointer = null;
    if (event.type === "pointercancel" || activation.moved) return;
    if (event.cancelable) event.preventDefault();
    rejectLockedStage(activation.button, Number(activation.button.dataset.stageIndex));
  };
  document.addEventListener("pointerup", finishLockedStagePointer, true);
  document.addEventListener("pointercancel", finishLockedStagePointer, true);

  function getStageBoxes(stage) {
    return stage.colors.map((color) => ({ color, ...colorDB[color] }));
  }

  function loadProgressRecord() {
    try {
      return JSON.parse(storageRead(PROGRESS_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveProgressRecord(stage, skillScores) {
    const existing = loadProgressRecord();
    const previousBest = Number(existing.bestScore) || 0;
    const bestScore = Math.max(previousBest, state.score);
    const improvementPercent = previousBest > 0 ? Math.round(((state.score - previousBest) / previousBest) * 100) : (state.score > 0 ? 100 : 0);
    const record = {
      lastScore: state.score,
      bestScore,
      playCount: (Number(existing.playCount) || 0) + 1,
      lastPlayedAt: new Date().toISOString(),
      improvementPercent,
      skillScores,
      stage: stage.id,
    };

    try {
      storageWrite(PROGRESS_KEY, JSON.stringify(record));
    } catch {
      // Local progress is optional and should never block play.
    }

    return { ...record, previousBest, improved: state.score > previousBest };
  }

  function starRating(value) {
    const filled = Math.max(1, Math.min(5, Math.round(value)));
    return "★".repeat(filled) + "☆".repeat(5 - filled);
  }

  function buildSkillScores() {
    const total = Math.max(state.deck.length, 1);
    const correctRatio = Math.max(0, (total - state.mistakes) / total);
    const accuracyStars = 1 + correctRatio * 4;
    const focusStars = 1 + Math.max(0, 1 - state.mistakes / Math.max(total, 3)) * 4;
    const handEyeStars = 1 + Math.max(0, state.score / (total * 12)) * 4;
    return {
      colorRecognition: Math.round(accuracyStars),
      focus: Math.round(focusStars),
      handEyeCoordination: Math.round(handEyeStars),
    };
  }

  function renderResultReport(message, progress) {
    const rows = [
      [t("colorRecognition"), progress.skillScores.colorRecognition],
      [t("focusSkill"), progress.skillScores.focus],
      [t("handEye"), progress.skillScores.handEyeCoordination],
    ];

    resultText.replaceChildren();

    const summary = document.createElement("div");
    summary.className = "result-summary";
    summary.textContent = message;
    resultText.appendChild(summary);

    const stats = document.createElement("div");
    stats.className = "result-stats";
    const statItems = [
      t("resultScore", { score: progress.lastScore }),
      t("previousBest", { score: progress.previousBest }),
      progress.improved ? t("newBest") : t("improvement", { value: progress.improvementPercent }),
    ];
    statItems.forEach((text) => {
      const item = document.createElement("span");
      item.textContent = text;
      stats.appendChild(item);
    });
    resultText.appendChild(stats);

    const report = document.createElement("section");
    report.className = "skill-report";
    const title = document.createElement("strong");
    title.textContent = t("skillReport");
    report.appendChild(title);

    rows.forEach(([label, stars]) => {
      const row = document.createElement("div");
      row.className = "skill-report-row";
      const name = document.createElement("span");
      name.textContent = label;
      const value = document.createElement("b");
      value.textContent = starRating(stars);
      row.append(name, value);
      report.appendChild(row);
    });
    resultText.appendChild(report);

    const encouragement = document.createElement("p");
    encouragement.className = "progress-message";
    encouragement.textContent = progress.improved ? t("progressMessageNew") : t("progressMessageSteady");
    resultText.appendChild(encouragement);

    const note = document.createElement("small");
    note.textContent = t("progressNote");
    resultText.appendChild(note);
  }

  function renderRewardParade() {
    rewardParade.replaceChildren(
      ...state.deck.map((food, index) => {
        const image = document.createElement("img");
        image.src = food.image;
        image.alt = "";
        image.style.setProperty("--reward-order", index);
        return image;
      }),
    );
  }

  function renderResultGuardian(stage) {
    if (!stage.guardian) {
      resultGuardian.classList.add("hidden");
      resultGuardianImage.removeAttribute("src");
      resultGuardianImage.alt = "";
      resultGuardianText.textContent = "";
      return;
    }
    const guardian = guardians[stage.guardian];
    const name = localizedGuardianName(guardian);
    resultGuardianImage.src = guardian.image;
    resultGuardianImage.alt = name;
    resultGuardianText.textContent = t("guardianCelebration", { guardian: name });
    resultGuardian.classList.remove("hidden");
  }

  function localizedGuardianName(guardian) {
    if (locale() === "zh-Hant") return guardian.nameZh;
    if (locale() === "es") return guardian.nameEs;
    if (locale() === "pt-BR") return guardian.namePt;
    return guardian.nameEn;
  }

  function applyStagePresentation(stage) {
    gamePlayContent.classList.toggle("picture-only", Boolean(stage.pictureOnly));
    if (!stage.guardian) {
      guardianBanner.classList.add("hidden");
      guardianImage.removeAttribute("src");
      guardianImage.alt = "";
      guardianName.textContent = "";
      guardianRule.textContent = "";
      return;
    }
    const guardian = guardians[stage.guardian];
    guardianBanner.classList.remove("hidden");
    guardianImage.src = guardian.image;
    guardianImage.alt = localizedGuardianName(guardian);
    guardianName.textContent = localizedGuardianName(guardian);
    guardianRule.textContent = stageDescription(stage);
  }

  function buildStageDeck(stage) {
    const pool = stage.foods.map((id) => foodsDB[id]);
    return stage.order === "alternating" ? pool.slice(0, stage.rounds) : shuffle(pool).slice(0, stage.rounds);
  }

  function shouldShuffleBoxes(stage, completedCount) {
    if (stage.shuffle === "each") return completedCount < stage.rounds;
    if (stage.shuffle === "once") return completedCount === 3;
    if (stage.shuffle === "half") return completedCount === 3;
    return false;
  }

  function settleBoxesIntoNewPlaces(done) {
    state.boxTransitioning = true;
    dropZone.classList.add("settling");
    feedbackText.textContent = t("boxesMoving");
    const currentBoxes = [...dropZone.querySelectorAll(".lunchbox")];
    const currentOrder = currentBoxes.map((box) => box.dataset.color).join("|");
    const boxes = shuffle(currentBoxes);
    if (boxes.length > 1 && boxes.map((box) => box.dataset.color).join("|") === currentOrder) boxes.push(boxes.shift());
    boxes.forEach((box) => dropZone.appendChild(box));
    scheduleRoundTask(() => {
      dropZone.classList.remove("settling");
      state.boxTransitioning = false;
      done();
    }, 360);
  }

  function setupBoxes(stage) {
    dropZone.replaceChildren(
      ...getStageBoxes(stage).map((box) => {
        const element = document.createElement("button");
        element.className = `lunchbox ${box.className}`;
        element.type = "button";
        element.dataset.color = box.color;
        element.innerHTML = `<span></span><strong>${t(box.labelKey)}</strong>`;
        element.setAttribute("aria-label", t("lunchboxChoice", { color: t(box.labelKey) }));
        element.addEventListener("click", () => {
          if (!state.boxTransitioning) submitColor(box.color, element);
        });
        return element;
      }),
    );
  }

  function startStage(stageIndex, focusChoice = false) {
    setHelpOpen(false, null, false);
    setLeaveConfirmOpen(false, false);
    invalidateRoundTransition();
    restoreNativeBattleHeader();
    document.body.classList.remove("lunch-stage");
    document.body.classList.add("lunch-playing");
    const stage = stages[stageIndex];
    state.stageIndex = stageIndex;
    state.score = 0;
    state.index = 0;
    state.mistakes = 0;

    state.deck = buildStageDeck(stage);

    stageSelectPanel.classList.add("hidden");
    resultPanel.classList.add("hidden");
    setBattleCovered(false);
    gameHud.classList.remove("hidden");
    gamePlayContent.classList.remove("hidden");
    exitSharedPlayViewport();
    updateLunchFrame();
    syncSharedScene("battle");
    feedbackText.textContent = t("ready");
    foodCard.style.pointerEvents = "";

    applyStagePresentation(stage);
    setupBoxes(stage);
    updateHUD();
    loadFood();
    if (focusChoice) dropZone.querySelector(".lunchbox")?.focus({ preventScroll: true });
    requestAnimationFrame(updateLunchFrame);
    window.WonderSound?.play("click");
    window.WonderAnalytics?.track("game_start", { game_id: GAME_ID, stage: stage.id, locale: locale() });
  }

  function updateHUD() {
    const stage = stages[state.stageIndex];
    levelIndicator.textContent = `${t("levelLabel")} ${stage.id} / ${stages.length}`;
    progressFill.style.width = `${(state.index / state.deck.length) * 100}%`;
    scoreText.textContent = String(state.score);
    roundText.textContent = `${Math.min(state.index + 1, state.deck.length)} / ${state.deck.length}`;
  }

  function setCurrentPrompt(food) {
    const prompt = t("voicePrompt", {
      food: t(food.nameKey),
      color: t(colorDB[food.color].labelKey),
    });
    feedbackText.textContent = stages[state.stageIndex].pictureOnly ? t("picturePrompt") : prompt;
    foodCard.setAttribute("aria-label", prompt);
  }

  function loadFood() {
    const food = state.deck[state.index];
    if (!food) return;
    foodImage.src = food.image;
    foodImage.alt = t(food.nameKey);
    foodName.textContent = t(food.nameKey);
    foodCard.style.transform = "";
    foodCard.classList.remove("pop", "shake");
    foodCard.style.pointerEvents = "";
    setCurrentPrompt(food);
  }

  function submitColor(color, target) {
    if (!state.ready || helpOpen || state.boxTransitioning || foodCard.style.pointerEvents === "none") return;
    const food = state.deck[state.index];

    if (color !== food.color) {
      state.mistakes += 1;
      feedbackText.textContent = stages[state.stageIndex].pictureOnly ? t("wrong") : `${t("wrong")} ${t("voicePrompt", {
        food: t(food.nameKey),
        color: t(colorDB[food.color].labelKey),
      })}`;
      window.WonderSound?.play("wrong");
      window.WonderAnalytics?.track("game_answer", {
        game_id: GAME_ID,
        result: "wrong",
        stage: stages[state.stageIndex].id,
        food: food.nameKey,
        selected_color: color,
        correct_color: food.color,
        round: state.index + 1,
      });
      foodCard.classList.remove("shake");
      foodCard.offsetWidth;
      foodCard.classList.add("shake");
      target?.classList.add("miss");
      scheduleRoundTask(() => target?.classList.remove("miss"), 260);
      return;
    }

    const bonus = Math.max(4, 12 - Math.min(state.mistakes, 6));
    state.score += bonus;
    feedbackText.textContent = t("correct");
    window.WonderSound?.play("success");
    window.WonderAnalytics?.track("game_answer", {
      game_id: GAME_ID,
      result: "correct",
      stage: stages[state.stageIndex].id,
      food: food.nameKey,
      selected_color: color,
      round: state.index + 1,
    });

    foodCard.style.pointerEvents = "none";
    target?.classList.add("hit");
    foodCard.classList.remove("pop");
    foodCard.offsetWidth;
    foodCard.classList.add("pop");

    scheduleRoundTask(() => {
      target?.classList.remove("hit");
      state.index += 1;
      if (state.index >= state.deck.length) finishStage();
      else {
        updateHUD();
        const stage = stages[state.stageIndex];
        if (shouldShuffleBoxes(stage, state.index)) settleBoxesIntoNewPlaces(loadFood);
        else loadFood();
      }
    }, 520);
    updateHUD();
  }

  function finishStage() {
    setHelpOpen(false, null, false);
    invalidateRoundTransition();
    restoreNativeBattleHeader();
    progressFill.style.width = "100%";
    const stage = stages[state.stageIndex];
    saveUnlockedStage(stage.id + 1);
    const isFinalStage = stage.id >= stages.length;
    const isPerfect = state.mistakes === 0;
    const skillScores = buildSkillScores();
    const progress = saveProgressRecord(stage, skillScores);
    resultTitle.textContent = isFinalStage ? t("allClearTitle") : t("winTitle");
    renderResultGuardian(stage);
    renderRewardParade();
    const message = isFinalStage
      ? t(isPerfect ? "perfectAllClearDesc" : "allClearDesc")
      : t(isPerfect ? "perfectDesc" : "winDesc", { score: state.score });
    renderResultReport(message, progress);
    nextStageBtn.classList.remove("hidden");
    nextStageBtn.disabled = isFinalStage;
    nextStageBtn.setAttribute("aria-disabled", String(isFinalStage));
    const primaryAction = isFinalStage ? stageSelectBtn : nextStageBtn;
    [stageSelectBtn, nextStageBtn, againBtn].forEach((action) => {
      action.classList.toggle("result-primary", action === primaryAction);
      action.classList.toggle("result-secondary", action !== primaryAction);
    });
    foodCard.style.pointerEvents = "none";
    gamePlayContent.classList.add("hidden");
    resultPanel.classList.remove("hidden");
    setBattleCovered(true);
    primaryAction.focus({ preventScroll: true });
    window.WonderSound?.play("win");
    window.WonderAnalytics?.track("game_complete", {
      game_id: GAME_ID,
      stage: stage.id,
      score: state.score,
      best_score: progress.bestScore,
      improvement_percent: progress.improvementPercent,
      total_rounds: state.deck.length,
      mistakes: state.mistakes,
      locale: locale(),
    });
  }

  function getPoint(event) {
    const point = event.touches?.[0] || event;
    return { x: point.clientX, y: point.clientY };
  }

  function startDrag(event) {
    if (!state.ready || helpOpen || state.boxTransitioning || foodCard.style.pointerEvents === "none"
      || state.activePointerId !== null || event.isPrimary === false || event.button !== 0) return;
    const point = getPoint(event);
    state.dragging = true;
    state.activePointerId = event.pointerId;
    state.startX = point.x;
    state.startY = point.y;
    foodCard.classList.add("dragging");
    try { foodCard.setPointerCapture?.(event.pointerId); } catch { /* Synthetic or already-ended pointers cannot be captured. */ }
    event.preventDefault();
  }

  function moveDrag(event) {
    if (!state.dragging || event.pointerId !== state.activePointerId) return;
    const point = getPoint(event);
    foodCard.style.transform = `translate(${point.x - state.startX}px, ${point.y - state.startY}px)`;
    event.preventDefault();
  }

  function endDrag(event) {
    if (!state.dragging || event.pointerId !== state.activePointerId) return;
    const point = getPoint(event.changedTouches?.[0] || event);
    clearFoodDrag();
    foodCard.style.pointerEvents = "none";
    const target = document.elementFromPoint(point.x, point.y)?.closest(".lunchbox");
    foodCard.style.pointerEvents = "";
    if (target) submitColor(target.dataset.color, target);
  }

  foodCard.addEventListener("pointerdown", startDrag);
  dropZone.addEventListener("keydown", (event) => {
    if (!event.repeat || !["Enter", " "].includes(event.key) || !event.target.closest(".lunchbox")) return;
    event.preventDefault();
  });
  window.addEventListener("pointermove", moveDrag);
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", (event) => {
    if (event.pointerId === state.activePointerId) clearFoodDrag();
  });
  foodCard.addEventListener("lostpointercapture", (event) => {
    if (event.pointerId === state.activePointerId) clearFoodDrag();
  });
  window.addEventListener("blur", () => {
    roundWindowFocused = false;
    roundLifecycleSuspended = true;
    clearFoodDrag();
  });
  window.addEventListener("focus", () => {
    roundWindowFocused = true;
    roundLifecycleSuspended = document.hidden;
  });
  window.addEventListener("pagehide", () => {
    roundLifecycleSuspended = true;
    clearFoodDrag();
  });
  window.addEventListener("pageshow", () => {
    roundLifecycleSuspended = document.hidden || !roundWindowFocused;
  });
  document.addEventListener("visibilitychange", () => {
    roundLifecycleSuspended = document.hidden || !roundWindowFocused;
    if (document.hidden) clearFoodDrag();
  });

  localeSelect.addEventListener("change", () => {
    window.WonderSound?.play("click");
    window.WonderI18n?.setLocale(localeSelect.value);
  });
  localeSelect.addEventListener("input", () => {
    window.WonderSound?.play("click");
    window.WonderI18n?.setLocale(localeSelect.value);
  });
  window.addEventListener("wonder:locale-change", translateStaticUI);

  const rejectRepeatedActivation = (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
  };

  startBtn.addEventListener("keydown", rejectRepeatedActivation);
  stageHelpBtn.addEventListener("keydown", rejectRepeatedActivation);
  battleHelpBtn.addEventListener("keydown", rejectRepeatedActivation);
  stageGrid.addEventListener("keydown", (event) => {
    if (event.target.closest(".stage-card")) rejectRepeatedActivation(event);
  });
  startBtn.addEventListener("click", () => {
    window.WonderSound?.play("click");
    showStageSelect(true);
  });
  stageBackBtn.addEventListener("click", () => showMain(true));
  stageHelpBtn.addEventListener("click", () => setHelpOpen(true, stageHelpBtn));
  battleHelpBtn.addEventListener("click", () => setHelpOpen(true, battleHelpBtn));
  gameHelpCloseBtn.addEventListener("click", () => setHelpOpen(false));
  helpPanel.addEventListener("keydown", (event) => {
    rejectRepeatedActivation(event);
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setHelpOpen(false);
    } else if (event.key === "Tab") {
      event.preventDefault();
      gameHelpCloseBtn.focus({ preventScroll: true });
    }
  });
  resultPanel.addEventListener("keydown", rejectRepeatedActivation, true);

  againBtn.addEventListener("click", () => {
    window.WonderAnalytics?.track("game_restart", {
      game_id: GAME_ID,
      stage: stages[state.stageIndex].id,
      locale: locale(),
    });
    startStage(state.stageIndex, true);
  });
  nextStageBtn.addEventListener("click", () => startStage(Math.min(state.stageIndex + 1, stages.length - 1), true));
  stageSelectBtn.addEventListener("click", () => {
    window.WonderSound?.play("click");
    showStageSelect(true);
  });
  battleBackBtn.addEventListener("click", () => {
    if (!resultPanel.classList.contains("hidden")) return;
    setLeaveConfirmOpen(true);
  });
  keepSortingBtn.addEventListener("click", () => setLeaveConfirmOpen(false));
  leaveLevelBtn.addEventListener("click", () => showStageSelect(true));
  leaveConfirmPanel.addEventListener("keydown", (event) => {
    rejectRepeatedActivation(event);
    if (event.key === "Escape") {
      event.preventDefault();
      setLeaveConfirmOpen(false);
      return;
    }
    if (event.key !== "Tab") return;
    if (event.shiftKey && document.activeElement === keepSortingBtn) {
      event.preventDefault();
      leaveLevelBtn.focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === leaveLevelBtn) {
      event.preventDefault();
      keepSortingBtn.focus({ preventScroll: true });
    }
  });

  homeLink.addEventListener("click", (event) => {
    if (document.body.classList.contains("lunch-main")) return;
    event.preventDefault();
    window.WonderSound?.play("click");
    showMain(true);
  });

  translateStaticUI();
  window.addEventListener("load", () => {
    requestAnimationFrame(() => requestAnimationFrame(translateStaticUI));
    setTimeout(translateStaticUI, 500);
  }, { once: true });
  simulateLoading();
})();
