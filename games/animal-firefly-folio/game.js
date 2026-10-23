import {pages,DIRECTIONS,VECTORS,ARROWS,SIGNPOSTS,cellsFor,initialRun,trace,solve,normalizeProgress} from './campaign.mjs?v=20261023-rebuild12';
import {entryCopy} from './copy.mjs?v=20261023-rebuild12';
import {readCollection,buyAurora,equipAurora} from './collection.mjs?v=20261023-rebuild12';

const $=id=>document.getElementById(id);
const base=window.ANIMAL_FIREFLY_FOLIO_LOCALES||{};
const progressKey='weightplay-animal-firefly-folio-progress-v1';
const recordsKey='weightplay-animal-firefly-folio-routes-v12';
const asset='/games/animal-firefly-folio/assets/';
const readJSON=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||'null')||fallback;}catch{return fallback;}};
const progress=normalizeProgress(readJSON(progressKey,{}));
const recordData=readJSON(recordsKey,{});
const records=recordData&&typeof recordData==='object'&&!Array.isArray(recordData)?recordData:{};
const canonicalLocale=value=>Object.keys(base).find(key=>key.toLowerCase()===String(value).toLowerCase())||'en';
const state={...progress,locale:canonicalLocale(window.WonderI18n?.actualLocale?.()||document.documentElement.lang),page:0,route:[],screen:'main',running:false,cursor:0,current:null,failedStep:-1,hints:0,saveFailed:false};
let frame,stageController,stageBrowseIndex=Math.max(0,state.unlocked-1),syncStageInfo=()=>{},animation=0,lastTime=0,elapsed=0,frames=[],outcome=null,dialog=null,returnFocus=null,purchasing=false;
let collection=readCollection(localStorage);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const audio=window.WeightPlayAudio?.createScope();
const sounds=['game.start','board.move','board.undo','movement.step','reward.collect','mechanism.unlock','feedback.error','feedback.hint','result.win','shop.purchase'];
window.WeightPlayAudio?.preload(sounds);
const sound=id=>audio?.play(id);
const copy=()=>entryCopy(state.locale);
const t=(key,vars={})=>{
  let value=copy()[key]||base[state.locale]?.[key]||base.en?.[key]||key;
  if(typeof value!=='string')return value;
  for(const [name,replacement]of Object.entries(vars))value=value.replaceAll('{'+name+'}',String(replacement));
  return value;
};
const pageTitle=(page,index)=>page.names[state.locale]||((state.locale==='zh-Hans')?copy().arcs[page.arc]+' '+(index+1):copy().arcs[page.arc]+' '+(index+1));
const pageNote=page=>copy().rules[page.arc];
const activePage=()=>pages[state.page];
const settingsOpen=()=>Boolean(document.querySelector('.wp-frame-popover:not([hidden])'));
const blocked=()=>state.screen!=='battle'||dialog||settingsOpen()||document.hidden;
const ease=(node,kind='pop')=>{
  if(!node)return;
  node.getAnimations().forEach(a=>a.cancel());
  const frames=reduced.matches?[{opacity:.65},{opacity:1}]:kind==='enter'?[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}]:[{filter:'brightness(1.7)'},{filter:'brightness(1)'}];
  node.animate(frames,{duration:reduced.matches?80:180,easing:'ease-out'});
};
function status(text,kind='normal'){$('battleStatus').textContent=text;$('battleStatus').dataset.kind=kind;}
function stopRun(){cancelAnimationFrame(animation);animation=0;state.running=false;lastTime=0;elapsed=0;audio?.stop();document.querySelectorAll('.collect-flight').forEach(n=>n.remove());}
function cancelEffects(){document.querySelectorAll('#battleScreen *,#stageScreen .folio-modal *').forEach(n=>n.getAnimations().forEach(a=>a.cancel()));document.querySelectorAll('.collect-flight').forEach(n=>n.remove());}
function save(){
  try{
    const incoming=normalizeProgress(readJSON(progressKey,{}));
    state.cleared=[...new Set([...incoming.cleared,...state.cleared])].sort((a,b)=>a-b);state.unlocked=Math.max(incoming.unlocked,state.unlocked);
    localStorage.setItem(progressKey,JSON.stringify({...incoming,cleared:state.cleared,unlocked:state.unlocked}));
    const previous=readJSON(recordsKey,{});
    for(const p of pages){const best=Number(previous?.[p.id]?.best);if(best>0&&Number.isFinite(best))records[p.id]={solved:true,best:Math.min(best,Number(records[p.id]?.best)||Infinity)};}
    localStorage.setItem(recordsKey,JSON.stringify(records));state.saveFailed=false;return true;
  }
  catch{state.saveFailed=true;return false;}
}
function renderMain(){$('mainProgress').textContent=t('stages')+' · '+state.cleared.length+' / '+pages.length;}
function renderStages(){stageController?.refresh(stageBrowseIndex);syncStageInfo();}
function show(screen){
  stopRun();closeDialog(false);cancelEffects();state.screen=screen;
  const owner=screen==='result'?'battle':screen;
  for(const name of ['main','stage','battle']){const node=$(name+'Screen');node.hidden=name!==owner;node.inert=name!==owner;node.setAttribute('aria-hidden',String(name!==owner));}
  const result=$('resultScreen');result.hidden=screen!=='result';result.inert=screen!=='result';result.setAttribute('aria-hidden',String(screen!=='result'));
  const live=$('battleScreen').querySelector('.battle-content');live.hidden=screen==='result';live.inert=screen==='result';
  frame.activate(owner,{covered:screen==='result'});document.body.dataset.screen=owner;
  if(screen==='main')renderMain();
  if(screen==='stage')renderStages();
  ease(screen==='result'?result:$(screen+'Screen').querySelector('.battle-content'),'enter');
}
function applyLocale(){
  document.documentElement.lang=state.locale;document.documentElement.dir=state.locale==='ar'?'rtl':'ltr';
  const replacements={intro:'intro',guideStep1:'intro',guideStep2:'ready',guideStep3:'missing',guideResultsText:'progress',guideTipsText:'keys'};
  document.querySelectorAll('[data-copy]').forEach(node=>node.textContent=t(replacements[node.dataset.copy]||node.dataset.copy));
  document.querySelectorAll('[data-copy-aria]').forEach(node=>node.setAttribute('aria-label',t(node.dataset.copyAria)));
  document.querySelectorAll('[data-copy-alt]').forEach(node=>node.alt=t(node.dataset.copyAlt));
  $('localeSelect').value=state.locale;
  $('planTitle').textContent=t('plan');$('checkBtn').textContent=t('run');
  $('route').setAttribute('aria-label',t('plan'));
  $('undoBtn').setAttribute('aria-label',t('undo'));$('clearBtn').setAttribute('aria-label',t('clear'));
  $('hintBtn').setAttribute('aria-label',t('hint'));$('helpBtn').setAttribute('aria-label',t('help'));
  $('studioBtn').textContent=t('studio');
  for(const direction of DIRECTIONS){const button=$('direction-'+direction);button.setAttribute('aria-label',t(direction));button.querySelector('strong').textContent=t(direction);}
  renderMain();if(state.screen==='stage')renderStages();if(state.screen==='battle'){renderHeader();renderPlan();status(t('ready'));}
}
function renderHeader(){
  const p=activePage(),total=cellsFor(p).filter(c=>c.tile==='*'||/[12]/.test(c.tile)).length;
  $('roundName').textContent=p.id+' / '+pages.length;
  $('roundName').setAttribute('aria-label',pageTitle(p,state.page));
  $('roundLabel').replaceChildren(makeImage('firefly',''),document.createTextNode(' '+(state.current?.collected.length||0)+' / '+total));
  $('turnCount').textContent=(state.running?state.cursor:state.route.length)+' / '+p.budget;
  $('routeNote').textContent=pageNote(p);
  $('arcLabel').textContent=copy().arcs[p.arc];
  $('keyBadge').hidden=!p.board.some(row=>row.includes('K'));
  $('keyBadge').classList.toggle('has-key',Boolean(state.current?.key));
}
function makeImage(name,alt=''){const img=document.createElement('img');img.src=asset+name+'-v12.webp';img.alt=alt;img.draggable=false;return img;}
function drawBoard(){
  const p=activePage();$('board').dataset.arc=p.arc;$('board').classList.toggle('aurora',collection.equipped);
  $('boardCells').replaceChildren(...cellsFor(p).map(cell=>{
    const node=document.createElement('div');node.className='map-cell';node.dataset.cell=cell.id;node.dataset.tile=cell.tile;
    if(cell.tile==='#')node.append(makeImage('stone'));
    if(cell.tile==='L')node.append(makeImage('lantern'));
    if(cell.tile==='K')node.append(makeImage('key'));
    if(cell.tile==='*'||/[12]/.test(cell.tile)){node.append(makeImage('firefly'));if(/[12]/.test(cell.tile)){const label=document.createElement('span');label.className='beacon-number';label.textContent=cell.tile;node.append(label);}}
    if(SIGNPOSTS[cell.tile]){const arrow=document.createElement('span');arrow.className='map-sign';arrow.textContent=ARROWS[SIGNPOSTS[cell.tile]];node.append(arrow);}
    if(cell.tile==='D'){node.append(makeImage('key'));node.classList.add('gate-cell');}
    if(cell.tile==='~'){const mark=document.createElement('span');mark.className='one-use';mark.textContent='1×';node.append(mark);}
    const kind=({'#':t('stone'),L:t('lantern'),K:t('key'),D:t('gate'),S:'Mica','*':t('firefly'),'1':t('firefly')+' 1','2':t('firefly')+' 2','~':copy().rules[4]})[cell.tile]||(SIGNPOSTS[cell.tile]?t(SIGNPOSTS[cell.tile]):t('path'));
    node.setAttribute('role','listitem');node.setAttribute('aria-label',(cell.x+1)+','+(cell.y+1)+' · '+kind);return node;
  }));
  $('mapBoardLabel').textContent=pageTitle(p,state.page);
  renderWorld();
}
function renderWorld(){
  if(!state.current)return;
  const p=activePage();
  for(const node of $('boardCells').children){const id=Number(node.dataset.cell);node.classList.toggle('collected',state.current.collected.includes(id)||node.dataset.tile==='K'&&state.current.key);node.classList.toggle('collapsed',state.current.collapsed.includes(id));node.classList.toggle('gate-open',node.dataset.tile==='D'&&state.current.key);}
  $('mica').style.setProperty('--x',state.current.x);$('mica').style.setProperty('--y',state.current.y);
  $('mica').classList.toggle('walking',state.running);renderHeader();
  const visible=state.running?frames.slice(0,state.cursor):trace(p,state.route).frames;
  const start=initialRun(p);const points=[start,...visible.map(f=>f.state)].map(s=>(s.x*100+50)+','+(s.y*100+50)).join(' ');
  $('routeLine').setAttribute('points',points);$('routeLine').classList.toggle('planned',!state.running);
}
function renderPlan(){
  const p=activePage();
  for(let i=0;i<12;i++){const node=$('command-'+i);node.querySelector('b').textContent=ARROWS[state.route[i]]||'·';node.classList.toggle('filled',i<state.route.length);node.classList.toggle('unavailable',i>=p.budget);node.classList.toggle('executing',state.running&&i===state.cursor);node.classList.toggle('failed',i===state.failedStep);node.disabled=state.running||i>=state.route.length;node.setAttribute('aria-label',t('undo')+' '+(i+1)+(state.route[i]?' · '+t(state.route[i]):''));}
  for(const direction of DIRECTIONS)$('direction-'+direction).disabled=state.running||state.route.length>=p.budget;
  $('checkBtn').disabled=state.running||!state.route.length;$('undoBtn').disabled=state.running||!state.route.length;$('clearBtn').disabled=state.running||!state.route.length;$('hintBtn').disabled=state.running;
  renderWorld();
}
function editRoute(){state.failedStep=-1;state.current=initialRun(activePage());$('mica').classList.remove('arrived');$('board').classList.remove('route-error');}
function chooseDirection(direction){if(blocked()||state.running)return;if(state.route.length>=activePage().budget){sound('feedback.error');ease($('program'));return;}editRoute();state.route.push(direction);sound('board.move');renderPlan();ease($('command-'+(state.route.length-1)));status(t('ready'));}
function undo(index=state.route.length-1){if(blocked()||state.running||!state.route.length)return;editRoute();state.route.splice(index);sound('board.undo');renderPlan();status(t('ready'));ease($('program'));}
function startPage(index){
  if(!Number.isInteger(index)||index<0||index>=state.unlocked||index>=pages.length)return;
  state.page=index;stageBrowseIndex=index;state.route=[];state.failedStep=-1;state.hints=0;state.current=initialRun(pages[index]);
  show('battle');drawBoard();renderPlan();status(t('ready'));sound('game.start');$('direction-north').focus({preventScroll:true});
}
function collectFlight(frame){
  if(!frame.collected&&!frame.key)return;
  const source=$('boardCells').children[frame.state.y*5+frame.state.x],target=frame.key?$('keyBadge'):$('roundLabel');
  const from=source.getBoundingClientRect(),to=target.getBoundingClientRect();
  ease(target);if(reduced.matches)return;
  const img=makeImage(frame.key?'key':'firefly');img.className='collect-flight';
  img.style.left=(from.left+from.width/2-18)+'px';img.style.top=(from.top+from.height/2-18)+'px';document.body.append(img);
  const effect=img.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:'translate('+(to.left+to.width/2-from.left-from.width/2)+'px,'+(to.top+to.height/2-from.top-from.height/2)+'px) scale(.4)',opacity:.2}],{duration:300,easing:'ease-in'});
  effect.finished.then(()=>img.remove(),()=>img.remove());
}
function failRun(){
  state.running=false;animation=0;state.failedStep=outcome.failedStep??-1;
  const reason=outcome.error==='gate'?copy().rules[1]:outcome.error==='wind'?copy().rules[2]:outcome.error==='order'?copy().rules[3]:outcome.error==='fragile'?copy().rules[4]:outcome.error?t('blocked'):t('missing');
  status((state.failedStep>=0?(state.failedStep+1)+' · ':'')+reason,'error');
  $('board').classList.add('route-error');sound('feedback.error');renderPlan();ease($('command-'+state.failedStep));$('undoBtn').focus({preventScroll:true});
}
function settle(){
  const p=activePage();const first=!state.cleared.includes(state.page);
  if(first)state.cleared.push(state.page);
  state.cleared.sort((a,b)=>a-b);state.unlocked=Math.max(state.unlocked,Math.min(pages.length,state.page+2));
  const old=records[p.id];const best=Number(old?.best);records[p.id]={best:best>0?Math.min(best,state.route.length):state.route.length,solved:true};
  const saved=save();show('result');
  $('resultTitle').textContent=t('complete');
  $('resultText').textContent=t('result',{count:state.cleared.length,total:pages.length,steps:state.route.length});
  $('resultBest').textContent=t('best')+' · '+records[p.id].best+'  '+(saved?t('saved'):t('saveError'));
  $('resultMapBtn').textContent=t('map');$('resultPrimaryBtn').textContent=t('next');$('resultReplayBtn').textContent=t('replay');
  $('resultPrimaryBtn').disabled=state.page>=pages.length-1;
  window.ShowResultGet?.('animal-firefly-folio',false);
  if(saved)window.WonderAnalytics?.completeStage?.(p.id);
  sound('result.win');$('resultPrimaryBtn').disabled?$('resultReplayBtn').focus({preventScroll:true}):$('resultPrimaryBtn').focus({preventScroll:true});
}
function tick(time){
  if(!state.running)return;
  if(blocked()){lastTime=0;animation=requestAnimationFrame(tick);return;}
  if(!lastTime)lastTime=time;
  elapsed+=Math.min(time-lastTime,60);lastTime=time;
  const stepDuration=reduced.matches?110:320;
  if(elapsed>=stepDuration){elapsed=0;
    if(state.cursor<frames.length){const next=frames[state.cursor];state.current=next.state;state.cursor++;renderWorld();renderPlan();collectFlight(next);sound(next.collected?'reward.collect':next.key?'mechanism.unlock':'movement.step');}
    else if(outcome.complete){settle();return;}else{failRun();return;}
  }
  animation=requestAnimationFrame(tick);
}
function run(){if(blocked()||state.running||!state.route.length)return;state.current=initialRun(activePage());state.failedStep=-1;state.cursor=0;outcome=trace(activePage(),state.route);frames=outcome.frames;state.running=true;lastTime=0;elapsed=-100;status(t('running'));renderPlan();animation=requestAnimationFrame(tick);}
function hint(){if(blocked()||state.running)return;const solution=solve(activePage(),state.route);state.hints++;sound('feedback.hint');status(solution? (state.route.length>=solution.length?t('run'):t('hint')+' · '+ARROWS[solution[state.route.length]]+' '+t(solution[state.route.length])):t('hintReset'));ease($('battleStatus'));}
function closeDialog(restore=true){if(!dialog)return;const old=dialog;dialog=null;old.remove();const owner=$(state.screen==='stage'?'stageScreen':'battleScreen');[...owner.children].forEach(node=>{if(node!==$('resultScreen'))node.inert=false;});if(restore)returnFocus?.focus({preventScroll:true});lastTime=0;}
function openDialog(title,build,scene=state.screen){
  if(dialog)return;returnFocus=document.activeElement;const owner=$(scene+'Screen');
  dialog=document.createElement('section');dialog.className='folio-modal';dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-labelledby','folioDialogTitle');
  dialog.innerHTML='<div class="folio-modal-card"><h2 id="folioDialogTitle"></h2><div class="folio-modal-body"></div><button class="secondary-btn modal-close" type="button"></button></div>';
  dialog.querySelector('h2').textContent=title;const close=dialog.querySelector('.modal-close');close.textContent=t('close');close.addEventListener('click',()=>closeDialog());
  [...owner.children].forEach(node=>node.inert=true);owner.append(dialog);build(dialog.querySelector('.folio-modal-body'));ease(dialog.querySelector('.folio-modal-card'),'enter');dialog.querySelector('button')?.focus({preventScroll:true});lastTime=0;
}
function leave(){if(!state.route.length&&!state.running){show('stage');return;}openDialog(t('map'),body=>{
  const text=document.createElement('p');text.textContent=t('leave');body.append(text);
  const stay=document.createElement('button');stay.className='primary-btn';stay.textContent=t('cancel');stay.onclick=()=>closeDialog();
  const go=document.createElement('button');go.className='secondary-btn';go.textContent=t('map');go.onclick=()=>show('stage');body.append(stay,go);
});}
function help(){openDialog(t('help'),body=>{
  const intro=document.createElement('p');intro.textContent=t('intro');body.append(intro);
  const list=document.createElement('ol');copy().rules.forEach((rule,i)=>{const row=document.createElement('li');if(i===0)row.append(makeImage('firefly'));if(i===1)row.append(makeImage('key'));row.append(document.createTextNode(rule));list.append(row);});body.append(list);
  const keyboard=document.createElement('p');keyboard.textContent=t('keys');body.append(keyboard);
});}
function studio(){
  openDialog(t('studio'),body=>{
    const image=makeImage('lantern');image.className='studio-art';body.append(image);
    const name=document.createElement('h3');name.textContent=t('aurora');body.append(name);
    const description=document.createElement('p');description.textContent=t('cosmetic');body.append(description);
    const balance=document.createElement('p');balance.className='wallet-balance';const diamond=document.createElement('img');diamond.src='/assets/weightplay-diamond.svg';diamond.alt='';balance.append(diamond,document.createTextNode(t('balance')+' · '+(window.WeightPlayWallet?.read().diamonds||0)));body.append(balance);
    const preview=document.createElement('div');preview.className='trail-preview aurora';preview.setAttribute('aria-hidden','true');body.append(preview);
    const message=document.createElement('p');message.className='studio-message';message.setAttribute('role','status');body.append(message);
    const action=document.createElement('button');action.className='primary-btn';body.append(action);
    const classic=document.createElement('button');classic.className='secondary-btn';classic.textContent=t('classic');body.append(classic);
    const refresh=()=>{collection=readCollection(localStorage);action.textContent=collection.owned?(collection.equipped?t('equipped'):t('equip')):t('buy');action.disabled=purchasing||collection.equipped;classic.disabled=!collection.equipped;balance.lastChild.textContent=t('balance')+' · '+(window.WeightPlayWallet?.read().diamonds||0);};
    classic.onclick=()=>{try{equipAurora(localStorage,false);refresh();message.textContent=t('saved');ease(preview);}catch{message.textContent=t('saveError');}};
    action.onclick=async()=>{
      if(purchasing)return;
      collection=readCollection(localStorage);
      if(collection.owned){try{equipAurora(localStorage,true);refresh();message.textContent=t('saved');ease(preview);}catch{message.textContent=t('saveError');}return;}
      if(action.dataset.confirm!=='true'){action.dataset.confirm='true';action.textContent=t('confirm');message.textContent=t('cosmetic');return;}
      purchasing=true;action.disabled=true;
      const purchase=()=>buyAurora(localStorage,window.WeightPlayWallet);
      try{
        const result=navigator.locks?await navigator.locks.request('firefly-aurora-purchase',purchase):purchase();
        message.textContent=result.ok?t('saved'):result.reason==='balance'?t('balance')+' < 12':t('saveError');
        if(result.ok){sound('shop.purchase');ease(preview);}else sound('feedback.error');
      }catch{message.textContent=t('saveError');}
      finally{purchasing=false;action.dataset.confirm='false';refresh();}
    };refresh();
  },'stage');
}
// Persistent input nodes preserve keyboard focus and rapid-input ownership.
for(let i=0;i<12;i++){const node=document.createElement('button');node.id='command-'+i;node.className='command-slot';node.type='button';node.innerHTML='<small>'+(i+1)+'</small><b>·</b>';node.addEventListener('click',()=>undo(i));$('route').append(node);}
for(const direction of DIRECTIONS){const node=document.createElement('button');node.type='button';node.id='direction-'+direction;node.className='direction-btn direction-'+direction;node.innerHTML='<span class="direction-icon" aria-hidden="true"></span><strong></strong>';node.addEventListener('click',()=>chooseDirection(direction));$('directionGrid').append(node);}
$('startBtn').onclick=()=>{stageBrowseIndex=Math.max(0,state.unlocked-1);show('stage');};
$('stageBackBtn').onclick=()=>show('main');$('battleBackBtn').onclick=leave;
$('checkBtn').onclick=run;$('undoBtn').onclick=()=>undo();$('clearBtn').onclick=()=>undo(0);$('hintBtn').onclick=hint;$('helpBtn').onclick=help;
$('resultMapBtn').onclick=()=>{stageBrowseIndex=state.page;show('stage');};$('resultPrimaryBtn').onclick=()=>startPage(state.page+1);$('resultReplayBtn').onclick=()=>startPage(state.page);
const mounted=window.mountAnimalFireflyFolioFrame({pages,state,t,pageTitle,pageNote,getSelectedStage:()=>stageBrowseIndex,setSelectedStage:index=>{stageBrowseIndex=index;},getStageInfo:()=>({label:t('stages'),progress:state.cleared.length+' / '+pages.length}),startPage,attachStageUI:value=>{stageController=value;}});
frame=mounted.frame;syncStageInfo=mounted.syncStageInfo;
const studioButton=document.createElement('button');studioButton.id='studioBtn';studioButton.type='button';studioButton.onclick=studio;frame.commonDownButton.add(studioButton);
$('localeSelect').addEventListener('change',event=>{state.locale=canonicalLocale(event.target.value);applyLocale();});
window.addEventListener('wonder:locale-change',event=>{const locale=canonicalLocale(event.detail?.actualLocale||event.detail?.locale);if(locale!==state.locale){state.locale=locale;applyLocale();}});
document.addEventListener('keydown',event=>{
  if(event.defaultPrevented)return;
  const modal=dialog||(state.screen==='result'?$('resultScreen'):null);
  if(modal){
    if(event.key==='Escape'&&dialog){event.preventDefault();closeDialog();return;}
    if(event.key==='Tab'){const buttons=[...modal.querySelectorAll('button:not(:disabled)')];const first=buttons[0],last=buttons.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}
    return;
  }
  if(blocked()||event.repeat||event.altKey||event.metaKey||event.ctrlKey||/INPUT|SELECT|TEXTAREA/.test(event.target.tagName))return;
  const direction={ArrowUp:'north',ArrowRight:'east',ArrowDown:'south',ArrowLeft:'west',w:'north',d:'east',s:'south',a:'west'}[event.key];
  if(direction){event.preventDefault();chooseDirection(direction);}else if(event.key==='Backspace'){event.preventDefault();undo();}else if(event.key==='Enter'&&(!event.target.closest('button')||event.target.closest('#directionGrid,#route'))){event.preventDefault();run();}else if(event.key==='Escape'){event.preventDefault();leave();}
});
document.addEventListener('visibilitychange',()=>{lastTime=0;if(document.hidden){audio?.stop();cancelEffects();}});
window.addEventListener('weightplay:interaction-state',()=>{lastTime=0;if(settingsOpen())audio?.stop();});
window.addEventListener('pagehide',event=>{stopRun();cancelEffects();if(!event.persisted)audio?.dispose();});
window.addEventListener('pageshow',event=>{if(event.persisted&&state.screen==='battle'){editRoute();renderPlan();status(t('ready'));}});
window.addEventListener('storage',event=>{if(event.key===progressKey){const incoming=normalizeProgress(readJSON(progressKey,{}));state.cleared=[...new Set([...state.cleared,...incoming.cleared])];state.unlocked=Math.max(state.unlocked,incoming.unlocked);if(state.screen==='stage')renderStages();}collection=readCollection(localStorage);});
applyLocale();show('main');
