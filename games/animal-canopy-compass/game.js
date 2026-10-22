import {STAGES,DIRECTIONS,SEALS,CAMPAIGN_KEY,candidates,matches,normalizeSave,unlocked,rating,settle,wrap} from './puzzles.mjs?v=26';
import {createCanopyScene} from './canopy-scene.mjs?v=26';
import {purchaseAurora} from './purchase.mjs?v=26';

const $=id=>document.getElementById(id);
const copy=window.CANOPY_COMPASS_LOCALES;
const routes={en:'en','zh-tw':'zh-Hant','zh-cn':'zh-Hans',ja:'ja',ko:'ko',es:'es','pt-br':'pt-BR',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
const initialLocale=()=>{
  const routed=routes[location.pathname.split('/')[1]];if(routed)return routed;
  try{const saved=localStorage.getItem('weightPlayLocale')||localStorage.getItem('wp-locale');if(copy[saved])return saved;}catch{}
  return 'en';
};
const state={locale:initialLocale(),screen:'main',stage:0,phase:0,selected:-1,notes:new Set(),noteMode:false,hintIndex:-1,hinted:[],mistakes:0,hints:0,trail:[],pending:null,save:normalizeSave(read(CAMPAIGN_KEY,{}))};
const labels=key=>copy[state.locale]?.[key]||copy.en[key];
const t=(key,vars={})=>Object.entries(vars).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,String(v)),String(labels(key)??key));
const dir=i=>labels('bearings')[wrap(i)];
const symbols=['☀','☾','❧','✦'];
const badgeFiles=['dawn-lantern','crosswind-bell','mirror-moth','echo-heron','high-bough-kite','moon-canopy-guide'];
const COVER='/games/animal-canopy-compass/assets/v26/canopy-cover.webp';
const APPEARANCE_KEY='weightplay-canopy-appearance-v1';
let appearance=read(APPEARANCE_KEY,{owned:false,theme:'classic'});
if(!appearance||typeof appearance!=='object')appearance={owned:false,theme:'classic'};
appearance.owned=appearance.owned===true;
appearance.theme=appearance.owned&&appearance.theme==='aurora'?'aurora':'classic';
let frame,rail,scene,selectedStage=unlocked(state.save)-1,transitionTimer=0,feedbackTimer=0,modalReturn=null,modalKind=null,buying=false;
const audio=window.WeightPlayAudio?.createScope?.();
const sound=id=>audio?.play(id);
window.WeightPlayAudio?.preload(['board.rotate','feedback.success','feedback.error','feedback.hint','result.win','game.start','reward.upgrade']);
const stage=()=>STAGES[state.stage];
const phase=()=>stage().phases[state.phase];
const previous=()=>state.trail.at(-1)??0;
const settingsOpen=()=>!!document.querySelector('[data-wp-settings][aria-expanded="true"]');
const isPlaying=()=>state.screen==='battle'&&$('result').hidden&&$('renderError').hidden&&!modalKind&&!document.hidden&&!settingsOpen()&&!state.pending;
const announce=(message,tone='')=>{$('status').textContent=message;$('status').dataset.tone=tone;};
function notify(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(notify.timer);notify.timer=setTimeout(()=>$('toast').classList.remove('visible'),2600);}

function clueText(clue){
  const vars={from:dir(clue.kind.startsWith('echo')?previous():clue.from||0),turn:t(clue.steps<0?'counterclockwise':'clockwise'),steps:Math.abs(clue.steps||0),seal:labels('seals')[clue.seal||0],axis:labels('axes')[clue.axis==='horizontal'?1:0]};
  return t(`${clue.kind}Clue`,vars);
}
function persist(){
  const other=normalizeSave(read(CAMPAIGN_KEY,{}));
  state.save.completed=[...new Set([...state.save.completed,...other.completed])].sort((a,b)=>a-b);
  state.save.badges=[...new Set([...state.save.badges,...other.badges])].sort((a,b)=>a-b);
  Object.entries(other.masteryV26).forEach(([id,stars])=>state.save.masteryV26[id]=Math.max(stars,state.save.masteryV26[id]||0));
  state.save.bests={...other.bests,...state.save.bests};
  try{localStorage.setItem(CAMPAIGN_KEY,JSON.stringify(state.save));return true;}catch{notify(t('saveError'));return false;}
}
function updateProgress(){
  $('progress').textContent=t('progress',{count:state.save.completed.length,unlocked:unlocked(state.save)});
  $('stageCompletionValue').textContent=`${state.save.completed.length}/30`;
  $('stageSelectionValue').textContent=t('round',{number:selectedStage+1,total:30});
}
function clearPending(){clearTimeout(transitionTimer);transitionTimer=0;state.pending=null;}
function syncActivity(){
  const covered=!!modalKind||document.hidden||settingsOpen()||!$('renderError').hidden;
  scene?.setActive(state.screen==='battle'&&$('result').hidden&&!covered);
  if(covered){
    if(state.pending&&transitionTimer)state.pending.remaining=Math.max(0,state.pending.deadline-performance.now());
    clearTimeout(transitionTimer);transitionTimer=0;return;
  }
  if(state.pending&&!transitionTimer){
    const remaining=state.pending.remaining??Math.max(0,state.pending.deadline-performance.now());
    state.pending.remaining=null;state.pending.deadline=performance.now()+remaining;
    transitionTimer=setTimeout(advancePhase,remaining);
  }
}
function showScreen(name){
  clearPending();clearTimeout(feedbackTimer);audio?.stop();
  clearTimeout(notify.timer);$('toast').textContent='';$('toast').classList.remove('visible');
  if(modalKind)closeModal(false);
  state.screen=name;document.body.dataset.screen=name;document.body.removeAttribute('data-wp-canopy-result');
  ['main','stage','battle'].forEach(s=>$(`${s}Screen`).hidden=s!==name);
  $('battleContent').inert=false;$('battleContent').hidden=false;$('result').hidden=true;
  $('gameGuide').hidden=name!=='main';$('gameGuide').setAttribute('aria-hidden',String(name!=='main'));
  frame.activate(name);
  if(name==='stage'){selectedStage=unlocked(state.save)-1;renderStages();}
  scene?.setActive(name==='battle');
  updateProgress();window.scrollTo(0,0);
  window.dispatchEvent(new Event('weightplay:stage-sync'));
}
function stageRecord(index){
  const s=STAGES[index],name=labels('mechanics')[s.arc-1],stars=state.save.masteryV26[s.id]||0;
  const done=state.save.completed.includes(s.id),locked=s.id>unlocked(state.save);
  const status=locked?t('lockedStage'):stars?'★'.repeat(stars)+'☆'.repeat(3-stars):done?t('complete'):s.checkpoint?t('checkpoint'):t('readyStage');
  const objective=t('stageObjective',{count:s.phases.length});
  return{id:s.id,kicker:t('round',{number:s.id,total:30}),title:name,subtitle:objective,status,summary:`${name} · ${objective}`,details:[objective,t('selectPrompt'),status],poster:COVER,posterPosition:'center',locked,cleared:done};
}
function renderStages(){
  if(!rail)rail=window.WeightPlayPlayUI.mountStage({page:$('stageContent'),rail:$('stageList'),selected:selectedStage,config:{count:30,poster:COVER,background:'/assets/lobby-block-atmosphere.svg',stage:stageRecord},onSelect:index=>{selectedStage=index;updateProgress();},onStart:startStage,isActive:()=>state.screen==='stage'});
  else rail.refresh(selectedStage);
}
function renderClues(){
  const p=phase();
  for(let i=0;i<3;i++){
    const card=$(`clue${i}`),clue=p.clues[i];card.hidden=!clue;
    card.classList.remove('violated','inspected');
    if(clue){card.querySelector('small').textContent=t('clueLabel',{n:i+1});card.querySelector('p').textContent=clueText(clue);}
  }
  $('clueText').textContent=labels('mechanics')[stage().arc-1];
  $('hint').textContent=t('phaseProgress',{current:state.phase+1,total:stage().phases.length});
}
function renderTrail(){
  $('trail').replaceChildren(...stage().phases.map((_,i)=>{
    const bead=document.createElement('span');bead.className=i<state.trail.length?'trail-lit':i===state.phase?'trail-current':'';
    bead.textContent=i<state.trail.length?dir(state.trail[i]):String(i+1);
    return bead;
  }));
}
function renderBoard(){
  const p=phase();
  $('board').dataset.mode=state.noteMode?'notes':'choose';
  const blocked=!!state.pending;
  for(let i=0;i<8;i++){
    const b=$(`perch${i}`),excluded=state.notes.has(i),chosen=state.selected===i;
    b.classList.toggle('selected',chosen);b.classList.toggle('excluded',excluded);b.classList.toggle('hinted',state.hinted.includes(i));
    b.classList.toggle('lit',blocked&&chosen);
    b.setAttribute('aria-pressed',String(state.noteMode?excluded:chosen));
    b.setAttribute('aria-label',`${dir(i)} · ${labels('seals')[p.seals[i]]}${excluded?' · ×':''}`);
    b.querySelector('.perch-direction').textContent=dir(i);b.querySelector('.perch-symbol').textContent=symbols[p.seals[i]];
    b.dataset.seal=SEALS[p.seals[i]];
  }
  $('notesBtn').setAttribute('aria-pressed',String(state.noteMode));
  $('checkBtn').disabled=blocked||state.selected<0||state.noteMode;
  $('hintBtn').disabled=blocked;
  $('notesBtn').disabled=blocked;
  $('facing').textContent=state.selected<0?'—':dir(state.selected);
  scene?.select(state.selected,[...state.notes],state.hinted,blocked?state.selected:-1);
}
function ensureScene(){
  if(scene)return;
  try{
    scene=createCanopyScene($('scene'),points=>points.forEach((p,i)=>{const b=$(`perch${i}`);b.style.left=`${p.x}px`;b.style.top=`${p.y}px`;}),()=>{$('renderError').hidden=false;$('boardControls').inert=true;syncActivity();});
    scene.setTheme(appearance.theme==='aurora');
  }catch(error){$('renderError').hidden=false;$('boardControls').inert=true;console.error('Canopy renderer unavailable',error);}
}
function startStage(index){
  if(index<0||index>=30||index>=unlocked(state.save))return;
  state.stage=index;state.phase=0;state.selected=-1;state.notes.clear();state.noteMode=false;state.hintIndex=-1;state.hinted=[];state.mistakes=0;state.hints=0;state.trail=[];
  showScreen('battle');ensureScene();
  $('roundLabel').textContent=t('round',{number:index+1,total:30});
  $('badge').textContent='0/'+stage().phases.length;
  $('board').classList.remove('answer-wrong','answer-right');
  renderClues();renderTrail();renderBoard();announce(t('selectPrompt'));
  $('compass').focus({preventScroll:true});sound('game.start');
}
function choose(index){
  if(!isPlaying())return;
  if(state.noteMode){state.notes.has(index)?state.notes.delete(index):state.notes.add(index);announce(t('notePrompt'));}
  else{
    state.selected=index;state.notes.delete(index);announce(`${dir(index)} · ${labels('seals')[phase().seals[index]]}`);sound('board.rotate');
  }
  renderBoard();
}
function check(){
  if(!isPlaying())return;
  if(state.selected<0||state.noteMode){announce(t('chooseFirst'));return;}
  const mismatch=phase().clues.findIndex(clue=>!matches(clue,state.selected,phase(),previous()));
  if(mismatch>=0){
    state.mistakes++;announce(t('wrongDetail',{n:mismatch+1}),'error');
    for(let i=0;i<3;i++)$(`clue${i}`).classList.toggle('violated',i===mismatch);
    $('board').classList.remove('answer-wrong');void $('board').offsetWidth;$('board').classList.add('answer-wrong');
    clearTimeout(feedbackTimer);feedbackTimer=setTimeout(()=>$('board').classList.remove('answer-wrong'),260);sound('feedback.error');return;
  }
  state.pending={direction:state.selected,deadline:performance.now()+(matchMedia('(prefers-reduced-motion: reduce)').matches?160:600)};
  $('board').classList.add('answer-right');announce(t('correct'),'success');renderBoard();sound('feedback.success');syncActivity();
}
function advancePhase(){
  transitionTimer=0;if(!state.pending)return;
  if(modalKind||document.hidden||settingsOpen()){syncActivity();return;}
  state.trail.push(state.pending.direction);state.pending=null;state.phase++;
  $('badge').textContent=`${state.phase}/${stage().phases.length}`;renderTrail();$('board').classList.remove('answer-right');
  if(state.phase===stage().phases.length){finish();return;}
  state.selected=-1;state.notes.clear();state.noteMode=false;state.hinted=[];state.hintIndex=-1;
  renderClues();renderBoard();announce(t('selectPrompt'));
  $('clueCards').classList.remove('clues-enter');void $('clueCards').offsetWidth;$('clueCards').classList.add('clues-enter');
}
function hint(){
  if(!isPlaying())return;
  state.hints++;state.hintIndex=(state.hintIndex+1)%phase().clues.length;
  state.hinted=candidates(phase(),previous(),[phase().clues[state.hintIndex]]);
  for(let i=0;i<3;i++)$(`clue${i}`).classList.toggle('inspected',i===state.hintIndex);
  renderBoard();announce(t('hintDetail',{n:state.hintIndex+1}));sound('feedback.hint');
}
function finish(){
  const stars=rating(state.mistakes,state.hints),s=stage();
  state.save=settle(state.save,s.id,state.mistakes,state.hints);const saved=persist();updateProgress();
  $('resultTitle').textContent=t(`rank${stars}`);
  $('resultText').textContent=s.id===30?t('finaleText'):t('stageClear');
  $('resultStars').textContent='★'.repeat(stars)+'☆'.repeat(3-stars);
  $('resultStars').setAttribute('aria-label',`${stars}/3`);
  $('resultProgress').textContent=t('resultProgress',{count:state.save.completed.length,total:30});
  $('stats').textContent=t('statsDetail',{stars,mistakes:state.mistakes,hints:state.hints});
  $('saveWarning').hidden=saved;$('saveWarning').textContent=t('saveError');
  $('badgeReward').hidden=!s.checkpoint;
  if(s.checkpoint){$('badgeRewardImage').src=`/games/animal-canopy-compass/assets/checkpoint-badges/${badgeFiles[s.arc-1]}.png`;$('badgeRewardImage').alt=t('badge'+s.arc);$('badgeRewardLabel').textContent=t('badgeEarned',{badge:t('badge'+s.arc)});}
  $('resultPrimary').disabled=s.id===30;$('resultPrimary').hidden=false;
  $('battleContent').inert=true;$('battleContent').hidden=true;$('result').hidden=false;
  $('battleBack').disabled=true;document.body.setAttribute('data-wp-canopy-result','');scene?.setActive(false);
  (s.id===30?$('resultHome'):$('resultPrimary')).focus({preventScroll:true});sound('result.win');
}
function openModal(kind){
  if(modalKind)return;modalReturn=document.activeElement;modalKind=kind;
  $('modalTitle').textContent=kind==='help'?t('helpAction'):kind==='shop'?t('collection'):t('back');
  $('modalHelp').hidden=kind!=='help';$('modalShop').hidden=kind!=='shop';$('modalLeave').hidden=kind!=='leave';
  if(kind==='leave'){
    $('leaveText').textContent=t('leaveMessage',{stage:stage().id,phase:state.phase+1});
    $('leaveKeep').textContent=t('continueAction');$('leaveExit').textContent=t('map');
  }
  if(kind==='shop')renderShop();
  $('gameModal').hidden=false;
  const root=$(`${state.screen}Screen`);root.inert=true;syncActivity();
  (kind==='leave'?$('leaveKeep'):$('modalClose')).focus({preventScroll:true});
}
function closeModal(restore=true){
  if(!modalKind)return;$('gameModal').hidden=true;modalKind=null;
  $(`${state.screen}Screen`).inert=false;
  if(restore&&modalReturn?.isConnected)modalReturn.focus({preventScroll:true});
  syncActivity();
}
function renderShop(){
  $('walletBalance').textContent=t('balance',{n:window.WeightPlayWallet?.read().diamonds||0});
  $('classicButton').textContent=t(appearance.theme==='classic'?'equipped':'equip');
  $('auroraButton').textContent=t(appearance.theme==='aurora'?'equipped':appearance.owned?'equip':'buy');
  $('classicButton').disabled=appearance.theme==='classic';$('auroraButton').disabled=appearance.theme==='aurora'||buying;
}
function saveAppearance(next){localStorage.setItem(APPEARANCE_KEY,JSON.stringify(next));appearance=next;scene?.setTheme(next.theme==='aurora');}
async function buyOrEquip(){
  if(buying)return;buying=true;renderShop();
  const transaction=()=>{
    const result=purchaseAurora(localStorage,window.WeightPlayWallet,APPEARANCE_KEY);
    if(result.status==='insufficient'){notify(t('insufficient'));return;}
    appearance=result.appearance;scene?.setTheme(true);
    if(result.status==='purchased')sound('reward.upgrade');
  };
  try{if(navigator.locks)await navigator.locks.request('weightplay-canopy-cosmetic',transaction);else transaction();}
  catch{notify(t('saveError'));}
  finally{buying=false;renderShop();}
}
function buildGuide(){
  const guide=$('gameGuide');guide.querySelector('[data-guide-summary]').textContent=t('summary');
  for(const node of guide.querySelectorAll('[data-copy]'))node.textContent=t(node.dataset.copy);
}
function applyLocale(){
  document.documentElement.lang=state.locale;document.documentElement.dir=state.locale==='ar'?'rtl':'ltr';
  for(const node of document.querySelectorAll('[data-copy]'))node.textContent=t(node.dataset.copy);
  $('localeSelect').value=state.locale;
  for(const id of ['stageBack','battleBack'])$(id).setAttribute('aria-label',t('back'));
  $('battleScreen').setAttribute('aria-label',t('compassLabel'));
  $('board').setAttribute('aria-label',t('directionChoices'));$('compass').setAttribute('aria-label',t('compassLabel'));
  $('boardControls').setAttribute('aria-label',t('directionChoices'));
  $('notesBtn').setAttribute('aria-label',t('notes'));$('hintBtn').setAttribute('aria-label',t('hintAction'));$('helpBtn').setAttribute('aria-label',t('helpAction'));
  $('modalClose').setAttribute('aria-label',t('close'));$('stageScreen').setAttribute('aria-label',t('map'));
  $('mainBack').setAttribute('aria-label',t('lobbyReturn'));
  const route=Object.entries(routes).find(([,l])=>l===state.locale)?.[0]||'en';$('mainBack').href=`/${route}/`;
  buildGuide();updateProgress();frame.refresh();
}

for(let i=0;i<8;i++){
  const b=document.createElement('button');b.type='button';b.id=`perch${i}`;b.className='perch';b.dataset.directionIndex=String(i);
  b.innerHTML='<span class="perch-symbol" aria-hidden="true"></span><span class="perch-direction"></span><span class="perch-cross" aria-hidden="true">×</span>';
  b.addEventListener('click',()=>choose(i));$('boardControls').append(b);
}
$('startBtn').addEventListener('click',()=>showScreen('stage'));
$('stageBack').addEventListener('click',()=>showScreen('main'));
$('battleBack').addEventListener('click',()=>openModal('leave'));
$('checkBtn').addEventListener('click',check);$('hintBtn').addEventListener('click',hint);
$('notesBtn').addEventListener('click',()=>{if(!isPlaying())return;state.noteMode=!state.noteMode;renderBoard();announce(t(state.noteMode?'notePrompt':'selectPrompt'));});
$('helpBtn').addEventListener('click',()=>openModal('help'));
$('collectionBtn').addEventListener('click',()=>openModal('shop'));
$('modalClose').addEventListener('click',()=>closeModal());
$('leaveKeep').addEventListener('click',()=>closeModal());
$('leaveExit').addEventListener('click',()=>{closeModal(false);$('battleBack').disabled=false;showScreen('stage');});
$('classicButton').addEventListener('click',()=>{try{saveAppearance({...appearance,theme:'classic'});renderShop();}catch{notify(t('saveError'));}});
$('auroraButton').addEventListener('click',buyOrEquip);
$('resultMap').addEventListener('click',()=>{$('battleBack').disabled=false;showScreen('stage');});
$('resultHome').addEventListener('click',()=>{$('battleBack').disabled=false;startStage(state.stage);});
$('resultPrimary').addEventListener('click',()=>{if(stage().id<30){$('battleBack').disabled=false;startStage(state.stage+1);}});
$('renderRetry').addEventListener('click',()=>location.reload());
$('scene').addEventListener('canopy-render-restored',()=>{$('renderError').hidden=true;$('boardControls').inert=false;renderBoard();syncActivity();});
document.addEventListener('keydown',event=>{
  const dialog=modalKind?$('gameModal'):!$('result').hidden?$('result'):null;
  if(dialog){
    if(event.key==='Escape'&&modalKind){event.preventDefault();closeModal();}
    if(event.key==='Tab'){
      const targets=[...dialog.querySelectorAll('button:not(:disabled),a[href]')].filter(n=>n.getClientRects().length);
      const current=targets.indexOf(document.activeElement),next=(current+(event.shiftKey?-1:1)+targets.length)%targets.length;
      event.preventDefault();targets[next]?.focus();
    }return;
  }
  if(!isPlaying()||event.altKey||event.ctrlKey||event.metaKey)return;
  if(event.key.startsWith('Arrow')){
    if(document.activeElement?.closest('.wp-frame-utility'))return;
    event.preventDefault();const delta=event.key==='ArrowRight'||event.key==='ArrowDown'?1:-1;
    choose(state.selected<0?(delta>0?0:7):wrap(state.selected+delta));
  }else if((event.key==='Enter'&&document.activeElement?.closest('#board'))||(event.key===' '&&document.activeElement===$('compass'))){event.preventDefault();check();}
});
document.addEventListener('visibilitychange',syncActivity);
const settingsObserver=new MutationObserver(syncActivity);settingsObserver.observe($('app'),{subtree:true,attributes:true,attributeFilter:['aria-expanded']});
window.addEventListener('storage',event=>{
  if(event.key===CAMPAIGN_KEY){state.save=normalizeSave(read(CAMPAIGN_KEY,state.save));updateProgress();if(state.screen==='stage')rail?.refresh(selectedStage);}
  if(event.key===APPEARANCE_KEY){const saved=read(APPEARANCE_KEY,appearance);if(saved?.owned===true)appearance={owned:true,theme:saved.theme==='aurora'?'aurora':'classic'};scene?.setTheme(appearance.theme==='aurora');if(modalKind==='shop')renderShop();}
  if(modalKind==='shop'&&event.key===window.WeightPlayWallet?.key)renderShop();
});
window.addEventListener('pagehide',event=>{
  if(event.persisted){scene?.setActive(false);clearTimeout(transitionTimer);transitionTimer=0;audio?.stop();return;}
  clearPending();clearTimeout(feedbackTimer);clearTimeout(notify.timer);settingsObserver.disconnect();rail?.destroy();scene?.dispose();audio?.dispose();
});
window.addEventListener('pageshow',event=>{if(event.persisted)syncActivity();});

frame=window.WeightPlayScreenFrame.mount({root:$('app'),localeSelect:$('localeSelect'),scenes:{main:{root:$('mainScreen'),header:$('mainHeader'),content:$('mainContent')},stage:{root:$('stageScreen'),header:$('stageHeader'),content:$('stageContent')},battle:{root:$('battleScreen'),header:$('battleHeader'),content:$('battleContent'),headerInfo:$('battleHeaderInfo')}},playUI:true});
function stat(label,id){const node=document.createElement('div'),caption=document.createElement('small'),value=document.createElement('strong');caption.dataset.copy=label;value.id=id;node.append(caption,value);return node;}
frame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add(stat('stageSections','stageSelectionValue')).add(stat('complete','stageCompletionValue')));
const battleGroup=window.WeightPlayScreenFrame.createGroup();[...$('battleHeaderInfo').children].forEach(n=>battleGroup.add(n));frame.battleTopUI.add(battleGroup);
const collectionButton=$('collectionBtn'),stageTab=$('stageTab');
frame.commonDownButton.clear().add(collectionButton).add(stageTab);
// Shared loader waits for actual Main image decoding and the rendered Start.
$('app').hidden=false;showScreen('main');applyLocale();
function mainImageReady(img){
  return new Promise((resolve,reject)=>{
    const clear=()=>{img.removeEventListener('load',loaded);img.removeEventListener('error',failed);};
    const loaded=()=>{clear();resolve();};
    const failed=()=>{clear();reject(new Error('Main image unavailable'));};
    if(img.complete){img.naturalWidth>0?resolve():failed();return;}
    img.addEventListener('load',loaded);img.addEventListener('error',failed);
  });
}
// Bootstrap may replace the poster source while it is loading. Listen for the
// current image's actual load instead of treating an aborted old decode as failure.
Promise.all([...$('mainScreen').querySelectorAll('img')].map(mainImageReady)).then(()=>{requestAnimationFrame(()=>{$('loadingPanel').hidden=true;});}).catch(()=>{
  $('loadingPanel').classList.add('has-error');
  $('loadingPanel').textContent=t('renderError');
  const retry=document.createElement('button');retry.textContent=t('retryAction');retry.addEventListener('click',()=>location.reload());$('loadingPanel').append(retry);
});
