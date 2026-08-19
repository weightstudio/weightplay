(() => {
  const stagePanel = document.getElementById("stagePanel");
  stagePanel?.setAttribute("data-wp-canvas-max-width", "920");
  stagePanel?.setAttribute("data-wp-stage-landscape-width", "760");
  stagePanel?.setAttribute("data-wp-stage-landscape-height", "334");
  document.querySelector(".battle-shell")?.setAttribute("data-wp-canvas-max-width", "920");

  const GAME_ID = "animal-reef-fisher";
  const GAME_VERSION = 19;
  const INTERFACE_VERSION = 6;
  const saveKey = "weightplay_animal_reef_fisher_v1";
  const localeKey = "weightPlayLocale";
  const sessionStorageFallback = new Map();
  const W = 960;
  let H = 540;
  const expeditionSeconds = 90;
  const lureCost = 3;
  const sonarCost = 2;
  const hookedFishFacing = "left";
  const hookedFishMouthInset = 0.08;
  const isTestMode = new URLSearchParams(window.location.search).get("test") === "1";

  function readStorage(key) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? (sessionStorageFallback.get(key) ?? null) : value;
    } catch {
      return sessionStorageFallback.get(key) ?? null;
    }
  }

  function writeStorage(key, value) {
    const serialized = String(value);
    sessionStorageFallback.set(key, serialized);
    try {
      localStorage.setItem(key, serialized);
      return true;
    } catch {
      return false;
    }
  }

  function activeI18nLocale() {
    try {
      return window.WonderI18n?.locale?.() || "";
    } catch {
      return "";
    }
  }

  const $ = (id) => document.getElementById(id);
  if (!$(("leavePanel"))) {
    document.querySelector(".battle-shell")?.insertAdjacentHTML("beforeend", `
      <section id="leavePanel" class="leave-panel is-hidden" role="dialog" aria-modal="true" aria-labelledby="leaveTitle" aria-describedby="leaveCopy">
        <div class="leave-card">
          <h2 id="leaveTitle">Leave this expedition?</h2>
          <p id="leaveCopy"></p>
          <div class="leave-actions">
            <button id="leaveKeepBtn" class="primary-btn" type="button">Keep Fishing</button>
            <button id="leaveConfirmBtn" class="secondary-btn" type="button">Leave Expedition</button>
          </div>
        </div>
      </section>
    `);
  }
  const canvas = $("gameCanvas");
  const ctx = canvas.getContext("2d");
  const nodes = {
    localeSelect: $("localeSelect"),
    loadingPanel: $("loadingPanel"),
    loadingFill: $("loadingFill"),
    loadingText: $("loadingText"),
    mainPanel: $("mainPanel"),
    stagePanel: $("stagePanel"),
    gamePanel: $("gamePanel"),
    resultPanel: $("resultPanel"),
    leavePanel: $("leavePanel"),
    zoneRow: $("zoneRow"),
    gearGrid: $("gearGrid"),
    startBtn: $("startBtn"),
    menuSoundBtn: $("menuSoundBtn"),
    stageBackBtn: $("stageBackBtn"),
    mapBtn: $("mapBtn"),
    nextZoneBtn: $("nextZoneBtn"),
    retryBtn: $("retryBtn"),
    resultMenuBtn: $("resultMenuBtn"),
    leaveKeepBtn: $("leaveKeepBtn"),
    leaveConfirmBtn: $("leaveConfirmBtn"),
    leaveTitle: $("leaveTitle"),
    leaveCopy: $("leaveCopy"),
    lureBtn: $("lureBtn"),
    sonarPrepBtn: $("sonarPrepBtn"),
    sonarBtn: $("sonarBtn"),
    notesText: $("notesText"),
    albumText: $("albumText"),
    diamondText: $("diamondText"),
    zoneText: $("zoneText"),
    timeText: $("timeText"),
    goalText: $("goalText"),
    hintText: $("hintText"),
    castMeter: document.querySelector(".cast-meter"),
    castFill: $("castFill"),
    tensionLane: $("tensionLane"),
    safeBand: $("safeBand"),
    tensionMarker: $("tensionMarker"),
    tensionStatus: $("tensionStatus"),
    tensionCoach: $("tensionCoach"),
    resultTitle: $("resultTitle"),
    resultText: $("resultText"),
    scoreText: $("scoreText"),
    catchValueText: $("catchValueText"),
    newAlbumText: $("newAlbumText"),
    catchList: $("catchList"),
    catchToast: $("catchToast"),
    runScoreText: $("runScoreText"),
    runValueText: $("runValueText"),
    lastCatchText: $("lastCatchText"),
    resultAdviceText: $("resultAdviceText"),
    resultBuildCue: $("resultBuildCue"),
    resultMissionPreview: $("resultMissionPreview"),
  };

  const text = {
    en: {
      title: "Animal Reef Fisher",
      pageTitle: "Animal Reef Fisher - Free Reef Fishing Animal Game | WeightPlay",
      pageDescription: "Clear 30 reef fishing missions by timing casts, controlling changing line-tension zones, documenting 12 sea creatures, upgrading six tools, and landing six Guardian fish.",
      language: "Language",
      backToLobby: "Back to lobby",
      back: "Back",
      reefZones: "Reef zones",
      gearUpgrades: "Gear upgrades",
      menuTitle: "Chart 30 reef missions and land six Guardian fish.",
      menuHint: "Control changing line-tension rules, document 12 species, earn Reef Notes, and upgrade six tools locally.",
      reefNotes: "Reef Notes",
      album: "Album",
      diamonds: "Diamonds",
      startGame: "Start Game",
      soundOn: "Sound: On",
      soundOff: "Sound: Off",
      enableSound: "Enable sound",
      disableSound: "Disable sound",
      chooseZone: "Choose Reef Mission",
      prepareGear: "Prepare Gear",
      startExpedition: "Start Expedition",
      reefMap: "Reef Map",
      nextMission: "Next Mission",
      stages: "Stages",
      nextStage: "Next Stage",
      replay: "Replay",
      leaveTitle: "Leave this expedition?",
      leaveCopy: "Mission {stage}: {catches}/{goal} catches and {time}s left. This expedition, its catches, and any prepared Lure or Sonar will be lost. Saved Album, Reef Notes, and gear stay safe.",
      keepFishing: "Keep Fishing",
      leaveExpedition: "Leave Expedition",
      zone: "Zone",
      time: "Time",
      goal: "Goal",
      retry: "Try Again",
      castHint: "Hold in the reef to charge, release to cast.",
      charging: "Release when the power reaches the water depth you want.",
      hooked: "Fish hooked. Drag the red knob below, or slide left and right on the sea. Keep the marker in the green SAFE area.",
      hookedBehavior: "{behavior}: {hint} Keep the marker in SAFE.",
      behaviorSteady: "Steady swimmer",
      behaviorSteadyHint: "Follow the smooth pull with small movements.",
      behaviorDart: "Darting swimmer",
      behaviorDartHint: "Watch for quick direction changes and slide back gently.",
      behaviorHeavy: "Heavy swimmer",
      behaviorHeavyHint: "It pulls for longer. Stay patient near the middle.",
      tensionTitle: "Line Tension",
      tensionLow: "Loose",
      tensionSafe: "Safe",
      tensionHigh: "Tight",
      tensionMarker: "Drag",
      playAreaAria: "Animal Reef Fisher play area. Hold Space to charge and release to cast; use Left and Right arrows to control tension.",
      tensionLaneAria: "Line tension lane. Use Left and Right arrows to adjust.",
      sonarAria: "Use sonar",
      sonarDecision: "Use prepared Sonar to reveal and lock the next fish, rarity, and pull behavior.",
      tensionCoachAim: "Hold the sea or Space to cast. When a fish bites, drag the red knob, slide on the sea, or use Left and Right arrows.",
      tensionCoachReel: "Drag the red knob, slide on the sea, or use Left and Right arrows to stay inside the green SAFE area.",
      tensionCoachSafe: "Good. Keep sliding gently and stay in SAFE until the fish is landed.",
      tensionCoachDanger: "Slide back into SAFE now.",
      tensionStatusAim: "Step 1: hold the sea to charge, then release to cast.",
      tensionStatusCharging: "Release to cast. Step 2 starts when a fish bites.",
      tensionStatusHooked: "Step 2: drag the red knob, or slide on the sea, into SAFE.",
      tensionStatusSafe: "Inside SAFE. Hold steady.",
      tensionStatusDanger: "Move the red knob back into SAFE before the line breaks.",
      landingProgress: "Landing {progress}%",
      landed: "Catch landed! Keep going before time runs out.",
      broke: "Line broke. The tension marker left the safe band too long.",
      escaped: "The fish escaped. Cast again and keep the marker centered.",
      sonarReady: "Sonar is ready for this expedition.",
      sonarScan: "Sonar: {fish} · {rarity} · {behavior}. Next cast locked.",
      sonarStatus: "Next: {fish}",
      needDiamonds: "Need {cost} diamonds.",
      lureReady: "Rare lure ready for the next expedition.",
      buyLure: "Rare Lure {cost}D",
      buySonar: "Sonar Ping {cost}D",
      confirmLure: "Confirm Lure · {before}→{after}D",
      confirmSonar: "Confirm Sonar · {before}→{after}D",
      lureBuyLabel: "Rare Lure improves the chance of one rare marker next expedition. Costs 3 Diamonds. Balance {balance}.",
      sonarBuyLabel: "Sonar Ping reveals and locks the next fish before casting. Costs 2 Diamonds. Balance {balance}.",
      lureConfirmLabel: "Confirm Rare Lure. Spend 3 Diamonds. Balance {before} to {after}.",
      sonarConfirmLabel: "Confirm Sonar Ping. Spend 2 Diamonds. Balance {before} to {after}.",
      sonar: "Sonar",
      upgrade: "Upgrade",
      max: "Max",
      gearUpgradeLabel: "Upgrade {gear} from Level {beforeLevel} to Level {afterLevel}. Spend {cost} Reef Notes. Balance {before} to {after}.",
      gearUpgradeNeedLabel: "{gear} Level {beforeLevel}. Level {afterLevel} costs {cost} Reef Notes. Balance {balance}; need {need} more.",
      gearMaxLabel: "{gear} Level {level}. Maximum level.",
      locked: "Locked",
      complete: "Complete",
      expeditionWin: "Expedition Complete",
      expeditionFail: "Expedition Ended",
      result: "Landed {catches} catches, discovered {newFish} new album entries, and earned {notes} Reef Notes.",
      score: "Score",
      catchValue: "Catch Value",
      runScore: "Run Score",
      runCatchValue: "Reef Notes",
      lastCatch: "Last Catch",
      noCatchYet: "No catch yet",
      newAlbum: "New Album",
      catchSummary: "This Expedition's Catch",
      catchToast: "Caught {fish}",
      catchToastMeta: "+{points} pts · +{notes} notes{newTag}",
      catchHudMeta: "{rarity} · +{points} pts · +{notes} notes{newTag}",
      newTag: " · New album!",
      noCatch: "No fish landed yet. Try a safer cast and keep the line in SAFE.",
      rareFish: "Rare",
      commonFish: "Common",
      nextCastWin: "Next cast: keep the same steady tension pattern, then use a fuller cast when the mission clock is tight.",
      nextCastFail: "Next cast: return the marker to SAFE earlier. If it keeps drifting out, upgrade Reel Control or Line Durability.",
      nextCastFailSafe: "Next cast: tension stayed mostly SAFE. Use a stronger cast or upgrade Rod Strength and Bait Quality to create more landing time.",
      nextMissionPreview: "Upcoming reef change: {mission} · {name}. {special}Rule: {rule}. Goal: {goal} catches.",
    },
    "zh-Hant": {
      title: "動物珊瑚釣手",
      pageTitle: "動物珊瑚釣手 | WeightPlay",
      pageDescription: "挑戰 30 個珊瑚礁釣魚任務，掌握變化中的魚線安全區、記錄 12 種海洋生物、升級六種裝備，並釣起六隻守護魚。",
      language: "語言",
      backToLobby: "返回大廳",
      back: "返回",
      reefZones: "礁區選擇",
      gearUpgrades: "裝備升級",
      menuTitle: "完成 30 個礁區任務，釣起六隻守護魚。",
      menuHint: "控制會變化的魚線安全區、記錄 12 種生物、獲得礁石筆記，並在本機升級六種裝備。",
      reefNotes: "礁石筆記",
      album: "圖鑑",
      diamonds: "鑽石",
      startGame: "開始遊戲",
      soundOn: "音效：開",
      soundOff: "音效：關",
      enableSound: "開啟音效",
      disableSound: "關閉音效",
      chooseZone: "選擇礁區任務",
      prepareGear: "遠征準備",
      startExpedition: "開始遠征",
      reefMap: "礁區地圖",
      nextMission: "下一個任務",
      stages: "關卡",
      nextStage: "下一關",
      replay: "重新挑戰",
      leaveTitle: "要離開這次遠征嗎？",
      leaveCopy: "第 {stage} 關：已釣到 {catches}/{goal} 條，剩餘 {time} 秒。本次遠征、漁獲與已準備的魚餌或聲納會消失；已儲存的圖鑑、礁石筆記與裝備不受影響。",
      keepFishing: "繼續釣魚",
      leaveExpedition: "離開遠征",
      zone: "礁區",
      time: "時間",
      goal: "目標",
      retry: "再試一次",
      castHint: "按住礁海畫面蓄力，放開即可拋竿。",
      charging: "蓄力到想要的水深時放開。",
      hooked: "魚上鉤了。拖曳下方紅色鈕，或直接在海面左右滑，讓標記留在綠色安全區。",
      hookedBehavior: "{behavior}：{hint} 讓標記留在安全區。",
      behaviorSteady: "穩定型魚",
      behaviorSteadyHint: "拉力平順，用小幅度移動跟著調整。",
      behaviorDart: "突進型魚",
      behaviorDartHint: "會快速改變方向，看到突進後輕輕滑回。",
      behaviorHeavy: "重拉型魚",
      behaviorHeavyHint: "拉力持續較久，耐心守在中央附近。",
      tensionTitle: "魚線張力",
      tensionLow: "太鬆",
      tensionSafe: "安全",
      tensionHigh: "太緊",
      tensionMarker: "拖曳",
      playAreaAria: "動物珊瑚釣手遊戲區。按住空白鍵蓄力，放開拋竿；用左右方向鍵控制張力。",
      tensionLaneAria: "魚線張力軌道。使用左右方向鍵調整。",
      sonarAria: "使用聲納",
      sonarDecision: "使用已準備的聲納，揭示並鎖定下一條魚、稀有度與拉力型態。",
      tensionCoachAim: "按住海面或空白鍵拋竿；魚咬餌後，拖紅色鈕、在海面左右滑，或使用左右方向鍵。",
      tensionCoachReel: "拖曳紅色鈕、在海面左右滑，或使用左右方向鍵，讓標記留在綠色安全區。",
      tensionCoachSafe: "很好，輕輕左右滑並留在安全區直到魚上岸。",
      tensionCoachDanger: "現在滑回安全區。",
      tensionStatusAim: "步驟1：按住海面蓄力，放開拋竿。",
      tensionStatusCharging: "放開即可拋竿；魚咬餌後進入步驟2。",
      tensionStatusHooked: "步驟2：拖紅色鈕，或在海面左右滑，拉進綠色安全區。",
      tensionStatusSafe: "已在安全區，保持穩定。",
      tensionStatusDanger: "快把紅色鈕拖回安全區，不然魚線會斷。",
      landingProgress: "上岸進度 {progress}%",
      landed: "成功收線！趁時間結束前繼續挑戰。",
      broke: "魚線斷了。張力標記離開安全區太久。",
      escaped: "魚逃走了。再拋一次，讓標記更靠近中央。",
      sonarReady: "聲納已準備在這次遠征使用。",
      sonarScan: "聲納：{fish} · {rarity} · {behavior}。已鎖定下次拋竿。",
      sonarStatus: "下一條：{fish}",
      needDiamonds: "需要 {cost} 顆鑽石。",
      lureReady: "稀有魚餌已準備在下一次遠征使用。",
      buyLure: "稀有魚餌 {cost}鑽",
      buySonar: "聲納脈衝 {cost}鑽",
      confirmLure: "確認魚餌 · {before}→{after}鑽",
      confirmSonar: "確認聲納 · {before}→{after}鑽",
      lureBuyLabel: "稀有魚餌會提高下次遠征出現一個稀有標記的機會。花費 3 顆鑽石，目前餘額 {balance}。",
      sonarBuyLabel: "聲納脈衝會在拋竿前揭示並鎖定下一條魚。花費 2 顆鑽石，目前餘額 {balance}。",
      lureConfirmLabel: "確認購買稀有魚餌。花費 3 顆鑽石，餘額由 {before} 變為 {after}。",
      sonarConfirmLabel: "確認購買聲納脈衝。花費 2 顆鑽石，餘額由 {before} 變為 {after}。",
      sonar: "聲納",
      upgrade: "升級",
      max: "滿級",
      gearUpgradeLabel: "將{gear}從等級 {beforeLevel} 升到等級 {afterLevel}。花費 {cost} 點礁石筆記，餘額由 {before} 變為 {after}。",
      gearUpgradeNeedLabel: "{gear}目前等級 {beforeLevel}。升到等級 {afterLevel} 需要 {cost} 點礁石筆記；目前有 {balance} 點，還差 {need} 點。",
      gearMaxLabel: "{gear}目前等級 {level}，已達滿級。",
      locked: "未解鎖",
      complete: "完成",
      expeditionWin: "遠征完成",
      expeditionFail: "遠征結束",
      result: "收獲 {catches} 次，發現 {newFish} 個新圖鑑項目，並獲得 {notes} 份礁石筆記。",
      score: "分數",
      catchValue: "漁獲價值",
      runScore: "本局分數",
      runCatchValue: "礁石筆記",
      lastCatch: "最新漁獲",
      noCatchYet: "尚未釣到",
      newAlbum: "新圖鑑",
      catchSummary: "本次漁獲",
      catchToast: "釣到 {fish}",
      catchToastMeta: "+{points} 分 · +{notes} 筆記{newTag}",
      catchHudMeta: "{rarity} · +{points} 分 · +{notes} 筆記{newTag}",
      newTag: " · 新圖鑑！",
      noCatch: "還沒有釣到魚。試著拋近一點，並把張力留在安全區。",
      rareFish: "稀有",
      commonFish: "一般",
      nextCastWin: "下一竿：維持這次穩定的張力節奏；若任務時間吃緊，再提高拋竿蓄力。",
      nextCastFail: "下一竿：更早把標記拉回安全區；若仍反覆偏離，優先升級捲線控制或魚線耐久。",
      nextCastFailSafe: "下一竿：本局大多保持安全張力。提高拋竿蓄力，或升級釣竿強度與魚餌品質，爭取更多上岸時間。",
      nextMissionPreview: "即將出現的海況變化：{mission} · {name}。{special}規則：{rule}。目標：{goal} 尾。",
    },
  };

  text.es = {
    title:"Pescador del Arrecife Animal",pageTitle:"Pescador del Arrecife Animal - Juego de pesca | WeightPlay",pageDescription:"Completa 30 misiones de pesca, controla zonas de tensión cambiantes, documenta 12 criaturas marinas, mejora seis herramientas y captura seis peces Guardianes.",language:"Idioma",backToLobby:"Volver al vestíbulo",back:"Volver",reefZones:"Zonas del arrecife",gearUpgrades:"Mejoras de equipo",menuTitle:"Traza 30 misiones y captura seis peces Guardianes.",menuHint:"Controla reglas de tensión cambiantes, documenta 12 especies, gana Notas del Arrecife y mejora seis herramientas.",reefNotes:"Notas del Arrecife",album:"Álbum",diamonds:"Diamantes",startGame:"Empezar",soundOn:"Sonido: Sí",soundOff:"Sonido: No",enableSound:"Activar sonido",disableSound:"Desactivar sonido",chooseZone:"Elegir misión del arrecife",prepareGear:"Preparar equipo",startExpedition:"Empezar expedición",reefMap:"Mapa del arrecife",nextMission:"Próxima misión",leaveTitle:"¿Salir de esta expedición?",leaveCopy:"Misión {stage}: {catches}/{goal} capturas y {time}s restantes. Se perderán esta expedición, sus capturas y cualquier Cebo o Sonar preparado. El Álbum, las Notas y el equipo guardados quedan seguros.",keepFishing:"Seguir pescando",leaveExpedition:"Salir de la expedición",zone:"Zona",time:"Tiempo",goal:"Objetivo",retry:"Reintentar",
    castHint:"Mantén pulsado el mar para cargar y suelta para lanzar.",charging:"Suelta al alcanzar la profundidad deseada.",hooked:"El pez ha picado. Arrastra el control rojo, desliza en el mar o usa Izquierda y Derecha para mantener el indicador en la zona verde.",hookedBehavior:"{behavior}: {hint} Mantén el indicador en la zona segura.",behaviorSteady:"Pez estable",behaviorSteadyHint:"La fuerza es suave; sigue con movimientos pequeños.",behaviorDart:"Pez veloz",behaviorDartHint:"Cambia de dirección rápido; corrige suavemente tras cada impulso.",behaviorHeavy:"Pez pesado",behaviorHeavyHint:"Tira durante más tiempo; ten paciencia cerca del centro.",tensionTitle:"Tensión de línea",tensionLow:"Muy floja",tensionSafe:"SEGURA",tensionHigh:"Muy tensa",tensionMarker:"Arrastrar",playAreaAria:"Zona de pesca. Mantén Espacio para cargar, suelta para lanzar y usa las flechas para controlar la tensión.",tensionLaneAria:"Carril de tensión. Ajusta con las flechas izquierda y derecha.",sonarAria:"Usar sonar",sonarDecision:"Usa el Sonar preparado para revelar y fijar el próximo pez, su rareza y su comportamiento de arrastre.",
    tensionCoachAim:"Mantén el mar o Espacio para lanzar. Cuando pique, arrastra el control rojo, desliza o usa las flechas.",tensionCoachReel:"Arrastra el control rojo, desliza en el mar o usa las flechas para permanecer en la zona verde.",tensionCoachSafe:"Bien. Desliza suavemente y permanece en SEGURA hasta capturarlo.",tensionCoachDanger:"Vuelve ahora a la zona segura.",tensionStatusAim:"Paso 1: mantén pulsado para cargar y suelta para lanzar.",tensionStatusCharging:"Suelta para lanzar. El paso 2 empieza cuando pique un pez.",tensionStatusHooked:"Paso 2: arrastra el control rojo o desliza para entrar en la zona verde.",tensionStatusSafe:"En zona segura. Mantén el control.",tensionStatusDanger:"Devuelve el control rojo a la zona segura o se romperá la línea.",landingProgress:"Progreso {progress}%",landed:"¡Captura lograda! Sigue antes de que termine el tiempo.",broke:"La línea se rompió. El indicador estuvo demasiado tiempo fuera de la zona segura.",escaped:"El pez escapó. Lanza otra vez y mantén el indicador centrado.",
    sonarReady:"El sonar está preparado para esta expedición.",sonarScan:"Sonar: {fish} · {rarity} · {behavior}. Próximo lanzamiento fijado.",sonarStatus:"Siguiente: {fish}",needDiamonds:"Necesitas {cost} diamantes.",lureReady:"El cebo raro está preparado para la próxima expedición.",buyLure:"Cebo raro {cost}💎",buySonar:"Pulso sonar {cost}💎",confirmLure:"Confirmar cebo · {before}→{after}💎",confirmSonar:"Confirmar sonar · {before}→{after}💎",lureBuyLabel:"El Cebo raro aumenta la posibilidad de una marca rara en la próxima expedición. Cuesta 3 diamantes. Saldo {balance}.",sonarBuyLabel:"El Pulso sonar revela y fija el próximo pez antes de lanzar. Cuesta 2 diamantes. Saldo {balance}.",lureConfirmLabel:"Confirma el Cebo raro. Gasta 3 diamantes. Saldo de {before} a {after}.",sonarConfirmLabel:"Confirma el Pulso sonar. Gasta 2 diamantes. Saldo de {before} a {after}.",sonar:"Sonar",upgrade:"Mejorar",max:"Máx.",gearUpgradeLabel:"Mejora {gear} del nivel {beforeLevel} al {afterLevel}. Gasta {cost} Notas. Saldo de {before} a {after}.",gearUpgradeNeedLabel:"{gear} nivel {beforeLevel}. El nivel {afterLevel} cuesta {cost} Notas. Saldo {balance}; faltan {need}.",gearMaxLabel:"{gear} nivel {level}. Nivel máximo.",locked:"Bloqueado",complete:"Completado",
     expeditionWin:"Expedición completada",expeditionFail:"Expedición terminada",result:"Lograste {catches} capturas, descubriste {newFish} entradas nuevas y ganaste {notes} Notas del Arrecife.",score:"Puntuación",catchValue:"Valor de captura",runScore:"Puntuación",runCatchValue:"Notas del Arrecife",lastCatch:"Última captura",noCatchYet:"Sin capturas",newAlbum:"Álbum nuevo",catchSummary:"Capturas de esta expedición",catchToast:"Capturaste {fish}",catchToastMeta:"+{points} pts · +{notes} notas{newTag}",catchHudMeta:"{rarity} · +{points} pts · +{notes} notas{newTag}",newTag:" · ¡Nuevo en el álbum!",noCatch:"Aún no capturaste peces. Haz un lanzamiento más seguro y mantén la línea en SEGURA.",rareFish:"Raro",commonFish:"Común",nextCastWin:"Próximo lanzamiento: repite el patrón de tensión estable y carga más si el reloj aprieta.",nextCastFail:"Próximo lanzamiento: devuelve antes el indicador a SEGURA. Si sigue saliendo, mejora el control del carrete o la resistencia de línea.",nextCastFailSafe:"Próximo lanzamiento: la tensión estuvo casi siempre SEGURA. Carga más o mejora la fuerza de caña y la calidad del cebo para ganar tiempo de captura.",nextMissionPreview:"Próximo cambio del arrecife: {mission} · {name}. {special}Regla: {rule}. Objetivo: {goal} capturas."
  };

  Object.assign(text.es, {
    stages: "Etapas",
    nextStage: "Siguiente etapa",
    replay: "Repetir",
  });

  Object.assign(text.en, {
    mission: "Mission {stage}",
    bossMission: "Guardian Catch",
    ruleOpen: "Open Water · steady safe band",
    ruleDrift: "Kelp Drift · safe band moves smoothly",
    ruleSnag: "Coral Snags · safe band breathes narrower",
    ruleTide: "Moon Tide · safe band changes sides",
    ruleStorm: "Storm Gust · three-second line bursts",
    ruleAbyss: "Abyss Trial · drift, pressure, and gusts",
    bossHooked: "GUARDIAN · {fish}: {rule}",
    bossShieldOpen: "OPEN: hold SAFE to damage the Guardian.",
    bossShieldClosed: "SHIELDED: stay SAFE until it opens.",
  });
  Object.assign(text["zh-Hant"], {
    mission: "第 {stage} 關",
    bossMission: "守護魚挑戰",
    ruleOpen: "開放海面 · 固定安全區",
    ruleDrift: "海藻漂流 · 安全區平順移動",
    ruleSnag: "珊瑚纏線 · 安全區週期收窄",
    ruleTide: "月潮換向 · 安全區左右切換",
    ruleStorm: "風暴突流 · 每三秒衝擊魚線",
    ruleAbyss: "深淵試煉 · 漂移、壓力與突流",
    bossHooked: "守護魚 · {fish}：{rule}",
    bossShieldOpen: "破綻：留在安全區攻破守護魚。",
    bossShieldClosed: "護甲中：留在安全區等待開啟。",
  });
  Object.assign(text.es, {
    mission:"Misión {stage}",bossMission:"Captura del Guardián",ruleOpen:"Mar abierto · zona segura estable",ruleDrift:"Deriva de algas · la zona se mueve suavemente",ruleSnag:"Enganches de coral · la zona se estrecha",ruleTide:"Marea lunar · la zona cambia de lado",ruleStorm:"Ráfaga de tormenta · tirones cada tres segundos",ruleAbyss:"Prueba abisal · deriva, presión y ráfagas",bossHooked:"GUARDIÁN · {fish}: {rule}",bossShieldOpen:"ABIERTO: permanece en SEGURA para dañar al Guardián.",bossShieldClosed:"PROTEGIDO: permanece en SEGURA hasta que se abra."
  });
  Object.assign(text, {
    en: { ...text.en, gearEffectRod: "More landing progress while the fish stays in SAFE.", gearEffectReel: "The line marker responds faster to your tension control.", gearEffectLine: "Widens the SAFE tension window and gives more room before a break.", gearEffectBait: "Raises landing progress and Reef Notes earned from each catch.", gearEffectBoat: "Adds 5 seconds to each expedition per level above Level 1.", gearEffectScan: "Expands the early fish pool by one species per level." },
    "zh-Hant": { ...text["zh-Hant"], gearEffectRod: "魚留在安全區時，上岸進度提高。", gearEffectReel: "魚線標記會更快回應你的張力操作。", gearEffectLine: "擴大安全區張力範圍，魚線更不容易斷。", gearEffectBait: "提高上岸進度，並增加每次漁獲獲得的礁石筆記。", gearEffectBoat: "每高於 1 級，為每次遠征增加 5 秒。", gearEffectScan: "每升 1 級，提早的漁獲池增加 1 種魚。" },
    "zh-Hans": { ...text["zh-Hans"], gearEffectRod: "鱼停留在安全区时，上岸进度提高。", gearEffectReel: "鱼线标记会更快响应你的张力操作。", gearEffectLine: "扩大安全区张力范围，鱼线更不容易断。", gearEffectBait: "提高上岸进度，并增加每次渔获获得的礁石笔记。", gearEffectBoat: "每高于 1 级，为每次远征增加 5 秒。", gearEffectScan: "每升 1 级，前期鱼池增加 1 种鱼。" },
    ja: { ...text.ja, gearEffectRod: "魚がSAFEにいる間の上陸進行が上がります。", gearEffectReel: "張力操作に対するラインマーカーの反応が速くなります。", gearEffectLine: "SAFEの張力範囲が広がり、ラインが切れるまでの余裕が増えます。", gearEffectBait: "上陸進行と、釣果ごとのリーフノート獲得量が増えます。", gearEffectBoat: "レベル2以降、遠征時間が1レベルごとに5秒増えます。", gearEffectScan: "レベルごとに、序盤の魚プールが1種広がります。" },
    ko: { ...text.ko, gearEffectRod: "물고기가 SAFE에 있을 때 착지 진행도가 올라갑니다.", gearEffectReel: "장력 조작에 대한 줄 마커 반응이 빨라집니다.", gearEffectLine: "SAFE 장력 범위가 넓어져 줄이 끊기기 전 여유가 늘어납니다.", gearEffectBait: "착지 진행도와 잡을 때 얻는 Reef Notes가 늘어납니다.", gearEffectBoat: "레벨 2부터 레벨당 원정 시간이 5초 늘어납니다.", gearEffectScan: "레벨당 초반 물고기 풀이 한 종씩 넓어집니다." },
    es: { ...text.es, gearEffectRod: "Más progreso de captura mientras el pez permanece en SEGURA.", gearEffectReel: "El indicador de línea responde más rápido a tu control de tensión.", gearEffectLine: "Amplía la zona SEGURA y da más margen antes de romper la línea.", gearEffectBait: "Aumenta el progreso de captura y las Notas obtenidas por captura.", gearEffectBoat: "Añade 5 segundos a cada expedición por nivel sobre el nivel 1.", gearEffectScan: "Amplía el grupo temprano de peces en una especie por nivel." },
    fr: { ...text.fr, gearEffectRod: "Progressez davantage vers la capture lorsque le poisson reste en zone sûre.", gearEffectReel: "Le marqueur de ligne réagit plus vite à votre contrôle de tension.", gearEffectLine: "Élargit la zone sûre et donne plus de marge avant la rupture.", gearEffectBait: "Augmente la progression de capture et les Notes gagnées par prise.", gearEffectBoat: "Ajoute 5 secondes à chaque expédition par niveau au-dessus du niveau 1.", gearEffectScan: "Élargit le groupe de poissons précoces d'une espèce par niveau." },
    de: { ...text.de, gearEffectRod: "Mehr Fangfortschritt, solange der Fisch im sicheren Bereich bleibt.", gearEffectReel: "Der Linienmarker reagiert schneller auf deine Spannungskontrolle.", gearEffectLine: "Vergrößert den sicheren Bereich und gibt mehr Spielraum vor einem Riss.", gearEffectBait: "Erhöht Fangfortschritt und Reef-Notizen pro Fang.", gearEffectBoat: "Fügt pro Stufe über Stufe 1 fünf Sekunden zu jeder Expedition hinzu.", gearEffectScan: "Erweitert den frühen Fischpool um eine Art pro Stufe." },
    it: { ...text.it, gearEffectRod: "Più avanzamento verso la cattura quando il pesce resta in SICURA.", gearEffectReel: "Il marker della lenza reagisce più rapidamente al controllo della tensione.", gearEffectLine: "Allarga la zona SICURA e dà più margine prima che la lenza si spezzi.", gearEffectBait: "Aumenta l'avanzamento e le Note della Barriera ottenute per ogni cattura.", gearEffectBoat: "Aggiunge 5 secondi a ogni spedizione per livello oltre il livello 1.", gearEffectScan: "Amplia il gruppo iniziale di pesci di una specie per livello." },
    "pt-BR": { ...text["pt-BR"], gearEffectRod: "Mais progresso de captura enquanto o peixe permanece em SEGURA.", gearEffectReel: "O marcador da linha responde mais rápido ao seu controle de tensão.", gearEffectLine: "Amplia a área SEGURA e dá mais margem antes de a linha arrebentar.", gearEffectBait: "Aumenta o progresso de captura e as Notas do Recife por captura.", gearEffectBoat: "Adiciona 5 segundos a cada expedição por nível acima do nível 1.", gearEffectScan: "Amplia o grupo inicial de peixes em uma espécie por nível." },
    ru: { ...text.ru, gearEffectRod: "Больше прогресса поимки, пока рыба остаётся в БЕЗОПАСНОЙ зоне.", gearEffectReel: "Маркер лески быстрее реагирует на управление натяжением.", gearEffectLine: "Расширяет БЕЗОПАСНУЮ зону и даёт больше запаса до обрыва лески.", gearEffectBait: "Повышает прогресс поимки и число Рифовых заметок за улов.", gearEffectBoat: "Добавляет 5 секунд к каждой экспедиции за каждый уровень выше 1.", gearEffectScan: "Расширяет ранний список рыб на один вид за уровень." },
    hi: { ...text.hi, gearEffectRod: "मछली के SAFE में रहने पर पकड़ने की प्रगति बढ़ती है।", gearEffectReel: "तनाव नियंत्रण पर लाइन मार्कर तेज़ी से प्रतिक्रिया देता है।", gearEffectLine: "SAFE तनाव क्षेत्र चौड़ा होता है और लाइन टूटने से पहले अधिक गुंजाइश मिलती है।", gearEffectBait: "पकड़ने की प्रगति और हर कैच से मिलने वाले Reef Notes बढ़ते हैं।", gearEffectBoat: "लेवल 1 से ऊपर हर लेवल पर हर अभियान में 5 सेकंड जुड़ते हैं।", gearEffectScan: "हर लेवल पर शुरुआती मछली पूल में एक प्रजाति जुड़ती है।" },
    ar: { ...text.ar, gearEffectRod: "تزداد وتيرة الصيد ما دامت السمكة داخل المنطقة الآمنة.", gearEffectReel: "يستجيب مؤشر الخيط أسرع لتحكمك في الشد.", gearEffectLine: "توسّع نطاق الأمان وتمنح هامشًا أكبر قبل انقطاع الخيط.", gearEffectBait: "تزيد تقدم الصيد وملاحظات الشعاب المكتسبة من كل صيد.", gearEffectBoat: "تضيف 5 ثوانٍ إلى كل رحلة لكل مستوى فوق المستوى 1.", gearEffectScan: "توسّع مجموعة الأسماك المبكرة بنوع واحد لكل مستوى." },
  });

  Object.assign(text, {
    en: { ...text.en,
      resultBuildCueDanger: "You earned {notes} Reef Notes. About {percent}% of line-control time was outside SAFE; invest in Reel Control or Line Durability next.",
      resultBuildCueSafe: "You earned {notes} Reef Notes. Tension stayed mostly SAFE; invest in Rod Strength or Bait Quality when the clock is tight.",
      resultBuildCueNoCatch: "You earned {notes} Reef Notes. No fish reached the reel this time; try a fuller cast, then consider Rod Strength or Bait Quality if the clock stays tight.",
    },
    "zh-Hant": { ...text["zh-Hant"],
      resultBuildCueDanger: "本次獲得 {notes} 份礁石筆記；約有 {percent}% 的收線時間在安全區外。下一步可投資捲線控制或魚線耐久。",
      resultBuildCueSafe: "本次獲得 {notes} 份礁石筆記；張力大多維持在安全區。時間吃緊時，可投資釣竿強度或魚餌品質。",
      resultBuildCueNoCatch: "本次獲得 {notes} 份礁石筆記；這次沒有魚進入收線階段。先提高拋竿蓄力，若時間仍吃緊，可考慮釣竿強度或魚餌品質。",
    },
    "zh-Hans": { ...text["zh-Hans"],
      resultBuildCueDanger: "本次获得 {notes} 份礁石笔记；约有 {percent}% 的收线时间在安全区外。下一步可投资卷线控制或鱼线耐久。",
      resultBuildCueSafe: "本次获得 {notes} 份礁石笔记；张力大多保持在安全区。时间紧张时，可投资钓竿强度或鱼饵品质。",
      resultBuildCueNoCatch: "本次获得 {notes} 份礁石笔记；这次没有鱼进入收线阶段。先提高抛竿蓄力，若时间仍紧张，可考虑钓竿强度或鱼饵品质。",
    },
    ja: { ...text.ja,
      resultBuildCueDanger: "今回 {notes} 枚のリーフノートを獲得しました。ライン操作時間の約 {percent}% がSAFE外でした。次はリール操作かライン耐久に投資しましょう。",
      resultBuildCueSafe: "今回 {notes} 枚のリーフノートを獲得しました。張力はほぼSAFEでした。時間が厳しいときはロッド強度かベイト品質に投資しましょう。",
      resultBuildCueNoCatch: "今回 {notes} 枚のリーフノートを獲得しました。今回はリール段階まで魚が進みませんでした。まず強めにキャストし、時間が厳しければロッド強度かベイト品質を検討しましょう。",
    },
    ko: { ...text.ko,
      resultBuildCueDanger: "이번에 Reef Notes {notes}개를 얻었습니다. 줄 조작 시간의 약 {percent}%가 SAFE 밖이었습니다. 다음에는 릴 조절이나 줄 내구도에 투자하세요.",
      resultBuildCueSafe: "이번에 Reef Notes {notes}개를 얻었습니다. 장력은 대부분 SAFE에 있었습니다. 시간이 빠듯할 때는 낚싯대 강도나 미끼 품질에 투자하세요.",
      resultBuildCueNoCatch: "이번에 Reef Notes {notes}개를 얻었습니다. 이번에는 물고기가 릴 단계까지 오지 않았습니다. 먼저 더 강하게 캐스팅하고, 시간이 빠듯하면 낚싯대 강도나 미끼 품질을 고려하세요.",
    },
    es: { ...text.es,
      resultBuildCueDanger: "Ganaste {notes} Notas del Arrecife. Cerca del {percent}% del tiempo de control estuvo fuera de SEGURA; mejora el control del carrete o la resistencia de línea.",
      resultBuildCueSafe: "Ganaste {notes} Notas del Arrecife. La tensión estuvo casi siempre en SEGURA; mejora la fuerza de caña o la calidad del cebo si el reloj aprieta.",
      resultBuildCueNoCatch: "Ganaste {notes} Notas del Arrecife. Esta vez ningún pez llegó al carrete; prueba un lanzamiento más fuerte y considera mejorar la caña o el cebo si falta tiempo.",
    },
    fr: { ...text.fr,
      resultBuildCueDanger: "Vous avez gagné {notes} Notes du récif. Environ {percent} % du temps de contrôle était hors de la zone sûre ; améliorez le contrôle du moulinet ou la résistance de la ligne.",
      resultBuildCueSafe: "Vous avez gagné {notes} Notes du récif. La tension est restée presque toujours dans la zone sûre ; améliorez la canne ou l’appât si le temps manque.",
      resultBuildCueNoCatch: "Vous avez gagné {notes} Notes du récif. Aucun poisson n’a atteint le moulinet cette fois ; lancez plus fort, puis pensez à la canne ou à l’appât si le temps manque.",
    },
    de: { ...text.de,
      resultBuildCueDanger: "Du hast {notes} Riff-Notizen verdient. Etwa {percent}% der Leinenkontrolle lag außerhalb des sicheren Bereichs; verbessere als Nächstes Rollensteuerung oder Leinenhaltbarkeit.",
      resultBuildCueSafe: "Du hast {notes} Riff-Notizen verdient. Die Spannung blieb meist im sicheren Bereich; verbessere bei Zeitdruck Rutenstärke oder Köderqualität.",
      resultBuildCueNoCatch: "Du hast {notes} Riff-Notizen verdient. Diesmal erreichte kein Fisch die Einholphase; wirf stärker aus und erwäge bei Zeitdruck Rutenstärke oder Köderqualität.",
    },
    it: { ...text.it,
      resultBuildCueDanger: "Hai ottenuto {notes} Note della barriera. Circa il {percent}% del tempo di controllo è stato fuori da SICURA; investi nel controllo del mulinello o nella resistenza della lenza.",
      resultBuildCueSafe: "Hai ottenuto {notes} Note della barriera. La tensione è rimasta quasi sempre in SICURA; se il tempo stringe, investi nella forza della canna o nella qualità dell'esca.",
      resultBuildCueNoCatch: "Hai ottenuto {notes} Note della barriera. Questa volta nessun pesce è arrivato alla fase di recupero; lancia più forte e valuta canna o esca se il tempo stringe.",
    },
    "pt-BR": { ...text["pt-BR"],
      resultBuildCueDanger: "Você ganhou {notes} Notas do Recife. Cerca de {percent}% do tempo de controle da linha ficou fora de SEGURA; invista no controle da carretilha ou na durabilidade da linha.",
      resultBuildCueSafe: "Você ganhou {notes} Notas do Recife. A tensão ficou quase sempre em SEGURA; invista na força da vara ou na qualidade da isca quando o tempo apertar.",
      resultBuildCueNoCatch: "Você ganhou {notes} Notas do Recife. Desta vez nenhum peixe chegou à etapa de recolher; lance com mais força e considere a vara ou a isca se o tempo apertar.",
    },
    ru: { ...text.ru,
      resultBuildCueDanger: "Вы получили {notes} рифовых заметок. Около {percent}% времени натяжение было вне БЕЗОПАСНОЙ зоны; улучшите управление катушкой или прочность лески.",
      resultBuildCueSafe: "Вы получили {notes} рифовых заметок. Натяжение почти всё время было в БЕЗОПАСНОЙ зоне; при нехватке времени улучшите удилище или наживку.",
      resultBuildCueNoCatch: "Вы получили {notes} рифовых заметок. В этот раз рыба не дошла до вываживания; забросьте сильнее и при нехватке времени улучшите удилище или наживку.",
    },
    hi: { ...text.hi,
      resultBuildCueDanger: "आपने {notes} Reef Notes कमाए। लाइन नियंत्रण का लगभग {percent}% समय SAFE के बाहर रहा; अगली बार Reel Control या Line Durability में निवेश करें।",
      resultBuildCueSafe: "आपने {notes} Reef Notes कमाए। तनाव ज्यादातर SAFE में रहा; समय कम हो तो Rod Strength या Bait Quality में निवेश करें।",
      resultBuildCueNoCatch: "आपने {notes} Reef Notes कमाए। इस बार कोई मछली रील चरण तक नहीं पहुँची; ज़ोर से कास्ट करें और समय कम हो तो Rod Strength या Bait Quality पर विचार करें।",
    },
    ar: { ...text.ar,
      resultBuildCueDanger: "حصلت على {notes} من ملاحظات الشعاب. كان نحو {percent}% من وقت التحكم بالخيط خارج المنطقة الآمنة؛ حسّن تحكم البكرة أو متانة الخيط.",
      resultBuildCueSafe: "حصلت على {notes} من ملاحظات الشعاب. بقي الشد غالبًا داخل المنطقة الآمنة؛ حسّن قوة الصنارة أو جودة الطُعم عندما يضيق الوقت.",
      resultBuildCueNoCatch: "حصلت على {notes} من ملاحظات الشعاب. لم تصل أي سمكة إلى مرحلة السحب هذه المرة؛ ألقِ بقوة أكبر وفكّر في قوة الصنارة أو جودة الطُعم إذا ضاق الوقت.",
    },
  });

  const assetPaths = {
    bg: "../../assets/animal-reef-fisher-reef-bg.webp",
    otter: "../../assets/animal-reef-fisher-otter-fisher.webp",
    boat: "../../assets/animal-reef-fisher-boat-safe.webp",
    fishA: "../../assets/animal-reef-fisher-fish-sheet-a.webp",
    fishB: "../../assets/animal-reef-fisher-fish-sheet-b.webp",
    splash: "../../assets/animal-reef-fisher-fx-splash.webp",
    shimmer: "../../assets/animal-reef-fisher-fx-rare-shimmer.webp",
    sonar: "../../assets/animal-reef-fisher-fx-sonar-pulse.webp",
  };

  const regionDefinitions = [
    {
      id:"sunny", rule:"open", img:"../../assets/animal-reef-fisher-zone-sunny-shore.webp",
      names:[["Training Cove","練習海灣"],["Shellbank Channel","貝岸水道"],["Lagoon Crossing","潟湖航線"],["Sunbeam Shelf","日光礁棚"],["Crown Koi Court","日冠錦魚庭"]],
      boss:{ fishId:"fish-6", profile:"crown", name:{ en:"Sun Crown Guardian", "zh-Hant":"日冠守護錦魚" }, rule:{ en:"Follow three smooth crown pulses.", "zh-Hant":"跟隨三段平順冠潮。" } },
    },
    {
      id:"kelp", rule:"drift", img:"../../assets/animal-reef-fisher-zone-kelp-garden.webp",
      names:[["Ribbon Kelp Entry","帶狀海藻入口"],["Green Current","翠綠海流"],["Tangled Garden","纏繞花園"],["Drifting Arch","漂流拱門"],["Kelp Leviathan Hollow","海藻巨魚穴"]],
      boss:{ fishId:"fish-5", profile:"kelp", name:{ en:"Kelp Leviathan", "zh-Hant":"海藻巨笛鯛" }, rule:{ en:"The safe band drifts while its pull stays heavy.", "zh-Hant":"安全區持續漂移，拉力維持沉重。" } },
    },
    {
      id:"coral", rule:"snag", img:"../../assets/animal-reef-fisher-zone-coral-gate.webp",
      names:[["Coral Needle Pass","珊瑚針道"],["Glass Reef Window","琉璃礁窗"],["Branch Maze","枝珊瑚迷宮"],["Red Fan Corridor","紅扇走廊"],["Ram Ray Bastion","角魟堡壘"]],
      boss:{ fishId:"fish-4", profile:"coral", name:{ en:"Coral Ram Ray", "zh-Hant":"珊瑚角魟" }, rule:{ en:"Its coral guard opens and closes every two seconds.", "zh-Hant":"珊瑚護甲每兩秒開合一次。" } },
    },
    {
      id:"moon", rule:"tide", img:"../../assets/animal-reef-fisher-zone-moon-tide.webp",
      names:[["Moonlit Inlet","月光灣口"],["Silver Tide","銀色潮流"],["Jelly Lantern Way","水母燈道"],["Eclipse Pool","蝕月池"],["Moon Manta Ring","月魟環礁"]],
      boss:{ fishId:"fish-11", profile:"moon", name:{ en:"Eclipse Manta", "zh-Hant":"蝕月鬼蝠魟" }, rule:{ en:"Feints reverse the pull before each tide change.", "zh-Hant":"每次潮向改變前會假動作反拉。" } },
    },
    {
      id:"storm", rule:"storm", img:"../../assets/animal-reef-fisher-zone-deep-blue.webp",
      names:[["Rainline Shelf","雨線礁棚"],["Thunder Buoy","雷鳴浮標"],["Crosswind Trench","側風海溝"],["Whitecap Run","白浪航道"],["Storm Lantern Eye","風暴燈眼"]],
      boss:{ fishId:"fish-10", profile:"storm", name:{ en:"Storm Lantern Warden", "zh-Hant":"風暴礁燈守衛" }, rule:{ en:"A sharp gust strikes the line every three seconds.", "zh-Hant":"每三秒有一次強烈突流衝擊魚線。" } },
    },
    {
      id:"abyss", rule:"abyss", img:"../../assets/animal-reef-fisher-zone-deep-blue.webp",
      names:[["Blue Pressure Gate","深藍壓力門"],["Crystal Drop","水晶落差"],["Silent Thermocline","寂靜溫躍層"],["Abyss Beacon","深淵信標"],["Crystal Crown Throne","水晶冠王座"]],
      boss:{ fishId:"fish-12", profile:"abyss", name:{ en:"Crystal Crown Sovereign", "zh-Hant":"水晶冠魚王" }, rule:{ en:"Drift, shield windows, and abyss gusts combine.", "zh-Hant":"漂移、護甲破綻與深淵突流同時出現。" } },
    },
  ];
  const spanishMissionNames = [
    "Ensenada de entrenamiento","Canal del banco de conchas","Cruce de la laguna","Plataforma solar","Corte de la carpa corona",
    "Entrada de algas cinta","Corriente verde","Jardín enredado","Arco a la deriva","Guarida del Leviatán de algas",
    "Paso de agujas de coral","Ventana de arrecife de cristal","Laberinto de ramas","Corredor del abanico rojo","Bastión de la raya carnero",
    "Entrada iluminada por la luna","Marea plateada","Camino de faroles medusa","Poza del eclipse","Anillo de la manta lunar",
    "Plataforma de lluvia","Boya del trueno","Fosa de viento cruzado","Ruta de espuma blanca","Ojo del farol de tormenta",
    "Puerta de presión azul","Caída de cristal","Termoclina silenciosa","Faro del abismo","Trono de la corona de cristal"
  ];
  const spanishBosses = [
    ["Guardián Corona Solar","Sigue tres pulsos suaves de la corona."],
    ["Leviatán de Algas","La zona segura deriva mientras su tirón sigue pesado."],
    ["Raya Carnero de Coral","Su defensa de coral se abre y cierra cada dos segundos."],
    ["Manta del Eclipse","Sus fintas invierten el tirón antes de cada cambio de marea."],
    ["Guardián Farol de Tormenta","Una ráfaga fuerte golpea la línea cada tres segundos."],
    ["Soberano Corona de Cristal","Se combinan deriva, ventanas de escudo y ráfagas abisales."]
  ];
  regionDefinitions.forEach((region,regionIndex)=>{
    region.names.forEach((name,missionIndex)=>name.push(spanishMissionNames[regionIndex*5+missionIndex]));
    region.boss.name.es=spanishBosses[regionIndex][0];
    region.boss.rule.es=spanishBosses[regionIndex][1];
  });

  const schoolPattern = ["steady", "mixed", "dart", "heavy", "guardian"];
  const zones = regionDefinitions.flatMap((region, regionIndex) => region.names.map(([en, zh, es], missionIndex) => {
    const stage = regionIndex * 5 + missionIndex + 1;
    return {
      id:`mission-${stage}`,
      stage,
      region:region.id,
      name:{ en, "zh-Hant":zh, es },
      img:region.img,
      goal:missionIndex === 0 ? 2 : missionIndex === 4 ? 3 : 3,
      unlock:stage,
      speed:0.62 + regionIndex * 0.13 + missionIndex * 0.035,
      rule:region.rule,
      school:schoolPattern[missionIndex],
      checkpoint:missionIndex === 4,
      boss:missionIndex === 4 ? region.boss : null,
    };
  }));

  const gear = [
    { id: "rod", effectKey: "gearEffectRod", name: { en: "Rod Strength", "zh-Hant": "釣竿強度" }, img: "../../assets/animal-reef-fisher-gear-rod-strength.webp", cost: 18 },
    { id: "reel", effectKey: "gearEffectReel", name: { en: "Reel Control", "zh-Hant": "捲線控制" }, img: "../../assets/animal-reef-fisher-gear-reel-control.webp", cost: 18 },
    { id: "line", effectKey: "gearEffectLine", name: { en: "Line Durability", "zh-Hant": "魚線耐久" }, img: "../../assets/animal-reef-fisher-gear-line-durability.webp", cost: 20 },
    { id: "bait", effectKey: "gearEffectBait", name: { en: "Bait Quality", "zh-Hant": "魚餌品質" }, img: "../../assets/animal-reef-fisher-gear-bait-quality.webp", cost: 16 },
    { id: "boat", effectKey: "gearEffectBoat", name: { en: "Boat Range", "zh-Hant": "小船航程" }, img: "../../assets/animal-reef-fisher-gear-boat-range.webp", cost: 22 },
    { id: "scan", effectKey: "gearEffectScan", name: { en: "Reef Scanner", "zh-Hant": "礁區掃描" }, img: "../../assets/animal-reef-fisher-gear-reef-scanner.webp", cost: 20 },
  ];
  ["Fuerza de caña","Control del carrete","Resistencia de línea","Calidad del cebo","Alcance del barco","Escáner de arrecife"].forEach((name,index)=>{gear[index].name.es=name;});

  const fishNames = [
    ["Lagoon Stripe", "潟湖條紋魚"],
    ["Bubble Puffer", "泡泡河豚"],
    ["Coral Finch", "珊瑚雀魚"],
    ["Glass Ray", "琉璃魟魚"],
    ["Kelp Snapper", "海藻笛鯛"],
    ["Sun Crown Koi", "日冠錦魚"],
    ["Moon Jellyfish", "月光水母"],
    ["Bluefin Runner", "藍鰭快游魚"],
    ["Pearl Seahorse", "珍珠海馬"],
    ["Reef Lantern", "礁燈魚"],
    ["Storm Manta", "風暴鬼蝠魟"],
    ["Crystal Crownfish", "水晶冠魚"],
  ];

  const fish = Array.from({ length: 12 }, (_, index) => {
    const rare = index === 5 || index === 11;
    const tier = Math.floor(index / 2) + 1;
    const behavior = index < 4 ? "steady" : index < 8 ? "dart" : "heavy";
    return {
      id: `fish-${index + 1}`,
      name: { en: fishNames[index][0], "zh-Hant": fishNames[index][1] },
      sheet: index < 6 ? "fishA" : "fishB",
      sx: 0,
      sy: index % 6,
      rare,
      behavior,
      points: tier * 12 + (rare ? 34 : 0),
      notes: tier + (rare ? 5 : 1),
    };
  });
  ["Rayado de laguna","Pez globo burbuja","Pinzón de coral","Raya de cristal","Pargo de algas","Carpa Corona Solar","Medusa lunar","Corredor de aleta azul","Caballito de mar perla","Farol del arrecife","Manta de tormenta","Pez Corona de Cristal"].forEach((name,index)=>{fish[index].name.es=name;});

  const fishFrameCrops = {
    fishA: [
      [
        { x: 309, y: 16, w: 243, h: 158 },
        { x: 650, y: 29, w: 260, h: 152 },
        { x: 995, y: 33, w: 233, h: 148 },
      ],
      [
        { x: 315, y: 186, w: 234, h: 166 },
        { x: 648, y: 160, w: 243, h: 192 },
        { x: 991, y: 160, w: 238, h: 192 },
      ],
      [
        { x: 288, y: 331, w: 270, h: 191 },
        { x: 637, y: 331, w: 258, h: 159 },
        { x: 981, y: 331, w: 259, h: 161 },
      ],
      [
        { x: 285, y: 502, w: 263, h: 191 },
        { x: 629, y: 503, w: 266, h: 156 },
        { x: 968, y: 504, w: 263, h: 157 },
      ],
      [
        { x: 284, y: 672, w: 276, h: 192 },
        { x: 618, y: 678, w: 273, h: 186 },
        { x: 962, y: 680, w: 273, h: 184 },
      ],
      [
        { x: 301, y: 843, w: 225, h: 150 },
        { x: 648, y: 843, w: 225, h: 152 },
        { x: 983, y: 843, w: 249, h: 161 },
      ],
    ],
    fishB: [
      [
        { x: 242, y: 19, w: 296, h: 162 },
        { x: 589, y: 26, w: 300, h: 155 },
        { x: 941, y: 31, w: 306, h: 150 },
      ],
      [
        { x: 261, y: 160, w: 282, h: 170 },
        { x: 618, y: 160, w: 283, h: 168 },
        { x: 978, y: 160, w: 291, h: 170 },
      ],
      [
        { x: 303, y: 368, w: 233, h: 136 },
        { x: 650, y: 369, w: 227, h: 153 },
        { x: 997, y: 371, w: 229, h: 129 },
      ],
      [
        { x: 271, y: 502, w: 258, h: 191 },
        { x: 614, y: 502, w: 268, h: 191 },
        { x: 993, y: 502, w: 216, h: 154 },
      ],
      [
        { x: 243, y: 672, w: 297, h: 192 },
        { x: 596, y: 672, w: 295, h: 192 },
        { x: 943, y: 673, w: 299, h: 191 },
      ],
      [
        { x: 0, y: 843, w: 521, h: 181 },
        { x: 615, y: 843, w: 276, h: 141 },
        { x: 982, y: 843, w: 250, h: 142 },
      ],
    ],
  };

  let locale = activeI18nLocale() || readStorage(localeKey) || "en";
  if (!text[locale]) locale = "en";
  const legacyZoneMission = { sunny:"mission-1", kelp:"mission-6", coral:"mission-11", moon:"mission-16", deep:"mission-26" };
  let save = loadSave();
  let selectedZone = legacyZoneMission[save.selectedZone] || save.selectedZone || "mission-1";
  if (!zones.some((zone) => zone.id === selectedZone)) selectedZone = "mission-1";
  const STAGE_CARD_POOL_SIZE = 9;
  let stageCardPool = [];
  let stageWindowStart = 0;
  let selectedStageIndex = Math.max(0, zones.findIndex((zone) => zone.id === selectedZone));
  let stageSettleRaf = 0;
  let cancelStageRailInteraction = () => {};
  let state = "loading";
  let run = null;
  let resultDecisionCommitted = false;
  let returnedToMain = false;
  let diamondPurchasePending = "";
  let diamondConfirmTimer = 0;
  let diamondConfirmDueAt = 0;
  let diamondConfirmRemaining = 0;
  let pointer = { down: false, id: null, x: 0, y: 0, tensionPct: 50, source: "canvas", keyboardHeld: false };
  let lastTime = performance.now();
  let raf = 0;
  let backgroundSuspended = document.hidden;
  let leaveDecisionOpen = false;
  const images = {};
  const fishThumbCache = {};
  const fishCropCache = {};
  const fishFrameCanvasCache = {};
  let assetsReady = false;
  let preloadPromise = null;

  function t(key, vars = {}) {
    let value = (text[locale] && text[locale][key]) || text.en[key] || key;
    Object.entries(vars).forEach(([k, v]) => {
      value = value.replace(`{${k}}`, String(v));
    });
    return value;
  }

  // Keep this recovery instruction owned by the game so all required locales
  // share the same truthful loss/clock/recast contract.
  const lineBreakRecoveryCopy = {
    en: "Line broke. That fish is gone, but mission time keeps running. Cast again now.",
    "zh-Hant": "魚線斷了，這條魚跑掉了，但任務時間仍在倒數。現在重新拋竿。",
    "zh-Hans": "鱼线断了，这条鱼跑掉了，但任务时间仍在倒计时。现在重新抛竿。",
    ja: "ラインが切れました。この魚は逃げましたが、ミッション時間は進みます。今すぐ再キャストしましょう。",
    ko: "줄이 끊겼습니다. 이 물고기는 놓쳤지만 미션 시간은 계속 흐릅니다. 지금 다시 캐스팅하세요.",
    es: "La línea se rompió. Este pez se escapó, pero el tiempo de la misión sigue corriendo. Lanza otra vez ahora.",
    "pt-BR": "A linha arrebentou. Este peixe escapou, mas o tempo da missão continua correndo. Lance novamente agora.",
    fr: "La ligne s’est rompue. Ce poisson est parti, mais le temps de la mission continue. Relancez maintenant.",
    de: "Die Leine ist gerissen. Dieser Fisch ist weg, aber die Missionszeit läuft weiter. Wirf jetzt erneut aus.",
    it: "La lenza si è spezzata. Questo pesce è scappato, ma il tempo della missione continua. Lancia di nuovo ora.",
    ru: "Леска оборвалась. Эта рыба ушла, но время миссии продолжает идти. Забросьте снова сейчас.",
    hi: "लाइन टूट गई। यह मछली छूट गई, लेकिन मिशन का समय चलता रहेगा। अभी फिर से कास्ट करें।",
    ar: "انقطع الخيط. هربت هذه السمكة، لكن وقت المهمة مستمر. ألقِ الطُعم من جديد الآن.",
  };

  function lineBreakRecoveryText() {
    const activeLocale = window.WonderI18n?.actualLocale?.() || activeI18nLocale() || locale;
    return lineBreakRecoveryCopy[activeLocale] || lineBreakRecoveryCopy.en;
  }

  const stageLocaleOverrides = {
    it: {
      ruleOpen: "Acque aperte · zona sicura stabile",
      ruleDrift: "Deriva tra le alghe · la zona sicura si sposta dolcemente",
      ruleSnag: "Ostacoli di corallo · la zona sicura si restringe e si allarga",
      ruleTide: "Marea lunare · la zona sicura cambia lato",
      ruleStorm: "Raffiche di tempesta · strattoni alla lenza ogni tre secondi",
      ruleAbyss: "Prova abissale · deriva, pressione e raffiche",
    },
  };

  function stageT(key) {
    const activeLocale = activeI18nLocale() || document.documentElement.lang || locale;
    const owned = stageLocaleOverrides[activeLocale]?.[key] || text[activeLocale]?.[key];
    if (owned) return owned;
    const source = text.en[key] || key;
    return window.WeightPlayGameRuntimeLocalizer?.translate?.(source) || source;
  }

  function missionRuleLabel(zone) {
    return stageT(`rule${zone.rule[0].toUpperCase()}${zone.rule.slice(1)}`);
  }

  function localizedValue(values) {
    const owned = values?.[locale];
    if (owned) return owned;
    const source = values?.en || "";
    return window.WeightPlayGameRuntimeLocalizer?.translate?.(source) || source;
  }

  function missionName(zone) {
    return localizedValue(zone.name);
  }

  function renderBattleMissionBriefing(zone = run?.zone) {
    if (!zone) return;
    const missionLabel = t("mission", { stage:zone.stage });
    const name = missionName(zone);
    const rule = missionRuleLabel(zone);
    const box = nodes.zoneText.parentElement;
    const label = nodes.zoneText.previousElementSibling;
    box.classList.add("mission-briefing");
    label.textContent = rule;
    nodes.zoneText.textContent = `${zone.stage} · ${name}`;
    box.setAttribute("aria-label", `${missionLabel} · ${name} · ${rule}`);
    canvas.setAttribute("aria-label", `${t("playAreaAria")} ${missionLabel} · ${name} · ${rule}`);
  }

  const levelTerms = {
    en: "Level",
    "zh-Hant": "等級",
    "zh-Hans": "等级",
    ja: "レベル",
    ko: "레벨",
    es: "Nivel",
    "pt-BR": "Nível",
    fr: "Niveau",
    de: "Stufe",
    it: "Livello",
    ru: "Уровень",
    hi: "स्तर",
    ar: "المستوى",
  };

  function formatLevel(level) {
    const activeLocale = activeI18nLocale() || document.documentElement.lang || locale;
    return `${levelTerms[activeLocale] || levelTerms.en} ${level}`;
  }

  function playSound(name) {
    window.WonderSound?.play(name);
  }

  function updateSoundButton() {
    const muted = Boolean(window.WonderSound?.isMuted?.());
    nodes.menuSoundBtn.textContent = t(muted ? "soundOff" : "soundOn");
    nodes.menuSoundBtn.setAttribute("aria-label", t(muted ? "enableSound" : "disableSound"));
    nodes.menuSoundBtn.setAttribute("aria-pressed", String(!muted));
  }

  function persistSave(value) {
    return writeStorage(saveKey, JSON.stringify(value));
  }

  function loadSave() {
    const defaultSave = () => ({ notes: 0, unlockedZone: 1, bestCatches: 0, album: [], gear: { rod: 1, reel: 1, line: 1, bait: 1, boat: 1, scan: 1 }, selectedZone: "mission-1", lureReady: false, sonarReady: false });
    const wholeNumber = (value, fallback, minimum, maximum) => {
      const number = Number(value);
      if (!Number.isFinite(number)) return fallback;
      return Math.max(minimum, Math.min(maximum, Math.floor(number)));
    };
    let stored = null;
    try {
      stored = readStorage(saveKey);
      const parsed = JSON.parse(stored || "{}");
      const raw = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
      const unlockedZone = wholeNumber(raw.unlockedZone, 1, 1, zones.length);
      const selectedZone = legacyZoneMission[raw.selectedZone] || raw.selectedZone;
      const normalized = {
        notes: wholeNumber(raw.notes, 0, 0, Number.MAX_SAFE_INTEGER),
        unlockedZone,
        bestCatches: wholeNumber(raw.bestCatches, 0, 0, Number.MAX_SAFE_INTEGER),
        album: [...new Set(Array.isArray(raw.album) ? raw.album.filter((id) => fish.some((item) => item.id === id)) : [])],
        gear: Object.fromEntries(gear.map((item) => [item.id, wholeNumber(raw.gear?.[item.id], 1, 1, 5)])),
        selectedZone: zones.some((zone) => zone.id === selectedZone && zone.stage <= unlockedZone) ? selectedZone : "mission-1",
        lureReady: raw.lureReady === true,
        sonarReady: raw.sonarReady === true,
      };
      const canonical = JSON.stringify(normalized);
      if (stored !== canonical) persistSave(normalized);
      return normalized;
    } catch {
      const fallback = defaultSave();
      persistSave(fallback);
      return fallback;
    }
  }

  function saveProgress() {
    return persistSave(save);
  }

  function viewportBucket() {
    const viewport = window.visualViewport;
    const width = Math.round(viewport?.width || window.innerWidth || 0);
    const height = Math.round(viewport?.height || window.innerHeight || 0);
    if (width > height && height <= 500) return "short-landscape";
    if (width >= 1000) return "desktop";
    if (width >= 600) return "wide-phone";
    return "phone";
  }

  function inputType(value) {
    return ["pointer", "touch", "keyboard"].includes(value) ? value : "unknown";
  }

  function eventInputType(event) {
    if (event?.pointerType === "touch") return "touch";
    if (event?.pointerType) return "pointer";
    if (event?.type?.startsWith("key") || event?.detail === 0) return "keyboard";
    return "pointer";
  }

  function track(name, data = {}) {
    const payload = {
      ...data,
      game: GAME_ID,
      game_version: GAME_VERSION,
      interface_version: INTERFACE_VERSION,
      locale: locale || "en",
      viewport: viewportBucket(),
      input_type: inputType(data.input_type || run?.lastInputType),
    };
    if (window.WonderAnalytics && typeof window.WonderAnalytics.track === "function") {
      window.WonderAnalytics.track(name, payload);
    }
  }

  function wallet() {
    return window.WeightPlayWallet ? window.WeightPlayWallet.read() : { diamonds: 0 };
  }

  function applyLocale() {
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : locale === "es" ? "es" : "en";
    document.title = t("pageTitle");
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", t("pageDescription"));
    nodes.localeSelect.value = locale;
    document.querySelector(".back-btn")?.setAttribute("aria-label", t("backToLobby"));
    nodes.localeSelect.setAttribute("aria-label", t("language"));
    nodes.stageBackBtn.setAttribute("aria-label", t("back"));
    nodes.zoneRow.setAttribute("aria-label", t("reefZones"));
    nodes.gearGrid.setAttribute("aria-label", t("gearUpgrades"));
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
    nodes.resultMenuBtn.textContent = t("stages");
    nodes.nextZoneBtn.textContent = t("nextStage");
    nodes.retryBtn.textContent = t("replay");
    nodes.mapBtn.setAttribute("aria-label", t("reefMap"));
    nodes.leaveTitle.textContent = t("leaveTitle");
    nodes.leaveKeepBtn.textContent = t("keepFishing");
    nodes.leaveConfirmBtn.textContent = t("leaveExpedition");
    canvas.setAttribute("aria-label", t("playAreaAria"));
    nodes.tensionLane.setAttribute("aria-label", t("tensionLaneAria"));
    updateSonarButton();
    updateSoundButton();
    renderMenu();
    updateTensionGuide();
    updateCatchHud();
    renderBattleMissionBriefing();
    if (run?.lineBreakRecoveryVisible) nodes.hintText.textContent = lineBreakRecoveryText();
  }

  function loadImages() {
    const entries = Object.entries(assetPaths);
    let done = 0;
    return Promise.all(entries.map(([key, src]) => new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        images[key] = img;
        done += 1;
        const pct = Math.round((done / entries.length) * 100);
        nodes.loadingFill.style.width = `${pct}%`;
        nodes.loadingText.textContent = `${pct}%`;
        resolve();
      };
      img.onerror = () => {
        done += 1;
        resolve();
      };
      img.src = src;
    }))).then(() => {
      assetsReady = true;
      window.__ANIMAL_REEF_FISHER_ASSETS_READY__ = true;
    });
  }

  function ensureImagesReady() {
    if (assetsReady) return preloadPromise || Promise.resolve();
    if (!preloadPromise) preloadPromise = loadImages();
    return preloadPromise;
  }

  function renderMenu() {
    nodes.notesText.textContent = Math.floor(save.notes);
    nodes.albumText.textContent = `${save.album.length}/12`;
    const diamondBalance = wallet().diamonds;
    nodes.diamondText.textContent = diamondBalance;
    selectedStageIndex = Math.max(0, zones.findIndex((zone) => zone.id === selectedZone));
    ensureStageWindow(selectedStageIndex);
    syncStageCards();
    nodes.gearGrid.innerHTML = gear.map((item) => {
      const level = Number(save.gear[item.id]) || 1;
      const cost = item.cost * level;
      const maxed = level >= 5;
      return `
        <div class="gear-card">
          <img src="${item.img}" alt="" />
          <div><strong>${localizedValue(item.name)}</strong><span>${formatLevel(level)}</span><small class="gear-effect">${t(item.effectKey)}</small></div>
          <button class="secondary-btn" data-gear="${item.id}" type="button">${maxed ? t("max") : `${t("upgrade")} ${cost}`}</button>
        </div>
      `;
    }).join("");
    nodes.gearGrid.querySelectorAll("[data-gear]").forEach((button) => {
      const item = gear.find((candidate) => candidate.id === button.dataset.gear);
      const level = Number(save.gear[button.dataset.gear]) || 1;
      const balance = Math.floor(save.notes);
      const cost = item.cost * level;
      const label = level >= 5
        ? t("gearMaxLabel", { gear: localizedValue(item.name), level })
        : balance >= cost
          ? t("gearUpgradeLabel", { gear: localizedValue(item.name), beforeLevel: level, afterLevel: level + 1, cost, before: balance, after: balance - cost })
          : t("gearUpgradeNeedLabel", { gear: localizedValue(item.name), beforeLevel: level, afterLevel: level + 1, cost, balance, need: cost - balance });
      button.setAttribute("aria-label", label);
    });
    const lureUnavailable = !save.lureReady && diamondPurchasePending !== "lure" && diamondBalance < lureCost;
    const sonarUnavailable = !save.sonarReady && diamondPurchasePending !== "sonar" && diamondBalance < sonarCost;
    nodes.lureBtn.textContent = save.lureReady ? t("lureReady") : diamondPurchasePending === "lure" ? t("confirmLure", { before:diamondBalance, after:Math.max(0,diamondBalance-lureCost) }) : lureUnavailable ? t("needDiamonds", { cost: lureCost }) : t("buyLure", { cost: lureCost });
    nodes.sonarPrepBtn.textContent = save.sonarReady ? t("sonarReady") : diamondPurchasePending === "sonar" ? t("confirmSonar", { before:diamondBalance, after:Math.max(0,diamondBalance-sonarCost) }) : sonarUnavailable ? t("needDiamonds", { cost: sonarCost }) : t("buySonar", { cost: sonarCost });
    nodes.lureBtn.disabled = lureUnavailable;
    nodes.sonarPrepBtn.disabled = sonarUnavailable;
    nodes.lureBtn.setAttribute("aria-label", save.lureReady ? t("lureReady") : diamondPurchasePending === "lure" ? t("lureConfirmLabel", { before:diamondBalance, after:Math.max(0,diamondBalance-lureCost) }) : t("lureBuyLabel", { balance:diamondBalance }));
    nodes.sonarPrepBtn.setAttribute("aria-label", save.sonarReady ? t("sonarReady") : diamondPurchasePending === "sonar" ? t("sonarConfirmLabel", { before:diamondBalance, after:Math.max(0,diamondBalance-sonarCost) }) : t("sonarBuyLabel", { balance:diamondBalance }));
    nodes.lureBtn.classList.toggle("is-confirming", diamondPurchasePending === "lure");
    nodes.sonarPrepBtn.classList.toggle("is-confirming", diamondPurchasePending === "sonar");
    if (state === "stage") window.requestAnimationFrame(() => positionStageRail(selectedStageIndex));
  }

  function stageWindowLimit() {
    return Math.max(0, zones.length - Math.min(STAGE_CARD_POOL_SIZE, zones.length));
  }

  function desiredStageWindow(index) {
    return Math.max(0, Math.min(stageWindowLimit(), index - Math.floor(Math.min(STAGE_CARD_POOL_SIZE, zones.length) / 2)));
  }

  function createStageCard(poolIndex) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "zone-card stage-card";
    button.dataset.wpStagePoolNode = String(poolIndex + 1);
    button.innerHTML = '<span class="zone-art"><img alt="" /></span><strong></strong><span></span>';
    return button;
  }

  function bindStageCard(button, index) {
    const zone = zones[index];
    const locked = index + 1 > save.unlockedZone;
    const missionLabel = t("mission", { stage: zone.stage });
    const ruleLabel = missionRuleLabel(zone);
    button.dataset.zone = zone.id;
    button.dataset.stage = String(zone.stage);
    button.dataset.stageIndex = String(index);
    button.setAttribute("aria-posinset", String(index + 1));
    button.setAttribute("aria-setsize", String(zones.length));
    button.setAttribute("aria-disabled", String(locked));
    button.setAttribute("aria-keyshortcuts", "ArrowLeft ArrowRight Home End");
    button.setAttribute("aria-label", `${missionLabel} · ${missionName(zone)} · ${zone.checkpoint ? t("bossMission") : ruleLabel} · ${locked ? t("locked") : `${t("goal")} ${zone.goal}`}`);
    button.className = `zone-card stage-card region-${zone.region}${zone.checkpoint ? " is-checkpoint" : ""}${locked ? " is-locked" : ""}`;
    const image = button.querySelector("img");
    image.src = zone.img;
    button.querySelector("strong").textContent = `${missionLabel} · ${missionName(zone)}`;
    button.querySelector(":scope > span:last-child").textContent = locked ? t("locked") : `${zone.checkpoint ? t("bossMission") : ruleLabel} · ${t("goal")} ${zone.goal}`;
  }

  function syncStageCards() {
    stageCardPool.forEach((button) => {
      const index = Number(button.dataset.stageIndex);
      bindStageCard(button, index);
      const selected = index === selectedStageIndex;
      button.tabIndex = selected ? 0 : -1;
      button.classList.toggle("is-selected", selected);
      button.classList.toggle("wp-stage-centered", selected);
      button.setAttribute("aria-current", selected ? "step" : "false");
    });
  }

  function buildStageCardPool() {
    const count = Math.min(STAGE_CARD_POOL_SIZE, zones.length);
    nodes.zoneRow.replaceChildren();
    stageWindowStart = desiredStageWindow(selectedStageIndex);
    stageCardPool = Array.from({ length: count }, (_, offset) => {
      const button = createStageCard(offset);
      bindStageCard(button, stageWindowStart + offset);
      nodes.zoneRow.append(button);
      return button;
    });
    nodes.zoneRow.dataset.wpStageVirtualized = "bounded-recycle";
    nodes.zoneRow.dataset.wpStagePoolSize = String(count);
    nodes.zoneRow.dataset.wpStageTotal = String(zones.length);
    nodes.zoneRow.dataset.wpStageWindowStart = String(stageWindowStart);
    nodes.zoneRow.dataset.wpStageWindowEnd = String(stageWindowStart + count - 1);
  }

  function moveStageWindow(targetStart) {
    const target = Math.max(0, Math.min(stageWindowLimit(), targetStart));
    let recycledCount = 0;
    while (stageWindowStart < target) {
      const recycled = nodes.zoneRow.firstElementChild;
      const anchor = recycled?.nextElementSibling;
      const before = anchor?.getBoundingClientRect().left;
      stageWindowStart += 1;
      nodes.zoneRow.append(recycled);
      bindStageCard(recycled, stageWindowStart + stageCardPool.length - 1);
      recycledCount += 1;
      const after = anchor?.getBoundingClientRect().left;
      if (Number.isFinite(before) && Number.isFinite(after)) nodes.zoneRow.scrollLeft += after - before;
    }
    while (stageWindowStart > target) {
      const recycled = nodes.zoneRow.lastElementChild;
      const anchor = recycled?.previousElementSibling;
      const before = anchor?.getBoundingClientRect().left;
      stageWindowStart -= 1;
      nodes.zoneRow.prepend(recycled);
      bindStageCard(recycled, stageWindowStart);
      recycledCount += 1;
      const after = anchor?.getBoundingClientRect().left;
      if (Number.isFinite(before) && Number.isFinite(after)) nodes.zoneRow.scrollLeft += after - before;
    }
    stageCardPool = [...nodes.zoneRow.children];
    nodes.zoneRow.dataset.wpStageWindowStart = String(stageWindowStart);
    nodes.zoneRow.dataset.wpStageWindowEnd = String(stageWindowStart + stageCardPool.length - 1);
    if (recycledCount) nodes.zoneRow.dataset.wpStageRecycleCount = String(Number(nodes.zoneRow.dataset.wpStageRecycleCount || 0) + recycledCount);
    return recycledCount;
  }

  function ensureStageWindow(index) {
    if (!stageCardPool.length) buildStageCardPool();
    moveStageWindow(desiredStageWindow(index));
  }

  function stageRailGeometry() {
    const cards = [...nodes.zoneRow.children];
    const railRect = nodes.zoneRow.getBoundingClientRect();
    const first = cards[0]?.getBoundingClientRect();
    const second = cards[1]?.getBoundingClientRect();
    const delta = first && second ? (second.left + second.width / 2) - (first.left + first.width / 2) : 0;
    const fallback = (first?.width || 184) + (parseFloat(getComputedStyle(nodes.zoneRow).columnGap) || 12);
    return { center: railRect.left + railRect.width / 2, pitch: Math.abs(delta) || fallback, orientation: Math.sign(delta) || 1 };
  }

  function nearestStageCard() {
    const geometry = stageRailGeometry();
    return stageCardPool.reduce((nearest, card) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - geometry.center);
      return !nearest || distance < nearest.distance ? { card, distance } : nearest;
    }, null)?.card || null;
  }

  function currentStageLogicalPosition() {
    const card = nearestStageCard();
    if (!card) return selectedStageIndex;
    const index = Number(card.dataset.stageIndex);
    const rect = card.getBoundingClientRect();
    const geometry = stageRailGeometry();
    return Math.max(0, Math.min(zones.length - 1, index + (geometry.center - (rect.left + rect.width / 2)) / (geometry.pitch * geometry.orientation)));
  }

  function positionStageRail(logicalPosition) {
    const logical = Math.max(0, Math.min(zones.length - 1, logicalPosition));
    const anchorIndex = Math.round(logical);
    const recycled = moveStageWindow(desiredStageWindow(anchorIndex));
    if (recycled) syncStageCards();
    const card = nodes.zoneRow.querySelector(`[data-stage-index="${anchorIndex}"]`);
    if (!card) return logical;
    card.scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" });
    const geometry = stageRailGeometry();
    const fraction = logical - anchorIndex;
    if (Math.abs(fraction) > 0.0001) nodes.zoneRow.scrollLeft += fraction * geometry.orientation * geometry.pitch;
    nodes.zoneRow.dataset.wpStageDragLogical = logical.toFixed(4);
    return logical;
  }

  function selectStage(index, restoreFocus = false) {
    selectedStageIndex = Math.max(0, Math.min(zones.length - 1, index));
    selectedZone = zones[selectedStageIndex].id;
    ensureStageWindow(selectedStageIndex);
    positionStageRail(selectedStageIndex);
    syncStageCards();
    if (restoreFocus) nodes.zoneRow.querySelector(`[data-stage-index="${selectedStageIndex}"]`)?.focus({ preventScroll: true });
  }

  function installVirtualStageDrag() {
    const rail = nodes.zoneRow;
    if (rail.dataset.wpStageVirtualDrag === "true") return;
    rail.dataset.wpStageVirtualDrag = "true";
    rail.dataset.wpStageCenterObserver = "manual";
    let pointerId = null;
    let startX = 0;
    let lastX = 0;
    let dragLogical = 0;
    let moved = false;
    let suppressClick = false;
    const restore = () => {
      rail.style.removeProperty("scroll-behavior");
      rail.style.removeProperty("scroll-snap-type");
      delete rail.dataset.wpStageSettling;
      delete rail.dataset.wpDragDown;
      rail.classList.remove("wp-stage-dragging");
    };
    cancelStageRailInteraction = () => {
      pointerId = null;
      cancelAnimationFrame(stageSettleRaf);
      stageSettleRaf = 0;
      restore();
    };
    rail.addEventListener("pointerdown", (event) => {
      if (event.isPrimary === false || (event.button !== undefined && event.button !== 0)) return;
      cancelAnimationFrame(stageSettleRaf);
      stageSettleRaf = 0;
      pointerId = event.pointerId;
      startX = lastX = event.clientX;
      dragLogical = currentStageLogicalPosition();
      moved = false;
      rail.style.setProperty("scroll-behavior", "auto", "important");
      rail.style.setProperty("scroll-snap-type", "none", "important");
      rail.dataset.wpDragDown = "1";
      event.stopImmediatePropagation();
    }, true);
    document.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;
      const delta = event.clientX - lastX;
      lastX = event.clientX;
      if (!moved && Math.abs(event.clientX - startX) > 4) {
        moved = true;
        rail.classList.add("wp-stage-dragging");
      }
      if (moved) {
        const rect = rail.getBoundingClientRect();
        const scale = rect.width ? rail.clientWidth / rect.width : 1;
        if (event.cancelable) event.preventDefault();
        dragLogical = positionStageRail(dragLogical - delta * scale / stageRailGeometry().pitch);
      }
      event.stopImmediatePropagation();
    }, true);
    const finish = (event) => {
      if (pointerId === null || (event.pointerId !== undefined && event.pointerId !== pointerId)) return;
      pointerId = null;
      delete rail.dataset.wpDragDown;
      rail.classList.remove("wp-stage-dragging");
      if (moved) {
        if (event.cancelable) event.preventDefault();
        const from = dragLogical;
        const index = Math.max(0, Math.min(zones.length - 1, Math.round(from)));
        const start = performance.now();
        selectedStageIndex = index;
        selectedZone = zones[index].id;
        syncStageCards();
        positionStageRail(from);
        rail.dataset.wpStageSettling = "true";
        const settle = (now) => {
          const progress = Math.max(0, Math.min(1, (now - start) / 340));
          const eased = progress * progress * (3 - 2 * progress);
          positionStageRail(from + (index - from) * eased);
          if (progress < 1 && state === "stage") stageSettleRaf = requestAnimationFrame(settle);
          else {
            stageSettleRaf = 0;
            if (state === "stage") {
              positionStageRail(index);
              syncStageCards();
            }
            restore();
          }
        };
        stageSettleRaf = requestAnimationFrame(settle);
        suppressClick = true;
        setTimeout(() => { suppressClick = false; }, 0);
      } else restore();
      moved = false;
      event.stopImmediatePropagation();
    };
    document.addEventListener("pointerup", finish, true);
    document.addEventListener("pointercancel", finish, true);
    rail.addEventListener("click", (event) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
  }

  function focusSelectedZone() {
    positionStageRail(selectedStageIndex);
    nodes.zoneRow.querySelector(".zone-card.is-selected")?.focus({ preventScroll: true });
  }

  function moveZoneFocus(event) {
    const current = event.target?.closest?.(".zone-card");
    if (!current) return;
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const currentIndex = Number(current.dataset.stageIndex);
    let nextIndex = currentIndex;
    if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = zones.length - 1;
    else {
      const rtl = document.documentElement.dir === "rtl";
      const direction = event.key === "ArrowLeft" ? (rtl ? 1 : -1) : (rtl ? -1 : 1);
      nextIndex = Math.max(0, Math.min(zones.length - 1, currentIndex + direction));
    }
    event.preventDefault();
    selectStage(nextIndex, true);
  }

  function focusMainAction() {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (state === "main" && !nodes.mainPanel.classList.contains("is-hidden")) {
          nodes.startBtn.focus({ preventScroll: true });
        }
      });
    });
  }

  function updateSonarButton() {
    const canScan = Boolean(run && !run.finished && run.phase === "aim" && run.sonarReady);
    const hasLockedScan = Boolean(run && !run.finished && run.phase === "aim" && !run.sonarReady && run.hookFish);
    nodes.sonarBtn.disabled = !canScan;
    nodes.sonarBtn.setAttribute("aria-disabled", String(!canScan));
    nodes.sonarBtn.setAttribute("aria-label", canScan ? t("sonarDecision") : hasLockedScan ? sonarScanMessage(run.hookFish) : t("sonarAria"));
  }

  function showPanel(which) {
    if (which !== "stage") cancelStageRailInteraction();
    if (which !== "game") {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    nodes.mainPanel.classList.toggle("is-hidden", which !== "main");
    nodes.stagePanel.classList.toggle("is-hidden", which !== "stage");
    nodes.gamePanel.classList.toggle("is-hidden", which !== "game" && which !== "result");
    nodes.resultPanel.classList.toggle("is-hidden", which !== "result");
    const resultOpen = which === "result";
    [...nodes.gamePanel.querySelectorAll(":scope > .battle-shell > .hud-row, :scope > .battle-shell > .play-frame, :scope > .battle-shell > .catch-hud, :scope > .battle-shell > .tension-panel")].forEach((node) => {
      node.toggleAttribute("inert", resultOpen);
      node.setAttribute("aria-hidden", String(resultOpen));
    });
    document.body.classList.toggle("reef-fisher-playing", which === "game" || resultOpen);
    document.body.classList.toggle("reef-fisher-stage", which === "stage");
    document.body.classList.toggle("reef-fisher-result", which === "result");
    const guideIsReady = Boolean(document.querySelector(".game-page-info"));
    document.documentElement.classList.toggle("has-game-page-info", which === "main" && guideIsReady);
    document.body.classList.toggle("has-game-page-info", which === "main" && guideIsReady);
    document.body.dataset.reefState = which;
    document.documentElement.dataset.reefState = which;
    const sceneDetail = { screen: which === "game" || which === "result" ? "battle" : which };
    window.dispatchEvent(new CustomEvent("weightplay:shell-sync", { detail: sceneDetail }));
    window.dispatchEvent(new CustomEvent("weightplay:stage-sync", { detail: sceneDetail }));
    window.dispatchEvent(new CustomEvent("weightplay:battle-sync", { detail: sceneDetail }));
  }

  function battleDecisionLayers() {
    return [...nodes.gamePanel.querySelectorAll(":scope > .battle-shell > .hud-row, :scope > .battle-shell > .play-frame, :scope > .battle-shell > .catch-hud, :scope > .battle-shell > .tension-panel")];
  }

  function restartFishingLoop() {
    if (backgroundSuspended || document.hidden || leaveDecisionOpen || state !== "game" || !run || run.finished) return;
    cancelAnimationFrame(raf);
    lastTime = performance.now();
    raf = requestAnimationFrame(tick);
  }

  function setLeaveDecision(open, { restoreFocus = true } = {}) {
    if (open) {
      if (state !== "game" || !run || run.finished) return;
      cancelFishingInput();
      leaveDecisionOpen = true;
      cancelAnimationFrame(raf);
      nodes.leaveCopy.textContent = t("leaveCopy", {
        stage: run.zone.stage,
        catches: run.catches,
        goal: run.zone.goal,
        time: Math.max(0, Math.ceil(run.time)),
      });
      nodes.leavePanel.classList.remove("is-hidden");
      battleDecisionLayers().forEach((node) => {
        node.inert = true;
        node.setAttribute("aria-hidden", "true");
      });
      requestAnimationFrame(() => nodes.leaveKeepBtn.focus({ preventScroll: true }));
      return;
    }
    const wasOpen = leaveDecisionOpen;
    leaveDecisionOpen = false;
    nodes.leavePanel.classList.add("is-hidden");
    battleDecisionLayers().forEach((node) => {
      node.inert = false;
      node.setAttribute("aria-hidden", "false");
    });
    restartFishingLoop();
    if (wasOpen && restoreFocus) requestAnimationFrame(() => nodes.mapBtn.focus({ preventScroll: true }));
  }

  function focusPanel(node) {
    if (node === nodes.gamePanel && window.matchMedia?.("(max-width: 760px)").matches) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }
    const align = () => {
      const top = Math.max(0, node.getBoundingClientRect().top + window.scrollY - 6);
      window.scrollTo({ top, behavior: "auto" });
    };
    align();
    window.requestAnimationFrame(align);
    window.setTimeout(align, 80);
  }

  async function startRun(startInputType = "unknown", entryAction = "stage_card") {
    cancelFishingInput();
    clearDiamondPurchaseConfirmation();
    configureArena();
    const zone = zones.find((z) => z.id === selectedZone) || zones[0];
    run = {
      zone,
      time: expeditionSeconds + Math.max(0, (Number(save.gear.boat) || 1) - 1) * 5,
      duration: expeditionSeconds + Math.max(0, (Number(save.gear.boat) || 1) - 1) * 5,
      catches: 0,
      newFish: 0,
      notes: 0,
      score: 0,
      catchValue: 0,
      finalScore: 0,
      catchLog: [],
      phase: "aim",
      castPower: 0,
      castDir: 1,
      tension: 50,
      fishPower: 0,
      initialFishPower: 0,
      fishTimer: 0,
      struggle: 0,
      hookFish: null,
      splashTimer: 0,
      sonarPulse: 0,
      catchToastTimer: 0,
      tensionSafe: true,
      reelElapsed: 0,
      safeReelTime: 0,
      dangerReelTime: 0,
      reelControlAge: Infinity,
      lastGustCycle: 0,
      bossShieldOpen: true,
      hazardFlash: 0,
      lastCatch: null,
      lastInputType: inputType(startInputType),
      finished: false,
      lureUsed: save.lureReady,
      lureCharges: save.lureReady ? 1 : 0,
      sonarReady: save.sonarReady,
      lineBreakRecoveryVisible: false,
    };
    save.lureReady = false;
    save.sonarReady = false;
    save.selectedZone = selectedZone;
    saveProgress();
    renderBattleMissionBriefing(zone);
    nodes.goalText.textContent = `${run.catches}/${zone.goal}`;
    nodes.hintText.textContent = t("castHint");
    nodes.catchToast.classList.add("is-hidden");
    nodes.catchToast.innerHTML = "";
    updateCatchHud();
    updateTensionGuide();
    updateSonarButton();
    state = "game";
    showPanel("game");
    focusPanel(nodes.gamePanel);
    if (!assetsReady) {
      nodes.startBtn.disabled = true;
      nodes.retryBtn.disabled = true;
      await ensureImagesReady();
      nodes.loadingPanel.classList.add("is-hidden");
      nodes.startBtn.disabled = false;
      nodes.retryBtn.disabled = false;
      focusPanel(nodes.gamePanel);
    }
    if (returnedToMain) {
      track("return_session", { source: "main_start", entry_action: entryAction, input_type: run.lastInputType });
      returnedToMain = false;
    }
    track("game_start", { zone: zone.id, stage: zone.stage, entry_action: entryAction, input_type: run.lastInputType });
    playSound("start");
    canvas.focus({ preventScroll: true });
    restartFishingLoop();
  }

  function syncResultActions(won) {
    const zoneIndex = run ? zones.indexOf(run.zone) : -1;
    const hasNextMission = Boolean(won && zoneIndex >= 0 && zoneIndex < zones.length - 1);
    nodes.nextZoneBtn.classList.remove("is-hidden");
    nodes.nextZoneBtn.disabled = !hasNextMission;
    const primary = hasNextMission ? nodes.nextZoneBtn : (won ? nodes.resultMenuBtn : nodes.retryBtn);
    for (const button of [nodes.nextZoneBtn, nodes.retryBtn, nodes.resultMenuBtn]) {
      button.classList.toggle("primary-btn", button === primary);
      button.classList.toggle("secondary-btn", button !== primary);
    }
    return primary;
  }

  function commitResultDecision(action) {
    if (resultDecisionCommitted || state !== "result" || nodes.resultPanel.classList.contains("is-hidden")) return;
    resultDecisionCommitted = true;
    for (const button of [nodes.nextZoneBtn, nodes.retryBtn, nodes.resultMenuBtn]) button.disabled = true;
    return action();
  }

  function finishRun(won) {
    if (!run || run.finished) return;
    cancelFishingInput();
    run.finished = true;
    state = "result";
    const bonus = won ? 12 : 5;
    const earned = run.catches * (4 + save.gear.bait) + bonus;
    run.notes += earned;
    run.finalScore = run.score + run.catches * 20 + (won ? 100 : 25);
    save.notes += run.notes;
    save.bestCatches = Math.max(save.bestCatches, run.catches);
    if (won) save.unlockedZone = Math.min(zones.length, Math.max(save.unlockedZone, zones.indexOf(run.zone) + 2));
    saveProgress();
    nodes.resultTitle.textContent = won ? t("expeditionWin") : t("expeditionFail");
    nodes.resultText.textContent = t("result", { catches: run.catches, newFish: run.newFish, notes: run.notes });
    renderResultSummary();
    const totalReelTime = run.safeReelTime + run.dangerReelTime;
    const mostlySafe = totalReelTime >= 0.75 && run.safeReelTime / totalReelTime >= 0.7;
    nodes.resultAdviceText.textContent = won ? t("nextCastWin") : t(mostlySafe ? "nextCastFailSafe" : "nextCastFail");
    const dangerPercent = totalReelTime > 0
      ? Math.round((run.dangerReelTime / totalReelTime) * 100)
      : 0;
    const buildCueKey = totalReelTime < 0.75
      ? "resultBuildCueNoCatch"
      : dangerPercent >= 30
        ? "resultBuildCueDanger"
        : "resultBuildCueSafe";
    nodes.resultBuildCue.textContent = t(buildCueKey, { notes: run.notes, percent: dangerPercent });
    const zoneIndex = zones.indexOf(run.zone);
    const nextVariation = won
      ? zones.slice(zoneIndex + 1).find((zone) => zone.checkpoint || zone.rule !== run.zone.rule)
      : null;
    if (nextVariation) {
      const special = nextVariation.checkpoint && nextVariation.boss
        ? `${t("bossMission")}: ${missionName(nextVariation.boss)} · `
        : "";
      const previewLines = [t("nextMissionPreview", {
        mission: t("mission", { stage: nextVariation.stage }),
        name: missionName(nextVariation),
        special,
        rule: missionRuleLabel(nextVariation),
        goal: nextVariation.goal,
      })];
      const firstSeaRuleChange = won && zoneIndex === 0
        ? zones.slice(zoneIndex + 1).find((zone) => zone.rule !== run.zone.rule)
        : null;
      if (firstSeaRuleChange) {
        const immediateNextMission = zones[zoneIndex + 1];
        if (immediateNextMission) {
          previewLines.unshift(`${t("nextMission")}: ${t("mission", { stage: immediateNextMission.stage })} · ${missionRuleLabel(immediateNextMission)}`);
        }
        previewLines.push(t("nextMissionPreview", {
          mission: t("mission", { stage: firstSeaRuleChange.stage }),
          name: missionName(firstSeaRuleChange),
          special: "",
          rule: missionRuleLabel(firstSeaRuleChange),
          goal: firstSeaRuleChange.goal,
        }));
      }
      nodes.resultMissionPreview.replaceChildren();
      previewLines.forEach((line, index) => {
        if (index) nodes.resultMissionPreview.append(document.createElement("br"));
        const span = document.createElement("span");
        span.textContent = line;
        nodes.resultMissionPreview.append(span);
      });
      nodes.resultMissionPreview.classList.remove("is-hidden");
    } else {
      nodes.resultMissionPreview.replaceChildren();
      nodes.resultMissionPreview.classList.add("is-hidden");
    }
    resultDecisionCommitted = false;
    for (const button of [nodes.nextZoneBtn, nodes.retryBtn, nodes.resultMenuBtn]) button.disabled = false;
    const primaryResultAction = syncResultActions(won);
    showPanel("result");
    focusPanel(nodes.resultPanel);
    nodes.resultPanel.scrollTop = 0;
    renderMenu();
    primaryResultAction.focus({ preventScroll: true });
    window.requestAnimationFrame(() => primaryResultAction.focus({ preventScroll: true }));
    playSound(won ? "win" : "wrong");
    track("result", { zone: run.zone.id, stage: run.zone.stage, outcome: won ? "win" : "loss", catches: run.catches, newFish: run.newFish, notes: run.notes, input_type: run.lastInputType });
    track("game_complete", { zone: run.zone.id, stage: run.zone.stage, outcome: won ? "win" : "loss", won, catches: run.catches, newFish: run.newFish, notes: run.notes, score: run.finalScore, input_type: run.lastInputType });
  }

  function pickHookFish() {
    if (run.zone.boss && run.catches >= run.zone.goal - 1) return bossFishForZone(run.zone);
    const regionIndex = Math.floor((run.zone.stage - 1) / 5);
    const poolLimit = Math.min(12, ([4, 6, 8, 10, 11, 12][regionIndex] || 12) + Math.max(0, (Number(save.gear.scan) || 1) - 1));
    let pool = fish.slice(0, poolLimit).filter((item) => item.id !== run.zone.boss?.fishId);
    if (run.zone.school === "steady") pool = pool.filter((item) => item.behavior === "steady");
    if (run.zone.school === "dart") pool = pool.filter((item) => item.behavior === "dart");
    if (run.zone.school === "heavy") pool = pool.filter((item) => item.behavior === "heavy");
    if (!pool.length) pool = fish.slice(0, poolLimit).filter((item) => item.id !== run.zone.boss?.fishId);
    if (run.lureCharges > 0) {
      run.lureCharges -= 1;
      const rarePool = fish.filter((item) => item.rare && item.id !== run.zone.boss?.fishId);
      return rarePool[Math.floor(Math.random() * rarePool.length)] || pool[0] || fish[0];
    }
    return pool[Math.floor(Math.random() * pool.length)] || fish[0];
  }

  function bossFishForZone(zone) {
    const definition = zone?.boss;
    const base = fish.find((item) => item.id === definition?.fishId) || fish.at(-1);
    if (!definition || !base) return base || fish[0];
    return {
      ...base,
      name:definition.name,
      rare:true,
      boss:true,
      bossProfile:definition.profile,
      bossRule:definition.rule,
      points:base.points + 90,
      notes:base.notes + 10,
    };
  }

  function hookFish() {
    if (!run.hookFish) run.hookFish = pickHookFish();
    const behavior = fishBehavior(run.hookFish);
    run.phase = "reel";
    run.tension = 50;
    run.struggle = 0;
    run.fishPower = (45 + Math.random() * 40) * behavior.endurance;
    run.initialFishPower = run.fishPower;
    run.reelElapsed = 0;
    run.reelControlAge = Infinity;
    run.lastGustCycle = 0;
    run.bossShieldOpen = true;
    run.hazardFlash = 0;
    run.fishTimer = 1.2;
    run.splashTimer = 0.8;
    run.tensionSafe = true;
    nodes.hintText.textContent = hookedHint(run.hookFish);
    updateTensionGuide();
    updateSonarButton();
    track("fish_hooked", { fish: run.hookFish.id, zone: run.zone.id, stage: run.zone.stage, input_type: run.lastInputType });
    playSound("hit");
  }

  function landFish() {
    const caught = run.hookFish;
    const id = caught.id;
    const isNew = !save.album.includes(id);
    if (isNew) {
      save.album.push(id);
      run.newFish += 1;
      track("album_unlock", { fish: id, zone: run.zone.id, stage: run.zone.stage, input_type: run.lastInputType });
    }
    const points = caught.points + Math.round(run.zone.speed * 10) + (isNew ? 25 : 0);
    const notes = caught.notes + Math.floor(save.gear.bait / 2);
    run.score += points;
    run.catchValue += notes;
    run.catchLog.push({ id, points, notes, isNew });
    run.lastCatch = { id, points, notes, isNew };
    run.catches += 1;
    run.notes += notes;
    run.phase = "aim";
    run.hookFish = null;
    run.splashTimer = 0.8;
    run.catchToastTimer = 1.7;
    showCatchToast(caught, points, notes, isNew);
    updateCatchHud();
    nodes.goalText.textContent = `${run.catches}/${run.zone.goal}`;
    nodes.hintText.textContent = `${t("landed")} ${localizedValue(caught.name)} +${points}`;
    updateTensionGuide();
    updateSonarButton();
    if (run.catches >= run.zone.goal) finishRun(true);
    else playSound(isNew ? "upgrade" : "success");
  }

  function fishById(id) {
    return fish.find((item) => item.id === id) || fish[0];
  }

  function isFishSheetBackground(data, offset) {
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    const a = data[offset + 3];
    return a <= 22 || (r > 185 && b > 145 && g < 105 && r - g > 90 && b - g > 70);
  }

  function fishFrameCrop(img, item, frame = 1) {
    const cols = 3;
    const rows = 6;
    const frameIndex = Math.max(0, Math.min(cols - 1, frame));
    const frameH = img.height / rows;
    const row = {
      sx: 0,
      sy: Math.round(item.sy * frameH),
      sw: Math.round(img.width),
      sh: Math.round(frameH),
    };
    const cacheKey = `${item.sheet}:${item.sy}:${frameIndex}:${img.width}x${img.height}`;
    if (fishCropCache[cacheKey]) return fishCropCache[cacheKey];
    const fallback = fishFrameCrops[item.sheet]?.[item.sy]?.[frameIndex];
    try {
      const probe = document.createElement("canvas");
      probe.width = row.sw;
      probe.height = row.sh;
      const probeCtx = probe.getContext("2d", { willReadFrequently: true });
      probeCtx.clearRect(0, 0, probe.width, probe.height);
      probeCtx.drawImage(img, row.sx, row.sy, row.sw, row.sh, 0, 0, row.sw, row.sh);
      const data = probeCtx.getImageData(0, 0, row.sw, row.sh).data;
      const activeColumns = [];
      for (let x = 0; x < row.sw; x += 1) {
        let activePixels = 0;
        for (let y = 0; y < row.sh; y += 1) {
          const offset = (y * row.sw + x) * 4;
          if (!isFishSheetBackground(data, offset)) activePixels += 1;
        }
        activeColumns[x] = activePixels > 1;
      }
      const clusters = [];
      let start = -1;
      let gap = 0;
      const maxGap = Math.max(16, Math.round(row.sw * 0.012));
      activeColumns.forEach((active, x) => {
        if (active) {
          if (start < 0) start = x;
          gap = 0;
        } else if (start >= 0) {
          gap += 1;
          if (gap > maxGap) {
            const end = x - gap;
            if (end - start > 28) clusters.push({ start, end });
            start = -1;
            gap = 0;
          }
        }
      });
      if (start >= 0) clusters.push({ start, end: row.sw - 1 });
      const expectedCenter = ((frameIndex + 0.5) * row.sw) / cols;
      const cluster = clusters
        .slice()
        .sort((a, b) => Math.abs((a.start + a.end) / 2 - expectedCenter) - Math.abs((b.start + b.end) / 2 - expectedCenter))[0];
      if (cluster) {
        let minY = row.sh;
        let maxY = -1;
        for (let y = 0; y < row.sh; y += 1) {
          for (let x = cluster.start; x <= cluster.end; x += 1) {
            const offset = (y * row.sw + x) * 4;
            if (!isFishSheetBackground(data, offset)) {
              minY = Math.min(minY, y);
              maxY = Math.max(maxY, y);
            }
          }
        }
        const pad = Math.max(6, Math.round(Math.min(row.sw / cols, row.sh) * 0.04));
        const x = Math.max(0, cluster.start - pad);
        const y = Math.max(0, minY - pad);
        const right = Math.min(row.sw, cluster.end + pad + 1);
        const bottom = Math.min(row.sh, maxY + pad + 1);
        fishCropCache[cacheKey] = {
          sx: row.sx + x,
          sy: row.sy + y,
          sw: Math.max(1, right - x),
          sh: Math.max(1, bottom - y),
          cellSx: row.sx,
          cellSy: row.sy,
          cellSw: row.sw,
          cellSh: row.sh,
        };
        return fishCropCache[cacheKey];
      }
    } catch {
      // Canvas sampling can fail on unexpected asset states; fall back to the bounded atlas cell.
    }
    fishCropCache[cacheKey] = fallback
      ? { sx: fallback.x, sy: fallback.y, sw: fallback.w, sh: fallback.h, cellSx: row.sx, cellSy: row.sy, cellSw: row.sw, cellSh: row.sh }
      : { ...row, cellSx: row.sx, cellSy: row.sy, cellSw: row.sw, cellSh: row.sh };
    return fishCropCache[cacheKey];
  }

  function fishFrameCanvas(item, frame = 1) {
    const img = images[item.sheet];
    if (!img) return null;
    const frameIndex = Math.max(0, Math.min(2, frame));
    const crop = fishFrameCrop(img, item, frameIndex);
    const cacheKey = `${item.sheet}:${item.sy}:${frameIndex}:${crop.sx},${crop.sy},${crop.sw},${crop.sh}`;
    if (fishFrameCanvasCache[cacheKey]) return fishFrameCanvasCache[cacheKey];
    const frameCanvas = document.createElement("canvas");
    frameCanvas.width = Math.max(1, Math.round(crop.sw));
    frameCanvas.height = Math.max(1, Math.round(crop.sh));
    const frameCtx = frameCanvas.getContext("2d", { willReadFrequently: true });
    frameCtx.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
    frameCtx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, frameCanvas.width, frameCanvas.height);
    try {
      const pixels = frameCtx.getImageData(0, 0, frameCanvas.width, frameCanvas.height);
      for (let i = 0; i < pixels.data.length; i += 4) {
        if (isFishSheetBackground(pixels.data, i)) {
          pixels.data[i + 3] = 0;
        }
      }
      frameCtx.putImageData(pixels, 0, 0);
    } catch {
      // If pixel reads are unavailable, the bounded crop still prevents adjacent atlas frames.
    }
    fishFrameCanvasCache[cacheKey] = frameCanvas;
    return frameCanvas;
  }

  function fishThumbUrl(item, frame = 1) {
    const cacheKey = `${item.sheet}:${item.sy}:${frame}`;
    if (fishThumbCache[cacheKey]) return fishThumbCache[cacheKey];
    const frameCanvas = fishFrameCanvas(item, frame);
    if (!frameCanvas) return assetPaths[item.sheet];
    const thumb = document.createElement("canvas");
    thumb.width = 180;
    thumb.height = Math.max(96, Math.round((thumb.width * frameCanvas.height) / frameCanvas.width));
    const thumbCtx = thumb.getContext("2d");
    thumbCtx.clearRect(0, 0, thumb.width, thumb.height);
    thumbCtx.drawImage(frameCanvas, 0, 0, thumb.width, thumb.height);
    fishThumbCache[cacheKey] = thumb.toDataURL("image/png");
    return fishThumbCache[cacheKey];
  }

  function fishFrameStyle(item) {
    return [
      `background-image:url("${fishThumbUrl(item)}")`,
      "background-size:contain",
      "background-repeat:no-repeat",
      "background-position:center",
    ].join(";");
  }

  function showCatchToast(item, points, notes, isNew) {
    nodes.catchToast.innerHTML = `
      <strong>${t("catchToast", { fish: localizedValue(item.name) })}</strong>
      <span>${t("catchToastMeta", { points, notes, newTag: isNew ? t("newTag") : "" })}</span>
    `;
    nodes.catchToast.classList.remove("is-hidden");
  }

  function updateCatchHud() {
    if (!run) return;
    nodes.runScoreText.textContent = Math.floor(run.score);
    nodes.runValueText.textContent = Math.floor(run.notes);
    if (!run.lastCatch) {
      nodes.lastCatchText.textContent = t("noCatchYet");
      nodes.lastCatchText.classList.remove("is-new-catch");
      return;
    }
    const item = fishById(run.lastCatch.id);
    const rarity = item.rare ? t("rareFish") : t("commonFish");
    nodes.lastCatchText.innerHTML = `
      <span class="last-catch-name">${localizedValue(item.name)}</span>
      <small>${t("catchHudMeta", {
        rarity,
        points: run.lastCatch.points,
        notes: run.lastCatch.notes,
        newTag: run.lastCatch.isNew ? t("newTag") : "",
      })}</small>
    `;
    nodes.lastCatchText.classList.toggle("is-new-catch", run.lastCatch.isNew);
  }

  function renderResultSummary() {
    nodes.scoreText.textContent = Math.floor(run.finalScore || run.score);
    nodes.catchValueText.textContent = Math.floor(run.notes);
    nodes.newAlbumText.textContent = run.newFish;
    if (!run.catchLog.length) {
      nodes.catchList.innerHTML = `<p class="empty-catch">${t("noCatch")}</p>`;
      return;
    }
    nodes.catchList.innerHTML = run.catchLog.map((entry) => {
      const item = fishById(entry.id);
      const rarity = item.rare ? t("rareFish") : t("commonFish");
      return `
        <div class="catch-item">
          <div class="catch-thumb" style="${fishFrameStyle(item)}" aria-hidden="true"></div>
          <div>
            <strong>${localizedValue(item.name)}</strong>
            <span>${rarity}${entry.isNew ? t("newTag") : ""}</span>
          </div>
          <div class="catch-points">+${entry.points}</div>
        </div>
      `;
    }).join("");
  }

  function lineBreak() {
    run.phase = "aim";
    run.hookFish = null;
    run.splashTimer = 1;
    run.lineBreakRecoveryVisible = true;
    nodes.hintText.textContent = lineBreakRecoveryText();
    updateTensionGuide();
    updateSonarButton();
    playSound("wrong");
    track("line_break", { zone: run.zone.id, stage: run.zone.stage, input_type: run.lastInputType });
  }

  function missionTensionWindow(zone, elapsed = 0, gearValues = save.gear) {
    const baseMin = 38 - (Number(gearValues?.rod) || 1);
    const baseMax = 62 + (Number(gearValues?.line) || 1);
    let center = (baseMin + baseMax) / 2;
    let halfWidth = (baseMax - baseMin) / 2;
    if (zone?.rule === "drift") center += Math.sin(elapsed * 0.82) * 10;
    if (zone?.rule === "snag") halfWidth -= 1 + (Math.sin(elapsed * 1.35) + 1) * 4;
    if (zone?.rule === "tide") center += Math.floor(elapsed / 4) % 2 === 0 ? 11 : -11;
    if (zone?.rule === "storm") halfWidth -= 3;
    if (zone?.rule === "abyss") {
      center += Math.sin(elapsed * 1.05) * 9;
      halfWidth -= 5;
    }
    if (zone?.boss?.profile === "kelp") center += Math.sin(elapsed * 1.25) * 4;
    halfWidth = Math.max(7, halfWidth);
    center = Math.max(halfWidth + 2, Math.min(98 - halfWidth, center));
    return { safeMin:center - halfWidth, safeMax:center + halfWidth };
  }

  function tensionRange() {
    if (!run) return { safeMin: 38, safeMax: 62, safe: true };
    const elapsed = Math.max(0, (run.duration || expeditionSeconds) - run.time);
    const { safeMin, safeMax } = missionTensionWindow(run.zone, elapsed);
    return {
      safeMin,
      safeMax,
      safe: run.tension >= safeMin && run.tension <= safeMax,
    };
  }

  function fishBehavior(item) {
    const profiles = {
      steady: {
        label: "behaviorSteady",
        hint: "behaviorSteadyHint",
        endurance: 0.9,
        pull(now, zoneSpeed) {
          return Math.sin(now / 460) * zoneSpeed * 18;
        },
      },
      dart: {
        label: "behaviorDart",
        hint: "behaviorDartHint",
        endurance: 1,
        pull(now, zoneSpeed) {
          const direction = Math.floor(now / 1250) % 2 === 0 ? 1 : -1;
          const burstPhase = (now % 1250) / 1250;
          const burst = burstPhase > 0.72 ? direction * zoneSpeed * 24 : 0;
          return Math.sin(now / 330) * zoneSpeed * 17 + burst;
        },
      },
      heavy: {
        label: "behaviorHeavy",
        hint: "behaviorHeavyHint",
        endurance: 1.25,
        pull(now, zoneSpeed) {
          const direction = Math.floor(now / 2100) % 2 === 0 ? 1 : -1;
          return direction * zoneSpeed * 13 + Math.sin(now / 620) * zoneSpeed * 12;
        },
      },
      crown: {
        label: "bossMission", hint: "behaviorSteadyHint", endurance: 1.45,
        pull(now, zoneSpeed) { return Math.sin(now / 420) * zoneSpeed * 21 + Math.sin(now / 1050) * 9; },
      },
      kelp: {
        label: "bossMission", hint: "behaviorHeavyHint", endurance: 1.6,
        pull(now, zoneSpeed) { return Math.sin(now / 690) * zoneSpeed * 23 + Math.sin(now / 190) * 5; },
      },
      coral: {
        label: "bossMission", hint: "behaviorDartHint", endurance: 1.7,
        pull(now, zoneSpeed) { return (Math.floor(now / 900) % 2 ? 1 : -1) * zoneSpeed * 18 + Math.sin(now / 260) * 8; },
      },
      moon: {
        label: "bossMission", hint: "behaviorDartHint", endurance: 1.8,
        pull(now, zoneSpeed) { const feint = Math.floor(now / 620) % 3 === 2 ? -1 : 1; return feint * Math.sin(now / 230) * zoneSpeed * 27; },
      },
      storm: {
        label: "bossMission", hint: "behaviorHeavyHint", endurance: 1.9,
        pull(now, zoneSpeed) { return Math.sin(now / 330) * zoneSpeed * 25 + Math.sin(now / 95) * 5; },
      },
      abyss: {
        label: "bossMission", hint: "behaviorHeavyHint", endurance: 2.15,
        pull(now, zoneSpeed) { return Math.sin(now / 370) * zoneSpeed * 28 + (Math.floor(now / 1150) % 2 ? 10 : -10); },
      },
    };
    return profiles[item?.bossProfile] || profiles[item?.behavior] || profiles.steady;
  }

  function hookedHint(item) {
    if (item?.boss) return t("bossHooked", { fish:localizedValue(item.name), rule:localizedValue(item.bossRule) });
    const behavior = fishBehavior(item);
    return t("hookedBehavior", {
      behavior: t(behavior.label),
      hint: t(behavior.hint),
    });
  }

  function sonarScanMessage(item) {
    const behavior = fishBehavior(item);
    return t("sonarScan", {
      fish: localizedValue(item.name),
      rarity: item.rare ? t("rareFish") : t("commonFish"),
      behavior: t(behavior.label),
    });
  }

  function updateCastMeter() {
    const power = Math.round(run?.phase === "charging" ? run.castPower : 0);
    nodes.castFill.style.width = `${power}%`;
    nodes.castMeter.id = "castMeter";
    nodes.castMeter.removeAttribute("aria-hidden");
    nodes.castMeter.setAttribute("role", "progressbar");
    nodes.castMeter.setAttribute("aria-label", t("castHint"));
    nodes.castMeter.setAttribute("aria-valuemin", "0");
    nodes.castMeter.setAttribute("aria-valuemax", "100");
    nodes.castMeter.setAttribute("aria-valuenow", String(power));
    nodes.castMeter.setAttribute("aria-valuetext", `${power}% · ${run?.phase === "charging" ? t("charging") : t("castHint")}`);
  }

  function updateTensionGuide() {
    updateCastMeter();
    const range = tensionRange();
    nodes.safeBand.style.left = `${range.safeMin}%`;
    nodes.safeBand.style.width = `${range.safeMax - range.safeMin}%`;
    nodes.tensionLane.classList.toggle("is-active", Boolean(run && run.phase === "reel"));
    nodes.tensionLane.classList.toggle("is-safe", Boolean(run && run.phase === "reel" && range.safe));
    nodes.tensionLane.classList.toggle("is-danger", Boolean(run && run.phase === "reel" && !range.safe));
    const tensionValue = Math.round(run?.tension ?? 50);
    const tensionState = tensionValue < range.safeMin ? t("tensionLow") : tensionValue > range.safeMax ? t("tensionHigh") : t("tensionSafe");
    nodes.tensionLane.setAttribute("aria-valuenow", String(tensionValue));
    nodes.tensionLane.setAttribute("aria-valuetext", `${tensionValue}% - ${tensionState}`);
    const hasSonarLock = Boolean(run && run.phase === "aim" && run.hookFish && !run.sonarReady);
    if (hasSonarLock) nodes.tensionStatus.textContent = t("sonarStatus", { fish: localizedValue(run.hookFish.name) });
    else if (!run || run.phase === "aim") nodes.tensionStatus.textContent = t("tensionStatusAim");
    else if (run.phase === "charging" || run.phase === "cast") nodes.tensionStatus.textContent = t("tensionStatusCharging");
    else if (run.phase === "reel") {
      const initialPower = Math.max(1, Number(run.initialFishPower) || Number(run.fishPower) || 1);
      const progress = Math.max(0, Math.min(100, Math.round((1 - run.fishPower / initialPower) * 100)));
      const tensionCopy = range.safe ? t("tensionStatusSafe") : t("tensionStatusDanger");
      nodes.tensionStatus.textContent = `${tensionCopy} · ${t("landingProgress", { progress })}`;
    }
    else nodes.tensionStatus.textContent = t("tensionStatusHooked");
    if (hasSonarLock) nodes.tensionCoach.textContent = sonarScanMessage(run.hookFish);
    else if (!run || run.phase === "aim") nodes.tensionCoach.textContent = t("tensionCoachAim");
    else if (run.hookFish?.boss && ["coral", "abyss"].includes(run.hookFish.bossProfile)) nodes.tensionCoach.textContent = t(run.bossShieldOpen ? "bossShieldOpen" : "bossShieldClosed");
    else if (run.phase === "reel") nodes.tensionCoach.textContent = range.safe ? t("tensionCoachSafe") : t("tensionCoachDanger");
    else nodes.tensionCoach.textContent = t("tensionCoachReel");
  }

  function update(dt) {
    if (state !== "game" || !run || run.finished) return;
    run.time -= dt;
    if (run.time <= 0) {
      finishRun(run.catches >= run.zone.goal);
      return;
    }
    nodes.timeText.textContent = Math.max(0, Math.ceil(run.time));
    nodes.goalText.textContent = `${run.catches}/${run.zone.goal}`;

    if (run.phase === "charging") {
      run.castPower += dt * run.castDir * 62;
      if (run.castPower >= 100) {
        run.castPower = 100;
        run.castDir = -1;
      }
      if (run.castPower <= 0) {
        run.castPower = 0;
        run.castDir = 1;
      }
    }

    if (run.phase === "cast") {
      run.fishTimer -= dt;
      if (run.fishTimer <= 0) hookFish();
    }

    if (run.phase === "reel") {
      run.reelElapsed += dt;
      const pointerReeling = pointer.down && pointer.source !== "keyboard";
      const keyboardReeling = pointer.source === "keyboard" && pointer.keyboardHeld;
      if (pointerReeling || keyboardReeling) run.reelControlAge = 0;
      else run.reelControlAge += dt;
      const gearControl = save.gear.reel * 0.4 + save.gear.line * 0.28;
      const target = pointer.down ? Math.max(0, Math.min(100, pointer.tensionPct)) : 50;
      const behavior = fishBehavior(run.hookFish);
      const pull = behavior.pull(run.reelElapsed * 1000, run.zone.speed) + (run.hookFish.rare ? 6 : 0);
      run.tension += (target - run.tension) * dt * (1.4 + gearControl) + pull * dt;
      let warningPlayedThisStep = false;
      if (["storm", "abyss"].includes(run.zone.rule)) {
        const gustCycle = Math.floor(run.reelElapsed / 3);
        if (gustCycle > run.lastGustCycle) {
          run.lastGustCycle = gustCycle;
          run.tension += (gustCycle % 2 ? 1 : -1) * (run.zone.rule === "abyss" ? 18 : 13);
          run.hazardFlash = 1.1;
          playSound("wallHit");
          warningPlayedThisStep = true;
        }
      }
      run.tension = Math.max(0, Math.min(100, run.tension));
      const { safe } = tensionRange();
      if (safe) run.safeReelTime += dt;
      else run.dangerReelTime += dt;
      if (!safe && run.tensionSafe && !warningPlayedThisStep) playSound("wallHit");
      run.tensionSafe = safe;
      if (!safe) run.struggle += dt;
      else run.struggle = Math.max(0, run.struggle - dt * 1.8);
      const shieldProfile = ["coral", "abyss"].includes(run.hookFish?.bossProfile);
      run.bossShieldOpen = !shieldProfile || Math.floor(run.reelElapsed / 2) % 2 === 0;
      const baseProgress = 9 + save.gear.rod * 1.7 + save.gear.bait * 0.9;
      // SAFE is the player-visible success condition. Requiring an additional
      // hidden recent-input pulse made correct steady control appear inert.
      const normalProgress = safe ? baseProgress : 0;
      const bossProgress = run.hookFish?.boss ? (normalProgress && run.bossShieldOpen ? baseProgress : 0) : normalProgress;
      run.fishPower -= dt * bossProgress;
      if (run.struggle > 2.2) lineBreak();
      if (run.fishPower <= 0 && run.phase === "reel") landFish();
    }

    run.splashTimer = Math.max(0, run.splashTimer - dt);
    run.sonarPulse = Math.max(0, run.sonarPulse - dt);
    run.catchToastTimer = Math.max(0, run.catchToastTimer - dt);
    run.hazardFlash = Math.max(0, run.hazardFlash - dt);
    if (run.catchToastTimer <= 0) nodes.catchToast.classList.add("is-hidden");
    nodes.tensionMarker.style.left = `${run.tension}%`;
    updateTensionGuide();
  }

  function drawSpriteSheet(img, cols, rows, index, x, y, w, h) {
    if (!img || !img.width) return;
    const sx = (index % cols) * (img.width / cols);
    const sy = Math.floor(index / cols) * (img.height / rows);
    ctx.drawImage(img, sx, sy, img.width / cols, img.height / rows, x, y, w, h);
  }

  function drawFishSprite(fishData, x, y, w, h, facing = "right") {
    const swimFrame = Math.floor(performance.now() / 180) % 3;
    const frameCanvas = fishFrameCanvas(fishData, swimFrame);
    if (!frameCanvas) return;
    const bob = Math.sin(performance.now() / 240) * 3;
    const ratio = frameCanvas.width / frameCanvas.height;
    let drawW = w;
    let drawH = w / ratio;
    if (drawH > h) {
      drawH = h;
      drawW = h * ratio;
    }
    const drawX = x + (w - drawW) / 2;
    const drawY = y + bob + (h - drawH) / 2;
    if (facing === "left") {
      ctx.save();
      ctx.translate(drawX + drawW, drawY);
      ctx.scale(-1, 1);
      ctx.drawImage(frameCanvas, 0, 0, drawW, drawH);
      ctx.restore();
      return;
    }
    ctx.drawImage(frameCanvas, drawX, drawY, drawW, drawH);
  }

  function configureArena() {
    // The shared logical Battle canvas gives the water scene a 366 x 450
    // track. Match that portrait ratio internally so the scene fills without
    // stretching fish or creating a false band below the water.
    H = 1180;
    canvas.width = W;
    canvas.height = H;
    canvas.style.setProperty("--reef-arena-ratio", `${W} / ${H}`);
  }

  function drawImageCover(img, x, y, width, height) {
    if (!img?.width || !img?.height) return;
    const scale = Math.max(width / img.width, height / img.height);
    const sourceWidth = width / scale;
    const sourceHeight = height / scale;
    const sourceX = (img.width - sourceWidth) / 2;
    const sourceY = (img.height - sourceHeight) / 2;
    ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
  }

  function fishingVisual() {
    const t = performance.now() / 1000;
    if (run?.phase === "cast") {
      return { bobberX: 570 + Math.sin(t * 1.4) * 42, bobberY: 288 + Math.cos(t * 1.1) * 18 };
    }
    if (run?.phase === "reel" && run.hookFish) {
      const bobberX = 476 + Math.sin(t * 1.4) * 80;
      const bobberY = 240 + Math.cos(t * 1.1) * 45;
      const fishWidth = run.hookFish.boss ? 224 : run.hookFish.rare ? 174 : 156;
      const fishHeight = run.hookFish.boss ? 116 : run.hookFish.rare ? 90 : 76;
      const fishX = bobberX + fishWidth * (0.5 - hookedFishMouthInset);
      return {
        bobberX,
        bobberY,
        fishX,
        fishY: bobberY + 6,
        fishWidth,
        fishHeight,
        fishFacing: hookedFishFacing,
        mouthX: fishX - fishWidth * (0.5 - hookedFishMouthInset),
      };
    }
    return null;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawImageCover(images.bg, 0, 0, W, H);
    ctx.fillStyle = "rgba(2, 38, 48, 0.12)";
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.translate(0, (H - 540) / 2);

    if (images.boat) ctx.drawImage(images.boat, 34, 288, 196, 116);
    drawSpriteSheet(images.otter, 3, 2, run && run.phase === "reel" ? 2 : 0, 42, 236, 132, 132);

    if (run) {
      if (run.phase === "aim" || run.phase === "charging") {
        const powerY = 430 - (run.castPower / 100) * 270;
        ctx.strokeStyle = "rgba(255,255,255,0.75)";
        ctx.lineWidth = 5;
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(172, 320);
        ctx.quadraticCurveTo(390, powerY, 600, powerY + 40);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      const visual = fishingVisual();
      if (visual) {
        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(172, 320);
        ctx.quadraticCurveTo((172 + visual.bobberX) / 2, Math.min(218, visual.bobberY - 54), visual.bobberX, visual.bobberY);
        ctx.stroke();
        ctx.fillStyle = "rgba(255, 255, 255, 0.96)";
        ctx.beginPath();
        ctx.arc(visual.bobberX, visual.bobberY, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ff8a3d";
        ctx.beginPath();
        ctx.arc(visual.bobberX, visual.bobberY + 2, 9, 0, Math.PI);
        ctx.fill();
      }

      if (run.phase === "cast") {
        // The cast visual is drawn by fishingVisual so the line always ends at its float.
      }

      if (run.phase === "reel") {
        const f = run.hookFish;
        if (f && visual) {
          drawFishSprite(f, visual.fishX - visual.fishWidth / 2, visual.fishY - visual.fishHeight / 2, visual.fishWidth, visual.fishHeight, visual.fishFacing);
          if (f.rare || run.sonarPulse > 0) drawSpriteSheet(images.shimmer, 1, 1, 0, visual.fishX - 18, visual.fishY - 18, 150, 110);
          if (f.boss) {
            ctx.save();
            ctx.fillStyle = run.bossShieldOpen ? "rgba(7, 76, 67, .9)" : "rgba(92, 34, 18, .92)";
            ctx.strokeStyle = run.bossShieldOpen ? "#9fffd2" : "#ffd08a";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(354, 104, 350, 48, 16);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "#fff";
            ctx.font = "900 22px Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(localizedValue(f.name), 529, 128, 326);
            ctx.restore();
          }
        }
      }

      if (run.hazardFlash > 0) {
        ctx.fillStyle = `rgba(174, 226, 255, ${Math.min(.3, run.hazardFlash * .24)})`;
        ctx.fillRect(0, 0, W, 540);
      }

      if (run.splashTimer > 0) {
        drawSpriteSheet(images.splash, 1, 1, 0, 540, 312, 150, 120);
      }
      if (run.sonarPulse > 0) {
        drawSpriteSheet(images.sonar, 1, 1, 0, 360, 120, 270, 270);
      }
    }
    ctx.restore();
  }

  function updateVisibleElapsed(elapsed) {
    let remaining = Math.min(1, Math.max(0, elapsed));
    while (remaining > 0 && run && !run.finished) {
      const step = Math.min(0.05, remaining);
      update(step);
      remaining -= step;
    }
  }

  function tick(now) {
    raf = 0;
    if (backgroundSuspended || document.hidden || leaveDecisionOpen || state !== "game" || !run || run.finished) return;
    const elapsed = (now - lastTime) / 1000;
    lastTime = now;
    updateVisibleElapsed(elapsed);
    draw();
    raf = requestAnimationFrame(tick);
  }

  function startCharge(evt) {
    reclaimVisiblePlayerInteraction(evt);
    if (evt.isPrimary === false || (evt.button !== undefined && evt.button !== 0)) return;
    if (state !== "game" || !run) return;
    run.lineBreakRecoveryVisible = false;
    run.lastInputType = eventInputType(evt);
    if (run.phase === "charging" && pointer.down) {
      evt.preventDefault();
      if (pointer.source === "keyboard") releaseCast();
      else releaseCast({ pointerId: pointer.id });
      return;
    }
    if (run.phase !== "aim" && run.phase !== "reel") return;
    if (pointer.down && pointer.source !== "keyboard") return;
    pointer.id = Number.isFinite(evt.pointerId) ? evt.pointerId : null;
    try { evt.currentTarget?.setPointerCapture?.(evt.pointerId); } catch {}
    if (run.phase === "reel") {
      pointer.down = true;
      updatePointer(evt);
      nodes.hintText.textContent = hookedHint(run.hookFish);
      updateTensionGuide();
      return;
    }
    pointer.down = true;
    updatePointer(evt);
    run.phase = "charging";
    run.castPower = 0;
    run.castDir = 1;
    nodes.hintText.textContent = t("charging");
    updateTensionGuide();
    updateSonarButton();
  }

  function releaseCast(evt) {
    if (state !== "game" || !run) return;
    const pointerRelease = Number.isFinite(evt?.pointerId);
    if (pointerRelease && (!pointer.down || pointer.source === "keyboard" || pointer.id !== evt.pointerId)) return;
    if (!pointerRelease && pointer.source !== "keyboard") return;
    pointer.down = false;
    pointer.id = null;
    if (run.phase === "charging") {
      if (!run.hookFish) run.hookFish = pickHookFish();
      run.phase = "cast";
      run.fishTimer = Math.max(0.45, 1.45 - run.castPower / 100);
      updateTensionGuide();
      updateSonarButton();
      track("cast", { power: Math.round(run.castPower), zone: run.zone.id, stage: run.zone.stage, fish: run.hookFish.id, input_type: run.lastInputType });
      playSound("shoot");
    }
  }

  function cancelFishingInput(evt) {
    if (Number.isFinite(evt?.pointerId) && pointer.id !== evt.pointerId) return;
    pointer.down = false;
    pointer.id = null;
    pointer.source = "canvas";
    pointer.tensionPct = 50;
    pointer.keyboardHeld = false;
    if (state !== "game" || !run || run.phase !== "charging") return;
    run.phase = "aim";
    run.castPower = 0;
    run.castDir = 1;
    nodes.hintText.textContent = t("castHint");
    updateTensionGuide();
    updateSonarButton();
  }

  function startKeyboardCharge() {
    if (state !== "game" || !run || run.phase !== "aim") return;
    run.lineBreakRecoveryVisible = false;
    run.lastInputType = "keyboard";
    pointer.down = true;
    pointer.id = null;
    pointer.source = "keyboard";
    pointer.tensionPct = 50;
    run.phase = "charging";
    run.castPower = 0;
    run.castDir = 1;
    nodes.hintText.textContent = t("charging");
    updateTensionGuide();
    updateSonarButton();
  }

  function adjustKeyboardTension(delta) {
    if (state !== "game" || !run || run.phase !== "reel") return;
    run.lastInputType = "keyboard";
    pointer.down = true;
    pointer.id = null;
    pointer.source = "keyboard";
    pointer.keyboardHeld = true;
    pointer.tensionPct = Math.max(0, Math.min(100, pointer.tensionPct + delta));
    updateTensionGuide();
  }

  function handleFishingKeyDown(evt) {
    reclaimVisiblePlayerInteraction(evt);
    if (state !== "game" || !run) return;
    if (evt.code === "Space" && (run.phase === "aim" || (run.phase === "charging" && pointer.source === "keyboard"))) {
      evt.preventDefault();
      if (evt.repeat) return;
      if (run.phase === "aim") startKeyboardCharge();
      else releaseCast();
      return;
    }
    if (run.phase !== "reel") return;
    const step = evt.shiftKey ? 10 : 5;
    if (evt.key === "ArrowLeft") {
      evt.preventDefault();
      adjustKeyboardTension(-step);
    } else if (evt.key === "ArrowRight") {
      evt.preventDefault();
      adjustKeyboardTension(step);
    } else if (evt.key === "Home") {
      evt.preventDefault();
      adjustKeyboardTension(-100);
    } else if (evt.key === "End") {
      evt.preventDefault();
      adjustKeyboardTension(100);
    }
  }

  function handleFishingKeyUp(evt) {
    if (evt.key === "ArrowLeft" || evt.key === "ArrowRight") pointer.keyboardHeld = false;
    if (evt.code !== "Space" || state !== "game" || !run || run.phase !== "charging") return;
    evt.preventDefault();
    releaseCast();
  }

  function updatePointer(evt) {
    const point = evt.touches ? evt.touches[0] : evt;
    const rect = canvas.getBoundingClientRect();
    pointer.source = "canvas";
    pointer.x = point.clientX - rect.left;
    pointer.y = point.clientY - rect.top;
    pointer.tensionPct = Math.max(0, Math.min(100, (pointer.x / rect.width) * 100));
  }

  function updateLanePointer(evt) {
    const point = evt.touches ? evt.touches[0] : evt;
    const laneRect = nodes.tensionLane.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (point.clientX - laneRect.left) / laneRect.width));
    pointer.source = "lane";
    if (run) run.lastInputType = eventInputType(evt);
    pointer.tensionPct = pct * 100;
    pointer.x = pct * canvasRect.width;
    pointer.y = canvasRect.height * 0.86;
  }

  function clearDiamondPurchaseConfirmation(render = false) {
    window.clearTimeout(diamondConfirmTimer);
    diamondConfirmTimer = 0;
    diamondConfirmDueAt = 0;
    diamondConfirmRemaining = 0;
    diamondPurchasePending = "";
    if (render) renderMenu();
  }

  function expireDiamondPurchaseConfirmation() {
    diamondConfirmTimer = 0;
    diamondConfirmDueAt = 0;
    diamondConfirmRemaining = 0;
    if (!diamondPurchasePending) return;
    diamondPurchasePending = "";
    renderMenu();
  }

  function armDiamondPurchaseConfirmation(delay = 5000) {
    window.clearTimeout(diamondConfirmTimer);
    diamondConfirmRemaining = Math.max(0, Number(delay) || 0);
    if (!diamondConfirmRemaining) return expireDiamondPurchaseConfirmation();
    diamondConfirmDueAt = performance.now() + diamondConfirmRemaining;
    diamondConfirmTimer = window.setTimeout(expireDiamondPurchaseConfirmation, diamondConfirmRemaining);
  }

  function suspendDiamondPurchaseConfirmation() {
    if (!diamondPurchasePending || !diamondConfirmTimer) return;
    diamondConfirmRemaining = Math.max(0, diamondConfirmDueAt - performance.now());
    window.clearTimeout(diamondConfirmTimer);
    diamondConfirmTimer = 0;
    diamondConfirmDueAt = 0;
  }

  function resumeDiamondPurchaseConfirmation() {
    if (!diamondPurchasePending || diamondConfirmTimer || document.hidden) return;
    armDiamondPurchaseConfirmation(diamondConfirmRemaining);
  }

  function buyDiamondItem(type, actionInputType = "unknown") {
    const cost = type === "lure" ? lureCost : sonarCost;
    if ((type === "lure" && save.lureReady) || (type === "sonar" && save.sonarReady)) { clearDiamondPurchaseConfirmation(); return; }
    const balance = wallet().diamonds;
    if (balance < cost) {
      clearDiamondPurchaseConfirmation();
      renderMenu();
      nodes.hintText.textContent = t("needDiamonds", { cost });
      playSound("wrong");
      return;
    }
    if (diamondPurchasePending !== type) {
      clearDiamondPurchaseConfirmation();
      diamondPurchasePending = type;
      armDiamondPurchaseConfirmation(5000);
      renderMenu();
      return;
    }
    clearDiamondPurchaseConfirmation();
    if (!window.WeightPlayWallet || !window.WeightPlayWallet.spendDiamonds(cost)) {
      nodes.hintText.textContent = t("needDiamonds", { cost });
      playSound("wrong");
      return;
    }
    if (type === "lure") save.lureReady = true;
    else save.sonarReady = true;
    saveProgress();
    renderMenu();
    playSound("coin");
    track(type === "lure" ? "rare_lure_purchase" : "sonar_purchase", { cost, item: type, input_type: actionInputType });
  }

  function upgradeGear(id, restoreFocus = false, actionInputType = "unknown") {
    clearDiamondPurchaseConfirmation();
    const item = gear.find((g) => g.id === id);
    const level = Number(save.gear[id]) || 1;
    if (!item || level >= 5) return;
    const cost = item.cost * level;
    if (save.notes < cost) {
      playSound("wrong");
      return;
    }
    save.notes -= cost;
    save.gear[id] = level + 1;
    saveProgress();
    renderMenu();
    if (restoreFocus) restoreGearFocus(id);
    playSound("upgrade");
    track("gear_upgrade", { gear: id, level: level + 1, input_type: actionInputType });
  }

  function restoreGearFocus(id) {
    const focus = () => nodes.gearGrid.querySelector(`[data-gear="${id}"]`)?.focus({ preventScroll: true });
    focus();
    window.requestAnimationFrame(focus);
  }

  nodes.zoneRow.addEventListener("click", (evt) => {
    const btn = evt.target.closest("[data-zone]");
    if (!btn) return;
    const zone = zones.find((z) => z.id === btn.dataset.zone);
    const index = zones.indexOf(zone);
    if (index + 1 > save.unlockedZone) return;
    clearDiamondPurchaseConfirmation();
    selectedZone = zone.id;
    renderMenu();
    startRun(eventInputType(evt), "stage_card");
  });
  nodes.gearGrid.addEventListener("click", (evt) => {
    const btn = evt.target.closest("[data-gear]");
    if (!btn) return;
    const gearId = btn.dataset.gear;
    const restoreKeyboardFocus = evt.detail === 0;
    upgradeGear(gearId, restoreKeyboardFocus, eventInputType(evt));
  });
  nodes.gearGrid.addEventListener("keydown", (event) => {
    const btn = event.target.closest("[data-gear]");
    if (!btn) return;
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      if (event.repeat) return;
      const gearId = btn.dataset.gear;
      upgradeGear(gearId, true, "keyboard");
      return;
    }
    if (event.repeat && event.key === " ") event.preventDefault();
  }, true);
  nodes.startBtn.addEventListener("click", () => {
    playSound("click");
    state = "stage";
    showPanel("stage");
    renderMenu();
    installVirtualStageDrag();
    focusPanel(nodes.stagePanel);
    focusSelectedZone();
  });
  nodes.stageBackBtn.addEventListener("click", (event) => {
    track("main_return", { from: state, input_type: eventInputType(event) });
    returnedToMain = true;
    clearDiamondPurchaseConfirmation();
    playSound("click");
    state = "main";
    showPanel("main");
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    focusMainAction();
  });
  nodes.mapBtn.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
  });
  nodes.mapBtn.addEventListener("click", () => {
    setLeaveDecision(true);
  });
  nodes.leaveKeepBtn.addEventListener("click", () => setLeaveDecision(false));
  nodes.leaveConfirmBtn.addEventListener("click", () => {
    playSound("click");
    setLeaveDecision(false, { restoreFocus: false });
    run = null;
    state = "stage";
    showPanel("stage");
    renderMenu();
    focusSelectedZone();
  });
  nodes.leavePanel.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setLeaveDecision(false);
      return;
    }
    if (event.key !== "Tab" || nodes.leavePanel.classList.contains("is-hidden")) return;
    const first = nodes.leaveKeepBtn;
    const last = nodes.leaveConfirmBtn;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  nodes.retryBtn.addEventListener("click", (event) => commitResultDecision(async () => {
    track("retry", { from: "result", zone: run?.zone?.id, stage: run?.zone?.stage, input_type: eventInputType(event) });
    await startRun(eventInputType(event), "retry");
  }));
  nodes.nextZoneBtn.addEventListener("click", (event) => commitResultDecision(async () => {
    const zoneIndex = run ? zones.indexOf(run.zone) : -1;
    const nextZone = zones[zoneIndex + 1];
    if (!nextZone || nextZone.stage > save.unlockedZone) return;
    track("next_mission", { from: "result", from_zone: run?.zone?.id, to_zone: nextZone.id, from_stage: run?.zone?.stage, to_stage: nextZone.stage, input_type: eventInputType(event) });
    selectedZone = nextZone.id;
    save.selectedZone = selectedZone;
    saveProgress();
    renderMenu();
    await startRun(eventInputType(event), "next_mission");
  }));
  nodes.resultMenuBtn.addEventListener("click", (event) => commitResultDecision(() => {
    track("stages", { from: "result", zone: run?.zone?.id, stage: run?.zone?.stage, input_type: eventInputType(event) });
    playSound("click");
    state = "stage";
    showPanel("stage");
    renderMenu();
    focusPanel(nodes.stagePanel);
    window.requestAnimationFrame(() => nodes.stagePanel.querySelector(".zone-card.is-selected:not(:disabled)")?.focus({ preventScroll: true }));
  }));
  nodes.resultPanel.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      return;
    }
    if (event.key !== "Tab" || nodes.resultPanel.classList.contains("is-hidden")) return;
    const actions = [nodes.resultMenuBtn, nodes.nextZoneBtn, nodes.retryBtn].filter((button) => !button.disabled && !button.classList.contains("is-hidden"));
    if (!actions.length) return;
    const currentIndex = actions.indexOf(document.activeElement);
    if (currentIndex < 0) return;
    event.preventDefault();
    const delta = event.shiftKey ? -1 : 1;
    actions[(currentIndex + delta + actions.length) % actions.length].focus({ preventScroll: true });
  });
  nodes.startBtn.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
  });
  nodes.zoneRow.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ") && event.target.closest("[data-zone]")) event.preventDefault();
    moveZoneFocus(event);
  });
  nodes.zoneRow.addEventListener("focusin", (event) => {
    const card = event.target?.closest?.(".zone-card");
    if (!card) return;
    selectedStageIndex = Number(card.dataset.stageIndex);
    selectedZone = zones[selectedStageIndex].id;
    syncStageCards();
  });
  for (const button of [nodes.lureBtn, nodes.sonarPrepBtn]) {
    button.addEventListener("keydown", (event) => {
      if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
    });
  }
  nodes.lureBtn.addEventListener("click", (event) => buyDiamondItem("lure", eventInputType(event)));
  nodes.sonarPrepBtn.addEventListener("click", (event) => buyDiamondItem("sonar", eventInputType(event)));
  nodes.sonarBtn.addEventListener("click", (event) => {
    if (!run || run.phase !== "aim" || !run.sonarReady) return;
    if (!run.hookFish) run.hookFish = pickHookFish();
    run.sonarReady = false;
    run.sonarPulse = 4;
    nodes.hintText.textContent = sonarScanMessage(run.hookFish);
    updateTensionGuide();
    updateSonarButton();
    canvas.focus({ preventScroll: true });
    playSound("coin");
    track("sonar_use", {
      zone: run.zone.id,
      fish: run.hookFish.id,
      rarity: run.hookFish.rare ? "rare" : "common",
      behavior: run.hookFish.behavior,
      input_type: eventInputType(event),
    });
  });
  nodes.localeSelect.addEventListener("change", () => {
    const requested = nodes.localeSelect.value;
    try {
      window.WonderI18n?.setLocale?.(requested);
    } catch {
      // Keep localization usable when shared persistence is unavailable.
    }
    locale = activeI18nLocale() || requested;
    writeStorage(localeKey, requested);
    applyLocale();
  });
  nodes.menuSoundBtn.addEventListener("click", () => {
    window.WonderSound?.unlock?.();
    const nextMuted = !Boolean(window.WonderSound?.isMuted?.());
    window.WonderSound?.setMuted?.(nextMuted);
    updateSoundButton();
    if (!nextMuted) playSound("click");
  });
  canvas.addEventListener("pointerdown", startCharge);
  canvas.addEventListener("pointermove", (evt) => {
    if (pointer.down && pointer.id === evt.pointerId) updatePointer(evt);
  });
  window.addEventListener("pointerup", releaseCast);
  window.addEventListener("pointercancel", cancelFishingInput);
  function suspendBackgroundFishing() {
    cancelFishingInput();
    suspendDiamondPurchaseConfirmation();
    if (backgroundSuspended) return;
    backgroundSuspended = true;
    cancelAnimationFrame(raf);
    raf = 0;
  }
  function resumeBackgroundFishing() {
    if (document.hidden) return;
    resumeDiamondPurchaseConfirmation();
    if (!backgroundSuspended) return;
    backgroundSuspended = false;
    restartFishingLoop();
  }
  function reclaimVisiblePlayerInteraction(evt) {
    if (document.hidden || evt?.isTrusted === false) return;
    resumeBackgroundFishing();
  }
  window.addEventListener("blur", () => {
    cancelFishingInput();
  });
  window.addEventListener("focus", () => {
    resumeBackgroundFishing();
  });
  window.addEventListener("pagehide", suspendBackgroundFishing);
  window.addEventListener("pageshow", resumeBackgroundFishing);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) suspendBackgroundFishing();
    else resumeBackgroundFishing();
  });
  canvas.addEventListener("pointercancel", cancelFishingInput);
  canvas.addEventListener("lostpointercapture", cancelFishingInput);
  nodes.tensionLane.addEventListener("pointerdown", (evt) => {
    reclaimVisiblePlayerInteraction(evt);
    if (evt.isPrimary === false || (evt.button !== undefined && evt.button !== 0)) return;
    if (pointer.down && pointer.source !== "keyboard") return;
    pointer.down = true;
    pointer.id = Number.isFinite(evt.pointerId) ? evt.pointerId : null;
    nodes.tensionLane.setPointerCapture?.(evt.pointerId);
    updateLanePointer(evt);
  });
  nodes.tensionLane.addEventListener("pointermove", (evt) => {
    if (pointer.down && pointer.id === evt.pointerId) updateLanePointer(evt);
  });
  nodes.tensionLane.addEventListener("pointercancel", cancelFishingInput);
  nodes.tensionLane.addEventListener("lostpointercapture", cancelFishingInput);
  [canvas, nodes.tensionLane].forEach((control) => {
    control.addEventListener("keydown", handleFishingKeyDown);
    control.addEventListener("keyup", handleFishingKeyUp);
    control.addEventListener("focusout", () => {
      if (pointer.source === "keyboard" && run?.phase === "charging") cancelFishingInput();
    });
  });

  if (isTestMode) {
    window.__AnimalReefFisherTest = {
      startRun,
      definitions() {
        return zones.map((zone) => ({
          stage:zone.stage,
          id:zone.id,
          region:zone.region,
          rule:zone.rule,
          school:zone.school,
          goal:zone.goal,
          checkpoint:zone.checkpoint,
          boss:zone.boss ? { fishId:zone.boss.fishId, profile:zone.boss.profile, name:zone.boss.name } : null,
        }));
      },
      tensionWindow(stage, elapsed) {
        const zone = zones[Math.max(0, Math.min(zones.length - 1, Number(stage) - 1))];
        return missionTensionWindow(zone, Number(elapsed) || 0, { rod:1, line:1 });
      },
      async selectMission(stage) {
        const index = Math.max(0, Math.min(zones.length - 1, Number(stage) - 1));
        save.unlockedZone = Math.max(save.unlockedZone, index + 1);
        selectedZone = zones[index].id;
        save.selectedZone = selectedZone;
        saveProgress();
        renderMenu();
        await startRun();
        return this.readState();
      },
      async prepareBoss(stage) {
        const index = Math.max(0, Math.min(zones.length - 1, Number(stage) - 1));
        if (!zones[index].boss) return null;
        await this.selectMission(index + 1);
        run.catches = Math.max(0, run.zone.goal - 1);
        run.hookFish = null;
        hookFish();
        return this.readState();
      },
      advance(seconds, tensionTarget = 50) {
        if (!run || run.finished) return this.readState();
        pointer.down = true;
        pointer.source = "test";
        pointer.tensionPct = Math.max(0, Math.min(100, Number(tensionTarget) || 50));
        let remaining = Math.max(0, Number(seconds) || 0);
        while (remaining > 0 && run && !run.finished) {
          const step = Math.min(0.05, remaining);
          update(step);
          remaining -= step;
        }
        pointer.down = false;
        pointer.source = "canvas";
        return this.readState();
      },
      advancePassive(seconds) {
        if (!run || run.finished) return this.readState();
        pointer.down = false;
        pointer.source = "canvas";
        pointer.keyboardHeld = false;
        let remaining = Math.max(0, Number(seconds) || 0);
        while (remaining > 0 && run && !run.finished) {
          const step = Math.min(0.05, remaining);
          update(step);
          remaining -= step;
        }
        return this.readState();
      },
      forceWin() {
        if (!run || run.finished) startRun();
        const firstFish = fish[0];
        if (!save.album.includes(firstFish.id)) {
          save.album.push(firstFish.id);
          run.newFish += 1;
        }
        const points = firstFish.points + 25;
        const notes = firstFish.notes;
        run.catchLog.push({ id: firstFish.id, points, notes, isNew: true });
        run.lastCatch = { id: firstFish.id, points, notes, isNew: true };
        run.score += points;
        run.catchValue += firstFish.notes;
        run.notes += firstFish.notes;
        updateCatchHud();
        run.catches = Math.max(run.zone.goal, 1);
        finishRun(true);
        return this.readState();
      },
      forceFail() {
        if (!run || run.finished) startRun();
        run.catches = 0;
        run.newFish = 0;
        finishRun(false);
        return this.readState();
      },
      setNotes(amount) {
        save.notes = Math.max(0, Number(amount) || 0);
        saveProgress();
        renderMenu();
        return this.readState();
      },
      readState() {
        return {
          state,
          selectedZone,
          save: JSON.parse(JSON.stringify(save)),
          run: run
            ? {
                phase: run.phase,
                time: run.time,
                castPower: run.castPower,
                tension: run.tension,
                fishPower: run.fishPower,
                initialFishPower: run.initialFishPower,
                struggle: run.struggle,
                catches: run.catches,
                newFish: run.newFish,
                score: run.score,
                finalScore: run.finalScore,
                notes: run.notes,
                catchLog: run.catchLog,
                finished: run.finished,
                zone: run.zone.id,
                stage: run.zone.stage,
                rule: run.zone.rule,
                checkpoint: run.zone.checkpoint,
                hookFish: run.hookFish ? run.hookFish.id : "",
                hookFishName: run.hookFish ? localizedValue(run.hookFish.name) : "",
                bossProfile: run.hookFish?.bossProfile || "",
                bossShieldOpen: run.bossShieldOpen,
                reelElapsed: run.reelElapsed,
                safeReelTime: run.safeReelTime,
                dangerReelTime: run.dangerReelTime,
                lastGustCycle: run.lastGustCycle,
                hazardFlash: run.hazardFlash,
                safeRange: tensionRange(),
                visibleFish: run.phase === "reel" && run.hookFish ? run.hookFish.id : "",
                sonarReady: run.sonarReady,
                sonarPulse: run.sonarPulse,
              }
            : null,
          pointer: { down: pointer.down, id: pointer.id, tensionPct: pointer.tensionPct, source: pointer.source, keyboardHeld: pointer.keyboardHeld },
          wallet: wallet(),
        };
      },
      readWallet() {
        return wallet();
      },
      readLineVisual() {
        return fishingVisual();
      },
      readFishSheetGrid() {
        const img = images.fishA || { width: 0, height: 0 };
        const sampleCrop = img.width ? fishFrameCrop(img, fish[0], 0) : null;
        const allCrops = fish.map((item) => ({
          id: item.id,
          sheet: item.sheet,
          sy: item.sy,
          frames: [0, 1, 2].map((frame) => fishFrameCrop(images[item.sheet] || img, item, frame)),
          thumbIsTrimmed: fishFrameStyle(item).includes("data:image/png"),
        }));
        return {
          cols: 3,
          rows: 6,
          safeCrop: sampleCrop,
          cropMode: "per-row-color-key-cluster",
          cropCount: allCrops.reduce((sum, item) => sum + item.frames.length, 0),
          sample: allCrops,
        };
      },
      forceHookForControlTest() {
        if (!run || run.finished) startRun();
        run.hookFish = fish[0];
        run.phase = "reel";
        run.tension = 50;
        run.struggle = 0;
        run.fishPower = 80;
        run.initialFishPower = 80;
        updateTensionGuide();
        return this.readState();
      },
      setReelPointerPercent(value) {
        pointer.down = true;
        pointer.source = "lane";
        pointer.tensionPct = Math.max(0, Math.min(100, Number(value) || 0));
        return { ...pointer };
      },
    };
  }

  function updateBattleScale() {
    const viewport = window.visualViewport;
    const visualWidth = Math.round(viewport?.width || 0);
    const visualHeight = Math.round(viewport?.height || 0);
    const useVisual = visualWidth > 0 && visualHeight > 0 && Math.abs(visualWidth - innerWidth) <= 2 && visualHeight <= innerHeight + 2;
    document.documentElement.style.setProperty("--reef-vw", `${useVisual ? visualWidth : innerWidth}px`);
    document.documentElement.style.setProperty("--reef-vh", `${useVisual ? visualHeight : innerHeight}px`);
    if (state === "game") configureArena();
  }

  updateBattleScale();
  window.addEventListener("resize", updateBattleScale);
  window.addEventListener("orientationchange", updateBattleScale);
  window.visualViewport?.addEventListener("resize", updateBattleScale, { passive: true });
  applyLocale();
  state = "main";
  showPanel("main");
  window.__ANIMAL_REEF_FISHER_BOOTED__ = true;
  window.__ANIMAL_REEF_FISHER_FIRST_SCREEN__ = {
    booted: true,
    title: document.title,
    language: locale,
    startText: nodes.startBtn.textContent.trim(),
    loadingHidden: false,
    menuHidden: nodes.mainPanel.classList.contains("is-hidden"),
  };
  track("game_view", { internalPrototype: false });
  preloadPromise = loadImages().then(() => {
    nodes.loadingPanel.classList.add("is-hidden");
    window.__ANIMAL_REEF_FISHER_FIRST_SCREEN__.loadingHidden = true;
  });
  if (!isTestMode) {
    nodes.loadingPanel.classList.add("is-hidden");
    window.__ANIMAL_REEF_FISHER_FIRST_SCREEN__.loadingHidden = true;
  }

  window.addEventListener("beforeunload", () => cancelAnimationFrame(raf));
})();
