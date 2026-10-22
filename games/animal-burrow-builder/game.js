import {LEVELS,coordinate} from './levels.mjs';
import {TOOLS,SAVE_KEY,createRun,inspectBuild,build,undo,progress,normalizeSave,recordCompletion,unlocked} from './core.mjs';
import {COPY,currentLocale,levelName} from './copy.mjs';
import {stageConfig} from './stage-config.mjs';
import {BurrowRenderer} from './renderer.mjs';
import {LocalPractice} from '../../src/game-local-practice.mjs';

const $=id=>document.getElementById(id),locale=currentLocale(),c=COPY[locale],tools=Object.keys(TOOLS);
const abort=new AbortController(),listen=(node,event,fn)=>node.addEventListener(event,fn,{signal:abort.signal});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let save,storageOK=true;
try{save=normalizeSave(JSON.parse(localStorage.getItem(SAVE_KEY)||'null'));}catch{save=normalizeSave(null);storageOK=false;}
let screen='main',run=null,levelIndex=unlocked(save),selected='bed',focused=12,renderer=null,stageUI=null,modal=null,restoreFocus=null,finished=false,practice=false,starting=false;
let hintCell=null,graphicReady=false;
const audio=window.WeightPlayAudio.createScope();
const effects=['game.start','board.move','board.undo','feedback.error','feedback.hint','reward.collect','result.win','shop.purchase'];
void window.WeightPlayAudio.preload(effects);
document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.title=`${c.title} | WeightPlay`;
function syncSharedLocale(){if(window.WonderI18n?.actualLocale?.()!==locale)window.WonderI18n?.setLocale(locale,{navigate:false});document.documentElement.dir=locale==='ar'?'rtl':'ltr';frame?.refresh();}
listen(window,'wonder:i18n-ready',syncSharedLocale);
document.querySelectorAll('[data-copy]').forEach(node=>node.textContent=c[node.dataset.copy]);
document.querySelectorAll('[data-copy-aria]').forEach(node=>node.setAttribute('aria-label',c[node.dataset.copyAria]));
document.querySelector('[data-wp-return="main"]').setAttribute('aria-label',`${c.back} · WeightPlay`);
$('gameGuide').setAttribute('aria-label',`${c.title} · ${c.how}`);
$('guideCopy').replaceChildren(...[...c.rules,c.keyboard].map(line=>{const p=document.createElement('p');p.textContent=line;return p;}));
$('cellGrid').setAttribute('aria-label',`${c.plan} · ${c.keyboard}`);$('toolShelf').setAttribute('aria-label',c.selected);

const sceneSpec=name=>({root:$(name+'View'),header:$(name+'Header'),content:$(name==='main'?'mainContent':name==='stage'?'stageWorkspace':'battleContent')});
const frame=window.WeightPlayScreenFrame.mount({root:$('app'),playUI:true,scenes:{main:sceneSpec('main'),stage:sceneSpec('stage'),battle:sceneSpec('battle')}});
syncSharedLocale();
const stageInfo=document.createElement('span'),battleInfo=document.createElement('span'),materialInfo=document.createElement('span');
frame.stageTopUI.add(stageInfo);const battleGroup=window.WeightPlayScreenFrame.createGroup();battleGroup.add(battleInfo).add(materialInfo);frame.battleTopUI.add(battleGroup);
const stagesTab=document.createElement('button'),workshopTab=document.createElement('button');
stagesTab.type=workshopTab.type='button';stagesTab.textContent=c.stages;workshopTab.textContent=c.workshop;
stagesTab.dataset.wpFrameAction=workshopTab.dataset.wpFrameAction='tab';
stagesTab.dataset.wpFrameStageSlot='stages';workshopTab.dataset.wpFrameStageSlot='equipment';
frame.commonDownButton.add(stagesTab).add(workshopTab);

function warnStorage(){storageOK=false;$('saveStatus').textContent=c.saveError;$('saveStatus').hidden=false;}
function persist(){if(practice)return;try{localStorage.setItem(SAVE_KEY,JSON.stringify(save));storageOK=true;}catch{warnStorage();}}
function updateProgress(){const count=save.records.filter(Boolean).length,stars=save.records.reduce((n,r)=>n+(r?.stars||0),0);$('mainProgress').textContent=`${c.progressLabel} ${count}/30 · ${stars}/90 ★`;stageInfo.textContent=`${count}/30 · ${stars}/90 ★`;}
function feedback(text,error=false){$('feedback').textContent=text;$('feedback').classList.toggle('is-error',error);}
function config(){return stageConfig({locale,save,practice});}
function setScene(name){
  stageUI?.cancel();audio.stop();screen=name;
  for(const key of ['main','stage','battle'])$(key+'View').hidden=key!==name;
  $('gameGuide').hidden=name!=='main';$('saveStatus').hidden=storageOK||practice;if(!storageOK)$('saveStatus').textContent=c.saveError;
  frame.activate(name);renderer?.setActive(name==='battle'&&!document.hidden);updateProgress();
  if(name==='stage'){showStagePage(false);stageUI?.refresh(levelIndex);}
}
function showStagePage(shop){
  stageUI?.cancel();$('stagePage').hidden=shop;$('workshopPage').hidden=!shop;
  $('stagePage').classList.toggle('hidden',shop);
  stagesTab.setAttribute('aria-pressed',String(!shop));workshopTab.setAttribute('aria-pressed',String(shop));
  if(shop){initializeGraphics();refreshShop();}else stageUI?.refresh(levelIndex);
}
function openModal(id){
  restoreFocus=document.activeElement;modal=id;$(id).hidden=false;
  $(screen==='battle'?'battleContent':'stageWorkspace').inert=true;
  frame.activate(screen,{covered:true});
  document.querySelector('#stageView [data-wp-frame-nav]').inert=screen==='stage';
  if(id!=='resultView')renderer?.setActive(false);
  $(id).querySelector('button:not(:disabled)')?.focus({preventScroll:true});
}
function closeModal({restore=true}={}){
  if(!modal)return;$(modal).hidden=true;modal=null;
  $('battleContent').inert=false;$('stageWorkspace').inert=false;
  document.querySelector('#stageView [data-wp-frame-nav]').inert=false;
  frame.activate(screen);renderer?.setActive(screen==='battle'&&!document.hidden);
  if(restore&&restoreFocus?.isConnected)restoreFocus.focus({preventScroll:true});
}

const cellButtons=Array.from({length:25},(_,at)=>{
  const button=document.createElement('button');button.type='button';button.className='cell-hit';button.dataset.cell=coordinate(at);button.tabIndex=-1;
  listen(button,'click',()=>place(at));listen(button,'focus',()=>{focused=at;renderer?.hover(at,Boolean(run&&inspectBuild(run,at,selected).ok));});
  listen(button,'pointerenter',()=>{if(!modal&&run)renderer?.hover(at,inspectBuild(run,at,selected).ok);});
  listen(button,'pointerleave',()=>{if(document.activeElement!==button)renderer?.hover(null);});
  $('cellGrid').append(button);return button;
});
const toolButtons=tools.map((tool,i)=>{
  const button=document.createElement('button');button.type='button';button.className='tool-button';button.dataset.tool=tool;
  const image=document.createElement('img');image.alt='';image.width=image.height=96;
  const label=document.createElement('span');label.className='tool-name';label.textContent=c.tools[i];
  const cost=document.createElement('span');cost.className='tool-cost';cost.textContent=TOOLS[tool];
  button.append(image,label,cost);button.setAttribute('aria-label',`${i+1}. ${c.tools[i]} · ${c.timber} ${TOOLS[tool]}`);
  listen(button,'click',()=>selectTool(tool));$('toolShelf').append(button);return button;
});
$('arena').addEventListener('click',event=>{
  if(!event.detail||event.target.closest('#graphicsStatus'))return;
  event.stopPropagation();const at=renderer?.pick(event.clientX,event.clientY);if(at!==null&&at!==undefined)place(at);
},{capture:true,signal:abort.signal});
function selectTool(tool){if(modal||finished)return;selected=tool;hintCell=null;refreshBoard();feedback(`${c.selected}: ${c.tools[tools.indexOf(tool)]} · ${c.timber} ${TOOLS[tool]}`);}
function initializeGraphics(){
  if(renderer)return;
  try{
    renderer=new BurrowRenderer($('arena'),{reduced:reduced.matches,onProjection:positions=>positions.forEach((p,i)=>{const el=cellButtons[i];el.style.left=p.x+'px';el.style.top=p.y+'px';el.style.width=p.size+'px';}),
      onLost:()=>{graphicReady=false;$('graphicsStatus').hidden=false;$('cellGrid').inert=true;},
      onRestored:()=>{graphicReady=true;$('graphicsStatus').hidden=true;$('cellGrid').inert=false;renderer.resize();}});
    const icons=renderer.thumbnails();toolButtons.forEach((button,i)=>button.querySelector('img').src=icons[tools[i]]);document.querySelector('.workshop-poster').src=icons.lantern;graphicReady=true;
  }catch(error){graphicReady=false;$('graphicsStatus').hidden=false;$('cellGrid').inert=true;console.error('Burrow renderer unavailable',error);}
}
async function startLevel(index,{practice:requestedPractice=practice}={}){
  if(starting||index<0||index>=LEVELS.length)return;
  starting=true;
  try{
    if(requestedPractice){if(!await LocalPractice.validate())return;}else if(index>unlocked(save))return;
    practice=requestedPractice;closeModal({restore:false});finished=false;levelIndex=index;hintCell=null;run=createRun(LEVELS[index]);selected='bed';focused=run.level.solution[0].at;
    initializeGraphics();setScene('battle');renderer?.setRun(run,save.lantern);renderer?.setActive(!document.hidden);
    $('chapterLabel').textContent=`${c.chapter} ${run.level.chapter+1} · ${c.chapters[run.level.chapter]}`;
    $('planTitle').textContent=levelName(run.level,locale);battleInfo.textContent=`${c.plan} ${index+1}/30`;
    $('objectives').replaceChildren();
    for(const goal of progress(run).requirements){const tag=document.createElement('div');tag.className='objective';tag.dataset.goal=goal.key;const name=document.createElement('span'),count=document.createElement('b');name.textContent=goal.key==='food'?c.food:c.tools[tools.indexOf(goal.key)];tag.append(name,count);$('objectives').append(tag);}
    refreshBoard();feedback(index===0?`${c.tools[1]} → C2 · ${c.tools[2]} → C3`:c.buildHint);
    if(index===0){hintCell=7;cellButtons[7].classList.add('is-hint');}
    audio.play('game.start');document.querySelector('[data-wp-return="battle"]').focus({preventScroll:true});
  }finally{starting=false;}
}
function refreshBoard(){
  if(!run)return;const p=progress(run);
  materialInfo.textContent=`${c.timber} ${run.level.budget-run.spent}/${run.level.budget}`;
  $('selectedTool').textContent=`${c.tools[tools.indexOf(selected)]} · ${TOOLS[selected]}`;
  $('starTarget').textContent=`★ ≤ ${run.level.par} · ${run.spent}`;
  $('starTarget').title=`${c.efficient}: ${run.spent}/${run.level.par}`;
  for(const goal of p.requirements){const node=$('objectives').querySelector(`[data-goal="${goal.key}"]`);if(node){node.classList.toggle('is-met',goal.met);node.querySelector('b').textContent=`${Math.min(goal.value,goal.target)}/${goal.target}`;}}
  $('finishButton').disabled=!p.complete||finished;$('undoButton').disabled=!run.history.length||finished;
  tools.forEach((tool,i)=>{toolButtons[i].setAttribute('aria-pressed',String(selected===tool));toolButtons[i].setAttribute('aria-disabled',String(TOOLS[tool]>run.level.budget-run.spent&&!run.rooms.includes('hall')));});
  cellButtons.forEach((button,at)=>{
    const type=run.rooms[at],terrain=run.level.map[at],name=type==='entry'?c.entry:type?c.tools[tools.indexOf(type)]:terrain==='#'?c.rock:terrain==='~'?c.water:c.empty;
    button.setAttribute('aria-label',`${coordinate(at)} · ${name}${terrain==='*'?` · ${c.relic}`:''}`);
    button.tabIndex=at===focused?0:-1;button.classList.toggle('is-available',!type&&inspectBuild(run,at,selected).ok);button.classList.toggle('is-hint',at===hintCell);
  });
}
function place(at){
  if(screen!=='battle'||modal||finished||!graphicReady)return;
  const result=build(run,at,selected);
  if(!result.ok){audio.play('feedback.error');const text=result.reason==='budget'?`${c.timber}: ${run.level.budget-run.spent} / ${TOOLS[selected]}`:['gardenWater','nurseryBed','water','dry'].includes(result.reason)?c.rules[1]:result.reason==='connect'?c.rules[0]:`${coordinate(at)} · ${result.reason==='rock'?c.rock:c.selected} · ${c.buildHint}`;feedback(text,true);renderer.hover(at,false);return;}
  focused=at;hintCell=null;renderer.setCell(at,selected);renderer.hover(null);audio.play(result.relic?'reward.collect':'board.move');refreshBoard();
  const p=progress(run);feedback(p.complete?c.invite:result.relic?c.relic:c.buildHint);
  if(levelIndex===0&&run.rooms[7]==='bed'&&!run.rooms[12]){selected='pantry';hintCell=12;refreshBoard();feedback(`${c.tools[2]} → C3`);}
}
function undoBuild(){if(!run||modal||finished)return;const action=run.history.at(-1);if(undo(run)){hintCell=null;renderer?.setCell(action.at,action.previous,false);audio.play('board.undo');refreshBoard();feedback(c.buildHint);}}
function showHint(){
  if(!run||modal||finished)return;
  const step=run.level.solution.find(s=>run.rooms[s.at]!==s.tool);
  audio.play('feedback.hint');
  if(!step){feedback(c.invite);return;}
  if(!inspectBuild(run,step.at,step.tool).ok){feedback(c.hintReset);return;}
  selected=step.tool;hintCell=step.at;refreshBoard();feedback(`${c.hint}: ${c.tools[tools.indexOf(step.tool)]} → ${coordinate(step.at)}`);renderer?.hover(step.at,true);
}
function finish(){
  if(finished||modal||!run||!progress(run).complete)return;
  finished=true;const p=progress(run);
  if(!practice){save=recordCompletion(save,levelIndex,run);persist();updateProgress();stageUI?.setConfig(config(),levelIndex);}
  renderer?.hover(null);renderer?.celebrate();audio.play('result.win');refreshBoard();
  $('resultStars').replaceChildren();for(let i=0;i<3;i++){const star=document.createElement('span');star.textContent='★';star.className=i<p.stars?'':'unearned';$('resultStars').append(star);}
  $('resultChecks').replaceChildren();for(const [label,earned] of [[c.finishStar,true],[`${c.efficient} · ≤ ${run.level.par}`,p.efficient],[c.relic,p.relic]]){const row=document.createElement('div');row.className=earned?'earned':'pending';row.textContent=`${earned?'✓':'○'} ${label}`;$('resultChecks').append(row);}
  $('resultSummary').textContent=`${p.stars}/3 ★ · ${c.timber} ${run.spent}/${run.level.budget}${levelIndex===29?` · ${c.allDone}`:''}`;
  $('nextButton').textContent=levelIndex===29?c.stages:c.next;openModal('resultView');
}
function refreshShop(){
  const wallet=window.WeightPlayWallet.read(),icon=document.createElement('img');icon.src='/assets/weightplay-diamond.svg';icon.alt='';icon.width=icon.height=24;
  $('walletBalance').replaceChildren(icon,document.createTextNode(String(wallet.diamonds)));
  $('buyLantern').disabled=save.lantern||practice;$('buyLantern').textContent=save.lantern?c.owned:c.buy;
}
function buyLantern(){
  if(practice||save.lantern)return;
  if(window.WeightPlayWallet.read().diamonds<12){closeModal();refreshShop();$('shopStatus').textContent=c.insufficient;audio.play('feedback.error');return;}
  // Store the promised ownership first. If the shared spend cannot persist,
  // roll it back; no asynchronous gap permits a second click or partial grant.
  const prior=JSON.stringify(save),next={...save,lantern:true};
  try{localStorage.setItem(SAVE_KEY,JSON.stringify(next));if(!window.WeightPlayWallet.spendDiamonds(12)){localStorage.setItem(SAVE_KEY,prior);$('shopStatus').textContent=c.insufficient;return;}save=next;audio.play('shop.purchase');$('shopStatus').textContent=c.purchased;}
  catch{try{localStorage.setItem(SAVE_KEY,prior);}catch{}warnStorage();$('shopStatus').textContent=c.saveError;}
  finally{closeModal();refreshShop();}
}

listen($('startButton'),'click',()=>{setScene('stage');if(!stageUI)stageUI=window.WeightPlayPlayUI.mountStage({page:$('stagePage'),rail:$('stageRail'),config:config(),selected:levelIndex,onSelect:i=>{levelIndex=i;},onStart:i=>void startLevel(i),isActive:()=>screen==='stage'&&!modal&&!$('stagePage').hidden});else stageUI.setConfig(config(),levelIndex);stageUI.pool.find(card=>card.getAttribute('aria-current')==='true')?.focus({preventScroll:true});});
listen(document.querySelector('[data-wp-return="stage"]'),'click',()=>{setScene('main');$('startButton').focus({preventScroll:true});});
listen(document.querySelector('[data-wp-return="battle"]'),'click',()=>openModal('leaveDialog'));
listen(stagesTab,'click',()=>showStagePage(false));listen(workshopTab,'click',()=>showStagePage(true));
listen($('continueButton'),'click',()=>closeModal());listen($('confirmLeave'),'click',()=>{closeModal({restore:false});setScene('stage');stageUI?.refresh(levelIndex);stagesTab.focus({preventScroll:true});});
listen($('undoButton'),'click',undoBuild);listen($('restartButton'),'click',()=>void startLevel(levelIndex));listen($('hintButton'),'click',showHint);listen($('finishButton'),'click',finish);
listen($('nextButton'),'click',()=>{if(levelIndex<29)void startLevel(levelIndex+1);else{closeModal({restore:false});setScene('stage');stagesTab.focus();}});
listen($('replayButton'),'click',()=>void startLevel(levelIndex));listen($('stageFromResult'),'click',()=>{closeModal({restore:false});setScene('stage');stagesTab.focus({preventScroll:true});});
listen($('buyLantern'),'click',()=>{if(!save.lantern&&!practice)openModal('shopDialog');});listen($('confirmBuy'),'click',buyLantern);listen($('cancelBuy'),'click',()=>closeModal());listen($('reloadGraphics'),'click',()=>location.reload());
listen(document,'keydown',event=>{
  if(modal){const list=[...$(modal).querySelectorAll('button:not(:disabled)')];if(event.key==='Tab'){const current=list.indexOf(document.activeElement),next=event.shiftKey?(current<=0?list.length-1:current-1):(current+1)%list.length;event.preventDefault();list[next]?.focus();}if(event.key==='Escape'&&modal!=='resultView'){event.preventDefault();closeModal();}return;}
  if(screen!=='battle'||finished||event.target.closest('select,input,.wp-frame-popover'))return;
  if(event.key==='Escape'){event.preventDefault();openModal('leaveDialog');return;}
  if(event.repeat&&['Enter',' ','z','Z'].includes(event.key)){event.preventDefault();return;}
  if(/^[1-6]$/.test(event.key)){selectTool(tools[Number(event.key)-1]);event.preventDefault();return;}
  if(event.key.toLowerCase()==='z'&&!event.ctrlKey&&!event.metaKey){undoBuild();event.preventDefault();return;}
  if(event.target.closest('.cell-grid')&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)){
    event.preventDefault();const next={ArrowUp:focused-5,ArrowDown:focused+5,ArrowLeft:focused%5?focused-1:focused,ArrowRight:focused%5<4?focused+1:focused}[event.key];focused=Math.max(0,Math.min(24,next));refreshBoard();cellButtons[focused].focus({preventScroll:true});
  }
});
listen(document,'visibilitychange',()=>{renderer?.setActive(!document.hidden&&screen==='battle'&&(!modal||modal==='resultView'));if(document.hidden)audio.stop();});
listen(reduced,'change',()=>{if(renderer)renderer.reduced=reduced.matches;});
listen(window,'pagehide',event=>{if(event.persisted){renderer?.setActive(false);audio.stop();return;}stageUI?.destroy();renderer?.dispose();audio.dispose();frame.destroy();abort.abort();});
listen(window,'pageshow',event=>{if(event.persisted){frame.activate(screen,{covered:Boolean(modal)});renderer?.setActive(screen==='battle'&&!modal);}});
listen(window,'storage',event=>{if(event.key===SAVE_KEY){try{save=normalizeSave(JSON.parse(event.newValue||'null'));updateProgress();if(screen==='stage'){stageUI?.setConfig(config(),levelIndex);refreshShop();}}catch{}}});

setScene('main');$('startButton').disabled=false;
void LocalPractice.register({gameId:'animal-burrow-builder',stageIds:LEVELS.map(l=>l.id),enable:value=>{practice=value;stageUI?.setConfig(config(),levelIndex);},startStage:id=>startLevel(Number(id)-1,{practice:true})});
