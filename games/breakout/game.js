import {createRun,resizeRun,aim,serve,pulse,step,drainEvents,LEVELS,normalizeSave,clearSave,SAVE_KEY,LEGACY_KEY} from './core.mjs?v=23';
import {CrystalScene} from './scene.mjs?v=23';
import {copy,guide,LOCALES,LANGUAGE_NAMES} from './copy.mjs?v=23';
import {purchaseAurora} from './progress.mjs?v=23';
import {LocalPractice} from '/src/game-local-practice.mjs';

const $=id=>document.getElementById(id), frame=window.WPBreakoutI9Frame;
const abort=new AbortController(),listen=(el,event,fn,options={})=>el.addEventListener(event,fn,{...options,signal:abort.signal});
const read=key=>{try{return JSON.parse(localStorage.getItem(key)||'{}');}catch{return {};}};
let save=normalizeSave(read(SAVE_KEY),read(LEGACY_KEY));
let locale=LOCALES.includes(document.documentElement.lang)?document.documentElement.lang:'en';
try{if(location.pathname.startsWith('/games/'))locale=localStorage.getItem('weightPlayLocale')||locale;}catch{}
if(!LOCALES.includes(locale))locale='en';
let t=copy(locale),screen='main',selected=save.highestUnlocked-1,run=null,scene=null,raf=0,last=0,accumulator=0;
let practice=false,practiceRequested=new URLSearchParams(location.search).get('practice')==='1',busy=false,paused=false,settled=false,graphicsLost=false;
let keys=new Set(),pointer=null,returnFocus=null,resultSaved=false,tab='stages',previews=null,hudKey='';
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),audio=window.WeightPlayAudio?.createScope();
const cues={serve:'projectile.launch',bounce:'sport.bounce',wall:'sport.bounce',gate:'impact.metal',armour:'impact.metal',break:'impact.glass',blast:'explosion.small',charge:'mechanism.unlock',pulse:'magic.cast','core-open':'alert.boss','core-hit':'magic.hit',miss:'player.hurt',win:'result.win',lose:'result.lose'};
window.WeightPlayAudio?.preload(['game.start','ui.click','feedback.error',...new Set(Object.values(cues))]);
const audioTimes=new Map();
function sound(id){const now=performance.now();if(now-(audioTimes.get(id)||-999)<85)return;audioTimes.set(id,now);audio?.play(id);}
function persist(next){try{localStorage.setItem(SAVE_KEY,JSON.stringify(next));save=next;return true;}catch{return false;}}
function say(text){$('gameMessage').textContent=text;}
function stop(){cancelAnimationFrame(raf);raf=0;last=0;accumulator=0;keys.clear();pointer=null;audio?.stop();}
function isBlocked(){return paused||graphicsLost||document.hidden||document.querySelector('dialog[open]')||document.querySelector('#battleScreen [data-wp-settings][aria-expanded="true"]');}
function startLoop(){if(!raf&&screen==='battle'&&run&&!settled&&!isBlocked())raf=requestAnimationFrame(tick);}
function tick(now){raf=0;if(screen!=='battle'||!run||settled||isBlocked()){stop();return;}
  const dt=last?Math.min((now-last)/1000,.066):0;last=now;accumulator+=dt;
  const direction=(keys.has('ArrowRight')||keys.has('d')?1:0)-(keys.has('ArrowLeft')||keys.has('a')?1:0);
  if(direction)aim(run,run.paddleTarget+direction*540*dt);
  let iterations=0;while(accumulator>=1/120&&iterations++<8){step(run,1/120);accumulator-=1/120;}if(iterations>=8)accumulator=0;
  const events=drainEvents(run),major=events.some(e=>e.type==='blast'||e.type==='win'||e.type==='lose');
  for(const event of events){scene?.effect(event);if(cues[event.type]&&(!major||['blast','win','lose'].includes(event.type)))sound(cues[event.type]);}
  scene?.render(run,dt);hud();
  if(run.status==='won'||run.status==='lost'){finish();return;}startLoop();
}
function fitCourt(){if(!run||!scene||screen!=='battle')return;const r=$('board').getBoundingClientRect();if(r.width<2||r.height<2)return;
  const landscape=r.width/r.height>1.25;
  const height=landscape?300:Math.max(520,Math.min(760,Math.round(360*r.height/r.width))),width=Math.max(360,Math.min(920,Math.round(height*r.width/r.height)));
  if(run.width!==width||run.height!==height){resizeRun(run,width,height);scene.setLevel(run,save.finish);}else{scene.resize();scene.render(run,0);}
}
function ensureScene(){if(scene&&!graphicsLost)return true;try{scene?.dispose();scene=new CrystalScene($('board'),{reduced:reduced.matches,onLost:()=>{graphicsLost=true;stop();say(t.unavailable);$('graphicsRetry').hidden=false;}});graphicsLost=false;$('graphicsRetry').hidden=true;return true;}catch{graphicsLost=true;say(t.unavailable);$('graphicsRetry').hidden=false;return false;}}
function switchScreen(next){stop();const exiting=screen;screen=next;document.body.dataset.screen=next;
  for(const id of ['main','stage','battle'])$(id+'Screen').hidden=id!==next;
  if(next!=='battle'){$('resultScreen').hidden=true;delete document.body.dataset.wpResultActive;settled=false;}
  window.dispatchEvent(new CustomEvent('weightplay:breakout-screen',{detail:{screen:next,exiting}}));
  refreshProgress();if(next==='stage'){showTab('stages');frame.stageUI.refresh(selected);}if(next==='battle'){fitCourt();startLoop();}
}
function stageTitle(n){return `${t.stage} ${n} / 30`;}
function refreshProgress(){
  $('stageProgressText').textContent=`${t.progress} ${save.cleared.length} / 30 · ★ ${Object.values(save.stars).reduce((a,b)=>a+b,0)} / 90`;
  document.querySelector('.main-progress strong').textContent=t.progress;
  document.querySelector('.main-progress span').textContent=`${save.cleared.length} / 30 · ★ ${Object.values(save.stars).reduce((a,b)=>a+b,0)} / 90`;
}
function localize(){t=copy(locale);document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';
  const labels={gameTitle:t.title,objective:t.objective,mainInstruction:t.controls,startBtn:t.start,stageTitle:t.stages,stageTabButton:t.stages,equipmentTab:t.equipment,
    pauseBtn:t.pause,helpBtn:t.help,graphicsRetry:t.retryGraphics,resultStagesBtn:t.stages,nextStageBtn:t.next,retryBtn:t.replay,saveRetry:t.retrySave,
    breakoutLeaveTitle:t.leave,breakoutLeaveText:t.leaveText,breakoutLeaveContinue:t.cancel,breakoutLeaveStages:t.stages,helpTitle:t.help,helpClose:t.resume,
    pauseTitle:t.pause,pauseResume:t.resume,pauseRestart:t.restart,pauseHelp:t.help,purchaseTitle:t.aurora,purchaseText:t.auroraDesc,purchaseConfirm:t.confirm,purchaseCancel:t.cancelPurchase};
  for(const [id,text]of Object.entries(labels))if($(id))$(id).textContent=text;
  $('stageBackBtn').setAttribute('aria-label',t.start);$('battleBackBtn').setAttribute('aria-label',t.stages);
  document.querySelector('.stage-browse-hint').textContent=t.objective;
  $('board').setAttribute('aria-label',`${t.title}. ${t.controls}`);
  $('helpCopy').replaceChildren(...[t.controls,t.mechanics,t.power,t.progression,t.tips].map(text=>{const p=document.createElement('p');p.textContent=text;return p;}));
  const guideNode=document.querySelector('[data-wp-game-guide]'),related=guideNode.querySelector('.game-info-related-section');
  guideNode.innerHTML=guide(locale);if(related)guideNode.append(related);
  $('footerText').textContent='WeightPlay';refreshProgress();frame.stageUI.refresh(selected);if(tab==='equipment')renderEquipment();if(run)hud();
}
function hud(){if(!run)return;const key=[locale,run.level.id,run.status,run.score,run.lives,run.energy,run.pierce,run.combo,run.core?.hp,practice,graphicsLost].join('/');if(key===hudKey)return;hudKey=key;
  frame.updateBattleStats({stage:`${t.stage} ${run.level.id}`,score:`${t.score} ${run.score}`,moves:`${t.balls} ${run.lives}`});
  $('brickStatus').textContent=run.core?`${t.core} ${run.core.hp} / ${run.core.maxHp}`:`${t.bricks} ${run.bricks.filter(b=>b.hp>0).length}`;
  $('comboStatus').textContent=run.combo>1?`${t.combo} ×${run.combo}`:t.arcs[run.level.arc];
  $('chargeFill').style.width=run.energy+'%';$('chargeMeter').setAttribute('aria-valuenow',run.energy);$('chargeMeter').setAttribute('aria-label',t.charge);
  $('actionBtn').textContent=run.status==='ready'?t.serve:run.pierce>0?`${t.pulse} · ${run.pierce}`:`${t.pulse} · ${run.energy}%`;
  $('actionBtn').disabled=run.status==='playing'&&run.energy<100;
  $('actionBtn').classList.toggle('charged',run.energy>=100);
  if(!graphicsLost)say(practice?t.practice:run.status==='ready'?`${t.serve} · Space`:run.core?t.core:run.energy>=100?`${t.pulse} · Space`:'← → · A D');
}
async function startStage(index){if(busy)return;busy=true;try{
  if(practiceRequested){if(!practice||!await LocalPractice.validate()){say(t.unavailable);return;}}
  const n=Math.max(1,Math.min(30,Number(index)+1));if(!practice&&n>save.highestUnlocked){sound('feedback.error');return;}
  stop();selected=n-1;run=createRun(n,save.paddle);settled=false;resultSaved=false;paused=false;
  $('resultScreen').hidden=true;delete document.body.dataset.wpResultActive;
  document.querySelectorAll('dialog[open]').forEach(d=>d.close());switchScreen('battle');
  if(ensureScene()){scene.setLevel(run,save.finish);fitCourt();startLoop();}
  hud();sound('game.start');$('board').focus({preventScroll:true});
  if(!practice)window.WonderAnalytics?.track?.('stage_start',{stage_id:n});
  }finally{busy=false;}}
function action(){if(!run||screen!=='battle'||settled||isBlocked())return;if(run.status==='ready')serve(run);else if(!pulse(run))sound('feedback.error');$('board').focus({preventScroll:true});startLoop();}
function saveClear(){if(!run||run.status!=='won'||resultSaved||practice)return false;const next=clearSave(save,run);
  if(!persist(next)){$('resultGoal').textContent=t.saveError;$('saveRetry').hidden=false;return false;}
  resultSaved=true;$('saveRetry').hidden=true;window.WonderAnalytics?.completeStage?.(run.level.id);refreshProgress();return true;
}
function finish(){if(settled)return;settled=true;cancelAnimationFrame(raf);raf=0;keys.clear();pointer=null;
  const won=run.status==='won';$('resultScreen').hidden=false;document.body.dataset.wpResultActive='true';
  $('resultTitle').textContent=won?t.win:t.lose;$('resultCopy').textContent=stageTitle(run.level.id);
  $('resultStats').replaceChildren(...[[t.score,run.score],[t.combo,run.maxCombo],[t.stars,won?'★'.repeat(run.lives)+'☆'.repeat(3-run.lives):'☆☆☆']].map(([label,value])=>{const d=document.createElement('div');d.className='breakout-result-stat';const l=document.createElement('span'),v=document.createElement('strong');l.className='stat-label';l.textContent=label;v.textContent=value;d.append(l,v);return d;}));
  $('saveRetry').hidden=true;if(won&&!practice)saveClear();
  $('resultGoal').textContent=practice?t.practice:won?(resultSaved?(run.level.id===30?t.complete:save.cleared.length===3?t.unlock+' · '+t.comet:t.saved):t.saveError):t.tips;
  $('nextStageBtn').disabled=!won||run.level.id===30||(!practice&&!resultSaved);$('nextStageBtn').setAttribute('aria-disabled',String($('nextStageBtn').disabled));
  frame.animateResult();$('resultStagesBtn').focus({preventScroll:true});window.dispatchEvent(new Event('weightplay:interaction-state'));
}
function openDialog(id){returnFocus=document.activeElement;stop();$(id).showModal();frame.animateOverlay($(id));}
function closeDialog(id){$(id).close();(screen==='battle'&&!settled?$('board'):returnFocus)?.focus({preventScroll:true});startLoop();}
function showTab(next){tab=next;const equipment=next==='equipment';
  $('stageCatalog').classList.toggle('hidden',equipment);
  $('equipmentPanel').hidden=!equipment;$('stageTabButton').setAttribute('aria-pressed',String(!equipment));$('equipmentTab').setAttribute('aria-pressed',String(equipment));
  $('stageTabButton').toggleAttribute('aria-current',!equipment);$('equipmentTab').toggleAttribute('aria-current',equipment);
  document.body.dataset.breakoutStageTab=next;if(equipment)renderEquipment();else frame.stageUI.refresh(selected);
}
function renderEquipment(){
  const host=$('equipmentPanel');host.replaceChildren();
  const balance=document.createElement('p');balance.className='equipment-balance';const diamond=document.createElement('img');diamond.src='/assets/weightplay-diamond.svg';diamond.alt='';diamond.width=24;diamond.height=24;balance.append(diamond,`${t.balance}: ${window.WeightPlayWallet?.read().diamonds??0}`);host.append(balance);
  if(!previews&&ensureScene())previews={guardian:scene.paddlePreview('guardian'),comet:scene.paddlePreview('comet'),aurora:scene.paddlePreview('guardian','aurora')};
  for(const id of ['guardian','comet','aurora']){
    const card=document.createElement('article');card.className='paddle-card';
    if(previews){const img=document.createElement('img');img.src=previews[id];img.alt=t[id];img.width=320;img.height=160;card.append(img);}
    const title=document.createElement('h3'),desc=document.createElement('p'),button=document.createElement('button');title.textContent=t[id];desc.textContent=t[id+'Desc'];button.type='button';button.id='equip-'+id;button.className=id==='aurora'?'primary':'secondary';
    const locked=id==='comet'&&save.cleared.length<3;const selectedNow=id==='aurora'?save.finish==='aurora':save.paddle===id;
    if(locked)desc.textContent+=' · '+t.unlock;
    button.textContent=selectedNow?t.equipped:locked?t.locked:id==='aurora'&&!save.aurora?t.buy:t.equip;button.disabled=locked||selectedNow||practice||practiceRequested;
    button.onclick=()=>{if(id==='aurora'&&!save.aurora){$('purchaseStatus').textContent=`${t.balance}: ${window.WeightPlayWallet?.read().diamonds??0}`;openDialog('purchaseDialog');return;}
      const next={...save,...(id==='aurora'?{finish:'aurora'}:{paddle:id})};if(persist(next)){renderEquipment();}else{$('equipmentMessage').textContent=t.saveError;}};
    card.append(title,desc,button);host.append(card);
  }
  const finish=document.createElement('button');finish.type='button';finish.id='equip-jade';finish.textContent=t.jade;finish.disabled=save.finish==='jade'||practice||practiceRequested;finish.onclick=()=>{if(persist({...save,finish:'jade'}))renderEquipment();};host.append(finish);
  const message=document.createElement('p');message.id='equipmentMessage';message.setAttribute('role','status');message.textContent=practice?t.practice:t.storage;host.append(message);
}

$('localeSelect').replaceChildren(...LOCALES.map((key,i)=>new Option(LANGUAGE_NAMES[i],key)));$('localeSelect').value=locale;
listen($('localeSelect'),'change',()=>{locale=$('localeSelect').value;try{localStorage.setItem('weightPlayLocale',locale);}catch{}localize();});
frame.stageUI.mount({config:{count:30,poster:'/assets/interface7-redrawn/breakout.webp',background:'/assets/lobby-block-atmosphere.svg',stage(index){const level=LEVELS[index],locked=!practice&&level.id>save.highestUnlocked;return {id:level.id,kicker:t.title,title:stageTitle(level.id),subtitle:t.arcs[level.arc],status:save.cleared.includes(level.id)?`${t.cleared} · ${'★'.repeat(save.stars[level.id]||1)}`:locked?t.locked:t.ready,summary:locked?t.progression:level.checkpoint?t.core:t.arcs[level.arc],details:[`${t.balls} 3`,`${t.best} ${save.best[level.id]||0}`],locked,cleared:save.cleared.includes(level.id),poster:'/assets/interface7-redrawn/breakout.webp'};}},selected,onSelect:index=>{selected=index;},onStart:index=>startStage(index)});
listen($('startBtn'),'click',()=>switchScreen('stage'));listen($('stageBackBtn'),'click',()=>switchScreen('main'));
listen($('stageTabButton'),'click',()=>showTab('stages'));listen($('equipmentTab'),'click',()=>showTab('equipment'));
listen($('battleBackBtn'),'click',()=>settled?switchScreen('stage'):openDialog('breakoutLeaveDialog'));
listen($('breakoutLeaveContinue'),'click',()=>closeDialog('breakoutLeaveDialog'));
listen($('breakoutLeaveStages'),'click',()=>{closeDialog('breakoutLeaveDialog');switchScreen('stage');});
listen($('actionBtn'),'click',action);listen($('pauseBtn'),'click',()=>{paused=true;openDialog('pauseDialog');});
listen($('pauseResume'),'click',()=>{paused=false;closeDialog('pauseDialog');});
listen($('pauseRestart'),'click',()=>{paused=false;closeDialog('pauseDialog');startStage(selected);});
for(const id of ['helpBtn','pauseHelp'])listen($(id),'click',()=>{if($('pauseDialog').open){$('pauseDialog').close();paused=false;}if(id==='helpBtn')$('battleScreen').querySelector('[data-wp-settings][aria-expanded="true"]')?.click();openDialog('helpDialog');});
listen($('helpClose'),'click',()=>closeDialog('helpDialog'));
listen($('resultStagesBtn'),'click',()=>switchScreen('stage'));listen($('retryBtn'),'click',()=>startStage(selected));listen($('nextStageBtn'),'click',()=>startStage(selected+1));
listen($('saveRetry'),'click',()=>{if(saveClear()){$('resultGoal').textContent=t.saved;$('nextStageBtn').disabled=run.level.id===30;}});
listen($('purchaseCancel'),'click',()=>closeDialog('purchaseDialog'));
listen($('purchaseConfirm'),'click',async()=>{if(busy||practice||practiceRequested)return;busy=true;$('purchaseConfirm').disabled=true;
  try{const transact=()=>purchaseAurora({read:()=>normalizeSave(read(SAVE_KEY),read(LEGACY_KEY)),write:next=>localStorage.setItem(SAVE_KEY,JSON.stringify(next)),wallet:window.WeightPlayWallet});
    const result=navigator.locks?await navigator.locks.request('weightplay-breakout-purchase',transact):transact();
    if(result.ok){save=result.save;closeDialog('purchaseDialog');renderEquipment();}else $('purchaseStatus').textContent=result.reason==='funds'?t.poor:t.saveError;
  }finally{busy=false;$('purchaseConfirm').disabled=false;}});
listen($('graphicsRetry'),'click',()=>{if(ensureScene()&&run){scene.setLevel(run,save.finish);fitCourt();startLoop();}});
listen($('board'),'pointerdown',e=>{if(!run||!scene||isBlocked()||settled)return;pointer=e.pointerId;$('board').setPointerCapture(e.pointerId);aim(run,scene.pointerX(e.clientX,e.clientY));});
listen($('board'),'pointermove',e=>{if(!run||!scene||isBlocked()||settled)return;if(e.pointerType==='mouse'||pointer===e.pointerId)aim(run,scene.pointerX(e.clientX,e.clientY));});
for(const name of ['pointerup','pointercancel','lostpointercapture'])listen($('board'),name,()=>{pointer=null;});
listen(window,'keydown',e=>{if(screen!=='battle'||settled||isBlocked()||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)||(e.key===' '&&e.target.closest('button')))return;
  const key=e.key.length===1?e.key.toLowerCase():e.key;if(['ArrowLeft','ArrowRight','a','d',' '].includes(key)){e.preventDefault();keys.add(key);if(key===' '&&!e.repeat)action();}if(key==='Escape'){paused=true;openDialog('pauseDialog');}});
listen(window,'keyup',e=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));
for(const dialog of document.querySelectorAll('dialog'))listen(dialog,'cancel',()=>{paused=false;queueMicrotask(startLoop);});
listen(window,'blur',()=>{keys.clear();pointer=null;});
listen(document,'visibilitychange',()=>{if(document.hidden){stop();if(screen==='battle'&&!settled)paused=true;}else if(paused&&!document.querySelector('dialog[open]'))openDialog('pauseDialog');});
listen(window,'weightplay:interaction-state',()=>{if(isBlocked())stop();else startLoop();});
listen(window,'resize',()=>{keys.clear();pointer=null;fitCourt();});
listen(reduced,'change',()=>{if(scene)scene.reduced=reduced.matches;});
listen(window,'storage',e=>{if(e.key===SAVE_KEY){save=normalizeSave(read(SAVE_KEY),read(LEGACY_KEY));refreshProgress();if(tab==='equipment')renderEquipment();}else if(e.key===window.WeightPlayWallet?.key&&tab==='equipment')renderEquipment();});
listen($('resultScreen'),'keydown',e=>{if(e.key!=='Tab')return;const buttons=[...$('resultScreen').querySelectorAll('button')].filter(b=>!b.hidden&&!b.disabled);const first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
listen(window,'pagehide',e=>{stop();if(!e.persisted){scene?.dispose();audio?.dispose();abort.abort();courtObserver.disconnect();}});
listen(window,'pageshow',e=>{if(e.persisted&&screen==='battle'&&!settled){paused=true;openDialog('pauseDialog');}});
const courtObserver=new ResizeObserver(()=>fitCourt());courtObserver.observe($('board'));
localize();switchScreen('main');
window.WPBreakoutDiagnostics=Object.freeze({snapshot:()=>({screen,status:run?.status,stage:run?.level.id,score:run?.score,lives:run?.lives,elapsed:run?.elapsed,paused,practice,raf:raf?1:0,geometry:run?{width:run.width,height:run.height}:null,render:scene?.metrics(),audio:audio?.stats()})});
await LocalPractice.register({gameId:'breakout',stageIds:LEVELS.map(l=>l.id),enable:enabled=>{practice=enabled;frame.stageUI.refresh(selected);if(!enabled&&practiceRequested){stop();switchScreen('main');}},startStage:id=>startStage(Number(id)-1)});
