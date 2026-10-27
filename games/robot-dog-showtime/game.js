import {STAGES,validateStages} from './stage-data.js?v=20261027-showtime-act-polish1';
import {ShowtimeScene} from './stage-scene.js?v=20261027-showtime-act-polish1';
import {evaluatePlan,showText,spotlightAvailable,spotlightGoals,spotlightStageIds,formationSignature,replayShow,rememberShow,earnedMastery,ratingForShow} from './spotlight-remix.js?v=20261027-showtime-act-polish1';
import {guideCopy} from './guide.mjs?v=20261027-showtime-act-polish1';
const $=id=>document.getElementById(id), saveKey='wp-robot-dog-showtime-v2',stages=STAGES;
const language=document.documentElement.lang||'en',locale=({'zh-TW':'zh-Hant','zh-tw':'zh-Hant','zh-CN':'zh-Hans','zh-cn':'zh-Hans','pt-br':'pt-BR'}[language]||language);
const t=showText(locale),byCue={N:'↑',E:'→',S:'↓',W:'←',WAIT:'Ⅱ',BOW:'↘',WAVE:'〰'};
const loopbackHost=location.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(location.hostname);
const practicePageIsolation=loopbackHost&&new URLSearchParams(location.search).get('practice')==='1';
if(practicePageIsolation)document.body.dataset.localPracticePreview='true';
const sku='robot-dog-showtime:comet-costume';let audio=window.WeightPlayAudio?.createScope();
void window.WeightPlayAudio?.preload(['ui.click','board.move','board.undo','feedback.error','feedback.hint','game.start','result.win','shop.purchase']);
const blank=()=>({unlocked:1,cleared:[],drafts:{},draftSignatures:{},performances:{},mastered:[],remixCleared:[],remixFirstTry:[],remixAttempted:[],ratings:{},sessions:{},costume:'original'});
function readSave(){try{const raw=JSON.parse(localStorage.getItem(saveKey)||'{}');return{...blank(),unlocked:Math.max(1,Math.min(stages.length,Math.floor(Number(raw.unlocked)||1))),cleared:Array.isArray(raw.cleared)?raw.cleared.filter(n=>Number.isInteger(n)&&n>0&&n<=stages.length):[],drafts:raw.drafts&&typeof raw.drafts==='object'?raw.drafts:{},draftSignatures:raw.draftSignatures&&typeof raw.draftSignatures==='object'?raw.draftSignatures:{},performances:raw.performances&&typeof raw.performances==='object'&&!Array.isArray(raw.performances)?raw.performances:{},mastered:Array.isArray(raw.mastered)?raw.mastered.filter(id=>stages.some(s=>s.id===id&&s.mastery)):[],remixCleared:Array.isArray(raw.remixCleared)?raw.remixCleared.filter(n=>spotlightStageIds.includes(n)):[],remixFirstTry:Array.isArray(raw.remixFirstTry)?raw.remixFirstTry.filter(n=>spotlightStageIds.includes(n)):[],remixAttempted:Array.isArray(raw.remixAttempted)?raw.remixAttempted.filter(n=>spotlightStageIds.includes(n)):[],ratings:raw.ratings&&typeof raw.ratings==='object'?raw.ratings:{},sessions:raw.sessions&&typeof raw.sessions==='object'?raw.sessions:{},costume:raw.costume==='comet'?'comet':'original'}}catch{return blank()}}
const campaignSave=practicePageIsolation?null:readSave();
let save=campaignSave||blank(),screen='main',stageIndex=0,selectedActor=0,selectedBeat=0,plan=[],scene=null,sharedFrame=null,pageAlive=true,entryReady=false;
let activeRemix=false,practiceMode=false,practiceActive=false,practiceSave=null,practiceStartAuthorized=false,LocalPractice=null,practiceIntent=null,practiceInitialEntry=false;
let rehearsing=false,practicePending=false,playback=null,runFrame=0,runToken=0,modal=null,focusBeforeDialog=null,failedBeat=-1,playingBeat=-1,undo=[],attempts=0,hintsUsed=0,purchasing=false,purchaseConfirm=false,settledRating=0;
let trackScrollFrame=0;
const els={main:$('mainScreen'),stage:$('stageScreen'),battle:$('battleScreen'),label:$('battleLabel'),status:$('cueStatus'),canvas:$('stage3d'),fallback:$('renderFallback'),help:$('helpDialog'),leave:$('leaveDialog'),result:$('resultDialog')};
const currentStage=()=>stages[stageIndex],currentGoals=(stage=currentStage())=>activeRemix?spotlightGoals(stage.goals):stage.goals;
const draftId=()=>`${stageIndex+1}${activeRemix?':spotlight':''}`;
const name=actor=>t(actor?'fox':'pup'),cueName=cue=>({WAIT:t('wait'),BOW:t('bow'),WAVE:t('wave')}[cue]||byCue[cue]||t('defaultWait'));
const masteryText=stage=>stage.mastery?`${t('mastery')} · ${name(stage.mastery.actor)} · ${t('visit')} ${stage.mastery.visit+1}`:'';
const actNumber=stage=>Math.floor((stage.id-1)/5)+1;
const actName=stage=>t('act'+actNumber(stage));
const showName=stage=>stage.id%5===0?t('finale'+actNumber(stage)):actName(stage);
const formationText=stage=>(stage.checkpoints||[]).map(c=>`◇ ${t('beat')} ${c.beat+1} · ${name(0)} ${c.positions[0]+1} / ${name(1)} ${c.positions[1]+1}`).join(' · ');
function updateObjectives(){const s=currentStage(),text=[formationText(s),!activeRemix&&s.mastery?'◇ '+masteryText(s):''].filter(Boolean).join('\n');$('sceneObjective').textContent=text;$('sceneObjective').hidden=!text;$('arenaWrap').dataset.hasObjective=String(Boolean(text));scene?.setObjectives({mastery:activeRemix?null:s.mastery,checkpoints:s.checkpoints});}
const safeCount=value=>Number.isSafeInteger(value)&&value>=0?value:0;
function persist(){if(practicePageIsolation||practiceActive)return true;try{localStorage.setItem(saveKey,JSON.stringify(save));return true}catch{setStatus(t('storage'),true);return false}}
function setStatus(text,bad=false){els.status.textContent=text;els.status.dataset.kind=bad?'error':'info'}
function saveDraft(){if(practiceActive)return;save.drafts[draftId()]=plan.map(row=>[...row]);save.draftSignatures[draftId()]=formationSignature(currentStage(),currentGoals());save.sessions[draftId()]={attempts,hints:hintsUsed};persist()}
function renderMain(){const rating=Object.values(save.ratings).reduce((sum,n)=>sum+Math.min(3,safeCount(n)),0);$('mainProgress').textContent=`${t('stage')} ${save.unlocked} · ${save.cleared.length}/${stages.length} · ${rating}/${stages.length*3}${save.mastered.length?' · '+t('mastery')+' '+save.mastered.length+'/3':''}`}
function renderMap(){sharedFrame?.refreshStage(stageIndex)}
function syncScreen(next){screen=next;document.body.dataset.screen=next;els.main.hidden=next!=='main';els.stage.hidden=next!=='stage';els.battle.hidden=next!=='battle';$('gameGuide').hidden=next!=='main';sharedFrame?.frame.activate(next)}
function applyCostume(){scene?.setCostume(!practiceActive&&save.costume==='comet'&&window.WeightPlayWallet?.owns(sku)===true)}
function showBattleScene(){try{scene=new ShowtimeScene(els.canvas);applyCostume();scene.setAct(actNumber(currentStage())-1,currentStage().id%5===0);updateObjectives();preview();els.fallback.hidden=true}catch(error){console.error('Showtime renderer initialization failed',error);els.fallback.hidden=false}renderPlan()}
function destroyScene(){scene?.dispose();scene=null}
function rebuildScene(){destroyScene();const replacement=els.canvas.cloneNode(false);els.canvas.replaceWith(replacement);els.canvas=replacement;if(screen==='battle')showBattleScene()}
function emptyPracticeSave(){return blank()}
function startPracticeStage(id,options){const index=stages.findIndex(s=>String(s.id)===String(id));if(!pageAlive||index<0||options?.practice!==true||options?.rewards!==false||options?.persist!==false)return;if(!practiceInitialEntry&&(!practiceIntent||practiceIntent.id!==String(id)||practiceIntent.token!==runToken))return;practiceIntent=null;practicePending=false;practiceMode=true;practiceActive=true;practiceSave||=emptyPracticeSave();save=practiceSave;practiceStartAuthorized=true;startBattle(index,{practice:true})}
async function requestPracticeStage(id){if(!LocalPractice)return;const token=runToken;practiceIntent={id:String(id),token};practicePending=true;if(screen==='battle'){renderPlan();setStatus(t('loading'))}const accepted=await LocalPractice.challenge('robot-dog-showtime',id);if(!pageAlive)return;if(practiceIntent?.token===token&&practiceIntent.id===String(id)){practiceIntent=null;practicePending=false;if(runToken===token&&screen==='battle'){renderPlan();if(!accepted)setStatus(t('practice')+' · '+t('locked'),true)}}}
function exitPractice(){if(!practiceActive)return;practiceActive=false;practiceSave=null;save=campaignSave||blank();activeRemix=false;renderMain()}
function startBattle(index,{remix=false,practice=false}={}){
  if(index<0||index>=stages.length||(!practice&&index>=save.unlocked)||(practice&&(!practiceActive||!practiceStartAuthorized)))return;
  if(practice)practiceStartAuthorized=false;if(remix&&!spotlightAvailable(stages[index].id,save.cleared))return;
  cancelRehearsal();closeDialog();stageIndex=index;activeRemix=remix;selectedActor=0;selectedBeat=0;failedBeat=-1;playingBeat=-1;undo=[];
  const s=currentStage(),key=draftId(),signature=save.draftSignatures[key],draftCurrent=signature===formationSignature(s,currentGoals())||(!signature&&s.revision===1),draft=draftCurrent?save.drafts[key]:null,recorded=draft?null:replayShow(save,s,remix),source=draft||recorded,session=draft?save.sessions[key]:null;
  plan=Array.from({length:s.beats},(_,beat)=>[0,1].map(actor=>Object.hasOwn(byCue,source?.[beat]?.[actor])?source[beat][actor]:null));
  attempts=safeCount(session?.attempts);hintsUsed=safeCount(session?.hints);syncScreen('battle');scene?.clearFeedback();
  els.label.textContent=`${t('stage')} ${s.id} · ${showName(s)}${remix?' · '+t('mix'):''}`;
  const goals=currentGoals();$('dogGoal').textContent=`${t('pup')} · ${t('target')} ${goals[0]+1}`;$('foxGoal').textContent=`${t('fox')} · ${t('target')} ${goals[1]+1}`;
  $('routeMastery').textContent=!remix?masteryText(s):'';$('routeMastery').hidden=remix||!s.mastery;
  $('formationExplanation').textContent=formationText(s)?`${t('formationRule')} ${formationText(s)}`:'';$('formationExplanation').hidden=!s.checkpoints?.length;
  buildTracks();if(scene){scene.activate();applyCostume();preview()}else showBattleScene();scene?.setAct(actNumber(s)-1,s.id%5===0);updateObjectives();renderPlan();queueSelection(true);setStatus(recorded?t('recordedPlan'):s.checkpoints?.length?t('formationCue'):s.bow?t('finalBow'):s.mastery?masteryText(s):`${t('plan')} ${t('defaultWaitRule')}`);audio?.play('game.start');
  if(!practiceActive&&!practicePageIsolation)window.WonderAnalytics?.track('stage_start',{stage_id:s.id});
}
function buildTracks(){for(let actor=0;actor<2;actor++){const root=$(actor?'foxPlan':'dogPlan');root.replaceChildren();root.classList.toggle('fox',actor===1);root.setAttribute('aria-label',name(actor));for(let beat=0;beat<currentStage().beats;beat++){const button=document.createElement('button');button.type='button';button.className='cue-cell';button.dataset.actor=String(actor);button.dataset.beat=String(beat);const small=document.createElement('small');small.textContent=String(beat+1);const strong=document.createElement('strong');button.append(small,strong);root.append(button)}}}
function renderPlan(){
  const busy=rehearsing||practicePending;
  for(const button of document.querySelectorAll('.cue-cell')){const actor=Number(button.dataset.actor),beat=Number(button.dataset.beat),cue=plan[beat]?.[actor];button.querySelector('strong').textContent=byCue[cue]||byCue.WAIT;button.dataset.default=String(!cue);button.setAttribute('aria-label',`${name(actor)} · ${t('beat')} ${beat+1} · ${cueName(cue)}`);button.setAttribute('aria-pressed',String(selectedActor===actor&&selectedBeat===beat));button.dataset.failed=String(failedBeat===beat);button.dataset.playing=String(playingBeat===beat);button.disabled=busy}
  $('selectDog').setAttribute('aria-pressed',String(selectedActor===0));$('selectFox').setAttribute('aria-pressed',String(selectedActor===1));
  for(const b of document.querySelectorAll('[data-cue],#clearCue,#resetPlan,#selectDog,#selectFox'))b.disabled=busy;
  $('helpButton').disabled=practicePending;$('undoCue').disabled=busy||undo.length===0;$('rehearseButton').disabled=practicePending||!scene||!els.fallback.hidden;$('rehearseButton').textContent=t(rehearsing?'stop':'rehearse');
  $('sceneBeat').textContent=`${t('beat')} ${(playingBeat>=0?playingBeat:selectedBeat)+1} / ${currentStage().beats} · ${name(selectedActor)}`;
}
function selectCue(actor,beat){if(rehearsing)return;selectedActor=actor;selectedBeat=beat;renderPlan();preview();queueSelection();setStatus(`${name(actor)} · ${t('beat')} ${beat+1}`)}
function chooseActor(actor){selectCue(actor,selectedBeat)}
function remember(){undo.push({plan:plan.map(row=>[...row]),actor:selectedActor,beat:selectedBeat});if(undo.length>60)undo.shift()}
function preview(){if(!scene||screen!=='battle')return;const s=currentStage(),evaluation=evaluatePlan(s,plan,currentGoals());const before=selectedBeat>0?evaluation.frames[Math.min(selectedBeat-1,evaluation.frames.length-1)]?.positions:null;scene.setState({positions:before||s.starts,goals:currentGoals(),walls:s.walls,activeActor:selectedActor});scene.setPreview(evaluation.frames,s.starts)}
function setCue(cue){if(rehearsing||practicePending||!Object.hasOwn(byCue,cue))return;remember();const a=selectedActor,b=selectedBeat;plan[b][a]=cue;failedBeat=-1;saveDraft();const target=$(a?'foxPlan':'dogPlan').children[b];target.dataset.placed='true';target.addEventListener('animationend',()=>delete target.dataset.placed,{once:true});
  if(selectedBeat<plan.length-1)selectedBeat++;else if(selectedActor===0){selectedActor=1;selectedBeat=0}
  renderPlan();preview();setStatus(`${name(a)} · ${t('beat')} ${b+1} · ${cueName(cue)}`);audio?.play('board.move');scrollSelection();
}
function scrollSelection(){
  const selected=document.querySelector('.cue-cell[aria-pressed=true]');if(!selected)return;
  const tracks=selected.closest('.tracks'),label=selected.closest('.track-line').querySelector('.actor-label');
  const r=selected.getBoundingClientRect(),box=tracks.getBoundingClientRect(),scale=box.width/tracks.clientWidth;if(!Number.isFinite(scale)||scale<=0)return;
  const rtl=getComputedStyle(tracks).direction==='rtl',edge=label.getBoundingClientRect(),left=rtl?box.left+4*scale:edge.right+4*scale,right=rtl?edge.left-4*scale:box.right-4*scale;
  if(r.right>right)tracks.scrollLeft+=(r.right-right)/scale;else if(r.left<left)tracks.scrollLeft-=(left-r.left)/scale;
  if(Math.abs(tracks.scrollLeft)<.01)tracks.scrollLeft=0;
}
function queueSelection(reset=false){cancelAnimationFrame(trackScrollFrame);if(reset){const tracks=document.querySelector('.tracks');if(tracks)tracks.scrollLeft=0}trackScrollFrame=requestAnimationFrame(()=>{trackScrollFrame=requestAnimationFrame(()=>{trackScrollFrame=0;if(screen==='battle'&&!modal)scrollSelection()})})}
function clearCue(){if(rehearsing)return;remember();plan[selectedBeat][selectedActor]=null;failedBeat=-1;saveDraft();renderPlan();preview();audio?.play('board.undo')}
function resetPlan(){if(rehearsing)return;remember();plan=Array.from({length:currentStage().beats},()=>[null,null]);failedBeat=-1;selectedBeat=0;saveDraft();renderPlan();preview();queueSelection(true);setStatus(t('plan'));audio?.play('board.undo')}
function undoCue(){if(rehearsing||!undo.length)return;const previous=undo.pop();plan=previous.plan;selectedActor=previous.actor;selectedBeat=previous.beat;failedBeat=-1;saveDraft();renderPlan();preview();queueSelection();audio?.play('board.undo')}
function hint(){if(rehearsing)return;remember();const s=currentStage();if(activeRemix){setStatus(t('mix'),true);return}plan[selectedBeat]=[...s.solution[selectedBeat]];hintsUsed++;saveDraft();closeDialog();renderPlan();preview();setStatus(t('hintRule'));audio?.play('feedback.hint')}
const settingsOpen=()=>Boolean(document.querySelector('#battleScreen .wp-frame-popover:not([hidden])'));
function cancelRehearsal(){runToken++;practiceIntent=null;practicePending=false;cancelAnimationFrame(runFrame);cancelAnimationFrame(trackScrollFrame);trackScrollFrame=0;runFrame=0;playback=null;rehearsing=false;playingBeat=-1;scene?.clearFeedback();audio?.stop()}
async function rehearse(){
  if(rehearsing){cancelRehearsal();renderPlan();preview();setStatus(t('plan'));return}
  if(!scene||modal||practicePending)return;
  const token=++runToken;
  if(practiceActive&&!await LocalPractice.validate()){setStatus(t('practice')+' · '+t('locked'),true);return}
  if(token!==runToken||screen!=='battle')return;
  attempts++;saveDraft();rehearsing=true;failedBeat=-1;playingBeat=-1;
  const s=currentStage(),result=evaluatePlan(s,plan,currentGoals());playback={token,result,index:0,elapsed:560,last:0};
  scene.setState({positions:s.starts,goals:currentGoals(),walls:s.walls});renderPlan();runFrame=requestAnimationFrame(advanceRehearsal);
}
function advanceRehearsal(now){
  if(!playback||playback.token!==runToken||screen!=='battle')return;
  const paused=document.hidden||Boolean(modal)||settingsOpen();scene?.setPaused(paused);const p=playback;
  if(paused){p.last=0;runFrame=requestAnimationFrame(advanceRehearsal);return}
  const delta=p.last?Math.min(40,now-p.last):0;p.last=now;p.elapsed+=delta;
  const duration=matchMedia('(prefers-reduced-motion: reduce)').matches?180:560;
  if(p.elapsed>=duration){p.elapsed=0;if(p.index>=p.result.frames.length){finishRehearsal(p.result);return}const frame=p.result.frames[p.index++];playingBeat=frame.beat;scene.setState({positions:frame.positions,goals:currentGoals(),walls:currentStage().walls,gestures:frame.cues,activeActor:selectedActor,animate:true});renderPlan();setStatus(`${t('beat')} ${frame.beat+1} · ${cueName(frame.cues[0])} / ${cueName(frame.cues[1])}`);audio?.play('board.move')}
  runFrame=requestAnimationFrame(advanceRehearsal);
}
function finishRehearsal(result){
  playback=null;rehearsing=false;playingBeat=-1;
  if(!result.success){const failure=result.failure;failedBeat=failure.beat;selectedBeat=failure.beat;selectedActor=failure.actor;recordRemixAttempt();renderPlan();scrollSelection();setStatus(`${t('beat')} ${failure.beat+1} · ${name(failure.actor)} · ${t(({EDGE:'edge',BLOCKED:'blocked',COLLISION:'collision',CROSSING:'crossing',FORMATION:'formation',BOW:'finalBow',CUE:'plan',CHECKPOINT:'formationCue'})[failure.code])}`,true);audio?.play('feedback.error');$('rehearseButton').focus();return}
  const stage=currentStage();settledRating=ratingForShow(hintsUsed);
  if(practiceActive)rememberShow(save,stage,plan,{remix:activeRemix,rating:settledRating});
  const saved=clearStage(stage);scene.setState({positions:result.positions,goals:currentGoals(),walls:stage.walls,gestures:['BOW','BOW']});scene.celebrate();audio?.play('result.win');renderPlan();openResult(stage,saved);
}
function recordRemixAttempt(){if(activeRemix&&!practiceActive&&!save.remixAttempted.includes(currentStage().id)){save.remixAttempted.push(currentStage().id);persist()}}
function clearStage(stage){
  if(practiceActive)return true;
  rememberShow(save,stage,plan,{remix:activeRemix,rating:settledRating});
  if(activeRemix){if(!save.remixCleared.includes(stage.id))save.remixCleared.push(stage.id);if(attempts===1&&!save.remixFirstTry.includes(stage.id))save.remixFirstTry.push(stage.id);recordRemixAttempt()}
  else{if(!save.cleared.includes(stage.id))save.cleared.push(stage.id);save.unlocked=Math.max(save.unlocked,Math.min(stages.length,stage.id+1));save.ratings[stage.id]=Math.max(Math.min(3,safeCount(save.ratings[stage.id])),settledRating)}
  delete save.drafts[draftId()];delete save.draftSignatures[draftId()];delete save.sessions[draftId()];const saved=persist();renderMain();return saved;
}
function openResult(stage,saved){
  els.battle.dataset.showResult='true';
  scene?.setObjectives();
  const best=save.performances[draftId()]?.rating||settledRating,mastered=!activeRemix&&earnedMastery(stage,plan);
  $('resultKicker').textContent=`${practiceActive?t('practice'):activeRemix?t('mix'):t('stage')} ${stage.id}`;$('showRating').textContent=`${settledRating} / 3`;$('resultTitle').textContent=t(settledRating===3?'perfect':settledRating===2?'smooth':'encore');$('resultText').textContent=[`${t('cleared')} · ${practiceActive?t('practice'):saved?t('saved'):t('storage')}`,`${t('hint')} · ${hintsUsed}  ·  ${t('best')} ${best}/3`,!activeRemix&&stage.mastery?mastered?`✓ ${t('mastered')}`:masteryText(stage):''].filter(Boolean).join('\n');
  $('nextStage').disabled=stage.id===stages.length;openDialog(els.result,stage.id===stages.length?'replayStage':'nextStage');scene?.setPaused(false);
  $('resultKicker').textContent=`${practiceActive?t('practice'):activeRemix?t('mix'):t('stage')} ${stage.id} · ${showName(stage)}`;
  if(stage.id%5===0&&stage.id<stages.length)$('resultText').textContent+=`\n${t('next')} · ${t('act'+(actNumber(stage)+1))}`;
  if(saved&&!practiceActive){const reward=window.WonderAnalytics?.completeStage(stage.id);window.ShowResultGet?.('robot-dog-showtime',reward?.credited===true);if(reward?.credited===true)window.WeightPlayCastle?.dismissRewardNotice('robot-dog-showtime')}else window.ShowResultGet?.('robot-dog-showtime',false);
}
function setBackgroundInert(value){const owner=screen==='stage'?els.stage:els.battle;for(const child of owner.children)if(!child.classList.contains('dialog'))child.inert=value}
function openDialog(dialog,focusId){if(modal)return;modal=dialog;focusBeforeDialog=document.activeElement;dialog.hidden=false;setBackgroundInert(true);scene?.setPaused(true);$(focusId)?.focus()}
function closeDialog(){if(!modal)return;const previous=modal;previous.hidden=true;modal=null;if(previous===els.result)delete els.battle.dataset.showResult;setBackgroundInert(false);scene?.setPaused(document.hidden);if(focusBeforeDialog?.isConnected&&!focusBeforeDialog.closest('[hidden]'))focusBeforeDialog.focus();focusBeforeDialog=null}
function openHelp(){$('hintButton').disabled=activeRemix||rehearsing;openDialog(els.help,'closeHelp')}
function goMap(){cancelRehearsal();closeDialog();scene?.clearFeedback();scene?.suspend();syncScreen('stage');renderMap();$('stageBack').focus()}
function openWardrobe(){if(practiceMode||practiceActive)return;purchaseConfirm=false;$('purchaseStatus').textContent='';refreshWardrobe();openDialog($('wardrobeDialog'),'closeWardrobe')}
function refreshWardrobe(){const wallet=window.WeightPlayWallet;let balance=0,owned=false;try{balance=wallet?.read().diamonds||0;owned=wallet?.owns(sku)===true}catch{}$('walletBalance').textContent=`${t('balance')} · ${balance}`;$('costumeCost').textContent=`${t('permanent')} · 12 ${t('balance')}`;$('costumeOwnership').textContent=t(owned?'owned':'notOwned');$('buyCostume').textContent=owned?save.costume==='comet'?t('equipped'):t('equip'):`${t('buy')} · 12`;$('buyCostume').disabled=purchasing||(owned&&save.costume==='comet');$('baseCostume').textContent=save.costume==='original'?`${t('base')} · ${t('equipped')}`:t('base');$('baseCostume').disabled=purchasing||save.costume==='original';$('closeWardrobe').disabled=purchasing;if(purchasing)$('purchaseStatus').textContent=t('loading')}
async function buyCostume(){
  if(purchasing||practiceMode||practiceActive)return;const wallet=window.WeightPlayWallet;
  if(!wallet){$('purchaseStatus').textContent=t('storage');return}
  let owns=false;try{owns=wallet.owns(sku)}catch{$('purchaseStatus').textContent=t('storage');return}
  if(owns){save.costume='comet';persist();refreshWardrobe();return}
  if(!purchaseConfirm){purchaseConfirm=true;$('purchaseStatus').textContent=`${t('buy')} · ${t('permanent')} · 12 ${t('balance')}?`;$('buyCostume').textContent=`${t('buy')} · 12`;return}
  purchasing=true;refreshWardrobe();const result=await wallet.purchasePermanent(sku,12);purchasing=false;purchaseConfirm=false;
  if(result.ok){save.costume='comet';persist();$('purchaseStatus').textContent=`${t('saved')} · ${t('permanent')}`;if(!result.alreadyOwned)audio?.play('shop.purchase')}
  else{$('purchaseStatus').textContent=t(result.reason==='insufficient'?'insufficient':'storage');audio?.play('feedback.error')}
  refreshWardrobe();
}
function localize(){
  const labels={selectDog:'pup',selectFox:'fox',undoCue:'undo',resetPlan:'reset',rehearseButton:'rehearse',helpTitle:'help',closeHelp:'continue',hintButton:'hint',continueBattle:'continue',returnMap:'stages',leaveTitle:'continue',resultMap:'stages',nextStage:'next',replayStage:'replay',wardrobeAction:'wardrobe',wardrobeTitle:'wardrobe',costumeTitle:'costume',closeWardrobe:'continue'};
  for(const [id,key]of Object.entries(labels))$(id).textContent=t(key);
  for(const cue of ['WAIT','BOW','WAVE'])document.querySelector(`[data-cue=${cue}]`).textContent=cueName(cue);
  $('helpButton').setAttribute('aria-label',t('help'));$('hintExplanation').textContent=t('hintAction');$('masteryExplanation').textContent=t('masteryRule');$('costumeEffect').textContent=t('costumeRule');$('diamondSource').textContent=t('diamondSource');
  document.querySelector('.main-summary').textContent=t('summary');const guide=guideCopy(locale);$('helpSteps').replaceChildren(...[...guide.slice(7,10),t('defaultWaitRule')].map(text=>{const li=document.createElement('li');li.textContent=text;return li}));
  $('leaveText').textContent=t('leave');$('retryRender').textContent=t('replay');$('renderErrorText').textContent=t('renderError');$('clearCue').setAttribute('aria-label',t('clear'));
  document.querySelector('.costume-art img').alt=t('costume');
}
$('startButton').addEventListener('click',()=>{if(!entryReady)return;stageIndex=practiceMode||practiceActive?0:Math.max(0,save.unlocked-1);syncScreen('stage');renderMap();$('stageBack').focus()});
$('stageBack').addEventListener('click',()=>{closeDialog();exitPractice();syncScreen('main');renderMain();$('startButton').focus()});
$('selectDog').addEventListener('click',()=>chooseActor(0));$('selectFox').addEventListener('click',()=>chooseActor(1));
for(const button of document.querySelectorAll('[data-cue]'))button.addEventListener('click',()=>setCue(button.dataset.cue));
for(const id of ['dogPlan','foxPlan'])$(id).addEventListener('click',event=>{const button=event.target.closest('.cue-cell');if(button)selectCue(Number(button.dataset.actor),Number(button.dataset.beat))});
$('clearCue').addEventListener('click',clearCue);$('undoCue').addEventListener('click',undoCue);$('resetPlan').addEventListener('click',resetPlan);$('rehearseButton').addEventListener('click',()=>void rehearse());
$('battleBack').addEventListener('click',()=>{if(practicePending){cancelRehearsal();renderPlan()}openDialog(els.leave,'continueBattle')});$('continueBattle').addEventListener('click',closeDialog);$('returnMap').addEventListener('click',goMap);$('closeHelp').addEventListener('click',closeDialog);$('hintButton').addEventListener('click',hint);
$('resultMap').addEventListener('click',()=>{stageIndex=Math.max(0,save.unlocked-1);goMap()});$('replayStage').addEventListener('click',()=>{const index=stageIndex,remix=activeRemix;closeDialog();if(practiceActive)void requestPracticeStage(index+1);else startBattle(index,{remix})});
$('nextStage').addEventListener('click',()=>{const next=stageIndex+1;closeDialog();if(next<stages.length){if(practiceActive)void requestPracticeStage(next+1);else startBattle(next)}});
$('wardrobeAction').addEventListener('click',openWardrobe);$('closeWardrobe').addEventListener('click',closeDialog);$('buyCostume').addEventListener('click',()=>void buyCostume());$('baseCostume').addEventListener('click',()=>{save.costume='original';persist();refreshWardrobe()});
$('retryRender').addEventListener('click',async()=>{if(practiceActive&&!await LocalPractice?.validate()){setStatus(t('practice')+' · '+t('locked'),true);return}if(!pageAlive||screen!=='battle')return;cancelRehearsal();rebuildScene()});
$('battleLive').addEventListener('showtime-render-error',()=>{cancelRehearsal();els.fallback.hidden=false;renderPlan()},true);
$('battleLive').addEventListener('pointerup',event=>{if(event.target!==els.canvas||rehearsing||modal||!scene)return;const cell=scene.pickCell(event.clientX,event.clientY);if(cell===null)return;const evaluation=evaluatePlan(currentStage(),plan,currentGoals()),before=selectedBeat>0?evaluation.frames[Math.min(selectedBeat-1,evaluation.frames.length-1)]?.positions:null,from=(before||currentStage().starts)[selectedActor],dx=cell%4-from%4,dy=Math.floor(cell/4)-Math.floor(from/4);const cue=dx===0&&dy===0?'WAIT':Math.abs(dx)+Math.abs(dy)!==1?null:dx===1?'E':dx===-1?'W':dy===1?'S':'N';if(cue)setCue(cue);else{setStatus(t('plan'),true);audio?.play('feedback.error')}});
window.addEventListener('keydown',event=>{
  if(modal){if(event.key==='Escape'&&modal!==els.result&&!purchasing){event.preventDefault();closeDialog()}if(event.key==='Tab'){const buttons=[...modal.querySelectorAll('button:not(:disabled)')].filter(b=>!b.hidden);const index=buttons.indexOf(document.activeElement);if(event.shiftKey&&index<=0){event.preventDefault();buttons.at(-1)?.focus()}else if(!event.shiftKey&&index===buttons.length-1){event.preventDefault();buttons[0]?.focus()}}return}
  if(screen!=='battle'||rehearsing||practicePending||settingsOpen())return;if(event.key===' '&&event.target.closest('button,input,select'))return;const cue=({ArrowUp:'N',ArrowRight:'E',ArrowDown:'S',ArrowLeft:'W',' ':'WAIT',b:'BOW',w:'WAVE'})[event.key];if(cue){event.preventDefault();setCue(cue)}
});
window.addEventListener('visibilitychange',()=>{if(playback)playback.last=0;scene?.setPaused(document.hidden||Boolean(modal&&modal!==els.result));if(document.hidden)audio?.stop()});
window.addEventListener('resize',()=>{if(screen==='battle')queueSelection()},{passive:true});
window.addEventListener('pagehide',()=>{pageAlive=false;cancelRehearsal();destroyScene();audio?.dispose()});
window.addEventListener('pageshow',event=>{if(!event.persisted)return;pageAlive=true;audio=window.WeightPlayAudio?.createScope();if(screen==='battle')rebuildScene();sharedFrame?.frame.activate(screen)});
localize();
sharedFrame=window.mountRobotDogShowtimeFrame({stages,selected:stageIndex,getState:()=>({save,practiceMode,practiceActive}),text:t,isSpotlightAvailable:spotlightAvailable,onSelect:index=>{stageIndex=index},onStart:index=>{if(practiceMode||practiceActive){void requestPracticeStage(stages[index].id);return}startBattle(index)},onSpotlight:()=>startBattle(stageIndex,{remix:true}),onHelp:openHelp});
const officialTitle=window.WEIGHTPLAY_GAME_TITLES?.['robot-dog-showtime']?.[locale];
if(officialTitle)document.querySelector('#mainScreen [data-wp-game-title]').textContent=officialTitle;
renderMain();const authoringIssues=validateStages();if(authoringIssues.length)console.error('Stage data authoring issues',authoringIssues);
function entryLoader(){
  if(window.WeightPlayGameEntryLoader?.begin)return Promise.resolve(window.WeightPlayGameEntryLoader);
  const script=document.querySelector('script[src*="/game-entry-loader.js"]');
  if(!script)return Promise.reject(Error('SHARED_ENTRY_LOADER_MISSING'));
  return new Promise((resolve,reject)=>{
    const finish=error=>{clearTimeout(timer);script.removeEventListener('load',loaded);script.removeEventListener('error',failed);window.removeEventListener('pagehide',cancelled);if(error)reject(error);else resolve(window.WeightPlayGameEntryLoader)};
    const loaded=()=>finish(window.WeightPlayGameEntryLoader?.begin?null:Error('SHARED_ENTRY_LOADER_API_MISSING'));
    const failed=()=>finish(Error('SHARED_ENTRY_LOADER_FAILED')),cancelled=()=>finish(Error('PAGE_CLOSED'));
    const timer=setTimeout(failed,8000);script.addEventListener('load',loaded,{once:true});script.addEventListener('error',failed,{once:true});window.addEventListener('pagehide',cancelled,{once:true});
  });
}
async function initializeEntry(){
  const loader=await entryLoader();if(!pageAlive)return;loader.begin();
  if(practicePageIsolation){
    const {LocalPractice:api}=await import('../../src/game-local-practice.mjs');if(!pageAlive)return;LocalPractice=api;
    practiceInitialEntry=true;
    try{await api.register({gameId:'robot-dog-showtime',stageIds:stages.map(s=>s.id),enable:enabled=>{practiceMode=enabled===true;if(screen==='stage')renderMap()},startStage:(id,options)=>startPracticeStage(id,options)})}finally{practiceInitialEntry=false}
  }
  if(!pageAlive)return;
  if(screen==='battle'){if(!scene||!els.fallback.hidden){loader.fail(t('renderError'));return}scene.render(performance.now())}
  else await document.querySelector('[data-wp-frame-poster]').decode();
  if(pageAlive){entryReady=true;$('startButton').disabled=false;loader.ready()}
}
void initializeEntry().catch(error=>{if(!pageAlive)return;console.error('Showtime entry failed',error);window.WeightPlayGameEntryLoader?.fail(t('renderError'))});
