import {Battle} from './engine.mjs?v=3';
import {STEP,STAGES,TYPES,BOSSES} from './data.mjs';
import {createStore,settle,SAVE_KEY} from './save.mjs';
import {LOCALES,LABELS,DICT,translator} from './locales.mjs';
import {COPY,ROUTES,interpolate} from './copy.mjs';
import {cue,combatAudio,resetAudio} from './audio.mjs';
const rootURL=new URL('../../',import.meta.url),assetURL=new URL('./assets/',import.meta.url);
const preview=new URL(location.href).searchParams.get('preview')==='1';
const previewURL=path=>{const url=new URL(path,rootURL);if(preview)url.searchParams.set('preview','1');return url.href;};
const $=id=>{const node=document.getElementById(id);if(!node)throw Error(`MISSING_FUSEKEEP_SLOT:${id}`);return node;};
const text=(node,value)=>{const next=String(value);if(node.textContent!==next)node.textContent=next;};
const create=(tag,className='',value)=>{const n=document.createElement(tag);if(className)n.className=className;if(value!==undefined)n.textContent=String(value);return n;};
const locale=LOCALES.includes(document.documentElement.lang)?document.documentElement.lang:'en';
const d=DICT[locale],copy=COPY[locale],baseT=translator(locale);
const t=(key,values={})=>Object.hasOwn(copy,key)?interpolate(copy[key],values):baseT(key,values);
let storage;try{storage=window.localStorage;}catch{/* Session-only operation remains available. */}
const store=createStore(storage);let saved=store.value,draft=[...saved.deck];
const lifecycle=new AbortController();
const listen=(node,type,fn,options={})=>node.addEventListener(type,fn,{...options,signal:lifecycle.signal});
let scene='main',sceneEpoch=0,runEpoch=0,battle=null,arena=null,raf=0,deferred=0,lastTime=0,accumulator=0,speed=1;
let modal=null,modalActions=[],previousFocus=null,selected=-1,focused=-1,gesture=null,suppressPointerClickUntil=0;
let settingsPaused=false,disposed=false,feedbackText='',feedbackExpiry=0,loadTimer=0;
let rendererPromise=null,rendererAttempts=0,portraitReady=false,portraitBusy=false,stageController=null;
let lastResources=null,cardViews=new WeakMap(),savedPortraits={};
const padNodes=[],deckNodes=[],damageNodes=[];
const formatTime=seconds=>`${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
const troopName=type=>d.troops[TYPES.indexOf(type)];
const unitLabel=unit=>t('unitHint',{name:troopName(unit.type),rank:unit.rank});
function feedback(key,values={}){
 const aliases={move:'moved',merge:'merged',summon:'summoned',upgrade:'upgraded',spell:'cast'};
 feedbackText=t(aliases[key]||key,values);feedbackExpiry=(battle?.time||0)+3;renderHUD();
}
function save(value=saved){saved=store.write(value);renderProgress();}
function renderProgress(){
 text($('progress'),`${saved.unlocked} / ${STAGES.length}`);text($('starTotal'),`${saved.stars.reduce((a,b)=>a+b,0)} / 90`);
 text($('stageProgress'),`${saved.unlocked} / ${STAGES.length}`);text($('stageDeckCount'),`${draft.length} / 5`);
 text($('storageNote'),t(store.available?'saved':'noStorage'));
}
for(const node of document.querySelectorAll('[data-t]'))text(node,t(node.dataset.t));
for(const node of document.querySelectorAll('[data-t-aria]'))node.setAttribute('aria-label',t(node.dataset.tAria));
const localeSelect=$('localeSelect');
localeSelect.replaceChildren(...LOCALES.map((code,index)=>{const option=create('option','',LABELS[index]);option.value=code;return option;}));
localeSelect.value=locale;
listen(localeSelect,'change',()=>{
 const next=localeSelect.value;if(!Object.hasOwn(ROUTES,next))return;
 try{storage?.setItem('weightPlayLocale',next);}catch{/* The destination URL still owns the selected locale. */}
 location.assign(previewURL(`${ROUTES[next]}/games/fusekeep/`));
});
function bindStage(card,index){
 const stage=STAGES[index];let nodes=cardViews.get(card);
 if(!nodes){
  const group=create('div');group.dataset.wpItemContent='';
  nodes={number:create('strong','mission-number'),name:create('strong','mission-name'),arc:create('span','mission-arc'),rule:create('span','mission-rule'),record:create('span','mission-record')};
  group.append(nodes.number,nodes.name,nodes.arc,nodes.rule,nodes.record);card.append(group);cardViews.set(card,nodes);
 }
 card.type='button';card.classList.add('stage-card');card.disabled=false;card.dataset.stageIndex=String(index);
 const locked=stage.id>saved.unlocked;card.setAttribute('aria-disabled',String(locked));card.dataset.wpStageRecommended=String(stage.id===saved.unlocked);
 text(nodes.number,stage.id);text(nodes.name,copy.missions[index]);text(nodes.arc,d.chapters[stage.arc]);
 text(nodes.rule,stage.boss?`${d.bosses[BOSSES.indexOf(stage.boss)]} · ${t('bossRule')}`:copy.patterns[stage.pattern]);
 text(nodes.record,locked?t('locked'):`${t('stars')} ${saved.stars[index]}/3${saved.best[index]?` · ${t('best')} ${formatTime(saved.best[index])}`:''}`);
 card.setAttribute('aria-label',`${t('level',{n:stage.id})}: ${copy.missions[index]}. ${nodes.rule.textContent}. ${nodes.record.textContent}`);
}
function refreshStage(){stageController?.refresh();renderProgress();}
function setTab(deck){
 $('deckPane').hidden=!deck;$('deckPane').inert=!deck;$('missionPane').hidden=deck;$('missionPane').inert=deck;
 $('deckTab').setAttribute('aria-selected',String(deck));$('missionTab').setAttribute('aria-selected',String(!deck));
 $('deckTab').tabIndex=deck?0:-1;$('missionTab').tabIndex=deck?-1:0;
 if(!deck&&scene==='stage')deferScene(()=>stageController?.center());
 if(deck&&scene==='stage')void loadPortraits();
}
function renderDeck(){
 deckNodes.forEach(({button},index)=>button.setAttribute('aria-pressed',String(draft.includes(TYPES[index]))));
 text($('deckCount'),`${draft.length} / 5 · ${t('chance')}`);renderProgress();
}
TYPES.forEach((type,index)=>{
 const button=create('button','troop-card');button.type='button';
 const group=create('span');group.dataset.wpItemContent='';
 const image=create('img');image.width=104;image.height=104;image.alt='';image.src=new URL('poster.webp',assetURL).href;
 group.append(image,create('strong','',d.troops[index]),create('span','troop-description',d.roles[index]));button.append(group);
 listen(button,'click',()=>{
  cue('click');if(draft.includes(type))draft=draft.filter(id=>id!==type);
  else if(draft.length<5)draft.push(type);else{text($('deckMessage'),t('deckFull'));return;}
  text($('deckMessage'),draft.length===5?t('chance'):t('deckMin'));
  if(draft.length===5)save({...saved,deck:[...draft]});renderDeck();
 });$('deckGrid').append(button);deckNodes.push({button,image});
});
function loadRenderer(){
 if(rendererPromise)return rendererPromise;
 if(rendererAttempts>=2)return Promise.reject(Error('RELOAD_REQUIRED'));
 rendererAttempts++;const suffix=rendererAttempts===1?'3':`3-retry${rendererAttempts}`;
 rendererPromise=import(`./renderer.mjs?v=${suffix}`).catch(error=>{rendererPromise=null;throw error;});return rendererPromise;
}
async function loadPortraits(){
 if(portraitReady||portraitBusy||scene!=='stage')return;portraitBusy=true;const epoch=sceneEpoch;
 try{const module=await loadRenderer();if(disposed||sceneEpoch!==epoch||scene!=='stage')return;
  savedPortraits=module.makePortraits(TYPES);deckNodes.forEach(({image},index)=>image.src=savedPortraits[TYPES[index]]);portraitReady=true;
 }catch{if(scene==='stage'&&sceneEpoch===epoch)text($('deckMessage'),t('unavailable'));}
 finally{portraitBusy=false;}
}
function deferScene(fn){
 cancelAnimationFrame(deferred);const epoch=sceneEpoch;
 deferred=requestAnimationFrame(()=>{deferred=0;if(!disposed&&epoch===sceneEpoch)fn();});
}
const frame=window.WeightPlayScreenFrame.mount({root:$('app'),localeSelect,scenes:{
 main:{root:$('mainScreen'),header:$('mainHeader'),content:$('mainContent')},
 stage:{root:$('stageCanvas'),header:$('stageHeader'),content:$('stageContent'),headerInfo:$('stageHud')},
 battle:{root:$('battleCanvas'),header:$('battleHeader'),content:$('battleContent'),headerInfo:$('battleHud')},
}});
stageController=window.WeightPlayStageV6.install($('stageRail'),{total:STAGES.length,poolSize:9,bind:bindStage,initialIndex:()=>saved.unlocked-1,activate:index=>void startBattle(index+1)});
if(!stageController)throw Error('SHARED_STAGE_NOT_MOUNTED');
function cancelGesture(){
 const active=gesture;gesture=null;arena?.clearDrag();
 if(active&&$('arenaFrame').hasPointerCapture?.(active.id))try{$('arenaFrame').releasePointerCapture(active.id);}catch{/* The browser may already have cancelled capture. */}
}
function stopLoop(){cancelAnimationFrame(raf);raf=0;lastTime=0;accumulator=0;}
function activate(next){
 sceneEpoch++;cancelAnimationFrame(deferred);deferred=0;cancelGesture();stopLoop();frame.close();scene=next;
 $('mainGroup').hidden=next!=='main';$('mainGroup').inert=next!=='main';$('mainScreen').hidden=next!=='main';
 $('gameGuide').hidden=next!=='main';$('gameGuide').inert=next!=='main';
 $('stageScreen').hidden=next!=='stage';$('battleScreen').hidden=next!=='battle';
 document.body.dataset.screen=next;frame.activate(next);window.dispatchEvent(new Event('resize'));
 deferScene(()=>{
  if(next==='main')$('start').focus({preventScroll:true});
  if(next==='stage'){stageController.center(saved.unlocked-1);$('stageRail').querySelector('[tabindex="0"]')?.focus({preventScroll:true});}
  if(next==='battle')arena?.resize();
 });
}
function releaseArena(){
 if(arena){lastResources=arena.resources();arena.dispose();lastResources={...lastResources,disposed:true,contexts:0};arena=null;}
}
function disposeRun(){
 runEpoch++;clearTimeout(loadTimer);loadTimer=0;stopLoop();cancelGesture();releaseArena();resetAudio();
 battle=null;selected=-1;focused=-1;modal=null;settingsPaused=false;
 $('battleDialog').hidden=true;$('battleContent').inert=false;damageNodes.forEach(item=>{item.node.hidden=true;item.until=0;});
}
function toStage(){disposeRun();saved=store.refresh();refreshStage();setTab(false);activate('stage');}
function toMain(){if(battle)disposeRun();activate('main');}
listen($('start'),'click',()=>{saved=store.refresh();refreshStage();setTab(false);activate('stage');cue('start');});
listen($('mainHeader').querySelector('[data-wp-return="main"]'),'click',()=>location.assign(previewURL(`${ROUTES[locale]}/`)));
listen($('stageHeader').querySelector('[data-wp-return="stage"]'),'click',toMain);
listen($('battleHeader').querySelector('[data-wp-return="battle"]'),'click',()=>openPause(true));
listen($('missionTab'),'click',()=>setTab(false));listen($('deckTab'),'click',()=>setTab(true));
listen($('stageNav'),'keydown',event=>{
 if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();
 const deck=event.key==='End'||(event.key!=='Home'&&$('deckPane').hidden);setTab(deck);$(deck?'deckTab':'missionTab').focus();
});
const modalButtons=[$('modalLeft'),$('modalMiddle'),$('modalRight')];
modalButtons.forEach((button,index)=>listen(button,'click',()=>{if(!button.disabled)modalActions[index]?.run();}));
function showModal(kind,title,body,actions,paragraphs=[]){
 stopLoop();cancelGesture();battle?.pause(true);previousFocus=document.activeElement;modal=kind;modalActions=actions;
 text($('dialogTitle'),title);text($('dialogBody'),body);$('dialogDetails').replaceChildren(...paragraphs.map(p=>create('p','',p)));text($('dialogStats'),'');
 modalButtons.forEach((button,index)=>{const action=actions[index];button.hidden=false;button.style.visibility=action?'visible':'hidden';button.disabled=!action||Boolean(action.disabled);text(button,action?.label||'');});
 $('battleDialog').hidden=false;$('battleContent').inert=true;frame.activate('battle',{covered:true});
 deferScene(()=>{if(modal===kind)modalButtons.find(button=>!button.disabled)?.focus({preventScroll:true});});renderOnce();
}
function hideModal(resume=true){
 modal=null;modalActions=[];$('battleDialog').hidden=true;$('battleContent').inert=false;frame.activate('battle');
 if(previousFocus?.isConnected&&!previousFocus.closest('[hidden]'))previousFocus.focus({preventScroll:true});
 if(resume&&!document.hidden&&arena){battle?.pause(false);startLoop();}else renderOnce();
}
function openPause(leaving=false,background=false){
 if(!battle||scene!=='battle'||['result','error','loading'].includes(modal))return;
 showModal('pause',t(leaving?'leaveTitle':'pause'),background?t('pausedHidden'):t('leaveText'),[
  {label:t('leave'),run:toStage},{label:t('resume'),run:()=>hideModal(true)},null,
 ]);
}
function help(intro=false){
 if(!battle)return;
 showModal('help',t('guide'),`${t('chance')} ${t('bossRule')}`,[
  {label:t('back'),run:toStage},{label:t(intro?'begin':'resume'),run:()=>{if(intro)save({...saved,tutorial:true});hideModal(true);}},null,
 ],[d.guideText[1],d.guideText[2],d.guideText[4]]);
}
function failure(){
 if(!battle||scene!=='battle'||modal==='error')return;
 runEpoch++;clearTimeout(loadTimer);loadTimer=0;stopLoop();cancelGesture();releaseArena();
 showModal('error',t('unavailable'),'',[
  {label:t('back'),run:toStage},
  {label:t('recover'),run:()=>rendererAttempts>=2&&!rendererPromise?location.reload():void restoreArena()},null,
 ]);
}
async function restoreArena(){
 if(!battle||disposed)return;const epoch=++runEpoch,owned=battle;releaseArena();
 showModal('loading',t('loading'),'', [{label:t('back'),run:toStage},null,null]);
 try{
  clearTimeout(loadTimer);
  const module=await Promise.race([loadRenderer(),new Promise((_,reject)=>{loadTimer=setTimeout(()=>reject(Error('ARENA_LOAD_TIMEOUT')),12000);})]);
  if(disposed||epoch!==runEpoch||battle!==owned||scene!=='battle')return;
  arena=new module.Arena($('arenaHost'),{onLost:failure,onLayout:placePads,reducedMotion:window.matchMedia('(prefers-reduced-motion: reduce)').matches});
  arena.render(battle,[],selected);placePads(arena.padScreens());hideModal(false);
  if(document.hidden){openPause(false,true);return;}
  if(!saved.tutorial){help(true);return;}
  battle.pause(false);startLoop();
 }catch(error){if(epoch===runEpoch&&battle===owned&&!disposed){console.warn('Fusekeep recovery:',error?.message);failure();}}
 finally{if(epoch===runEpoch){clearTimeout(loadTimer);loadTimer=0;}}
}
function seed(){try{return crypto.getRandomValues(new Uint32Array(1))[0];}catch{return Date.now()>>>0;}}
async function startBattle(id){
 if(disposed||!Number.isInteger(id)||id<1||id>saved.unlocked||id>STAGES.length)return;
 if(draft.length!==5){setTab(true);text($('deckMessage'),t('deckMin'));return;}
 disposeRun();save({...saved,deck:[...draft]});battle=new Battle(id,draft,seed());battle.pause(true);speed=1;feedbackText='';
 activate('battle');await restoreArena();
}
function showResult(){
 if(!battle||modal==='result')return;
 const won=battle.status==='won',id=battle.stage.id;if(won)save(settle(saved,battle));
 cue(won?'win':'wrong');
 showModal('result',t(won?'victory':'defeat'),won&&id===STAGES.length?t('complete'):'',[
  {label:t('back'),run:toStage},
  {label:t('next'),run:()=>void startBattle(id+1),disabled:!won||id>=STAGES.length},
  {label:t('retry'),run:()=>void startBattle(id)},
 ]);
 text($('dialogStats'),`${t('stars')}: ${battle.stars}/3 · ${t('wall')}: ${battle.hp}/${battle.maxHp} · ${t('time')}: ${formatTime(battle.time)}`);
}
function actionable(){return !disposed&&scene==='battle'&&battle?.status==='playing'&&arena&&!modal&&!settingsPaused&&!document.hidden;}
function action(command){
 if(!actionable()||gesture)return;
 const result=battle[command]();feedback(result);if(!['summon','upgrade','spell'].includes(result))cue('wrong',120);renderOnce();
}
listen($('summon'),'click',()=>action('summon'));listen($('upgrade'),'click',()=>action('upgrade'));listen($('spell'),'click',()=>action('spell'));
listen($('speed'),'click',()=>{if(!actionable()||gesture)return;speed=speed===1?2:1;renderHUD();cue('click');});
listen($('priority'),'click',()=>{
 if(!actionable()||gesture)return;battle.targetMode=battle.targetMode==='front'?'strong':'front';
 feedbackText=`${t('target')}: ${t(battle.targetMode==='front'?'front':'strong')}`;feedbackExpiry=battle.time+3;renderOnce();cue('click');
});
listen($('pause'),'click',()=>openPause());listen($('help'),'click',()=>help());
function choose(index){
 if(!actionable())return;
 if(selected===index)selected=-1;
 else if(selected<0){if(battle.board[index])selected=index;else feedback('selectPrompt');}
 else{const result=battle.move(selected,index);feedback(result);if(result==='move'||result==='merge'){selected=-1;if(result==='move')cue('click');}else cue('wrong',120);}
 renderOnce();
}
function placePads(positions){
 if(disposed)return;
 const physicalScale=$('arenaFrame').getBoundingClientRect().width/Math.max(1,$('arenaFrame').clientWidth);
 const size=Math.max(44,44/Math.max(.1,physicalScale));
 positions.forEach(({index,x,y})=>{const button=padNodes[index];if(!button)return;button.style.left=`${x}px`;button.style.top=`${y}px`;button.style.width=`${size}px`;button.style.height=`${size}px`;});
}
for(let index=0;index<9;index++){
 const button=create('button','pad-target');button.type='button';button.dataset.pad=String(index);button.tabIndex=index===0?0:-1;
 const rank=create('span','rank-badge');rank.setAttribute('aria-hidden','true');button.append(rank);
 listen(button,'focus',()=>{focused=index;renderOnce();});listen(button,'blur',()=>{focused=-1;renderOnce();});
 listen(button,'click',event=>{if(event.detail===0||performance.now()>suppressPointerClickUntil)choose(index);});
 listen(button,'keydown',event=>{
  if(event.repeat&&['Enter',' '].includes(event.key)){event.preventDefault();return;}
  let next=index;
  if(event.key==='ArrowLeft')next=index%3?index-1:index;
  else if(event.key==='ArrowRight')next=index%3<2?index+1:index;
  else if(event.key==='ArrowUp')next=Math.max(0,index-3);
  else if(event.key==='ArrowDown')next=Math.min(8,index+3);
  else if(event.key==='Home')next=0;else if(event.key==='End')next=8;else return;
  event.preventDefault();padNodes.forEach((node,i)=>node.tabIndex=i===next?0:-1);padNodes[next].focus();
 });padNodes.push(button);$('padLayer').append(button);
}
function destination(event){
 const actual=arena?.padAt(event.clientX,event.clientY)??-1;if(actual>=0)return actual;
 const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('.pad-target');
 return target&&$('padLayer').contains(target)?Number(target.dataset.pad):-1;
}
listen($('arenaFrame'),'pointerdown',event=>{
 if(gesture&&gesture.id!==event.pointerId){cancelGesture();selected=-1;renderOnce();return;}
 if(!actionable()||gesture||!event.isPrimary||event.button!==0)return;
 const target=event.target.closest?.('.pad-target');
 const from=target?Number(target.dataset.pad):destination(event);if(from<0)return;
 gesture={id:event.pointerId,from,unitId:battle.board[from]?.id,x:event.clientX,y:event.clientY,moved:false};
 $('arenaFrame').setPointerCapture(event.pointerId);event.preventDefault();
});
listen($('arenaFrame'),'pointermove',event=>{
 if(!gesture||gesture.id!==event.pointerId||!actionable())return;
 const beyond=Math.hypot(event.clientX-gesture.x,event.clientY-gesture.y)>8;
 if(beyond)gesture.moved=true;
 if(gesture.moved&&gesture.unitId){selected=gesture.from;arena.dragTo(gesture.from,event.clientX,event.clientY);renderOnce();}
});
listen($('arenaFrame'),'pointerup',event=>{
 if(!gesture||gesture.id!==event.pointerId)return;
 const g=gesture,target=destination(event);cancelGesture();suppressPointerClickUntil=performance.now()+500;
 if(!actionable())return;
 if(g.moved){
  if(g.unitId&&target>=0&&target!==g.from){const result=battle.move(g.from,target,g.unitId);feedback(result);if(!['move','merge'].includes(result))cue('wrong',120);}
  selected=-1;
 }else choose(g.from);
 renderOnce();event.preventDefault();
});
for(const type of ['pointercancel','lostpointercapture'])listen($('arenaFrame'),type,()=>{if(gesture){cancelGesture();selected=-1;renderOnce();}});
listen($('arenaFrame'),'contextmenu',event=>{event.preventDefault();cancelGesture();selected=-1;renderOnce();});
for(let i=0;i<24;i++){
 const node=create('span','damage-number');node.hidden=true;node.setAttribute('aria-hidden','true');$('damageLayer').append(node);damageNodes.push({node,until:0,x:0,z:0});
}
function processEvents(events){
 for(const event of events){
  combatAudio(event);
  if(event.type==='hit'&&event.amount>0){const slot=damageNodes.find(item=>item.until<=battle.time);if(slot){slot.until=battle.time+.7;slot.x=event.x;slot.z=event.z;text(slot.node,`−${event.amount}`);slot.node.hidden=false;}}
  if(event.type==='theft')feedback('theft',{n:event.amount});
 }
}
function renderHUD(){
 if(!battle)return;
 text($('battleLevel'),battle.stage.id);text($('battleWave'),`${battle.wave}/15`);text($('battleGold'),battle.gold);
 $('wallMeter').value=battle.hp;text($('wallText'),`${battle.hp}/${battle.maxHp}`);
 const active=Boolean(actionable()),priority=t(battle.targetMode==='front'?'front':'strong');
 $('priority').setAttribute('aria-label',`${t('target')}: ${priority}`);$('priority').setAttribute('aria-pressed',String(battle.targetMode==='strong'));
 text($('speedValue'),`×${speed}`);$('speed').setAttribute('aria-label',`${t('speed')}: ${speed}`);
 text($('summonCost'),battle.summonCost);text($('upgradeCost'),battle.upgrades>=5?t('max'):battle.upgradeCost);
 text($('spellCost'),battle.spellCooldown>0?Math.ceil(battle.spellCooldown):'✓');
 for(const id of ['summon','upgrade','spell','speed','priority','pause','help'])$(id).disabled=!active;
 if(battle.upgrades>=5)$('upgrade').disabled=true;if(battle.spellCooldown>0)$('spell').disabled=true;
 $('summon').setAttribute('aria-label',`${t('summon')}: ${battle.summonCost} ${t('goldLabel')}`);
 $('upgrade').setAttribute('aria-label',`${t('upgrade')}: ${battle.upgrades>=5?t('max'):battle.upgradeCost+' '+t('goldLabel')}`);
 $('spell').setAttribute('aria-label',`${t('spell')}${battle.spellCooldown>0?' · '+t('cooldown')+' '+Math.ceil(battle.spellCooldown):''}`);
 const chosen=selected>=0?battle.board[selected]:null;text($('selectionHint'),chosen?unitLabel(chosen):t('helpMerge'));
 padNodes.forEach((button,index)=>{
  const unit=battle.board[index],frozen=battle.frozen[index]>0;
  button.disabled=!active;button.dataset.selected=String(selected===index);button.dataset.empty=String(!unit);button.dataset.frozen=String(frozen);
  button.setAttribute('aria-pressed',String(selected===index));button.setAttribute('aria-label',`${index+1}: ${unit?unitLabel(unit):t('empty')}${frozen?' · '+t('frozen'):''}`);text(button.firstElementChild,unit?unit.rank:'+');
 });
 const boss=battle.enemies.find(e=>e.boss&&!e.dead);
 const warning=battle.warnings.length||battle.enemies.some(e=>(e.cast?.indices?.length||0)>0);
 let message='';
 if(boss?.cast)message=t('warnBoss',{name:d.bosses[BOSSES.indexOf(boss.type)]});
 else if(warning)message=t('warnFreeze');
 else if(boss?.type==='mirror')message=t(boss.armored?'armorOn':'armorOff');
 else if(battle.breakTime>0)message=t('breakLabel',{n:Math.ceil(battle.breakTime)});
 text($('battleCue'),message);$('battleCue').hidden=!message;
 if(feedbackExpiry<battle.time)feedbackText='';text($('feedback'),feedbackText);
 damageNodes.forEach(item=>{
  if(!arena||item.until<=battle.time){item.node.hidden=true;return;}
  const p=arena.project(item.x,1.5+(1-(item.until-battle.time)/.7)*.4,item.z);item.node.style.left=`${p.x}px`;item.node.style.top=`${p.y}px`;
 });
}
function renderOnce(events){
 if(!battle||!arena||scene!=='battle')return;
 const batch=events||battle.drainEvents();processEvents(batch);
 try{arena.render(battle,batch,selected,focused);renderHUD();}catch(error){console.warn('Fusekeep renderer:',error?.message);failure();}
}
function startLoop(){if(raf||!actionable())return;lastTime=0;accumulator=0;raf=requestAnimationFrame(tick);renderHUD();}
function tick(now){
 raf=0;if(!actionable())return;
 const elapsed=lastTime?Math.max(0,Math.min(.1,(now-lastTime)/1000)):0;lastTime=now;accumulator+=elapsed*speed;
 let steps=0;while(accumulator>=STEP&&steps++<6&&battle.status==='playing'){battle.step(STEP);accumulator-=STEP;}
 if(steps>=6)accumulator=0;renderOnce();
 if(battle&&['won','lost'].includes(battle.status)){showResult();return;}
 if(actionable())raf=requestAnimationFrame(tick);
}
const resizeObserver=new ResizeObserver(()=>{
 if(disposed)return;
 const content=$('battleContent');content.dataset.wide=String(content.clientWidth>=720);
 if(scene==='battle')deferScene(()=>{arena?.resize();if(arena)placePads(arena.padScreens());});
});resizeObserver.observe($('battleContent'));
listen(window,'resize',()=>{cancelGesture();if(scene==='stage')deferScene(()=>stageController?.center());});
listen(window,'weightplay:interaction-state',()=>{
 if(scene!=='battle'||!battle)return;
 const open=Boolean($('battleHeader').querySelector('.wp-frame-popover:not([hidden])'));
 if(open&&battle.status==='playing'&&!modal){settingsPaused=true;battle.pause(true);cancelGesture();stopLoop();renderOnce();}
 else if(!open&&settingsPaused){settingsPaused=false;if(!modal&&!document.hidden&&arena){battle.pause(false);startLoop();}}
});
listen(document,'visibilitychange',()=>{
 if(document.hidden&&battle&&scene==='battle'&&!modal){settingsPaused=false;frame.close();openPause(false,true);}
});
listen(window,'blur',()=>{cancelGesture();if(actionable())openPause(false,true);});
listen(window,'storage',event=>{if(event.key===SAVE_KEY&&scene!=='battle'){saved=store.refresh();renderProgress();refreshStage();}});
listen($('battleDialog'),'keydown',event=>{
 if(event.key!=='Tab')return;
 const available=modalButtons.filter(button=>!button.disabled&&button.style.visibility!=='hidden');const first=available[0],last=available.at(-1);if(!first)return;
 if(event.shiftKey&&(document.activeElement===first||!$('battleDialog').contains(document.activeElement))){event.preventDefault();last.focus();}
 else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
});
listen(document,'keydown',event=>{
 if(event.defaultPrevented||scene!=='battle')return;
 if(event.repeat&&['Enter',' ','Escape'].includes(event.key)){event.preventDefault();return;}
 if(event.key==='Escape'){
  event.preventDefault();if(gesture||selected>=0){cancelGesture();selected=-1;renderOnce();}
  else if(modal==='pause'||modal==='help')hideModal(true);else if(!modal)openPause();
 }
});
function destroy(){
 if(disposed)return;disposed=true;sceneEpoch++;runEpoch++;clearTimeout(loadTimer);loadTimer=0;
 stopLoop();cancelAnimationFrame(deferred);cancelGesture();releaseArena();resizeObserver.disconnect();stageController?.destroy();frame.destroy();lifecycle.abort();savedPortraits={};resetAudio();
}
listen(window,'pagehide',event=>{
 if(!event.persisted){destroy();return;}
 runEpoch++;clearTimeout(loadTimer);loadTimer=0;stopLoop();cancelGesture();battle?.pause(true);releaseArena();frame.close();
});
listen(window,'pageshow',event=>{
 if(!event.persisted||disposed)return;
 if(battle&&scene==='battle'){modal=null;failure();}else{frame.activate(scene);refreshStage();if(scene==='stage')deferScene(()=>stageController.center());}
});
// Observability for the next AI; no cheat setters, release flags, or test acceptance.
window.FusekeepDiagnostics=Object.freeze({
 snapshot:()=>({scene,version:3,locale,modal,speed,loopActive:Boolean(raf),selected,
  battle:battle?{stage:battle.stage.id,wave:battle.wave,status:battle.status,hp:battle.hp,gold:battle.gold,
   board:battle.board.map(unit=>unit?{id:unit.id,type:unit.type,rank:unit.rank}:null),enemies:battle.enemies.length,
   pending:battle.pending.length,shots:battle.shots.length,time:battle.time}:null,
  resources:arena?.resources()||lastResources,portraitCount:Object.keys(savedPortraits).length,
  stagePool:$('stageRail').querySelectorAll('[data-wp-stage-pool-node]').length,storageAvailable:store.available}),
});
renderProgress();renderDeck();setTab(false);activate('main');
$('bootError').hidden=true;document.documentElement.dataset.fusekeepReady='true';
