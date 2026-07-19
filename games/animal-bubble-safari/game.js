(() => {
  "use strict";

  const LOGICAL_WIDTH = 390;
  const LOGICAL_HEIGHT = 788;
  const SAVE_KEY = "weightplay:animal-bubble-safari:v1";
  const FIRST_PLAY_KEY = "weightplay:animal-bubble-safari:tutorial:v1";
  const ASSET_ROOT = "../../assets/";

  const copy = {
    "zh-Hant": {
      title: "動物泡泡探險", tagline: "瞄準、反彈，救出泡泡裡的動物！", progressLabel: "探險進度",
      backToLobby: "返回 WeightPlay Kids 大廳", soundToggle: "切換音效", language: "語言", back: "返回", stageList: "關卡列表", backToStage: "返回關卡", playArea: "泡泡射擊遊戲區", earnedStars: "獲得星星", close: "關閉", pause: "暫停遊戲", paused: "遊戲暫停", pauseMessage: "休息一下，探險進度會留在這裡。", resume: "繼續遊戲",
      loading: "準備探險", loadingError: "部分圖片未載入，將使用可用素材",
      startGame: "開始遊戲", guide: "玩法", chooseStage: "選擇關卡", album: "救援圖鑑", bestStars: "最佳星星",
      startLevel: "開始關卡", level: "關卡", shots: "剩餘", rescued: "目標", score: "分數",
      currentBubble: "目前", nextBubble: "下一顆", shotsLeft: "剩餘泡泡", rescuedAnimals: "救出動物",
      skillReport: "能力報告", retry: "再試一次", nextLevel: "下一關", backToMap: "返回關卡",
      howToPlay: "怎麼玩", guideAim: "拖曳瞄準同色泡泡，放開即可發射。", guideBank: "利用牆面反彈，繞過擋路的岩石。",
      guideRescue: "三顆以上相連會消除；在泡泡用完前救出目標。", gotIt: "知道了",
      aim: "拖曳瞄準，放開發射", directGoal: "配對 1 組同色泡泡", bankGoal: "用反彈射擊配對 1 組", rescueGoal: "救出泡泡裡的小斑馬",
      directSkill: "專注", bankSkill: "判斷", rescueSkill: "規劃", directHint: "對準上方兩顆藍色泡泡", bankHint: "瞄準左牆，讓泡泡反彈", rescueHint: "消除包住小斑馬的泡泡",
      success: "救援成功！", failed: "泡泡用完了", bounceNeeded: "這一關要先碰牆反彈！", noMatch: "再找找相同的動物泡泡", match: "配對成功！", rescuedNow: "動物得救了！",
      focusReport: "專注 · 手眼協調", logicReport: "空間判斷 · 手眼協調", rescueReport: "規劃 · 邏輯思考", locked: "尚未解鎖", lockedFeedback: "{stage}：尚未解鎖。先完成前一關吧！", completed: "已完成"
      ,rescueGoal: "救出動物泡泡", multiGoal: "完成 2 組同色配對", multiBankGoal: "利用反彈完成 2 組配對", doubleRescueGoal: "救出 2 隻動物",
      directHint: "瞄準同色泡泡完成配對", bankHint: "瞄準側牆，讓泡泡反彈", rescueHint: "消除動物周圍的同色泡泡", multiHint: "規劃射擊順序，完成兩組配對", doubleRescueHint: "先觀察路線，再救出兩隻動物",
      rainbowHint: "彩虹泡泡會變成撞到的泡泡顏色", lineHint: "橫掃泡泡會清除命中的整排泡泡", burstHint: "爆破泡泡會清除附近泡泡與障礙", swapHint: "交換泡泡會和撞到的泡泡互換顏色",
      rainbowUsed: "彩虹變色！", lineUsed: "橫掃整排！", burstUsed: "爆破清除！", swapUsed: "顏色交換！"
      ,blockerGoal: "清除障礙並完成配對", windGoal: "在風中完成反彈配對", guardianGoal: "完成救援檢查", leafHint: "葉球要由相鄰配對一起帶走", honeyHint: "蜂蜜球需要碰兩次才會打開", cloudHint: "雲球被碰到會清除同一排", windHint: "注意風向，泡泡飛行中會偏移", shiftingHint: "每次發射後，泡泡列會左右移動", guardianHint: "綜合運用這一區學到的技巧", leafUsed: "葉片散開了！", honeyUsed: "蜂蜜裂開了！", cloudUsed: "雲層散開了！"
    },
    en: {
      title: "Animal Bubble Safari", tagline: "Aim, bank shots, and rescue bubble animals!", progressLabel: "Safari progress",
      backToLobby: "Back to the WeightPlay Kids lobby", soundToggle: "Toggle sound", language: "Language", back: "Back", stageList: "Stage list", backToStage: "Back to stages", playArea: "Bubble shooter play area", earnedStars: "Stars earned", close: "Close", pause: "Pause game", paused: "Paused", pauseMessage: "Take a breath. Your safari is waiting.", resume: "Resume",
      loading: "Preparing Safari", loadingError: "Some images could not load; available art will be used",
      startGame: "Start Game", guide: "Guide", chooseStage: "Choose Stage", album: "Rescue Album", bestStars: "Best Stars",
      startLevel: "Start Level", level: "Level", shots: "Shots", rescued: "Goal", score: "Score",
      currentBubble: "Current", nextBubble: "Next", shotsLeft: "Shots Left", rescuedAnimals: "Animals Rescued",
      skillReport: "Skill Report", retry: "Retry", nextLevel: "Next Level", backToMap: "Back to Map",
      howToPlay: "How to Play", guideAim: "Drag to aim at matching bubbles, then release to shoot.", guideBank: "Bounce shots off a wall to get around rocks.",
      guideRescue: "Connect three or more. Rescue the target before shots run out.", gotIt: "Got It",
      aim: "Drag to aim, release to shoot", directGoal: "Make 1 matching group", bankGoal: "Make 1 group with a bank shot", rescueGoal: "Rescue an animal bubble",
      multiGoal: "Make 2 matching groups", multiBankGoal: "Make 2 groups with bank shots", doubleRescueGoal: "Rescue 2 animals",
      directSkill: "Focus", bankSkill: "Judgment", rescueSkill: "Planning", directHint: "Aim at matching bubbles to form a group", bankHint: "Aim at a side wall to bank the shot", rescueHint: "Clear matching bubbles around the animal", multiHint: "Plan the shot order and complete two matches", doubleRescueHint: "Study the routes, then rescue both animals",
      rainbowHint: "Rainbow matches the color of the bubble it hits", lineHint: "Line Clear removes the entire row it hits", burstHint: "Burst removes nearby bubbles and blockers", swapHint: "Swap exchanges colors with the bubble it hits",
      rainbowUsed: "Rainbow match!", lineUsed: "Row cleared!", burstUsed: "Burst cleared!", swapUsed: "Colors swapped!",
      success: "Rescue Complete!", failed: "Out of bubbles", bounceNeeded: "This level needs a wall bounce!", noMatch: "Look for matching animal bubbles", match: "Match complete!", rescuedNow: "Animal rescued!",
      blockerGoal: "Clear obstacles and make the match", windGoal: "Complete a bank match in the wind", guardianGoal: "Complete the rescue check", leafHint: "Leaf bubbles drop with an adjacent match", honeyHint: "Honey bubbles need two direct hits", cloudHint: "Hit a cloud to clear its row", windHint: "Watch the wind; flying bubbles drift sideways", shiftingHint: "Bubble rows shift after every shot", guardianHint: "Combine the skills from this region", leafUsed: "Leaves cleared!", honeyUsed: "Honey cracked!", cloudUsed: "Cloud row cleared!",
      focusReport: "Focus · Hand-Eye Coordination", logicReport: "Spatial Judgment · Coordination", rescueReport: "Planning · Logic", locked: "Locked", lockedFeedback: "{stage}: Locked. Complete the previous stage first!", completed: "Complete"
    },
    es: {
      title: "Safari de Burbujas Animales", tagline: "¡Apunta, rebota y rescata animales atrapados en burbujas!", progressLabel: "Progreso del safari",
      backToLobby: "Volver a la sala Kids de WeightPlay", soundToggle: "Activar o desactivar sonido", language: "Idioma", back: "Volver", stageList: "Lista de niveles", backToStage: "Volver a los niveles", playArea: "Zona de lanzamiento de burbujas", earnedStars: "Estrellas obtenidas", close: "Cerrar", pause: "Pausar el juego", paused: "Juego en pausa", pauseMessage: "Tómate un respiro. Tu safari te espera.", resume: "Continuar",
      loading: "Preparando el safari", loadingError: "Algunas imágenes no se cargaron; se usarán los recursos disponibles",
      startGame: "Empezar", guide: "Guía", chooseStage: "Elegir nivel", album: "Álbum de rescate", bestStars: "Mejores estrellas",
      startLevel: "Empezar nivel", level: "Nivel", shots: "Tiros", rescued: "Objetivo", score: "Puntuación",
      currentBubble: "Actual", nextBubble: "Siguiente", shotsLeft: "Tiros restantes", rescuedAnimals: "Animales rescatados",
      skillReport: "Informe de habilidades", retry: "Reintentar", nextLevel: "Siguiente nivel", backToMap: "Volver al mapa",
      howToPlay: "Cómo jugar", guideAim: "Arrastra para apuntar a burbujas iguales y suelta para disparar.", guideBank: "Haz rebotar el tiro en una pared para rodear las rocas.",
      guideRescue: "Une tres o más. Rescata el objetivo antes de quedarte sin tiros.", gotIt: "Entendido",
      aim: "Arrastra para apuntar y suelta para disparar", directGoal: "Forma 1 grupo del mismo color", bankGoal: "Forma 1 grupo con un rebote en la pared", rescueGoal: "Rescata una burbuja animal",
      multiGoal: "Forma 2 grupos del mismo color", multiBankGoal: "Forma 2 grupos con rebotes en la pared", doubleRescueGoal: "Rescata 2 animales",
      directSkill: "Concentración", bankSkill: "Cálculo", rescueSkill: "Planificación", directHint: "Apunta a burbujas iguales para formar un grupo", bankHint: "Apunta a una pared lateral para hacer rebotar el tiro", rescueHint: "Elimina las burbujas iguales alrededor del animal", multiHint: "Planifica el orden de los tiros y completa dos grupos", doubleRescueHint: "Estudia las rutas y rescata a los dos animales",
      rainbowHint: "Arcoíris adopta el color de la burbuja que toca", lineHint: "Línea elimina toda la fila que alcanza", burstHint: "Explosión elimina burbujas y obstáculos cercanos", swapHint: "Intercambio cambia de color con la burbuja que toca",
      rainbowUsed: "¡Coincidencia arcoíris!", lineUsed: "¡Fila eliminada!", burstUsed: "¡Explosión completada!", swapUsed: "¡Colores intercambiados!",
      success: "¡Rescate completado!", failed: "Sin burbujas", bounceNeeded: "¡Este nivel necesita un rebote en la pared!", noMatch: "Busca burbujas animales iguales", match: "¡Grupo completado!", rescuedNow: "¡Animal rescatado!",
      blockerGoal: "Elimina los obstáculos y completa el grupo", windGoal: "Completa un grupo con rebote pese al viento", guardianGoal: "Completa la prueba de rescate", leafHint: "Las burbujas de hojas caen al completar un grupo adyacente", honeyHint: "Las burbujas de miel necesitan dos impactos directos", cloudHint: "Golpea una nube para limpiar su fila", windHint: "Observa el viento: las burbujas se desvían al volar", shiftingHint: "Las filas se desplazan después de cada tiro", guardianHint: "Combina las habilidades aprendidas en esta región", leafUsed: "¡Hojas eliminadas!", honeyUsed: "¡Miel agrietada!", cloudUsed: "¡Fila de nubes eliminada!",
      focusReport: "Concentración · Coordinación visual", logicReport: "Cálculo espacial · Coordinación", rescueReport: "Planificación · Lógica", locked: "Bloqueado", lockedFeedback: "{stage}: bloqueado. ¡Completa primero el nivel anterior!", completed: "Completado"
    }
  };

  const stageDefs = [
    { id: 1, title: { "zh-Hant": "草原初遇", en: "Grassland Hello" }, goalKey: "directGoal", skillKey: "directSkill", hintKey: "directHint", shots: 6, target: "match", colors: [0,2,1,3,0,2], stars: [4,2], report: "focusReport" },
    { id: 2, title: { "zh-Hant": "峽谷反彈", en: "Canyon Bank" }, goalKey: "bankGoal", skillKey: "bankSkill", hintKey: "bankHint", shots: 7, target: "bank", colors: [3,1,0,2,3,1], stars: [5,2], report: "logicReport" },
    { id: 3, title: { "zh-Hant": "斑馬救援", en: "Zebra Rescue" }, goalKey: "rescueGoal", skillKey: "rescueSkill", hintKey: "rescueHint", shots: 8, target: "rescue", colors: [2,0,3,1,2,0], stars: [6,3], report: "rescueReport" }
    ,{ id: 4, title: { "zh-Hant": "河岸石陣", en: "River Stones" }, goalKey: "multiGoal", skillKey: "directSkill", hintKey: "multiHint", shots: 9, target: "match", requiredMatches: 2, colors: [1,3,0,2,1,3,0], stars: [6,3], report: "focusReport" }
    ,{ id: 5, title: { "zh-Hant": "樹葉岔路", en: "Leafy Fork" }, goalKey: "bankGoal", skillKey: "bankSkill", hintKey: "bankHint", shots: 9, target: "bank", requiredMatches: 1, checkpoint: true, colors: [0,2,3,1,0,2,3], stars: [6,3], report: "logicReport" }
    ,{ id: 6, title: { "zh-Hant": "長頸鹿朋友", en: "Giraffe Friend" }, goalKey: "rescueGoal", skillKey: "rescueSkill", hintKey: "rescueHint", shots: 10, target: "rescue", requiredRescues: 1, colors: [3,1,2,0,3,1,2], stars: [7,4], report: "rescueReport" }
    ,{ id: 7, title: { "zh-Hant": "蜂蜜迷陣", en: "Honey Maze" }, goalKey: "multiGoal", skillKey: "directSkill", hintKey: "multiHint", shots: 10, target: "match", requiredMatches: 2, colors: [2,0,1,3,2,0,1], stars: [7,4], report: "focusReport" }
    ,{ id: 8, title: { "zh-Hant": "雙壁反彈", en: "Twin Bank" }, goalKey: "multiBankGoal", skillKey: "bankSkill", hintKey: "multiHint", shots: 11, target: "bank", requiredMatches: 2, colors: [1,3,2,0,1,3,2,0], stars: [8,4], report: "logicReport" }
    ,{ id: 9, title: { "zh-Hant": "象群接力", en: "Elephant Relay" }, goalKey: "doubleRescueGoal", skillKey: "rescueSkill", hintKey: "rainbowHint", shots: 12, target: "rescue", requiredRescues: 2, colors: [0,2,1,3,0,2,1,3], powers: ["rainbow"], stars: [8,5], report: "rescueReport" }
    ,{ id: 10, title: { "zh-Hant": "雲端通道", en: "Cloud Passage" }, goalKey: "multiGoal", skillKey: "directSkill", hintKey: "lineHint", shots: 11, target: "match", requiredMatches: 2, checkpoint: true, colors: [3,0,2,1,3,0,2,1], powers: ["line"], stars: [8,5], report: "focusReport" }
    ,{ id: 11, title: { "zh-Hant": "河馬救援", en: "Hippo Rescue" }, goalKey: "doubleRescueGoal", skillKey: "rescueSkill", hintKey: "burstHint", shots: 13, target: "rescue", requiredRescues: 2, colors: [2,1,3,0,2,1,3,0], powers: ["burst"], stars: [9,5], report: "rescueReport" }
    ,{ id: 12, title: { "zh-Hant": "森林重聚", en: "Forest Reunion" }, goalKey: "doubleRescueGoal", skillKey: "rescueSkill", hintKey: "swapHint", shots: 14, target: "rescue", requiredRescues: 2, colors: [0,3,1,2,0,3,1,2,0], powers: ["swap"], stars: [10,6], report: "rescueReport" }
    ,{ id: 13, title: { "zh-Hant": "葉幕入口", en: "Leaf Curtain" }, goalKey: "blockerGoal", skillKey: "bankSkill", hintKey: "leafHint", shots: 11, target: "match", requiredMatches: 2, mechanic: "leaf", colors: [1,2,1,0,3,1,2], stars: [7,4], report: "logicReport" }
    ,{ id: 14, title: { "zh-Hant": "蜂蜜雙鎖", en: "Honey Double Lock" }, goalKey: "blockerGoal", skillKey: "directSkill", hintKey: "honeyHint", shots: 12, target: "match", requiredMatches: 2, mechanic: "honey", colors: [2,0,2,3,1,2,0,3], stars: [8,4], report: "focusReport" }
    ,{ id: 15, title: { "zh-Hant": "雲橋檢查", en: "Cloudbridge Check" }, goalKey: "guardianGoal", skillKey: "rescueSkill", hintKey: "cloudHint", shots: 13, target: "rescue", requiredRescues: 2, mechanic: "cloud", checkpoint: true, colors: [3,1,0,2,3,1,0,2], stars: [8,5], report: "rescueReport" }
    ,{ id: 16, title: { "zh-Hant": "東風草原", en: "Eastwind Grassland" }, goalKey: "windGoal", skillKey: "bankSkill", hintKey: "windHint", shots: 11, target: "bank", requiredMatches: 1, mechanic: "wind-east", wind: 32, colors: [0,2,0,1,3,2,0], stars: [7,4], report: "logicReport" }
    ,{ id: 17, title: { "zh-Hant": "西風峽谷", en: "Westwind Canyon" }, goalKey: "windGoal", skillKey: "bankSkill", hintKey: "windHint", shots: 12, target: "bank", requiredMatches: 2, mechanic: "wind-west", wind: -38, colors: [3,1,3,2,0,1,3,2], stars: [8,4], report: "logicReport" }
    ,{ id: 18, title: { "zh-Hant": "漂移葉群", en: "Drifting Leaves" }, goalKey: "blockerGoal", skillKey: "directSkill", hintKey: "shiftingHint", shots: 12, target: "match", requiredMatches: 2, mechanic: "shift-leaf", shiftRows: true, colors: [1,0,2,1,3,0,2,1], stars: [8,5], report: "focusReport" }
    ,{ id: 19, title: { "zh-Hant": "風中雙救援", en: "Wind Pair Rescue" }, goalKey: "doubleRescueGoal", skillKey: "rescueSkill", hintKey: "windHint", shots: 14, target: "rescue", requiredRescues: 2, mechanic: "wind-rescue", wind: 28, colors: [2,3,1,0,2,3,1,0,2], stars: [9,5], report: "rescueReport" }
    ,{ id: 20, title: { "zh-Hant": "季風檢查", en: "Monsoon Check" }, goalKey: "guardianGoal", skillKey: "rescueSkill", hintKey: "guardianHint", shots: 15, target: "rescue", requiredRescues: 2, mechanic: "wind-mix", wind: -24, shiftRows: true, checkpoint: true, powers: ["rainbow"], colors: [0,2,1,3,0,2,1,3,0], stars: [10,6], report: "rescueReport" }
    ,{ id: 21, title: { "zh-Hant": "彩虹葉徑", en: "Rainbow Leaf Trail" }, goalKey: "multiGoal", skillKey: "directSkill", hintKey: "rainbowHint", shots: 12, target: "match", requiredMatches: 3, mechanic: "leaf", powers: ["rainbow"], colors: [1,2,0,3,1,2,0,3], stars: [8,5], report: "focusReport" }
    ,{ id: 22, title: { "zh-Hant": "橫掃蜂巢", en: "Honey Line" }, goalKey: "blockerGoal", skillKey: "bankSkill", hintKey: "lineHint", shots: 13, target: "match", requiredMatches: 2, mechanic: "honey", powers: ["line"], colors: [2,0,3,1,2,0,3,1], stars: [9,5], report: "logicReport" }
    ,{ id: 23, title: { "zh-Hant": "雲層爆破", en: "Cloud Burst" }, goalKey: "doubleRescueGoal", skillKey: "rescueSkill", hintKey: "burstHint", shots: 14, target: "rescue", requiredRescues: 2, mechanic: "cloud", powers: ["burst"], colors: [3,1,2,0,3,1,2,0,3], stars: [9,5], report: "rescueReport" }
    ,{ id: 24, title: { "zh-Hant": "交換迷航", en: "Swap Detour" }, goalKey: "multiBankGoal", skillKey: "bankSkill", hintKey: "swapHint", shots: 14, target: "bank", requiredMatches: 2, mechanic: "shift", shiftRows: true, powers: ["swap"], colors: [0,3,1,2,0,3,1,2], stars: [9,6], report: "logicReport" }
    ,{ id: 25, title: { "zh-Hant": "力量泡泡檢查", en: "Power Bubble Check" }, goalKey: "guardianGoal", skillKey: "rescueSkill", hintKey: "guardianHint", shots: 16, target: "rescue", requiredRescues: 3, mechanic: "power-mix", checkpoint: true, powers: ["rainbow","line","burst","swap"], colors: [0,3,2,1,0,3,2,1,0,3], stars: [11,7], report: "rescueReport" }
    ,{ id: 26, title: { "zh-Hant": "葉石交錯", en: "Leafstone Cross" }, goalKey: "blockerGoal", skillKey: "directSkill", hintKey: "leafHint", shots: 13, target: "match", requiredMatches: 3, mechanic: "leaf-stone", colors: [1,0,2,3,1,0,2,3], stars: [8,5], report: "focusReport" }
    ,{ id: 27, title: { "zh-Hant": "蜂蜜逆風", en: "Honey Headwind" }, goalKey: "windGoal", skillKey: "bankSkill", hintKey: "honeyHint", shots: 15, target: "bank", requiredMatches: 2, mechanic: "honey-wind", wind: -34, colors: [2,3,0,1,2,3,0,1,2], stars: [10,6], report: "logicReport" }
    ,{ id: 28, title: { "zh-Hant": "雲列漂移", en: "Drifting Cloud Rows" }, goalKey: "blockerGoal", skillKey: "directSkill", hintKey: "shiftingHint", shots: 15, target: "match", requiredMatches: 3, mechanic: "cloud-shift", shiftRows: true, colors: [3,0,1,2,3,0,1,2,3], stars: [10,6], report: "focusReport" }
    ,{ id: 29, title: { "zh-Hant": "三獸救援", en: "Three Animal Rescue" }, goalKey: "doubleRescueGoal", skillKey: "rescueSkill", hintKey: "guardianHint", shots: 17, target: "rescue", requiredRescues: 3, mechanic: "rescue-mix", wind: 22, powers: ["rainbow","burst"], colors: [0,2,3,1,0,2,3,1,0,2], stars: [11,7], report: "rescueReport" }
    ,{ id: 30, title: { "zh-Hant": "大草原重聚", en: "Grand Safari Reunion" }, goalKey: "guardianGoal", skillKey: "rescueSkill", hintKey: "guardianHint", shots: 18, target: "rescue", requiredRescues: 3, mechanic: "grand-mix", wind: -20, shiftRows: true, checkpoint: true, powers: ["rainbow","line","burst","swap"], colors: [0,3,1,2,0,3,1,2,0,3,1], stars: [12,8], report: "rescueReport" }
  ];

  const spanishStageTitles = [
    "Saludo en la pradera", "Rebote en el cañón", "Rescate de la cebra", "Piedras del río", "Bifurcación de hojas",
    "Amiga jirafa", "Laberinto de miel", "Doble rebote", "Relevo de elefantes", "Paso entre nubes",
    "Rescate del hipopótamo", "Reencuentro en el bosque", "Cortina de hojas", "Doble cierre de miel", "Prueba del puente de nubes",
    "Pradera del viento este", "Cañón del viento oeste", "Hojas a la deriva", "Rescate doble con viento", "Prueba del monzón",
    "Sendero de hojas arcoíris", "Línea de miel", "Explosión de nubes", "Desvío de intercambio", "Prueba de burbujas de poder",
    "Cruce de hojas y piedras", "Miel contra el viento", "Filas de nubes a la deriva", "Rescate de tres animales", "Gran reencuentro del safari",
  ];
  if (spanishStageTitles.length !== stageDefs.length) throw new Error("Spanish stage-title coverage must match all safari stages.");
  stageDefs.forEach((stage, index) => { stage.title.es = spanishStageTitles[index]; });

  const battleHeader = document.querySelector(".battle-header");
  if (battleHeader && !document.getElementById("pauseButton")) {
    battleHeader.insertAdjacentHTML("beforeend", '<button id="pauseButton" class="battle-utility-button" type="button" aria-label="Pause game" data-i18n-aria="pause">Ⅱ</button>');
  }
  const battleScreen = document.getElementById("battleScreen");
  const resultScreen = document.getElementById("resultScreen");
  if (battleScreen && resultScreen && !document.getElementById("pauseOverlay")) {
    resultScreen.insertAdjacentHTML("beforebegin", '<section id="pauseOverlay" class="pause-overlay" role="dialog" aria-modal="true" aria-labelledby="pauseTitle" hidden><div class="pause-panel"><span class="pause-symbol" aria-hidden="true">Ⅱ</span><h2 id="pauseTitle" data-i18n="paused">Paused</h2><p data-i18n="pauseMessage">Take a breath. Your safari is waiting.</p><div class="pause-actions"><button id="pauseResume" class="primary-button" type="button" data-i18n="resume">Resume</button><button id="pauseBack" type="button" data-i18n="backToMap">Back to Map</button></div></div></section>');
  }

  if (battleScreen) battleScreen.id = "safariBattleScreen";

  const dom = Object.fromEntries([
    "viewport","gameCanvas","loadingScreen","loadingCover","loadingPanel","loadingFill","loadingProgress","mainScreen","stageScreen","battleLive","pauseButton","pauseOverlay","pauseResume","resultScreen","guideModal","stageRail","stageStatus","playCanvas",
    "mainProgress","albumCount","starCount","stageSkill","stageGoal","battleStageName","shotsLeft","rescueProgress","scoreValue","battleMessage","battleGoal",
    "currentPreview","nextPreview","resultTitle","resultStars","resultScore","resultShots","resultRescued","rewardStars","rewardCoins","rewardAlbum","skillText","nextStage"
  ].map(id => [id, document.getElementById(id)]));
  dom.battleScreen = battleScreen;

  const ctx = dom.playCanvas.getContext("2d");
  const currentCtx = dom.currentPreview.getContext("2d");
  const nextCtx = dom.nextPreview.getContext("2d");
  const images = {};
  const canonicalLocaleKey = "weightPlayLocale";
  const legacySavedLocale = localStorage.getItem("weightplayLocale");
  if (!localStorage.getItem(canonicalLocaleKey) && ["en", "zh-Hant", "zh-Hans", "es"].includes(legacySavedLocale)) window.WonderI18n?.setLocale?.(legacySavedLocale);
  const savedLocale = localStorage.getItem(canonicalLocaleKey) || legacySavedLocale || localStorage.getItem("weightplay:locale");
  const requestedLocale = window.WonderI18n?.locale?.() || savedLocale || "en";
  let locale = copy[requestedLocale] ? requestedLocale : "en";
  let save = loadSave();
  let selectedStage = Math.min(save.unlocked, stageDefs.length);
  let centeredStageFrame = 0;
  let currentScreen = "loading";
  let audioEnabled = save.audio !== false;
  let audioContext = null;
  let game = null;
  let animationFrame = 0;
  let resultTimer = 0;
  let stageStatusTimer = 0;
  let isPaused = false;

  function loadSave() {
    try {
      const parsed = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}");
      return { unlocked: Math.max(1, Math.min(stageDefs.length, parsed.unlocked || 1)), bestStars: parsed.bestStars || {}, bestScore: parsed.bestScore || {}, rescued: parsed.rescued || {}, audio: parsed.audio !== false };
    } catch (_) {
      return { unlocked: 1, bestStars: {}, bestScore: {}, rescued: {}, audio: true };
    }
  }

  function persist() {
    save.audio = audioEnabled;
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  }

  function t(key) { return copy[locale][key] || key; }

  function clearStageStatus() {
    clearTimeout(stageStatusTimer);
    stageStatusTimer = 0;
    dom.stageStatus.classList.remove("is-visible");
    dom.stageStatus.textContent = "";
  }

  function showLockedStage(stage, card) {
    clearStageStatus();
    const stageName = `${stage.id}. ${stage.title[locale]}`;
    dom.stageStatus.textContent = t("lockedFeedback").replace("{stage}", stageName);
    dom.stageStatus.classList.add("is-visible");
    card.focus({ preventScroll: true });
    requestAnimationFrame(() => card.focus({ preventScroll: true }));
    stageStatusTimer = window.setTimeout(clearStageStatus, 1800);
  }

  function applyLocale() {
    const activeLocale = window.WonderI18n?.actualLocale?.() || locale;
    document.documentElement.lang = activeLocale;
    document.title = `${t("title")} - WeightPlay`;
    document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
    document.querySelectorAll("[data-locale]").forEach(button => button.classList.toggle("is-selected", button.dataset.locale === activeLocale));
    renderStageRail();
    updateMainProgress();
    if (game) updateHud();
    window.dispatchEvent(new CustomEvent("wonder:locale-change", { detail: { locale } }));
  }

  function fitCanvas() {
    const width = Math.max(1, window.innerWidth || document.documentElement.clientWidth);
    const height = Math.max(1, window.innerHeight || document.documentElement.clientHeight);
    const referenceScale = Math.min(width / LOGICAL_WIDTH, height / LOGICAL_HEIGHT);
    const responsiveCanvas = currentScreen === "stage" || currentScreen === "battle" || currentScreen === "result";
    const scale = referenceScale;
    const logicalWidth = responsiveCanvas ? width / scale : LOGICAL_WIDTH;
    const logicalHeight = responsiveCanvas ? height / scale : LOGICAL_HEIGHT;
    dom.gameCanvas.style.setProperty("--scale", String(scale));
    dom.gameCanvas.style.width = `${logicalWidth}px`;
    dom.gameCanvas.style.height = `${logicalHeight}px`;
    dom.gameCanvas.dataset.logicalWidth = logicalWidth.toFixed(3);
    dom.gameCanvas.dataset.logicalHeight = logicalHeight.toFixed(3);
    dom.gameCanvas.dataset.commonScale = scale.toFixed(6);
    if (responsiveCanvas) {
      dom.gameCanvas.style.left = "0";
      dom.gameCanvas.style.top = "0";
      dom.gameCanvas.style.bottom = "auto";
      dom.gameCanvas.style.transform = `scale(${scale})`;
      dom.gameCanvas.style.transformOrigin = "top left";
    } else {
      dom.gameCanvas.style.left = "50%";
      dom.gameCanvas.style.top = "auto";
      dom.gameCanvas.style.bottom = "0";
      dom.gameCanvas.style.transform = `translateX(-50%) scale(${scale})`;
      dom.gameCanvas.style.transformOrigin = "50% 100%";
    }
  }

  function showScreen(name) {
    if (name !== "stage") clearStageStatus();
    currentScreen = name;
    document.body.classList.toggle("safari-main", name === "main");
    const result = name === "result";
    dom.loadingScreen.classList.toggle("is-active", name === "loading");
    dom.mainScreen.classList.toggle("is-active", name === "main");
    dom.stageScreen.classList.toggle("is-active", name === "stage");
    dom.battleScreen.classList.toggle("is-active", name === "battle" || result);
    dom.battleLive.classList.toggle("is-hidden", result);
    dom.battleLive.inert = result;
    if (result) dom.battleLive.setAttribute("aria-hidden", "true");
    else dom.battleLive.removeAttribute("aria-hidden");
    dom.resultScreen.classList.toggle("is-active", result);
    fitCanvas();
    track("screen_view", { screen: name });
  }

  function updateMainProgress() {
    const complete = Object.keys(save.bestStars).filter(id => save.bestStars[id] > 0).length;
    dom.mainProgress.textContent = `${Math.max(1, complete)} / ${stageDefs.length}`;
  }

  function renderStageRail() {
    clearStageStatus();
    dom.stageRail.innerHTML = "";
    stageDefs.forEach(stage => {
      const locked = stage.id > save.unlocked;
      const card = document.createElement("button");
      card.type = "button";
      card.className = "stage-card" + (stage.id === selectedStage ? " is-selected" : "") + (locked ? " is-locked" : "");
      card.setAttribute("aria-disabled", String(locked));
      const stars = save.bestStars[stage.id] || 0;
      card.innerHTML = `<img src="${ASSET_ROOT}animal-bubble-safari-bg.webp" alt=""><div><b>${stage.id}. ${stage.title[locale]}</b><span>${t(stage.goalKey)}</span><em>${"★".repeat(stars)}${"☆".repeat(3-stars)}</em><span>${locked ? t("locked") : stars ? t("completed") : t(stage.skillKey)}</span></div>`;
      card.addEventListener("click", () => {
        if (locked) showLockedStage(stage, card);
        else startStage(stage.id);
      });
      dom.stageRail.appendChild(card);
    });
    updateStageSummary();
    requestAnimationFrame(() => centerSelectedStage("auto"));
  }

  function updateCenteredStageCard() {
    centeredStageFrame = 0;
    const cards = [...dom.stageRail.querySelectorAll(".stage-card")];
    if (!cards.length || !dom.stageScreen.classList.contains("is-active")) return;
    const railRect = dom.stageRail.getBoundingClientRect();
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

  function scheduleCenteredStageCard() {
    if (centeredStageFrame) cancelAnimationFrame(centeredStageFrame);
    centeredStageFrame = requestAnimationFrame(updateCenteredStageCard);
  }

  function selectStage(id, center) {
    if (id > save.unlocked) return;
    selectedStage = id;
    [...dom.stageRail.children].forEach((card, index) => card.classList.toggle("is-selected", index + 1 === id));
    updateStageSummary();
    if (center) centerSelectedStage("smooth");
  }

  function centerSelectedStage(behavior) {
    const card = dom.stageRail.children[selectedStage - 1];
    if (card) card.scrollIntoView({ behavior, inline: "center", block: "nearest" });
    scheduleCenteredStageCard();
  }

  let lockedStageActivation = null;
  const lockedCardAtPoint = (x, y) => [...dom.stageRail.querySelectorAll(".stage-card.is-locked")].find(card => {
    const rect = card.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  });
  dom.stageRail.addEventListener("pointerdown", event => {
    const card = lockedCardAtPoint(event.clientX, event.clientY);
    if (!card || event.isPrimary === false || event.button !== 0) {
      lockedStageActivation = null;
      return;
    }
    lockedStageActivation = { id:event.pointerId, x:event.clientX, y:event.clientY, card, moved:false };
  }, true);
  document.addEventListener("pointermove", event => {
    if (!lockedStageActivation || event.pointerId !== lockedStageActivation.id) return;
    if (Math.hypot(event.clientX - lockedStageActivation.x, event.clientY - lockedStageActivation.y) > 6) lockedStageActivation.moved = true;
  }, true);
  const finishLockedStageActivation = event => {
    if (!lockedStageActivation || event.pointerId !== lockedStageActivation.id) return;
    const activation = lockedStageActivation;
    lockedStageActivation = null;
    if (event.type === "pointercancel" || activation.moved) return;
    const stageIndex = [...dom.stageRail.children].indexOf(activation.card);
    const stage = stageDefs[stageIndex];
    if (stage) {
      event.preventDefault();
      showLockedStage(stage, activation.card);
    }
  };
  document.addEventListener("pointerup", finishLockedStageActivation, true);
  document.addEventListener("pointercancel", finishLockedStageActivation, true);
  dom.stageRail.addEventListener("scroll", scheduleCenteredStageCard, { passive:true });
  dom.stageRail.addEventListener("wonder:stage-snap", scheduleCenteredStageCard);
  window.addEventListener("resize", scheduleCenteredStageCard, { passive:true });
  window.visualViewport?.addEventListener("resize", scheduleCenteredStageCard, { passive:true });

  function updateStageSummary() {
    const stage = stageDefs[selectedStage - 1];
    const totalStars = Object.values(save.bestStars).reduce((sum, value) => sum + value, 0);
    const rescued = Object.values(save.rescued).filter(Boolean).length;
    dom.albumCount.textContent = `${rescued} / 5`;
    dom.starCount.textContent = `${totalStars} / ${stageDefs.length * 3}`;
    dom.stageSkill.textContent = t(stage.skillKey);
    dom.stageGoal.textContent = t(stage.goalKey);
  }

  function preload() {
    const sources = {
      bubbles: "animal-bubble-safari-bubbles.webp", rescue: "animal-bubble-safari-rescue-animals.webp",
      blockers: "animal-bubble-safari-blockers.webp", powers: "animal-bubble-safari-power-bubbles.png",
      launcher: "animal-bubble-safari-launcher.webp", effects: "animal-bubble-safari-shot-effects.webp"
    };
    const entries = Object.entries(sources);
    let settled = 0;
    const updateProgress = () => {
      const percent = Math.round(settled / entries.length * 100);
      dom.loadingFill.style.width = `${percent}%`;
      dom.loadingProgress.textContent = `${percent}%`;
    };
    updateProgress();
    return Promise.all(entries.map(([key, src]) => new Promise(resolve => {
      const image = new Image();
      const finish = loaded => {
        if (loaded) images[key] = image;
        settled += 1;
        updateProgress();
        resolve(loaded);
      };
      image.onload = () => finish(true);
      image.onerror = () => finish(false);
      image.src = ASSET_ROOT + src;
    })));
  }

  const PROJECTILE_RADIUS = 22;
  const CONTACT_DISTANCE = 43;
  const ATTACH_VECTORS = [[-44,0],[44,0],[-22,-38],[22,-38],[-22,38],[22,38]];
  function makeBubble(x, y, type, extras = {}) { return { x, y, type, radius: 21, alive: true, blocker: false, rescue: false, ...extras }; }

  function stageLayout(id) {
    const layouts = {
      1: [[116,70,2],[160,70,0],[204,70,0],[248,70,3],[138,108,1],[182,108,0],[226,108,2]],
      2: [[92,70,3],[136,70,3],[224,70,1],[268,70,2],[114,108,2],[158,108,1],[246,108,0],[180,170,0,"blocker"],[224,170,0,"blocker"]],
      3: [[94,64,1],[138,64,0],[182,64,3],[226,64,1],[270,64,0],[116,102,3],[160,102,1],[204,102,0],[248,102,1],[116,140,0,"blocker"],[158,140,2],[202,140,2,"rescue",2],[246,140,2],[290,140,0,"blocker"]],
      4: [[72,64,1],[116,64,1],[160,64,3],[204,64,3],[248,64,0],[292,64,0],[94,102,2],[138,102,0,"blocker"],[182,102,2],[226,102,1,"blocker"],[270,102,2],[116,140,3],[160,140,1],[204,140,0],[248,140,3]],
      5: [[72,64,0],[116,64,2],[160,64,3],[204,64,1],[248,64,2],[292,64,0],[94,102,3],[138,102,1,"blocker"],[226,102,1,"blocker"],[270,102,3],[116,140,2],[160,140,0,"blocker"],[204,140,2,"blocker"],[248,140,0]],
      6: [[72,64,3],[116,64,1],[160,64,0],[204,64,2],[248,64,1],[292,64,3],[94,102,0],[138,102,3],[182,102,1],[226,102,2],[270,102,0],[116,140,0,"blocker"],[160,140,3],[204,140,3,"rescue",1],[248,140,3],[292,140,0,"blocker"]],
      7: [[72,64,2],[116,64,0],[160,64,2],[204,64,1],[248,64,3],[292,64,1],[94,102,1,"blocker"],[138,102,3],[182,102,0,"blocker"],[226,102,2],[270,102,0,"blocker"],[116,140,1],[160,140,2],[204,140,3],[248,140,0]],
      8: [[72,64,1],[116,64,3],[160,64,2],[204,64,0],[248,64,3],[292,64,1],[94,102,2],[138,102,0,"blocker"],[182,102,1,"blocker"],[226,102,2,"blocker"],[270,102,0],[72,140,3],[116,140,1],[248,140,1],[292,140,3]],
      9: [[72,64,0],[116,64,2],[160,64,1],[204,64,3],[248,64,2],[292,64,0],[94,102,1],[138,102,0],[182,102,2,"blocker"],[226,102,3],[270,102,1],[116,140,0],[160,140,0,"rescue",3],[204,140,1,"blocker"],[248,140,2,"rescue",0],[292,140,2]],
      10: [[72,64,3],[116,64,0],[160,64,2],[204,64,1],[248,64,0],[292,64,3],[94,102,2,"blocker"],[138,102,1],[182,102,3,"blocker"],[226,102,0],[270,102,2,"blocker"],[72,140,1],[116,140,3],[160,140,0],[204,140,2],[248,140,1],[292,140,3]],
      11: [[72,64,2],[116,64,1],[160,64,3],[204,64,0],[248,64,1],[292,64,2],[94,102,3],[138,102,2,"blocker"],[182,102,0],[226,102,3,"blocker"],[270,102,0],[94,140,1],[138,140,1,"rescue",4],[182,140,2,"blocker"],[226,140,3,"rescue",1],[270,140,3]],
      12: [[72,64,0],[116,64,3],[160,64,1],[204,64,2],[248,64,3],[292,64,0],[94,102,2,"blocker"],[138,102,0],[182,102,3,"blocker"],[226,102,1],[270,102,2,"blocker"],[72,140,1],[116,140,0,"rescue",0],[160,140,0],[204,140,2,"blocker"],[248,140,3,"rescue",4],[292,140,3]]
    };
    if (!layouts[id]) {
      const def = stageDefs[id - 1];
      const rows = [];
      for (let row = 0; row < 4; row += 1) {
        const offset = row % 2 ? 94 : 72;
        const count = row % 2 ? 5 : 6;
        for (let col = 0; col < count; col += 1) rows.push([offset + col * 44 + (id - 12), 64 + row * 38, (id + row * 2 + col) % 4]);
      }
      rows[0][2] = def.colors[0];
      rows[1][2] = def.colors[0];
      const mechanic = def.mechanic || "stone";
      const blockerKind = mechanic.includes("honey") ? "honey" : mechanic.includes("cloud") ? "cloud" : mechanic.includes("leaf") ? "leaf" : "blocker";
      const blockerSlots = def.checkpoint ? [7, 9, 12, 14] : [8, 12, 15];
      const mixedBlockers = mechanic === "power-mix" || mechanic === "grand-mix" ? ["leaf", "honey", "cloud", "blocker"] : null;
      blockerSlots.forEach((slot, index) => { if (rows[slot]) rows[slot][3] = mixedBlockers?.[index % mixedBlockers.length] || (index === blockerSlots.length - 1 && mechanic.includes("stone") ? "blocker" : blockerKind); });
      const rescueCount = def.target === "rescue" ? (def.requiredRescues || 1) : 0;
      for (let index = 0; index < rescueCount; index += 1) {
        const slot = rows.length - 1 - index * 2;
        rows[slot][2] = def.colors[(index + 1) % def.colors.length];
        rows[slot][3] = "rescue";
        rows[slot][4] = (id + index) % 5;
      }
      layouts[id] = rows;
    }
    return (layouts[id] || layouts[1]).map(([x,y,type,kind,rescueIndex]) => makeBubble(x,y,type,{
      blocker: ["blocker", "leaf", "honey", "cloud"].includes(kind), blockerType: kind === "blocker" ? "stone" : kind,
      blockerHits: kind === "honey" ? 2 : 1, rescue: kind === "rescue", rescueIndex: rescueIndex || 0
    }));
  }

  function startStage(id) {
    clearTimeout(resultTimer);
    isPaused = false;
    dom.pauseOverlay.hidden = true;
    dom.pauseButton.disabled = false;
    selectedStage = id;
    const def = stageDefs[id - 1];
    game = {
      def, bubbles: stageLayout(id), shots: def.shots, score: 0, rescued: 0, matches: 0,
      queue: [...def.colors], powerQueue: def.colors.map((_, index) => def.powers?.[index] || null),
      currentType: def.colors[0], nextType: def.colors[1], currentPower: def.powers?.[0] || null, nextPower: def.powers?.[1] || null,
      aiming: false, aimPointerId: null, aimX: 180, aimY: 240, projectile: null, particles: [], state: "playing", elapsed: 0
    };
    dom.battleMessage.textContent = t(def.hintKey);
    showScreen("battle");
    updateHud();
    cancelAnimationFrame(animationFrame);
    loop(performance.now());
    track("level_start", { level: id });
    requestAnimationFrame(() => dom.playCanvas.focus({ preventScroll:true }));
  }

  function launcherPoint() { return { x: 180, y: 500 }; }

  function pointerPosition(event) {
    const rect = dom.playCanvas.getBoundingClientRect();
    const source = event.touches?.[0] || event.changedTouches?.[0] || event;
    return { x: (source.clientX - rect.left) * 360 / rect.width, y: (source.clientY - rect.top) * 548 / rect.height };
  }

  function clearAimPointer() {
    const pointerId = game?.aimPointerId;
    if (game) game.aimPointerId = null;
    if (pointerId != null && dom.playCanvas.hasPointerCapture?.(pointerId)) {
      try { dom.playCanvas.releasePointerCapture(pointerId); } catch { /* Capture may already be gone. */ }
    }
  }

  function beginAim(event) {
    if (!game || game.state !== "playing" || game.projectile || game.aimPointerId != null
      || event.isPrimary === false || event.button !== 0) return;
    event.preventDefault();
    game.aimPointerId = event.pointerId;
    game.aiming = true;
    try { dom.playCanvas.setPointerCapture?.(event.pointerId); } catch { /* Synthetic pointers cannot always be captured. */ }
    updateAim(event);
  }

  function updateAim(event) {
    if (!game?.aiming || event.pointerId !== game.aimPointerId) return;
    event.preventDefault();
    const point = pointerPosition(event);
    game.aimX = Math.max(18, Math.min(342, point.x));
    game.aimY = Math.max(30, Math.min(478, point.y));
  }

  function shootAim() {
    if (!game?.aiming || game.projectile) return;
    clearAimPointer();
    game.aiming = false;
    const origin = launcherPoint();
    let dx = game.aimX - origin.x;
    let dy = game.aimY - origin.y;
    if (dy > -40) dy = -40;
    const length = Math.hypot(dx, dy) || 1;
    game.projectile = { x: origin.x, y: origin.y - 28, vx: dx / length * 420, vy: dy / length * 420, type: game.currentType, power: game.currentPower, bounced: false };
    tone(420, .05);
    track("bubble_shot", { level: game.def.id });
  }

  function releaseAim(event) {
    if (!game?.aiming || game.projectile || event.pointerId !== game.aimPointerId) return;
    event.preventDefault();
    shootAim();
  }

  function cancelAim(event) {
    if (!game || (event?.type?.startsWith("pointer") && event.pointerId !== game.aimPointerId)) return;
    clearAimPointer();
    game.aiming = false;
  }

  function handleBattleKey(event) {
    if (currentScreen !== "battle" || !game || game.state !== "playing" || game.projectile) return;
    const direction = { ArrowLeft:[-12,0], ArrowRight:[12,0], ArrowUp:[0,-12], ArrowDown:[0,12] }[event.key];
    if (direction) {
      event.preventDefault();
      game.aiming = true;
      game.aimX = Math.max(18, Math.min(342, game.aimX + direction[0]));
      game.aimY = Math.max(30, Math.min(478, game.aimY + direction[1]));
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!game.aiming) { game.aiming = true; game.aimX = 180; game.aimY = 240; }
      shootAim();
    }
  }

  function trajectory() {
    if (!game?.aiming) return [];
    const origin = launcherPoint();
    let dx = game.aimX - origin.x;
    let dy = Math.min(-40, game.aimY - origin.y);
    const length = Math.hypot(dx,dy) || 1;
    dx /= length; dy /= length;
    let x = origin.x, y = origin.y - 28;
    const points = [];
    for (let i=0;i<125;i++) {
      x += dx * 4.7; y += dy * 4.7;
      if (x < 19) { x = 19; dx *= -1; }
      if (x > 341) { x = 341; dx *= -1; }
      points.push({x,y});
      if (y < PROJECTILE_RADIUS || game.bubbles.some(b => b.alive && Math.hypot(b.x-x,b.y-y) <= CONTACT_DISTANCE)) break;
    }
    return points;
  }

  function updateProjectile(dt) {
    const p = game.projectile;
    if (!p) return;
    const steps = Math.max(1, Math.ceil(Math.hypot(p.vx, p.vy) * dt / 4));
    const stepTime = dt / steps;
    for (let step = 0; step < steps && game.projectile; step += 1) {
      p.vx += (game.def.wind || 0) * stepTime;
      p.vx = Math.max(-500, Math.min(500, p.vx));
      p.x += p.vx * stepTime; p.y += p.vy * stepTime;
      if (p.x < PROJECTILE_RADIUS) { p.x = PROJECTILE_RADIUS; p.vx = Math.abs(p.vx); p.bounced = true; tone(680,.025); }
      if (p.x > 360 - PROJECTILE_RADIUS) { p.x = 360 - PROJECTILE_RADIUS; p.vx = -Math.abs(p.vx); p.bounced = true; tone(680,.025); }
      const hit = game.bubbles
        .filter(bubble => bubble.alive && Math.hypot(bubble.x-p.x,bubble.y-p.y) <= CONTACT_DISTANCE)
        .sort((a,b) => Math.hypot(a.x-p.x,a.y-p.y) - Math.hypot(b.x-p.x,b.y-p.y))[0];
      if (p.y <= PROJECTILE_RADIUS || hit) attachProjectile(hit);
    }
  }

  function openAttachmentSpot(p, hit) {
    const occupied = spot => game.bubbles.some(bubble => bubble.alive && Math.hypot(bubble.x-spot.x,bubble.y-spot.y) < 40);
    const valid = spot => spot.x >= PROJECTILE_RADIUS && spot.x <= 360 - PROJECTILE_RADIUS && spot.y >= PROJECTILE_RADIUS && spot.y <= 440 && !occupied(spot);
    let candidates = hit
      ? ATTACH_VECTORS.map(([dx,dy]) => ({ x:hit.x+dx, y:hit.y+dy })).filter(valid)
      : [];
    if (!candidates.length && !hit) {
      const ceiling = { x:Math.max(PROJECTILE_RADIUS, Math.min(360-PROJECTILE_RADIUS, Math.round(p.x/22)*22)), y:PROJECTILE_RADIUS };
      if (!occupied(ceiling)) candidates.push(ceiling);
    }
    candidates.sort((a,b) => Math.hypot(a.x-p.x,a.y-p.y) - Math.hypot(b.x-p.x,b.y-p.y));
    return candidates[0] || { x:Math.max(PROJECTILE_RADIUS,Math.min(360-PROJECTILE_RADIUS,p.x)), y:Math.max(PROJECTILE_RADIUS,p.y) };
  }

  function attachProjectile(hit) {
    const p = game.projectile;
    if (hit?.blocker && (hit.blockerType === "honey" || hit.blockerType === "cloud")) {
      game.projectile = null;
      game.shots -= 1;
      if (hit.blockerType === "honey") {
        hit.blockerHits -= 1;
        if (hit.blockerHits <= 0) hit.alive = false;
        dom.battleMessage.textContent = t("honeyUsed");
      } else {
        game.bubbles.filter((bubble) => bubble.alive && Math.abs(bubble.y - hit.y) <= 24).forEach((bubble) => {
          bubble.alive = false;
          if (bubble.rescue) game.rescued += 1;
        });
        game.matches += 1;
        dom.battleMessage.textContent = t("cloudUsed");
      }
      advanceQueue();
      checkEnd();
      updateHud();
      return;
    }
    if (p.power === "rainbow" && hit && !hit.blocker) p.type = hit.type;
    if (p.power === "swap" && hit && !hit.blocker) [p.type, hit.type] = [hit.type, p.type];
    const impact = { x:p.x, y:p.y };
    const spot = openAttachmentSpot(p, hit);
    const added = makeBubble(spot.x,spot.y,p.type,{ shotBounced:p.bounced, settleFromX:impact.x, settleFromY:impact.y, settleProgress:0 });
    game.bubbles.push(added);
    game.lastAttachment = { impactX:impact.x, impactY:impact.y, x:spot.x, y:spot.y, hitX:hit?.x ?? null, hitY:hit?.y ?? null };
    game.projectile = null;
    game.shots -= 1;
    if (p.power === "line" || p.power === "burst") {
      const effectX = hit?.x ?? added.x;
      const effectY = hit?.y ?? added.y;
      const affected = game.bubbles.filter(bubble => bubble.alive && (
        p.power === "line" ? Math.abs(bubble.y - effectY) <= 25 : Math.hypot(bubble.x - effectX, bubble.y - effectY) <= 82
      ));
      clearPower(affected, p.power);
      updateHud();
      return;
    }
    const group = connectedGroup(added);
    let matched = group.length >= 3;
    if (matched && game.def.target === "bank" && !p.bounced) {
      matched = false;
      dom.battleMessage.textContent = t("bounceNeeded");
    }
    if (matched) clearGroup(group, p.bounced);
    else {
      dom.battleMessage.textContent = t("noMatch");
      advanceQueue();
      checkEnd();
    }
    updateHud();
  }

  function neighbors(bubble) {
    return game.bubbles.filter(other => other !== bubble && other.alive && !other.blocker && Math.hypot(other.x-bubble.x,other.y-bubble.y) <= 51);
  }

  function connectedGroup(start) {
    const result = []; const queue = [start]; const seen = new Set();
    while (queue.length) {
      const bubble = queue.shift();
      if (seen.has(bubble) || !bubble.alive || bubble.blocker || bubble.type !== start.type) continue;
      seen.add(bubble); result.push(bubble); neighbors(bubble).forEach(next => queue.push(next));
    }
    return result;
  }

  function clearGroup(group, bounced) {
    group.forEach(bubble => {
      bubble.alive = false;
      game.particles.push({ x:bubble.x,y:bubble.y,life:.45,type:bubble.rescue ? 3 : 2 });
      if (bubble.rescue) game.rescued += 1;
    });
    game.matches += 1;
    const leaves = game.bubbles.filter((bubble) => bubble.alive && bubble.blockerType === "leaf" && group.some((matched) => Math.hypot(matched.x - bubble.x, matched.y - bubble.y) <= 55));
    leaves.forEach((leaf) => { leaf.alive = false; });
    game.score += group.length * 120 + (bounced ? 180 : 0) + game.rescued * 300;
    dom.battleMessage.textContent = leaves.length ? t("leafUsed") : game.rescued ? t("rescuedNow") : t("match");
    tone(game.rescued ? 920 : 760, .12);
    advanceQueue();
    checkEnd();
  }

  function clearPower(group, power) {
    let cleared = 0;
    group.forEach(bubble => {
      if (!bubble.alive) return;
      bubble.alive = false;
      cleared += 1;
      game.particles.push({ x:bubble.x,y:bubble.y,life:.55,type:power === "burst" ? 2 : 1 });
      if (bubble.rescue) game.rescued += 1;
    });
    game.matches += 1;
    game.score += cleared * 140 + 260;
    dom.battleMessage.textContent = t(`${power}Used`);
    tone(power === "burst" ? 980 : 860, .14);
    advanceQueue();
    checkEnd();
  }

  function advanceQueue() {
    if (game.def.shiftRows) {
      game.shiftDirection = -(game.shiftDirection || -1);
      game.bubbles.forEach((bubble) => {
        if (!bubble.alive) return;
        const row = Math.round((bubble.y - 64) / 38);
        const direction = row % 2 ? -game.shiftDirection : game.shiftDirection;
        bubble.x = Math.max(28, Math.min(332, bubble.x + direction * 14));
      });
    }
    game.queue.shift();
    game.powerQueue.shift();
    if (game.queue.length < 2) game.queue.push((game.currentType + game.shots + 2) % 4);
    while (game.powerQueue.length < game.queue.length) game.powerQueue.push(null);
    game.currentType = game.queue[0];
    game.nextType = game.queue[1];
    game.currentPower = game.powerQueue[0] || null;
    game.nextPower = game.powerQueue[1] || null;
  }

  function checkEnd() {
    const required = game.def.target === "rescue" ? (game.def.requiredRescues || 1) : (game.def.requiredMatches || 1);
    const won = game.def.target === "rescue" ? game.rescued >= required : game.matches >= required;
    if (won) return finishStage(true);
    if (game.shots <= 0) finishStage(false);
  }

  function finishStage(won) {
    game.state = "finished";
    dom.pauseButton.disabled = true;
    const completedGame = game;
    clearTimeout(resultTimer);
    resultTimer = setTimeout(() => {
      if (game === completedGame && currentScreen === "battle") showResult(won);
    }, 520);
  }

  function showResult(won) {
    const starLimits = game.def.stars;
    const stars = won ? (game.shots >= starLimits[0] ? 3 : game.shots >= starLimits[1] ? 2 : 1) : 0;
    dom.resultTitle.textContent = won ? t("success") : t("failed");
    dom.resultStars.textContent = "★".repeat(stars) + "☆".repeat(3-stars);
    dom.resultScore.textContent = game.score;
    dom.resultShots.textContent = Math.max(0,game.shots);
    dom.resultRescued.textContent = game.rescued;
    dom.rewardStars.textContent = `+${stars}`;
    dom.rewardCoins.textContent = `+${won ? 20 + game.score/60|0 : 0}`;
    dom.rewardAlbum.textContent = `+${game.rescued}`;
    dom.skillText.textContent = t(game.def.report);
    dom.nextStage.hidden = !won || game.def.id >= stageDefs.length;
    document.querySelector(".result-actions").classList.toggle("single-primary", dom.nextStage.hidden);
    if (won) {
      save.bestStars[game.def.id] = Math.max(save.bestStars[game.def.id] || 0, stars);
      save.bestScore[game.def.id] = Math.max(save.bestScore[game.def.id] || 0, game.score);
      if (game.rescued) save.rescued[game.def.id] = true;
      save.unlocked = Math.max(save.unlocked, Math.min(stageDefs.length, game.def.id + 1));
      persist();
    }
    showScreen("result");
    requestAnimationFrame(() => (dom.nextStage.hidden ? document.getElementById("retryStage") : dom.nextStage).focus({ preventScroll:true }));
    track("level_complete", { level: game.def.id, won, score: game.score, stars });
  }

  function updateHud() {
    if (!game) return;
    dom.battleStageName.textContent = game.def.id;
    dom.shotsLeft.textContent = game.shots;
    const progress = game.def.target === "rescue" ? game.rescued : game.matches;
    const required = game.def.target === "rescue" ? (game.def.requiredRescues || 1) : (game.def.requiredMatches || 1);
    dom.rescueProgress.textContent = `${progress} / ${required}`;
    dom.scoreValue.textContent = game.score;
    dom.battleGoal.textContent = t(game.def.goalKey);
    drawPreview(currentCtx, game.currentType, game.currentPower);
    drawPreview(nextCtx, game.nextType, game.nextPower);
  }

  function atlasBubble(context, type, x, y, size) {
    if (!images.bubbles?.complete) return;
    const cellW = images.bubbles.width / 5, cellH = images.bubbles.height / 2;
    const index = type % 10, col = index % 5, row = Math.floor(index / 5);
    context.drawImage(images.bubbles, col*cellW,row*cellH,cellW,cellH,x-size/2,y-size/2,size,size);
  }

  function atlasRescue(context, index, x, y, size) {
    if (!images.rescue?.complete) return;
    const cellW = images.rescue.width / 5;
    context.drawImage(images.rescue,index*cellW,0,cellW,images.rescue.height,x-size/2,y-size/2,size,size);
  }

  function atlasBlocker(context, index, x, y, size) {
    if (!images.blockers?.complete) return;
    const cellW = images.blockers.width / 4;
    context.drawImage(images.blockers,index*cellW,0,cellW,images.blockers.height,x-size/2,y-size/2,size,size);
  }

  function atlasPower(context, power, x, y, size) {
    if (!images.powers?.complete) return;
    const index = { rainbow:0, line:1, burst:2, swap:3 }[power] ?? 0;
    const cellW = images.powers.width / 4;
    context.drawImage(images.powers,index*cellW,0,cellW,images.powers.height,x-size/2,y-size/2,size,size);
  }

  function atlasEffect(context, index, x, y, size, alpha) {
    if (!images.effects?.complete) return;
    const cellW = images.effects.width / 4;
    context.save(); context.globalAlpha = alpha;
    context.drawImage(images.effects,index*cellW,0,cellW,images.effects.height,x-size/2,y-size/2,size,size);
    context.restore();
  }

  function drawPreview(context, type, power) {
    context.clearRect(0,0,48,48);
    if (power) atlasPower(context,power,24,24,46);
    else atlasBubble(context,type,24,24,46);
  }

  function drawGame() {
    ctx.clearRect(0,0,360,548);
    ctx.save(); ctx.fillStyle = "rgba(7,42,58,.18)"; ctx.fillRect(0,0,360,548); ctx.restore();
    if (game.aiming && !game.projectile) {
      const points = trajectory();
      ctx.save(); ctx.fillStyle = "rgba(255,255,255,.92)";
      points.forEach((point,index) => { if (index % 3 === 0) { ctx.beginPath(); ctx.arc(point.x,point.y,2.4,0,Math.PI*2); ctx.fill(); } });
      ctx.restore();
    }
    game.bubbles.forEach(bubble => {
      if (!bubble.alive) return;
      const settle = bubble.settleProgress == null ? 1 : bubble.settleProgress;
      const eased = 1 - Math.pow(1 - settle, 3);
      const drawX = bubble.settleFromX == null ? bubble.x : bubble.settleFromX + (bubble.x-bubble.settleFromX)*eased;
      const drawY = bubble.settleFromY == null ? bubble.y : bubble.settleFromY + (bubble.y-bubble.settleFromY)*eased;
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.26)"; ctx.shadowBlur = 5; ctx.shadowOffsetY = 3;
      if (bubble.blocker) atlasBlocker(ctx,{ stone:0, leaf:1, honey:2, cloud:3 }[bubble.blockerType] ?? 0,drawX,drawY,46);
      else atlasBubble(ctx,bubble.type,drawX,drawY,46);
      ctx.restore();
      if (bubble.rescue) {
        ctx.save(); ctx.globalAlpha=.96; atlasRescue(ctx,bubble.rescueIndex,drawX,drawY,35); ctx.restore();
        ctx.strokeStyle="#fff4a8"; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(drawX,drawY,22,0,Math.PI*2); ctx.stroke();
      }
    });
    if (game.projectile) {
      if (game.projectile.power) atlasPower(ctx,game.projectile.power,game.projectile.x,game.projectile.y,44);
      else atlasBubble(ctx,game.projectile.type,game.projectile.x,game.projectile.y,44);
    }
    const launcher = launcherPoint();
    if (images.launcher?.complete) ctx.drawImage(images.launcher,launcher.x-53,launcher.y-39,106,106);
    if (!game.projectile) {
      if (game.currentPower) atlasPower(ctx,game.currentPower,launcher.x,launcher.y-30,42);
      else atlasBubble(ctx,game.currentType,launcher.x,launcher.y-30,42);
    }
    game.particles.forEach(p => atlasEffect(ctx,p.type,p.x,p.y,70,p.life/.45));
  }

  function loop(now) {
    if (!game || currentScreen !== "battle" || isPaused) return;
    const dt = Math.min(.025,(now-game.elapsed)/1000 || 0); game.elapsed=now;
    if (game.state === "playing") updateProjectile(dt);
    game.bubbles.forEach(bubble => { if (bubble.settleProgress != null && bubble.settleProgress < 1) bubble.settleProgress = Math.min(1, bubble.settleProgress + dt / .11); });
    game.particles.forEach(p => p.life -= dt); game.particles = game.particles.filter(p => p.life > 0);
    drawGame();
    animationFrame = requestAnimationFrame(loop);
  }

  function tone(frequency, duration) {
    if (!audioEnabled) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain();
      oscillator.frequency.value=frequency; gain.gain.setValueAtTime(.06,audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);
      oscillator.connect(gain).connect(audioContext.destination); oscillator.start(); oscillator.stop(audioContext.currentTime+duration);
    } catch (_) {}
  }

  function toggleSound() { audioEnabled=!audioEnabled; persist(); document.querySelectorAll("#soundMain,#soundStage").forEach(button => button.textContent=audioEnabled?"♪":"×"); tone(520,.06); }
  function track(event, details={}) { try { window.WonderAnalytics?.track?.(event,{ game:"animal-bubble-safari",...details }); } catch (_) {} }
  function openGuide() { dom.guideModal.hidden=false; localStorage.setItem(FIRST_PLAY_KEY,"seen"); }
  function closeGuide() { dom.guideModal.hidden=true; }

  function pauseGame() {
    if (!game || currentScreen !== "battle" || game.state !== "playing" || isPaused) return;
    isPaused = true;
    cancelAim();
    cancelAnimationFrame(animationFrame);
    dom.battleLive.inert = true;
    dom.battleLive.setAttribute("aria-hidden", "true");
    dom.pauseOverlay.hidden = false;
    requestAnimationFrame(() => dom.pauseResume.focus({ preventScroll: true }));
    track("game_pause", { level: game.def.id });
  }

  function resumeGame() {
    if (!game || currentScreen !== "battle" || !isPaused) return;
    isPaused = false;
    dom.pauseOverlay.hidden = true;
    dom.battleLive.inert = false;
    dom.battleLive.removeAttribute("aria-hidden");
    game.elapsed = performance.now();
    animationFrame = requestAnimationFrame(loop);
    requestAnimationFrame(() => dom.playCanvas.focus({ preventScroll: true }));
    track("game_resume", { level: game.def.id });
  }

  function returnToStage() {
    clearTimeout(resultTimer);
    isPaused = false;
    dom.pauseOverlay.hidden = true;
    game = null;
    cancelAnimationFrame(animationFrame);
    renderStageRail();
    showScreen("stage");
    focusSelectedStage();
  }

  window.__animalBubbleSafariTest = {
    stageDefs,
    showResult: won => { if (game) showResult(Boolean(won)); },
    getState: () => ({
      screen: currentScreen, selectedStage, unlocked: save.unlocked, stageId: game?.def.id || null,
      currentPower: game?.currentPower || null, nextPower: game?.nextPower || null,
      matches: game?.matches || 0, rescued: game?.rescued || 0,
      alive: game?.bubbles.filter(bubble => bubble.alive).length || 0,
      blockers: game?.bubbles.filter(bubble => bubble.alive && bubble.blocker).length || 0,
      shots: game?.shots ?? null,
      aiming: game?.aiming || false, aimX: game?.aimX ?? null, aimY: game?.aimY ?? null,
      projectile: Boolean(game?.projectile), aimPointerId: game?.aimPointerId ?? null, paused: isPaused,
      lastAttachment: game?.lastAttachment || null,
      mechanic: game?.def.mechanic || null, wind: game?.def.wind || 0, shiftRows: Boolean(game?.def.shiftRows),
      blockerTypes: game?.bubbles.filter(bubble => bubble.alive && bubble.blocker).map(bubble => ({ type:bubble.blockerType,hits:bubble.blockerHits,x:bubble.x,y:bubble.y })) || [],
      bubbleTypes: game?.bubbles.filter(bubble => bubble.alive && !bubble.blocker).map(bubble => ({ x:bubble.x, y:bubble.y, type:bubble.type })) || []
    }),
    getLayoutSummary: id => {
      const bubbles = stageLayout(id);
      return {
        id,
        count: bubbles.length,
        blockers: bubbles.filter(bubble => bubble.blocker).length,
        blockerTypes: bubbles.filter(bubble => bubble.blocker).map(bubble => bubble.blockerType),
        rescues: bubbles.filter(bubble => bubble.rescue).length,
        signature: bubbles.map(bubble => `${bubble.x},${bubble.y},${bubble.type},${bubble.blocker ? `b:${bubble.blockerType}:${bubble.blockerHits}` : bubble.rescue ? `r${bubble.rescueIndex}` : "n"}`).join("|")
      };
    },
    startStage,
    exerciseMechanic(kind) {
      if (!game) return null;
      if (kind === "honey" || kind === "cloud") {
        const blocker = game.bubbles.find((bubble) => bubble.alive && bubble.blockerType === kind);
        if (!blocker) return null;
        const before = { alive:blocker.alive, hits:blocker.blockerHits, shots:game.shots, matches:game.matches };
        game.projectile = { x:blocker.x, y:blocker.y, vx:0, vy:-1, type:game.currentType, power:null, bounced:false };
        attachProjectile(blocker);
        return { before, after:{ alive:blocker.alive, hits:blocker.blockerHits, shots:game.shots, matches:game.matches } };
      }
      if (kind === "leaf") {
        const leaf = game.bubbles.find((bubble) => bubble.alive && bubble.blockerType === "leaf");
        const matches = game.bubbles.filter((bubble) => bubble.alive && !bubble.blocker).slice(0,3);
        if (!leaf || matches.length < 3) return null;
        matches.forEach((bubble,index) => { bubble.type=0; bubble.x=leaf.x+(index-1)*20; bubble.y=leaf.y+34; });
        clearGroup(matches,false);
        return { leafAlive:leaf.alive };
      }
      if (kind === "shift") {
        const before = game.bubbles.filter((bubble) => bubble.alive).map((bubble) => bubble.x);
        advanceQueue();
        return { before, after:game.bubbles.filter((bubble) => bubble.alive).map((bubble) => bubble.x) };
      }
      if (kind === "wind") {
        game.projectile = { x:180,y:430,vx:0,vy:-300,type:0,power:null,bounced:false };
        const before = game.projectile.vx;
        updateProjectile(.05);
        return { before, after:game.projectile?.vx ?? null };
      }
      return null;
    }
  };

  const startGameButton = document.getElementById("startGame");
  const rejectRepeatedActivation = event => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
  };
  const focusSelectedStage = () => requestAnimationFrame(() => dom.stageRail.querySelector(".is-selected")?.focus({ preventScroll:true }));
  startGameButton.addEventListener("keydown", rejectRepeatedActivation);
  dom.stageRail.addEventListener("keydown", event => {
    if (event.target.closest(".stage-card")) rejectRepeatedActivation(event);
  });
  startGameButton.addEventListener("click", () => { renderStageRail(); showScreen("stage"); focusSelectedStage(); });
  document.getElementById("stageBack").addEventListener("click", () => { showScreen("main"); updateMainProgress(); requestAnimationFrame(() => startGameButton.focus({ preventScroll:true })); });
  document.getElementById("battleBack").addEventListener("click", pauseGame);
  dom.pauseButton.addEventListener("click", pauseGame);
  dom.pauseResume.addEventListener("click", resumeGame);
  document.getElementById("pauseBack").addEventListener("click", returnToStage);
  dom.pauseOverlay.addEventListener("keydown", event => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      resumeGame();
      return;
    }
    if (event.key !== "Tab") return;
    const actions = [...dom.pauseOverlay.querySelectorAll("button:not([disabled])")];
    const first = actions[0];
    const last = actions.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }, true);
  document.getElementById("retryStage").addEventListener("click", () => startStage(game.def.id));
  document.getElementById("nextStage").addEventListener("click", () => startStage(Math.min(stageDefs.length,game.def.id+1)));
  document.getElementById("backToMap").addEventListener("click", () => { renderStageRail(); showScreen("stage"); focusSelectedStage(); });
  document.getElementById("openGuide").addEventListener("click", openGuide);
  document.getElementById("closeGuide").addEventListener("click", closeGuide);
  document.getElementById("guideDone").addEventListener("click", closeGuide);
  document.getElementById("soundMain").addEventListener("click", toggleSound);
  document.getElementById("soundStage").addEventListener("click", toggleSound);
  document.querySelectorAll("[data-locale]").forEach(button => button.addEventListener("click", () => { const requested=button.dataset.locale; window.WonderI18n?.setLocale?.(requested); const resolved=window.WonderI18n?.locale?.()||requested; locale=copy[resolved]?resolved:"en"; localStorage.setItem("weightPlayLocale",requested); applyLocale(); }));
  dom.playCanvas.addEventListener("pointerdown", beginAim);
  dom.playCanvas.addEventListener("pointermove", updateAim);
  dom.playCanvas.addEventListener("keydown", handleBattleKey);
  window.addEventListener("pointerup", releaseAim);
  window.addEventListener("pointercancel", cancelAim);
  dom.playCanvas.addEventListener("lostpointercapture", cancelAim);
  window.addEventListener("blur", cancelAim);
  window.addEventListener("pagehide", cancelAim);
  document.addEventListener("visibilitychange", () => { if (document.hidden) cancelAim(); });
  window.addEventListener("resize", fitCanvas);
  window.visualViewport?.addEventListener("resize", fitCanvas);

  applyLocale();
  fitCanvas();
  const revealLoadingCover = () => dom.loadingCover.classList.add("is-ready");
  if (dom.loadingCover.complete && dom.loadingCover.naturalWidth > 0) revealLoadingCover();
  else dom.loadingCover.addEventListener("load", revealLoadingCover, { once: true });
  preload().then(results => {
    const hasError = results.some(loaded => !loaded);
    if (hasError) {
      dom.loadingPanel.classList.add("has-error");
      dom.loadingPanel.querySelector("strong").textContent = t("loadingError");
    }
    window.setTimeout(() => {
      showScreen("main");
      if (!localStorage.getItem(FIRST_PLAY_KEY)) openGuide();
    }, hasError ? 700 : 120);
  });
})();
