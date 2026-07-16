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
  const stageGrid = document.querySelector("#stageGrid");
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
  const rewardParade = document.querySelector("#rewardParade");
  const resultText = document.querySelector("#resultText");
  const nextStageBtn = document.querySelector("#nextStageBtn");
  const againBtn = document.querySelector("#againBtn");
  const stageSelectBtn = document.querySelector("#stageSelectBtn");
  const lobbyLink = document.querySelector("#lobbyLink");
  const homeLink = document.querySelector("#homeLink");
  const battleBackBtn = document.querySelector("#battleBackBtn");
  const loadingPanel = document.querySelector("#loadingPanel");
  const loadingText = document.querySelector("#loadingText");
  const loadingFill = document.querySelector("#loadingFill");
  const GAME_ID = "color-lunchbox";
  const UNLOCK_KEY = "colorLunchboxUnlockedStage";
  const PROGRESS_KEY = "weightplay_color_lunchbox_progress";

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
      scoreLabel: "Score",
      roundLabel: "Progress",
      levelLabel: "Level",
      ready: "Drag the food to the matching lunchbox.",
      voicePrompt: "Put {food} into the {color} lunchbox.",
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
    scoreLabel: "分數",
    roundLabel: "進度",
    levelLabel: "關卡",
    ready: "把食物拖到相同顏色的便當盒。",
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

  const pageMetadata = {
    en: {
      title: "Animal Color Lunchbox - WeightPlay",
      metaTitle: "Animal Color Lunchbox - Color Matching Game",
      description: "Clear 12 gentle color matching stages in Animal Color Lunchbox, a WeightPlay game for kids and families.",
    },
    "zh-Hant": {
      title: "動物顏色便當盒 - WeightPlay",
      metaTitle: "動物顏色便當盒 - 顏色分類遊戲",
      description: "在動物顏色便當盒完成 12 個溫和的顏色配對關卡，適合孩子與親子一起在 WeightPlay 遊玩。",
    },
  };

  const guardians = Object.freeze({
    mimi: { nameEn: "Rainbow Hop Mimi", nameZh: "彩虹跳跳咪咪", image: "../../assets/weightplay-character-rainbow-hop-mimi-clean-cutout.webp" },
    orla: { nameEn: "Moon Cap Orla", nameZh: "月帽歐拉", image: "../../assets/weightplay-character-moon-cap-owl-cutout.webp" },
    nori: { nameEn: "Bubble Fin Nori", nameZh: "泡泡鰭諾里", image: "../../assets/weightplay-character-bubble-fin-otter-cutout.webp" },
    pogo: { nameEn: "Drum Belly Pogo", nameZh: "鼓肚波哥", image: "../../assets/weightplay-character-drum-belly-panda-clean-cutout.webp" },
    taro: { nameEn: "Moss Shell Taro", nameZh: "苔殼塔羅", image: "../../assets/weightplay-character-moss-shell-turtle-cutout.webp" },
    fia: { nameEn: "Spark Paw Fia", nameZh: "星爪菲亞", image: "../../assets/weightplay-character-spark-paw-fox-cutout.webp" },
  });

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

  validateStageData();

  const state = {
    stageIndex: 0,
    deck: [],
    index: 0,
    score: 0,
    mistakes: 0,
    unlockedStage: 1,
    dragging: false,
    boxTransitioning: false,
    startX: 0,
    startY: 0,
    ready: false,
  };

  function locale() {
    return window.WonderI18n?.locale() || "en";
  }

  function t(key, params = {}) {
    const table = dictionary[locale()] || dictionary.en;
    const fallback = dictionary.en;
    const raw = table[key] || fallback[key] || key;
    return Object.entries(params).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), raw);
  }

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
    return locale() === "zh-Hant" ? stage.nameZh : stage.nameEn;
  }

  function stageDescription(stage) {
    return locale() === "zh-Hant" ? stage.descZh : stage.descEn;
  }

  function loadUnlockedStage() {
    try {
      const saved = Number(localStorage.getItem(UNLOCK_KEY));
      state.unlockedStage = Number.isFinite(saved) && saved >= 1 ? Math.min(saved, stages.length) : 1;
    } catch {
      state.unlockedStage = 1;
    }
  }

  function saveUnlockedStage(value) {
    state.unlockedStage = Math.max(state.unlockedStage, Math.min(value, stages.length));
    try {
      localStorage.setItem(UNLOCK_KEY, String(state.unlockedStage));
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
      ? "把每一種彩色食物放進相同顏色的便當盒，完成全部十二個關卡。"
      : "Sort each colorful food into the matching lunchbox, then clear all twelve stages.";
    startBtn.textContent = t("chooseLevel");
    stageSelectTitle.textContent = t("chooseLevel");
    document.querySelector("#scoreLabel").textContent = t("scoreLabel");
    document.querySelector("#roundLabel").textContent = t("roundLabel");
    document.querySelector("#loadingTitle").textContent = t("loading");
    nextStageBtn.textContent = t("nextStage");
    againBtn.textContent = t("again");
    stageSelectBtn.textContent = t("levels");
    lobbyLink.textContent = t("lobby");
    homeLink.setAttribute("aria-label", t("lobby"));
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
    const viewportWidth = visualViewport?.width || innerWidth;
    const viewportHeight = visualViewport?.height || innerHeight;
    const scale = Math.min(Math.max(1, viewportWidth - 8) / 390, Math.max(1, viewportHeight - 8) / 788);
    const width = 390 * scale;
    const height = 788 * scale;
    document.documentElement.style.setProperty("--lunch-frame-scale", String(scale));
    document.documentElement.style.setProperty("--lunch-frame-left", `${(viewportWidth - width) / 2}px`);
    document.documentElement.style.setProperty("--lunch-frame-top", `${viewportHeight - height - 4}px`);
    document.documentElement.style.setProperty("--lunch-frame-width", `${width}px`);
    document.documentElement.style.setProperty("--lunch-frame-height", `${height}px`);
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

  let roundTransitionToken = 0;

  function invalidateRoundTransition() {
    roundTransitionToken += 1;
    state.dragging = false;
    state.boxTransitioning = false;
    dropZone.classList.remove("settling");
    foodCard.classList.remove("dragging", "pop", "shake");
    foodCard.style.transform = "";
    foodCard.style.pointerEvents = "";
    dropZone.querySelectorAll(".hit, .miss").forEach((box) => box.classList.remove("hit", "miss"));
  }

  function scheduleRoundTask(task, delay) {
    const token = roundTransitionToken;
    const startedAt = performance.now();
    const tick = (now) => {
      if (token !== roundTransitionToken || !document.body.classList.contains("lunch-playing")) return;
      if (now - startedAt >= delay) task();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", updateLunchFrame);
  window.addEventListener("orientationchange", updateLunchFrame);
  visualViewport?.addEventListener("resize", updateLunchFrame, { passive: true });
  visualViewport?.addEventListener("scroll", updateLunchFrame, { passive: true });

  function showMain() {
    invalidateRoundTransition();
    document.body.classList.remove("lunch-stage", "lunch-playing");
    document.body.classList.add("lunch-main");
    resultPanel.classList.add("hidden");
    mainPanel.classList.remove("hidden");
    stageSelectPanel.classList.add("hidden");
    gameHud.classList.add("hidden");
    gamePlayContent.classList.add("hidden");
    setBattleCovered(false);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  function showStageSelect(focusCurrent = false) {
    invalidateRoundTransition();
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
    requestAnimationFrame(updateLunchFrame);
  }

  function renderStageCards() {
    stageGrid.replaceChildren(
      ...stages.map((stage, index) => {
        const isUnlocked = stage.id <= state.unlockedStage;
        const button = document.createElement("button");
        button.type = "button";
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
        if (isUnlocked) button.addEventListener("click", () => {
          if (stageGrid.dataset.dragSuppressed === "1") return;
          startStage(index);
        });
        return button;
      }),
    );
    requestAnimationFrame(() => {
      const unlocked = [...stageGrid.querySelectorAll(".stage-card.unlocked")].at(-1);
      unlocked?.scrollIntoView({ block: "nearest", inline: "center", behavior: "auto" });
    });
  }

  let stageDrag = null;
  let stageSettleFrame = 0;

  function settleStageRail() {
    cancelAnimationFrame(stageSettleFrame);
    const cards = [...stageGrid.querySelectorAll(".stage-card")];
    const railCenter = stageGrid.scrollLeft + stageGrid.clientWidth / 2;
    const nearest = cards.reduce((best, card) => {
      const target = card.offsetLeft - (stageGrid.clientWidth - card.offsetWidth) / 2;
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - railCenter);
      return !best || distance < best.distance ? { target, distance } : best;
    }, null);
    if (!nearest) return;
    const start = stageGrid.scrollLeft;
    const change = nearest.target - start;
    const startedAt = performance.now();
    const duration = 220;
    stageGrid.style.scrollSnapType = "none";
    const step = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      stageGrid.scrollLeft = start + change * eased;
      if (progress < 1) {
        stageSettleFrame = requestAnimationFrame(step);
      } else {
        stageGrid.style.removeProperty("scroll-snap-type");
      }
    };
    stageSettleFrame = requestAnimationFrame(step);
  }

  stageGrid.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    cancelAnimationFrame(stageSettleFrame);
    stageGrid.style.scrollSnapType = "none";
    stageDrag = { id: event.pointerId, x: event.clientX, scrollLeft: stageGrid.scrollLeft, moved: false };
  });
  stageGrid.addEventListener("pointermove", (event) => {
    if (!stageDrag || event.pointerId !== stageDrag.id) return;
    const delta = event.clientX - stageDrag.x;
    if (!stageDrag.moved && Math.abs(delta) >= 4) {
      stageDrag.moved = true;
      stageGrid.setPointerCapture?.(event.pointerId);
    }
    if (!stageDrag.moved) return;
    event.preventDefault();
    stageGrid.scrollLeft = stageDrag.scrollLeft - delta;
  });
  function endStageDrag(event) {
    if (!stageDrag || event.pointerId !== stageDrag.id) return;
    if (stageDrag.moved) {
      stageGrid.dataset.dragSuppressed = "1";
      settleStageRail();
      window.setTimeout(() => delete stageGrid.dataset.dragSuppressed, 180);
    } else {
      stageGrid.style.removeProperty("scroll-snap-type");
    }
    if (stageGrid.hasPointerCapture?.(event.pointerId)) stageGrid.releasePointerCapture?.(event.pointerId);
    stageDrag = null;
  }
  stageGrid.addEventListener("pointerup", endStageDrag);
  stageGrid.addEventListener("pointercancel", endStageDrag);

  function getStageBoxes(stage) {
    return stage.colors.map((color) => ({ color, ...colorDB[color] }));
  }

  function loadProgressRecord() {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
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
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(record));
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
      progress.previousBest > 0 ? t("previousBest", { score: progress.previousBest }) : t("newBest"),
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

  function localizedGuardianName(guardian) {
    return locale() === "zh-Hant" ? guardian.nameZh : guardian.nameEn;
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
    guardianName.textContent = `${t("guardianCheckpoint")} · ${localizedGuardianName(guardian)}`;
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
    const boxes = shuffle([...dropZone.querySelectorAll(".lunchbox")]);
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
    invalidateRoundTransition();
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
    feedbackText.textContent = t("ready");
    foodCard.style.pointerEvents = "";

    applyStagePresentation(stage);
    setupBoxes(stage);
    updateHUD();
    loadFood();
    if (focusChoice) requestAnimationFrame(() => dropZone.querySelector(".lunchbox")?.focus({ preventScroll: true }));
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
    feedbackText.textContent = prompt;
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
    if (!state.ready || state.boxTransitioning || foodCard.style.pointerEvents === "none") return;
    const food = state.deck[state.index];

    if (color !== food.color) {
      state.mistakes += 1;
      feedbackText.textContent = `${t("wrong")} ${t("voicePrompt", {
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
    invalidateRoundTransition();
    progressFill.style.width = "100%";
    const stage = stages[state.stageIndex];
    saveUnlockedStage(stage.id + 1);
    const isFinalStage = stage.id >= stages.length;
    const isPerfect = state.mistakes === 0;
    const skillScores = buildSkillScores();
    const progress = saveProgressRecord(stage, skillScores);
    resultTitle.textContent = isFinalStage ? t("allClearTitle") : t("winTitle");
    renderRewardParade();
    const message = isFinalStage
      ? t(isPerfect ? "perfectAllClearDesc" : "allClearDesc")
      : t(isPerfect ? "perfectDesc" : "winDesc", { score: state.score });
    renderResultReport(message, progress);
    nextStageBtn.classList.toggle("hidden", isFinalStage);
    foodCard.style.pointerEvents = "none";
    gameHud.classList.add("hidden");
    gamePlayContent.classList.add("hidden");
    resultPanel.classList.remove("hidden");
    setBattleCovered(true);
    (isFinalStage ? againBtn : nextStageBtn).focus({ preventScroll: true });
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
    if (!state.ready || state.boxTransitioning || foodCard.style.pointerEvents === "none") return;
    const point = getPoint(event);
    state.dragging = true;
    state.startX = point.x;
    state.startY = point.y;
    foodCard.classList.add("dragging");
    event.preventDefault();
  }

  function moveDrag(event) {
    if (!state.dragging) return;
    const point = getPoint(event);
    foodCard.style.transform = `translate(${point.x - state.startX}px, ${point.y - state.startY}px)`;
    event.preventDefault();
  }

  function endDrag(event) {
    if (!state.dragging) return;
    const point = getPoint(event.changedTouches?.[0] || event);
    state.dragging = false;
    foodCard.classList.remove("dragging");
    foodCard.style.transform = "";
    foodCard.style.pointerEvents = "none";
    const target = document.elementFromPoint(point.x, point.y)?.closest(".lunchbox");
    foodCard.style.pointerEvents = "";
    if (target) submitColor(target.dataset.color, target);
  }

  foodCard.addEventListener("pointerdown", startDrag);
  window.addEventListener("pointermove", moveDrag);
  window.addEventListener("pointerup", endDrag);

  localeSelect.addEventListener("change", () => {
    window.WonderSound?.play("click");
    window.WonderI18n?.setLocale(localeSelect.value);
  });
  localeSelect.addEventListener("input", () => {
    window.WonderSound?.play("click");
    window.WonderI18n?.setLocale(localeSelect.value);
  });
  window.addEventListener("wonder:locale-change", translateStaticUI);

  startBtn.addEventListener("click", () => {
    window.WonderSound?.play("click");
    showStageSelect();
  });
  stageBackBtn.addEventListener("click", showMain);

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
  battleBackBtn.addEventListener("click", showStageSelect);

  homeLink.addEventListener("click", (event) => {
    if (document.body.classList.contains("lunch-main")) return;
    event.preventDefault();
    window.WonderSound?.play("click");
    showMain();
  });

  translateStaticUI();
  simulateLoading();
})();
