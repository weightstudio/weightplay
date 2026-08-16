(()=>{
  "use strict";
  const L=window.AnimalSkybridgeRivalsLocales;
  const $=(id)=>document.getElementById(id);
  const els={loading:$("loading"),loadingFill:$("loadingFill"),mainGroup:$("mainGroup"),stage:$("stage"),battle:$("battle"),locale:$("locale"),soundToggle:$("soundToggle"),lobbyReturn:$("lobbyReturn"),mainProgress:$("mainProgress"),start:$("start"),stageBack:$("stageBack"),stageRail:$("stageRail"),stageProgress:$("stageProgress"),stageHint:$("stageHint"),racesTab:$("racesTab"),workshopTab:$("workshopTab"),upgrades:$("upgrades"),shardCount:$("shardCount"),workshopFeedback:$("workshopFeedback"),diamondUnlock:$("diamondUnlock"),battleLive:$("battleLive"),battleBack:$("battleBack"),battleHelp:$("battleHelp"),raceLabel:$("raceLabel"),racePosition:$("racePosition"),stackValue:$("stackValue"),timeValue:$("timeValue"),bridgeValue:$("bridgeValue"),objective:$("objective"),arenaWrap:$("arenaWrap"),arena:$("arena"),dash:$("dash"),dashValue:$("dashValue"),feedback:$("feedback"),leave:$("leave"),continueBattle:$("continueBattle"),leaveStage:$("leaveStage"),tutorial:$("tutorial"),tutorialDone:$("tutorialDone"),result:$("result"),resultKicker:$("resultKicker"),resultTitle:$("resultTitle"),resultText:$("resultText"),resultStats:$("resultStats"),resultPurpose:$("resultPurpose"),retry:$("retry"),resultStage:$("resultStage"),nextRace:$("nextRace")};
  const ctx=els.arena.getContext("2d");
  const bg=new Image(),sprites=new Image();
  bg.src="../../assets/animal-skybridge-rivals/arena.webp";
  sprites.src="../../assets/animal-skybridge-rivals/racer-atlas.webp";
  const STORAGE="weightplay:animal-skybridge-rivals:v1",LOCALE_STORAGE="weightplayLocale";
  const memory=new Map();
  const safeStore={get(k){try{return localStorage.getItem(k)}catch{return memory.get(k)||null}},set(k,v){memory.set(k,v);try{localStorage.setItem(k,v)}catch{}},remove(k){memory.delete(k);try{localStorage.removeItem(k)}catch{}}};
  const localeSegments={en:"en","zh-Hant":"zh-tw","zh-Hans":"zh-cn",ja:"ja",ko:"ko",es:"es","pt-BR":"pt-br",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"};
  const segmentLocales=Object.fromEntries(Object.entries(localeSegments).map(([k,v])=>[v,k]));
  function initialLocale(){const segment=location.pathname.split("/").filter(Boolean)[0];const routed=segmentLocales[segment];const saved=safeStore.get(LOCALE_STORAGE);return L.codes.includes(routed)?routed:L.codes.includes(saved)?saved:"en"}
  let locale=initialLocale();
  const GAME_ID="animal-skybridge-rivals",GAME_VERSION=17,INTERFACE_VERSION=6;
  let lastInputType="unknown";
  function viewportBucket(){const viewport=window.visualViewport,width=Math.round(viewport?.width||window.innerWidth||0),height=Math.round(viewport?.height||window.innerHeight||0);if(width>height&&height<=500)return"short-landscape";if(width>=1000)return"desktop";if(width>=600)return"tablet";return"phone"}
  function normalizeInputType(value){return["pointer","touch","keyboard"].includes(value)?value:"unknown"}
  function eventInputType(event){if(event?.pointerType==="touch")return"touch";if(event?.pointerType)return"pointer";if(event?.type?.startsWith("key")||event?.detail===0)return"keyboard";return"pointer"}
  function track(name,data={}){const payload={...data,game_id:GAME_ID,game_version:`v${GAME_VERSION}`,interface_version:String(INTERFACE_VERSION),locale:locale||"en",viewport_bucket:viewportBucket(),input_type:normalizeInputType(data.input_type||lastInputType)};if(window.WonderAnalytics&&typeof window.WonderAnalytics.track==="function")window.WonderAnalytics.track(name,payload)}
  function freshSave(){return{unlocked:1,stars:{},best:{},shards:0,upgrades:{capacity:0,speed:0,grip:0},tutorial:false,championAura:false}}
  function boundedInteger(value,fallback,min,max){const number=Number(value);return Number.isFinite(number)?Math.max(min,Math.min(max,Math.floor(number))):fallback}
  function normalizeStageRecord(value,max){
    const source=value&&typeof value==="object"&&!Array.isArray(value)?value:{};
    const result={};
    for(let index=0;index<30;index+=1){
      if(!Object.prototype.hasOwnProperty.call(source,index))continue;
      const number=Number(source[index]);
      if(!Number.isFinite(number)||number<=0)continue;
      result[index]=Math.max(1,Math.min(max,Math.floor(number)));
    }
    return result
  }
  function normalizeSave(value){
    const source=value&&typeof value==="object"&&!Array.isArray(value)?value:{};
    return{
      unlocked:boundedInteger(source.unlocked,1,1,30),
      stars:normalizeStageRecord(source.stars,3),
      best:normalizeStageRecord(source.best,999),
      shards:boundedInteger(source.shards,0,0,999999),
      upgrades:{
        capacity:boundedInteger(source.upgrades?.capacity,0,0,5),
        speed:boundedInteger(source.upgrades?.speed,0,0,5),
        grip:boundedInteger(source.upgrades?.grip,0,0,5)
      },
      tutorial:source.tutorial===true,
      championAura:source.championAura===true
    }
  }
  function loadSave(){try{return normalizeSave(JSON.parse(safeStore.get(STORAGE)||"null"))}catch{return freshSave()}}
  let save=loadSave();
  function persist(){safeStore.set(STORAGE,JSON.stringify(save))}
  persist();
  function t(key,vars={}){const source=L.dictionaries.en[key]??key,owned=L.dictionaries[locale]?.[key],translate=window.WeightPlayGameRuntimeLocalizer?.translate;let s=owned??source;if(locale!=="en"&&translate&&s===source)s=translate(source);for(const [k,v] of Object.entries(vars))s=String(s).replaceAll(`{${k}}`,String(v));return String(s)}
  const cueTimes=new Map();
  function playCue(name,minGap=0){const now=performance.now(),last=cueTimes.get(name)||-Infinity;if(now-last<minGap)return;cueTimes.set(name,now);window.WonderSound?.play?.(name)}
  function updateSoundToggle(){const muted=window.WonderSound?.isMuted?.()===true;els.soundToggle.dataset.soundToggle="true";els.soundToggle.textContent=muted?"🔇":"🔊";els.soundToggle.title=t("sound");els.soundToggle.setAttribute("aria-label",t(muted?"soundEnable":"soundDisable"));els.soundToggle.classList.toggle("muted",muted)}
  function setText(){document.documentElement.lang=locale;document.documentElement.dir=locale==="ar"?"rtl":"ltr";document.title=`${t("title")} | WeightPlay`;document.querySelectorAll("[data-t]").forEach(el=>{el.textContent=t(el.dataset.t)});document.querySelectorAll("[data-ta]").forEach(el=>{el.setAttribute("aria-label",t(el.dataset.ta))});els.locale.value=locale;els.lobbyReturn.href=`/${localeSegments[locale]||"en"}/`;updateSoundToggle();renderProgress();renderStages();renderWorkshop();if(run)updateHud()}
  function renderProgress(){const stars=Object.values(save.stars).reduce((a,b)=>a+Number(b||0),0);els.mainProgress.textContent=`${save.unlocked} / 30 · ★ ${stars}`;els.stageProgress.textContent=`${save.unlocked} / 30 · ★ ${stars}`}
  const chapterKeys=["chapter1","chapter2","chapter3","chapter4","chapter5","chapter6"];
  const cardViewSeen=new Set(),cardFocusSeen=new Set();
  let stageMapVisit=0,stageCardViewObserver=null,stageCardPoolObserver=null;
  const coursePlans=[
    {layout:"meadow",hazard:"none",item:"dash",route:[.20,.38,.62,.80]},
    {layout:"split",hazard:"bombs",item:"shield",route:[.14,.30,.70,.86]},
    {layout:"islands",hazard:"monster",item:"magnet",route:[.18,.46,.72,.84]},
    {layout:"cross",hazard:"bombs",item:"magnet",route:[.12,.42,.58,.88]},
    {layout:"slalom",hazard:"monster",item:"dash",route:[.16,.34,.66,.82]}
  ];
  const modeCycle=["classic","dual","beacons","switch","relay","assault"];
  const stages=Array.from({length:30},(_,i)=>{const chapter=Math.floor(i/5),plan=coursePlans[(i+chapter)%coursePlans.length],mode=modeCycle[i%modeCycle.length];return{index:i,number:i+1,chapter,goal:12+chapter*2+(i%5),time:72-Math.min(16,chapter*2+(i%5)),aiSpeed:i<5?.112+i*.004:.128+i*.0018,carry:5+Math.floor(chapter/2),wind:chapter>=2&&i%3!==0,reinforced:chapter>=3&&i%2===0,moving:chapter>=4||plan.layout==="slalom",champion:chapter>=5,layout:mode==="assault"?"fortress":plan.layout,mode,hazard:i===0?"none":plan.hazard,item:plan.item,route:plan.route,bombCount:i===0?0:1+Math.floor(chapter/2),monsterCount:plan.hazard==="monster"?1+(chapter>=4?1:0):0}});
  function stageName(stage){return `${t("race",{number:stage.number})} · ${t(chapterKeys[stage.chapter])}`}
  function stageTelemetry(stage,name,inputType="unknown"){const seen=name==="race_card_view"?cardViewSeen:cardFocusSeen,key=name==="race_card_view"?`${stageMapVisit}:${stage.index}`:`${stageMapVisit}:${stage.index}:${inputType}`;if(seen.has(key))return;seen.add(key);track(name,{source:"race_map",map_visit:stageMapVisit,race:stage.number,chapter:stage.chapter+1,goal:stage.goal,time:stage.time,unlocked:stage.index<save.unlocked,input_type:inputType})}
  function observeStageCards(){stageCardViewObserver?.disconnect();stageCardViewObserver=null;if(document.body.dataset.screen!=="stage")return;if(!stageCardPoolObserver){stageCardPoolObserver=new MutationObserver(()=>{if(document.body.dataset.screen!=="stage")return;els.stageRail.querySelectorAll("[data-wp-stage-pool-node][aria-current=\"true\"]").forEach(card=>{const stage=stages[Number(card.dataset.stageIndex)];if(stage)stageTelemetry(stage,"race_card_view",lastInputType)})});stageCardPoolObserver.observe(els.stageRail,{childList:true,subtree:false,attributes:true,attributeFilter:["data-stage-index","aria-current"]})}if(!window.IntersectionObserver){const stage=stages[Math.min(save.unlocked-1,29)];if(stage)stageTelemetry(stage,"race_card_view");return}stageCardViewObserver=new IntersectionObserver(entries=>{if(document.body.dataset.screen!=="stage")return;for(const entry of entries)if(entry.isIntersecting){const stage=stages[Number(entry.target.dataset.stageIndex)];if(stage)stageTelemetry(stage,"race_card_view")}}, {root:els.stageRail,threshold:.6});els.stageRail.querySelectorAll(".stage-card").forEach(card=>stageCardViewObserver.observe(card))}
  function renderStages(){if(!els.stageRail)return;stageCardViewObserver?.disconnect();stageCardViewObserver=null;els.stageRail.innerHTML="";stages.forEach(stage=>{const unlocked=stage.index<save.unlocked;const card=document.createElement("button");card.type="button";card.className=`stage-card${unlocked?"":" locked"}`;card.dataset.stageIndex=String(stage.index);card.tabIndex=-1;card.disabled=false;card.setAttribute("aria-disabled",String(!unlocked));card.setAttribute("aria-keyshortcuts","ArrowLeft ArrowRight Home End");card.innerHTML=`<small>${t(chapterKeys[stage.chapter])}</small><strong>${t("race",{number:stage.number})}</strong><span>${stage.goal} ◈ · ${stage.time}s</span><span>${unlocked?`★ ${save.stars[stage.index]||0}`:"🔒"}</span>`;card.addEventListener("click",event=>{selectCentered(card,eventInputType(event));if(!unlocked){els.stageHint.textContent=t("stageLocked");return}reclaimVisibleForeground(event);startRace(stage.index,{inputType:eventInputType(event),entry:"stage_card"})});els.stageRail.append(card)});const generation=sceneGeneration;requestAnimationFrame(()=>{if(generation!==sceneGeneration||document.body.dataset.screen!=="stage")return;centerStage(Math.min(save.unlocked-1,29),false);requestAnimationFrame(()=>{if(generation===sceneGeneration&&document.body.dataset.screen==="stage")observeStageCards()})})}
  function selectCentered(card,inputType="unknown"){els.stageRail.querySelectorAll(".stage-card").forEach(c=>{const selected=c===card;c.classList.toggle("centered",selected);c.tabIndex=selected?0:-1;if(selected)c.setAttribute("aria-current","true");else c.removeAttribute("aria-current")});const stage=stages[Number(card?.dataset.stageIndex)];if(stage){stageTelemetry(stage,"race_card_view",inputType);stageTelemetry(stage,"race_card_focus",inputType)}}
  function centerStage(index,smooth=true,inputType="unknown"){const card=els.stageRail.querySelector(`[data-stage-index="${index}"]`);if(!card)return;selectCentered(card,inputType);const left=card.offsetLeft-(els.stageRail.clientWidth-card.offsetWidth)/2;els.stageRail.scrollTo({left,behavior:smooth?"smooth":"auto"})}
  function moveStageFocus(key){const cards=[...els.stageRail.querySelectorAll(".stage-card")];if(!cards.length)return;const current=Math.max(0,cards.indexOf(document.activeElement)),rtl=getComputedStyle(els.stageRail).direction==="rtl",step=key==="ArrowRight"?(rtl?-1:1):(rtl?1:-1),target=key==="Home"?cards[0]:key==="End"?cards.at(-1):cards[Math.max(0,Math.min(cards.length-1,current+step))];if(!target)return;centerStage(Number(target.dataset.stageIndex),true,"keyboard");target.focus({preventScroll:true})}
  els.stageRail.addEventListener("keydown",event=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)||!event.target.closest(".stage-card"))return;event.preventDefault();moveStageFocus(event.key)});
  document.addEventListener("keydown",event=>{if(document.body.dataset.screen!=="stage"||!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;const card=event.target.closest?.(".stage-card");if(!card)return;const current=Number(card.dataset.stageIndex),rtl=getComputedStyle(els.stageRail).direction==="rtl",delta=event.key==="ArrowRight"?(rtl?-1:1):(rtl?1:-1),index=event.key==="Home"?0:event.key==="End"?29:Math.max(0,Math.min(29,current+delta)),stage=stages[index];if(stage)stageTelemetry(stage,"race_card_focus","keyboard")},true);
  let settleTimer=0,stageFocusFrame=0,sceneGeneration=0;
  function cancelStageFocus(){if(stageFocusFrame){cancelAnimationFrame(stageFocusFrame);stageFocusFrame=0}}
  function focusStageCardAfterSettlement(index){cancelStageFocus();const generation=sceneGeneration;let remainingFrames=120;const settle=()=>{if(generation!==sceneGeneration||document.body.dataset.screen!=="stage"){stageFocusFrame=0;return}const virtualized=els.stageRail.dataset.wpStageVirtualized==="bounded-recycle";const selector=virtualized?`:scope > [data-wp-stage-pool-node][data-stage-index="${index}"]`:`:scope > [data-stage-index="${index}"]`;const card=els.stageRail.querySelector(selector);if(card){centerStage(index,false);requestAnimationFrame(()=>{if(generation!==sceneGeneration||document.body.dataset.screen!=="stage")return;const settledCard=els.stageRail.querySelector(selector);settledCard?.focus({preventScroll:true})});stageFocusFrame=0;return}if(--remainingFrames<=0){stageFocusFrame=0;return}stageFocusFrame=requestAnimationFrame(settle)};stageFocusFrame=requestAnimationFrame(settle)}
  els.stageRail.addEventListener("scroll",()=>{clearTimeout(settleTimer);const generation=sceneGeneration;settleTimer=setTimeout(()=>{settleTimer=0;if(generation!==sceneGeneration||document.body.dataset.screen!=="stage")return;const center=els.stageRail.scrollLeft+els.stageRail.clientWidth/2;let best=null,dist=Infinity;els.stageRail.querySelectorAll(".stage-card").forEach(card=>{const d=Math.abs(card.offsetLeft+card.offsetWidth/2-center);if(d<dist){dist=d;best=card}});if(best){selectCentered(best,lastInputType);const left=best.offsetLeft-(els.stageRail.clientWidth-best.offsetWidth)/2;els.stageRail.scrollTo({left,behavior:"smooth"})}},120)},{passive:true});
  function setTab(name){document.querySelectorAll(".stage-tabs button").forEach(b=>b.classList.toggle("active",b.dataset.tab===name));els.racesTab.hidden=name!=="races";els.workshopTab.hidden=name!=="workshop";if(name==="workshop"){renderWorkshop();track("workshop_open",{source:"race_map"});upgradeDefs.forEach(def=>track("upgrade_view",{upgrade:def.key,level:save.upgrades[def.key]||0}))}}
  document.querySelectorAll(".stage-tabs button").forEach(b=>b.addEventListener("click",()=>setTab(b.dataset.tab)));
  const upgradeDefs=[{key:"capacity",icon:"▣",name:"upgradeCapacity",desc:"capacityDesc"},{key:"speed",icon:"⚡",name:"upgradeSpeed",desc:"speedDesc"},{key:"grip",icon:"✦",name:"upgradeGrip",desc:"gripDesc"}],costs=[10,18,28,40,54];
  function renderWorkshop(){if(!els.upgrades)return;els.shardCount.textContent=t("shards",{count:save.shards});els.upgrades.innerHTML="";upgradeDefs.forEach(def=>{const level=save.upgrades[def.key]||0;const button=document.createElement("button");button.type="button";button.className=`upgrade${level>=5?" maxed":""}`;button.dataset.upgrade=def.key;button.innerHTML=`<span class="upgrade-icon">${def.icon}</span><strong>${t(def.name)}</strong><small>${t(def.desc)}</small><span>${t("level",{level})}</span><b>${level>=5?t("maxed"):t("upgradeCost",{cost:costs[level]})}</b>`;button.disabled=level>=5;button.addEventListener("click",event=>buyUpgrade(def.key,event));els.upgrades.append(button)});els.diamondUnlock.textContent=save.championAura?t("owned"):t("diamondUnlock");els.diamondUnlock.disabled=save.championAura}
  function restoreWorkshopFocus(key){requestAnimationFrame(()=>{const buttons=[...els.upgrades.querySelectorAll("[data-upgrade]")],current=buttons.find(button=>button.dataset.upgrade===key),index=Math.max(0,buttons.indexOf(current)),target=current&&!current.disabled?current:buttons.slice(index+1).find(button=>!button.disabled)||buttons.find(button=>!button.disabled)||document.querySelector('.stage-tabs [data-tab="workshop"]');target?.focus({preventScroll:true})})}
  function buyUpgrade(key,event){const restoreFocus=document.activeElement?.dataset?.upgrade===key,level=save.upgrades[key]||0;if(level>=5)return;const cost=costs[level];if(save.shards<cost){els.workshopFeedback.textContent=t("noShards");playCue("wrong");return}save.shards-=cost;save.upgrades[key]=level+1;persist();els.workshopFeedback.textContent=t("purchased");playCue("upgrade");track("upgrade_purchase",{upgrade:key,from_level:level,to_level:level+1,cost,input_type:eventInputType(event)});renderWorkshop();renderProgress();if(restoreFocus)restoreWorkshopFocus(key)}
  els.diamondUnlock.addEventListener("click",()=>{if(save.championAura)return;const restoreFocus=document.activeElement===els.diamondUnlock,ok=window.WeightPlayWallet?.spendDiamonds?.(10);if(!ok){els.workshopFeedback.textContent=t("needDiamonds");return}save.championAura=true;persist();els.workshopFeedback.textContent=t("championUnlocked");renderWorkshop();if(restoreFocus)requestAnimationFrame(()=>document.querySelector('.stage-tabs [data-tab="workshop"]')?.focus({preventScroll:true}))});
  function setScreen(name,meta={}){cancelStageFocus();sceneGeneration++;clearTimeout(settleTimer);settleTimer=0;document.body.dataset.screen=name;els.loading.hidden=name!=="loading";els.mainGroup.hidden=name!=="main";els.stage.hidden=name!=="stage";els.battle.hidden=name!=="battle";if(name==="stage"){stageMapVisit++;cardViewSeen.clear();cardFocusSeen.clear();setTab("races");renderStages();renderProgress();track("race_map",{entry:meta.entry||"stage",race:currentStage+1})}if(name!=="battle")stopPointer();requestAnimationFrame(()=>{window.dispatchEvent(new Event("resize"));window.WeightPlayStageSelector?.refresh?.();window.WeightPlayBattleCanvas?.refresh?.()})}
  const colors=["#3df2ff","#ffc83d","#58f1c2","#b86cff"],lanes=[.29,.5,.71,.88];
  let run=null,lastFrame=0,raf=0,keys=new Set(),activePointerId=null,lifecyclePaused=false,windowFocused=document.hasFocus(),documentVisible=!document.hidden,pageCached=false,resultActionClaimed=false,resultFocusTimer=0;
  function syncArenaSize(){const rect=els.arena.getBoundingClientRect();const width=Math.max(1,Math.round(rect.width)),height=Math.max(1,Math.round(rect.height));if(els.arena.width!==width||els.arena.height!==height){els.arena.width=width;els.arena.height=height;draw()}}
  new ResizeObserver(syncArenaSize).observe(els.arena);
  function seeded(seed){let n=(seed+1)*2654435761>>>0;return()=>{n=(n*1664525+1013904223)>>>0;return n/4294967296}}
  function makePickup(rng,color,stage){const column=stage.route[Math.floor(rng()*stage.route.length)],spread=stage.layout==="islands"?.035:.075;return{color,x:Math.max(.08,Math.min(.92,column+(rng()-.5)*spread)),y:.57+rng()*.30,phase:rng()*Math.PI*2}}
  function createRun(index){const stage=stages[index],rng=seeded(index+107);const pickups=[];for(let c=0;c<4;c++)for(let i=0;i<9;i++)pickups.push(makePickup(rng,c,stage));const bombs=Array.from({length:stage.hazard==="bombs"?stage.bombCount:0},(_,i)=>({x:stage.route[(i+1)%stage.route.length],y:.63+(i%2)*.16,pulse:rng()*Math.PI*2,armed:true,fuse:0,explosion:0,cooldown:0,blastApplied:false}));const monsters=Array.from({length:stage.monsterCount},(_,i)=>({x:i%2?.84:.16,y:.65+i*.12,dir:i%2?-1:1}));const powerups=[{kind:stage.item,x:stage.route[stage.number%stage.route.length],y:.72,active:true}],beacons=[],checkpoints=[];return{stage,rng,elapsed:0,timeLeft:stage.time,ended:false,paused:false,spills:0,buildClock:0,collisionClock:0,feedbackClock:0,feedbackCue:"",firstPickup:false,firstBridge:false,shield:0,magnet:0,beacons,beaconsLit:0,checkpoints,checkpointIndex:0,activeLane:stage.number%4,projectiles:[],impactBursts:[],player:{x:.29,y:.83,targetX:.29,targetY:.83,stack:0,progress:0,laneProgress:[0,0,0,0],dash:0,dashTime:0,stun:0,lane:0,buildCredit:0,facing:1},rivals:[{x:.5,y:.78,targetX:.5,targetY:.78,stack:0,progress:0,color:1,lane:1,clock:0,buildCredit:0,facing:1},{x:.71,y:.81,targetX:.71,targetY:.81,stack:0,progress:0,color:2,lane:2,clock:0,buildCredit:0,facing:-1},{x:.88,y:.75,targetX:.88,targetY:.75,stack:0,progress:0,color:3,lane:3,clock:0,buildCredit:0,facing:-1}],pickups,bombs,monsters,powerups,boosts:[{x:.18,y:.62},{x:.82,y:.66}],position:4}}
  function startRace(index,opts={}){currentStage=Math.max(0,Math.min(29,index));lastInputType=normalizeInputType(opts.inputType||lastInputType);run=createRun(currentStage);lifecyclePaused=!(windowFocused&&documentVisible&&!pageCached);els.result.hidden=true;els.leave.hidden=true;els.tutorial.hidden=save.tutorial||opts.skipTutorial;els.battleLive.inert=false;els.battleLive.removeAttribute("aria-hidden");setScreen("battle");els.feedback.textContent="";els.feedback.dataset.cue="";updateHud();track("race_start",{race:currentStage+1,entry:opts.entry||"stage_card",unlocked_races:save.unlocked});playCue("start");lastFrame=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(frame)}
  let currentStage=0;
  function frame(now){const dt=Math.min(.034,Math.max(0,(now-lastFrame)/1000||0));lastFrame=now;if(run&&!run.ended&&!run.paused&&!lifecyclePaused&&els.tutorial.hidden&&els.leave.hidden&&els.result.hidden)simulate(dt);draw();raf=requestAnimationFrame(frame)}
  function moveToward(actor,tx,ty,speed,dt){const dx=tx-actor.x,dy=ty-actor.y,d=Math.hypot(dx,dy);if(Math.abs(dx)>.002)actor.facing=dx<0?-1:1;if(d<.001)return;if(d<=speed*dt){actor.x=tx;actor.y=ty}else{actor.x+=dx/d*speed*dt;actor.y+=dy/d*speed*dt}}
  function nearestPickup(color,x,y){let best=null,dist=Infinity;for(const p of run.pickups){if(p.color!==color)continue;const d=(p.x-x)**2+(p.y-y)**2;if(d<dist){dist=d;best=p}}return best}
  function respawnPickup(p){const n=makePickup(run.rng,p.color,run.stage);p.x=n.x;p.y=n.y;p.phase=n.phase}
  function collect(actor,color,capacity,isPlayer=false){for(const p of run.pickups){if(p.color!==color||actor.stack>=capacity)continue;if(Math.hypot(p.x-actor.x,p.y-actor.y)<.042){actor.stack++;respawnPickup(p);if(isPlayer){run.player.dash=Math.min(100,run.player.dash+13);const first=!run.firstPickup;run.firstPickup=true;say(t("tileCollected"),first?1.05:.6,first?"pickup-first":"pickup");playCue("coin",80)}}}}
  function build(actor,lane,dt,isPlayer=false){
    if(actor.stack<=0)return;
    actor.clock=(actor.clock||0)+dt;
    const interval=isPlayer?.08:Math.max(.16,.28-run.stage.index*.002);
    if(actor.clock<interval)return;
    actor.clock=0;
    actor.stack--;
    actor.buildCredit=0;
    if(isPlayer)actor.laneProgress[lane]++;
    actor.progress++;
    actor.lane=lane;
    const color=isPlayer?0:actor.color;
    run.projectiles.push({x:lanes[lane],y:.44,targetX:lanes[lane],targetY:.095,color,life:.46,maxLife:.46,damage:1});
    if(isPlayer){
      const first=!run.firstBridge;run.firstBridge=true;say(t("building",{lane:lane+1}),first?1.05:.4,first?"bridge-first":"bridge");playCue("success",140);
    }
    if(actor.progress>=run.stage.goal){if(isPlayer)finish(true);else finish(false)}
  }
  function playerInput(dt){if(run.player.stun>0){run.player.stun=Math.max(0,run.player.stun-dt);run.player.targetX=run.player.x;run.player.targetY=run.player.y;return}let dx=0,dy=0;if(keys.has("ArrowLeft")||keys.has("a"))dx--;if(keys.has("ArrowRight")||keys.has("d"))dx++;if(keys.has("ArrowUp")||keys.has("w"))dy--;if(keys.has("ArrowDown")||keys.has("s"))dy++;if(dx||dy){const d=Math.hypot(dx,dy);run.player.targetX=run.player.x+dx/d*.08;run.player.targetY=run.player.y+dy/d*.08}const speed=(.245+save.upgrades.speed*.016)*(run.player.dashTime>0?1.75:1);moveToward(run.player,run.player.targetX,run.player.targetY,speed,dt);run.player.x=Math.max(.07,Math.min(.93,run.player.x));run.player.y=Math.max(.475,Math.min(.9,run.player.y));if(run.stage.wind){const grip=1-save.upgrades.grip*.12;run.player.x+=Math.sin(run.elapsed*2.2)*.021*grip*dt}if(run.magnet>0){run.magnet-=dt;for(const p of run.pickups)if(p.color===0&&Math.hypot(p.x-run.player.x,p.y-run.player.y)<.19)moveToward(p,run.player.x,run.player.y,.38,dt)}collect(run.player,0,6+save.upgrades.capacity*2,true);for(const item of run.powerups)if(item.active&&Math.hypot(run.player.x-item.x,run.player.y-item.y)<.055){item.active=false;if(item.kind==="shield")run.shield=7;else if(item.kind==="magnet")run.magnet=7;else{run.player.dash=100;run.player.dashTime=2.1}}run.shield=Math.max(0,run.shield-dt);const near=lanes.map(x=>Math.abs(run.player.x-x));const lane=near.indexOf(Math.min(...near)),insideDock=run.player.y<.635&&near[lane]<.145;run.player.depositLane=insideDock?lane:-1;if(insideDock)build(run.player,lane,dt,true);else run.player.clock=0;if(run.stage.moving){for(const b of run.boosts)if(Math.hypot(run.player.x-b.x,run.player.y-b.y)<.055){run.player.dash=Math.min(100,run.player.dash+35);b.y=.72+run.rng()*.12}}if(run.player.dashTime>0)run.player.dashTime-=dt}
  function aiStep(ai,idx,dt){const capacity=run.stage.carry+Math.floor(run.stage.index/10);const dockX=lanes[ai.lane];if(ai.stack>=Math.min(capacity,4+run.stage.chapter)||(!nearestPickup(ai.color,ai.x,ai.y)&&ai.stack>0)){ai.targetX=dockX;ai.targetY=.505}else{const p=nearestPickup(ai.color,ai.x,ai.y);if(p){ai.targetX=p.x;ai.targetY=p.y}}const speed=run.stage.aiSpeed+(run.stage.champion&&idx===2?.028:0);moveToward(ai,ai.targetX,ai.targetY,speed,dt);ai.x=Math.max(.07,Math.min(.93,ai.x));ai.y=Math.max(.49,Math.min(.9,ai.y));collect(ai,ai.color,capacity);if(ai.y<.575&&Math.abs(ai.x-dockX)<.10)build(ai,ai.lane,dt,false)}
  function collisions(){if(run.stage.chapter<1)return;if(run.collisionClock>0)return;for(const ai of run.rivals){if(Math.hypot(ai.x-run.player.x,ai.y-run.player.y)<.06){run.collisionClock=.65;const grip=Math.floor(save.upgrades.grip/2);if(run.player.stack<=ai.stack){const loss=Math.min(run.player.stack,Math.max(1,2-grip));run.player.stack-=loss;if(loss){run.spills+=loss;say(t("spilled"),.8)}}else ai.stack=Math.max(0,ai.stack-2);break}}}
  function updateBombs(dt){for(const bomb of run.bombs){if(bomb.cooldown>0){bomb.cooldown=Math.max(0,bomb.cooldown-dt);if(bomb.cooldown===0){bomb.armed=true;bomb.blastApplied=false}}if(bomb.fuse>0){bomb.fuse-=dt;if(bomb.fuse<=0){bomb.explosion=.7;bomb.cooldown=4;bomb.blastApplied=false}}if(bomb.explosion>0){bomb.explosion=Math.max(0,bomb.explosion-dt);if(!bomb.blastApplied){bomb.blastApplied=true;for(const actor of [run.player,...run.rivals]){if(Math.hypot(actor.x-bomb.x,actor.y-bomb.y)>.15)continue;const loss=Math.min(actor.stack,3);actor.stack-=loss;if(actor===run.player){run.spills+=loss;run.player.stun=2.2;run.player.targetX=run.player.x;run.player.targetY=run.player.y;say(t("bombStunned"),2.2)}else actor.stun=1.5}}}}}
  function hitHazards(dt){for(const monster of run.monsters){monster.x+=monster.dir*(.10+run.stage.chapter*.008)*dt;if(monster.x<.10||monster.x>.90)monster.dir*=-1}for(const bomb of run.bombs)if(bomb.armed&&bomb.fuse<=0&&bomb.explosion<=0&&Math.hypot(bomb.x-run.player.x,bomb.y-run.player.y)<.055){bomb.armed=false;bomb.fuse=.34;say(t("bombFuse"),.5)}if(run.collisionClock>0||run.shield>0)return;const monsterHit=run.monsters.some(m=>Math.hypot(m.x-run.player.x,m.y-run.player.y)<.06);if(!monsterHit)return;run.collisionClock=.85;const loss=Math.min(run.player.stack,2);run.player.stack-=loss;run.spills+=loss;run.player.targetY=run.player.y=Math.min(.9,run.player.y+.08);say(t("monsterHit"),.7)}
  function updateProjectiles(dt){
    for(const projectile of run.projectiles){
      projectile.life-=dt;
      const progress=1-Math.max(0,projectile.life)/projectile.maxLife,ease=1-(1-progress)**3;
      projectile.drawX=projectile.x+(projectile.targetX-projectile.x)*ease;
      projectile.drawY=projectile.y+(projectile.targetY-projectile.y)*ease-Math.sin(progress*Math.PI)*.13;
      if(projectile.life<=0&&!projectile.impacted){projectile.impacted=true;run.impactBursts.push({x:projectile.targetX,y:projectile.targetY,color:projectile.color,life:.34})}
    }
    run.projectiles=run.projectiles.filter(projectile=>projectile.life>-.05);
    for(const burst of run.impactBursts)burst.life-=dt;
    run.impactBursts=run.impactBursts.filter(burst=>burst.life>0);
  }
  function simulate(dt){run.elapsed+=dt;run.timeLeft=Math.max(0,run.stage.time-run.elapsed);run.collisionClock=Math.max(0,run.collisionClock-dt);run.feedbackClock=Math.max(0,run.feedbackClock-dt);if(run.feedbackClock===0){els.feedback.textContent=run.stage.wind?t("gust"):"";els.feedback.dataset.cue=""}if(run.stage.moving)for(const p of run.pickups){p.x+=Math.sin(run.elapsed*1.5+p.phase)*.014*dt;p.x=Math.max(.08,Math.min(.92,p.x))}updateBombs(dt);updateProjectiles(dt);playerInput(dt);hitHazards(dt);run.rivals.forEach((ai,i)=>{if(ai.stun>0)ai.stun=Math.max(0,ai.stun-dt);else aiStep(ai,i,dt)});collisions();const ordered=[{p:run.player.progress,id:"player"},...run.rivals.map((r,i)=>({p:r.progress,id:i}))].sort((a,b)=>b.p-a.p);run.position=ordered.findIndex(x=>x.id==="player")+1;if(run.timeLeft<=0)finish(false);updateHud()}
  function say(message,duration=1,cue=""){els.feedback.textContent=message;els.feedback.dataset.cue=cue;if(run){run.feedbackClock=duration;run.feedbackCue=cue}}
  function useDash(){if(!run||run.ended||run.player.dash<100)return;run.player.dash=0;run.player.dashTime=2.1;say(t("dashUsed"),1);playCue("shoot")}
  function updateHud(){if(!run)return;els.raceLabel.textContent=stageName(run.stage);els.racePosition.textContent=`${run.position} / 4`;els.stackValue.textContent=`${run.player.stack}/${6+save.upgrades.capacity*2}`;els.timeValue.textContent=Math.ceil(run.timeLeft);els.bridgeValue.textContent=`${run.stage.mode==="assault"?"⚔ ":""}${Math.min(100,Math.round(run.player.progress/run.stage.goal*100))}%`;els.objective.textContent=t(run.stage.mode==="assault"?"assaultObjective":"objective");els.dashValue.textContent=`${Math.round(run.player.dash)}%`;els.dash.classList.toggle("ready",run.player.dash>=100)}
  function drawCover(image,w,h){if(!image.complete||!image.naturalWidth){ctx.fillStyle="#0c4166";ctx.fillRect(0,0,w,h);return}const scale=Math.max(w/image.naturalWidth,h/image.naturalHeight),sw=w/scale,sh=h/scale,sx=(image.naturalWidth-sw)/2,sy=(image.naturalHeight-sh)/2;ctx.drawImage(image,sx,sy,sw,sh,0,0,w,h)}
  function drawSprite(cell,x,y,size,aura=false,facing=1){if(!sprites.complete||!sprites.naturalWidth)return;const half=sprites.naturalWidth/2,sx=(cell%2)*half,sy=Math.floor(cell/2)*half;ctx.save();ctx.translate(x,y);ctx.scale(facing<0?-1:1,1);if(aura){ctx.shadowBlur=24;ctx.shadowColor="#ffd95b";ctx.globalAlpha=.9;ctx.drawImage(sprites,sx,sy,half,half,-size/2,-size/2,size,size);ctx.globalAlpha=1}ctx.drawImage(sprites,sx,sy,half,half,-size/2,-size/2,size,size);ctx.restore()}
  function drawStack(actor,color,w,h){const n=Math.min(actor.stack,7);for(let i=0;i<n;i++){ctx.fillStyle=colors[color];ctx.shadowBlur=8;ctx.shadowColor=colors[color];ctx.fillRect(actor.x*w-12,actor.y*h-30-i*5,24,5)}ctx.shadowBlur=0}
  function drawBridgeLane(lane,built,count,color,w,h){const x=lanes[lane]*w,y0=.45*h,y1=.12*h;for(let i=0;i<Math.min(count,built);i++){const p=i/(count-1||1),y=y0+(y1-y0)*p;ctx.fillStyle=colors[color];ctx.shadowBlur=11;ctx.shadowColor=colors[color];ctx.fillRect(x-18,y-5,36,10)}ctx.shadowBlur=0}
  function drawBridge(actor,color,w,h){drawBridgeLane(actor.lane,actor.progress,run.stage.goal,color,w,h)}
  function drawModeObjects(w,h){lanes.forEach((x,lane)=>{const active=run.player.depositLane===lane&&run.player.stack>0,pulse=active?3+Math.sin(run.elapsed*10)*2:0;ctx.save();ctx.fillStyle=`${colors[lane]}55`;ctx.strokeStyle=active?"#fff176":colors[lane];ctx.lineWidth=active?5:3;ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=active?24:9;ctx.beginPath();ctx.arc(x*w,.515*h,29+pulse,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle="#fff";ctx.font="900 14px system-ui";ctx.textAlign="center";ctx.fillText(`↓ ${lane+1}`,x*w,.52*h);if(active){const progress=Math.min(1,(run.player.clock||0)/.08);ctx.strokeStyle="#fff176";ctx.lineWidth=6;ctx.beginPath();ctx.arc(x*w,.515*h,37,-Math.PI/2,-Math.PI/2+Math.PI*2*progress);ctx.stroke()}ctx.restore()})}
  function drawAssault(w,h){
    if(run.stage.mode!=="assault"&&run.projectiles.length===0&&run.impactBursts.length===0)return;
    ctx.save();
    if(run.stage.mode==="assault"){
      const hp=Math.max(0,run.stage.goal-run.player.progress),ratio=hp/run.stage.goal;
      ctx.fillStyle="rgba(7,13,35,.78)";ctx.strokeStyle="#ff8f75";ctx.lineWidth=3;ctx.shadowColor="#ff5b45";ctx.shadowBlur=18;
      ctx.beginPath();ctx.roundRect(.35*w,.045*h,.30*w,.10*h,12);ctx.fill();ctx.stroke();
      ctx.shadowBlur=0;ctx.fillStyle="#36111a";ctx.fillRect(.39*w,.118*h,.22*w,7);ctx.fillStyle="#ff6b59";ctx.fillRect(.39*w,.118*h,.22*w*ratio,7);
      ctx.fillStyle="#fff";ctx.font=`900 ${Math.max(12,Math.round(w*.035))}px system-ui`;ctx.textAlign="center";ctx.fillText(`⚔ ${hp}`,w*.5,h*.102);
    }
    for(const projectile of run.projectiles){const x=(projectile.drawX??projectile.x)*w,y=(projectile.drawY??projectile.y)*h;ctx.fillStyle=colors[projectile.color];ctx.shadowColor=colors[projectile.color];ctx.shadowBlur=18;ctx.translate(x,y);ctx.rotate(run.elapsed*8+projectile.color);ctx.fillRect(-8,-8,16,16);ctx.setTransform(1,0,0,1,0,0)}
    for(const burst of run.impactBursts){const progress=1-burst.life/.34,x=burst.x*w,y=burst.y*h,r=(10+progress*38)*Math.min(w,h)/390;ctx.globalAlpha=Math.max(0,burst.life/.34);ctx.strokeStyle=colors[burst.color];ctx.lineWidth=5;ctx.shadowColor=colors[burst.color];ctx.shadowBlur=24;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke()}
    ctx.restore();
  }
  function drawBombIcon(x,y,size){
    ctx.save();ctx.translate(x,y);ctx.scale(size/30,size/30);
    ctx.shadowColor="#ff4c39";ctx.shadowBlur=18;
    ctx.fillStyle="#18213c";ctx.strokeStyle="#ffe285";ctx.lineWidth=2.4;
    ctx.beginPath();ctx.arc(0,3,11,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.shadowBlur=0;ctx.fillStyle="#5d6c91";ctx.beginPath();ctx.arc(-4,-1,3.3,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#ffb84f";ctx.lineWidth=3;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(5,-7);ctx.quadraticCurveTo(9,-14,14,-10);ctx.stroke();
    ctx.fillStyle="#fff176";ctx.strokeStyle="#ff6b45";ctx.lineWidth=1.4;
    ctx.beginPath();for(let i=0;i<8;i++){const angle=-Math.PI/2+i*Math.PI/4,r=i%2?2.8:6;const px=14+Math.cos(angle)*r,py=-10+Math.sin(angle)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.closePath();ctx.fill();ctx.stroke();
    ctx.restore();
  }
  function drawMonsterIcon(x,y,size){
    ctx.save();ctx.translate(x,y);ctx.scale(size/30,size/30);
    ctx.shadowColor="#c36cff";ctx.shadowBlur=16;
    ctx.fillStyle="#552a87";ctx.strokeStyle="#f2c8ff";ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(-10,8);ctx.quadraticCurveTo(-13,-2,-7,-8);ctx.lineTo(-10,-14);ctx.lineTo(-2,-10);ctx.quadraticCurveTo(0,-12,2,-10);ctx.lineTo(10,-14);ctx.lineTo(7,-8);ctx.quadraticCurveTo(13,-2,10,8);ctx.quadraticCurveTo(5,13,0,10);ctx.quadraticCurveTo(-5,13,-10,8);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.shadowBlur=0;ctx.fillStyle="#8ffcff";
    ctx.beginPath();ctx.ellipse(-4,-1,2.3,3,0,0,Math.PI*2);ctx.ellipse(4,-1,2.3,3,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#f2c8ff";ctx.lineWidth=2.2;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(-7,9);ctx.lineTo(-9,14);ctx.moveTo(0,10);ctx.lineTo(0,15);ctx.moveTo(7,9);ctx.lineTo(9,14);ctx.stroke();
    ctx.restore();
  }
  function drawBombs(w,h){for(const bomb of run.bombs){if(bomb.cooldown>0&&bomb.explosion<=0)continue;const x=bomb.x*w,y=bomb.y*h;if(bomb.explosion>0){const progress=1-bomb.explosion/.7,radius=(24+progress*90)*Math.min(w,h)/390;ctx.save();ctx.globalAlpha=Math.max(0,bomb.explosion/.7);ctx.fillStyle="rgba(255,103,42,.28)";ctx.strokeStyle="#fff176";ctx.lineWidth=6;ctx.shadowColor="#ff5b22";ctx.shadowBlur=28;ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();ctx.stroke();for(let i=0;i<12;i++){const angle=i*Math.PI/6+progress;ctx.beginPath();ctx.moveTo(x+Math.cos(angle)*radius*.45,y+Math.sin(angle)*radius*.45);ctx.lineTo(x+Math.cos(angle)*radius*1.15,y+Math.sin(angle)*radius*1.15);ctx.stroke()}ctx.restore();continue}const pulse=1+Math.sin(run.elapsed*5+bomb.pulse)*.08;ctx.save();if(bomb.fuse>0){ctx.shadowColor="#ff3d2e";ctx.shadowBlur=24;ctx.globalAlpha=.55+.45*Math.sin(run.elapsed*35)**2}drawBombIcon(x,y,28*pulse);ctx.restore()}}
  function drawCourseGeometry(w,h){
    const path=(points,color,width=22)=>{ctx.save();ctx.strokeStyle=color;ctx.lineWidth=Math.max(12,w*width/390);ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();points.forEach(([x,y],index)=>index?ctx.lineTo(x*w,y*h):ctx.moveTo(x*w,y*h));ctx.stroke();ctx.restore()};
    if(run.stage.layout==="meadow")path([[.12,.72],[.30,.58],[.50,.72],[.70,.58],[.88,.72]],"rgba(121,255,205,.13)",28);
    else if(run.stage.layout==="split"){path([[.10,.60],[.32,.72],[.43,.88]],"rgba(209,132,255,.16)",34);path([[.90,.60],[.68,.72],[.57,.88]],"rgba(209,132,255,.16)",34)}
    else if(run.stage.layout==="islands"){ctx.save();ctx.fillStyle="rgba(83,255,225,.13)";for(const [x,y,r] of [[.2,.63,.11],[.5,.79,.13],[.8,.64,.11]]){ctx.beginPath();ctx.arc(x*w,y*h,r*Math.min(w,h),0,Math.PI*2);ctx.fill()}ctx.restore()}
    else if(run.stage.layout==="cross"){path([[.10,.86],[.50,.60],[.90,.86]],"rgba(255,198,82,.15)",25);path([[.10,.60],[.50,.86],[.90,.60]],"rgba(255,198,82,.15)",25)}
    else if(run.stage.layout==="fortress"){ctx.save();ctx.fillStyle="rgba(255,103,77,.13)";ctx.strokeStyle="rgba(255,218,116,.28)";ctx.lineWidth=Math.max(4,w*.012);ctx.beginPath();ctx.moveTo(.28*w,.88*h);ctx.lineTo(.18*w,.65*h);ctx.lineTo(.30*w,.54*h);ctx.lineTo(.40*w,.68*h);ctx.lineTo(.50*w,.50*h);ctx.lineTo(.60*w,.68*h);ctx.lineTo(.70*w,.54*h);ctx.lineTo(.82*w,.65*h);ctx.lineTo(.72*w,.88*h);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()}
    else{ctx.save();ctx.strokeStyle="rgba(124,163,255,.17)";ctx.lineWidth=Math.max(18,w*.065);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(.12*w,.86*h);ctx.bezierCurveTo(.88*w,.86*h,.12*w,.58*h,.88*w,.58*h);ctx.stroke();ctx.restore()}
  }
  function drawGuidance(w,h){const hasCargo=run.player.stack>0;let target;if(hasCargo){const lane=lanes.reduce((best,x,index)=>Math.abs(x-run.player.x)<Math.abs(lanes[best]-run.player.x)?index:best,0);target={x:lanes[lane],y:.505}}else target=nearestPickup(0,run.player.x,run.player.y);if(!target)return;const x=target.x*w,y=target.y*h,pulse=3+Math.sin(run.elapsed*6)*2;ctx.save();ctx.strokeStyle=hasCargo?"#ffe176":"#f5ffff";ctx.lineWidth=3;ctx.shadowBlur=18;ctx.shadowColor=hasCargo?"#ffd85a":"#3df2ff";ctx.beginPath();ctx.arc(x,y,22+pulse,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=.82;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-8,y-31-pulse);ctx.lineTo(x,y-23-pulse);ctx.lineTo(x+8,y-31-pulse);ctx.stroke();ctx.restore()}
  function drawPowerupIcon(kind,x,y,size=34){
    ctx.save();ctx.translate(x,y);ctx.scale(size/34,size/34);
    ctx.shadowColor="#67f4ff";ctx.shadowBlur=18;
    ctx.fillStyle="rgba(7,35,70,.88)";ctx.strokeStyle="#e9ffff";ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(0,0,16,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.shadowBlur=8;ctx.lineCap="round";ctx.lineJoin="round";
    if(kind==="shield"){
      ctx.fillStyle="#5ce7ff";ctx.strokeStyle="#fff7ae";ctx.lineWidth=2.5;
      ctx.beginPath();ctx.moveTo(0,-11);ctx.lineTo(9,-7);ctx.lineTo(8,2);
      ctx.quadraticCurveTo(6,9,0,12);ctx.quadraticCurveTo(-6,9,-8,2);
      ctx.lineTo(-9,-7);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle="#ffffff";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-7);ctx.lineTo(0,7);ctx.stroke();
    }else if(kind==="magnet"){
      ctx.strokeStyle="#ff617a";ctx.lineWidth=6;
      ctx.beginPath();ctx.arc(0,0,9,.12*Math.PI,.88*Math.PI,true);ctx.stroke();
      ctx.strokeStyle="#e9ffff";ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(-9,-3);ctx.lineTo(-9,-10);ctx.moveTo(9,-3);ctx.lineTo(9,-10);ctx.stroke();
    }else if(kind==="dash"){
      ctx.fillStyle="#ffe05d";ctx.strokeStyle="#ffffff";ctx.lineWidth=1.7;
      ctx.beginPath();ctx.moveTo(3,-13);ctx.lineTo(-8,2);ctx.lineTo(-1,2);
      ctx.lineTo(-4,13);ctx.lineTo(10,-3);ctx.lineTo(3,-3);ctx.closePath();ctx.fill();ctx.stroke();
    }
    ctx.restore();
  }
  function draw(){
    const w=els.arena.width,h=els.arena.height;
    ctx.clearRect(0,0,w,h);drawCover(bg,w,h);
    const tint={meadow:"rgba(3,24,46,.14)",split:"rgba(55,19,82,.22)",islands:"rgba(0,82,86,.20)",cross:"rgba(85,46,8,.18)",slalom:"rgba(15,32,92,.24)",fortress:"rgba(91,19,20,.28)"}[run?.stage.layout]||"rgba(3,24,46,.14)";
    ctx.fillStyle=tint;ctx.fillRect(0,0,w,h);if(!run)return;
    drawCourseGeometry(w,h);
    ctx.save();ctx.strokeStyle="rgba(230,252,255,.16)";ctx.lineWidth=Math.max(18,w*.055);ctx.setLineDash([12,14]);
    for(const x of run.stage.route){ctx.beginPath();ctx.moveTo(x*w,.55*h);ctx.lineTo(x*w,.91*h);ctx.stroke()}ctx.restore();
    run.rivals.forEach((r,i)=>drawBridge(r,i+1,w,h));drawBridge(run.player,0,w,h);drawAssault(w,h);
    for(const p of run.pickups){const x=p.x*w,y=p.y*h;ctx.save();ctx.shadowBlur=16;ctx.shadowColor=colors[p.color];ctx.fillStyle=colors[p.color];ctx.translate(x,y);ctx.rotate(Math.PI/4);ctx.fillRect(-8,-8,16,16);ctx.restore()}
    drawModeObjects(w,h);drawBombs(w,h);
    for(const m of run.monsters)drawMonsterIcon(m.x*w,m.y*h,30);
    for(const item of run.powerups)if(item.active)drawPowerupIcon(item.kind,item.x*w,item.y*h);
    if(run.stage.moving)for(const b of run.boosts){ctx.strokeStyle="#fff176";ctx.lineWidth=5;ctx.beginPath();ctx.arc(b.x*w,b.y*h,19,0,Math.PI*2);ctx.stroke()}
    drawGuidance(w,h);
    const actorSize=Math.max(52,Math.min(82,Math.min(w,h)*.17));
    run.rivals.forEach((r,i)=>{drawStack(r,i+1,w,h);drawSprite(i+1,r.x*w,r.y*h,actorSize*.92,false,r.facing)});
    drawStack(run.player,0,w,h);drawSprite(0,run.player.x*w,run.player.y*h,actorSize,save.championAura&&run.player.dashTime>0,run.player.facing);
    if(run.player.stun>0){ctx.save();ctx.translate(run.player.x*w,run.player.y*h-43);ctx.rotate(run.elapsed*2.8);ctx.fillStyle="#ffe56f";ctx.shadowColor="#ffb52e";ctx.shadowBlur=12;ctx.font="900 20px system-ui";ctx.textAlign="center";for(let i=0;i<3;i++){const angle=i*Math.PI*2/3;ctx.fillText("★",Math.cos(angle)*27,Math.sin(angle)*11)}ctx.restore()}
    if(run.shield>0){ctx.strokeStyle="#72f7ff";ctx.lineWidth=4;ctx.beginPath();ctx.arc(run.player.x*w,run.player.y*h,48,0,Math.PI*2);ctx.stroke()}
    ctx.fillStyle="#fff";ctx.font="700 18px system-ui";ctx.textAlign="center";ctx.fillText(`${Math.round(run.player.progress/run.stage.goal*100)}%`,run.player.x*w,run.player.y*h+50);
  }
  function finish(won){if(!run||run.ended)return;run.ended=true;resultActionClaimed=false;playCue(won?"win":"wrong");const time=Math.ceil(run.timeLeft),stars=won?1+(time>=Math.ceil(run.stage.time*.42)?1:0)+(run.spills===0?1:0):0;if(won){save.stars[currentStage]=Math.max(save.stars[currentStage]||0,stars);save.best[currentStage]=Math.max(save.best[currentStage]||0,time);save.unlocked=Math.max(save.unlocked,Math.min(30,currentStage+2));save.shards+=4+stars*3;persist()}els.resultKicker.textContent=stageName(run.stage);els.resultTitle.textContent=t(won?"raceWon":"raceLost");els.resultText.textContent=t(won?"winText":"loseText");els.resultPurpose.hidden=!won;els.resultPurpose.textContent=won?t(currentStage<29?"resultPurposeNext":"resultPurposeFinal",{number:currentStage+2}):"";els.resultStats.innerHTML=`<span><b>${t("place")}</b><strong>${won?1:run.position}/4</strong></span><span><b>${t("spills")}</b><strong>${run.spills}</strong></span><span><b>${t("stars")}</b><strong>${"★".repeat(stars)}${"☆".repeat(3-stars)}</strong></span>`;const hasNext=won&&currentStage<29;const primary=hasNext?els.nextRace:won?els.resultStage:els.retry;els.resultStage.disabled=false;els.retry.disabled=false;els.nextRace.hidden=false;els.nextRace.disabled=!hasNext;[els.retry,els.resultStage,els.nextRace].forEach(action=>action.classList.toggle("primary",action===primary));els.result.hidden=false;els.battleLive.inert=true;els.battleLive.setAttribute("aria-hidden","true");renderProgress();track(won?"race_result_win":"race_result_loss",{race:currentStage+1,place:won?1:run.position,spills:run.spills,stars});if(won)track("result_purpose_view",{race:currentStage+1,unlocks_race:Math.min(30,currentStage+2)});clearTimeout(resultFocusTimer);resultFocusTimer=setTimeout(()=>{resultFocusTimer=0;if(document.body.dataset.screen==="battle"&&!els.result.hidden&&!primary.disabled)primary.focus()},0)}
  function claimResultAction(){if(els.result.hidden||resultActionClaimed)return false;clearTimeout(resultFocusTimer);resultFocusTimer=0;resultActionClaimed=true;[els.retry,els.resultStage,els.nextRace].forEach(action=>action.disabled=true);return true}
  function pointerPos(ev){const r=els.arena.getBoundingClientRect();return{x:(ev.clientX-r.left)/r.width,y:(ev.clientY-r.top)/r.height}}
  function setTarget(ev){if(!run||run.ended)return;const p=pointerPos(ev);run.player.targetX=Math.max(.07,Math.min(.93,p.x));run.player.targetY=Math.max(.485,Math.min(.9,p.y))}
  function releasePointer(pointerId,{cancelled=false}={}){if(activePointerId!==pointerId)return;if(cancelled&&run&&!run.ended){run.player.targetX=run.player.x;run.player.targetY=run.player.y}activePointerId=null;try{els.arena.releasePointerCapture(pointerId)}catch{}}
  els.arena.addEventListener("pointerdown",ev=>{if(activePointerId!==null||!ev.isPrimary)return;els.arena.focus({preventScroll:true});activePointerId=ev.pointerId;els.arena.setPointerCapture(ev.pointerId);setTarget(ev)});els.arena.addEventListener("pointermove",ev=>{if(activePointerId===ev.pointerId)setTarget(ev)});els.arena.addEventListener("pointerup",ev=>releasePointer(ev.pointerId));els.arena.addEventListener("pointercancel",ev=>releasePointer(ev.pointerId,{cancelled:true}));
  function stopPointer(){if(activePointerId!==null)releasePointer(activePointerId,{cancelled:true});keys.clear()}
  function suspendLifecycle(){stopPointer();if(run&&!run.ended&&document.body.dataset.screen==="battle"){run.player.targetX=run.player.x;run.player.targetY=run.player.y;lifecyclePaused=true}}
  function reconcileLifecycle(){if(windowFocused&&documentVisible&&!pageCached){lifecyclePaused=false;lastFrame=performance.now()}else suspendLifecycle()}
  function reclaimVisibleForeground(event){const internalStageActivation=event?.target?.closest?.("[data-wp-stage-source-store]")&&document.body.dataset.screen==="stage";if((!event?.isTrusted&&!internalStageActivation)||document.hidden||pageCached)return false;if(windowFocused)return true;windowFocused=true;reconcileLifecycle();return true}
  window.addEventListener("keydown",ev=>{if(document.body.dataset.screen!=="battle")return;const key=ev.key.length===1?ev.key.toLowerCase():ev.key;if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","w","a","s","d"].includes(key)){keys.add(key);ev.preventDefault()}if((ev.code==="Space"||ev.key==="Enter")&&document.activeElement===els.dash){useDash();ev.preventDefault()}});window.addEventListener("keyup",ev=>keys.delete(ev.key.length===1?ev.key.toLowerCase():ev.key));
  window.addEventListener("blur",()=>{windowFocused=false;reconcileLifecycle()});window.addEventListener("focus",()=>{windowFocused=true;reconcileLifecycle()});document.addEventListener("visibilitychange",()=>{documentVisible=!document.hidden;reconcileLifecycle()});window.addEventListener("pagehide",()=>{pageCached=true;reconcileLifecycle()});window.addEventListener("pageshow",()=>{pageCached=false;reconcileLifecycle()});
  els.battle.addEventListener("pointerdown",reclaimVisibleForeground,true);els.battle.addEventListener("keydown",reclaimVisibleForeground,true);
  els.soundToggle.addEventListener("click",()=>{window.WonderSound?.unlock?.();window.WonderSound?.setMuted?.(!window.WonderSound.isMuted());updateSoundToggle();if(!window.WonderSound?.isMuted?.())playCue("click")});els.dash.addEventListener("click",useDash);els.start.addEventListener("click",event=>{lastInputType=eventInputType(event);setScreen("stage",{entry:"main_start"})});els.stageBack.addEventListener("click",event=>{track("main_return",{from:"race_map",input_type:eventInputType(event)});setScreen("main")});els.battleBack.addEventListener("click",()=>{if(!run||run.ended){setScreen("stage",{entry:"battle_back"});return}run.paused=true;els.leave.hidden=false;els.battleLive.inert=true;els.continueBattle.focus()});els.continueBattle.addEventListener("click",()=>{els.leave.hidden=true;run.paused=false;els.battleLive.inert=false;els.battleBack.focus()});els.leaveStage.addEventListener("click",()=>{els.leave.hidden=true;if(run)run.ended=true;els.battleLive.inert=false;els.battleLive.removeAttribute("aria-hidden");setScreen("stage",{entry:"battle_leave"});centerStage(currentStage,false)});els.battleHelp.addEventListener("click",()=>{run.paused=true;els.tutorial.hidden=false;els.battleLive.inert=true;els.tutorialDone.focus()});els.tutorialDone.addEventListener("click",()=>{save.tutorial=true;persist();els.tutorial.hidden=true;run.paused=false;els.battleLive.inert=false;lastFrame=performance.now();els.arena.focus?.()});els.retry.addEventListener("click",event=>{if(!claimResultAction())return;track("retry",{from:"result",race:currentStage+1,input_type:eventInputType(event)});startRace(currentStage,{skipTutorial:true,inputType:eventInputType(event),entry:"retry"})});els.resultStage.addEventListener("click",event=>{if(!claimResultAction())return;lastInputType=eventInputType(event);els.result.hidden=true;els.battleLive.inert=false;els.battleLive.removeAttribute("aria-hidden");const target=Math.min(save.unlocked-1,29);setScreen("stage",{entry:"result_map"});focusStageCardAfterSettlement(target)});els.nextRace.addEventListener("click",event=>{if(!claimResultAction())return;track("next_race",{from:"result",from_race:currentStage+1,to_race:Math.min(30,currentStage+2),input_type:eventInputType(event)});startRace(Math.min(29,currentStage+1),{skipTutorial:true,inputType:eventInputType(event),entry:"next_race"})});
  els.locale.addEventListener("change",()=>{locale=els.locale.value;safeStore.set(LOCALE_STORAGE,locale);if(window.WonderI18n?.setLocale){window.WonderI18n.setLocale(locale);return}setText()});
  window.addEventListener("resize",syncArenaSize);
  window.__animalSkybridgeRivalsSmoke={
    stages,startRace:(i=0)=>startRace(i,{skipTutorial:true}),snapshot:()=>run?JSON.parse(JSON.stringify({stage:run.stage.index,course:{layout:run.stage.layout,mode:run.stage.mode,hazard:run.stage.hazard,item:run.stage.item,bombs:run.bombs.length,monsters:run.monsters.length},player:run.player,rivals:run.rivals.map(r=>({stack:r.stack,progress:r.progress,stun:r.stun||0,buildCredit:r.buildCredit||0})),pickups:run.pickups.filter(p=>p.color===0).sort((a,b)=>(a.x-run.player.x)**2+(a.y-run.player.y)**2-((b.x-run.player.x)**2+(b.y-run.player.y)**2)).slice(0,4),bombs:run.bombs,beacons:run.beacons,beaconsLit:run.beaconsLit,checkpoints:run.checkpoints,checkpointIndex:run.checkpointIndex,activeLane:run.activeLane,projectiles:run.projectiles,impactBursts:run.impactBursts,timeLeft:run.timeLeft,spills:run.spills,ended:run.ended,lifecyclePaused,screen:document.body.dataset.screen,resultHidden:els.result.hidden})):null,
    grantTiles(n=10){if(run)run.player.stack=Math.min(30,run.player.stack+n);updateHud()},setPlayer(x,y){if(run){run.player.x=run.player.targetX=x;run.player.y=run.player.targetY=y}},setTarget(x,y){if(run){run.player.targetX=x;run.player.targetY=y}},grantProgress(n){if(run)run.player.progress=Math.min(run.stage.goal,run.player.progress+n);updateHud()},step(seconds=.5){if(!run)return;for(let i=0;i<Math.ceil(seconds/0.02);i++)simulate(.02);draw()},complete(won=true){finish(won)},unlockAll(){save.unlocked=30;persist();renderStages()},reset(){save=freshSave();persist();renderProgress();renderStages();renderWorkshop()},setLocale(code){if(L.codes.includes(code)){locale=code;setText()}},get save(){return JSON.parse(JSON.stringify(save))}
  };
  Promise.all([new Promise(r=>{if(bg.complete)r();else{bg.onload=r;bg.onerror=r}}),new Promise(r=>{if(sprites.complete)r();else{sprites.onload=r;sprites.onerror=r}})]).finally(()=>{els.loadingFill.style.width="100%";setTimeout(()=>{setText();setScreen("main")},180)});
})();
