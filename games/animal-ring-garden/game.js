import {STAGES,SAVE_KEY,applyMove,aligned,solve,parFor,highestUnlocked,settleSave,vectors} from './core.mjs';
import {readSave,recoverPurchase,purchaseMoonstone} from './economy.mjs';
import {NEW_COPY,GLYPHS} from './copy.mjs';
import {renderConservatoryGuide} from './guide.mjs';
import {ConservatoryScene} from './scene.mjs';
import {LocalPractice} from '../../src/game-local-practice.mjs';

const $=id=>document.getElementById(id), roman=['I','II','III'];
const localeMap={'zh-tw':'zh-Hant','zh-cn':'zh-Hans','pt-br':'pt-BR'};
const route=location.pathname.split('/').filter(Boolean)[0];
let locale=window.__WEIGHTPLAY_ROUTE_LOCALE__||localeMap[route]||route;
if(!NEW_COPY[locale])locale='en';
const t=key=>NEW_COPY[locale][key]??window.RING_GARDEN_COPY?.[locale]?.[key]??window.RING_GARDEN_COPY?.en?.[key]??key;
const audio=window.WeightPlayAudio?.createScope();
window.WeightPlayAudio?.preload(['board.rotate','board.undo','feedback.hint','feedback.error','feedback.success','puzzle.match','reward.unlock','result.win']);
let storage;try{storage=localStorage;}catch{storage={getItem(){return null;},setItem(){throw Error('STORAGE_UNAVAILABLE');},removeItem(){}};}
let save=readSave(storage),scene=null,storageOK=true,practiceSession=false;
const state={screen:'main',index:0,browse:highestUnlocked(save)-1,rings:[0,0,0],mode:0,phase:0,turns:0,selected:0,history:[],busy:false,solved:false,phaseDone:false,hint:null};
const stage=()=>STAGES[state.index],phase=()=>stage().phases[state.phase];
const title=s=>locale==='zh-Hant'?s.zh:locale==='zh-Hans'?s.zhHans:locale==='en'?s.en:s.id<=4?t(['gardenOne','gardenTwo','gardenThree','gardenFour'][s.id-1]):t('arcs')[s.arc]+' '+s.id;
const notify=()=>window.dispatchEvent(new Event('weightplay:ring-garden-state-change'));
const text=(id,value)=>{const node=$(id);if(node)node.textContent=value;};
function sound(id){audio?.play(id);}
function emit(event,extra={}){if(!practiceSession)window.WonderAnalytics?.track(event,{game_id:'animal-ring-garden',stage_id:'garden-'+stage().id,...extra});}
function persist(next){save=next;try{storage.setItem(SAVE_KEY,JSON.stringify(next));storageOK=true;return true;}catch{storageOK=false;return false;}}
function mainProgress(){text('mainProgress',t('progress')+': '+save.completed.length+' / 30');}

function showScreen(screen){
  state.screen=screen;
  if(screen!=='battle'){state.busy=false;audio?.stop();scene?.setState(state.rings);}
  document.body.dataset.screen=screen;
  document.querySelectorAll('[data-screen]').forEach(node=>node.hidden=node.dataset.screen!==screen);
  window.dispatchEvent(new CustomEvent('weightplay:game-view-change',{detail:{screen}}));
  scene?.setActive(screen==='battle'&&!state.solved&&!document.hidden);
  mainProgress();notify();
}
function ensureScene(){
  if(scene)return;
  try{
    scene=new ConservatoryScene($('ring-board'),{select:selectRing,turn:turnRing,ready:ready=>{
      $('renderer-status').hidden=ready;
      if(!ready){if(state.busy)finishMove();text('renderer-status',t('begin'));}
      else scene?.setState(state.rings);
    }});
    scene.setFinish(save.finish);scene.selectRing(state.selected);
  }catch{ text('renderer-status',t('begin'));$('renderer-status').hidden=false; }
}
function selectRing(index){
  if(state.busy||state.solved)return;
  state.selected=index;state.hint=null;scene?.selectRing(index);renderControls();
}
function glyphNode(value){const span=document.createElement('span');span.className='glyph glyph-'+value;span.textContent=GLYPHS[value];return span;}
function renderPattern(){
  const fragment=document.createDocumentFragment();
  phase().target.forEach((value,i)=>{
    const item=document.createElement('span');item.className='target-slot';item.dataset.aligned=String(value===state.rings[i]);
    const label=document.createElement('small');label.textContent=roman[i];item.append(label,glyphNode(value));
    const mark=document.createElement('small');mark.className='alignment';mark.textContent=value===state.rings[i]?'✓':'·';item.append(mark);
    item.setAttribute('aria-label',roman[i]+': '+GLYPHS[value]+(value===state.rings[i]?' ✓':''));fragment.append(item);
  });
  $('target-pattern').replaceChildren(fragment);
  text('phase-label',t('phase')+' '+(state.phase+1)+' / '+stage().phases.length);
}
function mechanism(){
  const p=phase(),v=vectors(p,state.mode)[state.selected];
  const links=v.map((n,i)=>n?(roman[i]+(n>0?' ↻':' ↺')):'').filter(Boolean).join(' · ');
  return (p.kind==='seal'?t('sealed')+' III = '+GLYPHS[p.gate]+'  |  ':'')+links;
}
function renderControls(){
  document.querySelectorAll('[data-select-ring]').forEach((button,i)=>{
    button.setAttribute('aria-pressed',String(i===state.selected));button.disabled=state.busy||state.solved;
    button.querySelector('span').textContent=t(['outer','middle','inner'][i]);
  });
  text('mechanism',mechanism());
  $('clutch-button').hidden=phase().kind!=='clutch';
  text('clutch-button',t('switch')+' · '+t(state.mode?'coupled':'free'));
  const current=document.createDocumentFragment();state.rings.forEach((n,i)=>{const g=glyphNode(n);g.dataset.selected=String(i===state.selected);current.append(g);});
  $('current-glyphs').replaceChildren(current);
  $('current-glyphs').setAttribute('aria-label',state.rings.map((n,i)=>roman[i]+' '+GLYPHS[n]).join(', '));
  for(const id of ['turn-left','turn-right','clutch-button','hint-button'])$(id).disabled=state.busy||state.phaseDone||state.solved;
  $('undo-button').disabled=state.busy||!state.history.length||state.solved;
  $('reset-button').disabled=state.busy||!state.turns;
  $('turn-left').setAttribute('aria-label',t('turnLeft').replace('{n}',roman[state.selected]));
  $('turn-right').setAttribute('aria-label',t('turnRight').replace('{n}',roman[state.selected]));
  $('phase-button').hidden=!state.phaseDone;
  for(const id of ['turn-left','turn-right','clutch-button'])$(id).classList.remove('hint-action');
  if(state.hint)$(state.hint.ring===3?'clutch-button':state.hint.dir===1?'turn-right':'turn-left').classList.add('hint-action');
  notify();
}
function renderBattle(message=t('begin')){
  $('play-panel').hidden=state.solved;$('result-panel').hidden=!state.solved;
  renderPattern();renderControls();text('battle-status',message);
}
function snapshot(){return {rings:[...state.rings],mode:state.mode,phase:state.phase,turns:state.turns};}
function finishMove(){
  state.busy=false;
  if(aligned(phase(),state.rings)){
    if(state.phase===stage().phases.length-1){complete();return;}
    state.phaseDone=true;sound('feedback.success');renderBattle(t('complete'));
    $('phase-button').focus({preventScroll:true});
  }else{
    const prior=state.history.at(-1);
    if(prior&&phase().target.some((n,i)=>n===state.rings[i]&&n!==prior.rings[i]))sound('puzzle.match');
    renderBattle();
  }
}
function turnRing(ring,dir){
  if(state.screen!=='battle'||state.busy||state.solved||state.phaseDone)return;
  const p=phase(),next=applyMove(p,state,{ring,dir});
  if(!next){sound('feedback.error');text('battle-status',t('sealed')+': III = '+GLYPHS[p.gate]);$('ring-board').classList.remove('sealed-pulse');void $('ring-board').offsetWidth;$('ring-board').classList.add('sealed-pulse');return;}
  state.history.push(snapshot());
  const deltas=ring===3?[0,0,0]:vectors(p,state.mode)[ring].map(n=>n*dir);
  state.rings=next.rings;state.mode=next.mode;state.turns++;state.hint=null;state.busy=true;
  sound('board.rotate');renderControls();
  if(scene)scene.animate(state.rings,deltas,finishMove);else finishMove();
}
function undo(){
  if(!state.history.length||state.busy||state.solved)return;
  Object.assign(state,state.history.pop());state.phaseDone=false;state.hint=null;scene?.setState(state.rings);
  sound('board.undo');renderBattle(t('undo'));
}
function hint(){
  if(state.busy||state.solved||state.phaseDone)return;
  const next=solve(phase(),state)?.[0];if(!next)return;
  if(next.ring<3)selectRing(next.ring);state.hint=next;
  sound('feedback.hint');renderControls();
  text('battle-status',t('hint')+': '+(next.ring===3?t('switch'):roman[next.ring]+' '+(next.dir>0?'↻':'↺')));
}
function nextPhase(){
  if(!state.phaseDone)return;
  state.phase++;state.mode=phase().mode||0;state.phaseDone=false;state.hint=null;
  renderBattle();$('turn-right').focus({preventScroll:true});
}
async function startGarden(index){
  if(practiceSession&&!await LocalPractice.validate()){showScreen('stage');return;}
  const selected=Math.max(0,Math.min(STAGES.length-1,Math.round(Number(index)||0)));
  if(!practiceSession&&selected>=highestUnlocked(save))return;
  Object.assign(state,{index:selected,browse:selected,rings:[...STAGES[selected].seed],mode:STAGES[selected].phases[0].mode||0,phase:0,turns:0,selected:0,history:[],busy:false,solved:false,phaseDone:false,hint:null});
  ensureScene();scene?.setState(state.rings);scene?.setFinish(save.finish);scene?.selectRing(0);
  renderBattle();showScreen('battle');emit('game_start');
  // Direct authorized practice opens Battle before the automatic Main bridge.
  // The synchronous scene construction and first render above are its readiness.
  if(practiceSession&&scene){
    const ready=()=>window.WeightPlayGameEntryLoader?.ready();
    if(window.WeightPlayGameEntryLoader?.isActive)ready();
    else document.querySelector('script[data-wp-game-entry-loader-bootstrap]')?.addEventListener('load',ready,{once:true});
  }
}
function complete(){
  state.solved=true;state.busy=false;const s=stage();let obtained=false;
  if(!practiceSession){
    const fresh=readSave(storage),base={...fresh,completed:[...new Set([...save.completed,...fresh.completed])],best:{...save.best,...fresh.best}};
    const didSave=persist(settleSave(base,s.id,state.turns));
    if(didSave)obtained=window.WonderAnalytics?.completeStage('garden-'+s.id)?.credited===true;
  }
  scene?.setActive(false);sound('result.win');renderBattle();
  const par=parFor(s),stars=state.turns<=par?3:state.turns<=par+2?2:1;
  text('result-stars','★'.repeat(stars)+'☆'.repeat(3-stars));$('result-stars').setAttribute('aria-label',stars+' / 3');
  text('result-copy',title(s));text('result-turns',state.turns);text('result-best',practiceSession?'—':save.best[s.id]||state.turns);text('result-par',par);
  text('result-status',practiceSession?t('practice'):!storageOK?t('storage'):(state.turns<=par?t('mastery'):t('saved'))+(obtained?' · '+t('reward')+' +1':''));
  const rewardIcon=window.WeightPlayScreenFrame?.showResultGet('animal-ring-garden',obtained);
  if(rewardIcon&&obtained)window.WeightPlayCastle?.dismissRewardNotice('animal-ring-garden');
  $('next-button').hidden=s.id===STAGES.length;
  mainProgress();notify();$('result-title').setAttribute('tabindex','-1');$('result-title').focus({preventScroll:true});
}
function goStage(){
  if($('leaveConfirm').open)$('leaveConfirm').close();
  state.browse=state.index;showScreen('stage');window.AnimalRingGardenFrame?.refreshStage();
}
function stageRecord(index){
  const s=STAGES[index],cleared=save.completed.includes(s.id),best=save.best[s.id];
  const shared=window.WeightPlayCastle?.read();
  return {id:'garden-'+s.id,kicker:String(s.id).padStart(2,'0')+' / 30',title:title(s),subtitle:t('arcs')[s.arc],
    status:cleared?'✓ '+(best?t('best')+' '+best:t('complete')):'',summary:t('arcs')[s.arc],
    details:[t('phase')+' '+s.phases.length+' · '+t('par')+' '+parFor(s)],locked:!practiceSession&&s.id>highestUnlocked(save),cleared,
    poster:'/assets/interface7-redrawn/animal-ring-garden.webp',posterPosition:'center',rewardState:practiceSession||!shared?'unknown':shared.completions['animal-ring-garden:stage-garden-'+s.id]?'collected':'not-collected'};
}
function headerState(){return {stageName:title(STAGES[state.browse]),stageIndex:(state.browse+1)+' / 30',battleName:title(stage()),turns:t('turns')+' '+state.turns};}

function renderCollection(message=''){
  text('wallet-balance',t('balance')+' · '+(window.WeightPlayWallet?.read().diamonds||0));
  text('collection-status',practiceSession?t('practice'):message);$('purchase-confirm').hidden=true;
  const list=$('finish-list');list.replaceChildren();
  for(const name of ['stone','jade','moonstone']){
    const button=document.createElement('button');button.type='button';button.className='finish-card finish-'+name;
    const swatch=document.createElement('span');swatch.className='finish-swatch';swatch.setAttribute('aria-hidden','true');
    const label=document.createElement('strong');label.textContent=t(name);
    const status=document.createElement('small');status.textContent=save.finish===name?t('equipped'):save.owned.includes(name)?t('equip'):name==='jade'?t('earn'):t('buy');
    button.append(swatch,label,status);button.dataset.finish=name;button.disabled=practiceSession||name==='jade'&&!save.owned.includes(name);
    button.setAttribute('aria-pressed',String(save.finish===name));
    button.addEventListener('click',()=>{
      if(practiceSession)return;
      if(save.owned.includes(name)){
        const next={...readSave(storage),finish:name};if(persist(next)){scene?.setFinish(name);renderCollection(t('saved'));}else renderCollection(t('storage'));
      }else{$('purchase-confirm').hidden=false;text('purchase-copy',t('moonstone')+' · 12 '+t('balance')+'. '+t('permanent'));$('purchase-buy').focus();}
    });list.append(button);
  }
}
async function buy(){
  if(practiceSession)return;
  $('purchase-buy').disabled=true;
  const transaction=()=>purchaseMoonstone(storage,window.WeightPlayWallet);
  let result;
  try{result=navigator.locks?await navigator.locks.request('animal-ring-garden-finish',transaction):transaction();}catch{result={status:'storage'};}
  $('purchase-buy').disabled=false;
  if(result.status==='purchased'||result.status==='owned'){save=result.save;scene?.setFinish(save.finish);if(result.status==='purchased')sound('reward.unlock');renderCollection(t('saved'));}
  else{sound('feedback.error');renderCollection(t(result.status));}
}
function openCollection(){
  if(!practiceSession){recoverPurchase(storage,window.WeightPlayWallet);save=readSave(storage);}
  renderCollection();$('collection-dialog').showModal();
}
function applyCopy(){
  document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';$('locale').value=locale;
  if($('gameGuide'))$('gameGuide').outerHTML=renderConservatoryGuide(locale);
  for(const [id,key] of Object.entries({'language-label':'language','main-eyebrow':'world','main-lede':'begin','main-summary':'summary','startBtn':'start','target-label':'target','undo-button':'undo','hint-button':'hint','reset-button':'reset','phase-button':'nextPattern','help-title':'help','help-world':'world','help-copy':'how','help-keyboard':'keyboard','help-close':'close','collection-title':'collection','collection-world':'world','collection-copy':'permanent','collection-close':'close','purchase-cancel':'cancel','purchase-buy':'buy','result-eyebrow':'world','result-title':'complete','result-turn-label':'turns','result-best-label':'best','result-par-label':'par','result-main':'backToGardens','next-button':'next','result-retry':'replay','ring-leave-title':'leaveTitle','ring-leave-copy':'leaveBody','ring-leave-continue':'continueBattle','ring-leave-stages':'returnToMap','guide-title':'help','guide-intro':'summary','guide-one':'how','guide-two':'keyboard','guide-three':'permanent'}))text(id,t(key));
  text('fact-one','30');text('fact-two',t('undo'));text('fact-three',t('hint'));
  $('help-button').setAttribute('aria-label',t('help'));$('ring-board').setAttribute('aria-label',t('battleRingsLabel'));
  $('stage-back').setAttribute('aria-label',t('back'));$('battle-back').setAttribute('aria-label',t('gardens'));
  $('collection-button')?.replaceChildren(document.createTextNode(t('collection')));
  mainProgress();if(state.screen==='battle'&&!state.solved)renderBattle();notify();
}

$('startBtn').addEventListener('click',()=>showScreen('stage'));
$('stage-back').addEventListener('click',()=>showScreen('main'));
$('battle-back').addEventListener('click',()=>{
  if(!state.solved&&state.turns){$('leaveConfirm').returnValue='';$('leaveConfirm').showModal();$('ring-leave-continue').focus();}else goStage();
});
$('leaveConfirm').addEventListener('close',()=>{if($('leaveConfirm').returnValue==='leave')goStage();});
$('reset-button').addEventListener('click',()=>startGarden(state.index));
$('result-retry').addEventListener('click',()=>startGarden(state.index));
$('next-button').addEventListener('click',()=>startGarden(state.index+1));
$('result-main').addEventListener('click',goStage);
$('undo-button').addEventListener('click',undo);$('hint-button').addEventListener('click',hint);
$('phase-button').addEventListener('click',nextPhase);
$('turn-left').addEventListener('click',()=>turnRing(state.selected,-1));$('turn-right').addEventListener('click',()=>turnRing(state.selected,1));
$('clutch-button').addEventListener('click',()=>turnRing(3,1));
document.querySelectorAll('[data-select-ring]').forEach((b,i)=>b.addEventListener('click',()=>selectRing(i)));
$('help-button').addEventListener('click',()=>$('help-dialog').showModal());
$('collection-close').addEventListener('click',()=>$('collection-dialog').close());
$('purchase-cancel').addEventListener('click',()=>{$('purchase-confirm').hidden=true;});$('purchase-buy').addEventListener('click',buy);
$('locale').addEventListener('change',event=>{
  locale=NEW_COPY[event.target.value]?event.target.value:'en';applyCopy();window.dispatchEvent(new Event('wonder:locale-change'));
});
document.addEventListener('keydown',event=>{
  if(state.screen!=='battle'||state.solved||document.querySelector('dialog[open]')||event.ctrlKey||event.metaKey||event.altKey||event.target.matches('select,input,textarea'))return;
  if(['1','2','3'].includes(event.key)){event.preventDefault();selectRing(Number(event.key)-1);}
  else if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();turnRing(state.selected,event.key==='ArrowRight'?1:-1);}
  else if(event.key.toLowerCase()==='z'){event.preventDefault();undo();}
});
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){audio?.stop();if(state.busy){scene?.setState(state.rings);state.busy=false;if(aligned(phase(),state.rings)){if(state.phase===stage().phases.length-1)complete();else state.phaseDone=true;}renderBattle();}}
  scene?.setActive(!document.hidden&&state.screen==='battle'&&!state.solved);
});
window.addEventListener('pagehide',event=>{audio?.stop();scene?.setActive(false);if(!event.persisted){audio?.dispose();scene?.dispose();}});
window.addEventListener('pageshow',()=>scene?.setActive(state.screen==='battle'&&!state.solved));
window.AnimalRingGardenGame=Object.freeze({stageCount:STAGES.length,get stageBrowseIndex(){return state.browse;},selectStage(index){state.browse=Math.max(0,Math.min(29,index));notify();},startGarden,stageRecord,headerState,openCollection,collectionLabel:()=>t('collection'),setLocale(value){locale=NEW_COPY[value]?value:'en';applyCopy();}});
applyCopy();showScreen('main');
LocalPractice.register({gameId:'animal-ring-garden',stageIds:STAGES.map(s=>String(s.id)),enable(enabled){if(enabled)practiceSession=true;window.AnimalRingGardenFrame?.refreshStage();},startStage:id=>startGarden(Number(id)-1)});
