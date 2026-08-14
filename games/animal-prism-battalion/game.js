(function(){
  "use strict";
  document.body.setAttribute("data-runtime-localize","off");
  const $=(id)=>document.getElementById(id);
  const pack=window.AnimalPrismBattalionLocales;
  const localeCodes=pack.codes;
  const routeSegments={en:"en","zh-Hant":"zh-tw","zh-Hans":"zh-cn",ja:"ja",ko:"ko",es:"es","pt-BR":"pt-br",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"};
  const GAME_VERSION=14, INTERFACE_VERSION=6;
  const routeLocales=Object.fromEntries(Object.entries(routeSegments).map(([key,value])=>[value,key]));
  const memoryStorage=new Map();
  const storage={
    get(key){try{const value=localStorage.getItem(key);return value===null?(memoryStorage.get(key)??null):value}catch{return memoryStorage.get(key)??null}},
    set(key,value){memoryStorage.set(key,String(value));try{localStorage.setItem(key,String(value))}catch{/* same-page fallback */}},
  };
  function canonicalLocale(value){const raw=String(value||"").toLowerCase();if(raw.startsWith("zh-tw")||raw.includes("hant"))return"zh-Hant";if(raw.startsWith("zh-cn")||raw.includes("hans"))return"zh-Hans";if(raw.startsWith("pt"))return"pt-BR";return localeCodes.find((code)=>code.toLowerCase()===raw)||"en"}
  const routeLocale=routeLocales[location.pathname.split("/").filter(Boolean)[0]];
  let locale=canonicalLocale(routeLocale||window.WonderI18n?.actualLocale?.()||storage.get("wonderLocale")||navigator.language);
  const LANE_COPY={laneKicker:"THREE-LANE CORE DEFENSE",lanePosterAlt:"Prism spirits defend three crystal lanes from shadow waves",laneObjective:"Switch lanes, destroy every wave, protect the core.",laneGuideTitle:"Read the wave. Focus fire. Hold the core.",laneGuideIntro:"Command three automatic prism batteries against dense shadow formations. Switch lanes to stop the closest threat and collect the rare power core before the stronger wave behind it arrives.",laneHow1:"Tap a lane or use Left and Right to focus the automatic battery.",laneHow2:"Most formations are monsters. A rare glowing core upgrades attack, and every later formation is balanced around that upgrade.",laneHow3:"Do not let enemies reach the core. Survive every wave; the final wave of each chapter is a Boss.",laneCampaign:"Thirty authored defenses escalate from split monster packs to shields, bombs, champions, converging waves, and six final Bosses.",laneTutorialTitle:"Defend three crystal lanes",laneTutorial1:"Tap a lane or press Left and Right to focus fire. Your prism battery shoots automatically.",laneTutorial2:"Power cores are rare. Break and collect one, because the following monsters become much stronger.",laneTutorial3:"Any surviving monster damages the core. Clear every wave and defeat the Boss to win.",attackPower:"Attack",powerStored:"Stored +{count}",shieldReward:"Shield {shield} · +{reward}",bombThreat:"Bomb {count}",pickupPower:"Attack power +{count}",shieldBroken:"Shield broken · collect +{count}",bombDefused:"Bomb defused!",bombDamage:"Bomb blast -{count}",enemyCollision:"Core hit -{count}",enemyLeak:"Monster breached -{count}",laneReady:"Lane {lane} selected",waveLabel:"Wave {wave}/{total}",bossWave:"BOSS WAVE"};
  const t=(key,vars={})=>{const owned=pack.dictionaries[locale]?.[key],english=pack.dictionaries.en[key],source=LANE_COPY[key]||english||key,translate=window.WeightPlayGameRuntimeLocalizer?.translate;let value=owned??source;if(locale!=="en"&&translate&&(owned==null||owned===english))value=translate(source);return String(value).replace(/\{(\w+)\}/g,(_,name)=>vars[name]??`{${name}}`)};
  function viewportBucket(){if(innerWidth<=460)return"phone";if(innerWidth<900&&innerWidth>innerHeight)return"short-landscape";return innerWidth>=1000?"desktop":"tablet"}
  function track(event,data={}){try{(window.WonderAnalytics||window.WeightPlayAnalytics)?.track?.(event,{game_id:"animal-prism-battalion",game_version:GAME_VERSION,interface_version:INTERFACE_VERSION,locale,viewport_bucket:viewportBucket(),...data})}catch{}}

  LANE_COPY.laneGuideIntro="Switch Captain Fia between three lanes while the battalion fires automatically. Break threats, collect power cores, and protect the crystal.";
  const SAVE_KEY="animalPrismBattalionSaveV1";
  const defaultSave=()=>({unlocked:1,stars:{},shards:0,upgrades:{rate:0,power:0,armor:0},tutorialSeen:false});
  function normalizeSave(raw){
    const source=raw&&typeof raw==="object"?raw:{};
    const stars={};
    if(source.stars&&typeof source.stars==="object")for(const [key,value] of Object.entries(source.stars)){const stage=Math.trunc(Number(key));const score=Math.max(0,Math.min(3,Math.trunc(Number(value))));if(Number.isFinite(stage)&&stage>=1&&stage<=30&&score)stars[stage]=score}
    const upgrades={};
    for(const id of ["rate","power","armor"])upgrades[id]=Math.max(0,Math.min(5,Math.trunc(Number(source.upgrades?.[id]))||0));
    return{unlocked:Math.max(1,Math.min(30,Math.trunc(Number(source.unlocked))||1)),stars,shards:Math.max(0,Math.min(9999,Math.trunc(Number(source.shards))||0)),upgrades,tutorialSeen:source.tutorialSeen===true};
  }
  function readSave(){try{return normalizeSave(JSON.parse(storage.get(SAVE_KEY)||"null"))}catch{return defaultSave()}}
  let save=readSave();
  const persist=()=>storage.set(SAVE_KEY,JSON.stringify(save));
  const chapters=["chapter1","chapter2","chapter3","chapter4","chapter5","chapter6"];
  const stages=Array.from({length:30},(_,index)=>{
    const n=index+1,chapter=Math.floor(index/5),step=index%5;
    const boss=n%5===0;
    const layout={routes:3,rows:18+chapter*3+step*2,pattern:(index*7+chapter*3)%11,speed:.09+chapter*.004+step*.0015,phase:(index*1.73)%6.28};
    return{n,chapter,time:74+chapter*5+step*2,enemyHp:12+chapter*8+step*3,waves:layout.rows,moving:false,shields:chapter>=1,counter:chapter>=2,champion:chapter>=3,boss,layout};
  });
  const staticText=[...document.querySelectorAll("[data-t]")];
  const assistiveText=[...document.querySelectorAll("[data-ta]")];
  const resultReplayLabels={en:"Replay","zh-Hant":"重玩","zh-Hans":"重玩",ja:"リプレイ",ko:"다시 플레이",es:"Repetir","pt-BR":"Jogar novamente",fr:"Rejouer",de:"Erneut spielen",it:"Rigioca",ru:"Играть снова",hi:"फिर खेलें",ar:"إعادة اللعب"};
  let currentScreen="loading",run=null,raf=0,lastTime=0,visibleTick=0,lastHud="",modalReturnFocus=null,lifecyclePaused=false,windowFocused=document.hasFocus(),resultDecisionCommitted=false,selectedStageIndex=0;

  function applyLocale(){
    document.documentElement.lang=locale;
    document.documentElement.dir=locale==="ar"?"rtl":"ltr";
    $("locale").value=locale;
    $("lobbyReturn").href=`/${routeSegments[locale]}/`;
    staticText.forEach((node)=>{node.textContent=t(node.dataset.t)});
    assistiveText.forEach((node)=>node.setAttribute("aria-label",t(node.dataset.ta)));
    const resultActions=$("resultStage").parentElement;
    resultActions.append($("resultStage"),$("nextMission"),$("retry"));
    $("resultStage").textContent=t("missions");
    $("nextMission").textContent=t("nextMission");
    $("retry").textContent=resultReplayLabels[locale]||resultReplayLabels.en;
    document.title=`${t("title")} | WeightPlay`;
    renderMain();renderStage();renderLab();if(run)updateHud(true);
  }
  function showScreen(name){
    if(name!=="stage")window.PrismBattalionStageRenderer?.cancel?.();
    currentScreen=name;document.body.dataset.screen=name;
    for(const [scene,node] of [["main",$("mainGroup")],["stage",$("stage")],["battle",$("battle")]]){const active=scene===name;node.hidden=!active;node.inert=!active;node.setAttribute("aria-hidden",String(!active))}
    if(name==="main"){$("start").focus();scrollTo(0,0)}
    if(name==="stage"){selectedStageIndex=Math.min(save.unlocked-1,29);renderStage();renderLab();$("labFeedback").textContent="";requestAnimationFrame(()=>centerStage(selectedStageIndex))}
    window.dispatchEvent(new CustomEvent("weightplay:shell-sync",{detail:{screen:name}}));
    window.dispatchEvent(new CustomEvent("weightplay:stage-sync",{detail:{screen:name}}));
    window.dispatchEvent(new CustomEvent("weightplay:battle-sync",{detail:{screen:name}}));
  }
  function renderMain(){$("mainProgress").textContent=`${Object.keys(save.stars).length} / 30`}
  function chapterName(stage){return t(chapters[stage.chapter])}
  function renderStage(){
    if(!$("stageRail"))return;
    $("stageProgress").textContent=`${save.unlocked} / 30`;
    if(window.PrismBattalionStageRenderer){window.PrismBattalionStageRenderer.render({rail:$("stageRail"),stages,save,t,chapterName,getSelected:()=>selectedStageIndex+1,setSelected:value=>{selectedStageIndex=Math.max(0,Math.min(29,Number(value)-1))},announce:()=>{$("stageHint").textContent=t("stageLocked")},enter:(stage,event)=>startBattle(stage-1,event)});return}
    $("stageRail").replaceChildren(...stages.map((stage,index)=>{
      const locked=stage.n>save.unlocked,button=document.createElement("button");
      button.type="button";button.className=`stage-card${locked?" locked":""}`;button.dataset.stage=String(stage.n);button.dataset.index=String(index);button.setAttribute("aria-disabled",locked?"true":"false");
      button.innerHTML=`<span>${locked?t("lockedBadge"):chapterName(stage)}</span><strong>${stage.n}</strong><b>${stage.boss?"◆ ":""}${t("waveLabel",{wave:0,total:stage.waves})}</b><small>${"★".repeat(save.stars[stage.n]||0)}${"☆".repeat(3-(save.stars[stage.n]||0))}</small>`;
      button.addEventListener("click",(event)=>{if(locked){$("stageHint").textContent=t("stageLocked");return}startBattle(index,event)});
      return button;
    }));
  }
  function markCentered(index){
    if(window.PrismBattalionStageRenderer){selectedStageIndex=Math.max(0,Math.min(29,Number(index)||0));window.PrismBattalionStageRenderer.select(selectedStageIndex+1,false);return}
    const cards=[...$("stageRail").children];
    cards.forEach((card,i)=>{const active=i===Number(index);card.classList.toggle("centered",active);card.setAttribute("aria-current",active?"true":"false")});
  }
  function centerStage(index){const card=$("stageRail").querySelector(`[data-index="${index}"]`);card?.scrollIntoView({behavior:"auto",inline:"center",block:"nearest"});requestAnimationFrame(()=>markCentered(index))}
  $("stageRail").addEventListener("wonder:stage-snap",(event)=>{if(!window.PrismBattalionStageRenderer)markCentered(event.detail?.index)});

  const upgradeData={rate:{icon:"⚡",name:"upgradeRate",desc:"upgradeRateDesc"},power:{icon:"✦",name:"upgradePower",desc:"upgradePowerDesc"},armor:{icon:"◆",name:"upgradeArmor",desc:"upgradeArmorDesc"}};
  const upgradeCost=(level)=>6+level*6;
  let labPurchaseKeyboardKey=null;
  function renderLab(focusUpgrade=""){
    $("shardCount").textContent=t("shards",{count:save.shards});
    $("upgrades").replaceChildren(...Object.entries(upgradeData).map(([id,data])=>{
      const level=save.upgrades[id],button=document.createElement("button");button.type="button";button.className=`upgrade${level>=5?" maxed":""}`;button.dataset.upgrade=id;button.disabled=level>=5;
      button.innerHTML=`<span class="upgrade-icon">${data.icon}</span><strong>${t(data.name)}</strong><small>${t(data.desc)}</small><b>${t("level",{level})}</b><em>${level>=5?t("maxed"):t("upgradeCost",{cost:upgradeCost(level)})}</em>`;
      button.addEventListener("keydown",(event)=>{if(event.key!=="Enter"&&event.key!==" ")return;if(event.repeat||labPurchaseKeyboardKey===event.key){event.preventDefault();return}labPurchaseKeyboardKey=event.key});
      button.addEventListener("click",()=>buyUpgrade(id));return button;
    }));
    if(focusUpgrade)requestAnimationFrame(()=>$("upgrades").querySelector(`[data-upgrade="${focusUpgrade}"]`)?.focus());
  }
  function buyUpgrade(id){const level=save.upgrades[id];if(level>=5)return;const cost=upgradeCost(level),name=t(upgradeData[id].name);if(save.shards<cost){$("labFeedback").textContent=t("needShardsDetail",{name,cost,balance:save.shards});return}save.shards-=cost;save.upgrades[id]+=1;persist();renderLab(id);$("labFeedback").textContent=t("upgradePurchasedDetail",{name,level:save.upgrades[id],balance:save.shards});window.WonderSound?.play?.("success")}
  const stageTabs=[...document.querySelectorAll("[data-tab]")];
  function activateStageTab(name){
    stageTabs.forEach((button)=>{
      const active=button.dataset.tab===name;
      button.classList.toggle("active",active);
      button.setAttribute("aria-selected",active?"true":"false");
      button.tabIndex=active?0:-1;
    });
    $("missionsTab").hidden=name!=="missions";
    $("labTab").hidden=name!=="lab";
    if(name==="lab"){renderLab();$("labFeedback").textContent=""}
  }
  document.querySelector(".stage-tabs")?.setAttribute("role","tablist");
  stageTabs.forEach((button,index)=>{
    const name=button.dataset.tab;
    const panel=$(name==="missions"?"missionsTab":"labTab");
    button.id=`${name}TabButton`;
    button.setAttribute("role","tab");
    button.setAttribute("aria-keyshortcuts","ArrowLeft ArrowRight ArrowUp ArrowDown Home End");
    button.setAttribute("aria-controls",panel.id);
    panel.setAttribute("role","tabpanel");
    panel.setAttribute("aria-labelledby",button.id);
    button.addEventListener("click",()=>activateStageTab(name));
    button.addEventListener("keydown",(event)=>{
      let targetIndex=null;
      if(event.key==="ArrowRight"||event.key==="ArrowDown")targetIndex=(index+1)%stageTabs.length;
      else if(event.key==="ArrowLeft"||event.key==="ArrowUp")targetIndex=(index-1+stageTabs.length)%stageTabs.length;
      else if(event.key==="Home")targetIndex=0;
      else if(event.key==="End")targetIndex=stageTabs.length-1;
      if(targetIndex===null)return;
      event.preventDefault();
      const target=stageTabs[targetIndex];
      activateStageTab(target.dataset.tab);
      target.focus({preventScroll:true});
    });
  });
  activateStageTab("missions");
  $("start").addEventListener("click",()=>showScreen("stage"));$("stageBack").addEventListener("click",()=>showScreen("main"));
  $("locale").addEventListener("change",(event)=>{locale=canonicalLocale(event.target.value);storage.set("wonderLocale",locale);window.WonderI18n?.setLocale?.(locale);applyLocale()});
  window.addEventListener("keyup",(event)=>{if(event.key===labPurchaseKeyboardKey)labPurchaseKeyboardKey=null});
  window.addEventListener("blur",()=>{labPurchaseKeyboardKey=null});

  const canvas=$("arena"),ctx=canvas.getContext("2d"),images={};
  canvas.tabIndex=0;
  canvas.setAttribute("aria-keyshortcuts","ArrowLeft ArrowRight A D Space");
  const imageSources={arena:"../../assets/animal-prism-battalion/arena.webp",spirits:"../../assets/animal-prism-battalion/spirit-atlas.webp",fox:"../../assets/weightplay-character-spark-paw-fox-cutout.webp",enemy:"../../assets/animal-crystal-survivor-shadow-fox-v2.webp",boss:"../../assets/animal-crystal-survivor-boss-eclipse-colossus.webp"};
  function seeded(seed){let value=(seed*9301+49297)%233280;return()=>{value=(value*9301+49297)%233280;return value/233280}}
  const laneCenters=[.2,.5,.8],encounterKinds=["power","enemy","shield","bomb"];
  function encounterRows(stage){
    const random=seeded(stage.n*17+stage.layout.pattern),rows=[];
    for(let row=0;row<stage.layout.rows;row+=1){
      const rewardInterval=7+Math.min(2,stage.chapter),rewardWave=row===3||(row>3&&(row+1)%rewardInterval===0),rewardLane=(row+stage.layout.pattern)%3,powerTier=Math.max(0,Math.floor((row+1)/rewardInterval)),entries=[];
      for(let lane=0;lane<3;lane+=1){
        let kind=rewardWave&&lane===rewardLane?(stage.shields&&powerTier%2===0?"shield":"power"):(stage.counter&&random()<.14?"bomb":"enemy");
        const finalBoss=stage.boss&&row===stage.layout.rows-1&&lane===1;if(stage.boss&&row===stage.layout.rows-1)kind="enemy";
        const escalation=1+powerTier*.52+stage.chapter*.34+row*.018,value=Math.round((kind==="power"||kind==="shield"?8+powerTier*5+stage.chapter*3:(8+random()*7)*escalation)*(finalBoss?10:1));
        entries.push({id:`${row}-${lane}`,row,lane,x:laneCenters[lane],y:-.08-row*(.12+(stage.n%3)*.004),kind,value,hp:value,maxHp:value,stored:0,reward:Math.max(4,Math.round((6+powerTier*5+stage.chapter*2)*(kind==="shield"?1.15:1))),shield:kind==="shield"?value:0,maxShield:kind==="shield"?value:0,powerTier,champion:kind==="enemy"&&(finalBoss||(stage.champion&&row%6===5&&lane===(row+1)%3)),boss:finalBoss,resolved:false});
      }
      const boss=entries.find((entry)=>entry.boss);
      if(boss){const strongestEscort=Math.max(...entries.filter((entry)=>!entry.boss).map((entry)=>entry.maxHp));boss.value=Math.max(boss.value,strongestEscort*10);boss.hp=boss.maxHp=boss.value}
      rows.push(entries);
    }
    return rows;
  }
  function makeEncounters(stage){return encounterRows(stage).flat()}
  function startBattle(index,event){
    reclaimVisibleForeground(event);
    const stageIndex=Math.max(0,Math.min(29,Math.trunc(index))),stage=stages[stageIndex];
    clearArenaPointer();
    lifecyclePaused=false;
    const maxCore=100+save.upgrades.armor*20,encounters=makeEncounters(stage);
    run={stageIndex,stage,time:stage.time,core:maxCore,maxCore,wave:1,totalWaves:stage.waves,bossDefeated:false,lane:1,aimX:laneCenters[1],attack:6+save.upgrades.power*2,weapon:"single",units:[],encounters,gates:encounters,enemies:encounters.filter(entry=>entry.kind==="enemy"),particles:[],texts:[],fireClock:0,charge:0,overdrive:0,feedbackLock:0,readyCueShown:false,peak:6+save.upgrades.power*2,coreHits:0,laneDamage:[0,0,0],resolved:0,paused:false,finished:false,lastGateMessage:"",lastTrackedWave:1};
    track("mission_start",{stage:stage.n});track("game_start",{stage:stage.n});
    $("leave").hidden=true;$("tutorial").hidden=true;$("result").hidden=true;$("battleLive").hidden=false;$("battleLive").inert=false;$("feedback").classList.remove("ready-cue");$("overdrive").removeAttribute("aria-label");showScreen("battle");canvas.focus({preventScroll:true});updateHud(true);$("feedback").textContent="";lastTime=performance.now();stopLoop();lifecyclePaused=document.hidden;run.paused=lifecyclePaused;ensureVisibleTick();if(!lifecyclePaused)raf=requestAnimationFrame(frame);window.WonderSound?.play?.("start");if(!save.tutorialSeen)requestAnimationFrame(()=>openTutorial())
  }
  function stopLoop(){if(raf)cancelAnimationFrame(raf);raf=0}
  function resumeLoop(){if(!run||run.finished||run.paused||raf)return;lastTime=performance.now();raf=requestAnimationFrame(frame)}
  function priorityThreat(){if(!run)return null;const danger={bomb:4,enemy:3,shield:2,power:1},threats=run.encounters.filter((entry)=>!entry.resolved&&!entry.collecting).sort((a,b)=>(b.y-a.y)*10+((danger[b.kind]||0)-(danger[a.kind]||0)));if(!threats.length)return null;const lead=threats[0],count=threats.filter((entry)=>entry.lane===lead.lane&&entry.y>=Math.max(.28,lead.y-.18)).length;return{lane:lead.lane,count:Math.max(1,count)}}
  function announceOverdriveReady(){if(!run||run.charge<100||run.readyCueShown)return;const priority=priorityThreat();if(!priority)return;const vars={seconds:"3.6",lane:priority.lane+1,count:priority.count},cue=t("overdriveReadyCue",vars);$("feedback").textContent=t("overdriveReadyCueShort",vars);$("feedback").classList.add("ready-cue");$("overdrive").setAttribute("aria-label",cue);run.readyCueShown=true}
  function updateHud(force=false){if(!run)return;const priority=priorityThreat(),firstSwitchCue=Boolean(priority&&run.wave===1&&priority.lane!==run.lane),key=`${Math.ceil(run.time)}|${Math.ceil(run.core)}|${run.wave}|${run.resolved}|${Math.floor(run.charge)}|${Math.ceil(run.overdrive*10)}|${run.attack}|${run.weapon}|${run.lane}|${priority?.lane}|${priority?.count}|${firstSwitchCue}|${locale}`;if(!force&&key===lastHud)return;lastHud=key;const weaponMark=run.weapon==="double"?"×2":run.weapon==="rapid"?"≫":"•";$("missionLabel").textContent=`${chapterName(run.stage)} · ${run.stage.n}/30`;$("fortressValue").textContent=`⚔ ${Math.round(run.attack)} ${weaponMark} · ${t("waveLabel",{wave:run.wave,total:run.totalWaves})}`;$("coreValue").textContent=`${Math.max(0,Math.ceil(run.core))}/${run.maxCore}`;$("timeValue").textContent=Math.max(0,Math.ceil(run.time));$("objective").textContent=priority?t("priorityLane",{lane:priority.lane+1,count:priority.count}):t("laneObjective");$("objective").dataset.priorityLane=priority?String(priority.lane+1):"";$("objective").classList.toggle("first-switch-cue",firstSwitchCue);$("overdrive").querySelector("span").textContent=t(run.overdrive>0?"overdriveActive":"overdrive");$("overdriveValue").textContent=run.overdrive>0?t("secondsShort",{seconds:run.overdrive.toFixed(1)}):`${Math.floor(run.charge)}%`;$("overdrive").classList.toggle("ready",run.charge>=100);$("overdrive").classList.toggle("active",run.overdrive>0)}
  function addText(x,y,text,color){run.texts.push({x,y,text,color,life:1})}
  function addBurst(x,y,color,count=8){for(let i=0;i<count;i+=1){const a=Math.PI*2*i/count+Math.random()*.3,s=.025+Math.random()*.045;run.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,color,life:.65+Math.random()*.35})}}
  function updatePeak(){if(run)run.peak=Math.max(run.peak,Math.round(run.attack))}
  function recordCoreDamage(loss,lane,source){if(!run||loss<=0)return;run.core-=loss;run.coreHits+=loss;run.laneDamage[lane]+=loss;track("core_damage",{stage:run.stage.n,wave:run.wave,lane:lane+1,amount:loss,source})}
  function fireInterval(){if(run.overdrive>0)return.075;if(run.weapon==="rapid")return Math.max(.095,.155-save.upgrades.rate*.01);return Math.max(.16,.27-save.upgrades.rate*.022)}
  function launch(){const interval=fireInterval(),shots=run.weapon==="double"?2:1,damageFactor=shots===2?.62:run.weapon==="rapid"?.72:1;for(let shot=0;shot<shots;shot+=1)run.units.push({x:laneCenters[run.lane]+(shots===2?(shot?1:-1)*.018:0),lane:run.lane,y:.83,damage:run.attack*damageFactor*(run.overdrive>0?1.75:1),vy:run.weapon==="rapid"?-.84:-.72,hue:run.overdrive>0?48:188,sprite:(run.units.length+run.resolved+shot)%3,passed:[]});run.fireClock-=interval}
  function hitEncounter(unit,entry){
    const damage=Math.max(1,unit.damage),nonBlocking=entry.kind==="power"||(entry.kind==="shield"&&entry.collecting);if(nonBlocking){unit.passed??=[];unit.passed.push(entry.id)}else unit.dead=true;
    if(entry.kind==="power"){const gained=Math.min(entry.value-entry.stored,Math.max(1,Math.round(damage*.45)));entry.stored+=gained;run.charge=Math.min(100,run.charge+Math.max(1,gained*.7));addText(entry.x,entry.y-.035,`+${entry.stored}`,"#72f4d8");addBurst(entry.x,entry.y,"#5ff4db",7)}
    else if(entry.kind==="shield"&&!entry.collecting){entry.shield=Math.max(0,entry.shield-damage);if(entry.shield===0&&!entry.broken){entry.broken=true;entry.collecting=true;run.charge=Math.min(100,run.charge+18);$("feedback").textContent=t("shieldBroken",{count:entry.reward});addBurst(entry.x,entry.y,"#70eaff",16)}}
    else{entry.hp=Math.max(0,entry.hp-damage);addBurst(entry.x,entry.y,entry.kind==="bomb"?"#ffb04d":"#ff6a85",entry.boss?24:8);if(entry.hp===0){entry.resolved=true;run.resolved+=1;if(entry.boss){run.bossDefeated=true;$("feedback").textContent=t("bossWave")}run.charge=Math.min(100,run.charge+(entry.kind==="bomb"?20:12));if(!entry.boss)$("feedback").textContent=t(entry.kind==="bomb"?"bombDefused":"gateBoost",{count:Math.round(entry.maxHp)});addBurst(entry.x,entry.y,"#ffe273",entry.boss?42:18)}}
  }
  function resolveEncounter(entry){
    if(entry.resolved)return;entry.resolved=true;run.resolved+=1;const same=entry.lane===run.lane;
    if(entry.kind==="power"&&same){const gain=Math.max(1,entry.stored);run.attack=Math.min(999,run.attack+gain);run.charge=Math.min(100,run.charge+gain);run.weapon=run.attack>=42?"rapid":run.attack>=20?"double":"single";$("feedback").textContent=t("pickupPower",{count:gain});addBurst(entry.x,.84,"#63ffd8",20)}
    else if(entry.kind==="shield"&&(same||entry.collecting)){if(entry.shield<=0){run.attack=Math.min(999,run.attack+entry.reward);run.charge=Math.min(100,run.charge+entry.reward);run.weapon=run.attack>=42?"rapid":run.attack>=20?"double":"single";$("feedback").textContent=t("pickupPower",{count:entry.reward});addBurst(entry.x,.84,"#6ceaff",20)}else{const loss=Math.ceil(entry.shield);recordCoreDamage(loss,entry.lane,"shield");$("feedback").textContent=t("enemyCollision",{count:loss});addBurst(entry.x,.84,"#ff637e",18)}}
    else if(entry.kind==="bomb"){const loss=Math.ceil(entry.hp);if(loss>0){recordCoreDamage(loss,entry.lane,"bomb");$("feedback").textContent=t("bombDamage",{count:loss});addBurst(entry.x,.84,"#ff9e45",24)}}
    else if(entry.kind==="enemy"){const loss=entry.boss?run.core:same?Math.max(2,Math.ceil(entry.hp)):Math.max(3,Math.ceil(entry.hp*.42));recordCoreDamage(loss,entry.lane,same?"lane_hit":"lane_leak");$("feedback").textContent=t(same?"enemyCollision":"enemyLeak",{count:loss});addBurst(entry.x,.84,"#ff637e",entry.boss?34:18)}
    updatePeak()
  }
  function update(dt){
    if(!run||run.paused||run.finished)return;
    run.time-=dt;run.fireClock+=dt;if(run.overdrive>0)run.overdrive=Math.max(0,run.overdrive-dt);if(run.feedbackLock>0){run.feedbackLock=Math.max(0,run.feedbackLock-dt);$("feedback").textContent=t("overdriveUsed")}
    const interval=fireInterval();while(run.fireClock>=interval&&run.units.length<80)launch();
    for(const entry of run.encounters)if(!entry.resolved){if(entry.collecting){entry.y+=(1.15+(.84-entry.y)*1.8)*dt;entry.x+=(run.aimX-entry.x)*Math.min(1,dt*8)}else{const advanceFactor=entry.boss&&entry.y>=.1?.18:1;entry.y+=run.stage.layout.speed*dt*advanceFactor;entry.x=laneCenters[entry.lane]}}
    for(const unit of run.units){
      unit.y+=unit.vy*dt;let hit=null,best=.055;
      for(const entry of run.encounters)if(!entry.resolved&&entry.lane===unit.lane&&!unit.passed?.includes(entry.id)&&entry.y<unit.y&&entry.y>.04&&unit.y-entry.y<best){best=unit.y-entry.y;hit=entry}
      if(hit)hitEncounter(unit,hit);else if(unit.y<=.035)unit.dead=true
    }
    for(const entry of run.encounters)if(!entry.resolved&&entry.y>=.835)resolveEncounter(entry);
    run.units=run.units.filter((unit)=>!unit.dead&&unit.y>0);run.enemies=run.encounters.filter(entry=>entry.kind==="enemy"&&!entry.resolved);const firstActive=run.encounters.filter(entry=>!entry.resolved).reduce((min,entry)=>Math.min(min,entry.row),run.totalWaves);run.wave=Math.min(run.totalWaves,firstActive+1);if(run.wave!==run.lastTrackedWave){run.lastTrackedWave=run.wave;track("wave_reached",{stage:run.stage.n,wave:run.wave})}updatePeak();announceOverdriveReady();
    for(const particle of run.particles){particle.x+=particle.vx*dt;particle.y+=particle.vy*dt;particle.vy+=.025*dt;particle.life-=dt}run.particles=run.particles.filter((particle)=>particle.life>0);
    for(const text of run.texts){text.y-=.05*dt;text.life-=dt}run.texts=run.texts.filter((text)=>text.life>0);
    if(run.feedbackLock>0)$("feedback").textContent=t("overdriveUsed");if(run.encounters.every(entry=>entry.resolved)&&(!run.stage.boss||run.bossDefeated))finish(true);else if(run.core<=0||run.time<=0)finish(false);updateHud();
  }
  function rounded(x,y,w,h,r){const radius=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+radius,y);ctx.arcTo(x+w,y,x+w,y+h,radius);ctx.arcTo(x+w,y+h,x,y+h,radius);ctx.arcTo(x,y+h,x,y,radius);ctx.arcTo(x,y,x+w,y,radius);ctx.closePath()}
  function drawCover(image,x,y,w,h){if(!image?.naturalWidth)return;const scale=Math.max(w/image.naturalWidth,h/image.naturalHeight),sw=w/scale,sh=h/scale,sx=(image.naturalWidth-sw)/2,sy=(image.naturalHeight-sh)/2;ctx.drawImage(image,sx,sy,sw,sh,x,y,w,h)}
  function drawImageCentered(image,x,y,size,glow=""){if(!image?.naturalWidth)return;ctx.save();ctx.translate(x,y);if(glow){ctx.shadowColor=glow;ctx.shadowBlur=size*.45}ctx.drawImage(image,-size/2,-size/2,size,size);ctx.restore()}
  function drawAtlasCell(image,column,row,x,y,size,glow=""){if(!image?.naturalWidth)return false;const sw=image.naturalWidth/2,sh=image.naturalHeight/2;ctx.save();ctx.translate(x,y);if(glow){ctx.shadowColor=glow;ctx.shadowBlur=size*.34}ctx.drawImage(image,column*sw,row*sh,sw,sh,-size/2,-size/2,size,size);ctx.restore();return true}
  function drawBombEncounter(x,y,size){
    ctx.save();ctx.translate(x,y);ctx.shadowColor="#ff684f";ctx.shadowBlur=size*.35;
    const outer=size*.45,inner=size*.29;
    ctx.fillStyle="#35111c";ctx.strokeStyle="#ff9b55";ctx.lineWidth=Math.max(3,size*.065);
    ctx.beginPath();
    for(let point=0;point<16;point+=1){
      const angle=-Math.PI/2+point*Math.PI/8,radius=point%2?inner:outer;
      const px=Math.cos(angle)*radius,py=Math.sin(angle)*radius;
      if(point===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
    }
    ctx.closePath();ctx.fill();ctx.stroke();
    ctx.shadowBlur=size*.16;ctx.fillStyle="#ffcf5a";ctx.beginPath();ctx.arc(0,0,size*.13,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#fff4bc";ctx.lineWidth=Math.max(2,size*.045);ctx.beginPath();ctx.arc(0,0,size*.21,-Math.PI*.8,Math.PI*.28);ctx.stroke();
    ctx.restore();
  }
  function drawUpgradeBars(w,h,d,px,py){for(const entry of run.encounters)if(!entry.resolved&&entry.kind==="shield"&&entry.y>-.12&&entry.y<.9){const x=px(entry.x),y=py(entry.y),size=Math.max(44,d*.09),barW=size*.92,ratio=entry.maxShield?Math.max(0,entry.shield/entry.maxShield):0;ctx.save();ctx.fillStyle="#061225dd";rounded(x-barW/2,y+size*.46,barW,Math.max(6,d*.012),4);ctx.fill();if(ratio>0){ctx.fillStyle="#63eaff";rounded(x-barW/2+2,y+size*.46+2,(barW-4)*ratio,Math.max(2,d*.012-4),3);ctx.fill()}if(entry.collecting){ctx.strokeStyle="#ffe176";ctx.lineWidth=Math.max(2,d*.004);ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(x,y+size*.35);ctx.lineTo(px(run.aimX),py(.84));ctx.stroke()}ctx.restore()}}
  function drawFirstSwitchCue(w,h,d,px){const priority=priorityThreat();if(!priority||run.wave!==1||priority.lane===run.lane||run.resolved>=3)return;const x=px(laneCenters[priority.lane]),half=w*.13,pulse=.72+.28*Math.sin(performance.now()/180);ctx.save();ctx.globalAlpha=pulse;ctx.strokeStyle="#ffe176";ctx.fillStyle="#ffe176";ctx.lineWidth=Math.max(3,d*.006);ctx.setLineDash([10,7]);ctx.strokeRect(x-half+5,h*.085,Math.max(10,half*2-10),h*.775);ctx.setLineDash([]);ctx.font=`900 ${Math.max(18,d*.04)}px sans-serif`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("↕",x,h*.15);ctx.restore()}
  function draw(){
    if(!run)return;const w=canvas.width,h=canvas.height,d=Math.min(w,h),px=(x)=>x*w,py=(y)=>y*h;ctx.clearRect(0,0,w,h);drawCover(images.arena,0,0,w,h);ctx.fillStyle="#03152a45";ctx.fillRect(0,0,w,h);
    const activeBoss=run.encounters.find(entry=>entry.boss&&!entry.resolved),waveRatio=Math.max(0,Math.min(1,run.resolved/run.encounters.length)),barRatio=activeBoss&&run.wave>=run.totalWaves?Math.max(0,Math.min(1,activeBoss.hp/activeBoss.maxHp)):waveRatio;rounded(w*.19,h*.025,w*.62,h*.038,12);ctx.fillStyle="#071326dd";ctx.fill();rounded(w*.195,h*.031,w*.61*barRatio,h*.026,10);ctx.fillStyle=run.wave>=run.totalWaves&&run.stage.boss?"#ff647e":"#64efd5";ctx.fill();if(run.wave>=run.totalWaves&&run.stage.boss){ctx.fillStyle="#fff";ctx.font=`900 ${Math.max(11,d*.019)}px sans-serif`;ctx.textAlign="center";ctx.textBaseline="top";ctx.fillText(t("bossWave"),w*.5,h*.065)}
    ctx.save();for(let lane=0;lane<3;lane+=1){const x=px(laneCenters[lane]),half=w*.13;ctx.fillStyle=lane===run.lane?"#1a6b8052":"#081c3440";ctx.fillRect(x-half,h*.075,half*2,h*.80);ctx.strokeStyle=lane===run.lane?"#7bffe5":"#73a9bf66";ctx.lineWidth=lane===run.lane?Math.max(3,d*.006):Math.max(1,d*.0025);ctx.beginPath();ctx.moveTo(x-half,h*.075);ctx.lineTo(x-half,h*.875);ctx.moveTo(x+half,h*.075);ctx.lineTo(x+half,h*.875);ctx.stroke()}ctx.restore();
    for(const entry of run.encounters)if(!entry.resolved&&entry.y>-.12&&entry.y<.9){const x=px(entry.x),y=py(entry.y),size=entry.boss?Math.max(64,d*.19):Math.max(44,d*(entry.champion?.115:.09));ctx.save();if(entry.kind==="enemy"){drawImageCentered(entry.champion?images.boss:images.enemy,x,y,size,entry.boss?"#ffcf54":entry.champion?"#ff4f83":"#a66cff")}else if(entry.kind==="shield"){drawAtlasCell(images.spirits,1,1,x,y,size,"#63eaff");ctx.strokeStyle=entry.shield>0?"#67eaff":"#ffe176";ctx.lineWidth=Math.max(3,d*.006);ctx.beginPath();ctx.arc(x,y,size*.56,0,Math.PI*2);ctx.stroke()}else if(entry.kind==="power"){drawAtlasCell(images.spirits,1,0,x,y,size,"#62ffd9")}else{drawBombEncounter(x,y,size)}ctx.fillStyle="#fff";ctx.strokeStyle="#061225";ctx.lineWidth=Math.max(3,d*.006);ctx.font=`900 ${Math.max(12,d*.022)}px sans-serif`;ctx.textAlign="center";ctx.textBaseline="bottom";const label=entry.kind==="power"?`+${entry.stored}/${entry.value}`:entry.kind==="shield"?`${Math.ceil(entry.shield)} · +${entry.reward}`:`${Math.ceil(entry.hp)}`;ctx.strokeText(label,x,y-size*.58);ctx.fillText(label,x,y-size*.58);ctx.restore()}
    drawFirstSwitchCue(w,h,d,px);
    drawUpgradeBars(w,h,d,px,py);
    const spiritCells=[[1,0],[0,1],[1,1]];
    for(const unit of run.units){const x=px(unit.x),y=py(unit.y),size=Math.max(14,d*.028),cell=spiritCells[unit.sprite%spiritCells.length],drawn=drawAtlasCell(images.spirits,cell[0],cell[1],x,y,size,unit.hue===48?"#ffe369":"#64ebff");if(!drawn){ctx.fillStyle="#baf8ff";ctx.beginPath();ctx.arc(x,y,size*.22,0,Math.PI*2);ctx.fill()}}
    for(const particle of run.particles){ctx.globalAlpha=Math.max(0,particle.life);ctx.fillStyle=particle.color;ctx.beginPath();ctx.arc(px(particle.x),py(particle.y),Math.max(2,d*.006*particle.life),0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;
    for(const text of run.texts){ctx.globalAlpha=Math.max(0,text.life);ctx.fillStyle=text.color;ctx.font=`900 ${Math.max(13,d*.026)}px sans-serif`;ctx.textAlign="center";ctx.fillText(text.text,px(text.x),py(text.y))}ctx.globalAlpha=1;
    const lx=px(run.aimX),ly=py(.91);drawAtlasCell(images.spirits,0,0,lx,ly,Math.max(60,d*.17),run.overdrive>0?"#ffe273":"#58e8ff");drawImageCentered(images.fox,lx-Math.max(34,d*.09),ly+d*.012,Math.max(34,d*.085),"#ffd66b");ctx.fillStyle="#fff";ctx.strokeStyle="#061225";ctx.lineWidth=Math.max(3,d*.006);ctx.font=`900 ${Math.max(15,d*.026)}px sans-serif`;ctx.textAlign="center";ctx.strokeText(`${t("attackPower")} ${Math.round(run.attack)}`,lx,ly-d*.12);ctx.fillText(`${t("attackPower")} ${Math.round(run.attack)}`,lx,ly-d*.12);
  }
  function ensureVisibleTick(){if(visibleTick)return;visibleTick=setInterval(()=>{if(!run||run.finished||run.paused||document.hidden||currentScreen!=="battle"||activeModal())return;const now=performance.now(),elapsed=now-lastTime;if(elapsed<200)return;lastTime=now;update(Math.min(1,elapsed/1000||0));draw();if(!run.finished&&!run.paused&&!raf)raf=requestAnimationFrame(frame)},250)}
  function frame(now){raf=0;if(!run||run.finished||run.paused)return;if(document.hidden){suspendForLifecycle();return}const dt=Math.min(.04,(now-lastTime)/1000||0);lastTime=now;update(dt);draw();if(!run.finished&&!run.paused)raf=requestAnimationFrame(frame)}
  function resizeCanvas(){const rect=canvas.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1),width=Math.max(1,Math.round(rect.width*dpr)),height=Math.max(1,Math.round(rect.height*dpr));if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;draw()}}
  new ResizeObserver(resizeCanvas).observe(canvas);
  function setLane(value,announce=false){if(!run||run.paused||run.finished)return false;const lane=Math.max(0,Math.min(2,Math.round(Number(value))));if(lane===run.lane)return true;const fromLane=run.lane;run.lane=lane;run.aimX=laneCenters[lane];addBurst(run.aimX,.86,"#72f4d8",10);track("lane_switch",{stage:run.stage.n,wave:run.wave,from_lane:fromLane+1,to_lane:lane+1});if(announce)$("feedback").textContent=t("laneReady",{lane:lane+1});updateHud(true);draw();return true}
  function aimFromEvent(event){if(!run||run.paused||run.finished)return;const rect=canvas.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width,lane=laneCenters.reduce((best,center,index)=>Math.abs(center-x)<Math.abs(laneCenters[best]-x)?index:best,0);setLane(lane,true)}
  let arenaPointerId=null;
  function clearArenaPointer(){
    if(arenaPointerId===null)return;
    if(canvas.hasPointerCapture?.(arenaPointerId))canvas.releasePointerCapture?.(arenaPointerId);
    arenaPointerId=null;
  }
  canvas.addEventListener("pointerdown",(event)=>{
    if(!event.isPrimary||arenaPointerId!==null)return;
    arenaPointerId=event.pointerId;
    canvas.focus({preventScroll:true});
    try{canvas.setPointerCapture?.(event.pointerId)}catch{/* synthetic/retired pointer */}
    aimFromEvent(event);
  });
  canvas.addEventListener("pointermove",(event)=>{if(event.pointerId===arenaPointerId&&(event.buttons||event.pointerType==="touch"))aimFromEvent(event)});
  canvas.addEventListener("pointerup",(event)=>{if(event.pointerId===arenaPointerId)clearArenaPointer()});
  canvas.addEventListener("pointercancel",(event)=>{if(event.pointerId===arenaPointerId)clearArenaPointer()});
  canvas.addEventListener("lostpointercapture",(event)=>{if(event.pointerId===arenaPointerId)arenaPointerId=null});
  const held=new Set();window.addEventListener("keydown",(event)=>{const arenaOwnsInput=event.target===canvas;if(arenaOwnsInput&&["ArrowLeft","ArrowRight","a","A","d","D"].includes(event.key)&&currentScreen==="battle"&&!activeModal()){event.preventDefault();if(!event.repeat){const right=["ArrowRight","d","D"].includes(event.key);setLane(run.lane+(right?1:-1),true)}held.add(event.key)}if(arenaOwnsInput&&event.key===" "&&currentScreen==="battle"&&!activeModal()){event.preventDefault();activateOverdrive()}if(event.key==="Escape"&&!event.defaultPrevented&&currentScreen==="battle"&&!activeModal())openLeave()});window.addEventListener("keyup",(event)=>held.delete(event.key));
  function suspendForLifecycle(){held.clear();clearArenaPointer();if(!run||run.finished||run.paused||currentScreen!=="battle")return;lifecyclePaused=true;run.paused=true;stopLoop()}
  function resumeFromLifecycle(){held.clear();if(!lifecyclePaused||document.hidden)return;lifecyclePaused=false;if(!run||run.finished||currentScreen!=="battle"||activeModal())return;run.paused=false;ensureVisibleTick();resumeLoop()}
  function reclaimVisibleForeground(event){if(!event?.isTrusted||document.hidden)return false;if(windowFocused)return true;windowFocused=true;resumeFromLifecycle();return true}
  window.addEventListener("blur",()=>{windowFocused=false;held.clear();clearArenaPointer()});window.addEventListener("focus",()=>{windowFocused=true;resumeFromLifecycle()});window.addEventListener("pagehide",suspendForLifecycle);window.addEventListener("pageshow",resumeFromLifecycle);document.addEventListener("visibilitychange",()=>document.hidden?suspendForLifecycle():resumeFromLifecycle());
  $("battle").addEventListener("pointerdown",reclaimVisibleForeground,true);$("battle").addEventListener("keydown",reclaimVisibleForeground,true);
  function activateOverdrive(){if(!run||run.paused||run.finished)return false;if(run.charge<100){$("feedback").textContent=t("overdriveNeed",{charge:Math.floor(run.charge)});return false}run.charge=0;run.overdrive=3.6;run.feedbackLock=.7;run.readyCueShown=false;$("feedback").classList.remove("ready-cue");$("overdrive").setAttribute("aria-label",t("overdriveActive"));$("feedback").textContent=t("overdriveUsed");updateHud(true);addBurst(run.aimX,.86,"#ffe273",24);window.WonderSound?.play?.("success");return true}
  $("overdrive").addEventListener("click",activateOverdrive);

  function activeModal(){return[$("leave"),$("tutorial"),$("result")].find((modal)=>!modal.hidden)||null}
  function modalButtons(modal){return[...modal.querySelectorAll("button:not([hidden]):not(:disabled)")]}
  function openModal(modal,focusTarget){clearArenaPointer();modalReturnFocus=document.activeElement;if(run)run.paused=true;stopLoop();modal.hidden=false;$("battleLive").inert=true;requestAnimationFrame(()=>(focusTarget||modalButtons(modal)[0])?.focus())}
  function closeModal(modal,restore=true){modal.hidden=true;$("battleLive").inert=false;if(run&&!run.finished&&!lifecyclePaused&&!document.hidden){run.paused=false;ensureVisibleTick();resumeLoop()}if(restore)(modalReturnFocus?.isConnected?modalReturnFocus:$("battleBack"))?.focus();modalReturnFocus=null}
  document.addEventListener("keydown",(event)=>{const modal=activeModal();if(!modal)return;if(event.key==="Tab"){const buttons=modalButtons(modal),first=buttons[0],last=buttons.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}}if(event.key==="Escape"&&modal===$("leave")){event.preventDefault();closeModal(modal)}});
  function openTutorial(){if(!run||run.finished)return;openModal($("tutorial"),$("tutorialDone"))}
  $("tutorialDone").addEventListener("click",()=>{save.tutorialSeen=true;persist();track("tutorial_complete",{stage:run?.stage.n});closeModal($("tutorial"))});
  function openLeave(){if(!run||run.finished||activeModal())return;openModal($("leave"),$("continueBattle"))}
  function finish(won){
    if(!run||run.finished)return;clearArenaPointer();run.finished=true;run.won=Boolean(won);run.paused=true;resultDecisionCommitted=false;track(won?"mission_complete":"mission_fail",{stage:run.stage.n,wave:run.wave,core:Math.max(0,Math.ceil(run.core)),result:won?"success":"failure"});stopLoop();const remaining=Math.max(0,Math.ceil(run.time)),stars=won?1+(remaining>run.stage.time*.25?1:0)+(run.core===run.maxCore?1:0):0,earned=won?3+stars+run.stage.chapter:0;
    if(won){save.stars[run.stage.n]=Math.max(Number(save.stars[run.stage.n])||0,stars);save.unlocked=Math.max(save.unlocked,Math.min(30,run.stage.n+1));save.shards=Math.min(9999,save.shards+earned);persist()}
    const decisiveLane=run.laneDamage.reduce((best,damage,index)=>damage>run.laneDamage[best]?index:best,0),failureRecap=run.coreHits>0?t("failureRecapLane",{lane:decisiveLane+1,damage:run.laneDamage[decisiveLane]}):t("failureRecapTimeout",{wave:run.wave});
    $("resultKicker").textContent=won?`${t("shardsEarned")} +${earned}`:t("missionFailedKicker");$("resultTitle").textContent=t(won?"missionComplete":"missionFailed");$("resultText").textContent=won?t("victoryText"):failureRecap;$("resultStats").innerHTML=`<span><b>${t("strength")}</b><strong>${run.peak}</strong></span><span><b>${t("coreHits")}</b><strong>${Math.max(0,Math.ceil(run.core))}/${run.maxCore}</strong></span><span><b>${t("stars")}</b><strong>${"★".repeat(stars)}${"☆".repeat(3-stars)}</strong></span>`;[$("retry"),$("resultStage"),$("nextMission")].forEach((button)=>{button.disabled=false;button.classList.remove("primary")});$("nextMission").hidden=false;$("nextMission").disabled=!won||run.stage.n>=30;const primary=$("nextMission").disabled?$("resultStage"):$("nextMission");primary.classList.add("primary");$("result").hidden=false;$("battleLive").hidden=true;$("battleLive").inert=true;requestAnimationFrame(()=>primary.focus());window.WonderSound?.play?.(won?"win":"wrong")
  }
  function commitResultDecision(action){if(resultDecisionCommitted||$("result").hidden)return false;resultDecisionCommitted=true;[$("retry"),$("resultStage"),$("nextMission")].forEach((button)=>{button.disabled=true});action();return true}
  $("battleBack").addEventListener("click",openLeave);$("battleHelp").addEventListener("click",openTutorial);$("continueBattle").addEventListener("click",()=>closeModal($("leave")));$("leaveStage").addEventListener("click",()=>{$("leave").hidden=true;$("battleLive").inert=false;track("result_stage",{stage:run?.stage.n,source:"leave"});run=null;showScreen("stage")});$("retry").addEventListener("click",()=>commitResultDecision(()=>{track("result_retry",{stage:run.stage.n});startBattle(run.stageIndex)}));$("resultStage").addEventListener("click",()=>commitResultDecision(()=>{track("result_stage",{stage:run.stage.n,source:"result"});$("result").hidden=true;$("battleLive").inert=false;run=null;showScreen("stage")}));$("nextMission").addEventListener("click",()=>commitResultDecision(()=>{track("result_next",{stage:run.stage.n,next_stage:Math.min(30,run.stage.n+1)});startBattle(Math.min(29,run.stageIndex+1))}));
  function loadImages(){return Promise.all(Object.entries(imageSources).map(([key,src])=>new Promise((resolve)=>{const image=new Image();images[key]=image;image.onload=image.onerror=resolve;image.src=src})))}
  Promise.all([loadImages(),new Promise((resolve)=>setTimeout(resolve,350))]).then(()=>{$("loadingFill").style.width="100%";setTimeout(()=>{$("loading").hidden=true;showScreen("main")},160)});
  applyLocale();
  window.__animalPrismBattalionTest={
    stages,startBattle,setLane,showMain(){run=null;showScreen("main")},setAim(value){if(run){const x=Math.max(0,Math.min(1,Number(value))),lane=laneCenters.reduce((best,center,index)=>Math.abs(center-x)<Math.abs(laneCenters[best]-x)?index:best,0);setLane(lane)}},activateOverdrive,
    advance(seconds,step=1/60){const iterations=Math.ceil(seconds/step);for(let i=0;i<iterations&&run&&!run.finished;i+=1)update(step);draw()},
    configureEncounter(id,patch){if(!run)return null;const entry=run.encounters.find(item=>item.id===id)||run.encounters[Math.max(0,Math.trunc(Number(id))||0)];if(entry)Object.assign(entry,patch);return entry?{...entry}:null},injectUnits(units){if(run)run.units=units.map((unit,index)=>({x:laneCenters[unit.lane??run.lane],lane:unit.lane??run.lane,y:.83,damage:run.attack,vy:-.72,hue:188,sprite:index%3,passed:[],...unit}))},setTime(seconds){if(run)run.time=Number(seconds)},clearEnemies(){if(run)for(const entry of run.encounters)if(entry.kind==="enemy")entry.resolved=true},finish,
    grantProgress(unlocked=3,shards=30){save.unlocked=Math.max(1,Math.min(30,unlocked));save.shards=Math.max(save.shards,shards);persist();renderStage();renderLab()},setUpgrades(rate=0,power=0,armor=0){save.upgrades=normalizeSave({upgrades:{rate,power,armor}}).upgrades;persist();renderLab()},resetSave(){save=defaultSave();persist();applyLocale()},
    snapshot(){return{locale,screen:currentScreen,windowFocused,lifecyclePaused,rafActive:Boolean(raf),save:JSON.parse(JSON.stringify(save)),run:run&&{stageIndex:run.stageIndex,stageTime:run.stage.time,time:run.time,core:run.core,maxCore:run.maxCore,wave:run.wave,totalWaves:run.totalWaves,bossDefeated:run.bossDefeated,lane:run.lane,aimX:run.aimX,attack:run.attack,weapon:run.weapon,charge:run.charge,overdrive:run.overdrive,readyCueShown:run.readyCueShown,peak:run.peak,coreHits:run.coreHits,laneDamage:[...run.laneDamage],resolved:run.resolved,units:run.units.map((unit)=>({...unit})),enemies:run.enemies.map((enemy)=>({...enemy})),encounters:run.encounters.map((entry)=>({...entry})),gates:run.gates.map((entry)=>({...entry})),paused:run.paused,finished:run.finished,won:run.won}}}
  };
})();
