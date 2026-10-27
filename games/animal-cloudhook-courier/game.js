/* Cloudhook Courier v23: one flight state, one input owner, finite feedback. */
import {LocalPractice as Practice} from '/src/game-local-practice.mjs';
(async () => {
  'use strict';
  const GAME_VERSION = "v23";
  const INTERFACE_VERSION = 9;
  const practiceRequested=location.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&new URLSearchParams(location.search).get('practice')==='1';
  const F=window.CloudhookFlight,R=window.CloudhookRoutes,ID='animal-cloudhook-courier';
  const $=id=>document.getElementById(id),abort=new AbortController();
  $('startBtn').disabled=true;
  const on=(node,event,fn,options={})=>node.addEventListener(event,fn,{...options,signal:abort.signal});
  const configs=R.authoredStages.map(F.route),canvas=$('gameCanvas'),ctx=canvas.getContext('2d');
  const read=(key,fallback='')=>{try{return localStorage.getItem(key)??fallback;}catch{return fallback;}};
  const bestKey=i=>`weightplay_cloudhook_best_${i}`,unlockKey='weightplay_cloudhook_stage_unlocked',equipKey='weightplay_cloudhook_equipment_v23';
  const bestTime=i=>practiceRequested?0:Math.max(0,Number(read(bestKey(i),0))||0);
  const cleared=()=>configs.reduce((n,_,i)=>n+(bestTime(i)>0?1:0),0);
  let equipment;try{equipment=JSON.parse(read(equipKey,'{}'));}catch{equipment={};}
  if(!equipment||typeof equipment!=='object')equipment={};
  const allowed=()=>['standard',...(cleared()>=5?['mastery']:[]),...(equipment.aurora===true?['aurora']:[])];
  if(!allowed().includes(equipment.selected))equipment.selected='standard';
  let locale=document.documentElement.lang||'en',currentStage=0,state=null,scene='main',modal=null,returnFocus=null;
  let practice=practiceRequested,practiceAuthorized=false,beaconModule=null,beaconCopy=null,beaconImage=null,pulseButton=null,practiceBadge=null,beaconTaught=false,localPractice=Practice,frame=null,raf=0,last=0,fxTime=0,effects=[],flights=[],axis=0,held=false,focused=true;
  let renderer={scale:1,x:0,y:0,rotated:false},statusCache='',saveMessage='',purchaseBusy=false;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const text=key=>window.WPCloudhookLocales.locales[locale]?.[key]??window.WPCloudhookLocales.locales.en[key]??key;
  const title=()=>window.WEIGHTPLAY_GAME_TITLES?.[ID]?.[locale]||'Cloudhook Courier';
  const unlocked=()=>practice?configs.length:Math.max(1,Math.min(30,Number(read(unlockKey,1))||1));
  const formatTime=n=>`${Math.max(0,n).toFixed(1)} ${locale.startsWith('zh')?'秒':'s'}`;
  function stageMeta(index=currentStage){
    if(index>=30&&beaconCopy){const c=beaconCopy[locale]||beaconCopy.en;return {arc:c[0],title:`${c[0]} ${index+1}`,objective:c[2],warning:c[5],result:c[0]};}
    let row=(locale.startsWith('zh')?R.STAGE_META_ZH:locale==='ar'?R.STAGE_META_AR:R.STAGE_META_EN)[index];
    if(locale==='zh-Hans')row=row.map(s=>window.WPCloudhookSimplify?.(s)||window.WonderI18n?.simplifyChineseText?.(s)||s);
    return Object.fromEntries(['arc','title','objective','warning','result'].map((k,i)=>[k,row[i]]));
  }
  const audio=window.WeightPlayAudio?.createScope?.(ID);
  const cues=['movement.hook','movement.release','reward.collect','feedback.success','impact.soft','result.win','result.lose','ui.click','feedback.error','shop.purchase'];
  window.WeightPlayAudio?.preload?.(cues);
  const sound=cue=>audio?audio.play(cue):window.WeightPlayAudio?.play?.(cue);
  const track=(event,extra={})=>{if(!practiceRequested&&!practice)window.WonderAnalytics?.track?.(event,{game_id:ID,game_version: GAME_VERSION,interface_version: INTERFACE_VERSION,locale,stage:currentStage+1,...extra});};
  const atlas=new Image(),background=new Image();atlas.src='/games/animal-cloudhook-courier/flight-atlas-v23.webp';background.src='/games/animal-cloudhook-courier/sky-v23.webp';
  atlas.decoding=background.decoding='async';
  const result=$('resultScreen');$('battleScreen').append(result);
  const dialog=document.createElement('section');dialog.id='flightDialog';dialog.className='flight-dialog';dialog.hidden=true;dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-labelledby','dialogTitle');
  dialog.innerHTML='<div class="dialog-card"><h2 id="dialogTitle"></h2><p id="dialogCopy"></p><div class="dialog-actions"><button id="dialogCancel" type="button"></button><button id="dialogConfirm" type="button" class="primary"></button></div></div>';
  $('app').append(dialog);result.setAttribute('role','dialog');result.setAttribute('aria-modal','true');result.setAttribute('aria-labelledby','resultTitle');
  const clearInput=()=>{axis=0;held=false;};
  const settingsOpen=()=>!!document.querySelector('.wp-frame-popover:not([hidden])');
  const active=()=>scene==='battle'&&state&&!state.done&&!modal&&!document.hidden&&focused&&!settingsOpen();
  function setScene(next){
    clearInput();effects=[];flights=[];modal=null;dialog.hidden=true;result.hidden=true;
    for(const name of ['main','stage','battle'])$(name+'Screen').hidden=name!==next;
    scene=next;document.body.dataset.screen=next;frame?.frame.activate(next);statusCache='';
    if(next==='stage'){showEquipment(false);frame?.stageUI.refresh(currentStage);frame?.syncStageInfo();}
    window.dispatchEvent(new Event('weightplay:shell-sync'));
  }
  function showEquipment(show){
    $('equipmentPanel').hidden=!show;$('stageSelector').hidden=show;
    $('stageTab').setAttribute('aria-pressed',String(!show));$('equipmentTab').setAttribute('aria-pressed',String(show));if(show)renderEquipment();
  }
  function closeDialog(){modal=null;dialog.hidden=true;clearInput();returnFocus?.focus?.({preventScroll:true});}
  function openDialog(kind){
    clearInput();returnFocus=document.activeElement;modal=kind;const leave=R.LEAVE_COPY[locale]||R.LEAVE_COPY.en;
    if(kind==='buy')$('equipmentMessage').textContent='';
    $('dialogTitle').textContent=kind==='leave'?leave.title:kind==='buy'?text('aurora'):text('help');
    $('dialogCopy').textContent=kind==='leave'?leave.body:kind==='buy'?`${text('price')} · ${text('cosmetic')}`:configs[currentStage]?.beacons?(beaconCopy?.[locale]||beaconCopy?.en)?.[2]:text('helpBody');
    $('dialogCancel').textContent=kind==='leave'?leave.continue:text('cancel');
    $('dialogConfirm').textContent=kind==='leave'?leave.leave:kind==='buy'?text('confirm'):text('start');
    dialog.hidden=false;$('dialogCancel').focus({preventScroll:true});
  }
  function persistWin(){
    if(practiceRequested||practice)return;
    try{const previous=bestTime(currentStage);if(!previous||state.time<previous)localStorage.setItem(bestKey(currentStage),String(state.time));localStorage.setItem(unlockKey,String(Math.max(unlocked(),Math.min(30,currentStage+2))));window.WonderAnalytics?.completeStage?.(currentStage+1);}
    catch{saveMessage=text('storageError');}
  }
  function showResult(){
    clearInput();if(state.success)persistWin();effects=[];flights=[];
    result.dataset.success=String(state.success);
    $('resultEyebrow').textContent=`${text('stage')} ${currentStage+1} · ${stageMeta().title}`;
    $('resultTitle').textContent=state.reason==='beaconMissing'?(beaconCopy?.[locale]||beaconCopy?.en)?.[5]:text(state.success?'delivered':state.reason);
    $('resultCopy').textContent=saveMessage||(state.success?`${text('parcels')} ${state.collected.length}/${configs[currentStage].parcelNodes.length}`:state.reason==='beaconMissing'?(beaconCopy?.[locale]||beaconCopy?.en)?.[5]:text('helpBody'));
    if(practiceRequested&&beaconCopy)$('resultCopy').textContent+=` · ${(beaconCopy[locale]||beaconCopy.en)[6]}`;
    $('resultScore').textContent=`${text('score')} ${state.score}`;$('resultTime').textContent=`${text('time')} ${formatTime(state.time)}`;
    $('resultBest').textContent=`${text('best')} ${bestTime(currentStage)?formatTime(bestTime(currentStage)):'—'}`;$('nextBtn').disabled=!state.success||currentStage>=configs.length-1;
    result.hidden=false;$('battleScreen').classList.add('result-open');frame.frame.activate('battle',{covered:true});$('retryBtn').focus({preventScroll:true});track('flight_result',{outcome:state.success?'success':'failure',parcels:state.collected.length});
  }
  async function startStage(index,source='stage_card'){
    if(practiceRequested&&(!practiceAuthorized||!localPractice||!await localPractice.validate()||!practiceAuthorized||window.__cloudhookPracticeAnalyticsSafe!==true))return false;
    if(!Number.isInteger(index)||index<0||index>=unlocked())return;
    currentStage=index;state=configs[index].beacons?beaconModule.createBeaconFlight(F,configs[index]):F.create(configs[index]);saveMessage='';$('battleScreen').classList.remove('result-open');setScene('battle');
    $('battleTitle').textContent=`${text('stage')} ${index+1}`;updateHud();track('game_start',{source});canvas.focus({preventScroll:true});if(configs[index].beacons&&!beaconTaught){beaconTaught=true;openDialog('help');}return true;
  }
  function updateHud(){
    if(!state)return;const cfg=configs[currentStage];$('scoreLabel').textContent=`${text('score')} ${state.score}`;$('timeLabel').textContent=formatTime(state.time);
    const numbers=value=>`\u2066${value}\u2069`;let objective=practiceRequested?`${text('parcels')} ${numbers(`${state.collected.length}/${cfg.parcelNodes.length}`)}`:`${text('parcels')} ${state.collected.length} / ${cfg.parcelNodes.length}`;
    if(cfg.beacons){const c=beaconCopy[locale]||beaconCopy.en;objective+=` · ${c[0]} ${numbers(`${state.beacons.filter(Boolean).length}/${cfg.beacons.length}`)}`;}
    if($('parcelObjective').textContent!==objective)$('parcelObjective').textContent=objective;
    if(pulseButton){pulseButton.hidden=!cfg.beacons;if(cfg.beacons){const c=beaconCopy[locale]||beaconCopy.en;pulseButton.querySelector('.beacon-name').textContent=c[1];pulseButton.querySelector('.beacon-count').textContent=`${state.signals}/2`;pulseButton.setAttribute('aria-label',`${c[1]} ${state.signals}/2`);pulseButton.disabled=state.phase!=='flight'||state.signals<=0||state.done;}}
    const status=text(state.reason);if(status!==statusCache){$('battleStatus').textContent=status;statusCache=status;}
    if(practiceAuthorized){practiceBadge ||= document.querySelector('[data-wp-local-practice]');if(practiceBadge){practiceBadge.style.cssText='display:inline-block;color:#ffe173;font:700 10px sans-serif;pointer-events:none;white-space:nowrap';const host=document.querySelector('.beacon-status');if(host&&practiceBadge.parentNode!==host)host.append(practiceBadge);}}
    $('tetherBtn').textContent=text(state.phase==='swing'?'release':'hold');$('tetherBtn').setAttribute('aria-pressed',String(state.phase==='swing'));$('tetherBtn').dataset.ready=String(state.reason==='releaseNow');
    Object.assign(canvas.dataset,{flightPhase:state.phase,x:state.x.toFixed(2),y:state.y.toFixed(2),time:state.time.toFixed(3),target:String(state.target),collected:String(state.collected.length)});
  }
  function project(p){const r=renderer;return r.rotated?{x:r.x+(F.H-p.y)*r.scale,y:r.y+p.x*r.scale}:{x:r.x+p.x*r.scale,y:r.y+p.y*r.scale};}
  function sprite(cell,x,y,size,angle=0,alpha=1){
    if(!atlas.complete||!atlas.naturalWidth)return;const p=project({x,y}),r=renderer.scale,cw=atlas.naturalWidth/3,ch=atlas.naturalHeight/3;
    ctx.save();ctx.globalAlpha=alpha;ctx.translate(p.x,p.y);ctx.rotate(angle);ctx.drawImage(atlas,(cell%3)*cw,Math.floor(cell/3)*ch,cw,ch,-size*r/2,-size*r/2,size*r,size*r);ctx.restore();
  }
  function path(points,color,width=2,dash=[]){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=width*renderer.scale;ctx.setLineDash(dash.map(x=>x*renderer.scale));ctx.beginPath();points.forEach((p,i)=>{const q=project(p);i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);});ctx.stroke();ctx.restore();}
  function ring(p,r,color,width=3){const q=project(p);ctx.strokeStyle=color;ctx.lineWidth=width*renderer.scale;ctx.beginPath();ctx.arc(q.x,q.y,r*renderer.scale,0,Math.PI*2);ctx.stroke();}
  function draw(){
    const box=canvas.getBoundingClientRect();if(!box.width||!box.height)return;const dpr=Math.min(devicePixelRatio||1,2);
    if(canvas.width!==Math.round(box.width*dpr)||canvas.height!==Math.round(box.height*dpr)){canvas.width=Math.round(box.width*dpr);canvas.height=Math.round(box.height*dpr);}
    ctx.setTransform(dpr,0,0,dpr,0,0);const w=box.width,h=box.height;ctx.clearRect(0,0,w,h);
    if(background.complete&&background.naturalWidth){const scale=Math.max(w/background.width,h/background.height);ctx.drawImage(background,(w-background.width*scale)/2,(h-background.height*scale)/2,background.width*scale,background.height*scale);}
    ctx.fillStyle='#061d3240';ctx.fillRect(0,0,w,h);
    const rotated=w/h>1.25,scale=Math.min(w/(rotated?F.H:F.W),h/(rotated?F.W:F.H));renderer={scale,x:(w-(rotated?F.H:F.W)*scale)/2,y:(h-(rotated?F.W:F.H)*scale)/2,rotated};
    $('nudgeLeft').textContent=rotated?'▲':'◀';$('nudgeRight').textContent=rotated?'▼':'▶';
    $('nudgeLeft').setAttribute('aria-label',text(rotated?'up':'ariaLeft'));$('nudgeRight').setAttribute('aria-label',text(rotated?'down':'ariaRight'));
    const s=state||F.create(configs[currentStage]),cfg=configs[currentStage],anchors=cfg.anchors.map((_,i)=>F.anchor(cfg,i,s.time));
    path([...anchors,F.goal(cfg,s.time)],'#d0e7ed44',3,[7,12]);for(const storm of cfg.storms)sprite(6,storm.x,storm.y,104);
    anchors.forEach((a,i)=>{sprite(3,a.x,a.y,74,0,i<s.target?.45:1);if(i===s.target&&!s.done)ring(a,46,'#92f5ffb0',3);});
    if(cfg.beacons&&beaconImage?.complete&&beaconImage.naturalWidth)cfg.beacons.forEach((beacon,i)=>{const p=project(beacon),size=74*renderer.scale;ctx.save();if(!s.beacons?.[i]){ctx.setLineDash([5*renderer.scale,4*renderer.scale]);ring(beacon,beacon.r,'#ffc5f4',3);ctx.setLineDash([]);}ctx.globalAlpha=s.beacons?.[i] ? .45 : 1;ctx.drawImage(beaconImage,p.x-size/2,p.y-size/2,size,size);ctx.globalAlpha=1;ctx.fillStyle='#fff';ctx.font=`bold ${Math.max(12,24*renderer.scale)}px system-ui`;ctx.fillText(s.beacons?.[i]?'✓':String(i+1),p.x+size*.3,p.y-size*.3);ctx.restore();});
    cfg.parcelNodes.forEach((node,i)=>{if(s.collected.includes(i))return;const a=F.anchor(cfg,node,s.time);sprite(4,a.x,a.y+108,58,0,cfg.ordered&&i!==s.collected.length?.45:1);if(cfg.ordered){const p=project({x:a.x+38,y:a.y+108});ctx.fillStyle='#fff1b0';ctx.font=`bold ${Math.max(11,22*scale)}px system-ui`;ctx.fillText(String(i+1),p.x,p.y);}});
    const goal=F.goal(cfg,s.time);sprite(5,goal.x,goal.y,112);if(s.collected.length===cfg.parcelNodes.length)ring(goal,65,'#ffdb83',3);
    const color={standard:'#ffdc84',mastery:'#75f4f7',aurora:'#d3a0ff'}[equipment.selected]||'#ffdc84';
    if(s.phase==='swing'){path([F.anchor(cfg,s.node,s.time),s],color,6);if(s.held>=.58)ring(F.anchor(cfg,s.node,s.time),51,'#a7ffcc',5);const v=F.launch(s,cfg),points=[];for(let t=0;t<.82;t+=.085)points.push({x:s.x+v.vx*t,y:s.y+v.vy*t+.5*F.GRAVITY*t*t});path(points,'#f8e8bcb0',4,[3,10]);}
    if(s.phase==='flight'&&!reduced.matches){s.trail.forEach((p,i)=>{const q=project(p);ctx.fillStyle=color;ctx.globalAlpha=i/s.trail.length*.36;ctx.fillRect(q.x-2,q.y-2,4,4);});ctx.globalAlpha=1;}
    sprite(s.done&&s.success?2:s.phase==='ready'?0:1,s.x,s.y,116,reduced.matches?0:(s.phase==='flight'?Math.max(-.25,Math.min(.25,s.vx/1000)):Math.sin(s.held*3.5)*.08));
    effects=effects.filter(e=>fxTime-e.start<e.duration);effects.forEach(e=>{const t=(fxTime-e.start)/e.duration;sprite(8,e.x,e.y,44+70*t,0,1-t);});
    const target=$('parcelObjective').getBoundingClientRect();flights=flights.filter(e=>fxTime-e.start<.42);
    for(const e of flights){const t=(fxTime-e.start)/.42,ease=1-(1-t)**3,start=project(e);const x=start.x+(target.left+target.width/2-box.left-start.x)*ease,y=start.y+(target.top+target.height/2-box.top-start.y)*ease-40*Math.sin(t*Math.PI),cw=atlas.naturalWidth/3;ctx.drawImage(atlas,cw,cw,cw,cw,x-12,y-12,24,24);}
  }
  function handleEvents(){for(const e of state.events){
    const cue={hook:'movement.hook',release:'movement.release',charged:'feedback.success',parcel:'reward.collect',beacon:'feedback.success',signalMiss:'feedback.error',win:'result.win',lose:'result.lose'}[e.type];if(cue)sound(cue);
    if(!reduced.matches&&['hook','release','parcel','charged','win'].includes(e.type))effects.push({...e,start:fxTime,duration:e.type==='win'?.65:.24});
    if(e.type==='parcel'&&!reduced.matches)flights.push({...e,start:fxTime});if(e.type==='win'||e.type==='lose')showResult();
  }state.events=[];}
  function tether(down){if(!active())return;held=down;if(down)F.hook(state,configs[currentStage]);else F.release(state,configs[currentStage]);handleEvents();updateHud();}
  function signal(){if(!active()||!configs[currentStage].beacons)return;const result=beaconModule.signalBeacon(F,state,configs[currentStage],axis);if(result.used){const c=beaconCopy[locale]||beaconCopy.en;state.reason=result.activated?'beacon':'signalMiss';$('battleStatus').textContent=c[result.activated?3:4];statusCache=state.reason;handleEvents();updateHud();}}
  function tick(now){const dt=Math.min(.032,(now-last)/1000||0);last=now;if(active()){fxTime+=dt;if(configs[currentStage].beacons)beaconModule.stepBeaconFlight(F,state,configs[currentStage],dt,{axis,hold:held});else F.step(state,configs[currentStage],dt,{axis,hold:held});if(state.phase==='flight'&&!reduced.matches){state.trail.push({x:state.x,y:state.y});if(state.trail.length>16)state.trail.shift();}handleEvents();updateHud();}if(scene==='battle')draw();raf=requestAnimationFrame(tick);}
  function renderEquipment(){
    $('equipmentTitle').textContent=text('equipment');$('equipmentNote').textContent=text('cosmetic');let balance=0;try{balance=window.WeightPlayWallet.read().diamonds;}catch{}$('walletBalance').textContent=String(balance);$('equipmentCards').replaceChildren();
    for(const id of ['standard','mastery','aurora']){
      const card=document.createElement('article');card.className='equipment-card';const owned=allowed().includes(id);
      const art=document.createElement('div');art.className='spool-art spool-'+id;art.setAttribute('role','img');art.setAttribute('aria-label',text(id));
      const name=document.createElement('h3');name.textContent=text(id);const description=document.createElement('p');description.textContent=id==='mastery'&&!owned?`${text('lockedSpool')} (${cleared()}/5)`:id==='aurora'&&!owned?text('price'):text('cosmetic');
      const button=document.createElement('button');button.type='button';button.textContent=equipment.selected===id?text('equipped'):owned?text('equip'):id==='mastery'?text('stageLocked'):text('buy');button.disabled=equipment.selected===id||id==='mastery'&&!owned||practice;
      button.addEventListener('click',()=>{if(!owned){openDialog('buy');return;}saveEquipment({...equipment,selected:id});});card.append(art,name,description,button);$('equipmentCards').append(card);
    }
  }
  function saveEquipment(next){try{localStorage.setItem(equipKey,JSON.stringify(next));equipment=next;$('equipmentMessage').textContent=text('saved');sound('ui.click');renderEquipment();}catch{$('equipmentMessage').textContent=text('storageError');}}
  async function purchase(){
    if(practice||purchaseBusy||equipment.aurora)return;purchaseBusy=true;
    const commit=()=>{
    const walletAction = () => {const previous=read(equipKey,'{}');let fresh={};try{fresh=JSON.parse(previous)||{};}catch{}if(fresh.aurora){equipment=fresh;return;}
      const wallet=window.WeightPlayWallet,before=wallet.read();if(before.diamonds<12){$('equipmentMessage').textContent=text('noFunds');sound('feedback.error');return;}
      let charged=false;try{if(!wallet.spendDiamonds(12))return;charged=true;const next={...fresh,aurora:true,selected:'aurora'};localStorage.setItem(equipKey,JSON.stringify(next));equipment=next;$('equipmentMessage').textContent=text('saved');sound('shop.purchase');}
      catch{if(charged)try{wallet.save(before);}catch{}$('equipmentMessage').textContent=text('storageError');}
    
    };
    return window.WeightPlayWallet?.withTransaction ? window.WeightPlayWallet.withTransaction("animal-cloudhook-courier:game.js:commit", walletAction) : walletAction();
};
    try{if(navigator.locks)await navigator.locks.request('weightplay-wallet-purchase',commit);else commit();}finally{purchaseBusy=false;renderEquipment();}
  }
  function refresh(){
    locale=document.documentElement.lang||'en';if(!window.WPCloudhookLocales.locales[locale])locale='en';$('localeSelect').value=locale;document.title=`${title()} | WeightPlay`;document.documentElement.dir=locale==='ar'?'rtl':'ltr';
    for(const [id,key] of [['eyebrow','eyebrow'],['coming','coming'],['tagline','hint'],['objective','objective'],['startBtn','start'],['stageTitle','stages'],['stageTab','stage'],['equipmentTab','equipment'],['nextBtn','next'],['retryBtn','retry'],['resultStagesBtn','stages'],['restartBtn','retry'],['helpBtn','help']])$(id).textContent=text(key);
    $('title').textContent=title();$('controlHint').textContent=text('helpBody');$('mainProgress').textContent=practiceAuthorized?(beaconCopy[locale]||beaconCopy.en)[6]:`${text('stages')} ${cleared()} / 30`;
    document.querySelector('.brand-back')?.setAttribute('aria-label',text('backLobby'));$('localeSelect').setAttribute('aria-label',text('language'));
    canvas.setAttribute('aria-label',title());$('nudgeLeft').setAttribute('aria-label',text('ariaLeft'));$('nudgeRight').setAttribute('aria-label',text('ariaRight'));$('stageBack').setAttribute('aria-label',text('backMain'));$('battleBack').setAttribute('aria-label',text('backStages'));
    frame?.stageUI.refresh(currentStage);frame?.syncStageInfo();if(state)updateHud();if(!$('equipmentPanel').hidden)renderEquipment();
  }
  for(const code of window.WPCloudhookLocales.order){const option=document.createElement('option');option.value=code;option.textContent=code;$('localeSelect').append(option);}
  const stageBridge={text,unlocked,get count(){return configs.length},practiceText:()=>practiceAuthorized?(beaconCopy[locale]||beaconCopy.en)[6]:'',getSelectedStage:()=>currentStage,selectStage:i=>{currentStage=i;},startStage,stageMeta,bestTime,formatTime};
  if(practiceRequested)$('localeSelect').disabled=true;
  frame=window.mountAnimalCloudhookCourierFrame(stageBridge);
  on($('startBtn'),'click',()=>{if(practiceRequested&&!practiceAuthorized)return;refresh();setScene('stage');});on($('stageBack'),'click',()=>{setScene('main');refresh();});on($('stageTab'),'click',()=>showEquipment(false));on($('equipmentTab'),'click',()=>showEquipment(true));
  on($('battleBack'),'click',()=>state?.done?setScene('stage'):openDialog('leave'));on($('restartBtn'),'click',()=>startStage(currentStage,'retry'));on($('retryBtn'),'click',()=>startStage(currentStage,'retry'));
  on($('nextBtn'),'click',()=>{if(state?.success)startStage(currentStage+1,'next');});on($('resultStagesBtn'),'click',()=>setScene('stage'));on($('helpBtn'),'click',()=>openDialog('help'));on($('dialogCancel'),'click',closeDialog);
  on($('dialogConfirm'),'click',()=>{const kind=modal;closeDialog();if(kind==='leave')setScene('stage');else if(kind==='buy')void purchase();});
  if(practiceRequested){document.body.dataset.beaconPractice='true';const statusGroup=document.createElement('div');statusGroup.className='beacon-status';$('battleStatus').before(statusGroup);statusGroup.append($('battleStatus'),$('parcelObjective'));pulseButton=document.createElement('button');pulseButton.type='button';pulseButton.className='beacon-pulse';pulseButton.hidden=true;const icon=document.createElement('img');icon.src='/games/animal-cloudhook-courier/beacon-relay-v1.png';icon.alt='';const label=document.createElement('span');label.className='beacon-name';const count=document.createElement('b');count.className='beacon-count';count.dir='ltr';pulseButton.append(icon,label,count);on(pulseButton,'click',signal);document.querySelector('.flight-utilities').append(pulseButton);}
  for(const [id,kind] of [['tetherBtn',0],['nudgeLeft',-1],['nudgeRight',1]]){
    const button=$(id);on(button,'pointerdown',e=>{if(!active())return;e.preventDefault();button.setPointerCapture(e.pointerId);if(kind)axis=kind;else tether(true);});on(button,'pointerup',e=>{e.preventDefault();if(kind)axis=0;else tether(false);});
    on(button,'pointercancel',()=>{clearInput();if(active())openDialog('leave');});on(button,'click',e=>{if(e.detail!==0||!active())return;if(!kind)tether(state.phase!=='swing');});
  }
  on(document,'keydown',e=>{
    const panel=modal?dialog:!result.hidden?result:null;
    if(panel){if(e.key==='Tab'){const buttons=[...panel.querySelectorAll('button:not(:disabled)')],first=buttons[0],lastButton=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();lastButton.focus();}else if(!e.shiftKey&&document.activeElement===lastButton){e.preventDefault();first.focus();}}if(e.key==='Escape'&&modal){e.preventDefault();closeDialog();}return;}
    if(!active()||e.target.closest('select,input,textarea,.wp-frame-popover'))return;if(['Space','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyR','KeyE','Escape'].includes(e.code))e.preventDefault();if(e.repeat)return;
    if(e.code==='Space')tether(true);if(e.code==='KeyE')signal();if(e.code==='ArrowLeft'||renderer.rotated&&e.code==='ArrowUp')axis=-1;if(e.code==='ArrowRight'||renderer.rotated&&e.code==='ArrowDown')axis=1;if(e.code==='KeyR')void startStage(currentStage,'retry');if(e.code==='Escape')openDialog('leave');
  });
  on(document,'keyup',e=>{if(e.code==='Space'){e.preventDefault();if(held)tether(false);}if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code))axis=0;});on(window,'blur',()=>{focused=false;clearInput();});on(window,'focus',()=>{focused=true;last=performance.now();});on(document,'visibilitychange',()=>{clearInput();last=performance.now();});
  on(window,'weightplay:interaction-state',()=>{if(settingsOpen())clearInput();last=performance.now();});on($('localeSelect'),'change',()=>{window.WonderI18n?.setLocale?.($('localeSelect').value);});on(window,'wonder:locale-change',refresh);
  on(window,'pagehide',e=>{if(e.persisted){clearInput();return;}cancelAnimationFrame(raf);abort.abort();effects=[];flights=[];audio?.dispose?.();});
  refresh();setScene('main');raf=requestAnimationFrame(tick);
  // Own readiness for the actual entry images, including direct practice entry.
  // The shared frame supplies the only loading renderer and its recovery UI.
  try{
    if(!window.WeightPlayGameEntryLoader?.begin){
      const script=document.querySelector('script[src*="/game-entry-loader.js"]');
      if(!script)throw Error('Shared entry loader unavailable');
      await new Promise((resolve,reject)=>{script.addEventListener('load',resolve,{once:true,signal:abort.signal});script.addEventListener('error',reject,{once:true,signal:abort.signal});});
    }
    const loader=window.WeightPlayGameEntryLoader,required=[atlas,background,document.querySelector('[data-wp-frame-poster] img')].filter(Boolean);let loaded=0;
    loader.begin(required.length);
    await Promise.all(required.map(async image=>{await image.decode();loader.assetProgress(++loaded,required.length);}));
    $('startBtn').disabled=practiceRequested;await new Promise(requestAnimationFrame);loader.ready();
  }catch{window.WeightPlayGameEntryLoader?.fail?.();return;}
  if(practiceRequested){
    try{
      const [routes,module,copy]=await Promise.all([import('./beacon-routes.mjs?v=20261027-beacon1'),import('./beacon-flight.mjs?v=20261027-beacon1'),import('./beacon-copy.mjs?v=20261027-beacon1')]);
      beaconModule=module;beaconCopy=copy.BEACON_COPY;beaconImage=new Image();beaconImage.src='/games/animal-cloudhook-courier/beacon-relay-v1.png';await beaconImage.decode();
      if(window.__cloudhookPracticeAnalyticsSafe!==true)throw Error('PRACTICE_ANALYTICS_GUARD_UNAVAILABLE');
      window.__CLOUDHOOK_BEACON_PRACTICE_SNAPSHOT__=()=>practiceAuthorized&&state?{stage:currentStage+1,phase:state.phase,time:state.time,node:state.node,flight:state.flight,held:state.held,x:state.x,y:state.y,signals:state.signals,beacons:state.beacons,collected:state.collected.length,done:state.done,success:state.success,targets:configs[currentStage].beacons}:null;
      const registered=await localPractice.register({gameId:ID,stageIds:Array.from({length:60},(_,i)=>String(i+1)),enable:value=>{
        practiceAuthorized=value===true&&window.__cloudhookPracticeAnalyticsSafe===true;
        if(practiceAuthorized){if(configs.length===30)configs.push(...routes.BEACON_ROUTES);}
        else{configs.splice(30);currentStage=0;state=null;beaconTaught=false;practiceBadge?.remove();practiceBadge=null;document.querySelector('[data-wp-local-practice]')?.remove();setScene('main');}
        $('startBtn').disabled=!practiceAuthorized;frame.stageUI.setConfig(window.createCloudhookCourierStageConfig(stageBridge),currentStage);refresh();
      },startStage:id=>startStage(Number(id)-1,'practice')});
      if(!registered&&!practiceAuthorized)$('startBtn').disabled=true;
    }catch{$('startBtn').disabled=true;}
  }
})();
