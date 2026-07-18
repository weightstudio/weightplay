(() => {
  const GAME_ID = "animal-hidden-safari";
  const localeKey = "weightplayLocale";
  const canonicalLocaleKey = "weightPlayLocale";
  const unlockKey = "weightplay_hidden_safari_unlocked";
  const starKey = "weightplay_hidden_safari_stars";
  const progressKey = "weightplay_progress_animal-hidden-safari";

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
      gameTitle: "Animal Hidden Safari",
      language: "Language",
      back: "Back",
      stageList: "Stage list",
      backToHabitats: "Back to habitats",
      hiddenAnimalScene: "Hidden animal scene",
      chooseStage: "Choose Habitat",
      menuHint: "Find animals blended into each natural habitat.",
      stages: "Habitats",
      loading: "Loading",
      hint: "Hint",
      findList: "Find These",
      nextStage: "Next Habitat",
      retry: "Try Again",
      lobby: "Lobby",
      locked: "Habitat locked",
      stage: "Habitat {n}",
      great: "Great find!",
      perfect: "Sharp safari eyes!",
      good: "Nice searching!",
      result: "You found {found}/{total} animals in {time}.",
      skillReport: "Skill Report",
      focus: "Focus",
      focusValue: "Found {found} · Empty taps {mistakes}",
      animalKnowledge: "Animal Knowledge",
      animalValue: "Identified {count} animals",
      problemSolving: "Problem Solving",
      solveValue: "Without hints {unaided} · Hints {hints}",
      firstFinish: "First finish · {time}",
      newBest: "New best {time} · Previous {previous}",
      progress: "This time {time} · Best {best}",
      best: "Best {time}",
      noHints: "No hints left",
      hintTarget: "Look for {target}!",
      findFirst: "Find {target} first!",
      decoyTap: "That animal is not on this list.",
      decoyAnimal: "{target}, habitat visitor, not on the find list",
      found: "Found!",
      tryAgain: "Look closely",
      remaining: "{count} left",
      checkpoint: "Habitat Checkpoint",
      rules: {
        open: "Open Search",
        order: "Ranger Order",
        twins: "Animal Pairs",
        camouflage: "Deep Camouflage",
        decoys: "Habitat Visitors",
        drift: "Moving Patrol",
        grand: "Grand Safari Mix",
      },
      targets: {
        lion: "Lion",
        elephant: "Elephant",
        giraffe: "Giraffe",
        panda: "Panda",
        penguin: "Penguin",
        koala: "Koala",
        rabbit: "Rabbit",
        fox: "Fox",
        frog: "Frog",
        owl: "Owl",
      },
      habitat: {
        sunny: "Sunny Grassland",
        river: "River Crossing",
        sunset: "Sunset Trees",
        pond: "Pond Watch",
        jungle: "Jungle Edge",
        lookout: "Lookout Hill",
      },
    },
    "zh-Hant": {
      gameTitle: "\u52d5\u7269\u63a2\u96aa\u627e\u627e\u770b",
      language: "\u8a9e\u8a00",
      back: "\u8fd4\u56de",
      stageList: "\u68f2\u5730\u5217\u8868",
      backToHabitats: "\u8fd4\u56de\u68f2\u5730",
      hiddenAnimalScene: "\u85cf\u8d77\u4f86\u7684\u52d5\u7269\u5834\u666f",
      chooseStage: "\u9078\u64c7\u68f2\u5730",
      menuHint: "\u5728\u5927\u81ea\u7136\u5834\u666f\u88e1\u627e\u51fa\u85cf\u8d77\u4f86\u7684\u52d5\u7269\uff0c\u7df4\u7fd2\u89c0\u5bdf\u529b\u8207\u5c08\u6ce8\u3002",
      stages: "\u68f2\u5730",
      loading: "\u8f09\u5165\u4e2d",
      hint: "\u63d0\u793a",
      findList: "\u8981\u627e\u7684\u52d5\u7269",
      nextStage: "\u4e0b\u4e00\u500b\u68f2\u5730",
      retry: "\u518d\u8a66\u4e00\u6b21",
      lobby: "\u5927\u5ef3",
      locked: "\u68f2\u5730\u5c1a\u672a\u89e3\u9396",
      stage: "\u68f2\u5730 {n}",
      great: "\u627e\u5f97\u5f88\u597d\uff01",
      perfect: "\u597d\u654f\u92b3\u7684\u89c0\u5bdf\u773c\uff01",
      good: "\u5f88\u6703\u627e\u55b2\uff01",
      result: "\u4f60\u5728 {time} \u5167\u627e\u5230 {found}/{total} \u96bb\u52d5\u7269\u3002",
      skillReport: "\u80fd\u529b\u5831\u544a",
      focus: "\u5c08\u6ce8",
      focusValue: "\u627e\u5230 {found} \u96bb \u00b7 \u8aa4\u9ede {mistakes} \u6b21",
      animalKnowledge: "\u52d5\u7269\u77e5\u8b58",
      animalValue: "\u8fa8\u8a8d {count} \u96bb\u52d5\u7269",
      problemSolving: "\u89e3\u984c\u80fd\u529b",
      solveValue: "\u81ea\u5df1\u627e\u5230 {unaided} \u96bb \u00b7 \u63d0\u793a {hints} \u6b21",
      firstFinish: "\u7b2c\u4e00\u6b21\u5b8c\u6210 \u00b7 {time}",
      newBest: "\u65b0\u7684\u6700\u4f73 {time} \u00b7 \u4e4b\u524d {previous}",
      progress: "\u9019\u6b21 {time} \u00b7 \u6700\u4f73 {best}",
      best: "\u6700\u4f73 {time}",
      noHints: "\u6c92\u6709\u63d0\u793a\u4e86",
      hintTarget: "\u627e\u627e\u770b\uff1a{target}\uff01",
      findFirst: "\u8acb\u5148\u627e {target}\uff01",
      decoyTap: "\u9019\u96bb\u52d5\u7269\u4e0d\u5728\u9019\u6b21\u7684\u6e05\u55ae\u4e0a\u3002",
      decoyAnimal: "{target}\uff0c\u68f2\u5730\u8a2a\u5ba2\uff0c\u4e0d\u5728\u5c0b\u627e\u6e05\u55ae\u4e0a",
      found: "\u627e\u5230\u4e86\uff01",
      tryAgain: "\u518d\u4ed4\u7d30\u770b\u770b",
      remaining: "\u9084\u5269 {count} \u500b",
      checkpoint: "\u68f2\u5730\u6aa2\u67e5\u9ede",
      rules: {
        open: "\u81ea\u7531\u641c\u5c0b",
        order: "\u5de1\u8b77\u9806\u5e8f",
        twins: "\u52d5\u7269\u96d9\u96d9",
        camouflage: "\u6df1\u5c64\u507d\u88dd",
        decoys: "\u68f2\u5730\u8a2a\u5ba2",
        drift: "\u79fb\u52d5\u5de1\u904a",
        grand: "\u7d42\u6975\u63a2\u96aa\u6df7\u5408",
      },
      targets: {
        lion: "\u7345\u5b50",
        elephant: "\u5927\u8c61",
        giraffe: "\u9577\u9838\u9e7f",
        panda: "\u8c93\u718a",
        penguin: "\u4f01\u9d5d",
        koala: "\u7121\u5c3e\u718a",
        rabbit: "\u5154\u5b50",
        fox: "\u72d0\u72f8",
        frog: "\u9752\u86d9",
        owl: "\u8c93\u982d\u9df9",
      },
      habitat: {
        sunny: "\u967d\u5149\u8349\u539f",
        river: "\u6cb3\u908a\u68f2\u5730",
        sunset: "\u5915\u967d\u6a39\u6797",
        pond: "\u6c60\u5858\u89c0\u5bdf",
        jungle: "\u53e2\u6797\u908a\u7de3",
        lookout: "\u9060\u773a\u5c71\u4e18",
      },
    },
    es: {
      gameTitle: "Safari de Animales Ocultos", language: "Idioma", back: "Volver", stageList: "Lista de hábitats", backToHabitats: "Volver a los hábitats", hiddenAnimalScene: "Escena de animales ocultos",
      chooseStage: "Elegir hábitat", menuHint: "Encuentra los animales camuflados en cada hábitat natural.", stages: "Hábitats", loading: "Cargando", hint: "Pista", findList: "Busca estos",
      nextStage: "Siguiente hábitat", retry: "Intentar de nuevo", lobby: "Sala de juegos", locked: "Hábitat bloqueado", stage: "Hábitat {n}", great: "¡Gran hallazgo!", perfect: "¡Vista de safari excelente!", good: "¡Buena búsqueda!",
      result: "Encontraste {found}/{total} animales en {time}.", skillReport: "Informe de habilidades", focus: "Concentración", focusValue: "Encontrados {found} · Toques vacíos {mistakes}",
      animalKnowledge: "Conocimiento animal", animalValue: "{count} animales identificados", problemSolving: "Resolución de problemas", solveValue: "Sin pistas {unaided} · Pistas {hints}",
      firstFinish: "Primera victoria · {time}", newBest: "Nuevo récord {time} · Anterior {previous}", progress: "Esta vez {time} · Mejor {best}", best: "Mejor {time}", noHints: "No quedan pistas",
      hintTarget: "¡Busca {target}!", findFirst: "¡Encuentra primero {target}!", decoyTap: "Ese animal no está en esta lista.", decoyAnimal: "{target}, visitante del hábitat, no está en la lista", found: "¡Encontrado!", tryAgain: "Mira con atención", remaining: "Quedan {count}", checkpoint: "Punto de control del hábitat",
      rules: { open: "Búsqueda libre", order: "Orden del guardabosques", twins: "Parejas de animales", camouflage: "Camuflaje profundo", decoys: "Visitantes del hábitat", drift: "Patrulla móvil", grand: "Gran mezcla de safari" },
      targets: { lion: "León", elephant: "Elefante", giraffe: "Jirafa", panda: "Panda", penguin: "Pingüino", koala: "Koala", rabbit: "Conejo", fox: "Zorro", frog: "Rana", owl: "Búho" },
      habitat: { sunny: "Pradera soleada", river: "Cruce del río", sunset: "Árboles al atardecer", pond: "Vigilancia del estanque", jungle: "Borde de la selva", lookout: "Colina mirador" },
    },
  };

  const targetAssets = {
    lion: "../../assets/weightplay-boom-mane-lion.png",
    elephant: "../../assets/animal-zoo-elephant.png",
    giraffe: "../../assets/animal-zoo-idle-giraffe.png",
    panda: "../../assets/weightplay-character-drum-belly-panda-safe-face-cutout.webp",
    penguin: "../../assets/animal-zoo-penguin.png",
    koala: "../../assets/tiny-weather-animal-koala.png",
    rabbit: "../../assets/weightplay-character-rainbow-hop-mimi-clean-cutout.webp",
    fox: "../../assets/weightplay-character-spark-paw-fox-cutout.webp",
    frog: "../../assets/bubble-bakery-frog.png",
    owl: "../../assets/weightplay-character-moon-cap-owl-cutout.webp",
  };

  const coverAssets = {
    grass: "../../assets/safari-mask-grass.svg",
    leaf: "../../assets/safari-mask-leaf.svg",
    water: "../../assets/safari-mask-water.svg",
    dust: "../../assets/safari-mask-dust.svg",
  };

  const feedbackAssets = {
    hint: "../../assets/animal-hidden-safari-hint-ring.png",
    found: "../../assets/animal-hidden-safari-found-burst.png",
  };

  const stages = [
    { habitat: "sunny", rule: "open", targets: [["lion", 18, 67, 58], ["elephant", 48, 72, 54], ["giraffe", 79, 58, 58], ["panda", 65, 83, 44], ["koala", 30, 45, 42], ["owl", 52, 27, 36]] },
    { habitat: "sunny", rule: "open", targets: [["rabbit", 16, 37, 40], ["fox", 39, 76, 44], ["frog", 72, 83, 38], ["penguin", 84, 50, 46], ["lion", 58, 59, 52], ["owl", 34, 24, 36]] },
    { habitat: "sunny", rule: "open", targets: [["giraffe", 17, 55, 54], ["panda", 44, 82, 44], ["koala", 72, 42, 42], ["elephant", 82, 72, 52], ["rabbit", 54, 31, 38], ["frog", 29, 74, 38]] },
    { habitat: "sunny", rule: "open", targets: [["fox", 18, 80, 42], ["owl", 42, 33, 36], ["lion", 65, 67, 54], ["penguin", 84, 77, 44], ["koala", 72, 39, 40], ["rabbit", 28, 52, 38]] },
    { habitat: "sunny", rule: "open", checkpoint: true, targets: [["elephant", 15, 72, 54], ["giraffe", 36, 51, 56], ["lion", 62, 76, 56], ["panda", 84, 66, 46], ["frog", 74, 31, 38], ["owl", 26, 27, 36]] },

    { habitat: "river", theme: "river", rule: "order", ordered: true, targets: [["penguin", 18, 75, 48], ["frog", 42, 83, 38], ["elephant", 76, 70, 54], ["owl", 67, 31, 36], ["panda", 50, 56, 44], ["fox", 29, 57, 42]] },
    { habitat: "river", theme: "river", rule: "order", ordered: true, targets: [["rabbit", 17, 36, 38], ["koala", 38, 55, 42], ["penguin", 64, 79, 46], ["giraffe", 84, 53, 54], ["frog", 76, 35, 38], ["lion", 28, 77, 52]] },
    { habitat: "river", theme: "river", rule: "order", ordered: true, targets: [["owl", 16, 29, 36], ["elephant", 31, 73, 52], ["fox", 53, 54, 42], ["panda", 77, 69, 44], ["rabbit", 83, 34, 38], ["frog", 58, 84, 38]] },
    { habitat: "river", theme: "river", rule: "order", ordered: true, targets: [["giraffe", 18, 53, 54], ["koala", 40, 34, 40], ["lion", 58, 72, 52], ["penguin", 82, 78, 46], ["owl", 74, 27, 36], ["rabbit", 31, 82, 38]] },
    { habitat: "river", theme: "river", rule: "order", ordered: true, checkpoint: true, targets: [["frog", 15, 82, 38], ["fox", 31, 58, 42], ["panda", 52, 76, 44], ["elephant", 78, 70, 54], ["owl", 69, 29, 36], ["penguin", 43, 35, 46]] },

    { habitat: "sunset", theme: "sunset", rule: "twins", twins: true, targets: [["fox", 17, 79, 40], ["fox", 70, 69, 40], ["rabbit", 32, 36, 38], ["rabbit", 83, 42, 38], ["owl", 45, 27, 36], ["owl", 58, 53, 36]] },
    { habitat: "sunset", theme: "sunset", rule: "twins", twins: true, targets: [["lion", 17, 69, 50], ["lion", 67, 78, 50], ["koala", 34, 43, 40], ["koala", 81, 36, 40], ["frog", 45, 83, 38], ["frog", 59, 30, 38]] },
    { habitat: "sunset", theme: "sunset", rule: "twins", twins: true, targets: [["panda", 15, 78, 42], ["panda", 61, 64, 42], ["penguin", 33, 53, 44], ["penguin", 82, 74, 44], ["giraffe", 48, 42, 52], ["giraffe", 78, 36, 52]] },
    { habitat: "sunset", theme: "sunset", rule: "twins", twins: true, targets: [["elephant", 18, 74, 50], ["elephant", 70, 72, 50], ["fox", 35, 57, 40], ["fox", 83, 42, 40], ["rabbit", 48, 31, 38], ["rabbit", 55, 84, 38]] },
    { habitat: "sunset", theme: "sunset", rule: "twins", twins: true, ordered: true, checkpoint: true, targets: [["owl", 16, 30, 36], ["owl", 74, 29, 36], ["lion", 31, 73, 50], ["lion", 82, 69, 50], ["koala", 47, 49, 40], ["koala", 58, 83, 40]] },

    { habitat: "pond", theme: "pond", rule: "camouflage", camouflage: true, targets: [["frog", 16, 77, 38], ["penguin", 45, 75, 44], ["panda", 79, 68, 42], ["owl", 83, 29, 36], ["rabbit", 34, 83, 38], ["koala", 57, 52, 40]] },
    { habitat: "pond", theme: "pond", rule: "camouflage", camouflage: true, targets: [["elephant", 17, 70, 50], ["fox", 38, 53, 40], ["frog", 61, 82, 38], ["giraffe", 82, 49, 52], ["owl", 69, 27, 36], ["rabbit", 31, 32, 38]] },
    { habitat: "pond", theme: "pond", rule: "camouflage", camouflage: true, targets: [["koala", 15, 42, 40], ["panda", 31, 76, 42], ["penguin", 55, 68, 44], ["lion", 80, 76, 50], ["frog", 75, 34, 38], ["owl", 45, 27, 36]] },
    { habitat: "pond", theme: "pond", rule: "camouflage", camouflage: true, ordered: true, targets: [["rabbit", 18, 83, 38], ["frog", 39, 75, 38], ["fox", 58, 52, 40], ["elephant", 80, 69, 50], ["owl", 71, 28, 36], ["panda", 31, 39, 42]] },
    { habitat: "pond", theme: "pond", rule: "camouflage", camouflage: true, twins: true, ordered: true, checkpoint: true, targets: [["frog", 16, 80, 38], ["frog", 70, 77, 38], ["penguin", 34, 66, 44], ["penguin", 83, 54, 44], ["koala", 48, 38, 40], ["koala", 70, 29, 40]] },

    { habitat: "jungle", theme: "jungle", rule: "decoys", decoys: [["rabbit", 82, 38, 38], ["penguin", 47, 29, 42]], targets: [["koala", 17, 43, 40], ["owl", 33, 29, 36], ["panda", 70, 75, 44], ["lion", 42, 72, 50], ["fox", 27, 84, 40], ["frog", 83, 81, 38]] },
    { habitat: "jungle", theme: "jungle", rule: "decoys", decoys: [["lion", 75, 75, 46], ["frog", 39, 82, 36]], targets: [["elephant", 16, 70, 50], ["giraffe", 36, 48, 52], ["rabbit", 57, 31, 38], ["fox", 82, 43, 40], ["koala", 63, 68, 40], ["owl", 26, 27, 36]] },
    { habitat: "jungle", theme: "jungle", rule: "decoys", decoys: [["panda", 18, 78, 40], ["owl", 72, 28, 34]], targets: [["lion", 17, 65, 50], ["penguin", 36, 82, 44], ["frog", 57, 73, 38], ["rabbit", 82, 36, 38], ["fox", 75, 80, 40], ["koala", 43, 39, 40]] },
    { habitat: "jungle", theme: "jungle", rule: "decoys", ordered: true, decoys: [["elephant", 80, 68, 46], ["fox", 31, 80, 38]], targets: [["owl", 16, 30, 36], ["rabbit", 35, 39, 38], ["giraffe", 54, 53, 52], ["panda", 75, 77, 42], ["frog", 83, 34, 38], ["lion", 30, 67, 50]] },
    { habitat: "jungle", theme: "jungle", rule: "decoys", ordered: true, camouflage: true, checkpoint: true, decoys: [["koala", 18, 42, 38], ["penguin", 81, 78, 40], ["rabbit", 68, 31, 36]], targets: [["fox", 16, 81, 40], ["owl", 34, 28, 36], ["panda", 48, 71, 42], ["elephant", 77, 68, 50], ["frog", 70, 82, 38], ["lion", 54, 43, 50]] },

    { habitat: "lookout", theme: "lookout", rule: "drift", drift: true, targets: [["lion", 17, 69, 50], ["elephant", 43, 74, 50], ["giraffe", 79, 52, 52], ["panda", 67, 83, 42], ["frog", 30, 83, 38], ["owl", 52, 28, 36]] },
    { habitat: "lookout", theme: "lookout", rule: "drift", drift: true, ordered: true, targets: [["rabbit", 16, 35, 38], ["fox", 34, 77, 40], ["koala", 55, 48, 40], ["penguin", 80, 76, 44], ["owl", 72, 28, 36], ["lion", 27, 59, 50]] },
    { habitat: "lookout", theme: "lookout", rule: "drift", drift: true, twins: true, targets: [["panda", 17, 76, 42], ["panda", 70, 69, 42], ["fox", 35, 59, 40], ["fox", 82, 38, 40], ["owl", 48, 27, 36], ["owl", 57, 83, 36]] },
    { habitat: "lookout", theme: "lookout", rule: "drift", drift: true, camouflage: true, decoys: [["lion", 80, 72, 46], ["rabbit", 34, 36, 36]], targets: [["elephant", 16, 70, 50], ["giraffe", 38, 48, 52], ["frog", 57, 82, 38], ["penguin", 82, 46, 44], ["koala", 68, 29, 40], ["panda", 31, 80, 42]] },
    { habitat: "lookout", theme: "lookout", rule: "grand", drift: true, camouflage: true, ordered: true, twins: true, checkpoint: true, decoys: [["elephant", 15, 70, 46], ["rabbit", 83, 36, 36], ["penguin", 52, 79, 40]], targets: [["lion", 17, 61, 48], ["lion", 73, 71, 48], ["fox", 31, 82, 38], ["fox", 78, 48, 38], ["owl", 39, 28, 34], ["owl", 62, 31, 34]] },
  ];

  const $ = (id) => document.getElementById(id);
  const nodes = {
    localeSelect: $("localeSelect"),
    mainPanel: $("mainPanel"),
    startGameBtn: $("startGameBtn"),
    stageBackMainBtn: $("stageBackMainBtn"),
    menuPanel: $("menuPanel"),
    stageGrid: $("stageGrid"),
    playPanel: $("playPanel"),
    backToStagesBtn: $("backToStagesBtn"),
    stageText: $("stageText"),
    progressFill: $("progressFill"),
    hintBtn: $("hintBtn"),
    hintCount: $("hintCount"),
    hintStatus: $("hintStatus"),
    scene: $("scene"),
    targetsLayer: $("targetsLayer"),
    floatLayer: $("floatLayer"),
    targetList: $("targetList"),
    timerText: $("timerText"),
    remainingText: $("remainingText"),
    resultPanel: $("resultPanel"),
    resultTitle: $("resultTitle"),
    starText: $("starText"),
    resultText: $("resultText"),
    skillReportTitle: $("skillReportTitle"),
    focusLabel: $("focusLabel"),
    focusValue: $("focusValue"),
    animalLabel: $("animalLabel"),
    animalValue: $("animalValue"),
    solveLabel: $("solveLabel"),
    solveValue: $("solveValue"),
    progressComparison: $("progressComparison"),
    nextStageBtn: $("nextStageBtn"),
    retryBtn: $("retryBtn"),
    resultStagesBtn: $("resultStagesBtn"),
    loadingPanel: $("loadingPanel"),
    loadingText: $("loadingText"),
    loadingFill: $("loadingFill"),
  };

  const legacySavedLocale = localStorage.getItem(localeKey);
  const canonicalSavedLocale = localStorage.getItem(canonicalLocaleKey);
  if (!canonicalSavedLocale && ["en", "zh-Hant", "zh-Hans", "es"].includes(legacySavedLocale)) {
    window.WonderI18n?.setLocale?.(legacySavedLocale);
  }
  let locale = window.WonderI18n?.locale?.() || canonicalSavedLocale || legacySavedLocale || "en";
  let unlocked = clamp(Number(localStorage.getItem(unlockKey)) || 1, 1, stages.length);
  let stars = readJson(starKey, {});
  let currentStage = 0;
  let found = new Set();
  let hintsLeft = 2;
  let mistakes = 0;
  let hintedTargets = new Set();
  let lastResult = null;
  let startTime = 0;
  let timerId = 0;
  let hiddenStartedAt = 0;
  let acceptingInput = false;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function t(key, data = {}) {
    const parts = key.split(".");
    let value = text[locale] || text.en;
    for (const part of parts) value = value?.[part];
    if (typeof value !== "string") value = key;
    return Object.entries(data).reduce((out, [name, item]) => out.replaceAll(`{${name}}`, String(item)), value);
  }

  function animalImg(id, className = "") {
    return `<img class="${className}" src="${targetAssets[id]}" alt="" loading="lazy" draggable="false" />`;
  }

  function coverImg(type) {
    return `<img class="target-cover target-cover-${type}" src="${coverAssets[type]}" alt="" loading="lazy" draggable="false" />`;
  }

  function coverForTarget(stage, y) {
    if ((stage.theme === "river" || stage.theme === "pond") && y >= 62) return "water";
    if ((stage.theme === "jungle" || stage.theme === "sunset") && y <= 55) return "leaf";
    if (stage.theme === "lookout" && y >= 60) return "dust";
    return "grass";
  }

  function playSound(name) {
    window.WonderSound?.play?.(name);
  }

  function track(event, payload = {}) {
    window.WonderAnalytics?.track?.(event, { game_id: GAME_ID, ...payload });
  }

  function localizeStatic() {
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : locale === "es" ? "es" : "en";
    document.title = `${t("gameTitle")} - WeightPlay`;
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
    document.querySelectorAll("[data-aria]").forEach((node) => {
      node.setAttribute("aria-label", t(node.dataset.aria));
    });
    nodes.localeSelect.value = locale;
  }

  function starIcons(count, total) {
    return `${"\u2605".repeat(count)}${"\u2606".repeat(total - count)}`;
  }

  function starsFor(stageNo) {
    return starIcons(stars[stageNo]?.stars || 0, 3);
  }

  function bestLine(stageNo) {
    const best = stars[stageNo]?.bestTime;
    return best ? ` / ${t("best", { time: formatTime(best) })}` : "";
  }

  function stageRuleLabel(stage) {
    return t(`rules.${stage.rule || "open"}`);
  }

  function nextRequiredTargetIndex() {
    return stages[currentStage].targets.findIndex((_, index) => !found.has(index));
  }

  function renderStageGrid() {
    nodes.stageGrid.innerHTML = "";
    stages.forEach((stage, index) => {
      const stageNo = index + 1;
      const button = document.createElement("button");
      button.className = "stage-card";
      button.type = "button";
      button.dataset.stageIndex = String(index);
      if (stageNo > unlocked) button.classList.add("locked");
      button.innerHTML = `
        <b>${animalImg(stage.targets[0][0], "stage-animal")}</b>
        <strong>${t("stage", { n: stageNo })} - ${t(`habitat.${stage.habitat}`)}</strong>
        <em>${stageRuleLabel(stage)}${stage.checkpoint ? ` · ${t("checkpoint")}` : ""}</em>
        <span>${starsFor(stageNo)}${bestLine(stageNo)}</span>
      `;
      button.addEventListener("click", () => {
        if (nodes.stageGrid.dataset.draggingClick === "1") return;
        if (stageNo > unlocked) {
          showFloatingText(t("locked"), 50, 50);
          playSound("click");
          return;
        }
        startStage(index);
      });
      nodes.stageGrid.appendChild(button);
    });
  }

  function rejectRepeatedScreenActivation(event) {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  function focusStageCard(index = Math.max(0, Math.min(stages.length - 1, unlocked - 1))) {
    const card = nodes.stageGrid.querySelector(`[data-stage-index="${index}"]`)
      || nodes.stageGrid.querySelector(".stage-card:not(.locked)");
    card?.focus({ preventScroll: true });
    card?.scrollIntoView({ block: "nearest", inline: "center" });
  }

  function showMenu(focusIndex) {
    stopTimer();
    hiddenStartedAt = 0;
    acceptingInput = false;
    nodes.resultPanel.classList.add("hidden");
    nodes.playPanel.inert = false;
    nodes.playPanel.removeAttribute("aria-hidden");
    nodes.playPanel.classList.add("hidden");
    nodes.menuPanel.classList.remove("hidden");
    nodes.mainPanel.classList.add("hidden");
    document.body.classList.remove("safari-playing", "safari-result");
    document.documentElement.classList.add("safari-stage");
    document.body.classList.add("safari-stage");
    renderStageGrid();
    updateSafariFrame();
    requestAnimationFrame(() => focusStageCard(focusIndex));
  }

  function showMain() {
    stopTimer();
    hiddenStartedAt = 0;
    acceptingInput = false;
    nodes.mainPanel.classList.remove("hidden");
    nodes.menuPanel.classList.add("hidden");
    nodes.playPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    document.documentElement.classList.remove("safari-stage");
    document.body.classList.remove("safari-stage", "safari-playing", "safari-result");
    nodes.startGameBtn.focus({ preventScroll: true });
  }

  function startStage(index) {
    currentStage = index;
    found = new Set();
    hintsLeft = 2;
    mistakes = 0;
    hintedTargets = new Set();
    nodes.hintStatus.textContent = "";
    nodes.floatLayer.replaceChildren();
    lastResult = null;
    startTime = Date.now();
    hiddenStartedAt = 0;
    acceptingInput = true;
    nodes.resultPanel.classList.add("hidden");
    nodes.playPanel.inert = false;
    nodes.playPanel.removeAttribute("aria-hidden");
    document.body.classList.remove("safari-result");
    nodes.menuPanel.classList.add("hidden");
    nodes.playPanel.classList.remove("hidden");
    document.body.classList.add("safari-playing");
    document.documentElement.classList.remove("safari-stage");
    document.body.classList.remove("safari-stage");
    nodes.scene.dataset.theme = stages[index].theme || "sunny";
    nodes.scene.classList.toggle("is-camouflage", Boolean(stages[index].camouflage));
    nodes.scene.classList.toggle("is-drift", Boolean(stages[index].drift));
    nodes.scene.classList.toggle("is-ordered", Boolean(stages[index].ordered));
    renderScene();
    renderTargetList();
    updateHud();
    updateSafariFrame();
    startTimer();
    requestAnimationFrame(() => nodes.targetsLayer.querySelector(".target[data-index]:not(:disabled)")?.focus({ preventScroll: true }));
    track("game_start", { level: index + 1 });
    playSound("start");
    window.WeightPlayGame?.exitMobileGameMode?.();
    document.body.classList.remove("wp-mobile-game-mode", "weightplay-active-viewport");
    document.querySelector(".safari-game")?.classList.remove("weightplay-active-viewport");
  }

  function updateSafariFrame() {
    const isStage = document.body.classList.contains("safari-stage");
    if (!isStage && !document.body.classList.contains("safari-playing")) return;
    const viewport = window.visualViewport;
    const viewportWidth = viewport?.width || window.innerWidth;
    const viewportHeight = viewport?.height || window.innerHeight;
    const root = document.documentElement.style;
    const logicalWidth = 390;
    const logicalHeight = isStage ? 788 : logicalWidth * 16 / 9;
    const scale = Math.min((viewportWidth - 8) / logicalWidth, (viewportHeight - 8) / logicalHeight);
    const frameWidth = logicalWidth * scale;
    const frameHeight = logicalHeight * scale;
    root.setProperty("--safari-frame-left", `${(viewportWidth - frameWidth) / 2}px`);
    root.setProperty("--safari-frame-top", `${viewportHeight - frameHeight - 4}px`);
    root.setProperty("--safari-frame-width", `${frameWidth}px`);
    root.setProperty("--safari-frame-height", `${frameHeight}px`);
    root.setProperty("--safari-frame-scale", String(scale));
  }

  window.addEventListener("resize", updateSafariFrame);
  window.addEventListener("orientationchange", updateSafariFrame);
  window.visualViewport?.addEventListener("resize", updateSafariFrame);
  window.visualViewport?.addEventListener("scroll", updateSafariFrame);

  function renderScene() {
    nodes.targetsLayer.innerHTML = "";
    const stage = stages[currentStage];
    stage.targets.forEach(([id, x, y, size], index) => {
      const cover = coverForTarget(stage, y);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "target";
      button.dataset.index = String(index);
      button.dataset.id = id;
      button.style.setProperty("--drift-delay", `${-index * 0.43}s`);
      button.style.left = `${x}%`;
      button.style.top = `${y}%`;
      button.style.setProperty("--size", `${size}px`);
      button.setAttribute("aria-label", t(`targets.${id}`));
      button.innerHTML = `<span class="target-hit-area" aria-hidden="true"></span>${animalImg(id, "target-animal")}${coverImg(cover)}<img class="hint-feedback" src="${feedbackAssets.hint}" alt="" draggable="false" />`;
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        chooseTarget(index, button);
      });
      nodes.targetsLayer.appendChild(button);
    });
    (stage.decoys || []).forEach(([id, x, y, size], index) => {
      const cover = coverForTarget(stage, y);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "target is-decoy";
      button.dataset.id = id;
      button.style.left = `${x}%`;
      button.style.top = `${y}%`;
      button.style.setProperty("--size", `${size}px`);
      button.style.setProperty("--drift-delay", `${-(index + stage.targets.length) * 0.43}s`);
      button.setAttribute("aria-label", t("decoyAnimal", { target: t(`targets.${id}`) }));
      button.innerHTML = `<span class="target-hit-area" aria-hidden="true"></span>${animalImg(id, "target-animal")}${coverImg(cover)}`;
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        if (!acceptingInput || button.disabled) return;
        mistakes += 1;
        button.disabled = true;
        button.tabIndex = -1;
        button.classList.add("found");
        showFloatingText(t("decoyTap"), x, y);
        playSound("error");
      });
      nodes.targetsLayer.appendChild(button);
    });
    updateOrderedTargets();
    nodes.scene.onclick = (event) => {
      if (!acceptingInput || event.target.closest?.(".target")) return;
      mistakes += 1;
      const rect = nodes.scene.getBoundingClientRect();
      showFloatingText(t("tryAgain"), ((event.clientX - rect.left) / rect.width) * 100, ((event.clientY - rect.top) / rect.height) * 100);
      playSound("error");
    };
  }

  function renderTargetList() {
    nodes.targetList.innerHTML = "";
    const stage = stages[currentStage];
    const requiredIndex = stage.ordered ? nextRequiredTargetIndex() : -1;
    stage.targets.forEach(([id], index) => {
      const chip = document.createElement("div");
      chip.className = `target-chip ${found.has(index) ? "done" : ""}${index === requiredIndex ? " is-current" : ""}`;
      if (index === requiredIndex) chip.setAttribute("aria-current", "step");
      chip.innerHTML = `<b>${animalImg(id, "chip-animal")}</b><span>${t(`targets.${id}`)}</span>`;
      nodes.targetList.appendChild(chip);
    });
  }

  function updateOrderedTargets() {
    const stage = stages[currentStage];
    const requiredIndex = stage.ordered ? nextRequiredTargetIndex() : -1;
    nodes.targetsLayer.querySelectorAll(".target[data-index]").forEach((button) => {
      const index = Number(button.dataset.index);
      button.classList.toggle("is-current", index === requiredIndex);
      button.classList.toggle("is-waiting", stage.ordered && !found.has(index) && index !== requiredIndex);
    });
  }

  function chooseTarget(index, button) {
    if (!acceptingInput || found.has(index)) return;
    const stage = stages[currentStage];
    if (stage.ordered && index !== nextRequiredTargetIndex()) {
      mistakes += 1;
      const requiredId = stage.targets[nextRequiredTargetIndex()]?.[0];
      showFloatingText(t("findFirst", { target: t(`targets.${requiredId}`) }), Number.parseFloat(button.style.left), Number.parseFloat(button.style.top));
      button.classList.add("wrong-order");
      window.setTimeout(() => button.classList.remove("wrong-order"), 360);
      playSound("error");
      return;
    }
    found.add(index);
    button.classList.remove("hint");
    button.classList.add("found");
    button.disabled = true;
    button.tabIndex = -1;
    button.setAttribute("aria-hidden", "true");
    showImageEffect("found", Number.parseFloat(button.style.left), Number.parseFloat(button.style.top), button.offsetWidth);
    showFloatingText(t("found"), Number.parseFloat(button.style.left), Number.parseFloat(button.style.top));
    playSound("coin");
    renderTargetList();
    updateOrderedTargets();
    updateHud();
    if (found.size >= stages[currentStage].targets.length) {
      finishStage();
    } else {
      setTimeout(() => nodes.targetsLayer.querySelector(".target[data-index]:not(:disabled)")?.focus({ preventScroll: true }), 0);
    }
  }

  function useHint() {
    if (!acceptingInput) return;
    if (hintsLeft <= 0) {
      showFloatingText(t("noHints"), 50, 18);
      playSound("error");
      return;
    }
    const targets = stages[currentStage].targets;
    let next = targets.findIndex((_, index) => !found.has(index) && !hintedTargets.has(index));
    if (next < 0) next = targets.findIndex((_, index) => !found.has(index));
    if (next < 0) return;
    hintsLeft -= 1;
    hintedTargets.add(next);
    nodes.hintCount.textContent = hintsLeft;
    nodes.hintBtn.disabled = hintsLeft <= 0;
    document.querySelectorAll(".target.hint").forEach((item) => item.classList.remove("hint"));
    document.querySelector(`.target[data-index="${next}"]`)?.classList.add("hint");
    const [targetId, x, y] = targets[next];
    const hintMessage = t("hintTarget", { target: t(`targets.${targetId}`) });
    nodes.hintStatus.textContent = hintMessage;
    showFloatingText(hintMessage, x, y, true);
    track("hint_used", { level: currentStage + 1 });
    playSound("select");
  }

  function updateHud() {
    const stage = stages[currentStage];
    nodes.stageText.textContent = `${t("stage", { n: currentStage + 1 })} · ${stageRuleLabel(stage)}`;
    nodes.progressFill.style.width = `${(found.size / stage.targets.length) * 100}%`;
    nodes.remainingText.textContent = t("remaining", { count: Math.max(0, stage.targets.length - found.size) });
    nodes.hintCount.textContent = hintsLeft;
    nodes.hintBtn.disabled = hintsLeft <= 0;
  }

  function startTimer() {
    stopTimer();
    updateTimer();
    timerId = window.setInterval(updateTimer, 500);
  }

  function stopTimer() {
    if (timerId) window.clearInterval(timerId);
    timerId = 0;
  }

  function pauseSearchTimer() {
    if (hiddenStartedAt || !acceptingInput || !document.body.classList.contains("safari-playing")) return;
    hiddenStartedAt = Date.now();
    stopTimer();
  }

  function resumeSearchTimer() {
    if (!hiddenStartedAt) return;
    if (acceptingInput && document.body.classList.contains("safari-playing") && !document.body.classList.contains("safari-result")) {
      startTime += Date.now() - hiddenStartedAt;
      hiddenStartedAt = 0;
      startTimer();
      return;
    }
    hiddenStartedAt = 0;
  }

  function elapsedSeconds() {
    return Math.max(0, Math.floor((Date.now() - startTime) / 1000));
  }

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  }

  function updateTimer() {
    nodes.timerText.textContent = formatTime(elapsedSeconds());
  }

  function finishStage() {
    acceptingInput = false;
    stopTimer();
    hiddenStartedAt = 0;
    const seconds = elapsedSeconds();
    const total = stages[currentStage].targets.length;
    const starCount = mistakes === 0 && hintsLeft === 2 ? 3 : mistakes <= 2 && hintsLeft >= 1 ? 2 : 1;
    const stageNo = currentStage + 1;
    const previous = stars[stageNo] || {};
    const previousBestTime = previous.bestTime || 0;
    stars[stageNo] = {
      stars: Math.max(previous.stars || 0, starCount),
      bestTime: previous.bestTime ? Math.min(previous.bestTime, seconds) : seconds,
    };
    writeJson(starKey, stars);
    if (unlocked < stages.length && stageNo >= unlocked) {
      unlocked += 1;
      localStorage.setItem(unlockKey, String(unlocked));
    }
    const hintsUsed = 2 - hintsLeft;
    lastResult = { starCount, seconds, total, previousBestTime, hintsUsed, unaided: total - hintedTargets.size, mistakes };
    saveProgress(starCount, seconds, hintsUsed);
    renderResult();
    nodes.nextStageBtn.classList.toggle("hidden", currentStage >= stages.length - 1);
    nodes.resultPanel.classList.remove("hidden");
    nodes.playPanel.inert = true;
    nodes.playPanel.setAttribute("aria-hidden", "true");
    document.body.classList.add("safari-result");
    requestAnimationFrame(() => {
      const primaryAction = nodes.nextStageBtn.classList.contains("hidden") ? nodes.retryBtn : nodes.nextStageBtn;
      primaryAction.focus({ preventScroll: true });
    });
    track("game_complete", { level: stageNo, score: starCount * 100 - mistakes * 5, time_seconds: seconds });
    playSound("success");
  }

  function renderResult() {
    if (!lastResult) return;
    const { starCount, seconds, total, previousBestTime, hintsUsed, unaided, mistakes: emptyTaps } = lastResult;
    nodes.resultTitle.textContent = starCount >= 3 ? t("perfect") : starCount >= 2 ? t("good") : t("great");
    nodes.starText.textContent = starIcons(starCount, 3);
    nodes.resultText.textContent = t("result", { found: total, total, time: formatTime(seconds) });
    nodes.skillReportTitle.textContent = t("skillReport");
    nodes.focusLabel.textContent = t("focus");
    nodes.focusValue.textContent = t("focusValue", { found: total, mistakes: emptyTaps });
    nodes.animalLabel.textContent = t("animalKnowledge");
    nodes.animalValue.textContent = t("animalValue", { count: total });
    nodes.solveLabel.textContent = t("problemSolving");
    nodes.solveValue.textContent = t("solveValue", { unaided, hints: hintsUsed });
    nodes.progressComparison.textContent = previousBestTime === 0
      ? t("firstFinish", { time: formatTime(seconds) })
      : t(seconds < previousBestTime ? "newBest" : "progress", {
          time: formatTime(seconds),
          previous: formatTime(previousBestTime),
          best: formatTime(Math.min(previousBestTime, seconds)),
        });
  }

  function visibleResultActions() {
    return [...nodes.resultPanel.querySelectorAll("button, a[href]")].filter((action) => {
      if (action.disabled || action.classList.contains("hidden")) return false;
      const style = getComputedStyle(action);
      return style.display !== "none" && style.visibility !== "hidden";
    });
  }

  function saveProgress(starCount, seconds, hintsUsed) {
    const old = readJson(progressKey, { bestScore: 0, playCount: 0 });
    const score = Math.max(0, starCount * 100 - mistakes * 5 + Math.max(0, 120 - seconds));
    const previousBest = old.bestScore || 0;
    writeJson(progressKey, {
      lastScore: score,
      bestScore: Math.max(previousBest, score),
      playCount: (old.playCount || 0) + 1,
      lastPlayedAt: new Date().toISOString(),
      improvementPercent: previousBest ? Math.round(((score - previousBest) / previousBest) * 100) : 0,
      skillScores: {
        Focus: clamp(5 - mistakes, 1, 5),
        "Animal Knowledge": 5,
        "Problem Solving": clamp(5 - hintsUsed, 1, 5),
      },
    });
  }

  function showFloatingText(message, x, y, hideFromAssistive = false) {
    const node = document.createElement("div");
    node.className = "float-text";
    node.textContent = message;
    if (hideFromAssistive) node.setAttribute("aria-hidden", "true");
    node.style.left = `${x}%`;
    node.style.top = `${y}%`;
    nodes.floatLayer.appendChild(node);
    window.setTimeout(() => node.remove(), 950);
  }

  function showImageEffect(type, x, y, targetSize = 56) {
    const node = document.createElement("img");
    node.className = `image-feedback image-feedback-${type}`;
    node.src = feedbackAssets[type];
    node.alt = "";
    node.draggable = false;
    node.style.left = `${x}%`;
    node.style.top = `${y}%`;
    node.style.setProperty("--feedback-size", `${Math.max(92, targetSize * 2.1)}px`);
    nodes.floatLayer.appendChild(node);
    window.setTimeout(() => node.remove(), 760);
  }

  function preloadGameAssets() {
    const urls = [
      "../../assets/animal-hidden-safari-cover.webp",
      "../../assets/animal-hidden-safari-sunny-bg.webp",
      ...new Set(Object.values(targetAssets)),
      ...new Set(Object.values(coverAssets)),
      ...new Set(Object.values(feedbackAssets)),
    ];
    const laterScenes = [
      "../../assets/animal-hidden-safari-river-bg.webp",
      "../../assets/animal-hidden-safari-pond-bg.webp",
      "../../assets/animal-hidden-safari-sunset-bg.webp",
      "../../assets/animal-hidden-safari-jungle-bg.webp",
      "../../assets/animal-hidden-safari-lookout-bg.webp",
    ];
    let done = 0;
    const update = () => {
      const pct = Math.round((done / urls.length) * 100);
      nodes.loadingText.textContent = `${pct}%`;
      nodes.loadingFill.style.width = `${pct}%`;
      if (done >= urls.length) window.setTimeout(() => nodes.loadingPanel.classList.add("hidden"), 180);
    };
    urls.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        done += 1;
        update();
      };
      img.src = src;
    });
    window.setTimeout(() => laterScenes.forEach((src) => {
      const image = new Image();
      image.src = src;
    }), 0);
    update();
  }

  function scheduleAssetPreload() {
    const run = () => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(preloadGameAssets, { timeout: 1400 });
      } else {
        window.setTimeout(preloadGameAssets, 250);
      }
    };
    window.setTimeout(() => nodes.loadingPanel.classList.add("hidden"), 2600);
    if (document.readyState === "complete") run();
    else window.addEventListener("load", run, { once: true });
  }

  function bind() {
    nodes.localeSelect.addEventListener("change", () => {
      const requested = nodes.localeSelect.value;
      window.WonderI18n?.setLocale?.(requested);
      locale = window.WonderI18n?.locale?.() || requested;
      localStorage.setItem(localeKey, requested);
      localizeStatic();
      renderStageGrid();
      if (!nodes.resultPanel.classList.contains("hidden")) {
        renderResult();
      } else if (!nodes.playPanel.classList.contains("hidden")) {
        renderTargetList();
        updateHud();
      }
      window.dispatchEvent(new CustomEvent("wonder:locale-change", { detail: { locale } }));
    });
    nodes.startGameBtn.addEventListener("keydown", rejectRepeatedScreenActivation, true);
    nodes.stageGrid.addEventListener("keydown", rejectRepeatedScreenActivation, true);
    nodes.backToStagesBtn.addEventListener("click", () => showMenu(currentStage));
    nodes.startGameBtn.addEventListener("click", () => showMenu());
    nodes.stageBackMainBtn.addEventListener("click", showMain);
    nodes.resultStagesBtn.addEventListener("click", () => showMenu(currentStage));
    nodes.retryBtn.addEventListener("click", () => startStage(currentStage));
    nodes.nextStageBtn.addEventListener("click", () => startStage(Math.min(stages.length - 1, currentStage + 1)));
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
    nodes.hintBtn.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
      }
    });
    nodes.hintBtn.addEventListener("click", useHint);
    window.addEventListener("pagehide", pauseSearchTimer);
    window.addEventListener("pageshow", resumeSearchTimer);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) pauseSearchTimer();
      else resumeSearchTimer();
    });
  }

  function installSmokeApi() {
    if (new URLSearchParams(window.location.search).get("smoke") !== "1") return;
    window.__animalHiddenSafariSmoke = {
      stages: stages.map((stage, index) => ({
        id: index + 1,
        habitat: stage.habitat,
        theme: stage.theme || "sunny",
        rule: stage.rule || "open",
        ordered: Boolean(stage.ordered),
        twins: Boolean(stage.twins),
        camouflage: Boolean(stage.camouflage),
        drift: Boolean(stage.drift),
        checkpoint: Boolean(stage.checkpoint),
        targets: stage.targets.map((target) => [...target]),
        decoys: (stage.decoys || []).map((target) => [...target]),
      })),
      unlockAll: () => {
        unlocked = stages.length;
        localStorage.setItem(unlockKey, String(unlocked));
        showMenu();
      },
      startStage: (stageNo) => startStage(clamp(Number(stageNo) || 1, 1, stages.length) - 1),
      refreshTimer: () => {
        updateTimer();
        return elapsedSeconds();
      },
      state: () => ({
        stage: currentStage + 1,
        found: [...found],
        hintsLeft,
        mistakes,
        acceptingInput,
        unlocked,
      }),
    };
  }

  localizeStatic();
  bind();
  installSmokeApi();
  showMain();
  scheduleAssetPreload();
})();
