import {resolveLocale,translate,guideExtras} from './i18n.mjs';
import {LocalPractice} from '../../src/game-local-practice.mjs';
import {STAGES} from './stage-config.mjs';
import {createRace,advance,step,segmentFor,useFeather,bridgeOpen,rhythmRange} from './simulation.mjs';
import {createStore,highestUnlocked} from './save.mjs';
import {createRenderer} from './render.mjs';

const W=window, $=id=>document.getElementById(id), store=createStore();
const labels={plain:'plain',slow:'slow',fast:'fast',headfast:'headfast',headwind:'headwind',tailwind:'tailwind',left:'gateLeft',right:'gateRight',bridge:'bridge',fork:'chooseEither',forkleft:'chooseLeft',forkright:'chooseRight',forkwindbridge:'windBridge',forkgates:'chooseGate',forkfast:'chooseLeft',forkslow:'chooseRight',forkmaster:'bridgeGate'};
const goals={finish:'goalFinish',steady3:'goalSteady',balance40:'goalBalance40',combo4:'goalCombo','steady-no-stumble':'goalNoStumble',balance35:'goalBalance35',balance30:'goalBalance30',stumble2:'goalStumbles',gates:'goalGates'};
const feedback={steady:'good',timing:'timingAdjust','same-foot':'alternate','bridge-closed':'bridgeWait','gate-missed':'reasonGate',stumble:'stumble',feather:'featherUsed'};
let locale=resolveLocale();const tr=(key,vars)=>translate(locale,key,vars);
function localize(){
  document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';
  for(const node of document.querySelectorAll('[data-t]'))node.textContent=tr(node.dataset.t);
  for(const node of document.querySelectorAll('[data-t-aria]'))node.setAttribute('aria-label',tr(node.dataset.tAria));
  for(const node of document.querySelectorAll('[data-t-alt]'))node.setAttribute('alt',tr(node.dataset.tAlt));
  const extras=guideExtras(locale);$('gameGuideFaq').innerHTML=extras.faqHtml;$('gameGuideRelated').innerHTML=extras.relatedHtml;$('gameGuide').dataset.wpGuideLocale=locale;$('gameGuide').setAttribute('aria-label',tr('guideTitle'));
  document.querySelector('meta[name=description]')?.setAttribute('content',tr('summary'));
  $('shoeStatus').textContent=shoeStatusKey?tr(shoeStatusKey):'';$('shopStatus').textContent=shopStatusKey?tr(shopStatusKey):'';
  if(modal==='resultPanel'&&!practiceRun)$('saveStatus').textContent=saved?tr('progressSaved'):pending&&!pending.busy?tr('saveFailed'):'';
  const title=W.WEIGHTPLAY_GAME_TITLES?.['lantern-stride']?.[locale];if(title){for(const node of document.querySelectorAll('[data-wp-game-title]'))node.textContent=title;document.title=`${title} | WeightPlay`;}
  $('mainProgress').textContent=tr('stage',{n:`\u2066${highestUnlocked(store.progress)} / 60\u2069`});
  if(screen==='stage'){rail?.setConfig(config(),selected-1);rail?.refresh(selected-1);if(tab!=='stages')renderManagement();}
  if(race){update();if(race.status==='finished')renderResult();}
}
const SKU='lantern-stride:star-trail';
let frame,rail,renderer=null,race=null,screen='main',tab='stages',modal=null,previousFocus=null,practice=false,practiceRun=false,startSerial=0,purchaseSerial=0,purchaseBusy=false,shoeStatusKey=null,shopStatusKey=null,selected=highestUnlocked(store.progress),raf=0,last=0,saved=false,pending=null;
const audio=id=>W.WeightPlayAudio?.play(id);
const settingsOpen=()=>!!document.querySelector('#wp-frame-battle-settings:not([hidden])');
const config=()=>({gameId:'lantern-stride',count:STAGES.length,poster:'/games/lantern-stride/assets/cover.webp',background:'/assets/lobby-block-atmosphere.svg',stage:index=>{
  const s=STAGES[index],r=store.progress.records[s.id],locked=!practice&&s.id>highestUnlocked(store.progress);
  return {id:s.id,kicker:tr('chapter',{n:s.chapter}),title:tr('stage',{n:s.id}),subtitle:tr(s.checkpoint?'festival':'forest'),status:locked?tr('locked'):r?tr('stars',{n:r.stars}):tr('ready'),locked,cleared:!!r,rewardState:r?'collected':'not-collected',summary:tr(s.id===55?'goalChosen':goals[s.objective]),details:[`${s.distance} m · ${s.limit} s`,s.route.map(x=>tr(labels[x])).join(' → '),tr('starGoals',{n:s.limit*.8})],poster:'/games/lantern-stride/assets/cover.webp'};
}});
function setModalInert(area,value){
  if(area==='battle'){ $('battleLive').inert=value;$('battleScreen').querySelector('header').inert=value; }
  if(area==='stage'){ $('stageContent').inert=value;$('stageScreen').querySelector('header').inert=value;if(frame?.commonDownButton?.element)frame.commonDownButton.element.inert=value; }
}
function activate(next){
  setModalInert(screen,false);
  if(next!=='battle')++startSerial;if(next!=='stage')++purchaseSerial;
  cancelAnimationFrame(raf);raf=0;last=0;if(modal){$(modal).hidden=true;modal=null;}
  if(next!=='battle'){renderer?.dispose();renderer=null;race=null;}
  screen=next;document.body.dataset.screen=next;
  $('mainGroup').hidden=next!=='main';$('mainScreen').hidden=next!=='main';$('stageScreen').hidden=next!=='stage';$('battleScreen').hidden=next!=='battle';
  frame.activate(next);
  if(next==='stage'){setTab('stages');rail.setConfig(config(),selected-1);rail.refresh(selected-1);}
  $('mainProgress').textContent=tr('stage',{n:`\u2066${highestUnlocked(store.progress)} / 60\u2069`});
}
function openModal(id){if(screen!=='stage'&&!race)return;if(!modal)previousFocus=document.activeElement;modal=id;$(id).hidden=false;setModalInert(screen,true);cancelAnimationFrame(raf);raf=0;last=0;$(id).querySelector('button')?.focus();}
function closeModal(){if(!modal)return;$(modal).hidden=true;modal=null;setModalInert(screen,false);last=0;const target=previousFocus;previousFocus=null;if(target?.isConnected&&target.getClientRects().length&&!target.disabled)target.focus({preventScroll:true});else if(race?.status==='running')$('leftBtn').focus({preventScroll:true});if(race?.status==='running'&&!document.hidden)schedule();}
function setTab(name){
  rail?.cancel();tab=name;
  for(const id of ['shoes','stages','collection']){const active=id===name,panel=$(id+'Panel');panel.hidden=!active;panel.classList.toggle('hidden',!active);panel.inert=!active;panel.setAttribute('aria-hidden',String(!active));$(id+'Tab').setAttribute('aria-selected',String(active));$(id+'Tab').tabIndex=active?0:-1;}
  if(name==='stages')rail?.refresh(selected-1);else renderManagement();
}
function renderManagement(){
  const entries=[['balanced','balanced','balancedEffect',0],['steady','steady','steadyEffect',5],['swift','swift','swiftEffect',15]];
  $('shoeCards').replaceChildren(...entries.map(([id,name,effect,required],index)=>{
    const card=document.createElement('article'), art=document.createElement('div'), title=document.createElement('h3'), text=document.createElement('p'),button=document.createElement('button');
    card.className='item-card';art.className='item-art';art.style.setProperty('--ix',`${index*50}%`);art.style.setProperty('--iy','0%');art.setAttribute('role','img');art.setAttribute('aria-label',tr(name));
    title.textContent=tr(name);text.textContent=tr(effect);const unlocked=!required||!!store.progress.records[required];
    button.type='button';button.disabled=!unlocked||practice;button.textContent=!unlocked?tr('clearStage',{n:required}):tr(store.progress.equippedShoe===id?'inUse':'equip');
    button.addEventListener('click',async()=>{if(practice)return;const result=await store.equip(id);shoeStatusKey=result.ok?'shoeSaved':'saveSelectionFailed';$('shoeStatus').textContent=tr(shoeStatusKey);renderManagement();});card.append(art,title,text,button);return card;
  }));
  const wallet=W.WeightPlayWallet?.read(),owned=W.WeightPlayWallet?.owns(SKU)===true;
  $('walletBalance').textContent=wallet?.available?String(wallet.diamonds):'—';$('trailBtn').textContent=owned?tr(store.progress.equippedTrail==='star'?'inUse':'equip'):tr('buy');$('trailBtn').disabled=practice||!wallet?.available;$('defaultTrail').disabled=practice;
}
function schedule(){if(!raf&&screen==='battle'&&race?.status==='running'&&!modal&&!document.hidden&&!settingsOpen())raf=requestAnimationFrame(tick);}
function update(){
  if(!race)return;const part=segmentFor(race);
  $('distance').textContent=`\u2066${Math.floor(race.distance)} / ${race.stage.distance} m\u2069`;
  $('balance').textContent=`${Math.round(race.balance)}%`;
  $('time').textContent=`${Math.max(0,race.stage.limit-race.elapsed).toFixed(1)} s`;
  const bridge=part.rule==='bridge'?` · ${tr(bridgeOpen(race)?'go':'wait')}`:'';
  const extras=[part.pace,part.wind].filter(Boolean).map(value=>tr(labels[value])).join(' · ');
  $('routeCue').textContent=`${tr(race.stage.id===55?'goalChosen':goals[race.stage.objective])} · ${extras?extras+' · ':''}${tr(labels[part.choice?part.rule:part.original]||'plain')}${bridge}`;
  const elapsed=race.lastStep===null?null:race.elapsed-race.lastStep;const [min,max]=rhythmRange(part.pace||part.rule);
  const timing=part.rule==='bridge'&&!bridgeOpen(race)?'wait':elapsed===null?'ready':elapsed<min?'wait':elapsed<=max||part.rule==='bridge'?'stepNow':'late';
  $('rhythmCue').textContent=`${tr(race.lastFoot==='left'?'rightFoot':race.lastFoot==='right'?'leftFoot':'either')} · ${tr(timing)}`;
  $('rhythmCue').dataset.timing=timing==='stepNow'?'ready':timing==='late'?'late':'wait';
  $('feedback').textContent=race.elapsed<race.feedbackUntil&&feedback[race.lastFeedback]?tr(feedback[race.lastFeedback])+(race.lastFeedback==='steady'&&race.combo>=3?` ×${race.combo}`:''):'';
  $('featherBtn').disabled=race.feather<=0||part.rule!=='bridge';
}
function tick(now){raf=0;if(screen!=='battle'||!race||modal||document.hidden||settingsOpen())return;const dt=last?Math.min(.05,(now-last)/1000):0;last=now;advance(race,dt);renderer.draw(race,matchMedia('(prefers-reduced-motion: reduce)').matches);update();if(race.status==='finished')void finish();else schedule();}
function action(foot){if(screen!=='battle'||!race||modal||document.hidden||settingsOpen())return;const out=step(race,foot);if(out.accepted)audio(out.clean?'movement.step':'feedback.error');update();}
async function persist(){if(!pending||pending.busy)return;const item=pending;item.busy=true;$('resultStages').disabled=true;$('resultReplay').disabled=true;const result=await store.complete(item.id,item.outcome);item.busy=false;if(result.ok){W.WonderAnalytics?.completeStage?.(`stage-${item.id}`);if(pending===item)pending=null;}if(item.owner!==race||screen!=='battle'||modal!=='resultPanel')return;$('resultStages').disabled=false;$('resultReplay').disabled=false;saved=result.ok;$('saveStatus').textContent=tr(saved?'progressSaved':'saveFailed');$('retrySave').hidden=saved;$('resultNext').disabled=!saved||item.id>=60;}
function renderResult(){if(!race?.result)return;const r=race.result;$('resultArt').hidden=!r.won;$('resultStarGuide').textContent=tr('starGoals',{n:race.stage.limit*.8});$('resultStars').textContent=r.won?'★'.repeat(r.stars)+'☆'.repeat(3-r.stars):'';$('resultTitle').textContent=tr(r.won?'complete':'tryAgain');const reason=r.reason==='timeout'?'reasonTimeout':r.reason==='missed-gate'?'reasonGate':r.reason==='finish'?'reasonFinish':'reasonObjective';$('resultDetails').textContent=`${r.elapsed.toFixed(1)} s · ${tr('stars',{n:r.stars})} · ${tr(reason)}`;}
async function finish(){
  audio(race.result.won?'result.win':'result.lose');saved=practiceRun&&race.result.won;pending=race.result.won&&!practiceRun?{id:selected,owner:race,outcome:{...race.result},busy:false}:null;
  renderResult();
  $('saveStatus').textContent=practiceRun?'LOCAL PRACTICE · no progress or rewards saved':'';$('resultStages').disabled=false;$('resultReplay').disabled=false;$('retrySave').hidden=true;$('resultNext').disabled=!saved||selected>=60;openModal('resultPanel');
  if(pending)await persist();
}
async function startStage(id,{asPractice=practice}={}){
  const serial=++startSerial;
  if(id<1||id>60)return;
  if(asPractice){if(!await LocalPractice.validate()||serial!==startSerial)return;}else if(id>highestUnlocked(store.progress))return;
  practiceRun=asPractice;
  selected=id;activate('battle');renderer?.dispose();renderer=null;race=createRace(id,store.progress.equippedShoe);pending=null;saved=false;
  try{renderer=createRenderer($('arena'),()=>{if(screen==='battle'&&race?.status==='running')openModal('graphicsPanel');});renderer.setTrail(store.progress.equippedTrail==='star'&&W.WeightPlayWallet?.owns(SKU)===true);renderer.draw(race);update();if(!practiceRun)W.WonderAnalytics?.track?.('stage_start',{stage_id:`stage-${id}`});audio('game.start');if(!practiceRun&&id===1&&!store.progress.tutorialComplete)openModal('helpPanel');else schedule();}
  catch(error){console.error('Renderer could not start',error);openModal('graphicsPanel');}
}
function toStages(){++startSerial;selected=Math.min(60,highestUnlocked(store.progress));activate('stage');}
function bind(){
  $('startBtn').addEventListener('click',()=>{audio('ui.click');selected=highestUnlocked(store.progress);activate('stage');});
  for(const name of ['shoes','stages','collection'])$(name+'Tab').addEventListener('click',()=>setTab(name));
  $('trailBtn').addEventListener('click',async()=>{if(practice)return;if(W.WeightPlayWallet?.owns(SKU)){const result=await store.equipTrail('star',true);shopStatusKey=result.ok?'appearanceSaved':'saveSelectionFailed';$('shopStatus').textContent=tr(shopStatusKey);renderManagement();}else openModal('buyPanel');});
  $('defaultTrail').addEventListener('click',async()=>{if(practice)return;const result=await store.equipTrail('default',true);shopStatusKey=result.ok?'appearanceSaved':'saveSelectionFailed';$('shopStatus').textContent=tr(shopStatusKey);renderManagement();});
  $('cancelBuy').addEventListener('click',()=>{if(!purchaseBusy)closeModal();});$('confirmBuy').addEventListener('click',async()=>{
    if(practice||purchaseBusy)return;purchaseBusy=true;const serial=++purchaseSerial,button=$('confirmBuy'),cancel=$('cancelBuy');button.disabled=true;cancel.disabled=true;
    let result;try{result=await W.WeightPlayWallet?.purchasePermanent(SKU,10)||{ok:false,reason:'unavailable'};}catch{result={ok:false,reason:'unavailable'};}
    finally{purchaseBusy=false;button.disabled=false;cancel.disabled=false;}
    if(serial!==purchaseSerial||screen!=='stage')return;if(modal==='buyPanel')closeModal();
    if(result.ok&&W.WeightPlayWallet?.owns(SKU)){const savedTrail=await store.equipTrail('star',true);if(serial!==purchaseSerial||screen!=='stage')return;shopStatusKey=savedTrail.ok?(result.alreadyOwned?'appearanceSaved':'purchased'):'purchasedRetry';$('shopStatus').textContent=tr(shopStatusKey);if(!result.alreadyOwned)audio('shop.purchase');}
    else{shopStatusKey=result.reason==='insufficient'?'insufficient':'purchaseUnavailable';$('shopStatus').textContent=tr(shopStatusKey);audio('feedback.error');}renderManagement();
  });
  $('stageBack').addEventListener('click',()=>activate('main'));$('battleBack').addEventListener('click',()=>openModal('leavePanel'));
  $('helpBtn').addEventListener('click',()=>openModal('helpPanel'));$('helpClose').addEventListener('click',async()=>{if(!practiceRun&&!store.progress.tutorialComplete)await store.completeTutorial();closeModal();});
  $('graphicsRetry').addEventListener('click',()=>startStage(selected,{asPractice:practiceRun}));$('graphicsStages').addEventListener('click',toStages);
  $('continueBtn').addEventListener('click',closeModal);$('leaveBtn').addEventListener('click',toStages);
  $('resultStages').addEventListener('click',toStages);$('resultReplay').addEventListener('click',()=>startStage(selected,{asPractice:practiceRun}));$('resultNext').addEventListener('click',()=>{if(saved)startStage(selected+1,{asPractice:practiceRun});});$('retrySave').addEventListener('click',()=>void persist());
  for(const [id,foot] of [['leftBtn','left'],['rightBtn','right']])$(id).addEventListener('click',()=>action(foot));
  $('featherBtn').addEventListener('click',()=>{if(screen==='battle'&&!modal&&!document.hidden&&!settingsOpen()&&race&&useFeather(race)){audio('feedback.success');update();}});
  document.addEventListener('keydown',e=>{if(modal){if(e.key==='Escape'&&['leavePanel','helpPanel','buyPanel'].includes(modal)&&!(modal==='buyPanel'&&purchaseBusy)){e.preventDefault();closeModal();return;}if(e.key==='Tab'){const buttons=[...$(modal).querySelectorAll('button:not([disabled])')].filter(node=>node.getClientRects().length);if(buttons.length){const i=buttons.indexOf(document.activeElement);if(e.shiftKey&&(i<=0)){e.preventDefault();buttons.at(-1).focus();}else if(!e.shiftKey&&(i<0||i===buttons.length-1)){e.preventDefault();buttons[0].focus();}}}return;}if(screen!=='battle'||e.repeat)return;if(e.code==='ArrowLeft'||e.code==='KeyA'){e.preventDefault();action('left');}else if(e.code==='ArrowRight'||e.code==='KeyD'){e.preventDefault();action('right');}else if(e.code==='Escape'){e.preventDefault();openModal('leavePanel');}});
  W.addEventListener('blur',()=>{if(screen==='battle'&&race?.status==='running'&&!modal)openModal('leavePanel');});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&screen==='battle'&&race?.status==='running'&&!modal)openModal('leavePanel');});
  W.addEventListener('weightplay:interaction-state',()=>{if(settingsOpen()){cancelAnimationFrame(raf);raf=0;last=0;}else{last=0;schedule();}});
  W.addEventListener('wonder:locale-change',()=>{locale=resolveLocale({pathname:'',search:'',storage:null,documentLanguage:W.WonderI18n?.actualLocale?.()||document.documentElement.lang});localize();});
  W.addEventListener('resize',()=>renderer?.resize());W.addEventListener('storage',()=>{store.refresh();if(screen==='stage')rail.refresh(selected-1);});
  W.addEventListener('pagehide',()=>{++startSerial;++purchaseSerial;cancelAnimationFrame(raf);renderer?.dispose();renderer=null;});
}
async function boot(){
  if(W.WonderI18n?.actualLocale?.()!==locale)W.WonderI18n?.setLocale(locale,{navigate:false});
  if(!W.WeightPlayScreenFrame||!W.WeightPlayPlayUI)throw new Error('SHARED_RUNTIME_MISSING');
  W.WeightPlayAudio?.preload(['ui.click','game.start','movement.step','feedback.error','feedback.success','result.win','result.lose','shop.purchase']);
  W.WeightPlayGameEntryLoader?.begin(2);
  const scene=name=>({root:$(name+'Screen'),header:$(name+'Screen').querySelector('header'),content:$(name+'Content')});
  frame=W.WeightPlayScreenFrame.mount({root:$('gameFrame'),playUI:true,scenes:{main:scene('main'),stage:scene('stage'),battle:{...scene('battle'),headerInfo:$('battleInfo')}}});
  const info=W.WeightPlayScreenFrame.createGroup();for(const node of [...$('battleInfo').children])info.add(node);frame.battleTopUI.add(info);
  const tabs=W.WeightPlayScreenFrame.createGroup();for(const node of [...$('stageTabs').children])tabs.add(node);frame.commonDownButton.clear().add(tabs);frame.commonDownButton.element.setAttribute('role','tablist');$('stageTabs').hidden=true;
  rail=W.WeightPlayPlayUI.mountStage({page:$('stagesPanel'),rail:$('stageRail'),config:config(),selected:selected-1,onSelect:index=>{selected=index+1;},onStart:index=>{if(screen==='stage'&&tab==='stages')startStage(index+1);},isActive:()=>screen==='stage'&&tab==='stages'&&!modal});
  bind();activate('main');localize();const props=new Image();props.src=new URL('assets/props.webp',import.meta.url).href;await Promise.all([$('poster').decode(),props.decode()]);W.WeightPlayGameEntryLoader?.assetProgress(2,2);$('startBtn').disabled=false;W.WeightPlayGameEntryLoader?.ready();
  await LocalPractice.register({gameId:'lantern-stride',stageIds:STAGES.map(s=>s.id),enable:enabled=>{practice=enabled;renderManagement();rail.refresh(selected-1);},startStage:id=>startStage(Number(id),{asPractice:true})});
}
if(['localhost','127.0.0.1','[::1]'].includes(location.hostname))W.__lanternStrideRenderMetrics=()=>renderer?.info()||null;
boot().catch(error=>{console.error(error);W.WeightPlayGameEntryLoader?.fail?.('load');});
