(function(){
  "use strict";
  const $=id=>document.getElementById(id);
  const LOCALES=window.ANIMAL_HONEY_SHIELD_LOCALES;
  const STORAGE_KEY="weightplay_animal_honey_shield_v1";
  const TUTORIAL_KEY="weightplay_tutorial_seen_animal_honey_shield_v1";
  const ROUTE_LOCALES={"zh-tw":"zh-Hant","zh-cn":"zh-Hans","pt-br":"pt-BR",en:"en",ja:"ja",ko:"ko",es:"es",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"};
  const routeSegment=location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const platformLocale=window.WonderI18n?.actualLocale?.();
  let locale=ROUTE_LOCALES[routeSegment]||safeGet("weightPlayLocale")||safeGet("weightplay-locale")||platformLocale||"en";
  if(!LOCALES[locale])locale="en";
  const fallbackSave={unlocked:1,cleared:{},stars:{}};
  let save=loadSave(),screen="main",stageIndex=0,selectedStage=0,tutorialReturnFocus=null;
  const canvas=$("gameCanvas"),ctx=canvas.getContext("2d",{alpha:false});
  const atlas=new Image(),background=new Image();
  const themeBackgrounds=[background,new Image(),new Image(),new Image(),new Image(),new Image()];
  const themeBackgroundSources=[
    "../../assets/animal-honey-shield-background-simple-meadow.webp",
    "../../assets/animal-honey-shield-background-simple-brook.webp",
    "../../assets/animal-honey-shield-background-simple-stones.webp",
    "../../assets/animal-honey-shield-background-simple-wind.webp",
    "../../assets/animal-honey-shield-background-simple-bramble.webp",
    "../../assets/animal-honey-shield-background-simple-ruins.webp",
  ];
  const state={mode:"idle",paused:false,modal:false,started:false,planElapsed:0,elapsed:0,duration:8,nectar:100,strokes:[],drawing:null,bees:[],spawnClock:0,spawned:0,frame:0,last:0,flash:0,wallMoves:0,wallApproachStartedAt:null,wallFirstMovedAt:null,maxGroupAttached:0,pathOpenedAt:null,navClock:0,nav:null,wallNavClock:0,wallNav:null,mover:null,wallImpactContacts:0,wallMoveSolves:0,wallSupportContributions:0,frameWallMoveSolves:0,maxFrameWallMoveSolves:0,carrierChanges:0,beeWallCorrections:0,wallNavBuilds:0,directWallTargets:0,supporterCarryDistance:0,keyboard:{x:500,y:310},result:null};
  let raf=0;
  const LINE_PIXELS_PER_NECTAR=14;
  const PIP_CONTACT_RADIUS=90;
  const THEMES=[
    {sky:"#71c98b",ground:"#2d7a4d",accent:"#d8ff9b",terrain:"meadow"},
    {sky:"#65bad1",ground:"#237a70",accent:"#8ff7e8",terrain:"brook"},
    {sky:"#a9b96d",ground:"#596f3d",accent:"#e8d08a",terrain:"stones"},
    {sky:"#84a7d8",ground:"#415f78",accent:"#c8efff",terrain:"wind"},
    {sky:"#b47d9d",ground:"#67435f",accent:"#ffbddb",terrain:"bramble"},
    {sky:"#d49a49",ground:"#78512c",accent:"#ffe27d",terrain:"ruins"},
  ];
  const STAGE_CARD_POOL_SIZE=9;
  let stageWindowStart=0,stageCardPool=[],stageSettleRaf=0;
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  const TERRAIN_ZONES=[
    [
      [{kind:"flowers",x:70,y:235,w:220,h:220}],
      [{kind:"flowers",x:690,y:160,w:235,h:250}],
      [{kind:"flowers",x:90,y:155,w:180,h:170},{kind:"flowers",x:730,y:350,w:180,h:170}],
      [{kind:"flowers",x:365,y:180,w:270,h:190}],
      [{kind:"flowers",x:80,y:355,w:210,h:160},{kind:"flowers",x:710,y:145,w:210,h:160}],
    ],
    [
      [{kind:"water",x:435,y:0,w:130,h:620}],
      [{kind:"water",x:0,y:255,w:1000,h:120}],
      [{kind:"water",x:225,y:0,w:105,h:620},{kind:"water",x:670,y:0,w:105,h:620}],
      [{kind:"water",x:0,y:155,w:585,h:105},{kind:"water",x:480,y:155,w:105,h:465}],
      [{kind:"water",x:315,y:0,w:105,h:410},{kind:"water",x:315,y:305,w:420,h:105}],
    ],
    [
      [{kind:"rough",x:380,y:210,w:240,h:240}],
      [{kind:"rough",x:90,y:250,w:300,h:190},{kind:"rough",x:650,y:80,w:240,h:180}],
      [{kind:"rough",x:0,y:250,w:1000,h:115}],
      [{kind:"rough",x:210,y:90,w:150,h:430},{kind:"rough",x:640,y:90,w:150,h:430}],
      [{kind:"rough",x:315,y:145,w:370,h:315}],
    ],
    [
      [{kind:"wind",x:0,y:130,w:1000,h:145,dx:1,dy:.12}],
      [{kind:"wind",x:0,y:330,w:1000,h:145,dx:-1,dy:-.08}],
      [{kind:"wind",x:125,y:0,w:175,h:620,dx:.18,dy:1},{kind:"wind",x:700,y:0,w:175,h:620,dx:-.18,dy:-1}],
      [{kind:"wind",x:0,y:80,w:1000,h:120,dx:1,dy:.2},{kind:"wind",x:0,y:405,w:1000,h:120,dx:-1,dy:-.2}],
      [{kind:"wind",x:315,y:0,w:155,h:620,dx:.2,dy:1},{kind:"wind",x:530,y:0,w:155,h:620,dx:-.2,dy:-1}],
    ],
    [
      [{kind:"bramble",x:365,y:155,w:270,h:170}],
      [{kind:"bramble",x:70,y:210,w:250,h:245},{kind:"bramble",x:680,y:210,w:250,h:245}],
      [{kind:"bramble",x:0,y:285,w:390,h:120},{kind:"bramble",x:610,y:285,w:390,h:120}],
      [{kind:"bramble",x:260,y:0,w:130,h:430},{kind:"bramble",x:610,y:190,w:130,h:430}],
      [{kind:"bramble",x:125,y:120,w:190,h:150},{kind:"bramble",x:685,y:120,w:190,h:150},{kind:"bramble",x:405,y:390,w:190,h:150}],
    ],
    [
      [{kind:"ruins",x:330,y:150,w:340,h:350}],
      [{kind:"ruins",x:80,y:180,w:280,h:330},{kind:"ruins",x:640,y:180,w:280,h:330}],
      [{kind:"ruins",x:0,y:230,w:1000,h:145}],
      [{kind:"ruins",x:210,y:55,w:150,h:510},{kind:"ruins",x:640,y:55,w:150,h:510}],
      [{kind:"ruins",x:285,y:100,w:430,h:420}],
    ],
  ];

  function safeGet(key){try{return localStorage.getItem(key)}catch{return null}}
  function safeSet(key,value){try{localStorage.setItem(key,value);return true}catch{return false}}
  function loadSave(){
    try{
      const raw=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");
      if(!raw||typeof raw!=="object")return structuredClone(fallbackSave);
      const unlocked=Math.max(1,Math.min(30,Number(raw.unlocked)||1));
      const cleared={},stars={};
      for(let i=0;i<30;i++){
        if(raw.cleared?.[i]===true)cleared[i]=true;
        const value=Math.max(0,Math.min(3,Number(raw.stars?.[i])||0));
        if(value)stars[i]=value;
      }
      return{unlocked,cleared,stars};
    }catch{return structuredClone(fallbackSave)}
  }
  function persist(){safeSet(STORAGE_KEY,JSON.stringify(save))}
  function fmt(key,vars={}){
    let value=LOCALES[locale]?.[key]??LOCALES.en[key]??key;
    if(Array.isArray(value))return value;
    return String(value).replace(/\{(\w+)\}/g,(_,name)=>vars[name]??`{${name}}`);
  }
  function announce(key,vars){$("feedbackText").textContent=fmt(key,vars)}
  function applyLocale(){
    document.documentElement.lang=locale==="zh-Hant"?"zh-TW":locale==="zh-Hans"?"zh-CN":locale;
    document.documentElement.dir=locale==="ar"?"rtl":"ltr";
    $("localeSelect").value=locale;
    document.querySelectorAll("[data-i18n]").forEach(node=>node.textContent=fmt(node.dataset.i18n));
    document.querySelectorAll("[data-i18n-aria]").forEach(node=>node.setAttribute("aria-label",fmt(node.dataset.i18nAria)));
    document.querySelectorAll("[data-i18n-alt]").forEach(node=>node.setAttribute("alt",fmt(node.dataset.i18nAlt)));
    updateMainProgress();renderStages();updateStageChapter();updateHud();
    window.dispatchEvent(new CustomEvent("wonder:locale-change",{detail:{locale}}));
    document.title=`${fmt("title")} | WeightPlay`;
  }
  $("localeSelect").addEventListener("change",event=>{
    locale=event.target.value;safeSet("weightPlayLocale",locale);safeSet("weightplay-locale",locale);
    window.WonderI18n?.setLocale?.(locale);
    applyLocale();
  });

  function updateMainProgress(){
    const done=Object.keys(save.cleared).length,stars=Object.values(save.stars).reduce((sum,n)=>sum+n,0);
    $("mainProgress").textContent=fmt("progress",{done,stars});
  }
  function showScreen(next){
    if(document.activeElement instanceof HTMLElement)document.activeElement.blur();
    screen=next;document.body.dataset.screen=next;
    $("mainGroup").hidden=next!=="main";$("stageScreen").hidden=next!=="stage";$("battleScreen").hidden=next!=="battle";
    document.body.classList.toggle("wp-stage-select-active",next==="stage");
    document.body.classList.toggle("wp-shell-main-active",next==="main");
    document.body.classList.toggle("wp-shell-stage-active",next==="stage");
    document.body.classList.toggle("wp-shell-battle-active",next==="battle");
    if(next==="stage")renderStages();
    window.dispatchEvent(new Event("weightplay:shell-sync"));
    window.dispatchEvent(new Event("weightplay:stage-sync"));
    window.dispatchEvent(new Event("weightplay:battle-sync"));
    if(next==="stage")$("stageScreen").querySelector(".stage-canvas").scrollTop=0;
    window.scrollTo({left:0,top:0,behavior:"instant"});
    if(next==="stage")requestAnimationFrame(centerSelected);
    if(next==="battle"){
      window.dispatchEvent(new CustomEvent("weightplay:battle-open"));
      cancelAnimationFrame(raf);state.last=performance.now();raf=requestAnimationFrame(loop);
    }
    else cancelAnimationFrame(raf);
  }
  function stageWindowLimit(){return Math.max(0,30-STAGE_CARD_POOL_SIZE)}
  function desiredStageWindow(index){return clamp(index-Math.floor(STAGE_CARD_POOL_SIZE/2),0,stageWindowLimit())}
  function createStageCard(){
    const button=document.createElement("button");button.type="button";button.className="stage-card";
    button.innerHTML="<small></small><strong></strong><span></span>";
    button.addEventListener("click",()=>{const index=Number(button.dataset.stageIndex);if(index<save.unlocked){selectedStage=index;startStage(index)}});
    button.addEventListener("focus",()=>{const index=Number(button.dataset.stageIndex);if(Number.isInteger(index)){selectedStage=index;ensureStageWindow(index);updateStageChapter()}});
    return button;
  }
  function bindStageCard(button,index){
    const unlocked=index<save.unlocked,best=save.stars[index]||0;
    button.dataset.stage=String(index);button.dataset.stageIndex=String(index);button.setAttribute("aria-posinset",String(index+1));button.setAttribute("aria-setsize","30");button.setAttribute("aria-keyshortcuts","ArrowLeft ArrowRight Home End");button.setAttribute("aria-disabled",String(!unlocked));button.classList.toggle("locked",!unlocked);
    button.querySelector("small").textContent=fmt("chapter",{n:Math.floor(index/5)+1});button.querySelector("strong").textContent=String(index+1);button.querySelector("span").textContent=unlocked?(save.cleared[index]?fmt("stars",{n:best}):fmt("stage",{n:index+1})):fmt("locked");
  }
  function syncStageSelection(){
    stageCardPool.forEach(card=>{const index=Number(card.dataset.stageIndex),selected=index===selectedStage;bindStageCard(card,index);card.classList.toggle("selected",selected);card.classList.toggle("wp-stage-centered",selected);card.tabIndex=selected?0:-1;if(selected)card.setAttribute("aria-current","true");else card.removeAttribute("aria-current");if(selected&&index<save.unlocked)card.dataset.wpStageRecommended="true";else delete card.dataset.wpStageRecommended});
  }
  function buildStageCardPool(){
    const rail=$("stageRail");rail.replaceChildren();stageWindowStart=desiredStageWindow(selectedStage);stageCardPool=Array.from({length:STAGE_CARD_POOL_SIZE},(_,offset)=>{const card=createStageCard();bindStageCard(card,stageWindowStart+offset);rail.append(card);return card});
    rail.dataset.wpStageVirtualized="bounded-recycle";rail.dataset.wpStagePoolSize=String(STAGE_CARD_POOL_SIZE);rail.dataset.wpStageTotal="30";
  }
  function moveStageWindow(targetStart){
    const rail=$("stageRail"),target=clamp(targetStart,0,stageWindowLimit());if(!stageCardPool.length){buildStageCardPool();return 0}let recycled=0;
    while(stageWindowStart<target){const card=rail.firstElementChild,anchor=card?.nextElementSibling,before=anchor?.getBoundingClientRect().left;stageWindowStart++;rail.append(card);bindStageCard(card,stageWindowStart+stageCardPool.length-1);recycled++;const after=anchor?.getBoundingClientRect().left;if(Number.isFinite(before)&&Number.isFinite(after))rail.scrollLeft+=after-before}
    while(stageWindowStart>target){const card=rail.lastElementChild,anchor=card?.previousElementSibling,before=anchor?.getBoundingClientRect().left;stageWindowStart--;rail.prepend(card);bindStageCard(card,stageWindowStart);recycled++;const after=anchor?.getBoundingClientRect().left;if(Number.isFinite(before)&&Number.isFinite(after))rail.scrollLeft+=after-before}
    stageCardPool=[...rail.children];rail.dataset.wpStageWindowStart=String(stageWindowStart);rail.dataset.wpStageWindowEnd=String(stageWindowStart+stageCardPool.length-1);if(recycled)rail.dataset.wpStageRecycleCount=String(Number(rail.dataset.wpStageRecycleCount||0)+recycled);return recycled;
  }
  function ensureStageWindow(index){if(!stageCardPool.length)buildStageCardPool();moveStageWindow(desiredStageWindow(index));syncStageSelection()}
  function stageRailGeometry(){const rail=$("stageRail"),cards=[...rail.children],rect=rail.getBoundingClientRect(),first=cards[0]?.getBoundingClientRect(),second=cards[1]?.getBoundingClientRect(),delta=first&&second?(second.left+second.width/2)-(first.left+first.width/2):0;return{rail,center:rect.left+rect.width/2,pitch:Math.abs(delta)||282,orientation:Math.sign(delta)||1}}
  function nearestStageCard(){const rail=$("stageRail"),rect=rail.getBoundingClientRect(),center=rect.left+rect.width/2;return stageCardPool.reduce((best,card)=>{const box=card.getBoundingClientRect(),distance=Math.abs(box.left+box.width/2-center);return!best||distance<best.distance?{card,distance}:best},null)?.card||null}
  function currentStageLogicalPosition(){const card=nearestStageCard();if(!card)return selectedStage;const index=Number(card.dataset.stageIndex),rect=card.getBoundingClientRect(),geometry=stageRailGeometry();return clamp(index+(geometry.center-(rect.left+rect.width/2))/(geometry.pitch*geometry.orientation),0,29)}
  function centerStageCard(card,smooth=false){const rail=$("stageRail");if(!rail||!card)return;const railRect=rail.getBoundingClientRect(),cardRect=card.getBoundingClientRect(),left=rail.scrollLeft+(cardRect.left+cardRect.width/2)-(railRect.left+railRect.width/2);rail.scrollTo({left,behavior:smooth?"smooth":"auto"})}
  function positionStageRail(position){const logical=clamp(position,0,29),anchorIndex=Math.round(logical),recycled=moveStageWindow(desiredStageWindow(anchorIndex));if(recycled)syncStageSelection();const card=$("stageRail").querySelector(`[data-stage-index="${anchorIndex}"]`);if(!card)return logical;centerStageCard(card);const geometry=stageRailGeometry(),fraction=logical-anchorIndex;if(Math.abs(fraction)>.0001)geometry.rail.scrollLeft+=fraction*geometry.orientation*geometry.pitch;return logical}
  function selectStage(index,center=false){selectedStage=clamp(index,0,29);ensureStageWindow(selectedStage);updateStageChapter();if(center)centerSelected(false)}
  function installVirtualStageDrag(){
    const rail=$("stageRail");if(!rail||rail.dataset.wpStageVirtualDrag==="true")return;rail.dataset.wpStageVirtualDrag="true";rail.dataset.wpStageCenterObserver="manual";
    let pointerId=null,startX=0,lastX=0,logical=0,moved=false,suppressClick=false;
    rail.addEventListener("pointerdown",event=>{if(event.isPrimary===false||(event.button!==undefined&&event.button!==0))return;cancelAnimationFrame(stageSettleRaf);pointerId=event.pointerId;startX=lastX=event.clientX;logical=currentStageLogicalPosition();moved=false;rail.style.scrollBehavior="auto";rail.style.scrollSnapType="none";event.stopImmediatePropagation()},true);
    document.addEventListener("pointermove",event=>{if(event.pointerId!==pointerId)return;const delta=event.clientX-lastX;lastX=event.clientX;if(!moved&&Math.abs(event.clientX-startX)>4)moved=true;if(moved){if(event.cancelable)event.preventDefault();logical=positionStageRail(logical-delta/stageRailGeometry().pitch)}event.stopImmediatePropagation()},true);
    const finish=event=>{if(pointerId===null||(event.pointerId!==undefined&&event.pointerId!==pointerId))return;pointerId=null;if(moved){if(event.cancelable)event.preventDefault();const from=logical,index=Math.round(logical),start=performance.now(),duration=340;selectStage(index);positionStageRail(from);const settle=now=>{const p=clamp((now-start)/duration,0,1),e=p*p*(3-2*p);positionStageRail(from+(index-from)*e);if(p<1)stageSettleRaf=requestAnimationFrame(settle);else{positionStageRail(index);syncStageSelection();rail.style.removeProperty("scroll-behavior");rail.style.removeProperty("scroll-snap-type")}};stageSettleRaf=requestAnimationFrame(settle);suppressClick=true;setTimeout(()=>{suppressClick=false},0)}else{rail.style.removeProperty("scroll-behavior");rail.style.removeProperty("scroll-snap-type")}moved=false;event.stopImmediatePropagation()};
    document.addEventListener("pointerup",finish,true);document.addEventListener("pointercancel",finish,true);rail.addEventListener("click",event=>{if(suppressClick){suppressClick=false;event.preventDefault();event.stopImmediatePropagation()}},true);
    rail.addEventListener("keydown",event=>{let next=selectedStage;if(event.key==="ArrowLeft")next--;else if(event.key==="ArrowRight")next++;else if(event.key==="Home")next=0;else if(event.key==="End")next=29;else if((event.key==="Enter"||event.key===" ")&&selectedStage<save.unlocked){event.preventDefault();startStage(selectedStage);return}else return;event.preventDefault();selectStage(clamp(next,0,29),true);$("stageRail").querySelector(`[data-stage-index="${selectedStage}"]`)?.focus()});
  }
  function renderStages(){
    const highest=Math.min(29,save.unlocked-1);selectedStage=clamp(Math.max(selectedStage,highest),0,29);ensureStageWindow(selectedStage);updateStageSummary();updateStageChapter();
  }
  function updateStageSummary(){
    const done=Object.keys(save.cleared).length,stars=Object.values(save.stars).reduce((sum,n)=>sum+n,0);
    $("stageSummary").textContent=fmt("progress",{done,stars});
  }
  function updateStageChapter(){
    if(!$("chapterTitle"))return;
    const chapter=Math.floor(selectedStage/5),titles=fmt("chapters"),rules=fmt("chapterRules");
    $("chapterKicker").textContent=fmt("chapter",{n:chapter+1});$("chapterTitle").textContent=titles[chapter]||titles[0];$("chapterRule").textContent=rules[chapter]||rules[0];
  }
  function centerSelected(smooth=false){ensureStageWindow(selectedStage);const card=$("stageRail")?.querySelector(`[data-stage-index="${selectedStage}"]`);centerStageCard(card,smooth)}
  function level(index){
    const chapter=Math.floor(index/5),slot=index%5,theme=THEMES[chapter];
    const dogPositions=[
      [{x:500,y:492},{x:430,y:475},{x:575,y:475},{x:500,y:440},{x:500,y:505}],
      [{x:500,y:500},{x:600,y:470},{x:395,y:470},{x:500,y:425},{x:510,y:505}],
      [{x:500,y:505},{x:410,y:470},{x:590,y:470},{x:500,y:405},{x:500,y:500}],
      [{x:500,y:490},{x:620,y:475},{x:380,y:475},{x:510,y:410},{x:500,y:505}],
      [{x:500,y:500},{x:390,y:455},{x:610,y:455},{x:500,y:395},{x:500,y:500}],
      [{x:500,y:500},{x:420,y:440},{x:580,y:440},{x:500,y:380},{x:500,y:505}],
    ];
    const hiveSets=[
      [[{x:845,y:100}],[{x:155,y:110}],[{x:850,y:95},{x:160,y:125}],[{x:510,y:75},{x:870,y:130}],[{x:135,y:95},{x:865,y:95}]],
      [[{x:145,y:105},{x:855,y:105}],[{x:850,y:80},{x:180,y:220}],[{x:160,y:85},{x:820,y:235}],[{x:500,y:70},{x:875,y:160}],[{x:125,y:115},{x:875,y:115}]],
      [[{x:135,y:90},{x:865,y:90}],[{x:500,y:65},{x:865,y:180}],[{x:120,y:170},{x:880,y:170}],[{x:180,y:75},{x:820,y:75},{x:500,y:155}],[{x:110,y:100},{x:890,y:100}]],
      [[{x:120,y:90},{x:880,y:190}],[{x:880,y:85},{x:120,y:210}],[{x:500,y:65},{x:130,y:155}],[{x:120,y:80},{x:880,y:80},{x:500,y:175}],[{x:105,y:145},{x:895,y:145}]],
      [[{x:120,y:90},{x:880,y:90}],[{x:500,y:60},{x:865,y:190}],[{x:135,y:170},{x:865,y:170},{x:500,y:65}],[{x:105,y:90},{x:895,y:90},{x:500,y:185}],[{x:110,y:125},{x:890,y:125},{x:500,y:60}]],
      [[{x:110,y:90},{x:890,y:90}],[{x:500,y:60},{x:110,y:185},{x:890,y:185}],[{x:100,y:90},{x:900,y:90},{x:500,y:190}],[{x:115,y:70},{x:885,y:70},{x:500,y:155}],[{x:95,y:105},{x:905,y:105},{x:500,y:55}]],
    ];
    const anchors=[],platforms=[],gates=[];
    if(chapter===0){
      if(slot===0)anchors.push({x:350,y:420,r:43},{x:650,y:420,r:43});
      if(slot===1)anchors.push({x:300,y:395,r:43},{x:650,y:330,r:43});
      if(slot===2)anchors.push({x:350,y:335,r:43},{x:650,y:335,r:43});
      if(slot===3){gates.push({x:500,y:275,r:48});anchors.push({x:330,y:410,r:42})}
      if(slot===4)anchors.push({x:330,y:410,r:43},{x:650,y:330,r:43});
    }else if(chapter===1){
      const left=slot%2?250:330,right=slot%2?750:670;
      platforms.push({x:left-125,y:330,w:250,h:58},{x:right-125,y:500,w:250,h:58});
      if(slot>=2)anchors.push({x:500,y:285,r:42});
    }else if(chapter===2){
      anchors.push({x:300+slot*18,y:315,r:46},{x:700-slot*18,y:315,r:46});
      platforms.push({x:390,y:190+slot*20,w:220,h:58});
      if(slot>=3)gates.push({x:500,y:510,r:50});
    }else if(chapter===3){
      platforms.push({x:110+slot*35,y:255,w:230,h:58},{x:660-slot*35,y:430,w:230,h:58});
      anchors.push({x:500,y:330,r:44});
      if(slot===4)gates.push({x:350,y:500,r:48},{x:650,y:500,r:48});
    }else if(chapter===4){
      anchors.push({x:255,y:280+slot*28,r:45},{x:745,y:280+slot*28,r:45});
      gates.push({x:500,y:210+slot*22,r:48});
      if(slot>=2)platforms.push({x:375,y:480,w:250,h:58});
    }else{
      anchors.push({x:270,y:270,r:46},{x:730,y:270,r:46});
      platforms.push({x:365,y:170+slot*25,w:270,h:58},{x:365,y:500-slot*18,w:270,h:58});
      if(slot>=1)gates.push({x:500,y:340,r:50});
      if(slot>=3)anchors.push({x:500,y:105,r:40});
    }
    const solids=[
      ...anchors.map(item=>({...item,kind:"anchor"})),
      ...gates.map(item=>({...item,kind:"gate"})),
      ...platforms.map(item=>({...item,kind:"platform"})),
    ];
    return{
      dog:dogPositions[chapter][slot],hives:hiveSets[chapter][slot],anchors,platforms,gates,solids,zones:TERRAIN_ZONES[chapter][slot],theme,chapter,slot,topology:`${theme.terrain}-${slot+1}`,
      duration:7.5+chapter*.7+slot*.18,
      speed:128+chapter*13+slot*5,
      interval:Math.max(.38,.82-chapter*.065-slot*.018),
      maxBees:9+chapter*3+slot*2,
      gust:chapter>=3?22+chapter*7+slot*3:0,
      flank:chapter*9+slot*3,
    };
  }
  function resetStage(){
    const spec=level(stageIndex);
    Object.assign(state,{mode:"idle",paused:false,modal:false,started:false,planElapsed:0,elapsed:0,duration:spec.duration,nectar:100,strokes:[],drawing:null,bees:[],spawnClock:spec.interval,spawned:0,frame:0,flash:0,wallMoves:0,wallApproachStartedAt:null,wallFirstMovedAt:null,maxGroupAttached:0,pathOpenedAt:null,navClock:0,nav:null,wallNavClock:0,wallNav:null,mover:null,wallImpactContacts:0,wallMoveSolves:0,wallSupportContributions:0,frameWallMoveSolves:0,maxFrameWallMoveSolves:0,carrierChanges:0,beeWallCorrections:0,wallNavBuilds:0,directWallTargets:0,supporterCarryDistance:0,result:null});
    $("resultPanel").hidden=true;$("leavePanel").hidden=true;$("pausePanel").hidden=true;$("battleLive").inert=false;$("battleLive").hidden=false;
    $("clearBtn").disabled=false;$("drawHint").hidden=false;
    $("stageLabel").textContent=fmt("stage",{n:stageIndex+1});$("objectiveText").textContent=fmt("objective",{n:spec.duration});
    announce("ready");updateHud();draw();
  }
  function startStage(index){
    stageIndex=Math.max(0,Math.min(29,index));selectedStage=stageIndex;showScreen("battle");resetStage();
  }
  function updateHud(){
    if(!$("timeValue"))return;
    $("timeValue").textContent=Math.max(0,state.duration-state.elapsed).toFixed(1);
    $("nectarValue").textContent=Math.round(state.nectar);
    $("waveFill").style.width=`${Math.min(100,state.elapsed/state.duration*100)}%`;
    const used=Math.round(100-state.nectar);$("lineReadout").textContent=fmt("lineStatus",{used,left:Math.round(state.nectar)});
  }

  function pointerPoint(event){
    const rect=canvas.getBoundingClientRect();
    return{x:(event.clientX-rect.left)*canvas.width/rect.width,y:(event.clientY-rect.top)*canvas.height/rect.height};
  }
  function canDraw(){return screen==="battle"&&!state.paused&&!state.modal&&!state.result&&state.nectar>1}
  function beginWave(){
    if(state.started||state.result)return;
    state.started=true;state.mode="wave";state.spawnClock=level(stageIndex).interval;
    $("clearBtn").disabled=true;$("drawHint").hidden=true;announce("waveStarted");
  }
  canvas.addEventListener("pointerdown",event=>{
    if(!canDraw())return;canvas.focus({preventScroll:true});canvas.setPointerCapture(event.pointerId);const point=pointerPoint(event);
    state.drawing={points:[point],flash:0,blockedFlash:0,moves:0};state.keyboard={...point};$("drawHint").hidden=true;event.preventDefault();
  });
  canvas.addEventListener("pointermove",event=>{
    if(!state.drawing||!canDraw())return;
    const coalesced=event.getCoalescedEvents?.(),samples=coalesced?.length?coalesced:[event];
    for(const sample of samples){
      const point=pointerPoint(sample),last=state.drawing.points.at(-1),distance=Math.hypot(point.x-last.x,point.y-last.y);
      if(distance<5)continue;
      const allowed=Math.min(distance,state.nectar*LINE_PIXELS_PER_NECTAR);if(allowed<=0)break;
      const ratio=allowed/distance,next={x:last.x+(point.x-last.x)*ratio,y:last.y+(point.y-last.y)*ratio};
      state.drawing.points.push(next);state.nectar=Math.max(0,state.nectar-allowed/LINE_PIXELS_PER_NECTAR);state.keyboard={...next};
    }
    updateHud();draw();event.preventDefault();
  });
  function trimClosedLoopTail(points,dog){
    if(points.length<12)return points;
    let best=null;
    for(let start=1;start<points.length-9;start++)for(let end=start+9;end<points.length;end++){
      const distance=Math.hypot(points[start].x-points[end].x,points[start].y-points[end].y);if(distance>30)continue;
      const loop=points.slice(start,end+1),width=Math.max(...loop.map(point=>point.x))-Math.min(...loop.map(point=>point.x)),height=Math.max(...loop.map(point=>point.y))-Math.min(...loop.map(point=>point.y));
      const left=Math.min(...loop.map(point=>point.x)),right=Math.max(...loop.map(point=>point.x)),top=Math.min(...loop.map(point=>point.y)),bottom=Math.max(...loop.map(point=>point.y));
      if(width<120||height<120||!dog||dog.x<=left||dog.x>=right||dog.y<=top||dog.y>=bottom)continue;
      const span=end-start;if(!best||span>best.span)best={start,end,span};
    }
    if(!best)return points;
    const loop=points.slice(best.start,best.end+1);loop[loop.length-1]={...loop[0]};return loop;
  }
  function finishStroke(){
    if(!state.drawing)return;
    if(state.drawing.points.length>1){
      state.drawing.points=trimClosedLoopTail(state.drawing.points,level(stageIndex).dog);
      refreshStrokeMobility(state.drawing,level(stageIndex));
      state.strokes.push(state.drawing);
      state.wallNav=null;state.wallNavClock=0;
    }
    state.drawing=null;
    if(!state.started&&state.strokes.length)beginWave();
  }
  canvas.addEventListener("pointerup",finishStroke);canvas.addEventListener("pointercancel",finishStroke);
  canvas.addEventListener("keydown",event=>{
    if(!canDraw())return;
    const step=event.shiftKey?40:18;
    if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key)){
      if(event.key==="ArrowLeft")state.keyboard.x-=step;if(event.key==="ArrowRight")state.keyboard.x+=step;if(event.key==="ArrowUp")state.keyboard.y-=step;if(event.key==="ArrowDown")state.keyboard.y+=step;
      state.keyboard.x=Math.max(30,Math.min(970,state.keyboard.x));state.keyboard.y=Math.max(30,Math.min(590,state.keyboard.y));draw();event.preventDefault();
    }
    if(event.key===" "||event.key==="Enter"){
      const x=state.keyboard.x,y=state.keyboard.y,length=Math.min(220,state.nectar*LINE_PIXELS_PER_NECTAR);
      state.nectar=Math.max(0,state.nectar-length/LINE_PIXELS_PER_NECTAR);
      const stroke={points:[{x,y:y-length/2},{x,y:y+length/2}],flash:0,blockedFlash:0,moves:0};
      refreshStrokeMobility(stroke,level(stageIndex));state.strokes.push(stroke);
      state.wallNav=null;state.wallNavClock=0;
      if(!state.started)beginWave();
      updateHud();draw();event.preventDefault();
    }
  });

  function nearestOnSegment(px,py,a,b){
    const dx=b.x-a.x,dy=b.y-a.y,len=dx*dx+dy*dy||1,t=Math.max(0,Math.min(1,((px-a.x)*dx+(py-a.y)*dy)/len));
    const x=a.x+dx*t,y=a.y+dy*t;return{x,y,d:Math.hypot(px-x,py-y),nx:-dy/Math.sqrt(len),ny:dx/Math.sqrt(len)};
  }
  function pointHitsSolid(point,solid,margin=0){
    if(solid.kind==="platform")return point.x>=solid.x-margin&&point.x<=solid.x+solid.w+margin&&point.y>=solid.y-margin&&point.y<=solid.y+solid.h+margin;
    return Math.hypot(point.x-solid.x,point.y-solid.y)<=solid.r+margin;
  }
  const MOVE_DIRECTIONS=Array.from({length:16},(_,index)=>({x:Math.cos(index*Math.PI/8),y:Math.sin(index*Math.PI/8)}));
  const PUSH_DIRECTIONS=[{x:0,y:-1},{x:0,y:1},{x:-1,y:0},{x:1,y:0}];
  function sampledStrokePoints(points){
    const samples=[];
    for(let i=0;i<points.length;i++){
      samples.push(points[i]);
      if(!i)continue;
      const a=points[i-1],b=points[i],distance=Math.hypot(b.x-a.x,b.y-a.y),steps=Math.ceil(distance/12);
      for(let step=1;step<steps;step++){
        const t=step/steps;
        samples.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
      }
    }
    return samples;
  }
  function solidPenetration(point,solid,margin){
    if(solid.kind==="platform"){
      const left=solid.x-margin,right=solid.x+solid.w+margin,top=solid.y-margin,bottom=solid.y+solid.h+margin;
      if(point.x<left||point.x>right||point.y<top||point.y>bottom)return 0;
      return Math.min(point.x-left,right-point.x,point.y-top,bottom-point.y)+.001;
    }
    return Math.max(0,solid.r+margin-Math.hypot(point.x-solid.x,point.y-solid.y));
  }
  function penetrationScoreForSamples(samples,spec,dx=0,dy=0){
    const margin=10;
    let score=0;
    for(const solid of spec.solids)for(const point of samples){
      const penetration=solidPenetration({x:point.x+dx,y:point.y+dy},solid,margin);
      score+=penetration*penetration;
    }
    return score;
  }
  function penetrationScoreForPoints(points,spec,dx=0,dy=0){
    return penetrationScoreForSamples(sampledStrokePoints(points),spec,dx,dy);
  }
  function canTranslateStroke(stroke,dx,dy,spec){
    if(stroke.anchored)return false;
    const samples=sampledStrokePoints(stroke.points),before=penetrationScoreForSamples(samples,spec),tolerance=Math.max(.05,before*.002),steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/3));
    for(let step=1;step<=steps;step++)if(penetrationScoreForSamples(samples,spec,dx*step/steps,dy*step/steps)>before+tolerance)return false;
    return true;
  }
  function availableStrokeMoves(stroke,spec,distance=10){
    return MOVE_DIRECTIONS.filter(direction=>canTranslateStroke(stroke,direction.x*distance,direction.y*distance,spec));
  }
  function strokePenetrationScore(stroke,spec,dx=0,dy=0){
    return penetrationScoreForPoints(stroke.points,spec,dx,dy);
  }
  function preferredPushDirectionIndex(stroke,spec){
    const contact=closestStrokePoint(stroke,spec.dog),away={x:spec.dog.x-contact.x,y:spec.dog.y-contact.y};
    return PUSH_DIRECTIONS.reduce((best,direction,index)=>{
      const alignment=direction.x*away.x+direction.y*away.y;
      return alignment>best.alignment?{index,alignment}:best;
    },{index:0,alignment:-Infinity}).index;
  }
  function escapePushDirectionIndex(stroke,spec,excludedIndex=-1){
    const before=strokePenetrationScore(stroke,spec),preferred=preferredPushDirectionIndex(stroke,spec);
    const xs=stroke.points.map(point=>point.x),ys=stroke.points.map(point=>point.y),span={x:Math.max(...xs)-Math.min(...xs),y:Math.max(...ys)-Math.min(...ys)};
    const candidates=PUSH_DIRECTIONS.map((direction,index)=>({direction,index}))
      .filter(candidate=>candidate.index!==excludedIndex&&canTranslateStroke(stroke,candidate.direction.x*8,candidate.direction.y*8,spec))
      .map(candidate=>({
        ...candidate,
        edgeEscape:Math.abs(candidate.direction.x)*span.x+Math.abs(candidate.direction.y)*span.y,
        score:before-strokePenetrationScore(stroke,spec,candidate.direction.x*8,candidate.direction.y*8)+(candidate.index===preferred?100000:0),
      }))
      .sort((a,b)=>{
        if(a.edgeEscape!==b.edgeEscape)return b.edgeEscape-a.edgeEscape;
        return b.score-a.score;
      });
    return candidates[0]?.index??-1;
  }
  function spanningWallEscapeDirectionIndex(stroke,spec){
    const xs=stroke.points.map(point=>point.x),ys=stroke.points.map(point=>point.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),spanX=maxX-minX,spanY=maxY-minY;
    const indexes=spanX>=600&&spanX>spanY*2?[2,3]:spanY>=380&&spanY>spanX*2?[0,1]:[];
    const candidates=indexes.filter(index=>canTranslateStroke(stroke,PUSH_DIRECTIONS[index].x*8,PUSH_DIRECTIONS[index].y*8,spec))
      .map(index=>({index,distance:index===2
        ?Math.max(0,maxX-976)+Math.min(...spec.hives.map(hive=>1000-hive.x))
        :index===3?Math.max(0,24-minX)+Math.min(...spec.hives.map(hive=>hive.x))
        :index===0?Math.max(0,maxY-596)+Math.min(...spec.hives.map(hive=>620-hive.y))
        :Math.max(0,24-minY)+Math.min(...spec.hives.map(hive=>hive.y))}))
      .sort((a,b)=>a.distance-b.distance||a.index-b.index);
    return candidates[0]?.index??-1;
  }
  function commitStrokePushDirection(stroke,index){
    if(index<0||!PUSH_DIRECTIONS[index])return false;
    if(stroke.pushDirectionIndex!==index){
      if(Number.isInteger(stroke.pushDirectionIndex))stroke.pushDirectionChanges=(stroke.pushDirectionChanges||0)+1;
      stroke.pushDirectionIndex=index;(stroke.pushDirectionHistory??=[]).push(index);
    }
    const direction=PUSH_DIRECTIONS[index];stroke.pushAngle=Math.atan2(direction.y,direction.x);return true;
  }
  function pointInsideStroke(point,points){
    if(points.length<4||Math.hypot(points[0].x-points.at(-1).x,points[0].y-points.at(-1).y)>34)return false;
    let inside=false;
    for(let i=0,j=points.length-1;i<points.length;j=i++){
      const a=points[i],b=points[j],crosses=(a.y>point.y)!==(b.y>point.y)&&point.x<(b.x-a.x)*(point.y-a.y)/(b.y-a.y||.0001)+a.x;
      if(crosses)inside=!inside;
    }
    return inside;
  }
  function nearbyTurn(points,solid){
    const stable=[points[0]];
    for(let index=1;index<points.length;index++){
      const previous=stable.at(-1),point=points[index];
      if(Math.hypot(point.x-previous.x,point.y-previous.y)>=24)stable.push(point);
    }
    if(stable.at(-1)!==points.at(-1)&&Math.hypot(points.at(-1).x-stable.at(-1).x,points.at(-1).y-stable.at(-1).y)>=8)stable.push(points.at(-1));
    let turn=0,lastAngle=null;
    for(let index=1;index<stable.length;index++){
      const a=stable[index-1],b=stable[index],mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2};
      const near=solid.kind==="platform"
        ?mid.x>=solid.x-64&&mid.x<=solid.x+solid.w+64&&mid.y>=solid.y-64&&mid.y<=solid.y+solid.h+64
        :Math.hypot(mid.x-solid.x,mid.y-solid.y)<=solid.r+72;
      if(!near){lastAngle=null;continue}
      const angle=Math.atan2(b.y-a.y,b.x-a.x);
      if(lastAngle!==null){
        let delta=angle-lastAngle;
        while(delta>Math.PI)delta-=Math.PI*2;
        while(delta<-Math.PI)delta+=Math.PI*2;
        turn+=Math.abs(delta);
      }
      lastAngle=angle;
    }
    return turn;
  }
  function solidContactSides(stroke,solid){
    const sides=new Set(),samples=sampledStrokePoints(stroke.points);
    for(const point of samples){
      if(solid.kind==="platform"){
        if(point.x>=solid.x-20&&point.x<=solid.x+solid.w+20&&Math.abs(point.y-solid.y)<=22)sides.add("top");
        if(point.x>=solid.x-20&&point.x<=solid.x+solid.w+20&&Math.abs(point.y-(solid.y+solid.h))<=22)sides.add("bottom");
        if(point.y>=solid.y-20&&point.y<=solid.y+solid.h+20&&Math.abs(point.x-solid.x)<=22)sides.add("left");
        if(point.y>=solid.y-20&&point.y<=solid.y+solid.h+20&&Math.abs(point.x-(solid.x+solid.w))<=22)sides.add("right");
      }else{
        const distance=Math.hypot(point.x-solid.x,point.y-solid.y);
        if(distance>solid.r+24)continue;
        const angle=Math.atan2(point.y-solid.y,point.x-solid.x);
        sides.add(Math.abs(Math.cos(angle))>Math.abs(Math.sin(angle))?(Math.cos(angle)>0?"right":"left"):(Math.sin(angle)>0?"bottom":"top"));
      }
    }
    return sides;
  }
  function strokeShapeLockContacts(stroke,spec){
    const contacts=[];
    for(const solid of spec.solids){
      const sides=solidContactSides(stroke,solid),turn=nearbyTurn(stroke.points,solid);
      if(solid.kind==="platform"){
        const adjacent=(sides.has("top")&&(sides.has("left")||sides.has("right")))||(sides.has("bottom")&&(sides.has("left")||sides.has("right")));
        if(adjacent&&turn>=1.2)contacts.push(solid);
      }else if(sides.size>=2&&turn>=1.6)contacts.push(solid);
    }
    return contacts;
  }
  function strokeHasShapeLock(stroke,spec){
    const contacts=strokeShapeLockContacts(stroke,spec);
    if(contacts.length<2)return false;
    for(let a=0;a<contacts.length;a++)for(let b=a+1;b<contacts.length;b++){
      const first=contacts[a],second=contacts[b];
      const firstCenter=first.kind==="platform"?{x:first.x+first.w/2,y:first.y+first.h/2}:first;
      const secondCenter=second.kind==="platform"?{x:second.x+second.w/2,y:second.y+second.h/2}:second;
      if(Math.hypot(firstCenter.x-secondCenter.x,firstCenter.y-secondCenter.y)>=96)return true;
    }
    return false;
  }
  function refreshStrokeMobility(stroke,spec){
    stroke.lockContacts=strokeShapeLockContacts(stroke,spec).length;
    stroke.anchored=strokeHasShapeLock(stroke,spec);
    return stroke.anchored;
  }
  function tryMoveStroke(stroke,dx,dy,spec){
    if(stroke.anchored){stroke.blockedFlash=.3;return false}
    let fraction=1;
    if(!canTranslateStroke(stroke,dx,dy,spec)){
      let low=0,high=1;
      for(let attempt=0;attempt<8;attempt++){
        const middle=(low+high)/2;
        if(canTranslateStroke(stroke,dx*middle,dy*middle,spec))low=middle;else high=middle;
      }
      fraction=low;
      if(Math.hypot(dx*fraction,dy*fraction)<.2){stroke.blockedFlash=.3;return false}
    }
    dx*=fraction;dy*=fraction;
    stroke.points=stroke.points.map(point=>({x:point.x+dx,y:point.y+dy}));
    if(state.wallMoves===0)state.wallFirstMovedAt=state.elapsed;
    stroke.moves=(stroke.moves||0)+Math.hypot(dx,dy);state.wallMoves+=Math.hypot(dx,dy);
    state.navClock=0;state.nav=null;
    return true;
  }
  function flexStrokeFromImpact(stroke,contact,pushX,pushY,spec){
    if(stroke.anchored)return 0;
    const pushDistance=Math.hypot(pushX,pushY);if(pushDistance<.2)return 0;
    const closed=stroke.points.length>3&&Math.hypot(stroke.points[0].x-stroke.points.at(-1).x,stroke.points[0].y-stroke.points.at(-1).y)<=34;
    const before=penetrationScoreForPoints(stroke.points,spec),tolerance=Math.max(.05,before*.002);
    const preferredAngle=Number.isFinite(stroke.flexAngle)?stroke.flexAngle:Math.atan2(pushY,pushX);
    const directions=[{x:pushX,y:pushY},...MOVE_DIRECTIONS.map(direction=>({x:direction.x*pushDistance,y:direction.y*pushDistance}))]
      .sort((a,b)=>Math.cos(Math.atan2(b.y,b.x)-preferredAngle)-Math.cos(Math.atan2(a.y,a.x)-preferredAngle));
    for(const direction of directions){
      const displaced=fraction=>{
      const points=stroke.points.map(point=>{
        const distance=Math.hypot(point.x-contact.x,point.y-contact.y),weight=.08+.92*Math.exp(-(distance*distance)/(2*165*165));
          return{x:point.x+direction.x*weight*fraction,y:point.y+direction.y*weight*fraction};
      });
      if(closed)points[points.length-1]={...points[0]};
      return points;
      };
      let low=0,high=1;
      for(let attempt=0;attempt<8;attempt++){
        const middle=(low+high)/2;
        if(penetrationScoreForPoints(displaced(middle),spec)<=before+tolerance)low=middle;else high=middle;
      }
      if(pushDistance*low<.2)continue;
      stroke.points=displaced(low);
      const movement=pushDistance*low;stroke.moves=(stroke.moves||0)+movement;state.wallMoves+=movement;
      stroke.flexAngle=Math.atan2(direction.y,direction.x);
      if(state.wallFirstMovedAt===null)state.wallFirstMovedAt=state.elapsed;
      state.navClock=0;state.nav=null;
      return movement;
    }
    stroke.blockedFlash=.2;return 0;
  }
  function peelSingleRoundAnchor(stroke,pushDistance,spec){
    if(stroke.anchored)return 0;
    const contacts=strokeShapeLockContacts(stroke,spec);
    if(contacts.length!==1||contacts[0].kind==="platform")return 0;
    const solid=contacts[0],before=penetrationScoreForPoints(stroke.points,spec),tolerance=Math.max(.05,before*.002);
    const closed=stroke.points.length>3&&Math.hypot(stroke.points[0].x-stroke.points.at(-1).x,stroke.points[0].y-stroke.points.at(-1).y)<=34;
    const contracted=fraction=>{
      const points=stroke.points.map(point=>{
        const dx=point.x-solid.x,dy=point.y-solid.y,distance=Math.hypot(dx,dy)||1;
        const nextDistance=Math.max(solid.r+12,distance-pushDistance*fraction);
        return{x:solid.x+dx/distance*nextDistance,y:solid.y+dy/distance*nextDistance};
      });
      if(closed)points[points.length-1]={...points[0]};
      return points;
    };
    let low=0,high=1;
    for(let attempt=0;attempt<8;attempt++){
      const middle=(low+high)/2;
      if(penetrationScoreForPoints(contracted(middle),spec)<=before+tolerance)low=middle;else high=middle;
    }
    const movement=pushDistance*low;if(movement<.2)return 0;
    stroke.points=contracted(low);stroke.moves=(stroke.moves||0)+movement;state.wallMoves+=movement;
    if(state.wallFirstMovedAt===null)state.wallFirstMovedAt=state.elapsed;
    state.navClock=0;state.nav=null;return movement;
  }
  function rotatedPoints(points,center,angle){
    const cosine=Math.cos(angle),sine=Math.sin(angle);
    return points.map(point=>{
      const x=point.x-center.x,y=point.y-center.y;
      return{x:center.x+x*cosine-y*sine,y:center.y+x*sine+y*cosine};
    });
  }
  function canRotateStroke(stroke,center,angle,spec){
    const samples=sampledStrokePoints(stroke.points),before=penetrationScoreForSamples(samples,spec),tolerance=Math.max(.05,before*.002),radius=Math.max(1,...samples.map(point=>Math.hypot(point.x-center.x,point.y-center.y))),steps=Math.max(1,Math.ceil(radius*Math.abs(angle)/3));
    for(let step=1;step<=steps;step++)if(penetrationScoreForSamples(rotatedPoints(samples,center,angle*step/steps),spec)>before+tolerance)return false;
    return true;
  }
  function rotateStrokeFromImpact(stroke,contact,pushX,pushY,spec){
    const center=stroke.points.reduce((sum,point)=>({x:sum.x+point.x/stroke.points.length,y:sum.y+point.y/stroke.points.length}),{x:0,y:0});
    const radius=Math.max(1,...stroke.points.map(point=>Math.hypot(point.x-center.x,point.y-center.y)));
    const torque=(contact.x-center.x)*pushY-(contact.y-center.y)*pushX;
    const impulse=Math.hypot(pushX,pushY)||1;
    const maxAngle=Math.min(.065,8/radius);
    let angle=Math.max(-maxAngle,Math.min(maxAngle,torque/(radius*impulse)*.065));
    if(Math.abs(angle)<.002)return 0;
    let fraction=1;
    if(!canRotateStroke(stroke,center,angle,spec)){
      let low=0,high=1;
      for(let attempt=0;attempt<8;attempt++){
        const middle=(low+high)/2;
        if(canRotateStroke(stroke,center,angle*middle,spec))low=middle;else high=middle;
      }
      fraction=low;
      if(radius*Math.abs(angle*fraction)<.2){stroke.blockedFlash=.2;return 0}
    }
    angle*=fraction;stroke.points=rotatedPoints(stroke.points,center,angle);
    const movement=radius*Math.abs(angle);stroke.moves=(stroke.moves||0)+movement;state.wallMoves+=movement;
    return movement;
  }
  function resolveBeeSolid(bee,spec){
    const radius=18;
    for(const solid of spec.solids){
      if(solid.kind==="platform"){
        const left=solid.x-radius,right=solid.x+solid.w+radius,top=solid.y-radius,bottom=solid.y+solid.h+radius;
        if(bee.x<left||bee.x>right||bee.y<top||bee.y>bottom)continue;
        const exits=[{d:Math.abs(bee.x-left),x:left,y:bee.y,nx:-1,ny:0},{d:Math.abs(right-bee.x),x:right,y:bee.y,nx:1,ny:0},{d:Math.abs(bee.y-top),x:bee.x,y:top,nx:0,ny:-1},{d:Math.abs(bottom-bee.y),x:bee.x,y:bottom,nx:0,ny:1}].sort((a,b)=>a.d-b.d)[0];
        bee.x=exits.x;bee.y=exits.y;
        const dot=bee.vx*exits.nx+bee.vy*exits.ny;if(dot<0){bee.vx-=1.7*dot*exits.nx;bee.vy-=1.7*dot*exits.ny}
        return true;
      }
      const dx=bee.x-solid.x,dy=bee.y-solid.y,distance=Math.hypot(dx,dy)||1,limit=solid.r+radius;
      if(distance>=limit)continue;
      const nx=dx/distance,ny=dy/distance;bee.x=solid.x+nx*limit;bee.y=solid.y+ny*limit;
      const dot=bee.vx*nx+bee.vy*ny;if(dot<0){bee.vx-=1.7*dot*nx;bee.vy-=1.7*dot*ny}
      return true;
    }
    return false;
  }
  function obstacleAvoidance(bee,spec){
    let ax=0,ay=0;
    for(const solid of spec.solids){
      const cx=solid.kind==="platform"?solid.x+solid.w/2:solid.x,cy=solid.kind==="platform"?solid.y+solid.h/2:solid.y;
      const dx=cx-bee.x,dy=cy-bee.y,distance=Math.hypot(dx,dy)||1;
      const reach=solid.kind==="platform"?Math.max(solid.w,solid.h)*.65+80:solid.r+95;
      if(distance>reach)continue;
      const forward=(dx*bee.vx+dy*bee.vy)/(distance*(Math.hypot(bee.vx,bee.vy)||1));
      if(forward<.18)continue;
      const strength=(1-distance/reach)*spec.speed*.9;
      ax+=-dy/distance*strength*bee.route;ay+=dx/distance*strength*bee.route;
    }
    return{ax,ay};
  }
  function solidDetourTarget(bee,spec){
    const dog=spec.dog,dx=dog.x-bee.x,dy=dog.y-bee.y,lengthSquared=dx*dx+dy*dy||1;
    const candidates=[];
    for(const solid of spec.solids){
      const cx=solid.kind==="platform"?solid.x+solid.w/2:solid.x,cy=solid.kind==="platform"?solid.y+solid.h/2:solid.y;
      const t=Math.max(0,Math.min(1,((cx-bee.x)*dx+(cy-bee.y)*dy)/lengthSquared));
      if(t<=.02||t>=.98)continue;
      let blocks=false;
      if(solid.kind==="platform"){
        for(let step=1;step<12;step++)if(pointHitsSolid({x:bee.x+dx*step/12,y:bee.y+dy*step/12},solid,28)){blocks=true;break}
      }else blocks=nearestOnSegment(solid.x,solid.y,bee,dog).d<=solid.r+32;
      if(blocks)candidates.push({solid,t});
    }
    candidates.sort((a,b)=>a.t-b.t);
    const solid=candidates[0]?.solid;if(!solid)return dog;
    if(solid.kind==="platform"){
      const sideX=bee.route<0?solid.x-55:solid.x+solid.w+55;
      const sideY=dog.y>solid.y+solid.h/2?solid.y+solid.h+52:solid.y-52;
      return{x:sideX,y:sideY};
    }
    const length=Math.sqrt(lengthSquared),perpX=-dy/length,perpY=dx/length,clearance=solid.r+54;
    return{x:solid.x+perpX*clearance*bee.route+dx/length*24,y:solid.y+perpY*clearance*bee.route+dy/length*24};
  }
  function pointHitsStroke(point,stroke,margin=22){
    for(let index=1;index<stroke.points.length;index++){
      if(nearestOnSegment(point.x,point.y,stroke.points[index-1],stroke.points[index]).d<=margin)return true;
    }
    return false;
  }
  function buildNavigationField(spec,goalPoint=spec.dog,goalPredicate=null){
    const cell=20,cols=50,rows=31,total=cols*rows,blocked=new Uint8Array(total),distance=new Int16Array(total);
    distance.fill(-1);
    const strokes=state.strokes;
    for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
      const x=col*cell+cell/2,y=row*cell+cell/2,index=row*cols+col;
      const solidBlocked=spec.solids.some(solid=>pointHitsSolid({x,y},solid,19));
      const lineBlocked=strokes.some(stroke=>pointHitsStroke({x,y},stroke,30));
      blocked[index]=solidBlocked||lineBlocked?1:0;
    }
    const queue=new Int16Array(total);let head=0,tail=0,reachable=0;
    if(goalPredicate){
      for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
        const index=row*cols+col,point={x:col*cell+cell/2,y:row*cell+cell/2};
        if(blocked[index]||!goalPredicate(point))continue;
        queue[tail++]=index;distance[index]=0;
      }
    }else{
      const goal=goalPoint||spec.dog;
      let goalCol=Math.max(0,Math.min(cols-1,Math.floor(goal.x/cell))),goalRow=Math.max(0,Math.min(rows-1,Math.floor(goal.y/cell)));
      if(blocked[goalRow*cols+goalCol]){
        outer:for(let radius=1;radius<5;radius++)for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++){
          const col=goalCol+dx,row=goalRow+dy;if(col<0||col>=cols||row<0||row>=rows||blocked[row*cols+col])continue;
          goalCol=col;goalRow=row;break outer;
        }
      }
      const goalIndex=goalRow*cols+goalCol;queue[tail++]=goalIndex;distance[goalIndex]=0;
    }
    while(head<tail){
      const index=queue[head++],col=index%cols,row=Math.floor(index/cols);reachable++;
      for(const direction of MOVE_DIRECTIONS.filter((_,i)=>i%2===0)){
        const dx=Math.round(direction.x),dy=Math.round(direction.y),nextCol=col+dx,nextRow=row+dy;
        if(nextCol<0||nextCol>=cols||nextRow<0||nextRow>=rows)continue;
        const next=nextRow*cols+nextCol;if(blocked[next]||distance[next]>=0)continue;
        if(dx&&dy&&(blocked[row*cols+nextCol]||blocked[nextRow*cols+col]))continue;
        distance[next]=distance[index]+1;queue[tail++]=next;
      }
    }
    return{cell,cols,rows,blocked,distance,reachable};
  }
  function navigationDirection(field,x,y){
    const col=Math.max(0,Math.min(field.cols-1,Math.floor(x/field.cell))),row=Math.max(0,Math.min(field.rows-1,Math.floor(y/field.cell)));
    let best=null,bestDistance=Infinity;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
      const nextCol=col+dx,nextRow=row+dy;if(nextCol<0||nextCol>=field.cols||nextRow<0||nextRow>=field.rows)continue;
      const index=nextRow*field.cols+nextCol,value=field.distance[index];if(value<0||value>=bestDistance)continue;
      if(dx&&dy&&(field.blocked[row*field.cols+nextCol]||field.blocked[nextRow*field.cols+col]))continue;
      bestDistance=value;best={x:nextCol*field.cell+field.cell/2,y:nextRow*field.cell+field.cell/2,distance:value};
    }
    return best;
  }
  function closestStrokePoint(stroke,point){
    let best={x:stroke.points[0].x,y:stroke.points[0].y,d:Infinity};
    for(let index=1;index<stroke.points.length;index++){
      const candidate=nearestOnSegment(point.x,point.y,stroke.points[index-1],stroke.points[index]);
      if(candidate.d<best.d)best={...candidate,segmentIndex:index};
    }
    return best;
  }
  function segmentIntersection(a,b,c,d){
    const rx=b.x-a.x,ry=b.y-a.y,sx=d.x-c.x,sy=d.y-c.y,denominator=rx*sy-ry*sx;
    if(Math.abs(denominator)<.0001)return null;
    const qx=c.x-a.x,qy=c.y-a.y,t=(qx*sy-qy*sx)/denominator,u=(qx*ry-qy*rx)/denominator;
    if(t<0||t>1||u<0||u>1)return null;
    return{x:a.x+t*rx,y:a.y+t*ry};
  }
  function strokeCollision(stroke,start,end,limit){
    let nearest=null,earliestCrossing=null;
    for(let index=1;index<stroke.points.length;index++){
      const a=stroke.points[index-1],b=stroke.points[index],hit=nearestOnSegment(end.x,end.y,a,b),crossing=segmentIntersection(start,end,a,b);
      if(crossing){
        const travel=Math.hypot(crossing.x-start.x,crossing.y-start.y);
        if(!earliestCrossing||travel<earliestCrossing.travel)earliestCrossing={hit,crossing,contact:crossing,segmentIndex:index,travel};
      }else if(hit.d<=limit&&(!nearest||hit.d<nearest.hit.d))nearest={hit,crossing:null,contact:hit,segmentIndex:index};
    }
    return earliestCrossing||nearest;
  }
  function chooseWallMover(spec,bees){
    const center={x:bees.reduce((sum,bee)=>sum+bee.x,0)/bees.length,y:bees.reduce((sum,bee)=>sum+bee.y,0)/bees.length};
    const candidates=state.strokes.filter(stroke=>!stroke.anchored&&PUSH_DIRECTIONS.some(direction=>canTranslateStroke(stroke,direction.x*10,direction.y*10,spec))).sort((a,b)=>closestStrokePoint(a,center).d-closestStrokePoint(b,center).d);
    const stroke=candidates[0];if(!stroke)return null;
    const desiredDirectionIndex=preferredPushDirectionIndex(stroke,spec);
    const directionIndex=canTranslateStroke(stroke,PUSH_DIRECTIONS[desiredDirectionIndex].x*8,PUSH_DIRECTIONS[desiredDirectionIndex].y*8,spec)
      ?desiredDirectionIndex:escapePushDirectionIndex(stroke,spec);
    return{stroke,directionIndex,desiredDirectionIndex,phase:"gather",cohort:[],maxAttached:0};
  }
  function separateBeeFromWalls(bee){
    for(let s=state.strokes.length-1;s>=0;s--){
      const stroke=state.strokes[s];
      const start={x:Number.isFinite(bee.prevX)?bee.prevX:bee.x,y:Number.isFinite(bee.prevY)?bee.prevY:bee.y},end={x:bee.x,y:bee.y},collision=strokeCollision(stroke,start,end,22);
      if(collision){
        const {hit,contact,segmentIndex}=collision,previousHit=nearestOnSegment(start.x,start.y,stroke.points[segmentIndex-1],stroke.points[segmentIndex]);
        const side=previousHit.nx*(start.x-previousHit.x)+previousHit.ny*(start.y-previousHit.y);
        const sign=Math.abs(side)>.001?(side>0?1:-1):(bee.vx*hit.nx+bee.vy*hit.ny>0?-1:1),nx=hit.nx*sign,ny=hit.ny*sign,dot=bee.vx*nx+bee.vy*ny;
        if(dot<0){bee.vx-=1.55*dot*nx;bee.vy-=1.55*dot*ny}
        bee.x=contact.x+nx*22;bee.y=contact.y+ny*22;bee.bounced=true;state.beeWallCorrections++;return true;
      }
    }
    return false;
  }
  function activeWallSupport(stroke){
    const supporters=state.bees.filter(candidate=>!candidate.routeOpen&&closestStrokePoint(stroke,candidate).d<=72);
    for(const supporter of supporters){supporter.attachedStroke=stroke;if(supporter!==state.mover?.bee)supporter.intent="supportWall"}
    state.maxGroupAttached=Math.max(state.maxGroupAttached,supporters.length);
    return supporters;
  }
  function carrySupportersWithStroke(stroke,supporters,beforeContacts,dt){
    const frameTime=Math.max(.012,dt||1/60);
    for(const supporter of supporters){
      const before=beforeContacts.get(supporter);if(!before||before.d>34)continue;
      const oldX=supporter.x,oldY=supporter.y,side=before.nx*(oldX-before.x)+before.ny*(oldY-before.y),sign=Math.abs(side)>.001?(side>0?1:-1):1;
      const segmentIndex=clamp(before.segmentIndex||1,1,stroke.points.length-1),after=nearestOnSegment(supporter.x,supporter.y,stroke.points[segmentIndex-1],stroke.points[segmentIndex]);
      supporter.x=after.x+after.nx*sign*22;supporter.y=after.y+after.ny*sign*22;
      const dx=supporter.x-oldX,dy=supporter.y-oldY;
      supporter.prevX=(Number.isFinite(supporter.prevX)?supporter.prevX:oldX)+dx;supporter.prevY=(Number.isFinite(supporter.prevY)?supporter.prevY:oldY)+dy;supporter.vx=dx/frameTime;supporter.vy=dy/frameTime;
      supporter.cooldown=0;supporter.wallSlide=0;supporter.bounced=false;supporter.attachedStroke=stroke;
      state.supporterCarryDistance+=Math.hypot(dx,dy);
    }
  }
  function collideLine(bee,dt=1/60){
    const canImpact=bee.cooldown<=0||state.mover?.bee===bee;
    const spec=level(stageIndex);
    for(let s=state.strokes.length-1;s>=0;s--){
      const stroke=state.strokes[s];
      const start={x:Number.isFinite(bee.prevX)?bee.prevX:bee.x,y:Number.isFinite(bee.prevY)?bee.prevY:bee.y},end={x:bee.x,y:bee.y},collision=strokeCollision(stroke,start,end,27);
      if(collision){
        const {hit,contact,segmentIndex}=collision,previousHit=nearestOnSegment(start.x,start.y,stroke.points[segmentIndex-1],stroke.points[segmentIndex]);
        const side=previousHit.nx*(start.x-previousHit.x)+previousHit.ny*(start.y-previousHit.y);
        const sign=Math.abs(side)>.001?(side>0?1:-1):(bee.vx*hit.nx+bee.vy*hit.ny>0?-1:1);
        const nx=hit.nx*sign,ny=hit.ny*sign,dot=bee.vx*nx+bee.vy*ny;
        if(!canImpact){
          if(dot<0){bee.vx-=1.7*dot*nx;bee.vy-=1.7*dot*ny}
          bee.x=contact.x+nx*22;bee.y=contact.y+ny*22;bee.bounced=true;return true;
        }
        state.wallImpactContacts++;
        if(bee.routeOpen||stroke.anchored){
          if(state.mover?.stroke===stroke&&state.mover.bee===bee)state.mover=null;
          if(dot<0){bee.vx-=1.9*dot*nx;bee.vy-=1.9*dot*ny}
          bee.vx+=nx*42;bee.vy+=ny*42;bee.cooldown=.14;stroke.blockedFlash=.16;
          bee.x=contact.x+nx*22;bee.y=contact.y+ny*22;bee.wallSlide=1.05;bee.bounced=true;stroke.flash=Math.max(stroke.flash,.12);return true;
        }
        const moverValid=state.mover&&state.mover.stroke===stroke&&state.bees.includes(state.mover.bee)&&!state.mover.bee.routeOpen&&closestStrokePoint(stroke,state.mover.bee).d<=82;
        if(!moverValid){state.mover={stroke,bee,lastContactFrame:state.frame,movedFrame:-1};state.carrierChanges++}
        if(state.mover.stroke!==stroke||state.mover.bee!==bee){
          bee.attachedStroke=stroke;bee.intent="supportWall";
          if(dot<0){bee.vx-=1.35*dot*nx;bee.vy-=1.35*dot*ny}
          bee.vx+=nx*4;bee.vy+=ny*4;bee.cooldown=.015;bee.x=contact.x+nx*22;bee.y=contact.y+ny*22;bee.wallSlide=.2;bee.bounced=true;stroke.flash=Math.max(stroke.flash,.12);return true;
        }
        state.mover.lastContactFrame=state.frame;bee.attachedStroke=stroke;bee.intent="moveWall";
        if(state.mover.movedFrame===state.frame){bee.x=contact.x+nx*22;bee.y=contact.y+ny*22;return true}
        state.mover.movedFrame=state.frame;state.frameWallMoveSolves++;state.wallMoveSolves++;state.maxFrameWallMoveSolves=Math.max(state.maxFrameWallMoveSolves,state.frameWallMoveSolves);
        const supporters=activeWallSupport(stroke);state.wallSupportContributions+=Math.max(0,supporters.length-1);
        const beforeContacts=new Map(supporters.map(supporter=>[supporter,closestStrokePoint(stroke,supporter)]));
        const pushDistance=Math.min(4.2,(82+Math.min(5,supporters.length)*12)*Math.max(.012,Math.min(.034,dt)));
        if(!Number.isInteger(stroke.pushDirectionIndex)){
          const escapeIndex=spanningWallEscapeDirectionIndex(stroke,spec);
          const preferredIndex=preferredPushDirectionIndex(stroke,spec);
          commitStrokePushDirection(stroke,escapeIndex>=0?escapeIndex:preferredIndex);
        }
        let pushDirection=PUSH_DIRECTIONS[stroke.pushDirectionIndex],pushX=pushDirection.x*pushDistance,pushY=pushDirection.y*pushDistance;
        let flexed=0;
        let moved=!bee.routeOpen&&!stroke.anchored&&tryMoveStroke(stroke,pushX,pushY,spec);
        if(!bee.routeOpen&&!stroke.anchored&&!moved){
          const escapeIndex=escapePushDirectionIndex(stroke,spec,stroke.pushDirectionIndex);
          if(escapeIndex>=0){
            commitStrokePushDirection(stroke,escapeIndex);pushDirection=PUSH_DIRECTIONS[escapeIndex];pushX=pushDirection.x*pushDistance;pushY=pushDirection.y*pushDistance;
            moved=tryMoveStroke(stroke,pushX,pushY,spec);
          }
        }
        if(!bee.routeOpen&&!stroke.anchored&&!moved){
          flexed=peelSingleRoundAnchor(stroke,pushDistance*1.8,spec)||flexStrokeFromImpact(stroke,contact,pushX,pushY,spec);moved=flexed>0;
          if(flexed&&Number.isFinite(stroke.flexAngle)){
            const flexDirection={x:Math.cos(stroke.flexAngle),y:Math.sin(stroke.flexAngle)};
            const flexIndex=PUSH_DIRECTIONS.reduce((best,direction,index)=>{
              const alignment=direction.x*flexDirection.x+direction.y*flexDirection.y;
              return alignment>best.alignment?{index,alignment}:best;
            },{index:stroke.pushDirectionIndex,alignment:-Infinity}).index;
            commitStrokePushDirection(stroke,flexIndex);
          }
        }
        if(moved){
          if(!flexed)rotateStrokeFromImpact(stroke,contact,pushX,pushY,spec);
          carrySupportersWithStroke(stroke,supporters,beforeContacts,dt);
          if(state.wallApproachStartedAt===null)state.wallApproachStartedAt=state.elapsed;
          state.maxGroupAttached=Math.max(state.maxGroupAttached,supporters.length||1);
          bee.cooldown=0;stroke.flash=.2;state.flash=.035;
          announce("barrierMoved");
        }else{
          if(dot<0){bee.vx-=1.9*dot*nx;bee.vy-=1.9*dot*ny}
          bee.vx+=nx*42;bee.vy+=ny*42;bee.cooldown=.14;stroke.blockedFlash=.16;
          if(!bee.routeOpen)announce("barrierHeld");
        }
        if(!moved){bee.x=contact.x+nx*22;bee.y=contact.y+ny*22}
        bee.wallSlide=moved?.5:1.05;bee.bounced=true;stroke.flash=Math.max(stroke.flash,.12);
        return true;
      }
    }
    return false;
  }
  function spawnBee(){
    const spec=level(stageIndex),hive=spec.hives[state.spawned%spec.hives.length],angle=(state.spawned%5-2)*.08;
    const dx=spec.dog.x-hive.x,dy=spec.dog.y-hive.y,length=Math.hypot(dx,dy)||1;
    state.bees.push({id:state.spawned+1,x:hive.x,y:hive.y+35,vx:dx/length*spec.speed+angle*spec.speed,vy:dy/length*spec.speed,life:0,cooldown:0,wallSlide:0,bounced:false,phase:state.spawned*.73,route:state.spawned%2?1:-1,intent:"attack"});
    state.spawned++;
  }
  function barrierSeparatesBeeFromPip(bee,dog){
    return state.strokes.some(stroke=>stroke.anchored&&stroke.points.some((point,index)=>index>0&&segmentIntersection(bee,dog,stroke.points[index-1],point)));
  }
  function beeTouchesPip(bee,dog){
    if(barrierSeparatesBeeFromPip(bee,dog))return false;
    const rect=canvas.getBoundingClientRect(),physicalX=Math.max(.0001,rect.width/1000),physicalY=Math.max(.0001,rect.height/620),uniform=Math.sqrt(physicalX*physicalY);
    const dx=(bee.x-dog.x)*physicalX/uniform,dy=(bee.y-dog.y)*physicalY/uniform;
    return Math.hypot(dx,dy)<=PIP_CONTACT_RADIUS;
  }
  function nearestLooseWallContact(strokes,bee){
    let best=null;
    for(const stroke of strokes){
      const contact=closestStrokePoint(stroke,bee);
      if(!best||contact.d<best.d)best={...contact,stroke};
    }
    return best;
  }
  function directWallContactIsClear(bee,contact,spec){
    for(let step=1;step<6;step++){
      const progress=step/6,point={x:bee.x+(contact.x-bee.x)*progress,y:bee.y+(contact.y-bee.y)*progress};
      if(spec.solids.some(solid=>pointHitsSolid(point,solid,20)))return false;
    }
    return true;
  }
  function update(dt){
    if(state.paused||state.modal||state.result||!state.started)return;
    if(state.mode!=="wave")return;
    const spec=level(stageIndex);state.frame++;state.frameWallMoveSolves=0;state.elapsed+=dt;state.spawnClock+=dt;state.nectar=Math.min(100,state.nectar+dt*1.35);
    if(state.spawnClock>=spec.interval&&state.spawned<spec.maxBees){state.spawnClock=0;spawnBee()}
    if(state.mover&&(!state.bees.includes(state.mover.bee)||state.mover.stroke.anchored))state.mover=null;
    state.navClock-=dt;state.wallNavClock-=dt;
    if(!state.nav||state.navClock<=0){state.nav=buildNavigationField(spec);state.navClock=.08}
    const looseStrokes=state.strokes.filter(stroke=>!stroke.anchored);
    for(const bee of state.bees){
      bee.life+=dt;bee.cooldown=Math.max(0,bee.cooldown-dt);bee.wallSlide=Math.max(0,(bee.wallSlide||0)-dt);bee.intent="attack";bee.attachedStroke=null;
      if(!state.nav){state.nav=buildNavigationField(spec);state.navClock=.08}
      const waypoint=navigationDirection(state.nav,bee.x,bee.y);bee.routeOpen=Boolean(waypoint);
      if(bee.routeOpen&&state.wallMoves>0&&state.pathOpenedAt===null){state.pathOpenedAt=state.elapsed;announce("pathFound")}
      let wallTarget=null;
      if(!bee.routeOpen&&looseStrokes.length){
        const ownContact=nearestLooseWallContact(looseStrokes,bee);
        if(ownContact&&ownContact.d<=180&&directWallContactIsClear(bee,ownContact,spec)){
          wallTarget=ownContact;state.directWallTargets++;
        }else{
          if(!state.wallNav||state.wallNavClock<=0){
            state.wallNav=buildNavigationField(spec,null,point=>looseStrokes.some(stroke=>closestStrokePoint(stroke,point).d<=30));state.wallNavClock=.14;state.wallNavBuilds++;
          }
          wallTarget=navigationDirection(state.wallNav,bee.x,bee.y);
        }
      }
      const target=waypoint||wallTarget||solidDetourTarget(bee,spec),dx=target.x-bee.x,dy=target.y-bee.y,length=Math.hypot(dx,dy)||1;
      const sideX=-dy/length,sideY=dx/length;
      const navigating=bee.routeOpen||Boolean(wallTarget);
      const slide=navigating?0:bee.wallSlide>0?bee.route*spec.flank*.72:Math.sin(bee.life*1.8+bee.phase)*Math.min(9,spec.flank*.2);
      const avoid=bee.routeOpen?{ax:0,ay:0}:obstacleAvoidance(bee,spec),steer=bee.routeOpen?12:wallTarget?9:bee.wallSlide>0?5.4:(bee.bounced?6.2:6.8);
      const desiredSpeed=spec.speed*(bee.routeOpen?2.25:wallTarget?2.15:1.8);
      const desiredX=dx/length*desiredSpeed+sideX*slide,desiredY=dy/length*desiredSpeed+sideY*slide;
      bee.vx+=(desiredX-bee.vx)*dt*steer+avoid.ax*dt;bee.vy+=(desiredY-bee.vy)*dt*steer+avoid.ay*dt;
      bee.vx+=Math.sin(bee.life*3+bee.phase)*spec.gust*dt*.18;
      const zone=spec.zones.find(item=>bee.x>=item.x&&bee.x<=item.x+item.w&&bee.y>=item.y&&bee.y<=item.y+item.h);
      if(zone?.kind==="water"){bee.vx*=Math.max(.5,1-dt*2.8);bee.vy*=Math.max(.5,1-dt*2.8)}
      else if(zone?.kind==="rough"||zone?.kind==="bramble"){bee.vx*=Math.max(.55,1-dt*2);bee.vy*=Math.max(.55,1-dt*2)}
      else if(zone?.kind==="wind"){bee.vx+=(zone.dx||0)*95*dt;bee.vy+=(zone.dy||0)*95*dt}
      bee.prevX=bee.x;bee.prevY=bee.y;bee.x+=bee.vx*dt;bee.y+=bee.vy*dt;resolveBeeSolid(bee,spec);collideLine(bee,dt);
      if(beeTouchesPip(bee,spec.dog)){finish(false);return}
    }
    for(const bee of state.bees)separateBeeFromWalls(bee);
    if(state.mover&&state.mover.bee.routeOpen)state.mover=null;
    state.bees=state.bees.filter(bee=>bee.life<18&&bee.x>-80&&bee.x<1080&&bee.y>-80&&bee.y<700);
    state.strokes.forEach(stroke=>{stroke.flash=Math.max(0,stroke.flash-dt);stroke.blockedFlash=Math.max(0,(stroke.blockedFlash||0)-dt)});
    state.flash=Math.max(0,state.flash-dt);
    if(state.nectar<16)announce("lowNectar");
    if(state.elapsed>=state.duration){finish(true);return}
    updateHud();
  }
  function scoreStars(){
    const used=100-state.nectar;
    if(used<=45)return 3;if(used<=72)return 2;return 1;
  }
  function finish(won){
    if(state.result)return;state.result={won,stars:won?scoreStars():0};state.mode="result";state.mover=null;for(const bee of state.bees){bee.intent="attack";bee.attachedStroke=null}
    const previous=save.stars[stageIndex]||0;let isBest=false;
    if(won){
      save.cleared[stageIndex]=true;save.unlocked=Math.max(save.unlocked,Math.min(30,stageIndex+2));
      if(state.result.stars>previous){save.stars[stageIndex]=state.result.stars;isBest=true}persist();updateMainProgress();
    }
    $("battleLive").inert=true;$("battleLive").hidden=true;$("resultPanel").hidden=false;
    $("resultTitle").textContent=fmt(won?"winTitle":"failTitle");
    $("resultStars").textContent=won?"★".repeat(state.result.stars)+"☆".repeat(3-state.result.stars):"☆☆☆";
    $("resultText").textContent=fmt(won?"winText":"failText",{stage:stageIndex+1,nectar:Math.round(state.nectar)});
    $("bestText").textContent=won?(isBest?fmt("newBest"):fmt("best",{stars:Math.max(previous,state.result.stars)})):"";
    $("nextBtn").disabled=!won||stageIndex>=29;$("nextBtn").setAttribute("aria-disabled",String($("nextBtn").disabled));
    announce(won?"protected":"touched");requestAnimationFrame(()=>$("resultStagesBtn").focus());
  }
  function loop(now){
    const dt=Math.min(.034,Math.max(0,(now-state.last)/1000));state.last=now;update(dt);draw();raf=requestAnimationFrame(loop);
  }

  const SPRITE_CROPS=[
    {x:70,y:115,w:420,h:330},{x:123,y:146,w:266,h:261},{x:20,y:22,w:475,h:455},
    {x:62,y:35,w:395,h:465},{x:54,y:28,w:410,h:465},{x:8,y:76,w:500,h:390},
  ];
  function drawSprite(cell,x,y,w,h,flip=false){
    if(!atlas.complete||!atlas.naturalWidth)return;
    const crop=SPRITE_CROPS[cell],sx=(cell%3)*512+crop.x,sy=Math.floor(cell/3)*512+crop.y;
    const rect=canvas.getBoundingClientRect(),physicalX=Math.max(.0001,rect.width/1000),physicalY=Math.max(.0001,rect.height/620),uniform=Math.sqrt(physicalX*physicalY);
    const physicalScale=Math.min((w*uniform)/crop.w,(h*uniform)/crop.h);
    const dw=crop.w*physicalScale/physicalX,dh=crop.h*physicalScale/physicalY,dx=x+(w-dw)/2,dy=y+(h-dh)/2;
    ctx.save();
    if(flip){ctx.translate(dx+dw,dy);ctx.scale(-1,1);ctx.drawImage(atlas,sx,sy,crop.w,crop.h,0,0,dw,dh)}
    else ctx.drawImage(atlas,sx,sy,crop.w,crop.h,dx,dy,dw,dh);
    ctx.restore();
  }
  function wallRamVisual(bee){
    if(!bee.attachedStroke||(bee.intent!=="moveWall"&&bee.intent!=="supportWall"))return{x:bee.x,y:bee.y,scaleX:1,scaleY:1,phase:"flight",offset:0};
    const contact=closestStrokePoint(bee.attachedStroke,bee),distance=Math.max(.001,Math.hypot(bee.x-contact.x,bee.y-contact.y));
    const nx=(bee.x-contact.x)/distance,ny=(bee.y-contact.y)/distance,duration=.56,phase=((bee.life+(bee.id||0)*.031)%duration)/duration;
    let offset=0,scaleX=1,scaleY=1,name="recover";
    if(phase<.4){const t=phase/.4,eased=1-(1-t)*(1-t);offset=18*eased;name="recoil"}
    else if(phase<.72){const t=(phase-.4)/.32,eased=t*t*(3-2*t);offset=18*(1-eased);name="charge"}
    else if(phase<.84){const pulse=Math.sin((phase-.72)/.12*Math.PI);scaleX=1+pulse*.13;scaleY=1-pulse*.1;name="impact"}
    return{x:bee.x+nx*offset,y:bee.y+ny*offset,scaleX,scaleY,phase:name,offset,faceX:contact.x-bee.x,faceY:contact.y-bee.y};
  }
  function drawBee(bee){
    if(!atlas.complete||!atlas.naturalWidth)return;
    const crop=SPRITE_CROPS[1],centroid={x:133.44,y:137.67},sx=512+crop.x,sy=crop.y,rect=canvas.getBoundingClientRect();
    const physicalX=Math.max(.0001,rect.width/1000),physicalY=Math.max(.0001,rect.height/620),uniform=Math.sqrt(physicalX*physicalY);
    const physicalWidth=58*uniform,physicalHeight=physicalWidth*crop.h/crop.w,dw=physicalWidth/physicalX,dh=physicalHeight/physicalY;
    const ram=wallRamVisual(bee),faceX=Number.isFinite(ram.faceX)?ram.faceX:bee.vx,faceY=Number.isFinite(ram.faceY)?ram.faceY:bee.vy;
    const facing=faceX<0?-1:1,tilt=Math.max(-.58,Math.min(.58,Math.atan2(faceY,Math.abs(faceX)||1))),cos=Math.cos(tilt),sin=Math.sin(tilt);
    ctx.save();ctx.translate(ram.x,ram.y);
    ctx.transform(cos*facing,sin*facing*physicalX/physicalY,-sin*physicalY/physicalX,cos,0,0);
    ctx.scale(ram.scaleX,ram.scaleY);
    ctx.drawImage(atlas,sx,sy,crop.w,crop.h,-centroid.x/crop.w*dw,-centroid.y/crop.h*dh,dw,dh);
    ctx.restore();
  }
  function drawTerrain(spec){
    ctx.save();ctx.globalCompositeOperation="soft-light";ctx.globalAlpha=.12;ctx.fillStyle=spec.theme.sky;ctx.fillRect(0,0,1000,620);ctx.restore();
    for(const zone of spec.zones){
      ctx.save();ctx.beginPath();ctx.roundRect(zone.x,zone.y,zone.w,zone.h,28);ctx.clip();
      if(zone.kind==="water"){
        ctx.fillStyle="rgba(37,169,214,.38)";ctx.fillRect(zone.x,zone.y,zone.w,zone.h);ctx.strokeStyle="rgba(191,247,255,.72)";ctx.lineWidth=5;
        for(let y=zone.y+18;y<zone.y+zone.h;y+=32){ctx.beginPath();for(let x=zone.x-20;x<=zone.x+zone.w+20;x+=28){const waveY=y+Math.sin((x+y)*.045)*5;x===zone.x-20?ctx.moveTo(x,waveY):ctx.lineTo(x,waveY)}ctx.stroke()}
      }else if(zone.kind==="wind"){
        ctx.fillStyle="rgba(166,224,255,.12)";ctx.fillRect(zone.x,zone.y,zone.w,zone.h);ctx.strokeStyle="rgba(220,250,255,.55)";ctx.lineWidth=4;const horizontal=Math.abs(zone.dx||0)>=Math.abs(zone.dy||0);
        for(let offset=24;offset<(horizontal?zone.h:zone.w);offset+=42){ctx.beginPath();if(horizontal){const from=zone.dx>=0?zone.x+18:zone.x+zone.w-18,to=zone.dx>=0?zone.x+zone.w-18:zone.x+18;ctx.moveTo(from,zone.y+offset);ctx.lineTo(to,zone.y+offset)}else{const from=zone.dy>=0?zone.y+18:zone.y+zone.h-18,to=zone.dy>=0?zone.y+zone.h-18:zone.y+18;ctx.moveTo(zone.x+offset,from);ctx.lineTo(zone.x+offset,to)}ctx.stroke()}
      }else if(zone.kind==="bramble"){
        ctx.fillStyle="rgba(75,23,69,.38)";ctx.fillRect(zone.x,zone.y,zone.w,zone.h);ctx.strokeStyle="rgba(255,145,213,.52)";ctx.lineWidth=5;for(let x=zone.x;x<zone.x+zone.w+40;x+=38){ctx.beginPath();ctx.moveTo(x,zone.y+zone.h);ctx.lineTo(x+45,zone.y);ctx.stroke()}
      }else if(zone.kind==="rough"){
        ctx.fillStyle="rgba(76,68,37,.34)";ctx.fillRect(zone.x,zone.y,zone.w,zone.h);ctx.fillStyle="rgba(236,215,144,.38)";for(let y=zone.y+18;y<zone.y+zone.h;y+=38)for(let x=zone.x+18;x<zone.x+zone.w;x+=44){ctx.beginPath();ctx.arc(x+(y%2)*.35,y,7,0,Math.PI*2);ctx.fill()}
      }else if(zone.kind==="ruins"){
        ctx.fillStyle="rgba(255,224,150,.045)";ctx.fillRect(zone.x,zone.y,zone.w,zone.h);ctx.strokeStyle="rgba(255,239,192,.18)";ctx.lineWidth=2;const cx=zone.x+zone.w/2,cy=zone.y+zone.h/2,max=Math.min(zone.w,zone.h)*.42;for(let radius=34;radius<=max;radius+=42){ctx.beginPath();ctx.arc(cx,cy,radius,0,Math.PI*2);ctx.stroke()}ctx.beginPath();ctx.moveTo(cx-max,cy);ctx.lineTo(cx+max,cy);ctx.moveTo(cx,cy-max);ctx.lineTo(cx,cy+max);ctx.stroke()
      }else{
        ctx.fillStyle="rgba(209,255,154,.12)";ctx.fillRect(zone.x,zone.y,zone.w,zone.h);ctx.fillStyle="rgba(255,241,128,.45)";for(let y=zone.y+20;y<zone.y+zone.h;y+=45)for(let x=zone.x+20;x<zone.x+zone.w;x+=48){ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fill()}
      }
      ctx.restore();
    }
  }
  function draw(){
    const spec=level(stageIndex);ctx.clearRect(0,0,1000,620);
    const sceneBackground=themeBackgrounds[spec.chapter];
    if(sceneBackground.complete&&sceneBackground.naturalWidth){
      const rect=canvas.getBoundingClientRect(),targetAspect=rect.width/Math.max(1,rect.height),sourceAspect=sceneBackground.naturalWidth/sceneBackground.naturalHeight;
      let sx=0,sy=0,sw=sceneBackground.naturalWidth,sh=sceneBackground.naturalHeight;
      if(sourceAspect>targetAspect){sw=sh*targetAspect;sx=(sceneBackground.naturalWidth-sw)/2}
      else{sh=sw/targetAspect;sy=(sceneBackground.naturalHeight-sh)/2}
      ctx.drawImage(sceneBackground,sx,sy,sw,sh,0,0,1000,620);
    }else{ctx.fillStyle="#3a8b59";ctx.fillRect(0,0,1000,620)}
    drawTerrain(spec);ctx.fillStyle="rgba(7,39,29,.12)";ctx.fillRect(0,0,1000,620);
    for(const platform of spec.platforms){
      if(spec.theme.terrain==="brook"){ctx.save();ctx.fillStyle="#a96f35";ctx.strokeStyle="#ffe49b";ctx.lineWidth=5;ctx.beginPath();ctx.roundRect(platform.x,platform.y,platform.w,platform.h,14);ctx.fill();ctx.stroke();for(let x=platform.x+22;x<platform.x+platform.w;x+=34){ctx.beginPath();ctx.moveTo(x,platform.y+5);ctx.lineTo(x,platform.y+platform.h-5);ctx.stroke()}ctx.restore()}
      else if(spec.theme.terrain==="wind"){ctx.save();ctx.fillStyle="rgba(184,241,255,.78)";ctx.strokeStyle="#ecffff";ctx.lineWidth=5;ctx.beginPath();ctx.roundRect(platform.x,platform.y,platform.w,platform.h,28);ctx.fill();ctx.stroke();ctx.restore()}
      else if(spec.theme.terrain==="bramble"){ctx.save();ctx.fillStyle="#512847";ctx.strokeStyle="#ff9fcf";ctx.lineWidth=5;ctx.beginPath();ctx.roundRect(platform.x,platform.y,platform.w,platform.h,18);ctx.fill();ctx.stroke();ctx.restore()}
      else if(spec.theme.terrain==="ruins"){ctx.save();ctx.fillStyle="#8b6c45";ctx.strokeStyle="#f9d98e";ctx.lineWidth=5;ctx.beginPath();ctx.roundRect(platform.x,platform.y,platform.w,platform.h,8);ctx.fill();ctx.stroke();ctx.restore()}
      else drawSprite(5,platform.x,platform.y-72,platform.w,platform.h+110);
    }
    for(const anchor of spec.anchors){if(spec.theme.terrain==="bramble"){ctx.save();ctx.fillStyle="#552245";ctx.strokeStyle="#ff9ed4";ctx.lineWidth=6;ctx.beginPath();ctx.arc(anchor.x,anchor.y,anchor.r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore()}else drawSprite(3,anchor.x-48,anchor.y-48,96,96)}
    for(const gate of spec.gates){if(spec.theme.terrain==="ruins"){ctx.save();ctx.strokeStyle="#ffe09a";ctx.lineWidth=14;ctx.beginPath();ctx.arc(gate.x,gate.y,gate.r,Math.PI,0);ctx.stroke();ctx.restore()}else drawSprite(4,gate.x-52,gate.y-58,104,116)}
    for(const hive of spec.hives)drawSprite(2,hive.x-75,hive.y-65,150,150);
    drawSprite(0,spec.dog.x-82,spec.dog.y-62,164,124);
    for(const bee of state.bees)drawBee(bee);
    const strokes=state.drawing?[...state.strokes,state.drawing]:state.strokes;
    ctx.lineCap="round";ctx.lineJoin="round";
    for(const stroke of strokes){
      if(stroke.points.length<2)continue;const moved=stroke.flash>0,blocked=stroke.anchored||stroke.blockedFlash>0;
      ctx.save();ctx.beginPath();stroke.points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
      ctx.strokeStyle=blocked?"#ffe47a":moved?"#b8fff3":"#6effdf";ctx.lineWidth=16;ctx.shadowColor=blocked?"#ffc83b":"#36f5cf";ctx.shadowBlur=moved?24:18;ctx.globalAlpha=.94;ctx.stroke();
      ctx.strokeStyle="#ecfff8";ctx.lineWidth=4;ctx.globalAlpha=.85;ctx.stroke();ctx.restore();
    }
    if(document.activeElement===canvas){
      ctx.save();ctx.strokeStyle="#fff";ctx.lineWidth=3;ctx.setLineDash([8,6]);ctx.beginPath();ctx.arc(state.keyboard.x,state.keyboard.y,19,0,Math.PI*2);ctx.stroke();ctx.restore();
    }
    if(state.flash>0){ctx.fillStyle=`rgba(91,255,226,${state.flash})`;ctx.fillRect(0,0,1000,620)}
  }

  function openModal(panel,focusId){
    state.modal=true;state.paused=true;$("battleLive").inert=true;panel.hidden=false;requestAnimationFrame(()=>$(focusId)?.focus());
  }
  function closeModal(panel,restoreId){
    panel.hidden=true;state.modal=false;state.paused=false;$("battleLive").inert=false;requestAnimationFrame(()=>$(restoreId)?.focus());
  }
  $("startBtn").addEventListener("click",()=>{
    selectedStage=Math.min(29,save.unlocked-1);showScreen("stage");updateStageChapter();
    if(!safeGet(TUTORIAL_KEY)){tutorialReturnFocus=$("startBtn");$("tutorialPanel").hidden=false;requestAnimationFrame(()=>$("tutorialStartBtn").focus())}
  });
  $("stageBackBtn").addEventListener("click",()=>{showScreen("main");requestAnimationFrame(()=>$("startBtn").focus())});
  $("battleBackBtn").addEventListener("click",()=>openModal($("leavePanel"),"leaveContinueBtn"));
  $("leaveContinueBtn").addEventListener("click",()=>closeModal($("leavePanel"),"battleBackBtn"));
  $("leaveStagesBtn").addEventListener("click",()=>{state.modal=false;state.paused=false;showScreen("stage");requestAnimationFrame(centerSelected)});
  $("pauseBtn").addEventListener("click",()=>openModal($("pausePanel"),"resumeBtn"));
  $("resumeBtn").addEventListener("click",()=>closeModal($("pausePanel"),"pauseBtn"));
  $("pauseHelpBtn").addEventListener("click",()=>{$("pausePanel").hidden=true;tutorialReturnFocus=$("pauseHelpBtn");$("tutorialPanel").hidden=false;requestAnimationFrame(()=>$("tutorialStartBtn").focus())});
  $("clearBtn").addEventListener("click",()=>{if(state.started)return;state.strokes=[];state.nectar=100;announce("ready");updateHud();draw()});
  $("restartBtn").addEventListener("click",resetStage);
  $("resultStagesBtn").addEventListener("click",()=>{selectedStage=Math.min(29,save.unlocked-1);showScreen("stage");requestAnimationFrame(centerSelected)});
  $("nextBtn").addEventListener("click",()=>{if(!$("nextBtn").disabled)startStage(stageIndex+1)});
  $("retryBtn").addEventListener("click",resetStage);
  function closeTutorial(){
    $("tutorialPanel").hidden=true;safeSet(TUTORIAL_KEY,"1");
    if(screen==="stage"){requestAnimationFrame(centerSelected)}else{state.paused=false;state.modal=false;$("battleLive").inert=false}
    tutorialReturnFocus?.focus?.();tutorialReturnFocus=null;
  }
  $("tutorialStartBtn").addEventListener("click",()=>{const fromStage=screen==="stage";closeTutorial();if(fromStage)startStage(selectedStage)});
  $("tutorialCloseBtn").addEventListener("click",closeTutorial);
  document.addEventListener("keydown",event=>{
    if(event.key!=="Escape")return;
    if(!$("tutorialPanel").hidden){closeTutorial();return}
    if(!$("leavePanel").hidden){closeModal($("leavePanel"),"battleBackBtn");return}
    if(!$("pausePanel").hidden){closeModal($("pausePanel"),"pauseBtn");return}
  });
  function suspendForeground(){
    if(screen==="battle"&&!state.result&&!state.modal)openModal($("pausePanel"),"resumeBtn");
  }
  window.addEventListener("blur",suspendForeground);
  window.addEventListener("pagehide",suspendForeground);
  document.addEventListener("visibilitychange",()=>{if(document.hidden)suspendForeground()});

  function loadAssets(){
    const sources=[[atlas,"../../assets/animal-honey-shield-sprites.webp"],...themeBackgrounds.map((image,index)=>[image,themeBackgroundSources[index]])];
    let settled=0;const done=()=>{settled++;$("loadingFill").style.width=`${settled/sources.length*100}%`;if(settled===sources.length)setTimeout(()=>{$("loadingPanel").hidden=true;applyLocale();draw()},120)};
    for(const [image,src] of sources){image.onload=done;image.onerror=done;image.src=src}
  }
  window.__animalHoneyShieldSmoke={
    startStage,resetStage,finish,snapshot:()=>({
      screen,stage:stageIndex+1,mode:state.mode,elapsed:state.elapsed,nectar:state.nectar,
      strokes:state.strokes.length,
      strokeLengths:state.strokes.map(stroke=>stroke.points.slice(1).reduce((sum,point,index)=>sum+Math.hypot(point.x-stroke.points[index].x,point.y-stroke.points[index].y),0)),
      strokeBounds:state.strokes.map(stroke=>({left:Math.min(...stroke.points.map(point=>point.x)),top:Math.min(...stroke.points.map(point=>point.y)),right:Math.max(...stroke.points.map(point=>point.x)),bottom:Math.max(...stroke.points.map(point=>point.y))})),
      strokePushDirections:state.strokes.map(stroke=>[...(stroke.pushDirectionHistory||[])]),
      strokePushDirectionChanges:state.strokes.map(stroke=>stroke.pushDirectionChanges||0),
      bees:state.bees.length,beeIntents:state.bees.map(bee=>bee.intent),attachedBees:state.bees.filter(bee=>bee.attachedStroke).length,
      wallMoves:state.wallMoves,wallApproachStartedAt:state.wallApproachStartedAt,wallFirstMovedAt:state.wallFirstMovedAt,maxGroupAttached:state.maxGroupAttached,pathOpenedAt:state.pathOpenedAt,wallImpactContacts:state.wallImpactContacts,wallMoveSolves:state.wallMoveSolves,wallSupportContributions:state.wallSupportContributions,maxFrameWallMoveSolves:state.maxFrameWallMoveSolves,carrierChanges:state.carrierChanges,beeWallCorrections:state.beeWallCorrections,wallNavBuilds:state.wallNavBuilds,directWallTargets:state.directWallTargets,supporterCarryDistance:state.supporterCarryDistance,activeCarrier:state.mover?.bee?.id||null,result:state.result,save:structuredClone(save)
    }),
    drawBarrier(x=650){state.strokes.push({points:[{x,y:190},{x,y:560}],flash:0,blockedFlash:0,moves:0,anchored:false});state.nectar=Math.max(0,state.nectar-52);beginWave();updateHud();draw()},
    protect(){state.strokes=[{points:[{x:300,y:315},{x:360,y:210},{x:640,y:210},{x:700,y:315},{x:680,y:560},{x:320,y:560},{x:300,y:315}],flash:0,blockedFlash:0,moves:0,anchored:true}];beginWave();state.nectar=40},
    advance(seconds){for(let t=0;t<seconds&&!state.result;t+=.02)update(.02);draw();return this.snapshot?.()},
    noDrawProbe(){startStage(0);this.advance(7);return this.snapshot()},
    wallProbe(){
      const free={points:[{x:790,y:210},{x:790,y:470}],flash:0,blockedFlash:0,moves:0,anchored:false};
      const freeBefore=free.points[0].x,freeMoved=tryMoveStroke(free,-20,0,level(0));
      const contact={points:[{x:710,y:335},{x:710,y:420}],flash:0,blockedFlash:0,moves:0,anchored:false};
      const contactBefore=contact.points[0].x,contactMoved=tryMoveStroke(contact,-50,0,level(2));
      const edge={points:[{x:4,y:220},{x:180,y:220}],flash:0,blockedFlash:0,moves:0,anchored:false};
      const edgeCanEscape=availableStrokeMoves(edge,{solids:[]},12).length>0;
      return{freeMoved,freeDistance:Math.abs(free.points[0].x-freeBefore),contactMoved,contactDistance:Math.abs(contact.points[0].x-contactBefore),edgeCanEscape};
    },
    shapeLockProbe(){
      const spec=level(2);
      const bridge={points:[{x:393,y:335},{x:607,y:335}],flash:0,blockedFlash:0,moves:0,anchored:false};
      refreshStrokeMobility(bridge,spec);
      const bridgeMoved=tryMoveStroke(bridge,0,-18,spec);
      const center={x:350,y:335},radius=64,loopPoints=[];
      for(let index=0;index<=16;index++){
        const angle=index/16*Math.PI*2;
        loopPoints.push({x:center.x+Math.cos(angle)*radius,y:center.y+Math.sin(angle)*radius});
      }
      const loop={points:loopPoints,flash:0,blockedFlash:0,moves:0,anchored:false};
      refreshStrokeMobility(loop,spec);
      const loopMoved=tryMoveStroke(loop,0,-18,spec);
      const dualPoints=[];
      for(let index=0;index<=16;index++){const angle=index/16*Math.PI*2;dualPoints.push({x:350+Math.cos(angle)*64,y:335+Math.sin(angle)*64})}
      dualPoints.push({x:586,y:335});
      for(let index=0;index<=16;index++){const angle=Math.PI+index/16*Math.PI*2;dualPoints.push({x:650+Math.cos(angle)*64,y:335+Math.sin(angle)*64})}
      const dual={points:dualPoints,flash:0,blockedFlash:0,moves:0,anchored:false};
      refreshStrokeMobility(dual,spec);
      const dualMoved=tryMoveStroke(dual,18,0,spec);
      return{bridgeAnchored:bridge.anchored,bridgeMoved,bridgeDistance:Math.abs(bridge.points[0].y-335),singleLoopAnchored:loop.anchored,singleLoopMoved:loopMoved,singleLoopContacts:loop.lockContacts,dualAnchored:dual.anchored,dualMoved,dualContacts:dual.lockContacts};
    },
    singleAnchorBreakProbe(){
      startStage(0);const spec=level(0),points=[];
      for(let index=0;index<=24;index++){const angle=index/24*Math.PI*2;points.push({x:570+Math.cos(angle)*140,y:460+Math.sin(angle)*115})}
      const stroke={points,flash:0,blockedFlash:0,moves:0,anchored:false};state.strokes=[stroke];refreshStrokeMobility(stroke,spec);beginWave();
      for(let index=0;index<4;index++)spawnBee();state.spawned=spec.maxBees;
      const initialRoute=state.bees.some(bee=>navigationDirection(buildNavigationField(spec),bee.x,bee.y));
      for(let time=0;time<10&&!state.result;time+=.02)update(.02);
      return{initialRoute,anchored:stroke.anchored,lockContacts:stroke.lockContacts,wallMoves:state.wallMoves,firstMoveAt:state.wallFirstMovedAt,intents:[...new Set(state.bees.map(bee=>bee.intent))],bees:state.bees.map(bee=>({x:bee.x,y:bee.y,d:closestStrokePoint(stroke,bee).d,routeOpen:bee.routeOpen})),result:state.result};
    },
    horizontalEscapeProbe(){
      startStage(0);state.duration=12;const spec=level(0),origin={x:20,y:360};
      const stroke={points:[{...origin},{x:980,y:360}],flash:0,blockedFlash:0,moves:0,anchored:false};state.strokes=[stroke];refreshStrokeMobility(stroke,spec);beginWave();
      for(let count=0;count<6;count++)spawnBee();state.spawned=spec.maxBees;
      const initialRoute=state.bees.some(bee=>navigationDirection(buildNavigationField(spec),bee.x,bee.y));
      for(let time=0;time<8&&!state.result;time+=.02)update(.02);
      return{initialRoute,anchored:stroke.anchored,wallMoves:state.wallMoves,lateral:Math.abs(stroke.points[0].x-origin.x),vertical:Math.abs(stroke.points[0].y-origin.y),pathOpenedAt:state.pathOpenedAt,pushAngle:stroke.pushAngle,pushDirectionHistory:[...(stroke.pushDirectionHistory||[])],pushDirectionChanges:stroke.pushDirectionChanges||0,result:state.result};
    },
    terrainCollisionProbe(){
      const spec=level(0),solid=spec.anchors[0],stroke={points:[{x:solid.x+solid.r+18,y:solid.y-95},{x:solid.x+solid.r+18,y:solid.y+95}],flash:0,blockedFlash:0,moves:0,anchored:false};
      refreshStrokeMobility(stroke,spec);
      for(let impact=0;impact<12;impact++)tryMoveStroke(stroke,-18,0,spec);
      const clearance=Math.min(...sampledStrokePoints(stroke.points).map(point=>Math.hypot(point.x-solid.x,point.y-solid.y)-solid.r-10));
      return{anchored:stroke.anchored,clearance,crossed:stroke.points.every(point=>point.x<solid.x),wallMoves:stroke.moves||0};
    },
    movingWallBeeSeparationProbe(){
      startStage(0);const spec={...level(0),solids:[]},stroke={points:[{x:620,y:170},{x:620,y:520}],flash:0,blockedFlash:0,moves:0,anchored:false},bee={id:1,x:592,y:330,prevX:592,prevY:330,vx:0,vy:0,cooldown:0,bounced:false,route:1,intent:"attack"};
      state.strokes=[stroke];state.bees=[bee];let minimumClearance=Infinity,sameSide=true;
      for(let step=0;step<8;step++){
        bee.prevX=bee.x;bee.prevY=bee.y;tryMoveStroke(stroke,-10,0,spec);separateBeeFromWalls(bee);
        const contact=closestStrokePoint(stroke,bee);minimumClearance=Math.min(minimumClearance,contact.d);sameSide&&=bee.x<contact.x;
      }
      return{sameSide,minimumClearance,wallMoves:stroke.moves||0,beeCorrections:state.beeWallCorrections,bee:{x:bee.x,y:bee.y},wallX:stroke.points[0].x};
    },
    routePriorityProbe(){
      startStage(0);state.duration=20;
      const stroke={points:[{x:650,y:110},{x:650,y:510}],flash:0,blockedFlash:0,moves:0,anchored:false};
      state.strokes=[stroke];refreshStrokeMobility(stroke,level(0));beginWave();state.spawned=level(0).maxBees;
      const bee={x:673,y:310,prevX:673,prevY:310,vx:-220,vy:0,life:0,cooldown:0,wallSlide:0,bounced:false,phase:0,route:1,intent:"attack"};
      state.bees=[bee];
      const initialRoute=!!navigationDirection(buildNavigationField(level(0)),bee.x,bee.y),initialY=bee.y;
      for(let time=0;time<.8&&!state.result;time+=.02)update(.02);
      return{initialRoute,routeOpen:bee.routeOpen===true,wallMoves:state.wallMoves,verticalDetour:Math.abs(bee.y-initialY),intent:bee.intent,result:state.result};
    },
    attackContactProbe(){
      startStage(0);state.duration=20;beginWave();state.spawned=level(0).maxBees;
      const dog=level(0).dog;
      state.bees=[{x:dog.x+66,y:dog.y,prevX:dog.x+66,prevY:dog.y,vx:-220,vy:0,life:0,cooldown:0,bounced:false,phase:0,route:1,intent:"attack"}];
      update(.04);
      return{result:state.result,resultVisible:!$("resultPanel").hidden,battleHidden:$("battleLive").hidden,distance:Math.hypot(state.bees[0]?.x-dog.x||0,state.bees[0]?.y-dog.y||0)};
    },
    visibleContactProbe(){
      startStage(0);state.duration=20;beginWave();state.spawned=level(0).maxBees;
      const dog=level(0).dog;
      state.bees=[{x:dog.x+100,y:dog.y,prevX:dog.x+100,prevY:dog.y,vx:-20,vy:0,life:0,cooldown:0,bounced:false,phase:0,route:1,intent:"attack"}];
      update(.02);
      const result=state.result,resultVisible=!$("resultPanel").hidden,battleHidden=$("battleLive").hidden,distance=Math.hypot(state.bees[0]?.x-dog.x||0,state.bees[0]?.y-dog.y||0);
      startStage(0);state.duration=20;const protectedDog=level(0).dog;
      state.strokes=[{points:[{x:protectedDog.x+50,y:protectedDog.y-130},{x:protectedDog.x+50,y:protectedDog.y+130}],flash:0,blockedFlash:0,moves:0,anchored:true}];beginWave();state.spawned=level(0).maxBees;
      state.bees=[{x:protectedDog.x+100,y:protectedDog.y,prevX:protectedDog.x+100,prevY:protectedDog.y,vx:-20,vy:0,life:0,cooldown:0,bounced:false,phase:0,route:1,intent:"attack"}];
      update(.02);
      return{result,resultVisible,battleHidden,distance,protectedResult:state.result};
    },
    durabilityProbe(){
      startStage(0);
      const stroke={points:[{x:700,y:190},{x:700,y:560}],flash:0,blockedFlash:0,moves:0,anchored:true};
      state.strokes=[stroke];
      for(let i=0;i<40;i++){
        const bee={x:700,y:310,vx:-160,vy:0,cooldown:0,bounced:false,route:1};
        collideLine(bee);
      }
      return{strokes:state.strokes.length,points:state.strokes[0]?.points.length||0,hasHealth:Object.hasOwn(stroke,"health"),anchored:stroke.anchored};
    },
    gapProbe(){
      startStage(0);
      state.strokes=[
        {points:[{x:700,y:20},{x:700,y:225}],flash:0,blockedFlash:0,moves:0,anchored:false},
        {points:[{x:700,y:385},{x:700,y:600}],flash:0,blockedFlash:0,moves:0,anchored:false},
      ];
      state.strokes.forEach(stroke=>refreshStrokeMobility(stroke,level(0)));beginWave();spawnBee();state.spawned=level(0).maxBees;
      const initialRoute=!!navigationDirection(buildNavigationField(level(0)),state.bees[0].x,state.bees[0].y);
      for(let time=0;time<1.5&&!state.result;time+=.02)update(.02);
      return{initialRoute,wallMoves:state.wallMoves,result:state.result,bee:{x:state.bees[0]?.x,y:state.bees[0]?.y}};
    },
    plannerProbe(){
      startStage(0);state.duration=20;
      const stroke={points:[{x:420,y:440},{x:580,y:440},{x:580,y:600},{x:420,y:600},{x:420,y:440}],flash:0,blockedFlash:0,moves:0,anchored:false};
      state.strokes=[stroke];refreshStrokeMobility(stroke,level(0));beginWave();for(let count=0;count<4;count++)spawnBee();state.spawned=level(0).maxBees;
      const initialRoute=!!navigationDirection(buildNavigationField(level(0)),state.bees[0].x,state.bees[0].y);
      for(let time=0;time<20&&!state.result;time+=.02)update(.02);
      const field=buildNavigationField(level(0)),routeNow=state.bees[0]?!!navigationDirection(field,state.bees[0].x,state.bees[0].y):false;
      return{initialRoute,wallMoves:state.wallMoves,routeNow,moverStopped:state.mover===null,intent:state.bees[0]?.intent,result:state.result,anchored:stroke.anchored};
    },
    collectiveProbe(){
      startStage(0);state.duration=20;
      const stroke={points:[{x:420,y:440},{x:580,y:440},{x:580,y:600},{x:420,y:600},{x:420,y:440}],flash:0,blockedFlash:0,moves:0,anchored:false};
      state.strokes=[stroke];refreshStrokeMobility(stroke,level(0));beginWave();
      for(let count=0;count<4;count++)spawnBee();
      state.spawned=level(0).maxBees;
      const initialRoute=state.bees.some(bee=>navigationDirection(buildNavigationField(level(0)),bee.x,bee.y));
      for(let time=0;time<20&&!state.result;time+=.02)update(.02);
      const field=buildNavigationField(level(0)),routeNow=state.bees.some(bee=>navigationDirection(field,bee.x,bee.y));
      return{participants:4,initialRoute,wallMoves:state.wallMoves,maxAttached:state.maxGroupAttached,routeNow,moverStopped:state.mover===null,intents:[...new Set(state.bees.map(bee=>bee.intent))],wallImpactContacts:state.wallImpactContacts,wallMoveSolves:state.wallMoveSolves,wallSupportContributions:state.wallSupportContributions,maxFrameWallMoveSolves:state.maxFrameWallMoveSolves,carrierChanges:state.carrierChanges,beeWallCorrections:state.beeWallCorrections,result:state.result};
    },
    distributedPushProbe(){
      startStage(0);state.duration=20;const spec=level(0),wallY=spec.dog.y-145;
      const stroke={points:[{x:0,y:wallY},{x:1000,y:wallY}],flash:0,blockedFlash:0,moves:0,anchored:false};state.strokes=[stroke];refreshStrokeMobility(stroke,spec);beginWave();state.spawned=spec.maxBees;
      state.bees=[220,500,780].map((x,index)=>({id:index+1,x,y:wallY-24,prevX:x,prevY:wallY-24,vx:0,vy:120,life:0,cooldown:0,wallSlide:0,bounced:false,phase:index*.73,route:index%2?1:-1,intent:"attack"}));
      let minimumSpacing=Infinity,frames=0;
      while(frames<80&&!state.result&&state.pathOpenedAt===null){
        update(.02);frames++;
        const positions=state.bees.map(bee=>bee.x).sort((a,b)=>a-b);
        for(let index=1;index<positions.length;index++)minimumSpacing=Math.min(minimumSpacing,positions[index]-positions[index-1]);
      }
      return{frames,minimumSpacing,wallMoves:state.wallMoves,maxAttached:state.maxGroupAttached,maxFrameWallMoveSolves:state.maxFrameWallMoveSolves,pushDirectionHistory:[...(stroke.pushDirectionHistory||[])],pushDirectionChanges:stroke.pushDirectionChanges||0,wallNavBuilds:state.wallNavBuilds,directWallTargets:state.directWallTargets,supporterCarryDistance:state.supporterCarryDistance,bees:state.bees.map(bee=>({x:bee.x,y:bee.y,intent:bee.intent}))};
    },
    stage11ReportProbe(){
      startStage(10);state.duration=20;
      const stroke={points:[{x:5,y:223},{x:160,y:223},{x:250,y:192},{x:360,y:130},{x:470,y:93},{x:580,y:87},{x:690,y:112},{x:730,y:167},{x:810,y:205},{x:940,y:223},{x:995,y:205}],flash:0,blockedFlash:0,moves:0,anchored:false};
      state.strokes=[stroke];refreshStrokeMobility(stroke,level(10));beginWave();
      for(let count=0;count<6;count++)spawnBee();
      const initialRoutes=state.bees.filter(bee=>navigationDirection(buildNavigationField(level(10)),bee.x,bee.y)).length;
      for(let time=0;time<20&&!state.result;time+=.02)update(.02);
      return{participants:6,initialRoutes,wallMoves:state.wallMoves,maxAttached:state.maxGroupAttached,pathOpenedAt:state.pathOpenedAt,moverStopped:state.mover===null,intents:[...new Set(state.bees.map(bee=>bee.intent))],result:state.result};
    },
    stage12ReportProbe(){
      startStage(11);state.duration=12;
      const stroke={points:[{x:160,y:614},{x:170,y:521},{x:220,y:440},{x:290,y:397},{x:400,y:378},{x:550,y:378},{x:630,y:415},{x:670,y:484},{x:670,y:614}],flash:0,blockedFlash:0,moves:0,anchored:false};
      state.strokes=[stroke];refreshStrokeMobility(stroke,level(11));beginWave();for(let count=0;count<6;count++)spawnBee();
      const initialRoute=!!navigationDirection(buildNavigationField(level(11)),state.bees[0].x,state.bees[0].y);
      for(let time=0;time<6&&!state.result;time+=.02)update(.02);
      return{participants:6,initialRoute,approachStartedAt:state.wallApproachStartedAt,wallMoves:state.wallMoves,firstMoveAt:state.wallFirstMovedAt,maxAttached:state.maxGroupAttached,pathOpenedAt:state.pathOpenedAt,intents:[...new Set(state.bees.map(bee=>bee.intent))],result:state.result};
    },
    stage16ScreenshotProbe(){
      startStage(15);state.duration=10;
      const controls=[{x:0,y:366},{x:75,y:357},{x:173,y:343},{x:272,y:331},{x:370,y:292},{x:468,y:254},{x:566,y:248},{x:664,y:268},{x:762,y:313},{x:860,y:338},{x:959,y:361},{x:1000,y:369}],points=[controls[0]];
      for(let index=1;index<controls.length;index++){
        const a=controls[index-1],b=controls[index],steps=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/6);
        for(let step=1;step<=steps;step++){
          const t=step/steps;
          points.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t+Math.sin((points.length+step)*2.31)*1.25});
        }
      }
      const stroke={points,flash:0,blockedFlash:0,moves:0,anchored:false};
      const spec=level(15),origin={...stroke.points[0]};state.strokes=[stroke];refreshStrokeMobility(stroke,spec);beginWave();
      for(let count=0;count<4;count++)spawnBee();
      const initialRoutes=state.bees.filter(bee=>navigationDirection(buildNavigationField(spec),bee.x,bee.y)).length;
      const initiallyMovable=PUSH_DIRECTIONS.some(direction=>canTranslateStroke(stroke,direction.x*8,direction.y*8,spec));
      update(.02);const initialIntents=[...new Set(state.bees.map(bee=>bee.intent))];
      for(let time=0;time<10&&!state.result;time+=.02)update(.02);
      return{participants:4,initialRoutes,anchored:stroke.anchored,initiallyMovable,initialIntents,firstMoveAt:state.wallFirstMovedAt,wallMoves:state.wallMoves,netDisplacement:Math.hypot(stroke.points[0].x-origin.x,stroke.points[0].y-origin.y),maxAttached:state.maxGroupAttached,pathOpenedAt:state.pathOpenedAt,intents:[...new Set(state.bees.map(bee=>bee.intent))],result:state.result};
    },
    stallSweepProbe(){
      const records=[],failures=[];
      for(const index of [0,5,10,11,15,20,25,29]){
        startStage(index);state.duration=8;
        const spec=level(index),left=Math.max(20,spec.dog.x-175),right=Math.min(980,spec.dog.x+175),top=Math.max(80,spec.dog.y-115);
        const stroke={points:[{x:left,y:615},{x:left,y:top},{x:right,y:top},{x:right,y:615}],flash:0,blockedFlash:0,moves:0,anchored:false};
        state.strokes=[stroke];refreshStrokeMobility(stroke,spec);beginWave();spawnBee();
        const initialRoute=!!navigationDirection(buildNavigationField(spec),state.bees[0].x,state.bees[0].y),movable=PUSH_DIRECTIONS.some(direction=>canTranslateStroke(stroke,direction.x*8,direction.y*8,spec));
        update(.02);const initialIntent=state.bees[0]?.intent;
        for(let time=0;time<5&&!state.result;time+=.02)update(.02);
        const record={stage:index+1,initialRoute,movable,initialIntent,anchoredAfter:stroke.anchored,wallMoves:state.wallMoves,intents:[...new Set(state.bees.map(bee=>bee.intent))],result:state.result};records.push(record);
        if(!initialRoute&&movable&&(initialIntent==="wait"||state.wallMoves===0&&!state.result||record.intents.includes("wait")&&!record.anchoredAfter))failures.push(record);
      }
      return{records,failures};
    },
    beeSpriteMetrics(){
      const crop=SPRITE_CROPS[1],centroid={x:133.44,y:137.67},rect=canvas.getBoundingClientRect(),physicalX=rect.width/1000,physicalY=rect.height/620,uniform=Math.sqrt(physicalX*physicalY);
      const physicalWidth=58*uniform,physicalHeight=physicalWidth*crop.h/crop.w;
      const drawOrigin={x:-centroid.x/crop.w*physicalWidth,y:-centroid.y/crop.h*physicalHeight};
      return{sourceRatio:crop.w/crop.h,physicalRatio:physicalWidth/physicalHeight,alphaCentroid:[centroid.x,centroid.y],centerOffset:[drawOrigin.x+centroid.x/crop.w*physicalWidth,drawOrigin.y+centroid.y/crop.h*physicalHeight]};
    },
    crossingProbe(){
      startStage(0);
      const stroke={points:[{x:500,y:100},{x:500,y:560}],flash:0,blockedFlash:0,moves:0,anchored:true};
      state.strokes=[stroke];
      const bee={prevX:545,prevY:310,x:482,y:310,vx:-240,vy:0,cooldown:0,bounced:false,route:1};
      const collided=collideLine(bee);
      return{collided,x:bee.x,y:bee.y,vx:bee.vx,sameSide:bee.x>500,clearance:bee.x-500};
    },
    antiSlideProbe(){
      startStage(0);
      const stroke={points:[{x:500,y:100},{x:500,y:560}],flash:0,blockedFlash:0,moves:0,anchored:true};
      state.strokes=[stroke];
      const bee={prevX:545,prevY:250,x:482,y:302,vx:-240,vy:198,cooldown:0,bounced:false,route:1,wallSlide:0};
      const collided=collideLine(bee),contact=closestStrokePoint(stroke,bee);
      return{collided,x:bee.x,y:bee.y,vx:bee.vx,vy:bee.vy,clearance:contact.d,tangentSpeed:Math.abs(bee.vy),wallSlide:bee.wallSlide};
    },
    wallRamVisualProbe(){
      const stroke={points:[{x:500,y:100},{x:500,y:560}]},bee={id:0,x:522,y:300,vx:-120,vy:0,intent:"moveWall",attachedStroke:stroke,life:0};
      const sample=life=>{bee.life=life;const visual=wallRamVisual(bee);return{phase:visual.phase,offset:visual.offset,x:visual.x,scaleX:visual.scaleX,scaleY:visual.scaleY}};
      return{start:sample(0),recoil:sample(.18),charge:sample(.31),impact:sample(.4368),recover:sample(.52)};
    },
    assetStatus:()=>({atlas:atlas.naturalWidth,backgrounds:themeBackgrounds.map(image=>image.naturalWidth)}),
    loopTailProbe(){
      const points=[{x:500,y:360},{x:500,y:300},{x:430,y:235}];
      for(let step=0;step<=24;step++){const angle=Math.PI*2*step/24;points.push({x:500+190*Math.cos(angle),y:350+150*Math.sin(angle)})}
      const cleaned=trimClosedLoopTail(points,{x:500,y:350});
      return{before:points.length,after:cleaned.length,removed:points.length-cleaned.length,closed:Math.hypot(cleaned[0].x-cleaned.at(-1).x,cleaned[0].y-cleaned.at(-1).y)<1};
    },
    levelDigest:()=>Array.from({length:30},(_,index)=>{const spec=level(index);return{theme:spec.theme.terrain,topology:spec.topology,dog:[spec.dog.x,spec.dog.y],hives:spec.hives.map(hive=>[hive.x,hive.y]),solids:spec.solids.map(solid=>solid.kind==="platform"?[solid.kind,solid.x,solid.y,solid.w,solid.h]:[solid.kind,solid.x,solid.y,solid.r]),zones:spec.zones.map(zone=>[zone.kind,zone.x,zone.y,zone.w,zone.h,zone.dx||0,zone.dy||0]),speed:spec.speed}}),
    stagePool:()=>({count:stageCardPool.length,start:stageWindowStart,total:Number($("stageRail")?.dataset.wpStageTotal||0),ids:stageCardPool.map(card=>card.dataset.stageIndex)}),
    fail(){finish(false)},locale:()=>locale
  };
  installVirtualStageDrag();loadAssets();updateMainProgress();
})();
