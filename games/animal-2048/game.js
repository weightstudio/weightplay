(() => {
  "use strict";
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete", stageId: null, rewardEligible: false, saveSucceeded: null };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    keyboardKeys: ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "W", "a", "A", "s", "S", "d", "D", "u", "U", "r", "R", "h", "H"],
    screen: ((__wpMeasurement.screen) === "battle" && (__wpMeasurement.ended)) ? null : (__wpMeasurement.screen), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    stageIdAuthoritative: true, paused: Boolean(false), node: document.body,
    activityMode: "input", idleSeconds: 300
  });
  // Older cached collectors may ignore the save gate. Never send them a
  // lifecycle snapshot that could reward an unconfirmed or endless clear.
  let __wpTrackedGame=null,__wpTrackedRound=null,__wpTrackedEnded=false,__wpReplayIntent=0;
  // At most one confirmed clear per campaign stage needs recovery: the shared
  // ledger deduplicates replay rewards. This is session memory, not durable.
  const __wpPendingSaved=[];let __wpRetryTimer=0,__wpRetryDelay=2000;
  function __wpScheduleRetry(){if(!__wpRetryTimer){const delay=__wpRetryDelay;__wpRetryDelay=Math.min(30000,delay*2);__wpRetryTimer=setTimeout(()=>{__wpRetryTimer=0;__wpNotifyMeasurement();},delay);}}
  function __wpHasReceipt(stageId){try{const value=JSON.parse(localStorage.getItem("weightplayCastleV1")||"null");return Boolean(value&&typeof value==="object"&&!Array.isArray(value)&&[1,2,3].includes(value.version)&&(value.worldSchema==null||value.worldSchema===1)&&value.completions&&typeof value.completions==="object"&&!Array.isArray(value.completions)&&Object.hasOwn(value.completions,`animal-2048:stage-${stageId}`)&&value.completions[`animal-2048:stage-${stageId}`]);}catch{return false;}}
  function __wpRememberSavedClear(){
    const state=__wpMeasurement;
    if(!state.roundKey||state.outcome!=="win"||state.rewardEligible!==true||state.saveSucceeded!==true||!Number.isInteger(state.stageId)||state.stageId<1||state.stageId>60)return;
    if(!__wpPendingSaved.some(entry=>entry.stageId===state.stageId))__wpPendingSaved.push({roundKey:state.roundKey,stageId:state.stageId});
  }
  function __wpNotifyMeasurement() { try {
    const game=window.WonderAnalytics?.game;
    if(game?.supportsRewardEligibility!==true||game?.supportsSavedCompletionGate!==true||typeof game.start!=="function"||typeof game.restart!=="function"||typeof game.end!=="function"||typeof game.screen!=="function"||typeof game.configure!=="function"){if(__wpPendingSaved.length)__wpScheduleRetry();return;}
    if(game!==__wpTrackedGame){__wpTrackedGame=game;__wpTrackedRound=null;__wpTrackedEnded=false;}
    while(__wpPendingSaved.length){
      const entry=__wpPendingSaved[0];
      if(entry.roundKey!==__wpTrackedRound||__wpTrackedEnded){
        if(game.start({roundKey:entry.roundKey,stageId:entry.stageId,rewardEligible:true})==null){__wpScheduleRetry();return;}
        __wpTrackedRound=entry.roundKey;__wpTrackedEnded=false;
      }
      if(game.end("win",entry.stageId,{saveSucceeded:true})!==true){__wpScheduleRetry();return;}__wpTrackedEnded=true;
      // end() confirms the lifecycle only. Shared storage can still fail.
      if(!__wpHasReceipt(entry.stageId)){__wpScheduleRetry();return;}
      __wpPendingSaved.shift();
    }
    if(__wpRetryTimer){clearTimeout(__wpRetryTimer);__wpRetryTimer=0;}__wpRetryDelay=2000;
    const state=__wpMeasurement;
    if(state.roundKey&&state.started){
      if(state.roundKey!==__wpTrackedRound){const options={roundKey:state.roundKey,stageId:state.stageId,rewardEligible:state.rewardEligible};const started=__wpReplayIntent?game.restart(options):game.start(options);if(started==null)return;__wpTrackedRound=state.roundKey;__wpTrackedEnded=false;}
      if(state.ended&&!__wpTrackedEnded){game.end(state.outcome,state.stageId,{saveSucceeded:state.saveSucceeded});__wpTrackedEnded=true;}
    }
    const snapshot=__wpReadMeasurement();
    game.configure({locale:document.documentElement.lang||"en",activityMode:snapshot.activityMode,idleSeconds:snapshot.idleSeconds,keyboardKeys:snapshot.keyboardKeys});
    game.screen(snapshot.screen,{node:document.body,locale:document.documentElement.lang||"en"});
  } catch { if(__wpPendingSaved.length)__wpScheduleRetry(); /* Optional telemetry. */ } }
  // Explicit authored replay actions count only when a new round was actually created.
  function __wpReplayStart(action) {
    __wpReplayIntent++;
    try { return action(); } finally { __wpReplayIntent--; }
  }
  window.addEventListener("weightplay:analytics-ready", __wpNotifyMeasurement);
  __wpNotifyMeasurement();

  const $ = (selector) => document.querySelector(selector);
  const stageCanvas=document.querySelector(".stage-canvas");
  stageCanvas?.setAttribute("data-wp-canvas-max-width", "920");
  stageCanvas?.setAttribute("data-wp-stage-landscape-width", "760");
  stageCanvas?.setAttribute("data-wp-stage-landscape-height", "334");
  const stageScreen=document.querySelector("#stageScreen");
  if(stageScreen&&!stageScreen.querySelector(":scope > .stage-ad-reserve")){
    const reserve=document.createElement("div");reserve.className="stage-ad-reserve wp-stage-physical-reserve";reserve.setAttribute("aria-hidden","true");stageScreen.append(reserve);
  }
  document.querySelector(".battle-canvas")?.setAttribute("data-wp-canvas-max-width", "920");
  const SAVE_KEY = "weightplay_animal_2048_v1";
  const TUTORIAL_KEY = "weightplay_tutorial_seen_animal_2048_v1";
  const HOME_TUTORIAL_KEY = "weightplay_nursery_help_seen_animal_2048_v1";
  const LOCALE_SEGMENTS = {en:"en","zh-tw":"zh-Hant","zh-cn":"zh-Hans",es:"es",ja:"ja",ko:"ko","pt-br":"pt-BR",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"};
  const SEGMENTS = {en:"en","zh-Hant":"zh-tw","zh-Hans":"zh-cn",es:"es",ja:"ja",ko:"ko","pt-BR":"pt-br",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"};
  const GAME_ID="animal-2048",GAME_VERSION="v40",INTERFACE_VERSION="9";
  const interfaceValidationRun=new URLSearchParams(location.search).get("qa")==="interface-validator";
  const firstSegment = location.pathname.split("/").filter(Boolean)[0] || "en";
  const readStorage=(key)=>{try{return localStorage.getItem(key);}catch{return null;}};
  const writeStorage=(key,value)=>{try{localStorage.setItem(key,value);return true;}catch{return false;}};
  let locale = LOCALE_SEGMENTS[firstSegment] || readStorage("weightPlayLocale") || "en";

  const LOCALIZED_STRINGS=window.Animal2048Locales||{};
  const t=(key,vars={})=>String(LOCALIZED_STRINGS[locale]?.[key]??LOCALIZED_STRINGS.en?.[key]??key).replace(/\{(\w+)\}/g,(_,name)=>vars[name]??"");
  const saveFailureText={en:"Progress could not be confirmed as saved. You can keep playing this session.","zh-Hant":"無法確認進度已保存，這次仍可繼續遊玩。","zh-Hans":"无法确认进度已保存，本次仍可继续游戏。",ja:"進行状況の保存を確認できません。今回のプレイは続けられます。",ko:"진행 상황이 저장됐는지 확인할 수 없습니다. 이번에는 계속 플레이할 수 있습니다.",es:"No se pudo confirmar el guardado. Puedes seguir jugando en esta sesión.","pt-BR":"Não foi possível confirmar o salvamento. Você pode continuar jogando nesta sessão.",fr:"Impossible de confirmer la sauvegarde. Tu peux continuer à jouer pendant cette session.",de:"Das Speichern konnte nicht bestätigt werden. Du kannst in dieser Sitzung weiterspielen.",it:"Impossibile confermare il salvataggio. Puoi continuare a giocare in questa sessione.",ru:"Не удалось подтвердить сохранение. В этой сессии можно продолжать играть.",hi:"प्रगति सहेजने की पुष्टि नहीं हुई। आप इस सत्र में खेलना जारी रख सकते हैं।",ar:"تعذّر تأكيد حفظ التقدّم. يمكنك متابعة اللعب خلال هذه الجلسة."};
  const savingText={en:"Saving progress…","zh-Hant":"正在保存進度…","zh-Hans":"正在保存进度…",ja:"進行状況を保存中…",ko:"진행 상황 저장 중…",es:"Guardando progreso…","pt-BR":"Salvando progresso…",fr:"Enregistrement de la progression…",de:"Fortschritt wird gespeichert…",it:"Salvataggio dei progressi…",ru:"Сохранение прогресса…",hi:"प्रगति सहेजी जा रही है…",ar:"جارٍ حفظ التقدّم…"};
  let lastInputType="programmatic";
  const setInputType=type=>{lastInputType=type||"programmatic";};
  const clickInputType=event=>event?.detail===0?"keyboard":"pointer";
  const viewportBucket=()=>{const width=Math.max(1,window.innerWidth||0),height=Math.max(1,window.innerHeight||0);if(width>height&&height<=500)return"short-landscape";if(width>=1000)return"desktop";if(width>=600)return"tablet";return"phone";};
  const missionBucket=stage=>{if(stage==="infinite")return"infinite";const index=Number(stage);if(!Number.isInteger(index)||index<1)return"not_applicable";if(index<=5)return"1-5";if(index<=15)return"6-15";if(index<=30)return"16-30";return"31-60";};
  const analyticsPayload=(data={})=>{const stage=data.stage;return{gameId:GAME_ID,game_id:GAME_ID,game_version:GAME_VERSION,interface_version:INTERFACE_VERSION,locale:locale||document.documentElement.lang||"en",viewport_bucket:viewportBucket(),input_type:data.input_type||lastInputType,mission_bucket:missionBucket(stage),...data};};
  const track=(name,data={})=>{try{const game=window.WonderAnalytics?.game;if(game?.supportsRewardEligibility===true&&game?.supportsSavedCompletionGate===true&&typeof game.start==="function"&&typeof game.restart==="function"&&typeof game.end==="function"&&typeof game.screen==="function"&&typeof game.configure==="function")window.WonderAnalytics?.track?.(name,analyticsPayload(data));}catch{}};
  const boundedCount=(value,max=1000000)=>{const number=Number(value);return Number.isFinite(number)?Math.max(0,Math.min(max,Math.floor(number))):undefined;};
  const funnelPayload=(data={})=>{const stage=data.stage??(stageIndex===INFINITE_INDEX?"infinite":stageIndex+1),mode=data.mode??(stage==="infinite"?"endless":"mission"),payload={stage,mode};if(["stage_select","tutorial","result_retry","next_stage","battle_restart"].includes(data.source))payload.source=data.source;if(["win","lose","endless"].includes(data.result))payload.result=data.result;if(["moves","board"].includes(data.reason))payload.reason=data.reason;for(const key of ["score","moves","merges","merge_count","highest","next_stage"]){const value=boundedCount(data[key]);if(value!==undefined)payload[key]=value;}if(typeof data.hint_available==="boolean")payload.hint_available=data.hint_available;return payload;};
  const trackFunnel=(name,data={})=>track(name,funnelPayload(data));
  const tileNames=["", "mouse","rabbit","fox","penguin","koala","owl","panda","lion","giraffe","elephant","lionKing"];
  const tileAssets=["../../assets/animal-2048/tile-0-block-v1.webp","../../assets/animal-2048/tile-1-block-v1.webp","../../assets/animal-2048/tile-2-block-v1.webp","../../assets/animal-2048/tile-3-block-v1.webp","../../assets/animal-2048/tile-4-block-v1.webp","../../assets/animal-2048/tile-5-block-v1.webp","../../assets/animal-2048/tile-6-block-v1.webp","../../assets/animal-2048/tile-7-block-v1.webp","../../assets/animal-2048/tile-8-block-v1.webp","../../assets/animal-2048/tile-9-block-v1.webp","../../assets/animal-2048/tile-10-block-v1.webp"];

  const levels=window.ForestCampaign.map((level,index)=>({...level,index,blocked:new Set(level.blocked)}));
  const INFINITE_INDEX=levels.length,infiniteLevel={index:INFINITE_INDEX,type:"endless",target:0,limit:Infinity,blocked:new Set(),start:Array(16).fill(0),seed:0};

  const defaultSave={unlocked:1,cleared:{},stars:{},best:{},endlessBest:0,endlessTile:0,endlessMoves:0,endlessRuns:0};
  const saveRecord=value=>value&&typeof value==="object"&&!Array.isArray(value)?value:{};
  const saveInteger=(value,max=Number.MAX_SAFE_INTEGER)=>{const number=Number(value);return Number.isFinite(number)?Math.max(0,Math.min(max,Math.floor(number))):0;};
  function normalizeSave(raw){
    const source=saveRecord(raw),cleared={...saveRecord(source.cleared)},stars={...saveRecord(source.stars)},best={...saveRecord(source.best)};
    for(let index=0;index<levels.length;index++){
      if(saveRecord(source.cleared)[index]===true)cleared[index]=true;
      const starValue=saveInteger(saveRecord(source.stars)[index],3);if(starValue)stars[index]=starValue;
      const bestValue=saveInteger(saveRecord(source.best)[index]);if(bestValue)best[index]=bestValue;
    }
    const highestCleared=Object.keys(cleared).reduce((highest,key)=>cleared[key]===true&&Number.isInteger(Number(key))&&Number(key)>=0&&Number(key)<levels.length?Math.max(highest,Number(key)):highest,-1);
    const requestedUnlocked=saveInteger(source.unlocked,levels.length)||1;
    return{
      ...source,unlocked:Math.max(1,Math.min(levels.length,Math.max(requestedUnlocked,highestCleared+2))),
      cleared,stars,best,
      endlessBest:saveInteger(source.endlessBest),
      endlessTile:saveInteger(source.endlessTile),
      endlessMoves:saveInteger(source.endlessMoves),
      endlessRuns:saveInteger(source.endlessRuns)
    };
  }
  function __wpValidSave(value){
    if(!value||typeof value!=="object"||Array.isArray(value))return false;
    const integer=(v,max=Number.MAX_SAFE_INTEGER)=>{if(typeof v==="string"&&!/^[0-9]+$/.test(v))return false;const n=Number(v);return (typeof v==="number"||typeof v==="string")&&Number.isSafeInteger(n)&&n>=0&&n<=max;};
    if(value.unlocked!==undefined&&(!integer(value.unlocked,levels.length)||value.unlocked<1))return false;
    for(const field of ["endlessBest","endlessTile","endlessMoves","endlessRuns"])if(value[field]!==undefined&&!integer(value[field]))return false;
    for(const field of ["cleared","stars","best"]){
      const map=value[field];if(map===undefined)continue;
      if(!map||typeof map!=="object"||Array.isArray(map))return false;
      for(const [key,item] of Object.entries(map)){
        const index=Number(key);if(!Number.isInteger(index)||index<0||index>=levels.length||String(index)!==key)continue;
        if(field==="cleared"?typeof item!=="boolean":!integer(item,field==="stars"?3:Number.MAX_SAFE_INTEGER))return false;
      }
    }
    return true;
  }
  let save,saveProtected=false,saveBase=null,lastAttempt=null,__wpSavedEndlessRuns=0;
  try{
    saveBase=localStorage.getItem(SAVE_KEY);
    const raw=saveBase===null?{}:JSON.parse(saveBase);
    if(!__wpValidSave(raw))throw new Error("INVALID_SAVE");
    save=normalizeSave(raw);__wpSavedEndlessRuns=save.endlessRuns;
  }catch{saveProtected=true;save=normalizeSave(null);}
  let stageIndex=0,stageMode="campaign",board=Array(16).fill(0),score=0,moves=0,merges=0,bestPairs=0,rngState=1,undoState=null,resultState="",startTime=0,hintUsed=false,restarts=0,swipeStart=null,resultTimer=0,resultRevealSuspended=false,resultDecisionCommitted=false,savePending=false,motionTimer=0,motionLock=false,pendingMerged=[];
  const moveAnnouncement=document.createElement("div");moveAnnouncement.id="moveAnnouncement";moveAnnouncement.className="sr-only";moveAnnouncement.setAttribute("aria-live","polite");moveAnnouncement.setAttribute("aria-atomic","true");document.querySelector(".board-zone")?.append(moveAnnouncement);
  const dom={loading:$("#loadingPanel"),loadingFill:$("#loadingFill"),mainGroup:$("#mainGroup"),main:$("#mainScreen"),guide:$(".game-page-info"),stage:$("#stageScreen"),battle:$("#battleScreen"),locale:$("#localeSelect"),mainProgress:$("#mainProgress"),start:$("#startBtn"),stageBack:$("#stageBackBtn"),campaignTab:$("#campaignTab"),challengeTab:$("#challengeTab"),rail:$("#stageRail"),stageSummary:$("#stageSummary"),chapterKicker:$("#chapterKicker"),chapterTitle:$("#chapterTitle"),chapterRule:$("#chapterRule"),battleBack:$("#battleBackBtn"),stageLabel:$("#stageLabel"),goalValue:$("#goalValue"),movesValue:$("#movesValue"),scoreValue:$("#scoreValue"),objective:$("#objectiveRow"),board:$("#gameBoard"),feedback:$("#moveFeedback"),announcement:moveAnnouncement,undo:$("#undoBtn"),restart:$("#restartBtn"),hint:$("#hintBtn"),result:$("#resultPanel"),resultTitle:$("#resultTitle"),resultStars:$("#resultStars"),resultText:$("#resultText"),bestText:$("#bestText"),retry:$("#retryBtn"),resultStages:$("#resultStagesBtn"),next:$("#nextBtn"),leave:$("#leavePanel"),leaveText:$("#leaveText"),leaveContinue:$("#leaveContinueBtn"),leaveStages:$("#leaveStagesBtn"),tutorial:$("#tutorialPanel"),tutorialClose:$("#tutorialCloseBtn"),tutorialStart:$("#tutorialStartBtn")};
  const objectiveText=document.createElement('span'),homeHelpButton=document.createElement('button');
  objectiveText.id='objectiveText';homeHelpButton.id='nurseryHelpBtn';homeHelpButton.type='button';homeHelpButton.textContent='?';homeHelpButton.hidden=true;dom.objective.replaceChildren(objectiveText,homeHelpButton);
  const homeHelpPanel=document.createElement('section');homeHelpPanel.id='nurseryHelpPanel';homeHelpPanel.className='nursery-help-overlay';homeHelpPanel.hidden=true;homeHelpPanel.setAttribute('role','dialog');homeHelpPanel.setAttribute('aria-modal','true');homeHelpPanel.setAttribute('aria-labelledby','nurseryHelpTitle');
  const homeHelpCard=document.createElement('div'),homeHelpTitle=document.createElement('h2'),homeHelpText=document.createElement('p'),homeHelpClose=document.createElement('button');
  homeHelpCard.className='nursery-help-card';homeHelpTitle.id='nurseryHelpTitle';homeHelpText.id='nurseryHelpText';homeHelpText.tabIndex=0;homeHelpText.setAttribute('data-wp-scroll-owner','');homeHelpClose.id='nurseryHelpClose';homeHelpClose.className='primary-action';homeHelpClose.type='button';homeHelpCard.append(homeHelpTitle,homeHelpText,homeHelpClose);homeHelpPanel.append(homeHelpCard);dom.result.parentElement.append(homeHelpPanel);
  [dom.stage,dom.battle,dom.tutorial].forEach(node=>node?.setAttribute("data-runtime-localize","off"));
  dom.bestText?.setAttribute("data-runtime-localize","off");

  const frame=window.WeightPlayScreenFrame.mount({root:$('#forestApp'),localeSelect:dom.locale,scenes:{
    main:{root:dom.main,header:dom.main.querySelector('header'),content:$('#mainContent')},
    stage:{root:stageCanvas,header:stageCanvas.querySelector('header'),content:$('#stageContent')},
    battle:{root:$('.battle-canvas'),header:$('.battle-canvas header'),content:$('#battleLive'),headerInfo:$('#battleInfo')}
  }});
  frame.activate('main');
  const effects=$('#mergeEffects');
  let effectTimer=0,hintTimer=0,homeCounts=[],pendingHomeDeliveries=[],pendingMergeValues=[],runHighest=0;
  const reducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clearEffects(){clearTimeout(effectTimer);effectTimer=0;effects.replaceChildren();dom.board.getAnimations().forEach(animation=>animation.cancel());}
  function clearHint(){clearTimeout(hintTimer);hintTimer=0;document.querySelectorAll('.is-hint').forEach(node=>node.classList.remove('is-hint'));}
  function checkpointText(level,live=false){
    if(!level.checkpoint)return '';
    const {kind,target}=level.checkpoint;
    const count=kind==='space'?board.filter((value,index)=>!value&&!level.blocked.has(index)).length:bestPairs;
    return t(kind==='space'?'checkpointSpace':'checkpointPairs',{target,count:live?Math.min(target,count):0});
  }
  function emitMergeEffects(indices,values=indices.map(index=>board[index]),deliveries=[]){
    clearEffects();if(!indices.length)return;
    const highest=Math.max(...values);
    window.WeightPlayAudio?.play?.(deliveries.length||highest>=128 ? "puzzle.merge" : indices.length>1 ? "puzzle.merge" : "board.move");
    if(reducedMotion())return;
    const zone=effects.parentElement,scale=zone.getBoundingClientRect().width/zone.offsetWidth||1,origin=zone.getBoundingClientRect();
    indices.slice(0,8).forEach((index,k)=>{
      const rect=boardCells()[index].getBoundingClientRect(),x=(rect.left+rect.width/2-origin.left)/scale,y=(rect.top+rect.height/2-origin.top)/scale;
      const label=document.createElement('span');label.className='merge-score';label.textContent=deliveries.some(d=>d.cell===index)?t("homeDelivered"):"+"+(values[k]??board[index]);label.style.left=x+'px';label.style.top=y+'px';effects.append(label);
      for(let p=0;p<(highest>=128?8:5);p++){
        const cube=document.createElement('i'),angle=(p/(highest>=128?8:5)*Math.PI*2)+k*.3;
        cube.className='merge-cube';cube.style.cssText='left:'+x+'px;top:'+y+'px;--dx:'+Math.cos(angle)*34+'px;--dy:'+Math.sin(angle)*34+'px;--spark:'+(highest>=128?'#ffe599':'#83ffcd');effects.append(cube);
      }
    });
    if(highest>=128)dom.board.animate([{transform:'translate(0,0)'},{transform:'translate(-2px,1px)'},{transform:'translate(2px,-1px)'},{transform:'translate(0,0)'}],{duration:130});
    effectTimer=setTimeout(clearEffects,540);
  }

  function announceBoard(direction="",mergeCue=""){dom.announcement.textContent=`${direction?`${t(direction)}. `:""}${t("moves")} ${moves}. ${t("score")} ${score}. ${goalText(activeLevel(),true)}${mergeCue?` ${mergeCue}`:""}`;}
  // WP-FOREST-LOCK-BEGIN
  function __wpMergeSave(candidate,remote,baselineRuns){
    const merged={...candidate,...remote};
    for(const field of ["cleared","stars","best"])merged[field]={...(candidate[field]||{}),...(remote[field]||{})};
    for(let i=0;i<levels.length;i++){
      if(candidate.cleared?.[i]===true||remote.cleared?.[i]===true)merged.cleared[i]=true;
      merged.stars[i]=Math.max(candidate.stars?.[i]||0,remote.stars?.[i]||0);
      merged.best[i]=Math.max(candidate.best?.[i]||0,remote.best?.[i]||0);
      if(!merged.stars[i])delete merged.stars[i];if(!merged.best[i])delete merged.best[i];
    }
    merged.unlocked=Math.max(candidate.unlocked||1,remote.unlocked||1);
    for(const field of ["endlessBest","endlessTile","endlessMoves"])merged[field]=Math.max(candidate[field]||0,remote[field]||0);
    const delta=candidate.endlessRuns-baselineRuns;
    if(!Number.isSafeInteger(delta)||delta<0||!Number.isSafeInteger((remote.endlessRuns||0)+delta))throw Error("INVALID_RUN_DELTA");
    merged.endlessRuns=(remote.endlessRuns||0)+delta;
    return normalizeSave(merged);
  }
  async function __wpPersistLocked(candidate,timeoutMs=4000){
    const failed=()=>({saved:false,progress:candidate});
    let locks;try{locks=window.navigator?.locks;}catch{return failed();}
    if(saveProtected||!locks||typeof locks.request!=="function"||!__wpValidSave(candidate))return failed();
    const controller=new AbortController();let timer;
    try{
      const deadline=new Promise(resolve=>{timer=setTimeout(()=>{controller.abort();resolve(failed());},Math.max(1,timeoutMs));});
      const request=locks.request("weightplay-animal-2048-progress-v1",{mode:"exclusive",signal:controller.signal},()=>{
        if(controller.signal.aborted)return failed();
        try{
          const current=localStorage.getItem(SAVE_KEY);
          if(lastAttempt){
            if(current===lastAttempt.bytes){saveBase=current;__wpSavedEndlessRuns=lastAttempt.runs;lastAttempt=null;}
            else if(current===lastAttempt.before)lastAttempt=null;
            else return failed();
          }
          if(current===null&&saveBase!==null)return failed();
          const raw=current===null?{}:JSON.parse(current);if(!__wpValidSave(raw))return failed();
          const merged=__wpMergeSave(candidate,normalizeSave(raw),__wpSavedEndlessRuns);
          const bytes=JSON.stringify(merged);lastAttempt={before:current,bytes,runs:candidate.endlessRuns};
          try{localStorage.setItem(SAVE_KEY,bytes);}catch{}
          if(localStorage.getItem(SAVE_KEY)!==bytes)return failed();
          saveBase=bytes;__wpSavedEndlessRuns=merged.endlessRuns;lastAttempt=null;return {saved:true,progress:merged};
        }catch{return failed();}
      });
      return await Promise.race([request,deadline]);
    }catch{return failed();}finally{clearTimeout(timer);}
  }
  // WP-FOREST-LOCK-END
  function cloneState(){return{board:[...board],score,moves,merges,bestPairs,rngState,homeCounts:[...homeCounts],runHighest};}
  function restoreState(state){board=[...state.board];score=state.score;moves=state.moves;merges=state.merges;bestPairs=state.bestPairs||0;rngState=state.rngState;homeCounts=[...(state.homeCounts||[])];runHighest=state.runHighest??Math.max(0,...board);pendingHomeDeliveries=[];pendingMergeValues=[];renderBattle();}
  function rng(){rngState^=rngState<<13;rngState^=rngState>>>17;rngState^=rngState<<5;return(rngState>>>0)/4294967296;}
  const battleRegions=()=>[...dom.result.parentElement.children].filter(node=>node!==dom.result&&node!==dom.leave&&node!==homeHelpPanel);
  function setBattleCovered(covered){frame.activate("battle",{covered});if(covered){clearEffects();clearHint();}battleRegions().forEach(node=>{node.inert=covered;if(covered)node.setAttribute("aria-hidden","true");else node.removeAttribute("aria-hidden");});}
  function battleDecisionBlocked(){return Boolean(resultState||!dom.leave.hidden||!dom.result.hidden||!homeHelpPanel.hidden);}
  function openNurseryHelp(){if(motionLock)settleMotion();if(battleDecisionBlocked())return;setBattleCovered(true);homeHelpPanel.hidden=false;homeHelpClose.focus({preventScroll:true});}
  function closeNurseryHelp(){homeHelpPanel.hidden=true;writeStorage(HOME_TUTORIAL_KEY,'1');setBattleCovered(false);homeHelpButton.focus({preventScroll:true});}
  homeHelpButton.addEventListener('click',openNurseryHelp);homeHelpClose.addEventListener('click',closeNurseryHelp);
  function cancelResultReveal(){clearTimeout(resultTimer);resultTimer=0;resultRevealSuspended=false;(__wpNotifyMeasurement(), dom.result.hidden=true);if(dom.leave.hidden)setBattleCovered(false);}
  function suspendResultReveal(){if(!resultTimer)return;clearTimeout(resultTimer);resultTimer=0;resultRevealSuspended=true;}
  function resumeResultReveal(){if(!resultRevealSuspended||!resultState||document.body.dataset.screen!=="battle"||!dom.result.hidden)return;resultRevealSuspended=false;const primary=dom.result.querySelector(".primary-action:not([hidden])");resultTimer=setTimeout(()=>{resultTimer=0;if(document.body.dataset.screen!=="battle"||!resultState)return;setBattleCovered(true);(__wpNotifyMeasurement(), dom.result.hidden=false);if(savePending){dom.resultTitle.tabIndex=-1;dom.resultTitle.focus({preventScroll:true});}else primary?.focus({preventScroll:true});},260);}
  function setScreen(name){if(name!=="battle"){cancelResultReveal();discardMotion();clearHint();}frame.activate(name);document.body.dataset.screen=name;for(const scene of ["main","stage","battle"])document.body.classList.toggle(`wp-shell-${scene}-active`,scene===name);document.body.classList.toggle("wp-stage-select-active",name==="stage");document.documentElement.classList.toggle("wp-stage-select-active",name==="stage");dom.mainGroup.hidden=name!=="main";document.querySelectorAll(".game-page-info").forEach(guide=>guide.hidden=name!=="main");dom.stage.hidden=name!=="stage";dom.battle.hidden=name!=="battle";window.WeightPlayStageArtwork?.sync?.();dispatchEvent(new CustomEvent("weightplay:shell-sync",{detail:{screen:name}}));dispatchEvent(new CustomEvent("weightplay:stage-sync",{detail:{screen:name}}));dispatchEvent(new CustomEvent("weightplay:battle-sync",{detail:{screen:name}}));window.WeightPlayBattleCanvas?.sync();if(name==="battle"){dispatchEvent(new CustomEvent("weightplay:battle-open",{detail:{screen:name}}));window.WeightPlayBattleCanvas?.sync();}
    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[name] ?? null;
      if (["result"].includes(name) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
}
  function chapter(index){return Math.min(11,Math.floor(index/5));}
  function activeLevel(){const level=stageIndex===INFINITE_INDEX?infiniteLevel:levels[stageIndex];if(!level.nests)return level;const open=new Set(window.ForestNursery.opened(level.nests,homeCounts));return {...level,blocked:new Set([...level.blocked].filter(cell=>!open.has(cell)))};}
  function animalFor(value){const tier=Math.max(1,Math.log2(value));return t(tileNames[Math.min(11,tier)]);}
  function endlessObjectiveText(){const best=Number(save.endlessBest||0),highest=Number(save.endlessTile||0);return best||highest?t("endlessTargetRepeat",{best,animal:animalFor(highest||2),value:highest||2}):t("endlessTargetFirst");}
  function goalText(level,objective=false,budget=false){if(level.type==="endless")return objective?endlessObjectiveText():t("endlessGoal");const left=Math.max(0,level.limit-(budget?0:moves));if(level.type==="tile")return t(objective?"objectiveTile":"goalTile",{animal:animalFor(level.target),value:level.target,left});if(level.type==="homes")return t(objective?"objectiveHomes":"goalHomes",{target:level.target,left});if(level.type==="score")return t(objective?"objectiveScore":"goalScore",{target:level.target,left});return t(objective?"objectiveMerges":"goalMerges",{target:level.target,left});}
  function applyLocale(){document.documentElement.lang=locale;document.querySelectorAll("[data-i18n]").forEach(node=>node.textContent=t(node.dataset.i18n));document.querySelectorAll("[data-i18n-aria]").forEach(node=>node.setAttribute("aria-label",t(node.dataset.i18nAria)));dom.locale.value=locale;homeHelpTitle.textContent=t('homeHelpTitle');homeHelpText.textContent=t('homeHelpBody');homeHelpClose.textContent=t('continue');homeHelpButton.setAttribute('aria-label',t('homeHelpTitle'));document.title=`${t("fullTitle")} | WeightPlay`;document.querySelector(".main-poster").alt=t("posterAlt");document.querySelector(".game-board").setAttribute("aria-label",t("boardLabel"));dom.board.setAttribute("aria-keyshortcuts","ArrowUp ArrowDown ArrowLeft ArrowRight W A S D U R H");frame.refresh();renderMainProgress();if(document.body.dataset.screen==="stage")renderStages();if(document.body.dataset.screen==="battle")renderBattle();}
  function renderMainProgress(){const cleared=Object.keys(save.cleared||{}).length,stars=Object.values(save.stars||{}).reduce((a,b)=>a+Number(b||0),0);dom.mainProgress.textContent=t("progress",{cleared,stars,total:levels.length});}
  function showMain(){setScreen("main");renderMainProgress();dom.start.focus({preventScroll:true});}
  let stageController=null;
  const stageEntry=index=>stageMode==="challenge"?infiniteLevel:levels[index];
  function stageCardMarkup(level){const i=level.index,endless=i===INFINITE_INDEX,unlocked=endless||i<(save.unlocked||1),clear=!endless&&save.cleared?.[i],stars=endless?0:save.stars?.[i]||0,top=endless?`<span>${t("infiniteMode")}</span><span>∞</span>`:`<span>${t("mission")} ${i+1}</span><span>${"★".repeat(stars)}${"☆".repeat(Math.max(0,3-stars))}</span>`,goal=endless?t("endlessCardGoal"):goalText(level),status=endless?t("endlessCardBest",{score:Number(save.endlessBest||0)}):clear?t("cleared"):unlocked?t("ready"):t("locked"),shortcuts=endless?"":' aria-keyshortcuts="ArrowLeft ArrowRight Home End"';return`<button class="stage-card ${endless?"infinite-stage-card ":""}${unlocked?"unlocked":"locked"} ${i===stageIndex?"selected":""}" data-index="${i}" type="button" aria-disabled="${unlocked?"false":"true"}"${shortcuts}><small>${top}</small><strong>${goal}</strong><span>${status}</span></button>`;}
  function bindStageCard(card,index){
    const template=document.createElement("template");template.innerHTML=stageCardMarkup(stageEntry(index));
    const authored=template.content.firstElementChild;
    for(const attribute of [...card.attributes])if(attribute.name!=="data-wp-stage-pool-node"&&!attribute.name.startsWith("data-wp-get-"))card.removeAttribute(attribute.name);
    for(const attribute of authored.attributes)card.setAttribute(attribute.name,attribute.value);
    let content=card.querySelector(":scope > [data-wp-item-content]");
    if(!content){content=document.createElement("div");content.dataset.wpItemContent="";card.append(content);}
    content.replaceChildren(...authored.childNodes);
    window.WeightPlayForestInterface.bindCard(card,Number(authored.dataset.index));
  }
  function renderStagePool(){
    if(stageController){stageController.refresh();return;}
    stageController=window.WeightPlayStageV6.install(dom.rail,{
      total:()=>stageMode==="challenge"?1:levels.length,
      initialIndex:()=>stageMode==="challenge"?0:stageIndex,
      bind:bindStageCard,
      activate:index=>{const level=stageEntry(index);if(level.index===INFINITE_INDEX||level.index<(save.unlocked||1))startStage(level.index,"stage_select");},
      onFocus:index=>updateChapter(stageEntry(index).index)
    });
  }
  function renderStages(){const entries=stageMode==="challenge"?[infiniteLevel]:levels;dom.stage.dataset.mode=stageMode;renderStagePool();const campaignActive=stageMode==="campaign";dom.campaignTab.setAttribute("aria-pressed","true");dom.challengeTab.setAttribute("aria-pressed",String(!campaignActive));dom.campaignTab.setAttribute("aria-selected","true");dom.challengeTab.setAttribute("aria-selected",String(!campaignActive));dom.campaignTab.tabIndex=0;dom.challengeTab.tabIndex=campaignActive?-1:0;dom.stageSummary.textContent=stageMode==="challenge"?t("challengeSummary",{score:Number(save.endlessBest||0)}):t("stageProgress",{cleared:Object.keys(save.cleared||{}).length,stars:Object.values(save.stars||{}).reduce((a,b)=>a+Number(b||0),0),total:levels.length});updateChapter(stageIndex);}
  function updateChapter(index){stageIndex=index;if(index===INFINITE_INDEX){dom.chapterKicker.textContent="∞";dom.chapterTitle.textContent=t("infiniteMode");dom.chapterRule.textContent=t("endlessRule");}else{const ch=chapter(index),level=levels[index],earlyPlan=["missionPlanFoundation","missionPlanChain","missionPlanMerge","missionPlanTarget","missionPlanScore"][index],planKey=earlyPlan||`rule${ch+1}`;dom.chapterKicker.textContent=`${t(index<30?"campaignChapter1":"campaignChapter2")} · ${t("mission")} ${index+1} / ${levels.length}`;dom.chapterTitle.textContent=t(`chapter${ch+1}`);dom.chapterRule.textContent=`${t(planKey)} · ${goalText(level,true,true)}${level.checkpoint?` · ${checkpointText(level)}`:""}`;}dom.rail.querySelectorAll(".stage-card").forEach(card=>{const selected=Number(card.dataset.index)===index;card.classList.toggle("selected",selected);card.tabIndex=selected?0:-1;if(selected)card.setAttribute("aria-current","true");else card.removeAttribute("aria-current");});}
  function selectedStageCard(){return dom.rail.querySelector(`.stage-card.unlocked[data-index="${stageIndex}"]`);}
  function focusSelectedStageCard(){if(document.body.dataset.screen==="stage"&&dom.tutorial.hidden)selectedStageCard()?.focus({preventScroll:true});}
  function setStageCardCenter(card){if(!card||!dom.rail.getClientRects().length)return;const railRect=dom.rail.getBoundingClientRect(),cardRect=card.getBoundingClientRect(),coordinateScale=railRect.width>0?dom.rail.clientWidth/railRect.width:1,target=dom.rail.scrollLeft+((cardRect.left+cardRect.width/2)-(railRect.left+railRect.width/2))*coordinateScale,maximum=Math.max(0,dom.rail.scrollWidth-dom.rail.clientWidth),previousBehavior=dom.rail.style.getPropertyValue("scroll-behavior"),previousPriority=dom.rail.style.getPropertyPriority("scroll-behavior");dom.rail.style.setProperty("scroll-behavior","auto","important");dom.rail.scrollLeft=getComputedStyle(dom.rail).direction==="rtl"?Math.max(-maximum,Math.min(0,target)):Math.max(0,Math.min(maximum,target));if(previousBehavior)dom.rail.style.setProperty("scroll-behavior",previousBehavior,previousPriority);else dom.rail.style.removeProperty("scroll-behavior");}
  function visibleStageCard(index){return dom.rail.querySelector(`:scope > [data-wp-stage-pool-node][data-wp-stage-virtual-index="${index}"]`)||dom.rail.querySelector(`:scope > .stage-card[data-index="${index}"]`);}
  function centerStageCard(){const index=stageMode==="challenge"?0:stageIndex;stageController?.center(index);setStageCardCenter(visibleStageCard(index));}
  function setStageMode(mode){stageMode=mode==="challenge"?"challenge":"campaign";stageIndex=stageMode==="challenge"?INFINITE_INDEX:Math.max(0,(save.unlocked||1)-1);renderStages();centerStageCard();}
  function showStage(focus=null){const latest=Math.max(0,(save.unlocked||1)-1);stageMode=focus===INFINITE_INDEX?"challenge":"campaign";stageIndex=stageMode==="challenge"?INFINITE_INDEX:Math.max(0,Math.min(focus===null?latest:focus,latest));renderStages();setScreen("stage");stageController?.refresh();centerStageCard();focusSelectedStageCard();}
  function boardCells(){if(dom.board.children.length!==16){const fragment=document.createDocumentFragment();for(let i=0;i<16;i++){const cell=document.createElement("div");cell.className="grid-cell";cell.dataset.index=String(i);fragment.append(cell);}dom.board.replaceChildren(fragment);}return[...dom.board.children];}
  function renderBoard(mergedIndices=[]){const level=activeLevel(),merged=new Set(mergedIndices);boardCells().forEach((cell,i)=>{const blocked=level.blocked.has(i);cell.className=blocked?"grid-cell is-blocked":"grid-cell";cell.dataset.index=String(i);if(blocked){cell.setAttribute("aria-label",t("stone"));cell.replaceChildren();return;}cell.removeAttribute("aria-label");const value=board[i];if(!value){cell.replaceChildren();return;}const tier=Math.log2(value),asset=tileAssets[Math.min(10,tier-1)];let tile=cell.querySelector(":scope > .tile");if(!tile){tile=document.createElement("div");const image=document.createElement("img"),label=document.createElement("span");image.alt="";image.draggable=false;label.className="tile-value";tile.append(image,label);cell.replaceChildren(tile);}tile.className=`tile${tier>=11?" is-legendary":""}`;tile.dataset.level=String(tier);tile.setAttribute("aria-label",`${animalFor(value)} ${value}`);const image=tile.querySelector("img"),label=tile.querySelector(".tile-value");if(image.getAttribute("src")!==asset)image.src=asset;if(label.textContent!==String(value))label.textContent=String(value);if(merged.has(i)){void tile.offsetWidth;tile.classList.add("is-merged");}});}
  function renderNurseries(){
    const level=activeLevel(),nests=level.nests||[],number=['①','②','③','④'];
    const gates=new Map();nests.forEach((home,index)=>home.opens.forEach(cell=>gates.set(cell,index)));
    boardCells().forEach((cell,i)=>{
      cell.querySelector('.nursery-label')?.remove();delete cell.dataset.homeId;
      if(gates.has(i)){
        const index=gates.get(i),closed=level.blocked.has(i),home=index+1,badge=document.createElement('span');
        cell.classList.add(closed?'is-root-gate':'is-open-root');cell.dataset.homeId=String(home);badge.className='nursery-label';badge.textContent=number[index];badge.setAttribute('aria-hidden','true');cell.append(badge);
        cell.setAttribute('aria-label',t(closed?'rootGateClosed':'rootGateOpen',{home}));
      }
      const index=nests.findIndex(home=>home.cell===i);if(index<0)return;
      const home=nests[index],done=homeCounts[index]||0,need=home.needs[done],badge=document.createElement('span');
      cell.dataset.homeId=String(index+1);cell.classList.add(need===undefined?'is-home-complete':'is-nursery');badge.className='nursery-label';badge.textContent=number[index]+' · '+(need===undefined?'✓':String(need));badge.setAttribute('aria-hidden','true');cell.append(badge);
      const label=[t('homeNumber',{home:index+1}),need===undefined?t('homeComplete'):t('homeNeeds',{value:need,done,total:home.needs.length})];
      if(need!==undefined&&home.opens.length)label.push(t('homeOpensGate',{home:index+1}));cell.setAttribute('aria-label',label.join('. '));
    });
  }
  function renderBattle(mergedIndices=[]){
    const level=activeLevel(),endless=level.type==="endless",delivered=homeCounts.reduce((a,b)=>a+b,0);
    dom.stageLabel.textContent=endless?t("infiniteMode"):`${t("mission")} ${stageIndex+1}`;
    dom.goalValue.textContent=endless?String(Math.max(2,...board)):level.type==="tile"?String(level.target):`${level.type==="score"?score:level.type==="homes"?delivered:merges}/${level.target}`;
    dom.goalValue.setAttribute("aria-label",goalText(level));
    dom.movesValue.textContent=endless?String(moves):`${moves}/${level.limit}`;dom.scoreValue.textContent=score;
    homeHelpButton.hidden=!level.nests;dom.objective.classList.toggle("has-nursery-help",Boolean(level.nests));
    objectiveText.textContent=endless?endlessObjectiveText():level.nests
      ?[t("homeProgress",{count:delivered,target:level.target}),checkpointText(level,true)].filter(Boolean).join(" · ")
      :checkpointText(level,true)||t(`rule${chapter(stageIndex)+1}`);
    dom.undo.disabled=!undoState;renderBoard(mergedIndices);renderNurseries();dom.next.hidden=false;
    dom.leaveText.textContent=endless?t("endlessLeaveText"):t("leaveText",{stage:stageIndex+1});
  }
  function discardMotion(){clearEffects();clearTimeout(motionTimer);motionTimer=0;motionLock=false;pendingMerged=[];pendingHomeDeliveries=[];pendingMergeValues=[];boardCells().forEach(cell=>{cell.classList.remove("has-moving-tile");cell.querySelectorAll(".tile").forEach(tile=>tile.getAnimations().forEach(animation=>animation.cancel()));});}
  function settleMotion(){if(!motionLock)return;clearTimeout(motionTimer);motionTimer=0;boardCells().forEach(cell=>cell.querySelectorAll(".tile").forEach(tile=>tile.getAnimations().forEach(animation=>animation.cancel())));const merged=[...pendingMerged],values=[...pendingMergeValues],deliveries=[...pendingHomeDeliveries];pendingMerged=[];pendingMergeValues=[];pendingHomeDeliveries=[];motionLock=false;renderBattle(merged);emitMergeEffects(merged,values,deliveries);}
  function animateBoardMove(motions,mergedIndices){const cells=boardCells(),duration=reducedMotion()?0:145;pendingMerged=[...mergedIndices];motionLock=true;let animated=0;motions.forEach(({from,to})=>{if(from===to)return;const source=cells[from],target=cells[to],tile=source?.querySelector(":scope > .tile");if(!tile||!target)return;source.classList.add("has-moving-tile");tile.classList.add("is-moving");tile.animate([{transform:"translate3d(0,0,0)"},{transform:`translate3d(${target.offsetLeft-source.offsetLeft}px,${target.offsetTop-source.offsetTop}px,0)`}],{duration,easing:"cubic-bezier(.22,.78,.25,1)",fill:"forwards"});animated++;});if(!animated||duration===0){settleMotion();return;}motionTimer=setTimeout(settleMotion,duration);}
  function startStage(index,entry="stage_select"){if(savePending)return;cancelResultReveal();discardMotion();stageIndex=Math.max(0,Math.min(INFINITE_INDEX,index));homeCounts=[];const level=activeLevel(),endless=level.type==="endless";score=0;moves=0;merges=0;bestPairs=0;rngState=endless?((Date.now()^Math.floor(performance.now()*1000))>>>0)||1:level.seed>>>0;board=endless?Array(16).fill(0):[...level.start];homeCounts=(level.nests||[]).map(()=>0);if(endless){spawnTile();spawnTile();}runHighest=Math.max(0,...board);undoState=null;resultState="";hintUsed=false;restarts=0;startTime=performance.now();(__wpNotifyMeasurement(), dom.leave.hidden=true);setBattleCovered(false);dom.feedback.textContent="";dom.announcement.textContent="";setScreen("battle");renderBattle();const funnelData={stage:endless?"infinite":stageIndex+1,mode:endless?"endless":"mission",source:entry};trackFunnel(endless?"challenge_start":"mission_start",funnelData);if(document.body.dataset.screen==="battle"&&dom.leave.hidden&&dom.result.hidden)dom.board.focus({preventScroll:true});
    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpMeasurement.stageId=endless?null:stageIndex+1; __wpMeasurement.rewardEligible=!endless&&!saveProtected; __wpMeasurement.saveSucceeded=null; __wpNotifyMeasurement();
    if(level.nests&&!readStorage(HOME_TUTORIAL_KEY))openNurseryHelp();
}
  function getLines(direction){const lines=[];if(direction==="left"||direction==="right"){for(let r=0;r<4;r++){const line=[];for(let c=0;c<4;c++)line.push(r*4+c);if(direction==="right")line.reverse();lines.push(line);}}else{for(let c=0;c<4;c++){const line=[];for(let r=0;r<4;r++)line.push(r*4+c);if(direction==="down")line.reverse();lines.push(line);}}return lines;}
  function moveBoard(source,direction,blocked){const next=[...source],mergedIndices=[],motions=[];let gained=0,mergeCount=0;for(const line of getLines(direction)){let segment=[];const flush=()=>{if(!segment.length)return;const entries=segment.map(from=>({value:source[from],sources:[from]})).filter(entry=>entry.value),out=[];for(let i=0;i<entries.length;i++){const current=entries[i];if(i+1<entries.length&&current.value===entries[i+1].value){const value=current.value*2;out.push({value,sources:[...current.sources,...entries[i+1].sources]});mergedIndices.push(segment[out.length-1]);gained+=value;mergeCount++;i++;}else out.push(current);}segment.forEach((cell,j)=>{const entry=out[j];next[cell]=entry?.value||0;entry?.sources.forEach(from=>motions.push({from,to:cell}));});segment=[];};for(const cell of line){if(blocked.has(cell)){flush();next[cell]=0;}else segment.push(cell);}flush();}return{board:next,changed:next.some((v,i)=>v!==source[i]),gained,mergeCount,mergedIndices,motions};}
  function spawnTile(){const level=activeLevel(),empty=board.map((value,i)=>!value&&!level.blocked.has(i)?i:-1).filter(i=>i>=0);if(!empty.length)return;const cell=empty[Math.floor(rng()*empty.length)],value=rng()<.88?2:4;board[cell]=value;}
  function achieved(){const level=activeLevel();if(level.checkpoint){const {kind,target}=level.checkpoint;if(kind==="space"&&board.filter((value,index)=>!value&&!level.blocked.has(index)).length<target)return false;if(kind==="pairs"&&bestPairs<target)return false;}if(level.type==="endless")return false;if(level.type==="homes")return homeCounts.reduce((a,b)=>a+b,0)>=level.target;if(level.type==="tile")return board.some(value=>value>=level.target);if(level.type==="score")return score>=level.target;return merges>=level.target;}
  function canMove(){const level=activeLevel();return["up","down","left","right"].some(direction=>moveBoard(board,direction,level.blocked).changed);}
  function mergeCue(result){if(!result.mergeCount)return"";if(result.mergeCount===1){const value=result.board[result.mergedIndices[0]];return t("mergeSingle",{outcome:`${animalFor(value)} (${value})`,score:result.gained});}return t("mergeMany",{count:result.mergeCount,score:result.gained});}
  function performMove(direction){if(motionLock||resultState||!dom.leave.hidden||!homeHelpPanel.hidden)return false;const level=activeLevel(),result=moveBoard(board,direction,level.blocked);if(!result.changed){dom.feedback.textContent=t("invalid");window.WeightPlayAudio?.play?.("feedback.error");return false;}undoState=cloneState();board=result.board;score+=result.gained;moves++;merges+=result.mergeCount;bestPairs=Math.max(bestPairs,result.mergeCount);clearEffects();clearHint();pendingMergeValues=result.mergedIndices.map(i=>result.board[i]);const mergeText=mergeCue(result);pendingHomeDeliveries=[];if(level.nests){const delivery=window.ForestNursery.resolve(board,result.mergedIndices,level.nests,homeCounts);board=delivery.board;homeCounts=delivery.counts;pendingHomeDeliveries=delivery.delivered;}spawnTile();runHighest=Math.max(runHighest,...result.board,...board);const cue=pendingHomeDeliveries.length?t("homeArrival",{count:pendingHomeDeliveries.length}):mergeText;dom.feedback.textContent=cue;announceBoard(direction,cue);animateBoardMove(result.motions,result.mergedIndices);if(!result.mergeCount)window.WeightPlayAudio?.play?.("ui.click");if(level.type==="endless"&&result.mergeCount)trackFunnel("challenge_evolution",{stage:"infinite",mode:"endless",merge_count:result.mergeCount,merges,highest:Math.max(...board),score,moves});if(achieved())finish(true);else if(level.type!=="endless"&&moves>=level.limit)finish(false,"moves");else if(!canMove())finish(false,"board");return true;}
  function bestScoreFeedback(current,previous){const currentScore=Math.max(0,Number(current)||0),previousScore=Math.max(0,Number(previous)||0);if(previousScore<=0)return t("bestFirst",{score:currentScore});if(currentScore>previousScore)return t("bestAbove",{score:currentScore,delta:currentScore-previousScore,previous:previousScore});if(currentScore<previousScore)return t("bestBelow",{previous:previousScore,delta:previousScore-currentScore});return t("bestTie",{score:currentScore});}
  function finish(win,reason=""){
    cancelResultReveal();
    resultDecisionCommitted=false;
    const level=activeLevel(),endless=level.type==="endless",highest=runHighest,runSummary=t("runSummary",{animal:animalFor(highest),value:highest,score,moves});
    resultState=endless?"endless":win?"win":"lose";
    const round=__wpMeasurement.roundKey,finishedStage=stageIndex,needsSave=endless||win;
    let savedText="";
    if(endless){
      const previous=Number(save.endlessBest||0);
      save.endlessBest=Math.max(previous,score);
      save.endlessTile=Math.max(Number(save.endlessTile||0),highest);
      save.endlessMoves=Math.max(Number(save.endlessMoves||0),moves);
      save.endlessRuns=Number(save.endlessRuns||0)+1;
      dom.resultTitle.textContent=t("endlessResultTitle");
      dom.resultStars.textContent="∞";
      dom.resultText.textContent=t("endlessResultText",{moves,score,animal:animalFor(highest),value:highest});
      savedText=`${bestScoreFeedback(score,previous)} ${t("endlessRecord",{score:save.endlessBest,animal:animalFor(save.endlessTile||highest),value:save.endlessTile||highest})}`;
      track("challenge_complete",{stage:"infinite",mode:"endless",score,moves,highest,result:"endless"});
    }else if(win){
      const left=level.limit-moves,stars=hintUsed?2:left>=Math.ceil(level.limit*.45)&&restarts===0?3:2,previous=Number(save.best?.[stageIndex]||0);
      save.cleared[stageIndex]=true;
      save.stars[stageIndex]=Math.max(save.stars?.[stageIndex]||0,stars);
      save.best[stageIndex]=Math.max(previous,score);
      save.unlocked=Math.max(save.unlocked||1,Math.min(levels.length,stageIndex+2));
      dom.resultTitle.textContent=t("winTitle");
      dom.resultStars.textContent="★".repeat(stars)+"☆".repeat(3-stars);
      dom.resultText.textContent=`${t("winText",{stage:stageIndex+1,moves,score})} ${runSummary}`;
      savedText=bestScoreFeedback(score,previous);
      trackFunnel("mission_success",{stage:stageIndex+1,mode:"mission",score,moves,merges,highest, result:"win"});
    }else{
      const previous=Number(save.best?.[stageIndex]||0);
      dom.resultTitle.textContent=t("loseTitle");
      dom.resultStars.textContent="";
      dom.resultText.textContent=`${t(reason==="moves"?"loseMoves":"loseBoard")} ${runSummary}`;
      dom.bestText.textContent=bestScoreFeedback(score,previous);
      trackFunnel("mission_failure",{stage:stageIndex+1,mode:"mission",reason,score,moves,merges,highest,result:"lose"});
      track("game_fail",{stage:stageIndex+1,reason,score,moves,result:"lose"});
    }
    const nextAvailable=!endless&&win&&stageIndex<levels.length-1;
    dom.next.hidden=false;
    function setSaving(pending){savePending=pending;dom.result.setAttribute("aria-busy",String(pending));dom.retry.disabled=pending;dom.resultStages.disabled=pending;dom.battleBack.disabled=pending;dom.next.disabled=pending||!nextAvailable;}
    setSaving(needsSave);
    if(needsSave){dom.bestText.setAttribute("role","status");dom.bestText.setAttribute("aria-live","polite");dom.bestText.textContent=savingText[locale]||savingText.en;}
    [dom.retry,dom.resultStages,dom.next].forEach(button=>button.classList.remove("primary-action"));
    const primary=nextAvailable?dom.next:win&&!endless?dom.resultStages:dom.retry;
    primary.classList.add("primary-action");
    resultTimer=setTimeout(()=>{resultTimer=0;if(document.body.dataset.screen!=="battle"||!resultState)return;setBattleCovered(true);(__wpNotifyMeasurement(), dom.result.hidden=false);if(savePending){dom.resultTitle.tabIndex=-1;dom.resultTitle.focus({preventScroll:true});}else primary.focus({preventScroll:true});},260);
    const finishMeasurement=confirmedSave=>{
      if(__wpMeasurement.roundKey!==round||stageIndex!==finishedStage)return;
      __wpMeasurement.ended=true;__wpMeasurement.outcome=endless?"endless":win?"win":"lose";
      __wpMeasurement.saveSucceeded=Boolean(!endless&&win&&confirmedSave);
      __wpRememberSavedClear();
      if(__wpMeasurement.screen==="battle")__wpMeasurement.screen=null;__wpNotifyMeasurement();
    };
    if(!needsSave){finishMeasurement(false);return;}
    const candidate=JSON.parse(JSON.stringify(save));
    void __wpPersistLocked(candidate).then(result=>{
      if(__wpMeasurement.roundKey!==round||stageIndex!==finishedStage)return;
      if(result.saved)save=result.progress;
      dom.bestText.textContent=result.saved?savedText:(saveFailureText[locale]||saveFailureText.en);
      finishMeasurement(result.saved);setSaving(false);
      if(!dom.result.hidden&&document.activeElement===dom.resultTitle)primary.focus({preventScroll:true});
    });
}
  function undo(){if(battleDecisionBlocked())return;clearHint();clearEffects();if(motionLock)settleMotion();if(!undoState){dom.feedback.textContent=t("undoEmpty");return;}const restore=undoState;undoState=null;clearEffects();restoreState(restore);dom.feedback.textContent=t("undoReady");announceBoard();trackFunnel("undo_used",{score,moves,merges,highest:Math.max(...board)});}
  function restart(){
    if(battleDecisionBlocked())return;const restartCount=restarts+1,startIndex=stageIndex;__wpReplayStart(() => startStage(startIndex));restarts=restartCount;
}
  function hintBoardStats(values,blocked){const open=values.filter((value,index)=>!value&&!blocked.has(index)).length,corner=Math.max(0,...[0,3,12,15].map(index=>values[index]||0)),highest=Math.max(...values);return{open,corner,highest};}
  // Two-ply board evaluation prioritizes usable space and prepared pairs.
  // It does not inspect future RNG or alter the live board while suggesting.
  function hintValue(result,level){
    const stats=hintBoardStats(result.board,level.blocked);
    let pairs=0,smoothness=0;
    for(let i=0;i<16;i++)for(const j of [i%4<3?i+1:-1,i<12?i+4:-1]){
      if(j<0||level.blocked.has(i)||level.blocked.has(j))continue;
      const a=result.board[i],b=result.board[j];
      if(a&&b){if(a===b)pairs+=Math.log2(a);smoothness+=Math.abs(Math.log2(a)-Math.log2(b));}
    }
    const checkpoint=level.checkpoint;
    const checkpointValue=checkpoint?.kind==='pairs'&&bestPairs<checkpoint.target?Math.min(checkpoint.target,result.mergeCount)*55:checkpoint?.kind==='space'?Math.min(stats.open-1,checkpoint.target)*24:0;
    const goalValue=level.type==='merges'?result.mergeCount*28:level.type==='score'?Math.log2(result.gained+1)*12:Math.log2(stats.highest||2)*12;
    return stats.open*45+pairs*12-smoothness*2+Math.log2(stats.corner||2)*8+goalValue+checkpointValue;
  }
  function nurseryHint(){
    const level=activeLevel(),nests=level.nests;
    const simulate=(values,counts,direction)=>{const opened=new Set(window.ForestNursery.opened(nests,counts)),blocked=new Set([...levels[stageIndex].blocked].filter(i=>!opened.has(i))),moved=moveBoard(values,direction,blocked);if(!moved.changed)return null;const delivery=window.ForestNursery.resolve(moved.board,moved.mergedIndices,nests,counts),afterOpen=new Set(delivery.opened),afterLevel={...level,blocked:new Set([...levels[stageIndex].blocked].filter(i=>!afterOpen.has(i)))};return {...moved,mergeValues:moved.mergedIndices.map(i=>moved.board[i]),board:delivery.board,counts:delivery.counts,delivered:delivery.delivered,level:afterLevel};};
    const value=r=>hintValue(r,r.level)+r.delivered.length*220;
    const ranked=['up','left','right','down'].map(direction=>{const first=simulate(board,homeCounts,direction);if(!first)return {direction,score:-Infinity};const future=['up','left','right','down'].map(d=>simulate(first.board,first.counts,d)).filter(Boolean);const outcome=Math.max(2,...first.mergeValues);return {direction,score:value(first)+(future.length?Math.max(...future.map(value))*.55:-200),reasonKey:first.delivered.length?'hintReasonHome':first.mergeCount?'hintReasonMerge':'hintReasonReserve',reasonVars:{count:first.delivered.length||Math.max(0,hintBoardStats(first.board,first.level.blocked).open-1),outcome:animalFor(outcome)+' ('+outcome+')'}};}).sort((a,b)=>b.score-a.score);return ranked[0]?.score>-Infinity?ranked[0]:null;
  }
  function bestHint(){if(activeLevel().nests)return nurseryHint();
    const level=activeLevel(),current=hintBoardStats(board,level.blocked),directions=['up','left','right','down'];
    const ranked=directions.map(direction=>{
      const result=moveBoard(board,direction,level.blocked);if(!result.changed)return{direction,score:-Infinity};
      const next=hintBoardStats(result.board,level.blocked);
      const future=directions.map(d=>moveBoard(result.board,d,level.blocked)).filter(r=>r.changed);
      const rating=hintValue(result,level)+(future.length?Math.max(...future.map(r=>hintValue(r,level)))*.55:-200);
      let reasonKey='hintReasonReserve',reasonVars={count:Math.max(0,next.open-1),outcome:`${animalFor(next.highest)} (${next.highest})`};
      if(result.mergeCount){const outcome=Math.max(...result.mergedIndices.map(index=>result.board[index]));reasonKey='hintReasonMerge';reasonVars={outcome:`${animalFor(outcome)} (${outcome})`};}
      else if(next.corner>current.corner){reasonKey='hintReasonCorner';reasonVars={outcome:`${animalFor(next.corner)} (${next.corner})`};}
      return{direction,score:rating,reasonKey,reasonVars};
    }).sort((a,b)=>b.score-a.score);
    return ranked[0]?.score>-Infinity?ranked[0]:null;
  }
  function bestDirection(){return bestHint()?.direction||null;}
  function showHint(){if(battleDecisionBlocked())return;if(motionLock)settleMotion();clearHint();hintUsed=true;const hint=bestHint(),direction=hint?.direction;dom.feedback.textContent=hint?t("hintMove",{direction:t(direction),reason:t(hint.reasonKey,hint.reasonVars)}):t("noHint");trackFunnel("hint_used",{score,moves,merges,highest:Math.max(...board),hint_available:Boolean(hint)});if(direction){const btn=$(`[data-direction="${direction}"]`);btn?.classList.add("is-hint");hintTimer=setTimeout(clearHint,1200);}}
  function setTutorialCovered(covered){frame.activate("stage",{covered});for(const node of stageCanvas.children){if(node===dom.tutorial)continue;node.inert=covered;if(covered)node.setAttribute("aria-hidden","true");else node.removeAttribute("aria-hidden");}}
  function closeTutorial(){writeStorage(TUTORIAL_KEY,"1");(__wpNotifyMeasurement(), dom.tutorial.hidden=true);setTutorialCovered(false);focusSelectedStageCard();}
  dom.start.addEventListener("click",()=>{showStage();if(!interfaceValidationRun&&!readStorage(TUTORIAL_KEY))(__wpNotifyMeasurement(), dom.tutorial.hidden=false, setTutorialCovered(true));});dom.stageBack.addEventListener("click",showMain);dom.campaignTab.addEventListener("click",()=>setStageMode("campaign"));dom.challengeTab.addEventListener("click",()=>setStageMode("challenge"));dom.rail.addEventListener("wonder:stage-snap",event=>{const eventIndex=Number(event.detail?.index),sourceIndex=Number(event.detail?.card?.dataset?.index),index=stageMode==="challenge"?INFINITE_INDEX:Number.isInteger(eventIndex)?eventIndex:sourceIndex;if(Number.isInteger(index)&&index>=0){updateChapter(index);}});
  const preventRepeatedActivation=event=>{if(event.repeat&&(event.key==="Enter"||event.key===" "))event.preventDefault();};
  [dom.start,dom.stageBack,dom.battleBack,dom.leaveContinue,dom.leaveStages,dom.retry,dom.resultStages,dom.next,dom.tutorialClose,dom.tutorialStart].forEach(button=>button.addEventListener("keydown",preventRepeatedActivation));
  const resultStageTarget=()=>resultState==="win"&&stageIndex<levels.length-1?stageIndex+1:stageIndex;
  dom.battleBack.addEventListener("click",()=>{if(savePending)return;if(motionLock)settleMotion();if(resultState){showStage(resultStageTarget());return;}setBattleCovered(true);(__wpNotifyMeasurement(), dom.leave.hidden=false);dom.leaveContinue.focus({preventScroll:true});});dom.leaveContinue.addEventListener("click",()=>{(__wpNotifyMeasurement(), dom.leave.hidden=true);setBattleCovered(false);dom.battleBack.focus({preventScroll:true});});dom.leaveStages.addEventListener("click",()=>{(__wpNotifyMeasurement(), dom.leave.hidden=true);setBattleCovered(false);showStage(stageIndex);});
  function commitResultDecision(action){if(savePending||resultDecisionCommitted||dom.result.hidden)return false;resultDecisionCommitted=true;action();return true}
  function resultAnalyticsPayload(){const endless=stageIndex===INFINITE_INDEX;return{stage:endless?"infinite":stageIndex+1,mode:endless?"endless":"mission",result:resultState,score,moves};}
  document.addEventListener("click",event=>setInputType(clickInputType(event)),true);document.addEventListener("keydown",()=>setInputType("keyboard"),true);document.addEventListener("pointerdown",()=>setInputType("pointer"),true);
  dom.undo.addEventListener("click",undo);dom.restart.addEventListener("click",restart);dom.hint.addEventListener("click",showHint);document.querySelectorAll("[data-direction]").forEach(button=>button.addEventListener("click",()=>performMove(button.dataset.direction)));dom.retry.addEventListener("click",()=>commitResultDecision(()=>{const payload=resultAnalyticsPayload();trackFunnel("retry_start",{...payload,source:"result_retry"});__wpReplayStart(() => startStage(stageIndex,"result_retry"));}));dom.resultStages.addEventListener("click",()=>commitResultDecision(()=>{const payload=resultAnalyticsPayload();track("game_result_menu",payload);trackFunnel("result_to_missions",payload);showStage(resultStageTarget());}));dom.next.addEventListener("click",()=>commitResultDecision(()=>{const payload=resultAnalyticsPayload(),nextStage=Math.min(levels.length-1,stageIndex+1);track("game_next_stage",{...payload,next_stage:nextStage+1});startStage(nextStage,"next_stage");}));dom.tutorialClose.addEventListener("click",closeTutorial);dom.tutorialStart.addEventListener("click",()=>{closeTutorial();startStage(0,"tutorial");});
  dom.locale.addEventListener("change",event=>{
    const next=dom.locale.value,api=window.WonderI18n;
    // This owned control uses the canonical route API once. Do not also let
    // the shared Guide's legacy bubbling bridge navigate the same choice.
    if(/^https?:$/.test(location.protocol)&&SEGMENTS[next]&&typeof api?.setLocale==="function"){event.stopPropagation();api.setLocale(next);return;}
    if(/^https?:$/.test(location.protocol)&&SEGMENTS[next]&&LOCALE_SEGMENTS[firstSegment]){event.stopPropagation();location.href=`/${SEGMENTS[next]}/games/animal-2048/${location.search}${location.hash}`;return;}
    if(!LOCALIZED_STRINGS[next])return;locale=next;writeStorage("weightPlayLocale",locale);setTimeout(applyLocale,0);
  });
  // The routed Main proxy must not retag the old document before navigation.
  dom.main.querySelector("#wp-frame-main-locale")?.addEventListener("change",event=>{if(/^https?:$/.test(location.protocol))event.stopPropagation();});
  const cancelSwipe=(pointerId=null)=>{if(!swipeStart||(pointerId!==null&&swipeStart.id!==pointerId))return false;const owner=swipeStart.id;swipeStart=null;try{if(dom.board.hasPointerCapture?.(owner))dom.board.releasePointerCapture(owner);}catch{}return true;};
  dom.board.addEventListener("pointerdown",event=>{if(swipeStart||event.isPrimary===false||(event.pointerType==="mouse"&&event.button!==0))return;swipeStart={x:event.clientX,y:event.clientY,id:event.pointerId};try{dom.board.setPointerCapture?.(event.pointerId);}catch{}});dom.board.addEventListener("pointerup",event=>{if(!swipeStart||swipeStart.id!==event.pointerId)return;const dx=event.clientX-swipeStart.x,dy=event.clientY-swipeStart.y;cancelSwipe(event.pointerId);if(Math.max(Math.abs(dx),Math.abs(dy))<24)return;performMove(Math.abs(dx)>Math.abs(dy)?dx>0?"right":"left":dy>0?"down":"up");});dom.board.addEventListener("pointercancel",event=>cancelSwipe(event.pointerId));dom.board.addEventListener("lostpointercapture",event=>cancelSwipe(event.pointerId));window.addEventListener("blur",()=>cancelSwipe());window.addEventListener("pagehide",()=>cancelSwipe());document.addEventListener("visibilitychange",()=>{if(document.hidden)cancelSwipe();});
  document.addEventListener("keydown",event=>{if(event.defaultPrevented||event.target.closest?.("[data-wp-preferences]"))return;if(!dom.leave.hidden){if(event.key==="Escape"){event.preventDefault();dom.leaveContinue.click();}return;}if(document.body.dataset.screen!=="battle"||!dom.result.hidden||!homeHelpPanel.hidden)return;const map={ArrowUp:"up",w:"up",W:"up",ArrowDown:"down",s:"down",S:"down",ArrowLeft:"left",a:"left",A:"left",ArrowRight:"right",d:"right",D:"right"};if(map[event.key]){event.preventDefault();performMove(map[event.key]);}else if(event.key==="u"||event.key==="U"){event.preventDefault();undo();}else if(event.key==="r"||event.key==="R"){event.preventDefault();restart();}else if(event.key==="h"||event.key==="H"){event.preventDefault();showHint();}});
  dom.start.addEventListener("click",()=>{if(document.body.dataset.screen==="stage"&&!dom.tutorial.hidden)dom.tutorialStart.focus({preventScroll:true});});
  document.addEventListener("keydown",event=>{const panel=!dom.tutorial.hidden?dom.tutorial:!homeHelpPanel.hidden?homeHelpPanel:!dom.leave.hidden?dom.leave:!dom.result.hidden?dom.result:null;if(!panel)return;if(event.key==="Escape"){event.preventDefault();event.stopImmediatePropagation();if(panel===dom.tutorial)closeTutorial();else if(panel===homeHelpPanel)closeNurseryHelp();else if(panel===dom.leave)dom.leaveContinue.click();else dom.resultStages.click();return;}if(event.key!=="Tab")return;const controls=[...panel.querySelectorAll("button:not([disabled]),a[href],select,[tabindex]:not([tabindex='-1'])")].filter(node=>node.getClientRects().length);if(!controls.length)return;const first=controls[0],last=controls.at(-1);if(!panel.contains(document.activeElement)){event.preventDefault();first.focus();}else if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}event.stopImmediatePropagation();},true);
  let resultWindowFocused=true;
  window.addEventListener("blur",()=>{resultWindowFocused=false;suspendResultReveal();});
  window.addEventListener("focus",()=>{resultWindowFocused=true;if(!document.hidden)resumeResultReveal();});
  window.addEventListener("pagehide",suspendResultReveal);
  window.addEventListener("pageshow",()=>{if(resultWindowFocused&&!document.hidden)resumeResultReveal();});
  document.addEventListener("visibilitychange",()=>{if(document.hidden)suspendResultReveal();else if(resultWindowFocused)resumeResultReveal();});

  window.Animal2048Navigation=Object.freeze({
    enterInfiniteForest:()=>startStage(INFINITE_INDEX,"stage_select")
  });
  window.__animal2048Smoke={
    levels:levels.map(level=>({index:level.index,type:level.type,target:level.target,limit:level.limit,blocked:[...level.blocked],start:[...level.start],seed:level.seed>>>0,checkpoint:level.checkpoint||null,nests:level.nests?JSON.parse(JSON.stringify(level.nests)):null})),
    infiniteIndex:INFINITE_INDEX,
    showStage,setStageMode,startStage,performMove,settleMotion,undo,bestDirection,
    simulateMove:(source,direction,blocked=[])=>moveBoard(source,direction,new Set(blocked)),
    setState:(state={})=>{discardMotion();if(Array.isArray(state.board)&&state.board.length===16)board=[...state.board];if(Number.isFinite(state.score))score=state.score;if(Number.isFinite(state.moves))moves=state.moves;if(Number.isFinite(state.merges))merges=state.merges;if(Number.isFinite(state.bestPairs))bestPairs=state.bestPairs;if(Number.isFinite(state.rngState))rngState=state.rngState>>>0;undoState=null;resultState="";(__wpNotifyMeasurement(), dom.result.hidden=true);renderBattle();},
    snapshot:()=>({screen:document.body.dataset.screen,stage:stageIndex===INFINITE_INDEX?"infinite":stageIndex+1,stageMode,mode:stageIndex===INFINITE_INDEX?"endless":"mission",board:[...board],score,moves,merges,bestPairs,rngState,homeCounts:[...homeCounts],runHighest,blocked:[...activeLevel().blocked],undo:Boolean(undoState),result:resultState,restarts,swipeOwner:swipeStart?.id??null,save:JSON.parse(JSON.stringify(save))}),
    forceResult:(win,reason)=>finish(Boolean(win),reason||"moves")
  };
  window.addEventListener("pagehide",()=>{discardMotion();clearHint();});
  applyLocale();renderStagePool();const assets=["../../assets/animal-2048/cover-block-v1.webp","../../assets/animal-2048/background-block-v1.webp","../../assets/animal-2048/stone-block-v1.webp",...tileAssets,"../../assets/animal-2048/orla-block-v1.webp"];let loaded=0;Promise.allSettled(assets.map(src=>new Promise(resolve=>{const img=new Image(),done=()=>{loaded++;dom.loadingFill.style.width=`${loaded/assets.length*100}%`;resolve();};img.onload=done;img.onerror=done;img.src=src;}))).then(()=>setTimeout(()=>{dom.loading.hidden=true;showMain();track("game_view");},180));
})();
