(() => {
  const GAME_ID = "zoo-helper-day";
  const assetVersion = "20260708-zoo-helper-day-clear-icons1";
  const localeKey = "weightPlayLocale";
  const legacyLocaleKey = "weightplayLocale";
  const unlockKey = "weightplay_zoo_helper_unlocked";
  const starKey = "weightplay_zoo_helper_stars";
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
  const STAGE_LOGICAL_WIDTH = 390;
  const STAGE_LOGICAL_HEIGHT = 844;

  const text = {
    en: {
      gameTitle: "Zoo Helper Day",
      language: "Language",
      chooseStage: "Choose Stage",
      menuHint: "Help animals finish gentle care tasks.",
      stages: "Stages",
      loading: "Loading",
      nextStage: "Next Stage",
      retry: "Try Again",
      lobby: "Lobby",
      locked: "Stage locked",
      great: "Great job!",
      perfect: "Perfect helper!",
      good: "Good helper!",
      keep: "Keep helping!",
      result: "Shift complete: {station} earned {tickets} tickets and kept visitor happiness at {mood}%.",
      skillReport: "Skill Report",
      animalKnowledge: "Animal Knowledge",
      animalValue: "{count} care needs matched",
      focus: "Focus",
      focusValue: "First try: {firstTry} · Retries: {retries}",
      coordination: "Hand-Eye Coordination",
      coordinationValue: "{count} care choices completed",
      firstFinish: "First finish · {stars} stars",
      progress: "This time: {stars} · Previous best: {previous}",
      newBest: "New best: {stars} · Previous best: {previous}",
      stage: "Stage {n}",
      stageGoal: "{station} shift / {tickets} tickets",
      task: "{station}: help {animal} with {item}.",
      categoryTask: "{station}: choose something for {animal}'s {category} need.",
      routineTask: "{station}: routine step {step}/{total} for {animal} is {item}.",
      memoryHidden: "Tap the animal to see the request again.",
      checkpoint: "Keeper Check",
      rules: {
        exact: "Care Match",
        picture: "Picture Tools",
        category: "Care Categories",
        memory: "Remember & Help",
        routine: "Two-Step Routine",
        expert: "Keeper Mix",
      },
      categories: { food: "food", drink: "drink", clean: "cleaning", play: "play" },
      tickets: "Tickets {count}",
      mood: "Happiness {count}%",
      correct: "Nice help!",
      wrong: "Try another item.",
      careItemsAria: "Care item choices",
      metaTitle: "Zoo Helper Day - WeightPlay",
      metaDescription: "Complete 30 gentle zoo shifts with picture tools, care categories, memory requests, and two-step routines in Zoo Helper Day on WeightPlay.",
      homeAria: "Back to Kids lobby",
      languageAria: "Language",
      stageBackAria: "Back",
      stageListAria: "Stage list",
      battleBackAria: "Back to stages",
      shiftAria: "Zoo shift status",
      guideAria: "Zoo Helper Day game guide",
      guideKicker: "WeightPlay Original Game Guide",
      guideTitle: "Zoo Helper Day - How to Play",
      guideIntro: "Zoo Helper Day is a gentle zoo workday game where children help different animal zones earn tickets and keep visitors happy. Each stage is framed like a small zoo shift, with simple picture-based care actions, large touch targets, and friendly feedback so young players can understand the goal without heavy reading. It is designed to feel more like running a tiny zoo than only picking a helper item.",
      guideHowTitle: "How to Play",
      guideHow1: "Choose a zoo shift from the stage list.",
      guideHow2: "Look at the animal zone, ticket goal, and happiness meter.",
      guideHow3: "Choose or drag the helper item that matches the current zoo task.",
      guideHow4: "Finish the shift to earn tickets, stars, and the next zoo moment.",
      guideStrategyTitle: "Strategy Tips",
      guideStrategy1: "Say the requested item or category aloud before touching a tool.",
      guideStrategy2: "In Picture Tools shifts, compare the object's shape and color instead of looking for a label.",
      guideStrategy3: "For a remembered request, tap the animal and look again instead of guessing.",
      guideStrategy4: "In a category shift, ask whether the picture is food, drink, cleaning, or play; there may be two good answers.",
      guideStrategy5: "Read the 1/2 or 2/2 marker in a routine so a correct tool is not used at the wrong time.",
      guideStrategy6: "Use a retry as a calm chance to compare the four pictures again.",
      guideParentTitle: "Parent Note",
      guideParentNote: "This game may help children practice animal recognition, simple care concepts, focus, and hand-eye coordination through picture-first play. It works best as a short guided moment where parents can describe the animal and the care action out loud. Progress and stars are only for encouragement and local play tracking, not for diagnosis, ranking, or formal learning assessment.",
      guideFaqTitle: "Frequently Asked Questions",
      guideFaqQ1: "Can a 3-year-old play?",
      guideFaqA1: "Yes. The game is designed for picture-based preschool play with large buttons, though parent help can make it easier and more meaningful.",
      guideFaqQ2: "What does it practice?",
      guideFaqA2: "It can practice animal recognition, focus, hand-eye coordination, and simple care ideas such as food, water, cleaning, and play.",
      guideFaqQ3: "Does it require reading?",
      guideFaqA3: "No. The core choices are visual, so young children can play by looking at the animal and item pictures.",
      guideFaqQ4: "Does it collect child data?",
      guideFaqA4: "No personal child data is needed to play.",
      items: {
        fruit: "Fruit",
        water: "Water",
        brush: "Brush",
        toy: "Toy",
        leaf: "Leaves",
        shower: "Shower",
        fish: "Fish",
        ball: "Ball",
      },
      animals: {
        lion: "Lion",
        panda: "Panda",
        elephant: "Elephant",
        penguin: "Penguin",
        giraffe: "Giraffe",
        monkey: "Monkey",
        koala: "Koala",
        zebra: "Zebra",
      },
      stations: {
        savanna: "Savanna Feeding",
        bamboo: "Bamboo Grove",
        bath: "Elephant Bath",
        ice: "Penguin Pool",
        lookout: "Giraffe Lookout",
        nursery: "Koala Nursery",
      },
    },
    "zh-Hant": {
      gameTitle: "動物園幫忙日",
      language: "語言",
      chooseStage: "選擇關卡",
      menuHint: "幫動物完成溫柔的照顧任務。",
      stages: "關卡",
      loading: "載入中",
      nextStage: "下一關",
      retry: "再試一次",
      lobby: "大廳",
      locked: "關卡尚未解鎖",
      great: "做得很好！",
      perfect: "完美小幫手！",
      good: "很棒的小幫手！",
      keep: "繼續幫忙！",
      result: "工作日完成：{station} 賺到 {tickets} 張票，遊客開心度保持 {mood}%。",
      skillReport: "技能報告",
      animalKnowledge: "動物知識",
      animalValue: "配對 {count} 個照顧需求",
      focus: "專注",
      focusValue: "一次成功 {firstTry} 次 · 重試 {retries} 次",
      coordination: "手眼協調",
      coordinationValue: "完成 {count} 次照顧選擇",
      firstFinish: "第一次完成 · {stars} 顆星",
      progress: "這次 {stars} 顆星 · 之前最佳 {previous} 顆星",
      newBest: "新的最佳：{stars} 顆星 · 之前最佳 {previous} 顆星",
      stage: "第 {n} 關",
      stageGoal: "{station} 班次 / {tickets} 張票",
      task: "{station}：幫 {animal} 準備{item}。",
      categoryTask: "{station}：選一個能照顧 {animal}「{category}」需求的道具。",
      routineTask: "{station}：{animal} 的照顧步驟 {step}/{total} 是{item}。",
      memoryHidden: "點一下動物，就能再看一次需求。",
      checkpoint: "保育員檢核",
      rules: {
        exact: "照顧配對",
        picture: "圖片道具",
        category: "照顧分類",
        memory: "記住需求",
        routine: "兩步驟照顧",
        expert: "保育員綜合",
      },
      categories: { food: "食物", drink: "飲水", clean: "清潔", play: "玩耍" },
      tickets: "票券 {count}",
      mood: "開心度 {count}%",
      correct: "幫得真好！",
      wrong: "試試看其他道具。",
      careItemsAria: "照顧道具選項",
      metaTitle: "動物園幫忙日 - WeightPlay",
      metaDescription: "在《動物園幫忙日》完成 30 個溫和班次，練習圖片道具、照顧分類、記住需求與兩步驟照顧。",
      homeAria: "返回兒童遊戲大廳",
      languageAria: "語言",
      stageBackAria: "返回主畫面",
      stageListAria: "關卡列表",
      battleBackAria: "返回關卡",
      shiftAria: "動物園班次狀態",
      guideAria: "動物園幫忙日遊戲指南",
      guideKicker: "WeightPlay 原創遊戲指南",
      guideTitle: "動物園幫忙日－玩法說明",
      guideIntro: "《動物園幫忙日》是一款溫和的動物園工作遊戲。孩子會幫不同動物區完成照顧任務、累積票券並讓遊客保持開心。每關都像一個小班次，透過圖像、大型觸控按鈕與友善回饋，讓幼兒不必閱讀大量文字也能理解目標。",
      guideHowTitle: "遊戲方法",
      guideHow1: "從關卡列表選擇一個動物園班次。",
      guideHow2: "看看動物區、票券目標與開心度。",
      guideHow3: "點選或拖曳符合目前照顧任務的道具。",
      guideHow4: "完成班次，獲得票券、星星並解鎖下一段動物園時光。",
      guideStrategyTitle: "小技巧",
      guideStrategy1: "碰道具前，先說出任務要求的物品或類別。",
      guideStrategy2: "在圖片道具班次，觀察物品的形狀和顏色，不必尋找文字標籤。",
      guideStrategy3: "忘記要求時，點一下動物再看一次，不用猜答案。",
      guideStrategy4: "遇到分類任務時，想想圖片屬於食物、飲料、清潔或玩耍；有時會有兩個好答案。",
      guideStrategy5: "依照例行任務的 1/2 或 2/2 標記，按正確順序使用照顧道具。",
      guideStrategy6: "重試時放慢速度，再比較一次四張圖片。",
      guideParentTitle: "給家長的話",
      guideParentNote: "本遊戲可透過圖像優先的玩法，陪孩子練習辨認動物、簡單照顧概念、專注與手眼協調。家長可以在短時間陪玩時說出動物和照顧動作。進度與星星只用於鼓勵和本機遊玩紀錄，不是診斷、排名或正式學習評量。",
      guideFaqTitle: "常見問題",
      guideFaqQ1: "3 歲孩子可以玩嗎？",
      guideFaqA1: "可以。遊戲以圖片和大型按鈕為主；家長陪玩能讓體驗更容易也更有意義。",
      guideFaqQ2: "遊戲會練習什麼？",
      guideFaqA2: "可練習辨認動物、專注、手眼協調，以及食物、飲水、清潔和玩耍等簡單照顧概念。",
      guideFaqQ3: "需要會閱讀嗎？",
      guideFaqA3: "不需要。核心選擇都以圖片呈現，孩子可以觀察動物和道具圖片來遊玩。",
      guideFaqQ4: "遊戲會收集兒童資料嗎？",
      guideFaqA4: "不會。遊玩不需要提供任何兒童個人資料。",
      items: {
        fruit: "水果",
        water: "水",
        brush: "刷子",
        toy: "玩具",
        leaf: "葉子",
        shower: "沖澡",
        fish: "魚",
        ball: "球",
      },
      animals: {
        lion: "獅子",
        panda: "貓熊",
        elephant: "大象",
        penguin: "企鵝",
        giraffe: "長頸鹿",
        monkey: "猴子",
        koala: "無尾熊",
        zebra: "斑馬",
      },
      stations: {
        savanna: "草原餵食區",
        bamboo: "竹林休息區",
        bath: "大象沖澡區",
        ice: "企鵝水池",
        lookout: "長頸鹿觀景台",
        nursery: "無尾熊育幼區",
      },
    },
    es: {
      gameTitle: "Un Día como Ayudante del Zoo", language: "Idioma", chooseStage: "Elegir nivel", menuHint: "Ayuda a los animales con tareas tranquilas de cuidado.", stages: "Niveles", loading: "Cargando", nextStage: "Siguiente nivel", retry: "Intentar de nuevo", lobby: "Sala de juegos", locked: "Nivel bloqueado",
      great: "¡Gran trabajo!", perfect: "¡Ayudante perfecto!", good: "¡Buen ayudante!", keep: "¡Sigue ayudando!", result: "Turno completado: {station} ganó {tickets} entradas y mantuvo la felicidad de los visitantes en {mood}%.",
      skillReport: "Informe de habilidades", animalKnowledge: "Conocimiento animal", animalValue: "{count} necesidades de cuidado relacionadas", focus: "Concentración", focusValue: "A la primera: {firstTry} · Reintentos: {retries}", coordination: "Coordinación visual", coordinationValue: "{count} elecciones de cuidado completadas",
      firstFinish: "Primera victoria · {stars} estrellas", progress: "Esta vez: {stars} · Mejor anterior: {previous}", newBest: "Nuevo récord: {stars} · Mejor anterior: {previous}", stage: "Nivel {n}", stageGoal: "Turno de {station} / {tickets} entradas",
      task: "{station}: ayuda a {animal} con {item}.", categoryTask: "{station}: elige algo para la necesidad de {category} de {animal}.", routineTask: "{station}: el paso {step}/{total} de la rutina de {animal} es {item}.", memoryHidden: "Toca el animal para volver a ver la petición.", checkpoint: "Prueba del cuidador",
      rules: { exact: "Pareja de cuidado", picture: "Herramientas con imágenes", category: "Categorías de cuidado", memory: "Recuerda y ayuda", routine: "Rutina de dos pasos", expert: "Mezcla del cuidador" },
      categories: { food: "comida", drink: "bebida", clean: "limpieza", play: "juego" }, tickets: "Entradas {count}", mood: "Felicidad {count}%", correct: "¡Buena ayuda!", wrong: "Prueba otro objeto.", careItemsAria: "Opciones de objetos de cuidado",
      metaTitle: "Un Día como Ayudante del Zoo - WeightPlay", metaDescription: "Completa 30 turnos tranquilos de zoo con herramientas visuales, categorías de cuidado, peticiones de memoria y rutinas de dos pasos.",
      homeAria: "Volver a la sala Kids", languageAria: "Idioma", stageBackAria: "Volver", stageListAria: "Lista de niveles", battleBackAria: "Volver a los niveles", shiftAria: "Estado del turno del zoo",
      guideAria: "Guía de Un Día como Ayudante del Zoo", guideKicker: "Guía de juego original de WeightPlay", guideTitle: "Un Día como Ayudante del Zoo - Cómo jugar",
      guideIntro: "Un Día como Ayudante del Zoo es un juego tranquilo de trabajo en el zoo. Los niños ayudan a distintas zonas de animales a ganar entradas y mantener felices a los visitantes. Cada nivel es un turno pequeño con acciones visuales, objetivos táctiles grandes y comentarios amables, para entender la meta sin leer demasiado.",
      guideHowTitle: "Cómo jugar", guideHow1: "Elige un turno del zoo en la lista de niveles.", guideHow2: "Observa la zona animal, el objetivo de entradas y el medidor de felicidad.", guideHow3: "Toca o arrastra el objeto que corresponde a la tarea actual.", guideHow4: "Completa el turno para ganar entradas, estrellas y el siguiente momento del zoo.",
      guideStrategyTitle: "Consejos", guideStrategy1: "Di en voz alta el objeto o la categoría antes de tocar una herramienta.", guideStrategy2: "En los turnos con imágenes, compara la forma y el color en lugar de buscar una etiqueta.", guideStrategy3: "Si olvidas la petición, toca el animal para verla de nuevo en vez de adivinar.",
      guideStrategy4: "En una tarea de categoría, decide si la imagen es comida, bebida, limpieza o juego; puede haber dos respuestas válidas.", guideStrategy5: "Mira la marca 1/2 o 2/2 para usar cada objeto en el momento correcto.", guideStrategy6: "Usa el reintento para comparar con calma las cuatro imágenes.",
      guideParentTitle: "Nota para familias", guideParentNote: "Este juego puede ayudar a practicar el reconocimiento de animales, ideas sencillas de cuidado, atención y coordinación mediante imágenes. Funciona bien en sesiones cortas acompañadas. El progreso y las estrellas son solo estímulos y registros locales, no una evaluación formal.",
      guideFaqTitle: "Preguntas frecuentes", guideFaqQ1: "¿Puede jugar un niño de 3 años?", guideFaqA1: "Sí. Usa imágenes y botones grandes; la compañía de un adulto puede facilitar y enriquecer la experiencia.", guideFaqQ2: "¿Qué permite practicar?", guideFaqA2: "Reconocimiento animal, atención, coordinación e ideas sencillas como comida, agua, limpieza y juego.",
      guideFaqQ3: "¿Hace falta saber leer?", guideFaqA3: "No. Las decisiones principales son visuales y se pueden tomar observando al animal y los objetos.", guideFaqQ4: "¿Recoge datos infantiles?", guideFaqA4: "No se necesita ningún dato personal infantil para jugar.",
      items: { fruit: "Fruta", water: "Agua", brush: "Cepillo", toy: "Juguete", leaf: "Hojas", shower: "Ducha", fish: "Pescado", ball: "Pelota" },
      animals: { lion: "León", panda: "Panda", elephant: "Elefante", penguin: "Pingüino", giraffe: "Jirafa", monkey: "Mono", koala: "Koala", zebra: "Cebra" },
      stations: { savanna: "Alimentación en la sabana", bamboo: "Bosque de bambú", bath: "Baño del elefante", ice: "Piscina de pingüinos", lookout: "Mirador de jirafas", nursery: "Guardería de koalas" },
    },
  };

  Object.assign(text.en, { leaveTitle:"Leave this shift?", leaveText:"Your care progress in this shift will reset.", keepHelping:"Keep helping", leaveShift:"Leave shift" });
  Object.assign(text["zh-Hant"], { leaveTitle:"\u8981\u96e2\u958b\u9019\u6b21\u73ed\u6b21\u55ce\uff1f", leaveText:"\u9019\u6b21\u73ed\u6b21\u7684\u7167\u8b77\u9032\u5ea6\u6703\u91cd\u65b0\u958b\u59cb\u3002", keepHelping:"\u7e7c\u7e8c\u5e6b\u5fd9", leaveShift:"\u96e2\u958b\u73ed\u6b21" });
  Object.assign(text.es, { leaveTitle:"¿Salir de este turno?", leaveText:"Se reiniciará el progreso de cuidado de este turno.", keepHelping:"Seguir ayudando", leaveShift:"Salir del turno" });
  text.ko = Object.assign(Object.create(text.en), {
    chooseStage: "스테이지 선택",
    locked: "잠긴 스테이지",
    stage: "스테이지 {n}",
    stageGoal: "{station} 근무 · 티켓 {tickets}장",
    checkpoint: "사육사 점검",
    stageBackAria: "뒤로",
    stageListAria: "스테이지 목록",
    rules: {
      exact: "돌봄 짝 맞추기",
      picture: "그림 도구",
      category: "돌봄 분류",
      memory: "기억하고 돕기",
      routine: "두 단계 돌봄",
      expert: "사육사 종합 도전",
    },
    stations: {
      savanna: "사바나 먹이주기",
      bamboo: "대나무 숲",
      bath: "코끼리 목욕장",
      ice: "펭귄 풀",
      lookout: "기린 전망대",
      nursery: "코알라 돌봄방",
    },
  });

  const itemIcons = {
    fruit: "../../assets/zoo-helper-day-fruit-apple.svg",
    water: "../../assets/zoo-helper-day-water-drop.svg",
    brush: "../../assets/zoo-helper-day-care-brush.svg",
    toy: "../../assets/zoo-helper-day-toy-block.svg",
    leaf: "../../assets/zoo-helper-day-leaf-bunch.svg",
    shower: "../../assets/zoo-helper-day-shower-head.svg",
    fish: "../../assets/zoo-helper-day-fish-treat.svg",
    ball: "../../assets/zoo-helper-day-play-ball.svg",
  };

  function iconSrc(item) {
    return `${itemIcons[item]}?v=${assetVersion}`;
  }

  function itemMeta(item) {
    return {
      id: item,
      label: t(`items.${item}`),
      icon: iconSrc(item),
    };
  }

  const animalAssets = {
    lion: "../../assets/weightplay-boom-mane-lion.png",
    panda: "../../assets/animal-zoo-panda.png",
    elephant: "../../assets/animal-zoo-elephant.png",
    penguin: "../../assets/animal-zoo-penguin.png",
    giraffe: "../../assets/animal-zoo-idle-giraffe.png",
    koala: "../../assets/tiny-weather-animal-koala.png",
  };

  const categoryTask = (need, items) => ({ need, items });
  const routineStep = (item, step, total = 2) => ({ item, step, total });
  const makeStage = (animal, station, tickets, tasks, pool, options = {}) => ({ animal, station, tickets, tasks, pool, rule: "exact", ...options });
  const stages = [
    makeStage("lion", "savanna", 45, ["fruit", "water", "brush", "toy"], ["fruit", "water", "brush", "toy", "leaf"]),
    makeStage("panda", "bamboo", 58, ["leaf", "water", "brush", "ball"], ["leaf", "water", "brush", "ball", "fish"]),
    makeStage("elephant", "bath", 72, ["shower", "fruit", "water", "toy", "brush"], ["shower", "fruit", "water", "toy", "brush"]),
    makeStage("penguin", "ice", 86, ["fish", "water", "ball", "brush", "fruit"], ["fish", "water", "ball", "brush", "fruit"]),
    makeStage("giraffe", "lookout", 98, ["leaf", "water", "fruit", "brush", "toy"], ["leaf", "water", "fruit", "brush", "toy"], { checkpoint: true }),

    makeStage("koala", "nursery", 106, ["leaf", "water", "brush", "toy"], ["leaf", "water", "brush", "toy", "fruit"], { rule: "picture", pictureOnly: true }),
    makeStage("lion", "savanna", 112, ["water", "toy", "fruit", "brush"], ["water", "toy", "fruit", "brush", "ball"], { rule: "picture", pictureOnly: true }),
    makeStage("panda", "bamboo", 118, ["brush", "leaf", "ball", "water"], ["brush", "leaf", "ball", "water", "shower"], { rule: "picture", pictureOnly: true }),
    makeStage("elephant", "bath", 124, ["fruit", "shower", "toy", "water", "brush"], ["fruit", "shower", "toy", "water", "brush"], { rule: "picture", pictureOnly: true }),
    makeStage("penguin", "ice", 130, ["ball", "fish", "brush", "water", "toy"], ["ball", "fish", "brush", "water", "toy"], { rule: "picture", pictureOnly: true, checkpoint: true }),

    makeStage("giraffe", "lookout", 136, [categoryTask("food", ["leaf", "fruit"]), categoryTask("drink", ["water"]), categoryTask("clean", ["brush", "shower"]), categoryTask("play", ["toy", "ball"])], ["leaf", "fruit", "water", "brush", "toy", "ball"], { rule: "category" }),
    makeStage("koala", "nursery", 142, [categoryTask("food", ["leaf", "fruit"]), categoryTask("clean", ["brush"]), categoryTask("drink", ["water"]), categoryTask("play", ["toy", "ball"])], ["leaf", "fruit", "brush", "water", "toy", "ball"], { rule: "category" }),
    makeStage("lion", "savanna", 148, [categoryTask("play", ["toy", "ball"]), categoryTask("food", ["fruit"]), categoryTask("clean", ["brush", "shower"]), categoryTask("drink", ["water"])], ["toy", "ball", "fruit", "brush", "shower", "water"], { rule: "category" }),
    makeStage("panda", "bamboo", 154, [categoryTask("clean", ["brush", "shower"]), categoryTask("food", ["leaf", "fruit"]), categoryTask("play", ["ball", "toy"]), categoryTask("drink", ["water"])], ["brush", "shower", "leaf", "fruit", "ball", "water"], { rule: "category" }),
    makeStage("elephant", "bath", 160, [categoryTask("drink", ["water"]), categoryTask("clean", ["shower", "brush"]), categoryTask("food", ["fruit", "leaf"]), categoryTask("play", ["toy", "ball"]), categoryTask("clean", ["shower", "brush"])], ["water", "shower", "brush", "fruit", "leaf", "toy", "ball"], { rule: "category", checkpoint: true }),

    makeStage("penguin", "ice", 166, ["fish", "water", "ball", "brush"], ["fish", "water", "ball", "brush", "fruit"], { rule: "memory", memory: true }),
    makeStage("giraffe", "lookout", 172, ["leaf", "brush", "water", "toy"], ["leaf", "brush", "water", "toy", "fish"], { rule: "memory", memory: true }),
    makeStage("koala", "nursery", 178, ["water", "leaf", "toy", "brush"], ["water", "leaf", "toy", "brush", "ball"], { rule: "memory", memory: true }),
    makeStage("lion", "savanna", 184, ["toy", "fruit", "brush", "water", "ball"], ["toy", "fruit", "brush", "water", "ball"], { rule: "memory", memory: true }),
    makeStage("panda", "bamboo", 190, ["leaf", "ball", "water", "brush", "fruit"], ["leaf", "ball", "water", "brush", "fruit"], { rule: "memory", memory: true, checkpoint: true }),

    makeStage("elephant", "bath", 196, [routineStep("shower", 1), routineStep("brush", 2), routineStep("water", 1), routineStep("fruit", 2)], ["shower", "brush", "water", "fruit", "toy"], { rule: "routine" }),
    makeStage("penguin", "ice", 202, [routineStep("fish", 1), routineStep("water", 2), routineStep("ball", 1), routineStep("brush", 2)], ["fish", "water", "ball", "brush", "fruit"], { rule: "routine" }),
    makeStage("giraffe", "lookout", 208, [routineStep("leaf", 1), routineStep("water", 2), routineStep("brush", 1), routineStep("toy", 2)], ["leaf", "water", "brush", "toy", "ball"], { rule: "routine" }),
    makeStage("koala", "nursery", 214, [routineStep("leaf", 1), routineStep("brush", 2), routineStep("water", 1), routineStep("toy", 2)], ["leaf", "brush", "water", "toy", "fruit"], { rule: "routine" }),
    makeStage("lion", "savanna", 220, [routineStep("fruit", 1), routineStep("water", 2), routineStep("brush", 1), routineStep("ball", 2), routineStep("toy", 1), routineStep("water", 2)], ["fruit", "water", "brush", "ball", "toy"], { rule: "routine", checkpoint: true }),

    makeStage("panda", "bamboo", 226, [categoryTask("food", ["leaf", "fruit"]), categoryTask("clean", ["brush", "shower"]), categoryTask("play", ["ball", "toy"]), categoryTask("drink", ["water"])], ["leaf", "fruit", "brush", "shower", "ball", "water"], { rule: "expert", pictureOnly: true }),
    makeStage("elephant", "bath", 232, [categoryTask("clean", ["shower", "brush"]), categoryTask("drink", ["water"]), categoryTask("food", ["fruit", "leaf"]), categoryTask("play", ["toy", "ball"])], ["shower", "brush", "water", "fruit", "leaf", "toy"], { rule: "expert", memory: true }),
    makeStage("penguin", "ice", 238, [routineStep("fish", 1), routineStep("water", 2), routineStep("brush", 1), routineStep("ball", 2)], ["fish", "water", "brush", "ball", "fruit"], { rule: "expert", pictureOnly: true }),
    makeStage("giraffe", "lookout", 244, [routineStep("leaf", 1), routineStep("water", 2), routineStep("brush", 1), routineStep("toy", 2), routineStep("fruit", 1), routineStep("water", 2)], ["leaf", "water", "brush", "toy", "fruit"], { rule: "expert", memory: true }),
    makeStage("koala", "nursery", 250, [categoryTask("food", ["leaf", "fruit"]), categoryTask("drink", ["water"]), categoryTask("clean", ["brush", "shower"]), categoryTask("play", ["toy", "ball"]), categoryTask("food", ["leaf", "fruit"]), categoryTask("clean", ["brush", "shower"])], ["leaf", "fruit", "water", "brush", "shower", "toy", "ball"], { rule: "expert", pictureOnly: true, memory: true, checkpoint: true }),
  ];

  const $ = (id) => document.getElementById(id);
  const nodes = {
    localeSelect: $("localeSelect"),
    menuPanel: $("menuPanel"),
    stagePanel: $("stagePanel"),
    startGameBtn: $("startGameBtn"),
    stageBackBtn: $("stageBackBtn"),
    stageGrid: $("stageGrid"),
    playPanel: $("playPanel"),
    backToStagesBtn: $("backToStagesBtn"),
    stageText: $("stageText"),
    stationText: $("stationText"),
    ticketText: $("ticketText"),
    moodText: $("moodText"),
    progressFill: $("progressFill"),
    animalCard: $("animalCard"),
    animalEmoji: $("animalEmoji"),
    animalName: $("animalName"),
    requestLine: $("requestLine"),
    requestIcon: $("requestIcon"),
    requestText: $("requestText"),
    itemGrid: $("itemGrid"),
    feedbackText: $("feedbackText"),
    resultPanel: $("resultPanel"),
    resultTitle: $("resultTitle"),
    starText: $("starText"),
    resultText: $("resultText"),
    skillReportTitle: $("skillReportTitle"),
    animalKnowledgeLabel: $("animalKnowledgeLabel"),
    animalKnowledgeValue: $("animalKnowledgeValue"),
    focusLabel: $("focusLabel"),
    focusValue: $("focusValue"),
    coordinationLabel: $("coordinationLabel"),
    coordinationValue: $("coordinationValue"),
    progressComparison: $("progressComparison"),
    nextStageBtn: $("nextStageBtn"),
    retryBtn: $("retryBtn"),
    resultStagesBtn: $("resultStagesBtn"),
    loadingPanel: $("loadingPanel"),
    loadingText: $("loadingText"),
    loadingFill: $("loadingFill"),
    gameShell: document.querySelector(".zoo-game"),
  };
  nodes.resultPanel?.querySelector("[data-ui='lobby']")?.remove();
  const leavePanel = document.createElement("section");
  leavePanel.className = "zoo-leave-panel hidden";
  leavePanel.setAttribute("role", "dialog");
  leavePanel.setAttribute("aria-modal", "true");
  leavePanel.setAttribute("aria-labelledby", "zooLeaveTitle");
  leavePanel.innerHTML = `<div class="zoo-leave-card"><h2 id="zooLeaveTitle"></h2><p id="zooLeaveText"></p><div><button id="keepHelpingBtn" type="button"></button><button id="leaveShiftBtn" type="button"></button></div></div>`;
  nodes.playPanel.insertAdjacentElement("afterend", leavePanel);
  nodes.leaveTitle = leavePanel.querySelector("#zooLeaveTitle");
  nodes.leaveText = leavePanel.querySelector("#zooLeaveText");
  nodes.keepHelpingBtn = leavePanel.querySelector("#keepHelpingBtn");
  nodes.leaveShiftBtn = leavePanel.querySelector("#leaveShiftBtn");

  const legacySavedLocale = storageRead(legacyLocaleKey);
  const canonicalSavedLocale = storageRead(localeKey);
  if (!canonicalSavedLocale && ["en", "zh-Hant", "zh-Hans", "es"].includes(legacySavedLocale)) {
    storageWrite(localeKey, legacySavedLocale);
    window.WonderI18n?.setLocale?.(legacySavedLocale);
  }
  let locale = window.WonderI18n?.locale?.() || canonicalSavedLocale || legacySavedLocale || "en";
  let unlocked = clamp(Number(storageRead(unlockKey)) || 1, 1, stages.length);
  let stars = readStars();
  let currentStage = 0;
  let currentTask = 0;
  let mistakes = 0;
  let firstTryTasks = 0;
  let currentTaskMistakes = 0;
  let lastResult = null;
  let acceptingInput = false;
  let careTransitionFrame = 0;
  let careTransitionToken = 0;
  let wrongFeedbackTimer = 0;
  let itemPointerDrag = null;
  let suppressItemClick = null;
  let memoryFrame = 0;
  let memoryToken = 0;
  let leaveConfirmOpen = false;

  function cancelMemoryCue() {
    memoryToken += 1;
    if (memoryFrame) cancelAnimationFrame(memoryFrame);
    memoryFrame = 0;
    nodes.requestText.classList.remove("memory-hidden");
    nodes.requestIcon.classList.remove("memory-hidden");
  }

  function scheduleMemoryCue() {
    cancelMemoryCue();
    const stage = stages[currentStage];
    if (!stage?.memory) return;
    const token = ++memoryToken;
    let elapsed = 0;
    let previous = null;
    const step = (now) => {
      if (token !== memoryToken || nodes.playPanel.classList.contains("hidden")) return;
      if (previous !== null && !document.hidden && !leaveConfirmOpen) elapsed += Math.min(48, now - previous);
      previous = now;
      if (elapsed < 1500) {
        memoryFrame = requestAnimationFrame(step);
        return;
      }
      memoryFrame = 0;
      nodes.requestText.textContent = t("memoryHidden");
      nodes.requestText.classList.add("memory-hidden");
      nodes.requestIcon.classList.add("memory-hidden");
    };
    memoryFrame = requestAnimationFrame(step);
  }

  function taskInfo(stage, task) {
    if (typeof task === "string") return { primary: task, accepted: [task], kind: "exact", value: task };
    if (task?.need) {
      const accepted = task.items.filter((item) => stage.pool.includes(item));
      return { primary: accepted[0], accepted, kind: "category", value: task.need };
    }
    return { primary: task.item, accepted: [task.item], kind: "routine", value: task.item, step: task.step, total: task.total };
  }

  function cancelCareTransition(restoreTask = false) {
    cancelMemoryCue();
    careTransitionToken += 1;
    if (careTransitionFrame) cancelAnimationFrame(careTransitionFrame);
    careTransitionFrame = 0;
    if (!restoreTask || nodes.playPanel.classList.contains("hidden") || !nodes.resultPanel.classList.contains("hidden")) return;
    acceptingInput = true;
    renderTask();
  }

  function scheduleCareTransition(callback) {
    const token = ++careTransitionToken;
    let elapsed = 0;
    let previous = null;
    const advance = (now) => {
      if (token !== careTransitionToken) return;
      if (previous !== null && !document.hidden && !leaveConfirmOpen) elapsed += Math.min(48, now - previous);
      previous = now;
      if (elapsed < 520) {
        careTransitionFrame = requestAnimationFrame(advance);
        return;
      }
      careTransitionFrame = 0;
      callback();
    };
    careTransitionFrame = requestAnimationFrame(advance);
  }

  function updateBattleViewport() {
    if (!document.body.classList.contains("zoo-helper-playing")) return;
    // The shared Battle controller owns the single responsive envelope. Keeping
    // this legacy viewport fitter active makes both controllers rewrite the
    // shell on resize and can snap a landscape Result back to a centred frame.
    if (document.querySelector('script[src*="battle-canvas-standard.js"]')) return;
    const viewport = window.visualViewport;
    const width = Math.round(Math.min(viewport?.width || window.innerWidth, window.innerWidth));
    const height = Math.max(0, Math.round(Math.min(viewport?.height || window.innerHeight, window.innerHeight)));
    document.documentElement.classList.remove("wp-mobile-game-mode");
    document.body.classList.remove("wp-mobile-game-mode");
    nodes.gameShell?.classList.remove("weightplay-active-viewport");
    document.documentElement.style.setProperty("--zoo-live-width", `${width}px`);
    document.documentElement.style.setProperty("--zoo-live-height", `${height}px`);
    nodes.gameShell?.style.setProperty("position", "fixed", "important");
    nodes.gameShell?.style.setProperty("inset", "0 auto auto 50%", "important");
    nodes.gameShell?.style.setProperty("width", `${width}px`, "important");
    nodes.gameShell?.style.setProperty("max-width", "none", "important");
    nodes.gameShell?.style.setProperty("height", `${height}px`, "important");
    nodes.gameShell?.style.setProperty("min-height", "0", "important");
    nodes.gameShell?.style.setProperty("max-height", `${height}px`, "important");
    nodes.gameShell?.style.setProperty("transform", "translateX(-50%)", "important");
  }

  function clearBattleShellStyles() {
    for (const property of ["position", "inset", "width", "max-width", "height", "min-height", "max-height", "transform"]) {
      nodes.gameShell?.style.removeProperty(property);
    }
  }

  function restoreStageShell() {
    if (!document.body.classList.contains("wp-standard-stage-page") || document.body.classList.contains("zoo-helper-playing")) return;
    clearBattleShellStyles();
    nodes.gameShell?.style.setProperty("transform", "none", "important");
  }

  function setBattleViewport(active) {
    document.body.classList.toggle("zoo-helper-playing", active);
    if (active) {
      nodes.gameShell?.removeAttribute("data-play-viewport");
      window.WeightPlayGame?.exitMobileGameMode?.();
      updateBattleViewport();
      requestAnimationFrame(updateBattleViewport);
      setTimeout(updateBattleViewport, 160);
    } else {
      nodes.gameShell?.setAttribute("data-play-viewport", "");
      window.WeightPlayGame?.exitMobileGameMode?.();
      clearBattleShellStyles();
    }
  }

  function updateStageViewport() {
    if (!document.body.classList.contains("wp-standard-stage-page")) return;
    const viewport = window.visualViewport;
    const width = Math.max(1, Math.min(viewport?.width || window.innerWidth, window.innerWidth));
    const height = Math.max(1, Math.min(viewport?.height || window.innerHeight, window.innerHeight));
    const scale = Math.max(0.01, Math.min(width / STAGE_LOGICAL_WIDTH, height / STAGE_LOGICAL_HEIGHT));
    const logicalWidth = width / scale;
    const logicalHeight = height / scale;
    document.documentElement.style.setProperty("--zoo-stage-scale", String(scale));
    document.documentElement.style.setProperty("--zoo-stage-left", "0px");
    document.documentElement.style.setProperty("--zoo-stage-top", "0px");
    document.documentElement.style.setProperty("--zoo-stage-logical-width", `${logicalWidth}px`);
    document.documentElement.style.setProperty("--zoo-stage-logical-height", `${logicalHeight}px`);
    nodes.stagePanel.dataset.wpCommonScale = String(scale);
    nodes.stagePanel.dataset.wpLogicalWidth = String(logicalWidth);
    nodes.stagePanel.dataset.wpLogicalHeight = String(logicalHeight);
  }

  let centeredStageFrame = 0;
  function updateCenteredStageCard() {
    const cards = [...nodes.stageGrid.querySelectorAll(".stage-card")];
    if (!cards.length || !document.body.classList.contains("wp-standard-stage-page")) return;
    const railRect = nodes.stageGrid.getBoundingClientRect(), railCenter = railRect.left + railRect.width / 2;
    const centered = cards.reduce((nearest, card) => {
      const rect = card.getBoundingClientRect(), distance = Math.abs(rect.left + rect.width / 2 - railCenter);
      return !nearest || distance < nearest.distance ? { card, distance } : nearest;
    }, null)?.card;
    cards.forEach((card) => {
      const isCentered = card === centered;
      card.classList.toggle("is-centered", isCentered);
      if (isCentered) card.setAttribute("aria-current", "true"); else card.removeAttribute("aria-current");
    });
  }

  function scheduleCenteredStageCard() {
    cancelAnimationFrame(centeredStageFrame);
    centeredStageFrame = requestAnimationFrame(updateCenteredStageCard);
  }

  function centerStageCard(card) {
    if (!card || !nodes.stageGrid.clientWidth) return;
    const target = card.offsetLeft - (nodes.stageGrid.clientWidth - card.offsetWidth) / 2;
    nodes.stageGrid.scrollLeft = Math.max(0, Math.min(target, nodes.stageGrid.scrollWidth - nodes.stageGrid.clientWidth));
    scheduleCenteredStageCard();
  }

  function centerRecommendedStage() {
    if (!document.body.classList.contains("wp-standard-stage-page")) return;
    const cards = [...nodes.stageGrid.querySelectorAll(".stage-card:not(.locked)")];
    const recommended = cards.at(-1);
    if (!recommended) return;
    requestAnimationFrame(() => {
      centerStageCard(recommended);
      requestAnimationFrame(() => centerStageCard(recommended));
    });
  }

  window.addEventListener("resize", updateBattleViewport);
  window.visualViewport?.addEventListener("resize", updateBattleViewport);
  window.addEventListener("resize", updateStageViewport);
  window.visualViewport?.addEventListener("resize", updateStageViewport);
  window.addEventListener("resize", scheduleCenteredStageCard, { passive:true });
  window.visualViewport?.addEventListener("resize", scheduleCenteredStageCard, { passive:true });
  nodes.stageGrid.addEventListener("scroll", scheduleCenteredStageCard, { passive:true });
  nodes.stageGrid.addEventListener("wonder:stage-snap", scheduleCenteredStageCard);

  function t(key, data) {
    const parts = key.split(".");
    let value = text[locale] || text.en;
    for (const part of parts) value = value?.[part];
    if (typeof value !== "string") value = key;
    return Object.entries(data || {}).reduce((out, [name, item]) => out.replaceAll(`{${name}}`, item), value);
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

  function localizeGuide() {
    const guide = document.querySelector(".game-page-info");
    if (!guide) return;
    const setText = (selector, key) => {
      const node = guide.querySelector(selector);
      if (node) node.textContent = t(key);
    };
    guide.setAttribute("aria-label", t("guideAria"));
    setText(".game-info-kicker", "guideKicker");
    setText(".game-info-title h2", "guideTitle");
    setText(".game-info-title p", "guideIntro");
    setText(".game-info-sections > .game-info-section:first-child h3", "guideHowTitle");
    [...guide.querySelectorAll(".game-info-sections > .game-info-section:first-child li")].forEach((node, index) => {
      node.textContent = t(`guideHow${index + 1}`);
    });
    setText(".game-info-strategy h3", "guideStrategyTitle");
    [...guide.querySelectorAll(".game-info-strategy li")].forEach((node, index) => {
      node.textContent = t(`guideStrategy${index + 1}`);
    });
    setText(".game-info-parent h3", "guideParentTitle");
    setText(".game-info-parent p", "guideParentNote");
    const faqSection = [...guide.querySelectorAll(".game-info-section")].find((section) => section.querySelector("dl"));
    if (faqSection) {
      const heading = faqSection.querySelector("h3");
      if (heading) heading.textContent = t("guideFaqTitle");
      [...faqSection.querySelectorAll("dl > div")].slice(0, 4).forEach((row, index) => {
        const question = row.querySelector("dt");
        const answer = row.querySelector("dd");
        if (question) question.textContent = t(`guideFaqQ${index + 1}`);
        if (answer) answer.textContent = t(`guideFaqA${index + 1}`);
      });
    }
  }

  function playSound(name) {
    window.WonderSound?.play?.(name);
  }

  function track(event, payload = {}) {
    window.WonderAnalytics?.track(event, { game_id: GAME_ID, ...payload });
  }

  function localizeStatic() {
    document.documentElement.lang = window.WonderI18n?.actualLocale?.() || locale;
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
    document.title = t("metaTitle");
    document.querySelector('meta[name="description"]')?.setAttribute("content", t("metaDescription"));
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", t("metaTitle"));
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", t("metaDescription"));
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", t("metaTitle"));
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", t("metaDescription"));
    document.querySelector(".home-link")?.setAttribute("aria-label", t("homeAria"));
    nodes.localeSelect.setAttribute("aria-label", t("languageAria"));
    nodes.stageBackBtn.setAttribute("aria-label", t("stageBackAria"));
    nodes.stageGrid.setAttribute("aria-label", t("stageListAria"));
    nodes.backToStagesBtn.setAttribute("aria-label", t("battleBackAria"));
    document.querySelector(".shift-board")?.setAttribute("aria-label", t("shiftAria"));
    localizeGuide();
    nodes.itemGrid.setAttribute("aria-label", t("careItemsAria"));
    nodes.localeSelect.value = locale;
    nodes.leaveTitle.textContent = t("leaveTitle");
    nodes.leaveText.textContent = t("leaveText");
    nodes.keepHelpingBtn.textContent = t("keepHelping");
    nodes.leaveShiftBtn.textContent = t("leaveShift");
  }

  function renderStageGrid() {
    nodes.stageGrid.innerHTML = "";
    stages.forEach((stage, index) => {
      const stageNo = index + 1;
      const button = document.createElement("button");
      button.className = "stage-card";
      button.type = "button";
      const isLocked = stageNo > unlocked;
      if (isLocked) button.classList.add("locked");
      button.dataset.stageIndex = String(index);
      button.setAttribute("aria-disabled", String(isLocked));
      const rule = t(`rules.${stage.rule}`);
      const checkpoint = stage.checkpoint ? ` · ${t("checkpoint")}` : "";
      button.setAttribute("aria-label", `${t("stage", { n: stageNo })} - ${t(`stations.${stage.station}`)}. ${rule}${checkpoint}. ${t("stageGoal", { station: t(`stations.${stage.station}`), tickets: stage.tickets })}${isLocked ? `. ${t("locked")}` : ""}`);
      button.innerHTML = `
        <b class="stage-icon"><img src="${animalAssets[stage.animal]}" alt="" /></b>
        <strong>${t("stage", { n: stageNo })} - ${t(`stations.${stage.station}`)}</strong>
        <em>${rule}${checkpoint}</em>
        <span>${"★".repeat(stars[stageNo] || 0)}${"☆".repeat(3 - (stars[stageNo] || 0))}</span>
      `;
      button.addEventListener("click", () => {
        if (stageNo > unlocked) {
          showFloatingText(t("locked"));
          playSound("click");
          return;
        }
        startStage(index);
      });
      nodes.stageGrid.appendChild(button);
    });
    centerRecommendedStage();
    scheduleCenteredStageCard();
  }

  function setResultOwnership(active) {
    nodes.playPanel.inert = active;
    if (active) nodes.playPanel.setAttribute("aria-hidden", "true");
    else nodes.playPanel.removeAttribute("aria-hidden");
  }

  function setLeaveConfirmOpen(open, restoreFocus = true) {
    if (open === leaveConfirmOpen) return;
    leaveConfirmOpen = open;
    leavePanel.classList.toggle("hidden", !open);
    setResultOwnership(open);
    if (open) nodes.keepHelpingBtn.focus({ preventScroll:true });
    else if (restoreFocus) nodes.backToStagesBtn.focus({ preventScroll:true });
  }

  function visibleResultActions() {
    return [...nodes.resultPanel.querySelectorAll("button, a[href]")].filter((action) => {
      if (action.disabled || action.classList.contains("hidden")) return false;
      const style = getComputedStyle(action);
      return style.display !== "none" && style.visibility !== "hidden";
    });
  }

  function focusResultAction() {
    const preferred = nodes.resultPanel.querySelector(".primary-action") || nodes.retryBtn;
    preferred.focus();
  }

  function showMenu() {
    setLeaveConfirmOpen(false, false);
    cancelCareTransition();
    acceptingInput = false;
    setResultOwnership(false);
    nodes.menuPanel.classList.add("hidden");
    nodes.stagePanel.classList.remove("hidden");
    nodes.playPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    document.body.classList.add("wp-standard-stage-page");
    setBattleViewport(false);
    restoreStageShell();
    renderStageGrid();
    updateStageViewport();
    requestAnimationFrame(() => {
      restoreStageShell();
      updateStageViewport();
    });
    setTimeout(restoreStageShell, 180);
  }

  function showMain() {
    setLeaveConfirmOpen(false, false);
    cancelCareTransition();
    acceptingInput = false;
    setResultOwnership(false);
    nodes.stagePanel.classList.add("hidden");
    nodes.menuPanel.classList.remove("hidden");
    document.body.classList.remove("wp-standard-stage-page");
    clearBattleShellStyles();
  }

  function startStage(index) {
    setLeaveConfirmOpen(false, false);
    cancelCareTransition();
    setResultOwnership(false);
    currentStage = index;
    currentTask = 0;
    mistakes = 0;
    firstTryTasks = 0;
    currentTaskMistakes = 0;
    lastResult = null;
    acceptingInput = true;
    nodes.menuPanel.classList.add("hidden");
    nodes.stagePanel.classList.add("hidden");
    document.body.classList.remove("wp-standard-stage-page");
    nodes.playPanel.classList.remove("hidden");
    nodes.resultPanel.classList.add("hidden");
    setBattleViewport(true);
    track("game_start", { level: index + 1 });
    playSound("start");
    renderTask();
  }

  function renderTask() {
    if (wrongFeedbackTimer) clearTimeout(wrongFeedbackTimer);
    wrongFeedbackTimer = 0;
    const stage = stages[currentStage];
    const task = taskInfo(stage, stage.tasks[currentTask]);
    const mood = clamp(100 - mistakes * 12, 40, 100);
    nodes.stageText.textContent = t("stage", { n: currentStage + 1 });
    nodes.progressFill.style.width = `${(currentTask / stage.tasks.length) * 100}%`;
    nodes.stationText.textContent = t(`stations.${stage.station}`);
    nodes.ticketText.textContent = t("tickets", { count: stage.tickets + currentTask * 3 });
    nodes.moodText.textContent = t("mood", { count: mood });
    nodes.animalEmoji.innerHTML = `<img src="${animalAssets[stage.animal]}" alt="" />`;
    nodes.animalName.textContent = t(`animals.${stage.animal}`);
    nodes.requestText.textContent = task.kind === "category"
      ? t("categoryTask", { station: t(`stations.${stage.station}`), animal: t(`animals.${stage.animal}`), category: t(`categories.${task.value}`) })
      : task.kind === "routine"
        ? t("routineTask", { station: t(`stations.${stage.station}`), animal: t(`animals.${stage.animal}`), item: t(`items.${task.value}`), step: task.step, total: task.total })
        : t("task", { station: t(`stations.${stage.station}`), animal: t(`animals.${stage.animal}`), item: t(`items.${task.value}`) });
    nodes.requestText.dataset.fullText = nodes.requestText.textContent;
    nodes.requestText.classList.remove("memory-hidden");
    const picturedItem = task.kind === "category" ? "" : task.value;
    nodes.requestLine.classList.toggle("has-picture", Boolean(picturedItem));
    nodes.requestIcon.classList.toggle("hidden", !picturedItem);
    nodes.requestIcon.classList.remove("memory-hidden");
    nodes.requestIcon.dataset.item = picturedItem;
    if (picturedItem) nodes.requestIcon.src = iconSrc(picturedItem);
    else nodes.requestIcon.removeAttribute("src");
    nodes.animalCard.setAttribute("aria-label", nodes.requestText.textContent);
    nodes.feedbackText.textContent = "";
    renderItems(stage, task);
    scheduleMemoryCue();
    requestAnimationFrame(() => nodes.animalCard.focus());
  }

  function renderItems(stage, task) {
    itemPointerDrag = null;
    suppressItemClick = null;
    const choices = [task.primary, ...stage.pool.filter((item) => item !== task.primary)].slice(0, 4);
    choices.sort(() => Math.random() - 0.5);
    nodes.itemGrid.replaceChildren();
    nodes.itemGrid.classList.toggle("picture-only", Boolean(stage.pictureOnly));
    nodes.itemGrid.setAttribute("aria-busy", "false");
    choices.forEach((item) => {
      const meta = itemMeta(item);
      const button = document.createElement("button");
      button.className = "item-card";
      button.type = "button";
      button.draggable = false;
      button.dataset.item = meta.id;
      button.dataset.icon = meta.icon;
      button.dataset.label = meta.label;
      button.setAttribute("aria-label", meta.label);

      const iconBox = document.createElement("b");
      const icon = new Image();
      icon.alt = meta.label;
      icon.loading = "eager";
      icon.decoding = "async";
      icon.dataset.item = meta.id;
      icon.onload = () => {
        if (button.dataset.item !== meta.id) return;
        iconBox.replaceChildren(icon);
      };
      icon.src = meta.icon;
      iconBox.replaceChildren(icon);

      const label = document.createElement("span");
      label.textContent = meta.label;
      button.replaceChildren(iconBox, label);

      button.addEventListener("click", (event) => {
        if (suppressItemClick === button) {
          suppressItemClick = null;
          event.preventDefault();
          return;
        }
        chooseItem(meta.id, button);
      });
      button.addEventListener("pointerdown", (event) => {
        if (!acceptingInput || event.isPrimary === false || event.button !== 0) return;
        itemPointerDrag = { id: event.pointerId, button, item: meta.id, x: event.clientX, y: event.clientY, moved: false };
      });
      button.addEventListener("pointermove", (event) => {
        if (!itemPointerDrag || itemPointerDrag.id !== event.pointerId || itemPointerDrag.button !== button) return;
        const distance = Math.hypot(event.clientX - itemPointerDrag.x, event.clientY - itemPointerDrag.y);
        if (!itemPointerDrag.moved && distance >= 6) {
          itemPointerDrag.moved = true;
          button.setPointerCapture?.(event.pointerId);
          button.classList.add("dragging");
        }
        if (itemPointerDrag.moved) event.preventDefault();
      });
      const finishPointerDrag = (event) => {
        if (!itemPointerDrag || itemPointerDrag.id !== event.pointerId || itemPointerDrag.button !== button) return;
        const moved = itemPointerDrag.moved;
        itemPointerDrag = null;
        button.classList.remove("dragging");
        if (button.hasPointerCapture?.(event.pointerId)) button.releasePointerCapture?.(event.pointerId);
        if (!moved) return;
        event.preventDefault();
        suppressItemClick = button;
        setTimeout(() => { if (suppressItemClick === button) suppressItemClick = null; }, 0);
        if (event.type === "pointercancel" || event.type === "lostpointercapture") return;
        const target = nodes.animalCard.getBoundingClientRect();
        if (event.clientX >= target.left && event.clientX <= target.right && event.clientY >= target.top && event.clientY <= target.bottom) {
          chooseItem(meta.id, button);
        }
      };
      button.addEventListener("pointerup", finishPointerDrag);
      button.addEventListener("pointercancel", finishPointerDrag);
      button.addEventListener("lostpointercapture", finishPointerDrag);
      nodes.itemGrid.appendChild(button);
    });
    requestAnimationFrame(syncItemCards);
  }

  function syncItemCards() {
    nodes.itemGrid.querySelectorAll(".item-card").forEach((button) => {
      const item = button.dataset.item;
      const meta = itemMeta(item);
      const image = button.querySelector("img");
      const label = button.querySelector("span");
      if (button.dataset.icon !== meta.icon) button.dataset.icon = meta.icon;
      if (button.dataset.label !== meta.label) button.dataset.label = meta.label;
      button.setAttribute("aria-label", meta.label);
      if (label && label.textContent !== meta.label) label.textContent = meta.label;
      if (image && (image.dataset.item !== item || image.getAttribute("src") !== meta.icon)) {
        image.dataset.item = item;
        image.alt = meta.label;
        image.src = meta.icon;
      }
    });
  }

  function chooseItem(item, button) {
    if (!acceptingInput) return;
    const stage = stages[currentStage];
    const task = taskInfo(stage, stage.tasks[currentTask]);
    if (!task.accepted.includes(item)) {
      mistakes += 1;
      currentTaskMistakes += 1;
      nodes.feedbackText.textContent = t("wrong");
      button?.setAttribute("aria-invalid", "true");
      wrongFeedbackTimer = setTimeout(() => {
        wrongFeedbackTimer = 0;
        button?.removeAttribute("aria-invalid");
      }, 900);
      nodes.animalCard.classList.remove("wrong");
      button?.classList.remove("wrong");
      void nodes.animalCard.offsetWidth;
      nodes.animalCard.classList.add("wrong");
      button?.classList.add("wrong");
      playSound("wrong");
      track("game_answer", { level: currentStage + 1, correct: false, task: task.value, item });
      return;
    }

    acceptingInput = false;
    nodes.itemGrid.setAttribute("aria-busy", "true");
    nodes.itemGrid.querySelectorAll(".item-card").forEach((choice) => { choice.disabled = true; });
    const wasFirstTry = currentTaskMistakes === 0;
    button?.classList.add("correct");
    nodes.animalCard.classList.remove("happy");
    void nodes.animalCard.offsetWidth;
    nodes.animalCard.classList.add("happy");
    nodes.feedbackText.textContent = t("correct");
    playSound("success");
    track("game_answer", { level: currentStage + 1, correct: true, task: task.value, item });
    scheduleCareTransition(() => {
      if (wasFirstTry) firstTryTasks += 1;
      currentTask += 1;
      if (currentTask >= stage.tasks.length) {
        finishStage();
      } else {
        currentTaskMistakes = 0;
        acceptingInput = true;
        renderTask();
      }
    }, 520);
  }

  function finishStage() {
    cancelCareTransition();
    acceptingInput = false;
    const stageNo = currentStage + 1;
    const stage = stages[currentStage];
    const earned = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    const mood = clamp(100 - mistakes * 12, 40, 100);
    const tickets = Math.max(0, stage.tickets + stage.tasks.length * 3 - mistakes * 4);
    const previousBest = stars[stageNo] || 0;
    stars[stageNo] = Math.max(stars[stageNo] || 0, earned);
    saveStars();
    if (stageNo === unlocked && unlocked < stages.length) {
      unlocked += 1;
      storageWrite(unlockKey, String(unlocked));
    }
    nodes.progressFill.style.width = "100%";
    lastResult = { earned, previousBest, tickets, mood, taskCount: stage.tasks.length, firstTryTasks, mistakes };
    renderResult();
    setResultOwnership(true);
    nodes.resultPanel.classList.remove("hidden");
    requestAnimationFrame(focusResultAction);
    playSound("win");
    track("game_complete", { level: stageNo, stars: earned, mistakes });
  }

  function showFloatingText(message) {
    const toast = document.createElement("div");
    toast.className = "floating-toast";
    toast.textContent = message;
    Object.assign(toast.style, {
      position: "fixed",
      left: "50%",
      top: "52%",
      zIndex: "40",
      transform: "translate(-50%, -50%)",
      padding: "12px 18px",
      borderRadius: "999px",
      background: "rgba(24, 49, 38, 0.9)",
      color: "#fff",
      fontWeight: "900",
      animation: "toastUp 1.15s ease forwards",
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1200);
  }

  function initDragDrop() {
    nodes.animalCard.addEventListener("dragover", (event) => event.preventDefault());
    nodes.animalCard.addEventListener("drop", (event) => {
      event.preventDefault();
      const item = event.dataTransfer.getData("text/plain");
      const button = nodes.itemGrid.querySelector(`[data-item="${item}"]`);
      chooseItem(item, button);
    });
  }

  function initLoading() {
    const assets = [...new Set(["../../assets/zoo-helper-day-cover.png", ...Object.values(animalAssets), ...Object.keys(itemIcons).map(iconSrc)])];
    let loaded = 0;
    const finish = () => {
      loaded += 1;
      const progress = Math.round((loaded / assets.length) * 100);
      nodes.loadingText.textContent = `${progress}%`;
      nodes.loadingFill.style.width = `${progress}%`;
      if (loaded >= assets.length) {
        setTimeout(() => {
          nodes.loadingPanel.classList.add("hidden");
          track("game_ready");
        }, 180);
      }
    };
    assets.forEach((src) => {
      const img = new Image();
      img.onload = finish;
      img.onerror = finish;
      img.src = src;
    });
  }

  function renderResult() {
    if (!lastResult) return;
    const { earned, previousBest, tickets, mood, taskCount, firstTryTasks: firstTry, mistakes: retries } = lastResult;
    const stage = stages[currentStage];
    nodes.resultTitle.textContent = earned === 3 ? t("perfect") : earned === 2 ? t("good") : t("keep");
    nodes.starText.textContent = "★".repeat(earned) + "☆".repeat(3 - earned);
    nodes.resultText.textContent = t("result", { station: t(`stations.${stage.station}`), tickets, mood });
    nodes.skillReportTitle.textContent = t("skillReport");
    nodes.animalKnowledgeLabel.textContent = t("animalKnowledge");
    nodes.animalKnowledgeValue.textContent = t("animalValue", { count: taskCount });
    nodes.focusLabel.textContent = t("focus");
    nodes.focusValue.textContent = t("focusValue", { firstTry, retries });
    nodes.coordinationLabel.textContent = t("coordination");
    nodes.coordinationValue.textContent = t("coordinationValue", { count: taskCount });
    nodes.progressComparison.textContent = previousBest === 0
      ? t("firstFinish", { stars: earned })
      : t(earned > previousBest ? "newBest" : "progress", { stars: earned, previous: previousBest });
    const hasNextStage = currentStage < stages.length - 1;
    nodes.nextStageBtn.classList.toggle("hidden", !hasNextStage);
    nodes.nextStageBtn.classList.toggle("primary-action", hasNextStage);
    nodes.resultStagesBtn.classList.toggle("primary-action", !hasNextStage);
    nodes.retryBtn.classList.remove("primary-action");
  }

  function bindEvents() {
    nodes.startGameBtn.addEventListener("click", showMenu);
    nodes.stageBackBtn.addEventListener("click", showMain);
    nodes.localeSelect.addEventListener("change", () => {
      const requested = nodes.localeSelect.value;
      window.WonderI18n?.setLocale?.(requested);
      locale = window.WonderI18n?.locale?.() || requested;
      storageWrite(localeKey, requested);
      localizeStatic();
      renderStageGrid();
      if (!nodes.resultPanel.classList.contains("hidden")) renderResult();
      else if (!nodes.playPanel.classList.contains("hidden")) renderTask();
      requestAnimationFrame(localizeStatic);
    });
    window.addEventListener("wonder:locale-change", (event) => {
      const nextLocale = event.detail?.locale || window.WonderI18n?.locale?.() || "en";
      if (nextLocale === locale) return;
      locale = window.WonderI18n?.legacyLocale?.(nextLocale) || nextLocale;
      storageWrite(localeKey, event.detail?.locale || nextLocale);
      localizeStatic();
      renderStageGrid();
      if (!nodes.resultPanel.classList.contains("hidden")) renderResult();
      else if (!nodes.playPanel.classList.contains("hidden")) renderTask();
      requestAnimationFrame(localizeStatic);
    });
    nodes.backToStagesBtn.addEventListener("click", () => setLeaveConfirmOpen(true));
    nodes.keepHelpingBtn.addEventListener("click", () => setLeaveConfirmOpen(false));
    nodes.leaveShiftBtn.addEventListener("click", showMenu);
    leavePanel.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); event.stopImmediatePropagation(); return; }
      if (event.key === "Escape") { event.preventDefault(); setLeaveConfirmOpen(false); return; }
      if (event.key !== "Tab") return;
      if (event.shiftKey && document.activeElement === nodes.keepHelpingBtn) { event.preventDefault(); nodes.leaveShiftBtn.focus({ preventScroll:true }); }
      else if (!event.shiftKey && document.activeElement === nodes.leaveShiftBtn) { event.preventDefault(); nodes.keepHelpingBtn.focus({ preventScroll:true }); }
    }, true);
    nodes.resultStagesBtn.addEventListener("click", showMenu);
    nodes.retryBtn.addEventListener("click", () => {
      track("game_restart", { level: currentStage + 1, mistakes });
      startStage(currentStage);
    });
    nodes.nextStageBtn.addEventListener("click", () => startStage(Math.min(currentStage + 1, stages.length - 1)));
    nodes.animalCard.addEventListener("click", () => {
      const stage = stages[currentStage];
      if (!stage?.memory || !nodes.requestText.dataset.fullText || nodes.playPanel.classList.contains("hidden")) return;
      nodes.requestText.textContent = nodes.requestText.dataset.fullText;
      nodes.requestText.classList.remove("memory-hidden");
      nodes.requestIcon.classList.remove("memory-hidden");
      scheduleMemoryCue();
    });
    nodes.resultPanel.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      if (event.key !== "Tab" || nodes.resultPanel.classList.contains("hidden")) return;
      const actions = visibleResultActions();
      if (!actions.length) return;
      const first = actions[0];
      const last = actions[actions.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }, true);

    const interruptCareTransition = () => cancelCareTransition(true);
    window.addEventListener("blur", interruptCareTransition);
    window.addEventListener("pagehide", interruptCareTransition);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) interruptCareTransition();
    });

  }

  const style = document.createElement("style");
  style.textContent = "@keyframes toastUp{to{transform:translate(-50%,-120%);opacity:0}}";
  document.head.appendChild(style);

  localizeStatic();
  bindEvents();
  initDragDrop();
  renderStageGrid();
  initLoading();
  if (new URLSearchParams(location.search).has("smoke")) {
    window.__zooHelperDaySmoke = {
      stages: stages.map((stage, index) => ({
        id: index + 1,
        animal: stage.animal,
        station: stage.station,
        rule: stage.rule,
        checkpoint: Boolean(stage.checkpoint),
        pictureOnly: Boolean(stage.pictureOnly),
        memory: Boolean(stage.memory),
        tasks: stage.tasks.map((task) => typeof task === "string" ? task : { ...task, items: task.items ? [...task.items] : undefined }),
      })),
      unlockAll() {
        unlocked = stages.length;
        storageWrite(unlockKey, String(unlocked));
        showMenu();
      },
      startStage(number) { startStage(clamp(Number(number) || 1, 1, stages.length) - 1); },
      snapshot() {
        const stage = stages[currentStage];
        const task = currentTask < stage.tasks.length ? taskInfo(stage, stage.tasks[currentTask]) : null;
        return { stage: currentStage + 1, task: currentTask, taskInfo: task, acceptingInput };
      },
    };
  }
  window.addEventListener("load", localizeStatic, { once: true });
})();
