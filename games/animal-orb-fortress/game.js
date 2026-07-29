(() => {
  const GAME_ID = "animal-orb-fortress";
  const saveKey = "weightplay_animal_orb_fortress_v1";
  const localeKey = "weightPlayLocale";
  let W = 960;
  let H = 540;
  const rerollCost = 3;
  const MAX_RAID_TIER = 30;
  const WAVES_PER_RAID = 3;

  const $ = (id) => document.getElementById(id);
  const nodes = {
    lobbyReturn: document.querySelector(".topbar .back-btn"),
    localeSelect: $("localeSelect"),
    loadingPanel: $("loadingPanel"),
    loadingFill: $("loadingFill"),
    loadingText: $("loadingText"),
    menuPanel: $("menuPanel"),
    stagePanel: $("stagePanel"),
    gamePanel: $("gamePanel"),
    upgradePanel: $("upgradePanel"),
    pausePanel: $("pausePanel"),
    resultPanel: $("resultPanel"),
    startBtn: $("startBtn"),
    stageBackBtn: $("stageBackBtn"),
    stageRail: $("stageRail"),
    stageProgressText: $("stageProgressText"),
    mapBtn: $("battleBackBtn"),
    pauseBtn: $("pauseBtn"),
    resumeBtn: $("resumeBtn"),
    pauseMapBtn: $("pauseMapBtn"),
    retryBtn: $("retryBtn"),
    nextStageBtn: $("nextStageBtn"),
    resultMenuBtn: $("resultMenuBtn"),
    roomGrid: $("roomGrid"),
    bestRaidText: $("bestRaidText"),
    starStoneText: $("starStoneText"),
    diamondText: $("diamondText"),
    waveText: $("waveText"),
    coreText: $("coreText"),
    shotText: $("shotText"),
    hintText: $("hintText"),
    upgradeCards: $("upgradeCards"),
    upgradeStatus: $("upgradeStatus"),
    rerollBtn: $("rerollBtn"),
    resultTitle: $("resultTitle"),
    resultText: $("resultText"),
    skillReportText: $("skillReportText"),
  };
  // Stage and Battle own the complete safe physical width. The shared
  // responsive Canvas controllers keep one uniform scale while widening the
  // logical envelope; this opt-in removes the superseded 920px desktop cap.
  nodes.stagePanel.dataset.wpCanvasMaxWidth = "920";
  nodes.stagePanel.dataset.wpStageLandscapeWidth = "760";
  nodes.stagePanel.dataset.wpStageLandscapeHeight = "334";
  nodes.gamePanel.dataset.wpCanvasMaxWidth = "920";
  const canvas = $("gameCanvas");
  const ARENA_KEYBOARD_SHORTCUTS = "ArrowLeft ArrowRight Space Enter";
  canvas.dataset.runtimeLocalize = "off";
  const ctx = canvas.getContext("2d");

  const text = {
    en: {
      title: "Animal Orb Fortress",
      language: "Language",
      backToLobby: "Back to lobby",
      fortressRooms: "Fortress rooms",
      arenaLabel: "Animal Orb Fortress arena",
      menuTitle: "Aim the spirit orb through the crystal fortress.",
      menuHint: "Choose a raid route, plan ricochet shots, and protect the fortress core.",
      bestRaid: "Best Raid",
      starStones: "Star Stones",
      diamonds: "Diamonds",
      openRaidMap: "Choose Raid",
      raidMap: "Raid Map",
      battleReturnDecision: "Pause raid and review exit options",
      pause: "Pause",
      pausedTitle: "Raid paused",
      pausedText: "The fortress is frozen. Resume to keep this raid, or choose Raid Map to abandon its current wave and temporary blessings.",
      resume: "Resume",
      raidTiers: "Raid tiers",
      returnMain: "Return to main",
      fortressWorkshop: "Fortress Workshop",
      stageProgress: "{unlocked}/30 routes unlocked · 3 waves each",
      tierLocked: "Locked",
      enterRaid: "Enter",
      nextStage: "Next Stage",
      tier1Name: "Crystal Gate",
      tier1Desc: "Learn wall bounces against scouting beasts.",
      tier2Name: "Moss Arcade",
      tier2Desc: "More enemies arrive with tougher armor.",
      tier3Name: "Echo Courtyard",
      tier3Desc: "Survive the strongest assault and final golem.",
      tier4Name: "Forest Crown",
      tier5Name: "Thorn Bridge",
      tier6Name: "Venom Garden",
      tier7Name: "Root Labyrinth",
      tier8Name: "Marsh Guardian",
      tier9Name: "Moon Stair",
      tier10Name: "Wisp Gallery",
      tier11Name: "Mirror Ruins",
      tier12Name: "Lunar Sentinel",
      tier13Name: "Eclipse Gate",
      tier14Name: "Black Crystal Hall",
      tier15Name: "Shadow Furnace",
      tier16Name: "Eclipse Regent",
      tier17Name: "Golem Approach",
      tier18Name: "Core Foundry",
      tier19Name: "Last Bastion",
      tier20Name: "Heart of the Fortress",
      zone1Desc: "Crystal woodland patrols test clean bank shots.",
      zone2Desc: "Thorn beasts favor armor and crowded lanes.",
      zone3Desc: "Moon wisps move quickly through ruined halls.",
      zone4Desc: "Eclipse troops arrive behind crystal shields.",
      zone5Desc: "Golem guards combine every previous threat.",
      ruleFormation: "Formation",
      ruleSwarm: "Swarm",
      ruleArmored: "Shielded",
      ruleGuardian: "Elite guard",
      tierShort: "R{tier}",
      wave: "Wave",
      waves: "waves",
      core: "Core",
      shots: "Shots",
      aimHint: "Drag from the launcher, preview the bounce path, then release.",
      keyboardAim: "Aim {angle}° from center. Left/Right adjust; Space or Enter fires.",
      arenaControlLabel: "Animal Orb Fortress arena. Aim {angle} degrees from center. Use Left and Right arrows to adjust; Space or Enter to fire.",
      arenaControlReadyLabel: "Animal Orb Fortress arena. Aim {angle} degrees from center. Use Left and Right arrows to adjust. Orb ready; Space or Enter fires now.",
      arenaControlCooldownLabel: "Animal Orb Fortress arena. Aim {angle} degrees from center. Orb cooling down for about {seconds} seconds; Space or Enter cannot fire yet.",
      arenaControlLimitLabel: "Animal Orb Fortress arena. Aim {angle} degrees from center. {active}/{limit} spirit orbs are flying, the active limit; Space or Enter cannot fire yet.",
      orbReady: "Orb ready. Bank shots into shadow beasts before they reach the core.",
      orbFlying: "Spirit orb is flying. Watch the bounce route and prepare the next aim.",
      fortressHit: "A shadow beast hit the core. Aim earlier or use wider angles.",
      waveClear: "Wave clear. Choose one blessing before the next wave.",
      chooseUpgrade: "Choose a fortress blessing",
      reroll: "Reroll for 3 diamonds",
      rerolled: "Relic choices refreshed.",
      rerollNeed: "Need 3 Diamonds. Current balance {balance}/3.",
      rerollConfirm: "Confirm 3 · {before}→{after}",
      rerollDecision: "Refresh all three blessings once this wave. Tap again to confirm: {before} → {after} Diamonds.",
      rerollLabel: "Refresh all three blessing choices once this wave. Costs 3 Diamonds. Current balance {balance}.",
      rerollConfirmLabel: "Confirm one blessing reroll. Spend 3 Diamonds. Balance {before} to {after}.",
      retry: "Retry",
      raidClear: "Raid Clear",
      raidFailed: "Raid Failed",
      resultWin: "Cleared route {tier}, wave {wave}/3, earned {stones} Star Stones, and protected {core} core HP.",
      resultLose: "Reached route {tier}, wave {wave}/3 and earned {stones} Star Stones. Upgrade rooms and try a safer bounce route.",
      progressUnlocked: "Progress saved: {total} Star Stones total; route {best} is now unlocked.",
      progressComplete: "Progress saved: {total} Star Stones total; all 30 routes are cleared.",
      ruleBank: "Bank route",
      rulePriority: "Target order",
      ruleAnchor: "Thorn anchor",
      ruleArmor: "Break armor",
      rulePhase: "Phase timing",
      rulePylon: "Mirror pylons",
      ruleSplitter: "Crystal splitters",
      ruleCharge: "Charge lanes",
      ruleMastery: "Mixed mastery",
      ruleBoss: "Boss counterplay",
      bossCueRootbound: "Rootbound guard raised — break it, then strike the exposed chest crystal.",
      bossCueBramble: "Bramble plates and thorn anchors protect the Colossus.",
      bossCueLunar: "The Matriarch is phasing — wait for the moon rings to open.",
      bossCuePrism: "Prism shield rotating — attack while the gold segment faces forward.",
      bossCueTempest: "Charge lane marked — the Guardian is vulnerable after its rush.",
      bossCueVoid: "Voidcore phase changed — clear the escort and follow the lit core.",
      progressSaved: "Progress saved: {total} Star Stones total; best unlocked route remains {best}.",
      reportWin: "Skill Report: strong logic and reaction. You used bounce planning and upgrade choice to protect the fortress.",
      reportLose: "Skill Report: good practice. Next run, aim earlier and use walls to hit multiple beasts.",
      upgradeDamage: "Bigger Orb",
      upgradeDamageDesc: "+1 orb damage.",
      upgradeSplit: "Split Orb",
      upgradeSplitDesc: "Add a third echo orb to each release.",
      upgradePierce: "Piercing Shine",
      upgradePierceDesc: "The orb can hit the same beast again sooner.",
      upgradeRecharge: "Faster Recharge",
      upgradeRechargeDesc: "Ready the next shot sooner.",
      upgradeShield: "Core Shield",
      upgradeShieldDesc: "Restore 4 core HP.",
      upgradeMagnet: "Scout Magnet",
      upgradeMagnetDesc: "+2 Star Stones after the raid.",
      roomForge: "Orb Forge",
      roomForgeDesc: "+1 base orb damage per level.",
      roomShield: "Core Shield",
      roomShieldDesc: "+4 starting core HP per level.",
      roomDen: "Companion Den",
      roomDenDesc: "Adds helper chip damage at level 2+.",
      companionLocked: "Unlocks helper strikes at Lv.2.",
      companionCurrent: "Helper strike: {damage} damage every 4s.",
      companionNext: "Next level: {damage} damage.",
      roomTower: "Scout Tower",
      roomTowerDesc: "+1 bonus Star Stone per raid level.",
      level: "Lv.{n}",
      upgradeRoom: "Upgrade {cost}",
      upgradeRoomLabel: "{name}: upgrade to Lv.{level} for {cost} Star Stones. Result: {effect}",
      maxRoomLabel: "{name}: maximum level Lv.{level}. {effect}",
      maxed: "Max",
    },
    "zh-Hant": {
      title: "動物星珠要塞",
      language: "語言",
      backToLobby: "返回大廳",
      fortressRooms: "要塞房間",
      arenaLabel: "動物星珠要塞競技場",
      menuTitle: "瞄準星珠，穿越水晶要塞。",
      menuHint: "選擇突襲路線、規劃反彈射擊，守住要塞核心。",
      bestRaid: "最佳突襲",
      starStones: "星石",
      diamonds: "鑽石",
      openRaidMap: "選擇關卡",
      raidMap: "突襲地圖",
      battleReturnDecision: "暫停突襲並查看離開選項",
      pause: "暫停",
      pausedTitle: "突襲已暫停",
      pausedText: "要塞戰況已凍結。繼續可保留本次突襲；選擇突襲地圖會放棄目前波次與暫時祝福。",
      resume: "繼續",
      raidTiers: "突襲關卡",
      returnMain: "返回主畫面",
      fortressWorkshop: "要塞工坊",
      stageProgress: "已解鎖 {unlocked}/30 條路線 · 每關 3 波",
      tierLocked: "尚未解鎖",
      enterRaid: "進入",
      nextStage: "下一關",
      tier1Name: "水晶門",
      tier1Desc: "熟悉牆面反彈，擊退偵查影獸。",
      tier2Name: "苔痕長廊",
      tier2Desc: "敵人更多，護甲與壓力也更強。",
      tier3Name: "回音庭院",
      tier3Desc: "撐過最強攻勢，擊敗最終魔像。",
      tier4Name: "森林王冠",
      tier5Name: "荊棘橋",
      tier6Name: "毒霧花園",
      tier7Name: "盤根迷宮",
      tier8Name: "沼澤守衛",
      tier9Name: "月光階梯",
      tier10Name: "幽光迴廊",
      tier11Name: "鏡面遺跡",
      tier12Name: "月之守衛",
      tier13Name: "蝕影之門",
      tier14Name: "黑晶大廳",
      tier15Name: "暗影熔爐",
      tier16Name: "蝕影王座",
      tier17Name: "魔像前線",
      tier18Name: "核心鑄造場",
      tier19Name: "最終壁壘",
      tier20Name: "要塞之心",
      zone1Desc: "水晶森林的巡邏隊，考驗穩定反彈。",
      zone2Desc: "荊棘影獸偏重護甲與密集進攻。",
      zone3Desc: "月光幽靈會高速穿過遺跡。",
      zone4Desc: "蝕影部隊帶著水晶護盾出擊。",
      zone5Desc: "魔像守軍會混合先前所有威脅。",
      ruleFormation: "陣形戰",
      ruleSwarm: "敵群戰",
      ruleArmored: "護盾戰",
      ruleGuardian: "菁英守衛",
      tierShort: "關{tier}",
      wave: "波次",
      core: "核心",
      shots: "射擊",
      aimHint: "從發射器拖曳瞄準，預覽反彈路線後放開。",
      keyboardAim: "瞄準偏移 {angle}°。左右方向鍵調整，空白鍵或 Enter 發射。",
      arenaControlLabel: "動物星珠要塞競技場。瞄準偏移 {angle} 度。使用左右方向鍵調整，空白鍵或 Enter 發射。",
      arenaControlReadyLabel: "動物星珠要塞競技場。瞄準偏移 {angle} 度。使用左右方向鍵調整。星珠已準備好；空白鍵或 Enter 現在可以發射。",
      arenaControlCooldownLabel: "動物星珠要塞競技場。瞄準偏移 {angle} 度。星珠冷卻約剩 {seconds} 秒；空白鍵或 Enter 尚無法發射。",
      arenaControlLimitLabel: "動物星珠要塞競技場。瞄準偏移 {angle} 度。目前有 {active}/{limit} 顆星珠飛行中，已達飛行上限；空白鍵或 Enter 尚無法發射。",
      orbReady: "星珠已準備好。用牆面反彈擊中影獸，別讓牠們靠近核心。",
      orbFlying: "星珠正在飛行。觀察反彈路線，準備下一次瞄準。",
      fortressHit: "影獸撞到核心了。更早瞄準，或改用更寬的反彈角度。",
      waveClear: "波次完成。選擇一個祝福後進入下一波。",
      chooseUpgrade: "選擇一個要塞祝福",
      reroll: "花 3 鑽石重抽",
      rerolled: "遺物選項已刷新。",
      rerollNeed: "需要 3 顆鑽石。目前餘額 {balance}/3。",
      rerollConfirm: "確認 3 · {before}→{after}",
      rerollDecision: "本波一次刷新全部三個祝福。再點一次確認：{before} → {after} 顆鑽石。",
      rerollLabel: "本波一次刷新全部三個祝福。花費 3 顆鑽石。目前餘額 {balance}。",
      rerollConfirmLabel: "確認重抽一次祝福。花費 3 顆鑽石。餘額 {before} 變為 {after}。",
      retry: "再試一次",
      raidClear: "突襲成功",
      raidFailed: "突襲失敗",
      resultWin: "完成第 {tier} 關、第 {wave}/3 波，獲得 {stones} 顆星石，並保留 {core} 點核心生命。",
      resultLose: "抵達第 {tier} 關、第 {wave}/3 波並獲得 {stones} 顆星石。升級房間後再試更安全的反彈路線。",
      progressUnlocked: "進度已保存：累積星石 {total} 顆；已解鎖第 {best} 關。",
      progressComplete: "進度已保存：累積星石 {total} 顆；30 關已全部完成。",
      ruleBank: "反彈路線",
      rulePriority: "目標順序",
      ruleAnchor: "荊棘錨點",
      ruleArmor: "擊破護甲",
      rulePhase: "相位時機",
      rulePylon: "鏡面柱",
      ruleSplitter: "水晶分裂",
      ruleCharge: "衝鋒路線",
      ruleMastery: "綜合精通",
      ruleBoss: "Boss 反制",
      bossCueRootbound: "盤根防護升起：先擊破，再攻擊外露的胸口水晶。",
      bossCueBramble: "荊棘甲片與錨點正在保護巨獸。",
      bossCueLunar: "月靈女王進入相位：等待月環打開再射擊。",
      bossCuePrism: "稜晶護盾旋轉中：金色盾片朝前時攻擊。",
      bossCueTempest: "衝鋒路線已標記：守衛衝刺後會短暫外露。",
      bossCueVoid: "虛空核心轉換階段：先清護衛，再追蹤發光核心。",
      progressSaved: "進度已保存：累積星石 {total} 顆；最佳已解鎖第 {best} 關。",
      reportWin: "能力回饋：邏輯與反應很穩。你透過反彈規劃與升級選擇保護了要塞。",
      reportLose: "能力回饋：這是很好的練習。下一局可以更早瞄準，利用牆面一次擊中多隻影獸。",
      upgradeDamage: "巨大星珠",
      upgradeDamageDesc: "星珠傷害 +1。",
      upgradeSplit: "分裂星珠",
      upgradeSplitDesc: "發射後額外射出一顆較弱星珠。",
      upgradePierce: "穿透星芒",
      upgradePierceDesc: "星珠可以更快再次命中同一隻影獸。",
      upgradeRecharge: "快速充能",
      upgradeRechargeDesc: "更快準備下一次射擊。",
      upgradeShield: "核心護盾",
      upgradeShieldDesc: "恢復 4 點核心生命。",
      upgradeMagnet: "偵查磁力",
      upgradeMagnetDesc: "突襲結束後額外 +2 星石。",
      roomForge: "星珠鍛造室",
      roomForgeDesc: "每級提高基礎星珠傷害。",
      roomShield: "核心護盾室",
      roomShieldDesc: "每級提高 4 點起始核心生命。",
      roomDen: "夥伴巢穴",
      roomDenDesc: "2 級後提供輔助傷害。",
      companionLocked: "升到第 2 級即可解鎖夥伴支援攻擊。",
      companionCurrent: "夥伴支援：每 4 秒造成 {damage} 傷害。",
      companionNext: "下一級：{damage} 傷害。",
      roomTower: "偵查高塔",
      roomTowerDesc: "每個突襲等級額外 +1 星石。",
      level: "第 {n} 級",
      upgradeRoom: "升級 {cost}",
      upgradeRoomLabel: "{name}：升到第 {level} 級，花費 {cost} 顆星石。升級後：{effect}",
      maxRoomLabel: "{name}：已達最高第 {level} 級。{effect}",
      maxed: "已滿",
    },
  };

  text.es = {
    title:"Fortaleza de Orbes Animal",language:"Idioma",backToLobby:"Volver al vestíbulo",fortressRooms:"Salas de la fortaleza",arenaLabel:"Arena de Fortaleza de Orbes Animal",soundTitle:"Sonido",enableSound:"Activar sonido",disableSound:"Desactivar sonido",menuTitle:"Apunta el orbe espiritual por la fortaleza de cristal.",menuHint:"Planifica rebotes, protege el núcleo y mejora cuatro salas con Piedras Estelares.",bestRaid:"Mejor ruta",starStones:"Piedras Estelares",diamonds:"Diamantes",openRaidMap:"Abrir mapa",raidMap:"Mapa de rutas",battleReturnDecision:"Pausar la incursión y revisar las opciones de salida",pause:"Pausar",pausedTitle:"Incursión en pausa",pausedText:"La fortaleza está detenida. Continúa para conservar esta incursión o elige Mapa de rutas para abandonar la oleada y las bendiciones temporales.",resume:"Continuar",raidTiers:"Rutas de incursión",returnMain:"Volver al inicio",fortressWorkshop:"Taller de la fortaleza",stageProgress:"{unlocked}/30 rutas desbloqueadas · 3 oleadas cada una",tierLocked:"Bloqueado",enterRaid:"Entrar",nextStage:"Siguiente nivel",
    tier1Name:"Puerta de Cristal",tier1Desc:"Aprende los rebotes contra exploradores lentos.",tier2Name:"Galería de Musgo",tier2Desc:"Más enemigos, armadura y presión.",tier3Name:"Patio del Eco",tier3Desc:"Supera el ataque más fuerte y derrota al gólem.",tier4Name:"Corona del Bosque",tier5Name:"Puente de Espinas",tier6Name:"Jardín Venenoso",tier7Name:"Laberinto de Raíces",tier8Name:"Guardián del Pantano",tier9Name:"Escalera Lunar",tier10Name:"Galería de Luces",tier11Name:"Ruinas de Espejos",tier12Name:"Guardián Lunar",tier13Name:"Puerta del Eclipse",tier14Name:"Salón de Cristal Negro",tier15Name:"Fundición de Sombras",tier16Name:"Trono del Eclipse",tier17Name:"Frente del Gólem",tier18Name:"Fundición del Núcleo",tier19Name:"Último Bastión",tier20Name:"Corazón de la Fortaleza",
    zone1Desc:"Patrullas del bosque de cristal que prueban rebotes estables.",zone2Desc:"Bestias de espinas con armadura y ataques densos.",zone3Desc:"Espíritus lunares atraviesan rápido las ruinas.",zone4Desc:"Fuerzas del eclipse atacan con escudos de cristal.",zone5Desc:"La guardia del gólem combina todas las amenazas.",ruleFormation:"Formación",ruleSwarm:"Enjambre",ruleArmored:"Armadura",ruleGuardian:"Guardián",tierShort:"Ruta {tier}",wave:"Oleada",waves:"oleadas",core:"Núcleo",shots:"Disparos",
    aimHint:"Arrastra desde el lanzador, revisa la ruta de rebote y suelta.",keyboardAim:"Ángulo {angle}°. Ajusta con flechas y dispara con Espacio o Enter.",arenaControlLabel:"Arena de Fortaleza de Orbes Animal. Ángulo {angle} grados. Ajusta con flechas y dispara con Espacio o Enter.",arenaControlReadyLabel:"Arena de Fortaleza de Orbes Animal. Ángulo {angle} grados. El orbe está listo; Espacio o Enter dispara.",arenaControlCooldownLabel:"Arena de Fortaleza de Orbes Animal. Ángulo {angle} grados. Recarga aproximada {seconds} s; aún no puedes disparar.",arenaControlLimitLabel:"Arena de Fortaleza de Orbes Animal. Ángulo {angle} grados. Hay {active}/{limit} orbes volando, el límite activo; aún no puedes disparar.",orbReady:"Orbe listo. Rebota contra los muros antes de que las bestias alcancen el núcleo.",orbFlying:"El orbe está volando. Observa la ruta y prepara el siguiente ángulo.",fortressHit:"Una bestia golpeó el núcleo. Apunta antes o usa un rebote más amplio.",waveClear:"Oleada completada. Elige una bendición para continuar.",chooseUpgrade:"Elige una bendición",reroll:"Repetir por 3 diamantes",rerolled:"Opciones renovadas.",rerollNeed:"Necesitas 3 diamantes. Saldo {balance}/3.",rerollConfirm:"Confirmar 3 · {before}→{after}",rerollDecision:"Renueva las tres bendiciones una vez. Toca otra vez: {before} → {after} diamantes.",rerollLabel:"Renueva las tres bendiciones una vez. Cuesta 3 diamantes. Saldo {balance}.",rerollConfirmLabel:"Confirma una renovación. Gasta 3 diamantes. Saldo de {before} a {after}.",retry:"Reintentar",
    raidClear:"Incursión completada",raidFailed:"Incursión fallida",resultWin:"Completaste la ruta {tier}, oleada {wave}/3, ganaste {stones} piedras y conservaste {core} de núcleo.",resultLose:"Llegaste a la ruta {tier}, oleada {wave}/3 y ganaste {stones} piedras. Mejora salas e intenta un rebote más seguro.",progressUnlocked:"Progreso guardado: {total} piedras; ruta {best} desbloqueada.",progressComplete:"Progreso guardado: {total} piedras; las 30 rutas están completas.",ruleBank:"Ruta de rebote",rulePriority:"Prioridad de objetivos",ruleAnchor:"Ancla de espinas",ruleArmor:"Romper armadura",rulePhase:"Momento de fase",rulePylon:"Pilar espejo",ruleSplitter:"División de cristal",ruleCharge:"Carril de carga",ruleMastery:"Dominio combinado",ruleBoss:"Contraataque de jefe",
    bossCueRootbound:"Defensa de raíces elevada: rómpela y golpea el cristal del pecho.",bossCueBramble:"Placas de zarzas y anclas protegen al Coloso.",bossCueLunar:"La Matriarca cambia de fase: espera a que se abran los anillos lunares.",bossCuePrism:"Escudo prisma girando: ataca cuando el segmento dorado mire al frente.",bossCueTempest:"Carril de carga marcado: el Guardián queda expuesto tras correr.",bossCueVoid:"Cambió la fase del núcleo vacío: elimina la escolta y sigue el núcleo iluminado.",progressSaved:"Progreso guardado: {total} piedras; mejor ruta desbloqueada {best}.",reportWin:"Informe: lógica y reacción sólidas. Protegiste la fortaleza con rebotes y mejoras.",reportLose:"Informe: buena práctica. Apunta antes y usa el muro para golpear varias bestias.",
    upgradeDamage:"Orbe gigante",upgradeDamageDesc:"+1 de daño de orbe.",upgradeSplit:"Orbe dividido",upgradeSplitDesc:"Añade un tercer orbe eco a cada disparo.",upgradePierce:"Luz penetrante",upgradePierceDesc:"El orbe puede volver a golpear antes a la misma bestia.",upgradeRecharge:"Carga rápida",upgradeRechargeDesc:"Prepara antes el siguiente disparo.",upgradeShield:"Escudo del núcleo",upgradeShieldDesc:"Restaura 4 de vida del núcleo.",upgradeMagnet:"Imán explorador",upgradeMagnetDesc:"+2 Piedras Estelares al terminar.",roomForge:"Forja de orbes",roomForgeDesc:"+1 de daño base por nivel.",roomShield:"Sala del escudo",roomShieldDesc:"+4 de vida inicial del núcleo por nivel.",roomDen:"Guarida de compañeros",roomDenDesc:"Daño de apoyo desde nivel 2.",companionLocked:"Alcanza Nv.2 para desbloquear ataques de apoyo.",companionCurrent:"Apoyo: {damage} de daño cada 4 segundos.",companionNext:"Siguiente nivel: {damage} de daño.",roomTower:"Torre de exploración",roomTowerDesc:"+1 Piedra Estelar por ruta y nivel.",level:"Nv.{n}",upgradeRoom:"Mejorar {cost}",upgradeRoomLabel:"{name}: subir a Nv.{level} por {cost} piedras. Después: {effect}",maxRoomLabel:"{name}: nivel máximo {level}. {effect}",maxed:"Máximo"
  };

  text.fr = {
    title:"Forteresse des Orbes Animales",language:"Langue",backToLobby:"Retour à l'accueil",fortressRooms:"Salles de la forteresse",arenaLabel:"Arène de la Forteresse des Orbes Animales",soundTitle:"Son",enableSound:"Activer le son",disableSound:"Couper le son",menuTitle:"Dirigez l'orbe spirituel à travers la forteresse de cristal.",menuHint:"Choisissez un parcours, planifiez les ricochets et protégez le noyau de la forteresse.",bestRaid:"Meilleur parcours",starStones:"Pierres Stellaires",diamonds:"Diamants",openRaidMap:"Choisir un parcours",raidMap:"Carte des parcours",battleReturnDecision:"Mettre l'assaut en pause et examiner les options de sortie",pause:"Pause",pausedTitle:"Assaut en pause",pausedText:"La forteresse est figée. Reprenez pour continuer cet assaut, ou choisissez Carte des parcours pour abandonner la vague actuelle et ses bénédictions temporaires.",resume:"Reprendre",raidTiers:"Parcours d'assaut",returnMain:"Retour à l'écran principal",fortressWorkshop:"Atelier de la forteresse",stageProgress:"{unlocked}/30 parcours débloqués · 3 vagues chacun",tierLocked:"Verrouillé",enterRaid:"Entrer",nextStage:"Parcours suivant",
    tier1Name:"Porte de Cristal",tier1Desc:"Apprenez les ricochets contre les bêtes éclaireuses.",tier2Name:"Galerie de Mousse",tier2Desc:"Davantage d'ennemis arrivent avec une armure renforcée.",tier3Name:"Cour de l'Écho",tier3Desc:"Résistez à l'assaut le plus intense et au golem final.",tier4Name:"Couronne de la Forêt",tier5Name:"Pont d'Épines",tier6Name:"Jardin Venimeux",tier7Name:"Labyrinthe des Racines",tier8Name:"Gardien du Marais",tier9Name:"Escalier Lunaire",tier10Name:"Galerie des Feux Follets",tier11Name:"Ruines aux Miroirs",tier12Name:"Sentinelle Lunaire",tier13Name:"Porte de l'Éclipse",tier14Name:"Salle du Cristal Noir",tier15Name:"Fournaise des Ombres",tier16Name:"Régent de l'Éclipse",tier17Name:"Approche du Golem",tier18Name:"Fonderie du Noyau",tier19Name:"Dernier Bastion",tier20Name:"Cœur de la Forteresse",
    zone1Desc:"Les patrouilles de la forêt de cristal mettent les ricochets précis à l'épreuve.",zone2Desc:"Les bêtes épineuses privilégient l'armure et les couloirs encombrés.",zone3Desc:"Les feux follets lunaires traversent rapidement les salles en ruine.",zone4Desc:"Les troupes de l'éclipse avancent derrière des boucliers de cristal.",zone5Desc:"Les gardes golems combinent toutes les menaces précédentes.",ruleFormation:"Formation",ruleSwarm:"Essaim",ruleArmored:"Blindés",ruleGuardian:"Garde d'élite",tierShort:"P{tier}",wave:"Vague",waves:"vagues",core:"Noyau",shots:"Tirs",
    aimHint:"Faites glisser depuis le lanceur, vérifiez la trajectoire de ricochet, puis relâchez.",keyboardAim:"Angle de {angle}° depuis le centre. Gauche/Droite règlent la visée ; Espace ou Entrée tire.",arenaControlLabel:"Arène de la Forteresse des Orbes Animales. Angle de {angle} degrés depuis le centre. Utilisez les flèches Gauche et Droite pour régler la visée ; appuyez sur Espace ou Entrée pour tirer.",arenaControlReadyLabel:"Arène de la Forteresse des Orbes Animales. Angle de {angle} degrés depuis le centre. Utilisez les flèches Gauche et Droite pour régler la visée. Orbe prêt ; appuyez sur Espace ou Entrée pour tirer maintenant.",arenaControlCooldownLabel:"Arène de la Forteresse des Orbes Animales. Angle de {angle} degrés depuis le centre. L'orbe se recharge encore environ {seconds} secondes ; vous ne pouvez pas tirer.",arenaControlLimitLabel:"Arène de la Forteresse des Orbes Animales. Angle de {angle} degrés depuis le centre. {active}/{limit} orbes spirituels sont en vol, soit la limite active ; vous ne pouvez pas encore tirer.",orbReady:"Orbe prêt. Faites ricocher vos tirs sur les bêtes d'ombre avant qu'elles n'atteignent le noyau.",orbFlying:"L'orbe spirituel est en vol. Observez ses ricochets et préparez le prochain angle.",fortressHit:"Une bête d'ombre a frappé le noyau. Visez plus tôt ou utilisez des angles plus larges.",waveClear:"Vague terminée. Choisissez une bénédiction avant la vague suivante.",chooseUpgrade:"Choisissez une bénédiction de la forteresse",reroll:"Renouveler pour 3 Diamants",rerolled:"Choix de reliques renouvelés.",rerollNeed:"Il faut 3 Diamants. Solde actuel : {balance}/3.",rerollConfirm:"Confirmer 3 · {before}→{after}",rerollDecision:"Renouvelez les trois bénédictions une fois pendant cette vague. Touchez encore pour confirmer : {before} → {after} Diamants.",rerollLabel:"Renouvelle les trois bénédictions une fois pendant cette vague. Coûte 3 Diamants. Solde actuel : {balance}.",rerollConfirmLabel:"Confirmer un renouvellement des bénédictions. Dépenser 3 Diamants. Solde de {before} à {after}.",retry:"Réessayer",
    raidClear:"Assaut réussi",raidFailed:"Assaut échoué",resultWin:"Parcours {tier} terminé, vague {wave}/3, {stones} Pierres Stellaires gagnées et {core} PV du noyau préservés.",resultLose:"Parcours {tier} atteint, vague {wave}/3, et {stones} Pierres Stellaires gagnées. Améliorez les salles et essayez une trajectoire plus sûre.",progressUnlocked:"Progression enregistrée : {total} Pierres Stellaires ; le parcours {best} est maintenant débloqué.",progressComplete:"Progression enregistrée : {total} Pierres Stellaires ; les 30 parcours sont terminés.",ruleBank:"Trajectoire de ricochet",rulePriority:"Ordre des cibles",ruleAnchor:"Ancre épineuse",ruleArmor:"Briser l'armure",rulePhase:"Rythme des phases",rulePylon:"Pylônes miroirs",ruleSplitter:"Scindaires de cristal",ruleCharge:"Couloirs de charge",ruleMastery:"Maîtrise combinée",ruleBoss:"Contre-mesure du boss",
    bossCueRootbound:"La garde de racines est levée : brisez-la, puis frappez le cristal exposé sur le torse.",bossCueBramble:"Les plaques de ronces et les ancres épineuses protègent le Colosse.",bossCueLunar:"La Matriarche change de phase : attendez l'ouverture des anneaux lunaires.",bossCuePrism:"Le bouclier prismatique tourne : attaquez quand le segment doré fait face à l'avant.",bossCueTempest:"Couloir de charge signalé : le Gardien est vulnérable après sa ruée.",bossCueVoid:"La phase du Noyau du Vide a changé : éliminez l'escorte et suivez le noyau lumineux.",progressSaved:"Progression enregistrée : {total} Pierres Stellaires ; le meilleur parcours débloqué reste {best}.",reportWin:"Bilan : logique et réaction solides. Vous avez protégé la forteresse grâce aux ricochets et aux améliorations.",reportLose:"Bilan : bon entraînement. La prochaine fois, visez plus tôt et utilisez les murs pour toucher plusieurs bêtes.",
    upgradeDamage:"Orbe Majeur",upgradeDamageDesc:"+1 dégât d'orbe.",upgradeSplit:"Orbe Scindé",upgradeSplitDesc:"Ajoute un troisième orbe écho à chaque tir.",upgradePierce:"Éclat Perforant",upgradePierceDesc:"L'orbe peut toucher de nouveau la même bête plus rapidement.",upgradeRecharge:"Recharge Rapide",upgradeRechargeDesc:"Prépare le tir suivant plus tôt.",upgradeShield:"Bouclier du Noyau",upgradeShieldDesc:"Restaure 4 PV du noyau.",upgradeMagnet:"Aimant Éclaireur",upgradeMagnetDesc:"+2 Pierres Stellaires après l'assaut.",roomForge:"Forge des Orbes",roomForgeDesc:"+1 dégât de base par niveau.",roomShield:"Bouclier du Noyau",roomShieldDesc:"+4 PV initiaux du noyau par niveau.",roomDen:"Refuge des Compagnons",roomDenDesc:"Ajoute des frappes de soutien à partir du niveau 2.",companionLocked:"Débloque les frappes de soutien au niveau 2.",companionCurrent:"Frappe de soutien : {damage} dégâts toutes les 4 s.",companionNext:"Niveau suivant : {damage} dégâts.",roomTower:"Tour des Éclaireurs",roomTowerDesc:"+1 Pierre Stellaire bonus par niveau de parcours.",level:"Niv.{n}",upgradeRoom:"Améliorer {cost}",upgradeRoomLabel:"{name} : améliorer au niv.{level} pour {cost} Pierres Stellaires. Résultat : {effect}",maxRoomLabel:"{name} : niveau maximal {level}. {effect}",maxed:"Maximum"
  };

  text.de = {
    title:"Tierische Orbfestung",language:"Sprache",backToLobby:"Zur Lobby",fortressRooms:"Festungsräume",arenaLabel:"Arena der Tierischen Orbfestung",soundTitle:"Ton",enableSound:"Ton einschalten",disableSound:"Ton ausschalten",menuTitle:"Lenke die Geisterkugel durch die Kristallfestung.",menuHint:"Wähle eine Route, plane Abpraller und beschütze den Festungskern.",bestRaid:"Beste Route",starStones:"Sternsteine",diamonds:"Diamanten",openRaidMap:"Route wählen",raidMap:"Routenkarte",battleReturnDecision:"Überfall pausieren und Rückkehrmöglichkeiten prüfen",pause:"Pause",pausedTitle:"Überfall pausiert",pausedText:"Die Festung steht still. Setze den Überfall fort oder kehre zur Routenkarte zurück; dabei werden die aktuelle Welle und ihre vorübergehenden Segnungen aufgegeben.",resume:"Fortsetzen",raidTiers:"Überfallrouten",returnMain:"Zurück zum Hauptbildschirm",fortressWorkshop:"Festungswerkstatt",stageProgress:"{unlocked}/30 Routen freigeschaltet · je 3 Wellen",tierLocked:"Gesperrt",enterRaid:"Betreten",nextStage:"Nächste Route",
    tier1Name:"Kristalltor",tier1Desc:"Lerne Abpraller gegen langsame Späherbestien.",tier2Name:"Moosgalerie",tier2Desc:"Mehr Gegner greifen mit stärkerer Rüstung an.",tier3Name:"Echohof",tier3Desc:"Überstehe den stärksten Angriff und den letzten Golem.",tier4Name:"Waldkrone",tier5Name:"Dornenbrücke",tier6Name:"Giftgarten",tier7Name:"Wurzellabyrinth",tier8Name:"Sumpfwächter",tier9Name:"Mondtreppe",tier10Name:"Irrlichtgalerie",tier11Name:"Spiegelruinen",tier12Name:"Mondwächter",tier13Name:"Finsternistor",tier14Name:"Schwarzkristallhalle",tier15Name:"Schattenesse",tier16Name:"Finsternisregent",tier17Name:"Golemvorstoß",tier18Name:"Kernschmelze",tier19Name:"Letzte Bastion",tier20Name:"Herz der Festung",
    zone1Desc:"Patrouillen im Kristallwald prüfen präzise Abpraller.",zone2Desc:"Dornenbestien setzen auf Rüstung und volle Angriffsbahnen.",zone3Desc:"Mondirrwische durchqueren die Ruinen mit hoher Geschwindigkeit.",zone4Desc:"Finsternistruppen rücken hinter Kristallschilden vor.",zone5Desc:"Die Golemwache verbindet alle bisherigen Gefahren.",ruleFormation:"Formation",ruleSwarm:"Schwarm",ruleArmored:"Gepanzert",ruleGuardian:"Elitewache",tierShort:"R{tier}",wave:"Welle",waves:"Wellen",core:"Kern",shots:"Schüsse",
    aimHint:"Ziehe vom Werfer, prüfe die Abprallbahn und lasse los.",keyboardAim:"Winkel {angle}° von der Mitte. Mit Links/Rechts zielen; Leertaste oder Eingabetaste feuert.",arenaControlLabel:"Arena der Tierischen Orbfestung. Winkel {angle} Grad von der Mitte. Mit der linken und rechten Pfeiltaste zielen; Leertaste oder Eingabetaste feuert.",arenaControlReadyLabel:"Arena der Tierischen Orbfestung. Winkel {angle} Grad von der Mitte. Mit der linken und rechten Pfeiltaste zielen. Kugel bereit; Leertaste oder Eingabetaste feuert.",arenaControlCooldownLabel:"Arena der Tierischen Orbfestung. Winkel {angle} Grad von der Mitte. Die Kugel lädt noch etwa {seconds} Sekunden; Schießen ist noch nicht möglich.",arenaControlLimitLabel:"Arena der Tierischen Orbfestung. Winkel {angle} Grad von der Mitte. {active}/{limit} Geisterkugeln sind bereits im Flug; Schießen ist noch nicht möglich.",orbReady:"Kugel bereit. Lass Schüsse von den Wänden abprallen, bevor die Schattenbestien den Kern erreichen.",orbFlying:"Die Geisterkugel ist im Flug. Beobachte ihre Abpraller und plane den nächsten Winkel.",fortressHit:"Eine Schattenbestie hat den Kern getroffen. Ziele früher oder nutze einen weiteren Winkel.",waveClear:"Welle geschafft. Wähle vor der nächsten Welle eine Segnung.",chooseUpgrade:"Festungssegnung wählen",reroll:"Für 3 Diamanten neu wählen",rerolled:"Segnungen wurden neu gewählt.",rerollNeed:"Du brauchst 3 Diamanten. Aktueller Stand: {balance}/3.",rerollConfirm:"3 bestätigen · {before}→{after}",rerollDecision:"Wähle die drei Segnungen in dieser Welle einmal neu. Erneut antippen zum Bestätigen: {before} → {after} Diamanten.",rerollLabel:"Wählt die drei Segnungen in dieser Welle einmal neu. Kostet 3 Diamanten. Aktueller Stand: {balance}.",rerollConfirmLabel:"Neue Segnungen bestätigen. 3 Diamanten ausgeben. Stand von {before} auf {after}.",retry:"Erneut versuchen",
    raidClear:"Überfall geschafft",raidFailed:"Überfall gescheitert",resultWin:"Route {tier}, Welle {wave}/3 geschafft, {stones} Sternsteine erhalten und {core} Kern-LP bewahrt.",resultLose:"Route {tier}, Welle {wave}/3 erreicht und {stones} Sternsteine erhalten. Verbessere Räume und versuche eine sicherere Bahn.",progressUnlocked:"Fortschritt gespeichert: {total} Sternsteine; Route {best} ist jetzt freigeschaltet.",progressComplete:"Fortschritt gespeichert: {total} Sternsteine; alle 30 Routen sind abgeschlossen.",ruleBank:"Abprallbahn",rulePriority:"Zielreihenfolge",ruleAnchor:"Dornenanker",ruleArmor:"Rüstung brechen",rulePhase:"Phasenrhythmus",rulePylon:"Spiegelpfeiler",ruleSplitter:"Kristallspalter",ruleCharge:"Sturmbahnen",ruleMastery:"Kombinierte Meisterschaft",ruleBoss:"Boss-Gegenmaßnahme",
    bossCueRootbound:"Der Wurzelschutz ist aktiv: Brich ihn und triff dann den freigelegten Brustkristall.",bossCueBramble:"Rankenplatten und Dornenanker schützen den Koloss.",bossCueLunar:"Die Matriarchin wechselt die Phase: Warte, bis sich die Mondringe öffnen.",bossCuePrism:"Der Prismenschild dreht sich: Greife an, wenn das goldene Segment nach vorn zeigt.",bossCueTempest:"Sturmbahn markiert: Nach seinem Ansturm ist der Wächter verwundbar.",bossCueVoid:"Die Phase des Leerenkerns hat gewechselt: Besiege die Eskorte und folge dem leuchtenden Kern.",progressSaved:"Fortschritt gespeichert: {total} Sternsteine; die beste freigeschaltete Route bleibt {best}.",reportWin:"Bericht: starke Logik und Reaktion. Du hast die Festung mit Abprallbahnen und Verbesserungen geschützt.",reportLose:"Bericht: gute Übung. Ziele früher und nutze die Wände, um mehrere Bestien zu treffen.",
    upgradeDamage:"Große Kugel",upgradeDamageDesc:"+1 Kugelschaden.",upgradeSplit:"Geteilte Kugel",upgradeSplitDesc:"Fügt jedem Schuss eine dritte Echokugel hinzu.",upgradePierce:"Durchdringender Glanz",upgradePierceDesc:"Die Kugel kann dieselbe Bestie schneller erneut treffen.",upgradeRecharge:"Schnellladung",upgradeRechargeDesc:"Bereitet den nächsten Schuss früher vor.",upgradeShield:"Kernschild",upgradeShieldDesc:"Stellt 4 Kern-LP wieder her.",upgradeMagnet:"Spähermagnet",upgradeMagnetDesc:"+2 Sternsteine nach dem Überfall.",roomForge:"Kugelschmiede",roomForgeDesc:"+1 Grundschaden pro Stufe.",roomShield:"Kernschildkammer",roomShieldDesc:"+4 anfängliche Kern-LP pro Stufe.",roomDen:"Gefährtenquartier",roomDenDesc:"Fügt ab Stufe 2 Unterstützungsangriffe hinzu.",companionLocked:"Schaltet Unterstützungsangriffe auf Stufe 2 frei.",companionCurrent:"Unterstützungsangriff: {damage} Schaden alle 4 Sekunden.",companionNext:"Nächste Stufe: {damage} Schaden.",roomTower:"Späherturm",roomTowerDesc:"+1 Sternstein je Routenstufe.",level:"St.{n}",upgradeRoom:"Verbessern {cost}",upgradeRoomLabel:"{name}: für {cost} Sternsteine auf Stufe {level} verbessern. Danach: {effect}",maxRoomLabel:"{name}: Höchststufe {level}. {effect}",maxed:"Maximum"
  };

  text.it = {
    title:"Fortezza delle Sfere Animali",language:"Lingua",backToLobby:"Torna alla lobby",fortressRooms:"Sale della fortezza",arenaLabel:"Arena della Fortezza delle Sfere Animali",soundTitle:"Audio",enableSound:"Attiva audio",disableSound:"Disattiva audio",menuTitle:"Dirigi la sfera spirituale nella fortezza di cristallo.",menuHint:"Scegli un percorso, pianifica i rimbalzi e proteggi il nucleo della fortezza.",bestRaid:"Percorso migliore",starStones:"Pietre Stellari",diamonds:"Diamanti",openRaidMap:"Scegli percorso",raidMap:"Mappa dei percorsi",battleReturnDecision:"Metti in pausa e controlla le opzioni di uscita",pause:"Pausa",pausedTitle:"Incursione in pausa",pausedText:"La fortezza è ferma. Riprendi per continuare questa incursione oppure torna alla Mappa dei percorsi per abbandonare l'ondata e le benedizioni temporanee.",resume:"Riprendi",raidTiers:"Percorsi d'incursione",returnMain:"Torna alla schermata principale",fortressWorkshop:"Officina della fortezza",stageProgress:"{unlocked}/30 percorsi sbloccati · 3 ondate ciascuno",tierLocked:"Bloccato",enterRaid:"Entra",nextStage:"Percorso successivo",
    tier1Name:"Porta di Cristallo",tier1Desc:"Impara i rimbalzi contro le bestie esploratrici.",tier2Name:"Galleria del Muschio",tier2Desc:"Arrivano più nemici con armature più resistenti.",tier3Name:"Cortile dell'Eco",tier3Desc:"Resisti all'assalto più intenso e al golem finale.",tier4Name:"Corona della Foresta",tier5Name:"Ponte di Spine",tier6Name:"Giardino Velenoso",tier7Name:"Labirinto di Radici",tier8Name:"Guardiano della Palude",tier9Name:"Scalinata Lunare",tier10Name:"Galleria dei Fuochi Fatui",tier11Name:"Rovine degli Specchi",tier12Name:"Sentinella Lunare",tier13Name:"Porta dell'Eclissi",tier14Name:"Sala del Cristallo Nero",tier15Name:"Fornace delle Ombre",tier16Name:"Reggente dell'Eclissi",tier17Name:"Accesso del Golem",tier18Name:"Fonderia del Nucleo",tier19Name:"Ultimo Bastione",tier20Name:"Cuore della Fortezza",
    zone1Desc:"Le pattuglie del bosco di cristallo mettono alla prova i rimbalzi precisi.",zone2Desc:"Le bestie spinose usano armature e corsie affollate.",zone3Desc:"I fuochi fatui lunari attraversano rapidamente le sale in rovina.",zone4Desc:"Le truppe dell'eclissi avanzano dietro scudi di cristallo.",zone5Desc:"Le guardie del golem combinano tutte le minacce precedenti.",ruleFormation:"Formazione",ruleSwarm:"Sciame",ruleArmored:"Corazzati",ruleGuardian:"Guardia d'élite",tierShort:"P{tier}",wave:"Ondata",waves:"ondate",core:"Nucleo",shots:"Tiri",
    aimHint:"Trascina dal lanciatore, controlla la traiettoria di rimbalzo e rilascia.",keyboardAim:"Angolo {angle}° dal centro. Regola con Sinistra/Destra; premi Spazio o Invio per tirare.",arenaControlLabel:"Arena della Fortezza delle Sfere Animali. Angolo di {angle} gradi dal centro. Usa le frecce Sinistra e Destra per regolare; premi Spazio o Invio per tirare.",arenaControlReadyLabel:"Arena della Fortezza delle Sfere Animali. Angolo di {angle} gradi dal centro. Usa le frecce Sinistra e Destra per regolare. Sfera pronta; premi Spazio o Invio per tirare.",arenaControlCooldownLabel:"Arena della Fortezza delle Sfere Animali. Angolo di {angle} gradi dal centro. La sfera si ricarica per circa {seconds} secondi; non puoi ancora tirare.",arenaControlLimitLabel:"Arena della Fortezza delle Sfere Animali. Angolo di {angle} gradi dal centro. Sono in volo {active}/{limit} sfere spirituali, il limite massimo; non puoi ancora tirare.",orbReady:"Sfera pronta. Fai rimbalzare i tiri sulle bestie d'ombra prima che raggiungano il nucleo.",orbFlying:"La sfera spirituale è in volo. Osserva i rimbalzi e prepara il prossimo angolo.",fortressHit:"Una bestia d'ombra ha colpito il nucleo. Mira prima o usa angoli più ampi.",waveClear:"Ondata completata. Scegli una benedizione prima della prossima ondata.",chooseUpgrade:"Scegli una benedizione della fortezza",reroll:"Rinnova per 3 Diamanti",rerolled:"Scelte delle reliquie rinnovate.",rerollNeed:"Servono 3 Diamanti. Saldo attuale {balance}/3.",rerollConfirm:"Conferma 3 · {before}→{after}",rerollDecision:"Rinnova tutte e tre le benedizioni una volta in questa ondata. Tocca di nuovo per confermare: {before} → {after} Diamanti.",rerollLabel:"Rinnova tutte e tre le benedizioni una volta in questa ondata. Costa 3 Diamanti. Saldo attuale {balance}.",rerollConfirmLabel:"Conferma un rinnovo delle benedizioni. Spendi 3 Diamanti. Saldo da {before} a {after}.",retry:"Riprova",
    raidClear:"Incursione completata",raidFailed:"Incursione fallita",resultWin:"Hai completato il percorso {tier}, ondata {wave}/3, ottenuto {stones} Pietre Stellari e protetto {core} PV del nucleo.",resultLose:"Hai raggiunto il percorso {tier}, ondata {wave}/3, e ottenuto {stones} Pietre Stellari. Migliora le sale e prova una traiettoria più sicura.",progressUnlocked:"Progresso salvato: {total} Pietre Stellari totali; il percorso {best} è ora sbloccato.",progressComplete:"Progresso salvato: {total} Pietre Stellari totali; tutti i 30 percorsi sono completati.",ruleBank:"Traiettoria di rimbalzo",rulePriority:"Ordine dei bersagli",ruleAnchor:"Ancora spinosa",ruleArmor:"Rompi armatura",rulePhase:"Tempi di fase",rulePylon:"Piloni a specchio",ruleSplitter:"Divisori di cristallo",ruleCharge:"Corsie di carica",ruleMastery:"Padronanza combinata",ruleBoss:"Contromossa del boss",
    bossCueRootbound:"La guardia di radici è attiva: spezzala, poi colpisci il cristallo esposto sul petto.",bossCueBramble:"Placche di rovi e ancore spinose proteggono il Colosso.",bossCueLunar:"La Matriarca sta cambiando fase: attendi che gli anelli lunari si aprano.",bossCuePrism:"Lo scudo prismatico ruota: attacca quando il segmento dorato è rivolto in avanti.",bossCueTempest:"Corsia di carica segnalata: il Guardiano è vulnerabile dopo lo scatto.",bossCueVoid:"La fase del Nucleo Vuoto è cambiata: elimina la scorta e segui il nucleo illuminato.",progressSaved:"Progresso salvato: {total} Pietre Stellari totali; il miglior percorso sbloccato resta {best}.",reportWin:"Rapporto abilità: logica e reazione solide. Hai protetto la fortezza pianificando rimbalzi e potenziamenti.",reportLose:"Rapporto abilità: buon allenamento. La prossima volta mira prima e usa le pareti per colpire più bestie.",
    upgradeDamage:"Sfera Maggiore",upgradeDamageDesc:"+1 danno della sfera.",upgradeSplit:"Sfera Divisa",upgradeSplitDesc:"Aggiunge una terza sfera eco a ogni tiro.",upgradePierce:"Luce Perforante",upgradePierceDesc:"La sfera può colpire di nuovo la stessa bestia più rapidamente.",upgradeRecharge:"Ricarica Rapida",upgradeRechargeDesc:"Prepara prima il tiro successivo.",upgradeShield:"Scudo del Nucleo",upgradeShieldDesc:"Ripristina 4 PV del nucleo.",upgradeMagnet:"Magnete Esploratore",upgradeMagnetDesc:"+2 Pietre Stellari dopo l'incursione.",roomForge:"Forgia delle Sfere",roomForgeDesc:"+1 danno base della sfera per livello.",roomShield:"Scudo del Nucleo",roomShieldDesc:"+4 PV iniziali del nucleo per livello.",roomDen:"Rifugio dei Compagni",roomDenDesc:"Aggiunge attacchi di supporto dal livello 2.",companionLocked:"Sblocca gli attacchi di supporto al Liv. 2.",companionCurrent:"Attacco di supporto: {damage} danni ogni 4 s.",companionNext:"Livello successivo: {damage} danni.",roomTower:"Torre degli Esploratori",roomTowerDesc:"+1 Pietra Stellare bonus per livello del percorso.",level:"Liv.{n}",upgradeRoom:"Migliora {cost}",upgradeRoomLabel:"{name}: migliora al Liv.{level} per {cost} Pietre Stellari. Risultato: {effect}",maxRoomLabel:"{name}: livello massimo Liv.{level}. {effect}",maxed:"Massimo"
  };

  text.ja = {
    title:"アニマル・オーブ・フォートレス",language:"言語",backToLobby:"ロビーへ戻る",fortressRooms:"要塞の施設",arenaLabel:"アニマル・オーブ・フォートレスの戦場",soundTitle:"サウンド",enableSound:"サウンドをオン",disableSound:"サウンドをオフ",menuTitle:"精霊オーブを操り、クリスタル要塞を守ろう。",menuHint:"レイドルートを選び、反射コースを考えて要塞コアを守ります。",bestRaid:"最高到達ルート",starStones:"スターストーン",diamonds:"ダイヤモンド",openRaidMap:"レイドを選ぶ",raidMap:"レイドマップ",battleReturnDecision:"レイドを一時停止して退出先を確認",pause:"一時停止",pausedTitle:"レイド一時停止",pausedText:"要塞の時間は止まっています。再開すると現在のレイドを続行し、レイドマップへ戻ると今のウェーブと一時強化を破棄します。",resume:"再開",raidTiers:"レイドルート",returnMain:"メインへ戻る",fortressWorkshop:"要塞工房",stageProgress:"{unlocked}/30 ルート解放 ・ 各3ウェーブ",tierLocked:"ロック中",enterRaid:"挑戦",nextStage:"次のステージ",
    tier1Name:"クリスタルゲート",tier1Desc:"偵察獣を相手に壁反射を学びます。",tier2Name:"苔の回廊",tier2Desc:"装甲を持つ敵が増えます。",tier3Name:"こだまの中庭",tier3Desc:"強襲をしのぎ、最後のゴーレムを倒します。",tier4Name:"森の王冠",tier5Name:"いばら橋",tier6Name:"毒花園",tier7Name:"根の迷宮",tier8Name:"湿地の守護者",tier9Name:"月の階段",tier10Name:"ウィスプ回廊",tier11Name:"鏡の遺跡",tier12Name:"月光の番人",tier13Name:"日蝕の門",tier14Name:"黒水晶の広間",tier15Name:"影の炉",tier16Name:"日蝕の王座",tier17Name:"ゴーレム前線",tier18Name:"コア工房",tier19Name:"最後の砦",tier20Name:"要塞の心臓",
    zone1Desc:"クリスタルの森で基本の反射射撃を試します。",zone2Desc:"装甲と混雑した進路を使ういばら獣が現れます。",zone3Desc:"月のウィスプが遺跡を素早く移動します。",zone4Desc:"日蝕軍が水晶の盾を構えて進みます。",zone5Desc:"ゴーレム軍がこれまでの脅威を組み合わせます。",ruleFormation:"陣形",ruleSwarm:"群れ",ruleArmored:"装甲",ruleGuardian:"精鋭護衛",tierShort:"R{tier}",wave:"ウェーブ",core:"コア",shots:"発射数",
    aimHint:"発射台からドラッグし、反射コースを確認して離します。",keyboardAim:"中央から{angle}度。左右キーで調整し、SpaceまたはEnterで発射。",arenaControlLabel:"アニマル・オーブ・フォートレスの戦場。中央から{angle}度。左右キーで調整し、SpaceまたはEnterで発射します。",arenaControlReadyLabel:"アニマル・オーブ・フォートレスの戦場。中央から{angle}度。オーブ準備完了。SpaceまたはEnterで発射できます。",arenaControlCooldownLabel:"アニマル・オーブ・フォートレスの戦場。中央から{angle}度。再充填まで約{seconds}秒。まだ発射できません。",arenaControlLimitLabel:"アニマル・オーブ・フォートレスの戦場。中央から{angle}度。精霊オーブが{active}/{limit}個飛行中で上限です。まだ発射できません。",orbReady:"オーブ準備完了。影獣がコアへ着く前に壁反射で攻撃しましょう。",orbFlying:"精霊オーブが飛行中です。反射コースを見て次の狙いを準備しましょう。",fortressHit:"影獣がコアを攻撃しました。早めに狙うか、角度を広げましょう。",waveClear:"ウェーブクリア。次へ進む前に祝福を1つ選びます。",chooseUpgrade:"要塞の祝福を選ぶ",reroll:"ダイヤ3個で再抽選",rerolled:"祝福の候補を更新しました。",rerollNeed:"ダイヤが3個必要です。現在{balance}/3個。",rerollConfirm:"3個消費を確認 ・ {before}→{after}",rerollDecision:"このウェーブで一度だけ3つの祝福を更新します。もう一度押して確認：ダイヤ{before}→{after}。",rerollLabel:"このウェーブで一度だけ3つの祝福を更新します。ダイヤ3個。現在{balance}個。",rerollConfirmLabel:"祝福の再抽選を確認。ダイヤ3個を消費し、残高は{before}から{after}になります。",retry:"再挑戦",
    raidClear:"レイドクリア",raidFailed:"レイド失敗",resultWin:"ルート{tier}のウェーブ{wave}/3を突破し、スターストーン{stones}個を獲得。コアHPを{core}守りました。",resultLose:"ルート{tier}のウェーブ{wave}/3まで到達し、スターストーン{stones}個を獲得。施設を強化して安全な反射コースを試しましょう。",progressUnlocked:"進行を保存しました。スターストーン合計{total}個。ルート{best}を解放しました。",progressComplete:"進行を保存しました。スターストーン合計{total}個。全30ルートをクリアしました。",ruleBank:"反射コース",rulePriority:"標的の優先順",ruleAnchor:"いばらアンカー",ruleArmor:"装甲破壊",rulePhase:"位相の見極め",rulePylon:"鏡の支柱",ruleSplitter:"水晶分裂体",ruleCharge:"突進レーン",ruleMastery:"複合攻略",ruleBoss:"ボス対策",
    bossCueRootbound:"根の防壁が上がりました。破壊して胸の水晶を狙いましょう。",bossCueBramble:"いばら装甲とアンカーが巨像を守っています。",bossCueLunar:"女王が位相移動中です。月輪が開くまで待ちましょう。",bossCuePrism:"プリズム盾が回転中。金色の面が正面を向いた時に攻撃します。",bossCueTempest:"突進レーンが表示されました。突進後が攻撃の好機です。",bossCueVoid:"ヴォイドコアの段階が変化。護衛を倒し、光るコアを追いましょう。",progressSaved:"進行を保存しました。スターストーン合計{total}個。最高解放ルートは{best}です。",reportWin:"スキルレポート：論理力と反応力を発揮し、反射計画と強化選択で要塞を守りました。",reportLose:"スキルレポート：良い練習でした。次は早めに狙い、壁で複数の敵を攻撃しましょう。",
    upgradeDamage:"大型オーブ",upgradeDamageDesc:"オーブの攻撃力+1。",upgradeSplit:"分裂オーブ",upgradeSplitDesc:"発射ごとに3個目の反響オーブを追加。",upgradePierce:"貫通の輝き",upgradePierceDesc:"同じ敵へ再び当たるまでの時間を短縮。",upgradeRecharge:"高速充填",upgradeRechargeDesc:"次の発射準備が早くなります。",upgradeShield:"コアシールド",upgradeShieldDesc:"コアHPを4回復。",upgradeMagnet:"偵察マグネット",upgradeMagnetDesc:"レイド終了時のスターストーン+2。",roomForge:"オーブ鍛冶場",roomForgeDesc:"レベルごとに基本オーブ攻撃力+1。",roomShield:"コア防壁",roomShieldDesc:"レベルごとに開始コアHP+4。",roomDen:"仲間の巣",roomDenDesc:"レベル2から援護攻撃を追加。",companionLocked:"レベル2で援護攻撃を解放。",companionCurrent:"援護攻撃：4秒ごとに{damage}ダメージ。",companionNext:"次のレベル：{damage}ダメージ。",roomTower:"偵察塔",roomTowerDesc:"レイドレベルごとにボーナススターストーン+1。",level:"Lv.{n}",upgradeRoom:"強化 {cost}",upgradeRoomLabel:"{name}：スターストーン{cost}個でLv.{level}へ強化。効果：{effect}",maxRoomLabel:"{name}：最大レベルLv.{level}。{effect}",maxed:"最大"
  };

  text["zh-Hans"] = {
    orbReady: "星珠已准备好。用墙面反弹击中影兽，别让它们靠近核心。",
  };

  Object.assign(text["zh-Hans"], {
    arenaLabel: "动物星珠要塞竞技场",
    arenaControlLabel: "动物星珠要塞竞技场。瞄准偏移 {angle} 度。使用左右方向键调整，按空格键或 Enter 发射。",
    arenaControlReadyLabel: "动物星珠要塞竞技场。瞄准偏移 {angle} 度。星珠已准备好；按空格键或 Enter 立即发射。",
    arenaControlCooldownLabel: "动物星珠要塞竞技场。瞄准偏移 {angle} 度。星珠还需约 {seconds} 秒冷却；暂时无法发射。",
    arenaControlLimitLabel: "动物星珠要塞竞技场。瞄准偏移 {angle} 度。目前有 {active}/{limit} 颗星珠飞行中，已达上限；暂时无法发射。",
  });
  text.ko = {
    arenaLabel: "애니멀 오브 포트리스 전장",
    arenaControlLabel: "애니멀 오브 포트리스 전장. 중앙에서 {angle}도 조준합니다. 왼쪽과 오른쪽 화살표로 조정하고 Space 또는 Enter로 발사하세요.",
    arenaControlReadyLabel: "애니멀 오브 포트리스 전장. 중앙에서 {angle}도 조준합니다. 오브가 준비되었습니다. Space 또는 Enter로 지금 발사하세요.",
    arenaControlCooldownLabel: "애니멀 오브 포트리스 전장. 중앙에서 {angle}도 조준합니다. 오브 재충전까지 약 {seconds}초 남았습니다. 아직 발사할 수 없습니다.",
    arenaControlLimitLabel: "애니멀 오브 포트리스 전장. 중앙에서 {angle}도 조준합니다. 정령 오브 {active}/{limit}개가 비행 중이며 한도에 도달했습니다. 아직 발사할 수 없습니다.",
  };
  text["pt-BR"] = {
    arenaLabel: "Arena da Fortaleza de Orbes Animais",
    arenaControlLabel: "Arena da Fortaleza de Orbes Animais. Mira a {angle} graus do centro. Use as setas Esquerda e Direita para ajustar; Espaço ou Enter dispara.",
    arenaControlReadyLabel: "Arena da Fortaleza de Orbes Animais. Mira a {angle} graus do centro. Orbe pronto; Espaço ou Enter dispara agora.",
    arenaControlCooldownLabel: "Arena da Fortaleza de Orbes Animais. Mira a {angle} graus do centro. O orbe recarrega por cerca de {seconds} segundos; ainda não é possível disparar.",
    arenaControlLimitLabel: "Arena da Fortaleza de Orbes Animais. Mira a {angle} graus do centro. Há {active}/{limit} orbes espirituais em voo, o limite ativo; ainda não é possível disparar.",
  };
  text.ru = {
    arenaLabel: "Арена Крепости звериных сфер",
    arenaControlLabel: "Арена Крепости звериных сфер. Прицел смещён от центра на {angle} градусов. Используйте стрелки влево и вправо; Пробел или Enter — выстрел.",
    arenaControlReadyLabel: "Арена Крепости звериных сфер. Прицел смещён от центра на {angle} градусов. Сфера готова; Пробел или Enter — выстрел.",
    arenaControlCooldownLabel: "Арена Крепости звериных сфер. Прицел смещён от центра на {angle} градусов. До перезарядки около {seconds} секунд; стрелять пока нельзя.",
    arenaControlLimitLabel: "Арена Крепости звериных сфер. Прицел смещён от центра на {angle} градусов. В полёте {active}/{limit} духовных сфер — достигнут предел; стрелять пока нельзя.",
  };
  text.hi = {
    arenaLabel: "एनिमल ऑर्ब किले का युद्ध क्षेत्र",
    arenaControlLabel: "एनिमल ऑर्ब किले का युद्ध क्षेत्र। केंद्र से {angle} डिग्री पर निशाना है। बाएँ और दाएँ तीर से समायोजित करें; स्पेस या एंटर कुंजी से दागें।",
    arenaControlReadyLabel: "एनिमल ऑर्ब किले का युद्ध क्षेत्र। केंद्र से {angle} डिग्री पर निशाना है। ऑर्ब तैयार है; स्पेस या एंटर कुंजी से अभी दागें।",
    arenaControlCooldownLabel: "एनिमल ऑर्ब किले का युद्ध क्षेत्र। केंद्र से {angle} डिग्री पर निशाना है। ऑर्ब को फिर तैयार होने में लगभग {seconds} सेकंड हैं; अभी नहीं दाग सकते।",
    arenaControlLimitLabel: "एनिमल ऑर्ब किले का युद्ध क्षेत्र। केंद्र से {angle} डिग्री पर निशाना है। {active}/{limit} स्पिरिट ऑर्ब उड़ रहे हैं और सीमा पूरी है; अभी नहीं दाग सकते।",
  };
  Object.assign(text.hi, {
    waves: "लहरें",
    ruleBoss: "बॉस का प्रतिकार",
    pause: "विराम",
    pausedTitle: "हमला रुका हुआ है",
    pausedText: "किले की लड़ाई रुकी हुई है। इस हमले को जारी रखने के लिए खेल जारी रखें, या मौजूदा लहर और अस्थायी आशीर्वाद छोड़ने के लिए मार्ग मानचित्र चुनें।",
    resume: "जारी रखें",
    raidMap: "मार्ग मानचित्र",
    aimHint: "लॉन्चर से खींचकर निशाना लगाएँ, टकराकर लौटने वाला रास्ता देखें, फिर छोड़ें।",
    keyboardAim: "केंद्र से {angle}° पर निशाना है। बाएँ/दाएँ तीर से बदलें; Space या Enter से दागें।",
    arenaControlLabel: "एनिमल ऑर्ब किले का युद्ध क्षेत्र। केंद्र से {angle} डिग्री पर निशाना है। बाएँ और दाएँ तीर से समायोजित करें; Space या Enter से दागें।",
    arenaControlReadyLabel: "एनिमल ऑर्ब किले का युद्ध क्षेत्र। केंद्र से {angle} डिग्री पर निशाना है। ऑर्ब तैयार है; Space या Enter से अभी दागें।",
    arenaControlCooldownLabel: "एनिमल ऑर्ब किले का युद्ध क्षेत्र। केंद्र से {angle} डिग्री पर निशाना है। ऑर्ब को फिर तैयार होने में लगभग {seconds} सेकंड लगेंगे; अभी दाग नहीं सकते।",
    arenaControlLimitLabel: "एनिमल ऑर्ब किले का युद्ध क्षेत्र। केंद्र से {angle} डिग्री पर निशाना है। {active}/{limit} स्पिरिट ऑर्ब उड़ रहे हैं और सक्रिय सीमा पूरी है; अभी दाग नहीं सकते।",
  });
  text.ar = {
    arenaLabel: "ساحة حصن كرات الحيوانات",
    arenaControlLabel: "ساحة حصن كرات الحيوانات. التصويب بزاوية {angle} درجة من المركز. استخدم سهمي اليسار واليمين للضبط، واضغط مفتاح المسافة أو الإدخال للإطلاق.",
    arenaControlReadyLabel: "ساحة حصن كرات الحيوانات. التصويب بزاوية {angle} درجة من المركز. الكرة جاهزة؛ اضغط مفتاح المسافة أو الإدخال للإطلاق الآن.",
    arenaControlCooldownLabel: "ساحة حصن كرات الحيوانات. التصويب بزاوية {angle} درجة من المركز. تبقّى نحو {seconds} ثانية لإعادة الشحن؛ لا يمكن الإطلاق الآن.",
    arenaControlLimitLabel: "ساحة حصن كرات الحيوانات. التصويب بزاوية {angle} درجة من المركز. توجد {active}/{limit} كرات روحية في الجو، وهو الحد الأقصى؛ لا يمكن الإطلاق الآن.",
  };

  const assets = {
    bg: "../../assets/animal-orb-fortress-arena-bg.webp",
    lion: "../../assets/weightplay-boom-mane-lion.png",
    orbs: "../../assets/animal-orb-fortress-orb-set.webp",
    beasts: "../../assets/animal-orb-fortress-shadow-beasts.webp",
    bossRootbound: "../../assets/animal-orb-fortress-boss-golem.webp",
    bossBrambleback: "../../assets/animal-orb-fortress-boss-brambleback.webp",
    bossLunarWisp: "../../assets/animal-orb-fortress-boss-lunar-wisp.webp",
    bossPrismShell: "../../assets/animal-orb-fortress-boss-prism-shell.webp",
    bossTempestHorn: "../../assets/animal-orb-fortress-boss-tempest-horn.webp",
    bossVoidcore: "../../assets/animal-orb-fortress-boss-voidcore-emperor.webp",
    revive: "../../assets/animal-orb-fortress-diamond-revive.webp",
    fx: "../../assets/animal-orb-fortress-fx.webp",
  };

  const pageMeta = {
    ja: {
      title: "アニマル・オーブ・フォートレス - 無料反射アクションゲーム",
      description: "精霊オーブを狙い、特殊な敵、動く鏡の支柱、6体の個性的なボスが待つ30の要塞防衛ルートに挑戦します。",
      ogDescription: "壁と支柱の反射コースを考え、装甲、位相移動、分裂体、突進獣を攻略して6体のボスを倒しましょう。",
      twitterDescription: "6地域・30ルートの反射バトルでクリスタルコアを守り、要塞を成長させるアニマルアクションゲーム。",
    },
    en: {
      title: "Animal Orb Fortress - Free Animal Ricochet Roguelite",
      description: "Aim spirit orbs through 30 ricochet-defense routes with special enemies, moving mirror pylons, six unique Bosses, and local fortress growth.",
      ogDescription: "Plan wall and pylon bank shots across 30 routes, counter armor, phase, splitters and chargers, then defeat six rule-changing Bosses.",
      twitterDescription: "Protect the crystal core through 30 authored ricochet routes, six regions, special enemies, and six distinct Boss battles.",
    },
    "zh-Hant": {
      title: "動物星珠要塞 - 免費動物反彈 Roguelite",
      description: "瞄準星珠挑戰 30 關反彈防守路線，反制特殊敵人與移動鏡面柱，擊敗六名獨特 Boss，並累積本機要塞成長。",
      ogDescription: "規劃牆面與鏡柱反彈，穿越六區 30 關，對抗護甲、相位、分裂與衝鋒敵人，再擊敗六名規則不同的 Boss。",
      twitterDescription: "守住水晶核心，完成 30 條特製反彈路線、六個區域、特殊敵人與六場不同 Boss 戰。",
    },
    es: {
      title: "Fortaleza de Orbes Animal - Juego de rebotes",
      description: "Apunta orbes espirituales por 30 rutas defensivas con enemigos especiales, pilares espejo móviles, seis jefes únicos y crecimiento local.",
      ogDescription: "Planifica rebotes contra muros y pilares en 30 rutas, contrarresta armadura, fases, divisores y cargadores, y derrota seis jefes.",
      twitterDescription: "Protege el núcleo de cristal en 30 rutas de rebote, seis regiones, enemigos especiales y seis jefes distintos.",
    },
  };

  pageMeta.it = {
    title: "Fortezza delle Sfere Animali - Gioco di rimbalzi",
    description: "Mira le sfere spirituali lungo 30 percorsi difensivi con nemici speciali, piloni a specchio mobili, sei boss unici e potenziamenti della fortezza.",
    ogDescription: "Pianifica rimbalzi su pareti e piloni in 30 percorsi, contrasta armature, fasi, divisori e assalitori, poi sconfiggi sei boss.",
    twitterDescription: "Proteggi il nucleo di cristallo in 30 percorsi a rimbalzo, sei regioni, nemici speciali e sei battaglie contro boss distinti.",
  };

  const roomDefs = [
    { id: "forge", iconSrc: "../../assets/animal-orb-fortress-room-icon-1.webp", name: "roomForge", desc: "roomForgeDesc" },
    { id: "shield", iconSrc: "../../assets/animal-orb-fortress-room-icon-3.webp", name: "roomShield", desc: "roomShieldDesc" },
    { id: "den", iconSrc: "../../assets/animal-orb-fortress-room-icon-2.webp", name: "roomDen", desc: "roomDenDesc" },
    { id: "tower", iconSrc: "../../assets/animal-orb-fortress-room-icon-4.webp", name: "roomTower", desc: "roomTowerDesc" },
  ];
  const route = (tier, zone, enName, zhName, enDesc, zhDesc, rule) => ({
    tier,
    zone,
    name: { en: enName, "zh-Hant": zhName },
    desc: { en: enDesc, "zh-Hant": zhDesc },
    rule,
  });
  const raidDefs = [
    route(1, 1, "Crystal Gate", "水晶門", "Time direct shots against one slow skitter lane.", "對單一路線的緩慢疾行獸練習直接射擊時機。", "rulePriority"),
    route(2, 1, "Moss Arcade", "苔痕長廊", "Use the first wall bank around a blocked center lane.", "利用第一次牆面反彈繞過中央阻線。", "ruleBank"),
    route(3, 1, "Echo Courtyard", "回音庭院", "Choose a left or right bank for separated enemy lanes.", "在分離的敵方路線間選擇左側或右側反彈。", "ruleBank"),
    route(4, 1, "Split Passage", "分岔通道", "Break the thorn blocker before mobile enemies pass it.", "先打掉荊棘阻擋者，避免移動敵人趁機通過。", "rulePriority"),
    route(5, 1, "Rootbound Crown", "盤根王冠", "Break the first Boss guard and bank into its weak point.", "擊破第一名 Boss 的防護，再反彈命中弱點。", "ruleBoss"),
    route(6, 2, "Thorn Bridge", "荊棘橋", "Remove one-hit armor before the backline wisp escapes.", "先解除一擊護甲，再處理即將通過的後排幽光。", "ruleArmor"),
    route(7, 2, "Venom Garden", "毒霧花園", "Destroy a thorn anchor that protects adjacent beasts.", "摧毀會保護鄰近影獸的荊棘錨點。", "ruleAnchor"),
    route(8, 2, "Root Labyrinth", "盤根迷宮", "Pick a bank lane between two armored columns.", "在兩列裝甲敵人之間選擇反彈路線。", "ruleArmor"),
    route(9, 2, "Bramble Wall", "荊棘壁壘", "Counter an anchor and armored charger together.", "同時反制錨點與裝甲衝鋒獸。", "ruleAnchor"),
    route(10, 2, "Thornworks Throne", "荊棘工坊王座", "Break two Boss armor plates while clearing anchors.", "清除錨點並擊破 Boss 的兩層荊棘甲片。", "ruleBoss"),
    route(11, 3, "Moon Stair", "月光階梯", "Read the first visible phase and reappearance cue.", "讀懂第一次相位消失與重新出現提示。", "rulePhase"),
    route(12, 3, "Wisp Gallery", "幽光迴廊", "Track two wisps phasing on alternating rhythms.", "追蹤兩隻交錯進入相位的幽光獸。", "rulePhase"),
    route(13, 3, "Mirror Ruins", "鏡面遺跡", "Aim through a moving moon gate that changes the bank corridor.", "穿過會移動的月門，因應反彈通道改變。", "rulePylon"),
    route(14, 3, "Lunar Crossing", "月輪交會", "Combine phase timing with a moving reflection gate.", "把相位時機與移動反射門結合。", "rulePhase"),
    route(15, 3, "Moonwell Sentinel", "月井守衛", "Strike during the Matriarch's recovery after a moon dash.", "在月靈女王衝刺後的恢復時間攻擊。", "ruleBoss"),
    route(16, 4, "Eclipse Gate", "蝕影之門", "Use the first fixed mirror pylon as a new bounce surface.", "把第一座固定鏡面柱當作新的反彈面。", "rulePylon"),
    route(17, 4, "Black Crystal Hall", "黑晶大廳", "Defeat a splitter before its two shards spread.", "在分裂獸化成兩枚碎片前集中擊倒。", "ruleSplitter"),
    route(18, 4, "Prism Foundry", "稜晶鑄造場", "Choose between two pylon corridors and an armored escort.", "在兩條鏡柱通道與裝甲護衛間做選擇。", "rulePylon"),
    route(19, 4, "Shard Circuit", "碎晶迴路", "React when moving pylons invalidate the old shot angle.", "鏡柱移動使舊角度失效時重新規劃。", "ruleSplitter"),
    route(20, 4, "Mirror Vault Regent", "鏡庫攝政王", "Bank into the lit segment of a rotating Boss shield.", "反彈命中 Boss 旋轉護盾上發光的盾片。", "ruleBoss"),
    route(21, 5, "Storm Causeway", "風暴堤道", "Read the first marked lane before a charger rushes.", "在衝鋒獸突進前讀取第一次路線標記。", "ruleCharge"),
    route(22, 5, "Thunder Gallery", "雷鳴長廊", "Track two chargers alternating lane marks.", "追蹤兩隻交錯標記路線的衝鋒獸。", "ruleCharge"),
    route(23, 5, "Gale Foundry", "疾風鑄造場", "Adapt when storm pulses change orb speed.", "風暴脈衝改變星珠速度時調整射擊。", "ruleCharge"),
    route(24, 5, "Last Bastion", "最終壁壘", "Combine lane shifts, charges, and storm timing.", "結合路線位移、衝鋒與風暴時機。", "ruleMastery"),
    route(25, 5, "Tempest Crown", "暴風王冠", "Attack after the horned Boss completes its marked rush.", "在角獸 Boss 完成標記衝刺後攻擊。", "ruleBoss"),
    route(26, 6, "Golem Approach", "魔像前線", "Prioritize armored and phased enemies in one formation.", "在同一陣形中判斷裝甲與相位敵人的優先順序。", "ruleMastery"),
    route(27, 6, "Core Foundry", "核心鑄造場", "Reach splitters hiding behind thorn anchors.", "穿過荊棘錨點，處理躲在後方的分裂獸。", "ruleMastery"),
    route(28, 6, "Void Gallery", "虛空迴廊", "Aim through moving pylons while chargers mark lanes.", "衝鋒獸標記路線時，穿過移動鏡柱瞄準。", "ruleMastery"),
    route(29, 6, "Eclipse Heart", "蝕影核心", "Survive three formations using the full enemy vocabulary.", "運用所有已學規則通過三組完整敵陣。", "ruleMastery"),
    route(30, 6, "Heart of the Fortress", "要塞之心", "Break three final Boss phases, escorts, and changing pylons.", "擊破最終 Boss 三階段、護衛與變動鏡柱。", "ruleBoss"),
  ];
  const spanishRaidDefs = [
    ["Puerta de Cristal","Calcula disparos directos contra un carril lento."],["Galería de Musgo","Usa el primer rebote para rodear el centro bloqueado."],["Patio del Eco","Elige un rebote izquierdo o derecho para carriles separados."],["Pasaje Dividido","Rompe el bloqueador antes de que pasen los enemigos móviles."],["Corona Enraizada","Rompe la defensa del primer jefe y rebota hacia su punto débil."],
    ["Puente de Espinas","Quita la armadura de un golpe antes de que escape la retaguardia."],["Jardín Venenoso","Destruye un ancla que protege bestias cercanas."],["Laberinto de Raíces","Elige un rebote entre dos columnas acorazadas."],["Muro de Zarzas","Contrarresta a la vez un ancla y un cargador acorazado."],["Trono del Taller de Espinas","Rompe dos placas del jefe mientras eliminas anclas."],
    ["Escalera Lunar","Lee la primera desaparición de fase y su regreso."],["Galería de Luces","Sigue dos espíritus que alternan sus fases."],["Ruinas de Espejos","Apunta por una puerta lunar móvil que cambia el rebote."],["Cruce Lunar","Combina el momento de fase con una puerta reflectante móvil."],["Centinela del Pozo Lunar","Ataca durante la recuperación de la Matriarca tras su carrera."],
    ["Puerta del Eclipse","Usa el primer pilar fijo como nueva superficie de rebote."],["Salón de Cristal Negro","Derrota al divisor antes de que libere dos fragmentos."],["Fundición Prisma","Elige entre dos corredores de pilares y una escolta acorazada."],["Circuito de Fragmentos","Replantea el disparo cuando los pilares invaliden el ángulo."],["Regente de la Bóveda Espejo","Rebota hacia el segmento iluminado del escudo giratorio."],
    ["Calzada de Tormenta","Lee el carril marcado antes de la carga."],["Galería del Trueno","Sigue dos cargadores que alternan marcas."],["Fundición del Vendaval","Adáptate cuando los pulsos cambien la velocidad del orbe."],["Último Bastión","Combina cambios de carril, cargas y ritmo de tormenta."],["Corona de la Tempestad","Ataca después de la carrera marcada del jefe cornudo."],
    ["Acceso del Gólem","Prioriza enemigos acorazados y en fase en una formación."],["Fundición del Núcleo","Alcanza divisores ocultos tras anclas de espinas."],["Galería del Vacío","Apunta por pilares móviles mientras se marcan carriles."],["Corazón del Eclipse","Supera tres formaciones usando todas las reglas aprendidas."],["Corazón de la Fortaleza","Rompe tres fases finales, escoltas y pilares cambiantes."]
  ];
  raidDefs.forEach((raid,index)=>{raid.name.es=spanishRaidDefs[index][0];raid.desc.es=spanishRaidDefs[index][1];});
  const frenchRaidDefs = [
    ["Porte de Cristal","Calculez des tirs directs contre un couloir lent."],["Galerie de Mousse","Utilisez le premier ricochet mural pour contourner le centre bloqué."],["Cour de l'Écho","Choisissez le mur gauche ou droit pour atteindre les couloirs séparés."],["Passage Scindé","Brisez le barrage épineux avant le passage des ennemis mobiles."],["Couronne des Racines","Brisez la garde du premier boss et ricochez vers son point faible."],
    ["Pont d'Épines","Retirez l'armure avant la fuite du feu follet en retrait."],["Jardin Venimeux","Détruisez une ancre épineuse qui protège les bêtes proches."],["Labyrinthe des Racines","Choisissez un couloir de ricochet entre deux colonnes blindées."],["Mur de Ronces","Affrontez ensemble une ancre et un assaillant blindé."],["Trône des Ronces","Brisez deux plaques du boss tout en éliminant les ancres."],
    ["Escalier Lunaire","Repérez le premier signal de disparition et de retour en phase."],["Galerie des Feux Follets","Suivez deux feux follets qui alternent leurs phases."],["Ruines aux Miroirs","Visez à travers une porte lunaire mobile qui modifie le ricochet."],["Croisée Lunaire","Combinez le rythme des phases avec une porte réfléchissante mobile."],["Sentinelle du Puits Lunaire","Frappez pendant la récupération de la Matriarche après sa ruée."],
    ["Porte de l'Éclipse","Utilisez le premier pylône fixe comme nouvelle surface de ricochet."],["Salle du Cristal Noir","Battez le scindaire avant qu'il ne libère ses deux fragments."],["Fonderie Prismatique","Choisissez entre deux couloirs de pylônes et une escorte blindée."],["Circuit des Éclats","Changez de tir quand les pylônes mobiles invalident l'ancien angle."],["Régent de la Volte aux Miroirs","Ricochez vers le segment lumineux du bouclier tournant."],
    ["Chaussée de la Tempête","Lisez le premier couloir signalé avant la charge."],["Galerie du Tonnerre","Suivez deux assaillants qui alternent leurs couloirs signalés."],["Fonderie de la Bourrasque","Adaptez-vous quand les impulsions modifient la vitesse de l'orbe."],["Dernier Bastion","Combinez changements de couloir, charges et rythme de tempête."],["Couronne de la Tempête","Attaquez après la charge signalée du boss cornu."],
    ["Approche du Golem","Donnez la priorité aux ennemis blindés et en phase dans la même formation."],["Fonderie du Noyau","Atteignez les scindaires cachés derrière les ancres épineuses."],["Galerie du Vide","Visez entre les pylônes mobiles pendant le signalement des charges."],["Cœur de l'Éclipse","Survivez à trois formations utilisant toutes les règles ennemies."],["Cœur de la Forteresse","Brisez les trois phases finales, les escortes et les pylônes mobiles."]
  ];
  raidDefs.forEach((raid,index)=>{raid.name.fr=frenchRaidDefs[index][0];raid.desc.fr=frenchRaidDefs[index][1];});
  const germanRaidDefs = [
    ["Kristalltor","Plane direkte Schüsse gegen eine langsame Angriffsbahn."],["Moosgalerie","Nutze den ersten Wandabpraller, um die blockierte Mitte zu umgehen."],["Echohof","Wähle den linken oder rechten Abpraller für getrennte Angriffsbahnen."],["Geteilter Durchgang","Zerstöre die Dornenblockade, bevor bewegliche Gegner vorbeiziehen."],["Wurzelkrone","Brich den Schutz des ersten Bosses und pralle zu seiner Schwachstelle ab."],
    ["Dornenbrücke","Entferne die Rüstung, bevor das Irrlicht im Hintergrund entkommt."],["Giftgarten","Zerstöre einen Dornenanker, der nahe Bestien schützt."],["Wurzellabyrinth","Wähle eine Abprallbahn zwischen zwei gepanzerten Reihen."],["Rankenmauer","Bekämpfe gleichzeitig einen Anker und einen gepanzerten Stürmer."],["Rankenthron","Brich zwei Bossplatten und beseitige dabei die Anker."],
    ["Mondtreppe","Erkenne das erste Signal für Phasenwechsel und Rückkehr."],["Irrlichtgalerie","Verfolge zwei Irrlichter, die abwechselnd ihre Phase wechseln."],["Spiegelruinen","Ziele durch ein bewegliches Mondtor, das die Abprallbahn verändert."],["Mondkreuzung","Verbinde Phasenrhythmus mit einem beweglichen Spiegeltor."],["Mondbrunnenwächter","Triff die Matriarchin während ihrer Erholung nach dem Mondansturm."],
    ["Finsternistor","Nutze den ersten festen Pfeiler als neue Abprallfläche."],["Schwarzkristallhalle","Besiege den Spalter, bevor er zwei schnelle Splitter freisetzt."],["Prismenschmelze","Wähle zwischen zwei Pfeilerbahnen und einer gepanzerten Eskorte."],["Splitterkreislauf","Ändere deinen Schuss, wenn bewegliche Pfeiler den alten Winkel blockieren."],["Regent der Spiegelkammer","Pralle zum leuchtenden Segment des rotierenden Boss-Schilds ab."],
    ["Sturmdamm","Lies die erste markierte Bahn, bevor der Stürmer angreift."],["Donnergalerie","Verfolge zwei Stürmer, die abwechselnd ihre Bahnen markieren."],["Sturmschmelze","Passe dich an, wenn Sturmimpulse die Kugelgeschwindigkeit verändern."],["Letzte Bastion","Verbinde Bahnwechsel, Anstürme und Sturm-Timing."],["Sturmkrone","Greife direkt nach dem markierten Ansturm des gehörnten Bosses an."],
    ["Golemvorstoß","Setze in derselben Formation Prioritäten zwischen Rüstung und Phasenwechsel."],["Kernschmelze","Erreiche Spalter, die sich hinter Dornenankern verbergen."],["Leere Galerie","Ziele zwischen beweglichen Pfeilern, während Stürmer ihre Bahnen markieren."],["Herz der Finsternis","Überstehe drei Formationen mit allen bisherigen Gegnerregeln."],["Herz der Festung","Brich alle drei letzten Bossphasen, Eskorten und beweglichen Pfeiler."]
  ];
  raidDefs.forEach((raid,index)=>{raid.name.de=germanRaidDefs[index][0];raid.desc.de=germanRaidDefs[index][1];});
  const italianRaidDefs = [
    ["Porta di Cristallo","Calcola i tiri diretti contro una corsia lenta."],["Galleria del Muschio","Usa il primo rimbalzo sulla parete per aggirare il centro bloccato."],["Cortile dell'Eco","Scegli il rimbalzo a sinistra o a destra per corsie separate."],["Passaggio Diviso","Distruggi il blocco spinoso prima che passino i nemici mobili."],["Corona delle Radici","Spezza la guardia del primo boss e rimbalza verso il suo punto debole."],
    ["Ponte di Spine","Rimuovi l'armatura prima che il fuoco fatuo nelle retrovie fugga."],["Giardino Velenoso","Distruggi un'ancora spinosa che protegge le bestie vicine."],["Labirinto di Radici","Scegli una corsia di rimbalzo tra due colonne corazzate."],["Muro di Rovi","Affronta insieme un'ancora e un assalitore corazzato."],["Trono delle Spine","Spezza due placche del boss mentre elimini le ancore."],
    ["Scalinata Lunare","Interpreta il primo segnale di fase e ricomparsa."],["Galleria dei Fuochi Fatui","Segui due fuochi fatui che alternano le loro fasi."],["Rovine degli Specchi","Mira attraverso una porta lunare mobile che cambia il corridoio di rimbalzo."],["Crocevia Lunare","Combina i tempi di fase con una porta riflettente mobile."],["Sentinella del Pozzo Lunare","Colpisci durante il recupero della Matriarca dopo lo scatto lunare."],
    ["Porta dell'Eclissi","Usa il primo pilone fisso come nuova superficie di rimbalzo."],["Sala del Cristallo Nero","Sconfiggi il divisore prima che diffonda i suoi due frammenti."],["Fonderia Prismatica","Scegli tra due corridoi di piloni e una scorta corazzata."],["Circuito dei Frammenti","Cambia tiro quando i piloni mobili rendono inutile il vecchio angolo."],["Reggente della Cripta degli Specchi","Rimbalza verso il segmento illuminato dello scudo rotante."],
    ["Passaggio della Tempesta","Leggi la prima corsia segnalata prima della carica."],["Galleria del Tuono","Segui due assalitori che alternano le corsie segnalate."],["Fonderia della Burrasca","Adattati quando gli impulsi della tempesta cambiano la velocità della sfera."],["Ultimo Bastione","Combina cambi di corsia, cariche e tempi della tempesta."],["Corona della Tempesta","Attacca dopo la carica segnalata del boss cornuto."],
    ["Accesso del Golem","Dai priorità ai nemici corazzati e in fase nella stessa formazione."],["Fonderia del Nucleo","Raggiungi i divisori nascosti dietro le ancore spinose."],["Galleria del Vuoto","Mira tra i piloni mobili mentre gli assalitori segnalano le corsie."],["Cuore dell'Eclissi","Supera tre formazioni usando tutte le regole dei nemici."],["Cuore della Fortezza","Spezza le tre fasi finali del boss, le scorte e i piloni mobili."]
  ];
  raidDefs.forEach((raid,index)=>{raid.name.it=italianRaidDefs[index][0];raid.desc.it=italianRaidDefs[index][1];});
  const japaneseRaidDefs = [
    ["クリスタルゲート","遅い偵察獣のレーンへ直接射撃するタイミングを学びます。"],["苔の回廊","中央の障害を最初の壁反射で回り込みます。"],["こだまの中庭","離れた敵レーンへ左右どちらの反射を使うか選びます。"],["分岐通路","移動する敵が通る前にいばらの障害を壊します。"],["根縛りの王冠","最初のボス防壁を破り、弱点へ反射させます。"],
    ["いばら橋","後衛のウィスプが逃げる前に一撃装甲を外します。"],["毒花園","隣接する獣を守るいばらアンカーを壊します。"],["根の迷宮","2本の装甲レーンの間から反射コースを選びます。"],["茨の壁","アンカーと装甲突進獣を同時に攻略します。"],["いばら工房の王座","アンカーを処理しながらボスの装甲板を2枚壊します。"],
    ["月の階段","最初の位相消失と再出現の合図を読みます。"],["ウィスプ回廊","交互に位相移動する2体のウィスプを追います。"],["鏡の遺跡","反射コースを変える動く月門を通して狙います。"],["月光の交差路","位相のタイミングと動く反射門を組み合わせます。"],["月井戸の番人","女王が月光突進から回復する隙を狙います。"],
    ["日蝕の門","最初の固定鏡支柱を新しい反射面として使います。"],["黒水晶の広間","分裂体が2つの欠片を広げる前に倒します。"],["プリズム工房","2本の支柱回廊と装甲護衛のどちらを狙うか選びます。"],["欠片回路","動く支柱で古い射角が使えなくなったら狙い直します。"],["鏡の宝物庫の王","回転するボス盾の光る面へ反射させます。"],
    ["嵐の土手道","突進獣が走る前に最初の予告レーンを読みます。"],["雷鳴回廊","交互にレーンを示す2体の突進獣を追います。"],["疾風工房","嵐の波動でオーブ速度が変わったら狙いを調整します。"],["最後の砦","レーン移動、突進、嵐のタイミングを組み合わせます。"],["嵐角の王冠","角を持つボスが予告突進を終えた直後に攻撃します。"],
    ["ゴーレム前線","同じ陣形にいる装甲敵と位相敵の優先順を決めます。"],["コア工房","いばらアンカーの後ろに隠れた分裂体を狙います。"],["虚空回廊","突進レーンを避けながら動く支柱越しに狙います。"],["日蝕の心臓","これまでの敵ルールを使う3つの陣形を突破します。"],["要塞の心臓","最終ボスの3段階、護衛、変化する支柱を攻略します。"]
  ];
  raidDefs.forEach((raid,index)=>{raid.name.ja=japaneseRaidDefs[index][0];raid.desc.ja=japaneseRaidDefs[index][1];});
  const bossDefs = [
    { tier: 5, id: "rootbound", imageKey: "bossRootbound", name: { en: "Rootbound Golem", "zh-Hant": "盤根魔像" }, cue: "bossCueRootbound" },
    { tier: 10, id: "brambleback", imageKey: "bossBrambleback", name: { en: "Brambleback Colossus", "zh-Hant": "荊背巨獸" }, cue: "bossCueBramble" },
    { tier: 15, id: "lunar", imageKey: "bossLunarWisp", name: { en: "Lunar Wisp Matriarch", "zh-Hant": "月靈女王" }, cue: "bossCueLunar" },
    { tier: 20, id: "prism", imageKey: "bossPrismShell", name: { en: "Prism Shell Regent", "zh-Hant": "稜晶甲攝政王" }, cue: "bossCuePrism" },
    { tier: 25, id: "tempest", imageKey: "bossTempestHorn", name: { en: "Tempest Horn Guardian", "zh-Hant": "暴風角守衛" }, cue: "bossCueTempest" },
    { tier: 30, id: "voidcore", imageKey: "bossVoidcore", name: { en: "Voidcore Emperor", "zh-Hant": "虛空核心皇" }, cue: "bossCueVoid" },
  ];
  ["Gólem Enraizado","Coloso Lomo de Zarzas","Matriarca Espíritu Lunar","Regente de Caparazón Prisma","Guardián Cuerno de Tempestad","Emperador del Núcleo Vacío"].forEach((name,index)=>{bossDefs[index].name.es=name;});
  ["Golem des Racines","Colosse des Ronces","Matriarche des Feux Follets Lunaires","Régent de la Carapace Prismatique","Gardien Corne de Tempête","Empereur du Noyau du Vide"].forEach((name,index)=>{bossDefs[index].name.fr=name;});
  ["Wurzelgolem","Rankenrücken-Koloss","Mondirrlicht-Matriarchin","Prismenpanzer-Regent","Sturmhorn-Wächter","Leerenkern-Kaiser"].forEach((name,index)=>{bossDefs[index].name.de=name;});
  ["Golem delle Radici","Colosso dei Rovi","Matriarca dei Fuochi Fatui Lunari","Reggente del Guscio Prismatico","Guardiano Corno di Tempesta","Imperatore del Nucleo Vuoto"].forEach((name,index)=>{bossDefs[index].name.it=name;});
  ["根縛りのゴーレム","ブランブルバック巨像","月光ウィスプ女王","プリズムシェル王","テンペストホーン守護者","ヴォイドコア皇帝"].forEach((name,index)=>{bossDefs[index].name.ja=name;});
  const upgradeDefs = [
    { id: "damage", iconSrc: "../../assets/animal-orb-fortress-upgrade-icon-1.webp", name: "upgradeDamage", desc: "upgradeDamageDesc" },
    { id: "split", iconSrc: "../../assets/animal-orb-fortress-upgrade-icon-2.webp", name: "upgradeSplit", desc: "upgradeSplitDesc" },
    { id: "pierce", iconSrc: "../../assets/animal-orb-fortress-upgrade-icon-3.webp", name: "upgradePierce", desc: "upgradePierceDesc" },
    { id: "recharge", iconSrc: "../../assets/animal-orb-fortress-upgrade-icon-4.webp", name: "upgradeRecharge", desc: "upgradeRechargeDesc" },
    { id: "shield", iconSrc: "../../assets/animal-orb-fortress-upgrade-icon-5.webp", name: "upgradeShield", desc: "upgradeShieldDesc" },
    { id: "magnet", iconSrc: "../../assets/animal-orb-fortress-upgrade-icon-6.webp", name: "upgradeMagnet", desc: "upgradeMagnetDesc" },
  ];

  const images = {};
  const readStorage = (key) => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const writeStorage = (key, value) => {
    try { localStorage.setItem(key, value); return true; } catch { return false; }
  };
  let locale = window.WonderI18n?.locale?.() || readStorage(localeKey) || "en";
  let save = loadSave();
  let selectedTier = 1;
  let centeredStageFrame = 0;
  let state = makeState();
  let lastFrame = 0;
  let raf = 0;
  let backgroundSuspended = false;
  let windowFocused = document.hasFocus();
  let pointer = { active: false, id: null, x: 0, y: 0 };
  let keyboardAimDeg = -90;
  let arenaControlSignature = "";
  let soundAt = {};
  let preloadFinished = false;
  let pauseFocusOwner = null;
  let resultDecisionCommitted = false;

  function t(key, data = {}) {
    const actualLocale = window.WonderI18n?.actualLocale?.() || document.documentElement.lang || locale;
    const value = text[actualLocale]?.[key] || text[locale]?.[key] || text.en[key] || key;
    return Object.entries(data).reduce((out, [name, item]) => out.replaceAll(`{${name}}`, String(item)), value);
  }

  function assertHindiJourneyOwnership(actualLocale) {
    if (actualLocale !== "hi") return;
    const required = {
      waves: "लहरें",
      ruleBoss: "बॉस का प्रतिकार",
      pausedTitle: "हमला रुका हुआ है",
      resume: "जारी रखें",
    };
    const invalid = Object.entries(required)
      .filter(([key, expected]) => text.hi?.[key] !== expected)
      .map(([key]) => key);
    const keyboardCopy = `${text.hi.keyboardAim || ""} ${text.hi.arenaControlLabel || ""}`;
    const pauseCopy = text.hi.pausedText || "";
    if (!keyboardCopy.includes("Space") || !keyboardCopy.includes("Enter")) invalid.push("keyboard tokens");
    if (/\b(?:waves|Boss counterplay|RAID|Resume)\b/i.test(Object.values(text.hi).join(" "))) invalid.push("English fallback");
    if (!pauseCopy.includes("मौजूदा लहर") || !pauseCopy.includes("अस्थायी आशीर्वाद")) invalid.push("pausedText");
    if (invalid.length) throw new Error(`animal-orb-fortress Hindi ownership failed: ${[...new Set(invalid)].join(", ")}`);
  }

  function localized(value) {
    if (!value || typeof value !== "object") return String(value || "");
    return value[locale] || value.en || "";
  }

  function setMeta(selector, value) {
    document.querySelector(selector)?.setAttribute("content", value);
  }

  function localizeGameSoundToggle() {
    const actualLocale = window.WonderI18n?.actualLocale?.() || document.documentElement.lang || locale;
    if (!["es", "fr", "de", "it", "ja"].includes(actualLocale)) return;
    const toggle = document.querySelector("button[data-sound-toggle]");
    if (!toggle) return;
    const muted = Boolean(window.WonderSound?.isMuted?.());
    const soundCopy = text[actualLocale];
    toggle.title = soundCopy.soundTitle;
    toggle.setAttribute("aria-label", muted ? soundCopy.enableSound : soundCopy.disableSound);
  }

  function normalizeGameLocalGuideCopy() {
    const actualLocale = window.WonderI18n?.actualLocale?.() || document.documentElement.lang || locale;
    const guide = document.querySelector(".game-page-info");
    if (!guide) return;
    if (actualLocale === "es") {
      guide.setAttribute("aria-label", "Información del juego Fortaleza de Orbes Animal");
      guide.innerHTML = `
        <div class="game-info-hero">
          <div class="game-info-title"><span class="game-info-kicker">Guía original de WeightPlay</span><h2>Fortaleza de Orbes Animal</h2><p>Fortaleza de Orbes Animal es una campaña de defensa con 30 rutas. Apunta un orbe espiritual, anticipa sus rebotes y protege el núcleo de cristal durante tres oleadas continuas. Cada región añade enemigos, obstáculos y jefes con reglas propias; entre oleadas eliges una bendición y entre rutas mejoras las salas de la fortaleza con Piedras Estelares.</p></div>
          <div class="game-info-facts"><div class="game-info-fact"><span>Jugabilidad</span><strong>Defensa de rebotes roguelite</strong></div><div class="game-info-fact"><span>Género</span><strong>Rebotes · Acción estratégica · Animales</strong></div><div class="game-info-fact"><span>Dificultad</span><strong>Difícil</strong></div><div class="game-info-fact"><span>Tiempo estimado</span><strong>5-8 minutos por ruta</strong></div><div class="game-info-fact"><span>Habilidades practicadas</span><strong>Lógica · Resolución de problemas · Concentración</strong></div></div>
        </div>
        <div class="game-info-sections">
          <div class="game-info-section"><h3>Mundo y misión</h3><p>La Fortaleza de Cristal se alza donde confluyen seis caminos guardianes: Bosque de Cristal, Forja de Espinas, Ruinas Lunares, Bóveda de Espejos, Bastión de Tormenta y Corazón del Eclipse. Un pulso inestable del núcleo atrajo a las bestias sombrías. Leo, el guardián de los orbes, debe defender cada camino desde la cámara del lanzador.</p><p>Superar una ruta permite que los equipos de reparación vuelvan a abrirla. Cada quinta ruta culmina contra un jefe regional distinto. Completar la ruta 30 reconecta los seis caminos y detiene el pulso corrupto.</p></div>
          <div class="game-info-section"><h3>Cómo funcionan los sistemas</h3><p><strong>Apuntar y rebotar:</strong> arrastra desde el lanzador para ver la trayectoria inicial y suelta para disparar. Los rebotes contra muros y pilares pueden alcanzar enemigos ocultos detrás de otras formaciones.</p><p><strong>Tres oleadas:</strong> las dos primeras presentan la regla de la ruta. La tercera usa una formación de élite o uno de los seis jefes regionales. Tras las oleadas 1 y 2, el combate se detiene hasta que eliges una bendición; después continúa con los puntos de vida del núcleo y las mejoras actuales.</p><p><strong>Enemigos especiales:</strong> la armadura exige varios impactos; las anclas protegen a aliados cercanos; los espectros lunares alternan entre estados sólidos e intangibles; los divisores crean fragmentos; y los cargadores anuncian su carril antes de atacar.</p><p><strong>Pilares espejo:</strong> las rutas avanzadas añaden superficies de rebote dentro de la arena. Algunos pilares se mueven, por lo que una trayectoria útil puede cambiar durante la misma oleada.</p><p><strong>Crecimiento:</strong> las bendiciones modifican la incursión actual. Las Piedras Estelares mejoran de forma permanente la Forja de Orbes, el Escudo del Núcleo, la Guarida de Compañeros y la Torre de Exploración. Repetir las tres bendiciones cuesta tres Diamantes, requiere confirmación y nunca es obligatorio.</p></div>
          <div class="game-info-section"><h3>Cómo jugar</h3><ol><li>Elige una ruta desbloqueada y lee su nombre, regla y advertencia.</li><li>Arrastra desde Leo hacia el ángulo deseado y revisa la trayectoria prevista.</li><li>Suelta para disparar. Observa armaduras, fases, cargas, anclas y señales de jefe antes del siguiente tiro.</li><li>Después de las oleadas 1 y 2, elige una bendición para continuar.</li><li>Mantén los puntos de vida del núcleo por encima de cero hasta superar la tercera oleada.</li><li>Vuelve al mapa para gastar Piedras Estelares, repetir rutas o avanzar a la siguiente.</li></ol></div>
          <div class="game-info-section game-info-strategy"><h3>Consejos de estrategia</h3><ul><li>No apuntes siempre al enemigo más cercano: anclas, divisores y espectros del fondo pueden ser objetivos prioritarios.</li><li>Un contorno discontinuo indica que el enemigo es intangible. Prepara el ángulo y dispara cuando vuelva a ser sólido.</li><li>Los pilares móviles son superficies útiles. Apunta hacia el lugar donde estarán cuando llegue el orbe.</li><li>Contra cargadores y el Guardián Cuerno de Tempestad, espera la recuperación posterior a la carga.</li><li>Escudo del Núcleo y Recarga Rápida aportan estabilidad; Orbe Gigante y Luz Penetrante acortan las fases peligrosas.</li><li>Reserva la repetición opcional para una selección que no ayude contra la regla actual. Toda la campaña se puede completar sin Diamantes.</li></ul></div>
          <div class="game-info-section"><h3>Campaña y dificultad</h3><p>Las rutas 1-5 enseñan disparos directos, rebotes contra una pared y prioridad de objetivos. Las rutas 6-10 añaden armadura y anclas. Las rutas 11-15 introducen fases y puertas móviles. Las rutas 16-20 incorporan pilares y divisores. Las rutas 21-25 exigen leer cargas y pulsos de tormenta. Las rutas 26-30 combinan todas las reglas y culminan contra el Emperador del Núcleo Vacío.</p></div>
          <div class="game-info-section"><h3>Nota de diseño</h3><p>Cada ruta usa tres oleadas cortas para concentrar la partida en un problema de puntería. Las señales visuales muestran armadura, protección, fase y carga sin exigir un panel de reglas durante el combate. En teléfono se apunta arrastrando; con teclado, las flechas ajustan el ángulo y Espacio o Enter disparan. La trayectoria del tiro es el recurso estratégico principal.</p></div>
          <div class="game-info-section game-info-parent"><h3>Información del jugador y guardado</h3><p>El navegador guarda localmente la mejor ruta desbloqueada, las Piedras Estelares, el número de partidas y los niveles de las cuatro salas. No se necesita una cuenta. Borrar los datos del sitio puede eliminar el progreso. Las repeticiones con Diamantes son opcionales y muestran el saldo antes y después. El Informe de habilidades describe únicamente la partida; no es una medición formal.</p></div>
          <div class="game-info-section"><h3>Preguntas frecuentes</h3><dl><div><dt>¿Cuál es el objetivo de una ruta?</dt><dd>Protege el núcleo durante tres oleadas. Superar la tercera guarda la ruta, entrega Piedras Estelares y desbloquea la siguiente.</dd></div><div><dt>¿Todas las rutas usan el mismo jefe?</dt><dd>No. Cada quinta ruta tiene un jefe regional distinto; las demás terminan con formaciones de élite diseñadas para esa ruta.</dd></div><div><dt>¿Por qué mi orbe atravesó a un enemigo lunar?</dt><dd>El contorno discontinuo indica una fase intangible. Espera a que el enemigo vuelva a ser sólido.</dd></div><div><dt>¿Qué hacen los pilares espejo?</dt><dd>Son superficies de rebote dentro de la arena. Los pilares avanzados se mueven y cambian las trayectorias disponibles.</dd></div><div><dt>¿Necesito Diamantes para terminar?</dt><dd>No. Solo sirven para repetir una vez las tres bendiciones de una oleada tras una confirmación.</dd></div><div><dt>¿Qué ocurre tras fallar?</dt><dd>La incursión termina, pero conservas las Piedras Estelares obtenidas y la mejor ruta desbloqueada.</dd></div></dl></div>
        </div>`;
      return;
    }
    const replacements = actualLocale === "ja"
      ? [
          ["WEIGHTPLAY ORIGINAL GAME GUIDE", "WEIGHTPLAY オリジナルゲームガイド"],
          ["WeightPlay Original Game Guide", "WeightPlay オリジナルゲームガイド"],
          ["星珠要塞 - Game Guide", "アニマル・オーブ・フォートレス - ゲームガイド"],
          ["Ricochet Roguelite", "反射ローグライト"],
          ["Action", "アクション"],
          ["Roguelite", "ローグライト"],
          ["Animal", "アニマル"],
          ["Hard", "難しい"],
          ["5-8 minutes per route", "1ルート5～8分"],
          ["Player and Save Information", "プレイヤー情報とセーブについて"],
          ["Related Games", "関連ゲーム"],
          ["Because this game practices 論理力, try these next:", "論理力をさらに使うゲームはこちら："],
          ["Starlink", "スターリンク"],
        ]
      : actualLocale === "zh-Hans"
      ? [["牠", "它"], ["舊", "旧"]]
      : [];
    if (!replacements.length) return;
    const walker = document.createTreeWalker(guide, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      let value = node.nodeValue || "";
      replacements.forEach(([from, to]) => {
        if (actualLocale === "es") {
          const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          value = value.replace(new RegExp(`\\b${escaped}\\b`, "g"), to);
        } else {
          value = value.replaceAll(from, to);
        }
      });
      if (value !== node.nodeValue) node.nodeValue = value;
      node = walker.nextNode();
    }
  }

  function scheduleGameLocalLocalization() {
    [0, 80, 320, 1400, 2200].forEach((delay) => window.setTimeout(() => {
      nodes.startBtn.textContent = t("openRaidMap");
      localizeGameSoundToggle();
      normalizeGameLocalGuideCopy();
      updatePageMeta();
    }, delay));
  }

  function updatePageMeta() {
    const meta = pageMeta[locale] || pageMeta.en;
    document.title = meta.title;
    setMeta("meta[name='description']", meta.description);
    setMeta("meta[property='og:title']", meta.title);
    setMeta("meta[property='og:description']", meta.ogDescription);
    setMeta("meta[name='twitter:title']", meta.title);
    setMeta("meta[name='twitter:description']", meta.twitterDescription);
  }

  function playSound(name, gap = 0.08) {
    const now = performance.now();
    if (soundAt[name] && now - soundAt[name] < gap * 1000) return;
    soundAt[name] = now;
    window.WonderSound?.play(name);
  }

  function loadSave() {
    const boundedInteger = (value, fallback, minimum, maximum = Number.MAX_SAFE_INTEGER) => {
      const number = Number(value);
      return Number.isFinite(number) ? Math.max(minimum, Math.min(maximum, Math.floor(number))) : fallback;
    };
    const defaults = { bestRaid: 1, starStones: 0, playCount: 0, rooms: { forge: 0, shield: 0, den: 0, tower: 0 } };
    try {
      const parsed = JSON.parse(readStorage(saveKey) || "{}");
      const source = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
      const roomsSource = source.rooms && typeof source.rooms === "object" && !Array.isArray(source.rooms) ? source.rooms : {};
      const normalized = {
        bestRaid: boundedInteger(source.bestRaid, 1, 1, MAX_RAID_TIER),
        starStones: boundedInteger(source.starStones, 0, 0),
        playCount: boundedInteger(source.playCount, 0, 0),
        rooms: Object.fromEntries(Object.keys(defaults.rooms).map((id) => [id, boundedInteger(roomsSource[id], 0, 0, 5)])),
      };
      writeStorage(saveKey, JSON.stringify(normalized));
      return normalized;
    } catch {
      writeStorage(saveKey, JSON.stringify(defaults));
      return defaults;
    }
  }

  function persist() {
    writeStorage(saveKey, JSON.stringify(save));
  }

  function makeState() {
    const shieldLevel = save?.rooms?.shield || 0;
    const forgeLevel = save?.rooms?.forge || 0;
    const denLevel = save?.rooms?.den || 0;
    return {
      mode: "menu",
      wave: 1,
      raidTier: selectedTier,
      core: 20 + shieldLevel * 4,
      maxCore: 20 + shieldLevel * 4,
      baseDamage: 2 + forgeLevel,
      shotCount: 0,
      stonesEarned: 0,
      bonusStones: 0,
      rerolled: false,
      rerollPending: false,
      readyTimer: 0,
      orbCooldown: 0.48,
      split: false,
      pierce: false,
      enemies: [],
      orbs: [],
      sparks: [],
      companionDamage: companionDamage(denLevel),
      companionTimer: 1.2,
      companionHits: 0,
      pylons: [],
      spawnedShards: 0,
      mechanicEvents: [],
      preview: [],
      launcher: { x: W / 2, y: H - 64 },
    };
  }

  function walletDiamonds() {
    return window.WeightPlayWallet?.read?.().diamonds || 0;
  }

  function settleMainStartFocus() {
    const focusStart = () => {
      if (!nodes.menuPanel.classList.contains("is-hidden") && nodes.startBtn.isConnected) {
        nodes.startBtn.focus({ preventScroll: true });
      }
    };
    window.requestAnimationFrame(focusStart);
    [80, 240, 560].forEach((delay) => window.setTimeout(focusStart, delay));
  }

  function show(panel) {
    if (panel !== nodes.gamePanel) cancelPointerAim();
    [nodes.menuPanel, nodes.stagePanel, nodes.gamePanel, nodes.upgradePanel, nodes.pausePanel, nodes.resultPanel].forEach((node) => node.classList.add("is-hidden"));
    const resultOpen = panel === nodes.resultPanel;
    const upgradeOpen = panel === nodes.upgradePanel;
    const battleCovered = resultOpen || upgradeOpen;
    if (battleCovered) nodes.gamePanel.classList.remove("is-hidden");
    panel.classList.remove("is-hidden");
    $("battleLive").inert = battleCovered;
    $("battleLive").setAttribute("aria-hidden", battleCovered ? "true" : "false");
    document.body.classList.toggle("orb-fortress-playing", panel !== nodes.menuPanel);
    updateOrbBattleScale();
    if (panel === nodes.gamePanel || battleCovered) {
      window.dispatchEvent(new Event("weightplay:battle-open"));
    }
    queueOrbArenaFit();
    if (panel === nodes.stagePanel) {
      window.requestAnimationFrame(centerUnlockedStage);
      window.requestAnimationFrame(focusUnlockedStage);
    } else if (panel === nodes.menuPanel) {
      settleMainStartFocus();
    }
  }

  function updateOrbBattleScale() {
    if (!document.body.classList.contains("orb-fortress-playing")) return;
    const viewport = window.visualViewport;
    const visualWidth = Math.round(viewport?.width || 0);
    const visualHeight = Math.round(viewport?.height || 0);
    const useVisual = visualWidth > 0 && visualHeight > 0 && Math.abs(visualWidth - innerWidth) <= 2 && visualHeight <= innerHeight + 2;
    const root = document.documentElement.style;
    root.setProperty("--orb-vw", `${useVisual ? visualWidth : innerWidth}px`);
    root.setProperty("--orb-vh", `${useVisual ? visualHeight : innerHeight}px`);
  }

  function fitOrbArena() {
    if (!document.body.classList.contains("orb-fortress-playing") || nodes.gamePanel.classList.contains("is-hidden")) return;
    const panelStyle = getComputedStyle(nodes.gamePanel);
    const rows = panelStyle.gridTemplateRows.split(/\s+/).map(Number.parseFloat).filter(Number.isFinite);
    const panelWidth = nodes.gamePanel.clientWidth - Number.parseFloat(panelStyle.paddingLeft) - Number.parseFloat(panelStyle.paddingRight);
    const panelHeight = nodes.gamePanel.clientHeight - Number.parseFloat(panelStyle.paddingTop) - Number.parseFloat(panelStyle.paddingBottom);
    const trackWidth = panelWidth;
    const trackHeight = rows.length === 1 ? rows[0] : rows[1] || panelHeight;
    const arenaHeight = Math.max(1, Math.min(trackHeight, trackWidth / (W / H)));
    const arenaWidth = arenaHeight * (W / H);
    const currentRect = canvas.getBoundingClientRect();
    const coordinateScale = nodes.gamePanel.offsetWidth > 0 ? nodes.gamePanel.getBoundingClientRect().width / nodes.gamePanel.offsetWidth : 1;
    if (Math.abs(currentRect.width - arenaWidth * coordinateScale) > 0.5) {
      canvas.style.setProperty("width", `${arenaWidth}px`, "important");
    }
    if (Math.abs(currentRect.height - arenaHeight * coordinateScale) > 0.5) {
      canvas.style.setProperty("height", `${arenaHeight}px`, "important");
    }
  }

  let arenaFitFrame = 0;
  function queueOrbArenaFit() {
    if (arenaFitFrame) return;
    arenaFitFrame = window.requestAnimationFrame(() => {
      // The shared logical-canvas controller also applies on an animation
      // frame. Fit one frame later so Wave 1 measures that final envelope
      // instead of preserving the smaller pre-Battle panel geometry.
      arenaFitFrame = window.requestAnimationFrame(() => {
        arenaFitFrame = 0;
        fitOrbArena();
      });
    });
  }

  function configureArena() {
    const landscapeArena = innerWidth > innerHeight;
    W = landscapeArena ? 1200 : 720;
    H = landscapeArena ? 720 : 1200;
    canvas.width = W;
    canvas.height = H;
    canvas.style.removeProperty("width");
    canvas.style.removeProperty("height");
    canvas.dataset.orientation = landscapeArena ? "landscape" : "portrait";
    document.documentElement.style.setProperty("--orb-arena-ratio", `${W} / ${H}`);
  }

  function refreshOrbBattleLayout() {
    const nextOrientation = innerWidth > innerHeight ? "landscape" : "portrait";
    if (canvas.dataset.orientation !== nextOrientation) configureArena();
    updateOrbBattleScale();
    window.dispatchEvent(new Event("weightplay:battle-open"));
    queueOrbArenaFit();
  }

  // The shared Battle controller applies its responsive logical envelope after
  // this game becomes visible. Refit when that envelope changes so the first
  // wave uses the same arena size as every later wave.
  const battlePanelResizeObserver = typeof ResizeObserver === "function"
    ? new ResizeObserver(queueOrbArenaFit)
    : null;
  battlePanelResizeObserver?.observe(nodes.gamePanel);

  window.addEventListener?.("resize", refreshOrbBattleLayout, { passive: true });
  window.addEventListener?.("orientationchange", refreshOrbBattleLayout, { passive: true });
  window.visualViewport?.addEventListener("resize", refreshOrbBattleLayout, { passive: true });

  function ensureResultActionStructure() {
    const actions = nodes.resultPanel?.querySelector(".result-actions");
    if (!actions) return;
    nodes.resultMenuBtn.dataset.ui = "raidMap";
    [nodes.resultMenuBtn, nodes.nextStageBtn, nodes.retryBtn].forEach((button) => actions.append(button));
  }

  function setLocale(next) {
    ensureResultActionStructure();
    const current = window.WonderI18n?.actualLocale?.();
    const requested = next === "zh-Hant" && current === "zh-Hans" ? current : next || "en";
    if (current !== requested) window.WonderI18n?.setLocale?.(requested);
    locale = window.WonderI18n?.legacyLocale?.(requested) || requested;
    assertHindiJourneyOwnership(requested);
    const gameOwnedLocalizationRoots = [
      document.querySelector(".brand"),
      document.querySelector(".menu-copy > strong"),
      document.querySelector(".menu-copy > span"),
      nodes.stagePanel,
      nodes.gamePanel,
    ];
    gameOwnedLocalizationRoots.forEach((node) => {
      if (["es", "it", "ja"].includes(requested)) node?.setAttribute("data-runtime-localize", "off");
      else node?.removeAttribute("data-runtime-localize");
    });
    [nodes.hintText, nodes.pausePanel].forEach((node) => {
      if (requested === "hi") node?.setAttribute("data-runtime-localize", "off");
      else node?.removeAttribute("data-runtime-localize");
    });
    writeStorage(localeKey, requested);
    document.documentElement.lang = requested;
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
    nodes.lobbyReturn.setAttribute("aria-label", t("backToLobby"));
    nodes.localeSelect.setAttribute("aria-label", t("language"));
    nodes.roomGrid.setAttribute("aria-label", t("fortressRooms"));
    nodes.stagePanel.setAttribute("aria-label", t("raidMap"));
    nodes.stageRail.setAttribute("aria-label", t("raidTiers"));
    nodes.stageBackBtn.setAttribute("aria-label", t("returnMain"));
    updateArenaControlLabel(true);
    nodes.mapBtn.setAttribute("aria-label", t("battleReturnDecision"));
    nodes.pauseBtn.setAttribute("aria-label", t("pause"));
    nodes.resultMenuBtn.setAttribute("aria-label", t("raidMap"));
    updatePageMeta();
    nodes.localeSelect.value = requested;
    renderMenu();
    renderHud();
    renderUpgradeCards();
    scheduleGameLocalLocalization();
  }

  function preload() {
    const entries = Object.entries(assets);
    let done = 0;
    const finish = () => {
      if (preloadFinished) return;
      preloadFinished = true;
      nodes.loadingText.textContent = "100%";
      nodes.loadingFill.style.width = "100%";
      nodes.loadingPanel.classList.add("is-hidden");
      renderMenu();
      draw();
      maybeSmokeStart();
    };
    entries.forEach(([key, src]) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      images[key] = img;
      img.onload = img.onerror = () => {
        done += 1;
        const pct = Math.round((done / entries.length) * 100);
        nodes.loadingText.textContent = `${pct}%`;
        nodes.loadingFill.style.width = `${pct}%`;
        if (done >= entries.length) finish();
      };
    });
    window.setTimeout(finish, 1800);
  }

  function exposeBasicReady() {
    nodes.loadingPanel.classList.add("is-hidden");
    document.body.dataset.orbFortressBasicReady = "true";
    window.__ANIMAL_ORB_FORTRESS_BOOTED__ = true;
    window.__ANIMAL_ORB_FORTRESS_FIRST_SCREEN__ = {
      title: t("title"),
      locale,
      controls: ["localeSelect", "startBtn"],
      rooms: roomDefs.length,
    };
  }

  function roomCost(id) {
    return 8 + (save.rooms[id] || 0) * 6;
  }

  function companionDamage(level = save.rooms.den || 0) {
    return level >= 2 ? level - 1 : 0;
  }

  function roomProgressText(room, level) {
    if (room.id !== "den") return t(room.desc);
    const currentDamage = companionDamage(level);
    if (currentDamage <= 0) return t("companionLocked");
    const current = t("companionCurrent", { damage: currentDamage });
    if (level >= 5) return current;
    return `${current} ${t("companionNext", { damage: companionDamage(level + 1) })}`;
  }

  function renderMenu() {
    const unlocked = Math.max(1, Math.min(MAX_RAID_TIER, save.bestRaid || 1));
    nodes.bestRaidText.textContent = String(unlocked);
    nodes.starStoneText.textContent = String(save.starStones || 0);
    nodes.diamondText.textContent = String(walletDiamonds());
    nodes.stageProgressText.textContent = t("stageProgress", { unlocked });
    nodes.stageRail.innerHTML = raidDefs
      .map((raid) => {
        const locked = raid.tier > unlocked;
        return `
          <button class="raid-card${locked ? " is-locked" : ""}" type="button" data-tier="${raid.tier}" data-zone="${raid.zone}" aria-disabled="${locked}">
            <span class="raid-number">${raid.tier}</span>
            <strong>${localized(raid.name)}</strong>
            <span>${localized(raid.desc)}</span>
            <em><span>${t(raid.rule)}</span><span aria-hidden="true"> · </span>${locked
              ? `<span>${t("tierLocked")}</span>`
              : `<span>${t("enterRaid")}</span><span aria-hidden="true"> · </span><span>${WAVES_PER_RAID}</span> <span>${t("waves")}</span>`}</em>
          </button>`;
      })
      .join("");
    nodes.roomGrid.innerHTML = roomDefs
      .map((room) => {
        const level = save.rooms[room.id] || 0;
        const cost = roomCost(room.id);
        const canUpgrade = level < 5 && save.starStones >= cost;
        const actionLabel = level >= 5
          ? t("maxRoomLabel", { name: t(room.name), level, effect: roomProgressText(room, level) })
          : t("upgradeRoomLabel", { name: t(room.name), level: level + 1, cost, effect: roomProgressText(room, level + 1) });
        return `
          <div class="room-card">
            <img src="${room.iconSrc}" alt="" />
            <div>
              <strong>${t(room.name)}</strong>
              <span>${t("level", { n: level })} - ${roomProgressText(room, level)}</span>
            </div>
            <button type="button" data-room="${room.id}" aria-label="${actionLabel}" ${canUpgrade ? "" : "disabled"}>${level >= 5 ? t("maxed") : t("upgradeRoom", { cost })}</button>
          </div>`;
      })
      .join("");
    if (!nodes.stagePanel.classList.contains("is-hidden")) window.requestAnimationFrame(centerUnlockedStage);
  }

  function centerUnlockedStage() {
    const unlocked = Math.max(1, Math.min(MAX_RAID_TIER, save.bestRaid || 1));
    const card = nodes.stageRail.querySelector(`[data-tier="${unlocked}"]`);
    if (!card || !nodes.stageRail.getClientRects().length) return;
    const railRect = nodes.stageRail.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const coordinateScale = railRect.width > 0 ? nodes.stageRail.clientWidth / railRect.width : 1;
    const target = nodes.stageRail.scrollLeft
      + ((cardRect.left + cardRect.width / 2) - (railRect.left + railRect.width / 2)) * coordinateScale;
    const bounded = Math.max(0, Math.min(target, nodes.stageRail.scrollWidth - nodes.stageRail.clientWidth));
    const previousBehavior = nodes.stageRail.style.getPropertyValue("scroll-behavior");
    const previousPriority = nodes.stageRail.style.getPropertyPriority("scroll-behavior");
    nodes.stageRail.style.setProperty("scroll-behavior", "auto", "important");
    nodes.stageRail.scrollLeft = bounded;
    if (previousBehavior) nodes.stageRail.style.setProperty("scroll-behavior", previousBehavior, previousPriority);
    else nodes.stageRail.style.removeProperty("scroll-behavior");
    updateCenteredStage();
  }

  function updateCenteredStage() {
    const cards = [...nodes.stageRail.querySelectorAll(".raid-card")];
    if (!cards.length || !nodes.stageRail.getClientRects().length) return;
    const railRect = nodes.stageRail.getBoundingClientRect();
    const railCenter = railRect.left + railRect.width / 2;
    let centeredCard = cards[0];
    let centeredDistance = Number.POSITIVE_INFINITY;
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - railCenter);
      if (distance < centeredDistance) {
        centeredCard = card;
        centeredDistance = distance;
      }
    });
    cards.forEach((card) => {
      const centered = card === centeredCard;
      card.classList.toggle("is-centered", centered);
      if (centered) card.setAttribute("aria-current", "true");
      else card.removeAttribute("aria-current");
    });
  }

  function queueCenteredStageUpdate() {
    if (centeredStageFrame) return;
    centeredStageFrame = window.requestAnimationFrame(() => {
      centeredStageFrame = 0;
      updateCenteredStage();
    });
  }

  function focusUnlockedStage() {
    const unlocked = Math.max(1, Math.min(MAX_RAID_TIER, save.bestRaid || 1));
    nodes.stageRail.querySelector(`[data-tier="${unlocked}"]`)?.focus({ preventScroll: true });
  }

  function restoreRoomUpgradeFocus(id) {
    window.requestAnimationFrame(() => {
      const preferred = nodes.roomGrid.querySelector(`[data-room="${id}"]:not(:disabled)`);
      const fallback = nodes.roomGrid.querySelector("button:not(:disabled)");
      (preferred || fallback)?.focus({ preventScroll: true });
    });
  }

  function upgradeRoom(id, restoreFocus = false) {
    const level = save.rooms[id] || 0;
    const cost = roomCost(id);
    if (level >= 5 || save.starStones < cost) return;
    save.starStones -= cost;
    save.rooms[id] = level + 1;
    persist();
    playSound("success", 0.2);
    renderMenu();
    if (restoreFocus) restoreRoomUpgradeFocus(id);
    window.WonderAnalytics?.track("room_upgrade", { game_id: GAME_ID, room: id, level: save.rooms[id] });
  }

  function startRaid(tier = selectedTier) {
    cancelPointerAim();
    cancelAnimationFrame(raf);
    backgroundSuspended = false;
    selectedTier = Math.max(1, Math.min(MAX_RAID_TIER, Number(tier) || 1));
    configureArena();
    state = makeState();
    keyboardAimDeg = -90;
    state.mode = "running";
    save.playCount += 1;
    persist();
    spawnWave();
    show(nodes.gamePanel);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    nodes.hintText.textContent = t("orbReady");
    renderHud();
    window.requestAnimationFrame(() => {
      canvas.focus({ preventScroll: true });
      updateKeyboardAimPreview();
    });
    lastFrame = performance.now();
    playSound("start", 0.2);
    window.WonderAnalytics?.track("raid_start", { game_id: GAME_ID, tier: state.raidTier });
    loop(lastFrame);
  }

  function raidProfile(tier) {
    const zone = Math.ceil(tier / 5);
    const step = (tier - 1) % 5;
    const raid = raidDefs[tier - 1] || raidDefs[0];
    return {
      tier,
      zone,
      step,
      raid,
      checkpoint: tier % 5 === 0,
      hpScale: 1 + (tier - 1) * 0.06,
      speedScale: 1 + (tier - 1) * 0.018 + (step === 1 ? 0.08 : 0),
      countBonus: Math.min(5, zone - 1 + (step === 1 ? 1 : 0)),
      shieldHits: zone >= 2 ? Math.min(3, Math.ceil((zone - 1) / 2)) : 0,
      eliteWave: step === 3 || step === 4,
      bossMinions: Math.max(0, zone - 1),
      tint: ["rgba(24,80,52,.04)", "rgba(84,74,18,.10)", "rgba(38,48,112,.12)", "rgba(44,88,126,.13)", "rgba(32,70,128,.15)", "rgba(82,28,106,.17)"][zone - 1],
    };
  }

  function enemyKindFor(zone, index) {
    const patterns = [
      ["skitter", "thorn", "wisp"],
      ["armored", "anchor", "wisp", "thorn"],
      ["phase", "wisp", "phase", "thorn"],
      ["splitter", "armored", "phase", "splitter"],
      ["charger", "wisp", "armored", "charger"],
      ["anchor", "phase", "splitter", "charger", "armored"],
    ];
    const pattern = patterns[Math.max(0, Math.min(patterns.length - 1, zone - 1))];
    return pattern[index % pattern.length];
  }

  function bossDefForTier(tier) {
    return bossDefs.find((boss) => boss.tier === tier) || null;
  }

  function configurePylons(profile) {
    const count = profile.tier < 13 ? 0 : profile.tier < 16 ? 1 : 2;
    state.pylons = Array.from({ length: count }, (_, index) => ({
      x: W * (count === 1 ? 0.5 : index === 0 ? 0.34 : 0.66),
      y: H * (0.34 + index * 0.16),
      r: 31,
      moving: profile.step >= 3 || profile.zone >= 5,
      direction: index % 2 ? -1 : 1,
      minX: W * 0.24,
      maxX: W * 0.76,
      speed: 30 + profile.zone * 5,
    }));
  }

  function spawnWave() {
    state.enemies = [];
    const tier = state.raidTier;
    const wave = state.wave;
    const profile = raidProfile(tier);
    configurePylons(profile);
    if (wave >= WAVES_PER_RAID && profile.checkpoint) {
      const bossDef = bossDefForTier(tier);
      const bossHp = Math.round((22 + tier * 3) * (1 + (tier - 1) * 0.045));
      const bossShield = bossDef?.id === "brambleback" ? 6 : bossDef?.id === "voidcore" ? 5 : bossDef?.id === "rootbound" || bossDef?.id === "prism" ? 3 : 0;
      state.enemies.push(makeEnemy("boss", W / 2, Math.max(112, H * 0.1), bossHp, 11 * profile.speedScale, 58, {
        elite: true,
        shield: bossShield,
        bossId: bossDef?.id,
        imageKey: bossDef?.imageKey,
        name: bossDef?.name,
        cue: bossDef?.cue,
      }));
      if (bossDef?.cue) nodes.hintText.textContent = `${localized(bossDef.name)} — ${t(bossDef.cue)}`;
      for (let i = 0; i < profile.bossMinions; i += 1) {
        const x = W * (0.18 + (i / Math.max(1, profile.bossMinions - 1)) * 0.64);
        const kind = enemyKindFor(profile.zone, i + tier);
        state.enemies.push(makeSpecialEnemy(kind, x, Math.max(220, H * 0.18) + (i % 2) * 62, tier, wave, profile, { shield: Math.max(0, profile.shieldHits - 1) }));
      }
    } else {
      const count = Math.min(10, 2 + wave + profile.countBonus + (wave === WAVES_PER_RAID ? 1 : 0));
      for (let i = 0; i < count; i += 1) {
        const kind = enemyKindFor(profile.zone, i + wave + profile.step);
        const side = W * 0.14;
        const span = W - side * 2;
        state.enemies.push(makeSpecialEnemy(kind, side + i * (span / Math.max(1, count - 1)), Math.max(92, H * 0.08) + (i % 2) * 54, tier, wave, profile, { shield: kind === "armored" ? Math.max(1, profile.shieldHits) : 0 }));
      }
      if ((wave === 2 && profile.eliteWave) || wave === WAVES_PER_RAID) {
        const kind = enemyKindFor(profile.zone, tier + 2);
        state.enemies.push(makeSpecialEnemy(kind, W / 2, Math.max(240, H * 0.2), tier, wave, profile, { elite: true, shield: profile.shieldHits }));
      }
    }
    renderHud();
  }

  function makeEnemy(kind, x, y, hp, speed, size, options = {}) {
    const shield = Math.max(0, options.shield || 0);
    return {
      kind,
      x,
      y,
      hp,
      maxHp: hp,
      speed: speed * (H / 540),
      baseSpeed: speed * (H / 540),
      size,
      hitTimer: 0,
      shield,
      maxShield: shield,
      elite: Boolean(options.elite),
      bossId: options.bossId || "",
      imageKey: options.imageKey || "",
      name: options.name || null,
      cue: options.cue || "",
      phaseTimer: kind === "phase" || options.bossId === "lunar" ? 1.15 : 0,
      phased: false,
      behaviorTimer: 1.1,
      chargeState: "approach",
      stationary: kind === "anchor",
      splitOnDeath: kind === "splitter",
      deathHandled: false,
      bossPhase: 1,
      summonedPhases: [],
      weakOpen: options.bossId !== "prism",
    };
  }

  function makeSpecialEnemy(kind, x, y, tier, wave, profile, options = {}) {
    const hpMod = kind === "armored" ? 1.35 : kind === "anchor" ? 1.45 : kind === "splitter" ? 1.15 : kind === "charger" ? 1.2 : kind === "phase" ? 0.9 : kind === "thorn" ? 1.18 : 1;
    const speedBase = kind === "anchor" ? 0 : kind === "thorn" || kind === "armored" ? 9 : kind === "phase" ? 15 : kind === "charger" ? 12 : kind === "wisp" ? 16 : 14;
    const size = kind === "anchor" ? 37 : kind === "armored" ? 35 : kind === "charger" ? 34 : 28;
    const hp = Math.round((4 + wave * 2 + tier * 0.62) * profile.hpScale * hpMod * (options.elite ? 1.5 : 1));
    return makeEnemy(kind, x, y, hp, speedBase * profile.speedScale, size, options);
  }

  function renderHud() {
    nodes.waveText.textContent = `${t("tierShort", { tier: state.raidTier })} · ${Math.min(state.wave, 3)}/3`;
    const currentCore = Math.max(0, Math.ceil(state.core));
    nodes.coreText.textContent = `${currentCore}/${state.maxCore}`;
    const coreMeter = nodes.coreText.parentElement;
    if (coreMeter) {
      coreMeter.setAttribute("role", "progressbar");
      coreMeter.setAttribute("aria-label", t("core"));
      coreMeter.setAttribute("aria-valuemin", "0");
      coreMeter.setAttribute("aria-valuemax", String(state.maxCore));
      coreMeter.setAttribute("aria-valuenow", String(currentCore));
      coreMeter.setAttribute("aria-valuetext", `${t("core")} ${currentCore}/${state.maxCore}`);
    }
    nodes.shotText.textContent = String(state.shotCount);
  }

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const source = event.touches?.[0] || event.changedTouches?.[0] || event;
    return {
      x: ((source.clientX - rect.left) / rect.width) * W,
      y: ((source.clientY - rect.top) / rect.height) * H,
    };
  }

  function onPointerStart(event) {
    if (state.mode !== "running" || !canFireOrb()) return;
    if (event.button !== undefined && event.button !== 0) return;
    if (pointer.active) return;
    event.preventDefault();
    pointer.active = true;
    pointer.id = event.pointerId;
    canvas.setPointerCapture?.(event.pointerId);
    Object.assign(pointer, canvasPoint(event));
    state.preview = previewPath(pointer.x, pointer.y);
  }

  function onPointerMove(event) {
    if (!pointer.active || event.pointerId !== pointer.id) return;
    event.preventDefault();
    Object.assign(pointer, canvasPoint(event));
    state.preview = previewPath(pointer.x, pointer.y);
  }

  function onPointerEnd(event) {
    if (!pointer.active || event.pointerId !== pointer.id) return;
    event.preventDefault();
    const pointerId = pointer.id;
    pointer.active = false;
    pointer.id = null;
    Object.assign(pointer, canvasPoint(event));
    if (canvas.hasPointerCapture?.(pointerId)) canvas.releasePointerCapture(pointerId);
    releaseOrb(pointer.x, pointer.y);
  }

  function cancelPointerAim(event) {
    if (!pointer.active || (event?.pointerId !== undefined && event.pointerId !== pointer.id)) return;
    const pointerId = pointer.id;
    pointer.active = false;
    pointer.id = null;
    state.preview = [];
    if (pointerId !== null && canvas.hasPointerCapture?.(pointerId)) canvas.releasePointerCapture(pointerId);
    if (state.mode === "running") nodes.hintText.textContent = t("aimHint");
  }

  function aimVector(x, y) {
    const dx = x - state.launcher.x;
    const dy = y - state.launcher.y;
    const len = Math.max(1, Math.hypot(dx, dy));
    const power = 520 * (H / 540);
    return { vx: (dx / len) * power, vy: (dy / len) * power };
  }

  function previewPath(x, y) {
    const v = aimVector(x, y);
    let px = state.launcher.x;
    let py = state.launcher.y;
    let vx = v.vx;
    let vy = v.vy;
    const points = [{ x: px, y: py }];
    for (let i = 0; i < 85; i += 1) {
      px += vx * 0.035;
      py += vy * 0.035;
      if (px < 46 || px > W - 46) {
        vx *= -1;
        px = Math.max(46, Math.min(W - 46, px));
      }
      if (py < 46 || py > H - 46) {
        vy *= -1;
        py = Math.max(46, Math.min(H - 46, py));
      }
      if (i % 10 === 0) points.push({ x: px, y: py });
    }
    return points;
  }

  function keyboardAimPoint() {
    const radians = keyboardAimDeg * Math.PI / 180;
    const distance = Math.max(W, H);
    return {
      x: state.launcher.x + Math.cos(radians) * distance,
      y: state.launcher.y + Math.sin(radians) * distance,
    };
  }

  function updateKeyboardAimPreview() {
    if (state.mode !== "running") return;
    const target = keyboardAimPoint();
    const angle = Math.round(keyboardAimDeg + 90);
    state.preview = previewPath(target.x, target.y);
    nodes.hintText.textContent = t("keyboardAim", { angle });
    updateArenaControlLabel(true);
  }

  function updateArenaControlLabel(force = false) {
    canvas.setAttribute("aria-keyshortcuts", ARENA_KEYBOARD_SHORTCUTS);
    const angle = Math.round(keyboardAimDeg + 90);
    let status = "inactive";
    let label = t("arenaLabel");
    if (state.mode === "running") {
      if (canFireOrb()) {
        status = "ready";
        label = t("arenaControlReadyLabel", { angle });
      } else if (state.readyTimer > 0) {
        status = "cooldown";
        const seconds = Math.max(0.1, Math.ceil(state.readyTimer * 10) / 10).toFixed(1);
        label = t("arenaControlCooldownLabel", { angle, seconds });
      } else {
        status = "limit";
        label = t("arenaControlLimitLabel", { angle, active: state.orbs.length, limit: activeOrbLimit() });
      }
    }
    const signature = `${locale}:${angle}:${status}`;
    if (!force && signature === arenaControlSignature) return;
    arenaControlSignature = signature;
    canvas.setAttribute("aria-label", label);
  }

  function onCanvasKeydown(event) {
    if (state.mode !== "running") return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      keyboardAimDeg = Math.max(-165, Math.min(-15, keyboardAimDeg + (event.key === "ArrowLeft" ? -6 : 6)));
      updateKeyboardAimPreview();
      return;
    }
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    if (event.repeat) return;
    if (!canFireOrb()) {
      nodes.hintText.textContent = t("orbFlying");
      return;
    }
    const target = keyboardAimPoint();
    releaseOrb(target.x, target.y);
  }

  function releaseOrb(x, y) {
    if (!canFireOrb()) return;
    const v = aimVector(x, y);
    const limit = activeOrbLimit();
    const volley = [
      { vx: v.vx, vy: v.vy, skin: state.shotCount % 5, scale: 1 },
      { vx: v.vx * 0.86 - 68, vy: v.vy * 0.9, skin: (state.shotCount + 1) % 5, scale: 0.72 },
    ];
    if (state.split) volley.push({ vx: v.vx * 0.82 + 74, vy: v.vy * 0.88, skin: (state.shotCount + 2) % 5, scale: 0.62 });
    volley.forEach((shot) => {
      if (state.orbs.length < limit) state.orbs.push(makeOrb(shot.vx, shot.vy, shot.skin, shot.scale));
    });
    state.preview = [];
    state.shotCount += 1;
    state.readyTimer = state.orbCooldown;
    nodes.hintText.textContent = t("orbFlying");
    updateArenaControlLabel(true);
    playSound("shoot", 0.08);
    window.WonderAnalytics?.track("shot_fired", { game_id: GAME_ID, wave: state.wave, split: state.split });
    renderHud();
  }

  function makeOrb(vx, vy, skin, damageScale = 1) {
    return { x: state.launcher.x, y: state.launcher.y, vx, vy, r: 20, life: 5.2, damage: Math.max(1, Math.round(state.baseDamage * damageScale)), skin, hits: new Map() };
  }

  function activeOrbLimit() {
    return state.split ? 6 : 4;
  }

  function canFireOrb() {
    return state.readyTimer <= 0 && state.orbs.length < activeOrbLimit();
  }

  function loop(now) {
    if (backgroundSuspended) return;
    const dt = Math.min(0.033, (now - lastFrame) / 1000 || 0.016);
    lastFrame = now;
    if (state.mode === "running") {
      update(dt);
      draw();
      raf = requestAnimationFrame(loop);
    }
  }

  function setPaused(paused, focusOwner = document.activeElement) {
    if (paused) {
      if (state.mode !== "running") return;
      pauseFocusOwner = focusOwner instanceof HTMLElement && focusOwner.isConnected ? focusOwner : canvas;
      cancelPointerAim();
      cancelAnimationFrame(raf);
      state.mode = "paused";
      nodes.pausePanel.classList.remove("is-hidden");
      $("battleLive").inert = true;
      $("battleLive").setAttribute("aria-hidden", "true");
      nodes.resumeBtn.focus({ preventScroll: true });
      return;
    }
    if (state.mode !== "paused") return;
    nodes.pausePanel.classList.add("is-hidden");
    $("battleLive").inert = false;
    $("battleLive").setAttribute("aria-hidden", "false");
    state.mode = "running";
    lastFrame = performance.now();
    raf = requestAnimationFrame(loop);
    const focusTarget = pauseFocusOwner instanceof HTMLElement && pauseFocusOwner.isConnected ? pauseFocusOwner : canvas;
    pauseFocusOwner = null;
    window.requestAnimationFrame(() => focusTarget.focus({ preventScroll: true }));
  }

  function update(dt) {
    state.readyTimer = Math.max(0, state.readyTimer - dt);
    updatePylons(dt);
    state.enemies.forEach((enemy) => {
      updateEnemyBehavior(enemy, dt);
      if (enemy.stationary || enemy.chargeState === "marked" || enemy.chargeState === "recovery") {
        enemy.hitTimer = Math.max(0, enemy.hitTimer - dt);
        return;
      }
      const dx = state.launcher.x - enemy.x;
      const dy = state.launcher.y - enemy.y;
      const len = Math.max(1, Math.hypot(dx, dy));
      enemy.x += (dx / len) * enemy.speed * dt;
      enemy.y += (dy / len) * enemy.speed * dt;
      enemy.hitTimer = Math.max(0, enemy.hitTimer - dt);
      if (Math.hypot(enemy.x - state.launcher.x, enemy.y - state.launcher.y) < enemy.size * 0.7) {
        state.core -= enemy.kind === "boss" ? 4 : enemy.kind === "thorn" || enemy.kind === "charger" ? 3 : 2;
        enemy.hp = 0;
        nodes.hintText.textContent = t("fortressHit");
        playSound("wrong", 0.2);
        renderHud();
      }
    });
    updateCompanion(dt);

    state.orbs.forEach((orb) => updateOrb(orb, dt));
    state.orbs = state.orbs.filter((orb) => orb.life > 0);
    updateArenaControlLabel();
    resolveEnemyDeaths();
    state.enemies = state.enemies.filter((enemy) => enemy.hp > 0);
    state.sparks.forEach((spark) => (spark.life -= dt));
    state.sparks = state.sparks.filter((spark) => spark.life > 0);

    if (state.core <= 0) finishRaid(false);
    else if (state.enemies.length === 0) {
      if (state.wave >= WAVES_PER_RAID) finishRaid(true);
      else showUpgrade();
    } else if (canFireOrb() && state.preview.length === 0) {
      nodes.hintText.textContent = activeEncounterCue() || t("orbReady");
    }
  }

  function updatePylons(dt) {
    state.pylons.forEach((pylon) => {
      if (!pylon.moving) return;
      pylon.x += pylon.direction * pylon.speed * dt;
      if (pylon.x <= pylon.minX || pylon.x >= pylon.maxX) {
        pylon.x = Math.max(pylon.minX, Math.min(pylon.maxX, pylon.x));
        pylon.direction *= -1;
      }
    });
  }

  function updateEnemyBehavior(enemy, dt) {
    if (enemy.bossId === "rootbound") {
      if (enemy.shield <= 0) {
        enemy.weakOpen = true;
        enemy.behaviorTimer -= dt;
        if (enemy.behaviorTimer <= 0) {
          enemy.shield = 2;
          enemy.maxShield = Math.max(enemy.maxShield, 2);
          enemy.weakOpen = false;
          enemy.behaviorTimer = 2.6;
          state.mechanicEvents.push("rootbound_guard_rebuilt");
        }
      } else {
        enemy.weakOpen = false;
      }
    }
    if (enemy.kind === "phase" || enemy.bossId === "lunar") {
      enemy.phaseTimer -= dt;
      if (enemy.phaseTimer <= 0) {
        enemy.phased = !enemy.phased;
        enemy.phaseTimer = enemy.phased ? 0.8 : 1.25;
        state.mechanicEvents.push(enemy.phased ? "phase_closed" : "phase_open");
      }
    }

    if (enemy.kind === "anchor") {
      enemy.behaviorTimer -= dt;
      if (enemy.behaviorTimer <= 0) {
        const ally = state.enemies.filter((unit) => unit !== enemy && unit.hp > 0).sort((a, b) => a.shield - b.shield)[0];
        if (ally) {
          ally.shield = Math.min(3, ally.shield + 1);
          ally.maxShield = Math.max(ally.maxShield, ally.shield);
          state.mechanicEvents.push("anchor_guard");
        }
        enemy.behaviorTimer = 2.4;
      }
    }

    const charger = enemy.kind === "charger" || enemy.bossId === "tempest";
    if (charger) {
      enemy.behaviorTimer -= dt;
      if (enemy.behaviorTimer <= 0 && enemy.chargeState === "approach") {
        enemy.chargeState = "marked";
        enemy.speed = 0;
        enemy.behaviorTimer = 0.72;
        state.mechanicEvents.push("charge_marked");
      } else if (enemy.behaviorTimer <= 0 && enemy.chargeState === "marked") {
        enemy.chargeState = "charging";
        enemy.speed = enemy.baseSpeed * 3.1;
        enemy.behaviorTimer = 0.68;
        state.mechanicEvents.push("charge_rush");
      } else if (enemy.behaviorTimer <= 0 && enemy.chargeState === "charging") {
        enemy.chargeState = "recovery";
        enemy.speed = 0;
        enemy.weakOpen = true;
        enemy.behaviorTimer = 0.9;
        state.mechanicEvents.push("charge_recovery");
      } else if (enemy.behaviorTimer <= 0 && enemy.chargeState === "recovery") {
        enemy.chargeState = "approach";
        enemy.speed = enemy.baseSpeed;
        enemy.weakOpen = false;
        enemy.behaviorTimer = 1.2;
      }
    }

    if (enemy.bossId === "prism") {
      enemy.behaviorTimer -= dt;
      if (enemy.behaviorTimer <= 0) {
        enemy.weakOpen = !enemy.weakOpen;
        enemy.behaviorTimer = enemy.weakOpen ? 0.9 : 1.25;
        state.mechanicEvents.push(enemy.weakOpen ? "prism_open" : "prism_closed");
      }
    }

    if (enemy.bossId === "brambleback") {
      maybeSummonBossSupport(enemy, 0.66, "anchor", 2);
      maybeSummonBossSupport(enemy, 0.33, "armored", 2);
    }
    if (enemy.bossId === "voidcore") {
      maybeSummonBossSupport(enemy, 0.66, "phase", 2);
      maybeSummonBossSupport(enemy, 0.33, "charger", 2);
      const hpRatio = enemy.hp / Math.max(1, enemy.maxHp);
      enemy.bossPhase = hpRatio <= 0.33 ? 3 : hpRatio <= 0.66 ? 2 : 1;
      if (enemy.bossPhase >= 2 && state.pylons.length < 2) configurePylons({ zone: 6, step: 4 });
    }
  }

  function maybeSummonBossSupport(enemy, threshold, kind, count) {
    if (enemy.hp / Math.max(1, enemy.maxHp) > threshold || enemy.summonedPhases.includes(threshold)) return;
    enemy.summonedPhases.push(threshold);
    if (enemy.bossId === "voidcore") {
      enemy.shield = Math.max(enemy.shield, enemy.bossPhase >= 2 ? 3 : 2);
      enemy.maxShield = Math.max(enemy.maxShield, enemy.shield);
    }
    const profile = raidProfile(state.raidTier);
    for (let index = 0; index < count; index += 1) {
      state.enemies.push(makeSpecialEnemy(kind, W * (0.34 + index * 0.32), H * (0.2 + index * 0.05), state.raidTier, state.wave, profile, { shield: kind === "armored" ? 2 : 0 }));
    }
    state.mechanicEvents.push(`${enemy.bossId}_summon_${kind}`);
    if (enemy.cue) nodes.hintText.textContent = `${localized(enemy.name)} — ${t(enemy.cue)}`;
  }

  function resolveEnemyDeaths() {
    const additions = [];
    state.enemies.forEach((enemy) => {
      if (enemy.hp > 0 || enemy.deathHandled) return;
      enemy.deathHandled = true;
      if (enemy.splitOnDeath) {
        for (const direction of [-1, 1]) {
          additions.push(makeEnemy("shard", enemy.x + direction * 30, enemy.y + 18, Math.max(2, Math.round(enemy.maxHp * 0.34)), enemy.baseSpeed * 1.35 / (H / 540), 20));
        }
        state.spawnedShards += 2;
        state.mechanicEvents.push("splitter_shards");
      }
    });
    state.enemies.push(...additions);
  }

  function activeEncounterCue() {
    const boss = state.enemies.find((enemy) => enemy.kind === "boss" && enemy.hp > 0);
    if (boss?.cue) return `${localized(boss.name)} — ${t(boss.cue)}`;
    if (locale === "it" && state.enemies.some((enemy) => enemy.phased)) return "Fase chiusa: attendi che il nemico ricompaia.";
    if (locale === "it" && state.enemies.some((enemy) => enemy.chargeState === "marked")) return "Corsia di carica segnalata: prepara un altro angolo.";
    if (state.enemies.some((enemy) => enemy.phased)) return locale === "zh-Hant" ? "相位關閉：等待敵人重新顯形。" : locale === "es" ? "Fase cerrada: espera a que reaparezca." : locale === "ja" ? "位相が閉じています。敵が再出現するまで待ちましょう。" : "Phase closed — wait for the enemy to reappear.";
    if (state.enemies.some((enemy) => enemy.chargeState === "marked")) return locale === "zh-Hant" ? "衝鋒路線已標記：準備改變角度。" : locale === "es" ? "Carril de carga marcado: prepara otro ángulo." : locale === "ja" ? "突進レーンが表示されました。別の角度を準備しましょう。" : "Charge lane marked — prepare a different angle.";
    return "";
  }

  function updateCompanion(dt) {
    if (state.companionDamage <= 0 || state.enemies.length === 0) return;
    state.companionTimer = Math.max(0, state.companionTimer - dt);
    if (state.companionTimer > 0) return;
    const target = state.enemies
      .filter((enemy) => enemy.hp > 0 && canDamageEnemy(enemy))
      .sort((a, b) => Math.hypot(a.x - state.launcher.x, a.y - state.launcher.y) - Math.hypot(b.x - state.launcher.x, b.y - state.launcher.y))[0];
    if (!target) return;
    if (target.shield > 0) target.shield -= 1;
    else target.hp -= state.companionDamage;
    target.hitTimer = 0.22;
    state.companionHits += 1;
    state.companionTimer = 4;
    state.sparks.push({
      kind: "companion",
      x: target.x,
      y: target.y,
      fromX: state.launcher.x,
      fromY: state.launcher.y - 44,
      life: 0.34,
      maxLife: 0.34,
    });
    playSound("hit", 0.08);
  }

  function updateOrb(orb, dt) {
    orb.life -= dt;
    orb.x += orb.vx * dt;
    orb.y += orb.vy * dt;
    if (orb.x < 38 || orb.x > W - 38) {
      orb.vx *= -1;
      orb.x = Math.max(38, Math.min(W - 38, orb.x));
      playSound("click", 0.08);
    }
    if (orb.y < 38 || orb.y > H - 38) {
      orb.vy *= -1;
      orb.y = Math.max(38, Math.min(H - 38, orb.y));
      playSound("click", 0.08);
    }
    orb.pylonHits ||= new Map();
    state.pylons.forEach((pylon) => {
      const cooldown = orb.pylonHits.get(pylon) || 0;
      if (cooldown > 0) {
        orb.pylonHits.set(pylon, cooldown - dt);
        return;
      }
      const dx = orb.x - pylon.x;
      const dy = orb.y - pylon.y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      if (distance >= orb.r + pylon.r) return;
      const nx = dx / distance;
      const ny = dy / distance;
      const dot = orb.vx * nx + orb.vy * ny;
      orb.vx -= 2 * dot * nx;
      orb.vy -= 2 * dot * ny;
      orb.x = pylon.x + nx * (orb.r + pylon.r + 2);
      orb.y = pylon.y + ny * (orb.r + pylon.r + 2);
      orb.pylonHits.set(pylon, 0.16);
      state.mechanicEvents.push("pylon_bounce");
      playSound("click", 0.06);
    });
    state.enemies.forEach((enemy) => {
      const recent = orb.hits.get(enemy) || 0;
      if (recent > 0) {
        orb.hits.set(enemy, recent - dt);
        return;
      }
      const enemyVisualRadius = enemy.kind === "boss" ? 76 : enemy.size * 1.05;
      if (Math.hypot(orb.x - enemy.x, orb.y - enemy.y) < orb.r + enemyVisualRadius) {
        if (canDamageEnemy(enemy)) {
          if (enemy.shield > 0) enemy.shield -= 1;
          else enemy.hp -= orb.damage;
        } else {
          state.mechanicEvents.push(enemy.phased ? "phase_block" : enemy.bossId === "prism" ? "prism_block" : "charge_block");
        }
        enemy.hitTimer = 0.16;
        orb.hits.set(enemy, state.pierce ? 0.2 : 0.55);
        state.sparks.push({ x: enemy.x, y: enemy.y, life: 0.25 });
        playSound("hit", 0.06);
      }
    });
  }

  function canDamageEnemy(enemy) {
    if (enemy.phased) return false;
    if (enemy.bossId === "prism" && !enemy.weakOpen) return false;
    if (enemy.bossId === "tempest" && enemy.chargeState !== "recovery") return false;
    return true;
  }

  function showUpgrade() {
    state.mode = "upgrade";
    cancelAnimationFrame(raf);
    state.stonesEarned += 3 + state.wave + (save.rooms.tower || 0);
    nodes.hintText.textContent = t("waveClear");
    renderUpgradeCards();
    show(nodes.upgradePanel);
    window.requestAnimationFrame(() => nodes.upgradeCards.querySelector(".upgrade-card")?.focus({ preventScroll: true }));
    window.WonderAnalytics?.track("wave_clear", { game_id: GAME_ID, wave: state.wave });
  }

  function currentUpgradeChoices() {
    const seed = state.wave + state.shotCount + (state.rerolled ? 5 : 0);
    return [0, 1, 2].map((offset) => upgradeDefs[(seed + offset) % upgradeDefs.length]);
  }

  let rerollConfirmTimer = 0;
  let rerollConfirmRemaining = 0;
  let rerollConfirmDueAt = 0;

  function clearRerollConfirmation() {
    clearTimeout(rerollConfirmTimer);
    rerollConfirmTimer = 0;
    rerollConfirmRemaining = 0;
    rerollConfirmDueAt = 0;
    state.rerollPending = false;
  }

  function armRerollConfirmation(delay = rerollConfirmRemaining) {
    if (!state.rerollPending || document.hidden || !windowFocused) return;
    clearTimeout(rerollConfirmTimer);
    rerollConfirmRemaining = Math.max(0, Number(delay) || 0);
    rerollConfirmDueAt = performance.now() + rerollConfirmRemaining;
    rerollConfirmTimer = window.setTimeout(() => {
      rerollConfirmTimer = 0;
      rerollConfirmRemaining = 0;
      rerollConfirmDueAt = 0;
      if (state.mode !== "upgrade" || state.rerolled || document.hidden) return;
      state.rerollPending = false;
      renderUpgradeCards();
    }, rerollConfirmRemaining);
  }

  function suspendRerollConfirmation() {
    if (!state.rerollPending || !rerollConfirmTimer) return;
    rerollConfirmRemaining = Math.max(0, rerollConfirmDueAt - performance.now());
    clearTimeout(rerollConfirmTimer);
    rerollConfirmTimer = 0;
    rerollConfirmDueAt = 0;
  }

  function resumeRerollConfirmation() {
    if (!state.rerollPending || rerollConfirmTimer || document.hidden || !windowFocused) return;
    armRerollConfirmation();
  }

  function renderUpgradeCards() {
    if (!nodes.upgradeCards) return;
    const choices = currentUpgradeChoices();
    const balance = walletDiamonds();
    nodes.upgradeStatus.textContent = state.rerolled
      ? t("rerolled")
      : state.rerollPending
        ? t("rerollDecision", { before: balance, after: Math.max(0, balance - rerollCost) })
        : "";
    nodes.rerollBtn.textContent = state.rerollPending
      ? t("rerollConfirm", { before: balance, after: Math.max(0, balance - rerollCost) })
      : `${t("reroll")} (${balance})`;
    nodes.rerollBtn.setAttribute("aria-label", state.rerollPending
      ? t("rerollConfirmLabel", { before: balance, after: Math.max(0, balance - rerollCost) })
      : t("rerollLabel", { balance }));
    nodes.rerollBtn.classList.toggle("is-confirming", state.rerollPending);
    nodes.rerollBtn.disabled = state.rerolled;
    nodes.upgradeCards.innerHTML = choices
      .map(
        (upgrade) => `
          <button type="button" class="upgrade-card" data-upgrade="${upgrade.id}">
            <img class="upgrade-icon" src="${upgrade.iconSrc}" alt="" />
            <strong>${t(upgrade.name)}</strong>
            <span>${t(upgrade.desc)}</span>
          </button>`
      )
      .join("");
  }

  function chooseUpgrade(id) {
    if (state.mode !== "upgrade") return;
    clearRerollConfirmation();
    if (id === "damage") state.baseDamage += 1;
    if (id === "split") state.split = true;
    if (id === "pierce") state.pierce = true;
    if (id === "recharge") state.orbCooldown = Math.max(0.25, state.orbCooldown - 0.16);
    if (id === "shield") state.core = Math.min(state.maxCore, state.core + 4);
    if (id === "magnet") state.bonusStones += 2;
    state.wave += 1;
    state.rerolled = false;
    spawnWave();
    state.mode = "running";
    nodes.hintText.textContent = activeEncounterCue() || t("aimHint");
    backgroundSuspended = false;
    show(nodes.gamePanel);
    window.requestAnimationFrame(() => canvas.focus({ preventScroll: true }));
    playSound("success", 0.2);
    window.WonderAnalytics?.track("upgrade_pick", { game_id: GAME_ID, upgrade: id, wave: state.wave });
    lastFrame = performance.now();
    loop(lastFrame);
  }

  function rerollChoices() {
    if (state.mode !== "upgrade" || state.rerolled) return;
    const balance = walletDiamonds();
    if (balance < rerollCost) {
      clearRerollConfirmation();
      nodes.upgradeStatus.textContent = t("rerollNeed", { balance });
      nodes.rerollBtn.classList.remove("is-confirming");
      playSound("wrong", 0.2);
      return;
    }
    if (!state.rerollPending) {
      state.rerollPending = true;
      renderUpgradeCards();
      armRerollConfirmation(5000);
      return;
    }
    clearRerollConfirmation();
    const wallet = window.WeightPlayWallet;
    if (!wallet?.spendDiamonds || !wallet.spendDiamonds(rerollCost)) {
      nodes.upgradeStatus.textContent = t("rerollNeed", { balance: walletDiamonds() });
      playSound("wrong", 0.2);
      return;
    }
    state.rerolled = true;
    renderUpgradeCards();
    window.WonderAnalytics?.track("relic_reroll", { game_id: GAME_ID, cost: rerollCost });
  }

  function finishRaid(win) {
    if (state.mode === "result") return;
    state.mode = "result";
    resultDecisionCommitted = false;
    backgroundSuspended = false;
    cancelAnimationFrame(raf);
    const stones = Math.max(1, state.stonesEarned + state.bonusStones + (win ? 5 : 1));
    save.starStones += stones;
    if (win) save.bestRaid = Math.max(1, Math.min(MAX_RAID_TIER, Math.max(save.bestRaid || 1, state.raidTier + 1)));
    persist();
    nodes.resultTitle.textContent = t(win ? "raidClear" : "raidFailed");
    const resultSummary = t(win ? "resultWin" : "resultLose", {
      tier: state.raidTier,
      wave: Math.min(3, state.wave),
      stones,
      core: Math.max(0, Math.ceil(state.core)),
    });
    const progressKey = win ? (state.raidTier < MAX_RAID_TIER ? "progressUnlocked" : "progressComplete") : "progressSaved";
    nodes.resultText.textContent = `${resultSummary} ${t(progressKey, {
      total: save.starStones,
      best: Math.max(1, Math.min(MAX_RAID_TIER, save.bestRaid || 1)),
    })}`;
    nodes.skillReportText.textContent = t(win ? "reportWin" : "reportLose");
    const hasNextStage = win && state.raidTier < MAX_RAID_TIER;
    nodes.nextStageBtn.classList.toggle("is-unavailable", !hasNextStage);
    nodes.nextStageBtn.disabled = !hasNextStage;
    nodes.nextStageBtn.classList.toggle("primary-btn", hasNextStage);
    nodes.nextStageBtn.classList.toggle("secondary-btn", !hasNextStage);
    const menuIsPrimary = win && !hasNextStage;
    nodes.resultMenuBtn.classList.toggle("primary-btn", menuIsPrimary);
    nodes.resultMenuBtn.classList.toggle("secondary-btn", !menuIsPrimary);
    nodes.retryBtn.classList.toggle("primary-btn", !win);
    nodes.retryBtn.classList.toggle("secondary-btn", win);
    show(nodes.resultPanel);
    (hasNextStage ? nodes.nextStageBtn : win ? nodes.resultMenuBtn : nodes.retryBtn).focus({ preventScroll: true });
    renderMenu();
    playSound(win ? "success" : "wrong", 0.2);
    window.WonderAnalytics?.track("raid_result", { game_id: GAME_ID, win, wave: Math.min(3, state.wave), stones });
  }

  function commitResultDecision(action) {
    if (resultDecisionCommitted || state.mode !== "result" || nodes.resultPanel.classList.contains("is-hidden")) return;
    resultDecisionCommitted = true;
    action();
  }

  function drawAtlas(img, index, count, x, y, size) {
    if (!img?.complete || !img.naturalWidth) return;
    const sw = img.naturalWidth / count;
    const sh = img.naturalHeight;
    ctx.drawImage(img, sw * index, 0, sw, sh, x - size / 2, y - size / 2, size, size);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    if (images.bg?.complete) drawImageCover(images.bg, 0, 0, W, H);
    ctx.fillStyle = "rgba(3, 10, 28, 0.34)";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = raidProfile(state.raidTier).tint;
    ctx.fillRect(0, 0, W, H);
    const contrastGlow = ctx.createRadialGradient(W * 0.5, H * 0.35, 80, W * 0.5, H * 0.45, W * 0.7);
    contrastGlow.addColorStop(0, "rgba(24, 41, 84, 0.18)");
    contrastGlow.addColorStop(0.62, "rgba(8, 18, 42, 0.24)");
    contrastGlow.addColorStop(1, "rgba(3, 9, 24, 0.46)");
    ctx.fillStyle = contrastGlow;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(126, 255, 202, 0.6)";
    ctx.lineWidth = 5;
    ctx.strokeRect(34, 34, W - 68, H - 68);

    if (state.preview.length > 1) {
      ctx.strokeStyle = "rgba(255, 230, 112, 0.86)";
      ctx.lineWidth = 4;
      ctx.setLineDash([12, 10]);
      ctx.beginPath();
      ctx.moveTo(state.preview[0].x, state.preview[0].y);
      state.preview.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
      ctx.setLineDash([]);
    }

    drawPylons();
    state.enemies.forEach(drawEnemy);
    state.orbs.forEach((orb) => drawAtlas(images.orbs, orb.skin || 0, 5, orb.x, orb.y, 48));
    state.sparks.forEach((spark) => {
      const maxLife = spark.maxLife || 0.25;
      ctx.globalAlpha = Math.max(0, spark.life / maxLife);
      if (spark.kind === "companion") {
        ctx.strokeStyle = "#7dffd0";
        ctx.lineWidth = 9;
        ctx.shadowColor = "#f7df62";
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.moveTo(spark.fromX, spark.fromY);
        ctx.lineTo(spark.x, spark.y);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      drawAtlas(images.fx, 1, 4, spark.x, spark.y, 70);
      ctx.globalAlpha = 1;
    });

    drawCore();
    drawAtlas(images.lion, 0, 1, state.launcher.x, state.launcher.y + 8, 86);
  }

  function drawImageCover(image, x, y, width, height) {
    const sourceRatio = image.naturalWidth / image.naturalHeight;
    const targetRatio = width / height;
    let sourceWidth = image.naturalWidth;
    let sourceHeight = image.naturalHeight;
    let sourceX = 0;
    let sourceY = 0;
    if (sourceRatio > targetRatio) {
      sourceWidth = image.naturalHeight * targetRatio;
      sourceX = (image.naturalWidth - sourceWidth) / 2;
    } else {
      sourceHeight = image.naturalWidth / targetRatio;
      sourceY = (image.naturalHeight - sourceHeight) / 2;
    }
    ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
  }

  function drawPylons() {
    state.pylons.forEach((pylon) => {
      ctx.save();
      ctx.translate(pylon.x, pylon.y);
      ctx.rotate(performance.now() / 1400);
      ctx.shadowColor = "#7de9ff";
      ctx.shadowBlur = 22;
      ctx.fillStyle = "rgba(13, 63, 94, 0.92)";
      ctx.strokeStyle = "#b8fff3";
      ctx.lineWidth = 6;
      ctx.beginPath();
      for (let index = 0; index < 6; index += 1) {
        const angle = -Math.PI / 2 + index * Math.PI / 3;
        const x = Math.cos(angle) * pylon.r;
        const y = Math.sin(angle) * pylon.r;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ffe87b";
      ctx.fillRect(-5, -18, 10, 36);
      ctx.restore();
    });
  }

  function enemySpriteIndex(kind) {
    if (["thorn", "armored", "anchor", "charger"].includes(kind)) return 1;
    if (["wisp", "phase"].includes(kind)) return 2;
    return 0;
  }

  function drawEnemy(enemy) {
    const size = enemy.kind === "boss" ? 156 : enemy.size * 2.25;
    ctx.save();
    const aura = enemy.kind === "anchor" ? "#8fff9a" : enemy.kind === "charger" ? "#68c8ff" : enemy.kind === "splitter" ? "#d6a1ff" : enemy.kind === "thorn" || enemy.kind === "armored" ? "#ffd56a" : enemy.kind === "boss" ? "#ff8fcb" : "#8ee7ff";
    const shadow = enemy.kind === "thorn" || enemy.kind === "armored" ? "rgba(255, 202, 86, 0.9)" : enemy.kind === "boss" ? "rgba(255, 105, 190, 0.9)" : "rgba(132, 210, 255, 0.88)";
    const halo = ctx.createRadialGradient(enemy.x, enemy.y, size * 0.14, enemy.x, enemy.y, size * 0.9);
    halo.addColorStop(0, "rgba(3, 10, 30, 0.18)");
    halo.addColorStop(0.58, "rgba(3, 10, 30, 0.5)");
    halo.addColorStop(1, "rgba(3, 10, 30, 0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, size * 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = shadow;
    ctx.shadowBlur = enemy.hitTimer > 0 ? 46 : 32;
    ctx.fillStyle = enemy.kind === "boss" ? "rgba(45, 4, 35, 0.96)" : "rgba(1, 7, 26, 0.94)";
    ctx.beginPath();
    ctx.ellipse(enemy.x, enemy.y + size * 0.1, size * 0.74, size * 0.58, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = aura;
    ctx.lineWidth = enemy.kind === "boss" ? 8 : 5;
    ctx.globalAlpha = enemy.phased ? 0.4 : enemy.hitTimer > 0 ? 1 : 0.9;
    ctx.stroke();
    if (enemy.kind === "boss") drawAtlas(images[enemy.imageKey] || images.bossRootbound, 0, 1, enemy.x, enemy.y, size);
    else drawAtlas(images.beasts, enemySpriteIndex(enemy.kind), 3, enemy.x, enemy.y, size);
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.strokeStyle = enemy.hitTimer > 0 ? "#fff7a8" : "rgba(244, 255, 236, 0.98)";
    ctx.lineWidth = enemy.kind === "boss" ? 4.5 : 3;
    ctx.beginPath();
    ctx.ellipse(enemy.x, enemy.y + size * 0.08, size * 0.54, size * 0.44, 0, 0, Math.PI * 2);
    ctx.stroke();
    if (enemy.elite) {
      ctx.strokeStyle = "#ffd86b";
      ctx.lineWidth = 7;
      ctx.setLineDash([12, 8]);
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, size * 0.68, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    if (enemy.shield > 0) {
      ctx.strokeStyle = "rgba(126, 233, 255, 0.96)";
      ctx.lineWidth = 6;
      ctx.shadowColor = "#7de9ff";
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, size * 0.76, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    if (enemy.phased) {
      ctx.strokeStyle = "rgba(170, 238, 255, 0.95)";
      ctx.lineWidth = 5;
      ctx.setLineDash([16, 10]);
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, size * 0.83, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    if (enemy.chargeState === "marked") {
      ctx.strokeStyle = "rgba(255, 224, 92, 0.94)";
      ctx.lineWidth = 9;
      ctx.setLineDash([18, 12]);
      ctx.beginPath();
      ctx.moveTo(enemy.x, enemy.y + size * 0.45);
      ctx.lineTo(state.launcher.x, state.launcher.y - 56);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    if (enemy.bossId === "prism") {
      ctx.strokeStyle = enemy.weakOpen ? "#ffe56b" : "#71dfff";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, size * 0.86, -0.55, 0.55);
      ctx.stroke();
    }
    ctx.restore();
    const barW = Math.max(48, size * 0.58);
    ctx.fillStyle = "rgba(0, 5, 17, 0.96)";
    ctx.fillRect(enemy.x - barW / 2 - 3, enemy.y - size * 0.5 - 3, barW + 6, 13);
    ctx.fillStyle = "rgba(221, 247, 255, 0.22)";
    ctx.fillRect(enemy.x - barW / 2 - 1, enemy.y - size * 0.5 - 1, barW + 2, 9);
    ctx.fillStyle = enemy.hitTimer > 0 ? "#fff06a" : "#ff6478";
    ctx.fillRect(enemy.x - barW / 2, enemy.y - size * 0.5, barW * Math.max(0, enemy.hp / enemy.maxHp), 7);
    if (enemy.kind === "boss" && enemy.name) {
      ctx.save();
      ctx.font = "800 18px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.lineWidth = 5;
      ctx.strokeStyle = "rgba(0, 8, 18, 0.95)";
      ctx.strokeText(localized(enemy.name), enemy.x, enemy.y - size * 0.57);
      ctx.fillStyle = "#fff3a0";
      ctx.fillText(localized(enemy.name), enemy.x, enemy.y - size * 0.57);
      ctx.restore();
    }
  }

  function drawCore() {
    const pct = Math.max(0, state.core / state.maxCore);
    ctx.fillStyle = "rgba(4, 20, 18, 0.34)";
    ctx.beginPath();
    ctx.arc(state.launcher.x, state.launcher.y, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = pct > 0.35 ? "#7dffd0" : "#ff6878";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(state.launcher.x, state.launcher.y, 49, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
    ctx.stroke();
  }

  function maybeSmokeStart() {
    const params = new URLSearchParams(location.search);
    if (params.get("smoke") === "1" && params.get("autostart") === "1") {
      window.setTimeout(startRaid, 80);
    }
  }

  nodes.localeSelect.addEventListener("change", (event) => setLocale(event.target.value));
  nodes.startBtn.addEventListener("click", () => {
    show(nodes.stagePanel);
    renderMenu();
  });
  nodes.startBtn.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
  });
  nodes.stageBackBtn.addEventListener("click", () => show(nodes.menuPanel));
  nodes.stageRail.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ") && event.target.closest(".raid-card")) event.preventDefault();
  });
  nodes.stageRail.addEventListener("scroll", queueCenteredStageUpdate, { passive: true });
  window.addEventListener("resize", queueCenteredStageUpdate, { passive: true });
  nodes.stageRail.addEventListener("click", (event) => {
    const tier = Number(event.target?.closest?.("[data-tier]")?.dataset?.tier);
    if (tier && tier <= Math.max(1, Math.min(MAX_RAID_TIER, save.bestRaid || 1))) startRaid(tier);
  });
  nodes.retryBtn.addEventListener("click", () => commitResultDecision(() => startRaid(state.raidTier)));
  nodes.nextStageBtn.addEventListener("click", () => {
    if (!nodes.nextStageBtn.disabled && state.raidTier < MAX_RAID_TIER) {
      commitResultDecision(() => startRaid(state.raidTier + 1));
    }
  });
  nodes.mapBtn.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
  });
  nodes.mapBtn.addEventListener("click", () => setPaused(true, nodes.mapBtn));
  nodes.pauseBtn.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
  });
  nodes.pauseBtn.addEventListener("click", () => setPaused(true, nodes.pauseBtn));
  nodes.resumeBtn.addEventListener("click", () => setPaused(false));
  nodes.pauseMapBtn.addEventListener("click", () => {
    pauseFocusOwner = null;
    state.mode = "stage";
    nodes.pausePanel.classList.add("is-hidden");
    show(nodes.stagePanel);
    renderMenu();
  });
  nodes.pausePanel.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setPaused(false);
      return;
    }
    if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
    if (event.key !== "Tab") return;
    const actions = [nodes.resumeBtn, nodes.pauseMapBtn].filter((button) => !button.disabled && button.getClientRects().length);
    const first = actions[0];
    const last = actions.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  nodes.resultMenuBtn.addEventListener("click", () => {
    commitResultDecision(() => {
      state.mode = "stage";
      show(nodes.stagePanel);
      renderMenu();
    });
  });
  nodes.resultPanel.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      return;
    }
    if (event.key !== "Tab") return;
    const actions = Array.from(nodes.resultPanel.querySelectorAll("button"))
      .filter((button) => !button.disabled && button.getClientRects().length);
    if (!actions.length) return;
    const first = actions[0];
    const last = actions.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    } else if (!actions.includes(document.activeElement)) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  });
  nodes.roomGrid.addEventListener("click", (event) => {
    const id = event.target?.dataset?.room;
    if (id) upgradeRoom(id, event.detail === 0);
  });
  nodes.roomGrid.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
  });
  nodes.upgradePanel.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const actions = Array.from(nodes.upgradePanel.querySelectorAll("button"))
      .filter((button) => !button.disabled && button.getClientRects().length);
    if (!actions.length) return;
    const first = actions[0];
    const last = actions.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    } else if (!actions.includes(document.activeElement)) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  });
  nodes.upgradeCards.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
  });
  nodes.upgradeCards.addEventListener("click", (event) => {
    const id = event.target?.closest?.("[data-upgrade]")?.dataset?.upgrade;
    if (id) chooseUpgrade(id);
  });
  nodes.rerollBtn.addEventListener("keydown", (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
  });
  nodes.rerollBtn.addEventListener("click", rerollChoices);
  document.querySelector("button[data-sound-toggle]")?.addEventListener("click", localizeGameSoundToggle);
  canvas.addEventListener("pointerdown", onPointerStart);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerEnd);
  canvas.addEventListener("pointercancel", cancelPointerAim);
  canvas.addEventListener("lostpointercapture", cancelPointerAim);
  canvas.addEventListener("keydown", onCanvasKeydown);
  window.addEventListener("blur", () => {
    windowFocused = false;
    suspendBackgroundRaid();
  });
  function suspendBackgroundRaid() {
    cancelPointerAim();
    suspendRerollConfirmation();
    if (state.mode !== "running" || backgroundSuspended) return;
    backgroundSuspended = true;
    cancelAnimationFrame(raf);
  }
  function resumeBackgroundRaid() {
    if (document.hidden || !windowFocused) return;
    resumeRerollConfirmation();
    if (!backgroundSuspended) return;
    backgroundSuspended = false;
    if (state.mode !== "running") return;
    lastFrame = performance.now();
    raf = requestAnimationFrame(loop);
  }
  window.addEventListener("pagehide", suspendBackgroundRaid);
  window.addEventListener("pageshow", resumeBackgroundRaid);
  window.addEventListener("focus", () => {
    windowFocused = true;
    resumeBackgroundRaid();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) suspendBackgroundRaid();
    else resumeBackgroundRaid();
  });

  function runCampaignMechanicScenario() {
    const priorState = state;
    const priorSelectedTier = selectedTier;
    try {
      selectedTier = 30;
      state = makeState();
      const collide = (enemy) => {
        state.enemies = [enemy];
        state.pylons = [];
        const orb = makeOrb(0, -80, 0);
        orb.x = enemy.x;
        orb.y = enemy.y;
        const before = { hp: enemy.hp, shield: enemy.shield };
        updateOrb(orb, 0.016);
        return { before, after: { hp: enemy.hp, shield: enemy.shield } };
      };

      const armored = makeEnemy("armored", 300, 280, 12, 0, 34, { shield: 2 });
      const armor = collide(armored);

      const phased = makeEnemy("phase", 300, 280, 10, 0, 28);
      phased.phased = true;
      const phase = collide(phased);

      const splitter = makeEnemy("splitter", 300, 280, 12, 0, 28);
      splitter.hp = 0;
      state.enemies = [splitter];
      resolveEnemyDeaths();
      const split = { shards: state.enemies.filter((enemy) => enemy.kind === "shard").length, spawnedShards: state.spawnedShards };

      const ally = makeEnemy("skitter", 280, 300, 8, 0, 28);
      const anchor = makeEnemy("anchor", 360, 300, 12, 0, 36);
      anchor.behaviorTimer = 0;
      state.enemies = [ally, anchor];
      updateEnemyBehavior(anchor, 0.016);
      const anchorGuard = { allyShield: ally.shield, stationary: anchor.stationary };

      const charger = makeEnemy("charger", 320, 260, 14, 12, 34);
      charger.behaviorTimer = 0;
      updateEnemyBehavior(charger, 0.016);
      const marked = charger.chargeState;
      charger.behaviorTimer = 0;
      updateEnemyBehavior(charger, 0.016);
      const charging = charger.chargeState;
      charger.behaviorTimer = 0;
      updateEnemyBehavior(charger, 0.016);
      const recovery = charger.chargeState;

      state.enemies = [];
      state.pylons = [{ x: 360, y: 300, r: 31, moving: false }];
      const pylonOrb = makeOrb(120, 0, 0);
      pylonOrb.x = 360 - 48;
      pylonOrb.y = 300;
      const beforeVelocity = pylonOrb.vx;
      updateOrb(pylonOrb, 0.016);
      const pylon = { beforeVelocity, afterVelocity: pylonOrb.vx, events: [...state.mechanicEvents] };

      const makeBossProbe = (tier) => {
        const def = bossDefForTier(tier);
        return makeEnemy("boss", 360, 220, 60, 8, 58, { bossId: def.id, imageKey: def.imageKey, name: def.name, cue: def.cue });
      };
      const rootbound = makeBossProbe(5);
      rootbound.shield = 0;
      rootbound.behaviorTimer = 0;
      state.enemies = [rootbound];
      updateEnemyBehavior(rootbound, 0.016);

      const brambleback = makeBossProbe(10);
      brambleback.hp = 30;
      state.enemies = [brambleback];
      updateEnemyBehavior(brambleback, 0.016);
      const brambleSummons = state.enemies.filter((enemy) => enemy.kind === "anchor").length;

      const lunar = makeBossProbe(15);
      lunar.phased = true;

      const prism = makeBossProbe(20);
      prism.weakOpen = false;
      const prismClosed = canDamageEnemy(prism);
      prism.behaviorTimer = 0;
      state.enemies = [prism];
      updateEnemyBehavior(prism, 0.016);

      const tempest = makeBossProbe(25);
      tempest.behaviorTimer = 0;
      updateEnemyBehavior(tempest, 0.016);
      tempest.behaviorTimer = 0;
      updateEnemyBehavior(tempest, 0.016);
      tempest.behaviorTimer = 0;
      updateEnemyBehavior(tempest, 0.016);

      const voidcore = makeBossProbe(30);
      voidcore.hp = 18;
      state.enemies = [voidcore];
      updateEnemyBehavior(voidcore, 0.016);

      return {
        armor,
        phase,
        split,
        anchorGuard,
        charger: { marked, charging, recovery },
        pylon,
        bosses: {
          rootbound: { rebuiltShield: rootbound.shield },
          brambleback: { summons: brambleSummons },
          lunar: { damageableWhilePhased: canDamageEnemy(lunar) },
          prism: { damageableClosed: prismClosed, damageableOpen: canDamageEnemy(prism) },
          tempest: { state: tempest.chargeState, damageable: canDamageEnemy(tempest) },
          voidcore: { phase: voidcore.bossPhase, summons: state.enemies.length - 1, shield: voidcore.shield, pylons: state.pylons.length },
        },
      };
    } finally {
      state = priorState;
      selectedTier = priorSelectedTier;
    }
  }

  window.__animalOrbFortressSmoke = {
    snapshot: () => ({
      mode: state.mode,
      wave: state.wave,
      raidTier: state.raidTier,
      core: state.core,
      maxCore: state.maxCore,
      shotCount: state.shotCount,
      enemies: state.enemies.length,
      enemyKinds: state.enemies.map((enemy) => enemy.kind),
      totalEnemyHp: state.enemies.reduce((total, enemy) => total + enemy.hp, 0),
      maxEnemySpeed: state.enemies.reduce((max, enemy) => Math.max(max, enemy.speed), 0),
      shieldedEnemies: state.enemies.filter((enemy) => enemy.shield > 0).length,
      eliteEnemies: state.enemies.filter((enemy) => enemy.elite).length,
      bossIds: state.enemies.filter((enemy) => enemy.kind === "boss").map((enemy) => enemy.bossId),
      bossNames: state.enemies.filter((enemy) => enemy.kind === "boss").map((enemy) => localized(enemy.name)),
      phasedEnemies: state.enemies.filter((enemy) => enemy.phased).length,
      pylons: state.pylons.length,
      spawnedShards: state.spawnedShards,
      mechanicEvents: [...state.mechanicEvents],
      orbs: state.orbs.length,
      activeOrbLimit: activeOrbLimit(),
      previewPoints: state.preview.length,
      keyboardAim: Math.round(keyboardAimDeg + 90),
      stonesEarned: state.stonesEarned,
      companionDamage: state.companionDamage,
      companionTimer: state.companionTimer,
      companionHits: state.companionHits,
      simulation: {
        readyTimer: state.readyTimer,
        companionTimer: state.companionTimer,
        enemies: state.enemies.map((enemy) => ({ x: enemy.x, y: enemy.y, hp: enemy.hp })),
        orbs: state.orbs.map((orb) => ({ x: orb.x, y: orb.y, life: orb.life })),
        pylons: state.pylons.map((pylon) => ({ x: pylon.x, y: pylon.y })),
      },
      rerolled: state.rerolled,
      walletDiamonds: walletDiamonds(),
      save,
      title: t("title"),
    }),
    campaignDepth: () => ({
      stageCount: raidDefs.length,
      regions: [...new Set(raidDefs.map((raid) => raid.zone))],
      routes: raidDefs.map((raid) => ({ tier: raid.tier, zone: raid.zone, name: localized(raid.name), description: localized(raid.desc), rule: raid.rule })),
      bosses: bossDefs.map((boss) => ({ tier: boss.tier, id: boss.id, imageKey: boss.imageKey, name: localized(boss.name), loaded: Boolean(images[boss.imageKey]?.complete && images[boss.imageKey]?.naturalWidth) })),
      specialKinds: ["armored", "anchor", "phase", "splitter", "charger"],
    }),
    runCampaignMechanicScenario,
    forceClearWave: () => {
      state.enemies = [];
      update(0.016);
    },
    forceCoreBreach: () => {
      state.enemies = [makeEnemy("skitter", state.launcher.x, state.launcher.y - 10, 1, 0, 42)];
      state.core = 1;
      update(0.016);
    },
    forceWin: () => finishRaid(true),
    forceCollisionProbe: () => {
      const enemy = makeEnemy("skitter", state.launcher.x, state.launcher.y - 90, 8, 0, 42);
      const orb = makeOrb(0, -80, 0);
      orb.x = enemy.x;
      orb.y = enemy.y + orb.r + enemy.size * 0.7 - 2;
      state.enemies = [enemy];
      state.orbs = [orb];
      const before = enemy.hp;
      updateOrb(orb, 0.016);
      return { before, after: enemy.hp, damage: before - enemy.hp, distance: Math.hypot(orb.x - enemy.x, orb.y - enemy.y) };
    },
    setRoomLevel: (id, level) => {
      if (!roomDefs.some((room) => room.id === id)) return null;
      save.rooms[id] = Math.max(0, Math.min(5, Math.floor(Number(level) || 0)));
      persist();
      renderMenu();
      return save.rooms[id];
    },
    setBestRaid: (tier) => {
      save.bestRaid = Math.max(1, Math.min(MAX_RAID_TIER, Math.floor(Number(tier) || 1)));
      persist();
      renderMenu();
      return save.bestRaid;
    },
    forceCheckpoint: (tier) => {
      const checkpoint = Math.max(5, Math.min(MAX_RAID_TIER, Math.floor(Number(tier) / 5) * 5));
      selectedTier = checkpoint;
      state = makeState();
      state.mode = "running";
      state.wave = WAVES_PER_RAID;
      spawnWave();
      show(nodes.gamePanel);
      renderHud();
      draw();
      return window.__animalOrbFortressSmoke.snapshot();
    },
    forceCompanionStrike: () => {
      const target = makeEnemy("skitter", state.launcher.x, state.launcher.y - 180, 8, 0, 42);
      state.enemies = [target];
      state.companionTimer = 0;
      const before = target.hp;
      updateCompanion(0.016);
      return {
        before,
        after: target.hp,
        damage: before - target.hp,
        companionHits: state.companionHits,
        effect: state.sparks.at(-1)?.kind || "",
      };
    },
    forceCompanionTargetPriority: () => {
      const phased = makeEnemy("phase", state.launcher.x, state.launcher.y - 80, 8, 0, 42);
      const vulnerable = makeEnemy("skitter", state.launcher.x, state.launcher.y - 180, 8, 0, 42);
      phased.phased = true;
      state.enemies = [phased, vulnerable];
      state.companionTimer = 0;
      const hitsBefore = state.companionHits;
      updateCompanion(0.016);
      return {
        phasedHp: phased.hp,
        vulnerableHp: vulnerable.hp,
        vulnerableDamage: vulnerable.maxHp - vulnerable.hp,
        companionHits: state.companionHits - hitsBefore,
        effect: state.sparks.at(-1)?.kind || "",
      };
    },
    prepareKeyboardRepeat: () => {
      state.orbs = [];
      state.readyTimer = 0;
      state.enemies = [makeEnemy("skitter", W / 2, 90, 9999, 0, 42)];
      updateArenaControlLabel(true);
      return window.__animalOrbFortressSmoke.snapshot();
    },
    prepareKeyboardOrbLimit: () => {
      state.readyTimer = 0;
      state.orbs = Array.from({ length: activeOrbLimit() }, (_, index) => makeOrb(index * 8, -80, index % 5));
      updateArenaControlLabel(true);
      return canvas.getAttribute("aria-label") || "";
    },
  };

  const guideLoadObserver = new MutationObserver((mutations) => {
    const guideAdded = mutations.some((mutation) => Array.from(mutation.addedNodes || []).some((node) =>
      node.nodeType === 1 && (node.matches?.(".game-page-info") || node.querySelector?.(".game-page-info"))
    ));
    if (guideAdded) scheduleGameLocalLocalization();
  });
  guideLoadObserver.observe(document.body, { childList: true });
  window.setTimeout(() => guideLoadObserver.disconnect(), 5000);

  setLocale(locale);
  exposeBasicReady();
  preload();
})();
