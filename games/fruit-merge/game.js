(() => {
  const GAME_ID = "fruit-merge";
  const canonicalLocaleKey = "weightPlayLocale";
  const legacyLocaleKey = "weightplayLocale";
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

  const canonicalSavedLocale = storageRead(canonicalLocaleKey);
  const legacySavedLocale = storageRead(legacyLocaleKey);
  if (!canonicalSavedLocale && ["en", "zh-Hant", "zh-Hans", "es"].includes(legacySavedLocale)) {
    window.WonderI18n?.setLocale?.(legacySavedLocale);
  }
  document.querySelectorAll(".fruit-game, .fixed-game-shell, #stagePanel, #resultPanel").forEach((element) => {
    element.setAttribute("data-wp-canvas-max-width", "920");
  });

  const BEST_KEY = "fruitMergeBestScore";
  const PROGRESS_KEY = "weightplay_fruit_merge_progress";
  const LEADERBOARD_KEY = "weightplay_fruit_merge_leaderboard";
  const CHALLENGE_KEY = "weightplay_fruit_merge_challenges_v1";
  if (!document.querySelector("#leaveConfirmPanel")) {
    const panel = document.createElement("section");
    panel.id = "leaveConfirmPanel";
    panel.className = "leave-confirm-panel hidden";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", "leaveConfirmTitle");
    panel.setAttribute("aria-describedby", "leaveConfirmText");
    panel.innerHTML = `
      <div class="leave-confirm-card">
        <h2 id="leaveConfirmTitle"></h2>
        <p id="leaveConfirmText"></p>
        <div class="leave-confirm-actions">
          <button id="keepPlayingBtn" type="button"></button>
          <button id="leaveGameBtn" class="secondary-action" type="button"></button>
        </div>
      </div>`;
    document.querySelector("#playPanel .fixed-game-shell")?.append(panel);
  }
  if (!document.querySelector("#pauseBtn")) {
    const button = document.createElement("button");
    button.id = "pauseBtn";
    button.className = "play-pause";
    button.type = "button";
    button.textContent = "\u23f8";
    document.querySelector("#playPanel .fixed-game-shell")?.append(button);
  }
  const canvas = document.querySelector("#gameCanvas");
  const ctx = canvas.getContext("2d");
  const localeSelect = document.querySelector("#localeSelect");
  const titleText = document.querySelector("#titleText");
  const languageLabel = document.querySelector("#languageLabel");
  const scoreLabel = document.querySelector("#scoreLabel");
  const bestLabel = document.querySelector("#bestLabel");
  const comboLabel = document.querySelector("#comboLabel");
  const nextLabel = document.querySelector("#nextLabel");
  const scoreText = document.querySelector("#scoreText");
  const bestText = document.querySelector("#bestText");
  const comboBox = document.querySelector("#comboBox");
  const comboText = document.querySelector("#comboText");
  const nextFruitText = document.querySelector("#nextFruitText");
  const largestLabel = document.querySelector("#largestLabel");
  const largestFruitText = document.querySelector("#largestFruitText");
  const largestFruitToken = document.querySelector("#largestFruitToken");
  const goalText = document.querySelector("#goalText");
  const goalFill = document.querySelector("#goalFill");
  const backToMenuBtn = document.querySelector("#backToMenuBtn");
  const pauseBtn = document.querySelector("#pauseBtn");
  const restartBtn = document.querySelector("#restartBtn");
  const startBtn = document.querySelector("#startBtn");
  const freePlayBtn = document.querySelector("#freePlayBtn");
  const stagePanel = document.querySelector("#stagePanel");
  const stageBackBtn = document.querySelector("#stageBackBtn");
  const stageTitle = document.querySelector("#stageTitle");
  const stageHelp = document.querySelector("#stageHelp");
  const stageRail = document.querySelector("#stageRail");
  const stageDots = document.querySelector("#stageDots");
  const menuPanel = document.querySelector("#menuPanel");
  const playPanel = document.querySelector("#playPanel");
  const battleShell = playPanel.querySelector(".fixed-game-shell");
  const leaveConfirmPanel = document.querySelector("#leaveConfirmPanel");
  const leaveConfirmTitle = document.querySelector("#leaveConfirmTitle");
  const leaveConfirmText = document.querySelector("#leaveConfirmText");
  const keepPlayingBtn = document.querySelector("#keepPlayingBtn");
  const leaveGameBtn = document.querySelector("#leaveGameBtn");
  const menuTitle = document.querySelector("#menuTitle");
  const menuDesc = document.querySelector("#menuDesc");
  const chainPreview = document.querySelector("#chainPreview");
  const resultPanel = document.querySelector("#resultPanel");
  battleShell.append(resultPanel);
  const setBattleContentInert = (inert) => {
    [...battleShell.children].forEach((child) => {
      if (child === resultPanel || child === leaveConfirmPanel) return;
      child.inert = inert;
      child.toggleAttribute("aria-hidden", inert);
    });
  };
  const resultTitle = document.querySelector("#resultTitle");
  const resultText = document.querySelector("#resultText");
  const menuMilestone = document.querySelector("#menuMilestone");
  const resultMilestone = document.querySelector("#resultMilestone");
  const menuLeaderboard = document.querySelector("#menuLeaderboard");
  const resultLeaderboard = document.querySelector("#resultLeaderboard");
  const playAgainBtn = document.querySelector("#playAgainBtn");
  const menuBtn = document.querySelector("#menuBtn");
  const loadingPanel = document.querySelector("#loadingPanel");
  const loadingText = document.querySelector("#loadingText");
  const loadingFill = document.querySelector("#loadingFill");
  const toast = document.querySelector("#toast");
  const aimCoach = document.querySelector("#aimCoach");

  const W = canvas.width;
  const H = canvas.height;
  const wallLeft = 44;
  const wallRight = W - 44;
  const floorY = H - 42;
  const dangerY = 164;
  const dropY = 122;
  const Matter = window.Matter;
  const Engine = Matter?.Engine;
  const World = Matter?.World;
  const Bodies = Matter?.Bodies;
  const Body = Matter?.Body;

  const dictionary = {
    en: {
      title: "Animal Merge Tower",
      language: "Language",
      ariaLanguage: "Language selector",
      ariaLobby: "Back to WeightPlay lobby",
      ariaBattle: "Animal Merge Tower play screen",
      ariaBattleBack: "Back to challenges",
      ariaPause: "Pause game",
      ariaScore: "Score information",
      ariaProgress: "Merge progress",
      ariaBoard: "Animal merge game board",
      ariaBoardControls: "Use Left and Right arrows to aim, then Space or Enter to drop.",
      ariaAim: "Aim {value}%",
      score: "Score",
      best: "Best",
      next: "Next",
      comboLabel: "Combo",
      comboReady: "Ready",
      comboStatus: "x{count}",
      largest: "Largest",
      goal: "Goal: {name}",
      bestAnimal: "Best Animal {name}",
      combo: "Combo x{count}!",
      drop: "Drop",
      restart: "Restart",
      menuTitle: "Merge to the Lion King",
      menuDesc: "Drop animal balls carefully. Matching animals merge into the next bigger animal. Keep the tower below the red line.",
      chainTitle: "Merge Path",
      chainHint: "Match two of the same animal to unlock the next one.",
      albumTitle: "Habitat Album {unlocked}/4",
      albumUnlocked: "{name} discovered",
      albumLocked: "Reach {name}",
      habitatMeadow: "Meadow Friends",
      habitatForest: "Forest Flight",
      habitatSavanna: "Savanna Trail",
      habitatRoyal: "Lion Crown",
      nextHabitat: "Next habitat: {habitat}",
      nextHabitatTarget: "Reach {animal} · {count} animal {steps}",
      habitatStep: "step",
      habitatSteps: "steps",
      habitatAlbumComplete: "Habitat Album complete · Keep merging toward the Lion King!",
      start: "Start Game",
      freePlay: "Free Play",
      stageTitle: "Festival Challenges",
      ariaStage: "Challenge selection",
      stageHelp: "Drag sideways and choose an unlocked challenge.",
      stageBack: "Back to main",
      stageLabel: "Challenge {stage}",
      stageLocked: "Locked",
      stageBest: "Best {score}",
      goalScore: "Reach {score} points",
      goalTier: "Merge a {animal}",
      goalMerges: "Complete {count} merges",
      goalCombo: "Reach combo x{count}",
      goalDual: "Merge {animal} and score {score}",
      dropsRule: "{count} drops",
      clearTitle: "Challenge Clear!",
      failedTitle: "Challenge Retry",
      nextChallenge: "Next Challenge",
      retryChallenge: "Try Again",
      challengeMenu: "Challenges",
      gameOver: "Game Over",
      result: "Score {score}  Best {best}",
      resultScore: "Score {score}",
      previousBest: "Previous Best {score}",
      todayScore: "Today's Score {score}",
      improvement: "Improvement {value}%",
      skillReport: "Skill Report",
      logicSkill: "Logic",
      problemSolvingSkill: "Problem Solving",
      coordinationSkill: "Hand-Eye Coordination",
      progressNewBest: "Amazing progress! You improved your best score.",
      progressImproved: "Great progress! You improved from your last best.",
      progressSteady: "Good effort! Try again to improve planning and placement.",
      progressNote: "Scores are for fun and local progress tracking only.",
      milestoneTitle: "Merge Milestone",
      milestoneUnlocked: "Best unlocked: {name}",
      milestoneNext: "Next target: {name}",
      milestoneComplete: "All animals unlocked! Chase a new best score.",
      milestoneNew: "New animal unlocked: {name}!",
      aimStart: "Tap or drag the board to aim. Drop matching animal balls below the red line.",
      aimMatch: "Aim near another {name} to merge.",
      aimSafe: "Keep the animal tower under the red warning line.",
      aimDanger: "Too high! Merge quickly or aim away from the red line.",
      dangerLine: "Warning Line",
      leaderboardTitle: "Your Best Runs",
      noLeaderboard: "Complete a run to add it to this local best-run list.",
      leaderboardRow: "#{rank}  Score {score}  {animal}",
      playAgain: "Play Again",
      menu: "Game Menu",
      pauseTitle: "Game paused",
      pauseText: "Your tower is waiting. Resume when you are ready.",
      resume: "Resume",
      leaveTitle: "Leave this run?",
      leaveText: "Your current score, merges, and remaining drops will be lost.",
      keepPlaying: "Keep Playing",
      leaveGame: "Leave Run",
      newBest: "New Best!",
      fruit0: "Mouse Ball",
      fruit1: "Rabbit Ball",
      fruit2: "Fox Ball",
      fruit3: "Penguin Ball",
      fruit4: "Koala Ball",
      fruit5: "Owl Ball",
      fruit6: "Panda Ball",
      fruit7: "Lion Cub Ball",
      fruit8: "Giraffe Ball",
      fruit9: "Elephant Ball",
      fruit10: "Lion King Ball",
    },
    "zh-Hant": {
      title: "動物合成塔",
      language: "語言",
      ariaLanguage: "語言選擇",
      ariaLobby: "返回 WeightPlay 大廳",
      ariaBattle: "動物合成塔遊玩畫面",
      ariaBattleBack: "返回挑戰關卡",
      ariaPause: "暫停遊戲",
      ariaScore: "分數資訊",
      ariaProgress: "合成進度",
      ariaBoard: "動物合成遊戲盤",
      ariaBoardControls: "使用左右方向鍵瞄準，再按空白鍵或 Enter 落下。",
      ariaAim: "瞄準位置 {value}%",
      score: "分數",
      best: "最佳",
      next: "下一顆",
      comboLabel: "連擊",
      comboReady: "待命",
      comboStatus: "x{count}",
      largest: "最大合成",
      goal: "目標：{name}",
      bestAnimal: "最佳動物 {name}",
      combo: "連續合成 x{count}！",
      drop: "落下",
      restart: "重新開始",
      menuTitle: "一路合成到獅王",
      menuDesc: "小心落下動物球。相同動物會合成下一個更大的動物，別讓塔超過紅線。",
      chainTitle: "合成路線",
      chainHint: "兩顆相同動物會合成下一種動物。",
      albumTitle: "棲地圖鑑 {unlocked}/4",
      albumUnlocked: "已發現：{name}",
      albumLocked: "合成至 {name}",
      habitatMeadow: "草原夥伴",
      habitatForest: "森林飛行",
      habitatSavanna: "莽原旅程",
      habitatRoyal: "獅王冠冕",
      nextHabitat: "下一個棲地：{habitat}",
      nextHabitatTarget: "合成至 {animal} · 還有 {count} 個動物階段",
      habitatStep: "階段",
      habitatSteps: "階段",
      habitatAlbumComplete: "棲地圖鑑完成 · 繼續向獅王合成！",
      start: "開始遊戲",
      freePlay: "自由模式",
      stageTitle: "動物祭典挑戰",
      ariaStage: "挑戰關卡選擇",
      stageHelp: "左右滑動，選擇已解鎖的挑戰。",
      stageBack: "返回主畫面",
      stageLabel: "挑戰 {stage}",
      stageLocked: "尚未解鎖",
      stageBest: "最佳 {score}",
      goalScore: "取得 {score} 分",
      goalTier: "合成 {animal}",
      goalMerges: "完成 {count} 次合成",
      goalCombo: "達成連擊 x{count}",
      goalDual: "合成 {animal} 並取得 {score} 分",
      dropsRule: "{count} 次落下",
      clearTitle: "挑戰完成！",
      failedTitle: "再試一次",
      nextChallenge: "下一個挑戰",
      retryChallenge: "重新挑戰",
      challengeMenu: "挑戰關卡",
      gameOver: "遊戲結束",
      result: "分數 {score}  最佳 {best}",
      resultScore: "分數 {score}",
      previousBest: "之前最佳 {score}",
      todayScore: "本次分數 {score}",
      improvement: "進步 {value}%",
      skillReport: "能力報告",
      logicSkill: "邏輯",
      problemSolvingSkill: "問題解決",
      coordinationSkill: "手眼協調",
      progressNewBest: "太棒了！你突破了自己的最佳分數。",
      progressImproved: "很棒的進步！你比之前更會安排落點了。",
      progressSteady: "做得很好！再試一次，練習更好的放置位置。",
      progressNote: "分數只用於遊戲樂趣與本機進步紀錄。",
      milestoneTitle: "合成里程碑",
      milestoneUnlocked: "已解鎖最高：{name}",
      milestoneNext: "下一個目標：{name}",
      milestoneComplete: "全部動物都解鎖了！挑戰更高分吧。",
      milestoneNew: "解鎖新動物：{name}！",
      aimStart: "點擊或拖曳遊戲區來瞄準。讓相同動物球在紅線下方合成。",
      aimMatch: "瞄準另一顆{name}，讓牠們合成。",
      aimSafe: "讓動物塔保持在紅色警戒線下方。",
      aimDanger: "太高了！快合成，或避開紅線附近。",
      dangerLine: "警戒線",
      leaderboardTitle: "你的最佳挑戰",
      noLeaderboard: "完成一場後，就會加入這份本機最佳紀錄。",
      leaderboardRow: "第 {rank} 名  分數 {score}  {animal}",
      playAgain: "再玩一次",
      menu: "遊戲選單",
      pauseTitle: "遊戲已暫停",
      pauseText: "動物塔正在等你，準備好再繼續。",
      resume: "繼續遊玩",
      leaveTitle: "要離開這一局嗎？",
      leaveText: "目前的分數、合成進度和剩餘投放次數都會消失。",
      keepPlaying: "繼續遊玩",
      leaveGame: "離開這局",
      newBest: "新紀錄！",
      fruit0: "老鼠球",
      fruit1: "兔兔球",
      fruit2: "狐狸球",
      fruit3: "企鵝球",
      fruit4: "無尾熊球",
      fruit5: "貓頭鷹球",
      fruit6: "熊貓球",
      fruit7: "小獅子球",
      fruit8: "長頸鹿球",
      fruit9: "大象球",
      fruit10: "獅王球",
    },
    es: {
      title: "Torre de Fusión Animal", language: "Idioma", ariaLanguage: "Selector de idioma", ariaLobby: "Volver a la sala de WeightPlay", ariaBattle: "Pantalla de Torre de Fusión Animal", ariaBattleBack: "Volver a los desafíos",
      ariaScore: "Información de puntuación", ariaProgress: "Progreso de fusión", ariaBoard: "Tablero de fusión animal", ariaBoardControls: "Usa las flechas izquierda y derecha para apuntar y Espacio o Enter para soltar.", ariaAim: "Puntería {value}%",
      score: "Puntuación", best: "Mejor", next: "Siguiente", comboLabel: "Combo", comboReady: "Listo", comboStatus: "x{count}", largest: "Mayor", goal: "Objetivo: {name}", bestAnimal: "Mejor animal: {name}", combo: "¡Combo x{count}!", drop: "Soltar", restart: "Reiniciar",
      menuTitle: "Fusiona hasta llegar al Rey León", menuDesc: "Suelta las bolas con cuidado. Dos animales iguales se fusionan en uno mayor. Mantén la torre bajo la línea roja.", chainTitle: "Ruta de fusión", chainHint: "Une dos animales iguales para desbloquear el siguiente.",
      albumTitle: "Álbum de hábitats {unlocked}/4", albumUnlocked: "{name} descubierto", albumLocked: "Alcanza {name}", habitatMeadow: "Amigos de la pradera", habitatForest: "Vuelo del bosque", habitatSavanna: "Ruta de la sabana", habitatRoyal: "Corona del león",
      nextHabitat: "Siguiente hábitat: {habitat}", nextHabitatTarget: "Alcanza {animal} · {count} {steps}", habitatStep: "paso animal", habitatSteps: "pasos animales", habitatAlbumComplete: "Álbum completo · ¡Sigue fusionando hacia el Rey León!",
      start: "Empezar", freePlay: "Juego libre", stageTitle: "Desafíos del festival", ariaStage: "Selección de desafíos", stageHelp: "Desliza a los lados y elige un desafío desbloqueado.", stageBack: "Volver al inicio", stageLabel: "Desafío {stage}", stageLocked: "Bloqueado", stageBest: "Mejor {score}",
      goalScore: "Consigue {score} puntos", goalTier: "Fusiona un {animal}", goalMerges: "Completa {count} fusiones", goalCombo: "Alcanza un combo x{count}", goalDual: "Fusiona {animal} y consigue {score} puntos", dropsRule: "{count} lanzamientos",
      clearTitle: "¡Desafío completado!", failedTitle: "Reintentar desafío", nextChallenge: "Siguiente desafío", retryChallenge: "Intentar de nuevo", challengeMenu: "Desafíos", gameOver: "Fin de la partida", result: "Puntuación {score}  Mejor {best}", resultScore: "Puntuación {score}",
      previousBest: "Mejor anterior {score}", todayScore: "Puntuación de hoy {score}", improvement: "Mejora {value}%", skillReport: "Informe de habilidades", logicSkill: "Lógica", problemSolvingSkill: "Resolución de problemas", coordinationSkill: "Coordinación visual",
      progressNewBest: "¡Progreso increíble! Mejoraste tu récord.", progressImproved: "¡Gran progreso! Superaste tu mejor marca anterior.", progressSteady: "¡Buen esfuerzo! Inténtalo otra vez para planificar mejor los lanzamientos.", progressNote: "Las puntuaciones solo sirven para divertirse y seguir el progreso local.",
      milestoneTitle: "Hito de fusión", milestoneUnlocked: "Mejor desbloqueado: {name}", milestoneNext: "Siguiente objetivo: {name}", milestoneComplete: "¡Todos los animales desbloqueados! Busca un nuevo récord.", milestoneNew: "¡Nuevo animal desbloqueado: {name}!",
      aimStart: "Toca o arrastra el tablero para apuntar. Fusiona animales iguales bajo la línea roja.", aimMatch: "Apunta cerca de otro {name} para fusionarlos.", aimSafe: "Mantén la torre bajo la línea roja de aviso.", aimDanger: "¡Demasiado alto! Fusiona rápido o aléjate de la línea roja.", dangerLine: "Línea de aviso",
      leaderboardTitle: "Tus mejores partidas", noLeaderboard: "Completa una partida para añadirla a esta lista local.", leaderboardRow: "#{rank}  Puntuación {score}  {animal}", playAgain: "Jugar de nuevo", menu: "Menú del juego", leaveTitle: "¿Salir de esta partida?", leaveText: "Perderás la puntuación, las fusiones y los lanzamientos restantes de esta partida.", keepPlaying: "Seguir jugando", leaveGame: "Salir de la partida", newBest: "¡Nuevo récord!",
      fruit0: "Bola ratón", fruit1: "Bola conejo", fruit2: "Bola zorro", fruit3: "Bola pingüino", fruit4: "Bola koala", fruit5: "Bola búho", fruit6: "Bola panda", fruit7: "Bola cachorro de león", fruit8: "Bola jirafa", fruit9: "Bola elefante", fruit10: "Bola Rey León",
    },
  };

  Object.assign(dictionary.es, {
    ariaPause: "Pausar el juego",
    pauseTitle: "Juego en pausa",
    pauseText: "Tu torre te espera. Continúa cuando quieras.",
    resume: "Continuar",
  });

  const challenges = [
    { id: 1, chapter: ["Meadow Steps", "草原起步"], name: ["First Pair", "第一對夥伴"], goal: "merges", target: 3, drops: 12, rules: ["classic"] },
    { id: 2, chapter: ["Meadow Steps", "草原起步"], name: ["Fox Picnic", "狐狸野餐"], goal: "tier", target: 2, drops: 14, rules: ["classic"] },
    { id: 3, chapter: ["Meadow Steps", "草原起步"], name: ["Quick Friends", "快速夥伴"], goal: "combo", target: 2, drops: 16, rules: ["classic"] },
    { id: 4, chapter: ["Meadow Steps", "草原起步"], name: ["Meadow Score", "草原得分"], goal: "score", target: 90, drops: 18, rules: ["classic"] },
    { id: 5, chapter: ["Meadow Steps", "草原起步"], name: ["Meadow Drum", "草原鼓檢查"], checkpoint: true, goal: "dual", target: 3, scoreTarget: 120, drops: 20, rules: ["classic"] },
    { id: 6, chapter: ["Forest Window", "森林窄窗"], name: ["Narrow Landing", "窄道落點"], goal: "merges", target: 5, drops: 18, rules: ["narrow"] },
    { id: 7, chapter: ["Forest Window", "森林窄窗"], name: ["Penguin Window", "企鵝窗口"], goal: "tier", target: 3, drops: 20, rules: ["narrow"] },
    { id: 8, chapter: ["Forest Window", "森林窄窗"], name: ["Center Stack", "中央堆疊"], goal: "score", target: 180, drops: 21, rules: ["narrow"] },
    { id: 9, chapter: ["Forest Window", "森林窄窗"], name: ["Window Chain", "窄窗連擊"], goal: "combo", target: 3, drops: 22, rules: ["narrow"] },
    { id: 10, chapter: ["Forest Window", "森林窄窗"], name: ["Owl Gate", "貓頭鷹門檢查"], checkpoint: true, goal: "dual", target: 4, scoreTarget: 240, drops: 24, rules: ["narrow"] },
    { id: 11, chapter: ["River Current", "河流氣流"], name: ["West Breeze", "西風落球"], goal: "merges", target: 7, drops: 22, rules: ["wind"] },
    { id: 12, chapter: ["River Current", "河流氣流"], name: ["Drifting Koala", "漂流無尾熊"], goal: "tier", target: 4, drops: 24, rules: ["wind"] },
    { id: 13, chapter: ["River Current", "河流氣流"], name: ["Breeze Score", "風中得分"], goal: "score", target: 320, drops: 25, rules: ["wind"] },
    { id: 14, chapter: ["River Current", "河流氣流"], name: ["Current Combo", "水流連擊"], goal: "combo", target: 3, drops: 26, rules: ["wind"] },
    { id: 15, chapter: ["River Current", "河流氣流"], name: ["Panda Ferry", "熊貓渡口檢查"], checkpoint: true, goal: "dual", target: 5, scoreTarget: 380, drops: 28, rules: ["wind"] },
    { id: 16, chapter: ["Mountain Weight", "山岳重力"], name: ["Heavy Landing", "重力落點"], goal: "merges", target: 9, drops: 25, rules: ["heavy"] },
    { id: 17, chapter: ["Mountain Weight", "山岳重力"], name: ["Owl Summit", "貓頭鷹山頂"], goal: "tier", target: 5, drops: 28, rules: ["heavy"] },
    { id: 18, chapter: ["Mountain Weight", "山岳重力"], name: ["Fast Collapse", "快速坍落"], goal: "combo", target: 4, drops: 29, rules: ["heavy"] },
    { id: 19, chapter: ["Mountain Weight", "山岳重力"], name: ["Mountain Score", "山岳得分"], goal: "score", target: 520, drops: 30, rules: ["heavy"] },
    { id: 20, chapter: ["Mountain Weight", "山岳重力"], name: ["Lion Cub Peak", "小獅子峰檢查"], checkpoint: true, goal: "dual", target: 6, scoreTarget: 560, drops: 32, rules: ["heavy"] },
    { id: 21, chapter: ["Moon Parade", "月光隊列"], name: ["Mouse-Rabbit Rhythm", "鼠兔節奏"], goal: "merges", target: 11, drops: 28, rules: ["fixed"] },
    { id: 22, chapter: ["Moon Parade", "月光隊列"], name: ["Known Next", "已知下一顆"], goal: "tier", target: 5, drops: 30, rules: ["fixed"] },
    { id: 23, chapter: ["Moon Parade", "月光隊列"], name: ["Parade Chain", "隊列連擊"], goal: "combo", target: 4, drops: 31, rules: ["fixed"] },
    { id: 24, chapter: ["Moon Parade", "月光隊列"], name: ["Planned Score", "規劃得分"], goal: "score", target: 650, drops: 32, rules: ["fixed"] },
    { id: 25, chapter: ["Moon Parade", "月光隊列"], name: ["Panda Lantern", "熊貓燈檢查"], checkpoint: true, goal: "dual", target: 6, scoreTarget: 650, drops: 34, rules: ["fixed"] },
    { id: 26, chapter: ["Crown Festival", "皇冠祭典"], name: ["Wind Window", "風之窄窗"], goal: "merges", target: 13, drops: 31, rules: ["narrow", "wind"] },
    { id: 27, chapter: ["Crown Festival", "皇冠祭典"], name: ["Heavy Parade", "重力隊列"], goal: "tier", target: 6, drops: 34, rules: ["heavy", "fixed"] },
    { id: 28, chapter: ["Crown Festival", "皇冠祭典"], name: ["Festival Combo", "祭典連擊"], goal: "combo", target: 5, drops: 35, rules: ["wind", "fixed"] },
    { id: 29, chapter: ["Crown Festival", "皇冠祭典"], name: ["Crown Score", "皇冠得分"], goal: "score", target: 900, drops: 36, rules: ["narrow", "heavy"] },
    { id: 30, chapter: ["Crown Festival", "皇冠祭典"], name: ["Lion Crown Table", "獅王餐桌檢查"], checkpoint: true, goal: "dual", target: 6, scoreTarget: 800, drops: 40, rules: ["narrow", "wind", "heavy", "fixed"] },
  ];

  const spanishChallengeCopy = [
    ["Pasos de la pradera", "Primera pareja"], ["Pasos de la pradera", "Pícnic del zorro"], ["Pasos de la pradera", "Amigos rápidos"], ["Pasos de la pradera", "Puntos de la pradera"], ["Pasos de la pradera", "Tambor de la pradera"],
    ["Ventana del bosque", "Aterrizaje estrecho"], ["Ventana del bosque", "Ventana del pingüino"], ["Ventana del bosque", "Torre central"], ["Ventana del bosque", "Combo en la ventana"], ["Ventana del bosque", "Puerta del búho"],
    ["Corriente del río", "Brisa del oeste"], ["Corriente del río", "Koala a la deriva"], ["Corriente del río", "Puntos con brisa"], ["Corriente del río", "Combo de corriente"], ["Corriente del río", "Ferry del panda"],
    ["Peso de la montaña", "Aterrizaje pesado"], ["Peso de la montaña", "Cima del búho"], ["Peso de la montaña", "Caída rápida"], ["Peso de la montaña", "Puntos de montaña"], ["Peso de la montaña", "Pico del cachorro de león"],
    ["Desfile lunar", "Ritmo de ratón y conejo"], ["Desfile lunar", "Siguiente conocido"], ["Desfile lunar", "Combo del desfile"], ["Desfile lunar", "Puntuación planificada"], ["Desfile lunar", "Farol del panda"],
    ["Festival de la corona", "Ventana con viento"], ["Festival de la corona", "Desfile pesado"], ["Festival de la corona", "Combo del festival"], ["Festival de la corona", "Puntos de la corona"], ["Festival de la corona", "Mesa de la corona del león"],
  ];
  if (spanishChallengeCopy.length !== challenges.length) throw new Error("Spanish merge-challenge coverage must match all challenges.");
  challenges.forEach((challenge, index) => {
    challenge.chapter.push(spanishChallengeCopy[index][0]);
    challenge.name.push(spanishChallengeCopy[index][1]);
  });

  const imageLoadTasks = [];

  function loadImage(src) {
    const image = new Image();
    image.decoding = "async";
    imageLoadTasks.push(new Promise((resolve) => {
      image.onload = image.onerror = resolve;
    }));
    image.src = src;
    return image;
  }

  const fruits = [
    { radius: 28, color: "#4854d9", accent: "#91a3ff", score: 2 },
    { radius: 34, color: "#d93652", accent: "#ff94a7", score: 4 },
    { radius: 42, color: "#ff4d63", accent: "#ffd35d", score: 8 },
    { radius: 52, color: "#7a4ce0", accent: "#c5a5ff", score: 14 },
    { radius: 64, color: "#ff9438", accent: "#ffd28a", score: 22 },
    { radius: 76, color: "#e83f4b", accent: "#ffac8a", score: 34 },
    { radius: 90, color: "#a8d957", accent: "#f4ff9e", score: 52 },
    { radius: 106, color: "#ffb182", accent: "#ffe0c8", score: 78 },
    { radius: 122, color: "#f5b43b", accent: "#75c95b", score: 118 },
    { radius: 142, color: "#8fd94f", accent: "#fff28a", score: 176 },
    { radius: 166, color: "#2fbd65", accent: "#1d8b45", score: 300 },
  ];

  const habitatMilestones = [
    { key: "habitatMeadow", level: 2 },
    { key: "habitatForest", level: 5 },
    { key: "habitatSavanna", level: 8 },
    { key: "habitatRoyal", level: 10 },
  ];

  const tokenSources = [
    "../../assets/animal-merge-token-0.png",
    "../../assets/animal-merge-token-1.png",
    "../../assets/animal-merge-token-2.png",
    "../../assets/animal-merge-token-3.png",
    "../../assets/animal-merge-token-4.png",
    "../../assets/animal-merge-token-5.png",
    "../../assets/animal-merge-token-6.png",
    "../../assets/animal-merge-token-7-boom-lion.png",
    "../../assets/animal-merge-token-8.png",
    "../../assets/animal-merge-token-9.png",
    "../../assets/animal-merge-token-10-boom-lion.png",
  ];
  const tokenImages = tokenSources.map((src) => loadImage(src));

  let fruitId = 1;
  let fruitsOnBoard = [];
  let currentLevel = 0;
  let nextLevel = 0;
  let maxReachedLevel = 0;
  let mergeBursts = [];
  let aimX = W / 2;
  let aimPointerId = null;
  let score = 0;
  let mergeCount = 0;
  let comboCount = 0;
  let comboUntil = 0;
  let comboHudTimer = null;
  let bestScore = Number(storageRead(BEST_KEY) || 0);
  let running = false;
  let gameOver = false;
  let canDropAt = 0;
  let lastTime = performance.now();
  let toastTimer = null;
  let engine = null;
  let world = null;
  let animationFrameId = null;
  let lifecycleSuspended = document.hidden;
  let lifecycleSuspendedAt = lifecycleSuspended ? performance.now() : 0;
  let activeChallengeIndex = null;
  let bestCombo = 0;
  let fixedQueueIndex = 0;
  let challengeLastDropAt = 0;
  let lastChallengeCleared = false;
  let windApplications = 0;
  let leaveConfirmOpen = false;
  let decisionMode = null;
  const fixedQueue = [0, 1, 0, 2, 1, 0, 1, 2, 0, 1, 3, 0];

  function activeNow() {
    return lifecycleSuspended ? lifecycleSuspendedAt : performance.now();
  }

  function scheduleComboHudExpiry() {
    window.clearTimeout(comboHudTimer);
    comboHudTimer = null;
    const remaining = comboUntil - activeNow();
    if (remaining > 0 && !lifecycleSuspended) {
      comboHudTimer = window.setTimeout(updateHud, remaining + 20);
    }
  }

  function clearAimPointer(pointerId = null) {
    if (aimPointerId === null || (pointerId !== null && pointerId !== aimPointerId)) return false;
    const ownedPointerId = aimPointerId;
    aimPointerId = null;
    try {
      if (canvas.hasPointerCapture?.(ownedPointerId)) canvas.releasePointerCapture(ownedPointerId);
    } catch {
      // Capture may already be gone after a browser or lifecycle interruption.
    }
    return true;
  }

  function suspendRunLifecycle() {
    clearAimPointer();
    if (lifecycleSuspended) return;
    lifecycleSuspended = true;
    lifecycleSuspendedAt = performance.now();
    window.clearTimeout(comboHudTimer);
    comboHudTimer = null;
    stopAnimationLoop();
  }

  function resumeRunLifecycle() {
    if (!lifecycleSuspended || document.hidden) return;
    const now = performance.now();
    const pausedFor = Math.max(0, now - lifecycleSuspendedAt);
    canDropAt += pausedFor;
    if (comboUntil > 0) comboUntil += pausedFor;
    for (const fruit of fruitsOnBoard) fruit.bornAt += pausedFor;
    lifecycleSuspended = false;
    lifecycleSuspendedAt = 0;
    lastTime = now;
    scheduleComboHudExpiry();
    updateHud();
    updateAimCoach();
    draw();
    if (running && !gameOver && document.body.classList.contains("fruit-playing")) startAnimationLoop();
  }

  function locale() {
    return window.WonderI18n?.actualLocale?.() || window.WonderI18n?.locale?.() || "en";
  }

  function t(key, params = {}) {
    const currentLocale = locale();
    const sourceLocale = currentLocale === "zh-Hans" ? "zh-Hant" : currentLocale;
    const table = dictionary[sourceLocale] || dictionary.en;
    const fallback = dictionary.en;
    let value = table[key] || fallback[key] || key;
    for (const [name, param] of Object.entries(params)) {
      value = value.replaceAll(`{${name}}`, String(param));
    }
    return currentLocale === "zh-Hans" ? window.WonderI18n?.simplifyChineseText?.(value) || value : value;
  }

  function activeChallenge() {
    return Number.isInteger(activeChallengeIndex) ? challenges[activeChallengeIndex] : null;
  }

  function localeSlot() {
    if (["zh-Hant", "zh-Hans"].includes(locale())) return 1;
    if (locale() === "es") return 2;
    return 0;
  }

  function localizedChallengeName(challenge) {
    const value = challenge.name[localeSlot()];
    return locale() === "zh-Hans" ? window.WonderI18n?.simplifyChineseText?.(value) || value : value;
  }

  function challengeGoalLabel(challenge = activeChallenge()) {
    if (!challenge) return t("goal", { name: t("fruit10") });
    if (challenge.goal === "score") return t("goalScore", { score: challenge.target });
    if (challenge.goal === "tier") return t("goalTier", { animal: t(`fruit${challenge.target}`) });
    if (challenge.goal === "merges") return t("goalMerges", { count: challenge.target });
    if (challenge.goal === "combo") return t("goalCombo", { count: challenge.target });
    return t("goalDual", { animal: t(`fruit${challenge.target}`), score: challenge.scoreTarget });
  }

  function challengeGoalMet(challenge = activeChallenge()) {
    if (!challenge) return false;
    if (challenge.goal === "score") return score >= challenge.target;
    if (challenge.goal === "tier") return maxReachedLevel >= challenge.target;
    if (challenge.goal === "merges") return mergeCount >= challenge.target;
    if (challenge.goal === "combo") return bestCombo >= challenge.target;
    return maxReachedLevel >= challenge.target && score >= challenge.scoreTarget;
  }

  function challengeProgressValue(challenge = activeChallenge()) {
    if (!challenge) return maxReachedLevel / (fruits.length - 1);
    if (challenge.goal === "score") return score / challenge.target;
    if (challenge.goal === "tier") return maxReachedLevel / challenge.target;
    if (challenge.goal === "merges") return mergeCount / challenge.target;
    if (challenge.goal === "combo") return bestCombo / challenge.target;
    return Math.min(maxReachedLevel / challenge.target, score / challenge.scoreTarget);
  }

  function readChallengeProgress() {
    try {
      const saved = JSON.parse(storageRead(CHALLENGE_KEY) || "{}");
      return {
        unlocked: clamp(Number(saved.unlocked) || 1, 1, challenges.length),
        selected: clamp(Number(saved.selected) || 1, 1, challenges.length),
        completed: Array.isArray(saved.completed) ? saved.completed.filter((id) => Number.isInteger(id) && id >= 1 && id <= challenges.length) : [],
        best: saved.best && typeof saved.best === "object" ? saved.best : {},
      };
    } catch {
      return { unlocked: 1, selected: 1, completed: [], best: {} };
    }
  }

  function saveChallengeProgress(progress) {
    try {
      storageWrite(CHALLENGE_KEY, JSON.stringify(progress));
    } catch {
      // Challenge progress remains optional when storage is unavailable.
    }
  }

  function aimBounds(level = currentLevel) {
    const radius = fruits[level]?.radius || fruits[0].radius;
    const challenge = activeChallenge();
    const narrow = challenge?.rules.includes("narrow");
    const inset = narrow ? 92 : 0;
    return { min: wallLeft + radius + inset, max: wallRight - radius - inset };
  }

  function applyText() {
    document.documentElement.lang = locale();
    document.title = `${t("title")} - WeightPlay`;
    titleText.textContent = t("title");
    languageLabel.textContent = t("language");
    localeSelect.setAttribute("aria-label", t("ariaLanguage"));
    document.querySelector(".home-link")?.setAttribute("aria-label", t("ariaLobby"));
    document.querySelector(".fixed-game-shell")?.setAttribute("aria-label", t("ariaBattle"));
    backToMenuBtn.setAttribute("aria-label", t("ariaBattleBack"));
    pauseBtn.setAttribute("aria-label", t("ariaPause"));
    document.querySelector(".scorebar")?.setAttribute("aria-label", t("ariaScore"));
    document.querySelector(".merge-goal")?.setAttribute("aria-label", t("ariaProgress"));
    canvas.setAttribute("aria-label", t("ariaBoard"));
    canvas.setAttribute("aria-description", t("ariaBoardControls"));
    scoreLabel.textContent = t("score");
    bestLabel.textContent = t("best");
    comboLabel.textContent = t("comboLabel");
    nextLabel.textContent = t("next");
    restartBtn.textContent = t("restart");
    menuTitle.textContent = t("menuTitle");
    menuDesc.textContent = t("menuDesc");
    renderChainPreview();
    startBtn.textContent = t("start");
    freePlayBtn.textContent = t("freePlay");
    stageTitle.textContent = t("stageTitle");
    stagePanel.setAttribute("aria-label", t("ariaStage"));
    stageHelp.textContent = t("stageHelp");
    stageBackBtn.setAttribute("aria-label", t("stageBack"));
    playAgainBtn.textContent = t("playAgain");
    menuBtn.textContent = t("menu");
    leaveConfirmTitle.textContent = t(decisionMode === "pause" ? "pauseTitle" : "leaveTitle");
    leaveConfirmText.textContent = t(decisionMode === "pause" ? "pauseText" : "leaveText");
    keepPlayingBtn.textContent = t(decisionMode === "pause" ? "resume" : "keepPlaying");
    leaveGameBtn.textContent = t("leaveGame");
    renderChallengeRail(false);
    updateHud();
    updateAimCoach();
    updateAimAccessibility();
    renderMilestone(menuMilestone, readProgress(), true);
    renderMilestone(resultMilestone, readProgress(), true);
    renderLeaderboard(menuLeaderboard, readLeaderboard());
    renderLeaderboard(resultLeaderboard, readLeaderboard());
  }

  function setLocale(value) {
    window.WonderI18n?.setLocale?.(value);
    applyText();
  }

  function updateLoadingProgress(percent) {
    const value = Math.max(0, Math.min(100, Math.round(percent)));
    if (loadingText) loadingText.textContent = `${value}%`;
    if (loadingFill) loadingFill.style.width = `${value}%`;
  }

  function preloadGameImages() {
    const total = Math.max(1, imageLoadTasks.length);
    let loaded = 0;
    updateLoadingProgress(0);
    return Promise.all(imageLoadTasks.map((task) => task.then(() => {
      loaded += 1;
      updateLoadingProgress((loaded / total) * 100);
    })));
  }

  function randomNextLevel() {
    const challenge = activeChallenge();
    if (challenge?.rules.includes("fixed")) {
      const value = fixedQueue[fixedQueueIndex % fixedQueue.length];
      fixedQueueIndex += 1;
      return value;
    }
    const poolMax = score > 900 ? 4 : score > 320 ? 3 : 2;
    return Math.floor(Math.random() * (poolMax + 1));
  }

  function showStage() {
    running = false;
    gameOver = true;
    stopAnimationLoop();
    resultPanel.classList.add("hidden");
    leaveConfirmPanel.classList.add("hidden");
    leaveConfirmOpen = false;
    decisionMode = null;
    menuPanel.classList.add("hidden");
    stagePanel.classList.remove("hidden");
    playPanel.inert = false;
    playPanel.removeAttribute("aria-hidden");
    setBattleContentInert(false);
    document.body.classList.remove("fruit-main", "fruit-playing");
    document.body.classList.add("fruit-stage");
    renderChallengeRail(true);
    updateFruitBattleScale();
  }

  function startChallenge(id) {
    const progress = readChallengeProgress();
    if (id > progress.unlocked) return;
    activeChallengeIndex = id - 1;
    progress.selected = id;
    saveChallengeProgress(progress);
    stagePanel.classList.add("hidden");
    document.body.classList.remove("fruit-stage", "fruit-main");
    document.body.classList.add("fruit-playing");
    window.WonderSound?.play?.("start");
    resetGame(false, `challenge-${id}`);
  }

  function resetGame(showMenu = false, source = "menu") {
    clearAimPointer();
    if (showMenu) activeChallengeIndex = null;
    document.body.classList.toggle("fruit-playing", !showMenu);
    document.body.classList.toggle("fruit-main", showMenu);
    document.body.classList.remove("fruit-stage");
    stagePanel.classList.add("hidden");
    resultPanel.classList.add("hidden");
    leaveConfirmPanel.classList.add("hidden");
    leaveConfirmOpen = false;
    decisionMode = null;
    playPanel.inert = false;
    playPanel.removeAttribute("aria-hidden");
    setBattleContentInert(false);
    menuPanel.classList.toggle("hidden", !showMenu);
    startBtn.disabled = !showMenu;
    updateFruitBattleScale();

    initPhysicsWorld();
    fruitsOnBoard = [];
    currentLevel = randomNextLevel();
    nextLevel = randomNextLevel();
    maxReachedLevel = currentLevel;
    mergeBursts = [];
    aimX = W / 2;
    canvas.dataset.dropCount = "0";
    score = 0;
    mergeCount = 0;
    comboCount = 0;
    bestCombo = 0;
    comboUntil = 0;
    fixedQueueIndex = 0;
    challengeLastDropAt = 0;
    lastChallengeCleared = false;
    windApplications = 0;
    window.clearTimeout(comboHudTimer);
    fruitId = 1;
    running = !showMenu;
    gameOver = false;
    canDropAt = performance.now() + 300;
    updateHud();
    updateAimCoach();
    updateAimAccessibility();
    if (!showMenu) {
      window.WonderAnalytics?.track?.("game_start", { game_id: GAME_ID, source, challenge: activeChallenge()?.id || null });
      startAnimationLoop();
      requestAnimationFrame(() => canvas.focus({ preventScroll: true }));
    } else {
      startBtn.disabled = false;
      stopAnimationLoop();
      draw();
      requestAnimationFrame(() => startBtn.focus({ preventScroll: true }));
    }
  }

  function updateFruitBattleScale() {
    if (!document.body.classList.contains("fruit-playing") && !document.body.classList.contains("fruit-stage")) return;
    const isStage = document.body.classList.contains("fruit-stage");
    const minimumLogicalWidth = isStage ? 390 : 382;
    const minimumLogicalHeight = isStage ? 788 : 780;
    const viewportWidth = visualViewport?.width || innerWidth;
    const viewportHeight = visualViewport?.height || innerHeight;
    const scale = Math.max(0.1, Math.min(viewportWidth / minimumLogicalWidth, viewportHeight / minimumLogicalHeight));
    const logicalWidth = viewportWidth / scale;
    const logicalHeight = viewportHeight / scale;
    const root = document.documentElement.style;
    document.body.classList.remove("fruit-expanded-canvas");
    root.setProperty("--fruit-battle-scale", String(scale));
    root.setProperty("--fruit-logical-width", `${logicalWidth}px`);
    root.setProperty("--fruit-logical-height", `${logicalHeight}px`);
    root.setProperty("--fruit-battle-left", "0px");
    root.setProperty("--fruit-battle-top", "0px");
    document.querySelectorAll(".fruit-game, .fixed-game-shell, #stagePanel, #resultPanel").forEach((element) => {
      element.dataset.wpCommonScale = String(scale);
      element.dataset.wpLogicalWidth = String(logicalWidth);
      element.dataset.wpLogicalHeight = String(logicalHeight);
    });
  }

  addEventListener("resize", updateFruitBattleScale, { passive: true });
  addEventListener("orientationchange", updateFruitBattleScale, { passive: true });
  visualViewport?.addEventListener("resize", updateFruitBattleScale, { passive: true });
  visualViewport?.addEventListener("scroll", updateFruitBattleScale, { passive: true });

  function updateHud() {
    scoreText.textContent = score;
    bestText.textContent = bestScore;
    nextFruitText.innerHTML = animalTokenMarkup(nextLevel);
    nextFruitText.setAttribute("aria-label", t(`fruit${nextLevel}`));
    nextFruitText.title = t(`fruit${nextLevel}`);
    largestLabel.textContent = t("largest");
    largestFruitText.textContent = t(`fruit${maxReachedLevel}`);
    largestFruitToken.innerHTML = animalTokenMarkup(maxReachedLevel);
    largestFruitToken.setAttribute("aria-label", t(`fruit${maxReachedLevel}`));
    const challenge = activeChallenge();
    goalText.textContent = challenge
      ? `${t("stageLabel", { stage: challenge.id })} · ${challengeGoalLabel(challenge)} · ${Number(canvas.dataset.dropCount || 0)}/${challenge.drops}`
      : t("goal", { name: t("fruit10") });
    goalFill.style.width = `${Math.round(clamp(challengeProgressValue(challenge), 0, 1) * 100)}%`;
    updateComboHud();
    updateAimCoach();
  }

  function updateComboHud() {
    const active = running && !gameOver && comboCount > 1 && activeNow() <= comboUntil;
    comboText.textContent = active ? t("comboStatus", { count: comboCount }) : t("comboReady");
    comboBox.classList.toggle("active", active);
  }

  function dropFruit() {
    if (!running || gameOver || lifecycleSuspended || activeNow() < canDropAt) return;
    const challenge = activeChallenge();
    if (challenge && Number(canvas.dataset.dropCount || 0) >= challenge.drops) return;
    const spec = fruits[currentLevel];
    const bounds = aimBounds(currentLevel);
    const x = clamp(aimX, bounds.min, bounds.max);
    const fruit = {
      id: fruitId++,
      level: currentLevel,
      x,
      y: dropY,
      vx: 0,
      vy: 0,
      radius: spec.radius,
      angle: 0,
      merging: false,
      bornAt: activeNow(),
    };
    fruit.body = createFruitBody(fruit);
    fruitsOnBoard.push(fruit);
    canvas.dataset.dropCount = String(Number(canvas.dataset.dropCount || 0) + 1);
    challengeLastDropAt = activeNow();
    maxReachedLevel = Math.max(maxReachedLevel, currentLevel);
    World.add(world, fruit.body);
    currentLevel = nextLevel;
    nextLevel = randomNextLevel();
    canDropAt = activeNow() + 520;
    window.WonderSound?.play?.("click");
    updateHud();
    updateAimCoach();
    updateAimAccessibility();
  }

  function ruleLabel(rule) {
    const labels = {
      en: { classic: "Open Box", narrow: "Narrow Window", wind: "River Wind", heavy: "Heavy Gravity", fixed: "Fixed Queue" },
      "zh-Hant": { classic: "開放箱", narrow: "窄窗", wind: "河風", heavy: "重力加強", fixed: "固定隊列" },
      es: { classic: "Caja abierta", narrow: "Ventana estrecha", wind: "Viento del río", heavy: "Gravedad fuerte", fixed: "Cola fija" },
    };
    const currentLocale = locale();
    const sourceLocale = currentLocale === "zh-Hans" ? "zh-Hant" : currentLocale;
    const value = labels[sourceLocale]?.[rule] || rule;
    return currentLocale === "zh-Hans" ? window.WonderI18n?.simplifyChineseText?.(value) || value : value;
  }

  function renderChallengeRail(centerLatest = true) {
    if (!stageRail || !stageDots) return;
    const progress = readChallengeProgress();
    const selected = Math.min(progress.unlocked, progress.selected || progress.unlocked);
    stageRail.innerHTML = "";
    stageDots.innerHTML = "";
    challenges.forEach((challenge) => {
      const unlocked = challenge.id <= progress.unlocked;
      const card = document.createElement("button");
      card.type = "button";
      card.className = `merge-stage-card${challenge.checkpoint ? " is-checkpoint" : ""}${unlocked ? "" : " is-locked"}${challenge.id === selected ? " is-selected" : ""}`;
      card.dataset.stage = String(challenge.id);
      card.setAttribute("aria-disabled", String(!unlocked));
      card.innerHTML = `
        <b>${t("stageLabel", { stage: challenge.id })}</b>
        <strong>${localizedChallengeName(challenge)}</strong>
        <span>${challengeGoalLabel(challenge)}</span>
        <small>${challenge.rules.map(ruleLabel).join(" · ")} · ${t("dropsRule", { count: challenge.drops })}</small>
        <em>${unlocked ? t("stageBest", { score: Number(progress.best[challenge.id]) || 0 }) : t("stageLocked")}</em>
      `;
      card.addEventListener("click", () => {
        if (!unlocked || stageRail.dataset.dragged === "true") return;
        startChallenge(challenge.id);
      });
      stageRail.append(card);
      const dot = document.createElement("i");
      dot.className = challenge.id === selected ? "active" : "";
      stageDots.append(dot);
    });
    if (centerLatest) requestAnimationFrame(() => centerChallengeCard(selected, "auto"));
  }

  function centerChallengeCard(id, behavior = "smooth") {
    const card = stageRail.querySelector(`[data-stage="${id}"]`);
    if (!card) return;
    const left = Math.max(0, Math.min(card.offsetLeft + card.offsetWidth / 2 - stageRail.clientWidth / 2, stageRail.scrollWidth - stageRail.clientWidth));
    stageRail.scrollTo({ left, behavior });
    stageRail.querySelectorAll(".merge-stage-card").forEach((item) => item.classList.toggle("is-selected", item === card));
    [...stageDots.children].forEach((dot, index) => dot.classList.toggle("active", index === id - 1));
  }

  function installChallengeRail() {
    let pointerId = null;
    let startX = 0;
    let startScroll = 0;
    let moved = false;
    stageRail.addEventListener("pointerdown", (event) => {
      pointerId = event.pointerId;
      startX = event.clientX;
      startScroll = stageRail.scrollLeft;
      moved = false;
    });
    stageRail.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 6) moved = true;
      if (moved) stageRail.scrollLeft = startScroll - delta;
    });
    const finish = (event) => {
      if (event.pointerId !== pointerId) return;
      pointerId = null;
      if (!moved) return;
      stageRail.dataset.dragged = "true";
      const center = stageRail.scrollLeft + stageRail.clientWidth / 2;
      const cards = [...stageRail.querySelectorAll(".merge-stage-card")];
      const nearest = cards.reduce((best, card) => {
        const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
        return !best || distance < best.distance ? { card, distance } : best;
      }, null)?.card;
      centerChallengeCard(Number(nearest?.dataset.stage || 1));
      setTimeout(() => delete stageRail.dataset.dragged, 140);
    };
    stageRail.addEventListener("pointerup", finish);
    stageRail.addEventListener("pointercancel", finish);
  }

  function updateAimAccessibility() {
    const { min, max } = aimBounds(currentLevel);
    const value = Math.round(((clamp(aimX, min, max) - min) / Math.max(1, max - min)) * 100);
    canvas.setAttribute("aria-valuenow", String(value));
    canvas.setAttribute("aria-valuetext", t("ariaAim", { value }));
  }

  function initPhysicsWorld() {
    if (!Matter) {
      showToast("Physics loading failed");
      return;
    }
    engine = Engine.create({
      enableSleeping: true,
      positionIterations: 12,
      velocityIterations: 10,
      constraintIterations: 4,
    });
    world = engine.world;
    engine.gravity.y = activeChallenge()?.rules.includes("heavy") ? 2.05 : 1.45;

    const wallOptions = {
      isStatic: true,
      restitution: 0.02,
      friction: 1,
      render: { visible: false },
    };
    World.add(world, [
      Bodies.rectangle(wallLeft - 18, H / 2, 36, H, wallOptions),
      Bodies.rectangle(wallRight + 18, H / 2, 36, H, wallOptions),
      Bodies.rectangle(W / 2, floorY + 18, wallRight - wallLeft + 72, 36, wallOptions),
    ]);
  }

  function createFruitBody(fruit, velocity = { x: 0, y: 0 }) {
    const body = Bodies.circle(fruit.x, fruit.y, fruit.radius, {
      label: "fruit",
      restitution: 0.04,
      friction: 0.96,
      frictionStatic: 1.2,
      frictionAir: 0.018,
      density: 0.0012,
      sleepThreshold: 72,
      slop: 0.01,
    });
    body.fruitId = fruit.id;
    Body.setVelocity(body, velocity);
    return body;
  }

  function syncFruitsFromBodies() {
    for (const fruit of fruitsOnBoard) {
      if (!fruit.body) continue;
      fruit.x = fruit.body.position.x;
      fruit.y = fruit.body.position.y;
      fruit.vx = fruit.body.velocity.x * 60;
      fruit.vy = fruit.body.velocity.y * 60;
      fruit.angle = fruit.body.angle;
      fruit.sleeping = fruit.body.isSleeping;
    }
  }

  function step(dt) {
    Engine.update(engine, Math.min(33.33, dt * 1000));
    syncFruitsFromBodies();
    applyChallengeForces();
    resolveMerges();
    syncFruitsFromBodies();
    updateMergeBursts(dt);
    if (checkChallengeSettlement()) return;
    checkGameOver(dt);
  }

  function applyChallengeForces() {
    const challenge = activeChallenge();
    if (!challenge?.rules.includes("wind")) return;
    const direction = Math.sin(activeNow() / 1450);
    for (const fruit of fruitsOnBoard) {
      if (!fruit.body || fruit.body.isSleeping) continue;
      Body.applyForce(fruit.body, fruit.body.position, { x: direction * fruit.body.mass * 0.000055, y: 0 });
      windApplications += 1;
    }
  }

  function checkChallengeSettlement() {
    const challenge = activeChallenge();
    if (!challenge || gameOver) return false;
    if (challengeGoalMet(challenge)) {
      endGame(true);
      return true;
    }
    const dropsUsed = Number(canvas.dataset.dropCount || 0);
    if (dropsUsed < challenge.drops || activeNow() - challengeLastDropAt < 1800) return false;
    const settled = fruitsOnBoard.every((fruit) => fruit.sleeping || Math.hypot(fruit.vx, fruit.vy) < 48);
    if (!settled) return false;
    endGame(false);
    return true;
  }

  function resolveMerges() {
    const removeIds = new Set();
    const additions = [];
    for (let i = 0; i < fruitsOnBoard.length; i += 1) {
      for (let j = i + 1; j < fruitsOnBoard.length; j += 1) {
        const a = fruitsOnBoard[i];
        const b = fruitsOnBoard[j];
        if (removeIds.has(a.id) || removeIds.has(b.id) || a.level !== b.level || a.level >= fruits.length - 1) continue;
        if (!shouldMerge(a, b)) continue;
        const next = fruits[a.level + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 1;
        const nx = dx / dist;
        const ny = dy / dist;
        const velocityA = a.body?.velocity || { x: a.vx / 60, y: a.vy / 60 };
        const velocityB = b.body?.velocity || { x: b.vx / 60, y: b.vy / 60 };
        const relativeVx = (velocityB.x - velocityA.x) * 60;
        const relativeVy = (velocityB.y - velocityA.y) * 60;
        const impact = Math.min(420, Math.max(90, Math.abs(relativeVx * nx + relativeVy * ny) + Math.hypot(relativeVx, relativeVy) * 0.28));
        const mergedVelocity = {
          x: (velocityA.x + velocityB.x) * 0.46 + nx * impact * 0.0025,
          y: Math.min((velocityA.y + velocityB.y) * 0.42 + ny * impact * 0.0018, 5.2),
        };
        const merged = {
          id: fruitId++,
          level: a.level + 1,
          x: clamp((a.x + b.x) / 2, wallLeft + next.radius, wallRight - next.radius),
          y: Math.min((a.y + b.y) / 2, floorY - next.radius),
          vx: mergedVelocity.x * 60,
          vy: mergedVelocity.y * 60,
          radius: next.radius,
          angle: (a.angle + b.angle) / 2,
          pop: 0.24,
          bornAt: activeNow(),
        };
        if (a.body) World.remove(world, a.body);
        if (b.body) World.remove(world, b.body);
        merged.body = createFruitBody(merged, mergedVelocity);
        Body.setAngle(merged.body, merged.angle);
        World.add(world, merged.body);
        removeIds.add(a.id);
        removeIds.add(b.id);
        additions.push(merged);
        spawnMergeBurst(merged.x, merged.y, next.color, impact);
        addMergeScore(next.score);
        mergeCount += 1;
        const previousRunMax = maxReachedLevel;
        maxReachedLevel = Math.max(maxReachedLevel, merged.level);
        const savedHighest = Number(readProgress().highestLevel) || 0;
        if (merged.level > previousRunMax && merged.level > savedHighest) {
          showToast(t("milestoneNew", { name: t(`fruit${merged.level}`) }));
        }
        if (merged.level === fruits.length - 1) showToast(t("fruit10"));
        window.WonderSound?.play?.("success");
        break;
      }
    }
    if (!removeIds.size) return;
    fruitsOnBoard = fruitsOnBoard.filter((fruit) => !removeIds.has(fruit.id)).concat(additions);
    updateHud();
    updateAimCoach();
  }

  function addMergeScore(baseScore) {
    const now = activeNow();
    comboCount = now <= comboUntil ? comboCount + 1 : 1;
    bestCombo = Math.max(bestCombo, comboCount);
    comboUntil = now + 2200;
    const multiplier = Math.min(5, comboCount);
    score += baseScore * multiplier;
    if (multiplier > 1) showToast(t("combo", { count: multiplier }));
    scheduleComboHudExpiry();
    updateComboHud();
  }

  function shouldMerge(a, b) {
    if (a.level !== b.level || a.level >= fruits.length - 1) return false;
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    const mergeDistance = a.radius + b.radius + 3;
    return dist <= mergeDistance;
  }

  function spawnMergeBurst(x, y, color, impact) {
    mergeBursts.push({ x, y, color, life: 0.34, maxLife: 0.34, impact });
  }

  function updateMergeBursts(dt) {
    for (const fruit of fruitsOnBoard) {
      if (fruit.pop > 0) fruit.pop = Math.max(0, fruit.pop - dt);
    }
    mergeBursts = mergeBursts
      .map((burst) => ({ ...burst, life: burst.life - dt }))
      .filter((burst) => burst.life > 0);
  }

  function checkGameOver(dt) {
    const now = activeNow();
    let dangerTime = 0;
    for (const fruit of fruitsOnBoard) {
      const old = fruit.dangerTime || 0;
      const age = now - fruit.bornAt;
      const topAboveLine = fruit.y - fruit.radius < dangerY;
      const notFreshDrop = age > 1800;
      const stableEnough = fruit.sleeping || Math.hypot(fruit.vx, fruit.vy) < 135 || fruit.vy < 70;
      fruit.dangerTime = topAboveLine && notFreshDrop && stableEnough ? old + dt : 0;
      dangerTime = Math.max(dangerTime, fruit.dangerTime);
    }
    if (dangerTime > 0.9) endGame();
    updateAimCoach();
  }

  function updateAimCoach() {
    if (!aimCoach) return;
    aimCoach.classList.toggle("hidden", !running || gameOver);
    if (!running || gameOver) return;

    const now = activeNow();
    const highFruit = fruitsOnBoard.some((fruit) => {
      const age = now - fruit.bornAt;
      return age > 1200 && fruit.y - fruit.radius < dangerY + 92;
    });
    const sameLevel = fruitsOnBoard.find((fruit) => fruit.level === currentLevel && now - fruit.bornAt > 700);

    if (highFruit) {
      aimCoach.textContent = t("aimDanger");
      aimCoach.dataset.tone = "danger";
    } else if (sameLevel) {
      aimCoach.textContent = t("aimMatch", { name: t(`fruit${currentLevel}`) });
      aimCoach.dataset.tone = "match";
    } else {
      aimCoach.textContent = fruitsOnBoard.length ? t("aimSafe") : t("aimStart");
      aimCoach.dataset.tone = fruitsOnBoard.length ? "safe" : "start";
    }
  }

  function endGame(cleared = false) {
    if (gameOver) return;
    running = false;
    gameOver = true;
    stopAnimationLoop();
    const previousBest = bestScore;
    const newBest = score > previousBest;
    if (newBest) {
      bestScore = score;
      storageWrite(BEST_KEY, String(bestScore));
      showToast(t("newBest"));
    }
    const progress = saveProgress(score, previousBest, bestScore);
    const leaderboard = recordLeaderboard(score, maxReachedLevel);
    const challenge = activeChallenge();
    lastChallengeCleared = Boolean(challenge && cleared);
    if (challenge) {
      const challengeProgress = readChallengeProgress();
      challengeProgress.best[challenge.id] = Math.max(Number(challengeProgress.best[challenge.id]) || 0, score);
      if (cleared) {
        if (!challengeProgress.completed.includes(challenge.id)) challengeProgress.completed.push(challenge.id);
        challengeProgress.unlocked = Math.max(challengeProgress.unlocked, Math.min(challenges.length, challenge.id + 1));
        challengeProgress.selected = Math.min(challenges.length, challenge.id + 1);
      } else {
        challengeProgress.selected = challenge.id;
      }
      saveChallengeProgress(challengeProgress);
    }
    resultTitle.textContent = challenge ? t(cleared ? "clearTitle" : "failedTitle") : t("gameOver");
    renderResultReport(progress, newBest);
    renderMilestone(resultMilestone, progress, true);
    renderLeaderboard(resultLeaderboard, leaderboard);
    resultPanel.classList.remove("hidden");
    setBattleContentInert(true);
    requestAnimationFrame(() => playAgainBtn.focus({ preventScroll: true }));
    playAgainBtn.textContent = challenge ? t(cleared && challenge.id < challenges.length ? "nextChallenge" : "retryChallenge") : t("playAgain");
    menuBtn.textContent = challenge ? t("challengeMenu") : t("menu");
    window.WonderAnalytics?.track?.("game_complete", { game_id: GAME_ID, score, best_score: bestScore, new_best: newBest, challenge: challenge?.id || null, cleared: challenge ? cleared : false });
    window.WonderAnalytics?.track?.("score_game_over", { game_id: GAME_ID, score, best_score: bestScore });
    updateHud();
  }

  function readProgress() {
    try {
      return JSON.parse(storageRead(PROGRESS_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveProgress(finalScore, previousBest, currentBest) {
    const old = readProgress();
    const improvementPercent = previousBest > 0 ? Math.round(((finalScore - previousBest) / previousBest) * 100) : 0;
    const progress = {
      lastScore: finalScore,
      bestScore: currentBest,
      playCount: (Number(old.playCount) || 0) + 1,
      lastPlayedAt: new Date().toISOString(),
      improvementPercent,
      maxReachedLevel,
      highestLevel: Math.max(Number(old.highestLevel) || 0, maxReachedLevel),
      skillScores: buildSkillScores(finalScore),
    };
    try {
      storageWrite(PROGRESS_KEY, JSON.stringify(progress));
    } catch {
      // Local progress is optional.
    }
    return { ...progress, previousBest };
  }

  function readLeaderboard() {
    try {
      const rows = JSON.parse(storageRead(LEADERBOARD_KEY) || "[]");
      return Array.isArray(rows) ? rows : [];
    } catch {
      return [];
    }
  }

  function recordLeaderboard(finalScore, level) {
    const rows = readLeaderboard();
    rows.push({
      score: finalScore,
      highestLevel: level,
      playedAt: new Date().toISOString(),
    });
    const topRows = rows
      .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
      .slice(0, 5);
    try {
      storageWrite(LEADERBOARD_KEY, JSON.stringify(topRows));
    } catch {
      // Local leaderboard is optional.
    }
    return topRows;
  }

  function renderLeaderboard(target, rows) {
    if (!target) return;
    target.replaceChildren();
    const title = document.createElement("strong");
    title.textContent = t("leaderboardTitle");
    target.appendChild(title);
    if (!rows.length) {
      const empty = document.createElement("span");
      empty.textContent = t("noLeaderboard");
      target.appendChild(empty);
      return;
    }
    rows.slice(0, 5).forEach((row, index) => {
      const item = document.createElement("span");
      item.textContent = t("leaderboardRow", {
        rank: index + 1,
        score: Number(row.score || 0),
        animal: t(`fruit${clamp(Number(row.highestLevel) || 0, 0, fruits.length - 1)}`),
      });
      target.appendChild(item);
    });
  }

  function renderMilestone(target, progress = readProgress(), showHabitatGoal = false) {
    if (!target) return;
    target.replaceChildren();
    const highest = Math.max(0, Math.min(fruits.length - 1, Number(progress.highestLevel) || 0));
    const next = Math.min(fruits.length - 1, highest + 1);
    const title = document.createElement("strong");
    title.textContent = t("milestoneTitle");
    const row = document.createElement("div");
    row.className = "milestone-row";
    const current = document.createElement("span");
    current.innerHTML = `${animalTokenMarkup(highest)} <b>${t("milestoneUnlocked", { name: t(`fruit${highest}`) })}</b>`;
    const nextTarget = document.createElement("span");
    nextTarget.innerHTML = `${animalTokenMarkup(next)} <b>${highest >= fruits.length - 1 ? t("milestoneComplete") : t("milestoneNext", { name: t(`fruit${next}`) })}</b>`;
    row.append(current, nextTarget);
    target.append(title, row);
    if (showHabitatGoal) {
      const habitatGoal = document.createElement("div");
      habitatGoal.className = "habitat-next-goal";
      const nextHabitat = habitatMilestones.find((habitat) => highest < habitat.level);
      if (!nextHabitat) {
        habitatGoal.textContent = t("habitatAlbumComplete");
      } else {
        const steps = nextHabitat.level - highest;
        habitatGoal.innerHTML = `${animalTokenMarkup(nextHabitat.level)}<span><b>${t("nextHabitat", { habitat: t(nextHabitat.key) })}</b><small>${t("nextHabitatTarget", { animal: t(`fruit${nextHabitat.level}`), count: steps, steps: t(steps === 1 ? "habitatStep" : "habitatSteps") })}</small></span>`;
      }
      target.appendChild(habitatGoal);
    }
  }

  function renderChainPreview() {
    if (!chainPreview) return;
    chainPreview.replaceChildren();
    const highest = Math.max(0, Math.min(fruits.length - 1, Number(readProgress().highestLevel) || 0));

    const title = document.createElement("strong");
    title.textContent = t("chainTitle");
    chainPreview.appendChild(title);

    const rail = document.createElement("div");
    rail.className = "chain-rail";
    fruits.forEach((_, level) => {
      const item = document.createElement("span");
      const unlocked = level <= highest;
      item.className = `chain-step${unlocked ? " unlocked" : " locked"}`;
      item.title = unlocked ? t("albumUnlocked", { name: t(`fruit${level}`) }) : t("albumLocked", { name: t(`fruit${level}`) });
      item.setAttribute("aria-label", item.title);
      item.innerHTML = animalTokenMarkup(level);
      rail.appendChild(item);
    });
    chainPreview.appendChild(rail);

    const unlockedHabitats = habitatMilestones.filter((habitat) => highest >= habitat.level).length;
    const album = document.createElement("section");
    album.className = "habitat-album";
    const albumTitle = document.createElement("strong");
    albumTitle.textContent = t("albumTitle", { unlocked: unlockedHabitats });
    const albumGrid = document.createElement("div");
    albumGrid.className = "habitat-album-grid";
    habitatMilestones.forEach((habitat) => {
      const unlocked = highest >= habitat.level;
      const card = document.createElement("span");
      card.className = `habitat-album-card${unlocked ? " unlocked" : " locked"}`;
      const state = unlocked
        ? t("albumUnlocked", { name: t(habitat.key) })
        : t("albumLocked", { name: t(`fruit${habitat.level}`) });
      card.setAttribute("aria-label", state);
      card.innerHTML = `${animalTokenMarkup(habitat.level)}<b>${t(habitat.key)}</b><small>${state}</small>`;
      albumGrid.appendChild(card);
    });
    album.append(albumTitle, albumGrid);
    chainPreview.appendChild(album);

    const hint = document.createElement("small");
    hint.textContent = t("chainHint");
    chainPreview.appendChild(hint);
  }

  function buildSkillScores(finalScore) {
    const maxLevel = fruitsOnBoard.reduce((value, fruit) => Math.max(value, fruit.level || 0), 0);
    return {
      logic: clamp(1 + Math.floor(maxLevel / 2), 1, 5),
      problemSolving: clamp(1 + Math.floor(finalScore / 220), 1, 5),
      coordination: clamp(1 + Math.floor(mergeCount / 4), 1, 5),
    };
  }

  function renderStars(value) {
    return "★".repeat(value) + "☆".repeat(5 - value);
  }

  function renderResultReport(progress, newBest) {
    resultText.replaceChildren();

    const summary = document.createElement("p");
    summary.className = "result-summary";
    const challenge = activeChallenge();
    summary.textContent = challenge
      ? `${t("stageLabel", { stage: challenge.id })} · ${localizedChallengeName(challenge)} · ${challengeGoalLabel(challenge)} · ${t("resultScore", { score: progress.lastScore })}`
      : t("result", { score: progress.lastScore, best: progress.bestScore });
    resultText.appendChild(summary);

    const stats = document.createElement("div");
    stats.className = "result-stats";
    [
      t("todayScore", { score: progress.lastScore }),
      t("previousBest", { score: progress.previousBest }),
      t("improvement", { value: Math.max(0, progress.improvementPercent) }),
      t("bestAnimal", { name: t(`fruit${progress.highestLevel}`) }),
    ].forEach((item) => {
      const chip = document.createElement("span");
      chip.textContent = item;
      stats.appendChild(chip);
    });
    resultText.appendChild(stats);

    const report = document.createElement("section");
    report.className = "skill-report";
    const title = document.createElement("strong");
    title.textContent = t("skillReport");
    report.appendChild(title);
    [
      [t("logicSkill"), progress.skillScores.logic],
      [t("problemSolvingSkill"), progress.skillScores.problemSolving],
      [t("coordinationSkill"), progress.skillScores.coordination],
    ].forEach(([name, value]) => {
      const row = document.createElement("div");
      row.className = "skill-row";
      const label = document.createElement("span");
      label.textContent = name;
      const stars = document.createElement("b");
      stars.textContent = renderStars(value);
      row.append(label, stars);
      report.appendChild(row);
    });
    resultText.appendChild(report);

    const message = document.createElement("p");
    message.className = "result-encouragement";
    message.textContent = newBest ? t("progressNewBest") : progress.improvementPercent > 0 ? t("progressImproved") : t("progressSteady");
    resultText.appendChild(message);

    const note = document.createElement("small");
    note.textContent = t("progressNote");
    resultText.appendChild(note);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawBoard();
    for (const fruit of fruitsOnBoard) drawFruit(fruit);
    drawMergeBursts();
    if (running && !gameOver) drawDropPreview();
  }

  function drawBoard() {
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, "#eaf7ff");
    gradient.addColorStop(1, "#fff8dc");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#29364d";
    roundRect(ctx, wallLeft - 18, 82, 18, floorY - 70, 8);
    ctx.fill();
    roundRect(ctx, wallRight, 82, 18, floorY - 70, 8);
    ctx.fill();
    roundRect(ctx, wallLeft - 18, floorY, wallRight - wallLeft + 36, 26, 8);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 77, 99, 0.78)";
    ctx.lineWidth = 6;
    ctx.setLineDash([20, 16]);
    ctx.beginPath();
    ctx.moveTo(wallLeft, dangerY);
    ctx.lineTo(wallRight, dangerY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(255, 77, 99, 0.9)";
    ctx.font = "900 20px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(t("dangerLine"), wallRight - 10, dangerY - 14);

    ctx.fillStyle = "rgba(41, 54, 77, 0.72)";
    ctx.font = "900 24px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(t("next"), W / 2, 42);
  }

  function drawDropPreview() {
    const spec = fruits[currentLevel];
    const bounds = aimBounds(currentLevel);
    const x = clamp(aimX, bounds.min, bounds.max);
    ctx.strokeStyle = "rgba(41, 54, 77, 0.24)";
    ctx.lineWidth = 4;
    ctx.setLineDash([12, 12]);
    ctx.beginPath();
    ctx.moveTo(x, dropY - 42);
    ctx.lineTo(x, floorY);
    ctx.stroke();
    ctx.setLineDash([]);
    drawFruit({ level: currentLevel, x, y: dropY, radius: spec.radius, angle: 0, preview: true });
  }

  function drawFruit(fruit) {
    const spec = fruits[fruit.level];
    const image = tokenImages[fruit.level];
    ctx.save();
    ctx.globalAlpha = fruit.preview ? 0.72 : 1;
    ctx.translate(fruit.x, fruit.y);
    const popScale = fruit.pop ? 1 + Math.sin((fruit.pop / 0.24) * Math.PI) * 0.12 : 1;
    ctx.scale(popScale, popScale);
    ctx.rotate(fruit.angle || 0);

    if (image?.complete && image.naturalWidth) {
      const size = fruit.radius * 2.12;
      ctx.drawImage(image, -size / 2, -size / 2, size, size);
    } else {
      const gradient = ctx.createRadialGradient(-fruit.radius * 0.34, -fruit.radius * 0.42, fruit.radius * 0.12, 0, 0, fruit.radius);
      gradient.addColorStop(0, spec.accent);
      gradient.addColorStop(0.48, spec.color);
      gradient.addColorStop(1, "rgba(23, 32, 51, 0.42)");
      ctx.beginPath();
      ctx.arc(0, 0, fruit.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    ctx.globalAlpha *= 0.18;
    ctx.beginPath();
    ctx.ellipse(-fruit.radius * 0.32, -fruit.radius * 0.36, fruit.radius * 0.2, fruit.radius * 0.11, -0.45, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();

    ctx.restore();
  }

  function drawMergeBursts() {
    for (const burst of mergeBursts) {
      const progress = 1 - burst.life / burst.maxLife;
      const radius = 28 + progress * (70 + burst.impact * 0.05);
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - progress);
      ctx.strokeStyle = burst.color;
      ctx.lineWidth = 8 * (1 - progress) + 2;
      ctx.beginPath();
      ctx.arc(burst.x, burst.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha *= 0.65;
      ctx.fillStyle = burst.color;
      for (let i = 0; i < 8; i += 1) {
        const angle = (i / 8) * Math.PI * 2;
        const px = burst.x + Math.cos(angle) * radius * 0.9;
        const py = burst.y + Math.sin(angle) * radius * 0.9;
        ctx.beginPath();
        ctx.arc(px, py, 5 * (1 - progress) + 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function animalTokenMarkup(level) {
    return `<img src="${tokenSources[level]}" alt="" aria-hidden="true" />`;
  }

  function roundRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
  }

  function canvasX(event) {
    const rect = canvas.getBoundingClientRect();
    return ((event.clientX - rect.left) / rect.width) * W;
  }

  function showToast(text) {
    toast.textContent = text;
    toast.classList.remove("hidden");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add("hidden"), 900);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function loop(now) {
    animationFrameId = null;
    const dt = Math.min(0.033, (now - lastTime) / 1000);
    lastTime = now;
    if (running && !gameOver) step(dt);
    updateComboHud();
    draw();
    if (running && !gameOver) {
      animationFrameId = requestAnimationFrame(loop);
    }
  }

  function startAnimationLoop() {
    if (animationFrameId !== null || lifecycleSuspended) return;
    animationFrameId = requestAnimationFrame((now) => {
      lastTime = now;
      loop(now);
    });
  }

  function stopAnimationLoop() {
    if (animationFrameId === null) return;
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  function applyDecisionText() {
    leaveConfirmTitle.textContent = t(decisionMode === "pause" ? "pauseTitle" : "leaveTitle");
    leaveConfirmText.textContent = t(decisionMode === "pause" ? "pauseText" : "leaveText");
    keepPlayingBtn.textContent = t(decisionMode === "pause" ? "resume" : "keepPlaying");
    leaveGameBtn.textContent = t("leaveGame");
  }

  function openBattleDecision(mode) {
    if (leaveConfirmOpen || !running || gameOver) return;
    leaveConfirmOpen = true;
    decisionMode = mode;
    suspendRunLifecycle();
    applyDecisionText();
    leaveConfirmPanel.classList.remove("hidden");
    setBattleContentInert(true);
    requestAnimationFrame(() => keepPlayingBtn.focus({ preventScroll: true }));
  }

  function closeLeaveConfirm(restoreFocus = true) {
    if (!leaveConfirmOpen) return;
    const mode = decisionMode;
    leaveConfirmOpen = false;
    decisionMode = null;
    leaveConfirmPanel.classList.add("hidden");
    setBattleContentInert(false);
    resumeRunLifecycle();
    if (restoreFocus) requestAnimationFrame(() => (mode === "pause" ? pauseBtn : canvas).focus({ preventScroll: true }));
  }

  function leaveActiveRun() {
    if (!leaveConfirmOpen) return;
    closeLeaveConfirm(false);
    if (activeChallenge()) showStage();
    else resetGame(true, "battle-return");
  }

  canvas.addEventListener("pointermove", (event) => {
    if (aimPointerId !== null && event.pointerId !== aimPointerId) return;
    if (aimPointerId === null && event.pointerType !== "mouse") return;
    aimX = canvasX(event);
    updateAimAccessibility();
  });

  canvas.addEventListener("pointerdown", (event) => {
    if (aimPointerId !== null || event.isPrimary === false || (event.pointerType === "mouse" && event.button !== 0)) return;
    aimPointerId = event.pointerId;
    aimX = canvasX(event);
    updateAimAccessibility();
    canvas.focus({ preventScroll: true });
    try {
      canvas.setPointerCapture?.(event.pointerId);
    } catch {
      // Synthetic and interrupted pointers may not be capturable.
    }
  });

  canvas.addEventListener("pointerup", (event) => {
    if (event.pointerId !== aimPointerId) return;
    aimX = canvasX(event);
    updateAimAccessibility();
    const ownedPointerId = aimPointerId;
    aimPointerId = null;
    try {
      if (canvas.hasPointerCapture?.(ownedPointerId)) canvas.releasePointerCapture(ownedPointerId);
    } catch {
      // The browser may have released capture before delivering pointerup.
    }
    dropFruit();
  });

  canvas.addEventListener("pointercancel", (event) => clearAimPointer(event.pointerId));
  canvas.addEventListener("lostpointercapture", (event) => clearAimPointer(event.pointerId));
  window.addEventListener("blur", () => clearAimPointer());

  canvas.addEventListener("keydown", (event) => {
    if (!running || gameOver) return;
    const { min, max } = aimBounds(currentLevel);
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      aimX = clamp(aimX + (event.key === "ArrowLeft" ? -36 : 36), min, max);
      updateAimAccessibility();
      return;
    }
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      if (event.repeat) return;
      dropFruit();
    }
  });

  restartBtn.addEventListener("click", () => {
    window.WonderAnalytics?.track?.("game_restart", { game_id: GAME_ID, score, source: "button" });
    resetGame(false, "restart");
  });
  backToMenuBtn.addEventListener("click", () => openBattleDecision("leave"));
  pauseBtn.addEventListener("click", () => openBattleDecision("pause"));
  keepPlayingBtn.addEventListener("click", () => closeLeaveConfirm(true));
  leaveGameBtn.addEventListener("click", leaveActiveRun);
  leaveConfirmPanel.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeLeaveConfirm(true);
      return;
    }
    if (event.key !== "Tab" || !leaveConfirmOpen) return;
    const actions = [keepPlayingBtn, leaveGameBtn];
    const first = actions[0];
    const last = actions.at(-1);
    if (event.shiftKey && (document.activeElement === first || !actions.includes(document.activeElement))) {
      event.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  });
  startBtn.addEventListener("click", () => {
    if (startBtn.disabled) return;
    showStage();
  });
  freePlayBtn.addEventListener("click", () => {
    activeChallengeIndex = null;
    menuPanel.classList.add("hidden");
    document.body.classList.remove("fruit-main", "fruit-stage");
    document.body.classList.add("fruit-playing");
    window.WonderSound?.play?.("start");
    resetGame(false, "free-play");
  });
  stageBackBtn.addEventListener("click", () => resetGame(true, "stage-return"));
  playAgainBtn.addEventListener("click", () => {
    window.WonderAnalytics?.track?.("game_restart", { game_id: GAME_ID, score, source: "result" });
    const challenge = activeChallenge();
    if (challenge && lastChallengeCleared && challenge.id < challenges.length) startChallenge(challenge.id + 1);
    else resetGame(false, "result");
  });
  menuBtn.addEventListener("click", () => activeChallenge() ? showStage() : resetGame(true, "result-menu"));
  resultPanel.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      return;
    }
    if (event.key !== "Tab" || resultPanel.classList.contains("hidden")) return;
    const actions = [playAgainBtn, menuBtn].filter((button) => !button.hidden && !button.disabled);
    if (!actions.length) return;
    const first = actions[0];
    const last = actions.at(-1);
    if (event.shiftKey && (document.activeElement === first || !actions.includes(document.activeElement))) {
      event.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  });

  if (new URLSearchParams(location.search).has("smoke")) {
    window.__fruitMergeSmoke = {
      finishRunForTest: endGame,
      challengeCatalog: () => challenges.map((challenge) => ({ ...challenge, rules: [...challenge.rules] })),
      challengeProgress: readChallengeProgress,
      startChallenge,
      setOutcomeForTest(evidence = {}) {
        score = Math.max(0, Number(evidence.score) || 0);
        maxReachedLevel = clamp(Number(evidence.maxReachedLevel) || 0, 0, fruits.length - 1);
        mergeCount = Math.max(0, Number(evidence.mergeCount) || 0);
        bestCombo = Math.max(0, Number(evidence.bestCombo) || 0);
        updateHud();
      },
      completeChallengeForTest: () => endGame(true),
      getChallengeState: () => ({
        stage: activeChallenge()?.id || null,
        rules: activeChallenge()?.rules || [],
        gravity: engine?.gravity?.y || 0,
        goal: challengeGoalLabel(),
        aim: aimBounds(),
        drops: Number(canvas.dataset.dropCount || 0),
        currentLevel,
        nextLevel,
        windApplications,
        fruitPositions: fruitsOnBoard.map((fruit) => ({ x: fruit.x, y: fruit.y })),
      }),
      dropForTest: dropFruit,
      lifecycleState: () => {
        const now = activeNow();
        return {
          suspended: lifecycleSuspended,
          canDropRemaining: Math.max(0, canDropAt - now),
          comboRemaining: Math.max(0, comboUntil - now),
          fruits: fruitsOnBoard.map((fruit) => ({
            age: Math.max(0, now - fruit.bornAt),
            x: fruit.x,
            y: fruit.y,
            dangerTime: fruit.dangerTime || 0,
          })),
        };
      },
    };
  }

  window.addEventListener("pagehide", suspendRunLifecycle);
  window.addEventListener("pageshow", resumeRunLifecycle);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) suspendRunLifecycle();
    else resumeRunLifecycle();
  });

  localeSelect.value = locale();
  localeSelect.addEventListener("change", () => setLocale(localeSelect.value));
  window.addEventListener("wonder:locale-change", () => {
    localeSelect.value = locale();
    applyText();
  });

  applyText();
  installChallengeRail();
  if (!Matter) {
    showToast("Physics loading failed");
    loadingPanel.classList.add("hidden");
    return;
  }
  preloadGameImages().then(() => {
    resetGame(true);
    loadingPanel.classList.add("hidden");
    window.WonderAnalytics?.track?.("game_ready", { game_id: GAME_ID });
  });
})();
