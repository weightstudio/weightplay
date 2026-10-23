import {ROUTES,MODULES,newRun,fit,toggle,usedPower,depart,upgrade,step,drainEvents,normalizeSave,mergeSave,recordWin} from './model.js';
import {createScene} from './scene.js';
import {COPY,GUIDE,GUIDE_SECTIONS,LOCALES,SEGMENTS,NATIVE} from './i18n.js';
const $=id=>document.getElementById(id),GAME='railguard-express',SAVE='weightplay.railguard-express.v1';
let locale=LOCALES[SEGMENTS.indexOf(location.pathname.split('/')[1])]||'en';
const t=k=>COPY[locale][k],title=()=>window.WEIGHTPLAY_GAME_TITLES[GAME][locale];
let save=normalizeSave(null),storageOK=true;
try{save=normalizeSave(JSON.parse(localStorage.getItem(SAVE)));}catch{storageOK=false;}
let screen='main',state=null,scene=null,stageController=null,selected=0,paused=false,overlayKind='',last=0,accumulator=0,raf=0;
let stageSelection=save.unlocked-1;
let modalReturnFocus=null;
const sound=window.WeightPlayAudio.createScope(GAME);
const SFX=['ui.click','feedback.error','board.move','game.start','game.checkpoint','reward.upgrade','weapon.gun.fire','weapon.laser.fire','magic.ice','impact.metal','player.hurt','combat.block','combat.shield.break','magic.shield','magic.heal','enemy.defeat','alert.boss','alert.warning','result.win','result.lose'];
window.WeightPlayAudio.preload(SFX);
for(let i=0;i<LOCALES.length;i++)$('locale').add(new Option(NATIVE[i],LOCALES[i]));
$('battleContent').prepend($('stats'));
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
function persist(){try{save=mergeSave(save,JSON.parse(localStorage.getItem(SAVE)||'null'));localStorage.setItem(SAVE,JSON.stringify(save));storageOK=true;}catch{storageOK=false;}}
function translate(){
 document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.title=title()+' | WeightPlay';
 document.querySelectorAll('[data-t]').forEach(n=>n.textContent=t(n.dataset.t));$('officialTitle').textContent=title();$('locale').value=locale;
 $('summary').textContent=GUIDE[locale].split(/[。.!]/)[0]+(locale.startsWith('zh')?'。':'.');$('guideText').replaceChildren();
 for(const [heading,copy]of GUIDE_SECTIONS[locale]){const section=document.createElement('section');section.className='game-info-section';const h=document.createElement('h3'),p=document.createElement('p');h.textContent=heading;p.textContent=copy;section.append(h,p);$('guideText').append(section);}
 $('saveNote').textContent=t(storageOK?'saved':'storage');$('progress').textContent=`${save.cleared.length} / 12`;
 document.querySelectorAll('[data-wp-gameplay-tags] span').forEach((n,i)=>n.textContent=t(['fit','power','upgrade'][i]));
 $('lobbyBack').href='/'+SEGMENTS[LOCALES.indexOf(locale)]+'/';
 frame.refresh();if(state)update();
}
$('locale').addEventListener('change',()=>{const index=LOCALES.indexOf($('locale').value);location.href='/'+SEGMENTS[index]+'/games/'+GAME+'/?preview=1';});
function change(next){
 const previous=screen;
 if(next!=='stage')stageController?.cancel();
 if(next!=='battle'){scene?.dispose();scene=null;sound.stop();}
 closeOverlay();screen=next;document.body.dataset.screen=next;
 for(const id of ['main','stage','battle'])$(id).hidden=id!==next;
 $('mainGuide').hidden=next!=='main';frame.activate(next);window.scrollTo(0,0);
 if(next==='stage')showStages(previous==='main');if(next==='main')translate();
}
function forecast(r){return t(r.direction==='front'?'front':r.direction==='rear'?'rear':'front')+(r.direction==='split'?' + '+t('rear'):'')+' · '+t(r.kind==='mixed'?'armor':r.kind);}
function stageConfig(){return {gameId:GAME,count:12,poster:'/games/'+GAME+'/assets/cover-block-v1.webp',background:'/assets/lobby-block-atmosphere.svg',stage(i){const r=ROUTES[i],locked=r.id>save.unlocked;return {id:r.id,kicker:t('route')+' '+r.id,title:locale.startsWith('zh')?r.zh:r.en,subtitle:t(r.kind==='mixed'?'armor':r.kind),status:locked?t('locked'):save.cleared.includes(r.id)?'✓':'',summary:forecast(r),details:[t('forecast')+': '+forecast(r),t('power')+': '+r.power],locked,cleared:save.cleared.includes(r.id)};}};}
function showStages(reset=false){
 $('stageProgress').textContent=`${save.cleared.length} / 12`;
 if(reset)stageSelection=save.unlocked-1;
 if(!stageController)stageController=window.WeightPlayPlayUI.mountStage({page:$('stageContent'),rail:$('stageRail'),config:stageConfig(),selected:stageSelection,onSelect:i=>{stageSelection=i;},onStart:i=>start(i+1),isActive:()=>screen==='stage'});
 else stageController.setConfig(stageConfig(),stageSelection);
}
function start(id){
 if(id>save.unlocked)return;
 stageSelection=id-1;
 scene?.dispose();scene=null;
 state=newRun(id);selected=0;paused=false;accumulator=0;change('battle');
 const renderFailure=()=>{if(screen!=='battle')return;modal('render-error',t('pause'),t('renderError'),[[t('retry'),()=>start(state.route.id)],[t('stages'),()=>change('stage')]]);};
 try{scene=createScene($('arena'),{onFailure:renderFailure});$('arenaError').hidden=true;}catch{renderFailure();}
 $('notice').textContent=t('forecast')+': '+forecast(state.route);update();
}
function closeOverlay(){
 const focus=modalReturnFocus;modalReturnFocus=null;
 $('overlay').hidden=true;$('battleContent').inert=false;overlayKind='';paused=false;
 if(screen==='battle')frame.activate('battle');last=performance.now();accumulator=0;
 if(focus?.isConnected&&focus.getClientRects().length&&!focus.closest('[hidden]'))focus.focus({preventScroll:true});
}
function modal(kind,heading,text,actions){
 if($('overlay').hidden)modalReturnFocus=document.activeElement;
 overlayKind=kind;paused=true;$('modalTitle').textContent=heading;$('modalText').textContent=text;$('modalActions').replaceChildren();
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
  ()=>{const result=fit(state,index,type);if(result.ok){closeOverlay();speak('board.move');update();}else{$('modalText').textContent=t(result.reason);speak('feedback.error');}},false]);
 choices.push([t('close'),()=>{closeOverlay();update();}]);
 modal('fit',t(['rear','middle','front'][index])+' · '+t('fit'),t('power')+` ${usedPower(state)} / ${state.power}`,choices);
}
for(let i=0;i<3;i++)$('mount'+i).addEventListener('click',()=>edit(i));
function update(){
 if(!state)return;
 $('hull').textContent=t('hull')+' '+Math.ceil(state.hull);$('hullBar').value=state.hull;
 $('power').textContent=t('power')+' '+usedPower(state)+'/'+state.power;
 $('wave').textContent=Math.max(1,state.wave)+' / 3';$('wave').setAttribute('aria-label',t('wave')+' '+Math.max(1,state.wave)+' / 3');$('shieldValue').textContent=t('shield')+' '+Math.floor(state.shield);
 $('waveProgress').value=state.wave===0?0:(state.wave-1)/3;
 for(let i=0;i<3;i++){const m=state.mounts[i],b=$('mount'+i);b.querySelector('strong').textContent=t(['rear','middle','front'][i]);b.querySelector('span').textContent=t(m.type);b.querySelector('small').textContent=(state.jamSlot===i?t('jammer'):t(m.on?'on':'off'))+' · '+MODULES[m.type].power;b.classList.toggle('selected',selected===i);b.classList.toggle('offline',!m.on||state.jamSlot===i);b.setAttribute('aria-label',t(['rear','middle','front'][i])+': '+t(m.type)+', '+t(m.on?'on':'off'));}
 $('depart').textContent=t('depart');$('depart').disabled=!['fitting','station'].includes(state.status)||(state.status==='station'&&!state.selectedUpgrade);
 $('depart').hidden=state.status==='combat';$('pause').hidden=state.status!=='combat';
 const ram=state.enemies.some(e=>e.telegraph>0);
 $('status').textContent=ram?t('ram')+' !':state.warning>0?t('jammer')+' !':state.jamRemaining>0?t('jammer'):state.status==='combat'?t('forecast')+': '+forecast(state.route):t(state.status==='fitting'?'fit':state.status==='station'?'station':state.status);
}
function events(list){
 for(const e of list){
  if(e.type==='fire')speak(e.module==='piercer'?'weapon.laser.fire':e.module==='frost'?'magic.ice':'weapon.gun.fire');
  if(e.type==='hit')speak(e.module==='frost'?'magic.ice':'impact.metal');
  const soundMap={hurt:'player.hurt',block:'combat.block',shieldBreak:'combat.shield.break',shield:'magic.shield',heal:'magic.heal',defeat:'enemy.defeat',boss:'alert.boss',bossPhase:'alert.warning',ramWarning:'alert.warning',warning:'alert.warning',depart:'game.start',upgrade:'reward.upgrade'};
  if(soundMap[e.type])speak(soundMap[e.type]);
  if(['hurt','shieldBreak','heal','upgrade'].includes(e.type)){$('arena').classList.remove('impact');void $('arena').offsetWidth;$('arena').classList.add('impact');}
  if(e.type==='station'){
   speak('game.checkpoint');modal('station',t('station')+' '+state.wave,t('choose'),['power','damage','repair'].map((choice,i)=>[t(['generator','damage','restore'][i]),()=>{if(upgrade(state,choice)){closeOverlay();update();}}]));
  }
  if(e.type==='win'||e.type==='lose'){
   const win=e.type==='win';if(win){save=recordWin(save,state.route.id);persist();}
   speak(win?'result.win':'result.lose');const actions=[
    [t('stages'),()=>change('stage'),false,'resultStages'],
    [t('next'),()=>start(state.route.id+1),!win||state.route.id>=12,'resultNext'],
    [t('retry'),()=>start(state.route.id),false,'resultReplay']
   ];
   modal('result',t(win?'won':'lost'),t('hull')+' '+Math.ceil(state.hull)+' / 100 · '+t('route')+' '+state.route.id+(win?'':'. '+t('forecast')+': '+t(state.lastThreat||'scout')+'. '+t('stationOnly')),actions);
  }
 }
 scene?.feedback(list);
}
$('start').addEventListener('click',()=>{window.WeightPlayAudio.unlock();speak('ui.click');change('stage');});
$('stageBack').addEventListener('click',()=>change('main'));
$('battleBack').addEventListener('click',()=>modal('leave',t('pause'),t('stages')+'?',[[t('resume'),closeOverlay],[t('stages'),()=>change('stage')]]));
$('depart').addEventListener('click',()=>{if(depart(state))update();});
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
 if(screen==='battle'&&state){if(!paused&&!document.hidden&&state.status==='combat'){
  accumulator+=delta;let iterations=0;while(accumulator>=1/30&&iterations++<4){step(state,1/30);accumulator-=1/30;if(state.status!=='combat')break;}
  events(drainEvents(state));update();
 }else events(drainEvents(state));scene?.render(state,selected,paused?0:delta);}
 raf=requestAnimationFrame(animate);
}
window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);scene?.dispose();scene=null;sound.dispose();stageController?.destroy();frame.destroy();});
window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
translate();frame.activate('main');raf=requestAnimationFrame(animate);
