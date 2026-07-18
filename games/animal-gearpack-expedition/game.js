(() => {
  "use strict";

  const ASSET = "../../assets/animal-gearpack-expedition-items/";
  const SAVE_KEY = "weightplayGearpackProgressV1";
  const RUN_KEY = "weightplayGearpackRunV1";
  const copy = {
    en: { title:"Animal Gearpack Expedition",internal:"Internal Trial",pitch:"Pack equipment, build adjacency combos, and guide Rux through the Gearwood route.",start:"Start Expedition",chooseRegion:"Choose Region",packmaster:"Packmaster Rux",region1:"Gearwood Trail",region1Meta:"5 rooms · Root Guardian",region2:"Moonlit Quarry",region3:"Clockwork Hollow",locked:"Locked",backpack:"Gearpack 11 x 7",rotate:"Rotate",sell:"Sell",fight:"Start Encounter",strike:"Resolve Clash",room:"Room",armor:"Armor",objective:"Arrange gear, then defeat the route guardian.",workshop:"Workshop",discoveries:"Discoveries",gold:"Gold",diamonds:"Diamonds",items:"items",selected:"Selected",placed:"Placed",blocked:"That shape does not fit there.",rotated:"Item rotated.",needGear:"Place at least one item before fighting.",victory:"Route Cleared",defeat:"Caravan Broken",continue:"Continue",retry:"Retry Route",regions:"Back to Regions",chooseLoot:"Choose one item",merchant:"Orla's Caravan Shop",buy:"Buy",leave:"Leave Shop",refresh:"Refresh for 3 Diamonds",confirmRefresh:"Spend 3 Diamonds to refresh Orla's stock?",notEnough:"Not enough currency.",boss:"Root Guardian",scout:"Shadow Fox Scout",boar:"Armored Boar",crow:"Crystal Crow",reward:"Reward",saved:"Workshop progress saved.",full:"Your pack has no room for that item.",pickedUp:"Returned to tray",sold:"Sold" },
    "zh-Hant": { title:"動物裝備行囊遠征",internal:"內部試玩",pitch:"配置裝備、建立相鄰連結，帶領魯克斯穿越齒輪森林路線。",start:"開始遠征",chooseRegion:"選擇區域",packmaster:"行囊大師魯克斯",region1:"齒輪森林小徑",region1Meta:"5 個房間 · 樹根守衛",region2:"月光礦場",region3:"發條樹洞",locked:"尚未解鎖",backpack:"裝備行囊 11 x 7",rotate:"旋轉",sell:"出售",fight:"開始遭遇",strike:"進行交鋒",room:"房間",armor:"護甲",objective:"配置裝備，擊敗路線守衛。",workshop:"工坊",discoveries:"圖鑑",gold:"金幣",diamonds:"鑽石",items:"件",selected:"已選擇",placed:"已放置",blocked:"這個形狀無法放在這裡。",rotated:"裝備已旋轉。",needGear:"至少放入一件裝備才能戰鬥。",victory:"路線完成",defeat:"行囊隊伍敗退",continue:"繼續",retry:"重試路線",regions:"返回區域",chooseLoot:"選擇一件裝備",merchant:"奧菈的商隊商店",buy:"購買",leave:"離開商店",refresh:"花費 3 鑽石刷新",confirmRefresh:"確定花費 3 鑽石刷新奧菈的商品嗎？",notEnough:"貨幣不足。",boss:"樹根守衛",scout:"暗影狐斥候",boar:"重甲野豬",crow:"水晶烏鴉",reward:"獎勵",saved:"工坊進度已保存。",full:"行囊沒有足夠空間。",pickedUp:"已取回待放區",sold:"已出售" }
  };
  copy.en.adventure = "Gearwood Adventure";
  Object.assign(copy.en,{refreshConfirm:"Confirm 3 · {before}→{after}",refreshDecision:"Replace all three shop items once. Tap again to confirm: {before} → {after} Diamonds.",refreshLabel:"Replace all three shop items. Costs 3 Diamonds. Current balance {balance}.",refreshConfirmLabel:"Confirm one shop refresh. Spend 3 Diamonds. Balance {before} to {after}.",refreshNeed:"Need 3 Diamonds. Current balance {balance}/3.",refreshUsed:"Refresh used at this shop stop."});
  Object.assign(copy["zh-Hant"],{refreshConfirm:"確認 3 · {before}→{after}",refreshDecision:"一次更換全部三件商品。再點一次確認：{before} → {after} 顆鑽石。",refreshLabel:"一次更換全部三件商品。花費 3 顆鑽石。目前餘額 {balance}。",refreshConfirmLabel:"確認刷新一次商店。花費 3 顆鑽石。餘額 {before} 變為 {after}。",refreshNeed:"需要 3 顆鑽石。目前餘額 {balance}/3。",refreshUsed:"本次商店停靠已使用刷新。"});
  Object.assign(copy.en,{leaveLoot:"Continue without loot",fullLoot:"Your pack is full. Continue without taking an item."});
  Object.assign(copy["zh-Hant"],{leaveLoot:"不拿裝備並繼續",fullLoot:"行囊已滿。請選擇不拿裝備並繼續。"});
  Object.assign(copy.en,{battleSteps:"1 Select gear  2 Tap a green cell  3 Start encounter",attack:"Attack",defense:"Defense",healing:"Heal",links:"Links",attackHint:"Tap Attack to resolve the clash.",health:"Health",region2Meta:"5 rooms · Crystal Warden",region3Meta:"5 rooms · Hollow Colossus"});
  Object.assign(copy["zh-Hant"],{battleSteps:"① 選下方裝備　② 點綠色格子放入　③ 開始遭遇",attack:"攻擊",defense:"防禦",healing:"恢復",links:"連結",attackHint:"按「攻擊」進行這一回合。",health:"生命",region2Meta:"5 個房間 · 水晶守衛",region3Meta:"5 個房間 · 樹洞巨像"});
  copy["zh-Hant"].adventure = "齒輪森林冒險";
  Object.assign(copy.en,{tagForge:"Forge",tagNature:"Nature",tagCrystal:"Crystal",tagMoon:"Moon",sameTagBonus:"Same tag +2 ATK / +1 DEF",sellValue:"Sell"});
  Object.assign(copy["zh-Hant"],{tagForge:"鍛造",tagNature:"自然",tagCrystal:"水晶",tagMoon:"月光",sameTagBonus:"同標籤 +2 攻擊 / +1 防禦",sellValue:"售價"});
  Object.assign(copy.en,{autoFighting:"Auto battling...",combatPaused:"Battle paused. Resume when ready.",resumeCombat:"Resume Encounter",repack:"Enemy defeated. Repack for the next encounter."});
  Object.assign(copy["zh-Hant"],{autoFighting:"自動戰鬥中…",combatPaused:"戰鬥已暫停。準備好後繼續。",resumeCombat:"繼續戰鬥",repack:"敵人已擊敗，重新搭配裝備迎戰下一隻。"});
  Object.assign(copy.en,{newRegionUnlocked:"New region unlocked"});
  Object.assign(copy["zh-Hant"],{newRegionUnlocked:"新區域已解鎖"});
  Object.assign(copy.en,{packGridLabel:"Backpack grid, 7 rows by 11 columns",cellLabel:"Row {row}, column {column}. {action}",placeItem:"Place {item} here.",pickUpItem:"Pick up {item}.",cannotPlace:"{item} does not fit here.",emptyCell:"Empty slot. Select gear from the tray.",selectItem:"Select {item}.",selectedItem:"Selected {item}."});
  Object.assign(copy["zh-Hant"],{packGridLabel:"背包格，7 排、11 欄",cellLabel:"第 {row} 排、第 {column} 欄。{action}",placeItem:"在這裡放置{item}。",pickUpItem:"拿起{item}。",cannotPlace:"{item}無法放在這裡。",emptyCell:"空格。請先從物品列選擇裝備。",selectItem:"選擇{item}。",selectedItem:"已選擇{item}。"});
  Object.assign(copy.en,{backToLobby:"Back to WeightPlay",language:"Language",coverAlt:"Animal Gearpack Expedition poster",backToMain:"Back to main",ruxAlt:"Gear Horn Rux",regionRail:"Regions",gearwoodTrailAlt:"Gearwood Trail",backToRegions:"Back to regions",objectiveHelp:"Show objective",itemTrayLabel:"Available gear"});
  Object.assign(copy["zh-Hant"],{backToLobby:"返回 WeightPlay",language:"語言",coverAlt:"動物裝備行囊遠征封面",backToMain:"返回主畫面",ruxAlt:"齒輪角魯克斯",regionRail:"區域滑軌",gearwoodTrailAlt:"齒輪森林小徑",backToRegions:"返回區域選擇",objectiveHelp:"顯示目標",itemTrayLabel:"待放裝備"});
  Object.assign(copy.en,{pauseCombatAction:"Pause encounter"});
  Object.assign(copy["zh-Hant"],{pauseCombatAction:"暫停戰鬥"});
  Object.assign(copy.en,{rotateItemLabel:"Rotate {item} to {width} × {height}",sellItemLabel:"Sell {item} for {value} Gold"});
  Object.assign(copy["zh-Hant"],{rotateItemLabel:"將{item}旋轉為 {width} × {height}",sellItemLabel:"出售{item}，獲得 {value} 金幣"});
  Object.assign(copy.en,{fightBlockedLabel:"Start Encounter unavailable. Place at least one item before fighting.",fightReadyLabel:"Start automatic encounter against {enemy}, enemy health {hp}. Your Attack {attack}, Defense {defense}. {mechanic}. Battle continues automatically until one side is defeated."});
  Object.assign(copy["zh-Hant"],{fightBlockedLabel:"目前無法開始遭遇戰。請先放置至少一件裝備。",fightReadyLabel:"開始與{enemy}的自動遭遇戰，敵方生命 {hp}。你的攻擊 {attack}、防禦 {defense}。{mechanic}。戰鬥會自動持續到其中一方倒下。"});
  Object.assign(copy.en,{chooseExpedition:"Choose Expedition",stage:"Stage",encounter:"Encounter",checkpoint:"Guardian",completed:"Cleared",unlocked:"unlocked",stageRule:"Route rule",nextExpedition:"Next Expedition",allStagesCleared:"All 30 expeditions cleared",stageCleared:"Expedition cleared",retryStage:"Retry Expedition",backToStages:"Back to Stages",openingStrike:"Opening strike",shielded:"Shield",reflected:"Reflected shard",regrowth:"Guardian regrew",seal:"Sealed",isolated:"isolated items",corrosion:"corrosion",heat:"top-row heat",overload:"overload",bossPhase:"Boss phase"});
  Object.assign(copy["zh-Hant"],{chooseExpedition:"選擇遠征",stage:"關卡",encounter:"遭遇",checkpoint:"守關首領",completed:"已通關",unlocked:"已解鎖",stageRule:"路線規則",nextExpedition:"下一關",allStagesCleared:"30 關遠征全部完成",stageCleared:"遠征完成",retryStage:"重試本關",backToStages:"返回關卡",openingStrike:"開場突襲",shielded:"護盾",reflected:"反射碎片",regrowth:"守衛再生",seal:"封印",isolated:"件孤立裝備",corrosion:"腐蝕",heat:"頂排熱浪",overload:"過載",bossPhase:"首領階段"});

  copy.es = {
    title:"Expedición de la Mochila Animal",internal:"Prueba interna",pitch:"Coloca equipo, crea enlaces adyacentes y guía a Rux por la ruta del Bosque Engranaje.",start:"Empezar expedición",chooseRegion:"Elegir región",packmaster:"Rux, maestro de la mochila",
    region1:"Sendero del Bosque Engranaje",region1Meta:"5 encuentros · Guardián Raíz",region2:"Cantera Lunar",region2Meta:"5 encuentros · Guardián de Cristal",region3:"Hueco Mecánico",region3Meta:"5 encuentros · Coloso del Hueco",locked:"Bloqueado",
    backpack:"Mochila de equipo 11 x 7",rotate:"Girar",sell:"Vender",fight:"Empezar encuentro",strike:"Resolver choque",room:"Encuentro",armor:"Armadura",objective:"Coloca equipo y derrota al guardián de la ruta.",workshop:"Taller",discoveries:"Descubrimientos",gold:"Monedas",diamonds:"Diamantes",items:"objetos",
    selected:"Seleccionado",placed:"Colocado",blocked:"Esa forma no cabe ahí.",rotated:"Objeto girado.",needGear:"Coloca al menos un objeto antes de luchar.",victory:"Ruta completada",defeat:"Caravana derrotada",continue:"Continuar",retry:"Reintentar ruta",regions:"Volver a regiones",chooseLoot:"Elige un objeto",merchant:"Tienda de la caravana de Orla",buy:"Comprar",leave:"Salir de la tienda",
    refresh:"Renovar por 3 diamantes",confirmRefresh:"¿Gastar 3 diamantes para renovar la tienda de Orla?",notEnough:"No tienes suficiente moneda.",boss:"Guardián Raíz",scout:"Explorador zorro de sombra",boar:"Jabalí acorazado",crow:"Cuervo de cristal",reward:"Recompensa",saved:"Progreso del taller guardado.",full:"No hay espacio en la mochila.",pickedUp:"Devuelto a la bandeja",sold:"Vendido",adventure:"Aventura del Bosque Engranaje",
    refreshConfirm:"Confirmar 3 · {before}→{after}",refreshDecision:"Sustituye los tres objetos una vez. Toca de nuevo para confirmar: {before} → {after} diamantes.",refreshLabel:"Sustituye los tres objetos. Cuesta 3 diamantes. Saldo actual: {balance}.",refreshConfirmLabel:"Confirmar una renovación. Gasta 3 diamantes. Saldo de {before} a {after}.",refreshNeed:"Necesitas 3 diamantes. Saldo actual: {balance}/3.",refreshUsed:"Ya renovaste en esta parada.",
    leaveLoot:"Continuar sin botín",fullLoot:"La mochila está llena. Continúa sin tomar un objeto.",battleSteps:"1 Elige equipo  2 Toca una celda verde  3 Empieza el encuentro",attack:"Ataque",defense:"Defensa",healing:"Curación",links:"Enlaces",attackHint:"Toca Ataque para resolver el choque.",health:"Vida",
    tagForge:"Forja",tagNature:"Naturaleza",tagCrystal:"Cristal",tagMoon:"Luna",sameTagBonus:"Misma etiqueta +2 ATQ / +1 DEF",sellValue:"Venta",autoFighting:"Combate automático...",combatPaused:"Combate en pausa. Continúa cuando quieras.",resumeCombat:"Continuar encuentro",repack:"Enemigo derrotado. Reorganiza el equipo para el siguiente.",newRegionUnlocked:"Nueva región desbloqueada",
    packGridLabel:"Cuadrícula de mochila, 7 filas por 11 columnas",cellLabel:"Fila {row}, columna {column}. {action}",placeItem:"Coloca {item} aquí.",pickUpItem:"Recoge {item}.",cannotPlace:"{item} no cabe aquí.",emptyCell:"Espacio vacío. Elige equipo de la bandeja.",selectItem:"Elegir {item}.",selectedItem:"{item} seleccionado.",
    backToLobby:"Volver a WeightPlay",language:"Idioma",coverAlt:"Póster de Expedición de la Mochila Animal",backToMain:"Volver al inicio",ruxAlt:"Rux Cuerno Engranaje",regionRail:"Regiones",gearwoodTrailAlt:"Sendero del Bosque Engranaje",backToRegions:"Volver a las regiones",objectiveHelp:"Mostrar objetivo",pauseCombatAction:"Pausar encuentro",itemTrayLabel:"Equipo disponible",
    rotateItemLabel:"Girar {item} a {width} × {height}",sellItemLabel:"Vender {item} por {value} monedas",fightBlockedLabel:"Encuentro no disponible. Coloca al menos un objeto.",fightReadyLabel:"Empieza el encuentro automático contra {enemy}, vida enemiga {hp}. Tu ataque {attack}, defensa {defense}. {mechanic}. El combate continúa hasta que un lado caiga.",
    chooseExpedition:"Elegir expedición",stage:"Nivel",encounter:"Encuentro",checkpoint:"Guardián",completed:"Completado",unlocked:"desbloqueado",stageRule:"Regla de ruta",nextExpedition:"Siguiente expedición",allStagesCleared:"Las 30 expediciones están completadas",stageCleared:"Expedición completada",retryStage:"Reintentar expedición",backToStages:"Volver a niveles",
    openingStrike:"Ataque inicial",shielded:"Escudo",reflected:"Fragmento reflejado",regrowth:"El guardián se regeneró",seal:"Sellado",isolated:"objetos aislados",corrosion:"corrosión",heat:"calor en la fila superior",overload:"sobrecarga",bossPhase:"Fase del jefe",
  };

  const PACK_COLS = 11;
  const PACK_ROWS = 7;
  const STAGE_COUNT = 30;
  const ROOMS_PER_STAGE = 5;

  const items = [
    {id:"forge-hammer",name:{en:"Forge Hammer","zh-Hant":"鍛造錘"},shape:[[0,0],[0,1]],atk:3,armor:0,heal:0,tag:"forge",gold:5},
    {id:"leaf-buckler",name:{en:"Leaf Buckler","zh-Hant":"葉紋圓盾"},shape:[[0,0],[1,0]],atk:0,armor:4,heal:0,tag:"nature",gold:5},
    {id:"crystal-lens",name:{en:"Crystal Lens","zh-Hant":"水晶鑑定鏡"},shape:[[0,0]],atk:2,armor:0,heal:0,tag:"crystal",gold:4},
    {id:"berry-potion",name:{en:"Berry Potion","zh-Hant":"莓果藥水"},shape:[[0,0]],atk:0,armor:0,heal:3,tag:"nature",gold:4},
    {id:"gear-boots",name:{en:"Gear Boots","zh-Hant":"齒輪戰靴"},shape:[[0,0],[1,0]],atk:2,armor:2,heal:0,tag:"forge",gold:6},
    {id:"moon-charm",name:{en:"Moon Charm","zh-Hant":"月牙護符"},shape:[[0,0]],atk:1,armor:1,heal:2,tag:"moon",gold:6},
    {id:"thorn-whip",name:{en:"Thorn Whip","zh-Hant":"荊棘長鞭"},shape:[[0,0],[0,1],[0,2]],atk:4,armor:0,heal:0,tag:"nature",gold:7},
    {id:"moss-armor",name:{en:"Moss Armor","zh-Hant":"苔甲"},shape:[[0,0],[1,0],[0,1],[1,1]],atk:0,armor:7,heal:0,tag:"nature",gold:8},
    {id:"spark-coil",name:{en:"Spark Coil","zh-Hant":"火花線圈"},shape:[[0,0],[0,1]],atk:5,armor:0,heal:0,tag:"crystal",gold:8},
    {id:"repair-kit",name:{en:"Repair Kit","zh-Hant":"野外修理包"},shape:[[0,0],[1,0]],atk:0,armor:2,heal:4,tag:"forge",gold:7},
    {id:"scout-lantern",name:{en:"Scout Lantern","zh-Hant":"斥候提燈"},shape:[[0,0]],atk:2,armor:1,heal:0,tag:"moon",gold:5},
    {id:"caravan-badge",name:{en:"Caravan Badge","zh-Hant":"商隊徽章"},shape:[[0,0]],atk:1,armor:2,heal:1,tag:"moon",gold:5}
  ];
  const spanishItemNames = [
    "Martillo de forja", "Broquel de hojas", "Lente de cristal", "Poción de bayas",
    "Botas de engranajes", "Amuleto lunar", "Látigo de espinas", "Armadura de musgo",
    "Bobina de chispas", "Kit de reparación", "Farol de explorador", "Insignia de caravana"
  ];
  items.forEach((item,index)=>{item.name.es=spanishItemNames[index];});
  const regions = [
    {name:["Gearwood Trail","齒輪森林小徑"],background:"../../assets/animal-gearpack-expedition-forest-bg.webp",boss:"Root Guardian"},
    {name:["Moonlit Quarry","月光礦場"],background:"../../assets/animal-gearpack-expedition-bg-moonlit-quarry.webp",boss:"Crystal Warden"},
    {name:["Clockwork Hollow","發條樹洞"],background:"../../assets/animal-gearpack-expedition-bg-clockwork-hollow.webp",boss:"Hollow Colossus"},
    {name:["Ember Foundry","餘燼鑄造廠"],background:"../../assets/animal-gearpack-expedition-bg-ember-foundry.webp",boss:"Furnace Leviathan"},
    {name:["Storm Observatory","風暴觀測台"],background:"../../assets/animal-gearpack-expedition-bg-storm-observatory.webp",boss:"Tempest Archon"},
    {name:["Eclipse Vault","日蝕寶庫"],background:"../../assets/animal-gearpack-expedition-bg-eclipse-vault.webp",boss:"Eclipse Hoardmaster"}
  ];
  const spanishRegions = [
    ["Sendero del Bosque Engranaje","Guardián Raíz"],
    ["Cantera Lunar","Guardián de Cristal"],
    ["Hueco Mecánico","Coloso del Hueco"],
    ["Fundición de Brasas","Leviatán del Horno"],
    ["Observatorio de Tormentas","Arconte de la Tempestad"],
    ["Bóveda del Eclipse","Maestro del Tesoro del Eclipse"]
  ];
  regions.forEach((region,index)=>{region.name.push(spanishRegions[index][0]);region.bossEs=spanishRegions[index][1];});
  const stage = (en,zh,ruleEn,ruleZh,enemies,merchantAfter=3) => ({name:[en,zh],rule:[ruleEn,ruleZh],enemies,merchantAfter});
  const stages = [
    stage("Workshop Gate","工坊入口","Learn the five-room rhythm and build one material link.","熟悉五場遭遇，先建立一組材質連結。",["scout","scout","boar","crow","scout"]),
    stage("Scout Fork","斥候岔路","Fox Scouts strike before unprepared packs.","狐狸斥候會搶先攻擊未準備的行囊。",["scout","ambusher","boar","crow","ambusher"],2),
    stage("Ironroot Crossing","鐵根交叉口","Plated Boars absorb the first hit with armor.","裝甲野豬會用護板吸收第一次攻擊。",["boar","platedBoar","scout","platedBoar","boar"]),
    stage("Crystal Canopy","水晶樹冠","Crystal Crows punish every isolated item.","水晶烏鴉會懲罰沒有相鄰連結的裝備。",["crow","linkCrow","boar","ambusher","linkCrow"]),
    stage("Root Guardian","樹根守衛","Nature links stop the Guardian from regrowing armor.","自然材質連結可阻止守衛重新長出護甲。",["ambusher","platedBoar","crow","linkCrow","rootGuardian"]),
    stage("Silver Descent","銀月下坡","Moon Moths suppress Moon links during their encounter.","月蛾在場時會壓制月光材質連結。",["scout","moonMoth","crow","boar","moonMoth"]),
    stage("Echo Vein","回音礦脈","Prism Crows tax isolated gear; compact the pack.","稜鏡烏鴉會針對孤立裝備，請壓緊配置。",["moonMoth","linkCrow","platedBoar","crow","linkCrow"],2),
    stage("Prism Lift","稜鏡升降台","Barriers reward one strong opening strike.","稜鏡屏障考驗高傷害的第一擊。",["platedBoar","prismRam","moonMoth","linkCrow","prismRam"]),
    stage("Shattered Gallery","碎晶長廊","Suppression and barriers require a mixed-material plan.","材質壓制與屏障同時出現，需要混合配置。",["moonMoth","prismRam","ambusher","linkCrow","moonMoth"]),
    stage("Crystal Warden","水晶守衛","Break the prism shield, then survive its reflected shard.","先打破稜鏡盾，再承受反射晶片。",["linkCrow","prismRam","moonMoth","platedBoar","crystalWarden"]),
    stage("Winding Path","上鍊小徑","Gear Jackals gain power every counterattack.","發條胡狼每次反擊都會加強。",["scout","gearJackal","boar","crow","gearJackal"]),
    stage("Magnet Hall","磁力大廳","Magnet Beetles punish each item without a link.","磁力甲蟲會針對每件沒有連結的裝備。",["gearJackal","magnetBeetle","crow","magnetBeetle","platedBoar"]),
    stage("Pendulum Works","鐘擺工坊","Fast rage and isolation pressure favor compact offense.","快速狂怒與孤立壓力要求緊湊的攻擊配置。",["gearJackal","magnetBeetle","prismRam","gearJackal","magnetBeetle"],2),
    stage("Rusted Relay","鏽蝕繼電站","Corrosion removes defense after every enemy turn.","鏽蝕會在每次敵方回合後降低防禦。",["magnetBeetle","rustCrow","gearJackal","rustCrow","platedBoar"]),
    stage("Hollow Colossus","發條巨像","The Colossus alternates brace and rage phases.","巨像會在防守姿態與狂怒姿態間切換。",["gearJackal","magnetBeetle","rustCrow","prismRam","hollowColossus"]),
    stage("Cinder Conveyor","餘燼輸送帶","Steam Toad corrosion makes long battles dangerous.","蒸汽蟾蜍的鏽蝕讓持久戰變得危險。",["boar","steamToad","crow","gearJackal","steamToad"]),
    stage("Boiler Walk","鍋爐通道","Top-row heat converts occupied cells into incoming damage.","頂排熱浪會把已占用格轉成額外傷害。",["steamToad","furnaceBoar","platedBoar","rustCrow","furnaceBoar"]),
    stage("Smelter Bend","熔爐彎道","Leave breathing room above while keeping useful links.","保留頂排散熱空間，同時維持有效連結。",["furnaceBoar","steamToad","magnetBeetle","furnaceBoar","steamToad"],2),
    stage("Steamlock Vault","蒸汽鎖庫","Heat, corrosion, and armor demand healing plus burst damage.","熱浪、鏽蝕與護甲同時考驗治療與爆發。",["platedBoar","steamToad","furnaceBoar","prismRam","rustCrow"]),
    stage("Furnace Leviathan","熔爐巨獸","Keep the top row open to vent its furnace pulse.","保持頂排空間，才能降低熔爐脈衝傷害。",["furnaceBoar","steamToad","rustCrow","platedBoar","furnaceLeviathan"]),
    stage("Gale Bridge","疾風橋","Gale Scouts land a fast opening hit before healing.","疾風斥候會在治療前先發動快速攻擊。",["ambusher","galeScout","crow","gearJackal","galeScout"]),
    stage("Coil Chamber","線圈室","Coil Lynxes overload the largest material link.","線圈山貓會使最大的材質連結過載。",["galeScout","coilLynx","prismRam","coilLynx","magnetBeetle"]),
    stage("Thunder Lens","雷霆透鏡","Spread links across two materials to resist overload.","把連結分散到兩種材質以抵抗過載。",["coilLynx","linkCrow","galeScout","moonMoth","coilLynx"],2),
    stage("Skyrail Array","天軌陣列","Opening strikes and overload test balanced defense.","先制攻擊與過載共同考驗均衡防守。",["galeScout","coilLynx","furnaceBoar","galeScout","rustCrow"]),
    stage("Tempest Archon","風暴統領","Chain lightning scales with isolated equipment.","連鎖閃電會依孤立裝備數量增強。",["galeScout","coilLynx","linkCrow","magnetBeetle","tempestArchon"]),
    stage("Shadow Ledger","暗影帳冊","Eclipse Mimics copy the stronger of Attack or Defense.","日蝕擬態獸會複製攻擊或防禦中較高的一項。",["eclipseMimic","moonMoth","gearJackal","eclipseMimic","linkCrow"]),
    stage("Broken Constellation","破碎星圖","Tag seals rotate between Forge, Nature, Crystal, and Moon.","材質封印會在鍛造、自然、水晶與月光間輪替。",["tagSealer","eclipseMimic","coilLynx","tagSealer","prismRam"]),
    stage("Crown Seal","王冠封印","A rotating seal and top-row heat reshape the safe layout.","輪替封印與頂排熱浪會改變安全配置。",["tagSealer","furnaceBoar","eclipseMimic","rustCrow","tagSealer"],2),
    stage("Packbreaker Hall","破囊者大廳","Every known pressure appears before the final vault.","最終寶庫前會重新組合所有已知壓力。",["galeScout","magnetBeetle","tagSealer","eclipseMimic","coilLynx"]),
    stage("Eclipse Hoardmaster","日蝕藏主","The Hoardmaster rotates seals, locks links, and punishes isolation.","藏主會輪替封印、鎖住連結並懲罰孤立裝備。",["tagSealer","eclipseMimic","furnaceBoar","coilLynx","eclipseHoardmaster"])
  ];
  const spanishStages = [
    ["Puerta del taller","Aprende el ritmo de cinco encuentros y crea un enlace de material."],
    ["Bifurcación de exploradores","Los zorros exploradores atacan primero a las mochilas sin preparar."],
    ["Cruce de raíz de hierro","Los jabalíes blindados absorben el primer golpe con armadura."],
    ["Dosel de cristal","Los cuervos de cristal castigan cada objeto aislado."],
    ["Guardián Raíz","Los enlaces de Naturaleza impiden que el Guardián regenere armadura."],
    ["Descenso plateado","Las polillas lunares suprimen los enlaces de Luna durante el encuentro."],
    ["Veta de eco","Los cuervos prisma penalizan el equipo aislado; compacta la mochila."],
    ["Elevador de prisma","Las barreras premian un fuerte ataque inicial."],
    ["Galería quebrada","La supresión y las barreras exigen un plan de materiales mixtos."],
    ["Guardián de Cristal","Rompe el escudo prisma y resiste su fragmento reflejado."],
    ["Sendero sinuoso","Los chacales mecánicos ganan fuerza con cada contraataque."],
    ["Sala magnética","Los escarabajos magnéticos castigan cada objeto sin enlace."],
    ["Taller del péndulo","La rabia rápida y el aislamiento favorecen un ataque compacto."],
    ["Relevo oxidado","La corrosión reduce la defensa tras cada turno enemigo."],
    ["Coloso del Hueco","El Coloso alterna entre fases de defensa y rabia."],
    ["Transportador de cenizas","La corrosión del sapo de vapor vuelve peligrosos los combates largos."],
    ["Pasarela de calderas","El calor de la fila superior convierte celdas ocupadas en daño recibido."],
    ["Curva de la fundición","Deja espacio arriba sin perder enlaces útiles."],
    ["Bóveda de vapor","Calor, corrosión y armadura exigen curación y daño explosivo."],
    ["Leviatán del Horno","Mantén libre la fila superior para ventilar su pulso de horno."],
    ["Puente del vendaval","Los exploradores del vendaval golpean antes de la curación."],
    ["Cámara de bobinas","Los linces de bobina sobrecargan el enlace de material más grande."],
    ["Lente del trueno","Reparte los enlaces entre dos materiales para resistir la sobrecarga."],
    ["Matriz del aerocarril","Los ataques iniciales y la sobrecarga prueban una defensa equilibrada."],
    ["Arconte de la Tempestad","El rayo encadenado aumenta con el equipo aislado."],
    ["Libro mayor de sombras","Los mímicos del eclipse copian el valor mayor entre Ataque y Defensa."],
    ["Constelación rota","Los sellos rotan entre Forja, Naturaleza, Cristal y Luna."],
    ["Sello de la corona","Un sello giratorio y el calor superior cambian la disposición segura."],
    ["Sala Rompemochilas","Todas las presiones conocidas aparecen antes de la bóveda final."],
    ["Maestro del Tesoro del Eclipse","El Maestro rota sellos, bloquea enlaces y castiga el aislamiento."]
  ];
  stages.forEach((definition,index)=>{definition.name.push(spanishStages[index][0]);definition.rule.push(spanishStages[index][1]);});

  const enemyCatalog = {
    scout:{name:["Shadow Fox Scout","暗影狐斥候"],hp:18,damage:5,asset:"../../assets/animal-gearpack-expedition-enemy-fox-scout.webp"},
    ambusher:{name:["Thorn Fox Ambusher","荊棘狐伏擊手"],hp:20,damage:5,asset:"../../assets/animal-gearpack-expedition-enemy-fox-scout.webp",openingHit:3},
    boar:{name:["Armored Boar","重甲野豬"],hp:26,damage:7,asset:"../../assets/animal-gearpack-expedition-enemy-armored-boar.webp"},
    platedBoar:{name:["Ironplate Boar","鐵板野豬"],hp:29,damage:7,asset:"../../assets/animal-gearpack-expedition-enemy-armored-boar.webp",shield:7},
    crow:{name:["Crystal Crow","水晶烏鴉"],hp:25,damage:6,asset:"../../assets/animal-gearpack-expedition-enemy-crystal-crow.webp"},
    linkCrow:{name:["Prism Tax Crow","稜鏡稅羽鴉"],hp:26,damage:6,asset:"../../assets/animal-gearpack-expedition-enemy-crystal-crow.webp",isolation:1},
    moonMoth:{name:["Moon Veil Moth","月幕蛾"],hp:27,damage:6,asset:"../../assets/animal-gearpack-expedition-enemy-crystal-crow.webp",suppressTag:"moon"},
    prismRam:{name:["Prism Ram","稜鏡山羊"],hp:31,damage:7,asset:"../../assets/animal-gearpack-expedition-enemy-armored-boar.webp",shield:10},
    gearJackal:{name:["Gear Jackal","發條胡狼"],hp:28,damage:5,asset:"../../assets/animal-gearpack-expedition-enemy-fox-scout.webp",rage:1},
    magnetBeetle:{name:["Magnet Beetle","磁力甲蟲"],hp:30,damage:6,asset:"../../assets/animal-gearpack-expedition-enemy-armored-boar.webp",isolation:2},
    rustCrow:{name:["Rustwing Crow","鏽翼烏鴉"],hp:29,damage:6,asset:"../../assets/animal-gearpack-expedition-enemy-crystal-crow.webp",corrosion:1},
    steamToad:{name:["Steam Toad","蒸汽蟾蜍"],hp:33,damage:7,asset:"../../assets/animal-gearpack-expedition-enemy-armored-boar.webp",corrosion:2},
    furnaceBoar:{name:["Furnace Boar","熔爐野豬"],hp:35,damage:7,asset:"../../assets/animal-gearpack-expedition-enemy-armored-boar.webp",rowHeat:1},
    galeScout:{name:["Gale Fox Scout","疾風狐斥候"],hp:30,damage:6,asset:"../../assets/animal-gearpack-expedition-enemy-fox-scout.webp",openingHit:5},
    coilLynx:{name:["Coil Lynx","線圈山貓"],hp:34,damage:7,asset:"../../assets/animal-gearpack-expedition-enemy-crystal-crow.webp",overload:true},
    eclipseMimic:{name:["Eclipse Mimic","日蝕擬態獸"],hp:36,damage:7,asset:"../../assets/animal-gearpack-expedition-enemy-fox-scout.webp",mimic:true},
    tagSealer:{name:["Vault Tag Sealer","寶庫材質封印獸"],hp:37,damage:7,asset:"../../assets/animal-gearpack-expedition-enemy-crystal-crow.webp",rotatingSeal:true},
    rootGuardian:{name:["Root Guardian","樹根守衛"],hp:62,damage:10,asset:"../../assets/animal-gearpack-expedition-enemy-root-guardian.webp",boss:true,regrow:6,counterTag:"nature"},
    crystalWarden:{name:["Crystal Warden","水晶守衛"],hp:72,damage:11,asset:"../../assets/animal-gearpack-expedition-boss-crystal-warden.webp",boss:true,shield:18,reflect:4},
    hollowColossus:{name:["Hollow Colossus","發條巨像"],hp:82,damage:10,asset:"../../assets/animal-gearpack-expedition-boss-hollow-colossus.webp",boss:true,phase:"brace-rage"},
    furnaceLeviathan:{name:["Furnace Leviathan","熔爐巨獸"],hp:92,damage:11,asset:"../../assets/animal-gearpack-expedition-boss-furnace-leviathan.webp",boss:true,rowHeat:2,corrosion:1},
    tempestArchon:{name:["Tempest Archon","風暴統領"],hp:102,damage:11,asset:"../../assets/animal-gearpack-expedition-boss-tempest-archon.webp",boss:true,isolation:3,openingHit:4},
    eclipseHoardmaster:{name:["Eclipse Hoardmaster","日蝕藏主"],hp:116,damage:12,asset:"../../assets/animal-gearpack-expedition-boss-eclipse-hoardmaster.webp",boss:true,isolation:2,rotatingSeal:true,phase:"vault"}
  };
  const spanishEnemyNames = {
    scout:"Explorador zorro de sombra",ambusher:"Emboscador zorro de espinas",boar:"Jabalí acorazado",platedBoar:"Jabalí de placas de hierro",
    crow:"Cuervo de cristal",linkCrow:"Cuervo recaudador prisma",moonMoth:"Polilla del velo lunar",prismRam:"Carnero prisma",
    gearJackal:"Chacal mecánico",magnetBeetle:"Escarabajo magnético",rustCrow:"Cuervo oxidado",steamToad:"Sapo de vapor",
    furnaceBoar:"Jabalí del horno",galeScout:"Explorador del vendaval",coilLynx:"Lince de bobina",eclipseMimic:"Mímico del eclipse",
    tagSealer:"Sellador de etiquetas de la bóveda",rootGuardian:"Guardián Raíz",crystalWarden:"Guardián de Cristal",
    hollowColossus:"Coloso del Hueco",furnaceLeviathan:"Leviatán del Horno",tempestArchon:"Arconte de la Tempestad",
    eclipseHoardmaster:"Maestro del Tesoro del Eclipse"
  };
  Object.entries(enemyCatalog).forEach(([id,enemy])=>{enemy.name.push(spanishEnemyNames[id]);});
  const $ = (selector) => document.querySelector(selector);
  const screens = {main:$("#mainScreen"),stage:$("#stageScreen"),battle:$("#battleScreen")};
  const storedLocale = localStorage.getItem("weightPlayLocale");
  let locale = window.WonderI18n?.locale?.() || (["zh-Hant","es"].includes(storedLocale) ? storedLocale : "en");
  function normalizeProgress(source){
    const data=source&&typeof source==="object"?source:{};
    const migratedStage=data.unlockedStage===undefined?(Math.max(0,Number(data.unlockedRegion)||0)*5+1):Number(data.unlockedStage);
    const unlockedStage=Math.max(1,Math.min(STAGE_COUNT,Math.floor(migratedStage)||1));
    return {
      workshopXp:Math.max(0,Number(data.workshopXp)||0),
      discoveries:Array.isArray(data.discoveries)?[...new Set(data.discoveries.filter((id)=>items.some((item)=>item.id===id)))]:[],
      diamonds:Math.max(0,Number.isFinite(Number(data.diamonds))?Number(data.diamonds):12),
      bestRoom:Math.max(0,Number(data.bestRoom)||0),
      unlockedStage,
      selectedStage:Math.max(0,Math.min(unlockedStage-1,Math.floor(Number(data.selectedStage) || unlockedStage-1))),
      completedStages:Array.isArray(data.completedStages)?[...new Set(data.completedStages.map(Number).filter((value)=>value>=1&&value<=STAGE_COUNT))].sort((a,b)=>a-b):[]
    };
  }
  let progress = normalizeProgress(load(SAVE_KEY,{workshopXp:0,discoveries:[],diamonds:12,bestRoom:0}));
  let run = null;
  let selectedItem = null;
  let selectedTrayIndex = -1;
  let rotated = false;
  let resolving = false;
  let combatTimer = 0;
  let combatPendingCallback = null;
  let combatRemaining = 0;
  let combatDueAt = 0;
  let combatPaused = false;
  let combatFxTimer = 0;
  let combatFxRemaining = 0;
  let combatFxDueAt = 0;
  let combatFxPending = false;
  let modalReturnFocus = null;
  let selectedStage = progress.selectedStage;

  function t(key,vars={}){return (copy[locale][key] || copy.en[key] || key).replace(/\{(\w+)\}/g,(_,name)=>vars[name] ?? `{${name}}`);}
  function load(key,fallback){try{return {...fallback,...JSON.parse(localStorage.getItem(key)||"null")};}catch{return {...fallback};}}
  function saveProgress(){progress=normalizeProgress(progress);localStorage.setItem(SAVE_KEY,JSON.stringify(progress));}
  function saveRun(){if(run)localStorage.setItem(RUN_KEY,JSON.stringify(run));else localStorage.removeItem(RUN_KEY);}
  function sound(name){window.WonderSound?.play(name);}
  function track(name,data={}){window.WonderAnalytics?.track(name,{game_id:"animal-gearpack-expedition",...data});}
  function diamondBalance(){return window.WeightPlayWallet?.read().diamonds ?? progress.diamonds;}
  function spendDiamonds(cost){if(window.WeightPlayWallet)return window.WeightPlayWallet.spendDiamonds(cost);if(progress.diamonds<cost)return false;progress.diamonds-=cost;saveProgress();return true;}
  function itemById(id){return items.find((item)=>item.id===id);}
  function itemName(item){return item.name[locale]||item.name.en;}
  function itemAsset(item){return `${ASSET}${item.id}.webp`;}
  function setFeedback(text){const row=$("#feedbackRow");row.classList.remove("is-item-details");row.textContent=text;}
  function setItemFeedback(item){
    const shape=shapeFor(item),width=Math.max(...shape.map(([x])=>x))+1,height=Math.max(...shape.map(([,y])=>y))+1;
    const value=Math.max(1,Math.floor(item.gold/2));
    const row=$("#feedbackRow");
    row.classList.add("is-item-details");
    const identity=document.createElement("span");
    const tagKey=`tag${item.tag[0].toUpperCase()}${item.tag.slice(1)}`;
    identity.textContent=`${itemName(item)} · ${width}×${height} · ${t(tagKey)} · ${t("sellValue")} ${value}`;
    const effect=document.createElement("span");
    effect.textContent=`${t("attack")} ${item.atk} · ${t("defense")} ${item.armor} · ${t("healing")} ${item.heal} · ${t("sameTagBonus")}`;
    row.replaceChildren(identity,effect);
  }
  function showScreen(name,focusTarget=false){Object.entries(screens).forEach(([key,node])=>node.hidden=key!==name);document.body.dataset.screen=name;document.body.classList.toggle("is-game-playing",name==="battle");if(name==="stage")renderStage();if(name==="battle")renderBattle();if(focusTarget)requestAnimationFrame(()=>{const target=name==="main"?$("#startBtn"):name==="stage"?$(".region-card.is-selected:not(:disabled)"):$(".pack-cell[tabindex='0']");target?.focus({preventScroll:true});});}

  function applyLocale(next){const current=window.WonderI18n?.actualLocale?.();const requested=next==="zh-Hant"&&current==="zh-Hans"?current:next||"en";if(current!==requested)window.WonderI18n?.setLocale?.(requested);locale=window.WonderI18n?.legacyLocale?.(requested)||requested;locale=copy[locale]?locale:"en";localStorage.setItem("weightPlayLocale",requested);document.documentElement.lang=requested;document.title=`${t("title")} - WeightPlay`;$("#localeSelect").value=requested;document.querySelectorAll("[data-i18n]").forEach((node)=>{node.textContent=t(node.dataset.i18n)});document.querySelectorAll("[data-ui-aria]").forEach((node)=>node.setAttribute("aria-label",t(node.dataset.uiAria)));document.querySelectorAll("[data-ui-alt]").forEach((node)=>node.setAttribute("alt",t(node.dataset.uiAlt)));renderMain();if(!screens.stage.hidden)renderStage();if(!screens.battle.hidden)renderBattle();}
  function renderMain(){$("#workshopSummary").textContent=`${t("workshop")} Lv.${1+Math.floor(progress.workshopXp/40)} · ${progress.workshopXp} XP`;$("#discoverySummary").textContent=`${t("discoveries")} ${progress.discoveries.length}/12`;}
  function localized(pair){const index=locale==="zh-Hant"?1:locale==="es"?2:0;return pair?.[index]||pair?.[0]||"";}
  function renderStage(){
    const unlocked=Math.max(1,Math.min(STAGE_COUNT,Number(progress.unlockedStage)||1));
    selectedStage=Math.max(0,Math.min(unlocked-1,selectedStage));
    $("#stageGold").textContent=`${t("diamonds")} ${diamondBalance()}`;
    $("#loadoutText").textContent=`${t("discoveries")} ${progress.discoveries.length}/12 · ${t("workshop")} Lv.${1+Math.floor(progress.workshopXp/40)}`;
    const rail=$("#regionRail");rail.replaceChildren();
    stages.forEach((definition,index)=>{
      const region=regions[Math.floor(index/5)],available=index<unlocked,cleared=progress.completedStages.includes(index+1),checkpoint=(index+1)%5===0;
      const card=document.createElement("button");
      card.type="button";card.className=`region-card${index===selectedStage?" is-selected":""}${cleared?" is-cleared":""}${checkpoint?" is-checkpoint":""}`;
      card.dataset.stage=String(index);if(index%5===0)card.dataset.region=String(Math.floor(index/5));else card.dataset.regionGroup=String(Math.floor(index/5));card.disabled=!available;card.toggleAttribute("data-wp-stage-unlocked",available);
      card.setAttribute("aria-label",available?`${t("stage")} ${index+1}: ${localized(definition.name)}. ${localized(definition.rule)}`:`${t("stage")} ${index+1}: ${t("locked")}`);
      card.innerHTML=`<img src="${region.background}" alt="${localized(region.name)}"><span class="stage-number">${t("stage")} ${index+1}/30</span><strong>${localized(definition.name)}</strong><span class="stage-rule"${index%5===0?' data-region-meta=""':''}>${available?`${index%5===0?`5 ${t("encounter")} · `:""}${localized(definition.rule)}`:t("locked")}</span><span class="stage-badges">${checkpoint?`<b>${t("checkpoint")} · ${localized(enemyCatalog[definition.enemies[4]].name)}</b>`:""}${cleared?`<em>${t("completed")}</em>`:""}</span>`;
      card.addEventListener("focus",()=>{selectedStage=index;progress.selectedStage=index;card.parentElement?.querySelectorAll(".region-card").forEach((node)=>node.classList.toggle("is-selected",node===card));});
      card.addEventListener("click",()=>{if(!available)return;selectedStage=index;progress.selectedStage=index;saveProgress();newRun(index);});
      rail.append(card);
    });
    requestAnimationFrame(()=>$(".region-card.is-selected")?.scrollIntoView({behavior:"auto",inline:"center",block:"nearest"}));
  }

  function enemyAt(room,stageIndex=selectedStage){const definition=stages[Math.max(0,Math.min(STAGE_COUNT-1,Number(stageIndex)||0))];const base=enemyCatalog[definition.enemies[Math.max(0,Math.min(ROOMS_PER_STAGE-1,Number(room)||0))]];const region=Math.floor(stageIndex/5),step=stageIndex%5;return {...base,id:definition.enemies[room],hp:base.hp+region*3+step*2,damage:base.damage+Math.floor(region/2)};}
  function prepareEnemyState(enemy){run.enemyHp=enemy.hp;run.enemyMaxHp=enemy.hp;run.enemyShield=Math.max(0,Number(enemy.shield)||0);run.enemyTurn=0;run.corrosion=0;run.sealIndex=0;run.openingApplied=false;}
  function newRun(stageIndex=selectedStage){resetCombatLifecycle();selectedStage=Math.max(0,Math.min((Number(progress.unlockedStage)||1)-1,Number(stageIndex)||0));progress.selectedStage=selectedStage;saveProgress();const workshopLevel=1+Math.floor(progress.workshopXp/40),maxArmor=36+Math.min(18,(workshopLevel-1)*2);run={stage:selectedStage,region:Math.floor(selectedStage/5),room:0,armor:maxArmor,maxArmor,gold:8,placed:[],tray:["forge-hammer","leaf-buckler","berry-potion","crystal-lens"]};prepareEnemyState(enemyAt(0,selectedStage));selectedItem=run.tray[0];selectedTrayIndex=0;rotated=false;resolving=false;setFeedback(localized(stages[selectedStage].rule));saveRun();setTimeout(()=>sound("start"),0);track("game_start",{stage:selectedStage+1,region:run.region+1});showScreen("battle",true);}
  function shapeFor(item,isRotated=rotated){return item.shape.map(([x,y])=>isRotated?[y,x]:[x,y]);}
  function shapeDimensions(item,isRotated=rotated){const shape=shapeFor(item,isRotated);return {width:Math.max(...shape.map(([x])=>x))+1,height:Math.max(...shape.map(([,y])=>y))+1};}
  function occupiedCells(){const map=new Map();run.placed.forEach((placed)=>{const item=itemById(placed.id);const shape=placed.rotated?item.shape.map(([x,y])=>[y,x]):item.shape;shape.forEach(([dx,dy])=>map.set(`${placed.x+dx},${placed.y+dy}`,placed));});return map;}
  function canPlace(item,x,y){const occupied=occupiedCells();return shapeFor(item).every(([dx,dy])=>x+dx>=0&&x+dx<PACK_COLS&&y+dy>=0&&y+dy<PACK_ROWS&&!occupied.has(`${x+dx},${y+dy}`));}
  function selectedTrayPosition(){return run?.tray[selectedTrayIndex]===selectedItem?selectedTrayIndex:run?.tray.indexOf(selectedItem)??-1;}
  function selectFirstTrayItem(){selectedItem=run.tray[0]||null;selectedTrayIndex=selectedItem?0:-1;}
  function placeSelected(x,y){if(resolving||!selectedItem)return;const item=itemById(selectedItem),index=selectedTrayPosition();if(index<0)return;if(!canPlace(item,x,y)){sound("wrong");setFeedback(t("blocked"));return;}run.placed.push({id:item.id,x,y,rotated});run.tray.splice(index,1);progress.discoveries=[...new Set([...progress.discoveries,item.id])];selectFirstTrayItem();rotated=false;saveProgress();saveRun();sound("click");setFeedback(`${t("placed")}: ${itemName(item)}`);renderBattle();}
  function pickUpPlaced(placed){if(resolving)return;const index=run.placed.indexOf(placed);if(index<0)return;run.placed.splice(index,1);run.tray.unshift(placed.id);selectedItem=placed.id;selectedTrayIndex=0;rotated=placed.rotated;saveRun();setFeedback(`${t("pickedUp")}: ${itemName(itemById(placed.id))}`);renderBattle();}
  function sellSelected(){if(resolving||!selectedItem)return;const item=itemById(selectedItem),index=selectedTrayPosition();if(index<0)return;run.tray.splice(index,1);const value=Math.max(1,Math.floor(item.gold/2));run.gold+=value;selectFirstTrayItem();rotated=false;saveRun();sound("coin");setFeedback(`${t("sold")}: ${itemName(item)} +${value} ${t("gold")}`);renderBattle();if(!selectedItem)$("#fightBtn").focus({preventScroll:true});}
  function adjacentPairs(){const occupied=occupiedCells(),pairs=new Set();for(const [key,a] of occupied){const [x,y]=key.split(",").map(Number);[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{const b=occupied.get(`${x+dx},${y+dy}`);if(b&&b!==a&&itemById(a.id).tag===itemById(b.id).tag)pairs.add([a,b].map((p)=>run.placed.indexOf(p)).sort().join("-"));});}return pairs.size;}
  function linkedItems(){const occupied=occupiedCells(),linked=new Set();for(const [key,a] of occupied){const [x,y]=key.split(",").map(Number);[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{const b=occupied.get(`${x+dx},${y+dy}`);if(b&&b!==a&&itemById(a.id).tag===itemById(b.id).tag){linked.add(a);linked.add(b);}});}return linked;}
  function pairTags(){const occupied=occupiedCells(),pairs=new Map();for(const [key,a] of occupied){const [x,y]=key.split(",").map(Number);[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{const b=occupied.get(`${x+dx},${y+dy}`);if(!b||b===a)return;const itemA=itemById(a.id),itemB=itemById(b.id);if(itemA.tag!==itemB.tag)return;const id=[run.placed.indexOf(a),run.placed.indexOf(b)].sort().join("-");pairs.set(id,itemA.tag);});}return pairs;}
  function activeSeal(enemy){if(enemy.rotatingSeal)return ["forge","nature","crystal","moon"][run.sealIndex%4];if(enemy.overload){const totals={};run.placed.forEach((placed)=>{const tag=itemById(placed.id).tag;totals[tag]=(totals[tag]||0)+1;});return Object.entries(totals).sort((a,b)=>b[1]-a[1])[0]?.[0]||null;}return enemy.suppressTag||null;}
  function stats(){const enemy=enemyAt(run.room,run.stage),seal=activeSeal(enemy),base=run.placed.reduce((sum,p)=>{const item=itemById(p.id);sum.atk+=item.atk;sum.armor+=item.armor;sum.heal+=item.heal;return sum;},{atk:2,armor:0,heal:0});const tags=pairTags(),links=[...tags.values()].filter((tag)=>tag!==seal).length,linked=linkedItems(),isolated=run.placed.filter((placed)=>!linked.has(placed)).length,topRow=[...occupiedCells().keys()].filter((key)=>key.endsWith(",0")).length;return {...base,links,seal,isolated,topRow,atk:base.atk+links*2,armor:Math.max(0,base.armor+links-(run.corrosion||0))};}
  function renderPack(){const grid=$("#packGrid");grid.replaceChildren();const occupied=occupiedCells(),linked=linkedItems(),pending=selectedItem?itemById(selectedItem):null;for(let y=0;y<PACK_ROWS;y++)for(let x=0;x<PACK_COLS;x++){const cell=document.createElement("button");cell.type="button";cell.className="pack-cell";cell.dataset.x=x;cell.dataset.y=y;cell.disabled=resolving;const placed=occupied.get(`${x},${y}`);if(!placed&&pending&&canPlace(pending,x,y))cell.classList.add("is-valid");if(placed){cell.classList.add("is-occupied");if(linked.has(placed))cell.classList.add("is-adjacent");if(placed.x===x&&placed.y===y){const img=document.createElement("img");img.className="placed-item";img.src=itemAsset(itemById(placed.id));img.alt=itemName(itemById(placed.id));cell.append(img);}cell.addEventListener("click",()=>pickUpPlaced(placed));}else cell.addEventListener("click",()=>placeSelected(x,y));grid.append(cell);}const tray=$("#itemTray");tray.replaceChildren();run.tray.forEach((id,index)=>{const item=itemById(id),button=document.createElement("button"),selected=index===selectedTrayIndex;button.type="button";button.disabled=resolving;button.className=`tray-item${selected?" is-selected":""}`;button.innerHTML=`<img src="${itemAsset(item)}" alt=""><span>${itemName(item)}</span>`;button.addEventListener("click",()=>{if(resolving)return;selectedItem=id;selectedTrayIndex=index;rotated=false;setItemFeedback(item);renderBattle();});tray.append(button);});}
  function mechanicText(enemy,s){const parts=[];if(run.enemyShield>0)parts.push(`${t("shielded")} ${run.enemyShield}`);if(enemy.openingHit)parts.push(`${t("openingStrike")} ${enemy.openingHit}`);if(enemy.isolation&&s.isolated)parts.push(`${s.isolated} ${t("isolated")}`);if(enemy.corrosion)parts.push(`${t("corrosion")} ${run.corrosion||0}`);if(enemy.rowHeat&&s.topRow)parts.push(`${t("heat")} ${s.topRow}`);if(s.seal)parts.push(`${t("seal")} ${t(`tag${s.seal[0].toUpperCase()}${s.seal.slice(1)}`)}`);if(enemy.phase)parts.push(t("bossPhase"));return parts.join(" · ")||localized(stages[run.stage].rule);}
  function updateFightButtonLabel(enemy,s){const button=$("#fightBtn");if(resolving){button.setAttribute("aria-label",t(combatPaused?"resumeCombat":"autoFighting"));return;}button.setAttribute("aria-label",run.placed.length?t("fightReadyLabel",{enemy:localized(enemy.name),hp:Math.max(0,Math.ceil(run.enemyHp)),attack:s.atk,defense:s.armor,mechanic:mechanicText(enemy,s)}):t("fightBlockedLabel"));}
  function renderBattle(){if(!run)return;const enemy=enemyAt(run.room,run.stage),s=stats(),selected=selectedItem?itemById(selectedItem):null;$("#roomLabel").textContent=`${t("stage")} ${run.stage+1}/30 · ${t("encounter")} ${run.room+1}/5`;$("#armorLabel").textContent=`${t("health")} ${Math.max(0,Math.ceil(run.armor))}/${run.maxArmor}`;$("#objectiveText").textContent=mechanicText(enemy,s);$("#currencyText").textContent=`${t("gold")} ${run.gold} · ${t("diamonds")} ${diamondBalance()}`;$("#statsText").textContent=`${t("attack")} ${s.atk} · ${t("defense")} ${s.armor} · ${t("links")} ${s.links}`;$(".encounter-scene").style.backgroundImage=`url("${regions[run.region].background}")`;$("#enemyActor").src=enemy.asset;$("#enemyActor").alt=localized(enemy.name);$("#enemyHpBar span").style.width=`${Math.max(0,run.enemyHp/run.enemyMaxHp*100)}%`;$("#enemyHpBar").setAttribute("aria-label",`${localized(enemy.name)} ${Math.max(0,Math.ceil(run.enemyHp))}/${run.enemyMaxHp}${run.enemyShield?`, ${t("shielded")} ${run.enemyShield}`:""}`);$("#playerHpBar span").style.width=`${Math.max(0,run.armor/run.maxArmor*100)}%`;$("#playerHpBar").setAttribute("aria-label",`${t("health")} ${Math.max(0,Math.ceil(run.armor))}/${run.maxArmor}`);$("#fightBtn").textContent=resolving?t(combatPaused?"resumeCombat":"autoFighting"):t("fight");$("#fightBtn").disabled=resolving&&!combatPaused;$("#rotateBtn").disabled=resolving||!selectedItem;$("#sellBtn").disabled=resolving||!selectedItem;const utility=$("#pauseBtn");utility.textContent=resolving?(combatPaused?"▶":"❚❚"):"?";utility.setAttribute("aria-label",t(resolving?(combatPaused?"resumeCombat":"pauseCombatAction"):"objectiveHelp"));utility.title=utility.getAttribute("aria-label");if(selected){const next=shapeDimensions(selected,!rotated),value=Math.max(1,Math.floor(selected.gold/2));$("#rotateBtn").setAttribute("aria-label",t("rotateItemLabel",{item:itemName(selected),...next}));$("#sellBtn").setAttribute("aria-label",t("sellItemLabel",{item:itemName(selected),value}));}else{$("#rotateBtn").removeAttribute("aria-label");$("#sellBtn").removeAttribute("aria-label");}$("#battleBackBtn").disabled=resolving;renderPack();updateFightButtonLabel(enemy,s);}
  function animateAttack(){const rux=$("#ruxActor"),enemy=$("#enemyActor");rux.classList.remove("is-attacking");enemy.classList.remove("is-hit");void rux.offsetWidth;rux.classList.add("is-attacking");enemy.classList.add("is-hit");}
  function animateCounterattack(){const rux=$("#ruxActor"),enemy=$("#enemyActor");enemy.classList.remove("is-attacking");rux.classList.remove("is-hit");void enemy.offsetWidth;enemy.classList.add("is-attacking");rux.classList.add("is-hit");}
  function clearCombatFx(){clearTimeout(combatFxTimer);combatFxTimer=0;combatFxRemaining=0;combatFxDueAt=0;combatFxPending=false;const fx=$("#combatFx");if(fx)fx.textContent="";}
  function armCombatFx(delay=combatFxRemaining){clearTimeout(combatFxTimer);combatFxTimer=0;if(!combatFxPending||document.hidden)return;combatFxRemaining=Math.max(0,delay);combatFxDueAt=performance.now()+combatFxRemaining;combatFxTimer=setTimeout(()=>clearCombatFx(),combatFxRemaining);}
  function showCombatFx(text,delay=420){clearCombatFx();$("#combatFx").textContent=text;combatFxPending=true;combatFxRemaining=delay;if(!document.hidden)armCombatFx(delay);}
  function suspendCombatFx(){if(!combatFxPending)return;if(combatFxTimer){combatFxRemaining=Math.max(0,combatFxDueAt-performance.now());clearTimeout(combatFxTimer);combatFxTimer=0;}}
  function resumeCombatFx(){if(combatFxPending&&!combatFxTimer)armCombatFx(combatFxRemaining);}
  function resetCombatLifecycle(){clearTimeout(combatTimer);combatTimer=0;combatPendingCallback=null;combatRemaining=0;combatDueAt=0;combatPaused=false;clearCombatFx();}
  function scheduleCombat(callback,delay){clearTimeout(combatTimer);combatTimer=0;combatPendingCallback=callback;combatRemaining=Math.max(0,delay);combatDueAt=performance.now()+combatRemaining;if(combatPaused)return;combatTimer=setTimeout(()=>{combatTimer=0;combatPendingCallback=null;combatRemaining=0;combatDueAt=0;callback();},combatRemaining);}
  function pauseCombat(){if(!resolving||combatPaused)return;if(combatTimer){combatRemaining=Math.max(0,combatDueAt-performance.now());clearTimeout(combatTimer);combatTimer=0;}suspendCombatFx();combatPaused=true;setFeedback(t("combatPaused"));renderBattle();}
  function resumeCombat(){if(!resolving||!combatPaused)return;combatPaused=false;resumeCombatFx();setFeedback(t("autoFighting"));renderBattle();const callback=combatPendingCallback,delay=combatRemaining;if(callback)scheduleCombat(callback,delay);else autoCombatRound();}
  function autoCombatRound(){if(!resolving||!run)return;const enemy=enemyAt(run.room,run.stage),s=stats();let strike=s.atk;if(enemy.phase==="brace-rage"&&run.enemyTurn%2===0)strike=Math.max(1,Math.ceil(strike/2));let shieldHit=Math.min(run.enemyShield||0,strike);run.enemyShield-=shieldHit;let healthHit=strike-shieldHit;run.enemyHp-=healthHit;animateAttack();showCombatFx(shieldHit?`${t("shielded")} -${shieldHit}${healthHit?` · -${healthHit}`:""}`:`-${healthHit}`);if(enemy.reflect&&healthHit>0)run.armor-=enemy.reflect;saveRun();renderBattle();if(run.armor<=0){scheduleCombat(()=>showResult(false),500);return;}if(run.enemyHp<=0){run.gold+=4+run.room*2;progress.bestRoom=Math.max(progress.bestRoom,run.room+1);saveProgress();saveRun();scheduleCombat(roomVictory,520);return;}scheduleCombat(()=>{if(!resolving||!run)return;const rage=(enemy.rage||0)*run.enemyTurn,phaseRage=enemy.phase==="brace-rage"&&run.enemyTurn%2===1?4:0,isolation=(enemy.isolation||0)*s.isolated,heat=(enemy.rowHeat||0)*s.topRow,mimic=enemy.mimic?Math.ceil(Math.max(s.atk,s.armor)/5):0;const incoming=Math.max(1,enemy.damage+rage+phaseRage+isolation+heat+mimic-s.armor);run.armor=Math.min(run.maxArmor,run.armor+s.heal)-incoming;run.enemyTurn+=1;run.corrosion=(run.corrosion||0)+(enemy.corrosion||0);if(enemy.rotatingSeal)run.sealIndex=(run.sealIndex+1)%4;if(enemy.regrow&&s.seal!=="nature"&&![...pairTags().values()].includes("nature")){run.enemyHp=Math.min(run.enemyMaxHp,run.enemyHp+enemy.regrow);setFeedback(`${localized(enemy.name)} -${incoming} · ${t("regrowth")} +${enemy.regrow}`);}else setFeedback(`${localized(enemy.name)} -${incoming} ${t("health")}`);saveRun();animateCounterattack();renderBattle();$("#playerCombatFx").textContent=`-${incoming}`;if(run.armor<=0){scheduleCombat(()=>showResult(false),650);return;}scheduleCombat(()=>{$("#playerCombatFx").textContent="";autoCombatRound();},720);},220);}
  function fight(){if(resolving){resumeCombat();return;}if(!run.placed.length){setFeedback(t("needGear"));return;}const enemy=enemyAt(run.room,run.stage),s=stats();if(enemy.openingHit&&!run.openingApplied){run.openingApplied=true;const opening=Math.max(1,enemy.openingHit-Math.floor(s.armor/2));run.armor-=opening;setFeedback(`${t("openingStrike")} -${opening}`);if(run.armor<=0){showResult(false);return;}}combatPaused=false;resolving=true;setFeedback(t("autoFighting"));renderBattle();autoCombatRound();}
  function roomVictory(){combatPaused=false;resolving=false;renderBattle();if(run.room===ROOMS_PER_STAGE-1){showResult(true);return;}showLoot(()=>{run.room+=1;prepareEnemyState(enemyAt(run.room,run.stage));resolving=false;saveRun();setFeedback(t("repack"));renderBattle();if(run.room===stages[run.stage].merchantAfter)showMerchant();});}
  function randomItems(count){return [...items].sort(()=>Math.random()-.5).slice(0,count);}
  function showModal(title,text,art=""){const modal=$("#modal"),battleCanvas=$("#battleScreen .battle-canvas");if(modal.hidden)modalReturnFocus=document.activeElement;$("#modalTitle").textContent=title;$("#modalText").textContent=text;$("#modalArt").src=art;$("#modalArt").hidden=!art;$("#modalChoices").replaceChildren();battleCanvas.inert=true;battleCanvas.setAttribute("aria-hidden","true");modal.hidden=false;return $("#modalChoices");}
  function focusModalChoice(preferred,keepTop=false){requestAnimationFrame(()=>{const modal=$("#modal");if(modal.hidden)return;const target=preferred?.isConnected&&!preferred.disabled?preferred:$("#modalChoices button:not(:disabled)");(target||modal).focus();const card=modal.querySelector(".modal-card");if(keepTop&&card.scrollHeight<=card.clientHeight+1)card.scrollTop=0;});}
  function trapModalFocus(event){const modal=$("#modal");if(event.repeat&&(event.key==="Enter"||event.key===" ")){event.preventDefault();return;}if(event.key!=="Tab"||modal.hidden)return;const choices=[...document.querySelectorAll("#modalChoices button:not(:disabled)")].filter((button)=>button.getClientRects().length);if(!choices.length){event.preventDefault();modal.focus();return;}const first=choices[0],last=choices.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
  function closeModal(){const modal=$("#modal"),battleCanvas=$("#battleScreen .battle-canvas");modal.hidden=true;battleCanvas.inert=false;battleCanvas.removeAttribute("aria-hidden");const previous=modalReturnFocus;modalReturnFocus=null;requestAnimationFrame(()=>{const canRestore=previous?.isConnected&&previous.matches?.('button:not(:disabled),a[href],select:not(:disabled),[tabindex]:not([tabindex="-1"])')&&previous.getClientRects().length;if(canRestore){previous.focus();return;}const fallback=screens.battle.hidden?$(".region-card.is-selected:not(:disabled)"):$("#fightBtn:not(:disabled)");fallback?.focus();});}
  function choiceButton(label,handler,item){const button=document.createElement("button");button.type="button";button.innerHTML=item?`<img src="${itemAsset(item)}" alt="">${label}`:label;button.addEventListener("click",handler);return button;}
  function addToTray(item){if(run.tray.length+run.placed.length>=12){setFeedback(t("full"));return false;}run.tray.push(item.id);progress.discoveries=[...new Set([...progress.discoveries,item.id])];saveProgress();return true;}
  function showLoot(done){const hasRoom=run.tray.length+run.placed.length<12,reward=`${t("reward")}: +${4+run.room*2} ${t("gold")}`;const choices=showModal(t("chooseLoot"),hasRoom?reward:`${reward} · ${t("fullLoot")}`);randomItems(3).forEach((item)=>{const choice=choiceButton(itemName(item),()=>{if(!addToTray(item))return;closeModal();done();},item);choice.disabled=!hasRoom;choices.append(choice);});choices.append(choiceButton(t("leaveLoot"),()=>{closeModal();done();}));focusModalChoice(null,true);}
  function showMerchant(){
    let stock=randomItems(3),refreshPending=false,refreshUsed=false,confirmTimer=0,confirmDueAt=0,confirmRemaining=0,confirmationListening=false;
    let onConfirmationVisibility;
    const detachConfirmationLifecycle=()=>{
      if(!confirmationListening)return;
      document.removeEventListener("visibilitychange",onConfirmationVisibility);
      window.removeEventListener("pagehide",suspendConfirmation);
      window.removeEventListener("pageshow",resumeConfirmation);
      confirmationListening=false;
    };
    const armConfirmation=(delay)=>{
      clearTimeout(confirmTimer);
      confirmRemaining=Math.max(0,Number(delay)||0);
      confirmDueAt=performance.now()+confirmRemaining;
      confirmTimer=setTimeout(()=>{
        confirmTimer=0;confirmDueAt=0;confirmRemaining=0;refreshPending=false;
        detachConfirmationLifecycle();
        render();
      },confirmRemaining);
    };
    function suspendConfirmation(){
      if(!refreshPending||!confirmTimer)return;
      confirmRemaining=Math.max(0,confirmDueAt-performance.now());
      clearTimeout(confirmTimer);confirmTimer=0;confirmDueAt=0;
    }
    function resumeConfirmation(){if(!refreshPending||confirmTimer||document.hidden)return;armConfirmation(confirmRemaining);}
    onConfirmationVisibility=()=>{if(document.hidden)suspendConfirmation();else resumeConfirmation();};
    const beginConfirmation=()=>{
      if(!confirmationListening){
        document.addEventListener("visibilitychange",onConfirmationVisibility);
        window.addEventListener("pagehide",suspendConfirmation);
        window.addEventListener("pageshow",resumeConfirmation);
        confirmationListening=true;
      }
      armConfirmation(5000);
    };
    const clearConfirmation=()=>{
      clearTimeout(confirmTimer);confirmTimer=0;confirmDueAt=0;confirmRemaining=0;refreshPending=false;
      detachConfirmationLifecycle();
    };
    const render=()=>{
      const balance=diamondBalance();
      const message=refreshUsed?t("refreshUsed"):refreshPending?t("refreshDecision",{before:balance,after:balance-3}):`${t("gold")} ${run.gold} · ${t("diamonds")} ${balance}`;
      const choices=showModal(t("merchant"),message,"../../assets/animal-gearpack-expedition-orla.webp");
      stock.forEach((item)=>choices.append(choiceButton(`${t("buy")} ${item.gold} · ${itemName(item)}`,()=>{
        clearConfirmation();
        if(run.gold<item.gold){$("#modalText").textContent=t("notEnough");return;}
        if(addToTray(item)){run.gold-=item.gold;saveRun();stock=randomItems(3);render();}
      },item)));
      const refresh=choiceButton(refreshUsed?t("refreshUsed"):refreshPending?t("refreshConfirm",{before:balance,after:balance-3}):t("refresh"),()=>{
        if(refreshUsed)return;
        const current=diamondBalance();
        if(current<3){clearConfirmation();$("#modalText").textContent=t("refreshNeed",{balance:current});refresh.classList.remove("is-confirming");return;}
        if(!refreshPending){refreshPending=true;render();beginConfirmation();return;}
        clearConfirmation();
        if(spendDiamonds(3)){refreshUsed=true;sound("upgrade");track("diamond_spend",{sink:"merchant_refresh",amount:3});stock=randomItems(3);render();}
      });
      refresh.addEventListener("keydown",(event)=>{if(event.repeat&&(event.key==="Enter"||event.key===" "))event.preventDefault();});
      refresh.dataset.merchantRefresh="";
      refresh.disabled=refreshUsed;
      refresh.classList.toggle("is-confirming",refreshPending&&!refreshUsed);
      refresh.setAttribute("aria-label",refreshUsed?t("refreshUsed"):refreshPending?t("refreshConfirmLabel",{before:balance,after:balance-3}):t("refreshLabel",{balance}));
      choices.append(refresh);
      choices.append(choiceButton(t("leave"),()=>{clearConfirmation();closeModal();renderBattle();}));
      focusModalChoice(refreshPending?refresh:null);
    };
    render();
  }
  function showResult(won){clearTimeout(combatTimer);resolving=false;const finishedStage=run.stage,xp=won?35+Math.floor(finishedStage/5)*5:8+run.room*4,previousUnlocked=progress.unlockedStage;progress.workshopXp+=xp;if(won){progress.completedStages=[...new Set([...progress.completedStages,finishedStage+1])].sort((a,b)=>a-b);progress.unlockedStage=Math.max(previousUnlocked,Math.min(STAGE_COUNT,finishedStage+2));selectedStage=Math.min(STAGE_COUNT-1,finishedStage+1);progress.selectedStage=selectedStage;}saveProgress();sound(won?"win":"wrong");track("game_end",{result:won?"win":"loss",room:run.room+1,stage:finishedStage+1,region:run.region+1});const resultParts=[`+${xp} XP`,`${t("workshop")} Lv.${1+Math.floor(progress.workshopXp/40)} · ${progress.workshopXp} XP`,`${t("discoveries")} ${progress.discoveries.length}/12`];if(won&&finishedStage===STAGE_COUNT-1)resultParts.unshift(t("allStagesCleared"));else if(won&&progress.unlockedStage>previousUnlocked)resultParts.push(`${t("stage")} ${finishedStage+2} ${t("unlocked")}`);const choices=showModal(won?t("stageCleared"):t("defeat"),resultParts.join(" · "),won?"../../assets/animal-gearpack-expedition-icons/victory-sparkle.webp":"../../assets/animal-gearpack-expedition-rux.webp");choices.append(choiceButton(t("backToStages"),()=>{closeModal();run=null;saveRun();showScreen("stage",true);}));choices.append(choiceButton(t("retryStage"),()=>{closeModal();run=null;saveRun();newRun(finishedStage);}));if(won&&finishedStage<STAGE_COUNT-1)choices.append(choiceButton(t("nextExpedition"),()=>{closeModal();run=null;saveRun();newRun(finishedStage+1);}));focusModalChoice();}

  const packFocus={x:0,y:0};
  let restorePackFocus=false;
  let stageEntryKeyboardKey="";
  function focusPackCell(){const cell=$(`.pack-cell[data-x="${packFocus.x}"][data-y="${packFocus.y}"]`);if(cell&&!cell.disabled)cell.focus({preventScroll:true});}
  function enhancePackKeyboard(){
    if(!run)return;
    const grid=$("#packGrid"),tray=$("#itemTray"),occupied=occupiedCells(),pending=selectedItem?itemById(selectedItem):null;
    grid.setAttribute("role","grid");grid.setAttribute("aria-label",t("packGridLabel"));grid.setAttribute("aria-rowcount",PACK_ROWS);grid.setAttribute("aria-colcount",PACK_COLS);
    grid.querySelectorAll(".pack-cell").forEach((cell)=>{const x=Number(cell.dataset.x),y=Number(cell.dataset.y),placed=occupied.get(`${x},${y}`);let action=t("emptyCell");if(placed)action=t("pickUpItem",{item:itemName(itemById(placed.id))});else if(pending)action=canPlace(pending,x,y)?t("placeItem",{item:itemName(pending)}):t("cannotPlace",{item:itemName(pending)});cell.tabIndex=x===packFocus.x&&y===packFocus.y?0:-1;cell.setAttribute("aria-rowindex",y+1);cell.setAttribute("aria-colindex",x+1);cell.setAttribute("aria-label",t("cellLabel",{row:y+1,column:x+1,action}));});
    tray.querySelectorAll(".tray-item").forEach((button,index)=>{const item=itemById(run.tray[index]),selected=index===selectedTrayIndex;button.setAttribute("aria-pressed",selected?"true":"false");button.setAttribute("aria-label",t(selected?"selectedItem":"selectItem",{item:itemName(item)}));});
    if(restorePackFocus){restorePackFocus=false;requestAnimationFrame(focusPackCell);}
  }
  const packObserver=new MutationObserver(enhancePackKeyboard);
  packObserver.observe($("#packGrid"),{childList:true});packObserver.observe($("#itemTray"),{childList:true});
  $("#packGrid").addEventListener("focusin",(event)=>{const cell=event.target.closest(".pack-cell");if(cell){packFocus.x=Number(cell.dataset.x);packFocus.y=Number(cell.dataset.y);}});
  $("#packGrid").addEventListener("keydown",(event)=>{const cell=event.target.closest(".pack-cell");if(!cell)return;if(event.key==="Enter"||event.key===" "){if(event.repeat&&stageEntryKeyboardKey===event.key){event.preventDefault();return;}packFocus.x=Number(cell.dataset.x);packFocus.y=Number(cell.dataset.y);restorePackFocus=true;return;}const move={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];if(!move)return;event.preventDefault();packFocus.x=Math.max(0,Math.min(PACK_COLS-1,Number(cell.dataset.x)+move[0]));packFocus.y=Math.max(0,Math.min(PACK_ROWS-1,Number(cell.dataset.y)+move[1]));enhancePackKeyboard();focusPackCell();});
  $("#packGrid").addEventListener("click",(event)=>{const cell=event.target.closest(".pack-cell");if(cell&&event.detail===0){packFocus.x=Number(cell.dataset.x);packFocus.y=Number(cell.dataset.y);restorePackFocus=true;}});
  $("#itemTray").addEventListener("click",(event)=>{if(event.target.closest(".tray-item")&&event.detail===0){packFocus.x=0;packFocus.y=0;restorePackFocus=true;}});
  $("#regionRail").addEventListener("keydown",(event)=>{if(!event.repeat&&(event.key==="Enter"||event.key===" ")&&event.target.closest(".region-card:not(:disabled)"))stageEntryKeyboardKey=event.key;});
  ["rotateBtn","sellBtn"].forEach((id)=>$("#"+id).addEventListener("keydown",(event)=>{if(event.repeat&&(event.key==="Enter"||event.key===" "))event.preventDefault();}));
  document.addEventListener("keyup",(event)=>{if(event.key===stageEntryKeyboardKey)stageEntryKeyboardKey="";});
  window.addEventListener("blur",()=>{stageEntryKeyboardKey="";});
  $("#modal").addEventListener("keydown",trapModalFocus);
  document.addEventListener("visibilitychange",()=>{if(document.hidden){suspendCombatFx();pauseCombat();}else{resumeCombatFx();if(combatPaused)requestAnimationFrame(()=>$("#fightBtn")?.focus({preventScroll:true}));}});
  window.addEventListener("pagehide",()=>{suspendCombatFx();pauseCombat();});
  window.addEventListener("pageshow",resumeCombatFx);

  $(".home-link").setAttribute("data-wp-return","main");$("#stageBackBtn").setAttribute("data-wp-return","stage");$("#battleBackBtn").setAttribute("data-wp-return","battle");
  $("#localeSelect").addEventListener("change",(event)=>applyLocale(event.target.value));$("#startBtn").addEventListener("click",()=>showScreen("stage",true));$("#stageBackBtn").addEventListener("click",()=>showScreen("main",true));$("#battleBackBtn").addEventListener("click",()=>{if(resolving)return;saveRun();showScreen("stage",true)});$("#pauseBtn").addEventListener("keydown",(event)=>{if(event.repeat&&(event.key==="Enter"||event.key===" "))event.preventDefault();});$("#pauseBtn").addEventListener("click",()=>{if(!resolving){setFeedback(localized(stages[run?.stage??selectedStage].rule));return;}if(combatPaused)resumeCombat();else pauseCombat();});$("#rotateBtn").addEventListener("click",()=>{if(resolving||!selectedItem)return;rotated=!rotated;setItemFeedback(itemById(selectedItem));renderBattle();});$("#sellBtn").addEventListener("click",sellSelected);$("#fightBtn").addEventListener("click",fight);
  let railSettleTimer=0;$("#regionRail").addEventListener("scroll",()=>{clearTimeout(railSettleTimer);railSettleTimer=setTimeout(()=>{const rail=$("#regionRail"),center=rail.getBoundingClientRect().left+rail.clientWidth/2,cards=[...rail.querySelectorAll(".region-card:not(:disabled)")];const nearest=cards.sort((a,b)=>Math.abs((a.getBoundingClientRect().left+a.offsetWidth/2)-center)-Math.abs((b.getBoundingClientRect().left+b.offsetWidth/2)-center))[0];if(!nearest)return;selectedStage=Number(nearest.dataset.stage)||0;progress.selectedStage=selectedStage;cards.forEach((card)=>card.classList.toggle("is-selected",card===nearest));saveProgress();},100);},{passive:true});
  if(new URLSearchParams(location.search).has("smoke"))window.__gearpackSmoke={stageCount:STAGE_COUNT,stages:stages.map((definition,index)=>({stage:index+1,region:Math.floor(index/5)+1,name:definition.name[0],rule:definition.rule[0],enemies:[...definition.enemies],checkpoint:(index+1)%5===0})),unlockAll(){progress.unlockedStage=STAGE_COUNT;progress.selectedStage=STAGE_COUNT-1;selectedStage=STAGE_COUNT-1;saveProgress();showScreen("stage");return progress;},openStageForTest(stage=1){progress.unlockedStage=Math.max(progress.unlockedStage,Math.min(STAGE_COUNT,stage));saveProgress();newRun(Math.max(0,Math.min(STAGE_COUNT-1,stage-1)));return {stage:run.stage+1,enemy:enemyAt(0,run.stage).id};},openEncounterForTest(stage=30,room=5){this.openStageForTest(stage);run.room=Math.max(0,Math.min(ROOMS_PER_STAGE-1,room-1));prepareEnemyState(enemyAt(run.room,run.stage));renderBattle();return {stage:run.stage+1,room:run.room+1,enemy:enemyAt(run.room,run.stage).id};},mechanicPreview(stage=30,room=5){const enemy=enemyAt(room-1,stage-1);return {id:enemy.id,shield:enemy.shield||0,openingHit:enemy.openingHit||0,isolation:enemy.isolation||0,corrosion:enemy.corrosion||0,rowHeat:enemy.rowHeat||0,overload:Boolean(enemy.overload),rotatingSeal:Boolean(enemy.rotatingSeal),phase:enemy.phase||null};},finishRegionForTest(){if(!run)newRun(0);run.room=4;showResult(true);},finishStageForTest(stage=1){if(!run||run.stage!==stage-1)newRun(stage-1);run.room=4;showResult(true);},openMerchantForTest(){if(!run)newRun(0);showMerchant();},openFullLootForTest(){if(!run)newRun(0);run.tray=Array.from({length:12},(_,index)=>items[index%6].id);run.placed=[];selectedItem=run.tray[0];selectedTrayIndex=0;showLoot(()=>{run.room=1;prepareEnemyState(enemyAt(run.room,run.stage));saveRun();setFeedback(t("repack"));renderBattle();});}};
  applyLocale(locale);showScreen("main");
})();
