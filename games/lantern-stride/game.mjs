import {resolveLocale,translate,guideExtras} from './i18n.mjs?v=15';
import {LocalPractice} from '../../src/game-local-practice.mjs';
import {STAGES} from './stage-config.mjs';
import {createRace,advance,step,segmentFor,useFeather,useOptionalDash,bridgeOpen,rhythmRange,starTimeLimit,FORK_CHOICE_GRACE_SECONDS,activeLandmark} from './simulation.mjs?v=15';
import {createStore,highestUnlocked} from './save.mjs';
import {createRenderer} from './render.mjs?v=15';


function ghostDistance(race){
  const ghost=race.ghost;if(!ghost)return null;
  if(race.elapsed>=ghost.time)return race.stage.distance;
  const index=Math.floor(race.elapsed), start=ghost.trace.samples[index]/10, endTime=Math.min(index+1,ghost.time);
  const end=index+1<ghost.trace.samples.length?ghost.trace.samples[index+1]/10:race.stage.distance;
  return start+(end-start)*(race.elapsed-index)/(endTime-index);
}
function recordDistance(race){while(race.trace.samples.length<=Math.floor(race.elapsed))race.trace.samples.push(Math.round(race.distance*10));}
const W=window, $=id=>document.getElementById(id), store=createStore();
const labels={plain:'plain',slow:'slow',fast:'fast',headfast:'headfast',headwind:'headwind',tailwind:'tailwind',left:'gateLeft',right:'gateRight',bridge:'bridge',fork:'choosePace',forkleft:'chooseLeft',forkright:'chooseRight',forkwindbridge:'windBridge',forkgates:'chooseGate',forkfast:'chooseLeft',forkslow:'chooseRight',forkmaster:'bridgeGate'};
const goals={finish:'goalFinish',steady3:'goalSteady',balance40:'goalBalance40',combo4:'goalCombo','steady-no-stumble':'goalNoStumble',balance35:'goalBalance35',balance30:'goalBalance30',stumble2:'goalStumbles',gates:'goalGates'};
const feedback={landmark:'good',steady:'good',timing:'timingAdjust','same-foot':'alternate','bridge-closed':'bridgeWait','gate-missed':'reasonGate','gate-left':'gateLeft','gate-right':'gateRight',stumble:'stumble',feather:'featherUsed','feather-burst':'featherBurst','dash-burst':'dashFeedback'};
let locale=resolveLocale(),timingHint=null,ghostVisible=true;const tr=(key,vars)=>translate(locale,key,vars);
function bestLabel(record){return record&&Number.isFinite(record.bestTime)?tr('personalBest',{time:`\u2066${record.bestTime.toFixed(1)} s\u2069`}):'';}
function savedMessage(){const best=bestLabel(store.progress.records[selected]);return [tr('progressSaved'),best,resultReward?tr('firstClearReward'):''].filter(Boolean).join(' · ');}
let relatedRenderSerial=0;
function renderRelated(html){
  const holder=$('gameGuideRelated'),serial=++relatedRenderSerial;
  holder.hidden=true;holder.innerHTML=html;
  const refresh=W.WeightPlayGameInfo?.refreshStaticRelatedGuide;
  if(typeof refresh!=='function'){holder.replaceChildren();return;}
  Promise.resolve(refresh($('gameGuide'))).then(()=>{
    if(serial===relatedRenderSerial)holder.hidden=!holder.querySelector('.game-info-related-card');
  }).catch(()=>{if(serial===relatedRenderSerial){holder.replaceChildren();holder.hidden=true;}});
}
function localize(){
  document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';
  for(const node of document.querySelectorAll('[data-t]'))node.textContent=tr(node.dataset.t);
  for(const node of document.querySelectorAll('[data-t-aria]'))node.setAttribute('aria-label',tr(node.dataset.tAria));
  for(const node of document.querySelectorAll('[data-t-alt]'))node.setAttribute('alt',tr(node.dataset.tAlt));
  const extras=guideExtras(locale);$('gameGuideFaq').innerHTML=extras.faqHtml;renderRelated(extras.relatedHtml);$('gameGuide').dataset.wpGuideLocale=locale;$('gameGuide').setAttribute('aria-label',tr('guideTitle'));
  document.querySelector('meta[name=description]')?.setAttribute('content',tr('summary'));
  $('shoeStatus').textContent=shoeStatusKey?tr(shoeStatusKey):'';$('shopStatus').textContent=shopStatusKey?tr(shopStatusKey):'';
  if(modal==='resultPanel'&&!practiceRun)$('saveStatus').textContent=saved?savedMessage():pending&&!pending.busy?tr('saveFailed'):'';
  const title=W.WEIGHTPLAY_GAME_TITLES?.['lantern-stride']?.[locale];if(title){for(const node of document.querySelectorAll('[data-wp-game-title]'))node.textContent=title;document.title=`${title} | WeightPlay`;}
  $('mainProgress').textContent=tr('stage',{n:`\u2066${highestUnlocked(store.progress)} / 60\u2069`});
  if(screen==='stage'){rail?.setConfig(config(),selected-1);rail?.refresh(selected-1);if(tab!=='stages')renderManagement();}
  if(race){update();if(race.status==='finished')renderResult();}
  if(modal==='helpPanel'){const body=$('helpPanel').querySelector('.dialog-scroll p');body.textContent=tr(body.dataset.t)+(race?.stage.chapter===1?` ${tr('dashExplain')}`:'')+(race?.stage.id>=11&&body.dataset.t!=='tutorialIntro'?` ${tr('markHelp')}`:'');requestAnimationFrame(syncHelpScrollHint);}
}
const SKU='lantern-stride:star-trail';
let frame,rail,renderer=null,race=null,screen='main',tab='stages',modal=null,previousFocus=null,practice=false,practiceRun=false,startSerial=0,purchaseSerial=0,purchaseBusy=false,shoeStatusKey=null,shopStatusKey=null,resultReward=false,selected=highestUnlocked(store.progress),raf=0,last=0,saved=false,pending=null;
const audio=id=>W.WeightPlayAudio?.play(id);
const settingsOpen=()=>!!document.querySelector('#wp-frame-battle-settings:not([hidden])');
const config=()=>({gameId:'lantern-stride',count:STAGES.length,poster:'/games/lantern-stride/assets/cover.webp',background:'/assets/lobby-block-atmosphere.svg',stage:index=>{
  const s=STAGES[index],r=store.progress.records[s.id],locked=!practice&&s.id>highestUnlocked(store.progress);
  return {id:s.id,kicker:tr('chapter',{n:s.chapter}),title:tr('stage',{n:s.id}),subtitle:tr(s.checkpoint?'festival':'forest'),status:locked?tr('locked'):r?tr('stars',{n:r.stars}):tr('ready'),locked,cleared:!!r,rewardState:r?'collected':'not-collected',summary:tr(s.id===55?'goalChosen':goals[s.objective]),details:[`${s.distance} m · ${s.limit} s`,s.route.map(x=>tr(labels[x])).join(' → '),tr('starGoals',{n:starTimeLimit(s)}),...(r?[bestLabel(r)]:[])],poster:'/games/lantern-stride/assets/cover.webp'};
}});
function setModalInert(area,value){
  if(area==='battle'){ $('battleLive').inert=value;$('battleScreen').querySelector('header').inert=value; }
  if(area==='stage'){ $('stageContent').inert=value;$('stageScreen').querySelector('header').inert=value;if(frame?.commonDownButton?.element)frame.commonDownButton.element.inert=value; }
}
function activate(next){
  setModalInert(screen,false);
  if(next!=='battle')++startSerial;if(next!=='stage')++purchaseSerial;
  cancelAnimationFrame(raf);raf=0;last=0;if(modal){$(modal).hidden=true;modal=null;}
  if(next!=='battle'){renderer?.dispose();renderer=null;race=null;}
  screen=next;document.body.dataset.screen=next;
  $('mainGroup').hidden=next!=='main';$('mainScreen').hidden=next!=='main';$('stageScreen').hidden=next!=='stage';$('battleScreen').hidden=next!=='battle';
  frame.activate(next);
  // Synchronize shared Battle Canvas ownership in the same scene transaction.
  W.WeightPlayBattleCanvas.sync();
  if(next==='stage'){setTab('stages');rail.setConfig(config(),selected-1);rail.refresh(selected-1);}
  $('mainProgress').textContent=tr('stage',{n:`\u2066${highestUnlocked(store.progress)} / 60\u2069`});
}
function focusModal(id){const panel=$(id),button=[...panel.querySelectorAll('button:not([disabled])')].find(node=>node.getClientRects().length);if(button)button.focus();else{panel.tabIndex=-1;panel.focus();}}
function openModal(id){if(screen!=='stage'&&!race)return;if(!modal)previousFocus=document.activeElement;else if(modal!==id)$(modal).hidden=true;modal=id;$(id).hidden=false;setModalInert(screen,true);cancelAnimationFrame(raf);raf=0;last=0;focusModal(id);}
function syncHelpScrollHint(){const scroll=$('helpPanel').querySelector('.dialog-scroll'),hint=$('helpScrollHint');if(hint)hint.hidden=scroll.scrollHeight-scroll.scrollTop-scroll.clientHeight<=1;}
function showHelp(intro=false){const scroll=$('helpPanel').querySelector('.dialog-scroll'),body=scroll.querySelector('p');const key=intro?'tutorialIntro':'helpText';body.dataset.t=key;body.textContent=tr(key)+(race?.stage.chapter===1?` ${tr('dashExplain')}`:'')+(!intro&&race?.stage.id>=11?` ${tr('markHelp')}`:'');$('ghostOptions').hidden=intro||!race?.ghost;$('timeStarHelp').hidden=intro;$('featherHelp').hidden=intro||race?.stage.chapter!==2;openModal('helpPanel');scroll.scrollTop=0;requestAnimationFrame(syncHelpScrollHint);}
function closeModal(){if(!modal)return;$(modal).hidden=true;modal=null;setModalInert(screen,false);last=0;const target=previousFocus;previousFocus=null;if(target?.isConnected&&target.getClientRects().length&&!target.disabled)target.focus({preventScroll:true});else if(race?.status==='running')$('leftBtn').focus({preventScroll:true});if(race?.status==='running'&&!document.hidden)schedule();}
function setTab(name){
  rail?.cancel();tab=name;
  for(const id of ['shoes','stages','collection']){const active=id===name,panel=$(id+'Panel');panel.hidden=!active;panel.classList.toggle('hidden',!active);panel.inert=!active;panel.setAttribute('aria-hidden',String(!active));$(id+'Tab').setAttribute('aria-selected',String(active));$(id+'Tab').tabIndex=active?0:-1;}
  if(name==='stages')rail?.refresh(selected-1);else renderManagement();
}
function renderManagement(){
  const entries=[['balanced','balanced','balancedEffect',0],['steady','steady','steadyEffect',5],['swift','swift','swiftEffect',15]];
  $('shoeCards').replaceChildren(...entries.map(([id,name,effect,required],index)=>{
    const card=document.createElement('article'), art=document.createElement('div'), title=document.createElement('h3'), text=document.createElement('p'),button=document.createElement('button');
    card.className='item-card';art.className='item-art';art.style.setProperty('--ix',`${index*50}%`);art.style.setProperty('--iy','0%');art.setAttribute('role','img');art.setAttribute('aria-label',tr(name));
    title.textContent=tr(name);text.textContent=tr(effect);const unlocked=!required||!!store.progress.records[required];
    button.type='button';button.disabled=!unlocked||practice;button.textContent=!unlocked?tr('clearStage',{n:required}):tr(store.progress.equippedShoe===id?'inUse':'equip');
    button.addEventListener('click',async()=>{if(practice)return;const result=await store.equip(id);shoeStatusKey=result.ok?'shoeSaved':'saveSelectionFailed';$('shoeStatus').textContent=tr(shoeStatusKey);renderManagement();});card.append(art,title,text,button);return card;
  }));
  const wallet=W.WeightPlayWallet?.read(),owned=W.WeightPlayWallet?.owns(SKU)===true;
  $('walletBalance').textContent=wallet?.available?String(wallet.diamonds):'—';$('trailBtn').textContent=owned?tr(store.progress.equippedTrail==='star'?'inUse':'equip'):tr('buy');$('trailBtn').disabled=practice||!wallet?.available;$('defaultTrail').disabled=practice;
}
function schedule(){if(!raf&&screen==='battle'&&race?.status==='running'&&!modal&&!document.hidden&&!settingsOpen())raf=requestAnimationFrame(tick);}
function update(){
  if(!race)return;const part=segmentFor(race);
  $('distanceValue').textContent=`\u2066${Math.floor(race.distance)} / ${race.stage.distance} m\u2069`;
  $('balance').textContent=`${Math.round(race.balance)}%`;
  $('time').textContent=`${Math.max(0,race.stage.limit-race.elapsed).toFixed(1)} s`;
  const starLimit=starTimeLimit(race.stage),starRemaining=Math.max(0,starLimit-race.elapsed).toFixed(1),starExpired=race.elapsed>starLimit,starClock=$('starTimeRemaining'),starKey=`${locale}:${starRemaining}:${starExpired}`;
  if(starClock.dataset.state!==starKey){starClock.dataset.state=starKey;starClock.dataset.expired=String(starExpired);starClock.textContent=`★ ${starRemaining} s`;starClock.setAttribute('aria-label',tr('timeStarRemaining',{n:starRemaining}));starClock.title=tr('timeStarRemaining',{n:starRemaining});}
  const bridge=part.rule==='bridge'?` · ${tr(bridgeOpen(race)?'go':'wait')}`:'';
  const extras=[part.pace,part.wind].filter(Boolean).map(value=>tr(labels[value])).join(' · ');
  const nextRule=race.stage.route[part.index+1],nextStart=race.stage.distance*(part.index+1)/race.stage.route.length;
  const upcoming=nextRule&&nextStart-race.distance<=6&&(['left','right','bridge','slow','fast','headfast'].includes(nextRule)||(nextRule==='plain'&&part.rule==='slow')||nextRule.startsWith('fork'))?` → ${tr(labels[nextRule])}`:'';
  const gd=race.status==='running'?ghostDistance(race):null,delta=gd===null?null:Math.round(race.distance-gd),who=tr(race.ghost?.kind==='best'?'ghostBest':'ghostRecord'),ghost=delta===null||!ghostVisible?'':`${who} · \u2066${delta>0?'+':''}${delta} m\u2069`;
  const armedMark=race.landmarkArmed&&!race.landmarkArmed.collected&&race.lastStep!==null&&race.elapsed-race.lastStep<=rhythmRange(part.pace||part.rule)[1]?race.landmarkArmed:null;
  const activeMark=activeLandmark(race)||armedMark,mark=activeMark||race.landmarks.find(m=>!m.collected&&m.position-race.distance<=6&&m.position-race.distance>=-2.5);
  const markFoot=mark?tr(mark.foot==='left'?'leftFoot':'rightFoot'):'';
  const markLabel=mark?` · ${activeMark?tr(race.lastFoot===mark.foot?'markRepeat':'markTwice',{foot:markFoot}):`${tr('markAhead')} (${markFoot})`}`:'';
  const routeText=`${tr(race.stage.id===55?"goalChosen":goals[race.stage.objective])} · ${extras?extras+" · ":""}${tr(labels[part.choice?part.rule:part.original]||"plain")}${bridge}${upcoming}${markLabel}`,routeNode=$('routeCue'),ghostNode=$('ghostCue');
  if(routeNode.getAttribute('aria-live')!=='polite')routeNode.setAttribute('aria-live','polite');if(routeNode.textContent!==routeText)routeNode.textContent=routeText;ghostNode.hidden=!ghost;if(ghostNode.textContent!==ghost)ghostNode.textContent=ghost;if(ghost)ghostNode.style.top=`${routeNode.offsetTop+routeNode.offsetHeight+5}px`;
  const choosing=part.original.startsWith('fork')&&!part.choice;
  const enteringGate=(part.rule==='left'||part.rule==='right')&&race.lastGateIndex!==part.index;
  const specialEntry=choosing||enteringGate;
  // A fork can resolve to slow ground, whose minimum interval is .50 s.
  // Do not display a ready cue before both available choices can be clean.
  const elapsed=race.lastStep===null?null:race.elapsed-race.lastStep;const [ruleMin,max]=rhythmRange(part.pace||part.rule);const min=choosing?Math.max(ruleMin,rhythmRange('slow')[0]):ruleMin;
  const required=enteringGate?part.rule:choosing?(['forkleft','forkfast'].includes(part.original)?'left':['forkright','forkslow'].includes(part.original)?'right':null):null;
  const foot=required?`${required}Foot`:choosing?'either':activeMark&&race.lastFoot===mark.foot?'either':race.lastFoot==='left'?'rightFoot':race.lastFoot==='right'?'leftFoot':'either';
  const forkTransitionWait=choosing&&race.segmentEnteredAt!==null&&race.elapsed-race.segmentEnteredAt<FORK_CHOICE_GRACE_SECONDS;
  const timing=part.rule==='bridge'&&!bridgeOpen(race)||forkTransitionWait?'wait':elapsed===null?'ready':elapsed<min?'wait':elapsed<=max||part.rule==='bridge'||specialEntry?'stepNow':'late';
  const cue=$('rhythmCue');cue.textContent=`${tr(foot)} · ${tr(timing)}`;
  cue.dataset.timing=timing==='stepNow'?'ready':timing==='late'?'late':'wait';
  // The indicator visualizes the same lower timing bound used by the cue;
  // bridge-closed and first-step states keep the existing text without a bar.
  const meterActive=elapsed!==null&&!forkTransitionWait&&!(part.rule==='bridge'&&!bridgeOpen(race));
  cue.dataset.meter=meterActive?'active':'hidden';
  cue.style.setProperty('--beat-progress',meterActive?String(Math.max(0,Math.min(1,elapsed/min))):'0');
  const feedbackText=race.elapsed<race.feedbackUntil&&feedback[race.lastFeedback]?tr(race.lastFeedback==='timing'&&timingHint?timingHint:feedback[race.lastFeedback])+(race.lastFeedback==='steady'&&race.combo>=3?` ×${race.combo}${race.combo>=24?' ⚡⚡':race.combo>=12?' ⚡':''}`:''):'';
  const shownFeedback=race.elapsed<race.feedbackUntil&&race.lastFeedback==='landmark'?tr('markSuccess'):feedbackText;
  if($('feedback').textContent!==shownFeedback)$('feedback').textContent=shownFeedback;
  if(race.stage.chapter===1){
    const b=$('featherBtn'),remaining=Math.max(0,race.burstUntil-race.elapsed),ready=!race.dashUsed&&race.combo>=6&&race.balance>=40;
    const unavailable=String(!ready),active=String(remaining>0),caption=remaining>0?`⚡ ${Math.ceil(remaining)} s`:race.dashUsed?'⚡ ✓':ready?'⚡ −20%':race.balance<40?'⚡ ≥40%':`⚡ ${Math.min(6,race.combo)}/6`;
    const status=remaining>0?`${tr('dashFeedback')} ${Math.ceil(remaining)} s`:race.dashUsed?tr('dashUsed'):ready?tr('ready'):race.balance<40?`${tr('balance')} ≥40%`:`${tr('good')} ${Math.min(6,race.combo)}/6`;
    const label=`${tr('dashExplain')} ${status}`;if(b.disabled)b.disabled=false;if(b.getAttribute('aria-disabled')!==unavailable)b.setAttribute('aria-disabled',unavailable);if(b.dataset.active!==active)b.dataset.active=active;if(b.textContent!==caption)b.textContent=caption;if(b.getAttribute('aria-label')!==label)b.setAttribute('aria-label',label);if(b.title!==label)b.title=label;return;
  }
  const feather=$('featherBtn'),onBridge=part.rule==='bridge';if(feather.hasAttribute('aria-disabled'))feather.removeAttribute('aria-disabled');
  const holdRemaining=Math.max(0,race.featherUntil-race.elapsed),sprintRemaining=Math.max(0,race.burstUntil-race.elapsed);
  const active=holdRemaining>0?'bridge':sprintRemaining>0?'sprint':null,remaining=active==='bridge'?holdRemaining:sprintRemaining;
  const label=tr(race.stage.chapter===2?((active?active==='bridge':onBridge)?'featherBridgeLabel':'featherSprintLabel'):'feather');
  const seconds=`\u2066${Math.ceil(remaining)} s\u2069`;
  const visible=active?`${label}\n${seconds}`:label;
  const description=active?`${tr(active==='bridge'?'featherUsed':'featherBurst')} · ${seconds}`:tr(onBridge?'featherBridgeAction':'featherSprintAction');
  feather.disabled=race.feather<=0;const activeState=String(!!active);
  if(feather.dataset.active!==activeState)feather.dataset.active=activeState;
  if(feather.textContent!==visible)feather.textContent=visible;
  if(feather.getAttribute('aria-label')!==description){feather.setAttribute('aria-label',description);feather.title=description;}
}
function tick(now){raf=0;if(screen!=='battle'||!race||modal||document.hidden||settingsOpen())return;const dt=last?Math.min(.05,(now-last)/1000):0;last=now;advance(race,dt);recordDistance(race);race.ghostPosition=ghostVisible&&race.status==='running'?ghostDistance(race):null;renderer.draw(race,matchMedia('(prefers-reduced-motion: reduce)').matches);update();if(race.status==='finished')void finish();else schedule();}
function action(foot){if(screen!=='battle'||!race||modal||document.hidden||settingsOpen())return;const out=step(race,foot);timingHint=out.feedback==='timing'?(out.interval<rhythmRange(segmentFor(race).pace||out.rule)[0]?'tooEarly':'late'):null;if(out.accepted)audio(out.clean?(out.feedback==='landmark'||[12,24].includes(race.combo)?'feedback.success':'movement.step'):'feedback.error');update();}
async function persist(){if(!pending||pending.busy)return;const item=pending;item.busy=true;$('resultStages').disabled=true;$('resultReplay').disabled=true;$('retrySave').disabled=true;if(modal==='resultPanel'&&(!$('resultPanel').contains(document.activeElement)||!document.activeElement?.getClientRects().length||document.activeElement?.disabled))focusModal('resultPanel');const result=await store.complete(item.id,item.outcome);item.busy=false;let reward=null;if(result.ok){reward=W.WonderAnalytics?.completeStage?.(`stage-${item.id}`);if(pending===item)pending=null;}if(item.owner!==race||screen!=='battle'||modal!=='resultPanel')return;$('resultStages').disabled=false;$('resultReplay').disabled=false;$('retrySave').disabled=false;saved=result.ok;resultReward=reward?.credited===true&&reward.amount===1&&['castle-block','castle-material'].includes(reward.currency);$('saveStatus').textContent=saved?savedMessage():tr('saveFailed');if(resultReward){const icon=W.ShowResultGet?.('lantern-stride',true);if(icon?.isConnected)W.WeightPlayCastle?.dismissRewardNotice?.('lantern-stride');}$('retrySave').hidden=saved;$('resultNext').disabled=!saved||item.id>=60;if(!$('resultPanel').contains(document.activeElement)||!document.activeElement?.getClientRects().length||document.activeElement===$('resultPanel')||document.activeElement?.disabled)focusModal('resultPanel');}
function renderResult(){if(!race?.result)return;const r=race.result;$('resultArt').hidden=!r.won;$('resultStarGuide').textContent=tr('starGoals',{n:starTimeLimit(race.stage)});$('resultStars').textContent=r.won?'★'.repeat(r.stars)+'☆'.repeat(3-r.stars):'';$('resultTitle').textContent=tr(r.won?'complete':'tryAgain');const reason=r.reason==='timeout'?'reasonTimeout':r.reason==='missed-gate'?'reasonGate':r.reason==='finish'?'reasonFinish':'reasonObjective';const markResult=r.won&&race.landmarks.length?` · ${tr('markResult',{n:race.landmarks.filter(m=>m.collected).length,total:race.landmarks.length})}`:'';$('resultDetails').textContent=`${r.elapsed.toFixed(1)} s · ${tr('stars',{n:r.stars})} · ${tr(reason)}${markResult}`;}
async function finish(){
  audio(race.result.won?'result.win':'result.lose');saved=practiceRun&&race.result.won;pending=race.result.won&&!practiceRun?{id:selected,owner:race,outcome:{...race.result,bestTrace:race.trace},busy:false}:null;
  renderResult();
  $('saveStatus').textContent=practiceRun?'LOCAL PRACTICE · no progress or rewards saved':'';$('resultStages').disabled=false;$('resultReplay').disabled=false;$('retrySave').hidden=true;$('resultNext').disabled=!saved||selected>=60;resultReward=false;openModal('resultPanel');W.ShowResultGet?.('lantern-stride',false);
  if(pending)await persist();
}
async function startStage(id,{asPractice=practice}={}){
  const serial=++startSerial;
  if(id<1||id>60)return;
  if(asPractice){if(!await LocalPractice.validate()||serial!==startSerial)return;}else if(id>highestUnlocked(store.progress))return;
  practiceRun=asPractice;
  selected=id;activate('battle');renderer?.dispose();renderer=null;race=createRace(id,store.progress.equippedShoe);const record=store.progress.records[id];race.ghost=record?.bestTrace?{kind:'best',time:record.bestTime,trace:record.bestTrace}:record?.referenceRun?{kind:'recorded',...record.referenceRun}:null;race.ghostPosition=ghostVisible&&race.ghost?0:null;race.trace={route:race.stage.route.join(','),samples:[0]};pending=null;saved=false;
  try{renderer=createRenderer($('arena'),()=>{if(screen==='battle'&&race?.status==='running')openModal('graphicsPanel');});renderer.setTrail(store.progress.equippedTrail==='star'&&W.WeightPlayWallet?.owns(SKU)===true);renderer.draw(race);update();if(!practiceRun)W.WonderAnalytics?.track?.('stage_start',{stage_id:`stage-${id}`});audio('game.start');if(!practiceRun&&id===1&&!store.progress.tutorialComplete)showHelp(true);else schedule();}
  catch(error){console.error('Renderer could not start',error);openModal('graphicsPanel');}
}
function toStages(){++startSerial;activate('stage');}
function bind(){
  $('startBtn').addEventListener('click',()=>{audio('ui.click');selected=highestUnlocked(store.progress);activate('stage');});
  for(const name of ['shoes','stages','collection'])$(name+'Tab').addEventListener('click',()=>setTab(name));
  $('trailBtn').addEventListener('click',async()=>{if(practice)return;if(W.WeightPlayWallet?.owns(SKU)){const result=await store.equipTrail('star',true);shopStatusKey=result.ok?'appearanceSaved':'saveSelectionFailed';$('shopStatus').textContent=tr(shopStatusKey);renderManagement();}else openModal('buyPanel');});
  $('defaultTrail').addEventListener('click',async()=>{if(practice)return;const result=await store.equipTrail('default',true);shopStatusKey=result.ok?'appearanceSaved':'saveSelectionFailed';$('shopStatus').textContent=tr(shopStatusKey);renderManagement();});
  $('cancelBuy').addEventListener('click',()=>{if(!purchaseBusy)closeModal();});$('confirmBuy').addEventListener('click',async()=>{
    if(practice||purchaseBusy)return;purchaseBusy=true;const serial=++purchaseSerial,button=$('confirmBuy'),cancel=$('cancelBuy');button.disabled=true;cancel.disabled=true;
    let result;try{result=await W.WeightPlayWallet?.purchasePermanent(SKU,10)||{ok:false,reason:'unavailable'};}catch{result={ok:false,reason:'unavailable'};}
    finally{purchaseBusy=false;button.disabled=false;cancel.disabled=false;}
    if(serial!==purchaseSerial||screen!=='stage')return;if(modal==='buyPanel')closeModal();
    if(result.ok&&W.WeightPlayWallet?.owns(SKU)){const savedTrail=await store.equipTrail('star',true);if(serial!==purchaseSerial||screen!=='stage')return;shopStatusKey=savedTrail.ok?(result.alreadyOwned?'appearanceSaved':'purchased'):'purchasedRetry';$('shopStatus').textContent=tr(shopStatusKey);if(!result.alreadyOwned)audio('shop.purchase');}
    else{shopStatusKey=result.reason==='insufficient'?'insufficient':'purchaseUnavailable';$('shopStatus').textContent=tr(shopStatusKey);audio('feedback.error');}renderManagement();
  });
  $('stageBack').addEventListener('click',()=>activate('main'));$('battleBack').addEventListener('click',()=>openModal('leavePanel'));
  $('helpBtn').addEventListener('click',()=>showHelp());$('helpClose').addEventListener('click',async()=>{if(!practiceRun&&!store.progress.tutorialComplete)await store.completeTutorial();if(modal==='helpPanel')closeModal();});
  $('graphicsRetry').addEventListener('click',()=>startStage(selected,{asPractice:practiceRun}));$('graphicsStages').addEventListener('click',toStages);
  $('continueBtn').addEventListener('click',closeModal);$('leaveBtn').addEventListener('click',toStages);
  $('resultStages').addEventListener('click',toStages);$('resultReplay').addEventListener('click',()=>startStage(selected,{asPractice:practiceRun}));$('resultNext').addEventListener('click',()=>{if(saved)startStage(selected+1,{asPractice:practiceRun});});$('retrySave').addEventListener('click',()=>void persist());
  for(const [id,foot] of [['leftBtn','left'],['rightBtn','right']])$(id).addEventListener('click',()=>action(foot));
  $('featherBtn').addEventListener('click',()=>{if(screen==='battle'&&!modal&&!document.hidden&&!settingsOpen()&&race&&(race.stage.chapter===1?useOptionalDash(race):useFeather(race))){audio('feedback.success');update();}});
  document.addEventListener('keydown',e=>{if(e.defaultPrevented)return;if(modal){if(e.key==='Escape'&&['leavePanel','helpPanel','buyPanel'].includes(modal)&&!(modal==='buyPanel'&&purchaseBusy)){e.preventDefault();closeModal();return;}if(e.key==='Tab'){const buttons=[...$(modal).querySelectorAll('button:not([disabled]), input:not([disabled]), [tabindex="0"]')].filter(node=>node.getClientRects().length);if(buttons.length){const i=buttons.indexOf(document.activeElement);if(e.shiftKey&&(i<=0)){e.preventDefault();buttons.at(-1).focus();}else if(!e.shiftKey&&(i<0||i===buttons.length-1)){e.preventDefault();buttons[0].focus();}}else e.preventDefault();}return;}if(screen!=='battle'||e.repeat)return;if(e.code==='ArrowLeft'||e.code==='KeyA'){e.preventDefault();action('left');}else if(e.code==='ArrowRight'||e.code==='KeyD'){e.preventDefault();action('right');}else if(e.code==='Escape'){e.preventDefault();openModal('leavePanel');}});
  W.addEventListener('blur',()=>{if(screen==='battle'&&race?.status==='running'&&!modal)openModal('leavePanel');});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&screen==='battle'&&race?.status==='running'&&!modal)openModal('leavePanel');});
  W.addEventListener('weightplay:interaction-state',()=>{if(settingsOpen()){cancelAnimationFrame(raf);raf=0;last=0;}else{last=0;schedule();}});
  W.addEventListener('wonder:locale-change',()=>{locale=resolveLocale({pathname:'',search:'',storage:null,documentLanguage:W.WonderI18n?.actualLocale?.()||document.documentElement.lang});localize();});
  W.addEventListener('resize',()=>{if(renderer){renderer.resize();if(screen==='battle'&&race)renderer.draw(race,matchMedia('(prefers-reduced-motion: reduce)').matches);}});W.addEventListener('storage',()=>{store.refresh();if(screen==='stage')rail.refresh(selected-1);});
  W.addEventListener('pagehide',()=>{++startSerial;++purchaseSerial;cancelAnimationFrame(raf);renderer?.dispose();renderer=null;});
}
async function boot(){
  if(W.WonderI18n?.actualLocale?.()!==locale)W.WonderI18n?.setLocale(locale,{navigate:false});
  if(!W.WeightPlayScreenFrame||!W.WeightPlayPlayUI)throw new Error('SHARED_RUNTIME_MISSING');
  W.WeightPlayAudio?.preload(['ui.click','game.start','movement.step','feedback.error','feedback.success','result.win','result.lose','shop.purchase']);
  W.WeightPlayGameEntryLoader?.begin(2);
  const ghostNode=document.createElement('p');ghostNode.id='ghostCue';ghostNode.hidden=true;$('arena').append(ghostNode);
  const ghostOptions=document.createElement('div'),ghostHelp=document.createElement('p'),ghostLabel=document.createElement('label'),ghostCheck=document.createElement('input'),ghostLabelText=document.createElement('span');ghostOptions.id='ghostOptions';ghostOptions.hidden=true;ghostHelp.dataset.t='ghostHelp';ghostCheck.type='checkbox';ghostCheck.checked=ghostVisible;ghostLabelText.dataset.t='ghostVisible';ghostLabel.append(ghostCheck,ghostLabelText);ghostOptions.append(ghostHelp,ghostLabel);$('helpPanel').querySelector('.dialog-scroll').append(ghostOptions);ghostCheck.addEventListener('change',()=>{ghostVisible=ghostCheck.checked;update();});$('ghostCue').setAttribute('aria-live','off');
  const distanceValue=document.createElement('bdi');distanceValue.id='distanceValue';$('distance').replaceChildren(distanceValue);
  const timeGroup=$('time').parentElement,starClock=document.createElement('span'),starHelp=document.createElement('p');starClock.id='starTimeRemaining';starClock.setAttribute('role','timer');timeGroup.append(starClock);starHelp.id='timeStarHelp';starHelp.dataset.t='timeStarHelp';starHelp.hidden=true;$('helpPanel').querySelector('.dialog-scroll').append(starHelp);
  const helpScroll=$('helpPanel').querySelector('.dialog-scroll'),helpHint=document.createElement('span');helpHint.id='helpScrollHint';helpHint.setAttribute('aria-hidden','true');helpHint.textContent='⌄';helpHint.hidden=true;helpScroll.after(helpHint);helpScroll.addEventListener('scroll',syncHelpScrollHint,{passive:true});W.addEventListener('resize',syncHelpScrollHint);
  const scene=name=>({root:$(name+'Screen'),header:$(name+'Screen').querySelector('header'),content:$(name+'Content')});
  frame=W.WeightPlayScreenFrame.mount({root:$('gameFrame'),playUI:true,scenes:{main:scene('main'),stage:scene('stage'),battle:{...scene('battle'),headerInfo:$('battleInfo')}}});
  const info=W.WeightPlayScreenFrame.createGroup();for(const node of [...$('battleInfo').children])info.add(node);frame.battleTopUI.add(info);
  const tabs=W.WeightPlayScreenFrame.createGroup();for(const node of [...$('stageTabs').children])tabs.add(node);frame.commonDownButton.clear().add(tabs);frame.commonDownButton.element.setAttribute('role','tablist');$('stageTabs').hidden=true;
  rail=W.WeightPlayPlayUI.mountStage({page:$('stagesPanel'),rail:$('stageRail'),config:config(),selected:selected-1,onSelect:index=>{selected=index+1;},onStart:index=>{if(screen==='stage'&&tab==='stages')startStage(index+1);},isActive:()=>screen==='stage'&&tab==='stages'&&!modal});
  bind();activate('main');localize();const props=new Image();props.src=new URL('assets/props.webp',import.meta.url).href;await Promise.all([$('poster').decode(),props.decode()]);W.WeightPlayGameEntryLoader?.assetProgress(2,2);$('startBtn').disabled=false;W.WeightPlayGameEntryLoader?.ready();
  await LocalPractice.register({gameId:'lantern-stride',stageIds:STAGES.map(s=>s.id),enable:enabled=>{practice=enabled;renderManagement();rail.refresh(selected-1);},startStage:id=>startStage(Number(id),{asPractice:true})});
}
if(['localhost','127.0.0.1','[::1]'].includes(location.hostname))W.__lanternStrideRenderMetrics=()=>renderer?.info()||null;
boot().catch(error=>{console.error(error);W.WeightPlayGameEntryLoader?.fail?.('load');});
