(() => {
  const $ = (s) => document.querySelector(s);
  const KEY = "weightplay_moonlight_heist_v1";
  const localeKey = "weightPlayLocale", legacyLocaleKey = "weightplayLocale";
  const copy = {
    en:{title:"Animal Moonlight Heist",internal:"Moon Archive Missions",pitch:"Read the patrols, recover the relic, and choose when to extract.",start:"Choose Mission",missions:"Moon Archive",chooseGadget:"Choose Gadget",alert:"Alert",holdRoute:"Hold to preview a route.",objective:"Recover the mission object",locked:"Complete the previous mission",retry:"Retry",next:"Next Mission",victory:"Mission Complete",captured:"Captured",capturedText:"The patrol raised the alarm. Retry is free.",treasure:"Bonus treasure recovered",extraction:"Reach the extraction gate",dash:"Lightning Dash",decoy:"Star Decoy",smoke:"Smoke Leaf",dashEffect:"Fast route: {ms}ms move",decoyEffect:"Patrol pause: {seconds}s",smokeEffect:"Alert reset + {seconds}s cover",coins:"Moon Coins",safehouse:"Safehouse Lv.{n}",mission:"Mission {n}",move:"Release to move",found:"Object secured!",exitReady:"Extraction ready",treasureFound:"Treasure secured",paused:"Paused",diamonds:"Diamonds",reroll:"Reroll 3",insure:"Insure 5",insured:"Insured",alreadyInsured:"Extraction insurance is already active.",notEnough:"Not enough Diamonds.",rerolled:"Gadget offers rerolled.",insuranceReady:"Extraction insurance active for the next mission.",confirmSpend:"Confirm {cost} · {before}→{after}",rerollDecision:"Reroll all three gadget strengths. Tap again to confirm: {before} → {after} Diamonds.",insuranceDecision:"Keep bonus treasure after one capture in the next mission. Tap again to confirm: {before} → {after} Diamonds.",rerollLabel:"Reroll all three gadget strengths. Costs 3 Diamonds. Current balance {balance}.",insuranceLabel:"Insure bonus treasure for one capture in the next mission. Costs 5 Diamonds. Current balance {balance}.",confirmLabel:"Confirm {action}. Spend {cost} Diamonds. Balance {before} to {after}.",rerollAction:"gadget strength reroll",insuranceAction:"treasure insurance",insuredLabel:"Treasure insurance is active for the next mission."},
    "zh-Hant":{title:"動物月影潛行隊",internal:"月光檔案任務",pitch:"觀察巡邏、找回文物，並決定何時安全撤離。",start:"選擇任務",missions:"月光檔案館",chooseGadget:"選擇技能",alert:"警戒",holdRoute:"按住畫面預覽路線。",objective:"找回任務物件",locked:"先完成上一個任務",retry:"重試",next:"下一關",victory:"任務完成",captured:"被發現了",capturedText:"巡邏隊已拉滿警戒。免費重新挑戰。",treasure:"已取得額外寶藏",extraction:"前往撤離門",dash:"閃電衝刺",decoy:"星光誘餌",smoke:"煙霧葉片",coins:"月光金幣",safehouse:"安全屋 Lv.{n}",mission:"任務 {n}",move:"放開即可移動",found:"已取得任務物件！",exitReady:"撤離門已開啟",treasureFound:"已取得寶藏",paused:"已暫停",diamonds:"鑽石",reroll:"重抽 3",insure:"保險 5",insured:"已投保",alreadyInsured:"撤離保險已啟用。",confirmReroll:"要花費 3 顆鑽石重抽技能強度嗎？",confirmInsurance:"要花費 5 顆鑽石，在被發現後保留額外寶藏嗎？",notEnough:"鑽石不足。",rerolled:"已重抽技能方案。",insuranceReady:"下一個任務已啟用撤離保險。"}
  };
  copy.es={title:"Golpe Animal a la Luz de la Luna",internal:"Misiones del Archivo Lunar",pitch:"Observa las patrullas, recupera la reliquia y decide cuándo evacuar.",start:"Elegir misión",missions:"Archivo Lunar",chooseGadget:"Elegir dispositivo",alert:"Alerta",holdRoute:"Mantén pulsado para previsualizar una ruta.",objective:"Recupera el objeto de la misión",locked:"Completa la misión anterior",retry:"Reintentar",next:"Siguiente misión",victory:"Misión completada",captured:"Descubierto",capturedText:"La patrulla dio la alarma. Reintentar es gratis.",treasure:"Tesoro adicional recuperado",extraction:"Llega a la puerta de evacuación",dash:"Impulso relámpago",decoy:"Señuelo estelar",smoke:"Hoja de humo",dashEffect:"Ruta rápida: movimiento de {ms} ms",decoyEffect:"Pausa de patrulla: {seconds} s",smokeEffect:"Alerta reiniciada + {seconds} s de cobertura",coins:"Monedas lunares",safehouse:"Refugio Nv.{n}",mission:"Misión {n}",move:"Suelta para moverte",found:"¡Objeto asegurado!",exitReady:"Evacuación preparada",treasureFound:"Tesoro asegurado",paused:"En pausa",diamonds:"Diamantes",reroll:"Cambiar 3",insure:"Asegurar 5",insured:"Asegurado",alreadyInsured:"El seguro de evacuación ya está activo.",notEnough:"No tienes suficientes diamantes.",rerolled:"Se cambiaron las opciones de dispositivo.",insuranceReady:"Seguro de evacuación activo para la próxima misión.",confirmSpend:"Confirmar {cost} · {before}→{after}",rerollDecision:"Cambia la potencia de los tres dispositivos. Toca otra vez para confirmar: {before} → {after} diamantes.",insuranceDecision:"Conserva el tesoro adicional tras ser descubierto una vez en la próxima misión. Toca otra vez para confirmar: {before} → {after} diamantes.",rerollLabel:"Cambiar la potencia de los tres dispositivos. Cuesta 3 diamantes. Saldo actual: {balance}.",insuranceLabel:"Asegura el tesoro adicional frente a una captura en la próxima misión. Cuesta 5 diamantes. Saldo actual: {balance}.",confirmLabel:"Confirma {action}. Gasta {cost} diamantes. Saldo de {before} a {after}.",rerollAction:"cambio de potencia de dispositivos",insuranceAction:"seguro del tesoro",insuredLabel:"El seguro del tesoro está activo para la próxima misión."};
  Object.assign(copy.en, {
    notCleared: "Not cleared",
    bestMedals: "Best {medals}/3 medals",
    perfectMedals: "Best 3/3 medals · Complete",
    bonusMedal: "Bonus treasure earns the final medal.",
    medalCount: "{medals} of 3 medals earned",
    resultMedals: "{medals}/3 medals",
    pauseAction: "Pause mission",
    resumeAction: "Resume mission",
    playFieldLabel: "Stealth route field. Use WASD or arrow keys to move and Space to use the gadget.",
    playFieldPassiveLabel: "Stealth route field. Use WASD or arrow keys to move. {name} is passive: {effect}.",
    playFieldActiveLabel: "Stealth route field. Use WASD or arrow keys to move and Space to use {name}: {effect}.",
    passiveGadgetLabel: "{name} is passive: {effect}.",
    activeGadgetLabel: "Use {name}: {effect}.",
    passive: "Passive",
    languageLabel: "Language",
    posterAlt: "Animal Moonlight Heist poster",
    orlaAlt: "Moon Cap Orla",
    missionRailLabel: "Missions",
    fiaAlt: "Spark Paw Fia",
    stageBackLabel: "Back to main menu",
    battleBackLabel: "Back to missions",
    checkpoint: "Guardian Checkpoint",
    firstSeal: "Recover the treasure seal first.",
    mirrorWarning: "Mirror shift incoming!",
    bellWarning: "Bell pulse incoming—reach shadow!",
    clockSlow: "Blue phase: patrols are slow.",
    clockSurge: "Amber phase: patrols surge!",
    guardianCleared: "Guardian route cleared",
  });
  Object.assign(copy["zh-Hant"], {
    notCleared: "\u5c1a\u672a\u5b8c\u6210",
    bestMedals: "\u6700\u4f73 {medals}/3 \u679a\u734e\u7ae0",
    perfectMedals: "\u6700\u4f73 3/3 \u679a\u734e\u7ae0 \u00b7 \u5df2\u5b8c\u6210",
    bonusMedal: "\u56de\u6536\u984d\u5916\u5bf6\u85cf\u53ef\u7372\u5f97\u6700\u5f8c\u4e00\u679a\u734e\u7ae0\u3002",
    medalCount: "\u5df2\u7372\u5f97 {medals}/3 \u679a\u734e\u7ae0",
    resultMedals: "{medals}/3 \u679a\u734e\u7ae0",
    pauseAction: "\u66ab\u505c\u4efb\u52d9",
    resumeAction: "\u7e7c\u7e8c\u4efb\u52d9",
    playFieldLabel: "\u6f5b\u884c\u8def\u7dda\u5340\u3002\u4f7f\u7528 WASD \u6216\u65b9\u5411\u9375\u79fb\u52d5\uff0c\u6309\u7a7a\u767d\u9375\u4f7f\u7528\u88dd\u7f6e\u3002",
    playFieldPassiveLabel: "\u6f5b\u884c\u8def\u7dda\u5340\u3002\u4f7f\u7528 WASD \u6216\u65b9\u5411\u9375\u79fb\u52d5\u3002{name}\u662f\u88ab\u52d5\u6548\u679c\uff1a{effect}\u3002",
    playFieldActiveLabel: "\u6f5b\u884c\u8def\u7dda\u5340\u3002\u4f7f\u7528 WASD \u6216\u65b9\u5411\u9375\u79fb\u52d5\uff0c\u6309\u7a7a\u767d\u9375\u4f7f\u7528{name}\uff1a{effect}\u3002",
    passiveGadgetLabel: "{name}\u662f\u88ab\u52d5\u6548\u679c\uff1a{effect}\u3002",
    activeGadgetLabel: "\u4f7f\u7528{name}\uff1a{effect}\u3002",
    passive: "\u88ab\u52d5",
    languageLabel: "\u8a9e\u8a00",
    posterAlt: "\u52d5\u7269\u6708\u5f71\u6f5b\u884c\u968a\u904a\u6232\u6d77\u5831",
    orlaAlt: "\u6708\u5e3d\u6b50\u62c9",
    missionRailLabel: "\u4efb\u52d9\u9078\u64c7",
    fiaAlt: "\u9583\u722a\u83f2\u4e9e",
    stageBackLabel: "\u8fd4\u56de\u4e3b\u9078\u55ae",
    battleBackLabel: "\u8fd4\u56de\u4efb\u52d9\u9078\u64c7",
    checkpoint: "守衛檢查點",
    firstSeal: "請先取得寶藏封印。",
    mirrorWarning: "鏡面即將換位！",
    bellWarning: "月鐘即將響起，快進入陰影！",
    clockSlow: "藍色階段：巡邏較慢。",
    clockSurge: "琥珀階段：巡邏加速！",
    guardianCleared: "已通過守衛路線",
  });
  Object.assign(copy.es, {
    notCleared:"Sin completar", bestMedals:"Mejor: {medals}/3 medallas", perfectMedals:"Mejor: 3/3 medallas · Completada", bonusMedal:"El tesoro adicional concede la última medalla.", medalCount:"{medals} de 3 medallas obtenidas", resultMedals:"{medals}/3 medallas", pauseAction:"Pausar misión", resumeAction:"Continuar misión", playFieldLabel:"Ruta de sigilo. Usa WASD o las flechas para moverte y Espacio para usar el dispositivo.", playFieldPassiveLabel:"Ruta de sigilo. Usa WASD o las flechas para moverte. {name} es pasivo: {effect}.", playFieldActiveLabel:"Ruta de sigilo. Usa WASD o las flechas para moverte y Espacio para usar {name}: {effect}.", passiveGadgetLabel:"{name} es pasivo: {effect}.", activeGadgetLabel:"Usa {name}: {effect}.", passive:"Pasivo", languageLabel:"Idioma", posterAlt:"Cartel de Golpe Animal a la Luz de la Luna", orlaAlt:"Orla Sombrero Lunar", missionRailLabel:"Misiones", fiaAlt:"Fia Garra Chispeante", stageBackLabel:"Volver al menú principal", battleBackLabel:"Volver a las misiones", checkpoint:"Puesto del guardián", firstSeal:"Recupera primero el sello del tesoro.", mirrorWarning:"¡Se acerca un cambio de espejos!", bellWarning:"¡Se acerca el pulso de la campana! ¡Busca una sombra!", clockSlow:"Fase azul: las patrullas van despacio.", clockSurge:"¡Fase ámbar: las patrullas aceleran!", guardianCleared:"Ruta del guardián completada"
  });
  const missionObjects=["moon-seal","courier-token","star-map","clockwork-lens","district-relic"];
  const patrolArt=["wolf","rabbit","badger"];
  const missions=[
    {name:["Archive Entrance","檔案館入口"],object:[50,44],treasure:[82,38],exit:[50,10],patrols:[[28,34,72,34]]},
    {name:["Lantern Hall","燈火長廊"],object:[25,30],treasure:[80,72],exit:[50,10],patrols:[[20,55,78,55],[68,25,68,78]]},
    {name:["Echo Gallery","回音畫廊"],object:[75,32],treasure:[22,28],exit:[50,10],patrols:[[18,42,82,42],[26,75,74,75]]},
    {name:["Clockwork Vault","發條密庫"],object:[24,24],treasure:[82,32],exit:[50,10],patrols:[[20,48,78,48],[34,22,34,78],[68,24,68,76]]},
    {name:["Moon Gate","月之門"],object:[50,42],treasure:[84,76],exit:[50,10],patrols:[[18,30,82,30],[22,62,78,62],[28,78,28,38]]}
  ];
  const gadgets={dash:{art:"lightning-dash"},decoy:{art:"star-decoy"},smoke:{art:"smoke-leaf"}};
  const guardianCatalog={
    spotlight:{id:"lantern-auditor",name:["Lantern Auditor","提燈審查官"],behavior:"spotlight",path:[18,24,82,24]},
    bell:{id:"bell-warden",name:["Bell Warden","月鐘守衛"],behavior:"bell",path:[18,50,82,50]},
    mirror:{id:"mirror-keeper",name:["Mirror Keeper","星鏡看守"],behavior:"mirror",path:[24,30,76,70]},
    clock:{id:"clockwork-marshal",name:["Clockwork Marshal","發條巡察長"],behavior:"clock",path:[18,42,82,42]},
    seals:{id:"vault-sealkeeper",name:["Vault Sealkeeper","寶庫封印官"],behavior:"seals",path:[26,34,74,34]},
    eclipse:{id:"eclipse-curator",name:["Eclipse Curator","日蝕館長"],behavior:"eclipse",path:[18,26,82,70]}
  };
  const campaignMission=(en,zh,ruleEn,ruleZh,data)=>({name:[en,zh],rule:[ruleEn,ruleZh],...data});
  const campaign=[
    campaignMission("Quiet Threshold","靜謐門廊","Read one patrol, recover the seal, then extract.","觀察單一路線，取得封印後撤離。",{object:[50,42],treasure:[82,36],exit:[50,10],patrols:[[24,32,76,32]],speed:.88}),
    campaignMission("Lantern Hall","燈火大廳","Cross behind two patrol lines.","從兩條巡邏線的空檔穿過。",{object:[24,30],treasure:[80,72],exit:[50,10],patrols:[[18,52,82,52],[70,24,70,78]],speed:.82}),
    campaignMission("Split Gallery","分岔畫廊","Choose the quiet side before the routes cross.","在巡邏交會前選擇安靜的一側。",{object:[76,32],treasure:[20,26],exit:[50,10],patrols:[[16,44,84,44],[25,76,75,76]],speed:.9}),
    campaignMission("Courier Stairs","信使階梯","The bonus treasure sits beyond the direct escape route.","額外寶藏位於直接撤離路線之外。",{object:[28,24],treasure:[82,34],exit:[18,10],patrols:[[18,48,82,48],[36,20,36,78],[70,28,70,76]],speed:.84}),
    campaignMission("Lantern Audit","提燈審查","The Auditor widens its searchlight; move after the glow shrinks.","審查官會擴大探照光，等光圈縮小再移動。",{object:[52,46],treasure:[84,74],exit:[50,10],patrols:[[20,66,80,66],[28,78,28,40]],guardian:guardianCatalog.spotlight,speed:.84}),
    campaignMission("Velvet Alcove","天鵝絨暗室","Shadow circles hide Fia from patrol sight.","站進陰影圓圈可避開巡邏視線。",{object:[72,30],treasure:[18,66],exit:[50,10],patrols:[[18,48,82,48],[28,76,74,76]],safeZones:[[30,60,11]],speed:.95}),
    campaignMission("Twin Shelves","雙層書架","Move from one shadow circle to the next.","依序利用兩個陰影圈前進。",{object:[22,26],treasure:[80,70],exit:[82,10],patrols:[[18,42,82,42],[16,68,84,68],[64,22,64,78]],safeZones:[[28,56,10],[70,56,10]],speed:.9}),
    campaignMission("Broken Skylight","破損天窗","A narrow shadow lane separates crossing patrols.","狹窄陰影通道位於交叉巡邏之間。",{object:[78,22],treasure:[20,24],exit:[50,10],patrols:[[18,38,82,72],[82,38,18,72],[18,82,82,82]],safeZones:[[50,56,9]],speed:.92}),
    campaignMission("Whisper Annex","低語側廳","Take the optional treasure before leaving the final shadow.","離開最後陰影前決定是否取得寶藏。",{object:[18,32],treasure:[82,28],exit:[50,10],patrols:[[18,48,82,48],[22,72,78,72],[50,22,50,82]],safeZones:[[26,62,10],[74,62,10]],alertDecay:24,speed:.94}),
    campaignMission("Bell Warden","月鐘守衛","The bell pulse raises Alert outside shadow circles.","月鐘脈衝會提高陰影圈外的警報。",{object:[74,28],treasure:[20,72],exit:[50,10],patrols:[[18,34,82,34],[22,70,78,70]],safeZones:[[26,52,11],[74,52,11]],guardian:guardianCatalog.bell,speed:.88}),
    campaignMission("Silver Fork","銀光岔路","The relic and treasure trade places after a warning shimmer.","警示閃光後，任務物與寶藏會交換位置。",{object:[24,28],treasure:[78,30],exit:[50,10],patrols:[[18,54,82,54],[26,76,74,76]],mirrorInterval:7,speed:.95}),
    campaignMission("Reflected Ledger","倒影帳冊","Wait for the marker swap or commit to the longer route.","等待標記換位，或承擔較長路線。",{object:[80,24],treasure:[20,70],exit:[18,10],patrols:[[18,42,82,42],[62,20,62,78],[18,76,78,76]],mirrorInterval:6.5,speed:.9}),
    campaignMission("False North","偽北廳","Recover the treasure first so the mirrored relic becomes real.","先取得寶藏，鏡中的任務物才會成真。",{object:[24,22],treasure:[78,72],exit:[82,10],patrols:[[18,38,82,38],[28,58,74,58],[22,78,78,78]],order:"treasure-first",mirrorInterval:7,speed:.92}),
    campaignMission("Prism Hall","稜鏡大廳","Use shadow while the two markers prepare to swap.","在兩個標記準備交換時利用陰影。",{object:[76,26],treasure:[22,26],exit:[50,10],patrols:[[18,48,82,48],[28,78,72,78]],safeZones:[[50,64,11]],mirrorInterval:6,speed:.96}),
    campaignMission("Mirror Keeper","星鏡看守","The Keeper swaps both markers quickly; read the shimmer cue.","看守會快速交換兩個標記，注意閃光預告。",{object:[24,26],treasure:[78,72],exit:[50,10],patrols:[[18,50,82,50],[24,78,76,78]],safeZones:[[50,64,10]],mirrorInterval:5,guardian:guardianCatalog.mirror,speed:.9}),
    campaignMission("Slow Gear Walk","慢齒走廊","Patrols alternate between a slow watch and a fast sweep.","巡邏會在慢速監看與快速掃蕩間交替。",{object:[72,26],treasure:[20,70],exit:[50,10],patrols:[[18,44,82,44],[22,72,78,72]],clockCycle:7,speed:.88}),
    campaignMission("Fast Pendulum","快擺長廊","Cross during the blue slow phase, not the amber surge.","在藍色慢速階段穿越，避開琥珀加速。",{object:[20,28],treasure:[80,28],exit:[82,10],patrols:[[18,38,82,70],[82,38,18,70],[20,80,80,80]],clockCycle:6.5,speed:.9}),
    campaignMission("Split Minute","分秒暗室","Combine shadow cover with the clockwork rhythm.","把陰影掩護與發條節奏結合。",{object:[78,24],treasure:[22,72],exit:[18,10],patrols:[[18,46,82,46],[30,22,30,80],[70,22,70,80]],safeZones:[[50,62,10]],clockCycle:6,speed:.92}),
    campaignMission("Second-Hand Vault","秒針寶庫","Take treasure first while patrol speed keeps changing.","在巡邏速度持續變化時先取得寶藏。",{object:[22,24],treasure:[78,70],exit:[50,10],patrols:[[18,36,82,36],[18,58,82,58],[24,80,76,80]],order:"treasure-first",clockCycle:5.8,speed:.9}),
    campaignMission("Clockwork Marshal","發條巡察長","The Marshal telegraphs each full-speed pursuit.","巡察長會預告每次全速追蹤。",{object:[76,26],treasure:[20,72],exit:[50,10],patrols:[[18,52,82,52],[24,78,76,78]],safeZones:[[50,66,9]],clockCycle:5.5,guardian:guardianCatalog.clock,speed:.9}),
    campaignMission("First Seal","第一封印","Treasure is the first seal; the relic unlocks second.","寶藏是第一道封印，之後才能取得任務物。",{object:[76,24],treasure:[22,70],exit:[50,10],patrols:[[18,42,82,42],[24,60,76,60],[22,80,78,80]],order:"treasure-first",speed:.94}),
    campaignMission("Crossed Keys","交錯鑰匙","Open the two seals across three crossing routes.","穿過三條交錯路線依序開啟兩道封印。",{object:[20,24],treasure:[80,26],exit:[50,10],patrols:[[18,38,82,70],[82,38,18,70],[50,22,50,82]],order:"treasure-first",alertDecay:22,speed:.9}),
    campaignMission("Locked Moonwell","封鎖月井","Carry the first seal through two shadow shelters.","帶著第一道封印穿過兩處陰影掩護。",{object:[78,24],treasure:[20,72],exit:[82,10],patrols:[[18,36,82,36],[18,58,82,58],[24,80,76,80]],safeZones:[[28,50,9],[70,68,9]],order:"treasure-first",speed:.95}),
    campaignMission("Double Ward","雙重守望","Seal order and clockwork surges overlap.","封印順序與發條加速同時生效。",{object:[22,24],treasure:[78,72],exit:[18,10],patrols:[[18,42,82,42],[24,62,76,62],[28,80,72,80]],order:"treasure-first",clockCycle:5.8,speed:.92}),
    campaignMission("Vault Sealkeeper","寶庫封印官","Break both seals in order while the Sealkeeper guards the center.","依序解除兩道封印，同時避開中央封印官。",{object:[78,26],treasure:[20,72],exit:[50,10],patrols:[[18,40,82,40],[24,78,76,78]],safeZones:[[50,62,9]],order:"treasure-first",guardian:guardianCatalog.seals,speed:.9}),
    campaignMission("Dark Meridian","暗影子午線","A widening searchlight crosses a chain of shadow shelters.","擴張探照光會掃過連續陰影掩護。",{object:[76,24],treasure:[20,72],exit:[50,10],patrols:[[18,44,82,44],[24,78,76,78]],safeZones:[[28,58,9],[70,58,9]],spotlight:true,speed:.96}),
    campaignMission("Silent Chimes","寂靜月鐘","Bell pulses, shadow timing, and a risky treasure route combine.","月鐘脈衝、陰影時機與高風險寶藏路線同時出現。",{object:[22,24],treasure:[80,28],exit:[82,10],patrols:[[18,38,82,70],[82,38,18,70],[20,80,80,80]],safeZones:[[50,58,10]],bellPulse:5,speed:.94}),
    campaignMission("Shifting Orrery","位移天球儀","Marker swaps happen inside a changing clockwork rhythm.","標記會在變動的發條節奏中交換。",{object:[78,24],treasure:[20,70],exit:[18,10],patrols:[[18,40,82,40],[18,62,82,62],[28,80,72,80]],mirrorInterval:5.5,clockCycle:5.8,speed:.92}),
    campaignMission("Triple Lock","三重封鎖","Treasure first, then the relic; extraction relocates after pickup.","先取寶藏再取任務物；取得後撤離門會移位。",{object:[20,24],treasure:[80,72],exit:[50,10],phaseExit:[82,12],patrols:[[18,36,82,36],[18,56,82,56],[22,78,78,78]],safeZones:[[50,66,9]],order:"treasure-first",clockCycle:5.5,speed:.95}),
    campaignMission("Eclipse Curator","日蝕館長","Master seals, shadows, shifting markers, pulses, and a moving exit.","綜合封印、陰影、標記換位、警報脈衝與移動出口。",{object:[78,24],treasure:[20,72],exit:[50,10],phaseExit:[82,12],patrols:[[18,38,82,38],[18,58,82,58],[24,80,76,80]],safeZones:[[28,50,9],[70,66,9]],order:"treasure-first",mirrorInterval:5.5,clockCycle:5.5,bellPulse:5,guardian:guardianCatalog.eclipse,speed:.94})
  ];
  const campaignEs = [
    ["Umbral silencioso","Observa una patrulla, recupera el sello y evacúa."],
    ["Sala de faroles","Cruza por detrás de dos líneas de patrulla."],
    ["Galería dividida","Elige el lado tranquilo antes de que se crucen las rutas."],
    ["Escaleras del mensajero","El tesoro adicional está más allá de la ruta directa de escape."],
    ["Auditoría de faroles","El Auditor ensancha su foco; muévete cuando el resplandor se reduzca."],
    ["Alcoba de terciopelo","Los círculos de sombra ocultan a Fia de las patrullas."],
    ["Estantes gemelos","Pasa de un círculo de sombra al siguiente."],
    ["Claraboya rota","Un estrecho corredor de sombra separa las patrullas que se cruzan."],
    ["Anexo de susurros","Recoge el tesoro opcional antes de abandonar la última sombra."],
    ["Guardián de la campana","El pulso de la campana aumenta la alerta fuera de los círculos de sombra."],
    ["Bifurcación plateada","La reliquia y el tesoro intercambian posiciones tras un destello de aviso."],
    ["Registro reflejado","Espera al cambio de marcadores o comprométete con la ruta larga."],
    ["Falso norte","Recoge primero el tesoro para que la reliquia reflejada se vuelva real."],
    ["Sala prismática","Usa la sombra mientras los dos marcadores se preparan para cambiar."],
    ["Guardián del espejo","El Guardián cambia ambos marcadores con rapidez; fíjate en el destello."],
    ["Paseo de engranaje lento","Las patrullas alternan entre vigilancia lenta y barrido rápido."],
    ["Péndulo veloz","Cruza durante la fase azul lenta, no durante el impulso ámbar."],
    ["Minuto dividido","Combina la cobertura de las sombras con el ritmo mecánico."],
    ["Cámara del segundero","Recoge primero el tesoro mientras cambia la velocidad de las patrullas."],
    ["Mariscal mecánico","El Mariscal anuncia cada persecución a máxima velocidad."],
    ["Primer sello","El tesoro es el primer sello; la reliquia se desbloquea después."],
    ["Llaves cruzadas","Abre los dos sellos entre tres rutas que se cruzan."],
    ["Pozo lunar cerrado","Lleva el primer sello a través de dos refugios de sombra."],
    ["Doble resguardo","El orden de los sellos se combina con los impulsos mecánicos."],
    ["Guardasellos de la cámara","Rompe ambos sellos en orden mientras el Guardasellos protege el centro."],
    ["Meridiano oscuro","Un foco cada vez más ancho cruza una cadena de refugios de sombra."],
    ["Campanas silenciosas","Combina pulsos de campana, tiempos de sombra y una ruta de tesoro arriesgada."],
    ["Planetario cambiante","Los marcadores cambian dentro de un ritmo mecánico variable."],
    ["Triple cerradura","Primero el tesoro y después la reliquia; la salida cambia al recogerla."],
    ["Conservador del eclipse","Domina sellos, sombras, cambios de marcador, pulsos y una salida móvil."]
  ];
  campaign.forEach((mission, index) => { mission.name[2] = campaignEs[index][0]; mission.rule[2] = campaignEs[index][1]; });
  [
    [guardianCatalog.spotlight,"Auditor de faroles"], [guardianCatalog.bell,"Guardián de la campana"],
    [guardianCatalog.mirror,"Guardián del espejo"], [guardianCatalog.clock,"Mariscal mecánico"],
    [guardianCatalog.seals,"Guardasellos de la cámara"], [guardianCatalog.eclipse,"Conservador del eclipse"]
  ].forEach(([guardian, name]) => { guardian.name[2] = name; });
  let state=load(),locale=window.WonderI18n?.locale?.()||localStorage.getItem(localeKey)||localStorage.getItem(legacyLocaleKey)||"en",selectedMission=0,gadget="dash",gadgetOffers=createOffers(),insuranceActive=state.insuranceReady===true,preservedTreasure=false,playing=false,paused=false,alert=0,objectFound=false,treasureFound=false,caught=false,patrols=[],lastTime=0,missionStartedAt=0,freezeUntil=0,smokeUntil=0,preview=null,arrivalTimer=0,routePointerId=null,lastPulseCycle=-1,lastMirrorCycle=-1,guardianPhase=1;
  const localeArrayIndex = () => locale === "zh-Hant" ? 1 : locale === "es" ? 2 : 0;
  const nodes={main:$("#mainScreen"),stage:$("#stageScreen"),battle:$("#battleScreen"),rail:$("#missionRail"),field:$("#playField"),fia:$("#fiaActor"),objective:$("#objectiveActor"),treasure:$("#treasureActor"),exit:$("#exitActor"),patrolLayer:$("#patrolLayer"),route:$("#routeLine"),feedback:$("#feedbackText"),fx:$("#feedbackFx"),alert:$("#alertFill"),modal:$("#resultModal")};
  function load(){
    try{
      const loaded={unlocked:1,coins:0,safehouse:1,cleared:{},insuranceReady:false,...JSON.parse(localStorage.getItem(KEY)||"{}")};
      loaded.unlocked=Math.max(1,Math.min(campaign.length,Math.floor(Number(loaded.unlocked)||1)));
      loaded.cleared=loaded.cleared&&typeof loaded.cleared==="object"?loaded.cleared:{};
      loaded.safehouse=Math.max(1,Math.floor(Number(loaded.safehouse)||1));
      loaded.insuranceReady=loaded.insuranceReady===true;
      return loaded;
    }catch{return{unlocked:1,coins:0,safehouse:1,cleared:{},insuranceReady:false}}
  }
  function save(){localStorage.setItem(KEY,JSON.stringify(state))}
  function wallet(){return window.WeightPlayWallet?.read?.()||{diamonds:0}}
  function spendDiamonds(cost){return Boolean(window.WeightPlayWallet?.spendDiamonds?.(cost))}
  function createOffers(){return Object.keys(gadgets).map(id=>({id,level:1+Math.floor(Math.random()*3)}))}
  function selectedOffer(){return gadgetOffers.find(offer=>offer.id===gadget)||gadgetOffers[0]}
  let economyFeedbackTimer=0,pendingEconomy="",pendingEconomyTimer=0,pendingEconomyDeadline=0,pendingEconomyRemaining=0;
  function gadgetEffect(id,level){
    if(id==="dash")return t("dashEffect",{ms:Math.max(180,320-level*45)});
    if(id==="decoy")return t("decoyEffect",{seconds:(2.5+level*.65).toFixed(2).replace(/0$/,"")});
    return t("smokeEffect",{seconds:(.8+level*.5).toFixed(1)});
  }
  function gadgetSummary(id=gadget,level=selectedOffer().level){return `${t(id)} Lv.${level} · ${gadgetEffect(id,level)}`}
  function clearPendingEconomy({render=true}={}){clearTimeout(pendingEconomyTimer);pendingEconomyTimer=0;pendingEconomyDeadline=0;pendingEconomyRemaining=0;pendingEconomy="";if(render)renderEconomy()}
  function schedulePendingEconomyExpiry(delay){
    clearTimeout(pendingEconomyTimer);pendingEconomyRemaining=Math.max(0,delay);pendingEconomyDeadline=performance.now()+pendingEconomyRemaining;
    pendingEconomyTimer=setTimeout(()=>{pendingEconomyTimer=0;pendingEconomyDeadline=0;pendingEconomyRemaining=0;pendingEconomy="";renderEconomy();renderGadgetSummary()},pendingEconomyRemaining);
  }
  function suspendPendingEconomy(){if(!pendingEconomy||!pendingEconomyTimer)return;pendingEconomyRemaining=Math.max(0,pendingEconomyDeadline-performance.now());clearTimeout(pendingEconomyTimer);pendingEconomyTimer=0;pendingEconomyDeadline=0}
  function resumePendingEconomy(){if(pendingEconomy&&!pendingEconomyTimer)schedulePendingEconomyExpiry(pendingEconomyRemaining)}
  function renderGadgetSummary(){clearTimeout(economyFeedbackTimer);$("#economyFeedback").textContent=gadgetSummary()}
  function economyMessage(message=""){clearTimeout(economyFeedbackTimer);$("#economyFeedback").textContent=message||gadgetSummary();if(message)economyFeedbackTimer=setTimeout(renderGadgetSummary,1600)}
  function renderEconomy(){
    const balance=wallet().diamonds,reroll=$("#rerollBtn"),insurance=$("#insuranceBtn");
    $("#diamondLabel").textContent=`${t("diamonds")}: ${balance}`;
    reroll.textContent=pendingEconomy==="reroll"?t("confirmSpend",{cost:3,before:balance,after:Math.max(0,balance-3)}):t("reroll");
    insurance.textContent=pendingEconomy==="insurance"?t("confirmSpend",{cost:5,before:balance,after:Math.max(0,balance-5)}):t(insuranceActive?"insured":"insure");
    reroll.setAttribute("aria-label",pendingEconomy==="reroll"?t("confirmLabel",{action:t("rerollAction"),cost:3,before:balance,after:Math.max(0,balance-3)}):t("rerollLabel",{balance}));
    insurance.setAttribute("aria-label",insuranceActive?t("insuredLabel"):pendingEconomy==="insurance"?t("confirmLabel",{action:t("insuranceAction"),cost:5,before:balance,after:Math.max(0,balance-5)}):t("insuranceLabel",{balance}));
    reroll.classList.toggle("is-confirming",pendingEconomy==="reroll");
    insurance.classList.toggle("is-confirming",pendingEconomy==="insurance");
    insurance.classList.toggle("active",insuranceActive);
  }
  function armEconomy(action,cost,messageKey){
    const balance=wallet().diamonds;
    if(balance<cost){clearPendingEconomy();economyMessage(`${t("notEnough")} ${t("diamonds")}: ${balance}/${cost}.`);return false}
    clearTimeout(economyFeedbackTimer);clearTimeout(pendingEconomyTimer);pendingEconomy=action;renderEconomy();
    $("#economyFeedback").textContent=t(messageKey,{before:balance,after:balance-cost});
    schedulePendingEconomyExpiry(5000);
    return true;
  }
  function rerollOffers(){
    if(pendingEconomy!=="reroll"){armEconomy("reroll",3,"rerollDecision");return}
    clearPendingEconomy({render:false});
    if(!spendDiamonds(3)){renderEconomy();economyMessage(t("notEnough"));return}
    gadgetOffers=createOffers();gadget=gadgetOffers[0].id;economyMessage(t("rerolled"));renderGadgets();renderEconomy();updateGadget();
  }
  function buyInsurance(){
    if(insuranceActive){clearPendingEconomy();economyMessage(t("alreadyInsured"));return}
    if(pendingEconomy!=="insurance"){armEconomy("insurance",5,"insuranceDecision");return}
    clearPendingEconomy({render:false});
    if(!spendDiamonds(5)){renderEconomy();economyMessage(t("notEnough"));return}
    insuranceActive=true;state.insuranceReady=true;save();economyMessage(t("insuranceReady"));renderEconomy();
  }
  function t(key,vars={}){let value=copy[locale]?.[key]||copy.en[key]||key;Object.entries(vars).forEach(([k,v])=>value=value.replace(`{${k}}`,v));return value}
  function localize(){if(window.WonderI18n?.locale?.()!==locale)window.WonderI18n?.setLocale?.(locale);document.documentElement.lang=locale;const internal=document.querySelector('meta[name="robots"]')?.content.includes("noindex");document.title=`${t("title")} - ${internal?"Internal Trial":"WeightPlay"}`;document.querySelectorAll("[data-i18n]").forEach(n=>n.textContent=t(n.dataset.i18n));$("#localeSelect").setAttribute("aria-label",t("languageLabel"));$(".main-poster").alt=t("posterAlt");$(".planner > img").alt=t("orlaAlt");nodes.rail.setAttribute("aria-label",t("missionRailLabel"));nodes.fia.alt=t("fiaAlt");$("#stageBackBtn").setAttribute("aria-label",t("stageBackLabel"));$("#battleBackBtn").setAttribute("aria-label",t("battleBackLabel"));renderSummary();renderStage();renderGadgets();renderEconomy();updateGadget();renderGadgetSummary();updatePauseControl()}
  function show(name){document.body.dataset.screen=name;nodes.main.hidden=name!=="main";nodes.stage.hidden=name!=="stage";nodes.battle.hidden=name!=="battle";if(name!=="battle"){playing=false;paused=false;cancelPendingMovement();updatePauseControl()}}
  function renderSummary(){$("#safehouseSummary").textContent=`${t("safehouse",{n:state.safehouse})} · ${t("coins")}: ${state.coins} · ${Object.keys(state.cleared).length}/${campaign.length}`}
  function medalProgress(index){
    const medals=Math.max(0,Math.min(3,Number(state.cleared[index])||0));
    if(!medals)return{visible:`☆☆☆ · ${t("notCleared")}`,accessible:t("notCleared")};
    const stars="★".repeat(medals)+"☆".repeat(3-medals);
    const detail=medals===3?t("perfectMedals"):`${t("bestMedals",{medals})} · ${t("bonusMedal")}`;
    return{visible:`${stars} · ${detail}`,accessible:detail};
  }
  function renderStage(){
    if(!nodes.rail)return;
    $("#coinLabel").textContent=`${t("coins")}: ${state.coins}`;
    nodes.rail.innerHTML="";
    campaign.forEach((m,i)=>{
      const b=document.createElement("button");
      const missionName=`${t("mission",{n:i+1})}: ${m.name[localeArrayIndex()]}`;
      const locked=i+1>state.unlocked;
      const progress=medalProgress(i);
      b.type="button";
      b.className=`mission-card${locked?" locked":""}`;
      const guardian=m.guardian;
      const art=guardian?`../../assets/animal-moonlight-heist-guardian-${guardian.id}.webp`:"../../assets/animal-moonlight-heist-archive-background.png";
      const checkpoint=guardian?`<span class="checkpoint-tag">${t("checkpoint")} · ${guardian.name[localeArrayIndex()]}</span>`:"";
      b.classList.toggle("checkpoint",Boolean(guardian));
      b.innerHTML=`<img src="${art}" alt=""><div><strong>${missionName}</strong>${checkpoint}<span class="mission-rule">${m.rule[localeArrayIndex()]}</span><span>${locked?t("locked"):progress.visible}</span></div>`;
      b.setAttribute("aria-label",`${missionName}. ${m.rule[localeArrayIndex()]}. ${locked?t("locked"):progress.accessible}`);
      b.addEventListener("click",()=>{if(!locked)startMission(i)});
      nodes.rail.append(b);
    });
  }
  function focusMission(index=Math.max(0,Math.min(campaign.length-1,state.unlocked-1))){
    requestAnimationFrame(()=>nodes.rail.querySelectorAll(".mission-card")[index]?.focus({preventScroll:true}));
  }
  function focusMain(){requestAnimationFrame(()=>$("#startBtn")?.focus({preventScroll:true}))}
  function renderGadgets(focusId=null){const wrap=$("#gadgetChoices");wrap.innerHTML="";gadgetOffers.forEach(({id,level})=>{const g=gadgets[id],b=document.createElement("button");b.className=`gadget-choice${id===gadget?" selected":""}`;b.dataset.gadgetId=id;b.innerHTML=`<img src="../../assets/animal-moonlight-heist-gadget-${g.art}.webp" alt=""><span class="gadget-level">Lv.${level}</span>`;b.type="button";b.title=`${t(id)} Lv.${level}`;b.setAttribute("aria-label",gadgetSummary(id,level));b.setAttribute("aria-pressed",id===gadget?"true":"false");b.addEventListener("click",()=>{gadget=id;renderGadgets(id);updateGadget();renderGadgetSummary()});wrap.append(b)});if(focusId)wrap.querySelector(`[data-gadget-id="${focusId}"]`)?.focus({preventScroll:true})}
  function updateGadget(){if(!$("#gadgetIcon"))return;const passive=gadget==="dash",name=t(gadget),effect=gadgetEffect(gadget,selectedOffer().level),button=$("#gadgetBtn");$("#gadgetIcon").src=`../../assets/animal-moonlight-heist-gadget-${gadgets[gadget].art}.webp`;$("#gadgetLabel").textContent=passive?`${name} · ${t("passive")}`:name;button.disabled=passive;button.setAttribute("aria-label",t(passive?"passiveGadgetLabel":"activeGadgetLabel",{name,effect}));button.title=button.getAttribute("aria-label");nodes.field.setAttribute("aria-label",t(passive?"playFieldPassiveLabel":"playFieldActiveLabel",{name,effect}))}
  function startMission(index){
    selectedMission=Math.max(0,Math.min(campaign.length-1,index));
    objectFound=false;treasureFound=preservedTreasure;preservedTreasure=false;caught=false;alert=0;paused=false;freezeUntil=0;smokeUntil=0;lastPulseCycle=-1;lastMirrorCycle=-1;guardianPhase=1;
    const m=campaign[selectedMission];
    $("#missionLabel").textContent=`${t("mission",{n:selectedMission+1})}: ${m.name[localeArrayIndex()]}`;
    $("#objectiveLabel").textContent=m.rule[localeArrayIndex()];
    nodes.objective.src=`../../assets/animal-moonlight-heist-object-${missionObjects[selectedMission%missionObjects.length]}.webp`;
    place(nodes.objective,m.object);place(nodes.treasure,m.treasure);place(nodes.exit,m.exit);
    nodes.objective.hidden=false;nodes.treasure.hidden=treasureFound;nodes.exit.style.opacity=.5;place(nodes.fia,[50,88]);nodes.patrolLayer.innerHTML="";
    (m.safeZones||[]).forEach(([x,y,size])=>{const zone=document.createElement("span");zone.className="safe-zone";zone.style.left=`${x}%`;zone.style.top=`${y}%`;zone.style.setProperty("--zone-size",`${size*2}%`);zone.setAttribute("aria-hidden","true");nodes.patrolLayer.append(zone)});
    patrols=m.patrols.map((path,i)=>createPatrol(path,`../../assets/animal-moonlight-heist-patrol-${patrolArt[i%3]}.webp`,i*.23));
    if(m.guardian){const guardian=createPatrol(m.guardian.path,`../../assets/animal-moonlight-heist-guardian-${m.guardian.id}.webp`,.12,m.guardian);guardian.img.alt=m.guardian.name[localeArrayIndex()];patrols.push(guardian)}
    nodes.feedback.textContent=t("holdRoute");nodes.alert.style.width="0";$("#coinBattle").textContent=`${t("coins")}: ${state.coins}`;show("battle");playing=true;missionStartedAt=lastTime=performance.now();requestAnimationFrame(loop);
    requestAnimationFrame(()=>nodes.field.focus({preventScroll:true}));
  }
  function createPatrol(path,src,progress=0,guardian=null){
    const sight=document.createElement("span");sight.className=`patrol-sight${guardian?" guardian-sight":""}`;sight.setAttribute("aria-hidden","true");
    const img=document.createElement("img");img.className=`patrol${guardian?" guardian-patrol":""}`;img.src=src;img.alt="";nodes.patrolLayer.append(sight,img);
    const patrol={img,sight,path,progress,direction:1,guardian};updatePatrol(patrol);return patrol;
  }
  function place(el,pos){el.style.left=`${pos[0]}%`;el.style.top=`${pos[1]}%`}
  function point(el){return[parseFloat(el.style.left)||0,parseFloat(el.style.top)||0]}
  function updatePauseControl(){const button=$("#pauseBtn");if(!button)return;button.textContent=paused?"\u25b6":"\u275a\u275a";button.setAttribute("aria-pressed",paused?"true":"false");button.setAttribute("aria-label",t(paused?"resumeAction":"pauseAction"));button.title=t(paused?"resumeAction":"pauseAction");nodes.field.tabIndex=0;updateGadget()}
  function freezeFia(){if(!nodes.field||nodes.field.hidden)return;const field=nodes.field.getBoundingClientRect(),fia=nodes.fia.getBoundingClientRect();if(!field.width||!field.height)return;const position=[(fia.left+fia.width/2-field.left)/field.width*100,(fia.top+fia.height/2-field.top)/field.height*100];nodes.fia.style.transitionDuration="0ms";place(nodes.fia,position)}
  function freezePatrols(){const field=nodes.field.getBoundingClientRect();if(!field.width||!field.height)return;patrols.forEach(p=>{const box=p.img.getBoundingClientRect(),position=[(box.left+box.width/2-field.left)/field.width*100,(box.top+box.height/2-field.top)/field.height*100];p.img.style.transitionDuration="0ms";place(p.img,position);place(p.sight,position)})}
  function cancelRoutePreview(){nodes.route.hidden=true;preview=null;if(routePointerId!==null&&nodes.field.hasPointerCapture?.(routePointerId))nodes.field.releasePointerCapture(routePointerId);routePointerId=null}
  function cancelPendingMovement(){if(arrivalTimer)clearTimeout(arrivalTimer);arrivalTimer=0;cancelRoutePreview()}
  function setPaused(next){if(!playing)return;paused=Boolean(next);if(paused){freezeFia();freezePatrols();cancelPendingMovement();nodes.feedback.textContent=t("paused")}else{patrols.forEach(p=>p.img.style.transitionDuration="");nodes.feedback.textContent=t("holdRoute");lastTime=performance.now()}updatePauseControl();if(!paused)nodes.field.focus({preventScroll:true})}
  function scheduleArrival(delay){if(arrivalTimer)clearTimeout(arrivalTimer);arrivalTimer=setTimeout(()=>{arrivalTimer=0;if(playing&&!paused)resolveArrival()},delay)}
  function distance(a,b){return Math.hypot(a[0]-b[0],a[1]-b[1])}
  function updatePatrol(p){const [x1,y1,x2,y2]=p.path;const q=p.direction>0?p.progress:1-p.progress;const position=[x1+(x2-x1)*q,y1+(y2-y1)*q];place(p.img,position);place(p.sight,position)}
  function activeMission(){return campaign[selectedMission]}
  function inSafeZone(position=point(nodes.fia)){return(activeMission().safeZones||[]).some(([x,y,size])=>distance(position,[x,y])<=size)}
  function guardianPatrol(){return patrols.find(p=>p.guardian)}
  function setGuardianWarning(warning){const guardian=guardianPatrol();guardian?.img.classList.toggle("is-warning",warning);guardian?.sight.classList.toggle("is-warning",warning)}
  function swapMissionMarkers(){
    if(objectFound||treasureFound)return;
    const objectPosition=point(nodes.objective),treasurePosition=point(nodes.treasure);
    place(nodes.objective,treasurePosition);place(nodes.treasure,objectPosition);
    [nodes.objective,nodes.treasure].forEach(node=>{node.classList.add("marker-shift");setTimeout(()=>node.classList.remove("marker-shift"),520)});
  }
  function updateMissionRules(now){
    const m=activeMission(),elapsed=(now-missionStartedAt)/1000;
    let speedFactor=1,warning=false;
    if(m.clockCycle){const phase=elapsed%m.clockCycle,surge=phase>=m.clockCycle*.62;speedFactor=surge?1.9:.52;warning=surge||phase>=m.clockCycle*.5;nodes.field.classList.toggle("clock-surge",surge);if(!preview)nodes.feedback.textContent=t(surge?"clockSurge":"clockSlow")}
    else nodes.field.classList.remove("clock-surge");
    if(m.mirrorInterval){const cycle=Math.floor(elapsed/m.mirrorInterval),phase=elapsed%m.mirrorInterval;warning=warning||phase>=m.mirrorInterval-1;if(cycle>0&&cycle!==lastMirrorCycle){lastMirrorCycle=cycle;swapMissionMarkers()}if(phase>=m.mirrorInterval-1&&!preview)nodes.feedback.textContent=t("mirrorWarning")}
    const bellInterval=m.bellPulse||(m.guardian?.behavior==="bell"||m.guardian?.behavior==="eclipse"?5:0);
    if(bellInterval){const cycle=Math.floor(elapsed/bellInterval),phase=elapsed%bellInterval;warning=warning||phase>=bellInterval-1;if(cycle>0&&cycle!==lastPulseCycle){lastPulseCycle=cycle;if(!inSafeZone()){alert=Math.min(100,alert+20);showFx("warning")}}if(phase>=bellInterval-1&&!preview)nodes.feedback.textContent=t("bellWarning")}
    setGuardianWarning(warning);return speedFactor;
  }
  function patrolSightRadius(p,now){
    const m=activeMission(),elapsed=(now-missionStartedAt)/1000;
    if(p.guardian?.behavior==="spotlight"||p.guardian?.behavior==="eclipse"||m.spotlight)return 17+10*((Math.sin(elapsed*1.7)+1)/2);
    return p.guardian?20:18;
  }
  function loop(now){
    if(!playing)return;
    const dt=Math.min(.05,(now-lastTime)/1000);lastTime=now;
    if(!paused&&now>freezeUntil){
      const m=activeMission(),speedFactor=updateMissionRules(now);
      patrols.forEach(p=>{p.progress+=dt*(.115+(m.speed||1)*.028)*speedFactor;if(p.progress>=1){p.progress=0;p.direction*=-1}updatePatrol(p);const radius=patrolSightRadius(p,now);p.sight.style.setProperty("--sight-size",`${radius*2}%`)});
      const seen=!inSafeZone()&&patrols.some(p=>distance(point(nodes.fia),point(p.img))<patrolSightRadius(p,now));
      alert=Math.max(0,Math.min(100,alert+(seen?48:-(m.alertDecay||34))*dt));nodes.alert.style.width=`${alert}%`;if(alert>=100)fail();
    }
    requestAnimationFrame(loop);
  }
  function routeTo(clientX,clientY,commit=false){const r=nodes.field.getBoundingClientRect();const x=Math.max(6,Math.min(94,(clientX-r.left)/r.width*100));const y=Math.max(8,Math.min(92,(clientY-r.top)/r.height*100));const start=point(nodes.fia);const dx=(x-start[0])/100*r.width,dy=(y-start[1])/100*r.height;const len=Math.hypot(dx,dy);nodes.route.hidden=false;nodes.route.style.left=`${start[0]}%`;nodes.route.style.top=`${start[1]}%`;nodes.route.style.width=`${len}px`;nodes.route.style.transform=`rotate(${Math.atan2(dy,dx)}rad)`;const exposed=patrols.some(p=>distance([x,y],point(p.img))<22);nodes.route.classList.toggle("route-exposed",exposed);nodes.feedback.textContent=t(commit?"holdRoute":"move");preview=[x,y];if(commit){const level=selectedOffer().level,dashTime=gadget==="dash"?Math.max(180,320-level*45):650;nodes.route.hidden=true;nodes.fia.style.transitionDuration=`${dashTime}ms`;place(nodes.fia,preview);scheduleArrival(dashTime+20)}}
  function resolveArrival(){
    const p=point(nodes.fia),m=activeMission();
    if(!treasureFound&&distance(p,point(nodes.treasure))<12){treasureFound=true;nodes.treasure.hidden=true;showFx("pickup");nodes.feedback.textContent=t("treasureFound")}
    if(!objectFound&&distance(p,point(nodes.objective))<12){
      if(m.order==="treasure-first"&&!treasureFound){nodes.feedback.textContent=t("firstSeal");showFx("warning");return}
      objectFound=true;nodes.objective.hidden=true;nodes.exit.style.opacity=1;if(m.phaseExit)place(nodes.exit,m.phaseExit);
      if(m.guardian?.behavior==="eclipse"){guardianPhase=2;patrols.forEach(p=>p.direction*=-1);alert=Math.max(alert,28)}
      $("#objectiveLabel").textContent=t("extraction");showFx("pickup");nodes.feedback.textContent=t("found");
    }
    if(objectFound&&distance(p,point(nodes.exit))<13)win();
  }
  function showFx(type){nodes.fx.src=`../../assets/animal-moonlight-heist-fx-${type}.webp`;place(nodes.fx,point(nodes.fia));nodes.fx.hidden=false;nodes.fx.classList.remove("fx-show");void nodes.fx.offsetWidth;nodes.fx.classList.add("fx-show");setTimeout(()=>nodes.fx.hidden=true,650)}
  function useGadget(){if(!playing||paused||gadget==="dash")return;const level=selectedOffer().level;if(gadget==="decoy"){freezeUntil=performance.now()+(2500+level*650);showFx("pickup")}else{alert=0;smokeUntil=performance.now()+(800+level*500);showFx("shadow")}}
  function fail(){if(caught||performance.now()<smokeUntil)return;caught=true;playing=false;if(insuranceActive&&treasureFound)preservedTreasure=true;insuranceActive=false;state.insuranceReady=false;save();showFx("warning");nodes.fia.classList.add("caught");openResult(false)}
  function win(){playing=false;insuranceActive=false;state.insuranceReady=false;const m=activeMission(),medals=1+(!caught?1:0)+(treasureFound?1:0);const reward=20+selectedMission*4+(treasureFound?12:0)+(m.guardian?30:0);state.coins+=reward;state.cleared[selectedMission]=Math.max(state.cleared[selectedMission]||0,medals);state.unlocked=Math.max(state.unlocked,Math.min(campaign.length,selectedMission+2));state.safehouse=1+Math.floor(Object.keys(state.cleared).length/5);save();openResult(true,medals,reward)}
  function openResult(ok,medals=0,reward=0){
    $("#resultTitle").textContent=t(ok?"victory":"captured");
    $("#resultText").textContent=ok
      ? `+${reward} ${t("coins")} · ${t("resultMedals",{medals})}${medals<3?` · ${t("bonusMedal")}`:` · ${t("treasure")}`}`
      : t("capturedText");
    $("#medalRow").textContent=ok?"★".repeat(medals)+"☆".repeat(3-medals):"";
    $("#medalRow").setAttribute("aria-label",ok?t("medalCount",{medals}):"");
    $("#nextBtn").hidden=!ok||selectedMission>=campaign.length-1;
    [...nodes.modal.parentElement.children].filter(node=>node!==nodes.modal).forEach(node=>{node.inert=true;node.setAttribute("aria-hidden","true")});
    nodes.modal.hidden=false;
    (ok&&!$("#nextBtn").hidden?$("#nextBtn"):$("#retryBtn")).focus({preventScroll:true});
  }
  function closeResult(){nodes.modal.hidden=true;[...nodes.modal.parentElement.children].filter(node=>node!==nodes.modal).forEach(node=>{node.inert=false;node.removeAttribute("aria-hidden")});nodes.fia.classList.remove("caught")}
  function trapResultFocus(event){
    if(event.repeat&&(event.key==="Enter"||event.key===" ")){event.preventDefault();return}
    if(event.key!=="Tab"||nodes.modal.hidden)return;
    const actions=[...nodes.modal.querySelectorAll("button:not(:disabled)")].filter(node=>node.getClientRects().length);
    if(!actions.length){event.preventDefault();nodes.modal.focus();return}
    const first=actions[0],last=actions.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  }
  $(".home-link").setAttribute("data-wp-return","main");$("#stageBackBtn").setAttribute("data-wp-return","stage");$("#battleBackBtn").setAttribute("data-wp-return","battle");
  function bind(){
    $("#localeSelect").value=locale;
    $("#localeSelect").addEventListener("change",e=>{const requested=e.target.value;window.WonderI18n?.setLocale?.(requested);locale=window.WonderI18n?.locale?.()||requested;localStorage.setItem(localeKey,requested);localize()});
    $("#startBtn").addEventListener("click",()=>{show("stage");renderStage();focusMission()});
    $("#stageBackBtn").addEventListener("click",()=>{show("main");focusMain()});
    $("#battleBackBtn").addEventListener("click",()=>{show("stage");renderStage();focusMission(selectedMission)});
    $("#pauseBtn").addEventListener("keydown",event=>{if(event.repeat&&(event.key==="Enter"||event.key===" "))event.preventDefault()});
    $("#pauseBtn").addEventListener("click",()=>setPaused(!paused));
    document.addEventListener("visibilitychange",()=>{if(document.hidden){suspendPendingEconomy();if(playing&&!paused)setPaused(true)}else resumePendingEconomy()});
    nodes.field.addEventListener("pointerdown",e=>{if(!playing||paused||e.isPrimary===false||(e.button!==undefined&&e.button!==0)||(routePointerId!==null&&routePointerId!==e.pointerId))return;routePointerId=e.pointerId;nodes.field.setPointerCapture(e.pointerId);routeTo(e.clientX,e.clientY)});
    nodes.field.addEventListener("pointermove",e=>{if(!paused&&e.pointerId===routePointerId&&nodes.field.hasPointerCapture(e.pointerId))routeTo(e.clientX,e.clientY)});
    nodes.field.addEventListener("pointerup",e=>{if(e.pointerId!==routePointerId||(e.pointerType==="mouse"&&e.button!==0))return;if(!paused&&preview)routeTo(e.clientX,e.clientY,true);cancelRoutePreview()});
    nodes.field.addEventListener("pointercancel",e=>{if(e.pointerId===routePointerId)cancelRoutePreview()});
    nodes.field.addEventListener("lostpointercapture",e=>{if(e.pointerId===routePointerId)cancelRoutePreview()});
    nodes.modal.addEventListener("keydown",trapResultFocus);$("#gadgetBtn").addEventListener("click",useGadget);
    $("#retryBtn").addEventListener("click",()=>{closeResult();startMission(selectedMission)});
    $("#stagesBtn").addEventListener("click",()=>{closeResult();show("stage");renderStage();focusMission(selectedMission)});
    $("#nextBtn").addEventListener("click",()=>{closeResult();startMission(Math.min(campaign.length-1,selectedMission+1))});
  }
  function bindMissionRailDrag(){
    const rail=nodes.rail;
    rail.addEventListener("keydown",event=>{if(event.repeat&&(event.key==="Enter"||event.key===" "))event.preventDefault()});
  }
  window.addEventListener("keydown",event=>{
    if(!playing||paused||event.target.matches("button,select,input,textarea"))return;
    const direction={arrowleft:[-1,0],a:[-1,0],arrowright:[1,0],d:[1,0],arrowup:[0,-1],w:[0,-1],arrowdown:[0,1],s:[0,1]}[event.key.toLowerCase()];
    if(event.key===" "){event.preventDefault();if(event.repeat)return;useGadget();return}
    if(!direction)return;
    event.preventDefault();
    const current=point(nodes.fia),next=[Math.max(6,Math.min(94,current[0]+direction[0]*6)),Math.max(8,Math.min(92,current[1]+direction[1]*6))];
    nodes.route.hidden=true;nodes.fia.style.transitionDuration="120ms";place(nodes.fia,next);scheduleArrival(140);
  });
  [$("#rerollBtn"),$("#insuranceBtn")].forEach(button=>button.addEventListener("keydown",event=>{if(event.repeat&&(event.key==="Enter"||event.key===" "))event.preventDefault()}));
  $("#startBtn").addEventListener("keydown",event=>{if(event.repeat&&(event.key==="Enter"||event.key===" "))event.preventDefault()});
  $("#rerollBtn").addEventListener("click",rerollOffers);
  $("#insuranceBtn").addEventListener("click",buyInsurance);
  // Keep the public Traditional Chinese runtime dictionary ASCII-safe so it cannot be damaged by a legacy editor encoding.
  const decodeZh=value=>value.replace(/\\u([0-9a-f]{4})/gi,(_,code)=>String.fromCharCode(parseInt(code,16)));
  Object.assign(copy["zh-Hant"],{
    title:decodeZh("\\u52d5\\u7269\\u6708\\u5f71\\u6f5b\\u884c\\u968a"),internal:decodeZh("\\u6708\\u5149\\u6a94\\u6848\\u4efb\\u52d9"),pitch:decodeZh("\\u89c0\\u5bdf\\u5de1\\u908f\\uff0c\\u56de\\u6536\\u907a\\u7269\\uff0c\\u9078\\u64c7\\u4f55\\u6642\\u64a4\\u96e2\\u3002"),start:decodeZh("\\u9078\\u64c7\\u4efb\\u52d9"),missions:decodeZh("\\u6708\\u5149\\u6a94\\u6848\\u5eab"),chooseGadget:decodeZh("\\u9078\\u64c7\\u88dd\\u7f6e"),alert:decodeZh("\\u8b66\\u5831"),holdRoute:decodeZh("\\u6309\\u4f4f\\u4f86\\u9810\\u89bd\\u8def\\u7dda\\u3002"),objective:decodeZh("\\u56de\\u6536\\u4efb\\u52d9\\u7269\\u54c1"),locked:decodeZh("\\u5b8c\\u6210\\u524d\\u4e00\\u4efb\\u52d9\\u5f8c\\u89e3\\u9396"),retry:decodeZh("\\u91cd\\u8a66"),next:decodeZh("\\u4e0b\\u4e00\\u4efb\\u52d9"),victory:decodeZh("\\u4efb\\u52d9\\u5b8c\\u6210"),captured:decodeZh("\\u88ab\\u767c\\u73fe\\u4e86"),capturedText:decodeZh("\\u5de1\\u908f\\u54e1\\u89f8\\u767c\\u8b66\\u5831\\u3002\\u53ef\\u4ee5\\u514d\\u8cbb\\u91cd\\u8a66\\u3002"),treasure:decodeZh("\\u56de\\u6536\\u984d\\u5916\\u5bf6\\u85cf"),extraction:decodeZh("\\u524d\\u5f80\\u64a4\\u96e2\\u51fa\\u53e3"),dash:decodeZh("\\u9583\\u96fb\\u885d\\u523a"),decoy:decodeZh("\\u661f\\u5149\\u8a98\\u990c"),smoke:decodeZh("\\u7159\\u9727\\u8449"),coins:decodeZh("\\u6708\\u5149\\u5e63"),safehouse:decodeZh("\\u5b89\\u5168\\u5c4b Lv.{n}"),mission:decodeZh("\\u4efb\\u52d9 {n}"),move:decodeZh("\\u653e\\u958b\\u4f86\\u79fb\\u52d5"),found:decodeZh("\\u4efb\\u52d9\\u7269\\u54c1\\u5df2\\u53d6\\u5f97\\uff01"),exitReady:decodeZh("\\u53ef\\u4ee5\\u64a4\\u96e2"),treasureFound:decodeZh("\\u5df2\\u53d6\\u5f97\\u5bf6\\u85cf"),paused:decodeZh("\\u5df2\\u66ab\\u505c"),diamonds:decodeZh("\\u947d\\u77f3"),reroll:decodeZh("\\u91cd\\u65b0\\u64b2\\u653e 3"),insure:decodeZh("\\u6295\\u4fdd 5"),insured:decodeZh("\\u5df2\\u6295\\u4fdd"),alreadyInsured:decodeZh("\\u64a4\\u96e2\\u4fdd\\u96aa\\u5df2\\u555f\\u7528\\u3002"),confirmReroll:decodeZh("\\u78ba\\u5b9a\\u82b1\\u8cbb 3 \\u9846\\u947d\\u77f3\\u91cd\\u65b0\\u64b2\\u653e\\u88dd\\u7f6e\\u5f37\\u5ea6\\u55ce\\uff1f"),confirmInsurance:decodeZh("\\u78ba\\u5b9a\\u82b1\\u8cbb 5 \\u9846\\u947d\\u77f3\\uff0c\\u5728\\u88ab\\u767c\\u73fe\\u6642\\u4fdd\\u7559\\u984d\\u5916\\u5bf6\\u85cf\\u55ce\\uff1f"),notEnough:decodeZh("\\u947d\\u77f3\\u4e0d\\u8db3\\u3002"),rerolled:decodeZh("\\u88dd\\u7f6e\\u5f37\\u5ea6\\u5df2\\u91cd\\u65b0\\u64b2\\u653e\\u3002"),insuranceReady:decodeZh("\\u64a4\\u96e2\\u4fdd\\u96aa\\u5df2\\u555f\\u7528\\u3002")
  });
  ["\\u6a94\\u6848\\u5eab\\u5165\\u53e3","\\u71c8\\u706b\\u5927\\u5ef3","\\u56de\\u97ff\\u756b\\u5eca","\\u767c\\u689d\\u5bf6\\u5eab","\\u6708\\u4eae\\u4e4b\\u9580"].forEach((name,index)=>{missions[index].name[1]=decodeZh(name)});
  Object.assign(copy["zh-Hant"],{
    dashEffect:decodeZh("\\u5feb\\u901f\\u79fb\\u52d5\\uff1a{ms} \\u6beb\\u79d2"),
    decoyEffect:decodeZh("\\u66ab\\u505c\\u5de1\\u908f\\uff1a{seconds} \\u79d2"),
    smokeEffect:decodeZh("\\u8b66\\u5831\\u6b78\\u96f6 + {seconds} \\u79d2\\u63a9\\u8b77")
  });
  Object.assign(copy["zh-Hant"],{
    confirmSpend:decodeZh("\\u78ba\\u8a8d {cost} \\u00b7 {before}\\u2192{after}"),
    rerollDecision:decodeZh("\\u91cd\\u62bd\\u5168\\u90e8\\u4e09\\u500b\\u88dd\\u7f6e\\u5f37\\u5ea6\\u3002\\u518d\\u9ede\\u4e00\\u6b21\\u78ba\\u8a8d\\uff1a{before} \\u2192 {after} \\u9846\\u947d\\u77f3\\u3002"),
    insuranceDecision:decodeZh("\\u4e0b\\u4e00\\u500b\\u4efb\\u52d9\\u88ab\\u767c\\u73fe\\u4e00\\u6b21\\u5f8c\\uff0c\\u4fdd\\u7559\\u984d\\u5916\\u5bf6\\u85cf\\u3002\\u518d\\u9ede\\u4e00\\u6b21\\u78ba\\u8a8d\\uff1a{before} \\u2192 {after} \\u9846\\u947d\\u77f3\\u3002"),
    rerollLabel:decodeZh("\\u91cd\\u62bd\\u5168\\u90e8\\u4e09\\u500b\\u88dd\\u7f6e\\u5f37\\u5ea6\\u3002\\u82b1\\u8cbb 3 \\u9846\\u947d\\u77f3\\u3002\\u76ee\\u524d\\u9918\\u984d {balance}\\u3002"),
    insuranceLabel:decodeZh("\\u70ba\\u4e0b\\u4e00\\u500b\\u4efb\\u52d9\\u7684\\u4e00\\u6b21\\u88ab\\u767c\\u73fe\\u6295\\u4fdd\\u984d\\u5916\\u5bf6\\u85cf\\u3002\\u82b1\\u8cbb 5 \\u9846\\u947d\\u77f3\\u3002\\u76ee\\u524d\\u9918\\u984d {balance}\\u3002"),
    confirmLabel:decodeZh("\\u78ba\\u8a8d{action}\\u3002\\u82b1\\u8cbb {cost} \\u9846\\u947d\\u77f3\\u3002\\u9918\\u984d {before} \\u8b8a\\u70ba {after}\\u3002"),
    rerollAction:decodeZh("\\u88dd\\u7f6e\\u5f37\\u5ea6\\u91cd\\u62bd"),
    insuranceAction:decodeZh("\\u5bf6\\u85cf\\u4fdd\\u96aa"),
    insuredLabel:decodeZh("\\u4e0b\\u4e00\\u500b\\u4efb\\u52d9\\u7684\\u5bf6\\u85cf\\u4fdd\\u96aa\\u5df2\\u555f\\u7528\\u3002")
  });
  const checkpointStages=campaign.map((mission,index)=>mission.guardian?index+1:null).filter(Boolean);
  if(campaign.length!==30||new Set(campaign.map(mission=>mission.name[0])).size!==30||checkpointStages.join(",")!=="5,10,15,20,25,30")throw new Error("Moonlight Heist campaign depth contract failed.");
  if(location.hostname==="localhost"||location.hostname==="127.0.0.1"||new URLSearchParams(location.search).has("wp_test")){
    window.__ANIMAL_MOONLIGHT_HEIST_TEST__={
      campaign:()=>campaign.map((mission,index)=>({stage:index+1,name:[...mission.name],rule:[...mission.rule],patrols:mission.patrols.length,safeZones:mission.safeZones?.length||0,order:mission.order||"any",mirror:Boolean(mission.mirrorInterval),clock:Boolean(mission.clockCycle),bell:Boolean(mission.bellPulse||mission.guardian?.behavior==="bell"||mission.guardian?.behavior==="eclipse"),spotlight:Boolean(mission.spotlight||mission.guardian?.behavior==="spotlight"||mission.guardian?.behavior==="eclipse"),guardian:mission.guardian?{id:mission.guardian.id,name:[...mission.guardian.name],behavior:mission.guardian.behavior}:null})),
      unlockAll:()=>{state.unlocked=campaign.length;save();renderStage();return state.unlocked},
      openMission:index=>{startMission(Math.max(0,Math.min(campaign.length-1,Number(index)||0)));return selectedMission+1},
      placeFia:position=>{place(nodes.fia,position);resolveArrival();return{objectFound,treasureFound,exit:point(nodes.exit)}},
      tickRules:seconds=>{missionStartedAt=performance.now()-Number(seconds)*1000;const factor=updateMissionRules(performance.now());return{factor,alert,object:point(nodes.objective),treasure:point(nodes.treasure),warning:Boolean(guardianPatrol()?.img.classList.contains("is-warning"))}},
      snapshot:()=>({stage:selectedMission+1,unlocked:state.unlocked,screen:document.body.dataset.screen,objectFound,treasureFound,guardianPhase,patrols:patrols.length,guardian:guardianPatrol()?.guardian?.id||null,safeZones:document.querySelectorAll(".safe-zone").length,resultOpen:!nodes.modal.hidden,freezeRemaining:Math.max(0,freezeUntil-performance.now())})
    };
  }
  $("#battleBackBtn")?.setAttribute("data-wp-return","battle");
  renderGadgets();bind();bindMissionRailDrag();localize();$("#localeSelect option[value='zh-Hant']").textContent=decodeZh("\\u7e41\\u9ad4\\u4e2d\\u6587");show("main");
})();
