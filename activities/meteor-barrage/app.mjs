import {COPY,LOCALES,getLocale,lobbyPath} from './copy.mjs?v=3';
import {ACTIVITY_VERSION,freshRun,fire,tick,advance,STEP,safeBlocks} from './physics.mjs?v=3';
import {makeStore,emptySave,SAVE_KEY,dailyStatus} from './store.mjs?v=3';
import {rewardCopy,rewardStatus,payRewards} from './rewards.mjs?v=1';
const $=id=>document.getElementById(id),params=new URLSearchParams(location.search),locale=getLocale(params.get('locale')||document.querySelector('meta[name="weightplay-activity-locale"]')?.content||'zh-Hant'),t=COPY[locale];
const fmt=(s,values={})=>s.replace(/\{(\w+)\}/g,(_,k)=>values[k]??'');
document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.title=t.title+' · WeightPlay';
const names=['English','繁體中文','简体中文','日本語','한국어','Español','Português','Français','Deutsch','Italiano','Русский','हिन्दी','العربية'];
$('language').replaceChildren();
for(const [i,l] of LOCALES.entries())$('language').add(new Option(names[i],l,l===locale,l===locale));
$('language').setAttribute('aria-label',t.language);$('language').onchange=()=>{location.assign('/activities/meteor-barrage'+lobbyPath($('language').value));};
for(const [id,key] of Object.entries({title:'title',tagline:'tagline',intro:'intro',candidateLabel:'eventLabel',collectionLabel:'collection',bestLabel:'best',challenge:'challenge',training:'training',resume:'resume',trainingNote:'trainingNote',appearanceLabel:'appearance',mainHelp:'help',hullLabel:'hull',ammoLabel:'ammo',scoreLabel:'score',fire:'fire',aimLabel:'aim'}))$(id).textContent=t[key];
$('lobbyBack').href=lobbyPath(locale);$('lobbyBack').setAttribute('aria-label',t.back);
for(const [id,key] of Object.entries({back:'leave',help:'help',pause:'pause',sound:'sound',arena:'launchLabel',powers:'power'}))$(id).setAttribute('aria-label',t[key]);
$('arena').setAttribute('aria-description',t.keyboard);$('angle').setAttribute('aria-label',t.aim);
$('skin').replaceChildren();$('skin').add(new Option(t.standard,'standard'));$('skin').add(new Option(t.violet,'violet'));
let storage,save=emptySave(),store,memory=false,saveError=false;
try{storage=localStorage;store=makeStore(storage,navigator.locks);save=await store.observe();}catch{memory=true;saveError=true;$('mainNotice').textContent=t.loadError;}
if(!navigator.locks?.request){memory=true;saveError=true;$('mainNotice').textContent=t.saveError;}
const clone=o=>JSON.parse(JSON.stringify(o));
const rewardText=rewardCopy(locale);let paying=false,dailyKey='',eligibility=null;
const flights=new Set();
function stopRewardFlight(){for(const a of flights)a.cancel();flights.clear();$('rewardFlights').replaceChildren();}
function rewardFlight(amount){
  if(!battle||document.hidden||amount<=0)return;
  const from=$('arena').getBoundingClientRect(),to=$('walletBalance').getBoundingClientRect();
  const img=document.createElement('img');img.src='/assets/weightplay-diamond.svg';img.alt='';img.className='reward-flight';img.style.left=(from.left+from.width/2)+'px';img.style.top=(from.top+from.height/2)+'px';$('rewardFlights').append(img);
  const a=img.animate(reduced.matches?[{opacity:1},{opacity:0}]:[{transform:'translate(-50%,-50%) scale(1.6)',opacity:1},{transform:`translate(${to.left+to.width/2-from.left-from.width/2}px,${to.top+to.height/2-from.top-from.height/2}px) scale(.45)`,opacity:.2}],{duration:reduced.matches?140:600,easing:'ease-in'});flights.add(a);a.finished.catch(()=>{}).finally(()=>{img.remove();flights.delete(a);});
}
function syncRewards(){
 let status,ledger;try{ledger=window.WeightPlayWallet?.read?.();status=rewardStatus(save,{read:()=>ledger});}catch{status={paid:0,pending:Object.keys(save.rewards||{}).length,balance:null};}
 $('walletBalance').textContent=rewardText.balance(status.balance??'—');$('mainWallet').textContent=rewardText.balance(status.balance??'—');
 const pending=Object.entries(save.rewards||{}).some(([key,r])=>!ledger?.available||ledger.rewards?.[key]?.amount!==r.amount);
 $('claimRewards').hidden=!pending;$('claimRewards').disabled=paying;$('claimRewards').textContent=paying?rewardText.paying():rewardText.claim();$('rewardNotice').textContent=pending?rewardText.pending():status.paid?rewardText.paid(status.paid):'';
 return status;
}
async function flushRewards(){if(paying||memory)return;paying=true;const before=syncRewards().paid;try{await payRewards(save,window.WeightPlayWallet);}catch{}finally{paying=false;const after=syncRewards();rewardFlight(after.paid-before);}}
function syncDaily(){const now=Date.now(),key=Math.floor(now/1000)+':'+save.revision;if(key===dailyKey)return;dailyKey=key;eligibility=dailyStatus(save,now);$('dailyState').textContent=t[eligibility.state];$('schedule').textContent=t.schedule;const seconds=Math.max(0,Math.ceil((eligibility.nextAt-now)/1000));$('dailyNext').textContent=t.nextAt+' '+[Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(n=>String(n).padStart(2,'0')).join(':');
 const continuing=save.challenge&&!['won','lost'].includes(save.challenge.status)&&!!save.daily.day;
 $('challenge').textContent=continuing?t.resume:t.challenge;$('challenge').disabled=saveError||(!continuing&&!collection())||(!eligibility.canStart&&!continuing)||eligibility.clockBlocked;
}
$('claimRewards').onclick=()=>flushRewards();$('rewardInfo').textContent=t.rewardInfo;
let run=null,scene=null,scenePromise=null,battle=false,busy=false,pendingResult=false,angle=90,power=1,frame=0,last=0,acc=0,dialogKind='',primary=null,secondary=null,focusReturn=null,feedbackUntil=0,pointer=null;
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),audio=window.WeightPlayAudio?.createScope();
const soundIds=['projectile.launch','impact.stone','impact.metal','combat.shield.break','explosion.small','explosion.large','player.hurt','game.start','game.checkpoint','result.win','result.lose','ui.click'];
const sound=id=>audio?.play(id);let enabled=true;
try{enabled=window.WeightPlayAudio?.isMuted?.()!==true;}catch{}
function soundLabel(){$('sound').textContent=enabled?'♪':'♪̸';$('sound').setAttribute('aria-label',enabled?t.soundOn:t.soundOff);$('sound').setAttribute('aria-pressed',String(enabled));}
soundLabel();$('sound').onclick=()=>{enabled=!enabled;window.WeightPlayAudio?.setEnabled(enabled);soundLabel();};
function collection(){try{return safeBlocks(window.WeightPlayCastle?.ownedBlocks?.());}catch{return 0;}}
function main(){battle=false;pendingResult=false;stopRewardFlight();scene?.resetPresentation();cancelAnimationFrame(frame);frame=0;last=0;$('battleScreen').hidden=true;$('mainScreen').hidden=false;audio?.stop();cancelPointer();
  const blocks=collection();$('collection').textContent=blocks.toLocaleString(locale);$('best').textContent=save.best.toLocaleString(locale);dailyKey='';syncDaily();syncRewards();
  $('resume').hidden=save.run?.mode!=='training'||['won','lost'].includes(save.run.status);$('skin').value=save.skin;$('skin').options[1].disabled=!save.wins;$('skinNote').textContent=save.wins?t.skinUnlocked:t.skinLocked;
  if(!saveError)$('mainNotice').textContent=blocks?'':t.noBlocks;
}
window.addEventListener('weightplay:castle-ready',()=>{if(!battle)main();});window.addEventListener('weightplay:castle-updated',()=>{if(!battle)main();});
async function checkpoint(){
  const next={...save,run:clone(run)};
  if(run&&['won','lost'].includes(run.status)&&!run.recorded){next.best=Math.max(next.best,run.score);if(run.status==='won'&&run.mode==='challenge')next.wins++;run.recorded=true;next.run=clone(run);}
  if(memory){save=next;return;}
  save=await store.write(next,save.revision);
}
function show(title,copy,label,action,secondLabel,secondAction,kind='info',stats=''){
  cancelPointer();focusReturn=document.activeElement;dialogKind=kind;primary=action;secondary=secondAction;
  $('dialogTitle').textContent=title;$('dialogCopy').textContent=copy;$('dialogPrimary').textContent=label;$('dialogSecondary').textContent=secondLabel||'';$('dialogSecondary').hidden=!secondLabel;
  $('dialogEyebrow').textContent=run?fmt(t.wave,{n:run.wave+1}):t.eventLabel;$('dialogStats').textContent=stats;
  if(!$('dialog').open)$('dialog').showModal();if(!['wave','result'].includes(kind))audio?.stop();acc=0;
}
function close(){if($('dialog').open)$('dialog').close();dialogKind='';last=0;focusReturn?.focus?.({preventScroll:true});}
$('dialogPrimary').onclick=()=>{const fn=primary;close();fn?.();};$('dialogSecondary').onclick=()=>{const fn=secondary;close();fn?.();};
$('dialog').addEventListener('cancel',e=>{e.preventDefault();if(['pause','help','leave'].includes(dialogKind))close();});
function help(){show(t.help,t.guide+'\n\n'+t.keyboard+'\n\n'+t.rule+'\n'+t.rewardInfo+'\n'+t.trainingNote,t.close,()=>{},null,null,'help');}
$('mainHelp').onclick=help;$('help').onclick=help;$('pause').onclick=()=>show(t.paused,t.keyboard,t.continue,()=>{},t.leave,leave,'pause');
function leave(){show(t.leave,memory?t.saveError:t.confirmLeave,t.continue,()=>{},t.leave,async()=>{busy=true;try{await checkpoint();main();}catch{failure();}finally{busy=false;}},'leave');}
$('back').onclick=leave;
function failure(){saveError=true;show(t.saveError,t.loadError,t.reload,()=>location.reload(),t.back,()=>location.assign(lobbyPath(locale)),'error');}
async function ensureScene(){
  if(scene)return scene;if(scenePromise)return scenePromise;
  scenePromise=(async()=>{let timer;try{const {MeteorScene}=await Promise.race([import('./render.mjs?v=2'),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('SCENE_TIMEOUT')),10000);})]);scene=new MeteorScene($('world'),$('arena'));return scene;}finally{clearTimeout(timer);}})();
  try{return await scenePromise;}catch(error){scenePromise=null;throw error;}
}
async function enter(mode,resume=false){
  if(busy)return;busy=true;window.WeightPlayAudio?.unlock?.();window.WeightPlayAudio?.preload?.(soundIds);
  try{
    if(!resume&&!memory){save=store.read();}
    if(mode==='challenge'){if(memory)return;save=await store.beginChallenge(collection());run=clone(save.run);}
    else run=resume?clone(save.run):freshRun(collection(),mode);if(!run)return;if(run.cap===0){main();return;}
    if(!resume&&mode==='training'){try{await checkpoint();}catch(error){memory=true;saveError=true;save={...save,run:clone(run)};$('mainNotice').textContent=t.saveError;}}
    $('mainScreen').hidden=true;$('battleScreen').hidden=false;battle=true;angle=90;power=1;$('angle').value='90';$('angleValue').textContent='90°';
    await ensureScene();scene.resetPresentation();pendingResult=false;scene.resize();last=0;acc=0;update();sound('game.start');$('arena').focus({preventScroll:true});if(!frame)frame=requestAnimationFrame(loop);
    if(run.status==='wave-clear'||run.status==='won'||run.status==='lost')result();
    else if(memory)show(t.saveError,t.trainingNote,t.continue,()=>{},t.leave,main,'info');
  }catch(error){if(['ACTIVITY_CLOSED','DAILY_RUN_ALREADY_USED','CLOCK_ROLLBACK'].includes(error.message)){main();$('mainNotice').textContent=error.message==='CLOCK_ROLLBACK'?t.clock:error.message==='ACTIVITY_CLOSED'?t.closed:t.completed;}else{console.warn('Meteor activity recovery:',error.message);show(t.sceneError,t.sceneError,t.reload,()=>location.reload(),t.back,()=>location.assign(lobbyPath(locale)),'error');}}
  finally{busy=false;}
}
$('challenge').onclick=()=>enter('challenge');$('training').onclick=()=>enter('training');$('resume').onclick=()=>enter(save.run?.mode,true);
$('skin').onchange=async()=>{const prior=save.skin;save.skin=$('skin').value;if(memory)return;try{save=await store.write(save,save.revision);}catch{save.skin=prior;$('skin').value=prior;$('mainNotice').textContent=t.saveError;}};
function feedback(text){$('feedback').textContent=text;feedbackUntil=performance.now()+1100;}
function update(){if(!run)return;
  syncDaily();const dailyBlocked=run.mode==='challenge'&&!eligibility.canFire;
  $('wave').textContent=fmt(t.wave,{n:run.wave+1});$('waveName').textContent=t.waveNames[run.wave];$('ammo').textContent=run.ammo.toLocaleString(locale);$('hull').textContent=run.hull;$('score').textContent=run.score.toLocaleString(locale);
  $('fire').disabled=busy||dailyBlocked||scene?.isAdvancing||run.status!=='ready'||power>run.ammo;$('fire').textContent=dailyBlocked?t[eligibility.state]:scene?.isAdvancing?t.advancing:run.status==='shooting'?t.shooting:t.fire;
  for(const b of $('powers').children){b.disabled=busy||scene?.isAdvancing||run.status!=='ready'||Number(b.dataset.power)>run.ammo;b.classList.toggle('selected',Number(b.dataset.power)===power);b.setAttribute('aria-pressed',String(Number(b.dataset.power)===power));}
  $('tip').textContent=run.wave===0?t.tipBlast:run.wave===1?t.tipArmor:t.tipBoss;
}
async function launch(){
  if(busy||!battle||scene?.isAdvancing||$('dialog').open||!run||(run.mode==='challenge'&&!dailyStatus(save).canFire))return;const before=clone(run);if(!fire(run,angle,power))return;
  busy=true;update();try{await checkpoint();sound('projectile.launch');scene.recoil=.25;feedback(t.shooting);}catch{run=before;failure();}finally{busy=false;update();}
}
$('fire').onclick=launch;
$('powers').onclick=e=>{const b=e.target.closest('[data-power]');if(!b||b.disabled)return;power=Number(b.dataset.power);sound('ui.click');update();};
function aim(value){angle=Math.max(18,Math.min(162,value));$('angle').value=String(Math.round(angle));$('angleValue').textContent=Math.round(angle)+'°';}
$('angle').oninput=()=>aim(Number($('angle').value));
function pointerAim(e){if(!scene)return;const p=scene.point(e.clientX,e.clientY);if(p.y>48)aim(Math.atan2(p.y-38,p.x-180)*180/Math.PI);}
function cancelPointer(){if(pointer!==null){try{$('arena').releasePointerCapture(pointer);}catch{}pointer=null;}}
$('arena').addEventListener('pointerdown',e=>{if(!battle||busy||run?.status!=='ready'||$('dialog').open||e.button!==0)return;pointer=e.pointerId;$('arena').setPointerCapture(pointer);pointerAim(e);});
$('arena').addEventListener('pointermove',e=>{if(e.pointerId===pointer)pointerAim(e);});
$('arena').addEventListener('pointerup',e=>{if(e.pointerId!==pointer)return;pointerAim(e);cancelPointer();launch();});
$('arena').addEventListener('pointercancel',cancelPointer);$('arena').addEventListener('lostpointercapture',()=>{pointer=null;});
window.addEventListener('keydown',e=>{if(!battle||$('dialog').open||e.target.matches('input,select'))return;
  if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();aim(angle+(e.key==='ArrowLeft'?3:-3));}
  if(e.code==='Space'&&!e.target.matches('button')){e.preventDefault();if(!e.repeat)launch();}if(e.key==='Escape'){e.preventDefault();$('pause').click();}});
document.addEventListener('visibilitychange',()=>{cancelPointer();if(document.hidden){if(battle&&!$('dialog').open)show(t.paused,t.keyboard,t.continue,()=>{},t.leave,leave,'pause');cancelAnimationFrame(frame);frame=0;}else if(battle&&!frame)frame=requestAnimationFrame(loop);last=0;acc=0;});
window.addEventListener('blur',cancelPointer);
window.addEventListener('resize',()=>{if(battle&&scene)scene.resize();});
window.addEventListener('storage',e=>{if(e.key===SAVE_KEY){if(battle)show(t.paused,t.saved,t.reload,()=>location.reload(),t.back,()=>location.assign(lobbyPath(locale)),'conflict');else{try{save=store.read();main();}catch{$('mainNotice').textContent=t.loadError;}}}});
$('world').addEventListener('webglcontextlost',e=>{e.preventDefault();show(t.sceneError,t.sceneError,t.reload,()=>location.reload(),t.back,()=>location.assign(lobbyPath(locale)),'error');});
function result(){
  const rewards=syncRewards(),stats=String(run.score)+(run.mode==='challenge'?' · '+rewardText.paid(rewards.paid)+(rewards.pending?'\n'+rewardText.pending():''):'');
  if(run.status==='wave-clear'){sound('game.checkpoint');show(t.waveClear,t.waveNames[run.wave],t.nextWave,async()=>{busy=true;try{advance(run);scene.resetPresentation();await checkpoint();if(power>run.ammo)power=1;update();if(run.status==='lost')result();else sound('game.start');}catch{failure();}finally{busy=false;update();}},t.leave,()=>main(),'wave',stats);}
  else if(['won','lost'].includes(run.status)){const won=run.status==='won';sound(won?'result.win':'result.lose');show(won?t.victory:t.defeat,fmt(t.resultCopy,{score:run.score,wave:won?3:run.wave})+(won&&run.mode==='challenge'?'\n'+t.skinUnlocked:!won?'\n'+(run.ammo===0?t.empty:t.breach):''),run.mode==='training'?t.retry:t.close,()=>run.mode==='training'?enter('training'):main(),t.back,()=>location.assign(lobbyPath(locale)),'result',stats);}
}
const labelNodes=new Map();
function labels(){for(const [id,node] of labelNodes)if(!run.targets.some(t=>t.id===id&&t.hp>0)){node.remove();labelNodes.delete(id);}
  for(const target of run.targets){if(target.hp<=0)continue;let node=labelNodes.get(target.id);if(!node){node=document.createElement('span');node.className='target-hp';$('targetLabels').append(node);labelNodes.set(target.id,node);}const position=scene.targetPosition(target),p=scene.screen(position.x,position.y);node.style.left=p.x+'px';node.style.top=(p.y+target.r*scene.h/scene.vh+12)+'px';node.textContent=(target.armor?'▰ ':'')+target.hp;}}
function handleEvents(events){for(const event of events)if(event.kind==='descent')scene.descend(event,reduced.matches);for(const event of events){
  if(['hit','armor','destroy','blast','core','shield','breach'].includes(event.kind))scene.burst(event,reduced.matches);
  const audioMap={hit:'impact.stone',armor:'combat.shield.break',destroy:'impact.stone',blast:'explosion.small',core:'explosion.large',shield:'combat.shield.break',breach:'player.hurt',bounce:'impact.metal'};if(audioMap[event.kind])sound(audioMap[event.kind]);
  if(event.kind==='hit')feedback(event.combo>1?fmt(t.combo,{n:event.combo}):t.hit);if(event.kind==='blast')feedback(t.blast);if(event.kind==='shield'||event.kind==='armor')feedback(t.blocked);if(event.kind==='breach')feedback(t.breach);
}if(events.some(event=>event.kind==='blast'))feedback(t.blast);}
async function settled(){busy=true;try{await checkpoint();await flushRewards();if(power>run.ammo)power=1;pendingResult=['wave-clear','won','lost'].includes(run.status);}catch{failure();}finally{busy=false;update();}}
function loop(now){frame=0;if(!battle||!scene||document.hidden){last=0;return;}frame=requestAnimationFrame(loop);const dt=last?Math.min(.05,(now-last)/1000):0;last=now;
  if(!$('dialog').open&&!busy&&!scene.isAdvancing&&!document.hidden){acc+=dt;let n=0;while(acc>=STEP&&n++<6){const before=run.status;handleEvents(tick(run,STEP));acc-=STEP;if(before==='shooting'&&run.status!=='shooting'){settled();break;}}}else acc=0;
  scene.draw(run,angle,$('dialog').open?0:dt,reduced.matches,save.skin);labels();update();if(now>feedbackUntil)$('feedback').textContent='';
  if(pendingResult&&!busy&&!$('dialog').open&&!scene.presentationActive){pendingResult=false;result();}
}
window.addEventListener('pagehide',event=>{cancelAnimationFrame(frame);frame=0;audio?.stop();cancelPointer();if(!event.persisted){audio?.dispose();scene?.dispose();}});
window.addEventListener('pageshow',event=>{if(event.persisted&&battle){last=0;acc=0;scene?.resize();if(!$('dialog').open)show(t.paused,t.keyboard,t.continue,()=>{},t.leave,leave,'pause');if(!frame)frame=requestAnimationFrame(loop);}});
// Read-only rendering diagnostics, never a gameplay mutation surface.
window.MeteorBarrageDiagnostics=Object.freeze({snapshot:()=>({version:ACTIVITY_VERSION,renderer:scene?.stats()||null,mode:run?.mode,status:run?.status,viewport:scene?{width:scene.w,height:scene.h}:null})});
document.documentElement.dataset.meteorReady='true';$('loadFailure').hidden=true;main();flushRewards();
setInterval(()=>{if(!document.hidden&&!battle)syncDaily();},1000);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopRewardFlight();else{dailyKey='';syncDaily();flushRewards();}});
window.addEventListener('pagehide',stopRewardFlight);
window.addEventListener('weightplay:wallet-updated',()=>syncRewards());
