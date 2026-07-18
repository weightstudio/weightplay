const canonicalLocaleKey = "weightPlayLocale";
const legacyLocaleKey = "weightplayLocale";
const canonicalSavedLocale = localStorage.getItem(canonicalLocaleKey);
const legacySavedLocale = localStorage.getItem(legacyLocaleKey);
if (!canonicalSavedLocale && ["en", "zh-Hant", "zh-Hans", "es"].includes(legacySavedLocale)) {
  localStorage.setItem(canonicalLocaleKey, legacySavedLocale);
  window.WonderI18n?.setLocale?.(legacySavedLocale);
}

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
  es: {
    title: "Cuestionario de Animales - WeightPlay",
    description: "Juega al Cuestionario de Animales de WeightPlay con preguntas ilustradas sobre hábitats, rasgos, comportamientos y alimentación.",
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
    stageSetupText: "Choose one of 30 animal investigations. Every fifth stage is a Junior Expert Check.",
    start: "Start",
    locked: "Locked",
    complete: "Complete",
    stageBest: "Best {score} / {total}",
    stageLabel: "Stage {n}: {chapter}",
    checkpoint: "Junior Expert Check",
    chapterPicture: "Picture Introductions",
    chapterHabitat: "Habitat Homes",
    chapterFeatures: "Feature Detectives",
    chapterActions: "Animal Actions",
    chapterFood: "Food & Families",
    chapterExpert: "Junior Expert Mix",
    chapterPictureDesc: "Match clear animal portraits with a familiar feature clue.",
    chapterHabitatDesc: "Use home and climate clues to identify each animal.",
    chapterFeaturesDesc: "Recognize silhouettes, body shapes, and visible features.",
    chapterActionsDesc: "Use movement and behavior clues instead of only appearance.",
    chapterFoodDesc: "Compare food clues with animal families and body features.",
    chapterExpertDesc: "Combine two clue types, silhouettes, and four answer choices.",
    rulePicture: "Picture + Feature",
    ruleHabitat: "Habitat Clue",
    ruleSilhouette: "Silhouette Clue",
    ruleAction: "Behavior Clue",
    ruleFood: "Food Clue",
    ruleMixed: "Two-Clue Mix",
    prompt: "Who is this animal?",
    choose: "Choose one",
    correct: "Correct!",
    wrong: "Try again",
    animalNote: "Animal note: {animal} - {clue}",
    loading: "Loading",
    loadingFailed: "Load failed. Please refresh and try again.",
    question: "{stage}  {current} / {total}",
    battleQuestion: "Stage {n} · {current}/{total}",
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
    actionHippo: "I spend hot days cooling in rivers and pools.",
    actionSnake: "I move by bending my long body from side to side.",
    actionBear: "I use a powerful nose to search for food.",
    actionCat: "I clean my fur with my rough tongue.",
    actionDog: "I sniff, bark, and use my tail to communicate.",
    actionFox: "I listen for small animals before making a quick pounce.",
    actionGiraffe: "I spread my front legs to reach water on the ground.",
    actionZebra: "I stay close to my herd and run when danger approaches.",
    actionPanda: "I hold bamboo with my front paws while I eat.",
    actionKoala: "I climb slowly and sleep for much of the day.",
    habitatLion: "I live in African grasslands and open woodland.",
    habitatHippo: "I stay near African rivers, lakes, and wetlands.",
    habitatSnake: "Different kinds of me live in forests, deserts, grasslands, and water.",
    habitatRabbit: "I shelter in grasslands, woods, farms, and underground burrows.",
    habitatTurtle: "My relatives live in oceans, ponds, rivers, and on land.",
    habitatElephant: "I live in African or Asian grasslands and forests.",
    habitatPenguin: "I live along cool southern coasts and islands.",
    habitatMonkey: "Many of my relatives live in warm forests and tree canopies.",
    habitatBear: "Different bears live in forests, mountains, tundra, and icy coasts.",
    habitatCat: "I often share homes and neighborhoods with people.",
    habitatDog: "I live with people in many kinds of homes around the world.",
    habitatFox: "I can live in forests, grasslands, deserts, and even cities.",
    habitatGiraffe: "I live in African savannas and open woodland.",
    habitatZebra: "I live in African grasslands and savannas.",
    habitatPanda: "I live in cool mountain bamboo forests in China.",
    habitatKoala: "I live in eucalyptus woodland in eastern Australia.",
    habitatFrog: "I need damp places such as ponds, streams, forests, or wetlands.",
    habitatWhale: "I live in oceans and travel through wide areas of seawater.",
    habitatOwl: "Different owls live in forests, grasslands, deserts, and farms.",
    habitatCow: "I live with people on farms and graze in fields.",
    dietLion: "I am a meat eater that hunts or shares food with my pride.",
    dietHippo: "I leave the water to graze mainly on grass.",
    dietSnake: "I swallow animal food whole instead of chewing it.",
    dietRabbit: "I eat grasses, leaves, and other plants.",
    dietTurtle: "Depending on my kind, I may eat plants, insects, or small water animals.",
    dietElephant: "I eat grasses, leaves, bark, fruit, and roots.",
    dietPenguin: "I catch fish, krill, and squid in the water.",
    dietMonkey: "Many of my relatives eat fruit, leaves, seeds, and insects.",
    dietBear: "Many bears eat a mix of plants, insects, fish, and other food.",
    dietCat: "I am built to eat animal protein and need a meat-based diet.",
    dietDog: "I can eat a varied balanced diet prepared for dogs.",
    dietFox: "I eat small animals, insects, fruit, and other available food.",
    dietGiraffe: "I use my long tongue to pull leaves from tall trees.",
    dietZebra: "I spend much of the day grazing on tough grasses.",
    dietPanda: "Most of my food is bamboo stems and leaves.",
    dietKoala: "I eat selected eucalyptus leaves.",
    dietFrog: "I catch insects and other small animals with a quick tongue.",
    dietWhale: "Different whales filter tiny prey or hunt fish and squid.",
    dietOwl: "I hunt small animals and swallow many bites whole.",
    dietCow: "I graze on plants and chew cud to digest tough grass.",
  },
  "zh-Hant": {
    title: "\u52d5\u7269\u5c0f\u535a\u58eb",
    language: "\u8a9e\u8a00",
    mainIntro: "\u770b\u5716\u7247\u7dda\u7d22\uff0c\u4e00\u8d77\u8a8d\u8b58\u52d5\u7269\u5c0f\u77e5\u8b58\u3002",
    startGame: "\u958b\u59cb\u904a\u6232",
    chooseStage: "\u9078\u64c7\u95dc\u5361",
    stageSetupTitle: "\u9078\u4e00\u500b\u52d5\u7269\u4e3b\u984c",
    stageSetupText: "\u5f9e 30 \u500b\u52d5\u7269\u8abf\u67e5\u4e2d\u9078\u64c7\u5df2\u89e3\u9396\u95dc\u5361\uff0c\u6bcf\u7b2c\u4e94\u95dc\u662f\u5c0f\u5c0f\u5c08\u5bb6\u6aa2\u67e5\u3002",
    start: "\u958b\u59cb",
    locked: "\u672a\u89e3\u9396",
    complete: "\u5df2\u5b8c\u6210",
    stageBest: "\u6700\u4f73 {score} / {total}",
    stageLabel: "\u7b2c {n} \u95dc\uff1a{chapter}",
    checkpoint: "\u5c0f\u5c0f\u5c08\u5bb6\u6aa2\u67e5",
    chapterPicture: "\u5716\u7247\u521d\u8a8d\u8b58",
    chapterHabitat: "\u68f2\u5730\u4f4f\u8655",
    chapterFeatures: "\u7279\u5fb5\u5075\u63a2",
    chapterActions: "\u52d5\u7269\u884c\u52d5",
    chapterFood: "\u98df\u7269\u8207\u5bb6\u65cf",
    chapterExpert: "\u5c0f\u5c0f\u5c08\u5bb6\u6df7\u5408",
    chapterPictureDesc: "\u7528\u6e05\u695a\u52d5\u7269\u5716\u548c\u719f\u6089\u5916\u5f62\u7dda\u7d22\u627e\u7b54\u6848\u3002",
    chapterHabitatDesc: "\u6839\u64da\u4f4f\u8655\u8207\u6c23\u5019\u7dda\u7d22\u8fa8\u8a8d\u52d5\u7269\u3002",
    chapterFeaturesDesc: "\u8fa8\u8a8d\u526a\u5f71\u3001\u8eab\u9ad4\u8f2a\u5ed3\u8207\u53ef\u898b\u7279\u5fb5\u3002",
    chapterActionsDesc: "\u4f7f\u7528\u79fb\u52d5\u8207\u884c\u70ba\u7dda\u7d22\uff0c\u4e0d\u53ea\u770b\u5916\u8868\u3002",
    chapterFoodDesc: "\u628a\u98df\u7269\u7dda\u7d22\u548c\u52d5\u7269\u5bb6\u65cf\u3001\u8eab\u9ad4\u7279\u5fb5\u4e00\u8d77\u6bd4\u8f03\u3002",
    chapterExpertDesc: "\u540c\u6642\u4f7f\u7528\u5169\u7a2e\u7dda\u7d22\u3001\u526a\u5f71\u8207\u56db\u500b\u7b54\u6848\u9078\u9805\u3002",
    rulePicture: "\u5716\u7247\uff0b\u5916\u5f62",
    ruleHabitat: "\u68f2\u5730\u7dda\u7d22",
    ruleSilhouette: "\u526a\u5f71\u7dda\u7d22",
    ruleAction: "\u884c\u70ba\u7dda\u7d22",
    ruleFood: "\u98df\u7269\u7dda\u7d22",
    ruleMixed: "\u96d9\u7dda\u7d22\u6df7\u5408",
    prompt: "\u9019\u662f\u4ec0\u9ebc\u52d5\u7269\uff1f",
    choose: "\u9078\u4e00\u500b\u7b54\u6848",
    correct: "\u7b54\u5c0d\u4e86\uff01",
    wrong: "\u518d\u89c0\u5bdf\u4e00\u6b21",
    animalNote: "\u52d5\u7269\u5c0f\u77e5\u8b58\uff1a{animal}\uff0c{clue}",
    loading: "\u8f09\u5165\u4e2d",
    loadingFailed: "\u8f09\u5165\u5931\u6557\uff0c\u8acb\u91cd\u65b0\u6574\u7406\u5f8c\u518d\u8a66\u3002",
    question: "{stage}  {current} / {total}",
    battleQuestion: "\u7b2c {n} \u95dc \u00b7 {current}/{total}",
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
    actionHippo: "天氣炎熱時，我會待在河流或水池裡降溫。",
    actionSnake: "我會左右彎曲長長的身體向前移動。",
    actionBear: "我會用靈敏的鼻子尋找食物。",
    actionCat: "我會用粗糙的舌頭整理毛髮。",
    actionDog: "我會聞氣味、吠叫，也會用尾巴傳達訊息。",
    actionFox: "我會先聽小動物的位置，再快速撲過去。",
    actionGiraffe: "我要張開前腳，才能低頭喝地面的水。",
    actionZebra: "我會靠近斑馬群，危險來時一起奔跑。",
    actionPanda: "我吃東西時會用前掌握住竹子。",
    actionKoala: "我慢慢爬樹，一天中有很長時間都在睡覺。",
    habitatLion: "我住在非洲草原與開闊林地。",
    habitatHippo: "我住在非洲的河流、湖泊與濕地附近。",
    habitatSnake: "不同種類的我住在森林、沙漠、草原或水域。",
    habitatRabbit: "我會在草地、林地、農場與地下洞穴躲藏。",
    habitatTurtle: "我的親戚分別住在海洋、池塘、河流或陸地。",
    habitatElephant: "我住在非洲或亞洲的草原與森林。",
    habitatPenguin: "我住在南方較寒冷的海岸與島嶼。",
    habitatMonkey: "許多猴子住在溫暖森林與樹冠層。",
    habitatBear: "不同種類的熊住在森林、山地、苔原或冰冷海岸。",
    habitatCat: "我常和人們一起住在家庭與社區。",
    habitatDog: "我和人們一起住在世界各地不同的家庭。",
    habitatFox: "我可以住在森林、草地、沙漠，甚至城市。",
    habitatGiraffe: "我住在非洲稀樹草原與開闊林地。",
    habitatZebra: "我住在非洲草原與稀樹草原。",
    habitatPanda: "我住在中國涼爽的高山竹林。",
    habitatKoala: "我住在澳洲東部的尤加利樹林。",
    habitatFrog: "我需要池塘、溪流、森林或濕地等潮濕環境。",
    habitatWhale: "我住在海洋，會穿越很廣大的海域。",
    habitatOwl: "不同貓頭鷹住在森林、草地、沙漠或農場。",
    habitatCow: "我和人們住在農場，也會在田野吃草。",
    dietLion: "我是吃肉動物，會狩獵或和獅群分享食物。",
    dietHippo: "我會離開水域，主要到陸地吃草。",
    dietSnake: "我不會咀嚼，而是把動物性食物整個吞下。",
    dietRabbit: "我吃青草、葉子與其他植物。",
    dietTurtle: "依種類不同，我可能吃植物、昆蟲或小型水生動物。",
    dietElephant: "我吃青草、樹葉、樹皮、水果與根。",
    dietPenguin: "我會在水中捕捉魚、磷蝦與魷魚。",
    dietMonkey: "許多猴子吃水果、葉子、種子與昆蟲。",
    dietBear: "許多熊會吃植物、昆蟲、魚與其他食物。",
    dietCat: "我的身體適合攝取動物性蛋白質，需要以肉類為主的飲食。",
    dietDog: "我可以吃為狗準備、營養均衡的多樣食物。",
    dietFox: "我會吃小動物、昆蟲、水果與環境中可取得的食物。",
    dietGiraffe: "我用長舌頭拉取高樹上的葉子。",
    dietZebra: "我一天中有很長時間會啃食較粗硬的草。",
    dietPanda: "我的大部分食物是竹莖與竹葉。",
    dietKoala: "我會挑選某些尤加利樹葉來吃。",
    dietFrog: "我用快速伸出的舌頭捕捉昆蟲與小動物。",
    dietWhale: "不同鯨魚會濾食小型獵物，或捕捉魚與魷魚。",
    dietOwl: "我會捕捉小動物，許多食物會整口吞下。",
    dietCow: "我吃植物，也會反芻來消化較粗硬的草。",
  },
};

dictionary.es = {
  title: "Cuestionario de Animales", language: "Idioma", mainIntro: "Lee las pistas ilustradas y descubre datos sobre los animales.", startGame: "Empezar",
  chooseStage: "Elegir nivel", stageSetupTitle: "Elige un tema animal", stageSetupText: "Elige una de 30 investigaciones. Cada quinto nivel es una prueba de joven experto.",
  start: "Empezar", locked: "Bloqueado", complete: "Completado", stageBest: "Mejor {score} / {total}", stageLabel: "Nivel {n}: {chapter}", checkpoint: "Prueba de joven experto",
  chapterPicture: "Primeras imágenes", chapterHabitat: "Hogares y hábitats", chapterFeatures: "Detectives de rasgos", chapterActions: "Acciones animales", chapterFood: "Alimentos y familias", chapterExpert: "Mezcla de joven experto",
  chapterPictureDesc: "Relaciona retratos claros con una pista sobre un rasgo conocido.", chapterHabitatDesc: "Usa pistas de hogar y clima para identificar cada animal.", chapterFeaturesDesc: "Reconoce siluetas, formas corporales y rasgos visibles.",
  chapterActionsDesc: "Usa pistas de movimiento y comportamiento, no solo la apariencia.", chapterFoodDesc: "Compara la alimentación con la familia y los rasgos del animal.", chapterExpertDesc: "Combina dos tipos de pista, siluetas y cuatro respuestas.",
  rulePicture: "Imagen + rasgo", ruleHabitat: "Pista de hábitat", ruleSilhouette: "Pista de silueta", ruleAction: "Pista de comportamiento", ruleFood: "Pista de alimentación", ruleMixed: "Mezcla de dos pistas",
  prompt: "¿Qué animal es?", choose: "Elige uno", correct: "¡Correcto!", wrong: "Inténtalo de nuevo", animalNote: "Dato animal: {animal} - {clue}", loading: "Cargando", loadingFailed: "No se pudo cargar. Actualiza la página e inténtalo de nuevo.",
  question: "{stage}  {current} / {total}", battleQuestion: "Nivel {n} · {current}/{total}", winTitle: "¡Nivel completado!", winText: "Respondiste {score} / {total}.", allClearTitle: "¡Todo completado!", allClearText: "Completaste los {count} niveles de animales.",
  again: "Jugar de nuevo", nextStage: "Siguiente nivel", stages: "Niveles", lobby: "Sala de juegos", reportTitle: "Informe de habilidades", previousBest: "Mejor anterior", todayScore: "Puntuación de hoy", improvement: "Mejora",
  animalKnowledge: "Conocimiento animal", memory: "Memoria", reading: "Lectura", reportGreat: "¡Excelente! Reconociste bien los animales y usaste las pistas con atención.", reportGood: "¡Buen esfuerzo! Juega otra vez para conocer mejor los rasgos animales.", reportTry: "¡Buena práctica! Mira despacio la imagen y la pista e inténtalo otra vez.",
  lion: "León", hippo: "Hipopótamo", snake: "Serpiente", rabbit: "Conejo", turtle: "Tortuga", elephant: "Elefante", penguin: "Pingüino", monkey: "Mono", bear: "Oso", cat: "Gato", dog: "Perro", fox: "Zorro", giraffe: "Jirafa", zebra: "Cebra", panda: "Panda", koala: "Koala", frog: "Rana", whale: "Ballena", owl: "Búho", cow: "Vaca",

  clueLion: "Tengo una gran melena.", clueHippo: "Me encanta el agua y tengo una boca enorme.", clueSnake: "Me deslizo por el suelo.", clueRabbit: "Tengo orejas largas y salto.", clueTurtle: "Llevo un caparazón en la espalda.",
  clueElephant: "Tengo una trompa larga.", cluePenguin: "Soy un ave que camina balanceándose.", clueMonkey: "Trepo y me balanceo.", clueBear: "Soy grande, peludo y fuerte.", clueCat: "Maúllo y tengo bigotes.", clueDog: "Ladro y muevo la cola.",
  clueFox: "Tengo pelaje naranja y una cola esponjosa.", clueGiraffe: "Tengo el cuello muy largo.", clueZebra: "Tengo rayas blancas y negras.", cluePanda: "Soy blanco y negro y me encanta el bambú.", clueKoala: "Abrazo árboles y tengo orejas redondas.",
  clueFrog: "Salto y croo.", clueWhale: "Soy un animal enorme del océano.", clueOwl: "Soy un ave con ojos grandes.", clueCow: "Hago «muuu» y doy leche.",

  actionLion: "Descanso y viajo con un grupo llamado manada.", actionElephant: "Uso la trompa para rociar agua.", actionPenguin: "Me junto con otros pingüinos para mantener el calor.", actionMonkey: "Uso las manos para trepar y explorar ramas.",
  actionRabbit: "Golpeo el suelo con las patas traseras cuando hay peligro.", actionTurtle: "Escondo la cabeza en el caparazón cuando tengo miedo.", actionFrog: "Salto y atrapo insectos con mi lengua larga.", actionOwl: "Vuelo en silencio y cazo después del atardecer.",
  actionCow: "Paso gran parte del día masticando hierba despacio.", actionWhale: "Subo a la superficie para respirar por el espiráculo.", actionHippo: "Paso los días calurosos refrescándome en ríos y charcas.", actionSnake: "Avanzo doblando mi cuerpo largo de lado a lado.",
  actionBear: "Uso mi potente olfato para buscar comida.", actionCat: "Limpio mi pelaje con mi lengua áspera.", actionDog: "Olfateo, ladro y uso la cola para comunicarme.", actionFox: "Escucho a pequeños animales antes de saltar rápidamente.",
  actionGiraffe: "Separo las patas delanteras para alcanzar el agua del suelo.", actionZebra: "Me mantengo cerca de la manada y corro cuando aparece peligro.", actionPanda: "Sujeto el bambú con las patas delanteras mientras como.", actionKoala: "Trepo despacio y duermo gran parte del día.",

  habitatLion: "Vivo en praderas y bosques abiertos de África.", habitatHippo: "Permanezco cerca de ríos, lagos y humedales africanos.", habitatSnake: "Mis distintas especies viven en bosques, desiertos, praderas y agua.", habitatRabbit: "Me refugio en praderas, bosques, granjas y madrigueras.",
  habitatTurtle: "Mis parientes viven en océanos, estanques, ríos y tierra firme.", habitatElephant: "Vivo en praderas y bosques de África o Asia.", habitatPenguin: "Vivo en costas e islas frías del sur.", habitatMonkey: "Muchos de mis parientes viven en bosques cálidos y copas de árboles.",
  habitatBear: "Distintos osos viven en bosques, montañas, tundra y costas heladas.", habitatCat: "Suelo compartir hogares y barrios con las personas.", habitatDog: "Vivo con personas en muchos tipos de hogar por todo el mundo.", habitatFox: "Puedo vivir en bosques, praderas, desiertos e incluso ciudades.",
  habitatGiraffe: "Vivo en sabanas y bosques abiertos de África.", habitatZebra: "Vivo en praderas y sabanas africanas.", habitatPanda: "Vivo en bosques frescos de bambú de las montañas de China.", habitatKoala: "Vivo en bosques de eucalipto del este de Australia.",
  habitatFrog: "Necesito lugares húmedos como estanques, arroyos, bosques o humedales.", habitatWhale: "Vivo en océanos y recorro grandes zonas de agua marina.", habitatOwl: "Distintos búhos viven en bosques, praderas, desiertos y granjas.", habitatCow: "Vivo con las personas en granjas y pasto en campos.",

  dietLion: "Como carne y cazo o comparto comida con mi manada.", dietHippo: "Salgo del agua para comer principalmente hierba.", dietSnake: "Trago animales enteros en lugar de masticarlos.", dietRabbit: "Como hierbas, hojas y otras plantas.",
  dietTurtle: "Según mi especie, puedo comer plantas, insectos o pequeños animales acuáticos.", dietElephant: "Como hierbas, hojas, corteza, fruta y raíces.", dietPenguin: "Atrapo peces, kril y calamares en el agua.", dietMonkey: "Muchos de mis parientes comen fruta, hojas, semillas e insectos.",
  dietBear: "Muchos osos comen plantas, insectos, peces y otros alimentos.", dietCat: "Necesito proteína animal y una alimentación basada en carne.", dietDog: "Puedo comer una dieta variada y equilibrada preparada para perros.", dietFox: "Como pequeños animales, insectos, fruta y otros alimentos disponibles.",
  dietGiraffe: "Uso mi lengua larga para arrancar hojas de árboles altos.", dietZebra: "Paso gran parte del día comiendo hierbas duras.", dietPanda: "Casi toda mi comida son tallos y hojas de bambú.", dietKoala: "Como determinadas hojas de eucalipto.",
  dietFrog: "Atrapo insectos y otros animales pequeños con una lengua rápida.", dietWhale: "Algunas ballenas filtran presas diminutas y otras cazan peces y calamares.", dietOwl: "Cazo animales pequeños y trago muchos bocados enteros.", dietCow: "Como plantas y rumio para digerir la hierba dura.",
};

const animals = [
  { id: "lion", image: "assets/premium/lion.webp", clue: "clueLion", action: "actionLion", habitat: "habitatLion", diet: "dietLion" },
  { id: "hippo", image: "assets/premium/hippo.webp", clue: "clueHippo", action: "actionHippo", habitat: "habitatHippo", diet: "dietHippo" },
  { id: "snake", image: "assets/premium/snake.webp", clue: "clueSnake", action: "actionSnake", habitat: "habitatSnake", diet: "dietSnake" },
  { id: "rabbit", image: "assets/premium/rabbit.webp", clue: "clueRabbit", action: "actionRabbit", habitat: "habitatRabbit", diet: "dietRabbit" },
  { id: "turtle", image: "assets/premium/turtle.webp", clue: "clueTurtle", action: "actionTurtle", habitat: "habitatTurtle", diet: "dietTurtle" },
  { id: "elephant", image: "assets/premium/elephant.webp", clue: "clueElephant", action: "actionElephant", habitat: "habitatElephant", diet: "dietElephant" },
  { id: "penguin", image: "assets/premium/penguin.webp", clue: "cluePenguin", action: "actionPenguin", habitat: "habitatPenguin", diet: "dietPenguin" },
  { id: "monkey", image: "assets/premium/monkey.webp", clue: "clueMonkey", action: "actionMonkey", habitat: "habitatMonkey", diet: "dietMonkey" },
  { id: "bear", image: "assets/premium/bear.webp", clue: "clueBear", action: "actionBear", habitat: "habitatBear", diet: "dietBear" },
  { id: "cat", image: "assets/premium/cat.webp", clue: "clueCat", action: "actionCat", habitat: "habitatCat", diet: "dietCat" },
  { id: "dog", image: "assets/premium/dog.webp", clue: "clueDog", action: "actionDog", habitat: "habitatDog", diet: "dietDog" },
  { id: "fox", image: "assets/premium/fox.webp", clue: "clueFox", action: "actionFox", habitat: "habitatFox", diet: "dietFox" },
  { id: "giraffe", image: "assets/premium/giraffe.webp", clue: "clueGiraffe", action: "actionGiraffe", habitat: "habitatGiraffe", diet: "dietGiraffe" },
  { id: "zebra", image: "assets/premium/zebra.webp", clue: "clueZebra", action: "actionZebra", habitat: "habitatZebra", diet: "dietZebra" },
  { id: "panda", image: "assets/premium/panda.webp", clue: "cluePanda", action: "actionPanda", habitat: "habitatPanda", diet: "dietPanda" },
  { id: "koala", image: "assets/premium/koala.webp", clue: "clueKoala", action: "actionKoala", habitat: "habitatKoala", diet: "dietKoala" },
  { id: "frog", image: "assets/premium/frog.webp", clue: "clueFrog", action: "actionFrog", habitat: "habitatFrog", diet: "dietFrog" },
  { id: "whale", image: "assets/premium/whale.webp", clue: "clueWhale", action: "actionWhale", habitat: "habitatWhale", diet: "dietWhale" },
  { id: "owl", image: "assets/premium/owl.webp", clue: "clueOwl", action: "actionOwl", habitat: "habitatOwl", diet: "dietOwl" },
  { id: "cow", image: "assets/premium/cow.webp", clue: "clueCow", action: "actionCow", habitat: "habitatCow", diet: "dietCow" },
];

const animalMap = new Map(animals.map((animal) => [animal.id, animal]));

const makeQuizStage = (chapter, description, rule, questions, clueKinds, options = {}) => ({
  chapter,
  description,
  rule,
  questions,
  clueKinds,
  choiceCount: options.choiceCount || 3,
  mode: options.mode || "picture",
  checkpoint: Boolean(options.checkpoint),
});

const stages = [
  makeQuizStage("chapterPicture", "chapterPictureDesc", "rulePicture", ["lion", "hippo", "elephant", "giraffe", "zebra", "monkey", "snake", "turtle", "frog", "owl"], ["clue"]),
  makeQuizStage("chapterPicture", "chapterPictureDesc", "rulePicture", ["panda", "elephant", "monkey", "snake", "turtle", "rabbit", "bear", "fox", "owl", "frog"], ["clue"]),
  makeQuizStage("chapterPicture", "chapterPictureDesc", "rulePicture", ["whale", "penguin", "frog", "turtle", "cow", "cat", "dog", "rabbit", "owl", "fox"], ["clue"]),
  makeQuizStage("chapterPicture", "chapterPictureDesc", "rulePicture", ["bear", "fox", "owl", "frog", "rabbit", "panda", "koala", "monkey", "snake", "turtle"], ["clue"]),
  makeQuizStage("chapterPicture", "chapterPictureDesc", "ruleMixed", ["cow", "dog", "cat", "rabbit", "owl", "fox", "frog", "turtle", "penguin", "whale"], ["clue", "action"], { choiceCount: 4, checkpoint: true }),

  makeQuizStage("chapterHabitat", "chapterHabitatDesc", "ruleHabitat", ["lion", "zebra", "giraffe", "hippo", "elephant", "penguin", "panda", "koala", "whale", "frog"], ["habitat"], { mode: "mystery" }),
  makeQuizStage("chapterHabitat", "chapterHabitatDesc", "ruleHabitat", ["fox", "bear", "owl", "rabbit", "snake", "monkey", "turtle", "cow", "cat", "dog"], ["habitat"], { mode: "mystery" }),
  makeQuizStage("chapterHabitat", "chapterHabitatDesc", "ruleHabitat", ["penguin", "whale", "turtle", "frog", "hippo", "lion", "zebra", "giraffe", "panda", "koala"], ["habitat"], { mode: "mystery" }),
  makeQuizStage("chapterHabitat", "chapterHabitatDesc", "ruleHabitat", ["cat", "dog", "cow", "fox", "owl", "bear", "rabbit", "snake", "elephant", "monkey"], ["habitat"], { mode: "mystery" }),
  makeQuizStage("chapterHabitat", "chapterHabitatDesc", "ruleMixed", ["koala", "panda", "frog", "whale", "penguin", "elephant", "lion", "fox", "bear", "owl"], ["habitat", "clue"], { mode: "mystery", choiceCount: 4, checkpoint: true }),

  makeQuizStage("chapterFeatures", "chapterFeaturesDesc", "ruleSilhouette", ["giraffe", "zebra", "elephant", "lion", "hippo", "rabbit", "turtle", "snake", "owl", "frog"], ["clue"], { mode: "silhouette" }),
  makeQuizStage("chapterFeatures", "chapterFeaturesDesc", "ruleSilhouette", ["panda", "koala", "bear", "monkey", "fox", "cat", "dog", "cow", "penguin", "whale"], ["clue"], { mode: "silhouette" }),
  makeQuizStage("chapterFeatures", "chapterFeaturesDesc", "ruleSilhouette", ["snake", "turtle", "frog", "rabbit", "owl", "penguin", "whale", "giraffe", "zebra", "hippo"], ["clue"], { mode: "silhouette" }),
  makeQuizStage("chapterFeatures", "chapterFeaturesDesc", "ruleSilhouette", ["dog", "fox", "cat", "bear", "panda", "koala", "monkey", "cow", "lion", "elephant"], ["clue"], { mode: "silhouette" }),
  makeQuizStage("chapterFeatures", "chapterFeaturesDesc", "ruleMixed", ["lion", "panda", "giraffe", "penguin", "turtle", "owl", "elephant", "koala", "fox", "frog"], ["clue", "habitat"], { mode: "silhouette", choiceCount: 4, checkpoint: true }),

  makeQuizStage("chapterActions", "chapterActionsDesc", "ruleAction", ["lion", "elephant", "penguin", "monkey", "rabbit", "turtle", "frog", "owl", "cow", "whale"], ["action"]),
  makeQuizStage("chapterActions", "chapterActionsDesc", "ruleAction", ["hippo", "snake", "bear", "cat", "dog", "fox", "giraffe", "zebra", "panda", "koala"], ["action"]),
  makeQuizStage("chapterActions", "chapterActionsDesc", "ruleAction", ["rabbit", "fox", "owl", "penguin", "frog", "snake", "monkey", "koala", "cat", "dog"], ["action"]),
  makeQuizStage("chapterActions", "chapterActionsDesc", "ruleAction", ["elephant", "giraffe", "zebra", "lion", "hippo", "bear", "panda", "turtle", "cow", "whale"], ["action"]),
  makeQuizStage("chapterActions", "chapterActionsDesc", "ruleMixed", ["koala", "panda", "fox", "owl", "frog", "penguin", "rabbit", "elephant", "lion", "whale"], ["action", "habitat"], { choiceCount: 4, checkpoint: true }),

  makeQuizStage("chapterFood", "chapterFoodDesc", "ruleFood", ["lion", "hippo", "elephant", "giraffe", "zebra", "panda", "koala", "penguin", "frog", "owl"], ["diet"], { choiceCount: 4 }),
  makeQuizStage("chapterFood", "chapterFoodDesc", "ruleFood", ["snake", "rabbit", "turtle", "monkey", "bear", "cat", "dog", "fox", "whale", "cow"], ["diet"], { choiceCount: 4 }),
  makeQuizStage("chapterFood", "chapterFoodDesc", "ruleFood", ["panda", "giraffe", "zebra", "elephant", "cow", "rabbit", "koala", "hippo", "monkey", "bear"], ["diet"], { choiceCount: 4 }),
  makeQuizStage("chapterFood", "chapterFoodDesc", "ruleFood", ["penguin", "whale", "frog", "owl", "snake", "fox", "cat", "dog", "turtle", "lion"], ["diet"], { choiceCount: 4 }),
  makeQuizStage("chapterFood", "chapterFoodDesc", "ruleMixed", ["elephant", "penguin", "monkey", "bear", "fox", "giraffe", "panda", "frog", "owl", "cow"], ["diet", "clue"], { choiceCount: 4, checkpoint: true }),

  makeQuizStage("chapterExpert", "chapterExpertDesc", "ruleMixed", ["lion", "panda", "penguin", "frog", "rabbit", "elephant", "owl", "fox", "turtle", "whale"], ["habitat", "action"], { mode: "mystery", choiceCount: 4 }),
  makeQuizStage("chapterExpert", "chapterExpertDesc", "ruleMixed", ["giraffe", "zebra", "koala", "bear", "monkey", "snake", "cat", "dog", "cow", "hippo"], ["clue", "diet"], { mode: "silhouette", choiceCount: 4 }),
  makeQuizStage("chapterExpert", "chapterExpertDesc", "ruleMixed", ["whale", "penguin", "turtle", "frog", "hippo", "elephant", "lion", "giraffe", "zebra", "owl"], ["habitat", "diet"], { mode: "mystery", choiceCount: 4 }),
  makeQuizStage("chapterExpert", "chapterExpertDesc", "ruleMixed", ["panda", "koala", "bear", "fox", "rabbit", "monkey", "cat", "dog", "cow", "snake"], ["action", "diet"], { mode: "silhouette", choiceCount: 4 }),
  makeQuizStage("chapterExpert", "chapterExpertDesc", "ruleMixed", ["lion", "elephant", "giraffe", "zebra", "panda", "koala", "penguin", "whale", "frog", "owl"], ["clue", "habitat", "action"], { mode: "silhouette", choiceCount: 4, checkpoint: true }),
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
let quizGeneration = 0;
let quizLifecycleSuspended = document.hidden;
const quizTasks = new Set();

function invalidateQuizSession() {
  quizGeneration += 1;
  state.answered = false;
}

function scheduleQuizTask(task, delay) {
  const scheduled = {
    generation: quizGeneration,
    lastFrameAt: null,
    remaining: delay,
  };
  quizTasks.add(scheduled);
  const tick = (now) => {
    if (scheduled.generation !== quizGeneration || !document.body.classList.contains("quiz-playing")) {
      quizTasks.delete(scheduled);
      return;
    }
    if (quizLifecycleSuspended || document.hidden) {
      scheduled.lastFrameAt = null;
      requestAnimationFrame(tick);
      return;
    }
    if (scheduled.lastFrameAt !== null) scheduled.remaining -= Math.max(0, now - scheduled.lastFrameAt);
    scheduled.lastFrameAt = now;
    if (scheduled.remaining <= 0) {
      quizTasks.delete(scheduled);
      task();
    } else {
      requestAnimationFrame(tick);
    }
  };
  requestAnimationFrame(tick);
}

function suspendQuizTasks() {
  quizLifecycleSuspended = true;
  quizTasks.forEach((task) => { task.lastFrameAt = null; });
}

function resumeQuizTasks() {
  quizLifecycleSuspended = document.hidden;
  quizTasks.forEach((task) => { task.lastFrameAt = null; });
}

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
  invalidateQuizSession();
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
  invalidateQuizSession();
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
        <strong>${stageTitle(stage, index)}</strong>
        <small>${t(stage.description)}</small>
        <b class="stage-rule">${t(stage.rule)}${stage.checkpoint ? ` · ${t("checkpoint")}` : ""}</b>
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
  invalidateQuizSession();
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

function stageTitle(stage = currentStage(), index = state.stageIndex) {
  return t("stageLabel", { n: index + 1, chapter: t(stage.chapter) });
}

function currentAnimal() {
  return animalMap.get(currentStage().questions[state.questionIndex]);
}

function currentClueKeys(animal = currentAnimal()) {
  return currentStage().clueKinds.map((kind) => animal[kind] || animal.clue);
}

function currentClueText(animal = currentAnimal()) {
  return currentClueKeys(animal).map((key) => t(key)).join(" · ");
}

function buildChoices(answer, count = 3) {
  const others = shuffle(animals.filter((animal) => animal.id !== answer.id)).slice(0, Math.max(2, count - 1));
  return shuffle([answer, ...others]);
}

function renderQuestion(options = {}) {
  invalidateQuizSession();
  const shouldTrack = options.track !== false;
  const shouldFocus = options.focusChoices === true;
  renderStaticText();
  const stage = currentStage();
  const animal = currentAnimal();
  const total = stage.questions.length;
  state.answered = false;
  levelText.textContent = t("battleQuestion", {
    n: state.stageIndex + 1,
    current: state.questionIndex + 1,
    total,
  });
  levelFill.style.width = `${(state.questionIndex / total) * 100}%`;
  animalImage.src = animal.image;
  animalImage.alt = t(animal.id);
  animalImage.classList.toggle("is-mystery", stage.mode === "mystery");
  animalImage.classList.toggle("is-silhouette", stage.mode === "silhouette");
  quizStage.dataset.rule = t(stage.rule);
  clueText.textContent = currentClueText(animal);
  feedbackText.textContent = t("choose");
  choiceGrid.setAttribute("aria-busy", "false");

  choiceGrid.replaceChildren(
    ...buildChoices(animal, stage.choiceCount).map((choice) => {
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
    scheduleQuizTask(() => {
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
        clue: currentClueText(answeredAnimal),
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

  scheduleQuizTask(() => {
    state.questionIndex += 1;
    if (state.questionIndex >= currentStage().questions.length) {
      finishStage();
    } else {
      renderQuestion({ focusChoices: true });
    }
  }, 620);
}

function finishStage() {
  invalidateQuizSession();
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
window.addEventListener("pagehide", suspendQuizTasks);
window.addEventListener("pageshow", resumeQuizTasks);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) suspendQuizTasks();
  else resumeQuizTasks();
});
const rejectRepeatedScreenActivation = (event) => {
  if (!event.repeat || !["Enter", " "].includes(event.key)) return;
  event.preventDefault();
};
startGameBtn.addEventListener("keydown", rejectRepeatedScreenActivation);
stageGrid.addEventListener("keydown", (event) => {
  if (event.target.closest("button")) rejectRepeatedScreenActivation(event);
});
startGameBtn.addEventListener("click", showStageSelect);
stageBackBtn.addEventListener("click", showMain);
backToStagesBtn.addEventListener("click", () => showStageSelect(state.stageIndex));
choiceGrid.addEventListener("keydown", (event) => {
  if (!event.repeat || !["Enter", " "].includes(event.key) || !event.target.closest("button")) return;
  event.preventDefault();
});
resultPanel.addEventListener("keydown", (event) => {
  if (event.repeat && ["Enter", " "].includes(event.key)) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  if (event.key !== "Tab") return;
  const actions = [...resultPanel.querySelectorAll("button:not([disabled]), a[href]")]
    .filter((action) => !action.classList.contains("hidden") && getComputedStyle(action).display !== "none");
  if (!actions.length) return;
  const currentIndex = actions.indexOf(document.activeElement);
  if (currentIndex === -1 || (!event.shiftKey && currentIndex === actions.length - 1) || (event.shiftKey && currentIndex === 0)) {
    event.preventDefault();
    actions[event.shiftKey ? actions.length - 1 : 0].focus({ preventScroll: true });
  }
}, true);

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

if (new URLSearchParams(window.location.search).get("smoke") === "1") {
  window.__animalQuizSmoke = {
    stages: stages.map((stage, index) => ({
      id: index + 1,
      chapter: stage.chapter,
      rule: stage.rule,
      clueKinds: [...stage.clueKinds],
      choiceCount: stage.choiceCount,
      mode: stage.mode,
      checkpoint: stage.checkpoint,
      questions: [...stage.questions],
    })),
    unlockAll: () => {
      state.unlockedStage = stages.length - 1;
      localStorage.setItem(UNLOCK_KEY, String(state.unlockedStage));
      showStageSelect(state.unlockedStage);
    },
    startStage: (stageNo) => startStage(Math.max(0, Math.min(stages.length - 1, Number(stageNo) - 1))),
    state: () => ({ ...state, stage: state.stageIndex + 1, clues: currentClueKeys().map((key) => t(key)) }),
  };
}

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
