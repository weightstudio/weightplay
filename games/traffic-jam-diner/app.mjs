import * as THREE from './vendor/three/three.module.min.js';
import { CAMPAIGN_STAGES, SNACKS } from './campaign.mjs?v=20261027-diner-opt-v25';
import { normalizeStage, createInitialState, legalActions, applyAction, isWon, routeForMove, stateKey, explainMove } from './engine.mjs?v=20261027-diner-opt-v25';
import { GAME_COPY, LOCALE_LABELS } from './copy.mjs';
import { LEAVE_UI } from './interface-copy.mjs';
import {REBUILD_COPY,stageTitle} from './rebuild-copy.mjs?v=20261027-diner-opt-v25';
import {OPTIMIZATION_COPY} from './optimization-copy.mjs?v=20261027-diner-opt-v25';
import {MILESTONE_STAGES,currentBest,cleanRouteBest,preserveAchievements,preserveRouteHistory,totalEarnedStars,earnedMilestones,recordClear} from './progress.mjs?v=20261027-diner-opt-v25';
import {pantryWarning} from './pantry.mjs?v=20261027-diner-opt-v25';
import {DinerScene,createDecorPreviews} from './render.mjs?v=20261027-diner-opt-v25';
import {LESSON_COPY} from './lesson-copy.mjs?v=20261027-diner-opt-v25';
import {LocalPractice} from '../../src/game-local-practice.mjs';

const $ = s => document.querySelector(s), localeSelect=$('#localeSelect'), root=$('#app');
let locale='en',stage,state,undoStack=[],selectedGuest=null,candidates=[],renderer,frame,paused=false;
let selectedStageIndex=0,stageRail=null,run=0,startRequest=0,hintWorker=null,hintRequest=0,hintTimer=0,practiceRun=false,busy=false;
const effects=new Set();
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const totalStars=()=>totalEarnedStars(save,CAMPAIGN_STAGES.length);
const CHARACTER_ART={turtle:'/games/traffic-jam-diner/assets/taro-block-sprite-v23.webp',fox:'/games/traffic-jam-diner/assets/fia-block-sprite-v23.webp',rabbit:'/games/traffic-jam-diner/assets/mimi-block-sprite-v23.webp',bear:'/games/traffic-jam-diner/assets/panko-block-sprite-v23.webp'};
let characterTextures={};
let assetsReady=false,entryLoader=null,assetGeneration=0,loadTimedOut=false,decorPreviews=null,decorPreviewTask=null;
const saveKey='weightplay:traffic-jam-diner:v1', backupKey=`${saveKey}:backup`;
const fresh=()=>({version:1,unlocked:1,best:{},routeBest:{},routeHistory:{},achievements:{},lastStage:1,ownedItems:[],boardStyle:'classic'});
function loadSave(){
 for(const key of [saveKey,backupKey])try{
  const value=JSON.parse(localStorage.getItem(key));if(value?.version!==1||!Number.isInteger(value.unlocked)||value.unlocked<1)continue;
  const best={};for(const [id,record] of Object.entries(value.best||{}))if(Number.isInteger(Number(id))&&Number(id)>=1&&Number(id)<=CAMPAIGN_STAGES.length&&Number.isInteger(record?.moves)&&record.moves>=0&&Number.isInteger(record?.stars)&&record.stars>=1&&record.stars<=3)best[id]={moves:record.moves,stars:record.stars};
  const ownedItems=Array.isArray(value.ownedItems)?value.ownedItems.filter(item=>item==='berry-grove-board'):[];
  return {...fresh(),...value,unlocked:Math.min(CAMPAIGN_STAGES.length,value.unlocked),lastStage:Math.max(1,Math.min(CAMPAIGN_STAGES.length,Number(value.lastStage)||1)),best,achievements:preserveAchievements(value,CAMPAIGN_STAGES.length),routeHistory:preserveRouteHistory(value,CAMPAIGN_STAGES),routeBest:cleanRouteBest(value.routeBest,CAMPAIGN_STAGES),ownedItems,boardStyle:value.boardStyle==='berry-grove'&&ownedItems.includes('berry-grove-board')?'berry-grove':'classic'};
 }catch{}
 return fresh();
}
let save=loadSave();
function persist(){if(practiceRun)return;try{localStorage.setItem(backupKey,JSON.stringify(save));localStorage.setItem(saveKey,JSON.stringify(save));}catch{say('loadError','error');}}
const t=(key,args={})=>Object.entries(args).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,v), (LESSON_COPY[locale]?.[key]||OPTIMIZATION_COPY[locale]?.[key]||REBUILD_COPY[locale]?.[key]||GAME_COPY[locale]?.[key]||GAME_COPY.en[key]||key));
const shopCost=12,shopItem='berry-grove-board',purchaseKey=`${saveKey}:purchase-pending`;
function recoverPendingPurchase(){if(new URLSearchParams(location.search).get('practice')==='1')return;try{const pending=JSON.parse(localStorage.getItem(purchaseKey)||'null');if(!pending)return;const balance=Number(window.WeightPlayWallet?.read?.()?.diamonds)||0;if(pending.item===shopItem&&Number.isFinite(pending.before)&&balance<=pending.before-shopCost){save.ownedItems=[...new Set([...(save.ownedItems||[]),shopItem])];save.boardStyle='berry-grove';localStorage.setItem(backupKey,JSON.stringify(save));localStorage.setItem(saveKey,JSON.stringify(save));}localStorage.removeItem(purchaseKey);}catch{}}
function renderStore(){const balance=Math.max(0,Number(window.WeightPlayWallet?.read?.()?.diamonds)||0),owned=save.ownedItems?.includes(shopItem);$('#shop-balance').textContent=String(balance);$('#shop-classic').setAttribute('aria-pressed',String(save.boardStyle==='classic'));$('#shop-confirm').setAttribute('aria-pressed',String(owned&&save.boardStyle==='berry-grove'));$('#shop-confirm').disabled=practiceRun||(owned?save.boardStyle==='berry-grove':balance<shopCost);$('#shop-confirm').textContent=owned?t(save.boardStyle==='berry-grove'?'equipped':'equip'):t('shopConfirm');$('#shop-status').textContent=owned?t(save.boardStyle==='berry-grove'?'shopBought':'shopOwned'):balance<shopCost?t('shopNeedDiamonds'):localStorage.getItem(purchaseKey)?t('shopError'):'';}
function openStore(){renderStore();renderMilestones();$('#shop-dialog').hidden=false;$('#shop-cancel').focus({preventScroll:true});}
function closeStore(){if(!$('#shop-dialog').hidden){$('#shop-dialog').hidden=true;$('#shop-open').focus({preventScroll:true});}}
function renderMilestones(){
 const earned=earnedMilestones(save),names=OPTIMIZATION_COPY[locale].milestoneNames;
 $('#milestone-title').textContent=t('milestones');$('#milestone-progress').textContent=t('milestoneProgress',{n:earned.length,total:MILESTONE_STAGES.length});
 const grid=$('#milestone-list');grid.replaceChildren();
 MILESTONE_STAGES.forEach((id,index)=>{const row=document.createElement('li'),image=document.createElement('img'),name=document.createElement('strong'),status=document.createElement('span');row.dataset.earned=String(earned.includes(id));image.src=decorPreviews[index];image.alt='';image.width=64;image.height=64;image.draggable=false;name.textContent=names[index];status.textContent=earned.includes(id)?t('milestoneEarned'):t('milestoneLocked',{n:id});row.append(image,name,status);grid.append(row);});
}
function buyBoardFinish(){
    if (window.WeightPlayWallet?.withTransaction && !window.WeightPlayWallet.inTransaction()) return window.WeightPlayWallet.withTransaction("traffic-jam-diner:app.mjs:buyBoardFinish", () => buyBoardFinish(...arguments));
if(practiceRun)return;if(save.ownedItems?.includes(shopItem)){save.boardStyle='berry-grove';persist();renderStore();if(stage)refreshTheme();return;}const wallet=window.WeightPlayWallet;if(!wallet?.read||!wallet?.spendDiamonds){$('#shop-status').textContent=t('shopError');return;}const before=Math.max(0,Number(wallet.read()?.diamonds)||0);if(before<shopCost){renderStore();return;}try{localStorage.setItem(purchaseKey,JSON.stringify({item:shopItem,before}));if(!wallet.spendDiamonds(shopCost)){localStorage.removeItem(purchaseKey);renderStore();return;}save.ownedItems=[...new Set([...(save.ownedItems||[]),shopItem])];save.boardStyle='berry-grove';localStorage.setItem(backupKey,JSON.stringify(save));localStorage.setItem(saveKey,JSON.stringify(save));localStorage.removeItem(purchaseKey);renderStore();closeStore();if(stage)refreshTheme();audio('shop.purchase');}catch(error){$('#shop-status').textContent=t('shopError');console.error('traffic-jam-diner purchase recovery pending',error);}}
recoverPendingPurchase();
const snackLabel=key=>t(SNACKS[key].labelKey);
function snackImage(key){const image=document.createElement('img');image.src=SNACKS[key].asset;image.alt='';image.setAttribute('aria-hidden','true');image.draggable=false;return image;}
async function loadCharacterArt(isCurrent,onProgress){
 let loadedCount=0;const loader=new THREE.TextureLoader(),entries=[...Object.entries(CHARACTER_ART),...Object.entries(SNACKS).map(([key,item])=>[`snack_${key}`,item.asset])],results=await Promise.allSettled(entries.map(async([animal,src])=>{const texture=await loader.loadAsync(src);texture.colorSpace=THREE.SRGBColorSpace;if(isCurrent())onProgress(++loadedCount,entries.length);return [animal,texture];}));
 const loaded=results.filter(result=>result.status==='fulfilled').map(result=>result.value);
 try{
  if(results.some(result=>result.status==='rejected'))throw new Error('Character art unavailable');
  await Promise.all(Object.values(SNACKS).map(item=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>image.naturalWidth?resolve():reject(new Error('Empty food art'));image.onerror=()=>reject(new Error('Food art unavailable'));image.src=item.asset;})));
  if(!isCurrent()){for(const [,texture] of loaded)texture.dispose();return false;}for(const texture of Object.values(characterTextures))texture.dispose();characterTextures=Object.fromEntries(loaded);return true;
 }catch(error){for(const [,texture] of loaded)texture.dispose();throw error;}
}
function say(key,tone='',args={}){const el=$('#battle-status');el.textContent=t(key,args);el.dataset.tone=tone;emphasize(el,tone==='error');}
let audioScope=null;
function audio(event){try{audioScope??=window.WeightPlayAudio?.createScope?.();audioScope?.play(event);}catch{}}
function setLocale(value){locale=GAME_COPY[value]?value:'en';document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.querySelectorAll('[data-copy]').forEach(el=>el.textContent=t(el.dataset.copy));document.querySelectorAll('[data-copy-aria]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.copyAria)));const labels={"#queue-label":"order","#order-label":"order","#main-header h1":"title","[data-wp-game-title]":"title","#main-summary":"summary","#start-game":"start","#main-progress":"ready","#shop-open":"shopOpen","#stage-header h2":"choose","#stage-screen [data-wp-frame-stage-slot]":"stages","#basket-title":"basket","#serve-btn":"serve","#undo-btn":"undo","#hint-btn":"hint","#retry-btn":"retry","#map-btn":"map","#help-title":"howTitle","#help-copy":"how","#help-close":"close","#result-title":"clear","#result-replay":"retry","#result-map":"map","#guide-summary":"guideSummary","#guide-how-title":"guideHowTitle","#guide-how":"guideHow","#guide-rules-title":"guideRulesTitle","#guide-rules":"guideRules","#guide-topic-title":"topicTitle","#guide-topic":"topic","#guide-save-title":"saveTitle","#guide-save":"save","#guide-tag-one":"tagLane","#guide-tag-two":"tagOrder","#guide-tag-three":"tagCampaign","#fact-goal-label":"goalLabel","#fact-goal":"goal","#fact-style-label":"puzzleLabel","#fact-style":"puzzle","#fact-difficulty-label":"difficultyLabel","#fact-difficulty":"difficulty","#fact-time-label":"timeLabel","#fact-time":"time"};for(const [selector,key]of Object.entries(labels)){const el=$(selector);if(el)el.textContent=key==='ready'?t(assetsReady?'ready':'loading',{n:save.lastStage}):t(key);}const next=$('#result-next');if(next&&stage)next.textContent=stage.id===CAMPAIGN_STAGES.length?t('nextStage'):t('stage',{n:stage.id+1});$('#localeSelect').value=locale;renderStages();if(stage)updateUI();renderStore();updateLeaveCopy();updateMain();}

function emphasize(element,error=false){
 if(!element)return;const animation=element.animate(reduced()?[{opacity:.5},{opacity:1}]:error?[{transform:'translateX(-3px)'},{transform:'translateX(3px)'},{transform:'none'}]:[{opacity:.55},{opacity:1}],{duration:reduced()?80:180});
 effects.add(animation);animation.finished.then(()=>effects.delete(animation),()=>effects.delete(animation));
}
function cancelEffects(){audioScope?.stop();for(const animation of effects)animation.cancel();effects.clear();renderer?.cancel();if(renderer&&stage&&state&&renderer.stage===stage&&!renderer.isLost())renderer.show(state,selectedGuest,candidates);hintRequest++;clearTimeout(hintTimer);hintWorker?.terminate();hintWorker=null;busy=false;}
function transferFood(key,source,target){
 if(!source||!target)return;const from=source.getBoundingClientRect(),to=target.getBoundingClientRect();
 const image=snackImage(key);image.className='food-flight';image.style.cssText=`left:${from.x+from.width/2-18}px;top:${from.y+from.height/2-18}px`;
 document.body.append(image);
 const frames=reduced()?[{opacity:1},{opacity:0}]:[{transform:'translate(0,0) scale(1)'},{transform:`translate(${to.x+to.width/2-from.x-from.width/2}px,${to.y+to.height/2-from.y-from.height/2}px) scale(.7)`}];
 const animation=image.animate(frames,{duration:reduced()?80:320,easing:'cubic-bezier(.2,.7,.2,1)'});effects.add(animation);
 animation.finished.then(()=>{image.remove();effects.delete(animation);emphasize(target);},()=>{image.remove();effects.delete(animation);});
}
function updateMain(){if(!assetsReady)return;$('#main-progress').textContent=`${t('stage',{n:save.unlocked})} / ${CAMPAIGN_STAGES.length}`;}
function initFrame(){
 const shop=$('#shop-dialog');root.append(shop);$('#stage-tabs').append($('#shop-open'));
 frame=window.WeightPlayScreenFrame.mount({root,localeSelect,playUI:true,scenes:{main:{root:$('#main-screen'),header:$('#main-header'),content:$('#main-content')},stage:{root:$('#stage-screen'),header:$('#stage-header'),content:$('#stage-content')},battle:{root:$('#battle-screen'),header:$('#battle-header'),content:$('#battle-content'),headerInfo:$('#battle-info')}}});
 const battleGroup=window.WeightPlayScreenFrame.createGroup();for(const node of [...$('#battle-info').children])battleGroup.add(node);frame.battleTopUI.add(battleGroup);
 frame.stageTopUI.add($('#stage-progress'));enter('main');
}
function stageConfig(){return {gameId:'traffic-jam-diner',count:CAMPAIGN_STAGES.length,poster:'/Assets/traffic-jam-diner-cover-v3.png',background:'/assets/lobby-block-atmosphere.svg',stage(index){
 const item=CAMPAIGN_STAGES[index],record=currentBest(save,item),legacy=save.best[item.id]||save.achievements[item.id],arc=(REBUILD_COPY[locale]||REBUILD_COPY.en).arcs[item.arc-1];
 return {id:item.id,kicker:t('stage',{n:item.id}),title:stageTitle(item,locale),subtitle:arc,status:LocalPractice.enabled?t('practice'):item.id>save.unlocked?t('locked'):record?'★'.repeat(record.stars)+'☆'.repeat(3-record.stars):legacy?t('routeUpdated'):t('target',{n:item.targetMoves}),summary:t('goal'),details:[t('experience'),t('target',{n:item.targetMoves})],locked:!LocalPractice.enabled&&item.id>save.unlocked,cleared:Boolean(record||legacy)};
 }};}
function renderStages(){
 $('#stage-progress').textContent=LocalPractice.enabled?t('practice'):t('mastery',{n:totalStars()});
 if(!stageRail){if(!window.WeightPlayPlayUI)return;stageRail=window.WeightPlayPlayUI.mountStage({page:$('#stage-content'),rail:$('#stage-list'),config:stageConfig(),selected:selectedStageIndex,onSelect:index=>{selectedStageIndex=index;},onStart:index=>startStage(index+1),isActive:()=>document.body.dataset.screen==='stage'});}
 else stageRail.setConfig(stageConfig(),selectedStageIndex);
}
function enter(name){
 if(name!=='battle')startRequest++;
 cancelEffects();if(name!=='stage')stageRail?.cancel();
 frame?.activate(name);for(const id of ['main','stage','battle'])$('#'+id+'-screen').hidden=id!==name;
 document.body.dataset.screen=name;if(name==='stage')renderStages();if(name==='main')updateMain();
 if(name==='battle')requestAnimationFrame(()=>renderer?.resize());
}
let battleEntryState=null;
function updateLeaveCopy(){if(!$('#leave-title'))return;const copy=LEAVE_UI[locale]||LEAVE_UI.en;$('#leave-title').textContent=copy.title.replace('{stage}',t('stage',{n:stage?.id||save.lastStage}));$('#leave-copy').textContent=copy.body;$('#leave-continue').textContent=copy.continue;$('#leave-confirm').textContent=copy.leave;}
function closeLeave(){paused=false;$('#leave-panel').hidden=true;updateUI();}
function requestStageReturn(){
 if(!stage||isWon(state)||JSON.stringify(state)===battleEntryState){enter('stage');return;}
 cancelEffects();paused=true;drawBoard();updateLeaveCopy();$('#leave-panel').hidden=false;
}
function initLeaveDialog(){
 const panel=document.createElement('section');panel.id='leave-panel';panel.className='help-panel leave-panel';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby','leave-title');
 panel.innerHTML='<div class="help-card leave-card"><h2 id="leave-title"></h2><p id="leave-copy"></p><div class="leave-actions"><button id="leave-continue" class="primary" type="button"></button><button id="leave-confirm" type="button"></button></div></div>';
 $('#battle-content').append(panel);$('#leave-continue').addEventListener('click',closeLeave);$('#leave-confirm').addEventListener('click',()=>{closeLeave();enter('stage');});
}
function initOrderDialog(){
 const panel=document.createElement('section');panel.id='orders-panel';panel.className='help-panel';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby','orders-title');
 panel.innerHTML='<div class="help-card orders-card"><h2 id="orders-title"></h2><p id="orders-intro"></p><ol id="orders-list"></ol><p id="orders-tools"></p><button id="orders-close" type="button"></button></div>';
 $('#battle-content').append(panel);
 $('#orders-open').addEventListener('click',openOrders);$('#orders-close').addEventListener('click',()=>{paused=false;panel.hidden=true;updateUI();$('#orders-open').focus({preventScroll:true});});
}
function openOrders(){
 if(covered())return;cancelEffects();paused=true;
 $('#orders-title').textContent=t('ordersTitle');$('#orders-intro').textContent=t('ordersIntro');$('#orders-close').textContent=t('close');
 const list=$('#orders-list');list.replaceChildren();
 stage.queue.forEach((guest,index)=>{
  const row=document.createElement('li'),heading=document.createElement('div'),avatar=document.createElement('img'),label=document.createElement('strong'),recipe=document.createElement('div');
  row.dataset.current=String(index===state.servedCount);row.dataset.served=String(index<state.servedCount);avatar.src=CHARACTER_ART[stage.guests[guest].animal];avatar.alt='';label.textContent=`${t('ticket',{n:index+1})}${index<state.servedCount?' · '+t('orderDone'):index===state.servedCount?' · '+t('orderNext'):''}`;heading.append(avatar,label);recipe.className='preview-recipe';
  stage.guests[guest].order.forEach((slot,slotIndex)=>{const item=document.createElement('span'),choices=Array.isArray(slot)?slot:[slot];item.className='preview-slot';item.setAttribute('aria-label',`${slotIndex+1}: ${choices.map(snackLabel).join(' / ')}`);choices.forEach((key,choice)=>{if(choice){const or=document.createElement('small');or.textContent=t('orderAlternative');item.append(or);}item.append(snackImage(key));});recipe.append(item);});
  row.append(heading,recipe);list.append(row);
 });
 $('#orders-tools').textContent=`${t('capacity',{used:state.positions.filter(node=>stage.pockets.includes(node)).length,total:stage.pocketCapacity||0})}${stage.gates.some(gate=>gate.alternate)?' · '+t('gateHelp'):''}`;
 $('#orders-panel').hidden=false;
}
async function startStage(id){
 if(!assetsReady)return;
 const request=++startRequest;
 if(!Number.isInteger(id)||!CAMPAIGN_STAGES[id-1]||(!LocalPractice.enabled&&id>save.unlocked))return;
 if(LocalPractice.enabled&&!await LocalPractice.validate())return;
 if(request!==startRequest)return;
 cancelEffects();run++;practiceRun=LocalPractice.enabled;selectedStageIndex=id-1;stage=normalizeStage(CAMPAIGN_STAGES[id-1]);state=createInitialState(stage);battleEntryState=JSON.stringify(state);undoStack=[];selectedGuest=null;candidates=[];paused=false;
 for(const id of ['result-panel','help-panel','orders-panel','leave-panel','render-error'])$('#'+id).hidden=true;
 if(!practiceRun){save.lastStage=stage.id;persist();}
 enter('battle');if(!ensureRenderer())return;renderer.setStage(stage,save.boardStyle,earnedMilestones(save).length);$('#order-dock').dataset.hasGates=String(stage.gates.length>0);updateUI();say(stage.lesson==='yield'?'lessonYield':stage.lesson==='reserve'?'lessonReserve':stage.id===1?'firstPlay':'experience');audio('game.start');$('#board-canvas').focus({preventScroll:true});
}
function renderFailure(){cancelEffects();paused=true;$('#render-error').hidden=false;}
function ensureRenderer(){
 if(renderer){if(renderer.isLost()){renderFailure();return false;}return true;}
 try{renderer=new DinerScene($('#board-canvas'),{textures:characterTextures,onPick:pickNode,onProject:positionControls,reduced,onFailure:renderFailure,onRestore:()=>{paused=false;$('#render-error').hidden=true;refreshTheme();}});return true;}
 catch{renderer?.dispose();renderer=null;renderFailure();return false;}
}
function refreshTheme(){if(renderer&&stage){renderer.setStage(stage,save.boardStyle,earnedMilestones(save).length);drawBoard();}}
function drawBoard(){if(renderer&&stage&&state){renderer.show(state,selectedGuest,candidates);renderBoardControls();}}
function renderBoard(){drawBoard();}
function resize(){renderer?.resize();}
function explainBlockedMove(guest,to){
 const reason=explainMove(stage,state,guest,to)||{reason:'unreachable'};
 if(reason.reason==='occupied')say('blockedGuest','error',{n:stage.queue.indexOf(reason.guest)+1});
 else if(reason.reason==='gate')say(reason.exhausted?'gateSpent':'blockedGate','error',{n:reason.gate+1});
 else if(reason.reason==='capacity')say('capacityFull','error',{used:state.positions.filter(node=>stage.pockets.includes(node)).length,total:stage.pocketCapacity});
 else say({oneWay:'blockedOneWay',stopOnly:'stopOnly',unreachable:'blockedRoute'}[reason.reason]||'blockedRoute','error');
}
function selectGuest(guest){if(covered()||state.positions[guest]<0)return;selectedGuest=guest;candidates=legalActions(stage,state).filter(a=>a.type==='move'&&a.guest===guest).map(a=>a.to);if(candidates.length)say('selectStop');else explainBlockedMove(guest,stage.counter);updateUI();audio('ui.click');}
function positionControls(){
 if(!renderer||!stage)return;for(const button of $('#board-controls').children){if(!stage.points[Number(button.dataset.node)]){button.style.visibility='hidden';continue;}button.style.visibility='';const p=renderer.project(Number(button.dataset.node),.18);button.style.left=p.x+'px';button.style.top=p.y+'px';}
 const markers=$('#gate-labels'),wanted=new Set();stage.gates.forEach((gate,index)=>{if(!gate.alternate)return;for(const [letter,edge] of [['A',[gate.a,gate.b]],['B',gate.alternate]]){const key=`${index}:${letter}`;wanted.add(key);let label=markers.querySelector(`[data-marker-key="${key}"]`);if(!label){label=document.createElement('span');label.className='gate-marker';label.dataset.markerKey=key;label.textContent=`${index+1}${letter}`;markers.append(label);}const p=renderer.projectEdge(edge);label.dataset.open=String(letter==='A'?state.gates[index]:!state.gates[index]);label.style.left=p.x+'px';label.style.top=p.y+'px';}});for(const label of [...markers.children])if(!wanted.has(label.dataset.markerKey))label.remove();
}
function renderBoardControls(){
 const dock=$('#board-controls');if(!state)return;const wanted=new Set();
 const obtain=(key,type)=>{let button=[...dock.children].find(node=>node.dataset.controlKey===key);if(!button){button=document.createElement('button');button.type='button';button.dataset.controlKey=key;button.className=type;button.addEventListener('click',()=>{if(button.dataset.guestIndex!==undefined)selectGuest(Number(button.dataset.guestIndex));else action({type:'move',guest:selectedGuest,to:Number(button.dataset.stopNode)});});dock.append(button);}wanted.add(key);return button;};
 if(!isWon(state)){
  state.positions.forEach((node,guest)=>{if(node<0)return;const button=obtain(`guest:${guest}`,'guest-hit');button.dataset.node=node;button.dataset.guestIndex=guest;button.setAttribute('aria-label',t('selectGuest',{n:stage.queue.indexOf(guest)+1}));button.setAttribute('aria-pressed',String(selectedGuest===guest));button.textContent=String(stage.queue.indexOf(guest)+1);});
  for(const to of candidates){const button=obtain(`stop:${to}`,'stop-hit');button.dataset.node=to;button.dataset.stopNode=to;button.textContent=to===stage.counter?'↳':'P';button.setAttribute('aria-label',to===stage.counter?t('counter'):t('waitingBay',{n:stage.pockets.indexOf(to)+1}));}
 }
 for(const button of [...dock.children])if(!wanted.has(button.dataset.controlKey))button.remove();positionControls();
}
function renderQueue(){
 const queue=$('#guest-queue'),wanted=new Set();
 stage.queue.forEach((guest,index)=>{
  let button=queue.querySelector(`[data-guest-index="${guest}"]`);wanted.add(String(guest));
  if(!button){button=document.createElement('button');button.type='button';button.className='queue-guest';button.dataset.guestIndex=guest;button.append(document.createElement('img'),document.createElement('span'));button.addEventListener('click',()=>selectGuest(Number(button.dataset.guestIndex)));queue.append(button);}
  button.dataset.served=String(state.positions[guest]<0);button.dataset.current=String(index===state.servedCount);button.setAttribute('aria-label',`${t('ticket',{n:index+1})} · ${t('selectGuest',{n:index+1})}`);button.setAttribute('aria-pressed',String(selectedGuest===guest));button.disabled=state.positions[guest]<0;const image=button.querySelector('img');const src=CHARACTER_ART[stage.guests[guest].animal];if(image.getAttribute('src')!==src)image.src=src;image.alt='';button.querySelector('span').textContent=state.positions[guest]<0?'✓':String(index+1);queue.append(button);
 });
 for(const button of [...queue.children])if(!wanted.has(button.dataset.guestIndex))button.remove();$('#par-label').textContent=`${t('target',{n:stage.targetMoves})}${stage.pockets.length?' · '+t('capacity',{used:state.positions.filter(node=>stage.pockets.includes(node)).length,total:stage.pocketCapacity}):''}`;
}
function updateUI(){
 if(!stage||!state)return;const guestIndex=stage.queue[state.servedCount],guest=stage.guests[guestIndex],filled=guest?state.filled[guestIndex]:0,atCounter=guest&&state.positions[guestIndex]===stage.counter;
 $('#stage-label').textContent=practiceRun?t('practice'):t('stage',{n:stage.id});$('#moves-label').textContent=t('moves',{n:state.moves});$('#next-label').textContent=t('servedCount',{n:state.servedCount,total:stage.queue.length});
 $('#basket-title').textContent=guest?t('ticket',{n:state.servedCount+1}):t('clear');$('#order-dock').dataset.ready=String(Boolean(atCounter));
 $('#orders-open').setAttribute('aria-label',t('ordersOpen'));$('#orders-open').disabled=paused||busy||isWon(state);
 $('#basket-slots').replaceChildren();if(guest)guest.order.forEach((slot,index)=>{const element=document.createElement('span'),choices=Array.isArray(slot)?slot:[slot];element.className='basket-slot';element.dataset.filled=String(index<filled);element.dataset.active=String(index===filled&&atCounter);element.setAttribute('aria-label',index<filled?t('snackFilled'):choices.map(snackLabel).join(' / '));for(const key of choices)element.append(snackImage(key));if(index<filled){const tick=document.createElement('b');tick.textContent='✓';element.append(tick);}$('#basket-slots').append(element);});
 const food=$('#snack-options');
 for(const [key,count] of Object.entries(state.stock)){
  let button=food.querySelector(`[data-snack-key="${key}"]`);
  if(!button){button=document.createElement('button');button.className='snack-button';button.type='button';button.dataset.snackKey=key;button.append(snackImage(key));const label=document.createElement('span');label.className='snack-name';const amount=document.createElement('small');amount.className='snack-count';button.append(label,amount);button.addEventListener('click',()=>action({type:'snack',guest:stage.queue[state.servedCount],snack:key}));food.append(button);}
  button.querySelector('.snack-name').textContent=snackLabel(key);button.querySelector('.snack-count').textContent=count;button.setAttribute('aria-label',`${snackLabel(key)} × ${count}`);button.disabled=count<1||!atCounter||filled>=guest.order.length||paused||busy||isWon(state);button.dataset.hint='false';
 }
 for(const button of food.children)if(!(button.dataset.snackKey in state.stock))button.remove();
 $('#serve-btn').disabled=paused||busy||!atCounter||filled!==guest.order.length;$('#undo-btn').disabled=paused||busy||!undoStack.length;$('#hint-btn').disabled=paused||busy||isWon(state);$('#retry-btn').disabled=paused;
 renderQueue();renderGates();drawBoard();
}
function renderGates(){
 const dock=$('#gate-dock');
 stage.gates.forEach((gate,index)=>{let button=dock.children[index];if(!button){button=document.createElement('button');button.className='gate-button';button.type='button';button.dataset.gateIndex=index;button.addEventListener('click',()=>action({type:'gate',gate:index}));dock.append(button);}
 const route=gate.alternate?t(state.gates[index]?'routeA':'routeB'):t(state.gates[index]?'gateOpen':'gateClosed');button.textContent=t('gateRoute',{n:index+1,route,uses:gate.charges-state.gateUses[index]});button.setAttribute('aria-label',`${button.textContent}${gate.alternate?' · '+t('gateHelp'):''}`);button.disabled=paused||busy||state.gateUses[index]>=gate.charges;});
 while(dock.children.length>stage.gates.length)dock.lastElementChild.remove();
}
function covered(){return paused||busy||!stage||isWon(state)||document.hidden||document.body.dataset.screen!=='battle'||!$('#render-error').hidden||!$('#help-panel').hidden||!$('#orders-panel').hidden||!$('#leave-panel').hidden||Boolean(document.querySelector('#battle-header [data-wp-settings][aria-expanded="true"]'));}
function pickNode(node){if(covered())return;const guest=state.positions.indexOf(node);if(guest>=0){selectGuest(guest);return;}if(selectedGuest!==null)action({type:'move',guest:selectedGuest,to:node});}
function action(request){
 if(covered())return;
 cancelEffects();if(request.type==='undo'){if(!undoStack.length)return;state=undoStack.pop();selectedGuest=null;candidates=[];say('select');audio('board.undo');updateUI();return;}
 const a=request.type==='serve'?{type:'serve',guest:stage.queue[state.servedCount]}:request;
 const legal=legalActions(stage,state);if(!legal.some(item=>JSON.stringify(item)===JSON.stringify(a))){if(a.type==='move')explainBlockedMove(a.guest,a.to);else say(a.type==='snack'?'snackWrong':a.type==='serve'?'wrongTurn':'blockedRoute','error');audio('feedback.error');drawBoard();return;}
 const before=state,route=a.type==='move'?routeForMove(stage,state,a.guest,a.to):[],foodSource=a.type==='snack'?$('#snack-options').querySelector(`[data-snack-key="${a.snack}"]`):null,slot=a.type==='snack'?state.filled[a.guest]:null;
 undoStack.push(structuredClone(state));if(undoStack.length>100)undoStack.shift();state=applyAction(stage,state,a);selectedGuest=null;candidates=[];
 updateUI();const next=stage.queue[state.servedCount];say(a.type==='serve'?'served':next!==undefined&&state.positions[next]===stage.counter?(state.filled[next]<stage.guests[next].order.length?'snackNeeded':'hintServe'):'select','success');
 if(a.type==='move'){renderer.move(a.guest,route);audio('board.move');}
 if(a.type==='snack'){
  transferFood(a.snack,foodSource,$('#basket-slots').children[slot]);const warning=pantryWarning(stage,state);
  if(warning){say(warning.snack?'pantryReserved':'pantryBlocked','error',warning.snack?{n:stage.queue.indexOf(warning.guest)+1,snack:snackLabel(warning.snack)}:{});audio('feedback.error');}else audio('board.move');
 }
 if(a.type==='gate'){renderer.switchGate(a.gate,before.gates[a.gate]);emphasize($('#gate-dock'));audio('board.rotate');}
 if(a.type==='serve'){
  // A noninteractive old-state proxy completes departure; simulation is already committed.
  renderer.show(before);const currentRun=run;renderer.depart(a.guest,()=>{if(run===currentRun&&document.body.dataset.screen==='battle')drawBoard();});audio('feedback.success');emphasize($('#guest-queue'));
 }
 if(isWon(state))finish();
}
function finish(){
 const stars=state.moves<=stage.targetMoves?3:state.moves<=stage.par?2:1,finale=stage.id===CAMPAIGN_STAGES.length;
 let unlocked=[];
 if(!practiceRun){unlocked=recordClear(save,stage,state.moves,stars).newMilestones;save.unlocked=Math.max(save.unlocked,Math.min(CAMPAIGN_STAGES.length,stage.id+1));persist();if(unlocked.length)refreshTheme();}
 $('#result-title').textContent=finale?t('finaleTitle'):stage.id%5===0?t('arcComplete',{n:stage.arc}):t('clear');$('#result-copy').textContent=t('starTargets',{moves:state.moves,three:stage.targetMoves,two:stage.par});$('#result-stars').textContent='★'.repeat(stars)+'☆'.repeat(3-stars);$('#result-stars').setAttribute('aria-label',`${stars} / 3`);$('#result-best').textContent=practiceRun?t('practice'):t('mastery',{n:totalStars()});
 $('#result-record').textContent=practiceRun?t('practiceNoProgress'):t('routeBest',{n:currentBest(save,stage).moves});
 $('#result-reward').textContent=unlocked.length?t('milestoneReward',{name:OPTIMIZATION_COPY[locale].milestoneNames[MILESTONE_STAGES.indexOf(unlocked[0])]}):finale&&!practiceRun?t('finaleCopy'):'';$('#result-reward').hidden=!$('#result-reward').textContent;
 const rewardArt=$('#result-reward-art');rewardArt.hidden=!unlocked.length;
 if(unlocked.length){rewardArt.src=decorPreviews[MILESTONE_STAGES.indexOf(unlocked[0])];rewardArt.alt=OPTIMIZATION_COPY[locale].milestoneNames[MILESTONE_STAGES.indexOf(unlocked[0])];emphasize(rewardArt);}
 else{rewardArt.removeAttribute('src');rewardArt.alt='';}
 $('#result-panel').dataset.finale=String(finale);$('#result-next').textContent=finale?t('nextStage'):t('stage',{n:stage.id+1});$('#result-next').disabled=finale;
 $('#result-panel').hidden=false;audio(unlocked.length?'reward.unlock':'result.win');
}
function hint(){
 if(covered())return;cancelEffects();const request=++hintRequest,currentRun=run,key=stateKey(state);say('thinking');
 try{
  hintWorker=new Worker(new URL('./hint-worker.mjs?v=20261027-diner-opt-v25',import.meta.url),{type:'module'});
  hintTimer=setTimeout(()=>{if(request!==hintRequest)return;hintWorker?.terminate();hintWorker=null;say('hintError','error');},4000);
  hintWorker.onmessage=({data})=>{
   if(request!==hintRequest||currentRun!==run||key!==stateKey(state))return;audio('feedback.hint');clearTimeout(hintTimer);hintWorker?.terminate();hintWorker=null;
   if(data.error||data.overflow){say('hintError','error');return;}const a=data.action;if(!a){say('noRoute','error');return;}
   if(a.type==='move'){selectedGuest=a.guest;candidates=[a.to];updateUI();say('hintRoute','',{n:stage.queue.indexOf(a.guest)+1,stop:a.to===stage.counter?t('counter'):t('waitingBay',{n:stage.pockets.indexOf(a.to)+1})});}
   else if(a.type==='snack'){say('hintFood','',{snack:snackLabel(a.snack)});const button=$('#snack-options').querySelector(`[data-snack-key="${a.snack}"]`);button.dataset.hint='true';emphasize(button);}
   else if(a.type==='serve'){say('hintServe');emphasize($('#serve-btn'));}
   else {say('hintSwitch','',{n:a.gate+1});emphasize($('#gate-dock').children[a.gate]);}
  };
  hintWorker.onerror=()=>{clearTimeout(hintTimer);hintWorker?.terminate();hintWorker=null;if(request===hintRequest)say('hintError','error');};
  hintWorker.postMessage({stage:CAMPAIGN_STAGES[stage.id-1],state,request});
 }catch{say('hintError','error');}
}
function openHelp(){if(!stage||!$('#result-panel').hidden||!$('#render-error').hidden||!$('#orders-panel').hidden)return;cancelEffects();paused=true;$('#help-title').textContent=t('howTitle');$('#help-copy').textContent=`${t('helpSteps')} ${t('helpOptimization')}`;$('#help-panel').hidden=false;}
function bind(){
 // Shared Main Settings owns locale navigation; this hidden select is only its source.
 $('#shop-open').addEventListener('click',openStore);$('#shop-cancel').addEventListener('click',closeStore);$('#shop-confirm').addEventListener('click',buyBoardFinish);
 $('#shop-classic').addEventListener('click',()=>{if(practiceRun)return;save.boardStyle='classic';persist();renderStore();if(stage)refreshTheme();});
 $('#shop-dialog').addEventListener('click',event=>{if(event.target===$('#shop-dialog'))closeStore();});
 $('#start-game').addEventListener('click',()=>{if(!assetsReady){if(!entryLoader||loadTimedOut)location.reload();else loadAssets();return;}selectedStageIndex=save.unlocked-1;enter('stage');});
 document.querySelectorAll('[data-wp-return="stage"]').forEach(button=>button.addEventListener('click',()=>enter('main')));
 document.querySelectorAll('[data-wp-return="battle"]').forEach(button=>button.addEventListener('click',requestStageReturn));
 $('#serve-btn').addEventListener('click',()=>action({type:'serve'}));$('#undo-btn').addEventListener('click',()=>action({type:'undo'}));$('#retry-btn').addEventListener('click',()=>startStage(stage.id));$('#map-btn').addEventListener('click',requestStageReturn);$('#hint-btn').addEventListener('click',hint);$('#help-open').addEventListener('click',openHelp);
 $('#render-map').addEventListener('click',()=>{paused=false;$('#render-error').hidden=true;enter('stage');});
 $('#render-retry').addEventListener('click',()=>{if(renderer?.restore())return;renderer?.dispose();renderer=null;const old=$('#board-canvas');old.replaceWith(old.cloneNode(false));startStage(stage.id);});
 $('#help-close').addEventListener('click',()=>{paused=false;$('#help-panel').hidden=true;updateUI();});
 $('#result-map').addEventListener('click',()=>{$('#result-panel').hidden=true;enter('stage');});$('#result-replay').addEventListener('click',()=>startStage(stage.id));$('#result-next').addEventListener('click',()=>startStage(Math.min(stage.id+1,CAMPAIGN_STAGES.length)));
 document.addEventListener('keydown',event=>{
  if(event.key==='Escape'){
   if(!$('#shop-dialog').hidden){event.preventDefault();closeStore();return;}if(!$('#orders-panel').hidden){event.preventDefault();$('#orders-close').click();return;}if(!$('#leave-panel').hidden){event.preventDefault();closeLeave();return;}if(!$('#help-panel').hidden){event.preventDefault();$('#help-close').click();return;}
   if(document.body.dataset.screen==='battle'&&!event.defaultPrevented){event.preventDefault();openHelp();}return;
  }
  if(event.defaultPrevented||covered()||/INPUT|SELECT|BUTTON/.test(event.target.tagName))return;
  if(/^[1-3]$/.test(event.key)){const guest=stage.queue[Number(event.key)-1];if(guest!==undefined)selectGuest(guest);return;}
  if(event.key==='Enter'){event.preventDefault();action({type:'serve'});return;}
  const direction={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];
  if(direction&&selectedGuest!==null){event.preventDefault();const from=stage.points[state.positions[selectedGuest]],options=candidates.filter(node=>{const to=stage.points[node];return (to[0]-from[0])*direction[0]+(to[1]-from[1])*direction[1]>0;});if(options.length)action({type:'move',guest:selectedGuest,to:options[0]});else explainBlockedMove(selectedGuest,stage.counter);}
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelEffects();});
 window.addEventListener('weightplay:interaction-state',()=>{if(document.querySelector('#battle-header [data-wp-settings][aria-expanded="true"]'))cancelEffects();});
 window.addEventListener('focus',renderStore);
 window.addEventListener('pagehide',event=>{cancelEffects();if(!event.persisted){renderer?.dispose();renderer=null;stageRail?.destroy();audioScope?.dispose();for(const texture of Object.values(characterTextures))texture.dispose();}});
}
async function sharedEntryLoader(){
 if(window.WeightPlayGameEntryLoader?.isActive)return window.WeightPlayGameEntryLoader;
 const script=document.querySelector('script[data-wp-game-entry-loader-bootstrap]');if(!script)throw new Error('Shared entry loader missing');
 await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('Shared entry loader unavailable')),8000);script.addEventListener('load',()=>{clearTimeout(timeout);resolve();},{once:true});script.addEventListener('error',()=>{clearTimeout(timeout);reject(new Error('Shared entry loader failed'));},{once:true});});
 if(!window.WeightPlayGameEntryLoader?.isActive)throw new Error('Shared entry loader unavailable');return window.WeightPlayGameEntryLoader;
}
async function loadAssets(){
 const generation=++assetGeneration,current=()=>generation===assetGeneration,start=$('#start-game');let timeout=0;loadTimedOut=false;start.disabled=true;$('#main-progress').textContent=t('loading');entryLoader?.begin(9);
 const work=async()=>{
  if(!await loadCharacterArt(current,loaded=>entryLoader?.assetProgress(loaded,9))||!current())return false;
  decorPreviewTask??=createDecorPreviews().then(async previews=>{
   if(previews.length!==MILESTONE_STAGES.length)throw new Error('Incomplete diner decor artwork');
   if(!previews.boardFinish)throw new Error('Missing board finish artwork');
   await Promise.all([...previews,previews.boardFinish].map(src=>{const image=new Image();image.src=src;return image.decode();}));return previews;
  }).catch(error=>{decorPreviewTask=null;throw error;});
  decorPreviews=await decorPreviewTask;if(!current())return false;$('#shop-board-preview').src=decorPreviews.boardFinish;entryLoader?.assetProgress(8,9);
  const poster=$('[data-wp-frame-poster]');if(poster){await poster.decode();if(!poster.naturalWidth)throw new Error('Main poster unavailable');}
  if(current())entryLoader?.assetProgress(9,9);return current();
 };
 try{const ready=await Promise.race([work(),new Promise((_,reject)=>{timeout=setTimeout(()=>{loadTimedOut=true;reject(new Error('Asset load timeout'));},12000);})]);if(!ready||!current())return;assetsReady=true;start.textContent=t('start');start.disabled=false;updateMain();entryLoader?.ready();}
 catch(error){if(!current())return;assetGeneration++;console.error('traffic-jam-diner assets failed',error);$('#main-progress').textContent=t('loadError');start.textContent=t('retry');start.disabled=false;entryLoader?.fail(t('loadError'),loadTimedOut?()=>location.reload():loadAssets);}
 finally{clearTimeout(timeout);}
}
// Dialog focus and covered-content ownership are UI state only.
function bindModalFocus(){
 const panels=[$('#result-panel'),$('#help-panel'),$('#orders-panel'),$('#shop-dialog'),$('#leave-panel'),$('#render-error')],covered=new Map();
 let current=null;
 const actions=panel=>[...panel.querySelectorAll('button:not(:disabled),[href],select,input,[tabindex="0"]')].filter(node=>node.getClientRects().length&&!node.closest('[hidden],[inert]'));
 const initial=panel=>panel.id==='result-panel'&&!$('#result-next').disabled?$('#result-next'):actions(panel)[0];
 const focus=node=>node?.focus({preventScroll:true});
 function synchronize(){
  for(const panel of panels){panel.inert=panel.hidden;panel.setAttribute('aria-hidden',String(panel.hidden));}
  const next=panels.find(panel=>!panel.hidden)||null;
  if(next===current)return;
  const previous=current;current=next;
  for(const [node,wasInert] of covered)if(node.inert)node.inert=wasInert;
  covered.clear();
  if(next){
   next.scrollTop=0;
   for(let branch=next;branch&&branch!==root;branch=branch.parentElement){
    for(const sibling of branch.parentElement?.children||[])if(sibling!==branch&&!covered.has(sibling)&&sibling.getClientRects().length&&!sibling.inert){covered.set(sibling,sibling.inert);sibling.inert=true;}
   }
   focus(initial(next));
  }else if(previous&&(previous.contains(document.activeElement)||document.activeElement===document.body)){
   const opener=previous.id==='orders-panel'?$('#orders-open'):previous.id==='help-panel'?$('#help-open'):previous.id==='shop-dialog'?$('#shop-open'):null;
   focus(opener?.getClientRects().length&&!opener.disabled?opener:document.body.dataset.screen==='main'?$('#start-game'):$(`#${document.body.dataset.screen}-header [data-wp-return]`));
  }
 }
 const observer=new MutationObserver(synchronize);
 for(const panel of panels)observer.observe(panel,{attributes:true,attributeFilter:['hidden']});
 document.addEventListener('keydown',event=>{
  if(event.key!=='Tab'||!current)return;
  const buttons=actions(current),index=buttons.indexOf(document.activeElement);
  if(!buttons.length){event.preventDefault();return;}
  if(index<0||event.shiftKey&&index===0||!event.shiftKey&&index===buttons.length-1){event.preventDefault();focus(event.shiftKey?buttons.at(-1):buttons[0]);}
 });
 document.addEventListener('focusin',event=>{if(current&&!current.contains(event.target))focus(initial(current));});
 synchronize();
}


async function boot(){
 try{window.WeightPlayAudio?.preload(['game.start','ui.click','board.move','board.rotate','board.undo','feedback.error','feedback.hint','feedback.success','result.win','reward.unlock','shop.purchase']);initFrame();initLeaveDialog();initOrderDialog();bind();bindModalFocus();setLocale(document.documentElement.lang||localStorage.getItem('weightPlayLocale')||'en');entryLoader=await sharedEntryLoader();await loadAssets();
 LocalPractice.register({gameId:'traffic-jam-diner',stageIds:CAMPAIGN_STAGES.map(s=>s.id),enable:()=>renderStages(),startStage:id=>startStage(Number(id))});
 }catch(error){console.error('traffic-jam-diner boot failed',error);$('#main-progress').textContent=t('loadError');$('#start-game').disabled=false;$('#start-game').textContent=t('retry');}
}
void boot();
