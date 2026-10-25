import {createCairnScene} from './scene.mjs?v=20261023-cairn-v12';
import {purchaseFinish} from './finishes.mjs?v=20261023-cairn-v12';

const $=id=>document.getElementById(id);
const {STAGES,stoneCatalog,validate,contract,load,tray,normalize}=window.CairnModel;
const dictionaries=window.ANIMAL_CAIRN_COURIER_LOCALES;
const frame=window.__ANIMAL_CAIRN_COURIER_FRAME__;
const STORE='weightplay-animal-cairn-courier-v7-campaign-v1';
let saved;
try{saved=normalize(JSON.parse(localStorage.getItem(STORE)||'{}'));}catch{saved=normalize({});}
const solved=new Set(saved.solved);
const state={locale:window.__WEIGHTPLAY_ROUTE_LOCALE__||'en',screen:'main',round:0,stack:[],picks:0,mistakes:0,edits:0,settled:false,status:''};
if(!window.__WEIGHTPLAY_ROUTE_LOCALE__)try{const locale=localStorage.getItem('weightplayLocale');if(dictionaries[locale])state.locale=locale;}catch{}
const text=(key,vars={})=>{
  let str=window.CAIRN_REBUILD_COPY[state.locale]?.[key]||dictionaries[state.locale]?.[key]||window.ANIMAL_CAIRN_COURIER_I9_COPY[state.locale]?.[key]||window.CAIRN_REBUILD_COPY.en[key]||dictionaries.en[key]||window.ANIMAL_CAIRN_COURIER_I9_COPY.en[key]||key;
  for(const [name,value] of Object.entries(vars))str=str.replaceAll('{'+name+'}',String(value));return str;
};
const stoneName=id=>text(stoneCatalog[id].key);
const plan=()=>STAGES[state.round];
const audio=window.WeightPlayAudio?.createScope();
const cue=id=>audio?.play(id);
window.WeightPlayAudio?.preload(['game.start','board.move','board.undo','feedback.error','result.win','reward.unlock']);
const persist=()=>{
  const next={...saved,solved:[...solved].sort((a,b)=>a-b),updatedAt:new Date().toISOString()};
  localStorage.setItem(STORE,JSON.stringify(next));saved=next;
};
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const animations=new Set();
function flash(node,bad=false){
  if(!node||!node.animate)return;
  const a=node.animate([{opacity:.65,filter:bad?'brightness(1.5)':'brightness(1.2)'},{opacity:1,filter:'brightness(1)'}],{duration:reduce.matches?80:200});
  animations.add(a);a.onfinish=a.oncancel=()=>animations.delete(a);
}
function cancelMotion(){for(const a of animations)a.cancel();animations.clear();}
let scene=null;
try{scene=createCairnScene($('cairnScene'),()=>{$('sceneError').hidden=false;});}
catch(error){$('sceneError').hidden=false;console.error('CAIRN_3D_INIT',error);}
$('cairnScene').addEventListener('cairn:restored',()=>{$('sceneError').hidden=true;});
$('sceneReload').onclick=()=>location.reload();

const stageText=(p,field)=>field!=='title'?text(p.arcKey):
  window.CAIRN_REBUILD_COPY[state.locale]?.[p.titleKey]||dictionaries[state.locale]?.[p.titleKey]||text(p.arcKey)+' '+((p.id-1)%5+1);
const ruleText=p=>contract(p,[]).map(ruleLabel).join(' · ');
const statusFor=(p,i)=>solved.has(p.id)?text('complete'):i===0||solved.has(STAGES[i-1].id)?text('open'):text('locked');
let selector=null,selectedStage=0;
const finishButton=document.createElement('button');finishButton.type='button';finishButton.id='finishButton';
frame.commonDownButton.add(finishButton);
const stageProgress=document.createElement('span');frame.stageTopUI.add(stageProgress);
function renderStages(){
  stageProgress.textContent=text('stagesV7',{current:solved.size,total:STAGES.length});
  finishButton.textContent=text('finishTitle');
  if(!selector)selector=window.WeightPlayPlayUI.mountStage({page:$('stageWorkspace'),rail:$('stageList'),
    config:window.AnimalCairnCourierStageConfig({stages:STAGES,solved,stageText,ruleText,statusFor,text}),selected:selectedStage,
    isActive:()=>state.screen==='stage'&&$('finishPanel').hidden,onSelect:i=>selectedStage=i,onStart:startRound});
  selector.refresh(selectedStage);
}
function updateMain(){
  $('mainProgress').textContent=text('stagesV7',{current:solved.size,total:STAGES.length})+' · '+text('seals')+' '+Object.values(saved.seals).reduce((a,b)=>a+Number(b||0),0)+'/90';
}
function setModal(id,open){
  $(id).hidden=!open;
  const isBattle=id==='leaveConfirm';
  const owner=$(isBattle?'battleScreen':'stageScreen');
  for(const child of owner.children)if(child!==$(id))child.inert=open;
  if(!open && isBattle && state.screen==='result')$('resultScreen').inert=false;
  if(open)flash($(id).querySelector('.dialog-card'));
}
function show(screen){
  cancelMotion();audio?.stop();if(screen!=='stage')selector?.cancel();
  setModal('finishPanel',false);setModal('leaveConfirm',false);
  state.screen=screen;document.body.dataset.screen=screen;
  const active=screen==='result'?'battle':screen;
  for(const [id,name] of [['mainScreen','main'],['gameGuide','main'],['stageScreen','stage'],['battleScreen','battle']])$(id).hidden=name!==active;
  $('resultScreen').hidden=screen!=='result';
  $('battleScreen').querySelector('.battle-content').inert=screen==='result';
  frame.activate(active,{covered:screen==='result'});
  scene?.setActive(active==='battle');
  if(screen==='main')updateMain();
}
function ruleLabel(rule){
  const vars={a:rule.ids[0]?stoneName(rule.ids[0]):'',b:rule.ids[1]?stoneName(rule.ids[1]):'',n:rule.value};
  return text(rule.kind==='load'?'loadRule':rule.kind,vars);
}
let buttons=new Map(),ruleNodes=[];
function buildBattle(){
  const p=plan();$('roundName').textContent=stageText(p,'title');$('roundLabel').textContent=text('roundV7',{n:p.id,total:STAGES.length});
  $('stoneTray').replaceChildren();buttons.clear();
  for(const id of tray(p)){
    const stone=stoneCatalog[id],b=document.createElement('button');b.type='button';b.className='stone-btn';b.dataset.stone=id;
    if(scene){const image=document.createElement('img');image.src=scene.thumbnails[id];image.alt='';image.width=96;image.height=64;b.append(image);}
    const label=document.createElement('span');label.textContent=stoneName(id);b.append(label);
    const small=document.createElement('small');small.textContent=text('group'+stone.group[0].toUpperCase()+stone.group.slice(1))+' · '+stone.weight;b.append(small);
    b.setAttribute('aria-label',stoneName(id));b.onclick=()=>pickStone(id);$('stoneTray').append(b);buttons.set(id,b);
  }
  $('ruleList').replaceChildren();ruleNodes=contract(p,[]).map(rule=>{
    const node=document.createElement('span');node.className='rule-chip';node.textContent=ruleLabel(rule);$('ruleList').append(node);return node;
  });
  $('trailNote').textContent=p.loadLimit!==undefined?text('loadExplain'):text('guideTwo');
  updateBattle();flash($('playSurface'));
}
function updateBattle(success=false){
  const p=plan(),rules=contract(p,state.stack);
  rules.forEach((rule,i)=>{const n=ruleNodes[i];if(n){n.dataset.status=rule.status;n.textContent=(rule.status==='good'?'✓ ':rule.status==='bad'?'! ':'· ')+ruleLabel(rule);}});
  for(const [id,b] of buttons){b.disabled=state.stack.includes(id)||state.settled;b.setAttribute('aria-pressed',String(state.stack.includes(id)));}
  $('selectionCount').textContent=state.stack.length+'/'+p.stones.length+(p.loadLimit!==undefined?' · '+load(state.stack)+'/'+p.loadLimit:'');
  $('stack').replaceChildren(...state.stack.map((id,i)=>{const li=document.createElement('li');li.textContent=(i+1)+' '+stoneName(id);return li;}));
  $('stack').classList.toggle('empty',!state.stack.length);
  if(!state.stack.length){const li=document.createElement('li');li.textContent=text('empty');$('stack').append(li);}
  $('checkBtn').disabled=state.stack.length!==p.stones.length||state.settled;
  $('undoBtn').disabled=$('clearBtn').disabled=state.stack.length===0||state.settled;
  $('battleStatus').textContent=state.status||text(state.stack.length===p.stones.length?'ready':'chooseStone');
  $('battleStatus').dataset.bad=String(!!state.status);
  scene?.update(state.stack,{success,skin:saved.finish});
}
function startRound(index){
  if(!Number.isInteger(index)||!STAGES[index]||(index>0&&!solved.has(STAGES[index-1].id)))return;
  state.round=index;selectedStage=index;state.stack=[];state.picks=state.mistakes=state.edits=0;state.status='';state.settled=false;
  show('battle');buildBattle();cue('game.start');buttons.values().next().value?.focus({preventScroll:true});
}
function acceptsInput(){return state.screen==='battle'&&!state.settled&&$('leaveConfirm').hidden;}
function pickStone(id){
  if(!acceptsInput()||!plan().stones.includes(id)||state.stack.includes(id))return;
  state.stack.push(id);state.picks++;state.status='';updateBattle();cue('board.move');flash(buttons.get(id));
  const next=[...buttons.values()].find(b=>!b.disabled);if(next)next.focus({preventScroll:true});else $('checkBtn').focus({preventScroll:true});
}
function undo(clear=false){
  if(!acceptsInput()||!state.stack.length)return;
  const id=state.stack.at(-1);if(clear)state.stack=[];else state.stack.pop();state.edits++;state.status='';updateBattle();cue('board.undo');buttons.get(id)?.focus({preventScroll:true});
}
function check(){
  if(!acceptsInput()||state.stack.length!==plan().stones.length)return;
  if(!validate(plan(),state.stack)){
    state.mistakes++;const broken=contract(plan(),state.stack).find(r=>r.status==='bad');
    state.status=text('fixRule',{rule:ruleLabel(broken)});updateBattle();cue('feedback.error');flash($('ruleList'),true);return;
  }
  state.settled=true;
  const seals=state.mistakes?1:state.edits||state.picks!==plan().stones.length?2:3;
  solved.add(plan().id);saved.seals[plan().id]=Math.max(saved.seals[plan().id]||0,seals);
  saved.best[plan().id]=Math.min(saved.best[plan().id]||Infinity,state.picks);
  if(solved.size>=10&&!saved.finishes.includes('alpine'))saved.finishes.push('alpine');
  let persisted=true;try{persist();}catch{persisted=false;}
  // Outcome ownership is synchronous; effects never grant progress or repeat rewards.
  show('result');updateBattle(true);cue('result.win');
  $('resultTitle').textContent=text(seals===3?'perfect':seals===2?'clean':'settled');
  $('resultSeals').textContent='★'.repeat(seals)+'☆'.repeat(3-seals);
  $('resultSeals').setAttribute('aria-label',text('seals')+' '+seals+'/3');
  $('resultText').textContent=text('picks')+': '+state.picks+' · '+text('best')+': '+saved.best[plan().id]+'\n'+text('stagesV7',{current:solved.size,total:30})+(persisted?'':'\n'+text('saveError'));
  $('resultStagesBtn').textContent=text('stages');$('resultNextBtn').textContent=text('next');$('resultReplayBtn').textContent=text('replay');
  $('resultNextBtn').disabled=state.round===STAGES.length-1;
  flash($('resultScreen').querySelector('.dialog-card'));$('resultNextBtn').disabled?$('resultStagesBtn').focus({preventScroll:true}):$('resultNextBtn').focus({preventScroll:true});
}
function guardReturn(){
  if(state.screen==='result'){show('stage');renderStages();return true;}
  if(state.screen!=='battle')return false;
  $('leaveTitle').textContent=text('leaveTitle');$('leaveBody').textContent=text('leaveBody');
  $('leaveContinueBtn').textContent=text('keepBuilding');$('leaveStagesBtn').textContent=text('returnToStages');
  setModal('leaveConfirm',true);scene?.setActive(false);$('leaveContinueBtn').focus({preventScroll:true});return true;
}
window.__ANIMAL_CAIRN_COURIER_BATTLE_BACK_GUARD__=guardReturn;
const closeLeave=()=>{setModal('leaveConfirm',false);scene?.setActive(true);$('battleBackBtn').focus({preventScroll:true});};
function showFinishes(){renderFinishes();setModal('finishPanel',true);$('finishClose').focus({preventScroll:true});}
function renderFinishes(){
  $('walletBalance').textContent=text('balance')+': '+window.WeightPlayWallet.read().diamonds;
  $('finishChoices').replaceChildren();
  for(const name of ['moss','alpine','aurora']){
    const owned=name==='moss'||saved.finishes.includes(name)||(name==='alpine'&&solved.size>=10);
    const row=document.createElement('div');row.className='finish-row';row.dataset.finish=name;
    const image=document.createElement('img');image.src='/assets/interface7-redrawn/animal-cairn-courier.webp';image.alt='';row.append(image);
    const label=document.createElement('strong');label.textContent=text(name);row.append(label);
    const b=document.createElement('button');b.type='button';b.textContent=saved.finish===name?'✓ '+text('owned'):owned?text('equip'):name==='alpine'?text('earned'):text('purchase');
    if(!owned&&name==='aurora'){const diamond=document.createElement('img');diamond.src='/assets/weightplay-diamond.svg';diamond.alt=text('balance');diamond.width=18;diamond.height=18;b.prepend(diamond);}
    b.disabled=saved.finish===name||(!owned&&name==='alpine');b.onclick=()=>chooseFinish(name);row.append(b);$('finishChoices').append(row);
  }
}
let purchasing=false;
async function chooseFinish(name){
  if(purchasing||state.screen!=='stage')return;
  const owned=name==='moss'||saved.finishes.includes(name)||(name==='alpine'&&solved.size>=10);
  if(!owned&&name!=='aurora')return;
  purchasing=true;
  try{
    const result=(await purchaseFinish({saved,solved:[...solved],name,wallet:window.WeightPlayWallet,
      write:value=>localStorage.setItem(STORE,JSON.stringify({...value,solved:[...solved],updatedAt:new Date().toISOString()}))}));
    if(result.status==='insufficient'){$('finishStatus').textContent=text('needDiamonds');cue('feedback.error');return;}
    saved=result.saved;$('finishStatus').textContent=text('owned')+' · '+text(name);cue(owned?'ui.click':'reward.unlock');
    scene?.update(state.stack,{skin:name});renderFinishes();flash($('finishChoices'));
  }catch{
    $('finishStatus').textContent=text('saveError');cue('feedback.error');
  }finally{purchasing=false;}
}
function applyLocale(){
  document.documentElement.lang=state.locale;document.documentElement.dir=state.locale==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-copy]').forEach(n=>{if(!n.matches('[data-wp-return]'))n.textContent=text(n.dataset.copy);});
  document.querySelectorAll('[data-aria-copy]').forEach(n=>n.setAttribute('aria-label',text(n.dataset.ariaCopy)));
  document.querySelectorAll('[data-alt-copy]').forEach(n=>n.alt=text(n.dataset.altCopy));
  $('localeSelect').value=state.locale;updateMain();finishButton.textContent=text('finishTitle');
  if(state.screen==='stage')renderStages();
  window.dispatchEvent(new CustomEvent('wonder:locale-change',{detail:{locale:state.locale}}));
}
$('startBtn').onclick=()=>{selectedStage=Math.min(STAGES.length-1,STAGES.findIndex(p=>!solved.has(p.id)));if(selectedStage<0)selectedStage=29;show('stage');renderStages();};
$('stageBackBtn').onclick=()=>{show('main');$('startBtn').focus({preventScroll:true});};
$('battleBackBtn').onclick=guardReturn;
$('checkBtn').onclick=check;$('undoBtn').onclick=()=>undo();$('clearBtn').onclick=()=>undo(true);
$('leaveContinueBtn').onclick=closeLeave;$('leaveStagesBtn').onclick=()=>{state.stack=[];show('stage');renderStages();};
$('resultStagesBtn').onclick=()=>{selectedStage=Math.min(29,state.round+1);show('stage');renderStages();};
$('resultNextBtn').onclick=()=>{if(state.screen==='result'&&state.round<29)startRound(state.round+1);};
$('resultReplayBtn').onclick=()=>{if(state.screen==='result')startRound(state.round);};
finishButton.onclick=showFinishes;
$('finishClose').onclick=()=>{setModal('finishPanel',false);finishButton.focus({preventScroll:true});};
$('localeSelect').onchange=e=>{state.locale=dictionaries[e.target.value]?e.target.value:'en';try{localStorage.setItem('weightplayLocale',state.locale);}catch{}applyLocale();};
document.addEventListener('keydown',e=>{
  const modal=['leaveConfirm','finishPanel','resultScreen'].map($).find(n=>!n.hidden);
  if(e.key==='Escape'){if(!$('leaveConfirm').hidden)closeLeave();else if(!$('finishPanel').hidden)$('finishClose').click();return;}
  if(e.key==='Tab'&&modal){const nodes=[...modal.querySelectorAll('button:not(:disabled)')];const first=nodes[0],last=nodes.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelMotion();});
window.addEventListener('pagehide',()=>{cancelMotion();audio?.stop();scene?.setActive(false);});
window.addEventListener('pageshow',()=>{scene?.setActive(['battle','result'].includes(state.screen));});
window.addEventListener('unload',()=>{scene?.dispose();audio?.dispose();selector?.destroy?.();},{once:true});
window.__ANIMAL_CAIRN_COURIER_TEST__={stages:STAGES,validate,startRound,pickStone,checkStack:check,
  getState:()=>({...state,stack:[...state.stack],solved:[...solved]}),sceneStats:()=>scene?.stats()};
applyLocale();show('main');$('loadingPanel').hidden=true;
