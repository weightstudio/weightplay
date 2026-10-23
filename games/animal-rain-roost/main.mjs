import {STAGES,EQUIPMENT} from './stages.mjs?v=6';
import {readSave,persistSave,normalizeSave,createRun,move,tick,commitResult,buyLantern,LANTERN_PRICE,SAVE_KEY} from './model.mjs?v=6';
import {COPY,LOCALES,LOCALE_NAMES,detectLocale} from './copy.mjs?v=6';
import {RainScene} from './scene.mjs?v=6';
import {LocalPractice} from '../../src/game-local-practice.mjs';

const $=id=>document.getElementById(id),GAME='animal-rain-roost';
let locale=detectLocale(),save=readSave(localStorage),screen='main',tab='journey',selected=0,run=null,raf=0,last=0,settling=0;
let scene,frame,rail,modal=null,previousFocus=null,settingsPaused=false,tutorialPaused=false,suspended=false,starting=false,buying=false,practice=false,everPractice=false,disposed=false;
let tutorialTrigger=null,feedbackUntil=0,keyboard=new Set(),pointer=null,generation=0,saveFailed=false;
const abort=new AbortController(),flights=new Set(),reduced=matchMedia('(prefers-reduced-motion: reduce)');
const listen=(node,type,fn,options={})=>node.addEventListener(type,fn,{...options,signal:abort.signal});
const t=key=>COPY[locale][key];
const audio=window.WeightPlayAudio.createScope();
const play=id=>audio.play(id);
const soundIds=['water.splash','reward.collect','impact.soft','feedback.error','game.start','game.checkpoint','result.win','result.lose','reward.unlock','shop.purchase'];
window.WeightPlayAudio.preload(soundIds);
const modalRoots=[$('resultView'),$('leaveView'),$('pauseView'),$('purchaseView')];
const activeRun=()=>screen==='battle'&&run&&!run.ended&&!modal&&!settingsPaused&&!tutorialPaused&&!suspended&&!document.hidden;
const cleared=()=>save.stars.filter(Boolean).length;
const totalStars=()=>save.stars.reduce((sum,n)=>sum+n,0);

function applyLocale(){
  document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-copy]').forEach(node=>{node.textContent=t(node.dataset.copy)});
  $('localeSelect').value=locale;
  const title=window.WEIGHTPLAY_GAME_TITLES?.[GAME]?.[locale]||window.WEIGHTPLAY_GAME_TITLES?.[GAME]?.en||'Rain Roost';
  document.querySelectorAll('[data-wp-game-title]').forEach(node=>{node.textContent=title});
  document.title=`${title} | WeightPlay`;
  $('rainCanvas').setAttribute('aria-label',`${title}. ${t('controlText')}`);
  $('helpButton').setAttribute('aria-label',t('help'));
  $('laneControls').setAttribute('aria-label',t('controls'));
  for(const button of $('laneControls').children)button.setAttribute('aria-label',`${t('lane')} ${Number(button.dataset.lane)+1}`);
  $('mainReturn').href=`/${({'zh-Hant':'zh-tw','zh-Hans':'zh-cn','pt-BR':'pt-br'})[locale]||locale}/`;
  renderProgress();renderGear();rail?.refresh(selected);if(run)renderHUD();
}
function renderProgress(){
  $('mainProgress').textContent=`${t('complete')} ${cleared()} / 30 · ${t('stars')} ${totalStars()} / 90`;
  $('stageProgress').textContent=`${cleared()} / 30 · ★ ${totalStars()}`;
}
function objective(stage,withProgress=false){
  const parts=[`${t('water')} ${withProgress?`${run.caught}/`:''}${stage.target}`];
  if(stage.gold)parts.push(`${t('gold')} ${withProgress?`${run.gold}/`:''}${stage.gold}`);
  if(stage.streak)parts.push(`${t('combo')} ${withProgress?`${run.bestCombo}/`:''}${stage.streak}`);
  if(stage.maxLeaves<99)parts.push(`${t('leaves')} ${withProgress?`${run.leaves}/`:'≤ '}${stage.maxLeaves}`);
  return parts.join(' · ');
}
const stageConfig={gameId:GAME,poster:'/assets/interface7-redrawn/animal-rain-roost.webp',background:'/assets/interface7-redrawn/animal-rain-roost.webp',count:30,stage(index){
  const s=STAGES[index],locked=!practice&&s.id>save.unlocked;
  return {id:s.id,kicker:`${t('stage')} ${s.id}`,title:t('chapters')[s.arc],subtitle:s.checkpoint?`${t('precision')} · ${t('goal')}`:s.gold?`${t('gold')} · ${t('wind')}`:s.arc? t('wind'):t('calm'),status:locked?t('locked'):save.stars[index]?'★'.repeat(save.stars[index]):t('ready'),summary:objective(s),details:[t('controlText'),t('goalText'),t('starText')],locked,cleared:save.stars[index]>0};
}};
function cancelEffects(){for(const item of flights){item.animation.cancel();item.node.remove()}flights.clear();audio.stopAll?.();feedbackUntil=0;}
function resetInputs(){keyboard.clear();if(pointer!==null){try{$('rainCanvas').releasePointerCapture(pointer)}catch{}}pointer=null;}
function hideModals(){for(const node of modalRoots)node.hidden=true;modal=null;setInert();}
function setInert(){
  const covered=Boolean(modal)||tutorialPaused;
  $('battleContent').inert=covered;
  $('battleScreen').querySelector('[data-wp-frame-header]')?.toggleAttribute('inert',covered);
  $('stageContent').inert=modal===$('purchaseView');
  $('stageScreen').querySelector('[data-wp-frame-header]')?.toggleAttribute('inert',modal===$('purchaseView'));
  $('stageScreen').querySelector('nav')?.toggleAttribute('inert',modal===$('purchaseView'));
}
function showScreen(next){
  generation++;cancelAnimationFrame(raf);raf=0;last=0;resetInputs();cancelEffects();hideModals();
  screen=next;suspended=false;settingsPaused=false;tutorialPaused=false;
  document.body.dataset.screen=next;
  for(const [name,id] of [['main','mainScreen'],['stage','stageScreen'],['battle','battleScreen']]){
    $(id).hidden=name!==next;$(id).inert=name!==next;
  }
  $('gameGuide').hidden=next!=='main';
  $('stageScreen').toggleAttribute('data-wp-logical-stage-canvas',next==='stage');
  $('battleScreen').toggleAttribute('data-wp-logical-battle-canvas',next==='battle');
  frame.activate(next);renderProgress();
  if(next==='stage'){renderGear();rail.refresh(selected);rail.select(selected);}
  else rail?.cancel();
  if(next==='battle')schedule();
}
function openModal(node,focus){
  if(modal&&modal!==node)modal.hidden=true;
  previousFocus=document.activeElement;modal=node;node.hidden=false;resetInputs();setInert();last=0;
  (focus||node.querySelector('button:not(:disabled)'))?.focus({preventScroll:true});
}
function closeModal(restore=true){
  if(modal)modal.hidden=true;modal=null;setInert();last=0;
  if(restore&&previousFocus?.isConnected&&!previousFocus.closest('[hidden]'))previousFocus.focus({preventScroll:true});
  if(activeRun())schedule();
}
function trapFocus(event,root){
  if(event.key!=='Tab')return;
  const buttons=[...root.querySelectorAll('button:not(:disabled),[href],select,[tabindex="0"]')].filter(node=>node.getClientRects().length);
  if(!buttons.length)return;
  const current=buttons.indexOf(document.activeElement);
  if(event.shiftKey&&current<=0){buttons.at(-1).focus();event.preventDefault()}
  else if(!event.shiftKey&&(current===-1||current===buttons.length-1)){buttons[0].focus();event.preventDefault()}
}
function feedback(text){$('feedback').textContent=text;feedbackUntil=(run?.time||0)+1.1;}
function flyCount(event){
  if(reduced.matches)return;
  if(flights.size>=8){const first=flights.values().next().value;first.animation.cancel();first.node.remove();flights.delete(first)}
  const box=$('rainCanvas').getBoundingClientRect(),target=$('catchValue').getBoundingClientRect();
  const x=box.left+box.width*(.5+scene.laneX(event.lane)/scene.width),y=box.bottom-70;
  const node=document.createElement('span');node.className='reward-flight';node.textContent='+1';node.setAttribute('aria-hidden','true');node.style.left=`${x}px`;node.style.top=`${y}px`;document.body.append(node);
  const animation=node.animate([{transform:'translate(-50%,-50%)',opacity:1},{transform:`translate(${target.left+target.width/2-x}px,${target.top+target.height/2-y}px) scale(.65)`,opacity:.15}],{duration:550,easing:'cubic-bezier(.2,.7,.3,1)',fill:'forwards'});
  const item={node,animation};flights.add(item);animation.finished.catch(()=>{}).finally(()=>{node.remove();flights.delete(item)});
}
function onGameEvent(kind,event){
  scene.impact(kind,event,reduced.matches);
  if(kind==='rain'||kind==='gold'){play(kind==='gold'?'reward.collect':'water.splash');feedback(kind==='gold'?`${t('gold')} +1 · ${t('combo')} ${run.combo}`:`${t('caught')} ×${run.combo}`);flyCount(event)}
  else if(kind==='leaf'){play('impact.soft');feedback(`${t('leaves')} · ${t('combo')} 0`)}
  else if(kind==='guard'){play('impact.soft');feedback(`${t('guard')} · ${run.guards}`)}
  else if(kind==='miss')feedback(t('miss'));
  else if(kind==='phase'){play('game.checkpoint');feedback(`${t('wind')} · ${event.phase+1} / 3`)}
  else if(kind==='result')finish(event);
}
function renderHUD(){
  const s=run.stage;
  $('stageValue').textContent=String(s.id);$('catchValue').textContent=`${run.caught} / ${s.target}`;$('comboValue').textContent=String(run.combo);
  $('goalLine').textContent=objective(s,true);
  const next=s.events.find(event=>event.kind!=='leaf'&&event.at>run.time);
  $('landingCue').textContent=next?`${t('landing')} · ${t('lane')} ${next.lane+1}${next.kind==='gold'?` · ${t('gold')}`:''}`:t('complete');
  $('windLabel').textContent=next?.wind?`${t('wind')} ${next.wind>0?'→':'←'}`:t('calm');
  $('timeLabel').textContent=`${t('time')} ${Math.max(0,Math.ceil(s.duration-run.time))}s`;
  for(const button of $('laneControls').children)button.setAttribute('aria-pressed',String(Math.round(run.targetX)===Number(button.dataset.lane)));
  if(run.time>feedbackUntil)$('feedback').textContent='';
}
function schedule(){if(!raf&&!disposed&&screen==='battle')raf=requestAnimationFrame(loop);}
function loop(now){
  raf=0;if(screen!=='battle'||disposed)return;
  const dt=last?Math.min(.05,(now-last)/1000):0;last=now;
  if(activeRun()){
    const direction=Number(keyboard.has('right'))-Number(keyboard.has('left'));
    if(direction)move(run,run.targetX+direction*dt*4.8);
    tick(run,dt,onGameEvent);renderHUD();
  }
  const animating=activeRun()||(run?.ended&&settling>0&&!document.hidden);
  scene.render(run,animating?dt:0,{reduced:reduced.matches,lantern:save.lantern&&save.lanternOn});
  if(run?.ended)settling=Math.max(0,settling-dt);
  if(animating)schedule();else last=0;
}
async function startBattle(index){
  if(starting||disposed)return;
  starting=true;const stamp=generation;
  try{
    if(everPractice&&!await LocalPractice.validate()){feedback(t('practice'));return;}
    if(stamp!==generation)return;
    if(!practice&&index+1>save.unlocked){play('feedback.error');return;}
    selected=Math.max(0,Math.min(29,index));run=createRun(selected+1,save.equipment);scene.reset();settling=0;
    showScreen('battle');renderHUD();feedback(t('ready'));play('game.start');
    $('rainCanvas').focus({preventScroll:true});
    window.dispatchEvent(new CustomEvent('weightplay:battle-open',{detail:{gameId:GAME}}));
  }finally{starting=false;}
}
function finish(result){
  resetInputs();settling=.7;
  const wasCleared=cleared();saveFailed=false;
  if(result.win&&!everPractice){
    try{save=commitResult(localStorage,save,run)}
    catch{
      saveFailed=true;const next=normalizeSave(save);next.stars[selected]=Math.max(next.stars[selected],result.stars);next.bests[selected]=Math.max(next.bests[selected],result.score);next.legacyBest=Math.max(next.legacyBest,run.caught);save=normalizeSave(next);
    }
  }
  play(result.win?'result.win':'result.lose');
  if(result.win&&!everPractice&&cleared()>wasCleared&&[5,10].includes(cleared()))play('reward.unlock');
  $('resultTitle').textContent=result.win?(selected===29?t('finale'):t('win')):t('fail');
  $('resultKicker').textContent=`${t('stage')} ${selected+1} · ${t('chapters')[run.stage.arc]}`;
  $('resultStars').textContent=result.win?'★'.repeat(result.stars)+'☆'.repeat(3-result.stars):'☆☆☆';
  $('resultStars').setAttribute('aria-label',`${t('stars')} ${result.stars} / 3`);
  $('resultSummary').textContent=`${objective(run.stage,true)} · ${t('score')} ${result.score}`;
  $('saveNotice').textContent=everPractice?t('practice'):saveFailed?t('saveError'):result.win&&[5,10].includes(cleared())&&cleared()>wasCleared?`${t('unlock')} · ${t(cleared()===5?'net':'magnet')}`:'';
  $('nextButton').disabled=!result.win||selected===29;
  openModal($('resultView'),result.win&&selected<29?$('nextButton'):$('replayButton'));
  renderProgress();
}
function setTab(next){
  tab=next;$('journeyPanel').hidden=next!=='journey';$('nestPanel').hidden=next!=='nest';
  for(const [id,key] of [['stagesTab','journey'],['nestTab','nest']]){const active=key===next;$(id).setAttribute('aria-selected',String(active));$(id).tabIndex=active?0:-1;}
  if(next==='journey')rail.refresh(selected);else{rail.cancel();renderGear();}
}
function renderGear(){
  const cards=$('gearCards');
  for(const id of Object.keys(EQUIPMENT)){
    let card=cards.querySelector(`[data-gear="${id}"]`);
    if(!card){card=document.createElement('article');card.className='gear-card';card.dataset.gear=id;card.innerHTML='<h3></h3><p></p><button type="button"></button>';cards.append(card);listen(card.querySelector('button'),'click',()=>equip(id));}
    card.querySelector('h3').textContent=t(id);card.querySelector('p').textContent=t(`${id}Text`);
    const locked=EQUIPMENT[id].unlock>cleared(),button=card.querySelector('button');
    button.disabled=locked||save.equipment===id||everPractice;button.textContent=locked?`${t('locked')} · ${EQUIPMENT[id].unlock}`:save.equipment===id?t('equipped'):t('equip');card.setAttribute('aria-current',String(save.equipment===id));
  }
  let diamonds=0;try{diamonds=window.WeightPlayWallet.read().diamonds}catch{}
  $('walletBalance').textContent=`${t('balance')} ${diamonds}`;
  $('lanternButton').textContent=save.lantern?t(save.lanternOn?'disable':'enable'):`${t('buy')} · ${LANTERN_PRICE}`;
  $('lanternButton').disabled=everPractice||buying;
}
function equip(id){
  if(everPractice||EQUIPMENT[id].unlock>cleared())return;
  try{save=persistSave(localStorage,{...save,equipment:id});$('nestFeedback').textContent=`${t('equipped')} · ${t(id)}`;play('reward.collect');}
  catch{$('nestFeedback').textContent=t('saveError');play('feedback.error');}
  renderGear();
}
async function purchase(){
  if(buying||everPractice)return;buying=true;$('confirmBuy').disabled=true;$('cancelBuy').disabled=true;
  try{
    if(!navigator.locks)throw Error('Storage lock unavailable');
    const result=await navigator.locks.request('weightplay-wallet',()=>buyLantern(localStorage,window.WeightPlayWallet));
    save=result.save;
    if(['bought','owned'].includes(result.status)){closeModal();$('nestFeedback').textContent=t(result.status==='bought'?'purchased':'owned');if(result.status==='bought')play('shop.purchase');}
    else{$('purchaseFeedback').textContent=t(result.status==='funds'?'funds':'saveError');play('feedback.error');}
  }catch{$('purchaseFeedback').textContent=t('saveError');play('feedback.error');}
  finally{buying=false;$('confirmBuy').disabled=false;$('cancelBuy').disabled=false;renderGear();}
}
function pauseForVisibility(){
  resetInputs();cancelAnimationFrame(raf);raf=0;last=0;
  if(screen==='battle'&&run&&!run.ended&&!modal&&!tutorialPaused){suspended=true;openModal($('pauseView'),$('resumeButton'));}
}

// Initialize the explicit shared frame once. All scene roots remain permanent.
for(let i=0;i<LOCALES.length;i++)$('localeSelect').append(new Option(LOCALE_NAMES[i],LOCALES[i]));
$('localeSelect').value=locale;
frame=window.WeightPlayScreenFrame.mount({root:$('app'),localeSelect:$('localeSelect'),playUI:true,scenes:{main:{root:$('mainScreen'),header:$('mainScreen').querySelector('header'),content:$('mainContent')},stage:{root:$('stageScreen'),header:$('stageScreen').querySelector('header'),content:$('stageContent')},battle:{root:$('battleScreen'),header:$('battleScreen').querySelector('header'),content:$('battleContent'),headerInfo:$('battleInfo')}}});
const stageGroup=window.WeightPlayScreenFrame.createGroup();stageGroup.add($('stageProgress'));frame.stageTopUI.add(stageGroup);
const battleGroup=window.WeightPlayScreenFrame.createGroup();for(const node of [...$('battleInfo').children])battleGroup.add(node);frame.battleTopUI.add(battleGroup);
frame.commonDownButton.add($('stagesTab')).add($('nestTab'));
rail=window.WeightPlayPlayUI.mountStage({page:$('journeyPanel'),rail:$('stageRail'),config:stageConfig,selected,onSelect:index=>{selected=index},onStart:index=>startBattle(index),isActive:()=>screen==='stage'&&tab==='journey'});
frame.activate('main');applyLocale();
window.WeightPlayGameEntryLoader?.begin(4);
scene=new RainScene($('rainCanvas'));await scene.loadBackdrop();scene.render(null);
window.WeightPlayGameEntryLoader?.assetProgress(1,4);
await Promise.all(['/assets/interface7-redrawn/animal-rain-roost.webp','/assets/weightplay-character-bubble-fin-otter-block-v1.webp','/assets/weightplay-diamond.svg'].map(async(src,i)=>{const image=new Image();image.src=src;await image.decode();window.WeightPlayGameEntryLoader?.assetProgress(i+2,4)}));

listen($('startButton'),'click',()=>{selected=Math.min(29,save.unlocked-1);setTab('journey');showScreen('stage')});
listen($('stageBack'),'click',()=>{showScreen('main');$('startButton').focus({preventScroll:true})});
listen($('stagesTab'),'click',()=>setTab('journey'));listen($('nestTab'),'click',()=>setTab('nest'));
for(const id of ['stagesTab','nestTab'])listen($(id),'keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();setTab(tab==='journey'?'nest':'journey');$(tab==='journey'?'stagesTab':'nestTab').focus()}});
listen($('battleBack'),'click',()=>{if(run?.ended){selected=Math.min(29,save.unlocked-1);showScreen('stage')}else openModal($('leaveView'),$('keepPlaying'))});
listen($('keepPlaying'),'click',()=>closeModal());listen($('confirmLeave'),'click',()=>showScreen('stage'));
listen($('resumeButton'),'click',()=>{suspended=false;closeModal();$('rainCanvas').focus({preventScroll:true})});
listen($('resultStages'),'click',()=>{selected=Math.min(29,save.unlocked-1);showScreen('stage')});
listen($('replayButton'),'click',()=>startBattle(selected));
listen($('nextButton'),'click',()=>{if(run?.result?.win&&selected<29)startBattle(selected+1)});
listen($('lanternButton'),'click',()=>{
  if(everPractice)return;
  if(save.lantern){try{save=persistSave(localStorage,{...save,lanternOn:!save.lanternOn});renderGear()}catch{$('nestFeedback').textContent=t('saveError')}return;}
  $('purchaseFeedback').textContent='';openModal($('purchaseView'),$('cancelBuy'));
});
listen($('cancelBuy'),'click',()=>{if(!buying)closeModal()});listen($('confirmBuy'),'click',purchase);
listen($('localeSelect'),'change',()=>{locale=$('localeSelect').value;try{localStorage.setItem('weightplay-rain-roost-locale',locale)}catch{}window.WonderI18n?.setLocale?.(locale);applyLocale()});
listen(window,'wonder:locale-change',()=>{const candidate=window.WonderI18n?.actualLocale?.();if(COPY[candidate]){locale=candidate;applyLocale()}});
listen(window,'storage',event=>{if(event.key===SAVE_KEY){save=readSave(localStorage);renderProgress();renderGear();rail.refresh(selected)}else if(event.key===window.WeightPlayWallet.key)renderGear()});
for(const button of $('laneControls').children)listen(button,'click',()=>{if(activeRun()){move(run,Number(button.dataset.lane));$('rainCanvas').focus({preventScroll:true})}});
listen($('rainCanvas'),'pointerdown',event=>{if(!activeRun())return;pointer=event.pointerId;$('rainCanvas').setPointerCapture(pointer);$('rainCanvas').focus({preventScroll:true});move(run,scene.inputLane(event.clientX));event.preventDefault()});
listen($('rainCanvas'),'pointermove',event=>{if(activeRun()&&pointer===event.pointerId){move(run,scene.inputLane(event.clientX));event.preventDefault()}});
for(const type of ['pointerup','pointercancel','lostpointercapture'])listen($('rainCanvas'),type,event=>{if(pointer===event.pointerId)pointer=null});
listen(document,'keydown',event=>{
  const tutorial=document.querySelector('.wp-tutorial-backdrop');
  if(tutorial){trapFocus(event,tutorial);if(event.key==='Escape')tutorial.querySelector('.wp-tutorial-close')?.click();return;}
  if(modal){trapFocus(event,modal);if(event.key==='Escape'&&modal!==$('resultView')&&!buying){if(modal===$('pauseView'))suspended=false;closeModal();event.preventDefault()}return;}
  if(event.defaultPrevented)return;
  if(event.key==='Escape'&&activeRun()){openModal($('leaveView'),$('keepPlaying'));return;}
  if(!activeRun()||document.activeElement!==$('rainCanvas'))return;
  if(['ArrowLeft','a','A'].includes(event.key)){keyboard.add('left');move(run,run.targetX-.1);event.preventDefault()}
  if(['ArrowRight','d','D'].includes(event.key)){keyboard.add('right');move(run,run.targetX+.1);event.preventDefault()}
  if(/^[1-5]$/.test(event.key)){move(run,Number(event.key)-1);event.preventDefault()}
});
listen(document,'keyup',event=>{if(['ArrowLeft','a','A'].includes(event.key))keyboard.delete('left');if(['ArrowRight','d','D'].includes(event.key))keyboard.delete('right')});
listen(window,'weightplay:interaction-state',()=>{settingsPaused=Boolean(document.querySelector('.wp-frame-settings[aria-expanded="true"]'));resetInputs();last=0;if(!settingsPaused&&activeRun())schedule()});
listen(document,'visibilitychange',()=>{if(document.hidden)pauseForVisibility();else if(screen==='battle')schedule()});
listen(window,'blur',pauseForVisibility);
listen(window,'focus',()=>{if(screen==='battle')schedule()});
listen($('rainCanvas'),'webglcontextlost',event=>{event.preventDefault();pauseForVisibility();$('pauseTitle').textContent=t('retry');$('resumeButton').textContent=t('retry');$('resumeButton').onclick=()=>location.reload();});
const resizeObserver=new ResizeObserver(()=>{if(screen==='battle'){scene.resize();if(!raf)scene.render(run,0,{reduced:reduced.matches,lantern:save.lantern&&save.lanternOn})}});resizeObserver.observe($('arena'));
listen(window,'pagehide',event=>{pauseForVisibility();if(!event.persisted){disposed=true;generation++;resizeObserver.disconnect();cancelEffects();audio.dispose();scene.dispose();rail.destroy();frame.destroy();abort.abort()}});
listen(window,'pageshow',event=>{if(event.persisted&&screen==='battle')schedule()});

await LocalPractice.ready;
practice=LocalPractice.enabled;everPractice=practice;
window.RAIN_ROOST_TUTORIAL={persistSeen:!everPractice,title:Object.fromEntries(LOCALES.map(code=>[code,COPY[code].ready])),steps:['controls','goals','growth'].map((key,i)=>({icon:String(i+1),...Object.fromEntries(LOCALES.map(code=>[code,[COPY[code][key],COPY[code][['controlText','goalText','growthText'][i]]]]))}))};
if(everPractice)document.body.dataset.tutorialAutoShow='false';
listen(window,'weightplay:tutorial-open',event=>{
  if(event.detail.gameId!==GAME)return;tutorialPaused=true;resetInputs();setInert();last=0;
  document.querySelector('.wp-tutorial-backdrop button')?.focus({preventScroll:true});
});
listen(window,'weightplay:tutorial-close',event=>{if(event.detail.gameId!==GAME)return;tutorialPaused=false;setInert();last=0;if(screen==='battle'){$('rainCanvas').focus({preventScroll:true});schedule()}});
await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='/src/tutorial.js?v=20261023-rain-roost-v6';script.onload=resolve;script.onerror=reject;document.body.append(script)});
tutorialTrigger=document.querySelector('.wp-tutorial-button');if(tutorialTrigger){tutorialTrigger.hidden=true;listen($('helpButton'),'click',()=>tutorialTrigger.click())}
renderGear();$('startButton').disabled=false;window.WeightPlayGameEntryLoader?.ready();
await LocalPractice.register({gameId:GAME,stageIds:STAGES.map(s=>String(s.id)),enable(value){practice=value;everPractice=everPractice||value;renderGear();rail.refresh(selected)},startStage:id=>startBattle(Number(id)-1)});
