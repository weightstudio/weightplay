const localeSelect = document.querySelector("#localeSelect");
const languageLabel = document.querySelector("#languageLabel");
const titleText = document.querySelector("#titleText");
const mainPanel = document.querySelector("#mainPanel");
const mainTitle = document.querySelector("#mainTitle");
const mainIntro = document.querySelector("#mainIntro");
const startGameBtn = document.querySelector("#startGameBtn");
const stageSelectPanel = document.querySelector("#stageSelectPanel");
const stageSelectTitle = document.querySelector("#stageSelectTitle");
const stageSetupTitle = document.querySelector("#stageSetupTitle");
const stageSetupText = document.querySelector("#stageSetupText");
const stageBackBtn = document.querySelector("#stageBackBtn");
const stageGrid = document.querySelector("#stageGrid");
const levelLine = document.querySelector(".level-line");
const levelText = document.querySelector("#levelText");
const levelFill = document.querySelector("#levelFill");
const quizStage = document.querySelector(".quiz-stage");
const animalImage = document.querySelector("#animalImage");
const promptText = document.querySelector("#promptText");
const clueText = document.querySelector("#clueText");
const choiceGrid = document.querySelector("#choiceGrid");
const feedback = document.querySelector(".feedback");
const feedbackText = document.querySelector("#feedbackText");
const resultPanel = document.querySelector("#resultPanel");
const backToStagesBtn = document.querySelector("#backToStagesBtn");
const resultTitle = document.querySelector("#resultTitle");
const resultText = document.querySelector("#resultText");
const skillReport = document.querySelector("#skillReport");
const againBtn = document.querySelector("#againBtn");
const nextStageBtn = document.querySelector("#nextStageBtn");
const stageSelectBtn = document.querySelector("#stageSelectBtn");
const homeLink = document.querySelector("#homeLink");
const homeText = document.querySelector("#homeText");
const loadingPanel = document.querySelector("#loadingPanel");
const loadingTitle = document.querySelector("#loadingTitle");
const loadingText = document.querySelector("#loadingText");
const loadingFill = document.querySelector("#loadingFill");

const pageMeta = {
  en: {
    title: "Animal Quiz - WeightPlay",
    description: "Play Animal Quiz on WeightPlay, a family-friendly animal knowledge game with picture-supported questions about habitats, features, and animal facts.",
  },
  "zh-Hant": {
    title: "\u52d5\u7269\u5c0f\u535a\u58eb - WeightPlay",
    description: "\u5728 WeightPlay \u904a\u73a9\u52d5\u7269\u5c0f\u535a\u58eb\uff0c\u900f\u904e\u5716\u7247\u984c\u76ee\u8a8d\u8b58\u52d5\u7269\u68f2\u606f\u5730\u3001\u5916\u5f62\u7279\u5fb5\u8207\u751f\u6d3b\u5c0f\u77e5\u8b58\u3002",
  },
};

const GAME_ID = "animal-quiz";
const UNLOCK_KEY = "animalQuizUnlockedStage";
const PROGRESS_KEY = "animalQuizProgress";

const dictionary = {
  en: {
    title: "Animal Quiz",
    language: "Language",
    mainIntro: "Read picture clues and discover animal facts.",
    startGame: "Start Game",
    chooseStage: "Choose Stage",
    stageSetupTitle: "Pick an animal topic",
    stageSetupText: "Choose an unlocked topic to begin.",
    start: "Start",
    locked: "Locked",
    complete: "Complete",
    stageBest: "Best {score} / {total}",
    prompt: "Who is this animal?",
    choose: "Choose one",
    correct: "Correct!",
    wrong: "Try again",
    animalNote: "Animal note: {animal} - {clue}",
    loading: "Loading",
    loadingFailed: "Load failed. Please refresh and try again.",
    question: "{stage}  {current} / {total}",
    winTitle: "Stage Clear!",
    winText: "You answered {score} / {total}.",
    allClearTitle: "All Clear!",
    allClearText: "You cleared all {count} animal stages.",
    again: "Play Again",
    nextStage: "Next Stage",
    stages: "Stages",
    lobby: "Lobby",
    reportTitle: "Skill Report",
    previousBest: "Previous Best",
    todayScore: "Today's Score",
    improvement: "Improvement",
    animalKnowledge: "Animal Knowledge",
    memory: "Memory",
    reading: "Reading",
    reportGreat: "Great job! Your animal recognition was strong, and you used the clues well.",
    reportGood: "Good effort! Try again to become more familiar with animal features.",
    reportTry: "Nice practice! Look slowly at the picture and clue, then try again.",
    stageAfrica: "Stage 1: African Animals",
    stageAsia: "Stage 2: Asian Animals",
    stageOceanHome: "Stage 3: Ocean & Home Animals",
    stageForest: "Stage 4: Forest Friends",
    stageFarm: "Stage 5: Farm & Night Animals",
    stageActions: "Stage 6: Animal Actions",
    stageAfricaDesc: "Meet animals from grasslands, rivers, and warm habitats.",
    stageAsiaDesc: "Guess animals from forests, mountains, and nearby nature.",
    stageOceanHomeDesc: "Find animals from the sea and animals kids see often.",
    stageForestDesc: "Practice animals from forests, bamboo groves, ponds, and trees.",
    stageFarmDesc: "Review familiar farm animals and animals that move at night.",
    stageActionsDesc: "Use movement and behavior clues to identify each animal.",
    lion: "Lion",
    hippo: "Hippo",
    snake: "Snake",
    rabbit: "Rabbit",
    turtle: "Turtle",
    elephant: "Elephant",
    penguin: "Penguin",
    monkey: "Monkey",
    bear: "Bear",
    cat: "Cat",
    dog: "Dog",
    fox: "Fox",
    giraffe: "Giraffe",
    zebra: "Zebra",
    panda: "Panda",
    koala: "Koala",
    frog: "Frog",
    whale: "Whale",
    owl: "Owl",
    cow: "Cow",
    clueLion: "I have a big mane.",
    clueHippo: "I love water and have a huge mouth.",
    clueSnake: "I slither on the ground.",
    clueRabbit: "I have long ears and hop.",
    clueTurtle: "I carry a shell on my back.",
    clueElephant: "I have a long trunk.",
    cluePenguin: "I am a bird that waddles.",
    clueMonkey: "I climb and swing.",
    clueBear: "I am big, furry, and strong.",
    clueCat: "I say meow and have whiskers.",
    clueDog: "I bark and wag my tail.",
    clueFox: "I have orange fur and a fluffy tail.",
    clueGiraffe: "I have a very long neck.",
    clueZebra: "I have black and white stripes.",
    cluePanda: "I am black and white and love bamboo.",
    clueKoala: "I hug trees and have round ears.",
    clueFrog: "I jump and say ribbit.",
    clueWhale: "I am a huge animal in the ocean.",
    clueOwl: "I am a bird with big eyes.",
    clueCow: "I say moo and give milk.",
    actionLion: "I rest and travel with a group called a pride.",
    actionElephant: "I use my trunk to spray water.",
    actionPenguin: "I huddle close to other penguins to stay warm.",
    actionMonkey: "I use my hands to climb and explore branches.",
    actionRabbit: "I thump my back feet when danger is near.",
    actionTurtle: "I pull my head into my shell when I feel worried.",
    actionFrog: "I leap and catch insects with my long tongue.",
    actionOwl: "I fly quietly and hunt after sunset.",
    actionCow: "I spend much of the day slowly chewing grass.",
    actionWhale: "I swim to the surface to breathe through my blowhole.",
  },
  "zh-Hant": {
    title: "\u52d5\u7269\u5c0f\u535a\u58eb",
    language: "\u8a9e\u8a00",
    mainIntro: "\u770b\u5716\u7247\u7dda\u7d22\uff0c\u4e00\u8d77\u8a8d\u8b58\u52d5\u7269\u5c0f\u77e5\u8b58\u3002",
    startGame: "\u958b\u59cb\u904a\u6232",
    chooseStage: "\u9078\u64c7\u95dc\u5361",
    stageSetupTitle: "\u9078\u4e00\u500b\u52d5\u7269\u4e3b\u984c",
    stageSetupText: "\u9078\u64c7\u5df2\u89e3\u9396\u7684\u4e3b\u984c\u958b\u59cb\u7b54\u984c\u3002",
    start: "\u958b\u59cb",
    locked: "\u672a\u89e3\u9396",
    complete: "\u5df2\u5b8c\u6210",
    stageBest: "\u6700\u4f73 {score} / {total}",
    prompt: "\u9019\u662f\u4ec0\u9ebc\u52d5\u7269\uff1f",
    choose: "\u9078\u4e00\u500b\u7b54\u6848",
    correct: "\u7b54\u5c0d\u4e86\uff01",
    wrong: "\u518d\u89c0\u5bdf\u4e00\u6b21",
    animalNote: "\u52d5\u7269\u5c0f\u77e5\u8b58\uff1a{animal}\uff0c{clue}",
    loading: "\u8f09\u5165\u4e2d",
    loadingFailed: "\u8f09\u5165\u5931\u6557\uff0c\u8acb\u91cd\u65b0\u6574\u7406\u5f8c\u518d\u8a66\u3002",
    question: "{stage}  {current} / {total}",
    winTitle: "\u95dc\u5361\u5b8c\u6210\uff01",
    winText: "\u4f60\u7b54\u5c0d {score} / {total} \u984c\u3002",
    allClearTitle: "\u5168\u90e8\u5b8c\u6210\uff01",
    allClearText: "\u4f60\u5b8c\u6210\u5168\u90e8 {count} \u500b\u52d5\u7269\u95dc\u5361\u3002",
    again: "\u518d\u73a9\u4e00\u6b21",
    nextStage: "\u4e0b\u4e00\u95dc",
    stages: "\u95dc\u5361",
    lobby: "\u5927\u5ef3",
    reportTitle: "\u80fd\u529b\u5831\u544a",
    previousBest: "\u4e4b\u524d\u6700\u4f73",
    todayScore: "\u4eca\u5929\u5206\u6578",
    improvement: "\u9032\u6b65\u5e45\u5ea6",
    animalKnowledge: "\u52d5\u7269\u8a8d\u8b58",
    memory: "\u8a18\u61b6\u529b",
    reading: "\u95b1\u8b80",
    reportGreat: "\u592a\u68d2\u4e86\uff01\u4f60\u5f88\u6703\u8fa8\u8a8d\u52d5\u7269\uff0c\u4e5f\u6709\u597d\u597d\u4f7f\u7528\u63d0\u793a\u7dda\u7d22\u3002",
    reportGood: "\u5f88\u597d\u7684\u7df4\u7fd2\uff01\u518d\u73a9\u4e00\u6b21\uff0c\u4f60\u6703\u66f4\u719f\u6089\u52d5\u7269\u7279\u5fb5\u3002",
    reportTry: "\u4e0d\u932f\u7684\u7df4\u7fd2\uff01\u6162\u6162\u770b\u5716\u7247\u548c\u7dda\u7d22\uff0c\u518d\u8a66\u4e00\u6b21\u3002",
    stageAfrica: "\u7b2c 1 \u95dc\uff1a\u975e\u6d32\u52d5\u7269",
    stageAsia: "\u7b2c 2 \u95dc\uff1a\u4e9e\u6d32\u52d5\u7269",
    stageOceanHome: "\u7b2c 3 \u95dc\uff1a\u6d77\u6d0b\u8207\u5bb6\u5ead\u52d5\u7269",
    stageForest: "\u7b2c 4 \u95dc\uff1a\u68ee\u6797\u670b\u53cb",
    stageFarm: "\u7b2c 5 \u95dc\uff1a\u8fb2\u5834\u8207\u591c\u9593\u52d5\u7269",
    stageActions: "\u7b2c 6 \u95dc\uff1a\u52d5\u7269\u884c\u52d5",
    stageAfricaDesc: "\u8a8d\u8b58\u8349\u539f\u3001\u6cb3\u908a\u548c\u6eab\u6696\u68f2\u5730\u7684\u52d5\u7269\u3002",
    stageAsiaDesc: "\u731c\u731c\u68ee\u6797\u3001\u5c71\u5730\u548c\u5468\u570d\u81ea\u7136\u88e1\u7684\u52d5\u7269\u3002",
    stageOceanHomeDesc: "\u627e\u51fa\u6d77\u88e1\u7684\u52d5\u7269\uff0c\u4ee5\u53ca\u5b69\u5b50\u5e38\u898b\u7684\u52d5\u7269\u3002",
    stageForestDesc: "\u7df4\u7fd2\u68ee\u6797\u3001\u7af9\u6797\u3001\u6c60\u5858\u548c\u6a39\u4e0a\u7684\u52d5\u7269\u3002",
    stageFarmDesc: "\u8907\u7fd2\u719f\u6089\u7684\u8fb2\u5834\u52d5\u7269\uff0c\u548c\u591c\u9593\u6d3b\u52d5\u7684\u52d5\u7269\u3002",
    stageActionsDesc: "\u6839\u64da\u79fb\u52d5\u548c\u884c\u70ba\u7dda\u7d22\uff0c\u627e\u51fa\u6b63\u78ba\u7684\u52d5\u7269\u3002",
    lion: "\u7345\u5b50",
    hippo: "\u6cb3\u99ac",
    snake: "\u86c7",
    rabbit: "\u5154\u5b50",
    turtle: "\u70cf\u9f9c",
    elephant: "\u5927\u8c61",
    penguin: "\u4f01\u9d5d",
    monkey: "\u7334\u5b50",
    bear: "\u718a",
    cat: "\u8c93",
    dog: "\u72d7",
    fox: "\u72d0\u72f8",
    giraffe: "\u9577\u9838\u9e7f",
    zebra: "\u6591\u99ac",
    panda: "\u8c93\u718a",
    koala: "\u7121\u5c3e\u718a",
    frog: "\u9752\u86d9",
    whale: "\u9be8\u9b5a",
    owl: "\u8c93\u982d\u9df9",
    cow: "\u725b",
    clueLion: "\u6211\u6709\u5927\u5927\u7684\u9b03\u6bdb\u3002",
    clueHippo: "\u6211\u559c\u6b61\u6c34\uff0c\u6709\u5f88\u5927\u7684\u5634\u5df4\u3002",
    clueSnake: "\u6211\u6703\u5728\u5730\u4e0a\u6ed1\u884c\u3002",
    clueRabbit: "\u6211\u6709\u9577\u8033\u6735\uff0c\u6703\u8df3\u8df3\u3002",
    clueTurtle: "\u6211\u80cc\u4e0a\u6709\u5805\u786c\u7684\u6bbc\u3002",
    clueElephant: "\u6211\u6709\u9577\u9577\u7684\u9f3b\u5b50\u3002",
    cluePenguin: "\u6211\u662f\u6703\u6416\u6416\u8d70\u8def\u7684\u9ce5\u3002",
    clueMonkey: "\u6211\u6703\u722c\u6a39\uff0c\u4e5f\u6703\u8569\u4f86\u8569\u53bb\u3002",
    clueBear: "\u6211\u5f88\u5927\u3001\u6bdb\u8338\u8338\uff0c\u4e5f\u5f88\u5f37\u58ef\u3002",
    clueCat: "\u6211\u6703\u55b5\u55b5\u53eb\uff0c\u9084\u6709\u9b0d\u9b1a\u3002",
    clueDog: "\u6211\u6703\u6c6a\u6c6a\u53eb\uff0c\u4e5f\u6703\u6416\u5c3e\u5df4\u3002",
    clueFox: "\u6211\u6709\u6a58\u8272\u7684\u6bdb\u548c\u84ec\u9b06\u7684\u5c3e\u5df4\u3002",
    clueGiraffe: "\u6211\u6709\u975e\u5e38\u9577\u7684\u8116\u5b50\u3002",
    clueZebra: "\u6211\u6709\u9ed1\u767d\u689d\u7d0b\u3002",
    cluePanda: "\u6211\u662f\u9ed1\u767d\u8272\uff0c\u559c\u6b61\u5403\u7af9\u5b50\u3002",
    clueKoala: "\u6211\u559c\u6b61\u62b1\u8457\u6a39\uff0c\u8033\u6735\u5713\u5713\u7684\u3002",
    clueFrog: "\u6211\u6703\u8df3\uff0c\u4e5f\u6703\u5471\u5471\u53eb\u3002",
    clueWhale: "\u6211\u662f\u751f\u6d3b\u5728\u6d77\u88e1\u7684\u5de8\u5927\u52d5\u7269\u3002",
    clueOwl: "\u6211\u662f\u6709\u5927\u773c\u775b\u7684\u9ce5\u3002",
    clueCow: "\u6211\u6703\u54de\u54de\u53eb\uff0c\u4e5f\u6703\u63d0\u4f9b\u725b\u5976\u3002",
    actionLion: "\u6211\u6703\u548c\u7345\u7fa4\u4e00\u8d77\u4f11\u606f\u548c\u884c\u52d5\u3002",
    actionElephant: "\u6211\u6703\u7528\u9577\u9f3b\u5b50\u5674\u6c34\u3002",
    actionPenguin: "\u6211\u6703\u548c\u5176\u4ed6\u4f01\u9d5d\u64e0\u5728\u4e00\u8d77\u4fdd\u6696\u3002",
    actionMonkey: "\u6211\u6703\u7528\u96d9\u624b\u722c\u6a39\u548c\u63a2\u7d22\u6a39\u679d\u3002",
    actionRabbit: "\u767c\u73fe\u5371\u96aa\u6642\uff0c\u6211\u6703\u7528\u5f8c\u8173\u7528\u529b\u8e6c\u5730\u3002",
    actionTurtle: "\u89ba\u5f97\u5bb3\u6015\u6642\uff0c\u6211\u6703\u628a\u982d\u7e2e\u9032\u6bbc\u88e1\u3002",
    actionFrog: "\u6211\u6703\u8df3\u8e8d\uff0c\u4e5f\u6703\u7528\u9577\u820c\u982d\u6349\u87f2\u3002",
    actionOwl: "\u6211\u6703\u5b89\u975c\u98db\u884c\uff0c\u5728\u65e5\u843d\u5f8c\u7375\u98df\u3002",
    actionCow: "\u6211\u6bcf\u5929\u6703\u82b1\u5f88\u591a\u6642\u9593\u6162\u6162\u5480\u56bc\u7267\u8349\u3002",
    actionWhale: "\u6211\u6703\u6e38\u5230\u6c34\u9762\uff0c\u7528\u982d\u9802\u7684\u547c\u5438\u5b54\u63db\u6c23\u3002",
  },
};

const animals = [
  { id: "lion", image: "assets/premium/lion.webp", clue: "clueLion" },
  { id: "hippo", image: "assets/premium/hippo.webp", clue: "clueHippo" },
  { id: "snake", image: "assets/premium/snake.webp", clue: "clueSnake" },
  { id: "rabbit", image: "assets/premium/rabbit.webp", clue: "clueRabbit" },
  { id: "turtle", image: "assets/premium/turtle.webp", clue: "clueTurtle" },
  { id: "elephant", image: "assets/premium/elephant.webp", clue: "clueElephant" },
  { id: "penguin", image: "assets/premium/penguin.webp", clue: "cluePenguin" },
  { id: "monkey", image: "assets/premium/monkey.webp", clue: "clueMonkey" },
  { id: "bear", image: "assets/premium/bear.webp", clue: "clueBear" },
  { id: "cat", image: "assets/premium/cat.webp", clue: "clueCat" },
  { id: "dog", image: "assets/premium/dog.webp", clue: "clueDog" },
  { id: "fox", image: "assets/premium/fox.webp", clue: "clueFox" },
  { id: "giraffe", image: "assets/premium/giraffe.webp", clue: "clueGiraffe" },
  { id: "zebra", image: "assets/premium/zebra.webp", clue: "clueZebra" },
  { id: "panda", image: "assets/premium/panda.webp", clue: "cluePanda" },
  { id: "koala", image: "assets/premium/koala.webp", clue: "clueKoala" },
  { id: "frog", image: "assets/premium/frog.webp", clue: "clueFrog" },
  { id: "whale", image: "assets/premium/whale.webp", clue: "clueWhale" },
  { id: "owl", image: "assets/premium/owl.webp", clue: "clueOwl" },
  { id: "cow", image: "assets/premium/cow.webp", clue: "clueCow" },
];

const animalMap = new Map(animals.map((animal) => [animal.id, animal]));

const stages = [
  {
    name: "stageAfrica",
    description: "stageAfricaDesc",
    questions: ["lion", "hippo", "elephant", "giraffe", "zebra", "monkey", "snake", "turtle", "frog", "owl"],
  },
  {
    name: "stageAsia",
    description: "stageAsiaDesc",
    questions: ["panda", "elephant", "monkey", "snake", "turtle", "rabbit", "bear", "fox", "owl", "frog"],
  },
  {
    name: "stageOceanHome",
    description: "stageOceanHomeDesc",
    questions: ["whale", "penguin", "frog", "turtle", "cow", "cat", "dog", "rabbit", "owl", "fox"],
  },
  {
    name: "stageForest",
    description: "stageForestDesc",
    questions: ["bear", "fox", "owl", "frog", "rabbit", "panda", "koala", "monkey", "snake", "turtle"],
  },
  {
    name: "stageFarm",
    description: "stageFarmDesc",
    questions: ["cow", "dog", "cat", "rabbit", "owl", "fox", "frog", "turtle", "penguin", "whale"],
  },
  {
    name: "stageActions",
    description: "stageActionsDesc",
    questions: ["lion", "elephant", "penguin", "monkey", "rabbit", "turtle", "frog", "owl", "cow", "whale"],
    clues: {
      lion: "actionLion",
      elephant: "actionElephant",
      penguin: "actionPenguin",
      monkey: "actionMonkey",
      rabbit: "actionRabbit",
      turtle: "actionTurtle",
      frog: "actionFrog",
      owl: "actionOwl",
      cow: "actionCow",
      whale: "actionWhale",
    },
  },
];

const state = {
  stageIndex: 0,
  questionIndex: 0,
  score: 0,
  ready: false,
  answered: false,
  completed: false,
  unlockedStage: 0,
};
let stageDrag = null;
let suppressStageClick = false;

function locale() {
  return window.WonderI18n?.locale() || "en";
}

function t(key, params = {}) {
  const table = dictionary[locale()] || dictionary.en;
  const fallback = dictionary.en;
  return Object.entries(params).reduce((text, [name, value]) => {
    return text.replaceAll(`{${name}}`, String(value));
  }, table[key] || fallback[key] || key);
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function preloadImageWithTimeout(src, timeoutMs = 900) {
  let settled = false;
  return new Promise((resolve) => {
    const image = new Image();
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve(image);
    };
    image.onload = finish;
    image.onerror = finish;
    image.src = src;
    window.setTimeout(finish, timeoutMs);
  });
}

function loadUnlockedStage() {
  const saved = Number(localStorage.getItem(UNLOCK_KEY));
  state.unlockedStage = Number.isFinite(saved) ? Math.min(saved, stages.length - 1) : 0;
}

function saveUnlockedStage(value) {
  state.unlockedStage = Math.max(state.unlockedStage, Math.min(value, stages.length - 1));
  localStorage.setItem(UNLOCK_KEY, String(state.unlockedStage));
}

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress(stageKey, entry) {
  const progress = loadProgress();
  progress[stageKey] = entry;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function stars(value) {
  const count = Math.max(1, Math.min(5, value));
  return `${"★".repeat(count)}${"☆".repeat(5 - count)}`;
}

function scoreStars(score, total, offset = 0) {
  return Math.max(1, Math.min(5, Math.ceil((score / total) * 5) + offset));
}

async function preloadGame() {
  let loadedCount = 0;
  await Promise.all(
    animals.map((animal) =>
      preloadImageWithTimeout(animal.image).then(() => {
        loadedCount += 1;
        const percent = Math.round((loadedCount / animals.length) * 100);
        loadingText.textContent = `${percent}%`;
        loadingFill.style.width = `${percent}%`;
      }),
    ),
  );
  state.ready = true;
  loadUnlockedStage();
  loadingPanel.classList.add("hidden");
  window.WonderAnalytics?.track("game_ready", { game_id: GAME_ID });
  showMain();
}

function scheduleReadinessFallback() {
  window.setTimeout(() => {
    if (state.ready) return;
    state.ready = true;
    loadUnlockedStage();
    loadingPanel.classList.add("hidden");
    showMain();
  }, 1800);
}

function renderStaticText() {
  document.documentElement.lang = locale();
  localeSelect.value = locale();
  languageLabel.textContent = t("language");
  titleText.textContent = t("title");
  mainTitle.textContent = t("title");
  mainIntro.textContent = t("mainIntro");
  startGameBtn.textContent = t("startGame");
  stageSelectTitle.textContent = t("chooseStage");
  stageSetupTitle.textContent = t("stageSetupTitle");
  stageSetupText.textContent = t("stageSetupText");
  promptText.textContent = t("prompt");
  feedbackText.textContent = t("choose");
  loadingTitle.textContent = t("loading");
  againBtn.textContent = t("again");
  nextStageBtn.textContent = t("nextStage");
  stageSelectBtn.textContent = t("stages");
  homeText.textContent = t("lobby");
  const meta = pageMeta[locale()] || pageMeta.en;
  document.title = meta.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", meta.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", meta.description);
}

function setQuizVisible(isVisible) {
  stageSelectPanel.classList.toggle("hidden", isVisible);
  levelLine.classList.toggle("hidden", !isVisible);
  quizStage.classList.toggle("hidden", !isVisible);
  choiceGrid.classList.toggle("hidden", !isVisible);
  feedback.classList.toggle("hidden", !isVisible);
}

function setBattleCovered(covered) {
  [quizStage, choiceGrid, feedback].forEach((region) => {
    region.inert = covered;
    region.setAttribute("aria-hidden", String(covered));
  });
}

function showMain() {
  renderStaticText();
  state.completed = false;
  document.body.classList.remove("quiz-playing", "quiz-stage-select");
  document.body.classList.add("quiz-main");
  resultPanel.classList.add("hidden");
  setBattleCovered(false);
  mainPanel.classList.remove("hidden");
  setQuizVisible(false);
  stageSelectPanel.classList.add("hidden");
  updateQuizFrame();
}

function updateQuizFrame() {
  if (!document.body.classList.contains("quiz-playing") && !document.body.classList.contains("quiz-stage-select")) return;
  const viewport = window.visualViewport;
  const visualWidth = Math.round(viewport?.width || 0);
  const visualHeight = Math.round(viewport?.height || 0);
  const useVisual = visualWidth > 0
    && visualHeight > 0
    && Math.abs(visualWidth - innerWidth) <= 2
    && visualHeight <= innerHeight + 2;
  const root = document.documentElement.style;
  const width = useVisual ? visualWidth : innerWidth;
  const height = useVisual ? visualHeight : innerHeight;
  const scale = Math.min(Math.max(1, width - 8) / 390, Math.max(1, height - 8) / 788);
  root.setProperty("--quiz-vw", `${width}px`);
  root.setProperty("--quiz-vh", `${height}px`);
  root.setProperty("--quiz-frame-scale", String(scale));
  root.setProperty("--quiz-frame-left", `${(width - 390 * scale) / 2}px`);
  root.setProperty("--quiz-frame-top", `${height - 788 * scale - 4}px`);
}

window.addEventListener?.("resize", updateQuizFrame, { passive: true });
window.addEventListener?.("orientationchange", updateQuizFrame, { passive: true });
window.visualViewport?.addEventListener("resize", updateQuizFrame, { passive: true });

function showStageSelect(focusStageIndex = state.unlockedStage) {
  renderStaticText();
  state.completed = false;
  resultPanel.classList.add("hidden");
  setBattleCovered(false);
  document.body.classList.remove("quiz-playing", "quiz-main");
  document.body.classList.add("quiz-stage-select");
  mainPanel.classList.add("hidden");
  updateQuizFrame();
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  setQuizVisible(false);
  renderStageCards();
  centerLatestUnlockedStage(focusStageIndex);
  window.requestAnimationFrame(() => {
    centerLatestUnlockedStage(focusStageIndex, true);
  });
}

function renderStageCards() {
  const progress = loadProgress();
  stageGrid.replaceChildren(
    ...stages.map((stage, index) => {
      const isUnlocked = index <= state.unlockedStage;
      const stageProgress = progress[String(index)] || {};
      // Older saves only recorded a play count after a cleared stage.
      const isComplete = Boolean(stageProgress.cleared || stageProgress.playCount);
      const total = stage.questions.length;
      const bestScore = Math.min(Number(stageProgress.bestScore) || 0, total);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `stage-card ${isUnlocked ? "unlocked" : "locked"}`;
      button.dataset.stageIndex = String(index);
      button.disabled = !isUnlocked;
      button.innerHTML = `
        <span>${isComplete ? t("complete") : isUnlocked ? t("start") : t("locked")}</span>
        <strong>${t(stage.name)}</strong>
        <small>${t(stage.description)}</small>
        ${isComplete ? `<em>${t("stageBest", { score: bestScore, total })} ${stars(scoreStars(bestScore, total))}</em>` : ""}
      `;
      button.addEventListener("click", () => startStage(index));
      return button;
    }),
  );
}

function centerLatestUnlockedStage(stageIndex = state.unlockedStage, shouldFocus = false) {
  const unlockedCards = [...stageGrid.querySelectorAll(".stage-card.unlocked")];
  const target = stageGrid.querySelector(`.stage-card.unlocked[data-stage-index="${stageIndex}"]`) || unlockedCards.at(-1);
  if (!target) return;
  const desired = target.offsetLeft + target.offsetWidth / 2 - stageGrid.clientWidth / 2;
  stageGrid.scrollLeft = Math.max(0, Math.min(desired, stageGrid.scrollWidth - stageGrid.clientWidth));
  if (shouldFocus) target.focus({ preventScroll: true });
}

function settleStageRail() {
  const cards = [...stageGrid.querySelectorAll(".stage-card")];
  if (!cards.length) return;
  const center = stageGrid.scrollLeft + stageGrid.clientWidth / 2;
  const nearest = cards.reduce((best, card) => {
    const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
    return !best || distance < best.distance ? { card, distance } : best;
  }, null)?.card;
  nearest?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
}

function initStageRail() {
  stageGrid.addEventListener("pointerdown", (event) => {
    if (!document.body.classList.contains("quiz-stage-select") || event.button !== 0 || event.isPrimary === false) return;
    stageDrag = { id: event.pointerId, x: event.clientX, scroll: stageGrid.scrollLeft, moved: false };
  });
  stageGrid.addEventListener("pointermove", (event) => {
    if (!stageDrag || stageDrag.id !== event.pointerId) return;
    const delta = event.clientX - stageDrag.x;
    if (!stageDrag.moved && Math.abs(delta) < 8) return;
    if (!stageDrag.moved) {
      stageDrag.moved = true;
      stageGrid.setPointerCapture?.(event.pointerId);
      stageGrid.style.setProperty("scroll-snap-type", "none", "important");
    }
    const rect = stageGrid.getBoundingClientRect();
    const coordinateScale = rect.width > 0 ? stageGrid.clientWidth / rect.width : 1;
    stageGrid.scrollLeft = stageDrag.scroll - delta * coordinateScale;
    event.preventDefault();
  });
  const finish = (event) => {
    if (!stageDrag || stageDrag.id !== event.pointerId) return;
    const moved = stageDrag.moved;
    if (moved) stageGrid.releasePointerCapture?.(event.pointerId);
    stageDrag = null;
    stageGrid.style.removeProperty("scroll-snap-type");
    if (!moved) return;
    suppressStageClick = true;
    settleStageRail();
    setTimeout(() => { suppressStageClick = false; }, 0);
  };
  stageGrid.addEventListener("pointerup", finish);
  stageGrid.addEventListener("pointercancel", finish);
  stageGrid.addEventListener("click", (event) => {
    if (!suppressStageClick) return;
    suppressStageClick = false;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
  stageGrid.addEventListener("dragstart", (event) => event.preventDefault());
}

function startStage(stageIndex) {
  if (!state.ready || stageIndex > state.unlockedStage) return;
  state.stageIndex = stageIndex;
  state.questionIndex = 0;
  state.score = 0;
  state.completed = false;
  resultPanel.classList.add("hidden");
  setBattleCovered(false);
  mainPanel.classList.add("hidden");
  setQuizVisible(true);
  document.body.classList.remove("quiz-main", "quiz-stage-select");
  document.body.classList.add("quiz-playing");
  updateQuizFrame();
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  window.WeightPlayGame?.exitMobileGameMode?.();
  quizStage.classList.remove("weightplay-active-viewport");
  window.WonderAnalytics?.track("game_start", {
    game_id: GAME_ID,
    stage: stageIndex + 1,
    locale: locale(),
  });
  renderQuestion({ focusChoices: true });
}

function currentStage() {
  return stages[state.stageIndex];
}

function currentAnimal() {
  return animalMap.get(currentStage().questions[state.questionIndex]);
}

function currentClueKey(animal = currentAnimal()) {
  return currentStage().clues?.[animal.id] || animal.clue;
}

function buildChoices(answer) {
  const others = shuffle(animals.filter((animal) => animal.id !== answer.id)).slice(0, 2);
  return shuffle([answer, ...others]);
}

function renderQuestion(options = {}) {
  const shouldTrack = options.track !== false;
  const shouldFocus = options.focusChoices === true;
  renderStaticText();
  const stage = currentStage();
  const animal = currentAnimal();
  const total = stage.questions.length;
  state.answered = false;
  levelText.textContent = t("question", {
    stage: t(stage.name),
    current: state.questionIndex + 1,
    total,
  });
  levelFill.style.width = `${(state.questionIndex / total) * 100}%`;
  animalImage.src = animal.image;
  animalImage.alt = t(animal.id);
  clueText.textContent = t(currentClueKey(animal));
  feedbackText.textContent = t("choose");
  choiceGrid.setAttribute("aria-busy", "false");

  choiceGrid.replaceChildren(
    ...buildChoices(animal).map((choice) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = t(choice.id);
      button.addEventListener("click", () => chooseAnswer(choice.id, animal.id, button));
      return button;
    }),
  );

  if (shouldFocus) requestAnimationFrame(() => choiceGrid.querySelector("button")?.focus({ preventScroll: true }));

  if (shouldTrack) {
    window.WonderAnalytics?.track("level_start", {
      game_id: GAME_ID,
      stage: state.stageIndex + 1,
      question: state.questionIndex + 1,
      animal: animal.id,
      locale: locale(),
    });
  }
}

function chooseAnswer(choiceId, answerId, button) {
  if (state.answered) return;

  if (choiceId !== answerId) {
    window.WonderSound?.play("wrong");
    feedbackText.textContent = t("wrong");
    button.classList.add("wrong");
    button.setAttribute("aria-invalid", "true");
    setTimeout(() => {
      button.classList.remove("wrong");
      button.removeAttribute("aria-invalid");
    }, 350);
    window.WonderAnalytics?.track("level_answer", {
      game_id: GAME_ID,
      result: "wrong",
      stage: state.stageIndex + 1,
      question: state.questionIndex + 1,
      answer: answerId,
      choice: choiceId,
      locale: locale(),
    });
    return;
  }

  state.answered = true;
  choiceGrid.setAttribute("aria-busy", "true");
  choiceGrid.querySelectorAll("button").forEach((choice) => { choice.disabled = true; });
  state.score += 1;
  window.WonderSound?.play("success");
  const answeredAnimal = animalMap.get(answerId);
  feedbackText.textContent = answeredAnimal
    ? t("animalNote", {
        animal: t(answeredAnimal.id),
        clue: t(currentClueKey(answeredAnimal)),
      })
    : t("correct");
  button.classList.add("correct");
  window.WonderAnalytics?.track("level_complete", {
    game_id: GAME_ID,
    stage: state.stageIndex + 1,
    question: state.questionIndex + 1,
    animal: answerId,
    locale: locale(),
  });

  setTimeout(() => {
    state.questionIndex += 1;
    if (state.questionIndex >= currentStage().questions.length) {
      finishStage();
    } else {
      renderQuestion({ focusChoices: true });
    }
  }, 620);
}

function finishStage() {
  const isFinalStage = state.stageIndex >= stages.length - 1;
  state.completed = true;
  levelFill.style.width = "100%";
  saveUnlockedStage(state.stageIndex + 1);
  updateProgress();
  renderResultText();
  nextStageBtn.classList.toggle("hidden", isFinalStage);
  resultPanel.classList.remove("hidden");
  setBattleCovered(true);
  requestAnimationFrame(() => (isFinalStage ? againBtn : nextStageBtn).focus({ preventScroll: true }));
  window.WonderSound?.play("win");
  window.WonderAnalytics?.track("game_complete", {
    game_id: GAME_ID,
    stage: state.stageIndex + 1,
    score: state.score,
    total_questions: currentStage().questions.length,
    locale: locale(),
  });
}

function renderResultText() {
  const isFinalStage = state.stageIndex >= stages.length - 1;
  resultTitle.textContent = isFinalStage ? t("allClearTitle") : t("winTitle");
  resultText.textContent = isFinalStage
    ? t("allClearText", { count: stages.length })
    : t("winText", { score: state.score, total: currentStage().questions.length });
  renderSkillReport();
}

function updateProgress() {
  const stageKey = String(state.stageIndex);
  const total = currentStage().questions.length;
  const progress = loadProgress();
  const previous = progress[stageKey] || {};
  const previousBest = Number(previous.bestScore) || 0;
  const bestScore = Math.max(previousBest, state.score);
  const improvementPercent = previousBest > 0 ? Math.round(((state.score - previousBest) / previousBest) * 100) : state.score > 0 ? 100 : 0;
  saveProgress(stageKey, {
    cleared: true,
    lastScore: state.score,
    bestScore,
    previousBest,
    playCount: (Number(previous.playCount) || 0) + 1,
    lastPlayedAt: new Date().toISOString(),
    improvementPercent,
    total,
  });
}

function renderSkillReport() {
  const stageKey = String(state.stageIndex);
  const total = currentStage().questions.length;
  const progress = loadProgress()[stageKey] || {};
  const previousBest = Number(progress.previousBest) || 0;
  const improvementPercent = Number(progress.improvementPercent) || 0;
  const ratio = state.score / total;
  const messageKey = ratio >= 0.85 ? "reportGreat" : ratio >= 0.6 ? "reportGood" : "reportTry";
  const improvementText = improvementPercent > 0 ? `+${improvementPercent}%` : "0%";
  skillReport.innerHTML = `
    <h2>${t("reportTitle")}</h2>
    <dl>
      <dt>${t("previousBest")}</dt><dd>${previousBest} / ${total}</dd>
      <dt>${t("todayScore")}</dt><dd>${state.score} / ${total}</dd>
      <dt>${t("improvement")}</dt><dd>${improvementText}</dd>
      <dt>${t("animalKnowledge")}</dt><dd class="stars">${stars(scoreStars(state.score, total))}</dd>
      <dt>${t("memory")}</dt><dd class="stars">${stars(scoreStars(state.score, total, -1))}</dd>
      <dt>${t("reading")}</dt><dd class="stars">${stars(scoreStars(state.score, total, -1))}</dd>
    </dl>
    <p>${t(messageKey)}</p>
  `;
}

function applyLocaleChange() {
  window.WonderI18n?.setLocale(localeSelect.value);
  if (!state.ready) {
    renderStaticText();
    return;
  }
  if (state.completed) {
    renderStaticText();
    renderResultText();
    return;
  }
  if (document.body.classList.contains("quiz-main")) {
    showMain();
    return;
  }
  if (stageSelectPanel.classList.contains("hidden")) {
    renderQuestion({ track: false, focusChoices: choiceGrid.contains(document.activeElement) });
  } else {
    showStageSelect();
  }
}

localeSelect.addEventListener("change", applyLocaleChange);
localeSelect.addEventListener("input", applyLocaleChange);
startGameBtn.addEventListener("click", showStageSelect);
stageBackBtn.addEventListener("click", showMain);
backToStagesBtn.addEventListener("click", () => showStageSelect(state.stageIndex));

window.addEventListener("wonder:locale-change", () => {
  if (!state.ready) {
    renderStaticText();
    return;
  }
  if (state.completed) {
    renderStaticText();
    renderResultText();
    return;
  }
  if (document.body.classList.contains("quiz-main")) {
    showMain();
    return;
  }
  if (stageSelectPanel.classList.contains("hidden")) {
    renderQuestion({ track: false, focusChoices: choiceGrid.contains(document.activeElement) });
  } else {
    showStageSelect();
  }
});

againBtn.addEventListener("click", () => {
  window.WonderSound?.play("click");
  window.WonderAnalytics?.track("game_restart", {
    game_id: GAME_ID,
    stage: state.stageIndex + 1,
    locale: locale(),
  });
  startStage(state.stageIndex);
});

nextStageBtn.addEventListener("click", () => {
  window.WonderSound?.play("click");
  startStage(Math.min(state.stageIndex + 1, stages.length - 1));
});

stageSelectBtn.addEventListener("click", () => {
  window.WonderSound?.play("click");
  showStageSelect(state.stageIndex);
});

renderStaticText();
initStageRail();
scheduleReadinessFallback();
preloadGame().catch((error) => {
  console.error(error);
  state.ready = true;
  loadUnlockedStage();
  loadingPanel.classList.add("hidden");
  showMain();
});
