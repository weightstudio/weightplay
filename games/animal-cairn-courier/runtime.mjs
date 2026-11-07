import {createCairnScene} from './scene.mjs?v=20261027-cairn-pass1&wp-media=0a561b3bf0c2e323';
import {purchaseFinish,writeConfirmed} from './finishes.mjs?v=20261101-cairn-v15&wp-media=0a561b3bf0c2e323';
import {MOUNTAIN_PASS,passContract,passValidate,passNext} from './mountain-pass.mjs?v=20261027-cairn-pass2&wp-media=0a561b3bf0c2e323';
import {PASS_COPY} from './mountain-pass-copy.mjs?v=20261027-cairn-pass2&wp-media=0a561b3bf0c2e323';
import {LocalPractice} from '../../src/game-local-practice.mjs?wp-media=0a561b3bf0c2e323';

const $=id=>document.getElementById(id);
const {STAGES:originalStages,stoneCatalog,validate:originalValidate,contract:originalContract,load,tray,normalize}=window.CairnModel;
const STAGES=[...originalStages];
const practiceRequested=location.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&new URLSearchParams(location.search).get('practice')==='1';
let practice=false,starting=false;
const dictionaries=window.ANIMAL_CAIRN_COURIER_LOCALES;
const frame=window.__ANIMAL_CAIRN_COURIER_FRAME__;
const STORE='weightplay-animal-cairn-courier-v7-campaign-v1';
let saved;
try{saved=practiceRequested?normalize({}):normalize(JSON.parse(localStorage.getItem(STORE)||'{}'));}catch{saved=normalize({});}
const solved=new Set(saved.solved);
const state={locale:window.__WEIGHTPLAY_ROUTE_LOCALE__||'en',screen:'main',round:0,stack:[],picks:0,mistakes:0,edits:0,settled:false,status:''};
state.route='outbound';state.pinUses=2;
let lessonReplay=false;
const lessonText=()=>window.WeightPlayStageLessonCopy[state.locale]||window.WeightPlayStageLessonCopy.en;
const lessonHost=document.createElement('div');lessonHost.id='cairnLesson';lessonHost.className='battle-status';$('battleStatus').after(lessonHost);
const replayLesson=document.createElement('button');replayLesson.id='replayActionTutorial';replayLesson.type='button';replayLesson.hidden=practiceRequested;replayLesson.onclick=()=>startRound(0,{teachingReplay:true});$('startBtn').after(replayLesson);
const actionGuide=window.WeightPlayTutorial.createActionGuide({gameId:'animal-cairn-courier',revision:1,host:lessonHost,steps:[
  {id:'place',title:()=>lessonText()[0],instruction:()=>lessonText()[1],target:()=>buttons.get(plan().stones[0])},
  {id:'undo',title:()=>lessonText()[2],instruction:()=>lessonText()[3],target:()=>$('undoBtn')},
]});
// World credit belongs to saved campaign rounds, never local practice.
const measurement={screen:'main',roundKey:null,started:false,ended:false,outcome:'abandon',stageId:null,stageIdAuthoritative:true,rewardEligible:false,saveSucceeded:false};
const readMeasurement=()=>({...measurement,paused:document.hidden,node:document.body,activityMode:'input',idleSeconds:300});
function notifyMeasurement(){try{window.WonderAnalytics?.game?.observeState(readMeasurement);}catch{/* Optional shared telemetry. */}}
window.addEventListener('weightplay:analytics-ready',notifyMeasurement);notifyMeasurement();
const contract=(p,stack)=>p.id>30?passContract(p,stack,state.route):originalContract(p,stack);
const validate=(p,stack)=>p.id>30?passValidate(p,stack,state.route):originalValidate(p,stack);
if(!window.__WEIGHTPLAY_ROUTE_LOCALE__)try{const locale=localStorage.getItem('weightplayLocale');if(dictionaries[locale])state.locale=locale;}catch{}
const text=(key,vars={})=>{
  let str=window.CAIRN_REBUILD_COPY[state.locale]?.[key]||dictionaries[state.locale]?.[key]||window.ANIMAL_CAIRN_COURIER_I9_COPY[state.locale]?.[key]||window.CAIRN_REBUILD_COPY.en[key]||dictionaries.en[key]||window.ANIMAL_CAIRN_COURIER_I9_COPY.en[key]||key;
  if(state.locale==='ar'&&key==='stagesV7')str=str.replace('{current} / {total}','\u2066{current} / {total}\u2069');
  if(state.locale==='ar'&&key==='roundV7')str=str.replace('{n} / {total}','\u2066{n} / {total}\u2069');
  for(const [name,value] of Object.entries(vars))str=str.replaceAll('{'+name+'}',String(value));return str;
};
const passText=(key,vars={})=>Object.entries(vars).reduce((str,[name,value])=>str.replaceAll('{'+name+'}',String(value)),PASS_COPY[state.locale]?.[key]||PASS_COPY.en[key]||key);
const stoneName=id=>text(stoneCatalog[id].key);
const plan=()=>STAGES[state.round];
const audio=window.WeightPlayAudio?.createScope();
const cue=id=>audio?.play(id);
window.WeightPlayAudio?.preload(['game.start','board.move','board.undo','feedback.error','result.win','reward.unlock']);
const persist=()=>{
  if(practiceRequested)return;
  const next={...saved,solved:[...solved].sort((a,b)=>a-b),updatedAt:new Date().toISOString()};
  const value=JSON.stringify(next);
  localStorage.setItem(STORE,value);
  if(localStorage.getItem(STORE)!==value)throw new Error('Unconfirmed campaign save');
  saved=next;
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

const stageText=(p,field)=>p.id>30?(field==='title'?passText('chapter'):passText('route')):field!=='title'?text(p.arcKey):
  window.CAIRN_REBUILD_COPY[state.locale]?.[p.titleKey]||dictionaries[state.locale]?.[p.titleKey]||text(p.arcKey)+' '+((p.id-1)%5+1);
const ruleText=p=>contract(p,[]).map(rule=>ruleLabel(rule,p)).join(' · ');
const statusFor=(p,i)=>solved.has(p.id)?text('complete'):practice||i===0||solved.has(STAGES[i-1].id)?text('open'):text('locked');
let selector=null,selectedStage=0;
const finishButton=document.createElement('button');finishButton.type='button';finishButton.id='finishButton';
frame.commonDownButton.add(finishButton);
const stageProgress=document.createElement('span');stageProgress.id='cairnStageProgress';frame.stageTopUI.add(stageProgress);
function renderStages(){
  stageProgress.textContent=text('stagesV7',{current:solved.size,total:STAGES.length});
  finishButton.textContent=text('finishTitle');finishButton.disabled=practiceRequested;
  if(!selector)selector=window.WeightPlayPlayUI.mountStage({page:$('stageWorkspace'),rail:$('stageList'),
    config:window.AnimalCairnCourierStageConfig({stages:STAGES,solved,stageText,ruleText,statusFor,text,practice}),selected:selectedStage,
    isActive:()=>state.screen==='stage'&&$('finishPanel').hidden,onSelect:i=>selectedStage=i,onStart:startRound});
  selector.refresh(selectedStage);
}
function updateMain(){
  $('mainProgress').textContent=text('stagesV7',{current:solved.size,total:STAGES.length})+' · '+text('seals')+' '+Object.values(saved.seals).reduce((a,b)=>a+Number(b||0),0)+'/'+(practice?STAGES.length*3:90);
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
  if(screen!=='battle'&&screen!=='result'){actionGuide.stop();lessonReplay=false;}
  if(screen!=='battle'&&screen!=='result'&&measurement.started&&!measurement.ended){measurement.ended=true;measurement.outcome='abandon';measurement.saveSucceeded=false;}
  measurement.screen=screen==='result'?null:screen;notifyMeasurement();
  cancelMotion();audio?.stop();if(screen!=='stage')selector?.cancel();
  setModal('finishPanel',false);setModal('leaveConfirm',false);
  state.screen=screen;document.body.dataset.screen=screen;
  const badge=document.querySelector('[data-wp-local-practice]');
  if(badge){if(screen==='battle'||screen==='result'){badge.style.position='static';badge.style.transform='none';document.querySelector('.contract-heading')?.append(badge);}
    else{badge.style.position='fixed';badge.style.left='50%';badge.style.top='58px';badge.style.transform='translateX(-50%)';document.body.append(badge);}}
  const active=screen==='result'?'battle':screen;
  for(const [id,name] of [['mainScreen','main'],['gameGuide','main'],['stageScreen','stage'],['battleScreen','battle']])$(id).hidden=name!==active;
  $('resultScreen').hidden=screen!=='result';
  $('battleScreen').querySelector('.battle-content').inert=screen==='result';
  frame.activate(active,{covered:screen==='result'});
  scene?.setActive(active==='battle');
  if(screen==='main')updateMain();
}
function ruleLabel(rule,p=plan()){
  const ids=rule.ids||[],vars={a:ids[0]?stoneName(ids[0]):'',b:ids[1]?stoneName(ids[1]):'',n:rule.value};
  if(['compass','gap','tether','wind'].includes(rule.kind))return passText(rule.kind,vars);
  if(p?.id>30&&rule.kind==='load')return passText('load',vars);
  return text(rule.kind==='load'?'loadRule':rule.kind,vars);
}
let buttons=new Map(),ruleNodes=[];
const passTools=document.createElement('div');passTools.className='mountain-pass-tools';passTools.hidden=true;
$('stoneTray').before(passTools);
function renderPassTools(){
  passTools.replaceChildren();passTools.hidden=plan()?.id<=30;if(passTools.hidden)return;
  const label=document.createElement('span');label.textContent=passText('route');passTools.append(label);
  for(const route of ['outbound','return']){
    const button=document.createElement('button');button.type='button';button.textContent=passText(route);button.dataset.route=route;
    button.setAttribute('aria-pressed',String(state.route===route));button.disabled=state.stack.length>0||state.settled;
    button.onclick=()=>{state.route=route;state.status='';buildBattle();passTools.querySelector(`[data-route="${route}"]`)?.focus({preventScroll:true});};passTools.append(button);
  }
  const pin=document.createElement('button');pin.type='button';pin.dataset.passPin='';
  const image=document.createElement('img');image.src='/games/animal-cairn-courier/assets/mountain-marker-pin-v1.png.webp?wp-media=0a561b3bf0c2e323';image.alt='';image.width=48;image.height=48;pin.append(image);
  const name=document.createElement('span');name.textContent=`${passText('pin')} · ${passText('uses',{n:state.pinUses})}`;pin.append(name);pin.disabled=state.pinUses===0||state.settled;
  pin.onclick=()=>{if(!acceptsInput()||state.pinUses<=0)return;state.pinUses--;const choices=passNext(plan(),state.stack,state.route);state.status=choices.length?passText('next',{stones:choices.map(stoneName).join(' · ')}):passText('none');updateBattle();const target=passTools.querySelector('[data-pass-pin]:not(:disabled)')||[...buttons.values()].find(b=>!b.disabled)||(!$('undoBtn').disabled?$('undoBtn'):$('checkBtn'));target?.focus({preventScroll:true});};passTools.append(pin);
}
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
  renderPassTools();updateBattle();flash($('playSurface'));
}
function updateBattle(success=false){
  const p=plan(),rules=contract(p,state.stack);
  rules.forEach((rule,i)=>{const n=ruleNodes[i];if(n){n.dataset.status=rule.status;n.textContent=(rule.status==='good'?'✓ ':rule.status==='bad'?'! ':'· ')+ruleLabel(rule);}});
  for(const [id,b] of buttons){b.disabled=state.stack.includes(id)||state.settled;b.setAttribute('aria-pressed',String(state.stack.includes(id)));}
  if(p.id>30)renderPassTools();
  const count=state.stack.length+'/'+p.stones.length+(p.loadLimit!==undefined?' · '+load(state.stack)+'/'+p.loadLimit:'');
  $('selectionCount').textContent=state.locale==='ar'?'\u2066'+count+'\u2069':count;
  $('stack').replaceChildren(...state.stack.map((id,i)=>{const li=document.createElement('li');li.textContent=(i+1)+' '+stoneName(id);return li;}));
  $('stack').classList.toggle('empty',!state.stack.length);
  if(!state.stack.length){const li=document.createElement('li');li.textContent=text('empty');$('stack').append(li);}
  $('checkBtn').disabled=state.stack.length!==p.stones.length||state.settled;
  $('undoBtn').disabled=$('clearBtn').disabled=state.stack.length===0||state.settled;
  $('battleStatus').textContent=state.status||text(state.stack.length===p.stones.length?'ready':'chooseStone');
  $('battleStatus').dataset.bad=String(!!state.status);
  if(actionGuide.active){
    for(const [id,button] of buttons)button.disabled=actionGuide.stepId!=='place'||id!==p.stones[0];
    $('clearBtn').disabled=$('checkBtn').disabled=true;
  }
  $('battleScreen').classList.toggle('cairn-teaching',actionGuide.active);actionGuide.refresh();
  scene?.update(state.stack,{success,skin:saved.finish});
}
async function startRound(index,{teachingReplay=false}={}){
  if(teachingReplay&&practiceRequested)return false;
  if(starting||!Number.isInteger(index)||!STAGES[index]||(practiceRequested&&(!practice||window.__cairnPracticeAnalyticsSafe!==true)))return false;
  if(practiceRequested){starting=true;try{if(!await LocalPractice.validate()||!practice)return false;}finally{starting=false;}}
  else if(index>0&&!solved.has(STAGES[index-1].id))return false;
  actionGuide.stop();lessonReplay=teachingReplay;
  Object.assign(measurement,{roundKey:{},started:true,ended:false,outcome:'abandon',stageId:STAGES[index].id,rewardEligible:!lessonReplay&&!practiceRequested&&!solved.has(STAGES[index].id),saveSucceeded:false});
  state.round=index;selectedStage=index;state.stack=[];state.picks=state.mistakes=state.edits=0;state.status='';state.settled=false;state.route='outbound';state.pinUses=2;
  show('battle');buildBattle();if(index===0&&!practiceRequested)actionGuide.start({replay:lessonReplay});updateBattle();cue('game.start');(actionGuide.active?buttons.get(plan().stones[0]):buttons.values().next().value)?.focus({preventScroll:true});
  return true;
}
function acceptsInput(){return state.screen==='battle'&&!state.settled&&$('leaveConfirm').hidden&&!document.hidden&&!document.querySelector('.wp-frame-popover:not([hidden])');}
function pickStone(id){
  const teaching=actionGuide.stepId;
  if(!acceptsInput()||!plan().stones.includes(id)||state.stack.includes(id)||(teaching&&(teaching!=='place'||id!==plan().stones[0])))return;
  state.stack.push(id);state.picks++;state.status='';
  if(teaching==='place'&&state.stack.length===1&&state.stack[0]===id)actionGuide.accept('place',{accepted:true});
  updateBattle();cue('board.move');flash(buttons.get(id));
  const next=[...buttons.values()].find(b=>!b.disabled);if(next)next.focus({preventScroll:true});else $('checkBtn').focus({preventScroll:true});
}
function undo(clear=false){
  const teaching=actionGuide.stepId;if(!acceptsInput()||!state.stack.length||(teaching&&(teaching!=='undo'||clear)))return;
  const id=state.stack.at(-1);if(clear)state.stack=[];else state.stack.pop();state.edits++;state.status='';
  if(teaching==='undo'&&id===plan().stones[0]&&!state.stack.length){state.picks--;state.edits--;actionGuide.accept('undo',{accepted:true});}
  updateBattle();cue('board.undo');buttons.get(id)?.focus({preventScroll:true});
}
function check(){
  if(!acceptsInput()||actionGuide.active||state.stack.length!==plan().stones.length)return;
  if(!validate(plan(),state.stack)){
    state.mistakes++;const broken=contract(plan(),state.stack).find(r=>r.status==='bad');
    state.status=text('fixRule',{rule:ruleLabel(broken)});updateBattle();cue('feedback.error');flash($('ruleList'),true);return;
  }
  state.settled=true;
  const seals=state.mistakes?1:state.edits||state.picks!==plan().stones.length?2:3;
  let persisted=false;
  if(!lessonReplay){
    solved.add(plan().id);saved.seals[plan().id]=Math.max(saved.seals[plan().id]||0,seals);
    saved.best[plan().id]=Math.min(saved.best[plan().id]||Infinity,state.picks);
    if(solved.size>=10&&!saved.finishes.includes('alpine'))saved.finishes.push('alpine');
    try{persist();persisted=true;}catch{}
  }
  let savedClear=false;try{savedClear=!lessonReplay&&!practiceRequested&&persisted&&normalize(JSON.parse(localStorage.getItem(STORE)||'{}')).solved.includes(plan().id);}catch{}
  Object.assign(measurement,{ended:true,outcome:'win',saveSucceeded:savedClear});
  // Outcome ownership is synchronous; effects never grant progress or repeat rewards.
  show('result');updateBattle(true);cue('result.win');
  $('resultTitle').textContent=text(seals===3?'perfect':seals===2?'clean':'settled');
  $('resultSeals').textContent='★'.repeat(seals)+'☆'.repeat(3-seals);
  $('resultSeals').setAttribute('aria-label',text('seals')+' '+seals+'/3');
  $('resultText').textContent=text('picks')+': '+state.picks+' · '+text('best')+': '+(saved.best[plan().id]||'—')+'\n'+text('stagesV7',{current:solved.size,total:practice?STAGES.length:30})+(lessonReplay?'\n'+lessonText()[5]:practice?'\n'+passText('practice'):persisted?'':'\n'+text('saveError'));
  $('resultStagesBtn').textContent=text('stages');$('resultNextBtn').textContent=text('next');$('resultReplayBtn').textContent=text('replay');
  $('resultNextBtn').disabled=lessonReplay||state.round===STAGES.length-1;
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
    const image=document.createElement('img');image.src='/assets/interface7-redrawn/animal-cairn-courier.webp?wp-media=0a561b3bf0c2e323';image.alt='';row.append(image);
    const label=document.createElement('strong');label.textContent=text(name);row.append(label);
    const b=document.createElement('button');b.type='button';b.textContent=saved.finish===name?'✓ '+text('owned'):owned?text('equip'):name==='alpine'?text('earned'):text('purchase');
    if(!owned&&name==='aurora'){const diamond=document.createElement('img');diamond.src='/assets/weightplay-diamond.svg';diamond.alt=text('balance');diamond.width=18;diamond.height=18;b.prepend(diamond);}
    b.disabled=finishWritesUncertain||saved.finish===name||(!owned&&name==='alpine');b.onclick=()=>chooseFinish(name);row.append(b);$('finishChoices').append(row);
  }
}
const finishUncertainCopy={en:'Purchase could not be confirmed. Reload to check before trying again.', 'zh-Hant':'無法確認購買結果，請重新載入並確認後再試。', 'zh-Hans':'无法确认购买结果，请重新加载并确认后再试。',ja:'購入を確認できません。再読み込みして確認してください。',ko:'구매를 확인할 수 없어요. 새로고침하여 확인하세요.',es:'No se pudo confirmar la compra. Recarga y comprueba antes de volver a intentarlo.', 'pt-BR':'Não foi possível confirmar a compra. Recarregue e confira antes de tentar novamente.',fr:'Achat non confirmé. Rechargez et vérifiez avant de réessayer.',de:'Kauf konnte nicht bestätigt werden. Lade neu und prüfe ihn vor einem erneuten Versuch.',it:'Acquisto non confermato. Ricarica e controlla prima di riprovare.',ru:'Не удалось подтвердить покупку. Обновите страницу и проверьте её перед повтором.',hi:'खरीद की पुष्टि नहीं हुई। दोबारा प्रयास से पहले पेज पुनः खोलकर जाँचें।',ar:'تعذر تأكيد الشراء. أعد تحميل الصفحة وتحقق قبل المحاولة مجددًا.'};
let purchasing=false,finishWritesUncertain=false;
async function chooseFinish(name){
  if(practiceRequested||purchasing||finishWritesUncertain||state.screen!=='stage')return;
  const owned=name==='moss'||saved.finishes.includes(name)||(name==='alpine'&&solved.size>=10);
  if(!owned&&name!=='aurora')return;
  purchasing=true;
  try{
    const result=(await purchaseFinish({saved,solved:[...solved],name,wallet:window.WeightPlayWallet,
      write:value=>writeConfirmed(localStorage,STORE,{...value,solved:[...solved],updatedAt:new Date().toISOString()})}));
    if(result.status==='insufficient'){$('finishStatus').textContent=text('needDiamonds');cue('feedback.error');return;}
    saved=result.saved;$('finishStatus').textContent=text('owned')+' · '+text(name);cue(owned?'ui.click':'reward.unlock');
    scene?.update(state.stack,{skin:name});renderFinishes();flash($('finishChoices'));
  }catch(error){
    if(error?.uncertain){finishWritesUncertain=true;renderFinishes();}
    $('finishStatus').textContent=error?.uncertain?(finishUncertainCopy[state.locale]||finishUncertainCopy.en):text('saveError');cue('feedback.error');
  }finally{purchasing=false;}
}
function applyLocale(){
  document.documentElement.lang=state.locale;document.documentElement.dir=state.locale==='ar'?'rtl':'ltr';
  replayLesson.textContent=lessonText()[4];actionGuide.refresh();
  document.querySelectorAll('[data-copy]').forEach(n=>{if(!n.matches('[data-wp-return]'))n.textContent=text(n.dataset.copy);});
  document.querySelectorAll('[data-aria-copy]').forEach(n=>n.setAttribute('aria-label',text(n.dataset.ariaCopy)));
  document.querySelectorAll('[data-alt-copy]').forEach(n=>n.alt=text(n.dataset.altCopy));
  $('localeSelect').value=state.locale;updateMain();finishButton.textContent=text('finishTitle');
  if(state.screen==='stage')renderStages();
  window.dispatchEvent(new CustomEvent('wonder:locale-change',{detail:{locale:state.locale}}));
}
$('startBtn').onclick=()=>{if(practiceRequested&&!practice)return;selectedStage=Math.min(STAGES.length-1,STAGES.findIndex(p=>!solved.has(p.id)));if(selectedStage<0)selectedStage=practice?STAGES.length-1:29;show('stage');renderStages();};
$('stageBackBtn').onclick=()=>{show('main');$('startBtn').focus({preventScroll:true});};
$('battleBackBtn').onclick=guardReturn;
$('checkBtn').onclick=check;$('undoBtn').onclick=()=>undo();$('clearBtn').onclick=()=>undo(true);
$('leaveContinueBtn').onclick=closeLeave;$('leaveStagesBtn').onclick=()=>{state.stack=[];show('stage');renderStages();};
$('resultStagesBtn').onclick=()=>{selectedStage=Math.min(practice?STAGES.length-1:29,state.round+1);show('stage');renderStages();};
$('resultNextBtn').onclick=()=>{if(!lessonReplay&&state.screen==='result'&&state.round<(practice?STAGES.length-1:29))void startRound(state.round+1);};
$('resultReplayBtn').onclick=()=>{if(state.screen==='result')startRound(state.round,{teachingReplay:lessonReplay});};
finishButton.onclick=()=>{if(!practiceRequested)showFinishes();};
$('finishClose').onclick=()=>{setModal('finishPanel',false);finishButton.focus({preventScroll:true});};
$('localeSelect').onchange=e=>{state.locale=dictionaries[e.target.value]?e.target.value:'en';if(!practiceRequested)try{localStorage.setItem('weightplayLocale',state.locale);}catch{}applyLocale();};
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
  ruleSummary:index=>STAGES[index]?ruleText(STAGES[index]):null,
  getState:()=>({...state,stack:[...state.stack],solved:[...solved]}),sceneStats:()=>scene?.stats()};
applyLocale();show('main');$('loadingPanel').hidden=true;
if(practiceRequested){
  const practiceStatus=document.createElement('p');practiceStatus.setAttribute('role','status');practiceStatus.textContent=passText('practice');$('startBtn').after(practiceStatus);
  const waitForEntryReady=()=>new Promise(resolve=>{
    let done=false;const observer=new MutationObserver(check),timer=setTimeout(()=>finish(false),25000);
    function finish(ok){if(done)return;done=true;clearTimeout(timer);observer.disconnect();resolve(ok);}
    function check(){const root=document.documentElement;if(window.WeightPlayGameEntryLoader?.isActive&&root.dataset.wpGameEntryLoaderInstalled==='true'&&root.dataset.wpGameEntryLoaderActive!=='true')finish(true);else if(document.querySelector('.wp-game-entry-loader[data-state="error"]'))finish(false);}
    observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-wp-game-entry-loader-installed','data-wp-game-entry-loader-active'],childList:true,subtree:true});check();
  });
  void waitForEntryReady().then(ready=>ready&&window.__cairnPracticeAnalyticsSafe===true&&LocalPractice.register({
    gameId:'animal-cairn-courier',stageIds:[...originalStages,...MOUNTAIN_PASS].map(p=>p.id),
    enable(value){practice=value&&window.__cairnPracticeAnalyticsSafe===true;$('startBtn').disabled=!practice;if(practice){if(STAGES.length===originalStages.length)STAGES.push(...MOUNTAIN_PASS);practiceStatus.textContent=passText('practice');updateMain();}
      else{STAGES.splice(originalStages.length);state.round=0;state.stack=[];state.settled=false;selector?.destroy?.();selector=null;document.querySelector('[data-wp-local-practice]')?.remove();practiceStatus.textContent=passText('expired');show('main');}},
    startStage:id=>startRound(Number(id)-1)
  })).then(ok=>{if(!ok&&!practice)practiceStatus.textContent=passText('expired');}).catch(()=>{practiceStatus.textContent=passText('expired');});
}
