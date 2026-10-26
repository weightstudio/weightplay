import {STAGES,BOARDS,getStage,featureX,gateIsOpen,gateSecondsToChange} from './content.mjs';
import {createRace,startRace,pauseRace,resumeRace,stepRace,drainEvents} from './simulation.mjs';
import {RapidsRenderer} from './render.mjs';
import {createProgressStore} from './save.mjs';
import {resolveLocale,t,stageName,stageLesson,guide,renderRelatedGames,renderGameplayTags} from './i18n.mjs';
import {LocalPractice} from '../../src/game-local-practice.mjs';
import {makeStageConfig} from './stage-config.mjs';
const $=id=>document.getElementById(id), W=window, SKU='bramble-rapids:coral-night';
const store=createProgressStore();store.load();
let locale=resolveLocale(),screen='main',tab='stages',selected=store.persistedSnapshot.unlocked,frame,rail,joystick,renderer,race,modal=null,previousFocus=null,practice=false,practiceRun=false,raf=0,lastFrame=0,round=0,resultSaved=false,busy=false,feedbackUntil=0,shopFeedbackKey=null;
const savingRuns=new WeakSet(),stageSaveNotice=document.createElement('span');stageSaveNotice.setAttribute('role','status');
let jumpQueued=false,anchorHeld=false;const keys=new Set(),abort=new AbortController();
const listen=(node,event,fn,opts={})=>node.addEventListener(event,fn,{...opts,signal:abort.signal});
const tr=(key,vars)=>t(locale,key,vars),text=(id,key,vars)=>{$(id).textContent=tr(key,vars);};
const audio=id=>W.WeightPlayAudio?.play(id), settingsOpen=()=>!!document.querySelector('#wp-frame-battle-settings:not([hidden]),#wp-frame-stage-settings:not([hidden])');
const runnable=()=>screen==='battle'&&race?.status==='running'&&!modal&&!document.hidden&&!settingsOpen();
const clock=value=>`${Math.floor(value/60)}:${String(Math.floor(value%60)).padStart(2,'0')}`;
const requiredFlags=stage=>stage.features.filter(f=>f.kind==='buoy'&&f.role==='required');
function clearInput(){keys.clear();jumpQueued=false;anchorHeld=false;joystick?.reset();for(const id of ['jumpBtn','anchorBtn'])$(id).dataset.held='false';}
function notify(){W.dispatchEvent(new Event('weightplay:stage-sync'));}
function clearFrame(){cancelAnimationFrame(raf);raf=0;lastFrame=0;}
function syncPause(){
  if(!race||screen!=='battle')return;
  const paused=!!modal||document.hidden||settingsOpen();
  if(paused&&race.status==='running'){pauseRace(race);clearInput();clearFrame();}
  else if(!paused&&race.status==='paused'){resumeRace(race);lastFrame=0;schedule();}
  joystick?.setEnabled(runnable());
}
function closeModal({restore=true}={}){
  if(!modal)return;
  $(modal).hidden=true;modal=null;
  $('battleLive').inert=false;$('stageContent').inert=false;
  $('stageScreen').querySelector('header').inert=false;
  for(const id of ['boardsTab','stagesTab','collectionTab'])$(id).inert=false;
  frame.activate(screen);syncPause();
  if(restore&&previousFocus?.isConnected&&!previousFocus.closest('[hidden]'))previousFocus.focus({preventScroll:true});
}
function openModal(id){
  if(modal===id)return;previousFocus=document.activeElement;
  if(modal)$(modal).hidden=true;
  modal=id;$(id).hidden=false;clearInput();
  $('battleLive').inert=screen==='battle';
  $('stageContent').inert=screen==='stage';
  for(const name of ['boardsTab','stagesTab','collectionTab'])$(name).inert=screen==='stage';
  frame.activate(screen,{covered:true});syncPause();
  requestAnimationFrame(()=>$(id).querySelector('button:not([disabled])')?.focus({preventScroll:true}));
}
function activate(next){
  closeModal({restore:false});clearInput();clearFrame();
  if(next!=='battle'){renderer?.dispose();renderer=null;race=null;}
  screen=next;document.body.dataset.screen=next;
  $('mainGroup').hidden=next!=='main';$('mainScreen').hidden=next!=='main';$('stageScreen').hidden=next!=='stage';$('battleScreen').hidden=next!=='battle';
  frame.activate(next);if(next==='stage'){renderManagement();rail.refresh(selected-1);}notify();
}
function selectTab(name,focus=false){
  tab=name;for(const id of ['boards','stages','collection']){const active=id===name;$(id+'Panel').hidden=!active;$(id+'Tab').setAttribute('aria-selected',String(active));$(id+'Tab').tabIndex=active?0:-1;}
  if(name==='stages')rail?.refresh(selected-1);else renderManagement();
  if(focus)$(name+'Tab').focus({preventScroll:true});notify();
}
function stagePresentation(index){
  const s=STAGES[index],p=store.snapshot,durable=store.persistedSnapshot,r=durable.records[s.id],pending=!r?.cleared&&p.records[s.id]?.cleared,locked=!practice&&s.id>durable.unlocked;
  return {id:s.id,kicker:`${tr('chapter')} ${s.chapter}`,title:stageName(s.id,locale),subtitle:`${tr('stage')} ${s.id}`,locked,cleared:!!r?.cleared,status:locked?tr('locked'):pending?tr('notSaved'):r?.cleared?`${tr('stars')} ${r.stars}/3`:tr('ready'),rewardState:r?.cleared?'collected':'not-collected',summary:stageLesson(s,locale),details:stageDetails(s),poster:'/games/bramble-rapids/assets/scenes.webp',posterPosition:s.chapter===1?'center top':'center bottom'};
}
function stageDetails(s){
  const c=s.clearConditions,details=[`${tr('flags')}: ${requiredFlags(s).length}`,`${tr('time')}: ${clock(s.timeLimit)}`];
  if(c.minLandings)details.push(`${tr('landing')}: ≥ ${c.minLandings}`);
  if(c.maxLandings!==undefined)details.push(`${tr('landing')}: ≤ ${c.maxLandings}`);
  if(c.maxRank)details.push(`${tr('rank')}: ≤ ${c.maxRank}`);
  if(c.minStability)details.push(`${tr('stability')}: ≥ ${c.minStability}`);
  if(c.maxFalls!==undefined)details.push(`${tr('falls')}: ≤ ${c.maxFalls}`);
  if(c.minCurrentZones)details.push(`${tr('currentZones')}: ≥ ${c.minCurrentZones}`);
  if(c.minBonus)details.push(`${tr('bonus')}: ≥ ${c.minBonus}`);
  if(c.maxBridgeHits!==undefined)details.push(`${tr('bridgeHits')}: ≤ ${c.maxBridgeHits}`);
  if(c.maxHits!==undefined)details.push(`${tr('hits')}: ≤ ${c.maxHits}`);
  return details;
}
function makeKit(index){const d=document.createElement('div');d.className='kit-art';d.style.setProperty('--kit-x',`${(index%3)*50}%`);d.style.setProperty('--kit-y',`${Math.floor(index/3)*50}%`);return d;}
function renderManagement(){
  store.verifyCosmeticEntitlement(W.WeightPlayWallet?.owns(SKU)===true);
  const p=store.snapshot,durable=store.persistedSnapshot,dirty=store.getPending().dirty||!!store.error;
  text('mainProgress','stageProgress',{current:durable.unlocked,total:60});
  $('mainSaveNotice').hidden=!dirty;$('mainSaveNotice').textContent=dirty?tr('saveFailed'):'';
  if(dirty){stageSaveNotice.textContent=tr('notSaved');frame?.stageTopUI.add(stageSaveNotice);}else frame?.stageTopUI.clear();
  $('retryManagementSave').hidden=!dirty;$('retryManagementSave').disabled=busy||practice;
  $('shopFeedback').textContent=[shopFeedbackKey?tr(shopFeedbackKey):'',dirty&&shopFeedbackKey!=='saveFailed'?tr('saveFailed'):''].filter(Boolean).join(' ');
  $('boardCards').replaceChildren();
  BOARDS.forEach((board,index)=>{const owned=durable.ownedBoards.includes(board.id),card=document.createElement('article');card.className='owned-card';card.append(makeKit(index));const h=document.createElement('h2');h.textContent=tr(board.id);const effect=document.createElement('p');effect.textContent=tr(board.id+'Effect');const button=document.createElement('button');button.type='button';button.setAttribute('data-wp-frame-action','secondary');button.dataset.board=board.id;button.textContent=p.equippedBoard===board.id?tr('equipped'):owned?tr('equip'):tr(board.unlockStage===5?'freeUnlock5':'freeUnlock15');button.disabled=!owned||p.equippedBoard===board.id||practice;card.append(h,effect,button);$('boardCards').append(card);});
  text('anchorUnlock',p.anchorUnlocked?'anchorUnlocked':'freeUnlock30');
  $('walletBalance').textContent=String(W.WeightPlayWallet?.read().diamonds??0);
  const owned=W.WeightPlayWallet?.owns(SKU)===true;
  text('cosmeticBtn',owned?(p.equippedCosmetic==='coral-night'?'equipped':'equip'):'buy');
  $('cosmeticBtn').disabled=busy||practice||(owned&&p.equippedCosmetic==='coral-night');$('defaultStyle').disabled=busy||practice||p.equippedCosmetic==='default';
  $('milestones').replaceChildren();for(const [stage,index]of [[10,6],[30,7],[60,8]]){const d=document.createElement('div');d.className=p.records[stage]?.cleared?'':'locked';d.append(makeKit(index));const label=document.createElement('p');label.textContent=`${tr('stage')} ${stage} · ${p.records[stage]?.cleared?tr('owned'):tr('locked')}`;d.append(label);$('milestones').append(d);}
}
function renderGuide(){
  const g=guide(locale);$('gameGuideTitle').replaceChildren();const h=document.createElement('h2');h.textContent=g.title;const p=document.createElement('p');p.textContent=g.goal;$('gameGuideTitle').append(h,p);$('gameGuideTitle').insertAdjacentHTML('beforeend',renderGameplayTags(locale));
  $('gameGuideRelated').innerHTML=renderRelatedGames(locale);
  $('gameGuideFacts').replaceChildren();for(const value of [`60 ${tr('stages')}`,`3 ${tr('boards')}`,tr('localRivals')]){const span=document.createElement('span');span.textContent=value;$('gameGuideFacts').append(span);}
  $('gameGuideSections').replaceChildren();for(const [key,copy]of [['guideGoalTitle',g.goal],['guideHowTitle',g.howToPlay],['guideRulesTitle',g.controlsAndRules],['guideFinishTitle',g.finishingAndFeedback],['guideStrategyTitle',g.strategy],['guideProgressionTitle',g.progression],['guideSaveTitle',g.save]]){const section=document.createElement('section'),head=document.createElement('h3'),body=document.createElement('p');head.textContent=tr(key);body.textContent=copy;section.append(head,body);$('gameGuideSections').append(section);}
  $('gameGuideFaq').replaceChildren();for(const item of g.faq){const d=document.createElement('details'),q=document.createElement('summary'),a=document.createElement('p');q.textContent=item.question;a.textContent=item.answer;d.append(q,a);$('gameGuideFaq').append(d);}
}
function localize(){
  document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';
  for(const el of document.querySelectorAll('[data-t]'))el.textContent=tr(el.dataset.t,{cost:el.dataset.cost||5});
  for(const el of document.querySelectorAll('[data-t-aria]'))el.setAttribute('aria-label',tr(el.dataset.tAria));
  $('riverArena').setAttribute('aria-label',tr('summary'));$('stageTabs').setAttribute('aria-label',tr('stages'));
  frame?.commonDownButton.element.setAttribute('aria-label',tr('stages'));
  $('mainBack').setAttribute('aria-label',tr('backLobby'));$('poster').alt=tr('posterAlt');
  renderGuide();renderManagement();rail?.setConfig(makeStageConfig(stagePresentation),selected-1);if(race)updateHUD();if(modal==='helpDialog')showHelp(false);if(modal==='resultPanel')renderResult();
}
function flash(key,seconds=1.5){text('feedback',key);feedbackUntil=(race?.activeTime||0)+seconds;}
function updateHUD(){
  if(!race)return;const p=race.player;
  $('rankValue').textContent=`${race.rank} / ${race.rivals.length+1}`;$('stabilityValue').textContent=`${p.stability} / 3`;$('timeValue').textContent=clock(Math.max(0,race.stage.timeLimit-race.activeTime-race.penaltyTime));
  const next=requiredFlags(race.stage).find(f=>!p.flags.includes(f.id));
  let aim=next,aimLabel=`${tr('flags')} ${p.flags.length}/${requiredFlags(race.stage).length}`;
  const goals=race.stage.clearConditions;
  const bonus=goals.minBonus>p.bonusFlags.length?race.stage.features.find(f=>f.kind==='buoy'&&f.role==='bonus'&&!p.bonusFlags.includes(f.id)&&f.s>=p.s):null;
  if(bonus&&(!aim||bonus.s<aim.s)){aim=bonus;aimLabel=`${tr('bonus')} ${p.bonusFlags.length}/${goals.minBonus}`;}
  const current=goals.minCurrentZones>p.currentZones.length?race.stage.features.find(f=>f.kind==='current'&&!p.currentZones.includes(f.id)&&f.s+(f.length||0)>p.s):null;
  if(current&&(!aim||current.s<aim.s)){aim={...current,s:Math.max(current.s+3,p.s)};aimLabel=`${tr('currentZones')} ${p.currentZones.length}/${goals.minCurrentZones}`;}
  const direction=aim?featureX(aim,race.activeTime)-p.x:0;
  $('targetCue').textContent=`${aimLabel}${aim?` · ${tr(direction<-.18?'left':direction>.18?'right':'aligned')} · ${Math.max(0,Math.ceil(aim.s-p.s))}m`:''}`;
  const gate=race.stage.features.find(f=>f.kind==='gate'&&f.s>=p.s-2&&f.s<p.s+35);
  const ramp=race.stage.ramps.find(f=>f.launchEnd>=p.s&&f.s<p.s+42&&!p.landedRampIds.includes(f.id));
  if(ramp&&(ramp.required||goals.minLandings>p.landings)&&(!aim||ramp.s<aim.s)){
    const bearing=ramp.x-p.x;
    $('targetCue').textContent=`${tr('jump')} · ${tr(bearing<-.18?'left':bearing>.18?'right':'aligned')} · ${Math.max(0,Math.ceil(ramp.s-p.s))}m`;
  }
  const jumpReady=!!ramp&&p.grounded&&p.s>=ramp.launchStart&&p.s<=ramp.launchEnd&&Math.abs(p.x-ramp.x)<=ramp.width/2;
  $('jumpBtn').dataset.ready=String(jumpReady);
  $('gateCue').textContent=gate?`${gateIsOpen(gate,race.activeTime)?tr('go'):tr('waiting')} · ${gateSecondsToChange(gate,race.activeTime).toFixed(1)}s`:ramp?jumpReady?`${tr('jump')}!`:`${tr('jump')} · ${Math.max(0,Math.ceil(ramp.s-p.s))}m`:'';
  const bay=race.stage.features.find(f=>f.kind==='bay'&&p.s>=f.s&&p.s<=f.s+f.length&&Math.abs(p.x-featureX(f,race.activeTime))<=f.width/2);
  const anchorReady=race.stage.anchorUnlocked&&!p.anchorUsed&&p.grounded&&!!bay;
  $('anchorBtn').disabled=!p.anchored&&!anchorReady;$('anchorBtn').dataset.ready=String(anchorReady||p.anchored);
  if(anchorReady)$('gateCue').textContent=`${tr('anchor')}!`;
  if(p.anchored)$('gateCue').textContent=`${tr('anchor')} · ${Math.max(0,2-p.anchorTime).toFixed(1)}s`;
  if(race.activeTime>feedbackUntil)$('feedback').textContent='';
}
function processEvents(){
  for(const event of drainEvents(race)){
    if(event.racerId!==race.player.id)continue;
    if(['jump','land','fall','flag','bonus','hit','bump'].includes(event.type))renderer?.burst(event.s,event.x,event.type==='hit'?1.5:.8);
    if(event.type==='start')audio('game.start');
    else if(event.type==='jump'){audio('movement.jump');flash('jump',.45);}
    else if(event.type==='land'){audio('water.splash');flash('landing',.65);}
    else if(event.type==='hit')audio(event.material==='stone'?'impact.stone':'impact.wood');
    else if(event.type==='fall')audio('water.splash');
    else if(event.type==='flag')audio('game.checkpoint');
    else if(event.type==='bonus')audio('reward.collect');
    else if(event.type==='anchor-start')audio('movement.hook');
    else if(event.type==='anchor-end')audio('movement.release');
    else if(event.type==='reject')flash(event.reason?.includes('anchor')?'noAnchor':'cannotJump');
    else if(event.type==='gate-wait')flash('waiting',1);
    else if(event.type==='won'||event.type==='lost'){audio(event.type==='won'?'result.win':'result.lose');void finish();}
  }
}
function schedule(){if(!raf&&runnable())raf=requestAnimationFrame(tick);}
function tick(now){
  raf=0;if(!runnable())return;
  const dt=lastFrame?Math.min(.066,(now-lastFrame)/1000):0;lastFrame=now;
  const keyboard=(keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowLeft')||keys.has('KeyA')?1:0);
  const steer=keyboard||joystick.getVector().x;
  const beforeStep=race.activeTime;
  stepRace(race,dt,{steer,jump:jumpQueued,anchor:anchorHeld||keys.has('KeyX')});
  if(race.activeTime>beforeStep||race.status!=='running')jumpQueued=false;
  renderer?.render(race,dt);updateHUD();processEvents();schedule();
}
async function startStage(id,{practice:asPractice=practice,restart=false}={}){
  if(busy)return;id=Number(id);if(!getStage(id))return;
  if(asPractice){if(!await LocalPractice.validate())return;}else if(id>store.persistedSnapshot.unlocked)return;
  if(restart)W.WonderAnalytics?.game?.markRestart();
  selected=id;practiceRun=asPractice;resultSaved=false;renderer?.dispose();renderer=null;activate('battle');
  race=createRace(id,{boardId:store.snapshot.equippedBoard});round++;startRace(race);
  try{renderer=new RapidsRenderer($('riverArena'),{onContextLost:()=>openModal('graphicsDialog')});renderer.setStage(race.stage);renderer.setAppearance?.(race.boardId,W.WeightPlayWallet?.owns(SKU)&&store.snapshot.equippedCosmetic==='coral-night'?'coral-night':'default');renderer.resize();renderer.render(race,0);}
  catch(error){console.error('Bramble Rapids renderer',error);renderer?.dispose();renderer=null;openModal('graphicsDialog');return;}
  updateHUD();processEvents();joystick.setEnabled(true);$('riverArena').focus({preventScroll:true});
  if(!store.snapshot.tutorialComplete&&!asPractice)showHelp();else schedule();notify();
}
function showHelp(open=true){if(!race)return;$('helpStage').textContent=`${tr('stage')} ${race.stage.id} · ${stageName(race.stage.id,locale)}`;$('helpLesson').textContent=`${stageLesson(race.stage,locale)} ${stageDetails(race.stage).join(' · ')}`;$('helpBasics').textContent=`${tr('keyControls')} ${tr('touchControls')} ${tr('tutorialJump')} ${race.stage.chapter===2?tr('tutorialAnchor'):''}`;if(open)openModal('helpDialog');}
function renderResult(){
  if(!race?.result)return;const r=race.result,saving=savingRuns.has(race);
  $('resultStage').textContent=`${tr('stage')} ${r.stageId} · ${stageName(r.stageId,locale)}`;text('resultTitle',r.won?'won':'lost');
  $('resultArt').style.setProperty('--kit-x',`${(r.won?Math.max(0,r.stars-1):0)*50}%`);
  $('resultDetails').textContent=`${tr('rank')} ${r.rank}/${race.rivals.length+1} · ${tr('time')} ${clock(r.time)} · ${tr('stars')} ${r.stars}/3 · ${tr('landing')} ${r.landings}`;
  const reason={timeout:'timeoutReason',stability:'stabilityReason',flags:'flagsReason',landings:'landingReason',rank:'rankReason',tide:'tideReason'};
  $('resultReason').textContent=r.won?(!practiceRun&&!resultSaved?tr('notSaved'):r.stageId===60?tr('final'):practiceRun?stageLesson(race.stage,locale):tr('winUnlock')):`${tr(reason[r.reason]||'finishReason')} ${stageDetails(race.stage).join(' · ')}`;
  $('resultSaved').textContent=practiceRun?'LOCAL PRACTICE':r.won?tr(resultSaved?'progressSaved':saving?'recordPending':'saveFailed'):'';
  $('retrySave').hidden=!r.won||resultSaved||practiceRun||saving;
  $('resultNext').disabled=!r.won||r.stageId===60||(!practiceRun&&!resultSaved);
}
async function persistResult(retry=false){
  if(practiceRun||!race?.result?.won||savingRuns.has(race))return;
  const current=race;savingRuns.add(current);renderResult();let receipt;
  try{receipt=retry?await store.retryPersist():await store.recordResult(current.result);}
  catch(error){console.error('Bramble Rapids save',error);receipt={saved:false};}
  finally{savingRuns.delete(current);}
  publishPersisted(receipt);
  if(current!==race){renderManagement();notify();return;}
  resultSaved=receipt.saved===true;
  renderResult();notify();
}
function publishPersisted(receipt){if(receipt.saved===true)for(const id of receipt.persistedStageIds||[])W.WonderAnalytics?.completeStage?.(id);}
async function finish(){clearFrame();clearInput();openModal('resultPanel');renderResult();if(race.result.won&&!practiceRun)await persistResult();}
function toStages(){selected=Math.min(60,store.persistedSnapshot.unlocked);activate('stage');selectTab('stages');}
async function purchase(){
  if(busy||practice)return;busy=true;$('confirmBuy').disabled=true;
  const result=await W.WeightPlayWallet.purchasePermanent(SKU,5);
  if(result.ok){await store.setCosmetic('coral-night',true);shopFeedbackKey='purchaseDone';audio('shop.purchase');}
  else{shopFeedbackKey=result.reason==='insufficient'?'insufficient':'purchaseFailed';audio('feedback.error');}
  busy=false;$('confirmBuy').disabled=false;closeModal();renderManagement();
}
function bind(){
  listen($('startBtn'),'click',()=>{selected=store.persistedSnapshot.unlocked;activate('stage');selectTab('stages');});listen($('stageBack'),'click',()=>activate('main'));listen($('battleBack'),'click',()=>race?.result?toStages():openModal('leaveDialog'));
  for(const id of ['boards','stages','collection'])listen($(id+'Tab'),'click',()=>selectTab(id));
  for(const id of ['boardsTab','stagesTab','collectionTab'])listen($(id),'keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const ids=['boards','stages','collection'],dir=locale==='ar'?-1:1;selectTab(ids[e.key==='Home'?0:e.key==='End'?2:(ids.indexOf(tab)+(e.key==='ArrowRight'?dir:-dir)+3)%3],true);});
  listen($('boardCards'),'click',async e=>{const button=e.target.closest('[data-board]');if(!button||practice)return;await store.setBoard(button.dataset.board);renderManagement();});
  listen($('cosmeticBtn'),'click',async()=>{if(practice)return;if(W.WeightPlayWallet.owns(SKU)){await store.setCosmetic('coral-night',true);renderManagement();}else openModal('buyDialog');});
  listen($('defaultStyle'),'click',async()=>{if(!practice){await store.setCosmetic('default');renderManagement();}});listen($('confirmBuy'),'click',()=>void purchase());listen($('cancelBuy'),'click',()=>closeModal());
  listen($('retryManagementSave'),'click',async()=>{if(busy||practice)return;busy=true;renderManagement();try{const receipt=await store.retryPersist();publishPersisted(receipt);shopFeedbackKey=receipt.saved?'progressSaved':'saveFailed';}finally{busy=false;renderManagement();rail.refresh(selected-1);notify();}});
  listen($('helpBtn'),'click',()=>showHelp());listen($('helpClose'),'click',async()=>{closeModal();if(!practiceRun&&!store.snapshot.tutorialComplete)await store.markTutorialComplete();});listen($('continueBtn'),'click',()=>closeModal());listen($('leaveBtn'),'click',toStages);
  listen($('resultStages'),'click',toStages);listen($('resultNext'),'click',()=>{if(!$('resultNext').disabled)void startStage(selected+1,{practice:practiceRun});});listen($('resultReplay'),'click',()=>void startStage(selected,{practice:practiceRun,restart:true}));listen($('retrySave'),'click',()=>void persistResult(true));listen($('graphicsBack'),'click',toStages);listen($('graphicsRetry'),'click',()=>void startStage(selected,{practice:practiceRun,restart:true}));
  for(const [id,type]of [['jumpBtn','jump'],['anchorBtn','anchor']]){
    const node=$(id);listen(node,'pointerdown',e=>{if(!runnable()||node.disabled)return;e.preventDefault();node.setPointerCapture(e.pointerId);node.dataset.held='true';if(type==='jump')jumpQueued=true;else anchorHeld=true;});
    for(const event of ['pointerup','pointercancel','lostpointercapture'])listen(node,event,()=>{node.dataset.held='false';if(type==='anchor')anchorHeld=false;});
    listen(node,'click',e=>{if(e.detail===0&&runnable()){if(type==='jump')jumpQueued=true;else flash('noAnchor');}});
  }
  listen(document,'keydown',e=>{
    if(modal){if(e.key==='Tab'){const nodes=[...$(modal).querySelectorAll('button:not([disabled]),[tabindex="0"]')].filter(n=>!n.hidden);if(!nodes.length)return;const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
      if(e.key==='Escape'&&['helpDialog','leaveDialog','buyDialog'].includes(modal)){e.preventDefault();closeModal();}return;}
    if(e.defaultPrevented||settingsOpen()||screen!=='battle'||e.target.closest('select,input,textarea,[role="dialog"]'))return;
    if(e.key==='Escape'){e.preventDefault();openModal('leaveDialog');return;}
    if(['ArrowLeft','ArrowRight','KeyA','KeyD','Space','KeyX'].includes(e.code)){e.preventDefault();if(!runnable())return;if(e.code==='Space'&&!e.repeat)jumpQueued=true;keys.add(e.code);}
  });
  listen(document,'keyup',e=>keys.delete(e.code));listen(W,'blur',()=>{clearInput();if(screen==='battle'&&race?.status==='running')openModal('leaveDialog');});
  listen(document,'visibilitychange',()=>{clearInput();syncPause();});listen(W,'weightplay:interaction-state',()=>{clearInput();syncPause();});
  listen(W,'wonder:locale-change',()=>{locale=resolveLocale({pathname:'',search:'',storage:null,documentLanguage:W.WonderI18n?.actualLocale?.()||document.documentElement.lang});localize();});
  listen(W,'storage',()=>{if(!practice){store.refresh();renderManagement();rail.refresh(selected-1);}});
  listen(W,'pagehide',()=>{clearInput();clearFrame();renderer?.dispose();renderer=null;});
}
async function boot(){
  if(!W.WeightPlayScreenFrame||!W.WeightPlayPlayUI||!W.WeightPlayJoystick)throw Error('SHARED_RUNTIME_MISSING');
  const mainNotice=document.createElement('p');mainNotice.id='mainSaveNotice';mainNotice.className='reserved-feedback';mainNotice.setAttribute('role','status');mainNotice.hidden=true;$('mainProgress').after(mainNotice);
  const managementRetry=document.createElement('button');managementRetry.id='retryManagementSave';managementRetry.type='button';managementRetry.dataset.t='retry';managementRetry.textContent=tr('retry');managementRetry.hidden=true;$('shopFeedback').after(managementRetry);
  for(const node of document.querySelectorAll('.owned-card button'))node.setAttribute('data-wp-frame-action','secondary');
  W.WeightPlayGameEntryLoader?.begin(3);
  const scene=name=>({root:$(name+'Screen'),header:$(name+'Screen').querySelector('header'),content:$(name+'Content')});
  frame=W.WeightPlayScreenFrame.mount({root:$('gameFrame'),playUI:true,scenes:{main:scene('main'),stage:scene('stage'),battle:{...scene('battle'),headerInfo:$('battleInfo')}}});
  const info=W.WeightPlayScreenFrame.createGroup();for(const node of [...$('battleInfo').children])info.add(node);frame.battleTopUI.add(info);
  const tabs=W.WeightPlayScreenFrame.createGroup();for(const node of [...$('stageTabs').children])tabs.add(node);frame.commonDownButton.clear().add(tabs);frame.commonDownButton.element.setAttribute('role','tablist');$('stageTabs').hidden=true;
  rail=W.WeightPlayPlayUI.mountStage({page:$('stagesPanel'),rail:$('stageRail'),config:makeStageConfig(stagePresentation),selected:selected-1,onSelect:index=>{selected=index+1;},onStart:index=>void startStage(index+1),isActive:()=>screen==='stage'&&tab==='stages'&&!modal});
  joystick=W.WeightPlayJoystick.create({surface:$('riverArena'),container:$('riverArena'),mode:'floating',anchor:{left:76,bottom:76},enabled:false,isEnabled:runnable});
  bind();localize();activate('main');selectTab('stages');
  for(const card of document.querySelectorAll('.dialog-card')){
    const footer=card.querySelector(':scope > .dialog-actions,:scope > button:last-child');
    if(!footer)continue;
    const body=document.createElement('div');body.className='dialog-scroll';
    for(const child of [...card.children])if(child!==footer)body.append(child);
    card.prepend(body);footer.classList.add('dialog-footer');
  }
  const anchorArt=makeKit(3);anchorArt.setAttribute('role','img');anchorArt.dataset.tAria='anchor';anchorArt.setAttribute('aria-label',tr('anchor'));$('anchorUnlock').before(anchorArt);
  for(const node of document.querySelectorAll('#riverControls button,.dialog-card button,.result-actions button,#retrySave'))node.setAttribute('data-wp-frame-action','secondary');
  let loaded=0;await Promise.all(['cover.webp','scenes.webp','kit.webp'].map(async asset=>{const image=asset==='cover.webp'?$('poster'):new Image();if(asset!=='cover.webp')image.src=new URL(`assets/${asset}`,import.meta.url).href;await image.decode();W.WeightPlayGameEntryLoader?.assetProgress(++loaded,3);}));
  $('startBtn').disabled=false;W.WeightPlayGameEntryLoader?.ready();
  await LocalPractice.register({gameId:'bramble-rapids',stageIds:STAGES.map(s=>s.id),enable:enabled=>{practice=enabled;renderManagement();rail.refresh(selected-1);},startStage:id=>startStage(Number(id),{practice:true})});
  W.WonderAnalytics?.game?.observeState(()=>({screen,roundKey:practiceRun?null:race?`bramble-${round}`:null,stageId:race?.stage.id,started:!practiceRun&&!!race,ended:!practiceRun&&!!race?.result&&(!race.result.won||resultSaved),outcome:race?.result?.won?'win':'lose',paused:!runnable(),locale,activityMode:'state',keyboardKeys:['ArrowLeft','ArrowRight','KeyA','KeyD','Space','KeyX']}));
}
// Observation only: no unlock, input injection, save mutation or simulation controls.
W.brambleRapidsSnapshot=()=>Object.freeze({screen,tab,modal,practice,practiceRun,selected,resultSaved,progress:store.snapshot,persistedProgress:store.persistedSnapshot,savePending:store.getPending().dirty,race:race?{status:race.status,stage:race.stage.id,boardId:race.boardId,activeTime:race.activeTime,penaltyTime:race.penaltyTime,rank:race.rank,player:{s:race.player.s,x:race.player.x,y:race.player.y,flags:[...race.player.flags],stability:race.player.stability,landings:race.player.landings,falls:race.player.falls,anchorUsed:race.player.anchorUsed,anchored:race.player.anchored},result:race.result?{...race.result,flags:[...race.result.flags]}:null}:null,render:renderer?.measure()||null,rafActive:!!raf});
await boot();
