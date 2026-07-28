(() => {
  const GAME_ID = "tiny-weather-rescue";
  const supportedLocales = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const localeLabels = {
    en: "English",
    "zh-Hant": "繁體中文",
    "zh-Hans": "简体中文",
    ja: "日本語",
    ko: "한국어",
    es: "Español",
    "pt-BR": "Português",
    fr: "Français",
    de: "Deutsch",
    it: "Italiano",
    ru: "Русский",
    hi: "हिन्दी",
    ar: "العربية",
  };
  document.querySelector(".weather-game")?.setAttribute("data-wp-canvas-max-width", "920");
  const localeKey = "weightplayLocale";
  const canonicalLocaleKey = "weightPlayLocale";
  const unlockKey = "weightplay_weather_unlocked";
  const starKey = "weightplay_weather_stars";
  const progressKey = "weightplay_weather_progress";
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

  const tools = {
    umbrella: { icon: "../../assets/tiny-weather-tool-umbrella.svg", className: "umbrella" },
    towel: { icon: "../../assets/tiny-weather-tool-towel.svg", className: "towel" },
    fan: { icon: "../../assets/tiny-weather-tool-fan.svg", className: "fan" },
    lantern: { icon: "../../assets/tiny-weather-tool-lantern.svg", className: "lantern" },
    house: { icon: "../../assets/tiny-weather-tool-house.svg", className: "house" },
    apple: { icon: "../../assets/tiny-weather-tool-apple.svg", className: "apple" },
    boots: { icon: "../../assets/tiny-weather-tool-boots.svg", className: "boots" },
    blanket: { icon: "../../assets/tiny-weather-tool-blanket.svg", className: "blanket" },
  };

  const cueAsset = (name) => `../../assets/tiny-weather-cue-${name}.svg`;
  const problems = {
    rain: { icon: cueAsset("rain"), tool: "umbrella", scene: "rain" },
    puddle: { icon: cueAsset("puddle"), tool: "towel", scene: "puddle" },
    heat: { icon: cueAsset("heat"), tool: "fan", scene: "heat" },
    dark: { icon: cueAsset("dark"), tool: "lantern", scene: "dark" },
    thunder: { icon: cueAsset("thunder"), tool: "house", scene: "thunder" },
    hungry: { icon: cueAsset("hungry"), tool: "apple", scene: "hungry" },
    muddy: { icon: cueAsset("muddy"), tool: "boots", scene: "muddy" },
    cold: { icon: cueAsset("cold"), tool: "blanket", scene: "cold" },
    windy: { icon: cueAsset("windy"), tool: "house", scene: "windy" },
  };

  const animalAssets = {
    rabbit: "../../assets/tiny-weather-animal-rabbit.png",
    fox: "../../assets/tiny-weather-animal-fox.png",
    panda: "../../assets/tiny-weather-animal-panda.png",
    penguin: "../../assets/tiny-weather-animal-penguin.png",
    lion: "../../assets/weightplay-boom-mane-lion.png",
    koala: "../../assets/tiny-weather-animal-koala.png",
  };

  const openingStages = [
    { animalId: "rabbit", theme: "garden", rounds: ["rain", "puddle", "hungry", "heat"], choices: ["umbrella", "towel", "apple", "fan"], target: 3 },
    { animalId: "fox", theme: "forest", rounds: ["dark", "thunder", "rain", "cold"], choices: ["lantern", "house", "umbrella", "blanket"], target: 3 },
    { animalId: "panda", theme: "bamboo", rounds: ["muddy", "puddle", "heat", "hungry", "rain"], choices: ["boots", "towel", "fan", "apple", "umbrella"], target: 4 },
    { animalId: "penguin", theme: "ice", rounds: ["cold", "dark", "windy", "thunder", "puddle"], choices: ["blanket", "lantern", "house", "towel", "umbrella"], target: 4 },
    { animalId: "lion", theme: "savanna", rounds: ["heat", "hungry", "muddy", "thunder", "rain", "cold"], choices: ["fan", "apple", "boots", "house", "umbrella", "blanket"], target: 5 },
    { animalId: "koala", theme: "tree", rounds: ["rain", "dark", "windy", "puddle", "hungry", "cold"], choices: ["umbrella", "lantern", "house", "towel", "apple", "blanket", "fan"], target: 5 },
  ];

  const animalCycle = ["rabbit", "fox", "panda", "penguin", "lion", "koala"];
  const themeCycle = ["garden", "forest", "bamboo", "ice", "savanna", "tree"];
  const problemCycle = ["rain", "puddle", "heat", "dark", "thunder", "hungry", "muddy", "cold", "windy"];
  const combinedRounds = [
    { problem: "rain", clues: ["rain", "windy"], answer: "house" },
    { problem: "puddle", clues: ["rain", "puddle"], answer: "towel" },
    { problem: "cold", clues: ["cold", "windy"], answer: "blanket" },
    { problem: "dark", clues: ["dark", "windy"], answer: "lantern" },
    { problem: "hungry", clues: ["hungry", "heat"], answer: "apple" },
    { problem: "muddy", clues: ["muddy", "rain"], answer: "boots" },
  ];
  const makeRounds = (stageNo, count, combined = false) => Array.from({ length: count }, (_, index) => {
    if (combined) return { ...combinedRounds[(stageNo + index) % combinedRounds.length] };
    return problemCycle[(stageNo * 2 + index) % problemCycle.length];
  });
  const stages = Array.from({ length: 30 }, (_, index) => {
    const id = index + 1;
    if (id <= openingStages.length) {
      const rule = id <= 5 ? "direct" : "picture";
      return { ...openingStages[index], id, rule, checkpoint: id === 5 };
    }
    const chapter = Math.floor((id - 1) / 5);
    const rule = ["direct", "picture", "combined", "memory", "changing", "expert"][chapter];
    const count = id >= 26 ? 6 : id >= 16 ? 5 : 4 + (id % 2);
    return {
      id,
      animalId: animalCycle[index % animalCycle.length],
      theme: themeCycle[index % themeCycle.length],
      rounds: makeRounds(id, count, rule === "combined" || rule === "expert"),
      choices: Object.keys(tools),
      target: Math.max(3, count - 1),
      rule,
      checkpoint: id % 5 === 0,
    };
  });

  const text = {
    en: {
      gameTitle: "Animal Helper Quest",
      seoTitle: "Animal Helper Quest - WeightPlay",
      seoDescription: "Help cute animals through weather, hunger, mud, darkness, and gentle care missions in Animal Helper Quest.",
      ogTitle: "Animal Helper Quest - Animal Care Game",
      ogDescription: "Tap or drag the right care item to help cute animals through gentle missions.",
      language: "Language",
      languageAria: "Language",
      back: "Back",
      backToStages: "Back to stages",
      stageListAria: "Help mission list",
      boardAria: "Animal care play area",
      chooseStage: "Choose Help Mission",
      menuHint: "Help the little animal. Tap or drag the right care item to it.",
      start: "Start Game",
      homeAria: "Back to lobby",
      stages: "Stages",
      loading: "Loading",
      nextStage: "Next Stage",
      retry: "Try Again",
      lobby: "Lobby",
      locked: "Stage locked",
      stage: "Stage {n}",
      progress: "{done}/{total}",
      calm: "Help {score}",
      clear: "Help Complete!",
      failed: "Needs More Care!",
      result: "{score} helpers finished. Best: {best} stars.",
      resultFailed: "Try again and help more animals.",
      reportTitle: "Skill Report",
      previousBest: "Previous Best",
      todayScore: "Today's Score",
      improvement: "Improvement",
      problemSolving: "Problem Solving",
      focus: "Focus",
      animalCare: "Animal Care",
      reportGreat: "Great progress! Your child chose helpful items carefully and solved the care mission.",
      reportGood: "Good effort! Try again to improve focus and choose the best care item.",
      reportTry: "Nice practice! Look at what the animal needs, then try a helpful item.",
      hint: "Tap a care item, or drag it to the animal.",
      whatHelps: "What helps?",
      correct: "Happy helper!",
      wrong: "Try another care item.",
      moveOn: "Let's help the next animal.",
      goal: "Goal {target}",
      checkpoint: "Helper Check",
      ruleDirect: "One clear need",
      rulePicture: "Picture tools",
      ruleCombined: "Two clues, one priority",
      ruleMemory: "Remember the need",
      ruleChanging: "Tools change places",
      ruleExpert: "Helper mix",
      rememberNeed: "What did the animal need? Tap the animal to look again.",
      rain: "It is raining.",
      puddle: "The animal is wet.",
      heat: "It is too hot.",
      dark: "It is too dark.",
      thunder: "Thunder is nearby.",
      hungry: "The animal is hungry.",
      muddy: "The path is muddy.",
      cold: "It is too cold.",
      windy: "The wind is too strong.",
      rabbit: "Rabbit",
      fox: "Fox",
      panda: "Panda",
      penguin: "Penguin",
      lion: "Lion",
      koala: "Koala",
      umbrella: "Umbrella",
      towel: "Towel",
      fan: "Fan",
      lantern: "Lamp",
      house: "House",
      apple: "Apple",
      boots: "Boots",
      blanket: "Blanket",
    },
    "zh-Hant": {
      gameTitle: "\u52d5\u7269\u5e6b\u5e6b\u968a",
      seoTitle: "\u52d5\u7269\u5e6b\u5e6b\u968a - WeightPlay",
      seoDescription: "\u5e6b\u52a9\u53ef\u611b\u5c0f\u52d5\u7269\u89e3\u6c7a\u4e0b\u96e8\u3001\u98e2\u9913\u3001\u6ce5\u6fd8\u3001\u5929\u9ed1\u8207\u5176\u4ed6\u6eab\u548c\u7167\u9867\u4efb\u52d9\u3002",
      ogTitle: "\u52d5\u7269\u5e6b\u5e6b\u968a - \u52d5\u7269\u7167\u9867\u904a\u6232",
      ogDescription: "\u9ede\u4e00\u4e0b\u6216\u62d6\u66f3\u6b63\u78ba\u7684\u7167\u9867\u9053\u5177\uff0c\u5e6b\u52a9\u53ef\u611b\u5c0f\u52d5\u7269\u5b8c\u6210\u4efb\u52d9\u3002",
      language: "\u8a9e\u8a00",
      languageAria: "\u8a9e\u8a00",
      back: "\u8fd4\u56de",
      backToStages: "\u8fd4\u56de\u9078\u95dc",
      stageListAria: "\u5e6b\u5fd9\u4efb\u52d9\u5217\u8868",
      boardAria: "\u52d5\u7269\u7167\u9867\u904a\u6232\u5340",
      chooseStage: "\u9078\u64c7\u5e6b\u5fd9\u4efb\u52d9",
      menuHint: "\u5e6b\u5c0f\u52d5\u7269\uff0c\u9ede\u6216\u62d6\u66f3\u6b63\u78ba\u7167\u9867\u9053\u5177\u7d66\u5b83\u3002",
      start: "\u958b\u59cb\u904a\u6232",
      homeAria: "\u8fd4\u56de Kids \u5927\u5ef3",
      stages: "\u9078\u95dc",
      loading: "\u8f09\u5165\u4e2d",
      nextStage: "\u4e0b\u4e00\u95dc",
      retry: "\u518d\u8a66\u4e00\u6b21",
      lobby: "\u5927\u5ef3",
      locked: "\u95dc\u5361\u672a\u89e3\u9396",
      stage: "\u7b2c {n} \u95dc",
      progress: "{done}/{total}",
      calm: "\u5e6b\u5fd9 {score}",
      clear: "\u5e6b\u5fd9\u5b8c\u6210\uff01",
      failed: "\u9084\u9700\u8981\u7167\u9867\uff01",
      result: "\u5b8c\u6210 {score} \u500b\u5e6b\u5fd9\u4efb\u52d9\u3002\u6700\u4f73\uff1a{best} \u661f\u3002",
      resultFailed: "\u518d\u8a66\u4e00\u6b21\uff0c\u5e6b\u52a9\u66f4\u591a\u5c0f\u52d5\u7269\u3002",
      reportTitle: "\u80fd\u529b\u5c0f\u5831\u544a",
      previousBest: "\u4e4b\u524d\u6700\u4f73",
      todayScore: "\u672c\u6b21\u5206\u6578",
      improvement: "\u9032\u6b65",
      problemSolving: "\u554f\u984c\u89e3\u6c7a",
      focus: "\u5c08\u6ce8\u529b",
      animalCare: "\u52d5\u7269\u7167\u9867",
      reportGreat: "\u5f88\u68d2\uff01\u9019\u6b21\u6709\u4ed4\u7d30\u770b\u60c5\u5883\uff0c\u4e5f\u9078\u5230\u9069\u5408\u7684\u7167\u9867\u9053\u5177\u3002",
      reportGood: "\u505a\u5f97\u4e0d\u932f\uff01\u518d\u8a66\u4e00\u6b21\u53ef\u4ee5\u66f4\u719f\u6089\u6bcf\u500b\u52d5\u7269\u9700\u8981\u4ec0\u9ebc\u3002",
      reportTry: "\u597d\u52aa\u529b\uff01\u5148\u770b\u770b\u5c0f\u52d5\u7269\u9047\u5230\u4ec0\u9ebc\u554f\u984c\uff0c\u518d\u9078\u7167\u9867\u9053\u5177\u3002",
      hint: "\u9ede\u7167\u9867\u9053\u5177\uff0c\u6216\u62d6\u5230\u5c0f\u52d5\u7269\u8eab\u4e0a\u3002",
      whatHelps: "\u4ec0\u9ebc\u53ef\u4ee5\u5e6b\u5fd9\uff1f",
      correct: "\u5c0f\u52d5\u7269\u958b\u5fc3\u4e86\uff01",
      wrong: "\u518d\u8a66\u4e00\u500b\u7167\u9867\u9053\u5177\u3002",
      moveOn: "\u6211\u5011\u5148\u53bb\u5e6b\u4e0b\u4e00\u96bb\u5c0f\u52d5\u7269\u3002",
      goal: "\u76ee\u6a19 {target}",
      checkpoint: "\u5e6b\u624b\u6aa2\u67e5",
      ruleDirect: "\u4e00\u500b\u6e05\u695a\u9700\u6c42",
      rulePicture: "\u5716\u7247\u9053\u5177",
      ruleCombined: "\u5169\u500b\u7dda\u7d22\u3001\u4e00\u500b\u512a\u5148\u9700\u6c42",
      ruleMemory: "\u8a18\u4f4f\u9700\u6c42",
      ruleChanging: "\u9053\u5177\u6703\u63db\u4f4d",
      ruleExpert: "\u5e6b\u624b\u7d9c\u5408",
      rememberNeed: "\u525b\u624d\u9700\u8981\u4ec0\u9ebc\uff1f\u9ede\u5c0f\u52d5\u7269\u53ef\u4ee5\u518d\u770b\u4e00\u6b21\u3002",
      rain: "\u5916\u9762\u5728\u4e0b\u96e8\u3002",
      puddle: "\u5c0f\u52d5\u7269\u6fd5\u6fd5\u7684\u3002",
      heat: "\u592a\u967d\u592a\u71b1\u4e86\u3002",
      dark: "\u5929\u8272\u592a\u6697\u4e86\u3002",
      thunder: "\u96f7\u8072\u9760\u8fd1\u4e86\u3002",
      hungry: "\u5c0f\u52d5\u7269\u809a\u5b50\u9913\u4e86\u3002",
      muddy: "\u8def\u4e0a\u90fd\u662f\u6ce5\u5df4\u3002",
      cold: "\u5929\u6c23\u592a\u51b7\u4e86\u3002",
      windy: "\u98a8\u592a\u5927\u4e86\u3002",
      rabbit: "\u5154\u5b50",
      fox: "\u72d0\u72f8",
      panda: "\u8c93\u718a",
      penguin: "\u4f01\u9d5d",
      lion: "\u7345\u5b50",
      koala: "\u7121\u5c3e\u718a",
      umbrella: "\u96e8\u5098",
      towel: "\u6bdb\u5dfe",
      fan: "\u98a8\u6247",
      lantern: "\u5c0f\u71c8",
      house: "\u5c0f\u5c4b",
      apple: "\u860b\u679c",
      boots: "\u96e8\u9774",
      blanket: "\u6bef\u5b50",
    },
    es: {
      gameTitle: "Misión de Ayuda Animal", seoTitle: "Misión de Ayuda Animal - WeightPlay", seoDescription: "Ayuda a animales adorables con lluvia, hambre, barro, oscuridad y otras misiones tranquilas de cuidado.",
      ogTitle: "Misión de Ayuda Animal - Juego de cuidados", ogDescription: "Toca o arrastra el objeto adecuado para ayudar a los animales en misiones tranquilas.",
      language: "Idioma", languageAria: "Idioma", back: "Volver", backToStages: "Volver a los niveles", stageListAria: "Lista de misiones de ayuda", boardAria: "Zona de cuidado animal", chooseStage: "Elegir misión de ayuda", menuHint: "Ayuda al animal. Toca o arrastra hasta él el objeto de cuidado adecuado.",
      stages: "Niveles", loading: "Cargando", nextStage: "Siguiente nivel", retry: "Intentar de nuevo", lobby: "Sala de juegos", locked: "Nivel bloqueado", stage: "Nivel {n}", progress: "{done}/{total}", calm: "Ayudas {score}",
      clear: "¡Ayuda completada!", failed: "¡Necesita más cuidados!", result: "{score} ayudas completadas. Mejor: {best} estrellas.", resultFailed: "Inténtalo otra vez y ayuda a más animales.",
      reportTitle: "Informe de habilidades", previousBest: "Mejor anterior", todayScore: "Puntuación de hoy", improvement: "Mejora", problemSolving: "Resolución de problemas", focus: "Concentración", animalCare: "Cuidado animal",
      reportGreat: "¡Gran progreso! Elegiste con atención los objetos útiles y resolviste la misión.", reportGood: "¡Buen esfuerzo! Inténtalo de nuevo para elegir mejor los objetos de cuidado.", reportTry: "¡Buena práctica! Mira qué necesita el animal y prueba un objeto útil.",
      hint: "Toca un objeto de cuidado o arrástralo hasta el animal.", whatHelps: "¿Qué puede ayudar?", correct: "¡Ayudante feliz!", wrong: "Prueba otro objeto de cuidado.", moveOn: "Ayudemos al siguiente animal.", goal: "Objetivo {target}", checkpoint: "Prueba de ayudante",
      ruleDirect: "Una necesidad clara", rulePicture: "Herramientas con imágenes", ruleCombined: "Dos pistas, una prioridad", ruleMemory: "Recuerda la necesidad", ruleChanging: "Las herramientas cambian de lugar", ruleExpert: "Mezcla de ayudante",
      rememberNeed: "¿Qué necesitaba el animal? Tócalo para verlo otra vez.", rain: "Está lloviendo.", puddle: "El animal está mojado.", heat: "Hace demasiado calor.", dark: "Está demasiado oscuro.", thunder: "Hay truenos cerca.",
      hungry: "El animal tiene hambre.", muddy: "El camino está embarrado.", cold: "Hace demasiado frío.", windy: "El viento es demasiado fuerte.",
      rabbit: "Conejo", fox: "Zorro", panda: "Panda", penguin: "Pingüino", lion: "León", koala: "Koala",
      umbrella: "Paraguas", towel: "Toalla", fan: "Ventilador", lantern: "Lámpara", house: "Casa", apple: "Manzana", boots: "Botas", blanket: "Manta",
    },
  };

  Object.assign(text.en, { leaveTitle: "Leave this rescue?", leaveText: "Your care progress in this mission will reset.", keepHelping: "Keep helping", leaveMission: "Leave mission" });
  Object.assign(text["zh-Hant"], { leaveTitle: "\u8981\u96e2\u958b\u9019\u6b21\u6551\u63f4\u55ce\uff1f", leaveText: "\u9019\u4e00\u95dc\u7684\u7167\u8b77\u9032\u5ea6\u6703\u91cd\u8a2d\u3002", keepHelping: "\u7e7c\u7e8c\u5e6b\u5fd9", leaveMission: "\u96e2\u958b\u4efb\u52d9" });
  Object.assign(text.es, { start: "Iniciar juego", homeAria: "Volver a la sala infantil", leaveTitle: "\u00bfSalir de este rescate?", leaveText: "Tu progreso de cuidado en esta misi\u00f3n se reiniciar\u00e1.", keepHelping: "Seguir ayudando", leaveMission: "Salir de la misi\u00f3n" });
  const localeTextOverrides = {
    ko: { locked: "\uc7a0\uae34 \uc2a4\ud14c\uc774\uc9c0" },
    it: {
      gameTitle: "Missione Aiuta-Animali",
      seoTitle: "Missione Aiuta-Animali - WeightPlay",
      seoDescription: "Aiuta simpatici animali con pioggia, fame, fango, buio e altre tranquille missioni di cura.",
      ogTitle: "Missione Aiuta-Animali - Gioco di cura degli animali",
      ogDescription: "Tocca l'oggetto di cura giusto oppure trascinalo sull'animale per aiutarlo.",
      language: "Lingua",
      languageAria: "Lingua",
      back: "Indietro",
      backToStages: "Torna alle missioni",
      stageListAria: "Elenco delle missioni di aiuto",
      boardAria: "Area giochi per la cura degli animali",
      chooseStage: "Scegli una missione di aiuto",
      menuHint: "Aiuta il piccolo animale: tocca l'oggetto giusto oppure trascinalo sull'animale.",
      start: "Inizia il gioco",
      homeAria: "Ritorna alla raccolta dei giochi",
      stages: "Missioni",
      loading: "Caricamento",
      nextStage: "Missione successiva",
      retry: "Riprova",
      lobby: "Raccolta giochi",
      locked: "Missione bloccata",
      stage: "Missione {n}",
      progress: "{done}/{total}",
      calm: "Aiuti {score}",
      clear: "Missione completata!",
      failed: "Serve ancora un po' di aiuto!",
      result: "Situazioni risolte: {score}. Record: {best} stelle.",
      resultFailed: "Riprova e aiuta altri animali.",
      reportTitle: "Rapporto sulle abilit\u00e0",
      previousBest: "Record precedente",
      todayScore: "Punteggio di oggi",
      improvement: "Miglioramento",
      problemSolving: "Risoluzione dei problemi",
      focus: "Attenzione",
      animalCare: "Cura degli animali",
      reportGreat: "Ottimo lavoro! Hai osservato con attenzione e scelto gli oggetti di cura adatti.",
      reportGood: "Bel tentativo! Riprova per osservare meglio e scegliere l'oggetto pi\u00f9 adatto.",
      reportTry: "Buon allenamento! Guarda di cosa ha bisogno l'animale, poi prova un oggetto utile.",
      hint: "Tocca un oggetto di cura oppure trascinalo sull'animale.",
      whatHelps: "Cosa pu\u00f2 aiutare?",
      correct: "Animale aiutato!",
      wrong: "Prova un altro oggetto di cura.",
      moveOn: "Aiutiamo il prossimo animale.",
      goal: "Obiettivo {target}",
      checkpoint: "Prova dell'aiutante",
      ruleDirect: "Un bisogno chiaro",
      rulePicture: "Strumenti illustrati",
      ruleCombined: "Due indizi, una priorit\u00e0",
      ruleMemory: "Ricorda la necessit\u00e0",
      ruleChanging: "Gli strumenti cambiano posto",
      ruleExpert: "Sfida completa dell'aiutante",
      rememberNeed: "Di cosa aveva bisogno l'animale? Toccalo per guardare di nuovo.",
      rain: "Sta piovendo.",
      puddle: "L'animale \u00e8 bagnato.",
      heat: "Fa troppo caldo.",
      dark: "\u00c8 troppo buio.",
      thunder: "Il temporale \u00e8 vicino.",
      hungry: "L'animale ha fame.",
      muddy: "Il sentiero \u00e8 fangoso.",
      cold: "Fa troppo freddo.",
      windy: "Il vento \u00e8 troppo forte.",
      rabbit: "Coniglio",
      fox: "Volpe",
      panda: "Panda",
      penguin: "Pinguino",
      lion: "Leone",
      koala: "Koala",
      umbrella: "Ombrello",
      towel: "Asciugamano",
      fan: "Ventaglio",
      lantern: "Lampada",
      house: "Rifugio",
      apple: "Mela",
      boots: "Stivali",
      blanket: "Coperta",
      leaveTitle: "Vuoi lasciare questa missione?",
      leaveText: "I progressi di cura di questa missione verranno azzerati.",
      keepHelping: "Continua ad aiutare",
      leaveMission: "Lascia la missione",
    },
  };

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
    movesText: $("movesText"),
    starsText: $("starsText"),
    board: $("board"),
    hintText: $("hintText"),
    resultPanel: $("resultPanel"),
    resultTitle: $("resultTitle"),
    starText: $("starText"),
    resultText: $("resultText"),
    skillReport: $("skillReport"),
    nextStageBtn: $("nextStageBtn"),
    retryBtn: $("retryBtn"),
    resultStagesBtn: $("resultStagesBtn"),
    loadingPanel: $("loadingPanel"),
    loadingText: $("loadingText"),
    loadingFill: $("loadingFill"),
    homeLink: document.querySelector(".home-link"),
  };
  const leavePanel = document.createElement("section");
  leavePanel.id = "leavePanel";
  leavePanel.className = "helper-leave-panel hidden";
  leavePanel.setAttribute("role", "dialog");
  leavePanel.setAttribute("aria-modal", "true");
  leavePanel.setAttribute("aria-labelledby", "leaveTitle");
  leavePanel.innerHTML = '<div class="helper-leave-card"><strong id="leaveTitle"></strong><p id="leaveText"></p><button id="keepHelpingBtn" type="button"></button><button id="leaveMissionBtn" type="button"></button></div>';
  nodes.playPanel.append(leavePanel);
  nodes.leavePanel = leavePanel;
  nodes.leaveTitle = $("leaveTitle");
  nodes.leaveText = $("leaveText");
  nodes.keepHelpingBtn = $("keepHelpingBtn");
  nodes.leaveMissionBtn = $("leaveMissionBtn");

  const legacySavedLocale = storageRead(localeKey);
  const canonicalSavedLocale = storageRead(canonicalLocaleKey);
  if (!canonicalSavedLocale && supportedLocales.includes(legacySavedLocale)) {
    window.WonderI18n?.setLocale?.(legacySavedLocale);
  }
  let locale = window.WonderI18n?.actualLocale?.() || window.WonderI18n?.locale?.() || canonicalSavedLocale || legacySavedLocale || "en";
  let unlocked = clamp(Number(storageRead(unlockKey)) || 1, 1, stages.length);
  let records = readRecords();
  let currentStage = 0;
  let roundIndex = 0;
  let score = 0;
  let mistakes = 0;
  let roundMistakes = 0;
  let choiceAttempt = 0;
  let memoryHidden = false;
  let running = false;
  let busy = false;
  let dragState = null;
  let careTransitionToken = 0;
  let careLifecycleSuspended = document.hidden;
  let careWindowBlurred = false;
  let leaveOpen = false;

  function invalidateCareTransition() {
    careTransitionToken += 1;
    busy = false;
  }

  function scheduleCareTask(task, delay) {
    const token = careTransitionToken;
    let remaining = delay;
    let lastFrameAt = null;
    const tick = (now) => {
      if (token !== careTransitionToken || !running || !document.body.classList.contains("helper-playing")) return;
      if (careLifecycleSuspended || document.hidden) {
        lastFrameAt = null;
        requestAnimationFrame(tick);
        return;
      }
      if (lastFrameAt !== null) remaining -= Math.max(0, now - lastFrameAt);
      lastFrameAt = now;
      if (remaining <= 0) task();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function suspendCareTransitions() {
    careLifecycleSuspended = true;
  }

  function resumeCareTransitions() {
    careLifecycleSuspended = document.hidden || careWindowBlurred || leaveOpen;
  }

  function reclaimCareForeground(event) {
    if (!event.isTrusted || document.hidden || leaveOpen) return;
    careWindowBlurred = false;
    resumeCareTransitions();
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function readRecords() {
    try {
      return JSON.parse(storageRead(starKey) || "{}");
    } catch {
      return {};
    }
  }

  function saveRecords() {
    storageWrite(starKey, JSON.stringify(records));
    storageWrite(unlockKey, String(unlocked));
  }

  function readProgress() {
    try {
      return JSON.parse(storageRead(progressKey) || "{}");
    } catch {
      return {};
    }
  }

  function saveProgress(stageId, entry) {
    const progress = readProgress();
    progress[stageId] = entry;
    storageWrite(progressKey, JSON.stringify(progress));
  }

  function t(label, data = {}) {
    const sourceLocale = locale === "zh-Hans" ? "zh-Hant" : locale;
    const table = text[sourceLocale] || text.en;
    const override = localeTextOverrides[locale]?.[label];
    const value = override || table[label] || text.en[label] || label;
    const immediate = override || ["en", "zh-Hant", "zh-Hans", "es"].includes(locale)
      ? value
      : window.WeightPlayGameRuntimeLocalizer?.translate(value) || value;
    const localized = Object.entries(data).reduce((out, [name, item]) => out.replaceAll(`{${name}}`, String(item)), immediate);
    return locale === "zh-Hans" ? window.WonderI18n?.simplifyChineseText?.(localized) || localized : localized;
  }

  function playSound(name) {
    window.WonderSound?.play?.(name);
  }

  function track(event, payload = {}) {
    window.WonderAnalytics?.track(event, { game_id: GAME_ID, ...payload });
  }

  function localizeStatic() {
    document.documentElement.lang = supportedLocales.includes(locale) ? locale : "en";
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.title = t("seoTitle");
    setMeta('meta[name="description"]', "content", t("seoDescription"));
    setMeta('meta[property="og:title"]', "content", t("ogTitle"));
    setMeta('meta[property="og:description"]', "content", t("ogDescription"));
    nodes.localeSelect.value = locale;
    nodes.localeSelect.setAttribute("aria-label", t("languageAria"));
    nodes.homeLink.setAttribute("aria-label", t("homeAria"));
    nodes.stageBackBtn.setAttribute("aria-label", t("back"));
    nodes.backToStagesBtn.setAttribute("aria-label", t("backToStages"));
    nodes.stageGrid.setAttribute("aria-label", t("stageListAria"));
    nodes.board.setAttribute("aria-label", t("boardAria"));
    nodes.leaveTitle.textContent = t("leaveTitle");
    nodes.leaveText.textContent = t("leaveText");
    nodes.keepHelpingBtn.textContent = t("keepHelping");
    nodes.leaveMissionBtn.textContent = t("leaveMission");
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
  }

  function setMeta(selector, attr, value) {
    const node = document.querySelector(selector);
    if (node) node.setAttribute(attr, value);
  }

  function ensureLocaleOptions() {
    const current = new Map([...nodes.localeSelect.options].map((option) => [option.value, option]));
    nodes.localeSelect.replaceChildren(...supportedLocales.map((code) => {
      const option = current.get(code) || document.createElement("option");
      option.value = code;
      option.textContent = localeLabels[code];
      return option;
    }));
  }

  let centeredStageFrame = 0;

  function updateCenteredStageCard() {
    const railRect = nodes.stageGrid.getBoundingClientRect();
    const railCenter = railRect.left + railRect.width / 2;
    const cards = [...nodes.stageGrid.querySelectorAll(".stage-card")]
      .filter((card) => card.getClientRects().length);
    const centered = cards.reduce((nearest, card) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - railCenter);
      return !nearest || distance < nearest.distance ? { card, distance } : nearest;
    }, null)?.card;
    cards.forEach((card) => {
      const active = card === centered;
      card.classList.toggle("is-centered", active);
      if (active) card.setAttribute("aria-current", "true");
      else card.removeAttribute("aria-current");
    });
  }

  function requestCenteredStageUpdate() {
    if (centeredStageFrame) return;
    centeredStageFrame = requestAnimationFrame(() => {
      centeredStageFrame = 0;
      updateCenteredStageCard();
    });
  }

  function renderStageGrid(focusIndex = null) {
    nodes.stageGrid.innerHTML = "";
    stages.forEach((stage, index) => {
      const stageNo = index + 1;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "stage-card";
      button.dataset.stage = String(stageNo);
      const locked = stageNo > unlocked;
      if (locked) {
        button.classList.add("locked");
        button.setAttribute("aria-disabled", "true");
        button.setAttribute("aria-label", `${t("stage", { n: stageNo })}: ${t(stage.animalId)}. ${t("locked")}`);
      }
      const best = records[stageNo] || 0;
      const firstKey = typeof stage.rounds[0] === "string" ? stage.rounds[0] : stage.rounds[0].problem;
      const firstProblem = problems[firstKey];
      button.innerHTML = `
        <b class="stage-animal">
          <img src="${animalAssets[stage.animalId]}" alt="" />
          <img class="stage-cue-icon" src="${firstProblem.icon}" alt="" />
        </b>
        <strong>${t("stage", { n: stageNo })}${stage.checkpoint ? ` \u00b7 ${t("checkpoint")}` : ""}</strong>
        <span>${t(stage.animalId)} \u00b7 ${ruleLabel(stage)} \u00b7 ${"\u2605".repeat(best)}${"\u2606".repeat(3 - best)}</span>
      `;
      button.addEventListener("click", () => {
        if (stageNo > unlocked) {
          showFloatingText(t("locked"));
          playSound("click");
          return;
        }
        startStage(index);
      });
      nodes.stageGrid.append(button);
    });
    requestAnimationFrame(() => {
      const unlockedCard = [...nodes.stageGrid.querySelectorAll(".stage-card:not(.locked)")].at(-1);
      const focusCard = focusIndex === null ? null : nodes.stageGrid.querySelector(`[data-stage="${clamp(focusIndex + 1, 1, unlocked)}"]`);
      const target = focusCard || unlockedCard;
      target?.scrollIntoView({ block: "nearest", inline: "center", behavior: "auto" });
      focusCard?.focus({ preventScroll: true });
      requestCenteredStageUpdate();
    });
  }

  function updateWeatherFrame() {
    if (!document.body.classList.contains("helper-playing") && !document.body.classList.contains("wp-standard-stage-page")) return;
    const viewport = window.visualViewport;
    const visualWidth = Math.round(viewport?.width || 0);
    const visualHeight = Math.round(viewport?.height || 0);
    const useVisual = visualWidth > 0
      && visualHeight > 0
      && Math.abs(visualWidth - innerWidth) <= 2
      && visualHeight <= innerHeight + 2;
    const safeWidth = useVisual ? visualWidth : innerWidth;
    const height = useVisual ? visualHeight : innerHeight;
    const width = Math.min(Math.max(1, safeWidth), 920);
    const scale = Math.max(0.1, Math.min(width / 390, height / 788));
    const logicalWidth = width / scale;
    const logicalHeight = height / scale;
    document.documentElement.style.setProperty("--weather-frame-scale", String(scale));
    document.documentElement.style.setProperty("--weather-logical-width", `${logicalWidth}px`);
    document.documentElement.style.setProperty("--weather-logical-height", `${logicalHeight}px`);
    document.documentElement.style.setProperty("--weather-frame-left", `${Math.max(0, (safeWidth - width) / 2)}px`);
    document.documentElement.style.setProperty("--weather-frame-top", "0px");
    const shell = document.querySelector(".weather-game");
    ["position", "inset", "left", "top", "width", "height", "min-height", "transform", "transform-origin"].forEach((property) => shell?.style.removeProperty(property));
  }

  function exitSharedPlayViewport() {
    window.WeightPlayGame?.exitMobileGameMode?.();
    document.body.classList.remove("weightplay-active-viewport", "wp-mobile-game-mode");
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    if (document.webkitFullscreenElement) document.webkitExitFullscreen?.();
  }

  window.addEventListener("resize", updateWeatherFrame);
  window.addEventListener("orientationchange", updateWeatherFrame);
  window.visualViewport?.addEventListener("resize", updateWeatherFrame, { passive: true });
  window.addEventListener("resize", requestCenteredStageUpdate, { passive: true });
  window.addEventListener("orientationchange", requestCenteredStageUpdate, { passive: true });
  window.visualViewport?.addEventListener("resize", requestCenteredStageUpdate, { passive: true });
  nodes.stageGrid.addEventListener("scroll", requestCenteredStageUpdate, { passive: true });
  nodes.stageGrid.addEventListener("wonder:stage-snap", requestCenteredStageUpdate);

  function startStage(index) {
    invalidateCareTransition();
    cleanupDrag();
    currentStage = index;
    roundIndex = 0;
    score = 0;
    mistakes = 0;
    roundMistakes = 0;
    choiceAttempt = 0;
    memoryHidden = false;
    running = true;
    busy = false;
    nodes.menuPanel.classList.add("hidden");
    nodes.stagePanel.classList.add("hidden");
    document.body.classList.remove("wp-standard-stage-page");
    nodes.resultPanel.classList.add("hidden");
    nodes.playPanel.classList.remove("result-active");
    nodes.playPanel.classList.remove("hidden");
    document.body.classList.add("helper-playing");
    document.querySelector(".weather-game")?.removeAttribute("data-play-viewport");
    nodes.hintText.textContent = t("hint");
    renderRound("", true);
    exitSharedPlayViewport();
    updateWeatherFrame();
    track("game_start", { stage: currentStage + 1 });
    requestAnimationFrame(() => {
      exitSharedPlayViewport();
      updateWeatherFrame();
    });
    window.setTimeout(() => {
      exitSharedPlayViewport();
      updateWeatherFrame();
    }, 160);
  }

  function progressPercent(stage) {
    return Math.round((roundIndex / stage.rounds.length) * 100);
  }

  function roundData(stage = stages[currentStage]) {
    const raw = stage.rounds[roundIndex];
    if (typeof raw === "string") return { problem: raw, clues: [raw], answer: problems[raw].tool };
    return { problem: raw.problem, clues: raw.clues || [raw.problem], answer: raw.answer || problems[raw.problem].tool };
  }

  function ruleLabel(stage) {
    const suffix = `${stage.rule[0].toUpperCase()}${stage.rule.slice(1)}`;
    return t(`rule${suffix}`);
  }

  function renderRound(feedback = "", focusTool = false) {
    cleanupDrag();
    const stage = stages[currentStage];
    const task = roundData(stage);
    const problemKey = task.problem;
    const problem = problems[problemKey];
    const percent = progressPercent(stage);
    const choices = toolChoices(stage, task.answer);
    nodes.stageText.textContent = t("stage", { n: stage.id });
    nodes.movesText.innerHTML = `<b>${t("progress", { done: roundIndex + 1, total: stage.rounds.length })}</b><i style="width:${percent}%"></i>`;
    nodes.starsText.textContent = t("calm", { score });
    nodes.board.innerHTML = `
      <div class="weather-scene ${stage.theme} ${problem.scene}">
        <div class="rescue-scene">
          <div class="weather-effects" aria-hidden="true">${task.clues.map((key) => weatherEffects(key)).join("")}</div>
          <div class="problem-cue${task.clues.length > 1 ? " multi-clue" : ""}" aria-label="${t("whatHelps")}">${task.clues.map((key) => `<span><img class="problem-cue-icon" src="${problems[key].icon}" alt="" /></span>`).join("")}<b aria-hidden="true">→</b><strong aria-hidden="true">?</strong><small>${t("whatHelps")} · ${ruleLabel(stage)}</small></div>
          <div class="animal-zone" data-drop-zone="true">
            <div class="animal-shadow"></div>
            <img class="animal-sprite" src="${animalAssets[stage.animalId]}" alt="${t(stage.animalId)}" />
          </div>
          <div class="need-line${memoryHidden ? " is-memory-hidden" : ""}">${memoryHidden ? t("rememberNeed") : task.clues.map((key) => t(key)).join(" + ")}</div>
        </div>
        <div class="tool-grid">
          ${choices.map((key) => {
            const tool = tools[key];
            return `
            <button class="tool-btn ${tool.className}" type="button" data-tool="${key}" aria-label="${t(key)}">
              <i><img src="${tool.icon}" alt="" /></i>
              <span${stage.rule === "picture" || stage.rule === "expert" ? ' class="visual-only-label"' : ""}>${t(key)}</span>
            </button>
          `;
          }).join("")}
        </div>
        ${feedback ? `<div class="event-pop">${feedback}</div>` : ""}
      </div>
    `;
    nodes.board.querySelectorAll("[data-tool]").forEach((button) => installToolControl(button));
    nodes.board.querySelector(".animal-zone")?.addEventListener("click", () => {
      if (!memoryHidden) return;
      memoryHidden = false;
      renderRound(feedback, true);
    });
    if ((stage.rule === "memory" || stage.rule === "expert") && !memoryHidden) {
      scheduleCareTask(() => {
        if (busy || !running) return;
        memoryHidden = true;
        const line = nodes.board.querySelector(".need-line");
        if (line) { line.classList.add("is-memory-hidden"); line.textContent = t("rememberNeed"); }
      }, 1500);
    }
    if (focusTool) requestAnimationFrame(() => nodes.board.querySelector(".tool-btn")?.focus({ preventScroll: true }));
  }

  function toolChoices(stage, correctTool) {
    const choices = stage.choices || Object.keys(tools);
    const shuffled = seededShuffle(choices, stage.id * 97 + roundIndex * 31 + choiceAttempt * 53);
    if (shuffled.length > 1 && shuffled[0] === correctTool) {
      const offset = ((stage.id + roundIndex) % (shuffled.length - 1)) + 1;
      return [...shuffled.slice(offset), ...shuffled.slice(0, offset)];
    }
    return shuffled;
  }

  function seededShuffle(items, seed) {
    const output = [...items];
    let value = seed || 1;
    for (let index = output.length - 1; index > 0; index -= 1) {
      value = (value * 1664525 + 1013904223) >>> 0;
      const swapIndex = value % (index + 1);
      [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
    }
    return output;
  }

  function weatherEffects(problemKey) {
    if (problemKey === "rain") return "<span>\u{1F4A7}</span><span>\u{2601}\u{FE0F}</span><span>\u{1F4A7}</span>";
    if (problemKey === "puddle") return "<span>\u{1F4A6}</span><span>\u{1F4A7}</span>";
    if (problemKey === "heat") return "<span>\u{2600}\u{FE0F}</span><span>\u{1F321}\u{FE0F}</span>";
    if (problemKey === "dark") return "<span>\u{1F319}</span><span>\u{2728}</span>";
    if (problemKey === "thunder") return "<span>\u{26A1}</span><span>\u{1F329}\u{FE0F}</span>";
    if (problemKey === "muddy") return "<span>\u{1F43E}</span><span>\u{1F7E4}</span>";
    if (problemKey === "cold") return "<span>\u{2744}\u{FE0F}</span><span>\u{1F9CA}</span>";
    if (problemKey === "windy") return "<span>\u{1F32C}\u{FE0F}</span><span>\u{1F343}</span>";
    return "<span>\u{1F37D}\u{FE0F}</span><span>\u{2754}</span>";
  }

  function installToolControl(button) {
    button.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
      }
    });
    button.addEventListener("click", (event) => {
      reclaimCareForeground(event);
      if (button.dataset.skipClick === "1") return;
      if (dragState) return;
      chooseTool(button.dataset.tool, button);
    });
    button.addEventListener("pointerdown", (event) => {
      reclaimCareForeground(event);
      if (!running || busy || dragState) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      dragState = {
        tool: button.dataset.tool,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        lastX: event.clientX,
        lastY: event.clientY,
        moved: false,
        ghost: null,
        button,
      };
      button.setPointerCapture?.(event.pointerId);
    });
    button.addEventListener("pointermove", (event) => {
      if (!dragState || dragState.pointerId !== event.pointerId || dragState.button !== button) return;
      const dx = event.clientX - dragState.startX;
      const dy = event.clientY - dragState.startY;
      dragState.lastX = event.clientX;
      dragState.lastY = event.clientY;
      if (Math.hypot(dx, dy) > 8) dragState.moved = true;
      if (dragState.moved && !dragState.ghost) dragState.ghost = makeGhost(dragState.button, event.clientX, event.clientY);
      moveGhost(event.clientX, event.clientY);
      nodes.board.querySelector(".animal-zone")?.classList.toggle("drag-over", isOverAnimal(event.clientX, event.clientY));
    });
    button.addEventListener("pointerup", finishToolDrag);
    button.addEventListener("pointercancel", (event) => {
      if (dragState?.pointerId === event.pointerId) cleanupDrag();
    });
    button.addEventListener("lostpointercapture", (event) => {
      requestAnimationFrame(() => {
        if (dragState?.button === button && dragState.pointerId === event.pointerId) cleanupDrag();
      });
    });
  }

  function finishToolDrag(event) {
    const activeDrag = dragState;
    if (!activeDrag || activeDrag.pointerId !== event.pointerId) return;
    const releaseX = Number.isFinite(event.clientX) ? event.clientX : activeDrag.lastX;
    const releaseY = Number.isFinite(event.clientY) ? event.clientY : activeDrag.lastY;
    if (activeDrag.moved) {
      activeDrag.button.dataset.skipClick = "1";
      window.setTimeout(() => {
        delete activeDrag.button.dataset.skipClick;
      }, 0);
    }
    const shouldDrop = activeDrag.moved && isOverAnimal(releaseX, releaseY);
    cleanupDrag();
    if (shouldDrop) chooseTool(activeDrag.tool, activeDrag.button);
  }

  window.addEventListener("pointerup", finishToolDrag, true);

  function makeGhost(button, x, y) {
    const ghost = document.createElement("div");
    ghost.className = "tool-drag-ghost";
    ghost.innerHTML = button.querySelector("i")?.innerHTML || "";
    document.body.append(ghost);
    moveGhost(x, y, ghost);
    return ghost;
  }

  function moveGhost(x, y, ghost = dragState?.ghost) {
    if (!ghost) return;
    ghost.style.left = `${x}px`;
    ghost.style.top = `${y}px`;
  }

  function isOverAnimal(x, y) {
    const zone = nodes.board.querySelector(".animal-zone");
    if (!zone) return false;
    const rect = zone.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }

  function cleanupDrag() {
    const activeDrag = dragState;
    dragState = null;
    nodes.board.querySelector(".animal-zone")?.classList.remove("drag-over");
    activeDrag?.ghost?.remove();
    if (activeDrag?.button?.hasPointerCapture?.(activeDrag.pointerId)) {
      activeDrag.button.releasePointerCapture?.(activeDrag.pointerId);
    }
  }

  function chooseTool(tool, button) {
    if (!running || busy) return;
    busy = true;
    const stage = stages[currentStage];
    const task = roundData(stage);
    const problemKey = task.problem;
    const correct = task.answer === tool;
    const skipped = !correct && roundMistakes + 1 >= 3;
    const zone = nodes.board.querySelector(".animal-zone");
    if (correct) {
      score += 1;
      button.classList.add("correct");
      zone?.classList.add("happy");
      showFace("\u{1F604}", "happy");
      nodes.hintText.textContent = t("correct");
      playSound("success");
    } else {
      mistakes += 1;
      roundMistakes += 1;
      choiceAttempt += 1;
      button.classList.add("wrong");
      zone?.classList.add("sad");
      showFace("\u{1F622}", "sad");
      nodes.hintText.textContent = t(skipped ? "moveOn" : "wrong");
      playSound("wrong");
    }
    track("weather_tool", { stage: stage.id, problem: problemKey, tool, correct, skipped, mistakes, roundMistakes });
    scheduleCareTask(() => {
      busy = false;
      if (!correct && !skipped) {
        if (stage.rule === "changing" || stage.rule === "expert") renderRound(t("wrong"), true);
        else {
          button.classList.remove("wrong");
          zone?.classList.remove("sad");
        }
        return;
      }
      roundMistakes = 0;
      choiceAttempt = 0;
      memoryHidden = false;
      roundIndex += 1;
      if (roundIndex >= stage.rounds.length) {
        finishStage();
        return;
      }
      renderRound(correct ? "+1" : t("moveOn"), true);
    }, 760);
  }

  function showFace(face, kind) {
    const pop = document.createElement("div");
    pop.className = `face-pop ${kind}`;
    pop.textContent = face;
    nodes.board.querySelector(".rescue-scene")?.append(pop);
    window.setTimeout(() => pop.remove(), 720);
  }

  function starCount(stage) {
    if (score >= stage.rounds.length && mistakes === 0) return 3;
    if (score >= stage.target && mistakes <= 2) return 2;
    if (score >= Math.max(1, stage.target - 1)) return 1;
    return 0;
  }

  function skillStars(value) {
    const count = clamp(value, 1, 5);
    return `${"\u2605".repeat(count)}${"\u2606".repeat(5 - count)}`;
  }

  function scoreStars(maxScore, offset = 0) {
    return clamp(Math.ceil((score / maxScore) * 5) + offset, 1, 5);
  }

  function updateProgress(stage, stars) {
    const previous = readProgress()[stage.id] || {};
    const previousBest = Number(previous.bestScore) || 0;
    const bestScore = Math.max(previousBest, score);
    const improvementPercent = previousBest > 0 ? Math.round(((score - previousBest) / previousBest) * 100) : score > 0 ? 100 : 0;
    saveProgress(stage.id, {
      lastScore: score,
      bestScore,
      previousBest,
      playCount: (Number(previous.playCount) || 0) + 1,
      lastPlayedAt: new Date().toISOString(),
      improvementPercent,
      stars,
      total: stage.rounds.length,
      mistakes,
    });
  }

  function renderSkillReport(stage) {
    const progress = readProgress()[stage.id] || {};
    const previousBest = Number(progress.previousBest) || 0;
    const improvementPercent = Number(progress.improvementPercent) || 0;
    const messageKey = score >= stage.target ? (mistakes <= 1 ? "reportGreat" : "reportGood") : "reportTry";
    nodes.skillReport.innerHTML = `
      <h2>${t("reportTitle")}</h2>
      <dl>
        <dt>${t("previousBest")}</dt><dd>${previousBest} / ${stage.rounds.length}</dd>
        <dt>${t("todayScore")}</dt><dd>${score} / ${stage.rounds.length}</dd>
        <dt>${t("improvement")}</dt><dd>${improvementPercent > 0 ? `+${improvementPercent}%` : "0%"}</dd>
        <dt>${t("problemSolving")}</dt><dd class="stars">${skillStars(scoreStars(stage.rounds.length))}</dd>
        <dt>${t("focus")}</dt><dd class="stars">${skillStars(scoreStars(stage.rounds.length, -1))}</dd>
        <dt>${t("animalCare")}</dt><dd class="stars">${skillStars(scoreStars(stage.rounds.length))}</dd>
      </dl>
      <p>${t(messageKey)}</p>
    `;
  }

  function finishStage() {
    invalidateCareTransition();
    cleanupDrag();
    running = false;
    const stage = stages[currentStage];
    const stars = starCount(stage);
    const cleared = score >= stage.target;
    updateProgress(stage, stars);
    records[stage.id] = Math.max(records[stage.id] || 0, stars);
    if (cleared && stage.id < stages.length) unlocked = Math.max(unlocked, stage.id + 1);
    saveRecords();
    nodes.playPanel.classList.add("result-active");
    nodes.resultPanel.classList.remove("hidden");
    nodes.resultTitle.textContent = cleared ? t("clear") : t("failed");
    nodes.starText.textContent = `${"\u2605".repeat(stars)}${"\u2606".repeat(3 - stars)}`;
    nodes.resultText.textContent = cleared
      ? t("result", { score, best: records[stage.id] || stars })
      : t("resultFailed");
    nodes.starText.setAttribute("aria-label", nodes.resultText.textContent);
    renderSkillReport(stage);
    const isFinalClear = cleared && stage.id >= stages.length;
    nodes.nextStageBtn.disabled = !cleared || isFinalClear;
    nodes.nextStageBtn.setAttribute("aria-disabled", String(nodes.nextStageBtn.disabled));
    nodes.nextStageBtn.classList.toggle("result-primary", cleared && !isFinalClear);
    nodes.retryBtn.classList.toggle("result-primary", !cleared);
    nodes.resultStagesBtn.classList.toggle("result-primary", isFinalClear);
    (isFinalClear ? nodes.resultStagesBtn : cleared ? nodes.nextStageBtn : nodes.retryBtn).focus({ preventScroll: true });
    renderStageGrid();
    playSound(cleared ? "success" : "wrong");
    track("game_complete", { stage: stage.id, score, stars, cleared, mistakes });
  }

  function showMenu(focusIndex = Math.max(0, unlocked - 1)) {
    invalidateCareTransition();
    running = false;
    busy = false;
    cleanupDrag();
    leaveOpen = false;
    nodes.leavePanel.classList.add("hidden");
    [...nodes.playPanel.children].forEach((child) => { if (child !== nodes.leavePanel) { child.inert = false; child.removeAttribute("aria-hidden"); } });
    resumeCareTransitions();
    nodes.playPanel.classList.add("hidden");
    nodes.playPanel.classList.remove("result-active");
    nodes.resultPanel.classList.add("hidden");
    nodes.menuPanel.classList.add("hidden");
    nodes.stagePanel.classList.remove("hidden");
    document.body.classList.remove("helper-playing");
    document.body.classList.add("wp-standard-stage-page");
    document.querySelector(".weather-game")?.setAttribute("data-play-viewport", "");
    renderStageGrid(focusIndex);
    updateWeatherFrame();
  }

  function showMain(focusStart = false) {
    cleanupDrag();
    nodes.stagePanel.classList.add("hidden");
    nodes.menuPanel.classList.remove("hidden");
    document.body.classList.remove("wp-standard-stage-page");
    if (focusStart) nodes.startGameBtn.focus({ preventScroll: true });
  }

  function showFloatingText(message) {
    const toast = document.createElement("div");
    toast.className = "floating-toast";
    toast.textContent = message;
    document.body.append(toast);
    window.setTimeout(() => toast.remove(), 1300);
  }

  window.addEventListener("blur", () => {
    careWindowBlurred = true;
    cleanupDrag();
    suspendCareTransitions();
  });
  window.addEventListener("focus", () => {
    careWindowBlurred = false;
    resumeCareTransitions();
  });
  window.addEventListener("pagehide", () => {
    cleanupDrag();
    suspendCareTransitions();
  });
  window.addEventListener("pageshow", resumeCareTransitions);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cleanupDrag();
      suspendCareTransitions();
    } else {
      resumeCareTransitions();
    }
  });

  function installLoading() {
    let progress = 0;
    const id = window.setInterval(() => {
      progress = Math.min(100, progress + 25);
      nodes.loadingText.textContent = `${progress}%`;
      nodes.loadingFill.style.width = `${progress}%`;
      if (progress >= 100) {
        window.clearInterval(id);
        window.setTimeout(() => {
          nodes.loadingPanel.classList.add("hidden");
          track("game_ready");
        }, 100);
      }
    }, 80);
  }

  const rejectRepeatedScreenActivation = (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
  };
  nodes.startGameBtn.addEventListener("keydown", rejectRepeatedScreenActivation);
  nodes.stageGrid.addEventListener("keydown", (event) => {
    if (event.target.closest(".stage-card")) rejectRepeatedScreenActivation(event);
  });
  nodes.startGameBtn.addEventListener("click", () => showMenu(Math.max(0, unlocked - 1)));
  nodes.stageBackBtn.addEventListener("click", () => showMain(true));
  function setLeaveOpen(open, restoreFocus = true) {
    if (open === leaveOpen) return;
    leaveOpen = open;
    cleanupDrag();
    nodes.leavePanel.classList.toggle("hidden", !open);
    [...nodes.playPanel.children].forEach((child) => {
      if (child === nodes.leavePanel) return;
      child.inert = open;
      if (open) child.setAttribute("aria-hidden", "true"); else child.removeAttribute("aria-hidden");
    });
    if (open) { suspendCareTransitions(); requestAnimationFrame(() => nodes.keepHelpingBtn.focus({ preventScroll: true })); }
    else { resumeCareTransitions(); if (restoreFocus) requestAnimationFrame(() => nodes.backToStagesBtn.focus({ preventScroll: true })); }
  }
  nodes.localeSelect.addEventListener("change", (event) => {
    const requested = event.target.value;
    window.WonderI18n?.setLocale?.(requested);
    locale = window.WonderI18n?.actualLocale?.() || window.WonderI18n?.locale?.() || requested;
    storageWrite(localeKey, requested);
    localizeStatic();
    renderStageGrid();
    if (running) renderRound();
  });
  nodes.backToStagesBtn.addEventListener("click", () => setLeaveOpen(true));
  nodes.keepHelpingBtn.addEventListener("click", () => setLeaveOpen(false));
  nodes.leaveMissionBtn.addEventListener("click", () => showMenu(currentStage));
  nodes.leavePanel.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); return; }
    if (event.key === "Escape") { event.preventDefault(); setLeaveOpen(false); return; }
    if (event.key !== "Tab") return;
    const actions = [nodes.keepHelpingBtn, nodes.leaveMissionBtn];
    const index = actions.indexOf(document.activeElement);
    event.preventDefault();
    actions[event.shiftKey ? (index <= 0 ? 1 : index - 1) : (index >= 1 ? 0 : index + 1)].focus({ preventScroll: true });
  });
  nodes.homeLink.addEventListener("click", (event) => {
    if (!document.body.classList.contains("helper-playing")) return;
    event.preventDefault();
    showMenu(currentStage);
  });
  nodes.resultStagesBtn.addEventListener("click", () => showMenu(currentStage));
  nodes.retryBtn.addEventListener("click", () => {
    track("game_restart", { stage: currentStage + 1 });
    startStage(currentStage);
  });
  nodes.nextStageBtn.addEventListener("click", () => startStage(Math.min(currentStage + 1, stages.length - 1)));
  nodes.resultPanel.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if (event.key !== "Tab") return;
    const actions = [...nodes.resultPanel.querySelectorAll('button:not([disabled]), a[href]')]
      .filter((action) => !action.classList.contains("hidden") && action.getClientRects().length);
    const first = actions[0];
    const last = actions.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, true);

  if (new URLSearchParams(location.search).has("smoke")) {
    window.__helperQuestSmoke = {
      stages,
      startStage(stageNo) {
        unlocked = stages.length;
        renderStageGrid();
        startStage(clamp(Number(stageNo) || 1, 1, stages.length) - 1);
      },
      unlockAll() {
        unlocked = stages.length;
        saveRecords();
        renderStageGrid();
      },
      snapshot() {
        const task = running ? roundData() : null;
        return { stage: currentStage + 1, round: roundIndex, score, mistakes, busy, running, task };
      },
      chooseAnswer() {
        if (!running || busy) return false;
        const answer = roundData().answer;
        const button = nodes.board.querySelector(`.tool-btn[data-tool="${answer}"]`);
        if (!button) return false;
        chooseTool(answer, button);
        return true;
      },
    };
  }

  const boot = () => {
    ensureLocaleOptions();
    localizeStatic();
    renderStageGrid();
    installLoading();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
