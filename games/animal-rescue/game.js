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
const stageSelectTitle = document.querySelector("#stageSelectTitle");
const stageGrid = document.querySelector("#stageGrid");
const playArea = document.querySelector("#playArea");
const animalAvatar = document.querySelector("#animalAvatar");
const animalName = document.querySelector("#animalName");
const hintText = document.querySelector("#hintText");
const board = document.querySelector("#board");
const undoBtn = document.querySelector("#undoBtn");
const resetBtn = document.querySelector("#resetBtn");
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
    hint: "Tap the next tile to help the animal go home.",
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
    hint: "\u9ede\u4e0b\u4e00\u683c\u9053\u8def\uff0c\u5e6b\u52d5\u7269\u8d70\u56de\u5bb6\u3002",
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
  },
};

const assetBase = "../../assets/";

const animalAssets = {
  lion: { src: "tiny-weather-animal-lion.png", fallback: "Lion" },
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
};

const levels = [
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
].map((level, index) => ({ ...level, id: index + 1 }));

let unlocked = loadNumber(UNLOCK_KEY, 1);
let bestStars = loadBestStars();
let activeIndex = 0;
let state = makeState(levels[0]);

function locale() {
  return window.WonderI18n?.locale() || "en";
}

function t(key, params = {}) {
  const table = dictionary[locale()] || dictionary.en;
  return Object.entries(params).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), table[key] || dictionary.en[key] || key);
}

function makeState(level) {
  return {
    level,
    position: [...level.start],
    path: [[...level.start]],
    fruits: new Set(level.fruits.map(keyOf)),
    collected: 0,
    moves: 0,
    complete: false,
  };
}

function keyOf(pos) {
  return `${pos[0]},${pos[1]}`;
}

function loadNumber(key, fallback) {
  try {
    return Math.max(fallback, Number(localStorage.getItem(key)) || fallback);
  } catch {
    return fallback;
  }
}

function loadBestStars() {
  try {
    return JSON.parse(localStorage.getItem(BEST_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveProgress() {
  localStorage.setItem(UNLOCK_KEY, String(unlocked));
  localStorage.setItem(BEST_KEY, JSON.stringify(bestStars));
}

function renderStaticText() {
  document.documentElement.lang = locale();
  localeSelect.value = locale();
  languageLabel.textContent = t("language");
  titleText.textContent = t("title");
  stageLabel.textContent = t("stage");
  moveLabel.textContent = t("moves");
  fruitLabel.textContent = t("fruit");
  stageSelectTitle.textContent = t("chooseTrail");
  hintText.textContent = t("hint");
  undoBtn.textContent = t("undo");
  resetBtn.textContent = t("reset");
  nextBtn.textContent = t("next");
  retryBtn.textContent = t("retry");
  trailsBtn.textContent = t("trails");
  lobbyLink.textContent = t("lobby");
  loadingTitle.textContent = t("loading");
  renderStageSelect();
  renderBoard();
  updateHud();
}

function preload() {
  let percent = 0;
  const timer = setInterval(() => {
    percent += 20;
    loadingText.textContent = `${Math.min(100, percent)}%`;
    loadingFill.style.width = `${Math.min(100, percent)}%`;
    if (percent >= 100) {
      clearInterval(timer);
      loadingPanel.classList.add("hidden");
      window.WonderAnalytics?.track("game_ready", { game_id: GAME_ID });
    }
  }, 70);
}

function renderStageSelect() {
  stageGrid.innerHTML = levels
    .map((level) => {
      const locked = level.id > unlocked;
      const stars = bestStars[level.id] || 0;
      const animal = animalAssets[level.animal];
      return `
        <button class="stage-card ${locked ? "locked" : ""}" type="button" data-stage="${level.id}">
          <span class="mini-animal">${assetMarkup(animal, t(level.animal))}</span>
          <span>
            <strong>${level.id}. ${t(level.animal)}</strong>
            <span>${t(level.biome)} - ${locked ? t("locked") : stars ? t("complete") : t("start")}</span>
          </span>
          <span class="stage-stars">${"\u2605".repeat(stars)}${"\u2606".repeat(3 - stars)}</span>
        </button>
      `;
    })
    .join("");
}

function startLevel(index) {
  const level = levels[index];
  if (!level || level.id > unlocked) {
    showLocked();
    return;
  }
  activeIndex = index;
  state = makeState(level);
  stageSelect.classList.add("hidden");
  resultPanel.classList.add("hidden");
  playArea.classList.remove("hidden");
  hud.classList.remove("hidden");
  renderAvatar(level.animal);
  animalName.textContent = t(level.animal);
  renderBoard();
  updateHud();
  window.WonderSound?.play("start");
  window.WonderAnalytics?.track("game_start", { game_id: GAME_ID, stage: level.id, locale: locale() });
}

function showStageSelect() {
  playArea.classList.add("hidden");
  hud.classList.add("hidden");
  resultPanel.classList.add("hidden");
  stageSelect.classList.remove("hidden");
  renderStageSelect();
}

function showLocked() {
  window.WonderSound?.play("wrong");
  const original = stageSelectTitle.textContent;
  stageSelectTitle.textContent = t("lockedToast");
  setTimeout(() => {
    stageSelectTitle.textContent = original;
  }, 1200);
}

function renderBoard() {
  if (!board) return;
  const level = state.level;
  const blockSet = new Set(level.blocks.map(keyOf));
  const waterSet = new Set((level.water || []).map(keyOf));
  const pathSet = new Set(state.path.map(keyOf));
  const current = keyOf(state.position);
  board.innerHTML = "";
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const pos = [col, row];
      const key = keyOf(pos);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `tile ${tileClass(key, blockSet, waterSet, pathSet, current)}`;
      button.dataset.x = String(col);
      button.dataset.y = String(row);
      const icon = tileIcon(pos, key, blockSet, waterSet);
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
      button.setAttribute("aria-label", icon?.alt || "tile");
      board.append(button);
    }
  }
}

function tileClass(key, blockSet, waterSet, pathSet, current) {
  const classes = [];
  classes.push(waterSet.has(key) ? "water" : blockSet.has(key) ? "rock blocked" : "path");
  if (key === current) classes.push("current");
  if (pathSet.has(key) && key !== current) classes.push("visited");
  if (isNeighbor(key)) classes.push("next");
  return classes.join(" ");
}

function tileIcon(pos, key, blockSet, waterSet) {
  const level = state.level;
  if (key === keyOf(state.position)) return { asset: animalAssets[level.animal], alt: t(level.animal) };
  if (key === keyOf(level.home)) return { asset: tileAssets.home, alt: "home" };
  if (state.fruits.has(key)) return { asset: fruitAssets[(level.id + pos[0] + pos[1]) % fruitAssets.length], alt: "fruit" };
  if (blockSet.has(key)) return { asset: tileAssets.rock, alt: "rock" };
  if (waterSet.has(key)) return { asset: tileAssets.water, alt: "water" };
  return null;
}

function assetMarkup(asset, alt) {
  if (!asset) return "";
  return `<img src="${assetBase}${asset.src}" alt="${escapeHtml(alt || asset.fallback || "")}" loading="lazy" decoding="async" draggable="false" />`;
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
  return dx + dy === 1;
}

function moveTo(pos) {
  if (state.complete) return;
  const level = state.level;
  const key = keyOf(pos);
  const blocks = new Set(level.blocks.map(keyOf));
  const dx = Math.abs(pos[0] - state.position[0]);
  const dy = Math.abs(pos[1] - state.position[1]);
  if (dx + dy !== 1 || blocks.has(key)) {
    window.WonderSound?.play("wrong");
    hintText.textContent = t("wrongTile");
    setTimeout(() => {
      hintText.textContent = t("hint");
    }, 900);
    return;
  }
  state.position = pos;
  state.path.push([...pos]);
  state.moves += 1;
  if (state.fruits.delete(key)) {
    state.collected += 1;
    window.WonderSound?.play("coin");
  } else {
    window.WonderSound?.play("click");
  }
  if (key === keyOf(level.home)) finishLevel();
  renderBoard();
  updateHud();
}

function undoMove() {
  if (state.complete || state.path.length <= 1) return;
  state.path.pop();
  state.position = [...state.path[state.path.length - 1]];
  state.moves = Math.max(0, state.moves - 1);
  state.fruits = new Set(state.level.fruits.map(keyOf));
  state.collected = 0;
  for (const pos of state.path) {
    const key = keyOf(pos);
    if (state.fruits.delete(key)) state.collected += 1;
  }
  window.WonderSound?.play("click");
  renderBoard();
  updateHud();
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

function finishLevel() {
  state.complete = true;
  const level = state.level;
  const stars = calculateStars();
  bestStars[level.id] = Math.max(bestStars[level.id] || 0, stars);
  unlocked = Math.max(unlocked, Math.min(levels.length, level.id + 1));
  saveProgress();
  resultTitle.textContent = level.id === levels.length ? t("allClear") : t("trailClear");
  resultText.textContent = t("result", { animal: t(level.animal), fruit: state.collected, moves: state.moves });
  starLine.textContent = "\u2605".repeat(stars) + "\u2606".repeat(3 - stars);
  nextBtn.classList.toggle("hidden", level.id >= levels.length);
  resultPanel.classList.remove("hidden");
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
homeLink.addEventListener("click", (event) => {
  if (!stageSelect.classList.contains("hidden")) return;
  event.preventDefault();
  window.WonderSound?.play("click");
  showStageSelect();
});
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
undoBtn.addEventListener("click", undoMove);
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
trailsBtn.addEventListener("click", showStageSelect);

renderStaticText();
showStageSelect();
preload();
