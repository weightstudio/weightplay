(function(){
"use strict";
const $=id=>document.getElementById(id),$$=selector=>[...document.querySelectorAll(selector)];
const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value));
const fmt=(value,data={})=>String(value??"").replace(/\{(\w+)\}/g,(_,key)=>data[key]??"");
const localeNames={"en":"en","zh-tw":"zh-Hant","zh-cn":"zh-Hans","ja":"ja","ko":"ko","es":"es","pt-br":"pt-BR","fr":"fr","de":"de","it":"it","ru":"ru","hi":"hi","ar":"ar"};
const routeLocale=localeNames[location.pathname.split("/").filter(Boolean)[0]?.toLowerCase()];
let locale=routeLocale||safeGet("weightPlayLocale")||safeGet("weightplayLocale")||document.documentElement.lang||"en";
if(!window.CARNIVAL_CLAW_LOCALES[locale])locale="en";
let copy=window.CARNIVAL_CLAW_LOCALES[locale],screen="main",selected=0,focusReturn=null,raf=0,last=0,settledDecision=false,resolvedWallAnchor=0;
const canvas=$("gameCanvas"),ctx=canvas.getContext("2d",{alpha:false});
const images={
  background:loadImage("../../assets/animal-carnival-claw-background-v2.webp"),
  atlas:loadImage("../../assets/animal-carnival-claw-atlas.webp"),
  prizesA:loadImage("../../assets/animal-carnival-claw-prizes-a.webp"),
  prizesB:loadImage("../../assets/animal-carnival-claw-prizes-b.webp"),
  props:loadImage("../../assets/animal-carnival-claw-props.webp")
};
const defaultSave=()=>({unlocked:1,medals:Array(30).fill(0),cabinet:Array(8).fill(false),bolts:0,upgrades:{grip:0,stability:0,rail:0},tutorial:false});
let save=loadSave();
let run=null,pointerId=null;
const STAGE_CARD_POOL_SIZE=9;
let stageWindowStart=0,stageCardPool=[];
const chapters=[
  {name:"chapter1",rule:"rule1",obstacle:"none"},
  {name:"chapter2",rule:"rule2",obstacle:"bumper"},
  {name:"chapter3",rule:"rule3",obstacle:"shelf"},
  {name:"chapter4",rule:"rule4",obstacle:"magnet"},
  {name:"chapter5",rule:"rule5",obstacle:"stack"},
  {name:"chapter6",rule:"rule6",obstacle:"mix"}
];
const basePositions=[
  [230,435],[390,455],[560,438],[730,458],[310,325],[505,345],[690,320],[840,390]
];
const levels=Array.from({length:30},(_,index)=>{
  const chapter=Math.floor(index/5),slot=index%5,offset=(slot-2)*16;
  const order=Array.from({length:8},(_,i)=>(i*3+index*5)%8);
  const prizes=order.slice(0,6).map((kind,i)=>{
    const base=basePositions[(i+slot)%basePositions.length];
    return{kind,x:clamp(base[0]+offset*(i%2?1:-1),120,880),y:base[1]-chapter*5+(i%3)*8,weight:1+((kind+chapter+slot)%3),id:`${index}-${i}`};
  });
  const targetCount=index<5?1:index<20?2:3;
  const targets=prizes.slice(0,targetCount).map(prize=>prize.kind);
  return{index,chapter,slot,prizes,targets,obstacle:chapters[chapter].obstacle,drift:chapter>=3?.16+slot*.025:0,shelfPhase:slot*.7};
});

function safeGet(key){try{return localStorage.getItem(key)}catch{return null}}
function safeSet(key,value){try{localStorage.setItem(key,value);return true}catch{return false}}
function loadSave(){try{const parsed=JSON.parse(safeGet("weightplay_animal_carnival_claw_v1")||"null"),base=defaultSave();if(!parsed)return base;return{...base,...parsed,medals:[...base.medals,...(parsed.medals||[])].slice(0,30),cabinet:[...base.cabinet,...(parsed.cabinet||[])].slice(0,8),upgrades:{...base.upgrades,...(parsed.upgrades||{})}}}catch{return defaultSave()}}
function persist(){safeSet("weightplay_animal_carnival_claw_v1",JSON.stringify(save))}
function loadImage(src){const image=new Image();image.src=src;return image}
function t(key,data){return fmt(copy[key]??window.CARNIVAL_CLAW_LOCALES.en[key]??key,data)}
function prizeName(kind){return t(`prize${kind+1}`)}
function prizeSpriteStyle(kind){
  const sheet=kind<4?"a":"b",cell=kind%4,x=cell%2,y=Math.floor(cell/2);
  return`background-image:url('../../assets/animal-carnival-claw-prizes-${sheet}.webp');background-position:${x*100}% ${y*100}%`;
}
function medalText(value){return value?"★".repeat(value):t("none")}
function announce(message,data){
  const node=$("phaseHint");if(!node)return;
  node.textContent=(Array.isArray(message)?message:[message]).map(key=>t(key,data)).join(" ");
}

function setLocale(next,persistChoice=true){
  if(!window.CARNIVAL_CLAW_LOCALES[next])next="en";
  locale=next;copy=window.CARNIVAL_CLAW_LOCALES[next];
  document.documentElement.lang=next==="zh-Hant"?"zh-TW":next==="zh-Hans"?"zh-CN":next;
  document.documentElement.dir=next==="ar"?"rtl":"ltr";
  $$("[data-i18n]").forEach(node=>node.textContent=t(node.dataset.i18n));
  $$("[data-i18n-aria]").forEach(node=>node.setAttribute("aria-label",t(node.dataset.i18nAria)));
  $$("[data-i18n-alt]").forEach(node=>node.setAttribute("alt",t(node.dataset.i18nAlt)));
  $("localeSelect").value=next;
  if(persistChoice){safeSet("weightPlayLocale",next);safeSet("weightplayLocale",next)}
  renderMain();renderStage();if(run){renderHud();draw()}
}
function show(next){
  cancelAnimationFrame(raf);raf=0;screen=next;document.body.dataset.screen=next;
  $("mainGroup").hidden=next!=="main";$("stageScreen").hidden=next!=="stage";$("battleScreen").hidden=next!=="battle";
  if(next==="main")renderMain();
  if(next==="stage"){renderStage();requestAnimationFrame(()=>centerSelected(false))}
  if(next==="battle"&&run)resumeLoop();
}
function renderMain(){
  const cleared=save.medals.filter(Boolean).length,charms=save.cabinet.filter(Boolean).length;
  $("mainProgress").textContent=t("progress",{cleared,charms});
}
function setStagePanel(name){
  $("stagesPanel").hidden=name!=="stages";$("cabinetPanel").hidden=name!=="cabinet";$("workshopPanel").hidden=name!=="workshop";
  for(const key of ["stages","cabinet","workshop"]){const button=$(`${key}Tab`);button.classList.toggle("active",key===name);if(key===name)button.setAttribute("aria-current","page");else button.removeAttribute("aria-current")}
  if(name==="cabinet")renderCabinet();if(name==="workshop")renderWorkshop();
}
function stageWindowLimit(){return Math.max(0,levels.length-STAGE_CARD_POOL_SIZE)}
function desiredStageWindow(index){return clamp(index-Math.floor(STAGE_CARD_POOL_SIZE/2),0,stageWindowLimit())}
function createStageCard(){
  const button=document.createElement("button"),image=document.createElement("img"),body=document.createElement("span"),title=document.createElement("strong"),status=document.createElement("small");
  button.type="button";button.className="stage-card";image.src="../../assets/animal-carnival-claw-cover.webp";image.alt="";
  body.append(title,status);button.append(image,body);
  button.addEventListener("click",()=>{const index=Number(button.dataset.stageIndex);if(Number.isInteger(index))selectStage(index,true)});
  return button;
}
function bindStageCard(button,index){
  const level=levels[index],unlocked=index<save.unlocked,status=unlocked?(save.medals[index]?t("cleared",{medal:medalText(save.medals[index])}):t("ready")):t("locked");
  button.dataset.stageIndex=index;button.setAttribute("aria-posinset",String(index+1));button.setAttribute("aria-setsize",String(levels.length));button.setAttribute("aria-disabled",String(!unlocked));
  button.classList.toggle("locked",!unlocked);
  button.querySelector("strong").textContent=t("mission",{n:index+1});
  button.querySelector("small").textContent=`${t(chapters[level.chapter].name)} · ${status}`;
}
function syncStageCards(){
  stageCardPool.forEach(button=>{
    const index=Number(button.dataset.stageIndex),isSelected=index===selected;
    bindStageCard(button,index);button.tabIndex=isSelected?0:-1;button.classList.toggle("is-centered",isSelected);button.classList.toggle("wp-stage-centered",isSelected);
    if(isSelected&&index<save.unlocked)button.dataset.wpStageRecommended="true";else delete button.dataset.wpStageRecommended;
  });
}
function buildStageCardPool(){
  const rail=$("stageRail"),count=Math.min(STAGE_CARD_POOL_SIZE,levels.length);
  rail.innerHTML="";stageWindowStart=desiredStageWindow(selected);stageCardPool=Array.from({length:count},(_,offset)=>{
    const button=createStageCard();bindStageCard(button,stageWindowStart+offset);rail.append(button);return button;
  });
  rail.dataset.wpStageVirtualized="bounded-recycle";rail.dataset.wpStagePoolSize=String(count);rail.dataset.wpStageTotal=String(levels.length);
}
function moveStageWindow(targetStart){
  const rail=$("stageRail"),target=clamp(targetStart,0,stageWindowLimit());
  if(!stageCardPool.length){buildStageCardPool();return}
  const anchor=rail.querySelector(`[data-stage-index="${selected}"]`),before=anchor?.getBoundingClientRect().left;
  while(stageWindowStart<target){const recycled=rail.firstElementChild;stageWindowStart++;rail.append(recycled);bindStageCard(recycled,stageWindowStart+stageCardPool.length-1)}
  while(stageWindowStart>target){const recycled=rail.lastElementChild;stageWindowStart--;rail.prepend(recycled);bindStageCard(recycled,stageWindowStart)}
  stageCardPool=[...rail.children];rail.dataset.wpStageWindowStart=String(stageWindowStart);rail.dataset.wpStageWindowEnd=String(stageWindowStart+stageCardPool.length-1);
  if(anchor&&Number.isFinite(before)){const after=anchor.getBoundingClientRect().left;if(Number.isFinite(after))rail.scrollLeft+=after-before}
}
function ensureStageWindow(index){
  if(!stageCardPool.length)buildStageCardPool();
  moveStageWindow(desiredStageWindow(index));syncStageCards();
}
function nearestStageCard(){
  const rail=$("stageRail"),railRect=rail.getBoundingClientRect(),center=railRect.left+railRect.width/2;
  return stageCardPool.reduce((nearest,card)=>{const rect=card.getBoundingClientRect(),distance=Math.abs(rect.left+rect.width/2-center);return!nearest||distance<nearest.distance?{card,distance}:nearest},null)?.card||null;
}
function installVirtualStageDrag(){
  const rail=$("stageRail");if(!rail||rail.dataset.wpStageVirtualDrag==="true")return;
  rail.dataset.wpStageVirtualDrag="true";
  let pointerId=null,startX=0,startScroll=0,moved=false,suppressClick=false,previousBehavior="",previousSnap="";
  rail.addEventListener("pointerdown",event=>{
    if(event.isPrimary===false||(event.button!==undefined&&event.button!==0))return;
    pointerId=event.pointerId;startX=event.clientX;startScroll=rail.scrollLeft;moved=false;
    previousBehavior=rail.style.getPropertyValue("scroll-behavior");previousSnap=rail.style.getPropertyValue("scroll-snap-type");
    rail.style.setProperty("scroll-behavior","auto","important");rail.style.setProperty("scroll-snap-type","none","important");rail.dataset.wpDragDown="1";
    event.stopImmediatePropagation();
  },true);
  document.addEventListener("pointermove",event=>{
    if(event.pointerId!==pointerId)return;
    const delta=event.clientX-startX;if(!moved&&Math.abs(delta)>4){moved=true;rail.classList.add("wp-stage-dragging")}
    if(moved){const rect=rail.getBoundingClientRect(),scale=rect.width?rail.clientWidth/rect.width:1;if(event.cancelable)event.preventDefault();rail.scrollLeft=startScroll-delta*scale}
    event.stopImmediatePropagation();
  },true);
  const finish=event=>{
    if(pointerId===null||(event.pointerId!==undefined&&event.pointerId!==pointerId))return;
    pointerId=null;rail.dataset.wpDragDown="0";rail.classList.remove("wp-stage-dragging");
    if(previousBehavior)rail.style.setProperty("scroll-behavior",previousBehavior);else rail.style.removeProperty("scroll-behavior");
    if(previousSnap)rail.style.setProperty("scroll-snap-type",previousSnap);else rail.style.removeProperty("scroll-snap-type");
    if(moved){
      if(event.cancelable)event.preventDefault();const card=nearestStageCard(),index=Number(card?.dataset.stageIndex);
      if(Number.isInteger(index)){selectStage(index,false);requestAnimationFrame(()=>centerSelected(true))}
      suppressClick=true;setTimeout(()=>{suppressClick=false},0);
    }
    moved=false;event.stopImmediatePropagation();
  };
  document.addEventListener("pointerup",finish,true);document.addEventListener("pointercancel",finish,true);
  rail.addEventListener("click",event=>{if(!suppressClick)return;suppressClick=false;event.preventDefault();event.stopImmediatePropagation()},true);
}
function renderStage(){
  const cleared=save.medals.filter(Boolean).length;
  $("stageSummary").textContent=t("stageSummary",{cleared,bolts:save.bolts});
  const chapter=chapters[Math.floor(selected/5)];
  $("chapterKicker").textContent=t("mission",{n:selected+1});
  $("chapterTitle").textContent=t(chapter.name);$("chapterRule").textContent=t(chapter.rule);
  ensureStageWindow(selected);
  $("enterBtn").disabled=selected>=save.unlocked;
  renderCabinet();renderWorkshop();
}
function selectStage(index,center){
  selected=clamp(index,0,29);
  ensureStageWindow(selected);
  const chapter=chapters[Math.floor(selected/5)];
  $("chapterKicker").textContent=t("mission",{n:selected+1});$("chapterTitle").textContent=t(chapter.name);$("chapterRule").textContent=t(chapter.rule);
  $("enterBtn").disabled=selected>=save.unlocked;
  if(center)centerSelected();
}
function centerSelected(smooth=true){ensureStageWindow(selected);const card=$(`stageRail`).querySelector(`[data-stage-index="${selected}"]`);card?.scrollIntoView({behavior:smooth?"smooth":"auto",block:"nearest",inline:"center"});selectStage(selected,false)}
function renderCabinet(){
  $("cabinetSummary").textContent=t("progress",{cleared:save.medals.filter(Boolean).length,charms:save.cabinet.filter(Boolean).length});
  $("cabinetGrid").innerHTML=Array.from({length:8},(_,kind)=>{
    const sheet=kind<4?"a":"b",cell=kind%4,x=cell%2,y=Math.floor(cell/2);
    return`<div class="cabinet-item ${save.cabinet[kind]?"":"locked"}"><span class="cabinet-sprite" style="background-image:url('../../assets/animal-carnival-claw-prizes-${sheet}.webp');background-position:${x*100}% ${y*100}%"></span><strong>${save.cabinet[kind]?prizeName(kind):t("unknown")}</strong></div>`;
  }).join("");
}
function renderWorkshop(){
  const configs=[["grip","tuningGrip","tuningGripText"],["stability","tuningStability","tuningStabilityText"],["rail","tuningRail","tuningRailText"]];
  $("upgradeGrid").innerHTML=configs.map(([id,title,text])=>{
    const level=save.upgrades[id],cost=(level+1)*3,disabled=level>=3||save.bolts<cost;
    return`<article class="upgrade-card"><h3>${t(title)} · ${level}/3</h3><p>${t(text)}</p><button type="button" data-upgrade="${id}" ${disabled?"disabled":""}>${level>=3?t("max"):`${t("upgrade")} · ${t("starbolts",{n:cost})}`}</button></article>`;
  }).join("");
  $$("[data-upgrade]").forEach(button=>button.addEventListener("click",()=>buyUpgrade(button.dataset.upgrade)));
}
function buyUpgrade(id){
  const restoreDecisionFocus=document.activeElement?.dataset?.upgrade===id;
  const level=save.upgrades[id],cost=(level+1)*3;
  if(level>=3)return;
  if(save.bolts<cost){$("workshopFeedback").textContent=t("needBolts");return}
  save.bolts-=cost;save.upgrades[id]++;persist();$("workshopFeedback").textContent=t("upgradeDone");renderStage();
  if(restoreDecisionFocus)requestAnimationFrame(()=>{
    const current=document.querySelector(`[data-upgrade="${id}"]`);
    const target=current&&!current.disabled?current:document.querySelector("[data-upgrade]:not(:disabled)")||$("workshopTab");
    target?.focus({preventScroll:true});
  });
}

function startMission(index){
  selected=index;const level=levels[index];
  run={
    index,level,phase:"aim",elapsed:0,phaseTime:0,drops:3,aimX:500,aimY:360,dropX:null,lockValue:.08,lockDirection:1,lockQuality:0,stability:1,grip:1,swing:0,held:null,fallX:0,fallY:0,fallVelocity:0,fallRotation:0,aimCorrection:null,lastSpatialCorrection:"",
    prizes:level.prizes.map(prize=>({...prize,active:true,delivered:false})),targets:[...level.targets],delivered:[],misses:0,result:null,feedback:"phaseAim",lastCorrection:"phaseAim"
  };
  settledDecision=false;resolvedWallAnchor=0;$("resultPanel").hidden=true;$("leavePanel").hidden=true;$("pausePanel").hidden=true;$("battleLive").hidden=false;$("battleLive").inert=false;
  $("resultStagesBtn").disabled=false;$("retryBtn").disabled=false;$("nextBtn").disabled=true;
  show("battle");resizeCanvas();renderHud();draw();
  if(!save.tutorial){openModal("tutorialPanel",$("tutorialStartBtn"))}
}
function remainingTargets(){const deliveredKinds=new Set(run.delivered.filter(entry=>entry.target).map(entry=>entry.kind));return run.targets.filter(kind=>!deliveredKinds.has(kind))}
function renderHud(){
  if(!run)return;
  $("missionLabel").textContent=t("mission",{n:run.index+1});$("objectiveText").textContent=t("objective",{count:remainingTargets().length});
  $("dropsValue").textContent=run.drops;$("gripValue").textContent=`${Math.round(run.grip*100)}%`;
  $("timingMeter").classList.toggle("timing-active",run.phase==="secure");
  $("timingMeter").style.setProperty("--timing-position",`${clamp(run.lockValue)*100}%`);
  const timingWindow=run.phase==="secure"&&run.held?lockWindow():.15;
  $("timingMeter").style.setProperty("--timing-start",`${(50-timingWindow*100).toFixed(1)}%`);
  $("timingMeter").style.setProperty("--timing-end",`${(50+timingWindow*100).toFixed(1)}%`);
  $("targetList").innerHTML=run.targets.map(kind=>`<span class="target-chip ${run.delivered.some(entry=>entry.target&&entry.kind===kind)?"done":""}"><i class="target-thumb" aria-hidden="true" style="${prizeSpriteStyle(kind)}"></i><b>${prizeName(kind)}</b></span>`).join("");
  $("dropBtn").disabled=!["aim","secure"].includes(run.phase);$("dropBtn").textContent=t(run.phase==="secure"?"holdGrip":"drop");$("restartBtn").disabled=!!run.result;
  if(!["secure","lift","fall"].includes(run.phase))$("steerAction").hidden=true;
  announce(run.feedback||"phaseAim");
}
function beginDrop(){
  if(!run||run.phase!=="aim"||run.result)return;
  run.dropX=clawPosition().x;run.phase="drop";run.phaseTime=0;run.drops--;run.grip=1;run.stability=1;run.aimCorrection=null;run.feedback="phaseDrop";renderHud();
}
function update(dt,wallTime=null){
  if(!run||run.result||screen!=="battle"||activeModal())return;
  run.elapsed+=dt;run.phaseTime+=dt;
  if(wallTime!==null&&resolvedAutoplayPhase()){
    if(!resolvedWallAnchor)resolvedWallAnchor=wallTime-run.phaseTime*1000;
    run.phaseTime=Math.max(run.phaseTime,(wallTime-resolvedWallAnchor)/1000);
  }
  if(run.phase==="aim"){
    const drift=(run.level.drift||0)*(1-save.upgrades.rail*.18);
    run.aimX=clamp(run.aimX+Math.sin(run.elapsed*1.8+run.level.index)*drift*20*dt,80,920);
  }else if(run.phase==="drop"){
    if(run.phaseTime>=.72)resolveGrip();
  }else if(run.phase==="secure"){
    const speed=.68+run.held.weight*.045-run.level.drift*.08;
    run.lockValue+=run.lockDirection*speed*dt;
    if(run.lockValue>=1){run.lockValue=2-run.lockValue;run.lockDirection=-1}
    if(run.lockValue<=0){run.lockValue=-run.lockValue;run.lockDirection=1}
    run.grip=clamp(1-run.phaseTime*.16);
    updateTimingCoach();
    if(run.phaseTime>=2.35)beginFall("lockMiss");
  }else if(run.phase==="lift"){
    run.swing=Math.sin(run.phaseTime*(4.2+run.held.weight*.3)+run.held.kind)*(.18+run.held.weight*.035);
    run.grip=clamp(.72+run.lockQuality*.28);
    if(run.phaseTime>=1.28)deliverHeld();
  }else if(run.phase==="fall"){
    run.fallVelocity+=680*dt;run.fallY+=run.fallVelocity*dt;run.fallRotation+=dt*2.4;
    if(run.phaseTime>=.82||run.fallY>=540)completeFall();
  }else if(run.phase==="return"&&run.phaseTime>=.52){
    if(!remainingTargets().length){finish(true);return}
    if(run.drops<=0){finish(false);return}
    run.phase="aim";run.phaseTime=0;run.held=null;resolvedWallAnchor=0;run.feedback=run.aimCorrection?["phaseAim",run.aimCorrection.text]:"phaseAim";renderHud();
  }
}
function clawPosition(){
  if(!run)return{x:500,y:80};
  const sway=Math.sin(run.elapsed*(2.5-run.level.drift)+run.level.index*.4)*(38+run.level.chapter*6);
  const liveX=clamp(run.aimX+sway,68,932),x=run.phase==="aim"?liveX:(run.dropX??liveX);
  if(run.phase==="drop")return{x,y:80+(run.aimY-80)*clamp(run.phaseTime/.72)};
  if(run.phase==="secure"||run.phase==="fall")return{x,y:run.aimY};
  if(run.phase==="lift")return{x,y:run.aimY-(run.aimY-95)*clamp(run.phaseTime/1.28)};
  if(run.phase==="return")return{x,y:95};
  return{x,y:80};
}
function gripWindowFor(prize){return 62+save.upgrades.grip*9-prize.weight*4}
function grabMetric(prize,x,y,width=canvas.getBoundingClientRect().width,height=canvas.getBoundingClientRect().height){
  const sx=width/1000,sy=height/620,scale=Math.min(sx,sy)||1;
  return Math.hypot((prize.x-x)*sx,(prize.y-y)*sy)/scale;
}
function resolveGrip(){
  const claw=clawPosition(),active=run.prizes.filter(prize=>prize.active);
  const nearest=active.map(prize=>({prize,d:grabMetric(prize,claw.x,run.aimY)})).sort((a,b)=>a.d-b.d)[0];
  const grabRadius=nearest?gripWindowFor(nearest.prize):0;
  if(nearest&&nearest.d<=grabRadius){
    run.held=nearest.prize;run.phase="secure";run.phaseTime=0;run.lockValue=.08;run.lockDirection=1;run.lockQuality=0;run.grip=clamp(1-nearest.d/(grabRadius*1.45));run.stability=1;run.swing=0;run.feedback="phaseLift";
  }else{
    const target=run.prizes.find(prize=>prize.active&&remainingTargets().includes(prize.kind));
    const dx=target?target.x-claw.x:0,dy=target?target.y-run.aimY:0,steps=[];
    if(Math.abs(dx)>7)steps.push(`${dx<0?"←":"→"}×${Math.max(1,Math.ceil(Math.abs(dx)/14))}`);
    if(Math.abs(dy)>7)steps.push(`${dy<0?"↑":"↓"}×${Math.max(1,Math.ceil(Math.abs(dy)/14))}`);
    const text=steps.join(" · ")||"◎";
    run.aimCorrection=target?{targetKind:target.kind,targetX:target.x,targetY:target.y,text}:null;run.lastSpatialCorrection=text;
    run.misses++;run.phase="return";run.phaseTime=0;resolvedWallAnchor=performance.now();run.grip=0;run.stability=.2;run.feedback=["miss","phaseAim",text];run.lastCorrection="phaseAim";
  }
  renderHud();
}
function lockWindow(){return clamp(.23+save.upgrades.stability*.025-run.held.weight*.015,.16,.28)}
function attemptLock(){
  if(!run||run.phase!=="secure"||!run.held)return;
  const distance=Math.abs(run.lockValue-.5),windowSize=lockWindow();
  if(distance<=windowSize){
    run.lockQuality=clamp(1-distance/windowSize);run.phase="lift";run.phaseTime=0;resolvedWallAnchor=performance.now();run.grip=.72+run.lockQuality*.28;run.feedback="holdingGood";updateTimingCoach(true);renderHud();
  }else beginFall("lockMiss");
}
function beginFall(reason="lockMiss"){
  if(!run?.held||!["secure","lift"].includes(run.phase))return;
  const claw=clawPosition();run.phase="fall";run.phaseTime=0;run.fallX=claw.x;run.fallY=claw.y;run.fallVelocity=45;run.fallRotation=0;run.grip=0;run.feedback=reason;run.lastCorrection=reason;updateTimingCoach(false,true);renderHud();
}
function completeFall(){
  const held=run.held;
  if(held){held.x=clamp(run.fallX+Math.sin(run.elapsed)*30,90,910);held.y=clamp(run.fallY,300,500)}
  run.misses++;run.phase="return";run.phaseTime=0;run.held=null;run.feedback=["falling","lockMiss"];renderHud();
}
function deliverHeld(){
  const held=run.held;if(!held)return;
  held.active=false;held.delivered=true;
  const target=run.targets.includes(held.kind)&&!run.delivered.some(entry=>entry.target&&entry.kind===held.kind);
  run.delivered.push({kind:held.kind,target});save.cabinet[held.kind]=true;persist();
  run.phase="return";run.phaseTime=0;resolvedWallAnchor=performance.now();run.held=null;run.feedback=target?"caught":"wrong";
  if(!target)run.lastCorrection="objective";
  renderHud();
}
function finish(won){
  if(run.result)return;
  const medal=won?clamp(1+run.drops+(run.misses===0?1:0),1,3):0,previous=save.medals[run.index],newBest=medal>previous;
  if(won){
    save.medals[run.index]=Math.max(previous,medal);save.unlocked=Math.max(save.unlocked,Math.min(30,run.index+2));
    const reward=medal+(newBest?1:0);save.bolts+=reward;persist();
  }
  run.result={won,medal,newBest};settledDecision=false;cancelAnimationFrame(raf);raf=0;
  $("battleLive").hidden=true;$("battleLive").inert=true;$("resultPanel").hidden=false;
  $("resultStagesBtn").disabled=false;$("retryBtn").disabled=false;
  $("resultTitle").textContent=t(won?"winTitle":"failTitle");$("resultMedal").textContent=medalText(medal);
  const resultData={drops:run.drops,count:remainingTargets().length};
  $("resultText").textContent=won?t("winText",resultData):`${t("failText",resultData)} ${t(run.lastCorrection||"phaseAim",resultData)} ${run.lastSpatialCorrection||""}`.trim();
  $("bestText").textContent=won?(newBest?t("newBest"):t("best",{medal:medalText(previous)})):"";
  $("nextBtn").disabled=!won||run.index>=29;$("nextBtn").classList.toggle("primary-action",won&&run.index<29);
  requestAnimationFrame(()=>(won&&run.index<29?$("nextBtn"):$("retryBtn")).focus({preventScroll:true}));
}
function commitResult(action){if(settledDecision||$("resultPanel").hidden)return;settledDecision=true;[$("resultStagesBtn"),$("nextBtn"),$("retryBtn")].forEach(button=>button.disabled=true);action()}

function updateTimingCoach(locked=false,failed=false){
  const hint=$("phaseHint"),action=$("steerAction");if(!hint||!action)return;
  $("timingMeter").style.setProperty("--timing-position",`${clamp(run.lockValue)*100}%`);
  const state=locked?"correct":failed?"wrong":"prompt";
  hint.dataset.steer=state;action.dataset.steer=state;action.hidden=false;
  action.textContent=t(locked?"holdingAction":failed?"falling":"holdAction");
  hint.textContent=t(locked?"holdingGood":failed?"lockMiss":"holdNeeded");
}

function activeModal(){return["tutorialPanel","leavePanel","pausePanel","resultPanel"].some(id=>!$(id).hidden)}
function resolvedAutoplayPhase(){return Boolean(run&&["lift","return"].includes(run.phase))}
function openModal(id,focus){focusReturn=document.activeElement;$(id).hidden=false;cancelAnimationFrame(raf);raf=0;resolvedWallAnchor=0;requestAnimationFrame(()=>focus?.focus({preventScroll:true}))}
function closeModal(id,resume=true){$(id).hidden=true;focusReturn?.focus?.({preventScroll:true});focusReturn=null;if(resume)resumeLoop()}
function resumeLoop(){if(!run||run.result||screen!=="battle"||activeModal())return;cancelAnimationFrame(raf);last=performance.now();if(resolvedAutoplayPhase())resolvedWallAnchor=last-run.phaseTime*1000;raf=requestAnimationFrame(loop)}
function loop(time){raf=0;const dt=Math.min(.04,(time-last)/1000||0);last=time;update(dt,time);draw();if(run&&!run.result&&screen==="battle"&&!activeModal())raf=requestAnimationFrame(loop)}
function resizeCanvas(){const rect=canvas.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1);canvas.width=Math.max(1,Math.round(rect.width*d));canvas.height=Math.max(1,Math.round(rect.height*d));canvas.dataset.dpr=d;draw()}
function drawCover(image,x,y,w,h){if(!image.complete||!image.naturalWidth)return;const scale=Math.max(w/image.naturalWidth,h/image.naturalHeight),sw=w/scale,sh=h/scale,sx=(image.naturalWidth-sw)/2,sy=(image.naturalHeight-sh)/2;ctx.drawImage(image,sx,sy,sw,sh,x,y,w,h)}
function drawCell(image,cell,x,y,w,h,cols=2,rows=2){if(!image.complete||!image.naturalWidth)return;const col=cell%cols,row=Math.floor(cell/cols),sw=image.naturalWidth/cols,sh=image.naturalHeight/rows;ctx.drawImage(image,col*sw,row*sh,sw,sh,x,y,w,h)}
function draw(){
  if(!run)return;const d=+canvas.dataset.dpr||1,w=canvas.width/d,h=canvas.height/d,px=x=>x/1000*w,py=y=>y/620*h,min=Math.min(w,h);
  ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,h);drawCover(images.background,0,0,w,h);ctx.save();
  drawObstacles(w,h,px,py);
  const heldPrize=["secure","lift"].includes(run.phase)?run.held:null;
  for(const prize of run.prizes){
    if(!prize.active)continue;
    if(prize===heldPrize||(run.phase==="fall"&&prize===run.held))continue;
    const size=clamp(min*.16+prize.weight*3,42,88),image=prize.kind<4?images.prizesA:images.prizesB,cell=prize.kind%4,x=px(prize.x),y=py(prize.y),isTarget=remainingTargets().includes(prize.kind);
    if(run.phase==="aim"&&isTarget){
      ctx.save();ctx.strokeStyle="#65ffe1";ctx.lineWidth=4;ctx.shadowColor="#65ffe1";ctx.shadowBlur=13;ctx.beginPath();ctx.arc(x,y,size*.58,0,Math.PI*2);ctx.stroke();ctx.restore();
    }
    ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(prize.kind*2.1+run.elapsed*.3)*.05);drawCell(image,cell,-size/2,-size/2,size,size);ctx.restore();
    if(run.phase==="aim"){
      const labelY=py(prize.y)-size*.58,badgeText=isTarget?`${t("targetMark")} · ${"◆".repeat(prize.weight)}`:"◆".repeat(prize.weight);
      ctx.font="800 12px sans-serif";const badgeWidth=clamp(ctx.measureText(badgeText).width+18,48,104);
      ctx.fillStyle=isTarget?"#087567ee":"#031c23cc";ctx.strokeStyle=isTarget?"#65ffe1":"#ffe173";ctx.lineWidth=isTarget?3:2;roundRect(px(prize.x)-badgeWidth/2,labelY,badgeWidth,22,10);ctx.fill();ctx.stroke();ctx.fillStyle="#fff";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(badgeText,px(prize.x),labelY+11);
    }
  }
  const claw=clawPosition(),cell=heldPrize?3:2,clawSize=clamp(min*.28,70,128),clawX=px(claw.x),clawY=py(claw.y);
  drawCell(images.atlas,cell,clawX-clawSize/2,clawY-clawSize*.72,clawSize,clawSize);
  if(heldPrize){
    const heldSize=clamp(min*.16+heldPrize.weight*3,54,82),heldImage=heldPrize.kind<4?images.prizesA:images.prizesB;
    ctx.save();ctx.fillStyle="#03252ecc";ctx.strokeStyle="#65ffe1";ctx.lineWidth=3;ctx.shadowColor="#65ffe1";ctx.shadowBlur=12;
    ctx.beginPath();ctx.arc(clawX,clawY,heldSize*.39,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
    drawCell(heldImage,heldPrize.kind%4,clawX-heldSize/2,clawY-heldSize/2,heldSize,heldSize);ctx.restore();
    const clawTop=clawY-clawSize*.72;
    ctx.save();ctx.beginPath();ctx.rect(clawX-clawSize/2,clawTop,clawSize,clawSize*.5);
    ctx.rect(clawX-clawSize/2,clawTop+clawSize*.42,clawSize*.34,clawSize*.58);
    ctx.rect(clawX+clawSize*.16,clawTop+clawSize*.42,clawSize*.34,clawSize*.58);ctx.clip();
    drawCell(images.atlas,3,clawX-clawSize/2,clawTop,clawSize,clawSize);ctx.restore();
  }
  if(run.phase==="fall"&&run.held){
    const fallingSize=clamp(min*.16+run.held.weight*3,54,82),fallingImage=run.held.kind<4?images.prizesA:images.prizesB;
    ctx.save();ctx.translate(px(run.fallX),py(run.fallY));ctx.rotate(run.fallRotation);drawCell(fallingImage,run.held.kind%4,-fallingSize/2,-fallingSize/2,fallingSize,fallingSize);ctx.restore();
  }
  if(run.phase==="aim"){
    const landingX=px(claw.x),landingY=py(run.aimY),active=run.prizes.filter(prize=>prize.active);
    const nearest=active.map(prize=>({prize,d:grabMetric(prize,claw.x,run.aimY,w,h)})).sort((a,b)=>a.d-b.d)[0],grabRadius=nearest?gripWindowFor(nearest.prize):58,catchable=Boolean(nearest&&nearest.d<=grabRadius),grabRadiusPx=grabRadius*Math.min(w/1000,h/620);
    ctx.strokeStyle=catchable?"#65ffe1":"#ffdb68";ctx.lineWidth=4;ctx.setLineDash([10,8]);ctx.beginPath();ctx.arc(landingX,landingY,grabRadiusPx,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=ctx.strokeStyle;ctx.beginPath();ctx.arc(landingX,landingY,5,0,Math.PI*2);ctx.fill();
    if(catchable){ctx.font="900 20px sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("✓",landingX,landingY-24)}
    ctx.strokeStyle="#6bf2e4aa";ctx.lineWidth=2;ctx.setLineDash([5,7]);ctx.beginPath();ctx.moveTo(landingX,py(105));ctx.lineTo(landingX,landingY);ctx.stroke();ctx.setLineDash([]);
    if(run.aimCorrection){
      const targetX=px(run.aimCorrection.targetX),targetY=py(run.aimCorrection.targetY);
      ctx.save();ctx.strokeStyle="#ff7ad9";ctx.fillStyle="#ff7ad9";ctx.lineWidth=4;ctx.setLineDash([8,6]);ctx.beginPath();ctx.moveTo(landingX,landingY);ctx.lineTo(targetX,targetY);ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.arc(targetX,targetY,grabRadiusPx*.75,0,Math.PI*2);ctx.stroke();ctx.font="900 16px sans-serif";ctx.textAlign="center";ctx.textBaseline="bottom";ctx.fillText(run.aimCorrection.text,(landingX+targetX)/2,(landingY+targetY)/2-8);ctx.restore();
    }
    const sway=Math.abs(claw.x-run.aimX),barWidth=clamp(w*.12,70,100),aimX=px(run.aimX);ctx.fillStyle="#ffdc6a";ctx.fillRect(aimX-barWidth/2,py(95),barWidth,7);ctx.fillStyle="#46e6d5";ctx.fillRect(aimX-barWidth/2,py(95),clamp(1-sway/70)*barWidth,7);
  }
  ctx.restore();
}
function drawObstacles(w,h,px,py){
  const type=run.level.obstacle;
  if(type==="none")return;
  const min=Math.min(w,h),prop=clamp(min*.2,52,118),at=(cell,x,y,size=prop)=>drawCell(images.props,cell,px(x)-size/2,py(y)-size/2,size,size);
  if(type==="bumper"||type==="mix"){at(1,260,355);at(1,640,360)}
  if(type==="shelf"||type==="mix"){const x=500+Math.sin(run.elapsed*1.4+run.level.shelfPhase)*115,size=clamp(prop*1.45,78,170);drawCell(images.props,2,px(x)-size/2,py(330)-prop/2,size,prop)}
  if(type==="magnet"||type==="mix")at(3,760,230,prop*1.08);
  if(type==="stack"||type==="mix"){at(0,440,390,prop*.8);at(0,530,405,prop*.8)}
}
function roundRect(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function logicalPoint(event){const rect=canvas.getBoundingClientRect();return{x:(event.clientX-rect.left)*1000/rect.width,y:(event.clientY-rect.top)*620/rect.height}}
function handlePointerAim(event,release=false){
  if(!run||activeModal())return;
  const point=logicalPoint(event);
  if(run.phase==="aim"){run.aimX=clamp(point.x,70,930);run.aimY=clamp(point.y,210,500);draw();if(release)beginDrop()}
}

function bind(){
  // Settings owns the live select, so observe the document instead of relying
  // on the element instance that existed during game bootstrap.
  document.addEventListener("change",event=>{
    if(event.target?.id!=="localeSelect")return;
    setLocale(event.target.value);
    // The shared locale runtime can already believe it owns this value while
    // the live game was restored from a conflicting retained locale. Emit the
    // ownership event explicitly so guide/shell owners cannot stay stale.
    window.dispatchEvent(new CustomEvent("wonder:locale-change",{detail:{locale:event.target.value}}));
  },true);
  window.addEventListener("wonder:locale-change",event=>{
    const next=event.detail?.locale;
    if(window.CARNIVAL_CLAW_LOCALES[next])setLocale(next,false);
  });
  $("startBtn").addEventListener("click",()=>{show("stage");setStagePanel("stages")});
  $("stageBackBtn").addEventListener("click",()=>show("main"));
  $("enterBtn").addEventListener("click",()=>selected<save.unlocked&&startMission(selected));
  $("stagesTab").addEventListener("click",()=>setStagePanel("stages"));
  $("cabinetTab").addEventListener("click",()=>setStagePanel("cabinet"));
  $("workshopTab").addEventListener("click",()=>setStagePanel("workshop"));
  $("stageRail").addEventListener("keydown",event=>{if(!["ArrowLeft","ArrowRight","Home","End","Enter"," "].includes(event.key))return;event.preventDefault();if(event.key==="Enter"||event.key===" "){if(selected<save.unlocked)startMission(selected);return}let next=event.key==="Home"?0:event.key==="End"?Math.min(29,save.unlocked-1):selected+(event.key==="ArrowLeft"?-1:1);selectStage(clamp(next,0,29),true);$(`stageRail`).querySelector(`[data-stage-index="${selected}"]`)?.focus()});
  $("stageRail").addEventListener("wonder:stage-snap",event=>{const index=Number(event.detail?.index);if(Number.isInteger(index)&&levels[index])selectStage(index,false)});
  $("battleBackBtn").addEventListener("click",()=>openModal("leavePanel",$("leaveContinueBtn")));
  $("leaveContinueBtn").addEventListener("click",()=>closeModal("leavePanel"));
  $("leaveStagesBtn").addEventListener("click",()=>{closeModal("leavePanel",false);show("stage")});
  $("pauseBtn").addEventListener("click",()=>openModal("pausePanel",$("resumeBtn")));
  $("resumeBtn").addEventListener("click",()=>closeModal("pausePanel"));
  $("tutorialStartBtn").addEventListener("click",()=>{save.tutorial=true;persist();closeModal("tutorialPanel")});
  $("dropBtn").addEventListener("click",()=>{if(run?.phase==="aim")beginDrop();else if(run?.phase==="secure")attemptLock()});
  $("restartBtn").addEventListener("click",()=>startMission(run.index));
  $("resultStagesBtn").addEventListener("click",()=>commitResult(()=>show("stage")));
  $("nextBtn").addEventListener("click",()=>commitResult(()=>startMission(Math.min(29,run.index+1))));
  $("retryBtn").addEventListener("click",()=>commitResult(()=>startMission(run.index)));
  canvas.addEventListener("pointerdown",event=>{if(pointerId!==null||run?.phase!=="aim")return;pointerId=event.pointerId;canvas.setPointerCapture(event.pointerId);handlePointerAim(event);event.preventDefault()});
  canvas.addEventListener("pointermove",event=>{if(pointerId===event.pointerId)handlePointerAim(event)});
  canvas.addEventListener("pointerup",event=>{if(pointerId!==event.pointerId)return;handlePointerAim(event,run?.phase==="aim");pointerId=null;event.preventDefault()});
  canvas.addEventListener("pointercancel",()=>{pointerId=null});
  canvas.addEventListener("keydown",event=>{if(!run||activeModal())return;const amount=event.shiftKey?28:14;if(run.phase==="aim"&&["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key)){run.aimX=clamp(run.aimX+(event.key==="ArrowLeft"?-amount:event.key==="ArrowRight"?amount:0),70,930);run.aimY=clamp(run.aimY+(event.key==="ArrowUp"?-amount:event.key==="ArrowDown"?amount:0),210,500);draw();event.preventDefault()}else if(run.phase==="secure"&&(event.key===" "||event.key==="Enter")){attemptLock();event.preventDefault()}else if(run.phase==="aim"&&(event.key===" "||event.key==="Enter")){beginDrop();event.preventDefault()}});
  window.addEventListener("resize",resizeCanvas,{passive:true});
  window.addEventListener("blur",()=>{if(screen==="battle"&&run&&!run.result&&!activeModal()&&(document.hidden||!resolvedAutoplayPhase()))openModal("pausePanel",$("resumeBtn"))});
  document.addEventListener("visibilitychange",()=>{if(document.hidden&&screen==="battle"&&run&&!run.result&&!activeModal())openModal("pausePanel",$("resumeBtn"))});
}
function init(){
  bind();setLocale(locale,false);
  Promise.all(Object.values(images).map(image=>image.decode?.().catch(()=>{})||Promise.resolve())).finally(()=>setTimeout(()=>{$("loadingPanel").hidden=true;show("main")},350));
}
window.__CARNIVAL_CLAW_TEST__={
  levels,startMission,beginDrop,selectStage(index,center=false){selectStage(index,center);return this.stageWindow()},stageWindow(){const rail=$("stageRail");return{selected,start:Number(rail.dataset.wpStageWindowStart),end:Number(rail.dataset.wpStageWindowEnd),pool:Number(rail.dataset.wpStagePoolSize),total:Number(rail.dataset.wpStageTotal),indexes:[...rail.children].map(card=>Number(card.dataset.stageIndex))}},step(seconds){for(let time=0;time<seconds&&!run?.result;time+=.02)update(.02);draw();return this.snapshot()},
  stepResolvedWall(milliseconds){if(!run||!resolvedAutoplayPhase())return this.snapshot();if(!resolvedWallAnchor)resolvedWallAnchor=performance.now()-run.phaseTime*1000;const wallTime=resolvedWallAnchor+milliseconds;update(.04,wallTime);update(.04,wallTime);draw();return this.snapshot()},
  finishResult(won=true){if(!run)startMission(selected);finish(Boolean(won));return this.snapshot()},
  prepareLift(kind,phaseTime=.2){
    if(!run)startMission(selected);
    const target=run.prizes.find(prize=>prize.active&&(kind===undefined||prize.kind===kind));if(!target)return null;
    run.aimX=target.x;run.aimY=target.y;run.dropX=target.x;run.phase="secure";run.phaseTime=phaseTime;run.held=target;run.grip=1;run.stability=1;run.lockValue=.08+phaseTime*.7;run.lockDirection=1;run.lockQuality=0;run.swing=0;run.feedback="phaseLift";renderHud();draw();return this.contactGeometry();
  },
  freeze(){cancelAnimationFrame(raf);raf=0;draw();return this.snapshot()},
  contactGeometry(){const claw=clawPosition();return{claw,held:run?.held?{x:claw.x,y:claw.y}:null,dropX:run?.dropX,aimY:run?.aimY}},
  aimWindowGeometry(){
    if(!run)return null;
    const rect=canvas.getBoundingClientRect(),claw=clawPosition(),active=run.prizes.filter(prize=>prize.active);
    const nearest=active.map(prize=>({prize,d:grabMetric(prize,claw.x,run.aimY,rect.width,rect.height)})).sort((a,b)=>a.d-b.d)[0],logicalRadius=nearest?gripWindowFor(nearest.prize):58,radius=logicalRadius*Math.min(rect.width/1000,rect.height/620);
    return{radiusX:radius,radiusY:radius,distance:nearest?.d??null,logicalRadius,nearestKind:nearest?.prize.kind??null,catchable:Boolean(nearest&&nearest.d<=logicalRadius)};
  },
  probeAimWindow(kind,axis="x",factor=1){
    if(!run)return null;
    const target=run.prizes.find(prize=>prize.active&&prize.kind===kind);if(!target)return null;
    const rect=canvas.getBoundingClientRect(),sx=rect.width/1000,sy=rect.height/620,logicalRadius=gripWindowFor(target),radius=logicalRadius*Math.min(sx,sy),desiredX=target.x-(axis==="x"?radius*factor/sx:0),sway=Math.sin(run.elapsed*(2.5-run.level.drift)+run.level.index*.4)*(38+run.level.chapter*6);
    run.aimX=desiredX-sway;run.aimY=target.y-(axis==="y"?radius*factor/sy:0);run.dropX=null;run.phase="aim";draw();
    return this.aimWindowGeometry();
  },
  setLockValue(value){if(run?.phase==="secure"){run.lockValue=clamp(value);draw()}return this.snapshot()},
  attemptLock(){attemptLock();return this.snapshot()},
  perfectDrop(kind){if(!run)return;const target=run.prizes.find(prize=>prize.active&&(kind===undefined||prize.kind===kind));if(!target)return;run.aimX=target.x;run.aimY=target.y;run.dropX=target.x;run.phase="secure";run.phaseTime=0;run.drops--;run.held=target;run.grip=1;run.stability=1;run.lockValue=.5;attemptLock();for(let time=0;time<1.5&&!run.result;time+=.02)update(.02);draw();return this.snapshot()},
  solve(){for(const kind of [...remainingTargets()])this.perfectDrop(kind);this.step(1);return this.snapshot()},
  snapshot(){return run?JSON.parse(JSON.stringify({screen,run,save})):null},setSave(value){save={...defaultSave(),...value,upgrades:{...defaultSave().upgrades,...(value.upgrades||{})}};persist();renderMain();renderStage()},getSave(){return JSON.parse(JSON.stringify(save))},getLocale(){return locale},setLocale,show
};
installVirtualStageDrag();
document.addEventListener("DOMContentLoaded",init);
})();
