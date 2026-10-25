import { GAME_ID, SAVE_KEY, LEGACY_SAVE_KEY, STEP, AUDIO_EVENTS, groundHeight, habitat } from './content.mjs';
import { createLife, step, growthProgress, lifeSummary, normalizeRecords,drawOrigin,inheritLife,checkpointLife,restoreLife } from './simulation.mjs';
import { createWorld } from './world.js';
import { LOCALES, SEGMENTS, text, creatureName } from './locales.mjs';

const $=id=>document.getElementById(id), abort=new AbortController();
const listen=(node,event,fn,opts={})=>node.addEventListener(event,fn,{...opts,signal:abort.signal});
const locale=LOCALES.includes(document.documentElement.lang)?document.documentElement.lang:'en';
const t=key=>text(locale,key), name=p=>creatureName(locale,p.species,p.form);
const title=window.WEIGHTPLAY_GAME_TITLES[GAME_ID][locale];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const main=$('mainScreen'),battle=$('battleScreen'),worldElement=$('world'),overlay=$('overlay');
battle.setAttribute('data-runtime-localize','off');
let records=normalizeRecords();
try{let raw,old;try{raw=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');}catch{}try{old=JSON.parse(localStorage.getItem(LEGACY_SAVE_KEY)||'null');}catch{}records=normalizeRecords(raw,old);}catch{}
let life=createLife(randomSeed()),world=null,scene='main',modal=null,lastFocus=null,frameId=0,lastTime=0,accumulator=0,lastEvent=0,noticeUntil=0,nameUntil=0,hintUntil=0,settingsOpen=false,contextLost=false,settled=false,disposed=false;
const keys=new Set(),held={attack:false,dash:false},queued={attack:false,dash:false};
let modalAbort=null;
let lastSaved=0;
const audio=window.WeightPlayAudio?.createScope();

document.title=`${title} | WeightPlay`;
document.querySelectorAll('[data-copy]').forEach(n=>n.textContent=t(n.dataset.copy));
document.querySelectorAll('[data-wp-game-title],[data-official-title]').forEach(n=>n.textContent=title);
$('poster').alt=title;$('gameGuide').ariaLabel=t('help');worldElement.ariaLabel=t('move');
$('mainReturn').ariaLabel=t('back');$('battleBackBtn').ariaLabel=t('back');$('mainReturn').href=`/${SEGMENTS[locale]}/index.html?preview=1`;
for(const key of ['health','hunger','growth','stamina'])$(key+'Bar').parentElement.setAttribute('aria-label',t(key));

const frame=window.WeightPlayScreenFrame.mount({root:$('gameFrame'),playUI:true,scenes:{
  main:{root:main,header:$('mainHeader'),content:$('mainContent')},
  battle:{root:battle,header:$('battleHeader'),content:$('playContent'),headerInfo:$('hud')},
}});
frame.activate('main');
const joystick=window.WeightPlayJoystick.create({surface:worldElement,container:worldElement,mode:'floating',anchor:{left:76,bottom:60},enabled:false,isEnabled:()=>playing()});

function randomSeed(){const value=new Uint32Array(1);crypto.getRandomValues(value);return value[0];}
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(records));return true;}catch{$('saveWarning').hidden=false;$('saveWarning').textContent=t('saveWarning');return false;}}
function saveLife(){if(scene==='battle'&&life.status==='alive'){records.checkpoint=checkpointLife(life);records.best=Math.max(records.best,Math.floor(life.time));lastSaved=life.time;return save();}return false;}
function mainAction(){$('startBtn').textContent=t(records.checkpoint?'continueSave':'start');}
function legacyText(gain=records.legacy){return `${t('health')} +${Math.round(gain.hp)} · ${t('power')} +${gain.power.toFixed(2)}`;}
function playing(){return scene==='battle'&&life.status==='alive'&&!modal&&!settingsOpen&&!contextLost&&!document.hidden;}
function clearInput(){keys.clear();held.attack=false;held.dash=false;queued.attack=false;queued.dash=false;joystick?.reset();$('attackBtn').classList.remove('held');$('dashBtn').classList.remove('held');accumulator=0;}
function syncInput(){clearInput();joystick.setEnabled(playing());}
function enterScene(next){scene=next;clearInput();$('mainGroup').hidden=next!=='main';battle.hidden=next!=='battle';document.body.dataset.screen=next;frame.activate(next);joystick.setEnabled(playing());world?.resize();if(next==='battle'){window.WeightPlayBattleCanvas?.sync?.();worldElement.focus({preventScroll:true});}else{mainAction();$('startBtn').focus({preventScroll:true});audio?.stop();}}
function notice(primary,secondary='',seconds=3){$('worldNotice').replaceChildren();const b=document.createElement('span');b.textContent=primary;$('worldNotice').append(b);if(secondary){const small=document.createElement('small');small.textContent=secondary;$('worldNotice').append(small);}$('worldNotice').dataset.visible='true';noticeUntil=life.time+seconds;}
function beginLife(resume=false){
  if(!world||contextLost)return;
  const restored=resume&&records.checkpoint?restoreLife(records.checkpoint):null;
  closeModal(false);life=restored||createLife(randomSeed(),{origin:drawOrigin(records),legacy:records.legacy,id:crypto.randomUUID()});settled=false;lastEvent=restored?life.eventId:0;world.reset(lastEvent);nameUntil=life.time+8;hintUntil=records.lives===0&&!restored?10:0;
  enterScene('battle');world.render(life,0,records.moonTrail);audio?.play('game.start');
  notice(t(restored?'continueSave':'born'),`${name(life.player)}${records.legacy.hp?` · ${t('legacy')}`:''}`,4);$('firstHint').textContent=t('controls');$('firstHint').hidden=hintUntil===0;saveLife();
  updateHud();
}
function paragraph(value){const p=document.createElement('p');p.textContent=value;return p;}
function showModal(kind,heading,nodes,actions){
  if(!modal)lastFocus=document.activeElement;modal=kind;syncInput();audio?.stop();
  modalAbort?.abort();modalAbort=new AbortController();
  $('dialogTitle').textContent=heading;$('dialogBody').replaceChildren(...nodes);$('dialogActions').replaceChildren();
  for(const action of actions){const button=document.createElement('button');button.type='button';button.textContent=action.label;button.disabled=!!action.disabled;button.addEventListener('click',action.run,{signal:modalAbort.signal});$('dialogActions').append(button);}
  overlay.hidden=false;worldElement.inert=true;frame.activate('battle',{covered:true});
  $('dialog').getAnimations().forEach(a=>a.cancel());$('dialog').animate(reduced.matches?[{opacity:.5},{opacity:1}]:[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:reduced.matches?80:220,easing:'ease-out'});
  $('dialogActions').querySelector('button:not(:disabled)')?.focus({preventScroll:true});
}
function closeModal(restore=true){modal=null;overlay.hidden=true;worldElement.inert=false;$('dialog').getAnimations().forEach(a=>a.cancel());if(scene==='battle')frame.activate('battle');syncInput();if(restore)worldElement.focus({preventScroll:true});}
function pause(){if(scene!=='battle'||life.status!=='alive'||contextLost)return;const saved=saveLife();showModal('pause',t('pause'),[paragraph(name(life.player)),paragraph(`${t('survived')} ${formatTime(life.time)} · ${t('food')} ${life.player.eaten}`),paragraph(`${t('legacy')} · ${legacyText()}`),paragraph(t(saved?'leaveBody':'saveWarning'))],[
  {label:t('resume'),run:()=>closeModal()}, {label:t('help'),run:help}, {label:t('appearance'),run:appearance},
  {label:t('leave'),run:()=>{saveLife();closeModal(false);enterScene('main');}},
]);}
function help(){const orla=document.createElement('img');orla.className='life-portrait';orla.src='/assets/weightplay-character-moon-cap-owl-block-v1.webp';orla.alt='Moon Cap Orla';showModal('help',t('help'),[orla,paragraph(t('rules')),paragraph(t('controls')),paragraph(t('progress'))],[{label:t('resume'),run:()=>closeModal()},{label:t('back'),run:pause}]);}
function appearance(){
  const image=document.createElement('img');image.className='life-portrait';image.src='/assets/weightplay-character-moon-cap-owl-block-v1.webp';image.alt=t('appearance');
  const wallet=document.createElement('div');wallet.className='diamond-balance';
  const gem=document.createElement('img');gem.src='/assets/weightplay-diamond.svg';gem.alt=t('balance');const amount=document.createElement('b');amount.textContent=String(window.WeightPlayWallet?.read()?.diamonds||0);wallet.append(gem,amount);
  const status=document.createElement('p');status.className='dialog-status';status.setAttribute('role','status');
  showModal('appearance',t('appearance'),[image,paragraph(t('cosmetic')),wallet,status],[{label:records.moonTrail?t('owned'):t('purchase'),disabled:records.moonTrail,run:()=>{
    const walletAction = () => {
    const w=window.WeightPlayWallet;if((w?.read()?.diamonds||0)<3){status.textContent=t('noFunds');return;}
    try{
      if(!w.spendDiamonds(3)){status.textContent=t('noFunds');return;}
      records.moonTrail=true;if(!save()){records.moonTrail=false;w.addDiamonds(3);status.textContent=t('saveWarning');return;}
      audio?.play('shop.purchase');appearance();
    }catch{status.textContent=t('saveWarning');}
  
    };
    return window.WeightPlayWallet?.withTransaction ? window.WeightPlayWallet.withTransaction("wildborn:game.js:anonymous@75", walletAction) : walletAction();
}},{label:t('back'),run:pause}]);
}
function remember(died){
  if(settled||!died)return;settled=true;const summary=lifeSummary(life);
  // Refresh only the settlement ledger to avoid duplicating a death opened in
  // another tab. Awards and the checkpoint tombstone share one storage write.
  try{const current=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');if(current?.schema===2&&current.settled?.includes(life.id))records=normalizeRecords(current);}catch{}
  const gain=inheritLife(records,life);save();mainAction();
  if(died){
    const stats=document.createElement('div');stats.className='life-stats';
    for(const [label,value] of [[t('survived'),formatTime(summary.seconds)],[t('food'),summary.eaten],[t('kills'),summary.kills],[t('best'),formatTime(records.best)]]){const box=document.createElement('div'),b=document.createElement('b'),span=document.createElement('span');b.textContent=String(value);span.textContent=label;box.append(b,span);stats.append(box);}
    const inheritance=paragraph(`${t('inheritGain')} · ${legacyText(gain)}\n${t('legacy')} · ${legacyText()}`);inheritance.className='legacy-gain';
    showModal('result',t('death'),[paragraph(name(life.player)),paragraph(`${t('cause')} · ${t(summary.cause)}`),inheritance,stats],[{label:t('rebirth'),run:()=>beginLife()},{label:t('leave'),run:()=>{closeModal(false);enterScene('main');}}]);
    audio?.play('result.lose');
  }
}
function formatTime(seconds){return `${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;}
function processEvents(){
  for(const e of life.events){if(e.id<=lastEvent)continue;lastEvent=e.id;
    const ids={food:'reward.collect',evolution:'reward.upgrade',dash:'movement.dash',hurt:'player.hurt',defeat:'enemy.defeat',water:'water.splash',hungry:'alert.warning',danger:'alert.warning',breath:'magic.fire'};
    if(ids[e.type])audio?.play(ids[e.type]);if(e.type==='hit')audio?.play(e.breath?'magic.hit':e.heavy?'combat.critical':'combat.strike');
    if(e.type==='evolution'){nameUntil=life.time+6;const saved=saveLife();notice(t('evolved'),`${creatureName(locale,e.from)} → ${creatureName(locale,e.species)}${saved?` · ${t('saved')}`:''}`,4);}
    if(e.type==='habitat')notice(t(e.biome),'',2.5);
    if(e.type==='hungry'||e.type==='danger')notice(t(e.type),'',3);
    if(e.type==='death')remember(true);
  }
}
function updateHud(){
  const p=life.player,b=worldElement.getBoundingClientRect();
  if(world&&b.width>0){const pos=world.project(p.x,groundHeight(p.x,p.z)+p.size*2.25+.1,p.z);$('creatureHud').style.left=`${pos.x/b.width*100}%`;$('creatureHud').style.top=`${pos.y/b.height*100}%`;}
  $('creatureName').textContent=name(p);$('creatureHud').dataset.named=String(life.time<nameUntil||p.hidden);
  const values={health:p.hp/p.maxHp,hunger:p.hunger/100,growth:growthProgress(p),stamina:p.stamina/100};
  for(const [key,value]of Object.entries(values)){$(key+'Bar').style.transform=`scaleX(${Math.max(0,value)})`;$(key+'Bar').parentElement.setAttribute('aria-valuenow',String(Math.round(value*100)));}
  $('coverStatus').textContent=p.hidden?t('hidden'):'';$('biomeText').textContent=t(habitat(p.x,p.z));
  $('timeText').textContent=`${t(Math.sin(life.time/240*Math.PI*2+.6)<-.35?'night':'day')} · ${formatTime(life.time)}`;
  $('dashBtn').disabled=p.stamina<28;$('worldNotice').dataset.visible=String(life.time<noticeUntil);$('firstHint').hidden=life.time>=hintUntil;
}
function getInput(){
  const j=joystick.getVector();let x=Number(keys.has('KeyD')||keys.has('ArrowRight'))-Number(keys.has('KeyA')||keys.has('ArrowLeft'));
  let z=Number(keys.has('KeyS')||keys.has('ArrowDown'))-Number(keys.has('KeyW')||keys.has('ArrowUp'));
  if(x===0&&z===0){x=j.x;z=j.y;}return {x,z,attack:queued.attack||held.attack||keys.has('Space'),dash:queued.dash||held.dash||keys.has('ShiftLeft')||keys.has('ShiftRight')};
}
function tick(now){
  if(disposed)return;const dt=lastTime?Math.min(.06,(now-lastTime)/1000):0;lastTime=now;
  if(playing()){
    accumulator=Math.min(.1,accumulator+dt);const input=getInput();let steps=0;
    while(accumulator>=STEP&&steps++<6){step(life,input);accumulator-=STEP;if(life.status==='dead')break;}
    if(steps>0){queued.attack=false;queued.dash=false;}
    processEvents();
    if(life.time-lastSaved>=5)saveLife();
  }else accumulator=0;
  if(scene==='battle'&&!document.hidden){world?.render(life,playing()?dt:0,records.moonTrail);updateHud();}
  frameId=requestAnimationFrame(tick);
}

listen($('startBtn'),'click',()=>beginLife(true));listen($('battleBackBtn'),'click',pause);
for(const [id,action]of [['attackBtn','attack'],['dashBtn','dash']]){
  const node=$(id);
  listen(node,'pointerdown',e=>{if(!playing())return;e.preventDefault();node.setPointerCapture(e.pointerId);held[action]=true;queued[action]=true;node.classList.add('held');});
  const release=()=>{held[action]=false;node.classList.remove('held');};listen(node,'pointerup',release);listen(node,'pointercancel',release);listen(node,'lostpointercapture',release);
  listen(node,'keydown',e=>{if(e.code==='Enter'||e.code==='Space'){e.preventDefault();held[action]=true;queued[action]=true;node.classList.add('held');}});
  listen(node,'keyup',e=>{if(e.code==='Enter'||e.code==='Space')release();});
}
listen(window,'keydown',e=>{
  if(e.defaultPrevented)return;
  if(modal){
    if(e.code==='Escape'&&life.status==='alive'&&!contextLost){e.preventDefault();closeModal();return;}
    if(e.code==='Tab'){const nodes=[...$('dialog').querySelectorAll('button:not(:disabled),a[href]')],first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}return;
  }
  if(e.code==='Escape'&&scene==='battle'&&!settingsOpen){e.preventDefault();pause();return;}
  if(!playing()||e.target.closest('button,select,input'))return;
  if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowLeft','ArrowDown','ArrowRight','Space','ShiftLeft','ShiftRight'].includes(e.code)){e.preventDefault();keys.add(e.code);if(e.code==='Space')queued.attack=true;if(e.code.startsWith('Shift'))queued.dash=true;}
});
listen(window,'keyup',e=>keys.delete(e.code));
listen(window,'blur',()=>{saveLife();clearInput();});
listen(document,'visibilitychange',()=>{if(document.hidden&&scene==='battle'&&!modal&&life.status==='alive')pause();clearInput();lastTime=0;});
listen(window,'resize',()=>{syncInput();world?.resize();});
listen(window,'weightplay:interaction-state',()=>{const panel=battle.querySelector('.wp-frame-popover');settingsOpen=!!panel&&!panel.hidden;syncInput();});

function dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frameId);abort.abort();modalAbort?.abort();joystick.destroy();audio?.dispose();world?.dispose();frame.destroy();}
listen(window,'pagehide',e=>{saveLife();audio?.stop();clearInput();if(!e.persisted)dispose();});
listen(window,'pageshow',()=>{lastTime=0;});

// Read-only instrumentation for resource trend checks; no mutation or test mode.
window.WildbornDiagnostics=Object.freeze({read:()=>JSON.parse(JSON.stringify({scene,paused:!playing(),time:life.time,origin:life.player.origin,species:life.player.species,form:life.player.form,player:life.player,legacy:records.legacy,checkpoint:!!records.checkpoint,fauna:life.fauna.length,food:life.food.length,nearbyFood:life.food.map(f=>({x:f.x,z:f.z,kind:f.kind})).sort((a,b)=>Math.hypot(a.x-life.player.x,a.z-life.player.z)-Math.hypot(b.x-life.player.x,b.z-life.player.z)).slice(0,12),nearbyFauna:life.fauna.map(a=>({x:a.x,z:a.z,kind:a.kind,power:a.power,hp:a.hp,state:a.state})),render:world?.inspect()||null}))});

try{
  await $('poster').decode();
  world=createWorld(worldElement,{onContextLost(){contextLost=true;showModal('error',t('renderError'),[],[{label:t('retry'),run:()=>location.reload()},{label:t('leave'),run:()=>{closeModal(false);enterScene('main');}}]);},onContextRestored(){contextLost=false;if(modal==='error')pause();}});
  world.render(life,0);$('startBtn').disabled=false;mainAction();
  window.WeightPlayAudio?.preload(AUDIO_EVENTS);
  window.WeightPlayGameEntryLoader?.ready?.();
  frameId=requestAnimationFrame(tick);
}catch(error){
  $('entryError').hidden=false;$('entryError').textContent=t('renderError');$('startBtn').disabled=false;$('startBtn').textContent=t('retry');
  $('startBtn').addEventListener('click',()=>location.reload(),{once:true,signal:abort.signal});
  window.WeightPlayGameEntryLoader?.fail?.(t('renderError'),()=>location.reload());
  console.error('Wildborn initialization failed',error);
}
