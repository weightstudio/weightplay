(async () => {
  const reefAssetBase = new URL('.', document.currentScript.src);
  let fishing, ReefScene, bootDeadline;
  try {
    const modules = await Promise.race([
      Promise.all([import('./reef-simulation.js'), import('./reef-3d.js')]),
      new Promise((resolve, reject) => { bootDeadline = setTimeout(() => reject(new Error('reef-module-timeout')), 12000); }),
    ]);
    fishing = modules[0]; ReefScene = modules[1].ReefScene;
  } catch {
    showReefBootFailure();
    return;
  } finally { clearTimeout(bootDeadline); }
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((__wpMeasurement.screen) === "battle" && (__wpMeasurement.ended)) ? null : (__wpMeasurement.screen), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(state?.paused || state?.suspended || run?.paused || run?.suspended || backgroundSuspended), node: nodes.gamePanel,
    activityMode: "input", idleSeconds: 300
  });
  function __wpNotifyMeasurement() { try { window.WonderAnalytics?.game?.observeState(__wpReadMeasurement); } catch { /* Optional telemetry. */ } }
  // Explicit authored replay actions count only when a new round was actually created.
  function __wpReplayStart(action) {
    const previous = __wpMeasurement.roundKey, value = action();
    if (__wpMeasurement.roundKey !== previous) { __wpMeasurement.restart = true; __wpNotifyMeasurement(); }
    return value;
  }
  window.addEventListener("weightplay:analytics-ready", __wpNotifyMeasurement);
  __wpNotifyMeasurement();

  const stagePanel = document.getElementById("stagePanel");
  stagePanel?.setAttribute("data-wp-canvas-max-width", "920");
  stagePanel?.setAttribute("data-wp-stage-landscape-width", "760");
  stagePanel?.setAttribute("data-wp-stage-landscape-height", "334");
  document.querySelector(".battle-shell")?.setAttribute("data-wp-canvas-max-width", "920");

  const GAME_ID = "animal-reef-fisher";
  const GAME_VERSION = 28;
  const INTERFACE_VERSION = 9;
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
  let reefScene = null;
  let sceneRecoveryExtension = null;
  let sceneWebGLContext = null;
  let sceneRecoveryFailures = 0;
  let fishingState = null;
  let stageTab = 'map';
  let sceneError = false;
  let landingWon = false;
  let renderDelta = 0;
  let actionPointerId = null;
  let lanePointerId = null;
  let keyboardActionHeld = false;
  let sceneRecovering = false;
  const rewardMotions = new Set();
  const gearFeedbackAnimations = new Set();
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
    battleHelpBtn: $("battleHelpBtn"),
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

  text.ar = {
    ...text.en,
    title: "صياد الشعاب الحيواني",
    pageTitle: "صياد الشعاب الحيواني - لعبة صيد مجانية | WeightPlay",
    pageDescription: "أكمل 30 مهمة صيد في الشعاب، وتحكم في مناطق شد الخيط المتغيرة، وسجّل 12 مخلوقًا بحريًا، وطوّر ست معدات، واصطد ستة من حماة الشعاب.",
    language: "اللغة",
    backToLobby: "العودة إلى الردهة",
    back: "رجوع",
    reefZones: "مناطق الشعاب",
    gearUpgrades: "ترقيات المعدات",
    menuTitle: "خطّط لـ30 مهمة في الشعاب واصطد ستة من حماة الشعاب.",
    menuHint: "تحكم في قواعد شد الخيط المتغيرة، وسجّل 12 نوعًا، واكسب ملاحظات الشعاب، وطوّر ست معدات محليًا.",
    reefNotes: "ملاحظات الشعاب",
    album: "الألبوم",
    diamonds: "الماسات",
    startGame: "ابدأ اللعبة",
    soundOn: "الصوت: مفعّل",
    soundOff: "الصوت: متوقف",
    enableSound: "تفعيل الصوت",
    disableSound: "إيقاف الصوت",
    chooseZone: "اختر مهمة الشعاب",
    prepareGear: "جهّز المعدات",
    startExpedition: "ابدأ الرحلة",
    reefMap: "خريطة الشعاب",
    nextMission: "المهمة التالية",
    stages: "المراحل",
    nextStage: "المرحلة التالية",
    replay: "إعادة المحاولة",
    leaveTitle: "هل تريد مغادرة هذه الرحلة؟",
    leaveCopy: "المهمة {stage}: تم اصطياد {catches}/{goal} وبقيت {time} ثوانٍ. ستُفقد هذه الرحلة ومصيدها وأي طُعم أو سونار مجهّز؛ أما الألبوم والملاحظات والمعدات المحفوظة فستبقى آمنة.",
    keepFishing: "تابع الصيد",
    leaveExpedition: "مغادرة الرحلة",
    zone: "المنطقة",
    time: "الوقت",
    goal: "الهدف",
    retry: "حاول مرة أخرى",
    castHint: "اضغط باستمرار في البحر للشحن، ثم اترك الزر للإلقاء.",
    charging: "اترك الزر عندما تصل القوة إلى عمق الماء المطلوب.",
    hooked: "علقت السمكة. اسحب المقبض الأحمر أو حرّك على سطح البحر يمينًا ويسارًا، وأبقِ المؤشر داخل المنطقة الآمنة الخضراء.",
    hookedBehavior: "{behavior}: {hint} أبقِ المؤشر في المنطقة الآمنة.",
    behaviorSteady: "سمكة سباحتها ثابتة",
    behaviorSteadyHint: "اتبع السحب السلس بحركات صغيرة.",
    behaviorDart: "سمكة سريعة الاندفاع",
    behaviorDartHint: "راقب تغيّر الاتجاه السريع ثم عد برفق.",
    behaviorHeavy: "سمكة ذات سحب قوي",
    behaviorHeavyHint: "تسحب مدة أطول؛ تحلَّ بالصبر قرب الوسط.",
    tensionTitle: "شد الخيط",
    tensionLow: "رخو",
    tensionSafe: "آمن",
    tensionHigh: "مشدود",
    tensionMarker: "اسحب",
    playAreaAria: "منطقة لعب صياد الشعاب الحيواني. اضغط مفتاح المسافة للشحن واتركه للإلقاء؛ استخدم السهمين الأيسر والأيمن للتحكم في الشد.",
    tensionLaneAria: "مسار شد الخيط. استخدم السهمين الأيسر والأيمن للضبط.",
    sonarAria: "استخدم السونار",
    sonarDecision: "استخدم السونار المجهّز لكشف السمكة التالية وندرتها وسلوك سحبها وتثبيتها.",
    tensionCoachAim: "اضغط على البحر أو مفتاح المسافة للإلقاء. عند عضّ السمكة، اسحب المقبض الأحمر أو حرّك على البحر أو استخدم السهمين.",
    tensionCoachReel: "اسحب المقبض الأحمر أو حرّك على البحر أو استخدم السهمين للبقاء داخل المنطقة الآمنة الخضراء.",
    tensionCoachSafe: "جيد. تحرك برفق وابقَ في المنطقة الآمنة حتى تصل السمكة إلى الشاطئ.",
    tensionCoachDanger: "ارجع إلى المنطقة الآمنة الآن.",
    tensionStatusAim: "الخطوة 1: اضغط على البحر للشحن ثم اترك الزر للإلقاء.",
    tensionStatusCharging: "اترك الزر للإلقاء. تبدأ الخطوة 2 عندما تعضّ السمكة.",
    tensionStatusHooked: "الخطوة 2: اسحب المقبض الأحمر أو حرّك على البحر لإدخاله إلى المنطقة الآمنة.",
    tensionStatusSafe: "أنت داخل المنطقة الآمنة. حافظ على الثبات.",
    tensionStatusDanger: "أعد المقبض الأحمر إلى المنطقة الآمنة قبل انقطاع الخيط.",
    landingProgress: "تقدم الإنزال {progress}%",
    landed: "تم إنزال المصيد! واصل قبل انتهاء الوقت.",
    broke: "انقطع الخيط. بقي مؤشر الشد خارج المنطقة الآمنة مدة طويلة.",
    escaped: "هربت السمكة. ألقِ من جديد وأبقِ المؤشر قريبًا من الوسط.",
    sonarReady: "السونار جاهز لهذه الرحلة.",
    sonarScan: "السونار: {fish} · {rarity} · {behavior}. تم تثبيت الإلقاء التالي.",
    sonarStatus: "التالي: {fish}",
    needDiamonds: "تحتاج إلى {cost} من الماسات.",
    lureReady: "الطُعم النادر جاهز للرحلة التالية.",
    buyLure: "طُعم نادر {cost} ماسة",
    buySonar: "نبضة سونار {cost} ماسة",
    confirmLure: "تأكيد الطُعم · {before}→{after} ماسة",
    confirmSonar: "تأكيد السونار · {before}→{after} ماسة",
    lureBuyLabel: "يزيد الطُعم النادر فرصة ظهور علامة نادرة واحدة في الرحلة التالية. التكلفة 3 ماسات. الرصيد {balance}.",
    sonarBuyLabel: "تكشف نبضة السونار السمكة التالية وتثبتها قبل الإلقاء. التكلفة ماسَتان. الرصيد {balance}.",
    lureConfirmLabel: "تأكيد الطُعم النادر. أنفق 3 ماسات. الرصيد من {before} إلى {after}.",
    sonarConfirmLabel: "تأكيد نبضة السونار. أنفق ماسَتين. الرصيد من {before} إلى {after}.",
    sonar: "سونار",
    upgrade: "ترقية",
    max: "الحد الأقصى",
    gearUpgradeLabel: "ترقية {gear} من المستوى {beforeLevel} إلى {afterLevel}. التكلفة {cost} من ملاحظات الشعاب. الرصيد من {before} إلى {after}.",
    gearUpgradeNeedLabel: "{gear} في المستوى {beforeLevel}. المستوى {afterLevel} يكلف {cost} من ملاحظات الشعاب. الرصيد {balance}؛ تحتاج إلى {need} إضافية.",
    gearMaxLabel: "{gear} في المستوى {level}. هذا هو المستوى الأقصى.",
    locked: "مقفل",
    complete: "مكتمل",
    expeditionWin: "اكتملت الرحلة",
    expeditionFail: "انتهت الرحلة",
    result: "أنزلت {catches} من الأسماك، واكتشفت {newFish} إدخالات جديدة في الألبوم، وكسبت {notes} من ملاحظات الشعاب.",
    score: "النتيجة",
    catchValue: "قيمة المصيد",
    runScore: "نتيجة الجولة",
    runCatchValue: "ملاحظات الشعاب",
    lastCatch: "آخر مصيد",
    noCatchYet: "لم تصطد بعد",
    newAlbum: "إدخال جديد في الألبوم",
    catchSummary: "مصيد هذه الرحلة",
    catchToast: "اصطدت {fish}",
    catchToastMeta: "+{points} نقطة · +{notes} ملاحظة{newTag}",
    catchHudMeta: "{rarity} · +{points} نقطة · +{notes} ملاحظة{newTag}",
    newTag: " · جديد في الألبوم!",
    noCatch: "لم تُنزل أي سمكة بعد. جرّب إلقاءً أكثر أمانًا وأبقِ الخيط في المنطقة الآمنة.",
    rareFish: "نادرة",
    commonFish: "عادية",
    nextCastWin: "الإلقاء التالي: حافظ على نمط الشد الثابت نفسه، ثم استخدم إلقاءً أقوى عندما يضيق وقت المهمة.",
    nextCastFail: "الإلقاء التالي: أعد المؤشر إلى المنطقة الآمنة أبكر. إذا استمر بالخروج، طوّر تحكم البكرة أو متانة الخيط.",
    nextCastFailSafe: "الإلقاء التالي: بقي الشد آمنًا معظم الوقت. استخدم إلقاءً أقوى أو طوّر قوة الصنارة وجودة الطُعم لزيادة وقت الإنزال.",
    nextMissionPreview: "تغيّر الشعاب القادم: {mission} · {name}. {special}القاعدة: {rule}. الهدف: {goal} من المصيد.",
    mission: "المهمة {stage}",
    bossMission: "مواجهة حامي الشعاب",
    ruleOpen: "مياه مفتوحة · منطقة آمنة ثابتة",
    ruleDrift: "انجراف الأعشاب · المنطقة الآمنة تتحرك بسلاسة",
    ruleSnag: "تشابك المرجان · المنطقة الآمنة تضيق وتتنفس",
    ruleTide: "مدّ القمر · المنطقة الآمنة تبدّل جانبها",
    ruleStorm: "هبات العاصفة · اندفاعات على الخيط كل ثلاث ثوانٍ",
    ruleAbyss: "اختبار الهاوية · انجراف وضغط وهبات",
    bossHooked: "حامي الشعاب · {fish}: {rule}",
    bossShieldOpen: "مفتوح: ابقَ في المنطقة الآمنة لإلحاق الضرر بالحامي.",
    bossShieldClosed: "محمي: ابقَ في المنطقة الآمنة حتى ينفتح.",
    gearEffectRod: "يزداد تقدم الإنزال ما دامت السمكة داخل المنطقة الآمنة.",
    gearEffectReel: "يستجيب مؤشر الخيط أسرع لتحكمك في الشد.",
    gearEffectLine: "توسّع نطاق الأمان وتمنح هامشًا أكبر قبل انقطاع الخيط.",
    gearEffectBait: "تزيد تقدم الإنزال وملاحظات الشعاب المكتسبة من كل مصيد.",
    gearEffectBoat: "تضيف 5 ثوانٍ إلى كل رحلة لكل مستوى فوق المستوى الأول.",
    gearEffectScan: "توسّع مجموعة الأسماك المبكرة بنوع واحد لكل مستوى.",
    resultBuildCueDanger: "كسبت {notes} من ملاحظات الشعاب. كان نحو {percent}% من وقت التحكم بالخيط خارج المنطقة الآمنة؛ طوّر تحكم البكرة أو متانة الخيط لاحقًا.",
    resultBuildCueSafe: "كسبت {notes} من ملاحظات الشعاب. بقي الشد آمنًا معظم الوقت؛ طوّر قوة الصنارة أو جودة الطُعم عندما يضيق الوقت.",
    resultBuildCueNoCatch: "كسبت {notes} من ملاحظات الشعاب. لم تصل أي سمكة إلى مرحلة الإنزال هذه المرة؛ استخدم إلقاءً أقوى ثم فكّر في قوة الصنارة أو جودة الطُعم.",
  };

  const fishingCopyKeys = ['spotReef','spotChannel','spotPool','chooseSpot','chargeCast','waitBite','nibble','strike','reelHold','easeLine','counterLeft','counterRight','fishRun','fishRecover','fishTelegraph','missedBite','slackEscape','lineEscape','landing','distance','mapTab','gearTab','albumTab','unknownFish','renderError','retryScene','casting','gustSoon','guarded','castTarget'];
  const fishingCopy = {
    en: ['Near reef · steady','Current channel · darting','Deep pool · heavy','Choose a fishing spot; hold water or Space to charge.','Release to cast at the selected spot.','Watch the float. Wait for the bite!','A nibble… wait for the strong dip.','BITE! Press to strike!','Hold to reel','Release to ease the line','Move rod left','Move rod right','Fish running · ease pressure','Recovery · reel now','Fish preparing a run','Missed bite. Cast again.','Too much slack: fish escaped. Cast again.','Line broke under pressure. Cast again.','Catch landed!','Distance','Map','Gear','Album','Undiscovered','3D scene unavailable. Retry or return to Stages.','Retry scene','Float in flight','Gust coming · ease the line','Guard closed · hold position','Target power'],
    'zh-Hant': ['近礁 · 平穩魚','流帶 · 衝刺魚','深池 · 沉重魚','選釣點；按住水面或空白鍵蓄力。','放開，朝選定釣點拋竿。','觀察浮標，等待咬鉤！','試探中…等浮標明顯下沉。','咬鉤！按下提竿！','按住收線','放開鬆線','向左移竿','向右移竿','魚衝刺 · 放鬆魚線','休息空檔 · 現在收線','魚準備衝刺','錯過咬鉤，再拋一次。','魚線太鬆，魚逃走了；重新拋竿。','張力過大斷線；重新拋竿。','成功收魚！','距離','地圖','裝備','圖鑑','尚未發現','3D 場景無法使用；重試或返回關卡。','重試場景','浮標飛行中','突流將至 · 放鬆魚線','護甲關閉 · 穩住魚線','目標力道'],
    'zh-Hans': ['近礁 · 平稳鱼','流带 · 冲刺鱼','深池 · 沉重鱼','选钓点；按住水面或空格键蓄力。','松开，朝选定钓点抛竿。','观察浮标，等待咬钩！','试探中…等浮标明显下沉。','咬钩！按下提竿！','按住收线','松开松线','向左移竿','向右移竿','鱼冲刺 · 放松鱼线','休息空档 · 现在收线','鱼准备冲刺','错过咬钩，再抛一次。','鱼线太松，鱼逃走了；重新抛竿。','张力过大断线；重新抛竿。','成功收鱼！','距离','地图','装备','图鉴','尚未发现','3D 场景无法使用；重试或返回关卡。','重试场景','浮标飞行中','突流将至 · 放松鱼线','护甲关闭 · 稳住鱼线','目标力度'],
    ja: ['浅い礁 · 穏やかな魚','水路 · 素早い魚','深い池 · 重い魚','釣り場を選び、水面かSpaceを長押し。','離して選んだ釣り場へ投げよう。','ウキを見て、アタリを待とう！','つついている…大きく沈むまで待とう。','アタリ！押して合わせよう！','長押しで巻く','離して糸を緩める','竿を左へ','竿を右へ','魚が走る · 糸を緩めよう','休み中 · 今巻こう','魚が走る準備中','アタリを逃した。もう一度投げよう。','糸が緩すぎて逃げた。再び投げよう。','張力で糸が切れた。再び投げよう。','釣り上げた！','距離','地図','装備','図鑑','未発見','3Dを表示できません。再試行かステージへ。','再試行','ウキが飛んでいます','突流の予告 · 糸を緩めよう','ガード中 · 姿勢を保とう','目標の力'],
    ko: ['얕은 암초 · 안정형','물길 · 돌진형','깊은 웅덩이 · 무거운 물고기','낚시터를 고르고 물이나 Space를 길게 누르세요.','놓으면 선택한 곳으로 던집니다.','찌를 보며 입질을 기다리세요!','미끼 탐색 중…찌가 깊이 잠길 때까지 기다리세요.','입질! 눌러 챔질하세요!','길게 눌러 감기','놓아서 줄 풀기','낚싯대 왼쪽','낚싯대 오른쪽','돌진 중 · 줄을 풀어요','휴식 중 · 지금 감아요','물고기 돌진 준비','입질을 놓쳤어요. 다시 던지세요.','줄이 너무 느슨해 놓쳤어요. 다시 던지세요.','장력이 높아 줄이 끊겼어요. 다시 던지세요.','낚시 성공!','거리','지도','장비','도감','미발견','3D 장면을 열 수 없어요. 재시도하거나 스테이지로 가세요.','장면 재시도','찌가 날아갑니다','급류 예고 · 줄을 풀어요','방어 중 · 줄을 안정시키세요','목표 세기'],
    es: ['Arrecife cercano · estable','Canal · veloz','Poza profunda · pesado','Elige un punto; mantén agua o Espacio para cargar.','Suelta para lanzar al punto elegido.','¡Mira el flotador y espera la picada!','Está tanteando… espera la inmersión fuerte.','¡PICADA! ¡Pulsa para clavar!','Mantén para recoger','Suelta para aflojar','Caña a la izquierda','Caña a la derecha','Corre · afloja la línea','Descansa · recoge ahora','Prepara una carrera','Picada perdida. Lanza otra vez.','Línea floja: escapó. Vuelve a lanzar.','La línea se rompió. Vuelve a lanzar.','¡Captura a bordo!','Distancia','Mapa','Equipo','Álbum','Sin descubrir','Escena 3D no disponible. Reintenta o vuelve a Misiones.','Reintentar escena','Flotador en vuelo','Ráfaga próxima · afloja','Guardia cerrada · estabiliza','Potencia objetivo'],
    'pt-BR': ['Recife perto · estável','Canal · veloz','Poço fundo · pesado','Escolha um ponto; segure a água ou Espaço para carregar.','Solte para lançar ao ponto escolhido.','Olhe a boia e espere a fisgada!','Está beliscando… espere afundar bem.','MORDEU! Aperte para fisgar!','Segure para recolher','Solte para aliviar','Vara à esquerda','Vara à direita','Correndo · alivie a linha','Descansando · recolha agora','Preparando uma corrida','Perdeu a fisgada. Lance de novo.','Linha frouxa: escapou. Lance de novo.','A linha rompeu. Lance de novo.','Peixe a bordo!','Distância','Mapa','Equipamento','Álbum','Não descoberto','Cena 3D indisponível. Tente de novo ou volte às Missões.','Tentar cena','Boia no ar','Rajada chegando · alivie','Defesa fechada · estabilize','Força alvo'],
    fr: ['Récif proche · calme','Chenal · rapide','Fosse · lourd','Choisissez un lieu ; maintenez l’eau ou Espace.','Relâchez pour lancer au lieu choisi.','Surveillez le flotteur, attendez la touche !','Il grignote… attendez la grande plongée.','TOUCHE ! Appuyez pour ferrer !','Maintenez pour mouliner','Relâchez pour détendre','Canne à gauche','Canne à droite','Il fuit · détendez la ligne','Repos · moulinez maintenant','Il prépare une fuite','Touche manquée. Relancez.','Ligne trop lâche : il fuit. Relancez.','Ligne cassée. Relancez.','Poisson à bord !','Distance','Carte','Équipement','Album','Non découvert','Scène 3D indisponible. Réessayez ou revenez aux missions.','Réessayer','Flotteur en vol','Rafale imminente · détendez','Garde fermée · stabilisez','Puissance cible'],
    de: ['Nahes Riff · ruhig','Strömung · flink','Tiefer Pool · schwer','Angelplatz wählen; Wasser oder Leertaste halten.','Loslassen und zum gewählten Platz werfen.','Pose beobachten und auf den Biss warten!','Er knabbert… auf kräftiges Abtauchen warten.','BISS! Zum Anschlagen drücken!','Halten zum Einholen','Loslassen zum Entlasten','Rute nach links','Rute nach rechts','Flucht · Schnur entlasten','Erholung · jetzt einholen','Fisch bereitet Flucht vor','Biss verpasst. Erneut auswerfen.','Schnur zu locker: entkommen. Neu auswerfen.','Schnur gerissen. Neu auswerfen.','Fang an Bord!','Abstand','Karte','Ausrüstung','Album','Unentdeckt','3D-Szene nicht verfügbar. Erneut versuchen oder zu Stufen.','Szene neu laden','Pose im Flug','Böe kommt · Schnur entlasten','Panzer geschlossen · stabil halten','Zielstärke'],
    it: ['Scoglio vicino · calmo','Canale · rapido','Pozza profonda · pesante','Scegli un punto; tieni acqua o Spazio per caricare.','Rilascia per lanciare al punto scelto.','Osserva il galleggiante e attendi il morso!','Sta assaggiando… aspetta che affondi forte.','MORSO! Premi per ferrare!','Tieni per recuperare','Rilascia per allentare','Canna a sinistra','Canna a destra','Scatta · allenta la lenza','Riposa · recupera ora','Prepara uno scatto','Morso perso. Lancia ancora.','Lenza lenta: è fuggito. Lancia ancora.','Lenza rotta. Lancia ancora.','Pesce a bordo!','Distanza','Mappa','Attrezzatura','Album','Da scoprire','Scena 3D non disponibile. Riprova o torna alle missioni.','Riprova scena','Galleggiante in volo','Raffica in arrivo · allenta','Guardia chiusa · stabilizza','Potenza obiettivo'],
    ru: ['Ближний риф · спокойные','Протока · быстрые','Глубокий омут · тяжёлые','Выберите место; удерживайте воду или Пробел.','Отпустите, чтобы забросить к выбранному месту.','Следите за поплавком и ждите поклёвки!','Пробует наживку… ждите сильного погружения.','КЛЮЁТ! Нажмите для подсечки!','Держите для подмотки','Отпустите для ослабления','Удочку влево','Удочку вправо','Рывок · ослабьте леску','Отдыхает · подматывайте','Готовится к рывку','Поклёвка пропущена. Забросьте снова.','Леска ослабла: рыба ушла. Забросьте снова.','Леска порвалась. Забросьте снова.','Улов на борту!','Расстояние','Карта','Снаряжение','Альбом','Не открыто','3D-сцена недоступна. Повторите или вернитесь к этапам.','Повторить сцену','Поплавок в полёте','Скоро порыв · ослабьте леску','Защита закрыта · держите ровно','Целевая сила'],
    hi: ['पास की रीफ़ · स्थिर','धारा · तेज़','गहरा कुंड · भारी','जगह चुनें; पानी या Space दबाकर ताकत भरें।','चुनी जगह फेंकने के लिए छोड़ें।','तैरते काँटे को देखें, काटने की प्रतीक्षा करें!','चारा छू रही है… तेज़ डुबकी तक रुकें।','काट लिया! फँसाने के लिए दबाएँ!','खींचने के लिए दबाएँ','डोर ढीली करने के लिए छोड़ें','छड़ी बाएँ','छड़ी दाएँ','मछली दौड़ रही है · डोर ढीली करें','आराम कर रही है · अब खींचें','मछली दौड़ने को तैयार','मौका छूटा। फिर फेंकें।','डोर ढीली थी: मछली छूटी। फिर फेंकें।','डोर टूट गई। फिर फेंकें।','मछली नाव पर!','दूरी','नक्शा','सामान','एल्बम','अनदेखी','3D दृश्य उपलब्ध नहीं। फिर कोशिश करें या चरणों पर जाएँ।','दृश्य फिर खोलें','काँटा हवा में','झोंका आने वाला है · डोर छोड़ें','कवच बंद · स्थिर रखें','लक्ष्य ताकत'],
    ar: ['شعاب قريبة · هادئ','قناة تيار · سريع','بركة عميقة · ثقيل','اختر موقعًا؛ اضغط الماء أو المسافة للشحن.','أفلت للرمي إلى الموقع المحدد.','راقب العوامة وانتظر العضة!','يقضم الطُعم… انتظر الغوص القوي.','عضة! اضغط لتثبيت الخطاف!','اضغط للسحب','أفلت لإرخاء الخيط','السنارة يسارًا','السنارة يمينًا','اندفاع · أرخِ الخيط','استراحة · اسحب الآن','يستعد للاندفاع','فاتت العضة. ارمِ مجددًا.','الخيط مرتخٍ: هربت السمكة. ارمِ مجددًا.','انقطع الخيط. ارمِ مجددًا.','الصيد على القارب!','المسافة','الخريطة','المعدات','الألبوم','غير مكتشف','مشهد 3D غير متاح. أعد المحاولة أو ارجع للمراحل.','أعد المشهد','العوامة في الهواء','هبة قادمة · أرخِ الخيط','الدرع مغلق · حافظ على الثبات','القوة المستهدفة'],
  };
  function ft(key) { const lang = window.WonderI18n?.actualLocale?.() || locale; return fishingCopy[lang]?.[fishingCopyKeys.indexOf(key)] || fishingCopy.en[fishingCopyKeys.indexOf(key)] || key; }
  const mechanicsKeys = ['open','drift','snag','tide','storm','abyss','rod','reel','line','bait','cast','strike'];
  const mechanicsCopy = {
    en:['Open water · gentle pull','Kelp drift · shifting current','Coral snags · avoid right pressure','Moon tide · alternating current','Storm · gust every 3 seconds','Abyss · drift, guard and gusts','Reel fish toward the boat faster.','Counter-steering reduces running pressure more.','Higher tension tolerance and longer escape grace.','Shorter bite wait, longer strike window, more Notes.','Cast','Strike!'],
    'zh-Hant':['開放海面 · 平緩拉力','海藻漂流 · 流向變化','珊瑚纏礁 · 避免向右施壓','月潮 · 海流交替','風暴 · 每三秒突流','深淵 · 漂流、護甲與突流','主動收線時，更快把魚拉向船。','反向移竿時，更有效降低衝刺壓力。','提高張力容許值，延長逃脫緩衝。','縮短等待、延長提竿時機並增加筆記。','拋竿','提竿！'],
    'zh-Hans':['开放海面 · 平缓拉力','海藻漂流 · 流向变化','珊瑚缠礁 · 避免向右施压','月潮 · 海流交替','风暴 · 每三秒急流','深渊 · 漂流、护甲与急流','主动收线时，更快把鱼拉向船。','反向移竿时，更有效降低冲刺压力。','提高张力容许值，延长逃脱缓冲。','缩短等待、延长提竿时机并增加笔记。','抛竿','提竿！'],
    ja:['開けた海 · 穏やかな引き','海藻流 · 変化する潮流','サンゴ · 右への力に注意','月の潮 · 交互の流れ','嵐 · 3秒ごとの突流','深淵 · 潮流とガードと突流','巻いて魚を船へ引く速度が上がります。','逆方向の操作で突進の張力をより軽減。','張力の許容と逃走までの猶予が増加。','待ち時間を短縮し、合わせ時間とノートを増加。','投げる','合わせる！'],
    ko:['열린 바다 · 부드러운 당김','해초 흐름 · 바뀌는 해류','산호 · 오른쪽 힘 주의','달 조수 · 번갈아 흐름','폭풍 · 3초마다 급류','심해 · 해류, 방어, 급류','감는 동안 물고기를 더 빨리 당깁니다.','반대 방향 조작으로 돌진 장력을 줄입니다.','장력 허용치와 탈출 유예 시간이 늘어납니다.','대기 단축, 챔질 시간과 노트 증가.','던지기','챔질!'],
    es:['Mar abierto · tirón suave','Algas · corriente cambiante','Coral · evita presión derecha','Marea lunar · corriente alterna','Tormenta · ráfaga cada 3 s','Abismo · deriva, guardia y ráfagas','Recoge al pez hacia el barco más rápido.','Contradirigir reduce más la presión de carreras.','Más tolerancia de tensión y margen de escape.','Menos espera, más tiempo de clavado y Notas.','Lanzar','¡Clavar!'],
    'pt-BR':['Mar aberto · puxão suave','Algas · corrente variável','Coral · evite pressão à direita','Maré lunar · corrente alternada','Tempestade · rajada a cada 3 s','Abismo · corrente, defesa e rajadas','Recolhe o peixe mais rápido até o barco.','Direção oposta reduz mais a pressão da corrida.','Mais tolerância de tensão e margem de fuga.','Menos espera, mais tempo de fisgada e Notas.','Lançar','Fisgar!'],
    fr:['Mer ouverte · traction douce','Algues · courant changeant','Corail · évitez la pression à droite','Marée lunaire · courant alterné','Tempête · rafale toutes les 3 s','Abysse · courant, garde et rafales','Ramène le poisson plus vite en moulinant.','Le contre-braquage réduit davantage la tension.','Plus de tolérance et de délai avant la fuite.','Moins d’attente, plus de temps pour ferrer et de Notes.','Lancer','Ferrer !'],
    de:['Offenes Meer · sanfter Zug','Algen · wechselnde Strömung','Korallen · rechten Druck meiden','Mondflut · wechselnder Strom','Sturm · Böe alle 3 Sekunden','Abgrund · Strömung, Panzer, Böen','Zieht den Fisch beim Einholen schneller zum Boot.','Gegenlenken senkt den Fluchtdruck stärker.','Mehr Spannungstoleranz und Fluchtpuffer.','Kürzere Wartezeit, längeres Bissfenster, mehr Notizen.','Auswerfen','Anschlagen!'],
    it:['Mare aperto · trazione dolce','Alghe · corrente variabile','Corallo · evita pressione a destra','Marea lunare · corrente alternata','Tempesta · raffica ogni 3 s','Abisso · corrente, difesa e raffiche','Recupera il pesce verso la barca più in fretta.','Controsterzare riduce di più la pressione.','Più tolleranza di tensione e margine di fuga.','Meno attesa, più tempo per ferrare e Note.','Lancia','Ferra!'],
    ru:['Открытое море · плавная тяга','Водоросли · меняющееся течение','Коралл · избегайте давления вправо','Лунный прилив · смена течения','Шторм · порыв каждые 3 с','Бездна · течение, защита, порывы','Быстрее подтягивает рыбу к лодке при подмотке.','Противодействие сильнее снижает давление рывка.','Больше допустимое натяжение и время до побега.','Меньше ожидания, дольше подсечка, больше заметок.','Заброс','Подсечь!'],
    hi:['खुला पानी · हल्का खिंचाव','समुद्री घास · बदलती धारा','मूंगा · दायाँ दबाव न दें','चाँद ज्वार · बदलती धारा','तूफ़ान · हर 3 सेकंड झोंका','गहराई · धारा, कवच, झोंके','रील घुमाते समय मछली तेज़ी से नाव की ओर आती है।','उलटी दिशा मोड़ने पर दौड़ का दबाव अधिक घटता है।','तनाव सहनशीलता और भागने की मोहलत बढ़ती है।','प्रतीक्षा कम, फँसाने का समय और नोट्स अधिक।','फेंकें','फँसाएँ!'],
    ar:['مياه مفتوحة · سحب لطيف','أعشاب · تيار متغير','مرجان · تجنب ضغط اليمين','مد قمري · تيار متناوب','عاصفة · هبة كل 3 ثوانٍ','هاوية · تيار ودرع وهبات','اسحب السمكة نحو القارب بسرعة أكبر.','التوجيه المعاكس يخفف ضغط الاندفاع أكثر.','تحمل شد أعلى ومهلة أطول قبل الهرب.','انتظار أقصر ومهلة تثبيت أطول وملاحظات أكثر.','ارمِ','ثبّت!'],
  };
  function mt(key) { const lang = window.WonderI18n?.actualLocale?.() || locale; return (mechanicsCopy[lang] || mechanicsCopy.en)[mechanicsKeys.indexOf(key)] || key; }

  const assetPaths = {
    bg: "../../assets/animal-reef-fisher-reef-bg.webp",
    otter: "../../assets/animal-reef-fisher-otter-fisher.webp",
    boat: "../../assets/animal-reef-fisher-boat-safe.webp",
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
  const arabicMissionNames = [
    "خليج التدريب","قناة ضفة الأصداف","عبور البحيرة","رف الشمس","ساحة شبوط التاج",
    "مدخل أعشاب الشريط","التيار الأخضر","الحديقة المتشابكة","القوس المنجرف","جوف لوياثان الأعشاب",
    "ممر إبر المرجان","نافذة الشعاب الزجاجية","متاهة الفروع","ممر المروحة الحمراء","حصن سمكة الكبش",
    "الخليج المضيء بالقمر","المد الفضي","طريق فوانيس قناديل البحر","بركة الكسوف","حلقة شيطان البحر القمري",
    "رف خط المطر","عوامة الرعد","خندق الرياح المتقاطعة","مسار الزبد الأبيض","عين فانوس العاصفة",
    "بوابة الضغط الأزرق","سقوط الكريستال","الطبقة الحرارية الصامتة","منارة الهاوية","عرش التاج الكريستالي",
  ];
  const arabicBosses = [
    ["حامي التاج الشمسي","اتبع ثلاث نبضات سلسة للتاج."],
    ["لوياثان الأعشاب","تنجرف المنطقة الآمنة بينما يبقى سحبه قويًا."],
    ["سمكة كبش المرجان","ينفتح درع المرجان وينغلق كل ثانيتين."],
    ["شيطان البحر الكسوفي","تسبق كل تغير في المد خدعة تعكس السحب."],
    ["حارس فانوس العاصفة","تضرب هبة قوية الخيط كل ثلاث ثوانٍ."],
    ["سيد التاج الكريستالي","يجتمع الانجراف وفتحات الدرع وهبات الهاوية."],
  ];
  regionDefinitions.forEach((region,regionIndex)=>{
    region.names.forEach((name,missionIndex)=>name.push(spanishMissionNames[regionIndex*5+missionIndex]));
    region.boss.name.es=spanishBosses[regionIndex][0];
    region.boss.rule.es=spanishBosses[regionIndex][1];
    region.names.forEach((name,missionIndex)=>name.push(arabicMissionNames[regionIndex*5+missionIndex]));
    region.boss.name.ar=arabicBosses[regionIndex][0];
    region.boss.rule.ar=arabicBosses[regionIndex][1];
  });

  const schoolPattern = ["steady", "mixed", "dart", "heavy", "guardian"];
  const zones = regionDefinitions.flatMap((region, regionIndex) => region.names.map(([en, zh, es, ar], missionIndex) => {
    const stage = regionIndex * 5 + missionIndex + 1;
    return {
      id:`mission-${stage}`,
      stage,
      region:region.id,
      name:{ en, "zh-Hant":zh, es, ar },
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
    { id: "rod", effectKey: "gearEffectRod", name: { en: "Rod Strength", "zh-Hant": "釣竿強度", ar: "قوة الصنارة" }, img: "../../assets/animal-reef-fisher-gear-rod-strength.webp", cost: 18 },
    { id: "reel", effectKey: "gearEffectReel", name: { en: "Reel Control", "zh-Hant": "捲線控制", ar: "تحكم البكرة" }, img: "../../assets/animal-reef-fisher-gear-reel-control.webp", cost: 18 },
    { id: "line", effectKey: "gearEffectLine", name: { en: "Line Durability", "zh-Hant": "魚線耐久", ar: "متانة الخيط" }, img: "../../assets/animal-reef-fisher-gear-line-durability.webp", cost: 20 },
    { id: "bait", effectKey: "gearEffectBait", name: { en: "Bait Quality", "zh-Hant": "魚餌品質", ar: "جودة الطُعم" }, img: "../../assets/animal-reef-fisher-gear-bait-quality.webp", cost: 16 },
    { id: "boat", effectKey: "gearEffectBoat", name: { en: "Boat Range", "zh-Hant": "小船航程", ar: "مدى القارب" }, img: "../../assets/animal-reef-fisher-gear-boat-range.webp", cost: 22 },
    { id: "scan", effectKey: "gearEffectScan", name: { en: "Reef Scanner", "zh-Hant": "礁區掃描", ar: "ماسح الشعاب" }, img: "../../assets/animal-reef-fisher-gear-reef-scanner.webp", cost: 20 },
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
      icon: new URL(`assets/fish-icons/fish-${index + 1}.png`, reefAssetBase).href,
      rare,
      behavior,
      points: tier * 12 + (rare ? 34 : 0),
      notes: tier + (rare ? 5 : 1),
    };
  });
  ["Rayado de laguna","Pez globo burbuja","Pinzón de coral","Raya de cristal","Pargo de algas","Carpa Corona Solar","Medusa lunar","Corredor de aleta azul","Caballito de mar perla","Farol del arrecife","Manta de tormenta","Pez Corona de Cristal"].forEach((name,index)=>{fish[index].name.es=name;});
  ["سمكة شريط البحيرة","سمكة النفيخة الفقاعية","سمكة شرشور المرجان","سمكة الشعاع الزجاجي","سمكة نقّار الأعشاب","كوي التاج الشمسي","قنديل البحر القمري","عدّاء الزعنفة الزرقاء","فرس البحر اللؤلؤي","فانوس الشعاب","شيطان بحر العاصفة","سمكة التاج الكريستالي"].forEach((name,index)=>{fish[index].name.ar=name;});


  const reefFisherLeaveLabels = {
    en: ["Keep Fishing", "Leave Expedition"],
    "zh-Hant": ["繼續釣魚", "離開遠征"],
    "zh-Hans": ["继续钓鱼", "离开远征"],
    ja: ["釣りを続ける", "遠征を終了"],
    ko: ["계속 낚시하기", "원정 나가기"],
    es: ["Seguir pescando", "Salir de la expedición"],
    "pt-BR": ["Continuar pescando", "Sair da expedição"],
    fr: ["Continuer à pêcher", "Quitter l’expédition"],
    de: ["Weiterangeln", "Expedition verlassen"],
    it: ["Continua a pescare", "Lascia la spedizione"],
    ru: ["Продолжить рыбалку", "Покинуть экспедицию"],
    hi: ["मछली पकड़ना जारी रखें", "अभियान छोड़ें"],
    ar: ["تابع الصيد", "الخروج من الرحلة"],
  };
  Object.entries(reefFisherLeaveLabels).forEach(([language, [keepFishing, leaveExpedition]]) => {
    if (text[language]) Object.assign(text[language], { keepFishing, leaveExpedition });
  });

  let locale = activeI18nLocale() || readStorage(localeKey) || "en";
  if (!text[locale]) locale = "en";
  const initialShellCopy = {};
  document.querySelectorAll("[data-ui]").forEach((node) => {
    const key = node.dataset.ui;
    if (key && !initialShellCopy[key]) initialShellCopy[key] = node.textContent.trim();
  });
  const readAria = (selector) => document.querySelector(selector)?.getAttribute("aria-label") || "";
  Object.assign(initialShellCopy, {
    pageTitle: document.title,
    pageDescription: document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
    backToLobby: readAria('.back-btn[data-wp-return="main"]'),
    back: readAria("#stageBackBtn"),
    reefZones: readAria("#zoneRow"),
    gearUpgrades: readAria("#gearGrid"),
    reefMap: readAria("#mapBtn"),
    playAreaAria: readAria("#gameCanvas"),
    tensionLaneAria: readAria("#tensionLane"),
    soundOn: document.getElementById("menuSoundBtn")?.textContent.trim() || "",
  });
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
  let assetsReady = false;
  let preloadPromise = null;

  function t(key, vars = {}) {
    let value = (text[locale] && text[locale][key]) || (locale !== "en" && initialShellCopy[key]) || text.en[key] || key;
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
    return mt(zone.rule);
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
    canvas.setAttribute("aria-label", `${ft('chooseSpot')} ${ft('strike')} ${ft('reelHold')} ${ft('easeLine')} ${missionLabel} · ${name} · ${rule}`);
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
    window.WeightPlayAudio?.play(name);
  }

  function updateSoundButton() {
    const muted = Boolean(window.WeightPlayAudio?.isMuted?.());
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
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
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
    nodes.battleHelpBtn.setAttribute("aria-label", t("tensionTitle"));
    nodes.battleHelpBtn.setAttribute("title", t("tensionTitle"));
    nodes.leaveTitle.textContent = t("leaveTitle");
    nodes.leaveKeepBtn.textContent = t("keepFishing");
    nodes.leaveConfirmBtn.textContent = t("leaveExpedition");
    canvas.setAttribute("aria-label", `${ft('chooseSpot')} ${ft('strike')} ${ft('reelHold')} ${ft('easeLine')} ${ft('counterLeft')} / ${ft('counterRight')}`);
    nodes.tensionLane.setAttribute("aria-label", `${ft('counterLeft')} / ${ft('counterRight')}`);
    document.querySelector('[data-ui="castHint"]')?.replaceChildren(document.createTextNode(ft('chooseSpot')));
    document.querySelector('[data-ui="menuHint"]')?.replaceChildren(document.createTextNode(`${ft('chooseSpot')} ${ft('strike')} ${ft('reelHold')}`));
    document.querySelector('[data-ui="tensionMarker"]')?.replaceChildren(document.createTextNode('↔'));
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
      if (state === 'stage' && stageTab === 'album') renderAlbum();
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
          <div data-wp-item-content><img src="${item.img}" alt="" />
          <div><strong>${localizedValue(item.name)}</strong><span>${formatLevel(level)}</span><small class="gear-effect">${['rod','reel','line','bait'].includes(item.id) ? mt(item.id) : t(item.effectKey)}</small></div></div>
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
    renderAlbum();
    syncStageTabs();
    if (state === "stage" && stageTab === 'map') window.requestAnimationFrame(() => positionStageRail(selectedStageIndex));
  }

  function renderAlbum() {
    const panel = $('reefAlbumWorkspace');
    if (!panel) return;
    const cards = fish.map(item => {
      const collected = save.album.includes(item.id);
      return `<article class="reef-album-card" data-collected="${collected}" data-wp-item-id="${item.id}"><div data-wp-item-content><span class="catch-thumb" style='${fishFrameStyle(item)}' aria-hidden="true"></span><strong>${collected ? localizedValue(item.name) : ft('unknownFish')}</strong><span>${collected ? t(item.rare ? 'rareFish' : 'commonFish') : '—'}</span><span data-wp-item-collection-status><span data-wp-item-collection-icon aria-hidden="true"></span><span data-wp-item-collection-label></span></span></div></article>`;
    }).join('');
    if (panel.dataset.albumSignature !== `${locale}:${save.album.join(',')}:${assetsReady}`) {
      panel.innerHTML = `<div class="reef-album-grid">${cards}</div>`;
      panel.dataset.albumSignature = `${locale}:${save.album.join(',')}:${assetsReady}`;
    }
    const historyCopy = {
      en:['Collected','Not collected','History unknown'], 'zh-Hant':['已收藏','尚未收藏','尚無紀錄'], 'zh-Hans':['已收藏','尚未收藏','暂无记录'],
      ja:['収集済み','未収集','記録なし'], ko:['수집함','미수집','기록 없음'], es:['Coleccionado','Sin coleccionar','Sin registro'],
      'pt-BR':['Coletado','Não coletado','Sem registro'], fr:['Collectionné','Non collectionné','Historique inconnu'], de:['Gesammelt','Nicht gesammelt','Verlauf unbekannt'],
      it:['Raccolto','Non raccolto','Storico sconosciuto'], ru:['Собрано','Не собрано','Нет записи'], hi:['संग्रहित','संग्रह नहीं हुआ','रिकॉर्ड अज्ञात'], ar:['تم جمعها','لم تجمع','السجل غير معروف'],
    };
    const labels = historyCopy[locale] || historyCopy.en;
    panel.querySelectorAll('.reef-album-card').forEach(card => {
      // An absent legacy album entry is unknown, never fabricated history.
      window.WeightPlayScreenFrame?.setItemCollectionStatus(card, {
        itemId:card.dataset.wpItemId, state:save.album.includes(card.dataset.wpItemId) ? 'collected' : 'unknown',
        labels:{collected:labels[0],'not-collected':labels[1],unknown:labels[2]},
      });
    });
  }

  function syncStageTabs() {
    const names = {map:'reefMapWorkspace',gear:'reefGearWorkspace',album:'reefAlbumWorkspace'};
    Object.entries(names).forEach(([tab,id]) => {
      const panel = $(id); if (panel) { panel.hidden = tab !== stageTab; panel.classList.toggle('is-hidden',tab !== stageTab); }
      const button = document.querySelector(`button[data-reef-tab="${tab}"]`);
      if (button) { button.setAttribute('aria-selected',String(tab === stageTab)); button.tabIndex = tab === stageTab ? 0 : -1; button.setAttribute('aria-controls',id); button.textContent = ft(`${tab}Tab`); }
    });
    stagePanel.dataset.reefActiveTab = stageTab;
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
    button.innerHTML = '<span class="zone-art"><img alt="" /></span><strong></strong><span class="zone-card-rule"></span>';
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
    button.dataset.wpGetGameId = GAME_ID;
    button.dataset.wpGetIndex = String(index);
    const completions = window.WeightPlayCastle?.read?.().completions || {};
    button.dataset.wpGetState = completions[`${GAME_ID}:stage-${zone.stage}`] ? 'collected' : 'unknown';
    button.setAttribute("aria-posinset", String(index + 1));
    button.setAttribute("aria-setsize", String(zones.length));
    button.setAttribute("aria-disabled", String(locked));
    button.setAttribute("aria-keyshortcuts", "ArrowLeft ArrowRight Home End");
    button.setAttribute("aria-label", `${missionLabel} · ${missionName(zone)} · ${zone.checkpoint ? t("bossMission") : ruleLabel} · ${locked ? t("locked") : `${t("goal")} ${zone.goal}`}`);
    button.className = `zone-card stage-card region-${zone.region}${zone.checkpoint ? " is-checkpoint" : ""}${locked ? " is-locked" : ""}`;
    const image = button.querySelector("img");
    image.src = zone.img;
    button.querySelector("strong").textContent = `${missionLabel} · ${missionName(zone)}`;
    button.querySelector('.zone-card-rule').textContent = locked ? t("locked") : `${zone.checkpoint ? t("bossMission") : ruleLabel} · ${t("goal")} ${zone.goal}`;
    window.ShowGet?.(GAME_ID,index);
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
    if (which !== 'stage') { gearFeedbackAnimations.forEach(animation=>animation.cancel()); gearFeedbackAnimations.clear(); }
    if (which !== "stage") cancelStageRailInteraction();
    if (which !== "game") {
      disposeReefScene();
      cancelAnimationFrame(raf);
      raf = 0;
    }
    nodes.mainPanel.classList.toggle("is-hidden", which !== "main");
    nodes.stagePanel.classList.toggle("is-hidden", which !== "stage");
    nodes.gamePanel.classList.toggle("is-hidden", which !== "game" && which !== "result");
    (__wpNotifyMeasurement(), nodes.resultPanel.classList.toggle("is-hidden", which !== "result"));
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

    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle","game":"battle"})[which] ?? null;
      if (["result"].includes(which) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
}

  function battleDecisionLayers() {
    return [...nodes.gamePanel.querySelectorAll(":scope > .battle-shell > .hud-row, :scope > .battle-shell > .play-frame, :scope > .battle-shell > .catch-hud, :scope > .battle-shell > .tension-panel")];
  }

  function restartFishingLoop() {
    if (backgroundSuspended || document.hidden || leaveDecisionOpen || sceneError || state !== "game" || !run || run.finished) return;
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
      (__wpNotifyMeasurement(), nodes.leavePanel.classList.remove("is-hidden"));
      battleDecisionLayers().forEach((node) => {
        node.inert = true;
        node.setAttribute("aria-hidden", "true");
      });
      requestAnimationFrame(() => nodes.leaveKeepBtn.focus({ preventScroll: true }));
      return;
    }
    const wasOpen = leaveDecisionOpen;
    leaveDecisionOpen = false;
    (__wpNotifyMeasurement(), nodes.leavePanel.classList.add("is-hidden"));
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
    fishingState = fishing.createFishingState(zone,{...save.gear});
    landingWon = false;
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
    await retryReefScene();
    if (!assetsReady) {
      nodes.startBtn.disabled = true;
      nodes.retryBtn.disabled = true;
      await ensureImagesReady();
      nodes.loadingPanel.classList.add("is-hidden");
      nodes.startBtn.disabled = false;
      nodes.retryBtn.disabled = false;
      focusPanel(nodes.gamePanel);
    }
    if (sceneError) return;
    if (returnedToMain) {
      track("return_session", { source: "main_start", entry_action: entryAction, input_type: run.lastInputType });
      returnedToMain = false;
    }
    track("game_start", { zone: zone.id, stage: zone.stage, entry_action: entryAction, input_type: run.lastInputType });
    playSound("game.start");
    canvas.focus({ preventScroll: true });
    restartFishingLoop();

    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = entryAction === "retry"; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
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
    run.won = Boolean(won);
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
    nodes.resultAdviceText.textContent = won ? `${ft('chooseSpot')} · ${ft('fishRecover')}` : `${ft('reelHold')} · ${ft('easeLine')} · ${ft('fishRecover')}`;
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
      (__wpNotifyMeasurement(), nodes.resultMissionPreview.classList.remove("is-hidden"));
    } else {
      nodes.resultMissionPreview.replaceChildren();
      (__wpNotifyMeasurement(), nodes.resultMissionPreview.classList.add("is-hidden"));
    }
    resultDecisionCommitted = false;
    for (const button of [nodes.nextZoneBtn, nodes.retryBtn, nodes.resultMenuBtn]) button.disabled = false;
    const primaryResultAction = syncResultActions(won);
    showPanel("result");
    window.ShowResultGet?.(GAME_ID,false);
    focusPanel(nodes.resultPanel);
    nodes.resultPanel.scrollTop = 0;
    renderMenu();
    primaryResultAction.focus({ preventScroll: true });
    window.requestAnimationFrame(() => primaryResultAction.focus({ preventScroll: true }));
    playSound(won ? "result.win" : "result.lose");
    track("result", { zone: run.zone.id, stage: run.zone.stage, outcome: won ? "win" : "loss", catches: run.catches, newFish: run.newFish, notes: run.notes, input_type: run.lastInputType });
    track("game_complete", { zone: run.zone.id, stage: run.zone.stage, outcome: won ? "win" : "loss", won, catches: run.catches, newFish: run.newFish, notes: run.notes, score: run.finalScore, input_type: run.lastInputType });

    __wpMeasurement.ended = true; __wpMeasurement.outcome = (won ? "win" : "lose"); if (__wpMeasurement.screen === "battle") __wpMeasurement.screen = null; __wpNotifyMeasurement();
}

  function pickHookFish() {
    if (run.zone.boss && run.catches >= run.zone.goal - 1) return bossFishForZone(run.zone);
    const regionIndex = Math.floor((run.zone.stage - 1) / 5);
    const poolLimit = Math.min(12, ([4, 6, 8, 10, 11, 12][regionIndex] || 12) + Math.max(0, (Number(save.gear.scan) || 1) - 1));
    let pool = fish.slice(0, poolLimit).filter((item) => item.id !== run.zone.boss?.fishId);
    const behavior = fishing.SPOTS[fishingState?.spot || 0].behavior;
    const preferred = pool.filter(item => item.behavior === behavior);
    pool = preferred.length ? preferred : fish.filter(item => item.behavior === behavior && !item.rare && item.id !== run.zone.boss?.fishId);
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
    fishingState.fish = run.hookFish; fishingState.phase = 'bite';
    fishing.pressFishing(fishingState); syncFishingState(); processFishingEvents();
  }

  function landFish(catchSerial = fishingState?.eventSerial) {
    if (!run || run.finished || !run.hookFish || run.lastSettledCatchSerial === catchSerial) return;
    run.lastSettledCatchSerial = catchSerial;
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
    run.phase = "landing";
    landingWon = run.catches >= run.zone.goal;
    run.splashTimer = 0.8;
    run.catchToastTimer = 1.7;
    showCatchToast(caught, points, notes, isNew);
    animateCatchReward(caught);
    updateCatchHud();
    nodes.goalText.textContent = `${run.catches}/${run.zone.goal}`;
    nodes.hintText.textContent = `${t("landed")} ${localizedValue(caught.name)} +${points}`;
    updateTensionGuide();
    updateSonarButton();
    playSound(isNew ? "reward.unlock" : "reward.collect");
    saveProgress();
  }

  function fishById(id) {
    return fish.find((item) => item.id === id) || fish[0];
  }

  function fishThumbUrl(item) {
    return item.icon;
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
          <div class="catch-thumb" style='${fishFrameStyle(item)}' aria-hidden="true"></div>
          <div>
            <strong>${localizedValue(item.name)}</strong>
            <span>${rarity}${entry.isNew ? t("newTag") : ""}</span>
          </div>
          <div class="catch-points">+${entry.points}</div>
        </div>
      `;
    }).join("");
  }

  function tensionRange() {
    const safeMin = 16, safeMax = 81 + (save.gear.line || 1) * 1.6;
    return {safeMin,safeMax,safe:!fishingState || (fishingState.tension >= safeMin && fishingState.tension <= safeMax)};
  }

  function missionTensionWindow(zone, elapsed = 0, gearValues = save.gear) {
    return {safeMin:16,safeMax:81 + (Number(gearValues?.line) || 1) * 1.6};
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

  function markerVisualLeft(steering = 0) {
    const fraction = (Math.max(-1,Math.min(1,Number(steering) || 0)) + 1) / 2;
    const offset = 22 - fraction * 44;
    return `calc(${fraction * 100}% ${offset < 0 ? '-' : '+'} ${Math.abs(offset)}px)`;
  }

  function updateTensionGuide() {
    updateCastMeter();
    const fs = fishingState;
    const active = Boolean(fs?.phase === 'reel');
    const safeMin = 16, safeMax = 81 + (save.gear.line || 1) * 1.6;
    nodes.safeBand.hidden = true;
    nodes.safeBand.style.display = 'none';
    nodes.tensionLane.classList.toggle('is-active', active);
    const safe = !active || (fs.tension >= safeMin && fs.tension <= safeMax);
    nodes.tensionLane.classList.toggle('is-safe', active && safe);
    nodes.tensionLane.classList.toggle('is-danger', active && !safe);
    nodes.tensionLane.setAttribute('aria-valuenow', String(Math.round((fs?.steering || 0) * 50 + 50)));
    nodes.tensionLane.setAttribute('aria-valuetext', `${ft('counterLeft')} / ${ft('counterRight')}`);
    nodes.tensionMarker.style.left = markerVisualLeft(fs?.steering || 0);
    const pressure = $('reefTensionPressure');
    if (pressure) { pressure.value = fs?.tension ?? 40; pressure.high = safeMax; pressure.setAttribute('aria-valuenow',String(Math.round(fs?.tension ?? 40))); pressure.setAttribute('aria-label',t('tensionTitle')); }
    const leftLabel = nodes.tensionLane.querySelector('.lane-label-left'), rightLabel = nodes.tensionLane.querySelector('.lane-label-right');
    if (leftLabel) leftLabel.textContent = '←'; if (rightLabel) rightLabel.textContent = '→';
    const phase = fs?.phase || 'aim';
    const key = ({aim:'chooseSpot',charging:'chargeCast',flight:'casting',wait:'waitBite',nibble:'nibble',bite:'strike',landing:'landing'})[phase];
    let cue = key ? ft(key) : fs?.gustWarning ? ft('gustSoon') : !fs?.shieldOpen ? ft('guarded') : ft(fs?.cycle === 'run' ? 'fishRun' : fs?.cycle === 'telegraph' ? 'fishTelegraph' : 'fishRecover');
    if (sceneError) cue = ft('renderError');
    if (run?.recoveryCue && ['aim','escape'].includes(phase)) cue = run.recoveryCue;
    nodes.tensionCoach.textContent = active ? `${cue} · ${ft(fs.direction > 0 ? 'counterLeft' : 'counterRight')}` : cue;
    nodes.hintText.textContent = cue;
    nodes.tensionStatus.textContent = active ? `${Math.round(fs.tension)}%` : phase === 'charging' ? `${Math.round(fs.castPower)}% / ${fishing.SPOTS[fs.spot].accuracy}%` : '';
    if (pressure) pressure.setAttribute('aria-valuetext',`${Math.round(fs?.tension ?? 40)}% · ${cue} · ${ft('easeLine')}`);
    const action = $('reelActionBtn');
    if (action) {
      action.textContent = sceneError ? ft('retryScene') : phase === 'bite' ? mt('strike') : active ? ft(fs.reeling ? 'easeLine' : 'reelHold') : ['aim','charging'].includes(phase) ? mt('cast') : '…';
      const actionUnavailable = !sceneError && !['aim','charging','bite','reel'].includes(phase);
      // Disabled buttons surrender keyboard focus to body. Move it to the
      // stable arena first so the next fresh Space can strike the bite.
      if (actionUnavailable && document.activeElement === action && state === 'game' && !leaveDecisionOpen) canvas.focus({preventScroll:true});
      action.disabled = actionUnavailable;
      action.setAttribute('aria-label',sceneError ? ft('renderError') : phase === 'bite' ? ft('strike') : active ? `${ft('reelHold')} · ${ft('easeLine')}` : ['aim','charging'].includes(phase) ? ft('chargeCast') : cue); action.setAttribute('aria-pressed',String(Boolean(fs?.reeling)));
    }
    if ($('spotNameText')) $('spotNameText').textContent = ft(['spotReef','spotChannel','spotPool'][fs?.spot || 0]);
    if ($('fightDistanceText')) $('fightDistanceText').textContent = active ? `${ft('distance')} ${fs.distance.toFixed(1)}m` : '';
    if ($('fightStateText')) $('fightStateText').textContent = active ? cue : '';
    for (const id of ['spotPrevBtn','spotNextBtn']) if ($(id)) { $(id).disabled = phase !== 'aim'; $(id).setAttribute('aria-label',ft('chooseSpot')); }
    document.querySelector('.play-frame')?.setAttribute('data-fishing-phase',phase);
  }

  function syncFishingState() {
    if (!run || !fishingState) return;
    const fs = fishingState;
    run.phase = fs.phase; run.castPower = fs.castPower; run.tension = fs.tension;
    run.struggle = fs.danger; run.fishPower = fs.distance; run.initialFishPower = fs.initialDistance;
    run.reelElapsed = fs.fightElapsed; run.bossShieldOpen = fs.shieldOpen; run.lastGustCycle = fs.lastGust;
    if (fs.phase === 'reel') run.hookFish = fs.fish;
  }

  function processFishingEvents() {
    for (const event of fishing.drainFishingEvents(fishingState)) {
      const type = event.type;
      if (type === 'cast') { playSound('projectile.launch'); track('cast',{power:Math.round(fishingState.castPower),zone:run.zone.id,stage:run.zone.stage,fish:run.hookFish?.id,input_type:run.lastInputType}); }
      if (['splash','bite','land','gust'].includes(type)) reefScene?.burst(fishingState.float,type === 'land' && run.hookFish?.rare);
      if (type === 'splash') playSound('water.splash');
      if (type === 'bite') playSound('alert.warning');
      if (type === 'hook') { playSound('movement.hook'); track('fish_hooked',{fish:run.hookFish?.id,stage:run.zone.stage,input_type:run.lastInputType}); }
      if (type === 'gust') playSound('water.splash');
      if (type === 'land') landFish(event.serial);
      if (['miss','slack','break'].includes(type)) {
        reefScene?.burst(fishingState.float);
        run.hookFish = null; run.recoveryCue = ft(type === 'miss' ? 'missedBite' : type === 'slack' ? 'slackEscape' : 'lineEscape');
        playSound('feedback.error'); track(type === 'break' ? 'line_break' : 'fish_escape',{stage:run.zone.stage,cause:type,input_type:run.lastInputType});
      }
      if (type === 'ready') { run.hookFish = null; if (landingWon) { landingWon = false; finishRun(true); } }
    }
  }

  function update(dt) {
    if (state !== 'game' || !run || run.finished || sceneError || !fishingState) return;
    run.time -= dt;
    if (run.time <= 0 && fishingState.phase !== 'landing') { finishRun(run.catches >= run.zone.goal); return; }
    nodes.timeText.textContent = Math.max(0,Math.ceil(run.time)); nodes.goalText.textContent = `${run.catches}/${run.zone.goal}`;
    fishing.stepFishing(fishingState,dt); syncFishingState(); processFishingEvents();
    if (fishingState.phase === 'reel') {
      const safe = fishingState.tension >= 16 && fishingState.tension <= 81 + save.gear.line * 1.6;
      if (safe) run.safeReelTime += dt; else run.dangerReelTime += dt;
    }
    run.sonarPulse = Math.max(0,run.sonarPulse-dt); run.catchToastTimer = Math.max(0,run.catchToastTimer-dt);
    if (run.catchToastTimer <= 0) nodes.catchToast.classList.add('is-hidden');
    renderDelta += dt; updateTensionGuide(); updateSonarButton();
  }

  function configureArena() { reefScene?.resize(); }

  function disposeReefScene() {
    rewardMotions.forEach(motion => { motion.animation.cancel(); motion.node.remove(); }); rewardMotions.clear();
    if (!reefScene) return;
    reefScene.dispose(); reefScene = null;
  }

  function animateCatchReward(item) {
    if (!reefScene || !fishingState) return;
    const origin = reefScene.screenPoint(fishingState.float), destination = nodes.runValueText.getBoundingClientRect();
    const node = document.createElement('span'); node.className = 'catch-thumb';
    node.setAttribute('aria-hidden','true'); node.style.cssText = `${fishFrameStyle(item)};position:fixed;left:${origin.x-22}px;top:${origin.y-22}px;width:44px;height:44px;z-index:100;pointer-events:none;`;
    document.body.append(node);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animation = node.animate(reduced ? [{opacity:1},{opacity:0}] : [{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${destination.left+destination.width/2-origin.x}px,${destination.top+destination.height/2-origin.y}px) scale(.35)`,opacity:0}], {duration:reduced?150:650,easing:'cubic-bezier(.2,.7,.2,1)',fill:'forwards'});
    const motion = {animation,node}; rewardMotions.add(motion);
    animation.finished.then(() => { node.remove(); rewardMotions.delete(motion); }, () => { node.remove(); rewardMotions.delete(motion); });
  }

  async function retryReefScene() {
    if (sceneRecovering) return;
    if (sceneRecoveryFailures >= 2) { window.location.reload(); return; }
    sceneRecovering = true;
    cancelAnimationFrame(raf); raf = 0;
    if (sceneWebGLContext?.isContextLost()) {
      await new Promise(resolve => {
        const timer = setTimeout(done, 1800);
        function done() { clearTimeout(timer); canvas.removeEventListener('webglcontextrestored',done); resolve(); }
        canvas.addEventListener('webglcontextrestored',done,{once:true});
        // Cache the extension while the context is live. Asking for it after
        // loss can return null, including on a second failed scene attempt.
        try { sceneRecoveryExtension?.restoreContext(); } catch { /* Native restoration can still arrive. */ }
      });
    }
    disposeReefScene(); sceneError = false;
    try {
      reefScene = new ReefScene(canvas, () => {
        sceneError = true; cancelFishingInput(); cancelAnimationFrame(raf); raf = 0; updateTensionGuide();
      });
      if (reefScene.renderer.getContext().isContextLost()) throw new Error('WebGL context lost');
      sceneWebGLContext = reefScene.renderer.getContext();
      sceneRecoveryExtension = sceneWebGLContext.getExtension('WEBGL_lose_context');
      sceneRecoveryFailures = 0;
      draw(); restartFishingLoop();
    } catch (error) {
      sceneRecoveryFailures += 1;
      disposeReefScene(); sceneError = true;
      canvas.dataset.renderer = 'unavailable';
      updateTensionGuide();
    }
    sceneRecovering = false;
  }

  function fishingVisual() {
    return fishingState ? {...fishingState.float,phase:fishingState.phase,fishId:fishingState.fish?.id || '',worldCoordinates:true} : null;
  }

  function draw() {
    if (fishingState && reefScene && !sceneError) reefScene.render(fishingState,renderDelta);
    renderDelta = 0;
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
    if (backgroundSuspended || document.hidden || leaveDecisionOpen || sceneError || state !== "game" || !run || run.finished) return;
    const elapsed = (now - lastTime) / 1000;
    lastTime = now;
    updateVisibleElapsed(elapsed);
    draw();
    raf = requestAnimationFrame(tick);
  }

  function startCharge(evt) {
    reclaimVisiblePlayerInteraction(evt);
    if (evt.isPrimary === false || (evt.button !== undefined && evt.button !== 0)) return;
    if (state !== 'game' || !run || run.finished || leaveDecisionOpen) return;
    if (sceneError) { retryReefScene(); return; }
    if (!fishingState || pointer.down) return;
    evt.preventDefault(); run.recoveryCue = ''; run.lastInputType = eventInputType(evt);
    pointer.id = Number.isFinite(evt.pointerId) ? evt.pointerId : null;
    if (evt.currentTarget === $('reelActionBtn')) actionPointerId = pointer.id;
    pointer.down = true; pointer.source = evt.currentTarget === $('reelActionBtn') ? 'action' : 'canvas';
    try { evt.currentTarget?.setPointerCapture?.(evt.pointerId); } catch {}
    if (fishingState.phase === 'aim' && evt.currentTarget === canvas) fishing.chooseSpot(fishingState,reefScene.pickSpot(evt.clientX,evt.clientY));
    if (evt.currentTarget === canvas && fishingState.phase === 'reel') updatePointer(evt);
    fishing.pressFishing(fishingState); syncFishingState(); processFishingEvents(); updateTensionGuide();
  }

  function releaseCast(evt) {
    if (state !== 'game' || !run || !fishingState) return;
    if (Number.isFinite(evt?.pointerId) && evt.pointerId === lanePointerId) { lanePointerId = null; return; }
    if (Number.isFinite(evt?.pointerId) && evt.pointerId !== actionPointerId && (!pointer.down || pointer.id !== evt.pointerId)) return;
    if (Number.isFinite(evt?.pointerId) && actionPointerId !== null && evt.pointerId !== actionPointerId) { pointer.down = false; pointer.id = null; return; }
    if (!Number.isFinite(evt?.pointerId) && !keyboardActionHeld) return;
    if (fishingState.phase === 'charging' && !run.hookFish) run.hookFish = pickHookFish();
    actionPointerId = null;
    keyboardActionHeld = false;
    fishing.releaseFishing(fishingState,run.hookFish); pointer.down = false; pointer.id = null; pointer.keyboardHeld = false;
    syncFishingState(); processFishingEvents(); updateTensionGuide(); updateSonarButton();
  }

  function cancelFishingInput(evt) {
    if (Number.isFinite(evt?.pointerId) && lanePointerId === evt.pointerId) { lanePointerId = null; return; }
    if (Number.isFinite(evt?.pointerId) && pointer.id !== evt.pointerId) return;
    pointer.down = false; pointer.id = null; actionPointerId = null; lanePointerId = null; keyboardActionHeld = false; pointer.keyboardHeld = false; pointer.source = 'canvas';
    if (fishingState) fishing.cancelFishing(fishingState); syncFishingState();
  }

  function startKeyboardCharge() {
    if (!fishingState || pointer.down || sceneError || state !== 'game') return;
    run.recoveryCue = ''; run.lastInputType = 'keyboard'; pointer.down = true; pointer.source = 'keyboard'; pointer.keyboardHeld = true; keyboardActionHeld = true;
    fishing.pressFishing(fishingState); syncFishingState(); processFishingEvents(); updateTensionGuide();
  }

  function adjustKeyboardTension(delta) {
    if (!fishingState || state !== 'game') return;
    run.lastInputType = 'keyboard';
    if (fishingState.phase === 'aim') fishing.chooseSpot(fishingState,fishingState.spot + Math.sign(delta));
    else if (fishingState.phase === 'reel') fishing.setSteering(fishingState,fishingState.steering + delta / 25);
    updateTensionGuide();
  }

  function handleFishingKeyDown(evt) {
    reclaimVisiblePlayerInteraction(evt);
    if (state !== 'game' || !run || leaveDecisionOpen) return;
    if (evt.code === 'Space' || evt.code === 'Enter') { evt.preventDefault(); if (!evt.repeat) startKeyboardCharge(); return; }
    if (evt.key === 'ArrowLeft' || evt.key === 'ArrowRight') { evt.preventDefault(); adjustKeyboardTension(evt.key === 'ArrowLeft' ? -5 : 5); }
    else if (evt.key === 'Home') { evt.preventDefault(); if (fishingState) fishing.setSteering(fishingState,-1); }
    else if (evt.key === 'End') { evt.preventDefault(); if (fishingState) fishing.setSteering(fishingState,1); }
  }

  function handleFishingKeyUp(evt) {
    if (evt.code !== 'Space' && evt.code !== 'Enter') return;
    evt.preventDefault(); releaseCast();
  }

  function updatePointer(evt) {
    const point = evt.touches ? evt.touches[0] : evt;
    const rect = canvas.getBoundingClientRect();
    pointer.source = "canvas";
    pointer.x = point.clientX - rect.left;
    pointer.y = point.clientY - rect.top;
    pointer.tensionPct = Math.max(0, Math.min(100, (pointer.x / rect.width) * 100));
    if (fishingState?.phase === "reel") fishing.setSteering(fishingState,pointer.tensionPct / 50 - 1);
  }

  function updateLanePointer(evt) {
    const point = evt.touches ? evt.touches[0] : evt;
    const laneRect = nodes.tensionLane.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (point.clientX - laneRect.left) / laneRect.width));
    pointer.source = "lane";
    if (run) run.lastInputType = eventInputType(evt);
    pointer.tensionPct = pct * 100;
    if (fishingState) fishing.setSteering(fishingState,pct * 2 - 1);
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
      playSound("feedback.error");
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
      playSound("feedback.error");
      return;
    }
    if (type === "lure") save.lureReady = true;
    else save.sonarReady = true;
    saveProgress();
    renderMenu();
    playSound("reward.coin");
    track(type === "lure" ? "rare_lure_purchase" : "sonar_purchase", { cost, item: type, input_type: actionInputType });
  }

  function upgradeGear(id, restoreFocus = false, actionInputType = "unknown") {
    clearDiamondPurchaseConfirmation();
    const item = gear.find((g) => g.id === id);
    const level = Number(save.gear[id]) || 1;
    if (!item) return;
    if (level >= 5) {
      showGearFeedback(`${localizedValue(item.name)} · ${t('max')}`,t('gearMaxLabel',{gear:localizedValue(item.name),level}));
      return;
    }
    const cost = item.cost * level;
    if (save.notes < cost) {
      showGearFeedback(`${t('reefNotes')} ${Math.floor(save.notes)}/${cost}`,t('gearUpgradeNeedLabel',{gear:localizedValue(item.name),beforeLevel:level,afterLevel:level+1,cost,balance:Math.floor(save.notes),need:cost-Math.floor(save.notes)}));
      playSound("feedback.error");
      return;
    }
    const before = Math.floor(save.notes);
    save.notes -= cost;
    save.gear[id] = level + 1;
    saveProgress();
    renderMenu();
    showGearFeedback(`${localizedValue(item.name)} · ${formatLevel(level+1)}`,t('gearUpgradeLabel',{gear:localizedValue(item.name),beforeLevel:level,afterLevel:level+1,cost,before,after:Math.floor(save.notes)}));
    for (const node of [nodes.notesText,nodes.gearGrid.querySelector(`[data-gear="${id}"]`)?.closest('.gear-card')]) {
      if (!node?.animate) continue;
      const animation=node.animate([{opacity:.65},{opacity:1}],{duration:200,easing:'ease-out'});
      gearFeedbackAnimations.add(animation);animation.finished.then(()=>gearFeedbackAnimations.delete(animation),()=>gearFeedbackAnimations.delete(animation));
    }
    if (restoreFocus) restoreGearFocus(id);
    playSound("reward.upgrade");
    track("gear_upgrade", { gear: id, level: level + 1, input_type: actionInputType });
  }

  function showGearFeedback(shortCopy, fullCopy) {
    const feedback=$('reefGearFeedback');
    if (!feedback) return;
    feedback.textContent=shortCopy;feedback.setAttribute('aria-label',fullCopy);feedback.setAttribute('title',fullCopy);
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
    playSound("ui.click");
    stageTab = 'map';
    selectedZone = zones[Math.min(zones.length - 1, Math.max(0, save.unlockedZone - 1))].id;
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
    playSound("ui.click");
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
    playSound("ui.click");
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
    await __wpReplayStart(() => startRun(eventInputType(event), "retry"));
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
    playSound("ui.click");
    stageTab = 'map';
    selectedZone = zones[Math.min(zones.length - 1, Math.max(0, save.unlockedZone - 1))].id;
    state = "stage";
    showPanel("stage");
    renderMenu();
    focusPanel(nodes.stagePanel);
    window.requestAnimationFrame(focusSelectedZone);
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
    playSound("reward.coin");
    track("sonar_use", {
      zone: run.zone.id,
      fish: run.hookFish.id,
      rarity: run.hookFish.rare ? "rare" : "common",
      behavior: run.hookFish.behavior,
      input_type: eventInputType(event),
    });
  });
  nodes.battleHelpBtn.addEventListener("click", () => {
    const expanded = nodes.battleHelpBtn.getAttribute("aria-expanded") === "true";
    nodes.battleHelpBtn.setAttribute("aria-expanded", String(!expanded));
    nodes.tensionCoach.hidden = expanded;
    if (!expanded) updateTensionGuide();
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
    window.WeightPlayAudio?.unlock?.();
    const nextMuted = !Boolean(window.WeightPlayAudio?.isMuted?.());
    window.WeightPlayAudio?.setMuted?.(nextMuted);
    updateSoundButton();
    if (!nextMuted) playSound("ui.click");
  });
  canvas.addEventListener("pointerdown", startCharge);
  document.querySelectorAll('button[data-reef-tab]').forEach(button => button.addEventListener('click', () => {
    stageTab = button.dataset.reefTab;
    syncStageTabs();
    if (stageTab === 'map') requestAnimationFrame(() => { installVirtualStageDrag(); focusSelectedZone(); });
    else if (stageTab === 'album') renderAlbum();
  }));
  document.querySelectorAll('button[data-reef-tab]').forEach(button => button.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const buttons = [...document.querySelectorAll('button[data-reef-tab]')];
    const index = buttons.indexOf(button);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length-1 : (index + (event.key === 'ArrowLeft' ? -1 : 1) + buttons.length) % buttons.length;
    buttons[next].click(); buttons[next].focus({preventScroll:true});
  }));
  $('spotPrevBtn')?.addEventListener('click', () => { if (fishingState && fishing.chooseSpot(fishingState,fishingState.spot - 1)) { run.recoveryCue = ''; updateTensionGuide(); draw(); } });
  $('spotNextBtn')?.addEventListener('click', () => { if (fishingState && fishing.chooseSpot(fishingState,fishingState.spot + 1)) { run.recoveryCue = ''; updateTensionGuide(); draw(); } });
  $('reelActionBtn')?.addEventListener('pointerdown', startCharge);
  $('reelActionBtn')?.addEventListener('pointercancel', cancelFishingInput);
  $('reelActionBtn')?.addEventListener('lostpointercapture', cancelFishingInput);
  $('reelActionBtn')?.addEventListener('keydown', handleFishingKeyDown);
  $('reelActionBtn')?.addEventListener('keyup', handleFishingKeyUp);
  $('reelActionBtn')?.addEventListener('click', event => {
    // Assistive activation has no pointerdown. Pointer activation already ran.
    if (event.detail !== 0 || state !== 'game') return;
    if (sceneError) { retryReefScene(); return; }
    if (pointer.down || !fishingState) return;
    if (fishingState.phase === 'bite') { fishing.pressFishing(fishingState); syncFishingState(); processFishingEvents(); updateTensionGuide(); }
  });
  canvas.addEventListener("pointermove", (evt) => {
    if (pointer.down && pointer.id === evt.pointerId) updatePointer(evt);
  });
  window.addEventListener("pointerup", releaseCast);
  window.addEventListener('weightplay:castle-reward', event => {
    const detail = event.detail || {};
    if (detail.gameId !== GAME_ID || !run?.finished || !run.won || state !== 'result' || detail.completionId !== `stage-${run.zone.stage}`) return;
    const completedRun = run;
    queueMicrotask(() => {
      if (run !== completedRun || state !== 'result') return;
      window.ShowResultGet?.(GAME_ID,true);
      window.WeightPlayCastle?.dismissRewardNotice?.(GAME_ID);
    });
  });
  window.addEventListener("pointercancel", cancelFishingInput);
  function suspendBackgroundFishing() {
    cancelFishingInput();
    suspendDiamondPurchaseConfirmation();
    if (backgroundSuspended) return;
    (__wpNotifyMeasurement(), backgroundSuspended = true);
    cancelAnimationFrame(raf);
    raf = 0;
  }
  function resumeBackgroundFishing() {
    if (document.hidden) return;
    resumeDiamondPurchaseConfirmation();
    if (!backgroundSuspended) return;
    (__wpNotifyMeasurement(), backgroundSuspended = false);
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
    if (lanePointerId !== null) return;
    lanePointerId = Number.isFinite(evt.pointerId) ? evt.pointerId : null;
    nodes.tensionLane.setPointerCapture?.(evt.pointerId);
    updateLanePointer(evt);
  });
  nodes.tensionLane.addEventListener("pointermove", (evt) => {
    if (lanePointerId === evt.pointerId) updateLanePointer(evt);
  });
  nodes.tensionLane.addEventListener("pointercancel", cancelFishingInput);
  nodes.tensionLane.addEventListener("lostpointercapture", cancelFishingInput);
  [canvas, nodes.tensionLane].forEach((control) => {
    control.addEventListener("keydown", handleFishingKeyDown);
    control.addEventListener("keyup", handleFishingKeyUp);
    control.addEventListener("focusout", () => {
      if (keyboardActionHeld) cancelFishingInput();
    });
  });
  $('reelActionBtn')?.addEventListener('focusout', () => { if (keyboardActionHeld) cancelFishingInput(); });

  if (isTestMode) {
    window.__AnimalReefFisherTest = {
      read3D() { return reefScene?.counters() || {disposed:true}; },
      readFishing() { return fishingState ? JSON.parse(JSON.stringify(fishingState)) : null; },
      chooseSpot(index) { fishing.chooseSpot(fishingState,index); updateTensionGuide(); return this.readFishing(); },
      pressAction() { fishing.pressFishing(fishingState); syncFishingState(); processFishingEvents(); return this.readState(); },
      releaseAction() { if (fishingState.phase === 'charging' && !run.hookFish) run.hookFish = pickHookFish(); fishing.releaseFishing(fishingState,run.hookFish); syncFishingState(); processFishingEvents(); return this.readState(); },
      steer(value) { fishing.setSteering(fishingState,value); return this.readFishing(); },
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
        return { cropMode: "original-three-rgba-icon", sample: fish.map(item => ({ id:item.id, icon:item.icon })) };
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
  // Let the shared Settings owner adopt the existing tutorial action instead
  // of leaving a private floating control over the Main poster.
  adoptReefTutorialAction();
  window.WeightPlayAudio?.preload?.(['projectile.launch','water.splash','movement.hook','alert.warning','reward.collect','reward.unlock','shop.purchase','game.start','result.win','result.lose']);
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

  window.addEventListener("beforeunload", () => {cancelAnimationFrame(raf); disposeReefScene();});
})();

// This finite loader failure surface is deliberately independent of both game
// modules. It never opens a scene, initializes a save, or changes the Wallet.
function adoptReefTutorialAction() {
  const adopt = () => {
    const button = document.querySelector('.wp-tutorial-button,[data-wp-tutorial-action]');
    const main = document.getElementById('mainPanel');
    if (!button || !main) return false;
    button.id = 'helpBtn'; main.append(button);
    window.WeightPlayScreenFrame?.autoMountDocument?.();
    const popover = main.querySelector('.wp-shell-settings-popover');
    if (!popover) return false;
    button.classList.remove('wp-tutorial-button','wp-main-legacy-layout','wp-shell-legacy-control');
    button.removeAttribute('aria-hidden');
    button.classList.add('wp-shell-settings-extra','secondary-btn');
    button.dataset.wpTutorialAction = 'embedded';
    button.textContent = button.getAttribute('aria-label') || '?';
    popover.append(button);
    if (!button.dataset.wpTutorialSettingsBound) {
      button.dataset.wpTutorialSettingsBound = 'true';
      button.addEventListener('click', () => {
        const settings = button.closest('.wp-shell-settings')?.querySelector('.wp-shell-settings-button');
        if (settings?.getAttribute('aria-expanded') === 'true') settings.click();
      }, {capture:true});
    }
    return true;
  };
  if (!adopt() && document.readyState !== 'complete') document.addEventListener('DOMContentLoaded', adopt, {once:true});
}

function showReefBootFailure() {
  adoptReefTutorialAction();
  const copy = {
    en:['The fishing scene could not load. Check your connection and retry. Your saved progress is unchanged.','Retry loading'],
    'zh-Hant':['釣魚場景載入失敗，請檢查連線後重試。已儲存的進度保持不變。','重新載入'],
    'zh-Hans':['钓鱼场景加载失败，请检查连接后重试。已保存的进度保持不变。','重新加载'],
    ja:['釣りの画面を読み込めませんでした。接続を確認して再試行してください。保存済みの進行は保持されています。','読み込みを再試行'],
    ko:['낚시 장면을 불러오지 못했어요. 연결을 확인하고 다시 시도하세요. 저장된 진행은 유지됩니다.','다시 불러오기'],
    es:['No se pudo cargar la escena de pesca. Comprueba la conexión y reintenta. Tu progreso guardado se conserva.','Reintentar carga'],
    'pt-BR':['Não foi possível carregar a cena de pesca. Confira a conexão e tente de novo. Seu progresso salvo foi mantido.','Tentar carregar'],
    fr:['La scène de pêche n’a pas pu se charger. Vérifiez la connexion puis réessayez. Votre progression enregistrée est conservée.','Réessayer le chargement'],
    de:['Die Angelszene konnte nicht geladen werden. Verbindung prüfen und erneut versuchen. Dein gespeicherter Fortschritt bleibt erhalten.','Erneut laden'],
    it:['Impossibile caricare la scena di pesca. Controlla la connessione e riprova. I progressi salvati sono conservati.','Riprova caricamento'],
    ru:['Не удалось загрузить сцену рыбалки. Проверьте соединение и повторите. Сохранённый прогресс не изменён.','Повторить загрузку'],
    hi:['मछली पकड़ने का दृश्य लोड नहीं हुआ। कनेक्शन जाँचकर फिर कोशिश करें। आपकी सहेजी प्रगति सुरक्षित है।','फिर लोड करें'],
    ar:['تعذر تحميل مشهد الصيد. تحقق من الاتصال وأعد المحاولة. تقدمك المحفوظ لم يتغير.','أعد التحميل'],
  };
  const requested = window.WonderI18n?.actualLocale?.() || document.documentElement.lang || 'en';
  const aliases = {'zh-tw':'zh-Hant','zh-hant':'zh-Hant','zh-cn':'zh-Hans','zh-hans':'zh-Hans','pt-br':'pt-BR'};
  const language = aliases[requested.toLowerCase()] || requested.split('-')[0];
  const labels = copy[language] || copy.en;
  const loading = document.getElementById('loadingPanel');
  if (loading) { loading.hidden = true; loading.classList.add('is-hidden'); }
  const main = document.getElementById('mainPanel');
  if (main) { main.hidden = false; main.classList.remove('is-hidden'); }
  const message = main?.querySelector('[data-ui="menuHint"]');
  if (message) { message.textContent = labels[0]; message.classList.add('main-summary'); message.removeAttribute('data-ui'); message.dataset.runtimeLocalize = 'off'; message.setAttribute('role','alert'); }
  const retry = document.getElementById('startBtn');
  if (retry) {
    retry.textContent = labels[1]; retry.disabled = false; retry.removeAttribute('data-ui'); retry.dataset.runtimeLocalize = 'off';
    retry.setAttribute('aria-label',labels[1]); retry.addEventListener('click', () => window.location.reload(), {once:true});
  }
  document.body.dataset.reefState = 'main'; document.documentElement.dataset.reefState = 'main';
  window.__ANIMAL_REEF_FISHER_LOAD_FAILED__ = true;
}
