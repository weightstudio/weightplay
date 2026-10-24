import { GAME_ID, SAVE_KEY, STEP, AUDIO_EVENTS, groundHeight, habitat } from './content.mjs';
import { createLife, step, growthProgress, lifeSummary } from './simulation.mjs';
import { createWorld } from './world.js';
import { LOCALES, SEGMENTS, text, creatureName } from './locales.mjs';

const $=id=>document.getElementById(id), abort=new AbortController();
const listen=(node,event,fn,opts={})=>node.addEventListener(event,fn,{...opts,signal:abort.signal});
const locale=LOCALES.includes(document.documentElement.lang)?document.documentElement.lang:'en';
const t=key=>text(locale,key), name=p=>creatureName(locale,p.origin,p.form);
const title=window.WEIGHTPLAY_GAME_TITLES[GAME_ID][locale];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const main=$('mainScreen'),battle=$('battleScreen'),worldElement=$('world'),overlay=$('overlay');
battle.setAttribute('data-runtime-localize','off');
let records={best:0,lives:0,discoveries:[],moonTrail:false};
try{const raw=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');if(raw&&typeof raw==='object')records={best:Math.max(0,Number(raw.best)||0),lives:Math.max(0,Number(raw.lives)||0),discoveries:Array.isArray(raw.discoveries)?raw.discoveries.filter(x=>typeof x==='string').slice(0,32):[],moonTrail:raw.moonTrail===true};}catch{}
let life=createLife(randomSeed()),world=null,scene='main',modal=null,lastFocus=null,frameId=0,lastTime=0,accumulator=0,lastEvent=0,noticeUntil=0,nameUntil=0,hintUntil=0,settingsOpen=false,contextLost=false,settled=false,disposed=false;
const keys=new Set(),held={attack:false,dash:false};
let modalAbort=null;
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
function playing(){return scene==='battle'&&life.status==='alive'&&!modal&&!settingsOpen&&!contextLost&&!document.hidden;}
function clearInput(){keys.clear();held.attack=false;held.dash=false;joystick?.reset();$('attackBtn').classList.remove('held');$('dashBtn').classList.remove('held');accumulator=0;}
function syncInput(){clearInput();joystick.setEnabled(playing());}
function enterScene(next){scene=next;clearInput();$('mainGroup').hidden=next!=='main';battle.hidden=next!=='battle';document.body.dataset.screen=next;frame.activate(next);joystick.setEnabled(playing());world?.resize();if(next==='battle'){window.WeightPlayBattleCanvas?.sync?.();worldElement.focus({preventScroll:true});}else{$('startBtn').focus({preventScroll:true});audio?.stop();}}
function notice(primary,secondary='',seconds=3){$('worldNotice').replaceChildren();const b=document.createElement('span');b.textContent=primary;$('worldNotice').append(b);if(secondary){const small=document.createElement('small');small.textContent=secondary;$('worldNotice').append(small);}$('worldNotice').dataset.visible='true';noticeUntil=life.time+seconds;}
function beginLife(){
  if(!world||contextLost)return;
  closeModal(false);life=createLife(randomSeed());settled=false;lastEvent=0;world.reset();nameUntil=8;hintUntil=records.lives===0?10:0;
  enterScene('battle');world.render(life,0,records.moonTrail);audio?.play('game.start');
  notice(t('born'),name(life.player),4);$('firstHint').textContent=t('controls');$('firstHint').hidden=hintUntil===0;
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
function pause(){if(scene!=='battle'||life.status!=='alive'||contextLost)return;showModal('pause',t('pause'),[paragraph(name(life.player)),paragraph(`${t('survived')} ${formatTime(life.time)} · ${t('food')} ${life.player.eaten}`),paragraph(t('leaveBody'))],[
  {label:t('resume'),run:()=>closeModal()}, {label:t('help'),run:help}, {label:t('appearance'),run:appearance},
  {label:t('leave'),run:()=>{remember(false);closeModal(false);enterScene('main');}},
]);}
function help(){const orla=document.createElement('img');orla.className='life-portrait';orla.src='/assets/weightplay-character-moon-cap-owl-block-v1.webp';orla.alt='Moon Cap Orla';showModal('help',t('help'),[orla,paragraph(t('rules')),paragraph(t('controls')),paragraph(t('progress'))],[{label:t('resume'),run:()=>closeModal()},{label:t('back'),run:pause}]);}
function appearance(){
  const image=document.createElement('img');image.className='life-portrait';image.src='/assets/weightplay-character-moon-cap-owl-block-v1.webp';image.alt=t('appearance');
  const wallet=document.createElement('div');wallet.className='diamond-balance';
  const gem=document.createElement('img');gem.src='/assets/weightplay-diamond.svg';gem.alt=t('balance');const amount=document.createElement('b');amount.textContent=String(window.WeightPlayWallet?.read()?.diamonds||0);wallet.append(gem,amount);
  const status=document.createElement('p');status.className='dialog-status';status.setAttribute('role','status');
  showModal('appearance',t('appearance'),[image,paragraph(t('cosmetic')),wallet,status],[{label:records.moonTrail?t('owned'):t('purchase'),disabled:records.moonTrail,run:()=>{
    const w=window.WeightPlayWallet;if((w?.read()?.diamonds||0)<3){status.textContent=t('noFunds');return;}
    try{
      if(!w.spendDiamonds(3)){status.textContent=t('noFunds');return;}
      records.moonTrail=true;if(!save()){records.moonTrail=false;w.addDiamonds(3);status.textContent=t('saveWarning');return;}
      audio?.play('shop.purchase');appearance();
    }catch{status.textContent=t('saveWarning');}
  }},{label:t('back'),run:pause}]);
}
function remember(died){
  if(settled)return;settled=true;const summary=lifeSummary(life);records.best=Math.max(records.best,summary.seconds);records.lives++;
  records.discoveries=[...new Set([...records.discoveries,`${summary.origin}:${summary.form}`])].slice(-32);save();
  if(died){
    const stats=document.createElement('div');stats.className='life-stats';
    for(const [label,value] of [[t('survived'),formatTime(summary.seconds)],[t('food'),summary.eaten],[t('kills'),summary.kills],[t('best'),formatTime(records.best)]]){const box=document.createElement('div'),b=document.createElement('b'),span=document.createElement('span');b.textContent=String(value);span.textContent=label;box.append(b,span);stats.append(box);}
    showModal('result',t('death'),[paragraph(name(life.player)),paragraph(`${t('cause')} · ${t(summary.cause)}`),stats],[{label:t('rebirth'),run:beginLife},{label:t('leave'),run:()=>{closeModal(false);enterScene('main');}}]);
    audio?.play('result.lose');
  }
}
function formatTime(seconds){return `${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;}
function processEvents(){
  for(const e of life.events){if(e.id<=lastEvent)continue;lastEvent=e.id;
    const ids={food:'reward.collect',evolution:'reward.upgrade',dash:'movement.dash',hurt:'player.hurt',defeat:'enemy.defeat',water:'water.splash',hungry:'alert.warning',danger:'alert.warning'};
    if(ids[e.type])audio?.play(ids[e.type]);if(e.type==='hit')audio?.play(e.heavy?'combat.critical':'combat.strike');
    if(e.type==='evolution'){nameUntil=life.time+6;notice(t('evolved'),`${name(life.player)} · ${t(life.player.adaptation)}`,4);}
    if(e.type==='habitat')notice(t(e.biome),'',2.5);
    if(e.type==='hungry'||e.type==='danger')notice(t(e.type),'',3);
    if(e.type==='death')remember(true);
  }
}
function updateHud(){
  const p=life.player,b=worldElement.getBoundingClientRect();
  if(world&&b.width>0){const pos=world.project(p.x,groundHeight(p.x,p.z)+p.size*1.75+.1,p.z);$('creatureHud').style.left=`${pos.x/b.width*100}%`;$('creatureHud').style.top=`${pos.y/b.height*100}%`;}
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
  if(x===0&&z===0){x=j.x;z=j.y;}return {x,z,attack:held.attack||keys.has('Space'),dash:held.dash||keys.has('ShiftLeft')||keys.has('ShiftRight')};
}
function tick(now){
  if(disposed)return;const dt=lastTime?Math.min(.06,(now-lastTime)/1000):0;lastTime=now;
  if(playing()){
    accumulator=Math.min(.1,accumulator+dt);const input=getInput();let steps=0;
    while(accumulator>=STEP&&steps++<6){step(life,input);accumulator-=STEP;if(life.status==='dead')break;}
    processEvents();
  }else accumulator=0;
  if(scene==='battle'&&!document.hidden){world?.render(life,playing()?dt:0,records.moonTrail);updateHud();}
  frameId=requestAnimationFrame(tick);
}

listen($('startBtn'),'click',beginLife);listen($('battleBackBtn'),'click',pause);
for(const [id,action]of [['attackBtn','attack'],['dashBtn','dash']]){
  const node=$(id);
  listen(node,'pointerdown',e=>{if(!playing())return;e.preventDefault();node.setPointerCapture(e.pointerId);held[action]=true;node.classList.add('held');});
  const release=()=>{held[action]=false;node.classList.remove('held');};listen(node,'pointerup',release);listen(node,'pointercancel',release);listen(node,'lostpointercapture',release);
  listen(node,'keydown',e=>{if(e.code==='Enter'||e.code==='Space'){e.preventDefault();held[action]=true;node.classList.add('held');}});
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
  if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowLeft','ArrowDown','ArrowRight','Space','ShiftLeft','ShiftRight'].includes(e.code)){e.preventDefault();keys.add(e.code);}
});
listen(window,'keyup',e=>keys.delete(e.code));
listen(window,'blur',()=>{clearInput();});
listen(document,'visibilitychange',()=>{if(document.hidden&&scene==='battle'&&!modal&&life.status==='alive')pause();clearInput();lastTime=0;});
listen(window,'resize',()=>{syncInput();world?.resize();});
listen(window,'weightplay:interaction-state',()=>{const panel=battle.querySelector('.wp-frame-popover');settingsOpen=!!panel&&!panel.hidden;syncInput();});

function dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frameId);abort.abort();modalAbort?.abort();joystick.destroy();audio?.dispose();world?.dispose();frame.destroy();}
listen(window,'pagehide',e=>{audio?.stop();clearInput();if(!e.persisted)dispose();});
listen(window,'pageshow',()=>{lastTime=0;});

// Read-only instrumentation for resource trend checks; no mutation or test mode.
window.WildbornDiagnostics=Object.freeze({read:()=>Object.freeze({scene,paused:!playing(),time:life.time,origin:life.player.origin,form:life.player.form,fauna:life.fauna.length,food:life.food.length,render:world?.inspect()||null})});

try{
  await $('poster').decode();
  world=createWorld(worldElement,{onContextLost(){contextLost=true;showModal('error',t('renderError'),[],[{label:t('retry'),run:()=>location.reload()},{label:t('leave'),run:()=>{closeModal(false);enterScene('main');}}]);},onContextRestored(){contextLost=false;if(modal==='error')pause();}});
  world.render(life,0);$('startBtn').disabled=false;
  window.WeightPlayAudio?.preload(AUDIO_EVENTS);
  window.WeightPlayGameEntryLoader?.ready?.();
  frameId=requestAnimationFrame(tick);
}catch(error){
  $('entryError').hidden=false;$('entryError').textContent=t('renderError');$('startBtn').disabled=false;$('startBtn').textContent=t('retry');
  $('startBtn').addEventListener('click',()=>location.reload(),{once:true,signal:abort.signal});
  window.WeightPlayGameEntryLoader?.fail?.(t('renderError'),()=>location.reload());
  console.error('Wildborn initialization failed',error);
}
