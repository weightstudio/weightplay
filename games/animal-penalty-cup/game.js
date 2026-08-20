(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const GAME_ID = "animal-penalty-cup";
  const GAME_VERSION = 3;
  const INTERFACE_VERSION = 6;
  const LOCALES = ["en","zh-Hant","zh-Hans","ja","ko","es","pt-BR","fr","de","it","ru","hi","ar"];
  const LOCALE_LABELS = {en:"English","zh-Hant":"繁體中文","zh-Hans":"简体中文",ja:"日本語",ko:"한국어",es:"Español","pt-BR":"Português",fr:"Français",de:"Deutsch",it:"Italiano",ru:"Русский",hi:"हिन्दी",ar:"العربية"};
  const OPPONENTS = [
    "Bramble Badgers","Brook Beavers","Clover Rabbits","Pine Martens","Mossy Bears",
    "Reed Raccoons","River Herons","Pebble Pikas","Willow Deer","Kingfisher Crew",
    "Canyon Coyotes","Copper Lynx","Sunstone Ibex","Echo Bats","Mesa Meerkats",
    "Moon Moths","Dusk Owls","Starlight Stoats","Lantern Lemurs","Velvet Foxes",
    "Aurora Seals","Frost Hares","Prism Penguins","Comet Caribou","Sky Otters",
    "Crown Capybaras","Royal Ravens","Golden Gazelles","Firefly Falcons","Acorn All-Stars",
  ];
  const ZONES = [
    {row:"rowTop",col:"colLeft",x:32,y:31,rotate:-24}, {row:"rowTop",col:"colCenter",x:50,y:31,rotate:0}, {row:"rowTop",col:"colRight",x:68,y:31,rotate:24},
    {row:"rowBottom",col:"colLeft",x:32,y:51,rotate:-14}, {row:"rowBottom",col:"colCenter",x:50,y:51,rotate:0}, {row:"rowBottom",col:"colRight",x:68,y:51,rotate:14},
  ];
  const LEVELS = Array.from({length:30},(_,index) => {
    const chapter = Math.floor(index / 5);
    return {
      index, chapter, opponent: OPPONENTS[index],
      powerSpeed: .56 + chapter * .105 + (index % 5) * .018,
      sweetStart: Math.max(.62, .70 - chapter * .012),
      sweetWidth: Math.max(.13, .20 - chapter * .012),
      keeperRead: .08 + chapter * .105 + (index % 5) * .012,
      opponentAccuracy: .52 + chapter * .06 + (index % 5) * .012,
      cueMs: Math.max(560, 1260 - chapter * 118 - (index % 5) * 16),
      feint: chapter >= 3,
    };
  });
  const safeStorage = {
    get(key,fallback=""){try{return localStorage.getItem(key)??fallback}catch{return fallback}},
    set(key,value){try{localStorage.setItem(key,String(value));return true}catch{return false}},
  };
  const SAVE_KEY = "weightplay_animal_penalty_cup_v1";
  const LOCALE_KEY = "weightPlayLocale";
  const defaultSave = () => ({unlocked:1,completed:Array(30).fill(false),stars:Array(30).fill(0),bestDiff:Array(30).fill(null),tutorialSeen:false});
  const readSave = () => {try{const raw=JSON.parse(safeStorage.get(SAVE_KEY,"null"));if(!raw)return defaultSave();return{...defaultSave(),...raw,completed:Array.from({length:30},(_,i)=>Boolean(raw.completed?.[i])),stars:Array.from({length:30},(_,i)=>Math.max(0,Math.min(3,Number(raw.stars?.[i])||0))),bestDiff:Array.from({length:30},(_,i)=>Number.isFinite(raw.bestDiff?.[i])?raw.bestDiff[i]:null),unlocked:Math.max(1,Math.min(30,Number(raw.unlocked)||1))}}catch{return defaultSave()}};
  let save = readSave();
  let lang = normalizeLocale(safeStorage.get(LOCALE_KEY,"en"));
  let selectedStage = Math.max(0,save.unlocked-1);
  let match = null;
  let raf = 0;
  let lastFrame = 0;
  let activeTimer = null;
  let paused = false;
  let windowFocused = true;
  let modalOwner = null;
  let resultClaimed = false;
  let soundEnabled = true;
  let inputClass = "system";
  let audioContext = null;

  function normalizeLocale(value){const aliases={"zh-tw":"zh-Hant","zh-cn":"zh-Hans","pt-br":"pt-BR"};const normalized=aliases[String(value).toLowerCase()]||value;return LOCALES.includes(normalized)?normalized:"en"}
  function dictionary(){return window.ANIMAL_PENALTY_LOCALES?.[lang]||window.ANIMAL_PENALTY_LOCALES?.en||{}}
  function t(key,vars={}){let value=dictionary()[key]??window.ANIMAL_PENALTY_LOCALES?.en?.[key]??key;Object.entries(vars).forEach(([name,item])=>{value=String(value).replaceAll(`{${name}}`,String(item))});return value}
  function localizedCampaign(key,index){return dictionary()[key]?.[index]??window.ANIMAL_PENALTY_LOCALES.en[key]?.[index]??""}
  function opponentName(index){return lang==="en"?OPPONENTS[index]:t("teamName",{n:index+1})}
  function persist(){safeStorage.set(SAVE_KEY,JSON.stringify(save))}
  function noteInput(event){if(event?.pointerType)inputClass=event.pointerType;else if(event?.type?.startsWith("key"))inputClass="keyboard";else inputClass="mouse"}
  function viewportBucket(){const w=innerWidth,h=innerHeight;if(h<=430)return"short-landscape";if(w<=480)return"phone";if(w<=920)return h>=w?"tablet-portrait":"tablet-landscape";return"desktop"}
  function track(name,data={}){try{const allowedOutcome=["goal","saved","wide","conceded","late","win","loss"];const payload={game_id:GAME_ID,game_version:GAME_VERSION,interface_version:INTERFACE_VERSION,locale:lang,viewport_bucket:viewportBucket(),input_class:inputClass,match:Math.max(1,Math.min(30,(match?.stage??selectedStage)+1))};if(allowedOutcome.includes(data.outcome))payload.outcome=data.outcome;if(Number.isInteger(data.zone))payload.zone=Math.max(1,Math.min(6,data.zone+1));if(["low","good","perfect","high"].includes(data.power))payload.power=data.power;if(Number.isInteger(data.round))payload.round=Math.max(1,Math.min(8,data.round));if(Number.isInteger(data.stars))payload.stars=Math.max(0,Math.min(3,data.stars));window.WeightPlayAnalytics?.track?.(name,payload);window.WonderAnalytics?.track?.(name,payload)}catch{}}
  function beep(frequency=440,duration=.07,type="sine"){if(!soundEnabled||window.WonderSound?.isMuted?.())return;try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;audioContext ||= new Audio();if(audioContext.state==="suspended")audioContext.resume();const oscillator=audioContext.createOscillator(),gain=audioContext.createGain();oscillator.type=type;oscillator.frequency.value=frequency;gain.gain.setValueAtTime(.045,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);oscillator.connect(gain).connect(audioContext.destination);oscillator.start();oscillator.stop(audioContext.currentTime+duration)}catch{}}
  function setSound(enabled){soundEnabled=Boolean(enabled);window.WonderSound?.setMuted?.(!soundEnabled);updateSoundButtons();beep(620)}
  function updateSoundButtons(){const label=t(soundEnabled?"soundOn":"soundOff");["pauseSoundBtn"].forEach(id=>{const node=$(id);if(!node)return;node.textContent=label;node.setAttribute("aria-pressed",String(soundEnabled))})}

  function setScreen(screen){
    $("mainGroup").hidden=screen!=="main";$("stageScreen").hidden=screen!=="stage";$("battleScreen").hidden=screen!=="battle";$("generalReserve").hidden=screen==="main";
    document.body.dataset.screen=screen;document.body.classList.toggle("wp-active-play",screen!=="main");document.body.classList.toggle("wp-logical-stage-active",screen==="stage");document.body.classList.toggle("wp-logical-battle-active",screen==="battle");
    if(screen!=="battle")closeAllBattleModals(false);window.dispatchEvent(new Event("weightplay:shell-sync"));window.dispatchEvent(new Event("weightplay:stage-sync"));window.dispatchEvent(new Event("weightplay:battle-sync"));
  }
  function showMain(focus=false){cancelTimer();paused=false;setScreen("main");renderMain();if(focus)requestAnimationFrame(()=>$("startBtn").focus({preventScroll:true}))}
  function showStage(focus=false,keepSelection=false){cancelTimer();paused=false;if(!keepSelection)selectedStage=Math.max(0,save.unlocked-1);setScreen("stage");renderStage();if(focus)requestAnimationFrame(()=>$("stageBackBtn").focus({preventScroll:true}))}
  window.__animalPenaltyCupNavigateMain=()=>showMain(true);
  window.__animalPenaltyCupNavigateBattle=()=>requestLeave();
  function renderMain(){const done=save.completed.filter(Boolean).length,stars=save.stars.reduce((sum,n)=>sum+n,0);$("mainProgress").textContent=t("progress",{done,stars})}
  function renderStage(){
    const level=LEVELS[selectedStage],rail=$("stageRail"),done=save.completed.filter(Boolean).length;
    $("chapterKicker").textContent=t("chapter",{n:level.chapter+1});$("chapterTitle").textContent=localizedCampaign("chapterNames",level.chapter);$("chapterRule").textContent=localizedCampaign("chapterRules",level.chapter);rail.innerHTML="";rail.dataset.wpStageRecommendation="explicit";
    LEVELS.forEach((item,index)=>{const locked=index>=save.unlocked,selected=index===selectedStage,card=document.createElement("button"),name=opponentName(index);card.type="button";card.className=`stage-card${locked?" locked":""}${selected?" selected is-centered":""}`;card.dataset.stage=String(index);card.dataset.stageIndex=String(index);card.dataset.wpStageRecommended=selected&&!locked?"true":"false";card.setAttribute("aria-disabled",String(locked));card.setAttribute("aria-posinset",String(index+1));card.setAttribute("aria-setsize","30");if(selected)card.setAttribute("aria-current","true");const state=locked?t("locked"):save.completed[index]?t("cleared"):t("opponent",{name});const stars=locked?"":"★".repeat(save.stars[index])+"☆".repeat(3-save.stars[index]);card.innerHTML=`<small>${t("chapter",{n:item.chapter+1})}</small><strong>${t("match",{n:index+1})}</strong><span>${state}</span><span>${name}</span><b class="stars">${stars}</b>`;card.addEventListener("click",event=>{noteInput(event);if(rail.dataset.dragging==="true"||locked)return;selectedStage=index;startMatch(index,"stage")});card.addEventListener("keydown",rejectRepeat);rail.append(card)});
    rail.setAttribute("aria-label",t("stageRailLabel"));$("stageScreen").dataset.completed=String(done);requestAnimationFrame(()=>rail.querySelector(`[data-stage="${selectedStage}"]`)?.scrollIntoView({behavior:"auto",block:"nearest",inline:"center"}));
  }

  function seeded(...values){let x=values.reduce((sum,n,i)=>sum+((Number(n)||0)+17)*(i+11)*2654435761,2166136261)>>>0;x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/4294967295}
  function freshMatch(stage){return{stage,level:LEVELS[stage],phase:"shoot-ready",round:0,player:0,rival:0,playerMarks:[],rivalMarks:[],power:.5,powerDirection:1,holding:false,heldZone:null,lastShot:null,repeats:0,perfectShots:0,saves:0,ended:false,result:null,mutable:false,defendTarget:null,defendChoice:null,startedAt:performance.now(),simTime:0}}
  function startMatch(index,source="stage"){
    cancelTimer();closeAllBattleModals(false);selectedStage=Math.max(0,Math.min(29,index));match=freshMatch(selectedStage);resultClaimed=false;setScreen("battle");renderBattleShell();resetActors();setStatus("shootHint");track("match_start",{round:1});beep(480,.08);requestAnimationFrame(()=>$("battleBackBtn").focus({preventScroll:true}));scheduleFrame();
  }
  function renderBattleShell(){
    $("battleRound").textContent=`${t("match",{n:match.stage+1})} · ${t("round",{n:match.round+1})}`;$("battleOpponent").textContent=opponentName(match.stage);$("playerScore").textContent=match.player;$("rivalScore").textContent=match.rival;$("turnLabel").textContent=t(match.phase.startsWith("defend")||match.phase==="cue-wait"?"defend":"shoot");renderDots();renderGoalZones();
    if(match.phase==="defend-ready"&&Number.isInteger(match.defendTarget))showCue(match.defendTarget,false);
    updatePowerUI()
  }
  function renderDots(){const dots=[];for(let i=0;i<Math.max(5,match.round+(match.round>=5?1:0));i++){dots.push(`<i class="turn-dot ${match.playerMarks[i]||""}" aria-hidden="true"></i>`)}dots.push("<b aria-hidden=\"true\">/</b>");for(let i=0;i<Math.max(5,match.round+(match.round>=5?1:0));i++){dots.push(`<i class="turn-dot ${match.rivalMarks[i]||""}" aria-hidden="true"></i>`)}$("turnDots").innerHTML=dots.join("");$("turnDots").setAttribute("aria-label",t("roundResults",{you:match.player,rival:match.rival}))}
  function zoneLabel(index){const zone=ZONES[index];return t("zoneLabel",{n:index+1,row:t(zone.row),col:t(zone.col)})}
  function renderGoalZones(){const grid=$("goalGrid");grid.innerHTML="";ZONES.forEach((zone,index)=>{const button=document.createElement("button");button.type="button";button.className="goal-zone";button.dataset.zone=String(index);button.dataset.number=String(index+1);button.setAttribute("aria-label",zoneLabel(index));button.disabled=!canChooseZone();button.addEventListener("pointerdown",event=>beginZone(index,event));button.addEventListener("pointerup",event=>releaseZone(index,event));button.addEventListener("pointercancel",cancelHold);button.addEventListener("click",event=>{if(match?.phase==="shoot-ready"&&!match.holding){noteInput(event);match.mutable=true;commitShot(index);return}chooseDefence(index,event)});button.addEventListener("keydown",event=>zoneKeyDown(index,event));button.addEventListener("keyup",event=>zoneKeyUp(index,event));grid.append(button)})}
  function canChooseZone(){return match&&!match.ended&&!paused&&(match.phase==="shoot-ready"||match.phase==="defend-ready")}
  function refreshZoneAvailability(){$("goalGrid").querySelectorAll(".goal-zone").forEach(button=>button.disabled=!canChooseZone())}
  function beginZone(index,event){noteInput(event);if(match?.phase!=="shoot-ready"||paused)return;event.preventDefault();match.holding=true;match.heldZone=index;match.mutable=true;event.currentTarget.classList.add("selected");event.currentTarget.setPointerCapture?.(event.pointerId);setStatus("shootRelease")}
  function releaseZone(index,event){if(match?.phase!=="shoot-ready"||!match.holding||match.heldZone!==index)return;event.preventDefault();commitShot(index)}
  function cancelHold(){if(!match||match.phase!=="shoot-ready")return;match.holding=false;match.heldZone=null;$("goalGrid").querySelectorAll(".goal-zone").forEach(node=>node.classList.remove("selected"));setStatus("shootHint")}
  function zoneKeyDown(index,event){noteInput(event);if((event.key===" "||event.key==="Enter")&&match?.phase==="shoot-ready"){if(event.repeat){event.preventDefault();return}event.preventDefault();match.holding=true;match.heldZone=index;match.mutable=true;event.currentTarget.classList.add("selected");setStatus("shootRelease")}}
  function zoneKeyUp(index,event){if((event.key===" "||event.key==="Enter")&&match?.phase==="shoot-ready"&&match.holding&&match.heldZone===index){event.preventDefault();commitShot(index)}}
  function powerBucket(value){if(value<.46)return"low";if(value<.7)return"good";if(value<=.9)return"perfect";return"high"}
  function commitShot(zone){
    if(match.phase!=="shoot-ready")return;const power=match.power,bucket=powerBucket(power);match.holding=false;match.heldZone=null;match.phase="shot-flight";refreshZoneAvailability();match.mutable=true;
    const repeat=match.lastShot===zone?match.repeats+1:0;match.repeats=repeat;match.lastShot=zone;const repeatedRead=seeded(match.stage,match.round,zone,41)<match.level.keeperRead*Math.min(1,repeat*.7);const keeperZone=repeatedRead?zone:Math.floor(seeded(match.stage,match.round,zone,71)*6);const accuracy=1-Math.abs(power-.82)*1.75;const wide=power<.28||power>.99||accuracy<.32;const same=keeperZone===zone;const corner=zone===0||zone===2;const beatsKeeper=same&&corner&&bucket==="perfect"&&seeded(match.stage,match.round,zone,93)>.38;const goal=!wide&&(!same||beatsKeeper);if(bucket==="perfect")match.perfectShots++;
    track("shot_committed",{zone,power:bucket,round:match.round+1});animateBall(zone);animateKeeper(keeperZone);$("strikerArt").classList.add("kick");schedule(()=>{if(goal){match.player++;match.playerMarks[match.round]="goal";setStatus("goal");beep(930,.14)}else if(wide){match.playerMarks[match.round]="miss";setStatus("wide");beep(170,.14)}else{match.playerMarks[match.round]="miss";setStatus("saved");beep(240,.12)}track("shot_result",{zone,power:bucket,round:match.round+1,outcome:goal?"goal":wide?"wide":"saved"});renderScores();schedule(prepareDefence,720)},560);
  }
  function prepareDefence(){resetActors();match.phase="cue-wait";match.defendChoice=null;$("turnLabel").textContent=t("defend");setStatus("defendHint");refreshZoneAvailability();const target=Math.floor(seeded(match.stage,match.round,match.rival,131)*6);match.defendTarget=target;if(match.level.feint){let fake=(target+1+Math.floor(seeded(match.stage,match.round,151)*5))%6;if(fake===target)fake=(fake+1)%6;showCue(fake,true);setStatus("fakeCue");schedule(()=>{clearCue();schedule(()=>showRealCue(target),180)},420)}else schedule(()=>showRealCue(target),330)}
  function showCue(zone,fake){const point=ZONES[zone],cue=$("cue");cue.style.left=`${point.x}%`;cue.style.top=`${point.y}%`;cue.className=`cue ${fake?"fake":"real"}`;const button=$("goalGrid").querySelector(`[data-zone="${zone}"]`);if(!button)return;button.classList.add(fake?"cue-fake":"cue-real");if(!fake){button.setAttribute("aria-current","true");button.setAttribute("aria-label",t("defendTarget",{zone:zoneLabel(zone)}))}}
  function clearCue(){$("cue").className="cue";$("goalGrid").querySelectorAll(".goal-zone").forEach(button=>{button.classList.remove("cue-fake","cue-real");button.removeAttribute("aria-current");button.setAttribute("aria-label",zoneLabel(Number(button.dataset.zone)))})}
  function showRealCue(zone){if(!match||match.phase!=="cue-wait")return;match.phase="defend-ready";showCue(zone,false);setStatus("realCue");refreshZoneAvailability();schedule(()=>resolveDefence(null),match.level.cueMs)}
  function chooseDefence(index,event){noteInput(event);if(match?.phase!=="defend-ready"||paused)return;event.preventDefault();resolveDefence(index)}
  function resolveDefence(choice){
    if(match.phase!=="defend-ready")return;cancelTimer();clearCue();match.phase="defence-flight";match.defendChoice=choice;refreshZoneAvailability();const target=match.defendTarget,late=choice===null,saveMade=!late&&choice===target;animateBall(target);if(!late)animateKeeper(choice);if(saveMade)match.saves++;if(saveMade)match.rivalMarks[match.round]="save";else{match.rivalMarks[match.round]="concede";match.rival++}
    schedule(()=>{setStatus(saveMade?"saved":late?"tooLate":"conceded");beep(saveMade?720:190,.13);track("defence_result",{zone:choice??undefined,round:match.round+1,outcome:saveMade?"saved":late?"late":"conceded"});renderScores();schedule(finishPair,720)},520)
  }
  function finishPair(){match.round++;const regulationDone=match.round>=5,decided=regulationDone&&match.player!==match.rival,suddenDone=match.round>=8;if(decided||suddenDone){const win=decided?match.player>match.rival:(match.perfectShots+match.saves)>=3;finishMatch(win);return}resetActors();match.phase="shoot-ready";$("battleRound").textContent=`${t("match",{n:match.stage+1})} · ${t("round",{n:match.round+1})}`;$("turnLabel").textContent=t("shoot");setStatus(match.round>=5?"sudden":"shootHint");refreshZoneAvailability()}
  function finishMatch(win){
    cancelTimer();match.ended=true;match.phase="result";match.result=win?"win":"loss";const diff=match.player-match.rival,stars=win?(diff>=3?3:diff>=2?2:1):0;if(win){save.completed[match.stage]=true;save.stars[match.stage]=Math.max(save.stars[match.stage],stars);save.bestDiff[match.stage]=save.bestDiff[match.stage]===null?diff:Math.max(save.bestDiff[match.stage],diff);save.unlocked=Math.max(save.unlocked,Math.min(30,match.stage+2));persist()}
    $("resultKicker").textContent=t("match",{n:match.stage+1});$("resultTitle").textContent=t(win?"winResult":"loseResult");$("resultText").textContent=t(win&&match.stage===29?"finalCopy":win?"winCopy":"loseCopy",{opponent:opponentName(match.stage)});$("resultStars").textContent=win?"★".repeat(stars)+"☆".repeat(3-stars):"—";$("resultDiff").textContent=diff>0?`+${diff}`:String(diff);$("nextBtn").disabled=!win||match.stage>=29;openModal("resultPanel",win&&match.stage<29?"nextBtn":win?"resultStagesBtn":"replayBtn");track("match_result",{outcome:win?"win":"loss",stars});
  }
  function renderScores(){$("playerScore").textContent=match.player;$("rivalScore").textContent=match.rival;renderDots()}
  function resetActors(){clearCue();$("ball").className="ball";$("ball").style.left="47%";$("ball").style.top="76%";$("keeperArt").className="keeper-art ready";$("keeperArt").style.left="50%";$("keeperArt").style.top="30%";$("keeperArt").style.setProperty("--keeper-rotate","0deg");$("strikerArt").classList.remove("kick")}
  function animateBall(zone){const point=ZONES[zone];$("ball").classList.add("flight");$("ball").style.left=`${point.x}%`;$("ball").style.top=`${point.y}%`;$("impact").style.left=`${point.x}%`;$("impact").style.top=`${point.y}%`;$("impact").classList.remove("show");void $("impact").offsetWidth;$("impact").classList.add("show")}
  function animateKeeper(zone){const point=ZONES[zone];$("keeperArt").className="keeper-art dive";$("keeperArt").style.left=`${point.x}%`;$("keeperArt").style.top=`${point.y}%`;$("keeperArt").style.setProperty("--keeper-rotate",`${point.rotate}deg`)}
  function setStatus(key,vars={}){if(key==="realCue"&&match?.phase==="defend-ready"&&Number.isInteger(match.defendTarget)){key="defendTarget";vars={zone:zoneLabel(match.defendTarget)}}$("battleStatus").textContent=t(key,vars)}
  function updatePowerUI(){$("powerNeedle").style.left=`${(match?.power??.5)*100}%`;$("powerValue").textContent=`${Math.round((match?.power??.5)*100)}%`;if(match){$("battleCanvas").style.setProperty("--sweet-start",`${match.level.sweetStart*100}%`);$("battleCanvas").style.setProperty("--sweet-width",`${match.level.sweetWidth*100}%`);document.querySelector(".power-track .sweet").style.left=`${match.level.sweetStart*100}%`;document.querySelector(".power-track .sweet").style.width=`${match.level.sweetWidth*100}%`}}
  function scheduleFrame(){cancelAnimationFrame(raf);lastFrame=performance.now();const tick=now=>{const dt=Math.min(.033,Math.max(0,(now-lastFrame)/1000));lastFrame=now;if(match&&!match.ended&&!paused&&document.body.dataset.screen==="battle"){match.simTime+=dt;if(match.phase==="shoot-ready"){match.power+=match.powerDirection*match.level.powerSpeed*dt;if(match.power>=1){match.power=1;match.powerDirection=-1}else if(match.power<=.12){match.power=.12;match.powerDirection=1}updatePowerUI()}}raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick)}
  function schedule(fn,delay){cancelTimer();activeTimer={fn,remaining:delay,started:performance.now(),id:0};resumeTimer()}
  function resumeTimer(){if(!activeTimer||activeTimer.id||paused||document.hidden||!windowFocused)return;activeTimer.started=performance.now();activeTimer.id=setTimeout(()=>{const fn=activeTimer?.fn;activeTimer=null;fn?.()},activeTimer.remaining)}
  function pauseTimer(){if(!activeTimer?.id)return;clearTimeout(activeTimer.id);activeTimer.remaining=Math.max(0,activeTimer.remaining-(performance.now()-activeTimer.started));activeTimer.id=0}
  function cancelTimer(){if(activeTimer?.id)clearTimeout(activeTimer.id);activeTimer=null}
  function setPaused(next){paused=Boolean(next);if(paused)pauseTimer();else resumeTimer()}

  function openModal(id,focusId){const panel=$(id);if(!panel||modalOwner)return;modalOwner=panel;setPaused(true);panel.hidden=false;panel.inert=false;coverBattle(panel,true);requestAnimationFrame(()=>$(focusId)?.focus({preventScroll:true}))}
  function closeModal(id,restore=true){const panel=$(id);if(!panel)return;panel.hidden=true;panel.inert=true;if(modalOwner===panel)modalOwner=null;coverBattle(panel,false);setPaused(false);if(restore)requestAnimationFrame(()=>$("battleBackBtn").focus({preventScroll:true}))}
  function closeAllBattleModals(resume=true){["resultPanel","leavePanel","restartPanel","pausePanel"].forEach(id=>{const panel=$(id);if(panel){panel.hidden=true;panel.inert=true}});modalOwner=null;coverBattle(null,false);if(resume)setPaused(false)}
  function coverBattle(owner,covered){$("battleCanvas").querySelectorAll(":scope > *").forEach(node=>{if(node===owner||node.classList.contains("modal-layer"))return;node.inert=covered;if(covered)node.setAttribute("aria-hidden","true");else node.removeAttribute("aria-hidden")})}
  function requestLeave(){if(!match||match.ended){showStage(true,true);return}if(!match.mutable&&match.round===0){showStage(true,true);return}openModal("leavePanel","leaveContinueBtn")}
  function requestRestart(){if(!match||match.ended)return;if(!match.mutable&&match.round===0){startMatch(match.stage,"restart");return}openModal("restartPanel","restartContinueBtn")}
  function focusTrap(panel,event){if(event.key==="Escape"){event.preventDefault();if(panel.id==="pausePanel")closeModal("pausePanel",true);else if(panel.id==="leavePanel")closeModal("leavePanel",true);else if(panel.id==="restartPanel")closeModal("restartPanel",true);return}if(event.key!=="Tab")return;const actions=[...panel.querySelectorAll("button:not([disabled]),select")].filter(node=>node.getClientRects().length);if(!actions.length)return;const current=actions.indexOf(document.activeElement),next=event.shiftKey?(current<=0?actions.length-1:current-1):(current>=actions.length-1?0:current+1);event.preventDefault();actions[next].focus({preventScroll:true})}
  function rejectRepeat(event){if((event.key==="Enter"||event.key===" ")&&event.repeat){event.preventDefault();event.stopImmediatePropagation()}}

  function openTutorial(startsMatch){$("tutorialPanel").dataset.startsMatch=String(Boolean(startsMatch));$("tutorialStartBtn").textContent=t(startsMatch?"tutorialStart":"close");$("tutorialPanel").hidden=false;$("tutorialPanel").inert=false;if(!$("stageScreen").hidden)$("stageScreen").inert=true;if(!$("battleScreen").hidden){$("battleScreen").inert=true;setPaused(true)}requestAnimationFrame(()=>$("tutorialStartBtn").focus({preventScroll:true}))}
  function closeTutorial(start){const starts=$("tutorialPanel").dataset.startsMatch==="true";$("tutorialPanel").hidden=true;$("tutorialPanel").inert=true;$("stageScreen").inert=false;$("battleScreen").inert=false;save.tutorialSeen=true;persist();if(start&&starts)startMatch(0,"tutorial");else{setPaused(false);($("stageScreen").hidden?$("helpBtn"):$("stageSettingsBtn"))?.focus({preventScroll:true})}}
  function toggleSettings(name,open){const panel=$(`${name}Settings`),button=$(`${name}SettingsBtn`);panel.hidden=!open;panel.inert=!open;button.setAttribute("aria-expanded",String(open));if(open)requestAnimationFrame(()=>panel.querySelector("button,select")?.focus({preventScroll:true}));else button.focus({preventScroll:true})}
  function applyLocale(){
    document.documentElement.lang=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr";document.title=`${t("title")} | WeightPlay`;$("localeSelect").value=lang;
    document.querySelectorAll("[data-i18n]").forEach(node=>node.textContent=t(node.dataset.i18n));document.querySelectorAll("[data-i18n-aria]").forEach(node=>node.setAttribute("aria-label",t(node.dataset.i18nAria)));document.querySelectorAll("[data-i18n-alt]").forEach(node=>node.setAttribute("alt",t(node.dataset.i18nAlt)));
    updateSoundButtons();renderMain();if(!$("stageScreen").hidden)renderStage();if(match&&!$("battleScreen").hidden){renderBattleShell();setStatus(match.phase==="shoot-ready"?"shootHint":match.phase==="defend-ready"?"realCue":"defendHint")}
    window.dispatchEvent(new CustomEvent("wonder:locale-change",{detail:{locale:lang}}));window.dispatchEvent(new Event("weightplay:shell-sync"));
  }
  function setupLocale(){const select=$("localeSelect");select.innerHTML=LOCALES.map(locale=>`<option value="${locale}">${LOCALE_LABELS[locale]}</option>`).join("");select.value=lang;select.addEventListener("change",()=>{lang=normalizeLocale(select.value);safeStorage.set(LOCALE_KEY,lang);safeStorage.set("weightplayLocale",lang);applyLocale()})}

  $("startBtn").addEventListener("click",()=>{showStage(true);track("stage_open");if(!save.tutorialSeen)openTutorial(true)});document.addEventListener("pointerdown",event=>{const control=event.target.closest?.("#stageBackBtn,#battleBackBtn");if(!control)return;event.preventDefault();event.stopImmediatePropagation();if(control.id==="stageBackBtn")setTimeout(()=>showMain(true),0);else requestLeave()},true);$("restartBtn").addEventListener("click",requestRestart);$("helpBtn").addEventListener("click",()=>openTutorial(false));$("pauseBtn").addEventListener("click",()=>openModal("pausePanel","resumeBtn"));$("resumeBtn").addEventListener("click",()=>closeModal("pausePanel",true));
  document.querySelector(".stage-header").addEventListener("pointerdown",event=>{const bounds=event.currentTarget.getBoundingClientRect();if(event.clientX<=bounds.left+72){event.preventDefault();event.stopImmediatePropagation();setTimeout(()=>showMain(true),0)}},true);
  document.addEventListener("click",event=>{const screen=document.body.dataset.screen;if(!["stage","battle"].includes(screen)||event.clientY>96||event.target.closest?.(".wp-shell-settings,#pauseBtn"))return;const atReturnEdge=event.clientX<=150||event.clientX>=innerWidth-150;if(!atReturnEdge)return;event.preventDefault();event.stopImmediatePropagation();setTimeout(()=>screen==="stage"?showMain(true):requestLeave(),0)},true);
  $("pauseSoundBtn").addEventListener("click",()=>setSound(!soundEnabled));$("leaveContinueBtn").addEventListener("click",()=>closeModal("leavePanel",true));$("leaveStagesBtn").addEventListener("click",()=>{closeModal("leavePanel",false);showStage(true,true)});$("restartContinueBtn").addEventListener("click",()=>closeModal("restartPanel",true));$("restartConfirmBtn").addEventListener("click",()=>{closeModal("restartPanel",false);startMatch(match.stage,"restart")});
  $("resultStagesBtn").addEventListener("click",()=>{if(resultClaimed)return;resultClaimed=true;track("result_stages");closeModal("resultPanel",false);showStage(true)});$("nextBtn").addEventListener("click",()=>{if(resultClaimed||$("nextBtn").disabled)return;resultClaimed=true;track("result_next");closeModal("resultPanel",false);startMatch(Math.min(29,match.stage+1),"next")});$("replayBtn").addEventListener("click",()=>{if(resultClaimed)return;resultClaimed=true;track("result_replay");closeModal("resultPanel",false);startMatch(match.stage,"replay")});
  $("tutorialCloseBtn").addEventListener("click",()=>closeTutorial(false));$("tutorialStartBtn").addEventListener("click",()=>closeTutorial(true));
  ["leavePanel","restartPanel","pausePanel","resultPanel","tutorialPanel"].forEach(id=>$(id).addEventListener("keydown",event=>focusTrap($(id),event)));
  $("stageRail").addEventListener("wonder:stage-snap",event=>{const index=Number(event.detail?.index);if(!Number.isInteger(index)||!LEVELS[index])return;selectedStage=index;const level=LEVELS[index];$("stageRail").querySelectorAll(".stage-card").forEach(card=>{const active=Number(card.dataset.stage)===index;card.classList.toggle("selected",active);card.classList.toggle("is-centered",active);if(active)card.setAttribute("aria-current","true");else card.removeAttribute("aria-current");card.dataset.wpStageRecommended=active&&index<save.unlocked?"true":"false"});$("chapterKicker").textContent=t("chapter",{n:level.chapter+1});$("chapterTitle").textContent=localizedCampaign("chapterNames",level.chapter);$("chapterRule").textContent=localizedCampaign("chapterRules",level.chapter)});
  document.addEventListener("keydown",event=>{if(document.body.dataset.screen==="stage"&&event.key==="Escape"){event.preventDefault();showMain(true);return}if(document.body.dataset.screen!=="battle"||modalOwner||$("tutorialPanel").hidden===false)return;if(event.key.toLowerCase()==="r"){event.preventDefault();requestRestart()}if(event.key==="Escape"){event.preventDefault();requestLeave()}});
  document.addEventListener("visibilitychange",()=>{if(document.hidden)setPaused(true);else if(!modalOwner&&$("tutorialPanel").hidden)setPaused(false)});window.addEventListener("blur",()=>{windowFocused=false;setPaused(true)});window.addEventListener("focus",()=>{windowFocused=true;if(!modalOwner&&$("tutorialPanel").hidden)setPaused(false)});window.addEventListener("pagehide",()=>setPaused(true));

  window.__animalPenaltyCupTest={LEVELS,getState:()=>({lang,selectedStage,save:JSON.parse(JSON.stringify(save)),match:match?{stage:match.stage,phase:match.phase,round:match.round,player:match.player,rival:match.rival,power:match.power,saves:match.saves,perfectShots:match.perfectShots,ended:match.ended,result:match.result}:null,paused,modal:modalOwner?.id||null}),startMatch,commitShot,resolveDefence,finishMatch,showStage,resetSave(){save=defaultSave();persist();showMain()}};
  setupLocale();applyLocale();updateSoundButtons();const assets=["assets/animal-penalty-cup-cover-v1.webp","assets/animal-penalty-cup-stadium-v1.webp","assets/animal-penalty-cup-fox-v1.webp","assets/animal-penalty-cup-keeper-v1.webp"];let loaded=0;Promise.allSettled(assets.map(src=>new Promise(resolve=>{const image=new Image(),done=()=>{loaded++;$("loadingBar").style.width=`${loaded/assets.length*100}%`;resolve()};image.onload=done;image.onerror=done;image.src=src}))).then(()=>setTimeout(()=>{$("loadingPanel").hidden=true;showMain();track("game_view")},140));
})();
