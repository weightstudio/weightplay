(async()=>{
  "use strict";
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((__wpMeasurement.screen) === "battle" && (__wpMeasurement.ended)) ? null : (__wpMeasurement.screen), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(run?.paused || run?.suspended || lifecyclePaused), node: document.body,
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

  const L=window.AnimalSkybridgeRivalsLocales;
  const $=(id)=>document.getElementById(id);
  const els={loading:$("loading"),loadingFill:$("loadingFill"),mainGroup:$("mainGroup"),stage:$("stage"),battle:$("battle"),locale:$("locale"),soundToggle:$("soundToggle"),lobbyReturn:$("lobbyReturn"),mainProgress:$("mainProgress"),start:$("start"),stageBack:$("stageBack"),stageRail:$("stageRail"),stageProgress:$("stageProgress"),stageHint:$("stageHint"),racesTab:$("racesTab"),workshopTab:$("workshopTab"),upgrades:$("upgrades"),shardCount:$("shardCount"),workshopFeedback:$("workshopFeedback"),diamondUnlock:$("diamondUnlock"),battleLive:$("battleLive"),battleBack:$("battleBack"),battleHelp:$("battleHelp"),raceLabel:$("raceLabel"),racePosition:$("racePosition"),stackValue:$("stackValue"),timeValue:$("timeValue"),bridgeValue:$("bridgeValue"),objective:$("objective"),arenaWrap:$("arenaWrap"),arena:$("arena"),dash:$("dash"),dashValue:$("dashValue"),feedback:$("feedback"),leave:$("leave"),continueBattle:$("continueBattle"),leaveStage:$("leaveStage"),tutorial:$("tutorial"),tutorialDone:$("tutorialDone"),result:$("result"),resultKicker:$("resultKicker"),resultTitle:$("resultTitle"),resultText:$("resultText"),resultStats:$("resultStats"),resultPurpose:$("resultPurpose"),retry:$("retry"),resultStage:$("resultStage"),nextRace:$("nextRace")};
  const moduleBase=new URL('.',document.currentScript.src);
  const [{SkyRace,STAGES,LANES},{SkybridgeView}]=await Promise.all([
    import(new URL('race-core.mjs?v=26',moduleBase)),
    import(new URL('skybridge-3d.mjs?v=26',moduleBase))
  ]);
  let view=null;
  const ranking=document.createElement('div');ranking.className='race-ribbon';ranking.setAttribute('aria-hidden','true');
  const rankMarks=['◆','◆','◆','◆'];
  ranking.innerHTML=rankMarks.map((m,i)=>`<span class="rank-runner" data-racer="${i}"><i></i><b>${i+1}</b></span>`).join('');
  els.arenaWrap.append(ranking);
  const raceCue=document.createElement('div');raceCue.className='race-cue';raceCue.setAttribute('aria-hidden','true');els.arenaWrap.append(raceCue);
  let cueEnd=0,previousStack=0;

  const STORAGE="weightplay:animal-skybridge-rivals:v1",LOCALE_STORAGE="weightplayLocale";
  const memory=new Map();
  const safeStore={get(k){try{return localStorage.getItem(k)}catch{return memory.get(k)||null}},set(k,v){memory.set(k,v);try{localStorage.setItem(k,v)}catch{}},remove(k){memory.delete(k);try{localStorage.removeItem(k)}catch{}}};
  const localeSegments={en:"en","zh-Hant":"zh-tw","zh-Hans":"zh-cn",ja:"ja",ko:"ko",es:"es","pt-BR":"pt-br",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"};
  const segmentLocales=Object.fromEntries(Object.entries(localeSegments).map(([k,v])=>[v,k]));
  function initialLocale(){const segment=location.pathname.split("/").filter(Boolean)[0];const routed=segmentLocales[segment];const saved=safeStore.get(LOCALE_STORAGE);return L.codes.includes(routed)?routed:L.codes.includes(saved)?saved:"en"}
  let locale=initialLocale();
  const GAME_ID="animal-skybridge-rivals",GAME_VERSION=26,INTERFACE_VERSION=6;
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
  function playCue(name,minGap=0){const now=performance.now(),last=cueTimes.get(name)||-Infinity;if(now-last<minGap)return;cueTimes.set(name,now);window.WeightPlayAudio?.play?.(name)}
  function updateSoundToggle(){const muted=window.WeightPlayAudio?.isMuted?.()===true;els.soundToggle.dataset.soundToggle="true";els.soundToggle.textContent=muted?"🔇":"🔊";els.soundToggle.title=t("sound");els.soundToggle.setAttribute("aria-label",t(muted?"soundEnable":"soundDisable"));els.soundToggle.classList.toggle("muted",muted)}
  function setText(){document.documentElement.lang=locale;document.documentElement.dir=locale==="ar"?"rtl":"ltr";document.title=`${t("title")} | WeightPlay`;document.querySelectorAll("[data-t]").forEach(el=>{el.textContent=t(el.dataset.t)});document.querySelectorAll("[data-ta]").forEach(el=>{el.setAttribute("aria-label",t(el.dataset.ta))});els.locale.value=locale;els.lobbyReturn.href=`/${localeSegments[locale]||"en"}/`;updateSoundToggle();renderProgress();renderStages();renderWorkshop();if(run)updateHud()}
  function renderProgress(){const stars=Object.values(save.stars).reduce((a,b)=>a+Number(b||0),0);els.mainProgress.textContent=`${save.unlocked} / 30 · ★ ${stars}`;els.stageProgress.textContent=`${save.unlocked} / 30 · ★ ${stars}`}
  const chapterKeys=["chapter1","chapter2","chapter3","chapter4","chapter5","chapter6"];
  const cardViewSeen=new Set(),cardFocusSeen=new Set();
  let stageMapVisit=0,stageCardViewObserver=null,stageCardPoolObserver=null;
  const stages=STAGES;
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
  function buyUpgrade(key,event){const restoreFocus=document.activeElement?.dataset?.upgrade===key,level=save.upgrades[key]||0;if(level>=5)return;const cost=costs[level];if(save.shards<cost){els.workshopFeedback.textContent=t("noShards");playCue("feedback.error");return}save.shards-=cost;save.upgrades[key]=level+1;persist();els.workshopFeedback.textContent=t("purchased");playCue("reward.upgrade");track("upgrade_purchase",{upgrade:key,from_level:level,to_level:level+1,cost,input_type:eventInputType(event)});renderWorkshop();renderProgress();if(restoreFocus)restoreWorkshopFocus(key)}
  els.diamondUnlock.addEventListener("click",()=>{if(save.championAura)return;const restoreFocus=document.activeElement===els.diamondUnlock,ok=window.WeightPlayWallet?.spendDiamonds?.(10);if(!ok){els.workshopFeedback.textContent=t("needDiamonds");return}save.championAura=true;persist();els.workshopFeedback.textContent=t("championUnlocked");renderWorkshop();if(restoreFocus)requestAnimationFrame(()=>document.querySelector('.stage-tabs [data-tab="workshop"]')?.focus({preventScroll:true}))});
  function setScreen(name,meta={}){cancelStageFocus();sceneGeneration++;clearTimeout(settleTimer);settleTimer=0;document.body.dataset.screen=name;els.loading.hidden=name!=="loading";els.mainGroup.hidden=name!=="main";els.stage.hidden=name!=="stage";els.battle.hidden=name!=="battle";if(name==="stage"){stageMapVisit++;cardViewSeen.clear();cardFocusSeen.clear();setTab("races");renderStages();renderProgress();track("race_map",{entry:meta.entry||"stage",race:currentStage+1})}if(name!=="battle"){stopPointer();cancelAnimationFrame(raf);view?.clearWorld();run=null;}requestAnimationFrame(()=>{window.dispatchEvent(new Event("resize"));window.WeightPlayStageSelector?.refresh?.();window.WeightPlayBattleCanvas?.refresh?.()})
    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[name] ?? null;
      if (["result"].includes(name) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
}
  let run=null,lastFrame=0,raf=0,keys=new Set(),activePointerId=null,lifecyclePaused=false,windowFocused=document.hasFocus(),documentVisible=!document.hidden,pageCached=false,resultActionClaimed=false,resultFocusTimer=0;
  let currentStage=0,contextUnavailable=false;
  function syncArenaSize(){view?.resize();if(run)draw()}
  const arenaObserver=new ResizeObserver(syncArenaSize);arenaObserver.observe(els.arena);
  function loadingFailure(){
    contextUnavailable=true;lifecyclePaused=true;stopPointer();cancelAnimationFrame(raf);
    let panel=els.arenaWrap.querySelector('.render-recovery');
    if(!panel){panel=document.createElement('div');panel.className='render-recovery';panel.setAttribute('role','alert');
      const text=document.createElement('p');text.textContent=t('renderError');
      const retry=document.createElement('button');retry.textContent=t('retry');retry.addEventListener('click',()=>location.reload());
      const back=document.createElement('button');back.textContent=t('returnStage');back.addEventListener('click',()=>{panel.remove();setScreen('stage');});
      panel.append(text,retry,back);els.arenaWrap.append(panel);
    }
  }
  els.arena.addEventListener('webglcontextlost',e=>{e.preventDefault();loadingFailure();});
  function startRace(index,opts={}){
    currentStage=Math.max(0,Math.min(29,index));lastInputType=normalizeInputType(opts.inputType||lastInputType);
    stopPointer();run=new SkyRace(currentStage,save.upgrades);run.championAura=save.championAura;previousStack=0;cueEnd=0;raceCue.textContent='';
    lifecyclePaused=!(windowFocused&&documentVisible&&!pageCached);
    els.result.hidden=true;els.leave.hidden=true;els.tutorial.hidden=save.tutorial||opts.skipTutorial;
    els.battleLive.inert=!els.tutorial.hidden;els.battleLive.removeAttribute('aria-hidden');
    setScreen('battle');
    try {if(contextUnavailable){loadingFailure();return;}if(!view)view=new SkybridgeView(els.arena);view.build(run);}
    catch(error){console.error('Skybridge renderer failed',error);loadingFailure();return;}
    say(t('raceObjective'),3,'route-assist');updateHud();
    track('race_start',{race:currentStage+1,entry:opts.entry||'stage_card',unlocked_races:save.unlocked});playCue('game.start');
    __wpMeasurement.roundKey={};__wpMeasurement.restart=false;__wpMeasurement.started=true;__wpMeasurement.ended=false;__wpMeasurement.outcome='complete';__wpMeasurement.screen='battle';__wpNotifyMeasurement();
    lastFrame=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(frame);
    if(!els.tutorial.hidden)els.tutorialDone.focus();
  }
  function frame(now){
    const dt=Math.min(.034,Math.max(0,(now-lastFrame)/1000||0));lastFrame=now;
    if(run&&!run.ended&&!run.paused&&!lifecyclePaused&&els.tutorial.hidden&&els.leave.hidden&&els.result.hidden&&!contextUnavailable)simulate(dt);
    draw(now);if(document.body.dataset.screen==='battle'&&!contextUnavailable)raf=requestAnimationFrame(frame);
  }
  function simulate(dt){
    if(!run||run.ended)return;
    const x=(keys.has('ArrowRight')||keys.has('d')?1:0)-(keys.has('ArrowLeft')||keys.has('a')?1:0);
    const y=(keys.has('ArrowUp')||keys.has('w')?1:0)-(keys.has('ArrowDown')||keys.has('s')?1:0);
    run.step(dt,{x,y});
    for(const event of run.events.splice(0)){
      view?.event(event);
      if(event.id!==0&&event.type!=='finish')continue;
      if(event.type==='pickup'){
        playCue('reward.collect',90);
        if(event.combo>=3)showRaceCue(`+${event.combo}`, .8);
        if(run.player.stack===1)say(t('raceBuildHint'),2);
      } else if(event.type==='full'){say(t('raceFull'),2,'bridge-first');showRaceCue(t('raceFull'),1.4);}
      else if(event.type==='build'){playCue('board.move',130);say(t('raceCross'),1);}
      else if(event.type==='empty'){say(t('raceEmpty'),2,'route-assist');showRaceCue(t('raceEmpty'),1.4);}
      else if(event.type==='checkpoint'){playCue('game.checkpoint');showRaceCue(t('raceCheckpoint'),1.7);}
      else if(event.type==='bump'){playCue('impact.soft',200);say(t('spilled'),1);showRaceCue(`−${event.loss}`, .8);}
      else if(event.type==='shield'){playCue('combat.block',250);}
      else if(event.type==='dash'){playCue('movement.dash');showRaceCue(t('dash'),1);}
      else if(event.type==='finish')finish(event.id===0);
      else if(event.type==='timeout')finish(false);
    }
    if(run.ended&&!__wpMeasurement.ended)finish(run.winner===0);
    if(run.elapsed>=cueEnd)raceCue.classList.remove('visible');
    if(run.feedbackClock>0){run.feedbackClock-=dt;if(run.feedbackClock<=0){els.feedback.textContent=t('raceControls');els.feedback.dataset.cue='';}}
    updateHud();
  }
  function playerPosition(){return run?.position||1;}
  function say(message,duration=1,cue=''){els.feedback.textContent=message;els.feedback.dataset.cue=cue;if(run)run.feedbackClock=duration;}
  function showRaceCue(message,duration){raceCue.textContent=message;raceCue.classList.add('visible');cueEnd=run.elapsed+duration;}
  function useDash(){if(!run||run.ended||run.paused||lifecyclePaused||!els.tutorial.hidden||!els.leave.hidden)return;if(!run.dash())say(t('raceCharge'),1);}
  function updateHud(){
    if(!run)return;
    els.raceLabel.textContent=stageName(run.stage);els.racePosition.textContent=`${run.position} / 4`;
    els.stackValue.textContent=`${run.player.stack}/${run.player.capacity}`;
    els.timeValue.textContent=Math.ceil(run.timeLeft);els.bridgeValue.textContent=`${Math.round(run.player.y/run.finishY*100)}%`;
    els.objective.textContent=`${t('race',{number:run.stage.number})} · ${t('raceObjective')}`;
    els.dashValue.textContent=run.player.dash>=100?t('raceReady'):`${Math.floor(run.player.dash)}%`;
    els.dash.classList.toggle('ready',run.player.dash>=100);els.dash.setAttribute('aria-disabled',String(run.player.dash<100));
    els.dash.style.setProperty('--charge',`${run.player.dash}%`);
    ranking.querySelectorAll('.rank-runner').forEach((el,i)=>{el.style.setProperty('--progress',`${Math.min(98,run.actors[i].y/run.finishY*96)}%`);});
    if(previousStack!==run.player.stack){els.stackValue.classList.remove('stack-pop');void els.stackValue.offsetWidth;els.stackValue.classList.add('stack-pop');previousStack=run.player.stack;}
  }
  function draw(now=performance.now()){if(view&&run&&document.body.dataset.screen==='battle'&&view.actorModels.length)view.render(run,now,lifecyclePaused||run.paused||!els.tutorial.hidden||!els.leave.hidden);}
  function finish(won){if(!run||__wpMeasurement.ended)return;if(!won)run.position=playerPosition();run.ended=true;resultActionClaimed=false;playCue(won ? "result.win" : "result.lose");const time=Math.ceil(run.timeLeft),stars=won?1+(time>=Math.ceil(run.stage.time*.42)?1:0)+(run.spills===0?1:0):0;if(won){save.stars[currentStage]=Math.max(save.stars[currentStage]||0,stars);save.best[currentStage]=Math.max(save.best[currentStage]||0,time);save.unlocked=Math.max(save.unlocked,Math.min(30,currentStage+2));save.shards+=4+stars*3;persist()}els.resultKicker.textContent=stageName(run.stage);els.resultTitle.textContent=t(won?"raceWon":"raceLost");els.resultText.textContent=t(won?"winText":"loseText");(__wpNotifyMeasurement(), els.resultPurpose.hidden=!won);els.resultPurpose.textContent=won?t(currentStage<29?"resultPurposeNext":"resultPurposeFinal",{number:currentStage+2}):"";els.resultStats.innerHTML=`<span><b>${t("place")}</b><strong>${won?1:run.position}/4</strong></span><span><b>${t("spills")}</b><strong>${run.spills}</strong></span><span><b>${t("stars")}</b><strong>${"★".repeat(stars)}${"☆".repeat(3-stars)}</strong></span>`;const hasNext=won&&currentStage<29;const primary=hasNext?els.nextRace:won?els.resultStage:els.retry;els.resultStage.disabled=false;els.retry.disabled=false;els.nextRace.hidden=false;els.nextRace.disabled=!hasNext;[els.retry,els.resultStage,els.nextRace].forEach(action=>action.classList.toggle("primary",action===primary));(__wpNotifyMeasurement(), els.result.hidden=false);els.battleLive.inert=true;els.battleLive.setAttribute("aria-hidden","true");renderProgress();track(won?"race_result_win":"race_result_loss",{race:currentStage+1,place:won?1:run.position,spills:run.spills,stars});if(won)track("result_purpose_view",{race:currentStage+1,unlocks_race:Math.min(30,currentStage+2)});clearTimeout(resultFocusTimer);resultFocusTimer=setTimeout(()=>{resultFocusTimer=0;if(document.body.dataset.screen==="battle"&&!els.result.hidden&&!primary.disabled)primary.focus()},0)
    __wpMeasurement.ended = true; __wpMeasurement.outcome = (won ? "win" : "lose"); if (__wpMeasurement.screen === "battle") __wpMeasurement.screen = null; __wpNotifyMeasurement();
}
  function claimResultAction(){if(els.result.hidden||resultActionClaimed)return false;clearTimeout(resultFocusTimer);resultFocusTimer=0;resultActionClaimed=true;[els.retry,els.resultStage,els.nextRace].forEach(action=>action.disabled=true);return true}
  function setTarget(ev){
    if(!run||run.ended||run.paused||lifecyclePaused||!els.tutorial.hidden||!els.leave.hidden)return;
    const p=view?.point(ev.clientX,ev.clientY);if(!p)return;
    run.target(p.x,p.y);view.acknowledge(run.player.targetX,run.player.targetY);
  }
  function releasePointer(pointerId,{cancelled=false}={}){if(activePointerId!==pointerId)return;if(cancelled&&run&&!run.ended){run.player.targetX=run.player.x;run.player.targetY=run.player.y}activePointerId=null;try{els.arena.releasePointerCapture(pointerId)}catch{}}
  els.arena.addEventListener("pointerdown",ev=>{if(activePointerId!==null||!ev.isPrimary)return;els.arena.focus({preventScroll:true});activePointerId=ev.pointerId;els.arena.setPointerCapture(ev.pointerId);setTarget(ev)});els.arena.addEventListener("pointermove",ev=>{if(activePointerId===ev.pointerId)setTarget(ev)});els.arena.addEventListener("pointerup",ev=>releasePointer(ev.pointerId));els.arena.addEventListener("pointercancel",ev=>releasePointer(ev.pointerId,{cancelled:true}));
  function stopPointer(){if(activePointerId!==null)releasePointer(activePointerId,{cancelled:true});keys.clear()}
  document.addEventListener('keydown',event=>{
    if(document.body.dataset.screen!=='battle')return;
    const modal=[els.leave,els.tutorial,els.result].find(el=>!el.hidden);if(!modal)return;
    if(event.key==='Escape'&&modal!==els.result){event.preventDefault();event.stopImmediatePropagation();(modal===els.leave?els.continueBattle:els.tutorialDone).click();return;}
    if(event.key==='Tab'){
      const buttons=[...modal.querySelectorAll('button:not(:disabled)')].filter(b=>b.getClientRects().length);
      const index=buttons.indexOf(document.activeElement),next=event.shiftKey?(index<=0?buttons.length-1:index-1):(index+1)%buttons.length;
      if(buttons.length){event.preventDefault();buttons[next].focus();}
    }
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','w','a','s','d'].includes(event.key))event.stopImmediatePropagation();
  },true);
  function suspendLifecycle(){stopPointer();if(run&&!run.ended&&document.body.dataset.screen==="battle"){run.player.targetX=run.player.x;run.player.targetY=run.player.y;(__wpNotifyMeasurement(), lifecyclePaused=true)}}
  function reconcileLifecycle(){if(windowFocused&&documentVisible&&!pageCached){(__wpNotifyMeasurement(), lifecyclePaused=false);lastFrame=performance.now()}else suspendLifecycle()}
  function reclaimVisibleForeground(event){const internalStageActivation=event?.target?.closest?.("[data-wp-stage-source-store]")&&document.body.dataset.screen==="stage";if((!event?.isTrusted&&!internalStageActivation)||document.hidden||pageCached)return false;if(windowFocused)return true;windowFocused=true;reconcileLifecycle();return true}
  window.addEventListener("keydown",ev=>{if(document.body.dataset.screen!=="battle")return;const key=ev.key.length===1?ev.key.toLowerCase():ev.key;if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","w","a","s","d"].includes(key)){keys.add(key);ev.preventDefault()}if((ev.code==="Space"&&(document.activeElement===els.arena||document.activeElement===els.dash))||(ev.key==="Enter"&&document.activeElement===els.dash)){useDash();ev.preventDefault()}});window.addEventListener("keyup",ev=>keys.delete(ev.key.length===1?ev.key.toLowerCase():ev.key));
  window.addEventListener("blur",()=>{windowFocused=false;reconcileLifecycle()});window.addEventListener("focus",()=>{windowFocused=true;reconcileLifecycle()});document.addEventListener("visibilitychange",()=>{documentVisible=!document.hidden;reconcileLifecycle()});window.addEventListener("pagehide",()=>{pageCached=true;reconcileLifecycle()});window.addEventListener("pageshow",()=>{pageCached=false;reconcileLifecycle()});
  els.battle.addEventListener("pointerdown",reclaimVisibleForeground,true);els.battle.addEventListener("keydown",reclaimVisibleForeground,true);
  els.soundToggle.addEventListener("click",()=>{window.WeightPlayAudio?.unlock?.();window.WeightPlayAudio?.setMuted?.(!window.WeightPlayAudio.isMuted());updateSoundToggle();if(!window.WeightPlayAudio?.isMuted?.())playCue("ui.click")});els.dash.addEventListener("click",useDash);els.start.addEventListener("click",event=>{lastInputType=eventInputType(event);setScreen("stage",{entry:"main_start"})});els.stageBack.addEventListener("click",event=>{track("main_return",{from:"race_map",input_type:eventInputType(event)});setScreen("main")});els.battleBack.addEventListener("click",()=>{if(!run||run.ended){setScreen("stage",{entry:"battle_back"});return}stopPointer();(__wpNotifyMeasurement(), run.paused=true);(__wpNotifyMeasurement(), els.leave.hidden=false);els.battleLive.inert=true;els.continueBattle.focus()});els.continueBattle.addEventListener("click",()=>{(__wpNotifyMeasurement(), els.leave.hidden=true);(__wpNotifyMeasurement(), run.paused=false);els.battleLive.inert=false;els.battleBack.focus()});els.leaveStage.addEventListener("click",()=>{(__wpNotifyMeasurement(), els.leave.hidden=true);if(run)run.ended=true;els.battleLive.inert=false;els.battleLive.removeAttribute("aria-hidden");setScreen("stage",{entry:"battle_leave"});centerStage(currentStage,false)});els.battleHelp.addEventListener("click",()=>{stopPointer();(__wpNotifyMeasurement(), run.paused=true);(__wpNotifyMeasurement(), els.tutorial.hidden=false);els.battleLive.inert=true;els.tutorialDone.focus()});els.tutorialDone.addEventListener("click",()=>{save.tutorial=true;persist();(__wpNotifyMeasurement(), els.tutorial.hidden=true);(__wpNotifyMeasurement(), run.paused=false);els.battleLive.inert=false;lastFrame=performance.now();els.arena.focus?.()});els.retry.addEventListener("click",event=>{if(!claimResultAction())return;track("retry",{from:"result",race:currentStage+1,input_type:eventInputType(event)});__wpReplayStart(() => startRace(currentStage,{skipTutorial:true,inputType:eventInputType(event),entry:"retry"}))});els.resultStage.addEventListener("click",event=>{if(!claimResultAction())return;lastInputType=eventInputType(event);(__wpNotifyMeasurement(), els.result.hidden=true);els.battleLive.inert=false;els.battleLive.removeAttribute("aria-hidden");const target=Math.min(save.unlocked-1,29);setScreen("stage",{entry:"result_map"});focusStageCardAfterSettlement(target)});els.nextRace.addEventListener("click",event=>{if(!claimResultAction())return;track("next_race",{from:"result",from_race:currentStage+1,to_race:Math.min(30,currentStage+2),input_type:eventInputType(event)});startRace(Math.min(29,currentStage+1),{skipTutorial:true,inputType:eventInputType(event),entry:"next_race"})});
  els.locale.addEventListener("change",()=>{locale=els.locale.value;safeStore.set(LOCALE_STORAGE,locale);if(window.WonderI18n?.setLocale){window.WonderI18n.setLocale(locale);return}setText()});
  window.addEventListener("resize",syncArenaSize);
  if(['localhost','127.0.0.1','[::1]'].includes(location.hostname))window.__animalSkybridgeRivalsSmoke={
    stages,startRace:(i=0)=>startRace(i,{skipTutorial:true}),
    snapshot:()=>run?JSON.parse(JSON.stringify({stage:currentStage,player:run.player,rivals:run.rivals,
      pickups:run.pickups.filter(p=>p.color===0&&p.readyAt<=run.elapsed),bridges:run.bridges,
      finishY:run.finishY,timeLeft:run.timeLeft,spills:run.spills,ended:run.ended,winner:run.winner,
      lifecyclePaused,screen:document.body.dataset.screen,resultHidden:els.result.hidden})):null,
    project:(x,y,h=0)=>view?.project(x,y,h),stats:()=>view?.stats(),
    step(seconds=.5){if(!run)return;for(let i=0;i<Math.ceil(seconds/.02);i++)simulate(.02);draw();},
    complete(won=true){finish(won);},unlockAll(){save.unlocked=30;persist();renderStages();},
    setLocale(code){if(L.codes.includes(code)){locale=code;setText();}},
    reset(){save=freshSave();persist();renderProgress();renderStages();renderWorkshop();},
    get save(){return JSON.parse(JSON.stringify(save));}
  };
  window.addEventListener('pagehide',event=>{if(!event.persisted){cancelAnimationFrame(raf);arenaObserver.disconnect();view?.dispose();view=null;}});
  els.loadingFill.style.width='100%';setText();setScreen('main');
})().catch(error=>{
  console.error('Skybridge startup failed',error);
  const loading=document.getElementById('loading');
  if(loading){loading.textContent='3D loading failed. 載入失敗。';const retry=document.createElement('button');retry.textContent='Retry / 重試';retry.onclick=()=>location.reload();loading.append(retry);}
});
