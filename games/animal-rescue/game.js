(() => {
const boot = () => {
const canonicalLocaleKey = "weightPlayLocale";
const legacyLocaleKey = "weightplayLocale";
const storageFallback = new Map();
const supportedLocales = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru"];
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
};

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
  const serialized = String(value);
  storageFallback.set(key, serialized);
  try {
    localStorage.setItem(key, serialized);
    return true;
  } catch {
    return false;
  }
}

const canonicalSavedLocale = storageRead(canonicalLocaleKey);
const legacySavedLocale = storageRead(legacyLocaleKey);
if (!canonicalSavedLocale && supportedLocales.includes(legacySavedLocale)) {
  storageWrite(canonicalLocaleKey, legacySavedLocale);
  window.WonderI18n?.setLocale?.(legacySavedLocale);
}

if (!document.querySelector("#leavePanel")) {
  const panel = document.createElement("section");
  panel.id = "leavePanel";
  panel.className = "result-panel hidden";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-labelledby", "leaveTitle");
  panel.setAttribute("aria-describedby", "leaveText");
  panel.innerHTML = '<div class="result-card leave-card"><strong id="leaveTitle">Leave this trail?</strong><span id="leaveText">Your current route will be reset.</span><button id="keepPlayingBtn" type="button">Keep playing</button><button id="leaveTrailBtn" type="button">Leave trail</button></div>';
  document.querySelector("#playArea")?.append(panel);
}

const localeSelect = document.querySelector("#localeSelect");
const homeLink = document.querySelector("#homeLink");
const languageLabel = document.querySelector("#languageLabel");
const titleText = document.querySelector("#titleText");
const hud = document.querySelector("#hud");
const stageLabel = document.querySelector("#stageLabel");
const moveLabel = document.querySelector("#moveLabel");
const fruitLabel = document.querySelector("#fruitLabel");
const stageText = document.querySelector("#stageText");
const moveText = document.querySelector("#moveText");
const fruitText = document.querySelector("#fruitText");
const stageSelect = document.querySelector("#stageSelect");
const mainPanel = document.querySelector("#mainPanel");
const mainTitle = document.querySelector("#mainTitle");
const mainIntro = document.querySelector("#mainIntro");
const showStageBtn = document.querySelector("#showStageBtn");
const mainPreview = document.createElement("div");
mainPreview.className = "rescue-main-preview";
mainPreview.setAttribute("aria-hidden", "true");
mainPreview.innerHTML = `
  <img src="../../assets/weightplay-character-boom-mane-lion-cutout.webp" alt="" draggable="false" />
  <span>→</span>
  <img src="../../assets/animal-vine-fruit-apple.png" alt="" draggable="false" />
  <span>→</span>
  <img src="../../assets/tiny-weather-tool-house.svg" alt="" draggable="false" />
`;
mainPanel.insertBefore(mainPreview, showStageBtn);
const stageBackBtn = document.querySelector("#stageBackBtn");
const battleBackBtn = document.querySelector("#battleBackBtn");
const stageSelectTitle = document.querySelector("#stageSelectTitle");
const stageSetupText = document.querySelector("#stageSetupText");
const stageGrid = document.querySelector("#stageGrid");
const playArea = document.querySelector("#playArea");
const animalAvatar = document.querySelector("#animalAvatar");
const animalName = document.querySelector("#animalName");
const hintText = document.querySelector("#hintText");
hintText.setAttribute("role", "status");
hintText.setAttribute("aria-live", "polite");
hintText.setAttribute("aria-atomic", "true");
const board = document.querySelector("#board");
const undoBtn = document.querySelector("#undoBtn");
const resetBtn = document.querySelector("#resetBtn");
const leavePanel = document.querySelector("#leavePanel");
const leaveTitle = document.querySelector("#leaveTitle");
const leaveText = document.querySelector("#leaveText");
const keepPlayingBtn = document.querySelector("#keepPlayingBtn");
const leaveTrailBtn = document.querySelector("#leaveTrailBtn");
const resultPanel = document.querySelector("#resultPanel");
const resultTitle = document.querySelector("#resultTitle");
const resultText = document.querySelector("#resultText");
const starLine = document.querySelector("#starLine");
const nextBtn = document.querySelector("#nextBtn");
const retryBtn = document.querySelector("#retryBtn");
const trailsBtn = document.querySelector("#trailsBtn");
const lobbyLink = document.querySelector("#lobbyLink");
const loadingPanel = document.querySelector("#loadingPanel");
const loadingTitle = document.querySelector("#loadingTitle");
const loadingText = document.querySelector("#loadingText");
const loadingFill = document.querySelector("#loadingFill");

function ensureLocaleOptions() {
  const existing = new Map([...localeSelect.options].map((option) => [option.value, option]));
  localeSelect.replaceChildren(...supportedLocales.map((code) => {
    const option = existing.get(code) || document.createElement("option");
    option.value = code;
    option.textContent = localeLabels[code];
    return option;
  }));
}

const GAME_ID = "animal-rescue";
const UNLOCK_KEY = "animalRescueUnlocked";
const BEST_KEY = "animalRescueStars";
const SIZE = 5;

const dictionary = {
  en: {
    title: "Animal Rescue Trail",
    language: "Language",
    stage: "Trail",
    moves: "Moves",
    fruit: "Fruit",
    chooseTrail: "Choose Trail",
    start: "Start",
    locked: "Locked",
    complete: "Complete",
    hint: "Tap a nearby tile or use the arrow keys to help the animal go home.",
    loading: "Loading",
    undo: "Undo",
    reset: "Reset",
    trailClear: "Trail Clear!",
    allClear: "All Animals Home!",
    result: "{animal} reached home with {fruit} fruit in {moves} moves.",
    next: "Next Trail",
    retry: "Play Again",
    trails: "Trails",
    lobby: "Lobby",
    lockedToast: "This trail is not unlocked yet.",
    wrongTile: "Choose a nearby tile.",
    lion: "Lion Cub",
    panda: "Panda",
    elephant: "Elephant",
    turtle: "Turtle",
    rabbit: "Rabbit",
    penguin: "Penguin",
    fox: "Fox",
    monkey: "Monkey",
    koala: "Koala",
    giraffe: "Giraffe",
    dolphin: "Dolphin",
    cow: "Cow",
    forest: "Forest Trail",
    bamboo: "Bamboo Garden",
    river: "River Bend",
    meadow: "Sunny Meadow",
    ice: "Icy Path",
    farm: "Farm Road",
    fruitGoal: "{count} fruit",
    obstacleGoal: "{count} blocks",
    parGoal: "{count} move goal",
    metaTitle: "Animal Rescue Trail - WeightPlay",
    metaDescription: "Guide animals through 30 saved route puzzles with fruit goals, mud, keys, gates, fragile paths, and six Rescue Checkpoints.",
    socialTitle: "Animal Rescue Trail - Animal Puzzle Game",
    backToLobby: "Back to Kids games",
    back: "Back",
    backToTrails: "Back to trails",
    stageSetup: "Choose an unlocked trail and help the next animal home.",
    board: "Animal rescue board",
    resultPanel: "Trail result",
    leaveTitle: "Leave this trail?",
    leaveMessage: "Trail {stage}: your {moves} moves and {fruit} fruit will be reset.",
    keepPlaying: "Keep playing",
    leaveTrail: "Leave trail",
    tile: "Path tile",
    home: "Home",
    fruitItem: "Fruit",
    rock: "Rock",
    water: "Water",
    key: "Trail key",
    gate: "Locked gate",
    mud: "Sticky mud",
    fragile: "Fragile path",
    needKey: "Find the trail key before crossing this gate.",
    needFruit: "Collect every fruit before entering home.",
    usedFragile: "That fragile tile has already crumbled. Choose another route.",
    checkpoint: "Rescue Checkpoint",
    chapters: ["Forest Steps", "Meadow Detours", "River Keys", "Fragile Ridge", "Harvest Routes", "Homecoming Festival"],
    ruleLabels: { classic: "Open Trail", fruit: "All Fruit", mud: "Sticky Mud", key: "Key Gate", fragile: "Fragile Path" },
  },
  "zh-Hant": {
    title: "\u52d5\u7269\u56de\u5bb6\u8def",
    language: "\u8a9e\u8a00",
    stage: "\u8def\u7dda",
    moves: "\u6b65\u6578",
    fruit: "\u6c34\u679c",
    chooseTrail: "\u9078\u64c7\u8def\u7dda",
    start: "\u958b\u59cb",
    locked: "\u672a\u89e3\u9396",
    complete: "\u5b8c\u6210",
    hint: "\u9ede\u65c1\u908a\u7684\u683c\u5b50\uff0c\u6216\u7528\u65b9\u5411\u9375\u5e6b\u52d5\u7269\u8d70\u56de\u5bb6\u3002",
    loading: "\u8f09\u5165\u4e2d",
    undo: "\u4e0a\u4e00\u6b65",
    reset: "\u91cd\u7f6e",
    trailClear: "\u8def\u7dda\u6210\u529f\uff01",
    allClear: "\u6240\u6709\u52d5\u7269\u90fd\u56de\u5bb6\u4e86\uff01",
    result: "{animal} \u56de\u5230\u5bb6\uff0c\u5e36\u56de {fruit} \u500b\u6c34\u679c\uff0c\u7e3d\u5171\u8d70\u4e86 {moves} \u6b65\u3002",
    next: "\u4e0b\u4e00\u95dc",
    retry: "\u518d\u73a9\u4e00\u6b21",
    trails: "\u8def\u7dda",
    lobby: "\u5927\u5ef3",
    lockedToast: "\u9019\u689d\u8def\u7dda\u5c1a\u672a\u89e3\u9396\u3002",
    wrongTile: "\u8acb\u9078\u64c7\u65c1\u908a\u7684\u683c\u5b50\u3002",
    lion: "\u5c0f\u7345\u5b50",
    panda: "\u8c93\u718a",
    elephant: "\u5927\u8c61",
    turtle: "\u70cf\u9f9c",
    rabbit: "\u5154\u5b50",
    penguin: "\u4f01\u9d5d",
    fox: "\u72d0\u72f8",
    monkey: "\u7334\u5b50",
    koala: "\u7121\u5c3e\u718a",
    giraffe: "\u9577\u9838\u9e7f",
    dolphin: "\u6d77\u8c5a",
    cow: "\u4e73\u725b",
    forest: "\u68ee\u6797\u5c0f\u8def",
    bamboo: "\u7af9\u6797\u82b1\u5712",
    river: "\u6cb3\u7554\u5f4e\u9053",
    meadow: "\u967d\u5149\u8349\u5730",
    ice: "\u51b0\u96ea\u5c0f\u8def",
    farm: "\u8fb2\u5834\u9053\u8def",
    fruitGoal: "{count} \u500b\u6c34\u679c",
    obstacleGoal: "{count} \u500b\u969c\u7919",
    parGoal: "\u5efa\u8b70 {count} \u6b65",
    metaTitle: "\u52d5\u7269\u56de\u5bb6\u8def - WeightPlay",
    metaDescription: "\u5f15\u5c0e\u52d5\u7269\u5b8c\u6210 30 \u689d\u5b58\u6a94\u8def\u7dda\uff0c\u6536\u96c6\u6c34\u679c\uff0c\u61c9\u5c0d\u9ecf\u6ce5\u3001\u9470\u5319\u9580\u3001\u8106\u5f31\u5c0f\u8def\u8207 6 \u500b\u6551\u63f4\u6aa2\u67e5\u9ede\u3002",
    socialTitle: "\u52d5\u7269\u56de\u5bb6\u8def - \u52d5\u7269\u8def\u7dda\u89e3\u8b0e\u904a\u6232",
    backToLobby: "\u8fd4\u56de Kids \u904a\u6232",
    back: "\u8fd4\u56de",
    backToTrails: "\u8fd4\u56de\u8def\u7dda\u9078\u64c7",
    stageSetup: "\u9078\u64c7\u5df2\u89e3\u9396\u7684\u8def\u7dda\uff0c\u5e6b\u4e0b\u4e00\u96bb\u52d5\u7269\u56de\u5bb6\u3002",
    board: "\u52d5\u7269\u56de\u5bb6\u8def\u724c\u9762",
    resultPanel: "\u8def\u7dda\u7d50\u679c",
    leaveTitle: "\u8981\u96e2\u958b\u9019\u689d\u8def\u7dda\u55ce\uff1f",
    leaveMessage: "\u8def\u7dda {stage}\uff1a\u76ee\u524d\u7684 {moves} \u6b65\u8207 {fruit} \u500b\u6c34\u679c\u9032\u5ea6\u5c07\u6703\u91cd\u7f6e\u3002",
    keepPlaying: "\u7e7c\u7e8c\u904a\u6232",
    leaveTrail: "\u96e2\u958b\u8def\u7dda",
    tile: "\u9053\u8def\u683c",
    home: "\u5bb6",
    fruitItem: "\u6c34\u679c",
    rock: "\u5ca9\u77f3",
    water: "\u6c34\u57df",
    key: "\u8def\u7dda\u9470\u5319",
    gate: "\u4e0a\u9396\u7684\u5927\u9580",
    mud: "\u9ecf\u6ce5",
    fragile: "\u8106\u5f31\u5c0f\u8def",
    needKey: "\u5148\u627e\u5230\u8def\u7dda\u9470\u5319\uff0c\u624d\u80fd\u901a\u904e\u9019\u6247\u9580\u3002",
    needFruit: "\u9032\u5bb6\u9580\u524d\u8981\u5148\u6536\u96c6\u6240\u6709\u6c34\u679c\u3002",
    usedFragile: "\u9019\u683c\u8106\u5f31\u5c0f\u8def\u5df2\u7d93\u584c\u4e0b\uff0c\u8acb\u63db\u4e00\u689d\u8def\u3002",
    checkpoint: "\u6551\u63f4\u6aa2\u67e5\u9ede",
    chapters: ["\u68ee\u6797\u8d77\u6b65", "\u8349\u5730\u7e5e\u8def", "\u6cb3\u7554\u9470\u5319", "\u8106\u5f31\u5c71\u810a", "\u8c50\u6536\u8def\u7dda", "\u56de\u5bb6\u6176\u5178"],
    ruleLabels: { classic: "\u958b\u653e\u5c0f\u8def", fruit: "\u5168\u90e8\u6c34\u679c", mud: "\u9ecf\u6ce5", key: "\u9470\u5319\u9580", fragile: "\u8106\u5f31\u5c0f\u8def" },
  },
  es: {
    title: "Sendero de Rescate Animal",
    language: "Idioma",
    stage: "Ruta",
    moves: "Movimientos",
    fruit: "Fruta",
    chooseTrail: "Elegir ruta",
    start: "Empezar",
    locked: "Bloqueada",
    complete: "Completada",
    hint: "Toca una casilla cercana o usa las flechas para ayudar al animal a volver a casa.",
    loading: "Cargando",
    undo: "Deshacer",
    reset: "Reiniciar",
    trailClear: "¡Ruta completada!",
    allClear: "¡Todos los animales están en casa!",
    result: "{animal} llegó a casa con {fruit} frutas en {moves} movimientos.",
    next: "Siguiente ruta",
    retry: "Jugar de nuevo",
    trails: "Rutas",
    lobby: "Sala de juegos",
    lockedToast: "Esta ruta aún no está desbloqueada.",
    wrongTile: "Elige una casilla cercana.",
    lion: "Cachorro de león",
    panda: "Panda",
    elephant: "Elefante",
    turtle: "Tortuga",
    rabbit: "Conejo",
    penguin: "Pingüino",
    fox: "Zorro",
    monkey: "Mono",
    koala: "Koala",
    giraffe: "Jirafa",
    dolphin: "Delfín",
    cow: "Vaca",
    forest: "Sendero del bosque",
    bamboo: "Jardín de bambú",
    river: "Curva del río",
    meadow: "Pradera soleada",
    ice: "Camino helado",
    farm: "Camino de la granja",
    fruitGoal: "{count} frutas",
    obstacleGoal: "{count} obstáculos",
    parGoal: "Meta: {count} movimientos",
    metaTitle: "Sendero de Rescate Animal - WeightPlay",
    metaDescription: "Guía a los animales por 30 rompecabezas de rutas guardadas con objetivos de fruta, barro, llaves, puertas, caminos frágiles y seis puestos de rescate.",
    socialTitle: "Sendero de Rescate Animal - Juego de rompecabezas",
    backToLobby: "Volver a los juegos Kids",
    back: "Volver",
    backToTrails: "Volver a las rutas",
    stageSetup: "Elige una ruta desbloqueada y ayuda al siguiente animal a volver a casa.",
    board: "Tablero de rescate animal",
    resultPanel: "Resultado de la ruta",
    leaveTitle: "\u00bfSalir de esta ruta?",
    leaveMessage: "Ruta {stage}: se reiniciar\u00e1n tus {moves} movimientos y {fruit} frutas.",
    keepPlaying: "Seguir jugando",
    leaveTrail: "Salir de la ruta",
    tile: "Casilla del camino",
    home: "Casa",
    fruitItem: "Fruta",
    rock: "Roca",
    water: "Agua",
    key: "Llave de la ruta",
    gate: "Puerta cerrada",
    mud: "Barro pegajoso",
    fragile: "Camino frágil",
    needKey: "Encuentra la llave de la ruta antes de cruzar esta puerta.",
    needFruit: "Recoge todas las frutas antes de entrar en casa.",
    usedFragile: "Esa casilla frágil ya se derrumbó. Elige otra ruta.",
    checkpoint: "Puesto de rescate",
    chapters: ["Primeros pasos del bosque", "Desvíos de la pradera", "Llaves del río", "Cresta frágil", "Rutas de cosecha", "Festival del regreso"],
    ruleLabels: { classic: "Ruta abierta", fruit: "Toda la fruta", mud: "Barro pegajoso", key: "Puerta con llave", fragile: "Camino frágil" },
  },
};

const localizedPageSupport = {
  es: {
    sound: "Sonido",
    enableSound: "Activar sonido",
    disableSound: "Desactivar sonido",
    tutorial: "Cómo jugar",
    guideReplacements: {
      "Homecoming Valley": "Valle del Regreso",
      "Clearing Trail 30": "Completar la ruta 30",
      Penguin: "Pingüino",
      "Sticky Mud": "Barro pegajoso",
      "All Fruit": "Toda la fruta",
      "Forest Steps": "Primeros pasos del bosque",
      "Meadow Detours": "Desvíos de la pradera",
      "River Keys": "Llaves del río",
      "Fragile Ridge": "Cresta frágil",
      "Harvest Routes": "Rutas de cosecha",
      "Homecoming Festival": "Festival del regreso",
      "Animal Rescue Trail": "Sendero de Rescate Animal",
      "Animal Relic Hunters es": "Es",
      "Animal Auto Squad es": "Es",
      "Animal Relic Hunters": "Cazadores de Reliquias Animales",
      "Animal Auto Squad": "Escuadrón Animal Automático",
      "6+ / Family": "6+ / Familia",
    },
  },
};

const assetBase = "../../assets/";

const animalAssets = {
  lion: { src: "weightplay-boom-mane-lion.png", fallback: "Boom Mane Leo" },
  panda: { src: "tiny-weather-animal-panda.png", fallback: "Panda" },
  elephant: { src: "animal-zoo-elephant.png", fallback: "Elephant" },
  turtle: { src: "animal-merge-token-1.png", fallback: "Turtle" },
  rabbit: { src: "tiny-weather-animal-rabbit.png", fallback: "Rabbit" },
  penguin: { src: "tiny-weather-animal-penguin.png", fallback: "Penguin" },
  fox: { src: "tiny-weather-animal-fox.png", fallback: "Fox" },
  monkey: { src: "animal-merge-token-4.png", fallback: "Monkey" },
  koala: { src: "tiny-weather-animal-koala.png", fallback: "Koala" },
  giraffe: { src: "animal-zoo-idle-giraffe.png", fallback: "Giraffe" },
  dolphin: { src: "bubble-bakery-whale.png", fallback: "Dolphin" },
  cow: { src: "animal-merge-token-5.png", fallback: "Cow" },
};

const fruitAssets = [
  { src: "animal-vine-fruit-apple.png", fallback: "Apple" },
  { src: "animal-vine-fruit-banana.png", fallback: "Banana" },
  { src: "animal-vine-fruit-berry.png", fallback: "Berry" },
  { src: "tiny-weather-tool-apple.svg", fallback: "Fruit" },
  { src: "animal-vine-fruit-berry.png", fallback: "Fruit" },
];

const tileAssets = {
  home: { src: "tiny-weather-tool-house.svg", fallback: "Home" },
  rock: { src: "shape-token-diamond.svg", fallback: "Rock" },
  water: { src: "safari-mask-water.svg", fallback: "Water" },
  key: { src: "animal-crystal-survivor-golden-key.png", fallback: "Key" },
  gate: { src: "animal-hero-trials-icon-trial-gate.png", fallback: "Gate" },
};

const baseLevels = [
  { animal: "lion", biome: "forest", start: [0, 4], home: [4, 0], blocks: [[1, 3], [2, 3], [3, 1]], fruits: [[0, 2], [3, 2]], par: 9 },
  { animal: "panda", biome: "bamboo", start: [4, 4], home: [0, 0], blocks: [[1, 1], [2, 1], [3, 3]], fruits: [[4, 2], [1, 4]], par: 13 },
  { animal: "elephant", biome: "river", start: [0, 0], home: [4, 4], blocks: [[2, 0], [2, 1], [2, 3]], fruits: [[1, 2], [3, 2]], par: 9, water: [[2, 2]] },
  { animal: "turtle", biome: "meadow", start: [2, 4], home: [2, 0], blocks: [[1, 2], [2, 2], [3, 2]], fruits: [[0, 1], [4, 1]], par: 13 },
  { animal: "rabbit", biome: "meadow", start: [0, 2], home: [4, 2], blocks: [[1, 1], [1, 3], [3, 1], [3, 3]], fruits: [[2, 0], [2, 4]], par: 13 },
  { animal: "penguin", biome: "ice", start: [4, 0], home: [0, 4], blocks: [[1, 0], [1, 1], [3, 3]], fruits: [[4, 3], [2, 2]], par: 11, water: [[2, 1]] },
  { animal: "fox", biome: "forest", start: [0, 1], home: [4, 3], blocks: [[1, 2], [2, 2], [3, 0], [3, 1]], fruits: [[0, 4], [4, 1]], par: 13 },
  { animal: "monkey", biome: "bamboo", start: [2, 0], home: [2, 4], blocks: [[0, 2], [1, 2], [3, 2], [4, 2]], fruits: [[0, 0], [4, 4]], par: 13 },
  { animal: "koala", biome: "forest", start: [4, 2], home: [0, 2], blocks: [[2, 1], [2, 2], [2, 3]], fruits: [[1, 0], [3, 4]], par: 13 },
  { animal: "giraffe", biome: "meadow", start: [0, 4], home: [4, 0], blocks: [[0, 2], [2, 2], [4, 2], [3, 1]], fruits: [[1, 1], [4, 4]], par: 15 },
  { animal: "dolphin", biome: "river", start: [0, 0], home: [4, 4], blocks: [[1, 0], [1, 3], [3, 1], [3, 4]], fruits: [[0, 3], [2, 2]], par: 11, water: [[2, 1], [2, 3]] },
  { animal: "cow", biome: "farm", start: [4, 4], home: [0, 0], blocks: [[1, 2], [2, 1], [2, 3], [3, 2]], fruits: [[4, 0], [0, 4]], par: 17 },
  { animal: "lion", biome: "forest", start: [0, 4], home: [4, 0], blocks: [[1, 1], [1, 3], [3, 1]], fruits: [[0, 1], [3, 3]], par: 11 },
  { animal: "panda", biome: "bamboo", start: [4, 4], home: [0, 0], blocks: [[3, 3], [2, 1], [1, 3]], fruits: [[4, 1], [1, 2]], par: 12 },
  { animal: "elephant", biome: "river", start: [0, 2], home: [4, 2], blocks: [[2, 0], [2, 4]], water: [[2, 1], [2, 3]], fruits: [[1, 0], [3, 4]], par: 15 },
  { animal: "turtle", biome: "meadow", start: [2, 4], home: [2, 0], blocks: [[0, 2], [4, 2], [2, 2]], fruits: [[0, 1], [4, 1]], par: 14 },
  { animal: "rabbit", biome: "meadow", start: [0, 0], home: [4, 4], blocks: [[1, 2], [3, 2]], fruits: [[0, 4], [4, 0]], par: 14 },
  { animal: "penguin", biome: "ice", start: [4, 0], home: [0, 4], blocks: [[3, 1], [1, 3]], water: [[2, 1], [2, 3]], fruits: [[4, 3], [0, 1]], par: 12 },
  { animal: "fox", biome: "forest", start: [0, 4], home: [4, 0], blocks: [[1, 0], [3, 4], [2, 2]], fruits: [[0, 0], [4, 4]], par: 16 },
  { animal: "monkey", biome: "bamboo", start: [2, 0], home: [2, 4], blocks: [[0, 1], [4, 1], [0, 3], [4, 3]], fruits: [[1, 2], [3, 2]], par: 10 },
  { animal: "koala", biome: "forest", start: [4, 2], home: [0, 2], blocks: [[1, 1], [1, 3], [3, 1], [3, 3]], fruits: [[2, 0], [2, 4]], par: 13 },
  { animal: "giraffe", biome: "meadow", start: [0, 0], home: [4, 4], blocks: [[1, 3], [2, 1], [3, 3]], fruits: [[0, 4], [4, 0]], par: 15 },
  { animal: "dolphin", biome: "river", start: [0, 4], home: [4, 0], blocks: [[1, 1], [3, 3]], water: [[2, 1], [2, 3]], fruits: [[0, 0], [4, 4]], par: 16 },
  { animal: "cow", biome: "farm", start: [4, 4], home: [0, 0], blocks: [[1, 1], [2, 3], [3, 1]], fruits: [[4, 0], [0, 4], [2, 2]], par: 17 },
  { animal: "lion", biome: "forest", start: [0, 2], home: [4, 2], blocks: [[2, 0], [2, 4]], fruits: [[1, 4], [3, 0]], par: 14 },
  { animal: "panda", biome: "bamboo", start: [4, 2], home: [0, 2], blocks: [[2, 0], [2, 4], [3, 2]], fruits: [[4, 0], [0, 4]], par: 15 },
  { animal: "elephant", biome: "river", start: [0, 0], home: [4, 4], blocks: [[1, 3], [3, 1]], water: [[2, 2]], fruits: [[0, 4], [4, 0]], par: 16 },
  { animal: "turtle", biome: "meadow", start: [2, 4], home: [2, 0], blocks: [[0, 2], [4, 2]], fruits: [[0, 0], [4, 0]], par: 14 },
  { animal: "rabbit", biome: "meadow", start: [0, 4], home: [4, 0], blocks: [[1, 1], [2, 3], [3, 1]], fruits: [[0, 0], [4, 4]], par: 16 },
  { animal: "penguin", biome: "ice", start: [4, 4], home: [0, 0], blocks: [[1, 2], [3, 3]], water: [[2, 1]], fruits: [[4, 0], [0, 4], [2, 2]], par: 18 },
];

const ruleSets = [
  {}, {}, {}, {}, { requiredFruit: true },
  { mud: [[2, 2]] }, { mud: [[1, 2], [3, 2]] }, { mud: [[2, 1], [2, 3]] }, { mud: [[1, 1], [3, 3]] }, { mud: [[1, 2], [2, 2], [3, 2]], requiredFruit: true },
  { keys: [[0, 4]], gates: [[1, 2]] }, { keys: [[3, 4]], gates: [[1, 1]] }, { keys: [[1, 0]], gates: [[3, 4]] }, { keys: [[4, 2]], gates: [[2, 3]] }, { keys: [[0, 4]], gates: [[3, 1]], requiredFruit: true },
  { fragile: [[1, 4], [2, 4], [3, 4]] }, { fragile: [[4, 1], [4, 2], [4, 3]] }, { fragile: [[1, 2], [2, 2], [3, 2]] }, { fragile: [[2, 1], [2, 2], [2, 3]] }, { fragile: [[1, 0], [2, 0], [3, 0]], keys: [[1, 1]], gates: [[3, 1]] },
  { requiredFruit: true, mud: [[2, 1], [2, 3]] }, { requiredFruit: true, keys: [[3, 4]], gates: [[1, 2]] }, { requiredFruit: true, fragile: [[1, 4], [2, 4], [3, 4]] }, { requiredFruit: true, mud: [[2, 4]], keys: [[3, 3]], gates: [[1, 3]] }, { requiredFruit: true, mud: [[2, 2]], fragile: [[1, 2], [3, 2]] },
  { mud: [[1, 2], [3, 2]], keys: [[4, 1]], gates: [[2, 2]] }, { requiredFruit: true, fragile: [[1, 1], [3, 3]], keys: [[2, 0]], gates: [[3, 4]] }, { mud: [[2, 1], [2, 3]], fragile: [[1, 2], [3, 2]], requiredFruit: true }, { keys: [[0, 3]], gates: [[4, 1]], mud: [[2, 2]], fragile: [[1, 3], [3, 3]] }, { requiredFruit: true, keys: [[4, 1]], gates: [[1, 1]], mud: [[2, 2]], fragile: [[1, 3], [3, 1]] },
];

const levels = baseLevels.map((level, index) => ({ ...level, ...ruleSets[index], id: index + 1, chapter: Math.floor(index / 5) + 1, checkpoint: (index + 1) % 5 === 0 }));

let unlocked = loadUnlocked();
let bestStars = loadBestStars();
let activeIndex = 0;
let state = makeState(levels[0]);
let hintResetTimer = 0;
let hintResetRemaining = 0;
let hintResetStartedAt = 0;
let hintLifecycleSuspended = document.hidden;
let centeredTrailFrame = 0;

function locale() {
  return window.WonderI18n?.locale() || "en";
}

function t(key, params = {}) {
  const currentLocale = locale();
  const sourceLocale = currentLocale === "zh-Hans" ? "zh-Hant" : currentLocale;
  const table = dictionary[sourceLocale] || dictionary.en;
  const source = table[key] || dictionary.en[key] || key;
  const immediate = ["en", "zh-Hant", "zh-Hans", "es"].includes(currentLocale)
    ? source
    : window.WeightPlayGameRuntimeLocalizer?.translate(source) || source;
  const localized = Object.entries(params).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), immediate);
  return currentLocale === "zh-Hans" ? window.WonderI18n?.simplifyChineseText?.(localized) || localized : localized;
}

function makeState(level) {
  return {
    level,
    position: [...level.start],
    path: [[...level.start]],
    fruits: new Set(level.fruits.map(keyOf)),
    keys: new Set((level.keys || []).map(keyOf)),
    keysCollected: 0,
    openedGates: new Set(),
    collected: 0,
    moves: 0,
    complete: false,
  };
}

function keyOf(pos) {
  return `${pos[0]},${pos[1]}`;
}

function loadUnlocked() {
  try {
    const parsed = Number(storageRead(UNLOCK_KEY));
    const repaired = Math.max(1, Math.min(levels.length, Number.isFinite(parsed) ? Math.floor(parsed) : 1));
    storageWrite(UNLOCK_KEY, repaired);
    return repaired;
  } catch {
    return 1;
  }
}

function loadBestStars() {
  let parsed;
  try {
    parsed = JSON.parse(storageRead(BEST_KEY) || "{}");
  } catch {
    parsed = {};
  }
  const repaired = {};
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    Object.entries(parsed).forEach(([level, value]) => {
      const levelId = Number(level);
      const stars = Number(value);
      if (!Number.isInteger(levelId) || levelId < 1 || levelId > levels.length || !Number.isFinite(stars) || stars <= 0) return;
      repaired[levelId] = Math.max(1, Math.min(3, Math.floor(stars)));
    });
  }
  try {
    storageWrite(BEST_KEY, JSON.stringify(repaired));
  } catch {}
  return repaired;
}

function saveProgress() {
  storageWrite(UNLOCK_KEY, unlocked);
  storageWrite(BEST_KEY, JSON.stringify(bestStars));
}

function renderStaticText() {
  const restoreBoardFocus = board?.contains(document.activeElement);
  document.documentElement.lang = locale();
  document.title = t("metaTitle");
  document.querySelector('meta[name="description"]')?.setAttribute("content", t("metaDescription"));
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", t("socialTitle"));
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", t("metaDescription"));
  localeSelect.value = locale();
  languageLabel.textContent = t("language");
  localeSelect.setAttribute("aria-label", t("language"));
  homeLink.setAttribute("aria-label", t("backToLobby"));
  stageBackBtn.setAttribute("aria-label", t("back"));
  battleBackBtn.setAttribute("aria-label", t("backToTrails"));
  stageSetupText.textContent = t("stageSetup");
  board.setAttribute("aria-label", t("board"));
  titleText.textContent = t("title");
  mainTitle.textContent = t("title");
  mainIntro.textContent = t("hint");
  showStageBtn.textContent = t("chooseTrail");
  stageLabel.textContent = t("stage");
  moveLabel.textContent = t("moves");
  fruitLabel.textContent = t("fruit");
  stageSelectTitle.textContent = t("chooseTrail");
  hintText.textContent = t("hint");
  undoBtn.textContent = t("undo");
  resetBtn.textContent = t("reset");
  leaveTitle.textContent = t("leaveTitle");
  leaveText.textContent = t("leaveMessage", { stage:state.level.id, moves:state.moves, fruit:state.collected });
  keepPlayingBtn.textContent = t("keepPlaying");
  leaveTrailBtn.textContent = t("leaveTrail");
  nextBtn.textContent = t("next");
  retryBtn.textContent = t("retry");
  trailsBtn.textContent = t("trails");
  lobbyLink.textContent = t("lobby");
  loadingTitle.textContent = t("loading");
  renderStageSelect();
  renderBoard(restoreBoardFocus);
  updateHud();
}

function localizeGamePageSupport() {
  const support = localizedPageSupport[locale()];
  if (!support) return;
  homeLink.setAttribute("aria-label", t("backToLobby"));
  const soundToggle = document.querySelector("button[data-sound-toggle]");
  if (soundToggle) {
    soundToggle.title = support.sound;
    soundToggle.setAttribute("aria-label", soundToggle.classList.contains("muted") ? support.enableSound : support.disableSound);
  }
  document.querySelector(".wp-tutorial-button")?.setAttribute("aria-label", support.tutorial);
  const guide = document.querySelector(".game-page-info");
  if (!guide) return;
  const walker = document.createTreeWalker(guide, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    let value = walker.currentNode.nodeValue || "";
    for (const [source, replacement] of Object.entries(support.guideReplacements)) value = value.replaceAll(source, replacement);
    walker.currentNode.nodeValue = value;
  }
}

let pageSupportSyncQueued = false;
function queueGamePageSupportSync() {
  if (pageSupportSyncQueued) return;
  pageSupportSyncQueued = true;
  requestAnimationFrame(() => {
    pageSupportSyncQueued = false;
    localizeGamePageSupport();
  });
}

function preload() {
  let percent = 0;
  let ready = false;
  const finish = () => {
    if (ready) return;
    ready = true;
    loadingText.textContent = "100%";
    loadingFill.style.width = "100%";
    loadingPanel.classList.add("hidden");
    window.WonderAnalytics?.track("game_ready", { game_id: GAME_ID });
  };
  const timer = setInterval(() => {
    percent += 20;
    loadingText.textContent = `${Math.min(100, percent)}%`;
    loadingFill.style.width = `${Math.min(100, percent)}%`;
    if (percent >= 100) {
      clearInterval(timer);
      finish();
    }
  }, 70);
  window.setTimeout(() => {
    clearInterval(timer);
    finish();
  }, 900);
}

function renderStageSelect() {
  stageGrid.innerHTML = levels
    .map((level) => {
      const locked = level.id > unlocked;
      const stars = bestStars[level.id] || 0;
      const animal = animalAssets[level.animal];
      return `
        <button class="stage-card ${locked ? "locked" : ""}" type="button" data-stage="${level.id}" aria-disabled="${locked}">
          <span class="mini-animal">${assetMarkup(animal, t(level.animal))}</span>
          <span>
            <em class="stage-chapter">${chapterName(level.chapter)}</em>
            <strong>${level.id}. ${t(level.animal)}</strong>
            <span>${t(level.biome)} - ${locked ? t("locked") : stars ? t("complete") : t("start")}</span>
          </span>
          <span class="stage-meta" aria-label="${escapeHtml(stageMetaText(level, locked))}">
            <i>${t("fruitGoal", { count: level.fruits.length })}</i>
            <i>${t("obstacleGoal", { count: level.blocks.length + (level.water || []).length })}</i>
            <i>${t("parGoal", { count: level.par })}</i>
            <i>${locked ? t("locked") : levelRuleLabels(level).join(" + ")}</i>
          </span>
          ${level.checkpoint ? `<b class="stage-checkpoint">${t("checkpoint")}</b>` : ""}
          <span class="stage-stars">${"\u2605".repeat(stars)}${"\u2606".repeat(3 - stars)}</span>
        </button>
      `;
    })
    .join("");
  scheduleCenteredTrailCard();
}

function updateCenteredTrailCard() {
  centeredTrailFrame = 0;
  const cards = [...stageGrid.querySelectorAll("[data-stage]")];
  if (!cards.length || !document.body.classList.contains("rescue-stage-select")) return;
  const railRect = stageGrid.getBoundingClientRect();
  const railCenter = railRect.left + railRect.width / 2;
  const centered = cards.reduce((nearest, card) => {
    const rect = card.getBoundingClientRect();
    const distance = Math.abs(rect.left + rect.width / 2 - railCenter);
    return !nearest || distance < nearest.distance ? { card, distance } : nearest;
  }, null)?.card;
  for (const card of cards) {
    const isCentered = card === centered;
    card.classList.toggle("is-centered", isCentered);
    if (isCentered) card.setAttribute("aria-current", "true");
    else card.removeAttribute("aria-current");
  }
}

function scheduleCenteredTrailCard() {
  if (centeredTrailFrame) cancelAnimationFrame(centeredTrailFrame);
  centeredTrailFrame = requestAnimationFrame(updateCenteredTrailCard);
}

function centerHighestUnlockedTrail(behavior = "auto") {
  const target = stageGrid.querySelector(`[data-stage="${unlocked}"]`);
  if (!target) return;
  const left = target.offsetLeft - (stageGrid.clientWidth - target.offsetWidth) / 2;
  stageGrid.scrollTo({ left: Math.max(0, Math.min(left, stageGrid.scrollWidth - stageGrid.clientWidth)), behavior });
  scheduleCenteredTrailCard();
}

function stageMetaText(level, locked = false) {
  const stateLabel = locked ? t("locked") : levelRuleLabels(level).join(", ");
  return `${t("fruitGoal", { count: level.fruits.length })}, ${t("obstacleGoal", { count: level.blocks.length + (level.water || []).length })}, ${t("parGoal", { count: level.par })}, ${stateLabel}`;
}

function ruleLabel(key) {
  return dictionary[locale()]?.ruleLabels?.[key] || dictionary.en.ruleLabels[key] || key;
}

function chapterName(chapter) {
  return dictionary[locale()]?.chapters?.[chapter - 1] || dictionary.en.chapters[chapter - 1] || "";
}

function levelRuleLabels(level) {
  const labels = [];
  if (level.requiredFruit) labels.push(ruleLabel("fruit"));
  if (level.mud?.length) labels.push(ruleLabel("mud"));
  if (level.keys?.length) labels.push(ruleLabel("key"));
  if (level.fragile?.length) labels.push(ruleLabel("fragile"));
  return labels.length ? labels : [ruleLabel("classic")];
}

function startLevel(index) {
  const level = levels[index];
  if (!level || level.id > unlocked) {
    showLocked();
    return;
  }
  restoreRouteHint();
  activeIndex = index;
  state = makeState(level);
  stageSelect.classList.add("hidden");
  mainPanel.classList.add("hidden");
  resultPanel.classList.add("hidden");
  leavePanel.classList.add("hidden");
  setResultOwnership(false);
  playArea.classList.remove("hidden");
  hud.classList.remove("hidden");
  document.body.classList.remove("rescue-stage-select");
  document.body.classList.remove("rescue-result");
  document.body.classList.add("rescue-playing");
  hud.prepend(battleBackBtn);
  renderAvatar(level.animal);
  animalName.textContent = t(level.animal);
  renderBoard(true);
  updateHud();
  window.WeightPlayGame?.exitMobileGameMode?.();
  document.body.classList.remove("wp-mobile-game-mode", "weightplay-active-viewport");
  document.querySelector(".rescue-game")?.classList.remove("weightplay-active-viewport");
  updateBattleScale();
  window.WonderSound?.play("start");
  window.WonderAnalytics?.track("game_start", { game_id: GAME_ID, stage: level.id, locale: locale() });
}

function showStageSelect({ focusTrail = false } = {}) {
  mainPanel.classList.add("hidden");
  playArea.classList.add("hidden");
  hud.classList.add("hidden");
  resultPanel.classList.add("hidden");
  leavePanel.classList.add("hidden");
  setResultOwnership(false);
  stageSelect.classList.remove("hidden");
  document.body.classList.remove("rescue-playing");
  document.body.classList.remove("rescue-result");
  document.body.classList.add("rescue-stage-select");
  renderStageSelect();
  exitSharedPlayViewport();
  updateBattleScale();
  requestAnimationFrame(() => {
    updateBattleScale();
    requestAnimationFrame(() => {
      centerHighestUnlockedTrail("auto");
      if (focusTrail) stageGrid.querySelector(`[data-stage="${unlocked}"]`)?.focus({ preventScroll: true });
    });
  });
}

function showMain({ focusStart = false } = {}) {
  playArea.classList.add("hidden");
  hud.classList.add("hidden");
  resultPanel.classList.add("hidden");
  leavePanel.classList.add("hidden");
  setResultOwnership(false);
  stageSelect.classList.add("hidden");
  mainPanel.classList.remove("hidden");
  document.body.classList.remove("rescue-playing", "rescue-stage-select", "rescue-result");
  resetRescueFrame();
  renderStaticText();
  if (focusStart) requestAnimationFrame(() => showStageBtn.focus({ preventScroll: true }));
}

function showLocked() {
  window.WonderSound?.play("wrong");
  const original = stageSelectTitle.textContent;
  stageSelectTitle.textContent = t("lockedToast");
  setTimeout(() => {
    stageSelectTitle.textContent = original;
  }, 1200);
}

function renderBoard(focusCurrent = false) {
  if (!board) return;
  const level = state.level;
  const blockSet = new Set(level.blocks.map(keyOf));
  const waterSet = new Set((level.water || []).map(keyOf));
  const mudSet = new Set((level.mud || []).map(keyOf));
  const fragileSet = new Set((level.fragile || []).map(keyOf));
  const gateSet = new Set((level.gates || []).map(keyOf));
  const pathSet = new Set(state.path.map(keyOf));
  const current = keyOf(state.position);
  board.innerHTML = "";
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const pos = [col, row];
      const key = keyOf(pos);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `tile ${tileClass(key, blockSet, waterSet, mudSet, fragileSet, gateSet, pathSet, current)}`;
      button.dataset.x = String(col);
      button.dataset.y = String(row);
      button.tabIndex = key === current ? 0 : -1;
      if (key === current) button.setAttribute("aria-current", "step");
      const icon = tileIcon(pos, key, blockSet, waterSet, gateSet);
      if (icon?.asset) {
        const label = document.createElement("span");
        label.className = "tile-label";
        label.append(makeAssetImage(icon.asset, icon.alt));
        button.append(label);
      }
      if (pathSet.has(key) && key !== current) {
        const marker = document.createElement("span");
        marker.className = "trail-mark";
        marker.setAttribute("aria-hidden", "true");
        button.append(marker);
      }
      button.setAttribute("aria-label", icon?.alt || t("tile"));
      board.append(button);
    }
  }
  if (focusCurrent && !state.complete) {
    requestAnimationFrame(() => board.querySelector(".tile.current")?.focus({ preventScroll: true }));
  }
}

function tileClass(key, blockSet, waterSet, mudSet, fragileSet, gateSet, pathSet, current) {
  const classes = [];
  classes.push(waterSet.has(key) ? "water" : blockSet.has(key) ? "rock blocked" : "path");
  if (mudSet.has(key)) classes.push("mud");
  if (fragileSet.has(key)) classes.push("fragile");
  if (gateSet.has(key) && !state.openedGates.has(key)) classes.push("gate");
  if (fragileSet.has(key) && pathSet.has(key) && key !== current) classes.push("crumbled");
  if (key === current) classes.push("current");
  if (pathSet.has(key) && key !== current) classes.push("visited");
  if (isNeighbor(key)) classes.push("next");
  return classes.join(" ");
}

function tileIcon(pos, key, blockSet, waterSet, gateSet) {
  const level = state.level;
  if (key === keyOf(state.position)) return { asset: animalAssets[level.animal], alt: t(level.animal) };
  if (key === keyOf(level.home)) return { asset: tileAssets.home, alt: t("home") };
  if (state.fruits.has(key)) return { asset: fruitAssets[(level.id + pos[0] + pos[1]) % fruitAssets.length], alt: t("fruitItem") };
  if (state.keys.has(key)) return { asset: tileAssets.key, alt: t("key") };
  if (gateSet.has(key) && !state.openedGates.has(key)) return { asset: tileAssets.gate, alt: t("gate") };
  if (blockSet.has(key)) return { asset: tileAssets.rock, alt: t("rock") };
  if (waterSet.has(key)) return { asset: tileAssets.water, alt: t("water") };
  return null;
}

function assetMarkup(asset, alt) {
  if (!asset) return "";
  return `<img src="${assetBase}${asset.src}" alt="${escapeHtml(alt || asset.fallback || "")}" loading="eager" decoding="async" draggable="false" />`;
}

function makeAssetImage(asset, alt) {
  const image = document.createElement("img");
  image.src = `${assetBase}${asset.src}`;
  image.alt = alt || asset.fallback || "";
  image.decoding = "async";
  image.draggable = false;
  image.addEventListener("error", () => {
    const fallback = document.createElement("span");
    fallback.className = "asset-fallback";
    fallback.textContent = asset.fallback || alt || "";
    image.replaceWith(fallback);
  }, { once: true });
  return image;
}

function renderAvatar(animalId) {
  animalAvatar.replaceChildren(makeAssetImage(animalAssets[animalId], t(animalId)));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

function isNeighbor(key) {
  if (state.complete) return false;
  const [x, y] = key.split(",").map(Number);
  const dx = Math.abs(x - state.position[0]);
  const dy = Math.abs(y - state.position[1]);
  return dx + dy === 1 && !entryRejection(key);
}

function entryRejection(key) {
  const level = state.level;
  const obstacles = new Set([...level.blocks, ...(level.water || [])].map(keyOf));
  if (obstacles.has(key)) return "wrongTile";
  const gateIndex = (level.gates || []).findIndex((position) => keyOf(position) === key);
  if (gateIndex >= 0 && !state.openedGates.has(key) && state.keysCollected <= gateIndex) return "needKey";
  if ((level.fragile || []).some((position) => keyOf(position) === key) && state.path.some((position) => keyOf(position) === key)) return "usedFragile";
  if (key === keyOf(level.home) && level.requiredFruit && state.collected < level.fruits.length) return "needFruit";
  return "";
}

function moveTo(pos) {
  if (state.complete) return;
  const level = state.level;
  const key = keyOf(pos);
  const dx = Math.abs(pos[0] - state.position[0]);
  const dy = Math.abs(pos[1] - state.position[1]);
  if (dx + dy !== 1) return rejectMove();
  const rejection = entryRejection(key);
  if (rejection) return rejectMove(rejection);
  restoreRouteHint();
  state.position = pos;
  state.path.push([...pos]);
  state.moves += (level.mud || []).some((position) => keyOf(position) === key) ? 2 : 1;
  if (state.fruits.delete(key)) {
    state.collected += 1;
    window.WonderSound?.play("coin");
  } else if (state.keys.delete(key)) {
    state.keysCollected += 1;
    window.WonderSound?.play("coin");
  } else {
    window.WonderSound?.play("click");
  }
  if ((level.gates || []).some((position) => keyOf(position) === key)) state.openedGates.add(key);
  if (key === keyOf(level.home)) finishLevel();
  renderBoard(!state.complete);
  updateHud();
}

function undoMove() {
  if (state.complete || state.path.length <= 1) return;
  restoreRouteHint();
  state.path.pop();
  state.position = [...state.path[state.path.length - 1]];
  recomputePathState();
  window.WonderSound?.play("click");
  renderBoard(true);
  updateHud();
}

function recomputePathState() {
  const level = state.level;
  state.fruits = new Set(level.fruits.map(keyOf));
  state.keys = new Set((level.keys || []).map(keyOf));
  state.collected = 0;
  state.keysCollected = 0;
  state.openedGates = new Set();
  state.moves = 0;
  for (const pos of state.path.slice(1)) {
    const key = keyOf(pos);
    state.moves += (level.mud || []).some((position) => keyOf(position) === key) ? 2 : 1;
    if (state.fruits.delete(key)) state.collected += 1;
    if (state.keys.delete(key)) state.keysCollected += 1;
    if ((level.gates || []).some((position) => keyOf(position) === key)) state.openedGates.add(key);
  }
}

function resetLevel() {
  window.WonderAnalytics?.track("game_restart", {
    game_id: GAME_ID,
    stage: state?.level?.id || activeIndex + 1,
    moves: state?.moves || 0,
    source: "reset",
    locale: locale(),
  });
  startLevel(activeIndex);
}

function rejectMove(messageKey = "wrongTile") {
  window.WonderSound?.play("wrong");
  hintText.textContent = t(messageKey);
  scheduleRouteHintReset(900);
}

function scheduleRouteHintReset(delay) {
  window.clearTimeout(hintResetTimer);
  hintResetTimer = 0;
  hintResetRemaining = Math.max(0, delay);
  if (hintLifecycleSuspended || document.hidden || hintResetRemaining === 0) return;
  hintResetStartedAt = performance.now();
  hintResetTimer = window.setTimeout(restoreRouteHint, hintResetRemaining);
}

function suspendRouteHintReset() {
  if (hintLifecycleSuspended) return;
  hintLifecycleSuspended = true;
  if (!hintResetTimer) return;
  window.clearTimeout(hintResetTimer);
  hintResetTimer = 0;
  hintResetRemaining = Math.max(0, hintResetRemaining - (performance.now() - hintResetStartedAt));
}

function resumeRouteHintReset() {
  hintLifecycleSuspended = document.hidden;
  if (hintLifecycleSuspended || hintResetTimer || hintResetRemaining <= 0) return;
  hintResetStartedAt = performance.now();
  hintResetTimer = window.setTimeout(restoreRouteHint, hintResetRemaining);
}

function restoreRouteHint() {
  window.clearTimeout(hintResetTimer);
  hintResetTimer = 0;
  hintResetRemaining = 0;
  hintResetStartedAt = 0;
  hintText.textContent = t("hint");
}

function finishLevel() {
  state.complete = true;
  const level = state.level;
  const isFinalTrail = level.id >= levels.length;
  const stars = calculateStars();
  bestStars[level.id] = Math.max(bestStars[level.id] || 0, stars);
  unlocked = Math.max(unlocked, Math.min(levels.length, level.id + 1));
  saveProgress();
  resultTitle.textContent = level.id === levels.length ? t("allClear") : t("trailClear");
  resultText.textContent = t("result", { animal: t(level.animal), fruit: state.collected, moves: state.moves });
  starLine.textContent = "\u2605".repeat(stars) + "\u2606".repeat(3 - stars);
  nextBtn.classList.toggle("hidden", isFinalTrail);
  const primaryAction = isFinalTrail ? trailsBtn : nextBtn;
  [nextBtn, retryBtn, trailsBtn, lobbyLink].forEach((action) => {
    action.classList.toggle("result-primary", action === primaryAction);
    action.classList.toggle("result-secondary", action !== primaryAction);
  });
  resultPanel.classList.remove("hidden");
  setResultOwnership(true);
  document.body.classList.add("rescue-result");
  requestAnimationFrame(() => primaryAction.focus({ preventScroll: true }));
  window.WonderSound?.play("win");
  window.WonderAnalytics?.track("game_complete", {
    game_id: GAME_ID,
    stage: level.id,
    stars,
    moves: state.moves,
    fruit: state.collected,
    locale: locale(),
  });
}

function setResultOwnership(owned) {
  [hud, playArea.querySelector(".animal-panel"), board, playArea.querySelector(".action-row")].forEach((region) => {
    if (!region) return;
    region.inert = owned;
    if (owned) region.setAttribute("aria-hidden", "true");
    else region.removeAttribute("aria-hidden");
  });
}

function openLeaveDecision() {
  if (!state || state.complete || !resultPanel.classList.contains("hidden")) return;
  leaveTitle.textContent = t("leaveTitle");
  leaveText.textContent = t("leaveMessage", { stage:state.level.id, moves:state.moves, fruit:state.collected });
  leavePanel.classList.remove("hidden");
  setResultOwnership(true);
  requestAnimationFrame(() => keepPlayingBtn.focus({ preventScroll:true }));
  window.WonderSound?.play("click");
  window.WonderAnalytics?.track("game_quit_prompt", { game_id:GAME_ID, stage:state.level.id, moves:state.moves, fruit:state.collected, locale:locale() });
}

function closeLeaveDecision({ focusBack = true } = {}) {
  leavePanel.classList.add("hidden");
  setResultOwnership(false);
  if (focusBack) requestAnimationFrame(() => battleBackBtn.focus({ preventScroll:true }));
}

function leaveCurrentTrail() {
  const details = { game_id:GAME_ID, stage:state.level.id, moves:state.moves, fruit:state.collected, locale:locale() };
  closeLeaveDecision({ focusBack:false });
  window.WonderAnalytics?.track("game_quit", details);
  showStageSelect({ focusTrail:true });
}

function containDecisionFocus(panel, actions, event, onEscape) {
  if (event.repeat && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    return;
  }
  if (event.key === "Escape") {
    event.preventDefault();
    onEscape();
    return;
  }
  if (event.key !== "Tab" || panel.classList.contains("hidden")) return;
  const visible = actions.filter((action) => !action.classList.contains("hidden") && !action.disabled);
  const currentIndex = visible.indexOf(document.activeElement);
  const nextIndex = event.shiftKey
    ? (currentIndex <= 0 ? visible.length - 1 : currentIndex - 1)
    : (currentIndex < 0 || currentIndex >= visible.length - 1 ? 0 : currentIndex + 1);
  event.preventDefault();
  visible[nextIndex]?.focus({ preventScroll:true });
}

function calculateStars() {
  const fruitCount = state.level.fruits.length;
  if (state.moves <= state.level.par && state.collected >= fruitCount) return 3;
  if (state.collected >= Math.max(1, fruitCount - 1)) return 2;
  return 1;
}

function updateHud() {
  const level = state.level;
  stageText.textContent = `${level.id} / ${levels.length}`;
  moveText.textContent = String(state.moves);
  fruitText.textContent = `${state.collected} / ${level.fruits.length}`;
}

localeSelect.addEventListener("change", () => {
  window.WonderI18n?.setLocale(localeSelect.value);
  renderStaticText();
});
localeSelect.addEventListener("input", () => {
  window.WonderI18n?.setLocale(localeSelect.value);
  renderStaticText();
});
window.addEventListener("wonder:locale-change", renderStaticText);
window.addEventListener("wonder:locale-change", queueGamePageSupportSync);

function updateBattleScale() {
  const viewport = window.visualViewport;
  const innerWidth = Math.max(1, window.innerWidth);
  const innerHeight = Math.max(1, window.innerHeight);
  const visualWidth = viewport?.width || 0;
  const visualHeight = viewport?.height || 0;
  const visualViewportIsCurrent = visualWidth > 0 && visualHeight > 0
    && Math.abs(visualWidth - innerWidth) <= 2
    && Math.abs(visualHeight - innerHeight) <= 2;
  const viewportWidth = visualViewportIsCurrent ? visualWidth : innerWidth;
  const viewportHeight = visualViewportIsCurrent ? visualHeight : innerHeight;
  if (!document.body.classList.contains("rescue-playing") && !document.body.classList.contains("rescue-stage-select")) return;
  document.body.classList.add("rescue-expanded-canvas");
  const scale = Math.max(0.1, Math.min(viewportWidth / 390, viewportHeight / 788));
  const width = viewportWidth / scale;
  const contentHeight = viewportHeight / scale;
  document.documentElement.style.setProperty("--rescue-battle-scale", String(scale));
  document.documentElement.style.setProperty("--rescue-battle-width", `${width}px`);
  document.documentElement.style.setProperty("--rescue-battle-height", `${contentHeight}px`);
  document.documentElement.style.setProperty("--rescue-battle-content-height", `${contentHeight}px`);
  document.documentElement.style.setProperty("--rescue-battle-left", "0px");
  document.documentElement.style.setProperty("--rescue-battle-top", "0px");
}

function resetRescueFrame() {
  for (const name of ["--rescue-battle-scale", "--rescue-battle-width", "--rescue-battle-height", "--rescue-battle-content-height", "--rescue-battle-left", "--rescue-battle-top"]) document.documentElement.style.removeProperty(name);
}

function exitSharedPlayViewport() {
  window.WeightPlayGame?.exitMobileGameMode?.();
  document.body.classList.remove("weightplay-active-viewport", "wp-mobile-game-mode");
  document.querySelector(".rescue-game")?.classList.remove("weightplay-active-viewport");
}

updateBattleScale();
window.addEventListener("resize", updateBattleScale);
window.addEventListener("orientationchange", updateBattleScale);
window.visualViewport?.addEventListener("resize", updateBattleScale);
window.visualViewport?.addEventListener("scroll", updateBattleScale);
stageGrid.addEventListener("scroll", scheduleCenteredTrailCard, { passive: true });
stageGrid.addEventListener("wonder:stage-snap", scheduleCenteredTrailCard);
window.addEventListener("resize", scheduleCenteredTrailCard, { passive: true });
window.visualViewport?.addEventListener("resize", scheduleCenteredTrailCard, { passive: true });
const rejectRepeatedScreenActivation = (event) => {
  if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
};
showStageBtn.addEventListener("keydown", rejectRepeatedScreenActivation);
battleBackBtn.addEventListener("keydown", rejectRepeatedScreenActivation);
stageGrid.addEventListener("keydown", (event) => {
  if (event.target.closest("[data-stage]")) rejectRepeatedScreenActivation(event);
});
showStageBtn.addEventListener("click", () => showStageSelect({ focusTrail: true }));
stageBackBtn.addEventListener("click", () => showMain({ focusStart: true }));
battleBackBtn.addEventListener("click", openLeaveDecision);
stageGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-stage]");
  if (!card) return;
  startLevel(Number(card.dataset.stage) - 1);
});
board.addEventListener("click", (event) => {
  const tile = event.target.closest(".tile");
  if (!tile) return;
  moveTo([Number(tile.dataset.x), Number(tile.dataset.y)]);
});
board.addEventListener("keydown", (event) => {
  const current = event.target.closest(".tile.current");
  if (!current) return;
  const deltas = {
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
  };
  const delta = deltas[event.key];
  if (!delta) return;
  event.preventDefault();
  if (event.repeat) return;
  const target = [Number(current.dataset.x) + delta[0], Number(current.dataset.y) + delta[1]];
  if (target.some((value) => value < 0 || value >= SIZE)) return rejectMove();
  moveTo(target);
});
undoBtn.addEventListener("click", undoMove);
undoBtn.addEventListener("keydown", rejectRepeatedScreenActivation);
resetBtn.addEventListener("click", resetLevel);
nextBtn.addEventListener("click", () => startLevel(Math.min(levels.length - 1, activeIndex + 1)));
retryBtn.addEventListener("click", () => {
  window.WonderAnalytics?.track("game_restart", {
    game_id: GAME_ID,
    stage: levels[activeIndex]?.id || activeIndex + 1,
    moves: state?.moves || 0,
    source: "result",
    locale: locale(),
  });
  startLevel(activeIndex);
});
trailsBtn.addEventListener("click", () => showStageSelect({ focusTrail: true }));
keepPlayingBtn.addEventListener("click", () => closeLeaveDecision());
leaveTrailBtn.addEventListener("click", leaveCurrentTrail);
leavePanel.addEventListener("keydown", (event) => containDecisionFocus(leavePanel, [keepPlayingBtn, leaveTrailBtn], event, () => closeLeaveDecision()));
resultPanel.addEventListener("keydown", (event) => {
  if (event.repeat && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    return;
  }
  if (event.key !== "Tab" || resultPanel.classList.contains("hidden")) return;
  const actions = [nextBtn, retryBtn, trailsBtn, lobbyLink].filter((action) => !action.classList.contains("hidden") && !action.disabled);
  if (!actions.length) return;
  const currentIndex = actions.indexOf(document.activeElement);
  const nextIndex = event.shiftKey
    ? (currentIndex <= 0 ? actions.length - 1 : currentIndex - 1)
    : (currentIndex < 0 || currentIndex >= actions.length - 1 ? 0 : currentIndex + 1);
  event.preventDefault();
  actions[nextIndex].focus({ preventScroll: true });
});

const pageSupportSelector = ".game-page-info, button[data-sound-toggle], .wp-tutorial-button";
const pageSupportObserver = new MutationObserver((records) => {
  const relevant = records.some((record) => {
    if (record.target instanceof Element && record.target.closest(pageSupportSelector)) return true;
    return [...record.addedNodes].some((node) => node instanceof Element && (node.matches(pageSupportSelector) || node.querySelector(pageSupportSelector)));
  });
  if (relevant) queueGamePageSupportSync();
});
pageSupportObserver.observe(document.body, { childList:true, subtree:true });
document.addEventListener("DOMContentLoaded", queueGamePageSupportSync, { once:true });
window.addEventListener("load", queueGamePageSupportSync, { once:true });
window.addEventListener("blur", suspendRouteHintReset);
window.addEventListener("focus", resumeRouteHintReset);
window.addEventListener("pagehide", suspendRouteHintReset);
window.addEventListener("pageshow", resumeRouteHintReset);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) suspendRouteHintReset();
  else resumeRouteHintReset();
});

ensureLocaleOptions();
renderStaticText();
queueGamePageSupportSync();
showMain();
preload();

if (new URLSearchParams(location.search).has("smoke")) {
  window.__animalRescueSmoke = {
    levels: structuredClone(levels),
    startLevel: (index) => {
      unlocked = levels.length;
      startLevel(index);
    },
    state: () => ({
      level: state.level.id,
      position: [...state.position],
      moves: state.moves,
      collected: state.collected,
      keysCollected: state.keysCollected,
      openedGates: [...state.openedGates],
    }),
  };
}
};

const initialLocale = window.WonderI18n?.actualLocale?.() || window.WonderI18n?.locale?.() || "en";
const needsRuntimeCatalog = !["en", "zh-Hant", "zh-Hans", "es"].includes(initialLocale);
if (needsRuntimeCatalog && document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
else boot();
})();
