(function () {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const SAVE_KEY = "weightplay-signal-veil-v1";
  const LOCALE_PATHS = {en:"en","zh-Hant":"zh-tw","zh-Hans":"zh-cn",ja:"ja",ko:"ko",es:"es","pt-BR":"pt-br",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"};
  const PATH_LOCALES = Object.fromEntries(Object.entries(LOCALE_PATHS).map(([key,value]) => [value,key]));
  const WORLD = {width:3072,height:1024};
  const BASE_VIEW = {width:960,height:540};
  const PLAYER_RADIUS = 24;
  const MAP_SIGNAL_TOWN = "signalTown";
  const MAP_MOONFALL = "moonfallRelay";
  const MAP_ASHFALL = "ashfallObservatory";
  const MAP_LUNAR = "lunarArchive";
  const QUESTS = window.SIGNAL_VEIL_QUESTS || [];
  const WORLD_OBJECTS = [
    // Every visible object owns its own matching collision footprint.
    {sprite:3,x:520,y:150,w:430,h:286,collision:{kind:"rect",w:360,h:200,oy:18}},
    {sprite:0,x:190,y:300,w:250,h:210,collision:{kind:"rect",w:190,h:160,oy:14}},
    {sprite:1,x:820,y:300,w:250,h:210,collision:{kind:"rect",w:190,h:160,oy:14}},
    {sprite:2,x:190,y:750,w:250,h:210,collision:{kind:"rect",w:190,h:160,oy:14}},
    {sprite:0,x:820,y:750,w:250,h:210,collision:{kind:"rect",w:190,h:160,oy:14}},
    {sprite:4,x:520,y:430,w:200,h:200,collision:{kind:"circle",r:60}},
    {sprite:5,x:1140,y:155,w:230,h:200,collision:{kind:"circle",r:66}},
    {sprite:5,x:1510,y:150,w:230,h:200,collision:{kind:"circle",r:66}},
    {sprite:5,x:1900,y:155,w:230,h:200,collision:{kind:"circle",r:66}},
    {sprite:5,x:1110,y:895,w:230,h:200,collision:{kind:"circle",r:66}},
    {sprite:5,x:1920,y:895,w:230,h:200,collision:{kind:"circle",r:66}},
    {sprite:6,x:1350,y:835,w:145,h:125,collision:{kind:"circle",r:46}},
    {sprite:6,x:1770,y:835,w:145,h:125,collision:{kind:"circle",r:46}},
    {sprite:7,x:1550,y:905,w:230,h:150,collision:{kind:"circle",r:72}},
    {sprite:8,x:2220,y:150,w:230,h:155,collision:{kind:"rect",w:185,h:110}},
    {sprite:10,x:2580,y:125,w:270,h:170,collision:{kind:"rect",w:225,h:120}},
    {sprite:9,x:2910,y:175,w:160,h:195,collision:{kind:"circle",r:52}},
    {sprite:9,x:2470,y:600,w:150,h:185,collision:{kind:"circle",r:50}},
    {sprite:11,x:2200,y:880,w:180,h:145,collision:{kind:"rect",w:150,h:100}},
    {sprite:10,x:2580,y:900,w:260,h:160,collision:{kind:"rect",w:215,h:112}},
    {sprite:8,x:2910,y:860,w:220,h:150,collision:{kind:"rect",w:180,h:105}},
  ];
  const MOONFALL_OBJECTS = WORLD_OBJECTS.map((object,index)=>({
    ...object,
    x:WORLD.width-object.x,
    y:index%2===0?WORLD.height-object.y:object.y,
    sprite:(object.sprite+(index%3))%12,
    collision:{...object.collision,ox:-(object.collision.ox||0)}
  }));
  const ASHFALL_OBJECTS = WORLD_OBJECTS.map((object,index)=>({
    ...object,
    x:index%2?WORLD.width-object.x:object.x,
    y:clamp(object.y+(index%3-1)*70,90,WORLD.height-90),
    sprite:(object.sprite+5+(index%2))%12,
    collision:{...object.collision,ox:index%2?-(object.collision.ox||0):(object.collision.ox||0)}
  }));
  const LUNAR_OBJECTS = [
    {...WORLD_OBJECTS[3],x:270,y:190,sprite:10},{...WORLD_OBJECTS[4],x:820,y:830,sprite:8},
    {...WORLD_OBJECTS[0],x:1536,y:135,sprite:3},{...WORLD_OBJECTS[15],x:1510,y:865,sprite:11},
    {...WORLD_OBJECTS[1],x:2220,y:170,sprite:2},{...WORLD_OBJECTS[2],x:2800,y:820,sprite:1},
    {...WORLD_OBJECTS[5],x:420,y:800,sprite:4},{...WORLD_OBJECTS[6],x:1080,y:170,sprite:6},
    {...WORLD_OBJECTS[7],x:2050,y:850,sprite:5},{...WORLD_OBJECTS[8],x:2760,y:180,sprite:6},
  ].map(object=>({...object,collision:{...object.collision}}));
  const MAP_OBJECTS = {[MAP_SIGNAL_TOWN]:WORLD_OBJECTS,[MAP_MOONFALL]:MOONFALL_OBJECTS,[MAP_ASHFALL]:ASHFALL_OBJECTS,[MAP_LUNAR]:LUNAR_OBJECTS};
  const MAP_PORTALS = {
    [MAP_SIGNAL_TOWN]:[{x:2700,y:520,to:MAP_MOONFALL,spawnX:430,spawnY:520,label:"portalToMoonfall",requires:"chapter2"}],
    [MAP_MOONFALL]:[
      {x:390,y:520,to:MAP_SIGNAL_TOWN,spawnX:2630,spawnY:520,label:"portalToTown"},
      {x:2700,y:520,to:MAP_ASHFALL,spawnX:430,spawnY:520,label:"portalToAshfall",requires:"chapter3"},
    ],
    [MAP_ASHFALL]:[
      {x:390,y:520,to:MAP_MOONFALL,spawnX:2630,spawnY:520,label:"portalToMoonfallReturn"},
      {x:2700,y:520,to:MAP_LUNAR,spawnX:430,spawnY:520,label:"portalToLunar",requires:"chapter4"},
    ],
    [MAP_LUNAR]:[{x:390,y:520,to:MAP_ASHFALL,spawnX:2630,spawnY:520,label:"portalToAshfallReturn"}],
  };
  const RELAY_NODES = [
    {id:"origin",x:720,y:260,index:5,name:"relayOrigin"},
    {id:"memory",x:1540,y:760,index:13,name:"relayMemory"},
    {id:"warning",x:2450,y:360,index:5,name:"relayWarning"},
  ];
  const ASHFALL_NODES = [
    {id:"survivor",x:760,y:520,index:7,name:"ashfallSurvivorName",message:"ashfallSurvivorMessage",questId:"q36_find_aster",npc:true},
    {id:"manifest",x:1210,y:270,index:5,name:"ashfallManifestName",message:"ashfallManifestMessage",questId:"q38_read_manifest"},
    {id:"jammer",x:1810,y:630,index:13,name:"ashfallJammerName",message:"ashfallJammerMessage",questId:"q40_disable_jammer"},
    {id:"core",x:2460,y:390,index:15,name:"ashfallCoreName",message:"ashfallCoreMessage",questId:"q42_open_blackbox"},
  ];
  const LUNAR_NODES = [
    {id:"beacon",x:720,y:520,index:15,name:"lunarBeaconName",message:"lunarBeaconMessage",questId:"q48_read_arrival_beacon"},
    {id:"cipher",x:1260,y:360,index:5,name:"lunarCipherName",message:"lunarCipherMessage",questId:"q50_decode_cipher_well"},
    {id:"nursery",x:1840,y:650,index:7,name:"lunarNurseryName",message:"lunarNurseryMessage",questId:"q52_open_nursery_record"},
    {id:"core",x:2460,y:410,index:13,name:"lunarCoreName",message:"lunarCoreMessage",questId:"q54_reach_hollow_core"},
  ];
  const SPRITE_FRAMES = [
    [55,45,230,220],[365,42,225,220],[642,42,228,220],[990,42,190,230],
    [75,345,150,190],[360,298,225,245],[680,350,180,180],[985,310,210,240],
    [20,590,230,230],[305,580,275,245],[625,548,270,275],[895,565,345,275],
    [20,860,260,340],[285,875,305,310],
    {bounds:[620,790,330,410],parts:[[620,790,310,410]]},
    {bounds:[930,790,288,410],parts:[[990,790,190,45],[936,830,282,370]]},
  ];
  const atlas = {sprites:new Image(),items:new Image(),npcs:new Image(),world:new Image()};
  atlas.sprites.src = "/assets/signal-veil-sprites.webp";
  atlas.items.src = "/assets/signal-veil-items.webp";
  atlas.npcs.src = "/assets/signal-veil-npcs.webp";
  atlas.world.src = "/assets/signal-veil-ground-v2.webp";
  atlas.objects = new Image();
  atlas.objects.src = "/assets/signal-veil-world-objects-v2.webp";

  function routeLocale() {
    const match = location.pathname.match(/^\/([^/]+)\/games\/signal-veil\//);
    return PATH_LOCALES[match?.[1]?.toLowerCase()] || localStorage.getItem("weightPlayLocale") || "en";
  }

  let locale = window.SIGNAL_VEIL_LOCALES[routeLocale()] ? routeLocale() : "en";
  let copy = window.SIGNAL_VEIL_LOCALES[locale];
  const template = (text, data={}) => String(text || "").replace(/\{(\w+)\}/g, (_,key) => data[key] ?? "");
  function t(key, data) {
    let value = copy[key] ?? window.SIGNAL_VEIL_LOCALES.en[key] ?? key;
    if (locale === "zh-Hans" && typeof value === "string") value = window.WonderI18n?.simplifyChineseText?.(value) || value;
    return template(value, data);
  }

  const canvas = $("#gameCanvas");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  const nodes = {
    main:$("#main"), battle:$("#battleShell"), reserve:$(".ad-reserve"), loading:$("#loadingPanel"), locale:$("#localeSelect"),
    progress:$("#mainProgress"), level:$("#levelValue"), hpFill:$("#hpFill"), hpText:$("#hpText"),
    xpFill:$("#xpFill"), xpText:$("#xpText"), visionState:$("#visionState"), zone:$("#zoneLabel"),
    objective:$("#objective"), toast:$("#toast"), dialogue:$("#dialogue"), speaker:$("#speaker"),
    dialogueText:$("#dialogueText"), dialogueNext:$("#dialogueNext"), dialogueChoices:$("#dialogueChoices"),
    broadcastChoice:$("#broadcastChoice"),protectChoice:$("#protectChoice"),overlay:$("#overlay"),
    pause:$("#pausePanel"), inventory:$("#inventoryPanel"), leave:$("#leavePanel"), result:$("#resultPanel"),
    weaponName:$("#weaponName"), armorName:$("#armorName"), accessoryName:$("#accessoryName"), stats:$("#stats"),
    weaponEffect:$("#weaponEffect"),armorEffect:$("#armorEffect"),accessoryEffect:$("#accessoryEffect"),
    weaponToggle:$("#weaponToggle"),armorToggle:$("#armorToggle"),accessoryToggle:$("#accessoryToggle"),
    pauseLevel:$("#pauseLevel"),pauseZone:$("#pauseZone"),pauseObjective:$("#pauseObjective"),
    diamondBalance:$("#diamondBalance"), buyAnchor:$("#buyAnchor"), anchorStatus:$("#anchorStatus"),
    joystick:$("#joystick"), stick:$("#stick"), attack:$("#attackButton"), skill:$("#skillButton"), vision:$("#visionButton")
  };

  const fresh = {
    x:420,y:545,facing:"right",level:1,xp:0,hp:40,maxHp:40,attack:8,defense:2,
    visionUnlocked:false,trueVision:false,talked:[],defeated:[],chests:[],bossDefeated:false,
    equipment:{weapon:false,armor:false,accessory:false},equipped:{weapon:false,armor:false,accessory:false},
    enemyHp:{},bossHp:260,signalAnchor:false,
    mapId:MAP_SIGNAL_TOWN,witnessReport:false,chapter2Started:false,relays:[],storyComplete:false,
    chapter3Started:false,ashfallFindings:[],ashfallChoice:null,ashfallReturned:false,chapter3Complete:false,
    chapter4Started:false,lunarFindings:[],lunarChoice:null,lunarReturned:false,chapter4Complete:false,
    discoveries:{forest:false,lab:false,boss:false,moonfall:false,ashfall:false,lunar:false},
    checkpoint:{x:420,y:545,mapId:MAP_SIGNAL_TOWN}
  };
  const stateStore=window.SignalVeilStateStore;
  let state=stateStore.load(SAVE_KEY,fresh,Object.keys(MAP_OBJECTS));
  let playing = false, paused = false, trueVision = Boolean(state.trueVision), currentDialogue = null;
  if(applyLevelUps(false)>0)stateStore.save(SAVE_KEY,state,trueVision);
  let attackCooldown = 0, skillCooldown = 0, invulnerability = 0, swingTimer = 0, lastTime = 0, toastTimer = 0, resultRevealTimer = 0;
  let bossIntroduced = false, resultClaimed = false, playerMoving = false, walkCycle = 0;
  const keys = new Set();
  const projectiles = [];
  const enemyProjectiles = [];
  const effects = [];
  const touchMove = {x:0,y:0};
  const INTERACT_PROMPT = {x:BASE_VIEW.width/2-96,y:BASE_VIEW.height-62,w:192,h:44};

  const npcs = [
    {x:430,y:490,index:0,reveal:false},{x:345,y:300,index:1,reveal:true},{x:680,y:300,index:2,reveal:true},
    {x:840,y:520,index:3,reveal:true},{x:650,y:650,index:4,reveal:false},{x:340,y:650,index:5,reveal:false},
    {x:470,y:820,index:6,reveal:false},{x:610,y:820,index:7,reveal:false},{x:880,y:470,index:8,reveal:false},
    {x:500,y:650,index:9,reveal:false}
  ];
  const enemySeeds = [
    [1100,340,4],[1230,650,5],[1360,450,4],[1490,760,6],[1620,300,5],[1730,600,7],[1860,430,4],[1930,760,7],
    [2160,310,8],[2260,670,9],[2380,430,10],[2470,790,8],[2580,300,11],[2680,620,10],[2760,790,9]
  ];
  const moonfallEnemySeeds = [
    [510,410,9],[890,690,10],[1190,330,11],[1430,520,8],
    [1760,260,10],[2050,680,11],[2380,610,9],[2720,430,8],
  ];
  const ashfallEnemySeeds = [
    [980,690,10],[1380,470,11],[1640,270,9],[2020,650,11],[2360,650,10],[2680,700,12],
  ];
  const lunarEnemySeeds = [
    [930,300,8],[1060,720,10],[1450,560,11],[1650,300,9],
    [2010,430,12],[2200,720,10],[2580,690,11],[2820,360,9],
  ];
  const makeEnemies = () => [
    ...enemySeeds.map(([x,y,sprite],id) => ({
      id,x,y,homeX:x,homeY:y,mapId:MAP_SIGNAL_TOWN,sprite,hp:state.enemyHp[id]??(26 + (id > 7 ? 15 : 0)),maxHp:26 + (id > 7 ? 15 : 0),
      speed:50 + (id % 3) * 10,attackTimer:0,phase:id*.73,hidden:sprite===7,dead:state.defeated.has(id)
    })),
    ...moonfallEnemySeeds.map(([x,y,sprite],offset) => {
      const id=enemySeeds.length+offset;
      return {id,x,y,homeX:x,homeY:y,mapId:MAP_MOONFALL,sprite,hp:state.enemyHp[id]??52,maxHp:52,speed:62+(offset%3)*8,attackTimer:0,phase:id*.73,hidden:offset===3||offset===7,dead:state.defeated.has(id)};
    }),
    ...ashfallEnemySeeds.map(([x,y,sprite],offset) => {
      const id=enemySeeds.length+moonfallEnemySeeds.length+offset;
      return {id,x,y,homeX:x,homeY:y,mapId:MAP_ASHFALL,sprite,hp:state.enemyHp[id]??68,maxHp:68,speed:68+(offset%2)*9,attackTimer:0,phase:id*.73,hidden:offset===2,dead:state.defeated.has(id)};
    }),
    ...lunarEnemySeeds.map(([x,y,sprite],offset) => {
      const id=enemySeeds.length+moonfallEnemySeeds.length+ashfallEnemySeeds.length+offset;
      return {id,x,y,homeX:x,homeY:y,mapId:MAP_LUNAR,sprite,hp:state.enemyHp[id]??82,maxHp:82,speed:72+(offset%3)*7,attackTimer:0,phase:id*.73,hidden:offset===1||offset===6,dead:state.defeated.has(id)};
    }),
  ];
  let enemies = makeEnemies();
  let boss = {x:2890,y:520,hp:state.bossHp??260,maxHp:260,attackTimer:1.2,pattern:0,dead:state.bossDefeated,sprite:12,stun:0,charge:0};
  const chests = [
    {id:"weapon",x:1430,y:270,item:"weapon",hidden:true},{id:"accessory",x:1840,y:810,item:"accessory",hidden:true},
    {id:"armor",x:2360,y:250,item:"armor",hidden:false}
  ];

  function saveGame() {
    stateStore.save(SAVE_KEY,state,trueVision);
    updateMainProgress();
  }
  function clearSave() {
    stateStore.clear(SAVE_KEY);
  }

  function applyLocale() {
    copy = window.SIGNAL_VEIL_LOCALES[locale] || window.SIGNAL_VEIL_LOCALES.en;
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.title = `${t("title")} | WeightPlay`;
    document.querySelectorAll("[data-t]").forEach(node => node.textContent = t(node.dataset.t));
    document.querySelectorAll("[data-t-alt]").forEach(node => node.setAttribute("alt", t(node.dataset.tAlt)));
    document.querySelectorAll("[data-t-aria]").forEach(node => node.setAttribute("aria-label", t(node.dataset.tAria)));
    nodes.locale.value = locale;
    updateHud();
    updateObjective();
    renderInventory();
    window.dispatchEvent(new CustomEvent("wonder:locale-change",{detail:{locale}}));
  }
  Object.entries(window.SIGNAL_VEIL_LOCALES).forEach(([code,data]) => {
    const option = document.createElement("option"); option.value=code; option.textContent=data.label; nodes.locale.append(option);
  });
  nodes.locale.addEventListener("change", () => {
    const next = nodes.locale.value;
    try { localStorage.setItem("weightPlayLocale",next); } catch {}
    if (/^https?:$/.test(location.protocol)) {
      location.href = `/${LOCALE_PATHS[next]}/games/signal-veil/${location.search}${location.hash}`;
    } else {
      locale=next; applyLocale();
    }
  });

  function updateMainProgress() {
    nodes.progress.textContent = `${t("questProgress")} ${completedQuestCount()} / ${QUESTS.length}`;
  }
  function zoneKey() {
    if(state.mapId===MAP_LUNAR)return "zoneLunar";
    if(state.mapId===MAP_ASHFALL)return "zoneAshfall";
    if(state.mapId===MAP_MOONFALL)return "zoneMoonfall";
    if (state.x < 1024) return "zoneTown";
    if (state.x < 2048) return "zoneForest";
    return "zoneLab";
  }
  function firstMapDefeated(){return [...state.defeated].filter(id=>id<enemySeeds.length).length}
  function moonfallDefeated(){return [...state.defeated].filter(id=>id>=enemySeeds.length&&id<enemySeeds.length+moonfallEnemySeeds.length).length}
  function ashfallDefeated(){
    const start=enemySeeds.length+moonfallEnemySeeds.length;
    return [...state.defeated].filter(id=>id>=start&&id<start+ashfallEnemySeeds.length).length;
  }
  function lunarDefeated(){
    const start=enemySeeds.length+moonfallEnemySeeds.length+ashfallEnemySeeds.length;
    return [...state.defeated].filter(id=>id>=start).length;
  }
  function questComplete(quest){
    switch(quest.type){
      case "talk":return state.talked.has(quest.target);
      case "witnessReport":return state.witnessReport;
      case "visit":return Boolean(state.discoveries[quest.target]);
      case "defeatFirst":return firstMapDefeated()>=quest.target;
      case "chest":return state.chests.has(quest.target);
      case "bossEncounter":return state.discoveries.boss;
      case "bossDefeated":return state.bossDefeated;
      case "chapter2Started":return state.chapter2Started;
      case "defeatMoonfall":return moonfallDefeated()>=quest.target;
      case "relay":return state.relays.has(quest.target);
      case "storyComplete":return state.storyComplete;
      case "chapter3Started":return state.chapter3Started;
      case "ashfallFinding":return state.ashfallFindings.has(quest.target);
      case "defeatAshfall":return ashfallDefeated()>=quest.target;
      case "ashfallChoice":return Boolean(state.ashfallChoice);
      case "ashfallReturned":return state.ashfallReturned;
      case "chapter3Complete":return state.chapter3Complete;
      case "chapter4Started":return state.chapter4Started;
      case "lunarFinding":return state.lunarFindings.has(quest.target);
      case "defeatLunar":return lunarDefeated()>=quest.target;
      case "lunarChoice":return Boolean(state.lunarChoice);
      case "chapter4Complete":return state.chapter4Complete;
      default:return false;
    }
  }
  function completedQuestCount(){
    let count=0;
    for(const quest of QUESTS){if(!questComplete(quest))break;count++}
    return count;
  }
  function activeQuest(){
    const index=QUESTS.findIndex(quest=>!questComplete(quest));
    return index<0?null:{quest:QUESTS[index],index};
  }
  function questPlace(quest){
    if(quest.type==="visit"){
      return t({forest:"zoneForest",lab:"zoneLab",moonfall:"zoneMoonfall",ashfall:"zoneAshfall",lunar:"zoneLunar"}[quest.target]);
    }
    return t(quest.place||"zoneTown");
  }
  function questTitle(quest){
    if(quest.type==="talk")return t("questInterviewTitle",{name:(copy.npcNames||en.npcNames)[quest.target]});
    if(quest.type==="witnessReport")return t("questWitnessReportTitle");
    if(quest.type==="visit")return t("questVisitTitle",{place:questPlace(quest)});
    if(quest.type==="defeatFirst"||quest.type==="defeatMoonfall")return t("questThreatTitle",{place:questPlace(quest),target:questDisplayTarget(quest)});
    if(quest.type==="chest")return t("questRecoverTitle",{item:t(`${quest.target}Name`)});
    if(quest.type==="bossEncounter")return t("questCommanderTitle");
    if(quest.type==="bossDefeated")return t("questVeilTitle");
    if(quest.type==="chapter2Started")return t("questAnswerTitle");
    if(quest.type==="relay")return t("questDecodeTitle",{record:t(quest.name)});
    if(quest.type==="chapter3Started")return t("questAnswerTitle");
    if(quest.type==="ashfallFinding")return t("questDecodeTitle",{record:t(quest.name)});
    if(quest.type==="defeatAshfall")return t("questThreatTitle",{place:questPlace(quest),target:questDisplayTarget(quest)});
    if(quest.type==="ashfallChoice")return t("questProofTitle");
    if(quest.type==="ashfallReturned")return t("questAnswerTitle");
    if(quest.type==="chapter3Complete")return t("questProofTitle");
    if(quest.type==="chapter4Started")return t("questAnswerTitle");
    if(quest.type==="lunarFinding")return t("questDecodeTitle",{record:t(quest.name)});
    if(quest.type==="defeatLunar")return t("questThreatTitle",{place:questPlace(quest),target:questDisplayTarget(quest)});
    if(quest.type==="lunarChoice"||quest.type==="chapter4Complete")return t("questProofTitle");
    return t("questProofTitle");
  }
  function questDisplayTarget(quest){
    if(quest.type==="defeatMoonfall")return moonfallEnemySeeds.length;
    if(quest.type==="defeatAshfall")return ashfallEnemySeeds.length;
    if(quest.type==="defeatLunar")return lunarEnemySeeds.length;
    if(quest.type==="defeatFirst")return quest.place==="zoneForest"?8:enemySeeds.length;
    return quest.target;
  }
  function questObjective(quest){
    if(quest.type==="talk")return t("questTalkObjective",{name:(copy.npcNames||en.npcNames)[quest.target]});
    if(quest.type==="witnessReport")return t("questWitnessReportObjective");
    if(quest.type==="visit")return t("questVisitObjective",{place:questPlace(quest)});
    if(quest.type==="defeatFirst")return t("questDefeatObjective",{n:firstMapDefeated(),target:questDisplayTarget(quest),place:questPlace(quest)});
    if(quest.type==="defeatMoonfall")return t("questDefeatObjective",{n:moonfallDefeated(),target:questDisplayTarget(quest),place:questPlace(quest)});
    if(quest.type==="chest")return t("questRecoverObjective",{item:t(`${quest.target}Name`)});
    if(quest.type==="bossEncounter")return t("questFindCommanderObjective");
    if(quest.type==="bossDefeated")return t("objectiveBoss");
    if(quest.type==="chapter2Started")return t("objectiveReturnOrla");
    if(quest.type==="relay")return t("questRelayObjective",{record:t(quest.name)});
    if(quest.type==="chapter3Started")return t("objectiveAshfallBriefing");
    if(quest.type==="ashfallFinding")return t("questAshfallEvidenceObjective",{evidence:t(quest.name)});
    if(quest.type==="defeatAshfall")return t("questDefeatObjective",{n:ashfallDefeated(),target:questDisplayTarget(quest),place:questPlace(quest)});
    if(quest.type==="ashfallChoice")return t("objectiveAshfallChoice");
    if(quest.type==="ashfallReturned")return t("objectiveAshfallReturn");
    if(quest.type==="chapter3Complete")return t("objectiveAshfallFinal");
    if(quest.type==="chapter4Started")return t("objectiveLunarBriefing");
    if(quest.type==="lunarFinding")return t("questLunarEvidenceObjective",{evidence:t(quest.name)});
    if(quest.type==="defeatLunar")return t("questDefeatObjective",{n:lunarDefeated(),target:questDisplayTarget(quest),place:questPlace(quest)});
    if(quest.type==="lunarChoice")return t("objectiveLunarChoice");
    if(quest.type==="chapter4Complete")return t("objectiveLunarReturn");
    return t("objectiveFinalReturn");
  }
  function currentQuestText(){
    const active=activeQuest();
    if(!active)return t("questsComingSoon");
    return `${active.index+1}/${QUESTS.length} · ${questTitle(active.quest)} — ${questObjective(active.quest)}`;
  }
  function updateObjective() {
    const text=currentQuestText();
    nodes.objective.textContent=text;
    nodes.pauseObjective.textContent=text;
  }
  function updateHud() {
    nodes.level.textContent=state.level;
    nodes.hpFill.style.width=`${clamp(state.hp/state.maxHp*100,0,100)}%`;
    nodes.hpText.textContent=`${Math.ceil(state.hp)} / ${state.maxHp}`;
    const need=30+(state.level-1)*22;
    nodes.xpFill.style.width=`${clamp(state.xp/need*100,0,100)}%`;
    nodes.xpText.textContent=`${state.xp} / ${need}`;
    nodes.visionState.textContent=trueVision?t("trueVision"):t("normalVision");
    nodes.visionState.classList.toggle("active",trueVision);
    nodes.vision.classList.toggle("ready",state.visionUnlocked);
    nodes.skill.classList.toggle("cooldown",skillCooldown>0);
    nodes.zone.textContent=t(zoneKey());
    nodes.pauseLevel.textContent=state.level;
    nodes.pauseZone.textContent=t(zoneKey());
    canvas.dataset.playerX=String(Math.round(state.x));
    canvas.dataset.playerY=String(Math.round(state.y));
    canvas.dataset.facing=state.facing;
    canvas.dataset.enemiesDefeated=String(firstMapDefeated());
    canvas.dataset.moonfallEnemiesDefeated=String(moonfallDefeated());
    canvas.dataset.ashfallEnemiesDefeated=String(ashfallDefeated());
    canvas.dataset.lunarEnemiesDefeated=String(lunarDefeated());
    canvas.dataset.witnesses=String(state.talked.size);
    canvas.dataset.totalEnemies=String(enemySeeds.length);
    canvas.dataset.totalMoonfallEnemies=String(moonfallEnemySeeds.length);
    canvas.dataset.totalAshfallEnemies=String(ashfallEnemySeeds.length);
    canvas.dataset.totalLunarEnemies=String(lunarEnemySeeds.length);
    canvas.dataset.totalNpcs=String(npcs.length);
    canvas.dataset.bossHp=String(Math.max(0,Math.ceil(boss?.hp ?? 0)));
    canvas.dataset.vision=trueVision?"true":"normal";
    canvas.dataset.mapId=state.mapId;
    canvas.dataset.relays=String(state.relays.size);
    canvas.dataset.storyComplete=state.storyComplete?"true":"false";
    canvas.dataset.chapter3Complete=state.chapter3Complete?"true":"false";
    canvas.dataset.ashfallFindings=String(state.ashfallFindings.size);
    canvas.dataset.ashfallChoice=state.ashfallChoice||"";
    canvas.dataset.chapter4Complete=state.chapter4Complete?"true":"false";
    canvas.dataset.lunarFindings=String(state.lunarFindings.size);
    canvas.dataset.lunarChoice=state.lunarChoice||"";
    canvas.dataset.questsCompleted=String(completedQuestCount());
    canvas.dataset.totalQuests=String(QUESTS.length);
    canvas.dataset.walking=playerMoving?"true":"false";
    canvas.dataset.walkCycle=walkCycle.toFixed(2);
  }
  function renderInventory() {
    const slots={
      weapon:{name:"weaponName",effect:`+5 ${t("statAtk")}`,nameNode:nodes.weaponName,effectNode:nodes.weaponEffect,toggle:nodes.weaponToggle},
      armor:{name:"armorName",effect:`+4 ${t("statDef")}`,nameNode:nodes.armorName,effectNode:nodes.armorEffect,toggle:nodes.armorToggle},
      accessory:{name:"accessoryName",effect:`+2 ${t("statAtk")} · +1 ${t("statDef")}`,nameNode:nodes.accessoryName,effectNode:nodes.accessoryEffect,toggle:nodes.accessoryToggle},
    };
    for(const [slot,view] of Object.entries(slots)){
      const owned=Boolean(state.equipment[slot]),equipped=owned&&Boolean(state.equipped[slot]);
      view.nameNode.textContent=owned?t(view.name):t("none");
      view.effectNode.textContent=view.effect;
      view.toggle.disabled=!owned;
      view.toggle.textContent=!owned?t("none"):t(equipped?"unequip":"equip");
      view.toggle.closest(".equipment-slot")?.classList.toggle("is-equipped",equipped);
      view.toggle.setAttribute("aria-pressed",equipped?"true":"false");
    }
    nodes.stats.innerHTML=`<span><b>${t("statHp")}</b><br>${state.maxHp}</span><span><b>${t("statAtk")}</b><br>${effectiveAttack()}</span><span><b>${t("statDef")}</b><br>${effectiveDefense()}</span>`;
    const diamonds=window.WeightPlayWallet?.read?.().diamonds || 0;
    nodes.diamondBalance.textContent=String(diamonds);
    nodes.buyAnchor.disabled=Boolean(state.signalAnchor);
    nodes.buyAnchor.textContent=state.signalAnchor?t("anchorOwned"):t("anchorBuy");
    nodes.anchorStatus.textContent=state.signalAnchor?t("anchorPermanent"):template(t("anchorBalance"),{n:diamonds});
  }
  function toggleEquipment(slot){
    if(!state.equipment[slot])return;
    state.equipped[slot]=!state.equipped[slot];
    renderInventory();updateHud();saveGame();
    showToast(t(state.equipped[slot]?"equipmentEquipped":"equipmentRemoved",{item:t(`${slot}Name`)}),1800);
  }
  function buySignalAnchor(){
    if(state.signalAnchor)return;
    const wallet=window.WeightPlayWallet;
    if(!wallet?.spendDiamonds?.(5)){nodes.anchorStatus.textContent=template(t("anchorNeed"),{n:wallet?.read?.().diamonds || 0});return}
    state.signalAnchor=true;state.maxHp+=12;state.hp=Math.min(state.maxHp,state.hp+12);
    saveGame();renderInventory();updateHud();showToast(t("anchorInstalled"),2200);
    window.WonderAnalytics?.track?.("diamond_spend",{game_id:"signal-veil",item:"signal_anchor",cost:5,balance:wallet.read().diamonds});
  }
  function effectiveAttack(){return state.attack+(state.equipped.weapon?5:0)+(state.equipped.accessory?2:0)}
  function effectiveDefense(){return state.defense+(state.equipped.armor?4:0)+(state.equipped.accessory?1:0)}

  function showToast(message,duration=1800) {
    nodes.toast.textContent=message; nodes.toast.classList.add("show");
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>nodes.toast.classList.remove("show"),duration);
  }
  function showCurrentQuest(){
    showToast(state.chapter4Complete?t("questsComingSoon"):`${t("currentQuest")} · ${nodes.objective.textContent}`,3400);
  }
  function setPanel(panel) {
    [nodes.pause,nodes.inventory,nodes.leave,nodes.result].forEach(item => item.hidden=item!==panel);
    nodes.overlay.hidden=!panel;
    paused=Boolean(panel);
    if (panel) setTimeout(()=>panel.querySelector("button:not([disabled])")?.focus(),0);
    else canvas.focus({preventScroll:true});
  }
  function showDialogue(index) {
    if(index===0&&state.bossDefeated){
      let lineKey="chapter2After";
      if(!state.chapter2Started){
        state.chapter2Started=true;lineKey="chapter2Briefing";showToast(t("moonfallUnlocked"),2600);
      }else if(moonfallDefeated()>=moonfallEnemySeeds.length&&state.relays.size>=RELAY_NODES.length&&!state.storyComplete){
        state.storyComplete=true;lineKey="chapter2Debrief";playTone(820,.3);
      }else if(state.storyComplete&&!state.chapter3Started){
        state.chapter3Started=true;lineKey="chapter3Briefing";showToast(t("ashfallUnlocked"),2600);
      }else if(state.ashfallReturned&&!state.chapter3Complete){
        state.chapter3Complete=true;lineKey=state.ashfallChoice==="broadcast"?"chapter3DebriefBroadcast":"chapter3DebriefProtect";playTone(880,.35);
      }else if(state.chapter3Complete&&!state.chapter4Started){
        state.chapter4Started=true;lineKey=state.ashfallChoice==="broadcast"?"chapter4BriefingBroadcast":"chapter4BriefingProtect";showToast(t("lunarUnlocked"),2600);
      }else if(state.lunarReturned&&!state.chapter4Complete){
        state.chapter4Complete=true;lineKey=state.lunarChoice==="answer"?"chapter4DebriefAnswer":"chapter4DebriefShield";playTone(920,.4);
      }else if(state.chapter4Started){
        lineKey=state.chapter4Complete?"chapter4After":"chapter4Reminder";
      }else if(state.chapter3Started){
        lineKey="chapter3Reminder";
      }
      currentDialogue=`story-${lineKey}`;paused=true;
      nodes.speaker.textContent=(copy.npcNames||en.npcNames)[0] || en.npcNames[0];
      nodes.dialogueText.textContent=t(lineKey);
      nodes.dialogue.hidden=false;nodes.dialogueNext.focus();
      saveGame();updateObjective();updateHud();
      return;
    }
    if(index===0&&state.talked.size>=10&&!state.witnessReport){
      state.witnessReport=true;currentDialogue="story-witness-report";paused=true;
      nodes.speaker.textContent=(copy.npcNames||en.npcNames)[0] || en.npcNames[0];
      nodes.dialogueText.textContent=t("witnessDebrief");
      nodes.dialogue.hidden=false;nodes.dialogueNext.focus();
      showToast(t("forestRouteUnlocked"),2200);saveGame();updateObjective();updateHud();
      return;
    }
    const wasNew=!state.talked.has(index);
    if (wasNew) state.talked.add(index);
    if (index===0 && !state.visionUnlocked) {
      state.visionUnlocked=true; showToast(t("visionUnlocked"),2800);
    }
    currentDialogue=index; paused=true;
    nodes.speaker.textContent=(copy.npcNames||en.npcNames)[index] || en.npcNames[index];
    nodes.dialogueText.textContent=(copy.npcLines||en.npcLines)[index] || en.npcLines[index];
    nodes.dialogue.hidden=false; nodes.dialogueNext.focus();
    if (wasNew) { saveGame(); updateObjective(); updateHud(); }
  }
  function closeDialogue() {
    nodes.dialogue.hidden=true;nodes.dialogueChoices.hidden=true;nodes.dialogueNext.hidden=false;currentDialogue=null;paused=false;canvas.focus({preventScroll:true});
  }

  function resizeCanvas() {
    const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
    const width=Math.max(1,Math.round(rect.width*dpr)),height=Math.max(1,Math.round(rect.height*dpr));
    if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;ctx.imageSmoothingEnabled=false}
  }
  function viewTransform() {
    const scale=Math.max(canvas.width/BASE_VIEW.width,canvas.height/BASE_VIEW.height);
    const drawW=BASE_VIEW.width*scale,drawH=BASE_VIEW.height*scale;
    return {scale,ox:(canvas.width-drawW)/2,oy:(canvas.height-drawH)/2};
  }
  function camera() {
    return {x:clamp(state.x-BASE_VIEW.width/2,0,WORLD.width-BASE_VIEW.width),y:clamp(state.y-BASE_VIEW.height/2,0,WORLD.height-BASE_VIEW.height)};
  }
  function drawAtlas(image,index,columns,rows,x,y,w,h,alpha=1) {
    if(!image.complete||!image.naturalWidth)return;
    const cellW=image.naturalWidth/columns,cellH=image.naturalHeight/rows;
    const col=index%columns,row=Math.floor(index/columns);
    ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(image,col*cellW,row*cellH,cellW,cellH,x-w/2,y-h/2,w,h);ctx.restore();
  }
  function drawAtlasRotated(image,index,columns,rows,x,y,w,h,rotation,alpha=1) {
    if(!image.complete||!image.naturalWidth)return;
    const cellW=image.naturalWidth/columns,cellH=image.naturalHeight/rows;
    const col=index%columns,row=Math.floor(index/columns);
    ctx.save();
    ctx.globalAlpha=alpha;
    ctx.translate(x,y);
    ctx.rotate(rotation);
    ctx.drawImage(image,col*cellW,row*cellH,cellW,cellH,-w/2,-h/2,w,h);
    ctx.restore();
  }
  function drawSprite(index,x,y,maxWidth,maxHeight,alpha=1) {
    if(!atlas.sprites.complete||!atlas.sprites.naturalWidth)return;
    const definition=SPRITE_FRAMES[index];
    const [sourceX,sourceY,sourceWidth,sourceHeight]=definition.bounds||definition;
    const parts=definition.parts||[definition];
    const scale=Math.min(maxWidth/sourceWidth,maxHeight/sourceHeight);
    const width=sourceWidth*scale,height=sourceHeight*scale;
    ctx.save();
    ctx.globalAlpha=alpha;
    for(const [partX,partY,partWidth,partHeight] of parts){
      ctx.drawImage(
        atlas.sprites,partX,partY,partWidth,partHeight,
        x-width/2+(partX-sourceX)*scale,y-height/2+(partY-sourceY)*scale,
        partWidth*scale,partHeight*scale
      );
    }
    ctx.restore();
  }
  function drawWorld(cam) {
    if(atlas.world.complete&&atlas.world.naturalWidth){
      if(state.mapId===MAP_SIGNAL_TOWN)ctx.drawImage(atlas.world,0,0,atlas.world.naturalWidth,atlas.world.naturalHeight,-cam.x,-cam.y,WORLD.width,WORLD.height);
      else{
        ctx.save();ctx.translate(WORLD.width-cam.x,-cam.y);ctx.scale(-1,1);
        ctx.drawImage(atlas.world,0,0,atlas.world.naturalWidth,atlas.world.naturalHeight,0,0,WORLD.width,WORLD.height);ctx.restore();
      }
    }
    else {ctx.fillStyle="#08222b";ctx.fillRect(0,0,BASE_VIEW.width,BASE_VIEW.height)}
    MAP_OBJECTS[state.mapId].forEach(object=>drawAtlas(atlas.objects,object.sprite,4,3,object.x-cam.x,object.y-cam.y,object.w,object.h));
    if(state.mapId===MAP_MOONFALL){
      const glow=ctx.createLinearGradient(0,0,BASE_VIEW.width,BASE_VIEW.height);
      glow.addColorStop(0,"#38145b42");glow.addColorStop(.5,"#071b4250");glow.addColorStop(1,"#3a0a4d4f");
      ctx.fillStyle=glow;ctx.fillRect(0,0,BASE_VIEW.width,BASE_VIEW.height);
      ctx.strokeStyle=trueVision?"#65fff04d":"#b66cff2c";ctx.lineWidth=2;ctx.setLineDash([6,22]);
      for(let y=90;y<BASE_VIEW.height;y+=72){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(BASE_VIEW.width,y-28);ctx.stroke()}
      ctx.setLineDash([]);
    }
    if(state.mapId===MAP_ASHFALL){
      const ash=ctx.createLinearGradient(0,0,BASE_VIEW.width,BASE_VIEW.height);
      ash.addColorStop(0,"#681d164f");ash.addColorStop(.48,"#27111962");ash.addColorStop(1,"#b8561740");
      ctx.fillStyle=ash;ctx.fillRect(0,0,BASE_VIEW.width,BASE_VIEW.height);
      ctx.strokeStyle=trueVision?"#ffdd7970":"#ff78413d";ctx.lineWidth=2;ctx.setLineDash([18,10,3,10]);
      for(let x=-80;x<BASE_VIEW.width+80;x+=110){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+180,BASE_VIEW.height);ctx.stroke()}
      ctx.setLineDash([]);
    }
    if(state.mapId===MAP_LUNAR){
      const lunar=ctx.createRadialGradient(BASE_VIEW.width*.5,BASE_VIEW.height*.45,30,BASE_VIEW.width*.5,BASE_VIEW.height*.45,620);
      lunar.addColorStop(0,"#143a5250");lunar.addColorStop(.55,"#10152f70");lunar.addColorStop(1,"#050817a8");
      ctx.fillStyle=lunar;ctx.fillRect(0,0,BASE_VIEW.width,BASE_VIEW.height);
      ctx.strokeStyle=trueVision?"#8fffe86b":"#7796ff42";ctx.lineWidth=2;
      for(let r=70;r<520;r+=86){ctx.beginPath();ctx.arc(BASE_VIEW.width*.5,BASE_VIEW.height*.45,r,0,Math.PI*2);ctx.stroke()}
    }
    if(trueVision&&state.mapId===MAP_SIGNAL_TOWN){
      ctx.save();ctx.globalCompositeOperation="screen";ctx.strokeStyle="#45ffff99";ctx.lineWidth=8;ctx.setLineDash([10,14]);
      ctx.beginPath();ctx.moveTo(930-cam.x,520-cam.y);ctx.bezierCurveTo(1400-cam.x,260-cam.y,1750-cam.x,780-cam.y,2070-cam.x,520-cam.y);ctx.stroke();ctx.restore();
    }
  }
  function portalVisible(portal){
    if(portal.requires==="chapter2")return state.chapter2Started;
    if(portal.requires==="chapter3")return state.chapter3Started;
    if(portal.requires==="chapter4")return state.chapter4Started;
    return true;
  }
  function drawMapFeatures(cam) {
    MAP_PORTALS[state.mapId].filter(portalVisible).forEach(portal=>{
      const pulse=96+Math.sin(performance.now()/180)*8;
      ctx.save();ctx.globalAlpha=.34;ctx.fillStyle="#62f7ff";ctx.beginPath();ctx.arc(portal.x-cam.x,portal.y-cam.y,pulse*.46,0,Math.PI*2);ctx.fill();ctx.restore();
      drawAtlas(atlas.items,15,4,4,portal.x-cam.x,portal.y-cam.y,pulse,pulse);
    });
    if(state.mapId===MAP_MOONFALL)RELAY_NODES.forEach(relay=>{
      const active=state.relays.has(relay.id);
      drawAtlas(atlas.items,active?13:relay.index,4,4,relay.x-cam.x,relay.y-cam.y,active?88:78,active?88:78,active?1:.9);
      ctx.strokeStyle=active?"#70ffe4":"#c681ff";ctx.lineWidth=3;ctx.beginPath();
      ctx.arc(relay.x-cam.x,relay.y-cam.y,42+Math.sin(performance.now()/220+relay.x)*4,0,Math.PI*2);ctx.stroke();
    });
    if(state.mapId===MAP_ASHFALL)ASHFALL_NODES.forEach((node,index)=>{
      const active=state.ashfallFindings.has(node.id),available=activeQuest()?.quest.id===node.questId;
      if(node.npc)drawAtlas(atlas.npcs,7,5,2,node.x-cam.x,node.y-cam.y,76,82,active ? .7 : 1);
      else drawAtlas(atlas.items,active?13:node.index,4,4,node.x-cam.x,node.y-cam.y,82,82,available||active?1:.42);
      if(available){ctx.strokeStyle="#ffd66b";ctx.lineWidth=3;ctx.beginPath();ctx.arc(node.x-cam.x,node.y-cam.y,44+Math.sin(performance.now()/180)*4,0,Math.PI*2);ctx.stroke()}
    });
    if(state.mapId===MAP_LUNAR)LUNAR_NODES.forEach(node=>{
      const active=state.lunarFindings.has(node.id);
      const available=activeQuest()?.quest.id===node.questId||(node.id==="core"&&activeQuest()?.quest.type==="lunarChoice");
      drawAtlas(atlas.items,active?13:node.index,4,4,node.x-cam.x,node.y-cam.y,84,84,available||active?1:.38);
      if(available){ctx.strokeStyle="#8fffe8";ctx.lineWidth=3;ctx.beginPath();ctx.arc(node.x-cam.x,node.y-cam.y,45+Math.sin(performance.now()/170)*5,0,Math.PI*2);ctx.stroke()}
    });
  }
  function drawPlayer(cam) {
    const x=state.x-cam.x,y=state.y-cam.y;
    const stride=playerMoving?Math.sin(walkCycle):0;
    const bob=playerMoving?Math.abs(Math.sin(walkCycle))*4:Math.sin(performance.now()/520)*.45;
    ctx.save();ctx.fillStyle="#02080c70";ctx.beginPath();ctx.ellipse(x,y+31,playerMoving?25:22,8,0,0,Math.PI*2);ctx.fill();ctx.restore();
    const facingIndex={down:0,left:1,right:2,up:3}[state.facing]||0;
    ctx.save();ctx.translate(x,y-bob);ctx.rotate(stride*.035);ctx.scale(1-stride*.018,1+Math.abs(stride)*.025);
    drawSprite(facingIndex,0,0,78,78,invulnerability>0&&Math.floor(invulnerability*12)%2?0.35:1);ctx.restore();
  }
  function drawEntityBars(entity,cam,width=62) {
    const ratio=clamp(entity.hp/entity.maxHp,0,1),x=entity.x-cam.x-width/2,y=entity.y-cam.y-50;
    ctx.fillStyle="#08141dcc";ctx.fillRect(x,y,width,7);ctx.fillStyle=entity===boss?"#ffb333":"#ef6060";ctx.fillRect(x,y,width*ratio,7);
  }
  function render() {
    resizeCanvas();
    const tr=viewTransform(),cam=camera();
    ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();ctx.translate(tr.ox,tr.oy);ctx.scale(tr.scale,tr.scale);ctx.beginPath();ctx.rect(0,0,BASE_VIEW.width,BASE_VIEW.height);ctx.clip();
    drawWorld(cam);
    drawMapFeatures(cam);
    if(state.mapId===MAP_SIGNAL_TOWN)chests.forEach(chest=>{
      if(state.chests.has(chest.id)||(chest.hidden&&!trueVision))return;
      drawAtlas(atlas.items,6,4,4,chest.x-cam.x,chest.y-cam.y,70,70);
      if(trueVision){ctx.strokeStyle="#4ff4f4";ctx.lineWidth=3;ctx.strokeRect(chest.x-cam.x-36,chest.y-cam.y-36,72,72)}
    });
    if(state.mapId===MAP_SIGNAL_TOWN)npcs.forEach((npc,index)=>{
      if(trueVision&&npc.reveal) drawSprite(8+(index%4),npc.x-cam.x,npc.y-cam.y,80,80);
      else drawAtlas(atlas.npcs,index,5,2,npc.x-cam.x,npc.y-cam.y,76,82);
      const storyReady=index===0&&((state.talked.size>=10&&!state.witnessReport)||(state.bossDefeated&&!state.chapter2Started)||(moonfallDefeated()>=moonfallEnemySeeds.length&&state.relays.size>=RELAY_NODES.length&&!state.storyComplete));
      if(!state.talked.has(index)||storyReady){ctx.fillStyle="#ffc550";ctx.font="900 23px sans-serif";ctx.textAlign="center";ctx.fillText("!",npc.x-cam.x,npc.y-cam.y-47)}
    });
    enemies.forEach(enemy=>{
      if(enemy.dead||enemy.mapId!==state.mapId)return;
      if(enemy.hidden&&!trueVision){
        const pulse=22+Math.sin(performance.now()/180)*5;
        ctx.strokeStyle="#49f5ff99";ctx.lineWidth=3;ctx.beginPath();ctx.arc(enemy.x-cam.x,enemy.y-cam.y,pulse,0,Math.PI*2);ctx.stroke();
        return;
      }
      drawSprite(enemy.sprite,enemy.x-cam.x,enemy.y-cam.y,78,78);
      drawEntityBars(enemy,cam,54);
    });
    if(state.mapId===MAP_SIGNAL_TOWN&&!boss.dead&&firstMapDefeated()>=15){
      drawSprite(boss.sprite,boss.x-cam.x,boss.y-cam.y,132,132);
      drawEntityBars(boss,cam,118);
    }
    projectiles.forEach(p=>drawAtlas(atlas.items,9,4,4,p.x-cam.x,p.y-cam.y,44,44));
    enemyProjectiles.forEach(p=>drawAtlas(atlas.items,10,4,4,p.x-cam.x,p.y-cam.y,38,38));
    effects.forEach(f=>drawAtlas(atlas.items,f.index,4,4,f.x-cam.x,f.y-cam.y,f.size,f.size,f.life/.35));
    drawPlayer(cam);
    if(swingTimer>0) {
      const vector=facingVector();
      const rotation={left:0,up:Math.PI/2,right:Math.PI,down:-Math.PI/2}[state.facing];
      drawAtlasRotated(atlas.items,8,4,4,state.x-cam.x+vector.x*48,state.y-cam.y+vector.y*48,76,76,rotation);
    }
    drawEnemyGuide(cam);
    const target=nearestInteractable();
    canvas.dataset.interactAvailable=target&&!paused?target.kind:"";
    if(target&&!paused){
      ctx.fillStyle="#05141be8";ctx.strokeStyle="#4ff4f4";ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(INTERACT_PROMPT.x,INTERACT_PROMPT.y,INTERACT_PROMPT.w,INTERACT_PROMPT.h,14);ctx.fill();ctx.stroke();
      ctx.fillStyle="#fff";ctx.font="800 15px sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(target.kind==="npc"?t("talk"):t("interactAction"),BASE_VIEW.width/2,INTERACT_PROMPT.y+INTERACT_PROMPT.h/2);
    }
    if(state.mapId===MAP_SIGNAL_TOWN&&state.x<1000&&!state.witnessReport){ctx.fillStyle="#ffb13b";ctx.fillRect(996-cam.x,350-cam.y,8,340)}
    if(state.mapId===MAP_SIGNAL_TOWN&&state.x<2050&&!trueVision){ctx.fillStyle="#43eef255";ctx.fillRect(2038-cam.x,280-cam.y,14,480)}
    ctx.restore();
  }

  function facingVector(){return {up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}}[state.facing]}
  function collidesTerrain(x,y,radius=PLAYER_RADIUS) {
    return MAP_OBJECTS[state.mapId].some(object=>{
      const shape=object.collision,shapeX=object.x+(shape.ox||0),shapeY=object.y+(shape.oy||0);
      if(shape.kind==="circle")return Math.hypot(x-shapeX,y-shapeY)<radius+shape.r;
      const left=shapeX-shape.w/2,top=shapeY-shape.h/2;
      const nearestX=clamp(x,left,left+shape.w),nearestY=clamp(y,top,top+shape.h);
      return Math.hypot(x-nearestX,y-nearestY)<radius;
    });
  }
  function collidesSolidActor(x,y,radius=PLAYER_RADIUS) {
    const overlaps=(entity,entityRadius)=>Math.hypot(x-entity.x,y-entity.y)<radius+entityRadius;
    if(state.mapId===MAP_SIGNAL_TOWN&&npcs.some(npc=>overlaps(npc,22)))return true;
    if(state.mapId===MAP_SIGNAL_TOWN&&chests.some(chest=>!state.chests.has(chest.id)&&overlaps(chest,25)))return true;
    if(state.mapId===MAP_ASHFALL&&ASHFALL_NODES.some(node=>!state.ashfallFindings.has(node.id)&&overlaps(node,25)))return true;
    if(state.mapId===MAP_LUNAR&&LUNAR_NODES.some(node=>!state.lunarFindings.has(node.id)&&overlaps(node,25)))return true;
    if(enemies.some(enemy=>enemy.mapId===state.mapId&&!enemy.dead&&(!enemy.hidden||trueVision)&&overlaps(enemy,25)))return true;
    return state.mapId===MAP_SIGNAL_TOWN&&!boss.dead&&firstMapDefeated()>=15&&overlaps(boss,48);
  }
  function moveEntityWithTerrain(entity,dx,dy,radius=PLAYER_RADIUS,avoidActors=false) {
    const blocked=(x,y)=>collidesTerrain(x,y,radius)||(avoidActors&&collidesSolidActor(x,y,radius));
    const wasBlocked=blocked(entity.x,entity.y);
    const nextX=clamp(entity.x+dx,radius,WORLD.width-radius);
    if(!blocked(nextX,entity.y)||wasBlocked)entity.x=nextX;
    const nextY=clamp(entity.y+dy,radius,WORLD.height-radius);
    if(!blocked(entity.x,nextY)||wasBlocked)entity.y=nextY;
  }
  function drawEnemyGuide(cam) {
    if(state.mapId===MAP_SIGNAL_TOWN&&!state.witnessReport)return;
    const living=enemies.filter(enemy=>enemy.mapId===state.mapId&&!enemy.dead);
    if(!living.length)return;
    const target=living.sort((a,b)=>distance(state,a)-distance(state,b))[0];
    const screen={x:target.x-cam.x,y:target.y-cam.y};
    const margin=42,top=82,bottom=BASE_VIEW.height-42;
    const marker={x:clamp(screen.x,margin,BASE_VIEW.width-margin),y:clamp(screen.y,top,bottom)};
    const offscreen=screen.x<margin||screen.x>BASE_VIEW.width-margin||screen.y<top||screen.y>bottom;
    const color=target.hidden&&!trueVision?"#54f4ef":"#ffc550";
    ctx.save();
    ctx.translate(marker.x,marker.y);
    if(offscreen){
      const angle=Math.atan2(screen.y-marker.y,screen.x-marker.x);
      ctx.rotate(angle);ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(18,0);ctx.lineTo(-10,-11);ctx.lineTo(-10,11);ctx.closePath();ctx.fill();
    }else{
      ctx.strokeStyle=color;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,30+Math.sin(performance.now()/170)*4,0,Math.PI*2);ctx.stroke();
    }
    if(target.hidden&&!trueVision){
      ctx.rotate(offscreen?-Math.atan2(screen.y-marker.y,screen.x-marker.x):0);
      ctx.fillStyle="#06151ddd";ctx.beginPath();ctx.arc(0,0,12,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=color;ctx.font="900 15px sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("◉",0,1);
    }
    ctx.restore();
  }
  function movementVector() {
    let x=touchMove.x+(keys.has("arrowright")||keys.has("d")?1:0)-(keys.has("arrowleft")||keys.has("a")?1:0);
    let y=touchMove.y+(keys.has("arrowdown")||keys.has("s")?1:0)-(keys.has("arrowup")||keys.has("w")?1:0);
    const length=Math.hypot(x,y)||1;return {x:x/Math.max(1,length),y:y/Math.max(1,length)};
  }
  function setFacing(move) {
    if(Math.abs(move.x)>Math.abs(move.y))state.facing=move.x>0?"right":"left";
    else if(Math.abs(move.y)>.05)state.facing=move.y>0?"down":"up";
  }
  function movePlayer(dt) {
    const move=movementVector();
    if(Math.abs(move.x)+Math.abs(move.y)<.05){playerMoving=false;return}
    setFacing(move);const speed=185;
    const beforeX=state.x,beforeY=state.y;
    let nx=clamp(state.x+move.x*speed*dt,55,WORLD.width-55),ny=clamp(state.y+move.y*speed*dt,75,WORLD.height-55);
    if(state.mapId===MAP_SIGNAL_TOWN&&nx>995&&state.x<=1020&&!state.witnessReport){nx=995;showToast(t("lockedForest"))}
    if(state.mapId===MAP_SIGNAL_TOWN&&nx>2040&&state.x<=2070&&!trueVision){nx=2040;showToast(t("lockedLab"))}
    moveEntityWithTerrain(state,nx-state.x,ny-state.y,PLAYER_RADIUS,true);
    playerMoving=Math.hypot(state.x-beforeX,state.y-beforeY)>.1;
    if(playerMoving)walkCycle+=dt*10.5;
    if(state.mapId===MAP_SIGNAL_TOWN&&state.x>1024)markDiscovery("forest");
    if(state.mapId===MAP_SIGNAL_TOWN&&state.x>2048)markDiscovery("lab");
    if(state.mapId===MAP_ASHFALL)markDiscovery("ashfall");
    if(state.mapId===MAP_LUNAR)markDiscovery("lunar");
    if(state.mapId===MAP_SIGNAL_TOWN&&state.x>1060&&state.checkpoint.mapId===MAP_SIGNAL_TOWN&&state.checkpoint.x<1000)state.checkpoint={x:1080,y:520,mapId:MAP_SIGNAL_TOWN};
    if(state.mapId===MAP_SIGNAL_TOWN&&state.x>2100&&state.checkpoint.mapId===MAP_SIGNAL_TOWN&&state.checkpoint.x<2000)state.checkpoint={x:2110,y:520,mapId:MAP_SIGNAL_TOWN};
  }
  function markDiscovery(key){
    if(state.discoveries[key])return;
    state.discoveries[key]=true;saveGame();updateObjective();updateHud();
  }
  function nearestInteractable() {
    const candidates=[];
    if(state.mapId===MAP_SIGNAL_TOWN){
      const npc=npcs.map((value,index)=>({...value,kind:"npc",index})).filter(value=>distance(state,value)<82);
      candidates.push(...npc);
      candidates.push(...chests.filter(chest=>!state.chests.has(chest.id)&&(!chest.hidden||trueVision)&&distance(state,chest)<85).map(chest=>({...chest,kind:"chest"})));
    }else if(state.mapId===MAP_MOONFALL){
      candidates.push(...RELAY_NODES.map((relay,relayIndex)=>({...relay,relayIndex})).filter(relay=>!state.relays.has(relay.id)&&distance(state,relay)<92).map(relay=>({...relay,kind:"relay"})));
    }else if(state.mapId===MAP_ASHFALL){
      candidates.push(...ASHFALL_NODES.filter(node=>!state.ashfallFindings.has(node.id)&&activeQuest()?.quest.id===node.questId&&distance(state,node)<92).map(node=>({...node,kind:"ashfallNode"})));
    }else if(state.mapId===MAP_LUNAR){
      candidates.push(...LUNAR_NODES.filter(node=>{
        const quest=activeQuest()?.quest;
        return distance(state,node)<92&&((!state.lunarFindings.has(node.id)&&quest?.id===node.questId)||(node.id==="core"&&quest?.type==="lunarChoice"));
      }).map(node=>({...node,kind:"lunarNode"})));
    }
    candidates.push(...MAP_PORTALS[state.mapId].filter(portal=>portalVisible(portal)&&distance(state,portal)<105).map(portal=>({...portal,kind:"portal"})));
    return candidates.sort((a,b)=>distance(state,a)-distance(state,b))[0]||null;
  }
  function interact() {
    if(paused)return;const target=nearestInteractable();if(!target)return;
    canvas.dataset.lastAction="interact";
    canvas.dataset.lastInteractKind=target.kind;
    if(target.kind==="npc")showDialogue(target.index);
    else if(target.kind==="chest")openChest(target);
    else if(target.kind==="relay")activateRelay(target);
    else if(target.kind==="ashfallNode")activateAshfallNode(target);
    else if(target.kind==="lunarNode")activateLunarNode(target);
    else if(target.kind==="portal")switchMap(target);
  }
  function switchMap(portal) {
    state.mapId=portal.to;state.x=portal.spawnX;state.y=portal.spawnY;
    if(state.mapId===MAP_MOONFALL)state.discoveries.moonfall=true;
    if(state.mapId===MAP_ASHFALL)state.discoveries.ashfall=true;
    if(state.mapId===MAP_LUNAR)state.discoveries.lunar=true;
    if(portal.label==="portalToMoonfallReturn"&&state.ashfallChoice)state.ashfallReturned=true;
    if(portal.label==="portalToAshfallReturn"&&state.lunarChoice)state.lunarReturned=true;
    state.checkpoint={x:portal.spawnX,y:portal.spawnY,mapId:portal.to};
    projectiles.length=0;enemyProjectiles.length=0;effects.length=0;
    const arrivalKey=state.mapId===MAP_LUNAR?"lunarArrival":state.mapId===MAP_ASHFALL?(portal.label==="portalToAshfallReturn"?"lunarReturn":"ashfallArrival"):state.mapId===MAP_MOONFALL?(portal.label==="portalToMoonfallReturn"?"ashfallReturn":"moonfallArrival"):"townReturn";
    showToast(t(arrivalKey),2400);
    saveGame();updateObjective();updateHud();
  }
  function activateRelay(relay) {
    if(moonfallDefeated()<moonfallEnemySeeds.length){showToast(t("relayLocked"),2200);return}
    const expected=RELAY_NODES.find(node=>!state.relays.has(node.id));
    if(expected&&relay.id!==expected.id){showToast(t("relaySequenceLocked",{record:t(expected.name)}),2400);return}
    state.relays.add(relay.id);gainXp(24);playTone(660,.2);
    showToast(t("relayActivated",{n:state.relays.size}),2200);
    currentDialogue=`relay-${relay.id}`;paused=true;
    nodes.speaker.textContent=t(relay.name);
    nodes.dialogueText.textContent=t(`relayMessage${relay.relayIndex+1}`);
    nodes.dialogue.hidden=false;nodes.dialogueNext.focus();
    saveGame();updateObjective();updateHud();
  }
  function activateAshfallNode(node) {
    state.ashfallFindings.add(node.id);gainXp(node.id==="core"?36:20);playTone(node.id==="core"?760:610,.2);
    currentDialogue=`ashfall-${node.id}`;paused=true;
    nodes.speaker.textContent=t(node.name);
    nodes.dialogueText.textContent=t(node.message);
    nodes.dialogue.hidden=false;
    if(node.id==="core"){
      nodes.dialogueNext.hidden=true;nodes.dialogueChoices.hidden=false;nodes.broadcastChoice.focus();
      nodes.broadcastChoice.textContent=t("ashfallBroadcast");
      nodes.protectChoice.textContent=t("ashfallProtect");
    }else nodes.dialogueNext.focus();
    saveGame();updateObjective();updateHud();
  }
  function chooseAshfall(choice) {
    if(state.ashfallChoice)return;
    state.ashfallChoice=choice;
    if(choice==="broadcast")state.attack+=2;
    else {state.defense+=2;state.maxHp+=8;state.hp=Math.min(state.maxHp,state.hp+8)}
    saveGame();updateObjective();updateHud();
    showToast(t(choice==="broadcast"?"ashfallBroadcastChosen":"ashfallProtectChosen"),2600);
    closeDialogue();
  }
  function activateLunarNode(node) {
    const choosing=node.id==="core"&&activeQuest()?.quest.type==="lunarChoice";
    if(!choosing){
      state.lunarFindings.add(node.id);gainXp(node.id==="core"?42:24);playTone(node.id==="core"?820:680,.22);
    }
    currentDialogue=choosing?"lunar-choice":`lunar-${node.id}`;paused=true;
    nodes.speaker.textContent=t(node.name);
    nodes.dialogueText.textContent=t(choosing?"lunarChoiceMessage":node.message);
    nodes.dialogue.hidden=false;
    if(choosing){
      nodes.dialogueNext.hidden=true;nodes.dialogueChoices.hidden=false;
      nodes.broadcastChoice.textContent=t("lunarAnswer");
      nodes.protectChoice.textContent=t("lunarShield");
      nodes.broadcastChoice.focus();
    }else nodes.dialogueNext.focus();
    saveGame();updateObjective();updateHud();
  }
  function chooseLunar(choice) {
    if(state.lunarChoice)return;
    state.lunarChoice=choice;
    if(choice==="answer"){state.attack+=1;state.defense+=1}
    else {state.maxHp+=12;state.hp=Math.min(state.maxHp,state.hp+12)}
    saveGame();updateObjective();updateHud();
    showToast(t(choice==="answer"?"lunarAnswerChosen":"lunarShieldChosen"),2800);
    closeDialogue();
  }
  function openChest(chest) {
    state.chests.add(chest.id);state.equipment[chest.item]=true;state.equipped[chest.item]=true;
    if(chest.item==="armor")state.hp=Math.min(state.maxHp,state.hp+12);
    showToast(t("chest",{item:t(`${chest.item}Name`)}),2400);renderInventory();saveGame();
  }
  function attack() {
    if(paused||attackCooldown>0)return;
    canvas.dataset.lastAction="attack";
    canvas.dataset.slashDirection=state.facing;
    attackCooldown=.32;swingTimer=.18;playTone(150,.07);const v=facingVector(),point={x:state.x+v.x*62,y:state.y+v.y*62};
    enemies.forEach(enemy=>{if(enemy.mapId===state.mapId&&!enemy.dead&&(!enemy.hidden||trueVision)&&distance(point,enemy)<78)damageEnemy(enemy,effectiveAttack())});
    if(state.mapId===MAP_SIGNAL_TOWN&&!boss.dead&&firstMapDefeated()>=15&&distance(point,boss)<105)damageBoss(effectiveAttack());
  }
  function useSkill() {
    if(paused||skillCooldown>0)return;
    canvas.dataset.lastAction="skill";
    skillCooldown=2.4;const v=facingVector();projectiles.push({x:state.x+v.x*40,y:state.y+v.y*40,vx:v.x*470,vy:v.y*470,life:1.3,damage:effectiveAttack()*.78});playTone(520,.1);
  }
  function toggleVision() {
    if(paused)return;
    if(!state.visionUnlocked){canvas.dataset.lastAction="vision-locked";showToast(t("objectiveTalk"));return}
    trueVision=!trueVision;state.trueVision=trueVision;showToast(t(trueVision?"visionOn":"visionOff"));updateHud();saveGame();
    canvas.dataset.lastAction=trueVision?"vision-on":"vision-off";
  }
  function damageEnemy(enemy,amount) {
    enemy.hp-=amount;state.enemyHp[enemy.id]=Math.max(0,enemy.hp);effects.push({x:enemy.x,y:enemy.y,index:10,size:52,life:.35});
    if(enemy.hp<=0){
      enemy.dead=true;state.defeated.add(enemy.id);gainXp(12+(enemy.id>7?6:0));playTone(240,.12);
      updateObjective();saveGame();
    }else saveGame();
  }
  function damageBoss(amount) {
    if(boss.stun>0)amount*=1.45;boss.hp-=amount;state.bossHp=Math.max(0,boss.hp);effects.push({x:boss.x,y:boss.y,index:10,size:72,life:.35});
    if(boss.hp<=0)finishBoss();else saveGame();
  }
  function xpNeeded(level=state.level){return 30+(level-1)*22}
  function applyLevelUps(announce=true) {
    let levels=0;
    while(state.xp>=xpNeeded()){
      state.xp-=xpNeeded();state.level++;state.maxHp+=8;state.attack+=2;state.defense+=1;state.hp=state.maxHp;levels++;
      if(announce){showToast(t("levelUp",{n:state.level}),2400);playTone(720,.18)}
    }
    return levels;
  }
  function gainXp(amount) {
    state.xp+=amount;applyLevelUps(true);
    updateHud();
  }
  function hurt(amount) {
    if(invulnerability>0||paused)return;
    state.hp-=Math.max(1,amount-effectiveDefense());invulnerability=.75;playTone(90,.12);
    if(state.hp<=0){
      state.hp=state.maxHp;state.mapId=state.checkpoint.mapId||MAP_SIGNAL_TOWN;state.x=state.checkpoint.x;state.y=state.checkpoint.y;
      enemyProjectiles.length=0;showToast(t("defeated"),2500);saveGame();
    }
    else saveGame();
    updateHud();
  }
  function updateEnemies(dt) {
    enemies.forEach(enemy=>{
      if(enemy.dead||enemy.mapId!==state.mapId||(enemy.hidden&&!trueVision))return;
      enemy.attackTimer-=dt;const dist=distance(state,enemy);
      if(dist<310){
        const dx=(state.x-enemy.x)/(dist||1),dy=(state.y-enemy.y)/(dist||1);
        if(dist>55)moveEntityWithTerrain(enemy,dx*enemy.speed*dt,dy*enemy.speed*dt,22);
        else if(enemy.attackTimer<=0){hurt(enemy.id>7?10:7);enemy.attackTimer=1.05+(enemy.id%3)*.2}
      } else {
        enemy.phase+=dt*.7;const tx=enemy.homeX+Math.cos(enemy.phase)*55,ty=enemy.homeY+Math.sin(enemy.phase*.8)*40;
        moveEntityWithTerrain(enemy,(tx-enemy.x)*dt*.7,(ty-enemy.y)*dt*.7,22);
      }
    });
  }
  function updateBoss(dt) {
    if(state.mapId!==MAP_SIGNAL_TOWN||boss.dead||firstMapDefeated()<15)return;
    const dist=distance(state,boss);
    if(dist<500&&!bossIntroduced){bossIntroduced=true;markDiscovery("boss");showToast(t("bossAppears"),3000)}
    if(dist>600)return;
    boss.attackTimer-=dt;boss.stun=Math.max(0,boss.stun-dt);
    if(boss.charge>0){
      boss.charge-=dt;const dx=(state.x-boss.x)/(dist||1),dy=(state.y-boss.y)/(dist||1);moveEntityWithTerrain(boss,dx*250*dt,dy*250*dt,48);
      if(dist<75)hurt(17);return;
    }
    if(boss.attackTimer<=0){
      const ratio=boss.hp/boss.maxHp;boss.pattern=(boss.pattern+1)%3;
      if(boss.pattern===0){
        const count=ratio<.5?10:7;
        for(let i=0;i<count;i++){const angle=i/count*Math.PI*2;enemyProjectiles.push({x:boss.x,y:boss.y,vx:Math.cos(angle)*170,vy:Math.sin(angle)*170,life:4,damage:11})}
        boss.sprite=14;
      } else if(boss.pattern===1){boss.charge=.75;boss.sprite=13}
      else {boss.stun=1.15;boss.sprite=15}
      boss.attackTimer=ratio<.5?1.45:2.05;
    }
  }
  function updateProjectiles(dt) {
    projectiles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;if(collidesTerrain(p.x,p.y,9))p.life=0});
    enemyProjectiles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;if(distance(state,p)<35){hurt(p.damage);p.life=0}});
    for(let i=projectiles.length-1;i>=0;i--){
      const p=projectiles[i];let hit=false;
      enemies.forEach(enemy=>{if(!hit&&enemy.mapId===state.mapId&&!enemy.dead&&(!enemy.hidden||trueVision)&&distance(p,enemy)<45){damageEnemy(enemy,p.damage);hit=true}});
      if(!hit&&state.mapId===MAP_SIGNAL_TOWN&&!boss.dead&&firstMapDefeated()>=15&&distance(p,boss)<70){damageBoss(p.damage);hit=true}
      if(hit||p.life<=0||p.x<0||p.x>WORLD.width||p.y<0||p.y>WORLD.height)projectiles.splice(i,1);
    }
    for(let i=enemyProjectiles.length-1;i>=0;i--)if(enemyProjectiles[i].life<=0)enemyProjectiles.splice(i,1);
    effects.forEach(f=>f.life-=dt);for(let i=effects.length-1;i>=0;i--)if(effects[i].life<=0)effects.splice(i,1);
  }
  function finishBoss() {
    boss.dead=true;state.bossDefeated=true;state.visionUnlocked=true;trueVision=true;state.trueVision=true;
    state.bossHp=0;gainXp(80);saveGame();updateObjective();updateHud();resultClaimed=false;
    clearTimeout(resultRevealTimer);
    resultRevealTimer=setTimeout(()=>{
      resultRevealTimer=0;
      if(!playing||document.body.dataset.screen!=="battle"||nodes.battle.hidden)return;
      setPanel(nodes.result);
    },500);playTone(820,.35);
  }

  function update(dt) {
    if(!playing||paused){playerMoving=false;return}
    attackCooldown=Math.max(0,attackCooldown-dt);skillCooldown=Math.max(0,skillCooldown-dt);invulnerability=Math.max(0,invulnerability-dt);swingTimer=Math.max(0,swingTimer-dt);
    movePlayer(dt);updateEnemies(dt);updateBoss(dt);updateProjectiles(dt);updateHud();
  }
  function frame(time) {
    const dt=Math.min(.033,(time-lastTime)/1000||0);lastTime=time;update(dt);if(playing)render();requestAnimationFrame(frame);
  }
  function setScreenOwner(screen) {
    document.body.dataset.screen=screen;
    if(nodes.reserve) nodes.reserve.hidden=screen!=="battle";
    for(const candidate of ["main","stage","battle"]){
      document.body.classList.toggle(`wp-shell-${candidate}-active`,candidate===screen);
    }
    document.body.classList.toggle("wp-stage-select-active",screen==="stage");
    document.documentElement.classList.toggle("wp-stage-select-active",screen==="stage");
    dispatchEvent(new CustomEvent("weightplay:shell-sync",{detail:{screen}}));
    dispatchEvent(new CustomEvent("weightplay:stage-sync",{detail:{screen}}));
    dispatchEvent(new CustomEvent("weightplay:battle-sync",{detail:{screen}}));
    if(screen==="battle")dispatchEvent(new CustomEvent("weightplay:battle-open",{detail:{screen}}));
  }
  function playTone(frequency,duration) {
    if(window.WonderSound?.isMuted?.())return;
    try{const audio=playTone.audio||(playTone.audio=new (window.AudioContext||window.webkitAudioContext)()),osc=audio.createOscillator(),gain=audio.createGain();osc.frequency.value=frequency;osc.type="square";gain.gain.setValueAtTime(.035,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);osc.connect(gain).connect(audio.destination);osc.start();osc.stop(audio.currentTime+duration)}catch{}
  }
  function showBattle() {
    nodes.main.hidden=true;nodes.battle.hidden=false;setScreenOwner("battle");playing=true;paused=false;lastTime=performance.now();resizeCanvas();updateHud();updateObjective();renderInventory();canvas.focus({preventScroll:true});
  }
  function showMain() {
    clearTimeout(resultRevealTimer);resultRevealTimer=0;
    saveGame();playing=false;paused=false;nodes.battle.hidden=true;nodes.main.hidden=false;setScreenOwner("main");setPanel(null);closeDialogue();scrollTo({top:0,behavior:"instant"});updateMainProgress();
    requestAnimationFrame(()=>requestAnimationFrame(()=>$("#startGame").focus({preventScroll:true})));
  }
  function restartGame() {
    const keepAnchor=Boolean(state.signalAnchor);clearSave();
    state={...fresh,maxHp:fresh.maxHp+(keepAnchor?12:0),hp:fresh.hp+(keepAnchor?12:0),signalAnchor:keepAnchor,talked:new Set(),defeated:new Set(),chests:new Set(),relays:new Set(),ashfallFindings:new Set(),lunarFindings:new Set(),equipment:{...fresh.equipment},equipped:{...fresh.equipped},enemyHp:{},discoveries:{...fresh.discoveries},checkpoint:{...fresh.checkpoint}};
    trueVision=false;enemies=makeEnemies();
    boss={x:2890,y:520,hp:260,maxHp:260,attackTimer:1.2,pattern:0,dead:false,sprite:12,stun:0,charge:0};bossIntroduced=false;
    projectiles.length=0;enemyProjectiles.length=0;setPanel(null);showBattle();saveGame();
  }

  addEventListener("keydown",event=>{
    const key=event.key.toLowerCase();
    const interactiveTarget=event.target instanceof Element&&event.target.closest("button,a,input,select,textarea,[contenteditable='true']");
    if(interactiveTarget&&key!=="escape")return;
    if(["arrowup","arrowdown","arrowleft","arrowright"," ","w","a","s","d","j","k","v","e","escape"].includes(key))event.preventDefault();
    keys.add(key);
    if(event.repeat)return;
    if(!paused&&["arrowup","arrowdown","arrowleft","arrowright","w","a","s","d"].includes(key)){
      const nudge={arrowup:[0,-10],w:[0,-10],arrowdown:[0,10],s:[0,10],arrowleft:[-10,0],a:[-10,0],arrowright:[10,0],d:[10,0]}[key];
      setFacing({x:nudge[0],y:nudge[1]});updateHud();
    }
    if(key===" "||key==="j")attack();
    if(key==="k")useSkill();
    if(key==="v")toggleVision();
    if(key==="e"||key==="enter"){if(currentDialogue!==null)closeDialogue();else interact()}
    if(key==="escape"){
      if(currentDialogue!==null)closeDialogue();
      else if(!nodes.overlay.hidden)setPanel(null);
      else if(playing)setPanel(nodes.pause);
    }
  });
  addEventListener("keyup",event=>keys.delete(event.key.toLowerCase()));
  addEventListener("blur",()=>{keys.clear();playerMoving=false;if(playing&&!paused)setPanel(nodes.pause)});
  document.addEventListener("visibilitychange",()=>{if(document.hidden&&playing&&!paused)setPanel(nodes.pause)});
  $("#startGame").addEventListener("click",showBattle);
  $("#questButton").addEventListener("click",event=>{
    showCurrentQuest();
    if(event.detail>0)event.currentTarget.blur();
  });
  $("#menuButton").addEventListener("click",()=>{updateHud();updateObjective();setPanel(nodes.pause)});
  $("#battleBack").addEventListener("click",()=>setPanel(nodes.leave));
  $("#resumeButton").addEventListener("click",()=>setPanel(null));
  $("#inventoryButton").addEventListener("click",()=>{renderInventory();setPanel(nodes.inventory)});
  nodes.weaponToggle.addEventListener("click",()=>toggleEquipment("weapon"));
  nodes.armorToggle.addEventListener("click",()=>toggleEquipment("armor"));
  nodes.accessoryToggle.addEventListener("click",()=>toggleEquipment("accessory"));
  nodes.buyAnchor.addEventListener("click",buySignalAnchor);
  $("#closeInventory").addEventListener("click",()=>setPanel(nodes.pause));
  $("#returnButton").addEventListener("click",()=>setPanel(nodes.leave));
  $("#continueButton").addEventListener("click",()=>setPanel(null));
  $("#confirmLeaveButton").addEventListener("click",showMain);
  $("#dialogueNext").addEventListener("click",closeDialogue);
  nodes.broadcastChoice.addEventListener("click",()=>currentDialogue==="lunar-choice"?chooseLunar("answer"):chooseAshfall("broadcast"));
  nodes.protectChoice.addEventListener("click",()=>currentDialogue==="lunar-choice"?chooseLunar("shield"):chooseAshfall("protect"));
  $("#continueExplore").addEventListener("click",()=>{if(resultClaimed)return;resultClaimed=true;setPanel(null)});
  $("#newGameButton").addEventListener("click",()=>{if(resultClaimed)return;resultClaimed=true;restartGame()});
  nodes.attack.addEventListener("pointerdown",event=>{event.preventDefault();attack()});
  nodes.skill.addEventListener("pointerdown",event=>{event.preventDefault();useSkill()});
  nodes.vision.addEventListener("pointerdown",event=>{event.preventDefault();toggleVision()});
  function canvasPoint(event) {
    const rect=canvas.getBoundingClientRect(),tr=viewTransform();
    const pixelX=(event.clientX-rect.left)*canvas.width/rect.width;
    const pixelY=(event.clientY-rect.top)*canvas.height/rect.height;
    return{x:(pixelX-tr.ox)/tr.scale,y:(pixelY-tr.oy)/tr.scale};
  }
  function hitsInteractPrompt(event) {
    if(paused||!nearestInteractable())return false;
    const point=canvasPoint(event);
    return point.x>=INTERACT_PROMPT.x&&point.x<=INTERACT_PROMPT.x+INTERACT_PROMPT.w&&point.y>=INTERACT_PROMPT.y&&point.y<=INTERACT_PROMPT.y+INTERACT_PROMPT.h;
  }
  canvas.addEventListener("pointerdown",event=>{
    if(hitsInteractPrompt(event)){event.preventDefault();interact();return}
    if(event.pointerType==="mouse"&&event.button===0)attack();
  });
  canvas.addEventListener("pointermove",event=>{if(event.pointerType==="mouse")canvas.style.cursor=hitsInteractPrompt(event)?"pointer":""});
  canvas.addEventListener("pointerleave",()=>{canvas.style.cursor=""});

  let joystickPointer=null;
  function updateJoystick(event) {
    const rect=nodes.joystick.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
    let x=(event.clientX-cx)/(rect.width*.36),y=(event.clientY-cy)/(rect.height*.36);const length=Math.hypot(x,y);
    if(length>1){x/=length;y/=length}touchMove.x=x;touchMove.y=y;nodes.stick.style.transform=`translate(${x*27}px,${y*27}px)`;
  }
  nodes.joystick.addEventListener("pointerdown",event=>{joystickPointer=event.pointerId;nodes.joystick.setPointerCapture(event.pointerId);updateJoystick(event)});
  nodes.joystick.addEventListener("pointermove",event=>{if(event.pointerId===joystickPointer)updateJoystick(event)});
  function releaseJoystick(event){if(event.pointerId!==joystickPointer)return;joystickPointer=null;touchMove.x=0;touchMove.y=0;nodes.stick.style.transform="translate(0,0)"}
  nodes.joystick.addEventListener("pointerup",releaseJoystick);nodes.joystick.addEventListener("pointercancel",releaseJoystick);

  Promise.all(Object.values(atlas).map(image=>image.decode?.().catch(()=>{})||Promise.resolve())).finally(()=>{
    setTimeout(()=>{nodes.loading.hidden=true},350);
  });
  if(new URLSearchParams(location.search).get("trial")==="1"){
    window.__SIGNAL_VEIL_TEST__={
      collidesTerrain,
      enemySeeds:enemySeeds.map(([x,y])=>({x,y})),
      npcPositions:npcs.map(({x,y})=>({x,y})),
      chestPositions:chests.map(({x,y})=>({x,y})),
      terrainCount:WORLD_OBJECTS.length,
      moonfallEnemySeeds:moonfallEnemySeeds.map(([x,y])=>({x,y})),
      ashfallEnemySeeds:ashfallEnemySeeds.map(([x,y])=>({x,y})),
      lunarEnemySeeds:lunarEnemySeeds.map(([x,y])=>({x,y})),
      relayPositions:RELAY_NODES.map(({x,y})=>({x,y})),
      ashfallNodePositions:ASHFALL_NODES.map(({id,x,y})=>({id,x,y})),
      lunarNodePositions:LUNAR_NODES.map(({id,x,y})=>({id,x,y})),
      portalPositions:Object.fromEntries(Object.entries(MAP_PORTALS).map(([mapId,portals])=>[mapId,portals.map(({x,y,to})=>({x,y,to}))])),
      questCount:QUESTS.length,
      bossSpriteFrames:SPRITE_FRAMES.slice(12).map(frame=>frame.bounds?{bounds:[...frame.bounds],parts:frame.parts.map(part=>[...part])}:{bounds:[...frame],parts:[[...frame]]}),
      questState(){const active=activeQuest();return{completed:completedQuestCount(),activeId:active?.quest.id||null,activeNumber:active?active.index+1:null}},
      progressState(){return{level:state.level,xp:state.xp,need:xpNeeded(),text:nodes.xpText.textContent}},
      objectiveText(){return currentQuestText()},
      inspectBossSprite(index){state.mapId=MAP_SIGNAL_TOWN;state.x=2140;state.y=520;boss.x=2200;boss.dead=false;boss.sprite=index;boss.attackTimer=999;boss.charge=0;boss.stun=0;updateHud()},
      setPlayer(x,y,mapId=state.mapId){state.mapId=mapId;state.x=x;state.y=y;updateHud();},
      unlockMoonfall(){state.bossDefeated=true;boss.dead=true;state.chapter2Started=true;saveGame();updateObjective();updateHud()},
      switchMap(mapId){const portal=Object.values(MAP_PORTALS).flat().find(candidate=>candidate.to===mapId);if(portal)switchMap(portal)},
      completeMoonfallCombat(){moonfallEnemySeeds.forEach((_,offset)=>{const id=enemySeeds.length+offset;state.defeated.add(id);const enemy=enemies.find(candidate=>candidate.id===id);if(enemy)enemy.dead=true});saveGame();updateObjective();updateHud()},
      beginChapter3(){state.storyComplete=true;state.chapter3Started=true;state.discoveries.ashfall=false;saveGame();updateObjective();updateHud()},
      completeAshfallCombat(){ashfallEnemySeeds.forEach((_,offset)=>{const id=enemySeeds.length+moonfallEnemySeeds.length+offset;state.defeated.add(id);const enemy=enemies.find(candidate=>candidate.id===id);if(enemy)enemy.dead=true});saveGame();updateObjective();updateHud()},
      beginChapter4(){state.chapter3Complete=true;state.chapter4Started=true;state.discoveries.lunar=false;saveGame();updateObjective();updateHud()},
      completeLunarCombat(){lunarEnemySeeds.forEach((_,offset)=>{const id=enemySeeds.length+moonfallEnemySeeds.length+ashfallEnemySeeds.length+offset;state.defeated.add(id);const enemy=enemies.find(candidate=>candidate.id===id);if(enemy)enemy.dead=true});saveGame();updateObjective();updateHud()},
    };
  }
  setScreenOwner("main");applyLocale();updateMainProgress();renderInventory();requestAnimationFrame(frame);
})();
