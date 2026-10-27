import {ROUTES,MODULES,newRun,fit,toggle,usedPower,chooseBranch,pulse,depart,upgrade,step,drainEvents,normalizeSave,mergeSave,recordWin} from './model.js';
import {createScene} from './scene.js';
import {COPY,GUIDE,GUIDE_SECTIONS,LOCALES,SEGMENTS,NATIVE} from './i18n.js';
const $=id=>document.getElementById(id),GAME='railguard-express',SAVE='weightplay.railguard-express.v1';
let locale=LOCALES[SEGMENTS.indexOf(location.pathname.split('/')[1])]||'en';
const t=k=>COPY[locale][k],title=()=>window.WEIGHTPLAY_GAME_TITLES[GAME][locale];
function validSavedProgress(value){return value===null||(value&&typeof value==='object'&&!Array.isArray(value)&&(value.schema===undefined||value.schema===1)&&(value.unlocked===undefined||(Number.isInteger(value.unlocked)&&value.unlocked>=1&&value.unlocked<=ROUTES.length))&&(value.cleared===undefined||(Array.isArray(value.cleared)&&value.cleared.every(n=>Number.isInteger(n)&&n>=1&&n<=ROUTES.length))));}
function readSavedProgress(){const raw=localStorage.getItem(SAVE),value=raw===null?null:JSON.parse(raw);if(raw!==null&&(value===null||!validSavedProgress(value)))throw Error('invalid saved progress');return value;}
let save=normalizeSave(null),storageOK=true;
try{save=normalizeSave(readSavedProgress());}catch{storageOK=false;}
// Session-only reporting; the shared ledger remains the sole reward owner.
const launchKey='weightplayCollectionLaunchV1',excludedLaunchKeys=['preview','practice','trial','qa','test','lobbyPreview','lobby-preview'];
function generalLaunch(){try{const q=new URLSearchParams(location.search);if(excludedLaunchKeys.some(k=>q.has(k)))return false;const marker=JSON.parse(sessionStorage.getItem(launchKey)||'null'),age=Date.now()-Number(marker?.launchedAt),path=location.pathname.replace(/\/+$/,'')+'/';return marker?.version===1&&marker.domain==='general'&&marker.gameId===GAME&&marker.path===path&&Number.isFinite(age)&&age>=0&&age<=8*60*60*1000;}catch{return false;}}
const pendingClears=[];let rewardRound=null,flushingClears=false;
// Read-only acknowledgement: end() confirms a lifecycle, not a Castle write.
function stageReceipt(stage){try{const raw=localStorage.getItem('weightplayCastleV1');if(raw===null)return false;const ledger=JSON.parse(raw);if(!ledger||typeof ledger!=='object'||Array.isArray(ledger)||![1,2,3].includes(ledger.version)||(ledger.worldSchema!=null&&ledger.worldSchema!==1)||(ledger.completions!=null&&(!ledger.completions||typeof ledger.completions!=='object'||Array.isArray(ledger.completions))))return null;return Boolean(ledger.completions?.[`${GAME}:stage-${stage}`]);}catch{return null;}}
function flushClears(){if(flushingClears||!generalLaunch())return;flushingClears=true;try{const game=window.WonderAnalytics?.game;if(game?.supportsRewardEligibility!==true||game?.supportsSavedCompletionGate!==true||typeof game.start!=='function'||typeof game.end!=='function')return;
 for(const item of [...pendingClears]){if(!generalLaunch())return;const receipt=stageReceipt(item.stage);if(receipt===null)return;if(receipt){pendingClears.splice(pendingClears.indexOf(item),1);continue;}if(item.attempted)continue;item.attempted=true;if(game.start({roundKey:item.key,stageId:item.stage,rewardEligible:true})==null){item.attempted=false;return;}if(!generalLaunch())return;if(game.end('win',item.stage,{saveSucceeded:true})!==true)return;if(stageReceipt(item.stage)===true)pendingClears.splice(pendingClears.indexOf(item),1);}
 }catch{/* Collector is optional and may become ready later. */}finally{flushingClears=false;}}
function beginRewardRound(stage){rewardRound={stage,eligible:generalLaunch()};flushClears();}
function finishRewardRound(win,saved){const round=rewardRound;rewardRound=null;if(win&&saved&&round?.eligible&&generalLaunch()&&Number.isInteger(round.stage)&&round.stage>=1&&round.stage<=ROUTES.length){const previous=pendingClears.find(x=>x.stage===round.stage);if(!previous)pendingClears.push({stage:round.stage,key:{},attempted:false});else if(previous.attempted){previous.key={};previous.attempted=false;}}flushClears();}
window.addEventListener('weightplay:analytics-ready',flushClears);
window.addEventListener('weightplay:castle-ready',flushClears);
let screen='main',state=null,scene=null,stageController=null,selected=0,paused=false,overlayKind='',last=0,accumulator=0,raf=0;
let stageSelection=save.unlocked-1;
let modalReturnFocus=null;
const sound=window.WeightPlayAudio.createScope(GAME);
const SFX=['ui.click','feedback.error','board.move','game.start','game.checkpoint','reward.upgrade','weapon.gun.fire','weapon.laser.fire','magic.ice','magic.cast','impact.metal','player.hurt','combat.block','combat.shield.break','magic.shield','magic.heal','enemy.defeat','alert.boss','alert.warning','result.win','result.lose'];
window.WeightPlayAudio.preload(SFX);
for(let i=0;i<LOCALES.length;i++)$('locale').add(new Option(NATIVE[i],LOCALES[i]));
$('battleContent').prepend($('stats'));
const statValues={};
for(const [id,key]of [['hull','hull'],['power','power'],['wave','wave']]){const label=document.createElement('span'),value=document.createElement('strong');label.textContent=t(key);$(id).replaceChildren(label,value);statValues[id]=value;}
const frame=window.WeightPlayScreenFrame.mount({root:$('gameFrame'),localeSelect:$('locale'),playUI:true,scenes:{
 main:{root:$('main'),header:$('mainHeader'),content:$('hero')},
 stage:{root:$('stage'),header:$('stageHeader'),content:$('stageContent')},
 battle:{root:$('battle'),header:$('battleHeader'),content:$('battleContent'),headerInfo:$('stats')}
}});
const info=window.WeightPlayScreenFrame.createGroup();[...$('stats').children].forEach(n=>info.add(n));frame.battleTopUI.add(info);
const progress=window.WeightPlayScreenFrame.createGroup();progress.add($('stageProgress'));frame.stageTopUI.add(progress);
const stagesTab=document.createElement('button');stagesTab.type='button';stagesTab.id='stagesTab';stagesTab.dataset.t='stages';stagesTab.dataset.wpFrameStageSlot='stages';stagesTab.setAttribute('role','tab');stagesTab.setAttribute('aria-selected','true');stagesTab.addEventListener('click',()=>{if(screen==='stage')showStages();});frame.commonDownButton.add(stagesTab);stagesTab.parentElement.dataset.wpFrameStageNav='';
function speak(id){sound.play(id);}
function notice(key){$('notice').textContent=t(key);$('notice').classList.remove('ack');void $('notice').offsetWidth;$('notice').classList.add('ack');}
function persist(){try{const previous=readSavedProgress(),merged=mergeSave(save,previous),bytes=JSON.stringify({...previous,...merged});localStorage.setItem(SAVE,bytes);if(localStorage.getItem(SAVE)!==bytes)throw Error('save not confirmed');save=merged;storageOK=true;return true;}catch{storageOK=false;return false;}}
function translate(){
 document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.title=title()+' | WeightPlay';
 document.querySelectorAll('[data-t]').forEach(n=>n.textContent=t(n.dataset.t));$('officialTitle').textContent=title();$('locale').value=locale;
 $('summary').textContent=t('intro');$('guideText').replaceChildren();
 for(const [heading,copy]of GUIDE_SECTIONS[locale]){const section=document.createElement('section');section.className='game-info-section';const h=document.createElement('h3'),p=document.createElement('p');h.textContent=heading;p.textContent=copy;section.append(h,p);$('guideText').append(section);}
 $('saveNote').textContent=t(storageOK?'saved':'storage');$('progress').textContent=`${save.cleared.length} / ${ROUTES.length}`;
 $('help').setAttribute('aria-label',t('help'));$('arena').setAttribute('aria-label',title());
 document.querySelectorAll('[data-wp-gameplay-tags] span').forEach((n,i)=>n.textContent=t(['fit','power','upgrade'][i]));
 $('lobbyBack').href='/'+SEGMENTS[LOCALES.indexOf(locale)]+'/';
 frame.refresh();if(state)update();
}
$('locale').addEventListener('change',()=>{const index=LOCALES.indexOf($('locale').value),path='/'+SEGMENTS[index]+'/games/'+GAME+'/';if(generalLaunch())try{const marker=JSON.parse(sessionStorage.getItem(launchKey));sessionStorage.setItem(launchKey,JSON.stringify({...marker,path}));}catch{}const q=new URLSearchParams(location.search);location.href=path+(excludedLaunchKeys.some(k=>q.has(k))?'?preview=1':'');});
function change(next){
 const previous=screen;
 if(next!=='stage')stageController?.cancel();
 if(next!=='battle'){scene?.dispose();scene=null;sound.stop();}
 if(next!=='battle')rewardRound=null;
 closeOverlay();screen=next;document.body.dataset.screen=next;
 for(const id of ['main','stage','battle'])$(id).hidden=id!==next;
 $('mainGuide').hidden=next!=='main';frame.activate(next);window.scrollTo(0,0);
 if(next==='stage')showStages(previous==='main');if(next==='main')translate();
}
function forecast(r,wave=null,branch=null){
 if(r.encounters){const plans=wave===null?r.encounters:[r.encounters[wave]];const enemies=plans.flatMap(p=>Object.entries(p).filter(([key])=>!branch||key===branch).flatMap(([,list])=>list));return [1,-1].filter(side=>enemies.some(e=>e.side===side)).map(side=>t(side===1?'front':'rear')+': '+[...new Set(enemies.filter(e=>e.side===side).map(e=>e.kind))].map(t).join(', ')).join(' / ');}
 return t(r.direction==='front'?'front':r.direction==='rear'?'rear':'front')+(r.direction==='split'?' + '+t('rear'):'')+' · '+t(r.kind==='mixed'?'armor':r.kind);
}
function stageConfig(){return {gameId:GAME,count:ROUTES.length,poster:'/games/'+GAME+'/assets/cover-block-v1.webp',background:'/assets/lobby-block-atmosphere.svg',stage(i){const r=ROUTES[i],locked=r.id>save.unlocked;return {id:r.id,kicker:t('route')+' '+r.id,title:r.encounters?t('chapter'+r.chapter)+' · '+r.id:locale.startsWith('zh')?r.zh:r.en,subtitle:r.chapter===2?t('quota')+' '+r.cargoGoal:t(r.kind==='mixed'?'armor':r.kind),status:locked?t('locked'):save.cleared.includes(r.id)?'✓':'',summary:forecast(r),details:[t('forecast')+': '+forecast(r),t('power')+': '+r.power,...(r.encounters?[t('cells')+': '+r.cells]:[])],locked,cleared:save.cleared.includes(r.id)};}};}
function showStages(reset=false){
 $('stageProgress').textContent=`${save.cleared.length} / ${ROUTES.length}`;
 if(reset)stageSelection=save.unlocked-1;
 if(!stageController)stageController=window.WeightPlayPlayUI.mountStage({page:$('stageContent'),rail:$('stageRail'),config:stageConfig(),selected:stageSelection,onSelect:i=>{stageSelection=i;},onStart:i=>start(i+1),isActive:()=>screen==='stage'});
 else stageController.setConfig(stageConfig(),stageSelection);
}
function start(id){
 if(!ROUTES[id-1]||id>save.unlocked)return;
 stageSelection=id-1;
 scene?.dispose();scene=null;
 state=newRun(id);beginRewardRound(id);selected=0;paused=false;accumulator=0;change('battle');
 const renderFailure=()=>{if(screen!=='battle')return;modal('render-error',t('pause'),t('renderError'),[[t('retry'),()=>start(state.route.id)],[t('stages'),()=>change('stage')]]);};
 try{scene=createScene($('arena'),{onFailure:renderFailure});$('arenaError').hidden=true;}catch{renderFailure();}
 $('notice').textContent=state.route.chapter===2?t('quota')+': '+state.route.cargoGoal+' · '+t('junction'):state.route.encounters?t('ward')+' → '+t('frost')+' / '+t('pulse'):t('forecast')+': '+forecast(state.route);update();
}
function closeOverlay(){
 const focus=modalReturnFocus;modalReturnFocus=null;
 $('overlay').hidden=true;$('battleContent').inert=false;overlayKind='';paused=false;
 if(screen==='battle')frame.activate('battle');last=performance.now();accumulator=0;
 if(focus?.isConnected&&focus.getClientRects().length&&!focus.closest('[hidden]'))focus.focus({preventScroll:true});
}
function modal(kind,heading,text,actions){
 if($('overlay').hidden)modalReturnFocus=document.activeElement;
 overlayKind=kind;paused=true;$('overlay').dataset.kind=kind;$('modalTitle').textContent=heading;$('modalText').textContent=text;$('modalText').scrollTop=0;$('modalActions').replaceChildren();
 for(const [label,fn,disabled=false,id]of actions){const b=document.createElement('button');b.type='button';b.textContent=label;b.disabled=disabled;if(id)b.id=id;b.addEventListener('click',()=>{speak('ui.click');fn();});$('modalActions').append(b);}
 $('overlay').hidden=false;$('battleContent').inert=true;
 $('overlay').toggleAttribute('data-wp-result-screen',kind==='result');$('modalCard').toggleAttribute('data-wp-result-card',kind==='result');
 frame.activate('battle',{covered:true});$('modalActions').querySelector('button:not(:disabled)')?.focus();
}
function edit(index){
 selected=index;
 if(state.status==='combat'){const r=toggle(state,index);if(!r.ok){notice(r.reason);speak('feedback.error');}else speak('ui.click');update();return;}
 if(!['fitting','station'].includes(state.status))return;
 const choices=Object.entries(MODULES).filter(([,m])=>m.unlock<=state.route.id).map(([type,m])=>[
  `${t(type)} · ${t('power')} ${m.power}`,
  ()=>{const result=fit(state,index,type);if(result.ok){closeOverlay();speak('board.move');update();}else{$('modalText').textContent=t(result.reason);speak('feedback.error');}},false,'fit-'+type]);
 choices.push([t('close'),()=>{closeOverlay();update();}]);
 modal('fit',t(['rear','middle','front'][index])+' · '+t('fit'),t('power')+` ${usedPower(state)} / ${state.power}`,choices);
}
for(let i=0;i<3;i++)$('mount'+i).addEventListener('click',()=>edit(i));
function update(){
 if(!state)return;
 statValues.hull.textContent=Math.ceil(state.hull);$('hullBar').value=state.hull;
 statValues.power.textContent=usedPower(state)+'/'+state.power;
 statValues.wave.textContent=Math.max(1,state.wave)+' / 3';$('wave').setAttribute('aria-label',t('wave')+' '+Math.max(1,state.wave)+' / 3');
 const facts=[t('shield')+' '+Math.floor(state.shield)];if(state.route.encounters)facts.push(t('cells')+' '+state.cells+'/3');if(state.route.chapter===2)facts.push(t('cargo')+' '+state.cargo+'/'+state.route.cargoGoal);$('shieldValue').replaceChildren(...facts.map(text=>{const span=document.createElement('span');span.textContent=text;return span;}));
 $('waveProgress').value=state.wave===0?0:(state.wave-1)/3;
 for(let i=0;i<3;i++){const m=state.mounts[i],b=$('mount'+i);b.querySelector('strong').textContent=t(['rear','middle','front'][i]);b.querySelector('span').textContent=t(m.type);b.querySelector('small').textContent=(state.jamSlot===i?t('jammer'):t(m.on?'on':'off'))+' · '+MODULES[m.type].power;b.classList.toggle('selected',selected===i);b.classList.toggle('offline',!m.on||state.jamSlot===i);b.setAttribute('aria-label',t(['rear','middle','front'][i])+': '+t(m.type)+', '+t(m.on?'on':'off'));}
 $('depart').textContent=t(state.route.chapter===2?'junction':'depart');$('depart').disabled=!['fitting','station'].includes(state.status)||(state.status==='station'&&!state.selectedUpgrade);
 $('depart').hidden=state.status==='combat';$('pause').hidden=state.status!=='combat';
 $('pulse').hidden=state.status!=='combat'||!state.route.encounters;$('pulse').disabled=state.cells<=0;$('pulse').textContent=t('pulse')+' '+(state.cells??0);$('actions').classList.toggle('with-pulse',!$('pulse').hidden);
 const ram=state.enemies.some(e=>e.telegraph>0);
 const thief=state.enemies.some(e=>e.theftClock>0&&!e.raided);
 $('status').textContent=thief?t('sapper')+' !':ram?t('ram')+' !':state.warning>0?t('jammer')+' !':state.jamRemaining>0?t('jammer'):state.status==='combat'?(state.route.chapter===2?t(state.branch)+' · ':'')+t('forecast')+': '+forecast(state.route,state.wave-1,state.branch):t(state.status==='fitting'?'fit':state.status==='station'?'station':state.status);
}
function events(list){
 for(const e of list){
  if(e.type==='fire')speak(e.module==='piercer'?'weapon.laser.fire':e.module==='frost'?'magic.ice':'weapon.gun.fire');
  if(e.type==='hit')speak(e.module==='frost'?'magic.ice':'impact.metal');
  const soundMap={hurt:'player.hurt',block:'combat.block',shieldBreak:'combat.shield.break',shield:'magic.shield',heal:'magic.heal',defeat:'enemy.defeat',boss:'alert.boss',bossPhase:'alert.warning',ramWarning:'alert.warning',warning:'alert.warning',depart:'game.start',upgrade:'reward.upgrade',pulse:'magic.cast',wardBlock:'combat.block',wardBreak:'combat.shield.break',theftWarning:'alert.warning',cargoLost:'player.hurt',cargoDelivered:'game.checkpoint',recharge:'reward.upgrade'};
  if(soundMap[e.type])speak(soundMap[e.type]);
  if(['hurt','shieldBreak','heal','upgrade'].includes(e.type)){$('arena').classList.remove('impact');void $('arena').offsetWidth;$('arena').classList.add('impact');}
  if(e.type==='station'){
   speak('game.checkpoint');const choices=['power','damage','repair',...(state.route.encounters?['recharge']:[])];modal('station',t('station')+' '+state.wave,t('choose'),choices.map((choice,i)=>[t(['generator','damage','restore','recharge'][i]),()=>{if(upgrade(state,choice)){closeOverlay();update();}},choice==='recharge'&&state.cells>=3,'upgrade-'+choice]));
  }
  if(e.type==='win'||e.type==='lose'){
   const win=e.type==='win';let saved=false;if(win){save=recordWin(save,state.route.id);saved=persist();}finishRewardRound(win,saved);
   speak(win?'result.win':'result.lose');const actions=[
    [t('stages'),()=>change('stage'),false,'resultStages'],
    [t('next'),()=>start(state.route.id+1),!win||state.route.id>=ROUTES.length,'resultNext'],
    [t('retry'),()=>start(state.route.id),false,'resultReplay']
   ];
   modal('result',t(win?'won':'lost'),t('hull')+' '+Math.ceil(state.hull)+' / 100 · '+t('route')+' '+state.route.id+(state.route.chapter===2?' · '+t('cargo')+' '+state.cargo+'/'+state.route.cargoGoal:'')+(win?'':'. '+(state.lastThreat==='cargo'?t('cargoFailure'):t('forecast')+': '+t(state.lastThreat||'scout')+'. '+t('stationOnly'))),actions);
  }
 }
 scene?.feedback(list);
}
$('start').addEventListener('click',()=>{window.WeightPlayAudio.unlock();speak('ui.click');change('stage');});
$('stageBack').addEventListener('click',()=>change('main'));
$('battleBack').addEventListener('click',()=>modal('leave',t('pause'),t('stages')+'?',[[t('resume'),closeOverlay],[t('stages'),()=>change('stage')]]));
$('depart').addEventListener('click',()=>{
 if(state.route.chapter!==2){if(depart(state))update();return;}
 modal('junction',t('junction'),t('quota')+' '+state.cargo+'/'+state.route.cargoGoal+' · '+t('cells')+' '+state.cells+'/3',[
  ...['freight','service'].map(branch=>[t(branch)+' — '+(branch==='freight'?t('freightGain'):t('cells')+' '+state.cells+' → '+Math.min(3,state.cells+1)+'/3')+'\n'+forecast(state.route,state.wave,branch),()=>{if(chooseBranch(state,branch)&&depart(state)){closeOverlay();update();}},false,'branch-'+branch]),
  [t('close'),closeOverlay]
 ]);
});
$('pulse').addEventListener('click',()=>modal('pulse',t('pulse'),t('cells')+' '+state.cells+'/3',[
 ...[[1,'front'],[-1,'rear']].map(([side,label])=>[t(label),()=>{if(pulse(state,side)){closeOverlay();update();}else{$('modalText').textContent=t('pulseEmpty');}},!state.enemies.some(e=>e.side===side&&e.hp>0), 'pulse-'+label]),
 [t('close'),closeOverlay]
]));
$('pause').addEventListener('click',()=>modal('pause',t('pause'),'',[[t('resume'),closeOverlay],[t('retry'),()=>start(state.route.id)],[t('stages'),()=>change('stage')]]));
$('help').addEventListener('click',()=>modal('help',t('help'),GUIDE[locale],[[t('close'),closeOverlay]]));
document.addEventListener('keydown',e=>{
 if($('overlay').hidden)return;
 if(e.key==='Tab'){const buttons=[...$('modalActions').querySelectorAll('button:not(:disabled)')];const first=buttons[0],last=buttons.at(-1);if(!buttons.includes(document.activeElement)||(!e.shiftKey&&document.activeElement===last)){e.preventDefault();first?.focus();}else if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}}
 if(e.key==='Escape'&&!['result','station','render-error'].includes(overlayKind)){closeOverlay();e.preventDefault();}
});
document.addEventListener('visibilitychange',()=>{last=performance.now();accumulator=0;if(document.hidden){sound.stop();if(screen==='battle'&&state?.status==='combat'&&!overlayKind)modal('pause',t('pause'),'',[[t('resume'),closeOverlay]]);}});
window.addEventListener('storage',e=>{if(e.key===SAVE){try{save=mergeSave(save,JSON.parse(e.newValue));if(screen==='stage')showStages();}catch{}}});
function animate(now){
 const delta=last?Math.min(.12,(now-last)/1000):0;last=now;
 const settingsOpen=Boolean($('battleHeader').querySelector('[data-wp-settings][aria-expanded="true"]'));
 const halted=paused||settingsOpen||document.hidden;
 if(halted)accumulator=0;
 if(screen==='battle'&&state){if(!halted&&state.status==='combat'){
  accumulator+=delta;let iterations=0;while(accumulator>=1/30&&iterations++<4){step(state,1/30);accumulator-=1/30;if(state.status!=='combat')break;}
  events(drainEvents(state));update();
 }else events(drainEvents(state));if(!document.hidden)scene?.render(state,selected,halted?0:delta);}
 raf=requestAnimationFrame(animate);
}
window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);scene?.dispose();scene=null;sound.dispose();stageController?.destroy();frame.destroy();});
window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
// Observational copies only: no commands, live references, save writes or time advancement.
Object.defineProperty(window,'RailguardDiagnostics',{value:Object.freeze({snapshot:()=>structuredClone({screen,overlay:overlayKind,paused,save,game:state?{route:{id:state.route.id,chapter:state.route.chapter},status:state.status,wave:state.wave,time:state.time,tick:state.tick,waveTime:state.waveTime,hull:state.hull,power:state.power,shield:state.shield,cells:state.cells,cargo:state.cargo,branch:state.branch,lastThreat:state.lastThreat,mounts:state.mounts,enemies:state.enemies,shots:state.shots}:null,renderer:scene?.info()||null})}),configurable:false,writable:false});
translate();frame.activate('main');raf=requestAnimationFrame(animate);
