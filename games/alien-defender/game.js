import {COPY} from './locales.js';
import {UPDATES} from './copy-updates.js';
import {createWorld,step,stageConfig,TOTAL_STAGES} from './model.js';
import {BattleScene} from './scene.js';
import {loadProgress,buyUpgrade,buySkin,settle,UPGRADES,upgradeCost} from './progress.js';
import {LocalPractice} from '../../src/game-local-practice.mjs';

for(const locale of Object.keys(COPY))Object.assign(COPY[locale],UPDATES[locale]);
const $=id=>document.getElementById(id),canvas=$('gameCanvas'),abort=new AbortController();
const on=(node,name,handler,options={})=>node.addEventListener(name,handler,{...options,signal:abort.signal});
let locale=COPY[document.documentElement.lang]?document.documentElement.lang:'en';
const t=(key,vars={})=>Object.entries(vars).reduce((text,[k,v])=>text.replaceAll(`{${k}}`,v),COPY[locale][key]??COPY.en[key]??key);
let storage;try{storage=window.localStorage;}catch{storage={getItem:()=>null,setItem:()=>{throw Error('Storage unavailable');}};}
let progress=loadProgress(storage),selected=0,screen='main',world=null,scene=null,raf=0,last=0,ending=0,messageUntil=5,practice=false,focused=true,disposed=false;
const keys={},pointers=new Map();let drag=null,targetX=null,pulse=false;
const audio=window.WeightPlayAudio?.createScope();
const sound=id=>audio?.play(id);
const soundMap={fire:'weapon.laser.fire',hit:'impact.metal',armor:'impact.metal',kill:'enemy.defeat',block:'combat.block',shield:'combat.block',hurt:'player.hurt',pulse:'magic.cast',pickup:'reward.collect'};
const track=(event,detail={})=>{if(!practice)window.WonderAnalytics?.track?.(event,{game_id:'alien-defender',game_version:'v62',interface_version:'9',stage_id:world?.config.stage,...detail});};
function text(){document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.querySelectorAll('[data-copy]').forEach(n=>n.textContent=t(n.dataset.copy));document.querySelectorAll('[data-copy-aria]').forEach(n=>n.setAttribute('aria-label',t(n.dataset.copyAria)));canvas.setAttribute('aria-label',t('canvasLabel'));$('localeSelect').value=locale;refresh();}
function refresh(){
 const unlocked=practice?30:progress.unlocked;
 $('mainProgress').textContent=$('stageProgressText').textContent=t('stageProgress',{stage:unlocked,total:30,unlocked});
 $('creditValue').textContent=$('shopCreditValue').textContent=progress.credits;
 for(const button of document.querySelectorAll('[data-upgrade]')){const key=button.dataset.upgrade,rule=UPGRADES[key];button.querySelector('[data-upgrade-level]').textContent=`${progress[key]} / ${rule.max}`;button.querySelector('[data-upgrade-cost]').textContent=t('upgradeCost',{cost:upgradeCost(progress,key)});button.querySelector('[data-upgrade-action]').textContent=t(progress[key]>=rule.max?'maxed':'buy');button.disabled=progress[key]>=rule.max;}
 $('diamondBalance').textContent=window.WeightPlayWallet?.read().diamonds||0;$('skinPrice').textContent=t(progress.skin?'owned':'skinCost');$('skinBtn').disabled=progress.skin||practice;
}
function release(){for(const id of pointers.keys())try{$(pointers.get(id)+'Btn')?.releasePointerCapture(id);}catch{}pointers.clear();for(const key of Object.keys(keys))keys[key]=false;targetX=null;drag=null;pulse=false;document.querySelectorAll('.is-held').forEach(n=>n.classList.remove('is-held'));}
function paused(){return document.hidden||!focused||!$('leaveDialog').hidden||!!document.querySelector('[data-wp-settings][aria-expanded="true"]');}
function show(next){
 cancelAnimationFrame(raf);raf=0;release();audio?.stop();screen=next;$('upgradePanel').hidden=true;$('skinConfirm').hidden=true;$('shopBtn').setAttribute('aria-pressed','false');$('stageWorkspace').inert=false;
 const active=next==='result'?'battle':next;document.body.dataset.screen=active;
 if(next==='result')document.body.dataset.wpGameSubstate='result';else delete document.body.dataset.wpGameSubstate;
 for(const name of ['main','stage','battle'])$(name+'Screen').hidden=name!==active;
 $('resultScreen').hidden=next!=='result';$('leaveDialog').hidden=true;
 for(const id of ['gameCanvas','leftBtn','rightBtn','fireBtn','pulseBtn','restartBtn'])$(id).inert=next==='result';
 frame.frame.activate(active);refresh();
 if(next==='stage')frame.stageUI.refresh(selected);
 if(next==='main')$('startBtn').focus({preventScroll:true});
 if(next==='result')$('resultStages').focus({preventScroll:true});
}
function ensureScene(){if(scene)return true;try{scene=new BattleScene(canvas,{reduced:matchMedia('(prefers-reduced-motion: reduce)').matches});return true;}catch(error){console.error('Alien Defender WebGL initialization failed',error);$('battleMessage').textContent=t('renderError');$('battleMessage').classList.add('is-visible');return false;}}
function start(index=selected){
 const next=Math.max(0,Math.min(29,Number(index)||0));if(next>=(practice?30:progress.unlocked)){sound('feedback.error');return;}
 selected=next;show('battle');if(!ensureScene())return;
 scene.resize();world=createWorld(next+1,progress,canvas.clientHeight/Math.max(1,canvas.clientWidth));scene.reset();ending=0;last=0;messageUntil=5;updateHud();
 window.WeightPlayAudio?.preload?.([...new Set([...Object.values(soundMap),'combat.shield.break','explosion.large','result.win','result.lose'])]);
 $('battleMessage').textContent=`${t(stageConfig(next+1).ruleKey)} · ${t('how2')}`;$('battleMessage').classList.add('is-visible');
 $('leaveDialogTitle').textContent=t('leaveTitle');scene.draw(world,0);
 // The authenticated practice entry can legitimately start at Battle. Its
 // initial GPU frame, rather than a now-hidden Main poster, settles loading.
 window.WeightPlayGameEntryLoader?.ready?.();canvas.focus({preventScroll:true});focused=true;track('stage_start');kick();
}
function kick(){if(!raf&&!disposed&&screen==='battle'&&world&&!document.hidden)raf=requestAnimationFrame(loop);}
function updateHud(){if(!world)return;$('waveValue').textContent=`${world.config.stage} / 30`;$('scoreValue').textContent=world.score;$('shieldValue').textContent=world.shield;$('livesValue').textContent=world.lives;$('salvageValue').textContent=world.credits;$('formationValue').textContent=`${world.kills} / ${world.total}`;$('comboValue').textContent=world.combo>1?`×${world.combo}`:'';$('pulseValue').textContent=`${Math.floor(world.pulse)} / 6`;$('pulseBtn').disabled=world.pulse<6;$('pulseBtn').classList.toggle('ready',world.pulse>=6);canvas.dataset.enemies=world.total-world.kills;canvas.dataset.outcome=world.status;}
function loop(now){raf=0;if(screen!=='battle'||!scene||!world)return;const dt=last?Math.min(.033,(now-last)/1000):0;last=now;
 if(paused()){release();last=0;return;}
 world.aspect=scene.resize()||world.aspect;
 if(world.status==='playing'){
  const held=key=>keys[key]||[...pointers.values()].includes(key);
  step(world,dt,{left:held('left'),right:held('right'),fire:held('fire')||drag!==null,targetX,pulse});pulse=false;
  const events=world.events.splice(0);scene.consume(events);for(const e of events){if(soundMap[e.type])sound(e.type==='shield'&&world.shield===0?'combat.shield.break':e.type==='kill'&&e.kind==='boss'?'explosion.large':soundMap[e.type]);if(e.type==='phase'){$('battleMessage').textContent=`${t('boss')} · ${['I','II','III'][e.phase]} / III`;messageUntil=world.time+2;$('battleMessage').classList.add('is-visible');}}updateHud();
  if(world.time>messageUntil)$('battleMessage').classList.remove('is-visible');
 }else{ending+=dt;if(ending>.65){finish();return;}}
 const field=canvas.getBoundingClientRect(),target=$('salvageValue').getBoundingClientRect();scene.rewardTarget={x:100*(target.x+target.width/2-field.x)/field.width,y:(target.y+target.height/2-field.y)/field.height};
 scene.draw(world,dt);kick();
}
function finish(){if(screen!=='battle')return;const won=world.status==='won';let result={ok:true,next:progress,earned:0};
 if(!practice){result=settle(storage,progress,world);if(result.ok)progress=result.next;}
 show('result');$('resultTitle').textContent=t(won?'winTitle':'loseTitle');$('resultCopy').textContent=t(won?'stageResultWin':'stageResultFail',{stage:world.config.stage});
 $('resultGoal').textContent=!result.ok?t('saveError'):t(won?(selected===29?'stageFinalGoal':'stageWinGoal'):'stageFailGoal',{stage:world.config.stage,credits:result.earned,shots:progress.firepower});
 $('resultScore').textContent=world.score;$('resultBest').textContent=progress.best;$('resultWave').textContent=`${world.config.stage} / 30`;$('resultCredits').textContent=result.earned;
 $('nextStageBtn').disabled=!won||selected>=29||(!practice&&selected+1>=progress.unlocked);$('nextStageBtn').setAttribute('aria-disabled',String($('nextStageBtn').disabled));
 window.ShowResultGet?.('alien-defender',won&&result.ok&&!practice);
 if(won&&result.ok&&!practice)window.WonderAnalytics?.completeStage?.(world.config.stage);
 track('result',{outcome:won?'win':'lose',persisted:result.ok});sound(won?'result.win':'result.lose');
}
function openShop(){release();$('upgradePanel').hidden=false;$('stageWorkspace').inert=true;$('shopBtn').setAttribute('aria-pressed','true');$('shopMessage').textContent='';refresh();if(ensureScene())for(const button of [...document.querySelectorAll('[data-upgrade]'),$('skinBtn')]){if(button.querySelector('img'))continue;const img=new Image();img.src=scene.icon(button.dataset.upgrade||'skin');img.alt='';img.className='equipment-art';button.prepend(img);}document.querySelector('[data-upgrade]').focus({preventScroll:true});}
function closeShop(){$('upgradePanel').hidden=true;$('skinConfirm').hidden=true;$('stageWorkspace').inert=false;$('shopBtn').setAttribute('aria-pressed','false');$('shopBtn').focus({preventScroll:true});frame.stageUI.refresh(selected);}
let pendingAction='leave';
function pauseDialog(action='leave'){if(screen==='result'){show('stage');return;}release();pendingAction=action;$('leaveDialog').hidden=false;$('leaveBtn').textContent=t(action==='restart'?'restart':'leave');$('continueBtn').focus({preventScroll:true});}
const frame=window.mountAlienDefenderFrame({t,stageConfig,getSelected:()=>selected,getUnlocked:()=>practice?30:progress.unlocked,getFirepower:()=>progress.firepower,setSelected:index=>selected=index,start});
document.querySelector('.battle-stage').append($('resultScreen'));
document.querySelector('.result-actions').prepend($('nextStageBtn'));
text();show('main');
on($('startBtn'),'click',()=>{sound('ui.click');show('stage');});on($('stageBackBtn'),'click',()=>show('main'));on($('battleBackBtn'),'click',()=>pauseDialog());on($('restartBtn'),'click',()=>pauseDialog('restart'));
on($('continueBtn'),'click',()=>{$('leaveDialog').hidden=true;canvas.focus({preventScroll:true});last=0;kick();});on($('leaveBtn'),'click',()=>pendingAction==='restart'?start(selected):show('stage'));
on($('resultStages'),'click',()=>show('stage'));on($('retryBtn'),'click',()=>start(selected));on($('nextStageBtn'),'click',()=>{if(!$('nextStageBtn').disabled)start(selected+1);});
on($('shopBtn'),'click',()=>{$('upgradePanel').hidden?openShop():closeShop();});on($('closeShopBtn'),'click',closeShop);
for(const button of document.querySelectorAll('[data-upgrade]'))on(button,'click',()=>{
 if(practice)return;progress=loadProgress(storage);const result=buyUpgrade(storage,progress,button.dataset.upgrade);if(result.ok){progress=result.next;$('shopMessage').textContent=t('owned');sound('reward.upgrade');}else{$('shopMessage').textContent=t(result.reason==='save'?'saveError':'needFunds');sound('feedback.error');}refresh();
});
on($('skinBtn'),'click',()=>{if(!progress.skin){$('skinConfirm').hidden=false;$('confirmSkinBtn').focus({preventScroll:true});}});on($('cancelSkinBtn'),'click',()=>{$('skinConfirm').hidden=true;$('skinBtn').focus({preventScroll:true});});
let purchasing=false;on($('confirmSkinBtn'),'click',async()=>{if(purchasing||practice)return;purchasing=true;try{
 const purchase=async ()=>{progress=loadProgress(storage);const result=(await buySkin(storage,progress,window.WeightPlayWallet));if(result.next)progress=result.next;$('shopMessage').textContent=t(result.ok?'owned':result.reason==='funds'?'needFunds':'saveError');sound(result.ok?'shop.purchase':'feedback.error');refresh();$('skinConfirm').hidden=true;};
 if(navigator.locks)await navigator.locks.request('weightplay-alien-defender-purchase',purchase);else purchase();
 }finally{purchasing=false;}});
for(const key of ['left','right','fire']){const button=$(key+'Btn');on(button,'pointerdown',e=>{if(screen!=='battle'||paused()||e.button>0)return;e.preventDefault();button.setPointerCapture(e.pointerId);pointers.set(e.pointerId,key);button.classList.add('is-held');window.WeightPlayAudio?.unlock?.();});const up=e=>{pointers.delete(e.pointerId);if(![...pointers.values()].includes(key))button.classList.remove('is-held');};for(const name of ['pointerup','pointercancel','lostpointercapture'])on(button,name,up);}
on($('pulseBtn'),'click',()=>{if(screen==='battle'&&!paused()){pulse=true;canvas.focus({preventScroll:true});}});
const aim=e=>{const r=canvas.getBoundingClientRect();targetX=(e.clientX-r.left)/r.width*100;};
on(canvas,'pointerdown',e=>{if(screen!=='battle'||paused()||drag!==null||e.button>0)return;e.preventDefault();drag=e.pointerId;canvas.setPointerCapture(drag);aim(e);window.WeightPlayAudio?.unlock?.();});on(canvas,'pointermove',e=>{if(e.pointerId===drag)aim(e);});for(const event of ['pointerup','pointercancel','lostpointercapture'])on(canvas,event,e=>{if(e.pointerId===drag){drag=null;targetX=null;}});
const keyMap={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',Space:'fire'};
on(window,'keydown',e=>{if(e.code==='Escape'){if(!$('upgradePanel').hidden)closeShop();else if(screen==='battle'){if(!$('leaveDialog').hidden)$('continueBtn').click();else pauseDialog();}return;}if(screen!=='battle'||paused()||e.target.closest('button,select,input'))return;if(keyMap[e.code]){e.preventDefault();keys[keyMap[e.code]]=true;}if(e.code==='KeyE'&&!e.repeat)pulse=true;});
on(window,'keyup',e=>{if(keyMap[e.code])keys[keyMap[e.code]]=false;});
on(window,'blur',()=>{focused=false;release();audio?.stop();});on(window,'focus',()=>{focused=true;last=0;kick();});on(document,'visibilitychange',()=>{release();last=0;if(!document.hidden){focused=document.hasFocus();kick();}else audio?.stop();});
const settingsObserver=new MutationObserver(()=>{if(paused()){release();audio?.stop();}else{last=0;kick();}});settingsObserver.observe($('gameFrame'),{subtree:true,attributes:true,attributeFilter:['aria-expanded']});
on($('localeSelect'),'change',e=>{locale=COPY[e.target.value]?e.target.value:'en';text();frame.stageUI.refresh(selected);});
on(window,'resize',()=>{if(world&&scene&&screen!=='main'){world.aspect=scene.resize()||world.aspect;scene.draw(world,0);}});
on(canvas,'webglcontextlost',e=>{e.preventDefault();release();cancelAnimationFrame(raf);raf=0;$('battleMessage').textContent=t('renderError');$('battleMessage').classList.add('is-visible');});
on(window,'pagehide',event=>{release();audio?.stop();cancelAnimationFrame(raf);raf=0;if(event.persisted)return;disposed=true;settingsObserver.disconnect();abort.abort();scene?.dispose();audio?.dispose();});
on(window,'pageshow',()=>{focused=document.hasFocus();last=0;kick();});
window.AlienDefenderDiagnostics=Object.freeze({snapshot:()=>world?{stage:world.config.stage,status:world.status,kills:world.kills,score:world.score,lives:world.lives,shield:world.shield,credits:world.credits,phase:world.phase,time:world.time,playerX:world.player.x,shots:world.shots.length,practice}:null,resources:()=>scene?.stats()});
LocalPractice.register({gameId:'alien-defender',stageIds:Array.from({length:TOTAL_STAGES},(_,i)=>i+1),enable:enabled=>{practice=enabled;refresh();frame.stageUI.refresh(selected);},startStage:id=>start(Number(id)-1)});
