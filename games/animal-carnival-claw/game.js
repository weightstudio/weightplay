(function(){
"use strict";
const $=id=>document.getElementById(id),$$=selector=>[...document.querySelectorAll(selector)];
const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value));
const fmt=(value,data={})=>String(value??"").replace(/\{(\w+)\}/g,(_,key)=>data[key]??"");
const localeNames={"en":"en","zh-tw":"zh-Hant","zh-cn":"zh-Hans","ja":"ja","ko":"ko","es":"es","pt-br":"pt-BR","fr":"fr","de":"de","it":"it","ru":"ru","hi":"hi","ar":"ar"};
const routeLocale=localeNames[location.pathname.split("/").filter(Boolean)[0]?.toLowerCase()];
let locale=routeLocale||safeGet("weightPlayLocale")||safeGet("weightplayLocale")||document.documentElement.lang||"en";
if(!window.CARNIVAL_CLAW_LOCALES[locale])locale="en";
let copy=window.CARNIVAL_CLAW_LOCALES[locale],screen="main",selected=0,focusReturn=null,raf=0,last=0,settledDecision=false;
const canvas=$("gameCanvas"),ctx=canvas.getContext("2d",{alpha:false});
const images={
  background:loadImage("../../assets/animal-carnival-claw-background.webp"),
  atlas:loadImage("../../assets/animal-carnival-claw-atlas.webp"),
  prizesA:loadImage("../../assets/animal-carnival-claw-prizes-a.webp"),
  prizesB:loadImage("../../assets/animal-carnival-claw-prizes-b.webp"),
  props:loadImage("../../assets/animal-carnival-claw-props.webp")
};
const defaultSave=()=>({unlocked:1,medals:Array(30).fill(0),cabinet:Array(8).fill(false),bolts:0,upgrades:{grip:0,stability:0,rail:0},tutorial:false});
let save=loadSave();
let run=null,pointerId=null,pointerStartX=null,keyStabilize=0;
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
function medalText(value){return value?"★".repeat(value):t("none")}
function announce(message,data){const node=$("phaseHint");if(node)node.textContent=t(message,data)}

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
function renderStage(){
  const cleared=save.medals.filter(Boolean).length;
  $("stageSummary").textContent=t("stageSummary",{cleared,bolts:save.bolts});
  const chapter=chapters[Math.floor(selected/5)];
  $("chapterKicker").textContent=t("mission",{n:selected+1});
  $("chapterTitle").textContent=t(chapter.name);$("chapterRule").textContent=t(chapter.rule);
  const rail=$("stageRail");rail.innerHTML="";
  levels.forEach((level,index)=>{
    const unlocked=index<save.unlocked,button=document.createElement("button");
    button.type="button";button.className=`stage-card${unlocked?"":" locked"}`;button.dataset.stageIndex=index;button.setAttribute("aria-disabled",String(!unlocked));button.tabIndex=index===selected?0:-1;
    const status=unlocked?(save.medals[index]?t("cleared",{medal:medalText(save.medals[index])}):t("ready")):t("locked");
    button.innerHTML=`<img src="../../assets/animal-carnival-claw-cover.webp" alt=""><span><strong>${t("mission",{n:index+1})}</strong><small>${t(chapters[level.chapter].name)} · ${status}</small></span>`;
    button.addEventListener("click",()=>selectStage(index,true));rail.append(button);
  });
  $("enterBtn").disabled=selected>=save.unlocked;
  renderCabinet();renderWorkshop();
}
function selectStage(index,center){
  selected=clamp(index,0,29);
  $$(".stage-card").forEach((card,i)=>{card.tabIndex=i===selected?0:-1;card.classList.toggle("is-centered",i===selected);card.classList.toggle("wp-stage-centered",i===selected)});
  const chapter=chapters[Math.floor(selected/5)];
  $("chapterKicker").textContent=t("mission",{n:selected+1});$("chapterTitle").textContent=t(chapter.name);$("chapterRule").textContent=t(chapter.rule);
  $("enterBtn").disabled=selected>=save.unlocked;
  if(center)centerSelected();
}
function centerSelected(smooth=true){const card=$(`stageRail`).querySelector(`[data-stage-index="${selected}"]`);card?.scrollIntoView({behavior:smooth?"smooth":"instant",block:"nearest",inline:"center"});selectStage(selected,false)}
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
    index,level,phase:"aim",elapsed:0,phaseTime:0,drops:3,aimX:500,aimY:360,dropX:null,stabilizer:0,stability:1,grip:1,swing:0,held:null,
    prizes:level.prizes.map(prize=>({...prize,active:true,delivered:false})),targets:[...level.targets],delivered:[],misses:0,result:null,feedback:"phaseAim"
  };
  settledDecision=false;$("resultPanel").hidden=true;$("leavePanel").hidden=true;$("pausePanel").hidden=true;$("battleLive").hidden=false;$("battleLive").inert=false;
  $("resultStagesBtn").disabled=false;$("retryBtn").disabled=false;$("nextBtn").disabled=true;
  show("battle");resizeCanvas();renderHud();draw();
  if(!save.tutorial){openModal("tutorialPanel",$("tutorialStartBtn"))}
}
function remainingTargets(){const deliveredKinds=new Set(run.delivered.filter(entry=>entry.target).map(entry=>entry.kind));return run.targets.filter(kind=>!deliveredKinds.has(kind))}
function renderHud(){
  if(!run)return;
  $("missionLabel").textContent=t("mission",{n:run.index+1});$("objectiveText").textContent=t("objective",{count:remainingTargets().length});
  $("dropsValue").textContent=run.drops;$("gripValue").textContent=`${Math.round(run.grip*100)}%`;
  $("stabilityFill").style.transform=`scaleX(${clamp(run.stability)})`;
  $("targetList").innerHTML=run.targets.map(kind=>`<span class="target-chip ${run.delivered.some(entry=>entry.target&&entry.kind===kind)?"done":""}">${prizeName(kind)}</span>`).join("");
  $("dropBtn").disabled=run.phase!=="aim";$("restartBtn").disabled=!!run.result;
  announce(run.feedback||"phaseAim");
}
function beginDrop(){
  if(!run||run.phase!=="aim"||run.result)return;
  run.dropX=clawPosition().x;run.phase="drop";run.phaseTime=0;run.drops--;run.grip=1;run.stability=1;run.feedback="phaseDrop";renderHud();
}
function update(dt){
  if(!run||run.result||screen!=="battle"||activeModal())return;
  run.elapsed+=dt;run.phaseTime+=dt;
  if(run.phase==="aim"){
    const drift=(run.level.drift||0)*(1-save.upgrades.rail*.18);
    run.aimX=clamp(run.aimX+Math.sin(run.elapsed*1.8+run.level.index)*drift*20*dt,80,920);
  }else if(run.phase==="drop"){
    if(run.phaseTime>=.72)resolveGrip();
  }else if(run.phase==="lift"){
    const held=run.held,swing=Math.sin(run.phaseTime*(3.8+held.weight*.35)+held.kind)*(.34+held.weight*.09+run.level.drift);
    const response=.42+save.upgrades.stability*.12,counterInput=run.stabilizer||keyStabilize,counter=counterInput*response;
    run.swing=swing;updateSteerCoach(swing,counterInput);
    const error=Math.abs(swing+counter),loss=Math.max(0,error-.18)*dt*(.52+held.weight*.14);
    run.stability=clamp(run.stability-loss+dt*.035);run.grip=clamp(run.grip-loss*.78);
    if(run.stability<=.15||run.grip<=.12){dropHeld();return}
    if(run.phaseTime>=1.55)deliverHeld();
  }else if(run.phase==="return"&&run.phaseTime>=.52){
    if(!remainingTargets().length){finish(true);return}
    if(run.drops<=0){finish(false);return}
    run.phase="aim";run.phaseTime=0;run.held=null;run.stabilizer=0;run.feedback="phaseAim";renderHud();
  }
}
function clawPosition(){
  if(!run)return{x:500,y:80};
  const sway=Math.sin(run.elapsed*(2.5-run.level.drift)+run.level.index*.4)*(38+run.level.chapter*6);
  const liveX=clamp(run.aimX+sway,68,932),x=run.phase==="aim"?liveX:(run.dropX??liveX);
  if(run.phase==="drop")return{x,y:80+(run.aimY-80)*clamp(run.phaseTime/.72)};
  if(run.phase==="lift")return{x,y:run.aimY-(run.aimY-95)*clamp(run.phaseTime/1.55)};
  if(run.phase==="return")return{x,y:95};
  return{x,y:80};
}
function gripWindowFor(prize){return 62+save.upgrades.grip*9-prize.weight*4}
function resolveGrip(){
  const claw=clawPosition(),active=run.prizes.filter(prize=>prize.active);
  const nearest=active.map(prize=>({prize,d:Math.hypot(prize.x-claw.x,prize.y-run.aimY)})).sort((a,b)=>a.d-b.d)[0];
  const grabRadius=nearest?gripWindowFor(nearest.prize):0;
  if(nearest&&nearest.d<=grabRadius){
    run.held=nearest.prize;run.phase="lift";run.phaseTime=0;run.grip=clamp(1-nearest.d/(grabRadius*1.45));run.stability=1;run.swing=0;run.feedback="phaseLift";
  }else{
    run.misses++;run.phase="return";run.phaseTime=0;run.grip=0;run.stability=.2;run.feedback="miss";
  }
  renderHud();
}
function dropHeld(){
  const held=run.held;if(held){held.x=clamp(held.x+Math.sin(run.elapsed)*55,90,910);held.y=clamp(held.y+26,300,500)}
  run.misses++;run.phase="return";run.phaseTime=0;run.held=null;run.grip=0;run.feedback="miss";renderHud();
}
function deliverHeld(){
  const held=run.held;if(!held)return;
  held.active=false;held.delivered=true;
  const target=run.targets.includes(held.kind)&&!run.delivered.some(entry=>entry.target&&entry.kind===held.kind);
  run.delivered.push({kind:held.kind,target});save.cabinet[held.kind]=true;persist();
  run.phase="return";run.phaseTime=0;run.held=null;run.feedback=target?"caught":"wrong";renderHud();
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
  $("resultText").textContent=t(won?"winText":"failText",{drops:run.drops});
  $("bestText").textContent=won?(newBest?t("newBest"):t("best",{medal:medalText(previous)})):"";
  $("nextBtn").disabled=!won||run.index>=29;$("nextBtn").classList.toggle("primary-action",won&&run.index<29);
  requestAnimationFrame(()=>(won&&run.index<29?$("nextBtn"):$("retryBtn")).focus({preventScroll:true}));
}
function commitResult(action){if(settledDecision||$("resultPanel").hidden)return;settledDecision=true;[$("resultStagesBtn"),$("nextBtn"),$("retryBtn")].forEach(button=>button.disabled=true);action()}

function updateSteerCoach(swing,counter){
  const hint=$("phaseHint");if(!hint)return;
  const hasInput=Math.abs(counter)>=.12,correct=hasInput&&Math.sign(counter)===-Math.sign(swing);
  hint.dataset.steer=correct?"correct":hasInput?"wrong":"prompt";
  hint.textContent=t(correct?"steadyGood":hasInput?"steadyWrong":swing>0?"counterLeft":"counterRight");
}

function activeModal(){return["tutorialPanel","leavePanel","pausePanel","resultPanel"].some(id=>!$(id).hidden)}
function openModal(id,focus){focusReturn=document.activeElement;$(id).hidden=false;cancelAnimationFrame(raf);raf=0;requestAnimationFrame(()=>focus?.focus({preventScroll:true}))}
function closeModal(id,resume=true){$(id).hidden=true;focusReturn?.focus?.({preventScroll:true});focusReturn=null;if(resume)resumeLoop()}
function resumeLoop(){if(!run||run.result||screen!=="battle"||activeModal())return;cancelAnimationFrame(raf);last=performance.now();raf=requestAnimationFrame(loop)}
function loop(time){raf=0;const dt=Math.min(.04,(time-last)/1000||0);last=time;update(dt);draw();if(run&&!run.result&&screen==="battle"&&!activeModal())raf=requestAnimationFrame(loop)}
function resizeCanvas(){const rect=canvas.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1);canvas.width=Math.max(1,Math.round(rect.width*d));canvas.height=Math.max(1,Math.round(rect.height*d));canvas.dataset.dpr=d;draw()}
function drawCover(image,x,y,w,h){if(!image.complete||!image.naturalWidth)return;const scale=Math.max(w/image.naturalWidth,h/image.naturalHeight),sw=w/scale,sh=h/scale,sx=(image.naturalWidth-sw)/2,sy=(image.naturalHeight-sh)/2;ctx.drawImage(image,sx,sy,sw,sh,x,y,w,h)}
function drawCell(image,cell,x,y,w,h,cols=2,rows=2){if(!image.complete||!image.naturalWidth)return;const col=cell%cols,row=Math.floor(cell/cols),sw=image.naturalWidth/cols,sh=image.naturalHeight/rows;ctx.drawImage(image,col*sw,row*sh,sw,sh,x,y,w,h)}
function draw(){
  if(!run)return;const d=+canvas.dataset.dpr||1,w=canvas.width/d,h=canvas.height/d,px=x=>x/1000*w,py=y=>y/620*h,min=Math.min(w,h);
  ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,h);drawCover(images.background,0,0,w,h);ctx.save();
  drawObstacles(w,h,px,py);
  const heldPrize=run.phase==="lift"?run.held:null;
  for(const prize of run.prizes){
    if(!prize.active)continue;
    if(prize===heldPrize)continue;
    const size=clamp(min*.16+prize.weight*3,42,88),image=prize.kind<4?images.prizesA:images.prizesB,cell=prize.kind%4,x=px(prize.x),y=py(prize.y);
    ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(prize.kind*2.1+run.elapsed*.3)*.05);drawCell(image,cell,-size/2,-size/2,size,size);ctx.restore();
    if(run.phase==="aim"){const labelY=py(prize.y)-size*.58;ctx.fillStyle="#031c23cc";ctx.strokeStyle="#ffe173";ctx.lineWidth=2;roundRect(px(prize.x)-24,labelY,48,20,9);ctx.fill();ctx.stroke();ctx.fillStyle="#fff";ctx.font="800 12px sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("◆".repeat(prize.weight),px(prize.x),labelY+10)}
  }
  const claw=clawPosition(),cell=heldPrize?3:2,clawSize=clamp(min*.28,70,128),clawX=px(claw.x),clawY=py(claw.y);
  drawCell(images.atlas,cell,clawX-clawSize/2,clawY-clawSize*.72,clawSize,clawSize);
  if(heldPrize){
    const heldSize=clamp(min*.17+heldPrize.weight*3,44,92),heldImage=heldPrize.kind<4?images.prizesA:images.prizesB;
    drawCell(heldImage,heldPrize.kind%4,clawX-heldSize/2,clawY-heldSize/2,heldSize,heldSize);
    const desired=run.swing>0?"←":"→",correct=Math.abs(run.stabilizer||keyStabilize)>=.12&&Math.sign(run.stabilizer||keyStabilize)===-Math.sign(run.swing);
    ctx.fillStyle=correct?"#65ffe1":"#ffdb68";ctx.font=`900 ${clamp(min*.12,30,58)}px sans-serif`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(desired,clamp(clawX,45,w-45),clamp(clawY-clawSize*.82,32,h-32));
  }
  if(run.phase==="aim"){
    const landingX=px(claw.x),landingY=py(run.aimY),active=run.prizes.filter(prize=>prize.active);
    const nearest=active.map(prize=>({prize,d:Math.hypot(prize.x-claw.x,prize.y-run.aimY)})).sort((a,b)=>a.d-b.d)[0],grabRadius=nearest?gripWindowFor(nearest.prize):58,catchable=Boolean(nearest&&nearest.d<=grabRadius);
    ctx.strokeStyle=catchable?"#65ffe1":"#ffdb68";ctx.lineWidth=4;ctx.setLineDash([10,8]);ctx.beginPath();ctx.ellipse(landingX,landingY,grabRadius*w/1000,grabRadius*h/620,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=ctx.strokeStyle;ctx.beginPath();ctx.arc(landingX,landingY,5,0,Math.PI*2);ctx.fill();
    if(catchable){ctx.font="900 20px sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("✓",landingX,landingY-24)}
    ctx.strokeStyle="#6bf2e4aa";ctx.lineWidth=2;ctx.setLineDash([5,7]);ctx.beginPath();ctx.moveTo(landingX,py(105));ctx.lineTo(landingX,landingY);ctx.stroke();ctx.setLineDash([]);
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
  else if(run.phase==="lift"&&pointerStartX!==null){run.stabilizer=clamp((point.x-pointerStartX)/72,-1,1)}
}

function bind(){
  $("localeSelect").addEventListener("change",event=>setLocale(event.target.value));
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
  $("dropBtn").addEventListener("click",beginDrop);$("restartBtn").addEventListener("click",()=>startMission(run.index));
  $("resultStagesBtn").addEventListener("click",()=>commitResult(()=>show("stage")));
  $("nextBtn").addEventListener("click",()=>commitResult(()=>startMission(Math.min(29,run.index+1))));
  $("retryBtn").addEventListener("click",()=>commitResult(()=>startMission(run.index)));
  canvas.addEventListener("pointerdown",event=>{if(pointerId!==null)return;pointerId=event.pointerId;pointerStartX=run?.phase==="lift"?logicalPoint(event).x:null;canvas.setPointerCapture(event.pointerId);handlePointerAim(event);event.preventDefault()});
  canvas.addEventListener("pointermove",event=>{if(pointerId===event.pointerId)handlePointerAim(event)});
  canvas.addEventListener("pointerup",event=>{if(pointerId!==event.pointerId)return;handlePointerAim(event,run?.phase==="aim");pointerId=null;pointerStartX=null;run&&(run.stabilizer=0);event.preventDefault()});
  canvas.addEventListener("pointercancel",()=>{pointerId=null;pointerStartX=null;if(run)run.stabilizer=0});
  canvas.addEventListener("keydown",event=>{if(!run||activeModal())return;const amount=event.shiftKey?28:14;if(run.phase==="aim"&&["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key)){run.aimX=clamp(run.aimX+(event.key==="ArrowLeft"?-amount:event.key==="ArrowRight"?amount:0),70,930);run.aimY=clamp(run.aimY+(event.key==="ArrowUp"?-amount:event.key==="ArrowDown"?amount:0),210,500);draw();event.preventDefault()}else if(run.phase==="lift"&&["ArrowLeft","ArrowRight"].includes(event.key)){keyStabilize=event.key==="ArrowLeft"?-1:1;event.preventDefault()}else if(run.phase==="aim"&&(event.key===" "||event.key==="Enter")){beginDrop();event.preventDefault()}});
  canvas.addEventListener("keyup",event=>{if(["ArrowLeft","ArrowRight"].includes(event.key))keyStabilize=0});
  window.addEventListener("resize",resizeCanvas,{passive:true});
  window.addEventListener("blur",()=>{if(screen==="battle"&&run&&!run.result&&!activeModal())openModal("pausePanel",$("resumeBtn"))});
  document.addEventListener("visibilitychange",()=>{if(document.hidden&&screen==="battle"&&run&&!run.result&&!activeModal())openModal("pausePanel",$("resumeBtn"))});
}
function init(){
  bind();setLocale(locale,false);
  Promise.all(Object.values(images).map(image=>image.decode?.().catch(()=>{})||Promise.resolve())).finally(()=>setTimeout(()=>{$("loadingPanel").hidden=true;show("main")},350));
}
window.__CARNIVAL_CLAW_TEST__={
  levels,startMission,beginDrop,step(seconds){for(let time=0;time<seconds&&!run?.result;time+=.02)update(.02);draw();return this.snapshot()},
  finishResult(won=true){if(!run)startMission(selectedStage);finish(Boolean(won));return this.snapshot()},
  perfectDrop(kind){if(!run)return;const target=run.prizes.find(prize=>prize.active&&(kind===undefined||prize.kind===kind));if(!target)return;run.aimX=target.x;run.aimY=target.y;run.phase="lift";run.phaseTime=0;run.drops--;run.held=target;run.grip=1;run.stability=1;run.stabilizer=0;for(let time=0;time<1.7&&!run.result;time+=.02){run.stabilizer=-Math.sin(run.phaseTime*(3.8+target.weight*.35)+target.kind);update(.02)}draw();return this.snapshot()},
  solve(){for(const kind of [...remainingTargets()])this.perfectDrop(kind);this.step(1);return this.snapshot()},
  snapshot(){return run?JSON.parse(JSON.stringify({screen,run,save})):null},setSave(value){save={...defaultSave(),...value,upgrades:{...defaultSave().upgrades,...(value.upgrades||{})}};persist();renderMain();renderStage()},getSave(){return JSON.parse(JSON.stringify(save))},setLocale,show
};
document.addEventListener("DOMContentLoaded",init);
})();
